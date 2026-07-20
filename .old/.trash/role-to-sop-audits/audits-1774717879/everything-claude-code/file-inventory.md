# File Inventory — everything-claude-code

Scanned: `/Users/mia/.agents/.worktrees/role-to-sop/.references/everything-claude-code`

---

## Top-level instruction files

CLAUDE.md | prompt | Project-level guidance to Claude Code: architecture overview, build commands, and install/test workflow.
AGENTS.md | prompt | Cross-tool entry-point (AGENTS.md convention): core principles, full agent dispatch table, and hook system overview for the ECC plugin.
the-shortform-guide.md | sop | Practitioner guide for setting up and operating ECC: skills, hooks, subagents, MCPs, and plugins.
the-longform-guide.md | sop | Advanced operator guide covering context management, loop patterns, session persistence, and quality-gate techniques.
the-security-guide.md | sop | Agentic security guide: prompt-injection threat model, attack surfaces, CVE analysis, and hardening patterns for autonomous agent setups.

---

## Agent definitions — `agents/`

agents/planner.md | agent | Planning specialist: decomposes features into step-by-step implementation plans before any code is written.
agents/architect.md | agent | Architecture specialist: evaluates trade-offs and recommends patterns for scalable system design.
agents/tdd-guide.md | agent | TDD specialist: enforces write-tests-first Red-Green-Refactor cycle with 80 %+ coverage gate.
agents/code-reviewer.md | agent | Code-quality reviewer: checks maintainability, correctness, and style after every write.
agents/security-reviewer.md | agent | Security reviewer: detects OWASP Top 10, secrets, SSRF, and injection before commits reach production.
agents/build-error-resolver.md | agent | Build-error resolver: diagnoses and fixes compile/type errors when builds fail.
agents/e2e-runner.md | agent | E2E test runner: generates, maintains, and executes Playwright tests with artifact management and flaky-test quarantine.
agents/refactor-cleaner.md | agent | Dead-code cleaner: runs analysis tools (knip, depcheck) and safely removes unused exports and duplicates.
agents/doc-updater.md | agent | Documentation specialist: keeps codemaps and READMEs current with the codebase.
agents/docs-lookup.md | agent | Documentation lookup: answers library/API questions using live Context7 MCP docs with prompt-injection resistance.
agents/harness-optimizer.md | agent | Harness optimizer: improves agent configuration for reliability, cost, and throughput without touching product code.
agents/loop-operator.md | agent | Loop operator: runs autonomous loops safely with stop conditions, observability, and recovery actions.
agents/chief-of-staff.md | agent | Communication chief of staff: triages multi-channel messages (email/Slack/LINE), classifies into 4-tier urgency, drafts replies, and enforces follow-through.
agents/cpp-reviewer.md | agent | C++ code reviewer: checks correctness, memory safety, and style in C++ projects.
agents/cpp-build-resolver.md | agent | C++ build-error resolver: diagnoses and fixes C++ compilation failures.
agents/database-reviewer.md | agent | Database reviewer: audits schema design, query safety, and migration correctness.
agents/flutter-reviewer.md | agent | Flutter/Dart code reviewer: checks widget patterns, null safety, and performance in Flutter projects.
agents/go-reviewer.md | agent | Go code reviewer: enforces idiomatic Go patterns and concurrency safety.
agents/go-build-resolver.md | agent | Go build-error resolver: diagnoses and fixes Go compilation and module errors.
agents/java-reviewer.md | agent | Java code reviewer: checks design patterns, exception handling, and Spring idioms.
agents/java-build-resolver.md | agent | Java build-error resolver: diagnoses and fixes Maven/Gradle build failures.
agents/kotlin-reviewer.md | agent | Kotlin code reviewer: checks coroutine usage, null safety, and idiomatic Kotlin patterns.
agents/kotlin-build-resolver.md | agent | Kotlin build-error resolver: diagnoses and fixes Kotlin/Gradle build failures.
agents/python-reviewer.md | agent | Python code reviewer: checks type hints, PEP 8, and async patterns.
agents/pytorch-build-resolver.md | agent | PyTorch build-error resolver: diagnoses and fixes PyTorch/CUDA environment failures.
agents/rust-reviewer.md | agent | Rust code reviewer: checks ownership, lifetimes, and idiomatic Rust patterns.
agents/rust-build-resolver.md | agent | Rust build-error resolver: diagnoses and fixes Cargo/borrow-checker errors.
agents/typescript-reviewer.md | agent | TypeScript code reviewer: checks type correctness, strict-mode compliance, and TS-specific anti-patterns.

---

## Common rules — `rules/common/`

rules/common/agents.md | rule | Agent dispatch table and delegation protocol: when to invoke each specialist subagent and how to pass context.
rules/common/development-workflow.md | rule | Feature implementation pipeline: mandatory research-before-coding, planning, TDD, code review, then commit — in that order.
rules/common/git-workflow.md | rule | Commit message format (conventional commits), PR workflow, and attribution settings.
rules/common/coding-style.md | rule | Immutability mandate, functional patterns, file-size limits, and error-handling conventions.
rules/common/testing.md | rule | 80 %+ coverage gate, required test types (unit/integration/E2E), and TDD enforcement.
rules/common/security.md | rule | Pre-commit security checklist: no hardcoded secrets, validated inputs, SQL/XSS/CSRF prevention, and security-response protocol.
rules/common/patterns.md | rule | Skeleton-project-first pattern, parallel-agent evaluation, and repository/API-response conventions.
rules/common/performance.md | rule | Model-routing heuristic (Haiku vs Sonnet vs Opus by task cost), caching strategies, and latency targets.
rules/common/hooks.md | rule | Hook system usage policy: PreToolUse/PostToolUse/Stop hook types, auto-accept permissions guidance, and safety constraints.

---

## Language-specific rules — `rules/<lang>/`

