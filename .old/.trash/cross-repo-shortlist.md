# Cross-Repo Comparison: SOP Candidates & Protocol Primitives

**Produced by:** Worker Ant (cross-repo comparison task)  
**Date:** 2026-03-28  
**Sources:** Four per-repo audits in `.plans/audits/`  
**Repos compared:**
- `agentic-rules` (AINative Studio, XP-style agent rule library)
- `ai-engineering-sop` (tool-neutral SOP starter, v0.2.0)
- `anthropic-skills` (Anthropic official skill reference implementation, 17 skills)
- `antigravity-awesome-skills` (community aggregator, v9.0.0, 1,329 skills)

---

## 1. Summary: What Procedure Categories Emerged

Bottom-up from the four audits, **nine procedure categories** recur across two or more repos. They are listed here in rough order of how consistently and strongly they appear:

| # | Category | Repos Present | Notes |
|---|----------|--------------|-------|
| 1 | **TDD / Red-Green-Refactor** | agentic-rules, antigravity | Universal coding quality gate; appears as a first-class rule in both repos |
| 2 | **Pre-flight Clarification Gate** | ai-engineering-sop, antigravity, anthropic-skills (implicit) | "Ask before acting" encoded at different granularities |
| 3 | **Task Spec / Execution Contract** | ai-engineering-sop, agentic-rules | Task boundary before implementation; strongest in ai-engineering-sop |
| 4 | **Chain-of-Thought / Reasoning Before Code** | agentic-rules, antigravity (`brainstorming`) | Procedural reasoning mandate; different names, same gate |
| 5 | **Definition of Done / Completeness Gate** | agentic-rules, ai-engineering-sop, antigravity | Recurs as PR checklist, DoD gate, task-spec done criteria |
| 6 | **Document Co-Authoring** | anthropic-skills, antigravity | Identical 3-stage structure; strongest evidence in anthropic-skills |
| 7 | **Self-Validation / Post-Task Audit** | agentic-rules, ai-engineering-sop | "Did I follow the rules?" meta-loop; unique to these two repos |
| 8 | **Escalation Vocabulary** | ai-engineering-sop, agentic-rules | Explicit `needs_decision` / `replan_required` outcomes vs. implicit |
| 9 | **Context Handoff / Compression** | antigravity | Only fully encoded here; no equivalent in other repos |

**Surprising gaps:**
- Zero repos define a first-class **security review SOP** with procedure depth (not just a checklist). `security-auditor` in antigravity has the structure but buries the 5-step procedure inside 9 sections of persona framing.
- **Sprint/estimation** is covered only by agentic-rules; the other three repos don't plan at that granularity.
- **Multi-agent handoff** is explicit only in ai-engineering-sop; the others handle single-agent contexts.

**Surprising overlaps:**
- `doc-coauthoring` appears in both anthropic-skills and antigravity with nearly identical 3-stage structure (context gather → section-by-section draft → reader test). The antigravity version is the community port of the Anthropic original.
- `brainstorming` (antigravity) and `chain-of-thought-before-code` (agentic-rules) encode the same behavior from different angles: both mandate explicit written reasoning before any artifact is produced, both have a gate that blocks progress until the reasoning is confirmed.

---

## 2. Ranked Shortlist of SOP Candidates

SOPs are ranked by: (1) presence across repos (coverage), (2) procedural density (steps + quality bars + escalation paths, not role descriptions), (3) strippability (how much vendor/persona coupling must be removed), and (4) portability (stack-agnostic).

---

### Rank 1 — `clarification-gate`

| Field | Value |
|-------|-------|
| **Proposed canonical name** | `clarification-gate` |
| **Repos present** | antigravity (`ask-questions-if-underspecified`), ai-engineering-sop (implicit in `scope-control.mdc` and task-spec template) |
| **Strongest encoding** | **antigravity** — `skills/ask-questions-if-underspecified/SKILL.md` |
| **Why strongest** | Fronts investigation before any planning ceremony: the 1–5 questions rule eliminates whole task branches before work starts. The `defaults` fast-path is a concrete UX gesture that makes the gate frictionless. ai-engineering-sop encodes the concept as a constraint ("task must be unambiguous") but doesn't provide the question-structuring procedure. |
| **Skill / Rule / Subagent prompt** | **Rule** — should fire on every task trigger, not as an opt-in skill |
| **Port** | Steps 1–5 verbatim; the `defaults` fast-path; the "eliminate whole branches" criterion for question quality |
| **Strip** | Nothing — no vendor coupling in source |
| **Source citations** | `skills/ask-questions-if-underspecified/SKILL.md` step 2: *"Prefer questions that eliminate whole branches of work"*; fast-path: *"reply `defaults` to accept all recommended choices"* |

