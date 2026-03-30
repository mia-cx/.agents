# Taches Repo — SOP Portability Audit
**Audit date:** 2026-03-29  
**Source:** `raw-findings.md` (221 file entries, 1 609 lines)  
**Auditor:** worker agent (chain step 2)

---

## 1. Repo Overview

Taches is a Claude Code marketplace plugin (`taches-cc-resources`, MIT, `"strict": true`) distributed via the Claude Code plugin channel. It is a comprehensive skills-and-tooling ecosystem designed for solo agentic development in Claude Code. The repo's architecture follows a strict router pattern: a thin `.references/taches/skills/create-hooks/SKILL.md` dispatcher routes to `.references/taches/skills/create-mcp-servers/workflows/create-new-server.md` procedural files, which pull in `.references/taches/agents/slash-command-auditor.md` knowledge files, `.references/taches/skills/create-mcp-servers/templates/`, and executable `.references/taches/skills/create-mcp-servers/scripts/`; this three-layer separation is itself the repo's central structural SOP. The content divides into two broad halves by portability: a **meta-authoring cluster** (`create-agent-skills`, `create-subagents`, `create-plans`, `create-meta-prompts`, `create-mcp-servers`, `debug-like-expert`, `setup-ralph`, `create-slash-commands`) that carries framework-agnostic methodology, and a **platform-expertise cluster** (`.references/taches/skills/expertise/iphone-apps`, `.references/taches/skills/expertise/macos-apps`) that is almost entirely Swift/Apple-SDK-specific and not portable. The slash-command surface splits similarly: `.references/taches/commands/consider/` and `.references/taches/commands/research/` contain pure reasoning and research frameworks with zero platform coupling, while most other command files are thin one-line skill dispatchers with no extractable logic. Three auditor subagents (`.references/taches/agents/skill-auditor.md`, `.references/taches/agents/subagent-auditor.md`, `.references/taches/agents/slash-command-auditor.md`) define reusable audit patterns applicable to any skill ecosystem. The `create-hooks` skill and all hook reference files are non-portable because they depend on Claude Code's proprietary `PreToolUse`/`PostToolUse`/`Stop`/`SessionStart` hook runtime, which has no equivalent outside that platform. The most portable single domain in the repo is `create-agent-skills` and its 14 supporting files, which constitute a complete, well-tested methodology for skill authoring that carries no taches-specific logic beyond a few hardcoded path literals.

---

## 2. Content Summary by Category

| Category | Files | Portability Signal | Notes |
|---|---|---|---|
| **Meta-skill authoring** (`create-agent-skills` SKILL.md + 14 references/workflows/templates) | 16 | **Very high** — all principles are model-agnostic | Router pattern, XML structure, progressive disclosure, validation are the core portable exports |
| **Planning** (`create-plans` SKILL.md + 12 references + 10 workflows + 8 templates) | 31 | **High** — principles transfer; `.planning/` paths and `AskUserQuestion` don't | Plans-as-prompts, scope control, deviation rules, checkpoint taxonomy are the top extracts |
| **Multi-stage prompt pipeline** (`create-meta-prompts` SKILL.md + 7 references) | 8 | **High** — Research/Plan/Do/Refine taxonomy and SUMMARY.md contract are universal | `.prompts/` path conventions and Task-agent spawning stripped |
| **MCP server building** (`create-mcp-servers` SKILL.md + 12 references + 2 workflows) | 15 | **Medium-high** — architecture heuristics and security rules portable; macOS paths not | Op-count architecture rule (≤2 flat; ≥3 meta-tool discovery) is the headline extract |
| **Debugging** (`debug-like-expert` SKILL.md + 4 references) | 5 | **Very high** — scientific loop is fully platform-agnostic | `domain_expertise` section stripped; two clean separable layers |
| **Subagent design** (`create-subagents` SKILL.md + 5 references) | 6 | **High** — black-box model, least-privilege, orchestration patterns are universal | Storage path and `.references/taches/agents` command stripped |
| **Autonomous coding loop** (`setup-ralph` SKILL.md + 6 references + 4 workflows + 2 templates) | 13 | **Medium** — abstract principles portable; Ralph tooling not | Fresh-context-per-iteration, backpressure-as-steering, plan-file-as-state are the extracts |
| **Slash-command authoring** (`create-slash-commands` SKILL.md + 3 references) | 4 | **Medium** — XML structural conventions portable; Claude Code invocation syntax not | `<intelligence_rules>` section is the strongest portable heuristic |
| **Hook authoring** (`create-hooks` SKILL.md + 4 references) | 5 | **None** — all content is Claude Code-proprietary runtime | Do not promote |
| **Auditor agents** (3 subagent definitions) | 3 | **High** — evaluation methodology and severity schema are repo-agnostic | Only strip hardcoded reference paths from `.references/taches/agents/skill-auditor.md`, `.references/taches/agents/subagent-auditor.md`, and `.references/taches/agents/slash-command-auditor.md` |
| **Analytical reasoning commands** (`.references/taches/commands/consider/`) | 11 | **Very high** — pure reasoning frameworks with no platform coupling | Strip XML tags and `$ARGUMENTS`; content ports verbatim |
| **Research workflow commands** (`.references/taches/commands/research/`) | 8 | **Very high** — intake-gate + structured output + `<claude_context>` block are generic | Strip `AskUserQuestion` and artifact path convention |
| **Project management commands** (context-handoff, todo, run-plan, heal-skill, etc.) | ~8 | **Partial** — the structured formats are portable; interactive affordances are not | SUMMARY.md and TO-DOS.md entry formats are the extracts |
| **iOS/macOS expertise — workflows** (20 workflow files) | 20 | **Very low** — `xcodebuild`/SwiftUI-specific throughout | Six universal developer principles in SKILL.md headers are portable; workflows are not |
| **iOS/macOS expertise — references** (35+ reference files) | 35+ | **Low** — code is Apple-SDK-only; checklist/principle content is partial | Extract security checklists, testing philosophies, and accessibility rules only |
| **Thin dispatcher commands** (create-plan, create-subagent, create-hook, audit-skill, etc.) | 10 | **None** — one-line skill delegators | No extractable SOP content |
| **Plugin manifests** (marketplace.json, plugin.json) | 2 | **None** — distribution metadata only | |

---

## 3. SOP Split — Every File

> Legend: **PORT** = extract as-is (minor path substitutions only) · **PARTIAL** = strip taches internals, then extract · **LEAVE** = no portable SOP value

### Meta-skill authoring

| File | Decision | One-line reason |
|---|---|---|
| `.references/taches/skills/create-agent-skills/SKILL.md` | PORT | Router pattern, XML discipline, progressive disclosure are fully framework-agnostic |
| `.references/taches/skills/create-agent-skills/references/core-principles.md` | PORT | Six model-agnostic authoring principles with rationale; "degrees of freedom ↔ fragility" is unusually well-articulated |
| `.references/taches/skills/create-agent-skills/references/recommended-structure.md` | PORT | Router + workflows + references three-layer architecture solves four named failure modes |
| `.references/taches/skills/create-agent-skills/references/skill-structure.md` | PORT | Most complete structural spec (YAML + XML + naming + validation checklist) in the repo |
| `.references/taches/skills/create-agent-skills/references/use-xml-tags.md` | PORT | Complete tag taxonomy with `<intelligence_rules>` decision tree; strip duplication with skill-structure.md |
| `.references/taches/skills/create-agent-skills/references/be-clear-and-direct.md` | PORT | Universal prompt-engineering quality rules with vague/specific contrast pairs |
| `.references/taches/skills/create-agent-skills/references/common-patterns.md` | PARTIAL | Strip taches-loader-specific anti-patterns (backtick execution, `@`-prefix loading); keep progressive-disclosure and one-default-one-escape-hatch rules |
| `.references/taches/skills/create-agent-skills/references/executable-code.md` | PARTIAL | Strip `~/.claude/skills/` path and runtime-specific notes; keep "scripts save tokens" and MCP fully-qualified tool name patterns |
| `.references/taches/skills/create-agent-skills/references/api-security.md` | PARTIAL | Strip taches infrastructure paths; keep credential-wrapper pattern and profile-selection SOP |
| `.references/taches/skills/create-agent-skills/references/iteration-and-testing.md` | PORT | Entirely generic eval-driven development process; Claude A/B testing framing is directly reusable |
| `.references/taches/skills/create-agent-skills/references/using-scripts.md` | PORT | Clean of any taches-specific content; script-candidate checklist is portable policy |
| `.references/taches/skills/create-agent-skills/references/using-templates.md` | PORT | No taches-specific content; `{{placeholder}}` convention and "structure over generation" framing are reusable |
| `.references/taches/skills/create-agent-skills/references/workflows-and-validation.md` | PORT | All patterns generic; "verbose error messages" principle and checkpoint/3-attempt escape hatch are high-value |
| `.references/taches/skills/create-agent-skills/workflows/create-new-skill.md` | PARTIAL | Strip `~/.claude/skills/` paths and AskUserQuestion; keep structure-decision heuristics and API-research gate |
| `.references/taches/skills/create-agent-skills/workflows/audit-skill.md` | PARTIAL | Strip hardcoded bash paths; keep `<audit_anti_patterns>` block and scored-report format |
| `.references/taches/skills/create-agent-skills/workflows/add-reference.md` | PORT | `<required_reading>` / `<reference_index>` conventions and seven-step checklist are portable patterns |
| `.references/taches/skills/create-agent-skills/workflows/add-script.md` | PORT | Script-candidate decision gate and success-criteria checklist are portable policy |
| `.references/taches/skills/create-agent-skills/workflows/add-template.md` | PORT | Template-candidate checklist and "structure matters more than generation" framing are reusable |
| `.references/taches/skills/create-agent-skills/workflows/add-workflow.md` | PORT | Router-pattern upgrade decision (detect simple vs router, offer migration) is strongest portable SOP here |
| `.references/taches/skills/create-agent-skills/workflows/get-guidance.md` | PORT | 5-row quick-decision table and "map workflows / identify domain knowledge" sequence are generic |
| `.references/taches/skills/create-agent-skills/workflows/upgrade-to-router.md` | PORT | Decomposition method and "verify nothing lost" regression-check are generalisable refactor SOPs |
| `.references/taches/skills/create-agent-skills/workflows/verify-skill.md` | PORT | Freshness-report template and "Audit checks structure; Verify checks truth" framing are portable |
| `.references/taches/skills/create-agent-skills/workflows/create-domain-expertise-skill.md` | PARTIAL | Strip `~/.claude/skills/expertise/` paths; keep completeness checklist, dual-purpose test, and reference-file XML schema |
| `.references/taches/skills/create-agent-skills/templates/router-skill.md` | PORT | Generic scaffold with no taches-specific paths; strongest router contract seen across repos |
| `.references/taches/skills/create-agent-skills/templates/simple-skill.md` | PORT | Fully generic; zero repo-specific references; checklist-style success_criteria is a portable convention |

