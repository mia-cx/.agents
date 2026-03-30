# gstack — Role-to-SOP Audit
**Repo**: gstack (Claude Code skills bundle)
**Audit date**: 2026-03-29
**Source**: `.plans/audits/gstack/raw-findings.md`

---

## 1. Repo Overview

gstack is a private skills-and-tooling bundle for Claude Code that ships a full software-development lifecycle via slash-commands: ideation (`/office-hours`), planning (`/plan-ceo-review`, `/plan-eng-review`, `/plan-design-review`, `/autoplan`), implementation guardrails (`/careful`, `/freeze`, `/guard`), debugging (`/investigate`), code review (`/review`, `/codex`), shipping (`/ship`, `/land-and-deploy`), QA (`/qa`, `/qa-only`, `/canary`, `/benchmark`), security (`/cso`), documentation (`/document-release`), and retrospectives (`/retro`).

The bundle is built around a proprietary `browse` binary (`~/.claude/skills/gstack/browse/dist/browse`) and a suite of companion executables under `~/.claude/skills/gstack/bin/` that handle project-slug computation, telemetry, review-log persistence, update-checks, and freeze-state management. Every skill file is a `SKILL.md.tmpl` template that a `bun run gen:skill-docs` build step compiles into a `SKILL.md` by expanding `{{PREAMBLE}}`, `{{BROWSE_SETUP}}`, `{{BASE_BRANCH_DETECT}}`, and other shared partials. The generated files contain roughly 200–400 lines of product scaffolding (update-check loop, session-touch, telemetry JSONL opt-in flow, "Boil the Lake" onboarding intro, proactive-behavior consent, contributor-mode field-report filing, and a Garry Tan / YC-partner voice persona) before the actual skill body begins.

The portable intellectual content — workflow logic, quality gates, decision rules, report schemas, checklists — is cleanly separable from this scaffolding layer. The template boundary (`{{PREAMBLE}}`) makes the extraction line unambiguous in every `.tmpl` source file. Two philosophical documents (`ETHOS.md`, parts of `CLAUDE.md`) contain org-agnostic engineering principles written with explicit portability intent. Safety hooks (`check-careful.sh`, `check-freeze.sh`) are self-contained bash scripts requiring only POSIX tools. The overall density of high-quality portable procedure is unusually high for a private tooling repo — the authors clearly iterated these workflows heavily in production and codified lessons as structured policies rather than narrative documentation.

---

## 2. Content Summary by Category

| Category | Files | Portability signal |
|---|---|---|
| **Philosophy / principles** | `ETHOS.md`, `CLAUDE.md` (principles sections) | ✅ High — no gstack deps; pure reasoning rules |
| **Safety hooks** | `careful/SKILL.md`, `check-careful.sh`, `freeze/SKILL.md`, `check-freeze.sh`, `guard/SKILL.md` | ✅ High (careful/hook); ⚠️ Partial (freeze/guard — state-path deps) |
| **Debugging** | `investigate/SKILL.md` | ✅ High — 5-phase protocol cleanly separable |
| **Code review** | `review/SKILL.md`, `codex/SKILL.md` | ✅ High (review); ❌ No (codex — binary required) |
| **Planning reviews** | `plan-ceo-review/SKILL.md`, `plan-eng-review/SKILL.md`, `plan-design-review/SKILL.md`, `autoplan/SKILL.md` | ⚠️ Partial — strong methodology; heavy preamble |
| **Ship pipeline** | `ship/SKILL.md`, `land-and-deploy/SKILL.md` | ⚠️ Partial — 50–60% portable sub-workflows; ~40% gstack binaries |
| **Security audit** | `cso/SKILL.md` | ✅ High — 14-phase methodology; preamble strips cleanly |
| **Documentation sync** | `document-release/SKILL.md` | ⚠️ Partial — strong safety rules; CHANGELOG/VERSION discipline portable |
| **QA / browser testing** | `qa/SKILL.md`, `qa-only/SKILL.md`, `canary/SKILL.md`, `browse/SKILL.md`, `benchmark/SKILL.md`, `gstack/SKILL.md` | ⚠️ Partial (qa, qa-only, canary, benchmark); ❌ No (browse, gstack — binary-coupled) |
| **Design** | `design-consultation/SKILL.md`, `design-review/SKILL.md`, `plan-design-review/SKILL.md` | ⚠️ Partial — methodology portable; browse binary required for execution |
| **Ideation / product** | `office-hours/SKILL.md` | ⚠️ Partial — forcing questions portable; YC funnel strips |
| **Deployment setup** | `setup-deploy/SKILL.md`, `land-and-deploy/SKILL.md` | ⚠️ Partial — platform-detection heuristics portable |
| **Retrospective** | `retro/SKILL.md` | ⚠️ Partial — git analysis portable; Greptile/telemetry strip |
| **Infrastructure / tooling** | `gstack-upgrade/SKILL.md`, `agents/openai.yaml`, `unfreeze/SKILL.md`, `connect-chrome/SKILL.md`, `setup-browser-cookies/SKILL.md`, `codex/SKILL.md` | ❌ No — binary deps or pure metadata |
| **Source templates** | All `*.SKILL.md.tmpl` files | Same as `.md` counterpart — no additional SOP value |

---

## 3. SOP Split — Port vs Leave Out

| File | Decision | One-line reason |
|---|---|---|
| `ETHOS.md` | **Port** | Org-agnostic engineering principles (Boil the Lake, Search Before Building); zero gstack deps |
| `CLAUDE.md` | **Port (5 embedded SOPs)** | Explicit `> Core policy: keep` annotations; commit bisection, CHANGELOG authoring, test-tier classification, generated-file merge, config-reading are all repo-agnostic |
| `careful/SKILL.md` | **Port** | Complete destructive-command guardrail; only dep is `check-careful.sh` which is itself portable |
| `careful/bin/check-careful.sh` | **Port** | Self-contained POSIX bash PreToolUse hook; only strip is telemetry JSONL block |
| `investigate/SKILL.md` | **Port** | 5-phase Iron Law debugging protocol; preamble strips at `{{PREAMBLE}}` boundary cleanly |
| `review/SKILL.md` | **Port** | Pre-landing review with plan completion audit, test coverage diagram, fix-first heuristic — all repo-agnostic |
| `cso/SKILL.md` | **Port** | 14-phase security audit; FP filtering ruleset and active-verification protocol are the strongest in the reference set |
| `document-release/SKILL.md` | **Port (partial)** | CHANGELOG non-clobber rule and VERSION coverage check are unique high-value safety rules; 9-step workflow portable after stripping |
| `ship/SKILL.md` | **Port (sub-workflows)** | Six independently extractable SOPs (test failure triage, coverage diagram, plan audit, bisectable commits, verification gate, adversarial review); full file is 50–60% portable |
| `plan-eng-review/SKILL.md` | **Port (partial)** | Step 0 scope challenge and test coverage diagram (code paths + user flows) are strongest plan-review SOPs in the set |
| `plan-ceo-review/SKILL.md` | **Port (partial)** | 4-mode framework, implementation alternatives template, temporal interrogation, 8 prime directives, Error & Rescue Map are all portable after scaffolding strip |
| `autoplan/SKILL.md` | **Port (partial)** | 6-principle auto-decision hierarchy, Mechanical vs Taste classification, pre-gate verification checklist are unique portable primitives |
| `design-consultation/SKILL.md` | **Port (partial)** | SAFE/RISK breakdown, three-layer competitive synthesis, AI slop anti-patterns list, font blacklist, DESIGN.md template are portable; browse execution optional |
| `design-review/SKILL.md` | **Port (partial)** | 10-category audit checklist with numeric thresholds, AI slop blacklist, Design Hard Rules classifier, fix-loop risk heuristic are methodology-level portable |
| `plan-design-review/SKILL.md` | **Port (partial)** | AI slop blacklist, interaction state coverage table, 0–10 gap/fix/re-rate loop, 12 cognitive patterns are portable; Codex CLI strips |
| `office-hours/SKILL.md` | **Port (partial)** | Six demand-validation forcing questions with smart routing, Hard Gate (no-code), premises challenge, alternatives template portable; Phase 6 YC funnel strips entirely |
| `retro/SKILL.md` | **Port (partial)** | Session-detection algorithm, per-author praise/growth pattern, midnight-aligned window computation portable; Greptile/telemetry/persona strip |
| `freeze/SKILL.md` | **Port (partial)** | Scope-lock concept and SOP steps portable; state-path generalization required |
| `freeze/bin/check-freeze.sh` | **Port (partial)** | Fail-open path-boundary hook pattern portable; `~/.gstack/` paths and analytics strip |
| `guard/SKILL.md` | **Port (partial)** | Hook-composition pattern (one skill, multiple PreToolUse matchers) portable; sibling-path deps must generalize |
| `canary/SKILL.md` | **Port (partial)** | Alert-on-changes-not-absolutes, transient tolerance rule (2+ checks), health report schema portable; `$B` binary strips |
| `benchmark/SKILL.md` | **Port (partial)** | JS performance API data collection approach, regression thresholds, `--diff` mode scoping, baseline-first principle portable; `$B` binary strips |
| `land-and-deploy/SKILL.md` | **Port (partial)** | First-run dry-run with config fingerprinting, pre-merge readiness report, diff-scope-adaptive canary depth, revert escape hatch portable; 40–50% gstack binary |
| `setup-deploy/SKILL.md` | **Port (partial)** | Platform-detection heuristics (file-presence probing), undetected-platform AskUserQuestion flow, `## Deploy Configuration` schema portable |
| `qa/SKILL.md` | **Port (partial)** | WTF-likelihood self-regulation, regression test protocol, diff-aware mode, health score rubric portable; `$B` binary strips |
| `qa-only/SKILL.md` | **Port (partial)** | Health score rubric, two-tier evidence model, diff-aware mode, report-only boundary portable; `$B` binary strips |
| `gstack/SKILL.md` | **Leave out** | Tightly coupled to local browse binary; workflow patterns already covered by `browse/SKILL.md` and `qa/SKILL.md` |
| `browse/SKILL.md` | **Leave out** | Every step depends on `$B` binary; after stripping, only Completion Status Protocol and human-handoff heuristic remain (both captured elsewhere) |
| `codex/SKILL.md` | **Leave out** | Requires `codex` npm binary; no executable workflow survives without it |
| `connect-chrome/SKILL.md` | **Leave out** | Entire skill is binary glue; only extractable pattern is stale-process cleanup (one paragraph) |
| `setup-browser-cookies/SKILL.md` | **Leave out** | Thin wrapper around `$B cookie-import-browser`; no portable algorithm |
| `gstack-upgrade/SKILL.md` | **Leave out** | gstack self-updater; all paths and binaries are product-specific |
| `agents/openai.yaml` | **Leave out** | 4-line display-name metadata; no procedural content |
| `unfreeze/SKILL.md` | **Leave out** | Four lines of bash deleting a state file; fold teardown into freeze SOP |
| `SKILL.md` (root bundle entry) | **Leave out (extract 2 primitives)** | Completion Status Protocol (DONE/DONE_WITH_CONCERNS/BLOCKED/NEEDS_CONTEXT + 3-strike rule) and Voice/tone style rule are extractable; everything else is binary scaffolding |
| All `*.SKILL.md.tmpl` files | **Leave out** | Identical content to generated `.md`; no additional SOP value — `.tmpl` confirms scaffold boundary at `{{PREAMBLE}}` |

