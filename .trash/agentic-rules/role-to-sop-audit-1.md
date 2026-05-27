# Role-to-SOP Audit: `agentic-rules`

**Repo path**: `/Users/mia/.agents/.worktrees/role-to-sop/.references/agentic-rules`
**Audit date**: 2026-03-28
**Pass**: 1

---

## Repo Overview

`agentic-rules` is published by **AINative Studio** as a public template/rule library for agent-driven, XP-style software development. It was built around their proprietary agent **"Cody"** embedded in "AINative Studio IDE," but is explicitly designed to be portable to VS Code, IntelliJ, Cursor, and any MCP-capable tooling. The repo's canonical rule set (`canonical-rules.md`) was consolidated on 2026-03-27 by merging `globalrules.md` and `meta-rules.md`; both source files are now tombstoned. The repo also ships a Claude Code project template scaffold, an LLM setup prompt, a library of 22–25 agent persona definitions, and prompt libraries for TDD/CI/CD workflows. Its audience is teams using AI agents in developer tooling rather than pure human-role workflow documentation.

---

## What Kinds of Rules/Skills/Agents Are Present

- **Operational workflow rules** (backlog management, branching conventions, PR process, issue lifecycle) in `canonical-rules.md` and `globalrules.md`
- **MVP-mode variants** of the same rules (faster, smaller scope) in `MVP-GlobalRules.md`
- **Reasoning/chain-of-thought mandates** (numbered narrative before code, risk assessment, dependency graphs) in `canonical-rules.md` §3 and `agent-reasoning-planning-execution.md`
- **TDD/BDD scaffolding rules** (Red-Green-Refactor steps, test file naming, coverage thresholds) in §4 of `canonical-rules.md`
- **CI/CD YAML generation rules** (MVP deploy pipeline, Terraform snippets, canary deployment, lint step) in §6
- **Rollback and monitoring rules** (shell scripts, Python monitor, metrics dashboard) in §7
- **Self-validation / fail-safe rule** (post-task audit loop, explicit failure reporting) in §8
- **25 named agent personas** (Explore, Plan, TDD Dev, Frontend, Backend, DevOps, SRE, QA, Security, Data Engineer, etc.) with invocation contracts in `Agent-Personas.md`
- **Prompt library** (curated prompts per workflow phase) in `Agentic-Prompts-Library.md` and `Enhanced-Agentic-Prompts-Library.md`
- **Meta-rules** (how to make rules stick; CLAUDE.md placement strategy) in `strict-rules-how-to.md`
- **Project setup template** (env template, MCP config, slash commands for tdd/pr/review) in `templates/claude-code/`
- **Universal LLM setup prompt** (`docs/LLM_PROJECT_SETUP_PROMPT.md`)

---

## SOP Candidate Split

### ✅ SOPs to Port (Portable)

