# SOP Audit — cursor-rules repo

**Source findings**: `raw-findings.md`  
**Date**: 2026-03-28  
**Auditor**: worker-agent (chain step 2)

---

## 1. Repo Overview

The `cursor-rules` repo is a collection of 42 Cursor MDC rule files organised under a flat `rules/` directory, each targeting a specific language, framework, or cross-cutting concern. Files are structured as standing-rules references rather than procedural SOPs — they declare *what to do* with examples but rarely define ordered workflows with entry/exit criteria. Almost every file carries Cursor-specific frontmatter (`alwaysApply`, `globs`, `description`) and an opening "Project Context" or persona paragraph that is tooling-artefact noise and must be stripped before promotion. The content quality is high: rules are dense, opinionated, and backed by concrete before/after code examples. Coverage spans backend languages (Go, Python, Rust, Node.js/TypeScript), frontend frameworks (React, Next.js, Svelte, Vue, Flutter), infrastructure (Docker, Kubernetes, Terraform, AWS Serverless), ML/AI (LangChain, PyTorch), and eight cross-cutting concern files (security, TDD, REST design, clean code, SQL, performance, TypeScript strictness, clean code). Portability varies sharply by layer: cross-cutting-concern files are almost universally portable, language-specific files are highly portable within their language scope, and framework-specific files range from highly portable (FastAPI within Python async APIs) to zero portable content (Vue 3 Composition API, Flutter/Dart). Five files have zero extractable SOP content and should be discarded entirely. The remaining 37 files contain at least one portable principle, rule block, or anti-pattern checklist worth carrying forward. The most distinctive structural feature — present in all high-value files — is a terminal "Common Pitfalls" or "Common Mistakes to Avoid" section that compresses hard-won operational knowledge into a scannable anti-pattern checklist; these sections are the highest-density portable artifacts in the repo.

---

## 2. Content Summary

### 2a. Cross-Cutting Concern Rules (8 files)

| File | Topic | Portability signal |
|------|-------|--------------------|
| `security-best-practices` | OWASP-aligned security checklist | **High** — framework-agnostic principles + code examples; one of the most complete security references audited |
| `testing-tdd` | Red-green-refactor TDD workflow, naming, pyramid, mocking | **High** — framework-agnostic in principle; tooling samples (Jest, pytest, RTL) are illustrative |
| `api-design-rest` | REST URL design, HTTP semantics, envelopes, pagination, versioning | **High** — entirely language- and framework-agnostic; canonical JSON envelope shapes are directly adoptable |
| `clean-code` | Naming, SRP, guard clauses, code smells, refactoring taxonomy | **High** — language-agnostic; maps directly to Robert Martin's taxonomy; ~280 lines, warrants condensation |
| `database-sql` | Schema design, indexing, query patterns, migrations, N+1, security | **High** — SQL-standard with PostgreSQL extensions clearly labelled; migration section is unusually strong |
| `performance-optimization` | Full-stack perf: frontend, backend, DB, caching, algorithmic, monitoring | **High** — framework-agnostic principles; Core Web Vitals targets are a reusable concrete checklist |
| `typescript` | TypeScript strict-mode patterns, narrowing, generics, error handling | **High** — language-scoped, zero project-specific coupling |
| `typescript-strict` | Redundant coverage of TS strict patterns (higher quality formatting) | **High** — slightly better formatted than `typescript`; `satisfies`/`asserts`/`assertNever` are rare coverage |

### 2b. Language-Specific Standards (6 files)

| File | Language | Portability signal |
|------|----------|--------------------|
| `go-production` | Go 1.21+ | **High** — stdlib-grounded; no framework coupling |
| `python-modern` | Python 3.10–3.12 | **High** — language-standard with version-pinned features; test coverage targets are concrete |
| `rust-production` | Rust (production) | **High** — pure idiomatic Rust; crate choices represent community consensus |
| `python-fastapi` | Python/FastAPI/Pydantic v2 | **Medium** — framework-locked sections travel cleanly across any FastAPI project; async patterns are broadly applicable |
| `ai-ml-python` | Python/PyTorch ML engineering | **Partial** — training loop pattern, reproducibility `set_seed()`, and Common Mistakes are highly portable; project layout and wandb specifics are not |
| `langchain-ai` | Python/LangChain/LangGraph | **Partial** — framework-locked machinery; Prompt Engineering, RAG, Agents, Memory, Error Handling, Evaluation, and Security sections are framework-agnostic |

### 2c. Node/TypeScript Stack (4 files)

| File | Stack | Portability signal |
|------|-------|--------------------|
| `nodejs-express` | Node.js/Express/TypeScript | **High** — layered architecture, typed middleware, AsyncHandler wrapper, JWT auth, structured logging are canonical and widely reused |
| `nodejs-express-typescript` | Node/Express/TypeScript (duplicate coverage) | **Medium** — "services throw domain errors, controllers map HTTP" principle and fail-fast env-var validation are clean portable extracts |
| `mern-stack` | MongoDB/Express/React/Node | **Partial** — Common Pitfalls, Error Handling, and Security subsections are portable; Mongoose-specific content is not |
| `react` | React 18+/TypeScript | **Partial** — accessibility, error handling, and security subsections are portable; hooks and performance sections are React-specific |

### 2d. Other Frontend / Framework-Specific (12 files)

