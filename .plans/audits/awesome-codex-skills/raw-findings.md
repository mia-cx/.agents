
## skills/create-plan/SKILL.md
**Type**: skill
**Portable**: yes
**Reason**: The entire procedure (read-only context scan → minimal clarifying questions → structured plan output) is language-, stack-, and org-agnostic; JS-ecosystem path hints (`src/`, `npm test`) appear only as optional examples, not requirements.
**Trigger**: When a user explicitly asks for a plan related to a coding or implementation task.
**Steps/contract**:
1. Scan context read-only — README, docs/, CONTRIBUTING.md, ARCHITECTURE.md, most-likely-touched files; identify constraints (language, frameworks, CI commands).
2. Ask at most 1–2 blocking questions only if planning is impossible without the answer; prefer multiple-choice; otherwise assume and proceed.
3. Output a plan matching the exact template: 1–3 sentence intent paragraph → `## Scope` (In / Out bullet lists) → `## Action items` checklist (6–10 items, verb-first, atomic, ordered discovery→changes→tests→rollout) → `## Open questions` (max 3).
4. No meta-commentary before or around the plan — output the plan directly.
**Strip**: `npm test` example command; `src/…`, `app/…`, `services/…` path hints (JS-ecosystem flavoring in the checklist guidance section).
**Structure/format**: Prescriptive markdown plan template is the standout pattern — strict section order, capped checklist length, phase-ordered items (discovery→changes→tests→rollout), and an explicit "Avoid" list as a negative quality bar. "Read-only mode throughout" is a clearly stated invariant.
**Notes**: Unusually lean and well-specified for a planning skill. The cap on follow-up questions (≤2, blocking only) prevents the common failure mode of over-interviewing before acting. The phase ordering of checklist items (discovery → changes → tests → rollout) is a reusable heuristic worth carrying into any plan-generation SOP.

## skills/mcp-builder/SKILL.md
**Type**: skill
**Portable**: partial
**Reason**: The agent-centric design principles, API research methodology, code-quality checklist, and evaluation framework are fully stack-agnostic, but Phase 2 implementation steps are tightly coupled to Python/FastMCP (Pydantic, `@mcp.tool`) and Node/TypeScript (Zod, `server.registerTool`, `tsconfig.json`) specifics.
**Trigger**: When building an MCP server to expose an external API or service to LLMs, in any language.
**Steps/contract**: Four ordered phases — (1) Research & planning: study MCP protocol docs, fetch API docs exhaustively, design agent-centric tools and I/O contracts; (2) Implementation: set up project, build shared utilities first, implement tools systematically with schemas/docstrings/annotations; (3) Review & refine: DRY/composability/type-safety/documentation checklist, safe build/test patterns (never run server directly in main process); (4) Evaluations: create 10 independent, read-only, complex, verifiable QA pairs in structured XML format.
**Strip**: Python-specific tooling (Pydantic v2, FastMCP, `@mcp.tool`, `python -m py_compile`); TypeScript-specific tooling (Zod, `tsconfig.json`, `npm run build`, `dist/index.js`); all `./reference/*.md` local file links; versioned SDK fetch URLs (`raw.githubusercontent.com/…/README.md`); the concrete XML evaluation example with an Anthropic-branded question about "ASL-X" safety designations.
**Structure/format**: Heavy use of emoji-prefixed section headers for phase navigation; inline links to companion reference files; explicit "load this doc before proceeding" gating pattern that delays context loading until the relevant phase; quality checklist deferred to language guides rather than inlined; four-phase flow (research → implement → review → evaluate) with numbered sub-steps inside each phase.
**Notes**: The agent-centric design principles block (Phase 1.1) is independently extractable as a high-value reusable SOP fragment applicable to any tool-building or API-wrapper task, not just MCP. The evaluation framework (Phase 4) is also cleanly separable and reusable for any tool-server quality-gate pattern. The "safe testing" warning about stdio-blocking processes is a useful invariant worth preserving in any MCP SOP.

## skills/skill-creator/SKILL.md
**Type**: sop
**Portable**: partial
**Reason**: The 6-step creation workflow, progressive-disclosure design principle, and file-organisation taxonomy are fully agnostic, but the scaffold scripts (`init_skill.py`, `package_skill.py`) and `.skill` packaging format are Codex-platform-specific, and "Codex" is used throughout as the named agent.
**Trigger**: When an agent needs to create a new skill (or substantially revise an existing one) for any agent platform — covers scoping, resource planning, file layout, SKILL.md authoring, validation, and iteration.
**Steps/contract**: (1) Understand skill with concrete examples → (2) Plan reusable contents (scripts / references / assets) → (3) Initialise skill directory → (4) Edit SKILL.md + implement resources → (5) Validate & package → (6) Iterate on real usage. Invariants: SKILL.md body ≤ 500 lines; description frontmatter is the sole trigger mechanism; only essential files — no READMEs, changelogs, or auxiliary docs; scripts must be tested before shipping.
**Strip**: All "Codex" branding (replace with "the agent" / "the model"); `init_skill.py` / `package_skill.py` / `quick_validate.py` script references and their usage examples; `.skill` zip-packaging format and distribution instructions; internal companion doc references (`references/workflows.md`, `references/output-patterns.md`).
**Structure/format**: Three-level progressive-disclosure loading model (metadata → SKILL.md body → bundled resources) is the key structural insight worth preserving. Anatomy diagram (YAML frontmatter + markdown body + optional scripts/references/assets dirs) is clean and reusable. Degrees-of-freedom spectrum (high/medium/low freedom → text/pseudocode/script) is a strong heuristic worth extracting. Naming conventions section (hyphen-case, ≤64 chars, verb-led, tool-namespaced) is self-contained and portable.
**Notes**: The "context window is a public good" framing and the prohibition on auxiliary docs (README, CHANGELOG, etc.) inside skill packages are particularly high-signal policies worth lifting verbatim. The "only add context the model doesn't already have" principle is a useful quality gate for any skill authoring SOP.

## skills/gh-address-comments/SKILL.md
**Type**: skill
**Portable**: partial
**Reason**: The three-step review-comment triage loop (fetch → enumerate & confirm → apply) is platform-agnostic, but the tooling is GitHub-specific (`gh` CLI / GitHub GraphQL) and two phrases are hardwired to the Codex sandbox runtime.
**Trigger**: When an agent has an open GitHub PR and needs to systematically surface, triage, and apply fixes for review or issue comments on that PR.
**Steps/contract**: (1) Auth gate — verify `gh auth status` before proceeding, prompt re-auth if needed; (2) Fetch all conversation comments, review submissions, and inline review threads via the companion script; (3) Number every thread and present a one-line summary of the required fix to the user; (4) Receive user selection; (5) Apply fixes only for selected items.
**Strip**: `sandbox_permissions=require_escalated` and the `include workflow/repo scopes` / `rerun with sandbox_permissions` clauses — these are Codex platform internals with no meaning outside that runtime.
**Structure/format**: Flat prereq block → numbered phase headers → inline notes section; companion Python script (`scripts/fetch_comments.py`) handles all data retrieval, keeping SKILL.md free of API detail — a clean separation worth preserving.
**Notes**: The Python helper is a strong implementation asset: it paginates all three comment types (conversation, reviews, inline threads) via a single GraphQL query loop and outputs structured JSON. If porting to another host (e.g. pi / Claude Code), the script is drop-in reusable as long as `gh` CLI is present; only the SKILL.md auth-escalation language needs updating.

## skills/changelog-generator/SKILL.md
**Type**: skill
**Portable**: yes
**Reason**: The core procedure (scan git history → categorize commits → translate to user-friendly copy → format as structured markdown) is stack- and org-agnostic; works for any git repo regardless of language or toolchain.
**Trigger**: When preparing release notes, creating a changelog for a version tag or date range, or documenting changes for customers/users.
**Steps/contract**:
1. Scan git history for a given range (version tags or date window).
2. Categorize changes into buckets: new features, improvements, bug fixes, breaking changes, security.
3. Filter noise — exclude internal/maintenance commits (refactoring, tests, CI tweaks).
4. Translate technical commit language into customer-facing copy.
5. Format as structured markdown changelog (emoji-prefixed section headers, brief bullets).
6. Optionally apply a custom style guide file (e.g., `CHANGELOG_STYLE.md`) if present.
**Strip**: "Inspired by Manik Aggarwal / Lenny's Newsletter" attribution; specific example dates; "Related Use Cases" section (social media posts, email updates — scope creep); tip about saving directly to CHANGELOG.md (tool-specific).
**Structure/format**: Good — When/What/How sections, concrete before/after example showing expected emoji-categorised markdown output. Example is the most valuable part.
**Notes**: Overlaps with the existing `release` skill in the agents repo, which covers the full release workflow including changelog generation. This skill is narrower — git-history-to-user-facing-notes only. Worth considering as a sub-procedure of `release` rather than a standalone skill, or as a complement for mid-cycle summaries (weekly digests) where a full release flow isn't triggered.

## skills/gh-fix-ci/SKILL.md
**Type**: Agentic workflow skill — multi-step CI debugging and fix pipeline using `gh` CLI and a bundled Python helper script.
**Portable**: Partial — the workflow steps and `gh` CLI commands are universally portable across any GitHub-hosted project; the bundled `scripts/inspect_pr_checks.py` helper adds value but requires the skill's directory to be co-located (path passed explicitly). External-check scoping rule (Buildkite etc. → report URL only) is a clean portable policy.
**Reason**: Core loop (auth → resolve PR → inspect failing checks → summarize → plan → implement → recheck) is a solid, repeatable SOP for any GitHub Actions CI triage. The explicit scoping rule for non-GA checks keeps it lean. Depends on a `plan` skill for approval gate — coupling to that abstraction is acceptable.
**Trigger**: User asks to debug or fix failing PR CI/CD checks on GitHub Actions and wants a plan + code changes.
**Steps/contract**: 8-step workflow: (1) verify gh auth with escalated scopes, (2) resolve PR from branch or explicit input, (3) inspect failing checks via script or manual `gh` fallback, (4) scope non-GA checks as out-of-scope, (5) summarize failure snippet to user, (6) draft fix plan via `plan` skill + await approval, (7) implement approved plan, (8) suggest recheck with `gh pr checks`.
**Strip**: Sandboxing-specific notes (`sandbox_permissions=require_escalated`) — too platform-specific for a portable SOP. References to the bundled Python script path convention (`"<path-to-skill>/scripts/..."`) should be abstracted to a generic "run the bundled helper" instruction.
**Structure/format**: Well-structured — Overview, Inputs, Quick start, Workflow (numbered), Bundled Resources. The manual fallback section inside step 3 is slightly dense but necessary given `gh` field-drift behaviour; acceptable as-is.
**Notes**: The `gh` field-drift workaround (rerun with available fields if a field is rejected) is a valuable portable defensive pattern worth preserving. Approval gate before implementation is a good SOP guardrail. Dependency on a separate `plan` skill is an implicit coupling — the SOP should either inline a minimal plan template or make that dependency explicit as a prerequisite.

