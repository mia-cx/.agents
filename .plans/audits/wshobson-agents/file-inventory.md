.claude-plugin/marketplace.json | config | Lists the plugins, sources, and metadata used for marketplace discovery.
CLAUDE.md | rule | Sets repository-wide conventions, plugin authoring rules, and model/tooling guidance.
docs/superpowers/plans/2025-03-25-plugineval-plan.md | sop | Build a three-layer plugin quality evaluation engine with Elo ranking, packaged as a Python CLI and Claude Code plugin.
docs/superpowers/specs/2025-03-25-plugineval-design.md | sop | PluginEval — Plugin Quality Evaluation Framework.
plugins/accessibility-compliance/.claude-plugin/plugin.json | config | WCAG accessibility auditing, compliance validation, UI testing for screen readers, keyboard navigation, and inclusive design.
plugins/accessibility-compliance/agents/ui-visual-validator.md | agent | Rigorous visual validation expert specializing in UI testing, design system compliance, and accessibility verification.
plugins/accessibility-compliance/commands/accessibility-audit.md | prompt | Accessibility Audit and Testing.
plugins/accessibility-compliance/skills/screen-reader-testing/SKILL.md | skill | Test web applications with screen readers including VoiceOver, NVDA, and JAWS.
plugins/accessibility-compliance/skills/wcag-audit-patterns/SKILL.md | skill | Conduct WCAG 2.2 accessibility audits with automated testing, manual verification, and remediation guidance.
plugins/agent-orchestration/.claude-plugin/plugin.json | config | Multi-agent system optimization, agent improvement workflows, and context management.
plugins/agent-orchestration/agents/context-manager.md | agent | Elite AI context engineering specialist mastering dynamic context management, vector databases, knowledge graphs, and intelligent memory systems.
plugins/agent-orchestration/commands/improve-agent.md | prompt | Agent Performance Optimization Workflow.
plugins/agent-orchestration/commands/multi-agent-optimize.md | prompt | Multi-Agent Optimization Toolkit.
plugins/agent-teams/.claude-plugin/plugin.json | config | Orchestrate multi-agent teams for parallel code review, hypothesis-driven debugging, and coordinated feature development using Claude Code's Agent Teams.
plugins/agent-teams/agents/team-debugger.md | agent | Hypothesis-driven debugging investigator that investigates one assigned hypothesis, gathering evidence to confirm or falsify it with file:line citations and confidence levels.
plugins/agent-teams/agents/team-implementer.md | agent | Parallel feature builder that implements components within strict file ownership boundaries, coordinating at integration points via messaging.
plugins/agent-teams/agents/team-lead.md | agent | Team orchestrator that decomposes work into parallel tasks with file ownership boundaries, manages team lifecycle, and synthesizes results.
plugins/agent-teams/agents/team-reviewer.md | agent | Multi-dimensional code reviewer that operates on one assigned review dimension (security, performance, architecture, testing, or accessibility) with structured finding format.
plugins/agent-teams/commands/team-debug.md | prompt | Debug issues using competing hypotheses with parallel investigation by multiple agents.
plugins/agent-teams/commands/team-delegate.md | prompt | Task delegation dashboard for managing team workload, assignments, and rebalancing.
plugins/agent-teams/commands/team-feature.md | prompt | Develop features in parallel with multiple agents using file ownership boundaries and dependency management.
plugins/agent-teams/commands/team-review.md | prompt | Launch a multi-reviewer parallel code review with specialized review dimensions.
plugins/agent-teams/commands/team-shutdown.md | prompt | Gracefully shut down an agent team, collect final results, and clean up resources.
plugins/agent-teams/commands/team-spawn.md | prompt | Spawn an agent team using presets (review, debug, feature, fullstack, research, security, migration) or custom composition.
plugins/agent-teams/commands/team-status.md | prompt | Display team members, task status, and progress for an active agent team.
plugins/agent-teams/skills/multi-reviewer-patterns/SKILL.md | skill | Coordinate parallel code reviews across multiple quality dimensions with finding deduplication, severity calibration, and consolidated reporting.
plugins/agent-teams/skills/parallel-debugging/SKILL.md | skill | Debug complex issues using competing hypotheses with parallel investigation, evidence collection, and root cause arbitration.
plugins/agent-teams/skills/parallel-feature-development/SKILL.md | skill | Coordinate parallel feature development with file ownership strategies, conflict avoidance rules, and integration patterns for multi-agent implementation.
plugins/agent-teams/skills/task-coordination-strategies/SKILL.md | skill | Decompose complex tasks, design dependency graphs, and coordinate multi-agent work with proper task descriptions and workload balancing.
plugins/agent-teams/skills/team-communication-protocols/SKILL.md | skill | Structured messaging protocols for agent team communication including message type selection, plan approval, shutdown procedures, and anti-patterns to avoid.
plugins/agent-teams/skills/team-composition-patterns/SKILL.md | skill | Design optimal agent team compositions with sizing heuristics, preset configurations, and agent type selection.
plugins/api-scaffolding/.claude-plugin/plugin.json | config | REST and GraphQL API scaffolding, framework selection, backend architecture, and API generation.
plugins/api-scaffolding/agents/backend-architect.md | agent | Expert backend architect specializing in scalable API design, microservices architecture, and distributed systems.
plugins/api-scaffolding/agents/django-pro.md | agent | Master Django 5.x with async views, DRF, Celery, and Django Channels.
plugins/api-scaffolding/agents/fastapi-pro.md | agent | Build high-performance async APIs with FastAPI, SQLAlchemy 2.0, and Pydantic V2.
plugins/api-scaffolding/agents/graphql-architect.md | agent | Master modern GraphQL with federation, performance optimization, and enterprise security.
plugins/api-scaffolding/skills/fastapi-templates/SKILL.md | skill | Create production-ready FastAPI projects with async patterns, dependency injection, and comprehensive error handling.
plugins/api-testing-observability/.claude-plugin/plugin.json | config | API testing automation, request mocking, OpenAPI documentation generation, observability setup, and monitoring.
plugins/api-testing-observability/agents/api-documenter.md | agent | Master API documentation with OpenAPI 3.1, AI-powered tools, and modern developer experience practices.
plugins/api-testing-observability/commands/api-mock.md | prompt | API Mocking Framework.
plugins/application-performance/.claude-plugin/plugin.json | config | Application profiling, performance optimization, and observability for frontend and backend systems.
plugins/application-performance/agents/frontend-developer.md | agent | Build React components, implement responsive layouts, and handle client-side state management.
plugins/application-performance/agents/observability-engineer.md | agent | Build production-ready monitoring, logging, and tracing systems.
plugins/application-performance/agents/performance-engineer.md | agent | Expert performance engineer specializing in modern observability, application optimization, and scalable system performance.
plugins/application-performance/commands/performance-optimization.md | prompt | Orchestrate end-to-end application performance optimization from profiling to monitoring.
plugins/arm-cortex-microcontrollers/.claude-plugin/plugin.json | config | ARM Cortex-M firmware development for Teensy, STM32, nRF52, and SAMD with peripheral drivers and memory safety patterns.
plugins/arm-cortex-microcontrollers/agents/arm-cortex-expert.md | agent | >.
plugins/backend-api-security/.claude-plugin/plugin.json | config | API security hardening, authentication implementation, authorization patterns, rate limiting, and input validation.
plugins/backend-api-security/agents/backend-architect.md | agent | Expert backend architect specializing in scalable API design, microservices architecture, and distributed systems.
plugins/backend-api-security/agents/backend-security-coder.md | agent | Expert in secure backend coding practices specializing in input validation, authentication, and API security.
plugins/backend-development/.claude-plugin/plugin.json | config | Backend API design, GraphQL architecture, workflow orchestration with Temporal, and test-driven backend development.
plugins/backend-development/agents/backend-architect.md | agent | Expert backend architect specializing in scalable API design, microservices architecture, and distributed systems.
plugins/backend-development/agents/event-sourcing-architect.md | agent | Expert in event sourcing, CQRS, and event-driven architecture patterns.
plugins/backend-development/agents/graphql-architect.md | agent | Master modern GraphQL with federation, performance optimization, and enterprise security.
plugins/backend-development/agents/performance-engineer.md | agent | Profile and optimize application performance including response times, memory usage, query efficiency, and scalability.
plugins/backend-development/agents/security-auditor.md | agent | Review code and architecture for security vulnerabilities, OWASP Top 10, auth flaws, and compliance issues.
plugins/backend-development/agents/tdd-orchestrator.md | agent | Master TDD orchestrator specializing in red-green-refactor discipline, multi-agent workflow coordination, and comprehensive test-driven development practices.
plugins/backend-development/agents/temporal-python-pro.md | agent | Master Temporal workflow orchestration with Python SDK.
plugins/backend-development/agents/test-automator.md | agent | Create comprehensive test suites including unit, integration, and E2E tests.
plugins/backend-development/commands/feature-development.md | prompt | Orchestrate end-to-end feature development from requirements to deployment.
plugins/backend-development/skills/api-design-principles/SKILL.md | skill | Master REST and GraphQL API design principles to build intuitive, scalable, and maintainable APIs that delight developers.
plugins/backend-development/skills/architecture-patterns/SKILL.md | skill | Implement proven backend architecture patterns including Clean Architecture, Hexagonal Architecture, and Domain-Driven Design.
plugins/backend-development/skills/cqrs-implementation/SKILL.md | skill | Implement Command Query Responsibility Segregation for scalable architectures.
plugins/backend-development/skills/event-store-design/SKILL.md | skill | Design and implement event stores for event-sourced systems.
plugins/backend-development/skills/microservices-patterns/SKILL.md | skill | Design microservices architectures with service boundaries, event-driven communication, and resilience patterns.
plugins/backend-development/skills/projection-patterns/SKILL.md | skill | Build read models and projections from event streams.
plugins/backend-development/skills/saga-orchestration/SKILL.md | skill | Implement saga patterns for distributed transactions and cross-aggregate workflows.
plugins/backend-development/skills/temporal-python-testing/SKILL.md | skill | Test Temporal workflows with pytest, time-skipping, and mocking strategies.
plugins/backend-development/skills/workflow-orchestration-patterns/SKILL.md | skill | Design durable workflows with Temporal for distributed systems.
plugins/blockchain-web3/.claude-plugin/plugin.json | config | Smart contract development with Solidity, DeFi protocol implementation, NFT platforms, and Web3 application architecture.
plugins/blockchain-web3/agents/blockchain-developer.md | agent | Build production-ready Web3 applications, smart contracts, and decentralized systems.
plugins/blockchain-web3/skills/defi-protocol-templates/SKILL.md | skill | Implement DeFi protocols with production-ready templates for staking, AMMs, governance, and lending systems.
plugins/blockchain-web3/skills/nft-standards/SKILL.md | skill | Implement NFT standards (ERC-721, ERC-1155) with proper metadata handling, minting strategies, and marketplace integration.
plugins/blockchain-web3/skills/solidity-security/SKILL.md | skill | Master smart contract security best practices to prevent common vulnerabilities and implement secure Solidity patterns.
plugins/blockchain-web3/skills/web3-testing/SKILL.md | skill | Test smart contracts comprehensively using Hardhat and Foundry with unit tests, integration tests, and mainnet forking.
plugins/business-analytics/.claude-plugin/plugin.json | config | Business metrics analysis, KPI tracking, financial reporting, and data-driven decision making.
plugins/business-analytics/agents/business-analyst.md | agent | Master modern business analysis with AI-powered analytics, real-time dashboards, and data-driven insights.
plugins/business-analytics/skills/data-storytelling/SKILL.md | skill | Transform data into compelling narratives using visualization, context, and persuasive structure.
plugins/business-analytics/skills/kpi-dashboard-design/SKILL.md | skill | Design effective KPI dashboards with metrics selection, visualization best practices, and real-time monitoring patterns.
plugins/c4-architecture/.claude-plugin/plugin.json | config | Comprehensive C4 architecture documentation workflow with bottom-up code analysis, component synthesis, container mapping, and context diagram generation.
plugins/c4-architecture/agents/c4-code.md | agent | Expert C4 Code-level documentation specialist.
plugins/c4-architecture/agents/c4-component.md | agent | Expert C4 Component-level documentation specialist.
plugins/c4-architecture/agents/c4-container.md | agent | Expert C4 Container-level documentation specialist.
plugins/c4-architecture/agents/c4-context.md | agent | Expert C4 Context-level documentation specialist.
plugins/c4-architecture/commands/c4-architecture.md | prompt | C4 Architecture Documentation Workflow.
plugins/cicd-automation/.claude-plugin/plugin.json | config | CI/CD pipeline configuration, GitHub Actions/GitLab CI workflow setup, and automated deployment pipeline orchestration.
plugins/cicd-automation/agents/cloud-architect.md | agent | Expert cloud architect specializing in AWS/Azure/GCP/OCI multi-cloud infrastructure design, advanced IaC (Terraform/OpenTofu/CDK), FinOps cost optimization, and modern architectural patterns.
plugins/cicd-automation/agents/deployment-engineer.md | agent | 
plugins/cicd-automation/agents/devops-troubleshooter.md | agent | Expert DevOps troubleshooter specializing in rapid incident response, advanced debugging, and modern observability.
plugins/cicd-automation/agents/kubernetes-architect.md | agent | Expert Kubernetes architect specializing in cloud-native infrastructure, advanced GitOps workflows (ArgoCD/Flux), and enterprise container orchestration.
plugins/cicd-automation/agents/terraform-specialist.md | agent | Expert Terraform/OpenTofu specialist mastering advanced IaC automation, state management, and enterprise infrastructure patterns.
plugins/cicd-automation/commands/workflow-automate.md | prompt | Workflow Automation.
plugins/cicd-automation/skills/deployment-pipeline-design/SKILL.md | skill | Design multi-stage CI/CD pipelines with approval gates, security checks, and deployment orchestration.
plugins/cicd-automation/skills/github-actions-templates/SKILL.md | skill | Create production-ready GitHub Actions workflows for automated testing, building, and deploying applications.
plugins/cicd-automation/skills/gitlab-ci-patterns/SKILL.md | skill | Build GitLab CI/CD pipelines with multi-stage workflows, caching, and distributed runners for scalable automation.
plugins/cicd-automation/skills/secrets-management/SKILL.md | skill | Implement secure secrets management for CI/CD pipelines using Vault, AWS Secrets Manager, or native platform solutions.
plugins/cloud-infrastructure/.claude-plugin/plugin.json | config | Cloud architecture design for AWS/Azure/GCP/OCI, Kubernetes cluster configuration, Terraform infrastructure-as-code, hybrid cloud networking, and multi-cloud cost optimization.
plugins/cloud-infrastructure/agents/cloud-architect.md | agent | Expert cloud architect specializing in AWS/Azure/GCP/OCI multi-cloud infrastructure design, advanced IaC (Terraform/OpenTofu/CDK), FinOps cost optimization, and modern architectural patterns.
plugins/cloud-infrastructure/agents/deployment-engineer.md | agent | Expert deployment engineer specializing in modern CI/CD pipelines, GitOps workflows, and advanced deployment automation.
plugins/cloud-infrastructure/agents/hybrid-cloud-architect.md | agent | Expert hybrid cloud architect specializing in complex multi-cloud solutions across AWS/Azure/GCP/OCI and private clouds (OpenStack/VMware).
plugins/cloud-infrastructure/agents/kubernetes-architect.md | agent | Expert Kubernetes architect specializing in cloud-native infrastructure, advanced GitOps workflows (ArgoCD/Flux), and enterprise container orchestration.
plugins/cloud-infrastructure/agents/network-engineer.md | agent | Expert network engineer specializing in modern cloud networking, security architectures, and performance optimization.
plugins/cloud-infrastructure/agents/service-mesh-expert.md | agent | Service Mesh Expert.
plugins/cloud-infrastructure/agents/terraform-specialist.md | agent | Expert Terraform/OpenTofu specialist mastering advanced IaC automation, state management, and enterprise infrastructure patterns.
plugins/cloud-infrastructure/skills/cost-optimization/SKILL.md | skill | Optimize cloud costs across AWS, Azure, GCP, and OCI through resource rightsizing, tagging strategies, reserved instances, and spending analysis.
plugins/cloud-infrastructure/skills/hybrid-cloud-networking/SKILL.md | skill | Configure secure, high-performance connectivity between on-premises infrastructure and cloud platforms using VPN and dedicated connections.
plugins/cloud-infrastructure/skills/istio-traffic-management/SKILL.md | skill | Configure Istio traffic management including routing, load balancing, circuit breakers, and canary deployments.
plugins/cloud-infrastructure/skills/linkerd-patterns/SKILL.md | skill | Implement Linkerd service mesh patterns for lightweight, security-focused service mesh deployments.
plugins/cloud-infrastructure/skills/mtls-configuration/SKILL.md | skill | Configure mutual TLS (mTLS) for zero-trust service-to-service communication.
plugins/cloud-infrastructure/skills/multi-cloud-architecture/SKILL.md | skill | Design multi-cloud architectures using a decision framework to select and integrate services across AWS, Azure, GCP, and OCI.
plugins/cloud-infrastructure/skills/service-mesh-observability/SKILL.md | skill | Implement comprehensive observability for service meshes including distributed tracing, metrics, and visualization.
plugins/cloud-infrastructure/skills/terraform-module-library/SKILL.md | skill | Build reusable Terraform modules for AWS, Azure, GCP, and OCI infrastructure following infrastructure-as-code best practices.
plugins/code-documentation/.claude-plugin/plugin.json | config | Documentation generation, code explanation, and technical writing with automated doc generation and tutorial creation.
plugins/code-documentation/agents/code-reviewer.md | agent | Elite code review expert specializing in modern AI-powered code analysis, security vulnerabilities, performance optimization, and production reliability.
plugins/code-documentation/agents/docs-architect.md | agent | Creates comprehensive technical documentation from existing codebases.
plugins/code-documentation/agents/tutorial-engineer.md | agent | Creates step-by-step tutorials and educational content from code.
plugins/code-documentation/commands/code-explain.md | prompt | Code Explanation and Analysis.
plugins/code-documentation/commands/doc-generate.md | prompt | Automated Documentation Generation.
plugins/code-refactoring/.claude-plugin/plugin.json | config | Code cleanup, refactoring automation, and technical debt management with context restoration.
plugins/code-refactoring/agents/code-reviewer.md | agent | Elite code review expert specializing in modern AI-powered code analysis, security vulnerabilities, performance optimization, and production reliability.
plugins/code-refactoring/agents/legacy-modernizer.md | agent | Refactor legacy codebases, migrate outdated frameworks, and implement gradual modernization.
plugins/code-refactoring/commands/context-restore.md | prompt | Context Restoration: Advanced Semantic Memory Rehydration.
plugins/code-refactoring/commands/refactor-clean.md | prompt | Refactor and Clean Code.
plugins/code-refactoring/commands/tech-debt.md | prompt | Technical Debt Analysis and Remediation.
plugins/codebase-cleanup/.claude-plugin/plugin.json | config | Technical debt reduction, dependency updates, and code refactoring automation.
plugins/codebase-cleanup/agents/code-reviewer.md | agent | Elite code review expert specializing in modern AI-powered code analysis, security vulnerabilities, performance optimization, and production reliability.
plugins/codebase-cleanup/agents/test-automator.md | agent | Master AI-powered test automation with modern frameworks, self-healing tests, and comprehensive quality engineering.
plugins/codebase-cleanup/commands/deps-audit.md | prompt | Dependency Audit and Security Analysis.
plugins/codebase-cleanup/commands/refactor-clean.md | prompt | Refactor and Clean Code.
plugins/codebase-cleanup/commands/tech-debt.md | prompt | Technical Debt Analysis and Remediation.
plugins/comprehensive-review/.claude-plugin/plugin.json | config | Multi-perspective code analysis covering architecture, security, and best practices.
plugins/comprehensive-review/agents/architect-review.md | agent | Master software architect specializing in modern architecture patterns, clean architecture, microservices, event-driven systems, and DDD.
plugins/comprehensive-review/agents/code-reviewer.md | agent | Elite code review expert specializing in modern AI-powered code analysis, security vulnerabilities, performance optimization, and production reliability.
plugins/comprehensive-review/agents/security-auditor.md | agent | Expert security auditor specializing in DevSecOps, comprehensive cybersecurity, and compliance frameworks.
plugins/comprehensive-review/commands/full-review.md | prompt | Orchestrate comprehensive multi-dimensional code review using specialized review agents across architecture, security, performance, testing, and best practices.
plugins/comprehensive-review/commands/pr-enhance.md | prompt | Pull Request Enhancement.
plugins/conductor/.claude-plugin/plugin.json | config | Context-Driven Development plugin that transforms Claude Code into a project management tool with structured workflow: Context → Spec & Plan → Implement.
plugins/conductor/agents/conductor-validator.md | agent | Validates Conductor project artifacts for completeness, consistency, and correctness.
plugins/conductor/commands/implement.md | prompt | Execute tasks from a track's implementation plan following TDD workflow.
plugins/conductor/commands/manage.md | prompt | Manage track lifecycle: archive, restore, delete, rename, and cleanup.
plugins/conductor/commands/new-track.md | prompt | Create a new track with specification and phased implementation plan.
plugins/conductor/commands/revert.md | prompt | Git-aware undo by logical work unit (track, phase, or task).
plugins/conductor/commands/setup.md | prompt | Initialize project with Conductor artifacts (product definition, tech stack, workflow, style guides).
plugins/conductor/commands/status.md | prompt | Display project status, active tracks, and next actions.
plugins/conductor/skills/context-driven-development/SKILL.md | skill | >-.
plugins/conductor/skills/track-management/SKILL.md | skill | Use this skill when creating, managing, or working with Conductor tracks - the logical work units for features, bugs, and refactors.
plugins/conductor/skills/workflow-patterns/SKILL.md | skill | Use this skill when implementing tasks according to Conductor's TDD workflow, handling phase checkpoints, managing git commits for tasks, or understanding the verification protocol.
plugins/conductor/templates/code_styleguides/csharp.md | prompt | C# Style Guide.
plugins/conductor/templates/code_styleguides/dart.md | prompt | Dart/Flutter Style Guide.
plugins/conductor/templates/code_styleguides/general.md | prompt | General Code Style Guide.
plugins/conductor/templates/code_styleguides/go.md | prompt | Go Style Guide.
plugins/conductor/templates/code_styleguides/html-css.md | prompt | HTML & CSS Style Guide.
plugins/conductor/templates/code_styleguides/javascript.md | prompt | JavaScript Style Guide.
plugins/conductor/templates/code_styleguides/python.md | prompt | Python Style Guide.
plugins/conductor/templates/code_styleguides/typescript.md | prompt | TypeScript Style Guide.
plugins/conductor/templates/index.md | prompt | Template for organizing track artifacts and navigation.
plugins/conductor/templates/product-guidelines.md | prompt | Template for documenting product constraints and guidelines.
plugins/conductor/templates/product.md | prompt | Template for capturing product goals, scope, and context.
plugins/conductor/templates/tech-stack.md | prompt | Template for defining the target technology stack.
plugins/conductor/templates/track-plan.md | prompt | Template for a phased implementation plan with tasks, verification, and checkpoints.
plugins/conductor/templates/track-spec.md | prompt | Template for a track specification with requirements and acceptance criteria.
plugins/conductor/templates/tracks.md | prompt | Template for listing and tracking multiple work streams.
plugins/conductor/templates/workflow.md | prompt | Template for the overall workflow and phase structure.
plugins/content-marketing/.claude-plugin/plugin.json | config | Content marketing strategy, web research, and information synthesis for marketing operations.
plugins/content-marketing/agents/content-marketer.md | agent | Elite content marketing strategist specializing in AI-powered content creation, omnichannel distribution, SEO optimization, and data-driven performance marketing.
plugins/content-marketing/agents/search-specialist.md | agent | Expert web researcher using advanced search techniques and synthesis.
plugins/context-management/.claude-plugin/plugin.json | config | Context persistence, restoration, and long-running conversation management.
plugins/context-management/agents/context-manager.md | agent | Elite AI context engineering specialist mastering dynamic context management, vector databases, knowledge graphs, and intelligent memory systems.
plugins/context-management/commands/context-restore.md | prompt | Context Restoration: Advanced Semantic Memory Rehydration.
plugins/context-management/commands/context-save.md | prompt | Context Save Tool: Intelligent Context Management Specialist.
plugins/customer-sales-automation/.claude-plugin/plugin.json | config | Customer support workflow automation, sales pipeline management, email campaigns, and CRM integration.
plugins/customer-sales-automation/agents/customer-support.md | agent | Elite AI-powered customer support specialist mastering conversational AI, automated ticketing, sentiment analysis, and omnichannel support experiences.
plugins/customer-sales-automation/agents/sales-automator.md | agent | Draft cold emails, follow-ups, and proposal templates.
plugins/data-engineering/.claude-plugin/plugin.json | config | ETL pipeline construction, data warehouse design, batch processing workflows, and data-driven feature development.
plugins/data-engineering/agents/backend-architect.md | agent | Expert backend architect specializing in scalable API design, microservices architecture, and distributed systems.
plugins/data-engineering/agents/data-engineer.md | agent | Build scalable data pipelines, modern data warehouses, and real-time streaming architectures.
plugins/data-engineering/commands/data-driven-feature.md | prompt | Build features guided by data insights, A/B testing, and continuous measurement.
plugins/data-engineering/commands/data-pipeline.md | prompt | Data Pipeline Architecture.
plugins/data-engineering/skills/airflow-dag-patterns/SKILL.md | skill | Build production Apache Airflow DAGs with best practices for operators, sensors, testing, and deployment.
plugins/data-engineering/skills/data-quality-frameworks/SKILL.md | skill | Implement data quality validation with Great Expectations, dbt tests, and data contracts.
plugins/data-engineering/skills/dbt-transformation-patterns/SKILL.md | skill | Master dbt (data build tool) for analytics engineering with model organization, testing, documentation, and incremental strategies.
plugins/data-engineering/skills/spark-optimization/SKILL.md | skill | Optimize Apache Spark jobs with partitioning, caching, shuffle optimization, and memory tuning.
plugins/data-validation-suite/.claude-plugin/plugin.json | config | Schema validation, data quality monitoring, streaming validation pipelines, and input validation for backend APIs.
plugins/data-validation-suite/agents/backend-security-coder.md | agent | Expert in secure backend coding practices specializing in input validation, authentication, and API security.
plugins/database-cloud-optimization/.claude-plugin/plugin.json | config | Database query optimization, cloud cost optimization, and scalability improvements.
plugins/database-cloud-optimization/agents/backend-architect.md | agent | Expert backend architect specializing in scalable API design, microservices architecture, and distributed systems.
plugins/database-cloud-optimization/agents/cloud-architect.md | agent | Expert cloud architect specializing in AWS/Azure/GCP/OCI multi-cloud infrastructure design, advanced IaC (Terraform/OpenTofu/CDK), FinOps cost optimization, and modern architectural patterns.
plugins/database-cloud-optimization/agents/database-architect.md | agent | Expert database architect specializing in data layer design from scratch, technology selection, schema modeling, and scalable database architectures.
plugins/database-cloud-optimization/agents/database-optimizer.md | agent | Expert database optimizer specializing in modern performance tuning, query optimization, and scalable architectures.
plugins/database-cloud-optimization/commands/cost-optimize.md | prompt | Cloud Cost Optimization.
plugins/database-design/.claude-plugin/plugin.json | config | Database architecture, schema design, and SQL optimization for production systems.
plugins/database-design/agents/database-architect.md | agent | Expert database architect specializing in data layer design from scratch, technology selection, schema modeling, and scalable database architectures.
plugins/database-design/agents/sql-pro.md | agent | Master modern SQL with cloud-native databases, OLTP/OLAP optimization, and advanced query techniques.
plugins/database-design/skills/postgresql/SKILL.md | skill | Use this skill when designing or reviewing a PostgreSQL-specific schema.
plugins/database-migrations/.claude-plugin/plugin.json | config | Database migration automation, observability, and cross-database migration strategies.
plugins/database-migrations/agents/database-admin.md | agent | Expert database administrator specializing in modern cloud databases, automation, and reliability engineering.
plugins/database-migrations/agents/database-optimizer.md | agent | Expert database optimizer specializing in modern performance tuning, query optimization, and scalable architectures.
plugins/database-migrations/commands/migration-observability.md | prompt | Migration monitoring, CDC, and observability infrastructure.
plugins/database-migrations/commands/sql-migrations.md | prompt | SQL database migrations with zero-downtime strategies for PostgreSQL, MySQL, SQL Server.
plugins/debugging-toolkit/.claude-plugin/plugin.json | config | Interactive debugging, developer experience optimization, and smart debugging workflows.
plugins/debugging-toolkit/agents/debugger.md | agent | Debugging specialist for errors, test failures, and unexpected behavior.
plugins/debugging-toolkit/agents/dx-optimizer.md | agent | Developer Experience specialist.
plugins/debugging-toolkit/commands/smart-debug.md | prompt | You are an expert AI-assisted debugging specialist with deep knowledge of modern debugging tools, observability platforms, and automated root cause analysis.
plugins/dependency-management/.claude-plugin/plugin.json | config | Dependency auditing, version management, and security vulnerability scanning.
plugins/dependency-management/agents/legacy-modernizer.md | agent | Refactor legacy codebases, migrate outdated frameworks, and implement gradual modernization.
plugins/dependency-management/commands/deps-audit.md | prompt | Dependency Audit and Security Analysis.
plugins/deployment-strategies/.claude-plugin/plugin.json | config | Deployment patterns, rollback automation, and infrastructure templates.
plugins/deployment-strategies/agents/deployment-engineer.md | agent | Expert deployment engineer specializing in modern CI/CD pipelines, GitOps workflows, and advanced deployment automation.
plugins/deployment-strategies/agents/terraform-specialist.md | agent | Expert Terraform/OpenTofu specialist mastering advanced IaC automation, state management, and enterprise infrastructure patterns.
plugins/deployment-validation/.claude-plugin/plugin.json | config | Pre-deployment checks, configuration validation, and deployment readiness assessment.
plugins/deployment-validation/agents/cloud-architect.md | agent | Expert cloud architect specializing in AWS/Azure/GCP/OCI multi-cloud infrastructure design, advanced IaC (Terraform/OpenTofu/CDK), FinOps cost optimization, and modern architectural patterns.
plugins/deployment-validation/commands/config-validate.md | prompt | Configuration Validation.
plugins/developer-essentials/.claude-plugin/plugin.json | config | Essential developer skills including Git workflows, SQL optimization, error handling, code review, E2E testing, authentication, debugging, and monorepo management.
plugins/developer-essentials/agents/monorepo-architect.md | agent | Monorepo Architect.
plugins/developer-essentials/skills/auth-implementation-patterns/SKILL.md | skill | Master authentication and authorization patterns including JWT, OAuth2, session management, and RBAC to build secure, scalable access control systems.
plugins/developer-essentials/skills/bazel-build-optimization/SKILL.md | skill | Optimize Bazel builds for large-scale monorepos.
plugins/developer-essentials/skills/code-review-excellence/SKILL.md | skill | Master effective code review practices to provide constructive feedback, catch bugs early, and foster knowledge sharing while maintaining team morale.
plugins/developer-essentials/skills/debugging-strategies/SKILL.md | skill | Master systematic debugging techniques, profiling tools, and root cause analysis to efficiently track down bugs across any codebase or technology stack.
plugins/developer-essentials/skills/e2e-testing-patterns/SKILL.md | skill | Master end-to-end testing with Playwright and Cypress to build reliable test suites that catch bugs, improve confidence, and enable fast deployment.
plugins/developer-essentials/skills/error-handling-patterns/SKILL.md | skill | Master error handling patterns across languages including exceptions, Result types, error propagation, and graceful degradation to build resilient applications.
plugins/developer-essentials/skills/git-advanced-workflows/SKILL.md | skill | Master advanced Git workflows including rebasing, cherry-picking, bisect, worktrees, and reflog to maintain clean history and recover from any situation.
plugins/developer-essentials/skills/monorepo-management/SKILL.md | skill | Master monorepo management with Turborepo, Nx, and pnpm workspaces to build efficient, scalable multi-package repositories with optimized builds and dependency management.
plugins/developer-essentials/skills/nx-workspace-patterns/SKILL.md | skill | Configure and optimize Nx monorepo workspaces.
plugins/developer-essentials/skills/sql-optimization-patterns/SKILL.md | skill | Master SQL query optimization, indexing strategies, and EXPLAIN analysis to dramatically improve database performance and eliminate slow queries.
plugins/developer-essentials/skills/turborepo-caching/SKILL.md | skill | Configure Turborepo for efficient monorepo builds with local and remote caching.
plugins/distributed-debugging/.claude-plugin/plugin.json | config | Distributed system tracing and debugging across microservices.
plugins/distributed-debugging/agents/devops-troubleshooter.md | agent | Expert DevOps troubleshooter specializing in rapid incident response, advanced debugging, and modern observability.
plugins/distributed-debugging/agents/error-detective.md | agent | Search logs and codebases for error patterns, stack traces, and anomalies.
plugins/distributed-debugging/commands/debug-trace.md | prompt | Debug and Trace Configuration.
plugins/documentation-generation/.claude-plugin/plugin.json | config | OpenAPI specification generation, Mermaid diagram creation, tutorial writing, API reference documentation.
plugins/documentation-generation/agents/api-documenter.md | agent | Master API documentation with OpenAPI 3.1, AI-powered tools, and modern developer experience practices.
plugins/documentation-generation/agents/docs-architect.md | agent | Creates comprehensive technical documentation from existing codebases.
plugins/documentation-generation/agents/mermaid-expert.md | agent | Create Mermaid diagrams for flowcharts, sequences, ERDs, and architectures.
plugins/documentation-generation/agents/reference-builder.md | agent | Creates exhaustive technical references and API documentation.
plugins/documentation-generation/agents/tutorial-engineer.md | agent | Creates step-by-step tutorials and educational content from code.
plugins/documentation-generation/commands/doc-generate.md | prompt | Automated Documentation Generation.
plugins/documentation-generation/skills/architecture-decision-records/SKILL.md | skill | Write and maintain Architecture Decision Records (ADRs) following best practices for technical decision documentation.
plugins/documentation-generation/skills/changelog-automation/SKILL.md | skill | Automate changelog generation from commits, PRs, and releases following Keep a Changelog format.
plugins/documentation-generation/skills/openapi-spec-generation/SKILL.md | skill | Generate and maintain OpenAPI 3.1 specifications from code, design-first specs, and validation patterns.
plugins/dotnet-contribution/.claude-plugin/plugin.json | config | Comprehensive .NET backend development with C#, ASP.NET Core, Entity Framework Core, and Dapper for production-grade applications.
plugins/dotnet-contribution/agents/dotnet-architect.md | agent | Expert .NET backend architect specializing in C#, ASP.NET Core, Entity Framework, Dapper, and enterprise application patterns.
plugins/dotnet-contribution/skills/dotnet-backend-patterns/SKILL.md | skill | Master C#/.NET backend development patterns for building robust APIs, MCP servers, and enterprise applications.
plugins/error-debugging/.claude-plugin/plugin.json | config | Error analysis, trace debugging, and multi-agent problem diagnosis.
plugins/error-debugging/agents/debugger.md | agent | Debugging specialist for errors, test failures, and unexpected behavior.
plugins/error-debugging/agents/error-detective.md | agent | Search logs and codebases for error patterns, stack traces, and anomalies.
plugins/error-debugging/commands/error-analysis.md | prompt | Error Analysis and Resolution.
plugins/error-debugging/commands/error-trace.md | prompt | Error Tracking and Monitoring.
plugins/error-debugging/commands/multi-agent-review.md | prompt | Multi-Agent Code Review Orchestration Tool.
plugins/error-diagnostics/.claude-plugin/plugin.json | config | Error tracing, root cause analysis, and smart debugging for production systems.
plugins/error-diagnostics/agents/debugger.md | agent | Debugging specialist for errors, test failures, and unexpected behavior.
plugins/error-diagnostics/agents/error-detective.md | agent | Search logs and codebases for error patterns, stack traces, and anomalies.
plugins/error-diagnostics/commands/error-analysis.md | prompt | Error Analysis and Resolution.
plugins/error-diagnostics/commands/error-trace.md | prompt | Error Tracking and Monitoring.
plugins/error-diagnostics/commands/smart-debug.md | prompt | You are an expert AI-assisted debugging specialist with deep knowledge of modern debugging tools, observability platforms, and automated root cause analysis.
plugins/framework-migration/.claude-plugin/plugin.json | config | Framework updates, migration planning, and architectural transformation workflows.
plugins/framework-migration/agents/architect-review.md | agent | Master software architect specializing in modern architecture patterns, clean architecture, microservices, event-driven systems, and DDD.
plugins/framework-migration/agents/legacy-modernizer.md | agent | Refactor legacy codebases, migrate outdated frameworks, and implement gradual modernization.
plugins/framework-migration/commands/code-migrate.md | prompt | Code Migration Assistant.
plugins/framework-migration/commands/deps-upgrade.md | prompt | Dependency Upgrade Strategy.
plugins/framework-migration/commands/legacy-modernize.md | prompt | Orchestrate legacy system modernization using the strangler fig pattern with gradual component replacement.
plugins/framework-migration/skills/angular-migration/SKILL.md | skill | Migrate from AngularJS to Angular using hybrid mode, incremental component rewriting, and dependency injection updates.
plugins/framework-migration/skills/database-migration/SKILL.md | skill | Execute database migrations across ORMs and platforms with zero-downtime strategies, data transformation, and rollback procedures.
plugins/framework-migration/skills/dependency-upgrade/SKILL.md | skill | Manage major dependency version upgrades with compatibility analysis, staged rollout, and comprehensive testing.
plugins/framework-migration/skills/react-modernization/SKILL.md | skill | Upgrade React applications to latest versions, migrate from class components to hooks, and adopt concurrent features.
plugins/frontend-mobile-development/.claude-plugin/plugin.json | config | Frontend UI development and mobile application implementation across platforms.
plugins/frontend-mobile-development/agents/frontend-developer.md | agent | Build React components, implement responsive layouts, and handle client-side state management.
plugins/frontend-mobile-development/agents/mobile-developer.md | agent | Develop React Native, Flutter, or native mobile apps with modern architecture patterns.
plugins/frontend-mobile-development/commands/component-scaffold.md | prompt | React/React Native Component Scaffolding.
plugins/frontend-mobile-development/skills/nextjs-app-router-patterns/SKILL.md | skill | Master Next.js 14+ App Router with Server Components, streaming, parallel routes, and advanced data fetching.
plugins/frontend-mobile-development/skills/react-native-architecture/SKILL.md | skill | Build production React Native apps with Expo, navigation, native modules, offline sync, and cross-platform patterns.
plugins/frontend-mobile-development/skills/react-state-management/SKILL.md | skill | Master modern React state management with Redux Toolkit, Zustand, Jotai, and React Query.
plugins/frontend-mobile-development/skills/tailwind-design-system/SKILL.md | skill | Build scalable design systems with Tailwind CSS v4, design tokens, component libraries, and responsive patterns.
plugins/frontend-mobile-security/.claude-plugin/plugin.json | config | XSS prevention, CSRF protection, content security policies, mobile app security, and secure storage patterns.
plugins/frontend-mobile-security/agents/frontend-developer.md | agent | Build React components, implement responsive layouts, and handle client-side state management.
plugins/frontend-mobile-security/agents/frontend-security-coder.md | agent | Expert in secure frontend coding practices specializing in XSS prevention, output sanitization, and client-side security patterns.
plugins/frontend-mobile-security/agents/mobile-security-coder.md | agent | Expert in secure mobile coding practices specializing in input validation, WebView security, and mobile-specific security patterns.
plugins/frontend-mobile-security/commands/xss-scan.md | prompt | XSS Vulnerability Scanner for Frontend Code.
plugins/full-stack-orchestration/.claude-plugin/plugin.json | config | End-to-end feature orchestration with testing, security, performance, and deployment.
plugins/full-stack-orchestration/agents/deployment-engineer.md | agent | Expert deployment engineer specializing in modern CI/CD pipelines, GitOps workflows, and advanced deployment automation.
plugins/full-stack-orchestration/agents/performance-engineer.md | agent | Expert performance engineer specializing in modern observability, application optimization, and scalable system performance.
plugins/full-stack-orchestration/agents/security-auditor.md | agent | Expert security auditor specializing in DevSecOps, comprehensive cybersecurity, and compliance frameworks.
plugins/full-stack-orchestration/agents/test-automator.md | agent | Master AI-powered test automation with modern frameworks, self-healing tests, and comprehensive quality engineering.
plugins/full-stack-orchestration/commands/full-stack-feature.md | prompt | Orchestrate end-to-end full-stack feature development across backend, frontend, database, and infrastructure layers.
plugins/functional-programming/.claude-plugin/plugin.json | config | Functional programming with Elixir, OTP patterns, Phoenix framework, and distributed systems.
plugins/functional-programming/agents/elixir-pro.md | agent | Write idiomatic Elixir code with OTP patterns, supervision trees, and Phoenix LiveView.
plugins/functional-programming/agents/haskell-pro.md | agent | Expert Haskell engineer specializing in advanced type systems, pure functional design, and high-reliability software.
plugins/game-development/.claude-plugin/plugin.json | config | Unity game development with C# scripting, Minecraft server plugin development with Bukkit/Spigot APIs.
plugins/game-development/agents/minecraft-bukkit-pro.md | agent | Master Minecraft server plugin development with Bukkit, Spigot, and Paper APIs.
plugins/game-development/agents/unity-developer.md | agent | Build Unity games with optimized C# scripts, efficient rendering, and proper asset management.
plugins/game-development/skills/godot-gdscript-patterns/SKILL.md | skill | Master Godot 4 GDScript patterns including signals, scenes, state machines, and optimization.
plugins/game-development/skills/unity-ecs-patterns/SKILL.md | skill | Master Unity ECS (Entity Component System) with DOTS, Jobs, and Burst for high-performance game development.
plugins/git-pr-workflows/.claude-plugin/plugin.json | config | Git workflow automation, pull request enhancement, and team onboarding processes.
plugins/git-pr-workflows/agents/code-reviewer.md | agent | Elite code review expert specializing in modern AI-powered code analysis, security vulnerabilities, performance optimization, and production reliability.
plugins/git-pr-workflows/commands/git-workflow.md | prompt | Orchestrate git workflow from code review through PR creation with quality gates.
plugins/git-pr-workflows/commands/onboard.md | prompt | Onboard.
plugins/git-pr-workflows/commands/pr-enhance.md | prompt | Pull Request Enhancement.
plugins/hr-legal-compliance/.claude-plugin/plugin.json | config | HR policy documentation, legal compliance templates (GDPR/SOC2/HIPAA), employment contracts, and regulatory documentation.
plugins/hr-legal-compliance/agents/hr-pro.md | agent | Professional, ethical HR partner for hiring, onboarding/offboarding, PTO and leave, performance, compliant policies, and employee relations.
plugins/hr-legal-compliance/agents/legal-advisor.md | agent | Draft privacy policies, terms of service, disclaimers, and legal notices.
plugins/hr-legal-compliance/skills/employment-contract-templates/SKILL.md | skill | Create employment contracts, offer letters, and HR policy documents following legal best practices.
plugins/hr-legal-compliance/skills/gdpr-data-handling/SKILL.md | skill | Implement GDPR-compliant data handling with consent management, data subject rights, and privacy by design.
plugins/incident-response/.claude-plugin/plugin.json | config | Production incident management, triage workflows, and automated incident resolution.
plugins/incident-response/agents/code-reviewer.md | agent | Reviews code for logic flaws, type safety gaps, error handling issues, architectural concerns, and similar vulnerability patterns.
plugins/incident-response/agents/debugger.md | agent | Performs deep root cause analysis through code path tracing, git bisect automation, dependency analysis, and systematic hypothesis testing for production bugs.
plugins/incident-response/agents/devops-troubleshooter.md | agent | Expert DevOps troubleshooter specializing in rapid incident response, advanced debugging, and modern observability.
plugins/incident-response/agents/error-detective.md | agent | Analyzes error traces, logs, and observability data to identify error signatures, reproduction steps, user impact, and timeline context for production issues.
plugins/incident-response/agents/incident-responder.md | agent | Expert SRE incident responder specializing in rapid problem resolution, modern observability, and comprehensive incident management.
plugins/incident-response/agents/test-automator.md | agent | Creates comprehensive test suites including unit, integration, regression, and security tests.
plugins/incident-response/commands/incident-response.md | prompt | Orchestrate multi-agent incident response with modern SRE practices for rapid resolution and learning.
plugins/incident-response/commands/smart-fix.md | prompt | Intelligent issue resolution with multi-agent debugging, root cause analysis, and verified fix implementation.
plugins/incident-response/skills/incident-runbook-templates/SKILL.md | skill | Create structured incident response runbooks with step-by-step procedures, escalation paths, and recovery actions.
plugins/incident-response/skills/on-call-handoff-patterns/SKILL.md | skill | Master on-call shift handoffs with context transfer, escalation procedures, and documentation.
plugins/incident-response/skills/postmortem-writing/SKILL.md | skill | Write effective blameless postmortems with root cause analysis, timelines, and action items.
plugins/javascript-typescript/.claude-plugin/plugin.json | config | JavaScript and TypeScript development with ES6+, Node.js, React, and modern web frameworks.
plugins/javascript-typescript/agents/javascript-pro.md | agent | Master modern JavaScript with ES6+, async patterns, and Node.js APIs.
plugins/javascript-typescript/agents/typescript-pro.md | agent | Master TypeScript with advanced types, generics, and strict type safety.
plugins/javascript-typescript/commands/typescript-scaffold.md | prompt | TypeScript Project Scaffolding.
plugins/javascript-typescript/skills/javascript-testing-patterns/SKILL.md | skill | Implement comprehensive testing strategies using Jest, Vitest, and Testing Library for unit tests, integration tests, and end-to-end testing with mocking, fixtures, and test-driven development.
plugins/javascript-typescript/skills/modern-javascript-patterns/SKILL.md | skill | Master ES6+ features including async/await, destructuring, spread operators, arrow functions, promises, modules, iterators, generators, and functional programming patterns for writing clean, efficient JavaScript code.
plugins/javascript-typescript/skills/nodejs-backend-patterns/SKILL.md | skill | Build production-ready Node.js backend services with Express/Fastify, implementing middleware patterns, error handling, authentication, database integration, and API design best practices.
plugins/javascript-typescript/skills/typescript-advanced-types/SKILL.md | skill | Master TypeScript's advanced type system including generics, conditional types, mapped types, template literals, and utility types for building type-safe applications.
plugins/julia-development/.claude-plugin/plugin.json | config | Modern Julia development with Julia 1.10+, package management, scientific computing, high-performance numerical code, and production best practices.
plugins/julia-development/agents/julia-pro.md | agent | Master Julia 1.10+ with modern features, performance optimization, multiple dispatch, and production-ready practices.
plugins/jvm-languages/.claude-plugin/plugin.json | config | JVM language development including Java, Scala, and C# with enterprise patterns and frameworks.
plugins/jvm-languages/agents/csharp-pro.md | agent | Write modern C# code with advanced features like records, pattern matching, and async/await.
plugins/jvm-languages/agents/java-pro.md | agent | Master Java 21+ with modern features like virtual threads, pattern matching, and Spring Boot 3.x.
plugins/jvm-languages/agents/scala-pro.md | agent | Master enterprise-grade Scala development with functional programming, distributed systems, and big data processing.
plugins/kubernetes-operations/.claude-plugin/plugin.json | config | Kubernetes manifest generation, networking configuration, security policies, observability setup, GitOps workflows, and auto-scaling.
plugins/kubernetes-operations/agents/kubernetes-architect.md | agent | Expert Kubernetes architect specializing in cloud-native infrastructure, advanced GitOps workflows (ArgoCD/Flux), and enterprise container orchestration.
plugins/kubernetes-operations/skills/gitops-workflow/SKILL.md | skill | Implement GitOps workflows with ArgoCD and Flux for automated, declarative Kubernetes deployments with continuous reconciliation.
plugins/kubernetes-operations/skills/helm-chart-scaffolding/SKILL.md | skill | Design, organize, and manage Helm charts for templating and packaging Kubernetes applications with reusable configurations.
plugins/kubernetes-operations/skills/k8s-manifest-generator/SKILL.md | skill | Create production-ready Kubernetes manifests for Deployments, Services, ConfigMaps, and Secrets following best practices and security standards.
plugins/kubernetes-operations/skills/k8s-security-policies/SKILL.md | skill | Implement Kubernetes security policies including NetworkPolicy, PodSecurityPolicy, and RBAC for production-grade security.
plugins/llm-application-dev/.claude-plugin/plugin.json | config | LLM application development with LangGraph, RAG systems, vector search, and AI agent architectures for Claude 4.6 and GPT-5.2.
plugins/llm-application-dev/agents/ai-engineer.md | agent | Build production-ready LLM applications, advanced RAG systems, and intelligent agents.
plugins/llm-application-dev/agents/prompt-engineer.md | agent | Expert prompt engineer specializing in advanced prompting techniques, LLM optimization, and AI system design.
plugins/llm-application-dev/agents/vector-database-engineer.md | agent | Expert in vector databases, embedding strategies, and semantic search implementation.
plugins/llm-application-dev/commands/ai-assistant.md | prompt | Build AI assistant application with NLU, dialog management, and integrations.
plugins/llm-application-dev/commands/langchain-agent.md | prompt | Create LangGraph-based agent with modern patterns.
plugins/llm-application-dev/commands/prompt-optimize.md | prompt | Optimize prompts for production with CoT, few-shot, and constitutional AI patterns.
plugins/llm-application-dev/skills/embedding-strategies/SKILL.md | skill | Select and optimize embedding models for semantic search and RAG applications.
plugins/llm-application-dev/skills/hybrid-search-implementation/SKILL.md | skill | Combine vector and keyword search for improved retrieval.
plugins/llm-application-dev/skills/langchain-architecture/SKILL.md | skill | Design LLM applications using LangChain 1.x and LangGraph for agents, memory, and tool integration.
plugins/llm-application-dev/skills/llm-evaluation/SKILL.md | skill | Implement comprehensive evaluation strategies for LLM applications using automated metrics, human feedback, and benchmarking.
plugins/llm-application-dev/skills/prompt-engineering-patterns/SKILL.md | skill | Master advanced prompt engineering techniques to maximize LLM performance, reliability, and controllability in production.
plugins/llm-application-dev/skills/rag-implementation/SKILL.md | skill | Build Retrieval-Augmented Generation (RAG) systems for LLM applications with vector databases and semantic search.
plugins/llm-application-dev/skills/similarity-search-patterns/SKILL.md | skill | Implement efficient similarity search with vector databases.
plugins/llm-application-dev/skills/vector-index-tuning/SKILL.md | skill | Optimize vector index performance for latency, recall, and memory.
plugins/machine-learning-ops/.claude-plugin/plugin.json | config | ML model training pipelines, hyperparameter tuning, model deployment automation, experiment tracking, and MLOps workflows.
plugins/machine-learning-ops/agents/data-scientist.md | agent | Expert data scientist for advanced analytics, machine learning, and statistical modeling.
plugins/machine-learning-ops/agents/ml-engineer.md | agent | Build production ML systems with PyTorch 2.x, TensorFlow, and modern ML frameworks.
plugins/machine-learning-ops/agents/mlops-engineer.md | agent | Build comprehensive ML pipelines, experiment tracking, and model registries with MLflow, Kubeflow, and modern MLOps tools.
plugins/machine-learning-ops/commands/ml-pipeline.md | prompt | Machine Learning Pipeline - Multi-Agent MLOps Orchestration.
plugins/machine-learning-ops/skills/ml-pipeline-workflow/SKILL.md | skill | Build end-to-end MLOps pipelines from data preparation through model training, validation, and production deployment.
plugins/meigen-ai-design/.claude-plugin/plugin.json | config | AI image generation with creative workflow orchestration, parallel multi-direction output, prompt engineering, and a 1,300+ curated inspiration library.
plugins/meigen-ai-design/agents/gallery-researcher.md | agent | >-.
plugins/meigen-ai-design/agents/image-generator.md | agent | >-.
plugins/meigen-ai-design/agents/prompt-crafter.md | agent | >-.
plugins/meigen-ai-design/commands/find.md | prompt | >-.
plugins/meigen-ai-design/commands/gen.md | prompt | >-.
plugins/multi-platform-apps/.claude-plugin/plugin.json | config | Cross-platform application development coordinating web, iOS, Android, and desktop implementations.
plugins/multi-platform-apps/agents/backend-architect.md | agent | Expert backend architect specializing in scalable API design, microservices architecture, and distributed systems.
plugins/multi-platform-apps/agents/flutter-expert.md | agent | Master Flutter development with Dart 3, advanced widgets, and multi-platform deployment.
plugins/multi-platform-apps/agents/frontend-developer.md | agent | Build React components, implement responsive layouts, and handle client-side state management.
plugins/multi-platform-apps/agents/ios-developer.md | agent | Develop native iOS applications with Swift/SwiftUI.
plugins/multi-platform-apps/agents/mobile-developer.md | agent | Develop React Native, Flutter, or native mobile apps with modern architecture patterns.
plugins/multi-platform-apps/agents/ui-ux-designer.md | agent | Create interface designs, wireframes, and design systems.
plugins/multi-platform-apps/commands/multi-platform.md | prompt | Orchestrate cross-platform feature development across web, mobile, and desktop with API-first architecture.
plugins/observability-monitoring/.claude-plugin/plugin.json | config | Metrics collection, logging infrastructure, distributed tracing, SLO implementation, and monitoring dashboards.
plugins/observability-monitoring/agents/database-optimizer.md | agent | Expert database optimizer specializing in modern performance tuning, query optimization, and scalable architectures.
plugins/observability-monitoring/agents/network-engineer.md | agent | Expert network engineer specializing in modern cloud networking, security architectures, and performance optimization.
plugins/observability-monitoring/agents/observability-engineer.md | agent | Build production-ready monitoring, logging, and tracing systems.
plugins/observability-monitoring/agents/performance-engineer.md | agent | Expert performance engineer specializing in modern observability, application optimization, and scalable system performance.
plugins/observability-monitoring/commands/monitor-setup.md | prompt | Monitoring and Observability Setup.
plugins/observability-monitoring/commands/slo-implement.md | prompt | SLO Implementation Guide.
plugins/observability-monitoring/skills/distributed-tracing/SKILL.md | skill | Implement distributed tracing with Jaeger and Tempo to track requests across microservices and identify performance bottlenecks.
plugins/observability-monitoring/skills/grafana-dashboards/SKILL.md | skill | Create and manage production Grafana dashboards for real-time visualization of system and application metrics.
plugins/observability-monitoring/skills/prometheus-configuration/SKILL.md | skill | Set up Prometheus for comprehensive metric collection, storage, and monitoring of infrastructure and applications.
plugins/observability-monitoring/skills/slo-implementation/SKILL.md | skill | Define and implement Service Level Indicators (SLIs) and Service Level Objectives (SLOs) with error budgets and alerting.
plugins/payment-processing/.claude-plugin/plugin.json | config | Payment gateway integration with Stripe, PayPal, checkout flow implementation, subscription billing, and PCI compliance.
plugins/payment-processing/agents/payment-integration.md | agent | Integrate Stripe, PayPal, and payment processors.
plugins/payment-processing/skills/billing-automation/SKILL.md | skill | Build automated billing systems for recurring payments, invoicing, subscription lifecycle, and dunning management.
plugins/payment-processing/skills/paypal-integration/SKILL.md | skill | Integrate PayPal payment processing with support for express checkout, subscriptions, and refund management.
plugins/payment-processing/skills/pci-compliance/SKILL.md | skill | Implement PCI DSS compliance requirements for secure handling of payment card data and payment systems.
plugins/payment-processing/skills/stripe-integration/SKILL.md | skill | Implement Stripe payment processing for robust, PCI-compliant payment flows including checkout, subscriptions, and webhooks.
plugins/performance-testing-review/.claude-plugin/plugin.json | config | Performance analysis, test coverage review, and AI-powered code quality assessment.
plugins/performance-testing-review/agents/performance-engineer.md | agent | Expert performance engineer specializing in modern observability, application optimization, and scalable system performance.
plugins/performance-testing-review/agents/test-automator.md | agent | Master AI-powered test automation with modern frameworks, self-healing tests, and comprehensive quality engineering.
plugins/performance-testing-review/commands/ai-review.md | prompt | AI-Powered Code Review Specialist.
plugins/performance-testing-review/commands/multi-agent-review.md | prompt | Multi-Agent Code Review Orchestration Tool.
plugins/plugin-eval/.claude-plugin/plugin.json | config | Declares metadata for the plugin-eval plugin so Claude Code can discover and load it.
plugins/plugin-eval/agents/eval-judge.md | agent | LLM judge for plugin quality assessment.
plugins/plugin-eval/agents/eval-orchestrator.md | agent | Orchestrates plugin quality evaluation.
plugins/plugin-eval/commands/certify.md | prompt | Full quality certification with badge.
plugins/plugin-eval/commands/compare.md | prompt | Compare two skills head-to-head.
plugins/plugin-eval/commands/eval.md | prompt | Evaluate a plugin or skill for quality.
plugins/plugin-eval/skills/evaluation-methodology/SKILL.md | skill | PluginEval quality methodology — dimensions, rubrics, statistical methods, and scoring formulas.
plugins/python-development/.claude-plugin/plugin.json | config | Modern Python development with Python 3.12+, Django, FastAPI, async patterns, and production best practices.
plugins/python-development/agents/django-pro.md | agent | Master Django 5.x with async views, DRF, Celery, and Django Channels.
plugins/python-development/agents/fastapi-pro.md | agent | Build high-performance async APIs with FastAPI, SQLAlchemy 2.0, and Pydantic V2.
plugins/python-development/agents/python-pro.md | agent | Master Python 3.12+ with modern features, async programming, performance optimization, and production-ready practices.
plugins/python-development/commands/python-scaffold.md | prompt | Python Project Scaffolding.
plugins/python-development/skills/async-python-patterns/SKILL.md | skill | Master Python asyncio, concurrent programming, and async/await patterns for high-performance applications.
plugins/python-development/skills/python-anti-patterns/SKILL.md | skill | Use this skill when reviewing Python code for common anti-patterns to avoid.
plugins/python-development/skills/python-background-jobs/SKILL.md | skill | Python background job patterns including task queues, workers, and event-driven architecture.
plugins/python-development/skills/python-code-style/SKILL.md | skill | Python code style, linting, formatting, naming conventions, and documentation standards.
plugins/python-development/skills/python-configuration/SKILL.md | skill | Python configuration management via environment variables and typed settings.
plugins/python-development/skills/python-design-patterns/SKILL.md | skill | Python design patterns including KISS, Separation of Concerns, Single Responsibility, and composition over inheritance.
plugins/python-development/skills/python-error-handling/SKILL.md | skill | Python error handling patterns including input validation, exception hierarchies, and partial failure handling.
plugins/python-development/skills/python-observability/SKILL.md | skill | Python observability patterns including structured logging, metrics, and distributed tracing.
plugins/python-development/skills/python-packaging/SKILL.md | skill | Create distributable Python packages with proper project structure, setup.py/pyproject.toml, and publishing to PyPI.
plugins/python-development/skills/python-performance-optimization/SKILL.md | skill | Profile and optimize Python code using cProfile, memory profilers, and performance best practices.
plugins/python-development/skills/python-project-structure/SKILL.md | skill | Python project organization, module architecture, and public API design.
plugins/python-development/skills/python-resilience/SKILL.md | skill | Python resilience patterns including automatic retries, exponential backoff, timeouts, and fault-tolerant decorators.
plugins/python-development/skills/python-resource-management/SKILL.md | skill | Python resource management with context managers, cleanup patterns, and streaming.
plugins/python-development/skills/python-testing-patterns/SKILL.md | skill | Implement comprehensive testing strategies with pytest, fixtures, mocking, and test-driven development.
plugins/python-development/skills/python-type-safety/SKILL.md | skill | Python type safety with type hints, generics, protocols, and strict type checking.
plugins/python-development/skills/uv-package-manager/SKILL.md | skill | Master the uv package manager for fast Python dependency management, virtual environments, and modern Python project workflows.
plugins/quantitative-trading/.claude-plugin/plugin.json | config | Quantitative analysis, algorithmic trading strategies, financial modeling, portfolio risk management, and backtesting.
plugins/quantitative-trading/agents/quant-analyst.md | agent | Build financial models, backtest trading strategies, and analyze market data.
plugins/quantitative-trading/agents/risk-manager.md | agent | Monitor portfolio risk, R-multiples, and position limits.
plugins/quantitative-trading/skills/backtesting-frameworks/SKILL.md | skill | Build robust backtesting systems for trading strategies with proper handling of look-ahead bias, survivorship bias, and transaction costs.
plugins/quantitative-trading/skills/risk-metrics-calculation/SKILL.md | skill | Calculate portfolio risk metrics including VaR, CVaR, Sharpe, Sortino, and drawdown analysis.
plugins/reverse-engineering/.claude-plugin/plugin.json | config | Binary reverse engineering, malware analysis, firmware security, and software protection research for authorized security research, CTF competitions, and defensive security.
plugins/reverse-engineering/agents/firmware-analyst.md | agent | Expert firmware analyst specializing in embedded systems, IoT security, and hardware reverse engineering.
plugins/reverse-engineering/agents/malware-analyst.md | agent | Expert malware analyst specializing in defensive malware research, threat intelligence, and incident response.
plugins/reverse-engineering/agents/reverse-engineer.md | agent | Expert reverse engineer specializing in binary analysis, disassembly, decompilation, and software analysis.
plugins/reverse-engineering/skills/anti-reversing-techniques/SKILL.md | skill | Understand anti-reversing, obfuscation, and protection techniques encountered during software analysis.
plugins/reverse-engineering/skills/binary-analysis-patterns/SKILL.md | skill | Master binary analysis patterns including disassembly, decompilation, control flow analysis, and code pattern recognition.
plugins/reverse-engineering/skills/memory-forensics/SKILL.md | skill | Master memory forensics techniques including memory acquisition, process analysis, and artifact extraction using Volatility and related tools.
plugins/reverse-engineering/skills/protocol-reverse-engineering/SKILL.md | skill | Master network protocol reverse engineering including packet analysis, protocol dissection, and custom protocol documentation.
plugins/security-compliance/.claude-plugin/plugin.json | config | SOC2, HIPAA, and GDPR compliance validation, secrets scanning, compliance checklists, and regulatory documentation.
plugins/security-compliance/agents/security-auditor.md | agent | Expert security auditor specializing in DevSecOps, comprehensive cybersecurity, and compliance frameworks.
plugins/security-compliance/commands/compliance-check.md | prompt | Regulatory Compliance Check.
plugins/security-scanning/.claude-plugin/plugin.json | config | SAST analysis, dependency vulnerability scanning, OWASP Top 10 compliance, container security scanning, and automated security hardening.
plugins/security-scanning/agents/security-auditor.md | agent | Expert security auditor specializing in DevSecOps, comprehensive cybersecurity, and compliance frameworks.
plugins/security-scanning/agents/threat-modeling-expert.md | agent | Threat Modeling Expert.
plugins/security-scanning/commands/security-dependencies.md | prompt | Dependency Vulnerability Scanning.
plugins/security-scanning/commands/security-hardening.md | prompt | Orchestrate comprehensive security hardening with defense-in-depth strategy across all application layers.
plugins/security-scanning/commands/security-sast.md | prompt | Static Application Security Testing (SAST) for code vulnerability analysis across multiple languages and frameworks.
plugins/security-scanning/skills/attack-tree-construction/SKILL.md | skill | Build comprehensive attack trees to visualize threat paths.
plugins/security-scanning/skills/sast-configuration/SKILL.md | skill | Configure Static Application Security Testing (SAST) tools for automated vulnerability detection in application code.
plugins/security-scanning/skills/security-requirement-extraction/SKILL.md | skill | Derive security requirements from threat models and business context.
plugins/security-scanning/skills/stride-analysis-patterns/SKILL.md | skill | Apply STRIDE methodology to systematically identify threats.
plugins/security-scanning/skills/threat-mitigation-mapping/SKILL.md | skill | Map identified threats to appropriate security controls and mitigations.
plugins/seo-analysis-monitoring/.claude-plugin/plugin.json | config | Content freshness analysis, cannibalization detection, and authority building for SEO.
plugins/seo-analysis-monitoring/agents/seo-authority-builder.md | agent | Analyzes content for E-E-A-T signals and suggests improvements to build authority and trust.
plugins/seo-analysis-monitoring/agents/seo-cannibalization-detector.md | agent | Analyzes multiple provided pages to identify keyword overlap and potential cannibalization issues.
plugins/seo-analysis-monitoring/agents/seo-content-refresher.md | agent | Identifies outdated elements in provided content and suggests updates to maintain freshness.
plugins/seo-content-creation/.claude-plugin/plugin.json | config | SEO content writing, planning, and quality auditing with E-E-A-T optimization.
plugins/seo-content-creation/agents/seo-content-auditor.md | agent | Analyzes provided content for quality, E-E-A-T signals, and SEO best practices.
plugins/seo-content-creation/agents/seo-content-planner.md | agent | Creates comprehensive content outlines and topic clusters for SEO.
plugins/seo-content-creation/agents/seo-content-writer.md | agent | Writes SEO-optimized content based on provided keywords and topic briefs.
plugins/seo-technical-optimization/.claude-plugin/plugin.json | config | Technical SEO optimization including meta tags, keywords, structure, and featured snippets.
plugins/seo-technical-optimization/agents/seo-keyword-strategist.md | agent | Analyzes keyword usage in provided content, calculates density, suggests semantic variations and LSI keywords based on the topic.
plugins/seo-technical-optimization/agents/seo-meta-optimizer.md | agent | Creates optimized meta titles, descriptions, and URL suggestions based on character limits and best practices.
plugins/seo-technical-optimization/agents/seo-snippet-hunter.md | agent | Formats content to be eligible for featured snippets and SERP features.
plugins/seo-technical-optimization/agents/seo-structure-architect.md | agent | Analyzes and optimizes content structure including header hierarchy, suggests schema markup, and internal linking opportunities.
plugins/shell-scripting/.claude-plugin/plugin.json | config | Production-grade Bash scripting with defensive programming, POSIX compliance, and comprehensive testing.
plugins/shell-scripting/agents/bash-pro.md | agent | Master of defensive Bash scripting for production automation, CI/CD pipelines, and system utilities.
plugins/shell-scripting/agents/posix-shell-pro.md | agent | Expert in strict POSIX sh scripting for maximum portability across Unix-like systems.
plugins/shell-scripting/skills/bash-defensive-patterns/SKILL.md | skill | Master defensive Bash programming techniques for production-grade scripts.
plugins/shell-scripting/skills/bats-testing-patterns/SKILL.md | skill | Master Bash Automated Testing System (Bats) for comprehensive shell script testing.
plugins/shell-scripting/skills/shellcheck-configuration/SKILL.md | skill | Master ShellCheck static analysis configuration and usage for shell script quality.
plugins/startup-business-analyst/.claude-plugin/plugin.json | config | Comprehensive startup business analysis with market sizing (TAM/SAM/SOM), financial modeling, team planning, and strategic research.
plugins/startup-business-analyst/agents/startup-analyst.md | agent | Expert startup business analyst specializing in market sizing, financial modeling, competitive analysis, and strategic planning for early-stage companies.
plugins/startup-business-analyst/commands/business-case.md | prompt | Generate comprehensive investor-ready business case document with market, solution, financials, and strategy.
plugins/startup-business-analyst/commands/financial-projections.md | prompt | Create detailed 3-5 year financial model with revenue, costs, cash flow, and scenarios.
plugins/startup-business-analyst/commands/market-opportunity.md | prompt | Generate comprehensive market opportunity analysis with TAM/SAM/SOM calculations.
plugins/startup-business-analyst/skills/competitive-landscape/SKILL.md | skill | Analyze competition, identify differentiation opportunities, and develop winning market positioning strategies using Porter's Five Forces, Blue Ocean Strategy, and positioning maps.
plugins/startup-business-analyst/skills/market-sizing-analysis/SKILL.md | skill | Calculate TAM/SAM/SOM for market opportunities using top-down, bottom-up, and value theory methodologies.
plugins/startup-business-analyst/skills/startup-financial-modeling/SKILL.md | skill | Build comprehensive 3-5 year financial models with revenue projections, cost structures, cash flow analysis, and scenario planning for early-stage startups.
plugins/startup-business-analyst/skills/startup-metrics-framework/SKILL.md | skill | Track, calculate, and optimize key performance metrics for SaaS, marketplace, consumer, and B2B startups from seed through Series A, including unit economics, growth efficiency, and cash management.
plugins/startup-business-analyst/skills/team-composition-analysis/SKILL.md | skill | Design optimal team structures, hiring plans, compensation strategies, and equity allocation for early-stage startups from pre-seed through Series A.
plugins/systems-programming/.claude-plugin/plugin.json | config | Systems programming with Rust, Go, C, and C++ for performance-critical and low-level development.
plugins/systems-programming/agents/c-pro.md | agent | Write efficient C code with proper memory management, pointer arithmetic, and system calls.
plugins/systems-programming/agents/cpp-pro.md | agent | Write idiomatic C++ code with modern features, RAII, smart pointers, and STL algorithms.
plugins/systems-programming/agents/golang-pro.md | agent | Master Go 1.21+ with modern patterns, advanced concurrency, performance optimization, and production-ready microservices.
plugins/systems-programming/agents/rust-pro.md | agent | Master Rust 1.75+ with modern async patterns, advanced type system features, and production-ready systems programming.
plugins/systems-programming/commands/rust-project.md | prompt | Rust Project Scaffolding.
plugins/systems-programming/skills/go-concurrency-patterns/SKILL.md | skill | Master Go concurrency with goroutines, channels, sync primitives, and context.
plugins/systems-programming/skills/memory-safety-patterns/SKILL.md | skill | Implement memory-safe programming with RAII, ownership, smart pointers, and resource management across Rust, C++, and C.
plugins/systems-programming/skills/rust-async-patterns/SKILL.md | skill | Master Rust async programming with Tokio, async traits, error handling, and concurrent patterns.
plugins/tdd-workflows/.claude-plugin/plugin.json | config | Test-driven development methodology with red-green-refactor cycles and code review.
plugins/tdd-workflows/agents/code-reviewer.md | agent | Elite code review expert specializing in modern AI-powered code analysis, security vulnerabilities, performance optimization, and production reliability.
plugins/tdd-workflows/agents/tdd-orchestrator.md | agent | Master TDD orchestrator specializing in red-green-refactor discipline, multi-agent workflow coordination, and comprehensive test-driven development practices.
plugins/tdd-workflows/commands/tdd-cycle.md | prompt | Execute a comprehensive TDD workflow with strict red-green-refactor discipline.
plugins/tdd-workflows/commands/tdd-green.md | prompt | Implement minimal code to make failing tests pass in TDD green phase.
plugins/tdd-workflows/commands/tdd-red.md | prompt | Write comprehensive failing tests following TDD red phase principles.
plugins/tdd-workflows/commands/tdd-refactor.md | prompt | Refactor code with confidence using comprehensive test safety net:.
plugins/team-collaboration/.claude-plugin/plugin.json | config | Team workflows, issue management, standup automation, and developer experience optimization.
plugins/team-collaboration/agents/dx-optimizer.md | agent | Developer Experience specialist.
plugins/team-collaboration/commands/issue.md | prompt | GitHub Issue Resolution Expert.
plugins/team-collaboration/commands/standup-notes.md | prompt | Standup Notes Generator.
plugins/ui-design/.claude-plugin/plugin.json | config | Comprehensive UI/UX design plugin for mobile (iOS, Android, React Native) and web applications with design systems, accessibility, and modern patterns.
plugins/ui-design/agents/accessibility-expert.md | agent | Expert accessibility specialist ensuring WCAG compliance, inclusive design, and assistive technology compatibility.
plugins/ui-design/agents/design-system-architect.md | agent | Expert design system architect specializing in design tokens, component libraries, theming infrastructure, and scalable design operations.
plugins/ui-design/agents/ui-designer.md | agent | Expert UI designer specializing in component creation, layout systems, and visual design implementation.
plugins/ui-design/commands/accessibility-audit.md | prompt | Audit UI code for WCAG compliance.
plugins/ui-design/commands/create-component.md | prompt | Guided component creation with proper patterns.
plugins/ui-design/commands/design-review.md | prompt | Review existing UI for issues and improvements.
plugins/ui-design/commands/design-system-setup.md | prompt | Initialize a design system with tokens.
plugins/ui-design/skills/accessibility-compliance/SKILL.md | skill | Implement WCAG 2.2 compliant interfaces with mobile accessibility, inclusive design patterns, and assistive technology support.
plugins/ui-design/skills/design-system-patterns/SKILL.md | skill | Build scalable design systems with design tokens, theming infrastructure, and component architecture patterns.
plugins/ui-design/skills/interaction-design/SKILL.md | skill | Design and implement microinteractions, motion design, transitions, and user feedback patterns.
plugins/ui-design/skills/mobile-android-design/SKILL.md | skill | Master Material Design 3 and Jetpack Compose patterns for building native Android apps.
plugins/ui-design/skills/mobile-ios-design/SKILL.md | skill | Master iOS Human Interface Guidelines and SwiftUI patterns for building native iOS apps.
plugins/ui-design/skills/react-native-design/SKILL.md | skill | Master React Native styling, navigation, and Reanimated animations for cross-platform mobile development.
plugins/ui-design/skills/responsive-design/SKILL.md | skill | Implement modern responsive layouts using container queries, fluid typography, CSS Grid, and mobile-first breakpoint strategies.
plugins/ui-design/skills/visual-design-foundations/SKILL.md | skill | Apply typography, color theory, spacing systems, and iconography principles to create cohesive visual designs.
plugins/ui-design/skills/web-component-design/SKILL.md | skill | Master React, Vue, and Svelte component patterns including CSS-in-JS, composition strategies, and reusable component architecture.
plugins/unit-testing/.claude-plugin/plugin.json | config | Unit and integration test automation for Python and JavaScript with debugging support.
plugins/unit-testing/agents/debugger.md | agent | Debugging specialist for errors, test failures, and unexpected behavior.
plugins/unit-testing/agents/test-automator.md | agent | Master AI-powered test automation with modern frameworks, self-healing tests, and comprehensive quality engineering.
plugins/unit-testing/commands/test-generate.md | prompt | Automated Unit Test Generation.
plugins/web-scripting/.claude-plugin/plugin.json | config | Web scripting with PHP and Ruby for web applications, CMS development, and backend services.
plugins/web-scripting/agents/php-pro.md | agent | Write idiomatic PHP code with generators, iterators, SPL data structures, and modern OOP features.
plugins/web-scripting/agents/ruby-pro.md | agent | Write idiomatic Ruby code with metaprogramming, Rails patterns, and performance optimization.
