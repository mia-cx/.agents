# Audit Report: ai-engineering-sop
**Audited:** 2026-03-28  
**Source:** raw-findings.md  
**Output:** structured cross-repo comparison artifact

---

## 1. Repo Overview

`ai-engineering-sop` is a starter-kit / reference repository for AI-assisted software engineering workflows. Its purpose is to define a complete plan-first operating model with guardrails around planning, spec-driven execution, fact management, and skill reuse. The repo ships a set of Cursor MDC rules (`.cursor/rules/`), AGENTS.md entrypoint, skill files (`ai/skill/`), procedural guides (`ai/doc/guides/`), fill-in templates (`ai/doc/templates/`), and a small facts layer (`ai/doc/facts/`). It is explicitly designed as a starting scaffold — the `CLAUDE.md` file self-declares as a redirect shim, and `AGENTS.md` acknowledges a "repo structure section" that is scaffold-specific and must be replaced per destination. The working model is a linear six-step sequence: plan → task spec → implement (smallest coherent change) → validate → write-back stable facts → promote repeated workflows to skills. The repo is notably strong on *when not to act*: boundaries, write-back exclusions, and skill-promotion gates are all expressed as concrete negative criteria rather than aspirational lists.

---

## 2. Content Summary

The repo contains 25 audited files across five categories. The `.cursor/rules/` layer holds six MDC rules (`scope-control`, `workflow`, `validation`, `boundaries`, `writeback`, and one or more unlisted); all are flat bullet-list format with `alwaysApply: true` frontmatter — designed as always-loaded standing rules, not on-demand skills. The `ai/skill/` layer holds three skill files (`plan-to-spec`, `skill-policy`, `design-whitebox-tests`) plus a registry index; skill files follow a Purpose / When to use / Inputs / Outputs / Workflow / Failure modes structure. The `ai/doc/guides/` layer holds four procedural guides covering new-project startup, design-to-spec handoff, task lifecycle and escalation, phase-aware workflows, and testing strategy — each is 50–150 lines of structured Markdown. The `ai/doc/templates/` layer holds six fill-in templates (plan, task spec, change summary, project scope, design-to-planner prompt, spec-to-executor prompt); all are Markdown with ATX headings acting as fill-in prompts. The `ai/doc/facts/` layer holds an index file, a project-scope facts doc, and a worked-examples reference — only the index has portable structure. Structuring quality is consistently high: no files over-nest beyond two bullet levels, every file has a clear declared type, and most guides include explicit "what not to do" guardrails alongside procedural steps.

---

## 3. SOP Split

### Port