| #   | Candidate Name                          | Source File(s)                                                      | What It Covers                                                                                                                                             | Why Port                                                                                                                                                         |
| --- | --------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Backlog-to-Branch Workflow**          | `canonical-rules.md` §1                                             | Issue triage, labeling, branch naming, WIP commits, PR lifecycle, issue closure                                                                            | Completely tooling-agnostic logic; GitHub Issues + any CI tool; highest-density operational content                                                              |
| 2   | **TDD Red-Green-Refactor Protocol**     | `canonical-rules.md` §4, `agent-reasoning-planning-execution.md` §3 | Failing test first, minimal impl, refactor, coverage ≥90%, test directory structure                                                                        | Universal across JS/TS/Python; no AINative-specific coupling once MCP references stripped                                                                        |
| 3   | **Chain-of-Thought Before Code**        | `canonical-rules.md` §3, `agent-reasoning-planning-execution.md` §2 | Numbered narrative: clarify → alternatives → edge cases → plan; applies to data models, API choices, perf opts                                             | Directly addresses the "role theater → execution flow" thesis; strips well                                                                                       |
| 4   | **Self-Validation & Fail-Safe**         | `canonical-rules.md` §8 (`meta-rules.md` origin)                    | Post-task audit: format check, reasoning check, placeholder check; explicit failure reporting                                                              | Highly portable protocol primitive; unique in this repo; no persona coupling                                                                                     |
| 5   | **PR Completeness Checklist**           | `canonical-rules.md` §1 (PR process), `globalrules.md` §6           | PR description contract: linked issue, test steps, lint/scan results, doc update                                                                           | Standard gate; strip "Cody" and "AINative CI" references                                                                                                         |
| 6   | **CI/CD Pipeline Skeleton (MVP)**       | `canonical-rules.md` §6, `agent-reasoning-planning-execution.md` §5 | Checkout → install → test → deploy → smoke-test sequence; canary pattern; Terraform IaC stub                                                               | Framework for any CI system once cloud-vendor placeholders are genericised                                                                                       |
| 7   | **Rollback & Monitoring Protocol**      | `canonical-rules.md` §7                                             | `rollback.sh` contract (read stable version → update alias → notify), `monitor.py` contract (poll → alert on non-200 → log), metrics dashboard template    | Cloud-vendor logic is encapsulated behind env vars; core pattern is portable                                                                                     |
| 8   | **Agent Persona Invocation Contracts**  | `Agent-Personas.md`                                                 | Structured per-specialty invocation (subagent_type, description, prompt template, expected output, thoroughness levels, collaboration patterns)            | The meta-structure (contract shape) is portable even if individual persona names are stripped; covers Explore/Plan/TDD Dev/QA/Security/DevOps/SRE as named roles |
| 9   | **Project Bootstrap Template**          | `templates/claude-code/`, `docs/LLM_PROJECT_SETUP_PROMPT.md`        | `{{PLACEHOLDER}}`-based env/config template system, setup script pattern, CLAUDE.md placement, slash commands (tdd/pr/review)                              | Template scaffold pattern is portable to any agent tooling; credentials-separation principle is universal                                                        |
| 10  | **Meta-Rule: Critical Rules Placement** | `strict-rules-how-to.md`                                            | Rules in CLAUDE.md top > rules in rules/ dir; table+bold format; "Forbidden" list pattern                                                                  | Directly actionable SOP for how to ship rules; strips AINative branding trivially                                                                                |
| 11  | **Sprint Planning & Estimation Rules**  | `canonical-rules.md` §2, `agent-reasoning-planning-execution.md` §1 | 4-week roadmap table, Fibonacci/T-shirt sizing, Graphviz dependency graph output, release checklist, risk assessment (≥3 risks with likelihood+mitigation) | Fully portable planning protocol; strip HyperScaler references                                                                                                   |

### ❌ SOPs to Leave Out

| Candidate | Source File | Reason to Exclude |
|-----------|-------------|-------------------|
| HyperScaler-specific deploy rules | `canonical-rules.md` §6–7, `MVP-GlobalRules.md` | AWS Lambda / Azure Functions / GCP-specific CLI calls are too vendor-tied; the scaffold ships but the vendor content must be rewritten per target |
| MCP annotation workflow (Cody-specific) | `globalrules.md`, `canonical-rules.md` §1 | The MCP endpoint at `localhost:8000/mcp` and "Cody" agent name are AINative-proprietary; the *pattern* (annotate issues, post WIP comments) is portable but the implementation is not |
| Agent Persona content (individual personas) | `Agent-Personas.md` | Individual persona descriptions (e.g., "OSS Community Manager," "Content Publisher," "Team Dynamics Advisor") are role-theater artifacts; too broad and not specific to coding workflows; also explicitly warned against in audit constraints |
| AINative-branded prompt library prompts | `Agentic-Prompts-Library.md` | Prompts are helpful examples but are tightly framed around "Cody," "AINative CI," and HyperScaler SDKs; better to extract patterns (§ below) than port as-is |
| ZeroDB / Strapi / AINative MCP server config | `templates/claude-code/claude.json.template` | Proprietary AINative services; not portable |
| `zerodb-userguide.md` | `zerodb-userguide.md` | AINative proprietary database product documentation |

---

## SOP Port Tables

### SOP 1: Backlog-to-Branch Workflow

