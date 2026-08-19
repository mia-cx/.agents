---
name: refine
description: >-
  Use when the user asks to refine, slim, or audit an agent-consumed document —
  a skill, a memory/rules file, or a plan.
---

# Refine

Route, then apply: pick the branch for the target, Read its SKILL.md, and run its checks on top of the core levers below. The levers are the audit form of the [agent-copy](../agent-copy/SKILL.md) reference — reach for it when a lever needs its full definition, or when writing a document from scratch rather than refining one.

| Target | Branch |
| --- | --- |
| `SKILL.md` (any harness) | `skills/refine-skill/SKILL.md` |
| AGENTS.md / CLAUDE.md / Cursor rules — anything always-loaded | `skills/refine-rule/SKILL.md` |
| Plans, PRDs, handoffs — documents another agent executes | `skills/refine-plan/SKILL.md` |
| Any other agent-consumed doc | core levers alone |

## Core levers

- **Cache test.** The environment (package scripts, `--help`, config, directory layout) is a source of truth; a doc restating it is a cache that goes stale. Cache only what no lookup reveals — the unwritten convention, the reason behind a choice, the gotcha no config confesses.
- **No-op test.** Sentence by sentence: does it change behavior versus the model's default? Delete failing sentences whole, not word by word. The test is model-relative — settle disagreements by running the doc, not by debate.
- **Leading words.** Replace prose with a compact pretrained concept (*adversarially*, *self-contained*, *verbatim*, *idempotent*, *exhaustive*). Reuse the same word across prompts, docs, and code — it anchors execution in bodies and invocation in pointers. A word too weak to beat the default (*be thorough*) is a no-op; the fix is a stronger word (*relentless*), not more prose.
- **Positive over negation.** A prohibition drags the forbidden behavior into context and half-reads as an instruction to do it. State the target behavior instead; keep a prohibition only as a hard guardrail you can't phrase positively, and pair it with the positive.
- **Single source of truth.** One meaning, one place. Duplication drifts; scattering — one meaning fragmented across sections — is as bad. Co-locate a concept's definition, rules, and caveats under one heading.
- **Progressive disclosure.** Inline what every branch needs; push behind a pointer what only some branches reach. Sprawl thins attention even when every line is live and unique.
- **Pointer sharpening.** A must-have target behind a weakly worded pointer is a variance bug: sharpen the pointer's wording first; inline the material only if sharpening fails.
- **Completion criteria.** Each step ends on a bound the agent can check, worded to demand legwork ("every modified file accounted for", not "produce a list"). Sharpen a fuzzy bound before restructuring; hiding later steps to stop rushing only works across a real context boundary (subagent, handoff) — an inline mention clears nothing.

## Workflow

1. Read the target document.
2. Read the branch skill; run its checks plus every core lever.
3. Delete, move, sharpen, or add per failed check — every section of the target accounted for.
4. Commit.
