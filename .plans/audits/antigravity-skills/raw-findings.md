## skills/agent-orchestrator/SKILL.md
**Type**: Meta-skill / multi-agent orchestration procedure (registry scan, skill match, multi-skill plan).

**Portable**: No — low as a standalone SOP without the shipped tooling.

**Reason**: Execution contract is three Python CLIs under `agent-orchestrator/scripts/` plus `agent-orchestrator/data/registry.json` (and optional `projects.json`). Discovery rules target `.claude/skills/*/` and repo-relative SKILL.md trees; scoring/thresholds and orchestration patterns are implemented in code, not fully specified for hand-rolling elsewhere.

**Trigger**: Any user request where the agent must route work across many skills, refresh a skill registry, or coordinate 2+ matched skills after `match_skills.py`.

**Steps/contract**: (1) `python agent-orchestrator/scripts/scan_registry.py` (cache/MD5; `--status`, `--force` documented). (2) `python agent-orchestrator/scripts/match_skills.py "<user request>"` (optional `--project <name>` for +20 boost); act on JSON: 0 matches → normal mode; 1 → load that SKILL.md; 2+ → step 3. (3) `python agent-orchestrator/scripts/orchestrate.py --skills skill1,skill2 --query "<request>"`. Shortcut: scan then match in one shell chain. Registry path and project CRUD via `projects.json` described in prose.

**Strip**: YAML frontmatter (tools/source/author/date), generic “When to use / Do not use / Best practices / Pitfalls” filler, static “Skills Atuais” table (stale unless regenerated), broken pointer `References/Orchestration-Patterns.Md`, duplicate scan command sections if deduplicating for SOP.

**Notes**: Mix of Portuguese procedural text and English boilerplate; documents ecosystem-specific conventions (Claude Code copy path). Portable *concept* (discover → rank → orchestrate) is reusable; this file is an operator manual for one implementation, not a tool-agnostic SOP.
## skills/loki-mode/SKILL.md
**Type**: Multi-agent autonomous SDLC orchestration skill (Loki Mode): stateful `.loki/` workspace (CONTINUITY, queues, orchestrator, episodic/semantic memory, metrics), RARV loop, model-routing (Opus/Sonnet/Haiku), quality gates, and extensive reference splits.
**Portable**: **No** (only fragments portable).
**Reason**: Requires a Loki-style filesystem layout and processes (JSON queues, orchestrator state, protected `autonomy/run.sh` and dashboard); assumes Claude Code CLI (`claude --dangerously-skip-permissions`), `Task(...)` Python API, Playwright MCP, and paths like `~/.claude/skills/`. “Zero human intervention” / never ask questions conflicts with normal interactive SOPs; many steps point to bundled `references/*.md` and 37 swarm-specific agents not present in a generic repo.
**Trigger**: Explicit invocation phrases: “Loki Mode” or “Loki Mode with PRD at [path]” (per skill); also “every turn” hooks tied to reading `.loki/CONTINUITY.md` when the system is bootstrapped.
**Steps/contract**: (1) Each iteration: REASON (read CONTINUITY, mistakes, orchestrator, pending queue) → ACT (implement / dispatch subagents) → REFLECT (update CONTINUITY, check promise) → VERIFY (tests, build, spec vs `.loki/specs/openapi.yaml`). (2) Spec-first: OpenAPI → tests → code. (3) Structured subagent brief: GOAL, CONSTRAINTS, CONTEXT, OUTPUT FORMAT, WHEN COMPLETE. (4) Quality gates: input/output guardrails, static analysis, parallel blind review + devil’s advocate, severity-based blocking. (5) One feature per iteration; git checkpoints; protected files not edited while running.
**Strip**: YAML frontmatter and version/marketing taglines; Claude-only prerequisites; all `Task(...)` / Bedrock routing examples tied to a specific runtime; model-version tables (replace with “planning vs implementation vs cheap ops”); paths `~/.claude/`, `.loki/*` OR replace with neutral “session log + task queue” placeholders; swarms/agent-type inventory; contradictory “never ask” vs escalation tables—reconcile for target environment; broken/version drift footer (“2.32.0” vs header “2.35.0”).
**Notes**: Reusable as abstract guidance: RARV-style loop, episodic/semantic memory idea, spec-first, deterministic verification before LLM review, narrow-scope tasks, structured handoffs. As-is it is a productized skill pack, not a drop-in portable SOP without heavy adaptation and infrastructure.
## skills/antigravity-workflows/SKILL.md
**Type**: Meta-workflow orchestration (router + execution playbook for skills). **Portable**: Partial — the procedural skeleton and closure criteria are reusable as an SOP; authoritative definitions live in companion files (`docs/WORKFLOWS.md`, `data/workflows.json`) and step-level behavior depends on a fixed set of Antigravity skill names. **Reason**: Explicit when-to-use, ordered source-of-truth order, step-by-step run contract, default routing table, limitations, and related skills — maps cleanly to SOP sections without IDE-specific mechanics in the body. **Trigger**: Multi-phase objectives; combining several skills without hand-picking each; asks for best-practice runs for SaaS MVP delivery, web security audit, AI agent system, browser/E2E QA, or DDD core domain. **Steps/contract**: (1) Read `docs/WORKFLOWS.md` then `data/workflows.json`. (2) Identify concrete user outcome. (3) Propose 1–2 matching workflows; user chooses. (4) Execute sequentially: announce step + expected artifact; invoke recommended skills; verify completion before advancing. (5) Finish with completed artifacts, validation evidence, remaining risks, next actions. Default routes: product→`ship-saas-mvp`, security→`security-audit-web-app`, agent/LLM→`build-ai-agent-system`, E2E/browser→`qa-browser-automation`, DDD→`design-ddd-core-domain`. **Strip**: YAML frontmatter tuned to this repo; copy-paste prompts using `@antigravity-workflows`; skill IDs unless replaced with equivalent procedures in the target system. **Notes**: Orchestration-only; success still needs env access, credentials, infrastructure, and locally present downstream skills; stack-specific caveat for Go/browser via `go-playwright`.
## skills/antigravity-skill-orchestrator/SKILL.md
**Type**: Meta-orchestration workflow — task-complexity guardrails, skill discovery/selection, optional catalog consult, and post-success recording of skill combinations.
**Portable**: Partial — the decision flow and constraints generalize; the concrete integrations do not.
**Reason**: Core SOP (evaluate → consult memory → discover minimal skills → execute → persist combination; never invent new skills; avoid skills on trivial work) is agent-agnostic. Portability breaks on required `agent-memory-mcp` tool names (`memory_search`, `memory_read`, `memory_write`, `skill_combination` schema), Antigravity `@skill` conventions, and the fixed master-catalog URL.
**Trigger**: Complex multi-step / multi-domain requests; uncertainty which skills apply; user asks to orchestrate or combine skills; desire to reuse prior successful skill bundles.
**Steps/contract**: (1) Classify task: if simple/contained, solve with baseline edit/search/terminal only — stop. (2) If complex: search typed memory for similar `skill_combination`; read hit if useful. (3) Map requirements to locally available skills; if insufficient, fetch remote `CATALOG.md` and pick minimal matching set. (4) After successful completion with a new combo, `memory_write` keyed `skill_combination` with rationale/tags. Explicit prohibition: do not create or generate new skills.
**Strip**: YAML frontmatter; ecosystem-specific naming (`@agent-memory-mcp`, `@react-patterns`-style examples); GitHub raw catalog URL (replace with org’s catalog or local index); JavaScript-shaped tool calls — replace with the target stack’s memory/discovery API.
**Notes**: Nine catalog categories named but content is external; emphasizes token/time cost of over-skilling; forbids conflicting skill bundles without resolution; “master catalog” is a network dependency unless mirrored.
## skills/context-driven-development/SKILL.md
**Type**: Methodology for treating project context as managed artifacts (Context → Spec & Plan → Implement) with explicit artifact roles (product, guidelines, tech-stack, workflow, tracks).