rules/typescript/coding-style.md | rule | TypeScript-specific immutability, typing, and style conventions.
rules/typescript/testing.md | rule | TypeScript testing patterns and framework configuration (Jest/Vitest).
rules/typescript/security.md | rule | TypeScript/Node.js security patterns: input validation, JWT handling, and dependency hygiene.
rules/typescript/patterns.md | rule | TypeScript design patterns: repository pattern, dependency injection, and module organisation.
rules/typescript/hooks.md | rule | PostToolUse hooks for TypeScript: auto-format and type-check triggers on file edit.
rules/golang/coding-style.md | rule | Go coding style: idiomatic patterns, error wrapping, and package organisation.
rules/golang/testing.md | rule | Go testing conventions: table-driven tests, benchmark patterns, and coverage requirements.
rules/golang/security.md | rule | Go security practices: input validation, crypto library usage, and HTTP server hardening.
rules/golang/patterns.md | rule | Go design patterns: interface composition, context propagation, and concurrency patterns.
rules/golang/hooks.md | rule | PostToolUse hooks for Go: gofmt and vet triggers on file edit.
rules/python/coding-style.md | rule | Python style: PEP 8, type hints, and dataclass/Pydantic conventions.
rules/python/testing.md | rule | Python testing with pytest: fixtures, parametrize, and coverage configuration.
rules/python/security.md | rule | Python security: bandit integration, dependency pinning, and secrets management.
rules/python/patterns.md | rule | Python patterns: async/await, context managers, and dependency injection.
rules/python/hooks.md | rule | PostToolUse hooks for Python: black/ruff auto-format triggers on file edit.
rules/rust/coding-style.md | rule | Rust style: ownership, clippy compliance, and error-handling with thiserror/anyhow.
rules/rust/testing.md | rule | Rust testing: unit tests in module, integration tests in tests/, and property-based testing.
rules/rust/security.md | rule | Rust security: unsafe block policy, dependency auditing with cargo-audit, and input validation.
rules/rust/patterns.md | rule | Rust patterns: builder pattern, newtype, and trait-based abstractions.
rules/rust/hooks.md | rule | PostToolUse hooks for Rust: cargo fmt and clippy triggers on file edit.
rules/java/coding-style.md | rule | Java style: naming conventions, Spring idioms, and Lombok usage policy.
rules/java/testing.md | rule | Java testing: JUnit 5, Mockito, and integration test patterns with Spring Boot Test.
rules/java/security.md | rule | Java security: Spring Security configuration, SQL injection prevention, and secret management.
rules/java/patterns.md | rule | Java patterns: service/repository layering, DTO mapping, and exception handling hierarchy.
rules/java/hooks.md | rule | PostToolUse hooks for Java: checkstyle and spotless triggers on file edit.
rules/kotlin/coding-style.md | rule | Kotlin style: coroutine conventions, null safety, and idiomatic extension functions.
rules/kotlin/testing.md | rule | Kotlin testing: kotest/JUnit 5, coroutine test patterns, and MockK usage.
rules/kotlin/security.md | rule | Kotlin security: Spring Security, input sanitisation, and sealed-class error modelling.
rules/kotlin/patterns.md | rule | Kotlin patterns: Flow, sealed classes, and Exposed/Ktor idioms.
rules/kotlin/hooks.md | rule | PostToolUse hooks for Kotlin: ktlint triggers on file edit.
rules/cpp/coding-style.md | rule | C++ style: modern C++17/20 idioms, RAII, and naming conventions.
rules/cpp/testing.md | rule | C++ testing: GoogleTest/Catch2 patterns and sanitiser integration (ASan, UBSan).
rules/cpp/security.md | rule | C++ security: buffer overflow prevention, smart pointer policy, and unsafe API avoidance.
rules/cpp/patterns.md | rule | C++ patterns: CRTP, PIMPL, and move semantics conventions.
rules/cpp/hooks.md | rule | PostToolUse hooks for C++: clang-format triggers on file edit.
rules/swift/coding-style.md | rule | Swift style: Swift 6 concurrency, naming, and value-type preferences.
rules/swift/testing.md | rule | Swift testing: XCTest/swift-testing patterns and async test conventions.
rules/swift/security.md | rule | Swift security: Keychain usage, secure enclave patterns, and data-at-rest encryption.
rules/swift/patterns.md | rule | Swift patterns: actor model, protocol-oriented design, and Combine/AsyncStream.
rules/swift/hooks.md | rule | PostToolUse hooks for Swift: swift-format triggers on file edit.
rules/php/coding-style.md | rule | PHP style: PSR-12, typed properties, and Laravel/Symfony idioms.
rules/php/testing.md | rule | PHP testing: PHPUnit patterns, feature tests, and database transaction rollback.
rules/php/security.md | rule | PHP security: prepared statements, CSRF tokens, and password hashing policy.
rules/php/patterns.md | rule | PHP patterns: repository pattern, service layer, and dependency injection container.
rules/php/hooks.md | rule | PostToolUse hooks for PHP: PHP CS Fixer and PHPStan triggers on file edit.
rules/perl/coding-style.md | rule | Perl style: strict/warnings, modern Perl idioms, and module organisation.
rules/perl/testing.md | rule | Perl testing: Test::More and Test::MockModule patterns.
rules/perl/security.md | rule | Perl security: taint mode policy, input sanitisation, and dependency auditing.
rules/perl/patterns.md | rule | Perl patterns: Moose/Moo object system and error handling conventions.
rules/perl/hooks.md | rule | PostToolUse hooks for Perl: perltidy triggers on file edit.
rules/csharp/coding-style.md | rule | C# style: nullable annotations, record types, and .NET 8 idioms.
rules/csharp/testing.md | rule | C# testing: xUnit, Moq, and ASP.NET Core integration test patterns.
rules/csharp/security.md | rule | C# security: ASP.NET Core data protection, secrets management, and SQL parameterisation.
rules/csharp/patterns.md | rule | C# patterns: CQRS/MediatR, repository, and cancellation-token propagation.
rules/csharp/hooks.md | rule | PostToolUse hooks for C#: dotnet format triggers on file edit.

---

## Slash commands — `commands/`

