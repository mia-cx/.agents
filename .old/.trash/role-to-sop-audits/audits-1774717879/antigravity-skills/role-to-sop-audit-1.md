# Audit: antigravity-skills — Structured Findings
**Source repo:** `.references/antigravity-skills/`
**Compiled from:** `raw-findings.md`
**Date:** 2026-03-28

---

## 1. Repo Overview

`antigravity-skills` is a community-contributed skill collection for Claude agents, assembled as a shared toolkit rather than a product-specific repo. It is not tied to a single organisation: skills carry `source: community` frontmatter and cover concerns that recur across any coding-agent deployment — clarification gates, delivery discipline, context hygiene, debugging, code review, multi-agent orchestration, and incident operations. The repo includes both universal, stack-agnostic SOPs and several tightly coupled sub-collections (Conductor app workflows, Loki autonomous-OS skills, Andru.ia-branded workflows, and bdistill CLI tools) that are org- or product-specific and not intended for general use. Total surface is approximately 40+ SKILL.md files. The collection is strongest in behavioral discipline (verification, clarification, delivery) and weakest in completeness — at least one skill (`agent-evaluation`) is visibly truncated mid-sentence with placeholder comments in its tables.

---

## 2. Content Summary

All skills follow a `skills/<name>/SKILL.md` layout. Each file opens with YAML frontmatter that names the skill, states a type, and in most cases includes a portable-yes/no judgment and a reason. Below the frontmatter, files follow a loose but recognisable schema: overview → trigger → steps or contract → output format → optional anti-patterns/rationalizations tables → related skills. Depth varies: a few files (differential-review, systematic-debugging, postmortem-writing) are detailed multi-phase SOPs with tables, decision trees, and worked examples; others (behavioral-modes, agent-evaluation) are outlines or stubs. Several files reference sibling `.md` companion documents (methodology.md, adversarial.md, OUTPUT_REQUIREMENTS.md, COMPLETENESS_CHECKLIST.md) that are not present in the repo, creating dangling dependencies. The Conductor and Loki sub-collections use proprietary path and schema conventions not shared with the rest of the collection. Context-management content is split across at least five files (context-compression, context-guardian, context-fundamentals, context-window-management, context-manager) with uneven quality and overlapping scope.

---

## 3. SOP Split

### Port (promote to `.agents`)

| Skill | Rationale |
|---|---|
| `ask-questions-if-underspecified` | Fully portable clarification gate; no org coupling; compact reply format is best-practice UX |
| `closed-loop-delivery` | DoD-not-diff delivery discipline applicable to any coding agent; only one org coupling (create-issue-gate name) |
| `receiving-code-review` | Concrete PR-response protocol; cosmetic coupling only (one joke phrase, one partner reference) |
| `verification-before-completion` | Zero strip needed; pure epistemic enforcement; no org references |
| `code-review-excellence` | Review axes and severity tiers are org-agnostic; only coupling is a missing companion file pointer |
| `differential-review` | Rigorous security-focused PR review protocol with rationalizations table; companion files absent but core phases inline |
| `systematic-debugging` | Four-phase Iron Law debugging; fully portable; sibling file references can be dropped |
| `subagent-driven-development` | Reusable multi-agent execution loop; companion prompt templates are the only coupling |
| `planning-with-files` | Universal persistent working-memory pattern; 2-Action Rule and 3-Strike Protocol are the key atoms |
| `context-compression` | Anchored-iterative compression with structured summary template; companion skill links strip cleanly |
| `postmortem-writing` | Three-tier template (Standard/Quick/5-Whys) is a strong differentiator; only placeholder URLs and internal prefixes need stripping |
| `on-call-handoff-patterns` | Full-shift / quick-async / mid-incident template ladder is high operational value; org tooling strips cleanly |
| `agents-md` | Disciplined AGENTS.md/CLAUDE.md authoring SOP; <60-line target with cited rationale; ready to emit |
| `create-issue-gate` | Execution gate with concrete issue body template; zero org coupling in the core logic |
| `executing-plans` | Checkpoint-based plan execution loop; only coupling is superpowers:finishing-a-development-branch handoff |
| `concise-planning` | Minimal planning template with atomic verb-first checklist; promotion-ready |
| `dispatching-parallel-agents` | Decision tree + prompt anatomy for parallel agent fan-out; session war story strips cleanly |
| `parallel-agents` | Generic when-to-parallelize / when-to-sequence guidance with synthesis step |
| `writing-plans` | Bite-sized plan template with explicit test and commit actions |
| `finishing-a-development-branch` | Verify-tests-then-present-options branch completion checklist |
| `memory-systems` | Memory architecture selection matrix with layer taxonomy and consolidation steps |
| `audit-skills` | Non-intrusive static-analysis audit workflow with threat taxonomy and reporting checklist |
| `agentic-actions-auditor` | Stepwise AI-action audit with detection vectors and evidence capture |
| `clarity-gate` | Document-quality validation with epistemic checks and structured output template |

### Leave Out

