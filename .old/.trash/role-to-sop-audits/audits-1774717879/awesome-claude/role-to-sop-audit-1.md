# Audit: awesome-claude → role-to-sop
**Date:** 2026-03-28  
**Source repo:** `.references/awesome-claude/`  
**Auditor:** role-to-sop pipeline, pass 1

---

## 1. Repo Overview

`awesome-claude` is a private engineering team's Claude configuration repository built around at least one production product (a Resume Matcher service, Telegram bot, and React frontend, with a Python DDD/CQRS/event-driven backend using aiogram, FastAPI, SQLAlchemy, and MinIO). The apparent primary author is "egurvanov" (inferred from hardcoded memory paths such as `/Users/egurvanov/...` in `agents/code-review-sentinel.md`). The repo codifies the team's operational standards as Claude-readable rules, agent role definitions, and skill workflows rather than as human-only documentation. Nearly all prompt prose is written in Russian, which is the primary portability barrier throughout. The content is unusually sophisticated: it includes not just style preferences but automated architectural enforcement (AST-based pytest tests), a full TRIZ/ARIZ-85V problem-solving skill, zero-downtime migration SOPs, LLM output trust-boundary rules, and a multi-skill pipeline runner. The depth and completeness of coverage—spanning DDD modeling, DB migrations, observability, security, testing, and agent orchestration—suggest this was built iteratively over many months of production use.

---

## 2. Content Summary

The repo is organized into three top-level directories: `agents/`, `rules/`, and `skills/`. Agent files are flat markdown files in `agents/` defining role personas and multi-step processes (e.g., planner, code-review-sentinel, ui-ux-engineer). Rules occupy the deepest tree: `rules/arch/` contains standalone files (LOGS.md, MONITORING.md, STATE_OWNERSHIP.md) alongside three subdirectories — `db/` (MIGRATIONS, TRANSACTIONS, WRITE_MODEL, READ_MODEL, INDEXES, CONSTRAINTS, VERSIONING, PERFORMANCE, NORMAL_FORMS, SECURITY, RETENTION, SEEDS_FIXTURES), `components/` (AGGREGATE_STRUCTURE, AGREGATES, COMMANDS, DOMAIN, EVENTS, ONE_AGGREGATE_ONE_REPO, QURIES, SHARED_KERNEL), and `functions/` split into `practice/` (code-smell catalogs: CHANGE_BREAKERS, DEPS, INFLATORS, OOP_DESIGN, TRASHERS) and `techs/` (refactoring playbooks: CONDITIONS, DATA, FUNCTIONS, GENERALIZATIONS, METHODS, SIMPLIFY). Skills follow the `skills/<name>/SKILL.md` convention with companion tooling where needed (commit, tdd, triz, pipe, deploy, describe, session-report, test-all, tracing, ui). Top-level rules files (`break-stop.md`, `meta-rules.md`, `git.md`, `frontend-design.md`, `frontend-testing.md`, `makefile.md`, `monorepo-structure.md`, `ui-library.md`) encode cross-cutting conventions. Every file uses YAML frontmatter, most with `paths:` glob arrays for scoping. The total coverage is unusually broad: the repo functions as a complete engineering operating manual encoded for an AI agent.

---

## 3. SOP Split

### Port (with stripping)

