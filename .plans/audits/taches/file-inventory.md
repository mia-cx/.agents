# File Inventory

.claude-plugin/marketplace.json | config | Configuration file that shapes Claude Code plugin behavior and registration.
.claude-plugin/plugin.json | config | Configuration file that shapes Claude Code plugin behavior and registration.
agents/skill-auditor.md | agent | Defines a subagent role for skill auditing agent.
agents/slash-command-auditor.md | agent | Defines a subagent role for slash command auditing agent.
agents/subagent-auditor.md | agent | Defines a subagent role for subagent auditing agent.
commands/add-to-todos.md | prompt | Slash-command prompt that tells Claude how to add to todos.
commands/ask-me-questions.md | prompt | Slash-command prompt that tells Claude how to ask me questions.
commands/audit-skill.md | prompt | Slash-command prompt that tells Claude how to audit skill.
commands/audit-slash-command.md | prompt | Slash-command prompt that tells Claude how to audit slash command.
commands/audit-subagent.md | prompt | Slash-command prompt that tells Claude how to audit subagent.
commands/check-todos.md | prompt | Slash-command prompt that tells Claude how to check todos.
commands/consider/10-10-10.md | prompt | Decision-support prompt that applies the 10 10 10 framework to evaluate tradeoffs.
commands/consider/5-whys.md | prompt | Decision-support prompt that applies the 5 whys framework to evaluate tradeoffs.
commands/consider/eisenhower-matrix.md | prompt | Decision-support prompt that applies the eisenhower matrix framework to evaluate tradeoffs.
commands/consider/first-principles.md | prompt | Decision-support prompt that applies the first principles framework to evaluate tradeoffs.
commands/consider/inversion.md | prompt | Decision-support prompt that applies the inversion framework to evaluate tradeoffs.
commands/consider/occams-razor.md | prompt | Decision-support prompt that applies the occams razor framework to evaluate tradeoffs.
commands/consider/one-thing.md | prompt | Decision-support prompt that applies the one thing framework to evaluate tradeoffs.
commands/consider/opportunity-cost.md | prompt | Decision-support prompt that applies the opportunity cost framework to evaluate tradeoffs.
commands/consider/pareto.md | prompt | Decision-support prompt that applies the pareto framework to evaluate tradeoffs.
commands/consider/second-order.md | prompt | Decision-support prompt that applies the second order framework to evaluate tradeoffs.
commands/consider/swot.md | prompt | Decision-support prompt that applies the swot framework to evaluate tradeoffs.
commands/consider/via-negativa.md | prompt | Decision-support prompt that applies the via negativa framework to evaluate tradeoffs.
commands/create-agent-skill.md | prompt | Slash-command prompt that tells Claude how to create agent skill.
commands/create-hook.md | prompt | Slash-command prompt that tells Claude how to create hook.
commands/create-meta-prompt.md | prompt | Slash-command prompt that tells Claude how to create meta prompt.
commands/create-plan.md | prompt | Slash-command prompt that tells Claude how to create plan.
commands/create-prompt.md | prompt | Slash-command prompt that tells Claude how to create prompt.
commands/create-slash-command.md | prompt | Slash-command prompt that tells Claude how to create slash command.
commands/create-subagent.md | prompt | Slash-command prompt that tells Claude how to create subagent.
commands/debug.md | prompt | Slash-command prompt that tells Claude how to debug.
commands/heal-skill.md | prompt | Slash-command prompt that tells Claude how to heal skill.
commands/research/competitive.md | prompt | Research prompt that guides Claude to investigate competitive and summarize findings.
commands/research/deep-dive.md | prompt | Research prompt that guides Claude to investigate deep dive and summarize findings.
commands/research/feasibility.md | prompt | Research prompt that guides Claude to investigate feasibility and summarize findings.
commands/research/history.md | prompt | Research prompt that guides Claude to investigate history and summarize findings.
commands/research/landscape.md | prompt | Research prompt that guides Claude to investigate landscape and summarize findings.
commands/research/open-source.md | prompt | Research prompt that guides Claude to investigate open source and summarize findings.
commands/research/options.md | prompt | Research prompt that guides Claude to investigate options and summarize findings.
commands/research/technical.md | prompt | Research prompt that guides Claude to investigate technical and summarize findings.
commands/run-plan.md | prompt | Slash-command prompt that tells Claude how to run plan.
commands/run-prompt.md | prompt | Slash-command prompt that tells Claude how to run prompt.
commands/setup-ralph.md | prompt | Slash-command prompt that tells Claude how to setup ralph.
commands/whats-next.md | prompt | Slash-command prompt that tells Claude how to whats next.
docs/context-handoff.md | sop | Procedure for writing and using handoff documents so Claude can resume work in a fresh context.
docs/meta-prompting.md | sop | Overview of the two-phase meta-prompting workflow that turns analysis into executable prompts.
docs/todo-management.md | sop | Procedure for capturing deferred work in TO-DOS.md and resurfacing it later with context intact.
skills/create-agent-skills/SKILL.md | skill | Router skill that teaches Claude how to create and refine Claude Code skills.
skills/create-agent-skills/references/api-security.md | rule | Security guidance for API-calling skills, including secret handling and safe tool use.
skills/create-agent-skills/references/be-clear-and-direct.md | rule | Writing rule that keeps skill instructions concise, direct, and specific.
skills/create-agent-skills/references/common-patterns.md | rule | Anti-pattern reference for skill structure, including hybrid XML/markdown and unclosed tags.
skills/create-agent-skills/references/core-principles.md | rule | Core principles for pure XML skill structure, concision, and context-window discipline.
skills/create-agent-skills/references/executable-code.md | rule | Guidance on when to place executable logic in code versus workflows or references.
skills/create-agent-skills/references/iteration-and-testing.md | rule | Validation guidance for iterating on skills and checking them against real usage.
skills/create-agent-skills/references/recommended-structure.md | rule | Structural guide for organizing SKILL.md, references, templates, workflows, and scripts.
skills/create-agent-skills/references/skill-structure.md | rule | Naming, frontmatter, and progressive-disclosure rules for SKILL.md files.
skills/create-agent-skills/references/use-xml-tags.md | rule | Rules for required and conditional XML tags and how to structure skills in pure XML.
skills/create-agent-skills/references/using-scripts.md | rule | Guidance on when to use scripts in a skill and how to invoke them safely.
skills/create-agent-skills/references/using-templates.md | rule | Guidance on using templates for reusable output structures in skills.
skills/create-agent-skills/references/workflows-and-validation.md | rule | Rules for workflow-driven skills and their validation checkpoints.
skills/create-agent-skills/templates/router-skill.md | prompt | Template prompt structure for router skill skill output.
skills/create-agent-skills/templates/simple-skill.md | prompt | Template prompt structure for simple skill skill output.
skills/create-agent-skills/workflows/add-reference.md | sop | Executable workflow for add reference in skill creation.
skills/create-agent-skills/workflows/add-script.md | sop | Executable workflow for add script in skill creation.
skills/create-agent-skills/workflows/add-template.md | sop | Executable workflow for add template in skill creation.
skills/create-agent-skills/workflows/add-workflow.md | sop | Executable workflow for add workflow in skill creation.
skills/create-agent-skills/workflows/audit-skill.md | sop | Executable workflow for audit skill in skill creation.
skills/create-agent-skills/workflows/create-domain-expertise-skill.md | sop | Executable workflow for create domain expertise skill in skill creation.
skills/create-agent-skills/workflows/create-new-skill.md | sop | Executable workflow for create new skill in skill creation.
skills/create-agent-skills/workflows/get-guidance.md | sop | Executable workflow for get guidance in skill creation.
skills/create-agent-skills/workflows/upgrade-to-router.md | sop | Executable workflow for upgrade to router in skill creation.
skills/create-agent-skills/workflows/verify-skill.md | sop | Executable workflow for verify skill in skill creation.
skills/create-hooks/SKILL.md | skill | Skill that teaches Claude how to create, configure, and debug Claude Code hooks.
skills/create-hooks/references/command-vs-prompt.md | rule | Decision guide for choosing command hooks versus prompt hooks.
skills/create-hooks/references/examples.md | rule | Example patterns for hook configuration, blocking, logging, and notifications.
skills/create-hooks/references/hook-types.md | rule | Catalog of hook events, blocking behavior, and use cases.
skills/create-hooks/references/input-output-schemas.md | rule | Schema reference for hook input and output payloads.
skills/create-hooks/references/matchers.md | rule | Matcher rules for targeting the right Claude Code tools.
skills/create-hooks/references/troubleshooting.md | rule | Troubleshooting checklist for hook failures, permissions, and timeouts.
skills/create-mcp-servers/SKILL.md | skill | Skill that guides Claude through building production-ready MCP servers.
skills/create-mcp-servers/references/adaptive-questioning-guide.md | rule | Intake-question patterns for selecting the right MCP server approach.
skills/create-mcp-servers/references/api-research-template.md | rule | Research template for analyzing an external API before building an MCP server.
skills/create-mcp-servers/references/auto-installation.md | rule | Installation guidance for automatically registering MCP servers.
skills/create-mcp-servers/references/best-practices.md | rule | Best-practice rules for building production-ready MCP servers.
skills/create-mcp-servers/references/creation-workflow.md | rule | Step-by-step workflow for creating an MCP server from scratch.
skills/create-mcp-servers/references/large-api-pattern.md | rule | Architecture guidance for on-demand discovery when an API has many operations.
skills/create-mcp-servers/references/oauth-implementation.md | rule | OAuth implementation rules for secure stdio-based MCP servers.
skills/create-mcp-servers/references/python-implementation.md | rule | Python-specific implementation guidance for MCP servers.
skills/create-mcp-servers/references/response-optimization.md | rule | Rules for paginating and truncating MCP responses to keep outputs useful.
skills/create-mcp-servers/references/testing-and-deployment.md | rule | Validation and deployment guidance for MCP servers.
skills/create-mcp-servers/references/tools-and-resources.md | rule | Guidance on exposing tools, resources, and prompts through MCP.
skills/create-mcp-servers/references/traditional-pattern.md | rule | Architecture guidance for small MCP servers with flat tools.
skills/create-mcp-servers/references/typescript-implementation.md | rule | TypeScript-specific implementation guidance for MCP servers.
skills/create-mcp-servers/references/validation-checkpoints.md | rule | Checkpoint list for verifying MCP server correctness.
skills/create-mcp-servers/templates/operations.json | prompt | Template artifact for operations MCP server scaffolding.
skills/create-mcp-servers/workflows/create-new-server.md | sop | Executable workflow for create new server MCP server development.
skills/create-mcp-servers/workflows/troubleshoot-server.md | sop | Executable workflow for troubleshoot server MCP server development.
skills/create-mcp-servers/workflows/update-existing-server.md | sop | Executable workflow for update existing server MCP server development.
skills/create-meta-prompts/SKILL.md | skill | Skill that teaches Claude how to create meta-prompts for other Claude instances.
skills/create-meta-prompts/references/do-patterns.md | rule | Pattern guide for framing prompts around desired actions and outcomes.
skills/create-meta-prompts/references/intelligence-rules.md | rule | Rules for adding clarity, context, and decision support to meta-prompts.
skills/create-meta-prompts/references/metadata-guidelines.md | rule | Guidance for prompt metadata and structure.
skills/create-meta-prompts/references/plan-patterns.md | rule | Patterns for turning plans into prompt-ready structures.
skills/create-meta-prompts/references/question-bank.md | rule | Reusable question bank for prompt intake and clarification.
skills/create-meta-prompts/references/refine-patterns.md | rule | Patterns for iteratively refining prompts.
skills/create-meta-prompts/references/research-patterns.md | rule | Patterns for prompt-led research workflows.
skills/create-meta-prompts/references/research-pitfalls.md | rule | Anti-patterns to avoid during prompt-driven research.
skills/create-meta-prompts/references/summary-template.md | rule | Template for summarizing prompt research and refinement results.
skills/create-plans/SKILL.md | skill | Skill that teaches Claude how to create executable project plans and phase prompts.
skills/create-plans/references/checkpoints.md | rule | Rules for human and automated checkpoints in execution plans.
skills/create-plans/references/cli-automation.md | rule | Guidance for automating CLI-capable work instead of asking humans.
skills/create-plans/references/context-management.md | rule | Rules for keeping plan execution within safe context limits.
skills/create-plans/references/domain-expertise.md | rule | Guide for loading domain expertise selectively during planning.
skills/create-plans/references/git-integration.md | rule | Rules for versioning planning artifacts and commit boundaries.
skills/create-plans/references/hierarchy-rules.md | rule | Hierarchy rules for BRIEF, ROADMAP, RESEARCH, PLAN, and SUMMARY artifacts.
skills/create-plans/references/milestone-management.md | rule | Rules for grouping phases into milestones and shipping versions.
skills/create-plans/references/plan-format.md | rule | Required structure for executable plan prompts.
skills/create-plans/references/research-pitfalls.md | rule | Common research mistakes to avoid when planning phases.
skills/create-plans/references/scope-estimation.md | rule | Scope-sizing guidance for splitting work into small executable plans.
skills/create-plans/references/user-gates.md | rule | Rules for when to ask the user versus proceeding autonomously.
skills/create-plans/templates/brief.md | prompt | Template prompt or artifact for brief planning output.
skills/create-plans/templates/continue-here.md | prompt | Template prompt or artifact for continue here planning output.
skills/create-plans/templates/issues.md | prompt | Template prompt or artifact for issues planning output.
skills/create-plans/templates/milestone.md | prompt | Template prompt or artifact for milestone planning output.
skills/create-plans/templates/phase-prompt.md | prompt | Template prompt or artifact for phase prompt planning output.
skills/create-plans/templates/research-prompt.md | prompt | Template prompt or artifact for research prompt planning output.
skills/create-plans/templates/roadmap.md | prompt | Template prompt or artifact for roadmap planning output.
skills/create-plans/templates/summary.md | prompt | Template prompt or artifact for summary planning output.
skills/create-plans/workflows/complete-milestone.md | sop | Executable workflow for complete milestone planning step.
skills/create-plans/workflows/create-brief.md | sop | Executable workflow for create brief planning step.
skills/create-plans/workflows/create-roadmap.md | sop | Executable workflow for create roadmap planning step.
skills/create-plans/workflows/execute-phase.md | sop | Executable workflow for execute phase planning step.
skills/create-plans/workflows/get-guidance.md | sop | Executable workflow for get guidance planning step.
skills/create-plans/workflows/handoff.md | sop | Executable workflow for handoff planning step.
skills/create-plans/workflows/plan-chunk.md | sop | Executable workflow for plan chunk planning step.
skills/create-plans/workflows/plan-phase.md | sop | Executable workflow for plan phase planning step.
skills/create-plans/workflows/research-phase.md | sop | Executable workflow for research phase planning step.
skills/create-plans/workflows/resume.md | sop | Executable workflow for resume planning step.
skills/create-plans/workflows/transition.md | sop | Executable workflow for transition planning step.
skills/create-slash-commands/SKILL.md | skill | Skill that teaches Claude how to design and author slash commands.
skills/create-slash-commands/references/arguments.md | rule | Rules for handling slash-command arguments and input validation.
skills/create-slash-commands/references/patterns.md | rule | Command design patterns for slash-command prompts.
skills/create-slash-commands/references/tool-restrictions.md | rule | Rules for respecting Claude Code tool restrictions inside slash commands.
skills/create-subagents/SKILL.md | skill | Skill that teaches Claude how to create and orchestrate subagents.
skills/create-subagents/references/context-management.md | rule | Rules for giving subagents just enough context to stay effective.
skills/create-subagents/references/debugging-agents.md | rule | Guidance for diagnosing and fixing subagent failures.
skills/create-subagents/references/error-handling-and-recovery.md | rule | Recovery patterns for subagent errors and partial failures.
skills/create-subagents/references/evaluation-and-testing.md | rule | Validation rules for checking subagent output quality.
skills/create-subagents/references/orchestration-patterns.md | rule | Coordination patterns for spawning and sequencing subagents.
skills/create-subagents/references/subagents.md | rule | Reference for defining subagent roles, responsibilities, and routing.
skills/create-subagents/references/writing-subagent-prompts.md | rule | Prompt-writing guidance for subagents.
skills/debug-like-expert/SKILL.md | skill | Skill that teaches Claude how to debug like an expert with disciplined investigation.
skills/debug-like-expert/references/debugging-mindset.md | rule | Debugging mindset rules for systematic investigation.
skills/debug-like-expert/references/hypothesis-testing.md | rule | Rules for forming and testing debugging hypotheses.
skills/debug-like-expert/references/investigation-techniques.md | rule | Techniques for narrowing down root causes.
skills/debug-like-expert/references/verification-patterns.md | rule | Verification patterns for confirming a fix actually worked.
skills/debug-like-expert/references/when-to-research.md | rule | Guidance on when debugging should shift into research mode.
skills/expertise/iphone-apps/SKILL.md | skill | Domain-expertise skill for iphone apps.
skills/expertise/iphone-apps/references/accessibility.md | rule | Domain-specific reference guide for accessibility.
skills/expertise/iphone-apps/references/app-architecture.md | rule | Domain-specific reference guide for app architecture.
skills/expertise/iphone-apps/references/app-icons.md | rule | Domain-specific reference guide for app icons.
skills/expertise/iphone-apps/references/app-store.md | rule | Domain-specific reference guide for app store.
skills/expertise/iphone-apps/references/background-tasks.md | rule | Domain-specific reference guide for background tasks.
skills/expertise/iphone-apps/references/ci-cd.md | rule | Domain-specific reference guide for ci cd.
skills/expertise/iphone-apps/references/cli-observability.md | rule | Domain-specific reference guide for cli observability.
skills/expertise/iphone-apps/references/cli-workflow.md | rule | Domain-specific reference guide for cli workflow.
skills/expertise/iphone-apps/references/data-persistence.md | rule | Domain-specific reference guide for data persistence.
skills/expertise/iphone-apps/references/navigation-patterns.md | rule | Domain-specific reference guide for navigation patterns.
skills/expertise/iphone-apps/references/networking.md | rule | Domain-specific reference guide for networking.
skills/expertise/iphone-apps/references/performance.md | rule | Domain-specific reference guide for performance.
skills/expertise/iphone-apps/references/polish-and-ux.md | rule | Domain-specific reference guide for polish and ux.
skills/expertise/iphone-apps/references/project-scaffolding.md | rule | Domain-specific reference guide for project scaffolding.
skills/expertise/iphone-apps/references/push-notifications.md | rule | Domain-specific reference guide for push notifications.
skills/expertise/iphone-apps/references/security.md | rule | Domain-specific reference guide for security.
skills/expertise/iphone-apps/references/storekit.md | rule | Domain-specific reference guide for storekit.
skills/expertise/iphone-apps/references/swiftui-patterns.md | rule | Domain-specific reference guide for swiftui patterns.
skills/expertise/iphone-apps/references/testing.md | rule | Domain-specific reference guide for testing.
skills/expertise/iphone-apps/workflows/add-feature.md | sop | Domain-specific workflow for add feature.
skills/expertise/iphone-apps/workflows/build-new-app.md | sop | Domain-specific workflow for build new app.
skills/expertise/iphone-apps/workflows/debug-app.md | sop | Domain-specific workflow for debug app.
skills/expertise/iphone-apps/workflows/optimize-performance.md | sop | Domain-specific workflow for optimize performance.
skills/expertise/iphone-apps/workflows/ship-app.md | sop | Domain-specific workflow for ship app.
skills/expertise/iphone-apps/workflows/write-tests.md | sop | Domain-specific workflow for write tests.
skills/expertise/macos-apps/SKILL.md | skill | Domain-expertise skill for macos apps.
skills/expertise/macos-apps/references/app-architecture.md | rule | Domain-specific reference guide for app architecture.
skills/expertise/macos-apps/references/app-extensions.md | rule | Domain-specific reference guide for app extensions.
skills/expertise/macos-apps/references/appkit-integration.md | rule | Domain-specific reference guide for appkit integration.
skills/expertise/macos-apps/references/cli-observability.md | rule | Domain-specific reference guide for cli observability.
skills/expertise/macos-apps/references/cli-workflow.md | rule | Domain-specific reference guide for cli workflow.
skills/expertise/macos-apps/references/concurrency-patterns.md | rule | Domain-specific reference guide for concurrency patterns.
skills/expertise/macos-apps/references/data-persistence.md | rule | Domain-specific reference guide for data persistence.
skills/expertise/macos-apps/references/design-system.md | rule | Domain-specific reference guide for design system.
skills/expertise/macos-apps/references/document-apps.md | rule | Domain-specific reference guide for document apps.
skills/expertise/macos-apps/references/macos-polish.md | rule | Domain-specific reference guide for macos polish.
skills/expertise/macos-apps/references/menu-bar-apps.md | rule | Domain-specific reference guide for menu bar apps.
skills/expertise/macos-apps/references/networking.md | rule | Domain-specific reference guide for networking.
skills/expertise/macos-apps/references/project-scaffolding.md | rule | Domain-specific reference guide for project scaffolding.
skills/expertise/macos-apps/references/security-code-signing.md | rule | Domain-specific reference guide for security code signing.
skills/expertise/macos-apps/references/shoebox-apps.md | rule | Domain-specific reference guide for shoebox apps.
skills/expertise/macos-apps/references/swiftui-patterns.md | rule | Domain-specific reference guide for swiftui patterns.
skills/expertise/macos-apps/references/system-apis.md | rule | Domain-specific reference guide for system apis.
skills/expertise/macos-apps/references/testing-debugging.md | rule | Domain-specific reference guide for testing debugging.
skills/expertise/macos-apps/references/testing-tdd.md | rule | Domain-specific reference guide for testing tdd.
skills/expertise/macos-apps/workflows/add-feature.md | sop | Domain-specific workflow for add feature.
skills/expertise/macos-apps/workflows/build-new-app.md | sop | Domain-specific workflow for build new app.
skills/expertise/macos-apps/workflows/debug-app.md | sop | Domain-specific workflow for debug app.
skills/expertise/macos-apps/workflows/optimize-performance.md | sop | Domain-specific workflow for optimize performance.
skills/expertise/macos-apps/workflows/ship-app.md | sop | Domain-specific workflow for ship app.
skills/expertise/macos-apps/workflows/write-tests.md | sop | Domain-specific workflow for write tests.
skills/expertise/n8n-automations/SKILL-SPEC.yaml | config | Configuration that defines a skill specification and its behavior.
skills/setup-ralph/SKILL.md | skill | Skill that guides Claude through setting up and maintaining the Ralph loop.
skills/setup-ralph/references/operational-learnings.md | rule | Operational lessons that inform Ralph loop setup.
skills/setup-ralph/references/project-structure.md | rule | Project structure guidance for the Ralph loop.
skills/setup-ralph/references/prompt-design.md | rule | Prompt design guidance for Ralph loop prompts.
skills/setup-ralph/references/ralph-fundamentals.md | rule | Core principles for the Ralph workflow.
skills/setup-ralph/references/validation-strategy.md | rule | Validation strategy for checking Ralph loop outputs.
skills/setup-ralph/templates/PROMPT_build.md | prompt | Prompt template for PROMPT build in the Ralph setup workflow.
skills/setup-ralph/templates/PROMPT_plan.md | prompt | Prompt template for PROMPT plan in the Ralph setup workflow.
skills/setup-ralph/workflows/customize-loop.md | sop | Workflow for customize loop in the Ralph setup process.
skills/setup-ralph/workflows/setup-new-loop.md | sop | Workflow for setup new loop in the Ralph setup process.
skills/setup-ralph/workflows/troubleshoot-loop.md | sop | Workflow for troubleshoot loop in the Ralph setup process.
skills/setup-ralph/workflows/understand-ralph.md | sop | Workflow for understand ralph in the Ralph setup process.