| Field | Content |
|-------|---------|
| **Source file** | `canonical-rules.md` §1 (lines: "Backlog Management" section) |
| **Trigger / When to use** | Before starting any dev task; when an issue exists in GitHub Issues (or equivalent tracker) |
| **Steps / Contract** | 1. Fetch highest-priority open issue for current mode label. 2. Classify unlabeled issues (feature/bug/chore). 3. Create branch: `feature/{issue}-{slug}`, `bugfix/...`, `chore/...`. 4. Post WIP comment with timestamp + agent name. 5. Commit frequently with `WIP:` prefix. 6. Open PR against `develop` after tests pass. 7. Run automated checks. 8. On merge: transition issue → closed, log commit hash. |
| **Quality bar** | Branch naming convention followed; WIP comment posted; tests pass before PR; issue closed with commit reference |
| **Escalation path** | If issue is ambiguous, classify and add comment before branching; if CI fails, do not merge |
| **Next action** | Strip "Cody," "AINative," and MCP-endpoint references; replace with generic "agent" and "issue tracker API" |
| **What to strip** | "Cody" agent name; "AINative Studio" IDE references; MCP endpoint URL; "mvp-feature" label names (keep as examples, not mandates) |
| **Notes** | The PR process sub-section (§1 lines 5–7) also contains the "deliver-ready" issue state transition — keep as optional step |

---

### SOP 2: TDD Red-Green-Refactor Protocol

| Field | Content |
|-------|---------|
| **Source file** | `canonical-rules.md` §4; `agent-reasoning-planning-execution.md` §3 |
| **Trigger / When to use** | Whenever writing a new function, endpoint, or feature; mandatory before implementation |
| **Steps / Contract** | 1. **Red**: Write minimal failing test asserting core behavior (Jest/pytest). 2. **Green**: Implement minimal code until tests pass. 3. **Refactor**: Extract duplication, improve readability, commit as `refactor/{issue}`. 4. For cross-service work: add integration test with env-var placeholders. 5. Coverage ≥ 90% for new code. |
| **Quality bar** | Test exists and fails before implementation; test passes after; coverage threshold met; test file mirrors module name |
| **Escalation path** | If test cannot be written (external dep): add mock/stub and document what needs filling |
| **Next action** | Genericise framework references (Jest/pytest are fine as examples); remove HyperScaler SDK call examples |
| **What to strip** | HyperScaler SDK mock examples; AINative CI references; single-file function constraint (MVP-specific) |
| **Notes** | Test directory structure (`/tests/unit`, `/integration`, `/functional`) is a strong portable convention |

---

### SOP 3: Chain-of-Thought Before Code

| Field | Content |
|-------|---------|
| **Source file** | `canonical-rules.md` §3; `agent-reasoning-planning-execution.md` §2 |
| **Trigger / When to use** | Before writing any nontrivial code (functions, data models, API design) |
| **Steps / Contract** | 1. Clarify ambiguous requirements. 2. Weigh alternatives (library vs. custom, storage patterns). 3. Consider edge cases (validation, security, performance). 4. Conclude with chosen implementation plan. Emit as numbered narrative. |
| **Quality bar** | Reasoning is explicit and numbered; at least one edge case identified; conclusion states chosen approach |
| **Escalation path** | If requirements are ambiguous after step 1, surface to user before proceeding |
| **Next action** | Port as-is with minimal change; remove HyperScaler-specific examples but keep the pattern |
| **What to strip** | HyperScaler API invocation examples; "Cody" as the named reasoner |
| **Notes** | Sub-patterns (data model reasoning, implementation option comparison, retry/backoff reasoning) are each individually portable |

---

### SOP 4: Self-Validation & Fail-Safe

| Field | Content |
|-------|---------|
| **Source file** | `canonical-rules.md` §8 (sourced exclusively from `meta-rules.md`) |
| **Trigger / When to use** | After completing each task/step |
| **Steps / Contract** | 1. Did I follow the specified format? 2. Did I include required reasoning? 3. Are file names, placeholders, and notification calls correct? If any rule fails: explicitly state which rule failed, why, and what information is needed. |
| **Quality bar** | All three self-audit questions answered; any failure is surfaced with rule ID and missing info |
| **Escalation path** | Missing context → explicit statement to caller; do not silently skip |
| **Next action** | Port verbatim with minor rewording; this is already very clean |
| **What to strip** | "MCP messages" → generic "notification/callback" |
| **Notes** | This is the only §8 in the repo; it did not exist in `globalrules.md`. Highest-value protocol primitive. |

