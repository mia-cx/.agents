# Audit: agentic-rules
**Date**: 2026-03-28
**Source repo**: `.references/agentic-rules/`
**Auditor**: role-to-sop pipeline, pass 1

---

## 1. Repo Overview

`agentic-rules` was authored by AINative Studio to define the operational rules, prompts, and agent persona ("Cody") powering their internal AI-assisted development platform. The repo encodes a full software-delivery lifecycle — GitHub Issues → branch → TDD → PR → CI/CD → canary deploy → rollback/monitoring — as machine-readable rules for Claude Code. It also ships template scaffolding (CLAUDE.md, `claude.json`, permissions JSON, slash-command `.md` files) intended to be cloned into new projects. Two of its four primary rule files (`globalrules.md`, `meta-rules.md`) are tombstoned as of 2026-03-27 and merged into `canonical-rules.md`. A parallel file (`MVP-GlobalRules.md`) covers the same lifecycle at MVP/sprint velocity. The repo is not published as a general-purpose skill library; it is an internal configuration artefact that incidentally encodes portable procedural patterns.

---

## 2. Content Summary

The repo contains four rule files, two prompt libraries, one agent-persona catalogue, and a `templates/` tree of fill-in-the-blanks scaffold files. The rule files are flat Markdown with no frontmatter; they share a consistent eight-section structure (backlog → planning → CoT reasoning → TDD → refactoring → CI/CD → rollback/monitoring → self-validation). Prompt libraries are blockquoted strings grouped into five workflow phases. The agent catalogue lists 25 specialist roles with per-role "When to Invoke" logic and three collaboration patterns (sequential, parallel, iterative). Templates use `{{MUSTACHE_STYLE}}` placeholder tokens throughout and carry no executable logic until instantiated. There is no shared frontmatter schema, no inter-file cross-references within the rules tree, and no trigger-condition metadata — those fields exist only in the audit findings layer, not in the source files themselves.

---

## 3. SOP Split

### Port

| SOP | Short description | Reason to port |
|-----|-------------------|----------------|
| `strict-rules-how-to` | Pattern for embedding critical rules at the top of CLAUDE.md so they survive context compression | Fully portable, no vendor coupling, non-obvious mechanism worth preserving |
| CoT reasoning gate (§3 of `canonical-rules.md`) | 4-step numbered narrative before any nontrivial code: clarify → alternatives → edge cases → chosen plan | Agenda-agnostic, reinforces existing `cot-gate` skill with additional steps |
| Self-validation close-out (§8 of `canonical-rules.md` / `meta-rules.md`) | 3-question post-task audit + fail-safe declaration format | Universal close-out protocol, no platform coupling |
| MVP sprint workflow (`MVP-GlobalRules.md` core) | Issue selection → branch naming → TDD loop → PR → deploy → smoke test for short-lived feature branches | Durable XP/GitFlow pattern; T-shirt sizing and single-smoke-test rule are immediately reusable |
| Role-selection + collaboration patterns (`Agent-Personas.md`) | Match task type → agent specialisation; sequential / parallel / iterative orchestration patterns; "Proactive Use" trigger rules | Role taxonomy and collaboration patterns are framework-agnostic and have no existing skill counterpart |
| PR review checklist (`templates/.claude/commands/review.md`) | Language-agnostic 7-section checklist (Functionality, Quality, Testing, Security, Performance, Documentation, Style) | Zero vendor coupling; can embed inside existing `pr-review` skill |
| 3-tier permissions model (`settings.local.json.example`) | Structural allow/ask/deny permission categories for Claude Code tool use | The *category model* (safe read-only → allow; destructive → deny; elevated → ask) is portable even if the specific tool list is not |

### Leave out