commands/plan.md | sop | /plan: restate requirements, assess risks, and produce a step-by-step plan — gated on user confirmation before any code is written.
commands/tdd.md | sop | /tdd: invoke tdd-guide agent to scaffold interfaces, write failing tests first, then implement minimal passing code.
commands/verify.md | sop | /verify: run build → type-check → lint → tests in sequence and stop on first failure.
commands/quality-gate.md | sop | /quality-gate: run the full ECC quality pipeline (build, type-check, lint, tests) on demand for a file or project scope.
commands/code-review.md | sop | /code-review: security and quality review of uncommitted changes — checks credentials, logic, and style.
commands/orchestrate.md | sop | /orchestrate: sequential and tmux/worktree multi-agent workflow for complex tasks.
commands/loop-start.md | sop | /loop-start: start a managed autonomous loop with safety defaults, stop conditions, and mode selection (safe vs fast).
commands/loop-status.md | sop | /loop-status: inspect active loop state, progress counters, and failure signals.
commands/checkpoint.md | sop | /checkpoint: create or verify a named workflow checkpoint to track progress across sessions.
commands/learn.md | sop | /learn: extract reusable patterns from the current session and save them as skill files.
commands/learn-eval.md | sop | /learn-eval: extend /learn with a quality gate and save-location decision before writing any skill file.
commands/promote.md | sop | /promote: promote project-scoped instincts to global scope in the continuous-learning system.
commands/prune.md | sop | /prune: delete pending instincts older than 30 days that were never reviewed or promoted.
commands/evolve.md | sop | /evolve: analyze instincts and suggest or generate evolved, consolidated structures.
commands/instinct-export.md | sop | /instinct-export: export instincts to a shareable file for transfer or team sharing.
commands/instinct-import.md | sop | /instinct-import: import instincts from a file into the current scope.
commands/instinct-status.md | sop | /instinct-status: show current instinct inventory with scope, age, and promotion status.
commands/save-session.md | sop | /save-session: snapshot session state (what was built, what failed, what remains) to a dated file for future resumption.
commands/resume-session.md | sop | /resume-session: load the most recent session snapshot and orient before resuming work.
commands/skill-create.md | sop | /skill-create: analyze repo git history to extract team coding patterns and generate SKILL.md files.
commands/skill-health.md | sop | /skill-health: display skill portfolio health dashboard with success rates, failure clusters, and pending amendments.
commands/rules-distill.md | sop | /rules-distill: scan installed skills, extract cross-cutting principles, and distill them into rule files.
commands/harness-audit.md | sop | /harness-audit: deterministic repository harness audit returning a prioritized scorecard across hooks, skills, commands, and agents.
commands/context-budget.md | sop | /context-budget: audit context window consumption across agents, skills, MCPs, and rules to find token-savings opportunities.
commands/prompt-optimize.md | sop | /prompt-optimize: analyze a draft prompt and output an ECC-enriched version with agent/skill/hook recommendations — advisory only.
commands/model-route.md | sop | /model-route: recommend the best model tier (Haiku/Sonnet/Opus) for the current task by complexity and budget.
commands/aside.md | sop | /aside: answer a quick side question without losing current task context, then auto-resume.
commands/multi-plan.md | sop | /multi-plan: multi-model collaborative planning using parallel Codex/Gemini analysis to generate an implementation plan.
commands/multi-execute.md | sop | /multi-execute: multi-model collaborative execution where external models prototype and Claude refactors/implements with zero external write access.
commands/multi-workflow.md | sop | /workflow: full multi-model development pipeline (Research → Ideation → Plan → Execute → Optimize → Review) with frontend/backend routing.
commands/multi-backend.md | sop | /backend: Codex-led backend development workflow with research, planning, execution, and review phases.
commands/multi-frontend.md | sop | /frontend: Gemini-led frontend development workflow with research, planning, execution, and review phases.
commands/update-codemaps.md | sop | /update-codemaps: scan project structure and generate token-lean architecture documentation files.
commands/update-docs.md | sop | /update-docs: update READMEs and guides to reflect current codebase state.
commands/refactor-clean.md | sop | /refactor-clean: invoke refactor-cleaner agent to remove dead code, duplicates, and unused exports.
commands/e2e.md | sop | /e2e: invoke e2e-runner agent to generate, run, and report on end-to-end Playwright tests.
commands/eval.md | sop | /eval: run the eval harness against a session or component and report pass/fail metrics.
commands/build-fix.md | sop | /build-fix: invoke build-error-resolver agent to diagnose and fix compilation or type errors.
commands/go-build.md | sop | /go-build: diagnose and fix Go build failures using the go-build-resolver agent.
commands/go-review.md | sop | /go-review: invoke go-reviewer agent for idiomatic Go code review.
commands/go-test.md | sop | /go-test: run Go tests with coverage reporting and surface gaps.
commands/rust-build.md | sop | /rust-build: diagnose and fix Cargo/borrow-checker errors using the rust-build-resolver agent.
commands/rust-review.md | sop | /rust-review: invoke rust-reviewer agent for ownership, lifetime, and idiomatic Rust review.
commands/rust-test.md | sop | /rust-test: run Rust tests with coverage and property-based testing integration.
commands/kotlin-build.md | sop | /kotlin-build: diagnose and fix Kotlin/Gradle build failures using the kotlin-build-resolver agent.
commands/kotlin-review.md | sop | /kotlin-review: invoke kotlin-reviewer agent for coroutine, null safety, and idiom review.
commands/kotlin-test.md | sop | /kotlin-test: run Kotlin tests with kotest/JUnit 5 and coverage reporting.
commands/gradle-build.md | sop | /gradle-build: diagnose and fix Gradle build failures across Java/Kotlin projects.
commands/cpp-build.md | sop | /cpp-build: diagnose and fix C++ build errors using the cpp-build-resolver agent.
commands/cpp-review.md | sop | /cpp-review: invoke cpp-reviewer agent for memory safety, RAII, and modern C++ review.
commands/cpp-test.md | sop | /cpp-test: run C++ tests with GoogleTest/Catch2 and sanitiser integration.
commands/python-review.md | sop | /python-review: invoke python-reviewer agent for type hints, async patterns, and PEP compliance.
commands/test-coverage.md | sop | /test-coverage: analyze test coverage, identify gaps, and generate missing tests to reach 80 %+.
commands/devfleet.md | sop | /devfleet: orchestrate parallel Claude Code agents via Claude DevFleet in isolated git worktrees.
commands/claw.md | sop | /claw: start NanoClaw v2 persistent REPL with model routing, skill hot-load, branching, and session metrics.
commands/pm2.md | sop | /pm2: auto-analyze project and generate PM2 service configuration for process management.
commands/setup-pm.md | sop | /setup-pm: interactive wizard to configure the preferred package manager (npm/pnpm/yarn/bun).
commands/projects.md | sop | /projects: manage Claude Code project list — list, switch, create, and archive project sessions.
commands/sessions.md | sop | /sessions: list and manage saved session files in the session-data store.

---

## Skills — `skills/`

