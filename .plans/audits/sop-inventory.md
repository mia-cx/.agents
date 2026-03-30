# SOP Inventory — Cross-Repo Consolidated Findings

> Generated from 18 approved audits. Each block consolidates every repo that contributes to the SOP.
> Scope: coding & engineering workflows only.

---

## code-review

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| agentic-rules | `templates/claude-code/.claude/commands/review.md` | yes |
| antigravity-skills | `skills/code-review-excellence/SKILL.md` | partial |
| antigravity-skills | `skills/code-review-checklist/SKILL.md` | yes |
| antigravity-skills | `skills/receiving-code-review/SKILL.md` | partial |
| awesome-claude | `agents/code-review-sentinel.md` | partial |
| awesome-subagents | `categories/04-quality-security/code-reviewer.md` | yes |
| citypaul-dotfiles | `claude/.claude/agents/pr-reviewer.md` | partial |
| cursor-rules | `rules/code-review-excellence` (mapped from wshobson) | yes |
| dotagents | `agents/review-and-qa/pr-reviewer.md` | yes |
| klinglt-dotfiles | `agents/code-reviewer.md` | yes |
| mattpocock-skills | `qa/SKILL.md` | yes |
| wshobson-agents | `plugins/developer-essentials/skills/code-review-excellence/SKILL.md` | yes |
| gstack | `review/SKILL.md` | yes |

**Trigger** (consolidated): User requests code review, PR review, pre-merge check, or "review my changes"; after writing/modifying code; before merging any branch.

**Steps/contract** (consolidated):
1. Gather context — PR description, linked issues, CI status, commit history, diff scope.
2. Scope-drift detection — cross-reference plan/spec against actual diff; classify CLEAN / DRIFT / REQUIREMENTS MISSING.
3. Structured multi-pass review — Pass 1 CRITICAL (security, data safety, race conditions, correctness); Pass 2 INFORMATIONAL (performance, maintainability, style, test gaps, dead code).
4. Per-finding output: file:line, issue description, severity tier, fix recommendation.
5. Severity-tiered verdict: APPROVE / REQUEST CHANGES / BLOCK based on highest-severity finding.
6. Test coverage assessment — code-path + user-flow coverage diagram; regression test requirement for any discovered bug.
7. Plan completion audit (gstack) — extract actionable items from plan/spec, cross-reference each against diff as DONE/PARTIAL/NOT DONE/CHANGED.
8. Adversarial review pass scaled by diff size (gstack) — skip <50 lines; subagent for 50–199; full multi-pass for 200+.

**Strong** (per source):
- agentic-rules: 7-category checklist (functionality, quality, testing, security, performance, docs, style).
- awesome-claude: Test-quality focus with triviality detection heuristics; APPROVE/REQUEST CHANGES/BLOCK framework.
- awesome-subagents: Priority ordering (security→correctness→performance→maintainability→tests→docs); numeric acceptance gates.
- citypaul-dotfiles: Dual-mode (proactive/reactive); 5-category framework with severity tiers.
- dotagents: Structural Rot taxonomy (5 named patterns with "why dangerous"); noise-suppression discipline ("prioritize less noise over completeness").
- klinglt-dotfiles: Severity→verdict mapping; "suggest fixes, don't just point out problems" output contract.
- gstack: Plan completion audit (DONE/PARTIAL/NOT DONE/CHANGED); test coverage diagram (code paths + user flows); fix-first heuristic; adversarial scaling by diff size.
- wshobson-agents: Staged review (design→file→correctness→security→performance); "feedback is educational and actionable" rule.

**Strip** (consolidated): Project-specific stack references; agent harness frontmatter (model, color, tools); named specialist routing; persona/backstory; hardcoded file paths; Cursor/Claude Code–specific syntax.

**Output form**: skill (pr-review)

---

## tdd

**Sources**:

| Repo               | Source file                                                          | Portable |
| ------------------ | -------------------------------------------------------------------- | -------- |
| agentic-rules      | `canonical-rules.md` §3 (CoT gate, TDD overlap)                      | partial  |
| ai-engineering-sop | `.cursor/rules/validation.mdc` + `ai/doc/guides/testing-strategy.md` | yes      |
| ai-engineering-sop | `ai/skill/design-whitebox-tests.md`                                  | yes      |
| antigravity-skills | `skills/tdd-orchestrator/SKILL.md`                                   | partial  |
| awesome-claude     | `skills/tdd/SKILL.md`                                                | partial  |
| awesome-subagents  | `categories/04-quality-security/test-automator.md`                   | partial  |
| citypaul-dotfiles  | `claude/.claude/agents/tdd-guardian.md`                              | yes      |
| citypaul-dotfiles  | `claude/.claude/skills/tdd/SKILL.md`                                 | yes      |
| citypaul-dotfiles  | `claude/.claude/skills/mutation-testing/SKILL.md`                    | yes      |
| citypaul-dotfiles  | `claude/.claude/skills/test-design-reviewer/SKILL.md`                | yes      |
| citypaul-dotfiles  | `claude/.claude/skills/front-end-testing/SKILL.md`                   | yes      |
| cursor-rules       | `rules/testing-tdd`                                                  | yes      |
| dotagents          | `agents/engineering/ralph.md`                                        | yes      |
| klinglt-dotfiles   | `agents/tdd-guide.md`                                                | partial  |
| mattpocock-skills  | `tdd/SKILL.md` + companion refs                                      | yes      |
| strands-agent-sop  | `agent-sops/code-assist.sop.md`                                      | yes      |
| wshobson-agents    | `plugins/conductor/skills/workflow-patterns/SKILL.md`                | yes      |

**Trigger** (consolidated): Implementing features, fixing bugs, adding test coverage using test-first discipline; mentions "red-green-refactor"; any code generation task.

**Steps/contract** (consolidated):
1. Plan — confirm interfaces, prioritize behaviors, identify deep-module opportunities, get approval.
2. RED — write simplest failing test; run and verify failure for the right reason.
3. GREEN — write minimum implementation to pass; stop immediately on regression.
4. REFACTOR — assess value after every green; commit before and after refactoring.
5. Full verify — run full check suite; on failure: stop, describe, ask user.
6. Per-cycle checklist: factory-over-let/beforeEach; behavior-not-implementation naming; coverage measured by business behavior.
7. Coverage exception process: document in README → get approval → persist in context file.
8. Mutation testing (citypaul): mutate→run tests→revert; fix-immediately vs ask-human triage; score benchmarks.

**Strong** (per source):
- citypaul-dotfiles: Dual-mode RED/GREEN/REFACTOR with violation reporting; factory heuristic; Farley Score formula (8-property rubric); mutation testing SOP; coverage theater detection taxonomy; 14-item frontend anti-pattern catalog.
- cursor-rules: Full TDD lifecycle + pitfalls list; strongest portable testing SOP in that repo.
- dotagents (ralph): Fresh-context iterative TDD loop; IMPLEMENTATION_PLAN.md as shared-brain protocol; hard stops at 3/10 iterations.
- mattpocock-skills: Horizontal-slicing anti-pattern block; vertical-slice discipline; "outrun your headlights" framing.
- strands-agent-sop: Interactive/auto mode bifurcation; "implement ALL tests before ANY implementation code"; "only interrupt when genuinely blocked."
- awesome-claude: 7-step workflow; corner-case checklist (Empty/Boundary/Type/Size/Format/Time); 6-question destructive-tester mindset.
- ai-engineering-sop: Black-box default with white-box triggers; "bugfix-first" rule; anti-coverage-goal stance.
- klinglt-dotfiles: 8-category edge-case checklist; Test Smells ❌/✅ block; 4-axis 80% coverage threshold (100% for critical paths).