---

### Rank 2 — `tdd-protocol`

| Field | Value |
|-------|-------|
| **Proposed canonical name** | `tdd-protocol` |
| **Repos present** | agentic-rules (`canonical-rules.md` §4), antigravity (`test-driven-development/SKILL.md`) |
| **Strongest encoding** | **antigravity** — `skills/test-driven-development/SKILL.md` |
| **Why strongest** | Tighter than agentic-rules: "Iron Law" is an unambiguous hard stop, the 8-item Verification Checklist has a named failure mode ("You skipped TDD. Start over."), and the anti-rationalization catalog (5 named failure modes) prevents motivated reasoning. agentic-rules §4 has the same Red-Green-Refactor loop but softer language and more HyperScaler-example noise. Note from scratchpad: "should hook into our PRD workflow." |
| **Skill / Rule / Subagent prompt** | **Skill** — invoked at the start of any implementation task |
| **Port** | Iron Law verbatim; 5-step RGR cycle; Verification Checklist (8 items); Anti-rationalization catalog |
| **Strip** | TypeScript-only examples → mark as illustrative; `@testing-anti-patterns.md` internal resource reference |
| **Source citations** | `skills/test-driven-development/SKILL.md` Iron Law: *"NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST"*; Checklist hard-stop: *"Can't check all boxes? You skipped TDD. Start over."* |

---

### Rank 3 — `task-spec`

| Field | Value |
|-------|-------|
| **Proposed canonical name** | `task-spec` (template) + `plan-to-spec` (skill) |
| **Repos present** | ai-engineering-sop (primary), agentic-rules (weaker: sprint breakdown table is adjacent) |
| **Strongest encoding** | **ai-engineering-sop** — `ai/doc/templates/task-spec-template.md` + `ai/skill/plan-to-spec.md` |
| **Why strongest** | Only repo that separates the *template* (task-spec) from the *skill* (how to derive it from a plan). The spec itself has an explicit `Done When` field that separates checklist completion from validation passing — a distinction no other repo makes explicit. The executor mutation limits (executor may only touch Status, Checklist, Risks/Notes; not Goal/InScope/DoneWhen) are uniquely clear. |
| **Skill / Rule / Subagent prompt** | Template (task-spec) + **Skill** (plan-to-spec) |
| **Port** | All spec fields; `YYYYMMDD-NNN-slug` naming convention; executor mutation limits; escalation outcomes (`needs_decision`, `replan_required`); 3-question write-back gate |
| **Strip** | `ai/doc/specs/` hard path references → `<workflow-dir>/specs/`; version stamp "SOP Starter 0.2.0"; Cursor front-matter from `.mdc` files |
| **Source citations** | `ai/doc/templates/task-spec-template.md`; `ai/doc/guides/design-to-spec-handoff.md` §Executor Mutation Limits; `AGENTS.md` §Working model |

---

### Rank 4 — `reasoning-before-code`

| Field | Value |
|-------|-------|
| **Proposed canonical name** | `reasoning-before-code` |
| **Repos present** | agentic-rules (`canonical-rules.md` §3), antigravity (`brainstorming/SKILL.md`) |
| **Strongest encoding** | **antigravity** — `skills/brainstorming/SKILL.md` for the gate structure; **agentic-rules** `canonical-rules.md` §3 for the numbered-reasoning format |
| **Why strongest** | The two repos are complementary: antigravity's "Understanding Lock" (bullet-summarize understanding, block until confirmed) is the gate mechanism; agentic-rules' numbered narrative (clarify → alternatives → edge cases → plan) is the format inside the gate. Together they produce a complete primitive: format + confirmation gate. Neither alone is sufficient. |
| **Skill / Rule / Subagent prompt** | **Rule** — should apply to any nontrivial code or design decision |
| **Port** | Antigravity's Understanding Lock (block until confirmation); agentic-rules' 4-step numbered narrative format; Decision Log pattern from antigravity |
| **Strip** | Antigravity: `multi-agent-brainstorming` conductor reference. Agentic-rules: HyperScaler API invocation examples; "Cody" as named reasoner |
| **Source citations** | `skills/brainstorming/SKILL.md` Understanding Lock: *"Do NOT proceed until explicit confirmation is given"*; `canonical-rules.md` §3: numbered narrative steps 1–4 |