skills/agentic-engineering/SKILL.md | skill | Agentic engineering operating model: eval-first execution, task decomposition, and cost-aware model routing for AI-led implementation.
skills/ai-first-engineering/SKILL.md | skill | Team process design for AI-first engineering: review patterns, architecture constraints, and human quality-enforcement checkpoints.
skills/ai-regression-testing/SKILL.md | skill | Regression testing strategies for AI-assisted development: sandbox API tests, automated bug-check workflows, and blind-spot detection.
skills/agent-eval/SKILL.md | skill | Head-to-head agent evaluation: compare coding agents (Claude Code, Aider, Codex) on custom tasks with pass-rate, cost, and consistency metrics.
skills/agent-harness-construction/SKILL.md | skill | Agent action-space design: tool definitions, observation formatting, and recovery patterns for higher task completion rates.
skills/autonomous-loops/SKILL.md | skill | Autonomous loop architectures: sequential pipelines to RFC-driven multi-agent DAG systems (v1.8 compatibility alias for continuous-agent-loop).
skills/continuous-agent-loop/SKILL.md | skill | Canonical loop skill: patterns for continuous autonomous loops with quality gates, evals, and recovery controls.
skills/continuous-learning/SKILL.md | skill | Session-end pattern extraction: automatically evaluates sessions and saves reusable patterns as learned skills.
skills/continuous-learning-v2/SKILL.md | skill | Upgraded continuous learning system with project/global scope separation and instinct lifecycle management.
skills/context-budget/SKILL.md | skill | Context window audit: measures token consumption across agents, skills, MCP servers, and rules with prioritized optimization recommendations.
skills/verification-loop/SKILL.md | skill | Verification system: structured build → type-check → lint → test → E2E gate with failure escalation protocol.
skills/tdd-workflow/SKILL.md | skill | TDD workflow: Red-Green-Refactor cycle with 80 %+ coverage gate across unit, integration, and E2E test types.
skills/security-review/SKILL.md | skill | Security review checklist and patterns for authentication, input handling, API endpoints, secrets, and OWASP Top 10.
skills/safety-guard/SKILL.md | skill | Destructive-operation prevention: three guard modes (warn/block/confirm) for production systems and autonomous agent runs.
skills/rules-distill/SKILL.md | skill | Cross-skill principle extraction: scans installed skills, identifies recurring patterns, and distills them into rule files.
skills/search-first/SKILL.md | skill | Research-before-coding workflow: mandates searching for existing tools, libraries, and patterns before writing custom code.
skills/eval-harness/SKILL.md | skill | Formal eval framework: eval-driven development (EDD) with scenario generation, agent execution, and pass/fail reporting.
skills/prompt-optimizer/SKILL.md | skill | Prompt analysis and ECC-enrichment: matches ECC components to a draft prompt and outputs an optimized, ready-to-paste version.
skills/skill-comply/SKILL.md | skill | Automated compliance measurement: generates scenarios at 3 prompt strictness levels and measures whether agents actually follow skills and rules.
skills/skill-stocktake/SKILL.md | skill | Skill portfolio audit: quality-checklist evaluation of all skills and commands in Quick Scan or Full Stocktake mode.
skills/configure-ecc/SKILL.md | skill | Interactive ECC installation wizard: guides selective skill/rule installation with path verification and optional optimization.
skills/enterprise-agent-ops/SKILL.md | skill | Enterprise agent operations: observability, security boundaries, and lifecycle management for long-lived agent workloads.
skills/benchmark/SKILL.md | skill | Performance baseline and regression detection: measures before/after PR impact and compares stack alternatives.
skills/blueprint/SKILL.md | skill | Multi-session project planning: turns a one-line objective into a step-by-step construction plan with adversarial review gate and dependency graph.
skills/santa-method/SKILL.md | skill | Multi-agent adversarial verification: two independent reviewers with no shared context must both pass before output ships.
skills/team-builder/SKILL.md | skill | Interactive agent team picker: browse and compose parallel agent teams from flat or domain-subdirectory agent collections.
skills/claude-devfleet/SKILL.md | skill | Claude DevFleet orchestration: plan projects, dispatch parallel agents in isolated worktrees, monitor progress, and read structured reports.
skills/dmux-workflows/SKILL.md | skill | dmux multi-agent orchestration: tmux-based parallel agent session management across Claude Code, Codex, and OpenCode.
skills/ralphinho-rfc-pipeline/SKILL.md | skill | RFC-driven multi-agent DAG execution: quality gates, merge queues, and work unit orchestration for large feature delivery.
skills/plankton-code-quality/SKILL.md | skill | Write-time code quality enforcement via Plankton: auto-format/lint on every file edit with Claude subprocess fix loop.
skills/canary-watch/SKILL.md | skill | Post-deploy canary monitoring: continuous health checks after deployment with alerting and rollback signals.
skills/browser-qa/SKILL.md | skill | Automated visual testing: Playwright-based UI verification, accessibility audits, and responsive testing for staging/preview deploys.
skills/deep-research/SKILL.md | skill | Multi-source research using Firecrawl and Exa MCPs: synthesizes findings into cited reports with source attribution.
skills/iterative-retrieval/SKILL.md | skill | Progressive context retrieval pattern: solves the subagent context problem by refining retrieval as the agent discovers what it needs.
skills/cost-aware-llm-pipeline/SKILL.md | skill | LLM cost optimization: model routing by task complexity, budget tracking, retry logic, and prompt caching patterns.
skills/strategic-compact/SKILL.md | skill | Strategic compaction: recommends manual /compact at logical workflow intervals rather than relying on arbitrary auto-compaction.
skills/context-budget/SKILL.md | skill | (see above — also listed as a skill with SKILL.md entry)
skills/codebase-onboarding/SKILL.md | skill | Codebase onboarding: analyzes an unfamiliar repo and generates a structured guide with architecture map, conventions, and starter CLAUDE.md.
skills/nanoclaw-repl/SKILL.md | skill | NanoClaw REPL operation: patterns for running and extending the zero-dependency session-aware ECC REPL.
skills/regex-vs-llm-structured-text/SKILL.md | skill | Regex vs LLM decision framework: use regex for 95–98 % of structured-text parsing cases; reserve LLM calls for low-confidence edge cases.
skills/content-hash-cache-pattern/SKILL.md | skill | Content-hash file cache: cache expensive file processing results by SHA-256 hash — path-independent and auto-invalidating.
skills/coding-standards/SKILL.md | skill | Universal coding standards: immutability, functional patterns, naming, and error-handling conventions for TS/JS/React/Node.
skills/api-design/SKILL.md | skill | REST API design patterns: resource naming, status codes, pagination, filtering, error responses, versioning, and rate limiting.
skills/backend-patterns/SKILL.md | skill | Backend architecture patterns: API design, database optimisation, service layer, and caching for Node.js/Express/Next.js.
skills/frontend-patterns/SKILL.md | skill | Frontend patterns: React/Next.js state management, performance optimisation, and component design best practices.
skills/e2e-testing/SKILL.md | skill | Playwright E2E patterns: Page Object Model, CI/CD integration, artifact management, and flaky-test strategies.
skills/database-migrations/SKILL.md | skill | Database migration patterns: safe schema changes, rollback procedures, and zero-downtime deployment across major ORMs.
skills/deployment-patterns/SKILL.md | skill | Deployment workflows: CI/CD pipelines, Docker containerisation, health checks, rollback strategies, and production readiness checklists.
skills/docker-patterns/SKILL.md | skill | Docker patterns: local dev containers, multi-service Compose, networking, volume strategies, and container security.
skills/postgres-patterns/SKILL.md | skill | PostgreSQL patterns: query optimisation, schema design, indexing, and Supabase security best practices.
skills/mcp-server-patterns/SKILL.md | skill | MCP server construction: tools, resources, prompts, Zod validation, and stdio vs Streamable HTTP transport patterns.
skills/security-review/cloud-infrastructure-security.md | skill | Cloud infrastructure security supplement: IAM least-privilege, secrets management, network segmentation, and audit logging patterns.

---

## Skills (domain/language-specific) — `skills/`

