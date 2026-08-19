---
name: refine-plan
description: Audit and sharpen a plan, PRD, or handoff another agent will execute.
disable-model-invocation: true
---

# Refine Plan

A plan is a step document executed by an agent that wasn't in the planning conversation. Apply the core levers in [refine](../refine/SKILL.md) (Read it first if not already loaded), plus:

- **Self-contained.** The executor has none of the planning context: every fact the steps rely on is in the plan or behind an explicit pointer. Read it as the executor — anything you'd have to guess is a gap.
- **Checkable, demanding criteria per step.** Each step names an observable done-condition (files changed, tests green, behavior demonstrated), worded exhaustively ("every call site migrated", not "migrate call sites"). The plan closes with acceptance criteria for the whole.
- **Co-locate constraints with the step they bind.** A global "notes" section scatters meaning the executor won't carry to step 7.
- **Decisions, not directions.** Record what was decided and why; leave code-level detail (paths, snippets) out — it goes stale — unless a snippet encodes a decision more precisely than prose (schema, state machine, type shape).
- **Bound the legwork.** An explicit out-of-scope section stops the executor doing more than asked.
- **Split across real boundaries.** If later steps tempt rushing earlier ones, split the sequence into separate issues or handoffs — hiding later steps only works across a context boundary.