### Planning

| File | Decision | One-line reason |
|---|---|---|
| `.references/taches/skills/create-plans/SKILL.md` | PARTIAL | Strip routing, domain-expertise loader, `/run-plan`, `.planning/` paths; keep five principles (plans-as-prompts, scope control, deviation rules, checkpoint taxonomy, anti-enterprise) |
| `.references/taches/skills/create-plans/references/plan-format.md` | PORT | Plans-as-prompts contract with four-field task anatomy and specificity-level triad are universally portable |
| `.references/taches/skills/create-plans/references/checkpoints.md` | PORT | Three-type checkpoint taxonomy and automate-first golden rule are universal human-in-the-loop patterns |
| `.references/taches/skills/create-plans/references/scope-estimation.md` | PARTIAL | Strip context-percentage figures; keep 2–3-task atomicity rule, split strategies, and autonomous-vs-interactive plan distinction |
| `.references/taches/skills/create-plans/references/context-management.md` | PORT | Four-tier token-threshold ladder and atomicity definition port cleanly; strip `<system_warning>` tag and taches YAML schema |
| `.references/taches/skills/create-plans/references/hierarchy-rules.md` | PARTIAL | Strip `.planning/` convention and `create-meta-prompts` integration; keep scope-flows-down model and cross-phase context rule |
| `.references/taches/skills/create-plans/references/git-integration.md` | PORT | Three-commit-event rule and "commit outcomes not process" principle are universally applicable |
| `.references/taches/skills/create-plans/references/domain-expertise.md` | PORT | Phase-type classification table and selective-reference-loading pattern are fully portable planning efficiency SOPs |
| `.references/taches/skills/create-plans/references/milestone-management.md` | PORT | Three-way brownfield plan diff and decision tree are highest-value portable artifacts |
| `.references/taches/skills/create-plans/references/research-pitfalls.md` | PORT | All 8 pitfalls and 5 red flags are domain-agnostic research quality SOPs; strip taches provenance footer only |
| `.references/taches/skills/create-plans/references/cli-automation.md` | PARTIAL | Strip platform-specific CLI tables; keep automation-first principle and auth-gate retry pattern |
| `.references/taches/skills/create-plans/references/user-gates.md` | PARTIAL | Strip AskUserQuestion tool and taches phase names; keep three-option decision gate loop and "good vs bad gating" section |
| `.references/taches/skills/create-plans/templates/brief.md` | PORT | Pure Markdown; dual greenfield/brownfield structure; strip XML wrapper tags only |
| `.references/taches/skills/create-plans/templates/phase-prompt.md` | PARTIAL | Strip `@~/.claude/skills/…` execution-context lines; keep task XML schema and good/bad examples |
| `.references/taches/skills/create-plans/templates/roadmap.md` | PORT | Purely structural; milestone-grouping evolution pattern is mature and reusable |
| `.references/taches/skills/create-plans/templates/summary.md` | PORT | "Deviations from Plan" vs "Issues Encountered" distinction is unusually rigorous |
| `.references/taches/skills/create-plans/templates/continue-here.md` | PORT | Highest-signal resume template seen; `<next_action>` as re-entry point is a standout pattern |
| `.references/taches/skills/create-plans/templates/issues.md` | PORT | ISS-NNN numbered log with discovery context is a clean, portable enhancement-tracking convention |
| `.references/taches/skills/create-plans/templates/milestone.md` | PORT | Generic release-chronicle format; "no milestones for WIP" guideline is a useful anti-pattern fence |
| `.references/taches/skills/create-plans/templates/research-prompt.md` | PORT | Incremental-write pattern and quality_report section are standout portable research SOPs |
| `.references/taches/skills/create-plans/workflows/create-brief.md` | PARTIAL | Strip AskUserQuestion and `.planning/` path; keep four-question intake, 50-line cap, and "brief is the only human-focused document" framing |
| `.references/taches/skills/create-plans/workflows/create-roadmap.md` | PARTIAL | Strip git commit heredoc, AskUserQuestion, bash mkdir; keep "good phases" criteria and anti-patterns list |
| `.references/taches/skills/create-plans/workflows/plan-phase.md` | PARTIAL | Strip domain SKILL.md loading and `@` syntax; keep task-quality framework and aggressive-atomicity principle |
| `.references/taches/skills/create-plans/workflows/execute-phase.md` | PARTIAL | Strip subagent routing, PLAN naming scheme, `@context` syntax; keep five deviation rules and deviation-documentation template |
| `.references/taches/skills/create-plans/workflows/research-phase.md` | PORT | Structured flow and confidence gate (LOW/MEDIUM/HIGH) with branching are tool-agnostic |
| `.references/taches/skills/create-plans/workflows/resume.md` | PORT | Locate → parse → confirm → delete handoff loop is a clean tool-agnostic re-entry pattern |
| `.references/taches/skills/create-plans/workflows/transition.md` | PORT | Phase-gate sequence and "forward motion IS progress" principle are portable design rules |
| `.references/taches/skills/create-plans/workflows/handoff.md` | PARTIAL | Strip `.planning/` path convention; keep "warn at 15%, auto at 10%" triggers and atomic-operation constraint |
| `.references/taches/skills/create-plans/workflows/get-guidance.md` | PORT | Decision tree (brief → roadmap → phase plan → execute) is a universal planning ladder |
| `.references/taches/skills/create-plans/workflows/plan-chunk.md` | PARTIAL | Strip bash path commands; keep 1–3-task chunking heuristic and execution-option menu |
| `.references/taches/skills/create-plans/workflows/complete-milestone.md` | PARTIAL | Strip `.planning/` bash commands; keep milestone lifecycle shape and "What's next" forced-articulation pattern |

### Debugging

| File | Decision | One-line reason |
|---|---|---|
| `.references/taches/skills/debug-like-expert/SKILL.md` | PARTIAL | Strip `context_scan` bash block and entire `domain_expertise` section; keep six-step scientific loop and critical rules verbatim |
| `.references/taches/skills/debug-like-expert/references/debugging-mindset.md` | PORT | No taches-specific content; five cognitive biases block maps 1:1 to a reusable checklist |
| `.references/taches/skills/debug-like-expert/references/hypothesis-testing.md` | PORT | Falsifiability criterion, strong-inference pattern, and YES/NO decision checklist are directly promotable |
| `.references/taches/skills/debug-like-expert/references/investigation-techniques.md` | PORT | Eight named techniques with decision tree and composition order are universally applicable |
| `.references/taches/skills/debug-like-expert/references/verification-patterns.md` | PORT | Five-part "verified" contract and "assume your fix is wrong" headline are portable; checklist preserved verbatim |

### Subagent design

| File | Decision | One-line reason |
|---|---|---|
| `.references/taches/skills/create-subagents/SKILL.md` | PARTIAL | Strip `.references/taches/agents` command, `.claude/agents/` paths, and taches reference cross-links; keep black-box model and least-privilege guidance |
| `.references/taches/skills/create-subagents/references/subagents.md` | PARTIAL | Strip storage paths and model alias strings; keep "permission sprawl is the fastest path to unsafe autonomy" and Sonnet/Haiku orchestration pattern |
| `.references/taches/skills/create-subagents/references/debugging-agents.md` | PORT | "Most agent failures are context failures, not model failures" maxim and 5-category failure taxonomy are vendor-agnostic |
| `.references/taches/skills/create-subagents/references/evaluation-and-testing.md` | PORT | 70/30 synthetic-vs-real split rule and eval-driven development lifecycle are framework-agnostic |
| `.references/taches/skills/create-subagents/references/context-management.md` | PORT | Memory taxonomy, summarization triggers, and structured summary template are framework-agnostic |
| `.references/taches/skills/create-subagents/references/orchestration-patterns.md` | PORT | Five patterns with decision tree, handoff protocol, and partial-failure synchronisation rule are architecture-agnostic |
| `.references/taches/skills/create-subagents/references/error-handling-and-recovery.md` | PORT | Recovery checklist and silent-failure anti-pattern are immediately portable SOP templates |
| `.references/taches/skills/create-subagents/references/writing-subagent-prompts.md` | PORT | `requires_user_interaction` anti-pattern and quick-reference boilerplate template are high-value; strip AskUserQuestion ref |

### MCP server building