---

### Rank 5 — `doc-coauthoring`

| Field | Value |
|-------|-------|
| **Proposed canonical name** | `doc-coauthoring` |
| **Repos present** | anthropic-skills (`skills/doc-coauthoring/SKILL.md`), antigravity (`skills/doc-coauthoring/SKILL.md`) |
| **Strongest encoding** | **anthropic-skills** — the source; antigravity is a community port with minor wording changes |
| **Why strongest** | Identical structure but anthropic-skills is the canonical upstream. The cold-reader test (Stage 3: test with fresh context-free agent) is the highest-value primitive in either version — it explicitly catches the most common documentation failure mode (assumed context). The opt-in workflow offer (offer staged workflow; allow freeform if declined) respects user agency without abandoning the SOP. |
| **Skill / Rule / Subagent prompt** | **Skill** — invoked when user initiates documentation task |
| **Port** | All three stages; cold-reader test; opt-in workflow offer |
| **Strip** | "Claude" as named reader-testing agent → "fresh context-free agent"; Anthropic-specific Stage 3 sub-agent URL links; Slack/Teams delivery path references |
| **Source citations** | `skills/doc-coauthoring/SKILL.md` Stage 3: *"Test the doc with a fresh Claude (no context) to catch blind spots before others read it."*; Stage 1: context-gathering before any drafting |

---

### Rank 6 — `delivery-gate`

| Field | Value |
|-------|-------|
| **Proposed canonical name** | `delivery-gate` |
| **Repos present** | agentic-rules (PR completeness checklist, issue closure protocol), ai-engineering-sop (task-spec done-when + write-back policy), antigravity (`closed-loop-delivery/SKILL.md`) |
| **Strongest encoding** | **antigravity** — `skills/closed-loop-delivery/SKILL.md` for the end-to-end gate shape; **ai-engineering-sop** for the write-back policy component |
| **Why strongest** | antigravity's closed-loop-delivery is the only version that explicitly defines the DoD before work starts (not after), mandates evidence of completion as a required output, and separates the human gate from automated checks. ai-engineering-sop's write-back policy (3-question gate before any fact-writing) adds a second gate that prevents bloat. Combined they cover the delivery contract end-to-end. |
| **Skill / Rule / Subagent prompt** | **Skill** — invoked when any deliverable is marked complete |
| **Port** | antigravity: pre-work DoD definition; evidence of completion requirement; human gate before done. ai-engineering-sop: 3-question write-back gate |
| **Strip** | antigravity: hard dependency reference to `create-issue-gate` (repo-local coupling). agentic-rules: "AINative CI" and "deliver-ready" state names |
| **Source citations** | `skills/closed-loop-delivery/SKILL.md` frontmatter `risk: safe`; `AGENTS.md` §Write-back policy write-back 3-question gate |

---

### Rank 7 — `task-lifecycle`

| Field | Value |
|-------|-------|
| **Proposed canonical name** | `task-lifecycle` |
| **Repos present** | ai-engineering-sop (`ai/doc/guides/task-lifecycle-and-escalation.md`), agentic-rules (implicit: issue state transitions in §1) |
| **Strongest encoding** | **ai-engineering-sop** |
| **Why strongest** | Only repo with a formal escalation vocabulary (8 status values + 2 explicit escalation outcomes: `needs_decision`, `replan_required`). The repair vs. rollback vs. replan vs. escalate decision matrix is explicit rather than implied. agentic-rules has the same transitions encoded in prose but without named status vocabulary. |
| **Skill / Rule / Subagent prompt** | **Rule** — vocabulary and status transitions should apply globally, not per-task |
| **Port** | 8 status values; 2 escalation outcomes; repair vs. rollback vs. replan vs. escalate decision matrix |
| **Strip** | `ai/doc/specs/` hard paths; "not pseudocode for a workflow engine" caveat (useful but may confuse non-runtime contexts) |
| **Source citations** | `ai/doc/guides/task-lifecycle-and-escalation.md` §Escalation Outcomes: `replan_required` and `needs_decision` |

---

### Rank 8 — `pre-push-audit`