| File | Short description | Reason to port |
|------|-------------------|----------------|
| `rules/break-stop.md` | Hard-stop on test/lint failure; proactive pre-warning before destructive changes | Framework-agnostic; severity split (auto-fix trivial / hard-stop non-trivial) and proactive-protection clause are rare, high-value patterns |
| `rules/meta-rules.md` | Heuristics for when to capture a new rule; portability contract for rule authoring | "When-to-propose" triggers (≥2 sessions, user correction) and the universality contract (no task IDs, no project paths) are directly reusable governance patterns |
| `agents/code-review-sentinel.md` | 6-step post-write code review; APPROVE/REQUEST CHANGES/BLOCK decision framework | Review process, severity taxonomy (🔴/🟠/🟡/🟢), test-triviality detection, and security checklist are fully portable; project-specific DDD context must be stripped |
| `agents/planner.md` | 4-phase planning loop with 6-criteria requirements scorecard and 5-category risk matrix | Scorecard and risk matrix are extractable gems; planning discipline is broadly applicable after stripping Resume Matcher architecture and Russian output |
| `rules/arch/LLM_SECURITY.md` | Treat LLM output as untrusted; no LLM output in auth decisions; structured-output validation | One of the strongest security candidates; hard "no exceptions" stance; directly applicable to any LLM integration |
| `skills/commit/SKILL.md` | 7-step git commit workflow with mandatory user-approval gate and explicit-file staging | Approval gate before commit and What/Why/Details message structure are high-value; good complement or replacement for existing `gc` skill |
| `skills/tdd/SKILL.md` | Complete Red→Green→Refactor loop with per-layer test strategy and destructive-tester mindset | Phase structure, corner-case matrix, and anti-patterns list are highly portable; toolchain references (pytest, PlantUML) must be stripped |
| `skills/tracing/SKILL.md` | Incident vs feature-tracing dual-mode investigation with chain-of-layers checklist and risk matrix | Feature-wiring checklist (router registered? migration applied? bundle fresh?) is a rare, valuable pattern; stack commands must be stripped |
| `rules/arch/STATE_OWNERSHIP.md` | Backend-as-source-of-truth; frontend as stateless projection; allowed-vs-forbidden UI state split | Allowed/forbidden split on frontend state is the most commonly violated rule in full-stack agent code; strip project-specific table rows |
| `rules/arch/db/MIGRATIONS.md` | Expand→Deploy→Migrate→Contract 4-phase pipeline; prohibited ops; 8-field safety checklist | Universally applicable; checklist density is the highest of any file; prohibited-ops list prevents data loss |
| `rules/arch/ARCH_TESTS.md` | 12 DDD layer-boundary rules + LLM output security rule enforced via AST pytest tests | LLM output in auth gating (R8) and schema contract (R9) are rare, high-signal portable policies; strip Python paths and stack names |
| `rules/arch/UNIT_TESTS.md` | Three anti-patterns (mock-call assertions, echo tests, simpler-than-code tests) + per-layer structure | AP1–AP3 anti-patterns block is language-agnostic and stands alone as a reusable test-quality policy |
| `rules/arch/db/TRANSACTIONS.md` | One-aggregate-per-transaction; outbox-in-same-tx; 11-field outbox contract; side-effects after commit | Outbox schema and antipattern list are the strongest portable artifacts; written entirely in Russian |
| `skills/triz/SKILL.md` | Full ARIZ-85V problem-solving: mini-task, contradictions, IFR, 40 principles, vepole, RVS | Highest-quality reasoning-framework skill in corpus; software-mapping column on 40 principles is a unique differentiator; portability blocked only by Russian language |
| `skills/pipe/SKILL.md` | Parse comma-delimited skill list → validate → run sequentially → gate on test breakage → report | Anti-patterns section (no parallel phases, halt on broken tests, no summary-only handoff) is high-signal portable guidance; implementation must be abstracted |
| `agents/ui-ux-engineer.md` | 6-phase TDD loop for UI with component design template and anti-patterns table | Anti-patterns table (hardcoded colors → tokens, div → button, tests before code) and component design template are cleanly portable |
| `rules/arch/db/WRITE_MODEL.md` | Aggregate-bound write-model design, transactional boundaries, and safe migration guidance | One-aggregate-per-transaction and root-table modeling are broadly reusable |
| `rules/arch/LOGS.md` | Structured logging contract: mandatory fields, payload redaction, correlation_id propagation | General and implementation-agnostic; portable core is mandatory fields and PII redaction |
| `rules/arch/MONITORING.md` | Prometheus-first metric naming, cardinality rules, SLO definition, and alerting patterns | Broadly applicable; portable core is `/metrics` contract plus low-cardinality labels and SLO-driven alerts |
| `rules/arch/components/AGREGATES.md` | General DDD aggregate policy: boundaries, invariants, atomic commits, eventual consistency between aggregates | Stack-agnostic; strong reusable guidance on aggregate boundaries and one root |
| `rules/arch/components/COMMANDS.md` | CQRS write-side: one command per aggregate, no business logic in DTOs, handler orchestration only | Cleanly portable; stack-agnostic write-intent separation |
| `rules/arch/components/DOMAIN.md` | DDD modeling guidance: bounded contexts, ubiquitous language, aggregates, domain services | Broadly applicable checklist for modeling domains |
| `rules/arch/components/EVENTS.md` | Immutable domain events: post-commit publication, minimal payload, metadata discipline, idempotent handling | Portable event-driven architecture guidance; post-commit publication pattern is universally applicable |
| `rules/arch/components/QURIES.md` | CQRS read-side: read/write separation, projection-based read models, predictable query performance | Broadly applicable; portable core is design-queries-first with explicit freshness SLA |
| `rules/arch/functions/practice/CHANGE_BREAKERS.md` | Code-smell catalog: Divergent Change, Shotgun Surgery, Parallel Inheritance Hierarchies | Language-agnostic refactoring signals; directly portable |
| `rules/arch/functions/practice/DEPS.md` | Dependency smell catalog: Feature Envy, Inappropriate Intimacy, Message Chains, Middle Man | General coupling problems; not tied to framework or language |
| `rules/arch/functions/practice/INFLATORS.md` | Size/complexity smells: Long Method, Large Class, Primitive Obsession, Long Parameter List, Data Clumps | Broadly applicable refactoring heuristics |
| `rules/arch/functions/techs/CONDITIONS.md` | Conditional refactoring: guard clauses, consolidate conditionals, polymorphism, null object | Highly portable; maps directly to common code patterns in most languages |
| `rules/arch/functions/techs/DATA.md` | Data refactoring: value objects, encapsulation, symbolic constants, subtype/state conversions | Translates well across codebases |
| `rules/arch/functions/techs/FUNCTIONS.md` | Function/class refactoring: move method/field, extract/inline class, hide delegate, remove middle man | Common structural refactors with broad reuse |
| `rules/arch/functions/techs/GENERALIZATIONS.md` | Inheritance/interface refactors: pull up/push down, extract superclass/interface, collapse hierarchy | Standard cross-project patterns for normalizing hierarchies |
| `rules/arch/functions/techs/METHODS.md` | Method-level refactors: extract/inline method, parameter cleanup, method object, algorithm substitution | Language-agnostic; directly reusable |
| `rules/arch/functions/techs/SIMPLIFY.md` | Method-signature simplifications: parameter object, factory method, hide method, query/modifier separation | Broadly applicable SOP material |
| `rules/arch/db/SEEDS_FIXTURES.md` | Seeds-vs-fixtures split, idempotency, environment isolation | Minimal seed contract and non-prod-only fixtures transfer cleanly |

### Leave out

