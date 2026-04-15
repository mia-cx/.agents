#!/usr/bin/env python3
"""
review-crossfile.py — Three-pass cross-file synthesis with validation.

Pass 1 (blind):    Analyzes source files for cross-file issues with NO prior findings.
Pass 2 (informed): Analyzes per-file findings for emergent cross-file patterns.
                   Passes 1 and 2 run in parallel.
Pass 3 (compile):  Deduplicates and compiles both into one report.
Pass 4 (validate): Verifies compiled findings against actual source code.

Usage:
    rg --files -t py | python review-crossfile.py \\
        --input-dir /tmp/code-review-results \\
        --output /tmp/code-review-results/synthesis.md

    python review-crossfile.py \\
        --input-dir /tmp/code-review-results \\
        --file-list files.txt \\
        --output synthesis.md \\
        --model anthropic/claude-sonnet-4 \\
        --no-validate
"""

import argparse
import re
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from _llm_utils import detect_cli, run_llm, is_empty_output

MAX_PARALLEL_PASSES = 2

# ANSI colors
BOLD = "\033[1m"
DIM = "\033[2m"
RESET = "\033[0m"
GREEN = "\033[32m"
RED = "\033[31m"
YELLOW = "\033[33m"
CYAN = "\033[36m"
MAGENTA = "\033[35m"
BLUE = "\033[34m"
GRAY = "\033[90m"

# ---------------------------------------------------------------------------
# Pass 1 — Blind
# ---------------------------------------------------------------------------

BLIND_SYSTEM_PROMPT = r"""
Analyze a codebase for systemic issues that span multiple files.
You have tools: read, write, edit.

What to look for:
1. Circular or tangled dependencies — mutual imports, long import chains signaling layering violations.
2. Inconsistent patterns across files — mixed async paradigms, different error handling strategies in the same layer, inconsistent naming for the same concepts.
3. Leaky abstractions across boundaries — internal types or implementation details from one module leaking into another's interface.
4. Missing error propagation — a function in file A can fail, but its caller in file B doesn't handle the failure.
5. Duplicated logic across files — the same pattern implemented slightly differently in multiple places.
6. Dead exports — symbols exported but never imported anywhere.
7. Architectural observations — god modules, anemic layers, shotgun surgery patterns, misplaced responsibilities.

Output format — no headings, no preamble, no verdict. Separate findings with ---. Example of a valid response:

```markdown
Line 42: `db.query(userInput)` — unsanitized input passed directly to query, SQL injection risk.
Suggestion: use parameterized queries.

---

Line 78–85: `formatDate` is a one-line wrapper around `date.toISOString()` used in only one place.
Suggestion: inline it.
```

If the codebase is clean across file boundaries, output exactly {{omit}} and nothing else.
""".strip()

BLIND_PROMPT_TEMPLATE = r"""## Source files
{file_list}"""


# ---------------------------------------------------------------------------
# Pass 2 — Informed
# ---------------------------------------------------------------------------

INFORMED_SYSTEM_PROMPT = r"""
Read per-file code review findings and identify systemic issues that emerge from the aggregate — patterns that no single-file reviewer could catch on its own.
Look for patterns that repeat, contradict, or connect across files.
You have tools: read, write, edit.

What to look for:
1. Recurring issues — the same finding type appearing in many files suggests a systemic cause (missing linter rule, cargo-culted pattern).
2. Contradictory patterns — file A flagged for using approach X while file B flagged for not using it.
3. Connected findings — a dead export in file A connecting to a missing import in file B, an error-swallowing pattern in C explaining a silent failure in D.
4. Verify "verify cross-file" flags — per-file reviewers flagged some exports for cross-file verification. Determine if they're actually used.

Output format — no headings, no preamble, no verdict. Separate findings with ---. Example of a valid response:

```markdown
Line 42: `db.query(userInput)` — unsanitized input passed directly to query, SQL injection risk.
Suggestion: use parameterized queries.

---

Line 78–85: `formatDate` is a one-line wrapper around `date.toISOString()` used in only one place.
Suggestion: inline it.
```

If no cross-file patterns emerge, output exactly {{omit}} and nothing else.
""".strip()

INFORMED_PROMPT_TEMPLATE = r"""## Per-file findings
{findings}"""


# ---------------------------------------------------------------------------
# Pass 3 — Compile
# ---------------------------------------------------------------------------