skills/golang-patterns/SKILL.md | skill | Go patterns: interface composition, context propagation, error wrapping, and idiomatic concurrency.
skills/golang-testing/SKILL.md | skill | Go testing patterns: table-driven tests, benchmarks, integration testing, and coverage tooling.
skills/python-patterns/SKILL.md | skill | Python patterns: async/await, dataclasses, Pydantic models, and dependency injection.
skills/python-testing/SKILL.md | skill | Python testing with pytest: fixtures, parametrize, coverage configuration, and mock strategies.
skills/kotlin-patterns/SKILL.md | skill | Kotlin patterns: coroutines, Flow, sealed classes, and Ktor/Exposed idioms.
skills/kotlin-testing/SKILL.md | skill | Kotlin testing: kotest/JUnit 5, MockK, and coroutine test patterns.
skills/kotlin-coroutines-flows/SKILL.md | skill | Kotlin coroutines and Flows: structured concurrency, StateFlow, SharedFlow, and cancellation patterns.
skills/kotlin-exposed-patterns/SKILL.md | skill | Kotlin Exposed ORM patterns: DSL queries, DAO layer, transaction management, and migration integration.
skills/kotlin-ktor-patterns/SKILL.md | skill | Ktor server patterns: routing, serialisation, authentication, and plugin architecture.
skills/rust-patterns/SKILL.md | skill | Rust patterns: builder, newtype, trait objects, and error handling with thiserror/anyhow.
skills/rust-testing/SKILL.md | skill | Rust testing: in-module unit tests, integration tests, and property-based testing with proptest.
skills/swift-actor-persistence/SKILL.md | skill | Swift actor-based persistence: MainActor/global actors, data-race safety, and SwiftData/CloudKit patterns.
skills/swift-concurrency-6-2/SKILL.md | skill | Swift 6.2 concurrency: typed throws, Sendable conformance, and task group patterns.
skills/swift-protocol-di-testing/SKILL.md | skill | Swift protocol-oriented DI and testability: mock injection, protocol witnesses, and XCTest patterns.
skills/swiftui-patterns/SKILL.md | skill | SwiftUI patterns: view composition, environment values, navigation, and animation.
skills/android-clean-architecture/SKILL.md | skill | Android clean architecture: domain/data/presentation layers, Hilt DI, and ViewModel/Flow patterns.
skills/compose-multiplatform-patterns/SKILL.md | skill | Compose Multiplatform patterns: shared UI, expect/actual, and platform-specific implementations.
skills/flutter-dart-code-review/SKILL.md | skill | Flutter/Dart code review patterns: widget architecture, null safety, and performance anti-patterns.
skills/springboot-patterns/SKILL.md | skill | Spring Boot patterns: service/repository layers, exception handling, and REST controller design.
skills/springboot-tdd/SKILL.md | skill | Spring Boot TDD: MockMvc, @DataJpaTest, and test slice configuration patterns.
skills/springboot-security/SKILL.md | skill | Spring Boot security: Security config, JWT filter, role-based access, and CSRF protection.
skills/springboot-verification/SKILL.md | skill | Spring Boot verification checklist: build, type check, lint, test, and integration test gates.
skills/jpa-patterns/SKILL.md | skill | JPA/Hibernate patterns: entity design, N+1 prevention, optimistic locking, and query optimisation.
skills/django-patterns/SKILL.md | skill | Django patterns: ORM usage, view/serialiser layering, signals, and middleware conventions.
skills/django-tdd/SKILL.md | skill | Django TDD: factory_boy fixtures, pytest-django, and API test patterns.
skills/django-security/SKILL.md | skill | Django security: CSRF, permission classes, query parameterisation, and SECRET_KEY management.
skills/django-verification/SKILL.md | skill | Django verification checklist: manage.py checks, migration state, and test gate.
skills/laravel-patterns/SKILL.md | skill | Laravel patterns: Eloquent ORM, service provider DI, and resource controller conventions.
skills/laravel-tdd/SKILL.md | skill | Laravel TDD: factories, RefreshDatabase, and feature-test patterns.
skills/laravel-security/SKILL.md | skill | Laravel security: CSRF middleware, policy/gate authorisation, and SQL injection prevention.
skills/laravel-verification/SKILL.md | skill | Laravel verification checklist: artisan checks, migration state, and test suite gate.
skills/nuxt4-patterns/SKILL.md | skill | Nuxt 4 patterns: composables, server routes, Pinia state, and SSR/SSG strategies.
skills/nextjs-turbopack/SKILL.md | skill | Next.js with Turbopack: app router patterns, server components, streaming, and bundle optimisation.
skills/cpp-coding-standards/SKILL.md | skill | C++ coding standards: RAII, smart pointers, constexpr, and modern C++20 feature usage.
skills/cpp-testing/SKILL.md | skill | C++ testing: GoogleTest, CMake test integration, and sanitiser (ASan/UBSan/TSan) configuration.
skills/perl-patterns/SKILL.md | skill | Perl patterns: Moose/Moo OOP, CPAN module conventions, and error handling.
skills/perl-security/SKILL.md | skill | Perl security: taint mode, input validation, and dependency auditing.
skills/perl-testing/SKILL.md | skill | Perl testing: Test::More, Test::MockModule, and coverage with Devel::Cover.
skills/pytorch-patterns/SKILL.md | skill | PyTorch patterns: dataset/dataloader design, training loop, mixed precision, and CUDA memory management.
skills/bun-runtime/SKILL.md | skill | Bun runtime patterns: native APIs, module resolution, test runner, and bundler configuration.

---

## Skills (business/domain) — `skills/`

