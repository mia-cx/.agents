
## skills/ask-questions-if-underspecified/SKILL.md
**Type:** Interaction protocol / clarification gate
**Portable:** Yes
**Reason:** Repo-agnostic decision logic for when and how to pause before acting on underspecified requests. Contains no repo-specific paths, tools, or domain knowledge.
**Trigger:** Request has multiple plausible interpretations, or key details (objective, scope, constraints, environment, safety/reversibility) are unclear after a quick discovery read.
**Steps/contract:**
1. Decide if underspecified — evaluate objective, done-definition, scope, constraints, environment, safety/reversibility; if ambiguous treat as underspecified.
2. Ask 1–5 must-have questions first; prefer questions that eliminate whole branches; offer multiple-choice options, defaults, fast-path (`defaults` reply), and compact decision format (`1a 2b`).
3. Pause — no commands, edits, or direction-committing plans until answers arrive; low-risk discovery (read configs/repo structure) is permitted with clear label.
4. If user says proceed anyway: state numbered assumptions, get confirmation, then act.
5. Restate requirements in 1–3 sentences once answers are in, then start work.
**Strip:** Nothing — no repo-specific content present.
**Structure/format:** Clear workflow phases; question templates with a literal code-block reply-format example; anti-patterns list; explicit "When NOT to Use" guard.
**Notes:** Strong complement to `cot-gate` / `self-validation`. Could be promoted as a standalone pre-implementation gate skill. The compact reply format (`1a 2b` / `defaults`) is a best-practice UX pattern worth preserving verbatim.

## skills/closed-loop-delivery/SKILL.md
**Type:** Workflow / execution discipline
**Portable:** Yes — fully portable; no org-specific tooling, env vars, or infra dependencies
**Reason:** Encodes a universal "DoD-not-diff" delivery discipline: define acceptance criteria upfront, implement minimally, verify locally, loop on PR feedback, deploy to dev, confirm runtime evidence before declaring done. Applicable to any coding agent across any stack.
**Trigger:** Coding/fix task expected to be completed end-to-end with minimal re-prompting; task spans impl + tests + PR + deploy + runtime verification
**Steps/contract:**
1. Define DoD — convert request to testable criteria
2. Implement minimal change scoped to task goal
3. Verify locally (focused tests → broader checks)
4. Review loop — fetch PR comments, classify valid vs noise, fix valid, re-verify
5. Dev deploy + runtime verification against DoD evidence
6. Completion decision — report done only when all DoD checks pass; otherwise loop until pass or stop condition
Output contract: acceptance criteria checklist (pass/fail) + commands run + runtime evidence + PR status
**Strip:** `create-issue-gate` reference (org-specific gate); "dev environment" default name (keep the concept, strip the literal name); PR comment polling timing constants (3m/6m/10m) are opinionated but can be kept as defaults
**Structure/format:** Well-structured — overview, when to use, required inputs, default workflow (numbered), PR polling policy, human gate rules, stop conditions, output contract. Minimal fluff. Output contract section is strong and portable.
**Notes:** One of the stronger candidates in this repo. The "DoD not diff" core rule is a clean, quotable principle. The output contract (checklist + evidence + PR status) is the most transferable piece. The `create-issue-gate` dependency is the only org-coupling and should be stripped or made optional in a portable version.

## skills/receiving-code-review/SKILL.md
**Type:** Behavioural SOP (agent conduct)
**Portable:** Yes — with minor sanitisation
**Reason:** Codifies a concrete, step-by-step protocol for evaluating and responding to code-review feedback without performative agreement or blind implementation. The logic (read → understand → verify → evaluate → respond → implement) is universally applicable across any agentic coding context. Only cosmetic coupling to a specific human partner and an in-joke code-phrase ("Strange things are afoot at the Circle K") need stripping.
**Trigger:** Agent receives code-review feedback (inline PR comments, review threads, or verbal "fix items N–M" instructions).
**Steps/contract:**
1. Read all feedback before reacting.
2. Restate/clarify anything unclear — stop and ask before implementing any item.
3. Verify each suggestion against codebase reality (correctness, platform compat, YAGNI, prior architectural decisions).
4. Respond with technical acknowledgment or reasoned pushback; no performative agreement ("great point!", "you're absolutely right!").
5. Implement one item at a time, test each, verify no regressions.
6. Prioritise: blocking issues → simple fixes → complex refactors.
7. If pushed back incorrectly, correct factually and move on without extended apology.
8. Reply to GitHub inline comments in-thread, not as top-level PR comments.
**Strip:** "your human partner" references (replace with "the user" or "project owner"); "Strange things are afoot at the Circle K" signal phrase; `source: community` / `risk: unknown` frontmatter noise.
**Structure/format:** Well-structured — overview → numbered response pattern → forbidden/correct response tables → source-specific branches → YAGNI check → implementation order → pushback guidance → real examples → GitHub API note. Examples are concrete and paired (bad vs. good). Lookup table for common mistakes is useful.
**Notes:** High-value candidate. The no-gratitude / actions-over-words rule and the "clarify all unclear items before implementing any" rule are the strongest portable insights. The YAGNI check pattern (grep before implementing reviewer-suggested features) is an underrated addition worth preserving as a named sub-step.
## skills/verification-before-completion/SKILL.md

**Type:** Behavioral enforcement / epistemic honesty gate
**Portable:** Yes — fully portable; zero repo-specific references
**Reason:** Enforces a universal principle: no completion claim without fresh, in-message verification evidence. Applies to any agent or developer role regardless of stack, language, or domain.
**Trigger:** Before ANY completion claim, success statement, expression of satisfaction, commit/push/PR action, task sign-off, or agent delegation handoff.
**Steps/contract:**
1. IDENTIFY the command that proves the claim
2. RUN it fresh and in full (no cached results)
3. READ the full output and check exit code / failure count
4. VERIFY output matches the claim
5. If YES → state claim WITH evidence; If NO → state actual status with evidence
**Strip:** Nothing — no org-specific content present. The "24 failure memories" narrative is internal flavour but reinforces the rule rather than encoding org specifics; keep or trim to taste.
**Structure/format:** Well-structured with Iron Law, Gate Function table, Common Failures table, Rationalization Prevention table, and Key Patterns with pass/fail examples. Highly readable.
**Notes:** Strong candidate for a `self-validation`-style cross-cutting SOP. Complements any close-out or task-completion skill. The "Red Flags — STOP" and "Rationalization Prevention" sections are particularly high-signal: they anticipate and short-circuit the exact cognitive shortcuts that cause silent failures. Worth preserving as a standalone skill rather than folding into a broader checklist — the blunt, imperative tone is load-bearing.

