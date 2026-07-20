# File Inventory — awesome-subagents

Scanned: `/Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-subagents`
Relevant files: 140 (129 agent definitions, 6 skills/tools, 5 config files)

---

## Config

```
CLAUDE.md | config | Project-level rules for Claude Code: subagent file format, tool-permission tiers, contributing workflow, and storage paths (project vs global).
.claude/settings.local.json | config | Bash permission allowlist scoping what shell commands Claude Code may run in this repo.
.claude-plugin/marketplace.json | config | Plugin registry mapping 10 category bundles to their source directories with keywords for auto-selection.
```

Each of the 10 category directories also contains a manifest:
```
categories/01-core-development/.claude-plugin/plugin.json | config | Bundle manifest listing all agent files in the Core Development category.
categories/02-language-specialists/.claude-plugin/plugin.json | config | Bundle manifest listing all agent files in the Language Specialists category.
categories/03-infrastructure/.claude-plugin/plugin.json | config | Bundle manifest listing all agent files in the Infrastructure category.
categories/04-quality-security/.claude-plugin/plugin.json | config | Bundle manifest listing all agent files in the Quality & Security category.
categories/05-data-ai/.claude-plugin/plugin.json | config | Bundle manifest listing all agent files in the Data & AI category.
categories/06-developer-experience/.claude-plugin/plugin.json | config | Bundle manifest listing all agent files in the Developer Experience category.
categories/07-specialized-domains/.claude-plugin/plugin.json | config | Bundle manifest listing all agent files in the Specialized Domains category.
categories/08-business-product/.claude-plugin/plugin.json | config | Bundle manifest listing all agent files in the Business & Product category.
categories/09-meta-orchestration/.claude-plugin/plugin.json | config | Bundle manifest listing all agent files in the Meta-Orchestration category.
categories/10-research-analysis/.claude-plugin/plugin.json | config | Bundle manifest listing all agent files in the Research & Analysis category.
```

---

## Skills / Tools (slash commands)

```
tools/subagent-catalog/fetch.md | skill | Step-by-step procedure to resolve an agent name, fetch its full definition from the GitHub catalog, and offer save/customize/spawn options.
tools/subagent-catalog/search.md | skill | Procedure to search the cached catalog by name, description, or category and return a formatted table of matching agents with GitHub links.
tools/subagent-catalog/list.md | skill | Procedure to ensure cache freshness then parse and display all 10 categories with their agent lists.
tools/subagent-catalog/invalidate.md | skill | Procedure to delete the local catalog cache and optionally force-refresh it from the upstream repo.
tools/subagent-catalog/config.sh | config | Shared bash config and helpers for catalog caching: TTL management, atomic fetch, stale-fallback, and invalidation logic.
```

---

## Agents — 01 Core Development

```
categories/01-core-development/api-designer.md | agent | Designs REST/GraphQL endpoints, OpenAPI docs, auth patterns, and API versioning strategies with a structured checklist and communication protocol.
categories/01-core-development/backend-developer.md | agent | Builds server-side APIs and microservices with a phased workflow covering architecture, scalable patterns, and production readiness.
categories/01-core-development/electron-pro.md | agent | Develops Electron desktop apps covering native OS integration, cross-platform distribution, security hardening, and signed installers.
categories/01-core-development/frontend-developer.md | agent | Builds complete frontend applications across React, Vue, and Angular with multi-framework expertise and full-stack integration patterns.
categories/01-core-development/fullstack-developer.md | agent | Builds cohesive features spanning database, API, and frontend layers in a single coordinated workflow.
categories/01-core-development/graphql-architect.md | agent | Designs and evolves GraphQL schemas across microservices, implements federation architectures, and optimises query performance.
categories/01-core-development/microservices-architect.md | agent | Decomposes monoliths into microservices and establishes inter-service communication patterns for distributed systems at scale.
categories/01-core-development/mobile-developer.md | agent | Builds cross-platform mobile apps (React Native/Flutter) targeting >80% code sharing with native iOS/Android excellence.
categories/01-core-development/ui-designer.md | agent | Designs visual interfaces, component libraries, and design systems with accessibility and interaction-pattern checklists.
categories/01-core-development/websocket-engineer.md | agent | Implements real-time bidirectional communication using WebSockets/Socket.IO with scaling and fault-tolerance procedures.
```

