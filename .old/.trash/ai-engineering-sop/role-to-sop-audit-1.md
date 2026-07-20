# SOP Audit: ai-engineering-sop
**Pass**: 1
**Date**: 2026-03-28
**Source**: `/Users/mia/.agents/.worktrees/role-to-sop/.references/ai-engineering-sop`

---

## Overview

`ai-engineering-sop` is a tool-neutral, stack-agnostic SOP starter for AI-assisted engineering work. Created as a reusable starter kit, it provides a practical operating model organized around plan-first engineering, task-spec-driven execution, explicit validation, selective fact write-back, and skill promotion. The repo's stated purpose is for teams who want to move from planning to narrow execution without losing control of scope, validation, facts, or reusable workflows. It is explicitly version-stamped (v0.2.0, 2026-03-22) and designed to be copied into real projects. It contains no application code — only workflow structure: guidance docs, templates, skill definitions, cursor rules, and example specs.

---

## Artifact Inventory Summary

The repo contains seven artifact categories:

1. **Root entrypoints** (`README.md`, `AGENTS.md`, `CLAUDE.md`) — canonical operating rules, adoption model, adapter delegation
2. **Cursor rules** (`.cursor/rules/*.mdc`) — five always-apply execution guardrails: workflow, validation, boundaries, scope-control, writeback
3. **Guides** (`ai/doc/guides/*.md`) — five workflow guides: new-project SOP, design-to-spec handoff, task lifecycle & escalation, phase-aware workflow, testing strategy
4. **Templates** (`ai/doc/templates/*.md`) — six reusable artifact skeletons: task spec, plan, change summary, project scope, design-to-planner prompt, spec-to-executor prompt
5. **Specs** (`ai/doc/specs/`) — five spec files: README (conventions), two example specs, two real restructure specs
6. **Facts** (`ai/doc/facts/`) — three files: facts-index, project-scope, golden-cases
7. **Skills** (`ai/skill/`) — four files: plan-to-spec, design-whitebox-tests, skill-registry, skill-policy

---

## Source-to-Portable Split Summary

| Category | Port? | Reasoning |
|---|---|---|
| Core workflow SOP (plan→spec→implement→validate→writeback→promote) | ✅ Yes | Universal engineering execution loop; zero stack specificity |
| Task spec template + conventions | ✅ Yes | Highly portable execution contract; tool-neutral |
| Plan template | ✅ Yes | Generic planning scaffold; phase-aware fields are portable |
| Skill: plan-to-spec | ✅ Yes | Core bridge skill; reusable across any AI-assisted workflow |
| Skill: design-whitebox-tests | ✅ Yes | Validation judgment heuristic; stack-agnostic |
| Skill promotion policy | ✅ Yes | Meta-governance for when to extract skills |
| Testing strategy guide (layered validation) | ✅ Yes | Black-box default + conditional white-box is portable |
| Task lifecycle & escalation guide | ✅ Yes | Status vocabulary + repair/rollback/replan/escalate logic is universal |
| Design-to-spec handoff guide | ✅ Yes | Multi-model role contract; portable to any multi-agent setup |
| Change summary template | ✅ Yes | Delivery note scaffold; tool-neutral |
| Write-back policy | ✅ Yes | Core governance primitive; portable |
| Phase-aware workflow guide | ✅ Yes (with caveat) | Portable hierarchy model; strip repo-local namespace references |
| Cursor rules (5 .mdc files) | ✅ Partial | Semantics are portable; Cursor-specific format/metadata should be stripped |
| Design-to-planner prompt template | ✅ Yes | Multi-model handoff scaffold; portable |
| Spec-to-executor prompt template | ✅ Yes | Executor contract template; portable |
| Namespace model (`ai/` boundary rule) | ✅ Partial | The boundary concept is portable; specific path names (`ai/doc`, `ai/skill`) are repo conventions |
| Spec naming convention (YYYYMMDD-NNN-slug) | ✅ Yes | Universal datestamped artifact convention |
| Facts structure (facts-index, project-scope, golden-cases) | ✅ Partial | The category model is portable; example file contents are starter-specific |
| Skill registry pattern | ✅ Yes | Meta-governance table; portable |
| `CLAUDE.md` adapter pattern (defer to AGENTS.md) | ✅ Yes | Adapter-over-canon principle is portable |
| Example specs (`20260101-001`, `20260102-001`) | ❌ No | Illustrative only; too narrow to port |
| `ai/doc/facts/project-scope.md` content | ❌ No | Describes this starter's own scope; repo-local |
| `ai/doc/facts/golden-cases.md` content | ❌ No | Empty/starter placeholder; no portable content |
| Real restructure specs (`20260326-*`) | ❌ No | Repo-local maintenance tasks |
| `AGENTS.md` brand/name references | Strip | Strip repo name, version stamp, "SOP Starter Version" |
| `.cursor/rules` `description` front-matter | Strip | Cursor-specific YAML front-matter metadata |

