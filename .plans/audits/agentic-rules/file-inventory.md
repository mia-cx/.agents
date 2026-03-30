# File Inventory — agentic-rules

Source: `.references/agentic-rules`

---

canonical-rules.md | rule | Authoritative merged ruleset (§1–§8) covering backlog management, planning, TDD, security, self-validation, and deployment for an AI coding agent embedded in an agentic IDE.
globalrules.md | rule | Superseded historical source (§1–§7) for canonical-rules.md; covers backlog, planning, coding standards, security, and deployment rules in prose-prompt form.
meta-rules.md | rule | Superseded historical source (§1–§8) for canonical-rules.md; compact operational rules including the unique §8 Self-Validation close-out protocol.
MVP-GlobalRules.md | rule | MVP-mode variant of global rules emphasising rapid prototyping with HyperScaler APIs, minimal code, T-shirt-sized estimates, and BDD/TDD under time pressure.
Agent-Personas.md | agent | Catalog of 22 specialised agent personas (Explore, Plan, Code, Review, etc.) with capabilities, expertise, and invocation criteria for an orchestrator to delegate to.
agent-reasoning-planning-execution.md | rule | Prescriptive rules for agent behaviour at each execution stage: planning, reasoning, coding, monitoring, and escalation.
Agentic-Prompts-Library.md | prompt | Curated prompt library for backlog fetching, issue classification, WIP tracking, TDD test scaffolding, and deployment steps via MCP.
Enhanced-Agentic-Prompts-Library.md | prompt | Extended prompt library adding planning/roadmapping and chain-of-thought reasoning prompts, with a sample agent reasoning narrative.
strict-rules-how-to.md | sop | Procedure for structuring CLAUDE.md to enforce strict rules reliably across sessions (placement at top, duplication, explicit enumeration).
docs/LLM_PROJECT_SETUP_PROMPT.md | prompt | Reusable bootstrap prompt for any local-filesystem LLM to set up a centralised project configuration system with templates, credentials, and automation.
templates/claude-code/CLAUDE.md.template | config | Fillable CLAUDE.md template defining project overview, architecture, development workflow, coding standards, and tool permissions for Claude Code projects.
templates/claude-code/.claude/agents/agent.md.template | agent | Fillable frontmatter template for authoring a specialised sub-agent with name, model, role, capabilities, and instructions fields.
templates/claude-code/.claude/commands/pr.md | sop | Pre-PR checklist (tests, lint, build, push) and PR body template enforcing quality gates before opening a pull request.
templates/claude-code/.claude/commands/review.md | sop | Code review checklist covering functionality, quality, testing, security, and performance criteria.
templates/claude-code/.claude/commands/tdd.md | sop | Red-green-refactor TDD workflow: understand requirement → write failing test → implement → pass → refactor → commit.
templates/claude-code/.claude/commands/command.md.template | prompt | Fillable scaffold for authoring new slash commands with arguments, usage, and implementation sections.
templates/claude-code/settings.json.template | config | Claude Code project settings template enabling extended thinking (`alwaysThinkingEnabled: true`).
templates/claude-code/.claude/settings.local.json.example | config | Example tool-permission allowlist/denylist for Claude Code covering git, npm, MCP tools, and read path restrictions.
templates/claude-code/claude.json.template | config | MCP server wiring template connecting GitHub and ZeroDB MCP servers with auth token placeholders.
templates/claude-code/scripts/merged-permissions.json | config | Consolidated tool-permission allowlist for Claude Code covering git, gh CLI, npm, curl, WebSearch, MCP GitHub, and ZeroDB tool namespaces.