skills/exa-search/SKILL.md | skill | Exa web search integration: semantic search queries, result extraction, and citation-building patterns.
skills/deep-research/SKILL.md | skill | (see above)
skills/market-research/SKILL.md | skill | Market research workflow: competitor analysis, user-persona synthesis, and findings report structure.
skills/investor-materials/SKILL.md | skill | Investor materials creation: pitch deck structure, financial model conventions, and narrative framing.
skills/investor-outreach/SKILL.md | skill | Investor outreach workflow: personalised email sequences, follow-up cadence, and CRM update protocol.
skills/content-engine/SKILL.md | skill | Content production workflow: brief-to-draft pipeline, SEO optimisation, and multi-channel repurposing.
skills/article-writing/SKILL.md | skill | Long-form article writing: research synthesis, structure, voice consistency, and editor-ready output.
skills/crosspost/SKILL.md | skill | Cross-platform content distribution: adapt a primary post for Twitter/LinkedIn/newsletter with platform tone rules.
skills/frontend-slides/SKILL.md | skill | Frontend slide deck generation: component-based slide construction with theme presets and export workflow.
skills/video-editing/SKILL.md | skill | Video editing workflow: cut/trim instructions, caption generation, and export format checklist.
skills/fal-ai-media/SKILL.md | skill | fal.ai media generation: image/video model invocation patterns, prompt formatting, and result handling.
skills/x-api/SKILL.md | skill | X (Twitter) API integration: authentication, tweet creation, thread management, and rate-limit handling.
skills/documentation-lookup/SKILL.md | skill | Documentation lookup via Context7 MCP: resolve library IDs, query current docs, and return cited answers.
skills/claude-api/SKILL.md | skill | Claude API integration: SDK patterns, prompt construction, streaming, and tool-use implementation.
skills/clickhouse-io/SKILL.md | skill | ClickHouse IO patterns: schema design, batch ingestion, query optimisation, and MergeTree engine selection.
skills/videodb/SKILL.md | skill | VideoDB integration: video indexing, semantic search, clip extraction, and streaming patterns.
skills/visa-doc-translate/SKILL.md | skill | Visa document translation workflow: OCR extraction, translation quality checks, and formatted output.
skills/nutrient-document-processing/SKILL.md | skill | Nutrient/PSPDFKit document processing: PDF annotation, form filling, and digital signature patterns.
skills/energy-procurement/SKILL.md | skill | Energy procurement workflow: RFP generation, supplier comparison, and contract term analysis.
skills/carrier-relationship-management/SKILL.md | skill | Carrier relationship management: lane negotiation, performance tracking, and escalation procedures.
skills/customs-trade-compliance/SKILL.md | skill | Customs and trade compliance: HS code classification, duty calculation, and documentation checklist.
skills/logistics-exception-management/SKILL.md | skill | Logistics exception management: exception classification, root-cause analysis, and carrier escalation workflow.
skills/production-scheduling/SKILL.md | skill | Production scheduling: capacity planning, constraint identification, and schedule optimisation patterns.
skills/inventory-demand-planning/SKILL.md | skill | Inventory demand planning: forecast models, safety-stock calculation, and reorder-point workflow.
skills/quality-nonconformance/SKILL.md | skill | Quality non-conformance management: defect classification, CAPA workflow, and supplier corrective action.
skills/returns-reverse-logistics/SKILL.md | skill | Returns and reverse logistics: RMA workflow, disposition rules, and refurbishment routing.
skills/product-lens/SKILL.md | skill | Product-lens analysis: feature prioritisation framework, user-impact scoring, and trade-off documentation.
skills/project-guidelines-example/SKILL.md | skill | Example project-specific guidelines skill: template for encoding team conventions into a loadable skill.
skills/strategic-compact/SKILL.md | skill | (see above)

---

## Hooks — `hooks/` and `.cursor/hooks/`

hooks/hooks.json | config | Claude Code hooks configuration: PreToolUse git-hook-bypass block, auto-tmux dev launch, and full PostToolUse/Stop hook chain.
.cursor/hooks.json | config | Cursor hook configuration: session-start context load, session-end state persistence, and file-edit quality triggers.
.cursor/hooks/session-start.js | config | Hook: load previous session context and detect environment on session start.
.cursor/hooks/session-end.js | config | Hook: persist session state and evaluate patterns on session end.
.cursor/hooks/before-shell-execution.js | config | Hook: intercept and validate shell commands before execution (safety gate).
.cursor/hooks/after-shell-execution.js | config | Hook: post-execution logging and quality checks after shell commands run.
.cursor/hooks/before-file-edit.js (before-read-file.js) | config | Hook: intercept file reads for audit/filtering before content is returned to agent.
.cursor/hooks/after-file-edit.js | config | Hook: run formatters and linters after a file is written.
.cursor/hooks/after-tab-file-edit.js | config | Hook: run quality checks after a tab-scoped file edit.
.cursor/hooks/before-tab-file-read.js | config | Hook: audit/filter before a tab-scoped file read.
.cursor/hooks/before-mcp-execution.js | config | Hook: validate MCP tool calls before execution.
.cursor/hooks/after-mcp-execution.js | config | Hook: log and audit MCP tool results after execution.
.cursor/hooks/before-submit-prompt.js | config | Hook: intercept and inspect prompts before they are submitted to the model.
.cursor/hooks/subagent-start.js | config | Hook: initialize subagent context and register subagent on spawn.
.cursor/hooks/subagent-stop.js | config | Hook: clean up and log subagent results on termination.
.cursor/hooks/stop.js | config | Hook: final session cleanup and verification on agent stop.
.cursor/hooks/pre-compact.js | config | Hook: run pre-compaction checks and save state before context window compaction.

---

## Kiro hooks and steering — `.kiro/`

.kiro/hooks/quality-gate.kiro.hook | config | Kiro hook: user-triggered full quality gate (build, type-check, lint, tests) via shell script.
.kiro/hooks/session-summary.kiro.hook | config | Kiro hook: generate a 2–3 sentence accomplishment summary on agent stop.
.kiro/hooks/auto-format.kiro.hook | config | Kiro hook: auto-format files on save via PostToolUse trigger.
.kiro/hooks/code-review-on-write.kiro.hook | config | Kiro hook: trigger code review agent after file write.
.kiro/hooks/console-log-check.kiro.hook | config | Kiro hook: detect and flag console.log statements in committed files.
.kiro/hooks/doc-file-warning.kiro.hook | config | Kiro hook: warn agent before editing documentation files.
.kiro/hooks/extract-patterns.kiro.hook | config | Kiro hook: extract reusable patterns from the session on agent stop.
.kiro/hooks/git-push-review.kiro.hook | config | Kiro hook: run security and quality review before git push.
.kiro/hooks/tdd-reminder.kiro.hook | config | Kiro hook: remind agent to write tests before implementation when new files are created.
.kiro/hooks/typecheck-on-edit.kiro.hook | config | Kiro hook: run type-checker after each file edit.
.kiro/steering/coding-style.md | rule | Kiro steering: immutability, file organisation, error handling, and code quality (auto-loaded).
.kiro/steering/development-workflow.md | rule | Kiro steering: planning → TDD → code review → commit pipeline (auto-loaded).
.kiro/steering/git-workflow.md | rule | Kiro steering: conventional commits and PR process (auto-loaded).
.kiro/steering/security.md | rule | Kiro steering: pre-commit security checklist and secret management (auto-loaded).
.kiro/steering/testing.md | rule | Kiro steering: 80 %+ coverage gate and required test types (auto-loaded).
.kiro/steering/patterns.md | rule | Kiro steering: skeleton-project-first and API response conventions (auto-loaded).
.kiro/steering/performance.md | rule | Kiro steering: model-routing heuristic and caching strategies (auto-loaded).
.kiro/steering/lessons-learned.md | rule | Kiro steering: user-editable file for capturing project-specific patterns and decisions (auto-loaded).
.kiro/steering/research-mode.md | rule | Kiro steering: research workflow context for technology evaluation and architectural decisions (manual).
.kiro/steering/review-mode.md | rule | Kiro steering: code review workflow context for quality and security assessment (manual).
.kiro/steering/dev-mode.md | rule | Kiro steering: active development context with implementation focus areas (manual).
.kiro/steering/golang-patterns.md | rule | Kiro steering: Go-specific patterns supplement (auto-loaded in Go projects).
.kiro/steering/python-patterns.md | rule | Kiro steering: Python-specific patterns supplement (auto-loaded in Python projects).
.kiro/steering/swift-patterns.md | rule | Kiro steering: Swift-specific patterns supplement (auto-loaded in Swift projects).
.kiro/steering/typescript-patterns.md | rule | Kiro steering: TypeScript-specific patterns supplement (auto-loaded in TS projects).
.kiro/steering/typescript-security.md | rule | Kiro steering: TypeScript-specific security patterns supplement (auto-loaded in TS projects).
.kiro/agents/architect.md | agent | Kiro-format architect agent: system design specialist with read/shell tools and proactive activation trigger.
.kiro/agents/build-error-resolver.md | agent | Kiro-format build-error-resolver agent.
.kiro/agents/chief-of-staff.md | agent | Kiro-format chief-of-staff agent.
.kiro/agents/code-reviewer.md | agent | Kiro-format code-reviewer agent.
.kiro/agents/database-reviewer.md | agent | Kiro-format database-reviewer agent.
.kiro/agents/doc-updater.md | agent | Kiro-format doc-updater agent.
.kiro/agents/e2e-runner.md | agent | Kiro-format e2e-runner agent.
.kiro/agents/go-build-resolver.md | agent | Kiro-format go-build-resolver agent.
.kiro/agents/go-reviewer.md | agent | Kiro-format go-reviewer agent.
.kiro/agents/harness-optimizer.md | agent | Kiro-format harness-optimizer agent.
.kiro/agents/loop-operator.md | agent | Kiro-format loop-operator agent.
.kiro/agents/planner.md | agent | Kiro-format planner agent.
.kiro/agents/python-reviewer.md | agent | Kiro-format python-reviewer agent.
.kiro/agents/refactor-cleaner.md | agent | Kiro-format refactor-cleaner agent.
.kiro/agents/security-reviewer.md | agent | Kiro-format security-reviewer agent.
.kiro/agents/tdd-guide.md | agent | Kiro-format tdd-guide agent.