| File | Stack | Portability signal |
|------|-------|--------------------|
| `tailwindcss` | Tailwind CSS v3/v4 | **High** — class-ordering, utility-first patterns, a11y, dark mode; no repo-specific content at all |
| `tailwind-ui` | Tailwind CSS (style variant) | **High** — complementary to tailwindcss; WCAG contrast ratios and PurgeCSS safety patterns are additive |
| `nextjs` | Next.js 14 App Router | **Partial** — TypeScript strictness, Zod input validation, `Promise.all` parallel fetch, and `{ success, data?, error? }` error shape are extractable |
| `nextjs-typescript` | Next.js + TypeScript | **Partial** — security section (never expose API keys, return structured results, `server-only` guard) is the strongest portable candidate |
| `react-typescript` | React + TypeScript | **Partial** — TypeScript discriminated unions, naming conventions, testing-philosophy overlap with better-covered files |
| `svelte-kit` | Svelte 5 + SvelteKit 2 | **Partial** — naming conventions and "never expose stack traces" error principle are portable |
| `sveltekit` | SvelteKit 2 + TypeScript | **Partial** — security section (validate server-side, env var secrets, sanitise HTML) is portable; rest is framework-specific |
| `fullstack-nextjs-prisma` | Next.js 14 + Prisma + Tailwind | **Partial** — Prisma schema conventions and Server Actions security checklist are stack-agnostic |
| `t3-stack` | T3 (Next.js + tRPC + Prisma + NextAuth) | **Partial** — "ownership check ≠ authentication check" is the single most portable extract; cursor pagination rationale is additive |
| `mobile-react-native` | React Native + Expo SDK 50+ | **Partial** — three extractable principles: secure token storage, schema-based form validation, never block UI thread |
| `chrome-extension` | Chrome MV3 | **Partial** — domain-bounded; typed message protocol and Shadow DOM isolation are best practice for the platform |
| `vue3-composition` | Vue 3 + Pinia | **None** — Vue-primitive-dependent throughout |

### 2e. Infrastructure / DevOps (4 files)

| File | Domain | Portability signal |
|------|--------|--------------------|
| `devops-docker` | Docker / containerisation | **High** — numbered layer-ordering rule, Common Pitfalls list, SIGTERM graceful shutdown note are unusually concrete |
| `docker-devops` | Docker + CI/CD + IaC | **High** — Twelve-Factor env management, container security, and CI stage order are cloud-agnostic |
| `devops-infrastructure` | Terraform, K8s, GitHub Actions CI/CD, monitoring | **Medium** — principles portable; AWS brand names and GitHub Actions YAML are context-specific |
| `aws-serverless` | AWS Lambda / SAM / DynamoDB / TypeScript | **Partial** — thin-handler pattern, module-scope SDK init, DynamoDB single-table design, never-log-PII are portable within AWS serverless TS ecosystem |

### 2f. Compiled Backend Standards (8 files)

| File | Stack | Portability signal |
|------|-------|--------------------|
| `go-gin` | Go + Gin | **Partial** — concurrency idioms (`errgroup`, context propagation, no goroutine leaks) and table-driven tests are idiomatic Go |
| `golang-api` | Go API (generic) | **Partial** — error hierarchy, small-interface rule, security checklist are portable; Go syntax is not |
| `rust-actix` | Rust + Actix Web | **Partial** — `AppError` enum with typed variants, `From<sqlx::Error>` conversion are portable Rust patterns |
| `rust-axum` | Rust + Axum | **Partial** — async best practices (`spawn_blocking`, `time::timeout`, `tokio::sync::Mutex`) and `#[tracing::instrument]` usage are portable |
| `django-rest` | Python/Django REST Framework | **Partial** — service-layer pattern, separate read/write serializers, `filter querysets by user`, `transaction.atomic` are portable |
| `python-django` | Python/Django 5+ | **Partial** — model-design layer (TimeStamped base, UUID PKs, Meta constraints) is portable beyond Django |
| `saas-starter` | Multi-tenant SaaS patterns | **High** — virtually entire file is stack-agnostic SaaS architecture (RBAC, tenancy, Stripe, soft-delete, audit logging) |
| `supabase-fullstack` | Supabase BaaS | **Partial** — PostgreSQL design principles and security mandate are portable; Supabase-specific RLS/Edge/Realtime is not |

### 2g. Framework-Locked (No Portable SOP Content) (4 files)

| File | Reason |
|------|--------|
| `supabase` | Every section references Supabase-proprietary APIs; hollowing out the specificity removes the value |
| `nextjs-14-app-router` | Every rule maps to a Next.js App Router concept; duplicated by `nextjs-app-router` |
| `nextjs-app-router` | All substantive content is Next.js-specific; Zod validation snippet is incidental |
| `flutter-dart` | Every section is Flutter/Dart-specific; mobile security advice is too thin to promote |

---

## 3. SOP Split — Port vs Leave Out

