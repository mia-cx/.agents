---
name: refine
description: Use when the user asks to create, edit, change, refine, slim, or audit an agent-consumed document, like a skill, a memory/rules file, or a plan.
---

# Refine

Audit the target against the [agent-copy](../agent-copy/SKILL.md) reference. Read it first, then run every lever it names against every section of the target: delete, move, sharpen, or add per failed check.

Then pick the branch for the target, Read its SKILL.md, and run its target-specific checks the same way:

| Target | Branch |
| --- | --- |
| `SKILL.md` (any harness) | `skills/refine-skill/SKILL.md` |
| AGENTS.md / CLAUDE.md / Cursor rules, anything always-loaded | `skills/refine-rule/SKILL.md` |
| Plans, PRDs, handoffs, documents another agent executes | `skills/refine-plan/SKILL.md` |
| Any other agent-consumed doc | agent-copy alone |

Commit when every section is accounted for.