**Portable**: Partial — workflow philosophy and maintenance principles generalize; file names and procedures assume the Conductor layout and tooling.

**Reason**: Binds to Conductor: `/conductor:setup`, `conductor/` tree (`index.md`, `tracks/`, `setup_state.json`), greenfield/brownfield setup flows, and session continuity tied to that structure.

**Strip**: YAML frontmatter; repeat overview line in body; full `conductor/` directory paste; Conductor-specific setup/CLI; IDE pin/git-hook/CI examples that hard-code `conductor/` paths; pointer to `resources/implementation-playbook.md` if absent in target pack.

**Notes**: Strong candidate for a portable “context validation checklist” SOP; anti-patterns section transfers cleanly. Product-specific branding (“Conductor”) must be neutralized for non-Conductor repos.

## skills/verification-before-completion/SKILL.md
**Type**: Hard behavioral gate — no success/completion/satisfaction claims without fresh command output and evidence (iron law + gate function).

**Portable**: Yes — tool-agnostic completion discipline; no required external CLI or repo layout in the operative sections.

**Reason**: Self-contained rules, tables, and patterns; only ambient dependency is whichever verifier maps to the claim (tests, linter, build), chosen per task.

**Strip**: YAML frontmatter; duplicate “When to Use” section; emotionally loaded phrasing / “lying” framing if the target SOP needs neutral tone; anecdotal “failure memories” block if inappropriate for policy docs.

**Notes**: Maps directly to quality-gate SOPs and pairs well with Definition-of-Done checklists; explicitly forbids trusting agent reports without VCS/verification — useful for human or AI operators alike.

## skills/closed-loop-delivery/SKILL.md
**Type**: End-to-end delivery loop: define DoD → minimal change → local verify → PR review loop → optional dev deploy/runtime verify → stop conditions and escalation.

**Portable**: Partial — phases and human-gate rules are generic; PR polling, GitHub, and dev deploy assume a typical Git+CI+hosted PR workflow.

**Reason**: References PR comment polling with timed rounds, fetch/review cycles, `dev` deploy, and optional dependency on `create-issue-gate` (`ready` + `allowed`).

**Strip**: YAML frontmatter; exact polling minute values; default `dev` and max-round defaults if your org differs; GitHub-centric wording if using another forge; tighten prod/staging language to local policy.

**Notes**: Output contract (checklist, commands, runtime evidence, PR status) aligns with verification-before-completion; good backbone for a “don’t hand back until DoD is evidenced” SOP.

## skills/create-issue-gate/SKILL.md
**Type**: Issue intake template + status model (`draft` | `ready` | `blocked` | `done`) with a hard gate: no testable acceptance criteria ⇒ `draft` and blocked execution.

**Portable**: Partial — gate logic and body sections are universal; default creation path is GitHub CLI–specific.

**Reason**: Prescribes `gh issue create` as default mode and an Execution Gate (`allowed` | `blocked`); execution skills (e.g. closed-loop) should only run when status is `ready` and gate is `allowed`.

**Strip**: YAML frontmatter; `gh`-only instructions — replace with Jira/Linear/etc. equivalent; verbatim template if your tracker uses different required fields.

**Notes**: Composes cleanly as a front door before implementation-heavy skills; invalid-vs-valid acceptance criteria examples are reusable as lint rules for issue quality.

## skills/ask-questions-if-underspecified/SKILL.md
**Type**: Requirements-clarification workflow — when to treat a request as underspecified, how to ask minimal must-have questions (numbered/MCQ), pause-before-acting rules, question templates, anti-patterns.

**Portable**: Yes — no repo-specific paths or tooling; behavior applies to any coding agent.

**Reason**: Pure procedural content in prose; YAML frontmatter is metadata only; constraints are stated in generic terms (scope, acceptance, environment, safety).

**Strip**: YAML frontmatter (`name`, `description`, `risk`, `source`); optional trim of long example reply block if consolidating; reconcile with any org policy that requires immediate exploration (skill says avoid committing commands/edits until must-haves are answered).

**Notes**: Useful SOP fragment for ambiguity guardrails; pairs well with discovery-read exception (labeled low-risk inspection only).

## skills/receiving-code-review/SKILL.md
**Type**: Reception protocol for code review — read/understand/verify/evaluate/respond/implement ordering, forbidden performative phrases, unclear-feedback handling, source-specific (human vs external) checks, YAGNI probe, implementation order, pushback guidance, GitHub reply placement.

**Portable**: Partial — core verify-then-implement loop is universal; several hooks are persona- or stack-specific.

**Reason**: References `CLAUDE.md` violations, "your human partner" rules, `gh api` inline-comment replies, and in-joke pushback signal; YAGNI uses `grep` as illustrative; otherwise transportable as reviewer-feedback discipline.

**Strip**: YAML frontmatter; "your human partner" / CLAUDE.md callouts; GitHub CLI one-liner (replace with org’s PR workflow); eccentric pushback line; tune the absolute "no thanks/gratitude" rule if the target culture expects brief professional acknowledgment.

**Notes**: Strong overlap with general engineering rigor; the anti-performatives are opinionated and may conflict with some team communication norms.

## skills/code-review-excellence/SKILL.md
**Type**: How to *conduct* reviews — when to use, review dimensions (correctness, security, performance, maintainability), actionable feedback with severity, clarifying questions, output shape; points to bundled playbook.

**Portable**: Partial — body is short and portable; full depth lives in `resources/implementation-playbook.md` (relative to skill root).

**Reason**: Instructions stand alone for outline behavior; "open implementation-playbook" is a hard dependency for detailed patterns/templates unless that file is vendored or rewritten.

**Strip**: YAML frontmatter; `@`-style resource path if the playbook is not shipped in the target bundle; merge with `code-review-checklist` if avoiding duplication.

**Notes**: Composes with checklist skill (excellence = framing + output contract; checklist = breadth); thin without the resource file.

## skills/code-review-checklist/SKILL.md
**Type**: End-to-end review checklist — context, functionality, quality, security, performance, tests, long worked examples (markdown checklists + JS snippets), best practices, pitfalls, comment templates, related-skill pointers, external links.

**Portable**: Yes as a generic checklist — no mandatory local paths; content is technology-agnostic patterns (web/SQL examples are illustrative).

**Reason**: Self-contained markdown; related skills and URLs are optional references, not execution prerequisites.

**Strip**: YAML frontmatter; escaped fence markers inside examples (`\`\`\``) if regenerating clean MD; trim redundant "Examples" sections when slimming to SOP; swap JS samples for stack-relevant ones; drop or localize external link list if offline/air-gapped.

**Notes**: Very long vs `code-review-excellence`; high duplication risk with other review skills — consider one canonical checklist + pointers for an SOP pack.

## skills/dispatching-parallel-agents/SKILL.md
**Type**: Parallel investigation workflow — partition independent failure domains, craft focused sub-agent briefs, dispatch concurrently, then merge and verify.

**Portable**: Partial — the decision tree (independence, no shared state) and prompt/anti-pattern guidance generalize; the sample invocation does not.