---

### SOP 5: PR Completeness Checklist

| Field | Content |
|-------|---------|
| **Source file** | `canonical-rules.md` §1 (PR process), `globalrules.md` §6 |
| **Trigger / When to use** | Before opening or merging a pull request |
| **Steps / Contract** | PR must include: (1) purpose statement, (2) linked issue number, (3) testing steps, (4) lint/static analysis results, (5) security scan results, (6) documentation update confirmation. Agent auto-reviews code style and flags missing tests via comments. |
| **Quality bar** | All checklist items present; automated checks pass; one approving review required |
| **Escalation path** | Failed check → block merge; notify author |
| **Next action** | Strip "Cody" auto-review; keep checklist items; generalise CI tool references |
| **What to strip** | AINative CI agent auto-review; MCP comment posting calls; "deliver-ready" AINative-specific state name |
| **Notes** | The WIP commit convention (`WIP:` prefix) is a separate portable micro-pattern worth capturing |

---

### SOP 6: CI/CD Pipeline Skeleton

| Field | Content |
|-------|---------|
| **Source file** | `canonical-rules.md` §6; `agent-reasoning-planning-execution.md` §5; `templates/claude-code/.claude/commands/` |
| **Trigger / When to use** | When setting up or updating a CI/CD pipeline for a project |
| **Steps / Contract** | 1. Checkout. 2. Install deps. 3. Run unit tests. 4. Deploy to target environment. 5. Run smoke test. Branch protection: `main`+`develop` protected, CI required, 1 approver. Canary pattern: deploy → wait 30s → probe 5× → shift 25% traffic or revert. |
| **Quality bar** | `fail-fast: true`; secrets via env vars only; lint annotated in PR checks |
| **Escalation path** | Failed deploy → pipeline stops; previous stable version logged for manual revert |
| **Next action** | Abstract cloud-vendor steps behind generic `deploy-to-env` placeholder; keep canary pattern |
| **What to strip** | AWS Lambda/Azure/GCP-specific CLI commands (keep as examples in notes); `${{ secrets.HYPERSCALER_ACCESS_KEY }}` → generic `${{ secrets.DEPLOY_KEY }}` |
| **Notes** | `templates/claude-code/.claude/commands/tdd.md`, `pr.md`, `review.md` are slash-command implementations of these workflows — worth noting as reference implementations |

---

### SOP 7: Rollback & Monitoring Protocol

| Field | Content |
|-------|---------|
| **Source file** | `canonical-rules.md` §7; `agent-reasoning-planning-execution.md` §6 |
| **Trigger / When to use** | Post-deploy health check failure; production incident; scheduled monitoring |
| **Steps / Contract** | Rollback: read `stable_version.json` → invoke platform rollback API → post notification. Monitor: poll endpoint every 60s → on non-200/timeout: POST alert webhook with `{status, timestamp}` → append to `monitor.log` → send failure notification. Metrics: fetch metrics → calculate error rate → schedule via cron → set alert thresholds. |
| **Quality bar** | `stable_version.json` always present and updated on successful deploy; monitor runs continuously; alert webhook tested |
| **Escalation path** | Rollback failure → explicit error message; do not silently continue |
| **Next action** | Replace AWS Lambda alias update with generic `invoke-rollback-api` placeholder; keep contract shape |
| **What to strip** | `aws lambda update-alias` specific command; `http://localhost:8000/mcp` MCP endpoint; `aws cloudwatch` specific metrics commands |
| **Notes** | The `stable_version.json` versioned-state pattern is a reusable protocol primitive |

---

### SOP 8: Agent Persona Invocation Contract (Meta-Pattern)