| File | Decision | One-line reason |
|---|---|---|
| `.references/taches/skills/create-mcp-servers/SKILL.md` | PARTIAL | Strip `claude mcp` CLI commands, macOS log paths, `uv` preference, and sub-workflow index; keep 5 Rules and architecture decision heuristic |
| `.references/taches/skills/create-mcp-servers/references/large-api-pattern.md` | PORT | Resources-based meta-tool pattern and 3-operation threshold heuristic are API-agnostic |
| `.references/taches/skills/create-mcp-servers/references/adaptive-questioning-guide.md` | PORT | Clean of vendor content; four question-sets cover main MCP archetypes |
| `.references/taches/skills/create-mcp-servers/references/api-research-template.md` | PORT | Entirely API-agnostic scaffold; "Verified: ✓" marker per endpoint is portable |
| `.references/taches/skills/create-mcp-servers/references/auto-installation.md` | PARTIAL | Strip vendor-specific examples and taches troubleshooting block; keep secure-credential pattern and "What Good Looks Like" diff |
| `.references/taches/skills/create-mcp-servers/references/typescript-implementation.md` | PORT | McpError wrapping and "log to stderr, never stdout" rule are high-signal portable SOPs |
| `.references/taches/skills/create-mcp-servers/references/validation-checkpoints.md` | PARTIAL | Strip hardcoded paths and date-stamped grep; keep checkpoint categories as MCP readiness checklist |
| `.references/taches/skills/create-mcp-servers/references/oauth-implementation.md` | PORT | Stdio isolation and pre-authorization patterns are non-obvious, critical, and fully portable |
| `.references/taches/skills/create-mcp-servers/references/python-implementation.md` | PORT | Three-tier error hierarchy and `print(..., file=sys.stderr)` rule are portable Python MCP SOPs |
| `.references/taches/skills/create-mcp-servers/references/testing-and-deployment.md` | PARTIAL | Strip Docker/E2E subprocess section; keep test pyramid ratio, InMemoryTransport pattern, and publish-on-tag CI SOP |
| `.references/taches/skills/create-mcp-servers/references/tools-and-resources.md` | PARTIAL | Strip raw SQL interpolation example; keep five tool-design principles, path-traversal check, and URI scheme taxonomy |
| `.references/taches/skills/create-mcp-servers/references/best-practices.md` | PORT | Clean of personal paths; `uv --directory` isolation and "always log to stderr" are the two most commonly violated practices |
| `.references/taches/skills/create-mcp-servers/references/creation-workflow.md` | PARTIAL | Strip AskUserQuestion, macOS paths, `jq` config scripts; keep architecture decision rule and "never receive secrets in chat" step |
| `.references/taches/skills/create-mcp-servers/references/response-optimization.md` | PORT | Entirely self-contained; MANDATORY framing and implementation checklist are ready to lift verbatim |
| `.references/taches/skills/create-mcp-servers/references/traditional-pattern.md` | PARTIAL | Strip `~/Developer/mcp/` path; keep "signs you need on-demand discovery" list and error-as-TextContent rule |
| `.references/taches/skills/create-mcp-servers/workflows/create-new-server.md` | PARTIAL | Strip AskUserQuestion, internal agent delegation, and template references; keep operation-count → architecture rule and secret-hygiene step |
| `.references/taches/skills/create-mcp-servers/workflows/troubleshoot-server.md` | PORT | All five issue types and "STOP. Delete. Rotate." credential escalation are generic MCP SOPs |
| `.references/taches/skills/create-mcp-servers/workflows/update-existing-server.md` | PORT | Six-step update flow and 2→3 operation threshold for architecture upgrade are universally applicable |
| `.references/taches/skills/create-mcp-servers/templates/operations.jsonon` | PORT | `_meta_tools` block naming the four meta-tools is the on-demand discovery API surface; preserved verbatim |

### Meta-prompting pipeline

| File | Decision | One-line reason |
|---|---|---|
| `.references/taches/skills/create-meta-prompts/SKILL.md` | PARTIAL | Strip AskUserQuestion, `.prompts/` convention, and Task-agent spawning; keep Research/Plan/Do/Refine taxonomy and SUMMARY.md contract |
| `.references/taches/skills/create-meta-prompts/references/metadata-guidelines.md` | PORT | Four-field metadata block and three-tier confidence vocabulary are universally reusable inter-prompt handoff patterns |
| `.references/taches/skills/create-meta-prompts/references/do-patterns.md` | PORT | XML prompt template with "Avoid X — because Y" constraint pattern is universally applicable |
| `.references/taches/skills/create-meta-prompts/references/plan-patterns.md` | PORT | Phase/task/metadata XML skeleton and decision-framework variant with per-criterion fit scores are highly reusable |
| `.references/taches/skills/create-meta-prompts/references/research-patterns.md` | PARTIAL | Strip `.prompts/` path conventions and `!date` block; keep incremental-write pattern, verification checklist, and quality_report section |
| `.references/taches/skills/create-meta-prompts/references/refine-patterns.md` | PARTIAL | Strip numbered-folder scheme; keep `<preserve>/<feedback>/<requirements>` tripartite structure |
| `.references/taches/skills/create-meta-prompts/references/research-pitfalls.md` | PORT | Same eight-pitfall catalog appears in both `.references/taches/skills/create-meta-prompts/references/research-pitfalls.md` and `.references/taches/skills/create-plans/references/research-pitfalls.md`; promote one canonical copy only |
| `.references/taches/skills/create-meta-prompts/references/intelligence-rules.md` | PORT | Streaming-writes SOP and "why explanations" paired with constraints are standout portable rules |
| `.references/taches/skills/create-meta-prompts/references/question-bank.md` | PARTIAL | Strip AskUserQuestion tool references; keep six question_rules (max 4 questions, describe implications, prefer options over free-text) |
| `.references/taches/skills/create-meta-prompts/references/summary-template.md` | PORT | Reusable SUMMARY.md schema with "substantive one-liner" rule and purpose-specific Key Findings guidance |

### Slash-command authoring

| File | Decision | One-line reason |
|---|---|---|
| `.references/taches/skills/create-slash-commands/SKILL.md` | PARTIAL | Strip Claude Code invocation syntax (`$ARGUMENTS`, `allowed-tools`); keep XML tag schema and complexity-classification heuristic |
| `.references/taches/skills/create-slash-commands/references/arguments.md` | PORT | `argument-hint` convention and composite argument patterns are underused and worth surfacing |
| `.references/taches/skills/create-slash-commands/references/patterns.md` | PORT | `<objective>/<context>/<process>/<success_criteria>` XML skeleton and `SequentialThinking` allowed-tools pattern are directly portable |
| `.references/taches/skills/create-slash-commands/references/tool-restrictions.md` | PORT | Security-pattern trio (prevent exfiltration, destructive ops, controlled deployment) and read-only `Bash(git diff:*)` principle are not represented in most skills trees |

### Hook authoring

| File | Decision | One-line reason |
|---|---|---|
| `.references/taches/skills/create-hooks/SKILL.md` | LEAVE | Entire skill is Claude Code-specific; no portable SOP survives stripping |
| `.references/taches/skills/create-hooks/references/hook-types.md` | LEAVE | Event names, blocking semantics, and schemas are Claude Code runtime facts only |
| `.references/taches/skills/create-hooks/references/examples.md` | LEAVE | macOS-specific commands and Claude Code-specific patterns throughout |
| `.references/taches/skills/create-hooks/references/input-output-schemas.md` | LEAVE | Ground truth for Claude Code hook fields; no cross-platform equivalent |
| `.references/taches/skills/create-hooks/references/matchers.md` | LEAVE | Regex syntax and MCP naming scheme are Claude Code runtime specifics |
| `.references/taches/skills/create-hooks/references/command-vs-prompt.md` | LEAVE | Decision tree is only actionable for Claude Code hook authors |
| `.references/taches/skills/create-hooks/references/troubleshooting.md` | LEAVE | `stop_hook_active` guard and six-step debug workflow are Claude Code-specific |

### Auditor agents

| File | Decision | One-line reason |
|---|---|---|
| `.references/taches/agents/skill-auditor.md` | PARTIAL | Strip `critical_workflow` `@skills/create-agent-skills/…` hardcoded paths; keep four evaluation areas, `<contextual_judgment>` tiers, and severity schema |
| `.references/taches/agents/subagent-auditor.md` | PARTIAL | Strip Steps 1–4 `@skills/create-subagents/…` read-references; keep six critical areas, six recommended areas, and `<anti_patterns>` catalogue |
| `.references/taches/agents/slash-command-auditor.md` | PARTIAL | Strip four hardcoded `@skills/create-slash-commands/…` paths; keep five evaluation areas and `<contextual_judgment>` section |

### Autonomous loop

| File | Decision | One-line reason |
|---|---|---|
| `.references/taches/skills/setup-ralph/SKILL.md` | PARTIAL | Procedural detail lives in absent workflow files; extract three-phase model (plan/build/observe) and backpressure principle only |
| `.references/taches/skills/setup-ralph/references/ralph-fundamentals.md` | PARTIAL | Strip bash escape-hatch commands; keep fresh-context-per-iteration rationale and file-I/O-as-state insight |
| `.references/taches/skills/setup-ralph/references/prompt-design.md` | PARTIAL | Strip verbatim templates and language-specific validation blocks; keep five anti-patterns and start-minimal principle |
| `.references/taches/skills/setup-ralph/references/validation-strategy.md` | PORT | Backpressure-as-steering model and four-validation-type escalation ladder are framework-agnostic |
| `.references/taches/skills/setup-ralph/references/project-structure.md` | PARTIAL | Strip bash `loop.sh` blocks and directory diagrams; keep "IMPLEMENTATION_PLAN.md is the ONLY state that persists" rule and spec-scoping test |
| `.references/taches/skills/setup-ralph/references/operational-learnings.md` | PARTIAL | Strip all Ralph/taches naming; keep anti-pattern catalogue (The Novel, The Rule Book, The Spec Duplicate) and five-phase maturity arc |
| `.references/taches/skills/setup-ralph/workflows/setup-new-loop.md` | PARTIAL | Strip Ralph tooling; keep backpressure-level decision menu and security-notice block |
| `.references/taches/skills/setup-ralph/workflows/understand-ralph.md` | PARTIAL | Strip Ralph/Geoffrey Huntley provenance; keep three-phase model, "when to use" gate criterion, and backpressure rationale |
| `.references/taches/skills/setup-ralph/workflows/customize-loop.md` | PARTIAL | Strip Ralph-specific flags; keep four customisation axes and single-iteration-before-commit safety rule |
| `.references/taches/skills/setup-ralph/workflows/troubleshoot-loop.md` | PARTIAL | Strip Ralph-specific filenames; keep four-tier escape-hatch ladder and prevent-recurrence step |
| `.references/taches/skills/setup-ralph/templates/PROMPT_build.md` | PARTIAL | Strip Ralph persona and magic subagent counts; keep one-task-per-iteration loop and safety block (never rm -rf without echoing path) |
| `.references/taches/skills/setup-ralph/templates/PROMPT_plan.md` | PARTIAL | Strip Ralph persona and paths; keep plan-only discipline and "confirm before assuming missing" instruction |

### Analytical reasoning commands

