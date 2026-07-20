# Role-to-SOP Audit: awesome-claude
**Audit pass:** 1  
**Date:** 2026-03-28  
**Source repo:** `/Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude`  
**Output:** `/Users/mia/.agents/.worktrees/role-to-sop/.plans/audits/awesome-claude/role-to-sop-audit-1.md`

---

## 1. Repo Overview

`awesome-claude` (MIT, by GitHub user Hedgehogues) is a batteries-included `.claude/` directory designed to be cloned directly into any project root, turning Claude Code into what the author calls "a senior engineer on your team." The stated motivation is to stop repeating project conventions per session: TDD discipline, DDD layer rules, commit format, and break-on-red test behaviour. The repo contains 60+ architecture rules, 10 slash-command skills, and 3 sub-agents. Rules use YAML `paths:` frontmatter to scope activation to relevant file paths, so Claude only sees what is relevant for the file being edited. The primary author's context appears to be a Python/FastAPI + React monorepo called "Resume Matcher" or "Test Guardian" — several skills and agents contain hardcoded project-specific paths and Russian-language role personas. The collection is opinionated and encodes a specific philosophy: tests are specifications, backend owns all state, stop on red, DDD layers, commits tell a story, 12-factor config.

---

## 2. Content Summary

**Rules (60+):** Organized in `rules/arch/` sub-trees covering DDD/Clean Architecture (11 rules: aggregates, commands, events, queries, domain, repositories, shared kernel, services, views, state ownership), Database Design (12 rules: migrations, indexes, constraints, normal forms, transactions, versioning, read/write models, performance, retention, security, seeds), 12-Factor App (12 rules), Code Quality/Refactoring (11 rules: change-breakers, inflators, dead code, deps, OOP design, conditions, data, functions, generalizations, methods, simplify), and Workflow (12+ rules: break-stop hard halt, git commit conventions, meta-rules for rule authoring, frontend testing, frontend design, makefile, monorepo structure, UI library layers, LLM security, unit test contracts, logging, monitoring, architecture tests).

**Skills (10):** Multi-step slash commands — `/tdd` (red-green-refactor with PlantUML diagrams), `/commit` (structured git commit with approval gate), `/tracing` (incident/bug tracing across layers with C4+sequence diagrams), `/triz` (ARIZ-85V problem-solving), `/ui` (TDD-first React component engineering), `/pipe` (skill pipeline orchestrator), `/test-all` (full test suite runner with delta reporting), `/session-report` (product-focused change summary for stakeholders), `/deploy` (Docker rebuild + Alembic migrations), `/describe` (project overview, no commands).

**Agents (3):** `planner` (requirement completeness analysis, codebase impact mapping, risk assessment, implementation plan); `code-review-sentinel` (architecture, code quality, test triviality detection, security review; renders APPROVE/REQUEST CHANGES/BLOCK verdict); `ui-ux-engineer` (TDD-first frontend, accessibility, visual cohesion).

---

## 3. SOP Split: Port vs Leave Out

### ✅ PORT (coding and business workflows, portable with stripping)

| # | Name | Source | Why Port |
|---|------|---------|----------|
| 1 | TDD Workflow | `skills/tdd/SKILL.md` | Complete red-green-refactor SOP with diagramming, layer-by-layer test writing, self-check. Highly portable; anti-patterns and destructive-tester mindset are universally reusable. |
| 2 | Structured Git Commit | `skills/commit/SKILL.md` + `rules/git.md` | What/Why/Details format, approval gate before commit, explicit file staging, never auto-push. Stack-neutral. |
| 3 | Break-Stop Rule | `rules/break-stop.md` | Hard escalation protocol: stop on test/lint/type failure, output red banner, ask user. Universal human-in-the-loop safety gate. |
| 4 | Incident & Bug Tracing | `skills/tracing/SKILL.md` | Full-stack trace from UI to DB, root-cause table, risk matrix, PlantUML sequence + C4. Incident mode vs feature-tracing mode split is portable. |
| 5 | Code Review Sentinel | `agents/code-review-sentinel.md` | Test triviality detection, DDD layer review, security, APPROVE/REQUEST CHANGES/BLOCK verdict. Framework is portable; project-specific context blocks can be stripped. |
| 6 | Feature Planning / Requirements Completeness | `agents/planner.md` | 6-criteria requirements completeness check, codebase impact map, risk assessment, implementation plan with commit breakdown. Strip project-specific layer map. |
| 7 | Skill Pipeline Orchestrator | `skills/pipe/SKILL.md` | Multi-phase sequential skill chaining with context handoff between phases. Stop-on-failure gate. Portable meta-protocol. |
| 8 | Session / Change Report | `skills/session-report/SKILL.md` | Product-focused diff summarization for stakeholders, grouped by user-facing feature (not file list). Stack-neutral. |
| 9 | Test-Suite Runner with Delta | `skills/test-all/SKILL.md` | Collect all tests, run sequentially without stopping on failure, report delta vs baseline, issue verdict. Protocol is portable; runner commands need stack adaptation. |
| 10 | LLM Security Rules | `rules/arch/LLM_SECURITY.md` | LLM output = untrusted input; never authorize from LLM output; structured output parsing required; prompt injection isolation. Relevant to any LLM-integrated codebase. |
| 11 | Unit Test Contracts | `rules/arch/UNIT_TESTS.md` | Module + function docstrings, no mock-assertion tests, no echo tests (trivial constructors), no shared mutable state, section separators. Anti-patterns (AP1, AP2, AP3) are universally applicable. |
| 12 | Automated Architecture Tests Pattern | `rules/arch/ARCH_TESTS.md` | Pattern of encoding architecture rules as AST-based pytest checks (layer boundaries, aggregate isolation, versioning invariants, LLM security). The pattern is portable; specific rules need repo adaptation. |
| 13 | Meta-Rules for Rule Authoring | `rules/meta-rules.md` | How to write scoped rules (YAML paths, topic-per-file, universality requirements, when to propose vs not). Portable rule governance SOP. |