| Skill | Rationale |
|---|---|
| `autonomous-agent-patterns` | Builder-facing Python tutorial; no executable SOP; no trigger a runtime agent could satisfy |
| `conductor-setup` | Hard-coupled to Conductor app layout, conductor.json, bin/, Rails conventions |
| `conductor-implement` | Depends on Conductor-specific directory structure and track metadata |
| `conductor-manage` | Conductor track lifecycle operations; not transferable |
| `conductor-validator` | Validates Conductor artifacts using hardcoded project paths |
| `conductor-new-track` | Specific to Conductor's track model and spec/plan generation |
| `conductor-status` | Assumes tracks.md, metadata.json, and plan.md schema |
| `conductor-revert` | Relies on Conductor track IDs and commit naming conventions |
| `loki-mode` (both entries) | Deeply bound to .loki directory layout, proprietary model routing, zero-intervention autonomy assumptions |
| `agent-evaluation` | Truncated mid-sentence; sharp-edges table is all `// placeholder`; no steps or contracts |
| `context-manager` | Broad persona dump; overlapping claims; no crisp workflow boundary |
| `behavioral-modes` | Inconsistent depth across modes; Combining Modes section empty; IMPLEMENT mode imports external `clean-code` dependency |
| `multi-agent-patterns` | Python code blocks and named framework comparisons (LangGraph, AutoGen, CrewAI) make it a reference doc, not a portable SOP |
| `bdistill-behavioral-xray` | Tightly coupled to bdistill CLI/MCP and model-self-testing context |
| `bdistill-knowledge-extraction` | Anchored to bdistill and Ollama-specific commands |
| `tdd-orchestrator` | Broad capability catalog; reads as generic overview, not a crisp executable SOP |
| `skill-creator` | Tied to repo-specific template paths, platform detection, and installation commands |
| `00-andruia-consultant` | Spanish-only output constraint; Andru.ia-specific framing |
| `10-andruia-skill-smith` | Anchored to specific repo structure, Windows paths, and branding |
| `progressive-estimation` | Packaged around specific product, output destinations, and AI-agent terminology |
| `bdi-mental-states` | Narrowly specialized to RDF/ontology and neuro-symbolic systems |
| `agent-memory-mcp` | Implementation tied to specific external repository and launch process |
| `antigravity-skill-orchestrator` | Memory tool and catalog path assumptions are ecosystem-specific |
| `antigravity-workflows` | Named workflow catalog and local docs/data sources are implementation-specific |
| `agent-orchestrator` | Scan/match scripts and registry layout are repo-specific |

**Partial — hold for adaptation:**

| Skill | Portable core | Blocker |
|---|---|---|
| `context-guardian` | P0/P1/P2 triage framework; transition briefing template | Hardcoded Windows paths; Portuguese text; script coupling |
| `context-driven-development` | Maintaining canonical context docs for product/tech/workflow | Conductor artifact names and lifecycle |
| `context-fundamentals` | Finite-budget framing; progressive disclosure principle | Reads as instructional background, not executable SOP |
| `context-window-management` | Tiered truncation strategy; serial-position optimization | High-level and incomplete |
| `audit-context-building` | Phase 1–3 pipeline; anti-rationalization table | Smart-contract vocabulary; companion files absent |

---

## 4. Per-SOP Table (Portable Candidates)

