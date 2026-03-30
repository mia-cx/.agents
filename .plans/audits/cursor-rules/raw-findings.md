
## rules/security-best-practices/rule.mdc
**Type**: Reference rule / security checklist — comprehensive OWASP-aligned guidelines covering input validation, SQLi, XSS, auth, authz, secrets handling, HTTP headers, rate limiting, logging, and deps.
**Portable**: Yes — highly portable; all guidance is framework-agnostic or gives framework-specific examples (Zod, Prisma, React, Express/helmet, bcrypt/Argon2) that are widely applicable.
**Reason**: Covers the full breadth of web-app security fundamentals in one place. Principles (least privilege, fail securely, never trust input) and patterns (parameterised queries, httpOnly cookies, CSP, RBAC middleware) are universally applicable across tech stacks.
**Trigger**: Any code change touching authentication, authorisation, user-input handling, database queries, API endpoints, secret management, or HTTP response headers; also on dependency additions/updates.
**Steps/contract**: Not a procedural SOP — structured as a standing ruleset. Sections: Core Principles → Input Validation → SQLi Prevention → XSS Prevention → Authentication → Authorization → Sensitive Data → HTTP Headers → Rate Limiting → Logging → Dependency Security → Common Pitfalls. Each section has rules + code examples.
**Strip**: Cursor-specific frontmatter (`alwaysApply`, `globs`); project-context paragraph ("You are working on an application where security is a top priority…") — repo-specific framing that adds noise; the section heading "Cursor Rules" in the H1.
**Structure/format**: Strong. Hierarchical H2/H3 sections, each with a bullet rule list followed by concrete before/after code snippets. Common-Pitfalls section acts as a quick-reference anti-pattern list. Well-suited for promotion to a skill with minimal restructuring.
**Notes**: One of the most complete and immediately usable files in the repo. Good candidate for a `security-coding` skill. The code samples are TypeScript/Node-centric but the rules themselves are language-neutral. Consider splitting into sub-skills (auth, input-validation, headers) if granularity is needed, or keep as one omnibus skill with a broad trigger description.
## rules/testing-tdd/rule.mdc
**Type**: Comprehensive TDD rule — workflow, naming conventions, test categories, mocking strategy, UI testing, test data, edge cases, pitfalls
**Portable**: YES
**Reason**: Entirely framework-agnostic in principle; the TDD cycle (red-green-refactor), AAA pattern, testing pyramid, naming conventions ("describe behaviour, not implementation"), and mocking strategy are universal. The framework-specific code samples (Jest/Vitest, pytest, RTL, MSW, Playwright) illustrate rather than constrain, and are easily swapped or trimmed per target repo.
**Trigger**: Any task involving writing or reviewing tests, debugging a TDD workflow, setting up a test suite, or enforcing coverage standards — especially when authoring new features or fixing bugs.
**Steps/contract**:
1. Red — write a failing test describing desired behaviour before any production code
2. Green — write the minimum production code to make it pass
3. Refactor — clean up while keeping tests green; repeat
4. Name tests by observable behaviour, not implementation detail
5. Structure each test with AAA (Arrange / Act / Assert)
6. Follow testing pyramid: many unit → some integration → few E2E
7. Mock only external/slow/nondeterministic dependencies; inject dependencies for testability
8. Use factories + Faker for minimal, realistic test data
9. Test error paths, boundaries, auth edge cases, and async failures
10. Run full suite before commit; fix or delete failing tests — never permanently skip
**Strip**: All JS/TS and Python code samples (illustrative, repo-specific tooling); the "Tech Stack" section listing exact packages; Playwright/Cypress specifics (keep the principle — "E2E tests cover critical user journeys"); factory_boy/fishery references; MSW-specific setup boilerplate
**Structure/format**: Well-organised — clear H2 sections per concern (workflow, naming, categories, mocking, UI, data, pitfalls). Highly scannable. Good as a skill/rule with sections that can be individually referenced. The "Common Pitfalls" section is particularly strong and portable as-is (prose list, no tooling dependency).
**Notes**: One of the strongest portable candidates in the reference set. The core TDD discipline, naming philosophy, and pyramid model are timeless and broadly adoptable. The pitfalls list is especially transferable — covers the most common failure modes teams hit regardless of language. Worth promoting with a light trim (strip tooling-specific boilerplate, keep principles + examples in language-neutral pseudocode or a single illustrative snippet).

## rules/api-design-rest/rule.mdc
**Type**: Reference / cheat-sheet — comprehensive REST API design rules covering URLs, HTTP methods, request/response format, status codes, pagination, filtering, versioning, auth, and documentation.
**Portable**: Yes — entirely language- and framework-agnostic; all patterns (URL conventions, JSON envelope shape, status code semantics, pagination, versioning) apply to any REST API regardless of stack.
**Reason**: Captures durable, well-established REST best-practices that are stable across repos and stacks. No project-specific endpoints, models, or infra references anywhere in the file.
**Trigger**: Designing or implementing a REST API; naming new endpoints; choosing HTTP methods or status codes; adding pagination, filtering, or versioning to an existing API; reviewing an API for inconsistencies.
**Steps/contract**: Declarative rule set rather than a procedural SOP — provides *what to do* but not a numbered workflow. Key contracts: (1) plural-noun, kebab-case, max-2-deep URL nesting; (2) `{ "data": … }` / `{ "data": [], "meta": {} }` envelope; (3) `{ "error": { "code", "message", "details" } }` error shape; (4) correct 2xx/4xx/5xx semantics table; (5) cursor-first pagination; (6) URL path versioning (`/api/v1/`); (7) Bearer token auth with 401/403 split.
**Strip**: "Project Context" prose paragraph (repo-oriented framing); the `alwaysApply: false` / `globs` frontmatter (cursor-specific metadata); HATEOAS qualifier "where practical" (ambiguous — rephrase or drop).
**Structure/format**: Well-structured with clear H2 sections, inline code blocks showing exact URL patterns, a method-semantics table, and JSON examples for each case. Format is directly reusable as a skill or rule document with minor front-matter cleanup.
**Notes**: Highest-quality REST reference seen so far in this audit. The JSON envelope (`data` wrapper, `meta` for pagination, typed `error` object) is internally consistent and worth adopting as the canonical shape. The cursor-vs-offset pagination section is a useful addition. One gap: no guidance on idempotency keys for POST retries or content-negotiation beyond a passing mention of the `Accept` header.

## rules/clean-code/rule.mdc
**Type**: Reference guide — comprehensive clean-code principles (naming, functions, conditionals, error handling, comments, code smells, refactoring, file organisation). Not a procedural workflow.
**Portable**: Yes — principles are language-agnostic; TypeScript examples are illustrative, not binding.
**Reason**: Covers the canonical clean-code canon (SRP, guard clauses, intention-revealing names, no magic numbers, etc.) thoroughly and coherently. The code-smell catalogue and refactoring-technique list are especially portable and actionable. Content is solid with no repo-specific logic.
**Trigger**: Any code authoring or review session; especially useful when reviewing naming, function length, nesting depth, or refactoring scope.
**Steps/contract**: No discrete procedural steps — structured as topic sections (Naming / Functions / Conditionals / Error Handling / Comments / Code Smells / Refactoring / File Organisation), each with rules + examples.
**Strip**: "Project Context" preamble (repo-specific framing); TS-specific syntax in examples can be replaced with pseudo-code or kept as non-binding illustrations; verbose before/after blocks can be condensed to principle + one representative example.
**Structure/format**: Well-organised hierarchical reference with H2 topic sections, bulleted rules, and fenced code blocks. Suitable as a standalone reference skill or as an inline checklist appendix to a code-review SOP.
**Notes**: Directly mirrors Robert Martin's *Clean Code* taxonomy — high credibility but no novel content. Strongest sections to preserve: Naming guidelines (boolean/function/class/collection prefixes), Code Smells catalogue, Guard Clauses pattern, and Common Pitfalls. Weakest section: "Project Context" (discard). Length (~280 lines) warrants condensation before promotion — distil to a ~60-line principles checklist with example pointers rather than inline code blocks.

