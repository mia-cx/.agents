# File Inventory — antigravity-skills

Repo: `antigravity-awesome-skills` (v9.0.0, ~1,315 skills)
Each skill lives at `skills/<name>/SKILL.md` and is assessed for procedural/behavioural content.
The `plugins/` directory holds bundle manifests (no direct agent instructions).

---

## Meta / Orchestration

skills/antigravity-skill-orchestrator/SKILL.md | skill | Evaluates task complexity, selects the minimal set of skills needed, invokes them in sequence, and records successful combinations in persistent memory to prevent over-engineering simple tasks.
skills/antigravity-workflows/SKILL.md | skill | Routes user goals to named multi-phase workflows (SaaS MVP, security audit, AI agent build, browser QA), then drives step-by-step execution with completion-criteria checks before advancing.
skills/agent-orchestrator/SKILL.md | skill | Auto-discovers skills via filesystem scan, scores each against the user request, and routes to sequential, parallel, or primary-plus-support execution patterns based on the match scores.
skills/dispatching-parallel-agents/SKILL.md | skill | Decision tree for partitioning multiple independent failures into separate parallel agent tasks, with guidance on scoping each task and integrating results without conflict.
skills/parallel-agents/SKILL.md | skill | Orchestrates 17 named specialist agents (security, backend, frontend, test, etc.) through discovery → analysis → implementation → testing phases with a unified synthesis report.
skills/subagent-driven-development/SKILL.md | skill | Drives plan execution by dispatching a fresh implementer subagent per task, then gating each on two sequential review passes (spec compliance first, code quality second) before marking complete.
skills/loki-mode/SKILL.md | skill | Fully autonomous PRD-to-production system using RARV (Reason-Act-Reflect-Verify) cycle, model-tier selection, blind code review, constitutional self-critique, and a multi-tiered fallback/human-escalation system.

---

## Planning & Execution

skills/concise-planning/SKILL.md | skill | Converts a coding request into a single structured plan (approach, scope, 6-10 atomic verb-first action items, validation step) with a two-question max clarification gate.
skills/planning-with-files/SKILL.md | skill | Externalises working memory to three persistent markdown files (task_plan.md, findings.md, progress.md), enforcing the 2-action write rule, 3-strike error protocol, and "read before decide" discipline.
skills/writing-plans/SKILL.md | skill | Produces bite-sized implementation plans at 2-5 minute granularity (write test, run it, implement, run again, commit), saved to `docs/plans/`, assuming zero codebase context.
skills/executing-plans/SKILL.md | skill | Loads a plan file, raises concerns before starting, executes in batches of 3 tasks with verification after each batch, stops on blockers, and hands off to finishing-a-development-branch on completion.
skills/finishing-a-development-branch/SKILL.md | skill | Verifies tests pass, then presents exactly four structured options (merge locally, push PR, keep, or discard with typed confirmation) and cleans up the worktree accordingly.
skills/context-driven-development/SKILL.md | skill | Manages five context artifacts (product.md, tech-stack.md, workflow.md, tracks.md, product-guidelines.md) as first-class versioned documents, with a validation checklist to run before any implementation track.

---

## Quality Gates & Delivery

skills/verification-before-completion/SKILL.md | skill | Iron-law gate: no completion claim may be made without running the verification command and reading its output in the same message; enumerates rationalisation anti-patterns and their rebuttals.
skills/closed-loop-delivery/SKILL.md | skill | Converts a task into a Definition of Done, implements, runs local tests, processes PR review comments in polling windows (3m / 6m / 10m), deploys to dev, and only declares done when all DoD checks pass with evidence.
skills/create-issue-gate/SKILL.md | skill | Creates GitHub issues with mandatory testable acceptance criteria; blocks execution gate (`draft` status) if criteria are vague, preventing implementation until `ready` is explicitly set.
skills/ask-questions-if-underspecified/SKILL.md | skill | Enforces a pause before implementation when key dimensions (objective, done-criteria, scope, constraints, environment, safety) are unclear; limits first-pass questions to 1-5 and requires explicit assumption confirmation before proceeding.
skills/receiving-code-review/SKILL.md | skill | Forbids performative agreement; mandates verify-before-implementing, YAGNI checks for unused features, technical pushback with reasoning, and full-batch clarification before acting on multi-item feedback.

---

## Code Review

