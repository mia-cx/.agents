# Role-to-SOP Audit — klinglt-dotfiles
**Auditor**: Worker agent  
**Source**: `.plans/audits/klinglt-dotfiles/raw-findings.md` (29 files across `.references/klinglt-dotfiles/agents/`, `.references/klinglt-dotfiles/commands/`, `.references/klinglt-dotfiles/rules/`, `.references/klinglt-dotfiles/hooks/`, `.references/klinglt-dotfiles/skills/`, `.references/klinglt-dotfiles/contexts/`, `.references/klinglt-dotfiles/examples/`, `.references/klinglt-dotfiles/mcp-configs/`)  
**Date**: 2026-03-28

---

## 1. Repo Overview

This is a personal Claude Code dotfiles repository for a TypeScript/Next.js/Supabase/Solana application ("PMX" / "Zenith"). It organises Claude behaviour through eight content layers: subagent role definitions (`.references/klinglt-dotfiles/agents/`), slash-command wrappers (`.references/klinglt-dotfiles/commands/`), standing rules (`.references/klinglt-dotfiles/rules/`), tool-lifecycle hooks (`.references/klinglt-dotfiles/hooks/`), domain skills (`.references/klinglt-dotfiles/skills/`), behavioural context presets (`.references/klinglt-dotfiles/contexts/`), project-template examples (`.references/klinglt-dotfiles/examples/`), and MCP server configuration (`.references/klinglt-dotfiles/mcp-configs/`). The agent files are the highest-quality artefacts: each carries an explicit role description, procedural phases, output templates, and strip-ready project-specific scaffolding. The `.references/klinglt-dotfiles/commands/` layer is a thin documentation wrapper over the corresponding `.references/klinglt-dotfiles/agents/` file in every case. The `.references/klinglt-dotfiles/rules/` layer is a mix of standing policy (portable) and local routing tables (non-portable). Several hooks encode concrete automation disciplines (tmux enforcement, doc-proliferation blocking, console.log auditing) that are independently reusable. The project is clearly designed with reuse in mind — five of the eight agent files contain an explicit "Project-Specific Guidelines" or "Project-Specific Rules" section labelled as an extension point, confirming intentional separation of portable core from local scaffolding.

---

## 2. Content Summary

| Layer | File count | Dominant content type | Portable core share |
|---|---|---|---|
| `.references/klinglt-dotfiles/agents/` | 9 | Subagent role definitions with phases, output templates, strip zones | High (60–90 % per file) |
| `.references/klinglt-dotfiles/commands/` | 10 | Slash-command docs delegating to `.references/klinglt-dotfiles/agents/` or repeating subsets | Low–partial (wrappers + occasional unique rules) |
| `.references/klinglt-dotfiles/rules/` | 8 | Standing policy cards and orchestration routing tables | Mixed (policy rules portable; routing tables not) |
| `.references/klinglt-dotfiles/hooks/` | 7 | `.references/klinglt-dotfiles/hooks/hooks.jsonon` + shell scripts for lifecycle automation | Partial (inline hooks portable; external-script hooks not standalone) |
| `.references/klinglt-dotfiles/skills/` | 8 | Domain reference catalogs and workflow SOPs | Low–partial (catalogs have no agentic shape; 2 skills are portable workflows) |
| `.references/klinglt-dotfiles/contexts/` | 3 | Behavioural mode-switch briefs (research / dev / review) | Partial (rules portable as preamble blocks; too thin as standalone SOPs) |
| `.references/klinglt-dotfiles/examples/` | 1 | Project-level CLAUDE.md template | Low (declarative rules, no workflow) |
| `.references/klinglt-dotfiles/mcp-configs/` | 1 | MCP server catalog JSON with governance rules | Low (2 governance rules portable; list is personal selection) |

---

## 3. SOP Split — Port vs. Leave Out

### PORT (promote or merge into skills tree)

