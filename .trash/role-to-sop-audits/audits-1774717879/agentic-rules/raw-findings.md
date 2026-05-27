
## .references/agentic-rules/MVP-GlobalRules.md
**Type**: rule
**Portable**: partial
**Reason**: Contains solid lean-TDD/BDD and MVP-velocity workflow logic, but is deeply coupled to a specific agent persona ("Cody"), a proprietary IDE ("AINative Studio"), MCP-as-tooling narrative, and "HyperScaler" cloud abstraction — all of which must be stripped to expose the durable procedural core.
**Trigger**: Use when running an MVP sprint: translating GitHub issues into minimal working prototypes via red-green-refactor TDD, serverless-first deployments, and lightweight CI/CD on a short-lived feature branch.
**Steps/contract**:
1. **Issue selection** — filter open issues by effort (smallest first); annotate with minimal acceptance criteria.
2. **Branch naming** — `feature/mvp-{issue}-{slug}` | `bugfix/mvp-{issue}-{slug}` | `chore/mvp-{issue}-{slug}`; lifetime < 48 h.
3. **TDD loop** — WIP red commit → minimal implementation (green) → remove duplication (refactor); one or two test cases per handler.
4. **PR process** — title `MVP: <description>`; body includes linked issue, local test steps, deployed URL; CI runs unit tests then optional smoke test; failures block merge.
5. **Deploy & smoke** — deploy to target environment; run single HTTP-status smoke test; on success close issue and record deployment URL.
6. **Estimation** — T-shirt sizing: S < 1 h (1–2 SDK calls), M 1–3 h (compose 2–3 services), L > 3 h (multi-service workflow).
7. **Coding style** — single-file handlers; env vars / secrets manager for all config; compact imports; brief inline docstrings; fail-fast error handling; rely on managed IAM, never custom crypto.
8. **WIP commits** — prefix `WIP:`; commit every 30–60 min; end-of-day, no uncommitted changes.
9. **Rollback** — no automated rollback for MVP; record previous function ARN/URL in PR comment for manual revert.
**Strip**: "Cody" persona, "AINative Studio", "MCP" as a proprietary integration layer, "HyperScaler" abstraction (replace with concrete cloud or generic "serverless platform"), sample LLM prompts (they are illustrative, not procedural).
**Structure/format**: Plain Markdown with emoji section headers; no frontmatter; no inter-file references; prompts embedded inline as block-quotes. Sections: Backlog Management, Story Types & Estimation, Coding Style, Testing Strategy, CI/CD, Version Control.
**Notes**: The LLM prompt blocks are the weakest portable element — they are example invocations of "Cody" and add no durable process logic. The portable value is in the MVP Workflow Steps, Test Structure, Key CI/CD Practices, and Key GitHub Practices subsections. The T-shirt sizing heuristics and single-smoke-test-per-feature rule are concise and immediately reusable. Coding style rules (single-file handlers, env-var-only config, managed IAM, fail-fast) translate cleanly to any serverless stack.

## .references/agentic-rules/meta-rules.md
**Type**: rule
**Portable**: partial
**Reason**: Contains durable procedural logic across eight numbered sections, but is heavily entangled with a specific persona ("Cody"), platform ("AINative Studio"), and HyperScaler toolchain; §3 Reasoning/CoT and §8 Self-Validation are cleanly portable, while §1 (GitHub Issues + MCP), §4–§7 (TDD/CI/CD/Rollback) are portable once persona and platform refs are stripped.
**Trigger**: Apply when an agent needs: pre-task issue triage, structured chain-of-thought before code, TDD scaffolding, CI/CD YAML generation, rollback scripting, or a post-task self-audit protocol.
**Steps/contract**:
  §1 Backlog — GitHub Issues are sole source of truth; fetch highest-priority issue before any work; classify/label/estimate; post WIP comment on start; close with commit hash on merge.
  §2 Planning — 4-week MVP roadmap table (Week/Goal/Deliverables/Dependencies); epic→story breakdown with sizing; Graphviz DOT dependency graph; pre-release checklist; ≥3 risk items with Likelihood + mitigation.
  §3 Reasoning — Before nontrivial code: (1) clarify ambiguity, (2) weigh alternatives, (3) consider edge cases, (4) state chosen plan. Apply same CoT to data models, option comparisons, perf optimisations, and external API calls.
  §4 TDD — Red (failing unit test) → Green (minimal impl) → Refactor (clean up). Integration test for cross-service spans; BDD blocks for pseudocode; mocks/stubs for external deps.
  §5 Refactor — Extract duplicate logic to named helpers; async/await conversion; guard-clause simplification; remove unused imports.
  §6 CI/CD — GitHub Actions: checkout → install → test → deploy → smoke test; Terraform snippet for serverless + IAM + storage; lint step; canary deploy job with 30 s wait + 5-probe health check + 25% traffic shift or revert.
  §7 Rollback/Monitor — rollback.sh reads stable_version.json, calls update-alias, posts result; monitor.py polls every 60 s, POSTs to alert webhook on failure, logs to monitor.log; metrics-dashboard.md with CloudWatch commands and error-rate formula.
  §8 Self-Validation — After every task: (1) format followed? (2) required reasoning included? (3) filenames/placeholders correct? If a rule can't execute, state which rule, why, and request missing info.
