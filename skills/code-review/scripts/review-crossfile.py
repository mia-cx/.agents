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

CONTEXT_PREVIEW_LINES = 30
MAX_PARALLEL_PASSES = 2

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

VALIDATE_PROMPT_TEMPLATE = r"""## Code context
{code_context}

## Findings to verify
{findings}"""


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def extract_file_references(text):
    """Extract file paths and optional line numbers from cross-file findings."""
    refs = []
    for match in re.finditer(r'`([^`]+\.\w{1,5})(?::(\d+(?:-\d+)?))?`', text):
        filepath = match.group(1)
        line_ref = match.group(2)
        if line_ref and '-' in line_ref:
            start, end = line_ref.split('-')
            refs.append((filepath, int(start), int(end)))
        elif line_ref:
            refs.append((filepath, int(line_ref), int(line_ref)))
        else:
            refs.append((filepath, None, None))
    return refs


def build_code_context_for_crossfile(file_refs, context_lines=5):
    """Read actual source code for referenced files/lines."""
    sections = []
    seen = set()

    for filepath, start, end in file_refs:
        try:
            source_lines = Path(filepath).read_text(encoding="utf-8").splitlines()
        except Exception:
            continue

        total = len(source_lines)

        if start and end:
            ctx_start = max(1, start - context_lines)
            ctx_end = min(total, end + context_lines)
            key = (filepath, ctx_start, ctx_end)
            if key in seen:
                continue
            seen.add(key)

            code_block = []
            for i in range(ctx_start, ctx_end + 1):
                marker = ">>>" if start <= i <= end else "   "
                code_block.append(f"{marker} {i:4d} | {source_lines[i - 1]}")
            sections.append(f"### `{filepath}:{start}-{end}`\n\n```\n" + "\n".join(code_block) + "\n```")
        else:
            key = (filepath, "head")
            if key in seen:
                continue
            seen.add(key)

            head = min(CONTEXT_PREVIEW_LINES, total)
            code_block = [f"   {i:4d} | {source_lines[i - 1]}" for i in range(1, head + 1)]
            sections.append(f"### `{filepath}` (first {head} lines)\n\n```\n" + "\n".join(code_block) + "\n```")

    return "\n\n".join(sections) if sections else None


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

    print(f"Cross-file synthesis: {'3' if args.no_validate else '4'}-pass system with {cli} --model {args.model}", file=sys.stderr)
    print(f"  Pass 1 (blind):    {len(files)} source files", file=sys.stderr)
    print(f"  Pass 2 (informed): {len(result_files)} per-file reviews", file=sys.stderr)
    print(file=sys.stderr)

    output_base = args.output.parent if args.output else input_dir

    blind_output = None
    informed_output = None

    with ThreadPoolExecutor(max_workers=MAX_PARALLEL_PASSES) as pool:
        futures = {
            pool.submit(run_llm, cli, args.model, BLIND_SYSTEM_PROMPT, blind_prompt, DEFAULT_TIMEOUT, None, "read,write,edit"): "blind",
            pool.submit(run_llm, cli, args.model, INFORMED_SYSTEM_PROMPT, informed_prompt, DEFAULT_TIMEOUT, None, "read,write,edit"): "informed",
        }
        for future in as_completed(futures):
            label = futures[future]
            output, success, error = future.result()
            if success:
                print(f"  \u2705 Pass ({label}) complete", file=sys.stderr)
                intermediate_path = output_base / f"crossfile-{label}.md"
                intermediate_path.write_text(output, encoding="utf-8")
                print(f"     \u2192 {intermediate_path}", file=sys.stderr)
                if label == "blind":
                    blind_output = output
                else:
                    informed_output = output
            else:
                print(f"  \u274c Pass ({label}) failed: {error}", file=sys.stderr)

    if not blind_output and not informed_output:
        print("Error: both passes failed.", file=sys.stderr)
        sys.exit(1)

    # ---- Pass 3: Compile --------------------------------------------------
    if not blind_output or not informed_output:
        surviving = blind_output or informed_output
        label = "blind" if blind_output else "informed"
        print(f"\n  \u26a0\ufe0f  Only {label} pass succeeded, skipping compilation.", file=sys.stderr)
        compiled_output = surviving
    else:
        print(f"\n  Pass 3 (compile): merging results...", file=sys.stderr)
        compile_prompt = COMPILE_PROMPT_TEMPLATE.format(
            blind_output=blind_output, informed_output=informed_output,
        )
        compiled_output, success, error = run_llm(
            cli, args.model, COMPILE_SYSTEM_PROMPT, compile_prompt, DEFAULT_TIMEOUT,
        )
        if not success:
            print(f"  \u274c Compile failed: {error}. Concatenating instead.", file=sys.stderr)
            compiled_output = (
                f"## Blind Pass\n\n{blind_output}\n\n---\n\n"
                f"## Informed Pass\n\n{informed_output}"
            )
        else:
            print(f"  \u2705 Compilation complete", file=sys.stderr)
            compiled_path = output_base / "crossfile-compiled.md"
            compiled_path.write_text(compiled_output, encoding="utf-8")
            print(f"     \u2192 {compiled_path}", file=sys.stderr)

    # ---- Pass 4: Validate -------------------------------------------------
    if args.no_validate:
        final_output = compiled_output
    else:
        print(f"\n  Pass 4 (validate): checking findings against source...", file=sys.stderr)

        file_refs = extract_file_references(compiled_output)
        code_context = build_code_context_for_crossfile(file_refs)

        if not code_context:
            print(f"  \u26a0\ufe0f  No file references to validate, skipping.", file=sys.stderr)
            final_output = compiled_output
        else:
            validate_prompt = VALIDATE_PROMPT_TEMPLATE.format(
                code_context=code_context, findings=compiled_output,
            )
            validated, success, error = run_llm(
                cli, args.model, VALIDATE_SYSTEM_PROMPT, validate_prompt, DEFAULT_TIMEOUT,
            )
            if success:
                if is_empty_output(validated):
                    print(f"  \u2705 All cross-file findings rejected during validation.", file=sys.stderr)
                    final_output = None
                else:
                    print(f"  \u2705 Validation complete", file=sys.stderr)
                    final_output = validated
            else:
                print(f"  \u274c Validation failed: {error}. Using unvalidated output.", file=sys.stderr)
                final_output = compiled_output

    # ---- Output -----------------------------------------------------------
    if final_output is None:
        print(f"\nNo cross-file findings survived validation.", file=sys.stderr)
    elif args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(f"# Cross-File Synthesis\n\n{final_output}\n", encoding="utf-8")
        print(f"\nSynthesis written to {args.output}", file=sys.stderr)
    else:
        print(final_output)


if __name__ == "__main__":
    main()