## rules/database-sql/rule.mdc
**Type**: Comprehensive reference ruleset — covers relational database schema design, indexing strategy, query patterns, migrations, security, and performance for SQL databases with ORM or raw SQL.
**Portable**: Yes — highly portable; principles and patterns are universally applicable across stacks. Framework/tool references (Prisma, SQLAlchemy, Drizzle, PgBouncer, Alembic) are illustrative, not prescriptive.
**Reason**: The core guidance (naming conventions, constraint design, index strategy, parameterised queries, safe migrations, N+1 avoidance, cursor vs offset pagination) applies to virtually any relational database project regardless of language or ORM. The SQL examples are valid standard SQL with PostgreSQL extensions clearly labelled.
**Trigger**: Any task involving schema design, writing queries, authoring or reviewing migrations, adding indexes, or diagnosing query performance in a SQL-backed project.
**Steps/contract**: Not procedural — structured as a standing ruleset with sections: Schema Design (naming conventions + table design rules) → Indexing Strategy (when to index, index types) → Query Patterns (efficient reads, joins) → Migrations (safe change patterns) → Security → Performance (query optimisation + connection management) → Common Pitfalls. Each section has rules + illustrative SQL snippets.
**Strip**: Cursor-specific frontmatter (`alwaysApply`, `globs`); project-context paragraph ("You are working on a project that uses a relational database…") and Tech Stack section — both are repo-scoped framing that adds noise; the "Cursor Rules" subtitle in the H1.
**Structure/format**: Strong. Hierarchical H2/H3 sections with bullet rule lists followed by concrete SQL code blocks. The Common Pitfalls section at the end doubles as a quick-reference anti-pattern checklist. Minimal restructuring needed for promotion to a skill.
**Notes**: One of the more complete and immediately usable files in the repo. Good candidate for a `database-sql` skill. The examples are PostgreSQL-flavoured but the rules themselves are dialect-neutral. The Migrations section is particularly strong — safe migration patterns (add-nullable-backfill-constrain, `CREATE INDEX CONCURRENTLY`) are often missing from similar guides. Consider keeping the pitfalls section as a compact checklist rather than inline prose on promotion.

## rules/performance-optimization/rule.mdc
**Type**: Reference rule / performance checklist — comprehensive multi-layer guide covering frontend (loading, images, rendering, React, Core Web Vitals), backend (DB query optimization, N+1 prevention, caching, connection pooling), API, algorithmic efficiency, memory management, and monitoring.
**Portable**: Yes — highly portable. All core principles and patterns are framework-agnostic; framework-specific examples (React, Next.js, Prisma, Redis, PostgreSQL) are illustrative and easy to adapt or swap.
**Reason**: Covers the full breadth of web-app performance fundamentals across the stack. Principles (measure first, optimize the critical path, profile before acting) and patterns (cache-aside, N+1 eager loading, Map/Set for O(1) lookups, pagination, connection pooling) are universally applicable regardless of language or framework.
**Trigger**: Any code change touching data fetching, list rendering, database queries, API endpoints, caching layers, image handling, or algorithmic hot paths; also useful as a review checklist when a PR introduces new queries or frontend components.
**Steps/contract**: Not a procedural SOP — structured as a standing ruleset. Sections: Core Principles → Frontend Performance (Loading, Images, Rendering, React, Core Web Vitals) → Backend Performance (DB Queries, N+1 Prevention, Caching, Connection Pooling) → API Performance → Algorithmic Efficiency → Memory Management → Monitoring & Profiling → Common Pitfalls. Each section has bullet rules + concrete before/after code snippets.
**Strip**: Cursor-specific frontmatter (`alwaysApply`, `globs`); project-context paragraph ("You are working on a performance-sensitive application…") — repo-specific framing; the "Cursor Rules" subtitle in the H1.
**Structure/format**: Strong. Hierarchical H2/H3 sections with bullet rules followed by concrete before/after code examples. Common Pitfalls section serves as a quick anti-pattern reference. Well-structured for promotion to a skill with minimal restructuring; the Core Web Vitals targets (LCP < 2.5s, INP < 200ms, CLS < 0.1, TTFB < 800ms) are a particularly reusable concrete checklist.
**Notes**: Broad and immediately usable. Good candidate for a `performance-coding` skill. Could be split into sub-skills (frontend-perf, db-perf, caching) if granularity is needed, but the unified form is coherent and the sections don't overlap. The monitoring/tooling section (Lighthouse, Datadog, EXPLAIN ANALYZE, clinic.js, cProfile) is a useful bonus that most performance rules omit.

## rules/typescript/rule.mdc
**Type**: Coding standards / type-safety rules for TypeScript
**Portable**: Yes — fully language-scoped, no project-specific paths, APIs, or org details
**Reason**: Comprehensive, opinionated TypeScript strict-mode guide covering tsconfig flags, `no-any`, narrowing, generics, utility types, enum alternatives, exhaustive checks, error handling, and common anti-patterns. High signal density with concise worked examples.
**Trigger**: Any `.ts` / `.tsx` file; also fires when TypeScript typing, generics, enums, or error handling are the subject of a task
**Steps/contract**: Not a procedural SOP — a standing rules file. Agent reads it as ambient context while writing TypeScript; no explicit step sequence.
**Strip**: The Cursor-specific header (`alwaysApply`, `globs` frontmatter) and the two title comment lines (`# Strict TypeScript — Cursor Rules` / `# Zero-compromise…`) are tooling artefacts; strip before porting. All body content is portable.
**Structure/format**: Markdown with fenced-code examples per section. Could be adopted as-is into a `rules/` file or flattened into a SKILL.md `## Rules` block.
**Notes**: Best candidate in the repo for a universal TypeScript rules file. The `satisfies`, `asserts`, and `assertNever` patterns are particularly strong and rarely covered elsewhere. Minor omission: no guidance on `strictNullChecks`-aware optional chaining (`?.` / `??`), but not a blocker.

## rules/api-microservices/rule.mdc
**Type**: Comprehensive architecture reference rule — service design principles, directory scaffold, inter-service API design, async event patterns, resilience (circuit breaker, retry, bulkhead), Docker, service discovery, observability (logs/metrics/traces), data consistency (saga, outbox), testing strategy, mTLS/security, and anti-patterns.
**Portable**: Mostly yes — all principles are stack-neutral; TypeScript code samples illustrate patterns but don't constrain them; Go/Python are hinted in globs, so the guidance is intended to span languages.
**Reason**: The core guidance — bounded-context ownership, database-per-service, idempotent consumers, circuit breakers, OpenTelemetry propagation, saga vs 2PC, outbox pattern — is universally applicable microservices architecture knowledge. The directory scaffold and Docker snippets are opinionated but widely reusable.
**Trigger**: Any task involving adding a new service, designing inter-service communication (REST/gRPC/events), implementing resilience patterns, wiring up observability, or reviewing microservices architecture decisions.
**Steps/contract**: Not a procedural SOP — standing ruleset. Sections: Service Design Principles → Service Structure (directory scaffold) → API Design Between Services → Async Event-Driven Communication → Resilience → Docker Patterns → Service Discovery & Configuration → Observability (three pillars) → Data Consistency → Testing Microservices → Security Between Services → Common Mistakes to Avoid (anti-pattern list).
**Strip**: Cursor frontmatter (`alwaysApply`, `globs`); project-context paragraph ("You are building a microservices-based system…") — persona-framing, not guidance; "Cursor Rules" subtitle in H1.
**Structure/format**: Strong. H2 sections, bullet rules, inline TypeScript/Dockerfile/JSON code samples per pattern. Anti-pattern section ("Common Mistakes to Avoid") doubles as a quick-reference checklist. Well-suited to promotion as a skill with minimal restructuring.
**Notes**: Broad but coherent — one of the more complete architecture files in the repo. Standout gem: the explicit anti-pattern "DON'T build microservices for a new project — start modular monolith, split later." Some sections (Docker, Testing, Security) overlap with dedicated rules; consider scoping the skill to communication/resilience/observability and cross-referencing the others, or keep as an omnibus microservices skill. Good candidate for a `microservices-architecture` skill with a broad trigger.

## rules/typescript-strict/rule.mdc
**Type**: Coding standard / style guide — strict TypeScript configuration and patterns reference  
**Portable**: Yes — language-level rules, zero project-specific coupling; applies to any TypeScript codebase  
**Reason**: Comprehensive, opinionated, and self-contained TypeScript strictness guide covering tsconfig settings, `any`-avoidance, type narrowing, generics, exhaustive checks, error handling, and common pitfalls. High signal density, real code examples throughout.  
**Trigger**: Activated when writing or reviewing `.ts`/`.tsx` files; suitable as a standing rule for any TypeScript project  
**Steps/contract**: Not a step-by-step workflow — declarative list of rules and patterns; structured as named sections covering each concern (no-any, generics, enums, error handling, etc.)  
**Strip**: Remove Cursor-specific frontmatter (`alwaysApply`, `globs`); the two redundant `#`-level title lines at the top can be collapsed to one; "Project Context" framing paragraph can be trimmed — the rules stand without the preamble  
**Structure/format**: Well-structured: H1 sections, fenced code blocks with annotated examples, bullet lists for guidance; easily converted to a SKILL.md rule block  
**Notes**: The "Common Mistakes to Avoid" section uses negative framing ("DON'T") — per learned preferences these should be rewritten as positive instructions when promoted (e.g., "Use `unknown`" instead of "DON'T use `any`"). No overlap detected with existing skills; would complement `tdd` and `claude-api` skills. Strong promotion candidate.

