# File Inventory — cursor-rules

> **Source repo**: `.references/cursor-rules`
> **Note**: Each `rules/<name>/` directory contains two files with identical content in different formats — `rule.mdc` (MDC with YAML frontmatter, canonical) and `.cursorrules` (legacy plain-text format, duplicate). Only `rule.mdc` is listed below; `.cursorrules` files are omitted as redundant copies. The plugin manifest is included as it configures rule collection scope.

## Manifest / Config

`.cursor-plugin/plugin.json` | `config` | Package manifest declaring the plugin name, author, and rules directory for the cursor-rules collection.

## Cross-Cutting Rules (language/framework-agnostic)

`rules/clean-code/rule.mdc` | `rule` | Encoding-level coding standards: naming, function size, guard-clause conditionals, error handling, comment discipline, and refactoring techniques applicable across any language.

`rules/security-best-practices/rule.mdc` | `rule` | OWASP-aligned security procedure covering input validation, SQL injection, XSS, authentication (bcrypt/JWT/sessions), authorization ownership checks, secrets hygiene, HTTP headers, and rate limiting.

`rules/testing-tdd/rule.mdc` | `rule` | Red-green-refactor TDD workflow with AAA pattern, testing-pyramid guidance, mocking strategy, React Testing Library philosophy, and test data factory patterns.

`rules/performance-optimization/rule.mdc` | `rule` | Performance engineering procedure: measure-first principle, frontend bundle budgets, code splitting, caching layers, database query optimisation, and backend async patterns.

`rules/api-design-rest/rule.mdc` | `rule` | REST API design standards covering URL naming, HTTP semantics, status codes, versioning, pagination, error response shapes, and HATEOAS linking.

`rules/api-microservices/rule.mdc` | `rule` | Microservices architectural rules for inter-service communication, service boundaries, event-driven patterns, resilience (circuit breakers, retries), and observability.

`rules/database-sql/rule.mdc` | `rule` | SQL database design rules: schema naming, indexing strategy, query optimisation, migration discipline, and N+1 avoidance patterns.

## Language-Specific Rules

`rules/typescript/rule.mdc` | `rule` | TypeScript strict-mode coding standards: type annotation requirements, utility types, discriminated unions, and avoiding `any`/`as` escape hatches.

`rules/typescript-strict/rule.mdc` | `rule` | Advanced TypeScript strict-mode patterns including branded types, template literal types, conditional types, and exhaustive checks.

`rules/python-modern/rule.mdc` | `rule` | Modern Python 3.10+ idioms: structural pattern matching, `match`/`case`, dataclasses, type hints, and preferred stdlib patterns.

`rules/python-fastapi/rule.mdc` | `rule` | FastAPI production patterns: Pydantic v2 schemas, dependency injection, async handlers, error handling, and API versioning.

`rules/python-django/rule.mdc` | `rule` | Django web framework rules covering ORM patterns, view design, middleware, settings management, and security configuration.

`rules/django-rest/rule.mdc` | `rule` | Django REST Framework API development rules: serialisers, viewsets, permissions, filtering, and pagination patterns.

`rules/go-production/rule.mdc` | `rule` | Production Go patterns: error wrapping, interface design, concurrency with goroutines/channels, testing, and project layout conventions.

`rules/go-gin/rule.mdc` | `rule` | Go Gin web framework rules covering routing, middleware, request validation, error handling, and response formatting.

`rules/golang-api/rule.mdc` | `rule` | Go API development patterns: handler structure, middleware chaining, database access patterns, and graceful shutdown.

`rules/rust-production/rule.mdc` | `rule` | Production Rust patterns: ownership, error handling with `thiserror`/`anyhow`, async with Tokio, testing, and unsafe usage rules.

`rules/rust-actix/rule.mdc` | `rule` | Rust Actix-web framework rules covering actor model, extractors, middleware, error types, and state management.

`rules/rust-axum/rule.mdc` | `rule` | Rust Axum framework rules: routing, state injection, request extractors, error handling, and Tower middleware composition.

`rules/flutter-dart/rule.mdc` | `rule` | Flutter/Dart development rules: widget composition, state management (Riverpod/Bloc), async patterns, and platform channel conventions.

## Framework-Specific Rules

`rules/react/rule.mdc` | `rule` | React 18+ rules: functional components, hooks discipline, state co-location, performance (memo/useCallback), and accessibility.

`rules/react-typescript/rule.mdc` | `rule` | React with strict TypeScript rules: component prop typing, event handler types, generic components, and type-safe context patterns.

