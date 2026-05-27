# File Inventory — awesome-claude

## Agents

agents/code-review-sentinel.md | agent | Multi-phase code review protocol (architecture, code quality, test triviality detection, security, risk severity) with structured output format and APPROVE/REQUEST CHANGES/BLOCK decision framework.
agents/planner.md | agent | Four-phase requirement analysis and implementation planning protocol (requirements completeness check, codebase analysis, risk assessment, step-by-step implementation plan with commit structure).
agents/ui-ux-engineer.md | agent | TDD-driven frontend implementation workflow (ANALYZE → DESIGN → RED → GREEN → REFACTOR → VERIFY) with design system rules, CSS patterns, and anti-patterns catalogue.

## Rules — top-level

rules/break-stop.md | rule | Hard-stop protocol when tests/lint/type-checks break: output red alert banner, cease execution, and require explicit user decision before any repair.
rules/frontend-design.md | rule | Frontend component design rules: reusable ConfirmDialog API, icon-first UI principle, and visual cohesion requirement (one CSS class per aggregate-operation boundary).
rules/frontend-testing.md | rule | Frontend test conventions: Vitest + RTL + Playwright stack, file locations, what to test and skip, interaction and screenshot test patterns.
rules/git.md | rule | Git commit message convention: structured format with What/Why/Details sections, title constraints, and required test-coverage mention.
rules/makefile.md | rule | Three-level Makefile delegation hierarchy with key target definitions (make check, make test, make up) and port reference.
rules/meta-rules.md | rule | Rules for writing and maintaining rules: required YAML frontmatter paths scoping, file organization, when to propose or skip new rules, and universality requirements.
rules/monorepo-structure.md | rule | Monorepo layout convention: all packages under packages/, self-contained with own Makefile, no cross-package imports, shared infra at root.
rules/ui-library.md | rule | Four-layer component library architecture (tokens → ui primitives → shared patterns → domain components) with extraction-from-duplication principle and engineering requirements.

## Rules — arch

rules/arch/ARCH_TESTS.md | rule | Automated DDD contract validation rules (R1–R12, UT1–UT5): aggregate isolation, layer boundaries, repository isolation, versioning, model schema contracts, and unit test structure enforcement via pytest + AST.
rules/arch/LLM_SECURITY.md | rule | Security rules for LLM integrations: LLM output treated as untrusted input, prohibition on using LLM output for authorization decisions, prompt injection prevention, and structured output requirements.
rules/arch/LOGS.md | rule | Structured logging standards: mandatory fields (timestamp, level, service, correlation_id), logging rules per write/read/event path, PII prohibition, and retention tiers.
rules/arch/MONITORING.md | rule | Prometheus-first monitoring contract: metric naming conventions, mandatory metric sets per service layer, SLO-based alerting rules, and cardinality hard limits.
rules/arch/SERVICES.md | rule | Service layer rules: handlers call only services (not use cases/repos directly), write-method transaction protocol (commit/rollback), and thin handler principle.
rules/arch/STATE_OWNERSHIP.md | rule | Backend-as-single-source-of-truth principle: all mutable state lives on backend, frontend never computes domain logic, every state change flows through an API call.
rules/arch/UNIT_TESTS.md | rule | Unit test structure conventions (UT1–UT13): mandatory docstrings, pytestmark usage, setUp prohibition, layer-specific class/function organisation, and anti-patterns (mock-assertion tests, echo-tests, trivial tests).
rules/arch/VIEWS.md | rule | Presentation layer rules: per-aggregate view isolation, every response must include inline keyboard, views are pure side-effect-free functions.
rules/arch/VISUAL_COHESION.md | rule | Visual cohesion and coupling rules: same aggregate + same operation = one CSS class and one layout axis; shared layout values extracted to CSS variables.

## Rules — arch/components