| File | Short description | Reason to exclude |
|------|-------------------|-------------------|
| `skills/describe/SKILL.md` | Project description prompt template | Explicitly project-specific; depends on repo's CLAUDE.md context; not an operational workflow |
| `rules/arch/SERVICES.md` | Service-layer boundaries for Telegram-specific handlers | Telegram handler and error name coupling make it non-portable as written; thin-handler pattern extractable only as a protocol primitive |
| `rules/arch/VIEWS.md` | Side-effect-free view contract | Anchored to specific project modules and architecture-test names; portable principle already covered by STATE_OWNERSHIP |
| `rules/arch/components/ONE_AGGREGATE_ONE_REPO.md` | 1:1 aggregate-to-repository mapping | Framed around repo-specific path conventions and architecture-test wiring; principle already captured in AGREGATES and ARCH_TESTS |
| `rules/arch/functions/practice/OOP_DESIGN.md` | OOP design smell list (diagnostic only) | Diagnostic list rather than executable SOP; smells covered by other smell catalogs in more actionable form |
| `rules/arch/functions/practice/TRASHERS.md` | Wasteful-constructs smell list | Skews toward identifying rather than prescribing; cleanup targets already implicit in CHANGE_BREAKERS and INFLATORS |
| `rules/arch/db/RETENTION.md` | Data retention and PII lifecycle rules | Exact TTLs and legal bases are domain/jurisdiction-specific; portable classification principle only |
| `skills/session-report/SKILL.md` | Session changelog with diff→group-by-feature→summarize | Bakes in repo-specific paths, tooling, and product-report format; feature-grouping heuristic extractable only as a primitive |
| `rules/arch/components/SHARED_KERNEL.md` | Shared immutable contracts for multiple aggregates | Heavily shaped by specific directory layout and example notification config; composition principle already covered in AGREGATES |

---

## 4. Per-SOP Table (Portable Candidates)