---

## SOPs to Port

### 1. Core Engineering Execution Loop (New-Project SOP)

| Field | Value |
|---|---|
| **Source file** | `ai/doc/guides/new-project-sop.md` + `AGENTS.md` §Working model |
| **Trigger / When to use** | Any new project or structured existing project; anytime AI-assisted work needs a default execution protocol |
| **Steps / Contract** | 1. Clarify phase + plan; 2. Derive narrow task spec(s); 3. Implement smallest coherent change; 4. Validate explicitly (black-box default); 5. Write back stable facts only; 6. Promote repeated workflows into skills |
| **Quality bar** | Each step must produce a reviewable artifact; implementation cannot begin without a clear task boundary; checklist completion alone ≠ done |
| **Escalation path** | `replan_required` when spec assumptions break; `needs_decision` when executor hits a decision boundary |
| **Next action** | Port as `.agents/sop/core-engineering-execution-loop.md`; strip version stamp, repo name, Cursor-specific references |
| **What to strip** | "SOP Starter Version: 0.2.0" line, `ai/` namespace path names as hard references (replace with `<workflow-dir>`), mention of specific tools (Cursor, Claude, AGENTS.md filenames) |
| **Notes** | This is the primary SOP; all other SOPs are extensions or sub-protocols of this loop |

---

### 2. Task Spec: Contract Template

| Field | Value |
|---|---|
| **Source file** | `ai/doc/templates/task-spec-template.md` + `ai/doc/specs/README.md` |
| **Trigger / When to use** | Before any implementation begins on a non-trivial task; mandatory unless task is "trivially narrow and already effectively spec-complete" |
| **Steps / Contract** | Fields: Source Plan, Parent Phase (opt), Parent Plan (opt), Status, Goal, In Scope, Out of Scope, Allowed/Disallowed Edits (opt), Affected Area, Checklist (3–7 items), Done When, Validation (BB + WB), Repair/Rollback (opt), Write-back Needed, Risks/Notes |
| **Quality bar** | Done requires both checklist completion AND required validation passing; status must be kept current |
| **Escalation path** | `needs_decision` or `replan_required` as explicit spec-level escalation outcomes |
| **Next action** | Port as `.agents/templates/task-spec.md`; strip Cursor-era field labels if tool-specific |
| **What to strip** | Internal path references (`ai/doc/specs/`), Cursor-specific wording; replace `AGENTS.md` references with generic "operating rules" |
| **Notes** | Naming convention `YYYYMMDD-NNN-slug` is independently portable and should be preserved |

---

### 3. Plan Template (Phase-Aware)

| Field | Value |
|---|---|
| **Source file** | `ai/doc/templates/plan-template.md` + `ai/doc/guides/phase-aware-workflow.md` |
| **Trigger / When to use** | When a plan must become a durable artifact for re-reading, sharing, or handoff; skip for plans that stay conversational |
| **Steps / Contract** | Fields: Plan Level (main/sub), Project Target, Current Target, Parent Plan, Current Phase, Phase Context block (purpose, entry/exit criteria, deliverables, allowed/forbidden actions, gate checks), Problem, Goal, Non-goals, Constraints, Approach, Risks, Phase Split/Task Breakdown, First Slice |
| **Quality bar** | First Slice must be a reviewable, concrete deliverable; non-goals must be explicit |
| **Escalation path** | Replan when phase exit criteria can no longer be met with current task ordering |
| **Next action** | Port as `.agents/templates/plan.md` |
| **What to strip** | Path references to `ai/doc/templates/`, version stamps |
| **Notes** | Phase hierarchy model (`project_target → current_target → phase → plan → task`) is independently valuable as a vocabulary primitive |

---

### 4. Skill: Plan-to-Spec

