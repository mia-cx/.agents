#!/usr/bin/env python3
"""
review-crossfile.py - Multi-pass cross-file synthesis with validation.

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
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from _llm_utils import C, DEFAULT_TIMEOUT, LiveDisplay, detect_cli, run_llm, is_empty_output, resolve_file_list

MAX_PARALLEL_PASSES = 2  # fixed: blind+informed run in parallel, compile+validate are sequential
TOOLS = "read"  # review passes only need to read source files

# ---------------------------------------------------------------------------
# Pass 1 - Blind
# ---------------------------------------------------------------------------

BLIND_SYSTEM_PROMPT = r"""
Analyze a codebase for systemic issues that span multiple files.
You have tools: read.

What to look for:
1. Circular or tangled dependencies - mutual imports, long import chains signaling layering violations.
2. Inconsistent patterns across files - mixed async paradigms, different error handling strategies in the same layer, inconsistent naming for the same concepts.
3. Leaky abstractions across boundaries - internal types or implementation details from one module leaking into another's interface.
4. Missing error propagation - a function in file A can fail, but its caller in file B doesn't handle the failure.
5. Duplicated logic across files - the same pattern implemented slightly differently in multiple places.
6. Dead exports - symbols exported but never imported anywhere.
7. Architectural observations - god modules, anemic layers, shotgun surgery patterns, misplaced responsibilities.

Output format - no headings, no preamble, no verdict. Separate findings with ---. Example of a valid response:

```markdown
Line 42: `db.query(userInput)` - unsanitized input passed directly to query, SQL injection risk.
Suggestion: use parameterized queries.

---

Line 78-85: `formatDate` is a one-line wrapper around `date.toISOString()` used in only one place.
Suggestion: inline it.
```

If the codebase is clean across file boundaries, output exactly {{omit}} and nothing else.
""".strip()

BLIND_PROMPT_TEMPLATE = r"""## Source files
{file_list}"""


# ---------------------------------------------------------------------------
# Pass 2 - Informed
# ---------------------------------------------------------------------------

INFORMED_SYSTEM_PROMPT = r"""
Read per-file code review findings and identify systemic issues that emerge from the aggregate - patterns that no single-file reviewer could catch on its own.
Look for patterns that repeat, contradict, or connect across files.
You have tools: read.

What to look for:
1. Recurring issues - the same finding type appearing in many files suggests a systemic cause (missing linter rule, cargo-culted pattern).
2. Contradictory patterns - file A flagged for using approach X while file B flagged for not using it.
3. Connected findings - a dead export in file A connecting to a missing import in file B, an error-swallowing pattern in C explaining a silent failure in D.
4. Verify "verify cross-file" flags - per-file reviewers flagged some exports for cross-file verification. Determine if they're actually used.

Output format - no headings, no preamble, no verdict. Separate findings with ---. Example of a valid response:

```markdown
Line 42: `db.query(userInput)` - unsanitized input passed directly to query, SQL injection risk.
Suggestion: use parameterized queries.

---

Line 78-85: `formatDate` is a one-line wrapper around `date.toISOString()` used in only one place.
Suggestion: inline it.
```

If no cross-file patterns emerge, output exactly {{omit}} and nothing else.
""".strip()

INFORMED_PROMPT_TEMPLATE = r"""## Per-file findings
{findings}"""


# ---------------------------------------------------------------------------
# Pass 3 - Compile
# ---------------------------------------------------------------------------

COMPILE_SYSTEM_PROMPT = r"""
Compile cross-file findings from two independent analysis passes into a single report.
Deduplicate (merge when both found the same issue, keep the stronger description and more specific file/line references). Drop contradictions. Include unique findings from either pass.
You have tools: read.

Output format - no headings, no preamble, no verdict. Separate findings with ---. Example of a valid response:

```markdown
Line 42: `db.query(userInput)` - unsanitized input passed directly to query, SQL injection risk.
Suggestion: use parameterized queries.

---

Line 78-85: `formatDate` is a one-line wrapper around `date.toISOString()` used in only one place.
Suggestion: inline it.
```

Output the compiled findings only.
""".strip()

COMPILE_PROMPT_TEMPLATE = r"""## Pass A findings (blind - read source directly, no prior context)
{blind_output}

## Pass B findings (informed - analyzed per-file review findings)
{informed_output}"""


# ---------------------------------------------------------------------------
# Pass 4 - Validate cross-file findings against source
# ---------------------------------------------------------------------------

VALIDATE_SYSTEM_PROMPT = r"""
Verify cross-file findings against actual source code. Be very skeptical - reject anything you can't confirm.
You have tools: read. Use them to check the referenced files and lines.
For each finding, check: (1) Does the code at those locations match what the finding describes? (2) Does the described cross-file relationship actually exist? (3) Does the suggested fix make sense?

For each finding: if real and accurate, copy it verbatim to output. If real but file/line references are wrong, output the corrected finding. If not real, drop it.

Output ONLY the surviving findings. No judgment, no reasoning, no "Looking at...", no "Finding 1 -", no explanations of why you kept or dropped anything. Just the findings themselves, separated by ---.

Example valid output:

```markdown
`src/auth.ts:12`, `src/middleware.ts:34` - JWT secret loaded at module scope, exposed via import chain.
Suggestion: load from env at call site.

---

`src/api/*.ts` - three handlers swallow errors differently.
Suggestion: establish single error boundary pattern.
```

If all findings were rejected, output exactly {{omit}} and nothing else.
""".strip()

VALIDATE_PROMPT_TEMPLATE = r"""## Source files under review
{file_list}

## Findings to verify
{findings}"""




# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Multi-pass cross-file synthesis with validation.",
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

    files = resolve_file_list(args.files, args.file_list)
    if not files:
        parser.error("No source files. Pass as args, --file-list, or pipe to stdin.")

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

    if not sections:
        print(f"{C.YELLOW}Warning: all per-file reviews are empty.{C.RESET}", file=sys.stderr)

    file_list_str = "\n".join(f"- `{f}`" for f in files)
    blind_prompt = BLIND_PROMPT_TEMPLATE.format(file_list=file_list_str)
    informed_prompt = INFORMED_PROMPT_TEMPLATE.format(findings=aggregated_findings)

    cli = detect_cli()

    n_passes = 3 if args.no_validate else 4
    print(f"{C.BOLD}{C.BLUE}Cross-file synthesis:{C.RESET} {n_passes}-pass with {C.CYAN}{cli}{C.RESET} --model {C.MAGENTA}{args.model}{C.RESET}", file=sys.stderr)
    print(f"  Pass 1 (blind):    {C.YELLOW}{len(files)}{C.RESET} source files", file=sys.stderr)
    print(f"  Pass 2 (informed): {C.YELLOW}{len(result_files)}{C.RESET} per-file reviews", file=sys.stderr)
    print(file=sys.stderr)

    output_base = args.output.parent if args.output else input_dir
    display = LiveDisplay(n_passes, phase="Cross-file")
    display.start()
    try:
        _run_pipeline(cli, args, display, output_base, file_list_str, blind_prompt, informed_prompt, n_passes)
    finally:
        display.stop()


def _run_pipeline(cli, args, display, output_base, file_list_str, blind_prompt, informed_prompt, n_passes):
    blind_success = False
    informed_success = False
    blind_output = None
    informed_output = None

    def run_pass(worker_id, label, system_prompt, prompt):
        display.add_worker(worker_id, f"pass: {label}")
        on_line = lambda line: display.feed_line(worker_id, line)
        output, success, error = run_llm(cli, args.model, system_prompt, prompt, timeout=DEFAULT_TIMEOUT, on_line=on_line, tools=TOOLS)
        if success:
            display.complete_worker(worker_id, f"{C.GREEN}\u2705{C.RESET}", f" ({label})")
            intermediate_path = output_base / f"crossfile-{label}.md"
            intermediate_path.write_text(output, encoding="utf-8")
        else:
            display.complete_worker(worker_id, f"{C.RED}\u274c{C.RESET}", f" ({label}) {error}")
        return output, success, error

    # Passes 1+2 in parallel
    with ThreadPoolExecutor(max_workers=MAX_PARALLEL_PASSES) as pool:
        futures = {
            pool.submit(run_pass, 0, "blind", BLIND_SYSTEM_PROMPT, blind_prompt): "blind",
            pool.submit(run_pass, 1, "informed", INFORMED_SYSTEM_PROMPT, informed_prompt): "informed",
        }
        for future in as_completed(futures):
            label = futures[future]
            output, success, error = future.result()
            if success:
                if label == "blind":
                    blind_output = output
                    blind_success = True
                else:
                    informed_output = output
                    informed_success = True

    if not blind_success and not informed_success:
        print(f"{C.RED}Error: both passes failed.{C.RESET}", file=sys.stderr)
        sys.exit(1)

    # Pass 3: Compile
    if not blind_success or not informed_success:
        surviving = blind_output or informed_output
        label = "blind" if blind_success else "informed"
        display.add_worker(2, "pass: compile")
        display.complete_worker(2, f"{C.YELLOW}\u26a0\ufe0f{C.RESET}", f" (compile skipped - only {label} succeeded)")
        compiled_output = surviving if not is_empty_output(surviving) else None
    else:
        compile_prompt = COMPILE_PROMPT_TEMPLATE.format(
            blind_output=blind_output, informed_output=informed_output,
        )
        compiled_output, success, error = run_pass(2, "compile", COMPILE_SYSTEM_PROMPT, compile_prompt)
        if not success:
            compiled_output = f"{blind_output}\n\n---\n\n{informed_output}"
        elif is_empty_output(compiled_output):
            compiled_output = None

    # Pass 4: Validate
    if compiled_output is None:
        final_output = None
    elif args.no_validate:
        final_output = compiled_output
    else:
        validate_prompt = VALIDATE_PROMPT_TEMPLATE.format(
            file_list=file_list_str, findings=compiled_output,
        )
        validated, success, error = run_pass(3, "validate", VALIDATE_SYSTEM_PROMPT, validate_prompt)
        if success:
            if is_empty_output(validated):
                final_output = None
            else:
                final_output = validated
        else:
            final_output = compiled_output

    # ---- Output -----------------------------------------------------------
    if final_output is None:
        print(f"\n{C.YELLOW}No cross-file findings survived validation.{C.RESET}", file=sys.stderr)
    elif args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(f"# Cross-File Synthesis\n\n{final_output}\n", encoding="utf-8")
        print(f"\n{C.GREEN}Synthesis written to {args.output}{C.RESET}", file=sys.stderr)
    else:
        print(final_output)


if __name__ == "__main__":
    main()