`rules/nextjs/rule.mdc` | `rule` | Next.js App Router rules: Server vs Client component boundaries, data fetching patterns, routing conventions, and metadata API.

`rules/nextjs-14-app-router/rule.mdc` | `rule` | Next.js 14 advanced App Router patterns: streaming, Suspense, parallel routes, intercepting routes, and Server Actions.

`rules/nextjs-app-router/rule.mdc` | `rule` | Next.js 14+ App Router patterns for Server Components, layout nesting, loading states, and cache revalidation.

`rules/nextjs-typescript/rule.mdc` | `rule` | Next.js with TypeScript patterns: typed route params, typed API routes, and strict page/layout prop contracts.

`rules/fullstack-nextjs-prisma/rule.mdc` | `rule` | Full-stack Next.js with Prisma ORM rules: schema design, type-safe queries, migrations, and server-action data mutation patterns.

`rules/mern-stack/rule.mdc` | `rule` | MERN stack (MongoDB, Express, React, Node) rules covering schema design, API structuring, React state, and environment configuration.

`rules/nodejs-express/rule.mdc` | `rule` | Node.js Express rules: middleware order, route organisation, error-handling middleware, async/await patterns, and security middleware.

`rules/nodejs-express-typescript/rule.mdc` | `rule` | Node.js Express with strict TypeScript rules: typed request/response, typed middleware, and repository pattern for data access.

`rules/svelte-kit/rule.mdc` | `rule` | SvelteKit application rules: load functions, form actions, stores, and SSR/CSR data flow patterns.

`rules/sveltekit/rule.mdc` | `rule` | SvelteKit with TypeScript rules covering routing, layout hierarchy, `+page.server.ts` patterns, and type-safe form actions.

`rules/vue3-composition/rule.mdc` | `rule` | Vue 3 Composition API rules: `<script setup>`, composable design, reactive patterns, and TypeScript integration.

`rules/mobile-react-native/rule.mdc` | `rule` | React Native mobile development rules: navigation, platform-specific code, performance (FlatList, image optimisation), and native module patterns.

`rules/t3-stack/rule.mdc` | `rule` | T3 Stack rules for Next.js, tRPC, Prisma, and Tailwind: type-safe API layer, end-to-end type propagation, and full-stack data flow.

## Styling Rules

`rules/tailwindcss/rule.mdc` | `rule` | Tailwind CSS utility-first rules: class ordering, component extraction with `@apply`, responsive design conventions, and dark mode patterns.

`rules/tailwind-ui/rule.mdc` | `rule` | Tailwind CSS UI component rules: accessible component patterns, design token usage, and consistent interactive state classes.

## Cloud / Infrastructure Rules

`rules/aws-serverless/rule.mdc` | `rule` | AWS Serverless rules (Lambda, CDK, SAM): function size limits, cold-start mitigation, IAM least-privilege, and infrastructure-as-code patterns.

`rules/devops-docker/rule.mdc` | `rule` | Docker and DevOps rules: multi-stage build patterns, image layer optimisation, compose service design, and container security.

`rules/docker-devops/rule.mdc` | `rule` | Docker/DevOps infrastructure rules (overlaps with devops-docker): container orchestration, health checks, volume management, and CI integration.

`rules/devops-infrastructure/rule.mdc` | `rule` | Infrastructure-as-code rules: Terraform/Pulumi module design, state management, secret injection, and environment promotion strategy.

## Domain-Specific Rules

`rules/ai-ml-python/rule.mdc` | `rule` | Production ML engineering rules: PyTorch model patterns, data pipeline design, experiment tracking, reproducibility, and model export/deployment.

`rules/langchain-ai/rule.mdc` | `rule` | LangChain/LLM application rules: LCEL chain composition, LangGraph agent patterns, prompt template management, RAG pipeline structure, and LLM call error handling.

`rules/chrome-extension/rule.mdc` | `rule` | Chrome Extension Manifest V3 rules: background service worker patterns, content script isolation, messaging architecture, and permissions minimisation.

`rules/supabase/rule.mdc` | `rule` | Supabase full-stack rules: RLS policy design, auth flow, typed client usage, and realtime subscription patterns.

`rules/supabase-fullstack/rule.mdc` | `rule` | Supabase full-stack with auth and storage rules covering edge functions, storage bucket policies, and database trigger patterns.

`rules/saas-starter/rule.mdc` | `rule` | SaaS starter template rules: multi-tenancy patterns, subscription and billing integration, onboarding flow, and feature-flag conventions.