| # | File | Disposition | Reason |
|---|---|---|---|
| 1 | `.references/klinglt-dotfiles/agents/build-error-resolver.md` | Promote as `build-error-fix` skill | Minimal-diff strategy, priority tiers, structured report format are complete and stack-agnostic after stripping TS/Next.js examples |
| 2 | `.references/klinglt-dotfiles/agents/code-reviewer.md` | Promote as `code-review` skill | Severity-tiered checklist + verdict system + per-issue output template are language-agnostic; strongest review SOP in repo |
| 3 | `.references/klinglt-dotfiles/agents/architect.md` | Promote as `architecture-review` skill | 4-phase review loop + ADR template + red-flags anti-pattern list are fully portable; strip only the "Project-Specific Architecture" filler section |
| 4 | `.references/klinglt-dotfiles/agents/doc-updater.md` | Promote as `doc-sync` skill | Codemap schema, multi-phase workflow, quality checklist, and maintenance cadence are portable; strip TS toolchain and domain-specific codemap content |
| 5 | `.references/klinglt-dotfiles/agents/planner.md` | Promote as `plan` skill (or merge into `prd-to-plan`) | 4-phase planning process, structured plan template with per-step Why/Dependencies/Risk, and Red Flags checklist are immediately portable; unique confirmation-gate rule from `.references/klinglt-dotfiles/commands/plan.md` should be merged in |
| 6 | `.references/klinglt-dotfiles/agents/security-reviewer.md` | Promote as `security-review` skill | OWASP Top 10 loop + 10-pattern vulnerability catalog + tiered report format + emergency-response procedure are highly portable; strip only the Solana/Privy/Supabase illustrative section (~20 %) |
| 7 | `.references/klinglt-dotfiles/agents/tdd-guide.md` | Merge into existing `tdd` skill | 8-category edge-case checklist, "Test Smells" ❌/✅ anti-pattern block, and explicit 4-axis 80 % coverage threshold are the delta over existing skill |
| 8 | `.references/klinglt-dotfiles/agents/e2e-runner.md` | Promote as `e2e-testing` skill | 3-phase lifecycle + flakiness ❌/✅ cause/fix pairs + structured report template are portable; strip "PMX-Specific Critical Flows" and domain test scenarios |
| 9 | `.references/klinglt-dotfiles/agents/refactor-cleaner.md` | Promote as `dead-code-cleanup` skill | SAFE/CAREFUL/RISKY risk-tier model + deletion-log template + "When NOT to Use" guard conditions are portable; strip Privy/Solana/Supabase NEVER-REMOVE list entirely |
| 10 | `.references/klinglt-dotfiles/commands/learn.md` | Merge into `skill-create` skill | 4-category extraction taxonomy + "confirm before saving" human-in-the-loop gate are the unique portable additions not in current `skill-create` |
| 11 | `.references/klinglt-dotfiles/hooks/hooks.jsonon` (inline hooks only) | Promote as `hooks-guardrails` SOP / reference | tmux-enforcement BLOCK pattern, doc-proliferation allowlist gate, console.log belt+suspenders audit (PostToolUse + Stop), PR URL extraction pattern are all self-contained and portable |
| 12 | `.references/klinglt-dotfiles/hooks/strategic-compact/suggest-compact.sh` | Promote as `strategic-compact` hook SOP | Counter-plus-threshold compaction advisory + "compact at phase boundaries" rationale are portable and directly implementable |
| 13 | `.references/klinglt-dotfiles/rules/security.md` | Merge into security-review skill | 8-item pre-commit checklist framing ("Before ANY commit") + "rotate exposed credentials" response step are the unique additions over `.references/klinglt-dotfiles/agents/security-reviewer.md` |
| 14 | `.references/klinglt-dotfiles/rules/git-workflow.md` | Merge into `gc` or `git-workflow` skill | Conventional commits + PR-creation checklist (full-history diff, test-plan TODOs) are portable; strip named-agent references |
| 15 | `.references/klinglt-dotfiles/skills/security-review/SKILL.md` | Merge into security-review skill | Pre-deployment 17-point checklist is the most portable artefact; overlaps with `.references/klinglt-dotfiles/agents/security-reviewer.md` but is narrower (change-scoped vs. whole-codebase) — keep as a supplemental gate |

### LEAVE OUT or DELTA-MERGE ONLY