## skills/code-review-excellence/SKILL.md
**Type:** Domain skill — code review workflow
**Portable:** Yes
**Reason:** Review principles (correctness, security, performance, maintainability), severity-tiered feedback, and constructive framing are repo-agnostic. No org-specific tooling or custom runner referenced in the core instructions.
**Trigger:** Reviewing PRs/code changes, establishing review standards, mentoring via review feedback, auditing for correctness/security/performance.
**Steps/contract:** (1) Read context, requirements, and test signals. (2) Review across correctness/security/performance/maintainability axes. (3) Deliver actionable feedback with severity + rationale. (4) Ask clarifying questions when intent is unclear. (5) Optionally load `resources/implementation-playbook.md` for detailed checklists.
**Strip:** Reference to `resources/implementation-playbook.md` — companion file not included in source; must either bundle or drop the pointer. "Do not use" negative-framing section can be folded into trigger description positively.
**Structure/format:** Output: high-level summary → issues grouped by severity (blocking / important / minor) → suggestions & questions → test/coverage notes. Clean, actionable shape.
**Notes:** Strong portable SOP candidate. The severity tiers (blocking / important / minor) are the key portable artefact. The constructive framing ("knowledge sharing, not gatekeeping") is a concise principle worth carrying forward. Companion playbook (`implementation-playbook.md`) would need to be audited separately if present in the repo.

## skills/differential-review/SKILL.md
**Type:** Methodology / workflow orchestrator (with supporting docs)
**Portable:** Yes — strong candidate
**Reason:** Defines a rigorous, evidence-based security-focused code review protocol for PRs/diffs. Fully domain-agnostic (no references to any specific org, stack, or language). The risk-first framing, rationalizations table, blast-radius quantification, and mandatory file output are unusually strong and directly transferable.
**Trigger:** User asks to review a PR, commit, or diff for security; mentions "security review", "differential review", "audit a PR", or wants to assess blast radius of a change.
**Steps/contract:** Pre-Analysis → Triage (Phase 0) → Code Analysis (Phase 1) → Test Coverage (Phase 2) → Blast Radius (Phase 3) → Deep Context (Phase 4) → Adversarial Modeling (Phase 5) → Report (Phase 6). Scales strategy by codebase size (SMALL/MEDIUM/LARGE). Mandatory output: markdown report file (never chat-only). Quality checklist before delivery.
**Strip:** References to sibling skill files (`methodology.md`, `adversarial.md`, `reporting.md`, `patterns.md`) — these are local supporting docs not present in a portable install. Integration block mentioning `audit-context-building` and `issue-writer` skills by name (repo-local coupling). "When NOT to Use" framing can be rephrased positively.
**Structure/format:** Excellent. Rationalizations table (anti-pattern → why wrong → required action) is a standout pattern worth preserving. Risk-level trigger table and codebase-size strategy table are concise and actionable. Decision tree for navigating to sub-docs is useful but assumes sub-docs exist — needs inlining or graceful degradation in a standalone SOP. Quality checklist is strong.
**Notes:** The rationalizations table is the most distinctive element — it pre-empts common shortcuts ("small PR", "just a refactor") with explicit rebuttals and mandated actions. This is a high-signal portable pattern. The skill delegates heavily to companion files; a promoted SOP should either inline the Phase 0–6 methodology or note that the checklist is a summary and link phases explicitly. Overlap candidate: `pr-review` skill in the home repo covers PR review but without the security depth or mandatory-artifact requirement — `differential-review` is a strict superset for security contexts.

## skills/systematic-debugging/SKILL.md
**Type:** Procedural SOP (four-phase debugging protocol)
**Portable:** Yes — fully portable; no repo-specific tooling, CI environment, or language dependencies
**Reason:** The four-phase loop (Root Cause → Pattern Analysis → Hypothesis & Testing → Implementation), the Iron Law ("no fixes without root cause"), the 3-strikes architecture-question rule, and the rationalizations table are all language- and project-agnostic reasoning protocols.
**Trigger:** Any bug, test failure, unexpected behaviour, or performance problem — explicitly including "obvious" and time-pressured cases; also red-flags like "just try X" or 3+ failed fixes
**Steps/contract:** Phase 1: read errors, reproduce, check recent changes, instrument multi-component boundaries, trace data flow. Phase 2: find working examples, compare differences. Phase 3: form single hypothesis, minimal test, verify or re-hypothesise. Phase 4: write failing test, one fix, verify; if ≥3 fixes failed stop and question architecture.
**Strip:** All bash CI/signing/codesign examples (illustrative only); references to `superpowers:` skill namespace; "your human partner's Signals" section title phrasing (minor wording fix needed); cross-references to sibling `.md` files (`root-cause-tracing.md`, `defense-in-depth.md`, `condition-based-waiting.md`) — those files are not present in the repo and the references should be removed or inlined
**Structure/format:** Well-structured: overview → Iron Law → when-to-use → four clearly numbered phases → red-flags callout → rationalizations table → quick-reference summary table. Slight verbosity in phase bodies but the tables and callouts are high signal-to-noise.
**Notes:** One of the strongest debugging-methodology SOPs in the reference set. The "3+ fixes = architecture problem" heuristic and the rationalizations table are especially portable and reusable. The `root-cause-tracing.md` cross-reference covers backward stack tracing — worth inlining the quick version into the main skill if those sibling files are not promoted. Minor: section heading "your human partner's Signals" should be normalised to neutral language ("Signals the process is off-track").