**Strip**: "Cody" persona name; "AINative Studio" branding; "HyperScaler" terminology (replace with concrete cloud provider or leave as placeholder); MCP-specific message calls in §7 (or abstract to "post notification"); `${{ secrets.HYPERSCALER_ACCESS_KEY }}` style placeholders should become generic `${{ secrets.CLOUD_ACCESS_KEY }}`.
**Structure/format**: Plain numbered markdown sections under a single H2-less document; no frontmatter; no explicit trigger block; rules written as imperative bullets within each section; references a sibling file `canonical-rules.md` in the tombstone notice; superseded — do not promote this file directly, source from `canonical-rules.md` instead.
**Notes**: File is tombstoned (2026-03-27) and merged into `canonical-rules.md`. §8 Self-Validation was noted as originating exclusively from this file, making it the canonical source for that pattern. Any SOP extraction should pull from `canonical-rules.md` for reconciled content, but §8 text here can be used verbatim. §3 CoT and §8 Self-Validation are the two highest-value portable primitives — both are agenda-agnostic and apply to any code-generating agent. §1 Backlog logic has strong GitHub+MCP coupling but the workflow pattern (claim → work → report) is portable. §6–§7 are implementation recipes, not abstract SOPs, and are only partially portable as templates.

## .references/agentic-rules/canonical-rules.md
**Type**: rule
**Portable**: partial
**Reason**: Contains eight durable procedural sections (backlog management, planning, CoT reasoning, TDD coding, refactoring, CI/CD, rollback/monitoring, self-validation) wrapped in heavy AINative Studio / MCP / HyperScaler platform theater that must be stripped before reuse.
**Trigger**: Use when setting up a unified agent ruleset covering the full software-delivery lifecycle — issue triage through deployment, monitoring, and rollback — for a team that uses GitHub Issues as the work tracker and wants TDD + CoT enforced by default.
**Steps/contract**:
  §1 Backlog – GitHub Issues are single source of truth; fetch highest-priority labeled issue before starting; branch naming `feature|bugfix|chore/{issue}-{slug}`; TDD Red-Green-Refactor loop per issue; PR → develop → automated checks → merge → label `delivered`.
  §2 Planning – 4-week MVP roadmap table (Week | Goal | Deliverables | Dependencies); Fibonacci estimation; Graphviz DOT dependency graph on request; pre-release checkbox checklist; ≥3 technical risks with Likelihood + mitigation.
  §3 Reasoning – Emit numbered CoT narrative before any nontrivial code: (1) clarify requirements, (2) weigh alternatives, (3) edge cases, (4) chosen plan.
  §4 Coding & Tests – Red phase: failing unit test first; Green: minimal implementation; Refactor: clean up; coverage ≥ 90%; test directory `/tests/{unit,integration,functional}`; test file mirrors module name.
  §5 Refactoring – extract helpers, callback→async/await, guard clauses, prune unused imports; output unified diff or final refactored code only.
  §6 CI/CD – generate MVP pipeline YAML (checkout → install → test → deploy → smoke); Terraform snippets; canary deployment job (deploy → wait 30s → probe 5× → shift 25% traffic or revert).
  §7 Rollback & Monitoring – `rollback.sh` reads `stable_version.json`, updates alias, posts status; `monitor.py` polls every 60s, alerts on non-200; `metrics-dashboard.md` with CloudWatch commands, error-rate jq formula, cron scheduling.
  §8 Self-Validation – after each task: (1) format correct? (2) reasoning included? (3) filenames/placeholders correct? If a rule cannot execute, state which rule, why, and what is needed.
**Strip**: "AINative Studio", "HyperScaler", "MCP" (as a specific product), AWS Lambda / Azure / GCP vendor specifics in §6–§7 (replace with `<cloud-provider>`), agent-name WIP comment stamps, Slack/Teams notification references tied to a specific MCP server.
**Structure/format**: Single flat Markdown file; eight numbered `##` sections; no frontmatter; prose + tables + fenced code blocks; references two historical source files (`globalrules.md`, `meta-rules.md`) in a banner note at the top; §8 annotated with its source file.
**Notes**: §8 Self-Validation is the highest-value portable piece — it is a compact close-out protocol that applies universally. §3 CoT reasoning gate maps directly to the existing `cot-gate` skill. §4 TDD structure maps to the existing `tdd` skill. The file's main gap is that all inter-agent coordination is funnelled through "MCP" as if it were a magic communication bus — strip to generic tool-call patterns. The branch-naming table (§1) and Fibonacci estimation table (§2) are immediately reusable as-is.