**Reason**: Core SOP (identify domains → scoped tasks → parallel dispatch → review conflicts → full suite) is environment-agnostic. Examples assume a `Task("...")` concurrent API (“Claude Code / AI environment”) and concrete test-file names; Graphviz `dot` blocks are documentation-only.

**Strip**: YAML frontmatter; product-specific `Task(...)` snippet; long session “real example” with dated anecdote if slimming for SOP; duplicate “when not to use” if consolidating.

**Notes**: Strong reusable content: agent prompt checklist, common mistakes, integration checklist after parallel runs. Pair with your platform’s actual multi-agent/subagent primitive names.

## skills/parallel-agents/SKILL.md
**Type**: Claude Code–centric native multi-agent orchestration (built-in Agent Tool + Explore/Plan/General-purpose) with named specialist agents and a synthesis report template.

**Portable**: No — catalog of agents, trigger phrases, and “native” integration assume Anthropic Claude Code’s agent surface.

**Reason**: Operator guide for a fixed agent roster, resume-by-ID wording, and model table (Haiku/Sonnet) tied to one product. Patterns (discover → domain experts → test → synthesize) are abstractable elsewhere but this file is not drop-in without renaming every agent and tool.

**Strip**: YAML frontmatter; static “Available Agents” and “Built-in Agents” tables (drift risk); `@`-style assumptions if any creep in from surrounding ecosystem — replace with org agent registry; marketing-style checkmark lists if tightening.

**Notes**: Useful as a *pattern library* for orchestration sequencing and a single synthesis artifact; do not copy agent names into non–Claude-Code SOPs without verification they exist locally.

## skills/subagent-driven-development/SKILL.md
**Type**: Same-session plan execution: one fresh implementer subagent per task, mandatory spec-compliance review then code-quality review, loops until pass, optional final whole-implementation review; integrates with external “superpowers” workflow skills.

**Portable**: Partial — the per-task state machine, red flags, and review ordering are portable; bundled assets and brand names are not.

**Reason**: References sibling files (`./implementer-prompt.md`, `./spec-reviewer-prompt.md`, `./code-quality-reviewer-prompt.md`), `TodoWrite`, and `superpowers:*` skills (`writing-plans`, `requesting-code-review`, `finishing-a-development-branch`, `executing-plans`, `test-driven-development`). Without those, the skill is an outline, not an executable runbook.

**Strip**: YAML frontmatter; Graphviz `dot` diagrams (optional for SOP); long narrative example; explicit `superpowers:` and pathDependencies — substitute your org’s plan/review/branch-closure procedures; “never dispatch parallel implementers” is keep unless your merge model differs.

**Notes**: High-signal governance: forbids skipping reviews, wrong review order, or parallel implementers; emphasizes full task text to subagents instead of rereading the plan file.

## skills/concise-planning/SKILL.md
**Type**: Lightweight planning procedure — scan repo context, cap clarifying questions, emit a short plan with approach, in/out scope, 6–10 verb-first action items, and validation.

**Portable**: Yes — minimal assumptions (read `README.md` / docs / relevant code); no IDE or vendor API coupling in the body.

**Reason**: Template and guidelines apply to any codebase; only “read these files” may need tailoring if your repo uses different doc entry points.

**Strip**: YAML frontmatter; generic closing line (“applicable to execute the workflow…”) if redundant with your SOP index; optional tightening of template (e.g., cap open questions to match your policy).

**Notes**: Good atomic-checklist discipline; pairs well as front matter before heavier orchestration skills.

## skills/planning-with-files/SKILL.md
**Type**: Working-memory / persistence playbook: project-local `task_plan.md`, `findings.md`, `progress.md`; 2-action save rule; 3-strike error protocol; read/write decision matrix and reboot checklist.

**Portable**: Yes — procedural pattern is tool-agnostic; templates/scripts are optional extras.

**Reason**: Core contract is “volatile context vs durable files in the repo,” not a vendor runtime. Only material coupling is `${CLAUDE_PLUGIN_ROOT}` (or equivalent) for bundled templates and helper shell scripts.

**Strip**: YAML frontmatter; skill-install paths; `CLAUDE_PLUGIN_ROOT` naming; anti-pattern callouts that name a specific ephemeral tool (e.g. TodoWrite) — rephrase as “don’t rely only on in-session lists.”

**Notes**: Explicitly forbids creating planning artifacts under the skill directory; strong SOP material for multi-step research/build work. Companion `templates/`, `scripts/`, `reference.md`, `examples.md` carry detail not repeated in SKILL.md.

## skills/writing-plans/SKILL.md
**Type**: Implementation-plan authoring spec: mandatory plan header, bite-sized (2–5 min) steps, exact paths/commands/expected outputs, save under `docs/plans/YYYY-MM-DD-<feature>.md`, execution handoff.

**Portable**: Partial — document structure and TDD granularity generalize; strings and prerequisites do not.

**Reason**: References `superpowers:executing-plans`, `superpowers:subagent-driven-development`, “brainstorming skill” worktrees, `@` skill syntax, and a fixed `docs/plans/` convention; assumes reader is junior on tests.

**Strip**: “Announce at start” line; REQUIRED SUB-SKILL / `superpowers:*` pointers; worktree/context assumptions unless your org matches; stack-specific pytest/code samples if the target isn’t Python.

**Notes**: Header block is a ready extraction target for cross-agent plan handoff. Offers two execution modes (subagent-driven vs parallel session).

## skills/executing-plans/SKILL.md
**Type**: Plan executor workflow: critical read/review, default batches of three tasks, per-task in_progress→completed, verification, “Ready for feedback” checkpoints, blockers stop execution.

**Portable**: Partial — batch + checkpoint discipline is generic; task tracking integration is not.

**Reason**: Hard-wires TodoWrite; completion chains to `superpowers:finishing-a-development-branch`; “architect review” role label may not match every team.

**Strip**: TodoWrite-specific steps; REQUIRED SUB-SKILL / `superpowers:*` naming; replace with org’s task tracker + branch-closure SOP.

**Notes**: Emphasizes not skipping verifications and not guessing past repeated failures; complements writing-plans as runtime counterpart.

## skills/finishing-a-development-branch/SKILL.md
**Type**: Branch-completion SOP: run test suite first, infer or confirm base branch, present exactly four integration choices (local merge / PR / keep / discard with typed confirm), optional `git worktree remove`, guardrails on destructive ops.

**Portable**: Yes — git and `gh` patterns are standard; placeholders for test command and branch names.

**Reason**: Mostly shell-level with generic `npm test | cargo test | pytest | go test` guidance; worktree cleanup is optional and environment-driven.

**Strip**: YAML frontmatter; Integration/caller bullets naming other bundled skills; tighten any table/section inconsistencies against Step 5 (cleanup rules) when adapting.