| Field | Content |
|-------|---------|
| **Source file** | `Agent-Personas.md` (invocation best practices section) |
| **Trigger / When to use** | When routing a task to a specialized sub-agent |
| **Steps / Contract** | Contract shape: `subagent_type`, `description`, `thoroughness` (quick/medium/very thorough), `prompt` (structured with requirements, process, deliverables). Collaboration patterns: Sequential (plan→implement→review), Parallel (security+UX+QA simultaneously), Iterative (implement→review→refine). |
| **Quality bar** | Invocation includes type, description, and structured prompt; expected output is specified |
| **Escalation path** | If subagent type unavailable: fall back to orchestrator |
| **Next action** | Port the invocation contract *shape* and the three collaboration patterns; do NOT port individual persona definitions (they are role theater) |
| **What to strip** | All 22 individual persona definitions as role descriptions; "AINative Studio" context; "Primary Orchestrator Agent" branding |
| **Notes** | The `thoroughness` levels (quick/medium/very thorough) are a useful parameterisation worth preserving |

---

### SOP 9: Project Bootstrap Template

| Field | Content |
|-------|---------|
| **Source file** | `templates/claude-code/`, `docs/LLM_PROJECT_SETUP_PROMPT.md`, `strict-rules-how-to.md` |
| **Trigger / When to use** | When initialising a new project for agent-assisted development |
| **Steps / Contract** | 1. Copy env template with `{{PLACEHOLDER}}` syntax. 2. Populate CLAUDE.md (or equivalent) with: project name, tech stack, architecture notes, critical files. 3. Set permissions template (allow/deny/ask). 4. Install MCP servers. 5. Place critical rules at TOP of CLAUDE.md. 6. Run verification. |
| **Quality bar** | No secrets in committed files; all placeholders replaced; permissions scoped to project needs |
| **Escalation path** | Missing credentials → explicit list of what is needed |
| **Next action** | Generalise to non-Claude tooling; keep `{{PLACEHOLDER}}` convention; strip ZeroDB/AINative MCP server references |
| **What to strip** | ZeroDB, Strapi, AINative-specific MCP server configs; `ZERODB_PROJECT_ID` placeholder; AINative dashboard references |
| **Notes** | `strict-rules-how-to.md` contains the key insight: rules in CLAUDE.md > rules in .claude/rules/ (visibility guarantee) |

---

### SOP 10: Meta-Rule — Critical Rules Placement

| Field | Content |
|-------|---------|
| **Source file** | `strict-rules-how-to.md` |
| **Trigger / When to use** | When authoring agent rules or SOPs for deployment in `.agents` config |
| **Steps / Contract** | 1. Put critical rules at TOP of agent context file (CLAUDE.md or equivalent). 2. Include content directly (not by reference). 3. Use tables + bold for scannability. 4. Include explicit "Forbidden:" list. 5. Duplicate critical rules from rules/ directory into context file top. |
| **Quality bar** | Critical rules visible in first context window; no critical rule requires a secondary file load to be effective |
| **Escalation path** | N/A (authoring SOP) |
| **Next action** | Port verbatim; this is already generic |
| **What to strip** | "Claude" specific references → "agent context file" |
| **Notes** | This is the most meta-portable SOP in the repo — it governs how all other SOPs should be deployed |

---

### SOP 11: Sprint Planning & Estimation

| Field | Content |
|-------|---------|
| **Source file** | `canonical-rules.md` §2; `agent-reasoning-planning-execution.md` §1 |
| **Trigger / When to use** | When starting a new feature, epic, or sprint; before multi-week planning |
| **Steps / Contract** | 1. Generate 4-week MVP roadmap as markdown table (Week / Goal / Deliverables / Dependencies). 2. Break weeks into sprints with epics, user stories, estimates. 3. Produce dependency graph (Graphviz DOT). 4. Compile release checklist (features, tests, security, CI/CD, docs). 5. Risk assessment: ≥3 risks, Likelihood (H/M/L), mitigation steps. |
| **Quality bar** | Roadmap table complete; at least 3 risks identified; DOT graph output-only (no prose); release checklist uses `- [ ]` format |
| **Escalation path** | If stories have >5 Fibonacci points: split before estimation |
| **Next action** | Strip HyperScaler API dependency examples; keep estimation scales (Fibonacci for full, T-shirt for MVP) |
| **What to strip** | HyperScaler-specific deliverables; "AINative agent flow" as example story type |
| **Notes** | Fibonacci scale table (0→trivial, 1→clear, 2→simple API, 3/5/8→complex/split) is a clean portable artifact |