| File | Decision | One-line reason |
|------|----------|-----------------|
| `security-best-practices` | **Port** | Comprehensive OWASP-aligned reference; framework-agnostic rules + code examples; zero project coupling |
| `testing-tdd` | **Port** | Full TDD cycle + pyramid + naming philosophy + pitfalls; tooling samples are illustrative, not binding |
| `api-design-rest` | **Port** | Entirely stack-neutral; canonical JSON envelope and HTTP semantics are immediately adoptable |
| `clean-code` | **Port** | Language-agnostic Clean Code taxonomy; Common Pitfalls and Code Smells catalogue are highly reusable (condense on promotion) |
| `database-sql` | **Port** | Universal relational DB principles; especially strong on safe migration patterns and N+1 prevention |
| `performance-optimization` | **Port** | Full-stack performance checklist with concrete Core Web Vitals targets; no project-specific coupling |
| `typescript` | **Port** | Complete TypeScript strict-mode guide; `satisfies`/`asserts`/`assertNever` are rarely documented elsewhere |
| `typescript-strict` | **Port (merge with `typescript`)** | Redundant in scope; better negative→positive framing note; merge with `typescript` before promoting |
| `go-production` | **Port** | Stdlib-grounded Go idioms; no framework coupling; pairs naturally with `tdd` skill |
| `python-modern` | **Port** | Python 3.10+ standard; version-pinned rules; concrete test coverage targets (95% / 100% / 80%) |
| `rust-production` | **Port** | Twelve thematic sections of production Rust idioms; pure best-practice, no repo-specific customisation |
| `tailwindcss` | **Port** | No org-specific content; dynamic-class-name safety warning and class-ordering convention are directly reusable |
| `tailwind-ui` | **Port (merge with `tailwindcss`)** | WCAG contrast ratios and PurgeCSS class-name safety add value; merge into single Tailwind skill |
| `saas-starter` | **Port** | Stack-agnostic SaaS architecture patterns (RBAC, tenancy, Stripe, soft-delete, security checklist) |
| `nodejs-express` | **Port** | Canonical layered architecture, typed middleware, AsyncHandler wrapper; widely applicable in Node/TS ecosystem |
| `devops-docker` | **Port** | Unusually concrete Docker guidance: numbered layer-ordering, SIGTERM pitfall, health-check copy-paste patterns |
| `docker-devops` | **Port (merge with `devops-docker`)** | Twelve-Factor env management and CI stage order are additive; consolidate into single Docker/container skill |
| `api-microservices` | **Port (partial)** | Bounded-context ownership, circuit breaker, OpenTelemetry, saga/outbox patterns are universally applicable |
| `devops-infrastructure` | **Port (partial)** | Secret hygiene rules, K8s resource/probe contract, Four Golden Signals thresholds, DR/RTO-RPO mandate are portable; strip AWS brand names and GHA YAML boilerplate |
| `aws-serverless` | **Port (partial)** | Thin-handler, module-scope SDK init, single-table DynamoDB design, DLQ for async, never-log-PII are strong AWS-TS patterns |
| `langchain-ai` | **Port (partial)** | Extract a framework-agnostic `llm-app-patterns` skill from Prompt Engineering, RAG, Agents, Memory, Error Handling, Evaluation, Security, Cost sections |
| `ai-ml-python` | **Port (partial)** | Extract: training loop pattern, `set_seed()` reproducibility function, data pipeline rules, ML testing checklist, Common Mistakes block |
| `python-fastapi` | **Port (partial)** | Async-pattern rules, dependency injection principles, Pydantic v2 syntax, structured error handling; FastAPI-specific sections only travel within FastAPI projects |
| `react` | **Port (partial)** | Extract: accessibility section, error handling, and security subsections; hooks and React performance sections are React-specific |
| `nextjs` | **Port (partial)** | Extract: TypeScript strictness rules, `{ success, data?, error? }` error shape, Zod mutation validation, `Promise.all` parallel fetch |
| `nextjs-typescript` | **Port (partial)** | Security section is the strongest portable extract: never expose API keys in client, `server-only` guard, structured results |
| `mern-stack` | **Port (partial)** | Common Pitfalls (N+1, ObjectId validation, `findByIdAndUpdate` options) and Security subsection are portable; Mongoose content is not |
| `react-typescript` | **Port (partial)** | Testing philosophy section; TypeScript naming conventions; significant overlap with `typescript-strict` — deduplicate |
| `golang-api` | **Port (partial)** | Error hierarchy pattern (sentinel + wrap), small-interface rule, handler→service→store layering, security checklist |
| `rust-axum` | **Port (partial)** | Async best practices (`spawn_blocking`, `time::timeout`) and `#[tracing::instrument]` observability patterns are portable Tokio idioms |
| `rust-actix` | **Port (partial)** | `AppError` enum with typed variants and `From<sqlx::Error>` conversion; strongly overlaps with `rust-axum` — merge |
| `go-gin` | **Port (partial)** | Concurrency idioms (context propagation, `errgroup`, no goroutine leaks) and `defer tx.Rollback()` are idiomatic Go |
| `django-rest` | **Port (partial)** | Service-layer pattern, separate read/write serializers, `filter querysets by user`, `transaction.atomic`; consolidate with `python-django` |
| `python-django` | **Port (partial, merge with `django-rest`)** | TimeStamped base, UUID PKs, Meta constraints model-design layer is unique; overlap with `django-rest` warrants consolidation |
| `fullstack-nextjs-prisma` | **Port (partial)** | Prisma schema conventions (cuid/uuid PKs, @@index on FK fields, @@map) and migration rule (never edit applied migrations) |
| `supabase-fullstack` | **Port (partial)** | PostgreSQL design principles (uuid PKs, timestamp columns, named constraints, composite indexes) and "queries in data access layer" rule |
| `t3-stack` | **Port (partial)** | "Ownership check ≠ authentication check" is the single highest-value extract; cursor pagination rationale is additive |
| `svelte-kit` | **Port (partial)** | Naming conventions and "never expose stack traces" error principle; overlaps with general clean-code elsewhere |
| `sveltekit` | **Port (partial)** | Security section only: validate server-side, env var secrets, sanitise user HTML; strip all routing/load/store content |
| `mobile-react-native` | **Port (partial)** | Three extractable principles: encrypted token storage, schema-based form validation (Zod), never block UI thread |
| `chrome-extension` | **Port (specialized)** | Excellent MV3 patterns but domain-bounded; keep as a specialised SOP for Chrome extension projects |
| `nodejs-express-typescript` | **Port (partial)** | "Services throw domain errors, controllers map to HTTP" principle and fail-fast env-var validation |
| **`supabase`** | **Leave out** | Every section references Supabase-proprietary APIs; stripping removes the value |
| **`nextjs-14-app-router`** | **Leave out** | Every rule maps to a Next.js App Router concept; no generalisable SOP content |
| **`nextjs-app-router`** | **Leave out** | All substantive content is Next.js-specific; Zod validation snippet is incidental and covered elsewhere |
| **`flutter-dart`** | **Leave out** | Every section is Flutter/Dart-specific; mobile security advice too thin to promote |
| **`vue3-composition`** | **Leave out** | Entirely structured around Vue-specific primitives; nominally portable fragments add nothing beyond existing skills |

---

## 4. Per-SOP Detail Table

### Tier 1 — High portability (port as-is with light strip)