| # | Source file | Trigger | Steps / contract | Quality bar | Escalation | Strip | Notes |
|---|-------------|---------|-----------------|-------------|------------|-------|-------|
| 1 | `rules/break-stop.md` | Agent is about to continue after a test/lint/type-check failure, or will apply a change that breaks existing contracts | (1) Run check suite after every logical change. (2) On failure: emit alert banner → STOP → list what broke, likely cause, options. (3) Ask user for explicit decision; do not self-repair. (4) Resume only after suite is green and user confirms. (5) Proactive path: warn before applying a known-destructive change | Suite must be green before resuming; user must give explicit confirmation | Hard-stop; surface to user; no self-repair of broken functionality | `make check` → `<check command>` placeholder; Russian confirmation words "да"/"давай" → "yes"/"go ahead"; banner emoji art is flavour (keep semantics) | Proactive-protection clause (warn before, not after) is the rare high-value insert; severity split (auto-fix trivial formatting vs. hard-stop broken functionality) is the key portable insight |
| 2 | `rules/meta-rules.md` | Authoring or auditing agent rules; after a user correction; when a pattern has recurred ≥2 sessions | (1) Detect trigger: user establishes convention, pattern repeats ≥2 sessions, user corrects agent, non-obvious decision made. (2) Proactively propose capturing it as a persistent rule. (3) Ensure rule is project-agnostic: replace task IDs with `[TASK-ID]`, strip paths/names/keys/domain logic. (4) One topic per rule file; project-specific context belongs in repo config (e.g., CLAUDE.md). (5) Do not add rules for one-off decisions, info captured elsewhere, or temporary workarounds | Rule must be universally portable (no task IDs, no project-specific paths, no personal info, no business logic) | No escalation defined; governance is self-referential | Paths-scoping table (`.claude/rules/` tree), file-naming convention (UPPER_CASE.md), Russian proposal template, YAML `paths` frontmatter guidance | Universality contract is the strongest portable signal; "when to propose" heuristics (≥2 sessions, user correction → rule) are clean and actionable |
| 3 | `agents/code-review-sentinel.md` | After any code is written or modified — feature implementation, bug fix, or pre-commit | (1) Read recently modified files. (2) Architecture & design review — layer boundaries, abstractions, SOLID. (3) Code quality — typing, logging, async patterns, error handling. (4) Test review: triviality detection (mock-only, vacuous assertions, no edge cases), edge-case coverage, contract verification. (5) Security & risk: input validation, injection, file handling, auth scoping, secrets, error disclosure, race conditions. (6) Emit: Summary → Findings (severity + file + category + description + recommendation) → Test Assessment → Risk Summary → Decision (APPROVE / REQUEST CHANGES / BLOCK) | Decision requires one of three explicit verdicts with entry conditions; findings require file+category+description+recommendation | BLOCK verdict halts further work; surfaces to user | Project-specific DDD layer map; Python/aiogram/SQLAlchemy/MinIO coding rules; `requirements.md` handshake path; `/Users/egurvanov/...` memory path; `model: opus` / `memory: project` frontmatter; MEMORY.md boilerplate | Test-triviality detection section (mock-only, vacuously-true, no edge cases) is the standout portable contribution; three-tier decision framework with explicit entry conditions is clean and reusable |
| 4 | `agents/planner.md` | Receiving a new task, feature request, or bug; "plan this", "analyze requirements", "implementation plan" | (1) Phase 1 — Requirements analysis: score task against 6 criteria (Goal, Acceptance Criteria, Edge Cases, Dependencies, Test Plan, Scope); flag gaps with proposed wording. (2) Phase 2 — Codebase analysis: identify affected layers/files by *reading* them. (3) Phase 3 — Risk assessment: evaluate 5 categories (Architecture, DB, Testing, Performance, Security); assign severity per risk with mitigation. (4) Phase 4 — Implementation plan: numbered steps each with file → change → why → depends-on; test strategy table; commit structure | 6-criteria completeness gate before planning; risk matrix must be populated before implementation steps | Gap flagging in Phase 1 is the escalation mechanism; requires explicit coverage of edge cases and scope | Resume Matcher architecture tables; Russian-language output directive; agent-discoverer shared-context handoff block; `.claude/rules/arch/` path references; `[DD-N]` ticket convention; aiogram/DDD specifics | 6-criteria completeness scorecard is particularly strong — forces explicit coverage of edge cases and scope that most planning prompts omit; read-files-don't-guess discipline is a key portable principle |
| 5 | `rules/arch/LLM_SECURITY.md` | Any task involving LLM API integration, prompt construction, or processing LLM responses in application code | (1) Treat all LLM output as untrusted external input — validate structure, types, ranges; raise errors on invalid output, never silently fall back. (2) Never use LLM output for access control, authentication, or authorization decisions. (3) Isolate user-supplied content from system prompts — never concatenate user text directly into system prompt. (4) Sanitize LLM output before SQL/shell/eval/exec/template engines. (5) Parse LLM responses into strictly-typed structures; handle parse failures explicitly; limit and log retries. (6) Strip PII from LLM output logs. (7) LLM scores/ratings are informational only — thresholds belong in deterministic code | Hard "no exceptions, not even in dev" stance; antipattern code blocks must be preserved as illustrative examples | No exceptions; static-analysis candidate for R8 enforcement (see ARCH_TESTS) | Path globs in frontmatter (source-repo-specific); Russian language → translate to English on promotion | One of the strongest security candidates; hard no-exceptions stance is worth preserving verbatim; LLM-specific framing makes it distinct from general input-validation rules |
| 6 | `skills/commit/SKILL.md` | User wants to create a git commit, stage changes, draft a commit message, or follow project commit conventions | (1) Gather `git status`, `git diff HEAD`, `git log --oneline -5` in parallel. (2) Analyse diff — identify logical groups and files to skip (`.env`, credentials). (3) Resolve TASK-ID from `$ARGUMENTS` or default to omission. (4) Draft commit message: `[TASK-ID]: summary` + `## What changed` / `## Why` / `## Details` sections, ≤72-char title, imperative/lowercase. (5) Show staging plan + full message to user and **wait for approval**. (6) `git add <explicit files>` then `git commit` via heredoc. (7) `git status` + `git log -1` to verify | No `git add .`; no push without consent; no `--no-verify`; no credential commits; explicit user approval required before every commit | User approval gate is the escalation mechanism; hard-stop if user declines | Russian-language body text; `[TG-0]` project-specific placeholder → generalise or omit; `Co-Authored-By: Claude Opus 4.6 (1M context)` trailer → parameterise or remove; `.claude/rules/git.md` reference | Mandatory user-approval gate and What/Why/Details message structure are the highest-value portable elements; strong complement or replacement for existing `gc` skill |
| 7 | `skills/tdd/SKILL.md` | Implementing features, fixing bugs, or adding test coverage via TDD | (1) Reconnaissance — read existing code/fixtures, identify layers. (2) Visual flow analysis — produce sequence + activity diagrams; mark edit points. (3) Test plan — per-layer list with explicit "not needed / why" for skipped layers. (4) RED — write tests layer by layer, verify each fails for the right reason. (5) GREEN — write minimal implementation; run tests after each file. (6) Full verification — run check suite; break-stop rule on regression. (7) Refactor — only after full green; no behaviour changes; re-verify after each change. (8) Self-check — 5-question quality audit per test | Break-stop regression rule on any regression during verification; no refactor until full green | Break-stop integration (step 6) is the escalation mechanism | Russian-language persona text; `uv run pytest` / `make check` commands; pytest marker syntax; PlantUML diagram requirement (useful but opinionated); DDD file-path conventions (`src/<bounded_context>/...`); `conftest.py`/fixture references; UI-wiring checklist | Mandatory destructive-tester 6-question frame, corner-case matrix, and "vacuously true test" anti-pattern call-out are the standout portable contributions |
| 8 | `skills/tracing/SKILL.md` | Deployed feature doesn't work; triaging bugs, incidents, or production issues | (1) Classify mode (Incident vs Feature Tracing) + codebase recon. (2) Structured problem description (severity, blast radius, reproduction steps / delivery checklist). (3) Localise root cause — trace full path Browser→Router→Component→API→Route→UseCase→Domain→DB; mark chain break with ✅/❌/⬜. (4) Produce sequence + C4 component diagrams. (5) Issue table: all findings with file:line, Severity, Type (Root Cause / Contributing / Gap / Smell / Wiring). (6) Recommendations: immediate hotfix, full fix steps, prevention (tests + monitoring) | Read-before-guessing mandate; no skipping steps | Issue table is the escalation artifact; diagrams must be drawn before any fix | Russian language and persona framing; hardcoded stack commands (Docker Compose, Alembic, specific ports, FastAPI, SQLAlchemy); `model`/`effort` frontmatter | Feature-tracing mode wiring checklist (router registered? schema includes field? migration applied? Docker image fresh? frontend bundle updated?) is a genuinely rare pattern not found elsewhere |
| 9 | `rules/arch/db/MIGRATIONS.md` | Planning or executing a DB schema change; reviewing a migration PR; backfilling data | (1) Expand: add new columns/tables without removing old. (2) Deploy: ship code that reads both old and new. (3) Migrate Data: backfill or transform data. (4) Contract: remove old structures. (5) Per-migration safety checklist: tables/columns changed, row-count estimate, possible locks, execution time estimate, code compatibility, rollback plan, monitoring plan, owner. (6) Prohibited ops: ALTER COLUMN TYPE on large tables, ADD NOT NULL without backfill, non-CONCURRENT index creation on large tables, long-running migration transactions | 8-field safety checklist mandatory per migration; prohibited-ops list is a hard gate | Explicit rollback plan required before migration execution | Russian-language text — full translation required; INDEXES.md cross-reference → make conditional | Expand/Contract framing is the best portable articulation in the set; safety checklist (8 mandatory fields) and prohibited-ops list are the two must-preserve artifacts |
| 10 | `rules/arch/db/TRANSACTIONS.md` | Writing command handlers, application services, or repository implementations; implementing event publishing or outbox patterns | (1) Open transaction at application-service / command-handler layer only. (2) One repository → one aggregate → one transaction; no nested transactions. (3) No network calls, HTTP, queue publishes, or sleeps inside the transaction. (4) Write outbox record in same transaction as aggregate save. (5) Choose isolation level deliberately; document if non-default. (6) Optimistic locking (version check on write); retry with bounded backoff. (7) Side effects execute strictly after commit. (8) Outbox worker delivers separately; each record needs: event_id, event_type, event_version, aggregate_id, aggregate_type, aggregate_version, payload, occurred_at, correlation_id, causation_id, status (NEW|SENT|FAILED), retry_count. (9) Outbox records are immutable; errors produce new events. (10) Log transaction_id, command_id, aggregate_id, retry_count | Outbox records must be immutable; bounded backoff required on conflict; isolation level choice must be documented | Conflict retry at application-service level; bounded backoff is the escalation mechanism | Russian-language headings and prose; duplicated OUTBOX section; "mini-template" boilerplate; RETENTION cross-reference | Outbox 11-field schema is the strongest portable artefact; antipattern list is actionable and worth preserving verbatim (translated) |
| 11 | `skills/triz/SKILL.md` | Stuck on a design problem; architectural trade-off; improving one parameter worsens another; "TRIZ", "contradiction", "IFR", "inventive principles" | 9 mandatory steps: (1) task analysis + mini-task + conflicting pair; (2) technical contradictions + operative zone/time; (3) IFR + physical contradiction; (4) resource inventory; (5) contradiction resolution via 40 inventive principles + vepole analysis; (6) solution verification + new-contradiction check; (7) codebase mapping (optional); (8) RVS operator mental experiment; (9) reflection/pattern capture. Progress summary required after each step | New contradiction generated by solution must trigger a new cycle; invention level rating required in step 6 | New contradiction check in step 6 is the re-entry gate | Entire body written in Russian — full rewrite required; role/persona preamble and "Язык общения: русский" directive; `model: opus` + `effort: max` frontmatter (platform-specific) | Software-mapping column on the 40 principles ("rate limiter / circuit breaker", "break monolith into hooks") is the standout differentiator not found in any other TRIZ prompt library; portability blocked only by language |
| 12 | `agents/ui-ux-engineer.md` | Creating or redesigning UI components; fixing UX issues; building interactive features needing test-first frontend work | (1) ANALYZE — read existing components, find patterns, check design tokens, identify layer, check for duplicates. (2) DESIGN — draft Props API, states, keyboard behaviour, accessibility contract; show summary before writing tests. (3) RED — write failing tests covering rendering, variants, interactions, states, aria; run to confirm failure. (4) GREEN — write minimum code to pass tests; run to confirm pass. (5) REFACTOR — add micro-interactions, typography hierarchy, motion, responsiveness, edge cases. (6) VERIFY — run full check suite; fix all failures before responding | Exit-condition discipline: confirm RED before GREEN, confirm GREEN before REFACTOR, no response until VERIFY passes | No response until VERIFY passes; test failures block completion | Russian output directive; stack specifics (React 19, Vite, Vitest, RTL, Playwright); 4-layer directory architecture; CSS token fallback values; build command; dark-first mandate; project-specific aesthetic details | Anti-patterns table (hardcoded colors → tokens, div → button, tests after code → tests before) is one of the strongest extractable artefacts; component design template (layer/purpose/Props API/states/keyboard/a11y) is a clean pre-implementation spec format |

