# File Inventory — awesome-cursorrules

All paths are relative to `.references/awesome-cursorrules/`.
READMEs, images, lock files, and licence files are excluded.

---

## Root

`.cursorrules` | rule | Repo-level meta-rules: how to organise, name, categorise, and maintain `.cursorrules` files in this collection.

---

## rules-new/ (`.mdc` scoped rules)

`rules-new/beefreeSDK.mdc` | rule | Installation, authentication, configuration, and template-management guidelines for building apps with the Beefree SDK no-code email editor.
`rules-new/clean-code.mdc` | rule | Clean-code principles: constants over magic numbers, meaningful names, single responsibility, DRY, encapsulation, and continuous refactoring.
`rules-new/codequality.mdc` | rule | Agent behaviour constraints: no apologies, file-by-file edits only, no uninvited changes, preserve existing code, single-chunk outputs, no summaries.
`rules-new/cpp.mdc` | rule | C++ programming guidelines covering safety, RAII, smart pointers, const-correctness, and modern C++ idioms.
`rules-new/database.mdc` | rule | Database best-practices for Prisma schema/migrations and Supabase RLS, auth, and query optimisation.
`rules-new/fastapi.mdc` | rule | FastAPI project structure, routing, Pydantic validation, dependency injection, and async handler patterns.
`rules-new/gitflow.mdc` | sop | Gitflow branching workflow: main/develop/feature/release/hotfix conventions, commit-message format, PR rules, semver tagging, and release/hotfix processes.
`rules-new/medusa.mdc` | rule | Medusa e-commerce development rules: always use Workflow SDK, create a step per workflow, use `transform` for data, throw `MedusaError`.
`rules-new/nativescript.mdc` | rule | NativeScript development guidelines for building cross-platform native mobile apps.
`rules-new/nextjs.mdc` | rule | Next.js coding standards covering App Router, server/client components, data fetching, and performance.
`rules-new/node-express.mdc` | rule | Node.js + Express API structure, middleware patterns, error handling, and security best practices.
`rules-new/python.mdc` | rule | Python/Flask/SQLite best practices: project structure, PEP 8, type hints, error handling, and testing.
`rules-new/react.mdc` | rule | React component design, hooks usage, state management, and performance optimisation guidelines.
`rules-new/rust.mdc` | rule | Rust best practices for Solana smart-contract development with the Anchor framework.
`rules-new/svelte.mdc` | rule | Svelte/SvelteKit development guidelines: component structure, reactivity, SSR, and routing conventions.
`rules-new/tailwind.mdc` | rule | Tailwind CSS usage guidelines: utility-first patterns, responsive design, and avoiding custom CSS.
`rules-new/typescript.mdc` | rule | TypeScript coding standards: prefer interfaces, strict mode, avoid `any`, leverage utility types and generics.
`rules-new/vue.mdc` | rule | Vue 3 Composition API and Nuxt 3 development guidelines, naming conventions, and component structure.

---

## rules/ (`.cursorrules` prompt files)