COMPILE_SYSTEM_PROMPT = r"""
Compile cross-file findings from two independent analysis passes into a single report.
Deduplicate (merge when both found the same issue, keep the stronger description and more specific file/line references). Drop contradictions. Include unique findings from either pass.
You have tools: read, write, edit.

Output format — no headings, no preamble, no verdict. Separate findings with ---. Example of a valid response:

```markdown
Line 42: `db.query(userInput)` — unsanitized input passed directly to query, SQL injection risk.
Suggestion: use parameterized queries.

---

Line 78–85: `formatDate` is a one-line wrapper around `date.toISOString()` used in only one place.
Suggestion: inline it.
```

Output the compiled findings only.
""".strip()

COMPILE_PROMPT_TEMPLATE = r"""## Pass A findings (blind — read source directly, no prior context)
{blind_output}

## Pass B findings (informed — analyzed per-file review findings)
{informed_output}"""


# ---------------------------------------------------------------------------
# Pass 4 — Validate cross-file findings against source
# ---------------------------------------------------------------------------

VALIDATE_SYSTEM_PROMPT = r"""
Check whether cross-file findings are real by reading the actual source files referenced. Be very skeptical, of both the realness of the findings, and the suggestions to address them — reject anything you can't confirm from the code.
You have tools: read, write, edit.

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

VALIDATE_PROMPT_TEMPLATE = r"""## Source files under review
{file_list}