| SOP | Short description | Reason to exclude |
|-----|-------------------|-------------------|
| `globalrules.md` (full file) | Superseded full-lifecycle ruleset | Tombstoned 2026-03-27; content reconciled into `canonical-rules.md`; the LLM-prompt sub-blocks are Cody roleplay scaffolding with zero portable value |
| `meta-rules.md` (full file) | Superseded eight-section ruleset | Tombstoned 2026-03-27 into `canonical-rules.md`; extract §8 Self-Validation verbatim from this file only if `canonical-rules.md` text diverges |
| CI/CD YAML + Terraform generation (§6 of `canonical-rules.md`) | GitHub Actions pipeline YAML and Terraform serverless snippets | Implementation recipe, not an abstract SOP; AWS/Azure/GCP specifics are not strippable without hollowing out the content; overlaps `setup-ci` |
| Rollback + monitoring scripts (§7 of `canonical-rules.md`, `Agentic-Prompts-Library.md` Phase 5) | `rollback.sh` and `monitor.py` templates | Hardcoded to AWS Lambda CLI and CloudWatch; too vendor-specific to promote without a concrete target platform |
| `claude.json.template` | MCP server wiring template | Ties entirely to ZeroDB + Strapi + AINative endpoints; zero SOP content |
| `settings.json.template` | Single-key JSON (`alwaysThinkingEnabled: true`) | No behavioural logic; not a candidate for promotion |
| `agent.md.template` / `command.md.template` | Blank mustache scaffolds | No executable logic until instantiated; structural reference only |
| CLAUDE.md.template content (fill-in slots) | Per-project CLAUDE.md scaffolding | All content is placeholder tokens; structural form is portable but the file itself is not |
| `docs/LLM_PROJECT_SETUP_PROMPT.md` | Centralized LLM-config template system | ZeroDB/AINative env vars and workspace-specific paths make it non-generic without deep surgery |
| `templates/claude-code/.claude/commands/pr.md` | PR slash-command pre-checklist | Weaker than existing `pr-file` skill; adds no incremental value |
| `templates/claude-code/.claude/commands/tdd.md` | TDD slash-command | Coverage gate is 80% vs. 90% in workspace `tdd` skill; workspace version is more rigorous and wins the cross-repo comparison |
| `merged-permissions.json` | Broad allow-list with `Bash(bash:*)` and `chmod` | Unusually permissive; the three-tier model in `settings.local.json.example` is the portable distillation |

---

## 4. Per-SOP Table