## skills/webapp-testing/SKILL.md
**Type**: skill
**Portable**: yes
**Reason**: The Playwright-based testing workflow, decision tree (static vs. dynamic, server running vs. not), reconnaissance-then-action pattern, and best practices are fully stack-agnostic — none of the core procedure is tied to a specific application framework, language, or org tooling. The `with_server.py` helper is bundled and referenced only by invocation, not implementation, so its presence is not a portability blocker.
**Trigger**: When verifying or testing a local web application's frontend behavior using Playwright — e.g., smoke-testing a local dev server, capturing screenshots, checking UI interactions, or inspecting browser console logs.
**Steps/contract**:
1. Determine app type: static HTML → read file directly for selectors; dynamic → check if server is running.
2. If server not running, invoke `python scripts/with_server.py --help` then run with the helper (single or multi-server flag).
3. Reconnaissance phase: navigate, wait for `networkidle`, screenshot or inspect DOM, identify selectors from rendered state.
4. Action phase: execute interactions using discovered selectors; add appropriate waits (`wait_for_selector`, `wait_for_timeout`).
5. Always close the browser on completion.
**Strip**: `scripts/with_server.py` path reference (repo-local helper); `examples/` directory references (`element_discovery.py`, `static_html_automation.py`, `console_logging.py`) — these are repo-local assets and should be re-expressed as generic example types if ported.
**Structure/format**: Decision tree (flowchart-style ASCII) is the standout structural pattern — it encodes the branching logic for choosing approach (static vs. dynamic, server state) concisely and removes ambiguity. The "run `--help` first, treat scripts as black boxes" invariant is a strong anti-bloat SOP worth generalising to any skill that ships helper scripts.
**Notes**: The `networkidle` wait-before-inspection rule is the most reusable single heuristic — it prevents the most common failure mode in dynamic app testing. The explicit "Don't inspect before networkidle" anti-pattern callout (❌/✅ format) is a good model for negative-to-positive constraint expression. Minor typo in the source ("abslutely") is irrelevant to portability.

## skills/content-research-writer/SKILL.md
**Type**: skill
**Portable**: yes
**Reason**: The entire collaborative writing lifecycle — intake Q&A, outlining, research synthesis, hook improvement, section feedback, voice preservation, citation management, and final review — is platform- and domain-agnostic. The only environment-specific touches are a `mkdir ~/writing/...` setup snippet and a "Work in VS Code" pro tip, both trivially stripped.
**Trigger**: When a user wants to write blog posts, articles, newsletters, case studies, tutorials, or any long-form content, and wants a structured writing partner for research assistance, outline creation, draft feedback, citation management, or final polish.
**Steps/contract**: Eight ordered phases — (1) Intake Q&A: clarify topic/argument, audience, length/format, goal, existing sources, and writing style; (2) Collaborative outlining: produce structured outline with research-to-do placeholders, iterate until approved; (3) Research: search for relevant info, cite credibly, extract key facts/quotes/data, inject into outline with formatted citations; (4) Hook improvement: analyse current hook, offer 3 typed alternatives (bold statement / personal story / surprising data) with rationale and 4 quality-gate questions; (5) Section-by-section feedback: structured template covering what-works, clarity/flow/evidence/style issues with specific line edits and closing questions; (6) Voice preservation: read samples, suggest not replace, match tone, check in periodically with "Does this sound like you?"; (7) Citation management: handle inline/numbered/footnote formats per user preference, maintain running references list; (8) Final review: comprehensive assessment covering overall strengths, structure/flow, content quality, technical quality, readability, specific polish suggestions, and a pre-publish checklist.
**Strip**: `mkdir ~/writing/...` / `touch article-draft.md` filesystem setup commands; "Work in VS Code" pro tip; suggested `~/writing/article-name/` folder structure; "Teresa Torres" named persona in examples (replace with "User"); "Ready to publish! 🚀" emoji sign-off; any implicit "Claude Code" runtime references (replace with "the agent").
**Structure/format**: Long, densely formatted skill organised as: when-to-use → what-it-does summary → quick workflow → 8 detailed instruction steps → 4 worked examples → 4 workflow variants → pro tips → file org → best practices → related use cases. The standout pattern is explicit output-contract template blocks for each phase (outline scaffold, research dump, hook-options format, feedback rubric, final-review rubric) — these provide precise, copy-paste-ready output shapes that are immediately reusable in any writing-assistant SOP. The "Pro Tips" and "File Organization" sections are low-signal filler.
**Notes**: The hook improvement framework (3 typed alternatives + 4 quality questions) and the voice-preservation invariants ("suggest, don't replace"; periodic tone check-ins) are independently extractable high-value SOP fragments. The pre-publish checklist (claims sourced, citations formatted, examples clear, transitions smooth, CTA present, proofread) is clean and portable. This skill substantially overlaps with our `doc-coauthor` and `doc-edit-article` skills but adds a distinct research/citation-management dimension those lack; if promoting, consider merging the citation workflow into `doc-coauthor` rather than creating a new top-level skill.

## skills/meeting-insights-analyzer/SKILL.md
**Type**: skill — meeting transcript analysis and communication pattern coaching
**Portable**: partial
**Reason**: The analysis framework (conflict avoidance indicators, speaking ratio metrics, filler word detection, active listening signals, facilitation assessment) is fully portable. However, the setup section is tightly coupled to specific tools (Codex folder navigation, Granola, Zoom, Fireflies.ai) and assumes a local-folder workflow, which limits direct lift-and-shift. The core SOP logic is tool-agnostic once input is normalised.
**Trigger**: User uploads or points to meeting transcripts and asks for communication pattern analysis, conflict avoidance review, speaking ratio assessment, or facilitation coaching.
**Steps/contract**: (1) Discover transcript files in folder (`.txt`, `.md`, `.vtt`, `.srt`, `.docx`); (2) Clarify analysis goals if unspecified; (3) Analyse each requested pattern (conflict avoidance, speaking ratios, filler words, active listening, leadership/facilitation) with timestamped quotes; (4) Emit per-pattern findings block (finding → frequency → 2–3 examples with "what happened / why it matters / better approach"); (5) Synthesise into a summary report with statistics, strengths, growth opportunities, and next steps; (6) Offer follow-up options (trend tracking, deep dives, performance review export).
**Strip**: All tool-specific setup instructions (Granola, Zoom, Google Meet, Fireflies.ai export steps); Codex-specific folder-navigation framing; "Common Analysis Requests" and "Related Use Cases" sections (marketing content, not SOP logic); inline inspiration attribution ("Inspired by Dan Shipper").
**Structure/format**: Well-structured with clearly separated phases and two reusable output templates (per-pattern block + summary report). Output schema is prescriptive and copy-portable. Example outputs are illustrative rather than prescriptive — good balance.
**Notes**: The two output templates are the highest-value extractable artefacts. The pattern taxonomy (conflict avoidance markers, speaking-ratio formula, filler-word list, active-listening signals) is a compact, reusable checklist. Overlaps with `meeting-notes-and-actions` and `notion-meeting-intelligence` — those focus on minutes/actions while this focuses on behavioural self-coaching, so the differentiation is clear and worth preserving. Recommend keeping the pattern checklist and both output templates; strip tool coupling.

## skills/email-draft-polish/SKILL.md
**Type**: skill
**Portable**: yes
**Reason**: The entire workflow — elicit goal/audience/tone/length, outline key points, draft with subject line, offer tone/length variants, run a QA pass — is fully domain- and tool-agnostic. No platform, API, or org-specific references appear anywhere.
**Trigger**: When a user wants to draft, rewrite, or condense an email (cold outreach, reply, status update, escalation) where tone, brevity, and clarity matter.
**Steps/contract**:
1. Gather inputs: goal (inform/persuade/apologize/escalate), audience, tone (warm/formal/direct), desired length, must-include points, taboo topics, CTA; for replies also collect the full thread.
2. Outline: list key points, open questions, and CTA; confirm any missing facts before drafting.
3. Draft: write subject line + concise body with short paragraphs; surface CTA early.
4. Variants: produce 2–3 tone/length variants when the ask is vague (concise / detailed / bullet-only).
5. QA: verify hedging vs. directness matches the requested tone, strip jargon, confirm names/links, guard against over-promising.
**Strip**: nothing — the skill is already free of tool/platform/org coupling.
**Structure/format**: Clean three-section structure (Inputs to ask for → Workflow → Output format). Standout patterns: explicit elicitation checklist before drafting, mandatory variant generation under uncertainty, and a named QA gate with specific failure modes (hedging, jargon, over-promising).
**Notes**: Compact and well-scoped. The "offer variants when the ask is vague" heuristic is broadly reusable in any writing SOP — it sidesteps the common failure mode of committing to one interpretation and iterating. The QA checklist (hedging/directness, jargon, names/links, over-promising) maps cleanly onto a generic written-communication quality gate and is worth extracting as a standalone sub-pattern.

## skills/meeting-notes-and-actions/SKILL.md
**Type**: skill
**Portable**: yes
**Reason**: The entire workflow is input-agnostic — operates on pasted text or a file path, no org-specific tooling, APIs, or platform assumptions baked in. Output format (Markdown sections, checkboxes) travels to any team or toolchain.
**Trigger**: When user provides a meeting transcript, rough call notes, or a long meeting chat and wants a structured summary with action items.
**Steps/contract**:
1. Collect inputs: transcript/text or file path; meeting title/date; attendees; output-style preferences (terse bullets vs. narrative, action-item format, due-date tags, redaction rules).
2. Normalize text: strip noisy timestamps/speaker labels; lightly clean filler words; preserve quoted statements.
3. Extract essentials: agenda topics, key decisions, open questions, risks/blocked items.
4. Build action items: who/what/when; convert vague asks into concrete tasks; propose due dates if missing.
5. Produce structured output with header (title, date, attendees) + sections: `Summary`, `Decisions`, `Open Questions/Risks`, `Action Items` (checkboxes with owner + due).
6. Quality-check: consistent names, no hallucinated facts, flag ambiguities as clarifying questions.
7. Optional: timeline of major moments (if timestamps exist); 2–3 sentence Slack/email-ready blurb.
**Strip**: Nothing — no org-specific integrations, no proprietary tooling. Entirely self-contained.
**Structure/format**: Well-structured; inputs-first, linear workflow, named output sections with examples (checkboxes, owner+due). Quality-check step is explicit. Slack/email blurb extra adds practical value.
**Notes**: Clean, reusable SOP. Stronger than most meeting-notes patterns because it explicitly handles hallucination-avoidance (no invented facts, flag ambiguities) and vague-task→concrete-task conversion. Good candidate for a cross-cutting "meeting intelligence" SOP if merged with meeting-insights-analyzer.