| Source file | Trigger | Steps / contract | Quality bar | Strip | Notes |
|-------------|---------|-----------------|-------------|-------|-------|
| `security-best-practices` | Any code touching auth, authz, user-input handling, DB queries, API endpoints, secret management, HTTP headers, or dep additions | Standing ruleset: Core Principles → Input Validation → SQLi → XSS → Auth → Authz → Sensitive Data → HTTP Headers → Rate Limiting → Logging → Dep Security → Pitfalls | Each section has rules + before/after code snippets; Common Pitfalls anti-pattern list at end | Cursor frontmatter; "Project Context" paragraph; "Cursor Rules" H1 suffix | Split into sub-skills (auth, input-validation, headers) if granularity needed; rules are language-neutral, samples are TS/Node-centric |
| `testing-tdd` | Writing or reviewing tests, debugging TDD workflow, setting up test suite, enforcing coverage | 10-step contract: Red → Green → Refactor → Behaviour-named tests → AAA structure → Testing pyramid → Mock only external deps → Use factories + Faker → Test error paths → Run full suite before commit | H2 sections per concern; "Common Pitfalls" list is framework-free and especially portable | JS/TS and Python code samples; Tech Stack section; Playwright/Cypress specifics; factory_boy/fishery references | One of the strongest candidates in the repo; pitfalls list covers the most common failure modes regardless of language |
| `api-design-rest` | Designing or implementing a REST API; naming endpoints; choosing HTTP methods or status codes; adding pagination, filtering, or versioning | Declarative: (1) plural-noun/kebab-case URLs; (2) `{ "data": … }` envelope; (3) `{ "error": { code, message, details } }` error shape; (4) 2xx/4xx/5xx semantics table; (5) cursor-first pagination; (6) `/api/v1/` versioning; (7) Bearer token + 401/403 split | Well-structured with method-semantics table and JSON examples per case | "Project Context" paragraph; `alwaysApply`/`globs` frontmatter; HATEOAS "where practical" qualifier | Highest-quality REST reference audited; JSON envelope shape is internally consistent and worth adopting as canonical |
| `clean-code` | Any code authoring or review; naming, function length, nesting depth, refactoring scope | Topic sections: Naming → Functions → Conditionals → Error Handling → Comments → Code Smells → Refactoring → File Organisation | Bulleted rules + before/after code blocks; good density | "Project Context" preamble; verbose before/after blocks (condense to principle + one example); ~280 lines — distil to ~60-line checklist | Mirrors Clean Code taxonomy; Naming guidelines and Code Smells catalogue are the strongest sections to preserve |
| `database-sql` | Schema design, writing queries, authoring/reviewing migrations, adding indexes, diagnosing query performance | Standing ruleset: Schema Design → Indexing → Query Patterns → Migrations → Security → Performance → Pitfalls | H2/H3 sections with bullet rules + SQL code blocks; Common Pitfalls at end | Cursor frontmatter; "Project Context" paragraph; "Cursor Rules" H1 subtitle | Migration section is particularly strong: add-nullable-backfill-constrain pattern and `CREATE INDEX CONCURRENTLY` are often missing from similar guides |
| `performance-optimization` | Data fetching, list rendering, DB queries, API endpoints, caching layers, image handling, algorithmic hot paths; PR review for new queries or components | Standing ruleset: Core Principles → Frontend → Backend → API → Algorithmic → Memory → Monitoring → Pitfalls | H2/H3 sections with bullet rules + before/after code snippets; Core Web Vitals targets (LCP < 2.5s, INP < 200ms, CLS < 0.1, TTFB < 800ms) are concrete checklist | Cursor frontmatter; "Project Context" paragraph | Monitoring/tooling section (Lighthouse, Datadog, EXPLAIN ANALYZE, clinic.js, cProfile) is a useful bonus |
| `typescript` + `typescript-strict` | Any `.ts`/`.tsx` file; TypeScript typing, generics, enums, error handling | Standing rules: tsconfig flags → `no-any` → narrowing → generics → utility types → enum alternatives → exhaustive checks → error handling → anti-patterns | Fenced code examples per section; "Common Mistakes" consolidation | Cursor frontmatter; two redundant title comment lines; "Project Context" framing paragraph | Merge both files; rewrite "DON'T" items as positive instructions per learned preferences; `satisfies`/`asserts`/`assertNever` patterns are rarely documented elsewhere |
| `go-production` | Any Go code authoring or review; error handling, concurrency, HTTP handlers, DB access, config, structured logging | Standing ruleset: Project Structure → Error Handling → Interface Design → Concurrency → HTTP Handlers → Struct Design → Testing → Config → Logging → DB Access → Common Mistakes | H2 sections with bullets and Go code snippets; anti-patterns at end of each section + final consolidation | Cursor frontmatter; "Project Context" paragraph; project-structure tree (make advisory) | Make directory layout advisory, not normative; pairs naturally with `tdd` skill for testing section |
| `python-modern` | Writing, reviewing, or refactoring Python code (`.py`); type annotations, async I/O, data modeling, tooling setup | Standing standard: Type Hints → Dataclass Patterns → Match Statements → Exception Handling → Async → String Formatting → Comprehensions → File/Path → Project Standards → Naming → Testing → Common Mistakes | H2 sections with bullets + code examples; DON'T items visually separated; test coverage targets are concrete (95% business logic, 100% utilities, 80% integration) | Cursor frontmatter; "Cursor Rules" H1 label; "Project Context" persona paragraph | Version-pinned feature table (3.10/3.11/3.12) is a strength; add version requirement callout to trigger description |
| `rust-production` | Any Rust code authoring or review; error handling, async/concurrent code, shared state, API type design, unsafe blocks, Cargo.toml | Standing ruleset: Error Handling → Ownership → Struct/Type Design → Trait Patterns → Async (Tokio) → Concurrency → Iterators → API Design → Testing → Cargo.toml → Logging → Common Mistakes | 12 thematic sections with bullets and code snippets; Common Mistakes as quick-reference checklist | Cursor frontmatter; "Project Context" preamble; "Cursor Rules" H1 suffix | Highest-quality language-specific file in the repo; add "Related Skills" cross-references to `tdd` and `cot-gate` |
| `saas-starter` | Multi-tenant SaaS: auth, billing, RBAC, tenancy, email, invitation workflows | Declarative architecture contracts: organisationId on every scoped table; RBAC at membership level; Stripe webhook sync not polling; subscription enforcement at service layer; time-limited invitation tokens; async email queuing; soft-delete for compliance; security checklist | Security checklist (tenant scoping, server-side permission checks, Stripe signature verification, audit logging) is directly promotable | Specific Prisma/TypeScript syntax in examples (make generic); subdomain tenancy caveat | Highest-value file in this batch for architecture SOPs; `PLAN_LIMITS` pattern and `PlanLimitError` service-layer enforcement are canonical examples |
| `devops-docker` | Any Dockerfile, docker-compose.yml, CI/CD container step, or production deployment config; reviewing images for size, security, or health-check coverage | Standing ruleset: Multi-Stage Build Patterns → Layer Ordering → Image Size → .dockerignore → Security → Compose → Container Runtime → Dev Workflow → Production → Common Pitfalls | Numbered Layer Ordering list; Common Pitfalls prose list; health-check copy-paste patterns (HTTP probe, `pg_isready`, `redis-cli ping`) | Cursor frontmatter; "Project Context" and "Tech Stack" paragraphs; "Cursor Rules" H1 suffix; dev-workflow bash block (condense) | Merge with `docker-devops`; SIGTERM pitfall note ("container takes 10s to stop instead of shutting down gracefully") is precise and actionable |
| `nodejs-express` | Node.js/Express/TypeScript API development; new endpoints, middleware, auth, DB access, error handling, project scaffolding; code review of existing Express services | Standing ruleset: Code Style → Express Architecture → Middleware → Request Validation → Error Handling → TypeScript Patterns → Database → Auth → Logging → Testing → File Structure → Security → Performance | Dense H2 sections with bullet rules; File Structure labelled directory tree is a reusable reference artifact | Cursor frontmatter; "You are an expert…" persona opener; H1 title suffix "— Cursor Rules" | Complements `security-best-practices`; testing section should be a pointer to `tdd` rather than standalone |
| `tailwindcss` + `tailwind-ui` | Working on `.css`, `.tsx`, `.jsx`, or `.html` in a Tailwind-enabled project; UI styling, component design, dark mode, a11y, responsive layout | Standing rules: Code Style → Component Design → Responsive → Colour → Typography → Spacing → Interactive States → Patterns → Config → A11y → Performance → Animation | MDC frontmatter with glob pattern; H2 sections; bullet rules + three concrete HTML snippet examples; WCAG contrast ratios and PurgeCSS class-name safety | Nothing from `tailwindcss`; from `tailwind-ui`: merge additive WCAG/PurgeCSS sections | Dynamic-class-name warning (BAD/GOOD pattern) is particularly worth preserving verbatim; promotion-ready |