| File | Description | Reason |
|------|-------------|--------|
| `.cursor/rules/scope-control.mdc` | Keep tasks narrow, one primary outcome; active mid-task correction trigger | Tool-agnostic, zero repo-specific content, directly adoptable as standing rule |
| `.cursor/rules/workflow.mdc` | Plan→spec→implement→validate execution sequence; spec-gate; tiny-task exemption | Eleven clean bullet rules, no tooling coupling after stripping one path ref |
| `.references/ai-engineering-sop/AGENTS.md` | Complete plan-first operating model with write-back gate, skill-promotion gate, validation policy | Five portable sections; structure section is the only scaffold-specific overhead |
| `.cursor/rules/validation.mdc` | Black-box default / white-box conditional validation hierarchy with concrete trigger list | Zero repo-specific content; `alwaysApply: true` signals standing-rule placement |
| `.cursor/rules/boundaries.mdc` | Anti-scope-creep constraints: no speculative abstractions, no opportunistic refactors, no future-phase work | Two lines of repo-layout rules must be stripped; six portable bullets remain |
| `.cursor/rules/writeback.mdc` | Three-question write-back gate; stable/unstable distinction; routing prohibitions | Path conventions are repo-specific; the gate logic and prohibitions are universal |
| `ai/skill/plan-to-spec.md` | Nine-step SOP for decomposing a plan into narrow task specs with explicit validation and write-back decisions | Strip output-path convention; status-enum and failure-modes catalogue are the highest-value extractable content |
| `ai/skill/skill-policy.md` | Four-bullet when-to-create / four-bullet when-not-to-create gate for skill promotion | Already minimal; paste verbatim into `skill-create` as a "when to create" section |
| `ai/skill/design-whitebox-tests.md` | Heuristics for deciding when and what to test internally; "what not to assert" list; bugfix regression guidance | No repo-specific content; "what not to assert" section is unusually high signal |
| `ai/doc/guides/new-project-sop.md` | Six-step project startup sequence; phase-aware and multi-model opt-in variant branches | Strip all `ai/` internal path cross-references; entrypoints section is scaffold meta-commentary only |
| `ai/doc/guides/design-to-spec-handoff.md` | Three-role model (Design Partner / Planner-Specifier / Executor) with handoff contracts, artifact policy, executor mutation limits | Strip example model mapping (ChatGPT/Codex/Cursor) and local path refs; executor mutation limits section worth verbatim preservation |
| `ai/doc/guides/task-lifecycle-and-escalation.md` | Canonical status vocabulary (draft→done), four-way failure decision rule (repair/rollback/replan/escalate), default transition table | No repo-specific content; pairs with any spec-tracking SOP |
| `.references/ai-engineering-sop/ai/doc/guides/phase-aware-workflow.md` | Planning hierarchy (project_target→phase→task), phase field contract (entry/exit criteria, allowed/forbidden actions, gate_checks), task spec field contract with repair budget and rollback scope | Strip opening framing sentence and "future runtime" references; phase gate fields are immediately portable |
| `ai/doc/guides/testing-strategy.md` | Layered validation philosophy: black-box default, white-box conditional; bugfix-first rule; anti-overfitting guardrails | No repo-specific content; complement to TDD skills; bugfix-first rule is distinctive and high-value |
| `ai/doc/templates/design-to-planner-prompt-template.md` | Design-to-planner handoff scaffold with input sections and "stop when not ready" output contract | Already clean; explicit "stop when not ready" contract is the strongest portable element |
| `ai/doc/templates/spec-to-executor-prompt-template.md` | Executor dispatch scaffold with scope boundary, validation gate, escalation signals, writeback permissions | "Executor may only update Status/Checklist/Notes" contract and `needs_decision`/`replan_required` signals are portable verbatim |
| `ai/doc/templates/plan-template.md` | Plan artifact scaffold: metadata, phase context with entry/exit criteria and forbidden actions, task breakdown | Entry/Exit Criteria + Gate Checks trio is especially portable as a phase-readiness gate |
| `ai/doc/templates/task-spec-template.md` | Task spec schema: goal, scope, validation (black-box + white-box), repair budget, rollback scope, escalation condition, write-back labels | Status lifecycle and repair-budget concept are unusual and high-signal; write-back labels form a lightweight knowledge-management taxonomy |
| `ai/doc/templates/change-summary-template.md` | Seven-section post-task closure template: what changed, scope, validation, regression protection, knowledge write-back, remaining gaps | Already minimal; "Facts / Skills Updated" section especially valuable for agentic workflows; pairs with cot-gate as a before/after closure pair |
| `ai/doc/templates/project-scope-template.md` | Three-level goal hierarchy (project / current / phase), in/out of scope, constraints, assumptions, risks | Clean eight-section skeleton; explicit "Out of Scope" and "Open Risks" sections often omitted in lightweight templates |
| `ai/doc/facts/facts-index.md` | Write-back routing taxonomy (`facts_update`, `skill_promotion`, `decision_rationale`, `phase_lesson`, `task_pattern`, `anti_pattern`) with stable/ephemeral classification criteria | Strip `AGENTS.md` and file-path references; routing taxonomy is the highest-value extract |

### Leave Out

| File | Description | Reason |
|------|-------------|--------|
| `.references/ai-engineering-sop/CLAUDE.md` | Six-line redirect shim pointing to AGENTS.md | Zero procedural content; pure adapter/redirect overhead; no steps, rules, or decisions present |
| `ai/skill/skill-registry.md` | Two-row lookup table mapping skill names to purpose/trigger/inputs/outputs | No extractable SOP content; repo-internal housekeeping artefact; individual skill files cover the substance |
| `ai/doc/facts/project-scope.md` | Scope/phase/constraints/risks for the `ai-engineering-sop` repo itself | Every field is self-referential; porting requires rewriting every section; only the section structure (template shell) has any reuse value |
| `ai/doc/facts/golden-cases.md` | Three canonical test cases for this repo's internal workflows | All cases illustrate this repo's own validation model; nothing survives stripping; template shape (Input → Expected outcome → Why it matters) is the only extractable pattern |

---

## 4. Per-SOP Table

