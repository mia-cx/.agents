---
name: refine-skill
description: Audit and slim a SKILL.md — invocation mode, description, body, references.
disable-model-invocation: true
---

# Refine Skill

Apply [agent-copy](../agent-copy/SKILL.md) in full (Read it first if not already loaded) — its pointer rules audit the description, its skill-mechanics section audits the invocation mode. Checks specific to skills:

- **Check the invocation mode first** — a wrong mode invalidates how the description should read.
- Model-invoked descriptions follow the template `Use when the user asks to …`, in the user's words.
- Examples concrete and adaptable, not generic.
- Work re-derived across runs (a converter, a query, a validation) becomes `scripts/`.
- Verify tool names, flags, and paths still exist — a skill caches the world and the world moves.

When quality is contested or the description mis-triggers in practice, go empirical: run representative prompts with and without the skill and compare.