| # | File | Disposition | Reason |
|---|---|---|---|
| 16 | `.references/klinglt-dotfiles/commands/build-fix.md` | Merge 2 rules into #1 | Skeleton of `.references/klinglt-dotfiles/agents/build-error-resolver.md`; unique: "one error at a time" note and 3-attempt stopping condition |
| 17 | `.references/klinglt-dotfiles/commands/code-review.md` | Skip | Duplicate of `.references/klinglt-dotfiles/agents/code-reviewer.md` with weaker structure; JS-biased checklist items |
| 18 | `.references/klinglt-dotfiles/commands/e2e.md` | Merge DO/DON'T list into #8 | Thin wrapper over `.references/klinglt-dotfiles/agents/e2e-runner.md`; unique: "never run state-mutating tests against production" rule and `playwright codegen` tip |
| 19 | `.references/klinglt-dotfiles/commands/refactor-clean.md` | Merge tier examples into #9 | Skeleton of `.references/klinglt-dotfiles/agents/refactor-cleaner.md`; CAUTION category examples add one concrete tier-boundary illustration |
| 20 | `.references/klinglt-dotfiles/commands/plan.md` | Merge confirmation gate into #5 | Thin wrapper; unique: hard "MUST wait for confirmation" gate and modification-request syntax (`modify:` / `different approach:` / `skip phase N`) |
| 21 | `.references/klinglt-dotfiles/commands/tdd.md` | Merge coverage table into #7 | Thin wrapper; unique: tiered coverage table (80 % floor / 100 % ceiling for financial/auth/security/core paths) and "write test reproducing bug first" rule |
| 22 | `.references/klinglt-dotfiles/commands/test-coverage.md` | Merge scan loop into #7 | Thin wrapper; unique: coverage-scan-then-generate entry point and before/after metrics reporting step |
| 23 | `.references/klinglt-dotfiles/commands/update-codemaps.md` | Merge 2 rules into #4 | Thin wrapper; unique: "token-lean" framing and 30 %-diff approval gate |
| 24 | `.references/klinglt-dotfiles/commands/update-docs.md` | Merge RUNBOOK schema + staleness threshold into #4 | Thin wrapper; unique: 4-section RUNBOOK.md schema + 90-day staleness age gate |
| 25 | `.references/klinglt-dotfiles/rules/agents.md` | Merge 2 principles into `prd-to-plan` or orchestration skill | Routing table is non-portable; unique portable content: parallel-execution GOOD/BAD example and 5-role multi-perspective analysis pattern |
| 26 | `.references/klinglt-dotfiles/rules/patterns.md` | Partial — merge skeleton-eval pattern | Code-pattern sections are TS boilerplate; unique portable: 4-dimension parallel evaluation for skeleton/template selection |
| 27 | `.references/klinglt-dotfiles/rules/coding-style.md` | Merge 3 rules into code-review skill | Style axioms not a SOP; unique portable: immutability as CRITICAL rule, schema-based input validation rule, "feature/domain not type" organisation heuristic |
| 28 | `.references/klinglt-dotfiles/rules/hooks.md` | Merge 2 rules | Personal config inventory; unique portable: hook lifecycle taxonomy + "never use `dangerously-skip-permissions`" rule |
| 29 | `.references/klinglt-dotfiles/rules/performance.md` | Merge 1 rule into orchestration skill | Perishable model routing; unique portable: context-window avoidance rule with 80 %-consumed threshold |
| 30 | `.references/klinglt-dotfiles/rules/testing.md` | Merge 1 rule into #7 | Strict subset of `.references/klinglt-dotfiles/agents/tdd-guide.md`; unique: "fix implementation, not tests" troubleshooting heuristic |
| 31 | `.references/klinglt-dotfiles/skills/backend-patterns.md` | Skip as SOP; extract 4 rules | Reference catalog with no agentic shape; unique portable rules: N+1 prevention, retry-with-backoff skeleton, 3-branch error taxonomy, structured-logging schema |
| 32 | `.references/klinglt-dotfiles/skills/frontend-patterns.md` | Partial — merge accessibility section | React reference catalog; unique portable: compound-components pattern + accessibility/focus-management section (ARIA roles, keyboard nav, focus save/restore) |
| 33 | `.references/klinglt-dotfiles/skills/clickhouse-io.md` | Promote as `clickhouse` domain reference | Portable within ClickHouse ecosystem; strip domain field names; retain ✅/❌ query-optimisation pairs, 5-point best-practices checklist, and engine-selection examples |
| 34 | `.references/klinglt-dotfiles/skills/continuous-learning/config.jsonon` | Skip | Operational instantiation of `.references/klinglt-dotfiles/commands/learn.md`; no independent SOP content |
| 35 | `.references/klinglt-dotfiles/skills/project-guidelines-example.md` | Skip | Intentionally project-specific template; every rule overlaps with stronger-structured files already audited |
| 36 | `.references/klinglt-dotfiles/skills/tdd-workflow/SKILL.md` | Merge 3 deltas into #7 | Overlaps `.references/klinglt-dotfiles/agents/tdd-guide.md`; unique: "write user journeys first" step, ❌/✅ anti-pattern pairs, per-test-type speed budget ("unit tests < 50 ms") |
| 37 | `.references/klinglt-dotfiles/skills/coding-standards.md` | Merge 3 rules into code-review skill | Reference doc; unique: code-smell detection thresholds (>50-line functions, >4 nesting, magic numbers) + WHY-not-WHAT comments discipline |
| 38 | `.references/klinglt-dotfiles/hooks/memory-persistence/pre-compact.sh` | Promote as part of `strategic-compact` hook SOP | Compaction-boundary log + session-file separator are portable; active-session heuristic caveat noted |
| 39 | `.references/klinglt-dotfiles/hooks/memory-persistence/session-end.sh` | Include as reference in session-continuity SOP | Session-log write side is portable in concept; needs companion `.references/klinglt-dotfiles/hooks/memory-persistence/session-start.sh` and path parameterisation |
| 40 | `.references/klinglt-dotfiles/hooks/memory-persistence/session-start.sh` | Include as reference in session-continuity SOP | Context-probe pattern is portable in concept; current implementation is notification-only (no structured model-consumable output) |
| 41 | `.references/klinglt-dotfiles/skills/continuous-learning/evaluate-session.sh` | Include as reference in session-learning SOP | Session-evaluation trigger + pattern taxonomy are portable; script is glue, not SOP |
| 42 | `.references/klinglt-dotfiles/contexts/research.md` | Merge 2 rules as preamble into `issue-triage` / `codebase-architecture` | Behavioural brief; unique: "don't write code until understanding is clear" gate and "findings first, recommendations second" output contract |
| 43 | `.references/klinglt-dotfiles/contexts/dev.md` | Absorb 2 rules into implementation skills | Behavioural brief; unique: priority ladder (working → right → clean) and atomic-commits rule |
| 44 | `.references/klinglt-dotfiles/contexts/review.md` | Merge 1 rule into code-review skill | Duplicate of `.references/klinglt-dotfiles/agents/code-reviewer.md`; unique: "suggest fixes, don't just point out problems" output-contract directive |
| 45 | `.references/klinglt-dotfiles/mcp-configs/mcp-servers.jsonon` | Merge 2 rules into `mcp-builder` skill | Catalog config; unique: 10-MCP context-window cap and `disabledMcpServers` per-project scoping pattern |
| 46 | `.references/klinglt-dotfiles/examples/CLAUDE.md` | Merge 3 rules into style-guide artefact | Project template; unique: 800-line hard max / 200–400-line typical guidance, feature/domain org rule, "all tests must pass before merge" gate |

---

## 4. Per-SOP Table

> **Columns**: Source file · Trigger · Steps/contract · Quality bar · Escalation · Strip · Notes

### SOP-01 — Build Error Fix
| Field | Detail |
|---|---|
| **Source file** | `.references/klinglt-dotfiles/agents/build-error-resolver.md` |
| **Trigger** | Any `tsc --noEmit` or `<build command>` failure |
| **Steps/contract** | (1) Run full build/type check, capture all errors; (2) Categorise by type (inference, import, config, dependency); (3) Prioritise 🔴/🟡/🟢 by blocking impact; (4) Fix one error at a time with minimal diff; (5) Re-run check after each fix; (6) Emit structured Build Error Resolution Report with diff, root cause, verification checklist |
| **Quality bar** | All 🔴 blocking errors resolved; zero new errors introduced; report emitted |
| **Escalation** | Halt if fix introduces new errors, or same error persists after 3 attempts; surface to user for guidance |
| **Strip** | Language/framework-specific code examples (Patterns 1–10, Next.js 15/React 19, Supabase, Redis, Solana sections); YAML frontmatter `model`/`tools` fields |
| **Notes** | "Minimal diff strategy" DO/DON'T list is the highest-value portable extract. Merge "one error at a time" and 3-attempt stopping condition from `.references/klinglt-dotfiles/commands/build-fix.md` |