### Tier 2 — Medium portability (port with section extraction)

| Source file | Trigger | Steps / contract | Quality bar | Strip | Notes |
|-------------|---------|-----------------|-------------|-------|-------|
| `api-microservices` | Adding a new service; designing inter-service communication (REST/gRPC/events); implementing resilience patterns; wiring observability; reviewing microservices architecture | Standing ruleset: Service Design → Service Structure → API Design Between Services → Async Event-Driven → Resilience → Docker → Service Discovery → Observability (three pillars) → Data Consistency → Testing → Security → Anti-patterns | H2 sections, bullet rules, inline TypeScript/Dockerfile/JSON code samples; Anti-patterns as quick-reference checklist | Cursor frontmatter; "Project Context" persona paragraph; "Cursor Rules" H1 suffix | Standout anti-pattern: "DON'T build microservices for a new project — start modular monolith, split later"; scope skill to communication/resilience/observability and cross-reference Docker and security skills |
| `devops-infrastructure` | Tasks touching `.tf`, `.yml`/`.yaml`, or `Dockerfile`; infra-as-code, CI/CD pipelines, containerisation, K8s deployment, secret management | Standing standards: Terraform → Docker → CI/CD → K8s → Monitoring → Secret Management → DR → Security | Bullet lists per domain; Four Golden Signals alert thresholds are a concrete reusable checklist | AWS-specific module tree (S3+DynamoDB, CloudWatch, Secrets Manager brand names); GitHub Actions YAML boilerplate; Terraform `t3.*` validation example; "Project Context" preamble | Priority extractions: secret hygiene rules, Docker checklist, K8s resource/probe contract, Four Golden Signals, DR/RTO-RPO mandate |
| `python-fastapi` | Any `.py` file in a FastAPI or async Python web service; route handlers, Pydantic models, async DB access, dependency injection, new Python API project | Standing ruleset: Code Style → FastAPI Patterns → Pydantic v2 Models → Async Patterns → Dependency Injection → Error Handling → Database/SQLAlchemy Async → Testing → File Structure → Security → Performance | H2 sections with bullet rules; code snippets for non-obvious syntax; file-structure code block doubles as scaffold template | Cursor frontmatter; persona opening line; H1 title suffix "— Cursor Rules"; mark file-structure tree as advisory | Pydantic v2 syntax section is a rare and high-value reference; Security section is FastAPI-specific enough to keep rather than delegating to `security-best-practices` |
| `langchain-ai` | Python LLM applications needing guidance on prompt engineering, RAG pipelines, agent/tool design, memory management, or LLM observability | Sections to extract: Prompt Engineering → RAG pipeline stages → Agents/Tools design → Memory strategy → Error Handling → Evaluation → Security → Performance/Cost | H2 sections with bulleted rules + Python code snippets; File Structure section is a bonus reference diagram | Cursor frontmatter; persona paragraph; "Cursor Rules" H1 suffix; opinionated `src/` file-structure; LangSmith-specific references (generalise to "LLM observability/tracing") | LangGraph section is a rare detailed reference for stateful agent graph design; consider two outputs: `langchain-dev` skill and a framework-agnostic `llm-app-patterns` skill |
| `ai-ml-python` | Writing PyTorch `nn.Module` subclasses, training loops, ML data pipelines, experiment tracking, reproducibility scaffolding, or ML testing in Python | Extract sections: PyTorch module pattern → training loop pattern (gradient clipping, `set_to_none=True`, AMP) → reproducibility setup (`set_seed()`) → data pipeline rules → ML testing checklist → Common Mistakes | Do/don't reference standards per domain with code snippets | Opinionated project directory tree; verbose ONNX/TorchScript export boilerplate; Pydantic config example; notebook-discipline section (obvious, low signal); specific wandb `init()` call | `set_seed()` covers `random`, `numpy`, `torch`, `cuda`, and cudnn — a complete reference; instruction to save train/val/test split definitions (not just seeds) is a non-obvious reproducibility point |

### Tier 3 — Partial portability (extract specific sections only)