| Field | **strict-rules-how-to** | **CoT reasoning gate** | **Self-validation close-out** | **MVP sprint workflow** | **Role-selection + collaboration patterns** | **PR review checklist** | **3-tier permissions model** |
|---|---|---|---|---|---|---|---|
| **Source file** | `.references/agentic-rules/strict-rules-how-to.md` | `.references/agentic-rules/canonical-rules.md` §3 | `.references/agentic-rules/canonical-rules.md` §8 (canonical); `.references/agentic-rules/meta-rules.md` §8 (original source) | `.references/agentic-rules/MVP-GlobalRules.md` | `.references/agentic-rules/Agent-Personas.md` | `.references/agentic-rules/templates/claude-code/.claude/commands/review.md` | `.references/agentic-rules/templates/claude-code/.claude/settings.local.json.example` |
| **Trigger** | When setting up or hardening a Claude Code project to ensure critical rules survive context compression | Before writing any nontrivial code, data model, option comparison, performance optimisation, or external API call | After completing every task | When running a short-lived MVP sprint translating GitHub issues into working prototypes | When bootstrapping a multi-agent system needing role boundaries, handoff triggers, and orchestration patterns | Any code review or PR review pass | When bootstrapping a Claude Code project needing tool-permission guardrails |
| **Steps/contract** | (1) Add "CRITICAL RULES — READ FIRST" section at CLAUDE.md top. (2) Put rule content inline, not as a file reference. (3) Use tables and bold for scannability. (4) Add explicit "Forbidden:" list. (5) Mirror rules from rules directory into CLAUDE.md top. | (1) Clarify requirements. (2) Weigh alternatives. (3) Consider edge cases, performance, security. (4) State chosen plan — then write code. | (1) Is output format correct? (2) Is required reasoning present? (3) Are filenames/placeholders correct? If a rule cannot execute: state which rule, why it failed, and what information is missing. | (1) Select smallest open issue. (2) Name branch `feature/mvp-{issue}-{slug}` (lifetime < 48 h). (3) WIP red commit → minimal green → refactor. (4) Open PR titled "MVP: …" with linked issue, test steps, deployed URL. (5) CI runs unit tests + optional smoke test; failures block merge. (6) Deploy; run single HTTP-status smoke test; close issue. (7) T-shirt sizing: S < 1 h, M 1–3 h, L > 3 h. | (1) Match task type to role via When-to-Invoke table. (2) Select collaboration pattern: sequential (Plan→Implement→Security→Docs), parallel (Security+UX+QA simultaneously post-implementation), or iterative (Implement→Review→Fix→Retest). (3) Auto-invoke proactively-marked agents after relevant work without explicit request. (4) Critical exception: do not use TDD Developer for review of recently written code. | Evaluate against 7 sections: Functionality (purpose, edge cases, error handling), Code Quality (readability, DRY, single responsibility), Testing (existence, edge coverage, maintainability), Security (no secrets, input validation, injection, auth), Performance (no obvious issues, query optimisation, memory leaks), Documentation (comments on complex logic, public API docs, README), Style (project conventions, naming, lint). | Categorize every tool permission into: allow (safe read-only, deterministic ops), deny (destructive or irreversible), or ask (elevated privilege, external state mutation). |
| **Quality bar** | CLAUDE.md top section must be inline, not a reference. "Forbidden" list must be present. | Numbered narrative must appear before code output, not after. All four steps must be present. | All three questions must be answered. Fail-safe declaration must name the specific rule that blocked. | Single smoke test per feature (not a full suite). CI failures block merge. No uncommitted changes at end of day. Branch lifetime ≤ 48 h. | Collaboration pattern must be selected, not defaulted. Proactively-marked roles invoke without explicit request. | All 7 sections must be checked. No partial review acceptable. | All three tiers must be populated. Catch-all permissive rules (e.g. `Bash(bash:*)`) must be avoided. |
| **Escalation** | None specified | None specified | If a rule cannot execute: state which rule, why, and what is needed — do not silently skip | On CI failure: block merge; on smoke test failure: record prior function ARN/URL in PR comment for manual revert | None specified (implicit: escalate to orchestrator on ambiguous role assignment) | None specified | Destructive or irreversible operations escalate to "ask" tier minimum |
| **Strip** | File path references to `.claude/rules/` → abstract to "rules directory" | HyperScaler/MCP/AINative branding; "Cody" persona name | "Cody" persona name in any fail-safe declarations | "Cody" persona; "AINative Studio"; "HyperScaler" (→ `<cloud-provider>` or "serverless platform"); embedded LLM-prompt blocks; MCP as proprietary layer | `Task(subagent_type="…")` invocation syntax; 25 persona names as a fixed canonical list; version/date metadata; "Maintained By: Primary Orchestrator Agent"; blog-feature example prompts | Nothing — no repo-specific references exist | `{{PROJECT_PATH}}` and `{{HOME_PATH}}` placeholders; zerodb MCP entries; specific github MCP tool list |
| **Notes** | Compact, high-signal. The mechanism (CLAUDE.md is re-read after context compression; rules files are not) is non-obvious and worth preserving verbatim. | Maps directly to existing `cot-gate` skill; the 7-step variant in `Enhanced-Agentic-Prompts-Library.md` adds "choose SDK/method" and "testing approach" steps worth absorbing. | §8 first appeared in `meta-rules.md`; `canonical-rules.md` is the reconciled version. Fail-safe declaration format ("state which rule, why, request missing info") is a distinct addition not present in most self-validation patterns. | LLM-prompt blocks in source file are Cody roleplay and carry no portable value — discard. The portable core is: MVP Workflow Steps, T-shirt sizing heuristics, single-smoke-test rule, single-file handler coding style. | The "Proactive Use" field encodes an implicit auto-trigger rule that should become an explicit routing SOP. The collaboration-pattern section is the highest-value extract. The 25-role taxonomy is a starting scaffold, not a mandate. | Overlaps `pr-review` skill which orchestrates parallel sub-agents; this checklist is the evaluation rubric, not the orchestration. Best reuse: embed inside `pr-review` as its scoring template. | The portable SOP is the category model, not a hard-coded tool list. Document categories as policy; let each project populate the specific tool names. |

---

## 5. Portability Ranking

### High — port as-is with minimal stripping

- **`strict-rules-how-to.md`** — Zero vendor coupling. The CLAUDE.md top-section pattern is actionable verbatim. Only mechanical edit needed: abstract `.claude/rules/` path.
- **Self-validation close-out** (`canonical-rules.md` §8) — Universally applicable post-task audit. No platform references. Fail-safe declaration format is immediately reusable.
- **PR review checklist** (`templates/.claude/commands/review.md`) — Language- and framework-agnostic. No substitutions required.

### Medium — port after stripping persona/platform names