| Field | Value |
|-------|-------|
| **Proposed canonical name** | `pre-push-audit` |
| **Repos present** | antigravity (`codebase-audit-pre-push/SKILL.md`), agentic-rules (PR completeness checklist §5) |
| **Strongest encoding** | **antigravity** — `skills/codebase-audit-pre-push/SKILL.md` |
| **Why strongest** | The only version with a hard-block on secrets at step 1 (other repos treat secrets detection as a checklist item, not a stop condition). The 10-step audit sequence is comprehensive and ordered: secrets first, then junk, then dead code, then security patterns, then scalability, then architecture consistency, then performance, then documentation, then test coverage, then final verification. |
| **Skill / Rule / Subagent prompt** | **Skill** — invoked before every `git push` or PR creation |
| **Port** | All 10 steps; hard-block on secrets; structured output report |
| **Strip** | Nothing significant; no vendor coupling |
| **Source citations** | `skills/codebase-audit-pre-push/SKILL.md` step 1: "Critical - Check for secrets" with file patterns; hard-block before push |

---

### Rank 9 — `debug-protocol`

| Field | Value |
|-------|-------|
| **Proposed canonical name** | `debug-protocol` |
| **Repos present** | antigravity (`debugging-strategies/SKILL.md`), agentic-rules (implicit in TDD/CI fail handling) |
| **Strongest encoding** | **antigravity** — `skills/debugging-strategies/SKILL.md` |
| **Why strongest** | The only repo with explicit hypothesis-ranking and binary-search procedure. agentic-rules' test-failure handling is reactive ("block merge, do not close") rather than investigative. The reproduction-before-fix mandate ("never apply a fix without confirming reproduction") is a portable hard rule. |
| **Skill / Rule / Subagent prompt** | **Skill** — invoked on any reported bug or test failure |
| **Port** | 5-step sequence (reproduce → hypothesize ranked → binary search → one hypothesis at a time → document root cause) |
| **Strip** | `resources/implementation-playbook.md` reference (repo-local) |
| **Source citations** | `skills/debugging-strategies/SKILL.md` step 1: reproduce in isolation before hypothesizing |

---

### Rank 10 — `self-validation`

| Field | Value |
|-------|-------|
| **Proposed canonical name** | `self-validation` |
| **Repos present** | agentic-rules (`canonical-rules.md` §8), ai-engineering-sop (implicit in validation cursor rules) |
| **Strongest encoding** | **agentic-rules** — `canonical-rules.md` §8 (sourced from `meta-rules.md`) |
| **Why strongest** | This is the only explicit post-task audit loop in the corpus: 3 questions (format? reasoning? filenames/placeholders?), and if any fails, explicitly state which rule failed, why, and what information is needed. ai-engineering-sop's `validation.mdc` approaches it from the black-box/white-box testing angle rather than rule compliance. The two are complementary not duplicative. |
| **Skill / Rule / Subagent prompt** | **Rule** — fires after every task/step, not as an opt-in |
| **Port** | 3-question post-task audit; explicit failure reporting (state rule, why, missing info) |
| **Strip** | "MCP messages" → "notification/callback" |
| **Source citations** | `canonical-rules.md` §8 note: *"Source: meta-rules.md §8 — unique to that file; not present in globalrules.md"* |

---

### Rank 11 — `validation-strategy`

| Field | Value |
|-------|-------|
| **Proposed canonical name** | `validation-strategy` |
| **Repos present** | ai-engineering-sop (`testing-strategy.md` + `design-whitebox-tests.md`), agentic-rules (coverage threshold in §4) |
| **Strongest encoding** | **ai-engineering-sop** |
| **Why strongest** | Only repo that distinguishes black-box as the default from white-box as a conditional, and gives explicit trigger conditions for when to invoke white-box (branch-heavy logic, state transitions, deterministic bugfix, caches, parsers, schedulers, rules engines). Also provides a "what NOT to assert" list — uniquely valuable for preventing brittle tests. agentic-rules has the 90% threshold but no decision procedure for when to choose what type of test. |
| **Skill / Rule / Subagent prompt** | **Skill** — invoked when deciding validation approach for any implementation task |
| **Port** | Black-box default; white-box trigger conditions; what to protect vs. what not to assert; bugfix-first rule (convert root cause to regression test) |
| **Strip** | None — fully portable |
| **Source citations** | `ai/doc/guides/testing-strategy.md` §1: *"Black-box validation is the default"*; `ai/skill/design-whitebox-tests.md`: what-to-protect vs. what-NOT-to-assert |

---

### Rank 12 — `context-handoff`