---

## 5. Portability Ranking

### High — port as-is after language translation and light stripping

- `rules/break-stop.md` — framework-agnostic, complete, well-structured; only the check command and language need changing
- `rules/arch/LLM_SECURITY.md` — unique framing, hard rules, antipattern code blocks are preservable
- `rules/arch/db/MIGRATIONS.md` — universally applicable; safety checklist + prohibited-ops list are the densest portable artifacts in the repo
- `rules/arch/db/TRANSACTIONS.md` — high signal, outbox schema is exceptional; cost is full Russian translation
- `rules/arch/UNIT_TESTS.md` — AP1–AP3 antipatterns block is language-agnostic and immediately reusable
- `skills/triz/SKILL.md` — world-class reasoning framework; software-mapping column is a unique differentiator; only blocked by Russian language
- `rules/arch/components/AGREGATES.md` — stack-agnostic DDD policy; directly usable
- `rules/arch/components/COMMANDS.md` — clean CQRS write-side guidance; no stack coupling
- `rules/arch/components/DOMAIN.md` — broadly applicable DDD modeling checklist
- `rules/arch/components/EVENTS.md` — portable event-driven architecture guidance
- `rules/arch/components/QURIES.md` — CQRS read-side; design-queries-first principle is clean
- `rules/arch/db/WRITE_MODEL.md` — aggregate-bound write-model design; portable core is well-isolated
- `rules/arch/LOGS.md` — general structured logging contract; implementation-agnostic
- `rules/arch/MONITORING.md` — broadly applicable metrics/SLO contract
- `rules/arch/db/SEEDS_FIXTURES.md` — minimal, idempotent, environment-isolated; transfers cleanly
- All `rules/arch/functions/techs/` (CONDITIONS, DATA, FUNCTIONS, GENERALIZATIONS, METHODS, SIMPLIFY) — refactoring playbooks are language-agnostic
- All `rules/arch/functions/practice/` (CHANGE_BREAKERS, DEPS, INFLATORS) — code-smell catalogs are language-agnostic