skills/code-review-excellence/SKILL.md | skill | Transforms code review into knowledge sharing by grouping findings into blocking/important/minor severity bands with actionable feedback and a structured summary output format.
skills/code-review-checklist/SKILL.md | skill | Provides a seven-section checklist (pre-review, functionality, security, performance, code quality, tests, documentation/git) with bad/good code examples and comment templates for each category.
skills/differential-review/SKILL.md | skill | Security-focused diff review that classifies each changed file by risk (HIGH/MEDIUM/LOW), enforces git-blame analysis on removed security code, and produces a phase-by-phase report with attack scenarios and blast-radius calculation.

---

## Context & Memory Management

skills/context-fundamentals/SKILL.md | skill | Reference document for context anatomy (system prompts, tools, history, retrieved docs), the finite attention budget, and progressive-disclosure loading as the core engineering discipline.
skills/context-compression/SKILL.md | skill | Specifies three production compression strategies (anchored iterative, opaque, regenerative), defines the tokens-per-task optimisation target, structured summary sections, probe-based evaluation, and compression trigger thresholds.
skills/context-guardian/SKILL.md | skill | Pre-compaction protection protocol: four phases (extract P0/P1/P2 items, verify integrity checklist, write to 3 redundant layers, generate transition briefing) to prevent information loss before context window auto-compaction.
skills/context-window-management/SKILL.md | skill | Persona/role definition for a context engineering specialist covering tiered context strategy, serial-position optimisation, and intelligent importance-based summarisation.
skills/context-manager/SKILL.md | skill | Role definition for an elite context engineer covering dynamic assembly, multi-agent coordination, token-budget management, pruning, vector-database integration, and RAG retrieval optimisation.
skills/context-driven-development/SKILL.md | skill | (See Planning section — also covers session-start/end continuity protocols and a context validation checklist.)
skills/planning-with-files/SKILL.md | skill | (See Planning section — also covers the 5-question reboot test and read-vs-write decision matrix.)
skills/memory-systems/SKILL.md | skill | Layered memory architecture design covering working/short-term/long-term/entity/temporal-knowledge-graph tiers, with benchmark data (Zep 94.8% DMR), consolidation triggers, and retrieval-pattern selection guidance.
skills/agent-memory-mcp/SKILL.md | skill | Sets up a persistent MCP-backed knowledge store (memory_search, memory_write, memory_read) used by other skills to record and retrieve successful skill combinations and architectural decisions across sessions.

---

## Auditing & Security

skills/audit-context-building/SKILL.md | skill | Pre-vulnerability-hunt phase protocol: bottom-up scan, line-by-line function micro-analysis with First-Principles/5-Whys/5-Hows, cross-function continuity rules, and a completeness checklist with minimum quality thresholds.
skills/audit-skills/SKILL.md | skill | Static security analysis for AI skill and bundle files across Windows/macOS/Linux/mobile, checking nine threat categories (privilege escalation, obfuscation, exfiltration, persistence, etc.) and producing a 0-10 score report.
skills/agentic-actions-auditor/SKILL.md | skill | Five-step methodology for auditing GitHub Actions workflows that invoke AI agents, detecting nine attack vectors (env-var intermediary, direct injection, CLI data fetch, sandbox misconfig, wildcard allowlists, etc.) and generating a structured findings report.
skills/differential-review/SKILL.md | skill | (See Code Review section.)
skills/clarity-gate/SKILL.md | skill | Pre-RAG-ingestion epistemic verification system: nine verification points (hypothesis labelling, uncertainty markers, assumption visibility, data consistency, causation, temporal coherence, external claims), two-round HITL protocol, and structured CGD output format.
skills/bdistill-behavioral-xray/SKILL.md | skill | Runs 30 probe questions across six dimensions (tool use, refusal, formatting, reasoning, persona, grounding) and generates an HTML report with radar charts to document model behavioural patterns for compliance or model-selection purposes.
skills/bdistill-knowledge-extraction/SKILL.md | skill | Structures in-session domain questions into quality-scored JSONL knowledge entries with adversarial validation mode, enabling cross-model comparison and downstream ML dataset construction.

---

## Incident Operations

skills/postmortem-writing/SKILL.md | skill | Complete blameless postmortem protocol: timeline format, 5-Whys analysis template, detection/response evaluation, action-item table with P0-P2 priority, facilitation agenda (opening/timeline/analysis/action-items/close), and anti-patterns list.
skills/on-call-handoff-patterns/SKILL.md | skill | Shift-handoff procedure with templates for full handoff (active incidents, investigations, recent changes, known issues, upcoming events, escalation contacts, quick-reference commands) and mid-incident handoff; includes pre/during/post-shift checklists.