| Source file | Trigger | Steps/contract (summary) | Quality bar | Escalation | Strip | Notes |
|-------------|---------|--------------------------|-------------|------------|-------|-------|
| `.cursor/rules/scope-control.mdc` | Task being defined or scope drifting mid-execution | Keep tasks narrow; one task → one primary outcome; stop and narrow again if scope grows during work | Six bullets; no filler; active mid-task correction trigger present | Not applicable (standing rule) | Nothing | "Stop and narrow it again" imperative is rare and high-value; promotes as-is |
| `.cursor/rules/workflow.mdc` | Start of any implementation task; deciding whether to write a spec before editing code | Start from plan → derive spec → implement after boundary is clear → validate → write back when justified → promote stable workflows to skills | Eleven bullets; no role-theater; maps directly to a skill checklist | Not applicable (standing rule) | `ai/skill/plan-to-spec.md` path reference; `alwaysApply: true` frontmatter | Spec-gate ("implement only after task boundary is clear") and tiny-task exemption are both well-calibrated; skill-promotion heuristic is a useful meta-rule |
| `.references/ai-engineering-sop/AGENTS.md` | Onboarding an agent into any AI-assisted engineering workflow | Plan → spec → implement smallest change → validate → write-back (three-question gate) → promote (five-criterion checklist) | Five portable sections; write-back gate and skill-promotion checklist are concrete negative criteria; no role-theater | Not defined in file | Repo-structure section; entrypoint model section; editing-expectations section | Strongest on *when not to act*; write-back gate and skill-promotion checklist are directly promotable as standalone decision rules |
| `.cursor/rules/validation.mdc` | Any implementation task requiring a validation or testing decision | Black-box is default acceptance path; white-box supplements for: core branch behavior, state transitions, deterministic bugfix regressions, matchers/parsers/schedulers/rules engines/caches/traces/analyzers; validation must be explicit enough to review; avoid raw coverage numbers | Eight bullets; zero repo-specific content; `alwaysApply: true` | Not applicable (standing rule) | Nothing | White-box trigger list (matchers, parsers, schedulers, rules engines, caches, traces, analyzers) is the highest-value portable element; concrete enough to be action-guiding |
| `.cursor/rules/boundaries.mdc` | Any agentic task involving code or doc changes | No speculative abstractions; no opportunistic refactors; no unrelated module edits; no future-phase work; prefer existing structures; narrow ambiguous work | Six portable bullets; `alwaysApply: true` | Not applicable (standing rule) | Two `ai/` directory-layout lines | "Do less, not more" principle; could slot into cot-gate pre-task guard block |
| `.cursor/rules/writeback.mdc` | After any task that produced stable facts, reusable procedures, or workflow patterns | Ask three questions before writing back; write back scope clarifications, reusable validation references, stable workflow rules; do not write back debugging notes, experiments, one-off chatter | Three-section structure: decision gate / write-back targets / write-back prohibitions; high signal-to-noise | Not applicable (standing rule) | Routing label taxonomy; path conventions (`ai/doc/facts/*`, `ai/skill/*`) | Meta-warning ("do not let the taxonomy create a new archive") is worth keeping; index-maintenance pattern (maintain registry when adding/removing artefacts) is portable |
| `ai/skill/plan-to-spec.md` | Plan or phase slice exists and work is about to move into implementation | (1) Start from current slice → (2) one spec, one primary outcome → (3) split when spec becomes large → (4) make execution contract explicit (in-scope, out-of-scope, done condition) → (5) add lightweight execution state → (6) validate black-box default → (7) judge white-box need → (8) decide write-back deliberately → (9) add failure boundaries only when helpful | Nine numbered steps; failure modes catalogue; status-enum list (`draft → rolled_back → done`) | Escalate when task boundary is unclear; when validation is insufficient; when scope has grown | Output path convention (`ai/doc/specs/`); `ai/doc/specs/README.md` and `AGENTS.md` cross-references | Phase-awareness fields (`project_target`, `current_target`, `main_plan/sub_plan`, `Parent Phase`, `Parent Plan`) are optional extensions — mark as "for longer-running or dependency-heavy work only" |
| `ai/skill/skill-policy.md` | Deciding whether to promote an ad-hoc workflow to a named skill, or reviewing existing skills for pruning | Four-bullet when-to-create: (repeatable workflow, recognisable I/O, reduces repeated reasoning, reusable beyond one-off); four-bullet when-not-to-create; quality bar: practical, compact, operational | Already minimal; one intro paragraph + two bullet lists + closing quality bar | Not defined | Nothing | Pairs naturally with `skill-create` skill; could be embedded as a "When to create a skill" section |
| `ai/skill/design-whitebox-tests.md` | Task changes branch-heavy logic, state transitions, deterministic bugs, caches, parsers, schedulers, or rules engines | (1) Evaluate white-box need → (2) identify internal logic worth protecting (branches, state transitions, error paths, rollback, cache invalidation, intermediate invariants, regression paths) → (3) identify what not to assert (helper call order, implementation trivia, brittle naming) → (4) for bugfixes, convert root cause into regression-protecting test | Eight sections including "What not to assert" and "Common failure modes"; high signal-to-noise | Not defined | Nothing | "What not to assert" and "Common failure modes" sections prevent common over-testing anti-patterns; pairs naturally with a black-box/acceptance-test skill |
| `ai/doc/guides/new-project-sop.md` | Starting a new project, introducing structure into an existing project, or beginning a long-running phase | (1) Establish scope + first reviewable slice → (2) establish plan (problem/goal/non-goals/constraints/risks/phased direction/first slice) → (3) derive narrow specs → (4) decide starter/skeleton work deliberately after planning → (5) validate in layers (black-box default, white-box when complexity warrants) → (6) write back stable facts only; optionally promote repeatable workflows | Numbered startup checklist with named sub-steps; two clearly-gated variant branches (phase-aware, multi-model); concise without being terse | Not defined in file | All `ai/` internal path references; "Entrypoints In Copied Projects" section; specific fact-file references (`project-scope.md`, `golden-cases.md`) | Lightweight-by-default framing worth preserving verbatim ("The goal is one or more small specs, not one large spec"); phase-aware and multi-model variant sections position themselves as extensions, not replacements |
| `ai/doc/guides/design-to-spec-handoff.md` | Design, planning, and execution are split across models or people; team needs guardrails against executor scope expansion | (1) Design discussion + summary if handoff needed → (2) planner inspects repo and refines plan/phase slice → (3) derive narrow specs → (4) hand one spec at a time to executor → (5) validate against spec → (6) return `replan_required` or `needs_decision` to planner on boundary changes | Role-contract tables, artifact policy, handoff gate checklists, executor mutation limits, failure modes list | Executor returns `replan_required` or `needs_decision` to planner when boundary changes | Example model mapping (ChatGPT/Codex/Cursor); cross-references to `ai/doc/specs/README.md` and `ai/doc/guides/task-lifecycle-and-escalation.md` | Executor mutation limits section (which spec fields executors may/may not rewrite) is unusually precise; failure modes list is concise and high-signal |
| `ai/doc/guides/task-lifecycle-and-escalation.md` | Task needs explicit lifecycle tracking; validation failure must be categorised; work crossing a decision boundary | (1) Assign canonical status (draft → todo → in_progress → validating → repairing → rolled_back → blocked → done) → (2) on failure, classify as repair / rollback / replan_required / needs_decision → (3) apply default transition rule → (4) keep lifecycle handling proportional to task complexity | Clear H2 sections; bullet lists for status values and transitions; four-quadrant trigger guide; "not a workflow engine" framing preserved | Escalate (`needs_decision`) when none of repair/rollback/replan applies; when problem is outside the executor's authority | "Practical Reminder" prose can be trimmed to one line if brevity is prioritised | Framing "guidance for human and AI operators, not a workflow engine" worth preserving verbatim; pairs naturally with any task-spec SOP needing defined exit conditions |
| `.references/ai-engineering-sop/ai/doc/guides/phase-aware-workflow.md` | Long-running or multi-handoff work needing stable phase anchoring, visible target hierarchy, or explicit task-boundary contracts across agents or sessions | (1) Decide if phase-aware mode is needed → (2) anchor project_target and current_target → (3) define active phase with entry_criteria, exit_criteria, deliverables, allowed_actions, forbidden_actions, gate_checks → (4) choose main_plan vs sub_plan → (5) author task specs mapping back to Parent Phase + Parent Plan, with Inputs, Expected Outputs, Allowed/Disallowed Edits, Repair Budget, Rollback Scope, Escalation Condition → (6) maintain invariants | Seven headed sections; hierarchical terminology glossary; field lists for phases and task specs; explicit "when to use / when not to use" gate | Escalation condition is a named required field in high-risk task specs | Opening framing sentence ("extension of the repository's existing SOP"); "future runtime" references | Phase field contract (entry/exit criteria, allowed/forbidden actions, gate_checks) immediately portable as phase-gate checklist; "Do not force heavyweight planning onto every small task" caveat prevents cargo-cult overhead |
| `ai/doc/guides/testing-strategy.md` | Any time a task involves writing, reviewing, or deciding on tests | (1) Default to black-box validation → (2) add white-box conditionally for branch-heavy logic, state transitions, deterministic bugfix root causes, complex internals → (3) target white-box at branch selection, state transitions, error handling, rollback, cache invalidation → (4) avoid overfitting white-box tests to call order, local variable names, or brittle implementation details → (5) for deterministic bugs, prefer regression-protecting root-cause test (bugfix-first rule) → (6) do not optimize for raw coverage percentage | Six H2 sections; ~50 lines; clean imperative bullet lists; negative guardrails paired with positive guidance in each section | Not defined | Nothing | Bugfix-first rule is the most distinctive element; fills the "what to test and why" gap that pure TDD workflow skills leave implicit; overall signal-to-noise ratio excellent |
| `ai/doc/templates/design-to-planner-prompt-template.md` | Handing design discussion output to a planner/specifier agent to produce or clarify a plan/spec slice | (1) Fill input sections: design summary, goal, non-goals, constraints, risks, repo context, open questions, desired next step → (2) planner inspects repo context, clarifies or derives narrow specs when implementation-ready, names validation paths and spec-split triggers → (3) if not ready, planner stops and lists "why not yet" + missing decisions explicitly; guardrails: planner must not implement directly, must not copy transient design notes to repo docs, must not combine multiple primary outcomes into one spec | Markdown heading sections for each input field + numbered output contract bullets + constraint list | Planner stops and explicitly lists blockers when work is not ready | Nothing | "Stop when not ready" contract is the strongest portable element; prevents premature spec generation; pairs naturally with any spec-first / tracer-bullet workflow |
| `ai/doc/templates/spec-to-executor-prompt-template.md` | Handing a spec to an executor agent for a bounded implementation pass; especially useful in multi-agent or planner/executor pipelines | (1) Fill in Target Spec Path, Allowed Scope, Forbidden Scope, Validation Expectations, Escalation Expectations, Completion Reporting Format, Stop/Fallback Conditions → (2) executor consumes one spec at a time, stays inside boundary, validates before reporting done → (3) executor may only update Status, Task Checklist, Risks/Notes — never rewrites core spec fields → (4) executor stops and returns when boundary is unclear, validation is insufficient, scope has grown, or work needs splitting/decision | Input block + prose Execution Contract + Fallback Conditions list | Executor returns `needs_decision` or `replan_required` to planner | "This is a prompt scaffold, not a durable project document." note (contextual only) | "Executor may only update Status/Checklist/Notes" writeback contract is the most portable and reusable element; `needs_decision`/`replan_required` signals worth preserving verbatim |
| `ai/doc/templates/plan-template.md` | Creating a plan document, hand-off plan, or multi-phase implementation roadmap that needs to become a shared/reviewable artifact | (1) Classify plan level (main_plan vs sub_plan) → (2) fill metadata: Project Target, Current Target, Parent Plan, Current Phase → (3) fill Phase Context: Purpose, Entry/Exit Criteria, Deliverables, Allowed/Forbidden Actions, Gate Checks → (4) fill Problem, Goal, Non-goals, Constraints → (5) fill Proposed Approach and Risks → (6) fill Phase Split / Task Breakdown → (7) define First Slice (first reviewable deliverable) | Markdown template with ATX headings; plan-level classification as required enum choice | Not defined | Nothing | Entry/Exit Criteria + Gate Checks trio especially portable as phase-readiness gate pattern; Forbidden Actions section unusual but valuable for scope control inside a phase |
| `ai/doc/templates/task-spec-template.md` | Creating a task spec, narrowing a plan slice into an actionable unit, or defining acceptance criteria for a bounded piece of work | (1) Fill Metadata: Source Plan, Status → (2) write Goal (one crisp sentence) → (3) declare In Scope / Out of Scope → (4) optionally fill phase-aware fields: Inputs, Expected Outputs, Allowed/Disallowed Edits → (5) write Task Checklist (3–7 outcome-oriented items) → (6) write Done When → (7) fill Validation (black-box checks, white-box yes/no, trigger, internal logic to protect) → (8) fill Repair/Rollback if risk warrants → (9) declare Write-back Needed (yes/no + label + destination) | Markdown with `##`/`###` sections; checkbox task list; status as fixed enum; write-back labels as defined vocabulary | Escalation condition is a named fill-in field; `needs_decision` is an explicit escalation label | `Parent Phase` / `Parent Plan` / `Related Specs` navigation fields; file naming convention (`YYYYMMDD-NNN-task-slug.md`); storage path (`ai/doc/specs/`) | Status lifecycle (`draft → validating → repairing → rolled_back`) and repair-budget concept are unusual and high-signal; write-back labels act as lightweight knowledge-management taxonomy |
| `ai/doc/templates/change-summary-template.md` | After completing any implementation slice, bug fix, or feature work — fills gap between "code merged" and "session closed" | (1) Summarize what changed → (2) confirm planned scope completed → (3) record black-box validation performed → (4) record white-box validation if required → (5) note regression path now protected → (6) list facts/skills updated → (7) enumerate remaining gaps or deferrals | Seven-section Markdown template with H2 headers; validation section has two H3 sub-headers (Black-box / White-box) | Not defined | Nothing | "Facts / Skills Updated" section especially valuable for agentic workflows where session memory must be written back explicitly; "Regression Path Protected" is a strong forcing function for test coverage thinking; complements cot-gate as a before/after closure pair |
| `ai/doc/templates/project-scope-template.md` | Starting a new project or phase; writing a scope doc; onboarding a team to an active workstream; pre-sprint planning | (1) Stable top-level objective → (2) narrower active objective → (3) current phase goal → (4) in-scope items → (5) out-of-scope items → (6) key constraints → (7) current assumptions → (8) open risks | Markdown headings-only template; each section is a single guiding question acting as placeholder; compact (≤20 lines) | Not defined | Nothing | Three-level goal hierarchy (project / current / phase) prevents scope-creep at each layer; explicit "Out of Scope" and "Open Risks" sections are production-grade additions often omitted from lightweight scope templates |
| `ai/doc/facts/facts-index.md` | Agent needs to decide whether information is worth persisting, or where to route a write-back | (1) Classify candidate content against stable/reusable/useful-to-future-runs criteria → (2) consult routing taxonomy to pick destination → (3) update index whenever fact files are added, removed, or renamed | Flat Markdown with use-when list, do-not-store list, file-map section, and routing-taxonomy table | Not defined | References to `AGENTS.md` write-back policy; specific file names `project-scope.md` / `golden-cases.md` | Routing taxonomy (`facts_update`, `skill_promotion`, `decision_rationale`, `phase_lesson`, `task_pattern`, `anti_pattern`) is the highest-value extract — shared vocabulary for write-back decisions; consider promoting as standalone section in a `knowledge-routing` SOP |

