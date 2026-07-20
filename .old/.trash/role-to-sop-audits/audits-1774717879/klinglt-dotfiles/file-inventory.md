# File Inventory — klinglt-dotfiles

## Agents

agents/architect.md | agent | Full architecture-review process: current-state analysis → requirements → design proposal → trade-off ADR → system design checklist with anti-pattern red flags.
agents/build-error-resolver.md | agent | Build error resolution SOP: collect all TypeScript/build errors, categorise by type, apply minimal-diff fixes one at a time, verify build green after each fix.
agents/code-reviewer.md | agent | Code review procedure: run git diff, check modified files against a tiered checklist (CRITICAL security → HIGH quality → MEDIUM performance/best-practices), emit prioritised findings with approval/block verdict.
agents/doc-updater.md | agent | Documentation update workflow: scan repo structure, extract exports/routes via AST analysis, generate codemaps under docs/CODEMAPS/, update READMEs from source of truth.
agents/e2e-runner.md | agent | End-to-end test lifecycle: plan user journeys by risk tier, generate Playwright tests with Page Object Model, run multi-browser, quarantine flaky tests, upload artifacts, produce HTML/JUnit reports.
agents/planner.md | agent | Feature planning procedure: restate requirements → architecture review → phased step breakdown with file paths, dependencies, and risk ratings → wait for user confirmation before writing code.
agents/refactor-cleaner.md | agent | Dead-code cleanup SOP: run knip/depcheck/ts-prune, categorise findings by risk (SAFE/CAREFUL/RISKY), remove one batch at a time with test verification, record every deletion in DELETION_LOG.md.
agents/security-reviewer.md | agent | Security review procedure: automated scan → OWASP Top 10 analysis → platform-specific checks (Supabase RLS, blockchain tx, rate limiting) → tiered report with proof-of-concept and remediation code.
agents/tdd-guide.md | agent | TDD enforcement: write failing test (RED) → run to verify failure → implement minimal code (GREEN) → refactor → verify 80 %+ coverage across unit, integration, and E2E test types.

## Commands (slash-command prompt templates)

commands/build-fix.md | prompt | Step-by-step incremental build-error fix loop: run build, group errors by file, show context, propose fix, apply, re-run, stop on regression or 3 failed attempts.
commands/code-review.md | prompt | Commit-scoped code review checklist covering security (CRITICAL), quality (HIGH), and best-practices (MEDIUM/LOW), with block-on-critical rule.
commands/e2e.md | prompt | Invocation wrapper for the e2e-runner agent; documents trigger conditions, artifact handling, flaky-test detection, and CI/CD integration steps.
commands/learn.md | prompt | End-of-session pattern extraction procedure: review session for reusable insights, draft skill file in ~/.claude/skills/learned/, confirm with user before saving.
commands/plan.md | prompt | Invocation wrapper for the planner agent enforcing a hard "wait for user confirmation before touching code" gate.
commands/refactor-clean.md | prompt | Dead-code analysis loop: run knip/depcheck/ts-prune, categorise by severity, run full test suite before and after each deletion, rollback on failure.
commands/tdd.md | prompt | Invocation wrapper for the tdd-guide agent; documents the RED→GREEN→REFACTOR cycle, coverage thresholds, and integration with plan/review commands.
commands/test-coverage.md | prompt | Coverage gap procedure: run tests with coverage, identify files below 80 %, generate missing unit/integration/E2E tests, verify new tests pass.
commands/update-codemaps.md | prompt | Codemap refresh procedure: scan imports/exports, generate architecture/backend/frontend/data maps, diff against previous version, request approval if >30 % changed.
commands/update-docs.md | prompt | Documentation sync procedure: read package.json scripts and .env.example as source of truth, generate CONTRIB.md and RUNBOOK.md, flag docs untouched for 90+ days.

## Rules (always-loaded standing rules)

rules/agents.md | rule | Agent selection and orchestration rules: maps task types to specific agents, mandates parallel task execution for independent operations, describes multi-perspective split-role pattern.
rules/coding-style.md | rule | Coding style standards: immutability over mutation, many-small-files principle (200–800 lines), always handle errors, always validate input with a schema library, pre-commit quality checklist.
rules/git-workflow.md | rule | Git workflow rules: conventional commit format, PR creation procedure (full history diff, comprehensive summary, test plan), and the plan→TDD→review→commit feature flow.
rules/hooks.md | rule | Hooks system reference: documents active PreToolUse/PostToolUse/Stop hooks and their purposes, advises on auto-accept permission scope, and defines TodoWrite tracking best practices.
rules/patterns.md | rule | Standing code patterns: standard API response envelope, custom-hooks debounce pattern, repository interface, and skeleton-project evaluation protocol using parallel agents.
rules/performance.md | rule | Model selection and context management rules: maps task complexity to Haiku/Sonnet/Opus, sets context-window thresholds for task types, and defines ultrathink + plan-mode usage criteria.
rules/security.md | rule | Security standing rules: mandatory pre-commit checklist (no hardcoded secrets, input validation, parameterized queries, rate limiting), secret management pattern, and an immediate-stop escalation protocol on discovery.
rules/testing.md | rule | Testing requirements: 80 % coverage minimum across unit/integration/E2E, mandatory TDD order (RED→GREEN→REFACTOR), agent routing (tdd-guide for new code, e2e-runner for journeys).