| Source file | Extractable content | Strip the rest |
|-------------|--------------------|--------------------|
| `nextjs` | TypeScript strictness rules, `{ success, data?, error? }` return shape, Zod mutation validation, `Promise.all` parallel fetch, colocated tests | App Router file conventions, RSC boundary rules, `next/image`/`next/font`/`next/dynamic` performance rules |
| `nextjs-typescript` | Security section: never expose API keys in client, `server-only` guard, structured results not thrown errors | App Router Architecture, Data Fetching, RSC, Performance, File Structure sections |
| `t3-stack` | "Ownership check ≠ authentication check" principle; cursor vs offset pagination rationale; four error codes (NOT_FOUND/UNAUTHORIZED/FORBIDDEN/BAD_REQUEST) | All tRPC boilerplate, NextAuth Prisma adapter specifics, client provider wrapping |
| `fullstack-nextjs-prisma` | Prisma schema conventions (cuid/uuid PKs, @@index on FK/WHERE fields, @@map); DB singleton pattern; migration rule (never edit applied migrations); auth-check-in-every-action | App Router structure, Server Components, Server Actions specifics, Suspense streaming |
| `supabase-fullstack` | PostgreSQL design principles (uuid PKs, timestamp columns, explicit FK ON DELETE, named constraints, composite indexes); security mandate (never service key on client, parameterised queries, paginate everything, data-access layer not in UI components); `getUser()` vs `getSession()` auth hygiene | All RLS CREATE POLICY SQL, supabase client API calls, Edge Functions, Realtime/Storage/CLI content |
| `react` | Accessibility section, error handling pattern, security subsection | Hooks guidance, React-specific performance (memo, virtualisation), JSX composition patterns |
| `golang-api` | Error hierarchy (sentinel + wrap), small-interface rule, handler→service→store layering, security checklist | All Go-specific code blocks, stdlib package names, concurrency primitives, Go runtime performance tips |
| `rust-axum` + `rust-actix` | `spawn_blocking`, `time::timeout`, `tokio::sync::Mutex` async best practices; `AppError` enum + typed variants; `#[tracing::instrument]`; `From<sqlx::Error>` conversion | All Axum/Actix-specific extractor APIs, `Router::layer()`, `web::Data`/`web::Path`/`web::Json` |
| `go-gin` | Concurrency idioms (context propagation, `errgroup`, goroutine shutdown paths); `defer tx.Rollback()` transaction idiom; `errors.Is/As` with `%w` wrapping | Gin-specific binding tags, `*gin.Context` handler signatures, `gin.H{}` helpers |
| `django-rest` + `python-django` | Service-layer pattern; separate read/write serializers; filter querysets by authenticated user; `transaction.atomic` for multi-step writes; TimeStamped base model; UUID PKs; Meta constraints | DRF ViewSet/serializer syntax, Django ORM query chains, URL routing, signal/admin references |
| `mobile-react-native` | Three principles: encrypted token storage, Zod schema-based form validation, never block UI thread | All React Native–specific APIs, Expo modules, Expo Router, EAS Build/Submit |

---

## 5. Portability Ranking

### High — port as-is (light strip only)

1. `security-best-practices` — comprehensive OWASP-aligned reference; one of the most complete security rules audited
2. `testing-tdd` — full TDD lifecycle + pitfalls list; strongest portable testing SOP in the repo
3. `api-design-rest` — entirely stack-neutral; canonical JSON envelope and HTTP semantics; no project coupling
4. `saas-starter` — virtually entire file is stack-agnostic SaaS architecture; highest-value file in the architecture batch
5. `database-sql` — universal SQL principles; standout migration section
6. `rust-production` — highest-quality language-specific file; purely generic best practice
7. `go-production` — stdlib-grounded; no framework coupling; well-structured
8. `python-modern` — version-pinned features; concrete test coverage targets
9. `devops-docker` + `docker-devops` — unusually concrete Docker guidance; numbered layer ordering; SIGTERM pitfall
10. `typescript` + `typescript-strict` — complete strict-mode guide; `satisfies`/`asserts`/`assertNever` rarely documented elsewhere
11. `tailwindcss` + `tailwind-ui` — no org-specific content; dynamic-class-name safety warning is a preservation gem
12. `performance-optimization` — full-stack checklist; Core Web Vitals targets are a concrete deliverable
13. `clean-code` — language-agnostic Clean Code taxonomy; condense before promotion
14. `nodejs-express` — canonical layered architecture for Node/TS; widely adoptable

### Medium — port with section extraction

15. `api-microservices` — bounded context, circuit breaker, OpenTelemetry, saga/outbox; "start modular monolith" anti-pattern gem
16. `python-fastapi` — Pydantic v2 syntax is a rare high-value reference; async patterns broadly applicable
17. `langchain-ai` — framework-agnostic LLM-app patterns sections (Prompt Engineering, RAG, Agents, Memory, Evaluation, Security, Cost)
18. `devops-infrastructure` — K8s resource/probe contract, Four Golden Signals, DR/RTO-RPO; strip AWS brand names
19. `aws-serverless` — thin-handler, DynamoDB single-table design, DLQ for async, never-log-PII; densest file for AWS-TS
20. `nodejs-express-typescript` — "services throw domain errors, controllers map HTTP"; fail-fast env-var validation
21. `golang-api` — error hierarchy, small-interface rule; overlaps with `go-production` but adds security checklist
22. `ai-ml-python` — `set_seed()` reproducibility function and ML training loop pattern are hard to find elsewhere
23. `react` — accessibility and security subsections are thorough and portable

### Partial — extract specific sections only

24. `nextjs` — TypeScript strictness and `{ success, data?, error? }` error shape are extractable
25. `nextjs-typescript` — security section only; "never expose API keys, `server-only` guard, structured results"
26. `t3-stack` — "ownership check ≠ authentication check" is the single most portable extract
27. `fullstack-nextjs-prisma` — Prisma schema conventions and "never edit applied migrations" rule
28. `supabase-fullstack` — PostgreSQL design checklist and "data-access layer not in UI" security mandate
29. `rust-axum` + `rust-actix` — async best practices and `AppError` enum pattern (merge)
30. `go-gin` — concurrency idioms and `errgroup` pattern (additive to `go-production`)
31. `django-rest` + `python-django` — service-layer pattern and model-design layer (merge)
32. `mern-stack` — Common Pitfalls and Security subsection only
33. `react-typescript` — testing philosophy section; heavy overlap with `typescript-strict`
34. `svelte-kit` + `sveltekit` — naming conventions and security section (deduplicate)
35. `mobile-react-native` — three extractable principles only
36. `chrome-extension` — specialized SOP; domain-bounded but excellent within scope

### Leave out — no extractable SOP content

37. `supabase` — Supabase-proprietary throughout; hollowing removes value
38. `nextjs-14-app-router` — entirely Next.js App Router-specific
39. `nextjs-app-router` — all substantive content is Next.js-specific
40. `flutter-dart` — entirely Flutter/Dart-specific
41. `vue3-composition` — entirely Vue-primitive-dependent

---

## 6. Cross-Cutting Protocol Primitives