### SOP-02 — Code Review
| Field | Detail |
|---|---|
| **Source file** | `.references/klinglt-dotfiles/agents/code-reviewer.md` |
| **Trigger** | Immediately after writing or modifying any code; `MUST BE USED for all code changes` |
| **Steps/contract** | (1) Run `git diff` to surface recent changes; (2) Focus review on modified files; (3) Apply tiered checklist (security → quality → performance → best practices); (4) Emit findings grouped by severity with file/line, issue, fix example; (5) Render approve ✅ / warn ⚠️ / block ❌ verdict based on highest severity |
| **Quality bar** | No CRITICAL or HIGH findings → approve; any CRITICAL → block |
| **Escalation** | Block commit on any CRITICAL finding; surface HIGH findings to author for decision |
| **Strip** | "Project-Specific Guidelines" placeholder; React/JS performance items (re-renders, memoization, bundle sizes); `console.log` and emoji checks; hard-coded line-count thresholds |
| **Notes** | Severity→verdict mapping is the most reusable artefact. Merge "suggest fixes, don't just point out problems" from `.references/klinglt-dotfiles/contexts/review.md`; merge code-smell thresholds from `.references/klinglt-dotfiles/skills/coding-standards.md` |

### SOP-03 — Architecture Review
| Field | Detail |
|---|---|
| **Source file** | `.references/klinglt-dotfiles/agents/architect.md` |
| **Trigger** | Planning new features, refactoring large systems, or making significant architectural decisions |
| **Steps/contract** | (1) Current State Analysis — review existing arch, patterns, debt, scalability limits; (2) Requirements Gathering — functional, non-functional, integration, data-flow; (3) Design Proposal — diagram, component responsibilities, data models, API contracts; (4) Trade-Off Analysis — Pros/Cons/Alternatives/Decision per decision. Emit ADR (Context / Decision / Consequences / Alternatives / Status / Date) |
| **Quality bar** | ADR emitted for each significant decision; system-design checklist (functional / non-functional / technical / operations) satisfied |
| **Escalation** | Surface red-flag anti-patterns (tight coupling, missing error handling, security gaps, scalability constraints) to user before proceeding |
| **Strip** | "Project-Specific Architecture (Example)" section (Next.js 15 + FastAPI + Supabase + Redis concrete stack); keep Redis ADR example but label explicitly as illustration |
| **Notes** | ADR template is the single highest-value portable artefact; four-phase review loop gives clean agentic steps. Collapse frontmatter + "Your Role" bullets into skill trigger description |

### SOP-04 — Doc Sync / Codemap
| Field | Detail |
|---|---|
| **Source file** | `.references/klinglt-dotfiles/agents/doc-updater.md` |
| **Trigger** | After major features, API/dependency changes, architecture shifts, before releases; also weekly sweep |
| **Steps/contract** | (1) Analyze repo structure and entry points; (2) Per-module analysis (exports, imports, routes, models); (3) Generate structured codemaps under `docs/CODEMAPS/` (INDEX + per-area files); (4) Extract JSDoc/env vars/README sections; (5) Update READMEs and guides; (6) Validate all paths, links, code examples; (7) Commit with PR template noting generated files and verification checklist |
| **Quality bar** | All paths valid; freshness timestamp present; each codemap ≤500 lines; diff > 30 % triggers human approval gate before write |
| **Escalation** | Flag stale docs (90+ days unmodified) for manual review; do not auto-delete |
| **Strip** | TS-specific toolchain (ts-morph, madge, jsdoc-to-markdown); Next.js/Supabase/Redis/Privy/Solana example codemap content |
| **Notes** | Merge "token-lean" framing and 30 %-diff approval gate from `.references/klinglt-dotfiles/commands/update-codemaps.md`; merge 4-section RUNBOOK.md schema and 90-day staleness threshold from `.references/klinglt-dotfiles/commands/update-docs.md` |

### SOP-05 — Planning
| Field | Detail |
|---|---|
| **Source file** | `.references/klinglt-dotfiles/agents/planner.md` |
| **Trigger** | User requests feature implementation, architectural change, or complex refactoring |
| **Steps/contract** | (1) Requirements Analysis — understand request, surface clarifying questions, define success criteria; (2) Architecture Review — read existing codebase, identify affected components; (3) Step Breakdown — produce steps each with action/file path/dependencies/complexity/risk; (4) Implementation Order — sequence by dependency, enable incremental verification; (5) Present full plan; (6) BLOCK on explicit user confirmation before writing any code |
| **Quality bar** | Every step has an explicit Why, Dependencies, and Risk field; plan presented and confirmed before code is written |
| **Escalation** | Surface Red Flags (missing error handling, tight coupling, absent test coverage) before confirming plan |
| **Strip** | YAML frontmatter `tools`/`model`; "When Planning Refactors" overlap section (condense to conditional appendix); Best Practices list (implied by process) |
| **Notes** | Merge hard confirmation gate and modification-request syntax (`modify:` / `different approach:` / `skip phase N`) from `.references/klinglt-dotfiles/commands/plan.md`; these are absent from current `prd-to-plan` skill |

### SOP-06 — Security Review
| Field | Detail |
|---|---|
| **Source file** | `.references/klinglt-dotfiles/agents/security-reviewer.md` |
| **Trigger** | After writing any code that handles user input, authentication, API endpoints, or sensitive data; also on dependency updates, CVE alerts, before major releases |
| **Steps/contract** | (1) Initial scan — dependency audit, static-analysis linter, grep for hardcoded secrets; (2) OWASP Top 10 category-by-category analysis; (3) Emit tiered Security Review Report (CRITICAL/HIGH/MEDIUM/LOW — each with location, issue, PoC, remediation, OWASP/CWE ref); (4) PR verdict: BLOCK / APPROVE WITH CHANGES / APPROVE; (5) On CRITICAL: document → notify → fix → test → rotate secrets → update docs |
| **Quality bar** | All CRITICAL issues fixed before merge; report emitted with severity table and remediation code |
| **Escalation** | On CRITICAL: STOP all work; escalate to dedicated security review process; rotate any exposed credentials |
| **Strip** | "Example Project-Specific Security Checks" section (Solana, Privy JWT, Supabase RLS, Redis TLS); npm-specific toolchain references; YAML frontmatter |
| **Notes** | Merge 8-item pre-commit checklist ("Before ANY commit") from `.references/klinglt-dotfiles/rules/security.md` as mandatory gate appendix; merge 17-point pre-deployment checklist from `.references/klinglt-dotfiles/skills/security-review/SKILL.md` as a supplemental close-out gate |