## .references/agentic-rules/globalrules.md
**Type**: sop
**Portable**: partial
**Reason**: Contains durable, well-structured procedural logic for the full dev cycle (backlog → branch → TDD → PR → CI/CD → close), but every section is framed around a proprietary agent persona ("Cody"), a specific IDE ("AINative Studio"), and org-branded tooling references.
**Trigger**: Use when establishing or auditing a team's end-to-end development workflow covering issue tracking, branching, TDD/BDD, pull requests, CI/CD, and version control conventions.
**Steps/contract**:
  1. Issue Selection — query open issues filtered by `state: open, label: ready`, sorted by priority.
  2. Branch Naming — `feature/{issue-number}-{short-title-slug}` | `bugfix/…` | `chore/…`
  3. TDD Loop — (a) post failing-test scaffold as WIP comment on issue; (b) implement until green; (c) refactor and commit.
  4. Pull Request — open PR against `develop` once tests pass; automated lint/security/coverage checks run; PR requires: purpose, linked issue, testing steps, checklist (tests pass, lint clean, security scan attached, docs updated).
  5. Merge & Deliver — transition issue to `deliver-ready`, update label to `delivered`, run final integration suite, close issue, log merge commit hash.
  6. Story Estimation — Fibonacci scale (0, 1, 2, 3, 5, 8); split stories > 5 points.
  7. Coding Style — camelCase functions, PascalCase classes, UPPER_SNAKE_CASE constants; 4-space indent; ≤ 80-char lines; full type annotations (TS/Python PEP 484); external imports before internal.
  8. Testing — unit (Jest / pytest), integration (in-memory DB), functional/API (SuperTest / requests+pytest); coverage ≥ 90% for new code; `/tests/unit`, `/tests/integration`, `/tests/functional` directory layout.
  9. CI/CD — `main`/`develop` branch-protected; PRs need passing CI + 1 approving review; lint → tests → security scan → coverage; staging deploy on merge to `develop`; production deploy on release tag; canary rollout with auto-rollback on health-check failure; IaC versioned alongside app code.
  10. WIP Commits — prefix `WIP:`; end-of-day: no uncommitted changes.
**Strip**: "Cody" (agent persona), "AINative Studio" / "AINative" branding, `@ainative/services` import alias, MCP as proprietary orchestration tool (replace with generic "agent tooling" or "automation"), Slack/Teams channel specifics, "quantum integration" reference, banking/compliance client framing.
**Structure/format**: Flat Markdown with emoji-prefixed H2 section headers (📋 📖 🎨 🧪 🔄 🔧); each section has an "LLM Prompts" sub-block followed by a "Standard Workflow" or "Key Standards" sub-block; no frontmatter, no cross-file references within the doc itself.
**Notes**: File is tombstoned — header declares it superseded by `canonical-rules.md` (same directory) as of 2026-03-27; §1–§7 are preserved for historical reference only. The portable SOP extraction should preferably be sourced from `canonical-rules.md` instead, using this file only for coverage of any sections not carried forward. The LLM-prompt sub-blocks are roleplay scaffolding for their specific agent and carry no portable value — discard them. The underlying workflow (issue → branch → TDD → PR → CI → close) is a clean, mainstream XP/GitFlow hybrid that maps well to a portable SOP.

## .references/agentic-rules/Agent-Personas.md
**Type**: agent
**Portable**: partial
**Reason**: The role taxonomy (25 specialist types), per-role "When to Invoke" logic, and the sequential/parallel/iterative collaboration patterns are fully portable; the `Task(subagent_type="…")` invocation syntax is framework-specific and must be stripped.
**Trigger**: Use when bootstrapping a multi-agent system and needing a role catalogue with clear specialisation boundaries, handoff triggers, and orchestration patterns.
**Steps/contract**:
- Each agent entry declares: Purpose / Expertise / When to Invoke / (optional) Proactive Use / Example Invocation / Expected Output
- Orchestrator selects the right agent per task using the When-to-Invoke table
- Collaboration patterns:
  - Sequential: Plan → Implement → Security Review → Document
  - Parallel: post-implementation, invoke Security + UX + QA simultaneously
  - Iterative: Implement → Review → Apply improvements → Re-test
- Critical rule on TDD Developer: do NOT use for code review of recently written code
- Proactive invocation markers (Frontend, Backend, Security, QA, DevOps, SRE, Tech Docs, UX, Scrum PM, DX) indicate agents that should trigger automatically after relevant work, not only on explicit request
**Strip**: `Task(subagent_type="…", description="…", prompt="…")` invocation syntax (framework-specific); the 25 persona names as a fixed canonical list (treat as illustrative, not exhaustive); version/date metadata; "Maintained By: Primary Orchestrator Agent" branding; all blog-feature examples in prompts (they are stand-ins, not operative logic)
**Structure/format**: Flat markdown; H2 group headers by domain (Development / Quality & Security / Infrastructure / Documentation / Community / Experience); H3 per agent with bold-label field blocks; quick-reference table at end; no frontmatter; agents referenced by `subagent_type` slug (kebab-case); no cross-file references
**Notes**: The durable SOP here is the *role-selection protocol* (match task type → agent specialisation → collaboration pattern), not the persona names themselves. The "Proactive Use" field encodes an implicit trigger rule that could be promoted to an explicit routing SOP. The collaboration-patterns section (sequential / parallel / iterative) is the highest-value portable extract and maps cleanly to an orchestration SOP. The 25-agent taxonomy is a reasonable starting scaffold for any engineering org but should be treated as a menu, not a mandate.

