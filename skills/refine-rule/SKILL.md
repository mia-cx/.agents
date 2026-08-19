---
name: refine-rule
description: Audit and slim always-loaded guidance — AGENTS.md, CLAUDE.md, Cursor rules.
disable-model-invocation: true
---

# Refine Rule

Always-loaded files pay their cost every session; prune hardest here. Apply the core levers in [refine](../refine/SKILL.md) (Read it first if not already loaded), plus:

- **Right file for the audience.** Harness-agnostic guidance in AGENTS.md; harness-specific mechanics in that harness's file (CLAUDE.md, `.cursor/rules/*.mdc`). Cursor rules scope by glob — prefer a scoped rule over an always-apply one.
- **Point, don't restate.** When a skill covers the topic, the memory file keeps one pointer line; restated bullets drift from the skill.
- **Delete what context will supply.** "When working on X, do Y" is suspect: Y is often self-evident inside X — visible in the files being edited or surfaced by typecheck/lint/tests. *Can* be found ≠ *will* be encountered; facts in obscure corners stay written down.
- **<50 lines per section.** Longer sections are sediment — core down and delete the stale layers.
- **Verify every fact.** Paths, model names, and tool flags rot silently in files nothing typechecks.
