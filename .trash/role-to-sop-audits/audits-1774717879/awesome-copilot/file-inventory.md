# File Inventory — awesome-copilot

All paths are relative to `.references/awesome-copilot/`.

---

## Agents (`agents/*.agent.md`)

agents/4.1-Beast.agent.md | agent | Autonomous coding agent tuned for GPT-4.1 with tool-use discipline and multi-phase workflow execution.
agents/accessibility.agent.md | agent | WCAG 2.1/2.2 accessibility audit and remediation for web frontends.
agents/address-comments.agent.md | agent | Reads all open PR review comments and implements the required code changes.
agents/adr-generator.agent.md | agent | Creates structured Architectural Decision Records with context, decision rationale, and consequences.
agents/aem-frontend-specialist.agent.md | agent | Adobe Experience Manager frontend component development and integration.
agents/agent-governance-reviewer.agent.md | agent | Audits agent code for missing safety controls, trust-scoring, policy enforcement, and audit trails.
agents/amplitude-experiment-implementation.agent.md | agent | Implements Amplitude feature-flag experiments end-to-end including SDK integration and analytics.
agents/api-architect.agent.md | agent | Designs REST/GraphQL APIs with contracts, versioning, and cross-cutting concerns.
agents/apify-integration-expert.agent.md | agent | Integrates Apify web-scraping actors into applications via MCP.
agents/arch-linux-expert.agent.md | agent | Arch Linux system administration, package management, and troubleshooting.
agents/arch.agent.md | agent | Senior Cloud Architect agent for modern architecture design, NFRs, and diagram generation.
agents/arm-migration.agent.md | agent | Scans repositories for x86 assumptions and guides migration to Arm infrastructure.
agents/atlassian-requirements-to-jira.agent.md | agent | Converts requirements documents into structured Jira epics, stories, and tasks.
agents/azure-iac-exporter.agent.md | agent | Exports existing Azure resources into IaC templates (Bicep/Terraform).
agents/azure-iac-generator.agent.md | agent | Generates Azure Infrastructure-as-Code from natural-language architecture descriptions.
agents/azure-logic-apps-expert.agent.md | agent | Designs and debugs Azure Logic Apps workflows and connectors.
agents/azure-policy-analyzer.agent.md | agent | Analyzes Azure Policy definitions for compliance gaps and misconfigurations.
agents/azure-principal-architect.agent.md | agent | Principal-level Azure architecture guidance covering Well-Architected pillars.
agents/azure-saas-architect.agent.md | agent | Designs multi-tenant SaaS solutions on Azure with isolation and scalability patterns.
agents/azure-verified-modules-bicep.agent.md | agent | Implements Azure resources using verified Bicep modules and registry best practices.
agents/azure-verified-modules-terraform.agent.md | agent | Implements Azure resources using verified Terraform modules and AVM conventions.
agents/bicep-implement.agent.md | agent | Implements Bicep IaC from a pre-approved plan without scope deviation.
agents/bicep-plan.agent.md | agent | Plans Azure Bicep deployments with module selection, parameter design, and dependency ordering.
agents/blueprint-mode.agent.md | agent | Structured workflow agent (Debug/Express/Main/Loop modes) with strict correctness, self-correction, and edge-case handling.
agents/cast-imaging-impact-analysis.agent.md | agent | Assesses blast radius of code changes using CAST Imaging structural analysis.
agents/cast-imaging-software-discovery.agent.md | agent | Discovers software architecture and dependencies via CAST Imaging.
agents/cast-imaging-structural-quality-advisor.agent.md | agent | Advises on structural code quality improvements identified by CAST Imaging.
agents/centos-linux-expert.agent.md | agent | CentOS Linux system administration, package management, and troubleshooting.
agents/clojure-interactive-programming.agent.md | agent | Clojure REPL-driven interactive development and nREPL session management.
agents/code-tour.agent.md | agent | Creates VSCode CodeTour `.tour` JSON files for guided codebase walkthroughs.
agents/comet-opik.agent.md | agent | Integrates Comet Opik LLM observability and experiment tracking into Python projects.
agents/context-architect.agent.md | agent | Plans multi-file changes by mapping all relevant context and dependencies before any edits.
agents/context7.agent.md | agent | Fetches up-to-date library documentation via Context7 MCP and answers with current API references.
agents/critical-thinking.agent.md | agent | Socratic challenge mode that questions assumptions without providing solutions until root cause is found.
agents/csharp-dotnet-janitor.agent.md | agent | Eliminates C# tech debt through dead-code removal, simplification, and safe refactoring.
agents/csharp-mcp-expert.agent.md | agent | Builds C# MCP servers with proper tool definitions, handlers, and SDK patterns.
agents/CSharpExpert.agent.md | agent | Expert C# / .NET implementation covering modern language features and best practices.
agents/custom-agent-foundry.agent.md | agent | Designs and generates `.agent.md` files for new GitHub Copilot custom agents.
agents/debian-linux-expert.agent.md | agent | Debian Linux system administration, package management, and troubleshooting.
agents/debug.agent.md | agent | Four-phase debug workflow (assess, reproduce, diagnose, fix) for systematic bug resolution.
agents/declarative-agents-architect.agent.md | agent | Designs Microsoft 365 Declarative Agent manifests using the v1.5 JSON schema and Agents Toolkit.
agents/defender-scout-kql.agent.md | agent | Writes KQL queries for Microsoft Defender threat hunting and security analytics.
agents/demonstrate-understanding.agent.md | agent | Validates engineer comprehension through guided questioning before proceeding with implementation.
agents/devils-advocate.agent.md | agent | Stress-tests plans and designs by finding flaws, risks, and edge cases.
agents/devops-expert.agent.md | agent | Full DevOps lifecycle agent covering CI/CD, automation, monitoring, and infinity-loop practices.
agents/diffblue-cover.agent.md | agent | Generates and maintains unit tests for Java using Diffblue Cover AI.
agents/dotnet-maui.agent.md | agent | .NET MAUI cross-platform mobile/desktop application development.
agents/dotnet-self-learning-architect.agent.md | agent | Senior .NET architect that captures durable project memory and decides between parallel/orchestrated subagent execution.
agents/dotnet-upgrade.agent.md | agent | Plans and executes .NET framework upgrade paths with compatibility analysis.
agents/doublecheck.agent.md | agent | Three-layer verification pipeline (self-audit, source lookup, adversarial review) for AI-generated output.
agents/droid.agent.md | agent | Guides installation, configuration, and CI/CD automation patterns for the Droid CLI.
agents/drupal-expert.agent.md | agent | Drupal CMS development, module creation, and site configuration.
agents/dynatrace-expert.agent.md | agent | Dynatrace observability instrumentation, dashboards, and alert configuration.
agents/elasticsearch-observability.agent.md | agent | Elasticsearch and Elastic Observability integration, query design, and index management.
agents/electron-angular-native.agent.md | agent | Electron + Angular desktop application development with native OS integration.
agents/expert-cpp-software-engineer.agent.md | agent | Expert-level C++ engineering covering modern standards, memory safety, and performance.
agents/expert-dotnet-software-engineer.agent.md | agent | Expert .NET software engineering with production-grade patterns and architecture.
agents/expert-nextjs-developer.agent.md | agent | Expert Next.js frontend development with App Router, SSR, and full-stack patterns.
agents/expert-react-frontend-engineer.agent.md | agent | Expert React frontend engineering covering hooks, state, performance, and testing.
agents/fedora-linux-expert.agent.md | agent | Fedora Linux system administration, package management, and troubleshooting.
agents/gem-browser-tester.agent.md | agent | Automates E2E browser scenarios via Chrome DevTools MCP and Playwright for UI/UX validation.
agents/gem-devops.agent.md | agent | Manages container builds, CI/CD pipelines, and infrastructure deployment as a team subagent.
agents/gem-documentation-writer.agent.md | agent | Generates technical documentation and diagrams while maintaining code-documentation parity.
agents/gem-implementer.agent.md | agent | Executes TDD code changes and ensures tests pass as a team implementation subagent.
agents/gem-orchestrator.agent.md | agent | Coordinates multi-agent team workflows by detecting phase, routing tasks, and synthesizing results.
agents/gem-planner.agent.md | agent | Creates DAG-based implementation plans with pre-mortem analysis from research findings.
agents/gem-researcher.agent.md | agent | Gathers codebase context, identifies relevant files and patterns, and returns structured findings.
agents/gem-reviewer.agent.md | agent | Security and compliance gatekeeper that scans for OWASP issues, secrets, and PRD violations.
agents/gilfoyle.agent.md | agent | Satirical code review in the persona of Gilfoyle delivering brutally honest technical analysis.
agents/github-actions-expert.agent.md | agent | Designs, debugs, and optimises GitHub Actions CI/CD workflows.
agents/github-actions-node-upgrade.agent.md | agent | Upgrades GitHub Actions workflows from deprecated Node versions to current runtimes.
agents/go-mcp-expert.agent.md | agent | Builds Go MCP servers with proper tool definitions and SDK patterns.
agents/gpt-5-beast-mode.agent.md | agent | High-autonomy problem-solving agent tuned for GPT-5 with iterative research and tool use.
agents/hlbpa.agent.md | agent | High-level big-picture architectural documentation and legacy system analysis.
agents/implementation-plan.agent.md | agent | Generates phased implementation plans for features and refactors without writing code.
agents/insiders-a11y-tracker.agent.md | agent | Tracks and resolves accessibility regressions in VS Code Insiders builds.
agents/janitor.agent.md | agent | Universal codebase cleanup agent that removes dead code, simplifies complexity, and reduces tech debt.
agents/java-mcp-expert.agent.md | agent | Builds Java MCP servers with proper tool definitions, handlers, and SDK patterns.
agents/jfrog-sec.agent.md | agent | JFrog Xray security scanning, CVE triage, and supply-chain vulnerability remediation.
agents/kotlin-mcp-expert.agent.md | agent | Builds Kotlin MCP servers with proper tool definitions and SDK patterns.
agents/kusto-assistant.agent.md | agent | Writes and optimises KQL (Kusto Query Language) queries for Azure Data Explorer.
agents/laravel-expert-agent.agent.md | agent | Laravel PHP application development, testing, and best-practice patterns.
agents/launchdarkly-flag-cleanup.agent.md | agent | Automates feature-flag removal via LaunchDarkly MCP, creating PRs that preserve production behaviour.
agents/lingodotdev-i18n.agent.md | agent | Internationalisation and localisation workflows using Lingo.dev.
agents/markdown-accessibility-assistant.agent.md | agent | Audits and remediates Markdown documents for accessibility compliance.
agents/mcp-m365-agent-expert.agent.md | agent | Builds Microsoft 365 Copilot agents using the M365 MCP server.
agents/mentor.agent.md | agent | Guides engineers through problems with Socratic questioning rather than direct solutions.
agents/mentoring-juniors.agent.md | agent | Socratic PEAR-loop mentor for junior developers that builds autonomy through progressive clues.
agents/meta-agentic-project-scaffold.agent.md | agent | Pulls relevant prompts and agents from awesome-copilot to scaffold a new agentic project.
agents/microsoft_learn_contributor.agent.md | agent | Contributes accurate, standards-compliant content to Microsoft Learn documentation.
agents/microsoft-study-mode.agent.md | agent | Interactive study assistant for Microsoft certification exam preparation.
agents/modernization.agent.md | agent | Human-in-the-loop agent that analyzes, documents, and plans complete project modernization.
agents/monday-bug-fixer.agent.md | agent | Enriches bug context from Monday.com, then delivers production-quality fixes with comprehensive PRs.
agents/mongodb-performance-advisor.agent.md | agent | MongoDB query optimisation, index design, and schema performance analysis.
agents/ms-sql-dba.agent.md | agent | Microsoft SQL Server DBA tasks: query tuning, indexing, maintenance, and security.
agents/neo4j-docker-client-generator.agent.md | agent | Generates Neo4j graph database client code and Docker configurations.
agents/neon-migration-specialist.agent.md | agent | Plans and executes database migrations to Neon serverless Postgres.
agents/neon-optimization-analyzer.agent.md | agent | Analyses Neon Postgres schemas and queries for performance optimisation opportunities.
agents/nuxt-expert.agent.md | agent | Nuxt.js full-stack application development with SSR and Nitro server patterns.
agents/octopus-deploy-release-notes-mcp.agent.md | agent | Generates structured release notes from Octopus Deploy deployment data via MCP.
agents/one-shot-feature-issue-planner.agent.md | agent | Produces a complete GitHub-issue-ready implementation plan from a single feature request without follow-up questions.
agents/openapi-to-application.agent.md | agent | Generates full application scaffolding (controllers, models, tests) from an OpenAPI specification.
agents/oracle-to-postgres-migration-expert.agent.md | agent | Plans and executes Oracle-to-PostgreSQL schema and procedure migrations.
agents/pagerduty-incident-responder.agent.md | agent | Responds to PagerDuty incidents by tracing recent commits and creating fix PRs.
agents/php-mcp-expert.agent.md | agent | Builds PHP MCP servers with proper tool definitions and SDK patterns.
agents/pimcore-expert.agent.md | agent | Pimcore digital experience platform development and configuration.
agents/plan.agent.md | agent | Strategic planning mode that analyses codebases and clarifies requirements before producing implementation strategies.
agents/planner.agent.md | agent | No-code planning mode that generates phased implementation plans as Markdown documents.
agents/platform-sre-kubernetes.agent.md | agent | Platform SRE agent for Kubernetes operations, incident response, and reliability engineering.
agents/playwright-tester.agent.md | agent | Writes, debugs, and maintains Playwright end-to-end tests.
agents/polyglot-test-builder.agent.md | agent | Runs language-appropriate build/compile commands and reports results for any project.
agents/polyglot-test-fixer.agent.md | agent | Analyses compilation errors in source or test files and applies targeted corrections.
agents/polyglot-test-generator.agent.md | agent | Orchestrates full Research-Plan-Implement test generation pipeline for any language.
agents/polyglot-test-implementer.agent.md | agent | Implements a single test-plan phase by writing files and verifying compile and pass status.
agents/polyglot-test-linter.agent.md | agent | Discovers and runs language-appropriate lint/format commands for any project.
agents/polyglot-test-planner.agent.md | agent | Creates structured, phased test implementation plans from research findings for any language.
agents/polyglot-test-researcher.agent.md | agent | Analyses codebase structure, testing patterns, and build tooling to inform test generation.
agents/polyglot-test-tester.agent.md | agent | Discovers and executes language-appropriate test commands, reporting pass/fail results.
agents/postgresql-dba.agent.md | agent | PostgreSQL DBA tasks: query tuning, indexing, vacuuming, and security hardening.
agents/power-bi-data-modeling-expert.agent.md | agent | Power BI data modelling: star schema, relationships, and semantic layer design.
agents/power-bi-dax-expert.agent.md | agent | Power BI DAX formula authoring, optimisation, and debugging.
agents/power-bi-performance-expert.agent.md | agent | Power BI report and dataset performance analysis and remediation.
agents/power-bi-visualization-expert.agent.md | agent | Power BI visualisation design, accessibility, and UX best practices.
agents/power-platform-expert.agent.md | agent | Microsoft Power Platform (Apps, Automate, Pages) development and configuration.
agents/power-platform-mcp-integration-expert.agent.md | agent | Integrates Power Platform solutions with MCP-connected services.
agents/prd.agent.md | agent | Creates comprehensive Product Requirements Documents with user stories and acceptance criteria.
agents/principal-software-engineer.agent.md | agent | Principal-level engineering guidance balancing craft excellence with pragmatic delivery.
agents/prompt-builder.agent.md | agent | Expert prompt engineering, validation, and optimisation workflow for Copilot prompts.
agents/prompt-engineer.agent.md | agent | Analyses user input as a prompt to improve, providing reasoning and an upgraded version.
agents/python-mcp-expert.agent.md | agent | Builds Python MCP servers with proper tool definitions, handlers, and FastMCP patterns.
agents/python-notebook-sample-builder.agent.md | agent | Generates Python Jupyter notebook samples with educational structure and reproducible outputs.
agents/qa-subagent.agent.md | agent | Meticulous QA subagent for test planning, bug hunting, edge-case analysis, and verification.
agents/reepl-linkedin.agent.md | agent | Generates LinkedIn posts from technical content with appropriate tone and engagement hooks.
agents/refine-issue.agent.md | agent | Enriches GitHub issues with acceptance criteria, technical considerations, edge cases, and NFRs.
agents/repo-architect.agent.md | agent | Bootstraps and validates agentic project structures (agents, skills, instructions) after repo initialisation.
agents/research-technical-spike.agent.md | agent | Systematically researches and validates technical spike documents through experimentation.
agents/ruby-mcp-expert.agent.md | agent | Builds Ruby MCP servers with proper tool definitions and SDK patterns.
agents/rug-orchestrator.agent.md | agent | Pure orchestration agent that decomposes requests, delegates to SWE/QA subagents, validates outcomes, and repeats.
agents/rust-gpt-4.1-beast-mode.agent.md | agent | High-autonomy Rust coding agent with idiomatic ownership, safety, and performance focus.
agents/rust-mcp-expert.agent.md | agent | Builds Rust MCP servers with proper tool definitions and SDK patterns.
agents/salesforce-apex-triggers.agent.md | agent | Salesforce Apex trigger development with bulkification and governor limit compliance.
agents/salesforce-aura-lwc.agent.md | agent | Salesforce Aura and Lightning Web Component development.
agents/salesforce-expert.agent.md | agent | Full-stack Salesforce development including Apex, LWC, and platform configuration.
agents/salesforce-flow.agent.md | agent | Salesforce Flow builder for declarative automation without code.
agents/salesforce-visualforce.agent.md | agent | Salesforce Visualforce page development with MVC patterns.
agents/scientific-paper-research.agent.md | agent | Searches scientific papers and retrieves structured experimental data via BGPT MCP server.
agents/se-gitops-ci-specialist.agent.md | agent | DevOps/CI specialist for pipelines, deployment debugging, and GitOps workflows.
agents/se-product-manager-advisor.agent.md | agent | Product management guidance for GitHub issue creation and data-driven product decisions.
agents/se-responsible-ai-code.agent.md | agent | Ensures AI code is bias-free, accessible, ethical, and inclusive by design.
agents/se-security-reviewer.agent.md | agent | Security code review covering OWASP Top 10, Zero Trust, and LLM-specific threats.
agents/se-system-architecture-reviewer.agent.md | agent | System architecture review covering Well-Architected frameworks, scalability, and AI systems.
agents/se-technical-writer.agent.md | agent | Technical writing specialist for developer documentation, tutorials, and educational content.
agents/se-ux-ui-designer.agent.md | agent | Jobs-to-be-Done analysis, user journey mapping, and UX research artefact generation.
agents/search-ai-optimization-expert.agent.md | agent | Optimises content and applications for AI search and retrieval augmentation.
agents/shopify-expert.agent.md | agent | Shopify theme and app development with Liquid, Hydrogen, and storefront APIs.
agents/simple-app-idea-generator.agent.md | agent | Generates simple, buildable app ideas tailored to user skill level and interests.
agents/software-engineer-agent-v1.agent.md | agent | Expert-level software engineering agent for production-ready, specification-driven implementation.
agents/specification.agent.md | agent | Generates or updates formal specification documents for new and existing functionality.
agents/stackhawk-security-onboarding.agent.md | agent | Onboards projects to StackHawk DAST security scanning with configuration and CI integration.
agents/swe-subagent.agent.md | agent | Senior software engineering subagent for feature development, debugging, refactoring, and testing.
agents/swift-mcp-expert.agent.md | agent | Builds Swift MCP servers with proper tool definitions and SDK patterns.
agents/task-planner.agent.md | agent | Creates actionable, step-by-step implementation plans with tracking files for complex tasks.
agents/task-researcher.agent.md | agent | Comprehensive project analysis agent for gathering context before task implementation.
agents/taxcore-technical-writer.agent.md | agent | Technical writing for tax-domain software documentation with regulatory precision.
agents/tdd-green.agent.md | agent | TDD Green phase: writes minimal implementation code to make failing tests pass without over-engineering.
agents/tdd-red.agent.md | agent | TDD Red phase: writes clear failing tests from GitHub issue requirements before implementation exists.
agents/tdd-refactor.agent.md | agent | TDD Refactor phase: improves code quality and security while keeping tests green.
agents/tech-debt-remediation-plan.agent.md | agent | Generates comprehensive tech-debt remediation plans covering code, tests, and documentation.
agents/technical-content-evaluator.agent.md | agent | Evaluates technical content quality, accuracy, and audience fit.
agents/terraform-azure-implement.agent.md | agent | Implements Terraform Azure infrastructure from a pre-approved plan without scope deviation.
agents/terraform-azure-planning.agent.md | agent | Plans Azure Terraform deployments with module selection and dependency ordering.
agents/terraform-iac-reviewer.agent.md | agent | Reviews Terraform IaC for security, compliance, and best-practice violations.
agents/terraform.agent.md | agent | General-purpose Terraform infrastructure authoring with provider best practices.
agents/terratest-module-testing.agent.md | agent | Writes and maintains Terratest Go tests for Terraform module validation.
agents/Thinking-Beast-Mode.agent.md | agent | High-autonomy agent with deep thinking, self-reflection, and thorough problem resolution.
agents/typescript-mcp-expert.agent.md | agent | Builds TypeScript MCP servers with proper tool definitions, handlers, and SDK patterns.
agents/Ultimate-Transparent-Thinking-Beast-Mode.agent.md | agent | Autonomous agent with full-transparency reasoning traces and unrestricted problem resolution.
agents/voidbeast-gpt41enhanced.agent.md | agent | Elite full-stack autonomous agent with Plan/Act/Deep-Research/Analyzer/Checkpoint modes.
agents/vuejs-expert.agent.md | agent | Vue.js application development with Composition API, Pinia, and Nuxt patterns.
agents/wg-code-alchemist.agent.md | agent | Refactors code applying Clean Code principles and SOLID design patterns.
agents/wg-code-sentinel.agent.md | agent | Scans code for security vulnerabilities with a focus on OWASP top issues.
agents/WinFormsExpert.agent.md | agent | Windows Forms application development and modernisation.
agents/winui3-expert.agent.md | agent | WinUI 3 Windows application development with MVVM and WinAppSDK patterns.