## Skills

skills/security-review/SKILL.md | skill | Comprehensive security review skill with 10-section checklist (secrets, input validation, SQL injection, auth/authz, XSS, CSRF, rate limiting, data exposure, blockchain, dependencies) plus pre-deployment gate.
skills/tdd-workflow/SKILL.md | skill | TDD workflow skill: user-journey-first test planning, unit/integration/E2E patterns with mocking examples, coverage thresholds, test isolation rules, and CI/CD integration.
skills/backend-patterns.md | skill | Backend architecture patterns: RESTful API structure, repository pattern, service layer, error handling, database optimization, and caching strategies for Node.js/Next.js.
skills/frontend-patterns.md | skill | Frontend development patterns: component composition, custom hooks, state management, performance optimization (memoization, code splitting), and accessibility for React/Next.js.
skills/coding-standards.md | skill | Universal coding standards: readability/KISS/DRY/YAGNI principles, TypeScript conventions, naming rules, error handling patterns, and pre-commit quality checklist.
skills/clickhouse-io.md | skill | ClickHouse analytics patterns: schema design, query optimization, batch ingestion, and analytical workload best practices for high-performance OLAP.
skills/project-guidelines-example.md | skill | Template project-specific skill encoding architecture overview, file structure conventions, code patterns, testing requirements, and deployment workflow for a real production app.
skills/continuous-learning/config.json | config | Configuration for the continuous-learning system: sets minimum session length, extraction threshold, auto-approve flag, output path, and lists pattern categories to detect or ignore.

## Hooks (executable behaviour scripts)

hooks/hooks.json | config | Master hooks configuration wiring all PreToolUse/PreCompact/SessionStart/PostToolUse/Stop hooks to their shell scripts, covering: dev-server tmux enforcement, git-push review pause, doc-file creation blocker, strategic compact suggester, PR URL logger, auto-Prettier, TypeScript check, console.log warning, session-end audit, memory persistence, and continuous-learning evaluator.
hooks/memory-persistence/pre-compact.sh | sop | Pre-compaction hook: logs compaction event with timestamp and annotates the active session file so context loss is traceable.
hooks/memory-persistence/session-start.sh | sop | Session-start hook: scans for recent session files (last 7 days) and learned skills, surfaces counts and paths so Claude can reload prior context.
hooks/memory-persistence/session-end.sh | sop | Session-end hook: creates or updates a dated session log file (completed/in-progress/notes-for-next-session template) to persist working state across sessions.
hooks/strategic-compact/suggest-compact.sh | sop | Strategic compact suggester: tracks tool-call count per session and emits phase-transition compaction reminders at configurable thresholds to prevent mid-task context loss.
skills/continuous-learning/evaluate-session.sh | sop | Session evaluation hook: checks transcript length against minimum threshold, then signals Claude to extract reusable patterns and save them as skill files in the learned-skills directory.

## Config

mcp-configs/mcp-servers.json | config | MCP server registry listing 16 server definitions (GitHub, Firecrawl, Supabase, memory, sequential-thinking, Vercel, Railway, Cloudflare suite, ClickHouse, Context7, Magic UI, filesystem) with connection details and a context-window cap advisory.

## Context Presets

contexts/dev.md | prompt | Development mode context: sets agent behaviour to write-first, prefer working solutions, keep commits atomic, and favour Edit/Write/Bash tools over exploratory tools.
contexts/research.md | prompt | Research mode context: sets agent behaviour to read widely before acting, document findings as discovered, and output findings before recommendations.
contexts/review.md | prompt | Code-review mode context: sets agent behaviour to read thoroughly, prioritise by severity, suggest fixes rather than just flag issues, and group findings by file with severity-first ordering.

## Examples (instructive, not live)

examples/CLAUDE.md | prompt | Example project-level CLAUDE.md template encoding critical rules for code organisation, style (no emojis, immutability, no console.log), testing (TDD, 80 % coverage), and security (no secrets, input validation, CSRF) as a starting-point for new projects.