**Strip** (consolidated): Language-specific test commands; framework-specific mock examples; agent harness frontmatter; domain-specific test scenarios.

**Output form**: skill (tdd)

---

## plan-to-spec

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| ai-engineering-sop | `ai/skill/plan-to-spec.md` | yes |
| ai-engineering-sop | `ai/doc/templates/task-spec-template.md` | yes |
| ai-engineering-sop | `ai/doc/guides/design-to-spec-handoff.md` | yes |
| ai-engineering-sop | `ai/doc/guides/phase-aware-workflow.md` | yes |
| awesome-codex-skills | `create-plan/SKILL.md` | yes |
| awesome-codex-skills | `notion-spec-to-implementation/reference/spec-parsing.md` | partial |
| citypaul-dotfiles | `claude/.claude/commands/plan.md` | yes |
| citypaul-dotfiles | `claude/.claude/agents/progress-guardian.md` | yes |
| dotagents | `skills/prd-to-plan/SKILL.md` | yes |
| klinglt-dotfiles | `agents/planner.md` | yes |
| mattpocock-skills | `prd-to-plan/SKILL.md` | yes |
| strands-agent-sop | `agent-sops/pdd.sop.md` | partial |
| taches | `skills/create-plans/SKILL.md` + references | partial |
| gstack | `plan-eng-review/SKILL.md` | partial |
| gstack | `plan-ceo-review/SKILL.md` | partial |

**Trigger** (consolidated): Plan or phase slice available; work about to move into implementation; user wants phased implementation plan from PRD; "break down PRD."

**Steps/contract** (consolidated):
1. Narrow to smallest reviewable unit; one spec, one primary outcome.
2. Split if mixing concerns; choose smallest satisfying implementation path.
3. Make execution contract explicit (in/out scope, affected area, done condition).
4. Add lightweight execution state (status enum + checklist).
5. Make validation explicit; black-box default.
6. Judge white-box need by trigger conditions.
7. Decide write-back destination deliberately.
8. Add failure boundaries for long-running/dependency-heavy work (Repair Budget, Rollback Scope, Escalation Condition).
9. Tracer-bullet vertical slices — each thin, end-to-end, independently demoable.

**Strong** (per source):
- ai-engineering-sop: 9-step workflow + 12-item failure-modes checklist; failure-boundary fields (Repair Budget, Rollback Scope, Escalation Condition); executor mutation limits; Allowed/Disallowed Edits fields.
- awesome-codex-skills: ≤2 blocking-questions cap; phase ordering (discovery→changes→tests→rollout); 6–10 item checklist.
- citypaul-dotfiles: Plan file template with BDD acceptance criteria; MUTATE step; per-step Done-when fields; dual approval gates.
- mattpocock-skills: "Do NOT include specific file names or function names" rule; durable decisions upfront.
- strands-agent-sop: One-question-at-a-time clarification loop; implementation plan with per-step Demo descriptions.
- taches: Plans-as-prompts contract; scope control; deviation rules; checkpoint taxonomy.
- gstack: Step 0 scope challenge (complexity smell ≥8 files or ≥2 new classes); two-dimensional coverage model (code paths + user flows); implementation alternatives template.

**Strip** (consolidated): Hardcoded plan paths; harness-specific syntax; slash-command references; org-specific phase hierarchy.

**Output form**: skill (plan-to-spec / prd-to-plan)

---

## architecture-review

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| awesome-subagents | `categories/04-quality-security/architect-reviewer.md` | partial |
| citypaul-dotfiles | `claude/.claude/skills/hexagonal-architecture/SKILL.md` | yes |
| citypaul-dotfiles | `claude/.claude/skills/domain-driven-design/SKILL.md` | yes |
| klinglt-dotfiles | `agents/architect.md` | yes |
| mattpocock-skills | `improve-codebase-architecture/SKILL.md` | yes |
| gstack | `plan-eng-review/SKILL.md` | partial |

**Trigger** (consolidated): Planning new features; refactoring large systems; making significant architectural decisions; user wants to improve architecture or make codebase more testable/AI-navigable.

**Steps/contract** (consolidated):
1. Current state analysis — review existing arch, patterns, debt, scalability limits.
2. Requirements gathering — functional, non-functional, integration, data-flow.
3. Design proposal — diagram, component responsibilities, data models, API contracts.
4. Trade-off analysis — Pros/Cons/Alternatives/Decision per decision; ADR template.
5. Spawn ≥3 parallel divergent sub-agents with different constraints; compare on 4 axes.
6. Red-flags anti-pattern checklist (tight coupling, missing error handling, security gaps, scalability constraints).

**Strong** (per source):
- citypaul-dotfiles: Complete ports/adapters SOP with swappability test ("if swapping an adapter requires changing domain code, the boundary is wrong"); full DDD building blocks with decision tables + 17-point checklist.
- klinglt-dotfiles: 4-phase review loop + ADR template; red-flags anti-pattern list.
- mattpocock-skills: "Friction you encounter IS the signal"; parallel divergent design ("Design It Twice"); dependency taxonomy; "replace, don't layer" testing principle.
- gstack: Step 0 scope challenge; worktree parallelization strategy; "search before building" per architectural pattern.

**Strip** (consolidated): Stack-specific examples; resource sub-file cross-references; agent harness frontmatter.

**Output form**: skill (codebase-architecture)

---

## debugging

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| antigravity-skills | `skills/systematic-debugging/SKILL.md` | partial |
| awesome-claude | `skills/tracing/SKILL.md` | partial |
| dotagents | `agents/engineering/debugger.md` | yes |
| citypaul-dotfiles | `claude/.claude/skills/ci-debugging/SKILL.md` | yes |
| gstack | `investigate/SKILL.md` | yes |
| klinglt-dotfiles | `agents/build-error-resolver.md` | yes |
| taches | `skills/debug-like-expert/SKILL.md` + references | yes |
| awesome-subagents | `categories/04-quality-security/debugger.md` | partial |

**Trigger** (consolidated): Something broken, cause unknown; CI failures; "debug this", "fix this bug", "why is this broken", "investigate", "root cause analysis."

**Steps/contract** (consolidated):
1. Collect symptoms from errors and stack traces; triage symptom precisely.
2. Reproduce deterministically; flag env differences.
3. Generate ≥3 hypotheses before investigating; form 2–5 ranked hypotheses.
4. Investigate one at a time; record result; match against named patterns (race condition, nil/null propagation, state corruption, integration failure, config drift, stale cache).
5. 3-strike rule: after 3 failed hypotheses, stop and escalate with options.
6. Fix root cause, not symptom; minimal diff; write regression test that fails without fix.
7. Run full test suite; if fix touches >5 files, escalate about blast radius.
8. Produce structured DEBUG/Root Cause Report: symptom / root cause / fix (file:line) / evidence / regression test / related notes / status.

**Strong** (per source):
- gstack: Iron Law (no fixes without root cause); 3-strike escalation; 6-pattern analysis table; scope-lock to narrowest affected directory; anti-rationalization list.
- dotagents: "Diagnose only, never fix" boundary; Root Cause Report covers blast radius and ruled-out hypotheses.
- citypaul-dotfiles: Hypothesis-first; environment delta analysis matrix (8 factors); "every CI failure is real until proven otherwise."
- taches: Scientific debugging loop; 5 cognitive biases checklist; falsifiability criterion; 8 named investigation techniques with decision tree.
- klinglt-dotfiles: Minimal-diff strategy; priority tiers (🔴/🟡/🟢); one error at a time; 3-attempt stopping condition.
- awesome-claude: Incident vs Feature Tracing modes; chain-break tracing; PlantUML-as-proof-of-understanding; 5-type issue table taxonomy.