| Skill | Source file | Trigger | Steps/contract | Quality bar | Escalation | Strip | Notes |
|---|---|---|---|---|---|---|---|
| **ask-questions-if-underspecified** | `skills/ask-questions-if-underspecified/SKILL.md` | Request has multiple plausible interpretations or key details (objective, scope, constraints, environment, safety/reversibility) are unclear | 1. Decide if underspecified. 2. Ask 1–5 must-have questions; offer multi-choice, defaults, and compact reply format. 3. Pause — no commands or plans until answers arrive; low-risk discovery permitted. 4. If user says proceed: state numbered assumptions, confirm. 5. Restate requirements in 1–3 sentences, then start. | All five ambiguity axes evaluated before deciding; compact reply format (`1a 2b` / `defaults`) offered | Treat as underspecified by default when objective is ambiguous | Nothing — zero org-specific content | Strong complement to cot-gate / self-validation; compact reply format is best-practice UX worth preserving verbatim |
| **closed-loop-delivery** | `skills/closed-loop-delivery/SKILL.md` | Coding/fix task expected end-to-end with minimal re-prompting, spanning impl + tests + PR + deploy + runtime verification | 1. Define DoD as testable criteria. 2. Implement minimal scoped change. 3. Verify locally. 4. Review loop: fetch PR comments, classify valid/noise, fix valid. 5. Dev deploy + runtime verification against DoD. 6. Report done only when all DoD checks pass; otherwise loop. | Output contract: AC checklist (pass/fail) + commands run + runtime evidence + PR status | Loop until DoD passes or explicit stop condition | `create-issue-gate` reference (org-specific name); dev-environment literal name; PR polling timing constants (3m/6m/10m) optional | DoD-not-diff is the cleanest portable principle; output contract is the highest-value transferable artefact |
| **receiving-code-review** | `skills/receiving-code-review/SKILL.md` | Agent receives code-review feedback (inline PR comments, review threads, or verbal fix instructions) | 1. Read all feedback before reacting. 2. Restate unclear items — stop before implementing. 3. Verify each suggestion against codebase reality (correctness, platform compat, YAGNI, prior arch). 4. Respond with technical acknowledgment or reasoned pushback; no performative agreement. 5. Implement one item at a time, test each. 6. Prioritise: blocking → simple → complex. 7. Correct factually if pushed back incorrectly. 8. Reply in-thread, not as top-level PR comments. | No gratuitous agreement language; every suggestion verified against codebase before implementing | Factual correction without extended apology | "Your human partner" references → "the user"; "Strange things are afoot at the Circle K" signal phrase; `source: community` / `risk: unknown` frontmatter | YAGNI check (grep before implementing reviewer-suggested features) is an underrated sub-step worth preserving as named |
| **verification-before-completion** | `skills/verification-before-completion/SKILL.md` | Before ANY completion claim, success statement, commit/push/PR action, task sign-off, or agent delegation handoff | 1. IDENTIFY the command that proves the claim. 2. RUN it fresh and in full (no cached results). 3. READ full output and check exit code/failure count. 4. VERIFY output matches claim. 5. If YES → state claim WITH evidence. If NO → state actual status with evidence. | Fresh run required; exit code and failure count explicitly checked | If verification fails: report actual status with evidence, do not claim success | Nothing — zero org-specific content; "24 failure memories" narrative is internal flavour, keep or trim | Rationalization Prevention and Red Flags — STOP sections are highest-signal: pre-empt cognitive shortcuts that cause silent failures |
| **code-review-excellence** | `skills/code-review-excellence/SKILL.md` | Reviewing PRs/code changes; establishing review standards; auditing for correctness/security/performance | 1. Read context, requirements, test signals. 2. Review across correctness/security/performance/maintainability axes. 3. Deliver actionable feedback with severity + rationale. 4. Ask clarifying questions when intent unclear. 5. Optionally load companion checklist. | Output: high-level summary → issues grouped by severity (blocking/important/minor) → suggestions & questions → test/coverage notes | Escalate blocking issues first; minor issues last | Reference to `resources/implementation-playbook.md` (absent companion file); negative-framing "Do not use" section → fold into trigger description | Severity tiers (blocking/important/minor) are the key portable artefact; "knowledge sharing, not gatekeeping" is concise and worth carrying |
| **differential-review** | `skills/differential-review/SKILL.md` | User asks to review a PR/commit/diff for security; mentions "security review", "differential review", "audit a PR", or wants blast radius assessment | Pre-Analysis → Triage (Phase 0) → Code Analysis (Phase 1) → Test Coverage (Phase 2) → Blast Radius (Phase 3) → Deep Context (Phase 4) → Adversarial Modeling (Phase 5) → Report (Phase 6). Scale strategy by codebase size (SMALL/MEDIUM/LARGE). Mandatory output: markdown report file, never chat-only. Quality checklist before delivery. | Quality checklist completed before delivery; report filed as artifact | Mandatory file output regardless of finding count | Sibling skill file references (methodology.md, adversarial.md, reporting.md, patterns.md); integration block naming `audit-context-building` and `issue-writer`; "When NOT to Use" → rephrase positively | Rationalizations table (anti-pattern → why wrong → required action) is standout portable element; pre-empts "small PR" / "just a refactor" shortcuts |
| **systematic-debugging** | `skills/systematic-debugging/SKILL.md` | Any bug, test failure, unexpected behaviour, or performance problem — including "obvious" and time-pressured cases; also red-flags: "just try X" or 3+ failed fixes | Phase 1: read errors, reproduce, check recent changes, instrument, trace data flow. Phase 2: find working examples, compare differences. Phase 3: form single hypothesis, minimal test, verify or re-hypothesise. Phase 4: write failing test, one fix, verify; if ≥3 fixes failed stop and question architecture. | Iron Law: no fixes without root cause; single hypothesis per Phase 3 cycle | If ≥3 fixes fail: stop, question architecture, escalate | Bash CI/codesign examples (illustrative); `superpowers:` namespace prefixes; "your human partner's Signals" heading; cross-references to absent sibling files (root-cause-tracing.md, defense-in-depth.md, condition-based-waiting.md) | "3+ fixes = architecture problem" and rationalizations table are the most reusable atoms; section heading needs neutral language |
| **subagent-driven-development** | `skills/subagent-driven-development/SKILL.md` | User has an implementation plan with mostly-independent tasks and wants to execute it using subagents for isolation and quality gating | 1. Read plan once; extract all tasks into TodoWrite. 2. Per task: dispatch implementer subagent with full context; answer pre-work questions first. 3. Dispatch spec-compliance reviewer; fix gaps; re-review until ✅. 4. Dispatch code-quality reviewer; fix; re-review until ✅. 5. Mark complete; next task. 6. After all tasks: dispatch holistic reviewer; run branch-finishing workflow. | Two-stage review ordering (spec compliance before code quality); no parallel implementers | If spec-compliance fails: fix before code-quality review begins | dot/graphviz diagrams; references to `./implementer-prompt.md` relative templates; `superpowers:` namespace prefixes on integration links | Two-stage review ordering and no-parallel-implementers rule are sharpest invariants; worked example is pedagogically strong |
| **planning-with-files** | `skills/planning-with-files/SKILL.md` | Any complex multi-step task (3+ steps), research, build/create projects, or tasks spanning many tool calls | 1. Create task_plan.md, findings.md, progress.md before starting. 2. After every 2 view/browser/search operations, write key findings to file (2-Action Rule). 3. Re-read plan file before every major decision. 4. After each phase, mark status complete and log errors. 5. Apply 3-Strike Error Protocol (diagnose → alternative → rethink → escalate). 6. Pass 5-Question Reboot Test. | 2-Action Rule enforced; 3-Strike Protocol applied; 5-Question Reboot Test passed | After 3 strikes with no resolution: escalate; never repeat identical failing action | Template file references (`${CLAUDE_PLUGIN_ROOT}/templates/`); script references (init-session.sh, check-complete.sh); external doc links; file-location table | 2-Action Rule and 3-Strike Protocol are highest-signal distillables; "Context Window = RAM / Filesystem = Disk" framing worth keeping verbatim |
| **context-compression** | `skills/context-compression/SKILL.md` | Agent sessions approaching context window limits; codebases >5M tokens; agent "forgetting" prior file edits; designing summarisation subsystems | 1. Select compression method (anchored iterative preferred for coding agents). 2. Define structured summary sections (Session Intent, Files Modified, Decisions Made, Current State, Next Steps). 3. Trigger at 70–80% context utilisation. 4. On each trigger: summarise newly-truncated span and merge into existing sections. 5. Validate with probe-based evaluation (recall, artifact, continuation, decision probes). 6. Monitor re-fetching frequency as live quality signal. | Probe-based evaluation after each compression; re-fetching frequency as live quality signal | If validation probes fail: re-compress with wider span | Author attribution block; "Integration" cross-links to absent sibling skills (context-degradation, context-optimization, evaluation, memory-systems); external Netflix/Factory Research references | Tokens-per-task vs tokens-per-request framing is a strong conceptual anchor; artifact trail weakness (2.2–2.5/5) is an honest, quantified caveat worth preserving |
| **postmortem-writing** | `skills/postmortem-writing/SKILL.md` | Post-incident review; SEV1/SEV2 or customer-facing outage >15 min; data loss or security incident; novel failure mode | 1. Establish blameless framing. 2. Choose template tier: Standard/Quick/5-Whys. 3. Fill UTC-stamped timeline table. 4. Run 5-Whys root-cause analysis. 5. Document detection/response gaps and what worked. 6. Quantify customer, business, and technical impact. 7. Create action items with priority/owner/due-date/ticket. 8. Hold facilitated 60-min meeting within 3–5 days. 9. Finalize and share broadly; track action items. 10. Quarterly: review patterns across postmortems. | Action-item table complete (Priority/Action/Owner/Due Date/Ticket) before sharing; blameless framing declared up front | Any action item missing owner or due date is not complete | Placeholder Grafana/metric links; internal ticket prefixes (ENG-*, OPS-*); example author handles (@alice, @bob); "Do not use this skill when" boilerplate | Three-tier template approach (Standard/Quick/5-Whys) is strongest differentiator; "where we got lucky" section is high-value and often omitted elsewhere |
| **on-call-handoff-patterns** | `skills/on-call-handoff-patterns/SKILL.md` | Transitioning on-call responsibilities; writing shift handoff summaries; documenting ongoing investigations; mid-incident handoffs | 1. 30-min overlap: outgoing writes handoff doc (15 min), sync call (15 min). 2. Handoff doc covers Active Incidents → Ongoing Investigations → Resolved → Recent Changes → Known Issues → Upcoming Events → Escalation reminders → Quick Reference. 3. Incoming engineer verifies routing, notifications, VPN/access, dashboards. 4. Mid-incident: abridged template (current state, done, needs doing, key people, comms status). 5. Escalation triggers: SEV1, data breach, 30-min diagnosis stall, cross-team scope, business-impact threshold. | Incoming engineer verification checklist completed before outgoing signs off | Escalate if diagnosis stalls 30 minutes | Grafana/PagerDuty/kubectl/Redis/psql examples; specific service names; concrete ticket IDs; named engineers; `resources/implementation-playbook.md` reference; "Do not use this skill when" boilerplate | Three-template ladder (full → quick → mid-incident) is high operational value; promote with minimal editing |
| **agents-md** | `skills/agents-md/SKILL.md` | User asks to create AGENTS.md, update AGENTS.md, set up CLAUDE.md, or needs to keep agent instructions concise | 1. Analyse project — detect package manager, linter configs, CI commands, monorepo markers. 2. Write with headers + bullets only; no paragraphs, no filler. 3. Required sections: Package Manager, File-Scoped Commands, Commit Attribution, Key Conventions. 4. Optional sections only if genuinely needed. 5. Target <60 lines; hard ceiling 100 lines. 6. Create AGENTS.md at root; symlink as CLAUDE.md. | <60-line target; no duplicated linter rules; no paragraph prose | If monorepo: add overrides section; do not merge all packages into one block | Commit Attribution email domain placeholder (strip specific domain); everything else travels cleanly | <60-line target with research-based rationale (instruction-following degrades with length) is a strong, citable constraint; anti-patterns list is especially actionable |
| **create-issue-gate** | `skills/create-issue-gate/SKILL.md` | Starting a new implementation task requiring a GitHub issue with AC gating before execution begins | 1. Collect Problem/Goal/Scope/Non-Goals/AC/Dependencies. 2. Validate AC are testable (pass/fail checkable). 3. If AC missing/vague → create issue with Status:draft + Execution Gate:blocked. 4. If AC valid → create issue with Status:ready + Execution Gate:allowed. 5. Downstream execution workflows blocked until gate is `allowed`. | AC must be pass/fail checkable; no execution until gate is `allowed` | If AC cannot be made testable: escalate to human for clarification | `source: community`, `date_added` frontmatter fields; `closed-loop-delivery` reference name (keep concept, strip name) | Valid/invalid AC examples are high-value portable content; strong complement to issue-triage |
| **executing-plans** | `skills/executing-plans/SKILL.md` | Have a written implementation plan to execute in a separate session with review checkpoints | 1. Load & critically review plan, raise concerns. 2. Execute first 3 tasks as batch, mark in_progress → completed. 3. Report batch output + verification, say "Ready for feedback". 4. Apply feedback, execute next batch, repeat. 5. After all tasks, run tests and file PR. | Verification reported after each batch; stop-and-ask rules explicit | Stop and report if blocker encountered mid-batch | `superpowers:finishing-a-development-branch` handoff → replace with "run tests, file PR"; self-announcement strings ("I'm using the executing-plans skill…") | Batch size (3 tasks) is sensible default; stop-and-ask rules are explicit and useful |
| **concise-planning** | `skills/concise-planning/SKILL.md` | User asks for a plan for a coding task (explicit planning request) | 1. Scan context (README, docs, relevant code). 2. Minimal interaction — max 1–2 blocking questions. 3. Generate plan: Approach (1–3 sentences) + Scope (In/Out bullets) + Action Items (6–10 atomic verb-first tasks) + Validation item + Open Questions (max 3). | Max 6–10 action items; each atomic and verb-first; max 3 open questions | If scope is too large for 10 tasks: split into phases, plan one at a time | "When to Use" boilerplate footer | Pairs naturally with cot-gate and self-validation; max-items constraint prevents sprawling plans |
| **dispatching-parallel-agents** | `skills/dispatching-parallel-agents/SKILL.md` | 2+ independent tasks with no shared state or sequential dependencies; ≥3 failing test files with distinct root causes; multiple broken subsystems with no cross-dependency | 1. Identify independent domains — group by what's broken. 2. Write focused, self-contained agent prompts (scope + goal + constraints + expected output format). 3. Dispatch in parallel (one agent per domain). 4. Review summaries, check for conflicts, run full suite, integrate. | No parallel agents with shared state dependencies; each agent prompt fully self-contained | If conflicts found on integration: resolve sequentially | `.dot` digraph block; TypeScript `Task()` pseudocode (use prose instead); "Real Example from Session" and "Real-World Impact" sections; 2025-10-03 date reference | Decision tree (independent? → parallel / shared state? → sequential / related? → single) is core portable rule; agent-prompt anatomy is key deliverable |
| **parallel-agents** | `skills/parallel-agents/SKILL.md` | Comprehensive analysis benefiting from multiple specialized agents; tasks with parallelisable subtasks or domain specialisation | 1. Classify task for multi-agent (context bottleneck, parallelisable subtasks, domain specialisation). 2. Select pattern (supervisor/peer-to-peer/hierarchical). 3. Design context isolation. 4. Add consensus/coordination mechanism. 5. Synthesise results; use direct pass-through where synthesis would lose fidelity. | Synthesis step required after parallel execution; direct pass-through when synthesis degrades fidelity | — | `superpowers:` integration references | Portable core is pattern selection for comprehensive analysis with synthesis |
| **writing-plans** | `skills/writing-plans/SKILL.md` | User has an implementation plan to write; needs bite-sized step decomposition with explicit test and commit actions | Produce plan with small sequential steps, each including exact file/test commands and a commit action | Each step independently verifiable; explicit test commands present | — | Ecosystem-specific path examples | Small-step plan template with explicit test and commit actions is the portable core |
| **finishing-a-development-branch** | `skills/finishing-a-development-branch/SKILL.md` | After implementation tasks are complete; branch needs to be validated and a merge/PR/keep/discard decision made | 1. Run full test suite. 2. Present structured options: merge (with PR), keep (with notes), or discard (with rationale). | All tests passing before presenting options | If tests fail: report failures before offering merge option | Ecosystem-specific command examples | Verify-tests-then-present-options flow is general; structured decision sequence is the portable core |
| **memory-systems** | `skills/memory-systems/SKILL.md` | Designing memory architecture; selecting memory type for agent task; managing knowledge retrieval across sessions | 1. Select memory layer (in-context, external, episodic, semantic). 2. Choose retrieval mode. 3. Apply consolidation steps for temporal knowledge. 4. Use selection matrix to match task type to memory architecture. | Selection justified against matrix; retrieval mode documented | — | Author attribution; cross-links to absent sibling skills | Context-memory spectrum, layer taxonomy, and selection matrix are highest-value extractions |
| **audit-skills** | `skills/audit-skills/SKILL.md` | Static-analysis audit of an agent skill collection; threat category identification; reporting | Non-intrusive audit: check frontmatter, trigger logic, strip burden, companion-file dependencies, portability flags. Apply platform threat taxonomy. Produce structured report. | Platform threat taxonomy applied; findings in prescribed checklist format | — | Platform-specific detection examples | Non-intrusive audit rule set and reporting checklist are the portable core |
| **agentic-actions-auditor** | `skills/agentic-actions-auditor/SKILL.md` | Auditing agent workflows for AI-generated actions; identifying automation risks | Workflow scan → AI-action identification matrix → vector checks → evidence capture → findings format | Vector check applied to all identified AI-action surfaces; evidence captured per finding | — | Repo-specific example paths | Detection vectors and findings format are the portable core |
| **clarity-gate** | `skills/clarity-gate/SKILL.md` | Validating document or output quality before delivery; epistemic checks | Epistemic checks → verification hierarchy → CGD/SOT format validation → structured output | Structured output template completed; epistemic checks passed | — | Internal cross-references | Epistemic checks and structured output template are the portable core |