rules/arch/components/AGGREGATE_STRUCTURE.md | rule | Complete aggregate implementation checklist: file layout, root entity with version field and factory, abstract repository interface, SQLAlchemy models with intra-aggregate FK only, optimistic locking pattern, and architecture test registration.
rules/arch/components/AGREGATES.md | rule | DDD aggregate design rules: transaction boundary, cross-aggregate reference by PK only, one repository per aggregate, business logic in aggregates not services, factory-or-valid-state creation, and optimistic versioning.
rules/arch/components/COMMANDS.md | rule | Command handling rules: one command per aggregate root, commands are DTOs with no business logic, synchronous execution, no data returned, idempotency required, handler loads/calls/saves aggregate.
rules/arch/components/DOMAIN.md | rule | Domain modelling rules: bounded contexts, ubiquitous language glossary, capability-first analysis, aggregate invariants, CQRS separation, and template for domain element description.
rules/arch/components/EVENTS.md | rule | Domain event rules: immutable past-tense facts, published only after successful commit, outbox delivery pattern, idempotent handling, minimal payload, and separation of domain vs integration events.
rules/arch/components/ONE_AGGREGATE_ONE_REPO.md | rule | One-to-one mapping rule: exactly one ABC in repository.py per domain, exactly one _repo.py per aggregate, concrete repo must import its own abstract repo (R10a/b/c).
rules/arch/components/QURIES.md | rule | Query/read-layer rules: CQRS logical separation, no aggregates in read path, separate DAO/Query Service, read models return DTOs not domain entities, mandatory pagination and N+1 prohibition.
rules/arch/components/SHARED_KERNEL.md | rule | Shared kernel rules: frozen value objects for cross-aggregate structures, composition over inheritance, infrastructure owns execution, all consumers updated in one commit, and four-level test hierarchy.

## Rules — arch/db

rules/arch/db/CONSTRAINTS.md | rule | Database constraint rules: every invariant that can be expressed in DB must be, UNIQUE on all business keys, FK cascades only within aggregate, standard constraint naming convention.
rules/arch/db/INDEXES.md | rule | Index rules: indexes only for real query patterns with EXPLAIN proof, N+1 prohibition, keyset pagination requirement, and mandatory index catalogue entry per new index.
rules/arch/db/MIGRATIONS.md | rule | Zero-downtime migration rules: expand/contract pattern, forbidden operations without special procedure, idempotent backfill in batches, safety checklist per migration.
rules/arch/db/NORMAL_FORMS.md | rule | Normalization policy: write model in 3NF by default, denormalization in write model requires documented exception with EXPLAIN proof and designated canonical source.
rules/arch/db/PERFORMANCE.md | rule | Performance contract rules: per-query latency budgets, write-path minimalism, mandatory pagination, N+1 prohibition, cache with explicit TTL/invalidation, and performance regression blocks release.
rules/arch/db/READ_MODEL.md | rule | Read model design rules: built from query use cases not domain model, may aggregate multiple aggregates, materialized via events/outbox only, freshness SLA required, read errors must not affect write path.
rules/arch/db/RETENTION.md | rule | Data retention policy rules: every data type must have a retention policy, PII deleted to minimum required period across all stores, soft delete only with documented hard-delete policy.
rules/arch/db/SECURITY.md | rule | Database security rules: separate DB roles for write/read/migrations/admin, no superuser from runtime, tenant isolation model formalized, PII minimization and encryption requirements.
rules/arch/db/SEEDS_FIXTURES.md | rule | Seeds vs fixtures distinction: seeds are idempotent mandatory domain constants applied at deploy time; fixtures are environment-isolated reproducible test data, never in production.
rules/arch/db/TRANSACTIONS.md | rule | Transaction rules: one aggregate per transaction, opened at application service layer, no network calls inside transaction, optimistic locking default, outbox written in same transaction as aggregate, plus full outbox delivery contract.
rules/arch/db/VERSIONING.md | rule | Versioning rules: aggregate optimistic locking via version field, schema via expand/contract migrations, event versioning with consumer adapters, and DB naming conventions (tables singular, fields snake_case, constraints prefixed).
rules/arch/db/WRITE_MODEL.md | rule | Write model design rules: model derived from aggregates not tables, one root table per aggregate, 3NF default, FK only within aggregate boundary, outbox mandatory for events.

## Rules — arch/functions/practice