**Strip** (consolidated): Stack-specific examples; persona/backstory; Conductor paths; `superpowers:*` tool names.

**Output form**: skill (debug-helper / investigate)

---

## security-review

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| awesome-claude | `rules/arch/LLM_SECURITY.md` | yes |
| awesome-claude | `rules/arch/db/SECURITY.md` | yes |
| awesome-claude | `rules/arch/ARCH_TESTS.md` (R8 LLM gate) | partial |
| awesome-subagents | `categories/04-quality-security/security-auditor.md` | yes |
| awesome-subagents | `categories/04-quality-security/penetration-tester.md` | yes |
| cursor-rules | `rules/security-best-practices` | yes |
| dotagents | `agents/review-and-qa/security-reviewer.md` | yes |
| dotagents | `skills/audit-security/SKILL.md` | yes |
| klinglt-dotfiles | `agents/security-reviewer.md` | yes |
| klinglt-dotfiles | `rules/security.md` | partial |
| gstack | `cso/SKILL.md` | yes |
| antigravity-skills | `skills/audit-skills/SKILL.md` | yes |
| antigravity-skills | `skills/differential-review/SKILL.md` | partial |

**Trigger** (consolidated): "Security audit", "threat model", "pentest review"; code touching auth/authz/user-input/API endpoints/secret management; before major releases; dependency updates with CVEs.

**Steps/contract** (consolidated):
1. Stack detection + architecture mental model; map trust boundaries.
2. Secrets archaeology — git history scan for key prefixes; tracked .env files.
3. Dependency supply chain audit.
4. CI/CD pipeline review (unpinned actions, script injection).
5. OWASP Top 10 category-by-category analysis.
6. LLM security — user input in system prompts, unsanitized LLM output, tool call validation.
7. STRIDE threat model per component.
8. FP filtering + active verification — hard exclusions, named precedents, confidence gate, independent subagent verifier.
9. Findings report: per-finding block (severity, confidence, VERIFIED/UNVERIFIED, exploit scenario, impact, recommendation).

**Strong** (per source):
- gstack: 14-phase methodology; 22 hard FP exclusions + 12 named precedents; active-verification with independent subagent verifier; "zero noise > zero misses" philosophy.
- dotagents: OWASP-grounded 6-step review; no-security-theater rule; severity matrix with merge-gate implications; Structural Rot taxonomy.
- awesome-claude: LLM security checklist (8 rules including "never use LLM output for authZ"); DB role separation; authZ-before-write rule.
- cursor-rules: Comprehensive OWASP-aligned reference; framework-agnostic rules + before/after code examples.
- awesome-subagents: 8-domain audit checklists + compliance framework list; real-world pentest lifecycle (pre-engagement → recon → testing → validation → reporting).
- klinglt-dotfiles: OWASP Top 10 loop + 10-pattern vulnerability catalog; tiered report + emergency-response procedure; 8-item pre-commit checklist.

**Strip** (consolidated): Russian prose (awesome-claude); stack-specific examples; agent harness frontmatter; Garry Tan persona (gstack).

**Output form**: skill (audit-security)

---

## deploy-verify

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| agentic-rules | `canonical-rules.md` §6 (canary deploy) | partial |
| agentic-rules | `canonical-rules.md` §7 (rollback/monitor) | partial |
| dotagents | `skills/deploy-verify/SKILL.md` | yes |
| gstack | `canary/SKILL.md` | partial |
| gstack | `land-and-deploy/SKILL.md` | partial |
| awesome-subagents | `categories/03-infrastructure/deployment-engineer.md` | yes |

**Trigger** (consolidated): "Verify deploy", "smoke test", "check production"; post-deploy monitoring; canary/blue-green traffic shifting.

**Steps/contract** (consolidated):
1. Resolve production URL; enumerate routes.
2. Baseline capture — screenshot + console errors + load time + text snapshot per page.
3. Health check gate — 5 consecutive health checks; on failure revert immediately.
4. Traffic shift — 25% to canary on success; revert on first failure.
5. Monitoring loop — every 60s; compare against baseline; alert only on 2+ consecutive anomalies (transient tolerance).
6. Health report: per-page table (page / status / new errors / avg load) + VERDICT (HEALTHY/DEGRADED/BROKEN).
7. Baseline promotion if HEALTHY.

**Strong** (per source):
- gstack: Alert-on-changes-not-absolutes; transient tolerance (2+ checks); baseline-promotion lifecycle close; config fingerprinting; review staleness metric; four-strategy deploy monitoring.
- agentic-rules: 5-ping/25%-shift/rollback contract; stable-version-file lookup → alias update → notify → polling monitor.
- dotagents: Playwright smoke-test protocol; console errors reported non-blocking; generous timeouts.
- awesome-subagents: DORA targets (freq >10/day, lead time <1hr, MTTR <30min, CFR <5%); 8-strategy taxonomy.

**Strip** (consolidated): AWS/Terraform specifics; SvelteKit/Wrangler routes; `$B` binary references; Garry Tan persona.

**Output form**: skill (deploy-verify)

---

## release-workflow

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| dotagents | `skills/release/SKILL.md` | yes |
| dotagents | `skills/gc/SKILL.md` | yes |
| dotagents | `skills/pr-file/SKILL.md` | yes |
| dotagents | `skills/pr-merge/SKILL.md` | yes |
| dotagents | `skills/setup-changesets/SKILL.md` | yes |
| dotagents | `skills/next-slice/SKILL.md` | yes |
| awesome-codex-skills | `changelog-generator/SKILL.md` | yes |
| awesome-claude | `rules/git.md` | yes |
| awesome-claude | `skills/commit/SKILL.md` | partial |
| citypaul-dotfiles | `claude/.claude/commands/continue.md` | yes |
| gstack | `ship/SKILL.md` (sub-workflows) | partial |
| gstack | `document-release/SKILL.md` | partial |

**Trigger** (consolidated): "Release", "cut a release", "publish", "changelog"; filing PRs; merging PRs; committing changes; advancing to next slice after merge.

**Steps/contract** (consolidated):
1. Commit grouping — split uncommitted changes into logical single-concern commits; conventional commit format.
2. PR filing — discover PR template + CONTRIBUTING.md; conventional-commit title ≤72 chars; repo template honoured over defaults.
3. PR merge — verify CI green + approvals + mergeable; post comment BEFORE merge; conventional-commit subject.
4. Release — auto-detect changeset config; status → version → show diff → commit + push → extract changelog → `gh release create`.
5. Changelog authoring — branch-scoped; lead with user capability ("you can now…"); no internal jargon.
6. Next-slice advancement — confirm PR merged; remove old worktree; delete branch; ff-only pull; scan for next plan; create fresh worktree.

**Strong** (per source):
- dotagents: Dual-path release (changesets + manual); semver bump inference table; HITL/AFK slice classification; "post comment BEFORE merge" ordering; hard stop if not mergeable.
- gstack: Bisectable commit ordering (infra→models→controllers→CHANGELOG); verification gate Iron Law; "Only stop for / Never stop for" table; CHANGELOG non-clobber rule.
- awesome-claude: What/Why/Details commit format; file-by-file listing; explicit test coverage mention.
- citypaul-dotfiles: Post-merge orientation ritual; "do NOT start implementing" constraint.
- awesome-codex-skills: Git-history-to-changelog; noise filtering; customer-facing language.