| Field | Value |
|-------|-------|
| **Proposed canonical name** | `context-handoff` |
| **Repos present** | antigravity (`context-compression/SKILL.md`) only — no equivalent in other repos |
| **Strongest encoding** | **antigravity** — only encoding |
| **Why strongest** | N/A (no competition); fills a gap the other repos ignore entirely. The probe-based evaluation (4 probe types: Recall, Artifact, Continuation, Decision) is the most sophisticated quality bar in the entire corpus. Tokens-per-task metric re-frames context efficiency correctly. |
| **Skill / Rule / Subagent prompt** | **Skill** — invoked at context limit or task handoff |
| **Port** | Structured handoff summary (5 fields); 4 probe types; tokens-per-task metric; iterate-until-probes-pass loop |
| **Strip** | Netflix/Factory Research blog post URLs (reference concepts not URLs) |
| **Source citations** | `skills/context-compression/SKILL.md`: 4 probe types (Recall, Artifact, Continuation, Decision); *"The right metric is tokens-per-task: total tokens consumed from task start to completion"* |

---

### Rank 13 — `iterative-artifact-improvement`

| Field | Value |
|-------|-------|
| **Proposed canonical name** | `iterative-artifact-improvement` |
| **Repos present** | anthropic-skills (`skill-creator/SKILL.md`) only |
| **Strongest encoding** | **anthropic-skills** — only encoding |
| **Why strongest** | N/A (no competition); the only repo with an explicit loop for building and improving any procedural instruction set. The "explain the why" and "explain rather than mandate" principles are the highest-value meta-guidance in the corpus. The description-optimization-after-content principle prevents local-optimum trap in trigger tuning. |
| **Skill / Rule / Subagent prompt** | **Skill** — invoked when building or improving any SOP or skill |
| **Port** | Draft → test → review → revise loop; explain-the-why principle; near-miss negative trigger eval; anti-overfitting principle |
| **Strip** | Python eval toolchain scripts; Claude.ai-specific subagent mechanics; `present_files` tool reference |
| **Source citations** | `skills/skill-creator/SKILL.md`: *"Explain the why. Try hard to explain the why behind everything you're asking the model to do."*; *"if you find yourself writing ALWAYS or NEVER in all caps… reframe and explain the reasoning"* |

---

### Rank 14 — `architecture-decisions`

| Field | Value |
|-------|-------|
| **Proposed canonical name** | `architecture-decisions` |
| **Repos present** | antigravity (`architecture/SKILL.md`), agentic-rules (sprint planning §2 includes risk assessment) |
| **Strongest encoding** | **antigravity** — `skills/architecture/SKILL.md` |
| **Why strongest** | The only version that mandates an ADR output for every irreversible decision, provides a simplicity-first selection criterion, and has a pre-finalization checklist. agentic-rules' risk assessment (≥3 risks, H/M/L likelihood) is an excellent complement but doesn't address architectural decision recording. |
| **Skill / Rule / Subagent prompt** | **Skill** — invoked on any design choice that cannot be easily reversed |
| **Port** | 6-step sequence; ADR output format; simplicity principle; pre-finalization checklist |
| **Strip** | `@[skills/...]` internal cross-reference links |
| **Source citations** | `skills/architecture/SKILL.md` step 4: simplicity principle; step 6: ADR with title/status/context/decision/consequences |

---

### Rank 15 — `multi-agent-handoff`

| Field | Value |
|-------|-------|
| **Proposed canonical name** | `multi-agent-handoff` |
| **Repos present** | ai-engineering-sop (`design-to-spec-handoff.md` + `prompt-spec-to-executor.md`) only |
| **Strongest encoding** | **ai-engineering-sop** — only encoding |
| **Why strongest** | N/A (no competition); the executor mutation limits (what executor may and may not rewrite) are uniquely clear and portable. The prompt scaffold templates (design-to-planner, spec-to-executor) encode the handoff contract as structured prompts. |
| **Skill / Rule / Subagent prompt** | **Subagent prompt** template |
| **Port** | Role contracts; executor mutation limits; 6-step default flow; prompt scaffold templates |
| **Strip** | Specific model names (ChatGPT, Codex, Cursor/Composer) → generic role labels |
| **Source citations** | `ai/doc/guides/design-to-spec-handoff.md` §Executor Mutation Limits: executor may only update Status, Checklist, Risks/Notes |

---

## 3. Cross-Cutting Protocol Primitives