---

## Agent Architecture & Reasoning

skills/autonomous-agent-patterns/SKILL.md | skill | Reference patterns for coding-agent loops (Think-Decide-Act-Observe), tool schema design, permission-level taxonomy (AUTO/ASK_ONCE/ASK_EACH/NEVER), sandboxed execution, browser automation, checkpoint/resume, and MCP integration.
skills/multi-agent-patterns/SKILL.md | skill | Compares supervisor, peer-to-peer/swarm, and hierarchical patterns; covers the telephone-game problem (direct pass-through fix), weighted voting, debate protocols, context-isolation as primary design principle, and failure-mode mitigations.
skills/behavioral-modes/SKILL.md | skill | Defines seven named operating modes (Brainstorm, Implement, Debug, Review, Teach, Ship, Orchestrate) with distinct behaviours, output formats, and auto-detection triggers; extends to PEC multi-agent cycle.
skills/bdi-mental-states/SKILL.md | skill | Implements Belief-Desire-Intention ontology in RDF/Turtle for formalising agent mental states, with T2B2T (triples-to-beliefs-to-triples) paradigm, SPARQL competency queries, and SEMAS rule-translation patterns.

---

## TDD & Testing

skills/tdd-orchestrator/SKILL.md | skill | Role definition for a TDD orchestrator covering red-green-refactor cycle enforcement, multi-agent test workflow coordination, mutation testing, property-based testing, and cross-team TDD governance.
skills/systematic-debugging/SKILL.md | skill | Four-phase debugging SOP (root-cause first, never patch symptoms): data collection → hypothesis formation → targeted testing → fix with verification; includes rationalisation-rejection table and "iron law" gate.

---

## Skill Meta / Creation

skills/agents-md/SKILL.md | skill | Rules for writing minimal, high-signal AGENTS.md/CLAUDE.md files: ≤60 lines, required sections (package manager, file-scoped commands, commit attribution), anti-patterns to omit (linter rules, filler, obvious instructions).
skills/skill-creator/SKILL.md | skill | Automates new-skill creation through brainstorming → template application → YAML/content validation → local or global installation, with platform detection and progress tracking.
skills/00-andruia-consultant/SKILL.md | agent | Bifurcation protocol that diagnoses a workspace as greenfield or brownfield, then drives an interview to produce tareas.md + plan_implementacion.md and proposes a 3-5 skill squad — all in Spanish.
skills/10-andruia-skill-smith/SKILL.md | agent | Three-phase skill forge (ADN interview → file materialisation → folder + registry deployment) for creating new skills inside the Andru.ia ecosystem following the "Diamond Standard".
skills/agent-evaluation/SKILL.md | skill | Quality-engineering patterns for evaluating LLM agents: statistical multi-run testing, behavioural contract testing, adversarial testing, and anti-patterns (single-run, happy-path-only, string matching).

---

## Project Management / Estimation

skills/progressive-estimation/SKILL.md | skill | PERT-based estimation for AI-assisted and hybrid teams: mode detection (human-only / hybrid / agent-first), three-point PERT formula, P50/P75/P90 confidence bands, and calibration feedback loop.

---

## Conductor System (multi-skill workflow suite)

skills/conductor-setup/SKILL.md | config | Scaffolds Rails projects for the Conductor parallel-agents app by creating conductor.json, setup script, server script, and updating Redis config to use ENV-based URLs.
skills/conductor-implement/SKILL.md | skill | Executes tracks from a Conductor plan using TDD workflow: pre-flight checks, task loop with red-green-refactor, per-phase verification checkpoint requiring explicit user approval before proceeding.
skills/conductor-manage/SKILL.md | skill | Track and project management operations for the Conductor system (status, create, archive, etc.).
skills/conductor-validator/SKILL.md | skill | Validates Conductor project artifacts for completeness and consistency before implementation begins.
skills/conductor-new-track/SKILL.md | skill | Creates a new implementation track (spec.md + plan.md + metadata.json) inside the Conductor directory structure.
skills/conductor-status/SKILL.md | skill | Reports current Conductor project state: active tracks, phase progress, recent commits, and pending tasks.
skills/conductor-revert/SKILL.md | skill | Reverts a Conductor track to a prior git checkpoint and resets metadata state accordingly.

---

## Plugin / Bundle Config

.claude-plugin/plugin.json | config | Declares the antigravity-awesome-skills Claude Code plugin (name, version, author, homepage) — the root registry entry that makes all skills discoverable.