**Strip** (consolidated): Russian prose; Co-Authored-By model-version trailer; worktree-specific paths; Garry Tan persona.

**Output form**: skill (release / gc / pr-file / pr-merge / next-slice)

---

## refactoring

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| citypaul-dotfiles | `claude/.claude/agents/refactor-scan.md` | yes |
| citypaul-dotfiles | `claude/.claude/skills/refactoring/SKILL.md` | yes |
| dotagents | `agents/engineering/refactorer.md` | yes |
| mattpocock-skills | `request-refactor-plan/SKILL.md` | yes |
| awesome-subagents | `categories/06-developer-experience/refactoring-specialist.md` | yes |
| awesome-subagents | `categories/06-developer-experience/legacy-modernizer.md` | yes |
| klinglt-dotfiles | `agents/refactor-cleaner.md` | yes |

**Trigger** (consolidated): Code needs restructuring without behaviour change; user wants to plan a refactor; dead code cleanup; legacy modernization.

**Steps/contract** (consolidated):
1. Assess blast radius; baseline — run test suite; stop if already failing.
2. Plan with pattern name + risk level + rollback per step; STOP for approval.
3. Execute: smallest change → test → commit if green, revert+diagnose if red.
4. Semantic DRY test: "if business rules for X change, should Y change too?" — identical code representing different knowledge should NOT be DRY'd.
5. Verify full suite; report.
6. Risk-tier classification for deletions: SAFE / CAREFUL / RISKY.

**Strong** (per source):
- citypaul-dotfiles: Semantic-vs-structural duplication distinction; explicit ✅ Skip tier; "DRY is about knowledge duplication, not code duplication."
- dotagents: 8-step approval-gated refactor; named pattern catalogue; "if refactor uncovers a bug, document but do NOT fix."
- mattpocock-skills: 8-step interview-then-document; test-coverage gate; tiny-commits; "no file paths in Decision Document."
- awesome-subagents: Fowler catalog + code-smell taxonomy + characterization-test safety net.
- klinglt-dotfiles: SAFE/CAREFUL/RISKY risk-tier model; DELETION_LOG template; "When NOT to Use" guard conditions.

**Strip** (consolidated): Agent routing labels; model fields; TypeScript-specific syntax.

**Output form**: skill (refactor-plan)

---

## scope-control

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| ai-engineering-sop | `.cursor/rules/scope-control.mdc` + `.cursor/rules/boundaries.mdc` | yes |
| ai-engineering-sop | `.cursor/rules/workflow.mdc` | yes |
| ai-engineering-sop | `ai/doc/guides/task-lifecycle-and-escalation.md` | yes |

**Trigger** (consolidated): Always active; highest relevance when task boundary begins expanding.

**Steps/contract** (consolidated):
1. One primary outcome per task.
2. Split mixed-concern tasks before starting.
3. Choose smallest satisfying implementation path.
4. Do not introduce unneeded abstractions; do not refactor unrelated modules; do not implement future-phase work.
5. Prefer existing structures over new parallel ones.
6. When scope is ambiguous, narrow it.
7. Status enum (8 values): distinguish repair / rollback / replan / escalate.

**Strong** (per source):
- ai-engineering-sop: Repair/rollback/replan/escalate taxonomy; re-narrowing is the default response to scope pressure; "opportunistic-refactor prohibition."

**Strip** (consolidated): `ai/` directory convention paths.

**Output form**: rule (scope-control)

---

## write-back-gate

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| ai-engineering-sop | `.cursor/rules/writeback.mdc` | yes |
| ai-engineering-sop | `ai/doc/facts/facts-index.md` (negative list) | partial |
| dotagents | `rules/write-back-gate.md` | yes |

**Trigger** (consolidated): Before persisting any artifact to a permanent file.

**Steps/contract** (consolidated):
1. Answer 3 questions: still matter later? reusable? clear home?
2. Route by type: context→facts; procedure→skill; repo guidance→rules; task notes→change summary only.
3. Anti-archive: facts are stable context, not a narrative archive.
4. "Do not store" exclusion list: temporary notes, raw debugging chatter, one-off task reasoning, unstable exploration, change-summary-only content.
5. Update index files when adding/removing/renaming.

**Strong** (per source):
- ai-engineering-sop: Three-question filter; routing taxonomy with label vocabulary.
- dotagents: 3-question gate + routing table; "facts are stable context, not a conversation archive."

**Strip** (consolidated): `ai/doc/facts/` and `ai/skill/` paths.

**Output form**: rule (write-back-gate)

---

## skill-authoring

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| ai-engineering-sop | `ai/skill/skill-policy.md` | yes |
| anthropic-skills | `skills/skill-creator/SKILL.md` | partial |
| anthropic-skills | `skills/skill-creator/agents/grader.md` | yes |
| anthropic-skills | `skills/skill-creator/agents/comparator.md` | yes |
| anthropic-skills | `skills/skill-creator/agents/analyzer.md` | yes |
| context-engineering | `template/SKILL.md` | yes |
| context-engineering | `CLAUDE.md` (skill-authoring rules) | partial |
| context-engineering | `docs/agentskills.md` | partial |
| dotagents | `rules/skill-promotion.md` | yes |
| mattpocock-skills | `write-a-skill/SKILL.md` | yes |
| strands-agent-sop | `skills/agent-sop-author/SKILL.md` | yes |
| strands-agent-sop | `rules/agent-sop-format.md` | partial |
| taches | `skills/create-agent-skills/SKILL.md` + references | yes |
| klinglt-dotfiles | `commands/learn.md` | partial |
| dotagents | `agents/meta/subagent-writer.md` | yes |

**Trigger** (consolidated): Creating, optimizing, evaluating, or auditing skills/SOPs; extracting recurring workflows into reusable skills.

**Steps/contract** (consolidated):
1. Understand skill with concrete examples; interview for domain, use cases, scripts.
2. Plan reusable contents (scripts / references / assets).
3. Draft SKILL.md: description ≤1024 chars, body ≤100–500 lines; progressive disclosure via reference files.
4. Eval-driven development: run without skill → document failures → create evals → write minimal instructions → iterate.
5. Blind A/B comparison (grader/comparator/analyzer agents).
6. Promote when: repeats, I/O recognisable, reduces reasoning, reusable. Skip when: unstable, too narrow, better as task spec, too vague.
7. RFC 2119 constraints (MUST/SHOULD/MAY); every MUST NOT carries a "because" rationale.

**Strong** (per source):
- taches: Router pattern; XML discipline; progressive disclosure; degrees-of-freedom ↔ fragility framing; complete structural spec with validation checklist.
- context-engineering: Canonical template; 8 authoring rules; "include a Gotchas section" rule; "challenge each paragraph for token cost."
- strands-agent-sop: RFC 2119 convention; negative-constraint-with-context rule; parameter-acquisition block.
- ai-engineering-sop: Promote-when (5 conditions) + skip-when (4 conditions) decision gate.
- anthropic-skills: Grader (claim-extraction), comparator (blind A/B), analyzer (instruction-following score) as eval sub-agents.
- mattpocock-skills: 100-line body limit; "description is the only thing your agent sees" insight.
- dotagents: "Output Is Interface" principle; Scope Laddering; anti-patterns block.

**Strip** (consolidated): Platform-specific script paths; Codex branding; Python viewer scripts; Cursor XML wrapper.

**Output form**: skill (skill-create)

---