---

## Instructions (`instructions/*.instructions.md`)

instructions/a11y.instructions.md | rule | WCAG 2.1/2.2 accessibility rules applied to all code files.
instructions/agent-safety.instructions.md | rule | Safety and governance rules for agent systems: tool boundaries, policy enforcement, and auditability.
instructions/agent-skills.instructions.md | rule | Authoring rules for creating high-quality GitHub Copilot Agent Skills (SKILL.md files).
instructions/agents.instructions.md | rule | Authoring rules for creating effective GitHub Copilot custom agent (`.agent.md`) files.
instructions/ai-prompt-engineering-safety-best-practices.instructions.md | rule | Safety, bias prevention, and security rules for AI prompt engineering.
instructions/ansible.instructions.md | rule | Ansible playbook and role coding standards and best practices.
instructions/apex.instructions.md | rule | Salesforce Apex coding standards with governor-limit and bulkification rules.
instructions/arch-linux.instructions.md | rule | Arch Linux system configuration, package management, and scripting conventions.
instructions/aspnet-rest-apis.instructions.md | rule | ASP.NET REST API design standards covering routing, validation, and OpenAPI.
instructions/astro.instructions.md | rule | Astro framework coding standards for component islands, routing, and SSG.
instructions/aws-appsync.instructions.md | rule | AWS AppSync GraphQL API design and resolver best practices.
instructions/azure-devops-pipelines.instructions.md | rule | Azure DevOps pipeline YAML authoring standards and job/stage patterns.
instructions/azure-functions-typescript.instructions.md | rule | Azure Functions TypeScript coding rules for triggers, bindings, and error handling.
instructions/azure-logic-apps-power-automate.instructions.md | rule | Azure Logic Apps and Power Automate workflow design rules and connector patterns.
instructions/azure-verified-modules-bicep.instructions.md | rule | Rules for consuming Azure Verified Modules in Bicep with correct registry references.
instructions/azure-verified-modules-terraform.instructions.md | rule | Rules for consuming Azure Verified Modules in Terraform with AVM conventions.
instructions/bicep-code-best-practices.instructions.md | rule | Bicep IaC coding standards covering naming, modules, and parameter design.
instructions/blazor.instructions.md | rule | Blazor component development rules for Server and WASM hosting models.
instructions/centos-linux.instructions.md | rule | CentOS Linux system configuration, package management, and scripting conventions.
instructions/clojure.instructions.md | rule | Clojure coding standards covering namespaces, immutability, and functional patterns.
instructions/cmake-vcpkg.instructions.md | rule | CMake build system and vcpkg dependency management coding standards.
instructions/code-review-generic.instructions.md | rule | Comprehensive code-review protocol covering quality, security, testing, and architecture for any project.
instructions/codexer.instructions.md | rule | Codexer-specific agent behaviour and output formatting rules.
instructions/coldfusion-cfc.instructions.md | rule | ColdFusion CFC component coding standards and best practices.
instructions/coldfusion-cfm.instructions.md | rule | ColdFusion CFM template coding standards and best practices.
instructions/containerization-docker-best-practices.instructions.md | rule | Docker image and container configuration best practices for production workloads.
instructions/context-engineering.instructions.md | rule | Rules for structuring code and projects to maximise Copilot context and suggestion quality.
instructions/context7.instructions.md | rule | Rules for using Context7 to fetch up-to-date documentation during code generation.
instructions/convert-cassandra-to-spring-data-cosmos.instructions.md | rule | Migration rules for converting Cassandra access to Spring Data Azure Cosmos DB.
instructions/convert-jpa-to-spring-data-cosmos.instructions.md | rule | Migration rules for converting JPA repositories to Spring Data Azure Cosmos DB.
instructions/copilot-sdk-csharp.instructions.md | rule | GitHub Copilot Extensions SDK coding standards for C#.
instructions/copilot-sdk-go.instructions.md | rule | GitHub Copilot Extensions SDK coding standards for Go.
instructions/copilot-sdk-nodejs.instructions.md | rule | GitHub Copilot Extensions SDK coding standards for Node.js.
instructions/copilot-sdk-python.instructions.md | rule | GitHub Copilot Extensions SDK coding standards for Python.
instructions/copilot-thought-logging.instructions.md | rule | Requires Copilot to log its reasoning process to a tracking file for human review and session continuity.
instructions/cpp-language-service-tools.instructions.md | rule | C++ language service and IDE tooling integration rules.
instructions/csharp-ja.instructions.md | rule | C# coding standards with Japanese-language commentary conventions.
instructions/csharp-ko.instructions.md | rule | C# coding standards with Korean-language commentary conventions.
instructions/csharp-mcp-server.instructions.md | rule | C# MCP server implementation standards and SDK usage rules.
instructions/csharp.instructions.md | rule | C# coding standards covering style, patterns, async/await, and modern language features.
instructions/dart-n-flutter.instructions.md | rule | Dart and Flutter coding standards for widget, state, and architecture patterns.
instructions/dataverse-python-advanced-features.instructions.md | rule | Advanced feature rules for Dataverse Python SDK usage (batch ops, change tracking).
instructions/dataverse-python-agentic-workflows.instructions.md | rule | Rules for building agentic workflows with Dataverse Python SDK.
instructions/dataverse-python-api-reference.instructions.md | rule | Dataverse Python SDK API reference and usage conventions.
instructions/dataverse-python-authentication-security.instructions.md | rule | Authentication and security rules for Dataverse Python applications.
instructions/dataverse-python-best-practices.instructions.md | rule | General best practices for Dataverse Python SDK integration.
instructions/dataverse-python-error-handling.instructions.md | rule | Error handling and retry rules for Dataverse Python applications.
instructions/dataverse-python-file-operations.instructions.md | rule | File and attachment operation rules for Dataverse Python SDK.
instructions/dataverse-python-modules.instructions.md | rule | Module organisation and import rules for Dataverse Python projects.
instructions/dataverse-python-pandas-integration.instructions.md | rule | Rules for Pandas integration with Dataverse Python SDK for data analysis.
instructions/dataverse-python-performance-optimization.instructions.md | rule | Performance optimisation rules for Dataverse Python queries and operations.
instructions/dataverse-python-real-world-usecases.instructions.md | rule | Patterns and rules for common Dataverse Python real-world integration scenarios.
instructions/dataverse-python-sdk.instructions.md | rule | Core SDK usage rules for the Dataverse Python SDK.
instructions/dataverse-python-testing-debugging.instructions.md | rule | Testing and debugging rules for Dataverse Python applications.
instructions/dataverse-python.instructions.md | rule | Entry-point Dataverse Python coding standards coordinating the full ruleset.
instructions/debian-linux.instructions.md | rule | Debian Linux system configuration, package management, and scripting conventions.
instructions/declarative-agents-microsoft365.instructions.md | rule | Rules for creating Microsoft 365 declarative agent manifests and capabilities.
instructions/devbox-image-definition.instructions.md | rule | Devbox development environment image definition and configuration rules.
instructions/devops-core-principles.instructions.md | rule | Core DevOps principles (CALMS framework, DORA metrics) applied to all code generation.
instructions/dotnet-architecture-good-practices.instructions.md | rule | .NET architectural patterns: layering, dependency injection, and clean architecture rules.
instructions/dotnet-framework.instructions.md | rule | .NET Framework (legacy) coding standards and compatibility rules.
instructions/dotnet-maui-9-to-dotnet-maui-10-upgrade.instructions.md | rule | Migration rules for upgrading .NET MAUI 9 to .NET MAUI 10.
instructions/dotnet-maui.instructions.md | rule | .NET MAUI cross-platform UI coding standards and MVVM patterns.
instructions/dotnet-upgrade.instructions.md | rule | Rules for upgrading .NET projects to newer target frameworks.
instructions/dotnet-wpf.instructions.md | rule | WPF application coding standards with MVVM and data-binding rules.
instructions/draw-io.instructions.md | rule | Draw.io diagram creation rules for consistent notation and layout.
instructions/fedora-linux.instructions.md | rule | Fedora Linux system configuration, package management, and scripting conventions.
instructions/genaiscript.instructions.md | rule | GenAIScript scripting standards for AI-orchestrated automation tasks.
instructions/generate-modern-terraform-code-for-azure.instructions.md | rule | Rules for generating modern, provider-compatible Terraform code for Azure resources.
instructions/gilfoyle-code-review.instructions.md | rule | Code review style rule that enforces sardonic, blunt technical critique in Gilfoyle's voice.
instructions/github-actions-ci-cd-best-practices.instructions.md | rule | GitHub Actions CI/CD workflow security, caching, and job-structure best practices.
instructions/go-mcp-server.instructions.md | rule | Go MCP server implementation standards and SDK usage rules.
instructions/go.instructions.md | rule | Go coding standards covering idioms, error handling, and package structure.
instructions/html-css-style-color-guide.instructions.md | rule | HTML/CSS colour, typography, and visual style guide rules.
instructions/instructions.instructions.md | rule | Meta-rules for authoring high-quality GitHub Copilot `.instructions.md` files.
instructions/java-11-to-java-17-upgrade.instructions.md | rule | Migration rules for upgrading Java 11 codebases to Java 17.
instructions/java-17-to-java-21-upgrade.instructions.md | rule | Migration rules for upgrading Java 17 codebases to Java 21.
instructions/java-21-to-java-25-upgrade.instructions.md | rule | Migration rules for upgrading Java 21 codebases to Java 25.
instructions/java-mcp-server.instructions.md | rule | Java MCP server implementation standards and SDK usage rules.
instructions/joyride-user-project.instructions.md | rule | Rules for writing Joyride user-project automation scripts.
instructions/joyride-workspace-automation.instructions.md | rule | Rules for writing Joyride workspace-level automation scripts.
instructions/kotlin-mcp-server.instructions.md | rule | Kotlin MCP server implementation standards and SDK usage rules.
instructions/kubernetes-deployment-best-practices.instructions.md | rule | Kubernetes deployment manifest best practices for reliability and security.
instructions/kubernetes-manifests.instructions.md | rule | Kubernetes manifest authoring standards covering resource definitions and RBAC.
instructions/langchain-python.instructions.md | rule | LangChain Python coding standards for chain, agent, and retrieval patterns.
instructions/localization.instructions.md | rule | Internationalisation and localisation coding rules for multi-language support.
instructions/lwc.instructions.md | rule | Salesforce Lightning Web Component coding standards and platform API rules.
instructions/makefile.instructions.md | rule | Makefile authoring rules for portable, self-documenting build targets.
instructions/markdown-accessibility.instructions.md | rule | Accessibility rules for Markdown content: headings, alt text, link text, and tables.
instructions/markdown-content-creation.instructions.md | rule | Rules for creating clear, structured Markdown documentation content.
instructions/markdown-gfm.instructions.md | rule | GitHub Flavored Markdown syntax and formatting rules.
instructions/markdown.instructions.md | rule | General Markdown authoring standards and formatting rules.
instructions/mcp-m365-copilot.instructions.md | rule | Microsoft 365 Copilot MCP server development standards and tool-definition rules.
instructions/memory-bank.instructions.md | rule | Memory-bank protocol: requires reading all memory files at session start and maintaining structured project context files.
instructions/mongo-dba.instructions.md | rule | MongoDB DBA standards for schema design, indexing, and query optimisation.
instructions/moodle.instructions.md | rule | Moodle LMS plugin and theme development standards.
instructions/ms-sql-dba.instructions.md | rule | SQL Server DBA standards for T-SQL, indexing, and security configuration.
instructions/nestjs.instructions.md | rule | NestJS application coding standards covering modules, guards, and DI patterns.
instructions/nextjs-tailwind.instructions.md | rule | Next.js + Tailwind CSS coding standards for App Router and styling patterns.
instructions/nextjs.instructions.md | rule | Next.js coding standards for routing, data fetching, and Server Components.
instructions/no-heredoc.instructions.md | rule | Rule banning heredoc syntax in shell scripts for portability.
instructions/nodejs-javascript-vitest.instructions.md | rule | Node.js JavaScript testing standards using Vitest.
instructions/object-calisthenics.instructions.md | rule | Enforces all nine Object Calisthenics rules for C#/TypeScript/Java business domain code.
instructions/oop-design-patterns.instructions.md | rule | Rules for applying OOP design patterns (GoF and beyond) to generated code.
instructions/oqtane.instructions.md | rule | Oqtane CMS module and theme development standards.
instructions/pcf-alm.instructions.md | rule | Power Apps Component Framework ALM and DevOps pipeline rules.
instructions/pcf-api-reference.instructions.md | rule | PCF API usage rules and interface contract standards.
instructions/pcf-best-practices.instructions.md | rule | General best practices for Power Apps Component Framework development.
instructions/pcf-canvas-apps.instructions.md | rule | PCF component integration rules for Canvas Apps.
instructions/pcf-code-components.instructions.md | rule | PCF code component authoring rules and lifecycle patterns.
instructions/pcf-community-resources.instructions.md | rule | Guidelines for using PCF community packages and resources.
instructions/pcf-dependent-libraries.instructions.md | rule | Rules for managing third-party library dependencies in PCF components.
instructions/pcf-events.instructions.md | rule | PCF event handling rules and notification patterns.
instructions/pcf-fluent-modern-theming.instructions.md | rule | PCF Fluent UI theming and modern styling rules.
instructions/pcf-limitations.instructions.md | rule | Rules encoding PCF platform limitations and workaround patterns.
instructions/pcf-manifest-schema.instructions.md | rule | PCF manifest XML schema and property definition rules.
instructions/pcf-model-driven-apps.instructions.md | rule | PCF component integration rules for Model-Driven Apps.
instructions/pcf-overview.instructions.md | rule | Overview and fundamental rules for Power Apps Component Framework development.
instructions/pcf-power-pages.instructions.md | rule | PCF component integration rules for Power Pages.
instructions/pcf-react-platform-libraries.instructions.md | rule | Rules for using React and PCF platform libraries together.
instructions/pcf-sample-components.instructions.md | rule | PCF sample component patterns and reference implementation rules.
instructions/pcf-tooling.instructions.md | rule | PCF CLI tooling and development environment setup rules.
instructions/performance-optimization.instructions.md | rule | Comprehensive performance optimisation rules for frontend, backend, and database code.
instructions/php-mcp-server.instructions.md | rule | PHP MCP server implementation standards and SDK usage rules.
instructions/php-symfony.instructions.md | rule | Symfony PHP framework coding standards and DI container rules.
instructions/playwright-dotnet.instructions.md | rule | Playwright .NET test authoring standards for end-to-end tests.
instructions/playwright-python.instructions.md | rule | Playwright Python test authoring standards for end-to-end tests.
instructions/playwright-typescript.instructions.md | rule | Playwright TypeScript test authoring standards for end-to-end tests.
instructions/power-apps-canvas-yaml.instructions.md | rule | Power Apps Canvas YAML source format authoring rules.
instructions/power-apps-code-apps.instructions.md | rule | Power Apps code-first application development rules.
instructions/power-bi-custom-visuals-development.instructions.md | rule | Power BI custom visual SDK development standards.
instructions/power-bi-data-modeling-best-practices.instructions.md | rule | Power BI data modelling best practices for star schema and relationships.
instructions/power-bi-dax-best-practices.instructions.md | rule | Power BI DAX formula best practices for performance and correctness.
instructions/power-bi-devops-alm-best-practices.instructions.md | rule | Power BI ALM and DevOps pipeline best practices.
instructions/power-bi-report-design-best-practices.instructions.md | rule | Power BI report design standards for visual hierarchy and readability.
instructions/power-bi-security-rls-best-practices.instructions.md | rule | Power BI row-level security (RLS) design and enforcement rules.
instructions/power-platform-connector.instructions.md | rule | Power Platform custom connector authoring standards.
instructions/power-platform-mcp-development.instructions.md | rule | Power Platform MCP integration development rules.
instructions/powershell-pester-5.instructions.md | rule | PowerShell Pester 5 test authoring standards and assertion patterns.
instructions/powershell.instructions.md | rule | PowerShell scripting standards covering style, error handling, and cmdlet conventions.
instructions/prompt.instructions.md | rule | Authoring rules for high-quality GitHub Copilot `.prompt.md` files.
instructions/python-mcp-server.instructions.md | rule | Python MCP server implementation standards and FastMCP usage rules.
instructions/quarkus-mcp-server-sse.instructions.md | rule | Quarkus MCP server with SSE transport implementation standards.
instructions/quarkus.instructions.md | rule | Quarkus Java framework coding standards for cloud-native applications.
instructions/r.instructions.md | rule | R language coding standards for data analysis, tidyverse, and reproducibility.
instructions/ruby-mcp-server.instructions.md | rule | Ruby MCP server implementation standards and SDK usage rules.
instructions/ruby-on-rails.instructions.md | rule | Ruby on Rails coding standards covering MVC, ActiveRecord, and testing.
instructions/rust-mcp-server.instructions.md | rule | Rust MCP server implementation standards and SDK usage rules.
instructions/rust.instructions.md | rule | Rust coding standards covering ownership, error handling, and idiomatic patterns.
instructions/scala2.instructions.md | rule | Scala 2 coding standards for functional programming and type-safety.
instructions/security-and-owasp.instructions.md | rule | Security-first coding rules covering OWASP Top 10 and secure-by-default principles for all languages.
instructions/self-explanatory-code-commenting.instructions.md | rule | Rules for writing self-explanatory code with minimal but high-signal comments.
instructions/shell.instructions.md | rule | Shell scripting standards for portability, error handling, and POSIX compliance.
instructions/spec-driven-workflow-v1.instructions.md | rule | Specification-driven workflow rules requiring maintenance of requirements.md, design.md, and tasks.md artefacts.
instructions/springboot-4-migration.instructions.md | rule | Migration rules for upgrading Spring Boot applications to version 4.
instructions/springboot.instructions.md | rule | Spring Boot coding standards for configuration, beans, and REST API patterns.
instructions/sql-sp-generation.instructions.md | rule | SQL stored procedure authoring standards for correctness and performance.
instructions/svelte.instructions.md | rule | Svelte component coding standards for reactivity and store patterns.
instructions/swift-mcp-server.instructions.md | rule | Swift MCP server implementation standards and SDK usage rules.
instructions/tailwind-v4-vite.instructions.md | rule | Tailwind CSS v4 with Vite setup and utility-first styling rules.
instructions/taming-copilot.instructions.md | rule | Core directives hierarchy: user commands override all other rules; enforce factual verification over internal knowledge.
instructions/tanstack-start-shadcn-tailwind.instructions.md | rule | TanStack Start + shadcn/ui + Tailwind CSS full-stack application coding standards.
instructions/task-implementation.instructions.md | rule | Task-plan implementation rules requiring progressive tracking in change-record files.
instructions/tasksync.instructions.md | rule | TaskSync V5 protocol for passing new instructions to a running agent via terminal during execution.
instructions/terraform-azure.instructions.md | rule | Terraform Azure provider coding standards and resource configuration rules.
instructions/terraform-sap-btp.instructions.md | rule | Terraform SAP Business Technology Platform provider coding standards.
instructions/terraform.instructions.md | rule | General Terraform coding standards covering modules, variables, and state management.
instructions/typescript-mcp-server.instructions.md | rule | TypeScript MCP server implementation standards and SDK usage rules.
instructions/typespec-m365-copilot.instructions.md | rule | TypeSpec API definition standards for Microsoft 365 Copilot plugins.
instructions/update-code-from-shorthand.instructions.md | rule | Rules for translating shorthand, pseudo-code, or natural-language descriptions into production code.
instructions/update-docs-on-code-change.instructions.md | rule | Rule requiring README and documentation updates whenever application code changes.
instructions/vsixtoolkit.instructions.md | rule | VSix VS Code extension toolkit authoring standards.
instructions/winui3.instructions.md | rule | WinUI 3 Windows application coding standards with XAML and MVVM rules.
instructions/wordpress.instructions.md | rule | WordPress plugin and theme development coding standards.