**Notes**: PR path uses `gh pr create` heredoc body; discard path requires explicit “discard” confirmation; documents common mistakes (open-ended questions, silent worktree removal).
## skills/differential-review/SKILL.md
**Type**: Security-focused differential review playbook: risk-first principles, codebase-size strategy, phased workflow (triage → analysis → coverage → blast radius → deep/adversarial → report), decision tree to bundled deep docs, quality checklist, integration hooks.
**Portable**: Partial — executive summary, tables, and escalation red flags transfer cleanly; full methodology depends on sibling files (`methodology.md`, `adversarial.md`, `reporting.md`, `patterns.md`) and references `audit-context-building` plus `issue-writer --input ...` as optional ecosystem glue.
**Reason**: The SKILL.md is a router + invariant list; executing “by the book” without vendored references leaves gaps; no hard repo paths in the body but external skill/CLI names are prescriptive for cited workflows.
**Strip**: YAML frontmatter; long “Example Usage” time-estimate narratives; duplicate principle blocks if merging with other review skills; integration section if the target SOP forbids named vendor skills/CLIs — replace with neutral “formal report handoff” step.
**Notes**: Explicitly forbids skipping git/history on rationalizations; “always write report file” aligns with evidence-based SOPs; “When NOT to Use” narrows scope (greenfield/docs-only etc.).

## skills/context-fundamentals/SKILL.md
**Type**: Context engineering primer: components (system, tools, retrieval, history, outputs), attention/window mechanics, progressive disclosure, quality vs quantity, finite-resource framing, filesystem and hybrid loading patterns, budgeting/compaction triggers at high level.
**Portable**: Yes — conceptual only; examples are generic markdown/XML prompt structure and progressive doc loading; no required local paths or executables in the operative sections.
**Reason**: Self-contained prose; “Integration” lists related skill names as curriculum order, not runtime dependencies; references section is bibliography-style.
**Strip**: YAML frontmatter; trailing Skill Metadata (created/author/version); long fenced prompt example if slimming; soften or cite quantitative claims (e.g. observation token share) for policy-driven SOP packs.
**Notes**: Strong foundation slice for any “how to curate agent context” SOP; reinforces placement of critical info and explicit compaction thresholds (70–80%).

## skills/context-compression/SKILL.md
**Type**: Compression strategy guide: tokens-per-task objective; anchored iterative vs opaque vs regenerative; artifact-trail weakness; structured summary sections; trigger strategies; probe-based evaluation dimensions; three-phase research/plan/implement workflow for massive codebases.
**Portable**: Yes for the methodology in this file — no mandatory scripts or absolute paths; internal “Evaluation Framework Reference” is named but not required to apply the checklist/guidance here.
**Reason**: Procedures and tables are self-contained; citations (Factory Research, Netflix talk, etc.) are pointers for rigor, not blockers for using the structured-summary pattern.
**Strip**: YAML frontmatter; Skill Metadata footer; duplicate long debugging example if deduplicating; external URL list if air-gapped — keep probes/tables, drop links.
**Notes**: Complements degradation/optimization themes; explicitly recommends separate artifact tracking when file state is critical — useful cross-link to guardian-style pre-compaction discipline without naming one stack.

## skills/context-guardian/SKILL.md
**Type**: Pre-automatic-compaction integrity protocol (Portuguese/English mix): P0/P1/P2 extraction taxonomies, mental verification checklist, three-layer persistence (snapshot script, MEMORY.md, context-agent save), transition briefing template, post-compaction completeness checks.
**Portable**: No — embeds concrete Windows paths (`C:\Users\renat\...`), calls `context_snapshot.py` and `context_manager.py` from specific skill trees, and assumes Claude Code `.claude` MEMORY loading behavior.
**Reason**: Written as an operator runbook for one author’s environment; activation triggers and ecosystem diagram bind to `context-agent` and named tooling; brief English boilerplate sections don’t redeem path coupling.
**Strip**: YAML frontmatter; every hard-coded path — substitute `${SKILL_ROOT}`, org memory location, and generic “run your snapshot script”; trim mismatched generic Best Practices/Pitfalls; reconcile Portuguese UX with target language policy.
**Notes**: The abstract pattern (tiered criticality, redundancy, last-message briefing before compaction) is reusable after retargeting persistence; as checked in, it is not org-agnostic.

## skills/bdistill-behavioral-xray/SKILL.md
**Type**: Model behavioral evaluation workflow backed by the **bdistill** Python package and **bdistill-mcp**: 30 probes across six dimensions (tool_use, refusal, formatting, reasoning, persona, grounding) with tagged responses and a styled HTML report (radar charts, rates, examples).

**Portable**: **No** for faithful execution; **partial** as an abstract “probe dimensions + aggregate signals” checklist without the tooling.

**Reason**: Install/run contract is `pip install bdistill`, registering **bdistill-mcp**, and product-specific invocations (e.g. Claude Code `/xray`, `/xray-report`, or natural-language MCP prompts). The skill does not specify how to reproduce probes or reports without that stack.

**Strip**: YAML frontmatter; install/MCP/slash-command blocks; HTML/marketing feature list; cross-sell to `/distill --adversarial`; duplicate overview vs “How It Works” if condensing.

**Notes**: Clear fit for model comparison, refusal/compliance documentation, and drift tracking; explicitly positions the agent as probing itself (no third-party API key narrative). Companion to `bdistill-knowledge-extraction`.

## skills/bdistill-knowledge-extraction/SKILL.md
**Type**: Structured **domain knowledge extraction** via bdistill: in-session Q&A from subscription models or local **Ollama** runs, with optional adversarial validation, KB CLI (`list` / `search` / `export`), and optional tabular schema generation for classical ML.

**Portable**: **No** as an end-to-end procedure; **partial** as “structured Q&A corpus + quality score + export” pattern if reimplemented by hand.

**Reason**: Hard dependency on bdistill install, MCP or `/distill` UX, and `bdistill kb` / `bdistill extract` commands; Ollama flow is specified with concrete model example. JSONL schema is illustrative, not a standalone SOP.

**Strip**: YAML frontmatter; install and command transcripts; long JSON example; “Security & Safety Notes” if redundant with org policy; tabular `/schema` block if out of scope for target SOP pack.

**Notes**: Explicitly distinguishes reference JSONL from LLM training dumps; adversarial mode is a portable *idea* (challenge claims → validated flag). Pairs with behavioral-xray for “knowledge vs behavior” profiling.

## skills/postmortem-writing/SKILL.md
**Type**: Blameless **postmortem** methodology: triggers, timelines, root-cause framing (including 5 Whys), multiple markdown templates (full, 5 Whys-only, quick), facilitation agenda, anti-patterns, external SRE/industry links; optional depth in `resources/implementation-playbook.md`.

**Portable**: **Yes** — tool-agnostic prose and templates; no mandatory vendor CLI in the body.

**Reason**: Core content is self-contained operational writing guidance. The only structural dependency is the optional playbook pointer for “detailed examples”; everything else is inline.

**Strip**: YAML frontmatter; redundant opening tagline; generic four-line “Instructions” block shared with sibling skills; enormous worked example templates if replacing with org-specific blanks; stale illustrative dates/names in samples.

**Notes**: Frontmatter marks `risk: unknown`; very long inline templates duplicate material a dedicated runbook might own — candidate to externalize once per org. Composes with on-call/incident skills thematically.

## skills/on-call-handoff-patterns/SKILL.md
**Type**: **On-call handoff** SOP: handoff components and recommended overlap timing; templates for shift handoff doc, async quick handoff, and mid-incident handoff; sync meeting agenda; pre/during/post-shift checklists; escalation triggers; external links.

**Portable**: **Yes** — generic operations content (kubectl/redis examples are illustrative, not contractually required).

**Reason**: Same thin “open playbook for detailed examples” pattern as other community skills, but the SKILL body already includes full templates and checklists, so it stands alone without extra files.

**Strip**: YAML frontmatter; generic “Instructions” boilerplate; emoji section headers in templates if target style forbids; fictional @handles, dates, and ticket IDs when institutionalizing; tool-specific “Quick Reference” shell blocks if your stack differs.