## .references/agentic-rules/agent-reasoning-planning-execution.md
**Type**: rule
**Portable**: partial
**Reason**: Contains highly portable procedural rules for CoT reasoning, TDD scaffolding, refactoring, and self-validation, but is entangled with HyperScaler/AWS-specific CI/CD and rollback sections that are org-specific.
**Trigger**: Use when an agent is asked to plan, reason through code, scaffold tests, refactor, generate CI/CD, or deploy — i.e., the full software development lifecycle.
**Steps/contract**:
- Planning: generate 4-week MVP roadmap (markdown table: Week/Goal/Deliverables/Dependencies); break into sprints with Epics/User stories/T-shirt estimates; output dependency graph as Graphviz DOT; compile release checklist (`- [ ]` format); identify ≥3 risks with Likelihood + Mitigation.
- Reasoning (pre-code CoT): numbered 4-step narrative — (1) clarify requirements, (2) weigh alternatives, (3) consider edge cases/perf/security, (4) state chosen plan — before any nontrivial code.
- Coding/TDD: red-phase unit test first (Jest/pytest), minimal failing integration test for multi-service spans, BDD-style conversion of pseudocode, mock stubs with inline "implement here" comments.
- Refactoring: detect duplication → extract helper → produce unified diff; callback→async/await with try/catch; flatten nested conditionals with guard clauses; strip unused imports.
- CI/CD (strip vendor specifics): checkout → install deps → test → deploy → smoke test YAML pattern; canary deploy job (deploy alias → wait 30 s → 5 health checks → shift 25% or revert).
- Rollback/monitoring: shell script reads stable version JSON, updates alias, posts alert; Python monitor polls endpoint every 60 s, POSTs JSON failure payload to alert webhook, logs to file.
- Self-validation close-out: (1) correct output format? (2) CoT present where required? (3) correct filenames/placeholders?
- Fail-safe declaration: if a rule cannot execute, state which rule failed and why, request missing info.
**Strip**: "HyperScaler" branding, AWS-specific CLI commands (`aws lambda update-alias`, `aws cloudwatch`), MCP endpoint hardcode (`http://localhost:8000/mcp`), `secrets.HYPERSCALER_ACCESS_KEY` placeholder names, Terraform `aws_lambda_function` specifics — replace with generic cloud-function equivalents or leave as parameterized placeholders.
**Structure/format**: Single flat markdown file, seven numbered sections (Planning, Reasoning, Coding, Refactoring, CI/CD, Rollback/Monitoring, Sample Behavior), plus an Enforcement block. No frontmatter, no cross-file references. Rules are imperative ("The agent must…"). Output formats specified inline per rule (markdown table, DOT code only, full YAML, etc.).
**Notes**: The CoT-before-code rule (Section 2.1) and the self-validation close-out (Enforcement → Self-Validation) are the highest-value portable extractions — they map directly to the existing `cot-gate` and `self-validation` skills in this repo and would reinforce or extend them. The TDD red-phase scaffolding rules (Section 3) cleanly complement the `tdd` skill. The planning/roadmap section is useful but presupposes a 4-week MVP framing that may not fit all contexts — treat as a template rather than a hard rule. CI/CD and rollback sections need heavy de-branding before reuse.

## .references/agentic-rules/Agentic-Prompts-Library.md
**Type**: prompt
**Portable**: partial
**Reason**: The five workflow phases (backlog triage, test scaffolding, refactoring, CI/CD generation, rollback/monitoring) encode durable procedural logic applicable to any agentic dev workflow; what needs stripping is org-specific agent personas, a proprietary "HyperScaler" cloud abstraction label, and a hardcoded MCP server URL.
**Trigger**: When an agent needs ready-made prompts to drive a standard dev lifecycle — from issue triage through TDD, code cleanup, CI/CD YAML generation, and production monitoring.
**Steps/contract**:
  Phase 1 – Backlog Fetching/Classification:
    1. Fetch highest-priority issue by label (e.g. `mvp-feature`); return annotated JSON (number, title, labels, estimate, readiness).
    2. Classify unlabeled issues into feature/bug/chore; explain reasoning; output updated metadata.
    3. Post "in progress" comment on claimed issue with timestamp and starting note.
    4. Filter issues by T-shirt-size estimate; sort smallest→largest; return first three as JSON.
  Phase 2 – Test Scaffolding (Red Phase):
    1. Generate failing unit test asserting the specified endpoint/function contract.
    2. Generate failing integration test with placeholder env vars for external URLs.
    3. Convert pseudocode to BDD-style test (describe/it blocks) following Red–Green–Refactor.
    4. Insert mocks/stubs for external dependencies; keep test in failing (Red) state.
  Phase 3 – Refactoring:
    1. Detect duplicated logic; propose extraction into named helper; output diff + final block.
    2. Convert callback-based function to async/await with try/catch.
    3. Simplify deeply nested conditionals via guard clauses / early returns.
    4. Prune unused/heavyweight imports; return cleaned import block with removed lines highlighted.
  Phase 4 – CI/CD YAML:
    1. Generate GitHub Actions workflow: checkout → install → test → deploy → smoke test; embed secrets placeholders.
    2. Generate minimal Terraform snippet: serverless function + IAM role + storage bucket.
    3. Generate lint step (ESLint or flake8) that fails job and annotates PR on errors.
    4. Generate canary deployment job: deploy → wait 30 s → probe 5× → shift 25% traffic or rollback.
  Phase 5 – Rollback & Monitoring:
    1. Shell script reads stable-version JSON, updates prod alias via CLI, posts result notification.
    2. Python monitor polls endpoint every 60 s; on non-200/timeout POSTs JSON alert to webhook; logs locally.
    3. On failure, fires additional notification payload: action, functionName, timestamp, details.
    4. Metrics dashboard README: commands to fetch invocation stats, error-rate formula, cron/CI scheduling.