---

## Cross-Cutting Protocol Primitives

These are sub-SOP patterns — smaller than full skills — that recur across the repo and should be extracted as primitives:

| Primitive | Description | Source |
|-----------|-------------|--------|
| **WIP Commit Convention** | `WIP:` prefix commits = context snapshots; agent posts progress via notification channel | `canonical-rules.md` §1; `globalrules.md` §5 |
| **User-Decision Routing** | When two implementation options exist: compare on security/integration/compatibility → conclude with explicit recommendation | `canonical-rules.md` §3; `agent-reasoning-planning-execution.md` §2.3 |
| **Completeness Check (Issue Closure)** | After merge: run integration tests → if pass: close issue + log commit hash; if fail: do not close | `canonical-rules.md` §1 (Issue closure) |
| **Test-Failure Triage** | Failed test in CI → block merge → do not close issue → surface failure with context | `canonical-rules.md` §1, §4 |
| **Config Discovery / Placeholder Convention** | All configurable values use `{{PLACEHOLDER}}` syntax; never commit secrets; user-specific credentials in separate file | `docs/LLM_PROJECT_SETUP_PROMPT.md`; `templates/claude-code/env.example` |
| **Stable Version State File** | `stable_version.json` with `{ "version": "x" }` pattern enables rollback without pipeline state | `canonical-rules.md` §7 |
| **Alert Threshold Protocol** | Error rate > threshold → POST to webhook with `{status, timestamp}` + append to log | `canonical-rules.md` §7; `agent-reasoning-planning-execution.md` §6 |
| **Generated-Doc Freshness** | On merge: update documentation (OpenAPI spec, README) as part of PR checklist; stale docs block delivery | `globalrules.md` §6 (PR requirements) |
| **Repo Ownership / Branch Protection** | `main` + `develop` protected; PRs require passing CI + 1 approver; failures notify via channel | `canonical-rules.md` §6 |
| **Retry/Backoff Strategy** | External API calls must include: error type enumeration → retry/backoff strategy → utility function | `canonical-rules.md` §3; `agent-reasoning-planning-execution.md` §2.5 |
| **MVP vs Full Mode Switch** | Same workflow with two parameter sets: T-shirt sizes / `mvp-*` labels / single-file functions (MVP) vs Fibonacci / `feature/bug/chore` / modular (Full) | `MVP-GlobalRules.md` vs `canonical-rules.md` |

---

## Recommendation: What Should Ship by Default in `.agents`

**Tier 1 — Ship immediately (high portability, low coupling):**
1. **Self-Validation & Fail-Safe** (SOP 4) — pure protocol primitive, no vendor coupling
2. **Chain-of-Thought Before Code** (SOP 3) — universal agent behavior rule
3. **Meta-Rule: Critical Rules Placement** (SOP 10) — governs how all other SOPs are deployed
4. **TDD Red-Green-Refactor Protocol** (SOP 2) — strip HyperScaler examples; core TDD loop is universal
5. **WIP Commit Convention** (primitive) — trivial to implement, high value for agent context

**Tier 2 — Ship with light rewriting (thin vendor layer):**
6. **Backlog-to-Branch Workflow** (SOP 1) — strip MCP endpoint + "Cody"; replace with generic "issue tracker"
7. **PR Completeness Checklist** (SOP 5) — strip AINative CI; checklist items are universal
8. **Agent Persona Invocation Contract shape** (SOP 8) — port contract meta-pattern, not persona definitions
9. **Config Discovery / Placeholder Convention** (primitive) — strip AINative services

**Tier 3 — Ship as reference/template (requires project-specific fill-in):**
10. **CI/CD Pipeline Skeleton** (SOP 6) — abstract deploy step; keep canary pattern
11. **Rollback & Monitoring Protocol** (SOP 7) — abstract cloud API calls; keep contract shape
12. **Sprint Planning & Estimation** (SOP 11) — strip HyperScaler deliverables; keep Fibonacci/roadmap structure
13. **Project Bootstrap Template** (SOP 9) — strip ZeroDB; keep `{{PLACEHOLDER}}` system

