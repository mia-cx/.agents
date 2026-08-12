#!/usr/bin/env python3
"""Render references/reviewer-prompt.md for one relay leg.

Substitution is literal, so acceptance criteria and log entries containing /, &,
\\, or newlines survive it. Any value may be given as @PATH to read it from that
file, which is how long fields ($RELAY_LOG, a plan file) stay out of argv.

  render-prompt.py --pr-url https://github.com/o/r/pull/7 --head 7c4d9e2 \
    --diff-target 'git diff main...7c4d9e2' --environment 'Cooperative: ...' \
    --acceptance-criteria @/tmp/criteria.md --prior-legs @"$RELAY_LOG" \
    --codex -o "$PROMPT"
"""

import argparse
import pathlib
import re
import sys

FIELDS = {
    "pr-url": "PR_URL",
    "head": "HEAD_SHA",
    "diff-target": "DIFF_TARGET",
    "acceptance-criteria": "ACCEPTANCE_CRITERIA",
    "environment": "ENVIRONMENT",
    "prior-legs": "PRIOR_LEGS",
}

# The line that keeps the codex leg read-only despite -s danger-full-access.
CODEX_PREAMBLE = (
    "Do not invoke any skill or delegation tool, and do not spawn sub-agents. "
    "Review yourself; do not edit files.\n\n"
)

TEMPLATE = pathlib.Path(__file__).resolve().parent.parent / "references" / "reviewer-prompt.md"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    for flag in FIELDS:
        parser.add_argument(f"--{flag}", required=True, metavar="VALUE|@PATH")
    parser.add_argument("--codex", action="store_true", help="prepend the read-only preamble the codex leg needs")
    parser.add_argument("-o", "--out", required=True, help="write the rendered prompt here")
    args = parser.parse_args()

    rendered = TEMPLATE.read_text()

    # A field added to the template without a flag here would ship unrendered.
    unknown = set(re.findall(r"\{\{(\w+)\}\}", rendered)) - set(FIELDS.values())
    if unknown:
        sys.exit(f"{TEMPLATE} has fields this script cannot fill: {', '.join(sorted(unknown))}")

    for flag, token in FIELDS.items():
        value = getattr(args, flag.replace("-", "_"))
        if value.startswith("@"):
            value = pathlib.Path(value[1:]).read_text()
        rendered = rendered.replace("{{" + token + "}}", value.strip())

    out = pathlib.Path(args.out)
    out.write_text(CODEX_PREAMBLE + rendered if args.codex else rendered)
    print(out)


if __name__ == "__main__":
    main()