**Strip**: Agent persona name ("Cody") in issue comments; "HyperScaler" label (replace with `<cloud-provider>`); hardcoded MCP server URL (`http://localhost:8000/mcp` → `<mcp-endpoint>`); intro mention of Cody/Copilot/TabNine as target tools.
**Structure/format**: Flat Markdown; five numbered H2 sections each containing four numbered prompt templates rendered as blockquotes. No frontmatter, no cross-file references, no YAML/TOML metadata. Prompts are self-contained strings suitable for direct injection into an agent context.
**Notes**: The prompt templates mix concrete examples (Jest/pytest, ESLint/flake8, AWS Lambda) with generic placeholders — when promoting to a skill, parameterise the stack-specific fragments (test framework, lint tool, cloud provider, function runtime) as fill-in variables so the prompts stay framework-agnostic. Phase 2 (TDD scaffolding) overlaps strongly with the `tdd` skill and could be deduplicated or merged. Phase 4 CI/CD generation overlaps with `setup-ci`. Monitoring/rollback scripts (Phase 5) have no existing skill counterpart and are the most novel contribution here.

## .references/agentic-rules/Enhanced-Agentic-Prompts-Library.md
**Type**: prompt
**Portable**: partial
**Reason**: Contains two genuinely portable patterns — a 5-step structured planning workflow and a 7-step chain-of-thought (CoT) reasoning narrative — but both are buried in vendor-specific worked examples ("HyperScaler", AWS S3 SDK).
**Trigger**: Use when an agent must plan a multi-step feature roadmap before coding, or when it must reason explicitly through a technical decision (API design, error handling, performance) before producing code.
**Steps/contract**:
  Planning sequence (Section 1):
    1. Generate high-level roadmap (goals / deliverables / dependencies as markdown table)
    2. Break roadmap milestones into sprints with epics + user stories (T-shirt sized)
    3. Derive dependency graph (DOT/Graphviz) from story list
    4. Produce release checklist (features, tests, security scan, CI/CD, docs)
    5. Identify top risks with likelihood + mitigation steps

  CoT reasoning narrative (Section 2.2):
    1. Clarify requirements (inputs, outputs, constraints)
    2. Choose SDK/method (compare alternatives)
    3. Initialize dependencies / config (env vars, clients)
    4. Enumerate edge cases & validation rules
    5. Performance & security considerations
    6. Implementation plan (pseudocode / function signature)
    7. Testing approach (unit mock + optional integration test)
**Strip**: "HyperScaler" brand name throughout; AWS S3 presigner worked example (or generalize to "cloud storage SDK"); specific product scenario (real-time chat widget, serverless functions); version-pinned SDK import paths
**Structure/format**: Flat markdown, no frontmatter, no file references. Prompts are blockquoted prose. One TypeScript code block as a worked example. Two main numbered sections; subsections use ###.
**Notes**: The 7-step CoT narrative is the highest-value portable extract — it mirrors the cot-gate skill's clarify→weigh→edge-cases→plan structure but adds "choose SDK/method" and "testing approach" steps worth absorbing. The planning section is a prompt-template catalogue rather than a procedural SOP; useful as example scaffolding but not directly promotable as a skill without stripping the HyperScaler framing and making triggers generic.

## templates/claude-code/.claude/agents/agent.md.template
**Type**: agent
**Portable**: no
**Reason**: Pure mustache/placeholder scaffold with no substantive content — every meaningful field is a `{{VARIABLE}}` token that must be filled in per-use.
**Trigger**: N/A — this is a blank template to instantiate concrete subagent definitions, not a reusable SOP.
**Steps/contract**:
```
1. Be concise and focused on the task
2. Use the appropriate tools for each step
3. Report progress and results clearly
4. Ask for clarification when requirements are ambiguous
```
**Strip**: All `{{PLACEHOLDER}}` tokens (name, description, model, purpose, capabilities, instructions, example task, steps); the template structure itself is the only content.
**Structure/format**: Claude subagent YAML-frontmatter format (`name`, `description`, `model`) + markdown body with Role / Capabilities / Instructions / Tools Available / Response Guidelines / Example Usage sections — matches the claude-code `.claude/agents/` convention.
**Notes**: The four Response Guidelines bullets are the only portable prose; they could be extracted as a boilerplate checklist for any subagent definition. Otherwise, value is entirely in the structural scaffolding, not in encoded expertise.

