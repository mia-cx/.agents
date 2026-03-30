
## skills/create-agent-skills/SKILL.md
**Type**: Meta/router skill — teaches how to create Claude Code skills; uses router pattern (intake → routing table → delegated workflows).
**Portable**: Yes
**Reason**: Entire methodology (SKILL.md structure, XML-over-markdown body, progressive disclosure, router pattern, folder conventions) is framework-agnostic and carries no taches-specific logic or org dependencies.
**Trigger**: `create skill`, `audit skill`, `add component`, `SKILL.md`, `build new skill`, `refine skill` — well-scoped, minimal false-positive risk.
**Steps/contract**: (1) Essential principles inline in SKILL.md (always loaded). (2) `<intake>` asks user intent. (3) `<routing>` table maps response to `workflows/*.md`. (4) Workflow specifies which `references/` to load. Separation of concerns: principles → SKILL.md, procedures → workflows/, knowledge → references/, output structures → templates/, executable code → scripts/.
**Strip**: (a) `<intake>` wait-for-response gate is chat-interactive and breaks in non-interactive agent chains — replace with intent-based auto-routing. (b) `<routing>` table delegates to local `workflows/` files; those files must transfer with the skill or be inlined. (c) `<reference_index>` and `<workflows_index>` list file names that are taches-local paths.
**Notes**: Direct analogue of `skills/skill-create/SKILL.md` in the target repo — strong comparison candidate. Target skill should be evaluated against this one for: XML-only body discipline, router pattern completeness, progressive disclosure enforcement (500-line SKILL.md cap), and the `templates/` + `scripts/` folder distinctions which may be absent in the target.

## skills/create-subagents/SKILL.md
**Type**: How-to / reference guide — creating and configuring Claude Code subagents (YAML frontmatter, system prompt design, tool restrictions, orchestration patterns).
**Portable**: Partially — core principles are highly portable; taches-specific tooling is not.
**Reason**: The execution model ("subagents are black boxes, no user interaction, return final output"), system prompt XML structure rules, least-privilege tool guidance, and the main-chat-vs-subagent workflow design pattern are genuine reusable SOPs. The `/agents` TUI command, `.claude/agents/` file paths, and cross-links to internal taches reference docs are platform-specific.
**Trigger**: Working with subagents, configuring agent roles, delegating autonomous tasks, designing multi-agent orchestration workflows.
**Steps/contract**: (1) Name/describe/tool/model frontmatter; (2) system prompt structured with pure XML tags (role, constraints, workflow, output_format, success_criteria); (3) black-box execution model — no AskUserQuestion, no mid-run user interaction; (4) least-privilege tool list; (5) description field optimised for automatic routing; (6) success criteria checklist (valid frontmatter, clear role, tool restrictions, XML structure, tested on representative tasks).
**Strip**: `/agents` slash-command references, `.claude/agents/` / `~/.claude/agents/` path conventions, all `[references/…]` cross-links (taches-internal docs), plugin `agents/` dir priority table.
**Notes**: `<execution_model>` and `<system_prompt_guidelines>` blocks are the highest-value portable content — especially the "black box" constraint list and the main-chat/subagent workflow split diagram. `<success_criteria>` is a clean checklist worth lifting verbatim (minus model-name specifics). Overlaps with `create-agent-skills` skill; dedup needed if both are promoted.

## skills/debug-like-expert/SKILL.md
**Type**: Debugging methodology / scientific investigation protocol
**Portable**: YES — core protocol is fully portable; domain-expertise-loading layer is taches-internal
**Reason**: The scientific debugging loop (document state → map system → form hypotheses → test each → verify fix) is universal across languages and platforms. The cognitive-bias framing ("treat code you wrote with MORE skepticism than unfamiliar code") is a standout portable insight. Output format, critical rules (no drive-by fixes, one variable at a time, complete reads), and success-criteria checklist are all solid SOP material. The domain-expertise mechanism (`~/.claude/skills/expertise/`) is taches-specific infrastructure and should be stripped.
**Trigger**: Standard troubleshooting has failed; complex or recurring bug requiring systematic root-cause analysis; user reports a hard-to-reproduce or mysterious issue.
**Steps/contract**:
  1. Gather evidence — exact error, repro steps, actual vs expected output, execution path
  2. Map the system — trace entry point to failure, read relevant files completely, identify dependencies
  3. Form hypotheses — each backed by specific evidence
  4. Test each hypothesis — design minimal experiments, document results, eliminate or confirm
  5. Design minimal fix — only after root cause confirmed; assess side effects
  6. Verify — re-run reproduction steps, run tests, check for regressions
  7. Pass success-criteria checklist before declaring done
**Strip**:
  - `context_scan` bash block (hardcodes `~/.claude/skills/expertise/` path)
  - Entire `domain_expertise` section (inference table, scan_domains, load_domain, no_inference — all taches-internal)
  - All `references/*.md` hyperlinks (taches-internal files not present in a portable skill)
**Notes**: Two cleanly separable layers — (1) a high-quality portable scientific debugging SOP, (2) a taches-specific domain-expertise loader. A promoted skill should keep layer 1 verbatim and drop layer 2 entirely. The `output_format` block and `critical_rules` list are ready to use as-is. "VERIFY, DON'T ASSUME" and the cognitive-bias warning are worth preserving word-for-word.

## skills/create-plans/SKILL.md

**Type**: Planning/orchestration skill — creates hierarchical project plans optimised for solo agentic (one human + Claude) development workflows. Covers brief creation, roadmap definition, phase plan authoring, research prompts, handoffs, and milestone marking.

**Portable**: Partially. The *principles* are highly portable; the *implementation scaffolding* is taches-specific.