---

## 5. Portability Ranking

### High — ship with minimal editing

- **verification-before-completion** — zero strip; blunt imperative tone is load-bearing
- **ask-questions-if-underspecified** — zero strip; compact reply format is best-practice UX
- **closed-loop-delivery** — one org-name coupling (create-issue-gate reference)
- **systematic-debugging** — strip sibling file references and section heading wording only
- **postmortem-writing** — strip placeholder URLs and internal ticket prefixes only
- **agents-md** — strip one email domain placeholder; template is ready-to-emit
- **create-issue-gate** — strip two frontmatter fields; valid/invalid AC examples ship as-is
- **concise-planning** — strip one boilerplate footer sentence
- **dispatching-parallel-agents** — strip dot block and session war story; decision tree ships verbatim

### Medium — requires one focused editing pass

- **receiving-code-review** — strip one joke phrase and partner references; YAGNI sub-step worth naming explicitly
- **code-review-excellence** — drop companion file pointer; severity tiers ship as-is
- **subagent-driven-development** — strip graphviz blocks and relative template paths; worked example condense
- **planning-with-files** — strip script references and template paths; 2-Action/3-Strike atoms ship as-is
- **on-call-handoff-patterns** — strip org tooling and named engineers; three-template ladder ships verbatim
- **executing-plans** — replace sub-skill handoff with generic instruction; strip self-announcement strings
- **parallel-agents** — strip `superpowers:` integration references
- **writing-plans** — strip ecosystem path examples
- **finishing-a-development-branch** — strip ecosystem command examples
- **memory-systems** — strip attribution and absent sibling links; tables ship as-is
- **audit-skills** — strip platform-specific detection examples
- **agentic-actions-auditor** — strip repo-specific example paths
- **clarity-gate** — strip internal cross-references