---

## Agents — 02 Language Specialists

```
categories/02-language-specialists/angular-architect.md | agent | Architects enterprise Angular 15+ apps with complex state management, RxJS patterns, and micro-frontend systems.
categories/02-language-specialists/cpp-pro.md | agent | Builds high-performance C++20/23 systems with template metaprogramming and zero-overhead abstractions.
categories/02-language-specialists/csharp-developer.md | agent | Builds ASP.NET Core APIs with async patterns, dependency injection, Entity Framework optimisation, and clean architecture.
categories/02-language-specialists/django-developer.md | agent | Builds Django 4+ web apps and REST APIs with async views and enterprise patterns.
categories/02-language-specialists/dotnet-core-expert.md | agent | Builds cloud-native .NET Core apps with minimal APIs, high-performance microservices, and cross-platform deployment.
categories/02-language-specialists/dotnet-framework-4.8-expert.md | agent | Maintains and modernises legacy .NET Framework 4.8 enterprise applications with Windows-based infrastructure integration.
categories/02-language-specialists/elixir-expert.md | agent | Builds fault-tolerant, concurrent Elixir/OTP systems with GenServer architectures and Phoenix real-time features.
categories/02-language-specialists/expo-react-native-expert.md | agent | Builds Expo/React Native mobile apps with native modules, navigation, push notifications, OTA updates, and App Store deployment.
categories/02-language-specialists/fastapi-developer.md | agent | Builds async Python APIs with FastAPI, Pydantic v2 validation, dependency injection, and high-performance ASGI deployment.
categories/02-language-specialists/flutter-expert.md | agent | Builds cross-platform Flutter 3+ apps with custom UI, complex state management, and native integrations across iOS/Android/Web.
categories/02-language-specialists/golang-pro.md | agent | Builds idiomatic Go applications with concurrent programming, error-handling excellence, and cloud-native patterns.
categories/02-language-specialists/java-architect.md | agent | Designs enterprise Java architectures and migrates Spring Boot applications to scalable cloud-native microservices.
categories/02-language-specialists/javascript-pro.md | agent | Builds and optimises modern JavaScript (ES2023+) for browser, Node.js, and full-stack with async and performance patterns.
categories/02-language-specialists/kotlin-specialist.md | agent | Builds Kotlin apps with advanced coroutine patterns, multiplatform code sharing, and functional programming principles.
categories/02-language-specialists/laravel-specialist.md | agent | Builds Laravel 10+ apps with Eloquent relationships, queue systems, and optimised API performance.
categories/02-language-specialists/nextjs-developer.md | agent | Builds production Next.js 14+ apps with App Router, server components, server actions, Core Web Vitals optimisation, and SEO.
categories/02-language-specialists/php-pro.md | agent | Builds PHP 8.3+ enterprise applications with strict typing, modern language features, and async/Fiber patterns.
categories/02-language-specialists/powershell-5.1-expert.md | agent | Automates Windows infrastructure with PowerShell 5.1: AD, DNS, DHCP, GPO management in safe .NET Framework environments.
categories/02-language-specialists/powershell-7-expert.md | agent | Builds cross-platform cloud automation and Azure orchestration with PowerShell 7+ idempotent, enterprise-grade patterns.
categories/02-language-specialists/python-pro.md | agent | Builds type-safe, production-ready Python with modern async patterns, extensive type coverage, and web API patterns.
categories/02-language-specialists/rails-expert.md | agent | Builds and modernises Rails apps with Hotwire, background jobs, API development, and Rails-idiomatic deployment patterns (Rails 7/8).
categories/02-language-specialists/react-specialist.md | agent | Optimises React 18+ applications for performance and implements advanced state management and architectural patterns.
categories/02-language-specialists/rust-engineer.md | agent | Builds Rust systems with memory safety, ownership patterns, zero-cost abstractions, and async for performance-critical services.
categories/02-language-specialists/spring-boot-engineer.md | agent | Builds enterprise Spring Boot 3+ apps with microservices architecture, cloud-native deployment, and reactive patterns.
categories/02-language-specialists/sql-pro.md | agent | Optimises complex SQL queries, designs schemas, and solves performance issues across PostgreSQL, MySQL, SQL Server, and Oracle.
categories/02-language-specialists/swift-expert.md | agent | Builds native iOS/macOS Swift apps with async/await concurrency, actor-based state, and protocol-oriented architecture.
categories/02-language-specialists/symfony-specialist.md | agent | Builds Symfony 6+–8+ apps with Doctrine ORM, Messenger async processing, and optimised API Platform performance.
categories/02-language-specialists/typescript-pro.md | agent | Implements TypeScript with advanced type-system patterns, complex generics, and end-to-end type safety across full-stack apps.
categories/02-language-specialists/vue-expert.md | agent | Builds Vue 3 apps with Composition API mastery, reactivity optimisation, and enterprise-scale Nuxt 3 performance.
```