These fragments are smaller than a full SOP but recur across repos as reusable building blocks. They should be extracted into a shared primitives reference rather than duplicated inside each SOP.

| Primitive | Description | Strongest Source | Repos |
|-----------|-------------|-----------------|-------|
| **Completeness gate / DoD pre-check** | Define done-criteria before starting any task; block if criteria cannot be defined | `closed-loop-delivery/SKILL.md` (antigravity) | antigravity, ai-engineering-sop, agentic-rules |
| **User-decision routing** (`needs_decision`) | Explicit escalation outcome: stop execution, return to owner with decision required | `task-lifecycle-and-escalation.md` (ai-engineering-sop) | ai-engineering-sop, agentic-rules (implicit) |
| **Replan routing** (`replan_required`) | Explicit escalation outcome: current spec can no longer safely bound remaining work | `task-lifecycle-and-escalation.md` (ai-engineering-sop) | ai-engineering-sop only |
| **Understanding Lock** | Bullet-summarize understanding; block progress until explicit user confirmation | `brainstorming/SKILL.md` (antigravity) | antigravity |
| **Cold-reader completeness check** | Test output with a context-free agent before declaring done; catches assumed-knowledge gaps | `doc-coauthoring/SKILL.md` (anthropic-skills) | anthropic-skills, antigravity |
| **Iron Law (test-first)** | No production code before a failing test exists; hard stop, not guidance | `test-driven-development/SKILL.md` (antigravity) | antigravity, agentic-rules |
| **Severity triage (Blocking/Important/Minor)** | Classify all review findings before presenting; minor items do not block | `code-review-excellence/SKILL.md` (antigravity) | antigravity |
| **Secrets hard-block** | Pre-push scan for credentials; if found: stop, alert human, do not commit | `codebase-audit-pre-push/SKILL.md` (antigravity) | antigravity, agentic-rules (softer) |
| **Explain the why** | Every rule/instruction must include its rationale; mandates over reasons produce gaming | `skill-creator/SKILL.md` (anthropic-skills) | anthropic-skills |
| **Write-back 3-question gate** | Before persisting any fact: "Will it still matter? Can it be reused? Does it have a home?" | `AGENTS.md` (ai-engineering-sop) | ai-engineering-sop |
| **Decision Log** | Running record: what was decided / alternatives considered / why chosen | `brainstorming/SKILL.md` (antigravity) | antigravity |
| **Opt-in workflow offer** | Offer structured SOP; allow freeform fallback if user declines | `doc-coauthoring/SKILL.md` (anthropic-skills) | anthropic-skills |
| **Exec mutation limits** | Executor may only touch Status/Checklist/Risks; cannot rewrite Goal/Scope/DoneWhen | `design-to-spec-handoff.md` (ai-engineering-sop) | ai-engineering-sop |
| **WIP commit convention** | `WIP:` prefix commits = context snapshots; post progress notification on commit | `canonical-rules.md` §1 (agentic-rules) | agentic-rules |
| **Stable version state file** | `stable_version.json` enables rollback without pipeline state | `canonical-rules.md` §7 (agentic-rules) | agentic-rules |
| **Tokens-per-task metric** | Measure total session tokens from start to task completion, not per-request | `context-compression/SKILL.md` (antigravity) | antigravity |
| **Probe-based eval (4 probes)** | Recall / Artifact / Continuation / Decision — all 4 must pass before handoff | `context-compression/SKILL.md` (antigravity) | antigravity |
| **Skill promotion trigger** | Promote workflow to skill when: repeats + recognizable I/O + reduces reasoning + reusable | `skill-policy.md` (ai-engineering-sop) | ai-engineering-sop, anthropic-skills (implicit) |
| **Scope creep prevention** | If task becomes broader while working, stop and narrow it again; do not silently expand | `.cursor/rules/scope-control.mdc` (ai-engineering-sop) | ai-engineering-sop, agentic-rules |
| **Placeholder convention** | `{{PLACEHOLDER}}` syntax for configurable values; never commit secrets | `LLM_PROJECT_SETUP_PROMPT.md` (agentic-rules) | agentic-rules |
| **Generated-doc freshness** | When adding/removing files, update index in same change; stale index blocks delivery | `AGENTS.md` (ai-engineering-sop) | ai-engineering-sop, agentic-rules |
| **Mermaid for dependency graphs** | Prefer Mermaid over DOT notation for dependency/flow graphs (per scratchpad note) | `.plans/notes/scratchpad.md` | Design decision — apply when porting sprint-planning SOP |