### Partial — hold, adapt before promoting

- **differential-review** — companion files (methodology.md, adversarial.md, reporting.md, patterns.md) are absent; Phase 0–6 methodology needs to be inlined or the checklist made self-sufficient before promotion
- **context-compression** — strong structured-summary template; needs absent sibling link removal and scope-narrowing pass
- **context-guardian** — P0/P1/P2 triage and transition briefing are standout contributions; blocked by Windows paths, Portuguese language, and script coupling — requires full rewrite of implementation sections
- **audit-context-building** — Phase 1–3 pipeline and anti-rationalization table are high-signal; blocked by smart-contract vocabulary and absent companion files (OUTPUT_REQUIREMENTS.md, COMPLETENESS_CHECKLIST.md)
- **agent-evaluation** — anti-pattern atoms (single-run, happy-path-only, string matching) are extractable; file is truncated and tables have `// placeholder` — not promotable without authoring a complete workflow

---

## 6. Cross-Cutting Protocol Primitives

Patterns smaller than a full skill that appear across multiple files:

| Primitive | Appears in | Description |
|---|---|---|
| **Rationalizations table** | `differential-review`, `systematic-debugging`, `audit-context-building`, `verification-before-completion` | Anti-pattern → why wrong → required action. Pre-empts common shortcuts. Consistently the highest-signal section in any file that includes it. |
| **Iron Law** | `systematic-debugging`, `verification-before-completion` | Blunt, unconditional rule stated before all procedural steps. "No fixes without root cause." "No completion claim without fresh verification." Makes the SOP resistant to pressure to skip. |
| **DoD-as-checklist output contract** | `closed-loop-delivery`, `verification-before-completion`, `create-issue-gate` | Acceptance criteria defined as pass/fail checks before implementation begins; completion requires verified evidence, not subjective assessment. |
| **Severity tiering (blocking/important/minor)** | `code-review-excellence`, `code-review-checklist`, `differential-review` | Three-tier feedback classification appears independently in multiple review skills. Consistent vocabulary worth standardising across all review SOPs. |
| **Compact multi-choice reply format** | `ask-questions-if-underspecified` | `1a 2b` / `defaults` reply shorthand for structured clarification. Single file, but the pattern is broadly applicable wherever an agent asks multiple clarifying questions. |
| **Batch-with-checkpoint execution loop** | `executing-plans`, `closed-loop-delivery`, `subagent-driven-development` | Execute a fixed batch → verify → report → get feedback → next batch. Appears across three different execution-discipline skills as a common rhythm. |
| **Persistent markdown working files** | `planning-with-files`, `context-compression`, `context-guardian` | External working memory as plain markdown files (task_plan.md, findings.md, progress.md, MEMORY.md). Three skills encode this independently; converge on the same mechanic. |
| **Anti-performative-agreement rule** | `receiving-code-review` | Explicit prohibition of gratitude and sycophantic acknowledgment before evaluation. Stated once but reinforced with paired bad/good examples — a high-signal rule worth extracting as a standalone conduct primitive. |
| **Phase separation between context-building and action** | `audit-context-building`, `differential-review`, `systematic-debugging` | Hard constraint: no vulnerability findings, fix proposals, or code changes during orientation/analysis phase. Repeated across three files covering different domains. |
| **3-Strike escalation heuristic** | `planning-with-files`, `systematic-debugging` | After 3 failed attempts at a diagnosis or approach, stop and question the frame rather than retrying. Appears in two files with consistent semantics. |