---

## Agents — 03 Infrastructure

```
categories/03-infrastructure/azure-infra-engineer.md | agent | Designs and manages Azure infrastructure with network architecture, Entra ID integration, PowerShell automation, and Bicep IaC.
categories/03-infrastructure/cloud-architect.md | agent | Designs multi-cloud strategies, migration plans, disaster recovery, and security/compliance architecture at scale.
categories/03-infrastructure/database-administrator.md | agent | Optimises database performance, implements HA architectures, and manages disaster recovery for production systems.
categories/03-infrastructure/deployment-engineer.md | agent | Designs, builds, and optimises CI/CD pipelines and deployment automation strategies.
categories/03-infrastructure/devops-engineer.md | agent | Builds infrastructure automation, CI/CD pipelines, containerisation strategies, and deployment workflows.
categories/03-infrastructure/devops-incident-responder.md | agent | Responds to production incidents, diagnoses critical service failures, and conducts postmortems with permanent fixes.
categories/03-infrastructure/docker-expert.md | agent | Builds, optimises, and secures Docker container images and orchestration for production environments.
categories/03-infrastructure/incident-responder.md | agent | Coordinates immediate response to security breaches or outages including evidence preservation and recovery.
categories/03-infrastructure/kubernetes-specialist.md | agent | Designs, deploys, configures, and troubleshoots Kubernetes clusters and workloads in production.
categories/03-infrastructure/network-engineer.md | agent | Designs, optimises, and troubleshoots cloud and hybrid network infrastructure with security and reliability focus.
categories/03-infrastructure/platform-engineer.md | agent | Builds internal developer platforms with self-service infrastructure, golden paths, and developer-workflow automation.
categories/03-infrastructure/security-engineer.md | agent | Implements zero-trust architecture, automated security controls in CI/CD, threat modelling, and compliance programs.
categories/03-infrastructure/sre-engineer.md | agent | Establishes SLO/error-budget frameworks, automates toil, designs fault-tolerant systems, and optimises incident response.
categories/03-infrastructure/terraform-engineer.md | agent | Builds, refactors, and scales multi-cloud Terraform IaC with module architecture and enterprise state management.
categories/03-infrastructure/terragrunt-expert.md | agent | Masters Terragrunt stacks, DRY configurations, dependency management, and multi-environment enterprise IaC orchestration.
categories/03-infrastructure/windows-infra-admin.md | agent | Manages Windows Server infrastructure (AD, DNS, DHCP, GPO) with safe automation and compliance validation.
```

---

## Agents — 04 Quality & Security