---

## 4. Per-SOP Detail Table

> For every **port** or **partial** file. Files marked leave-out are omitted.

### ETHOS.md

| Field | Detail |
|---|---|
| **Source file** | `ETHOS.md` |
| **Trigger** | Agent about to cut a shortcut, defer tests, or leave edge cases; agent about to build something without checking whether a solution exists |
| **Steps / contract** | *Boil the Lake*: (1) Identify lake vs ocean scope. (2) Choose complete over 90% when LOC delta is small. (3) Recalibrate estimates using AI compression ratios (boilerplate ~100×, tests ~50×, features ~30×). (4) Treat test-deferral and "ship the shortcut" as named anti-patterns. — *Search Before Building*: (1) Layer 1: verify tried-and-true patterns, question even obvious premises. (2) Layer 2: search current best practices; treat results as input, not answer. (3) Layer 3: derive first-principles observations; prize these above all. (4) Seek the Eureka Moment: name where conventional wisdom fails this problem. |
| **Quality bar** | Both principles fully articulated with named anti-patterns and AI compression ratio table; Eureka check is explicit |
| **Strip** | "Build for Yourself" section (founder motivation); `garryslist.org` URL |
| **Notes** | "Boil the Lake" reframes completeness as cheap, directly countering agent tendency to defer quality. Three-layer knowledge model is the most well-structured research heuristic in the reference set. |

---

### CLAUDE.md — Embedded SOPs (5 extractable)

| SOP | Trigger | Steps / contract | Quality bar | Strip | Notes |
|---|---|---|---|---|---|
| **Config reading** | Agent needs project-specific commands with no hardcoded fallback | (1) Read CLAUDE.md for config. (2) If missing, AskUserQuestion. (3) Persist answer to CLAUDE.md. | Simple; idempotent | gstack-specific command names; generalize config file reference | Assumes CLAUDE.md convention; generalize to "project config file" |
| **Generated-file merge** | Repo has generated docs/files (SKILL.md, code-gen output) | (1) Resolve conflicts on source template / generator only. (2) Re-run generator. (3) Stage regenerated output. Never accept either side of a conflict on a generated file directly. | Clear 3-step rule; no judgment calls | gstack command names (`bun run gen:skill-docs`) | Prevents a class of wrong-merge bugs silently; clean invariant |
| **Commit bisection** | Any commit workflow, especially before push/PR | One logical change per commit. Separates: renames, behavior changes, test infra, template changes, generated regeneration, mechanical refactors, new features. | Named separation categories; immediately actionable | None needed | Pairs with ship/SKILL.md bisectable-commit ordering SOP |
| **CHANGELOG authoring** | Writing release notes or a changelog entry | Branch-scoped entry at ship time. Lead with user capability ("you can now…"). No internal tracking, eval infra, or jargon. Contributor notes in separate bottom section. | Voice rule is specific; anti-jargon constraint explicit | None | Aligns with document-release/SKILL.md CHANGELOG non-clobber rule |
| **Test-tier classification** | Classifying new tests or setting up CI tiering | Safety guardrails / deterministic functional → `gate` (blocks merge). Quality benchmarks / non-deterministic / external services → `periodic` (weekly cron or manual). | Two-tier binary; no ambiguous middle | gstack `eval:select` command reference | Clean decision rule; CI-framework-agnostic |

---

### careful/SKILL.md + careful/bin/check-careful.sh

| Field | Detail |
|---|---|
| **Source file** | `careful/SKILL.md`, `careful/bin/check-careful.sh` |
| **Trigger** | User says "be careful", "safety mode", "prod mode"; or agent is operating on a production or shared environment |
| **Steps / contract** | (1) On every Bash command, run pattern-match against protected list: `rm -r`, `DROP TABLE/DATABASE`, `TRUNCATE`, `git push --force`, `git reset --hard`, `git checkout .`, `git restore .`, `kubectl delete`, `docker rm -f`, `docker system prune`. (2) Apply safe-exception allowlist first: `node_modules`, `.next`, `dist`, `__pycache__`, `.cache`, `build`, `.turbo`, `coverage` — these never block. (3) If match found, emit `permissionDecision:"ask"` with reason. (4) User may override each warning; no hard block. (5) Guardrail is session-scoped. |
| **Quality bar** | Comprehensive pattern list; allowlist prevents alert fatigue; warn-not-block model is correct for developer-facing tools; fail-open on parse error |
| **Strip** | Analytics/telemetry bash block writing to `~/.gstack/analytics/skill-usage.jsonl`; `[careful]` prefix can be renamed; `bun run gen:skill-docs` reference; `${CLAUDE_SKILL_DIR}` path token |
| **Notes** | Strongest single-file safety SOP in the reference set. The safe-exception allowlist (build artifact dirs) is a rare and practical detail that prevents the failure mode of blocking every `rm -rf node_modules`. The `permissionDecision:"ask"` model (warn + override, never hard-block) is the right default posture. |

---

### investigate/SKILL.md

| Field | Detail |
|---|---|
| **Source file** | `investigate/SKILL.md` |
| **Trigger** | "debug this", "fix this bug", "why is this broken", "investigate", "root cause analysis"; agent reports errors or unexpected behavior |
| **Steps / contract** | *Phase 1 — Investigate*: Collect symptoms from errors and stack traces. Trace code path from symptom to cause. `git log --oneline -20` on affected files. Reproduce deterministically. Output explicit "Root cause hypothesis: …" statement. — *Scope Lock*: Identify narrowest affected directory; restrict edits to that subtree. — *Phase 2 — Pattern Analysis*: Match against six named patterns (race condition, nil/null propagation, state corruption, integration failure, config drift, stale cache). Check TODOS.md and git log for recurrence. — *Phase 3 — Hypothesis Testing*: Add temporary log/assertion; run reproduction. 3-strike rule: after 3 failed hypotheses, stop and AskUserQuestion with three options (continue / escalate / instrument). — *Phase 4 — Implementation*: Fix root cause, not symptom. Minimal diff. Write regression test that fails without fix and passes with it. Run full test suite. If fix touches >5 files, AskUserQuestion about blast radius. — *Phase 5 — Verification and Report*: Reproduce original scenario to confirm fix. Emit structured DEBUG REPORT: symptom / root cause / fix (file:line) / evidence / regression test / related notes / status. |
| **Quality bar** | Iron Law enforced: no fixes without root cause; 3-strike escalation; blast-radius check (>5 files → pause); regression test must fail without fix; DEBUG REPORT is a concrete deliverable |
| **Strip** | Entire preamble bash block; Voice/persona section; Scope Lock's `check-freeze.sh` binary check (keep concept, remove binary); Completion Status Protocol is portable and worth keeping; `gstack-*` binary calls |
| **Notes** | The Iron Law is the single strongest extractable principle — directly counters the agent default of applying symptomatic fixes. The pattern-analysis table (six named patterns with signatures) is immediately reusable. One of the strongest portable SOP candidates in the gstack set. |

---

### review/SKILL.md

