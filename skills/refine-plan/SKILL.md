---
name: refine-plan
description: Audit and sharpen a plan, PRD, or handoff another agent will execute.
disable-model-invocation: true
---

# Refine plan

A plan is a step document executed by an agent that was not in the planning conversation. Apply [agent-copy](../agent-copy/SKILL.md); Read it first if not already loaded. Checks specific to plans:

- **Self-contained.** The executor has none of the planning context: every fact the steps rely on is in the plan or behind an explicit pointer. Read it as the executor; anything you would have to guess is a gap.
- **Observable done-conditions.** Files changed, tests green, behavior demonstrated. Per step, plus acceptance criteria closing the whole plan.
- **Constraints live inside the step they bind.** A global "notes" section scatters meaning the executor will not carry to step 7.
- **Decisions, not directions.** Record what was decided and why. Code-level detail (paths, snippets) goes stale; include a snippet only when it encodes a decision more precisely than prose (schema, state machine, type shape).
- **Bound the legwork.** An explicit out-of-scope section stops the executor doing more than asked.
- **Split across issues or handoffs** when later steps tempt rushing earlier ones; those are the real context boundaries a plan can use.
