# Role-to-SOP Audit — awesome-claude
**Source repo**: awesome-claude (internal "Test Guardian" project)
**Audit date**: 2026-03-28
**Based on**: `raw-findings.md` (same directory)

---

## 1. Repo Overview

awesome-claude is a private Python + React monorepo built around a "Test Guardian" product — an AI-assisted test-analysis and resume-matching platform. The repo houses the full agent-tooling layer for the project: Claude skills, subagent definitions, architecture rules, and DDD design contracts. It is organised into `agents/`, `skills/`, and `.references/awesome-claude/rules/arch/` subtrees, with a `rules/` root for cross-cutting conventions. The entire codebase is written in Russian, which is the primary portability barrier throughout. The DDD architecture is unusually rigorous: aggregates carry enforced `version` fields, architecture tests validate import direction via AST scanning, and every layer (commands, events, repositories, queries, views, services) has an explicit written contract. The test stack is Python/pytest for the backend and React/Vitest/RTL for the frontend. Observability, DB migrations, data retention, and index policy are each governed by dedicated rule files. Agent-automation quality is high — skills feature hard-stop gates, pre-flight confirmation steps, and progress-reporting protocols. The primary barriers to cross-team adoption are (a) Russian prose throughout, (b) hardcoded project paths and stack names, and (c) several files containing operational config (`model: opus`, absolute local paths) mixed with portable process rules.

---

## 2. Content Summary

| Category | File count | Portability signal |
|---|---|---|
| Agent skills (workflow automation) | 8 | Mixed — process logic portable; stack/locale not |
| Architecture rules — DDD aggregates & layer contracts | 12 | High concept portability; all need translation |
| DB rules — schema, migrations, indexing, retention | 10 | High; all need translation |
| Code quality / refactoring reference catalogs | 10 | Low — passive references, not actionable SOPs |
| CI/check gates & commit conventions | 3 | High — near drop-in portable after minor strip |
| Observability & tracing | 2 | Medium — Prometheus-specific parts; rest portable |
| Security (LLM + DB) | 2 | High — universally applicable, needs translation |
| Frontend / UI rules | 4 | Partial — one portable layer per file at most |
| Meta-rules & rule authoring | 1 | High — governance contract for any skills system |
| Project-specific reference (non-portable) | 6 | None |

**Total files audited**: 58
**Recommended for port**: 28 (full or partial)
**Leave out**: 30

---

## 3. SOP Split — Port vs Leave Out

### Port (Yes / Partial)

