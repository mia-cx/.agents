
## rules/break-stop.md
**Type:** Rule (enforcement / hard-stop protocol)
**Portable:** Yes
**Reason:** Framework-agnostic stop-on-breakage discipline with a clear severity split (trivial formatting vs. broken functionality) and a prescriptive escalation protocol. Works in any language/toolchain; only the check command (`make check`) needs parameterisation.
**Trigger:** Agent is about to continue implementing after a test/lint/type-check failure, or about to apply a change predictably breaking existing contracts.
**Steps/contract:**
1. Run check suite after every logical change.
2. On failure → emit red alert banner → STOP → list what broke, likely cause, options.
3. Ask user for explicit decision; do not self-repair broken functionality.
4. Resume only after suite is green and user confirms.
5. Proactive path: if a requested change *will* break something, emit the banner *before* applying it and require explicit confirmation.
**Strip:** Russian confirmation words ("да" / "давай") — localise to English ("yes" / "go ahead"); `make check` reference — replace with `<check command>` placeholder; exact banner emoji art is flavour, keep the semantics.
**Structure/format:** Markdown with named sections (Rule, Protocol, Proactive Protection, Severity Levels, Red Alert Banner, Rationale); banner is a verbatim code block; severity is a two-level enum.
**Notes:** Strong SOP. The severity split (auto-fix trivial / hard-stop non-trivial) is the key portable insight. Banner is a nice UX affordance but could be simplified. Proactive-protection clause (warn before applying a destructive change the user requested) is especially valuable and not common in other rules.

## rules/meta-rules.md
**Type:** Meta-governance — rules about how to write and maintain rules  
**Portable:** Partially  
**Reason:** Two sections are highly portable and SOP-worthy: (1) the "When to Propose New Rules" heuristics (pattern repeats 2+ sessions, user corrects behaviour, non-obvious decision made) and (2) the "Universality" contract (no task IDs, no project-specific paths, no personal info, no business logic — those belong in CLAUDE.md). The structural/paths-scoping table and file-organisation conventions are specific to the `.claude/rules/` system of this particular repo and carry little value elsewhere.  
**Trigger:** When authoring or auditing agent rules, skills, or standing instructions — especially after a user correction or when a pattern has recurred across sessions.  
**Steps/contract:**  
1. Detect trigger: user establishes convention, pattern repeats ≥2 sessions, user corrects agent behaviour, non-obvious architectural decision made.  
2. Proactively propose capturing it as a persistent rule.  
3. Ensure the rule is project-agnostic: replace task IDs with `[TASK-ID]`, strip project-specific paths/names/keys/domain logic.  
4. One topic per rule file; if context is project-specific, it belongs in the repo's top-level config (e.g. `CLAUDE.md`), not in a portable rule.  
5. Do NOT add rules for one-off decisions, info already captured elsewhere, or temporary workarounds.  
**Strip:** Paths-scoping table (`.claude/rules/` directory tree), file-naming convention (UPPER_CASE.md), Russian-language proposal template, YAML `paths` frontmatter guidance.  
**Structure/format:** Could be distilled to two short sections — "Triggers for capturing a rule" (bulleted heuristics) and "Portability contract" (bulleted constraints). No special formatting needed.  
**Notes:** The universality contract is the strongest portable signal here — it explicitly codifies what belongs in a skill/rule vs. what belongs in project config. The "when to propose" heuristics (≥2 sessions, user correction → rule) are a clean, actionable governance pattern worth lifting verbatim. Russian text in the proposal wording is an authoring artifact; strip entirely.

## agents/code-review-sentinel.md
**Type:** Agent (post-write code review specialist)
**Portable:** Partially — review process, severity framework, output format, and decision framework are fully portable; the review checklist and test-quality criteria are portable; the DDD/Python/aiogram/SQLAlchemy/MinIO architecture context, the `agent-discoverer` requirements handshake, and the hardcoded persistent-memory paths are project-specific.
**Reason:** The six-step review process (requirements → architecture → code quality → test triviality → security → risk), the severity taxonomy (🔴/🟠/🟡/🟢), and the APPROVE/REQUEST CHANGES/BLOCK decision framework are strong, reusable SOPs. The test-triviality detection criteria (mock-only tests, vacuously-true assertions, no edge cases) are high-signal and rarely articulated this clearly. The security checklist (injection, path traversal, auth scoping, secret leakage, race conditions) is broadly applicable. What can't travel: the architecture layer map (domain/application/infrastructure/presentation), tech-stack rules (structlog, mypy strict, SQLAlchemy JSONB patterns), the `requirements.md` memory handshake from `agent-discoverer`, and the `/Users/egurvanov/...` memory paths.
**Trigger:** Fires after any code is written or modified — feature implementation, bug fix, or pre-commit. Examples show it auto-launching from the parent agent after writing tests or security-sensitive handlers.
**Steps/contract:**
1. Read recently modified files; optionally check `.claude/agent-memory/agent-discoverer/requirements.md` for acceptance criteria.
2. Architecture & design review — layer boundaries, abstractions, SOLID.
3. Code quality — line length, typing, logging, async patterns, error handling.
4. Test review (primary focus) — triviality detection, edge-case coverage, contract verification, LLM soft-threshold guidance.
5. Security & risk — input validation, injection, file handling, auth scoping, secrets, error disclosure, race conditions.
6. Emit structured report: Summary → Findings (per-severity) → Test Assessment → Risk Summary → Decision.
**Strip:** Project-specific architecture map (DDD layer names and import rules), Python/aiogram/SQLAlchemy/MinIO/structlog coding rules, `requirements.md` handshake path, S3 key format rule, persistent-memory directory path (`/Users/egurvanov/...`), `model: opus` / `memory: project` frontmatter, MEMORY.md boilerplate.
**Structure/format:** Highly structured. Frontmatter (name, description with shot examples, model, memory). Prose persona. Named sections with `##` headers. Review Process as ordered `###` steps with sub-bullets. Output Format as a fenced code block showing exact template. Decision Framework as bullet table. Six numbered Important Rules. Persistent memory guidelines appended. Output template is the most portable artifact: Summary / Findings (severity + file + category + description + recommendation) / Test Assessment / Risk Summary / Decision.
**Notes:** The test-triviality detection section is the standout portable contribution — articulates anti-patterns (mock-only assertions, vacuously-true checks, no edge cases) with precision uncommon in review SOPs. The APPROVE/REQUEST CHANGES/BLOCK three-tier decision with explicit entry conditions is clean and reusable. The "Run verification mentally" heuristic ("Would this test catch a real bug?") is worth extracting verbatim. The persistent-memory section is boilerplate noise at the SOP level and should be dropped entirely. Shot examples in `description` frontmatter are useful patterns for trigger calibration. Overall: high-quality review SOP with a thick layer of project-specific scaffolding to peel away.