### ❌ LEAVE OUT (tool-specific, project-hardcoded, or too narrow)

| # | Name | Source | Why Skip |
|---|------|---------|----------|
| 1 | Deploy Skill | `skills/deploy/SKILL.md` | Hardcodes `docker compose`, `alembic`, specific port `55078`, path `/Users/egurvanov/python/awesome-claude`. Fully project-specific; would need complete rewrite per stack. |
| 2 | Describe Skill | `skills/describe/SKILL.md` | Hardcodes "Test Guardian" project name and specific monorepo structure. Pure project documentation, not a reusable SOP. |
| 3 | TRIZ / ARIZ-85V | `skills/triz/SKILL.md` | Highly specialized problem-solving methodology requiring deep TRIZ expertise to apply. Not a coding workflow SOP; overhead exceeds value for most teams. |
| 4 | UI/UX Engineer Agent | `agents/ui-ux-engineer.md` | Narrow to React/TypeScript/Vite + CSS Modules stack. The TDD-first principle is captured in the TDD SOP. |
| 5 | Frontend Rules | `rules/frontend-design.md`, `rules/frontend-testing.md`, `rules/ui-library.md` | React + Vitest + Testing Library + Playwright specific. Not portable to non-React stacks. |
| 6 | Makefile Rule | `rules/makefile.md`, `rules/arch/environment/` | Specific to the project's make-based build system. |
| 7 | 12-Factor App Rules | `rules/arch/environment/` | Valuable but very long; better covered by linking the canonical 12factor.net. No procedural SOP steps to extract — these are constraints, not workflows. |
| 8 | DDD Arch Rules (individual files) | `rules/arch/components/`, `rules/arch/db/` | These are DDD conventions, not SOPs. Useful as rule templates but not portable procedures. |
| 9 | VISUAL_COHESION | `rules/arch/VISUAL_COHESION.md` | React CSS Modules + DDD visual pattern. Narrow to the specific frontend stack. |
| 10 | Monorepo Structure | `rules/monorepo-structure.md` | Specific to the author's monorepo layout. |

---

## 4. SOP Tables for Porting

### SOP-1: TDD Workflow

| Field | Value |
|-------|-------|
| **Source file** | `skills/tdd/SKILL.md` |
| **Trigger / when to use** | Implementing any feature, fixing a bug, or adding test coverage — always invoked before writing implementation code |
| **Steps / contract** | Step 0: Reconnaissance (read existing code, find files); Step 1: Visualize flow (PlantUML sequence + activity diagrams, mandatory); Step 2: Test plan (list by layer: unit/state/security/cases/integration/arch/e2e, with explicit "not needed" for skipped layers); Step 3: RED — write tests layer by layer, confirm each FAILS for the right reason; Step 4: GREEN — write minimal implementation in DDD order (domain → application → infra → presentation → frontend); Step 5: Full verification (`make check` equivalent); Step 6: Refactor (only after full green); Step 7: Self-check (destructive tester checklist + UI wiring check) |
| **Quality bar** | Every test must have docstring; every test must catch a real bug; no mock-assertion tests; no vacuously true tests; UI wiring verified (route registered, imports connected, API wired) |
| **Escalation path** | If a previously green test goes red during GREEN phase — STOP immediately (triggers Break-Stop SOP) |
| **Next action** | Invoke Break-Stop SOP on regression; self-check checklist before declaring done |
| **What to strip** | Russian-language role persona ("QA-автоматизатор с 20-летним стажем"); specific file paths (`packages/back`, `uv run pytest`); specific markers (`pytestmark = pytest.mark.asyncio`) — replace with stack-agnostic equivalents; PlantUML participant names tied to the specific project |
| **Notes** | The 6-question "destructive tester" mindset and corner-case table are the highest-value portable primitives here. The layer ordering (domain → application → infra → presentation → frontend) is portable for any layered architecture |

---

### SOP-2: Structured Git Commit

| Field | Value |
|-------|-------|
| **Source file** | `skills/commit/SKILL.md` + `rules/git.md` |
| **Trigger / when to use** | Before any git commit; after completing a logical unit of work |
| **Steps / contract** | Step 1: Collect info (git status, git diff HEAD, git log --oneline -5 for style); Step 2: Analyze changes — group by logical block, identify files to exclude (.env, credentials); Step 3: Determine TASK-ID (from arguments or use placeholder); Step 4: Draft commit message (What changed / Why / Details, title ≤72 chars, imperative mood); Step 5: Show plan and WAIT for user approval; Step 6: Execute commit using HEREDOC, add files by name (never `git add .`); Step 7: Verify with `git log -1` |
| **Quality bar** | Title max 72 chars, imperative, lowercase; body always explains WHY; test coverage mentioned; non-obvious decisions explained; Co-Authored-By attribution included |
| **Escalation path** | If pre-commit hook fails — fix cause, create new commit (never `--no-verify`, never `--amend` without explicit request) |
| **Next action** | Never auto-push; never auto-amend; one logical change per commit (propose split if mixed) |
| **What to strip** | Russian inline comments; `Co-Authored-By: Claude Opus 4.6 (1M context)` — replace with generic attribution or remove |
| **Notes** | The approval gate (Step 5) is the core portable primitive — user must confirm before commit executes |

---

### SOP-3: Break-Stop (Test Failure Escalation)