**Notes**: Strong overlap with incident/postmortem narratives in sample text; useful as a single artifact for continuity across rotations. `risk: unknown` in frontmatter like postmortem-writing.

## skills/context-window-management/SKILL.md
**Type**: Context-window and context-engineering playbook: finite-context framing, tiered strategies, serial-position and “lost in the middle” awareness, summarization vs retrieval, and anti-patterns (naive truncation, ignoring token cost, one-size-fits-all).

**Portable**: Yes — mostly vendor-agnostic heuristics and pattern names; no required local tools or repo layout in the body.

**Reason**: Content is conceptual “how to curate context” plus capability tags; related skills are name-only pointers, not hard dependencies.

**Strip**: YAML frontmatter and source/vibeship attribution line; broken/truncated sentence fragment after the opening persona (“Your cor”); generic closing “When to Use” line; optional trim of duplicate overview (title + repeated blurb).

**Notes**: Lightweight compared to `context-manager` / `memory-systems`; good as a short philosophy + pitfall list for an SOP pack. Provenance: vibeship-spawner-skills (Apache 2.0).

## skills/context-manager/SKILL.md
**Type**: Broad “elite context engineering specialist” persona: dynamic context assembly, vector DBs/embeddings, knowledge graphs, layered memory, RAG, enterprise integration, multi-agent coordination, tool-aware context, and a numbered response approach; defers detail to `resources/implementation-playbook.md`.

**Portable**: Partial — the *outline* (clarify goals → apply practices → verify; optional playbook) generalizes; the long capability encyclopedia is not drop-in without trimming or the resource file.

**Reason**: Executable depth is explicitly offloaded to a sibling `implementation-playbook.md`; body is mostly taxonomy and behavioral traits plus vendor/product examples (Pinecone, Weaviate, SharePoint, etc.).

**Strip**: YAML frontmatter; redundant “Use / Do not use” header if merging into one gate section; collapse duplicate expert intro blocks; vendor lists and ten-step “Response Approach” if slimming to a neutral SOP; fix/stage the playbook pointer for your bundle.

**Notes**: Overlaps conceptually with `memory-systems` and RAG-oriented skills — risk of redundancy unless roles are separated (strategy vs architecture vs tooling).

## skills/memory-systems/SKILL.md
**Type**: Memory system design reference: context–memory spectrum, limits of pure vector stores, graph/temporal graph rationale, layered architecture (working through temporal KG), implementation patterns (filesystem, vector+RAG, KG, temporal KG), retrieval/consolidation guidance, illustrative Python, DMR benchmark table, integration pointers.

**Portable**: Yes for methodology — patterns and selection guidance stand without a specific product; code and benchmark figures are illustrative and may need refresh.

**Reason**: Self-contained narrative + practical guidance; external links are optional references, not runtime prerequisites; `risk: safe` with cited upstream repo.

**Strip**: YAML frontmatter; duplicated “When to Use” sections; skill metadata footer if consolidating; benchmark numbers/table caption if you need strict currency; swap Python snippets for target language if not illustrative-only.

**Notes**: Strong candidate to cannibalize into a portable “memory architecture” SOP; pairs with context-window/skills about loading strategy.

## skills/agent-memory-mcp/SKILL.md
**Type**: Deployment/runbook for a Node.js MCP memory service: clone `agentMemory`, `npm install` / `compile`, `start-server <project_id> <workspace>`, documented tools (`memory_search`, `memory_write`, `memory_read`, `memory_stats`), optional dashboard on port 3333.

**Portable**: No as a procedure — portability requires running (or reimplementing) that MCP server and tool surface.

**Reason**: Hard dependency on external GitHub project, Node 18+, npm lifecycle, and absolute workspace paths; the skill *is* the integration contract for those tools.

**Strip**: YAML frontmatter; exact clone path (`.agent/skills/...`) if your layout differs; localhost/dashboard details if forbidden; replace community attribution if mirroring internally.

**Notes**: Composes with orchestration skills that assume `memory_*` MCP tools; not a substitute for abstract memory-design content in `memory-systems`.

## skills/audit-context-building/SKILL.md
**Type**: Pre-audit cognitive SOP for ultra-granular, line-by-line context building: phases (orientation → micro function analysis → global system model), First Principles / 5 Whys / 5 Hows, cross-boundary call rules, anti-hallucination anchors, explicit non-goals (no vulns, fixes, or severity).

**Portable**: Partial — reasoning flow, rationalizations table, and output section requirements are portable as prose; full execution assumes sibling files (`OUTPUT_REQUIREMENTS.md`, `FUNCTION_MICRO_ANALYSIS_EXAMPLE.md`, `COMPLETENESS_CHECKLIST.md`) and an optional `function-analyzer` subagent.

**Reason**: Most methodology lives in SKILL.md, but completeness thresholds, example depth, and checklist enforcement are delegated to companion markdown; examples skew smart-contract / external-call language but generalize to other codebases.

**Strip**: YAML frontmatter; calls to function-analyzer and local reference filenames unless vendored; duplicate “When to Use” / phase titles if consolidating; Claude-branded “how Claude thinks” phrasing if neutralizing for other agents.

**Notes**: Pure context-building phase only — pairs with separate vulnerability-hunting and reporting skills; continuity rule (never reset context across calls) is high-signal for audit SOPs.

## skills/audit-skills/SKILL.md
**Type**: Cross-platform static security review playbook for AI skills/bundles: privilege/metadata tampering, locking/DoS, script execution surfaces, dangerous installs, mobile (adb/iOS) patterns, exfil, process/service abuse, obfuscation/persistence, legitimacy heuristics, and a scored report step.

**Portable**: Yes — pattern catalogs and “do not execute” constraints are tool- and repo-agnostic; no mandatory local paths in the operative sections.

**Reason**: Self-contained procedural markdown; platform examples are illustrative checklists; related `@security-scanner` is optional cross-reference only.

**Strip**: YAML frontmatter; HTML `<!-- security-allowlist: curl-pipe-bash -->` (governance-sensitive); marketing subtitle (“Premium Universal Security”); redundant overview sentences; trim related-skill line if slimming the pack.

**Notes**: Emphasizes non-intrusive analysis — appropriate for policy SOPs; 2–4 sentence overview length guidance is oddly specific for a security skill but harmless.

## skills/agentic-actions-auditor/SKILL.md
**Type**: GitHub Actions–focused static methodology for repos using AI agent steps: workflow discovery (local Glob vs remote `gh api`), AI `uses:` identification, depth-1 cross-file resolution, capture of triggers/env/permissions/`with:` fields, attack vectors A–I, and structured findings reports (severity, data flow, remediation).

**Portable**: Partial — loop and reporting shape generalize; concrete heuristics and action-specific fields live under `{baseDir}/references/*.md` (foundations, vectors, cross-file-resolution, action-profiles).

**Reason**: SKILL.md is the spine but repeatedly defers normative detection rules and remediation details to reference files; remote mode is tightly coupled to `gh api` patterns.

**Strip**: YAML frontmatter; long embedded `gh api` samples if replacing with org fetch tooling; `{baseDir}/references/...` pointers unless those files are bundled or summarized inline; GitHub-only scope is already explicit for non-Actions CI.

**Notes**: Strong “rationalizations to reject” and bash-safety rules (YAML as data, never pipe to interpreters); vectors H/I documented as amplifiers, not standalone injection paths.

