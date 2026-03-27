# Skill Split Audit

Final state after the progressive-disclosure refactor passes.

## Outcome

The repo has been refactored so that every `SKILL.md` now acts primarily as a **routing/process layer** rather than a combined router + knowledge base.

Current highest `SKILL.md` line counts are modest:

- `skills/doc-internal-comms/SKILL.md` — 32
- `skills/skill-create/SKILL.md` — 32
- most others are in the ~20–28 line range

There are now **75 reference files** under `skills/**/references/` plus existing specialized docs (`REFERENCE.md`, language guides, scripts, examples, etc.).

## Assessment

At this point, there are **no obvious remaining split candidates**.

Why:

- `SKILL.md` files are short enough that routing decisions are cheap.
- Detailed knowledge has been moved into references, examples, scripts, or existing doc folders.
- The remaining content in `SKILL.md` files is mostly trigger context, process selection, and guardrails.
- Further splitting would mostly create indirection without meaningful context savings.

## What would count as a future split candidate?

A skill should only be split further if one of these becomes true again:

1. `SKILL.md` starts growing into a domain manual instead of a router.
2. One skill gains multiple distinct subdomains that should be loaded independently.
3. Large example blocks or templates accumulate in the main file.
4. Implementation mechanics and routing logic start mixing together again.

## Recommendation

Stop refactoring for size now.

Future improvements, if any, should focus on:

- better trigger descriptions
- better reference-file naming and discoverability
- stronger examples/tests/evals for individual skills
- eliminating stale or duplicate guidance across references

Further progressive-disclosure splitting would likely be noise, not value.