---

## 4. Persona / Role-Theater Overhead

Across all four repos, role-theater appears at measurably different densities. This section quantifies the cost.

| Repo | Theater Density | Theater Encoding | Procedural Residue After Strip |
|------|----------------|-----------------|-------------------------------|
| **ai-engineering-sop** | **~0%** | None — all artifacts are procedures, templates, or constraints. No "you are a…" framing anywhere. | 100% portable |
| **agentic-rules** | **~15%** | 22–25 individual persona definitions in `Agent-Personas.md`; "Cody" branding; "AINative Studio" narrative. Underlying rules are procedural. | ~85% portable after stripping |
| **anthropic-skills** | **~10%** | `brand-guidelines/SKILL.md` (100% theater); `algorithmic-art`, creative design skills (aesthetic opinion wrapped as procedure). Core workflow skills (skill-creator, doc-coauthoring, webapp-testing) have zero theater. | ~90% portable in workflow skills; 0% in creative skills |
| **antigravity-awesome-skills** | **~25%** | Persona skills (Steve Jobs, Elon Musk, etc.); conductor skills; 200+ Azure vendor wrappers. **But**: the 13 recommended skills have ≤5% theater. The distribution is bimodal: pure-theater skills and pure-procedure skills with little in between. | ~95% portable in recommended candidates |

**Pattern finding:** Theater is almost never mixed into procedural steps in the candidate SOPs — it is concentrated in non-candidate sections (persona descriptions, capability lists, vendor wrappers). The exception is `security-auditor` (antigravity): a 9-section "Capabilities" persona block surrounds a 5-step procedure. The procedure survives extraction, but 80% of the source file is theater.

