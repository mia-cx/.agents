#!/usr/bin/env python3
"""
review-files.py — Per-file code reviewer with built-in validation and live TUI.

Phase 1: Spawns one pi/claude process per file using a bounded worker pool.
Phase 2: Validates findings against actual source code (catches hallucinated
          line numbers, phantom issues, over-eager corrections).

Usage:
    rg --files -t py | python review-files.py --output-dir /tmp/review-out
    python review-files.py --output-dir ./review-out src/auth.ts src/utils.ts
    python review-files.py --output-dir ./review-out --file-list files.txt
    python review-files.py --output-dir ./review-out --no-validate src/*.py
"""

import argparse
import re
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from _llm_utils import detect_cli, get_default_concurrency, run_llm, is_empty_output

# ---------------------------------------------------------------------------
# Review prompts
# ---------------------------------------------------------------------------

REVIEW_SYSTEM_PROMPT = r"""
Review the provided source file for code quality issues.
Report only real issues. For each finding, include only: Line(s), Issue (one sentence), Suggestion (concrete fix).

What to look for:
1. Bad patterns — boolean traps, stringly-typed APIs, argument mutation, callback hell when async/await is available, reimplementing stdlib, leaky abstractions, resource leaks (unclosed handles, missing cleanup in error paths).
2. Over-eager decomposition — unexported functions/classes used in only 1–2 places that add indirection without earning their abstraction. Fix is usually inlining.
3. Deep nesting — 3+ levels of nested if/for/try. Prefer early returns, guard clauses, extracting coherent helper functions.
4. Security issues — injection vectors, hardcoded secrets, missing input validation at trust boundaries, insecure crypto, unsafe deserialization, overly permissive CORS/permissions.
5. Dead code — unused exports, unreachable branches, commented-out blocks, uncalled functions. Mark suspicious exports as "verify cross-file".
6. Inconsistent error handling — swallowed errors, mixed paradigms in the same module, error messages that lose context, missing error handling on fallible operations.
7. Magic values — unexplained numeric/string literals that should be named constants. Ignore obvious 0, 1, -1, "", true, false.
8. Type safety holes — any casts, as unknown as X, @ts-ignore/@ts-expect-error without explanation, unsafe coercions.
9. Copy-paste divergence — near-identical code blocks that have subtly diverged.
10. Incorrect or missing documentation — public/exported symbols missing docstrings, or docstrings that contradict the implementation. Skip private/internal helpers.

Output format — no headings, no preamble, no verdict. Separate findings with ---. Example of a valid response:

Line 42: `db.query(userInput)` — unsanitized input passed directly to query, SQL injection risk.
Suggestion: use parameterized queries.

---

Line 78–85: `formatDate` is a one-line wrapper around `date.toISOString()` used in only one place.
Suggestion: inline it.

If the file is clean with no issues, output exactly {{omit}} and nothing else.
""".strip()

REVIEW_PROMPT_TEMPLATE = r"""`{filepath}`:

```
{file_content}
```"""

# ---------------------------------------------------------------------------
# Validation prompts
# ---------------------------------------------------------------------------

VALIDATE_SYSTEM_PROMPT = r"""
Verify code review findings against actual source code. Be very skeptical, of both the realness of the findings, and the suggestions to address them — reject anything you can't confirm.
For each finding, check: (1) Does the code at that line match what the finding describes? (2) Does the code actually exhibit the described problem? (3) Does the suggested fix make sense?

Output format — no headings, no preamble, no verdict, only output the findings. Separate findings with ---. Emit real finding verbatim, corrected finding if needed, omit finding if not real. Do your reasoning internally. Example of a valid response:

```markdown
Line 42: `db.query(userInput)` — unsanitized input passed directly to query, SQL injection risk.
Suggestion: use parameterized queries.

---

Line 78–85: `formatDate` is a one-line wrapper around `date.toISOString()` used in only one place.
Suggestion: inline it.
```

Note that the output format does not contain "All findings verified against the source code" or explanations of why findings needed corrections. Only the (corrected) findings themselves.

If all findings were rejected, output exactly {{omit}} and nothing else.
""".strip()

VALIDATE_PROMPT_TEMPLATE = r"""## Source file: `{filepath}`

## Actual code context
{code_context}

## Findings to verify
{findings}"""


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
                active_lines.append(f"  \u23f3 {fp}")
                for l in w["lines"][-self.MAX_LINES:]:
                    truncated = l[:100] + ("..." if len(l) > 100 else "")
                    active_lines.append(f"     \u2502 {truncated}")

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


# ---------------------------------------------------------------------------
# Phase 1: Per-file review
# ---------------------------------------------------------------------------