## skills/subagent-driven-development/SKILL.md
**Type:** Orchestration workflow / multi-agent execution loop
**Portable:** Yes — with adaptation (prompt template file references are relative; the dot-graph diagrams are decorative and can be stripped)
**Reason:** Encodes a reusable, tool-agnostic pattern: read plan → extract tasks → for each task dispatch implementer subagent → two-stage review (spec compliance first, then code quality) → fix loops → final holistic review. The core loop and its invariants (fresh context per subagent, no parallel implementers, strict review ordering) are independently valuable and not tied to any specific framework or toolchain.
**Trigger:** User has an implementation plan with mostly-independent tasks and wants to execute it in the current session using subagents for isolation and quality gating.
**Steps/contract:**
1. Read plan once; extract all task texts and context upfront into TodoWrite.
2. Per task: dispatch implementer subagent (full task text + scene-setting context); answer any pre-work questions before implementation proceeds.
3. After implementation + self-review + commit: dispatch spec-compliance reviewer; fix any gaps; re-review until ✅.
4. Then dispatch code-quality reviewer; fix issues; re-review until ✅.
5. Mark task complete; move to next.
6. After all tasks: dispatch final holistic code reviewer; then run branch-finishing workflow.
**Strip:** dot/graphviz diagrams (visual noise, not executable); references to `./implementer-prompt.md` etc. (relative template files that won't exist in a generic install); `superpowers:` namespace prefixes on integration links (repo-specific).
**Structure/format:** Single SKILL.md with embedded Graphviz dot blocks, a worked example, advantages/cost section, and a "Red Flags" never-do list. Well-structured; the Red Flags section is especially high-signal and portable as-is.
**Notes:** The two-stage review ordering constraint (spec compliance before code quality) and the "no parallel implementers" rule are the sharpest, most non-obvious invariants — worth preserving verbatim. The worked example is unusually concrete and pedagogically strong; keep a condensed version. Cost section is honest about overhead vs. quality trade-off. Integration section references sibling skills that don't exist in this repo, but the dependency graph (plan-writing → this → branch-finishing) is worth noting as a composable chain.

## skills/planning-with-files/SKILL.md
**Type:** Behavioural / working-memory protocol
**Portable:** Yes — pure process, no tool/env dependencies
**Reason:** Defines a universal pattern (persistent markdown files as external working memory) applicable to any multi-step agent task regardless of stack or repo.
**Trigger:** Any complex multi-step task (3+ steps), research, build/create projects, or tasks spanning many tool calls. Explicitly skip for simple questions, single-file edits, or quick lookups.
**Steps/contract:**
1. Create `task_plan.md`, `findings.md`, `progress.md` in project root before starting.
2. After every 2 view/browser/search operations, write key findings to file (2-Action Rule).
3. Re-read plan file before every major decision to keep goals in attention window.
4. After each phase, mark status complete and log errors.
5. Apply 3-Strike Error Protocol (diagnose → alternative → rethink → escalate) and never repeat an identical failing action.
6. Pass the 5-Question Reboot Test (where am I / going / goal / learned / done) to validate context management.
**Strip:** Template file references (`${CLAUDE_PLUGIN_ROOT}/templates/`), script references (`init-session.sh`, `check-complete.sh`), external doc links (`reference.md`, `examples.md`), and the file-location table — all are install-specific artefacts.
**Structure/format:** Numbered rules + decision matrices + error-protocol code block + anti-pattern table. Clean modular sections; easily condensed to a checklist or inline rule block.
**Notes:** Strong candidate for a foundational cross-cutting SOP. The 2-Action Rule and 3-Strike Protocol are the highest-signal distillables. The "Context Window = RAM / Filesystem = Disk" framing is memorable and worth keeping verbatim. Overlaps with any existing progress-tracking convention; supersedes TodoWrite-only approaches. Low strip burden.

## skills/context-compression/SKILL.md
**Type:** Reference knowledge + procedural SOP
**Portable:** Yes — with minor scope-narrowing
**Reason:** Addresses a universal agent-lifecycle problem (context window exhaustion) with concrete, evidence-backed strategies. The three compression approaches (anchored iterative, opaque, regenerative), trigger heuristics, probe-based evaluation, and the tokens-per-task framing are all general-purpose and apply to any long-running agent session, regardless of codebase.
**Trigger:** Agent sessions approaching context window limits; codebases >5 M tokens; agent "forgetting" prior file edits; designing summarisation or compression subsystems.
**Steps/contract:**
1. Select compression method based on session length and re-fetch cost tolerance (anchored iterative preferred for coding agents).
2. Define explicit structured summary sections (Session Intent, Files Modified, Decisions Made, Current State, Next Steps).
3. Trigger at 70–80 % context utilisation.
4. On each trigger: summarise only the newly-truncated span and merge into existing sections (do not full-regenerate).
5. Validate quality with probe-based evaluation (recall, artifact, continuation, decision probes).
6. Monitor re-fetching frequency as a live quality signal.
**Strip:** Author attribution block, "Integration" cross-links to sibling antigravity skills (context-degradation, context-optimization, evaluation, memory-systems — not present in this repo), external Netflix/Factory Research references. Retain all tables, the example structured summary, and the compression-ratio comparison table.
**Structure/format:** Well-structured: named sections, decision tables, worked examples with good/poor response contrast, evaluation rubric. Ready to excerpt directly into a SKILL.md. The structured-summary template (markdown block) is the single most reusable artefact.
**Notes:** The "tokens-per-task vs tokens-per-request" framing is a strong conceptual anchor worth foregrounding in any adapted SOP. Artifact trail weakness (2.2–2.5/5) is an honest, quantified limitation worth preserving as a caveat. The three-phase workflow (Research → Planning → Implementation) for large-codebase compression is independently useful and could be extracted as a separate checklist.

## skills/postmortem-writing/SKILL.md
**Type:** Reference / Template library
**Portable:** Yes — with minor strip
**Reason:** Blameless postmortem culture, trigger criteria, document structure, 5-Whys method, facilitation guide, and anti-patterns are all universal SRE/eng-ops practices with no org-specific lock-in. Three concrete fill-in-the-blank templates give adopters an immediate starting point.
**Trigger:** Conducting a post-incident review; writing a postmortem document; facilitating a blameless postmortem meeting; SEV1/SEV2 incident or any customer-facing outage > 15 min; data-loss or security incident; novel failure mode.
**Steps/contract:**
1. Establish blameless framing (systems > individuals) before writing begins.
2. Choose template tier: Standard (SEV1/2), Quick (SEV3), or standalone 5-Whys.
3. Fill timeline table with UTC-stamped events.
4. Run 5-Whys root-cause analysis; surface proximate + contributing factors.
5. Document detection/response gaps alongside what worked.
6. Quantify customer, business, and technical impact.
7. Create action items with priority, owner, due-date, and ticket.
8. Hold facilitated 60-min meeting within 3–5 days; follow structured agenda.
9. Finalize doc and share broadly; track action items in ticketing system.
10. Quarterly: review patterns across postmortems.
**Strip:** Placeholder Grafana/metric links in templates (example URLs); references to internal ticket prefixes (ENG-*, OPS-*, DOC-*, QA-*); example author handles (@alice, @bob); "Do not use this skill when" boilerplate; vague generic bullets ("Clarify goals, constraints, and required inputs" etc.) that add no substance.
**Structure/format:** Well-structured. Core concepts → Quick-start timeline → three tiered templates (Standard full, 5-Whys, Quick/minor) → facilitation agenda → anti-patterns table → best-practices do/don't list → external references. Markdown tables and fenced code blocks throughout. Highly scannable.
**Notes:** The three-tier template approach (Standard / Quick / 5-Whys standalone) is the strongest differentiator — most postmortem guides provide only one template. The SEV-level trigger criteria and the "where we got lucky" section are worth preserving verbatim as they are often omitted elsewhere. Action-item table schema (Priority / Action / Owner / Due Date / Ticket) is production-ready. External references (Google SRE book, Etsy, PagerDuty) add credibility and can be kept.

## skills/context-guardian/SKILL.md
**Type**: Context management / session preservation protocol — pre-compaction snapshot with priority triage, integrity verification, redundant persistence, and transition briefing generation.
**Portable**: Partially — the conceptual framework (P0/P1/P2 extraction triage, 4-phase protocol, transition briefing template) is highly portable and fills a genuine gap. The implementation is not portable as-is due to hardcoded Windows paths, user-specific Python scripts, and Portuguese trigger language.
**Reason**: Core protocol (extract → verify → persist → brief) is tool-agnostic and applicable to any long-running Claude session. The priority triage table and transition briefing format are strong reusable artifacts. The script/path coupling and language are surface-level and strippable.
**Trigger**: Auto: ~60–70% context window consumed, many files edited, or before a long task. Manual: "checkpoint", "snapshot context", "don't lose this session", "prepare for compaction".
**Steps/contract**:
  1. Phase 1 — Structured extraction: triage all session artifacts into P0 (fatal loss: decisions, task state, bug fixes, modified code, errors, working commands), P1 (grave loss: patterns, component dependencies, user preferences, open questions), P2 (tolerable: attempt history, metrics, exploratory discussion).
  2. Phase 2 — Integrity verification: run checklist confirming every modified file, corrected bug, decision, pending task, and pattern is captured with complete paths and cross-consistent references.
  3. Phase 3 — Triple-redundant persistence: (a) structured .md snapshot file, (b) update MEMORY.md with P0 items in ultra-compact form, (c) trigger session save via context-agent.
  4. Phase 4 — Transition briefing: write a structured markdown block (current state, done this session, pending, critical decisions, applied fixes, important paths, alerts, recovery pointers) as the last output before compaction so it appears at the top of the compacted context.
  Quick protocol fallback: if compaction is imminent — 30s mini-briefing → 1min MEMORY.md update → 2min session save.
**Strip**:
  - All `C:\Users\renat\` hardcoded Windows paths and the "Localizacao" file-tree section.
  - `context_snapshot.py` and `context_manager.py` script references (replace with "write snapshot file manually" or make script optional).
  - Portuguese trigger language and body text (translate to English and generalize triggers).
  - MEMORY.md references to user-specific project paths.
  - Hard coupling to `context-agent` skill (make Phase 3 layer 3 optional/additive).
  - Boilerplate "Best Practices / Common Pitfalls" footer (generic filler).
**Structure/format**: Four clearly named phases with priority tables, a verification checklist, a concrete Markdown briefing template, and a quick-protocol fallback. Well-organized; the briefing template is immediately reusable verbatim after path/language stripping.
**Notes**: The P0/P1/P2 triage framework is the standout contribution — no existing skill in this repo addresses pre-compaction preservation with explicit loss-severity classification. The transition briefing format is the highest-value portable artifact. Post-compaction completeness check (compare briefing vs MEMORY.md, search for gaps) is a useful addition not found elsewhere. After stripping, this would be a concise, high-value SOP for long-session context hygiene.

## skills/on-call-handoff-patterns/SKILL.md
**Type**: SOP (operational process)
**Portable**: Yes
**Reason**: Covers universal on-call shift transition mechanics — handoff doc structure, sync meeting agenda, pre/during/post-shift checklists, escalation triggers, and mid-incident handoff — with no repo-specific tooling assumptions. Templates use placeholder names and generic stack references easily stripped to org-neutral form.
**Trigger**: Transitioning on-call responsibilities, writing shift handoff summaries, documenting ongoing investigations, establishing on-call rotation procedures, improving handoff quality, onboarding new on-call engineers.
**Steps/contract**: (1) 30-min overlap window: outgoing writes handoff doc (15 min), sync call with incoming (15 min). (2) Handoff doc covers Active Incidents → Ongoing Investigations → Resolved This Shift → Recent Changes → Known Issues → Upcoming Events → Escalation reminders → Quick Reference. (3) Incoming engineer verifies PagerDuty routing, Slack notifications, VPN/access, and critical dashboards. (4) Mid-incident handoff uses abridged template with current state, what's been done, what needs to happen, key people, and comms status. (5) Escalation triggers: SEV1, data breach, 30-min diagnosis stall, cross-team scope, or business-impact threshold.
**Strip**: Grafana/PagerDuty/kubectl/Redis/psql command examples; specific service names (api-gateway, auth-service); concrete ticket IDs and URLs; named engineers (@alice, @bob); the `resources/implementation-playbook.md` reference; `Do not use this skill when` boilerplate.
**Structure/format**: Very strong. Provides three graduated templates (full shift handoff, quick async, mid-incident), a sync meeting agenda, three phase-based checklists (pre/during/post shift), and an escalation decision tree. All sections are well-labelled markdown with tables and checklists.
**Notes**: One of the most complete operational SOPs in the set. The three-template ladder (full → quick → mid-incident) is particularly valuable and rarely captured this clearly. Worth promoting with minimal editing; strip org-specific tooling and keep the template structure verbatim.

## skills/multi-agent-patterns/SKILL.md

**Type:** Reference / educational deep-dive (multi-agent architecture patterns)
**Portable:** Partial — core principles yes, framework code snippets no
**Reason:** Covers universal multi-agent concerns (context isolation, supervisor vs. swarm vs. hierarchical, failure modes, consensus) with framework-agnostic reasoning. Python examples and named framework comparisons (LangGraph, AutoGen, CrewAI) are implementation-specific and should be stripped. The conceptual content (token economics table, telephone-game problem, isolation mechanisms, failure modes + mitigations) is strong and widely applicable.
**Trigger:** User asks to design a multi-agent system, implement supervisor/swarm/hierarchical pattern, coordinate sub-agents, handle agent handoffs, or scale beyond single-context limits.
**Steps/contract:**
1. Classify task: does it warrant multi-agent? (context bottleneck, parallelisable subtasks, domain specialisation)
2. Choose pattern: supervisor (centralised control), peer-to-peer/swarm (flexible handoffs), or hierarchical (layered abstraction)
3. Design context isolation strategy: full delegation vs. instruction passing vs. file-system memory
4. Add consensus/coordination mechanism: weighted voting, debate protocol, or trigger-based intervention
5. Plan failure mitigations: bottleneck checkpointing, output validation, divergence TTL, circuit breakers
6. Implement direct pass-through for sub-agent responses where synthesis would lose fidelity
**Strip:** Python code blocks (`transfer_to_agent_b`, `forward_message`, `handle_customer_request`), framework-specific implementation notes (LangGraph graph nodes, AutoGen GroupChat, CrewAI crew structures), external reference URLs, version/author metadata block, "Integration" cross-links to other skills in the collection.
**Structure/format:** Concept-heavy with one token-economics table, ASCII architecture diagrams, and pattern comparison blocks. Promote the table and failure-mode matrix to the portable SOP; drop inline code.
**Notes:** Token economics table (1×/4×/15× multiplier) and the "telephone game" bottleneck insight are high-value, rarely documented details worth preserving verbatim. Consensus section (weighted voting vs. debate vs. trigger intervention) is a strong differentiator absent from most multi-agent skills in this audit set.

## skills/autonomous-agent-patterns/SKILL.md

**Type:** Reference / pattern library (agent architecture)
**Portable:** No — not a skill SOP; it is a developer tutorial and code-reference document aimed at *builders* of agent tools, not agents executing a task.
**Reason:** The file is a collection of Python implementation templates (AgentLoop class, PermissionLevel enum, BrowserTool, CheckpointManager, etc.) and ASCII architecture diagrams. It describes *how to build* an autonomous coding agent from scratch. There is no trigger condition that an agent could satisfy at runtime, no procedural checklist an agent would follow, and no deliverable format. It is conceptual documentation for a Python developer writing agent infrastructure.
**Trigger:** When building autonomous AI agents / designing tool/function calling APIs / implementing permission systems — these are construction-time decisions, not runtime agent tasks. No extractable trigger phrase suitable for a skills-based SOP.
**Steps/contract:** No steps. Contains illustrative code patterns (Think→Decide→Act→Observe loop, permission level config, sandboxed execution, checkpoint/resume) but they are implementation examples in Python, not a portable workflow a non-Python agent would follow.
**Strip:** Everything — Python class definitions, ASCII diagrams, browser automation code, MCP server generation snippet, and best-practices checklists are all builder-facing. No extractable prose procedure.
**Structure/format:** Unstructured tutorial with code blocks. Six numbered sections, each containing multiple code samples. No front-matter trigger or deliverable spec beyond the YAML header.
**Notes:** The permission-level taxonomy (AUTO / ASK_ONCE / ASK_EACH / NEVER) and the sandboxing heuristics (block sudo/rm -rf, validate paths to workspace) contain useful conceptual framing, but they would need to be rewritten as prose policy to be portable. The Think→Decide→Act→Observe loop is already implicit in how most coding agents operate. Skip for SOP promotion; could inform a future `agent-safety-policy` or `tool-permission-policy` rule if the team ever wants to codify tool-approval defaults.

## skills/audit-context-building/SKILL.md
**Type:** Pre-audit phase protocol (context-building gate)
**Portable:** Yes — with scope narrowing
**Reason:** Defines a disciplined, bottom-up analysis discipline (line-by-line, First Principles, 5 Whys/5 Hows, anti-hallucination anchoring) that applies to any deep code review or architecture audit, not just smart-contract security. The phase separation (orient → micro-analyse → global synthesis) and the anti-rationalization table are both high-signal and reusable. The smart-contract vocabulary (reentrancy, DEX swap example, TON/cells) is incidental and strippable.
**Trigger:** "deep code review", "architecture audit", "pre-audit context", "bottom-up analysis", "build context before finding bugs", "security audit prep"
**Steps/contract:**
1. **Phase 1 — Orientation:** map modules/files, public entrypoints, actors, and key state — no behaviour assumed yet.
2. **Phase 2 — Per-function micro-analysis:** for every non-trivial function document Purpose, Inputs & Assumptions, Outputs & Effects, then block-by-block analysis applying First Principles + 5 Whys + 5 Hows; propagate invariants across internal and external call boundaries.
3. **Phase 3 — Global synthesis:** reconstruct state invariants, end-to-end workflows, trust boundaries, and complexity/fragility clusters.
4. **Stability rules throughout:** update model explicitly when contradicted; anchor summaries periodically; cite line numbers; use "Unclear; need to inspect X" rather than speculation.
5. **Quality thresholds per function:** ≥3 invariants, ≥5 assumptions, ≥3 risk considerations for external calls, ≥1 First Principles application, ≥3 combined 5 Whys/5 Hows.
6. Hard constraint: no vulnerability findings, fix proposals, exploit reasoning, or severity ratings during this phase.
**Strip:** Smart-contract-specific examples (DEX swap walkthrough, reentrancy framing, "cells/dicts/storage structs" language), references to `FUNCTION_MICRO_ANALYSIS_EXAMPLE.md`, `OUTPUT_REQUIREMENTS.md`, `COMPLETENESS_CHECKLIST.md` (companion files not included in this repo), and the `function-analyzer` subagent name.
**Structure/format:** Well-structured — numbered phases with sub-sections, rationalization table, per-block checklist, quality thresholds, explicit non-goals section. Output format is prescriptive but the companion format files are missing, which limits direct reuse.
**Notes:** The anti-rationalization table (§ "Rationalizations") is a standout portable element — concise, persuasive, directly combats LLM shortcuts. The Phase 1–2–3 pipeline and the hard separation between "context building" and "vulnerability hunting" are strong structural patterns worth carrying forward. Companion files (OUTPUT_REQUIREMENTS.md, COMPLETENESS_CHECKLIST.md) are referenced but absent; a portable version should inline the essential requirements rather than deferring to missing files.

## skills/executing-plans/SKILL.md
**Type:** Workflow / process skeleton
**Portable:** Yes
**Reason:** Generic plan-execution loop with human-in-the-loop checkpoints; no repo-specific tooling, paths, or domain assumptions.
**Trigger:** "Use when you have a written implementation plan to execute in a separate session with review checkpoints"
**Steps/contract:** 5-step loop — (1) load & critically review plan, raise concerns; (2) execute first 3 tasks as a batch, marking in_progress → completed; (3) report batch output + verification, say "Ready for feedback"; (4) apply feedback, execute next batch, repeat; (5) after all tasks, hand off to finishing-a-development-branch sub-skill.
**Strip:** Hard dependency on `superpowers:finishing-a-development-branch` sub-skill (Step 5) — either drop that handoff or replace with a generic "run tests, file PR" instruction. Mandatory self-announcement strings ("I'm using the executing-plans skill…") are flavour noise.
**Structure/format:** Markdown with H2 sections; concise bullets; stop-and-ask guard-rails called out explicitly — clean and skimmable.
**Notes:** Solid checkpoint discipline. Batch size (3 tasks) is a sensible default but could be parameterised. Stop-and-ask rules are explicit and useful. Overall a high-quality portable SOP candidate pending removal of the sub-skill coupling.

## skills/concise-planning/SKILL.md
**Type:** Workflow / output-format template
**Portable:** Yes
**Reason:** Entirely generic planning discipline — no repo-specific tooling, paths, or domain assumptions. Applies to any coding task across any stack.
**Trigger:** User asks for a plan for a coding task (explicit planning request).
**Steps/contract:** (1) Scan context (README, docs, relevant code); (2) Minimal interaction — max 1–2 blocking questions; (3) Generate plan using fixed template: Approach (1–3 sentences) + Scope (In/Out bullets) + Action Items (6–10 atomic verb-first tasks) + Validation item + Open Questions (max 3).
**Strip:** "When to Use" boilerplate ("This skill is applicable to execute the workflow…") — adds no information.
**Structure/format:** Provides a concrete Markdown plan template with checkboxes; checklist guidelines (atomic, verb-first, concrete) are clear and enforceable.
**Notes:** Lightweight and high-signal. Pairs naturally with `cot-gate` (reasoning before writing) and `self-validation` (close-out audit). The "max 6–10 action items" constraint is opinionated but useful — prevents sprawling plans. Promotion-ready with minimal editing; only the boilerplate footer needs trimming.

## skills/create-issue-gate/SKILL.md
**Type:** Gate / workflow enforcer
**Portable:** Yes
**Reason:** Pure protocol — defines a "no valid AC = no execution" gate with a concrete issue body template; zero repo-specific coupling.
**Trigger:** Starting a new implementation task that requires a GitHub issue with acceptance-criteria gating before execution begins.
**Steps/contract:** (1) Collect Problem / Goal / Scope / Non-Goals / AC / Dependencies from user. (2) Validate AC are testable (pass/fail checkable). (3) If AC missing or vague → create issue with `Status: draft` + `Execution Gate: blocked`. (4) If AC valid → create issue with `Status: ready` + `Execution Gate: allowed`. (5) Downstream execution workflows may not start until gate is `allowed`.
**Strip:** `source: community`, `date_added` frontmatter fields; example reference to `closed-loop-delivery` (internal workflow name — keep concept, strip name).
**Structure/format:** Well-structured. Required-fields list, gate logic, body template with fenced markdown, status enum definitions, and handoff rule are all clear and self-contained.
**Notes:** Strong complement to `issue-triage` (which finds root cause) — this skill gates *execution* rather than *investigation*. The concrete valid/invalid AC examples are high-value portable content. Recommend promoting as-is with only the minor strips above.

## skills/code-review-checklist/SKILL.md

**Type:** Checklist / reference document
**Portable:** Partial — checklist items and review-comment templates are portable; examples are JS/Node-specific
**Reason:** Covers a universal workflow (PR code review) with well-structured multi-domain checklists (functionality, security, performance, quality, tests, docs, git). The good/bad code examples use JavaScript, which limits literal reuse but the patterns they illustrate are language-agnostic. The comment templates (request changes / ask questions / praise) are immediately portable as-is.
**Trigger:** Reviewing a pull request; conducting a code audit; establishing team review standards; training new reviewers
**Steps/contract:** 8-phase sequential flow — (1) understand context, (2) functionality, (3) code quality, (4) security, (5) performance, (6) tests; plus a consolidated master checklist covering pre-review → functionality → security → performance → quality → tests → docs → git; and review comment templates for requesting changes, asking questions, and praising good work
**Strip:** JS/Node-specific code examples (illustrate general principles but create language noise); external links (Google, OWASP, thoughtbot, kevinlondon — stale risk); "Related Skills" cross-references are internal to this repo only; "Pro Tip" footer; negative-framing "Don't Do This" list (convert to positive SOP rules per preference)
**Structure/format:** Well-structured with clear H2/H3 hierarchy, checkbox lists, fenced-code bad/good pairs, and reusable comment templates. Master checklist at the end is the highest-value extraction target — self-contained and tool-agnostic.
**Notes:** The master checklist (Pre-Review through Git) is the primary portable artefact. Review comment templates are an underrated gem — copy verbatim. Checklist categories align well with the existing `pr-review` skill but add Git hygiene and Documentation sections that skill lacks. Overlaps with `pr-review` skill; best merged/consolidated rather than kept separate. Security sub-checklist duplicates `audit-security` items at a PR granularity — complementary, not redundant.

## skills/agent-evaluation/SKILL.md
**Type:** Domain skill — LLM agent evaluation methodology
**Portable:** Partial
**Reason:** The conceptual patterns (statistical testing, behavioral contracts, adversarial testing) and anti-patterns are genuinely reusable SOPs. The file is severely incomplete — the overview sentence is cut mid-thought ("the goal isn't 100% test pass rate—it"), and the sharp-edges table contains `// placeholder` comments instead of actual solutions. No concrete steps, workflow, or actionable procedure is provided.
**Trigger:** Use when evaluating LLM agent behavior in testing or production readiness contexts — regression testing, capability assessment, benchmark design.
**Steps/contract:** None provided. Skill defines capability tags and pattern names only; no procedural steps, checklists, or contracts exist.
**Strip:** Role-persona framing ("You're a quality engineer who has seen…"), incomplete sentence in overview, `// comment` placeholders in Sharp Edges table, generic "When to Use" footer.
**Structure/format:** Frontmatter → truncated prose overview → capability/requirement tag lists → named patterns (no detail) → anti-patterns (names only) → sharp-edges table (incomplete) → related skills → boilerplate footer.
**Notes:** High-value concept set but low extraction yield due to incompleteness. If promoted, would need: (1) completed overview, (2) filled sharp-edge solutions, (3) concrete evaluation workflow steps (e.g., N-run statistical sampling, invariant definition protocol, adversarial prompt set construction). Anti-patterns (single-run, happy-path-only, string matching) are the strongest portable atoms here.

## skills/agents-md/SKILL.md
**Type:** Authoring SOP (creates/updates project-facing agent documentation)
**Portable:** Yes — fully portable; targets universal conventions (lock files, linter configs, CI scripts) with no repo-specific assumptions
**Reason:** Codifies a research-backed, repo-agnostic protocol for writing minimal, high-signal AGENTS.md / CLAUDE.md files. Rules are derived from general agent-instruction principles (length degrades compliance, config files own style, file-scoped commands preferred) that apply to any project.
**Trigger:** User asks to "create AGENTS.md", "update AGENTS.md", "maintain agent docs", "set up CLAUDE.md", or needs to keep agent instructions concise
**Steps/contract:**
1. Analyse project — detect package manager, linter configs, CI commands, monorepo markers, existing conventions
2. Write with headers + bullets only; no paragraphs, no filler, no duplicated linter rules
3. Required sections: Package Manager, File-Scoped Commands, Commit Attribution, Key Conventions
4. Optional sections (add only if genuinely needed): API route patterns, CLI commands, file naming, project structure hints, monorepo overrides
5. Target < 60 lines; hard ceiling 100 lines
6. Create AGENTS.md at root; symlink as CLAUDE.md
**Strip:** Commit Attribution section is repo-opinionated (noreply email placeholder is a placeholder, fine), but the exact email domain could be stripped; everything else travels cleanly
**Structure/format:** Skill is well-structured — setup, pre-write analysis, writing rules, required/optional sections, anti-patterns, and a full example template. Anti-patterns list is especially actionable. Example structure doubles as a ready-to-emit template.
**Notes:** High-value candidate. Fills a real gap — most repos lack disciplined agent doc hygiene. The <60-line target with a research-based rationale (instruction-following degrades with length) is a strong, citable constraint worth preserving verbatim. Pair with `agent-optimize-rules` skill for ongoing maintenance.

## skills/behavioral-modes/SKILL.md
**Type:** Behavioral / output-format catalogue
**Portable:** Partial
**Reason:** The per-mode output-format templates (IMPLEMENT, DEBUG, REVIEW, SHIP) carry concrete, reusable formatting contracts. The mode-detection keyword table is a handy trigger heuristic. However, the skill is a loose bundle: the modes vary widely in quality and completeness, the "Combining Modes" section is empty, the "Multi-Agent Collaboration Patterns" block is underdeveloped (EXPLORE and PEC are stubs), and IMPLEMENT imports `clean-code` skill by reference without embedding its rules. The SHIP checklist duplicates a pre-ship-checklist pattern available in more focused deploy/release skills.
**Trigger:** User says "brainstorm", "build/create/add", "error/bug", "review/audit", "explain/learn", "deploy/release/production"; or implicitly when the task type is identifiable from the request.
**Steps/contract:**
1. Detect mode from keyword table (or explicit `/mode` command).
2. Apply behaviour rules for that mode (question style, depth, output verbosity).
3. Emit the prescribed output-format template for the mode.
4. For IMPLEMENT: cross-load `clean-code` standards (not embedded here).
**Strip:** Empty "Combining Modes" section; stub multi-agent patterns (EXPLORE, PEC, MENTAL MODEL SYNC) which add noise without substance; repo-specific `/command` slash-syntax; `clean-code` external dependency reference (not portable as-is); emoji decoration if house style is plain text.
**Structure/format:** Markdown with fenced output-format examples per mode; keyword→mode detection table; checklist for SHIP mode. Reasonably structured but inconsistent depth across modes.
**Notes:** Best extracted as individual per-mode output contracts (DEBUG root-cause template, REVIEW severity-tier template, SHIP pre-release checklist) rather than adopted wholesale. The mode-detection table is the most immediately portable atom. IMPLEMENT mode's anti-pattern ("NOT:") example is a useful negative-framing reference but should be rewritten as a positive spec per house style.

## skills/dispatching-parallel-agents/SKILL.md
**Type:** Workflow/orchestration pattern
**Portable:** Yes
**Reason:** Pure decision logic — identifies when to fan-out vs. stay sequential; no repo-specific tooling or APIs referenced. The `Task()` snippet is illustrative pseudocode, not a hard dependency.
**Trigger:** "2+ independent tasks that can be worked on without shared state or sequential dependencies" — concretely: ≥3 failing test files with distinct root causes, multiple broken subsystems with no cross-dependency, any multi-problem investigation where problems don't share state.
**Steps/contract:** (1) Identify independent domains — group failures by what's broken. (2) Write focused, self-contained agent prompts with explicit scope, goal, constraints, and expected output format. (3) Dispatch in parallel (one agent per domain). (4) Review summaries, check for conflicts, run full suite, integrate. Also includes a decision tree (use when independent + no shared state; use sequential when related or shared state; single agent when related).
**Strip:** The `.dot` digraph block (renders as raw text in most contexts); the TypeScript `Task()` pseudocode example (use prose instead); the "Real Example from Session" and "Real-World Impact" sections (session-specific war story — useful as illustration but not part of the SOP itself); the 2025-10-03 date reference.
**Structure/format:** Well-structured — decision tree, pattern steps, prompt template example, mistakes table (❌/✅), verification checklist. The prompt template is high-signal and should be preserved as a canonical example.
**Notes:** Strong SOP candidate. The decision tree (independent? → parallel / shared state? → sequential / related? → single agent) is the core portable rule. The agent-prompt anatomy (scope + goal + constraints + output format) is the key deliverable. No overlap with existing skills catalogue entries — closest neighbour is `design-interface` (which uses parallel sub-agents) but this skill covers the general pattern, not a specific domain.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/conductor-setup/SKILL.md / **Type** / setup / **Portable**: no / **Reason**: It is tightly coupled to the Conductor app, Rails project layout, and specific files like conductor.json, bin/, script/server, and Redis/Rails config conventions.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/conductor-implement/SKILL.md / **Type** / implementation workflow / **Portable**: no / **Reason**: It depends on Conductor-specific directory structure, metadata, and workflow semantics such as conductor/workflow.md, tracks.md, and track plan files.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/conductor-manage/SKILL.md / **Type** / lifecycle management / **Portable**: no / **Reason**: It is built around Conductor track lifecycle operations and metadata updates, making it specific to that ecosystem's track files and conventions.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/conductor-validator/SKILL.md / **Type** / validation / **Portable**: no / **Reason**: It validates Conductor artifacts using hardcoded project paths and status markers that only exist in the Conductor track system.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/conductor-new-track/SKILL.md / **Type** / track creation / **Portable**: no / **Reason**: It is specific to Conductor's track model, file structure, and interactive spec/plan generation flow, so it does not transfer cleanly outside that toolchain.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/conductor-status/SKILL.md / **Type** / status reporting / **Portable**: no / **Reason**: It assumes Conductor's tracks.md, metadata.json, and plan.md schema, which are ecosystem-specific status sources and markers.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/conductor-revert/SKILL.md / **Type** / revert workflow / **Portable**: no / **Reason**: It relies on Conductor track IDs, commit naming conventions, and plan/metadata rewrites tied to that project management system.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/loki-mode/SKILL.md / **Type** / autonomous orchestration / **Portable**: no / **Reason**: It is deeply bound to Loki's proprietary multi-agent filesystem, memory, queue, and state layout, plus its custom RARV workflow and agent model assumptions.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/antigravity-skill-orchestrator/SKILL.md / **Type**: meta-skill / **Portable**: partial / **Reason**: The complexity-gating and minimal-skill selection pattern is reusable, but the memory tool, catalog path, and ecosystem assumptions are tightly tied to Antigravity. / **Notes**: Portable core is the direct-vs-orchestrated task evaluation guardrail.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/antigravity-workflows/SKILL.md / **Type**: workflow orchestrator / **Portable**: partial / **Reason**: The stepwise workflow-routing approach transfers well, but the named workflow catalog and local docs/data sources make the file implementation-specific. / **Notes**: Portable core is proposing the best matching workflow, then executing with checkpoints and validation.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/agent-orchestrator/SKILL.md / **Type**: registry/orchestration SOP / **Portable**: partial / **Reason**: Auto-discovery, skill matching, and orchestration are broadly useful, but the scan/match scripts and registry layout are repo-specific. / **Notes**: Portable core is the discover→rank→orchestrate pipeline for multi-skill routing.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/parallel-agents/SKILL.md / **Type**: multi-agent orchestration patterns / **Portable**: yes / **Reason**: The guidance on when to parallelize, sequence, or synthesize multiple agents is generic and can be applied in other agent systems with minimal change. / **Notes**: Portable core is the pattern selection for comprehensive analysis and synthesis.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/loki-mode/SKILL.md / **Type**: autonomous operating system / **Portable**: no / **Reason**: This is deeply coupled to the .loki directory layout, specific model-routing rules, and zero-intervention autonomy assumptions. / **Notes**: Skipped as a general SOP candidate because most instructions depend on Loki-specific state files and execution model.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/writing-plans/SKILL.md / **Type**: implementation planning SOP / **Portable**: yes / **Reason**: Bite-sized planning, exact file/test commands, and frequent-commit structure are broadly useful across codebases. / **Notes**: Portable core is the small-step plan template with explicit test and commit actions.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/finishing-a-development-branch/SKILL.md / **Type**: branch-completion SOP / **Portable**: yes / **Reason**: The verify-tests-then-present-options flow is a general branch finishing checklist that applies cleanly to most development workflows. / **Notes**: Portable core is the structured merge/PR/keep/discard decision sequence after validation.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/context-driven-development/SKILL.md / **Type**: context-management framework / **Portable**: partial / **Reason**: The idea of treating context as a first-class artifact is reusable, but the Conductor artifact names and lifecycle are project-specific. / **Notes**: Portable core is maintaining canonical context docs for product, tech, workflow, and active work.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/context-fundamentals/SKILL.md / **Type**: reference / **Portable**: partial / **Reason**: Strong foundational explanation of context mechanics, but it reads as instructional background rather than a directly executable SOP. / **Notes**: Portable elements are the finite-budget framing, progressive disclosure principle, and context budgeting guidelines.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/context-window-management/SKILL.md / **Type**: reference / **Portable**: partial / **Reason**: It contains reusable heuristics for truncation, summarization, and token prioritization, but the current skill is high-level and incomplete. / **Notes**: Portable elements are the tiered strategy, serial-position optimization, and intelligent summarization patterns.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/context-manager/SKILL.md / **Type**: reference / **Portable**: no / **Reason**: The file is a broad persona-style capability dump with overlapping claims and little operational specificity, so it is not a clean SOP candidate. / **Notes**: Skipped because it mixes architecture, marketing language, and examples without a crisp workflow boundary.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/memory-systems/SKILL.md / **Type**: SOP / **Portable**: yes / **Reason**: It presents a clear decision framework for selecting memory architectures and includes concrete patterns, retrieval modes, and consolidation steps. / **Notes**: Key portable elements are the context-memory spectrum, layer taxonomy, selection matrix, and temporal knowledge graph guidance.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/agent-memory-mcp/SKILL.md / **Type**: runbook / **Portable**: partial / **Reason**: The setup, tool contract, and dashboard instructions are reusable, but the implementation is tied to a specific external repository and launch process. / **Notes**: Portable elements are the MCP tool definitions, installation sequence, and memory CRUD workflow.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/audit-skills/SKILL.md / **Type**: SOP / **Portable**: yes / **Reason**: It defines a repeatable static-analysis audit workflow with threat categories, checks, and reporting structure that transfers well across repos. / **Notes**: Key portable elements are the non-intrusive audit rule set, platform threat taxonomy, and reporting checklist.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/agentic-actions-auditor/SKILL.md / **Type**: SOP / **Portable**: yes / **Reason**: It is a structured, stepwise audit methodology with explicit detection vectors, evidence capture rules, and remediation guidance. / **Notes**: Key portable elements are the workflow scan procedure, AI-action identification matrix, vector checks, and findings format.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/clarity-gate/SKILL.md / **Type**: SOP / **Portable**: yes / **Reason**: It contains a detailed validation workflow, output schema, and decision rules that can be ported into a general document-quality SOP. / **Notes**: Key portable elements are the epistemic checks, verification hierarchy, CGD/SOT format rules, and structured output template.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/bdistill-behavioral-xray/SKILL.md / **Type**: behavioral-analysis workflow / **Portable**: partial / **Reason**: The probe dimensions and reporting pattern are reusable, but the skill is tightly coupled to the bdistill CLI/MCP setup and model-self-testing context. / **Notes**: Portable core is the 6-dimension behavioral audit model plus HTML report structure.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/bdistill-knowledge-extraction/SKILL.md / **Type**: knowledge-extraction workflow / **Portable**: partial / **Reason**: The structured extraction, adversarial validation, and export pipeline are broadly reusable, but the implementation is anchored to bdistill and Ollama-specific commands. / **Notes**: Portable core is the JSONL schema and validation/calibration flow.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/tdd-orchestrator/SKILL.md / **Type**: test-orchestration meta-skill / **Portable**: partial / **Reason**: The TDD discipline, workflow coordination, and quality gates are generally reusable, but the content is extremely broad and reads more like a generic capability catalog than a crisp SOP. / **Notes**: Portable core is the red-green-refactor orchestration and test-quality checklist.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/skill-creator/SKILL.md / **Type**: meta-skill / **Portable**: partial / **Reason**: The phase-based creation workflow is reusable, but it is heavily tied to the repo’s template paths, platform detection, and installation commands. / **Notes**: Portable core is the 5-phase skill creation flow with validation and installation checkpoints.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/00-andruia-consultant/SKILL.md / **Type**: project-diagnosis workflow / **Portable**: partial / **Reason**: The blank-vs-existing project diagnostic and roadmap generation pattern is reusable, but the skill is constrained by Spanish-only output and Andru.ia-specific framing. / **Notes**: Portable core is the initial workspace assessment and roadmap/squad materialization.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/10-andruia-skill-smith/SKILL.md / **Type**: skill-authoring workflow / **Portable**: partial / **Reason**: The skill-forging steps and registry update flow can transfer, but the instructions are anchored to a specific repository structure, Windows path, and branding. / **Notes**: Portable core is the skill ADN → materialization → deployment sequence.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/progressive-estimation/SKILL.md / **Type**: estimation workflow / **Portable**: partial / **Reason**: The PERT-based estimation and calibration loop are broadly useful, but the skill is packaged around a specific product, output destinations, and AI-agent terminology. / **Notes**: Portable core is the mode detection + PERT + confidence band estimation model.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/antigravity-skills/skills/bdi-mental-states/SKILL.md / **Type**: ontology/modeling workflow / **Portable**: partial / **Reason**: The BDI mental-state modeling patterns, competency questions, and anti-patterns are reusable, but the skill is narrowly specialized to RDF/ontology and neuro-symbolic systems. / **Notes**: Portable core is the belief/desire/intention lifecycle with temporal validity and justification links.