**Cost of theater in source files:**
- Increases stripping effort without adding executable value
- Creates false signals about "sophistication" of a skill (long ≠ useful)
- Obscures the actual trigger condition (persona framing delays the reader's orientation to when to invoke the skill)
- Anthropic's `skill-creator` explicitly warns against this: *"if you find yourself writing ALWAYS or NEVER in all caps… reframe and explain the reasoning"* — the same principle applies to persona headers

---

## 5. Repo-Level Strengths Summary

| Repo | Unique Strength | Primary Contribution to Canonical Set |
|------|----------------|---------------------------------------|
| **ai-engineering-sop** | Task boundary and escalation vocabulary | Task-spec template, executor mutation limits, escalation outcomes (`needs_decision` / `replan_required`), write-back policy, multi-agent handoff |
| **agentic-rules** | Self-validation loop and canonical rules placement | Self-validation post-task audit, backlog-to-branch workflow, CI/CD skeleton, `stable_version.json` rollback, meta-rule on rules placement |
| **anthropic-skills** | Iterative improvement loop and cold-reader test | `skill-creator` loop (draft→test→review→revise), `doc-coauthoring` 3-stage structure, "explain the why" meta-principle, opt-in workflow offer |
| **antigravity-awesome-skills** | Dense procedural primitives at gate level | Clarification gate, TDD Iron Law + Verification Checklist, context handoff with probe-based eval, pre-push secrets hard-block, Understanding Lock |

---

## 6. Evidence Bullets

Direct citations traceable to source audit files:

1. **antigravity clarification gate** — `skills/ask-questions-if-underspecified/SKILL.md` step 2: *"Ask 1-5 questions in the first pass. Prefer questions that eliminate whole branches of work."* The `defaults` fast-path is unique to this repo; no other repo provides a zero-friction opt-out from the clarification gate.

2. **antigravity TDD Iron Law** — `skills/test-driven-development/SKILL.md`: *"NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST"*; Verification Checklist hard-stop: *"Can't check all boxes? You skipped TDD. Start over."* — stronger than agentic-rules §4 which uses prescriptive but softer language.

3. **ai-engineering-sop executor mutation limits** — `design-to-spec-handoff.md` §Executor Mutation Limits: *"The executor may update only: Status, Task Checklist, Risks / Notes. The executor should not rewrite: Goal, In Scope, Out of Scope, Done When, Validation, Write-back Needed."* — no equivalent anywhere in the other three repos.

4. **ai-engineering-sop write-back gate** — `AGENTS.md` §Write-back policy: *"1. Will this still matter later? 2. Can this be reused later? 3. Does it have a clear destination file? If the answer is not clearly yes, do not write it back."* — uniquely compact and portable formulation.

5. **anthropic-skills cold-reader test** — `skills/doc-coauthoring/SKILL.md` Stage 3: *"Test the doc with a fresh Claude (no context) to catch blind spots before others read it."* — independently invented in antigravity's port; confirms convergent discovery of the same primitive.

6. **anthropic-skills explain-the-why** — `skills/skill-creator/SKILL.md`: *"Explain the why. Try hard to explain the why behind everything you're asking the model to do."* and *"if you find yourself writing ALWAYS or NEVER in all caps… reframe and explain the reasoning"* — highest-value meta-principle in the corpus; applies to porting all other SOPs.

7. **antigravity context-compression probe-based eval** — `skills/context-compression/SKILL.md`: 4 probe types (Recall, Artifact, Continuation, Decision); *"The right metric is tokens-per-task: total tokens consumed from task start to completion"* — no equivalent in other three repos; gap they all share.

8. **ai-engineering-sop escalation vocabulary** — `task-lifecycle-and-escalation.md` §Escalation Outcomes: `replan_required` (spec can no longer safely bound work) vs. `needs_decision` (choice above executor level) — formal vocabulary absent from antigravity and anthropic-skills; loosely present in agentic-rules issue state transitions.

9. **agentic-rules self-validation uniqueness** — `canonical-rules.md` §8 note: *"Source: meta-rules.md §8 — unique to that file; not present in globalrules.md"* — 3-question post-task audit loop is the only explicit post-execution compliance check in the corpus.

10. **agentic-rules meta-rule placement** — `strict-rules-how-to.md`: *"Rules in .claude/rules/ require me to remember to check them / Rules in CLAUDE.md are unavoidable — I see them every session"* — governs how all other SOPs should be deployed; no equivalent in other repos.

11. **antigravity theater bimodal distribution** — 200+ Azure/vendor wrapper skills vs. 13 recommended candidates with ≤5% theater; distribution is bimodal not continuous.

12. **antigravity pre-push secrets hard-block** — `skills/codebase-audit-pre-push/SKILL.md` step 1: "Critical - Check for secrets" — hard stop, not a checklist item; agentic-rules treats same as checklist item in §5, softer encoding.

13. **scratchpad note** — `.plans/notes/scratchpad.md`: *"TDD Red-Green-Refactor scaffolding protocol <- this is a STRONG candidate for our SOP set, and should hook into our PRD workflow"* and *"in stead of DOT, we should enforce mermaid for Dependency Graphs"* — confirmed by cross-repo analysis; both notes validated.

---

## 7. Recommended `.agents` Build Order

Based on cross-repo comparison, the following order maximizes coverage per porting effort:

### Phase 1 — Universal gates (fire on every task, zero vendor coupling)
1. `clarification-gate` ← antigravity `ask-questions-if-underspecified`
2. `self-validation` ← agentic-rules `canonical-rules.md` §8
3. `reasoning-before-code` ← antigravity `brainstorming` + agentic-rules §3 (merged)
4. `tdd-protocol` ← antigravity `test-driven-development`

### Phase 2 — Execution contracts (task lifecycle + quality)
5. `task-spec` (template) ← ai-engineering-sop `task-spec-template.md`
6. `plan-to-spec` (skill) ← ai-engineering-sop `plan-to-spec.md`
7. `task-lifecycle` (rule) ← ai-engineering-sop `task-lifecycle-and-escalation.md`
8. `validation-strategy` ← ai-engineering-sop `testing-strategy.md` + `design-whitebox-tests.md`

### Phase 3 — Delivery gates
9. `delivery-gate` ← antigravity `closed-loop-delivery` + ai-engineering-sop write-back policy
10. `pre-push-audit` ← antigravity `codebase-audit-pre-push`
11. `debug-protocol` ← antigravity `debugging-strategies`

### Phase 4 — Documentation, architecture, and meta
12. `doc-coauthoring` ← anthropic-skills (canonical) + antigravity (port)
13. `architecture-decisions` ← antigravity `architecture`
14. `iterative-artifact-improvement` ← anthropic-skills `skill-creator`

### Phase 5 — Advanced / session management
15. `context-handoff` ← antigravity `context-compression`
16. `multi-agent-handoff` ← ai-engineering-sop `design-to-spec-handoff.md`

---

*Cross-repo comparison complete. All 4 audit files consumed. 15 SOP candidates ranked. 22 cross-cutting primitives extracted. Build order defined.*