### Medium — port after stripping a significant layer of project specifics

- `agents/code-review-sentinel.md` — review process and decision framework are high-quality; DDD context map requires full replacement
- `agents/planner.md` — 6-criteria scorecard and risk matrix are gems; Resume Matcher + Russian output are deep coupling points
- `skills/commit/SKILL.md` — approval gate and message structure are excellent; task-ID convention and co-author trailer need parameterisation
- `skills/tdd/SKILL.md` — per-layer strategy and destructive-tester frame are valuable; PlantUML requirement and pytest idioms need abstraction
- `rules/arch/ARCH_TESTS.md` — LLM output security (R8) and schema contract (R9) are rare standalone policies; Python-specific enforcement details must be abstracted
- `rules/arch/STATE_OWNERSHIP.md` — allowed/forbidden frontend-state split is high-value; project-specific table rows must be stripped
- `skills/pipe/SKILL.md` — anti-patterns section is high-signal; `Agent` tool coupling and `.claude/skills/` path must be abstracted

### Partial — extract a specific section or protocol primitive rather than porting whole file

- `rules/meta-rules.md` — port only the "when to propose" triggers and the universality contract (two sections); strip paths-scoping and file-naming tables
- `agents/ui-ux-engineer.md` — port anti-patterns table and component design template as standalone checklist; 6-phase loop is re-derivable from tdd skill
- `skills/tracing/SKILL.md` — port the feature-wiring checklist and chain-of-layers trace format; strip dual-mode framing and stack commands
- `rules/arch/db/VERSIONING.md` — extract optimistic-locking, expand/contract migrations, and event/read-model versioning primitives only
- `rules/arch/SERVICES.md` — extract thin-handler / service-orchestration principle as a protocol primitive
- `rules/git.md` — extract title/body template and explanation-first rule; strip task-ID framing and verbosity mandate

---

## 6. Cross-Cutting Protocol Primitives

These are patterns smaller than a full skill that appear across multiple files and are worth extracting as standalone named primitives.

**Break-stop integration** (`rules/break-stop.md`, `skills/tdd/SKILL.md`, `skills/pipe/SKILL.md`, `agents/ui-ux-engineer.md`)  
Every workflow that runs tests treats a test failure as a hard stop requiring explicit user resolution before continuing. The pattern is: run checks → on failure, emit alert → require explicit user decision → do not self-repair broken functionality. Worth codifying as a named protocol that other skills reference.

**Proactive-protection clause** (`rules/break-stop.md`)  
Before applying a change the agent knows will break something, emit a warning and require explicit confirmation — not after the breakage occurs. This is the proactive variant of break-stop; rarer and more valuable.

**Read-before-guessing mandate** (`agents/planner.md`, `agents/code-review-sentinel.md`, `skills/tracing/SKILL.md`, `rules/arch/ARCH_TESTS.md`)  
Multiple files explicitly prohibit guessing codebase state; the agent must read actual files before making any claims about them. Appears as "read files, don't guess" in planner.md and as an anti-pattern prohibition in tracing/SKILL.md.

**Severity emoji taxonomy** (`agents/code-review-sentinel.md`, `agents/planner.md`, `skills/tdd/SKILL.md`)  
🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low appears across review, risk assessment, and test-progress reporting contexts. Consistent use makes output scannable. Worth standardising as a shared primitive.

**User-approval gate** (`skills/commit/SKILL.md`, `agents/ui-ux-engineer.md`, `skills/pipe/SKILL.md`)  
Before committing code, merging a phase output, or executing a pipeline step, show the plan to the user and wait for explicit confirmation. Never autocommit or self-advance pipeline phases without user consent.

**Tri-state chain tracking** (`skills/tracing/SKILL.md`, `rules/arch/ARCH_TESTS.md`)  
Tracing a request or checking a constraint produces a ✅/❌/⬜ (pass / fail / not-checked) status per layer, not a binary pass/fail. Enables partial-progress reporting and pinpoints exactly where a chain breaks.

**Vacuously-true test detection** (`agents/code-review-sentinel.md`, `rules/arch/UNIT_TESTS.md`, `skills/tdd/SKILL.md`)  
Three independent files articulate the same antipattern: a test that always passes regardless of implementation (mock-only assertions, echo/tautology tests, tests simpler than the code). "Would this test catch a real bug?" is the portable heuristic question.