| Field | Value |
|---|---|
| **Source file** | `ai/skill/plan-to-spec.md` |
| **Trigger / When to use** | A plan or phase slice exists and work is about to move to implementation |
| **Steps / Contract** | 9-step workflow: start from current slice → one spec one outcome → split before large → make execution contract explicit → add lightweight status + checklist → make validation explicit → judge white-box need → decide write-back deliberately → add failure boundaries only when needed |
| **Quality bar** | Each spec has status, short checklist, done condition, validation guidance, and write-back decision |
| **Escalation path** | If spec becomes oversized: split before handing to executor |
| **Next action** | Port as `.agents/skills/plan-to-spec.md` |
| **What to strip** | `ai/doc/specs/README.md` path reference (replace with generic); `AGENTS.md` section references |
| **Notes** | Common failure modes section is exceptionally useful to retain verbatim |

---

### 5. Skill: Design Whitebox Tests (Validation Judgment)

| Field | Value |
|---|---|
| **Source file** | `ai/skill/design-whitebox-tests.md` |
| **Trigger / When to use** | Task touches branch-heavy logic, state transitions, deterministic bugfix, caches, parsers, schedulers, rules engines |
| **Steps / Contract** | Inputs → decide WB needed → identify what to protect (branch selection, state transitions, error paths, rollback, cache invalidation, intermediate invariants) → identify what NOT to assert (helper call order, local trivia, brittle details) |
| **Quality bar** | Decision must be explicit in spec: "White-box Needed: Yes/No + Trigger" |
| **Escalation path** | N/A — produces a judgment and guidance, not an action |
| **Next action** | Port as `.agents/skills/validation-whitebox-judgment.md` (rename to remove "design" verb which implies a role) |
| **What to strip** | None — fully portable as written |
| **Notes** | Bugfix-first rule ("convert root cause into regression-protecting test") is valuable to highlight |

---

### 6. Task Lifecycle & Escalation Protocol

| Field | Value |
|---|---|
| **Source file** | `ai/doc/guides/task-lifecycle-and-escalation.md` |
| **Trigger / When to use** | Any task with failure-handling, repair, or multi-handoff needs; always applicable as status vocabulary |
| **Steps / Contract** | 8 canonical status values + 2 escalation outcomes; repair vs rollback vs replan vs escalate decision matrix; default transition rules |
| **Quality bar** | Escalation outcomes (`replan_required`, `needs_decision`) must be explicit results, not silent scope expansion |
| **Escalation path** | `needs_decision` → return to planner/owner; `replan_required` → return to planning layer |
| **Next action** | Port as `.agents/sop/task-lifecycle.md` |
| **What to strip** | "not pseudocode for a workflow engine" caveat is useful but may need softening in non-runtime contexts |
| **Notes** | Repair vs rollback vs replan vs escalate decision rules are the most portable and valuable section |

---

### 7. Design-to-Spec Handoff (Multi-Agent Role Contract)

| Field | Value |
|---|---|
| **Source file** | `ai/doc/guides/design-to-spec-handoff.md` |
| **Trigger / When to use** | When design, planning, spec derivation, and execution are split across different models or people |
| **Steps / Contract** | Role contracts for Design Partner, Planner/Specifier, Executor; artifact policy; handoff gates (Design→Planner, Planner→Executor); executor mutation limits; default flow (6 steps); iteration loop |
| **Quality bar** | Executor only touches Status, Checklist, Risks/Notes; cannot rewrite Goal/InScope/OutOfScope/DoneWhen/Validation |
| **Escalation path** | Executor returns `replan_required` or `needs_decision` to planner/specifier |
| **Next action** | Port as `.agents/sop/multi-agent-handoff.md` |
| **What to strip** | Specific tool examples (ChatGPT, Codex, Cursor/Composer) in "Example Mapping" — replace with generic role labels |
| **Notes** | Executor mutation limits table is especially portable and high-value |

---

### 8. Write-back Policy

| Field | Value |
|---|---|
| **Source file** | `AGENTS.md` §Write-back policy + `.cursor/rules/writeback.mdc` |
| **Trigger / When to use** | After any implementation task, before deciding what to document permanently |
| **Steps / Contract** | Three-question gate (Will this still matter? Can it be reused? Does it have a clear destination?); routing taxonomy (facts_update, skill_promotion, decision_rationale, phase_lesson, task_pattern, anti_pattern); explicit "do not write back" list |
| **Quality bar** | Facts = stable reusable context, not archive; change summaries = task-local, not permanent |
| **Escalation path** | None — this is a governance gate, not an execution flow |
| **Next action** | Port as `.agents/sop/write-back-policy.md` |
| **What to strip** | `ai/doc/facts/*` and `ai/skill/*` path references — replace with generic `<facts-dir>`, `<skills-dir>` |
| **Notes** | The three-question gate is the most portable distillation |