```
categories/04-quality-security/accessibility-tester.md | agent | Conducts WCAG compliance verification and assesses assistive-technology support with a structured testing checklist.
categories/04-quality-security/ad-security-reviewer.md | agent | Audits Active Directory security posture, privilege escalation risks, identity delegation, and authentication hardening.
categories/04-quality-security/architect-reviewer.md | agent | Evaluates system design decisions, architectural patterns, and technology choices at the macro level.
categories/04-quality-security/chaos-engineer.md | agent | Designs and executes controlled failure experiments and game-day exercises to validate system resilience.
categories/04-quality-security/code-reviewer.md | agent | Conducts comprehensive code reviews for quality, security vulnerabilities, and best practices.
categories/04-quality-security/compliance-auditor.md | agent | Implements compliance controls and prepares evidence for GDPR, HIPAA, PCI DSS, SOC 2, and ISO audits.
categories/04-quality-security/debugger.md | agent | Diagnoses and fixes bugs by analysing error logs, stack traces, and root causes through systematic investigation.
categories/04-quality-security/error-detective.md | agent | Correlates errors across services, identifies root causes, and designs prevention measures for system failures.
categories/04-quality-security/penetration-tester.md | agent | Conducts authorised penetration tests with active exploitation and vulnerability validation for risk demonstration.
categories/04-quality-security/performance-engineer.md | agent | Identifies and eliminates performance bottlenecks in applications, databases, and infrastructure systems.
categories/04-quality-security/powershell-security-hardening.md | agent | Hardens PowerShell automation with least-privilege design, secure remoting config, and enterprise security baselines.
categories/04-quality-security/qa-expert.md | agent | Designs comprehensive QA strategy, test planning across the development cycle, and quality-metrics analysis.
categories/04-quality-security/security-auditor.md | agent | Conducts systematic security audits, compliance gap analysis, and evidence-based vulnerability reporting.
categories/04-quality-security/test-automator.md | agent | Builds automated test frameworks, creates test scripts, and integrates testing into CI/CD pipelines.
```

---

## Agents — 05 Data & AI

```
categories/05-data-ai/ai-engineer.md | agent | Architects end-to-end AI systems from model selection and training pipelines to production deployment and monitoring.
categories/05-data-ai/data-analyst.md | agent | Extracts business insights, creates dashboards and reports, and performs statistical analysis for decision support.
categories/05-data-ai/data-engineer.md | agent | Designs, builds, and optimises data pipelines, ETL/ELT processes, and data infrastructure with quality controls.
categories/05-data-ai/data-scientist.md | agent | Analyses data patterns, builds predictive models, and translates statistical findings into business recommendations.
categories/05-data-ai/database-optimizer.md | agent | Analyses slow queries and implements indexing and optimisation strategies across multiple database systems.
categories/05-data-ai/llm-architect.md | agent | Designs LLM systems for production including fine-tuning, RAG architectures, and multi-model inference serving.
categories/05-data-ai/machine-learning-engineer.md | agent | Deploys, optimises, and serves machine learning models at scale in production environments.
categories/05-data-ai/ml-engineer.md | agent | Builds production ML systems with training pipelines, model serving infrastructure, and automated retraining.
categories/05-data-ai/mlops-engineer.md | agent | Implements ML CI/CD, experiment tracking, automated training pipelines, GPU orchestration, and model monitoring.
categories/05-data-ai/nlp-engineer.md | agent | Builds NLP systems and text processing pipelines for NER, sentiment analysis, machine translation, and language models.
categories/05-data-ai/postgres-pro.md | agent | Optimises PostgreSQL performance, designs HA replication, and masters advanced features for enterprise deployments.
categories/05-data-ai/prompt-engineer.md | agent | Designs, optimises, tests, and evaluates prompts for large language models in production systems.
categories/05-data-ai/reinforcement-learning-engineer.md | agent | Designs RL environments, trains agents with reward optimisation, and deploys decision-making systems for autonomous operations.
```

---

## Agents — 06 Developer Experience