- **CoT reasoning gate** (`canonical-rules.md` §3) — The 4-step structure is solid; remove "Cody", "AINative Studio", "HyperScaler". Consider absorbing the 7-step variant's "choose SDK/method" and "testing approach" additions.
- **MVP sprint workflow** (`MVP-GlobalRules.md`) — Core workflow (issue → branch → TDD loop → PR → deploy) is clean XP/GitFlow. Strip persona + proprietary cloud. T-shirt sizing and single-smoke-test heuristics transfer directly.
- **3-tier permissions model** (`settings.local.json.example`) — The allow/ask/deny category logic is portable; only the specific tool lists need per-project substitution.

### Partial — extract sub-components only

- **Role-selection + collaboration patterns** (`Agent-Personas.md`) — Extract: (a) the sequential/parallel/iterative collaboration pattern SOP, (b) the "Proactive Use" auto-trigger encoding. Discard: the 25 fixed persona names as canonical, the `Task(subagent_type="…")` invocation syntax.
- **`canonical-rules.md`** (full file) — The file is the reconciled source of truth for the backlog/planning/TDD/refactoring sections. §3 and §8 port at High; §4 TDD ports as a complement to the existing `tdd` skill; §5 refactoring heuristics port as atomic rules. §6–§7 (CI/CD, rollback) are vendor-specific implementation recipes — extract only the canary-deploy pattern (deploy → wait 30 s → probe 5× → shift 25% or revert) as a generic template.
- **`Agentic-Prompts-Library.md`** — Phase 2 (TDD scaffolding) and Phase 3 (refactoring) overlap existing skills and deduplicate. Phase 5 (rollback/monitoring) has no counterpart but is too AWS-specific to promote without a target platform. Extract Phase 1 (backlog triage prompt templates) as illustrative prompt snippets, not a SOP.
- **`Enhanced-Agentic-Prompts-Library.md`** — The 7-step CoT variant extends the canonical 4-step version with "choose SDK/method" and "testing approach"; absorb those two steps into the CoT gate SOP. The planning sequence is a template catalogue, not a SOP.

---

## 6. Cross-Cutting Protocol Primitives

These patterns appear in three or more source files and are smaller than a full skill:

| Primitive | Appears in | Form |
|-----------|-----------|------|
| **4-step CoT narrative** (clarify → weigh alternatives → edge cases → chosen plan) | `canonical-rules.md` §3, `meta-rules.md` §3, `agent-reasoning-planning-execution.md` §2, `Enhanced-Agentic-Prompts-Library.md` §2 | Numbered prose block; always precedes code output |
| **3-question self-validation** (format? reasoning? filenames?) + fail-safe declaration | `canonical-rules.md` §8, `meta-rules.md` §8, `agent-reasoning-planning-execution.md` Enforcement block | Bulleted checklist + conditional block quote |
| **Branch naming convention** (`feature\|bugfix\|chore/{issue}-{slug}`) | `canonical-rules.md` §1, `globalrules.md` §2, `MVP-GlobalRules.md` §2 | Table row; always paired with branch-lifetime constraint |
| **Canary deploy pattern** (deploy → wait 30 s → probe 5× → shift 25% traffic or revert) | `canonical-rules.md` §6, `agent-reasoning-planning-execution.md` §5, `Agentic-Prompts-Library.md` Phase 4 | YAML job block; parameters (30 s, 5 probes, 25%) are consistent across all three |
| **Single-smoke-test rule** (one HTTP-status check per feature, not a full suite) | `MVP-GlobalRules.md` §5, `canonical-rules.md` §6 | Prose bullet; always paired with "CI failure blocks merge" |
| **Fibonacci / T-shirt sizing** (S < 1 h, M 1–3 h, L > 3 h; Fibonacci 0/1/2/3/5/8; split stories > 5 points) | `canonical-rules.md` §2, `globalrules.md` §6, `MVP-GlobalRules.md` §6 | Table row; sizing tied to "split if too large" enforcement |
| **WIP commit discipline** (prefix `WIP:`, commit every 30–60 min, no uncommitted changes at day end) | `MVP-GlobalRules.md` §8, `canonical-rules.md` §1, `globalrules.md` §10 | Bullet list; always paired with branch-lifetime constraint |
| **`{{MUSTACHE}}` placeholder convention** | `CLAUDE.md.template`, `claude.json.template`, `command.md.template`, `LLM_PROJECT_SETUP_PROMPT.md` | Template token format; `{{UPPER_SNAKE_CASE}}` for config values |
| **Coverage gate** | `canonical-rules.md` §4 (≥ 90%), `tdd.md` slash-command (80%) | Percentage threshold inline with TDD red-green steps; note: the two files disagree — canonical sets 90% |
| **Proactive agent invocation** | `Agent-Personas.md` per-role "Proactive Use" field (Frontend, Backend, Security, QA, DevOps, SRE, Tech Docs, UX, Scrum PM, DX) | Boolean flag per agent role; triggers automatic invocation after relevant work without explicit request |