---

### 9. Testing Strategy (Layered Validation)

| Field | Value |
|---|---|
| **Source file** | `ai/doc/guides/testing-strategy.md` |
| **Trigger / When to use** | When deciding validation approach for any implementation task |
| **Steps / Contract** | Layer 1: black-box default (externally visible behavior, integration, acceptance); Layer 2: white-box conditional (branch-heavy, stateful, bugfix, internal contracts); What to protect / What to avoid / Bugfix-first rule / Anti-coverage-chasing |
| **Quality bar** | Coverage percentage explicitly NOT the primary metric; prefer protecting critical contracts and regression paths |
| **Escalation path** | N/A — validation judgment feeds into task spec |
| **Next action** | Port as `.agents/sop/validation-strategy.md` |
| **What to strip** | None — fully portable |
| **Notes** | Closely related to Skill #5 (whitebox judgment); consider cross-referencing rather than duplicating |

---

### 10. Change Summary Template

| Field | Value |
|---|---|
| **Source file** | `ai/doc/templates/change-summary-template.md` |
| **Trigger / When to use** | After completing any implementation task, as task-local delivery note |
| **Steps / Contract** | Sections: What Changed, Scope Completed, Validation Run (BB + WB), Regression Path Protected, Facts/Skills Updated, Remaining Gaps |
| **Quality bar** | Must be task-local; explicitly not a permanent fact |
| **Escalation path** | Remaining Gaps section surfaces follow-ups |
| **Next action** | Port as `.agents/templates/change-summary.md` |
| **What to strip** | None — no repo-specific content |
| **Notes** | Six-section structure is minimal and complete |

---

### 11. Multi-Model Prompt Scaffolds (Design↔Planner, Spec↔Executor)

| Field | Value |
|---|---|
| **Source file** | `ai/doc/templates/design-to-planner-prompt-template.md`, `ai/doc/templates/spec-to-executor-prompt-template.md` |
| **Trigger / When to use** | When handing work between models or agents; when executor needs a structured prompt boundary |
| **Steps / Contract** | Design-to-Planner: Design Summary, Goal, Non-goals, Constraints, Risks, Repo Context, Open Questions, Desired Next Step + Output Contract + Constraints. Spec-to-Executor: Target Spec Path, Allowed/Forbidden Scope, Validation Expectations, Escalation Expectations, Completion Reporting Format, Stop/Fallback Conditions + Execution Contract |
| **Quality bar** | Executor contract explicitly limits what executor may rewrite |
| **Escalation path** | Fallback Conditions section in executor template |
| **Next action** | Port as `.agents/templates/prompt-design-to-planner.md` and `.agents/templates/prompt-spec-to-executor.md` |
| **What to strip** | Remove references to specific models (ChatGPT, Codex, Cursor, Composer) |
| **Notes** | These are "prompt scaffolds, not durable project documents" — this distinction should be preserved in ported versions |

---

### 12. Skill Policy (Meta-Governance for Skill Promotion)

| Field | Value |
|---|---|
| **Source file** | `ai/skill/skill-policy.md` |
| **Trigger / When to use** | When deciding whether to promote a useful workflow into a reusable skill |
| **Steps / Contract** | Create skill when: repeats, recognizable I/O, reduces repeated reasoning, reusable. Don't create when: unstable, tied to one task, better as spec or change summary, too vague |
| **Quality bar** | Skills must be "practical, compact, and operational" |
| **Escalation path** | N/A |
| **Next action** | Port as `.agents/sop/skill-promotion-policy.md` |
| **What to strip** | None |
| **Notes** | Intentionally brief; should stay brief in ported version |

---

### 13. Namespace Boundary Model (AI Workflow Asset Isolation)

| Field | Value |
|---|---|
| **Source file** | `ai/README.md` + `AGENTS.md` §Canonical structure + `.cursor/rules/boundaries.mdc` |
| **Trigger / When to use** | When setting up a new project's file layout for AI-assisted work |
| **Steps / Contract** | Principle: AI workflow assets (guides, templates, specs, facts, skills) live in a dedicated namespace separate from project-facing docs. Canonical singular roots. No parallel roots. Entrypoint split (human-facing README vs AI-tool entrypoints). |
| **Quality bar** | Project docs must not pollute the AI workflow namespace; AI workflow assets must not masquerade as product docs |
| **Escalation path** | N/A — structural convention |
| **Next action** | Port as `.agents/sop/workspace-layout.md` |
| **What to strip** | `ai/doc`, `ai/skill` hard paths → replace with `<workflow-dir>/doc`, `<workflow-dir>/skill`; strip `AGENTS.md`, `CLAUDE.md` filenames as hard references |
| **Notes** | The boundary concept is more portable than the specific filenames |