`rules/android-jetpack-compose-cursorrules-prompt-file/.cursorrules` | rule | Android Jetpack Compose coding standards: composable design, state hoisting, Material 3, and Kotlin idioms.
`rules/angular-novo-elements-cursorrules-prompt-file/.cursorrules` | rule | Angular + Novo Elements component and service coding standards with TypeScript best practices.
`rules/angular-typescript-cursorrules-prompt-file/.cursorrules` | rule | Angular TypeScript guidelines: module structure, dependency injection, reactive forms, and RxJS patterns.
`rules/ascii-simulation-game-cursorrules-prompt-file/.cursorrules` | rule | Game-design rules for a turn-based ASCII simulation game: grid layout, AI nation behaviour, resource/trade/war logic, observer-mode logging.
`rules/aspnet-abp-cursorrules-prompt-file/.cursorrules` | rule | ASP.NET ABP Framework coding standards: domain layer structure, application services, repository patterns, and DDD conventions.
`rules/astro-typescript-cursorrules-prompt-file/.cursorrules` | rule | Astro + TypeScript development guidelines: island architecture, component authoring, and static-site performance patterns.
`rules/beefreeSDK-nocode-content-editor-cursorrules-prompt-file/.cursorrules` | rule | Beefree SDK no-code email editor integration: configuration, customisation hooks, and template management patterns.
`rules/chrome-extension-dev-js-typescript-cursorrules-pro/.cursorrules` | rule | Chrome extension development guidelines: manifest v3, background service workers, content scripts, and permissions model.
`rules/code-guidelines-cursorrules-prompt-file/.cursorrules` | rule | Agent behaviour constraints (list format): verify before presenting, file-by-file changes, no apologies, no inventions, preserve existing code, handle edge cases, use assertions.
`rules/code-pair-interviews/.cursorrules` | rule | Code pair-interview agent rules: single responsibility, clean structure, meaningful names, handle edge cases, start simple then optimise.
`rules/code-style-consistency-cursorrules-prompt-file/.cursorrules` | sop | Codebase style-analysis procedure: examine multiple files, build a style profile, then generate new code that mirrors established naming, formatting, and architecture patterns.
`rules/convex-cursorrules-prompt-file/.cursorrules` | rule | Convex backend development guidelines: schema design, query/mutation patterns, real-time subscriptions, and authentication integration.
`rules/cpp-programming-guidelines-cursorrules-prompt-file/.cursorrules` | rule | C++ programming guidelines: RAII, smart pointers, const-correctness, error handling, and modern C++17/20 idioms.
`rules/cursor-ai-react-typescript-shadcn-ui-cursorrules-p/.cursorrules` | rule | React + TypeScript + shadcn/ui development standards: component patterns, Tailwind styling, and accessibility requirements.
`rules/cursorrules-cursor-ai-nextjs-14-tailwind-seo-setup/.cursorrules` | rule | Next.js 14 + Tailwind + SEO setup guidelines: App Router conventions, metadata API, image optimisation, and structured data.
`rules/cursorrules-cursor-ai-wordpress-draft-macos-prompt/.cursorrules` | rule | WordPress draft and macOS tooling guidelines for content creation and publishing workflows.
`rules/cursorrules-file-cursor-ai-python-fastapi-api/.cursorrules` | rule | Python FastAPI API development rules: route structure, Pydantic models, dependency injection, and async patterns.
`rules/cypress-accessibility-testing-cursorrules-prompt-file/.cursorrules` | prompt | Cypress accessibility test authoring: axe-core integration, WCAG 2.1 AA checks, auto-detect TypeScript, and remediation guidance.
`rules/cypress-api-testing-cursorrules-prompt-file/.cursorrules` | prompt | Cypress API test authoring: schema validation with cypress-ajv-schema-validator, status code checks, and data contract verification.
`rules/cypress-defect-tracking-cursorrules-prompt-file/.cursorrules` | prompt | Cypress defect-tracking procedure: tag tests with case IDs, use qa-shadow-report for structured reporting, link failures to test-management systems.
`rules/cypress-e2e-testing-cursorrules-prompt-file/.cursorrules` | prompt | Cypress E2E test authoring: critical user-flow coverage, data-testid selectors, cy.intercept mocking, and deterministic assertions.
`rules/cypress-integration-testing-cursorrules-prompt-file/.cursorrules` | prompt | Cypress integration test authoring: UI–API interaction verification, state-transition coverage, and cy.intercept response mocking.
`rules/deno-integration-techniques-cursorrules-prompt-fil/.cursorrules` | rule | Deno integration techniques: module imports, permissions model, standard library usage, and deployment patterns.
`rules/dragonruby-best-practices-cursorrules-prompt-file/.cursorrules` | rule | DragonRuby game-engine best practices: game-loop structure, input handling, sprite management, and performance patterns.
`rules/drupal-11-cursorrules-prompt-file/.cursorrules` | rule | Drupal 11 development guidelines: module structure, hook system, entity API, and theming conventions.
`rules/elixir-engineer-guidelines-cursorrules-prompt-file/.cursorrules` | rule | Elixir engineering guidelines: functional patterns, OTP supervision trees, Phoenix conventions, and error handling.
`rules/elixir-phoenix-docker-setup-cursorrules-prompt-fil/.cursorrules` | rule | Elixir + Phoenix + Docker setup rules: containerisation, environment configuration, database migration, and deployment.
`rules/engineering-ticket-template-cursorrules-prompt-file/.cursorrules` | prompt | Engineering ticket generation: structured templates (description, technical context, acceptance criteria, estimation) in both list and Given-When-Then BDD formats.
`rules/es-module-nodejs-guidelines-cursorrules-prompt-fil/.cursorrules` | rule | ES module Node.js guidelines: import/export syntax, top-level await, module resolution, and interop with CommonJS.
`rules/flutter-app-expert-cursorrules-prompt-file/.cursorrules` | rule | Flutter app development expert rules: widget composition, state management, Dart idioms, and platform channel patterns.
`rules/flutter-development-guidelines-cursorrules-prompt-file/.cursorrules` | rule | Flutter development guidelines: BLoC pattern, responsive layouts, localisation, and testing strategies.
`rules/flutter-riverpod-cursorrules-prompt-file/.cursorrules` | rule | Flutter + Riverpod state-management rules: provider structure, async notifiers, dependency injection, and testing patterns.
`rules/gherkin-style-testing-cursorrules-prompt-file/.cursorrules` | prompt | Gherkin (Given-When-Then) test documentation procedure: convert technical scripts to BDD scenarios, use plain language, include data tables and background steps.
`rules/git-conventional-commit-messages/.cursorrules` | sop | Conventional Commits specification: type prefixes (feat/fix/docs/refactor/etc.), scope, breaking-change footer, semver correlation, and RFC 2119 parsing rules.
`rules/github-code-quality-cursorrules-prompt-file/.cursorrules` | rule | JSON-encoded code quality rules with regex triggers: verify before presenting, no apologies, no summaries, preserve existing code, single-chunk edits.
`rules/github-cursorrules-prompt-file-instructions/.cursorrules` | rule | Clean-code principles article embedded as agent instruction: avoid magic numbers, meaningful names, single responsibility, DRY, and continuous refactoring.
`rules/go-backend-scalability-cursorrules-prompt-file/.cursorrules` | rule | Go backend pair-programming assistant covering databases, REST/GraphQL/gRPC APIs, performance, scalability, security, and caching strategies.
`rules/go-servemux-rest-api-cursorrules-prompt-file/.cursorrules` | rule | Go ServeMux REST API guidelines: handler structure, middleware composition, error handling, and idiomatic Go patterns.
`rules/go-temporal-dsl-prompt-file/.cursorrules` | rule | Go Temporal DSL workflow and activity rules: multi-file rule set covering workflow design, activity definitions, and example usage.
`rules/graphical-apps-development-cursorrules-prompt-file/.cursorrules` | rule | Graphical application development guidelines: rendering architecture, event handling, UI component patterns, and cross-platform considerations.
`rules/how-to-documentation-cursorrules-prompt-file/.cursorrules` | prompt | How-to documentation authoring procedure: action-oriented titles, numbered steps, expected results, troubleshooting, and converting test scripts to user-friendly guides.
`rules/html-tailwind-css-javascript-cursorrules-prompt-fi/.cursorrules` | rule | HTML + Tailwind CSS + JavaScript development guidelines: semantic markup, utility-class patterns, and vanilla JS interaction patterns.
`rules/htmx-basic-cursorrules-prompt-file/.cursorrules` | rule | HTMX development guidelines: attribute-driven interactions, server-side rendering integration, and progressive enhancement patterns.
`rules/htmx-django-cursorrules-prompt-file/.cursorrules` | rule | HTMX + Django integration rules: partial template responses, CSRF handling, and server-driven UI patterns.
`rules/htmx-flask-cursorrules-prompt-file/.cursorrules` | rule | HTMX + Flask integration rules: partial template responses, route design, and server-driven UI patterns.
`rules/htmx-go-basic-cursorrules-prompt-file/.cursorrules` | rule | HTMX + Go integration rules: partial HTML responses, routing, and server-driven UI patterns with Go's standard library.
`rules/htmx-go-fiber-cursorrules-prompt-file/.cursorrules` | rule | HTMX + Go Fiber integration rules: middleware, partial template responses, and server-driven UI with the Fiber framework.
`rules/java-general-purpose-cursorrules-prompt-file/.cursorrules` | rule | Java general-purpose development guidelines: OOP principles, exception handling, Java 17+ features, and Maven/Gradle conventions.
`rules/java-springboot-jpa-cursorrules-prompt-file/.cursorrules` | rule | Java Spring Boot + JPA development rules: entity design, repository patterns, service layer, REST controller conventions, and transaction management.
`rules/javascript-astro-tailwind-css-cursorrules-prompt-f/.cursorrules` | rule | JavaScript + Astro + Tailwind CSS development guidelines: component islands, content collections, and styling conventions.
`rules/javascript-chrome-apis-cursorrules-prompt-file/.cursorrules` | rule | JavaScript Chrome API guidelines: extension permissions, service workers, messaging, and storage API patterns.
`rules/javascript-typescript-code-quality-cursorrules-pro/.cursorrules` | rule | JavaScript/TypeScript code quality rules: strict typing, naming conventions, async patterns, and linting standards.
`rules/jest-unit-testing-cursorrules-prompt-file/.cursorrules` | prompt | Jest unit test authoring: mock dependencies before imports, test valid/invalid/edge inputs, group with describe blocks, auto-detect TypeScript.
`rules/knative-istio-typesense-gpu-cursorrules-prompt-fil/.cursorrules` | rule | Knative + Istio + Typesense + GPU infrastructure guidelines: service mesh, event-driven scaling, search integration, and GPU workload configuration.
`rules/kotlin-ktor-development-cursorrules-prompt-file/.cursorrules` | rule | Kotlin + Ktor server development guidelines: routing, serialisation, authentication, and coroutine-based async patterns.
`rules/kotlin-springboot-best-practices-cursorrules-prompt-file/.cursorrules` | rule | Kotlin + Spring Boot best practices: null safety, data classes, coroutines, and idiomatic Kotlin with Spring conventions.
`rules/kubernetes-mkdocs-documentation-cursorrules-prompt/.cursorrules` | rule | Kubernetes + MkDocs documentation guidelines: manifest structure, Helm chart conventions, and technical documentation authoring.
`rules/laravel-php-83-cursorrules-prompt-file/.cursorrules` | rule | Laravel PHP 8.3 development guidelines: Eloquent ORM patterns, service providers, queues, and modern PHP 8.x features.
`rules/laravel-tall-stack-best-practices-cursorrules-prom/.cursorrules` | rule | Laravel TALL stack (Tailwind, Alpine, Livewire, Laravel) best practices: component design, reactive UI, and full-stack conventions.
`rules/linux-nvidia-cuda-python-cursorrules-prompt-file/.cursorrules` | rule | Linux + NVIDIA CUDA + Python development guidelines: GPU kernel authoring, memory management, and Python CUDA integration patterns.
`rules/manifest-yaml-cursorrules-prompt-file/.cursorrules` | prompt | Manifest backend app generation: always apply prompt to produce demo-quality data-structure apps using Manifest YAML config, showcasing varied property types.
`rules/medusa-cursorrules/.cursorrules` | rule | Medusa e-commerce rules: use Workflow SDK for all business logic, create per-feature workflow steps, use `transform`, throw `MedusaError`, use Query for data retrieval.
`rules/nativescript-cursorrules-prompt-file/.cursorrules` | rule | NativeScript cross-platform mobile development guidelines: native API access, component lifecycle, and TypeScript conventions.
`rules/netlify-official-cursorrules-prompt-file/.cursorrules` | rule | Netlify platform guidelines: serverless/edge/background/scheduled functions, Blobs storage, Image CDN, no CORS headers unless explicit, and `netlify dev` usage.
`rules/next-type-llm/.cursorrules` | rule | Next.js + TypeScript + LLM integration rules: frontend/backend split, Python LLM wrapper connection, modularity-first coding style with DRY and security priorities.
`rules/nextjs-app-router-cursorrules-prompt-file/.cursorrules` | rule | Next.js App Router guidelines: server/client component boundaries, RSC patterns, metadata API, and route-handler conventions.
`rules/nextjs-material-ui-tailwind-css-cursorrules-prompt/.cursorrules` | rule | Next.js + Material UI + Tailwind CSS development standards: theming, component overrides, and styling coexistence patterns.
`rules/nextjs-react-tailwind-cursorrules-prompt-file/.cursorrules` | rule | Next.js + React + Tailwind CSS development guidelines: component structure, styling conventions, and data-fetching patterns.
`rules/nextjs-react-typescript-cursorrules-prompt-file/.cursorrules` | rule | Next.js + React + TypeScript development standards: strict typing, component patterns, and server/client data flow.
`rules/nextjs-seo-dev-cursorrules-prompt-file/.cursorrules` | rule | Next.js SEO development guidelines: metadata API, structured data, Open Graph, sitemap generation, and Core Web Vitals.
`rules/nextjs-supabase-shadcn-pwa-cursorrules-prompt-file/.cursorrules` | rule | Next.js + Supabase + shadcn/ui PWA development rules: auth flow, RLS policies, offline support, and service worker patterns.
`rules/nextjs-supabase-todo-app-cursorrules-prompt-file/.cursorrules` | rule | Next.js + Supabase todo-app development conventions: CRUD patterns, auth, real-time subscriptions, and deployment.
`rules/nextjs-tailwind-typescript-apps-cursorrules-prompt/.cursorrules` | rule | Next.js + Tailwind + TypeScript application development guidelines: project structure, component design, and type safety.
`rules/nextjs-typescript-app-cursorrules-prompt-file/.cursorrules` | rule | Next.js + TypeScript application coding standards: routing, API routes, typing conventions, and deployment configuration.
`rules/nextjs-typescript-cursorrules-prompt-file/.cursorrules` | rule | Next.js + TypeScript coding standards: strict typing, naming conventions, and performance optimisation.
`rules/nextjs-typescript-tailwind-cursorrules-prompt-file/.cursorrules` | rule | Next.js + TypeScript + Tailwind CSS development guidelines: styling conventions, responsive design, and component organisation.
`rules/nextjs-vercel-supabase-cursorrules-prompt-file/.cursorrules` | rule | Next.js + Vercel + Supabase deployment and development rules: environment configuration, edge functions, and database access patterns.
`rules/nextjs-vercel-typescript-cursorrules-prompt-file/.cursorrules` | rule | Next.js + Vercel + TypeScript deployment and coding standards: ISR, edge runtime, and type-safe API routes.
`rules/nextjs15-react19-vercelai-tailwind-cursorrules-prompt-file/.cursorrules` | rule | Next.js 15 + React 19 + Vercel AI SDK + Tailwind development rules: streaming, server actions, AI integration, and modern React patterns.
`rules/nodejs-mongodb-cursorrules-prompt-file-tutorial/.cursorrules` | rule | Node.js + MongoDB development tutorial guidelines: Mongoose schema design, CRUD patterns, authentication, and error handling.
`rules/nodejs-mongodb-jwt-express-react-cursorrules-promp/.cursorrules` | rule | Node.js + MongoDB + JWT + Express + React full-stack guidelines: auth flow, REST API design, and client-server data contracts.
`rules/optimize-dry-solid-principles-cursorrules-prompt-f/.cursorrules` | rule | DRY/SOLID optimisation prompt: clarify before implementing, annotate file names in code blocks, stick to existing architecture unless told otherwise.
`rules/optimize-rell-blockchain-code-cursorrules-prompt-f/.cursorrules` | rule | Rell blockchain code optimisation guidelines for Chromia smart-contract development.
`rules/pandas-scikit-learn-guide-cursorrules-prompt-file/.cursorrules` | rule | Pandas + scikit-learn data science guidelines: data cleaning, feature engineering, model training, evaluation, and pipeline conventions.
`rules/plasticode-telegram-api-cursorrules-prompt-file/.cursorrules` | rule | Plasticode + Telegram API development guidelines for building Telegram bot applications.
`rules/playwright-accessibility-testing-cursorrules-prompt-file/.cursorrules` | prompt | Playwright accessibility test authoring: @axe-core/playwright WCAG compliance checks, auto-detect TypeScript, and violation remediation guidance.
`rules/playwright-api-testing-cursorrules-prompt-file/.cursorrules` | prompt | Playwright API test authoring: pw-api-plugin for schema validation, status code assertions, and deterministic API contract checks.
`rules/playwright-defect-tracking-cursorrules-prompt-file/.cursorrules` | prompt | Playwright defect-tracking procedure: case-ID tagging in square brackets, qa-shadow-report integration, and structured failure reporting.
`rules/playwright-e2e-testing-cursorrules-prompt-file/.cursorrules` | prompt | Playwright E2E test authoring: auto-waiting, semantic selectors, page.route mocking, and critical user-flow coverage.
`rules/playwright-integration-testing-cursorrules-prompt-file/.cursorrules` | prompt | Playwright integration test authoring: UI–API interaction verification, page.route mocking, and state-transition assertions across components.
`rules/pr-template-cursorrules-prompt-file/.cursorrules` | prompt | PR template generation for GitHub/GitLab/Azure DevOps: purpose, implementation details, testing evidence, impact assessment, and review checklist in platform-specific Markdown.
`rules/project-epic-template-cursorrules-prompt-file/.cursorrules` | prompt | Epic and user story generation: strategic context, success metrics, INVEST-compliant user stories, acceptance criteria, definition of done, and sprint estimation.
`rules/py-fast-api/.cursorrules` | rule | Python FastAPI concise coding guidelines: type annotations, async handlers, Pydantic validation, and dependency injection.
`rules/pyqt6-eeg-processing-cursorrules-prompt-file/.cursorrules` | rule | PyQt6 + EEG signal processing development guidelines: GUI layout, real-time data handling, signal processing pipeline, and Qt threading patterns.
`rules/python--typescript-guide-cursorrules-prompt-file/.cursorrules` | rule | Combined Python + TypeScript development guide: cross-language conventions, type safety, project structure, and integration patterns.
`rules/python-312-fastapi-best-practices-cursorrules-prom/.cursorrules` | rule | Python 3.12 + FastAPI best practices: new language features, async patterns, Pydantic v2, and performance optimisation.
`rules/python-containerization-cursorrules-prompt-file/.cursorrules` | rule | Python + containerisation guidelines: Dockerfile authoring, Docker Compose configuration, and deployment best practices following official Python docs.
`rules/python-cursorrules-prompt-file-best-practices/.cursorrules` | rule | Python best practices: PEP 8, type hints, exception handling, testing conventions, and code organisation.
`rules/python-developer-cursorrules-prompt-file/.cursorrules` | rule | Python developer guidelines: idiomatic Python, module structure, dependency management, logging, and documentation patterns.
`rules/python-django-best-practices-cursorrules-prompt-fi/.cursorrules` | rule | Python Django best practices: model design, CBV/FBV patterns, ORM optimisation, middleware, and deployment configuration.
`rules/python-fastapi-best-practices-cursorrules-prompt-f/.cursorrules` | rule | Python FastAPI best practices: project structure, async operations, dependency injection, error handling, and API versioning.
`rules/python-fastapi-cursorrules-prompt-file/.cursorrules` | rule | Python FastAPI development rules: route design, Pydantic schemas, authentication, and background-task patterns.
`rules/python-fastapi-scalable-api-cursorrules-prompt-fil/.cursorrules` | rule | Python FastAPI scalable API guidelines: multi-tenant architecture, caching, rate limiting, and horizontal scaling patterns.
`rules/python-flask-json-guide-cursorrules-prompt-file/.cursorrules` | rule | Python Flask + JSON API development guide: route design, request/response serialisation, error handling, and testing patterns.
`rules/python-github-setup-cursorrules-prompt-file/.cursorrules` | config | JSON-structured project configuration: coding style, naming conventions, error handling, testing (80% coverage), documentation, security, version control (GitHub Flow + Conventional Commits), and logging rules.
`rules/python-llm-ml-workflow-cursorrules-prompt-file/.cursorrules` | rule | Python ML/LLM workflow rules: full stack config (Poetry, Ruff, pytest, FastAPI, LangChain), type annotations, 90% test coverage, async I/O, prompt-template module, and experiment logging.
`rules/python-projects-guide-cursorrules-prompt-file/.cursorrules` | rule | Python project structure guidelines: package layout, dependency management, configuration, logging, and code organisation best practices.
`rules/pytorch-scikit-learn-cursorrules-prompt-file/.cursorrules` | rule | PyTorch + scikit-learn ML development guidelines: model architecture, training loop, evaluation, and pipeline conventions.
`rules/qa-bug-report-cursorrules-prompt-file/.cursorrules` | prompt | QA bug report authoring procedure: structured template (environment, severity, reproduction steps, expected vs actual, logs), severity taxonomy, and best-practice writing guidelines.
`rules/qwik-basic-cursorrules-prompt-file/.cursorrules` | rule | Qwik framework development guidelines: resumability, lazy-loading, component authoring, and routing conventions.
`rules/qwik-tailwind-cursorrules-prompt-file/.cursorrules` | rule | Qwik + Tailwind CSS development guidelines: resumable components, utility-class styling, and performance patterns.
`rules/r-cursorrules-prompt-file-best-practices/.cursorrules` | rule | R language best practices: tidyverse conventions, data wrangling, visualisation with ggplot2, and reproducible analysis patterns.
`rules/rails-cursorrules-prompt-file/.cursorrules` | rule | Ruby on Rails development guidelines: MVC conventions, ActiveRecord patterns, testing with RSpec, and deployment configuration.
`rules/react-chakra-ui-cursorrules-prompt-file/.cursorrules` | rule | React + Chakra UI development guidelines: theming, component composition, accessibility, and responsive design patterns.
`rules/react-components-creation-cursorrules-prompt-file/.cursorrules` | rule | React component creation guidelines: composability, props design, hooks conventions, and component documentation.
`rules/react-graphql-apollo-client-cursorrules-prompt-file/.cursorrules` | rule | React + GraphQL + Apollo Client guidelines: query/mutation patterns, cache management, error handling, and type generation.
`rules/react-mobx-cursorrules-prompt-file/.cursorrules` | rule | React + MobX state management guidelines: observable design, action patterns, computed values, and store architecture.
`rules/react-native-expo-cursorrules-prompt-file/.cursorrules` | rule | React Native + Expo development guidelines: navigation, native modules, platform-specific code, and build configuration.
`rules/react-native-expo-router-typescript-windows-cursorrules-prompt-file/.cursorrules` | rule | React Native + Expo Router + TypeScript (Windows) development rules: file-based routing, typed navigation, and Windows platform considerations.
`rules/react-nextjs-ui-development-cursorrules-prompt-fil/.cursorrules` | rule | React + Next.js UI development guidelines: component architecture, server/client boundaries, design-system conventions, and accessibility.
`rules/react-query-cursorrules-prompt-file/.cursorrules` | rule | React Query (TanStack Query) development guidelines: query key structure, cache configuration, mutation patterns, and optimistic updates.
`rules/react-redux-typescript-cursorrules-prompt-file/.cursorrules` | rule | React + Redux + TypeScript development guidelines: RTK slice design, typed store, thunk/saga patterns, and selector conventions.
`rules/react-styled-components-cursorrules-prompt-file/.cursorrules` | rule | React + styled-components guidelines: component styling, theming, prop-based styles, and global style conventions.
`rules/react-typescript-nextjs-nodejs-cursorrules-prompt-/.cursorrules` | rule | React + TypeScript + Next.js + Node.js full-stack guidelines: end-to-end type safety, API contract, and monorepo structure.
`rules/react-typescript-symfony-cursorrules-prompt-file/.cursorrules` | rule | React + TypeScript + Symfony full-stack guidelines: API Platform integration, type-safe client, and authentication patterns.
`rules/salesforce-apex-cursorrules-prompt-file/.cursorrules` | rule | Salesforce Apex development guidelines: governor limits, SOQL best practices, trigger frameworks, and test class conventions.
`rules/scala-kafka-cursorrules-prompt-file/.cursorrules` | rule | Scala + Kafka development guidelines: producer/consumer patterns, Akka Streams integration, and fault-tolerant stream processing.
`rules/solidity-foundry-cursorrules-prompt-file/.cursorrules` | rule | Solidity smart-contract security rules with Foundry: concise code, accuracy-first, security-awareness, and test-driven contract development.
`rules/solidity-hardhat-cursorrules-prompt-file/.cursorrules` | rule | Solidity smart-contract development with Hardhat: compilation, testing, deployment scripts, and Ethers.js integration.
`rules/solidity-react-blockchain-apps-cursorrules-prompt-/.cursorrules` | rule | Solidity + React blockchain app development guidelines: contract interaction, wallet integration, and event-driven UI patterns.
`rules/solidjs-basic-cursorrules-prompt-file/.cursorrules` | rule | SolidJS development guidelines: fine-grained reactivity, signals, stores, and component authoring conventions.
`rules/solidjs-tailwind-cursorrules-prompt-file/.cursorrules` | rule | SolidJS + Tailwind CSS development guidelines: reactive components, utility-class styling, and SSR patterns.
`rules/solidjs-typescript-cursorrules-prompt-file/.cursorrules` | rule | SolidJS + TypeScript development standards: typed signals, component props, and strict-mode conventions.
`rules/svelte-5-vs-svelte-4-cursorrules-prompt-file/.cursorrules` | rule | Svelte 5 vs Svelte 4 migration guidelines: runes syntax, reactivity model changes, and migration patterns.
`rules/sveltekit-restful-api-tailwind-css-cursorrules-pro/.cursorrules` | rule | SvelteKit + RESTful API + Tailwind CSS guidelines: server routes, form actions, load functions, and styling conventions.
`rules/sveltekit-tailwindcss-typescript-cursorrules-promp/.cursorrules` | rule | SvelteKit + Tailwind CSS + TypeScript development guidelines: file-based routing, typed load functions, and component patterns.
`rules/sveltekit-typescript-guide-cursorrules-prompt-file/.cursorrules` | rule | SvelteKit + TypeScript development guide: routing, server-side data loading, typed stores, and deployment configuration.
`rules/swift-uikit-cursorrules-prompt-file/.cursorrules` | rule | Swift + UIKit development guidelines: MVC/MVVM patterns, Auto Layout, view-controller lifecycle, and Swift idioms.
`rules/swiftui-guidelines-cursorrules-prompt-file/.cursorrules` | rule | SwiftUI development guidelines: declarative UI patterns, state management with Combine/SwiftUI state, and modifer conventions.
`rules/tailwind-css-nextjs-guide-cursorrules-prompt-file/.cursorrules` | rule | Tailwind CSS + Next.js integration guide: utility-first patterns, responsive design, custom theming, and component organisation.
`rules/tailwind-react-firebase-cursorrules-prompt-file/.cursorrules` | rule | Tailwind + React + Firebase development guidelines: Auth, Firestore, real-time listeners, and security rules.
`rules/tailwind-shadcn-ui-integration-cursorrules-prompt-/.cursorrules` | rule | Tailwind + shadcn/ui integration guidelines: component theming, CSS variable customisation, and accessibility patterns.
`rules/tauri-svelte-typescript-guide-cursorrules-prompt-f/.cursorrules` | rule | Tauri + Svelte + TypeScript desktop application guidelines: IPC, native API access, build configuration, and security model.
`rules/temporal-python-cursorrules/.cursorrules` | rule | Temporal Python SDK workflow orchestration rules: `@workflow.defn`/`@activity.defn` decorators, naming suffixes, error handling, and retry policies.
`rules/testrail-test-case-cursorrules-prompt-file/.cursorrules` | prompt | TestRail test case authoring procedure: structured template (section, priority, type, preconditions, steps/expected results, post-conditions, automation status), CSV export format, and best-practice guidelines.
`rules/typescript-axios-cursorrules-prompt-file/.cursorrules` | rule | TypeScript + Axios HTTP client guidelines: typed request/response, interceptors, error handling, and API service patterns.
`rules/typescript-clasp-cursorrules-prompt-file/.cursorrules` | rule | TypeScript + CLASP (Google Apps Script) development guidelines: project structure, deployment, and GAS API integration.
`rules/typescript-code-convention-cursorrules-prompt-file/.cursorrules` | rule | TypeScript code convention rules: naming, module structure, strict-mode enforcement, and documentation standards.
`rules/typescript-expo-jest-detox-cursorrules-prompt-file/.cursorrules` | rule | TypeScript + Expo + Jest + Detox mobile testing guidelines: unit and E2E test setup, mocking patterns, and CI integration.
`rules/typescript-llm-tech-stack-cursorrules-prompt-file/.cursorrules` | rule | TypeScript LLM tech-stack guidelines: OpenAI/Anthropic SDK usage, prompt management, streaming, and type-safe AI integration.
`rules/typescript-nestjs-best-practices-cursorrules-promp/.cursorrules` | rule | TypeScript + NestJS best practices: module architecture, dependency injection, guards/interceptors, and testing patterns.
`rules/typescript-nextjs-cursorrules-prompt-file/.cursorrules` | rule | TypeScript + Next.js development standards: strict typing, App Router, server actions, and API route type safety.
`rules/typescript-nextjs-react-cursorrules-prompt-file/.cursorrules` | rule | TypeScript + Next.js + React development guidelines: component typing, data-fetching patterns, and type-safe routing.
`rules/typescript-nextjs-react-tailwind-supabase-cursorru/.cursorrules` | rule | TypeScript + Next.js + React + Tailwind + Supabase full-stack guidelines: auth, RLS, typed database client, and styling conventions.
`rules/typescript-nextjs-supabase-cursorrules-prompt-file/.cursorrules` | rule | TypeScript + Next.js + Supabase development rules: typed Supabase client, server-side auth, and RLS integration.
`rules/typescript-nodejs-nextjs-ai-cursorrules-prompt-fil/.cursorrules` | rule | TypeScript + Node.js + Next.js + AI development guidelines: LLM integration, streaming, type safety, and server-side rendering.
`rules/typescript-nodejs-nextjs-app-cursorrules-prompt-fi/.cursorrules` | rule | TypeScript + Node.js + Next.js application development standards: project structure, API design, and end-to-end type safety.
`rules/typescript-nodejs-nextjs-react-ui-css-cursorrules-/.cursorrules` | rule | TypeScript + Node.js + Next.js + React + CSS UI development guidelines: component architecture, styling patterns, and full-stack conventions.
`rules/typescript-nodejs-react-vite-cursorrules-prompt-fi/.cursorrules` | rule | TypeScript + Node.js + React + Vite development guidelines: build configuration, HMR, module resolution, and component patterns.
`rules/typescript-react-cursorrules-prompt-file/.cursorrules` | rule | TypeScript + React development standards: strict component typing, hooks patterns, and prop-drilling vs context decisions.
`rules/typescript-react-nextjs-cloudflare-cursorrules-pro/.cursorrules` | rule | TypeScript + React + Next.js + Cloudflare deployment guidelines: edge runtime, Workers, CDN configuration, and performance.
`rules/typescript-react-nextui-supabase-cursorrules-promp/.cursorrules` | rule | TypeScript + React + NextUI + Supabase development guidelines: component theming, auth integration, and database access patterns.
`rules/typescript-shadcn-ui-nextjs-cursorrules-prompt-fil/.cursorrules` | rule | TypeScript + shadcn/ui + Next.js development guidelines: component theming, accessibility, and App Router integration.
`rules/typescript-vite-tailwind-cursorrules-prompt-file/.cursorrules` | rule | TypeScript + Vite + Tailwind CSS development guidelines: build optimisation, hot module replacement, and styling conventions.
`rules/typescript-vuejs-cursorrules-prompt-file/.cursorrules` | rule | TypeScript + Vue.js development guidelines: Composition API, typed props/emits, and Pinia state management.
`rules/typescript-zod-tailwind-nextjs-cursorrules-prompt-/.cursorrules` | rule | TypeScript + Zod + Tailwind + Next.js development rules: runtime schema validation, form handling, and type-safe API contracts.
`rules/typo3cms-extension-cursorrules-prompt-file/.cursorrules` | rule | TYPO3 CMS extension development guidelines: Extbase MVC, TypoScript, ViewHelper conventions, and TCA configuration.
`rules/uikit-guidelines-cursorrules-prompt-file/.cursorrules` | rule | UIKit iOS development guidelines: view-controller patterns, Auto Layout, UIKit lifecycle, and Swift integration conventions.
`rules/unity-cursor-ai-c-cursorrules-prompt-file/.cursorrules` | rule | Unity C# game development guidelines: MonoBehaviour lifecycle, component architecture, physics, and editor scripting conventions.
`rules/vitest-unit-testing-cursorrules-prompt-file/.cursorrules` | prompt | Vitest unit test authoring: vi.mock dependency injection, TypeScript auto-detection, edge-case coverage, and describe-block organisation.
`rules/vscode-extension-dev-typescript-cursorrules-prompt-file/.cursorrules` | rule | VS Code extension development guidelines: activation events, contribution points, command registration, and extension API patterns.
`rules/vue-3-nuxt-3-development-cursorrules-prompt-file/.cursorrules` | rule | Vue 3 + Nuxt 3 development guidelines: Composition API, auto-imports, SSR, and Nitro server routes.
`rules/vue-3-nuxt-3-typescript-cursorrules-prompt-file/.cursorrules` | rule | Vue 3 + Nuxt 3 + TypeScript development standards: typed composables, defineComponent, and strict-mode conventions.
`rules/vue3-composition-api-cursorrules-prompt-file/.cursorrules` | rule | Vue 3 Composition API guidelines: setup(), reactive/ref, composable patterns, and lifecycle hook usage.
`rules/web-app-optimization-cursorrules-prompt-file/.cursorrules` | rule | Web app optimisation guidelines using SvelteKit: SSR, minimal JS, performance-first development, and file-based routing conventions.
`rules/webassembly-z80-cellular-automata-cursorrules-prom/.cursorrules` | rule | WebAssembly + Z80 emulator + cellular automata development guidelines: WASM compilation, binary format, and simulation loop design.
`rules/wordpress-php-guzzle-gutenberg-cursorrules-prompt-/.cursorrules` | rule | WordPress + PHP + Guzzle + Gutenberg development guidelines: plugin architecture, REST API, block development, and HTTP client patterns.
`rules/xian-smart-contracts-cursor-rules-prompt-file/.cursorrules` | rule | Xian blockchain smart-contract development rules: Python-native contract syntax, naming constraints, state variables, token standards, and security patterns.
`rules/xray-test-case-cursorrules-prompt-file/.cursorrules` | prompt | Xray (Jira) test case authoring procedure: structured template (summary, priority, labels, preconditions, steps, expected results, test data, linked issues), data-driven sets, and Jira annotation.