**Reason**: Five principles transfer cleanly to any planning context: (1) plans-as-prompts (PLAN.md IS the execution prompt, not a doc that gets transformed), (2) scope control / context degradation curve (cap plans at 50% context, 2–3 tasks max per plan, 10 small atomic plans beat 3 large degraded ones), (3) deviation rules (5 embedded rules: auto-fix bugs, auto-add missing critical, auto-fix blockers, ask about architectural, log enhancements), (4) checkpoint taxonomy (human-verify vs decision vs human-action — Claude must automate via CLI/API whenever possible, never delegate to human what a tool can do), (5) anti-enterprise pattern list (no RACI, no sprint ceremonies, no multi-week estimates, no documentation for documentation's sake). The *implementation* — routing to `workflows/`, loading `~/.claude/skills/expertise/`, the `.planning/` directory tree, the `/run-plan` slash command, domain inference tables — is all taches-internal and must be stripped.

**Trigger**: User wants to plan a project, write a brief, build a phase roadmap, or structure work for agentic execution.

**Steps/contract**:
1. Context scan (detect git repo, existing `.planning/` structure, handoff files).
2. Present intake menu tailored to detected state (no structure / partial / handoff found).
3. Route to appropriate sub-workflow (brief → roadmap → phase plan → summary).
4. Produce PLAN.md *as* the execution prompt (objective + context refs + tasks with verify/done criteria + success criteria).
5. Maintain hierarchy: BRIEF → ROADMAP → PLAN → SUMMARY (SUMMARY.md existence = phase complete).
6. Handle deviations automatically per 5-rule protocol; document all in SUMMARY.

**Strip**:
- All `workflows/`, `references/`, `templates/` internal path routing
- Domain expertise loading machinery (`~/.claude/skills/expertise/` scanning, inference tables, load_domain section)
- `/run-plan` slash command references
- Taches-specific `.planning/phases/NN-name/NN-NN-PLAN.md` naming convention (portable version should be naming-agnostic)
- `context_scan` bash block targeting `.planning/` structure
- Git commit timing rules tied to taches workflow

**Notes**: Strongest portable extractions are likely three standalone SOPs: (A) **Agentic Plan Format** — the plans-as-prompts contract with task schema (type/files/action/verify/done/checkpoints); (B) **Scope Control Protocol** — context degradation curve + atomicity rule (2–3 tasks, split aggressively); (C) **Deviation Handling Rules** — the 5-rule embedded protocol with auto-fix vs escalate boundary. The checkpoint taxonomy (automate-first rule) is also independently valuable and could merge into a general agentic-execution SOP.


## skills/create-hooks/SKILL.md
**Type**: Reference/how-to skill — teaches creation and configuration of Claude Code hooks (event-driven shell/LLM automation).
**Portable**: No — tightly coupled to Claude Code's proprietary hook system (`PreToolUse`, `PostToolUse`, `Stop`, etc.), `~/.claude/hooks.json` config format, `$CLAUDE_PROJECT_DIR` env var, and `--debug` flag. No analogous primitive exists outside the Claude Code runtime.
**Reason**: The entire skill is an API reference and tutorial for a Claude Code-specific feature. The hook event names, JSON schema, `$ARGUMENTS` placeholder, `stop_hook_active` flag, and `hookSpecificOutput` envelope are all internal Claude Code contracts. Extracting this as a generic SOP would produce only vacuous prose ("configure event listeners") with no actionable content outside this platform.
**Trigger**: User asks about hooks, event listeners, command validation, blocking tool use, session-start injection, auto-formatting on edit, or custom stop logic within Claude Code.
**Steps/contract**: (1) Create `.claude/hooks.json` at project or user scope. (2) Choose event (PreToolUse / PostToolUse / Stop / SessionStart / etc.). (3) Set matcher regex (tool name or pattern). (4) Configure hook as `command` (stdin JSON → shell) or `prompt` (LLM evaluates `$ARGUMENTS`). (5) For blocking hooks, return `{"decision":"approve"|"block","reason":"..."}`. (6) Validate with `jq` and test with `claude --debug`. (7) Guard Stop hooks with `stop_hook_active` to prevent loops.
**Strip**: Nothing portable survives — the entire skill content is Claude Code-specific.
**Notes**: The security checklist (infinite-loop prevention, timeout, path safety, permission check) contains good general advice for hook-like systems, but it's already embodied in more generic SOPs (safe-scripting, CI guardrails). Do not promote to skills tree as a portable SOP.

## skills/create-mcp-servers/SKILL.md
**Type**: Builder / process skill — full workflow for creating MCP servers (Python or TypeScript), including intake, architecture selection, configuration, and verification.
**Portable**: Yes — core principles and decision heuristics are portable; some surface details are Claude Code / macOS specific.
**Reason**: Three genuinely portable extracts: (1) **The 5 Rules** (no hardcoded secrets, use `cwd`, absolute paths, one server per directory, prefer `uv`) encode durable MCP hygiene regardless of platform. (2) **Architecture decision heuristic** — 1-2 operations → traditional flat-tools pattern; 3+ operations → on-demand discovery meta-tools (discover / get_schema / execute / continue) — is a clean, tool-count-driven design rule with wide applicability. (3) **Security checklist** (never paste secrets in chat, always env vars, `${VAR}` expansion in configs, rotate on exposure) is fully portable to any secret-handling context.
**Trigger**: User wants to build or extend an MCP server, create a custom Claude tool integration, or expose an API/data source to Claude.
**Steps/contract**: Routing gate (no context → ask mode; context provided → go straight to create-new-server workflow) → 8-step creation workflow → architecture selection → language-specific implementation → validation checkpoints → install in Claude Code + Claude Desktop → verify `✓ Connected`.
**Strip**: `claude mcp add/list/remove` CLI commands (Claude Code-specific), `~/Library/Logs/Claude/` log paths (macOS-specific), `uv` over `pip` preference (opinionated toolchain choice, not a universal SOP rule), and the sub-workflow/template index (implementation scaffolding, not portable policy).
**Notes**: The **operation-count architecture rule** (≤2 → flat tools, ≥3 → meta-tool discovery) is the highest-value portable extract — it's a concrete, actionable design heuristic rarely documented this clearly. The security checklist's "STOP. Delete conversation. Rotate credentials." escalation ladder is also worth lifting verbatim into any secrets-handling SOP.

## skills/create-meta-prompts/SKILL.md
**Type**: Workflow orchestration — creates and executes multi-stage Claude-to-Claude prompt chains (Research → Plan → Do → Refine) with folder conventions, dependency-graph execution, output validation, and SUMMARY.md reporting.
**Portable**: Partially — core concepts are strongly portable; execution infrastructure is taches-specific.
**Reason**: The Research/Plan/Do/Refine purpose taxonomy, chained-prompt dependency model, SUMMARY.md contract, XML output metadata schema (`<confidence>`, `<dependencies>`, `<open_questions>`, `<assumptions>`), and post-run validation gates are genuinely reusable patterns for any multi-stage LLM pipeline. The interactive `AskUserQuestion` TUI intake, Task-agent spawning, and `.prompts/` folder convention are taches-specific infrastructure that would need to be abstracted.
**Trigger**: User wants to design prompts for Claude-to-Claude pipelines, build multi-stage workflows (research → plan → implement), or structure chained LLM outputs for downstream consumption.
**Steps/contract**: 7-step loop — (1) Intake (purpose: Do/Plan/Research/Refine + topic), (2) Chain detection (scan existing research/plan outputs), (3) Generate prompt using purpose-specific patterns, (4) Save to numbered `.prompts/{n}-{topic}-{purpose}/` folder, (5) Present decision tree, (6) Execute (single / sequential / parallel / mixed-DAG), (7) Summarize via SUMMARY.md displayed inline. Output contract per run: typed prompt file, output artifact, SUMMARY.md with one-liner + Key Findings + Decisions Needed + Blockers + Next Step. Research/Plan outputs additionally require XML metadata block.
**Strip**: Remove: `.prompts/` folder naming convention, `AskUserQuestion` TUI calls, Task-agent spawning mechanics, `completed/` archival move commands, dynamic shell context probes (`!` commands). Keep: purpose taxonomy (Do/Plan/Research/Refine), dependency graph execution model (parallel/sequential/mixed-DAG), SUMMARY.md contract + required fields, XML metadata schema, validation checklist (file exists, non-empty, metadata present, substantive one-liner).
**Notes**: SUMMARY.md contract and the four-field metadata schema are the highest-value portable extractions — they define a clean inter-prompt handoff protocol reusable in any multi-agent pipeline. The Research/Plan/Do/Refine taxonomy is crisp and worth canonicalising. The dependency detection heuristic (infer from purpose when no explicit `@` refs) is a useful default-rule pattern.

## skills/create-slash-commands/SKILL.md
**Type**: Meta/teaching skill — guides authoring of Claude Code slash commands (`.claude/commands/*.md`); not a workflow SOP itself but a structured prompt-engineering reference.
**Portable**: Partially. The XML structural conventions (`<objective>`, `<process>`, `<success_criteria>` + conditional tags) and the 6-step generation protocol are tool-agnostic prompt-authoring patterns. The invocation syntax (`$ARGUMENTS`, `!backtick`, `@file`, `allowed-tools`) is Claude Code-specific.
**Reason**: The skill packages two separable things: (1) a *portable authoring standard* for any agent command/prompt template (XML tag schema, complexity classification, argument-handling rules), and (2) *Claude Code-specific mechanics* (frontmatter fields, bash pre-execution, file reference syntax). The former is worth extracting; the latter is a lookup reference.
**Trigger**: User wants to create or improve a slash command; working with `.claude/commands/`; needs to standardise reusable prompt templates across a team.
**Steps/contract**: (1) Analyse request — purpose, arguments needed, artifacts produced, simple vs complex; (2) Write YAML frontmatter (`description` required; `argument-hint` if args; `allowed-tools` if restricted); (3) Build XML body with always-required tags (`<objective>`, `<process>`, `<success_criteria>`) plus conditional tags (`<context>`, `<verification>`, `<testing>`, `<output>`); (4) Integrate `$ARGUMENTS` or positional `$1/$2/$3` only when command operates on user-supplied data; (5) Calibrate detail to complexity (simple → 3 tags only, complex → add context/verification/output); (6) Save to `.claude/commands/` (project) or `~/.claude/commands/` (personal).
**Strip**: Relative `references/` file links (repo-specific); taches branding; the `<quick_start>` example duplicates patterns already in `<common_patterns>` — collapse to one.
**Notes**: The `<intelligence_rules>` section (simple vs complex command classification) is the strongest portable heuristic here. The generation protocol is a clean, reusable checklist for any prompt-template authoring SOP. Good candidate for a "how to author agent commands" SOP that abstracts above Claude Code specifics and works for any tool that supports slash/custom commands.

## docs/context-handoff.md
**Type**: Slash-command SOP — a `/whats-next` command that analyzes the current conversation and writes a structured XML handoff document (`whats-next.md`) for resuming work in a fresh context.
**Portable**: Yes
**Reason**: The pattern — "before closing a session, emit a structured snapshot covering original task / completed / remaining / attempted approaches / critical context / current state" — is universally applicable to any Claude Code workflow, regardless of repo or domain.
**Trigger**: Agent is near context limit, switching tasks, or handing off to another session; user wants a clean-slate continuation without losing progress.
**Steps/contract**:
1. User invokes `/whats-next` (or agent proactively triggers at context-pressure threshold).
2. Agent analyzes the full conversation.
3. Writes `whats-next.md` in the CWD using the six-section XML schema: `<original_task>`, `<work_completed>` (with file:line refs), `<work_remaining>`, `<attempted_approaches>`, `<critical_context>`, `<current_state>`.
4. Confirms creation; user references the file with `@whats-next.md` in the next session.
5. File is a snapshot — overwritten each run, deleted when work is complete.
**Strip**: Tâches-specific install path (`~/.claude/commands/`), branding footer, references to `/add-to-todos` (separate taches command).
**Notes**: The six-section XML schema is the transferable artifact. The "prevents scope creep" framing (focuses only on completing the original request, not adding new features) is a strong portable constraint worth preserving verbatim. Combines well with any progress-tracking SOP. Output file naming (`whats-next.md`) is a convention, not a hard requirement.

## skills/setup-ralph/SKILL.md
**Type**: Tool-setup / methodology-scaffold — initialises Geoffrey Huntley's "Ralph Wiggum" autonomous coding loop (PROMPT.md files, bash loop, GitHub backup)
**Portable**: Partially
**Reason**: The *scaffold steps* are tightly coupled to the Ralph tooling and its bespoke file layout, but the underlying principles—fresh context per iteration, backpressure via tests/lints/builds, file I/O as shared state, one-task-per-loop—are generalisable autonomous-agent-loop patterns worth extracting as standalone SOPs.
**Trigger**: User wants to set up an autonomous coding loop, mentions "Ralph", "autonomous loop", or wants iterative agent execution with fresh context windows.
**Steps/contract**: Intake → four-option routing table → load one of four sub-workflow files (`setup-new-loop.md`, `understand-ralph.md`, `customize-loop.md`, `troubleshoot-loop.md`). The SKILL.md itself is a dispatcher; all procedural detail lives in external workflow files not present here — skill cannot be evaluated standalone.
**Strip**: Geoffrey Huntley attribution and "Ralph Wiggum" branding are flavour; the portable SOP layer is the abstract pattern: (1) planning phase = gap analysis only, no commits; (2) building phase = pick task → implement → validate → commit; (3) observation phase = engineer environment, not direct task execution. Also strip the GitHub-backup default (`RALPH_BACKUP`) and `gh` CLI dependency.
**Notes**: High SOP signal for an "autonomous-loop setup" pattern. Key extractable principles: *fresh-context-per-iteration*, *backpressure-as-steering*, *plan-file-as-shared-state*. Would pair well with a `tdd` or `cot-gate` skill. Blocked from full assessment because the actual setup procedures are in referenced workflow files absent from this repo snapshot.

## docs/meta-prompting.md
**Type**: Conceptual guide / two-command workflow (`/create-prompt`, `/run-prompt`) for separating analysis from execution in Claude Code.
**Portable**: Partial — the *pattern* is portable; the concrete implementation assumes two custom slash-command files (`create-prompt.md`, `run-prompt.md`) installed in `~/.claude/commands/`, which are not included in this file.
**Reason**: The analysis-before-execution split is a sound, generalizable SOP; it reduces context pollution and produces specification-grade prompts. But the file is a README-style explainer, not a self-contained runnable skill — the actual prompt templates live elsewhere.
**Trigger**: User asks to build a complex feature (3+ distinct steps, multi-file changes, architectural decisions); mentions "meta-prompting", "generate a prompt first", or "clean sub-agent context".
**Steps/contract**: (1) User describes goal conversationally → (2) Claude asks clarifying questions, assesses task complexity → (3) Claude generates structured spec-grade prompt(s) with XML structure, success criteria, verification steps, "what to avoid and WHY" → (4) Saved as `.prompts/<nnn>-<slug>.md` → (5) Run in fresh sub-agent; prompt archived to `.prompts/completed/` on success. Parallel execution offered when tasks are independent.
**Strip**: Product credits ("Developed by TÂCHES"), YouTube link, installation instructions for the specific commands directory, per-project `.prompts/` directory convention (implementation detail).
**Notes**: High-signal pattern — the structured-prompt anatomy (XML, success criteria, verification protocol, failure-mode reasoning) is the extractable gold. Pairs naturally with the existing `cot-gate` skill (clarify → weigh alternatives → chosen plan). A distilled skill could codify *when* to invoke a sub-agent spec pass and *what anatomy* that spec must contain, without depending on the slash-command files.

## docs/todo-management.md
**Type**: Tool-installation docs — describes two slash commands (`/add-to-todos`, `/check-todos`) and a per-project `TO-DOS.md` format; not a self-contained SOP.
**Portable**: Low-to-medium. The *concept* (mid-session idea capture with structured context) and the *format spec* are portable, but the implementation depends on separate command files not present in this doc.
**Reason**: No runnable protocol is defined here — the actual command logic lives in `add-to-todos.md` and `check-todos.md` (installed globally, not reproduced). The doc is reference material for those commands, not the SOP itself.
**Trigger**: Agent is mid-task and notices a tangential improvement/bug but wants to stay on current focus without losing the idea.
**Steps/contract**: (1) Capture — write structured entry to `TO-DOS.md`: `## <Title> - <timestamp>` then `- **[Action] [Component]** — description. **Problem:** ... **Files:** path:lines. **Solution:** ...`. (2) Resume — list todos, select by number, load full context (problem/files/solution), check for project workflows (CLAUDE.md, skills), optionally invoke matching skill, remove todo from list, begin work.
**Strip**: YouTube link, TÂCHES branding, installation bash snippet, "Why This Works" marketing copy.
**Notes**: Extractable value is the `TO-DOS.md` entry format (structured fields: Problem, Files, Solution, timestamp) and the capture discipline (capture-in-moment → resume-with-context). If the actual command files (`add-to-todos.md`, `check-todos.md`) are found elsewhere in this repo, assess those for the richer SOP. As-is, this doc alone is not promotable — it's documentation scaffolding around missing artifacts.

## agents/slash-command-auditor.md
**Type**: Agent definition — specialised auditor role for Claude Code slash command `.md` files; reads reference docs first, then evaluates the target command across five areas, outputs a severity-tiered report.
**Portable**: Partial — the *evaluation framework* (areas, contextual-judgment tiers, output format) is fully portable; the `<critical_workflow>` block hardcodes four taches-specific `@skills/create-slash-commands/…` paths that don't exist outside this repo.
**Reason**: Solid reusable audit pattern: pre-read-before-evaluate discipline, five named evaluation areas (YAML, Arguments, Dynamic Context, Tool Restrictions, Content Quality), contextual-judgment rubric keyed to command complexity, and a clean severity schema (Critical / Recommendations / Quick Fixes / Strengths). Worth extracting as a portable "slash-command-audit" SOP with the reference paths made configurable.
**Trigger**: User asks to audit, review, or evaluate a Claude Code slash command `.md` file.
**Steps/contract**: (1) Read four reference docs before auditing. (2) Read the command file. (3) Evaluate across all five areas. (4) Output severity-tiered findings with `file:line` citations. (5) Offer four next-step options.
**Strip**: The four hardcoded `@skills/create-slash-commands/…` file paths in `<critical_workflow>`; replace with a configurable `<reference_docs>` block or document that callers must supply their own best-practices paths.
**Notes**: The `<contextual_judgment>` section (simple vs state-dependent vs security-sensitive vs delegation commands) is the most portable and highest-value piece — it's a reusable rubric for *any* agent-file audit, not just slash commands. Output format with five severity tiers and a `Context` summary block is clean and worth reusing verbatim.

## agents/skill-auditor.md
**Type**: Agent definition (subagent role — skill auditor persona with constraints, workflow, evaluation framework, and output format)
**Portable**: YES — with minor stripping. The evaluation methodology, focus areas, contextual-judgment model, anti-pattern taxonomy, output format template, and success_criteria are fully portable. The `critical_workflow` section references taches-local paths (`@skills/create-agent-skills/…`) which must be genericised or inlined.
**Reason**: Defines a reusable "audit a skill file" workflow that any repo maintaining SKILL.md files would benefit from. The severity-based findings format (Critical / Recommendations / Quick Fixes / Strengths), the simple-vs-complex skill judgment heuristic, and the legacy-skill migration guidance are high-value portable patterns.
**Trigger**: User asks to "audit a skill", "review a SKILL.md", "evaluate skill best practices", or "check skill compliance".
**Steps/contract**: (1) Read best-practice reference docs first; (2) Read target SKILL.md + subdirectories; (3) Evaluate across four areas — YAML frontmatter, structure & organisation, content quality, anti-patterns; (4) Apply contextual judgment (simple vs complex vs delegation skill); (5) Produce severity-categorised markdown report with file:line citations; (6) Offer follow-up options (auto-fix, examples, critical-only focus).
**Strip**: `critical_workflow` step paths (`@skills/create-agent-skills/…`) — replace with a generic instruction to locate and read the repo's skill-creation reference docs before auditing. The `model: sonnet` YAML key is tooling-specific metadata, drop or abstract. The `<final_step>` numbered menu is taches UI convention; keep the intent (offer next actions) but express generically.
**Notes**: Exceptionally well-structured agent. The `<contextual_judgment>` section (simple / complex / delegation tiers) and `<legacy_skills_guidance>` (migration pattern table) are standout portable patterns worth preserving verbatim. The `<xml_structure_examples>` block with ❌/✅ pairs is a strong teaching pattern. Output format template is directly reusable as a SOP report scaffold. Low stripping effort — mainly swap the hardcoded reference paths.

## agents/subagent-auditor.md
**Type**: Subagent definition — specialized auditor for Claude Code subagent configuration files.
**Portable**: Mostly — with path surgery.
**Reason**: The audit methodology (evaluation areas, anti-pattern catalogue, output format, contextual-judgment guidance) is entirely repo-agnostic best practice. The only non-portable element is `<critical_workflow>` steps 1–4, which `@`-reference taches-specific skill paths (`@skills/create-subagents/…`). Strip those read-references and inline the criteria they would have supplied (or replace with a generic "consult local subagent best-practices docs" note) and the SOP is fully portable.
**Trigger**: "audit a subagent", "review subagent config", "evaluate subagent", user asks to audit a `.md` agent file.
**Steps/contract**:
  1. Read best-practices references first (step embeds taches-specific paths — generalise on extract).
  2. Read target subagent file.
  3. Before penalising any missing section, search entire file for equivalent content under a different tag name.
  4. Evaluate against six critical areas: yaml frontmatter, role definition, workflow specification, constraints, tool access, XML structure.
  5. Evaluate against six recommended areas: focus areas, output format, model selection, success criteria, error handling, examples.
  6. Note optional enhancements (context management, caching, observability, etc.) without penalising their absence.
  7. Produce severity-based findings report (critical / recommendations / strengths / quick fixes / context block).
  8. Offer post-audit action menu (auto-fix / examples / critical-only / other).
**Strip**: Steps 1–4 of `<critical_workflow>` (`Read @skills/create-subagents/…` lines) — replace with inline evaluation criteria already present elsewhere in the file, or a generic "consult repo subagent style guide" placeholder.
**Notes**: Exceptionally mature and well-structured. Demonstrates the ideal self-referential pattern: the subagent that audits subagents is itself a model XML-only subagent with no markdown headings in the body. The `<contextual_judgment>` section (simple vs. complex vs. delegation subagent tiers) and `<anti_patterns>` catalogue with severity + detection + fix triplets are particularly strong portable primitives. High-value SOP candidate.

## skills/create-agent-skills/references/core-principles.md
**Type**: Reference — meta-principles for skill authoring
**Portable**: Yes — all six principles (XML structure, conciseness, degrees-of-freedom, model testing, progressive disclosure, validation scripts) are model-agnostic and apply to any skill ecosystem
**Reason**: Articulates *why* each authoring convention exists (token efficiency, parseability, fragility matching, cross-model balance), making it the strongest single rationale document in the repo; the concise-vs-verbose contrast examples and the "degrees of freedom ↔ fragility" framing are directly reusable
**Strip**: Internal cross-references to sibling files (`use-xml-tags.md`, `skill-structure.md`, `workflows-and-validation.md`); token-count estimates that are model-version-specific
**Notes**: The "degrees of freedom" principle (match specificity to fragility: low/medium/high) is unusually well-articulated and should be preserved verbatim; the model-testing section (Haiku/Sonnet/Opus guidance) is worth keeping but may need light generalisation if the target repo targets a single model tier

## skills/create-agent-skills/references/recommended-structure.md
**Type**: Reference — canonical file-layout pattern for complex skills
**Portable**: Yes — the router + workflows/ + references/ three-layer architecture is a structural SOP, not taches-specific
**Reason**: Solves four named failure modes (context skipped, wrong context loaded, monolithic overwhelm, procedures mixed with knowledge) with a clean directory layout and matching SKILL.md / workflow templates; the "SKILL.md is always loaded — use this guarantee" insight is the key heuristic
**Strip**: The mixed markdown-heading style inside the templates (the templates themselves use `##` headings, which contradicts the pure-XML principle documented elsewhere); any references implying taches-specific tooling
**Notes**: The `<when_to_use_this_pattern>` decision rule (router pattern when >200 lines or multiple distinct workflows; single-file when simpler) is a crisp, portable threshold worth keeping as a decision gate in any SOP

## skills/create-agent-skills/references/skill-structure.md
**Type**: Reference — comprehensive structural spec (YAML + XML + file layout)
**Portable**: Yes — covers YAML frontmatter rules, required/conditional XML tags, naming conventions, progressive disclosure patterns, anti-patterns, and a validation checklist; all content is framework-agnostic
**Reason**: The most complete single-file structural reference in the taches repo; the validation checklist (9-item ✅ list) and the three progressive-disclosure patterns (high-level guide, domain organisation, conditional details) are directly extractable as SOP checklist items
**Strip**: Internal relative links to sibling files; Windows-path pitfall note (minor, audience-specific); the BigQuery domain-organisation example can be simplified to a generic placeholder
**Notes**: The `<naming_conventions>` section (verb-noun pattern: create-, manage-, setup-, generate-) and the `<anti_patterns>` block are both strong candidates for a "skill naming SOP" rule; the three-tier tag-selection intelligence (simple / medium / complex) mirrors the degrees-of-freedom principle in core-principles.md and should be aligned when synthesising

## skills/create-agent-skills/references/use-xml-tags.md
**Type**: Reference — XML tag taxonomy with required + conditional tags and selection intelligence
**Portable**: Yes — defines a complete, reusable tag vocabulary (objective, quick_start, success_criteria, context, workflow, advanced_features, validation, examples, anti_patterns, security_checklist, testing, common_patterns, reference_guides) with when-to-use rules and examples
**Reason**: The `<intelligence_rules>` decision tree (simple → required only; medium → add workflow/examples; complex → add conditional tags) and the `<when_to_add_conditional>` question list are the most actionable tag-selection guidance in the repo; the XML-vs-markdown token-efficiency comparison validates the structural choice quantitatively
**Strip**: Duplicate content that already appears verbatim in skill-structure.md (the critical_rule, xml_vs_markdown_headings comparison, and nesting_guidelines are repeated nearly word-for-word); internal relative links
**Notes**: The `<combining_with_other_techniques>` section (multi-shot learning, chain-of-thought, template provision, reference material in XML) is a unique addition not covered elsewhere and should be preserved; the `<tag_reference_pattern>` micro-convention ("Using the schema in `<schema>` tags…") is a small but useful self-documentation habit worth keeping

## skills/create-agent-skills/workflows/add-reference.md
**Type**: Workflow — guided process for adding a reusable reference file to an existing skill
**Portable**: Yes
**Reason**: The pattern (create a structured reference file, register it in an index, link it from workflows' required_reading) is framework-agnostic and directly maps to how this repo organises skills; only the path `~/.claude/skills/` is taches-specific
**Strip**: Hardcoded `~/.claude/skills/` path references; `AskUserQuestion` phrasing conventions
**Notes**: The `<required_reading>` / `<reference_index>` XML conventions and the seven-step checklist (create → register → link → verify) are strong portable patterns; semantic XML tagging of reference content (overview, patterns, guidelines, examples) is worth preserving as an authoring standard

## skills/create-agent-skills/workflows/add-script.md
**Type**: Workflow — guided process for adding an automation script to a skill
**Portable**: Yes
**Reason**: The script-candidate checklist (idempotent, error-prone when rewritten, consistency matters) and the write/chmod/wire-into-workflow sequence are language- and platform-agnostic
**Strip**: `~/.claude/skills/` path; `set -euo pipefail` as prescriptive default (useful but repo-specific style choice); explicit language menu (bash/python/node) can be condensed
**Notes**: The "confirm this is a good script candidate" gate (same code runs across invocations, error-prone to rewrite, consistency > flexibility) is a reusable decision heuristic; success-criteria checklist (no hardcoded secrets, tested with real invocation) is strong portable policy

## skills/create-agent-skills/workflows/add-template.md
**Type**: Workflow — guided process for adding an output template to a skill
**Portable**: Yes
**Reason**: The template-candidate checklist and the `{{PLACEHOLDER}}` convention are universally applicable; the read-copy-fill sequence is standard templating practice
**Strip**: `~/.claude/skills/` path; `using-templates.md` reference (taches-internal)
**Notes**: "Structure matters more than creative generation" framing is a precise, reusable decision criterion; the checklist gate (consistent structure, filling placeholders more reliable than blank-page generation) is worth carrying forward as a policy heuristic

## skills/create-agent-skills/workflows/add-workflow.md
**Type**: Workflow — guided process for adding a workflow to an existing skill, including router-pattern upgrade
**Portable**: Yes
**Reason**: The router-pattern upgrade path (simple skill → workflows/ directory + SKILL.md rewritten as router) and the three-part SKILL.md update (intake + routing table + workflows index) are directly applicable to this repo's skill architecture
**Strip**: `~/.claude/skills/` path; `AskUserQuestion` tool reference; `DO NOT use AskUserQuestion` instruction; taches-internal reference filenames
**Notes**: The router-pattern upgrade decision (detect simple vs router, offer migration before adding) is the strongest portable SOP here — it prevents skill sprawl and enforces consistent navigation structure; the workflow file template (required_reading + process + success_criteria) should become the canonical skeleton in this repo's skill standard

## skills/create-agent-skills/templates/router-skill.md
**Type**: Template **Portable**: Yes **Reason**: Generic router-skill scaffold (frontmatter, essential_principles, intake, routing table, reference_index, workflows_index, success_criteria) with no taches-specific paths or tooling. **Strip**: Placeholder tokens (`{{SKILL_NAME}}`, `{{keywords}}`, etc.) — replace with canonical blank markers or remove before promoting. **Notes**: Strong structural model for multi-intent skills; the `<routing>` table pattern (response → workflow file) is the cleanest router contract seen across repos. Worth promoting as the canonical router template.

## skills/create-agent-skills/templates/simple-skill.md
**Type**: Template **Portable**: Yes **Reason**: Minimal single-file skill scaffold (objective, quick_start, process, success_criteria) with zero repo-specific references. **Strip**: Nothing — already fully generic. **Notes**: Good complement to router-skill.md; together they give authors a clear "simple vs. complex" decision. The checklist-style success_criteria (`- [ ]`) is a portable convention worth standardising.

## skills/create-agent-skills/workflows/create-new-skill.md
**Type**: Workflow **Portable**: Mostly **Reason**: End-to-end skill-creation procedure covering requirements gathering, structure decision, directory scaffolding, SKILL.md authoring, workflow/reference writing, validation, slash-command creation, and testing. The decision logic (simple vs. router, when to add templates/, scripts/) is tool-agnostic and highly reusable. **Strip**: Hardcoded `~/.claude/skills/` paths and `~/.claude/commands/` slash-command step — these are taches-specific runtime paths; replace with a variable or note (e.g., `<SKILLS_DIR>`). Also strip the AskUserQuestion UI affordance references (taches-specific interactive widget). **Notes**: The "Step 3: Decide Structure" heuristics (factors favouring router, when to add templates/, scripts/) are the strongest portable decision guide seen across repos. The API-research gate (Step 2) is a useful optional step worth retaining.

## skills/create-agent-skills/workflows/audit-skill.md
**Type**: Workflow **Portable**: Mostly **Reason**: Structured skill-audit checklist covering YAML frontmatter, structure, router pattern, workflows, and content quality, plus a scored report format and fix-offer loop. The checklist criteria and anti-pattern catalogue are fully generic. **Strip**: Hardcoded `~/.claude/skills/` bash paths and the AskUserQuestion UI affordance — same taches-runtime coupling as create-new-skill.md. **Notes**: The `<audit_anti_patterns>` block is the most concise, actionable anti-pattern list seen across repos ("Skippable principles", "Monolithic skill", "Mixed concerns", etc.) — high-value portable content. The scored report format (`X/Y criteria passing`) is a clean convention.

## skills/create-agent-skills/references/iteration-and-testing.md
**Type**: Reference — skill-authoring methodology (eval-driven dev, Claude A/B testing, model-specific tuning, XML validation, observation-based iteration, discovery testing, success metrics)
**Portable**: Yes
**Reason**: Entirely generic skill-development process; no taches-specific content. The eval-first loop, fast-iteration principle, and per-model guidance (Haiku/Sonnet/Opus detail calibration) are universally applicable to any skill-create workflow.
**Strip**: Cross-reference link to `core-principles.md` (taches-internal path); replace with equivalent local reference if adopted.
**Notes**: The "Claude A refines / Claude B executes" framing is a strong concrete pattern worth preserving verbatim. The `evaluation_structure` JSON example is also directly reusable.

## skills/create-agent-skills/references/using-scripts.md
**Type**: Reference — authoring pattern (when/how to embed executable scripts in a skill directory)
**Portable**: Yes
**Reason**: Fully generic guidance on script placement (`scripts/`), structure (idempotent, validated inputs, `set -euo pipefail`), and workflow integration. Nothing taches-specific.
**Strip**: Nothing — no proprietary names, paths, or product references.
**Notes**: The bash deploy.sh example is a clean, minimal canonical illustration; worth keeping as-is. Security section (env vars over hardcoded secrets) is short and high-value.

## skills/create-agent-skills/references/using-templates.md
**Type**: Reference — authoring pattern (reusable output-structure templates with `{{placeholder}}` syntax)
**Portable**: Yes
**Reason**: Generic template-authoring advice applicable to any skill that produces structured documents. `{{placeholder}}` vs `[PLACEHOLDER]` convention, directory layout, and workflow-integration snippet are all tool-agnostic.
**Strip**: Nothing — no taches-specific content.
**Notes**: Notably shorter than the other references; could be merged into a combined "supporting-files" reference without loss of meaning. The do/don't list is tight and worth preserving.

## skills/create-agent-skills/references/workflows-and-validation.md
**Type**: Reference — authoring patterns (complex multi-step workflows, validate-fix-repeat, plan-validate-execute, conditional branching, checkpoint pattern, error recovery)
**Portable**: Yes
**Reason**: All patterns are generic workflow-construction techniques with PDF/OOXML/batch-update used only as illustrative examples, not dependencies.
**Strip**: Example skill names in XML snippets (`pdf-processing`, OOXML paths, `analyze_form.py`) are illustrative; keep as examples but note they are not prescriptive. No taches-specific imports needed.
**Notes**: The "verbose error messages" principle (show available valid options, not just "invalid field") is an unusually concrete and high-signal guideline. The checkpoint pattern and error-recovery escalation (3-attempt limit → document + report) are directly portable to any multi-step skill SOP.

## skills/create-agent-skills/references/be-clear-and-direct.md
**Type**: Principle collection — universal skill/prompt authoring quality rules
**Portable**: Yes
**Reason**: Clarity, specificity, sequential steps, show-don't-tell with examples, explicit edge cases, output-format specification, decision criteria, and success criteria are universal prompt engineering principles that apply regardless of platform or toolchain.
**Strip**: The specific XML tag style (`<context>`, `<workflow>`, `<success_criteria>`) is a taches convention; the `{{FEEDBACK_DATA}}` placeholder syntax is taches-specific; the "junior developer" golden-rule framing is flavour, not SOP content.
**Notes**: Strong source for a "Write clear skill instructions" SOP. The contrast pairs (vague vs specific, unclear vs clear) make excellent eval fixtures. The "avoid ambiguity" vocabulary list (try → always, should probably → must, consider → if X then Y) is directly promotable as a rule.

## skills/create-agent-skills/references/common-patterns.md
**Type**: Pattern catalogue — skill-authoring anti-patterns and canonical patterns
**Portable**: Mostly yes
**Reason**: Template-with-escape-hatch, input/output example pairs, consistent terminology, progressive disclosure (short SKILL.md + linked reference files), validation-script pattern, and checklist pattern are all platform-agnostic. The anti-pattern list (vague descriptions, too many options, deeply nested references, unclosed tags) is broadly applicable.
**Strip**: Anti-patterns specific to taches infrastructure: `! \`backtick\`` dynamic-context execution, `@`-prefix file reference execution during skill load, skill-description POV/naming convention rules (verb-noun directory names, third-person descriptions) — these are taches skill-loader specifics. The pure-XML-over-markdown preference is a taches convention.
**Notes**: "Provide one default, one escape hatch — never a menu of options" is a high-value standalone SOP rule. The progressive-disclosure pattern (≤500-line SKILL.md, one-level-deep references) is directly promotable. Naming convention and POV anti-patterns should be noted as local conventions only.

## skills/create-agent-skills/references/executable-code.md
**Type**: Pattern — pre-made scripts vs generated code
**Portable**: Partially
**Reason**: Core principle (execute a pre-made script instead of generating equivalent code; only script output enters context) is platform-agnostic and token-efficient. Solve-don't-punt error handling, documented configuration constants, and fully-qualified MCP tool names (`Server:tool_name`) are universally applicable.
**Strip**: `~/.claude/skills/<name>/scripts/` path is taches-specific. Runtime constraint note (claude.ai can install PyPI packages; Anthropic API cannot) is claude.ai/API-platform-specific and may go stale. The `scripts/` subdirectory convention is taches house-style.
**Notes**: "Scripts save tokens: code never enters context, only output does" is a strong portable SOP principle. MCP fully-qualified tool name pattern (`ServerName:tool_name`) is valuable and easy to miss — worth calling out explicitly in any multi-MCP SOP.

## skills/create-agent-skills/references/api-security.md
**Type**: Security pattern — credential hygiene for API-calling skills
**Portable**: Concept yes; implementation no
**Reason**: The core principle — never inline `$API_KEY` in bash examples because the expanded value appears in chat; route all credentialed calls through an opaque wrapper script — is universally valid security hygiene. The wrapper-script and profile-selection concepts transfer to any platform.
**Strip**: Everything implementation-specific: `~/.claude/scripts/secure-api.sh`, `~/.claude/.env`, `~/.claude/scripts/profile-state`, and the `set -a; source ~/.claude/.env` credential-loading pattern are all taches-specific infrastructure paths. The Facebook/GHL examples are taches client examples.
**Notes**: Promotable SOP principle: "Credential wrapper pattern — all API calls through a local wrapper; credentials loaded inside the wrapper, never interpolated into tool-call strings." The profile-selection workflow (check saved profile → discover profiles → prompt if ambiguous → announce which profile before calling) is a good UX pattern worth abstracting.

## skills/create-agent-skills/workflows/create-domain-expertise-skill.md
**Type**: Meta-skill workflow — 12-step process for building comprehensive domain expertise skills (research → structure → SKILL.md → workflows → references → validate).
**Portable**: Yes — the workflow pattern (exhaustive research, lifecycle coverage, dual-purpose test, completeness checklist) is universally applicable to any skill-creation system.
**Reason**: Core value is the research discipline (5 web-search types, recency verification, decision-tree refs), the "build → debug → test → optimize → ship" lifecycle mandate, and the dual-purpose test (direct invocation + loadable knowledge). None of that is taches-specific.
**Strip**: All `~/.claude/skills/expertise/` hardcoded paths; the `create-plans` domain inference table integration step (Step 11) is taches-internal wiring.
**Notes**: The completeness checklist (Step 9) and quality standards (Step 12) are the most extractable SOP nuggets. The reference file structure templates (XML option/decision_tree/anti_pattern schema) are worth preserving verbatim as a portable reference-writing standard.

## skills/create-agent-skills/workflows/get-guidance.md
**Type**: Intake/decision workflow — helps users determine whether to create a skill and what structure it should use (simple vs router).
**Portable**: Yes — the decision framework (single-task → simple skill, multiple related tasks → router + workflows, user-triggered → slash command) is pattern-agnostic.
**Reason**: The 5-row quick-decision table and the "map workflows / identify domain knowledge / identify essential principles" sequence apply to any agent skill system.
**Strip**: `~/.claude/skills/` path references; the offer to "switch to Create a new skill workflow" is a taches-internal routing step.
**Notes**: Shortest of the four workflows; essentially a triage SOP. High signal-to-noise ratio — minimal stripping needed beyond path literals.

## skills/create-agent-skills/workflows/upgrade-to-router.md
**Type**: Refactor workflow — migrates a monolithic skill file to the router pattern (essential principles inline + intake + routing table + workflows/ + references/).
**Portable**: Yes — the decomposition method (extract principles / split workflows / move knowledge to references / rewrite SKILL.md as router / verify nothing lost) is framework-agnostic.
**Reason**: The "verify it needs upgrading" heuristics (>200 lines, multiple use-cases, growing complexity) and the "compare original against new structure" completeness check are generalisable refactor SOPs.
**Strip**: All `~/.claude/skills/` path literals; the specific router SKILL.md template uses taches YAML frontmatter conventions.
**Notes**: Step 8 (verify nothing was lost) and Step 9 (test routing) are the most valuable portable steps — they form a mini regression-check SOP applicable to any skill migration.

## skills/create-agent-skills/workflows/verify-skill.md
**Type**: Quality-assurance workflow — audits a skill's external claims (CLI flags, API endpoints, framework patterns) for continued accuracy and generates a freshness report.
**Portable**: Yes — the categorisation table (API/Service, CLI Tools, Framework, Integration, Pure Process) and per-type verification methods (Context7, `--version`, WebSearch change queries) are universally applicable.
**Reason**: The freshness report template (✅ Verified / ⚠️ May Be Outdated / ❌ Broken / ℹ️ Could Not Verify) and the recommended re-verification schedule by skill type are clean, portable SOPs.
**Strip**: `~/.claude/skills/` path literals; Context7 MCP tool names (`mcp__context7__resolve-library-id`) are taches-environment-specific — abstract to "use library docs tool".
**Notes**: The distinction "Audit checks structure. Verify checks truth." is a quotable framing worth preserving. The verification shortcuts block is practically useful as a portable quick-reference.

## skills/create-plans/references/domain-expertise.md
**Type**: Reference guide for building context-efficient domain expertise skills with selective reference loading.
**Portable**: Yes — the structural patterns (SKILL.md with `<principles>` + `<references_index>` + `<workflows>` sections), phase-type classification table (Foundation/Setup, Database/Data, API/Backend, UI/Frontend, Integration, Features, Polish), and token-budget thinking are fully portable to any planning SOP.
**Reason**: The core insight — load only the references relevant to the current phase type rather than all references upfront — is a universal planning efficiency principle, not taches-specific. The phase-type taxonomy and reference-index pattern transfer directly.
**Strip**: macOS/Swift-specific examples (WeatherBar, SwiftUI, AppKit) are illustrative only; keep as examples or replace with generics. Specific token/line-count thresholds (5-7k, 500-2000 lines, 27k savings) are internal benchmarks that don't need to travel.
**Notes**: The migration guide (audit → consolidate principles → create references_index → test loading → iterate) is a reusable refactor SOP for any bloated skill. The phase-type table is the most portable artifact — it should surface as a canonical reference in any create-plans SOP.

## skills/create-plans/references/milestone-management.md
**Type**: Reference for three planning modes (greenfield, brownfield extensions, major iterations) and milestone lifecycle management.
**Portable**: Yes — the decision tree (same codebase? → extend roadmap; different codebase? → archive), BRIEF "Current State" pattern, brownfield plan diffs (context includes existing files, "add to existing" actions, regression checks), and archive criteria are fully portable planning SOPs.
**Reason**: These patterns apply to any software project regardless of stack, domain, or tool. The milestone-bounded extension model (continuous phase numbering, milestone groupings, collapsed history in ROADMAP) is a general project-management SOP.
**Strip**: macOS/Swift examples (WeatherBar, AppKit/SwiftUI migration) are illustrative; replace with generics. The `.planning/` directory naming is taches-internal — destination repo may use `.plans/` or another convention.
**Notes**: The three-way brownfield plan diff (context → existing files; actions → "add to / update existing"; verify → regression checks) is the highest-value portable artifact. The decision tree is clean and should be preserved verbatim. BRIEF "Current State" template is directly reusable.

## skills/create-plans/references/research-pitfalls.md
**Type**: Catalog of 8 research anti-patterns with XML prevention checklists, red-flag signals, and a continuous-improvement loop.
**Portable**: Yes — all 8 pitfalls (scope assumptions, vague search instructions, deprecated docs, tool-specific conflation, confident negative claims, missing enumeration, single-source reliance, assumed completeness) and the 5 red flags are domain-agnostic research quality SOPs.
**Reason**: The patterns are about research epistemics, not taches or any specific tool. They apply equally to any research task: documentation lookup, API investigation, codebase analysis, etc.
**Strip**: "Lessons From: MCP configuration research gap" footer is taches-internal provenance; strip or generalize. The specific MCP `.mcp.json` example in Pitfalls 1 and 5 is illustrative — keep as example or replace with a generic placeholder.
**Notes**: The red-flags section (zero "not found" results, no confidence indicators, missing URLs, definitive statements without evidence, incomplete enumeration) is a high-value portable quality checklist for any research output. The continuous-improvement loop (document gap → root cause → update catalog) is a reusable meta-SOP for living reference documents.

## skills/create-plans/references/cli-automation.md
**Type**: Operational protocol — "automate everything that has a CLI or API; only surface a `checkpoint:human-action` for true no-API blockers (email verification links, SMS 2FA, 3D-Secure web flows)."
**Portable**: YES — the automation-first principle and auth-gate retry pattern (try → detect auth error → surface minimal unblock checkpoint → retry) are universally applicable regardless of stack.
**Strip**: Platform-specific CLI command tables (Vercel, Railway, Fly, Stripe, Supabase, Upstash, PlanetScale, GitHub, Xcode) and the taches XML `<task type="auto">` schema.
**Notes**: The auth-gate protocol is the high-value portable extract: Claude attempts automation, recognises an auth failure as a gate (not a bug), creates a minimal unblock checkpoint, verifies credentials, then resumes. The decision tree ("does it have CLI/API? → YES → automate; NO → checkpoint:human-action") is equally portable.

## skills/create-plans/references/context-management.md
**Type**: Operational protocol — four-tier token-threshold ladder (≥50 % comfortable → 25 % warn → 15 % pause + ask → 10 % auto-handoff + stop) with atomicity rules and context-bloat prevention strategies.
**Portable**: YES — the threshold tiers, the "finish current atomic operation then stop" discipline, and the context-bloat hygiene list (read once, summarise not quote, targeted grep, concise output) apply to any long-running agent task.
**Strip**: The taches `<system_warning>` tag format, the specific YAML frontmatter schema for handoffs, and references to the taches skill's resume workflow.
**Notes**: The "what counts as atomic" definition (single file write, single validation command, single plan task) is a clean portable rule. The user-signal list ("wrap up", "save my place", "pack it up") is a practical addition worth preserving.

## skills/create-plans/references/hierarchy-rules.md
**Type**: Structural schema — four-level planning hierarchy: BRIEF (vision) → ROADMAP (phases) → PLAN.md (Claude-executable tasks) → prompts (optimised execution instructions), with explicit look-up and look-down navigation rules.
**Portable**: YES (principle) / PARTIAL (specifics) — the "scope flows down, progress flows up" model and the prerequisite-check pattern ("missing roadmap? offer to create it rather than skip") are portable to any multi-phase planning skill.
**Strip**: The `.planning/` directory convention, the `XX-kebab-case` phase directory naming, and the integration with `create-meta-prompts` skill (taches-specific).
**Notes**: The cross-phase context rule ("when planning phase N, read phase N−1's plan to understand current state, consider what N+1 will need") is a strong portable SOP fragment. The scope-inheritance illustration (brief → roadmap → phase → task) is a useful canonical example.

## skills/create-plans/references/git-integration.md
**Type**: Git discipline protocol — "commit outcomes, not process": only three commit events (project init with brief+roadmap, phase completion with code, WIP handoff); everything else (PLAN.md creation, RESEARCH.md, planning tweaks) is noise and must not be committed separately.
**Portable**: YES — the principle and the three-event rule are universally applicable to any project-planning skill that touches git, regardless of planning hierarchy.
**Strip**: The `.planning/` path references and the taches-specific phase-completion commit format (which bundles `phases/XX-name/` + `src/`). The conventional commit prefixes (`docs:`, `feat:`, `wip:`) are common enough to keep as a pattern.
**Notes**: The example clean git log (five commits covering five phases of an e-commerce app) is the best portable illustration of the principle. The "what NOT to commit separately" list is a concise, actionable negative-space rule.

## skills/create-plans/references/plan-format.md
**Type**: Reference — canonical XML schema for an executable PLAN.md (frontmatter, objective, context, tasks, verification, success_criteria, output sections) plus four required task fields (files, action, verify, done) and three task types (auto, checkpoint:human-verify, checkpoint:decision).
**Portable**: Yes — the schema and the four-field task anatomy are implementation-agnostic SOP content.
**Reason**: The core insight ("PLAN.md IS the executable prompt") and the specificity discipline (good/bad/too-detailed examples, anti-patterns for vague actions and unverifiable completion) are entirely portable. The XML tag names and overall document structure could be adopted verbatim. The `@file` context reference syntax and cross-links to `references/checkpoints.md` and `references/cli-automation.md` are taches-internal conventions.
**Strip**: `@file` reference syntax (taches-local context-loading mechanism), all cross-links to sibling `references/` files, the `domain:` frontmatter field (unused outside taches).
**Notes**: The specificity-level triad (too_vague / just_right / too_detailed) is a standout portable teaching pattern — concrete examples make the rule actionable. The sizing guidance (15–60 min per task; split at >7 tasks or multiple subsystems) complements `scope-estimation.md` and the two docs should be co-located if promoted. Strong candidate for the `prd-to-plan` / `plan-to-spec` skill families.

## skills/create-plans/references/scope-estimation.md
**Type**: Reference — quality-degradation model for context-window-bounded plan execution, with the 2–3-task / 50%-context rule, splitting strategies, autonomous-vs-interactive plan taxonomy, and atomic-commit philosophy.
**Portable**: Partially — the splitting heuristics and atomic-commit rationale are fully portable; the context-percentage framing is Claude-specific but remains useful as mental model.
**Reason**: The core principle (stop before quality degrades, not at context limit) and the split-by-subsystem / split-by-dependency / split-by-complexity strategies are valid SOP for any agent planning workflow. The 50% context target is Claude-specific reasoning but converts cleanly to "keep plans small and well-bounded." The autonomous-vs-interactive plan distinction (subagent for no-checkpoint plans, main context for interactive ones) is a high-value architecture pattern portable to any multi-agent orchestration.
**Strip**: Explicit context-percentage figures (0–30 %, 50 %, 80 % — these are Claude-runtime specifics that break in other runtimes), references to "subagent with fresh 200k context" (model-size detail), and the "Quality Degradation Curve" ASCII table (replace with plain-language rule).
**Notes**: The "Atomic Commit Philosophy" section and the good/bad git-history examples are excellent portable SOP for any team writing implementation plans. The anti-pattern pair ("Comprehensive Plan" vs "Atomic Plan") maps well to existing `prd-to-plan` skill guidance and should be evaluated for promotion alongside that skill.

## skills/create-plans/references/user-gates.md
**Type**: Reference — decision-gate taxonomy for user-confirmation points: AskUserQuestion tool (structured choices), inline questions (simple confirmations), mandatory gate table by phase, and good/bad gating guidance.
**Portable**: Partially — the gate loop pattern and placement table are portable; the AskUserQuestion tool is taches-specific.
**Reason**: The three-option decision gate loop ("Proceed / Ask more / Add context") is a portable interaction pattern applicable in any agent workflow. The mandatory-gate table (which phases require which gate type) is a reusable SOP skeleton. The AskUserQuestion tool call is taches-platform infrastructure with no direct analogue in target skills.
**Strip**: `AskUserQuestion Tool` section (taches-specific tool), all tool-call syntax examples, references to specific taches phase names (plan-phase, research-phase, create-brief, create-roadmap).
**Notes**: The "Good vs Bad Gating" section is concise and universally applicable — gate before writing artefacts, gate when genuinely ambiguous, never ask obvious questions. The core portable SOP is the decision loop itself: offer the user Proceed / More questions / Add context at every major inflection point. Overlaps in purpose with the `checkpoint:decision` type in `plan-format.md`; the two should be harmonised so gate points in planning map to checkpoint types in execution.

## skills/create-plans/references/checkpoints.md
**Type**: Reference — comprehensive specification of the three checkpoint types (human-verify 90 %, decision 9 %, human-action 1 %), execution protocol (stop-display-wait-verify-resume), placement rules, anti-patterns, and complete worked examples.
**Portable**: Yes — the three-type taxonomy and golden rule ("if Claude CAN automate it, Claude MUST automate it") are fully portable SOPs.
**Reason**: The checkpoint taxonomy (verify / decision / action) and the execution protocol (stop immediately, display clearly, wait, verify, resume) are universal human-in-the-loop patterns applicable in any agent orchestration. The worked examples demonstrate the core discipline: automate everything with CLI/API before presenting a checkpoint, never ask the human to do automatable work. The XML tag syntax is taches-specific but the semantic structure (what-built, how-to-verify, resume-signal; decision / context / options / resume-signal) is portable.
**Strip**: XML task syntax (`<task type="checkpoint:*">` tags), `vercel --yes` / `upstash redis create` CLI specifics in examples (replace with generic CLI placeholders), cross-links to `references/cli-automation.md` (taches-internal), and the percentage distribution (90/9/1) which is an illustrative heuristic, not a binding rule.
**Notes**: The anti-pattern section is the highest-value portable content — especially the "too many checkpoints → verification fatigue" pattern and its fix (consolidate into one end-of-phase checkpoint). The distinction between pre-planned checkpoints and dynamically-created authentication-gate checkpoints is a subtle but important SOP nuance worth preserving. Directly complements `plan-format.md`; the two files should be promoted as a pair.

## skills/create-plans/templates/brief.md
**Type**: Template (fill-in-the-blank Markdown scaffold)
**Portable**: Yes — pure Markdown with no taches-specific tooling or path references; the `~/.claude/skills/` paths appear only in the phase-prompt template, not here
**Reason**: Dual greenfield/brownfield BRIEF.md structure with versioned current-state capture, success criteria, and explicit out-of-scope sections is a strong, reusable planning pattern
**Strip**: `<guidelines>` and `<brownfield_guidelines>` XML tags (prose inside is worth keeping as inline notes, but the tag wrappers are taches conventions)
**Notes**: The brownfield `<details>` collapse pattern for archiving original v1.0 vision is clever; worth preserving as an optional section. `complete-milestone.md` workflow reference is internal to taches — omit or replace with a generic cross-reference.

## skills/create-plans/templates/phase-prompt.md
**Type**: Template (XML-structured phase-plan prompt scaffold)
**Portable**: Partial — the `@~/.claude/skills/create-plans/…` execution-context references are taches-specific absolute paths; task XML schema and checkpoint types are generic
**Reason**: The `<task type="auto|checkpoint:*">` schema with `<action>`, `<verify>`, and `<done>` fields is a high-signal pattern for unambiguous, machine-parseable plan tasks; the good/bad examples sharpen the spec effectively
**Strip**: All `@~/.claude/skills/create-plans/…` lines in `<execution_context>` (replace with repo-relative equivalents); `<key_elements>`, `<good_examples>`, `<bad_examples>` XML wrappers (content is useful inline documentation, wrappers are taches conventions)
**Notes**: The scope guidance (3–6 tasks per plan, split at >7, target 80 % context) is practically valuable and should survive as a standalone note. The `{phase}-{plan}-PLAN.md` naming convention (e.g. `01-02-PLAN.md`) is clean and portable.

## skills/create-plans/templates/roadmap.md
**Type**: Template (ROADMAP.md scaffold with milestone-grouping upgrade path)
**Portable**: Yes — purely structural Markdown; no tool or path dependencies
**Reason**: The greenfield→brownfield milestone-grouping evolution (collapse completed milestones in `<details>`, emoji status, continuous phase numbering) is a mature, reusable roadmap pattern
**Strip**: `<guidelines>`, `<status_values>` XML wrappers (content is good; wrappers are taches convention); the "no time estimates" note is opinionated — keep as a preference note rather than a rule
**Notes**: Continuous phase numbering (never restart at 01 across milestones) is a strong, portable convention. Progress table with Milestone column is worth preserving as-is.

## skills/create-plans/templates/summary.md
**Type**: Template (SUMMARY.md scaffold for phase-completion reporting)
**Portable**: Yes — plain Markdown; no external path dependencies
**Reason**: The "Deviations from Plan" section distinguishing auto-fixed issues (with commit hash) from deferred enhancements (logged to ISSUES.md) is an unusually rigorous deviation-tracking pattern worth adopting
**Strip**: `<one_liner_rules>` and `<example>` XML wrappers (inline the good/bad one-liner examples as a plain note); `.planning/ISSUES.md` reference is a taches-internal path — replace with a generic issues-log cross-reference
**Notes**: The explicit distinction between "Deviations from Plan" (unplanned work handled automatically) and "Issues Encountered" (problems during planned work) prevents these categories from collapsing into each other — high-value SOP element.

## skills/create-plans/templates/continue-here.md
**Type**: Template — session resume / handoff state snapshot
**Portable**: Yes
**Reason**: The YAML-frontmatter + XML-section pattern (current_state, completed_work, remaining_work, decisions_made, blockers, context, next_action) is generic resumable-session scaffolding with zero taches-specific coupling. Directly usable as a `.continue-here.md` convention in any multi-session agentic workflow.
**Strip**: The phrase "This file gets DELETED after resume" and the path convention `.planning/phases/XX-name/` (replace with local path convention).
**Notes**: Highest-signal resume template seen so far; the `<next_action>` section as a self-contained re-entry point is a standout pattern worth preserving verbatim.

## skills/create-plans/templates/issues.md
**Type**: Template — non-critical enhancement backlog (ISS log)
**Portable**: Yes
**Reason**: The ISS-NNN numbered log with discovery context (Phase/Plan/Task/date), Type, Impact, Effort, and Suggested Phase is a clean, portable enhancement-tracking convention. The "Closed Enhancements" section and the integration-with-roadmap pattern are broadly applicable to any phased project workflow.
**Strip**: The two concrete examples (ISS-002 Redis pooling, ISS-003 UserService refactor) and the WeatherBar roadmap excerpt — illustrative filler, not SOP content.
**Notes**: The "Quick-wins early / substantial refactors deferred / nice-to-haves never" prioritisation heuristic is concise and worth surfacing as a standing rule.

## skills/create-plans/templates/milestone.md
**Type**: Template — milestone entry for MILESTONES.md changelog
**Portable**: Yes
**Reason**: The `v[X.Y] Name (Shipped: YYYY-MM-DD)` structure with Delivered, Phases, Accomplishments, Stats (files/LOC/phases/days), Git range, and What's Next is a generic release-chronicle format. No taches internals; the git-stat commands in the guidelines are universally applicable.
**Strip**: The WeatherBar v1.0/v1.1 example entries and the `<example>` wrapper block — pure filler.
**Notes**: The "do not create milestones for individual phase completions or WIP" guideline is a useful anti-pattern fence worth preserving.

## skills/create-plans/templates/research-prompt.md
**Type**: Template — pre-planning research prompt scaffold
**Portable**: Yes
**Reason**: The session_initialization (verify date before searching), research_objective/scope/sources, verification_checklist, QA blind-spots review, incremental-output workflow (skeleton → append → finalise), and FINDINGS.md output structure are all domain-agnostic research hygiene patterns. Directly portable to any skill that requires a research phase before writing a plan.
**Strip**: The JWT/Next.js example in `<example>` and path convention `.planning/phases/XX-name/FINDINGS.md` (replace with local convention). Also trim the taches-specific bash skeleton in `<incremental_output>` to a pattern note.
**Notes**: The "incremental write to prevent token-limit data loss" pattern and the `<quality_report>` section distinguishing verified vs. assumed claims are standout portable SOPs.

## skills/create-plans/workflows/complete-milestone.md
**Type**: Workflow — multi-step ritual for marking a shipped version as complete (MILESTONES.md, BRIEF.md, ROADMAP.md updates + git tag).
**Portable**: Partially — the milestone lifecycle shape (stats → accomplishments → record → update vision doc → tag) is generic; the file paths and phase/plan hierarchy are taches-specific.
**Reason**: Any project benefits from a "this shipped" ritual with stats, a git tag, and a vision-doc refresh. The seven-step process and version-naming conventions (v1.0 MVP, v1.1 Security…) are extractable. The `.planning/` directory assumptions are not.
**Strip**: All `.planning/phases/` bash commands, taches-specific progress table schema, phase/plan counting logic, the "archive-planning" routing reference.
**Notes**: The "What's next" section at the end of the milestone entry is a strong portable pattern — forces the team to articulate the next goal before closing the record. The `<details>` collapsing of prior vision in BRIEF.md is worth keeping as a doc pattern. Auto-collapse completed milestones in ROADMAP via `<details>` is reusable.

## skills/create-plans/workflows/get-guidance.md
**Type**: Triage/routing workflow — lightweight decision tree to recommend the right planning approach based on project state.
**Portable**: Yes — the decision tree (no brief → brief; no roadmap → roadmap; no phase plan → plan phase; have plan → chunk/execute) and common-situations mapping are generic.
**Reason**: The routing logic (brief → roadmap → phase plan → chunk) is a universal planning ladder that applies to any skill that surfaces multiple planning sub-workflows. The "project feels stuck → identify blocker first" advice is broadly useful.
**Strip**: References to taches-specific workflow filenames (`plan-phase.md`, etc.) — replace with abstract next-action descriptions when porting.
**Notes**: Very thin file; mostly value is in the decision tree and the "common situations" catalogue. Best extracted as a routing preamble or guidance block within a broader planning skill rather than a standalone workflow.

## skills/create-plans/workflows/handoff.md
**Type**: Workflow — creates a `.continue-here.md` context-preservation file when pausing work mid-session.
**Portable**: Partially — the core concept (handoff is a parking lot not a journal; create on pause, delete on resume) and the auto-handoff at context-limit thresholds (warn at 15%, auto-create at 10%) are fully portable. File placement is taches-specific.
**Reason**: Context handoff is a universal problem for any multi-session agentic skill. The lifecycle diagram (working → create → session ends → new session reads → delete → working) and the five context categories (current position, work completed, remaining, decisions, mental context/"vibe") are reusable patterns.
**Strip**: `.planning/phases/XX-name/.continue-here.md` path convention, taches YAML frontmatter fields (phase, total_tasks), `wip:` commit message prefix tied to taches conventions.
**Notes**: The "warn at 15%, auto at 10%" context-limit triggers are a strong portable rule worth extracting verbatim. The "complete current atomic operation before creating handoff" constraint prevents broken state — worth keeping.

## skills/create-plans/workflows/plan-chunk.md
**Type**: Workflow — identifies the immediate next 1–3 tasks from a phase plan and offers execution or prompt-generation options.
**Portable**: Partially — the chunking heuristic (1–3 tasks, coherent work unit, can complete in one session, delivers something testable) and the "what's next vs. plan my session" distinction are generic. File reading is taches-specific.
**Reason**: The sizing guidance is simple but precise and reusable: give one task when asked "what's next", give 2–3 when asked "plan my session". The four offer-execution options (start working / generate prompt / see full plan / different chunk) map well to any task-driven skill.
**Strip**: `cat .planning/phases/XX-current/PLAN.md` bash command, taches phase directory assumptions.
**Notes**: Thinnest of the four workflows — mostly value is in the chunk-sizing rule and the execution-option menu. Best merged into a broader "advance work" section rather than kept as a standalone workflow.

## skills/create-plans/workflows/create-brief.md
**Type**: Conversational requirements-gathering workflow — four-question vision intake (What / Why / Success / Constraints) followed by a decision-gate loop, producing a sub-50-line `.planning/BRIEF.md`.
**Portable**: High. The four-question intake framework, decision-gate loop pattern, and "brief is reference not novel" discipline are universally applicable. The anti-patterns list (no market analysis, no stakeholder sections, no timelines) is clean portable guidance.
**Strip**: `AskUserQuestion` tool calls (harness-specific), `.planning/` path convention (project-local), "not committed yet" batching note (taches-specific commit flow).
**Notes**: The constraint that the brief is the *only human-focused document* is a strong framing worth preserving. The 50-line cap is a concrete, enforceable SOP heuristic.

## skills/create-plans/workflows/create-roadmap.md
**Type**: Phase-decomposition workflow — identifies 3–6 phases from the brief, confirms with user, creates phase directories, and commits brief + roadmap together as project initialisation.
**Portable**: High. The "good phases" criteria (coherent, sequential, sized 1–3 days) and the anti-patterns list (no time estimates, no Gantt charts, no risk matrices, ≤6 phases) are excellent portable SOPs. The `XX-kebab-case` naming convention is opinionated but consistent and worth keeping.
**Strip**: Inline `git commit` heredoc template (taches-specific commit message format), `AskUserQuestion` calls, `mkdir -p .planning/phases` bash snippets, `.planning/` path convention.
**Notes**: The commit-initialisation step (brief + roadmap committed together, never separately) is a useful atomic-commit SOP that transfers well to other project-planning contexts.

## skills/create-plans/workflows/execute-phase.md
**Type**: Full execution engine — locates the next unexecuted PLAN, routes it through segmentation logic (fully autonomous / segmented / decision-dependent), runs tasks with inline deviation handling, surfaces checkpoints, writes SUMMARY, updates ROADMAP, and commits.
**Portable**: Mixed. The five deviation rules with their priority ordering are best-in-class portable SOP content (Rule 1: auto-fix bugs; Rule 2: auto-add missing critical; Rule 3: auto-fix blockers; Rule 4: ask for architectural changes; Rule 5: log enhancements). Authentication-gate handling ("not a failure, expected interaction point") is a strong reusable pattern. Checkpoint display format (═══ borders, structured STOP/verify/resume flow) is portable UX convention.
**Strip**: Subagent routing logic (`Task tool`, `subagent_type="general-purpose"`, parse_segments / segment_execution steps) — these are taches-harness-specific. PLAN/SUMMARY file-naming scheme (`{phase}-{plan}-PLAN.md`). Specific `git add` / commit-scope patterns (`feat(01-01):`). `@context` reference syntax.
**Notes**: The deviation-documentation template (each deviation logged with rule, discovery point, fix, files, verification, commit hash) is uniquely thorough and worth extracting as a standalone SOP. The "Rule 4 ask vs Rules 1–3 fix" decision boundary (correctness/security/ability-to-complete → fix; aesthetic/performance-not-blocking → log) is highly portable and precise.

## skills/create-plans/workflows/plan-phase.md
**Type**: Task-decomposition and plan-authoring workflow — reads roadmap + brief, optionally routes to research first, breaks the phase into typed tasks, applies scope estimation, confirms breakdown, then writes one or more PLAN.md files.
**Portable**: High. The task-quality framework (each task must specify type, files, action, verify, done) and the good/bad task examples are excellent portable SOPs. The scope-splitting heuristics (>3 tasks → split; multiple subsystems → split; >5 files per task → split; complex domains → split) and the "aggressive atomicity principle" (10 small high-quality > 3 large degraded) are strong, transferable rules.
**Strip**: Domain SKILL.md loading block (`~/.claude/skills/expertise/[domain]/SKILL.md`), XML task-format specifics in the written PLAN template, `@` context-reference syntax, `AskUserQuestion` calls, `.planning/` path convention.
**Notes**: The "quality degradation curve" framing (plans degrade in quality as context fills) is a memorable, motivating rationale for the atomicity rule — worth preserving as explanatory context in any extracted SOP. The two-tier breakdown-confirmation display (single plan vs multi-plan) is a good UX pattern for surfacing scope decisions.

## skills/create-plans/workflows/research-phase.md
**Type**: Workflow — pre-planning research loop with confidence gate and open-questions gate before PLAN.md creation.
**Portable**: Yes
**Reason**: The structured flow (identify unknowns → write scoped prompt → execute → produce FINDINGS.md → confidence/open-questions gates → offer next) is tool-agnostic and reusable in any planning skill that has knowledge gaps before implementation planning.
**Strip**: `.planning/` path conventions and Context7 MCP reference (tool-specific); `AskUserQuestion` structured call format (taches-UI-specific); the `NOTE: FINDINGS.md is NOT committed separately` convention (repo-workflow-specific).
**Notes**: The confidence gate (LOW/MEDIUM/HIGH) with branching user prompts is the strongest portable element. The scoped include/exclude research-prompt pattern and the "write FINDINGS.md before PLAN.md" sequencing are both worth preserving as a generic SOP beat.

## skills/create-plans/workflows/resume.md
**Type**: Workflow — session-resume protocol that loads a handoff file, presents a time-ago summary, waits for user confirmation, then deletes the parking-lot file.
**Portable**: Yes
**Reason**: The core loop (locate handoff → parse + display time-ago → explicit user confirmation before proceeding → delete handoff → continue) is a clean, tool-agnostic re-entry pattern applicable to any multi-session agent skill.
**Strip**: `.planning/phases/*/` path glob and bash `cat` snippet (taches-specific conventions); stale-threshold of 2 weeks (arbitrary project constant); multiple-handoff selection UI (taches-specific edge case prose).
**Notes**: "Parking lot, not permanent storage — delete after loading" is the key portable insight. The stale-handoff warning and the explicit wait-for-confirmation beat are both high-value; the > 2-week threshold is an implementation detail that can be parameterised.

## skills/create-plans/workflows/transition.md
**Type**: Workflow — phase-completion and handoff-to-next-phase protocol with PLAN/SUMMARY count verification, stale-handoff cleanup, and ROADMAP.md update.
**Portable**: Yes
**Reason**: The verify-completion → cleanup-stale-handoffs → update-progress-record → offer-next-phase sequence is a general phase-gate pattern applicable to any multi-phase planning skill.
**Strip**: `.planning/` path conventions and specific bash `ls` globs; `.continue-here*.md` naming convention; ROADMAP.md markdown table schema; `completed/` archive subfolder reference (taches create-meta-prompts coupling).
**Notes**: "Forward motion IS progress — no separate update-progress step" is the strongest portable design principle. The partial-completion handling (let user decide, record actual count not ideal count) is also worth preserving. The PLAN-count vs SUMMARY-count parity check is a useful completeness signal that generalises well.

## skills/create-subagents/references/debugging-agents.md
**Type**: Reference — debugging methodology and anti-patterns for subagent systems
**Portable**: Yes
**Reason**: Vendor-agnostic debugging principles (logging, correlation IDs, session tracing, evaluator agents, failure taxonomy). Directly applicable to any multi-agent framework.
**Strip**: JSON log schema with `claude-sonnet-4-5` model strings; alert-threshold table is illustrative and values are arbitrary.
**Notes**: The "most agent failures are context failures, not model failures" maxim is the highest-signal portable takeaway and should be surfaced in any SOP. The 8-step systematic diagnosis loop and the 5-category failure taxonomy (hallucination, format errors, prompt injection, workflow incompleteness, tool misuse) are both portable and comprehensive.

## skills/create-subagents/references/evaluation-and-testing.md
**Type**: Reference — eval framework and testing lifecycle for subagents
**Portable**: Yes
**Reason**: Framework, metrics (task completion rate, tool correctness, robustness, efficiency), G-Eval pattern, LLM-as-judge, and TDD-for-agents approach are all framework-agnostic.
**Strip**: SWE-bench percentages and model-specific benchmark figures; any references to Anthropic-specific infrastructure.
**Notes**: The 70/30 synthetic-vs-real split rule and the "evaluation-driven development" lifecycle (define criteria → test each iteration → monitor production → refine) are the most portable SOPs. The before-deployment checklist is directly promotable as a skill step.

## skills/create-subagents/references/subagents.md
**Type**: Reference — canonical subagent file format, execution model, tool/model selection, and best practices
**Portable**: Partially
**Reason**: File format (YAML frontmatter + XML-structured body), execution model (black-box, no AskUserQuestion), least-privilege tool access, prompt caching structure, and Sonnet+Haiku orchestration pattern are all portable principles. Storage-location hierarchy (`.claude/agents/`, `~/.claude/agents/`) and the `/agents` CLI command are Claude Code–specific implementation details.
**Strip**: Storage paths, `/agents` command, `--agents` CLI flag, and model alias strings (`sonnet`, `haiku`, `opus`) — replace with generic "coordinator/worker/validator" roles in any portable SOP.
**Notes**: "Permission sprawl is the fastest path to unsafe autonomy" is a high-signal portable rule. The Sonnet-plans / Haiku-executes / Sonnet-validates orchestration pattern and the tool-access audit checklist are the strongest portable SOPs from this file.

## skills/debug-like-expert/references/debugging-mindset.md
**Type**: Reference — epistemological foundation for systematic debugging
**Portable**: Yes — all guidance is language/framework-agnostic; applies to any debugging context
**Reason**: Dense, high-signal content covering meta-debugging (treat your own code as foreign), the five major cognitive biases (confirmation, anchoring, availability heuristic, sunk cost, premature certainty), three investigation disciplines (one-variable-at-a-time, complete reading, embrace not-knowing), restart protocols, and the novice-vs-expert craft distinction. Captures *why* debugging fails (mental model mismatch) not just how to do it.
**Strip**: None — every section carries standalone value; the XML tags are structural scaffolding but the prose is clean and dense
**Notes**: The `<meta_debugging>` section ("your own code is guilty until proven innocent") and `<when_to_restart>` signals are particularly portable as standalone rules. The `<cognitive_biases>` block maps 1:1 to a reusable checklist.

## skills/debug-like-expert/references/hypothesis-testing.md
**Type**: Reference — scientific method applied to debugging
**Portable**: Yes — the workflow is universal; JS code examples are illustrative, not prescriptive
**Reason**: Defines falsifiability as the criterion for a useful hypothesis, provides a 7-step experiment design framework (prediction → setup → measurement → criteria → run → observe → conclude), grades evidence quality (strong vs weak), specifies the exact conditions under which to act (understand mechanism + reproducible + evidence + alternatives ruled out), and covers recovery from wrong hypotheses. The `<multiple_hypotheses>` / "strong inference" pattern (one experiment that differentiates N competing hypotheses) is unusually high-value.
**Strip**: The inline JS snippets can be trimmed to pseudocode in a final skill; the `<workflow>` flowchart is worth keeping verbatim as a reference anchor
**Notes**: The `<decision_point>` section's YES/NO checklist is directly promotable as a "when to fix" gate. The `<pitfalls>` block maps cleanly to a "debugging anti-patterns" rule.

## skills/debug-like-expert/references/investigation-techniques.md
**Type**: Reference — toolkit of eight named investigation techniques
**Portable**: Yes — techniques are named, defined, and exemplified in a format that generalises across languages; JS examples are swappable
**Reason**: Covers binary search, comment-out bisection, rubber duck, minimal reproduction, working backwards, differential debugging (time-based and environment-based variants), observability-first (logging, assertions, timing, stack traces), comment-out-everything, and `git bisect`. Each technique includes when-to-use, mechanism, and a concrete worked example. The `<decision_tree>` section maps symptom → technique, and `<combining_techniques>` shows composition order.
**Strip**: Inline bash/JS in `git bisect` and `observability_first` sections can be condensed; the `<combining_techniques>` list is the keeper
**Notes**: `<observability_first>` ("don't code in the dark") and `<minimal_reproduction>` are the highest-ROI standalone rules. The `<decision_tree>` is directly usable as a quick-reference table in the skill header.

## skills/debug-like-expert/references/verification-patterns.md
**Type**: Reference — systematic fix-verification protocols
**Portable**: Yes — entirely process-oriented; no framework dependency
**Reason**: Defines "verified" as a five-part contract (issue gone + mechanism understood + no regressions + multi-environment + stable), then provides five named patterns: reproduction-verification (document steps before fixing, revert-to-confirm), regression-testing (identify adjacent functionality, enumerate what to re-test), test-first-debugging (write failing test → fix → pass → regression guard), environment-verification (env vars / deps / data / network matrix), and stability-testing (repeated runs, stress, soak, timing variation). The verification checklist at the end is a directly shippable artefact.
**Strip**: The bash `for` loop and JS Promise.all stress-test snippets can be summarised; the checklist markdown block should be preserved verbatim
**Notes**: The `<distrust>` section's "red flag phrases" vs "trust-building phrases" contrast is a high-signal addition to any code-review or self-validation skill. The core rule — "assume your fix is wrong until proven otherwise" — is the portable headline.

## skills/create-subagents/references/context-management.md
**Type**: Reference — context and memory management patterns for subagents.
**Portable**: Yes — the memory architecture taxonomy (STM / LTM / working / core / archival), summarization triggers, sliding-window strategy, scratchpad workflow, and compaction protocol are framework-agnostic and apply to any multi-agent system.
**Reason**: Addresses a universal failure mode ("most agent failures are context failures, not model failures") with concrete, implementation-neutral patterns.
**Strip**: Framework-specific sections (LangChain, LlamaIndex); prompt-caching interaction section (vendor/tooling-specific); any Claude Code–specific file paths used as examples.
**Notes**: The structured summary template (Status / Completed / Active / Decisions / Next) and the file-based memory layout (`.claude/memory/`) are directly reusable as SOP templates. Anti-patterns section is particularly high-signal — context dumping, lossy summarisation, and no memory structure are common failure modes worth preserving verbatim.

## skills/create-subagents/references/orchestration-patterns.md
**Type**: Reference — pattern catalog for coordinating multiple subagents.
**Portable**: Yes — Sequential, Parallel, Hierarchical, Coordinator, and Orchestrator-Worker patterns are architecture-agnostic; the decision tree, handoff protocol, and synchronisation guidance apply to any multi-agent framework.
**Reason**: Covers the full design space of orchestration topologies with when-to-use criteria, trade-off comparisons, and hybrid composition examples.
**Strip**: Sonnet 4.5 / Haiku 4.5 model-name benchmarks (vendor-specific); specific performance claim ("90% time reduction") without citation; internal cross-references to sibling files.
**Notes**: The pattern-selection decision tree is the most portable artefact — worth extracting as a standalone reference. The structured handoff format (`From / To / Task / Context / Attachments`) and the partial-failure synchronisation rule (1-of-3 → proceed + flag; 2-of-3 → consider retry) are directly actionable in any SOP.

## skills/create-subagents/references/error-handling-and-recovery.md
**Type**: Reference — failure taxonomy and recovery strategies for subagent workflows.
**Portable**: Yes — failure modes (specification gaps 32%, inter-agent misalignment 28%, verification gaps 24%), recovery strategies (graceful degradation, autonomous retry, circuit breakers, timeouts, evaluator agents), and the structured message-type schema are framework-agnostic.
**Reason**: Provides both a diagnostic vocabulary (named failure modes with root causes) and concrete mitigation patterns usable in any agent system.
**Strip**: Specific alert-threshold numbers (80% / 15% / 2×) — useful as defaults but may need org-specific calibration; model version references; internal file cross-references.
**Notes**: The recovery checklist (error detection / recovery mechanisms / failure communication / quality gates) is an immediately portable SOP template. The evaluator-agent pattern (dedicated haiku-class validator as a quality guardrail) is a strong reusable architectural pattern. Silent-failure anti-pattern (incomplete review silently returns "no issues found") is a high-priority SOP candidate.

## skills/create-subagents/references/writing-subagent-prompts.md
**Type**: Reference — prompt engineering guide for authoring effective subagent definitions.
**Portable**: Yes — XML-over-markdown structure rule, role/focus_areas/workflow/output_format/constraints template, strong-modal-verb guidance, and the "subagents cannot interact with users" constraint are applicable to any agent-authoring workflow.
**Reason**: Consolidates prompt-engineering best practices (specificity, clarity, constraints, trigger keywords, extended thinking) into a single composable template with concrete anti-pattern examples.
**Strip**: Taches-specific tool names (`AskUserQuestion`); internal cross-reference to `@skills/create-agent-skills/references/use-xml-tags.md`; specific model names in frontmatter examples.
**Notes**: The "requires_user_interaction" anti-pattern is the most critical point in the file — it describes a structural error that silently fails at runtime and is easy to make. The quick-reference template at the end of the file is directly promotable as a SOP boilerplate. Description-field optimisation tips (trigger keywords, differentiation from peer agents, proactive trigger phrasing) are high-value for any skill or agent authoring SOP.

## skills/create-mcp-servers/references/large-api-pattern.md
**Type**: Reference / architectural pattern guide
**Portable**: Yes
**Reason**: The resources-based meta-tool pattern (4 meta-tools + on-demand schema loading via MCP resources) is a general-purpose MCP server architecture applicable to any large API. The token-savings rationale, dispatch wiring, operations.json structure, and pagination chunking are all API-agnostic.
**Strip**: All Circle-specific examples (operation names, URIs, field names) and the "Circle MCP Server Metrics" case study. GitHub example is illustrative — keep the skeleton, strip the specifics.
**Notes**: The "3+ operations → use on-demand discovery" threshold is a useful portable heuristic. Disadvantages section (extra discovery step, complexity overhead) should be preserved as a trade-off callout so adopters can make an informed choice.

## skills/create-mcp-servers/references/adaptive-questioning-guide.md
**Type**: Reference / question-bank template
**Portable**: Yes
**Reason**: The four question-sets (API integration, database access, file operations, custom tools) cover the main MCP server archetypes and map cleanly to Step 0 of the skill's purpose-selection flow. The usage protocol (select template → ask 4 questions → repeat until ready) is workflow-agnostic.
**Strip**: Nothing — the file is already terse and generic; no vendor or project-specific content.
**Notes**: Very short file (~40 lines). Likely inlined verbatim into the skill rather than kept as a separate reference. The "AskUserQuestion tool" reference is pi/taches-specific; generalise to "present questions to the user" when porting.

## skills/create-mcp-servers/references/api-research-template.md
**Type**: Reference / Markdown scaffold
**Portable**: Yes
**Reason**: The API_RESEARCH.md template captures everything needed to implement any MCP server: auth method + acquisition path, SDK details, base URL, per-endpoint parameter and response schemas, rate limits, and pagination/webhook patterns. Completely API-agnostic structure.
**Strip**: The "All sources verified as 2024-2025 current" boilerplate line (date-stamps poorly). The `{version if available}` / `{date}` placeholder prose can be tightened but the structure stays.
**Notes**: The "Verified: ✓ Confirmed in official docs" marker per-endpoint is a strong portable practice — worth highlighting as a mandatory field, not optional. Template doubles as a checklist for research completeness.

## skills/create-mcp-servers/references/auto-installation.md
**Type**: Reference / ops runbook
**Portable**: Partially
**Reason**: The secure credential pattern (`~/.mcp_secrets` → `chmod 600` → shell sourcing → `${VAR}` expansion in configs) is portable and should be retained as a security SOP. The four-step install flow (secrets file → `claude mcp add` with actual values → Desktop config with `${VAR}` → verify) is reusable across all MCP server builds.
**Strip**: All three vendor-specific complete examples (Stripe, GoHighLevel, Meta Ads with literal env-var names). TypeScript/Node and HTTP/SSE sections are supplementary — keep as brief notes, not full examples. Troubleshooting block is taches-environment-specific (`~/.claude/scripts/install-mcp.sh` reference) and should be dropped or genericised.
**Notes**: The "What Good Looks Like" ✅/❌ diff at the end is an excellent portable callout — keep it. The 10-rule security checklist is portable and concise enough to include verbatim. macOS-specific Desktop config path (`~/Library/Application Support/Claude/`) should be noted as platform-specific.

## skills/create-mcp-servers/references/typescript-implementation.md
**Type**: Reference — TypeScript MCP server implementation guide covering project setup (package.json, tsconfig), full server scaffold with Zod validation, resource/prompt handlers, McpError patterns, streaming chunking, in-memory state management, env config via dotenv, and npm publish workflow.
**Portable**: Yes
**Reason**: Language-agnostic MCP patterns (tool registry, Zod input validation, stderr-only logging, McpError error codes, stdio transport) are universally applicable. The TypeScript specifics are additive, not taches-proprietary.
**Strip**: Inline `zodToJsonSchema` helper (recommend `zod-to-json-schema` package instead — the file itself says so); `ServerState` class with `connections` tracking (opinionated, not MCP-required); shebang + `bin` publish section (deployment detail, not server-building SOP).
**Notes**: The McpError + ErrorCode wrapping pattern and the "log to stderr, never stdout" rule are high-signal portable SOPs worth promoting. The Promise.race timeout wrapper is a useful defensive pattern to carry forward.

## skills/create-mcp-servers/references/validation-checkpoints.md
**Type**: Reference — Bash validation scripts for each phase of MCP server creation (API research doc, project structure, syntax/build, env vars, Claude Code install, Claude Desktop config).
**Portable**: Partial
**Reason**: The checkpoint *categories* (research doc present, build succeeds, env vars set without echoing values, `claude mcp list` shows Connected, Desktop config entry exists) are portable SOPs. The bash one-liners are useful templates.
**Strip**: Hardcoded `~/Developer/mcp/{server-name}` paths (taches workspace convention); Python-only `python -m py_compile` check in the shared `code-syntax` section (should be language-conditional); `2024|2025` recency grep (date-stamps will age out).
**Notes**: The "verify env vars exist without showing values" pattern (`[ -z "${!var}" ]`) is a strong security SOP to keep. Consider promoting the checkpoint categories as a generic MCP server readiness checklist, dropping the bash scripts themselves.

## skills/create-mcp-servers/workflows/create-new-server.md
**Type**: Workflow — 8-step guided flow for creating an MCP server: intake gate → API research → requirements → project structure → code generation → env vars → Claude Code install → Claude Desktop install → test/verify.
**Portable**: Partial
**Reason**: The step sequence, architecture decision rule (1-2 ops → flat tools; 3+ ops → meta-tools/on-demand discovery), security rule (never ask user to paste secrets in chat), and success criteria are solid portable SOPs. The adaptive intake questioning approach is also reusable.
**Strip**: `AskUserQuestion` tool calls (taches-specific UI primitive); `mcp-api-researcher` subagent delegation (taches internal agent); all `[references/...]` cross-links (taches internal docs); `bash scripts/setup-*.sh` invocations (taches scripts); `templates/` file references; Python-as-default language assumption.
**Notes**: The operation-count → architecture mapping rule is the highest-signal portable insight here. The secret-hygiene step (never paste in chat, verify existence not value) should be a standalone SOP. The "confirm plan with user before writing code" gate at Step 2→3 is worth preserving as a general principle.

## skills/create-mcp-servers/workflows/troubleshoot-server.md
**Type**: Workflow — Diagnostic runbook for MCP server connection failures, covering five issue types: not appearing, disconnected, command-not-found, env var missing, secrets-visible-in-chat.
**Portable**: Yes
**Reason**: All five issue types and their root-cause → fix mappings are generic MCP server problems, not taches-specific. The "CRITICAL: stop, delete conversation, rotate credentials" response to secret exposure is a universal security SOP.
**Strip**: Hardcoded `~/Developer/mcp/{name}` paths; `~/Library/Logs/Claude/` log path (macOS/Claude Desktop specific — should be parameterised); `uv` as the assumed Python runner (taches convention).
**Notes**: The four-command diagnostic bundle (`mcp list`, tail logs, `which` checks, env var inventory without values) is a clean portable first-response checklist. The secrets-visible issue block with CRITICAL severity and immediate rotation instruction is the most important SOP in this file.

## skills/create-mcp-servers/references/oauth-implementation.md
**Type**: Reference / Pattern guide — two mandatory OAuth patterns for MCP servers (stdio isolation + pre-authorization script)
**Portable**: Yes — both patterns apply to any Python MCP server that uses an interactive OAuth library (Spotify, Google, GitHub, etc.); the JSON-RPC-over-stdio constraint is universal to all MCP servers
**Reason**: The stdio isolation pattern addresses a structural constraint of MCP (JSON-RPC over stdio breaks if any library writes to stdout/stderr); the pre-authorization script pattern addresses the headless runtime constraint; both are non-obvious and critical to get right
**Strip**: Python library names in the "Common OAuth Libraries" section (spotipy, google-auth-oauthlib, etc.) are taches-specific; the specific `.cache-*` filename format is library-specific
**Notes**: The implementation checklist is a strong portable artifact; the `authorize.py` template and `open_browser=False` guidance are the highest-signal portable rules; "apply stdio isolation to EVERY api call, not just init" is a non-obvious and important call-out

## skills/create-mcp-servers/references/python-implementation.md
**Type**: Reference / Language implementation guide — full Python MCP server scaffold covering project setup, Pydantic models, async patterns, error handling, config, caching, logging, and distribution
**Portable**: Yes — the patterns (Pydantic for tool arg validation, structured error hierarchy, stderr-only logging, `Config.from_env()` dataclass, time-based cache, `asyncio.gather` for concurrent ops) are reusable Python MCP conventions
**Reason**: Establishes canonical Python MCP project structure and best practices that any Python MCP skill should follow; the `print(..., file=sys.stderr)` rule for logging is easy to miss and critical
**Strip**: The directory structure and `pyproject.toml` boilerplate are scaffolding templates, not portable rules; the specific `aiofiles`/`aiohttp` imports are implementation choices; the PyPI/uvx publishing flow is distribution detail that lives in deployment docs
**Notes**: The three-tier error class hierarchy (ToolError → InvalidArgumentError / ExternalAPIError) is a portable SOP pattern; the async background task pattern (`ServerState` with `_cleanup_loop`) is niche but reusable; `asyncio.wait_for` timeout wrapper deserves mention as a best practice

## skills/create-mcp-servers/references/testing-and-deployment.md
**Type**: Reference / Testing & deployment guide — test pyramid strategy, unit/integration/e2e patterns for TypeScript and Python, packaging for npm/PyPI, Docker, and GitHub Actions CI/CD
**Portable**: Yes — the test pyramid ratio (70/20/10), `InMemoryTransport` for integration tests, pytest-asyncio setup, and the GitHub Actions publish-on-tag pattern are all reusable
**Reason**: Provides concrete, actionable testing structure that can become an SOP; the `InMemoryTransport` approach for integration tests without a live server is particularly valuable and not obvious
**Strip**: The TypeScript Vitest unit test boilerplate is language-specific scaffolding; Docker/docker-compose section is for hosted MCP servers (non-standard deployment); the automated E2E subprocess test is brittle and marked "Advanced" — not portable SOP material
**Notes**: The manual E2E checklist (build → configure → restart Claude Desktop → test → check logs path) is a high-value portable SOP step; log path `~/Library/Logs/Claude/mcp*.log` is macOS-specific; `asyncio_mode = "auto"` in `pyproject.toml` is a common Python footgun worth preserving

## skills/create-mcp-servers/references/tools-and-resources.md
**Type**: Reference / Design patterns guide — tool design principles, input schema best practices (Zod/Pydantic), output content types, common tool archetypes, resource URI schemes, pagination, and large-API scaling note
**Portable**: Yes — the five tool design principles, field-level `.describe()` / `description=` requirement, URI scheme taxonomy, and the large-API context-window warning are universal MCP conventions
**Reason**: Distills the most important design decisions into clear rules; the "50+ tools consumes 8k–15k tokens before any conversation" warning is a critical scaling constraint that belongs in any MCP SOP
**Strip**: The concrete tool implementations (email search, file write, DB query, batch processing) are illustrative examples, not portable rules; the database resource TypeScript example uses raw string interpolation in SQL (a security anti-pattern in the example itself — strip or flag); the reference to `large-api-pattern.md` is an internal cross-link
**Notes**: The security path-traversal check in `writeFileTool` and the table-name whitelist in the DB resource are portable security SOP rules worth extracting explicitly; the URI scheme taxonomy (`file:///`, `db:///`, `api:///`, `config:///`) is a clean portable convention

## skills/create-mcp-servers/references/best-practices.md
**Type**: Reference guide — production MCP server practices across security, reliability, performance, tooling, and observability (Python + TypeScript)
**Portable**: Yes — all patterns are language-dual and framework-agnostic; no personal or workspace-specific content
**Reason**: Covers the full production lifecycle: input validation (Zod/Pydantic), secrets management, rate limiting, SQL injection prevention, OAuth 2.1 auth, `uv` dependency isolation, error hierarchies, structured logging to stderr, LRU caching, connection pooling, async semaphores, retry with exponential backoff, health checks, tool description guidelines, transport selection matrix (stdio / SSE / Streamable HTTP), MCP Inspector workflow, Prometheus metrics, README template, and semantic versioning with deprecation timelines
**Strip**: Nothing — clean of personal paths and workspace references; the multi-tenancy and OAuth 2.1 sections are advanced but portable
**Notes**: Authoritative catch-all reference; the context-optimization section cross-references `large-api-pattern.md` (not in this file set) and `response-optimization.md` (covered separately). The `uv --directory` dependency-isolation pattern and the "always log to stderr" rule are the two most commonly violated practices and deserve prominent placement in any derived SOP.

## skills/create-mcp-servers/references/creation-workflow.md
**Type**: End-to-end creation workflow — 7-step procedure from requirements gathering through verified installation in Claude Code and Claude Desktop
**Portable**: Partially — the workflow structure is portable; implementation details are heavily tied to macOS (~/Library/Logs/Claude/), Lex's personal paths (~/Developer/mcp/), ~/.zshrc, `AskUserQuestion` XML UI elements specific to Taches, and `jq`-based Claude Desktop config manipulation
**Reason**: The portable core is the decision/sequencing logic: gather requirements → choose architecture (traditional ≤2 ops vs. on-demand discovery ≥3 ops) → scaffold project → configure secrets securely (never paste into chat) → install in runtime → verify. Security note on env var handling ("NEVER ask user to paste secrets into chat") is an excellent portable rule.
**Strip**: All `~/Developer/mcp/` and `~/.zshrc` path assumptions; `AskUserQuestion` XML blocks (Taches-only UX pattern); macOS-specific Claude Desktop log paths; `jq` config-patching scripts (fragile and environment-specific). Replace with generic placeholders or abstract to "add to your shell profile" and "edit claude_desktop_config.json".
**Notes**: The architecture decision rule (1–2 ops → traditional, 3+ ops → on-demand discovery) is the most reusable signal and should be surfaced early in any derived skill. Step 4 ("Provide exact commands; never receive secrets in chat") is a strong security SOP worth extracting as a standalone rule.

## skills/create-mcp-servers/references/response-optimization.md
**Type**: Technical pattern — two-part response optimization (field truncation + adaptive pagination) for context-efficient MCP servers
**Portable**: Yes — pure algorithmic patterns with reference implementations in Python; no personal or environment-specific content
**Reason**: Defines the mandatory optimization loop: (1) strip fields to only what Claude needs (FIELD_CONFIGS with dot-notation extraction, 85% token reduction); (2) estimate token cost and chunk responses exceeding 20 k tokens into 15 k chunks stored in a session cache; (3) expose a `continue` tool for multi-page navigation; (4) optional on-demand field selection for GET operations. Includes decision tree (always truncate lists; always paginate if 100+ items possible), implementation checklist, cache TTL cleanup, and before/after token arithmetic showing 42,500 tokens saved per 5 searches.
**Strip**: Nothing — entirely self-contained and portable
**Notes**: The `MANDATORY` framing ("apply BEFORE declaring server complete") and the implementation checklist are ready to lift verbatim into a skill checklist section. The `estimate_tokens` approximation (chars ÷ 4) is deliberately rough but consistently applied — note this assumption in any derived SOP so implementers can swap in a real tokenizer if precision matters.

## skills/create-mcp-servers/references/traditional-pattern.md
**Type**: Template — minimal flat-tools pattern for MCP servers with 1–2 operations (Python and TypeScript)
**Portable**: Yes — templates are clean; only the testing section references `~/Developer/mcp/` which is easily generalised
**Reason**: Provides ready-to-copy boilerplate for three variants: API integration (httpx / axios), file operations (JSON read/write), and custom tools (safe AST calculator). Establishes the migration threshold: at 3+ operations switch to on-demand discovery (cross-ref: `large-api-pattern.md`). Error-handling rule — always return errors as `TextContent`, never raise exceptions to Claude — is a clear, portable constraint. Context overhead is quantified (~150–300 tokens per operation) so the decision to stay traditional is data-driven.
**Strip**: `~/Developer/mcp/` testing path — replace with generic `<project-dir>`
**Notes**: The "signs you need on-demand discovery" list (3rd+ operation, context overhead > 500 tokens, not all operations used per conversation, logical operation groupings) is a useful decision checklist that should appear early in any MCP skill as an architecture gate.

## .references/taches/skills/create-hooks/references/command-vs-prompt.md
**Type**: Reference / decision guide
**Portable**: Yes
**Reason**: The command-vs-prompt decision tree, performance comparison table, and "combining both hooks" pattern are generic Claude Code hook authoring guidance with no taches-specific logic. The criteria (speed, cost, complexity, context-awareness) and the JSON/bash examples apply to any hooks skill.
**Strip**: All taches branding / relative cross-links; replace example paths with generic placeholders.
**Notes**: The performance table (`<100ms` vs `1-3s`, `~$0.001-0.01`) and the ordering rule ("if any hook blocks, execution stops") are particularly worth preserving as concrete guidance.

## .references/taches/skills/create-hooks/references/troubleshooting.md
**Type**: Reference / troubleshooting runbook
**Portable**: Yes
**Reason**: Covers universal Claude Code hook failure modes — JSON validation, matcher case-sensitivity, `stop_hook_active` infinite-loop guard, timeout configuration, `$ARGUMENTS` placeholder, and debug workflow. None of this is taches-specific.
**Strip**: Internal cross-links; replace any taches-specific paths with generic equivalents.
**Notes**: The `stop_hook_active` infinite-loop guard and the six-step debug workflow are standout portable SOPs. The "default to approve" pattern for shell scripts is also a strong portable safety heuristic.

## .references/taches/skills/create-mcp-servers/workflows/update-existing-server.md
**Type**: Workflow / update checklist
**Portable**: Yes
**Reason**: The six-step update flow (identify → locate → understand architecture → plan → implement → verify) is a generic MCP server maintenance SOP. The 2→3 operation threshold for architecture changes and the on-demand discovery vs. flat-tools bifurcation are universally applicable.
**Strip**: `<required_reading>` cross-links to taches-internal references; `~/Developer/mcp/` path convention (replace with generic `<server-dir>`).
**Notes**: The `claude mcp list` + log-tail verification pattern is a concrete portable close-out check. The note about OAuth and response-optimization as conditional concerns (not always-on) is good scoping guidance.

## .references/taches/skills/create-mcp-servers/templates/operations.json
**Type**: Template / JSON scaffold
**Portable**: Yes
**Reason**: A reusable `operations.json` template for the on-demand discovery pattern (4 meta-tools: discover, get_schema, execute, continue). Category/operation schema with `parameters` + `required` arrays is a portable contract that any MCP skill can import unchanged.
**Strip**: `_comment` / `_usage` internal notes can be trimmed or reworded; example category names (`items`, `search`) are illustrative — keep as-is or genericise.
**Notes**: The `_meta_tools` block naming the four meta-tools is the highest-value extractable element — it defines the on-demand discovery API surface and should be preserved verbatim in any derived skill.

## skills/create-hooks/references/hook-types.md
**Type**: Reference taxonomy — 9 hook events with when-fires, can-block flag, input/output schemas, use cases, and a canonical example per event (PreToolUse, PostToolUse, UserPromptSubmit, Stop, SubagentStop, SessionStart, SessionEnd, PreCompact, Notification).
**Portable**: Yes — event names, blocking semantics, and schema shapes are platform facts that translate directly into any hook-authoring SOP.
**Reason**: Defines the complete vocabulary a skill author needs to select the right event; the can-block column and `stop_hook_active` infinite-loop guard are operationally critical and not obvious from first principles.
**Strip**: The inline JSON config examples duplicate what `examples.md` covers in more detail — those can be trimmed to one-liners in a distilled SOP.
**Notes**: The `stop_hook_active` guard (check before blocking in Stop/SubagentStop) should be promoted to a mandatory checklist item in any Stop-hook SOP; it's the single most common footgun.

## skills/create-hooks/references/examples.md
**Type**: Cookbook — ready-to-use hook configurations grouped by category (notifications, logging, code quality, safety/validation, context injection, workflow automation, session management, advanced patterns).
**Portable**: Partially — the structural patterns (matcher + command/prompt hook + jq pipeline) are universally applicable; the concrete commands (osascript, afplay, specific paths, auto-commit) are environment-specific and should be treated as illustrative stubs.
**Reason**: The categories map well to the use-case taxonomy in `hook-types.md` and give concrete shape to abstract events; the "chain multiple hooks" and "conditional by file type" patterns are non-obvious and worth preserving as SOP examples.
**Strip**: macOS-specific commands (osascript, afplay), hardcoded paths (`/path/to/...`), and the auto-commit example (promotes risky behaviour without a guard). Linux-only variants (notify-send) can be footnoted rather than repeated in full.
**Notes**: The "project-specific hooks via `$CLAUDE_PROJECT_DIR`" pattern at the end is high-value and under-emphasised — worth surfacing as a best-practice callout in the SOP.

## skills/create-hooks/references/input-output-schemas.md
**Type**: Formal spec — complete JSON input/output schemas for every hook event, common fields shared across all hooks, tool-specific `tool_input` shapes, `updatedInput` mutation pattern, and error-handling conventions.
**Portable**: Yes — this is the ground truth for what fields are available in scripts and what fields the runtime reads back; directly actionable in any SOP or script template.
**Reason**: The `updatedInput` partial-update pattern (only specify fields to change) and the `$ARGUMENTS` / LLM prompt response contract are subtle details that would otherwise require reading source code; they belong in any hook-authoring reference.
**Strip**: The TypeScript-style common fields block at the top is redundant with the per-event schemas below it. Tool-specific `tool_input` shapes for Read/Grep are low-frequency and could be collapsed into a single "see tool docs" note.
**Notes**: The "LLM Prompt Hook Response" section (prompt hooks must return valid JSON; malformed output fails gracefully) should become an explicit warning box in the SOP — prompt hooks are the most likely place authors produce invalid output.

## skills/create-hooks/references/matchers.md
**Type**: Pattern-matching guide — regex syntax for tool-name matchers, common patterns (exact, OR, prefix, suffix, wildcard), MCP tool naming convention (`mcp__{server}__{tool}`), multi-matcher evaluation semantics, debugging via `--debug`, and performance guidance.
**Portable**: Yes — matcher syntax, MCP naming, and evaluation rules are runtime facts applicable to any hook configuration.
**Reason**: The MCP double-underscore naming scheme and the "each matcher evaluated independently / a tool can match multiple matchers" semantics are not documented elsewhere; essential for anyone writing hooks against MCP tools or composing multiple matchers.
**Strip**: The JavaScript one-liner test examples (node -e ...) are useful for debugging but don't belong in a procedural SOP — move to a "tips" appendix. The negative-lookahead and case-insensitive patterns are edge cases; footnote rather than feature.
**Notes**: The "Common mistakes" block (case sensitivity, missing `.` before `*`, unintended partial match) is high-signal and should be preserved verbatim as a pitfall list in the SOP. The tool name reference list at the end is the only place all built-in tool names are enumerated — worth keeping as a lookup table.

## skills/create-meta-prompts/references/metadata-guidelines.md
**Type**: Reference standard — XML schema for research/plan output metadata  
**Portable**: Yes  
**Reason**: The four-field metadata block (confidence level + rationale, dependencies, open_questions, assumptions) is a universal pattern for any agent producing research or planning outputs. The three-tier confidence vocabulary (high/medium/low with precise definitions) is clean and reusable verbatim.  
**Strip**: Nothing structural; minor taches-specific framing in the overview ("Include in all research, plan, and refine prompts") can be generalised.  
**Notes**: The `quality_report` sub-block defined in `research-patterns.md` extends this schema — the two files work as a pair. Worth promoting together as a single "research output metadata" SOP.

## skills/create-meta-prompts/references/refine-patterns.md
**Type**: Workflow — iterative improvement loop for research/plan documents  
**Portable**: Partially  
**Reason**: The core pattern (archive-before-overwrite → targeted feedback → preserve-what-worked → versioned SUMMARY.md) is a strong portable SOP for any iterative document refinement workflow. The four sub-types (deepen, expand scope, update plan, correct errors) cover the realistic space of refinement triggers.  
**Strip**: `.prompts/{num}-{topic}-{purpose}/` path conventions and the `@.prompts/` reference syntax are taches-specific. The numbered-folder scheme for prompt history is also local convention.  
**Notes**: The prompt template's `<preserve>` / `<feedback>` / `<requirements>` tripartite structure is the most reusable element — it enforces that refinement is surgical rather than a full rewrite. The dependency-check guard ("Cannot refine — target output doesn't exist") is worth carrying forward.

## skills/create-meta-prompts/references/research-patterns.md
**Type**: Workflow — structured research phase with quality controls and incremental output  
**Portable**: Partially  
**Reason**: Three elements are highly portable: (1) the **incremental write pattern** (initialise skeleton → append findings as discovered → finalise metadata) which prevents token-limit data loss; (2) the **verification checklist + blind-spots review** ("What might I have missed?" + critical-claims audit); (3) the **structured finding format** (`<finding category>` / title / detail / source / relevance). The `quality_report` section (sources_consulted, claims_verified, claims_assumed, contradictions_encountered, per-finding confidence) extends the metadata schema valuably.  
**Strip**: `.prompts/{num}-{topic}-research/` path conventions, `@.prompts/` syntax, `summary-template.md` cross-references, and the session-initialisation `!date` block (tool-specific).  
**Notes**: The `<session_initialization>` date-check idiom is taches-specific tooling but the *intent* (anchor searches to current year) is portable as a plain instruction. The pre-submission checklist is a concise, extractable artefact on its own.

## skills/create-meta-prompts/references/research-pitfalls.md
**Type**: Reference — anti-pattern catalogue with red flags and quick-reference checklist  
**Portable**: High  
**Reason**: All eight pitfalls (scope assumptions, vague sources, deprecated-vs-current confusion, tool-environment conflation, confident negative claims without citations, missing enumeration, single-source verification, assumed completeness) and all five red flags are general research failure modes not tied to taches tooling. The quick-reference checklist is immediately reusable as a closing gate in any research skill.  
**Strip**: "Lessons From: MCP configuration research gap" attribution line is taches-specific provenance; otherwise the document is self-contained.  
**Notes**: Pitfall 5 (confident negative claims without citation) and Pitfall 6 (missing enumeration) are the highest-signal entries — they address the most common failure mode in LLM-generated research. The "Continuous Improvement" section (document gap → root cause → update) is a portable living-document maintenance SOP.

## skills/create-meta-prompts/references/do-patterns.md
**Type**: Reference / prompt-pattern library for execution ("Do") phase prompts — XML-structured template with `<objective>`, `<context>`, `<requirements>`, `<implementation>`, `<output>`, `<verification>`, and `<success_criteria>` sections; includes simple vs complex variations and non-code examples (docs, architecture design).
**Portable**: Yes
**Reason**: The XML prompt template structure and three key principles — (1) always reference upstream chain artifacts, (2) every artifact needs an explicit output path, (3) verification must match the task type — are universally applicable to any execution-phase prompt in any domain or toolchain.
**Strip**: `.prompts/{num}-{topic}-{purpose}/` folder convention; `SUMMARY.md` creation instruction referencing the repo-local `summary-template.md`; Node/npm-specific verification commands (`npm test`, `npx tsc`, `npx @redocly/cli lint`).
**Notes**: The "Avoid X — because Y" pattern in `<implementation>` (e.g., "Never store tokens in localStorage — XSS vulnerable") is an especially strong SOP: constraints are paired with rationale so the executing model can reason about edge cases rather than blindly follow rules.

## skills/create-meta-prompts/references/intelligence-rules.md
**Type**: Reference / meta-prompting intelligence rules — heuristics for complexity assessment (simple vs complex prompt indicators), extended thinking trigger phrases, parallel tool-call guidance, context-loading rules, streaming-write pattern for large outputs, Claude-to-Claude vs human output formatting, and prompt depth guidelines (minimal / standard / comprehensive line counts).
**Portable**: Yes
**Reason**: All rules operate at the level of LLM prompt design and are independent of any specific codebase, tool, or domain; they apply wherever prompts are generated for downstream models.
**Strip**: `.prompts/` path convention used in loading-pattern examples; repo-local file references (`@src/auth/middleware.ts` etc.) used purely as illustrations.
**Notes**: Two standout portable SOPs: (1) **Streaming writes** — instruct the model to append each finding as it is discovered rather than buffering, preventing token-limit data loss on long research/plan outputs; (2) **Why explanations** — always pair a constraint with its rationale (the "bad/good example" pair), which directly implements the workspace preference for positive, reason-led framing over bare prohibitions.

## skills/create-meta-prompts/references/plan-patterns.md
**Type**: Reference / prompt-pattern library for planning ("Plan") phase prompts — XML plan structure with `<phases>`, `<tasks>` (priority-tagged), `<deliverables>`, `<dependencies>`, and `<metadata>` (confidence, open questions, assumptions); three plan-type variants: implementation roadmap, decision framework, and process definition.
**Portable**: Yes
**Reason**: The phase/task/metadata XML skeleton and the three plan archetypes (roadmap, decision, process) apply to any planning context regardless of tech stack or workflow tool.
**Strip**: `.prompts/{num}-{topic}-plan/` folder convention; `SUMMARY.md` creation instruction; cross-links to repo-local `summary-template.md` and `metadata-guidelines.md`.
**Notes**: The **decision framework** variant (`<options>` with per-criterion fit scores + `<recommendation>` with risks and mitigations) is a highly reusable SOP for any multi-option technical choice. The `<execution_notes>` field inside phases ("This phase modifies files from phase 1…") is a strong pattern for maintaining cross-phase context in chained prompts.

## skills/create-meta-prompts/references/question-bank.md
**Type**: Reference / intake question bank — YAML-formatted question templates organised by prompt type (universal, do, plan, research, refine), each with `header`, `question`, `options` with descriptions, and `multiSelect` flags; ends with six `question_rules`.
**Portable**: Yes
**Reason**: The question categories and the principle of routing by purpose (universal gate → type-specific follow-ups) apply to any meta-prompting or prompt-generation skill; the YAML shape is tool-agnostic and can be adapted to any intake mechanism.
**Strip**: `AskUserQuestion` tool references (taches-specific UI tool); `.prompts/{folder}/` path patterns in option labels (implementation detail of taches' file layout).
**Notes**: The six `question_rules` at the end are the most directly portable SOP: max 2–4 questions per round, always describe option implications, prefer options over free-text, only ask about genuine gaps. These map cleanly to workspace preferences for focused, non-overwhelming prompts.

## skills/setup-ralph/references/operational-learnings.md
**Type**: Reference / guidance document
**Portable**: Yes
**Reason**: AGENTS.md evolution pattern (start-minimal → observe → add on repeated failure → prune staleness) is a universally applicable operational-learning SOP independent of the Ralph runtime or any specific framework.
**Strip**: All taches/Ralph-specific naming (AGENTS.md filename, `ralph`, loop.sh references). Rename to a generic "project-learnings file" concept.
**Notes**: Rich anti-pattern catalogue (The Novel, The Rule Book, The Spec Duplicate, The Wishlist, etc.) is the most portable section — directly reusable in any SOP that governs how agents capture and evolve project context. The five-phase maturity arc (Days 1-3 → Month 2+) is a strong candidate for inclusion.

## skills/setup-ralph/workflows/setup-new-loop.md
**Type**: Workflow (setup wizard)
**Portable**: Partial
**Reason**: The step ordering for bootstrapping an autonomous coding environment (confirm dir → safety check → gather context → scaffold structure → generate config → initialize learnings file → display usage) is a reusable setup-workflow SOP pattern. The security-notice block (Docker isolation, dangerously-skip-permissions warning) and the "minimal AGENTS.md on day 0" convention are portable.
**Strip**: All Ralph-specific tooling (loop.sh, loop-docker.sh, PROMPT_plan.md/PROMPT_build.md templates, `claude setup-token`). AskUserQuestion UI idiom is taches-specific.
**Notes**: The backpressure-level menu (tests-only → tests+types → full validation → custom) is a reusable decision framework worth preserving as a standalone SOP element. The 12-step structure is longer than ideal for a portable SOP; condense to the durable skeleton.

## skills/setup-ralph/workflows/understand-ralph.md
**Type**: Workflow (educational / onboarding explainer)
**Portable**: Low–Partial
**Reason**: The explanations embedded in each branch contain strong conceptual content (fresh-context-per-iteration rationale, file-I/O as state, three-phase model, backpressure feedback loop, AGENTS.md evolution arc, "when to use / when not to use" decision tree) that can be extracted as standalone reference material or SOP preamble sections.
**Strip**: All Ralph/Geoffrey Huntley provenance, `while :; do cat PROMPT.md | claude ; done` motif, and the interactive menu/routing structure (this is a taches runtime concern).
**Notes**: The "When to use" decision heuristic ("Can I write specs clear enough that passing tests proves completion?") is highly portable as a gate criterion in any autonomous-coding SOP. The three-phase framing (Plan → Build → Observe) is the most durable element.

## skills/setup-ralph/workflows/customize-loop.md
**Type**: Workflow (customization guide)
**Portable**: Partial
**Reason**: The four customization axes — prompts, validation, loop behaviour, and learnings-file — map cleanly onto a generic "tune your autonomous agent" SOP. The principle "start minimal, evolve through observation, one change at a time, test then keep-or-revert" is portable. The validation-removal warning is a strong reusable guardrail.
**Strip**: Ralph-specific flags (--dangerously-skip-permissions, RALPH_MAX_STUCK, RALPH_BACKUP env vars, loop-docker.sh), model names tied to Anthropic pricing tiers as implementation detail, AskUserQuestion UI idiom.
**Notes**: The stuck-detection concept (auto-skip after N consecutive failures vs. manual intervention) is a useful SOP decision point for any looping agent. The "verify and test: single iteration before committing to change" pattern is portable as a tuning-safety SOP step.

## .references/taches/skills/create-meta-prompts/references/summary-template.md
**Type**: Reference template / structural convention
**Portable**: Yes
**Reason**: Defines a reusable SUMMARY.md schema (version, key findings, decisions needed, blockers, next step, confidence, iterations) that is tool-agnostic and applies to any agent workflow that produces deliverables.
**Strip**: Remove the XML-tagged `<overview>`, `<template>`, `<field_requirements>`, and `<purpose_variations>` wrapper tags — the content inside is what matters. Drop the `*Full output: {filename.md}*` footer line (taches-specific artefact-naming convention).
**Notes**: The "substantive one-liner" rule and the purpose-specific Key Findings guidance (Research / Plan / Do / Refine) are high-signal; worth preserving verbatim. The `Decisions Needed` / `Blockers` framing maps well to the self-validation skill's close-out protocol.

## .references/taches/skills/create-slash-commands/references/arguments.md
**Type**: Reference documentation (Claude Code slash-command argument syntax)
**Portable**: Yes
**Reason**: Documents `$ARGUMENTS`, `$1`/`$2`/`$3` positional syntax, `@ $ARGUMENTS` file-reference pattern, and combining arguments with dynamic bash context — all standard Claude Code features usable in any project.
**Strip**: Remove the "Source: Official Claude Code documentation" attributions (redundant provenance noise). Drop the duplicate Pattern 1–3 examples that are already covered in the Best Practices section. The "Empty Arguments" fallback pattern and "Quote arguments containing spaces" note can be condensed to a single bullet.
**Notes**: The `argument-hint` frontmatter field shown in the "Provide Clear Descriptions" block is particularly portable — it's an underused convention worth surfacing in a skill. The `Arguments + Tool Restrictions` combination example is the most actionable composite pattern.

## .references/taches/skills/create-slash-commands/references/patterns.md
**Type**: Reference catalogue (slash-command structural patterns)
**Portable**: Yes
**Reason**: Provides battle-tested command templates for git workflows, code analysis, issue tracking, file operations, thinking-only tasks, and multi-step workflows — all in Claude Code's native `<objective>/<process>/<success_criteria>` XML structure.
**Strip**: Deduplicate the Git Commit pattern (appears as both "full context" and "simple" variants — keep only the full-context one). Remove the Anti-Patterns section's ❌ examples; the positive patterns already imply the anti-patterns. The "Command Chaining — Analysis → Action" and "Multi-Step Workflow" sections overlap heavily; merge or keep only one.
**Notes**: The `<objective>/<context>/<process>/<testing>/<verification>/<success_criteria>` XML skeleton is the core portable artefact. The `SequentialThinking` allowed-tools pattern (thinking-only commands) is novel and not represented in the current skills tree.

## .references/taches/skills/create-slash-commands/references/tool-restrictions.md
**Type**: Reference documentation (allowed-tools frontmatter field)
**Portable**: Yes
**Reason**: Covers the full `allowed-tools` whitelist syntax — array format, `Bash(pattern:*)` wildcards, read-only tool sets, and security patterns (prevent exfiltration, prevent destructive ops, controlled deployment). Applies to any Claude Code project.
**Strip**: Remove the "When to Restrict / Don't Restrict" decision tree (too verbose; distils to a single heuristic). Drop the "Testing Tool Restrictions" section (obvious procedural filler). The Limitations list (4 bullets) can be condensed to a single note.
**Notes**: The security-pattern trio (prevent exfiltration, prevent destructive ops, controlled deployment) is the most portable finding — not represented in current skills. The `allowed-tools: [Read, Grep, Glob]` read-only pattern and `Bash(git status:*), Bash(git diff:*)` minimal-permission principle are both immediately usable in skill templates.

## skills/setup-ralph/references/ralph-fundamentals.md
**Type**: Reference — core philosophy and mechanics of the Ralph autonomous coding loop (bash `while :; do cat PROMPT.md | claude; done`).
**Portable**: Yes — the three-phase structure (plan / build / observe), fresh-context-per-iteration principle, file-I/O-as-state via `IMPLEMENTATION_PLAN.md`, and "move outside the loop" observer role are framework-agnostic and widely applicable.
**Reason**: Distils the key design insight that context accumulation is the enemy and a persistent plan file is sufficient shared state; the observer-role framing ("tune it like a guitar") is a durable mental model for any agentic loop.
**Strip**: Bash escape-hatch commands (`git reset --hard`, `./loop.sh 20`) and the "when to regenerate plan" operational runbook — too implementation-specific for a portable SOP.
**Notes**: The "200K ≈ 176K usable / smart zone at 40-60%" token-budget heuristic is worth preserving as a concrete sizing rule. The parallel-subagents-for-reads vs. single-subagent-for-builds distinction is a high-signal pattern.

## skills/setup-ralph/references/prompt-design.md
**Type**: Reference — prompt authoring guidelines for planning-mode and building-mode prompts.
**Portable**: Yes — the five anti-patterns (mixing modes, over-specifying, sequential-read assumption, no clear exit, vague validation) and the minimal-then-evolve principle apply to any agentic prompt, not just Ralph.
**Reason**: The "prompts are signs, not rules" reframe and the concrete template skeletons encode hard-won lessons about agentic prompt failure modes; the start-minimal / add-only-on-observed-failure discipline is a portable SOP.
**Strip**: The verbatim planning and building prompt templates (they are starter scaffolding, not SOP content); language-specific validation command blocks (JS/TS, Python, Go, Rust) — those belong in a setup checklist, not a portable SOP.
**Notes**: The `@filename` inline-load pattern and subagent count guidance (50-100 / 250-500 / 500+) are concise, actionable rules worth keeping. The "move stable patterns to AGENTS.md" lifecycle note is a good governance hook.

## skills/setup-ralph/references/validation-strategy.md
**Type**: Reference — backpressure design: choosing, layering, and tuning automated validation.
**Portable**: Yes — the backpressure-as-steering mental model, the four validation types (tests > type-checking > linting > build), the four-level escalation ladder, and the "stuck for 3+ attempts → note blocker and move on" escape hatch are all framework-agnostic.
**Reason**: Frames validation not as a quality gate but as a self-correcting steering mechanism; the "single subagent for build/tests creates the backpressure bottleneck" insight is a concrete, portable design rule.
**Strip**: The "no tests? start here" bootstrapping section (vitest/pytest install commands) and the week-by-week tuning cadence — operational how-tos that belong in a setup guide, not a portable SOP.
**Notes**: The five failure-pattern taxonomy (wrong impl / wrong test / API mismatch / lint style / missing dep) is a useful diagnostic checklist worth preserving. The "failures should decrease over time; if they increase, regenerate plan" heuristic is a good health signal.

## skills/setup-ralph/references/project-structure.md
**Type**: Reference — required file layout and directory conventions for a Ralph project.
**Portable**: Partially — the separation of concerns (loop script / planning prompt / building prompt / plan file / learnings file / specs dir / src dir) and the "one sentence without 'and'" spec-scoping test are portable; the concrete filenames (`loop.sh`, `PROMPT_plan.md`, etc.) are Ralph-specific conventions.
**Reason**: The file-loading-order section (prompt → AGENTS.md → plan → specs via subagents → src via subagents) makes the context-budget allocation concrete and teachable; the topic-of-concern scoping test is a reusable spec-writing heuristic.
**Strip**: The verbatim bash `loop.sh` implementation blocks, the directory-tree ASCII diagrams, and the language-specific test-file location notes — scaffolding details that belong in a quickstart template, not a portable SOP.
**Notes**: The "IMPLEMENTATION_PLAN.md is the ONLY state that persists" rule and the spec-scoping heuristic are the two highest-value portable elements. The minimal-viable-structure list (loop + build prompt + empty plan + src) is a useful forcing function for getting started.

## skills/setup-ralph/workflows/troubleshoot-loop.md
**Type**: Workflow (interactive troubleshooting loop)
**Portable**: Partial
**Reason**: The step-by-step diagnostic tree (identify → diagnose → fix → prevent) and the "escape hatch" ladder (reset stuck-tracker → revert commits → nuke state) are broadly reusable SOP patterns for any agentic loop. The Ralph-specific tooling (`.ralph_stuck_tracker`, `loop.sh`, `PROMPT_*.md`) is tightly coupled to this one harness.
**Strip**: All Ralph-specific file names (`ralph.log`, `.ralph_stuck_tracker`, `loop.sh`, `PROMPT_plan.md`, `PROMPT_build.md`), `loop-docker.sh` references, `RALPH_MAX_STUCK` env var, and the `Co-Authored-By: Ralph Wiggum` convention.
**Notes**: The four-tier escape-hatch ladder (reset tracker → revert N commits → regenerate plan → nuclear wipe) is the strongest portable element — worth extracting as a generic "agentic loop recovery SOP". The "prevent recurrence" step (add learning to AGENTS.md, update prompts) is also a clean, portable habit.

## skills/setup-ralph/templates/PROMPT_build.md
**Type**: Prompt template (agent build-mode instruction set)
**Portable**: High
**Reason**: The "one task per iteration, investigate before implementing, validate before commit, update plan, commit with message, exit" loop is a clean universal TDD-adjacent agentic pattern that works for any Claude Code agent, not just Ralph.
**Strip**: Ralph persona copy ("You are Ralph"), `Co-Authored-By: Ralph Wiggum <ralph@autonomous.ai>` footer, `{{VALIDATION_COMMANDS}}` placeholder (rename/generalize), and the hard-coded 500-subagent counts (policy, not template).
**Notes**: The safety block (never `rm -rf` without echoing path first, `mktemp -d` for test dirs, enumerate critical off-limits directories) is highly portable and strong enough to promote to a standalone rule or skill preamble. Subagent count caps (500 for reading, 1 for validation) encode useful backpressure thinking but should be expressed as principles rather than magic numbers.

## skills/setup-ralph/templates/PROMPT_plan.md
**Type**: Prompt template (agent planning-mode instruction set)
**Portable**: High
**Reason**: The plan-only-no-implement discipline ("DO NOT implement anything", "Do NOT commit anything"), gap-analysis-first approach, and prioritized-task-list format are clean universal patterns applicable to any agentic planning workflow.
**Strip**: Ralph persona copy ("You are Ralph"), hardcoded 250 subagent count, Ralph-specific paths (`specs/*`, `src/lib/*`, `IMPLEMENTATION_PLAN.md`), and `./loop.sh plan` invocation.
**Notes**: The "confirm before assuming missing" instruction (search codebase before declaring a gap) prevents a common agentic failure mode and is worth surfacing as a standalone rule. The separation of planning mode from building mode into distinct prompt files is itself an architectural SOP worth capturing.

## skills/expertise/n8n-automations/SKILL-SPEC.yaml
**Type**: Skill specification / meta-build manifest (YAML)
**Portable**: Partial
**Reason**: The pattern of a YAML spec that drives parallel subagent batches to generate all skill reference files and workflow files is a reusable meta-skill construction pattern. The n8n domain content (nodes, expressions, deployment) is domain-specific.
**Strip**: All n8n domain content (node types, `$json` syntax, deployment options, AI-node references). The canonical-terminology block structure is portable but its values are n8n-specific.
**Notes**: The SKILL-SPEC.yaml format itself (metadata → principles → terminology → references with batch+research_queries → workflows with required_refs+verification → batch_summary) is the most portable artifact — it could become a template for scaffolding any new expertise skill. The batching strategy (core architecture first, domain-specific second, supporting third, workflows after references complete) encodes a useful dependency-ordering principle worth extracting as an SOP for skill construction.

## skills/expertise/iphone-apps/SKILL.md
**Type**: Developer workflow / operating principles skill with intake routing and platform-specific verification loops.
**Portable**: YES — HIGH VALUE.
**Reason**: The six `<essential_principles>` (Prove Don't Promise, Tests for Correctness Eyes for Quality, Report Outcomes Not Code, Small Steps Always Verified, Ask Before Not After, Always Leave It Working) are entirely platform-agnostic and apply to any agentic development task. The intake → routing → workflow dispatch pattern, the verification loop structure (build → test → launch → report), and the testing decision matrix (correctness vs. desirability split) are all universally reusable.
**Strip**: All iOS/Swift-specific CLI commands (`xcodebuild`, `xcrun simctl`, `xcsift`), simulator destination flags, bundle IDs, SwiftUI/UIKit/framework mentions, the `<reference_index>` and `<workflows_index>` blocks (repo-local paths), and the iOS 26/iOS 18 version references.
**Notes**: The portable core is the six principles + testing decision matrix. These are among the strongest developer-agent operating principles seen across this audit — concrete, actionable, and framed around outcomes not process. The `<when_to_test>` section's correctness/desirability split is particularly strong and rare. Near-duplicate of `macos-apps/SKILL.md` for portable content; a single merged SOP would cover both.

## skills/expertise/macos-apps/SKILL.md
**Type**: Developer workflow / operating principles skill with intake routing and platform-specific verification loops.
**Portable**: YES — HIGH VALUE (near-duplicate of iphone-apps portable core).
**Reason**: Identical six `<essential_principles>` to the iOS skill — fully platform-agnostic. Same intake → routing → workflow pattern. Same testing decision matrix. macOS verification loop (`xcodebuild build/test`, `open App.app`) is slightly simpler than iOS but equally illustrative of the verify-before-report principle.
**Strip**: All macOS/Swift-specific CLI commands (`xcodebuild`, `open`, `xcsift`), AppKit/SwiftUI/framework mentions, notarization references, the `<reference_index>` and `<workflows_index>` blocks.
**Notes**: No unique portable content beyond the iOS skill — the two files share the same six principles and workflow structure verbatim. A single merged SOP (e.g., `prove-dont-promise-dev-workflow`) should absorb both. The macOS-only additions (document-apps, shoebox-apps, menu-bar-apps, notarize) are all platform-specific and get stripped.

## skills/expertise/iphone-apps/workflows/optimize-performance.md
**Type**: Workflow — measure-first iOS performance tuning loop (profile → identify bottlenecks → optimise → re-measure → add perf tests).
**Portable**: Yes — the measure-first philosophy, profiling command patterns, SwiftUI optimisation techniques (state isolation, LazyVStack, `_printChanges`), and numeric performance targets are all reusable across any iOS/macOS Swift project.
**Reason**: The six-step loop and target table are platform-agnostic discipline; the specific `xcrun xctrace` invocations are iOS/macOS CLI-native and need no repo-specific customisation.
**Strip**: Device literals (`iPhone 16`) — replace with a `$DEVICE` variable placeholder.
**Notes**: Performance targets (launch < 1 s, 60 fps scroll, < 100 ms response) are strong portable defaults worth preserving verbatim.

## skills/expertise/iphone-apps/workflows/write-tests.md
**Type**: Workflow — iOS Swift Testing TDD loop (unit / async / state tests → xcodebuild run → coverage → red-green-refactor cycle).
**Portable**: Yes — the Testing framework patterns (`@Test`, `#expect`), TDD cycle steps, xcodebuild invocations, and coverage targets are reusable across any Swift project.
**Reason**: Framework-idiomatic patterns and numeric coverage targets are stable; nothing ties the workflow to a specific app or team.
**Strip**: `AppName` placeholder in import and scheme flags — already parameterised conceptually, just needs a note to substitute.
**Notes**: Explicit split between "Claude tests (automated)" and "User tests (manual)" is a useful framing worth preserving; views intentionally excluded from coverage targets is a deliberate, portable policy.

## skills/expertise/macos-apps/workflows/build-new-app.md
**Type**: Workflow — full macOS app scaffolding loop (clarify → choose archetype → XcodeGen scaffold → TDD → build/verify → polish).
**Portable**: Yes — the archetype selection table, XcodeGen scaffolding pattern, TDD mandate, anti-patterns list, and success criteria checklist are reusable across any new macOS Swift project.
**Reason**: The workflow is structured as a decision tree with archetype branches, making it generalisable; no content is specific to a single app or team.
**Strip**: References to internal `references/*.md` files (project-scaffolding, cli-workflow, app-architecture, etc.) — these are local to the taches repo and must be replaced with portable equivalents or noted as "read your project's equivalent reference."
**Notes**: The anti-patterns list (massive view models, fighting SwiftUI, blocking main thread, hard-coded paths, retain cycles) is one of the strongest portable artefacts in the file — high signal, low noise.

## skills/expertise/macos-apps/workflows/add-feature.md
**Type**: Workflow — add-feature loop for existing macOS apps (understand → read refs → audit codebase → plan → TDD → integrate → build/test → polish).
**Portable**: Yes — the eight-step process, feature-type reference routing table, integration code patterns (`@Observable`, `@Environment`, `NavigationLink`, `Commands`/`keyboardShortcut`), and success criteria are all reusable across any macOS SwiftUI project.
**Reason**: The workflow is deliberately codebase-agnostic; it instructs the agent to discover patterns from the existing app rather than imposing them.
**Strip**: Internal `references/*.md` links (same issue as build-new-app.md) — replace with portable guidance or "consult your project's architecture docs."
**Notes**: The integration patterns block (state, view, navigation, menu command snippets) is highly portable boilerplate worth promoting directly into a reusable skill. The success-criteria checklist doubles as a useful PR gate.

## skills/expertise/iphone-apps/workflows/build-new-app.md
**Type**: Workflow/SOP — six-step process for scaffolding and building a new iOS app from scratch.
**Portable**: Partial.
**Reason**: The overall workflow shape (clarify requirements → choose archetype → scaffold → TDD → build/launch → polish) is universal for any iOS project. The app-archetype decision table, TDD loop, and `minimum_viable_app` SwiftUI template (`@Observable` + `@Environment(AppState.self)`) are strong portable patterns.
**Strip**: `<required_reading>` block lists taches-internal reference paths; `xcsift` in the build command is a taches-local tool alias (replace with raw `xcpretty` or drop the pipe).
**Notes**: The `<success_criteria>` block (HIG compliance, CLI-buildable, tests pass, launches in simulator) is a reusable acceptance checklist worth keeping verbatim.

## skills/expertise/iphone-apps/workflows/add-feature.md
**Type**: Workflow/SOP — seven-step process for adding a feature to an existing iOS app.
**Portable**: Yes.
**Reason**: The core loop (understand feature → read relevant references → read existing code → TDD → integrate → build/test → polish) applies to any iOS codebase. The `<integration_patterns>` section contains clean, reusable SwiftUI snippets for adding state, views, navigation destinations, and tabs.
**Strip**: `<required_reading>` block and the feature-type-to-reference mapping table both point to taches-internal paths; replace or generalise those links when porting.
**Notes**: The integration patterns block is the highest-value artifact — the four named patterns (adding state, view, navigation, tab) cover the dominant extension points in a SwiftUI app and should be preserved as-is.

## skills/expertise/iphone-apps/workflows/ship-app.md
**Type**: Workflow/SOP — seven-step App Store release pipeline (archive → export → upload → TestFlight → submit → post-release).
**Portable**: Yes.
**Reason**: The App Store Connect submission process is standardised across all iOS projects. The `xcodebuild archive/exportArchive` commands, `ExportOptions.plist`, and `altool` upload invocation are identical for any app.
**Strip**: `<required_reading>` refs (`references/app-store.md`, `references/ci-cd.md`) are taches-internal.
**Notes**: Two artifacts are particularly high-value: (1) the `<privacy_manifest>` block — a ready-to-use `PrivacyInfo.xcprivacy` template required since iOS 17; (2) the `<common_rejections>` table — a concise lookup of the five most frequent App Review failure modes and their fixes. Both should be ported verbatim.

## skills/expertise/iphone-apps/workflows/debug-app.md
**Type**: Workflow/SOP — eight-step debugging process with symptom-driven tool selection.
**Portable**: Yes.
**Reason**: The debugging philosophy ("use whatever gets you to root cause fastest"), the symptom-to-tool dispatch table (leaks/spindump/crash report/xctrace/console), and the `<common_patterns>` section (memory leaks, UI freezes, crashes, silent failures) are universal iOS debugging knowledge independent of any specific app.
**Strip**: `<required_reading>` refs are taches-internal; `xcsift` in the Step 2 build command is a taches-local alias.
**Notes**: The `<ios_specific_tools>` block (simctl log stream with predicate, screenshot, video recording) is a high-value portable quick-reference. The symptom-to-tool table is the strongest single artifact in this file and should be kept intact.

## skills/expertise/macos-apps/workflows/ship-app.md
**Type**: Workflow — release/distribution SOP (archive → export → notarize → staple → verify, with distribution-method decision table and pre-ship checklist)
**Portable**: Yes — xcodebuild archive/export commands, notarytool/stapler invocations, codesign/spctl verification, and the pre-ship checklist are all generic macOS release steps reusable across any app
**Reason**: The step-by-step release pipeline with concrete commands at each gate is a high-value portable SOP; the `<checklist>` block (version bump, entitlements, privacy strings, clean-install test) and the `<common_issues>` table (notarization failures, Gatekeeper blocks, App Store rejections) are strong reference material
**Strip**: `<required_reading>` block (references taches-internal files); `xcrun altool --validate-app / --upload-app` invocations (altool is deprecated — replace with App Store Connect API or Transporter); ExportOptions.plist XML boilerplate (contextual scaffolding, not SOP)
**Notes**: The distribution-method decision table (Direct / App Store / TestFlight with requirements) is a clean portable decision matrix worth preserving as a standalone reference

## skills/expertise/macos-apps/workflows/debug-app.md
**Type**: Workflow — structured debugging methodology with symptom→tool matrix and root-cause patterns
**Portable**: Yes — the `<philosophy>` section, the symptom→tool table (leaks, spindump, crash reports, xctrace, thread sanitizer), `<common_patterns>` (retain cycles, main-thread blocking, force-unwrap crashes, silent failures), and `<tools_quick_reference>` are fully portable
**Reason**: The "fix root cause, not symptom" principle with concrete bad/good examples is high-signal and reusable; the symptom→tool matching table is a strong SOP artifact that eliminates guesswork; the common_patterns section maps symptoms to causes to fixes in a scannable format
**Strip**: `<required_reading>` block; `cliclick` mention (niche third-party tool, not universal); the iterative "choose your approach" branching (Steps 2–3) is useful context but too prose-heavy for a distilled SOP
**Notes**: The `<tools_quick_reference>` bash block is an excellent standalone cheat-sheet; the bad/good fix examples in Step 7 are among the clearest "anti-pattern vs correct" illustrations in the taches corpus

## skills/expertise/macos-apps/workflows/optimize-performance.md
**Type**: Workflow — performance profiling and optimization with measure-first discipline and concrete target numbers
**Portable**: Yes — the measure→identify→fix→measure cycle, `xcrun xctrace` profiling commands, SwiftUI re-render debugging, main-thread offload pattern, and the `<performance_targets>` table are fully portable
**Reason**: The `<performance_targets>` table (< 1s launch, < 100ms button response, 60fps scrolling, < 100MB idle memory) provides concrete pass/fail thresholds rarely spelled out this clearly; the optimization code examples (lazy loading, image caching, O(n²)→O(1) lookup) are clean and directly actionable
**Strip**: `<required_reading>` block; `Self._printChanges()` SwiftUI debug trick (implementation detail subject to API change, better as a footnote than SOP step); "Measure Again / Prevent Regression" steps (correct but generic — covered by tdd workflow)
**Notes**: The `<performance_targets>` table is the highest-value portable artifact in this file; consider extracting it as a standalone reference table in the consolidated SOP

## skills/expertise/macos-apps/workflows/write-tests.md
**Type**: Workflow — test authoring using Swift Testing framework with TDD cycle, coverage targets, and what-not-to-test guidance
**Portable**: Yes — the philosophy ("tests are documentation that runs"), the Claude-tests-vs-user-tests division, Swift Testing `@Test`/`#expect` patterns, AAA structure, mock protocol pattern, TDD red-green-refactor cycle, `<coverage_targets>` table, and `<what_not_to_test>` list are all portable
**Reason**: The explicit split between automated (logic, state, services, edge cases) and manual (UX feel, real hardware, performance) testing is a strong SOP boundary that prevents misaligned effort; the `<coverage_targets>` table (80-100% business logic, 0% views) gives teams a defensible tiered target; `<what_not_to_test>` eliminates a common time sink
**Strip**: `<required_reading>` block; XcodeGen YAML snippet for test target setup (tooling-specific scaffolding, not SOP); `xcrun xcresulttool` / `xccov` coverage commands (useful but secondary to the testing methodology itself)
**Notes**: Uses Swift Testing (not XCTest) — the modern Swift 6 framework; the async test patterns (`await #expect(throws:)`) are forward-looking and worth preserving; the `<what_not_to_test>` list is a rare and high-value negative-space SOP element

---

## skills/expertise/iphone-apps/references/app-architecture.md
**Type**: Reference / code-pattern library
**Portable**: partial
**Reason**: Core patterns (DI via protocols, coordinator, error types, view-model separation, AAA test structure) are fully portable; the mechanism layer (`@Observable`, `@Environment`, `@Query`, SwiftUI `.environment()`) is iOS-only and must be stripped or noted as "SwiftUI implementation example."
**Strip**: All `@Observable`, `@Bindable`, `@Environment`, `@Query`, SwiftUI `View` conformances, `.environment()` call-sites, and Xcode-Preview blocks.
**Notes**: The DI container pattern, protocol-mock approach, coordinator state-machine shape, and structured `AppError` enum are strong portable SOPs worth extracting verbatim (minus Swift syntax).

---

## skills/expertise/iphone-apps/references/testing.md
**Type**: Reference / testing-patterns library
**Portable**: partial
**Reason**: Testing principles (AAA, parameterised tests, protocol mocks, factory helpers, one-assertion-per-test, `URLProtocol` stub approach) are fully portable; the *toolchain* (Swift Testing `@Test`/`#expect`, XCTest, ViewInspector, swift-snapshot-testing, `xcodebuild`) is iOS-only.
**Strip**: Swift Testing macros (`@Suite`, `@Test`, `#expect`), XCTest class boilerplate, `xcodebuild` CLI invocations, ViewInspector imports, SwiftData in-memory container setup, `MockURLProtocol` (keep the *pattern*, strip Swift-specific boilerplate).
**Notes**: The naming convention (`sut_action_expectedOutcome`), mock-call-count tracking, async `waitForCondition` helper, and `--uitesting` launch-argument gate are all portable testing SOPs worth lifting.

---

## skills/expertise/iphone-apps/references/performance.md
**Type**: Reference / performance-patterns library
**Portable**: partial
**Reason**: Performance principles (defer non-critical init work, avoid sync I/O at startup, batch network requests, weak captures to prevent retain cycles, task cancellation, stream processing over bulk loads, signpost instrumentation) are broadly portable; the profiling toolchain (`xcrun xctrace`, Instruments templates, MetricKit, `OSSignposter`) and SwiftUI-specific rendering optimisations (`Equatable` view, `.equatable()`, `.task(id:)`) are iOS-only.
**Strip**: All `xcrun`/`xctrace` CLI flags, Instruments template names, `MetricKit` API, `OSSignposter`, SwiftUI modifiers (`.task`, `.onChange`, `LazyVStack`), CoreLocation/`BGTaskScheduler` API calls, `URLSessionConfiguration.background` specifics.
**Notes**: The performance checklist (launch < 400 ms, no sync I/O in init, 60 fps scrolling, discretionary transfers) and the "defer non-critical setup to `.task {}`" pattern are clean portable SOPs. The image-cache `actor` pattern and prefetch-on-appear idiom are also worth adapting.

---

## skills/expertise/iphone-apps/references/security.md
**Type**: Reference / security-patterns library
**Portable**: no
**Reason**: Overwhelmingly iOS/Apple-platform-specific — Keychain Security framework (`SecItemAdd`, `kSecAttr*`), `LocalAuthentication`, `SecAccessControl`, `PrivacyInfo.xcprivacy`, ATT, `fork()` jailbreak detection, and ATS Info.plist are all Apple-only APIs with no cross-platform equivalents at the code level.
**Strip**: Entire file is implementation code; no raw API can be ported. Principles (store secrets in OS credential store, not in UserDefaults/logs; use biometric-protected storage; pin certificates; validate + sanitise inputs; parameterise queries; scrub memory after sensitive use; privacy manifest discipline) are extractable as platform-agnostic policy statements only.
**Notes**: Security checklist at the bottom is highly portable as a policy checklist skeleton (data storage, network, auth, code, privacy categories). Extract that as a standalone SOP checklist; discard all Swift code.

## skills/expertise/iphone-apps/references/navigation-patterns.md
**Type**: Reference / code patterns
**Portable**: Yes — SwiftUI NavigationStack, TabView, deep-link, and modal patterns are idiomatic across iOS projects
**Reason**: Covers the full navigation surface (value-based stack, programmatic push/pop, tab-per-navigator, URL-scheme + Universal Links deep linking, sheet/fullScreenCover with detents, path serialisation, NavigationCoordinator class, searchable modifier) with working code for each pattern
**Strip**: Nothing — all patterns are reusable; `baseURL` placeholder (`api.example.com`) and team-ID are obviously project-specific and self-labelled
**Notes**: NavigationCoordinator pattern (centralised `@Observable` class owning all paths) is the highest-value portable SOP; tab re-tap pop-to-root and Codable path persistence are clean, ready-to-copy snippets

## skills/expertise/iphone-apps/references/networking.md
**Type**: Reference / code patterns
**Portable**: Yes — URLSession-based networking layer with no third-party dependencies; patterns apply to any iOS project
**Reason**: Provides a complete, layered networking toolkit: typed `Endpoint` enum, generic `actor NetworkService`, bearer-token auto-refresh, OAuth 2.0 via `ASWebAuthenticationSession`, URLCache config, custom in-memory `DataCache` actor, `NWPathMonitor` offline watcher, offline-first stale-while-revalidate pattern, pending-ops retry queue, multipart upload, and download-with-progress delegate
**Strip**: `baseURL` (`api.example.com`) and OAuth `client_id` are project-specific placeholders; `TokenProvider` protocol is intentionally left as a stub
**Notes**: The `actor`-based concurrency throughout (NetworkService, DataCache, OfflineFirstService, PendingOperationsQueue) is the strongest portable idiom; offline-first stale-while-revalidate and pending-ops queue are the most SOP-worthy patterns

## skills/expertise/iphone-apps/references/polish-and-ux.md
**Type**: Reference / code patterns
**Portable**: Yes — UIKit haptics wrapped in a SwiftUI-friendly static `HapticEngine`, all animations/gestures are pure SwiftUI
**Reason**: Covers premium UX layer end-to-end: `HapticEngine` static wrapper with semantic convenience methods (success/warning/error/selection), spring animation constants and timing guidelines (0.1–0.2 s quick, 0.3 s standard, 0.5 s prominent), asymmetric transitions, keyframe shake, drag-to-dismiss card, skeleton shimmer loader, circular progress, pressable button micro-interaction, success checkmark, parallax header, `scrollTransition` fade, empty-state component, and `accessibilityReduceMotion` guard
**Strip**: Nothing — all components are self-contained and project-agnostic
**Notes**: `HapticEngine` + `accessibilityReduceMotion` guard are the two strongest portable SOPs; the timing constants table is worth extracting verbatim into the skill

## skills/expertise/iphone-apps/references/project-scaffolding.md
**Type**: Reference / setup guide + code patterns
**Portable**: Yes — XcodeGen-based scaffolding workflow and starter-code templates apply to any new iOS project
**Reason**: Provides a complete CLI-first project creation workflow: `project.yml` template (targets, configs, schemes, coverage), SwiftData / SPM package extension variants, canonical directory layout, four starter Swift files (`MyApp.swift`, `AppState.swift`, `ContentView.swift`, error enum), `PrivacyInfo.xcprivacy` manifest, entitlements template, xcconfig environment-variable pattern, asset-catalog conventions, and Xcode 15+ String Catalog localisation
**Strip**: `DEVELOPMENT_TEAM: YOURTEAMID`, bundle-ID prefix `com.yourcompany`, and API URL xcconfig values are intentional per-project placeholders; Alamofire/KeychainAccess SPM example is illustrative, not prescriptive
**Notes**: The `AppState` `@Observable` class design (navigation paths + tab + loading + error + feature flags + `initialize()` + `handleDeepLink()`) is the strongest portable architectural SOP; `PrivacyInfo.xcprivacy` snippet is required for App Store submission and should be promoted verbatim

## skills/expertise/iphone-apps/references/accessibility.md
**Type**: Technical reference — VoiceOver, Dynamic Type, contrast, motion, focus, and color accessibility patterns for SwiftUI iOS apps.
**Portable**: Yes — the core patterns (`.accessibilityLabel`, `.accessibilityAction`, `@ScaledMetric`, `@Environment(\.accessibilityReduceMotion)`, contrast-aware views, focus management) are applicable to any SwiftUI iOS project.
**Reason**: Covers the full accessibility surface area with concrete, copy-paste-ready code. The audit checklist at the end (VoiceOver, Dynamic Type, Color/Contrast, Motion, General) is a high-signal portable SOP for any iOS release gate.
**Strip**: Xcode Accessibility Inspector step-by-step walkthrough (tool UI, not code); Preview environment snippet for testing (useful but boilerplate); the VoiceOver Practice and Voice Control manual testing prose (process, not spec).
**Notes**: `AccessibilityNotification.Announcement` / `ScreenChanged` / `LayoutChanged` pattern is often missed — worth preserving explicitly. 44pt minimum touch target and 4.5:1 contrast ratio are numeric thresholds that belong in a portable checklist rule.

## skills/expertise/iphone-apps/references/app-icons.md
**Type**: Operational reference — CLI icon generation scripts, `Contents.json` schemas, iOS 18 dark/tinted variant config, alternate icon implementation.
**Portable**: Yes — `sips` and ImageMagick scripts work for any macOS-based iOS project; `Contents.json` single-size pattern (Xcode 14+) is the canonical modern approach; iOS 18 appearance variant JSON is directly reusable.
**Reason**: Self-contained, runnable scripts and exact JSON configs. The single 1024×1024 → Xcode auto-generates pattern eliminates an entire class of asset-catalog errors and is strongly worth promoting as the default SOP.
**Strip**: Complete `Contents.json` with all sizes (superseded by single-size mode for Xcode 14+); Required Sizes table (reference only, not actionable); Design Guidelines prose ("No SF Symbols", "No Apple hardware") — belongs in a design checklist, not a generation SOP.
**Notes**: iOS 18 tinted icon spec (grayscale, gradient background `#313131`→`#141414`) is novel and specific enough to call out explicitly. The `sips -g hasAlpha` / alpha-removal troubleshooting commands are worth keeping as part of a submission preflight script.

## skills/expertise/iphone-apps/references/app-store.md
**Type**: Process checklist + reference — submission preflight, screenshot specs, privacy policy template, review guidelines, export compliance, App Privacy Labels, phased release schedule.
**Portable**: Yes — the preflight checklist, privacy policy template structure, demo account and review notes format, phased release percentages, and `xcodebuild archive/export/upload` CLI commands are reusable across any iOS app submission.
**Reason**: End-to-end submission workflow covering every required artifact. The "Common Rejections" list is a high-signal portable gate; the phased release percentage schedule (1→2→5→10→20→50→100 % over 7 days) is definitive and should live in a standing rule.
**Strip**: fastlane `capture_screenshots` / Snapfile / XCUITest snapshot code (fastlane-specific tooling, not universally applicable); In-App Purchase configuration walkthrough (specialized, not part of core submission SOP); full privacy policy template body text (too specific; keep the section headings only).
**Notes**: `PrivacyInfo.xcprivacy` (Privacy Manifest) requirement is a hard App Store gate since 2024 — must be called out explicitly. Export compliance quick-check rule ("HTTPS only + Apple encryption APIs = exempt") is concise and saves significant friction for typical apps.

## skills/expertise/iphone-apps/references/background-tasks.md
**Type**: Technical reference — `BGTaskScheduler` setup and registration, app refresh vs processing task patterns, background `URLSession`, silent push, location, audio, testing, and best practices.
**Portable**: Yes — `BGTaskScheduler` registration pattern, expiration handler requirement, battery efficiency checks (`isLowPowerModeEnabled`, `backgroundRefreshStatus`, `isDiscretionary`), and progress persistence via `UserDefaults` are applicable to any iOS app using background processing.
**Reason**: Complete, correct background task lifecycle including the critical expiration handler (commonly omitted) and progress persistence pattern. The Best Practices section consolidates into a portable SOP for background work that avoids battery drain and App Store rejection for background abuse.
**Strip**: Background Audio section (specialized, not a general SOP concern); Location Updates continuous-updates variant (high battery, edge-case usage); `e -l objc` LLDB simulator command (esoteric debug tool, not portable workflow); `log stream` console command (useful but dev-environment specific).
**Notes**: The "Respect User Settings" block — checking `isLowPowerModeEnabled` and `backgroundRefreshStatus` before scheduling — is an often-skipped step that belongs as a mandatory rule in any background task SOP. Always call `setTaskCompleted` even on cancellation; the expiration handler pattern must be non-optional.

## skills/expertise/iphone-apps/references/ci-cd.md
**Type**: Reference guide — Xcode Cloud, fastlane, GitHub Actions CI/CD pipelines for iOS.
**Portable**: Partially. fastlane lane patterns (beta, release, screenshots), GitHub Actions iOS workflow, `match` code-signing, and version-bumping scripts are platform-agnostic SOPs. Xcode Cloud is Apple-proprietary UI config only.
**Reason**: The fastlane `Fastfile` beta/release/sync_signing lanes encode a repeatable deploy SOP. The GitHub Actions workflow (cache SPM → build → test → upload → deploy-on-main) is a strong portable template. The secrets-management section (never commit, use env vars, rotate, use match) is universally applicable policy.
**Strip**: Xcode Cloud UI walk-through (proprietary, no CLI equivalent), full `altool` invocation (deprecated in favour of `notarytool`), verbose Fastfile boilerplate beyond lane skeletons, build-caching YAML details (implementation noise).
**Notes**: `fastlane match` for certificate management is the single highest-value SOP item — centralised cert store, `readonly: true` in CI, separate dev/appstore types. The conditional-deploy pattern (`on: push: tags: 'v*'`) and parallel-testing (`concurrent_workers: 4`) are worth preserving as policy bullets.

## skills/expertise/iphone-apps/references/cli-observability.md
**Type**: Reference guide — full CLI-based debugging and observability stack for iOS (no Xcode GUI required).
**Portable**: Highly portable. The xcsift/xcbeautify build-error pipeline, `simctl log stream` predicate pattern, `atos` crash symbolication, LLDB command set, `xctrace` profiling, mitmproxy network inspection, and `xcresulttool` test-result parsing are all stable CLI SOPs.
**Reason**: The "Standard Debug Workflow" section (build → stream logs → install → crash check → leaks → lldb) is a complete, sequenced SOP ready for extraction. The `Logger` extension pattern (subsystem + category per domain) is a portable in-app logging convention. The CLI-vs-Xcode capability table gives clear guidance on what tooling is appropriate for each task.
**Strip**: One-time brew install prerequisites block, device debugging section (iOS 17+ / `devicectl` only, too narrow), SwiftUI `_printChanges()` note (debug utility, not SOP-level).
**Notes**: The `os.Logger` subsystem/category pattern and the `--predicate` filter syntax (`subsystem == "…" AND category == "…"`) are the most reusable conventions. ASAN/TSAN mutual-exclusion note is important policy. mitmproxy proxy-enable/disable shell commands should be packaged as a toggle SOP snippet.

## skills/expertise/iphone-apps/references/cli-workflow.md
**Type**: Reference guide — end-to-end iOS development workflow from the terminal (create → build → run → test → archive → deploy).
**Portable**: Highly portable. `xcodebuild` build/test/archive/export commands, `simctl` simulator lifecycle, `ios-deploy` device deployment, and the archive → ExportOptions.plist → IPA export pipeline are stable, repeatable SOPs.
**Reason**: The linear build→test→archive→export→upload pipeline is the canonical iOS release SOP. The simulator management commands (boot, install, launch, erase, screenshot, recordVideo) cover the full dev-loop. The troubleshooting section (clear DerivedData, reset package caches, `xcrun simctl shutdown all && erase all`) encodes battle-tested remediation steps worth preserving as a quick-reference block.
**Strip**: XcodeGen `project.yml` template (project-scaffold detail, not SOP), wireless debugging USB-pairing walkthrough (hardware-specific, one-time setup), full `ExportOptions.plist` XML (boilerplate, include just the key fields), `.zshrc` alias block (user config, not policy).
**Notes**: The `xcodebuild -resolvePackageDependencies` step before a clean build is a non-obvious but important SOP bullet. The `CODE_SIGNING_REQUIRED=NO` flag for simulator CI builds prevents the most common CI signing failure. `xcrun notarytool` should be preferred over `altool` for uploads in any new SOP.

## skills/expertise/iphone-apps/references/data-persistence.md
**Type**: Reference guide — iOS data persistence patterns across all storage tiers (UserDefaults, SwiftData, Core Data, Keychain, file-based).
**Portable**: Highly portable. The tiered-persistence decision model, `@AppStorage` / `@Query` SwiftUI integration patterns, Codable UserDefaults extension, `KeychainService` wrapper, and SwiftData lightweight-migration scaffold are all reusable SOPs.
**Reason**: The implicit tier hierarchy (UserDefaults for simple prefs → SwiftData/Core Data for structured relational data → Keychain for secrets) is the key architectural SOP. The `KeychainService` with `kSecAttrAccessibleWhenUnlocked` and delete-before-save is a safe, portable wrapper pattern. The SwiftData `VersionedSchema` + `SchemaMigrationPlan` scaffold captures the migration SOP for evolving models.
**Strip**: Full `@Model` class bodies with all relationships (example detail, not SOP), Core Data `NSPersistentCloudKitContainerOptions` setup (iCloud-specific, keep only as a note), `FileManager` directory-path extension (utility code, include as a snippet reference only), verbose migration stage boilerplate beyond the `lightweight` vs custom distinction.
**Notes**: Policy bullet: never store tokens/passwords in UserDefaults — always use Keychain with `kSecAttrAccessibleWhenUnlocked`. `@AppStorage` is appropriate only for non-sensitive UI preferences. SwiftData's `cloudKitDatabase: .automatic` config requires an explicit iCloud capability entitlement — worth flagging as a checklist item. `isStoredInMemoryOnly: true` in `ModelConfiguration` is the canonical pattern for preview/test containers.

## skills/expertise/macos-apps/references/app-architecture.md
**Type**: Reference — SwiftUI/Swift architecture patterns (state management, DI, lifecycle, navigation, error handling, async)
**Portable**: Yes
**Reason**: Patterns are framework-level best practices (Observable, environment injection, coordinator, AppDelegate adapter, structured async) that apply to any SwiftUI macOS/iOS app; no project-specific logic.
**Strip**: Code examples (keep as illustrative only — actual implementations vary); `ServiceContainer.mock()` convenience is project-specific taste.
**Notes**: Strong opinionated guidance on `@Observable` (macOS 14+ only — skill should surface that constraint); the "avoid massive centralised state" and "cancel tasks on disappear" rules are high-signal SOPs worth promoting. Split-state-by-domain pattern (`UIState` / `DataState` / `NetworkState`) is a portable structural decision.

## skills/expertise/macos-apps/references/app-extensions.md
**Type**: Reference — macOS app extension patterns (Share Extension, WidgetKit, Quick Look, Shortcuts/AppIntents, Action Extension)
**Portable**: Yes — extension architecture patterns are reusable across any macOS app that needs those capabilities
**Reason**: Covers stable platform APIs (NSExtension, WidgetKit timeline, AppIntents, QLThumbnailProvider); the App Groups / shared container pattern is universally required for host↔extension data sharing.
**Strip**: Boilerplate Xcode target setup steps (File > New > Target — implied knowledge); the specific bundle ID `group.com.yourcompany.myapp` literals; `SLComposeServiceViewController` usage (deprecated path, prefer custom UI).
**Notes**: `extension_best_practices` list is concise and promotable as-is. Widget deep-link + `WidgetCenter.reloadTimelines` pattern is a recurring pain point — worth a dedicated SOP entry. `AppShortcuts` phrases block is a good pattern template.

## skills/expertise/macos-apps/references/appkit-integration.md
**Type**: Reference — AppKit / SwiftUI interop patterns (NSViewRepresentable, NSHostingView, drag-and-drop, custom windows, popovers)
**Portable**: Yes
**Reason**: Covers the stable boundary between SwiftUI's declarative layer and AppKit's imperative layer; the "policy wins — check SwiftUI first" debugging mindset is universally applicable.
**Strip**: Full `NSTextView` / `RichTextEditor` implementation (project-specific); `CustomWindow` subclass (too prescriptive); `PopoverButton` NSViewRepresentable wrapper (SwiftUI `.popover` usually suffices).
**Notes**: The anti-pattern callout ("AppKit as a workaround — SwiftUI's declarative layer overrides your AppKit code") is the most portable and highest-value insight here — SOP-worthy as a decision rule. `WindowAccessor` pattern (reading `NSWindow` from SwiftUI) is a recurring need. Coordinator delegate cleanup warning (weak references) is a subtle but important bug vector.

## skills/expertise/macos-apps/references/concurrency-patterns.md
**Type**: Reference — Swift structured concurrency patterns (async/await, actors, MainActor, task groups, AsyncStream, Sendable)
**Portable**: Yes — language-level patterns, not framework- or project-specific
**Reason**: Covers the full modern Swift concurrency surface: `.task` lifecycle, actor isolation, `@MainActor` annotation, `withThrowingTaskGroup`, `async let`, `AsyncStream` bridging, cancellation, and Sendable conformance.
**Strip**: `CountdownSequence` custom AsyncSequence example (toy example, not a real pattern); `@unchecked Sendable` with `NSLock` (advanced escape hatch, not a default recommendation).
**Notes**: The best-practices block is clean and promotable directly. `withTaskCancellationHandler` + `withCheckedThrowingContinuation` combo for bridging legacy callback APIs is a high-value SOP candidate. The `ViewModel.loadTask?.cancel()` + `deinit` cancel pattern addresses a very common memory/task leak. Prefer marking this whole file as a "concurrency SOP" source — most rules here are unconditional.

## skills/expertise/iphone-apps/references/push-notifications.md
**Type**: Reference – APNs permission flow, device-token handling, rich/silent push, local notifications, badge management, action categories.
**Portable**: Partially. The permission-request timing rule ("don't ask on launch; ask after value is demonstrated"), graceful denial handling (deep-link to Settings), notification grouping via `thread-id`, and the silent-push / background-sync pattern are transferable iOS best practices. The specific API calls are Apple-only.
**Reason**: Core push-notification lifecycle knowledge every iOS app needs; the "ask at the right time" guidance prevents a common UX anti-pattern.
**Strip**: APNs server-side curl/JWT snippet (infrastructure concern, not client skill), full XML plist blocks (copy-paste config, not guidance), `NotificationViewController` IBOutlet boilerplate (Storyboard detail unlikely to survive a SwiftUI-only skill).
**Notes**: Keep the `UNUserNotificationCenterDelegate` pattern, the `UNNotificationCategory` / action registration example, and the `time-sensitive` interruption-level note (iOS 15+ feature worth flagging). The `serviceExtensionTimeWillExpire` safety-valve is a subtle correctness detail worth preserving.

## skills/expertise/iphone-apps/references/storekit.md
**Type**: Reference – StoreKit 2 product loading, purchase flow, subscription status, consumables, promotional offers, testing.
**Portable**: Partially. The paywall UI structure (header → features → products → terms), the "always finish transactions promptly" rule, grace-period access logic, and the pattern of listening for transaction updates in a long-lived `Task` are solid iOS best practices. StoreKit itself is Apple-only.
**Reason**: IAP is a make-or-break revenue path; the `@Observable PurchaseService` pattern, `Transaction.currentEntitlements` loop, and grace-period handling are nuanced and easy to get wrong.
**Strip**: Promotional-offer signature-generation stub (server-side concern), the `#if DEBUG` simulation helpers (testing scaffolding, not production guidance), `subscriptionPeriod.debugDescription` usage (uses a debug property in production UI — this is actually a bug to flag, not preserve), the App Store Server Notifications section (server infra, not client skill).
**Notes**: Flag the `subscriptionPeriod.debugDescription` usage as a bug — production UIs should use `localizedDescription` or format the period manually. The `StoreKit Configuration File` testing workflow note is worth a brief mention as a setup tip.

## skills/expertise/iphone-apps/references/swiftui-patterns.md
**Type**: Reference – SwiftUI view composition, async loading, lists/grids, forms, sheets, iOS 26 features, custom modifiers, previews.
**Portable**: Yes (with iOS-version scoping). View decomposition into small focused views, the `.task` / `.task(id:)` async-loading pattern, `@ViewBuilder` conditional modifier, and form-validation via a computed `isValid` property are universally applicable SwiftUI idioms. iOS 26-specific APIs need availability guards.
**Reason**: Covers the bread-and-butter patterns used in nearly every screen; the `task(id:)` pattern and `@ViewBuilder if` extension are particularly high-value and under-documented.
**Strip**: iOS 26 `@Animatable` macro section (pre-release / niche), the `WebView` fallback `UIViewRepresentable` wrapper (utility code, not a pattern), the Liquid Glass `.glassEffect()` example (cosmetic, iOS 26-only), the full preview technique section (dev ergonomics, not runtime behaviour).
**Notes**: The `axis: .vertical` multiline `TextField` with `lineLimit` is an iOS 16+ pattern worth flagging. The `LazyVGrid` with `.adaptive` columns is a reusable layout primitive worth keeping. Confirm iOS 26 `WebView` native availability before including in any skill — API may still be in beta.

## skills/expertise/macos-apps/references/document-apps.md
**Type**: macOS/Swift reference — SwiftUI `DocumentGroup` / AppKit `NSDocument` patterns for file-based apps.
**Portable**: Low-medium. The *architectural decision* (document-based vs shoebox) and the *lifecycle concepts* (autosave, versions, undo registration, package bundles) are portable SOP material. The Swift code is Apple-only.
**Reason**: UTType, FileDocument, ReferenceFileDocument, and NSDocument are macOS/iOS-exclusive APIs; no direct cross-platform equivalents. Architectural guidance transfers but implementation does not.
**Strip**: All Swift code blocks; the `<info_plist_document_types>` XML; the `<export_import>` ImageRenderer snippet. Retain the `<when_to_use>` decision tree and the conceptual notes on undo registration and package-document structure.
**Notes**: The `<when_to_use>` block is the strongest portable extract — a clear binary rule (file-sharing / multi-doc → document-based; internal-DB / no user files → shoebox). Undo registration pattern (record old state → register inverse → set action name) is a transferable SOP regardless of platform.

## skills/expertise/macos-apps/references/macos-polish.md
**Type**: macOS/Swift reference — native-feel details: keyboard shortcuts, menus, window management, accessibility, UserDefaults, error alerts, onboarding, Sparkle updates, app lifecycle.
**Portable**: Medium. The *UX principles* (reduced-motion respect, VoiceOver labels + hints, error-alert pattern, onboarding feature-row layout, register-defaults-at-launch) are broadly portable. The `NSWorkspace` / `NSWindow` / AppKit code is macOS-only.
**Reason**: VoiceOver and reduced-motion are macOS/iOS-specific APIs but the *accessibility SOP* (label every interactive element, provide hints, combine children, check `prefersReducedMotion` before animating) applies to any GUI platform.
**Strip**: All Swift/SwiftUI/AppKit code. The `<sparkle_updates>` block (third-party library, macOS-only). The `<window_state>` NSWindow frame persistence code.
**Notes**: Three portable SOPs worth extracting — (1) always register UserDefaults at launch before any read; (2) wrap all animations behind a `prefersReducedMotion` guard; (3) error presentation pattern: single `.alert` modifier at the root, bound to an optional error, clears on dismiss.

## skills/expertise/macos-apps/references/menu-bar-apps.md
**Type**: macOS/Swift reference — `MenuBarExtra`, `NSStatusBar`, `LSUIElement`, global hotkeys via Carbon, popover positioning.
**Portable**: Very low. Menu-bar apps are a macOS-exclusive paradigm. Carbon hotkey registration (`InstallEventHandler`, `RegisterEventHotKey`) is macOS/legacy-only.
**Reason**: The entire pattern — status items, `MenuBarExtraStyle`, `LSUIElement` Info.plist key — has no meaningful cross-platform equivalent. The `<best_practices>` list is the only transferable content.
**Strip**: All code. The `<global_shortcuts>` Carbon block entirely — it is deprecated-era API. The `<popover_from_menu_bar>` `NSPopover` positioning code.
**Notes**: The `<best_practices>` bullet list yields one portable rule: *always provide an explicit Quit affordance in any persistent background utility*, and *show live status in the icon/badge rather than requiring the user to open the panel*. Everything else is macOS-specific implementation detail; do not promote to a cross-platform SOP.

## skills/expertise/macos-apps/references/networking.md
**Type**: Swift/macOS networking reference — URLSession async/await, endpoint builder, Bearer + OAuth token refresh, URL cache, custom in-memory cache, offline fallback via NWPathMonitor, multipart upload, download with progress, retry with exponential backoff, MockURLProtocol test helper.
**Portable**: High. HTTP client patterns (endpoint value type, actor-isolated service, cache-then-network, offline fallback, OAuth refresh with in-flight deduplication, exponential backoff retry, multipart body construction, mock protocol for tests) are language-agnostic SOPs.
**Reason**: The *concepts* translate directly to any HTTP stack (Fetch API, Axios, Python httpx, Go net/http). The Swift `actor` keyword and `URLSession` are platform-specific but the patterns are not.
**Strip**: Swift-specific syntax (`actor`, `@Observable`, `AsyncThrowingStream`). The `NWPathMonitor` import detail. The `MockURLProtocol` class skeleton (keep the *pattern description*, not the AppKit subclass boilerplate).
**Notes**: Four strong portable SOP candidates — (1) OAuth refresh: deduplicate in-flight refresh with a boolean guard, save tokens to secure storage on success; (2) retry with exponential backoff: `delay = 2^(attempt-1)`, retry only on 5xx and connectivity errors, max 3 attempts; (3) custom cache: TTL-keyed in-memory store, `forceRefresh` escape hatch, invalidate on mutation; (4) offline fallback: attempt network → on failure serve cache → throw only if cache also empty.

---

## skills/expertise/macos-apps/references/cli-observability.md
**Type**: Reference — CLI tooling catalogue for macOS app observability (build errors, runtime logs, crash symbolication, memory debugging, network inspection, test results, sanitizers).
**Portable**: Partially — the *workflow pattern* (structured logging → crash analysis → memory profiling → network inspection loop) is portable; the specific tools (xcsift, log stream, atos, xctrace, mitmproxy, xcresulttool) are macOS/Xcode-specific.
**Reason**: The tool commands are tightly coupled to the Darwin/Xcode toolchain and cannot transfer to other platforms. The underlying strategy — use structured subsystem-scoped logs, symbolicate crashes against debug symbols, profile memory with a tracer, proxy network traffic — is a portable observability SOP applicable to any native-app discipline.
**Strip**: All raw bash command blocks and tool-specific flags; the xcsift/xcbeautify install steps; the `_printChanges()` SwiftUI note; the capability matrix table (it documents macOS-specific gaps).
**Notes**: The `Logger` extension pattern (subsystem + category namespacing) and the standard debug workflow sequence (build → stream logs → launch → crash inspect → memory check → lldb) are worth distilling into a portable SOP. The "what CLI cannot do" table (GPU debug, view hierarchy) is macOS-specific and should be dropped.

---

## skills/expertise/macos-apps/references/cli-workflow.md
**Type**: Reference — end-to-end CLI workflow for macOS app development: project creation (XcodeGen), build/run/log/debug/test/sign/notarize cycle, helper scripts and shell aliases.
**Portable**: Partially — the *development loop shape* (scaffold → build → run → monitor → debug → test → release-sign) is portable; all specific tools and commands (xcodegen, xcodebuild, xcpretty, codesign, notarytool, `open`, `pgrep`) are macOS-specific.
**Reason**: The file is a macOS/Xcode CLI cheat-sheet. The workflow structure it encodes — deterministic project generation from a manifest, piping build output through a formatter, streaming live logs while the app runs, attaching a debugger by name, running tests with result bundles — represents a transferable SOP pattern even though every concrete command is platform-locked.
**Strip**: All raw command blocks; the project.yml template; shell aliases and build.sh helper; the `get-task-allow` entitlement XML; XcodeGen/xcpretty install steps; notarization keychain instructions.
**Notes**: Two abstractions worth preserving as SOP: (1) *project-as-manifest* — generate the project file from a declarative YAML rather than committing the IDE project; (2) *build-filter pipeline* — always pipe build output through a structured formatter and surface only errors/warnings to the agent. Both translate beyond macOS.

---

## skills/expertise/macos-apps/references/data-persistence.md
**Type**: Reference — persistence strategy selection guide and implementation patterns for macOS/Swift apps: SwiftData, Core Data, Codable file storage, Keychain, UserDefaults.
**Portable**: Low — implementation code is Swift/Apple-framework-specific; the *selection heuristic* (database vs. document vs. prefs vs. secrets) and the *relationship-management rules* are portable concepts.
**Reason**: SwiftData `@Model`, `@Query`, `ModelContainer`, Core Data `NSPersistentContainer`, Keychain Security framework calls — all are Apple-SDK-specific and non-transferable. The decision matrix (structured relational data → ORM; document data → file + Codable; preferences → key-value store; credentials → OS keychain) and the critical rule "set the inverse relationship, then insert into context" encode generic persistence SOPs applicable to any ORM or graph-model system.
**Strip**: All Swift code blocks; SwiftData/CoreData/Keychain API details; iCloud sync configuration; VersionedSchema migration code; `@AppStorage` / `UserDefaults` extension patterns.
**Notes**: Distillable SOP elements: (1) persistence-tier selection criteria (complexity × portability × sync requirements); (2) relationship-mutation rule (set the owning side, let the ORM sync the inverse — not "append to both arrays"); (3) "use in-memory stores for tests" as a test-isolation best practice. The `@Attribute(.externalStorage)` guidance (don't store large blobs in the DB) is a universally applicable DB hygiene rule.

---

## skills/expertise/macos-apps/references/design-system.md
**Type**: Reference — SwiftUI design-system tokens and component patterns for macOS apps: semantic colors, typography scale, spacing enum, corner radii, shadows, button/card/list-row/text-field styles, SF Symbols usage, animation presets, dark-mode and accessibility patterns.
**Portable**: Low — all code is SwiftUI/NSColor/SwiftUI-animation API; the *token architecture* (semantic color aliases, spacing enum, component modifiers) and *accessibility rules* are portable design-system patterns.
**Reason**: `Color(NSColor.windowBackgroundColor)`, `NSWorkspace.shared.accessibilityDisplayShouldReduceMotion`, `@ScaledMetric`, `ButtonStyle`, `ViewModifier` — these are all SwiftUI primitives with no cross-platform equivalent. The underlying design-system SOP (define semantic tokens over raw values, enforce contrast ≥ 4.5:1, respect reduce-motion preferences, provide light/dark asset variants) applies to any UI framework.
**Strip**: All Swift/SwiftUI code; SF Symbols image names; asset catalog JSON; `Animation` extension specifics; `@Environment(\.colorScheme)` patterns.
**Notes**: Three portable SOP elements: (1) *semantic token layer* — never reference raw hex/size values in components, always go through named tokens (color, spacing, radius, shadow tiers); (2) *reduce-motion gate* — check OS accessibility preference before applying animations; (3) *contrast rule* — foreground/background pairs must meet WCAG AA (4.5:1) minimum. The spacing enum naming (`xxxs` through `xxxl`) is a reusable token-naming convention worth extracting.

## commands/consider/first-principles.md
**Type**: Slash command (structured thinking prompt)
**Portable**: Yes
**Reason**: Pure reasoning scaffold — no taches-specific tooling, UI, or state dependencies. Works identically in any agent context.
**Strip**: XML tags (`<objective>`, `<process>`, `<output_format>`, `<success_criteria>`) — convert to plain Markdown sections; `$ARGUMENTS` placeholder — replace with a generic instruction to apply to the current context or user-supplied topic.
**Notes**: Strong portable SOP candidate. The five-step process (state → list assumptions → challenge → find base truths → rebuild) is well-structured and reusable. Output format is concrete and immediately usable as a skill template.

## commands/consider/inversion.md
**Type**: Slash command (structured thinking prompt)
**Portable**: Yes
**Reason**: Pure reasoning scaffold — inversion / via negativa pattern with no tool calls, UI bindings, or repo-specific logic.
**Strip**: XML tags; `$ARGUMENTS` placeholder.
**Notes**: Solid portable SOP. The "invert the goal → enumerate failure modes → derive anti-goals → assess residual risk" loop is a well-known mental model (Munger / Stoic). Output format cleanly separates failure modes from avoidance strategies — worth preserving as-is.

## commands/consider/second-order.md
**Type**: Slash command (structured thinking prompt)
**Portable**: Yes
**Reason**: Pure reasoning scaffold — causal-chain analysis with no external dependencies.
**Strip**: XML tags; `$ARGUMENTS` placeholder.
**Notes**: Good portable SOP. The "first-order → second-order → third-order → delayed consequences → revised assessment" chain is a standard decision-quality framework. Optional third-order step is well-handled (only pursue if significant). Pairs naturally with `inversion` and `10-10-10`.

## commands/consider/10-10-10.md
**Type**: Slash command (structured thinking prompt)
**Portable**: Yes
**Reason**: Pure reasoning scaffold — time-horizon decision analysis with no external dependencies.
**Strip**: XML tags; `$ARGUMENTS` placeholder.
**Notes**: Good portable SOP. The 10-min / 10-month / 10-year framework (Suzy Welch) is a well-known present-bias antidote. Multi-option comparison format is practical. "Time Conflicts" section is the most valuable part — surfaces exactly where short-term emotion overrides long-term interest.

## skills/expertise/macos-apps/references/system-apis.md
**Type**: Reference cheatsheet — macOS system integration APIs (FileManager, FSEvents, UNUserNotifications, SMAppService, NSWorkspace, NSPasteboard, NSAppleScript, accessibility APIs)
**Portable**: No
**Reason**: Entirely Swift/AppKit/macOS-specific code patterns. Every example is tied to Apple SDKs, sandboxing constraints, and macOS entitlement requirements; unusable outside that platform.
**Strip**: All Swift code blocks, XML plist snippets, and macOS-specific API references (FSEventStream, UNUserNotificationCenter, SMAppService, AXIsProcessTrusted, etc.)
**Notes**: Security-scoped bookmarks and clipboard-monitor patterns are occasionally cited in onboarding docs, but they belong in a macOS-specific reference, not a portable SOP.

## skills/expertise/macos-apps/references/testing-debugging.md
**Type**: Reference cheatsheet — XCTest unit/UI testing patterns and SwiftData debugging playbook
**Portable**: Partial
**Reason**: The testing philosophy (Given/When/Then, mock dependencies via protocols, async testing, memory-leak assertions) is portable. The concrete APIs (XCTestCase, XCUIApplication, ModelContainer, os.Logger, OSSignposter) are macOS/Swift-specific.
**Strip**: All Swift code blocks, SwiftData symptom/cause table, Xcode-specific breakpoint instructions, and `xcodebuild` CLI commands
**Notes**: The protocol-based dependency injection pattern for mocking (DataStoreProtocol / MockDataStore) and the memory-leak weak-reference test helper are strong portable SOPs worth extracting into a testing skill.

## skills/expertise/macos-apps/references/testing-tdd.md
**Type**: Reference cheatsheet — TDD workflow and test-organisation conventions for macOS apps
**Portable**: Partial
**Reason**: The red-green-refactor cycle, test-file-per-class directory layout, and "what not to test" guidance (skip framework internals, test business logic and service layer) are language-agnostic SOPs. The Swift/SwiftData/XCTest implementation is platform-specific.
**Strip**: All Swift code blocks, `xcodebuild` / `entr` shell commands, and SwiftData-specific setup/teardown
**Notes**: The "what not to test" list (don't test the framework, do test business logic + state + data transforms + service layer with mocks) and the minimal-UI-test principle are the strongest portable extracts. The mock-network-session protocol pattern mirrors the portable mock SOP already flagged in testing-debugging.md.

---

## commands/create-plan.md
**Type**: Slash-command (skill delegation wrapper)
**Portable**: No — workflow logic lives entirely inside the referenced `Skill(create-plans)`; the command itself is a one-liner router.
**Reason**: Body is `Invoke the create-plans skill for: $ARGUMENTS` with no embedded steps, heuristics, or criteria. The only structural content is the `allowed-tools` allowlist (`Skill(create-plans)`, `Read`, `Bash`, `Write`).
**Strip**: Strip the Claude Code slash-command envelope; the `allowed-tools` capability-scoping pattern (allowlisting a tool surface per command) is worth retaining as a design note but yields no SOP content on its own.
**Notes**: `argument-hint` is a UX affordance for the TUI — not portable. The underlying `create-plans` skill is the candidate to audit for SOP content.

---

## commands/debug.md
**Type**: Slash-command (skill delegation wrapper with structured prompt body)
**Portable**: Partially — the `<objective>` / `<process>` / `<success_criteria>` XML framing is a reusable prompt-structure pattern independent of Claude Code.
**Reason**: The command still ultimately delegates to `Skill(debug-like-expert)` and passes `$ARGUMENTS` through, but the body articulates a three-part invocation contract (what to do, how to do it, how to know it worked) that generalises to any agent dispatch pattern. The four-step process list (invoke → pass args → follow methodology → verify) is generic scaffolding rather than debugging logic.
**Strip**: The slash-command envelope and `$ARGUMENTS` forwarding. Retain the objective/process/success_criteria triple as a documented prompt-structure pattern. Actual debugging heuristics live in the `debug-like-expert` skill.
**Notes**: Single-tool `allowed-tools: Skill(debug-like-expert)` enforces strict capability isolation — strong pattern for task-scoped agents. The structured XML body suggests the author uses this file as both a command and a mini-spec; that dual purpose is itself a portable convention.

---

## commands/create-subagent.md
**Type**: Slash-command (skill delegation wrapper)
**Portable**: No — thinner than create-plan.md; body is a single delegation line with no additional structure.
**Reason**: `Invoke the create-subagents skill for: $ARGUMENTS`. No steps, no criteria, no heuristics. Allowed tools locked to `Skill(create-subagents)` only.
**Strip**: Entire file except as a pointer to the `create-subagents` skill, which holds the real content.
**Notes**: Paired with create-agent-skill.md — together they suggest a two-skill system for agent/skill authoring meta-workflows. Audit both underlying skills for portable SOP content.

---

## commands/create-agent-skill.md
**Type**: Slash-command (skill delegation wrapper)
**Portable**: No — identical structural pattern to create-subagent.md; one-line delegator.
**Reason**: `Invoke the create-agent-skills skill for: $ARGUMENTS`. No embedded workflow logic.
**Strip**: Entire file; real content is in `Skill(create-agent-skills)`.
**Notes**: Description calls out "expert guidance on structure and best practices" — implies the underlying skill encodes quality criteria for skill authoring, which is a strong SOP candidate. Priority audit target.

---

## skills/expertise/macos-apps/references/project-scaffolding.md
**Type**: Reference — complete macOS Swift app scaffolding guide: XcodeGen project.yml templates, Info.plist and entitlements XML, asset catalog JSON, starter SwiftUI code (App entry point, @Observable AppState, NavigationSplitView ContentView, SettingsView with @AppStorage).
**Portable**: Low — all tooling (XcodeGen, xcodebuild, codesign), configuration formats (project.yml), and Swift source code are Apple-ecosystem-specific; the *project-as-manifest* pattern and *layered starter code structure* are portable SOP abstractions.
**Reason**: XcodeGen's project.yml, xcodebuild command chains, Info.plist schema, and Swift `@main`/SwiftUI scene syntax are macOS-specific with no cross-platform equivalent. The transferable concepts are (1) generating the IDE project file from a human-readable declarative manifest rather than committing binary project artefacts, and (2) separating concerns into entry-point, global state, views, and settings at project inception rather than retrofitting the split later.
**Strip**: All project.yml YAML; xcodebuild/xcodegen command blocks; Info.plist XML; entitlements XML; asset catalog JSON; all Swift source templates; Swift Package Manager dependency snippets; the Xcode GUI alternative section.
**Notes**: Two portable SOP abstractions: (1) *project-as-manifest* — declare project structure in a versioned, human-readable config file and generate IDE project files from it; keep generated artefacts out of version control; (2) *layered starter structure* — at project creation, separate entry-point (App), global shared state (AppState), primary views (Content/Sidebar/Detail), and settings into distinct files; establishing this boundary early prevents structural debt.

---

## skills/expertise/macos-apps/references/security-code-signing.md
**Type**: Reference — macOS security implementation guide: Keychain CRUD patterns using the Security framework, CryptoKit hashing and AES-GCM encryption, app sandbox entitlement declarations, input validation and secure-random utilities, code-signing and notarization CLI workflows, certificate pinning via URLSessionDelegate.
**Portable**: Partially — all Security framework APIs, CryptoKit primitives, and notarization commands are Apple-specific; the *security checklist rules*, *credential storage principles*, and *transport security posture* are universally applicable.
**Reason**: `SecItemAdd`/`SecItemCopyMatching`, `kSecClassGenericPassword`, `xcrun notarytool submit`, `codesign --options runtime`, `AES.GCM.seal` — these are Apple SDK primitives with no direct cross-platform equivalent. The underlying security posture (store secrets in the OS credential store not in files or defaults; HTTPS-only with certificate pinning; validate and sanitise all input; use a CSPRNG for tokens; request minimum required permissions; enable hardened runtime before distribution) transfers directly to any platform and runtime.
**Strip**: All Swift code blocks; Security/CryptoKit API signatures; entitlements XML; bash codesign/notarytool/spctl/hdiutil commands; DMG creation steps; keychain access group configuration; `NSAppTransportSecurity` plist snippets.
**Notes**: Four portable SOP elements: (1) *secrets-in-credential-store rule* — credentials, tokens, and keys belong in the OS-provided credential store (Keychain / Secrets Manager / vault), never in UserDefaults, config files, or source; (2) *minimum-entitlement principle* — request only the permissions the feature actually requires, reviewed per release; (3) *CSPRNG gate* — all tokens, nonces, and session identifiers must come from a cryptographically secure random source, never from predictable generators; (4) *sign → verify → staple → distribute* pipeline — every artefact must be signed, independently verified, notarized/attested, and have the ticket stapled before distribution, regardless of platform.

---

## skills/expertise/macos-apps/references/shoebox-apps.md
**Type**: Reference — shoebox (library) app architecture and implementation guide: when to apply the pattern, SwiftData relational model design (Note/Folder/Tag with cascade delete and inverse relationships), three-pane NavigationSplitView layout, sidebar CRUD with drag-to-reorder, auto-save via onChange, smart folder predicate system, import/export via file panels, full-text search with suggestions, iCloud CloudKit sync configuration.
**Portable**: Low — all code is Swift/SwiftData/SwiftUI/AppKit-specific; the *shoebox vs. document decision criteria* and the *library UX conventions* (auto-save, smart folders, trash-before-delete) are portable architectural guidance.
**Reason**: `@Model`, `@Query`, `ModelConfiguration(cloudKitDatabase: .automatic)`, `NSOpenPanel`, `NavigationSplitView` — all Apple frameworks. The transferable value is the decision heuristic (single managed internal library → shoebox; files shared with other apps or explicitly managed by the user → document model) and the UX contract (auto-save on every mutation, expose modification timestamp not a save button, smart folders as stored predicates evaluated dynamically, trash as recoverable first-delete).
**Strip**: All Swift/SwiftData/SwiftUI code; `@Model`/`@Relationship` annotations; NavigationSplitView and List implementations; NSSavePanel/NSOpenPanel import-export code; iCloud ModelContainer configuration; `@Query` descriptor usage; smart folder predicate switch statements.
**Notes**: Four portable SOP elements: (1) *shoebox vs. document decision matrix* — choose shoebox when the app owns a single library users never navigate as files; choose document model when files are shared across apps or user-managed; (2) *auto-save contract* — mutate state, persist immediately, surface modification timestamps; no explicit save action; (3) *smart folder as stored predicate* — persist filter criteria as data, evaluate dynamically, never maintain a redundant synchronised list; (4) *trash-before-delete* — move items to a recoverable trash state as the default delete action; hard-delete only on explicit "Empty Trash."

---

## skills/expertise/macos-apps/references/swiftui-patterns.md
**Type**: Reference — comprehensive SwiftUI macOS pattern catalogue: @Bindable/@Observable observation rules, NavigationSplitView two- and three-column layouts, NavigationStack drill-down, multi-window management (WindowGroup/Window/DocumentGroup), toolbar configuration, app menu commands (CommandMenu/CommandGroup), List/Table/OutlineGroup with selection and sort, settings forms with validation, sheets/confirmation dialogs/file dialogs, drag-and-drop with drop targets, @FocusState management, and the keyboard-shortcut architecture (menu commands + FocusedValues).
**Portable**: Partially — all SwiftUI APIs are Apple-specific; the *observation propagation rule*, the *declarative-overrides-imperative meta-principle*, and the *system-level shortcut registration pattern* are portable design patterns applicable to any reactive UI framework.
**Reason**: `@Bindable`, `NavigationSplitView`, `WindowGroup`, `.toolbar {}`, `CommandGroup`, `.fileImporter`, `@FocusState`, `.draggable()`, `FocusedValues` — all SwiftUI primitives. The transferable abstractions are independent of the framework: reference-typed model objects must carry their reactivity when passed into child components; diagnosis in layered framework stacks should start at the most declarative layer; keyboard/action shortcuts must be registered at the application level to guarantee system-level interception priority.
**Strip**: All Swift/SwiftUI code; NavigationSplitView/NavigationStack API usage; window modifier chains (`.windowResizability`, `.defaultPosition`); toolbar placement enums; FocusedValues key struct definitions; drag-and-drop protocol conformances; `#Preview` macros; `NSApp.keyWindow` toggleSidebar workaround.
**Notes**: Three portable SOP abstractions: (1) *declarative-overrides-imperative rule* — in a layered framework stack (declarative wrapper over imperative engine), diagnose unexpected behaviour at the highest declarative layer first; the wrapper controls the wrapped, so jumping to imperative APIs without checking the declarative layer first wastes effort and adds fragile workarounds; (2) *reactivity-propagation rule* — reference-typed model objects passed into child components must retain their observation mechanism (the framework's equivalent of @Bindable); stripping them to plain references silently breaks reactivity; (3) *system-level shortcut registration* — action keyboard shortcuts must be registered at the application/menu-bar level to guarantee OS-level interception priority; view-local key handlers are appropriate only for navigation and typeahead, not for triggering commands.

## commands/consider/opportunity-cost.md
**Type**: Analytical command (structured mental model prompt)
**Portable**: Yes
**Reason**: Framework for opportunity-cost analysis is universally applicable — prompts the model to surface hidden resource costs and compare against best alternatives. No taches-specific scaffolding.
**Strip**: Frontmatter (`description`, `argument-hint`); XML tags (`<objective>`, `<process>`, `<output_format>`, `<success_criteria>`); `$ARGUMENTS` variable reference.
**Notes**: Core value is the five-step process and the structured output sections (Resources Required, Best Alternative Uses, True Cost, Verdict). These map cleanly into a reusable skill prompt.

## commands/consider/pareto.md
**Type**: Analytical command (structured mental model prompt)
**Portable**: Yes
**Reason**: 80/20 prioritisation framing is domain-agnostic. The six-step process and Vital Few / Trivial Many output structure are cleanly separable from taches internals.
**Strip**: Frontmatter; XML tags; `$ARGUMENTS` variable reference.
**Notes**: The "Bottom Line" single-sentence output is a strong pattern worth preserving verbatim. Success-criteria block is boilerplate and can be dropped or collapsed into a one-liner in a skill.

## commands/consider/swot.md
**Type**: Analytical command (structured mental model prompt)
**Portable**: Yes
**Reason**: Classic SWOT with the four-quadrant SO/WO/ST/WT strategy cross is a standard consulting tool — no dependency on taches internals.
**Strip**: Frontmatter; XML tags; `$ARGUMENTS` variable reference.
**Notes**: The cross-quadrant "Strategic Moves" section distinguishes this from a bare SWOT grid and is the most portable element. Internal/external categorisation instruction (step 1–6 process) is worth keeping verbatim.

## commands/consider/via-negativa.md
**Type**: Analytical command (structured mental model prompt)
**Portable**: Yes
**Reason**: Subtraction-first heuristic is framework-agnostic and rarely appears in agent skill sets — high novelty value for a portable library.
**Strip**: Frontmatter; XML tags; `$ARGUMENTS` variable reference.
**Notes**: The "Subtraction Candidates" table pattern (Item → Remove because → Impact) and "What to Say No To" future-rejection section are the portable gems. Success-criteria block is generic and expendable.

## commands/consider/5-whys.md
**Type**: Reasoning framework command — structured root-cause analysis via iterative "why" questioning.
**Portable**: Yes
**Reason**: Pure analytical protocol with no taches-specific state, UI, or storage references. The XML prompt structure and output format translate directly to a skill or system prompt block in any agent framework.
**Strip**: XML tags (`<objective>`, `<process>`, `<output_format>`, `<success_criteria>`) — replace with clean markdown sections; `$ARGUMENTS` interpolation — replace with skill-standard `{{input}}` or context reference.
**Notes**: Strong signal for a "root-cause" reasoning skill. The 5-step process + success criteria are the portable core. Output format is already well-structured markdown.

## commands/consider/eisenhower-matrix.md
**Type**: Prioritisation framework command — 2×2 urgency/importance quadrant classification.
**Portable**: Yes
**Reason**: Self-contained decision framework with no taches-specific dependencies. Quadrant logic and action directives (Do First / Schedule / Delegate / Eliminate) are universally applicable.
**Strip**: XML wrapper tags; `$ARGUMENTS` interpolation; "Immediate Focus" label could be renamed to fit a skill's output conventions.
**Notes**: Maps cleanly to a triage or planning skill. The Q1–Q4 output format is already opinionated enough to be a template — high reuse value for task-management or project-planning contexts.

## commands/consider/occams-razor.md
**Type**: Reasoning framework command — assumption-counting explanation selector.
**Portable**: Yes
**Reason**: Entirely self-contained epistemic heuristic. No tool calls, state, or taches internals. The assumption-enumeration + evidence-check loop is a reusable analysis pattern.
**Strip**: XML wrapper tags; `$ARGUMENTS` interpolation; the bracket placeholders in output format (`[A, B, C]`) should become concrete instructions in a skill context.
**Notes**: Pairs well with `5-whys.md` as a complementary diagnostic — whys find depth, razor finds simplicity. Could be combined into a single "critical-reasoning" skill or kept separate for composability.

## commands/consider/one-thing.md
**Type**: Focus/prioritisation framework command — single-leverage-point identifier using Gary Keller's "One Thing" question.
**Portable**: Yes
**Reason**: No taches internals; purely a structured thinking prompt. The domino-causality framing ("makes everything else easier or unnecessary") is the portable insight.
**Strip**: XML wrapper tags; `$ARGUMENTS` interpolation; "Candidate Actions" list is illustrative scaffolding — a skill should instruct the agent to generate it rather than hard-code three slots.
**Notes**: Complements `eisenhower-matrix.md` (which sorts many things) by forcing a single-item focus after sorting. The `Next Action` section is a useful close-out step worth preserving verbatim in any port.

## commands/research/competitive.md
**Type**: Slash command (research workflow)
**Portable**: Yes
**Reason**: Fully generic competitive-research workflow — intake gate, structured output with comparison matrix and `<claude_context>` block, artifact save. No taches-specific domain logic; pattern applies to any product or feature space.
**Strip**: `AskUserQuestion` interactive intake (replace with direct questions or assume context in a non-interactive agent); `<artifact_output>` path convention (adapt to target repo's artifact structure).
**Notes**: `<claude_context>` block with `table_stakes`, `differentiators`, `avoid`, `positioning` sub-keys is a strong portable pattern for embedding research findings into agent context. The "decision gate" loop (start / ask more / add context) is a reusable clarification idiom worth extracting as a standalone SOP.

## commands/research/deep-dive.md
**Type**: Slash command (research workflow)
**Portable**: Yes
**Reason**: Fully generic deep-investigation workflow — intake gate, multi-angle research process (mechanics / history / patterns / limitations / trends), structured output with `<claude_context>` application block and explicit "Remaining Unknowns" checklist. Zero domain coupling.
**Strip**: `AskUserQuestion` interactive intake; `<artifact_output>` path convention.
**Notes**: "Remaining Unknowns" as a first-class output section is an underused pattern that prevents silently incomplete research. The `<claude_context>` block (`when_to_use`, `when_not_to_use`, `prerequisites`, `gotchas`) is a clean portable template for any research-to-implementation handoff skill.

## commands/research/feasibility.md
**Type**: Slash command (assessment workflow)
**Portable**: Yes
**Reason**: Three-axis feasibility framework (technical / resource / external) with per-axis verdicts, a blocker table, de-risking options, and a clear Go / Go-with-conditions / No-go conclusion. `<claude_context>` includes `if_go`, `risks`, and `alternatives` sub-keys. Applies to any project or feature assessment.
**Strip**: `AskUserQuestion` interactive intake; `<artifact_output>` path convention.
**Notes**: The three-axis structure (technical, resource, external dependency) is the most extractable element — it maps cleanly to a standalone feasibility-check SOP. `simpler_version` under `<alternatives>` is a valuable forcing function to surface a descoped fallback, worth carrying into any planning skill.

## commands/research/landscape.md
**Type**: Slash command (research workflow)
**Portable**: Yes
**Reason**: Domain-mapping workflow that categorises a space into mutually-exclusive / collectively-exhaustive groups, maps players and tools per category, surfaces trends and white-space gaps, and closes with `<claude_context>` positioning / technical / trends blocks. No domain-specific logic.
**Strip**: `AskUserQuestion` interactive intake; ASCII visual map placeholder (low signal in most output contexts); `<artifact_output>` path convention.
**Notes**: The MECE category requirement ("mutually exclusive and collectively exhaustive") stated in `<success_criteria>` is a strong portable constraint worth adding to any landscape or taxonomy skill. The `adopt / watch / avoid` trend taxonomy inside `<claude_context>` is a clean, reusable signal-filtering pattern.

## commands/research/history.md
**Type**: Slash command — structured research workflow with intake gate, process, and output template
**Portable**: Yes
**Reason**: Pure prompt engineering; no taches-specific tooling, paths, or state. The intake gate (context analysis → clarifying questions → decision gate), structured output format, `<claude_context>` machine-readable block, and `artifact_output` save convention are all reusable patterns.
**Strip**: `AskUserQuestion` tool references (replace with prose instructions or remove if target agent handles clarification differently); `artifact_output` section if the target repo uses a different artifact convention.
**Notes**: Strong adopt/avoid/changed tripartite structure in `<claude_context>` is a standout pattern for history-informed planning. Intake gate's "skip questions where $ARGUMENTS already provides the answer" instruction is a good anti-redundancy guard worth preserving verbatim.

## commands/research/open-source.md
**Type**: Slash command — OSS discovery workflow with intake gate, maintenance-verification checklist, and build-vs-use analysis
**Portable**: Yes
**Reason**: Language/framework agnostic; maintenance-verification sub-process (last commit date, issue response time, bus factor) and build-vs-use tradeoff section are universally applicable.
**Strip**: `AskUserQuestion` tool references; `artifact_output` section if not using the same artifacts/ convention.
**Notes**: Maintenance verification checklist (last commit >1 year OR single-contributor OR unanswered issues → flag) is the most portable gem here — worth extracting as a standalone rule. The `<if_use>` / `<if_build>` branching inside `<claude_context>` is a clean pattern for conditional implementation context.

## commands/research/options.md
**Type**: Slash command — structured decision/comparison workflow with weighted-criteria scoring and runner-up recommendation
**Portable**: Yes
**Reason**: Domain-agnostic comparison template; weighted criteria + comparison matrix + runner-up contingency pattern applies to tools, vendors, architectures, and approaches equally.
**Strip**: `AskUserQuestion` tool references; `artifact_output` section if not applicable.
**Notes**: "Runner-up: choose this if [specific condition]" is a notably useful addition over plain recommendations — surfaces the contingency without requiring a separate decision. The `<runner_up>` block in `<claude_context>` including `switch_cost` is a good forward-planning pattern.

## commands/research/technical.md
**Type**: Slash command — technical implementation research workflow with multi-approach comparison and implementation-ready output
**Portable**: Yes
**Reason**: No taches-specific dependencies; the approach-per-section structure (how it works → libraries → pros/cons → best when → complexity) and `<claude_context>` block with `architecture`, `files`, and `implementation` sub-blocks are reusable across any technical research context.
**Strip**: `AskUserQuestion` tool references; `artifact_output` section if not applicable.
**Notes**: The `<implementation>` sub-block with `start_with`, `order`, `gotchas`, and `testing` fields is the most actionable output structure of the four research commands — directly bridges research to execution. Scope question ("Quick overview / Thorough / Deep dive") is a useful meta-control for research depth.

## commands/audit-subagent.md
**Type**: Thin dispatcher — delegates entirely to a `subagent-auditor` subagent; no logic of its own.
**Portable**: No
**Reason**: Depends on a taches-specific `subagent-auditor` subagent that does not exist in the skills repo; the concept (audit a subagent config for structure/quality) is useful but not portable as-is.
**Strip**: The `subagent-auditor` invocation pattern and taches-specific XML-structure compliance framing.
**Notes**: The *goal* (structured quality audit of an agent config file) is worth preserving as a meta-skill SOP, but it must be rewritten to work without the proprietary subagent dependency.

## commands/check-todos.md
**Type**: Interactive TODO workflow — multi-step user-facing command for browsing, selecting, and dispatching work from a `TO-DOS.md` file.
**Portable**: Partial
**Reason**: The structured state-machine pattern (parse → display compact list → load full context → match workflow → act) is an excellent UX protocol reusable in any project that maintains a `TO-DOS.md`; the specific skill-dispatch hooks (`plugins/` → plugin workflow etc.) are taches-local.
**Strip**: Domain-specific path-to-workflow mappings (`plugins/`, `mcp-servers/`, `CLAUDE.md` references to taches conventions).
**Notes**: The numbered-list interaction format and the "brainstorm / start / put it back" branching pattern are strong portable SOP primitives worth extracting. Generalise workflow-matching to a generic CLAUDE.md + skills-directory lookup.

## commands/create-hook.md
**Type**: Skill passthrough — single line delegating to `create-hooks` skill.
**Portable**: No
**Reason**: Pure indirection to a taches-local `create-hooks` skill; zero standalone value.
**Strip**: Entire file — it is noise, not pattern.
**Notes**: The *skill* (`create-hooks`) may contain portable guidance; this command file itself does not.

## commands/create-meta-prompt.md
**Type**: Skill passthrough with argument forwarding — delegates to `create-meta-prompts` skill, passing `$ARGUMENTS` through.
**Portable**: No
**Reason**: Depends on a taches-specific `create-meta-prompts` skill; the argument-forwarding pattern is trivial boilerplate.
**Strip**: Entire file — it is a thin wrapper with no extractable SOP content.
**Notes**: The concept of a Claude-to-Claude pipeline prompt optimizer is worth checking in the skill itself, not here.

## .references/taches/commands/run-prompt.md
**Type**: slash-command (orchestrator) **Portable**: yes **Reason**: Generic prompt-dispatch pattern — reads numbered `.md` files from a `./prompts/` directory, delegates each to a sub-task via Task tool, supports single / parallel / sequential modes, archives completed prompts, and commits. Zero repo-specific logic. **Strip**: file-path convention (`./prompts/`), git-commit step (repo concern), archive step (repo concern). **Notes**: The parallel-dispatch pattern (all Task calls in one message) and sequential-with-early-stop pattern are strong portable SOPs. Argument parsing with default-to-sequential safety is also worth extracting.

## .references/taches/commands/setup-ralph.md
**Type**: slash-command (thin wrapper) **Portable**: yes **Reason**: One-liner that invokes `Skill(setup-ralph)` with passthrough arguments — entire content is the invocation pattern, not repo-specific logic. **Strip**: nothing meaningful to strip; the whole file is the pattern. **Notes**: Demonstrates the minimal skill-invocation command pattern: frontmatter declares `allowed-tools: Skill(name)` and the body is `Invoke the <skill> for: $ARGUMENTS`. Portable as a template for any skill-backed slash command.

## .references/taches/commands/whats-next.md
**Type**: slash-command (context handoff) **Portable**: yes **Reason**: Produces a structured `whats-next.md` handoff document covering original task, work completed, work remaining, attempted approaches, critical context, and current state. No repo-specific references; uses only Read/Write/Bash/WebSearch/WebFetch. **Strip**: nothing; output path (`whats-next.md` in cwd) is intentionally generic. **Notes**: High-value portable SOP for context continuity across sessions. The six-section XML output schema (`<original_task>`, `<work_completed>`, `<work_remaining>`, `<attempted_approaches>`, `<critical_context>`, `<current_state>`) is a clean, reusable handoff contract.

## .references/taches/.claude-plugin/marketplace.json
**Type**: plugin registry metadata **Portable**: no **Reason**: Declares the `taches-cc-resources` plugin package with owner contact (Lex Christopherson / glittercowboy), version, and source path. Pure packaging/distribution metadata for the Claude Code marketplace format. **Strip**: everything — owner email, plugin name, source path are all repo-specific. **Notes**: Confirms the repo is distributed as a Claude Code marketplace plugin. The `"strict": true` field is worth noting as a packaging convention.

## .references/taches/.claude-plugin/plugin.json
**Type**: plugin manifest **Portable**: no **Reason**: Package-level manifest with author, repo URL, homepage, license (MIT), and keyword taxonomy (`skills`, `prompts`, `mcp-servers`, `subagents`, `hooks`, `slash-commands`, `prompt-engineering`, `meta-prompting`). All fields are distribution metadata. **Strip**: everything. **Notes**: Keyword list is a useful taxonomy of the repo's scope. MIT license is portable-friendly. No behavioural instructions to extract.

## commands/create-prompt.md
**Type**: Slash command (interactive prompt-engineering wizard)
**Portable**: Partial
**Reason**: Core pattern — intake gate → clarifying questions → structured XML prompt generation → numbered file save → decision tree with run option — is framework-agnostic. However several implementation details are taches-specific: `./prompts/*.md` output path, SlashCommand tool invocation of `/run-prompt`, and the `AskUserQuestion` tool assumption.
**Strip**: SlashCommand tool references, `/run-prompt` invocation hooks, AskUserQuestion tool (replace with plain clarifying-question prose), `./prompts/` path convention.
**Notes**: High-value SOP candidate. The adaptive intake loop (vague → questions → decision gate → "Proceed"), parallel-vs-sequential execution strategy heuristics, and XML prompt construction rules (context/why/success-criteria/verification tags, extended-thinking triggers, "go beyond basics" language) are all reusable prompt-engineering patterns. Prompt construction rules and intelligence rules sections are especially portable.

## commands/create-slash-command.md
**Type**: Thin dispatcher slash command
**Portable**: No
**Reason**: Single-line body — `Invoke the create-slash-commands skill for: $ARGUMENTS` — is a pure taches internal routing shim that delegates to a `create-slash-commands` skill. There is no standalone logic to extract.
**Strip**: Entire file; no reusable content.
**Notes**: Only noteworthy convention is the `Skill(...)` allowed-tools syntax for delegating to a named skill. If the target skill (`create-slash-commands`) is in scope elsewhere it may be worth auditing; this command itself has no portable SOP value.

## commands/heal-skill.md
**Type**: Self-healing / skill-correction slash command
**Portable**: Yes
**Reason**: The workflow — detect which skill misfired → reflect on root cause → surface before/after diff → get explicit user approval → apply edits → optionally commit — is a clean, reusable SOP pattern independent of taches tooling. The only taches-specific element is the `./skills/*/SKILL.md` path convention and `git` commit step.
**Strip**: Hardcoded `./skills/$SKILL_NAME` path references (parameterise), `git commit` step (make optional/configurable).
**Notes**: Strong portable candidate. The approval-gated correction workflow (present diff → 4-option gate → wait before applying) is a best practice for any agent that self-modifies configuration files. The reflection taxonomy (what was wrong / discovery method / root cause / scope / proposed fix) is a reusable structured-reasoning pattern for post-execution correction.

## commands/run-plan.md
**Type**: Plan execution orchestrator slash command
**Portable**: Partial
**Reason**: The three-strategy routing model (fully autonomous / segmented-with-verify-checkpoints / decision-dependent) and the context-efficiency budget (execution context ~5-7k, domain context ~10-15k, <30% overhead) are strong portable patterns. Taches-specific elements: SUMMARY.md + ROADMAP.md output conventions, `execute-phase.md` context file, `checkpoint:human-verify` / `checkpoint:decision` / `checkpoint:human-action` type taxonomy, and `{{plan_path}}` template syntax.
**Strip**: SUMMARY.md/ROADMAP.md update steps, `execute-phase.md` file reference, taches checkpoint-type strings (generalise to "verify-only" vs "decision/action" checkpoint concepts), `{{plan_path}}` mustache syntax.
**Notes**: The segmentation heuristic (parse checkpoint types → choose autonomous vs segmented vs sequential execution in main context) and the context-efficiency target are both strong reusable orchestration patterns. The "subagent handles segment, main context handles checkpoints" split is a clean delegation model worth preserving in any plan-execution SOP.

## commands/add-to-todos.md
**Type**: Slash command — structured todo capture with duplicate-check and handoff format
**Portable**: Partially — the Problem/Files/Solution inline format and "self-contained entry for future Claude" principle are universally reusable; the interactive duplicate-check flow assumes a live session
**Reason**: The entry format (`**[Action verb] [Component]** - … **Problem:** … **Files:** … **Solution:**`) is a strong portable SOP for task-handoff notes that give future agents full context without conversation history
**Strip**: `!`date...`` live injection (taches-specific frontmatter feature); hard-coded `TO-DOS.md` filename; interactive "wait for user response" loops (assumes synchronous chat session, not agent chains)
**Notes**: Extract the entry format and self-containment principle as a portable "task-note" SOP; the duplicate-check heuristic (extract key concept, fuzzy-match existing titles) is also worth lifting

## commands/ask-me-questions.md
**Type**: Slash command — requirements gathering via adaptive intake gate
**Portable**: Yes — the three-phase pattern (context analysis → gap questions → decision gate with loop) is tool-agnostic and broadly reusable
**Reason**: The Intake & Decision Gate is a clean, named SOP for preventing premature execution; the five-axis context model (What / Who / Why / How / When) and "only ask about genuine gaps" rule are strong portable principles
**Strip**: XML wrapper tags (`<objective>`, `<intake_gate>`, `<process>`, `<success_criteria>`) are taches-specific skill structure; `AskUserQuestion` tool calls are taches-native and have no direct equivalent in other agents
**Notes**: Reframe as a prose SOP around the intake-gate pattern; the "skip questions where context already answers them" constraint and the three-option decision gate (start / ask more / add context) are the highest-value extracts

## commands/audit-skill.md
**Type**: Slash command — thin delegation wrapper to `skill-auditor` subagent
**Portable**: No — the command body is a one-step subagent invocation; value lives in the subagent definition, not here
**Reason**: The audit criteria listed (YAML compliance, pure XML structure, required/conditional tags, progressive disclosure, anti-patterns) are portable quality gates, but they are only named here, not defined
**Strip**: The entire `<process>` block (taches subagent delegation); `<success_criteria>` as written only validates invocation mechanics, not audit quality
**Notes**: No standalone SOP to extract; flag as a pointer — if `skill-auditor` subagent is available, read it for the actual audit checklist; the criteria names can seed a portable skill-quality rubric

## commands/audit-slash-command.md
**Type**: Slash command — thin delegation wrapper to `slash-command-auditor` subagent
**Portable**: No — same pattern as `audit-skill.md`; body is a subagent pass-through with no substantive logic
**Reason**: Audit dimensions (security, clarity, effectiveness, YAML hygiene, argument handling, dynamic context, tool restrictions) are named in the description frontmatter but not elaborated
**Strip**: Entire body; only the frontmatter `description` field hints at audit scope
**Notes**: No extractable SOP here; the audit dimension list in the description is the only portable signal — use it to seed a slash-command quality rubric if the auditor subagent is unavailable