---

## SOPs to Leave Out

| Artifact | Reason |
|---|---|
| `ai/doc/specs/20260101-001-example-api-rate-limiting.md` | Example only; illustrative, not portable |
| `ai/doc/specs/20260102-001-example-phase-aware-guide-slice.md` | Example only; illustrative, not portable |
| `ai/doc/specs/20260326-001-ai-doc-skill-restructure.md` | Repo-local maintenance spec |
| `ai/doc/specs/20260326-002-ai-namespace-boundary-hardening.md` | Repo-local maintenance spec |
| `ai/doc/specs/20260326-003-split-entrypoints-for-adoption.md` | Repo-local maintenance spec |
| `ai/doc/facts/project-scope.md` (content) | Describes this starter's own scope; not a portable template |
| `ai/doc/facts/golden-cases.md` | Placeholder; no portable content |
| `README.md` §"Adopting this starter" | Describes the starter itself; repo-local adoption guide |
| `CLAUDE.md` (file itself) | Tool adapter; the principle is portable but the file is tool-specific |
| `.cursor/rules/*.mdc` (file format) | Content is portable; Cursor-specific front-matter and `.mdc` format are not |
| "SOP Starter Version" stamp | Repo-local versioning artifact |

---

## Cross-Cutting Protocol Primitives

These are smaller than full SOPs but appear as recurring primitives across multiple source files:

| Primitive | Where it appears | Portable form |
|---|---|---|
| **User-decision routing** (`needs_decision` outcome) | `task-lifecycle-and-escalation.md`, `spec-template`, `design-to-spec-handoff.md`, `writeback.mdc` | Standardize as an explicit escalation outcome in any SOP that involves execution |
| **Completeness check before write-back** (3-question gate) | `AGENTS.md` §Write-back policy, `writeback.mdc` | Reusable gate: "Will this still matter? Can it be reused? Does it have a clear home?" |
| **Spec ownership / executor mutation limits** | `design-to-spec-handoff.md` §Executor Mutation Limits | Executor may only touch Status, Checklist, Risks/Notes — not Goal/Scope/DoneWhen |
| **Test-failure triage** (repair vs rollback vs replan) | `task-lifecycle-and-escalation.md` §Repair vs Rollback vs Replan vs Escalate | Four-way decision tree portable to any task failure scenario |
| **Generated-doc freshness** (index sync rule) | `AGENTS.md` §Write-back policy, `writeback.mdc`, `ai/README.md` §Maintenance rule | "When adding/removing/renaming files, update the index in the same change" |
| **Config/namespace discovery** (entrypoint model) | `AGENTS.md` §Entrypoint model, `CLAUDE.md`, `ai/README.md` | Pattern: one canonical source of truth → adapters defer to it; adapter ≠ second rule system |
| **Status / escalation vocabulary** | `ai/doc/specs/README.md`, `task-lifecycle-and-escalation.md`, `task-spec-template.md` | 8 status values + 2 escalation outcomes as standard vocabulary |
| **Scope creep prevention** | `AGENTS.md` §Boundaries, `scope-control.mdc`, `boundaries.mdc` | "One task, one primary outcome; if broader during work, stop and narrow again" |
| **Plan optionality gate** | `new-project-sop.md`, `AGENTS.md` §Working model, `plan-template.md` | Plans may remain temporary; spec is the default durable artifact — write a plan only when it must be re-read/shared/handed off |
| **Skill promotion trigger** | `AGENTS.md` §Skill promotion rule, `skill-policy.md` | Promote when: repeats + recognizable I/O + reduces reasoning + clearly reusable |

---

## Recommended `.agents` Defaults

These artifacts should ship by default in `.agents` for any AI-assisted engineering workflow:

**Priority 1 — Core execution protocol:**
- `sop/core-engineering-execution-loop.md` (from `new-project-sop.md`)
- `templates/task-spec.md` (from `task-spec-template.md`)
- `skills/plan-to-spec.md` (from `plan-to-spec.md`)
- `sop/task-lifecycle.md` (from `task-lifecycle-and-escalation.md`)

