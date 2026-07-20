
## .cursor/rules/scope-control.mdc
**Type**: rule
**Portable**: yes
**Reason**: Concise, tool-agnostic principle that applies to any agent or human performing a multi-step task.
**Trigger**: Any time a task is being defined or has drifted in scope mid-execution.
**Steps/contract**: Keep tasks narrow and reviewable. One task → one primary outcome. If a task mixes design, implementation, migration, and cleanup, split it. Keep the review surface small. If multiple implementation paths exist, choose the smallest one that fits the current phase. If the task becomes broader while working, stop and narrow it again.
**Strip**: Nothing — the rule is already minimal with no role-theater or tooling coupling.
**Structure/format**: Six bullet points under a single heading; alwaysApply frontmatter means it loads unconditionally. Could slot directly into a standing `rules/` file or as a preamble constraint in any skill.
**Notes**: Excellent signal-to-noise ratio. The "stop and narrow it again" imperative is particularly strong — it provides an active mid-task correction trigger, not just a pre-task checklist item. Promote as-is.

## .references/ai-engineering-sop/CLAUDE.md
**Type**: config
**Portable**: no
**Reason**: Pure adapter/redirect shim — contains no procedural content, only pointer rules telling Claude to defer to AGENTS.md.
**Trigger**: N/A — not a standalone SOP candidate.
**Steps/contract**: 1. Treat AGENTS.md as primary entrypoint. 2. Use ai/README.md for namespace map. 3. Follow .cursor/rules/*, ai/doc/*, ai/skill/* as referenced by AGENTS.md. 4. AGENTS.md wins on any conflict with this file.
**Strip**: Everything — the entire file is meta-routing overhead with no durable procedural core.
**Structure/format**: Six-line stub; "adapter entry point" self-declaration; no sections, no steps, no examples.
**Notes**: Role-theater overhead at its purest — a file whose only job is to announce it is not the real file. Skip in cross-repo comparison; audit AGENTS.md instead for the actual SOPs.

## .cursor/rules/workflow.mdc
**Type**: sop
**Portable**: yes
**Reason**: Defines a clean plan→spec→implement→validate execution sequence that applies to any agentic coding workflow regardless of tooling.
**Trigger**: Start of any implementation task; when deciding whether to write a spec before editing code.
**Steps/contract**:
- Start from a plan, existing task spec, or clearly scoped task request.
- Derive/refine one or more task specs before editing (use plan-to-spec skill by default).
- Keep hierarchy explicit for multi-phase work: project_target → current_target → phase → plan → task.
- Skip written plan only when plan is already clear enough to derive specs directly.
- Within same reviewable slice, refine existing spec rather than creating parallel docs.
- Create a new dated spec if primary outcome, boundary, or validation path changes.
- Prefer one task spec with one primary reviewable outcome and a short checklist.
- Tiny tasks may skip spec only when request is already spec-complete and trivially narrow.
- Implement only after task boundary is clear.
- Validate explicitly after implementation.
- Write back stable facts only when justified.
- Promote repeated workflows into skills when they stabilize.
**Strip**: Reference to `ai/skill/plan-to-spec.md` (repo-local path); `alwaysApply: true` frontmatter (Cursor-specific).
**Structure/format**: Eleven bullet rules; minimal prose overhead; maps directly to a skill checklist. No role-theater — purely procedural.
**Notes**: Exceptionally clean and portable. The spec-gate ("implement only after task boundary is clear") and the "tiny task exemption" are both well-calibrated guardrails worth preserving verbatim. The skill-promotion heuristic ("promote repeated workflows into skills when they stabilize") is a meta-rule worth carrying into a foundational workflow skill.

## .references/ai-engineering-sop/AGENTS.md
**Type**: sop
**Portable**: yes
**Reason**: Defines a complete, tool-neutral plan-first engineering operating model with clear sequencing, write-back policy, skill promotion criteria, and validation expectations — all expressed as durable rules with no project-specific content.
**Trigger**: When onboarding an agent into any AI-assisted engineering workflow that needs guardrails around planning, spec-driven execution, fact management, and skill reuse.
**Steps/contract**:
```
1. Start from a plan, a phase slice, or a clearly scoped task request
2. Derive or refine one or more narrow task specs before implementation
3. Implement the smallest coherent change
4. Validate explicitly
5. Write back stable facts when justified
6. Promote repeated workflows into skills when they stabilize

Write-back gate (all three must be yes):
  1. Will this still matter later?
  2. Can this be reused later?
  3. Does it have a clear destination file?

Skill promotion gate:
  - repeats across tasks
  - inputs/outputs are recognizable
  - value not tied to a single task
  - reduces repeated reasoning effort
  - describable clearly enough to reuse

Validation rules:
  - Black-box is the default acceptance mechanism
  - White-box is conditional: regression-sensitive, stateful, branch-heavy, or fragile logic only
```
**Strip**: Repo structure section (layer map for `ai/`, `CLAUDE.md`, `.cursor/rules/*`) is scaffold-specific — remove or replace with destination repo's equivalent namespace map. Entrypoint model section is starter-kit meta-commentary. "Editing expectations" section is meta-governance for maintaining the file itself, not a portable SOP rule.
**Structure/format**: Well-structured flat Markdown with named `##` sections. No nested bullet depth beyond two levels. Each section is self-contained and independently extractable. Working model, Boundaries, Write-back policy, Skill promotion rule, and Validation expectations are the five portable sections; the rest is repo-bootstrap overhead.
**Notes**: Notably strong on *when not to act* — boundaries, write-back exclusions, and skill-promotion gates are all expressed as concrete negative criteria, which is rare and high-value. The `plan -> task spec -> implementation -> validation` sequence is the cleanest portable execution model in this reference set so far. The three-question write-back gate and skill-promotion checklist are both directly promotable as standalone decision rules.

## .cursor/rules/validation.mdc
**Type**: rule
**Portable**: yes
**Reason**: Concise, technology-agnostic validation hierarchy (black-box default → white-box conditional) with clear trigger criteria and no repo-specific overhead.
**Trigger**: Any implementation task requiring a validation or testing decision — choose black-box vs. white-box scope.
**Steps/contract**:
- Black-box validation is the default acceptance path.
- White-box validation supplements when the change affects: core branch behavior, internal state transitions, deterministic bugfix regression paths, matchers/parsers/schedulers/rules engines/caches/traces/analyzers, meaningful internal contracts that black-box checks alone will not protect.
- White-box validation should protect meaningful internals, not incidental implementation details.
- Validation must be explicit enough to review.
- Avoid vague statements such as "tested manually" without describing what was checked.
- Do not use raw coverage numbers as the primary objective.
**Strip**: Nothing — file contains no role-theater, backstory, or repo-specific references.
**Structure/format**: Eight bullet rules; fits cleanly into a short skill or standing rule. `alwaysApply: true` signals it should be a standing rule rather than an on-demand skill.
**Notes**: The white-box trigger list (matchers, parsers, schedulers, rules engines, caches, traces, analyzers) is the highest-value portable element — concrete enough to be action-guiding without being tied to any specific codebase. Promote as-is to a `rules/` standing rule.

## .cursor/rules/boundaries.mdc
**Type**: rule
**Portable**: partial
**Reason**: The anti-scope-creep constraints are universally valuable; the `ai/` directory-layout rules are repo-specific and must be stripped.
**Trigger**: Any agentic task that involves code or doc changes, to prevent speculative refactors, scope drift, or phase-jumping.
**Steps/contract**:
- Do not introduce speculative abstractions.
- Do not perform opportunistic refactors.
- Do not edit unrelated modules in the same task unless required for compilation or contract alignment.
- Do not implement future-phase work during current-phase tasks.
- Prefer existing structures over creating parallel systems.
- Narrow ambiguous work instead of expanding design scope.
**Strip**: Lines about `ai/` directory layout (`Keep AI-managed workflow assets under ai/`, `Keep project-facing documentation outside ai/`, canonical-root naming rules) — these are repo-specific conventions, not portable SOP.
**Structure/format**: Flat bullet list under a single `alwaysApply: true` frontmatter rule; no phases, no examples. Trivially portable as a standing rule or skill guard-rail block.
**Notes**: Core principle is "do less, not more" — high signal, low noise. The six portable bullets could slot directly into a `task-boundaries` standing rule or as a pre-task guard in cot-gate. No role-theater present; the overhead is only the two repo-layout lines.

## .cursor/rules/writeback.mdc
**Type**: rule
**Portable**: yes
**Reason**: Encodes a clear, universally applicable decision gate for when and where to persist durable information out of a task session.
**Trigger**: After any task that produced stable facts, reusable procedures, or workflow patterns worth retaining beyond the current session.
**Steps/contract**:
```
Before writing back, ask:
- will this still matter later?
- is it reusable later?
- does it have a clear home?
If not clearly yes → do not write back.

Write back when:
- project scope/boundaries became clearer
- a validation reference became reusable
- a workflow rule became stable enough to reuse
- a repeated procedure should become or update a skill

Write back to:
- ai/doc/facts/* for stable project context
- ai/skill/* for reusable procedures
- AGENTS.md or rules only for repository-wide guidance
- change summaries for task-local delivery notes

Do not write back:
- temporary debugging notes
- unstable experiments
- one-off implementation chatter
- details only useful for the current task

Update facts-index.md when fact files change.
Update skill-registry.md when skill files change.
```
**Strip**: Routing label taxonomy (`facts_update`, `skill_promotion`, etc.) and the path conventions (`ai/doc/facts/*`, `ai/skill/*`) are repo-specific scaffolding — strip both when porting. The taxonomy note itself ("do not let the taxonomy create a new archive") is a useful meta-warning worth keeping.
**Structure/format**: Minimal Cursor MDC rule (`alwaysApply: true`). Three-section structure: decision gate (ask-before-write), write-back targets, write-back prohibitions. Very clean — no role-theater, no backstory.
**Notes**: High signal-to-noise. The core SOP is the three-question gate plus the stable/unstable distinction. Trivially portable as a standalone skill or standing rule. The index-maintenance obligations (facts-index.md, skill-registry.md) are repo-specific but the *pattern* (maintain a registry when you add/remove artefacts) is portable.

## ai/skill/plan-to-spec.md
**Type**: skill
**Portable**: yes
**Reason**: Pure procedural SOP for decomposing a plan into narrow, reviewable task specs — no repo-specific tooling, paths, or personas beyond the output directory convention.
**Trigger**: When a plan or phase slice exists and work is about to move into implementation; use to make task boundaries, validation criteria, and write-back needs explicit before anyone starts coding.
**Steps/contract**:
1. Start from the current slice — turn broad plan statements into the next smallest reviewable slice(s) that still move the phase forward.
2. One spec, one primary outcome — split if mixing design/impl/migration/cleanup or multiple validation paths.
3. Split before the spec becomes large (multiple primary outcomes, independently reviewable slices, distinct validation paths, checklist that can't stay short).
4. Make the execution contract explicit: in-scope, out-of-scope, affected area, done condition.
5. Add lightweight execution state: status field (draft → todo → in_progress → validating → repairing → rolled_back → blocked → done) + short Markdown checklist; checklist completion alone does not equal done.
6. Make validation explicit — black-box checks as default acceptance path.
7. Judge white-box need — trigger when logic is branch-heavy, stateful, regression-sensitive, contract-sensitive, or tied to a deterministic bugfix.
8. Decide write-back deliberately — only when the task clarifies stable, reusable context; name the destination.
9. Add failure boundaries only when they help (repair budget, rollback scope, escalation conditions) — omit on trivially narrow tasks.
**Strip**: Output path convention (`ai/doc/specs/`) and the cross-reference to `ai/doc/specs/README.md` and `AGENTS.md` — those are repo-local; replace with "store in your project's spec directory per its naming conventions".
**Structure/format**: Markdown skill file with Purpose / When to use / Inputs / Outputs / Workflow (9 numbered steps) / Common failure modes. Clean, self-contained — maps directly to a SKILL.md template. The status-enum list and failure-modes catalogue are the highest-density portable content.
**Notes**: The phase-awareness fields (project_target, current_target, main_plan/sub_plan, Parent Phase, Parent Plan) are optional extensions for multi-phase projects — they should be preserved but clearly marked as "for longer-running or dependency-heavy work only" to avoid overhead on simple tasks. No role-theater detected; steps are action-oriented throughout.

## ai/skill/skill-policy.md
**Type**: Policy — defines the criteria for when a skill should or should not be created/updated.
**Portable**: Yes.
**Reason**: The decision rules are domain-agnostic ("repeatable workflow", "recognisable I/O", "reduces repeated reasoning", "reusable beyond one-off task") and apply equally to any skill-library in any repo.
**Trigger**: Use when deciding whether to promote an ad-hoc workflow to a named skill, or when reviewing existing skills for pruning.
**Steps/contract**: No procedural steps — pure gate criteria in two lists: when-to-create (4 bullets) and when-not-to-create (4 bullets), plus a one-line quality bar ("practical, compact, operational").
**Strip**: Nothing — the file is already minimal. The title "Skill Policy" can be kept as the section heading.
**Structure/format**: Short prose intro + two bullet lists + closing quality bar. Clean and ready to paste verbatim.
**Notes**: Pairs naturally with `skill-create` skill. Could be embedded directly into the `skill-create` SKILL.md as a "When to create a skill" section, or kept as a standalone reference policy loaded at skill-creation time.

## ai/skill/skill-registry.md
**Type**: Index/registry — maps skill names to purpose, trigger, inputs, outputs, and status in a Markdown table.
**Portable**: No — standalone skill registries are repo-internal housekeeping artefacts; the value is in the individual skill files they point to, not the registry itself.
**Reason**: Contains only two rows (plan-to-spec, design-whitebox-tests) and its sole function is to stay in sync with a local directory. No reusable process logic, decision rules, or behavioural guidance lives here.
**Trigger**: N/A — not a behavioural skill, purely a catalogue.
**Steps/contract**: None. The file defines no steps, phases, or contracts — only a lookup table schema (Name / Purpose / Trigger / Inputs / Outputs / Status).
**Strip**: Everything — the file has no extractable SOP content.
**Structure/format**: Single Markdown table with six columns; two data rows. Very lightweight.
**Notes**: The table schema itself (Name / Purpose / Trigger / Inputs / Outputs / Status) is a useful pattern for documenting skills elsewhere, but the file as a whole is not portable. Skip — covered by auditing the individual skill files it references.

## ai/skill/design-whitebox-tests.md
**Type**: Decision skill / white-box test design guide
**Portable**: Yes
**Reason**: Entirely domain-agnostic heuristics for deciding when and what to test internally. No repo-specific tooling, language, or context required.
**Trigger**: Task changes branch-heavy logic, state transitions, deterministic bugs, caches, parsers, schedulers, or rules engines where black-box acceptance alone is insufficient.
**Steps/contract**: (1) Evaluate whether white-box validation is needed given the task type. (2) Identify internal logic worth protecting (branches, state transitions, error paths, rollback, cache invalidation, intermediate invariants, regression paths). (3) Identify what *not* to assert (helper call order, implementation trivia, brittle naming). (4) For bugfixes, prefer converting the root cause into a regression-protecting test. Output: need/no-need decision + what to protect + direction.
**Strip**: Nothing — no repo-specific content present.
**Structure/format**: Markdown with Purpose / When to use / Inputs / Outputs / What to protect / What not to assert / Bugfix guidance / Common failure modes sections. Clean, portable as-is.
**Notes**: Pairs naturally with a black-box/acceptance-test skill. The "what not to assert" and common failure modes sections are unusually high signal — worth preserving verbatim as they prevent common over-testing anti-patterns. Strong candidate.

## ai/doc/guides/new-project-sop.md
**Type**: Workflow SOP — new-project / project-kickoff startup sequence
**Portable**: Yes — high portability; all steps are tool-agnostic and reference-independent once internal `ai/` path cross-links are stripped
**Reason**: Defines a clean, ordered startup contract (clarify → spec → implement → validate → write-back → promote) that applies to any software project regardless of stack or team size. The phase-aware and multi-model collaboration branches extend it cleanly without forcing complexity on simple tasks.
**Trigger**: Starting a new project, introducing structure into an existing project, or beginning a long-running phase of work
**Steps/contract**: (1) Establish current phase scope + first reviewable slice; (2) Establish plan (problem / goal / non-goals / constraints / risks / phased direction / first slice); (3) Derive narrow task spec(s); (4) Decide starter/skeleton work deliberately after planning; (5) Validate in layers (black-box default, white-box when complexity warrants); (6) Write back only stable, reusable facts; optionally promote repeatable workflows into skills
**Strip**: All `ai/` internal path references (`ai/skill/plan-to-spec.md`, `ai/doc/guides/phase-aware-workflow.md`, `ai/doc/templates/task-spec-template.md`, `ai/doc/guides/task-lifecycle-and-escalation.md`, `ai/doc/guides/testing-strategy.md`, `ai/doc/guides/design-to-spec-handoff.md`, etc.); "Entrypoints In Copied Projects" section (project-template housekeeping, not a portable SOP rule); references to specific fact files (`project-scope.md`, `golden-cases.md`) — replace with generic "stable-facts artefact"
**Structure/format**: Well-structured; numbered startup checklist with named sub-steps, a practical-note summary, and two clearly-gated variant branches (phase-aware, multi-model). Length is appropriate — concise without being terse.
**Notes**: The lightweight-by-default framing is a strong design principle worth preserving verbatim ("The goal is one or more small specs, not one large spec"). The six-step default sequence maps cleanly onto a generic "start-work" SOP. The phase-aware and multi-model variant sections can be kept as opt-in addenda rather than separate skills, since they explicitly position themselves as extensions not replacements.

## ai/doc/guides/design-to-spec-handoff.md
**Type**: Multi-agent coordination guide — role contracts and handoff gates for design→plan→execution pipeline  
**Portable**: Yes  
**Reason**: Entirely repo-agnostic; describes a three-role model (Design Partner / Planner-Specifier / Executor) with clear handoff contracts, artifact policy, and failure modes that apply to any AI-assisted engineering workflow  
**Trigger**: Use when design, planning, and execution are split across models or people; when a team needs guardrails to prevent executors from expanding scope or fabricating missing design  
**Steps/contract**: (1) Design discussion + summary if handoff needed → (2) Planner inspects repo and refines plan/phase slice → (3) Derive narrow spec(s) → (4) Hand one spec at a time to executor → (5) Validate against spec → (6) Return `replan_required` or `needs_decision` to planner on boundary changes  
**Strip**: Example model mapping (ChatGPT/Codex/Cursor) — illustrative only; cross-references to `ai/doc/specs/README.md` and `ai/doc/guides/task-lifecycle-and-escalation.md` (replace with local equivalents)  
**Structure/format**: Role-contract tables, artifact policy, handoff gate checklists, executor mutation limits, failure modes list — clean Markdown sections, no tooling dependencies  
**Notes**: Complements task-lifecycle-and-escalation.md; the executor mutation limits section (which spec fields executors may/may not rewrite) is unusually precise and worth preserving verbatim; failure modes list is concise and high-signal

## ai/doc/guides/task-lifecycle-and-escalation.md
**Type**: SOP guide — canonical status values, escalation outcomes, repair/rollback/replan/escalate decision rules, and default transition table for task lifecycle management.
**Portable**: Yes — entirely domain-agnostic; no repo-specific tooling, frameworks, or naming.
**Reason**: Provides a clean shared vocabulary (draft → todo → in_progress → validating → repairing → rolled_back → blocked → done) and a principled four-way decision rule (repair vs rollback vs replan vs escalate) that any agent or human operator can apply consistently across any project.
**Trigger**: Use when a task needs explicit lifecycle tracking, a validation failure must be categorised, or work is crossing a decision boundary that may require escalation.
**Steps/contract**: (1) Assign canonical status; (2) On failure, classify as repair / rollback / replan_required / needs_decision using the trigger criteria; (3) Apply the default transition rule for the current state; (4) Keep lifecycle handling proportional to task complexity.
**Strip**: None — the file is already free of project-specific references. The "Practical Reminder" prose could be trimmed to one line if brevity is prioritised.
**Structure/format**: Clear H2 sections; bullet lists for status values and transitions; four-quadrant trigger guide; plain prose reminder. Very readable as a reference card.
**Notes**: Explicitly states it is guidance for human and AI operators, not a workflow engine — a useful framing to preserve verbatim. Pairs naturally with any task-spec or plan-slice SOP that needs defined exit conditions.

## .references/ai-engineering-sop/ai/doc/guides/phase-aware-workflow.md
**Type**: guide/SOP extension
**Portable**: yes
**Reason**: Pure procedural content — defines a reusable planning hierarchy (project_target → current_target → phase → main_plan → sub_plan → task) with explicit field contracts for phases and task specs. No tooling coupling; no role-theater.
**Trigger**: Any long-running or multi-handoff work where a lightweight default workflow needs stable phase anchoring, visible target hierarchy, or explicit task-boundary contracts across agents or sessions.
**Steps/contract**: (1) Decide if phase-aware mode is needed (spans multiple phases / requires stable targets / involves handoffs / needs explicit ordering or failure handling — otherwise stay on default workflow). (2) Anchor a `project_target` and `current_target`. (3) Define the active phase with: purpose, entry_criteria, exit_criteria, deliverables, allowed_actions, forbidden_actions, gate_checks. (4) Choose main_plan (phase progression, milestones, dependencies) vs sub_plan (task decomposition, ordering, validation, failure handling) — only split if distinction adds real clarity. (5) Author task specs that map back to Parent Phase + Parent Plan; for high-risk tasks add: Inputs, Expected Outputs, Allowed Edits, Disallowed Edits, Repair Budget, Rollback Scope, Escalation Condition. (6) Keep invariants: plans may remain temporary; task specs are the durable execution artifact; one spec → one reviewable outcome; black-box validation is the default acceptance path.
**Strip**: The opening framing ("extension of the repository's existing SOP") is repo-local context — strip or reword. "Future runtime" references are aspirational and can be removed without loss of procedural value.
**Structure/format**: Seven headed sections; hierarchical terminology glossary; field lists for phases and task specs; clear "when to use / when not to use" gate. Easily reformatted as a skill preamble or standing rule — the field enumerations map cleanly to frontmatter or YAML schema.
**Notes**: One of the strongest documents audited so far. The phase field contract (entry/exit criteria, allowed/forbidden actions, gate_checks) is immediately portable as a phase-gate checklist. The task spec field contract (Repair Budget, Rollback Scope, Escalation Condition) fills a gap not seen in other repos. The explicit "Do not force heavyweight planning onto every small task" caveat prevents the SOP from becoming cargo-cult overhead. High priority for cross-repo comparison.

## ai/doc/guides/testing-strategy.md
**Type**: SOP / testing heuristic
**Portable**: yes
**Reason**: Entirely tool- and language-agnostic layered validation philosophy. No repo-specific tooling, frameworks, or paths referenced. The black-box-first / white-box-conditional split is a durable, transferable principle applicable to any code task.
**Trigger**: Any time a task involves writing, reviewing, or deciding on tests — new features, bugfixes, refactors, or CI validation gates.
**Steps/contract**: 1. Default to black-box validation: verify externally visible behavior, user-facing outcomes, integration behavior, and stable acceptance cases. 2. Add white-box validation conditionally when the task changes branch-heavy logic, internal state transitions, deterministic bugfix root causes, or complex internals (caches, parsers, schedulers, rules engines). 3. Target white-box coverage at branch selection, state transitions, error handling, rollback behavior, cache invalidation, intermediate invariants, and regression-prone paths. 4. Avoid overfitting white-box tests to irrelevant call order, local variable names, or brittle implementation details likely to shift in harmless refactors. 5. For deterministic bugs, prefer a regression-protecting root-cause test (bugfix-first rule). 6. Do not optimize for raw coverage percentage — protect critical internal contracts, fragile stateful behavior, and high-risk branches.
**Strip**: Nothing — the file contains no org-specific context, no tooling references, and no filler prose.
**Structure/format**: Six H2 sections (~50 lines total); clean imperative bullet lists throughout; negative guardrails paired with positive guidance in each section. Maps directly to a `skills/tdd/` or `rules/testing-strategy.md` slot.
**Notes**: Strong complement to TDD red-green-refactor skills — this file fills the *what to test and why* gap that pure TDD workflow skills often leave implicit. The "bugfix-first rule" section is the most distinctive element and worth promoting verbatim. Overall signal-to-noise ratio is excellent; no trimming needed.

## ai/doc/templates/design-to-planner-prompt-template.md
**Type:** Prompt scaffold / handoff template
**Portable:** Yes
**Reason:** Generic design-to-planner handoff structure with no repo-specific content. The input sections (goal, non-goals, constraints, risks, repo context, open questions, desired next step) and the output contract (inspect repo, clarify/derive specs, stop when not ready) apply cleanly to any project doing spec-first development.
**Trigger:** Use when handing design discussion output to a planner or specifier agent to produce or clarify a plan/spec slice.
**Steps/contract:** (1) Fill input sections — design summary, goal, non-goals, constraints, risks, repo context, open questions, desired next step. (2) Planner inspects repo context, clarifies or derives narrow specs when implementation-ready, names validation paths and spec-split triggers. (3) If work is not ready, planner stops and lists "why not yet" + missing decisions explicitly. Guardrails: planner must not implement directly, must not copy transient design notes into repo docs, must not combine multiple primary outcomes into one spec.
**Strip:** Nothing — template is already clean of project-specific content.
**Structure/format:** Markdown heading sections for each input field + numbered output contract bullets + constraint list. Well-structured for skill use.
**Notes:** Pairs naturally with any spec-first / tracer-bullet workflow. The explicit "stop when not ready" contract is the strongest portable element — prevents premature spec generation. Low-effort promotion candidate.

## ai/doc/templates/spec-to-executor-prompt-template.md
**Type:** Prompt scaffold / execution contract template
**Portable:** Yes
**Reason:** Defines a reusable handoff protocol for dispatching a single spec to an executor agent — scope constraints, validation gate, escalation paths, and writeback rules are generic and apply across any spec-driven workflow.
**Trigger:** Use when handing a spec to an executor agent (human or AI) for a bounded implementation pass; especially useful in multi-agent or planner/executor pipelines.
**Steps/contract:** (1) Fill in Target Spec Path, Allowed Scope, Forbidden Scope, Validation Expectations, Escalation Expectations, Completion Reporting Format, Stop/Fallback Conditions. (2) Executor consumes one spec at a time, stays inside boundary, validates before reporting done, surfaces blockers/ambiguity back to planner. (3) Executor may only update `Status`, `Task Checklist`, `Risks / Notes` — never rewrites core spec fields. (4) Stops and hands back when spec boundary is unclear, validation is insufficient, scope has grown, or work needs splitting/decision.
**Strip:** "This is a prompt scaffold, not a durable project document." (contextual note only); no repo-specific content otherwise.
**Structure/format:** Section headings as fill-in prompts (Input block) + prose Execution Contract + Fallback Conditions list — clean Markdown, easy to parameterise.
**Notes:** Pairs naturally with a spec template (e.g. `task-spec-template.md`). The "executor may update only" writeback contract is the most portable and reusable element — strong candidate for inclusion in any agentic SOP. Escalation signals (`needs_decision`, `replan_required`) are well-defined and worth preserving verbatim.

## ai/doc/templates/plan-template.md
**Type:** Template (plan artifact scaffold)
**Portable:** Yes
**Reason:** A structured, repo-agnostic planning template that enforces consistent plan anatomy — metadata, phase context, problem/goal/constraints, and task breakdown — without coupling to any specific project. Lightweight framing ("use only when a plan should become a durable artifact") guards against over-process.
**Trigger:** Agent is asked to create a plan document, hand-off plan, or multi-phase implementation roadmap that needs to become a shared/reviewable artifact.
**Steps/contract:**
1. Classify plan level (`main_plan` vs `sub_plan`).
2. Fill Metadata: Project Target, Current Target, Parent Plan, Current Phase.
3. Fill Phase Context: Purpose, Entry/Exit Criteria, Deliverables, Allowed/Forbidden Actions, Gate Checks.
4. Fill Problem, Goal, Non-goals, Constraints.
5. Fill Proposed Approach and Risks.
6. Fill Phase Split / Task Breakdown (phases+milestones for `main_plan`; ordered tasks+failure paths for `sub_plan`).
7. Define First Slice (first reviewable deliverable).
**Strip:** Nothing — all sections are load-bearing. The "use only when durable" guard note is worth keeping as inline guidance.
**Structure/format:** Markdown template with ATX headings; plan-level classification is a required enum choice; all sections are short prose prompts.
**Notes:** Pairs naturally with a `prd-to-plan` or `plan-to-spec` skill. The Entry/Exit Criteria + Gate Checks trio is especially portable as a phase-readiness gate pattern reusable in any planning SOP. Forbidden Actions section is unusual but valuable for scope control inside a phase.

## ai/doc/templates/task-spec-template.md
**Type:** Template (task specification)
**Portable:** Yes — high value
**Reason:** Comprehensive, opinionated task-spec schema covering goal, scope, validation, repair/rollback, and write-back. Uniquely strong on phase-aware contracts, repair budgets, and escalation conditions — patterns rarely captured in task templates elsewhere. The "Validation" section (black-box vs white-box + internal logic to protect) and the "Write-back Needed" section with typed labels (`facts_update`, `skill_promotion`, `decision_rationale`, etc.) are distinctively portable conventions.
**Trigger:** Use when creating a task spec, narrowing a plan slice into an actionable unit, or defining acceptance criteria for a bounded piece of work.
**Steps/contract:**
1. Fill Metadata: Source Plan, Status (draft → todo → in_progress → validating → repairing → rolled_back → blocked → done)
2. Write Goal (one crisp sentence)
3. Declare In Scope / Out of Scope
4. Optionally fill phase-aware fields: Inputs, Expected Outputs, Allowed/Disallowed Edits
5. Write Task Checklist (3–7 outcome-oriented items)
6. Write Done When (reviewable outcome, not just checklist completion)
7. Fill Validation: black-box checks, white-box yes/no, trigger, internal logic to protect
8. Fill Repair/Rollback if risk warrants it: repair budget, rollback scope, escalation condition
9. Declare Write-back Needed (yes/no + label + destination)
**Strip:** `Parent Phase` / `Parent Plan` / `Related Specs` (plan-internal navigation fields); file naming convention (`YYYYMMDD-NNN-task-slug.md`) and storage path (`ai/doc/specs/`) — replace with repo-local convention.
**Structure/format:** Markdown with `##` / `###` sections; checkbox task list; status as a fixed enum; write-back labels as a defined vocabulary. Very clean and adoptable as-is.
**Notes:** The status lifecycle (`draft → validating → repairing → rolled_back`) and the repair-budget concept are unusual and high-signal — worth preserving verbatim in any promoted skill. The write-back labels act as a lightweight knowledge-management taxonomy that pairs naturally with a continual-learning or memory system.

## ai/doc/templates/change-summary-template.md / **Template** / **Portable: Yes** / **Reason:** Lightweight structured post-task closure template with six distinct sections covering what changed, scope, validation (black-box + white-box), regression protection, knowledge write-back, and remaining gaps — no repo-specific terminology or tooling references. / **Trigger:** After completing any implementation slice, bug fix, or feature work — fills the gap between "code merged" and "session closed". / **Steps/contract:** (1) Summarize what changed, (2) confirm planned scope completed, (3) record black-box validation performed, (4) record white-box validation if required, (5) note any regression path now protected, (6) list facts/skills updated, (7) enumerate remaining gaps or deferrals. / **Strip:** Nothing — template is already minimal and tool-agnostic. / **Structure/format:** Seven-section Markdown template with H2 headers; validation section has two H3 sub-headers (Black-box / White-box). / **Notes:** Complements a pre-task cot-gate skill well — together they form a before/after closure pair. The "Facts / Skills Updated" section is especially valuable for agentic workflows where session memory must be written back explicitly. "Regression Path Protected" is a strong forcing function for thinking about test coverage.

## ai/doc/templates/project-scope-template.md
**Type:** Template (structured document scaffold)
**Portable:** Yes
**Reason:** A pure hierarchical scoping framework — Project Target → Current Target → Phase Goal → In/Out of Scope → Constraints → Assumptions → Risks. No repo-specific nouns. Applies directly to any project kickoff or phase-planning exercise.
**Trigger:** Starting a new project or phase; writing a scope doc; onboarding a team to an active workstream; pre-sprint planning.
**Steps/contract:** Fill in eight sections in order: (1) stable top-level objective, (2) narrower active objective, (3) current phase goal, (4) in-scope items, (5) out-of-scope items, (6) key constraints, (7) current assumptions, (8) open risks.
**Strip:** Nothing — file contains only the template skeleton with guiding questions per section.
**Structure/format:** Markdown headings-only template; each section is a single guiding question acting as a placeholder. Compact (≤20 lines).
**Notes:** Unusually clean three-level goal hierarchy (project / current / phase) that prevents scope-creep at each layer. The explicit "Out of Scope" and "Open Risks" sections are production-grade additions often omitted from lightweight scope templates. Strong candidate for a `plan-to-spec` or `prd-create` companion artifact.

## ai/doc/facts/facts-index.md
**Type:** Meta-index / knowledge-routing policy
**Portable:** Yes — with light trimming
**Reason:** Defines a durable taxonomy for what earns "fact" status versus ephemeral notes, plus a write-back routing table that maps label types to storage locations. Both conventions are project-agnostic and solve a common agent knowledge-management problem.
**Trigger:** When an agent needs to decide whether information is worth persisting, or where to route a write-back.
**Steps/contract:** (1) Classify candidate content against the "stable / reusable / useful to future runs" criteria. (2) Consult the routing taxonomy (`facts_update`, `skill_promotion`, `decision_rationale`, `phase_lesson`, `task_pattern`, `anti_pattern`) to pick the right destination. (3) Update this index whenever fact files are added, removed, or renamed.
**Strip:** References to `AGENTS.md` write-back policy (repo-local); specific file names `project-scope.md` / `golden-cases.md` (project-specific examples — replace with generic placeholders or omit).
**Structure/format:** Flat Markdown with a "use when" list, a "do not store" list, a file-map section, and a routing-taxonomy table. Clean and reusable as-is once project references are removed.
**Notes:** The routing taxonomy is the highest-value extract — it gives agents a shared vocabulary for write-back decisions without requiring them to invent ad-hoc file types. Consider promoting it as a standalone section in a `knowledge-routing` SOP or folding it into an existing `facts-management` skill.

## ai/doc/facts/project-scope.md
**Type:** Project-scoped facts / living configuration doc
**Portable:** No
**Reason:** Documents the scope, phase goals, constraints, and open risks of *this specific repository* (the ai-engineering-sop starter itself). Every field is self-referential — the "project target", in-scope items, and assumptions describe the repo's own design intent, not a transferable procedure. Porting it to another project would require rewriting every section.
**Trigger:** N/A — not a procedural trigger; consumed as a read-only facts document to orient AI assistants working inside this repo.
**Steps/contract:** None — declarative enumeration of scope, constraints, assumptions, and risks; no imperative steps.
**Strip:** Entire file is repo-specific. If an analogue is wanted elsewhere, only the *template structure* (sections: Project Target, In Scope, Out of Scope, Key Constraints, Current Assumptions, Open Risks) is reusable.
**Structure/format:** Flat Markdown, six second-level sections, bullet lists under each. Clean and easy to clone as a template shell.
**Notes:** The section skeleton (Target / In Scope / Out of Scope / Constraints / Assumptions / Risks) is a solid lightweight project-scope template worth extracting as a blank template artifact — but the *content* has zero portability. Flag the structure for the "project-scope template" SOP if one is being built.

## ai/doc/facts/golden-cases.md
**Type:** Reference / worked examples
**Portable:** No — repo-specific
**Reason:** Documents three canonical test cases for *this* SOP repository's own internal workflows (plan-to-spec conversion, bugfix white-box trigger, selective write-back). The cases are illustrations of the repo's own validation model, not transferable procedures.
**Trigger:** N/A — reference material, not an actionable SOP
**Steps/contract:** None; each case is structured as Input → Expected outcome → Why it matters
**Strip:** All three cases are self-referential; nothing survives stripping
**Structure/format:** H2 per case, three-field template (Input / Expected outcome / Why it matters); clean and readable
**Notes:** The *template shape* (Input → Expected outcome → Why it matters) is a reusable eval-case format worth noting for any SOP that needs worked examples, but the content itself stays behind.