## skills/clarity-gate/SKILL.md
**Type**: Pre-ingestion / epistemic-quality skill for RAG: nine semantic verification points, CGD (`.cgd.md`) output contract, validation codes (E-*/W-*), SOT table rules, exclusion blocks, tiered verification hierarchy, and optional use of bundled `scripts/claim_id.py` and `scripts/document_hash.py`.

**Portable**: Partial — checklist and report templates travel well; normative structure, hashing/canonicalization, and machine checks require `docs/CLARITY_GATE_FORMAT_SPEC.md` (and scripts for deterministic IDs/hashes).

**Reason**: Large spec embedded by reference rather than fully inlined; frontmatter ties to agentskills.io metadata, version, repository URL; behavioral truth remains “form not truth” with mandatory HITL.

**Strip**: Verbose YAML frontmatter (`triggers`, `capabilities`, `outputs`); changelog and related-projects blocks for a minimal SOP; duplicate validation-code tables if one canonical table suffices.

**Notes**: States critical limitation: passing clarity does not prove factual accuracy; documents exclusion blocks as non–RAG-ingestable; fence-aware hashing / Quine protection live in spec/script layer more than SKILL body.

## skills/conductor-setup/SKILL.md
**Type**: Rails project bootstrap for **Conductor** (parallel agent workspaces): `conductor.json`, `bin/conductor-setup`, `script/server`, and Redis URL wiring across Sidekiq, Action Cable, cache, and Rack::Attack.

**Portable**: **No** — assumes Rails, `bundle`/`npm`, `bin/dev`, Vite Ruby port math, and Conductor-specific env vars (`CONDUCTOR_ROOT_PATH`, `CONDUCTOR_PORT`, `CONDUCTOR_WORKSPACE_NAME`).

**Reason**: Executable contract is filesystem edits plus executable shell scripts; behavior is tightly coupled to a Mac Conductor app workflow and typical Rails/redis layouts, not a generic agent SOP.

**Strip**: YAML frontmatter (`allowed-tools`, `context: fork`, community metadata); duplicate “don’t overwrite” notes if merging with org onboarding; stack-specific initializer paths can be replaced with a shorter “ensure `REDIS_URL` everywhere” checklist.

**Notes**: Strong as a **reference implementation** for per-workspace Redis DB isolation and symlinked secrets from a canonical root; reuse ideas only after retargeting away from Conductor env naming and `script/server` conventions.

## skills/conductor-implement/SKILL.md
**Type**: **Implement-track** runbook: preflight on `conductor/{product,workflow,tracks}.md`, track selection, loading `spec.md`/`plan.md`/`metadata.json`, TDD red/green/refactor loop, per-task git commits, phase verification gates with mandatory user approval, completion and archive flows.

**Portable**: **Partial** — task loops, checkpoint discipline, and markdown checkbox conventions generalize; file paths, `conductor:` slash-commands, and JSON metadata schema do not.

**Reason**: Self-contained procedure in one file but binds to the Conductor tree and conventions throughout; deep examples reference `resources/implementation-playbook.md` only by pointer.

**Strip**: YAML frontmatter; sample menus and long `metadata.json` example if slimming; `/conductor:*` UX strings — replace with your orchestrator’s primitives; reconcile test runner examples (`npm test`/`pytest`) with the repo’s actual verifier.

**Notes**: High-signal rules: never skip phase verification, halt on tool/test/git failure, keep `plan.md` and `metadata.json` in sync; overlaps heavily with **context-driven-development** and other Conductor skills as the “execution engine.”

## skills/conductor-manage/SKILL.md
**Type**: **Track lifecycle** operations — archive, restore, delete, rename, list status, clean orphaned artifacts; safety preambles and confirmation for destructive work.

**Portable**: **Partial** — governance pattern (verify structure, confirm deletes, keep `tracks.md` consistent) is generic; concrete modes and prompts defer to `resources/implementation-playbook.md`.

**Reason**: Short router skill; executable detail is intentionally **out of band** unless that resource is vendored alongside the SOP.

**Strip**: YAML frontmatter; generic “Instructions” bullet list shared with sibling skills; ensure the playbook path exists or inline the modes you actually support.

**Notes**: Pairs with **conductor-implement** and **conductor-validator** as the “housekeeping” layer; thin without the companion playbook file.

## skills/conductor-validator/SKILL.md
**Type**: Intended **Conductor artifact validation** (directory/file presence) plus **pattern reference** for track/task IDs and checkbox markers in `tracks.md` / `plan.md`.

**Portable**: **Partial** — the status-marker and track-ID regex sections are reusable prose; the leading shell block is not a portable SOP as written.