## mcp-building

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| anthropic-skills | `skills/mcp-builder/SKILL.md` + references | partial |
| awesome-codex-skills | `mcp-builder/SKILL.md` + references | partial |
| taches | `skills/create-mcp-servers/SKILL.md` + references | partial |
| awesome-subagents | `categories/06-developer-experience/mcp-developer.md` | partial |

**Trigger** (consolidated): Building MCP servers (Python FastMCP or TS SDK) for external APIs; designing agent-centric tools.

**Steps/contract** (consolidated):
1. Research & planning — study MCP protocol docs; fetch API docs exhaustively; design agent-centric tools and I/O contracts.
2. Implementation — shared utilities first; systematic tool build; `{service}_{action}_{resource}` naming.
3. Review & refine — DRY / composability / type-safety / documentation checklist.
4. Evaluations — create 10 independent, read-only, complex, verifiable QA pairs.
5. Tool design: ≤2 operations → flat; ≥3 → meta-tool discovery pattern; description as prompt, not documentation.
6. Security: OAuth tokens never passed through from clients; env secrets only; validate inputs; bind 127.0.0.1; log to stderr only.

**Strong** (per source):
- anthropic-skills: Four-phase workflow; mcp_best_practices Quick Reference (naming, pagination, transport, security, annotations); node/python implementation guides.
- awesome-codex-skills: Agent-centric design; eval framework with 13 question rules + 6 answer rules; "never run server directly in main process."
- taches: Op-count architecture rule (≤2 flat; ≥3 meta-tool discovery); response optimization; oauth-implementation patterns; 5 Rules; troubleshoot-server workflow.

**Strip** (consolidated): Language-specific Phase 2 code; `./reference/*.md` local file links; evaluation runner harness; macOS paths; `uv` preference.

**Output form**: skill (mcp-builder)

---

## context-engineering

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| context-engineering | `skills/context-fundamentals/SKILL.md` | yes |
| context-engineering | `skills/context-compression/SKILL.md` | yes |
| context-engineering | `skills/context-optimization/SKILL.md` | yes |
| context-engineering | `skills/context-degradation/SKILL.md` | yes |
| context-engineering | `skills/filesystem-context/SKILL.md` | yes |
| context-engineering | `skills/memory-systems/SKILL.md` | yes |
| context-engineering | `skills/multi-agent-patterns/SKILL.md` | partial |
| antigravity-skills | `skills/context-fundamentals/SKILL.md` | yes |
| antigravity-skills | `skills/context-compression/SKILL.md` | yes |
| antigravity-skills | `skills/context-window-management/SKILL.md` | yes |
| antigravity-skills | `skills/memory-systems/SKILL.md` | yes |

**Trigger** (consolidated): Designing agent architectures; debugging unexpected agent behaviour; optimising token costs; agent session approaching context window limit.

**Steps/contract** (consolidated):
1. Context budget: effective capacity 60–70% of window; compaction trigger at 70–80%.
2. U-curve placement: critical info at start and end, never middle.
3. Compression: choose method → trigger at 70–80% → build structured summary → merge on subsequent compression → preserve identifiers verbatim → evaluate with probes.
4. Optimization hierarchy: KV-cache first → observation masking → compaction → context partitioning.
5. Filesystem offload: persist bulky artifacts on disk; load references just-in-time.
6. Memory escalation ladder: file-system → vector store → relationship traversal → agent self-management.

**Strong** (per source):
- context-engineering: Quantitative thresholds throughout (15× multi-agent token multiplier, 70–80% compaction trigger, 40% tool-description lift, 95% variance finding); 4-mode failure taxonomy; structured summary template; probe-based eval.
- antigravity-skills: Anchored vs opaque summary; phased research/plan/implement; tiered strategies.

**Strip** (consolidated): Framework code (LangGraph/AutoGen/CrewAI); integration cross-links; SDK code bodies.

**Output form**: skill (context-engineering cluster)

---

## evaluation

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| context-engineering | `skills/evaluation/SKILL.md` | yes |
| context-engineering | `skills/advanced-evaluation/SKILL.md` | yes |
| context-engineering | `examples/llm-as-judge-skills/prompts/evaluation/direct-scoring-prompt.md` | yes |
| context-engineering | `examples/llm-as-judge-skills/prompts/evaluation/pairwise-comparison-prompt.md` | partial |
| anthropic-skills | `skills/mcp-builder/reference/evaluation.md` | partial |
| strands-agent-sop | `agent-sops/eval.sop.md` | partial |
| antigravity-skills | `skills/agent-evaluation/SKILL.md` | partial |
| taches | `skills/create-agent-skills/references/iteration-and-testing.md` | yes |

**Trigger** (consolidated): Building an evaluation framework for agents; measuring agent quality; setting up LLM-as-judge pipelines; establishing quality gates.

**Steps/contract** (consolidated):
1. Define dimensions → create rubrics → build test sets (≥50 cases).
2. Implement pipeline → establish baseline → run on changes → track over time.
3. LLM-as-judge: evidence-first chain (evidence → score → justification → improvement).
4. Bias mitigation: 2-pass position swap + consistency check for pairwise comparisons.
5. Anti-simulation red flags: identical metrics across cases; 100% success on large sets; keywords like "simulated"/"mocked"/"fake."
6. Thresholds: 0.7 general pass / 0.9 high-stakes; 0.85 warning / 0.70 critical alerts.
7. 95% variance finding: 80% tokens / ~10% tool calls / ~5% model.

**Strong** (per source):
- context-engineering: 8-step procedural framework; calibrated thresholds; ready-to-use LLM-as-judge prompt; pairwise position-swap protocol; PoLL scaling strategy.
- strands-agent-sop: Anti-simulation checklist; phase-dependency management; eval-plan/eval-report templates.
- anthropic-skills: 13 question rules + 6 answer rules for eval design; "do not let the MCP server restrict the kinds of questions you create."

**Strip** (consolidated): Strands Evals SDK class names; Bedrock defaults; Handlebars syntax; Python harness; TypeScript SDK wiring.

**Output form**: skill (agent-eval)

---

## tool-design

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| context-engineering | `skills/tool-design/SKILL.md` | yes |
| context-engineering | `skills/tool-design/references/best_practices.md` | partial |
| context-engineering | `skills/tool-design/references/architectural_reduction.md` | partial |

**Trigger** (consolidated): Designing new tools for agent systems; debugging tool-selection failures; reducing tool count; optimizing tool descriptions.

**Steps/contract** (consolidated):
1. 4-question description template: what / when / inputs / returns.
2. "Description as prompt, not documentation" — iterate using observed failure telemetry.
3. Consolidation: Vercel 17→2 benchmark; tool count limit 10–20 with research backing.
4. Three-tier danger classification: read-only / state-modifying / dangerous.

**Strong** (per source):
- context-engineering: 4-question template; consolidation principle with empirical benchmark; gotchas (description rot, over-consolidation at 8–10 params, parameter explosion).

**Strip** (consolidated): Integration cross-links; SDK code.

**Output form**: skill (tool-design)

---

## cot-gate

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| agentic-rules | `canonical-rules.md` §3 | yes |
| agentic-rules | `agent-reasoning-planning-execution.md` §2d–§2e | partial |

**Trigger** (consolidated): Agent is writing a nontrivial function or module — same trigger as any pre-code reasoning gate.

**Steps/contract** (consolidated):
1. Clarify the problem.
2. Weigh alternatives.
3. Identify edge cases.
4. State chosen plan.
5. Performance-optimization beat: bottleneck → caching/batching → cost-vs-complexity trade-off.
6. Error-handling beat: error taxonomy → exponential backoff + jitter → utility function.