### SOP-07 — TDD
| Field | Detail |
|---|---|
| **Source file** | `.references/klinglt-dotfiles/agents/tdd-guide.md` (primary); `.references/klinglt-dotfiles/skills/tdd-workflow/SKILL.md`, `.references/klinglt-dotfiles/commands/tdd.md`, `.references/klinglt-dotfiles/rules/testing.md` (merge sources) |
| **Trigger** | Proactively when writing new features, fixing bugs (reproduce with failing test first), or refactoring code |
| **Steps/contract** | (1) Write user journeys first; (2) Generate test cases from journeys; (3) Write failing test (RED) — run and verify failure for right reason; (4) Write minimal implementation (GREEN) — run and verify pass; (5) Refactor while keeping tests green; (6) Verify ≥80 % coverage on branches/functions/lines/statements (100 % for financial/auth/security/core-logic paths) |
| **Quality bar** | All public functions tested; all API endpoints tested; ≥80 % coverage (100 % for critical paths); tests are independent, assertions are specific |
| **Escalation** | "Fix implementation, not tests" unless tests are genuinely wrong (escalation heuristic) |
| **Strip** | Supabase/Redis/OpenAI service-specific mock examples; domain-specific TypeScript function names and test assertions (`election`, `Trump`, `Biden`, market slugs); `npm`-specific commands; YAML frontmatter |
| **Notes** | Delta merges: "write user journeys first" step and per-test-type speed budget ("unit tests < 50 ms") from `.references/klinglt-dotfiles/skills/tdd-workflow/SKILL.md`; tiered coverage table from `.references/klinglt-dotfiles/commands/tdd.md`; "fix impl not tests" heuristic from `.references/klinglt-dotfiles/rules/testing.md`; 8-category edge-case list and Test Smells ❌/✅ block are the strongest artefacts |

### SOP-08 — E2E Testing
| Field | Detail |
|---|---|
| **Source file** | `.references/klinglt-dotfiles/agents/e2e-runner.md` |
| **Trigger** | When generating, maintaining, or running E2E tests; before PRs and deployments; when flaky tests detected in CI |
| **Steps/contract** | (1) Test Planning — identify critical user journeys, define happy-path/edge/error scenarios, prioritise by risk tier (HIGH: financial/auth, MEDIUM: search/nav, LOW: UI polish); (2) Test Creation — POM pattern, `data-testid` locators, assertions at key steps, artifact capture, auto-wait/retry resilience; (3) Test Execution — run locally 3–5 times for stability, quarantine flaky tests (`test.fixme` + issue link), run in CI; (4) Report — structured markdown report with totals, per-suite pass/fail/flaky, failure detail (file:line, error, screenshot, trace, repro steps, recommended fix) |
| **Quality bar** | ≥95 % pass rate; <5 % flaky tests; <10 min full run |
| **Escalation** | Quarantine flaky tests immediately; do not ship with unquarantined flaky tests in CI |
| **Strip** | "Example Project-Specific Test Scenarios" section (Market Browsing, Wallet Connection, Trading Flow); `BASE_URL: https://staging.pmx.trade`; closing "Remember" paragraph referencing SOL; YAML frontmatter |
| **Notes** | Merge DO/DON'T best-practices checklist from `.references/klinglt-dotfiles/commands/e2e.md`; generalise "never run financial tests against production" to "tests that mutate state or incur cost must run on staging/test environments only" |

### SOP-09 — Dead-Code Cleanup
| Field | Detail |
|---|---|
| **Source file** | `.references/klinglt-dotfiles/agents/refactor-cleaner.md` |
| **Trigger** | Removing unused code, exports, imports, and dependencies; explicitly NOT during active feature development, just before production deployments, or when test coverage is absent |
| **Steps/contract** | (1) Run detection tools in parallel (`<dead-code detection tools>` — JS/TS defaults: knip, depcheck, ts-prune); (2) Categorise findings by risk tier: SAFE (test files, unused utilities) / CAREFUL (API routes, UI components) / RISKY (config files, entry points); (3) Grep all references, check dynamic imports, review git history; (4) Remove SAFE items first, one category at a time (deps → internal exports → files → duplicate code); (5) Run build and tests after each batch; (6) Commit each batch separately; (7) Update `docs/DELETION_LOG.md` with session entry; (8) Open PR with bundle-size and LOC impact summary |
| **Quality bar** | Build passes after every batch; DELETION_LOG updated; no CAREFUL/RISKY items auto-deleted without explicit review |
| **Escalation** | On test failure after deletion: rollback → investigate → fix-forward → update process |
| **Strip** | Entire "Example Project-Specific Rules" section (Privy/Solana/Supabase/Redis NEVER-REMOVE lists); TS/React-specific code examples; tool-specific bash commands (parameterise); YAML frontmatter |
| **Notes** | SAFE/CAREFUL/RISKY model is the highest-value portable extract. "When NOT to Use" guard conditions should be preserved verbatim. Merge CAUTION tier examples from `.references/klinglt-dotfiles/commands/refactor-clean.md` |