```
categories/06-developer-experience/build-engineer.md | agent | Optimises build performance, reduces compilation times, and scales build systems for growing teams.
categories/06-developer-experience/cli-developer.md | agent | Builds intuitive, cross-platform CLI tools and terminal applications with optimised developer experience.
categories/06-developer-experience/dependency-manager.md | agent | Audits dependencies for vulnerabilities, resolves version conflicts, and implements automated dependency updates.
categories/06-developer-experience/documentation-engineer.md | agent | Creates and maintains comprehensive documentation systems including API docs, tutorials, and developer guides.
categories/06-developer-experience/dx-optimizer.md | agent | Optimises the complete developer workflow including build times, feedback loops, and developer satisfaction metrics.
categories/06-developer-experience/git-workflow-manager.md | agent | Designs, establishes, and optimises Git branching strategies and merge management for teams.
categories/06-developer-experience/legacy-modernizer.md | agent | Incrementally migrates legacy systems with risk mitigation and technical debt reduction while preserving business continuity.
categories/06-developer-experience/mcp-developer.md | agent | Builds, debugs, and optimises MCP servers and clients connecting AI systems to external tools and data sources.
categories/06-developer-experience/powershell-module-architect.md | agent | Architects and refactors PowerShell modules, profile systems, and cross-version compatible automation libraries.
categories/06-developer-experience/powershell-ui-architect.md | agent | Designs WinForms/WPF desktop GUIs and terminal UIs for PowerShell tools with clean UI/business-logic separation.
categories/06-developer-experience/refactoring-specialist.md | agent | Transforms poorly structured or duplicated code into clean, maintainable systems while preserving all existing behaviour.
categories/06-developer-experience/slack-expert.md | agent | Develops Slack applications, implements Slack API integrations, and reviews bot code for security and best practices.
categories/06-developer-experience/tooling-engineer.md | agent | Builds and enhances developer tools including CLIs, code generators, build tools, and IDE extensions.
```

---

## Agents — 07 Specialized Domains

```
categories/07-specialized-domains/api-documenter.md | agent | Creates OpenAPI specifications, interactive documentation portals, and code examples for APIs.
categories/07-specialized-domains/blockchain-developer.md | agent | Builds smart contracts, DApps, and blockchain protocols with Solidity, gas optimisation, and security auditing.
categories/07-specialized-domains/embedded-systems.md | agent | Develops firmware for resource-constrained microcontrollers with RTOS, real-time guarantees, and reliability requirements.
categories/07-specialized-domains/fintech-engineer.md | agent | Builds payment systems and compliance-heavy financial applications with secure transaction processing and regulatory adherence.
categories/07-specialized-domains/game-developer.md | agent | Implements game systems, graphics rendering, multiplayer networking, and gameplay mechanics for specific platforms.
categories/07-specialized-domains/iot-engineer.md | agent | Designs IoT solutions with device management, edge computing, cloud integration, and real-time data pipelines at scale.
categories/07-specialized-domains/m365-admin.md | agent | Automates Microsoft 365 admin tasks: Exchange/Teams/SharePoint provisioning, license management, and Graph API identity automation.
categories/07-specialized-domains/mobile-app-developer.md | agent | Develops iOS and Android apps with native or cross-platform implementation and platform-specific UX optimisation.
categories/07-specialized-domains/payment-integration.md | agent | Implements PCI-compliant payment gateways with fraud prevention and secure transaction processing.
categories/07-specialized-domains/quant-analyst.md | agent | Develops quantitative trading strategies, derivatives pricing models, backtesting frameworks, and portfolio risk analytics.
categories/07-specialized-domains/risk-manager.md | agent | Identifies, quantifies, and mitigates enterprise risks across financial, operational, regulatory, and strategic domains.
categories/07-specialized-domains/seo-specialist.md | agent | Conducts SEO technical audits, keyword strategy, and content optimisation to improve search rankings.
```

---

## Agents — 08 Business & Product