## rules/devops-infrastructure/rule.mdc
**Type**: Reference cheatsheet / opinionated standards doc — covers Terraform, Docker, GitHub Actions CI/CD, Kubernetes, monitoring, secret management, DR, and security in one file.
**Portable**: Partially — the principles (multi-stage builds, pinned tags, resource limits, Four Golden Signals alerts, least-privilege IAM, secrets manager) are fully portable; the AWS-specific details (S3+DynamoDB state, CloudWatch, Secrets Manager) and the GitHub Actions YAML skeleton are context-specific.
**Reason**: Covers a wide surface area of battle-tested infra practices that are universally applicable across cloud-native projects; the "Common Mistakes" list is particularly high-signal.
**Trigger**: Any task touching `.tf`, `.yml`/`.yaml`, or `Dockerfile`; user asks about infra-as-code, CI/CD pipelines, containerisation, K8s deployment, or secret management.
**Steps/contract**: No procedural SOP steps — this is a standards reference. Key contracts: tag all resources; use remote state with locking; pin image tags; define resource requests+limits; never store secrets in state or VCS; use environment approval gates for prod deploys.
**Strip**: AWS-specific module tree (`S3+DynamoDB`, `CloudWatch`, `Secrets Manager` brand names), the GitHub Actions YAML boilerplate (too implementation-specific to survive a rewrite), and the Terraform `t3.*` validation example (too narrow). The "Project Context" backstory preamble should be removed.
**Structure/format**: Long single-file rule with H1/H2 headings per domain, bullet lists, and inline code blocks. Good density per section; could be split into per-domain skills (terraform, docker, ci-cd, k8s, monitoring) for more targeted triggering.
**Notes**: High-value candidate for a `devops-standards` SOP. Priority extractions: (1) secret hygiene rules, (2) Docker best-practice checklist, (3) K8s resource/probe contract, (4) Four Golden Signals alert thresholds, (5) DR/RTO-RPO mandate. Would complement an existing `audit-security` skill well.

## rules/aws-serverless/rule.mdc
**Type**: Comprehensive AWS Serverless reference rule — covers Lambda handler design, SAM/CloudFormation templates, DynamoDB schema design, API Gateway, error handling, structured logging/tracing (Powertools), testing, file structure, security, and performance. TypeScript-first with AWS SDK v3.
**Portable**: Partially — highly portable within the AWS serverless TypeScript ecosystem. Core patterns (thin handlers, module-scope SDK init, single-table DynamoDB design, least-privilege IAM, DLQ for async, structured logging) are battle-tested best practices that travel across projects. Tooling choices (SAM, Vitest, Powertools, esbuild) are opinionated but de-facto standard for this stack.
**Reason**: The architectural principles are universally applicable to any AWS serverless project: thin-handler pattern, access-pattern-first DynamoDB design, centralised error mapping to HTTP status codes, never-log-PII, SDK clients outside the handler. File structure and naming conventions are widely adopted. High signal-to-noise ratio.
**Trigger**: Any task involving AWS Lambda functions, SAM/CDK templates (`template.yaml`, `serverless.yml`), DynamoDB table or query design, API Gateway configuration, or AWS SDK v3 usage in TypeScript.
**Steps/contract**: Not procedural — structured as a standing ruleset. Sections: Code Style → Lambda Handler Design → DynamoDB → SAM Template Design → API Gateway → Error Handling → Logging and Monitoring → Testing → File Structure → Security → Performance. Each section has bullet rules; key sections include TypeScript code snippets and a canonical file-tree.
**Strip**: Cursor frontmatter (`description`, `alwaysApply`, `globs`); persona line ("You are an expert AWS developer…"); " — Cursor Rules" suffix in H1 title.
**Structure/format**: Strong. Clear H2 sections, bullet rules with inline code, TypeScript snippets for response format/error interface/SAM globals, and a file-tree diagram. Minimal restructuring needed for skill promotion.
**Notes**: One of the densest and most complete rules in the repo. The DynamoDB section is a mini-guide in itself (single-table design, GSI guidance, optimistic locking, TTL). Excellent candidate for an `aws-serverless` skill. Consider splitting DynamoDB into a standalone `dynamodb-design` sub-skill if granularity is needed. The file structure tree and `ErrorResponse` interface are especially high-value portable artifacts.

## rules/devops-docker/rule.mdc
**Type**: Reference ruleset / standing rules — comprehensive Docker and containerization guide covering multi-stage builds, layer ordering, image size optimization, .dockerignore, security hardening, Docker Compose patterns, environment variable handling, networking, health checks, development workflow, and production considerations.
**Portable**: Yes — highly portable. Core principles (non-root user, multi-stage builds, pin image tags, health checks on every service, log to stdout/stderr, handle SIGTERM) are universally applicable. Node.js and Python code samples are illustrative, not prescriptive; any stack can substitute its own build tooling.
**Reason**: The guidance covers durable Docker fundamentals that hold across any language or project. The explicit layer-ordering rule (base image → system deps → create user → copy manifests → install deps → copy source → build → runtime config) is unusually concrete and rarely articulated this clearly. The Common Pitfalls list captures the most common failure modes regardless of stack.
**Trigger**: Any task touching a Dockerfile, docker-compose.yml, CI/CD container steps, or production deployment configuration; also fires when reviewing images for size, security, or health-check coverage. Aligns with the existing `globs: "**/Dockerfile,**/*.yml,**/*.yaml"`.
**Steps/contract**: Not a procedural SOP — structured as a standing ruleset. Sections: Multi-Stage Build Patterns (Node + Python examples) → Dockerfile Rules (Layer Ordering, Image Size, .dockerignore, Security) → Docker Compose (dev setup, best practices) → Container Runtime (env vars, networking, health checks) → Development Workflow (CLI cheatsheet) → Production Considerations → Common Pitfalls.
**Strip**: Cursor-specific frontmatter (`alwaysApply`, `globs`); "Project Context" paragraph and "Tech Stack" section (repo-scoped framing listing specific registries and orchestrators); "Cursor Rules" subtitle in H1. The dev-workflow `bash` block can be condensed to a compact reference snippet.
**Structure/format**: Strong. Hierarchical H2/H3 sections, each with bullet rules followed by fenced code examples. The numbered Layer Ordering list and Common Pitfalls prose list are especially reusable. Well-suited for direct promotion to a skill with light front-matter cleanup.
**Notes**: Solid candidate for a `devops-docker` skill. The multi-stage build examples (both Node and Python) are high-quality reference implementations worth preserving verbatim. The health-check section (HTTP probe, `pg_isready`, `redis-cli ping`) provides practical copy-paste patterns. Standout gem: the SIGTERM pitfall note ("container takes 10s to stop instead of shutting down gracefully") is precise and actionable. Minor gap: no guidance on BuildKit cache mounts (`--mount=type=cache`) for faster CI builds, but not a blocker for promotion.

## rules/go-production/rule.mdc
**Type**: Comprehensive Go coding standards rule — error handling, interface design, concurrency, HTTP handlers, struct design, testing, configuration, logging, database access, and common anti-patterns.
**Portable**: Yes — highly portable to any Go 1.21+ project using standard library conventions.
**Reason**: All guidance is grounded in Go idioms and the standard library rather than any particular framework or product. The patterns (explicit error wrapping with `%w`, `errors.Is`/`As`, `errgroup`, context propagation, small interfaces, table-driven tests, `slog`) are universally applicable across CLI tools, HTTP services, and background workers.
**Trigger**: Any task writing or reviewing Go code; especially when touching error handling, concurrency, HTTP handlers, database access, configuration parsing, or structured logging.
**Steps/contract**: Not a procedural SOP — a standing multi-section ruleset. Sections: Project Structure → Error Handling → Interface Design → Concurrency Patterns → HTTP Handler Patterns → Struct Design → Testing → Configuration → Logging → Database Access → Common Mistakes. Each section provides affirmative rules, concrete code examples, and explicit DON'T anti-patterns.
**Strip**: Cursor-specific frontmatter (`alwaysApply`, `globs: **/*.go`); "# Go Production — Cursor Rules" H1 label; "Project Context" paragraph ("You are writing production Go code…") — role-framing noise. The directory tree under "Project Structure" may also be stripped or made optional if the target repo has a different layout.
**Structure/format**: Strong. Flat H1 with H2-style comment-block sections, each containing bulleted rules and fenced Go code snippets. Anti-patterns grouped at the end of each section and in a final "Common Mistakes" consolidation. Clean, copy-paste friendly. Minimal restructuring needed for promotion to a skill.
**Notes**: One of the most complete language-specific files in the repo. Excellent candidate for a `go-production` or `go-standards` skill. The project-structure tree is opinionated (cmd/internal/pkg/migrations/api layout) — consider making it advisory rather than normative so the skill doesn't conflict with repos that follow a different layout. The testing section pairs naturally with the existing `tdd` skill; could cross-reference rather than duplicate.

