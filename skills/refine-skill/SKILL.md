---
name: refine-skill
description: Audit and slim a SKILL.md — invocation mode, description, body, references.
disable-model-invocation: true
---

# Refine Skill

Apply the core levers in [refine](../refine/SKILL.md) (Read it first if not already loaded), plus:

## Invocation mode

- **Model-invoked** (has a description): permanent context load in exchange for autonomous reach — required only when the agent or another skill must fire it.
- **User-invoked** (`disable-model-invocation: true`): zero context load; the description becomes a human-facing one-liner; only the human can fire it — no other skill can.
- Shared reference that two user-invoked skills both need lives in neither: put it in a plain file both point at, or in a model-invoked reference skill.

## Description (model-invoked only)

The skill's always-loaded pointer — prune it harder than the body:

- One trigger sentence in the user's words: `Use when the user asks to …`.
- One trigger per branch; synonyms renaming the same branch collapse to one.
- Front-load the leading word; cut capability summary the body already carries.

## Body

- 2–3 core concepts; disclose branch-only material to sibling files behind pointers.
- Steps end on checkable, demanding completion criteria.
- Examples concrete and adaptable, not generic.
- If another skill or external doc covers it, link or invoke it — don't restate.
- Work re-derived across runs (a converter, a query, a validation) becomes `scripts/`.
- Verify tool names, flags, and paths still exist — a skill caches the world and the world moves.

When quality is contested or the description mis-triggers in practice, go empirical: run representative prompts with and without the skill and compare.
