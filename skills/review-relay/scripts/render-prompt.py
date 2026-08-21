#!/usr/bin/env python3
"""Render a relay prompt template for one leg.

Substitution is literal, so criteria and log entries containing /, &, \\, or
newlines survive it. A value of @PATH is read from that file, which is how long
fields ($RELAY_LOG, a plan file) stay out of argv. The supplied fields must
match the template's exactly — a template that grows a field fails loudly here
rather than reaching a reviewer with a head it has to guess.

  render-prompt.py reviewer-prompt.md \
    --field PR_URL=https://github.com/o/r/pull/7 --field HEAD_SHA=7c4d9e2 \
    --field DIFF_TARGET='git diff main...7c4d9e2' \
    --field ENVIRONMENT='Cooperative: ...' \
    --field ACCEPTANCE_CRITERIA=@/tmp/criteria.md \
    --field PRIOR_LEGS=@"$RELAY_LOG" \
    --read-only-preamble -o "$PROMPT"
"""

import argparse
import pathlib
import re
import sys

# Keeps the codex reviewer read-only despite the sandbox flag its leg needs.
# Reviewer legs are always read-only.
READ_ONLY_PREAMBLE = (
    "Do not invoke any skill or delegation tool, and do not spawn sub-agents. "
    "Review yourself; do not edit files.\n\n"
)

REFERENCES = pathlib.Path(__file__).resolve().parent.parent / "references"


def parse_field(raw: str) -> tuple[str, str]:
    name, sep, value = raw.partition("=")
    if not sep:
        raise argparse.ArgumentTypeError(f"expected NAME=VALUE, got {raw!r}")
    if value.startswith("@"):
        try:
            value = pathlib.Path(value[1:]).read_text()
        except OSError as err:
            raise argparse.ArgumentTypeError(f"{name}: cannot read {value[1:]!r} ({err.strerror})") from err
    return name, value.strip()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("template", help="file in references/, or a path")
    parser.add_argument("--field", action="append", default=[], type=parse_field, metavar="NAME=VALUE|@PATH")
    parser.add_argument("--read-only-preamble", action="store_true", help="prefix the codex reviewer contract")
    parser.add_argument("-o", "--out", required=True, help="write the rendered prompt here")
    args = parser.parse_args()

    path = pathlib.Path(args.template)
    if not path.exists():
        path = REFERENCES / args.template
    rendered = path.read_text()

    supplied = dict(args.field)
    wanted = set(re.findall(r"\{\{(\w+)\}\}", rendered))
    if missing := wanted - set(supplied):
        sys.exit(f"{path.name} needs fields you did not supply: {', '.join(sorted(missing))}")
    if extra := set(supplied) - wanted:
        sys.exit(f"{path.name} has no such fields: {', '.join(sorted(extra))}")

    for name, value in supplied.items():
        rendered = rendered.replace("{{" + name + "}}", value)

    out = pathlib.Path(args.out)
    out.write_text(READ_ONLY_PREAMBLE + rendered if args.read_only_preamble else rendered)
    print(out)


if __name__ == "__main__":
    main()