Patterns appearing in 2+ files, indicating strong candidates for a shared base SOP or cross-reference anchor:

### P1 — Common Pitfalls / Anti-Pattern Terminal Section
Appears in: `security-best-practices`, `testing-tdd`, `clean-code`, `database-sql`, `performance-optimization`, `devops-docker`, `api-microservices`, `go-production`, `python-modern`, `rust-production`, `nodejs-express`, `python-fastapi`, `mern-stack`, `langchain-ai`, `ai-ml-python`  
Pattern: Every high-quality file ends with a "Common Pitfalls" or "Common Mistakes to Avoid" block that compresses hard-won operational knowledge into a scannable anti-pattern checklist. This structure is the highest-density section in virtually every file. **Recommendation**: Mandate this section in all promoted skills.

### P2 — Parameterised Queries / SQL Injection Prevention
Appears in: `security-best-practices`, `database-sql`, `supabase-fullstack`, `nodejs-express`, `python-fastapi`, `django-rest`, `golang-api`  
Pattern: Never interpolate user input into SQL; always use parameterised queries or ORM placeholders. Consistent enforcement signal across all backend-layer files.

### P3 — Layered Architecture (Handler → Service → Repository)
Appears in: `nodejs-express`, `golang-api`, `nodejs-express-typescript`, `django-rest`, `rust-actix`, `rust-axum`, `go-gin`, `python-fastapi`  
Pattern: Business logic belongs in a service layer; handlers/controllers only do HTTP marshalling; repositories handle data access. Language-agnostic architecture principle appearing in every backend-language file.

### P4 — Structured Error Shape (Typed Error Object)
Appears in: `api-design-rest` (`{ "error": { code, message, details } }`), `nodejs-express` (custom AppError hierarchy), `python-fastapi` (HTTPException + consistent error shape), `nextjs` (`{ success, data?, error? }`), `t3-stack` (NOT_FOUND/UNAUTHORIZED/FORBIDDEN/BAD_REQUEST taxonomy), `golang-api` (sentinel errors + wrap with context), `rust-actix`/`rust-axum` (sealed `AppError` enum with typed variants)  
Pattern: Errors should be structured, typed, and carry a code + message; HTTP status codes should map deterministically from error types.

### P5 — Strip Cursor-Specific Frontmatter and Persona Preamble
Appears in: All 42 files  
Pattern: Every file carries `alwaysApply`, `globs`, and a "Project Context" / "You are an expert…" persona paragraph that is Cursor-tooling noise with no instructional value. This strip operation is a prerequisite for all promotions.

### P6 — Never Log / Expose Secrets or PII
Appears in: `security-best-practices`, `nextjs-typescript`, `langchain-ai`, `aws-serverless`, `sveltekit`, `nodejs-express`  
Pattern: Secrets must not appear in logs; PII must not be logged or included in error responses; API keys must not be accessible in client-side code.

### P7 — Testing Pyramid (Unit → Integration → E2E)
Appears in: `testing-tdd`, `react`, `python-modern`, `go-production`, `nodejs-express`  
Pattern: Many small unit tests → fewer integration tests → very few E2E tests. E2E tests cover only critical user journeys. Consistent across all testing-oriented files.

### P8 — Cursor-Based Pagination Over Offset
Appears in: `api-design-rest`, `database-sql`, `t3-stack`, `fullstack-nextjs-prisma`  
Pattern: Offset-based pagination degrades on large datasets; cursor-based pagination is the recommended default. Appears consistently wherever pagination is discussed.

### P9 — Input Validation at the Boundary
Appears in: `security-best-practices`, `nodejs-express`, `python-fastapi`, `mern-stack`, `fullstack-nextjs-prisma`, `mobile-react-native`, `sveltekit`  
Pattern: Validate and sanitise all user input at the entry point (HTTP handler / form submission / server action) before passing it to business logic or database layer.

### P10 — Negative Framing in "DON'T" Rules
Appears in: `go-production`, `python-modern`, `rust-production`, `typescript-strict`, `python-fastapi`, `react`, `langchain-ai`, `ai-ml-python`  
Pattern: All files use "DON'T do X" formatting for anti-patterns. **Recommendation** (per learned preferences): Rewrite as positive instructions on promotion ("Use `unknown` instead of `any`" not "DON'T use `any`").

---

## 7. Default Recommendation — Top Picks for Cross-Repo Comparison

These files should be nominated as candidates in the cross-repo comparison phase, ranked by estimated impact and uniqueness:

### Tier A — Nominate unconditionally

| Rank | File | Skill name | Rationale |
|------|------|-----------|-----------|
| 1 | `security-best-practices` | `security-coding` | Comprehensive OWASP-aligned reference; most complete security rule across all repos audited |
| 2 | `testing-tdd` | `tdd` (supplement existing) | Full TDD lifecycle + pitfalls; strongest TDD SOP seen; pitfalls list is unusually transferable |
| 3 | `api-design-rest` | `api-design-rest` | Entirely stack-neutral canonical REST reference; JSON envelope shape is directly adoptable |
| 4 | `saas-starter` | `saas-architecture` | Highest-value architecture file; stack-agnostic SaaS patterns nowhere else in this repo |
| 5 | `database-sql` | `database-sql` | Universal relational DB reference; standout migration section often absent from similar guides |
| 6 | `rust-production` | `rust-production` | Highest-quality language-specific file; pure best practice, zero repo customisation |

### Tier B — Nominate with extraction note

| Rank | File | Skill name | What to extract |
|------|------|-----------|-----------------|
| 7 | `typescript` + `typescript-strict` (merged) | `typescript-strict` | Full merged guide; rewrite DON'T items as positive instructions |
| 8 | `go-production` | `go-production` | All sections; make directory layout advisory |
| 9 | `python-modern` | `python-modern` | Full guide; add Python 3.10+ version callout to trigger |
| 10 | `devops-docker` + `docker-devops` (merged) | `devops-docker` | Consolidated Docker guidance; SIGTERM pitfall and layer-ordering rule are gems |
| 11 | `api-microservices` | `microservices-architecture` | Scope to communication/resilience/observability; keep "start modular monolith" anti-pattern |
| 12 | `langchain-ai` | `llm-app-patterns` | Extract framework-agnostic sections only: Prompt Engineering, RAG, Agents, Memory, Evaluation, Security, Cost |
| 13 | `performance-optimization` | `performance-coding` | Full guide; Core Web Vitals targets are an immediately usable concrete checklist |