**Do not ship:**
- Individual agent persona role definitions
- HyperScaler-specific deploy/infra commands
- ZeroDB / Strapi / AINative MCP server configs
- Tombstoned files (`globalrules.md`, `meta-rules.md` — use `canonical-rules.md` instead)

---

## Evidence

Specific file/line citations for major claims:

1. **Tombstone pattern** — `globalrules.md` line 1–6: `⚠️ SUPERSEDED — DO NOT EDIT / merged into canonical-rules.md / Tombstoned: 2026-03-27`; `meta-rules.md` lines 1–6: same header
2. **Canonical merge** — `canonical-rules.md` header: `"Merged: 2026-03-27. Sections §1–§7 reconciled from both sources; §8 sourced exclusively from meta-rules.md"`
3. **Portability claim** — `README.md` §Purpose: "these rules can be reused or adapted in any popular IDE that supports agentic assistants"
4. **AINative/Cody coupling** — `globalrules.md` intro: "These coding standards guide our XP-oriented development team at AINative Studio ... All development workflows are orchestrated by Cody"
5. **Self-validation uniqueness** — `canonical-rules.md` §8 note: `"Source: meta-rules.md §8 — unique to that file; not present in globalrules.md"`
6. **Coverage threshold** — `canonical-rules.md` §4: "Coverage ≥ 90% required for new code. CI runs all tests on every push/PR."
7. **Branch naming convention** — `canonical-rules.md` §1 table: `feature/{issue-number}-{short-slug}`, `bugfix/...`, `chore/...`
8. **Canary deployment specifics** — `canonical-rules.md` §6: "deploy new function version to canary alias → wait 30s → hit endpoint 5× → shift 25% traffic or revert"
9. **Placeholder convention** — `CLAUDE.md` security section: "All templates must use `{{PLACEHOLDER}}` syntax for configurable values"
10. **Rule visibility principle** — `strict-rules-how-to.md`: "Rules in .claude/rules/ require me to remember to check them / Rules in CLAUDE.md are unavoidable — I see them every session"
11. **Agent persona count** — `Agent-Personas.md` overview: "Total Agents: 22" (header), but ToC lists 25 — discrepancy in the source file itself
12. **MVP vs Full mode** — `MVP-GlobalRules.md` uses T-shirt sizes (S/M/L) and `mvp-feature`/`mvp-bug`/`mvp-chore` labels; `canonical-rules.md` §1 uses both modes with Fibonacci for full
13. **Stable version pattern** — `canonical-rules.md` §7: "Reads stable_version.json containing `{ "version": "<x>" }`" as rollback source of truth
14. **Test directory structure** — `canonical-rules.md` §4: `/tests/unit` (Jest/pytest), `/tests/integration` (in-memory DBs), `/tests/functional` (SuperTest/requests)
15. **LLM_PROJECT_SETUP_PROMPT portability** — `docs/LLM_PROJECT_SETUP_PROMPT.md` table: "This system works with any LLM that has filesystem access" — lists Claude Code, Gemini CLI, Aider, Continue

---

## Source-to-Portable Split Summary

| Category | Count | Disposition |
|----------|-------|-------------|
| Fully portable SOPs (Tier 1) | 5 | Ship with minimal rewriting |
| Portable with light rewriting (Tier 2) | 4 | Strip vendor/persona coupling |
| Reference templates (Tier 3) | 4 | Require project-specific fill-in |
| Cross-cutting protocol primitives | 11 | Extract as micro-patterns |
| Non-portable (vendor/persona/tool-specific) | ~8 | Leave in source repo |

**Dominant strip pattern**: Replace "Cody" → "agent"; "AINative Studio" → "IDE"; "MCP endpoint localhost:8000" → "notification/callback API"; "HyperScaler" → "target platform"; "ZeroDB/Strapi" → remove or genericise.

**Dominant retain pattern**: Workflow step sequences, numbered reasoning mandates, threshold values (90% coverage, 25% canary traffic, 60s poll interval, 5 probes), file/directory naming conventions, the `{{PLACEHOLDER}}` template system, and the self-validation loop.