## Findings to verify
{findings}"""


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------




# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

DEFAULT_TIMEOUT = 600

def main():
    parser = argparse.ArgumentParser(
        description="Three-pass cross-file synthesis with validation.",
        epilog="Source files can be passed as positional args, via --file-list, or piped to stdin.",
    )
    parser.add_argument("files", nargs="*", help="Source files (for blind pass).")
    parser.add_argument("--file-list", type=Path, metavar="PATH",
                        help="Text file with one source filepath per line.")
    parser.add_argument("--input-dir", type=Path, required=True, metavar="DIR",
                        help="Directory containing per-file review markdown.")
    parser.add_argument("--model", default="anthropic/claude-sonnet-4",
                        help="Model for all passes (default: anthropic/claude-sonnet-4).")
    parser.add_argument("--output", type=Path, default=None, metavar="FILE",
                        help="Write final synthesis to file (default: stdout).")
    parser.add_argument("--no-validate", action="store_true",
                        help="Skip the validation pass.")

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
        parser.error("No source files. Pass as args, --file-list, or pipe to stdin.")

    if not files:
        print("Error: no source files provided.", file=sys.stderr)
        sys.exit(1)

    input_dir = args.input_dir.resolve()
    if not input_dir.is_dir():
        print(f"Error: {input_dir} is not a directory.", file=sys.stderr)
        sys.exit(1)

    result_files = sorted(input_dir.glob("*.md"))
    if not result_files:
        print(f"Error: no .md files found in {input_dir}.", file=sys.stderr)
        sys.exit(1)

    sections = []
    for rf in result_files:
        content = rf.read_text(encoding="utf-8").strip()
        if content:
            sections.append(content)
    aggregated_findings = "\n\n---\n\n".join(sections)

    file_list_str = "\n".join(f"- `{f}`" for f in files)
    blind_prompt = BLIND_PROMPT_TEMPLATE.format(file_list=file_list_str)
    informed_prompt = INFORMED_PROMPT_TEMPLATE.format(findings=aggregated_findings)

    cli = detect_cli()

    n_passes = '3' if args.no_validate else '4'
    print(f"{BOLD}{BLUE}Cross-file synthesis:{RESET} {n_passes}-pass with {CYAN}{cli}{RESET} --model {MAGENTA}{args.model}{RESET}", file=sys.stderr)
    print(f"  Pass 1 (blind):    {YELLOW}{len(files)}{RESET} source files", file=sys.stderr)
    print(f"  Pass 2 (informed): {YELLOW}{len(result_files)}{RESET} per-file reviews", file=sys.stderr)
    print(file=sys.stderr)

    output_base = args.output.parent if args.output else input_dir

    import threading
    _print_lock = threading.Lock()

    def make_streamer(label):
        def on_line(line):
            with _print_lock:
                truncated = line[:120] + ("..." if len(line) > 120 else "")
                sys.stderr.write(f"     {GRAY}│ [{label}] {truncated}{RESET}\n")
                sys.stderr.flush()
        return on_line

    blind_output = None
    informed_output = None

    with ThreadPoolExecutor(max_workers=MAX_PARALLEL_PASSES) as pool:
        futures = {
            pool.submit(run_llm, cli, args.model, BLIND_SYSTEM_PROMPT, blind_prompt, DEFAULT_TIMEOUT, make_streamer("blind"), "read,write,edit"): "blind",
            pool.submit(run_llm, cli, args.model, INFORMED_SYSTEM_PROMPT, informed_prompt, DEFAULT_TIMEOUT, make_streamer("informed"), "read,write,edit"): "informed",
        }
        for future in as_completed(futures):
            label = futures[future]
            output, success, error = future.result()
            if success:
                print(f"  {GREEN}\u2705 Pass ({label}) complete{RESET}", file=sys.stderr)
                intermediate_path = output_base / f"crossfile-{label}.md"
                intermediate_path.write_text(output, encoding="utf-8")
                print(f"     {GRAY}\u2192 {intermediate_path}{RESET}", file=sys.stderr)
                if label == "blind":
                    blind_output = output
                else:
                    informed_output = output
            else:
                print(f"  {RED}\u274c Pass ({label}) failed: {error}{RESET}", file=sys.stderr)

    if not blind_output and not informed_output:
        print("Error: both passes failed.", file=sys.stderr)
        sys.exit(1)

    # ---- Pass 3: Compile --------------------------------------------------
    if not blind_output or not informed_output:
        surviving = blind_output or informed_output
        label = "blind" if blind_output else "informed"
        print(f"\n  {YELLOW}\u26a0\ufe0f  Only {label} pass succeeded, skipping compilation.{RESET}", file=sys.stderr)
        compiled_output = surviving
    else:
        print(f"\n  {BOLD}Pass 3 (compile):{RESET} merging results...", file=sys.stderr)
        compile_prompt = COMPILE_PROMPT_TEMPLATE.format(
            blind_output=blind_output, informed_output=informed_output,
        )
        compiled_output, success, error = run_llm(
            cli, args.model, COMPILE_SYSTEM_PROMPT, compile_prompt, DEFAULT_TIMEOUT, make_streamer("compile"),
        )
        if not success:
            print(f"  {RED}\u274c Compile failed: {error}.{RESET} Concatenating instead.", file=sys.stderr)
            compiled_output = (
                f"## Blind Pass\n\n{blind_output}\n\n---\n\n"
                f"## Informed Pass\n\n{informed_output}"
            )
        else:
            print(f"  {GREEN}\u2705 Compilation complete{RESET}", file=sys.stderr)
            compiled_path = output_base / "crossfile-compiled.md"
            compiled_path.write_text(compiled_output, encoding="utf-8")
            print(f"     {GRAY}\u2192 {compiled_path}{RESET}", file=sys.stderr)

    # ---- Pass 4: Validate -------------------------------------------------
    if args.no_validate:
        final_output = compiled_output
    else:
        print(f"\n  {BOLD}Pass 4 (validate):{RESET} checking findings against source...", file=sys.stderr)

        validate_prompt = VALIDATE_PROMPT_TEMPLATE.format(
            file_list=file_list_str, findings=compiled_output,
        )
        validated, success, error = run_llm(
            cli, args.model, VALIDATE_SYSTEM_PROMPT, validate_prompt, DEFAULT_TIMEOUT, make_streamer("validate"),
        )
        if success:
            if is_empty_output(validated):
                print(f"  {YELLOW}\u2705 All cross-file findings rejected during validation.{RESET}", file=sys.stderr)
                final_output = None
            else:
                print(f"  {GREEN}\u2705 Validation complete{RESET}", file=sys.stderr)
                final_output = validated
        else:
            print(f"  {RED}\u274c Validation failed: {error}.{RESET} Using unvalidated output.", file=sys.stderr)
            final_output = compiled_output

    # ---- Output -----------------------------------------------------------
    if final_output is None:
        print(f"\n{YELLOW}No cross-file findings survived validation.{RESET}", file=sys.stderr)
    elif args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(f"# Cross-File Synthesis\n\n{final_output}\n", encoding="utf-8")
        print(f"\n{GREEN}Synthesis written to {args.output}{RESET}", file=sys.stderr)
    else:
        print(final_output)


if __name__ == "__main__":
    main()