**Priority 2 — Governance + quality:**
- `sop/write-back-policy.md` (from `AGENTS.md` §Write-back + `writeback.mdc`)
- `sop/validation-strategy.md` (from `testing-strategy.md`)
- `skills/validation-whitebox-judgment.md` (from `design-whitebox-tests.md`)
- `sop/skill-promotion-policy.md` (from `skill-policy.md`)

**Priority 3 — Multi-agent + planning:**
- `sop/multi-agent-handoff.md` (from `design-to-spec-handoff.md`)
- `templates/plan.md` (from `plan-template.md`)
- `templates/change-summary.md` (from `change-summary-template.md`)
- `templates/prompt-design-to-planner.md` and `prompt-spec-to-executor.md`

**Priority 4 — Layout convention:**
- `sop/workspace-layout.md` (from namespace boundary model)

---

## Evidence

Specific file/line citations supporting major claims:

1. **Stack-agnostic design intent**: `README.md` line 1 — "A lightweight, tool-neutral SOP starter for AI-assisted engineering"; `AGENTS.md` §Repository purpose — "workflow-oriented and tool-neutral. It is not tied to a specific application stack."

2. **Core 6-step loop**: `AGENTS.md` §Working model — "1. start from a plan... 2. derive or refine one or more narrow task specs... 3. implement the smallest coherent change... 4. validate explicitly... 5. write back stable facts... 6. promote repeated workflows into skills"

3. **Spec as default durable artifact**: `AGENTS.md` §Working model — "Plans may remain temporary. The task spec is the default durable execution artifact for implementation and iteration."

4. **Executor mutation limits**: `design-to-spec-handoff.md` §Executor Mutation Limits — "The executor may update only: Status, Task Checklist, Risks / Notes. The executor should not rewrite: Goal, In Scope, Out of Scope, Done When, Validation, Write-back Needed."

5. **Write-back 3-question gate**: `AGENTS.md` §Write-back policy — "1. Will this still matter later? 2. Can this be reused later? 3. Does it have a clear destination file? If the answer is not clearly yes, do not write it back."

6. **Black-box default validation**: `testing-strategy.md` §1 — "Black-box validation is the default." ; `validation.mdc` — "Black-box validation is the default acceptance path."

7. **Spec completeness ≠ checklist**: `ai/doc/specs/README.md` §Status — "Checklist completion alone does not make a spec `done`. Required validation must also pass."

8. **Skill promotion criteria**: `AGENTS.md` §Skill promotion rule — "Promote a workflow into `ai/skill/*` when: it repeats across tasks; its inputs and outputs are recognizable; its value is not tied to a single one-off task; it reduces repeated reasoning effort; it can be described clearly enough to reuse."

9. **Escalation outcomes vocabulary**: `task-lifecycle-and-escalation.md` §Escalation Outcomes — "`replan_required`: the current spec or parent plan no longer provides a safe shape for the remaining work. `needs_decision`: a scope, priority, dependency, or policy choice must be made above the executor level."

10. **Index sync rule**: `AGENTS.md` §Write-back policy — "When adding, removing, or renaming fact files, keep `ai/doc/facts/facts-index.md` in sync." and "When adding, removing, or renaming skills, keep `ai/skill/skill-registry.md` in sync."

11. **Plan optionality**: `new-project-sop.md` §2 — "A written plan document is optional. Use `ai/doc/templates/plan-template.md` only when the plan should become a durable repo artifact worth re-reading, sharing, or handing off."

12. **Spec naming convention**: `ai/doc/specs/README.md` §Naming — "`ai/doc/specs/YYYYMMDD-NNN-task-slug.md`; choose the next available same-day sequence by scanning existing spec filenames; never renumber existing specs."

13. **Scope creep rule**: `scope-control.mdc` — "If the task becomes broader while working, stop and narrow it again." ; `AGENTS.md` §Boundaries — "Do not let task or sub-plan execution expand project or phase scope without an explicit replan or decision."

14. **Phase hierarchy model**: `phase-aware-workflow.md` §Hierarchy Model — "`project_target → current_target → phase → main_plan → sub_plan → task`; Future runtime can consume this hierarchy as a static anchor for long-running work."

15. **Cursor rule always-apply pattern**: All five `.cursor/rules/*.mdc` files contain `alwaysApply: true` front-matter — these are intended as persistent execution guardrails, not opt-in suggestions.

---

*Audit produced by Scout pass 1. Cross-repo comparison deferred. Final SOP drafting deferred until all repos audited and Human-in-the-Loop review complete.*