---

## 5. Portability Ranking

### High — Promote as-is or with minimal stripping

- `.cursor/rules/scope-control.mdc` — zero overhead, active mid-task correction trigger, six bullets
- `.cursor/rules/validation.mdc` — zero overhead, concrete white-box trigger list, `alwaysApply` standing rule
- `ai/doc/guides/testing-strategy.md` — zero overhead, bugfix-first rule, anti-overfitting guardrails, six clean sections
- `ai/skill/design-whitebox-tests.md` — zero overhead, "what not to assert" section, common failure modes catalogue
- `ai/skill/skill-policy.md` — already minimal, paste verbatim into `skill-create`
- `ai/doc/guides/task-lifecycle-and-escalation.md` — zero overhead, shared status vocabulary, four-way failure decision rule, "not a workflow engine" framing
- `ai/doc/templates/change-summary-template.md` — zero overhead, seven-section closure template, before/after cot-gate pairing

### Medium — Strip 1–3 sections, then promote

- `.cursor/rules/workflow.mdc` — strip one path ref and Cursor frontmatter; eleven-bullet execution sequence is the core
- `.references/ai-engineering-sop/AGENTS.md` — strip three sections (repo structure, entrypoint model, editing expectations); five portable sections remain
- `.cursor/rules/writeback.mdc` — strip routing label taxonomy and path conventions; gate logic and prohibitions survive
- `ai/skill/plan-to-spec.md` — strip output-path convention and cross-references; nine-step SOP and status-enum are the core
- `ai/doc/guides/new-project-sop.md` — strip all `ai/` path references and entrypoints section; six-step startup sequence survives intact
- `ai/doc/guides/design-to-spec-handoff.md` — strip model-mapping examples and local path refs; three-role model and executor mutation limits survive
- `ai/doc/templates/task-spec-template.md` — strip navigation fields and storage path; schema survives with status lifecycle and repair budget intact
- `ai/doc/templates/spec-to-executor-prompt-template.md` — strip contextual note; executor mutation contract and escalation signals survive
- `ai/doc/templates/project-scope-template.md` — zero stripping needed; high value despite compact size
- `ai/doc/facts/facts-index.md` — strip `AGENTS.md` reference and project-specific file names; routing taxonomy is the extractable core