**Strong** (per source):
- agentic-rules: 4-step numbered reasoning narrative; performance and error-handling extension beats absent from existing skill.

**Strip** (consolidated): HyperScaler mentions; T-shirt sizing; Graphviz DOT rule.

**Output form**: skill (cot-gate extension)

---

## self-validation

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| agentic-rules | `canonical-rules.md` §8 | yes |
| awesome-claude | `rules/break-stop.md` | yes |
| antigravity-skills | `skills/verification-before-completion/SKILL.md` | yes |

**Trigger** (consolidated): After every logical change; at task close-out; any claim of "done."

**Steps/contract** (consolidated):
1. Run check suite after each logical unit.
2. On failure: STOP, ask user — do not self-repair.
3. On predicted breakage: warn BEFORE applying; list what will break; require explicit "yes."
4. 3-question self-audit: format correct? reasoning sound? names/placeholders resolved?
5. Fail-safe declaration: rule name + reason + missing info when a rule cannot execute.

**Strong** (per source):
- awesome-claude: Proactive-warning (warn before applying a predicted breaking change); severity split (trivial auto-correct vs functional hard stop).
- antigravity-skills: "Iron law: fresh command output and evidence before satisfaction claims."

**Strip** (consolidated): Russian confirmation examples; emoji art.

**Output form**: rule (self-validation)

---

## documentation-workflow

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| anthropic-skills | `skills/doc-coauthoring/SKILL.md` | yes |
| citypaul-dotfiles | `claude/.claude/agents/docs-guardian.md` | yes |
| citypaul-dotfiles | `claude/.claude/agents/adr.md` | yes |
| citypaul-dotfiles | `claude/.claude/agents/learn.md` | yes |
| dotagents | `agents/engineering/technical-writer.md` | yes |
| mattpocock-skills | `edit-article/SKILL.md` | yes |
| gstack | `document-release/SKILL.md` | partial |
| strands-agent-sop | `agent-sops/codebase-summary.sop.md` | partial |

**Trigger** (consolidated): Writing docs, proposals, specs, design docs; reviewing documentation quality; capturing knowledge; authoring ADRs; editing articles.

**Steps/contract** (consolidated):
1. Doc co-authoring: Stage 1 context (meta-questions, dump, clarifiers) → Stage 2 structure (scaffold, brainstorm→curate→draft→refine) → Stage 3 reader testing (fresh context).
2. Docs quality: 7 Pillars (Clarity, Completeness, Accuracy, Navigability, Progressiveness, Consistency, Maintainability); progressive-disclosure layer model.
3. ADR: 5-question "should I create?" framework (3+ YES → create); standard template; retroactive ADR convention.
4. Knowledge capture: significance rubric (document if ANY of 7 conditions); 5-scenario response library.
5. Article editing: DAG-ordering heuristic; ≤240 chars/paragraph.
6. Documentation sync: CHANGELOG non-clobber rule; VERSION coverage check; "preserve manually-maintained sections" on refresh.

**Strong** (per source):
- anthropic-skills: Reader-testing stage; brainstorm→curate loop.
- citypaul-dotfiles: 7 Pillars + progressive-disclosure; 5-question ADR framework with retroactive convention; knowledge-capture significance rubric.
- dotagents: 6 document-type templates (API ref, migration guide, ADR, README, changelog, runbook); "audience first — name the reader."
- gstack: CHANGELOG non-clobber rule (Edit not Write; never regenerate); VERSION coverage check.
- strands-agent-sop: Anti-pattern constraints (no volatile metrics, no fabricated acronyms, no common build commands, preserve manually-maintained sections).

**Strip** (consolidated): Slack/Teams integrations; Garry Tan persona; Kiro IDE commands.

**Output form**: skill (doc-coauthor / adr)

---

## orchestration-dispatch

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| agentic-rules | `Agent-Personas.md` (collaboration patterns) | partial |
| antigravity-skills | `skills/dispatching-parallel-agents/SKILL.md` | partial |
| antigravity-skills | `skills/multi-agent-patterns/SKILL.md` | yes |
| context-engineering | `skills/multi-agent-patterns/SKILL.md` | partial |
| dotagents | `agents/engineering/orchestrator.md` | yes |
| taches | `skills/create-subagents/SKILL.md` + references | partial |
| wshobson-agents | `plugins/agent-teams/skills/team-composition-patterns/SKILL.md` | yes |
| wshobson-agents | `plugins/agent-teams/skills/task-coordination-strategies/SKILL.md` | yes |

**Trigger** (consolidated): Orchestrator needs to break complex task into specialist sub-calls; choosing between orchestration patterns; coordinating sub-agents.

**Steps/contract** (consolidated):
1. Classify Route (single specialist) vs Orchestrate (multi-specialist).
2. Pattern selection: Sequential (Plan→Implement→Security→Docs) / Parallel (simultaneous independent specialists) / Iterative (Implement→Review→Refine→Re-test).
3. Smallest team that covers the dimensions; one coordinator/lead when multiple agents.
4. One owner per file; shared boundaries into read-only contract files.
5. "Never edit code yourself" (orchestrator); one concern per specialist.
6. Verifier pass required after each wave.
7. "Change inputs or change specialist, never retry blindly" on failure.

**Strong** (per source):
- dotagents: Route-vs-orchestrate triage; Wave Plan template; "never edit code yourself"; Common Workflow Patterns.
- context-engineering: 15× token cost benchmark; sycophantic consensus gotcha; over-decomposition warning; telephone game mitigation.
- wshobson-agents: Sizing heuristic; "broadcast sparingly"; plan-approval and graceful-shutdown flows.
- taches: Black-box model; least-privilege; 5 orchestration patterns with decision tree; "most agent failures are context failures."

**Strip** (consolidated): Named specialist file paths; framework code (LangGraph/AutoGen); `Task(...)` syntax; JSON communication protocol blocks.

**Output form**: skill (orchestration-dispatch) or subagent prompt

---

## workspace-bootstrap

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| agentic-rules | `docs/LLM_PROJECT_SETUP_PROMPT.md` | partial |
| ai-engineering-sop | `ai/doc/guides/new-project-sop.md` | yes |
| citypaul-dotfiles | `claude/.claude/commands/setup.md` | partial |

**Trigger** (consolidated): Session starts without a clear spec; beginning a new project or imposing structure on an existing one; centralized LLM config management.

**Steps/contract** (consolidated):
1. Establish current phase (must achieve / will not do / first reviewable slice).
2. Ask user for stack, not assume — "do not assume a fixed stack."
3. Create env template (double-brace `{{PLACEHOLDER}}` convention); generic-template + user-override split.
4. Create setup script: copy-and-sed contract; test for existing config before overwriting.
5. Derive task specs (shrink plan to narrow implementation contract).
6. Validate in layers: black-box default, white-box by trigger.
7. Write back stable facts only after implementation and validation.

**Strong** (per source):
- agentic-rules: 7-step SOP; double-brace template convention; setup-project.sh contract.
- ai-engineering-sop: Stack-assumption anti-heuristic; phase-aware variant decision gate.

**Strip** (consolidated): ZeroDB/AINative vars; LinkedIn OAuth; specific platform comparison tables.

**Output form**: skill (workspace-bootstrap)

---

## break-stop-guardrails

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| awesome-claude | `rules/break-stop.md` | yes |
| gstack | `careful/SKILL.md` + `careful/bin/check-careful.sh` | yes |
| gstack | `freeze/SKILL.md` + `freeze/bin/check-freeze.sh` | partial |
| mattpocock-skills | `git-guardrails-claude-code/SKILL.md` + script | yes |
| klinglt-dotfiles | `hooks/hooks.jsonon` (inline hooks) | partial |