rules/arch/functions/practice/CHANGE_BREAKERS.md | rule | Code smell catalogue for change-cascade anti-patterns: Divergent Change, Shotgun Surgery, Parallel Inheritance Hierarchies.
rules/arch/functions/practice/DEPS.md | rule | Code smell catalogue for dependency problems: Feature Envy, Inappropriate Intimacy, Message Chains, Middle Man.
rules/arch/functions/practice/INFLATORS.md | rule | Code smell catalogue for size/complexity inflation: Long Method, Large Class, Primitive Obsession, Long Parameter List, Data Clumps.
rules/arch/functions/practice/OOP_DESIGN.md | rule | Code smell catalogue for OOP misuse: Switch Statements, Temporary Field, Refused Bequest, Alternative Classes with Different Interfaces.
rules/arch/functions/practice/TRASHERS.md | rule | Code smell catalogue for code waste: Comments, Duplicate Code, Lazy Class, Data Class, Dead Code, Speculative Generality.

## Rules — arch/functions/techs

rules/arch/functions/techs/CONDITIONS.md | rule | Refactoring catalogue for conditional logic: Decompose Conditional, Consolidate Conditional Expression, Replace Nested Conditional with Guard Clauses, Replace Conditional with Polymorphism, Introduce Null Object.
rules/arch/functions/techs/DATA.md | rule | Refactoring catalogue for data representation: Self Encapsulate Field, Replace Data Value with Object, Replace Magic Number with Symbolic Constant, Encapsulate Collection, Replace Type Code with Class/Subclasses/State.
rules/arch/functions/techs/FUNCTIONS.md | rule | Refactoring catalogue for responsibility allocation: Move Method, Move Field, Extract Class, Inline Class, Hide Delegate, Introduce Local Extension.
rules/arch/functions/techs/GENERALIZATIONS.md | rule | Refactoring catalogue for inheritance hierarchies: Pull Up/Push Down Field/Method, Extract Subclass/Superclass/Interface, Collapse Hierarchy, Replace Inheritance with Delegation.
rules/arch/functions/techs/METHODS.md | rule | Refactoring catalogue for method composition: Extract Method, Inline Method, Extract Variable, Replace Temp with Query, Split Temporary Variable, Replace Method with Method Object.
rules/arch/functions/techs/SIMPLIFY.md | rule | Refactoring catalogue for method signatures: Rename Method, Separate Query from Modifier, Parameterize Method, Replace Constructor with Factory Method, Replace Error Code with Exception.

## Skills

skills/commit/SKILL.md | skill | Git commit creation SOP: gather diff, group changes, compose structured What/Why/Details message, show plan to user for approval, then commit with specific file names and HEREDOC formatting.
skills/deploy/SKILL.md | skill | Docker-based deploy SOP: rebuild images, restart containers, run Alembic migrations inside the container, verify health check, report outcome.
skills/describe/SKILL.md | skill | Read-only project overview procedure: answer questions about architecture, stack, or commands from memory without executing any commands or reading files.
skills/pipe/SKILL.md | skill | Meta-orchestrator SOP: parse skill list from arguments, validate skill files exist, read each SKILL.md, run each as a sequential Agent with full context handoff, output pipeline summary.
skills/session-report/SKILL.md | skill | Product-focused session report SOP: analyse git diff for user-facing changes, group by product themes, output stakeholder-friendly summary in Russian with metrics and migration notes.
skills/tdd/SKILL.md | skill | Full TDD implementation SOP: visual flow diagrams → test plan → RED (write tests layer by layer) → GREEN (implement per DDD layer order) → verify → refactor, with destructive-tester mindset and anti-patterns list.
skills/test-all/SKILL.md | skill | Complete multi-package test runner SOP: collect baseline counts, run lint/types/unit/state/security/cases/architecture/integration/E2E per package, output structured table with delta column and pass/fail verdict.
skills/tracing/SKILL.md | skill | Incident/feature-tracing investigation SOP: classify mode, trace request path from UI to DB layer by layer, build PlantUML sequence + C4 diagrams marking failure point, produce issue table with severity, assess implementation risks.
skills/triz/SKILL.md | skill | TRIZ/ARIZ-85V problem-solving SOP: nine-step procedure (mini-task → contradictions → IFR/physical contradiction → resource inventory → resolve via separation principles and 40 inventive principles → verify → map to code changes).
skills/ui/SKILL.md | skill | React TDD UI implementation SOP: recon → design spec → RED tests (rendering/interaction/accessibility/state) → GREEN implementation (CSS Modules + design tokens + inline SVG) → full check → wiring verification.