### Partial — Core principle worth extracting; file not directly promotable

- `.cursor/rules/boundaries.mdc` — six portable anti-scope-creep bullets survive after stripping two repo-layout lines; consider merging into cot-gate guard block rather than standalone file
- `.references/ai-engineering-sop/ai/doc/guides/phase-aware-workflow.md` — high value but heavyweight; phase gate field contract (entry/exit/allowed/forbidden/gate_checks) and task spec contract (repair budget, rollback scope, escalation condition) are extractable as addenda to lighter-weight SOPs; strip opening framing and "future runtime" aspirational references
- `ai/doc/templates/plan-template.md` — Entry/Exit Criteria + Forbidden Actions sections are the portable core; file is most valuable as a companion to `plan-to-spec` rather than a standalone promotion
- `ai/doc/templates/design-to-planner-prompt-template.md` — "stop when not ready" contract is the portable element; can be folded into `design-to-spec-handoff.md` rather than promoted separately

---

## 6. Cross-cutting Protocol Primitives

Patterns smaller than a full skill that appear in multiple files across the repo.

**1. Spec-gate** (appears in: `workflow.mdc`, `AGENTS.md`, `plan-to-spec.md`, `new-project-sop.md`, `spec-to-executor-prompt-template.md`)  
"Implement only after task boundary is clear." Expressed as both a pre-implementation gate and an active correction trigger — not just a checklist item.