| File | Decision | Reason |
|---|---|---|
| `.references/awesome-claude/rules/break-stop.md` | **Port** | Universal CI gate with hard-stop protocol; no stack dependency; the proactive-warning variant (warn before applying a predicted breaking change) is rare and high-value [→ §9 Evidence #1] |
| `.references/awesome-claude/rules/git.md` | **Port** | Stack-agnostic commit message format (What/Why/Details); `[TASK-ID]` is already a placeholder [→ §9 #2] |
| `.references/awesome-claude/skills/commit/SKILL.md` | **Port** | Seven-step commit workflow with confirmation gate; complements `.references/awesome-claude/rules/git.md`; needs translation and locale strip |
| `.references/awesome-claude/rules/arch/LLM_SECURITY.md` | **Port** | Universal LLM integration security checklist; antipattern list (role-via-LLM, eval, persona-injection, raw SQL) is high-signal [→ §9 #3] |
| `.references/awesome-claude/rules/arch/db/MIGRATIONS.md` | **Port** | Expand/contract lifecycle, safety checklist, CONCURRENTLY indexing, dual-schema-version compatibility — universally applicable; needs translation [→ §9 #4] |
| `.references/awesome-claude/rules/arch/LOGS.md` | **Port** | Full logging contract: mandatory fields, level semantics, PII prohibition, correlation-ID threading; needs translation [→ §9 #5] |
| `.references/awesome-claude/rules/arch/db/SECURITY.md` | **Port** | DB role separation, authZ-before-write rule, tenant isolation, PII minimisation; decision mini-template is immediately reusable [→ §9 #6] |
| `.references/awesome-claude/rules/arch/db/CONSTRAINTS.md` | **Port** | Business-invariant → DB-constraint mapping; aggregate-boundary FK rules; naming standard; red-flag list; needs translation |
| `.references/awesome-claude/rules/arch/db/WRITE_MODEL.md` | **Port** | 26 stack-agnostic write-model rules + aggregate mini-template; outbox co-transactional rule rarely stated this explicitly |
| `.references/awesome-claude/rules/arch/db/VERSIONING.md` | **Port** | Optimistic locking, expand/contract, event versioning, ubiquitous-language naming — two documents concatenated; should split on promotion |
| `.references/awesome-claude/rules/arch/db/RETENTION.md` | **Port** | Full retention lifecycle (classify → policy → soft/hard delete → PII → archival → audit); anti-patterns + mini-policy table; needs translation |
| `.references/awesome-claude/rules/arch/db/SEEDS_FIXTURES.md` | **Port** | Seeds-vs-fixtures distinction; idempotency; environment isolation; mini-template per data set; universally applicable |
| `.references/awesome-claude/rules/meta-rules.md` | **Port** | Governance spec for any skills system: universality constraints, one-topic-per-file, when-to-propose-new-rules heuristics [→ §9 #7] |
| `.references/awesome-claude/agents/code-review-sentinel.md` | **Port (partial)** | Review phases + severity tagging + APPROVE/REQUEST CHANGES/BLOCK framework are fully portable; stack-specific context must be stripped [→ §9 #8] |
| `.references/awesome-claude/agents/planner.md` | **Port (partial)** | 6-criteria requirements-completeness table, 4-phase workflow, 5-category risk taxonomy; "read files, don't guess" constraint; DDD paths and Russian mandate must be stripped |
| `.references/awesome-claude/agents/ui-ux-engineer.md` | **Port (partial)** | 6-phase TDD loop (ANALYZE→DESIGN→RED→GREEN→REFACTOR→VERIFY); anti-patterns table; scope discipline rule; stack and locale must be stripped |
| `.references/awesome-claude/skills/tdd/SKILL.md` | **Port (partial)** | 7-step TDD workflow; corner-case checklist; 6-question destructive-tester mindset; UI-wiring close-out checklist; RED/GREEN progress banner format [→ §9 #9] |
| `.references/awesome-claude/skills/ui/SKILL.md` | **Port (partial)** | Wiring-check step (green tests ≠ working feature); visual analysis spec template; identical TDD loop to tdd skill — cross-check delta before promoting separately |
| `.references/awesome-claude/skills/tracing/SKILL.md` | **Port (partial)** | Incident vs Feature Tracing modes; chain-break tracing pattern; 5-type issue table taxonomy; PlantUML-as-proof-of-understanding principle; stack examples must be stripped |
| `.references/awesome-claude/rules/arch/components/EVENTS.md` | **Port (partial)** | 14 domain-event rules; outbox-after-commit constraint; domain/integration event split; needs translation |
| `.references/awesome-claude/rules/arch/components/COMMANDS.md` | **Port (partial)** | One-command-one-aggregate rule; DTO-only constraint; idempotency key; command↔event boundary; needs translation |
| `.references/awesome-claude/rules/arch/db/TRANSACTIONS.md` | **Port (partial)** | Transaction scope, isolation levels, optimistic locking, no-network-in-transaction, outbox contract; DDD assumption limits full portability |
| `.references/awesome-claude/rules/arch/components/AGREGATES.md` | **Port (partial)** | 25 DDD aggregate rules; violations-become-tech-debt mechanism; "no cross-aggregate FK" and "domain events after commit" are the most portable; needs translation |
| `.references/awesome-claude/rules/arch/ARCH_TESTS.md` | **Port (partial)** | AST-driven architecture enforcement pattern; R8 (LLM-derived fields must not gate authZ) is uniquely portable; per-change obligations checklist; needs translation |
| `.references/awesome-claude/rules/arch/db/PERFORMANCE.md` | **Port (partial)** | Performance budgets, query contract template, write/read path separation, anti-patterns; CQRS-specific sections should be marked optional |
| `.references/awesome-claude/rules/arch/db/READ_MODEL.md` | **Port (partial)** | 22 CQRS read-model rules; freshness SLA formalism; idempotent projections; view mini-template; CQRS prerequisite limits audience |
| `.references/awesome-claude/skills/pipe/SKILL.md` | **Port (partial)** | Sequential pipeline meta-pattern; context-handoff taxonomy by phase-type pair; hard-stop-on-broken-tests; needs translation |
| `.references/awesome-claude/skills/triz/SKILL.md` | **Port (partial)** | 9-step ARIZ-85V; 40-inventive-principles-to-software-patterns table is the standout portable artifact; heavy translation required |
| `.references/awesome-claude/rules/arch/MONITORING.md` | **Port (partial)** | Prometheus-first contract; cardinality rules (exact forbidden label types); SLO-anchored alerting; "monitoring is a system contract" framing; CQRS sections optional |
| `.references/awesome-claude/rules/arch/SERVICES.md` | **Port (partial)** | Thin-handler contract; transaction-management matrix (write/domain-error/read); call-direction rule; stack specifics must be stripped |
| `.references/awesome-claude/rules/arch/STATE_OWNERSHIP.md` | **Port (partial)** | Mutation flow pattern; "frontend is a stateless projection" framing; R6 optimistic-update nuance; all code examples must be stripped |
| `.references/awesome-claude/rules/ui-library.md` | **Port (partial)** | 4-layer component hierarchy; dependency-direction contract; extract-from-duplication-not-speculation rule; needs translation |

### Leave Out

| File | Reason |
|---|---|
| `.references/awesome-claude/rules/frontend-testing.md` | Pure stack reference (Vitest/RTL/Playwright); no transferable SOP protocol |
| `.references/awesome-claude/rules/frontend-design.md` | Three unrelated conventions, two project-specific; one portable icon rule too thin to stand alone |
| `.references/awesome-claude/rules/arch/VISUAL_COHESION.md` | CSS layout specifics only; no cross-cutting applicability |
| `.references/awesome-claude/rules/makefile.md` | Project-specific three-level Makefile topology; nothing survives stripping |
| `.references/awesome-claude/skills/deploy/SKILL.md` | Hardcoded absolute local path, named Docker services, fixed port; not abstractable |
| `.references/awesome-claude/skills/describe/SKILL.md` | Entirely project-specific; zero portable content beyond frontmatter pattern |
| `.references/awesome-claude/skills/session-report/SKILL.md` | Russian-language mandate; hardcoded file paths; underlying user-perspective naming principle could be harvested into an existing skill |
| `.references/awesome-claude/skills/test-all/SKILL.md` | Every concrete detail hardcoded to one monorepo; pattern (collect-all-before-report, delta vs baseline) extractable as principle notes, not a standalone SOP |
| `.references/awesome-claude/rules/arch/functions/practice/CHANGE_BREAKERS.md` | Passive Fowler smell reference; no procedure |
| `.references/awesome-claude/rules/arch/functions/practice/OOP_DESIGN.md` | Passive reference, no detection/remediation workflow |
| `.references/awesome-claude/rules/arch/functions/practice/TRASHERS.md` | Thin Russian recap of Fowler Dispensables; zero novel guidance |
| `.references/awesome-claude/rules/arch/functions/practice/DEPS.md` | Four smell names with one-line definitions; no actionable SOP |
| `.references/awesome-claude/rules/arch/functions/practice/INFLATORS.md` | Definitional only; no trigger or agent contract |
| `.references/awesome-claude/rules/arch/functions/techs/GENERALIZATIONS.md` | Reference catalog; no agent-facing logic |
| `.references/awesome-claude/rules/arch/functions/techs/CONDITIONS.md` | Fowler patterns; marginal value after translation; at most 2–3 patterns worth extracting into a refactor skill |
| `.references/awesome-claude/rules/arch/functions/techs/FUNCTIONS.md` | Reference catalog; no protocol |
| `.references/awesome-claude/rules/arch/functions/techs/DATA.md` | Reference catalog; 3 patterns extractable as seeds but not a standalone SOP |
| `.references/awesome-claude/rules/arch/functions/techs/SIMPLIFY.md` | 14 Fowler techniques; static reference only |
| `.references/awesome-claude/rules/arch/functions/techs/METHODS.md` | Russian-language Fowler subset; no protocol |
| `.references/awesome-claude/rules/arch/VIEWS.md` | Only 1 of 3 sections portable (pure functions); too thin to promote standalone |
| `.references/awesome-claude/rules/arch/components/ONE_AGGREGATE_ONE_REPO.md` | DDD axiom (R10a/b/c); sound but fully subsumed by `.references/awesome-claude/rules/arch/components/AGREGATES.md` |
| `.references/awesome-claude/rules/arch/components/AGGREGATE_STRUCTURE.md` | Strong DDD contracts but fully subsumed by `.references/awesome-claude/rules/arch/components/AGREGATES.md` + `.references/awesome-claude/rules/arch/db/WRITE_MODEL.md` |
| `.references/awesome-claude/rules/arch/components/DOMAIN.md` | DDD modelling checklist; useful but subordinate to `.references/awesome-claude/rules/arch/components/AGREGATES.md`; element template extractable as appendix |
| `.references/awesome-claude/rules/arch/components/QURIES.md` | Read-model constraints subsumed by `.references/awesome-claude/rules/arch/db/READ_MODEL.md`; promote that instead; filename typo |
| `.references/awesome-claude/rules/arch/components/SHARED_KERNEL.md` | Valuable DDD pattern; very long and Python-specific; absorb shared-kernel principle into DDD aggregate skill |
| `.references/awesome-claude/rules/arch/db/NORMAL_FORMS.md` | Write/read normalization split; subsumed by `.references/awesome-claude/rules/arch/db/WRITE_MODEL.md` + `.references/awesome-claude/rules/arch/db/READ_MODEL.md`; exception template worth harvesting |
| `.references/awesome-claude/rules/monorepo-structure.md` | Structural principles OK but too thin; "no cross-package imports" extractable as a note |
| `.references/awesome-claude/rules/arch/UNIT_TESTS.md` | Python/pytest-specific; AP1 ("test contract not implementation") extractable into existing `tdd` skill |

---

## 4. Per-SOP Table — Port Candidates

> Columns: **Trigger** | **Steps / Contract** | **Quality Bar** | **Escalation** | **Strip** | **Notes**

---

### `.references/awesome-claude/rules/break-stop.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/rules/break-stop.md` |
| **Trigger** | After every logical change; pre-emptively when a requested change will predictably break existing tests, types, or contracts |
| **Steps / Contract** | (1) Run check suite after each logical unit. (2) On failure: output failure banner, STOP, ask user for instructions — do not self-repair. (3) On predicted breakage: warn BEFORE applying, list what will break and why, require explicit "yes" to proceed. Severity split: trivial formatting/import fixes may auto-correct; broken functionality is always a hard stop |
| **Quality Bar** | All checks pass before continuing; user confirms on any predicted breakage |
| **Escalation** | Surface to user on any functional failure; do not attempt autonomous repair |
| **Strip** | Russian-language confirmation examples; literal emoji art block; `make check` → `<check command>` |
| **Notes** | The proactive-warning section is the strongest differentiator vs. standard post-hoc rules. Severity split prevents alert fatigue. Pairs with TDD and CI skills |

---

### `.references/awesome-claude/rules/git.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/rules/git.md` |
| **Trigger** | Any time a commit message is being composed |
| **Steps / Contract** | (1) Format title as `[TASK-ID]: <imperative verb> <what>` — max 72 chars. (2) Blank-line separator. (3) Three body sections: What changed (file-level bullets), Why (motivation / problem / issue link), Details (trade-offs, non-obvious decisions, side effects). (4) Mention test coverage: what was tested, what edge cases were covered |
| **Quality Bar** | Title ≤72 chars; all three sections present; test coverage mentioned |
| **Escalation** | None — commit conventions do not escalate |
| **Strip** | `paths:` YAML frontmatter; `MUST`/`Never` framing → positive reframe; worked example → condense to shorter stub; `[TASK-ID]` documented as project-replaceable placeholder |
| **Notes** | File-by-file listing and explicit test coverage note are the differentiating value vs. conventional-commits alone |

---

### `.references/awesome-claude/skills/commit/SKILL.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/skills/commit/SKILL.md` |
| **Trigger** | User wants to create a git commit or asks for help committing staged/unstaged changes |
| **Steps / Contract** | (1) Run `git status`, `git diff HEAD`, `git log --oneline -5` in parallel. (2) Identify changed files; exclude credentials, `.env`, temp files. (3) Group by logical unit; propose splitting if mixed concerns. (4) Draft commit message per `.references/awesome-claude/rules/git.md` format. (5) Show proposed file list + full message; wait for explicit confirmation. (6) Stage by explicit name (never `git add .`); commit via heredoc. (7) Verify with `git status` + `git log -1` |
| **Quality Bar** | User confirmation before any write action; `--no-verify` never used |
| **Escalation** | Stop and surface to user on any credential or sensitive-file detection |
| **Strip** | Russian prose; `[TG-42]` → `[TICKET-ID]`; `Co-Authored-By` model-version line; `.claude/rules/git.md` reference → "project commit conventions" |
| **Notes** | "Never use `--no-verify` — fix the root cause instead" is a strong portable principle. Complements `gc` skill (multi-commit splitting); this skill is for crafting a single high-quality commit |

---

### `.references/awesome-claude/rules/arch/LLM_SECURITY.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/rules/arch/LLM_SECURITY.md` |
| **Trigger** | Any task involving LLM API integration, prompt construction, handling/parsing LLM responses, or reviewing code that acts on LLM output |
| **Steps / Contract** | (1) Treat all LLM output as untrusted external input. (2) Never use LLM output for authZ/authN decisions. (3) Isolate user content from system prompt — no direct concatenation. (4) Parse responses into typed structures; handle parse failures explicitly. (5) Sanitise LLM output before SQL/shell/eval/template/file-path operations. (6) Flag external content parsed by LLM (HTML, PDF) as potentially poisoned. (7) Cap retry logic and log retries. (8) Omit PII from LLM output logs |
| **Quality Bar** | All eight rules pass before code integrating LLM output ships |
| **Escalation** | Authz violation → block; prompt-injection risk → surface to security reviewer |
| **Strip** | `paths:` frontmatter; Russian prose (translate); Cyrillic inline code comments → English pattern names |
| **Notes** | Antipattern list (role-via-LLM, eval, persona-injection, raw SQL) is excellent. No overlap with existing audit-security skill. Strong candidate for a `llm-security` rule |

---

### `.references/awesome-claude/rules/arch/db/MIGRATIONS.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/rules/arch/db/MIGRATIONS.md` |
| **Trigger** | Whenever a DB schema or data migration is being planned, written, or reviewed |
| **Steps / Contract** | (1) All schema changes via migrations only — no manual prod edits. (2) Forward-only: rollback via new migration, never reverting the file. (3) Each migration is atomic and single-purpose. (4) Lifecycle: add nullable/new first → deploy dual-compatible code → backfill data → remove old columns. (5) Prohibited without special procedure: `ALTER COLUMN TYPE` on large tables, `ADD COLUMN NOT NULL` without default/backfill, index creation without `CONCURRENTLY` on large data, long DDL transactions. (6) Backfill: batched, idempotent, observable. (7) Code must tolerate two schema versions during rollout. (8) Fill 9-field safety checklist before each migration |
| **Quality Bar** | Safety checklist complete before merge; expand/contract lifecycle followed; no prohibited operations |
| **Escalation** | Prohibited operation detected → stop and escalate to tech lead |
| **Strip** | Russian prose (full translation); `.references/awesome-claude/rules/arch/db/INDEXES.md` cross-reference → "your index catalogue"; theatrical commentary |
| **Notes** | Dual-schema-version compatibility requirement is an often-omitted but critical constraint. Safety checklist (9 fields) is the strongest standalone artifact |

---

### `.references/awesome-claude/rules/arch/LOGS.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/rules/arch/LOGS.md` |
| **Trigger** | When writing logging code, designing observability layers, reviewing log output, or setting up a new service |
| **Steps / Contract** | (1) All logs are structured JSON. (2) Mandatory fields: timestamp, level, service, environment, message, correlation_id. (3) Level semantics: ERROR = incomplete + action required; WARN = deviation, continues; INFO = business transitions; DEBUG = diagnostic; TRACE = local only. (4) Write path: log command entry/exit — type, aggregate ID, version before/after, result; no full payload. (5) Read path: log aggregated queries — type, pagination, result count, latency; no PII. (6) Events: log publication fact only; no payload; delivery/processing errors separate. (7) Errors: typed error_code; stack trace only at ERROR level. (8) Correlation ID mandatory and threaded through all async processes — absence is an architectural defect. (9) PII and secrets prohibited in logs. (10) Alerts on ERROR rate, latency spikes, repeated domain failures |
| **Quality Bar** | All 10 rules pass; correlation_id present in every log record |
| **Escalation** | Missing correlation_id → architectural defect, must be fixed before merge |
| **Strip** | Russian prose (full translation); `paths: src/**/*.py` frontmatter → widen or drop |
| **Notes** | "Absence of correlation_id is an architectural defect" is an unusually strong, portable framing. "Logs are not the source of truth" prevents log-as-event-store anti-patterns |

---

### `.references/awesome-claude/rules/arch/db/SECURITY.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/rules/arch/db/SECURITY.md` |
| **Trigger** | When designing or reviewing a DB access layer, writing migrations, implementing multi-tenant isolation, handling PII, or auditing authZ placement |
| **Steps / Contract** | (1) Separate DB roles: write / read / migration / admin. (2) DDL only via migrations. (3) Document one tenant isolation model (tenant_id / schema / separate DB). (4) Minimise PII; encrypt at rest for sensitive fields; enforce retention. (5) Authorise before the write transaction — not after, not in middleware. (6) Filter read projections by access rights; search/sort must not leak metadata. (7) Audit critical operations; restrict access to audit logs. (8) Errors must not expose SQL, stack traces, or table names. (9) Record architectural decisions using 9-field mini-template |
| **Quality Bar** | All 9 rules satisfied; decision template completed on adoption |
| **Escalation** | AuthZ-after-write detected → block; PII leakage in read model → block |
| **Strip** | Russian prose; rhetorical asides; frontmatter path globs |
| **Notes** | "Read models are public surface — anything in them is potentially leaked" and "authorisation before the write transaction" are unusually precise portable framings |

---

### `.references/awesome-claude/rules/arch/db/CONSTRAINTS.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/rules/arch/db/CONSTRAINTS.md` |
| **Trigger** | When designing or reviewing DB schemas, writing migrations, or auditing constraint coverage |
| **Steps / Contract** | (1) Every business invariant expressible as a constraint must be one. (2) Within-aggregate: FK + CASCADE allowed. (3) Between aggregates: ID-reference only, no cascades. (4) UNIQUE for all business keys; composite for multi-tenant scopes. (5) CHECK for simple domain rules; NOT NULL by default. (6) Every constraint must follow the naming standard (pk_, fk_, uq_, ck_). (7) Document any absent FK with reason |
| **Quality Bar** | Naming standard followed; no cross-aggregate cascades; business keys have UNIQUE constraints |
| **Escalation** | Cross-aggregate cascade detected → block; unconstrained business key → warning |
| **Strip** | Russian prose and inline commentary; colourful aside → rephrase; documentation template → keep |
| **Notes** | Aggregate-boundary FK rule is the most valuable element — encodes DDD boundary discipline that most DB rules omit |

---

### `.references/awesome-claude/rules/arch/db/WRITE_MODEL.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/rules/arch/db/WRITE_MODEL.md` |
| **Trigger** | Designing or reviewing a write-model schema; implementing or auditing repositories; creating DB migrations; adding cross-aggregate references or event publishing |
| **Steps / Contract** | 26 rules including: (1) Each aggregate has a root table; one row = one root state. (2) Transactions strictly aggregate-scoped. (3) Cross-aggregate refs are IDs only; no cross-aggregate JOINs for writes. (4) FK/cascades permitted only within aggregate boundary. (5) Invariants via DB constraints, not application code. (6) Root table carries version field for optimistic locking. (7) All writes through aggregate's repository. (8) Write-model tables must not be shaped for read convenience. (9) Outbox written in same transaction as aggregate. (10) Write ops idempotent where retries possible. (11) Migrations follow expand/contract |
| **Quality Bar** | All 26 rules satisfied; aggregate mini-template completed for each new aggregate |
| **Escalation** | Cross-aggregate write without event/saga → architectural defect |
| **Strip** | Russian prose; `paths:` frontmatter |
| **Notes** | Three rules rarely stated elsewhere: outbox is co-transactional (not optional); cross-aggregate writes resolved via events/sagas; write-model indexes are for write/constraint enforcement only |

---

### `.references/awesome-claude/rules/arch/db/VERSIONING.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/rules/arch/db/VERSIONING.md` |
| **Trigger** | Any time an agent touches DB schema files, aggregate root entities, domain events, read models, or API DTOs; also when naming new tables, fields, indices, events, or commands |
| **Steps / Contract** | Versioning section: (1) Every aggregate root carries `version` column for optimistic locking. (2) Version mismatch → explicit conflict, retry-with-limit or domain error. (3) Forward-only migrations; rollback = new forward migration. (4) Expand/contract across deploys. (5) Events carry `event_version`; breaking changes require adapters. (6) API endpoints version contractually. Naming section: (7) Table names singular. (8) Child tables `<root>_<entity>`; read models `_view`/`_read` suffix. (9) PK = `id`; FK = `<entity>_id`; timestamps = `created_at`/`updated_at`/`deleted_at`. (10) Events: past-tense PascalCase. Commands: imperative PascalCase |
| **Quality Bar** | Naming conventions followed; version fields present on all aggregate roots; event versions incremented on payload changes |
| **Escalation** | Breaking change without version increment → block |
| **Strip** | Russian prose; concatenated documents → split into two skills on promotion |
| **Notes** | "`version` ≠ `event_version` — these are separate time axes" is a high-value, often-missed distinction |

---

### `.references/awesome-claude/rules/arch/db/RETENTION.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/rules/arch/db/RETENTION.md` |
| **Trigger** | Tasks involving data schema design, PII handling, soft-delete implementation, archival planning, or outbox/event TTL decisions |
| **Steps / Contract** | (1) Classify every data type against four tiers (operational, historical, read-model, technical). (2) Assign explicit retention policy; absence of policy means "temporary". (3) Soft delete only when domain-required; pair with hard-delete schedule. (4) Delete PII from all projections — write-model, read-models, caches, search indexes, backups. (5) Archive to separate store with different SLA. (6) All deletion is async, idempotent, logged (who/what/when/why). (7) TTL breach = incident, not backlog. (8) Maintain mini-policy table as living document |
| **Quality Bar** | Every data type classified; retention policy assigned; PII deletion covers all projections |
| **Escalation** | TTL breach → incident; PII in unregistered location → block |
| **Strip** | Russian prose (full translation); inline Russian aphorisms → rephrase in English |
| **Notes** | "Law > Business > Convenience" hierarchy for PII is a strong transferable principle. Read-models are rebuildable and therefore deletable — prevents over-retention |

---

### `.references/awesome-claude/rules/arch/db/SEEDS_FIXTURES.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/rules/arch/db/SEEDS_FIXTURES.md` |
| **Trigger** | Working with database migrations, seeding scripts, test fixtures, or any `db:seed`/`db:fixture` workflow |
| **Steps / Contract** | (1) Classify data as seed (mandatory domain constants, idempotent, environment-agnostic) or fixture (optional, env-isolated, reproducible). (2) Seeds run before app start as part of deploy; no user/business data. (3) Fixtures run via separate command, grouped by scenario, never in prod. (4) Both respect domain invariants — no bypass of domain model. (5) Annotate each data set: Type, Scope, Purpose, Dependencies, Idempotent, Environments |
| **Quality Bar** | Every seed is idempotent; no fixture in prod; domain invariants respected |
| **Escalation** | Fixture detected in production path → block deploy |
| **Strip** | Russian prose; repo-specific glob paths; specific tooling names beyond generic `db:seed`/`db:fixture` |
| **Notes** | Mini-template (6 fields) is the most portable artifact. Anti-patterns section is high-signal. No overlap risk with migration SOPs |

---

### `.references/awesome-claude/rules/meta-rules.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/rules/meta-rules.md` |
| **Trigger** | When authoring, reviewing, or auditing rule or skill files in any agent system; when deciding whether to create a new skill from a user correction or repeated pattern |
| **Steps / Contract** | (1) Give every rule/skill file a scoping declaration — choose narrowest scope. (2) One topic per file; group related files in subdirectories. (3) Propose a new rule when: (a) user establishes a convention, (b) pattern recurs across 2+ sessions, (c) agent is corrected — correction becomes a rule, (d) non-obvious architectural/process decision made. (4) Enforce universality: no real task/ticket IDs, no project-specific paths, no personal info — use placeholders. (5) Do not add rules for: one-off decisions, information already in readme, temporary workarounds |
| **Quality Bar** | All rules use placeholder tokens; no project-specific paths or business logic |
| **Escalation** | None — governance advisory |
| **Strip** | Russian-language proposal template; YAML frontmatter; `.claude/rules/` directory name → abstract to `<rules directory>`; `.references/awesome-claude/rules/arch/README.md` always-loaded exception |
| **Notes** | "User correction → rule" heuristic is particularly strong for long-lived agent sessions. Core insight: rules must be project-agnostic by construction, not by convention |

---

### `.references/awesome-claude/agents/code-review-sentinel.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/agents/code-review-sentinel.md` |
| **Trigger** | After writing or modifying code — feature complete, bug fix, or pre-commit. Also on "review my changes" requests |
| **Steps / Contract** | (1) Read changed files + optional requirements file. (2) Architecture & layer review. (3) Code-quality review (typing, async patterns, logging). (4) Test review — triviality detection, coverage gaps. (5) Security review (injection, path traversal, auth scoping, secret leakage, race conditions). (6) Risk rating per finding: 🔴 CRITICAL / 🟠 HIGH / 🟡 MEDIUM / 🟢 LOW. (7) Emit report: Summary → Findings → Test Assessment → Risk Summary → Decision (APPROVE / REQUEST CHANGES / BLOCK) |
| **Quality Bar** | All phases completed; decision made with explicit criteria |
| **Escalation** | BLOCK decision → cannot merge; CRITICAL finding → surface immediately |
| **Strip** | Project-specific stack (Python/DDD/aiogram/SQLAlchemy/MinIO/OpenAI); hardcoded file paths; `model: opus` / `memory: project`; agent-memory write instructions; parameterise `<tech_stack>` and `<architecture_pattern>` |
| **Notes** | Test-quality focus (triviality detection heuristics) is the standout portable insight. APPROVE/REQUEST CHANGES/BLOCK decision framework is clean and reusable |

---

### `.references/awesome-claude/agents/planner.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/agents/planner.md` |
| **Trigger** | Receiving a new task, feature request, or bug report; needing a structured analysis + implementation plan before writing any code |
| **Steps / Contract** | (1) Requirements completeness check — score 6 criteria (Goal, Acceptance Criteria, Edge Cases, Dependencies, Test Plan, Scope); flag gaps with proposed text. (2) Codebase analysis — read (not guess) affected files, map to architectural layers. (3) Risk assessment — evaluate Architecture, DB, Testing, Performance, Security risks; label 🔴/🟡/🟢. (4) Implementation plan — numbered steps each with file → change → rationale, inter-step dependencies, test strategy table, commit breakdown |
| **Quality Bar** | All 6 completeness criteria scored; risks categorised; implementation plan has numbered steps with rationale |
| **Escalation** | Scope-expanding gaps in requirements → flag to user before proceeding |
| **Strip** | Russian language; Resume Matcher project context and DDD layer paths; shared-memory file path; `DD-N` ticket scheme; `model: opus` / `maxTurns: 30` |
| **Notes** | "Read files, don't guess" and "do not expand scope beyond the task" are high-signal portable principles worth preserving verbatim |

---

### `.references/awesome-claude/skills/tdd/SKILL.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/skills/tdd/SKILL.md` |
| **Trigger** | When implementing a feature, fixing a bug, or adding test coverage using test-first discipline |
| **Steps / Contract** | (0) Recon — read all files before writing any code. (1) Visual analysis — produce PlantUML diagrams (sequence + activity); show to user before proceeding. (2) Test plan — enumerate tests by layer; for each layer decide include/exclude with written rationale. (3) RED — write tests; run; confirm failure for the right reason. (4) GREEN — write minimum code; stop immediately on regression. (5) Full verify — run full check suite; on failure: output banner, describe, ask user — do not self-repair. (6) Refactor — only after fully green; re-run after each change. (7) Self-check — 5-question per-test audit |
| **Quality Bar** | 6-question destructive-tester mindset applied; corner-case checklist (Empty/Boundary/Type/Size/Format/Time) covered; UI-wiring check complete |
| **Escalation** | Functional test failure → stop, surface to user; regression stop rule |
| **Strip** | Russian output directive; `uv run pytest` / `make check` → `<test command>` / `<check command>`; DDD layer paths → template slots; `model: opus` / `effort: max`; prefilled PlantUML participant names |
| **Notes** | Four highest-value extractions: (1) 6-question destructive-tester mindset; (2) corner-case checklist table; (3) per-test self-audit heuristics; (4) UI-wiring checklist. RED/GREEN progress banner format is a clean async agent feedback protocol |

---

### `.references/awesome-claude/skills/tracing/SKILL.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/skills/tracing/SKILL.md` |
| **Trigger** | A deployed feature doesn't work; triaging a bug, incident, or production issue; any root-cause investigation task |
| **Steps / Contract** | Step 0: Classify (Incident vs Feature Tracing mode) + read code before guessing. Step 1: Structured problem description (severity, blast radius, reproduction steps). Step 2: Localize root cause with exact file:line citations and annotated chain (✅/❌/⬜). Step 3: Two PlantUML diagrams — sequence showing error flow + C4 component showing architectural context. Step 4: Issue table (Root Cause / Contributing / Gap / Smell / Wiring). Step 5: Risk assessment matrix (8 dimensions). Step 6: Recommendations (hotfix / full fix / prevention) |
| **Quality Bar** | Chain annotated before any fix proposed; both diagrams produced; issue table typed |
| **Escalation** | CRITICAL severity → surface immediately before diagramming |
| **Strip** | Russian prose; persona/backstory; hardcoded stack examples (alembic, FastAPI, SQLAlchemy, Docker ports); emoji progress ceremony |
| **Notes** | "Problem isn't understood until it's drawn" is a strong SOP forcing function. Feature Tracing wiring checklist (router registered? schema includes field? migration applied?) is the most novel element |

---

### `.references/awesome-claude/rules/arch/components/EVENTS.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/rules/arch/components/EVENTS.md` |
| **Trigger** | When designing or implementing domain events in a DDD or event-driven codebase; also as a review checklist for existing event schemas |
| **Steps / Contract** | 13 rules: (1) Past-tense naming. (2) Immutable — corrections via compensating events. (3) Originate inside aggregate root. (4) Publish only after successful commit. (5) Minimal payload (IDs or small snapshot). (6) Version events for consumer evolution. (7) Handlers must be idempotent. (8) Required metadata: event_id, occurred_at, correlation_id, causation_id, actor_id, tenant_id. (9) Ordering guaranteed within one aggregate only. (10) Cross-aggregate consistency via saga/orchestration. (11) Outbox pattern mandatory. (12) Handlers must not mutate foreign aggregates. (13) Separate domain events from integration events |
| **Quality Bar** | All 13 rules satisfied; outbox pattern used; domain/integration separation maintained |
| **Escalation** | Pre-commit event publication → block; missing idempotency → block |
| **Strip** | Path-glob frontmatter; Russian prose (needs full translation) |
| **Notes** | Outbox rule is the standout — makes phantom-event-on-rollback explicit. Domain/integration event split is often collapsed in practice |

---

### `.references/awesome-claude/rules/arch/db/TRANSACTIONS.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/rules/arch/db/TRANSACTIONS.md` |
| **Trigger** | Code touches DB or migration paths scoped in `.references/awesome-claude/rules/arch/db/TRANSACTIONS.md` (`src/infrastructure/db/**`, `migrations/**`); writing application services or command handlers that persist domain aggregates; setting up event publishing |
| **Steps / Contract** | (1) Open transaction at application-service / command-handler level only. (2) One aggregate, one repository, one transaction. (3) No network calls, queues, HTTP, or sleeps inside a transaction. (4) Choose isolation level explicitly. (5) Optimistic locking via `version` field; conflict → retry with backoff and attempt limit. (6) Write outbox record in same transaction as aggregate commit. (7) Side effects execute only after commit, via separate worker/process. (8) Log transaction_id, command_id, aggregate_id, retry_count for every transaction |
| **Quality Bar** | No cross-aggregate transactions; no network calls inside transaction; outbox co-transactional |
| **Escalation** | Detected network call inside transaction → block |
| **Strip** | Russian prose; OUTBOX subsection in `.references/awesome-claude/rules/arch/db/TRANSACTIONS.md` → split to own SOP; antipattern lists → condense to "avoid" sidebar |
| **Notes** | Transaction-discipline half is stronger and more portable than outbox-delivery half. Outbox schema (11-field minimum) is a good reference artifact |

---

### `.references/awesome-claude/rules/arch/components/AGREGATES.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/rules/arch/components/AGREGATES.md` |
| **Trigger** | Designing, reviewing, or refactoring domain model code containing aggregates, repositories, or domain events; code review surfaces cross-aggregate coupling or business logic leaking into services |
| **Steps / Contract** | 17 key constraints including: (1) No overlapping ownership. (2) Atomic commit per aggregate. (3) Inter-aggregate links are by primary key only. (4) Mutations only through repository. (5) Reads through separate query layer. (6) Optimistic locking/versioning on every aggregate. (7) Invariants enforced inside aggregate only. (8) Transactions never cross aggregate boundaries. (9) Domain events published strictly after successful commit. (10) One repository per aggregate. (11) No infrastructure dependencies inside domain model. (12) Violations logged as tech-debt tasks |
| **Quality Bar** | All 17 constraints satisfied; violations tracked as tech-debt |
| **Escalation** | Cross-aggregate transaction → architectural defect; infrastructure import in domain → block |
| **Strip** | Russian prose; `paths:` frontmatter (`src/domain/**`, `src/application/**`); rhetorical asides → neutral English |
| **Notes** | Rule density is high — prioritise the non-obvious violations (cross-aggregate links via ID, events after commit, no infrastructure in domain). "Violations become tech-debt tickets" meta-rule is a practical self-enforcing mechanism |

---

### `.references/awesome-claude/rules/arch/components/COMMANDS.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/rules/arch/components/COMMANDS.md` |
| **Trigger** | Scaffolding or reviewing CQRS write-side code — command classes, command handlers, application services; when a PR touches the command layer |
| **Steps / Contract** | (1) Command is a DTO — no business logic, data + validation only. (2) One command, one Aggregate Root. (3) Technical validation before handler; domain validation inside aggregate. (4) Return surface minimal: OK / ERROR / aggregate_id / version only. (5) Every command is idempotent or carries an idempotency key. (6) Handler: load aggregate → call aggregate method → save aggregate — no business decisions in handler. (7) Commands must not call other commands — orchestration belongs in sagas. (8) Every command carries command_id, correlation_id, actor_id |
| **Quality Bar** | No business logic in command or handler; idempotency key present; tracing fields populated |
| **Escalation** | Command calling another command → architectural violation |
| **Strip** | Russian prose; frontmatter `paths`; terse "SAGAs are not welcomed" line → expand or drop; editorial tone |
| **Notes** | Commands↔Events boundary rules (command = input, event = output, never conflate) are the strongest differentiator. Language barrier is main obstacle; substance is high quality |

---

### `.references/awesome-claude/rules/arch/ARCH_TESTS.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/rules/arch/ARCH_TESTS.md` |
| **Trigger** | Setting up architecture enforcement for a DDD/layered project; onboarding contributors; adding LLM-derived data to a codebase that also handles authorization |
| **Steps / Contract** | (1) Define layer boundary rules. (2) Encode each rule as an AST-walking test. (3) Auto-discover aggregates via filesystem convention. (4) Enforce aggregate versioning: every mutating method increments `version`. (5) Enforce cross-aggregate isolation: UUID-by-value only. (6) Enforce LLM security: fields sourced from LLM must not appear in authZ conditions. (7) Publish per-change obligations checklist. (8) Run architecture tests as mandatory CI gate |
| **Quality Bar** | All architecture tests pass as CI gate; LLM-derived fields never in authZ if-conditions |
| **Escalation** | LLM field in authZ condition → block; version field missing on mutating aggregate method → block |
| **Strip** | Russian prose; specific file paths; `make architecture-check` → `<arch-test command>`; SQLAlchemy-specific rules → keep principle, drop ORM API |
| **Notes** | R8 (LLM security gate) is the single most unique portable finding — a concrete enforceable rule preventing LLM-derived values from controlling authZ. Worth promoting as standalone rule in LLM-safety skill |

---

### `.references/awesome-claude/rules/arch/db/PERFORMANCE.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/rules/arch/db/PERFORMANCE.md` |
| **Trigger** | When a PR touches DB or migration paths scoped in `.references/awesome-claude/rules/arch/db/PERFORMANCE.md` (`src/infrastructure/db/**`, `migrations/**`); when any new query, index, or caching layer is introduced |
| **Steps / Contract** | (1) Define a performance budget for every query (p50/p95/p99 latency, max data volume, expected frequency) and document it. (2) Keep write operations minimal — write only changed fields, limit indexes on the write path, keep transactions short. (3) Design read models per use-case — no universal `SELECT *`, mandatory pagination (limit/offset or cursor), `EXPLAIN` on every heavy query. (4) Treat N+1 detection as an automatic fix task. (5) Caches must declare TTL and invalidation strategy; cache misses must not break functionality. (6) Instrument latency, transaction count/duration, version conflicts, slow queries with context. (7) Load tests must be repeatable and cover real query patterns; performance regressions block release. (8) Use the mini decision template (Operation / Budget / Frequency / Indexes / Cache / Notes) when formalising a query contract |
| **Quality Bar** | Budgets documented and verified; N+1 eliminated; list reads paginated; load-test / perf gate passes in CI; anti-patterns absent |
| **Escalation** | CI perf or load-test regression → block release; speculative index without measurement → challenge in review |
| **Strip** | Russian prose (full translation); references to projections and version-conflict metrics — mark optional for CQRS/event-sourced stacks; sharding section — optional standalone SOP; path globs in frontmatter; theatrical aphorisms → neutral English |
| **Notes** | The budget-plus-template combo (define budget upfront, verify, fail release on regression) is rare in agent rules. Anti-pattern list (`SELECT *` in prod, no `LIMIT`, optimising without metrics, speculative indexes) is a ready review checklist. Consider splitting on promotion: (a) query-contract SOP (budgets + template + anti-patterns) and (b) observability + CI gate (metrics + slow-query logging + load tests) |

---

### `.references/awesome-claude/rules/arch/db/READ_MODEL.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/rules/arch/db/READ_MODEL.md` |
| **Trigger** | When designing read models, views, projections, or query DTOs in a CQRS or event-sourced architecture; when building materialized views or any read side of a separated read/write system |
| **Steps / Contract** | 22 rules covering: read-only enforcement; query-first schema; denormalization acceptable with write-side source of truth; no business invariants in read layer; explicit DTO/projection per query (never return domain entities externally); mandatory pagination and N+1 prohibition; index design driven by `EXPLAIN` on real queries; on-demand vs event-driven refresh strategies; outbox/event-only source for materialized projections; idempotent projection updates; documented eventual consistency; freshness SLA per view; DTO versioning; read-layer failures must not affect write path; explicit cache TTL/invalidation; contractual search/filter/sort with index backing; RBAC/tenant filters server-side; PII minimisation/masking — plus structured mini-template per view (name, purpose, sources, storage, refresh, freshness SLA, query patterns, indexes, access control, caveats) |
| **Quality Bar** | All applicable rules satisfied for each view; freshness SLA stated; projection updates idempotent; read errors cannot block writes |
| **Escalation** | Read-layer outage or coupling that blocks writes → architectural defect |
| **Strip** | Russian prose (full translation); path frontmatter (`src/infrastructure/db/**`, `migrations/**`) → `<db layer path>` or drop; regroup flat list into thematic sections (design, performance, consistency, security) |
| **Notes** | Two standout principles: read-layer errors must not take down the write path; disputes about truth go to the write model. High value for CQRS teams; limited audience without read/write separation |

---

### `.references/awesome-claude/skills/pipe/SKILL.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/skills/pipe/SKILL.md` |
| **Trigger** | When a task requires multiple methodologies applied in strict order — e.g. analysis then implementation, tracing then TDD, TRIZ then UI fix |
| **Steps / Contract** | (1) Parse args: comma-separated skill list; remainder is the problem prompt. (2) Validate each skill file exists; list available skills on miss. (3) Read full `SKILL.md` for each skill. (4) Sequentially spawn one Agent per phase: inject full skill body + prior phase output; replace `$ARGUMENTS` with user prompt. (5) Hard-stop if a phase breaks tests — do not proceed; ask the user. (6) Emit structured summary: pipeline route, per-phase résumé, changed files |
| **Quality Bar** | Strict sequential ordering; no phase skipped; tests green before entering the next implementation phase |
| **Escalation** | Test failure mid-pipeline → stop and surface to user |
| **Strip** | Russian-language prompt body (full translation); `.claude/skills/<name>/SKILL.md` path convention → abstract loader path; Cyrillic progress strings and arrow-chain display — optional cosmetic; condense redundant anti-pattern bullets |
| **Notes** | Hard-stop-on-broken-tests pairs with `break-stop`. Prohibition on parallel agent execution is a critical safety constraint. Context-handoff taxonomy by phase-type pair (analytical→implementation, analytical→analytical, etc.) is rare and high-value — most pipelines treat all handoffs identically |

---

### `.references/awesome-claude/skills/triz/SKILL.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/skills/triz/SKILL.md` |
| **Trigger** | Stuck on a design or architectural trade-off where improving one parameter worsens another — especially when the default answer would be a compromise |
| **Steps / Contract** | Nine-step ARIZ-85V loop: task analysis → task model (technical contradictions, operational zone/time) → IFR + physical contradiction → full resource inventory → contradiction resolution (separation principles × 40 inventive principles × vepole) → solution verification (checklist + invention-level rating + new-contradiction scan) → optional codebase implementation plan → RVS operator (size/time/cost → 0 / → ∞) → reflection. Each step produces a filled template block |
| **Quality Bar** | Contradictions explicit; IFR stated; verification checklist complete before recommending implementation |
| **Escalation** | None prescribed — methodological skill |
| **Strip** | Full Russian text; persona / certification backstory; `model: opus` / `effort: max`; per-step `ШАГ N` ceremony — keep optional progress convention; vepole / 76-standards depth — mark optional for general audiences |
| **Notes** | The 40 inventive principles → software patterns mapping table is the standout portable artifact. RVS operator is an underused escape from local optima. "TRIZ rejects trade-offs" framing is transferable; heavy translation required before promotion |

---

### `.references/awesome-claude/rules/arch/MONITORING.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/rules/arch/MONITORING.md` |
| **Trigger** | When writing or reviewing observability code, adding metrics, designing a service, or auditing whether a service meets monitoring Definition of Done |
| **Steps / Contract** | (1) Every service exposes `/metrics` in Prometheus exposition format, network-isolated. (2) Naming: `<namespace>_<subsystem>_<metric_name>` with mandatory suffixes (`_total`, `_seconds`, `_bytes`, `_count`). (3) Mandatory metric categories: health, write-path, read-path, transactions, outbox, projections, errors (domain / technical / infrastructure). (4) Labels restricted to finite bounded sets — forbid `user_id`, `aggregate_id`, `request_id`, dynamic strings. (5) Alerts anchor to SLO targets (p95 latency, error rate, outbox lag); every alert has a runbook action. (6) Metric presence verified in tests; key metrics in DoD. (7) Metric deletion/rename is a breaking change and must be versioned |
| **Quality Bar** | Mandatory catalogue present; cardinality rules satisfied; alerts actionable |
| **Escalation** | High-cardinality or unbounded label → block merge |
| **Strip** | Russian prose (translate); `paths: src/**/*.py` frontmatter; CQRS-specific subsections (commands, aggregates, outbox, projections) — mark optional for non-event-sourced stacks; example metric names — keep as replaceable illustrations |
| **Notes** | "Monitoring is a system contract, not a set of visualisations" is high-signal. Explicit forbidden label types as blocking defects is unusually transferable. Pairs with `LOGS` and performance/load-test gates |

---

### `.references/awesome-claude/rules/arch/SERVICES.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/rules/arch/SERVICES.md` |
| **Trigger** | When building or reviewing an application/service layer in a layered architecture; when setting handler→service→repository call direction; when defining transaction semantics for service methods |
| **Steps / Contract** | (1) Handlers/controllers call only the service layer — no direct use-case/repo/infra calls from handlers. (2) Write methods: commit on success; on generic `Exception` rollback and re-raise; domain/validation errors propagate without rollback. (3) Read methods: no commit or rollback. (4) Thin handler contract: parse/validate input → call one service method → format response via view/serialiser → manage state-machine transitions if applicable |
| **Quality Bar** | No layer bypass; transaction matrix correctly applied for write vs read vs domain error |
| **Escalation** | Handler calling repository directly → architectural violation |
| **Strip** | Named service classes, domain errors, Telegram/aiogram specifics (`telegram_id`, `callback_data`, FSM), `R7` architecture-test reference, Russian section headers, path frontmatter |
| **Notes** | Domain-error vs generic-exception transaction handling is the highest-value element — prevents silent corruption or over-rollback. Thin-handler contract pairs with architecture tests and `tdd` |

---

### `.references/awesome-claude/rules/arch/STATE_OWNERSHIP.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/rules/arch/STATE_OWNERSHIP.md` |
| **Trigger** | When designing or reviewing features with state changes across frontend/backend; when review finds frontend business logic or mutations that bypass the API |
| **Steps / Contract** | (1) Persistent state lives in backend DB and is exposed via API. (2) Frontend does not re-implement domain logic — displays API fields. (3) Every state change: user action → API call → backend mutation → re-fetch → UI render. (4) Derived values belong in API responses, not client-side recomputation. (5) Domain transitions are entity methods in domain layer, invoked from use cases. (6) Optimistic updates only if API call still fires, failures revert to server truth, pessimistic default |
| **Quality Bar** | Mutation flow satisfied; R6 optimistic rules met when optimistic UI is used |
| **Escalation** | Client-authoritative mutation of business state → block |
| **Strip** | Python code blocks; named entities and routes; `src/domain/` paths; "this project uses pessimistic updates" sentence; layer label sequence — keep concepts, parameterise names |
| **Notes** | "Frontend is a stateless projection" is crisp and transferable. R6 nuance is often missing elsewhere. Anti-pattern list (e.g. fire-and-forget mutations) is high-signal |

---

### `.references/awesome-claude/rules/ui-library.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/rules/ui-library.md` |
| **Trigger** | When building or expanding a frontend component library; when the same visual pattern appears on two or more pages and needs extraction; when reviewing whether a component belongs in primitives, shared, or domain |
| **Steps / Contract** | (1) Design tokens: visual constants as semantic CSS custom properties — no raw values in components. (2) Primitives: atomic elements, zero domain imports, controlled props API, variants via props. (3) Shared: extract only after the pattern recurs on 2+ pages — notice duplication → define interface → tests → implement → replace occurrences → dedupe CSS → run check suite. (4) Domain: owns business types, API calls, contexts; maps domain data to generic props for shared/primitives. (5) Dependency direction strictly domain → shared → primitives → tokens — never reverse |
| **Quality Bar** | One-way dependency rule holds; shared components exist only where duplication proved |
| **Escalation** | Upward import from primitives to domain → block |
| **Strip** | Russian prose; `packages/front/src/components/` paths → `<components-root>/`; `make check` → `<check command>`; illustrative component names remain examples only |
| **Notes** | "Extract from duplication, not speculation" is the strongest transferable rule. Layer comparison table is the sharpest structural artifact; mirrors clean-architecture dependency rules |

---

### `.references/awesome-claude/agents/ui-ux-engineer.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/agents/ui-ux-engineer.md` |
| **Trigger** | Building, redesigning, or fixing frontend UI components or pages; adding interactive features; any task where TDD plus accessibility is required for frontend work |
| **Steps / Contract** | (1) ANALYZE — read components, tokens, patterns before edits. (2) DESIGN — compact Props API + states + keyboard + a11y spec (show to user; no unnecessary wait on confirmation). (3) RED — failing tests first. (4) GREEN — minimal implementation. (5) REFACTOR — polish interactions, spacing, typography, edge cases. (6) VERIFY — full check command; fix failures before responding. Invariant: no code without prior tests; no response with a failing check |
| **Quality Bar** | All phases complete; check suite green; a11y and state coverage explicit in design spec |
| **Escalation** | Failing check at VERIFY → block completion |
| **Strip** | Russian output directive; React 19 / Vite / Vitest / RTL stack pins; `packages/front`, `make check`; specific CSS token names — generalise to design-system slots |
| **Notes** | Anti-patterns table is the highest-value portable artifact. Scope discipline ("do only what is asked; note tech-debt, do not fix opportunistically") is a general agent guardrail worth lifting |

---

### `.references/awesome-claude/skills/ui/SKILL.md`
| Field | Content |
|---|---|
| **Source file** | `.references/awesome-claude/skills/ui/SKILL.md` |
| **Trigger** | Creating, redesigning, or fixing a UI component, page, or interactive feature; user requests TDD or accessibility-first component work |
| **Steps / Contract** | (1) Recon — read all touched files; trace component → page → route → styles → API. (2) Visual analysis — design spec (layout, states, interactions, a11y, affected files); confirm on non-trivial changes. (3) RED — tests first; confirm failures for the right reason. (4) GREEN — minimal code; stop on regression. (5) Full verification — full check; on failure alert and halt — no self-repair of functional breakage. (6) Wiring check — route, import, nav, styles, types, responsive behaviour. (7) Refactor — only after green; behaviour unchanged |
| **Quality Bar** | Wiring checklist complete; "tests are the spec" satisfied |
| **Escalation** | Regression during GREEN → stop |
| **Strip** | Russian directive; hardcoded stack (React, Vitest, CSS Modules, Vite, react-router, D3); `packages/front`, `make check` |
| **Notes** | Wiring check (green tests ≠ working feature) complements `.references/awesome-claude/skills/tdd/SKILL.md` — cross-check deltas before promoting both; cohesion/coupling section is strong design-systems discipline |

---

## 5. Portability Ranking

### High

1. `.references/awesome-claude/rules/break-stop.md` — Universal check gate with proactive breakage warning; almost no stack coupling after `<check command>` substitution.
2. `.references/awesome-claude/rules/git.md` — Commit shape (What/Why/Details) and `[TASK-ID]` placeholder pattern; no tooling lock-in.
3. `.references/awesome-claude/rules/arch/LLM_SECURITY.md` — LLM-as-untrusted-input and authZ boundary; language-agnostic checklist.
4. `.references/awesome-claude/rules/arch/db/MIGRATIONS.md` — Expand/contract, dual-schema rollout, safety checklist — universal SQL migration discipline.
5. `.references/awesome-claude/rules/arch/LOGS.md` — Structured logging, correlation ID as architectural requirement, level semantics.
6. `.references/awesome-claude/rules/arch/db/SECURITY.md` — DB roles, tenant model, authZ-before-write, read-model leakage framing, decision template.
7. `.references/awesome-claude/rules/arch/db/CONSTRAINTS.md` — Invariant→constraint mapping, aggregate FK boundary, naming + red-flag list.
8. `.references/awesome-claude/rules/arch/db/WRITE_MODEL.md` — Write-model invariants, optimistic `version`, co-transactional outbox, idempotency — stack-agnostic.
9. `.references/awesome-claude/rules/arch/db/VERSIONING.md` — Optimistic locking, forward-only migrations, event/API versioning + naming conventions (split on promotion).
10. `.references/awesome-claude/rules/arch/db/RETENTION.md` — Classification → policy → delete/archive/PII lifecycle; mini-policy table.
11. `.references/awesome-claude/rules/arch/db/SEEDS_FIXTURES.md` — Seeds vs fixtures, idempotency, six-field annotation template.
12. `.references/awesome-claude/rules/meta-rules.md` — Rule authoring governance, universality constraints, when-to-add-rule heuristics.

### Medium

1. `.references/awesome-claude/skills/commit/SKILL.md` — Confirmation-gated commit workflow; requires translation and ticket-ID generalisation.
2. `.references/awesome-claude/agents/code-review-sentinel.md` — Phase-ordered review + severity + APPROVE/BLOCK; strip stack and paths.
3. `.references/awesome-claude/agents/planner.md` — Requirements scoring, risk taxonomy, numbered plan; strip Russian and DDD path table.
4. `.references/awesome-claude/skills/tdd/SKILL.md` — Seven-step TDD + corner-case + UI wiring; strip pytest/uv/DDD paths and Russian output rule.
5. `.references/awesome-claude/skills/tracing/SKILL.md` — Incident/feature tracing, diagrams, issue taxonomy; strip stack examples and Russian prose.
6. `.references/awesome-claude/skills/pipe/SKILL.md` — Sequential multi-skill pipeline + context handoffs; full translation and path abstraction.
7. `.references/awesome-claude/skills/triz/SKILL.md` — ARIZ + 40-principles table; translation and optional trimming of deep TRIZ sections.
8. `.references/awesome-claude/rules/arch/components/EVENTS.md` — Domain/integration split, outbox, metadata fields; DDD context + Russian.
9. `.references/awesome-claude/rules/arch/components/COMMANDS.md` — Command/handler contract, idempotency, tracing fields; CQRS framing + Russian.
10. `.references/awesome-claude/rules/arch/ARCH_TESTS.md` — AST architecture tests + per-change obligations; translate and drop SQLAlchemy/project paths.
11. `.references/awesome-claude/rules/arch/SERVICES.md` — Thin handler + transaction matrix; strip Telegram/aiogram and named classes.
12. `.references/awesome-claude/rules/arch/STATE_OWNERSHIP.md` — Mutation flow + optimistic-update nuance; strip code and route examples.
13. `.references/awesome-claude/rules/ui-library.md` — Four-layer component hierarchy + dependency direction; translate and generalise paths.
14. `.references/awesome-claude/agents/ui-ux-engineer.md` — Six-phase frontend TDD loop + anti-patterns; strip stack and Russian mandate.
15. `.references/awesome-claude/skills/ui/SKILL.md` — Same loop as agent file + wiring check; heavy React/Vite coupling in body.

### Partial

1. `.references/awesome-claude/rules/arch/db/PERFORMANCE.md` — Core query budgets and anti-patterns portable; CQRS/projection/sharding blocks should be optional sidecars.
2. `.references/awesome-claude/rules/arch/db/READ_MODEL.md` — Strong CQRS read-side contract; low value without read/write split.
3. `.references/awesome-claude/rules/arch/MONITORING.md` — Prometheus-first and cardinality rules portable; command/aggregate/outbox metric sections are CQRS-shaped.
4. `.references/awesome-claude/rules/arch/db/TRANSACTIONS.md` — Transaction discipline portable; outbox delivery half overlaps other files — consider split/merge.
5. `.references/awesome-claude/rules/arch/components/AGREGATES.md` — Dense DDD aggregate law; overlaps `.references/awesome-claude/rules/arch/db/WRITE_MODEL.md` / `.references/awesome-claude/rules/arch/components/COMMANDS.md` / `.references/awesome-claude/rules/arch/components/EVENTS.md` — promote as curated subset or merge targets.

---

## 6. Cross-Cutting Protocol Primitives

| Primitive | Files | Portable form |
|---|---|---|
| **Hard-stop on check failure (no silent self-repair)** | `.references/awesome-claude/rules/break-stop.md`, `.references/awesome-claude/skills/tdd/SKILL.md`, `.references/awesome-claude/skills/ui/SKILL.md`, `.references/awesome-claude/skills/pipe/SKILL.md` | Single rule: on functional test/check failure — emit banner, stop, ask user; optional severity split for trivial vs functional breaks |
| **Proactive warn before predictably breaking change** | `.references/awesome-claude/rules/break-stop.md` | Require explicit user confirmation after listing predicted breakages before applying change |
| **Recon-before-write (read files, do not guess)** | `.references/awesome-claude/skills/tdd/SKILL.md`, `.references/awesome-claude/skills/tracing/SKILL.md`, `.references/awesome-claude/skills/ui/SKILL.md`, `.references/awesome-claude/agents/planner.md` | Step zero: enumerate and read all touched files / layers before edits; planner scores requirements gaps before coding |
| **User confirmation before mutating repo (commit/push)** | `.references/awesome-claude/skills/commit/SKILL.md` | Show plan + message; wait for explicit approval; stage by explicit paths; never `--no-verify` |
| **Expand/contract migrations + dual-schema compatibility** | `.references/awesome-claude/rules/arch/db/MIGRATIONS.md`, `.references/awesome-claude/rules/arch/db/VERSIONING.md`, `.references/awesome-claude/rules/arch/db/WRITE_MODEL.md` | Forward-only DDL; add nullable → deploy tolerant code → backfill → contract; code must run against both schemas during rollout |
| **Correlation ID threaded through commands, events, logs** | `.references/awesome-claude/rules/arch/LOGS.md`, `.references/awesome-claude/rules/arch/components/EVENTS.md`, `.references/awesome-claude/rules/arch/components/COMMANDS.md` | Mandatory `correlation_id` in structured logs; same field in event metadata and command DTOs; absence = defect |
| **AuthZ-before-write (DB + LLM)** | `.references/awesome-claude/rules/arch/db/SECURITY.md`, `.references/awesome-claude/rules/arch/LLM_SECURITY.md` | Authorise before opening write transaction; never use LLM output for access decisions |
| **LLM-derived fields must not gate authZ** | `.references/awesome-claude/rules/arch/ARCH_TESTS.md` | Encode as AST/static rule: LLM-sourced columns excluded from permission `if` conditions |
| **Outbox co-transactional with aggregate** | `.references/awesome-claude/rules/arch/db/WRITE_MODEL.md`, `.references/awesome-claude/rules/arch/components/EVENTS.md`, `.references/awesome-claude/rules/arch/db/TRANSACTIONS.md` | Persist outbox row in same DB transaction as aggregate commit; publish after commit via worker |
| **Optimistic locking / `version` on aggregate root** | `.references/awesome-claude/rules/arch/db/WRITE_MODEL.md`, `.references/awesome-claude/rules/arch/db/VERSIONING.md`, `.references/awesome-claude/rules/arch/components/AGREGATES.md`, `.references/awesome-claude/rules/arch/db/TRANSACTIONS.md` | Conflict → domain error or bounded retry; never silent last-write-wins |
| **No cross-aggregate FK / cascades; ID references only** | `.references/awesome-claude/rules/arch/db/CONSTRAINTS.md`, `.references/awesome-claude/rules/arch/db/WRITE_MODEL.md`, `.references/awesome-claude/rules/arch/components/AGREGATES.md` | FK+CASCADE only inside aggregate; between aggregates store IDs + eventual consistency |
| **No network I/O inside DB transaction** | `.references/awesome-claude/rules/arch/db/TRANSACTIONS.md` | Queue/email/HTTP only after commit |
| **Domain vs integration events + handler idempotency** | `.references/awesome-claude/rules/arch/components/EVENTS.md` | Separate schemas and mapping; handlers tolerate duplicate delivery |
| **Command DTO contract (idempotency key, tracing fields)** | `.references/awesome-claude/rules/arch/components/COMMANDS.md` | One command → one aggregate; no command-calling-command; include `command_id`, `correlation_id`, `actor_id` |
| **Wiring / integration checklist (UI or feature trace)** | `.references/awesome-claude/skills/tdd/SKILL.md`, `.references/awesome-claude/skills/ui/SKILL.md`, `.references/awesome-claude/skills/tracing/SKILL.md` | Close-out: router, imports, nav, API, types, migrations, containers — green unit tests ≠ wired feature |
| **Performance budget + query decision template** | `.references/awesome-claude/rules/arch/db/PERFORMANCE.md` | Per operation: latency SLO, frequency, indexes, cache strategy, notes — block release on regression |
| **Metrics cardinality / SLO-anchored alerts** | `.references/awesome-claude/rules/arch/MONITORING.md` | Bounded label sets; no per-entity dynamic labels; alert → runbook |
| **Thin handler → single service call → view** | `.references/awesome-claude/rules/arch/SERVICES.md` | Parse → one service method → serialise; no business logic in controller |
| **Diagram-as-proof (PlantUML) for complex flows** | `.references/awesome-claude/skills/tdd/SKILL.md`, `.references/awesome-claude/skills/tracing/SKILL.md` | Require sequence + structural diagram before implementation or fix on non-trivial paths |
| **Sequential pipeline with phase handoff rules** | `.references/awesome-claude/skills/pipe/SKILL.md` | Typed context summary forwarded per phase-type pair; no parallel phases |
| **Rule universality / skill hygiene** | `.references/awesome-claude/rules/meta-rules.md` | Placeholders only; one topic per file; user correction → proposed rule |
| **Seeds vs fixtures + idempotent deploy data** | `.references/awesome-claude/rules/arch/db/SEEDS_FIXTURES.md` | Seeds before start, fixtures never in prod; metadata template per dataset |
| **Architecture tests as CI gate** | `.references/awesome-claude/rules/arch/ARCH_TESTS.md` | AST rules for layers, aggregate discovery, versioning increments — run between lint and unit tests |

---

## 7. Merge Recommendations

- **Dedupe UI TDD loops**: Merge `.references/awesome-claude/agents/ui-ux-engineer.md` and `.references/awesome-claude/skills/ui/SKILL.md` into one portable `frontend-tdd` skill after diffing — keep wiring checklist from `.references/awesome-claude/skills/ui/SKILL.md` and anti-patterns table from the agent file.
- **Pair check-gate skills**: Reference `.references/awesome-claude/rules/break-stop.md` from `.references/awesome-claude/skills/tdd/SKILL.md` and `.references/awesome-claude/skills/pipe/SKILL.md` instead of restating halt-on-failure prose three ways.
- **Split `.references/awesome-claude/rules/arch/db/VERSIONING.md`**: Promote aggregate/event/API versioning as one rule file and ubiquitous-language naming as a second — raw findings already recommend this split.
- **Split or cross-link outbox**: Extract outbox schema and delivery expectations from `.references/awesome-claude/rules/arch/db/TRANSACTIONS.md` into a dedicated `outbox` rule that `.references/awesome-claude/rules/arch/components/EVENTS.md` and `.references/awesome-claude/rules/arch/db/WRITE_MODEL.md` reference — reduces triple overlap.
- **CQRS bundle**: Ship `.references/awesome-claude/rules/arch/db/READ_MODEL.md`, `.references/awesome-claude/rules/arch/db/PERFORMANCE.md` (read-path chapters), and `.references/awesome-claude/rules/arch/MONITORING.md` (projection/outbox metrics) as one optional appendix tagged "event-sourced / CQRS only" rather than three standalone skills.
- **LLM safety consolidation**: Fold `.references/awesome-claude/rules/arch/ARCH_TESTS.md` R8 into the same skill or rule family as `.references/awesome-claude/rules/arch/LLM_SECURITY.md` — one narrative from prompt injection to static enforcement.
- **Commit path**: Keep `.references/awesome-claude/skills/commit/SKILL.md` as the procedural wrapper; `.references/awesome-claude/rules/git.md` remains the normative message shape only.

---

## 8. Structural Patterns

| Pattern | Example files | Note |
|---|---|---|
| **YAML `paths` scoping on every rule** | Most files under `.references/awesome-claude/rules/arch/` | Keeps loader integration explicit; strip or replace with `<scope>` on port. |
| **Flat numbered rule lists + mini-templates** | `.references/awesome-claude/rules/arch/db/WRITE_MODEL.md`, `.references/awesome-claude/rules/arch/db/READ_MODEL.md`, `.references/awesome-claude/rules/arch/db/SECURITY.md` | Template blocks (aggregate, view, decision) are the highest-yield extractions. |
| **Anti-pattern / red-flag terminal sections** | `.references/awesome-claude/rules/arch/db/CONSTRAINTS.md`, `.references/awesome-claude/rules/arch/db/PERFORMANCE.md`, `.references/awesome-claude/rules/arch/MONITORING.md` | Compress review into scannable don'ts — good model for promoted skills. |
| **Per-step progress banners for async agents** | `.references/awesome-claude/skills/tdd/SKILL.md`, `.references/awesome-claude/skills/pipe/SKILL.md`, `.references/awesome-claude/skills/triz/SKILL.md` | RED/GREEN/ШАГ tokens give observable phase state — preserve as optional convention. |
| **Severity-tagged review output** | `.references/awesome-claude/agents/code-review-sentinel.md`, `.references/awesome-claude/agents/planner.md` | Emoji severity scales + explicit APPROVE/BLOCK decision — reusable audit scaffold. |
| **Fill-in-the-blank markdown templates per step** | `.references/awesome-claude/skills/triz/SKILL.md`, `.references/awesome-claude/skills/tracing/SKILL.md` | Forces structured artefacts instead of free-form chat. |
| **Meta-rule governing rule quality** | `.references/awesome-claude/rules/meta-rules.md` | Rare explicit universality contract — adopt as linter for any imported skill. |

---

## 9. Evidence

### Evidence #1 — `.references/awesome-claude/rules/break-stop.md`

> The proactive-warning section (warn before applying a predictably breaking change) is the strongest differentiator — most rules only address post-hoc breakage. The severity split prevents alert fatigue.

### Evidence #2 — `.references/awesome-claude/rules/git.md`

> The emphasis on listing every file touched and explicitly noting test coverage is more rigorous than most commit-message guides — the Why section pairs naturally with issue-triage workflows.

### Evidence #3 — `.references/awesome-claude/rules/arch/LLM_SECURITY.md`

> Antipattern list (role-via-LLM, eval, persona-injection, raw SQL) is excellent — strong candidate for a dedicated `llm-security` rule after translation.

### Evidence #4 — `.references/awesome-claude/rules/arch/db/MIGRATIONS.md`

> Dual-schema-version compatibility ("code must live with both schema versions during rollout") is an often-omitted constraint; the safety checklist is the standout artefact.

### Evidence #5 — `.references/awesome-claude/rules/arch/LOGS.md`

> "Absence of correlation_id is an architectural defect" is an unusually strong, portable framing; payload prohibition on commands/events is the security-critical hinge.

### Evidence #6 — `.references/awesome-claude/rules/arch/db/SECURITY.md`

> "Read models are public surface" and authorisation before the write transaction are precise, transferable formulations rare in generic DB rules.

### Evidence #7 — `.references/awesome-claude/rules/meta-rules.md`

> Core insight — rules must be project-agnostic by construction, not by convention — is underrepresented elsewhere; "user correction → rule" is strong for long-lived agents.

### Evidence #8 — `.references/awesome-claude/agents/code-review-sentinel.md`

> Test-quality focus (triviality detection, LLM soft-threshold guidance) and APPROVE / REQUEST CHANGES / BLOCK decision framework are the standout portable extracts.

### Evidence #9 — `.references/awesome-claude/skills/tdd/SKILL.md`

> Six-question destructive-tester mindset, corner-case table, per-test self-audit, and UI-wiring checklist are the four highest-value portable extractions; PlantUML step is distinctive but should be optional for small fixes.

### Evidence #10 — `.references/awesome-claude/skills/tracing/SKILL.md`

> "Problem isn't understood until it's drawn" plus Feature Tracing wiring checklist (router, schema field, migration, image rebuild) is the most novel RCA element in the repo.

### Evidence #11 — `.references/awesome-claude/rules/arch/components/EVENTS.md`

> Outbox rule makes phantom-event-on-rollback explicit; domain vs integration event split is often collapsed in practice and worth naming.

### Evidence #12 — `.references/awesome-claude/rules/arch/ARCH_TESTS.md`

> R8 (LLM-derived fields must not appear in authZ conditions) is the single most unique portable finding — concrete, enforceable, and rare in other corpora.

### Evidence #13 — `.references/awesome-claude/skills/pipe/SKILL.md`

> Context-handoff taxonomy by phase-type pair prevents context loss between pipeline stages; hard-stop-on-broken-tests mirrors `break-stop` and should be cross-linked, not duplicated ad hoc.

