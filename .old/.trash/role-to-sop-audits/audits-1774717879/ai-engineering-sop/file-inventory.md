# File Inventory — ai-engineering-sop

## Relevant files

AGENTS.md | rule | Canonical repository-level operating rules: working model (plan→spec→implement→validate→write-back), scope boundaries, write-back policy, skill promotion criteria, and validation expectations.

CLAUDE.md | config | Lightweight adapter that defers all authority to AGENTS.md; establishes single-source-of-truth entrypoint routing for Claude.

.cursor/rules/workflow.mdc | rule | Default plan-to-spec-to-implementation execution sequence with triggers for spec creation, refinement, and skip conditions.

.cursor/rules/scope-control.mdc | rule | Enforces narrow, single-outcome tasks: split when a task mixes multiple concerns, keep review surface small.

.cursor/rules/boundaries.mdc | rule | Prohibits speculative abstractions, opportunistic refactors, and edits to unrelated modules; enforces ai/ namespace structure.

.cursor/rules/validation.mdc | rule | Layered validation policy: black-box by default, white-box conditional on internal complexity or regression risk.

.cursor/rules/writeback.mdc | rule | Write-back gate: only stable, reusable information is persisted; routes output to facts/, skill/, or AGENTS.md; blocks task-local chatter.

ai/skill/plan-to-spec.md | skill | Step-by-step workflow for converting a plan or phase slice into one or more narrow, reviewable task specs with explicit scope, validation, and write-back guidance.

ai/skill/design-whitebox-tests.md | skill | Decision procedure for determining whether white-box validation is needed and identifying which internal logic to protect vs. avoid over-asserting.

ai/skill/skill-policy.md | rule | Defines the threshold for promoting a workflow into a skill: must repeat, have recognisable I/O, and reduce reasoning effort.

ai/skill/skill-registry.md | config | Index of all active skills with trigger conditions, inputs, outputs, and status; must stay in sync with ai/skill/ contents.

ai/doc/guides/new-project-sop.md | sop | Startup SOP: clarify phase → establish plan → derive specs → implement narrowly → validate → write back facts → promote skills; includes checklist and phase-aware variant triggers.

ai/doc/guides/phase-aware-workflow.md | sop | Extension SOP for long-running or multi-handoff work: defines project_target/current_target/phase/main_plan/sub_plan/task hierarchy and phase field schema (entry/exit criteria, gate checks, forbidden actions).

ai/doc/guides/task-lifecycle-and-escalation.md | sop | Defines canonical task status values, escalation outcomes (replan_required, needs_decision), and repair/rollback/replan/escalate decision rules.

ai/doc/guides/design-to-spec-handoff.md | sop | Multi-model collaboration SOP: role contracts for design partner / planner-specifier / executor, handoff gates, artifact policy, and executor mutation limits.

ai/doc/guides/testing-strategy.md | sop | Layered validation SOP: black-box as default acceptance path, white-box trigger criteria, what to protect vs. avoid, bugfix-first regression rule.

ai/doc/templates/task-spec-template.md | prompt | Reusable task spec scaffold covering goal, scope, phase-aware contract, checklist, done condition, validation plan, repair/rollback budget, and write-back decision.

ai/doc/templates/plan-template.md | prompt | Reusable plan document scaffold with phase context fields (entry/exit criteria, allowed/forbidden actions, gate checks) and plan-level metadata (main_plan vs sub_plan).

ai/doc/templates/design-to-planner-prompt-template.md | prompt | Prompt scaffold for handing design input to a planner/specifier model: input fields, output contract, and constraints on what the planner should not do.

ai/doc/templates/spec-to-executor-prompt-template.md | prompt | Prompt scaffold for handing a single spec to an executor model: allowed scope, forbidden scope, validation expectations, escalation conditions, and executor mutation limits.

ai/doc/templates/change-summary-template.md | prompt | Delivery-note scaffold for task-local completion reporting: scope done, validation run, regression protection, write-back, remaining gaps.

ai/doc/templates/project-scope-template.md | prompt | Reusable project scope document scaffold: project target, current target, phase goal, in/out of scope, constraints, assumptions, open risks.

ai/doc/facts/facts-index.md | config | Index of stable fact files with routing rules for write-back labels (facts_update, skill_promotion, decision_rationale, etc.) and maintenance policy.

ai/doc/facts/project-scope.md | config | Stable recorded scope for this SOP starter repo: project/current targets, phase goal, in/out of scope, key constraints, assumptions, open risks.

ai/doc/facts/golden-cases.md | config | Stable validation reference cases: plan-to-spec conversion, bugfix with white-box trigger, and selective write-back — the three canonical acceptance scenarios for this SOP.