### SOP-10 — Session Learning / Skill Extraction
| Field | Detail |
|---|---|
| **Source file** | `.references/klinglt-dotfiles/commands/learn.md` |
| **Trigger** | After solving a non-trivial problem during a session; also as end-of-session sweep |
| **Steps/contract** | (1) Review session history for extractable patterns; (2) Apply extraction filters — skip trivial fixes (typos, simple syntax) and one-time issues (API outages); focus on reusable patterns; (3) Draft skill file (Descriptive Name / Extracted date / Context / Problem / Solution / Example / When to Use); (4) Present draft to user for confirmation; (5) Save confirmed file to `<skills-dir>/learned/<pattern-name>.md` |
| **Quality bar** | Only non-trivial, reusable patterns extracted; confirmed by user before writing |
| **Escalation** | Do not write skill file without explicit user confirmation (human-in-the-loop gate) |
| **Strip** | Hardcoded `~/.claude/skills/learned/` path (replace with `<skills-dir>` placeholder); "Project-Specific Patterns" category (keep as optional fourth category, note repo-scoped) |
| **Notes** | Complementary to `skill-create` (full design-and-iterate workflow); this covers the narrow end-of-session extraction fast-path. Unique additions over existing `skill-create`: session-review trigger framing, extraction-filter negative guards, confirm-before-save gate |

### SOP-11 — Hooks Guardrails (Inline Pattern Reference)
| Field | Detail |
|---|---|
| **Source file** | `.references/klinglt-dotfiles/hooks/hooks.jsonon` (inline hook entries only) |
| **Trigger** | Tool-invocation boundaries: PreToolUse/Bash (server commands, git push, Write to .md files), PostToolUse/Edit (JS/TS files), Stop (final audit) |
| **Steps/contract** | (1) tmux gate: BLOCK `*dev` server commands unless inside tmux; emit corrective command; exit 1; (2) Push pause: on `git push`, emit review prompt and block until Enter or Ctrl+C (gate on `[ -t 0 ]` for non-interactive safety); (3) Doc allowlist gate: BLOCK Write to any `.md`/`.txt` not matching allowlist (configurable); (4) Prettier auto-format on JS/TS edit; (5) `tsc --noEmit` type-check on `.ts`/`.tsx` edit; (6) console.log warn on edit + full-diff sweep on Stop |
| **Quality bar** | All inline hooks are self-contained bash; no dependency on external scripts |
| **Escalation** | None — hooks are automated guardrails; emit stderr output for agent visibility |
| **Strip** | All five hooks delegating to external scripts (entries 5, 10, 11, 13, 14 per `.plans/audits/klinglt-dotfiles/raw-findings.md`); doc-file allowlist items (treat as configurable placeholder); `read -r` push-pause needs `[ -t 0 ]` TTY guard |
| **Notes** | BLOCK-with-corrective-command pattern (exit 1 + emit the right command) is the strongest reusable guardrail idiom. console.log belt+suspenders design (PostToolUse per-file + Stop full-diff sweep) is the key structural insight worth documenting |

---

## 5. Portability Ranking

### High portability (promote as-is after stripping project-specific sections)
- `.references/klinglt-dotfiles/agents/code-reviewer.md` — Language-agnostic structure; strip-zones are clearly bounded
- `.references/klinglt-dotfiles/agents/architect.md` — Technology-neutral 4-phase loop; one bounded section to strip
- `.references/klinglt-dotfiles/agents/planner.md` — Fully technology-agnostic; no project-specific identifiers in core
- `.references/klinglt-dotfiles/contexts/research.md` — 25 lines; entirely portable; no project identifiers
- `.references/klinglt-dotfiles/hooks/strategic-compact/suggest-compact.sh` — No project-specific logic; self-contained pattern
- `.references/klinglt-dotfiles/hooks/memory-persistence/pre-compact.sh` — No project-specific logic; clean and minimal

### Medium portability (promote with moderate stripping, ~20–40 % reduction)
- `.references/klinglt-dotfiles/agents/security-reviewer.md` — ~20 % project-specific (Solana/Privy section)
- `.references/klinglt-dotfiles/agents/build-error-resolver.md` — ~40 % project-specific examples; core SOP is clean
- `.references/klinglt-dotfiles/agents/e2e-runner.md` — ~35 % project-specific test scenarios; phases and patterns are solid
- `.references/klinglt-dotfiles/agents/refactor-cleaner.md` — Project-specific rules section clearly bounded; strip is surgical
- `.references/klinglt-dotfiles/agents/doc-updater.md` — TS toolchain examples ~30 %; codemap schema and workflow are clean
- `.references/klinglt-dotfiles/rules/security.md` — One agent-reference to generalise; otherwise directly portable
- `.references/klinglt-dotfiles/skills/security-review/SKILL.md` — One stack-specific section (Solana/blockchain); rest is OWASP-universal

### Partial portability (useful as delta merges, not standalone promotions)
- `.references/klinglt-dotfiles/agents/tdd-guide.md` — Core is portable; service-mock examples pervasive but strippable; existing `tdd` skill means it is a merge, not a new promotion
- `.references/klinglt-dotfiles/commands/plan.md` — Two unique rules worth merging; rest is thin wrapper
- `.references/klinglt-dotfiles/commands/tdd.md` — Tiered coverage table and bug-fix rule are the only net-new content
- `.references/klinglt-dotfiles/commands/learn.md` — Three unique rules over existing `skill-create`
- `.references/klinglt-dotfiles/rules/coding-style.md` — Three unique rules; rest overlaps with review skills
- `.references/klinglt-dotfiles/rules/git-workflow.md` — Two portable sections; named-agent references need generalisation
- `.references/klinglt-dotfiles/skills/tdd-workflow/SKILL.md` — Three unique additions over `.references/klinglt-dotfiles/agents/tdd-guide.md`; rest overlaps
- `.references/klinglt-dotfiles/hooks/hooks.jsonon` — Inline hooks are portable; external-script hooks are not standalone
- `.references/klinglt-dotfiles/hooks/memory-persistence/session-end.sh` — Pattern portable; needs companion and path config

---

## 6. Cross-Cutting Protocol Primitives