**Outbox-in-same-transaction rule** (`rules/arch/db/TRANSACTIONS.md`, `rules/arch/components/EVENTS.md`, `rules/arch/db/WRITE_MODEL.md`)  
Write the outbox record in the same transaction as the aggregate mutation; deliver via a separate worker after commit. Appears in three distinct files as an independent invariant.

**YAML frontmatter path-glob scoping** (`rules/arch/LLM_SECURITY.md`, `rules/arch/ARCH_TESTS.md`, multiple rule files)  
Rule files use a `paths:` key in YAML frontmatter listing glob patterns to declare which parts of the codebase the rule governs. This is a scoping mechanism that enables selective rule activation by the harness — worth adopting as a convention if the target harness supports it.

**Structured output template with mandatory fields** (`agents/code-review-sentinel.md`, `agents/planner.md`, `skills/tracing/SKILL.md`)  
Every major agent workflow specifies a fenced-block output template with named, required fields. This enforces parseable output and prevents the agent from eliding inconvenient sections. The pattern is: define the template once in the skill, require all fields to be populated on every run.

---

## 7. Default Recommendation

**Ship by default in `.agents`:**

1. **`rules/break-stop.md`** → promote to `skills/break-stop/SKILL.md` (or a standing rule). This is the single highest-value cross-cutting protocol in the repo; it makes every other skill safer.

2. **`rules/arch/LLM_SECURITY.md`** → promote to `skills/llm-security/SKILL.md`. Unique and directly applicable to any agent that integrates an LLM API. Trigger on: code imports `anthropic`, `openai`, or any LLM SDK.

3. **`rules/arch/db/MIGRATIONS.md`** → promote to `skills/db-migrate/SKILL.md`. Safety checklist + prohibited-ops list are immediately useful in any project with a relational DB. Ship the checklist as a fill-in template.

4. **`skills/triz/SKILL.md`** → promote as-is after English rewrite and persona-strip, retaining the 40-principles software-mapping table. Ship as `skills/triz/SKILL.md`. High uniqueness; no equivalent in existing `.agents` skills.

5. **`rules/arch/UNIT_TESTS.md` AP1–AP3 block** → fold into the existing `skills/tdd/SKILL.md` as a "Test Quality" appendix, or ship as a standalone `rules/test-antipatterns.md`.

6. **Refactoring playbooks** (`rules/arch/functions/techs/` × 6 files) → ship as a single consolidated `skills/refactor/SKILL.md` with six sections. Smell catalogs (`practice/` × 3) → ship as a companion `skills/refactor-smells/SKILL.md`.

**Ship conditionally (activate for DDD/CQRS projects):**

7. `rules/arch/db/TRANSACTIONS.md` → `skills/db-transactions/SKILL.md`
8. `rules/arch/components/AGREGATES.md` + `COMMANDS.md` + `EVENTS.md` + `QURIES.md` + `DOMAIN.md` → consolidate into `skills/ddd-cqrs/SKILL.md`
9. `agents/code-review-sentinel.md` → extract portable core into `skills/code-review/SKILL.md`; do not ship agent definition as-is

**Hold for higher extraction cost (full Russian translation required before promotion):**

10. `skills/tdd/SKILL.md` — needs rewrite; existing `skills/tdd/SKILL.md` in `.agents` already covers the gap; merge best elements
11. `rules/arch/db/MIGRATIONS.md` — highest checklist density but most translation work; worth the effort
12. `agents/planner.md` — 6-criteria scorecard and risk matrix worth extracting into a new `skills/prd-to-plan` revision

---

## 8. Structural Patterns

### YAML frontmatter schema
Every file uses YAML frontmatter. Fields observed: `name` (display name), `description` (trigger description, often with few-shot examples), `model` (e.g., `opus`), `effort` (e.g., `max`), `memory` (e.g., `project`), `paths` (glob array for scoping). The `paths:` glob scoping pattern is particularly useful — it enables the harness to conditionally activate rules based on the file being edited. **Adopt:** `name`, `description` (with trigger examples), `paths` glob scoping. **Avoid promoting:** `model` and `effort` (harness-specific and pins the skill to one deployment); `memory: project` (memory architecture is too platform-specific).

### Path-glob scoping
Multiple rule files declare their applicable scope via a `paths:` glob array in frontmatter (e.g., `rules/arch/db/TRANSACTIONS.md` scopes to `src/infrastructure/db/**` and `migrations/**`). This is a clean convention for context-sensitive rule activation. It avoids loading all rules into every context window and makes rules self-documenting about their intended scope. **Recommendation:** adopt this convention in `.agents` rule files; document it in CLAUDE.md.

### Russian-language pattern
The dominant prose language throughout the repo is Russian. This is an authoring artifact, not a design choice for the SOPs themselves. Approximately 60–70% of files require full translation before promotion. The most affected files are the deepest-value ones (MIGRATIONS, TRANSACTIONS, triz, planner). Translation is the primary extraction cost for this repo. **Action:** translate during promotion; do not carry Russian language forward into any `.agents` skill.

### Few-shot examples in `description` frontmatter
Several agent files (notably `agents/code-review-sentinel.md`) embed few-shot trigger examples directly in the `description` frontmatter field: `"[example: after writing tests for the auth handler] → launch code-review-sentinel"`. This is a high-quality pattern for trigger calibration that makes the agent self-documenting about when it should fire. **Adopt:** include 2–3 bracketed examples in skill `description` fields.

### Companion-file conventions
Skills do not use companion files in this repo — each skill is a single `SKILL.md`. This contrasts with some `.agents` skills that carry companion scripts or data files. The single-file convention is cleaner for transport. **Adopt** as default; add companion files only when external data (e.g., the 40 TRIZ principles table) is large enough to warrant separation.