---

## 7. Default Recommendation

**Ship these as standalone skills in `.agents/skills/` by default:**

1. `verification-before-completion` — as-is; zero editing required
2. `ask-questions-if-underspecified` — strip nothing; compact reply format preserved verbatim
3. `closed-loop-delivery` — strip create-issue-gate name reference; keep DoD + output contract intact
4. `concise-planning` — strip boilerplate footer; ship plan template verbatim
5. `create-issue-gate` — strip two frontmatter fields; valid/invalid AC examples ship verbatim
6. `agents-md` — strip email domain placeholder; ship <60-line rule with research rationale

**Ship with a single editing pass (sibling links, org names, flavour text):**

7. `receiving-code-review`
8. `systematic-debugging`
9. `postmortem-writing`
10. `dispatching-parallel-agents`
11. `on-call-handoff-patterns`
12. `executing-plans`

**Promote as a named rule block (not a full skill), merged into `rules/` or inlined in AGENTS.md:**

- Iron Law rule (from `verification-before-completion` and `systematic-debugging`)
- Rationalizations table pattern (extractable atom; too small for a skill on its own)
- Anti-performative-agreement rule (from `receiving-code-review`)

**Do not ship by default; make available on request:**

- `subagent-driven-development` (high overhead; only applies when the user is orchestrating a multi-task plan)
- `postmortem-writing` (ops context; only relevant in production-incident workflows)
- `on-call-handoff-patterns` (ops context; only relevant to on-call rotation owners)
- `context-compression` (only relevant for long-running agent sessions approaching context limits)