These patterns appear across multiple files and represent the repo's strongest reusable building blocks. Any promoted skill drawing on this repo should encode these explicitly.

### P1 — Tiered severity with explicit verdict mapping
Used in: `.references/klinglt-dotfiles/agents/code-reviewer.md`, `.references/klinglt-dotfiles/agents/security-reviewer.md`, `.references/klinglt-dotfiles/commands/code-review.md`, `.references/klinglt-dotfiles/contexts/review.md`, `.references/klinglt-dotfiles/skills/security-review/SKILL.md`  
Pattern: Define severity tiers (CRITICAL/HIGH/MEDIUM/LOW or 🔴/🟡/🟢) with an explicit rule mapping tier to verdict (no CRITICAL/HIGH → approve; any CRITICAL → block). Eliminates discretionary approval judgements.

### P2 — Minimal-diff / one-at-a-time fix discipline
Used in: `.references/klinglt-dotfiles/agents/build-error-resolver.md`, `.references/klinglt-dotfiles/commands/build-fix.md`  
Pattern: Fix one error per cycle; re-run verification after each fix; halt on regression or N-attempt failure. Directly preventive of cascading errors introduced by broad speculative fixes.

### P3 — Risk-tier classification for destructive operations
Used in: `.references/klinglt-dotfiles/agents/refactor-cleaner.md`, `.references/klinglt-dotfiles/commands/refactor-clean.md`  
Pattern: Classify every candidate item as SAFE / CAREFUL (CAUTION) / RISKY (DANGER) before acting. Only auto-apply SAFE items; require explicit review for higher tiers. Applies to code deletion, schema migration, dependency removal.

### P4 — Human-in-the-loop confirmation gate
Used in: `.references/klinglt-dotfiles/agents/planner.md`, `.references/klinglt-dotfiles/commands/plan.md`, `.references/klinglt-dotfiles/commands/learn.md`, `.references/klinglt-dotfiles/skills/continuous-learning/config.jsonon` (`auto_approve: false`)  
Pattern: Present a complete plan, draft, or extraction to the user before writing any output. No code written / file saved until explicit affirmative response received. Named "WAITING FOR CONFIRMATION" in `.references/klinglt-dotfiles/commands/plan.md` worked example.

### P5 — Structured report with before/after metrics
Used in: `.references/klinglt-dotfiles/agents/build-error-resolver.md`, `.references/klinglt-dotfiles/agents/e2e-runner.md`, `.references/klinglt-dotfiles/agents/refactor-cleaner.md`, `.references/klinglt-dotfiles/commands/test-coverage.md`  
Pattern: Every SOP that makes changes emits a structured markdown report capturing: what changed, what remains, metrics before/after (error counts, coverage percentages, LOC delta, bundle size). Provides accountability and enables incremental verification.

### P6 — Belt-and-suspenders audit pattern
Used in: `.references/klinglt-dotfiles/hooks/hooks.jsonon` (console.log PostToolUse per-file + Stop full-diff sweep)  
Pattern: Apply a lightweight inline check immediately after each relevant action (PostToolUse), plus a comprehensive sweep at session boundary (Stop). Catches both incremental regressions and accumulated drift. Applicable to any "must not leave X" rule.

### P7 — BLOCK-with-corrective-command hook pattern
Used in: `.references/klinglt-dotfiles/hooks/hooks.jsonon` (tmux gate, doc allowlist gate)  
Pattern: When blocking a disallowed action (exit 1), emit the correct alternative command or redirect instruction. Turns a hard stop into a teachable moment; reduces friction without reducing safety.

### P8 — Phase-boundary compaction discipline
Used in: `.references/klinglt-dotfiles/hooks/strategic-compact/suggest-compact.sh`  
Pattern: Prefer manual compaction at logical phase transitions (exploration → implementation, milestone → next) over arbitrary auto-compact mid-task. Preserves context coherence through phases; encode as an advisory (non-blocking) rather than a hard gate.

### P9 — "When NOT to Use" guard conditions
Used in: `.references/klinglt-dotfiles/agents/refactor-cleaner.md`, `.references/klinglt-dotfiles/agents/e2e-runner.md` (implied by test isolation rules)  
Pattern: Every specialist SOP should explicitly list preconditions under which it must NOT be invoked (e.g., active feature development, low test coverage, unfamiliar codebase, just before production deployment). Prevents tool-misapplication silently.

### P10 — Generate from code as single source of truth
Used in: `.references/klinglt-dotfiles/agents/doc-updater.md`, `.references/klinglt-dotfiles/commands/update-docs.md`  
Pattern: Documentation must be derived from the live system (config files, code exports, schema definitions) rather than maintained separately. Docs that diverge from reality are worse than no docs. Freshness timestamp is the enforcement signal.

---

## 7. Default Recommendation

**Prioritise the nine agent files** (`.references/klinglt-dotfiles/agents/`) as the primary extraction targets. They are the most complete, most carefully structured, and most intentionally designed for reuse of all 29+ files audited. Each has a clear SOP shape (phases → steps → output template → strip zone), and the project-specific scaffolding is bounded in named sections ("Project-Specific Guidelines", "Example Project-Specific Rules") that are surgical to remove.

**Treat `.references/klinglt-dotfiles/commands/` as delta sources only.** In every case where a `.references/klinglt-dotfiles/commands/` file covers the same domain as a `.references/klinglt-dotfiles/agents/` file, the agent version is more complete. `.references/klinglt-dotfiles/commands/` files contribute at most 1–3 net-new rules each; these are worth harvesting but do not justify separate skill promotions.

**Treat `.references/klinglt-dotfiles/rules/` as an additive layer.** Rules files are policy declarations, not procedural SOPs. Their highest-value content (8-item pre-commit security checklist, conventional commits format, quality checklist items) belongs merged into the corresponding specialist skill, not promoted as standalone skills.