## agents/planner.md
**Type**: Agent definition — requirement analyst + implementation planner subagent
**Portable**: Partially — strong portable core, but scaffolded around a specific project
**Reason**: The 4-phase planning loop (requirements completeness → codebase analysis → risk assessment → implementation plan) is a highly reusable SOP pattern. The 6-criteria requirements scorecard and 5-category risk matrix (Architecture, DB, Testing, Performance, Security with 🔴/🟡/🟢 severity) are extractable gems. The "read files, don't guess" discipline and the structured markdown output template are worth preserving. However, the agent is deeply embedded in a specific project: Russian-language output, Resume Matcher architecture tables, project-specific file paths, agent-discoverer shared-context handoff, and [DD-N] commit format are all project-local.
**Trigger**: Receiving a new task, feature request, or bug — "plan this", "analyze requirements", "implementation plan", "what needs to change"
**Steps/contract**:
1. Phase 1 — Requirements analysis: score task against 6 criteria (Goal, Acceptance Criteria, Edge Cases, Dependencies, Test Plan, Scope); flag gaps with proposed wording
2. Phase 2 — Codebase analysis: identify affected layers/files by *reading* them; surface existing patterns for similar tasks
3. Phase 3 — Risk assessment: evaluate 5 categories (Architecture, DB, Testing, Performance, Security); assign severity level per risk with mitigation
4. Phase 4 — Implementation plan: numbered steps each with file → change → why → depends-on; test strategy table (name/file/type/coverage); commit structure
**Strip**: Resume Matcher project description + architecture tables; Russian-language instruction; Shared Context / agent-discoverer handoff block; `.claude/rules/arch/` file path references; `[DD-N]` ticket-number convention; Telegram/aiogram/OpenAI/DDD specifics
**Structure/format**: 6-section markdown output — (1) requirements table with ✅/❌ per criterion, (2) affected components table (layer/file/change/new-or-existing), (3) risks table (risk/level/mitigation), (4) numbered implementation steps, (5) test strategy table, (6) commit list
**Notes**: Best-in-class candidate for a portable "plan a task" SOP. The 6-criteria completeness scorecard is particularly strong — it forces explicit coverage of edge cases and scope that most planning prompts omit. The 5-category risk matrix pairs well with the `issue-triage` skill. The multi-agent shared-context handoff (agent-discoverer → planner) is an interesting pattern for pipelines but should be documented separately as an optional integration note, not baked into the core SOP.

## rules/arch/LLM_SECURITY.md
**Type:** Security rules (LLM output trust boundary)
**Portable:** Yes — strong candidate
**Reason:** Concise, repo-agnostic principles for treating LLM output as untrusted input. The rules cover prompt injection prevention, structured output validation, and a hard prohibition on using LLM output for access control decisions. Applies to any codebase integrating an LLM, regardless of language or framework. Currently written in Russian but content is fully translatable.
**Trigger:** Any task involving LLM API integration, prompt construction, or processing LLM responses in application code.
**Steps/contract:**
1. Treat all LLM output as untrusted external input — validate structure, types, and value ranges; raise explicit errors on invalid output, never silently fall back.
2. Never use LLM output for access control, authentication, or authorization decisions — all such decisions must use deterministic code.
3. Isolate user-supplied content from system prompts — never concatenate user text directly into the system prompt; treat parsed external content (HTML, PDF) as potentially poisoned.
4. Sanitize LLM output before passing to SQL, shell, eval, exec, or template engines.
5. Parse LLM responses into strictly-typed structures (dataclass / Pydantic / zod); handle parse failures explicitly; limit and log retries.
6. Strip PII from LLM output logs (prompts may contain PII, but logged output must not).
7. Any score or rating from an LLM is informational only — thresholds and decisions belong in deterministic code.
**Strip:** Russian language (translate to English on promotion). Path globs in frontmatter are source-repo-specific and should be removed. The "antipatterns" code snippets are valuable and should be preserved as illustrative examples.
**Structure/format:** Flat rule sections with a short anti-pattern list. Converts cleanly to a skill or standing rule. Anti-pattern block is especially portable as a checklist.
**Notes:** One of the strongest security candidates in the repo. The hard "no exceptions, not even in dev" stance is worth preserving verbatim. Overlaps conceptually with general input-validation rules but the LLM-specific framing (untrusted service, prompt injection, structured output) makes it distinct and worth keeping separate.

## skills/commit/SKILL.md
**Type:** SOP (procedural workflow)
**Portable:** Yes — with minor adaptation
**Reason:** Well-structured 7-step git commit workflow covering info gathering, diff analysis, message drafting, user confirmation gate, atomic staging, commit execution via heredoc, and post-commit verification. Guards against common mistakes (no `git add .`, no push without consent, no `--no-verify`, no credential commits). Overlaps with the existing `gc` skill but is more opinionated about message format (What/Why/Details sections, `[TASK-ID]` prefix) and explicitly requires user approval before committing.
**Trigger:** User wants to create a git commit, stage changes, draft a commit message, or follow project commit conventions.
**Steps/contract:** (1) Gather `git status`, `git diff HEAD`, `git log --oneline -5` in parallel. (2) Analyse diff — identify logical groups and files to skip (`.env`, credentials). (3) Resolve TASK-ID from `$ARGUMENTS` or default `[TG-0]`. (4) Draft commit message: `[TASK-ID]: summary` + `## What changed` / `## Why` / `## Details` sections, ≤72-char title, imperative/lowercase. (5) Show staging plan + full message to user and **wait for approval**. (6) `git add <explicit files>` then `git commit` via heredoc (includes `Co-Authored-By` trailer). (7) `git status` + `git log -1` to verify.
**Strip:** Russian-language body text (translate to English); `[TG-0]` project-specific placeholder convention (generalise to `[TASK-ID]` or omit); `Co-Authored-By: Claude Opus 4.6 (1M context)` trailer (version-specific, should be parameterised or removed); reference to `.claude/rules/git.md` (repo-local rule file).
**Structure/format:** Markdown with numbered steps, fenced bash blocks, a strict commit-message template, and a bullet-list rules section. Clear and complete — ready to adapt.
**Notes:** Strongest portable elements are the mandatory user-approval gate before any commit, the explicit-file staging rule (no `git add .`), and the What/Why/Details message structure. These should be preserved verbatim in any promotion. The task-ID prefix is optional/project-specific and should become a conditional step. Solid complement or replacement for the existing `gc` skill if a more prescriptive commit-message format is desired.

