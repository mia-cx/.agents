## CLAUDE.md
**Type**: config
**Portable**: Partially
**Reason**: It blends reusable Claude Code workflow and artifact-format guidance with paths, slash commands, and test commands that are specific to this plugin repository.
**Strip**: Repository-specific overview, `node tests/...` invocations, slash-command catalog (`/tdd`, `/plan`, etc.), this repo’s directory tree listing, and pointers like `CONTRIBUTING.md` / `docs/SKILL-PLACEMENT-POLICY.md` / `~/.claude/skills/`.
**Notes**: “Claude Code project CLAUDE.md skeleton”; agent/skill/hook markdown-and-frontmatter conventions; package-manager and cross-platform dev notes as optional global snippets.

## the-longform-guide.md
**Type**: sop
**Portable**: Partially
**Reason**: Core workflow guidance transfers, but the doc is tied to Claude Code features, this repo’s examples, and time-sensitive model/vendor specifics.
**Strip**: Markdown images, star-milestone and promotional asides, “FUN STUFF” section, external GitHub/short URLs, model pricing screenshots, and references that duplicate the shorthand guide.
**Notes**: Session handoff via `.claude` session summaries; strategic compacting and `claude --system-prompt` aliases; memory-persistence hooks (PreCompact, Stop, SessionStart); continuous learning → skills via Stop hook; subagent model tiering; mgrep vs grep; pass@k vs pass^k eval framing; fork/worktree parallelization and cascade tabs; two-instance kickoff (scaffold vs research); phased orchestrator with file handoffs and `/clear` between agents; iterative sub-agent retrieval (≤3 cycles).
## the-shortform-guide.md
**Type**: sop
**Portable**: Partially
**Reason**: Workflow concepts (skills, hooks, rules layout, MCP budgeting) generalize, but paths, slash commands, and personal plugin/MCP inventories tie it to Claude Code and one author’s stack.
**Strip**: Bio, images and relative asset links, hackathon/zenith.chat callouts, editor preference sections, example MCP JSON with project refs/secrets, personal plugin lists, tmux/mgrep/Zed-specific tips where not needed
**Notes**: Claude Code rules-folder modularization; hook lifecycle types (PreToolUse, PostToolUse, UserPromptSubmit, Stop, PreCompact, Notification); skills vs `~/.claude/commands`; subagent tool-scoping pattern; MCP enablement vs context-window budget
## AGENTS.md
**Type**: sop
**Portable**: Partially
**Reason**: Universal policies (security, TDD, style, git) reuse cleanly, but the agent roster, orchestration map, and repo layout are bound to the ECC plugin distribution.
**Strip**: ECC title/version/branding; the Available Agents table; Agent Orchestration bullets; Project Structure tree; orchestration lines that name plugin-only agents (chief-of-staff, loop-operator, harness-optimizer); skeleton-project guidance that assumes this agent stack.
**Notes**: SOP/policy patterns: Core Principles; pre-commit Security Guidelines; Coding Style / immutability; Testing Requirements & TDD workflow; Development Workflow (plan → TDD → review → capture → commit); Git/PR conventions; Architecture Patterns (minus ECC-specific evaluation flow); Performance context-window note; Success Metrics.