---

## Skills (`skills/*/SKILL.md`)

skills/add-educational-comments/SKILL.md | skill | Adds explanatory educational comments to code files to turn them into learning resources.
skills/agent-governance/SKILL.md | skill | Implements policy-based access controls, intent classification, trust scoring, and audit trails for AI agent systems.
skills/agentic-eval/SKILL.md | skill | Evaluation patterns for AI agents: self-critique loops, rubric scoring, and LLM-as-judge pipelines.
skills/ai-prompt-engineering-safety-review/SKILL.md | skill | Reviews prompts for safety, bias, injection vulnerabilities, and effectiveness with improvement recommendations.
skills/appinsights-instrumentation/SKILL.md | skill | Instruments applications with Azure Application Insights telemetry.
skills/apple-appstore-reviewer/SKILL.md | skill | Guides App Store submission review readiness and rejection remediation.
skills/arch-linux-triage/SKILL.md | skill | Triages Arch Linux system issues with diagnostic and remediation steps.
skills/architecture-blueprint-generator/SKILL.md | skill | Analyses codebases and generates comprehensive architectural documentation with diagrams.
skills/aspire/SKILL.md | skill | Integrates .NET Aspire orchestration and service defaults into applications.
skills/aspnet-minimal-api-openapi/SKILL.md | skill | Creates ASP.NET Minimal API endpoints with OpenAPI specification.
skills/automate-this/SKILL.md | skill | Analyses screen recordings of manual processes and generates targeted automation scripts.
skills/autoresearch/SKILL.md | skill | Autonomously researches topics, synthesising findings from multiple web sources.
skills/aws-cdk-python-setup/SKILL.md | skill | Sets up AWS CDK infrastructure projects in Python with stacks and constructs.
skills/az-cost-optimize/SKILL.md | skill | Analyses Azure resource usage and recommends cost optimisation changes.
skills/azure-architecture-autopilot/SKILL.md | skill | Autonomously designs Azure architectures from requirements with diagrams and IaC.
skills/azure-deployment-preflight/SKILL.md | skill | Validates Azure deployment configurations before execution to catch errors early.
skills/azure-devops-cli/SKILL.md | skill | Azure DevOps CLI command guidance for pipelines, repos, and work items.
skills/azure-pricing/SKILL.md | skill | Fetches and compares Azure service pricing for architecture cost estimation.
skills/azure-resource-health-diagnose/SKILL.md | skill | Diagnoses Azure resource health events and recommends remediation actions.
skills/azure-resource-visualizer/SKILL.md | skill | Generates visual diagrams of Azure resource groups and their relationships.
skills/azure-role-selector/SKILL.md | skill | Recommends appropriate Azure RBAC roles following least-privilege principles.
skills/azure-static-web-apps/SKILL.md | skill | Deploys and configures Azure Static Web Apps with routing and auth rules.
skills/bigquery-pipeline-audit/SKILL.md | skill | Audits BigQuery data pipelines for cost, performance, and correctness.
skills/boost-prompt/SKILL.md | skill | Iteratively refines a user prompt through scope/constraint interrogation without writing code.
skills/breakdown-epic-arch/SKILL.md | skill | Creates high-level technical architecture specifications from an Epic PRD.
skills/breakdown-epic-pm/SKILL.md | skill | Creates Epic-level PRDs from high-level ideas for use as engineering input.
skills/breakdown-feature-implementation/SKILL.md | skill | Creates detailed feature implementation plans following monorepo structure conventions.
skills/breakdown-feature-prd/SKILL.md | skill | Creates feature-level PRDs scoped within an Epic for engineering handoff.
skills/breakdown-plan/SKILL.md | skill | Generates comprehensive GitHub project plans with Epic→Feature→Story hierarchy and automated issue creation.
skills/breakdown-test/SKILL.md | skill | Creates test plans covering unit, integration, and E2E coverage for a feature.
skills/centos-linux-triage/SKILL.md | skill | Triages CentOS Linux system issues with diagnostic and remediation steps.
skills/chrome-devtools/SKILL.md | skill | Uses Chrome DevTools MCP to inspect, debug, and profile web applications.
skills/cli-mastery/SKILL.md | skill | Teaches and applies CLI tool best practices for productivity and automation.
skills/cloud-design-patterns/SKILL.md | skill | Applies cloud design patterns (retry, circuit breaker, CQRS, etc.) to architecture decisions.
skills/code-exemplars-blueprint-generator/SKILL.md | skill | Generates canonical code examples illustrating project patterns for AI consumption.
skills/codeql/SKILL.md | skill | Configures and runs CodeQL code scanning via GitHub Actions and CLI with SARIF output.
skills/comment-code-generate-a-tutorial/SKILL.md | skill | Generates structured tutorials from commented source code.
skills/containerize-aspnet-framework/SKILL.md | skill | Containerises ASP.NET Framework applications with multi-stage Dockerfiles.
skills/containerize-aspnetcore/SKILL.md | skill | Containerises ASP.NET Core applications with multi-stage Dockerfiles.
skills/context-map/SKILL.md | skill | Generates a map of all files and dependencies relevant to a task before any changes are made.
skills/conventional-commit/SKILL.md | skill | Guides writing conventional commit messages using structured XML-templated format.
skills/convert-plaintext-to-md/SKILL.md | skill | Converts plain text content into well-structured Markdown.
skills/copilot-cli-quickstart/SKILL.md | skill | Quick-start guide for GitHub Copilot CLI setup and common commands.
skills/copilot-instructions-blueprint-generator/SKILL.md | skill | Generates comprehensive `.github/copilot-instructions.md` files from codebase pattern analysis.
skills/copilot-sdk/SKILL.md | skill | GitHub Copilot Extensions SDK integration guide for building Copilot extensions.
skills/copilot-spaces/SKILL.md | skill | Configures and uses GitHub Copilot Spaces for team knowledge sharing.
skills/copilot-usage-metrics/SKILL.md | skill | Retrieves and analyses GitHub Copilot usage metrics via API.
skills/cosmosdb-datamodeling/SKILL.md | skill | Azure Cosmos DB data modelling rules for partition key selection and query optimisation.
skills/create-agentsmd/SKILL.md | skill | Generates a complete AGENTS.md file describing a repository's structure and agent guidelines.
skills/create-architectural-decision-record/SKILL.md | skill | Creates structured ADR documents with context, decision, rationale, and consequences.
skills/create-github-action-workflow-specification/SKILL.md | skill | Creates specification documents for new GitHub Actions workflows.
skills/create-github-issue-feature-from-specification/SKILL.md | skill | Creates a GitHub feature-request issue from a specification file using a standard template.
skills/create-github-issues-feature-from-implementation-plan/SKILL.md | skill | Converts an implementation plan into a set of linked GitHub issues.
skills/create-github-issues-for-unmet-specification-requirements/SKILL.md | skill | Identifies unmet specification requirements and files them as GitHub issues.
skills/create-github-pull-request-from-specification/SKILL.md | skill | Creates a GitHub PR from a specification file using the repository's PR template.
skills/create-implementation-plan/SKILL.md | skill | Creates machine-readable, deterministic implementation plan files for AI-driven execution.
skills/create-llms/SKILL.md | skill | Generates `llms.txt` files describing repository content for LLM context loading.
skills/create-readme/SKILL.md | skill | Generates comprehensive README.md files from codebase analysis.
skills/create-specification/SKILL.md | skill | Creates structured, AI-ready specification files with requirements, constraints, and interfaces.
skills/create-spring-boot-java-project/SKILL.md | skill | Scaffolds a Spring Boot Java project with standard structure and dependencies.
skills/create-spring-boot-kotlin-project/SKILL.md | skill | Scaffolds a Spring Boot Kotlin project with standard structure and dependencies.
skills/create-technical-spike/SKILL.md | skill | Creates time-boxed technical spike documents for researching critical unknowns before implementation.
skills/create-tldr-page/SKILL.md | skill | Creates tldr-pages community-format command reference pages.
skills/creating-oracle-to-postgres-master-migration-plan/SKILL.md | skill | Creates a master migration plan for Oracle-to-PostgreSQL database migrations.
skills/creating-oracle-to-postgres-migration-bug-report/SKILL.md | skill | Documents migration bugs found during Oracle-to-PostgreSQL migration testing.
skills/creating-oracle-to-postgres-migration-integration-tests/SKILL.md | skill | Creates integration tests validating Oracle-to-PostgreSQL migration correctness.
skills/csharp-async/SKILL.md | skill | Implements correct async/await patterns in C# avoiding common deadlock antipatterns.
skills/csharp-docs/SKILL.md | skill | Generates XML doc comments for C# APIs following documentation standards.
skills/csharp-mcp-server-generator/SKILL.md | skill | Generates a complete C# MCP server project with tool definitions and SDK wiring.
skills/csharp-mstest/SKILL.md | skill | Writes MSTest unit tests for C# following arrange-act-assert and coverage conventions.
skills/csharp-nunit/SKILL.md | skill | Writes NUnit unit tests for C# following arrange-act-assert and coverage conventions.
skills/csharp-tunit/SKILL.md | skill | Writes TUnit unit tests for C# following arrange-act-assert and coverage conventions.
skills/csharp-xunit/SKILL.md | skill | Writes xUnit unit tests for C# following arrange-act-assert and coverage conventions.
skills/daily-prep/SKILL.md | skill | Generates a structured daily prep file from calendar, tasks, and workspace context via WorkIQ.
skills/datanalysis-credit-risk/SKILL.md | skill | Performs credit-risk data analysis using statistical and ML techniques.
skills/dataverse-python-advanced-patterns/SKILL.md | skill | Implements advanced Dataverse Python SDK patterns including batch operations.
skills/dataverse-python-production-code/SKILL.md | skill | Generates production-ready Dataverse Python integration code.
skills/dataverse-python-quickstart/SKILL.md | skill | Quick-start workflow for Dataverse Python SDK project setup.
skills/dataverse-python-usecase-builder/SKILL.md | skill | Builds Dataverse Python use-case implementations from requirements.
skills/debian-linux-triage/SKILL.md | skill | Triages Debian Linux system issues with diagnostic and remediation steps.
skills/declarative-agents/SKILL.md | skill | Creates and configures Microsoft 365 declarative agent manifests.
skills/dependabot/SKILL.md | skill | Configures and manages GitHub Dependabot for automated dependency updates and security fixes.
skills/devops-rollout-plan/SKILL.md | skill | Creates phased rollout plans with canary, blue/green, or feature-flag strategies.
skills/documentation-writer/SKILL.md | skill | Generates structured technical documentation from code analysis and user requirements.
skills/dotnet-best-practices/SKILL.md | skill | Applies .NET best practices for architecture, performance, and coding standards.
skills/dotnet-design-pattern-review/SKILL.md | skill | Reviews .NET code for design pattern application and improvement opportunities.
skills/dotnet-timezone/SKILL.md | skill | Implements correct timezone handling in .NET applications avoiding common pitfalls.
skills/dotnet-upgrade/SKILL.md | skill | Plans and executes .NET version upgrades with compatibility analysis.
skills/doublecheck/SKILL.md | skill | Runs a three-layer verification pipeline (claim extraction, source lookup, adversarial review) on AI-generated output.
skills/draw-io-diagram-generator/SKILL.md | skill | Generates Draw.io XML diagram files from architecture descriptions.
skills/editorconfig/SKILL.md | skill | Creates `.editorconfig` files encoding project-specific formatting rules.
skills/ef-core/SKILL.md | skill | Entity Framework Core migration, model design, and query optimisation patterns.
skills/email-drafter/SKILL.md | skill | Drafts professional emails from bullet points or intent descriptions.
skills/entra-agent-user/SKILL.md | skill | Configures Microsoft Entra ID agent user accounts for application identities.
skills/eval-driven-dev/SKILL.md | skill | Instruments Python LLM applications, builds golden datasets, writes eval tests, and iterates on quality regressions.
skills/excalidraw-diagram-generator/SKILL.md | skill | Generates Excalidraw diagram files from architecture and flow descriptions.
skills/fabric-lakehouse/SKILL.md | skill | Implements Microsoft Fabric Lakehouse data pipelines and notebooks.
skills/fedora-linux-triage/SKILL.md | skill | Triages Fedora Linux system issues with diagnostic and remediation steps.
skills/finalize-agent-prompt/SKILL.md | skill | Polishes agent prompt files into final, production-ready form.
skills/finnish-humanizer/SKILL.md | skill | Humanises AI-generated Finnish text to read naturally for native speakers.
skills/first-ask/SKILL.md | skill | Interrogates task scope, deliverables, and constraints through tool-powered questions before execution.
skills/flowstudio-power-automate-build/SKILL.md | skill | Builds Power Automate flows using FlowStudio with step-by-step construction guidance.
skills/flowstudio-power-automate-debug/SKILL.md | skill | Debugs Power Automate flows using FlowStudio diagnostics.
skills/flowstudio-power-automate-mcp/SKILL.md | skill | Integrates Power Automate flows with MCP-connected services via FlowStudio.
skills/fluentui-blazor/SKILL.md | skill | Implements Blazor applications using Fluent UI components and design system.
skills/folder-structure-blueprint-generator/SKILL.md | skill | Analyses and documents project folder structures with naming conventions and placement patterns.
skills/game-engine/SKILL.md | skill | Guides game engine development patterns, ECS architecture, and rendering loops.
skills/gen-specs-as-issues/SKILL.md | skill | Identifies missing product features, prioritises them, and creates specification issues for each.
skills/generate-custom-instructions-from-codebase/SKILL.md | skill | Generates Copilot migration instructions by diffing two project versions for consistent evolution.
skills/geofeed-tuner/SKILL.md | skill | Tunes and validates geofeed files for IP geolocation accuracy.
skills/gh-cli/SKILL.md | skill | GitHub CLI (`gh`) command guidance for repos, PRs, issues, and releases.
skills/git-commit/SKILL.md | skill | Executes git commits with automated conventional-commit message generation from diff analysis.
skills/git-flow-branch-creator/SKILL.md | skill | Creates git-flow branches with correct naming and base branch selection.
skills/github-copilot-starter/SKILL.md | skill | Quick-start guide for configuring GitHub Copilot in a new repository.
skills/github-issues/SKILL.md | skill | Creates, triages, and manages GitHub issues with labels, milestones, and assignees.
skills/go-mcp-server-generator/SKILL.md | skill | Generates a complete Go MCP server project with tool definitions and SDK wiring.
skills/gtm-0-to-1-launch/SKILL.md | skill | Go-to-market strategy and launch checklist for zero-to-one product launches.
skills/gtm-ai-gtm/SKILL.md | skill | AI-specific go-to-market strategy covering positioning, channels, and adoption.
skills/gtm-board-and-investor-communication/SKILL.md | skill | Templates and guidance for board and investor communication artefacts.
skills/gtm-developer-ecosystem/SKILL.md | skill | Developer ecosystem GTM strategy covering DevRel, docs, and community.
skills/gtm-enterprise-account-planning/SKILL.md | skill | Enterprise account planning templates for sales and customer success.
skills/gtm-enterprise-onboarding/SKILL.md | skill | Enterprise customer onboarding workflow and checklist.
skills/gtm-operating-cadence/SKILL.md | skill | Operating cadence framework for recurring GTM reviews and rituals.
skills/gtm-partnership-architecture/SKILL.md | skill | Partner programme architecture and alliance strategy templates.
skills/gtm-positioning-strategy/SKILL.md | skill | Product positioning strategy framework covering differentiation and messaging.
skills/gtm-product-led-growth/SKILL.md | skill | Product-led growth strategy covering activation, expansion, and virality.
skills/gtm-technical-product-pricing/SKILL.md | skill | Technical product pricing models and packaging strategy guidance.
skills/image-manipulation-image-magick/SKILL.md | skill | Generates ImageMagick commands for image processing, conversion, and batch manipulation.
skills/import-infrastructure-as-code/SKILL.md | skill | Imports existing cloud infrastructure into IaC state files without recreation.
skills/issue-fields-migration/SKILL.md | skill | Migrates GitHub issue custom fields and project data between boards.
skills/java-add-graalvm-native-image-support/SKILL.md | skill | Adds GraalVM native-image compilation support to Java/Spring Boot projects.
skills/java-docs/SKILL.md | skill | Generates Javadoc comments for Java APIs following documentation standards.
skills/java-junit/SKILL.md | skill | Writes JUnit 5 tests for Java following arrange-act-assert and coverage conventions.
skills/java-mcp-server-generator/SKILL.md | skill | Generates a complete Java MCP server project with tool definitions and SDK wiring.
skills/java-refactoring-extract-method/SKILL.md | skill | Applies extract-method refactoring to Java code with safe rename propagation.
skills/java-refactoring-remove-parameter/SKILL.md | skill | Applies remove-parameter refactoring to Java methods with safe call-site updates.
skills/java-springboot/SKILL.md | skill | Spring Boot Java development best practices for REST APIs and data access.
skills/javascript-typescript-jest/SKILL.md | skill | Writes Jest tests for JavaScript/TypeScript following best practices and coverage targets.
skills/kotlin-mcp-server-generator/SKILL.md | skill | Generates a complete Kotlin MCP server project with tool definitions and SDK wiring.
skills/kotlin-springboot/SKILL.md | skill | Kotlin + Spring Boot application development standards.
skills/legacy-circuit-mockups/SKILL.md | skill | Generates circuit and hardware mockup documentation from legacy system analysis.
skills/make-repo-contribution/SKILL.md | skill | Enforces repository contribution workflow: issue → branch → commit → PR using project-specific conventions.
skills/make-skill-template/SKILL.md | skill | Scaffolds new Agent Skill folders with SKILL.md, frontmatter, and optional bundled assets.
skills/markdown-to-html/SKILL.md | skill | Converts Markdown documents to styled HTML output.
skills/mcp-cli/SKILL.md | skill | GitHub Copilot CLI MCP integration setup and command guidance.
skills/mcp-copilot-studio-server-generator/SKILL.md | skill | Generates MCP server configurations for Microsoft Copilot Studio.
skills/mcp-create-adaptive-cards/SKILL.md | skill | Creates Microsoft Adaptive Card JSON definitions via MCP tools.
skills/mcp-create-declarative-agent/SKILL.md | skill | Creates Microsoft 365 declarative agent manifests via MCP tools.
skills/mcp-deploy-manage-agents/SKILL.md | skill | Deploys and manages Microsoft agent configurations via MCP tools.
skills/meeting-minutes/SKILL.md | skill | Generates structured meeting minutes from transcript or bullet notes.
skills/memory-merger/SKILL.md | skill | Merges mature domain memory lessons into persistent instruction files for session continuity.
skills/mentoring-juniors/SKILL.md | skill | Socratic mentoring workflow for junior developers using PEAR loop and progressive clues.
skills/microsoft-agent-framework/SKILL.md | skill | Builds agents using the Microsoft Agent Framework with tool orchestration patterns.
skills/microsoft-code-reference/SKILL.md | skill | Fetches up-to-date Microsoft code references and SDK documentation.
skills/microsoft-docs/SKILL.md | skill | Retrieves current Microsoft technical documentation for Azure, M365, and SDK references.
skills/microsoft-skill-creator/SKILL.md | skill | Creates Microsoft-ecosystem Agent Skills with proper structure and bundled assets.
skills/migrating-oracle-to-postgres-stored-procedures/SKILL.md | skill | Translates Oracle PL/SQL stored procedures to PostgreSQL PL/pgSQL equivalents.
skills/mkdocs-translations/SKILL.md | skill | Manages MkDocs multi-language documentation translation workflows.
skills/model-recommendation/SKILL.md | skill | Analyses agent/prompt files and recommends optimal AI models based on task complexity and capabilities.
skills/msstore-cli/SKILL.md | skill | Microsoft Store CLI command guidance for app submission and management.
skills/multi-stage-dockerfile/SKILL.md | skill | Creates optimised multi-stage Dockerfiles for production container builds.
skills/my-issues/SKILL.md | skill | Retrieves and summarises the authenticated user's assigned GitHub issues.
skills/my-pull-requests/SKILL.md | skill | Retrieves and summarises the authenticated user's open GitHub pull requests.
skills/nano-banana-pro-openrouter/SKILL.md | skill | Integrates OpenRouter AI models into applications via MCP.
skills/napkin/SKILL.md | skill | Generates napkin-diagram visual sketches from architecture descriptions.
skills/next-intl-add-language/SKILL.md | skill | Adds new locale support to Next.js applications using next-intl.
skills/noob-mode/SKILL.md | skill | Translates all Copilot CLI prompts and outputs into plain English for non-technical users with colour-coded risk indicators.
skills/nuget-manager/SKILL.md | skill | Manages NuGet package dependencies: adding, updating, and resolving conflicts.
skills/oo-component-documentation/SKILL.md | skill | Generates object-oriented component documentation with interface contracts.
skills/openapi-to-application-code/SKILL.md | skill | Generates full application code (controllers, models, tests) from an OpenAPI spec.
skills/pdftk-server/SKILL.md | skill | Generates pdftk server commands for PDF manipulation and form processing.
skills/penpot-uiux-design/SKILL.md | skill | Creates Penpot design specifications and component definitions for UI/UX.
skills/php-mcp-server-generator/SKILL.md | skill | Generates a complete PHP MCP server project with tool definitions and SDK wiring.
skills/planning-oracle-to-postgres-migration-integration-testing/SKILL.md | skill | Plans integration-test coverage for Oracle-to-PostgreSQL migration validation.
skills/plantuml-ascii/SKILL.md | skill | Generates PlantUML and ASCII diagram source from architecture descriptions.
skills/playwright-automation-fill-in-form/SKILL.md | skill | Writes Playwright scripts to automate form filling and submission workflows.
skills/playwright-explore-website/SKILL.md | skill | Generates Playwright scripts to explore and map a web application's pages.
skills/playwright-generate-test/SKILL.md | skill | Generates Playwright end-to-end tests from user-action descriptions.
skills/polyglot-test-agent/SKILL.md | skill | Full polyglot test-generation pipeline: research → plan → implement for any language.
skills/postgresql-code-review/SKILL.md | skill | Reviews PostgreSQL schemas and queries for correctness, performance, and security.
skills/postgresql-optimization/SKILL.md | skill | Analyses PostgreSQL queries and schemas and applies performance optimisations.
skills/power-apps-code-app-scaffold/SKILL.md | skill | Scaffolds Power Apps code-first application projects with standard structure.
skills/power-bi-dax-optimization/SKILL.md | skill | Optimises Power BI DAX measures for calculation performance.
skills/power-bi-model-design-review/SKILL.md | skill | Reviews Power BI data models for schema correctness and relationship integrity.
skills/power-bi-performance-troubleshooting/SKILL.md | skill | Diagnoses and resolves Power BI report and dataset performance issues.
skills/power-bi-report-design-consultation/SKILL.md | skill | Consults on Power BI report design for clarity and stakeholder communication.
skills/power-platform-mcp-connector-suite/SKILL.md | skill | Creates and configures Power Platform custom MCP connector suites.
skills/powerbi-modeling/SKILL.md | skill | Designs Power BI semantic models with star schema and DAX best practices.
skills/prd/SKILL.md | skill | Generates high-quality Product Requirements Documents with executive summary, user stories, and risk analysis.
skills/premium-frontend-ui/SKILL.md | skill | Generates premium-quality frontend UI code with attention to design and accessibility.
skills/project-workflow-analysis-blueprint-generator/SKILL.md | skill | Analyses project workflows and generates blueprints for process improvement.
skills/prompt-builder/SKILL.md | skill | Interactive prompt-building workflow for creating high-quality Copilot task prompts.
skills/publish-to-pages/SKILL.md | skill | Publishes static site content to GitHub Pages with deployment configuration.
skills/pytest-coverage/SKILL.md | skill | Writes pytest tests with coverage tracking and reporting for Python projects.
skills/python-mcp-server-generator/SKILL.md | skill | Generates a complete Python MCP server project with tool definitions and FastMCP wiring.
skills/quality-playbook/SKILL.md | skill | Generates six quality artefacts (constitution, functional tests, review protocol, integration tests, spec audit, AGENTS.md) for any codebase.
skills/quasi-coder/SKILL.md | skill | Translates shorthand, pseudo-code, or natural-language descriptions into production-quality code.
skills/readme-blueprint-generator/SKILL.md | skill | Generates comprehensive README blueprints by analysing codebase structure and purpose.
skills/refactor/SKILL.md | skill | Surgical code refactoring (extract functions, rename, eliminate smells) without changing external behaviour.
skills/refactor-method-complexity-reduce/SKILL.md | skill | Refactors high-complexity methods using extract-method and decomposition patterns.
skills/refactor-plan/SKILL.md | skill | Creates multi-file refactor plans with correct sequencing and rollback steps.
skills/remember/SKILL.md | skill | Transforms lessons learned into domain-organised memory instruction files for persistent cross-session knowledge.
skills/remember-interactive-programming/SKILL.md | skill | Records interactive programming session insights into domain memory for future reference.
skills/repo-story-time/SKILL.md | skill | Generates narrative descriptions of a repository's history and purpose from commits and structure.
skills/review-and-refactor/SKILL.md | skill | Reviews and refactors code against project-defined quality and best-practice instructions.
skills/reviewing-oracle-to-postgres-migration/SKILL.md | skill | Reviews Oracle-to-PostgreSQL migration artefacts for correctness and completeness.
skills/roundup/SKILL.md | skill | Generates personalised status briefings by pulling from GitHub, email, Teams, and Slack data sources.
skills/roundup-setup/SKILL.md | skill | Configures the Roundup briefing skill with data source connections and style preferences.
skills/ruby-mcp-server-generator/SKILL.md | skill | Generates a complete Ruby MCP server project with tool definitions and SDK wiring.
skills/ruff-recursive-fix/SKILL.md | skill | Recursively applies Ruff lint fixes across all Python files in a project.
skills/rust-mcp-server-generator/SKILL.md | skill | Generates a complete Rust MCP server project with tool definitions and SDK wiring.
skills/sandbox-npm-install/SKILL.md | skill | Installs npm packages in a sandboxed environment for safe dependency testing.
skills/scaffolding-oracle-to-postgres-migration-test-project/SKILL.md | skill | Scaffolds a test project for Oracle-to-PostgreSQL migration validation.
skills/scoutqa-test/SKILL.md | skill | Runs ScoutQA automated test scenarios and reports results.
skills/secret-scanning/SKILL.md | skill | Configures GitHub secret scanning, push protection, and custom patterns; guides alert remediation.
skills/semantic-kernel/SKILL.md | skill | Implements AI orchestration using Microsoft Semantic Kernel SDK.
skills/shuffle-json-data/SKILL.md | skill | Shuffles or randomises JSON dataset entries for test data generation.
skills/snowflake-semanticview/SKILL.md | skill | Creates Snowflake Semantic Views for consistent business-logic metric definitions.
skills/sponsor-finder/SKILL.md | skill | Identifies and profiles potential sponsors for open-source projects.
skills/spring-boot-testing/SKILL.md | skill | Writes Spring Boot integration and unit tests with TestContainers and MockMvc.
skills/sql-code-review/SKILL.md | skill | Reviews SQL queries for correctness, performance, injection risk, and style.
skills/sql-optimization/SKILL.md | skill | Analyses and rewrites SQL queries for performance using index and execution-plan guidance.
skills/structured-autonomy-generate/SKILL.md | skill | Generates a copy-paste-ready implementation document from a completed PR plan.
skills/structured-autonomy-implement/SKILL.md | skill | Executes implementation plan steps exactly as specified without deviation.
skills/structured-autonomy-plan/SKILL.md | skill | Produces a DAG-based development plan with research, analysis, and commit-level steps without writing code.
skills/suggest-awesome-github-copilot-agents/SKILL.md | skill | Suggests relevant awesome-copilot agent files based on current repo context, avoiding duplicates.
skills/suggest-awesome-github-copilot-instructions/SKILL.md | skill | Suggests relevant awesome-copilot instruction files based on current repo context.
skills/suggest-awesome-github-copilot-skills/SKILL.md | skill | Suggests relevant awesome-copilot skills based on current repo context, avoiding duplicates.
skills/swift-mcp-server-generator/SKILL.md | skill | Generates a complete Swift MCP server project with tool definitions and SDK wiring.
skills/technology-stack-blueprint-generator/SKILL.md | skill | Analyses repositories and generates technology stack blueprints with rationale.
skills/terraform-azurerm-set-diff-analyzer/SKILL.md | skill | Analyses AzureRM Terraform provider version diffs to identify breaking changes.
skills/tldr-prompt/SKILL.md | skill | Generates concise TL;DR summaries of prompts, documents, or conversations.
skills/transloadit-media-processing/SKILL.md | skill | Configures Transloadit media-processing pipelines for encoding and transformation.
skills/typescript-mcp-server-generator/SKILL.md | skill | Generates a complete TypeScript MCP server project with tool definitions and SDK wiring.
skills/typespec-api-operations/SKILL.md | skill | Defines API operations and data models using TypeSpec specification language.
skills/typespec-create-agent/SKILL.md | skill | Creates Microsoft 365 Copilot agent definitions using TypeSpec.
skills/typespec-create-api-plugin/SKILL.md | skill | Creates Microsoft 365 Copilot API plugins using TypeSpec.
skills/unit-test-vue-pinia/SKILL.md | skill | Writes unit tests for Vue.js components with Pinia state management.
skills/update-avm-modules-in-bicep/SKILL.md | skill | Updates Azure Verified Module references in Bicep files to latest versions.
skills/update-implementation-plan/SKILL.md | skill | Updates an existing implementation plan with new or changed requirements for re-execution.
skills/update-llms/SKILL.md | skill | Updates `llms.txt` files to reflect current repository state.
skills/update-markdown-file-index/SKILL.md | skill | Regenerates Markdown index files to reflect current directory contents.
skills/update-specification/SKILL.md | skill | Updates an existing specification file based on new requirements or code changes.
skills/vscode-ext-commands/SKILL.md | skill | Implements VS Code extension command contributions and activation patterns.
skills/vscode-ext-localization/SKILL.md | skill | Adds localisation support to VS Code extensions with `package.nls.json` files.
skills/web-coder/SKILL.md | skill | Generates production-quality web application code from design or requirements.
skills/web-design-reviewer/SKILL.md | skill | Reviews web UI designs for accessibility, usability, and visual hierarchy.
skills/webapp-testing/SKILL.md | skill | Writes end-to-end and integration tests for web applications.
skills/what-context-needed/SKILL.md | skill | Asks Copilot to enumerate the files it needs to see before answering a question.
skills/winapp-cli/SKILL.md | skill | Windows application CLI development with proper argument parsing and help text.
skills/winmd-api-search/SKILL.md | skill | Searches WinMD Windows API metadata for types, methods, and interfaces.
skills/winui3-migration-guide/SKILL.md | skill | Guides migration of Windows applications from WinForms/WPF to WinUI 3.
skills/workiq-copilot/SKILL.md | skill | Integrates WorkIQ task and calendar data into Copilot workflows.
skills/write-coding-standards-from-file/SKILL.md | skill | Generates project coding standards documents from existing codebase analysis.