---

## 8. Structural Patterns

Notable structural patterns in this repo worth preserving or mandating in promoted skills:

### S1 — Common Pitfalls Section as Terminal Section
Every high-quality file ends with a consolidated anti-pattern section ("Common Pitfalls", "Common Mistakes to Avoid"). This structure compresses the most frequently violated rules into one scannable location. Files with this section (`security-best-practices`, `testing-tdd`, `database-sql`, `performance-optimization`, `devops-docker`, `go-production`, `rust-production`, etc.) are universally higher-signal than those without. **Mandate this section in all promoted SKILL.md files.**

### S2 — Rule → Before/After Code Block Pattern
The strongest sections in this repo pair each rule with a concrete before/after code snippet (or GOOD/BAD annotation). This pattern appears in `typescript`, `typescript-strict`, `performance-optimization`, `database-sql`, `devops-docker`, `tailwindcss`. It forces rule authors to make the rule specific enough to illustrate and helps readers recognise violations. Files that enumerate rules without examples are consistently harder to act on.

### S3 — Section Independence (H2 Sections as Standalone Units)
The highest-quality files (`security-best-practices`, `testing-tdd`, `api-microservices`, `rust-production`) are structured so each H2 section is independently readable and self-contained. This makes it possible to load a single section as focused context rather than the entire file. Contrast with `clean-code` (~280 lines of running prose + code) which benefits from condensation.

### S4 — Dual-Purpose Anti-Pattern Checklist
Several files repurpose the Common Pitfalls section as a quick-reference linting checklist (e.g., `mern-stack` Common Pitfalls: N+1 queries, missing `lean()`, ObjectId validation). This dual function — both educational context and operational checklist — is the format that transfers most cleanly into review protocols.

### S5 — File Structure Tree as Advisory Reference
Many files include a labelled directory tree (e.g., `nodejs-express`, `python-fastapi`, `langchain-ai`, `aws-serverless`). These are high-value orientation artifacts but become liabilities if framed as normative. Best practice observed in this repo: include the tree and mark it "(recommended scaffold — adapt to your project)" rather than presenting it as the only valid layout. Some files (`fullstack-nextjs-prisma`, `saas-starter`) fail to add this advisory qualifier; fix on promotion.

### S6 — Explicit DON'T Anti-Patterns (Needs Positive Reframing)
Roughly half the files use "DON'T X" formatting for anti-patterns in their rules. Per learned preferences, these seed the model to consider the forbidden option. On promotion, each DON'T rule should be rewritten as a positive instruction: "Use parameterised queries" not "Never interpolate user input into SQL queries." The `typescript-strict` finding explicitly notes this gap.

---

## 9. Evidence

Citations traceable to `raw-findings.md`:

> **[E1]** `testing-tdd`: *"One of the strongest portable candidates in the reference set. The core TDD discipline, naming philosophy, and pyramid model are timeless and broadly adoptable. The pitfalls list is especially transferable — covers the most common failure modes teams hit regardless of language."*

> **[E2]** `api-design-rest`: *"Highest-quality REST reference seen so far in this audit. The JSON envelope (`data` wrapper, `meta` for pagination, typed `error` object) is internally consistent and worth adopting as the canonical shape."*

> **[E3]** `security-best-practices`: *"One of the most complete and immediately usable files in the repo. Good candidate for a `security-coding` skill. The code samples are TypeScript/Node-centric but the rules themselves are language-neutral."*

> **[E4]** `typescript-strict`: *"The 'Common Mistakes to Avoid' section uses negative framing ('DON'T') — per learned preferences these should be rewritten as positive instructions when promoted (e.g., 'Use `unknown`' instead of 'DON'T use `any`')."*

> **[E5]** `devops-docker`: *"Standout gem: the SIGTERM pitfall note ('container takes 10s to stop instead of shutting down gracefully') is precise and actionable."*  And: *"The explicit layer-ordering rule (base image → system deps → create user → copy manifests → install deps → copy source → build → runtime config) is unusually concrete and rarely articulated this clearly."*

> **[E6]** `saas-starter`: *"Highest-value file in this batch. The security checklist (tenant scoping, server-side permission checks, Stripe webhook signature verification, audit logging) is directly promotable as a reusable SaaS security policy."*  And: *"Virtually the entire file describes stack-agnostic SaaS architecture."*

> **[E7]** `t3-stack`: *"The 'ownership check ≠ authentication check' principle is the single most portable SOP here and should be extracted as a standalone security rule."*

> **[E8]** `api-microservices`: *"Standout gem: the explicit anti-pattern 'DON'T build microservices for a new project — start modular monolith, split later.'"*

> **[E9]** `database-sql`: *"The Migrations section is particularly strong — safe migration patterns (add-nullable-backfill-constrain, `CREATE INDEX CONCURRENTLY`) are often missing from similar guides."*

> **[E10]** `nextjs-typescript`: *"The security section ('Never expose API keys in client components', 'mark server-only modules with `import 'server-only'`', 'return structured results not thrown errors') is the strongest portable candidate across all four [Next.js] files reviewed here."*

> **[E11]** `ai-ml-python`: *"The `set_seed()` function covers `random`, `numpy`, `torch`, `cuda`, and cudnn — a complete reference worth preserving. The instruction to save train/val/test split definitions (not just seeds) is a non-obvious but critical reproducibility point."*

> **[E12]** `rust-production`: *"One of the highest-quality language-specific rules in the repo — purely generic best practice with no repo-specific customisation. Directly promotable to a `rust-production` skill."*

> **[E13]** `supabase`: *"Low — rules are deeply Supabase-coupled (auth.uid(), Edge Functions, Supabase client API, supabase CLI, PgBouncer config). Cannot be abstracted to a generic backend SOP without hollowing out the specificity that makes it useful."*

> **[E14]** `vue3-composition`: *"The entire document is structured around Vue-specific primitives… The only nominally portable fragments… are too generic to constitute a meaningful SOP extraction; they add nothing beyond what a general testing or architecture skill already covers."*

---

*End of audit report. All claims above are traceable to observations in `raw-findings.md`. No inferences from external sources.*