**Reason**: Document structure is **broken/incomplete**: body starts with `ls` commands and a stray closing fence (```) without a matching opening code block), and “Use this skill when” text is generic boilerplate misaligned with the actual topic.

**Strip**: YAML frontmatter; repair or remove the orphan fence and leading `ls` block (replace with explicit ordered checks or neutral “verify these paths exist”); fix duplicated generic When/Instructions to match validator scope.

**Notes**: Useful extraction target: a small “Conductor filesystem checklist + marker conventions” table once the markdown is corrected; until then treat as **needs editorial fix** before treating as authoritative.

## skills/autonomous-agent-patterns/SKILL.md
**Type**: Design-pattern reference for autonomous coding agents: agent loop (think/decide/act/observe), multi-model routing, tool schemas, essential tool catalog, edit-by-search-replace, permission levels and approval UI, sandboxed execution, browser/Playwright patterns, visual agent, context injection (@-style), checkpoints, MCP server sketch.

**Portable**: Partial — behavioral and structural guidance is tool-agnostic; long Python blocks are illustrative pseudocode, not a single runnable stack (LLM API shapes, `mcp` imports, Playwright lifecycle vary by product).

**Reason**: No mandatory repo layout or CLI; inspired by Cline/Codex with optional external links. Portability drops where implementers must map samples to their real SDKs, UI layer, and MCP wiring.

**Strip**: YAML frontmatter; emoji/branding in title; dated example model IDs; duplicate intro (blockquote repeats description); full code fences if condensing to SOP bullets; checklist/footer if redundant with org policy.

**Notes**: High-signal for tool granularity, permission gating, and safe edit patterns; best treated as a pattern library rather than a drop-in runtime spec.

## skills/multi-agent-patterns/SKILL.md
**Type**: Multi-agent architecture primer: context bottleneck and token-economics framing, supervisor vs swarm vs hierarchical patterns, context-isolation mechanisms, consensus/debate/sycophancy triggers, framework comparison at a glance, failure modes and mitigations, short examples.

**Portable**: Yes for methodology — prose and diagrams stand alone; LangGraph/AutoGen/CrewAI are cited as illustrations; embedded Python is generic pattern (e.g. `forward_message`, `transfer_to_agent_b`).

**Reason**: Self-contained narrative with actionable guidelines; no required paths or vendored executables in the body.

**Strip**: YAML frontmatter; trailing Skill Metadata footer (dates/author/version may drift); token-multiplier and evaluation claims if your pack requires sourced numbers only; long external link list if air-gapped.

**Notes**: Core thesis — sub-agents primarily for context isolation, not org-chart roleplay — transfers cleanly; “telephone game” + direct forward-to-user mitigation is especially reusable.

## skills/behavioral-modes/SKILL.md
**Type**: Adaptive operating-mode rubric: BRAINSTORM, IMPLEMENT, DEBUG, REVIEW, TEACH, SHIP with behaviors, output templates, trigger table; add-on sections for EXPLORE, PLAN-EXECUTE-CRITIC, mental-model sync.

**Portable**: Yes for mode definitions and triggers; IMPLEMENT mode hard-references an external `clean-code` skill, which weakens standalone portability unless you substitute local standards.

**Reason**: No filesystem or vendor API contract; slash-command examples are conventions, not enforced hooks.

**Strip**: YAML frontmatter; emoji-heavy headers and boilerplate “NOT” tutorial examples if tone must be neutral; dependency on `clean-code` — replace with org coding standard; thin tail (“When to Use” one-liner) if deduplicating.

**Notes**: Good as a response-style policy matrix; multi-agent subsection reads like a later bolt-on — merge or trim for a single coherent SOP index.

## skills/bdi-mental-states/SKILL.md
**Type**: Formal BDI / RDF-oriented skill: beliefs-desires-intentions ontology patterns in Turtle, T2B2T (triples↔beliefs), temporal validity, justification chains, SPARQL competency questions, LAG sketch, SEMAS-style rules, anti-patterns; points to `references/` for deep docs.

**Portable**: Partial — conceptual BDI and explainability guidance generalizes; faithful execution assumes RDF/OWL/SPARQL tooling and bundled reference markdown not present in generic agent repos.

**Reason**: Heavy reliance on sibling files (`bdi-ontology-core.md`, `rdf-examples.md`, etc.); Python/Prolog fragments are illustrative glue, not a complete runtime.

**Strip**: YAML frontmatter; long Turtle/SPARQL if the target SOP is non-semantic; bibliography and `references/` pointers unless vendored; C4/ArchiMate table if scope is code-only.

**Notes**: Niche for neuro-symbolic, audit-trail, or multi-agent belief-sharing designs; low overlap with everyday coding-agent strips unless the product explicitly models mental state in RDF.

## skills/00-andruia-consultant/SKILL.md
**Type**: Onboarding and solutions-architecture diagnostic skill — mandatory Spanish for all communication and generated artifacts; bifurcates empty workspace (“Pure Engine” interview) vs existing code (“Evolution” technical scan + prescription); maps a 3–5 expert squad and materializes `tareas.md` and `plan_implementacion.md`.
**Portable**: Partial — the greenfield/brownfield fork, artifact list, and “no mixing prior projects” rule generalize; Andru.ia persona, Spanish-only mandate, diamond-standard branding, and @-expert squad naming assume a parallel skill registry and org tone.
**Reason**: No CLIs or absolute paths in the body; procedure is self-contained markdown. Dependency is conceptual (consult “registro raíz”, propose experts) rather than a named bundled executable.
**Strip**: YAML frontmatter; emoji/marketing headings; thin generic “When to Use” if folded into an SOP index; reconcile language policy when the target pack is not Spanish-first.
**Notes**: Strong reusable skeleton for first-session diagnosis and roadmap files; “Estándar de Diamante” is a quality bar label to neutralize or define in the target org.

## skills/10-andruia-skill-smith/SKILL.md
**Type**: Skill-forge / authoring workflow — three phases (skill DNA interview, generate README + registry snippet, deploy folder and update master registry); mandates Spanish instructions for new skills, expert role definition, and numeric folder prefixes.
**Portable**: No as written — deployment assumes a specific host tree (`D:\...\antigravity-awesome-skills\skills\`) and a “Full skill registry” table; Antigravity anatomy (README-centric wording) may not match SKILL.md–first layouts elsewhere.
**Reason**: Hard-coded Windows path and explicit monorepo integration steps bind the runbook to one repo layout; numbering and registry editing are operational, not abstract methodology.
**Strip**: YAML frontmatter; the `D:\...` path block; emoji section titles; README vs SKILL structural claims — align with your target skill standard (e.g. SKILL.md + optional resources only).
**Notes**: Portable *ideas*: few-shot / chain-of-thought in skill bodies, expert non-genericism, correlating folder order; the file is primarily an internal factory for one skills repo.

## skills/agent-evaluation/SKILL.md
**Type**: Agent evaluation primer — persona + capability/requirement tags; patterns (statistical/multi-run evaluation, behavioral contract testing, adversarial probing); anti-patterns; sharp-edges table with severities; related skill names.
**Portable**: Yes — conceptual QA methodology with no required local paths, scripts, or MCP tools in the body; illustrative lists only.
**Reason**: Self-contained procedural and tabular content; upstream `vibeship-spawner-skills` / Apache 2.0 note in frontmatter; content is tool-agnostic though benchmarks vs production is the central theme.
**Strip**: YAML frontmatter (`risk: unknown`, source line); repair the **truncated** narrative (sentence cuts off after “100% test pass rate—it”); generic closing “When to Use” line; optional trim of duplicate tag-style lists if merging with an org taxonomy.
**Notes**: Incomplete source text reduces trust until fixed; pairs with orchestration/testing skills as philosophy, not a runnable harness.

## skills/progressive-estimation/SKILL.md
**Type**: Project estimation methodology — hybrid human/agent modes, task classification, research-backed multipliers, PERT, confidence bands (P50/P75/P90), calibration feedback, batch vs single-task examples, integrations named for Linear/JIRA/GitHub/etc.
**Portable**: Partial — narrative steps and pitfalls transfer; `tools: claude` in frontmatter and example prompts anchor mentally to one assistant family; full formulas and “instant mode” may live primarily in the linked upstream repo.
**Reason**: Points to GitHub (`Enreign/progressive-estimation`) for installation, research, and references — the SKILL.md reads as overview + usage guide, not a self-contained math spec.
**Strip**: YAML frontmatter (tags, tools, author block); related `@sprint-planning` / `@project-management` lines if those skills are absent; long example block if slimming; keep or mirror external links per air-gap policy.
**Notes**: `category: project-management`, `risk: safe`; strong complement to sprint-planning SOPs if you vendor the upstream implementation or restate formulas inline.

## skills/tdd-orchestrator/SKILL.md
**Type**: TDD orchestration methodology—red-green-refactor discipline, multi-agent test workflow coordination, metrics, pyramid/property-based/legacy patterns, and long “capabilities / behavioral traits / knowledge base” lists; thin generic instructions plus pointer to `resources/implementation-playbook.md`.

**Portable**: Partial—the abstract TDD cycle and governance ideas generalize; the file is mostly encyclopedic persona/taxonomy without vendored playbook detail.

**Reason**: Self-contained prose but executable depth is optional sibling `resources/implementation-playbook.md`; no repo CLI contract—overlap with generic TDD knowledge unless the playbook is shipped.

**Strip**: YAML frontmatter; generic “Use / Do not use / Instructions” filler shared with thin skills; collapse duplicate expert intro; long trait/knowledge sections if slimming to an SOP; stage/fix the playbook pointer for target bundles.

**Notes**: `risk: unknown`; best treated as an index + tone setter—useful after heavy editing or with bundled `implementation-playbook.md`.

## skills/systematic-debugging/SKILL.md
**Type**: Hard behavioral debugging SOP—iron law (no fixes before Phase 1), four phases (root cause investigation, pattern analysis, hypothesis testing, implementation), multi-layer instrumentation guidance, red flags, rationalization table, quick reference; points to sibling `root-cause-tracing.md` and related markdown in-directory.

**Portable**: Partial—phase flow, tables, and evidence-first rules are universal; bash/CI examples and cross-skill names tie to a specific ecosystem.

**Reason**: Core methodology is in-body; faithfulness drops if co-packaged files (`root-cause-tracing.md`, etc.) are missing; Phase 4 cites `superpowers:test-driven-development` / verification skill as optional but named dependencies.

**Strip**: YAML frontmatter; long workflow signing/bash sample if out of scope; replace `superpowers:*` pointers with neutral “write failing test / verify fix” steps; tune “your human partner” phrasing for policy tone.

**Notes**: High-signal for quality gates—pairs with verification-before-completion; explicit stop after repeated failed fixes and architectural escalation is rare and valuable in skill packs.

## skills/agents-md/SKILL.md
**Type**: Agent-facing documentation spec for `AGENTS.md` (and `CLAUDE.md` via symlink)—line budget, pre-write repo discovery checklist, writing rules, required/optional sections, anti-patterns, example skeleton.

**Portable**: Yes—procedural and stylistic; only assumptions are Unix `ln -s` and typical repo artifacts (lockfiles, CI, monorepo markers).

**Reason**: No MCP, agent runtime paths, or mandatory external tools; commands are templates (e.g. pnpm) to be replaced per project.

**Strip**: YAML frontmatter; duplicate template blocks in “Required” vs “Example”; align 60/100 line caps and Co-Authored-By example with org policy.

**Notes**: Maps directly to a concise “how we document for agents” SOP—strong overlap with minimal-doc philosophy used elsewhere in the audit set.

## skills/skill-creator/SKILL.md
**Type**: Meta skill—interactive multi-phase workflow to scaffold CLI skills (brainstorm, optional prompt-engineer, template-driven file generation, validation scripts, global/repo symlink install) for Copilot/Claude/Codex directory layouts.

**Portable**: No as a runbook—requires `resources/templates/*`, `scripts/validate-skill-*.sh`, and conventional paths (`.github/skills`, `.claude/skills`, `~/.copilot/skills`, etc.).

**Reason**: Body is largely bash (`sed`, `mkdir`, `ln -sf`), platform detection, and progress UI; standalone mode is explicitly degraded without `cli-ai-skills` repo shape; references include placeholder URLs.

**Strip**: YAML frontmatter; decorative progress ASCII; hard-coded platform matrix—replace with org’s single install root; sed one-liners and template filenames unless the full pack is vendored; placeholder GitHub links in References.

**Notes**: `category: meta`, `risk: safe`; extractable *ideas* (word-count limits, progressive disclosure, validation before install) without copying the procedural shell.

## .claude-plugin/plugin.json
**Type**: Config — Claude Code plugin manifest (npm-style package metadata: `name`, `version`, `description`, `author`, `homepage`, `repository`, `license`, `keywords`).
**Portable**: No — meaningful only where Claude Code (or a compatible loader) consumes `.claude-plugin/plugin.json`; not a tool-agnostic procedure.
**Reason**: Declares distribution identity for *antigravity-awesome-skills* (v9.0.0 in tree; `description` claims a supported-skill count that will drift with catalog changes). Contains no operational steps, triggers, or evidence contracts suitable for SOP extraction — it is install/discovery metadata, not operator guidance.
**Strip**: N/A for SOP strips — omit from role-to-SOP corpora unless documenting provenance of a vendored plugin bundle; if kept for audit trail, sync `version`/description with the repo you actually ship.
**Notes**: Structurally minimal and valid for a marketplace listing; pairs with sibling manifests (e.g. `marketplace.json`) for full plugin story; assess security/typosquatting at install time via `repository`/`homepage`, not via this file alone.
## skills/conductor-new-track/SKILL.md
**Type**: Conductor workflow — interactive specification gathering (one question per turn, max six), track typing (feature/bug/chore/refactor), track ID format and uniqueness checks, then writes `spec.md`, phased `plan.md`, `metadata.json`, `index.md`, and registers the track in `conductor/tracks.md` and `conductor/index.md`.

**Portable**: Partial — the staged interview, acceptance-criteria discipline, and phased plan skeleton generalize; the filesystem contract does not.

**Reason**: Hard-coupled to the `conductor/` tree (`product.md`, `tech-stack.md`, `workflow.md`, `tracks.md`), `/conductor:setup` preflight, and slash-command next steps (`/conductor:implement`, `/conductor:status`). Defers depth to `resources/implementation-playbook.md`.

**Strip**: YAML frontmatter; generic Use/Do-not-use/Instructions bullets shared with sibling skills; long inline templates for spec/plan/metadata; Conductor-specific paths and command strings — replace with your orchestration naming.

**Notes**: Complements **conductor-implement** as the track-creation entry point; error handling requires atomic directory creation and partial cleanup on write failure.

## skills/conductor-status/SKILL.md
**Type**: Read-only status dashboard — aggregates `conductor/product.md`, `conductor/tracks.md`, and per-track `plan.md` / `metadata.json` / `spec.md` into full project view, optional single-track view, `--quick`, and `--json`; includes task-count regexes, phase detection, progress-bar math, and blocker heuristics.

**Portable**: Partial — checkbox semantics (`[x]`/`[~]`/`[ ]`), task counting, and “current phase” logic are reusable prose; the file paths and command footers are not.

**Reason**: Assumes Conductor initialization and the same track directory layout as other conductor skills; git-history section implies commits are findable via messages containing `{trackId}`.

**Strip**: YAML frontmatter; generic boilerplate sections; enormous ASCII mock outputs if slimming; hard-coded `/conductor:*` command lines — neutralize for your UX.

**Notes**: Documents explicit counting rules (`/^- \[x\] Task/` etc.); distinguishes no-tracks vs not-initialized error states.

## skills/conductor-revert/SKILL.md
**Type**: Git-aware revert by logical unit — parses targets (`trackId`, `trackId:phaseN`, `trackId:taskX.Y`), discovers commits via `git log --grep` (and path-scoped log for track dirs), shows execution plan, runs sequential `git revert --no-edit`, updates `plan.md` checkboxes and `metadata.json`, and adjusts `tracks.md` for full-track reversions.

**Portable**: Partial — “show plan, require YES, revert-only-no-reset, halt on conflict” safety model is widely reusable; commit discovery and conductor artifacts are not.

**Reason**: Depends on Conductor `plan.md` structure, `tracks.md`, `metadata.json`, and consistent commit-message conventions so grep-based discovery works; examples embedded shell (`grep -E`).

**Strip**: YAML frontmatter; generic boilerplate; long UI transcripts; “undo the revert” appendix that mentions `git reset --soft` / `checkout` — reconcile with the skill’s strict anti-reset tone for your policy doc.

**Notes**: Requires literal `YES` (not `y`/Enter); explicitly forbids `git reset --hard`, force-push, and auto-merge on revert conflicts; calls out pushed-remote case (new revert commits, no force).



## skills/planning-with-files/SKILL.md

**Type**: Persistent planning pattern - project-local task_plan.md, findings.md, progress.md as durable working memory; 2-action rule for multimodal and browser output; 3-strike error protocol; read-write matrix; references bundled templates, scripts, reference.md, examples.md.

**Portable**: Yes - core pattern (volatile context vs disk) and rules are agent-agnostic; templates and scripts are optional.

**Reason**: No mandatory repo layout beyond the active project directory; coupling is CLAUDE_PLUGIN_ROOT for bundled templates and tool-named anti-patterns.

**Strip**: YAML frontmatter; CLAUDE_PLUGIN_ROOT wording; generalize do-not-rely-only-on-in-session-lists; trim template pointers if not vendoring siblings.

**Notes**: Planning files belong in the project root, not the skill install folder; earlier audit entry exists - merge or dedupe when consolidating corpora.