---

## Kiro skills — `.kiro/skills/` (subset with distinct content)

.kiro/skills/agentic-engineering/SKILL.md | skill | Kiro-format agentic engineering skill with expanded metadata for Kiro inclusion system.

---

## Codex configuration — `.codex/`

.codex/config.toml | config | Codex runtime config: approval policy (on-request), sandbox mode, web search, MCP server list, multi-agent settings, and named execution profiles (strict/yolo).
.codex/AGENTS.md | prompt | Codex-specific agent instructions cross-referencing the root AGENTS.md.
.codex/agents/explorer.toml | agent | Codex explorer sub-agent: read-only codebase exploration with medium reasoning effort; cites files before proposing fixes.
.codex/agents/reviewer.toml | agent | Codex reviewer sub-agent: correctness, security, and missing-test review with high reasoning effort.
.codex/agents/docs-researcher.toml | agent | Codex docs-researcher sub-agent: verifies API behavior and release notes against primary documentation before changes land.

---

## OpenCode configuration — `.opencode/`

.opencode/opencode.json | config | OpenCode session config: model selection, default agent, and the full list of skill/instruction files loaded per session.
.opencode/instructions/INSTRUCTIONS.md | prompt | OpenCode consolidated instructions: full security checklist, development workflow, coding style, testing requirements, and agent dispatch table.
.opencode/commands/plan.md | sop | OpenCode /plan command: mirrors the Claude Code plan workflow.
.opencode/commands/tdd.md | sop | OpenCode /tdd command: TDD workflow invocation.
.opencode/commands/verify.md | sop | OpenCode /verify command: verification pipeline.
.opencode/commands/quality-gate.md | sop | OpenCode /quality-gate command.
.opencode/commands/code-review.md | sop | OpenCode /code-review command.
.opencode/commands/orchestrate.md | sop | OpenCode /orchestrate command.
.opencode/commands/loop-start.md | sop | OpenCode /loop-start command.
.opencode/commands/skill-create.md | sop | OpenCode /skill-create command.
.opencode/commands/learn.md | sop | OpenCode /learn command.
.opencode/commands/promote.md | sop | OpenCode /promote command.
.opencode/commands/evolve.md | sop | OpenCode /evolve command.
.opencode/commands/build-fix.md | sop | OpenCode /build-fix command.
.opencode/commands/go-build.md | sop | OpenCode /go-build command.
.opencode/commands/go-review.md | sop | OpenCode /go-review command.
.opencode/commands/go-test.md | sop | OpenCode /go-test command.
.opencode/commands/rust-build.md | sop | OpenCode /rust-build command.
.opencode/commands/rust-review.md | sop | OpenCode /rust-review command.
.opencode/commands/rust-test.md | sop | OpenCode /rust-test command.
.opencode/commands/harness-audit.md | sop | OpenCode /harness-audit command.
.opencode/commands/instinct-export.md | sop | OpenCode /instinct-export command.
.opencode/commands/instinct-import.md | sop | OpenCode /instinct-import command.
.opencode/commands/instinct-status.md | sop | OpenCode /instinct-status command.
.opencode/commands/model-route.md | sop | OpenCode /model-route command.
.opencode/commands/refactor-clean.md | sop | OpenCode /refactor-clean command.
.opencode/commands/setup-pm.md | sop | OpenCode /setup-pm command.
.opencode/commands/update-codemaps.md | sop | OpenCode /update-codemaps command.
.opencode/commands/update-docs.md | sop | OpenCode /update-docs command.
.opencode/commands/e2e.md | sop | OpenCode /e2e command.
.opencode/commands/eval.md | sop | OpenCode /eval command.
.opencode/commands/checkpoint.md | sop | OpenCode /checkpoint command.
.opencode/commands/security.md | sop | OpenCode /security command: invoke security-reviewer agent.
.opencode/prompts/agents/architect.txt | prompt | OpenCode agent prompt: architect system prompt (plain-text, tool-agnostic format).
.opencode/prompts/agents/build-error-resolver.txt | prompt | OpenCode agent prompt: build-error-resolver system prompt.
.opencode/prompts/agents/code-reviewer.txt | prompt | OpenCode agent prompt: code-reviewer system prompt.
.opencode/prompts/agents/database-reviewer.txt | prompt | OpenCode agent prompt: database-reviewer system prompt.
.opencode/prompts/agents/doc-updater.txt | prompt | OpenCode agent prompt: doc-updater system prompt.
.opencode/prompts/agents/e2e-runner.txt | prompt | OpenCode agent prompt: e2e-runner system prompt.
.opencode/prompts/agents/go-build-resolver.txt | prompt | OpenCode agent prompt: go-build-resolver system prompt.
.opencode/prompts/agents/go-reviewer.txt | prompt | OpenCode agent prompt: go-reviewer system prompt.
.opencode/prompts/agents/planner.txt | prompt | OpenCode agent prompt: planner system prompt.
.opencode/prompts/agents/refactor-cleaner.txt | prompt | OpenCode agent prompt: refactor-cleaner system prompt.
.opencode/prompts/agents/rust-build-resolver.txt | prompt | OpenCode agent prompt: rust-build-resolver system prompt.
.opencode/prompts/agents/rust-reviewer.txt | prompt | OpenCode agent prompt: rust-reviewer system prompt.
.opencode/prompts/agents/security-reviewer.txt | prompt | OpenCode agent prompt: security-reviewer system prompt.
.opencode/prompts/agents/tdd-guide.txt | prompt | OpenCode agent prompt: tdd-guide system prompt.