---

## Hooks (`hooks/*/hooks.json` + scripts)

hooks/dependency-license-checker/hooks.json | config | Lifecycle config running a license-check script on tool-use to block forbidden dependency licences.
hooks/dependency-license-checker/check-licenses.sh | sop | Shell procedure scanning installed packages for licence violations.
hooks/governance-audit/hooks.json | config | Lifecycle config running governance audit scripts on session start/end and each user prompt.
hooks/governance-audit/audit-session-start.sh | sop | Shell procedure recording agent session start metadata for audit trails.
hooks/governance-audit/audit-session-end.sh | sop | Shell procedure recording session end and writing final audit log entry.
hooks/governance-audit/audit-prompt.sh | sop | Shell procedure classifying each user prompt for threats and logging intent with optional blocking.
hooks/secrets-scanner/hooks.json | config | Lifecycle config running a secrets-scan script before tool use to block credential leaks.
hooks/secrets-scanner/scan-secrets.sh | sop | Shell procedure scanning staged files for secret patterns before commit or tool execution.
hooks/session-auto-commit/hooks.json | config | Lifecycle config running an auto-commit script at session end to persist agent changes.
hooks/session-auto-commit/auto-commit.sh | sop | Shell procedure that stages and commits all agent-modified files at session close.
hooks/session-logger/hooks.json | config | Lifecycle config capturing prompt and session boundary events to log files.
hooks/session-logger/log-prompt.sh | sop | Shell procedure appending each user prompt with timestamp to a session log.
hooks/session-logger/log-session-start.sh | sop | Shell procedure writing session-start metadata to a log file.
hooks/session-logger/log-session-end.sh | sop | Shell procedure writing session-end metadata and summary to a log file.
hooks/tool-guardian/hooks.json | config | Lifecycle config running a guard script before every tool invocation to enforce an allow/block policy.
hooks/tool-guardian/guard-tool.sh | sop | Shell procedure checking each tool call against an allowlist and blocking forbidden operations.

---

## Workflows (`workflows/*.md`)

workflows/daily-issues-report.md | sop | Scheduled agentic workflow that generates a daily GitHub issue summarising open issues and team activity.
workflows/ospo-contributors-report.md | sop | Scheduled workflow producing monthly contributor activity metrics across an organisation's repositories.
workflows/ospo-org-health.md | sop | Scheduled workflow generating a weekly organisation health report covering stale issues, PRs, and contributor leaderboards.
workflows/ospo-release-compliance-checker.md | sop | Event-triggered workflow auditing a repository against open-source release compliance requirements.
workflows/ospo-stale-repos.md | sop | Scheduled workflow identifying inactive repositories and generating archival recommendations.
workflows/relevance-check.md | sop | Slash-command workflow evaluating whether an issue or PR is still relevant to the project.
workflows/relevance-summary.md | sop | Manually triggered workflow aggregating all relevance-check responses into a single summary issue.