| File | Decision | One-line reason |
|---|---|---|
| `.references/taches/commands/consider/first-principles.md` | PORT | Pure reasoning scaffold; five-step state→assumptions→challenge→base-truths→rebuild loop is directly reusable |
| `.references/taches/commands/consider/inversion.md` | PORT | Invert-goal→enumerate-failure-modes→anti-goals→residual-risk loop is framework-agnostic |
| `.references/taches/commands/consider/second-order.md` | PORT | Causal-chain analysis with third-order optional step; no external dependencies |
| `.references/taches/commands/consider/10-10-10.md` | PORT | Time-horizon decision analysis; "Time Conflicts" section is the most portable element |
| `.references/taches/commands/consider/opportunity-cost.md` | PORT | Five-step resource-cost analysis with structured output sections |
| `.references/taches/commands/consider/pareto.md` | PORT | 80/20 prioritisation with Vital Few / Trivial Many output; "Bottom Line" single-sentence pattern is strong |
| `.references/taches/commands/consider/swot.md` | PORT | Cross-quadrant "Strategic Moves" section distinguishes this from a bare SWOT grid |
| `.references/taches/commands/consider/via-negativa.md` | PORT | Subtraction-first heuristic with "Subtraction Candidates" table is rare in agent skill sets |
| `.references/taches/commands/consider/5-whys.md` | PORT | Structured root-cause protocol with no taches-specific state |
| `.references/taches/commands/consider/eisenhower-matrix.md` | PORT | 2×2 urgency/importance quadrant with Q1–Q4 directives is a reusable triage template |
| `.references/taches/commands/consider/occams-razor.md` | PORT | Assumption-enumeration + evidence-check loop; pairs with 5-whys as a complementary diagnostic |
| `.references/taches/commands/consider/one-thing.md` | PORT | Single-leverage-point identifier; "Next Action" close-out step is worth preserving |

### Research workflow commands

| File | Decision | One-line reason |
|---|---|---|
| `.references/taches/commands/research/competitive.md` | PORT | `<claude_context>` block with table_stakes/differentiators/avoid/positioning is a strong portable pattern |
| `.references/taches/commands/research/deep-dive.md` | PORT | "Remaining Unknowns" as first-class output section prevents silently incomplete research |
| `.references/taches/commands/research/feasibility.md` | PORT | Three-axis framework (technical/resource/external) with `simpler_version` forcing function |
| `.references/taches/commands/research/landscape.md` | PORT | MECE category requirement and adopt/watch/avoid taxonomy are the standout portable constraints |
| `.references/taches/commands/research/history.md` | PORT | Adopt/avoid/changed tripartite `<claude_context>` structure is standout for history-informed planning |
| `.references/taches/commands/research/open-source.md` | PORT | Maintenance-verification checklist (last commit > 1 year OR single-contributor → flag) is the portable gem |
| `.references/taches/commands/research/options.md` | PORT | "Runner-up: choose this if [condition]" pattern with `switch_cost` is a useful addition beyond plain recommendations |
| `.references/taches/commands/research/technical.md` | PORT | `<implementation>` sub-block with `start_with`, `order`, `gotchas`, `testing` fields bridges research to execution |

### Project management commands

| File | Decision | One-line reason |
|---|---|---|
| `.references/taches/docs/context-handoff.md` | PORT | Six-section XML handoff schema and "prevents scope creep" framing are universally applicable |
| `.references/taches/docs/meta-prompting.md` | PARTIAL | Analysis-before-execution split is portable; actual command templates live elsewhere (not self-contained) |
| `.references/taches/docs/todo-management.md` | PARTIAL | Entry format (Problem/Files/Solution/timestamp) is portable; command logic files not present |
| `.references/taches/commands/ask-me-questions.md` | PORT | Three-phase intake gate and five-axis context model (What/Who/Why/How/When) are directly reusable |
| `.references/taches/commands/heal-skill.md` | PORT | Approval-gated self-correction workflow with before/after diff and four-option gate is a best practice for any self-modifying agent |
| `.references/taches/commands/add-to-todos.md` | PARTIAL | `**[Action] [Component]** — Problem/Files/Solution` entry format is portable; strip interactive loops |
| `.references/taches/commands/check-todos.md` | PARTIAL | Parse→display→load-context→dispatch state machine is portable; strip taches-specific workflow mappings |
| `.references/taches/commands/run-plan.md` | PARTIAL | Three-strategy routing model (autonomous/segmented/decision-dependent) and context-budget target are portable; strip SUMMARY.md/ROADMAP.md update steps |
| `.references/taches/commands/create-prompt.md` | PARTIAL | Adaptive intake loop, parallel-vs-sequential heuristics, and XML prompt construction rules are reusable; strip SlashCommand invocation and `./prompts/` path |
| `.references/taches/commands/run-prompt.md` | PORT | Parallel-dispatch pattern and sequential-with-early-stop are strong portable orchestration SOPs |
| `.references/taches/commands/whats-next.md` | PORT | Six-section XML handoff contract is a clean, reusable session-continuity SOP |

### Platform expertise (iOS/macOS)