| Field | Detail |
|---|---|
| **Source file** | `review/SKILL.md` |
| **Trigger** | "review this PR", "code review", "pre-landing review", "check my diff"; agent is about to merge |
| **Steps / contract** | (1) Base-branch detection (platform-aware cascade: `gh pr view` → `gh repo view` → `glab` → `git symbolic-ref` → `main`/`master`). (2) Diff guard: if on base branch or no diff, stop. (3) Scope drift detection: read TODOS.md + PR description + commit log; classify as CLEAN / DRIFT DETECTED / REQUIREMENTS MISSING (informational). (4) Plan completion audit: extract actionable items; cross-reference each against diff as DONE / PARTIAL / NOT DONE / CHANGED. (5) Read `review/checklist.md` (hard stop if unreadable). (6) Two-pass review — Pass 1 CRITICAL (SQL/data safety, race conditions, LLM trust boundary, enum completeness); Pass 2 INFORMATIONAL (conditional side effects, magic numbers, dead code, test gaps, performance). (7) Test coverage diagram — code paths + user flows (double-submit, navigate-away, stale session, slow network, concurrent actions); ★★★/★★/★/GAP; E2E decision matrix; IRON RULE (regression = write test immediately). (8) Fix-First: auto-apply AUTO-FIX; batch ASK items in single AskUserQuestion. (9) Doc staleness check: flag updated root `.md` files not touched. (10) Adversarial review auto-scaled by diff size: skip <50 lines; Claude subagent for 50–199; full multi-pass for 200+. |
| **Quality bar** | Plan completion audit (DONE/PARTIAL/NOT DONE/CHANGED) is novel and thorough; user-flow layer in coverage diagram addresses interaction edge cases most SOPs miss; fix-first heuristic prevents review paralysis; adversarial scaling prevents both under- and over-reviewing |
| **Strip** | Entire preamble bash block; all `gstack-*` binary calls; Greptile integration; `codex exec` calls (keep adversarial-subagent pattern, strip binary); plan-mode footer; Voice/persona section |
| **Notes** | Plan completion audit and test coverage diagram are among the strongest portable sub-workflows in the entire reference set. The adversarial challenge framing ("think like an attacker and a chaos engineer") is reusable verbatim. |

---

### cso/SKILL.md

| Field | Detail |
|---|---|
| **Source file** | `cso/SKILL.md` |
| **Trigger** | "security audit", "threat model", "pentest review", "OWASP", "find secrets", "supply chain scan"; agent is about to ship a significant feature |
| **Steps / contract** | Phases 0–14: (0) Stack detection + architecture mental model. (1) Attack surface census. (2) Secrets archaeology: git history scan for key prefixes (AKIA, sk-, ghp_, xoxb-), tracked .env files. (3) Dependency supply chain: audit tool + install-script scanning. (4) CI/CD pipeline: unpinned actions, `pull_request_target` with PR checkout, script injection via `${{ github.event.* }}`. (5) Infrastructure shadow: Dockerfiles root user/ARG secrets, wildcard IAM, privileged K8s. (6) Webhook/integration audit: routes without signature verification. (7) LLM/AI security: user input in system prompts, unsanitized LLM output as HTML, tool call validation. (8) Skill supply chain (with user permission). (9) OWASP Top 10 (A01–A10). (10) STRIDE threat model per component. (11) Data classification (RESTRICTED / CONFIDENTIAL / INTERNAL / PUBLIC). (12) FP filtering + active verification: 22 hard exclusions, 12 named precedents, confidence gate (8/10 daily, 2/10 comprehensive), parallel independent subagent verifier per finding. (13) Findings report: per-finding block (severity, confidence, VERIFIED/UNVERIFIED/TENTATIVE, exploit scenario, impact, recommendation + incident response playbook). (14) JSON report saved with trend tracking. |
| **Quality bar** | 22 hard FP exclusions + 12 named precedents is the most explicit false-positive policy in the reference set; active-verification + independent subagent verifier loop; exploit-scenario requirement per finding; confidence gate philosophy ("zero noise > zero misses") |
| **Strip** | Entire preamble bash block; Garry Tan voice persona; `gstack-*` binary calls; `.gstack/` path convention (generalize to `.security-reports/`); `gstack-telemetry-log`; Phase 8 global scan path |
| **Notes** | FP filtering ruleset (Phase 12), active-verification protocol, and findings report schema (Phase 13–14) are individually strong enough to extract as standalone policy blocks. The numbered precedents encode genuine security expertise (e.g., "#4: React/Angular are XSS-safe by default, only flag escape hatches"). |

---

### document-release/SKILL.md

| Field | Detail |
|---|---|
| **Source file** | `document-release/SKILL.md` |
| **Trigger** | After PR merges or code ships; "update the docs", "sync documentation", "post-ship docs" |
| **Steps / contract** | (1) Platform + base-branch detection. (2) Pre-flight diff analysis: classify changes as new features / changed behavior / removed / infra. (3) Per-file audit: classify update as **auto** (factual corrections from diff) vs **ask** (narrative, security model, >~10 lines). (4) Apply auto-updates (Edit tool only). (5) AskUserQuestion for risky changes (always offer C: Skip). (6) CHANGELOG voice polish: read full file first; modify wording only; never delete/reorder/regenerate entries; "sell test" ("would a user want to try that?"); use Edit with exact old_string; never Write on CHANGELOG.md. (7) Cross-doc consistency + discoverability: every `.md` reachable from README or CLAUDE.md; auto-fix factual inconsistencies; ask for narrative contradictions. (8) TODOS cleanup: mark completed items with `**Completed:** vX.Y.Z`. (9) VERSION bump: if already bumped, verify CHANGELOG entry covers all new changes; never silently absorb new work under existing bump. (10) Commit and push; stage named files only (never `git add -A`); update PR/MR body idempotently. |
| **Quality bar** | CHANGELOG non-clobber rule names a real past incident; VERSION coverage check addresses subtle failure mode; auto vs ask binary is clean and decision-triggering; discoverability check is novel |
| **Strip** | Entire preamble bash block; Garry Tan voice persona; `gh`/`glab` CLI calls (keep as optional platform integration) |
| **Notes** | CHANGELOG non-clobber rule (Edit not Write; never regenerate; names a real incident) is the single strongest specific safety rule in the reference set. The VERSION coverage check (step 9d) addresses the silent-absorption failure mode. |

---

### ship/SKILL.md — Key Sub-workflows

| Sub-workflow | Trigger | Steps / contract | Quality bar | Strip | Notes |
|---|---|---|---|---|---|
| **Test failure ownership triage** | Any test run with failures | Classify each failure: in-branch (STOP, must fix) vs pre-existing (REPO_MODE-aware: solo → fix/TODO/skip; collaborative → blame-and-assign/TODO/skip). Default to in-branch when ambiguous. | REPO_MODE distinction is novel; blame-then-assign-to-production-code-author (not test file author) is practical detail | RAILS_ENV and `bin/test-lane` specifics | Prevents the failure mode of shipping on a "pre-existing" claim that is actually in-branch |
| **Bisectable commit ordering** | Before any commit on a ship workflow | infra/migrations first → models/services + tests → controllers/views + tests → VERSION/CHANGELOG/TODOS last. Each commit independently valid (no broken imports, no forward references). | Dependency-first ordering eliminates most commit-organization mistakes | 4-digit VERSION format (generalize to semver) | Pairs with CLAUDE.md commit-bisection SOP |
| **Verification gate Iron Law** | After any code change post-test-run | If any code changed after initial test run, re-run full test suite and paste fresh output before pushing. Anti-rationalization list: "Should work now → RUN IT", "trivial change → trivial changes break production". | Anti-rationalization list is unusually explicit; "confidence is not evidence" is the correct framing | None | Directly addresses the AI failure mode of confidence-based skipping |
| **"Only stop for / Never stop for" table** | Entry to any automated ship workflow | Explicit two-column table: STOP FOR (ambiguity requiring judgment, user-facing text, destructive ops, test failures, blast radius >5 files) / NEVER STOP FOR (formatting, mechanical renames, code comments, file ordering) | Clearest automation-boundary specification in the reference set | None | Promotes verbatim into any ship SOP |

---

### plan-eng-review/SKILL.md

| Field | Detail |
|---|---|
| **Source file** | `plan-eng-review/SKILL.md` |
| **Trigger** | Plan or design doc exists and implementation is about to start; "review the architecture", "engineering review", "lock in the plan" |
| **Steps / contract** | Step 0 Scope Challenge: (1) Existing code that partially solves each sub-problem. (2) Minimum change set; flag deferrable work. (3) Complexity smell: ≥8 files or ≥2 new classes/services → scope reduction AskUserQuestion. (4) Search-before-building per architectural pattern. (5) TODOS cross-reference. (6) Completeness check (lake vs ocean). (7) Distribution pipeline check — new artifact type requires CI/CD or explicit deferral. — Sections 1–4: Architecture (dependency graph, data flow, production failure scenario per new codepath), Code Quality (DRY, error handling, debt hotspots), Test Review (codepath trace + user-flow coverage + E2E matrix + IRON RULE + coverage diagram), Performance (N+1, caching, complexity). — Outside Voice: adversarial subagent ("find logical gaps, overcomplexity, feasibility risks — no compliments"). — Required outputs: NOT in scope section, What already exists section, failure modes table, worktree parallelization strategy. |
| **Quality bar** | 8-file/2-class smell threshold is concrete; two-dimensional coverage model (code paths + user flows) is more thorough than most; one-issue-per-AskUserQuestion discipline prevents paralysis; cognitive patterns block includes source attribution |
| **Strip** | Entire preamble bash block; Garry Tan persona; `codex exec` binary (keep adversarial subagent pattern); all `gstack-*` calls; Review Readiness Dashboard; `gstack-review-log` |
| **Notes** | Step 0 scope challenge gates entry to the review — rare and valuable. Worktree parallelization strategy output (dependency table → parallel lanes → conflict flags) is not seen in any other reference skill. |