## rules/nextjs/rule.mdc
**Type**: Coding standards / architecture guide — comprehensive style, structure, and best-practice rules for Next.js 14+ App Router with TypeScript.
**Portable**: Partially. The TypeScript style conventions (no `any`, named exports, import order, `interface` vs `type`) and error-handling patterns (`{ success, data?, error? }` return shape, server-side logging) are universally portable. The Next.js-specific sections (App Router, RSC, Server Actions, `next/image`, `next/font`, etc.) are framework-locked and not portable as-is, but could seed framework-agnostic SOPs on "server/client boundary discipline" and "data-fetching hygiene".
**Reason**: Most content is tightly coupled to Next.js 14 App Router idioms. Portable sub-sections exist but would need extraction and generalisation to be reusable outside this stack.
**Trigger**: File globs `**/*.tsx`, `**/*.jsx`, `**/app/**` — auto-activates on any Next.js/React file open. Not always-on.
**Steps/contract**: No explicit step sequence; structured as categorical rules organised by topic (Code Style → Architecture → Data Fetching → RSC → Error Handling → Performance → Testing → File Structure → Security). Reads more as a reference standard than a runnable SOP.
**Strip**: The file-structure diagram (project-specific scaffold), the `next/image`/`next/font`/`next/dynamic` performance rules (framework-locked), the App Router file conventions (`page.tsx`, `layout.tsx`, etc.), and the RSC boundary rules. These cannot transfer outside Next.js.
**Structure/format**: MDC frontmatter + Markdown headings with bullet-point rules per topic. Well-organised, scannable. The file-structure code block is a useful pattern but embeds project layout assumptions.
**Notes**: Strong portable candidates for extraction: (1) TypeScript strictness rules (no `any`, `unknown` + narrowing, `type` for imports, `interface` vs `type` split) → could promote to a general `typescript-style` SOP; (2) Server Action error shape (`{ success, data?, error? }`) → maps to a general "structured error return" pattern; (3) Zod input validation for all mutations → portable to any server-side handler; (4) Parallel data fetching with `Promise.all` → framework-agnostic. Testing section (Vitest + RTL + Playwright, colocate tests) is largely portable.

## rules/react/rule.mdc
**Type**: Coding standards / style guide — React 18+ with TypeScript, covering component patterns, hooks, state management, TypeScript patterns, error handling, performance, accessibility, testing, file structure, and security.
**Portable**: Partially — the React/TypeScript rules are broadly portable across any React 18+ project; library-specific recommendations (Zustand, Jotai, TanStack Query, Vitest, MSW, DOMPurify) are opinionated but named as preferences, not mandates.
**Reason**: Covers a large surface area with clear, actionable rules per domain (hooks, state, a11y, perf, testing, security). Rules are specific enough to be enforceable and avoid vague guidance. Several subsections (accessibility, error handling, security) would stand alone as independent SOPs.
**Trigger**: Any `.tsx` or `.jsx` file; React component authoring, hook authoring, form handling, state management, performance optimisation, or accessibility work in a React TypeScript project.
**Steps/contract**: Not a procedural SOP — this is a standing-rules document (always-on coding standards). It groups rules into eight thematic sections. No explicit pass/fail criteria but rules are prescriptive enough to use as a checklist.
**Strip**: Cursor-specific frontmatter (`alwaysApply`, `globs`). Library brand names could be generalised (e.g. "atomic state library (e.g. Zustand, Jotai)" instead of naming one). File-structure section is illustrative and project-dependent — strip or mark as example-only.
**Structure/format**: Markdown with section headers and bullet-point rules. Well-organised; each section is independently readable. Code snippets are used sparingly and effectively. Could be split into focused sub-skills (hooks, a11y, perf, testing) for targeted loading.
**Notes**: Strong candidate for a `react-standards` skill or set of sub-skills. The accessibility and testing sections in particular are thorough and portable. The state-management section's library opinionation (Zustand > Redux) is a valid preference but should be flagged as a recommendation, not a hard rule, when porting.

## rules/langchain-ai/rule.mdc
**Type**: Framework-specific coding rules — comprehensive LangChain/LangGraph/Python LLM application development guidelines spanning code style, LCEL, prompt engineering, structured output, RAG, agents/tools, LangGraph, memory, error handling, evaluation, testing, file structure, security, and performance/cost.
**Portable**: Conditionally portable — LangChain/LangGraph-specific machinery is framework-locked, but multiple sections (Prompt Engineering, RAG principles, Agents/Tools design, Memory strategy, Error Handling, Evaluation, Security, Performance) contain transferable LLM-application principles applicable across any framework (LlamaIndex, direct SDK calls, etc.).
**Reason**: The high-value portable content is the *reasoning behind* the rules: async for I/O-bound LLM calls, Pydantic for type-safe responses, prompt versioning, RAG pipeline stages (retrieve → format → generate), tool description quality directly affecting selection accuracy, iteration limits to prevent infinite loops, token-aware truncation, LLM-as-judge evaluation, and cost-aware model routing. These hold regardless of framework.
**Trigger**: Any task building LLM-powered Python applications with LangChain or LangGraph; secondary trigger for any Python LLM app needing guidance on prompt engineering, RAG pipelines, agent/tool design, memory management, or LLM observability.
**Steps/contract**: Standing ruleset, not procedural. Sections: Code Style → LCEL composition → Prompt Engineering → Structured Output (Pydantic + `.with_structured_output()`) → RAG pipeline → Agents and Tools → LangGraph stateful graphs → Memory and Conversation → Error Handling → Evaluation and Testing → File Structure → Security → Performance and Cost. Each section is bullet rules + inline code examples.
**Strip**: Cursor frontmatter (`alwaysApply`, `globs`); persona paragraph ("You are an expert AI application developer…"); "Cursor Rules" subtitle in H1; the opinionated `src/` file-structure diagram (project-specific layout); LangSmith-specific references (generalise to "LLM observability/tracing platform").
**Structure/format**: Very strong. H2 sections with bulleted rules and concrete Python code snippets. Code examples are idiomatic and illustrative without being excessive. The File Structure section is a bonus reference diagram. Minimal restructuring needed for promotion to a skill; primarily remove Cursor framing and soften framework-locked code examples to show intent rather than exact API.
**Notes**: One of the most thorough framework-specific files in the repo. Best promoted as a `langchain-dev` skill for Python LLM projects. Additionally worth extracting a framework-agnostic `llm-app-patterns` skill from the portable sections (Prompt Engineering, RAG, Agents, Memory, Error Handling, Evaluation, Security, Performance) — these would be high-value for any LLM application regardless of framework. The LangGraph section in particular is a rare, detailed reference for stateful agent graph design.

## rules/python-modern/rule.mdc
**Type**: Reference rule / Python coding standard — comprehensive Python 3.12+ patterns covering type hints, dataclasses, match statements, async, exceptions, comprehensions, file I/O, naming, testing, and tooling.
**Portable**: Yes — highly portable to any Python 3.10+ project; guidance is language-standard and tooling choices (ruff, mypy, pytest, pyproject.toml) are the current Python-ecosystem consensus.
**Reason**: Covers the full breadth of modern Python best practices in one document. Rules map directly to language-version features (3.10+ union syntax, 3.11+ TaskGroup/timeout/exception groups, 3.12+ `type` statement), keeping them precise and verifiable. The anti-pattern "DON'T" lists prevent the most common Python footguns.
**Trigger**: Any task involving writing, reviewing, or refactoring Python code (`.py` files); especially when adding type annotations, async I/O, data modeling, or setting up tooling.
**Steps/contract**: Not procedural — structured as a standing coding standard. Sections: Type Hints → Dataclass Patterns → Match Statements → Exception Handling → Async Patterns → String Formatting → Comprehensions/Generators → File/Path Operations → Project Standards → Naming Conventions → Testing → Common Mistakes. Each section has prescriptive rules and inline code examples.
**Strip**: Cursor frontmatter (`alwaysApply`, `globs`); "Cursor Rules" label in H1; project-context paragraph ("You are writing modern Python 3.12+…") — frame it as rules, not a persona.
**Structure/format**: Strong. Hierarchical H2 sections, each with bullet rules and illustrative code blocks. DON'T items are visually separated and scannable. Testing coverage targets (95%+ business logic, 100% utilities, 80%+ integration) are concrete and actionable. Ready for promotion with minimal restructuring.
**Notes**: Solid candidate for a `python-modern` or `python-standards` skill. The version-pinned feature table (3.10/3.11/3.12) is a strength — it makes the rules auditable and scoped. Consider a brief version-requirement callout in the skill trigger description so it only fires on Python 3.10+ projects.