## skills/tdd/SKILL.md
**Type:** Workflow / Process  
**Portable:** Partial — workflow logic is universal; surface fixtures (pytest, uv, PlantUML) and language choice (Russian) are repo-specific  
**Reason:** Covers a complete, opinionated Red→Green→Refactor TDD loop with per-layer test strategy (unit, state, security, cases, integration, architecture, e2e), destructive-tester mindset, corner-case matrix, and strict anti-patterns list. The phase structure and quality gates are highly portable. Heavy DDD layer ordering (domain → application → infrastructure → presentation → frontend) and toolchain assumptions (`uv run pytest`, `make check`, Playwright, PlantUML sequence/activity diagrams) are coupling points; strip/parameterise them when porting.  
**Trigger:** Implementing features, fixing bugs, or adding test coverage via TDD  
**Steps/contract:**  
  0. Reconnaissance — read existing code/fixtures, identify layers  
  1. Visual flow analysis — produce Sequence + Activity PlantUML diagrams, mark edit points (`<<edit>>`, `#LightCoral`)  
  2. Test plan — per-layer list with explicit "not needed / why" for each skipped layer  
  3. RED — write tests layer by layer, verify each fails for the right reason  
  4. GREEN — write minimal implementation in DDD layer order; run tests after each file  
  5. Full verification — `make check` (back + front); break-stop rule on regression  
  6. Refactor — only after full green; no behaviour changes; re-verify after each change  
  7. Self-check — 5-question quality audit per test + UI wiring checklist  
**Strip before porting:** Russian-language persona text; `uv run pytest` / `make check` commands; pytest-specific marker syntax (`pytestmark`, `@pytest.mark.asyncio`); PlantUML diagram requirement (useful but opinionated); DDD file-path conventions (`src/<bounded_context>/...`); `conftest.py` / fixture references; UI-wiring checklist (frontend-specific)  
**Structure/format:** Long-form Markdown with role preamble, numbered phase headers (Шаг 0–7), code-block examples for every artefact (PlantUML, test plan template, bash commands, progress banner), checklists, and anti-patterns table  
**Notes:** One of the most complete TDD SOPs in the corpus. Distinctive strengths: mandatory destructive-tester 6-question frame, full corner-case matrix table, state-matrix testing with `itertools.product`, break-stop regression rule, and the "vacuously true test" anti-pattern call-out. The PlantUML step is an unusual but valuable forcing-function for up-front design. Progress banner format (🔴/🟢/✅) is a reusable convention. Language of prose is Russian — extract the logic, not the wording.

## skills/tracing/SKILL.md
**Type:** Incident & feature-tracing investigation workflow
**Portable:** Partial
**Reason:** The six-step investigation structure, dual incident/feature-tracing mode, chain-of-layers checklist, PlantUML diagram requirement, and risk matrix are all highly portable patterns. However, portability is degraded by: the entire prompt being written in Russian (including the role persona), hardcoded stack references (Docker Compose, alembic migrations, FastAPI/React/SQLAlchemy, specific localhost ports 55078/55079), and `model: opus` / `effort: max` directives.
**Trigger:** Deployed feature doesn't work; triaging bugs, incidents, or production issues.
**Steps/contract:**
  0. Classify mode (Incident vs Feature Tracing) + codebase recon (read before guessing)
  1. Structured problem description (severity, blast radius, reproduction steps / delivery checklist)
  2. Localise root cause in code — trace full path Browser→Router→Component→API→Route→UseCase→Domain→DB; mark chain break with ✅/❌/⬜
  3. Produce two PlantUML diagrams: sequence (request flow with `<<BUG>>`/`<<BREAK>>` annotation) + C4 component (architectural context, problem node in red)
  4. Issue table: all findings with file:line, Severity (Critical/High/Medium/Low), Type (Root Cause / Contributing / Gap / Smell / Wiring)
  5. Implementation risk assessment per category (Regression, Migration, Side Effects, Concurrency, Compatibility, Performance, Incomplete Fix, Deployment) with probability/impact matrix
  6. Recommendations: immediate hotfix, full fix steps, prevention (tests + monitoring)
**Strip:** Russian language and persona framing; hardcoded stack commands (`docker compose`, `alembic current/heads`, specific port numbers, `FastAPI`, `SQLAlchemy`); `model`/`effort` frontmatter directives.
**Structure/format:** Highly structured — dual mode logic, mandatory PlantUML (2 diagrams), issue table, risk matrix, per-step progress log (`🔎 ШАГ 0 …`). All output formats are specified with code-block templates. Anti-patterns section explicitly forbids skipping steps or guessing without reading code.
**Notes:** The feature-tracing mode with its wiring checklist (router registered? schema includes field? migration applied? Docker image fresh? frontend bundle updated?) is a genuinely rare and valuable pattern not found elsewhere. The "problem not understood until drawn" principle (mandatory diagrams before fix) is a strong portable heuristic. Worth extracting as a language-agnostic SOP; the Russian-language framing and stack-specific commands are the only real barriers.

## rules/arch/STATE_OWNERSHIP.md
**Type:** Architectural principle / rule set
**Portable:** Partial — core principle is universal; R5 and the migration sequence are project-specific
**Reason:** Backend-as-source-of-truth and the UI state contract (pure UI state vs. domain state) are portable design rules. R5 ties to a Python DDD layout (`src/domain/`) and R3's table ties to a specific collector-scanning project, making those sections non-portable as written.
**Trigger:** Agent is designing or reviewing a full-stack feature that involves mutable state, or reviewing a frontend that is computing domain logic / holding persistent state locally.
**Steps/contract:**
1. All mutable domain state lives in the backend DB and is exposed via API.
2. Frontend is a stateless projection: render API response, send user intent as API call, re-fetch.
3. Derived/computed values belong in the API response, not recalculated on the frontend.
4. Every state change follows: User action → API call → Backend mutates → Frontend re-fetches → UI updates.
5. Allowed on frontend: pure UI state (modals, form inputs, spinners), display-only sort/filter, date formatting.
6. Forbidden on frontend: business rule evaluation, state transitions, integrity validation.
7. Optimistic updates permitted only if: the API call still fires, reverts on failure, and backend response is treated as authoritative.
**Strip:** R5 code example (Python DDD module path), R3 project-specific table rows (collector/anomaly endpoints), migration sequence that names project-specific layers.
**Structure/format:** Principle statement + numbered rules (R1–R6), each with a violation/allowed/forbidden sub-list or table; anti-patterns appendix. Clean, directly reusable as a skill rule block.
**Notes:** Highest-value section is the allowed-vs-forbidden split on frontend state (R2) — this is the most commonly violated rule in full-stack agent code. The R6 optimistic-update caveat is a useful nuance absent from most similar rules. Strip project nouns before promoting.