---

### plan-ceo-review/SKILL.md

| Field | Detail |
|---|---|
| **Source file** | `plan-ceo-review/SKILL.md` |
| **Trigger** | "think bigger", "expand scope", "strategy review", "is this ambitious enough"; greenfield plan (default EXPANSION), bug fix (default HOLD SCOPE), touches >15 files (suggest REDUCTION) |
| **Steps / contract** | 4-mode framework: EXPANSION / SELECTIVE EXPANSION / HOLD SCOPE / SCOPE REDUCTION with context-dependent defaults. Step 0: Premise Challenge (3 questions: right problem? most direct path? what if we do nothing?), Existing Code Leverage, Dream State Mapping (CURRENT → THIS PLAN → 12-MONTH IDEAL), Implementation Alternatives (mandatory: 2–3 approaches with APPROACH A/B/C template: effort S/M/L/XL, risk Low/Med/High, pros, cons, reuses; one minimal viable + one ideal architecture), Mode-Specific Analysis, Temporal Interrogation (Hour 1/2–3/4–5/6+ implementation decisions that need resolution now), Mode Selection. Sections 1–11: Architecture, Error & Rescue Map, Security, Data Flow & UX Edge Cases, Code Quality, Tests, Performance, Observability, Deployment, Long-Term Trajectory, Design/UX. Required outputs: Error & Rescue Registry, Failure Modes Registry (CRITICAL GAP = RESCUED=N + TEST=N + USER SEES=Silent), mandatory diagrams, NOT in scope list, Completion Summary. |
| **Quality bar** | 4-mode framework with defaults is actionable; implementation alternatives template forces comparison before proceeding; temporal interrogation surfaces ambiguities before coding; Error & Rescue Map (EXCEPTION→RESCUED?→ACTION→USER SEES) is the most explicit error-mapping template in the reference set |
| **Strip** | Entire preamble bash block; Garry Tan/YC persona (~150 lines); `codex exec` CLI; all `gstack-*` binary calls; office-hours inline invocation; CEO plan persistence to `~/.gstack/projects/`; Review Readiness Dashboard |
| **Notes** | 8 Prime Directives (zero silent failures, every error has a name, shadow paths, interaction edge cases, observability-as-scope, mandatory diagrams, deferred work must be written, optimize for 6-month future) are the strongest standalone engineering-review policy block in the reference set. Strip YC attribution from 17 cognitive patterns and present as named reasoning principles. |

---

### autoplan/SKILL.md

| Field | Detail |
|---|---|
| **Source file** | `autoplan/SKILL.md` |
| **Trigger** | "auto review", "autoplan", "run all reviews", "make the decisions for me"; plan file exists and user wants to avoid 15–30 intermediate questions |
| **Steps / contract** | (1) Capture restore point; read CLAUDE.md, git log, diff. (2) Load CEO, Design (if UI scope), Eng skill files from disk; skip preamble sections. (3) Phase 1 CEO: auto-decide via 6 principles (completeness, boil-lakes, pragmatic, DRY, explicit-over-clever, bias-toward-action); only non-auto gate is premise confirmation. (4) Phase-transition summary before Phase 2; verify required outputs written to plan file. (5) Phase 2 Design (conditional): auto-decide structural issues; mark aesthetic/taste issues as Taste Decisions. (6) Phase 3 Eng: all sections at full depth; produce ASCII dependency graph, test coverage diagram, TODOS updates. (7) Decision Audit Trail: append row (Phase / Decision / Principle / Rationale / Rejected) to plan file via Edit after each auto-decision — incremental, not accumulated. (8) Pre-gate verification: explicit per-output checklist; 2-retry cap before proceeding with warning. (9) Final Approval Gate: all taste decisions grouped by phase; options A (approve) / B (override) / C (interrogate) / D (revise, re-run affected phases, max 3 cycles) / E (reject). |
| **Quality bar** | 6-principle hierarchy with per-phase conflict resolution is the most explicit auto-decision policy in the reference set; pre-gate verification checklist with retry cap prevents silent incomplete phases; decision audit trail is incremental (Edit, not accumulated context) |
| **Strip** | Entire preamble bash block; Garry Tan persona; `codex exec` CLI; all `gstack-*` binary calls; restore-point binary; `~/.gstack/` paths; PPID/session tracking |
| **Notes** | "Full depth means full depth — fewer than 3 sentences for any review section → you are compressing" is a strong anti-shortcut guardrail. The per-phase conflict-resolution map (completeness+boil-lakes dominate CEO; explicit+pragmatic dominate Eng; explicit+completeness dominate Design) is a sophisticated refinement not seen elsewhere. |

---

### design-consultation/SKILL.md

| Field | Detail |
|---|---|
| **Source file** | `design-consultation/SKILL.md` |
| **Trigger** | "create a design system", "brand guidelines", "create DESIGN.md"; new project UI with no existing DESIGN.md; visual decisions being made without a design source of truth |
| **Steps / contract** | Phase 0: Pre-checks (existing DESIGN.md, product context). Phase 1: Product context AskUserQuestion (identity, user type, industry, project type, competitive research preference). Phase 2: Research (WebSearch 5–10 peers; three-layer synthesis: (1) category table-stakes, (2) current trends, (3) first-principles + Eureka check). Phase 3: Complete proposal — all 7 dimensions (aesthetic, decoration, layout, color, typography, spacing, motion) with rationale; mandatory SAFE/RISK breakdown: 2–3 category-baseline choices (why play safe) + 2–3 deliberate departures (gain, risk). Phase 4: Drill-downs with coherence re-check after each override. Phase 5: Self-contained HTML preview (loads fonts, dogfoods palette, shows specimens, renders product mockups by type, light/dark toggle). Phase 6: Write DESIGN.md + append design-system guard to CLAUDE.md. |
| **Quality bar** | SAFE/RISK breakdown frames creative risk as required structured output; AI slop anti-patterns list names specific failure modes; font blacklist has hard vs soft tiers; coherence validation fires on every override |
| **Strip** | Entire preamble bash block; Garry Tan persona; `$B` binary (WebSearch + built-in fallback is sufficient baseline); `codex exec` outside voices (keep concept, strip binary); all `gstack-*` calls |
| **Notes** | CLAUDE.md guard injection ("always read DESIGN.md before any visual decision") is a smart enforcement pattern for making design systems durable across future sessions — portable as a general "load standing constraints into session config" SOP. |

---

### design-review/SKILL.md

| Field | Detail |
|---|---|
| **Source file** | `design-review/SKILL.md` |
| **Trigger** | "audit the design", "visual QA", "check if it looks good", "design polish"; branch touches frontend files |
| **Steps / contract** | (1) Establish scope; load DESIGN.md. (2) First Impression: full-page screenshot → structured critique ("I notice…", "First 3 eye targets:", "One word:"). (3) Design System Extraction via browser JS; flag >3 font families, >12 non-gray colors, non-scale spacing. (4) Page-by-Page Audit: 10-category checklist (Visual Hierarchy, Typography, Color & Contrast, Spacing & Layout, Interaction States, Responsive, Motion, Content/Microcopy, AI Slop Detection, Performance as Design); each finding rated high/medium/polish. (5) Interaction Flow Review: 2–3 key user flows. (6) Cross-Page Consistency. (7) Compile Report: dual headline scores (Design Score + AI Slop Score); per-category A–F grades. (8) Triage: sort by impact. (9) Fix Loop: one commit per fix, CSS-first; risk heuristic (+0% CSS-only, +5% JSX/TSX per file, +15% per revert, +20% unrelated files); pause at >20%; hard cap of 30 fixes. (10) Final Audit. (11) Final Report + TODOS sync. |
| **Quality bar** | 10-category checklist with numeric thresholds (44px touch targets, 16px body min, 45–75 chars line measure, LCP <2.0s); AI slop blacklist names 10 specific patterns; Design Hard Rules classifier (MARKETING / APP UI / HYBRID); quantified fix-loop risk heuristic is unique |
| **Strip** | Entire preamble bash block; Garry Tan persona; all `$B` command references (replace with tool-agnostic language); test framework bootstrap (Phases B2–B8); all `gstack-*` calls |
| **Notes** | AI Slop blacklist ("3-column feature grid: icon-in-colored-circle + bold title + 2-line description repeated 3×") is the most specific and actionable design anti-pattern catalogue in the reference set. |

---

### plan-design-review/SKILL.md