### Persona / role-preamble pattern
Agent and skill files open with a first-person role persona (e.g., "Ты — старший разработчик с 20-летним опытом…"). This pattern is common in the repo but adds noise without changing behavior. **Strip** on promotion: replace role preambles with direct instruction ("When reviewing code, apply the following process…"). Positive framing without backstory.

### Multi-agent shared-context handoff
`agents/planner.md` and `agents/code-review-sentinel.md` both reference a shared `.claude/agent-memory/agent-discoverer/requirements.md` file as the handoff artifact between the `agent-discoverer` → `planner` → `code-review-sentinel` pipeline. This is an interesting pattern for multi-agent pipelines but is tightly coupled to this repo's agent-memory architecture. **Extract as a protocol primitive** (named artifact at a known path, read by the downstream agent) rather than adopting the specific path convention.

### Antipattern-as-constraint blocks
Multiple files conclude with an explicit antipatterns section listing prohibited behaviors (e.g., `skills/pipe/SKILL.md`: "don't run phases in parallel, don't skip phases without consent, don't pass only summaries, halt on broken tests"). This pattern of negative space — defining what the skill must never do — is a strong complement to procedural steps. **Adopt:** include an antipatterns block in every skill that has known failure modes.

---

## 9. Evidence

Citations are keyed to raw-findings.md blocks (file → quoted text).

1. **`rules/break-stop.md` → proactive-protection clause**: "Proactive path: if a requested change *will* break something, emit the banner *before* applying it and require explicit confirmation." This pattern is called out as "not common in other rules" — it is genuinely absent from all other files in the corpus and from the existing `.agents` skill set.

2. **`agents/code-review-sentinel.md` → test-triviality detection**: "The test-triviality detection section is the standout portable contribution — articulates anti-patterns (mock-only assertions, vacuously-true checks, no edge cases) with precision uncommon in review SOPs." The "Would this test catch a real bug?" heuristic is cited as worth extracting verbatim.

3. **`agents/code-review-sentinel.md` → hardcoded memory path**: Strip note reads: "persistent-memory directory path (`/Users/egurvanov/...`)" — confirms egurvanov as the apparent primary author; also confirms the memory architecture is user-local and non-portable.

4. **`agents/planner.md` → 6-criteria requirements scorecard**: "The 6-criteria requirements scorecard is particularly strong — it forces explicit coverage of edge cases and scope that most planning prompts omit." Criteria listed: Goal, Acceptance Criteria, Edge Cases, Dependencies, Test Plan, Scope.

5. **`rules/arch/LLM_SECURITY.md` → hard no-exceptions stance**: "The hard 'no exceptions, not even in dev' stance is worth preserving verbatim." The anti-patterns code snippets are cited as valuable portable illustrative examples that should survive promotion.

6. **`skills/triz/SKILL.md` → software-mapping column**: "The software-mapping column on the 40 principles… is the standout differentiator — not found in any other TRIZ prompt library." Examples given: "разделить монолит → разбить компонент на хуки, rate limiter / circuit breaker." This column makes the TRIZ skill uniquely applicable to software engineering contexts.

7. **`skills/tracing/SKILL.md` → feature-wiring checklist**: "The feature-tracing mode with its wiring checklist (router registered? schema includes field? migration applied? Docker image fresh? frontend bundle updated?) is a genuinely rare and valuable pattern not found elsewhere." This wiring checklist is cited as the primary reason to promote this skill despite the Russian-language and stack-specific coupling.

8. **`rules/arch/db/TRANSACTIONS.md` → outbox 11-field schema**: The outbox record schema is listed with 11 required fields: "event_id, event_type, event_version, aggregate_id, aggregate_type, aggregate_version, payload, occurred_at, correlation_id, causation_id, status (NEW|SENT|FAILED), retry_count." Findings note: "The outbox schema (11-field contract) is the strongest portable artefact."

9. **`rules/arch/ARCH_TESTS.md` → LLM output security rule R8**: "R8 – LLM security: LLM-derived fields must not gate authorization logic; scanned via AST." Findings recommend: "Consider splitting into three portable SOPs: (1) DDD layer-boundary enforcement, (2) LLM output security, (3) aggregate mutation versioning."

10. **`skills/describe/SKILL.md` → leave-out rationale**: "Explicitly project-specific, forbids commands and file reads, and depends on this repo's CLAUDE.md context rather than a reusable process." This is the clearest example of a file that has zero portability — it is an answer template, not an operational workflow.

11. **`rules/meta-rules.md` → universality contract**: "No task IDs, no project-specific paths, no personal info, no business logic — those belong in CLAUDE.md." This explicit boundary between portable rules and project config is the most operationally useful governance pattern in the file.

12. **`rules/arch/db/MIGRATIONS.md` → Russian-language extraction cost**: "Written entirely in Russian — highest extraction cost of any file seen so far, but highest checklist density." The safety checklist (8 mandatory fields per migration) and prohibited-ops list are cited as the two must-preserve artifacts, making the translation cost worth bearing.

13. **`agents/ui-ux-engineer.md` → exit-condition discipline**: "The 6-phase loop's exit-condition discipline (confirm RED before GREEN, confirm GREEN before REFACTOR, no response until VERIFY passes) is the core SOP value worth preserving." This hard sequencing — no phase may begin until the prior phase passes — is the portable principle, independent of the React stack.