```
categories/08-business-product/business-analyst.md | agent | Analyses business processes, gathers stakeholder requirements, and identifies improvement opportunities for operational efficiency.
categories/08-business-product/content-marketer.md | agent | Develops content strategies, creates SEO-optimised marketing content, and executes multi-channel campaigns.
categories/08-business-product/customer-success-manager.md | agent | Assesses customer health, develops retention strategies, and maximises customer lifetime value with churn-prevention procedures.
categories/08-business-product/legal-advisor.md | agent | Drafts contracts, reviews compliance requirements, and assesses legal and IP risks for technology businesses.
categories/08-business-product/product-manager.md | agent | Makes product strategy decisions, prioritises features, and defines roadmaps based on user needs and business goals.
categories/08-business-product/project-manager.md | agent | Establishes project plans, tracks execution, manages risks, controls budget/schedule, and coordinates stakeholders.
categories/08-business-product/sales-engineer.md | agent | Conducts technical pre-sales activities including solution architecture, PoC development, and technical demonstrations.
categories/08-business-product/scrum-master.md | agent | Facilitates agile ceremonies, removes impediments, improves velocity, and scales agile practices across teams.
categories/08-business-product/technical-writer.md | agent | Creates and maintains technical documentation including API references, user guides, and getting-started guides.
categories/08-business-product/ux-researcher.md | agent | Conducts usability testing, user interviews, survey design, and analytics interpretation to inform product strategy.
categories/08-business-product/wordpress-master.md | agent | Architects, optimises, and secures WordPress from custom theme/plugin development to enterprise multisite at scale.
```

---

## Agents — 09 Meta-Orchestration

```
categories/09-meta-orchestration/agent-installer.md | agent | Browses the GitHub catalog and installs Claude Code agents to global or local agent directories via API calls.
categories/09-meta-orchestration/agent-organizer.md | agent | Assembles and optimises multi-agent teams with task decomposition and agent capability matching for complex projects.
categories/09-meta-orchestration/context-manager.md | agent | Manages shared state, information retrieval, and data synchronisation across multiple coordinated agents.
categories/09-meta-orchestration/error-coordinator.md | agent | Coordinates distributed error handling, cascade prevention, and automated failure recovery across multi-agent systems.
categories/09-meta-orchestration/it-ops-orchestrator.md | agent | Routes complex IT operations tasks across specialised agents (PowerShell, .NET, Azure, M365) by domain.
categories/09-meta-orchestration/knowledge-synthesizer.md | agent | Extracts actionable patterns from agent interactions and synthesises cross-workflow insights for organisational learning.
categories/09-meta-orchestration/multi-agent-coordinator.md | agent | Orchestrates concurrent agents with DAG-based dependency management, message routing, deadlock prevention, and fault tolerance.
categories/09-meta-orchestration/performance-monitor.md | agent | Establishes observability infrastructure, detects performance anomalies, and optimises resource usage across agent environments.
categories/09-meta-orchestration/task-distributor.md | agent | Distributes tasks across agents, manages queues, and balances workloads to maximise throughput under priority constraints.
categories/09-meta-orchestration/workflow-orchestrator.md | agent | Designs and executes business process workflows with state machines, saga patterns, error boundaries, and SLA tracking.
```

---

## Agents — 10 Research & Analysis

```
categories/10-research-analysis/competitive-analyst.md | agent | Analyses competitors, benchmarks against market leaders, and develops strategies to strengthen competitive positioning.
categories/10-research-analysis/data-researcher.md | agent | Discovers, collects, and validates data from multiple sources with quality checks and preparation for downstream analysis.
categories/10-research-analysis/market-researcher.md | agent | Analyses markets, consumer behaviour, and competitive landscapes to inform business strategy and market entry decisions.
categories/10-research-analysis/research-analyst.md | agent | Researches across multiple sources, synthesises findings into actionable insights, identifies trends, and produces reports.
categories/10-research-analysis/scientific-literature-researcher.md | agent | Searches scientific literature for structured experimental data (methods, results, sample sizes) from full-text research papers.
categories/10-research-analysis/search-specialist.md | agent | Locates precise information across multiple sources using advanced search strategies and query optimisation.
categories/10-research-analysis/trend-analyst.md | agent | Analyses emerging patterns, predicts industry shifts, and develops future scenarios for strategic planning.
```
