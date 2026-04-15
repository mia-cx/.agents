#!/usr/bin/env python3
"""
review.py — Full code review pipeline orchestrator.

Runs the complete pipeline end-to-end:
  1. Per-file reviews with validation  (review-files.py)
  2. Cross-file synthesis with validation (review-crossfile.py)
  3. Combined final report

Usage:
    # From repo root, review all source files:
    rg --files -t py -t ts | python review.py --output-dir /tmp/code-review

    # Explicit files:
    python review.py --output-dir /tmp/code-review src/auth.ts src/utils.ts

    # File list:
    python review.py --output-dir /tmp/code-review --file-list files.txt

    # Custom models:
    python review.py --output-dir /tmp/code-review \\
        --per-file-model anthropic/claude-haiku-4-5 \\
        --crossfile-model anthropic/claude-sonnet-4 \\
        --file-list files.txt
"""

import argparse
import os
import subprocess
import sys
from pathlib import Path

# Add scripts dir to path for _llm_utils import
sys.path.insert(0, str(Path(__file__).parent.resolve()))
from _llm_utils import is_empty_output

SCRIPT_DIR = Path(__file__).parent.resolve()


def run_script(cmd, label, cwd=None):
    """Run a subprocess, streaming output. Returns success bool."""
    print(f"\n{'='*60}")
    print(f"  {label}")
    print(f"{'='*60}\n")

    result = subprocess.run(cmd, text=True, cwd=cwd)
    return result.returncode == 0


def build_report(output_dir):
    """Combine per-file results and cross-file synthesis into a final report."""
    perfile_dir = output_dir / "per-file"
    synthesis_path = output_dir / "synthesis.md"
    report_path = output_dir / "CODE_REVIEW.md"

    # Only files with findings survive (clean files emit {{omit}} and are never written)
    perfile_results = sorted(perfile_dir.glob("*.md"))

    lines = [
        "# Code Review Report",
        "",
    ]

    # Per-file findings
    if perfile_results:
        lines.append("## Per-File Findings")
        lines.append("")
        for rf in perfile_results:
            content = rf.read_text(encoding="utf-8").strip()
            lines.append(content)
            lines.append("")

    # Cross-file synthesis
    if synthesis_path.exists():
        synthesis = synthesis_path.read_text(encoding="utf-8").strip()
        if synthesis and not is_empty_output(synthesis):
            lines.append("## Cross-File Findings")
            lines.append("")
            lines.append(synthesis)
            lines.append("")

    report = "\n".join(lines)
    report_path.write_text(report, encoding="utf-8")
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

    # Resolve file list to pass to subscripts
    files = []
    file_list_path = None

    if args.files:
        files = args.files
    elif args.file_list:
        file_list_path = args.file_list.resolve()
    elif not sys.stdin.isatty():
        # Drain stdin into a temp file so both scripts can read it
        file_list_path = output_dir / ".filelist"
        file_list_path.write_text(sys.stdin.read())
    else:
        parser.error("No files provided. Pass as args, --file-list, or pipe to stdin.")

    # ---- Step 1: Per-file reviews + validation ----------------------------
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

    # Determine the working directory for subprocesses.
    # If file paths are relative, they're relative to the caller's cwd.
    source_cwd = os.getcwd()

    ok = run_script(cmd, "Step 1: Per-file reviews + validation", cwd=source_cwd)
    if not ok:
        print("Per-file review failed. Check output above.", file=sys.stderr)
        sys.exit(1)

    # ---- Step 2: Cross-file synthesis + validation ------------------------
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
        print("Cross-file synthesis failed. Continuing with per-file results only.", file=sys.stderr)

    # ---- Step 3: Build combined report ------------------------------------
    print(f"\n{'='*60}")
    print(f"  Step 3: Building report")
    print(f"{'='*60}\n")

    report_path = build_report(output_dir)

    # Clean up temp file list
    temp_filelist = output_dir / ".filelist"
    if temp_filelist.exists():
        temp_filelist.unlink()

    print(f"Report: {report_path}")


if __name__ == "__main__":
    main()