---

## 7. Default Recommendation

**Ship three items by default in `.agents`:**

1. **`strict-rules-how-to` → promote to a skill** (`skills/claude-project-setup/SKILL.md` or inline into a broader "Claude Code workspace bootstrap" skill). The CLAUDE.md top-section pattern is immediately actionable with a single path abstraction edit and zero other changes. This is the lowest-effort, highest-impact extraction.

2. **Self-validation close-out → merge into `self-validation` skill** at `/Users/mia/.agents/skills/self-validation/SKILL.md`. The fail-safe declaration format (state which rule failed, why, and what is missing) is additive to whatever the current skill contains. The 3-question checklist should be cross-checked against the existing text; absorb any delta.

3. **Role-selection + collaboration patterns → new skill** (`skills/multi-agent-orchestration/SKILL.md`). The sequential/parallel/iterative pattern SOP and the "Proactive Use" auto-trigger encoding have no existing counterpart in this workspace. This is the most novel extraction. Ship the pattern logic; strip the 25 fixed persona names (treat as illustrative).

**Do not ship by default:**
- CI/CD YAML generation, rollback scripts, monitoring scripts — too vendor-coupled without a target platform declaration.
- The full `canonical-rules.md` — its §3 and §8 port into existing skills; its §4 TDD section overlaps the `tdd` skill; nothing else is net-new.
- Any template files — structural scaffolding only, not skills.

---

## 8. Structural Patterns

### Frontmatter
None. Zero source files use YAML/TOML frontmatter. Triggers, strips, and quality bars exist only in the audit findings layer. This is a gap: any skill extracted from this repo must add frontmatter from scratch.

### Naming conventions
- Rule files: lowercase kebab-case (e.g. `strict-rules-how-to.md`, `canonical-rules.md`, `meta-rules.md`)
- Template files: `<name>.template` suffix with PascalCase base where the target filename uses PascalCase (e.g. `CLAUDE.md.template`)
- Slash-command files: lowercase slugs matching the `/command` name (e.g. `pr.md`, `review.md`, `tdd.md`)
- Placeholder tokens: `{{UPPER_SNAKE_CASE}}` throughout all templates — consistent and machine-parseable

### Section structure
All rule files share a de facto eight-section schema (Backlog → Planning → Reasoning → Coding/TDD → Refactoring → CI/CD → Rollback/Monitoring → Self-Validation) even though it is never declared as a schema. This implicit structure is worth making explicit if any of these files are promoted to skills with frontmatter.

### Cross-file references
Minimal. The only inter-file reference is the tombstone banner in `globalrules.md` and `meta-rules.md` pointing to `canonical-rules.md` as their superseding document. No skill loads another skill; no rule references a template. The `canonical-rules.md` file documents its source files in a banner note but does not import from them.

### Tombstone pattern
Two files carry a visible tombstone banner declaring the file superseded and the replacement file. This is a strong housekeeping practice worth adopting: mark deprecated skill files rather than deleting them, so audit trails remain intact.

### Prompt blocks
Rules files embed "LLM Prompts" sub-blocks as block-quoted prose adjacent to each workflow section. These are illustrative invocations of "Cody" and carry no portable procedure — they are the primary noise source to strip before promotion.

### Template placeholder discipline
The `{{MUSTACHE}}` convention is used consistently across templates, JSON configs, and shell scripts. It is compatible with common templating tools. The `env.template` / `env.<username>` split (template vs. user-specific credentials) is a strong portability pattern worth adopting in any credential-requiring skill.

### What to avoid
- Embedding agent persona names in rule text (they become rename-blockers)
- Vendor-branded cloud abstractions as layer names ("HyperScaler") — use `<cloud-provider>` or concrete provider names
- MCP server URLs hardcoded in rules (`http://localhost:8000/mcp`) — these should be env-var references
- Per-section "LLM Prompts" blocks mixing roleplay scaffolding with procedural rules — they contaminate the extractable SOP

---

## 9. Evidence

