"""Shared LLM invocation utilities for code review scripts."""

import json
import os
import re
import select
import signal
import shutil
import subprocess
import sys
import time


def detect_cli():
    if shutil.which("pi"):
        return "pi"
    if shutil.which("claude"):
        return "claude"
    print("Error: neither 'pi' nor 'claude' found in PATH.", file=sys.stderr)
    sys.exit(1)


def get_default_concurrency():
    cpus = os.cpu_count() or 4
    return max(2, cpus // 2)


def is_empty_output(output):
    """Detect if output is {{omit}}, empty, or just preamble with no real findings."""
    if not output or not output.strip():
        return True
    text = output.strip()
    if "{{omit}}" in text:
        return True
    has_separator = "---" in text
    has_line_ref = bool(re.search(r'[Ll]ines?\s+\d|\bLine\b.*\d', text))
    if not has_separator and not has_line_ref:
        return True
    return False


def _safe_kill(proc):
    """Kill process group, ignoring errors if already dead."""
    try:
        os.killpg(os.getpgid(proc.pid), signal.SIGKILL)
    except (ProcessLookupError, OSError):
        pass
    proc.wait()


def run_llm(cli, model, system_prompt, prompt, timeout=300, on_line=None, tools=None):
    """Run a single LLM call, optionally streaming text lines via on_line callback."""
    if cli == "pi":
        return _run_pi_rpc(model, system_prompt, prompt, timeout, on_line, tools)
    else:
        return _run_claude(model, system_prompt, prompt, timeout)


def _run_pi_rpc(model, system_prompt, prompt, timeout, on_line, tools):
    """Run pi in RPC mode for streaming events."""
    cmd = [
        "pi", "--mode", "rpc",
        "--model", model,
        "--no-extensions", "--no-skills", "--no-session",
        "--system-prompt", system_prompt,
    ]
    if tools:
        cmd.extend(["--tools", tools])

    proc = subprocess.Popen(
        cmd,
        stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
        text=True,
        start_new_session=True,
    )
    try:
        proc.stdin.write(json.dumps({"type": "prompt", "message": prompt}) + "\n")
        proc.stdin.flush()

        current_turn_text = []
        current_line = []
        deadline = time.time() + timeout

        while True:
            if time.time() > deadline:
                _safe_kill(proc)
                return (None, False, f"Timed out after {timeout}s")

            ready, _, _ = select.select([proc.stdout], [], [], 0.5)
            if not ready:
                if proc.poll() is not None:
                    break
                continue

            line = proc.stdout.readline()
            if not line:
                break

            try:
                evt = json.loads(line)
            except json.JSONDecodeError:
                continue

            evt_type = evt.get("type")
            if evt_type == "agent_end":
                proc.stdin.close()
                proc.wait()
                # Extract text from the LAST assistant message only
                messages = evt.get("messages", [])
                for msg in reversed(messages):
                    if msg.get("role") == "assistant":
                        for block in msg.get("content", []):
                            if block.get("type") == "text":
                                return (block["text"].strip(), True, None)
                        break
                return (None, False, "No text in agent_end")

            # Reset on each new assistant message (new turn)
            if evt_type == "message_start":
                msg = evt.get("message", {})
                if msg.get("role") == "assistant":
                    current_turn_text.clear()
                    current_line.clear()

            if evt_type == "message_update":
                ame = evt.get("assistantMessageEvent", {})
                if ame.get("type") == "text_delta":
                    delta = ame.get("delta", "")
                    current_turn_text.append(delta)
                    if on_line:
                        current_line.append(delta)
                        combined = "".join(current_line)
                        if "\n" in combined:
                            parts = combined.split("\n")
                            for part in parts[:-1]:
                                on_line(part)
                            current_line = [parts[-1]] if parts[-1] else []

            elif evt_type == "response" and not evt.get("success", True):
                return (None, False, evt.get("error", "RPC error"))

        # Flush remaining line
        if on_line and current_line:
            remaining = "".join(current_line).strip()
            if remaining:
                on_line(remaining)

        text = "".join(current_turn_text).strip()
        proc.wait()
        if text:
            return (text, True, None)
        stderr = proc.stderr.read().strip()
        return (None, False, stderr or f"Exit code {proc.returncode}")
    except Exception as e:
        _safe_kill(proc)
        return (None, False, str(e))


def _run_claude(model, system_prompt, prompt, timeout):
    """Run claude CLI (non-streaming fallback)."""
    cmd = [
        "claude", "-p",
        "--model", model,
        "--system-prompt", system_prompt,
        "--output-format", "text",
        prompt,
    ]
    proc = subprocess.Popen(
        cmd,
        stdout=subprocess.PIPE, stderr=subprocess.PIPE,
        text=True,
        start_new_session=True,
    )
    try:
        stdout, stderr = proc.communicate(timeout=timeout)
    except subprocess.TimeoutExpired:
        _safe_kill(proc)
        return (None, False, f"Timed out after {timeout}s")
    except Exception as e:
        _safe_kill(proc)
        return (None, False, str(e))
    if proc.returncode == 0 and stdout.strip():
        return (stdout.strip(), True, None)
    error = stderr.strip() or f"Exit code {proc.returncode}"
    return (None, False, error)