| Field | Detail |
|---|---|
| **Source file** | `plan-design-review/SKILL.md` |
| **Trigger** | Any plan with UI/UX scope before implementation starts; "review the design plan", "design critique" |
| **Steps / contract** | Pre-review system audit; Step 0: Scope Assessment (0–10 completeness rating, DESIGN.md status, existing design leverage, AskUserQuestion to confirm focus). 7 passes: (1) Information Architecture (ASCII hierarchy diagram + navigation flow), (2) Interaction State Coverage (FEATURE × LOADING/EMPTY/ERROR/SUCCESS/PARTIAL table; each cell describes what user *sees*), (3) User Journey & Emotional Arc (storyboard + 3 time-horizon design), (4) AI Slop Risk (classify MARKETING/APP UI/HYBRID; apply 10-pattern blacklist; replace vague descriptions with specific alternatives), (5) Design System Alignment (annotate with DESIGN.md tokens), (6) Responsive & Accessibility (per-viewport layout specs, 44px touch, ARIA), (7) Unresolved Design Decisions (DECISION NEEDED / IF DEFERRED WHAT HAPPENS table). Each pass: rate → fix to 10 → re-rate → AskUserQuestion only on genuine choices. |
| **Quality bar** | Interaction State Coverage table forces state completeness at plan stage; 0–10 gap/fix/re-rate loop prevents rubber-stamping; "obvious fix → state and apply without a question" escape hatch prevents over-stopping; Completion Summary tracks decisions deferred |
| **Strip** | Entire preamble bash block; Garry Tan persona; `codex exec` CLI (keep Claude subagent adversarial); all `gstack-*` calls; Review Readiness Dashboard |
| **Notes** | The 12 Design Cognitive Patterns + 9 Design Principles with source attribution (Rams, Norman, Nielsen, Gestalt, Ira Glass) are translated into actionable reviewer instincts rather than aspirational theory — unusually practical. |

---

### office-hours/SKILL.md