## rules/rust-production/rule.mdc
**Type**: Comprehensive coding-standards reference rule — covers Rust error handling, ownership/borrowing, struct/type design, trait patterns, async (Tokio), concurrency, iterators, API design, testing, Cargo.toml best practices, logging/observability, and common pitfalls.
**Portable**: Yes — fully portable within any production Rust project. All guidance is Rust-specific but crate-opinionated choices (thiserror, anyhow, tokio, serde, tracing, rayon, mockall, proptest) represent broad Rust community consensus, not repo-specific decisions.
**Reason**: Covers the full breadth of production Rust coding patterns in one authoritative document. Core principles — make invalid states unrepresentable, parse don't validate, never `.unwrap()` in production, prefer borrowing over owning — are well-established idioms applicable across any production Rust codebase.
**Trigger**: Any Rust code authoring or review task; especially error handling, async/concurrent code, shared state across threads, API type design, unsafe blocks, or Cargo.toml dependency configuration.
**Steps/contract**: Not a procedural SOP — structured as a standing ruleset. Sections: Error Handling → Ownership and Borrowing → Struct and Type Design → Trait Patterns → Async Patterns (Tokio) → Concurrency → Iterator Patterns → API Design → Testing → Cargo.toml Best Practices → Logging and Observability → Common Mistakes to Avoid. Each section has bulleted rules with inline code examples; the closing "Common Mistakes to Avoid" section doubles as a quick-reference anti-pattern checklist.
**Strip**: Cursor-specific frontmatter (`alwaysApply`, `globs`); project-context preamble ("You are writing production Rust code…") — replace with neutral framing in a skill context; the "Cursor Rules" subtitle on the H1.
**Structure/format**: Strong. Twelve thematic sections (H1-level; should be H2 in a skill), each with concise bullets and code snippets. No padding or repetition. Minimal restructuring needed for direct promotion to a skill file.
**Notes**: One of the highest-quality language-specific rules in the repo — purely generic best practice with no repo-specific customisation. Directly promotable to a `rust-production` skill. Consider adding a "Related Skills" reference to `tdd` (for the testing section) and `cot-gate` (for the architecture/API design sections). Could optionally be split into sub-skills (`rust-error-handling`, `rust-async`) but the single-file form is cohesive and preferable unless granularity is explicitly needed.