| Field | Value |
|-------|-------|
| **Source file** | `rules/break-stop.md` |
| **Trigger / when to use** | Any time tests, lint, or type checks fail during implementation; any time a change predictably will break existing contracts |
| **Steps / contract** | 1. Run verification after every logical change; 2. If failure detected — output red alert banner verbatim; 3. List what broke, likely cause, options; 4. STOP — do not continue; 5. Wait for explicit user instruction; 6. Resume only after verification passes and user confirms. Proactive: if change will predictably break, banner BEFORE applying change |
| **Quality bar** | Banner must be output verbatim; no autonomous fixes to broken functionality; trivial formatting fixes (ruff/black) may be applied silently |
| **Escalation path** | Always escalates to user — no autonomous recovery from broken state |
| **Next action** | User decides; agent presents options but does not choose |
| **What to strip** | `make check` command — replace with project-appropriate verification command |
| **Notes** | This is the highest-priority cross-cutting primitive. Must load for `**/*` (global scope). The distinction between trivial (silent fix OK) vs broken functionality (hard stop) is the critical decision tree |

---

### SOP-4: Incident & Bug Tracing

| Field | Value |
|-------|-------|
| **Source file** | `skills/tracing/SKILL.md` |
| **Trigger / when to use** | Deployed feature doesn't work; triaging bugs; production incidents; "nothing changed after deploy" |
| **Steps / contract** | Step 0: Classify mode (Incident vs Feature Tracing) + reconnaissance; Step 1: Structured problem description (symptoms, context, expected vs actual, severity, blast radius); Step 2: Localize in code — trace full chain from UI to DB, mark each link ✅/❌/⬜; Step 3: PlantUML visualizations (sequence diagram of failure path + C4 component diagram); Step 4: Problem table (root cause / contributing / gap / smell / wiring, with severity); Step 5: Implementation risk matrix; Step 6: Recommendations (hotfix / full fix / prevention) |
| **Quality bar** | Every file cited with exact line numbers; root cause must be confirmed by reading code (not guessed); diagram must be drawable (if it can't be drawn, reconnaissance is incomplete); no fix proposed before root cause is localized |
| **Escalation path** | Outputs risk matrix with "mandatory mitigation" items for human review |
| **Next action** | Separate TDD SOP invoked for the fix (or `/pipe tracing,tdd`) |
| **What to strip** | Russian-language role persona; specific runtime commands (`docker compose exec back alembic current`, port `55078`, `55079`) — replace with placeholders; specific participant names in PlantUML templates |
| **Notes** | The Feature Tracing mode checklist (Docker image freshness, wiring verification, migration status) is a standalone portable primitive. The "if you can't draw the diagram, you don't understand the problem yet" principle is universally applicable |

---

### SOP-5: Code Review Sentinel

| Field | Value |
|-------|-------|
| **Source file** | `agents/code-review-sentinel.md` |
| **Trigger / when to use** | After writing or modifying code; before committing; explicitly requested review |
| **Steps / contract** | 1. Understand requirements and context (read diff, check plan/spec); 2. Architecture & design review (layer violations, SOLID, abstraction correctness); 3. Code quality review (line length, typing, async patterns, error handling); 4. Test review — PRIMARY focus: triviality detection (mock assertions, vacuous truths, echo tests, type-system duplicates), coverage assessment (edge cases, error paths, LLM soft thresholds); 5. Security review (input validation, injection risks, file handling, auth, secrets, race conditions); 6. Risk assessment per finding (CRITICAL/HIGH/MEDIUM/LOW) |
| **Quality bar** | Every finding includes specific file:line; every trivial test flagged must have alternative suggested; decision is APPROVE / REQUEST CHANGES / BLOCK with justification |
| **Escalation path** | BLOCK on critical findings or security vulnerabilities |
| **Next action** | REQUEST CHANGES → developer fixes, re-review; BLOCK → no merge until resolved |
| **What to strip** | "Resume Matcher" project context block (Python/Telegram/OpenAI specific); hardcoded paths (`/Users/egurvanov/...`); agent-memory paths; `memory: project` frontmatter if not applicable; LLM-specific soft threshold guidance can be kept as a conditional note |
| **Notes** | The triviality detection taxonomy (AP1: mock assertions, AP2: echo tests, AP3: tests simpler than code) is the highest-value portable primitive here. The APPROVE/REQUEST CHANGES/BLOCK verdict framework is universal |

---

### SOP-6: Feature Planning / Requirements Completeness Check

| Field | Value |
|-------|-------|
| **Source file** | `agents/planner.md` |
| **Trigger / when to use** | New feature request; complex multi-file task; any task where requirements completeness is uncertain |
| **Steps / contract** | Phase 1: Requirements analysis — 6-criteria completeness check (Goal, Acceptance Criteria, Edge Cases, Dependencies, Test Plan, Scope); Phase 2: Codebase analysis — affected layers, read actual files, check existing patterns; Phase 3: Risk assessment (Architecture, DB, Testing, Performance, Security, each rated 🔴/🟡/🟢); Phase 4: Implementation plan (numbered steps with file, change, dependency, rationale) + test strategy table + commit breakdown |
| **Quality bar** | No guessing — read files to confirm structure; gaps in requirements explicitly flagged with proposed formulation; risks rated; no out-of-scope changes in plan |
| **Escalation path** | If requirements score < 4/6 — stop and ask user to clarify before proceeding |
| **Next action** | Hand plan to TDD SOP for implementation |
| **What to strip** | "Resume Matcher" project description and DDD layer table; hardcoded file paths; agent-memory references (`agent-discoverer/requirements.md`); `tools:` frontmatter restricting to specific bash commands |
| **Notes** | The 6-criteria completeness table is the portable primitive. The risk category table (Architecture / DB / Testing / Performance / Security) is universally applicable |

---

### SOP-7: Skill Pipeline Orchestrator

| Field | Value |
|-------|-------|
| **Source file** | `skills/pipe/SKILL.md` |
| **Trigger / when to use** | Task requires combining multiple methodologies sequentially (e.g., diagnose then implement, analyze then build) |
| **Steps / contract** | Step 1: Parse skill list from arguments; Step 2: Validate each skill exists; Step 3: Read each SKILL.md; Step 4: Run each skill sequentially in dedicated agent with full context handoff (never parallel); Step 5: Summary report. Context handoff types: analytic→implementation (solution + file plan + risks), analytic→analytic (findings + questions), implementation→implementation (files changed + remaining work) |
| **Quality bar** | Never run phases in parallel; full output of each phase passed to next; stop pipeline if any phase breaks tests |
| **Escalation path** | If phase breaks tests — STOP, inform user, offer retry/skip/abort |
| **Next action** | User decides on failure; pipeline reports file changes in final summary |
| **What to strip** | Russian-language role text; specific skill names that are project-only (deploy, describe) |
| **Notes** | The sequential execution constraint (never parallel) and stop-on-failure gate are the portable primitives. The context handoff taxonomy (analytic→implementation, etc.) is the key reusable structure |

---

### SOP-8: Session / Change Report

| Field | Value |
|-------|-------|
| **Source file** | `skills/session-report/SKILL.md` |
| **Trigger / when to use** | End of a work session; before standup; when stakeholder needs to understand what changed without reading code |
| **Steps / contract** | Step 1: Collect git diff --stat, untracked files, recent log; Step 2: Read key changed files (routes, schemas, domain entities, UI components, migrations) — ignore tests, linter changes, infra-only; Step 3: Group by user-facing feature (backend + frontend + migration = one feature, not separate items); Step 4: Output product-focused report with file stats header, feature descriptions, test count, migration list |
| **Quality bar** | Features named from user perspective ("Version history for descriptions"), not developer perspective ("Added description_versions table"); infra changes omitted unless user-impacting |
| **Escalation path** | None — reporting only |
| **Next action** | None — informational |
| **What to strip** | Russian-language output instruction; project-specific file path patterns (`packages/back`, `presentation/api/routes.py` etc.) — replace with generic patterns |
| **Notes** | The "user-perspective naming" rule (name features by what the user can now do, not what changed in code) is the portable primitive |

---

### SOP-9: Test-Suite Runner with Delta

| Field | Value |
|-------|-------|
| **Source file** | `skills/test-all/SKILL.md` |
| **Trigger / when to use** | Before any merge/release; CI gate; full regression check |
| **Steps / contract** | Step 1: Collect baseline count per package/layer; Step 2: Run all suites sequentially WITHOUT stopping on failure (collect full picture); Step 3: Report matrix (package/layer × total/passed/failed/skipped + delta vs baseline + lint/types verdict); Step 4: Verdict (✅ all passed / ❌ failures / ⚠️ skipped) + failure details (test name, file:line, traceback excerpt) |
| **Quality bar** | Never stop at first failure; delta column required if baseline captured; integration tests that cost money flagged with explicit warning |
| **Escalation path** | Failures surface to user; expensive integration tests require user confirmation before running (or ask about E2E requiring Docker) |
| **Next action** | Failures → Break-Stop SOP |
| **What to strip** | Specific runner commands (`uv run pytest`, `npx vitest`); package paths (`packages/back`, `packages/front`, `packages/e2e`); Docker-specific checks — replace with placeholders for stack adaptation |
| **Notes** | The "don't stop on first failure — collect the full picture" principle is the core portable primitive. The baseline-delta comparison is a high-value addition to standard CI output |

---

### SOP-10: LLM Security Rules

| Field | Value |
|-------|-------|
| **Source file** | `rules/arch/LLM_SECURITY.md` |
| **Trigger / when to use** | Any codebase that integrates an LLM API; scoped to LLM integration and application layer files |
| **Steps / contract** | Rules: (1) LLM output never controls authorization/access decisions; (2) LLM output = untrusted input — validate structure, types, ranges; (3) User input isolated from system prompt (prompt injection prevention); (4) LLM output never passed raw to SQL, shell, eval, template engines; (5) Structured output parsed to typed model with error handling; (6) Retry logic bounded and logged; (7) LLM output not used to generate paths, URLs, or identifiers for direct use |
| **Quality bar** | Anti-patterns are absolute prohibitions with no exceptions ("not even temporarily, not even in dev") |
| **Escalation path** | Architecture test R8 automates enforcement via AST scan; violations are BLOCK-level in code review |
| **Next action** | Fix before merge; no exceptions |
| **What to strip** | Project-specific LLM field names (`score`, `explanation`, `risks`, `generated_question`, `title`) — keep as examples; specific file paths in paths frontmatter |
| **Notes** | The "LLM forms content, never makes decisions" principle (scores are informational, never controlling) is the core portable primitive |

---

### SOP-11: Unit Test Contracts

| Field | Value |
|-------|-------|
| **Source file** | `rules/arch/UNIT_TESTS.md` |
| **Trigger / when to use** | All unit test files; scoped to `tests/unit/**` |
| **Steps / contract** | Requirements: (1) Module docstring on every test file; (2) Docstring on every test function (what + expected result); (3) `pytestmark` at module level for markers (not per-function decorators); (4) No setUp/tearDown — factory functions instead; (5) No mock-assertion tests (AP1); (6) No echo tests / trivial constructor tests (AP2); (7) No tests simpler than the code being tested (AP3); (8) No shared mutable state — each test creates its own dependencies; (9) Test data as module-level constants with section separators |
| **Quality bar** | AP1/AP2/AP3 anti-patterns are hard prohibitions; all rules UT1–UT5 are machine-validated in the source repo |
| **Escalation path** | Code Review Sentinel flags violations; architecture tests (UT1, UT2, UT4, UT5) can automate enforcement |
| **Next action** | Fix before merge |
| **What to strip** | Python/pytest-specific syntax; `pytestmark = pytest.mark.asyncio` → generic async marker convention |
| **Notes** | AP1 (no mock-assertion tests) and the "test behavior not implementation" principle are the most universally applicable primitives |

---

### SOP-12: Meta-Rules for Rule Authoring

| Field | Value |
|-------|-------|
| **Source file** | `rules/meta-rules.md` |
| **Trigger / when to use** | When proposing a new rule or convention; scoped to `.claude/rules/**` |
| **Steps / contract** | Rules: (1) Every rule file must have `paths:` YAML frontmatter scoping when it activates; (2) One topic per file; (3) Rules must be project-agnostic — no ticket IDs, no project-specific paths, no personal info; (4) Proactively propose rules when: user establishes convention, pattern repeats across 2+ sessions, user corrects agent behavior, architectural decision is made; (5) Propose in session, do not silently add; (6) Do not add: one-off decisions, info already in CLAUDE.md, temporary workarounds |
| **Quality bar** | Universality check — could this rule apply to any codebase? If not, it belongs in CLAUDE.md not in rules |
| **Escalation path** | None — governance only |
| **Next action** | Propose to user: "Would you like me to add this as a rule so I remember it permanently?" |
| **What to strip** | `.claude/rules/**` path reference — replace with generic rule directory; `CLAUDE.md` reference — replace with generic "project config" |
| **Notes** | The "rule vs project config" distinction and the proactive proposal trigger list are the portable primitives |

---

## 5. Source-to-Portable Split Summary

| Category | Total items | Port | Leave out |
|----------|-------------|------|-----------|
| Skills (slash commands) | 10 | 7 | 3 (deploy, describe, triz) |
| Agents | 3 | 2 | 1 (ui-ux-engineer) |
| Rule groups | ~8 groups | 4 groups (break-stop, git, meta-rules, arch rules) | 4 groups (frontend-*, makefile, monorepo, 12-factor env) |
| **Total SOP candidates** | — | **12** | ~10 |

**Portability ratio:** ~55% of content is directly portable or portable with stripping. The remaining 45% is project-specific (hardcoded paths, Docker commands, specific stack) or tool-specific (React/Vitest, Makefile, Alembic) and would require full rewriting rather than stripping.

---

## 6. SOPs Ranked by Portability

### Tier 1 — Port as-is with light stripping (persona/paths only)

1. **Break-Stop Rule** (`rules/break-stop.md`) — zero stack coupling, universal protocol
2. **Structured Git Commit** (`skills/commit/SKILL.md` + `rules/git.md`) — stack-neutral, language-neutral
3. **Meta-Rules for Rule Authoring** (`rules/meta-rules.md`) — governance SOP, no stack coupling
4. **LLM Security Rules** (`rules/arch/LLM_SECURITY.md`) — universal for any LLM integration
5. **Unit Test Contracts** (`rules/arch/UNIT_TESTS.md`) — anti-patterns are language-neutral; syntax is Python-specific

### Tier 2 — Port with moderate stripping (project context blocks, role persona, runner commands)

6. **Code Review Sentinel** (`agents/code-review-sentinel.md`) — remove project context, keep review framework
7. **Feature Planning / Requirements Completeness** (`agents/planner.md`) — remove DDD layer table, keep 6-criteria check
8. **Session / Change Report** (`skills/session-report/SKILL.md`) — remove file path patterns, keep product-framing rule
9. **Skill Pipeline Orchestrator** (`skills/pipe/SKILL.md`) — remove Russian role text, keep sequential execution contract

### Tier 3 — Port with heavy stripping (runner commands, stack-specific checks, all diagrams need adaptation)

10. **TDD Workflow** (`skills/tdd/SKILL.md`) — substantial value but heavy Python/pytest coupling; layer ordering portable
11. **Incident & Bug Tracing** (`skills/tracing/SKILL.md`) — runtime checks are Docker/port specific; tracing methodology portable
12. **Test-Suite Runner with Delta** (`skills/test-all/SKILL.md`) — runner commands fully project-specific; protocol portable

---

## 7. Cross-Cutting Protocol Primitives

These are sub-SOP primitives that appear across multiple skills/rules and should be extracted as standalone reusable behaviors:

### P1: Human Approval Gate
**Appears in:** commit SOP (Step 5), break-stop rule, pipe orchestrator  
**Contract:** Before any irreversible action (commit, destructive change, phase transition after failure) — show plan, wait for explicit user confirmation, never proceed autonomously  
**Key pattern:** Show what will happen → ask → wait → act

### P2: Stop-on-Red / Escalation Banner
**Appears in:** break-stop rule, TDD SOP (Step 5), pipe orchestrator  
**Contract:** Output verbatim red banner + what broke + cause + options → STOP → wait for user  
**Key pattern:** Never silently fix broken functionality; always surface to human  
**Severity split:** Trivial (formatting) → silent fix OK; Functional breakage → hard stop

### P3: Reconnaissance Before Action
**Appears in:** TDD SOP (Step 0), tracing SOP (Step 0), planner (Phase 2)  
**Contract:** Read actual files before writing any code or forming any diagnosis; "don't guess — read"  
**Key pattern:** Glob/Grep to find files → Read to confirm structure → then act

### P4: Visualization as Proof of Understanding
**Appears in:** TDD SOP (Step 1), tracing SOP (Step 3)  
**Contract:** If you can't draw the diagram (sequence + activity/C4), your reconnaissance is incomplete; diagram = proof of understanding before acting  
**Key pattern:** PlantUML sequence + activity/C4 required before test plan or root cause claim

### P5: Test-First Discipline
**Appears in:** TDD SOP, code-review-sentinel, unit test contracts  
**Contract:** No implementation before failing tests; "no red test, no requirement"  
**Key pattern:** Write test → confirm it fails for the right reason → then implement

### P6: User-Perspective Naming
**Appears in:** session-report SOP  
**Contract:** Name features/changes from user perspective, not implementation perspective  
**Key pattern:** "User can now do X" not "Added table Y"

### P7: Completeness Check Before Starting
**Appears in:** planner SOP, code-review-sentinel  
**Contract:** 6-criteria requirements check before implementation; explicitly flag gaps  
**Key pattern:** Check Goal / AC / Edge Cases / Dependencies / Test Plan / Scope → score/6 → if <4/6 stop and ask

### P8: Destructive Tester Mindset
**Appears in:** TDD SOP (self-check section)  
**Contract:** For every feature: What's on the critical path? Boundaries? Garbage input? Load? Dependencies down? Impossible states?  
**Key pattern:** 6-question checklist + corner-case table per input parameter

### P9: Layer-Order Implementation
**Appears in:** TDD SOP (Step 4), tracing SOP (chain tracing)  
**Contract:** Implement in domain → application → infrastructure → presentation → frontend order (innermost first)  
**Key pattern:** Never couple outer layers before inner contracts are established

### P10: Proactive Rule Proposal
**Appears in:** meta-rules  
**Contract:** When a pattern repeats, when user corrects agent, when architectural decision is made → propose adding a rule  
**Key pattern:** "Would you like me to add this as a rule so I remember it permanently?"

---

## 8. Recommendation: What Should Ship by Default in `.agents`

### Must ship (universal, highest ROI):

1. **`sop/break-stop.md`** — from `rules/break-stop.md` — global scope (`**/*`). The single highest-value safety primitive; every agent workflow depends on it.

2. **`sop/commit.md`** — from `skills/commit/SKILL.md` + `rules/git.md` — applies to any repo with git. Structured What/Why/Details + approval gate.

3. **`sop/requirements-completeness.md`** — from `agents/planner.md` Phase 1 — the 6-criteria check as a standalone primitive, callable before any implementation.

4. **`sop/llm-security.md`** — from `rules/arch/LLM_SECURITY.md` — ship for any project that integrates an LLM. Absolute prohibitions are the right default.

5. **`sop/unit-test-contracts.md`** — from `rules/arch/UNIT_TESTS.md` — the AP1/AP2/AP3 anti-patterns as default test review rules.

6. **`sop/rule-authoring.md`** — from `rules/meta-rules.md` — meta-governance for the rule system itself; enables the system to grow correctly.

### Ship as opt-in (require stack adaptation before use):

7. **`sop/tdd-workflow.md`** — from `skills/tdd/SKILL.md` — heavy value but requires runner command adaptation.

8. **`sop/incident-tracing.md`** — from `skills/tracing/SKILL.md` — requires runtime command adaptation.

9. **`sop/code-review.md`** — from `agents/code-review-sentinel.md` — requires project context injection.

10. **`sop/session-report.md`** — from `skills/session-report/SKILL.md` — requires file path pattern adaptation.

### Do not ship by default:

- Deploy skill (project-specific)
- Describe skill (project-specific)
- TRIZ (requires trained practitioner)
- Frontend rules (React/Vitest-specific)
- 12-Factor env rules (better as reference link)

---

## 9. Evidence: Specific File/Line Citations

1. **`skills/tdd/SKILL.md` lines 1-10 (frontmatter):** `model: opus`, `effort: max` — signals that TDD is intentionally expensive; this is a deliberate quality investment, not oversight.

2. **`skills/tdd/SKILL.md` "Шаг 1: Визуальный анализ потока"** (approx. lines 35-90): PlantUML diagrams are marked as a MANDATORY step — "без него к тест-плану переходить НЕЛЬЗЯ" (cannot proceed to test plan without it). Diagram = proof of understanding.

3. **`rules/break-stop.md` lines ~15-25:** "You do NOT have authority to fix broken functionality on your own" — explicit authority delegation model encoded in the rule. The hardcoded banner text is designed to be copy-pasted verbatim, making the escalation unambiguous.

4. **`rules/break-stop.md` Severity Levels section:** The trivial/non-trivial split — formatting (silent fix OK) vs functional breakage (hard stop) — is a critical decision tree that prevents both over-stopping and under-stopping.

5. **`agents/code-review-sentinel.md` "TEST REVIEW (Primary Focus)"** section: "This is your most critical responsibility" — explicit priority ordering. The triviality taxonomy (mock assertions, vacuous truths, echo tests, type-system duplicates) is the highest-density portable primitive in the repo.

6. **`agents/code-review-sentinel.md` Decision Framework:** `APPROVE / REQUEST CHANGES / BLOCK` with exact conditions — no critical/high findings for APPROVE; security vulnerabilities for BLOCK. This is a portable verdict framework applicable to any code review agent.

7. **`skills/commit/SKILL.md` Step 5:** "Дождись подтверждения пользователя. НЕ коммить без одобрения." (Wait for user confirmation. Do NOT commit without approval.) — The approval gate is explicit and non-negotiable. Never auto-pushes is a separate hard rule.

8. **`skills/tracing/SKILL.md` Feature Tracing mode, Step 0:** The "delivery checklist" (Docker image freshness, migration status, frontend bundle freshness, wiring verification) encodes a complete deployment verification protocol as a structured checklist — portable to any service-based deployment.

9. **`agents/planner.md` Phase 1 table:** The 6-criteria requirements completeness check (Goal, Acceptance Criteria, Edge Cases, Dependencies, Test Plan, Scope) with explicit "requires supplementing" guidance is a standalone reusable primitive for any planning workflow.

10. **`rules/arch/LLM_SECURITY.md` "Главное правило":** "LLM-output НИКОГДА не используется для принятия решений о доступе... Нет исключений. Даже 'временно'. Даже 'в dev'." — The absolute prohibition framing (no exceptions, not even temporarily) is the correct default stance for any LLM integration security rule.

11. **`rules/arch/UNIT_TESTS.md` AP1 anti-pattern:** The prohibition on mock-assertion tests ("assert_called_once_with... тестируешь реализацию, не поведение") with a concrete before/after example is directly portable to any language with mock libraries.

12. **`skills/pipe/SKILL.md` Step 4.2:** "НЕ запускай агентов параллельно — каждый следующий зависит от предыдущего" (Do NOT run agents in parallel — each depends on the previous) — the sequential execution constraint for pipelines is a universal architecture primitive for multi-phase agent workflows.

13. **`rules/meta-rules.md` "Universality" section:** "Rules MUST be project-agnostic and reusable across any codebase — No specific task/ticket IDs, No references to files or directories that exist only in a particular project" — this self-referential rule encodes the portability criterion used in this audit.

14. **`skills/session-report/SKILL.md` Step 3 / Step 4:** "Называй фичи с точки зрения пользователя ('История версий описания'), а не разработчика ('Добавлена таблица description_versions')" — the user-perspective naming primitive is universally applicable to any change communication workflow.

---

## 10. Interpretation vs Direct Evidence Note

**Direct evidence:** All SOP structures, step sequences, quality bars, anti-patterns, and decision trees cited above are directly quoted or closely paraphrased from source files with file/line context.

**Interpretation:** The grouping into Tiers 1/2/3 portability, the "cross-cutting primitives" extraction, and the "ship by default" recommendations are analytical judgments made by this auditor based on: (a) absence of project-specific coupling in the source text, (b) general applicability of the protocol to non-Python/non-React stacks, and (c) ROI assessment of stripping cost vs value delivered.

**Not in scope:** Individual DDD architecture rules (`AGREGATES.md`, `COMMANDS.md`, etc.) and database rules were reviewed at directory level only — these are constraints/conventions, not procedural SOPs, and are better handled as reference material than as portable agent instructions.

---

## 11. Supplementary Candidates (Scout 3 Pass)

> **Scope note:** This section records two additional portable SOP candidates surfaced during a deep pass over the `rules/arch/` subtree. They were absent from the original 12-SOP set above. Both files were examined at full depth against the portability criteria in Section 5.

---

### SOP-S1: Structured Logging Contract

| Field | Value |
|-------|-------|
| **Source file** | `rules/arch/LOGS.md` |
| **Portability tier** | **Tier 2** — port with moderate stripping (remove Russian-language section headers, remove project-specific service names used in the example log record) |
| **Trigger / when to use** | Any codebase with application-layer logging; scoped to `src/**/*.py` in source repo — generalise to `src/**/*` for language-agnostic use |
| **Core contract** | Logging is an architectural concern, not a debugging mechanism. Logs are never the source of truth (aggregates, events, and the database are). All log records are **structured JSON** (or equivalent); free-text log lines are forbidden. |
| **Required fields (every record)** | `timestamp` · `level` · `service` · `environment` · `message` · `correlation_id` |
| **Optional context fields** | `command_id` · `request_id` · `aggregate_id` · `aggregate_type` · `event_id` · `tenant_id` |
| **Write-path (command) rules** | Log on command entry **and** exit; record command type, aggregate_id, aggregate version before/after, result (success/failure); **never log the full command payload** |
| **Read-path (query) rules** | Log aggregated, not per-row; record query type, pagination params, result count, latency; **no PII** |
| **Event logging rules** | Record the fact of publication only: `event_id`, `event_type`, `aggregate_id`; **never log event payload**; delivery errors logged separately from processing errors |
| **Log levels** | `ERROR` — operation did not complete, requires action · `WARN` — deviation from normal, system continues · `INFO` — significant business transitions · `DEBUG` — diagnostic, not always on · `TRACE` — local-only noise. Levels must never be used to hide problems; if information is business-critical it is INFO, not DEBUG |
| **Hard prohibitions** | ❌ Log full payload · ❌ Log PII or secrets · ❌ Use logs as an event store · ❌ Debug-level logs in production · ❌ Any log record missing `correlation_id` |
| **Correlation ID rule** | `correlation_id` is mandatory and must be propagated across commands, events, and async processes. Absence of `correlation_id` is an **architectural defect**, not a minor omission. |
| **Quality bar** | Every log path (write/read/event/error) follows its own sub-contract; alerts are built on signals (ERROR rate growth, latency growth, repeated domain failures) — never on DEBUG/TRACE |
| **Minimum canonical record** | `{"timestamp":"…","level":"INFO","service":"<service>","message":"command_succeeded","command":"<CommandName>","aggregate_id":"<id>","version":<n>,"correlation_id":"<id>"}` |
| **Escalation path** | Violations (missing correlation_id, logged PII, raw payload in logs) are BLOCK-level findings in Code Review Sentinel |
| **What to strip** | Russian-language section headers (translate to English equivalents already present in the rules); the `"service":"billing"` and `"command":"PayInvoice"` example values — replace with `<service>` / `<CommandName>` placeholders; `paths: src/**/*.py` frontmatter — widen to `src/**/*` |
| **Notes** | The `correlation_id`-is-mandatory-or-defect rule and the write-path/read-path/event-path split are the highest-value portable primitives. This contract cleanly separates *what* to log at each architectural layer, making it directly applicable to any layered backend regardless of language or framework. The retention sub-rules (ERROR/WARN longer; DEBUG/TRACE minimal) are a useful operational addition. |

---

### SOP-S2: State Ownership — Backend Is the Single Source of Truth

| Field | Value |
|-------|-------|
| **Source file** | `rules/arch/STATE_OWNERSHIP.md` |
| **Portability tier** | **Tier 1** — port with light stripping (remove project-specific column names and React/TypeScript-specific R2 examples; keep all 6 rules, all anti-patterns, and the architecture consequence section) |
| **Trigger / when to use** | Any full-stack codebase with a backend API and a client (web, mobile, CLI); applies whenever a new state-changing feature is designed or reviewed |
| **Core principle** | The backend owns all mutable state. The frontend is a **stateless projection**: it renders what the backend returns, sends user intentions as API calls, and re-fetches to reflect new state. It never computes domain logic or manages state independently. |
| **Rules (R1–R6)** | **R1 — Backend owns all mutable state:** Every piece of persisted data lives in the backend database and is exposed via API. Domain entity fields, computed state, process state, and relationships all belong here. **R2 — Frontend never computes domain logic:** The frontend displays values from API responses; it never re-implements business rule evaluation, state transitions, or data-integrity validation. Allowed on frontend: pure UI state (modals, loading spinners), display-only sort/filter of already-fetched data, date formatting. **R3 — Every state change goes through the backend:** The mandatory flow is `User action → API call → Backend mutates → Frontend re-fetches → UI updates`. The reverse (`frontend mutates local state → maybe tells backend later`) is forbidden. **R4 — Backend exposes computed fields:** If the frontend needs a derived value (status, counts, flags), the backend includes it in the API response; the frontend never derives it independently. **R5 — State transitions are domain methods:** Logic that changes entity state lives in the domain layer and is called by use cases; the frontend only observes the result via the API response. **R6 — Optimistic updates allowed but backend is authoritative:** Instant UI feedback is acceptable; however the API call must still happen, the UI must revert on failure, and the backend response is always the final truth. |
| **Architecture consequence** | New features that change state start from the backend: `entity → use case → route → schema → frontend`. The frontend is last. New fields needed on the frontend are added to the domain entity first, propagated through DB model → schema → API response → frontend type. The dependency direction is always `domain → infra → presentation → frontend`. |
| **Anti-patterns** | 1. **Frontend-driven state** — UI toggle that only changes local state with no backend endpoint; 2. **Duplicated business rules** — re-implementing backend computed logic in the client; 3. **Stale state** — caching API responses and showing outdated data; 4. **Implicit state** — deriving behavior from URL params or local storage instead of explicit backend fields; 5. **Fire-and-forget mutations** — calling an API but not re-fetching, relying on local assumptions about what changed |
| **Quality bar** | Any state mutation without a corresponding backend endpoint is a design violation; any domain logic duplicated on the frontend is a BLOCK-level code review finding |
| **Escalation path** | R2/R3 violations (frontend-computed domain logic, local-only state mutations) are BLOCK findings in Code Review Sentinel; R6 violations (API call omitted on optimistic update) are HIGH findings |
| **What to strip** | R3 example table (contains project-specific endpoint paths like `/collectors/{id}/start` and column names like `is_watching` — replace with generic `POST /<resource>/{id}/<action>` form); R5 Python code example (keep the domain-method concept, replace with pseudocode or language-agnostic description); R2 "Allowed on frontend" bullet referring to React-specific patterns — generalise to "pure UI state" without framework names |
| **Notes** | The R3 canonical flow diagram (`User action → API call → Backend mutates → Frontend re-fetches → UI updates`) and the five-item anti-pattern list are the highest-value portable primitives. The "architecture consequence" paragraph (`start from backend, frontend is last`) is a concise, stack-neutral design heuristic directly applicable to any client–server system. This rule complements SOP-9 (Layer-Order Implementation, primitive P9) and makes the frontend-last ordering explicit as a state-ownership constraint rather than merely an implementation order preference. |

---

### S-Series Portability Summary

| SOP | Source | Tier | Key primitive | Ship default? |
|-----|--------|------|---------------|---------------|
| S1: Structured Logging Contract | `rules/arch/LOGS.md` | 2 | `correlation_id` mandatory; write/read/event log path split; hard PII/payload prohibitions | **Opt-in** (valuable for any backend; log field set needs minor adaptation per stack) |
| S2: State Ownership | `rules/arch/STATE_OWNERSHIP.md` | 1 | R3 canonical flow; five anti-patterns; "frontend is last" architecture consequence | **Must ship** for any full-stack project; zero stack coupling after stripping R3 example table and R5 Python snippet |

### Impact on Section 8 Recommendations

- **S2 (State Ownership)** qualifies as a **must-ship** addition alongside the six listed in Section 8. It is Tier 1 portable and provides the missing full-stack state discipline primitive not covered by the existing 12 SOPs.
- **S1 (Structured Logging Contract)** qualifies as an **opt-in** addition at the same level as the existing Tier 2/3 SOPs (items 7–10 in Section 8). It adds operational depth for teams already using structured logging; it should not be a default because it requires log-field adaptation per stack and service topology.

### Evidence Citations for S-Series

1. **`rules/arch/LOGS.md` "Корреляция и трассировка" section:** "Correlation ID обязателен и должен быть сквозным. Отсутствие correlation_id является архитектурным дефектом." — The hard architectural-defect framing (not a best-practice recommendation) is the portable primitive that distinguishes this contract from generic logging advice.

2. **`rules/arch/LOGS.md` "Запрещено (жёстко)" section:** Absolute prohibitions include logging full payload, PII, secrets, using logs as an event store, and any log record without correlation. The same "no exceptions" framing used in LLM Security (SOP-10) is used here — confirming consistent rule-authoring philosophy across the repo.

3. **`rules/arch/STATE_OWNERSHIP.md` R3 flow:** The explicit `User action → API call → Backend mutates → Frontend re-fetches → UI updates` vs `User action → Frontend mutates local state → (maybe) tells backend later` contrast is a portable decision tree applicable to React, Vue, Angular, iOS, Android, CLI clients, or any other frontend technology.

4. **`rules/arch/STATE_OWNERSHIP.md` "Architecture Consequence" section:** "New features that change state → start from backend (entity → use case → route → schema)" — this one-sentence heuristic encodes the entire state-ownership principle as an actionable planning rule, making it the most concise portable primitive in the file.

5. **`rules/arch/STATE_OWNERSHIP.md` R2 "Forbidden on frontend" list:** Business rule evaluation, state transitions, and validation that affects data integrity are explicitly enumerated as forbidden — not as a general principle but as a concrete three-item checklist applicable in code review.