**Hold for adaptation before shipping:**

- `differential-review` (inline Phase 0–6 from absent companion files first)
- `context-guardian` (rewrite Windows/Portuguese sections; validate P0/P1/P2 triage logic)
- `audit-context-building` (rewrite smart-contract vocabulary; inline companion file requirements)

---

## 8. Structural Patterns

### Frontmatter schema

Files use a consistent YAML header:
```yaml
name: skill-name
description: one-line trigger phrase
type: Behavioral | Workflow | SOP | Reference | Checklist | Gate
portable: yes | no | partial
reason: brief rationale
source: community
risk: unknown | low | medium
```
`source: community` and `risk: unknown` appear as boilerplate and carry no operational signal; strip on promotion. The `portable:` and `reason:` fields are the highest-value fields in the header — they encode the audit judgment directly and should be preserved in any adapted version as `promoted-from:` provenance metadata.

### Packaging conventions

- Each skill is a single directory (`skills/<name>/`) containing `SKILL.md` as the primary file.
- Several skills reference local companion files (`resources/implementation-playbook.md`, `methodology.md`, `adversarial.md`, `FUNCTION_MICRO_ANALYSIS_EXAMPLE.md`) that are not present in the repo as audited. This is a systemic packaging gap: the SKILL.md files assume co-located supporting docs that were either never committed or live in a private fork.
- Graphviz `.dot` blocks appear in `subagent-driven-development` and `dispatching-parallel-agents` as visual decoration. They render as raw text in most contexts and add noise without value; do not carry forward.
- Some files use `superpowers:` namespace prefixes on skill cross-references — this is an ecosystem-specific convention with no portable meaning; strip uniformly.

### Patterns worth adopting