**2. Black-box-default / white-box-conditional validation split** (appears in: `validation.mdc`, `AGENTS.md`, `plan-to-spec.md`, `testing-strategy.md`, `design-whitebox-tests.md`, `task-spec-template.md`, `change-summary-template.md`)  
Consistent across seven files: black-box is the default acceptance mechanism; white-box supplements for branch-heavy, stateful, regression-sensitive, or fragile logic only. The same trigger criteria (matchers, parsers, schedulers, rules engines, caches, traces, analyzers) appear verbatim in multiple places.

**3. Three-question write-back gate** (appears in: `writeback.mdc`, `AGENTS.md`, `plan-to-spec.md`, `task-spec-template.md`, `facts-index.md`)  
Before writing back: (1) will this still matter later? (2) is it reusable? (3) does it have a clear home? If not clearly yes → do not write back. Consistent across five files.

**4. Repair/rollback/replan/escalate four-way failure classification** (appears in: `task-lifecycle-and-escalation.md`, `phase-aware-workflow.md`, `task-spec-template.md`, `spec-to-executor-prompt-template.md`)  
Shared vocabulary with consistent meanings across files; `needs_decision` and `replan_required` are the two escalation labels.

**5. "Do not act" guardrails as concrete negative criteria** (appears in: `boundaries.mdc`, `AGENTS.md`, `writeback.mdc`, `skill-policy.md`, `phase-aware-workflow.md`)  
Every major SOP in the repo includes an explicit list of when *not* to apply it (when not to write back, when not to create a skill, when not to use phase-aware mode, when not to add failure boundaries). Negative gates are given equal structural weight to positive steps — a design choice uncommon in other reference repos.

**6. Status enum `draft → todo → in_progress → validating → repairing → rolled_back → blocked → done`** (appears in: `plan-to-spec.md`, `task-lifecycle-and-escalation.md`, `task-spec-template.md`)  
Shared eight-state lifecycle used consistently as a required spec field and a state machine in the lifecycle guide.