**Trigger** (consolidated): "Be careful", "safety mode"; any destructive command; scope-lock during debugging.

**Steps/contract** (consolidated):
1. Pattern-match against protected list: `rm -r`, `DROP TABLE`, `git push --force`, `git reset --hard`, `kubectl delete`, `docker rm -f`, etc.
2. Safe-exception allowlist: `node_modules`, `.next`, `dist`, `__pycache__`, `coverage` — never block.
3. Match → warn + require override; no hard block (warn-not-block model).
4. Scope-lock: restrict edits to narrowest affected directory; trailing-slash normalization; fail-open on parse error.

**Strong** (per source):
- gstack: Comprehensive pattern list + safe-exception allowlist; `permissionDecision:"ask"` model; strongest single-file safety SOP.
- mattpocock-skills: exit-code 2 + BLOCKED output; "merge, don't overwrite" for settings.
- klinglt-dotfiles: BLOCK-with-corrective-command pattern; doc-proliferation allowlist gate; console.log belt+suspenders audit.
- awesome-claude: Proactive-warning variant; severity split (trivial auto-fix vs functional hard stop).

**Strip** (consolidated): Telemetry JSONL blocks; `~/.gstack/` paths; harness-specific tool names.

**Output form**: rule + hook (git-guardrails / careful)

---

## webapp-testing

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| anthropic-skills | `skills/webapp-testing/SKILL.md` | partial |
| awesome-codex-skills | `webapp-testing/SKILL.md` | yes |
| klinglt-dotfiles | `agents/e2e-runner.md` | partial |

**Trigger** (consolidated): Verifying or testing a local web app's frontend behavior using Playwright; E2E test generation and maintenance.

**Steps/contract** (consolidated):
1. Determine app type: static → read file; dynamic → check server state.
2. Reconnaissance: navigate, wait for `networkidle`, screenshot/inspect DOM.
3. Action: execute interactions using discovered selectors with appropriate waits.
4. E2E lifecycle: test planning by risk tier (HIGH: financial/auth; MEDIUM: search/nav; LOW: UI polish) → POM pattern → `data-testid` locators → auto-wait/retry → run 3–5 times for stability.
5. Quarantine flaky tests immediately (`test.fixme` + issue link); ≥95% pass rate; <5% flaky.
6. Always close browser on completion.

**Strong** (per source):
- anthropic-skills: `networkidle` + recon-then-action discipline.
- awesome-codex-skills: ASCII flowchart decision tree for static/dynamic branching.
- klinglt-dotfiles: 3-phase lifecycle; flakiness ❌/✅ cause/fix pairs; structured report with per-suite detail.

**Strip** (consolidated): `scripts/with_server.py` path; `examples/` directory; PMX-specific test scenarios.

**Output form**: skill (test-webapp)

---

## rules-placement

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| agentic-rules | `strict-rules-how-to.md` | yes |
| awesome-claude | `rules/meta-rules.md` | yes |
| dotagents | `rules/rule-adherence.md` | yes |

**Trigger** (consolidated): Setting up, restructuring, or auditing persistent agent rules/config files.

**Steps/contract** (consolidated):
1. Add "CRITICAL RULES — READ FIRST" section at the very top of the config file.
2. Inline rule content directly — no references to external files.
3. Format with bold text and Markdown tables for scannability.
4. One topic per file; group related files in subdirectories.
5. Universality: no real task/ticket IDs, no project-specific paths — use placeholders.
6. Propose new rule when: user corrects agent, pattern recurs 2+ sessions, non-obvious decision made.
7. Every rule in context is mandatory; no silent rule-dropping under pressure.

**Strong** (per source):
- agentic-rules: Rules survive context compression by appearing first; Forbidden list.
- awesome-claude: "User correction → rule" heuristic; one-topic-per-file governance.
- dotagents: Addresses universal LLM failure mode (silently dropping rules under pressure).

**Strip** (consolidated): Russian prose; repo-specific path examples.

**Output form**: rule (rules-placement / meta-rules)

---

## twelve-factor-audit

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| citypaul-dotfiles | `claude/.claude/agents/twelve-factor-audit.md` | yes |
| citypaul-dotfiles | `claude/.claude/skills/twelve-factor/SKILL.md` | yes |

**Trigger** (consolidated): Onboarding to a service project; assessing deployment readiness; "12-factor" or "compliance audit."

**Steps/contract** (consolidated):
1. Discover structure (ls, git log, glob for Dockerfile/.env.example/k8s configs).
2. Audit each of 12 factors using grep patterns with explicit false-positive guidance per factor.
3. Generate compliance report (✅/⚠️/❌) with factor summary table, per-factor detail with file:line citations, prioritised action plan.
4. Three response modes: full audit, quick health check (factors III/VI/IX only), single-factor deep-dive.
5. Brownfield priority order: Config → Logs → Disposability → Backing services → Stateless processes.