- **Rationalizations table format** — `anti-pattern | why wrong | required action` — is the single most portable structural pattern in the collection. It is concise, adversarial in framing, and directly combats LLM shortcuts. Recommend standardising this table format as a section in every enforcement-style SOP.
- **Output contract section** — `closed-loop-delivery` provides a named output contract block (checklist + commands + runtime evidence + PR status). Naming the output contract explicitly rather than embedding it in a prose description makes the SOP verifiable. Adopt as convention.
- **Three-tier template ladder** — `postmortem-writing` and `on-call-handoff-patterns` both provide graduated templates (full/standard, quick/async, minimal/emergency). This pattern prevents the common failure mode of one-size-fits-all templates being abandoned when they are too heavy for the situation.
- **Explicit non-goals / "When NOT to Use" section** — several files include this; `ask-questions-if-underspecified` uses it correctly (short-circuit for simple questions). Keep this guard in behavioral SOPs to prevent over-triggering, but reframe positively per house style preference.

### Patterns to avoid

- **Missing companion files** — six or more skills reference sibling `.md` documents that are absent. Any SOP promoted from this repo must either inline the referenced content or explicitly remove the pointer; dangling references degrade trust in the SOP's completeness.
- **Incomplete skills promoted anyway** — `agent-evaluation` is visibly truncated and contains `// placeholder` comments; it was included in the skill collection rather than held as a draft. Any promoted SOP should pass a completeness check (no placeholder comments, no mid-sentence truncations, no empty sections) before being merged.
- **Persona / role-playing framing in skill headers** — `agent-evaluation` opens with "You're a quality engineer who has seen…"; `autonomous-agent-patterns` mixes first-person builder voice with instructional content. This framing creates ambiguity about whether the file is addressing an agent or a developer. All promoted SOPs should address the agent in second person with imperative verb constructions.
- **Graphviz blocks as prose substitutes** — two files use `.dot` diagrams where a numbered list or decision table would be more robust. Avoid.

---

## 9. Evidence

The following citations are traceable to specific blocks in `raw-findings.md`:

1. **Compact reply format verbatim** — `ask-questions-if-underspecified` findings: "The compact reply format (`1a 2b` / `defaults`) is a best-practice UX pattern worth preserving verbatim."
2. **DoD-not-diff principle** — `closed-loop-delivery` findings: "The 'DoD not diff' core rule is a clean, quotable principle. The output contract (checklist + evidence + PR status) is the most transferable piece."
3. **YAGNI check as named sub-step** — `receiving-code-review` findings: "The YAGNI check pattern (grep before implementing reviewer-suggested features) is an underrated addition worth preserving as a named sub-step."
4. **Iron Law blunt tone is load-bearing** — `verification-before-completion` findings: "Worth preserving as a standalone skill rather than folding into a broader checklist — the blunt, imperative tone is load-bearing."
5. **Rationalizations table pre-empts shortcuts** — `differential-review` findings: "The rationalizations table is the most distinctive element — it pre-empts common shortcuts ('small PR', 'just a refactor') with explicit rebuttals and mandated actions."
6. **3+ fixes = architecture problem** — `systematic-debugging` findings: "The '3+ fixes = architecture problem' heuristic and the rationalizations table are especially portable and reusable."
7. **No-parallel-implementers rule** — `subagent-driven-development` findings: "The two-stage review ordering constraint (spec compliance before code quality) and the 'no parallel implementers' rule are the sharpest, most non-obvious invariants — worth preserving verbatim."
8. **Context Window = RAM / Filesystem = Disk** — `planning-with-files` findings: "The 'Context Window = RAM / Filesystem = Disk' framing is memorable and worth keeping verbatim."
9. **<60-line target with research rationale** — `agents-md` findings: "The <60-line target with a research-based rationale (instruction-following degrades with length) is a strong, citable constraint worth preserving verbatim."
10. **Three-tier postmortem template as differentiator** — `postmortem-writing` findings: "The three-tier template approach (Standard / Quick / 5-Whys standalone) is the strongest differentiator — most postmortem guides provide only one template."
11. **Companion files absent — systemic gap** — `differential-review` findings: "References to sibling skill files (methodology.md, adversarial.md, reporting.md, patterns.md) — these are local supporting docs not present in a portable install."
12. **agent-evaluation truncated mid-sentence** — `agent-evaluation` findings: "The file is severely incomplete — the overview sentence is cut mid-thought ('the goal isn't 100% test pass rate—it'), and the sharp-edges table contains `// placeholder` comments instead of actual solutions."
13. **context-guardian Windows path coupling** — `context-guardian` findings: "All `C:\Users\renat\` hardcoded Windows paths and the 'Localizacao' file-tree section."
14. **autonomous-agent-patterns is builder-facing, not agent-facing** — `autonomous-agent-patterns` findings: "There is no trigger condition that an agent could satisfy at runtime, no procedural checklist an agent would follow, and no deliverable format."
15. **Three-template ladder in on-call-handoff** — `on-call-handoff-patterns` findings: "The three-template ladder (full → quick → mid-incident) is particularly valuable and rarely captured this clearly."