## .references/agentic-rules/strict-rules-how-to.md
**Type**: sop
**Portable**: yes
**Reason**: Describes a universal pattern for encoding critical rules in CLAUDE.md so they survive context compression and are seen at every session start.
**Trigger**: When setting up a new Claude Code project or hardening an existing one to ensure critical rules are never missed.
**Steps/contract**:
1. Add "CRITICAL RULES - READ FIRST" section at the very top of CLAUDE.md
2. Put rule content inline (not a reference to another file)
3. Use tables and bold text for scannability
4. Add explicit "Forbidden:" list for hard no-ops
5. Mirror critical rules from .claude/rules/ into CLAUDE.md top — rules files alone require active recall, CLAUDE.md is unavoidable
**Strip**: Claude Code-specific file paths (.claude/rules/) — abstract to "rules directory" for portability; nothing else is project-specific.
**Structure/format**: Short prose explanation followed by a numbered pattern and a rationale list. No frontmatter; could benefit from SKILL.md frontmatter with a trigger description.
**Notes**: Compact, high-signal. The core insight (CLAUDE.md is re-read after context compression; rules files are not) is a non-obvious mechanism worth preserving verbatim. The table/bold/"Forbidden" formatting prescription is immediately actionable.

## .references/agentic-rules/templates/claude-code/CLAUDE.md.template
**Type**: config
**Portable**: partial
**Reason**: A fill-in-the-blanks scaffold for per-project CLAUDE.md context files; the structure is portable but all content is placeholder tokens requiring project-specific instantiation.
**Trigger**: When bootstrapping a new Claude Code project and need a standardised context file that orients the agent on tech stack, architecture, conventions, workflow, and env vars.
**Steps/contract**:
- Replace `{{PROJECT_NAME}}`, `{{TECH_STACK}}`, `{{REPOSITORY_URL}}`, `{{LAST_UPDATED}}` in the header
- Fill `{{PROJECT_DESCRIPTION}}` and architecture section (database, vector storage, caching, API style/auth/versioning)
- Define directory structure with up to 4 named dirs + descriptions
- Fill coding conventions: file/function/variable/constant naming + 3 code-style bullets
- Populate Critical Files table (3 entries)
- Fill Development Workflow bash blocks: setup, run, test commands
- Document env vars (copy `.env.example` pattern + 3 key vars)
- List active MCP servers (ZeroDB, GitHub, Strapi pre-filled as defaults)
- Add 3 `{{CLAUDE_NOTE_*}}` bullets for project-specific agent guidance
**Strip**: Hard-coded MCP server list (ZeroDB, GitHub, Strapi) — these are repo-author defaults, not universally applicable; remove or make them placeholders too.
**Structure/format**: Single Markdown file using `{{MUSTACHE_STYLE}}` tokens; intended to live at repo root as `CLAUDE.md`; footer note marks it as auto-generated.
**Notes**: Slot count (4 dirs, 3 critical files, 3 env vars, 3 code-style bullets) is opinionated — real projects may need more; expanding to variable-length lists would improve reuse. The MCP section assumes ZeroDB/Strapi availability which limits portability.

## .references/agentic-rules/docs/LLM_PROJECT_SETUP_PROMPT.md
**Type**: prompt
**Portable**: partial
**Reason**: Solid centralized-template scaffolding workflow, but embeds ZeroDB/AINative-specific env vars and MCP configs that are vendor-specific noise for generic use.
**Trigger**: Use when onboarding a developer who wants a centralized, reusable LLM-config/template system for managing multiple projects from one location.
**Steps/contract**:
1. Identify central docs location (ask user; common: `~/Documents/Projects/<workspace>/src/docs/`, `~/.config/llm-templates/`, `~/dotfiles/llm/`)
2. Create directory structure: `templates/` and `scripts/` under the docs path
3. Create `templates/env.template` with `{{PLACEHOLDER}}` syntax for all configurable values
4. Create `templates/env.<username>` with user's real credentials (never commit)
5. Create platform-specific templates: `claude.json.template`, `CLAUDE.md.template`, `settings.local.json.template`
6. Create `scripts/setup-project.sh` that copies and seeds templates into a target project path
7. Create `<PLATFORM>_SETUP.md` documenting config locations, MCP installs, verification, troubleshooting
8. Usage: `./setup-project.sh <project-path> [username]` for new projects; update central credentials and re-copy to propagate changes
**Strip**: ZeroDB/AINative-specific env vars (`ZERODB_*`, `ainative-zerodb-mcp-server`) and any workspace-specific path references (`~/Documents/Projects/<workspace>/src/docs/`) — replace with generic path pattern
**Structure/format**: Markdown meta-prompt (wraps a reusable prompt in a doc); includes bash snippets, JSON templates, a shell script, and a platform-compatibility table. Self-referential — the prompt creates the file that contains the prompt.
**Notes**: The `{{PLACEHOLDER}}` double-curly-brace convention is well-defined and portable. The separation of generic template vs. user-specific credentials file (`env.template` vs. `env.<username>`) is a strong pattern worth extracting. The self-bootstrapping nature (prompt creates its own home) is clever but slightly fragile — should note that the script must be run after the docs directory exists.

