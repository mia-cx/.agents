#!/usr/bin/env python3
"""
review.py — Full code review pipeline orchestrator.

Runs the complete pipeline end-to-end:
  1. Per-file reviews with validation  (review-files.py)
  2. Cross-file synthesis with validation (review-crossfile.py)
  3. Combined final report

Usage:
    rg --files -t py -t ts | python review.py --output-dir /tmp/code-review
    python review.py --output-dir /tmp/code-review src/auth.ts src/utils.ts
    python review.py --output-dir /tmp/code-review --file-list files.txt
"""

import argparse
import os
import subprocess
import sys
from pathlib import Path

from _llm_utils import C, is_empty_output

SCRIPT_DIR = Path(__file__).parent.resolve()
STEP_TIMEOUT = 1800  # 30 min max per step


def run_script(cmd, label, cwd=None):
    """Run a subprocess, streaming output. Returns success bool."""
    print(f"\n{C.DIM}{'='*60}{C.RESET}")
    print(f"  {C.BOLD}{C.BLUE}{label}{C.RESET}")
    print(f"{C.DIM}{'='*60}{C.RESET}\n")

    try:
        result = subprocess.run(cmd, text=True, cwd=cwd, timeout=STEP_TIMEOUT)
        return result.returncode == 0
    except subprocess.TimeoutExpired:
        print(f"{C.RED}Step timed out after {STEP_TIMEOUT}s.{C.RESET}", file=sys.stderr)
        return False


def build_report(output_dir):
    """Combine per-file results and cross-file synthesis into a final report."""
    perfile_dir = output_dir / "per-file"
    synthesis_path = output_dir / "synthesis.md"
    report_path = output_dir / "CODE_REVIEW.md"

    perfile_results = sorted(perfile_dir.glob("*.md"))

    lines = [
        "# Code Review Report",
        "",
    ]

    if perfile_results:
        lines.append("## Per-File Findings")
        lines.append("")
        for rf in perfile_results:
            try:
                content = rf.read_text(encoding="utf-8").strip()
            except OSError as e:
                print(f"{C.RED}Warning: could not read {rf}: {e}{C.RESET}", file=sys.stderr)
                continue
            if is_empty_output(content):
                continue
            lines.append(content)
            lines.append("")

    if synthesis_path.exists():
        try:
            synthesis = synthesis_path.read_text(encoding="utf-8").strip()
        except OSError as e:
            print(f"{C.RED}Warning: could not read synthesis: {e}{C.RESET}", file=sys.stderr)
            synthesis = None
        if synthesis and not is_empty_output(synthesis):
            lines.append("## Cross-File Findings")
            lines.append("")
            lines.append(synthesis)
            lines.append("")

    report = "\n".join(lines)
    try:
        report_path.write_text(report, encoding="utf-8")
    except OSError as e:
        print(f"{C.RED}Error writing report: {e}{C.RESET}", file=sys.stderr)
    return report_path


def main():
    parser = argparse.ArgumentParser(
        description="Full code review pipeline: per-file review → validation → cross-file synthesis → report.",
        epilog="Files can be passed as positional args, via --file-list, or piped to stdin.",
    )
    parser.add_argument("files", nargs="*", help="Source files to review.")
    parser.add_argument("--file-list", type=Path, metavar="PATH",
                        help="Text file with one filepath per line.")
    parser.add_argument("--output-dir", type=Path, required=True, metavar="DIR",
                        help="Directory for all output (per-file results, synthesis, report).")
    parser.add_argument("--per-file-model", default="anthropic/claude-haiku-4-5",
                        help="Model for per-file reviews (default: anthropic/claude-haiku-4-5).")
    parser.add_argument("--crossfile-model", default="anthropic/claude-sonnet-4",
                        help="Model for cross-file synthesis (default: anthropic/claude-sonnet-4).")
    parser.add_argument("--concurrency", type=int, default=None, metavar="N",
                        help="Max concurrent workers (default: CPU count / 2).")
    parser.add_argument("--no-validate", action="store_true",
                        help="Skip validation phases in both scripts.")

    args = parser.parse_args()

    output_dir = args.output_dir.resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    perfile_dir = output_dir / "per-file"
    temp_filelist = output_dir / ".filelist"

    try:
        # Resolve file list
        files = []
        file_list_path = None

        if args.files:
            files = args.files
        elif args.file_list:
            file_list_path = args.file_list.resolve()
        elif not sys.stdin.isatty():
            file_list_path = temp_filelist
            file_list_path.write_text(sys.stdin.read(), encoding="utf-8")
        else:
            parser.error("No files provided. Pass as args, --file-list, or pipe to stdin.")

        source_cwd = os.getcwd()

        # Step 1: Per-file reviews + validation
        cmd = [
            sys.executable, str(SCRIPT_DIR / "review-files.py"),
            "--output-dir", str(perfile_dir),
            "--model", args.per_file_model,
        ]
        if args.concurrency:
            cmd.extend(["--concurrency", str(args.concurrency)])
        if args.no_validate:
            cmd.append("--no-validate")
        if file_list_path:
            cmd.extend(["--file-list", str(file_list_path)])
        else:
            cmd.extend(files)

        ok = run_script(cmd, "Step 1: Per-file reviews + validation", cwd=source_cwd)
        if not ok:
            print(f"{C.RED}Per-file review failed. Check output above.{C.RESET}", file=sys.stderr)
            sys.exit(1)

        # Step 2: Cross-file synthesis + validation
        cmd = [
            sys.executable, str(SCRIPT_DIR / "review-crossfile.py"),
            "--input-dir", str(perfile_dir),
            "--model", args.crossfile_model,
            "--output", str(output_dir / "synthesis.md"),
        ]
        if args.no_validate:
            cmd.append("--no-validate")
        if file_list_path:
            cmd.extend(["--file-list", str(file_list_path)])
        else:
            cmd.extend(files)

        ok = run_script(cmd, "Step 2: Cross-file synthesis + validation", cwd=source_cwd)
        if not ok:
            print(f"{C.RED}Cross-file synthesis failed.{C.RESET} Continuing with per-file results only.", file=sys.stderr)

        # Step 3: Build combined report
        print(f"\n{C.DIM}{'='*60}{C.RESET}")
        print(f"  {C.BOLD}{C.BLUE}Step 3: Building report{C.RESET}")
        print(f"{C.DIM}{'='*60}{C.RESET}\n")

        report_path = build_report(output_dir)
        print(f"{C.GREEN}{C.BOLD}Report:{C.RESET} {report_path}")

    finally:
        if temp_filelist.exists():
            temp_filelist.unlink(missing_ok=True)


if __name__ == "__main__":
    main()