## rules/arch/db/MIGRATIONS.md
**Type:** SOP + Checklist (zero-downtime DB migration process)
**Portable:** Yes
**Reason:** The Expand→Deploy→Migrate Data→Contract pattern, prohibited-operation rules, backfill discipline, and safety checklist are universally applicable to any project using a relational database. No repo-specific domain logic; the `INDEXES.md` cross-reference is a mild coupling but easily stripped.
**Trigger:** When planning or executing a database schema change, reviewing a migration PR, or backfilling data.
**Steps/contract:** 4-phase pipeline (Expand, Deploy, Migrate Data, Contract); 8-field safety checklist per migration (tables/columns changed, row-count estimate, possible locks, execution time estimate, code compatibility, rollback plan, monitoring plan, owner); prohibited-ops list (ALTER COLUMN TYPE on large table, ADD NOT NULL without backfill, non-CONCURRENT index creation on large tables, long-running migration transactions).
**Strip:** Russian-language text — full translation required. Remove INDEXES.md cross-reference or make it conditional. "Dev → Test → Stage → Prod" pipeline note is generic enough to keep.
**Structure/format:** Sectioned MD with headers: Rules, Prohibited Operations, Index Rules, Backfill Rules, Versioning & Compatibility, Execution Pipeline, Safety Checklist, Style & Discipline. Frontmatter path-glob triggers. Clean, scannable.
**Notes:** Written entirely in Russian — highest extraction cost of any file seen so far, but highest checklist density. The safety checklist (8 mandatory fields per migration) and the explicit prohibited-ops list are the two must-preserve artifacts. Expand/Contract framing is the best portable pattern articulation in the set.