def review_file(filepath, cli, model, output_dir, display=None, worker_id=None):
    """Review a single file."""
    safe_name = filepath.replace("/", "_").replace("\\", "_")
    output_path = output_dir / f"{safe_name}.md"

    try:
        file_content = Path(filepath).read_text()
    except Exception as e:
        return (filepath, None, False, f"Cannot read file: {e}")

    prompt = REVIEW_PROMPT_TEMPLATE.format(filepath=filepath, file_content=file_content)
    on_line = (lambda line: display.feed_line(worker_id, line)) if display and worker_id is not None else None

    output, success, error = run_llm(cli, model, REVIEW_SYSTEM_PROMPT, prompt, on_line=on_line)
    if success:
        if is_empty_output(output):
            return (filepath, None, True, "clean")
        output_path.write_text(f"# `{filepath}`\n\n{output}\n", encoding="utf-8")
        return (filepath, str(output_path), True, None)
    return (filepath, None, False, error)


def run_reviews(files, cli, model, output_dir, concurrency):
    """Run all per-file reviews with live display."""
    total = len(files)
    print(f"Phase 1: Reviewing {total} file(s) with {cli} --model {model}")
    print(f"  Concurrency: {concurrency} workers\n")

    display = LiveDisplay(total, phase="Review")
    display.start()

    successes = 0
    errors = []

    def do_review(i, filepath):
        display.add_worker(i, filepath)
        return review_file(filepath, cli, model, output_dir, display, i)

    with ThreadPoolExecutor(max_workers=concurrency) as pool:
        futures = {pool.submit(do_review, i, f): (i, f) for i, f in enumerate(files)}
        for future in as_completed(futures):
            i, filepath = futures[future]
            filepath, output_path, success, error = future.result()
            if success and error == "clean":
                successes += 1
                display.complete_worker(i, "\u2014", " (clean)")
            elif success:
                successes += 1
                display.complete_worker(i, "\u2705")
            else:
                errors.append((filepath, error))
                display.complete_worker(i, "\u274c", f" \u2014 {error}")

    display.stop()
    print(f"\n  Review: {successes} reviewed, {len(errors)} errors.\n")
    return successes, errors


# ---------------------------------------------------------------------------
# Phase 2: Validation
# ---------------------------------------------------------------------------

def extract_filepath_from_review(review_text):
    match = re.search(r'^# `(.+?)`', review_text, re.MULTILINE)
    return match.group(1) if match else None


def extract_line_references(review_text):
    patterns = [
        r'\*\*Line\(?s?\)?\*\*:\s*(\d+(?:\s*[\u2013\u2014-]\s*\d+)?)',
        r'[Ll]ines?\s+(\d+(?:\s*[\u2013\u2014-]\s*\d+)?)',
    ]
    line_refs = []
    for pattern in patterns:
        for match in re.finditer(pattern, review_text):
            ref = match.group(1).strip()
            # Normalize en-dash/em-dash to hyphen
            ref = ref.replace('\u2013', '-').replace('\u2014', '-')
            if '-' in ref:
                start, end = ref.split('-', 1)
                line_refs.append((int(start.strip()), int(end.strip())))
            else:
                line_refs.append((int(ref), int(ref)))
    return line_refs


def extract_code_context(filepath, line_refs, context_lines=3):
    try:
        source_lines = Path(filepath).read_text(encoding="utf-8").splitlines()
    except Exception:
        return None

    total_lines = len(source_lines)
    sections = []
    seen_ranges = set()

    for start, end in line_refs:
        if start < 1 or end > total_lines:
            continue
        ctx_start = max(1, start - context_lines)
        ctx_end = min(total_lines, end + context_lines)
        range_key = (ctx_start, ctx_end)
        if range_key in seen_ranges:
            continue
        seen_ranges.add(range_key)

        code_block = []
        for i in range(ctx_start, ctx_end + 1):
            marker = ">>>" if start <= i <= end else "   "
            code_block.append(f"{marker} {i:4d} | {source_lines[i - 1]}")
        sections.append("\n".join(code_block))

    return "\n\n---\n\n".join(sections) if sections else None