| Field | Detail |
|---|---|
| **Source file** | `office-hours/SKILL.md` |
| **Trigger** | "brainstorm this", "I have an idea", "help me think through this"; before any code is written |
| **Steps / contract** | Phase 1: Context gathering; determine Startup or Builder mode. Phase 2A (Startup): 6 forcing questions ONE AT A TIME with smart routing by product stage: Q1 Demand Reality (behavior not interest), Q2 Status Quo (concrete workaround + cost), Q3 Desperate Specificity (name actual person + consequences), Q4 Narrowest Wedge (smallest payable version this week), Q5 Observation (watched someone use it, specific surprise), Q6 Future-Fit (thesis for 3 years from now). Anti-sycophancy rules; 5 named pushback patterns; escape hatch after 2 pushbacks. Phase 2B (Builder): 5 generative questions; enthusiastic posture. Phase 2.75: 3-layer landscape synthesis. Phase 3: Premise Challenge (right problem? do nothing? existing code? distribution?). Phase 4: Alternatives Generation (mandatory 2–3 approaches; always includes minimal viable + ideal architecture). Phase 5: Design doc. HARD GATE throughout: no code, no scaffolding. |
| **Quality bar** | Smart routing by product stage prevents irrelevant questions; anti-sycophancy rules and named pushback patterns are unusually explicit; Hard Gate ("no code") is a rare clean boundary; "What I noticed about how you think" closing rule (quote their words, never characterize) produces mentor-quality output |
| **Strip** | Entire preamble bash block; Garry Tan voice; Phase 4.5 Founder Signal Synthesis; Phase 6 (YC recruitment funnel, tier-selection, Garry's Personal Plea) entirely; all `gstack-*` calls; design doc storage path (`~/.gstack/projects/`) |
| **Notes** | The 6 forcing questions with smart routing are the most structured demand-validation framework in the reference set. The Hard Gate is easily portable as a one-line rule prepended to any ideation SOP. |

---

### retro/SKILL.md

| Field | Detail |
|---|---|
| **Source file** | `retro/SKILL.md` |
| **Trigger** | "weekly retro", "what did we ship", "engineering retrospective", "retro [window]"; end of sprint or work week |
| **Steps / contract** | (1) Window parsing with midnight alignment (`--since="YYYY-MM-DDT00:00:00"`; prevents off-by-hours bug). (2) Base-branch detection. (3) Raw data gather: 12 parallel git queries. (4) Metrics computation: commits, contributors, PRs, LOC, test ratio, active days, sessions, LOC/session-hour. (5) Commit time histogram (hourly, local timezone; flag bimodal/late-night patterns). (6) Session detection: 45-minute gap threshold; classify Deep (50+ min) / Medium (20–50 min) / Micro (<20 min); LOC/hour. (7) Commit type breakdown (conventional prefix percentages; fix ratio >50% = review-gap signal). (8) Hotspot analysis (top 10 most-changed files; flag churn ≥5). (9) PR size bucketing. (10) Focus score + Ship of the Week. (11) Per-author breakdown: commits/LOC, top areas, test discipline, biggest ship; specific commit-anchored praise + 1 investment-framed growth area. (12) Week-over-week trends. (13) Streak tracking. (14) JSON snapshot; (15) Narrative output. |
| **Quality bar** | Session-detection algorithm (45-min gap, three-tier classification) is the most concrete session-analysis heuristic in the reference set; per-author praise pattern has explicit anti-patterns ("not 'great work' — say exactly what was good"); midnight-aligned window is a non-obvious correctness detail |
| **Strip** | Entire preamble bash block; Greptile integration; telemetry/analytics; Garry Tan persona; Contributor Mode; Plan Completion section (binary deps); global retro discovery binary; skill usage aggregation; Eureka log |
| **Notes** | The session-detection algorithm models actual work sessions rather than daily aggregates — a meaningfully different signal. The investment-framing requirement for growth areas (not criticism) is a strong calibration detail for team retrospectives. |

---

### freeze/SKILL.md + freeze/bin/check-freeze.sh

| Field | Detail |
|---|---|
| **Source files** | `freeze/SKILL.md`, `freeze/bin/check-freeze.sh` |
| **Trigger** | "freeze", "restrict edits", "only edit this folder", "lock down edits"; agent entering a debugging session; prevent accidental scope creep |
| **Steps / contract** | (1) AskUserQuestion: which directory to restrict edits to? (2) Resolve to absolute path: `cd "<path>" && pwd`. (3) Normalize with trailing slash to prevent `/src` matching `/src-old`. (4) Save to state file. (5) Confirm to user: boundary set; how to update; how to remove. (6) On every Edit/Write: hook reads state file; if `file_path` does not start with freeze dir, emit `permissionDecision:"deny"`. (7) Fail-open: if state file absent or parse fails → `{}` (allow). |
| **Quality bar** | Trailing-slash normalization is a non-obvious correctness rule; fail-open philosophy (three separate early-exit `{}` returns before boundary check); deny message surfaces both blocked path and boundary; "not a security boundary" caveat is honest and must be preserved |
| **Strip** | `~/.gstack/` state-path (generalize to configurable or session-local path); `${CLAUDE_SKILL_DIR}/bin/check-freeze.sh` binary reference (replace with inline logic); analytics JSONL block; `bun run gen:skill-docs` reference |
| **Notes** | Most valuable as a component of the investigate/SKILL.md scope-lock step rather than standalone. The `unfreeze/SKILL.md` teardown logic should be folded into this SOP rather than promoted separately. |

---

### canary/SKILL.md

| Field | Detail |
|---|---|
| **Source file** | `canary/SKILL.md` |
| **Trigger** | "monitor deploy", "canary", "post-deploy check", "watch production"; just completed a ship/deploy workflow |
| **Steps / contract** | (1) Baseline capture (`--baseline` flag): navigate + screenshot + console errors + load time + text snapshot per page; save to manifest. (2) Page discovery: use `--pages` list or auto-discover from nav (top 5 internal links + homepage). (3) Pre-deploy snapshot if no baseline exists. (4) Monitoring loop: every 60s for 1–30 min; compare against baseline; classify by severity; alert only when anomaly persists 2+ consecutive checks (transient tolerance). (5) Alert format: time / page / type / finding / evidence (screenshot path) / baseline value / current value. AskUserQuestion: investigate / continue / rollback / dismiss. (6) Health report: per-page table (page / status / new errors / avg load) + VERDICT (HEALTHY/DEGRADED/BROKEN). (7) Baseline promotion if HEALTHY. |
| **Quality bar** | Alert-on-changes-not-absolutes prevents false positives on sites with pre-existing console noise; transient tolerance (2+ checks) prevents single-check alert spam; health report schema is immediately reusable; baseline promotion closes the lifecycle loop |
| **Strip** | Entire preamble bash block; Garry Tan persona; `$B` commands (replace with Playwright/curl equivalents); `~/.gstack/analytics/` paths; `gstack-slug` |
| **Notes** | The baseline-promotion offer (Phase 7) is a lifecycle-close detail that most monitoring SOPs omit — prevents baseline drift after healthy deploys. |

---

### benchmark/SKILL.md

| Field | Detail |
|---|---|
| **Source file** | `benchmark/SKILL.md` |
| **Trigger** | "performance", "benchmark", "page speed", "bundle size", "load time"; pre-ship gate on any PR touching frontend code |
| **Steps / contract** | (1) Setup output directories. (2) Page discovery: `--pages` list, auto-discover, or `--diff` mode (`git diff <base>...HEAD --name-only` → affected routes). (3) Data collection: JS `performance.getEntriesByType('navigation')[0]` → extract TTFB, FCP, LCP, DOM Interactive, DOM Complete, Full Load; resource entries for top-15 slowest; script/CSS bundle sizes; network summary. (4) Baseline capture to JSON. (5) Comparison: timing >50% OR >500ms absolute = REGRESSION; timing >20% = WARNING; bundle >25% = REGRESSION; bundle >10% = WARNING; request count >30% = WARNING. ASCII table with REGRESSION/WARNING/OK status per page. (6) Slowest resources ranking with recommendations (code-splitting, async/defer). (7) Performance budget check: FCP <1.8s, LCP <2.5s, JS <500KB, CSS <100KB; A–F grade. (8) Trend analysis across historical baselines. (9) Save markdown + JSON report. |
| **Quality bar** | "Baseline is essential" and "bundle size is the leading indicator" are clearly framed as foundational principles; `--diff` scoping is a CI optimization; thresholds have both relative and absolute gates for timing |
| **Strip** | Entire preamble bash block; `$B` binary (JS eval snippets are reusable verbatim in any browser automation context); `gstack-slug` (replace with `git rev-parse --short HEAD`); `.gstack/` path convention |
| **Notes** | Main gap: no CI integration step describing how to fail a build on regressions. The `--diff` scoping pattern (measure only pages touched by the current branch) is a named variant worth capturing explicitly. |

---

### land-and-deploy/SKILL.md

| Field | Detail |
|---|---|
| **Source file** | `land-and-deploy/SKILL.md` |
| **Trigger** | "merge", "land", "deploy", "land it", "ship it to production"; PR is ready and CI is green |
| **Steps / contract** | (1) Pre-flight: `gh auth status`, validate PR state. (2) First-run dry-run: detect platform from config files + GH Actions workflows; fingerprint deploy config hash; re-run automatically if hash changes on subsequent runs; teacher mode first run / efficient mode subsequent runs. (3) Pre-merge CI checks; CI polling (15-min timeout). (4) Pre-merge readiness gate: review staleness (0 commits = CURRENT / 1–3 = RECENT / 4+ = STALE + check what changed after last review); free test run; PR body accuracy vs commit log; doc-release check; build READINESS REPORT (WARNINGS/BLOCKERS); 3-option AskUserQuestion (merge / hold / merge-with-risks). (5) Merge with merge-queue support. (6) Deploy strategy detection. (7) Deploy wait: four strategies (GH Actions polling, platform CLI, auto-deploy platforms, custom hook); 20-min timeout; revert escape hatch on failure. (8) Canary verification (diff-scope-adaptive: docs=skip, config=smoke, backend=console+perf, frontend=full). (9) Deploy report. |
| **Quality bar** | Config fingerprinting prevents stale dry-run trust; review staleness metric (commits-since-review with post-review change check) is more precise than any other review-freshness SOP; revert escape hatch applied at two distinct failure points |
| **Strip** | Entire preamble bash block; Garry Tan persona; all `gstack-*` binary calls; `$B` browse references (replace with Playwright/curl); GitLab early-exit guard note; `~/.gstack/projects/` path; Codex CLI |
| **Notes** | GitHub-only limitation is explicit in the raw findings — note this in any portable version. Four-strategy deploy monitoring framework covers the realistic deployment landscape more completely than any other deploy SOP in the reference set. |

---

### setup-deploy/SKILL.md

| Field | Detail |
|---|---|
| **Source file** | `setup-deploy/SKILL.md` |
| **Trigger** | "setup deploy", "configure deployment", no deploy config in project config file |
| **Steps / contract** | (1) Check existing `## Deploy Configuration` section; offer Reconfigure / Edit specific field / Done. (2) Platform detection: probe for `fly.toml`, `render.yaml`, `vercel.json`/`.vercel`, `netlify.toml`, `Procfile`, `railway.json`, `.github/workflows/`. (3) Platform-specific setup per detected platform; Custom/Manual: structured AskUserQuestion (trigger method → production URL → verification approach → hooks). (4) Write `## Deploy Configuration` section to project config file (8 named fields + custom hooks subsection). (5) Live verification: curl health check; run deploy status command; non-blocking. (6) Summary. |
| **Quality bar** | Undetected-platform AskUserQuestion covers the four questions that define a complete deployment contract; idempotent config-write (check → confirm → overwrite or append); live verification is non-blocking |
| **Strip** | Entire preamble bash block; Garry Tan persona; `gstack-*` binary calls |
| **Notes** | The `## Deploy Configuration` schema (8 fields: platform, production URL, deploy workflow, deploy status command, merge method, project type, post-deploy health check, custom hooks) is immediately adoptable in any project config file. Platform-detection bash block has a quoting issue with `|| [ -d .vercel ]` — note in portable version. |

---

### qa/SKILL.md + qa-only/SKILL.md

| Field | Detail |
|---|---|
| **Source files** | `qa/SKILL.md`, `qa-only/SKILL.md` |
| **Trigger** | "qa", "test this site", "find bugs", "test and fix", "QA report only", "just report bugs", "bug audit" |
| **Steps / contract** | Diff-aware mode: `git diff main...HEAD --name-only` → affected routes → test those routes → cross-reference commit intent; fall back if no routes identified. QA loop: orient (framework detection, console scan) → explore each page (visual, interactive elements, forms, states, console after every action, mobile viewport) → document issues immediately on discovery (never batch). Health score: 8 categories with explicit weights (Functional 20%, Accessibility 15%, Console 15%, UX 15%, Links 10%, Performance 10%, Visual 10%, Content 5%); per-severity deductions (Critical −25, High −15, Medium −8, Low −3). qa-only: two-tier evidence model (interactive bugs = before+action+after screenshots+snapshot diff; static = single annotated screenshot). qa: Fix loop with WTF-likelihood self-regulation (+15% per revert, +5% per fix touching >3 files, +1% per fix beyond 15, +10% if remaining issues are Low, +20% for unrelated files; pause at >20%; hard cap 50 fixes); regression test protocol (trace codepath before writing test; must fail without fix; attribution comment; 2-min exploration cap). |
| **Quality bar** | WTF-likelihood is rare and directly addresses AI regression failure mode; regression test protocol's "fail without fix" forcing function is explicit; health score is formally specified with weights and deduction rules; "Repro is everything" rule is non-negotiable |
| **Strip** | Entire preamble bash block; Garry Tan persona; all `$B` command references; `gstack-*` calls; CDP mode detection |
| **Notes** | "Never read source code — test as a user, not a developer" is a clean discipline that prevents a common AI failure mode. "Document issues immediately, not in batches" prevents context-loss between finding and write-up. |

---

### guard/SKILL.md

| Field | Detail |
|---|---|
| **Source file** | `guard/SKILL.md` |
| **Trigger** | "guard mode", "full safety", "lock it down"; agent about to operate on production or live system |
| **Steps / contract** | (1) AskUserQuestion: which directory to restrict edits to? (2) Resolve to absolute path + trailing slash. (3) Save to state file. (4) Announce two active protections: destructive-command warnings (from careful) + edit boundary (from freeze). (5) PreToolUse hooks: Bash → check-careful.sh; Edit + Write → check-freeze.sh. |
| **Quality bar** | Single-activation composition of two orthogonal guardrails; hooks declaration (multiple PreToolUse matchers per skill) is a clean reusable pattern |
| **Strip** | `~/.gstack/` state-path; `${CLAUDE_SKILL_DIR}` path token; analytics bash block; sibling-script paths (generalize to implementation-neutral language) |
| **Notes** | Guard's unique contribution is the *hook-composition pattern*: one skill, multiple PreToolUse matchers, each invoking a different enforcement script. The freeze-dir setup flow (ask → resolve → trailing-slash → persist) is the same reusable primitive as in freeze/SKILL.md. |

---

## 5. Portability Ranking

### Tier 1 — High (port with minimal stripping)

| File | What makes it high |
|---|---|
| `ETHOS.md` | Two complete philosophical principles; zero gstack deps; drop-in as a preamble block or standing rule |
| `careful/SKILL.md` + `careful/bin/check-careful.sh` | Complete, self-contained safety SOP; only strip is telemetry block |
| `investigate/SKILL.md` | Iron Law + 5-phase protocol; `{{PREAMBLE}}` boundary makes extraction unambiguous; DEBUG REPORT template is ready to use |
| `review/SKILL.md` | Plan completion audit + test coverage diagram + fix-first heuristic; review workflow needs no gstack tooling |
| `cso/SKILL.md` | 14-phase security methodology; FP filtering ruleset; active verification protocol; findings schema |
| `CLAUDE.md` (5 SOPs) | Explicitly annotated with `> Core policy: keep`; each embedded SOP is 3–8 steps; zero project-specific vocabulary after stripping |

### Tier 2 — Medium (strong portable core; moderate stripping effort ~30%)

| File | Portable core |
|---|---|
| `document-release/SKILL.md` | CHANGELOG non-clobber + VERSION coverage check + auto/ask binary |
| `plan-eng-review/SKILL.md` | Step 0 scope challenge + two-dimensional coverage diagram + cognitive patterns block |
| `plan-ceo-review/SKILL.md` | 4-mode framework + implementation alternatives + temporal interrogation + 8 prime directives + Error & Rescue Map |
| `autoplan/SKILL.md` | 6-principle auto-decision hierarchy + Mechanical vs Taste classification + pre-gate verification checklist |
| `ship/SKILL.md` (sub-workflows) | Test failure triage + bisectable commits + verification gate Iron Law + "Only stop for" table |
| `design-consultation/SKILL.md` | SAFE/RISK breakdown + three-layer research synthesis + AI slop list + font blacklist + DESIGN.md template |
| `design-review/SKILL.md` | 10-category checklist + AI slop blacklist + Design Hard Rules classifier + fix-loop risk heuristic |
| `plan-design-review/SKILL.md` | Interaction state coverage table + 0–10 loop + AI slop blacklist + 12 cognitive patterns |
| `office-hours/SKILL.md` | 6 forcing questions + Hard Gate + premises challenge + alternatives template |

### Tier 3 — Partial (methodology portable; execution requires tool substitution ~40–60% stripping)

| File | Portable residue | Substitution needed |
|---|---|---|
| `retro/SKILL.md` | Session-detection algorithm, per-author praise/growth, streak tracking, midnight-aligned window | Greptile → any static analysis source; `~/.gstack/` → repo-relative |
| `freeze/SKILL.md` + `check-freeze.sh` | Scope-lock concept, trailing-slash normalization, fail-open hook pattern | `~/.gstack/` state paths → configurable |
| `canary/SKILL.md` | Alert-on-changes, transient tolerance, health report schema, baseline promotion | `$B` → Playwright/curl |
| `benchmark/SKILL.md` | JS performance API data, regression thresholds, `--diff` scoping, trend schema | `$B eval` → `page.evaluate()` equivalent |
| `land-and-deploy/SKILL.md` | Config fingerprinting, readiness report, diff-scope-adaptive canary, four-strategy deploy monitoring | `gstack-*` binaries, `$B`, GitLab unsupported |
| `qa/SKILL.md`, `qa-only/SKILL.md` | WTF-likelihood, regression test protocol, diff-aware mode, health score rubric | `$B` → Playwright/Puppeteer |
| `setup-deploy/SKILL.md` | Platform detection, undetected-platform AskUserQuestion, deploy config schema | `gstack-*` calls |
| `guard/SKILL.md` | Hook-composition pattern, freeze-dir setup flow | Sibling-path deps require sibling presence |

---

## 6. Cross-Cutting Protocol Primitives

Patterns that appear in 2 or more files and are worth extracting once as a canonical primitive.

### A. Completion Status Protocol (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT)

**Present in**: `SKILL.md` (root), `gstack/SKILL.md`, `browse/SKILL.md`, `investigate/SKILL.md`, `review/SKILL.md`, `cso/SKILL.md`, `ship/SKILL.md`, `land-and-deploy/SKILL.md`, `benchmark/SKILL.md`, `retro/SKILL.md`, `qa/SKILL.md`, `design-consultation/SKILL.md`, and all preamble-tier skills.

Four terminal states with a 3-strike escalation rule: attempt ≤ 3 times, then STOP and surface to user. Present in every skill with a preamble tier ≥ 2. The core protocol is clean: DONE (all criteria met), DONE_WITH_CONCERNS (completed but with notable issues), BLOCKED (cannot proceed without input), NEEDS_CONTEXT (missing information to even attempt). Promote once as a universal task-execution close-out primitive.

---

### B. Base-Branch Detection Cascade

**Present in**: `review/SKILL.md`, `ship/SKILL.md`, `land-and-deploy/SKILL.md`, `document-release/SKILL.md`, `retro/SKILL.md`, `plan-eng-review/SKILL.md`, `plan-ceo-review/SKILL.md`, and all `.tmpl` files with `{{BASE_BRANCH_DETECT}}`.

Platform-aware cascade: `gh pr view` → `gh repo view` → `glab mr view` → `glab repo view` → `git symbolic-ref refs/remotes/origin/HEAD` → hardcoded `main`/`master` fallback. Appears verbatim (injected via `{{BASE_BRANCH_DETECT}}`) across every skill that needs a diff base. Promote as a one-block standalone utility.

---

### C. Plan Completion Audit (DONE / PARTIAL / NOT DONE / CHANGED)

**Present in**: `review/SKILL.md`, `ship/SKILL.md`, `autoplan/SKILL.md`, `plan-eng-review/SKILL.md`.

Discover plan file (conversation context → content search → recency fallback). Extract actionable items (checkboxes, imperatives, file specs, test requirements). Cross-reference each against `git diff`. Classify: DONE (clearly evidenced), PARTIAL (some evidence), NOT DONE (no evidence), CHANGED (scope evolved). Conservative-DONE / generous-CHANGED calibration rule. In `ship/SKILL.md`, NOT DONE items are a hard gate; in `review/SKILL.md`, informational. The pattern is identical across files; the gate strictness varies by context.

---

### D. Test Coverage Diagram (Code Paths + User Flows)

**Present in**: `review/SKILL.md`, `ship/SKILL.md`, `plan-eng-review/SKILL.md`, `qa/SKILL.md`.

Trace every changed code path AND every user interaction flow (double-submit, navigate-away, stale session, slow network, concurrent actions). Classify each branch as ★★★/★★/★/GAP. Apply E2E decision matrix (3+-component common flows → E2E; critical LLM calls → EVAL; pure functions → unit). IRON RULE: regression = write test immediately, no AskUserQuestion. The diagram structure and user-flow list are identical across files; promote as a canonical sub-workflow.

---

### E. Diff-Size-Scaled Adversarial Review

**Present in**: `review/SKILL.md`, `ship/SKILL.md`, `autoplan/SKILL.md`, `plan-eng-review/SKILL.md`.

Skip < 50 lines. Claude adversarial subagent for 50–199 lines. Full multi-pass (Claude structured + Claude adversarial + optional Codex structured + Codex adversarial) for 200+ lines. Synthesize cross-model findings with confidence weighting. Adversarial prompt: "think like an attacker and a chaos engineer — find logical gaps, overcomplexity, feasibility risks — no compliments." Strip Codex binary; keep Claude adversarial subagent pattern.

---

### F. Fix-First Heuristic (AUTO-FIX / ASK binary)

**Present in**: `review/SKILL.md`, `ship/SKILL.md`, `design-review/SKILL.md`.

One binary classification per finding: AUTO-FIX (mechanical, one clearly correct answer — apply silently) vs ASK (reasonable people could disagree — surface in a single batched AskUserQuestion). Never commit or push inline fixes — that belongs to a separate ship step. In `design-review/SKILL.md`, the heuristic adds a quantified risk meter (+0% CSS-only, +5%/JSX file, +15%/revert, +20% unrelated files) with a pause threshold and hard cap.

---

### G. AI Slop Anti-Pattern Blacklist

**Present in**: `design-consultation/SKILL.md`, `design-review/SKILL.md`, `plan-design-review/SKILL.md`, `plan-ceo-review/SKILL.md`.

10 named patterns: 3-column feature grid (icon-in-colored-circle + bold title + 2-line description), purple/violet gradients, centered everything, uniform bubbly border-radius, blob/wavy dividers, gradient CTAs, emoji as design elements, colored left-border cards, generic hero copy, cookie-cutter section rhythm. Applied with a MARKETING / APP UI / HYBRID classifier. Present across four files with identical content injected via `{{DESIGN_HARD_RULES}}` template partial. Promote as a standalone design quality checklist.

---

### H. Fail-Open Hook Convention

**Present in**: `careful/bin/check-careful.sh`, `freeze/bin/check-freeze.sh`.

Both PreToolUse hooks use the same fail-open philosophy: three separate early-exit `{}` (allow) returns before the enforcement logic — on JSON parse failure, on absent config, on missing state file. "A misconfigured hook must never silently block legitimate work." This is a shared design principle worth promoting as a one-paragraph policy in any hook-authoring SOP.

---

### I. One-Issue-Per-AskUserQuestion + Escape Hatch

**Present in**: `review/SKILL.md`, `plan-eng-review/SKILL.md`, `plan-ceo-review/SKILL.md`, `plan-design-review/SKILL.md`.

Never batch multiple issues into one question. If a section has no issues, say so and move on — no formality question. If a fix is obvious (one right answer), state and apply without asking. AskUserQuestion when: genuine choice exists, or destructive action is proposed. These three rules appear together across all four review skills; they are the clearest anti-paralysis guardrails in the reference set.

---

## 7. Default Recommendation — Top Picks for Cross-Repo Comparison

These are the files that should be brought forward as the highest-value gstack contributions to the cross-repo comparison phase. Ranked within tier.

### Must-include (direct ports, highest density, cleanest extraction)

1. **`careful/SKILL.md` + `careful/bin/check-careful.sh`** — Most complete, immediately actionable safety SOP. Strongest single-file implementation of "warn before destructive" in the reference set.
2. **`investigate/SKILL.md`** — Iron Law ("no fixes without root cause") is the principle most likely to improve agent quality across any repo. DEBUG REPORT template is a concrete deliverable. Clean `{{PREAMBLE}}` extraction boundary.
3. **`review/SKILL.md`** — Plan completion audit (DONE/PARTIAL/NOT DONE/CHANGED) is novel across the reference set; test coverage diagram user-flow layer is the most thorough in this audit. Six independently extractable sub-workflows.
4. **`ETHOS.md`** — Boil the Lake and Search Before Building are org-agnostic, immediately deployable, and encode durable reasoning shifts. Cleanest portable document in the repo.
5. **`CLAUDE.md` (commit-bisection + CHANGELOG authoring)** — Two of the five embedded SOPs (commit bisection and CHANGELOG voice) are the strongest candidates; both have zero project-specific vocabulary after removing gstack command names.

### Strong-include (high value; moderate extraction effort)

6. **`cso/SKILL.md`** — 14-phase security audit with FP filtering ruleset (22 hard exclusions + 12 numbered precedents) is the most rigorous security methodology in the reference set. Phase 12 active-verification + independent subagent verifier is a rare quality-control pattern.
7. **`document-release/SKILL.md`** — CHANGELOG non-clobber rule (names a real incident; Edit not Write) and VERSION coverage check are unique safety rules not found elsewhere. The auto/ask binary (factual = auto, narrative = ask) is a clean decision rule for any doc-sync workflow.
8. **`plan-ceo-review/SKILL.md`** (8 prime directives + Error & Rescue Map + implementation alternatives) — 8 Prime Directives are the strongest standalone engineering-review policy block. Error & Rescue Map (EXCEPTION→RESCUED?→ACTION→USER SEES) is the most explicit error-mapping template in the reference set.
9. **`ship/SKILL.md`** (sub-workflows: verification gate Iron Law + "Only stop for" table + test failure triage + bisectable commit ordering) — "Only stop for / Never stop for" is the clearest automation-boundary specification in the reference set. Verification gate anti-rationalization list is reusable verbatim.
10. **`plan-eng-review/SKILL.md`** (Step 0 scope challenge + cognitive patterns) — Step 0 7-question pre-review checklist is more systematic than any comparable plan-review SOP. 15 cognitive patterns with source attribution are a compact, reusable reference.

### Include as supporting evidence (strong primitives, not full SOPs)

11. **`design-consultation/SKILL.md`** (SAFE/RISK breakdown + AI slop list + font blacklist + DESIGN.md template)
12. **`design-review/SKILL.md`** (10-category checklist with numeric thresholds + Design Hard Rules classifier)
13. **`autoplan/SKILL.md`** (6-principle auto-decision hierarchy + pre-gate verification checklist)
14. **`qa/SKILL.md`** (WTF-likelihood self-regulation + regression test protocol)
15. **`office-hours/SKILL.md`** (6 forcing questions with smart routing + Hard Gate)

---

## 8. Structural Patterns

### Template-based skill compilation
All skills are authored in `SKILL.md.tmpl` and compiled to `SKILL.md` via `bun run gen:skill-docs`. The `{{PREAMBLE}}` placeholder marks the exact boundary between gstack scaffolding and portable skill content. For extraction, the `.tmpl` is the cleaner source — strip `{{PREAMBLE}}` and the two auto-generated HTML comment lines to obtain a pure SOP. The boundary is unambiguous, which makes bulk extraction tractable.

### Tiered preamble injection
Skills declare a `preamble-tier` frontmatter field (1–4). Higher tiers add progressively more scaffolding: tier 1 is a condensed voice block; tier 4 is the full Garry Tan persona + AskUserQuestion format + Completeness Principle + Repo Ownership + Search Before Building sections (~400 lines). Every portable SOP candidate is at preamble-tier 2–4; the preamble content is in every case orthogonal to the skill logic and cleanly strippable.

### Shared-partial injection
Beyond `{{PREAMBLE}}`, skills share `{{BASE_BRANCH_DETECT}}`, `{{BROWSE_SETUP}}`, `{{TEST_COVERAGE_AUDIT_*}}`, `{{PLAN_COMPLETION_AUDIT_*}}`, `{{ADVERSARIAL_STEP}}`, `{{DESIGN_HARD_RULES}}`, `{{DESIGN_OUTSIDE_VOICES}}`, and `{{REVIEW_DASHBOARD}}` partials. This means the same protocol (e.g., test coverage diagram) exists verbatim in multiple files. Cross-file deduplication is easy: pick one canonical source file per shared pattern and note which other files also contain it.

### Ship-variant vs review-variant sub-workflows
`TEST_COVERAGE_AUDIT_SHIP` and `PLAN_COMPLETION_AUDIT_SHIP` differ from their `_REVIEW` counterparts: the ship variants add a coverage gate (min 60% / target 80%) and a hard block on NOT DONE items, respectively. The review variants are informational only. Any extracted SOP should preserve this distinction and expose the gate behavior as a configurable parameter.

### Implicit SOP layering
Several skills build directly on each other. The intended activation chain is: `office-hours` → `plan-ceo-review` + `plan-design-review` + `plan-eng-review` → `autoplan` → `ship` → `review` → `land-and-deploy` → `canary` / `benchmark`. The debugging sub-chain is: `investigate` (with `freeze` for scope lock) → `review` (if fixing a regression). The safety sub-chain is: `careful` + `freeze` → `guard`. These chains suggest that extracted SOPs should preserve references to companion procedures even when implementation details are stripped.

### TODOS.md as shared contract
`retro/SKILL.md`, `ship/SKILL.md`, `review/SKILL.md`, `qa/SKILL.md`, `plan-eng-review/SKILL.md`, `plan-ceo-review/SKILL.md`, and `document-release/SKILL.md` all read and write `TODOS.md` as a shared cross-session project memory. This is an implicit cross-cutting convention: deferred work lands in TODOS, completed items are annotated with version/date, new TODOs proposed via individual AskUserQuestion (never batched). Any portable SOP that interacts with TODOS should adopt this convention explicitly.

---

## 9. Evidence

All citations are directly traceable to `raw-findings.md` section headers and quoted text.

**[E1] Iron Law quote — `investigate/SKILL.md`**
> "The Iron Law is the single strongest extractable principle — it directly counters the agent default of applying quick symptomatic fixes." And: "no fixes without root cause investigation first."
— raw-findings.md, `## File: investigate/SKILL.md`, Notes section.

**[E2] CHANGELOG non-clobber rule — `document-release/SKILL.md`**
> "the CHANGELOG non-clobber rule ('never use Write on CHANGELOG.md; always Edit with exact old_string; never regenerate entries — a real incident caused this rule')"
— raw-findings.md, `## document-release/SKILL.md`, Reason section.

**[E3] Safe-exception allowlist — `careful/bin/check-careful.sh`**
> "The safe-exception logic uses a simple `for target in $RM_ARGS` word-split, which can misfire on paths with spaces (a known limitation). A portable SOP version should note this... The safe-exception allowlist (node_modules, .next, dist, __pycache__, .cache, build, .turbo, coverage) is a practical, considered carve-out that would recur in any similar policy."
— raw-findings.md, `## check-careful.sh`, Notes section.

**[E4] FP filtering ruleset — `cso/SKILL.md`**
> "22 named hard exclusions + 12 numbered precedents is the most explicit and actionable false-positive policy seen in this audit. The numbered precedents (e.g., '#4: React/Angular are XSS-safe by default, only flag escape hatches'; '#15 exception: SKILL.md files are not documentation, they are executable prompt code') encode genuine security expertise."
— raw-findings.md, `## cso/SKILL.md`, Notes section.

**[E5] Plan completion audit — `review/SKILL.md`**
> "Plan completion audit (DONE/PARTIAL/NOT DONE/CHANGED against diff) — novel; most review skills don't cross-reference a plan file at all. Directly answers 'did we build what we said we would?'"
— raw-findings.md, `## File: review/SKILL.md`, Notes section.

**[E6] WTF-likelihood self-regulation — `qa/SKILL.md`**
> "WTF-likelihood self-regulation (Phase 8f) — quantified heuristic for when to stop auto-fixing: +15% per revert, +5% per fix touching >3 files, +1% per fix beyond 15, +10% if all remaining issues are Low, +20% for touching unrelated files. Hard cap at 50 fixes."
— raw-findings.md, `## qa/SKILL.md`, Notes section, point 1.

**[E7] Verification gate anti-rationalization list — `ship/SKILL.md`**
> "The explicit anti-rationalization list ('Should work now → RUN IT', 'It's a trivial change → trivial changes break production') encodes a hard-to-articulate but important discipline. Reusable verbatim in any completion protocol."
— raw-findings.md, `## ship/SKILL.md`, Notes section (Verification gate Iron Law bullet).

**[E8] Fail-open philosophy — `freeze/bin/check-freeze.sh`**
> "The fail-open philosophy (three separate early-exit `{}` returns before the boundary check) is a deliberate safety choice worth preserving in any extraction — a misconfigured or absent hook should never silently block legitimate work."
— raw-findings.md, `## freeze/bin/check-freeze.sh`, Notes section.

**[E9] Temporal interrogation — `plan-ceo-review/SKILL.md`**
> "Temporal Interrogation (Step 0E) — surfacing Hour 1/2-3/4-5/6+ implementation decisions before coding starts is a novel technique not seen elsewhere in the reference set. Prevents the common failure mode where reviewers sign off on a plan whose ambiguities only surface during implementation."
— raw-findings.md, `## plan-ceo-review/SKILL.md`, Notes section, point 5.

**[E10] Session-detection algorithm — `retro/SKILL.md`**
> "The session-detection algorithm (45-minute gap, Deep/Medium/Micro classification, LOC/session-hour) — this is the most concretely specified session-analysis heuristic in the reference set. Most retro tools aggregate by day; this models *actual work sessions*, which is a meaningfully different signal."
— raw-findings.md, `## File: retro/SKILL.md`, Notes section.

**[E11] `{{PREAMBLE}}` extraction boundary — `investigate/SKILL.md.tmpl`**
> "The `{{PREAMBLE}}` placeholder is the single most useful structural signal in all four `.tmpl` files — it marks exactly where gstack machinery ends and portable SOP begins. For extraction purposes, the `.tmpl` is the cleaner source: strip `{{PREAMBLE}}` and the two auto-generated comment lines to obtain a pure portable debugging SOP."
— raw-findings.md, `## investigate/SKILL.md.tmpl`, Notes section.

**[E12] "Only stop for / Never stop for" table — `ship/SKILL.md`**
> "'Only stop for / Never stop for' decision table — the clearest automation-boundary specification seen anywhere in the reference set. Immediately answers when the workflow asks vs. proceeds. Worth promoting verbatim into any ship SOP."
— raw-findings.md, `## ship/SKILL.md`, Notes section (first bullet).