**7. Tiny-task / lightweight-by-default exemption** (appears in: `workflow.mdc`, `plan-to-spec.md`, `new-project-sop.md`, `phase-aware-workflow.md`, `task-lifecycle-and-escalation.md`)  
Consistently framed: small or trivially narrow tasks may skip spec, phase structure, failure boundaries, or white-box validation — the SOP provides opt-out gates, not mandatory overhead. The phrase "keep lifecycle handling proportional to task complexity" appears in multiple forms across files.

**8. Index-maintenance obligation** (appears in: `writeback.mdc`, `facts-index.md`, `skill-registry.md`)  
Update a registry index whenever a fact file or skill file is added, removed, or renamed. Pattern is portable; specific index files (`facts-index.md`, `skill-registry.md`) are repo-local.

---

## 7. Default Recommendation

**Ship as standing rules** (load unconditionally into every session):
- `scope-control` — six bullets, zero overhead, active mid-task correction trigger
- `validation` — eight bullets, white-box trigger list, zero overhead
- `boundaries` (stripped) — six anti-scope-creep bullets merged into a single `rules/task-boundaries.md`
- Core `AGENTS.md` sections: working model (plan→spec→implement→validate→write-back→promote), write-back gate, skill-promotion gate — merged into existing `rules/` or a new `rules/workflow-model.md`

**Ship as on-demand skills** (trigger-activated):
- `plan-to-spec` — as a standalone `skills/plan-to-spec/SKILL.md` with status-enum, failure-modes, and write-back decision step
- `design-whitebox-tests` — as `skills/design-whitebox-tests/SKILL.md`; pairs with existing `tdd` skill
- `task-lifecycle-and-escalation` — as `skills/task-lifecycle/SKILL.md`; shared vocabulary for any spec-tracking workflow
- `new-project-sop` — as `skills/new-project/SKILL.md`; six-step startup sequence with phase-aware and multi-model opt-in addenda
- `design-to-spec-handoff` — as `skills/design-handoff/SKILL.md`; executor mutation limits section worth verbatim inclusion
- `testing-strategy` — fold into existing `skills/tdd/SKILL.md` as a "what to test and why" section; bugfix-first rule and anti-overfitting guardrails are the primary additions
- `skill-policy` — fold into existing `skills/skill-create/SKILL.md` as a "When to create a skill" section

**Ship as templates** (reference artifacts, not skills):
- `task-spec-template.md` — into `.plans/` or a `templates/` directory with status lifecycle and repair-budget fields intact
- `plan-template.md` — companion artifact to `plan-to-spec` skill
- `change-summary-template.md` — as the close-out pair to cot-gate; consider referencing from `self-validation` skill
- `project-scope-template.md` — companion to `prd-create` and `prd-to-plan` skills

**Do not ship** (leave in reference repo):
- `skill-registry.md`, `facts-index.md` (routing taxonomy only, extract into knowledge-routing policy if needed), `project-scope.md`, `golden-cases.md`, `CLAUDE.md`

**Phase-aware-workflow and writeback** are lowest-priority for default shipping — valuable but heavyweight. Make them opt-in addenda to `plan-to-spec` and the write-back standing rule, respectively, rather than standalone promoted artifacts.

---

## 8. Structural Patterns

### Frontmatter schemas

Cursor `.mdc` files use `alwaysApply: true` as the sole frontmatter field — a binary unconditional-load flag with no description or trigger metadata. Skill files use a prose Purpose section rather than YAML frontmatter. Neither approach carries a trigger description, which means skill-selection logic must live in rule files or AGENTS.md. This contrasts with `skills/<name>/SKILL.md` conventions in other repos where trigger and description are first-class frontmatter fields.

### Naming conventions

All `.cursor/rules/` files use lowercase kebab-case with `.mdc` extension. Skill files use lowercase kebab-case with `.md`. Guide files use descriptive kebab-case nouns (`task-lifecycle-and-escalation.md`, `design-to-spec-handoff.md`). Template files are prefixed by artifact type (`task-spec-template.md`, `plan-template.md`). Fact files are short and noun-only (`project-scope.md`, `golden-cases.md`). The naming pattern is consistent and legible; no numerics or dates in filenames except the spec naming convention (`YYYYMMDD-NNN-task-slug.md`) which is repo-local.

### Packaging patterns worth adopting

- **Negative gates with equal structural weight as positive steps** — every SOP includes a "when not to use" or "do not" list given the same prominence as the procedural steps. Prevents mechanical over-application.
- **Proportionality framing** — lightweight-by-default explicit in every guide ("keep lifecycle handling proportional to task complexity"; "tiny tasks may skip spec"; "add failure boundaries only when they help"). Prevents cargo-cult overhead accumulation.
- **One-file, one-concept discipline** — each file declares its type in its opening line or frontmatter, has a single declared trigger, and cross-references other files rather than duplicating content. Cross-reference stripping is clean because no file inlines content from another.
- **Shared vocabulary across all files** — status enum, validation split, write-back gate, and escalation labels are defined once and referenced consistently. Promotes without requiring per-file redefinition.
- **Failure modes sections in skill files** — `plan-to-spec.md` and `design-whitebox-tests.md` both include explicit "Common failure modes" sections documenting predictable misapplications of the skill. Worth adopting in any promoted skill.