**Strong** (per source):
- citypaul-dotfiles: False-positive callouts per factor (e.g., don't flag `localhost` in `.env.example`); brownfield priority order with rationale; graceful-shutdown template; 7-property structured logging contract.

**Strip** (consolidated): Node.js/TS-specific patterns (move to language-adapter appendix); pi-specific tool names.

**Output form**: skill (twelve-factor-audit)

---

## ci-setup

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| dotagents | `skills/setup-ci/SKILL.md` (CI half) | yes |
| dotagents | `skills/setup-changesets/SKILL.md` | yes |
| dotagents | `skills/setup-pre-commit/SKILL.md` | yes |
| mattpocock-skills | `setup-pre-commit/SKILL.md` | yes |
| awesome-codex-skills | `gh-fix-ci/SKILL.md` | partial |

**Trigger** (consolidated): "Add CI", "GitHub Actions", "configure deployment pipelines"; "add pre-commit hooks"; "set up Husky."

**Steps/contract** (consolidated):
1. Detect project shape from lockfile/config.
2. CI: Generate `.github/workflows/ci.yml` — PR-triggered, lint/typecheck/test/build, pnpm cache on `node_modules` keyed to `pnpm-lock.yaml` hash, concurrency group with cancel-in-progress.
3. Changesets: install + init + config + release workflow.
4. Pre-commit: install husky + lint-staged + prettier; write .husky/pre-commit; verify; commit-as-smoke-test.
5. CI debugging: verify `gh auth`; resolve PR; inspect failing checks; scope non-GA as out-of-scope; approval gate before fix.

**Strong** (per source):
- dotagents: pnpm `node_modules` caching insight; non-interactive changeset authoring.
- mattpocock-skills: Husky v9 shebang-free hook; PM detection from lockfile; commit-as-smoke-test.
- awesome-codex-skills: `gh` field-drift workaround; approval gate before code change.

**Strip** (consolidated): Cloudflare Pages deploy (host-specific extension); sandbox escalation clauses.

**Output form**: skill (setup-ci / setup-pre-commit / setup-changesets)

---

## prd-create

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| dotagents | `skills/prd-create/SKILL.md` | yes |
| mattpocock-skills | `write-a-prd/SKILL.md` | yes |

**Trigger** (consolidated): "Write a PRD", "create product requirements", "plan a new feature."

**Steps/contract** (consolidated):
1. Collect detailed problem description.
2. Explore codebase.
3. Interview relentlessly (decision-tree walk, one question at a time).
4. Sketch modules (deep-module heuristic).
5. Write PRD using template; file as GitHub issue with metadata.
6. Testing Decisions as first-class section.

**Strong** (per source):
- dotagents: Deep-module definition heuristic; GitHub metadata discovery.
- mattpocock-skills: Decision-tree interview framing; deep-module sketching step; Testing Decisions section.

**Strip** (consolidated): Worktree setup block; step-permissiveness language.

**Output form**: skill (prd-create)

---

## issue-triage

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| mattpocock-skills | `triage-issue/SKILL.md` | yes |
| dotagents | `skills/prd-to-issues/SKILL.md` | yes |
| awesome-codex-skills | `support-ticket-triage/SKILL.md` | yes |

**Trigger** (consolidated): User reports a bug; wants to file an issue; "triage"; converting PRDs to implementation tickets.

**Steps/contract** (consolidated):
1. One-sentence problem; investigate immediately (max 1 clarifying question).
2. Deep codebase explore (locate, trace, root cause, tests, git history).
3. Determine fix approach; design ordered RED-GREEN TDD cycles.
4. File issue immediately (no review gate); print URL + one-line root cause.
5. "Good suggestion reads like a spec, not a diff" — no file paths or line numbers in issue bodies.
6. Tracer-bullet vertical slices with HITL/AFK classification + dependency graph.

**Strong** (per source):
- mattpocock-skills: "Reads like a spec, not a diff" durability constraint; "no file paths in issues."
- dotagents: HITL/AFK slice classification; sub-issues + blocking relationships.
- awesome-codex-skills: P0–P3 priority with justification; PII masking; multi-hypothesis under weak signal.

**Strip** (consolidated): Platform brand names; sub-agent phrasing.

**Output form**: skill (issue-triage)

---

## grill-interview

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| mattpocock-skills | `grill-me/SKILL.md` | yes |
| gstack | `office-hours/SKILL.md` | partial |

**Trigger** (consolidated): User wants to stress-test a plan; "grill me"; brainstorming before any code.

**Steps/contract** (consolidated):
1. Interview relentlessly on every aspect.
2. Walk decision-tree branch-by-branch; resolve dependencies in order.
3. Each question includes a recommended answer; one question at a time.
4. Anti-sycophancy rules; named pushback patterns; escape hatch after 2 pushbacks.
5. HARD GATE: no code, no scaffolding.

**Strong** (per source):
- mattpocock-skills: ~60 words body; highest signal-to-noise; recommended-answer requirement.
- gstack: 6 forcing questions with smart routing by product stage; anti-sycophancy rules; premises challenge; alternatives template.

**Strip** (consolidated): YC recruitment funnel (Phase 6); Garry Tan persona.

**Output form**: skill (grill-me)

---

## design-interface

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| mattpocock-skills | `design-an-interface/SKILL.md` | yes |
| mattpocock-skills | `improve-codebase-architecture/SKILL.md` | yes |

**Trigger** (consolidated): User wants to design an API, explore interface options, or says "design it twice."

**Steps/contract** (consolidated):
1. Gather requirements (5 questions).
2. Spawn ≥3 parallel sub-agents with divergent constraints (minimize / maximize / optimize / ports-adapters).
3. Each returns signature + usage example + trade-offs.
4. Compare on 4 axes; synthesize + invite cherry-pick.
5. "Don't implement — purely about interface shape."

**Strong** (per source):
- mattpocock-skills: Enforced divergent parallel design; preset constraint archetypes; "friction you encounter IS the signal."

**Strip** (consolidated): Book citation; Claude-internal Agent tool phrasing.

**Output form**: skill (design-interface)

---

## db-migrations

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| awesome-claude | `rules/arch/db/MIGRATIONS.md` | yes |
| awesome-claude | `rules/arch/db/WRITE_MODEL.md` | yes |
| awesome-claude | `rules/arch/db/VERSIONING.md` | yes |
| awesome-claude | `rules/arch/db/CONSTRAINTS.md` | yes |
| awesome-claude | `rules/arch/db/TRANSACTIONS.md` | partial |
| awesome-claude | `rules/arch/db/RETENTION.md` | yes |
| awesome-claude | `rules/arch/db/SEEDS_FIXTURES.md` | yes |
| awesome-claude | `rules/arch/db/PERFORMANCE.md` | partial |
| awesome-claude | `rules/arch/LOGS.md` | yes |
| cursor-rules | `rules/database-sql` | yes |

**Trigger** (consolidated): DB schema changes; writing migrations; auditing constraint coverage; designing write/read models.

**Steps/contract** (consolidated):
1. All schema changes via migrations only — no manual prod edits; forward-only.
2. Expand/contract lifecycle: add nullable first → deploy dual-compatible code → backfill → remove old.
3. Prohibited without special procedure: ALTER COLUMN TYPE on large tables, ADD NOT NULL without default, index without CONCURRENTLY.
4. Backfill: batched, idempotent, observable.
5. 9-field safety checklist before each migration.
6. Every aggregate root carries `version` column for optimistic locking.
7. Cross-aggregate refs are IDs only; no cascades.
8. Outbox written in same transaction as aggregate.

**Strong** (per source):
- awesome-claude: Dual-schema-version compatibility; 26 write-model rules; outbox co-transactional; domain/integration event split; aggregate-boundary FK rules; retention lifecycle.
- cursor-rules: Migration section (add-nullable-backfill-constrain + CREATE INDEX CONCURRENTLY); N+1 prevention.

**Strip** (consolidated): Russian prose (full translation required); path globs; CQRS-specific sections marked optional.

**Output form**: rule (db-migrations) or skill cluster

---

## postmortem-and-ops

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| antigravity-skills | `skills/postmortem-writing/SKILL.md` | yes |
| antigravity-skills | `skills/on-call-handoff-patterns/SKILL.md` | yes |
| awesome-subagents | `categories/03-infrastructure/devops-incident-responder.md` | yes |

**Trigger** (consolidated): Incidents; shift/incident handoff; postmortem writing.

**Steps/contract** (consolidated):
1. Templates, 5 Whys, facilitation, anti-patterns.
2. Components, templates, checklists, escalation for on-call handoff.
3. SLA defaults (MTTD/MTTA <5min, MTTR <30min, postmortem <48hr); blameless postmortem; runbook spec.

**Strong** (per source):
- antigravity-skills: Tool-agnostic prose and templates; blameless operational writing.
- awesome-subagents: Concrete SLA defaults; runbook spec.

**Strip** (consolidated): Emoji; fictional handles.

**Output form**: skill (postmortem-writing / on-call-handoff)

---

## retrospective

**Sources**:

| Repo | Source file | Portable |
| --- | --- | --- |
| gstack | `retro/SKILL.md` | partial |

**Trigger** (consolidated): "Weekly retro", "what did we ship", "engineering retrospective."

**Steps/contract** (consolidated):
1. Window parsing with midnight alignment.
2. 12 parallel git queries; metrics (commits, contributors, PRs, LOC, test ratio).
3. Session detection: 45-minute gap threshold; classify Deep/Medium/Micro; LOC/hour.
4. Hotspot analysis (top 10 most-changed files; flag churn ≥5).
5. Per-author: specific commit-anchored praise + 1 investment-framed growth area.

**Strong** (per source):
- gstack: Session-detection algorithm; investment-framing for growth areas; midnight-aligned window; per-author praise with anti-pattern ("not 'great work' — say exactly what was good").

**Strip** (consolidated): Greptile integration; telemetry; Garry Tan persona; Contributor Mode.

**Output form**: skill (retro)
