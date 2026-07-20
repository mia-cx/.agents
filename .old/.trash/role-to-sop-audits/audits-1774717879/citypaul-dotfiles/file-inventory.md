# File Inventory — citypaul-dotfiles

Source: `.references/citypaul-dotfiles`
Paths below are relative to the repo root.

---

## Core behaviour config

`claude/.claude/CLAUDE.md` | `rule` | Defines the master development philosophy: TDD-non-negotiable, TypeScript strict, functional/immutable patterns, output guardrails (write to files, plan-only mode, incremental output), and skill-loading protocol.

`claude/.claude/settings.json` | `config` | Claude Code global settings: model selection, enabled plugins, `alwaysThinkingEnabled`, status-line command, and PostToolUse hook that auto-runs Prettier + ESLint after every Write/Edit on `.ts`/`.tsx` files.

`opencode/.config/opencode/opencode.json` | `config` | OpenCode agent config that loads the global CLAUDE.md and all skills and agents as persistent instructions for the OpenCode session.

---

## Agents

`claude/.claude/agents/adr.md` | `agent` | Decision-recording agent that creates Architecture Decision Records (ADRs) for significant one-way-door architectural choices, including a five-question decision framework and a standard ADR template with context/alternatives/consequences sections.

`claude/.claude/agents/docs-guardian.md` | `agent` | Documentation quality agent that enforces seven world-class documentation pillars (value-first, scannable, progressive disclosure, problem-oriented, show-don't-tell, connected, actionable) both proactively during creation and reactively when reviewing existing docs.

`claude/.claude/agents/learn.md` | `agent` | Institutional-knowledge capture agent that spots learning moments during development and documents insights (gotchas, patterns, architectural rationale) into CLAUDE.md with significance-assessment criteria and a structured documentation proposal format.

`claude/.claude/agents/pr-reviewer.md` | `agent` | Pull-request review agent that audits PRs across five categories (TDD compliance, testing quality, TypeScript strictness, functional patterns, general quality) and posts structured feedback directly to GitHub via MCP or `gh` CLI.

`claude/.claude/agents/progress-guardian.md` | `agent` | Plan-and-commit gating agent that manages `plans/<name>.md` files, requires explicit user approval before modifying plans or committing, and orchestrates end-of-feature teardown (verify criteria, merge learnings, delete plan file).

`claude/.claude/agents/refactor-scan.md` | `agent` | Refactoring opportunity scanner that distinguishes semantic duplication (should fix) from structural similarity (keep separate) and generates a prioritised report after each GREEN phase with a semantic-meaning-over-structure decision rule.

`claude/.claude/agents/tdd-guardian.md` | `agent` | TDD compliance coach and enforcer that blocks production code without a preceding failing test, guides RED-GREEN-REFACTOR phases, and generates a structured compliance report with file-level evidence when violations occur.

`claude/.claude/agents/ts-enforcer.md` | `agent` | TypeScript strict-mode enforcer that audits for `any` usage, missing schemas at trust boundaries, type assertions, immutability violations, and multiple positional parameters, generating a compliance report with severity levels and concrete fixes.

`claude/.claude/agents/twelve-factor-audit.md` | `agent` | 12-Factor App compliance auditor that scans a Node.js/TypeScript service against all 12 factors, cites specific file/line violations, and produces a prioritised remediation report written to `twelve-factor-audit.md`.

`claude/.claude/agents/use-case-data-patterns.md` | `agent` | Read-only architectural analysis agent (attributed to Kieran O'Hara) that traces a user-facing use case through all architecture layers (routes → business logic → data access → integrations) and produces a structured report identifying gaps and missing patterns.

---

## Commands (slash-command prompts)

`claude/.claude/commands/setup.md` | `prompt` | One-shot project onboarding command that detects tech stack, TypeScript config, CI pipeline, DDD/hex-arch/12-factor patterns, and generates project-level CLAUDE.md, PostToolUse hooks, `/pr` command, and a pr-reviewer agent.

`claude/.claude/commands/plan.md` | `prompt` | Plan-creation command that branches, explores the codebase, writes a self-contained `plans/<feature>.md` file following RED-GREEN-REFACTOR-MUTATE steps, and opens a PR for plan review before any code is written.

`claude/.claude/commands/pr.md` | `prompt` | Pre-PR quality-gate command that requires mutation testing, refactoring assessment, typecheck/lint, and optional DDD glossary check to all pass before running `gh pr create`.

`claude/.claude/commands/continue.md` | `prompt` | Post-merge workflow command that pulls main, reads the active plan, updates completed items, and creates a fresh branch for the next slice without starting implementation.

`claude/.claude/commands/generate-pr-review.md` | `prompt` | Meta-command that discovers project conventions from AI config files, ADRs, CI config, and existing code patterns, then generates a project-specific `pr-reviewer` agent, PostToolUse hooks, and `/pr` command tailored to the project.

---

## Skills (on-demand procedure modules)

`claude/.claude/skills/tdd/SKILL.md` | `skill` | RED-GREEN-REFACTOR workflow procedure: write failing test first, implement minimum code to pass, assess refactoring value — with strict rules on factory functions, no `let`/`beforeEach`, and behaviour-not-implementation test naming.

`claude/.claude/skills/testing/SKILL.md` | `skill` | Behaviour-driven test writing patterns: test through public API only, factory functions with real schemas, no 1:1 file mapping, descriptive business-behaviour test names, and guidance on what not to test.

`claude/.claude/skills/mutation-testing/SKILL.md` | `skill` | Procedure for verifying test effectiveness by running a mutation testing tool, interpreting surviving mutants, and deciding whether each is a test gap or an equivalent mutant.

`claude/.claude/skills/test-design-reviewer/SKILL.md` | `skill` | Test quality evaluation procedure using Dave Farley's eight test properties, run as a forked Explore agent to score and recommend improvements to an existing test suite.

`claude/.claude/skills/typescript-strict/SKILL.md` | `skill` | TypeScript strict-mode rules: no `any`, schema-first at trust boundaries (Zod/Standard Schema), `type` for data/`interface` for behaviour contracts, branded types, and required `tsconfig` strict flags.

`claude/.claude/skills/functional/SKILL.md` | `skill` | Functional programming rules: no mutation, pure functions, early returns over nested conditionals, array methods over loops, options objects over positional params, and an immutability violations catalogue.

`claude/.claude/skills/refactoring/SKILL.md` | `skill` | Post-GREEN refactoring assessment procedure: semantic-vs-structural duplication check, extract-constant/extract-function/early-return patterns, and explicit guidance to say "no refactoring needed" when code is already clean.

`claude/.claude/skills/planning/SKILL.md` | `skill` | Work-decomposition procedure for significant features: create a `plans/<name>.md` file via `/plan`, keep each step to a single commit, use `/continue` after merged PRs.

`claude/.claude/skills/expectations/SKILL.md` | `skill` | Working norms procedure: TDD-first, capture learnings while context is fresh, update CLAUDE.md after significant changes, ask "what do I wish I'd known?" after complex work.

`claude/.claude/skills/ci-debugging/SKILL.md` | `skill` | Hypothesis-first CI/CD failure diagnosis procedure: form a hypothesis, gather evidence from logs, validate, fix — never assume flakiness without proof.

`claude/.claude/skills/front-end-testing/SKILL.md` | `skill` | Behaviour-driven UI testing patterns using Vitest Browser Mode (preferred) and DOM Testing Library: accessible queries, user-event simulation, async patterns, and when not to mock.

`claude/.claude/skills/react-testing/SKILL.md` | `skill` | React-specific testing patterns for components, hooks, context, and forms using Vitest Browser Mode with `vitest-browser-react` and `@testing-library/react`.

`claude/.claude/skills/hexagonal-architecture/SKILL.md` | `skill` | Ports-and-adapters architecture procedure for projects that have opted in: port definitions, adapter implementation, dependency inversion, and boundaries between domain and infrastructure.

`claude/.claude/skills/domain-driven-design/SKILL.md` | `skill` | DDD implementation procedure for opted-in projects: ubiquitous language enforcement, value objects, entities, aggregates, domain events, and bounded context mapping.

`claude/.claude/skills/twelve-factor/SKILL.md` | `skill` | 12-Factor App implementation patterns with code examples for config, dependencies, backing services, stateless processes, disposability, and structured logging — applicable to any deployed application type.

`claude/.claude/skills/typescript-strict/SKILL.md` | `skill` | (listed above under TypeScript strict)

`claude/.claude/skills/frontend-design/SKILL.md` | `skill` | Frontend interface creation procedure that guides building production-grade, distinctive UI components and pages with explicit anti-generic-AI-aesthetics direction.

---

## Skill resource documents (referenced by parent SKILL.md)

`claude/.claude/skills/domain-driven-design/resources/aggregate-design.md` | `sop` | Step-by-step procedure for designing DDD aggregates: always-valid principle, boundary sizing rules, consistency patterns, and when to split aggregates.

`claude/.claude/skills/domain-driven-design/resources/bounded-contexts.md` | `sop` | Context-mapping procedure: identifying linguistic boundaries, context-map patterns (ACL, shared kernel, conformist), and how to discover boundaries from team structure and language divergence.

`claude/.claude/skills/domain-driven-design/resources/domain-events.md` | `sop` | Domain event design procedure: naming in past tense, deciding when events earn their complexity, publishing/subscribing patterns, and event-sourcing considerations.

`claude/.claude/skills/domain-driven-design/resources/domain-services.md` | `sop` | Procedure for identifying and placing domain services: when logic doesn't belong to a single entity/value object, stateless service design, and how to avoid anemic domain models.

`claude/.claude/skills/domain-driven-design/resources/error-modeling.md` | `sop` | Error representation procedure across architectural layers: discriminated-union results as the default, when to throw vs return, and mapping domain errors to adapter-layer responses.

`claude/.claude/skills/domain-driven-design/resources/testing-by-layer.md` | `sop` | DDD-specific testing strategy following UCDD (Use Case Driven Design): which layer owns which test, how to test aggregates vs domain services vs application layer.

`claude/.claude/skills/hexagonal-architecture/resources/cqrs-lite.md` | `sop` | CQRS-lite procedure for hexagonal projects: separating read and write models on the same database, query handler patterns, and when this pattern is warranted.

`claude/.claude/skills/hexagonal-architecture/resources/cross-cutting-concerns.md` | `sop` | Placement rules for logging, authentication, transactions, and error formatting within hexagonal architecture layers.

`claude/.claude/skills/hexagonal-architecture/resources/incremental-adoption.md` | `sop` | Strangler-fig procedure for introducing hexagonal architecture into an existing codebase without a full rewrite: extract boundaries incrementally, sequence of steps.

`claude/.claude/skills/hexagonal-architecture/resources/testing-hex-arch.md` | `sop` | Testing strategy for hexagonal architecture using UCDD: use-case as primary test boundary, fakes implementation patterns, `createTestDb` helper, and the Swappability Test.

`claude/.claude/skills/hexagonal-architecture/resources/worked-example.md` | `sop` | End-to-end worked example tracing one feature ("pledge a contribution") through every hexagonal layer showing how hex arch and DDD fit together in practice.