**Skip the project-specific reference catalogs** (`.references/klinglt-dotfiles/skills/backend-patterns.md`, `.references/klinglt-dotfiles/skills/frontend-patterns.md`, `.references/klinglt-dotfiles/skills/project-guidelines-example.md`, `.references/klinglt-dotfiles/skills/coding-standards.md`). These encode no procedural SOP discipline and are illustrative code scaffolding. Extract only the abstract rules (N+1 prevention, retry-with-backoff, code-smell thresholds) and fold them into existing review or architecture skills.

**The hooks layer is a secondary priority** with high local value. `.references/klinglt-dotfiles/hooks/hooks.jsonon` (inline hooks) and `.references/klinglt-dotfiles/hooks/strategic-compact/suggest-compact.sh` are immediately portable as a hooks-guardrails reference SOP. The memory-persistence and continuous-learning hooks form a coherent "session continuity" pattern that warrants a separate SOP, but require stitching three scripts together into a round-trip specification before promoting.

---

## 8. Structural Patterns

Observations about how the repo authors encode SOP discipline — patterns worth replicating in promoted skills.

**8.1 — Named strip zones**  
Four of the nine agent files include an explicitly titled "Project-Specific Guidelines" or "Example Project-Specific Rules" section. This makes the portable core visually and structurally separable from local scaffolding without reading the whole file. A strong pattern to carry forward when authoring skills: label all local scaffolding explicitly.

**8.2 — ❌/✅ code-pair contrast blocks**  
Used consistently in `.references/klinglt-dotfiles/agents/tdd-guide.md` (Test Smells), `.references/klinglt-dotfiles/commands/e2e.md` (flakiness fixes), `.references/klinglt-dotfiles/skills/security-review/SKILL.md` (OWASP patterns), `.references/klinglt-dotfiles/skills/coding-standards.md`, `.references/klinglt-dotfiles/rules/coding-style.md`. This is the repo's most reusable pedagogical format — concrete, immediately scannable, and resistant to misinterpretation. Skills promoted from this repo should preserve ❌/✅ blocks verbatim where they exist.

**8.3 — "When to Use / When NOT to Use" delegation matrix**  
Present in `.references/klinglt-dotfiles/agents/build-error-resolver.md` and `.references/klinglt-dotfiles/agents/refactor-cleaner.md`. Gives agents a principled decision rule for when to invoke (and, critically, when to decline) a specialist SOP. This is an underused pattern in most generic skills and is one of the stronger structural contributions from this repo.

**8.4 — Per-step structured fields (Action / Why / Dependencies / Risk)**  
Used in `.references/klinglt-dotfiles/agents/planner.md`'s plan template. Enforces reasoning discipline at the step level — not just "what to do" but why, what it depends on, and what could go wrong. Stronger than plain bulleted step lists; worth adopting in any multi-step SOP template.

**8.5 — Dual-tier trigger matrices (ALWAYS / IMMEDIATELY)**  
Used in `.references/klinglt-dotfiles/agents/security-reviewer.md` "When to Run" section. Separates routine-cadence triggers (ALWAYS: after writing auth/input/API code) from urgent-escalation triggers (IMMEDIATELY: dependency update with CVE, production incident, secret exposure). A clean pattern for expressing both proactive and reactive trigger conditions in a single reference.

**8.6 — Proactive agent framing**  
Five agent files explicitly mark the trigger as `PROACTIVELY` activated — the agent does not wait to be asked but activates automatically on condition match. This framing is a deliberate design choice that enables autonomous workflow integration and should be preserved in any skill extracted from this repo.

**8.7 — Companion-file relationship structure**  
Multiple `.references/klinglt-dotfiles/commands/` files exist as thin wrappers over `.references/klinglt-dotfiles/agents/` files, and multiple `.references/klinglt-dotfiles/hooks/` scripts form complementary pairs (`.references/klinglt-dotfiles/hooks/memory-persistence/session-start.sh` ↔ `.references/klinglt-dotfiles/hooks/memory-persistence/session-end.sh`, `.references/klinglt-dotfiles/hooks/memory-persistence/pre-compact.sh` ↔ `.references/klinglt-dotfiles/hooks/strategic-compact/suggest-compact.sh`). This layering pattern (authoritative SOP in `.references/klinglt-dotfiles/agents/` or scripts/, user-facing wrapper in `.references/klinglt-dotfiles/commands/`) is worth preserving in skills output: one canonical procedure file, optionally referenced from a lightweight trigger wrapper.

---

## 9. Evidence

All citations are traceable to source observations in `.plans/audits/klinglt-dotfiles/raw-findings.md`.

> **E01** — `.references/klinglt-dotfiles/agents/code-reviewer.md`: *"The 'Project-Specific Guidelines' section is explicitly a placeholder extension point, confirming the author designed for reuse."* Supports the structural observation that this repo intentionally separates portable core from local scaffolding.

> **E02** — `.references/klinglt-dotfiles/agents/build-error-resolver.md`: *"The 'minimal diff strategy' section is the highest-value portable extract — it articulates a discipline (fix scope, not style) that applies across any language."* Supports SOP-01 design and Cross-Cutting Primitive P2.

> **E03** — `.references/klinglt-dotfiles/agents/refactor-cleaner.md`: *"The SAFE/CAREFUL/RISKY risk-tier model is the most portable and highest-value extract — it gives agents a principled decision rule for scoping deletions rather than an ad-hoc judgement call."* Supports SOP-09 and Cross-Cutting Primitive P3.

> **E04** — `.references/klinglt-dotfiles/commands/plan.md`: *"The sole highest-value unique portable rule is the confirmation gate: no code may be written until the user gives an explicit affirmative response. This is a strong, enforceable contract condition absent from many planning SOPs."* Supports SOP-05 merge directive and Cross-Cutting Primitive P4.