## skills/notion-spec-to-implementation/SKILL.md
**Type**: skill
**Portable**: no
**Reason**: Entirely Notion-MCP-coupled — every step invokes `Notion:notion-search`, `Notion:notion-fetch`, `Notion:notion-create-pages`, or `Notion:notion-update-page`. The underlying intellectual pattern (locate spec → parse requirements → create plan → decompose into tasks → link artifacts → track progress) is generic, but the procedure as written is inseparable from the Notion MCP integration and Codex-specific setup steps (`codex mcp add`, `config.toml`, OAuth login). No reuse is possible without that stack.
**Trigger**: When implementing a PRD or feature spec sourced from Notion and creating linked implementation plans and tasks in Notion.
**Steps/contract**:
1. Locate spec via `Notion:notion-search`; fetch content with `Notion:notion-fetch`; capture gaps/assumptions.
2. Choose plan depth (quick vs. standard) based on complexity; create plan page in Notion with overview, phases, risks, success criteria; link back to spec.
3. Find task database; create 1–2-day tasks with action-verb titles, acceptance criteria, and property set (status, priority, relations, due date); link to spec + plan.
4. Link all artifacts bidirectionally (spec ↔ plan ↔ tasks); optionally annotate spec with an "Implementation" pointer.
5. Track progress on a recurring cadence; sync checklist/status fields; surface blockers and decisions; close phases with milestone summaries.
**Strip**: All `Notion:*` MCP tool calls; Codex MCP setup/login block (Steps 0); `reference/*.md` and `examples/*.md` local-path references; `data_source_id` detail.
**Structure/format**: Five-phase numbered workflow with clear phase names (Locate → Plan → Tasks → Link → Track). The phase sequence and 1–2 day task-sizing rule are the reusable structural patterns. The "clarifications block before proceeding" invariant (capture gaps before acting) is portable.
**Notes**: The abstract SOP underneath is a clean spec-to-implementation pipeline: parse → plan → decompose → link → track. Worth extracting as a tool-agnostic SOP template with the Notion/MCP tooling presented as one concrete adapter. The 1–2 day task-sizing heuristic and bidirectional artifact-linking discipline are concrete rules worth preserving in any extracted SOP.