def validate_file(review_path, cli, model, output_dir, display=None, worker_id=None):
    """Validate one file's findings."""
    review_text = review_path.read_text(encoding="utf-8")
    filepath = extract_filepath_from_review(review_text)

    if not filepath:
        out = output_dir / review_path.name
        out.write_text(review_text, encoding="utf-8")
        return (str(review_path), str(out), "passthrough")

    line_refs = extract_line_references(review_text)
    code_context = extract_code_context(filepath, line_refs)

    if not code_context:
        out = output_dir / review_path.name
        out.write_text(review_text, encoding="utf-8")
        return (str(review_path), str(out), "skipped")

    prompt = VALIDATE_PROMPT_TEMPLATE.format(
        filepath=filepath,
        code_context=code_context,
        findings=review_text,
    )

    on_line = (lambda line: display.feed_line(worker_id, line)) if display and worker_id is not None else None
    output, success, error = run_llm(cli, model, VALIDATE_SYSTEM_PROMPT, prompt, on_line=on_line)

    out = output_dir / review_path.name
    if success:
        if is_empty_output(output):
            return (str(review_path), None, "rejected")
        out.write_text(f"# `{filepath}`\n\n{output}\n", encoding="utf-8")
        return (str(review_path), str(out), "validated")
    else:
        out.write_text(review_text, encoding="utf-8")
        return (str(review_path), str(out), "failed")


def run_validation(review_dir, output_dir, cli, model, concurrency):
    """Validate all reviews in a directory with live display."""
    review_files = sorted(review_dir.glob("*.md"))
    if not review_files:
        return {}

    total = len(review_files)
    print(f"Phase 2: Validating {total} review(s)")
    print(f"  Concurrency: {concurrency} workers\n")

    display = LiveDisplay(total, phase="Validate")
    display.start()

    stats = {"validated": 0, "passthrough": 0, "skipped": 0, "rejected": 0, "failed": 0}

    def do_validate(i, rf):
        fp = extract_filepath_from_review(rf.read_text(encoding="utf-8")) or rf.name
        display.add_worker(i, fp)
        return validate_file(rf, cli, model, output_dir, display, i)

    with ThreadPoolExecutor(max_workers=concurrency) as pool:
        futures = {pool.submit(do_validate, i, rf): (i, rf) for i, rf in enumerate(review_files)}
        for future in as_completed(futures):
            i, rf = futures[future]
            path, out_path, status = future.result()
            stats[status] = stats.get(status, 0) + 1
            icons = {"validated": "\u2705", "passthrough": "\u23ed\ufe0f", "skipped": "\u23ed\ufe0f", "rejected": "\u274c", "failed": "\u274c"}
            display.complete_worker(i, icons.get(status, "?"), f" ({status})")

    display.stop()
    print(f"\n  Validation: {stats['validated']} verified, {stats['rejected']} fully rejected, "
          f"{stats['passthrough'] + stats['skipped']} skipped, {stats['failed']} failed.\n")
    return stats


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Per-file code reviewer with built-in validation.",
        epilog="Files can be passed as positional args, via --file-list, or piped to stdin.",
    )
    parser.add_argument("files", nargs="*", help="Files to review.")
    parser.add_argument("--file-list", type=Path, metavar="PATH",
                        help="Text file with one filepath per line.")
    parser.add_argument("--model", default="anthropic/claude-haiku-4-5",
                        help="Model for reviews and validation (default: anthropic/claude-haiku-4-5).")
    parser.add_argument("--output-dir", type=Path, required=True, metavar="DIR",
                        help="Directory to write validated review markdown.")
    parser.add_argument("--concurrency", type=int, default=None, metavar="N",
                        help="Max concurrent workers (default: CPU count / 2).")
    parser.add_argument("--no-validate", action="store_true",
                        help="Skip the validation phase.")

    args = parser.parse_args()

    files = []
    if args.files:
        files = args.files
    elif args.file_list:
        files = [l.strip() for l in args.file_list.read_text().splitlines()
                 if l.strip() and not l.startswith("#")]
    elif not sys.stdin.isatty():
        files = [l.strip() for l in sys.stdin if l.strip()]
    else:
        parser.error("No files provided. Pass as args, --file-list, or pipe to stdin.")

    missing = [f for f in files if not Path(f).is_file()]
    if missing:
        print(f"Warning: {len(missing)} file(s) not found, skipping:", file=sys.stderr)
        for f in missing:
            print(f"  {f}", file=sys.stderr)
        files = [f for f in files if Path(f).is_file()]
    if not files:
        print("Error: no valid files to review.", file=sys.stderr)
        sys.exit(1)

    cli = detect_cli()
    concurrency = args.concurrency or get_default_concurrency()
    output_dir = args.output_dir.resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    if args.no_validate:
        successes, errors = run_reviews(files, cli, args.model, output_dir, concurrency)
    else:
        raw_dir = output_dir / ".raw"
        raw_dir.mkdir(parents=True, exist_ok=True)
        successes, errors = run_reviews(files, cli, args.model, raw_dir, concurrency)
        if successes > 0:
            run_validation(raw_dir, output_dir, cli, args.model, concurrency)

    total = len(files)
    print(f"Complete: {total} files processed. Results in {output_dir}/")
    sys.exit(1 if successes == 0 else 0)


if __name__ == "__main__":
    main()