| File | Decision | One-line reason |
|---|---|---|
| `.references/taches/skills/expertise/iphone-apps/SKILL.md` | PARTIAL | Six essential principles (Prove Don't Promise, Tests for Correctness, etc.) are platform-agnostic; strip all iOS tooling |
| `.references/taches/skills/expertise/macos-apps/SKILL.md` | PARTIAL | Same six principles as iOS SKILL.md; merge into one cross-platform SOP; strip macOS tooling |
| `.references/taches/skills/expertise/iphone-apps/references/app-architecture.md` | PARTIAL | DI container pattern, coordinator state-machine, and `AppError` enum structure are portable; strip all Swift/SwiftUI code |
| `.references/taches/skills/expertise/iphone-apps/references/testing.md` | PARTIAL | AAA, parameterised tests, protocol mocks, and `sut_action_expectedOutcome` naming are portable; strip Swift Testing macros |
| `.references/taches/skills/expertise/iphone-apps/references/performance.md` | PARTIAL | Defer-non-critical-init and batch-network principles are portable; strip iOS profiling toolchain |
| `.references/taches/skills/expertise/macos-apps/references/macos-polish.md` | PARTIAL | Three portable SOPs (register defaults at launch, wrap animations behind reduce-motion, single root error alert); strip AppKit code |
| `.references/taches/skills/expertise/macos-apps/references/networking.md` | PARTIAL | OAuth refresh deduplication, exponential backoff (2^(n-1), max 3), offline fallback are portable HTTP patterns; strip Swift actor syntax |
| `.references/taches/skills/expertise/macos-apps/references/security-code-signing.md` | PARTIAL | Four portable security rules (credential store, minimum entitlement, CSPRNG gate, sign→verify→staple pipeline); strip all Swift code |
| `.references/taches/skills/expertise/macos-apps/references/design-system.md` | PARTIAL | Three portable SOP elements (semantic token layer, reduce-motion gate, WCAG AA contrast rule); strip all SwiftUI code |
| `.references/taches/skills/expertise/macos-apps/references/testing-debugging.md` | PARTIAL | Protocol-based DI for mocking and memory-leak weak-reference test helper are portable; strip Swift/XCTest boilerplate |
| `.references/taches/skills/expertise/macos-apps/references/testing-tdd.md` | PARTIAL | "What not to test" list and minimal-UI-test principle are the strongest portable extracts; strip Swift/XCTest |
| `.references/taches/skills/expertise/n8n-automations/SKILL-SPEC.yaml` | PARTIAL | SKILL-SPEC.yaml format (metadata→principles→terminology→references→workflows with batch ordering) is a portable meta-skill construction pattern; strip n8n domain content |
| All iOS/macOS workflows (20 files) | LEAVE | `xcodebuild`/SwiftUI/XcodeGen-specific throughout; no portable workflow logic |
| All remaining iOS/macOS references (20+ files) | LEAVE | Apple-SDK code is non-transferable; principles already extracted above |

### Thin dispatchers and manifests

| File | Decision | One-line reason |
|---|---|---|
| `.references/taches/commands/create-plan.md` | LEAVE | One-line delegator with no embedded logic |
| `.references/taches/commands/create-subagent.md` | LEAVE | One-line delegator |
| `.references/taches/commands/create-agent-skill.md` | LEAVE | One-line delegator |
| `.references/taches/commands/create-hook.md` | LEAVE | One-line delegator |
| `.references/taches/commands/create-meta-prompt.md` | LEAVE | One-line delegator |
| `.references/taches/commands/create-slash-command.md` | LEAVE | One-line delegator |
| `.references/taches/commands/audit-skill.md` | LEAVE | Names audit criteria but does not define them; pointer to `skill-auditor` subagent |
| `.references/taches/commands/audit-slash-command.md` | LEAVE | Same thin-pointer pattern; no extractable SOP |
| `.references/taches/commands/audit-subagent.md` | LEAVE | Depends on taches-proprietary `subagent-auditor` subagent |
| `.references/taches/commands/debug.md` | PARTIAL | `<objective>/<process>/<success_criteria>` triple as documented prompt-structure pattern is the only portable element |
| `.references/taches/commands/setup-ralph.md` | PORT | Demonstrates minimal skill-invocation command pattern: `allowed-tools: Skill(name)` + body is one line |
| `.references/taches/.claude-plugin/marketplace.jsonon` | LEAVE | Distribution metadata only |
| `.references/taches/.claude-plugin/plugin.jsonon` | LEAVE | Distribution metadata only |

---

## 4. Per-SOP Detail Table

> Covers all **PORT** and **PARTIAL** files with substantive extracted content. Ordered by domain, then portability within domain.

### 4a. Meta-skill Authoring

| Source file | Trigger | Steps / Contract | Quality bar | Strip before porting | Notes |
|---|---|---|---|---|---|
| `.references/taches/skills/create-agent-skills/SKILL.md` | "create skill", "audit skill", "build new skill", "SKILL.md" | (1) Intake → (2) Routing table → (3) Delegated workflow → (4) Validation | XML-only body; ≤500-line SKILL.md cap; progressive disclosure; `.references/taches/skills/` folder conventions | `<intake>` wait-for-response gate; local `.references/taches/skills/create-agent-skills/workflows/` file references; `<reference_index>` path literals | Direct comparison candidate for target `.references/taches/skills/create-hooks/SKILL.md`; evaluate against XML discipline and router completeness |
| `.references/taches/skills/create-agent-skills/references/core-principles.md` | Skill-authoring reference | Six principles: XML structure, conciseness, degrees-of-freedom, model testing, progressive disclosure, validation scripts | Rationale accompanies each principle; concise/verbose contrast examples included | Internal cross-references to sibling files; model-version-specific token estimates | "Degrees of freedom ↔ fragility" framing is unusually well-articulated; keep verbatim |

| `.references/taches/skills/create-agent-skills/references/skill-structure.md` | Authoring structural reference | YAML frontmatter rules; required/conditional XML tags; naming (verb-noun); progressive disclosure patterns; validation checklist (9 items) | Single-file spec completeness; anti-patterns paired with fixes | Relative sibling links; Windows-path pitfall note; domain example noise | Most complete structural reference in taches; align `<naming_conventions>` with `.references/taches/skills/create-agent-skills/references/core-principles.md` |
| `.references/taches/skills/create-agent-skills/references/recommended-structure.md` | Choosing skill layout | Router + `.references/taches/skills/create-agent-skills/workflows/` + `.references/taches/skills/create-agent-skills/references/` solves four failure modes; SKILL.md always-loaded guarantee | `<when_to_use_this_pattern>` threshold (>200 lines or multiple workflows → router) | Template `##` headings vs pure-XML discipline elsewhere | Crisp migration decision gate for any skills tree |
| `.references/taches/skills/create-agent-skills/references/use-xml-tags.md` | Tag selection for SKILL bodies | `<intelligence_rules>` tree: simple → required only; medium → workflow/examples; complex → conditional tags | `<when_to_add_conditional>` question list actionable | Overlap with `.references/taches/skills/create-agent-skills/references/skill-structure.md` (dedupe critical_rule / xml_vs_markdown / nesting) | Preserve `<combining_with_other_techniques>` and `<tag_reference_pattern>` — unique vs sibling refs |
| `.references/taches/skills/create-agent-skills/references/be-clear-and-direct.md` | Writing clearer instructions | Clarity, specificity, sequential steps, edge cases, output format, decision criteria | Vague vs specific contrast pairs | Tag names as taches convention; `{{FEEDBACK_DATA}}` flavour | Strong eval fixtures; ambiguity vocabulary list ("try" → "always", etc.) |
| `.references/taches/skills/create-agent-skills/references/common-patterns.md` | Pattern catalogue | One default + one escape hatch; progressive disclosure; validation/checklist patterns | Anti-pattern list scannable | Taches loader anti-patterns (`!` backtick, `@` execution); POV/naming as local policy | "One default, one escape hatch" is standalone promotable rule |
| `.references/taches/skills/create-agent-skills/references/executable-code.md` | Scripts vs generated code | Pre-made script execution; only output in context; MCP `Server:tool_name` | Solve-don't-punt errors; documented constants | `~/.claude/skills/.../scripts/`; claude.ai vs API runtime note | "Scripts save tokens" headline is high-signal |
| `.references/taches/skills/create-agent-skills/references/api-security.md` | API-calling skills | Credential wrapper pattern; profile-selection UX before call | No `$API_KEY` expansion in logged bash | `~/.claude/scripts/...` paths; client examples | Abstract as "wrapper loads creds; tool string never interpolates secrets" |
| `.references/taches/skills/create-agent-skills/references/iteration-and-testing.md` | Skill QA lifecycle | Eval-first loop; Claude A/B (one refines, one executes); observation-based iteration | `evaluation_structure` JSON example reusable | Link to `.references/taches/skills/create-agent-skills/references/core-principles.md` only | Directly reusable across model vendors |
| `.references/taches/skills/create-agent-skills/references/using-scripts.md` | When to add scripts | `.references/taches/skills/create-agent-skills/scripts/` layout; idempotent; `set -euo pipefail`; workflow integration | Script-candidate checklist | Nothing material | Bash example is minimal canonical |
| `.references/taches/skills/create-agent-skills/references/using-templates.md` | Template authoring | `{{placeholder}}` convention; structure over generation | Short do/don't list | Nothing material | Merge-friendly with `.references/taches/skills/create-agent-skills/workflows/add-template.md` workflow |
| `.references/taches/skills/create-agent-skills/references/workflows-and-validation.md` | Multi-step workflows | Verbose invalid-field errors; checkpoint; 3-attempt then escalate | Examples are illustrative only | Example skill names in snippets | Checkpoint + escalation ladder is generic |
| `.references/taches/skills/create-agent-skills/workflows/create-new-skill.md` | End-to-end new skill | Intake → structure decision (simple vs router; templates/scripts) → author → validate | Step 3 heuristics are headline | `~/.claude/skills/`, `~/.claude/commands/`; AskUserQuestion | API-research gate (Step 2) optional but valuable |
| `.references/taches/skills/create-agent-skills/workflows/audit-skill.md` | Skill quality audit | YAML → structure → router → workflows → content; scored report | `<audit_anti_patterns>` block | Bash paths; AskUserQuestion | X/Y criteria scoring convention |
| `.references/taches/skills/create-agent-skills/workflows/add-reference.md` | Add reference file | Seven-step: create → `reference_index` → `required_reading` in workflows → verify | Semantic XML inside references | `~/.claude/skills/`; AskUserQuestion phrasing | Registration pattern is tree-agnostic |
| `.references/taches/skills/create-agent-skills/workflows/add-script.md` | Add script | Candidate gate (idempotent, error-prone rewrite, consistency) → write → chmod → wire | Success criteria: no secrets; real invocation tested | `~/.claude/skills/`; language menu optional trim | Same gate as `.references/taches/skills/create-agent-skills/references/using-scripts.md` — cross-link on promote |
| `.references/taches/skills/create-agent-skills/workflows/add-template.md` | Add template | Checklist → `{{PLACEHOLDER}}` → read-copy-fill | "Structure matters more than generation" | `~/.claude/skills/` | Pairs with `.references/taches/skills/create-agent-skills/references/using-templates.md` |
| `.references/taches/skills/create-agent-skills/workflows/add-workflow.md` | Add workflow + router upgrade | Detect simple vs router; offer migration; update intake + routing + index | Workflow skeleton: required_reading + process + success_criteria | `~/.claude/skills/`; AskUserQuestion | Strongest migration SOP in cluster |
| `.references/taches/skills/create-agent-skills/workflows/get-guidance.md` | Triage before creating | 5-row decision table; map workflows vs domain knowledge vs principles | Single-task → simple; multi-task → router | `~/.claude/skills/` | Minimal high signal-to-noise |
| `.references/taches/skills/create-agent-skills/workflows/upgrade-to-router.md` | Monolith → router | Extract principles; split workflows; move knowledge; regression compare | Steps 8–9 (nothing lost; test routing) | `~/.claude/skills/` | General skill refactor playbook |
| `.references/taches/skills/create-agent-skills/workflows/verify-skill.md` | Truth vs structure | Categorise claims → verify via docs/CLI/Web; freshness report template | "Audit checks structure; Verify checks truth" | `~/.claude/skills/`; Context7 tool names → generic "library docs tool" | Reusable outside taches |
| `.references/taches/skills/create-agent-skills/workflows/create-domain-expertise-skill.md` | Domain expertise skill | Research breadth → lifecycle coverage → dual-purpose test → completeness checklist | Reference XML schemas (option/decision_tree/anti_pattern) | `~/.claude/skills/expertise/`; create-plans wiring step | Step 9 checklist + Step 12 quality bar |
| `.references/taches/skills/create-agent-skills/templates/router-skill.md` | Scaffold router skill | Frontmatter + essential_principles + intake + routing + indices + success_criteria | Placeholders only | Replace `{{SKILL_NAME}}` tokens | Canonical router contract |
| `.references/taches/skills/create-agent-skills/templates/simple-skill.md` | Scaffold simple skill | objective / quick_start / process / success_criteria | Checklist `- [ ]` success_criteria | Nothing | Pair with router template for author choice |

### 4b. Planning (`.references/taches/skills/create-plans/`)

| Source file | Trigger | Steps / Contract | Quality bar | Strip before porting | Notes |
|---|---|---|---|---|---|
| `.references/taches/skills/create-plans/SKILL.md` | Plan project, brief, roadmap, agentic execution | Context scan → intake menu → route to sub-workflow → PLAN.md as execution prompt → hierarchy BRIEF→ROADMAP→PLAN→SUMMARY; five deviation rules | Plans-as-prompts; 2–3 tasks; checkpoint automate-first; anti-enterprise list | Routing to `.references/taches/skills/create-plans/workflows/`; `.references/taches/skills/create-plans/references/`, `.references/taches/skills/create-plans/templates/` path wiring; `.planning/`; domain expertise scan; `/run-plan`; git-commit coupling | **[E2]** Portable core is principles + checkpoint taxonomy; strip all routing to `.references/taches/skills/create-plans/workflows/` and taches paths |
| `.references/taches/skills/create-plans/references/plan-format.md` | Authoring PLAN.md | Executable plan XML; tasks with files/action/verify/done; task types auto vs checkpoints | Specificity triad too_vague / just_right / too_detailed | `@file` loading; cross-links | Crown-jewel plans-as-prompts spec |
| `.references/taches/skills/create-plans/references/checkpoints.md` | Human-in-the-loop | Three checkpoint types; stop-display-wait-verify-resume; placement rules | "If Claude CAN automate it, Claude MUST automate it" | Taches examples only | Pairs with `.references/taches/skills/create-plans/references/cli-automation.md` |
| `.references/taches/skills/create-plans/references/scope-estimation.md` | Plan sizing | 2–3 task atomicity; split strategies; autonomous vs interactive plan taxonomy | Anti-pattern: one giant plan | Context % figures; subagent 200k note | Atomic commit philosophy portable |
| `.references/taches/skills/create-plans/references/context-management.md` | Long sessions | Four-tier threshold ladder; atomic operation definition; bloat hygiene | Finish one atomic op before handoff | `<system_warning>`; handoff YAML schema | "What counts as atomic" is reusable |
| `.references/taches/skills/create-plans/references/hierarchy-rules.md` | Multi-level planning | Scope flows down; progress flows up; cross-phase context | Prerequisite offer (create roadmap if missing) | `.planning/` naming; meta-prompts integration | Cross-phase context rule is gem |
| `.references/taches/skills/create-plans/references/git-integration.md` | Git + planning | Three commit events only; outcomes not process | Negative space: what not to commit | `.planning/` paths in examples | Clean git log example |
| `.references/taches/skills/create-plans/references/domain-expertise.md` | Efficient skill loading | Phase-type table; load only phase-relevant references | Migration steps for bloated skills | Swift/macOS examples; token benchmarks | Phase taxonomy is canonical |
| `.references/taches/skills/create-plans/references/milestone-management.md` | Milestones / brownfield | Decision tree same vs new codebase; brownfield plan diff pattern | BRIEF Current State pattern | `.planning/` dir name | Three-way diff is top extract |
| `.references/taches/skills/create-plans/references/research-pitfalls.md` | Research quality | Eight pitfalls + XML guards; five red flags; improvement loop | Red-flags checklist scannable | Taches MCP footer; illustrative `.mcp.json` | Dedupe with `.references/taches/skills/create-meta-prompts/references/research-pitfalls.md` |
| `.references/taches/skills/create-plans/references/cli-automation.md` | Ops during execution | Automate if CLI/API exists; else minimal human-action checkpoint | Auth-gate: try → detect auth error → unblock → retry | Vendor CLI tables; taches task XML | Automation-first + auth gate |
| `.references/taches/skills/create-plans/references/user-gates.md` | When to ask human | Proceed / more questions / add context loop; good vs bad gating | Align gates with `checkpoint:decision` | AskUserQuestion syntax; phase names | Harmonise with `.references/taches/skills/create-plans/references/plan-format.md` |
| `.references/taches/skills/create-plans/workflows/get-guidance.md` | Planning ladder | brief → roadmap → phase plan → execute decision tree | No skip-ahead without artifact | Light strip | Universal onboarding |
| `.references/taches/skills/create-plans/workflows/research-phase.md` | Research workflow | Structured phases; LOW/MEDIUM/HIGH confidence branches | Confidence gate explicit | — | Tool-agnostic flow |
| `.references/taches/skills/create-plans/workflows/resume.md` | Resume after handoff | Locate handoff → parse → confirm → delete | Clean re-entry | — | Session continuity |
| `.references/taches/skills/create-plans/templates/continue-here.md` | Handoff file | `<next_action>` re-entry; state snapshot | Highest-signal resume template | — | Promote verbatim |
| `.references/taches/skills/create-plans/templates/summary.md` | Phase summary | Deviations vs issues distinction | Rigorous closure semantics | — | Unusually precise |

*Templates `.references/taches/skills/create-plans/templates/brief.md`, `.references/taches/skills/create-plans/templates/roadmap.md`, `.references/taches/skills/create-plans/templates/milestone.md`, `.references/taches/skills/create-plans/templates/issues.md`, `.references/taches/skills/create-plans/templates/research-prompt.md`, `.references/taches/skills/create-plans/templates/phase-prompt.md` and workflows `.references/taches/skills/create-plans/workflows/create-brief.md`, `.references/taches/skills/create-plans/workflows/create-roadmap.md`, `.references/taches/skills/create-plans/workflows/plan-phase.md`, `.references/taches/skills/create-plans/workflows/execute-phase.md`, `.references/taches/skills/create-plans/workflows/transition.md`, `.references/taches/skills/create-plans/workflows/handoff.md`, `.references/taches/skills/create-plans/workflows/plan-chunk.md`, `.references/taches/skills/create-plans/workflows/complete-milestone.md` follow the same strip pattern: remove AskUserQuestion, `.planning/` bash, `@` skill loads; keep structural schemas, deviation rules, and phase-gate prose.*

### 4c. Debugging (`.references/taches/skills/debug-like-expert/`)

| Source file | Trigger | Steps / Contract | Quality bar | Strip before porting | Notes |
|---|---|---|---|---|---|
| `.references/taches/skills/debug-like-expert/SKILL.md` | Hard bugs, systematic RCA | Six-step scientific loop + success checklist | Critical rules: one variable at a time; complete reads | `context_scan`; `domain_expertise` block | Two-layer split: portable loop vs taches loader |
| `.references/taches/skills/debug-like-expert/references/debugging-mindset.md` | Cognitive pitfalls | Five biases with mitigations | Checklist mappable to any team | — | Preserve verbatim |
| `.references/taches/skills/debug-like-expert/references/hypothesis-testing.md` | Hypothesis discipline | Falsifiability; strong inference; YES/NO decision | Each hypothesis tied to evidence | — | — |
| `.references/taches/skills/debug-like-expert/references/investigation-techniques.md` | Technique choice | Eight techniques + composition order + decision tree | Named techniques reusable | — | — |
| `.references/taches/skills/debug-like-expert/references/verification-patterns.md` | Definition of verified | Five-part verified contract | "Assume your fix is wrong" headline | — | — |

### 4d. Subagent design (`.references/taches/skills/create-subagents/`)

| Source file | Trigger | Steps / Contract | Quality bar | Strip before porting | Notes |
|---|---|---|---|---|---|
| `.references/taches/skills/create-subagents/SKILL.md` | Configure subagents | Frontmatter; XML system prompt; black-box model; least privilege; success checklist | No mid-run user interaction | `/agents` command; `.claude/agents/`; internal refs | Overlaps create-agent-skills — dedup on promote |
| `.references/taches/skills/create-subagents/references/subagents.md` | Deep dive | Permission sprawl warning; orchestration model tiers | Sonnet/Haiku pattern → generic fast/strong | Storage paths; model marketing names | — |
| `.references/taches/skills/create-subagents/references/debugging-agents.md` | Agent failures | Context vs model failure maxim; 5 categories | Actionable taxonomy | — | — |
| `.references/taches/skills/create-subagents/references/evaluation-and-testing.md` | Eval design | 70/30 synthetic/real; eval lifecycle | Measurable promotion bar | — | — |
| `.references/taches/skills/create-subagents/references/context-management.md` | Memory | Taxonomy; summarization triggers; template | Structured summary | — | — |
| `.references/taches/skills/create-subagents/references/orchestration-patterns.md` | Multi-agent | Five patterns; handoff; partial-failure sync | Decision tree | — | — |
| `.references/taches/skills/create-subagents/references/error-handling-and-recovery.md` | Recovery | Checklist; silent-failure anti-pattern | — | — | — |
| `.references/taches/skills/create-subagents/references/writing-subagent-prompts.md` | Prompt body | `requires_user_interaction` anti-pattern; boilerplate | Quick-reference template | AskUserQuestion mention | — |

### 4e. MCP server building (`.references/taches/skills/create-mcp-servers/`)

| Source file | Trigger | Steps / Contract | Quality bar | Strip before porting | Notes |
|---|---|---|---|---|---|
| `.references/taches/skills/create-mcp-servers/SKILL.md` | Build MCP server | Route → 8-step creation → arch selection → validate → install | 5 Rules + op-count heuristic (≤2 flat, ≥3 meta-tools) | `claude mcp` CLI; macOS logs; `uv` opinion | **[E3]** Op-count rule is headline portable extract |
| `.references/taches/skills/create-mcp-servers/references/large-api-pattern.md` | Large APIs | Resources meta-tool; 3-op threshold | Pattern API-agnostic | — | — |
| `.references/taches/skills/create-mcp-servers/workflows/create-new-server.md` | New server | Architecture from operation count; secret hygiene | Never receive secrets in chat | AskUserQuestion; agent delegation | — |
| `.references/taches/skills/create-mcp-servers/workflows/troubleshoot-server.md` | Broken server | Five issue classes; credential escalation ladder | "STOP. Delete. Rotate." | — | — |
| `.references/taches/skills/create-mcp-servers/references/best-practices.md` | Hygiene | stderr logging; directory isolation | Two most violated practices | — | — |
| `.references/taches/skills/create-mcp-servers/references/oauth-implementation.md` | OAuth MCP | Stdio isolation; pre-auth | Security-critical | — | — |
| `.references/taches/skills/create-mcp-servers/references/response-optimization.md` | Payload size | MANDATORY checklist | Self-contained | — | — |
| `.references/taches/skills/create-mcp-servers/templates/operations.jsonon` | Meta-tool naming | `_meta_tools` four-pack | Verbatim JSON shape | — | Discovery API surface |

*Remaining MCP references (`typescript-implementation`, `python-implementation`, `tools-and-resources`, `testing-and-deployment`, `creation-workflow`, `traditional-pattern`, `api-research-template`, `adaptive-questioning-guide`, `auto-installation`, `validation-checkpoints`, `update-existing-server`) align with section 3 PORT/PARTIAL one-liners: strip paths/vendor examples; keep error hierarchies, path-traversal checks, pyramid/CI patterns.*

### 4f. Meta-prompting pipeline (`.references/taches/skills/create-meta-prompts/`)

| Source file | Trigger | Steps / Contract | Quality bar | Strip before porting | Notes |
|---|---|---|---|---|---|
| `.references/taches/skills/create-meta-prompts/SKILL.md` | Chained Claude prompts | 7-step loop; Research/Plan/Do/Refine; SUMMARY.md inline | Metadata on research/plan outputs | `.prompts/` folders; AskUserQuestion; Task spawn; `!` shell | SUMMARY + taxonomy = highest value |
| `.references/taches/skills/create-meta-prompts/references/metadata-guidelines.md` | Handoffs | Four-field metadata; confidence tiers | Inter-prompt contract | — | — |
| `.references/taches/skills/create-meta-prompts/references/summary-template.md` | SUMMARY.md | One-liner substance rule; Key Findings by purpose | Field completeness | — | — |
| `.references/taches/skills/create-meta-prompts/references/plan-patterns.md` | Plan prompts | Phase/task XML; decision framework variant | Fit scores per criterion | — | — |
| `.references/taches/skills/create-meta-prompts/references/do-patterns.md` | Do prompts | "Avoid X — because Y" constraints | Paired rationale | — | — |
| `.references/taches/skills/create-meta-prompts/references/research-patterns.md` | Research prompts | Incremental write; verification; quality_report | Same as plans research template family | `.prompts/`; `!date` | Dedupe with create-plans research templates |
| `.references/taches/skills/create-meta-prompts/references/refine-patterns.md` | Refine prompts | preserve / feedback / requirements tripartite | Clear merge semantics | Numbered folder scheme | — |
| `.references/taches/skills/create-meta-prompts/references/intelligence-rules.md` | Authoring rules | Streaming writes; pair constraints with why | — | — | — |
| `.references/taches/skills/create-meta-prompts/references/question-bank.md` | Intake questions | Max 4 questions; implications; prefer options | six question_rules | AskUserQuestion tool refs | — |

### 4g. Slash-command authoring (`.references/taches/skills/create-slash-commands/`)

| Source file | Trigger | Steps / Contract | Quality bar | Strip before porting | Notes |
|---|---|---|---|---|---|
| `.references/taches/skills/create-slash-commands/SKILL.md` | Author slash commands | Analyse → YAML → XML body → calibrate complexity → save | `<intelligence_rules>` simple vs complex | `$ARGUMENTS`, allowed-tools, paths | — |
| `.references/taches/skills/create-slash-commands/references/patterns.md` | Templates | objective/context/process/success_criteria | SequentialThinking pattern → generic "structured reasoning tool" | — | — |
| `.references/taches/skills/create-slash-commands/references/arguments.md` | Args | argument-hint; composites | — | — | — |
| `.references/taches/skills/create-slash-commands/references/tool-restrictions.md` | Security | Exfiltration/destructive/deploy trio; read-only git diff bash | — | — | Rare in other trees |

### 4h. Autonomous loop (`.references/taches/skills/setup-ralph/`)

| Source file | Trigger | Steps / Contract | Quality bar | Strip before porting | Notes |
|---|---|---|---|---|---|
| `.references/taches/skills/setup-ralph/SKILL.md` | Ralph / auto loop | Four-way router to workflows | Abstract: plan/build/observe + backpressure | Ralph names; missing workflow detail in snapshot | SKILL is thin router |
| `.references/taches/skills/setup-ralph/references/validation-strategy.md` | Steering via checks | Backpressure model; four validation types | Escalation ladder | — | Fully portable |
| `.references/taches/skills/setup-ralph/references/ralph-fundamentals.md` | Why loops work | Fresh context; file as state | — | Bash escapes | — |
| `.references/taches/skills/setup-ralph/references/project-structure.md` | State file | Only IMPLEMENTATION_PLAN persists | Spec scoping test | loop.sh diagrams | — |
| `.references/taches/skills/setup-ralph/references/operational-learnings.md` | Maturity | Anti-pattern catalogue; five-phase arc | — | Ralph branding | — |
| `.references/taches/skills/setup-ralph/references/prompt-design.md` | Prompt minimalism | Five anti-patterns; start minimal | — | Templates | — |
| `.references/taches/skills/setup-ralph/workflows/setup-new-loop.md` | Setup | Backpressure menu; security notice | — | Ralph tooling | — |
| `.references/taches/skills/setup-ralph/workflows/understand-ralph.md` | Educate | Three-phase; when-to-use gate | — | Attribution | — |
| `.references/taches/skills/setup-ralph/workflows/customize-loop.md` | Customize | Four axes; one iteration before commit | — | Flags | — |
| `.references/taches/skills/setup-ralph/workflows/troubleshoot-loop.md` | Debug loop | Four-tier escape hatch | — | Filenames | — |
| `.references/taches/skills/setup-ralph/templates/PROMPT_build.md` | Build prompt | One task per iteration; safety rm guard | — | Persona counts | — |
| `.references/taches/skills/setup-ralph/templates/PROMPT_plan.md` | Plan prompt | Plan-only discipline | — | Paths | — |

### 4i. Analytical reasoning commands (`.references/taches/commands/consider/`)

Each file: user invokes reasoning command → follow numbered structure → emit fixed output sections. **Strip:** XML wrappers, `$ARGUMENTS`. **Quality bar:** complete structured output, no external deps.

| Source file | Trigger | Steps / Contract | Quality bar | Strip before porting | Notes |
|---|---|---|---|---|---|
| `.references/taches/commands/consider/first-principles.md` | First principles | Five-step rebuild loop | State→assumptions explicit | Frontmatter noise | — |
| `.references/taches/commands/consider/inversion.md` | Inversion | Goal invert → failures → anti-goals | Residual risk section | — | — |
| `.references/taches/commands/consider/second-order.md` | Consequences | Chain to 2nd/3rd order | Optional 3rd order | — | — |
| `.references/taches/commands/consider/10-10-10.md` | Time horizons | 10/10/10 analysis | Time Conflicts section | — | — |
| `.references/taches/commands/consider/opportunity-cost.md` | Trade-offs | Five-step cost framing | Structured sections | — | — |
| `.references/taches/commands/consider/pareto.md` | Prioritisation | Vital Few / Trivial Many | Bottom Line sentence | — | — |
| `.references/taches/commands/consider/swot.md` | SWOT | Strategic Moves cross-quadrant | Not a bare grid | — | — |
| `.references/taches/commands/consider/via-negativa.md` | Subtraction | Subtraction Candidates table | — | — | — |
| `.references/taches/commands/consider/5-whys.md` | Root cause | Structured whys | — | — | — |
| `.references/taches/commands/consider/eisenhower-matrix.md` | Triage | Q1–Q4 directives | — | — | — |
| `.references/taches/commands/consider/occams-razor.md` | Simplicity | Assumptions + evidence | — | — | — |
| `.references/taches/commands/consider/one-thing.md` | Focus | Single leverage + Next Action | — | — | — |

### 4j. Research workflow commands (`.references/taches/commands/research/`)

| Source file | Trigger | Steps / Contract | Quality bar | Strip before porting | Notes |
|---|---|---|---|---|---|
| `.references/taches/commands/research/competitive.md` | Competitive | `<claude_context>` table stakes / positioning | — | AskUserQuestion; artifact paths | — |
| `.references/taches/commands/research/deep-dive.md` | Deep dive | Remaining Unknowns section | Forces honesty | — | — |
| `.references/taches/commands/research/feasibility.md` | Feasibility | Three axes + simpler_version | — | — | — |
| `.references/taches/commands/research/landscape.md` | Landscape | MECE + adopt/watch/avoid | — | — | — |
| `.references/taches/commands/research/history.md` | History | adopt/avoid/changed context | — | — | — |
| `.references/taches/commands/research/open-source.md` | OSS | Maintenance heuristics | Flags stale/solo | — | — |
| `.references/taches/commands/research/options.md` | Options | Runner-up + switch_cost | — | — | — |
| `.references/taches/commands/research/technical.md` | Technical | implementation sub-block | Bridges to build | — | — |

### 4k. Project management (`.references/taches/docs/` + `.references/taches/commands/`)

| Source file | Trigger | Steps / Contract | Quality bar | Strip before porting | Notes |
|---|---|---|---|---|---|
| `.references/taches/docs/context-handoff.md` | Session end | Six-section XML handoff | Prevents scope creep | Install paths; branding | Same schema as whats-next family |
| `.references/taches/docs/meta-prompting.md` | Meta pattern | Analysis vs execution split | — | Command file deps | Pointer doc |
| `.references/taches/docs/todo-management.md` | Todos | TO-DOS.md entry shape | Problem/Files/Solution | YouTube; install | Needs sibling commands for full SOP |
| `.references/taches/commands/ask-me-questions.md` | Intake | Three-phase gate; five axes | — | — | — |
| `.references/taches/commands/heal-skill.md` | Self-repair skill | Approval + diff + four-option gate | — | — | — |
| `.references/taches/commands/add-to-todos.md` | Capture todo | Structured markdown entry | — | Interactive | — |
| `.references/taches/commands/check-todos.md` | Resume todo | Parse→dispatch state machine | — | Taches mappings | — |
| `.references/taches/commands/run-plan.md` | Execute plan | Three routing strategies; context budget | — | SUMMARY/ROADMAP updates | — |
| `.references/taches/commands/create-prompt.md` | Create prompt | Adaptive intake; parallel/seq heuristic | XML construction rules | SlashCommand; `./prompts/` | — |
| `.references/taches/commands/run-prompt.md` | Run prompts | Parallel dispatch; sequential early-stop | — | — | — |
| `.references/taches/commands/whats-next.md` | Continuation | Six-section handoff | — | — | — |

### 4l. Platform expertise — partial extracts only

| Source file | Trigger | Steps / Contract | Quality bar | Strip before porting | Notes |
|---|---|---|---|---|---|
| `.references/taches/skills/expertise/iphone-apps/SKILL.md` | iOS work | Six principles header | Principles only | All iOS tooling | Merge with macOS SKILL |
| `.references/taches/skills/expertise/macos-apps/SKILL.md` | macOS work | Six principles header | Dedupe with iOS | macOS tooling | One merged "app craft" SOP |
| `.references/taches/skills/expertise/iphone-apps/references/app-architecture.md` | Architecture review | DI + coordinator + error enum shape | No Swift code | All code | — |
| `.references/taches/skills/expertise/iphone-apps/references/testing.md` | Testing review | AAA; naming convention | No Swift macros | Swift | — |
| `.references/taches/skills/expertise/macos-apps/references/networking.md` | Networking | OAuth dedupe; backoff; offline | No actors | Swift | — |
| `.references/taches/skills/expertise/macos-apps/references/security-code-signing.md` | Ship security | Four rules pipeline | No code | Swift | — |
| `.references/taches/skills/expertise/macos-apps/references/design-system.md` | Design tokens | Semantic tokens; motion; contrast | No SwiftUI | SwiftUI | — |
| `.references/taches/skills/expertise/macos-apps/references/testing-tdd.md` | TDD philosophy | What not to test | Minimal UI tests principle | XCTest | — |
| `.references/taches/skills/expertise/n8n-automations/SKILL-SPEC.yaml` | Meta format | YAML skill-spec shape | Batch workflow ordering | n8n domain | Portable schema pattern |

### 4m. Auditor agents

| Source file | Trigger | Steps / Contract | Quality bar | Strip before porting | Notes |
|---|---|---|---|---|---|
| `.references/taches/agents/skill-auditor.md` | Audit SKILL.md | Read refs → evaluate 4 areas → severity report | Contextual judgment tiers | `@skills/create-agent-skills/…` paths | Template for any skill library |
| `.references/taches/agents/subagent-auditor.md` | Audit subagent | 6 critical + 6 recommended areas; anti_patterns catalogue | Severity schema | `@skills/create-subagents/…` steps 1–4 | Self-demonstrating XML |
| `.references/taches/agents/slash-command-auditor.md` | Audit command | Five areas; contextual judgment | — | `@skills/create-slash-commands/…` | — |

### 4n. Miscellaneous portable fragments

| Source file | Trigger | Steps / Contract | Quality bar | Strip before porting | Notes |
|---|---|---|---|---|---|
| `.references/taches/commands/debug.md` | Debug command | objective/process/success_criteria triple | Minimal pattern | Rest of file | Thin wrapper |
| `.references/taches/commands/setup-ralph.md` | Invoke Ralph skill | `allowed-tools: Skill(setup-ralph)` one-liner | Shows minimal command shape | — | Pattern only |

---

## 5. Portability Ranking

### Tier A — Highest impact (promote first)

1. `.references/taches/skills/create-agent-skills/` cluster (SKILL + references + workflows + templates) — complete authoring methodology; lowest strip burden.
2. `.references/taches/skills/create-plans/references/plan-format.md` + `.references/taches/skills/create-plans/references/checkpoints.md` + `.references/taches/skills/create-plans/references/context-management.md` — executable planning contract bundle.
3. `.references/taches/skills/debug-like-expert/` — scientific debugging loop minus domain loader.
4. `.references/taches/commands/consider/` + `.references/taches/commands/research/` — zero-platform reasoning and research scaffolds.
5. `.references/taches/skills/create-mcp-servers/` — op-count architecture rule + security stderr/credential patterns.

### Tier B — High value with structured strip

6. `.references/taches/skills/create-plans/SKILL.md` and `.references/taches/skills/create-plans/workflows/` — strip `.planning/`, AskUserQuestion, and routing to `.references/taches/skills/create-plans/workflows/`; keep principles and deviation taxonomy.
7. `.references/taches/skills/create-meta-prompts/` — strip `.prompts/` and Task plumbing; keep SUMMARY.md contract and purpose taxonomy.
8. `.references/taches/skills/create-subagents/` — strip storage and vendor commands; keep black-box and least-privilege model.
9. `.references/taches/agents/skill-auditor.md`, `.references/taches/agents/subagent-auditor.md`, `.references/taches/agents/slash-command-auditor.md` — strip hardcoded `@skills/...` read lists; keep rubrics.

### Tier C — Medium / selective promotion

10. `.references/taches/skills/setup-ralph/` — principles only (backpressure, plan-as-state); drop Ralph branding and tooling.
11. `.references/taches/skills/create-slash-commands/` — XML authoring standard; drop Claude invocation syntax.
12. `.references/taches/docs/context-handoff.md`, `.references/taches/commands/whats-next.md`, `.references/taches/commands/heal-skill.md` — session and self-correction hygiene.

### Tier D — Domain-bounded partials

13. Apple expertise references listed in §4l — principles and checklists only; no SDK code promotion.

---

## 6. Cross-Cutting Primitives

Patterns recurring across two or more domains — candidates for shared base SOPs or explicit cross-links in the target skills tree.

| ID | Primitive | Where it appears | Promotion note |
|---|---|---|---|
| **P1** | Router + delegated workflows + reference index | `.references/taches/skills/create-agent-skills/`, `.references/taches/skills/create-plans/`, `.references/taches/skills/create-mcp-servers/`, `.references/taches/skills/setup-ralph/` | Canonical pattern lives in `.references/taches/skills/create-agent-skills/`; others should cite it rather than re-specify. |
| **P2** | Plans-as-prompts (PLAN is executable, not a summary doc) | `.references/taches/skills/create-plans/`, `.references/taches/skills/create-meta-prompts/references/plan-patterns.md`, GEP-adjacent command docs | Merge `.references/taches/skills/create-plans/references/plan-format.md` with `.references/taches/skills/create-meta-prompts/references/plan-patterns.md` on promotion to avoid drift. |
| **P3** | Checkpoint taxonomy + automate-first | `.references/taches/skills/create-plans/references/checkpoints.md`, `.references/taches/skills/create-plans/references/cli-automation.md`, `.references/taches/skills/create-plans/references/user-gates.md` | Single "human-in-the-loop" SOP with three checkpoint types. |
| **P4** | XML-over-markdown body discipline | `.references/taches/skills/create-agent-skills/`, `.references/taches/skills/create-subagents/`, `.references/taches/skills/create-slash-commands/`, `.references/taches/agents/skill-auditor.md`, `.references/taches/agents/subagent-auditor.md`, `.references/taches/agents/slash-command-auditor.md` | Enforce shared tag vocabulary + intelligence_rules. |
| **P5** | Research quality gates (pitfalls + red flags + confidence levels) | `.references/taches/skills/create-plans/references/research-pitfalls.md`, `.references/taches/skills/create-meta-prompts/references/research-pitfalls.md`, `.references/taches/skills/create-meta-prompts/references/research-patterns.md`, `.references/taches/commands/research/` | **Dedupe** meta vs plans research-pitfalls to one file; link from all research entry points. |
| **P6** | SUMMARY.md / handoff six-section schemas | `.references/taches/skills/create-meta-prompts/`, `.references/taches/skills/create-plans/templates/`, `.references/taches/docs/context-handoff.md`, `.references/taches/commands/whats-next.md` | Unify field names or provide mapping table when merging repos. |
| **P7** | Severity-tiered audit output | `.references/taches/agents/skill-auditor.md`, `.references/taches/agents/subagent-auditor.md`, `.references/taches/agents/slash-command-auditor.md` | Portable report scaffold for any text-based agent artifact. |
| **P8** | Least privilege + tool allow-lists | `.references/taches/skills/create-subagents/`, `.references/taches/skills/create-slash-commands/references/tool-restrictions.md`, `.references/taches/skills/create-mcp-servers/references/best-practices.md`, `.references/taches/skills/create-mcp-servers/references/auto-installation.md` | Cross-link MCP "never secrets in chat" with slash-command exfiltration rules. |
| **P9** | Eval-driven iteration (A/B roles, rubrics) | `.references/taches/skills/create-agent-skills/references/iteration-and-testing.md`, `.references/taches/skills/create-subagents/references/evaluation-and-testing.md`, `.references/taches/skills/debug-like-expert/references/verification-patterns.md` | Single "test the skill, not the author" meta-policy. |
| **P10** | Backpressure via validation ladder | `.references/taches/skills/setup-ralph/references/validation-strategy.md`, `.references/taches/skills/create-mcp-servers/references/testing-and-deployment.md`, `.references/taches/skills/debug-like-expert/SKILL.md` | Common theme: tests/lints as steering, not ceremony. |

---

## 7. Evidence

Citations traceable to claims in `raw-findings.md` (taches snapshot).

> **[E1]** `.references/taches/skills/create-agent-skills/SKILL.md`: *"Entire methodology (SKILL.md structure, XML-over-markdown body, progressive disclosure, router pattern, folder conventions) is framework-agnostic and carries no taches-specific logic or org dependencies."*

> **[E2]** `.references/taches/skills/create-plans/SKILL.md`: *"The implementation — routing to `.references/taches/skills/create-plans/workflows/`… is all taches-internal"* — in this audit paraphrased with the absolute workflows path: routing to `.references/taches/skills/create-plans/workflows/` plus `.planning/` and domain-expertise loading must be stripped; principles remain portable.

> **[E3]** `.references/taches/skills/create-mcp-servers/SKILL.md`: *"The operation-count architecture rule (≤2 → flat tools, ≥3 → meta-tool discovery) is the highest-value portable extract."*

> **[E4]** `.references/taches/skills/debug-like-expert/SKILL.md`: *"Two cleanly separable layers — (1) a high-quality portable scientific debugging SOP, (2) a taches-specific domain-expertise loader."*

> **[E5]** `.references/taches/skills/create-plans/references/checkpoints.md` family: *"The three-type taxonomy and golden rule ('if Claude CAN automate it, Claude MUST automate it') are fully portable SOPs."*

> **[E6]** `.references/taches/skills/create-meta-prompts/SKILL.md`: *"SUMMARY.md contract and the four-field metadata schema are the highest-value portable extractions."*

> **[E7]** `.references/taches/commands/consider/` + `.references/taches/commands/research/` raw cluster: *"Pure reasoning frameworks with zero platform coupling"* (section 2 summary) — evidenced by absence of toolchain hooks beyond optional AskUserQuestion in research commands (strippable).

> **[E8]** `.references/taches/agents/subagent-auditor.md`: *"The `<contextual_judgment>` section and `<anti_patterns>` catalogue with severity + detection + fix triplets are particularly strong portable primitives."*

> **[E9]** Research pitfalls duplication: *"Same eight-pitfall catalog"* appears in both `.references/taches/skills/create-meta-prompts/references/research-pitfalls.md` and `.references/taches/skills/create-plans/references/research-pitfalls.md` — promote once (see **P5**).

> **[E10]** `.references/taches/skills/create-hooks/SKILL.md`: *"No analogous primitive exists outside the Claude Code runtime"* — LEAVE entire hook cluster for platform-specific installs only.

> **[E11]** `.references/taches/skills/setup-ralph/` raw notes: *"Key extractable principles: fresh-context-per-iteration, backpressure-as-steering, plan-file-as-shared-state"* despite Ralph branding.

> **[E12]** `.references/taches/skills/create-slash-commands/SKILL.md`: *"The `<intelligence_rules>` section … is the strongest portable heuristic"* for complexity calibration of command templates.

---

*End of audit report. All claims above are traceable to observations in `.plans/audits/taches/raw-findings.md` and the taches mirror under `.references/taches/`. No inferences from external sources.*