## rules/arch/ARCH_TESTS.md
**Type:** Architectural constraint ruleset (static analysis via AST + pytest)
**Portable:** Partially — the rule taxonomy is highly portable; the implementation details (specific module paths, Python/SQLAlchemy/pytest stack) are project-specific
**Reason:** Defines 12 architectural rules (R1–R12) and 4 unit-test structural rules (UT1–UT5) enforced by automated AST-based pytest tests. The rules encode a DDD layer-boundary contract (domain → application → infrastructure → presentation), aggregate isolation, versioning invariants, LLM-output security, and DB-model schema contracts. These principles are universally applicable to any DDD Python project; only the path globs and model names need substitution.
**Trigger:** Use when a project adopts DDD layering (domain / application / infrastructure / presentation) and wants automated enforcement of layer boundaries, aggregate isolation, or repository scope constraints. Especially relevant for Python projects using pytest.
**Steps/contract:**
1. R1 – Aggregate isolation: domain/{agg}/* must not import from sibling aggregates (only from root domain)
2. R2 (a/b/d/e/f) – Layer boundary DAG: domain has no outward imports; application has no presentation imports; presentation has no infrastructure imports; infrastructure has no presentation imports; domain/application ban infra libs (sqlalchemy, fastapi, etc.)
3. R3 – Repository isolation: each `{agg}_repo.py` may only import its own aggregate's models, defined in a central `AGGREGATE_MODELS` map
4. R4 – Aggregate versioning: every mutating method (`self.x = …`) must include `self.version += 1`
5. R5 – DB model isolation: no cross-aggregate ForeignKey or relationship; cross-aggregate links via UUID value only
6. R6/R7 – View and handler isolation: view modules and handlers must not bypass the service layer to reach other aggregates or infra repos directly
7. R8 – LLM security: LLM-derived fields must not gate authorization logic; scanned via AST
8. R9 (a/b/c) – Model schema contract: SQLAlchemy column sets must match an `EXPECTED_COLUMNS` dict; every registered table must have a contract entry; negative assertions block resurrection of deleted fields
9. R11 – Entity boundary isolation: `entity.py` dataclass fields must not hold UUID references to other aggregates (except the root aggregate)
10. R12 (a/b/c) – Use-case aggregate scope: each use case may touch at most one aggregate; multi-aggregate cases require explicit allowlist with exact aggregate set
11. UT1/UT2 – Test docstrings: module and function docstrings required on all unit tests
12. UT4/UT5 – Test style: prefer `pytestmark` for async; ban `setUp`/`tearDown` in favour of per-test fixture setup
**Strip:** All concrete file paths (`src/domain/*/entity.py`, `tests/architecture/`), make targets, `AGGREGATE_MODELS` / `EXPECTED_COLUMNS` examples, Telegram/SQLAlchemy/openai library references in R2f — replace with `<your-infra-libs>` placeholders. Remove Russian-language explanatory prose (translate concepts to English). Remove project-specific `IGNORED_ENTITY_FIELDS`, allowlist examples, and the specific deleted-field regression example (`agent_token`).
**Structure/format:** Well-structured: numbered rules with sub-rules (R2a–f, R9a–c, R12a–c), rationale per rule, "Obligations on code change" checklist, and CLI invocation block. Checklist format is directly adoptable as a SOP appendix.
**Notes:** Exceptionally high signal. The LLM security rule (R8) — preventing LLM-derived fields from gating authorization — is rare and highly valuable as a standalone portable policy. The "aggregate versioning via `version += 1` on every mutating method" (R4) is a lightweight optimistic-concurrency pattern worth extracting. The schema contract pattern (R9) is a strong portable testing SOP for any project with a migration gap risk. Consider splitting into three portable SOPs: (1) DDD layer-boundary enforcement, (2) LLM output security, (3) aggregate mutation versioning.

## rules/arch/UNIT_TESTS.md

**Type:** Convention ruleset — unit test structure, per-DDD-layer conventions, anti-patterns, and programmatic enforcement split

**Portable:** Mostly yes — with stripping

**Reason:** Three anti-patterns (AP1: assert-on-mock-calls instead of outcomes; AP2: echo/tautology tests; AP3: tests trivially simpler than the code) are universally valuable and language-agnostic. The per-DDD-layer structural patterns (domain entity, use case, service, handler, infrastructure) are directly reusable in any DDD project. The enforcement split — programmatic vs. code-review — is a useful meta-pattern. Python/pytest specifics (`pytestmark`, `AsyncMock`, `make architecture-check`, `conftest.py`) are project-local and must be stripped or made generic.

**Trigger:** Writing or reviewing unit tests; establishing test conventions for a new project; DDD-layered codebases adding test structure rules

**Steps/contract:**
1. Require module-level and function-level docstrings on every test file/function
2. Ban `setUp`/`tearDown`; replace with per-test factory functions (`_make_service()`, `_make_message()`)
3. Assign each DDD layer its own test structure (entity → standalone funcs; use case → 2–3 funcs, inline mocks; service → one class per operation; handler → one class per handler; infra → patch external APIs)
4. Ban mock-call assertions (AP1) — verify outcomes/state, not which methods were called; exception for handler delegation
5. Ban echo/tautology tests (AP2) — no standalone test that repeats a field assertion already covered in a fuller test
6. Ban tests that are simpler than the code they cover (AP3)
7. Use module-level constants for test data; group with section separators

**Strip:** `pytestmark = pytest.mark.asyncio`, `AsyncMock(spec=...)`, `make architecture-check`, `conftest.py` autouse fixture, `patch.object`, Python syntax in examples, Russian-language headings (translate/normalize)

**Structure/format:** Numbered rules split into programmatic (UT1–UT5) vs. convention (UT6–UT13) categories; anti-patterns block (AP1–AP3) with before/after examples; strong signal-to-noise ratio; code examples for every rule

**Notes:** Written partly in Russian — needs full English translation for a portable SOP. The AP1–AP3 anti-patterns block is the highest-value extract and stands alone as a reusable "test quality" policy. The layer-by-layer structure guide (UT6–UT10) is a good template for any DDD project but would need the layer names adjusted to match the target domain model.

## rules/arch/db/TRANSACTIONS.md
**Type:** Architectural rules (DB transactions + outbox pattern)
**Portable:** Yes — with light stripping
**Reason:** Concrete, enforceable DDD/CQRS transaction discipline: one-aggregate-per-transaction, outbox-in-same-tx, no side-effects inside tx, optimistic locking, idempotency, retry with backoff. Rules are framework-agnostic and apply to any relational-DB write path in a CQRS/event-driven system.
**Trigger:** Working in `src/infrastructure/db/**` or `migrations/**`; writing command handlers, application services, or repository implementations; implementing event publishing or outbox patterns.
**Steps/contract:**
1. Open transaction at application-service / command-handler layer only.
2. One repository → one aggregate → one transaction; no nested transactions.
3. No network calls, HTTP, queue publishes, or sleeps inside the transaction.
4. Write outbox record in the same transaction as the aggregate save.
5. Choose isolation level deliberately (default READ COMMITTED); document if REPEATABLE READ / SERIALIZABLE is required.
6. Use optimistic locking (version check on write); retry with bounded backoff on conflict at application-service level.
7. Side effects (email, Kafka, HTTP) execute strictly after commit.
8. Outbox delivered by a separate worker; each record has the minimum required fields: event_id, event_type, event_version, aggregate_id, aggregate_type, aggregate_version, payload, occurred_at, correlation_id, causation_id, status (NEW|SENT|FAILED), retry_count.
9. Outbox records are immutable; errors produce a new event, not a payload UPDATE.
10. Log transaction_id, command_id, aggregate_id, retry_count for every transaction.
**Strip:** Russian-language headings and prose (translate or rewrite in English); duplicated OUTBOX section that restates transaction rules already covered; "mini-template" boilerplate at the end; RETENTION cross-reference (out of scope for SOP body).
**Structure/format:** Rule list with antipattern appendix and typed step-by-step patterns (Create / Update / Conflict). Outbox contract is a named field table — keep as checklist. Good candidate for two sections: *Transaction rules* and *Outbox contract*.
**Notes:** Written entirely in Russian; content is high-signal and unusually precise for this domain. The outbox schema (11-field contract) is the strongest portable artefact. Antipattern list is actionable and worth preserving verbatim (translated). No placeholder or fictional context — all rules are directly implementable.

## skills/triz/SKILL.md
**Type:** Reasoning framework / problem-solving methodology
**Portable:** Yes — with one significant caveat (language)
**Reason:** Full ARIZ-85V (TRIZ) structured problem-solving workflow: mini-task formulation, conflicting-pair identification, IFR definition, physical/technical contradiction resolution, resource mobilisation, 40 inventive principles, vepole analysis, and RVS operator. Covers a rigorous 9-step loop with built-in self-check and reflection. The methodology is domain-agnostic (software, product design, architecture, engineering) and the software-mapping tables make it immediately useful for engineering AI agents. No repo-specific dependencies.
**Trigger:** "stuck on a design problem", "architectural trade-off", "improving one parameter worsens another", "TRIZ", "contradiction", "IFR", "inventive principles"
**Steps/contract:** 9 mandatory steps — (1) task analysis + mini-task + conflicting pair, (2) model: technical contradictions + operative zone/time, (3) IFR + physical contradiction (macro/micro), (4) resource inventory (substance/field/spatial/temporal/informational/functional), (5) contradiction resolution via 4 separation principles + 40 inventive principles + vepole analysis + solution formulation, (6) solution verification checklist + invention level rating + new-contradiction check, (7) codebase mapping (optional, skip if non-code), (8) RVS operator mental experiment, (9) reflection/pattern capture. Progress summary after each step required.
**Strip:** Entire skill body is written in Russian ("Роль", narrative backstory, persona intro paragraph about 20 years experience and MATRIZ certification). The role/persona preamble and the instruction "Язык общения: русский" must be rewritten in English for a portable, language-neutral SOP. All structured templates and reference tables (40 principles, separation table, anti-patterns) are highly reusable as-is. The `model: opus` + `effort: max` frontmatter reflects appropriate resource allocation but is platform-specific.
**Structure/format:** Excellent. Deeply structured with clearly labelled fenced-block output templates for every sub-step, two reference tables (40 principles mapped to software idioms; 4 separation principles), anti-pattern list, and a per-step progress-report format. Very high signal-to-noise ratio in the templates.
**Notes:** Highest-quality reasoning-framework skill in the repo. The software-mapping column on the 40 principles ("разделить монолит" → "разбить компонент на хуки", "rate limiter / circuit breaker", etc.) is the standout differentiator — not found in any other TRIZ prompt library. Portability blocker is the Russian language; rewriting in English unlocks a world-class structured problem-solving SOP. Recommend promoting as `skills/triz/SKILL.md` after language rewrite and stripping persona backstory.

## skills/pipe/SKILL.md
**Type:** Meta-orchestrator skill (pipeline runner)
**Portable:** Partial — concept is portable; implementation is tightly coupled to this repo's Agent tool invocation pattern and Russian-language prompts
**Reason:** The core pattern — parse a comma-delimited skill list, validate each skill file exists, read its content, run agents sequentially passing output as input to the next phase, and emit a structured pipeline report — is a genuinely useful portable SOP. However, the prompt body is written entirely in Russian, relies on a specific `.claude/skills/<name>/SKILL.md` path convention, and uses an `Agent` tool API that may not exist in all harnesses.
**Trigger:** User provides a task requiring multiple sequential methodologies (e.g., "triz,tdd Add resizer feature"); or any multi-phase workflow where output of one skill feeds the next.
**Steps/contract:**
1. Parse `$ARGUMENTS` — first token(s) before the first space-after-comma are the skill list; remainder is the user prompt.
2. Validate each skill name against available `.claude/skills/*/SKILL.md` via Glob.
3. Read each SKILL.md, stripping frontmatter.
4. For each skill i…k: build a phase prompt (pipeline context + previous output + skill body), launch an Agent tool call sequentially, capture full output.
5. Gate: if a phase breaks tests, halt pipeline and surface to user before continuing.
6. Emit a `## Pipeline: skill1 → … → skillN` report with per-phase summaries and a changed-files list.
**Strip:** Russian-language prose (translate to English); hardcoded `.claude/skills/` path (parameterise); `Agent` tool calls (abstract to harness-agnostic spawn pattern); anti-pattern list (preserve as rules); progress tracker (preserve).
**Structure/format:** Frontmatter (name, description, argument-hint, model, effort) + Role section + Algorithm (5 steps) + Context-handoff rules by phase-type pairing + Error handling + Anti-patterns + Progress display block.
**Notes:** The anti-patterns section is high-signal and portable as-is (don't run phases in parallel, don't skip phases without consent, don't pass only summaries, halt on broken tests). The phase-type pairing rules (analytic→implementation, analytic→analytic, etc.) for context handoff are a useful design pattern worth preserving as guidance rather than hard rules.

## agents/ui-ux-engineer.md
**Type**: Agent role — TDD-driven UI/UX frontend component craftsman
**Portable**: Partial
**Reason**: The 6-phase TDD loop (ANALYZE→DESIGN→RED→GREEN→REFACTOR→VERIFY), component design template (Props API / states / keyboard / a11y), interaction principles, and anti-patterns table are genuinely portable. The file is otherwise tightly coupled to a specific project: Russian-language output, React 19 / Vite / Vitest+RTL stack, a fixed 4-layer component architecture (ui/shared/domain/layout), project-specific CSS token names, dark-first mandate, and hardcoded build commands (`cd packages/front && make check`).
**Trigger**: Creating or redesigning UI components; fixing UX issues; building interactive features — whenever test-first frontend work is needed.
**Steps/contract**:
1. ANALYZE — read existing components, find patterns, check available design tokens, identify layer, check for duplicates
2. DESIGN — draft Props API, states, keyboard behaviour, accessibility contract; show 5-10 line summary before writing tests
3. RED — write failing Vitest/RTL tests covering rendering, variants, interactions, states, aria; run to confirm failure
4. GREEN — write minimum code to pass tests; no polish; run to confirm pass
5. REFACTOR — add micro-interactions, breathing space, typography hierarchy, motion, responsiveness, edge cases
6. VERIFY — run full check suite; fix all failures before responding
**Strip**: Russian output directive; stack specifics (React 19, Vite, Vitest, RTL, Playwright); 4-layer directory architecture; CSS token fallback values; `cd packages/front && make check` command; dark-first project mandate; glassmorphism/backdrop-filter details tied to project aesthetic.
**Structure/format**: Tables (Visual DNA, Interaction Principles, Anti-Patterns), ASCII flowchart for TDD phases, fenced code blocks for test and CSS patterns, component design Markdown template. High information density; well-navigable.
**Notes**: The anti-patterns table (hardcoded colours → tokens, div → button, tests after code → tests before, etc.) is one of the strongest extractable artefacts — directly reusable as a checklist. The component design template (layer / purpose / Props API / states / keyboard / a11y) is a clean, portable pre-implementation spec format. The 6-phase loop's exit-condition discipline (confirm RED before GREEN, confirm GREEN before REFACTOR, no response until VERIFY passes) is the core SOP value worth preserving.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/db/VERSIONING.md / **Type**: architecture rule / **Portable**: partial / **Reason**: Strong reusable guidance on aggregate, schema, and event versioning, but it mixes multiple concerns and includes bundled naming rules in one file. / **Notes**: Portable core is optimistic locking, expand/contract migrations, and event/read-model versioning.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/db/WRITE_MODEL.md / **Type**: architecture rule / **Portable**: yes / **Reason**: It cleanly captures aggregate-bound write-model design, transactional boundaries, constraints, and outbox/idempotency rules in a broadly reusable form. / **Notes**: Best portable elements are one-aggregate-per-transaction, root-table modeling, and safe migration guidance.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/LOGS.md / **Type**: observability rule / **Portable**: yes / **Reason**: The logging contract is general and implementation-agnostic, with clear structured logging, correlation, security, and retention rules. / **Notes**: Portable core is mandatory fields, payload redaction, and correlation_id propagation.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/MONITORING.md / **Type**: observability rule / **Portable**: yes / **Reason**: Prometheus-first monitoring guidance is broadly applicable and defines concrete metric naming, cardinality, SLO, and alerting patterns. / **Notes**: Portable core is the /metrics contract plus low-cardinality labels and SLO-driven alerts.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/SERVICES.md / **Type**: application architecture rule / **Portable**: partial / **Reason**: The service-layer boundaries and transaction rules are reusable, but the file is tied to Telegram-specific handlers, services, and error names. / **Notes**: Extract the thin-handler / service-orchestration pattern and generic transaction propagation rules.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/VIEWS.md / **Type**: presentation rule / **Portable**: partial / **Reason**: The side-effect-free view contract and UI separation are portable, but the file is anchored to specific project modules and architecture-test names. / **Notes**: Portable core is pure formatting functions with no DB/API access and clear presentation-layer boundaries.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/VISUAL_COHESION.md / **Type**: frontend architecture rule / **Portable**: yes / **Reason**: The cohesion/coupling rule is domain-agnostic and gives a useful general pattern for consistent layouts and shared tokens. / **Notes**: Portable core is one visual pattern per bounded context plus centralized layout tokens.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/frontend-design.md / **Type**: frontend design rule / **Portable**: partial / **Reason**: The component pattern and iconography guidance are reusable, but the file is narrow and contains product-specific component API details. / **Notes**: Portable core is a reusable confirm-dialog pattern and the icon-first UI principle.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/components/AGGREGATE_STRUCTURE.md / **Type**: Architecture SOP / **Portable**: partial / **Reason**: The aggregate boundary, repository, versioning, and test structure are broadly reusable, but the file is tightly coupled to Python package paths, SQLAlchemy, and repo-specific test filenames. / **Notes**: Portable core is the root/child entity split plus one-repository-per-aggregate and versioned optimistic locking.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/components/AGREGATES.md / **Type**: Domain modeling SOP / **Portable**: yes / **Reason**: This is a general DDD aggregate policy set that describes boundaries, invariants, transactions, and repository ownership without depending on one implementation stack. / **Notes**: Strong reusable guidance on aggregate boundaries, one root, atomic commits, and eventual consistency between aggregates.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/components/COMMANDS.md / **Type**: Application architecture SOP / **Portable**: yes / **Reason**: The command rules cleanly separate write intents, validation, handlers, and aggregate mutation in a stack-agnostic way. / **Notes**: Portable CQRS write-side guidance: one command per aggregate, no business logic in DTOs, and handler orchestration only.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/components/DOMAIN.md / **Type**: Domain modeling SOP / **Portable**: yes / **Reason**: The document provides broadly applicable DDD modeling guidance for bounded contexts, ubiquitous language, aggregates, and domain services. / **Notes**: Portable checklist for modeling domains and a useful template for defining domain elements.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/components/EVENTS.md / **Type**: Eventing SOP / **Portable**: yes / **Reason**: The rules around immutable facts, payload minimization, metadata, outbox publication, and idempotent handling are general event-driven architecture guidance. / **Notes**: Portable core is post-commit publication plus event versioning and metadata discipline.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/components/ONE_AGGREGATE_ONE_REPO.md / **Type**: Architecture policy / **Portable**: partial / **Reason**: The one-aggregate-one-repository constraint is reusable, but the file is framed around repo-specific path conventions and architecture-test wiring. / **Notes**: Portable element is the 1:1 mapping between aggregate, abstract repository, and concrete repository implementation.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/components/QURIES.md / **Type**: Application architecture SOP / **Portable**: yes / **Reason**: The query-side separation, DTO/read-model guidance, and performance expectations are broadly applicable CQRS/read-layer practices. / **Notes**: Portable core is read/write separation, projection-based read models, and predictable query performance.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/components/SHARED_KERNEL.md / **Type**: Domain architecture SOP / **Portable**: partial / **Reason**: The shared-kernel pattern, composition guidance, and immutability rules are reusable, but the document is heavily shaped by a specific directory layout and example notification config. / **Notes**: Portable core is shared immutable contracts for 2+ aggregates, with composition over inheritance and centralized versioning.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/db/CONSTRAINTS.md / **Type**: rule / **Portable**: partial / **Reason**: The invariant-first approach to PK/FK/UNIQUE/CHECK/NOT NULL is broadly reusable, but the document is anchored in database enforcement details and naming conventions. / **Notes**: Portable core is “encode business rules in constraints, not code”.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/db/INDEXES.md / **Type**: rule / **Portable**: partial / **Reason**: The query-first indexing workflow and N+1/offset warnings transfer well, while EXPLAIN, CONCURRENTLY, and index-type guidance are implementation-specific. / **Notes**: Portable element is the add-index process: query, plan, change, verify, catalog.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/db/NORMAL_FORMS.md / **Type**: rule / **Portable**: partial / **Reason**: Defaulting write models to 3NF with explicit, measured denormalization exceptions is generally applicable, but some examples and JSONB guidance are DB-flavor dependent. / **Notes**: Portable element is the documented exception template with source of truth, proof, risks, and rollback.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/db/PERFORMANCE.md / **Type**: rule / **Portable**: partial / **Reason**: The measurement-led performance budget mindset is reusable across systems, but the guidance is tied to query planning, indexes, and relational read/write trade-offs. / **Notes**: Portable element is defining latency budgets, validating them, and treating regressions as defects.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/db/READ_MODEL.md / **Type**: rule / **Portable**: partial / **Reason**: The read-model-first, DTO-based, eventual-consistency approach is widely reusable, but the file is specifically shaped around projection storage and event-driven refresh patterns. / **Notes**: Portable element is “design queries first, then build a dedicated read surface with explicit freshness SLA”.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/db/RETENTION.md / **Type**: policy / **Portable**: partial / **Reason**: Data-retention and PII-lifecycle rules are broadly applicable, but the exact TTLs, legal bases, and archival mechanics depend on domain and jurisdiction. / **Notes**: Portable element is the classification of data types plus explicit retention/delete/archive policy per type.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/db/SECURITY.md / **Type**: rule / **Portable**: partial / **Reason**: Least privilege, tenant isolation, PII minimization, and separate read/write roles are portable principles, but the concrete DB-role and RLS implementation is platform-specific. / **Notes**: Portable element is documenting isolation model, roles, PII fields, encryption, and audit scope.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/db/SEEDS_FIXTURES.md / **Type**: rule / **Portable**: yes / **Reason**: The seeds-versus-fixtures split, idempotency, and environment isolation are general practices that transfer cleanly across projects. / **Notes**: Portable element is the minimal seed contract plus reproducible, non-prod-only fixtures.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/frontend-testing.md / **Type**: testing conventions / **Portable**: partial / **Reason**: The testing patterns are broadly reusable, but the commands, paths, and stack choices are tied to a specific frontend setup. / **Notes**: Portable elements include what to test, what to avoid, and the screenshot-regression discipline.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/git.md / **Type**: git conventions / **Portable**: partial / **Reason**: The commit-message structure is useful anywhere, but the task-ID framing and required verbosity are more process-specific than universal. / **Notes**: The detailed title/body template and explanation-first rule are the most portable parts.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/makefile.md / **Type**: build orchestration conventions / **Portable**: partial / **Reason**: The delegation pattern and top-level command naming are portable, but the exact package layout and ports are repo-specific. / **Notes**: Strong portable core: root Makefile delegates to sub-Makefiles and `check` is the all-clear command.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/monorepo-structure.md / **Type**: repository structure rule / **Portable**: partial / **Reason**: The self-contained-package monorepo pattern is reusable, but the named root files and example package names are tailored to this workspace. / **Notes**: Portable core: shared infra at root, isolated packages, and no cross-package imports.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/ui-library.md / **Type**: UI architecture guidance / **Portable**: partial / **Reason**: The layered component-library model is broadly applicable, but the pathing and implementation details reflect one frontend stack. / **Notes**: Best portable elements are extract-from-duplication, tokens-first styling, and the ui/shared/domain separation.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/functions/practice/CHANGE_BREAKERS.md / **Type**: architecture smell catalog / **Portable**: yes / **Reason**: The change-breaker smells are language-agnostic refactoring guidance that applies across codebases. / **Notes**: Divergent Change, Shotgun Surgery, and Parallel Inheritance Hierarchies are universally useful signals.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/functions/practice/DEPS.md / **Type**: architecture smell catalog / **Portable**: yes / **Reason**: The dependency-related smells describe general coupling problems and are not tied to a specific framework or language. / **Notes**: Feature Envy, Inappropriate Intimacy, Message Chains, and Middle Man are directly portable.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/functions/practice/INFLATORS.md / **Type**: architecture smell catalog / **Portable**: yes / **Reason**: The size-and-complexity smells are broadly applicable refactoring heuristics for any mature codebase. / **Notes**: Long Method, Large Class, Primitive Obsession, Long Parameter List, and Data Clumps are all reusable SOP candidates.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/skills/deploy/SKILL.md / **Type**: procedural deployment SOP / **Portable**: partial / **Reason**: The rebuild→restart→migrate→health-check flow is reusable, but it hardcodes Docker Compose, Alembic, a specific backend path, and project ports. / **Notes**: Key portable element is the ordered failure-stopping deploy checklist.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/skills/describe/SKILL.md / **Type**: project description prompt / **Portable**: no / **Reason**: It is explicitly project-specific, forbids commands and file reads, and depends on this repo's CLAUDE.md context rather than a reusable process. / **Notes**: Skipped as a portable SOP because it is an answer template, not an operational workflow.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/skills/session-report/SKILL.md / **Type**: changelog/reporting SOP / **Portable**: partial / **Reason**: The diff→group-by-feature→summarize pattern is broadly useful, but the file bakes in repo-specific paths, tooling, and a product-report format. / **Notes**: Portable element is the feature-grouping heuristic that separates user-facing changes from infrastructure noise.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/skills/test-all/SKILL.md / **Type**: test orchestration SOP / **Portable**: partial / **Reason**: The baseline→run-all→report-delta workflow is reusable, but it is tightly coupled to this monorepo's package layout, commands, and Docker-dependent E2E setup. / **Notes**: Key portable element is the exhaustive, no-shortcuts test reporting structure.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/skills/ui/SKILL.md / **Type**: frontend implementation SOP / **Portable**: partial / **Reason**: The tests-first UI workflow and wiring checklist are reusable, but the implementation guidance is anchored to React 19, Vitest, CSS Modules, and this project's routing/style conventions. / **Notes**: Key portable element is the red-green wiring-verified delivery loop for UI changes.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/functions/practice/OOP_DESIGN.md
**Type**: refactoring smell taxonomy
**Portable**: partial
**Reason**: The smells are broadly applicable across codebases, but this file is mostly a diagnostic list rather than an executable SOP.
**Notes**: Strong portable value in the smell definitions (switch statements, temporary fields, refused bequest, alternative interfaces).

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/functions/practice/TRASHERS.md
**Type**: refactoring smell taxonomy
**Portable**: partial
**Reason**: The guidance is generic and reusable, but it skews toward identifying wasteful constructs instead of prescribing a repeatable workflow.
**Notes**: Portable core is the cleanup targets list: comments, duplicate code, lazy classes, dead code, speculative generality.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/functions/techs/CONDITIONS.md
**Type**: refactoring playbook
**Portable**: yes
**Reason**: The problems and solutions map cleanly to common conditional-refactoring cases in most languages and repositories.
**Notes**: Highly portable techniques: guard clauses, consolidate conditionals, polymorphism, null object, assertions.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/functions/techs/DATA.md
**Type**: refactoring playbook
**Portable**: yes
**Reason**: The techniques translate well across codebases because they focus on modeling data, encapsulation, and type replacement.
**Notes**: Portable elements include value objects, encapsulation, symbolic constants, and subtype/state conversions.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/functions/techs/FUNCTIONS.md
**Type**: refactoring playbook
**Portable**: yes
**Reason**: Moving behavior between classes, extracting classes, and hiding delegates are common structural refactors with broad reuse.
**Notes**: Portable techniques include move method/field, extract/inline class, hide delegate, remove middle man.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/functions/techs/GENERALIZATIONS.md
**Type**: refactoring playbook
**Portable**: yes
**Reason**: The inheritance and interface refactors are standard cross-project patterns for normalizing hierarchies.
**Notes**: Portable core covers pull up/push down, extract superclass/interface, collapse hierarchy, delegation vs inheritance.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/functions/techs/METHODS.md
**Type**: refactoring playbook
**Portable**: yes
**Reason**: The methods-focused techniques are language-agnostic and directly reusable as implementation guidance.
**Notes**: Portable moves include extract/inline method, parameter cleanup, method object, and algorithm substitution.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-claude/rules/arch/functions/techs/SIMPLIFY.md
**Type**: refactoring playbook
**Portable**: yes
**Reason**: The method-signature simplifications and query/modifier splits are broadly applicable SOP material.
**Notes**: Portable techniques include parameter object, factory method, hide method, exception-to-test, and query/modifier separation.