---

## Claude-specific configuration — `.claude/`

.claude/rules/everything-claude-code-guardrails.md | rule | ECC-generated guardrails: commit workflow policy, module organisation constraint, and code style conventions derived from repo history.
.claude/enterprise/controls.md | rule | Enterprise governance baseline: approval expectations for security-sensitive changes, audit suppression policy, and skill review gate.
.claude/research/everything-claude-code-research-playbook.md | sop | Research playbook: prefer local docs → primary sources → Exa; include evidence trails for all recommendations.
.claude/ecc-tools.json | config | ECC tools metadata: installed component list, profile settings, tier, and generation provenance.
.claude/identity.json | config | Identity preferences: technical level, verbosity, code-comment settings, and domain configuration.
.claude/package-manager.json | config | Package manager preference: records the selected package manager (bun) and set timestamp.
.claude/skills/everything-claude-code/SKILL.md | skill | Auto-generated project-conventions skill: encodes repo-specific commit style, module organisation, and testing patterns extracted from git history.
.claude/commands/feature-development.md | sop | Repo-specific /feature-development workflow scaffold: goal, steps, and acceptance criteria for ECC feature work.
.claude/commands/database-migration.md | sop | Repo-specific /database-migration workflow scaffold.
.claude/commands/add-language-rules.md | sop | Repo-specific /add-language-rules workflow scaffold for adding new language rule sets.

---

## Agents-file skills — `.agents/skills/`

.agents/skills/everything-claude-code/SKILL.md | skill | AGENTS.md-convention project-conventions skill: same content as .claude/skills version, loaded via the AGENTS.md skill path.

---

## Cursor rules — `.cursor/rules/`

.cursor/rules/common-agents.md | rule | Cursor rules mirror: agent dispatch table.
.cursor/rules/common-coding-style.md | rule | Cursor rules mirror: immutability and coding-style conventions.
.cursor/rules/common-development-workflow.md | rule | Cursor rules mirror: feature implementation pipeline.
.cursor/rules/common-git-workflow.md | rule | Cursor rules mirror: conventional commits and PR workflow.
.cursor/rules/common-hooks.md | rule | Cursor rules mirror: hook system policy.
.cursor/rules/common-patterns.md | rule | Cursor rules mirror: skeleton-project-first and design patterns.
.cursor/rules/common-performance.md | rule | Cursor rules mirror: model-routing and performance guidelines.
.cursor/rules/common-security.md | rule | Cursor rules mirror: pre-commit security checklist.
.cursor/rules/common-testing.md | rule | Cursor rules mirror: 80 %+ coverage and TDD enforcement.
.cursor/rules/golang-coding-style.md | rule | Cursor rules: Go coding style.
.cursor/rules/golang-hooks.md | rule | Cursor rules: Go file-edit hooks.
.cursor/rules/golang-patterns.md | rule | Cursor rules: Go design patterns.
.cursor/rules/golang-security.md | rule | Cursor rules: Go security practices.
.cursor/rules/golang-testing.md | rule | Cursor rules: Go testing conventions.
.cursor/rules/kotlin-coding-style.md | rule | Cursor rules: Kotlin coding style.
.cursor/rules/kotlin-hooks.md | rule | Cursor rules: Kotlin file-edit hooks.
.cursor/rules/kotlin-patterns.md | rule | Cursor rules: Kotlin design patterns.
.cursor/rules/kotlin-security.md | rule | Cursor rules: Kotlin security practices.
.cursor/rules/kotlin-testing.md | rule | Cursor rules: Kotlin testing conventions.
.cursor/rules/php-coding-style.md | rule | Cursor rules: PHP coding style.
.cursor/rules/php-hooks.md | rule | Cursor rules: PHP file-edit hooks.
.cursor/rules/php-patterns.md | rule | Cursor rules: PHP design patterns.
.cursor/rules/php-security.md | rule | Cursor rules: PHP security practices.
.cursor/rules/php-testing.md | rule | Cursor rules: PHP testing conventions.
.cursor/rules/python-coding-style.md | rule | Cursor rules: Python coding style.
.cursor/rules/python-hooks.md | rule | Cursor rules: Python file-edit hooks.
.cursor/rules/python-patterns.md | rule | Cursor rules: Python design patterns.
.cursor/rules/python-security.md | rule | Cursor rules: Python security practices.
.cursor/rules/python-testing.md | rule | Cursor rules: Python testing conventions.
.cursor/rules/swift-coding-style.md | rule | Cursor rules: Swift coding style.
.cursor/rules/swift-hooks.md | rule | Cursor rules: Swift file-edit hooks.
.cursor/rules/swift-patterns.md | rule | Cursor rules: Swift design patterns.
.cursor/rules/swift-security.md | rule | Cursor rules: Swift security practices.
.cursor/rules/swift-testing.md | rule | Cursor rules: Swift testing conventions.
.cursor/rules/typescript-coding-style.md | rule | Cursor rules: TypeScript coding style.
.cursor/rules/typescript-hooks.md | rule | Cursor rules: TypeScript file-edit hooks.
.cursor/rules/typescript-patterns.md | rule | Cursor rules: TypeScript design patterns.
.cursor/rules/typescript-security.md | rule | Cursor rules: TypeScript security practices.
.cursor/rules/typescript-testing.md | rule | Cursor rules: TypeScript testing conventions.

---

## MCP and install configuration

mcp-configs/mcp-servers.json | config | MCP server registry: connection definitions for GitHub, Context7, Exa, Playwright, memory, Supabase, Firecrawl, fal.ai, and Cloudflare MCP servers.
manifests/install-profiles.json | config | Install profile definitions: maps named profiles (core/developer/full/enterprise) to ordered module sets for selective ECC installation.
manifests/install-components.json | config | Component manifest: enumerated list of all installable ECC components with paths and metadata.
manifests/install-modules.json | config | Module manifest: groups components into named modules (rules-core, agents-core, commands-core, etc.) for profile-based installation.
.kiro/settings/mcp.json.example | config | Kiro MCP server example configuration template.

---

## Homunculus instincts — `.claude/homunculus/`

.claude/homunculus/instincts/ | config | Directory of learned instinct files (auto-generated pattern extracts from prior sessions); each file encodes a reusable micro-pattern discovered during development.