## .references/agentic-rules/templates/claude-code/.claude/commands/pr.md
**Type**: prompt
**Portable**: partial
**Reason**: Provides a reusable slash-command template and pre-flight checklist for filing PRs, but the `{{ISSUE_NUMBER}}` placeholder and generic checklist items need project-specific adaptation.
**Trigger**: When creating a pull request from the current branch.
**Steps/contract**: 1. Run tests, lint, build. 2. Push branch to remote. 3. Create PR using the provided Markdown template (Summary, Related Issue, Changes Made, Testing checklist, Screenshots, Checklist).
**Strip**: `{{ISSUE_NUMBER}}` placeholder syntax; "Screenshots (if applicable)" section (project-dependent); the literal `/pr` usage instruction.
**Structure/format**: Claude Code slash-command (`/pr`); single Markdown file with a prose pre-checklist and a fenced PR body template.
**Notes**: Weaker than the existing `pr-file` skill which adds acceptance criteria and linked-issue resolution. The testing checklist (unit/integration/manual) and style/docs/breaking-change checklist rows are worth extracting as portable defaults. Minimal overlap concern: if `pr-file` already covers this, this file adds little incremental value.

## .references/agentic-rules/templates/claude-code/.claude/commands/review.md
**Type**: prompt
**Portable**: yes
**Reason**: A concise, universal code-review checklist that is language- and framework-agnostic.
**Trigger**: Any time an agent or human performs a code review on a changeset or PR.
**Steps/contract**:
```
## Functionality
- [ ] Code accomplishes the intended purpose
- [ ] Edge cases are handled
- [ ] Error handling is appropriate

## Code Quality
- [ ] Code is readable and self-documenting
- [ ] No unnecessary complexity
- [ ] DRY principle followed (no duplicate code)
- [ ] Functions/methods are focused (single responsibility)

## Testing
- [ ] Tests exist for new functionality
- [ ] Tests cover edge cases
- [ ] Tests are readable and maintainable

## Security
- [ ] No hardcoded secrets or credentials
- [ ] Input validation where needed
- [ ] No SQL injection or XSS vulnerabilities
- [ ] Proper authentication/authorization checks

## Performance
- [ ] No obvious performance issues
- [ ] Database queries are optimized
- [ ] No memory leaks

## Documentation
- [ ] Complex logic is commented
- [ ] Public APIs are documented
- [ ] README updated if needed

## Style
- [ ] Consistent with project conventions
- [ ] Proper naming conventions
- [ ] No linting errors
```
**Strip**: Nothing — no repo-specific references exist.
**Structure/format**: Flat markdown checklist under named sections; works as a slash-command prompt, a skill step, or an inline review template.
**Notes**: Overlaps with the existing `pr-review` skill, which spawns parallel sub-agents. This file is simpler (checklist only, no orchestration); it could serve as the evaluation rubric embedded inside `pr-review` rather than a standalone SOP. Low novelty on its own — strongest value as a reusable sub-component.

## .references/agentic-rules/templates/claude-code/.claude/commands/tdd.md
**Type**: sop
**Portable**: partial
**Reason**: Solid red-green-refactor loop but coverage threshold (80%) and commit step are less opinionated than the existing `tdd` skill, which sets a 90% gate.
**Trigger**: When a user wants to build a feature or fix a bug using test-driven development.
**Steps/contract**:
1. Understand the requirement — analyze what needs to be built
2. Write failing test(s) — define expected behaviour
3. Run tests — confirm Red phase
4. Implement minimal code — just enough to pass
5. Run tests — confirm Green phase
6. Refactor — clean up while keeping tests green
7. Commit — atomic commit per cycle
**Strip**: Coverage threshold (repo-specific), commit style guidance (project-specific).
**Structure/format**: Slash-command prompt (`/tdd <arguments>`); `$ARGUMENTS` placeholder passes the feature description; plain Markdown with numbered steps and a guidelines bullet list.
**Notes**: Functionally equivalent to the workspace `tdd` skill but lighter — no phase checklists or integration-test placement rules. Coverage gate is 80% here vs 90% in the workspace skill; the workspace version is more rigorous and should win in a cross-repo comparison.

## templates/claude-code/.claude/commands/command.md.template
**Type**: template
**Portable**: partial
**Reason**: A generic scaffold for authoring Claude Code slash-command files; valuable as a structural guide but contains no executable logic of its own.
**Trigger**: Use when creating a new Claude Code `/command` file and needing a consistent section layout (arguments, usage, implementation, examples).
**Steps/contract**: (1) Name + description header, (2) `$ARGUMENTS` declaration with description, (3) Usage code block showing invocation, (4) Implementation section for the actual prompt/logic, (5) Two worked examples with args and expected results.
**Strip**: All `{{PLACEHOLDER}}` tokens must be replaced with real content before use; the template itself ships no reusable logic.
**Structure/format**: Markdown file intended to live at `.claude/commands/<name>.md`; follows the Claude Code custom-command convention where the file name becomes the slash-command slug.
**Notes**: Useful as a meta-SOP for "how to author a slash-command" but not itself a runnable SOP. Could be promoted to a `skill-create`-style checklist or a cookiecutter template. The two-example pattern is a good practice worth preserving in any derived skill.

