"""Shared LLM invocation utilities for code review scripts."""

import json
import os
import re
import select
import signal
import shutil
import subprocess
import sys
import threading
import time
from pathlib import Path


# ---------------------------------------------------------------------------
# ANSI colors
# ---------------------------------------------------------------------------

class C:
    """ANSI color codes."""
    RESET = "\033[0m"
    BOLD = "\033[1m"
    DIM = "\033[2m"
    GRAY = "\033[90m"
    WHITE = "\033[97m"
    GREEN = "\033[32m"
    RED = "\033[31m"
    YELLOW = "\033[33m"
    CYAN = "\033[36m"
    BLUE = "\033[34m"
    MAGENTA = "\033[35m"


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
    """Detect if output is {{omit}} or empty."""
    if not output or not output.strip():
        return True
    return output.strip() == "{{omit}}"


DEFAULT_TIMEOUT = 600


def resolve_file_list(args_files, args_file_list):
    """Resolve file list from positional args, --file-list, or stdin.
    Returns list of filepath strings."""
    files = []
    if args_files:
        files = args_files
    elif args_file_list:
        files = [l.strip() for l in Path(args_file_list).read_text(encoding="utf-8").splitlines()
                 if l.strip() and not l.startswith("#")]
    elif not sys.stdin.isatty():
        files = [l.strip() for l in sys.stdin if l.strip()]
    return files


# ---------------------------------------------------------------------------
# Live display
# ---------------------------------------------------------------------------

class LiveDisplay:
    """Thread-safe live TUI showing last N lines per active worker."""
    MAX_LINES = 3

    def __init__(self, total, phase="Review"):
        self.total = total
        self.phase = phase
        self.lock = threading.Lock()
        self.workers = {}
        self.pending_completed = []
        self.done_count = 0
        self._last_height = 0
        self._running = True
        self._thread = threading.Thread(target=self._render_loop, daemon=True)

    def start(self):
        self._thread.start()

    def stop(self):
        self._running = False
        self._thread.join(timeout=1)
        self._clear()
        with self.lock:
            for c in self.pending_completed:
                sys.stderr.write(c + "\n")
            self.pending_completed.clear()
            sys.stderr.flush()

    def add_worker(self, worker_id, filepath):
        with self.lock:
            self.workers[worker_id] = {
                "filepath": filepath,
                "lines": [],
                "order": len(self.workers),
            }

    def feed_line(self, worker_id, line):
        with self.lock:
            w = self.workers.get(worker_id)
            if w and line:
                w["lines"].append(line)
                w["lines"] = w["lines"][-self.MAX_LINES:]

    def complete_worker(self, worker_id, status, summary=""):
        with self.lock:
            self.done_count += 1
            w = self.workers.pop(worker_id, None)
            fp = w["filepath"] if w else "?"
            self.pending_completed.append(
                f"  [{self.done_count}/{self.total}] {status} {fp}{summary}"
            )

    def _clear(self):
        if self._last_height > 0:
            sys.stderr.write(f"\033[{self._last_height}F")
            for _ in range(self._last_height):
                sys.stderr.write("\033[2K\n")
            sys.stderr.write(f"\033[{self._last_height}F")
            sys.stderr.flush()
            self._last_height = 0

    def _render_once(self):
        with self.lock:
            completed_lines = list(self.pending_completed)
            self.pending_completed.clear()
            active_lines = []
            for wid, w in sorted(self.workers.items(), key=lambda x: x[1]["order"]):
                fp = w["filepath"]
                active_lines.append(f"  {C.CYAN}\u23f3{C.RESET} {C.WHITE}{fp}{C.RESET}")
                for l in w["lines"][-self.MAX_LINES:]:
                    truncated = l[:100] + ("..." if len(l) > 100 else "")
                    active_lines.append(f"     {C.GRAY}\u2502 {truncated}{C.RESET}")

        if completed_lines:
            self._clear()
            for line in completed_lines:
                sys.stderr.write(line + "\n")
            sys.stderr.flush()
            self._last_height = 0

        self._clear()
        if active_lines:
            sys.stderr.write("\n".join(active_lines) + "\n")
            sys.stderr.flush()
            self._last_height = len(active_lines)

    def _render_loop(self):
        while self._running:
            self._render_once()
            time.sleep(0.1)
        self._render_once()


def _safe_kill(proc):
    """Kill process group, ignoring errors if already dead."""
    try:
        os.killpg(os.getpgid(proc.pid), signal.SIGKILL)
    except (ProcessLookupError, OSError):
        pass
    proc.wait()


def run_llm(cli, model, system_prompt, prompt, timeout=DEFAULT_TIMEOUT, on_line=None, tools=None):
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
                ame_type = ame.get("type")
                if ame_type == "text_delta":
                    delta = ame.get("delta", "")
                    current_turn_text.append(delta)
                if ame_type in ("text_delta", "thinking_delta") and on_line:
                    delta = ame.get("delta", "")
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