## skills/notion-research-documentation/SKILL.md
**Type**: skill — multi-step research synthesis and structured documentation workflow using Notion MCP tools.
**Portable**: no
**Reason**: Every operational step is wired to Notion-specific MCP calls (`Notion:notion-search`, `Notion:notion-fetch`, `Notion:notion-create-pages`, `Notion:notion-update-page`) and the setup section is tightly coupled to the Codex runtime (`codex mcp add`, `codex --enable rmcp_client`, `config.toml`). The deliverable (published Notion page) is also Notion-native. Without Notion MCP, the skill has no execution path.
**Trigger**: When gathering information from multiple Notion sources to produce briefs, comparisons, or research reports with citations, published back to Notion.
**Steps/contract**: Five ordered phases — (0) MCP connection guard: if any Notion call fails, pause and walk through `codex mcp add notion` → enable `rmcp_client` → `codex mcp login notion` OAuth flow → tell user to restart Codex; (1) Gather sources: search with targeted queries, confirm scope, fetch pages, skim for facts/metrics/claims, track source URLs for citation; (2) Select format: quick brief / research summary / comparison / comprehensive report, driven by a bundled `format-selection-guide.md`; (3) Synthesise: outline by themes, note evidence with source IDs, flag gaps and contradictions; (4) Create doc: pick matching template from `reference/`, create page via MCP, include title/summary/key findings/supporting evidence/recommendations, add inline citations and references section; (5) Finalise: add highlights/risks/open questions, create task checklist if needed, update page via MCP with changelog.
**Strip**: Entire Step 0 Codex MCP setup block (`codex mcp add`, `config.toml`, `rmcp_client`, `codex mcp login`); all `Notion:notion-*` MCP call names; all `reference/` and `examples/` local-file links (bundled assets that don't travel); "restart codex" instruction.
**Structure/format**: Compact Quick Start (5 bullets) followed by numbered workflow steps with inline sub-bullets; dedicated Step 0 failure-recovery block upfront is a good defensive SOP pattern worth preserving generically. Format-selection decision tree (quick readout / single-topic / option tradeoffs / deep dive) is a reusable heuristic independent of Notion.
**Notes**: The core research-synthesis loop (search → fetch → outline by themes → flag gaps → cite sources → publish structured doc) is a sound portable SOP pattern, but the execution is 100% Notion-MCP-dependent. The format-selection heuristic (4 output types matched to depth/audience) is the only independently extractable fragment of value. Overlaps substantially with `notion-knowledge-capture` and `notion-meeting-intelligence` from the same repo — all three share the Notion MCP dependency and differ only in input type (general research vs. ad-hoc knowledge vs. meeting transcripts). Not a candidate for promotion as-is; would need a tool-agnostic rewrite to become portable.

## skills/linear/SKILL.md
**Type**: skill (third-party SaaS integration — Linear issue tracker via MCP)
**Portable**: no
**Reason**: Every element is coupled to a specific vendor (Linear) and a specific runtime (Codex CLI). The MCP setup steps use Codex-only commands (`codex mcp add`, `codex mcp login`, `codex --enable rmcp_client`), the tool names are all Linear MCP tool names (`create_issue`, `list_cycles`, etc.), and the practical workflows are entirely Linear-domain concepts (cycles, teams, sprint retros). Nothing generalises to other issue trackers or agent runtimes without a full rewrite.
**Trigger**: User wants to read, create, or update tickets/projects/workflows in Linear.
**Steps/contract**: Four ordered steps: (0) MCP setup if not already connected (OAuth, config flag, restart); (1) clarify goal and scope (team, project, priority, labels, cycle, due dates); (2) select workflow and identify required tool calls + identifiers; (3) execute calls read-first then write, batching bulk operations with explanation; (4) summarise results, surface blockers, propose next actions. Hard rule: do not skip steps.
**Strip**: All Codex CLI invocations; all Linear MCP tool names; OAuth/Windows-WSL setup block; the entire Practical Workflows section; Linear-specific troubleshooting content.
**Structure/format**: Prereq block → numbered steps → tool catalogue → named-workflow menu → productivity tips → troubleshooting appendix. Two reusable meta-patterns worth extracting: (a) "read-before-write" execution order for any MCP tool integration, and (b) "clarify identifiers before calling tools" as a pre-flight gate. The troubleshooting section's four-category structure (auth / tool-call errors / missing data / performance) is a tidy template for any MCP integration skill's troubleshooting appendix.
**Notes**: The step-0 "if MCP not connected, pause and set it up, then tell user to restart" pattern is a clean recovery protocol applicable to any skill that depends on an MCP server being live. Not portable as a SOP, but the scaffolding pattern (prerequisites → ordered steps → tool index → use-case menu → troubleshooting) is solid and worth replicating for future integration skills.

## skills/notion-meeting-intelligence/SKILL.md
**Type**: skill
**Portable**: partial
**Reason**: The 5-step meeting-prep process (gather inputs → choose template type → build agenda with owners/timeboxes → enrich with cited research → finalize with next-step owners) is fully org-agnostic. The template taxonomy (status-update, decision, planning, retro, 1:1, brainstorming) and the discipline of owner + timebox per agenda item are universally strong. However, all concrete tool calls are Notion MCP + Codex-specific (`Notion:notion-search`, `Notion:notion-fetch`, `Notion:notion-create-pages`, `codex mcp add`, OAuth setup), making direct re-use require tool substitution.
**Trigger**: User wants to prepare meeting materials, draft an agenda or pre-read, or gather context before a meeting.
**Steps/contract**:
1. Confirm objective, desired outcomes/decisions needed, attendees, duration, date/time, and any prior materials.
2. Gather context from knowledge base (prior notes, specs, OKRs, decisions) via search then fetch.
3. Select meeting format from taxonomy: status-update, decision/approval, planning, retrospective, 1:1, or brainstorming — based on the meeting's purpose.
4. Build agenda/pre-read from chosen template: context section, goals, agenda items each with assigned owner and timebox, decisions needed, risks, prep asks for attendees.
5. Enrich with external research (benchmarks, industry facts, risks) — claims must be cited with source links, fact separated from opinion.
6. Add next steps with owners; update the document as plans change; create linked tasks for any action items arising.
**Strip**: All Notion MCP tool calls (`Notion:notion-search`, `Notion:notion-fetch`, `Notion:notion-create-pages`, `Notion:notion-update-page`) and Codex-specific MCP setup instructions (OAuth, `config.toml` flags). Replace with generic "search your knowledge base / document store" language.
**Structure/format**: YAML frontmatter + narrative description. Quick Start (5-step numbered list) → Workflow (phases 0–5, each with sub-bullets) → References (template types and example files). Clean separation of template taxonomy and enrichment step. Well-scoped.
**Notes**: Template taxonomy and owner+timebox discipline are the highest-value portable ideas. "Separate fact from opinion; cite sources" is a good research-enrichment guardrail worth keeping. The fallback/error-handling section (step 0 — what to do if MCP fails) is Codex-specific and can be dropped entirely. Strong candidate for a portable `meeting-prep` SOP if tool references are abstracted.

## skills/notion-knowledge-capture/SKILL.md
**Type**: skill
**Portable**: no
**Reason**: Entirely dependent on Notion MCP (`Notion:notion-search`, `Notion:notion-fetch`, `Notion:notion-create-pages`, `Notion:notion-update-page`) and Codex-specific setup steps (`codex mcp add`, `config.toml`, OAuth login). Database schemas and templates are pulled from a `reference/` directory bundled with the skill. No meaningful procedure survives extraction without the Notion integration.
**Trigger**: When user wants to capture conversations, decisions, or notes into structured Notion wiki pages, how-tos, FAQs, or decision logs.
**Steps/contract**: (1) Clarify capture purpose, audience, content type; (2) locate target Notion database via `reference/` schemas; (3) extract facts/decisions/rationale from conversation; (4) create or update Notion page with correct properties and template structure; (5) add backlinks, relations, and follow-up tasks.
**Strip**: All Notion MCP tool calls; Codex MCP setup/login sequence; `reference/` and `examples/` directory dependencies; OAuth/`config.toml` scaffolding.
**Structure/format**: Five-phase numbered workflow with clear sub-bullets per phase; content-type differentiation (decision vs. how-to vs. FAQ vs. learning) is a reusable classification pattern. The "pause and set up MCP" recovery block (Step 0) is a useful defensive pattern for tool-dependent skills.
**Notes**: The content-type taxonomy (decision, how-to, FAQ, concept/wiki, learning, documentation) and its per-type extraction heuristics (alternatives+rationale for decisions; steps+pre-reqs+edge-cases for how-tos; Q&A+links for FAQs) are portable prose patterns worth extracting into a generic knowledge-capture SOP, even though the Notion tooling is not portable.

## skills/internal-comms/SKILL.md (+ examples/)
**Type**: Dispatcher skill with four format sub-prompts (3P updates, company newsletter, FAQ answers, general comms).  
**Portable**: Yes — the 3P format, FAQ structure, and general-comms principles are organisation-agnostic. Newsletter has a 1000+-headcount assumption worth flagging, but the section logic is reusable.  
**Reason**: 3P (Progress/Plans/Problems) is a widely-used management framework; the strict formatting rules, scope-scaling guidance (team size → granularity), and conciseness targets are independently valuable. FAQ sub-prompt has solid "Answer Guidelines" (hedge uncertainty, cite sources, flag executive-input needs) that apply anywhere. General-comms fallback distils five universally applicable writing principles.  
**Trigger**: User asks to write any internal communication — status report, leadership update, 3P, newsletter, FAQ, incident report, project update.  
**Steps/contract**:  
  1. Identify communication type from request.  
  2. Load the matching example file (3p-updates / company-newsletter / faq-answers / general-comms).  
  3. Follow that file's workflow: clarify scope → gather info (tools or user) → draft → review for conciseness/metrics.  
  4. For 3P: strict single-block format `[emoji] [Team] (Dates) / Progress / Plans / Problems`, 1–3 sentences per section, data-driven.  
  5. For newsletter: ~20–25 bullets grouped into thematic sections, "we" voice, links throughout.  
  6. For FAQ: *Question* / *Answer* pairs, 1 sentence / 1–2 sentences, company-wide scope.  
  7. For general: ask audience + purpose + tone before drafting; apply active-voice / most-important-first principles.  
**Strip**:  
  - "my company" possessive in SKILL.md description — generic trigger phrasing already in place elsewhere.  
  - Hard tool references (Slack, Google Drive, Email, Calendar) in sub-prompts; replace with "available communication/document sources" or make tool list an optional context block.  
  - "1000+ people" headcount assumption in newsletter — reframe as guidance for large orgs, adjustable to context.  
  - `license: Complete terms in LICENSE.txt` frontmatter field.  
**Structure/format**: Clean separation of concerns — SKILL.md is a pure dispatcher; logic and tone rules live in per-format example files. Each example file has `## Instructions`, `## Tools Available` / `## Tools to use`, `## Workflow` or `## Formatting`, and `## Guidance` / `## Answer Guidelines` sections. Consistent enough to be machine-readable.  
**Notes**: The 3P sub-prompt is the strongest individual piece — concrete format, scope-scaling heuristic (bigger team = less granular bullets), and 30–60 second readability target make it immediately usable. The general-comms fallback is thin (5 bullets) and mainly useful as a safety net. Consider whether newsletter and FAQ warrant their own top-level skills given their independent utility.

## mcp-builder/reference/mcp_best_practices.md
**Type**: Reference document / technical standards guide — 15-section numbered checklist covering MCP server naming, tool design, response formats, pagination, char limits, transport selection, security (OAuth + input validation), testing, error handling, docs, and compliance. Not a step-by-step SOP; functions as a bundled reference for an MCP builder skill.
**Portable**: partial
**Reason**: The first half (Sections 1–15, hand-authored) contains fully portable rules: snake_case tool naming with service prefix, dual JSON/Markdown response formats, pagination response schema, 25k char-limit truncation pattern, tool annotations (readOnlyHint/destructiveHint/idempotentHint/openWorldHint), tool-name conflict disambiguation strategies, and security checklist (OAuth, input validation, error non-exposure). The second half (after the `----------` separator) is a near-verbatim copy of the official MCP Tools protocol documentation (modelcontextprotocol.io/docs/concepts/tools), complete with JSX components (`<Note>`, `<Tabs>`, `<Tab>`), adds no original best-practice content, and should be dropped in favour of a URL reference.
**Trigger**: When building any MCP server, regardless of language or transport — a reference companion to any MCP builder SOP.
**Steps/contract**: Not a procedure; a checklist-by-concern: naming → tool design → response formats → pagination → char limits → transport selection → tool dev best practices → transport best practices → testing → OAuth/security → resource management → prompt management → error handling → documentation → compliance. Key invariants to preserve: (1) tool names must use `{service}_{action}_{resource}` pattern with service prefix to prevent multi-server conflicts; (2) all list tools return `has_more` + `next_offset` + `total_count`; (3) char limit constant (25 000) with `truncated` + `truncation_message` fields; (4) tool errors go in result objects (set `isError: true`), never as protocol-level errors; (5) OAuth tokens must never be passed through from MCP clients; (6) `stdio` servers must log to `stderr`, never `stdout`.
**Strip**: Language-specific server naming conventions (`{service}_mcp` vs `{service}-mcp-server`) — present as examples not prescriptive rules; entire second half from `----------` onward (verbatim protocol docs with JSX markup); all Python/TypeScript implementation boilerplate code examples (keep prose rules, strip syntax); transport comparison table (deployment-specific, low portable value).
**Structure/format**: Quick Reference summary box at top (highest density — covers all five key topics in ~10 lines) is the most reusable structural pattern; worth extracting as a standalone cheat-sheet header for any MCP SOP. Pagination JSON schema block and truncation handling pseudocode are concrete, copy-portable contracts. Tool annotations table (4-column with defaults) is the clearest articulation of MCP annotation semantics in the reference repo.
**Notes**: Best used as a bundled `reference/` file within an `mcp-builder` skill rather than a standalone SOP — it complements the agent-centric design principles and evaluation framework already identified in `mcp-builder/SKILL.md`. Together they form a near-complete MCP builder SOP. The tool-name conflict disambiguation section (three strategies: user-defined prefix, random prefix, server-URI prefix) is a uniquely practical addition not found in the SKILL.md and is worth preserving verbatim. No org-specific or Codex-runtime coupling in the first half; clean portable extraction is straightforward.

## skills/mcp-builder/reference/evaluation.md
**Type**: reference sub-procedure doc — evaluation design SOP and execution harness for MCP servers; companion to `mcp-builder/SKILL.md` Phase 4.
**Portable**: partial
**Reason**: The evaluation design methodology (13 question-design rules, 6 answer-quality rules, 5-step creation process, XML output schema, good/poor annotated examples) is fully tool- and platform-agnostic and applies to any agent tool-server quality gate. The "Running Evaluations" section is tightly coupled to a bundled Python harness (`scripts/evaluation.py`) and OpenAI API, making that half non-portable without adaptation.
**Trigger**: When building or quality-gating an MCP server (or any tool-based agent capability) and needing a verifiable, stable test suite of LLM-solvable tasks.
**Steps/contract**:
1. Design 10 read-only, independent, non-destructive questions following 13 question guidelines: independent across pairs; non-destructive/idempotent only; realistic, clear, complex; multi-hop requiring sequential tool calls; no keyword-matchable shortcut; stress-tests tool return values; answer is stable/stationary (not current state); answer is a single verifiable value.
2. Apply 6 answer guidelines: direct string-comparable; prefer human-readable format over opaque IDs; based on "closed" concepts unlikely to change; clear and unambiguous; diverse modalities across QA pairs; not a complex structure or list.
3. Follow 5-step creation process: (1) inspect target API documentation in parallel; (2) inspect MCP tool schemas/docstrings without calling tools; (3) iterate understanding; (4) explore live content via read-only tool calls with pagination and small limits; (5) generate 10 QA pairs.
4. Emit output as `<evaluation><qa_pair><question>…</question><answer>…</answer></qa_pair></evaluation>` XML.
5. Verify: solve each task yourself with the MCP server, correct wrong answers, remove any that require write/destructive ops.
**Strip**: Entire "Running Evaluations" section (Python harness setup, `pip install`, `export OPENAI_API_KEY`, `scripts/evaluation.py` CLI, transport-type flags, troubleshooting appendix) — execution tooling specific to the bundled OpenAI-based runner. Also strip: `scripts/example_evaluation.xml` path reference; `scripts/requirements.txt` mention.
**Structure/format**: Quick Reference block (5-bullet summary + XML schema) up front is a strong SOP pattern — immediate orientation before deep guidelines. 13 question rules + 6 answer rules are numbered checklists — crisp and scannable. Good/poor example pairs use explicit "this is good/poor because" rationale blocks — highly effective teaching pattern worth preserving verbatim. Two major sections (design SOP vs. execution harness) are clearly separated, making surgical extraction straightforward.
**Notes**: The 13-point question checklist (stability, independence, no-keyword-search, multi-hop depth, stress-test return values) is an independently extractable high-value SOP fragment applicable to any eval design task, not just MCP. The "do not let the MCP server restrict the kinds of questions you create" invariant is a strong anti-goodhart guardrail worth preserving. The XML output format is minimal and directly reusable. This document's design SOP section is more detailed and prescriptive than the Phase 4 summary in SKILL.md — it is the canonical source for the evaluation sub-procedure. Overlaps with and extends `mcp-builder/SKILL.md`'s evaluation notes; if promoting, keep this as the authoritative evaluation reference and have SKILL.md point to it.

## skills/tailored-resume-generator/SKILL.md
**Type**: skill — resume tailoring assistant
**Portable**: yes (workflow); no (output content — resumes are inherently personal, but the *procedure* is fully transferable)
**Reason**: The 10-phase pipeline (gather → analyse JD → map experience → structure → ATS-optimise → format → recommend → iterate → best-practices → special-cases) is stack-, domain-, and org-agnostic. No external tools, APIs, or proprietary data are required; the agent only needs the job description and candidate background supplied inline.
**Trigger**: User wants to tailor a resume to a specific job posting, optimise for ATS, or create a career-transition or role-type-specific version.
**Steps/contract**: 10 numbered phases — (1) gather JD + background, (2) extract/prioritise requirements into must-have / important / nice-to-have tiers, (3) map candidate experience to each requirement (flag gaps), (4) structure resume (summary → skills → experience → education → optional sections), (5) ATS keyword optimisation rules, (6) format guidance (markdown / plain text / Word hints; 1 vs 2 page heuristics), (7) strategic recommendations (strengths, gap analysis, interview prep, cover-letter hooks), (8) iterate/refine loop, (9) do/don't best-practices list, (10) role-type variants (career changers, new grads, executives, technical, creative).
**Strip**: Full worked example (long placeholder resume occupies ~40 lines — useful for illustration but bloats the SOP); "Tips for Best Results" section (duplicates inline guidance); "Privacy Note" (generic boilerplate); "Don't" list (negative framing — convert to positive imperatives); redundant sub-bullet elaborations that restate earlier phases.
**Structure/format**: Well-organised with numbered phases and clear sub-headings; example input/output aids comprehension but is oversized for a portable SOP; the Instructions section is where the procedural value lives and is solid.
**Notes**: Strong procedural skeleton. The JD-analysis → priority-tiering → experience-mapping → ATS-optimisation pipeline is the genuinely reusable core. Role-type variants (section 10) add meaningful differentiation and should be preserved in condensed form. Could be tightened ~40% by removing the worked example, collapsing tips into inline guidance, and converting negative framing to positive. Overall: high-value SOP candidate with minor editing required.

## skills/notion-spec-to-implementation/reference/spec-parsing.md
**Type**: reference document (support file for the `notion-spec-to-implementation` skill; not a standalone skill)
**Portable**: partial
**Reason**: All extraction strategies — requirement categorization (functional/non-functional/constraints), priority mapping (P0–P3), acceptance criteria derivation (explicit, implicit, testability check), ambiguity handling templates, dependency identification, scope extraction, spec quality rubric, and pre-planning checklist — are fully source-agnostic and apply to any spec format (GitHub issues, Confluence, Google Docs, plain markdown). The "Finding the Specification" and "Reading Specifications" sections are tightly coupled to Notion MCP tool calls (`Notion:notion-search`, `Notion:notion-fetch`) and must be stripped or generalized.
**Trigger**: When parsing a spec document to extract requirements before building an implementation plan.
**Steps/contract**:
1. Locate and fetch the spec (Notion-specific; portable equivalent: "obtain spec content from any source").
2. Identify spec type: requirements-based, user-story, technical design doc, or PRD — and apply the matching extraction pattern.
3. Extract functional requirements, non-functional requirements, acceptance criteria, priorities, scope (in/out/assumptions).
4. Surface ambiguities using structured templates: Clarifications Needed, Missing Information, Conflicting Requirements.
5. Identify external, internal, and timeline dependencies.
6. Assess spec quality against the good/incomplete rubric; flag gaps.
7. Validate completeness via 9-item pre-planning checklist before proceeding to implementation plan.
**Strip**: `Notion:notion-search` and `Notion:notion-fetch` code blocks in "Finding the Specification" and "Reading Specifications" sections.
**Structure/format**: Flat reference doc organized by parsing concern. Standout reusable patterns: (a) 4-type spec taxonomy with per-type extraction targets; (b) functional/non-functional/constraints categorization; (c) P0–P3 priority vocabulary; (d) three ambiguity handling templates with structured fields; (e) implicit→explicit acceptance criteria derivation with testability check (❌/✓ examples); (f) spec quality rubric (good vs. incomplete); (g) 9-item pre-planning checklist.
**Notes**: The acceptance criteria section is the strongest portable piece — the explicit/implicit/testable triad is a rigorous pattern rarely stated this clearly. The ambiguity templates (Clarifications Needed, Missing Information, Conflicting Requirements) each carry structured fields (Current text, Question, Impact, Assumed for now) that transfer directly to any spec-to-implementation SOP. The spec quality rubric doubles as a useful gate for deciding whether to proceed or escalate for more definition.

## skills/mcp-builder/reference/python_mcp_server.md
**Type**: Reference document / Python-specific implementation guide — bundled companion to `mcp-builder/SKILL.md` covering FastMCP tool registration, Pydantic v2 input validation, async/await patterns, response format options (markdown/JSON), pagination schema, char-limit truncation, error handling, shared utilities, advanced FastMCP features (Context injection, Resource registration, Lifespan management, transport selection), and a multi-section quality checklist.
**Portable**: no
**Reason**: Every section is tightly coupled to Python and the FastMCP framework: imports are `mcp.server.fastmcp`, models use Pydantic v2 (`model_config`, `field_validator`, `ConfigDict`), HTTP calls use `httpx`, async patterns are Python `async def` / `async with`. The quality checklist explicitly tests Python-specific invariants (`async def`, `UPPER_CASE constants`, `httpx` context managers, Pydantic `Field()` constraints). Language-agnostic rules that appear here (tool naming, pagination schema, char-limit pattern, tool annotations) are already covered more portably in `mcp_best_practices.md`.
**Trigger**: When implementing an MCP server specifically in Python using FastMCP — the Python adapter layer for the language-agnostic MCP builder SOP.
**Steps/contract**: Not a procedure; a reference guide organised by concern: imports → server init (`FastMCP("{service}_mcp")`) → tool registration (`@mcp.tool` + Pydantic model) → Pydantic v2 migration notes → dual response formats (markdown/JSON) → pagination (`has_more` + `next_offset` + `total_count`) → char-limit constant (25 000) with truncation → error handling (HTTP status mapping via `httpx.HTTPStatusError`) → shared utilities (`_make_api_request`, `_handle_api_error`) → async/await rules → type hints → docstring schema convention → complete worked example → Advanced Features (Context: `report_progress`, `log_info`, `elicit`; Resource registration with URI templates; Structured output types; Lifespan management; transport selection: stdio/HTTP/SSE) → Code best practices (composability, no duplication) → 6-sub-section quality checklist (Strategic Design / Implementation Quality / Tool Configuration / Advanced Features / Code Quality / Testing).
**Strip**: All Python/FastMCP-specific code examples, import blocks, and Pydantic syntax — none of this survives transport to a different language. Retain only the prose rules that are not already in `mcp_best_practices.md`. The `https://raw.githubusercontent.com/…/README.md` WebFetch instruction is a live-SDK-fetch guard worth retaining in a Python-specific context only.
**Structure/format**: Quick Reference box at top (imports + init + decorator pattern) is a high-density orientation aid. Each concern has a prose rule followed by a code example — clean separation of the rule from the implementation. The 6-sub-section quality checklist is the single most valuable artifact: comprehensive (50+ items), checkable, ordered by concern (strategy → implementation → configuration → advanced → code quality → testing), and covering the full cycle from design to deployment. The Advanced Features section adds depth not found in SKILL.md — particularly the Context injection patterns and the Resource vs. Tool decision heuristic ("Resources for simple URI-template access, Tools for complex operations with validation").
**Notes**: This document is the Python adapter layer; `mcp_best_practices.md` is the language-agnostic layer; `SKILL.md` is the phase-workflow layer; `evaluation.md` is the QA layer. Together they form a near-complete MCP builder SOP. This file adds no net portable SOP value beyond what's in `mcp_best_practices.md`, but is a high-quality language-specific reference. If promoting an `mcp-builder` SOP, this should be packaged as a `reference/python_mcp_server.md` companion (its current role) rather than extracted. The quality checklist could be de-Python'd (strip language-specific items, keep strategic/design rows) and merged into the top-level quality gate in a promoted skill. The Context injection patterns (`report_progress`, `log_info`, `elicit`) are uniquely described here and are worth preserving in a Python-specific reference.

## skills/skill-installer/SKILL.md
**Type**: Operational meta-skill (skill management / package-installer UX)
**Portable**: No — tightly coupled to Codex runtime (`$CODEX_HOME/skills`), OpenAI's curated skill registry (`github.com/openai/skills`), and two bespoke Python helper scripts (`list-curated-skills.py`, `install-skill-from-github.py`)
**Reason**: Every substantive step delegates to Codex-specific scripts and a Codex-specific install path; nothing here generalises to other runtimes without rewriting the helpers and registry references
**Trigger**: User asks to list installable skills, install a named curated skill, or install a skill from a GitHub path
**Steps/contract**: (1) List curated skills via `list-curated-skills.py` → ask user which to install; (2) install via `install-skill-from-github.py` with optional `--ref`, `--dest`, `--method`; (3) tell user to restart Codex
**Strip**: Everything — the registry URL, helper script names, `$CODEX_HOME`, sandbox escalation note, and git-fallback logic are all Codex-specific implementation details
**Structure/format**: Frontmatter + prose sections (Communication, Scripts, Behavior, Notes); clean and readable but purpose-built for one runtime
**Notes**: The *concept* of a skill-installer SOP (discover → choose → install → reload) is portable in the abstract, but this file contains zero reusable procedure text — any port would be a full rewrite. Skip for cross-repo promotion.

## brand-guidelines/SKILL.md
**Type**: Reference/data sheet — brand colour palette and typography tokens for OpenAI/Codex artifacts.
**Portable**: No — all content is OpenAI-specific (colours, fonts, product names). No generic SOP logic is present.
**Reason**: The skill is a concrete brand stylesheet (hex codes, font names, fallback stacks) tied entirely to OpenAI's visual identity. There are no transferable steps, decision rules, or process contracts; only proprietary brand data.
**Trigger**: Activates on "brand colors", "style guidelines", "visual formatting", or "company design standards" — but the match only makes sense when the target brand is OpenAI/Codex.
**Steps/contract**: None — this is a data reference, not a procedural SOP. The "Features" section describes Python/pptx implementation details, not agent behaviour steps.
**Strip**: Everything: hex values, font names, "OpenAI Green / Azure / Graphite" accent cycle, python-pptx colour application notes — all are vendor-specific.
**Structure/format**: Frontmatter → Overview/Keywords → Colours section (hex table) → Typography section → Features (font/colour application rules) → Technical Details. Clean flat Markdown; no numbered steps or decision gates.
**Notes**: The user workspace already has a `brand-guidelines` skill (`/Users/mia/.agents/skills/brand-guidelines/SKILL.md`) targeting Anthropic's brand, which is the analogous portable artefact. This reference skill adds no new structural pattern beyond "store brand tokens in a SKILL.md"; skip for cross-repo promotion.

## canvas-design/SKILL.md
**Type**: Creative workflow skill — two-phase process: design philosophy generation (`.md`) followed by visual canvas expression (`.pdf`/`.png`).
**Portable**: Partial. The philosophy-creation phase and its structural contract (named movement, 4–6 paragraph manifesto, example philosophies, craftsmanship framing) are fully portable. The canvas-execution phase depends on code-generation capabilities and a local `./canvas-fonts` directory, making it environment-specific.
**Reason**: Defines a clear, reusable creative pipeline with well-articulated phases, rich worked examples, and strong guidance on aesthetic philosophy. The portable half (philosophy ideation) is a solid SOP pattern for any design-generation workflow. The canvas half is useful only where code execution and file output are available.
**Trigger**: User asks to create a poster, piece of art, design, or other static visual piece.
**Steps/contract**: (1) Design Philosophy Creation — name the aesthetic movement, write a 4–6 paragraph visual manifesto, output as `.md`; (2) Subtle reference deduction — extract conceptual thread from the request, weave it invisibly into the work; (3) Canvas Creation — express the philosophy as a single `.pdf` or `.png` using code, minimal text, repeating patterns, font from `./canvas-fonts`; (4) Refinement pass — second pass for museum-quality polish without adding new elements; (5) Optional multi-page variant.
**Strip**: Local font directory path (`./canvas-fonts` — replace with runtime font lookup or bundled list). The "FINAL STEP" section injects a fake pre-loaded user complaint ("It isn't perfect enough…") to force a refinement loop — clever but non-standard; replace with an explicit second-pass instruction. Remove any implicit assumption that Claude can render and write binary image/PDF files without explicit tooling.
**Structure/format**: Well-structured with clear `##` section headers, `###` subsections, bold critical guidelines, and five worked philosophy examples. Density is high but intentional. Good model for multi-phase skill layout.
**Notes**: The craftsmanship emphasis ("meticulously crafted," "museum quality," "top of their field") is repeated intentionally as a prompting technique — effective but verges on redundant noise after the third instance. The fake-user-quote injection in FINAL STEP is an unusual forcing function; document the intent explicitly if retaining. Overall one of the stronger creative workflow patterns in the repo; the philosophy-creation half alone is worth extracting as a portable ideation SOP.

## skills/mcp-builder/reference/node_mcp_server.md
**Type**: Reference document — Node/TypeScript-specific implementation guide for MCP servers; companion to `mcp-builder/SKILL.md` Phase 2, parallel to `python_mcp_server.md`. Not a procedural SOP; functions as a bundled language-specific recipe.
**Portable**: no
**Reason**: Every substantive element is TypeScript/Node.js-specific: SDK imports (`@modelcontextprotocol/sdk`, Zod, axios), `registerTool` API surface, `tsconfig.json` / `package.json` templates, `npm run build` / `dist/` build pipeline, `tsx` dev tooling, `AxiosError` error handling, and all code examples. No meaningful procedure survives extraction across languages. The only language-agnostic content (composability rules, pagination schema, char-limit truncation, error message design philosophy) is already covered more completely in `mcp_best_practices.md` and `mcp-builder/SKILL.md`.
**Trigger**: When implementing an MCP server in TypeScript/Node.js using the MCP TypeScript SDK — a reference to load during Phase 2 of the `mcp-builder` skill workflow.
**Steps/contract**: Not a procedure — a reference guide organised as: (1) SDK Quick Reference (imports, server init, `registerTool` pattern); (2) naming convention (`{service}-mcp-server`, hyphenated); (3) project structure template (`src/index.ts`, `tools/`, `services/`, `schemas/`, `constants.ts`, `dist/`); (4) full tool implementation example (Zod schema + `registerTool` with all four config fields + handler); (5) Zod schema patterns (`.strict()`, enums, optional+default, `.describe()`); (6) dual response format support (markdown/JSON enum); (7) pagination implementation (has_more + next_offset); (8) CHARACTER_LIMIT constant + truncation pattern; (9) AxiosError error handling with HTTP status mapping; (10) shared `makeApiRequest` utility; (11) async/await vs promise-chain guidance; (12) TypeScript best practices (strict, no `any`, Zod for runtime validation, null safety); (13) `package.json` + `tsconfig.json` templates; (14) complete end-to-end runnable example; (15) advanced features (Resources vs Tools, transports stdio/HTTP/SSE, notifications); (16) composability/DRY mandates; (17) build + run instructions; (18) 60-item quality checklist across 6 categories.
**Strip**: Everything — the entire document is TypeScript-implementation-specific. No cross-language portable SOP content survives extraction. The document should remain as a bundled `reference/` asset within the `mcp-builder` skill, not promoted to a standalone SOP.
**Structure/format**: Quick Reference summary up top → topical sections (prose + full code examples) → Complete End-to-End Example → Advanced Features → Quality Checklist. The 60-item quality checklist is the structural standout — 6 categories (Strategic Design, Implementation Quality, TypeScript Quality, Advanced Features, Project Configuration, Code Quality + Testing) organised as checkboxes with clear pass/fail criteria. The "When to use Resources vs Tools" decision guide and transport selection guide (stdio/HTTP/SSE) are the only language-agnostic structural patterns worth noting.
**Notes**: Best kept as a bundled reference asset paired with `python_mcp_server.md` — together they form the language-specific execution layer for `mcp-builder/SKILL.md` Phase 2. Two fragments are independently extractable as language-agnostic SOP content: (a) the "Strategic Design" checklist category (complete workflows not endpoint wrappers; task-natural subdivisions; context efficiency; human-readable IDs; educational error messages) — these are pure agent-centric design principles that complement `mcp_best_practices.md`; (b) the Resources-vs-Tools decision guide (static/URI-based → Resource; complex/side-effects → Tool). Both fragments are partial overlaps with content already identified in prior `mcp-builder` audit entries; no net-new high-priority SOP candidate here.

## skills/connect-apps/SKILL.md
**Type**: integration/setup guide
**Portable**: no
**Reason**: Entirely vendor-locked to the Composio Tool Router plugin (`/plugin install composio-toolrouter`, `/composio-toolrouter:setup`, platform.composio.dev API key). The skill provides zero reusable SOP logic — it is an installation and onboarding script for a proprietary third-party service.
**Trigger**: User wants to send emails, create issues, post messages, or take real actions in external services (Gmail, Slack, GitHub, Notion, etc.).
**Steps/contract**: (1) Install Composio plugin via `/plugin install`; (2) run `/composio-toolrouter:setup` and supply API key; (3) restart Claude Code; (4) issue natural-language action commands — Composio routes them to the appropriate tool and handles OAuth on first use.
**Strip**: Everything — the entire skill is a vendor-specific onboarding flow with no transferable process or design pattern.
**Structure/format**: Quick Start (3 numbered steps with code blocks) → capability table → supported-apps list → how-it-works numbered list → troubleshooting bullets. Competent structure but all content is Composio-specific.
**Notes**: Not a candidate for promotion. The only broadly reusable idea buried here is the "natural-language → tool router → OAuth on demand" integration pattern, but that pattern is not documented as an SOP — it is simply how Composio works. If a tool-routing SOP were ever needed, it would need to be written from scratch without any of this content.

## skills/skill-share/SKILL.md
**Type**: Skill-creation + Slack notification workflow (meta-skill for packaging and distributing other skills)
**Portable**: No
**Reason**: Hard dependency on "Rube" — a proprietary Slack integration tool that provides `SLACK_SEND_MESSAGE`, `SLACK_POST_MESSAGE_WITH_BLOCKS`, and `SLACK_FIND_CHANNELS` actions. Without Rube, the Slack notification half of the skill is inoperable. The skill-creation half (scaffold a `SKILL.md`, generate `scripts/`/`references/`/`assets/` directories, validate, zip) is generic, but is already covered more completely by the `skill-creator` skill in this same repo and by the `skill-create` skill in the live skills tree.
**Trigger**: User wants to create a new skill _and_ share it with the team on Slack in one step; or explicitly mentions "create/share skill".
**Steps/contract**: (1) Accept skill name + description → (2) scaffold directory with SKILL.md + sub-dirs → (3) validate metadata → (4) package as zip → (5) post to Slack channel via Rube.
**Strip**: Rube/Slack integration section entirely; Python 3.7+ requirement note; "Integration with Rube" section.
**Structure/format**: Narrative SKILL.md with frontmatter, When-to-use, Key Features (four numbered sub-sections), How It Works numbered steps, Example Usage code block, Integration section, Requirements. Reasonable structure but bloated with Rube-specific content.
**Notes**: The portable core (scaffold → validate → zip) duplicates `skill-creator` in this same repo and `skill-create` in the live tree. No incremental SOP value beyond what those already provide. Skip for promotion.

## competitive-ads-extractor/SKILL.md
**Type**: skill
**Portable**: partial
**Reason**: The competitive intelligence methodology — extract → screenshot → analyze messaging → categorize by theme/audience/format → identify patterns → generate structured report — is fully org-agnostic. The analysis taxonomy (problems highlighted, creative patterns, copy formulas, audience segments, recommendations) is reusable for any competitive research context. However, the extraction mechanics are tightly coupled to specific ad-library platforms (Facebook Ad Library, LinkedIn) and assume web-scraping tooling; without that plumbing the "extract" step is hollow.
**Trigger**: When user wants to research competitor ad strategies, understand market messaging/positioning, plan an ad campaign with proven patterns, or discover pain points competitors are targeting.
**Steps/contract**:
1. Identify target competitor(s) and platform(s) (Facebook Ad Library, LinkedIn, etc.).
2. Extract/scrape active ads and capture screenshots; save to local directory.
3. Analyze messaging: problems highlighted, use cases, value props per ad.
4. Categorize ads by theme, audience segment, and format (static/video).
5. Identify repeating patterns across the ad set.
6. Produce a structured analysis report: Overview → Key Problems → Creative Patterns → Copy Formulas → Audience Insights → Recommendations.
7. Save outputs: screenshots, markdown analysis, CSV of copy/CTAs, top-performers folder.
**Strip**: Notion-specific example output (illustrative filler); "Inspired by Sumant Subrahmanya / Lenny's Newsletter" attribution; hardcoded file paths (`~/competitor-ads/notion/`); progress-bar ASCII art in the example.
**Structure/format**: Standout element is the fixed analysis report schema — six named sections with consistent sub-structure (theme → count → representative copy → "why it works"). This taxonomy (problems → creative patterns → copy formulas → audience segments → recommendations) is a reusable competitive-intelligence deliverable format worth extracting as a standalone template. Legal/ethical guidance sidebar is a clean addition for any research SOP.
**Notes**: The skill is a prompt/guidance layer rather than a true automation — it instructs the model to perform scraping steps but provides no actual tool calls or scripts. Portability of the *analysis framework* is high; portability of the *extraction step* depends entirely on whether the runtime environment has browser/scraping tools available. The multi-competitor and trend-tracking variants (compare Q1 vs Q2 ads, aggregate across industry) are genuinely useful advanced patterns. Recommended to extract the analysis schema and structured-report template as a portable SOP artefact, while flagging the extraction step as tool-dependent.

## skills/domain-name-brainstormer/SKILL.md
**Type**: skill
**Portable**: no
**Reason**: The skill's core value proposition — checking real-time domain availability across TLDs — requires live internet/WHOIS access that Claude does not have. Any "availability" output would be fabricated. The remaining capability (brainstorming creative names) is generic LLM behaviour that needs no skill to activate.
**Trigger**: User is starting a project/company and wants domain name ideas plus availability checking.
**Steps/contract**: (1) Elicit project description and audience; (2) generate ~10–15 creative, memorable domain candidates across multiple TLDs; (3) check availability (requires external tool); (4) rank and explain top picks with branding rationale; (5) advise on registering variations.
**Strip**: Example output section, TLD guide, pricing context, advanced-features section, related-tools section, workflow walkthroughs — all marketing/padding. The domain-naming tips checklist (short, memorable, no hyphens, etc.) is the only genuinely reusable heuristic content.
**Structure/format**: Emoji-heavy output template; organised into Available / Alternative TLDs / Premium buckets with ✓ markers. Format is appealing but the data it displays is fictional without real-time lookup.
**Notes**: Not a viable portable SOP. The entire premise rests on a capability Claude does not have. The brainstorming heuristics (under 15 chars, pronounceable, no hyphens, brandable) could be folded into a naming-guidelines note, but that is too narrow to justify a standalone skill.

## skills/image-enhancer/SKILL.md
**Type**: skill
**Portable**: no
**Reason**: Aspirational documentation with no real implementation — no CLI tools, no library references (ImageMagick, PIL/Pillow, ffmpeg, etc.), no actual commands. The "What This Skill Does" section lists operations an image enhancer *would* perform but supplies zero mechanism for *how*. The example output is illustrative fiction, not a real tool invocation trace.
**Trigger**: When user wants to improve screenshot/image quality for documentation, presentations, blog posts, or social media.
**Steps/contract**: None real. The numbered list describes intended effects (analyze quality, enhance resolution, improve sharpness, reduce artifacts, optimize for use case) without any concrete procedure, tooling, or executable step.
**Strip**: Everything in "What This Skill Does" and the example output block — both are vaporware. "Inspired by Lenny Rachitsky" attribution is marketing noise with no procedural value.
**Structure/format**: Use-case taxonomy (blog posts, documentation, social media, presentations, print) is a reusable pattern for scoping image-processing skills. "Tips" heuristics (preserve originals, specify output format per use case, mention platform for social sizing) are sensible but thin.
**Notes**: Not portable as-is. To become an actionable SOP this would need a concrete implementation layer — e.g., ImageMagick `convert`/`mogrify` commands for sharpening and resizing, or an AI upscaling service call. The bones of a use-case taxonomy and originals-preservation tip are worth borrowing if building a real image-processing SOP, but the skill itself contributes nothing executable.

## skills/developer-growth-analysis/SKILL.md
**Type**: skill
**Portable**: no
**Reason**: The analysis framework (identify patterns → detect gaps → evidence-based recommendations → curated resources → structured report) is valuable and generic, but the entire implementation is locked to Codex-specific infrastructure: reads `$CODEX_HOME/history.jsonl` (proprietary Codex chat-history format), uses "Rube MCP" for HackerNews search, and depends on Rube MCP again for Slack DM delivery. The data source, tooling, and delivery channel are all non-transferable.
**Trigger**: User asks to analyze their developer growth or recent coding patterns (e.g. "Analyze my developer growth from my recent chats").
**Steps/contract**: (1) Read last 24–48 h of `~/.codex/history.jsonl`; (2) extract projects, technologies, problem types, challenges, and approach patterns; (3) identify 3–5 specific, evidence-based, prioritized improvement areas; (4) generate a structured report (work summary → improvement areas → strengths → action items); (5) search HackerNews via Rube MCP for 2–3 curated articles per improvement area; (6) present full report; (7) send to user's Slack DMs via Rube MCP.
**Strip**: Codex history-file read (`history.jsonl`, JSONL schema, `$CODEX_HOME` env var); Rube MCP for HackerNews search; Rube MCP for Slack delivery; the "send to Slack DMs" step entirely. What remains is a growth-report template and analysis heuristics.
**Structure/format**: Detailed step-by-step instructions with an explicit Markdown report template and a fully worked example output. High documentation quality; the report schema (work summary, improvement areas with Why/Observed/Recommendation/Time-to-skill-up, strengths, action items, learning resources) is well-designed and reusable.
**Notes**: The report structure and analysis heuristics (pattern extraction → gap detection → evidence-based improvement areas → curated reading list) are the portable kernel here. They could be promoted to a standalone "developer-growth-report" SOP if the input is generalized to "user-supplied work context" rather than auto-read chat history, and the delivery step is made optional/configurable. As written, not portable without significant adaptation.

## skills/file-organizer/SKILL.md
**Type**: skill
**Portable**: partial
**Reason**: The core phased procedure (scope clarification → directory analysis → grouping strategy → duplicate detection → plan proposal with confirmation gate → execution with logging → maintenance summary) is stack- and org-agnostic. The bash snippets are inconsistent across OSes (macOS `md5` mixed with Linux `find -printf`), and the bulk of the file is user-facing documentation (examples, pro tips, best practices) rather than agent procedure — that content is not portable as-is.
**Trigger**: User mentions disorganized folders, Downloads cleanup, duplicate files, messy project directories, or wants to restructure a filesystem location.
**Steps/contract**:
1. Ask 4 scoping questions: which directory, main problem type, files/folders to skip, aggressiveness level.
2. Analyze target directory with shell commands (ls, find, du) and summarize: file count, type breakdown, size distribution, date ranges.
3. Identify organization patterns: by type (PDFs/images/archives/code), by purpose (work/personal/active/archive), or by date (year/month).
4. If requested, find duplicates by hash, by name, or by size; present each set with paths + dates + recommendation; gate on per-set confirmation before any delete.
5. Output a structured plan proposal (markdown template: current state → proposed folder tree → explicit change list → files needing user decision → `yes/no/modify` gate). Take no action until approved.
6. Execute: create folders, move files with logging, rename consistently; confirm before any delete; preserve modification dates; handle conflicts explicitly; stop on unexpected situations.
7. Summarize: changes made, space freed, new folder tree, maintenance schedule (weekly/monthly/quarterly/yearly), quick reference commands.
**Strip**: OS-specific bash snippets (standardize to POSIX or document OS variants separately); all four worked examples (illustrative, not procedure); "Pro Tips", "Best Practices", "When to Archive", "Related Use Cases", "Common Organization Tasks" sections (user-guide prose); "From Justin Dielmann" attribution.
**Structure/format**: Written as a user guide, not a tight agent procedure — SOP steps are embedded inside a lengthy doc. Standout portable patterns: (a) mandatory `yes/no/modify` confirmation gate before any execution, (b) structured plan proposal template (current state → proposed tree → change list → ambiguous files → gate), (c) "log all moves for potential undo" invariant, (d) the 4-question scoping protocol at step 1.
**Notes**: The confirmation-gate-before-execution pattern and the structured proposal template are strong reusable SOP elements worth extracting independently. The maintenance cadence template (weekly/monthly/quarterly/yearly) is also portable to any recurring hygiene SOP. The skill needs significant tightening to be useful as an agent procedure — currently ~80% user-doc, ~20% actionable instructions.

## skills/raffle-winner-picker/SKILL.md
**Type**: Narrow task utility (random winner selection)
**Portable**: No
**Reason**: Highly specific to giveaways/raffles/contests — a single-purpose novelty tool with no reusable methodology applicable to broader engineering or product workflows. The "cryptographically random" claim is aspirational prose rather than a verifiable protocol, and the output format (emoji banners, runner-up prompts) is entertainment-facing rather than work-process-facing.
**Trigger**: User asks to pick a raffle/giveaway winner, randomly select from a list, or run a contest draw.
**Steps/contract**: (1) Accept list/CSV/XLSX/Google Sheets URL, (2) count entries, (3) apply random selection (optionally weighted or with exclusions), (4) display winner with metadata, (5) offer runner-up/export follow-ups.
**Strip**: All of it — emoji output format, "Inspired by Lenny" backstory, aspirational privacy claims, example workflows, tips section, and common-use-cases padding.
**Structure/format**: Informal tutorial style; no frontmatter contract; steps buried in prose and example blocks rather than a concise numbered protocol.
**Notes**: Not a portable SOP candidate. The skill describes a single ad-hoc task (pick a random row) that any competent agent performs inline without a dedicated skill. No transferable decision logic, escalation path, or reusable pattern for other workflows.

## skills/langsmith-fetch/SKILL.md
**Type**: skill
**Portable**: no
**Reason**: Entirely vendor-locked to the LangSmith/LangChain/LangGraph ecosystem and the `langsmith-fetch` CLI (a third-party pip package). The entire workflow — traces, threads, projects, LangSmith Studio — is LangSmith-specific with no transferable procedural core. Adopting this SOP requires running LangChain/LangGraph agents and a LangSmith account; it is meaningless outside that stack.
**Trigger**: User debugging a LangChain/LangGraph agent and asking about traces, errors, or performance.
**Steps/contract**: (1) Verify `langsmith-fetch` CLI installed + env vars set. (2) Fetch recent traces with `langsmith-fetch traces --last-n-minutes N --limit N --format pretty|json|raw`. (3) Drill into a specific trace by ID for root-cause analysis. (4) Optionally export session to an organised folder. (5) Surface error patterns and actionable recommendations.
**Strip**: All `langsmith-fetch` CLI invocations, LangSmith/LangChain/LangGraph terminology, session folder conventions, and the extensive "Notes for Claude" section. Nothing survives stripping — the procedure is the CLI.
**Structure/format**: Long-form skill with YAML frontmatter, emoji-annotated trigger list, prerequisites block, four numbered workflows each with a `bash` snippet and a fenced example response, four common-use-case patterns, output-format guide, advanced-flags table, troubleshooting section, best-practices section, and quick-reference cheat sheet. Well-organised but verbose.
**Notes**: No portable SOP value. The skill is essentially a user guide for a single pip package. The only reusable insight is the generic "fetch → categorise → root-cause → recommend" debugging loop, but that is too abstract to extract as a distinct SOP. Skip.

## skills/lead-research-assistant/SKILL.md
**Type**: skill
**Portable**: partial
**Reason**: The core research workflow (understand product → define ICP → research/identify → score → structured per-lead output) is a universal sales/BD process that is org- and tool-agnostic. However, the skill is domain-scoped to sales, BD, and marketing contexts rather than engineering workflows, limiting its applicability as a general SOP. The optional "run from your codebase" tie-in and CRM/CSV next-steps suggestions are thin wrappers around an otherwise transferable methodology.
**Trigger**: When a user wants to identify and qualify target companies or prospects for a product or service.
**Steps/contract**:
1. Understand the product/service — analyse codebase if present, ask for value proposition and key problems solved.
2. Define Ideal Customer Profile — target industries, company size, geography, pain points, technology requirements.
3. Research and identify leads — match against ICP, look for need signals (job postings, tech stack, recent news, funding).
4. Prioritise and score — assign a 1–10 fit score per lead with explicit scoring rationale covering ICP alignment, urgency signals, budget indicators, and timing.
5. Produce per-lead output — Company Name, Priority Score, Industry, Size, Why They're a Good Fit, Target Decision Maker, Value Proposition, Outreach Strategy, Conversation Starters, LinkedIn URL.
6. Format as structured markdown — Summary block (totals, high/medium counts, avg score) followed by one section per lead.
7. Offer next steps — CSV export, draft outreach messages, deeper research on top leads.
**Strip**: Specific named examples (Lenny's Newsletter, Bay Area remote consulting); LinkedIn URL field (external dependency, not always available); CRM/CSV import suggestions (tool-specific next steps); "run from your codebase" framing (optional and niche).
**Structure/format**: Highly prescriptive per-lead template with mandatory fields and an aggregate Summary block. The 1–10 fit score with labelled rationale factors (ICP alignment, urgency, budget, timing) is the standout reusable pattern — applicable to any evaluation or ranking workflow beyond lead research.
**Notes**: This skill is sales/BD-specific and unlikely to be promoted into a general engineering SOP. Its most portable element is the scored-list output format: summary → ranked items with scored rationale → per-item action block. That pattern is worth extracting as a generic "ranked research output" template in a cross-cutting evaluation SOP if one is ever authored.

## invoice-organizer/SKILL.md
**Type**: skill — domain-specific file-system automation (invoice/receipt organisation for tax prep and bookkeeping)
**Portable**: yes
**Reason**: Entirely org- and stack-agnostic; the 7-step procedure (scan → extract fields → determine strategy → standardise filenames → preview plan → execute with copy-safety → CSV + completion report) is self-contained and applicable to any individual or business holding a folder of financial documents.
**Trigger**: User asks to organise invoices or receipts for taxes, expense reconciliation, bookkeeping cleanup, or accountant handoff.
**Steps/contract**:
1. Scan folder — enumerate PDF/image files, report count, file types, discernible date range.
2. Extract key fields from each file — vendor, date, invoice #, amount, description; flag files where extraction fails.
3. Determine organisation strategy — by vendor / category / date period / tax category; ask user if not specified, offer a default (`Year/Category/Vendor`).
4. Create standardised filenames — `YYYY-MM-DD Vendor - Invoice - Description.ext`; remove special chars, preserve extension.
5. Show plan preview (proposed folder tree + before/after sample renames) and request approval before touching files.
6. Execute — copy (not move) originals into new structure; offer move as opt-in.
7. Generate CSV summary (`Date, Vendor, Invoice #, Description, Amount, Category, File Path`) and completion report (count, date range, total amount, flagged files, next steps).
**Strip**: "Examples" section (4 verbose worked examples); "Pro Tips"; "Common Organisation Patterns"; "Automation Setup"; "Related Use Cases" (marketing copy); attribution byline in Example 1. Inline special-case handling (missing info, duplicates, multi-page) into step 2 as brief notes rather than a separate section.
**Structure/format**: Well-structured — numbered instructional steps are the core SOP, bash snippets are illustrative not prescriptive, markdown output templates are concrete and reusable. The preview-then-approve safety pattern is a keeper.
**Notes**: The filename convention and the plan-preview-before-execute guard are the two highest-value portable artefacts. Trim to the 7-step core plus the filename convention and the three special-case fallbacks (missing info → flag + mtime fallback; duplicates → hash-compare; multi-page → note in CSV). Everything else is padding.

## skills/spreadsheet-formula-helper/SKILL.md
**Type**: Domain skill — spreadsheet formula authoring and debugging (Excel / Google Sheets).
**Portable**: Yes — pure methodology; no repo-specific tooling, paths, or APIs.
**Reason**: The five-step workflow (restate → draft → explain → edge-cases → variants) is a clean, transferable SOP for any assistant that needs to produce reliable formulas. The input-gathering checklist and output contract are well-scoped.
**Trigger**: User needs a formula written, debugged, or ported between Excel and Google Sheets; asks about pivot tables, array formulas, or dialect translation.
**Steps/contract**: 5 steps — (1) restate problem with explicit ranges, (2) draft formula preferring dynamic arrays, (3) explain placement + named ranges, (4) handle edge cases (blanks, types, dates, duplicates) with IFERROR/LET/LAMBDA guards, (5) provide Excel and Sheets variants when porting. Output: primary formula + short explanation + 2–3 row worked example; optional troubleshooting checklist.
**Strip**: Nothing needs stripping — no repo-specific references or proprietary context.
**Structure/format**: Concise YAML frontmatter → Inputs section → numbered Workflow → Output contract. Clean and easy to adopt.
**Notes**: Minor gap — does not mention locale/separator handling explicitly in the workflow steps (only in the inputs list); a port could fold that into step 1. Otherwise production-ready as-is.

## theme-factory/SKILL.md
**Type**: skill
**Portable**: partial
**Reason**: The workflow pattern (show palette → elicit choice → apply consistently) is fully portable and artifact-agnostic. However, the skill hard-couples its value to a local `theme-showcase.pdf` and a `themes/` directory of spec files that do not travel with the skill text — without those assets the 10 named themes are only labels, not actionable specs. A stripped version that documents the palette/font data inline would be fully portable.
**Trigger**: When user wants to style an artifact (slides, doc, HTML page, report, etc.) with a cohesive visual theme and either chooses from a preset list or requests a custom theme.
**Steps/contract**:
1. Display the theme showcase (or enumerate available themes) so the user can make an informed choice.
2. Ask which theme to apply; wait for explicit selection.
3. Read the selected theme's spec (colors + font pairings).
4. Apply chosen palette and fonts consistently throughout the artifact; verify contrast and readability.
5. If no preset fits, elicit a brief description, generate a named custom theme, show it for review, then apply.
**Strip**: References to `theme-showcase.pdf` and the local `themes/` directory (repo-local assets); the 10 hard-coded theme names (useful as examples/hints but not canonical — any repo can supply its own set).
**Structure/format**: Simple numbered workflow with a clear "show → choose → apply" loop. The "Create your Own Theme" fallback is a valuable pattern: accept a description → generate a spec → review → apply. No formal output template is specified beyond "apply consistently throughout."
**Notes**: The "show palette before asking" step is a good UX heuristic that prevents the blind-choice failure mode. The custom-theme generation path is the most portable and reusable piece — it turns any vague style description into a concrete spec before applying. Worth extracting as a standalone sub-procedure in a theme SOP. The 10 named themes are illustrative; a portable SOP should treat them as examples rather than a fixed catalogue.

## skills/video-downloader/SKILL.md
**Type**: skill (tool-wrapper / utility)
**Portable**: no
**Reason**: The entire skill is a thin wrapper around a bundled Python script (`scripts/download_video.py`) that hard-codes a platform-specific output path (`/mnt/user-data/outputs/`) — a path that only exists in the Codex sandbox environment. There is no transferable reasoning protocol, decision logic, or procedural contract; the "skill" is effectively documentation for a single Python CLI script.
**Trigger**: User asks to download, save, or grab YouTube videos.
**Steps/contract**: No multi-step agent procedure. The SKILL.md is purely usage documentation: invoke `python scripts/download_video.py <URL>` with optional `-q`, `-f`, `-a`, `-o` flags; yt-dlp auto-installs; output lands in `/mnt/user-data/outputs/`.
**Strip**: Everything — the output path, the bundled script dependency, and the yt-dlp auto-install assumption are all environment-specific and non-portable.
**Structure/format**: Usage-documentation format (Quick Start → Options → Examples → How It Works → Notes). No trigger logic, no decision tree, no quality gates. Not a procedural SOP template.
**Notes**: Not a candidate for promotion. The skill conflates "how to use a CLI tool" with "agent procedure". Any portable residue (e.g., "prefer yt-dlp over youtube-dl; auto-install if absent; skip playlists by default") is too thin to warrant a standalone SOP entry. Could at most contribute a one-liner to a generic "media-download" tool-selection note.

## skills/slack-gif-creator/SKILL.md
**Type**: skill
**Portable**: partial
**Reason**: The Slack platform constraints (exact size/dimension/FPS/color-count specs for message vs emoji GIFs), the optimization decision trees, and the 3-phase animation design philosophy (anticipation → action → reaction) are fully platform/language-agnostic. The entire implementation layer is tightly coupled to Python (Pillow, imageio, numpy) and repo-internal module paths (`from core.gif_builder`, `from templates.shake`, etc.), making the code examples non-portable as-is.
**Trigger**: When a user asks to create an animated GIF for Slack — either a message GIF or a custom emoji.
**Steps/contract**:
1. Understand creative vision — what happens, what's the mood?
2. Design animation in phases: anticipation → action → reaction.
3. Apply composable animation primitives (shake, bounce, pulse, slide, zoom, explode, wiggle, flip, morph, move, kaleidoscope) as needed.
4. Validate against Slack constraints: message GIF ≤2MB at 480×480px / 15–20fps / 128–256 colors; emoji GIF ≤64KB at 128×128px / 10–12fps / 32–48 colors / 10–15 frames.
5. Iterate if over limits: reduce frames/colors first, then dimensions, then complexity (avoid gradients for emoji GIFs).
**Strip**: All Python import statements and module paths (`from core.*`, `from templates.*`), pip install block, PIL/imageio/numpy-specific API calls, repo-internal `GIFBuilder` class usage.
**Structure/format**: Large toolkit reference doc organized as: constraints table → validator API → animation primitives catalog (each with code) → helper utilities → optimization strategies → example compositions → philosophy. The constraints table and optimization decision trees are the most portable sections; the code examples are implementation-specific but structurally illustrate the primitives well.
**Notes**: The Slack constraint numbers are the highest-value portable content — empirical platform limits (64KB emoji hard cap, 480×480 message dim, color quantization thresholds) that any implementation in any language must respect. The "emoji GIFs are challenging" callout with its 5-point strategy list is particularly reusable. The 3-phase animation design structure (understand vision → design phases → apply primitives → validate → iterate) maps cleanly to a language-agnostic SOP. The composable primitives catalog (12 named motion types with composition examples) is a strong design vocabulary worth preserving abstractly.

## skills/support-ticket-triage/SKILL.md
**Type**: Workflow SOP  
**Portable**: Yes  
**Reason**: Generic support-ops process — parse → categorise → draft reply → internal notes → structured output. No platform-specific API calls; works across Zendesk, Intercom, Help Scout, pasted threads, or any ticket source.  
**Trigger**: User pastes or references a support ticket, email thread, or chat export and wants triage, categorisation, or a drafted response.  
**Steps/contract**: (1) Gather ticket text + product area + customer tier. (2) Parse severity/impact/reproduction hints. (3) Categorise with priority P0–P3 + justification. (4) Draft acknowledgment reply if requested (empathy, restatement, next steps, missing-info asks, repro checklist). (5) Produce internal notes (root cause hypothesis, logs needed, teams to loop, tracking IDs). (6) Deliver tabular/bullet summary: Category | Priority | Summary | Proposed Fix | Reply Draft.  
**Strip**: Platform brand names in description (Zendesk/Intercom/Help Scout) — list as examples, not requirements.  
**Notes**: Strong quality-gate rules (no ETAs without data, PII masking, multi-hypothesis output when signal is weak). Solid standalone SOP; pairs well with `issue-triage` (engineering bug path) and `doc-internal-comms` (escalation write-ups).

## skills/connect/SKILL.md
**Type**: Vendor integration setup guide (Composio SDK tutorial)
**Portable**: No
**Reason**: Entirely built around the Composio third-party platform — API key, SDK install, `session.mcp.url` wiring, OAuth delegation. There is no transferable methodology, heuristic, or workflow pattern that survives stripping the vendor. The philosophical framing ("take real actions instead of generating text about what to do") is a trivially true principle already implicit in good agentic design, not a novel SOP.
**Trigger**: Agent needs to execute side-effects against external services (email, Slack, GitHub, databases, etc.)
**Steps/contract**: (1) Obtain Composio API key → (2) `export COMPOSIO_API_KEY` → (3) install SDK → (4) create session, inject `mcp_servers` options → (5) OAuth prompt on first use → (6) action executes via Tool Router
**Strip**: All of it — Composio setup, UTM links, badge HTML, marketing copy ("Join 20,000+ developers"), framework support table
**Notes**: No portable SOP extractable. Skip.