## .references/agentic-rules/templates/claude-code/settings.json.template
**Type**: config
**Portable**: no
**Reason**: Single-key JSON stub (`alwaysThinkingEnabled: true`) that toggles a Claude Code UI setting — no behavioural logic or transferable guidance.
**Trigger**: N/A — applied at project initialisation when scaffolding a Claude Code workspace with extended thinking always on.
**Steps/contract**: None; the entire file is `{ "alwaysThinkingEnabled": true }`.
**Strip**: Nothing to strip — the file is already minimal, but it carries no SOP content.
**Structure/format**: Plain JSON template; would be copied verbatim into a project's `.claude/settings.json`.
**Notes**: Not a candidate for promotion to a skill or SOP. Could be referenced as a one-liner setup note inside a broader "Claude Code workspace bootstrap" skill if one exists.

## .references/agentic-rules/templates/claude-code/scripts/merged-permissions.json
**Type**: config
**Portable**: partial
**Reason**: Enumerates a broad but project-specific allow-list of Bash, WebFetch, Read, and MCP tool permissions for Claude Code; the git/gh/npm/filesystem entries are reusable, but `zerodb` and `ainative-strapi` MCP entries are vendor-specific, and `{{PROJECT_PATH}}`/`{{HOME_PATH}}` placeholders require local substitution.
**Trigger**: When bootstrapping a new Claude Code project that needs a pre-configured permissions baseline covering git, GitHub CLI, npm, web fetch, and common shell utilities.
**Steps/contract**: Single JSON object with `permissions.allow` (array of `Bash(cmd:*)`, `WebFetch(domain:…)`, `Read(path)`, and `mcp__*__tool` strings), empty `deny` and `ask` arrays.
**Strip**: All `mcp__zerodb__*` and `mcp__ainative-strapi__*` entries (vendor-specific); replace `{{PROJECT_PATH}}` and `{{HOME_PATH}}` with actual paths or a documented convention before use.
**Structure/format**: Plain JSON; no schema or comments; must be deployed to the project root or `.claude/` directory as the Claude Code settings permissions file; template placeholders use `{{UPPER_SNAKE}}` convention.
**Notes**: The list is unusually permissive (`Bash(bash:*)`, `Bash(curl:*)`, `chmod`, `xargs`) — adopters should audit and tighten to least-privilege for their context. Could be split into layered partial configs (core-shell, git, npm, mcp-github) for more selective reuse.

## templates/claude-code/.claude/settings.local.json.example
**Type**: config
**Portable**: partial
**Reason**: Provides a well-structured three-tier permission model (allow/ask/deny) for Claude Code tool use, but contains project-specific template variables (`{{PROJECT_PATH}}`, `{{HOME_PATH}}`) and opinionated MCP tool allowlists (zerodb, github) that must be adapted per deployment.
**Trigger**: Use when bootstrapping a new Claude Code project that needs sensible default tool-permission guardrails — permits common git, npm/pip, python, curl, and read operations while blocking destructive shell commands and gating sudo/docker/PR-merge.
**Steps/contract**:
- allow: git (fetch/pull/checkout/merge/add/commit/push/merge-base), npm install/run, pip install, python/python3, pytest, curl, cat, find, env; mcp github read+comment tools; mcp zerodb memory tools; Read project and ~/.claude paths
- ask: sudo (any), docker (any), mcp github merge_pull_request
- deny: rm -rf /, sudo rm, chmod 777
**Strip**: `{{PROJECT_PATH}}` and `{{HOME_PATH}}` template placeholders; zerodb MCP entries (deployment-specific); specific github MCP tool list (may differ by project)
**Structure/format**: JSON `permissions` object with three arrays — `allow`, `deny`, `ask`; maps directly to Claude Code `settings.local.json` schema; example file intended to be copied and filled in, not loaded directly
**Notes**: The three-tier model (allow/ask/deny) is the portable SOP pattern here — the specific tool list is illustrative. A portable version would document the *categories* (safe read-only ops → allow; destructive or irreversible → deny; elevated/external → ask) rather than hard-coding every tool name. Template variables signal this was designed for per-project instantiation.

## .references/agentic-rules/templates/claude-code/claude.json.template
**Type**: config
**Portable**: partial
**Reason**: Provides a reusable MCP server wiring template (GitHub, ZeroDB, Strapi) but is entirely tied to specific third-party services and credential placeholders rather than encoding any transferable process or behavioural rule.
**Trigger**: When bootstrapping a Claude Code project that needs GitHub MCP, ZeroDB, or Strapi MCP integrations pre-wired.
**Steps/contract**: 1. Copy template to `.claude/claude.json` in target project. 2. Replace all `{{PLACEHOLDER}}` tokens with real credentials/URLs. 3. Ensure `npx` can reach the listed npm packages (`@modelcontextprotocol/server-github`, `ainative-zerodb-mcp-server`, `strapi-mcp`, `ainative-strapi-mcp-server`).
**Strip**: All three Strapi/ZeroDB server blocks are org-specific — strip or replace with project-relevant MCP servers before adopting. `ZERODB_API_URL` hardcodes an ainative.studio endpoint.
**Structure/format**: Plain JSON config (`mcpServers` map), mustache-style `{{TOKEN}}` placeholders; no prose or behavioural guidance embedded.
**Notes**: Zero SOP value on its own — purely infrastructure scaffolding. Worth keeping as a reference snippet in an mcp-builder or setup-ci skill rather than promoting to a standalone SOP. The `ainative-strapi` vs `ainative-strapi-new` duplication suggests an in-progress migration; the older `strapi-mcp` entry should likely be removed.