### Packaging patterns worth avoiding

- **Redirect shim files** (`CLAUDE.md`) — a file whose only job is to announce it is not the real file. Adds zero value; creates a navigation overhead that degrades discoverability.
- **Standalone registry files** (`skill-registry.md`) — a two-row table that must be kept in sync with the files it indexes. The maintenance obligation is real; the lookup value is replaceable by a README or AGENTS.md catalogue. Do not promote.
- **"Editing expectations" meta-governance sections** (in `AGENTS.md`) — rules for maintaining the AGENTS.md file itself. Self-referential housekeeping content that becomes confusing when the file is ported. Strip before promoting.
- **`ai/` namespace as a required convention** — the repo assumes all AI-managed workflow assets live under `ai/`. This assumption is baked into every cross-reference and must be stripped for destination repos that use a different layout (`skills/`, `.plans/`, etc.). Treat as project-specific scaffolding, not a portable convention.

---

## 9. Evidence

All citations reference specific locations in `raw-findings.md`.

1. **Scope-control six-bullet rule with active mid-task correction** — `.cursor/rules/scope-control.mdc` entry: *"The 'stop and narrow it again' imperative is particularly strong — it provides an active mid-task correction trigger, not just a pre-task checklist item."*

2. **CLAUDE.md as redirect shim with zero procedural content** — `.references/ai-engineering-sop/CLAUDE.md` entry: *"Role-theater overhead at its purest — a file whose only job is to announce it is not the real file."* and *"Six-line stub; 'adapter entry point' self-declaration; no sections, no steps, no examples."*

3. **Spec-gate and tiny-task exemption in workflow.mdc** — `.cursor/rules/workflow.mdc` entry: *"The spec-gate ('implement only after task boundary is clear') and the 'tiny task exemption' are both well-calibrated guardrails worth preserving verbatim."*

4. **AGENTS.md write-back gate and skill-promotion checklist** — `.references/ai-engineering-sop/AGENTS.md` entry: *"Notably strong on *when not to act* — boundaries, write-back exclusions, and skill-promotion gates are all expressed as concrete negative criteria, which is rare and high-value."*

5. **White-box trigger list as highest-value portable element from validation.mdc** — `.cursor/rules/validation.mdc` entry: *"The white-box trigger list (matchers, parsers, schedulers, rules engines, caches, traces, analyzers) is the highest-value portable element — concrete enough to be action-guiding without being tied to any specific codebase."*

6. **Phase-aware-workflow phase field contract as immediately portable** — `.references/ai-engineering-sop/ai/doc/guides/phase-aware-workflow.md` entry: *"The phase field contract (entry/exit criteria, allowed/forbidden actions, gate_checks) is immediately portable as a phase-gate checklist. The task spec field contract (Repair Budget, Rollback Scope, Escalation Condition) fills a gap not seen in other repos."*

7. **skill-registry.md has no extractable SOP content** — `ai/skill/skill-registry.md` entry: *"Contains only two rows (plan-to-spec, design-whitebox-tests) and its sole function is to stay in sync with a local directory. No reusable process logic, decision rules, or behavioural guidance lives here."*

8. **Executor mutation limits section as unusually precise** — `ai/doc/guides/design-to-spec-handoff.md` entry: *"the executor mutation limits section (which spec fields executors may/may not rewrite) is unusually precise and worth preserving verbatim."*

9. **Task-spec-template repair-budget concept as unusual and high-signal** — `ai/doc/templates/task-spec-template.md` entry: *"The status lifecycle (`draft → validating → repairing → rolled_back`) and the repair-budget concept are unusual and high-signal — worth preserving verbatim in any promoted skill."*

10. **testing-strategy.md bugfix-first rule as the most distinctive element** — `ai/doc/guides/testing-strategy.md` entry: *"The 'bugfix-first rule' section is the most distinctive element and worth promoting verbatim."* and *"Overall signal-to-noise ratio is excellent; no trimming needed."*

11. **facts-index.md routing taxonomy as the highest-value extract** — `ai/doc/facts/facts-index.md` entry: *"The routing taxonomy is the highest-value extract — it gives agents a shared vocabulary for write-back decisions without requiring them to invent ad-hoc file types."*

12. **change-summary-template.md "Regression Path Protected" as forcing function** — `ai/doc/templates/change-summary-template.md` entry: *"'Regression Path Protected' is a strong forcing function for thinking about test coverage."*

13. **project-scope.md content has zero portability; section structure does** — `ai/doc/facts/project-scope.md` entry: *"Every field is self-referential — the 'project target', in-scope items, and assumptions describe the repo's own design intent, not a transferable procedure. Porting it to another project would require rewriting every section."*

14. **plan-to-spec.md phase-awareness fields are optional extensions, not required overhead** — `ai/skill/plan-to-spec.md` entry: *"The phase-awareness fields (project_target, current_target, main_plan/sub_plan, Parent Phase, Parent Plan) are optional extensions for multi-phase projects — they should be preserved but clearly marked as 'for longer-running or dependency-heavy work only' to avoid overhead on simple tasks."*