All citations are traceable to named blocks in `raw-findings.md`.

1. **`meta-rules.md` is tombstoned and merged into `canonical-rules.md`** — `meta-rules.md` Notes field: *"File is tombstoned (2026-03-27) and merged into `canonical-rules.md`."* Corroborated by `canonical-rules.md` Structure/format: *"references two historical source files (`globalrules.md`, `meta-rules.md`) in a banner note at the top."*

2. **§8 Self-Validation originated in `meta-rules.md`** — `meta-rules.md` Notes: *"§8 Self-Validation was noted as originating exclusively from this file, making it the canonical source for that pattern."*

3. **CLAUDE.md top-section pattern survives context compression; rules files do not** — `strict-rules-how-to.md` Notes: *"The core insight (CLAUDE.md is re-read after context compression; rules files are not) is a non-obvious mechanism worth preserving verbatim."*

4. **Canary deploy parameters are consistent across three files at 30 s / 5 probes / 25%** — `canonical-rules.md` Steps/contract §6: *"canary deployment job (deploy → wait 30s → probe 5× → shift 25% traffic or revert)"*; `agent-reasoning-planning-execution.md` Steps/contract: *"canary deploy job (deploy alias → wait 30 s → 5 health checks → shift 25% or revert)"*; `Agentic-Prompts-Library.md` Steps/contract Phase 4: *"Generate canary deployment job: deploy → wait 30 s → probe 5× → shift 25% traffic or rollback."*

5. **`merged-permissions.json` is unusually permissive and should be audited before adoption** — `merged-permissions.json` Notes: *"The list is unusually permissive (`Bash(bash:*)`, `Bash(curl:*)`, `chmod`, `xargs`) — adopters should audit and tighten to least-privilege for their context."*

6. **The `Task(subagent_type="…")` invocation syntax in `Agent-Personas.md` is framework-specific and must be stripped** — `Agent-Personas.md` Strip: *"`Task(subagent_type=\"…\", description=\"…\", prompt=\"…\")` invocation syntax (framework-specific)"*; the portable extract is the role-selection protocol and collaboration patterns, not the invocation syntax.

7. **`templates/.claude/commands/tdd.md` sets an 80% coverage gate, conflicting with the workspace `tdd` skill's 90% gate** — `tdd.md` Notes: *"Coverage gate is 80% here vs 90% in the workspace skill; the workspace version is more rigorous and should win in a cross-repo comparison."*

8. **The `Agentic-Prompts-Library.md` Phase 5 rollback/monitoring section has no counterpart in the workspace skills tree** — `Agentic-Prompts-Library.md` Notes: *"Monitoring/rollback scripts (Phase 5) have no existing skill counterpart and are the most novel contribution here."*

9. **`Enhanced-Agentic-Prompts-Library.md` extends the 4-step CoT to 7 steps with "choose SDK/method" and "testing approach"** — `Enhanced-Agentic-Prompts-Library.md` Notes: *"The 7-step CoT narrative is the highest-value portable extract — it mirrors the cot-gate skill's clarify→weigh→edge-cases→plan structure but adds 'choose SDK/method' and 'testing approach' steps worth absorbing."*

10. **`globalrules.md` LLM-prompt sub-blocks are Cody roleplay scaffolding with no portable value** — `globalrules.md` Notes: *"The LLM-prompt sub-blocks are roleplay scaffolding for their specific agent and carry no portable value — discard them."* Corroborated by `MVP-GlobalRules.md` Notes: *"The LLM prompt blocks are the weakest portable element — they are example invocations of 'Cody' and add no durable process logic."*

11. **The `Proactive Use` field in `Agent-Personas.md` encodes an implicit auto-trigger rule not formalised elsewhere** — `Agent-Personas.md` Notes: *"The 'Proactive Use' field encodes an implicit trigger rule that could be promoted to an explicit routing SOP."* The 10 proactively-marked roles are listed in Steps/contract: *"Proactive invocation markers (Frontend, Backend, Security, QA, DevOps, SRE, Tech Docs, UX, Scrum PM, DX) indicate agents that should trigger automatically after relevant work, not only on explicit request."*

12. **All rule files lack frontmatter; trigger and strip metadata exist only in the audit layer** — `strict-rules-how-to.md` Structure/format: *"No frontmatter; could benefit from SKILL.md frontmatter with a trigger description."* Consistent across all rule file Structure/format fields: none mention frontmatter.