## rules/ai-ml-python/rule.mdc
**Type**: Reference standard / coding conventions (not a procedural SOP) — covers PyTorch model patterns, data pipelines, training loops, experiment tracking, reproducibility, evaluation, export, and testing.
**Portable**: Partially — the PyTorch patterns, training loop best practices, reproducibility seed function, data pipeline do/don'ts, testing ML code, and "Common Mistakes to Avoid" are highly portable across any PyTorch project. Project structure layout and specific tool choices (wandb) are opinionated/narrow.
**Reason**: Strong signal in several sections that encode hard-won ML engineering discipline: gradient clipping + `set_to_none=True` + AMP in the training loop, the reproducibility `set_seed()` function covering all four required call sites, the data leakage / eval-set contamination warnings, and the ML testing checklist (shape, loss-decrease, edge cases). These are universally applicable and underrepresented in typical guides.
**Trigger**: Writing PyTorch `nn.Module` subclasses, training loops, ML data pipelines, experiment tracking setup, reproducibility scaffolding, or ML project testing in Python.
**Steps/contract**: Not procedural. Organised as do/don't reference standards per domain (model patterns, data pipeline, training, tracking, reproducibility, evaluation, export, testing). No explicit ordered steps.
**Strip**: Opinionated project directory tree (too layout-specific to one org's conventions); verbose ONNX/TorchScript export boilerplate (narrow use case); Pydantic config example (belongs in a general Python config skill); notebook-discipline section (obvious, low signal); specific wandb `init()` call (tool-specific).
**Structure/format**: Long flat reference doc with fenced code snippets per section. Could be distilled into a skill with focused sections: (1) PyTorch module pattern, (2) training loop pattern, (3) reproducibility setup, (4) data pipeline rules, (5) ML testing checklist, (6) common mistakes list.
**Notes**: The "Common Mistakes to Avoid" block at the end is the highest-density section and worth extracting almost verbatim. The `set_seed()` function covers `random`, `numpy`, `torch`, `cuda`, and cudnn — a complete reference worth preserving. The instruction to save train/val/test split definitions (not just seeds) is a non-obvious but critical reproducibility point.

## rules/python-fastapi/rule.mdc
**Type**: Comprehensive coding standards / reference guide for Python FastAPI + Pydantic v2 — covers code style, router design, Pydantic v2 patterns, async I/O, dependency injection, error handling, SQLAlchemy async, testing, file structure, security, and performance.
**Portable**: Conditionally yes — FastAPI/Pydantic v2/SQLAlchemy sections are framework-locked, but all content travels cleanly across any FastAPI project. The async-pattern rules (no blocking I/O in async functions, `asyncio.gather` for concurrent tasks, async DB drivers), dependency injection principles, structured error handling, and security checklist are broadly applicable to any Python async web API.
**Reason**: Deep, opinionated, and internally consistent FastAPI-specific guide. All guidance is grounded in framework idioms rather than any particular product or org. The Pydantic v2 migration notes (`model_validator`, `field_validator`, `model_config`, `model_dump` vs deprecated equivalents) are especially high-value for repos mid-migration from v1. The file-structure scaffold is widely adopted and reusable as-is.
**Trigger**: Any `.py` file in a FastAPI or async Python web service; fires when writing route handlers, Pydantic models, async database access, dependency injection logic, or structuring a new Python API project.
**Steps/contract**: Not procedural — standing ruleset. Sections: Code Style (Python 3.11+ features, type annotations, formatting tools) → FastAPI Patterns (routers, DI, response models, status codes) → Pydantic v2 Models (v2 syntax exclusively, separate input/output models) → Async Patterns (no blocking I/O, `asyncio.gather`, async drivers) → Dependency Injection (`Depends`, yield-based cleanup, `Annotated` signatures) → Error Handling (HTTPException, custom handlers, consistent error shape) → Database/SQLAlchemy Async (2.0 style, `AsyncSession`, Alembic, repository pattern, N+1 avoidance) → Testing (pytest-asyncio, `httpx.AsyncClient` + ASGITransport, factories) → File Structure (canonical `app/` scaffold) → Security (OAuth2 + JWT, bcrypt, CORS, parameterised queries, env secrets) → Performance (connection pooling, Redis caching, pagination, background tasks, streaming responses).
**Strip**: Cursor-specific frontmatter (`alwaysApply`, `globs`); persona opening line ("You are an expert Python developer…"); " — Cursor Rules" suffix in H1. File-structure tree should be marked advisory, not normative.
**Structure/format**: Strong. H2 sections with bullet rules; code snippets used sparingly and only where concrete syntax is non-obvious. The file-structure code block is the densest part and doubles as a scaffold template. Minimal restructuring needed for promotion — primarily front-matter cleanup.
**Notes**: Strong candidate for a `python-fastapi` skill. Coverage spans the full FastAPI development lifecycle in one coherent file. The Pydantic v2 syntax section is a rare and high-value reference that most rules omit. The Security section has some overlap with `rules/security-best-practices/rule.mdc` but is FastAPI-specific (OAuth2 with `python-jose`, `passlib` bcrypt, CORS origin whitelist, pydantic-settings) — keep as part of this skill rather than delegating. Two notable gaps: no guidance on WebSocket patterns or long-running background workers (Celery/ARQ), but not blockers for promotion.

## rules/nodejs-express/rule.mdc
**Type**: Comprehensive reference rule — production-grade Node.js/Express/TypeScript coding standards covering architecture, middleware, validation, error handling, auth, logging, testing, file structure, security, and performance.
**Portable**: Yes — highly portable within the Node.js/Express/TypeScript ecosystem; most sections (layered architecture, error handling, logging, JWT auth, RBAC, Zod validation, Prisma ORM) are widely adopted patterns, not repo-specific.
**Reason**: Covers the full surface area of a production Express API in one document. Patterns like layered architecture (Routes→Controllers→Services→Repositories), typed middleware, global error handler, `AsyncHandler` wrapper, and structured logging are canonical and reusable across any Express project.
**Trigger**: Any task involving Node.js/Express/TypeScript API development — new endpoints, middleware, authentication, database access, error handling, or project scaffolding; also on code review of existing Express services.
**Steps/contract**: Not a procedural SOP — structured as a standing ruleset. Sections: Code Style → Express Architecture → Middleware → Request Validation → Error Handling → TypeScript Patterns → Database (Prisma/TypeORM) → Authentication & Authorization → Logging → Testing → File Structure → Security → Performance. Each section is a bullet list with occasional inline code snippets.
**Strip**: Cursor-specific frontmatter (`alwaysApply`, `globs`); "You are an expert…" persona opener — role-framing that adds no instructional value; the H1 title suffix "— Cursor Rules". The `globs` pattern (`**/*.ts,**/*.js`) is implicit and not needed in a skill.
**Structure/format**: Strong. Well-organised H2 sections with dense, precise bullet rules. The File Structure section includes a labelled directory tree — useful reference artifact to keep. Code snippets are minimal and targeted. Ready for promotion with light restructuring (drop persona intro, drop frontmatter).
**Notes**: Solid, immediately usable skill candidate for a `nodejs-express` or `express-api` skill. Complements `security-best-practices` (overlapping security section could be trimmed to a cross-reference). The testing section is brief compared to `testing-tdd` — keep it as a pointer rather than duplicating. One of the more complete stack-specific files in the repo.

## rules/tailwindcss/rule.mdc
**Type**: Coding-style / component-design guideline — comprehensive Tailwind CSS reference covering class ordering, component patterns, responsive design, colour system, typography, spacing, interactive states, accessibility, performance, and animation.
**Portable**: Yes — all guidance is framework-agnostic at the principle level (utility-first, mobile-first, design tokens, a11y) and directly applicable to any project using Tailwind CSS v3/v4 with React/JSX or plain HTML.
**Reason**: Distils well-established Tailwind best practices into one place; nothing is repo-specific, credentials-free, no org names or paths. The concrete component snippets (Button, Card, Input) are illustrative and reusable verbatim.
**Trigger**: Active whenever working on files matching `**/*.css`, `**/*.tsx`, `**/*.jsx`, `**/*.html` in a Tailwind-enabled project, or when user asks about UI styling, component design, dark mode, accessibility, or responsive layout.
**Steps/contract**: Not a sequential workflow — structured as categorical rules grouped by concern (Code Style → Component Design → Responsive → Colour → Typography → Spacing → Interactive States → Patterns → Config → Accessibility → Performance → Animation). Each section is a set of standing rules, not procedural steps.
**Strip**: Nothing needs stripping; no org-specific content, no placeholder names, no credentials, no internal URLs.
**Structure/format**: Well-structured MDC with YAML frontmatter (`description`, `alwaysApply: false`, `globs`); clear H2 sections; bullet rules with inline code; three concrete HTML snippet examples. Promotion-ready as-is; the frontmatter glob pattern is directly usable in Cursor rules.
**Notes**: High-value candidate. One of the most complete and actionable rules in the set. The class-ordering convention and the dynamic-class-name warning (BAD/GOOD pattern) are particularly worth preserving verbatim. Could be promoted directly to `skills/tailwindcss/SKILL.md` with minor reformatting, or kept as a Cursor rule for auto-loading on relevant file globs.

## rules/mern-stack/rule.mdc
**Type**: Reference rule / stack-specific coding standard — comprehensive guidelines for MongoDB + Express + React + Node.js applications covering naming conventions, project structure, Mongoose patterns, Express controller/validation patterns, React Query API layer, error handling, security, testing, and performance.
**Portable**: Conditionally — the individual patterns and principles (lean queries, centralised error handling, Zod validation, React Query setup, pagination on list endpoints, JWT security practices) are highly portable. The file as a whole is MERN-specific and not framework-agnostic.
**Reason**: Strong portable value lies in the cross-cutting best-practice sections (Error Handling, Security, Performance Guidelines, Common Pitfalls) and the specific patterns (Zod validation middleware, controller shape, React Query mutation invalidation, axios interceptor setup). These generalise beyond MERN. The Mongoose-specific content is only portable to Mongoose users. The project-structure section is opinionated and repo-specific.
**Trigger**: Any file matching `**/*.tsx`, `**/*.jsx`, `**/*.ts`, `**/*.js` in a MERN project; specifically when writing Mongoose models, Express controllers/routes/middleware, React Query hooks, or Zod validation schemas.
**Steps/contract**: Not procedural — a standing ruleset. Sections: Tech Stack → Coding Style → MongoDB/Mongoose Patterns → Express API Patterns → React Frontend Patterns → Error Handling → Security → Testing → Performance Guidelines → Common Pitfalls. Each section pairs rules with concrete TypeScript code examples.
**Strip**: Cursor-specific frontmatter (`alwaysApply`, `globs`); "MERN Stack — Cursor Rules" section headings; project-context paragraph ("You are working on a MERN stack application…"); the monorepo project-structure tree (too opinionated for a portable skill — move to a separate scaffold template if needed).
**Structure/format**: Good. Hierarchical H2/H3 sections with concise bullet rules followed by TypeScript code snippets. Common Pitfalls section is a strong standalone quick-reference. Well-suited for promotion but benefits from splitting: (1) a `mongoose-patterns` skill, (2) an `express-api-patterns` skill reusing the Zod validation + controller + error-handling sections, and (3) extracting the Security and Performance subsections into the existing `security-coding` skill candidate.
**Notes**: The Security section partially overlaps with `rules/security-best-practices/rule.mdc` (helmet, CORS, bcrypt, Zod, JWT). Deduplicate on promotion — keep the canonical security guidance in `security-coding` and have `mern-stack` cross-reference it. The Common Pitfalls section (N+1 queries, missing `lean()`, ObjectId validation, `findByIdAndUpdate` `{ new: true }`) is immediately usable as a linting checklist. Testing section is thin — four bullets, no code; supplement from other sources.

## rules/supabase/rule.mdc
**Type**: Technology-specific coding standards / reference guide (Supabase full-stack dev)
**Portable**: Low — rules are deeply Supabase-coupled (auth.uid(), Edge Functions, Supabase client API, supabase CLI, PgBouncer config). Cannot be abstracted to a generic backend SOP without hollowing out the specificity that makes it useful.
**Reason**: Every section references Supabase-proprietary APIs, CLI commands, or service topology. The value is in the concrete specifics, which are not transferable to non-Supabase stacks.
**Trigger**: globs `**/*.ts,**/*.tsx,**/*.sql`; activates on Supabase project context. Should also require detection of `@supabase/supabase-js` or `supabase/config.toml` to avoid false-positive activation on unrelated TS/SQL files.
**Steps/contract**: Not a workflow SOP — organized as a multi-section reference guide (12 domains: code style, DB design, RLS, auth, querying, edge functions, realtime, storage, migrations, testing, file structure, security, performance). No step ordering or exit criteria.
**Strip**: Persona header ("You are an expert full-stack developer…"); the file-structure example (project-specific scaffolding, not a portable rule); `camelCase`/`snake_case` style rules (linter territory, not a behavioural SOP).
**Structure/format**: Flat reference doc with H2 sections and inline code snippets. Dense but readable. No decision logic, no conditionals, no pass/fail criteria — pure reference.
**Notes**: Three sub-rules are worth extracting as standalone portable invariants regardless of stack: (1) **always enable RLS on every table** — the strongest non-negotiable here; (2) **never expose service-role/admin keys in client-side code** — a universal secret-management principle; (3) **never modify a migration already applied to production — create a new one** — applies to any migration-based DB system. These could seed a `supabase-security` or `db-migration-hygiene` SOP. The rest is valuable Supabase tribal knowledge but not portable.

## rules/react-typescript/rule.mdc
**Type**: Framework coding standards (React + TypeScript)
**Portable**: Partial
**Reason**: TypeScript patterns (discriminated unions, generics, no `any`→`unknown`, explicit return types), naming conventions (PascalCase components, `is`/`has` boolean prefixes, `handle` event prefix), and testing philosophy (behaviour-not-implementation, integration > unit) are stack-agnostic. React hook rules, JSX composition patterns, and React-specific performance advice (memo, virtualization) are not.
**Strip**: React hooks guidance, JSX-specific rules (keys, ternary depth, prop spreading), React performance section (memo, react-window), Error Boundary specifics.
**Notes**: Portable TS patterns overlap heavily with nextjs-typescript/rule.mdc — if promoting to a shared TS style SOP, prefer that file's more concise version. The testing philosophy section is the strongest portable candidate here.

## rules/nextjs-14-app-router/rule.mdc
**Type**: Framework architecture guide (Next.js 14 App Router)
**Portable**: No
**Reason**: Every rule maps directly to a Next.js App Router concept — Server Components, `"use client"` boundaries, Server Actions, `revalidatePath`, `notFound()`, `generateStaticParams`, `loading.tsx`/`error.tsx` file conventions. Nothing generalises outside the Next.js runtime.
**Strip**: Entire file — no extractable SOP content.
**Notes**: Largely duplicated by nextjs-app-router/rule.mdc (same scope, more verbose). If one must be retained as a reference, this shorter version is easier to scan but has less depth.

## rules/nextjs-app-router/rule.mdc
**Type**: Framework architecture guide (Next.js App Router, comprehensive)
**Portable**: No
**Reason**: All substantive content is Next.js-specific: App Router file conventions (`page.tsx`, `layout.tsx`, etc.), RSC/Client Component split rules, Next.js caching layers, Server Actions with `revalidatePath`, middleware, `next/image`, `next/font`, and `next/link`. The Zod validation example is the only broadly applicable snippet, but it's incidental.
**Strip**: Entire file — no extractable SOP content.
**Notes**: Near-superset of nextjs-14-app-router/rule.mdc. The Zod input-validation pattern inside Server Actions is worth noting as a general "validate before processing" principle but doesn't need its own SOP entry.

## rules/nextjs-typescript/rule.mdc
**Type**: Framework coding standards (Next.js + TypeScript)
**Portable**: Partial
**Reason**: The TypeScript style section (import ordering, `type` vs `interface` preference, `type`-only imports, descriptive variable names, no `any`) and the security hygiene section (validate & sanitise all server inputs, never expose secrets in client code, structured logging without stack traces) are fully portable. App Router architecture, Next.js data-fetching, and Next.js performance rules are not.
**Strip**: App Router Architecture section, Data Fetching section, React Server Components section, Performance section (next/image etc.), File Structure diagram.
**Notes**: The security section ("Never expose API keys in client components", "mark server-only modules with `import 'server-only'`", "return structured results not thrown errors") is the strongest portable candidate across all four files reviewed here — worth extracting into a general server-side security SOP.

## rules/flutter-dart/rule.mdc
**Type**: Framework-specific guide (Flutter/Dart)
**Portable**: no
**Reason**: Every section is Flutter-specific — Riverpod state management, GoRouter navigation, Material Design 3, widget architecture (`StatelessWidget`, `const` constructors, `build()` lifecycle), and Dart 3+ language features. No generalizable SOPs survive stripping the framework.
**Strip**: nothing salvageable; mobile security advice (secure storage, HTTPS) is too thin to promote
**Notes**: Rich, well-structured guide but entirely scoped to the Flutter ecosystem; discard entirely for cross-stack SOP use.

## rules/rust-actix/rule.mdc
**Type**: Framework-specific guide (Rust + Actix Web)
**Portable**: partial
**Reason**: The handler→service→repository layered architecture and sealed `AppError` enum with typed variants are framework-agnostic design principles reusable across any Rust web stack.
**Strip**: All `actix_web` imports and APIs (`web::Data`, `web::Path`, `web::Json`, `ResponseError`, `actix_web::test`); Actix-specific route configuration (`ServiceConfig`, `web::scope`); SQLx macros are Rust-specific but not Actix-specific.
**Notes**: Nearly structurally identical to rust-axum in portable concepts; the `From<sqlx::Error>` error conversion and "common pitfalls" (`MutexGuard` across `.await`, blocking runtime) are the most unique portable extracts here.

## rules/rust-axum/rule.mdc
**Type**: Framework-specific guide (Rust + Axum)
**Portable**: partial
**Reason**: The async best-practice rules (`spawn_blocking` for CPU work, `time::timeout` for hanging ops, `tokio::sync::Mutex` over `std::sync::Mutex`) and the `AppError + IntoResponse` pattern are portable across all Tokio-based Rust services.
**Strip**: Axum-specific extractor API (`Json<T>`, `Path<T>`, `State<T>`, `FromRequestParts`), `Router::layer()` / Tower middleware wiring, `axum::test::TestClient`.
**Notes**: Overlaps heavily with rust-actix on architecture; stronger on async patterns and observability (`#[tracing::instrument]`, structured fields). Prefer this over rust-actix for async/tracing SOPs.

## rules/go-gin/rule.mdc
**Type**: Framework-specific guide (Go + Gin)
**Portable**: partial
**Reason**: The Go concurrency idioms section (context propagation as first parameter, `errgroup` for concurrent tasks, never launching goroutines without shutdown paths) and table-driven test pattern are idiomatic Go best practices independent of Gin.
**Strip**: Gin-specific binding tags (`binding:"required"`), `*gin.Context` handler signatures, `gin.H{}` response helpers, `gin.HandlerFunc` middleware type, `gin.SetMode(gin.TestMode)`.
**Notes**: Concurrency section is the most distinctive portable extract not covered by other files. `errors.Is/As` with `%w` wrapping and the `defer tx.Rollback()` transaction idiom are also strong portable Go SOPs.

## rules/svelte-kit/rule.mdc
**Type**: Framework coding standards (Svelte 5 + SvelteKit 2)
**Portable**: Partial
**Reason**: Naming conventions (PascalCase components, camelCase utilities, kebab-case CSS) and error-handling principles ("never expose stack traces", "always provide user-friendly error messages", log to error-tracking service) are framework-agnostic. Everything else — runes, file-based routing, load functions, form actions, `$types` — is SvelteKit-specific.
**Strip**: All Svelte 5 runes syntax, SvelteKit routing/load/action patterns, Vite/Vitest/Playwright specifics, `$lib` alias, performance tips tied to SvelteKit streaming.
**Notes**: Highest-quality of the two SvelteKit rules; covers Svelte 5 exclusively (no Svelte 4 mixing). Portable fragments overlap with general "clean code" conventions already well-covered elsewhere.

## rules/sveltekit/rule.mdc
**Type**: Framework coding standards (SvelteKit 2 + TypeScript)
**Portable**: Partial
**Reason**: Security section has genuinely portable cross-cutting principles: validate all input server-side, use environment variables for secrets, never expose stack traces or internals to clients, sanitise user-generated HTML before rendering. These apply to any server-rendered web app.
**Strip**: All routing, data-loading, hooks, component, store, and testing sections — entirely SvelteKit/Svelte-specific. Also drop the mixed Svelte 4 (`$:`) + Svelte 5 (`$effect`) advice, which is internally inconsistent.
**Notes**: Overlaps heavily with svelte-kit/rule.mdc; weaker on Svelte 5 patterns but stronger on security hygiene. If merging, take security section from this file and Svelte 5 component patterns from the other.

## rules/vue3-composition/rule.mdc
**Type**: Framework coding standards (Vue 3 Composition API + Pinia)
**Portable**: No
**Reason**: The entire document is structured around Vue-specific primitives (`ref`, `reactive`, `computed`, `<script setup>`, `defineProps`, Pinia stores, VueUse composables). The only nominally portable fragments — "test user-visible behaviour over internal state" and "prefer composition over mixins" — are too generic to constitute a meaningful SOP extraction; they add nothing beyond what a general testing or architecture skill already covers.
**Strip**: Everything.
**Notes**: Well-structured and internally consistent rule for Vue 3 projects; no actionable portable SOP content.

## rules/mobile-react-native/rule.mdc
**Type**: Framework coding standards (React Native + Expo SDK 50+)
**Portable**: Partial
**Reason**: Three portable principles worth extracting: (1) store auth tokens in encrypted/secure native storage, never in plaintext key-value stores; (2) use schema-based form validation (Zod pattern) as the default; (3) never block the main/UI thread with heavy computation — offload or defer. These apply broadly to any mobile or client-side app regardless of framework.
**Strip**: All React Native–specific APIs (FlatList, StyleSheet.create, Platform.select, SafeAreaView, Animated/Reanimated), Expo-specific modules, Expo Router navigation patterns, and platform deployment (EAS Build/Submit) content.
**Notes**: Performance section is the most extractable beyond the three flagged items — the principle of memoising list items and avoiding re-creating objects in render is portable to React web as well, but is already covered by React-specific rules elsewhere.

## rules/fullstack-nextjs-prisma/rule.mdc
**Type**: Framework-specific how-to (Next.js 14 App Router + Prisma + Tailwind)
**Portable**: partial
**Reason**: Prisma schema conventions (cuid/uuid PKs, createdAt/updatedAt on every model, @@index on FK/WHERE fields, @@map for snake_case table names), DB singleton pattern, Zod validation at every mutation boundary, auth-check-in-every-action, `select` over `*`, no unbounded result sets, and migration rules (never edit applied migrations) are all stack-agnostic. The Next.js-specific parts (App Router structure, Server Components, Server Actions, `revalidatePath`, `unstable_cache`, `loading.tsx`, Suspense streaming) are not portable.
**Strip**: Project folder layout, App Router file conventions, `revalidatePath`/`unstable_cache` calls, Suspense/streaming SSR, `useFormState`/`useFormStatus`/`useOptimistic` hooks, `vitest-mock-extended` Prisma mock advice.
**Notes**: The Prisma section (schema patterns, singleton, migrations, no $queryRawUnsafe) and the Server Actions security checklist (validate→auth→db→revalidate) are the highest-value extractions. Overlaps with t3-stack on Prisma patterns — consolidate in cross-repo phase.

## rules/supabase-fullstack/rule.mdc
**Type**: Platform-specific how-to (Supabase BaaS — DB, Auth, Storage, Edge Functions, Realtime)
**Portable**: partial
**Reason**: PostgreSQL database design principles (uuid PKs, timestamp columns, explicit FK ON DELETE, text over varchar with CHECK, named indexes/constraints, composite indexes) and the security mandate (never service key on client, parameterized queries, validate input, paginate everything, data-access layer not in UI components) are fully portable. Supabase-specific sections (RLS SQL syntax, `auth.uid()` policies, Edge Functions Deno runtime, Realtime channel subscriptions, Storage bucket policies, `supabase gen types`) are not.
**Strip**: All RLS CREATE POLICY SQL, supabase client API calls (`from().select().eq()`), Edge Function Deno boilerplate, Realtime/Presence/Broadcast section, Storage signed-URL section, `supabase CLI` migration commands, generated `Database` type usage.
**Notes**: The "keep queries in a data access layer, not in UI components" rule and the PostgreSQL design checklist (naming constraints explicitly, composite indexes, text+CHECK over varchar) are high-signal portable SOPs. The distinction between `getUser()` (server-verified) vs `getSession()` (local-storage only) is a good auth hygiene principle to extract generically.

## rules/saas-starter/rule.mdc
**Type**: Architecture patterns (multi-tenant SaaS — auth, billing, RBAC, tenancy, email)
**Portable**: portable
**Reason**: Virtually the entire file describes stack-agnostic SaaS architecture: shared-DB tenancy via organizationId on every scoped table, RBAC defined at the membership level not the user level, Stripe webhook sync instead of API polling, subscription tier enforcement at the service layer, time-limited invitation tokens, async email queuing, soft-delete for compliance, and the security checklist. These patterns apply regardless of ORM, framework, or language.
**Strip**: The specific Prisma/TypeScript syntax in code examples (can be made generic), subdomain tenancy caveat specific to branding use cases (minor). Nothing of substance needs stripping.
**Notes**: Highest-value file in this batch. The security checklist (tenant scoping, server-side permission checks, Stripe webhook signature verification, audit logging) is directly promotable as a reusable SaaS security policy. The PLAN_LIMITS pattern and the PlanLimitError service-layer enforcement are strong canonical examples. The invitation schema and edge-case list (expired, already-member, non-existent email) are also reusable.

## rules/t3-stack/rule.mdc
**Type**: Framework-specific how-to (T3 Stack — Next.js + tRPC + Prisma + NextAuth)
**Portable**: partial
**Reason**: The tRPC patterns (router definition, context, `protectedProcedure`, `superjson` transformer, `useUtils().invalidate()`) are specific to tRPC and not portable. However, several high-value principles are stack-agnostic: ownership checks beyond authentication ("checking auth is not enough"), cursor-based pagination rationale over offset, never return full DB objects with sensitive fields to the client, and the error code taxonomy (NOT_FOUND/UNAUTHORIZED/FORBIDDEN/BAD_REQUEST as the canonical four). Prisma patterns duplicate fullstack-nextjs-prisma.
**Strip**: All tRPC boilerplate (router, context, middleware setup, superjson, `useInfiniteQuery`, `useMutation`, `useUtils`), NextAuth Prisma adapter specifics, React Query `staleTime` guidance, client provider wrapping in root layout. The entire tRPC Patterns section.
**Notes**: The "ownership check ≠ authentication check" principle is the single most portable SOP here and should be extracted as a standalone security rule. The cursor vs offset pagination rationale (slow on large offsets) is a good DB performance principle. Overlaps with fullstack-nextjs-prisma on Prisma — consolidate in cross-repo phase.

## rules/tailwind-ui/rule.mdc
**Type**: Style/UI  **Portable**: Yes  **Reason**: Pure Tailwind CSS best practices — class ordering, component patterns, responsive design, a11y, and performance apply universally to any Tailwind project with no repo-specific references.  **Strip**: Nothing; config JS snippets are illustrative, not project-specific.  **Notes**: Well-structured across 10 concerns (code style → animation). Covers Tailwind v3 token conventions, dark mode, WCAG contrast ratios, and PurgeCSS class-name safety. Directly promotable as a frontend-style SOP.

## rules/chrome-extension/rule.mdc
**Type**: Platform/Domain  **Portable**: Partial  **Reason**: Rules are high-quality and internally complete, but the entire skill is Chrome Extension MV3-specific — service worker lifecycle, `chrome.*` APIs, and manifest structure have no analogue outside that platform.  **Strip**: Nothing to strip; the domain boundary *is* the content.  **Notes**: Excellent MV3 patterns (event-driven SW, storage tiers, typed message protocol, Shadow DOM isolation). Worth keeping as a specialized SOP for any Chrome extension project, but cannot be generalised beyond that context.

## rules/docker-devops/rule.mdc
**Type**: Infrastructure  **Portable**: Yes  **Reason**: Dockerfile layering, Docker Compose design, CI/CD stage order, container security, and Twelve-Factor env management are broadly applicable to any containerised project regardless of cloud or language.  **Strip**: AWS/ECS-specific Terraform module tree in the file-structure example; minor — the principles are cloud-agnostic even if the example isn't.  **Notes**: Covers the full DevOps surface (image build → IaC → observability). GitHub Actions section is GH-specific but ubiquitous enough to keep. Strong candidate for a portable container/DevOps SOP with a one-line note that the IaC example targets AWS.

## rules/golang-api/rule.mdc
**Type**: Language-specific API coding standard (Go)
**Portable**: partial
**Reason**: The layered architecture (handler → service → store), "define interfaces where used", error-wrapping-with-context, and security checklist (parameterized SQL, input validation at handler layer, never log secrets) are language-agnostic principles; the Go syntax, stdlib references, and goroutine/channel guidance are not.
**Strip**: All Go-specific code blocks, stdlib package names, concurrency primitives (sync.Pool, errgroup, etc.), and performance tips tied to Go's runtime.
**Notes**: Strongest portable extracts are the error hierarchy pattern (sentinel errors + wrap with context), the "interfaces small — one or two methods" rule, and the security checklist. Table-driven test structure is a portable testing philosophy even if the syntax is Go.

## rules/nodejs-express-typescript/rule.mdc
**Type**: Language-specific API coding standard (Node/Express/TypeScript)
**Portable**: partial
**Reason**: The controller → service → repository separation, custom AppError hierarchy mapped to HTTP status codes, centralized error middleware registered last, asyncHandler wrapper, and env-var validation-at-startup pattern are all broadly applicable; Express middleware ordering, TypeScript generics, and pino/morgan are framework-specific.
**Strip**: TypeScript type annotations and tsconfig settings, Express-specific `RequestHandler` generics, and Node-specific graceful-shutdown signal handling.
**Notes**: The "services throw domain errors, controllers map to HTTP" principle is the strongest portable extract. The "fail fast on missing env vars" rule and "never return different response shapes across endpoints" are both clean portable policies. Overlaps architecturally with golang-api (same layered pattern, different language).

## rules/django-rest/rule.mdc
**Type**: Language-specific API coding standard (Python/Django REST Framework)
**Portable**: partial
**Reason**: The service-layer pattern (business logic out of views and models), separate read/write serializers, "filter querysets by authenticated user — never trust URL params alone", and transaction.atomic for multi-step writes are solid portable principles; ViewSet/serializer/ORM syntax is Django-specific.
**Strip**: All DRF-specific code (ViewSet, ModelSerializer, @action, django-filter, drf-spectacular), Django ORM query syntax, and Celery/signal references.
**Notes**: Heavy overlap with python-django — both cover DRF serializers, pytest-django, and N+1 prevention. If promoting, these two should be consolidated rather than kept separate. The security rule "always set permission_classes — never leave views open" is a clean portable policy.

## rules/python-django/rule.mdc
**Type**: Language-specific framework coding standard (Python/Django 5+)
**Portable**: partial
**Reason**: Model-design conventions (TimeStamped base class, UUIDField for public-facing PKs, TextChoices enums, Meta constraints), ORM discipline (F/Q objects, bulk_create/bulk_update, never unbounded querysets), and the security checklist (SECRET_KEY in env, ALLOWED_HOSTS explicit, no internal tracebacks in responses) contain portable policy; Django ORM syntax and DRF-specific patterns do not.
**Strip**: All Django/DRF-specific code, ORM method chains, URL routing patterns, and signal/admin references.
**Notes**: Significantly overlaps with django-rest in scope (both cover DRF ViewSets, serializers, pytest-django, N+1 prevention). The unique portable value here is the model-design layer: timestamped base, UUID PKs, and Meta constraints as a pattern applies beyond Django. Should be merged with django-rest if either is promoted.
