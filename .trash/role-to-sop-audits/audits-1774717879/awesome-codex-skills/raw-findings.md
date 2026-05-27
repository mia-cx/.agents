
## awesome-codex-skills/gh-address-comments/SKILL.md
**Type:** Workflow (interactive PR comment triage)
**Portable:** Partial
**Reason:** Core workflow (fetch PR comments → summarise → let user select → apply fixes) is universally useful, but Step 1 hardcodes a repo-specific helper (`scripts/fetch_comments.py`) that won't exist in other repos. Without that script the skill falls back to `gh` CLI commands, which are fully portable.
**Trigger:** User wants to address/resolve review or issue comments on an open GitHub PR for the current branch.
**Steps/contract:**
1. Verify `gh` auth (`gh auth status`); prompt login if not authenticated.
2. Fetch all PR comments & review threads (via `scripts/fetch_comments.py` or fallback `gh` commands).
3. Number threads, print short fix-summary for each; ask user which to address.
4. Apply fixes for selected comments.
**Strip:** Remove hardcoded reference to `scripts/fetch_comments.py`; replace with a portable `gh pr view --json reviews,comments` fallback. Remove Codex-specific `sandbox_permissions` escalation note.
**Structure/format:** Minimal prose + numbered steps. Prereq block for auth check. Good skeleton; needs the repo-specific hook removed.
**Notes:** Complements the existing `pr-resolve-discussions` skill but is lighter-weight (no parallel sub-agents). Worth merging the auth-check pattern and user-selection loop into that skill rather than promoting as a standalone.

## create-plan/SKILL.md
**Type:** Planning workflow (read-only codebase scan → structured plan output)
**Portable:** Yes
**Reason:** Entirely repo-agnostic. Workflow operates read-only and produces a templated markdown plan; no assumptions about language, framework, or tooling beyond "scan README/docs first."
**Trigger:** User explicitly asks for a plan related to a coding task.
**Steps/contract:** (1) Scan context (README, docs, relevant files, constraints). (2) Ask at most 1–2 blocking follow-ups; prefer multiple-choice; assume when not blocked. (3) Emit plan using a fixed template: intent paragraph → Scope (in/out) → Action items checklist (6–10, verb-first, atomic, ordered discovery→changes→tests→rollout) → Open questions (max 3). (4) Output plan only — no meta-commentary preamble.
**Strip:** Nothing repo-specific present; skill is already clean.
**Structure/format:** Strong. Provides a literal markdown template with prescribed section names and item count ranges. Checklist guidance distinguishes good vs. bad items (concrete file paths, named validations vs. vague/micro-steps). Read-only constraint is explicit.
**Notes:** High-quality, tight SOP. The "ask only if blocking, prefer multiple-choice, assume otherwise" heuristic and the read-only constraint are worth preserving verbatim. The verb-first + ordered (discovery → changes → tests → rollout) checklist discipline is a portable best practice applicable beyond coding plans. Minor consideration: the template hard-codes 6-item placeholders; the prose says 6–10, so the template is illustrative, not limiting.

## gh-fix-ci/SKILL.md
**Type:** Agentic workflow (CI debugging + fix)
**Portable:** Yes — with caveats
**Reason:** Solid, well-scoped SOP for diagnosing failing GitHub Actions on a PR. The 8-step workflow is clear and sequential; gh-auth prereq, PR resolution, log fetching, scoping of external checks, plan-then-approve gate, and recheck loop are all good practice. Primary portability concern: the workflow depends on a bundled Python script (`scripts/inspect_pr_checks.py`) that ships with the skill — without that script, the "preferred" path is unavailable and only the manual fallback works. The manual fallback is fully described, so the SOP is usable without the script, but the dependency should be stripped or made optional in a portable version.
**Trigger:** User asks to debug or fix failing PR CI/CD checks on GitHub Actions.
**Steps/contract:**
1. Verify `gh` auth (escalated scopes: workflow/repo)
2. Resolve target PR (current branch or user-supplied number/URL)
3. Fetch failing check logs — preferred: bundled Python script; fallback: `gh pr checks`, `gh run view`, `gh api` job logs
4. Scope non-GitHub-Actions checks as external; report URL only
5. Summarise failure (check name, run URL, log snippet)
6. Draft fix plan via `plan` skill; request user approval
7. Implement after approval; summarise diffs/tests
8. Recheck: suggest re-run + `gh pr checks`
**Strip:** Remove references to `plan` skill dependency (replace with inline "draft a concise fix plan and request approval" instruction). Remove bundled-script path or note it as optional; keep the manual `gh` fallback as the canonical path. Remove `sandbox_permissions=require_escalated` Codex-specific scaffolding.
**Structure/format:** Well-structured: Overview → Inputs → Quick start → Workflow (numbered) → Bundled Resources. Clean and easy to follow.
**Notes:** The scoping rule for non-GitHub-Actions checks (label as external, report URL only) is a strong portable policy worth keeping verbatim. Explicit user-approval gate before implementation is good SOP hygiene. The `gh` field-drift handling note (rerun with available fields if a field is rejected) is a useful resilience tip to preserve.

## content-research-writer/SKILL.md
**Type:** Collaborative workflow / writing assistant
**Portable:** Partial
**Reason:** Core process (outlining → research → hook → section feedback → voice preservation → citation management → final review) is a solid reusable SOP. However, roughly 40 % of the file is repo-specific tooling advice (VS Code preference, `mkdir ~/writing/…`, file-versioning tips, Teresa Torres name-drop) and verbose worked examples that add bulk without adding contract value.
**Trigger:** User wants to write an article, blog post, newsletter, tutorial, case study, or thought-leadership piece; asks for help outlining, researching, improving a hook, or getting section-by-section feedback.
**Steps/contract:**
1. Clarify project (topic, audience, format, goal, sources, voice).
2. Co-produce a structured outline (hook → intro → sections → conclusion → research to-do).
3. Research on demand — extract findings, quotes, and citations in requested format (inline / numbered / footnote).
4. Improve hooks — analyse current hook, offer 3 typed alternatives (bold claim / story / data) with rationale.
5. Section feedback loop — structured report: what works ✓, clarity/flow/evidence/style suggestions, line edits, questions.
6. Preserve writer's voice — suggest rather than override; periodically ask "does this sound like you?".
7. Final review — overall assessment, structure/content/technical/readability evaluation, pre-publish checklist.
**Strip:** VS Code / terminal setup advice, Teresa Torres example persona, file-organisation tree, "Pro Tips" tooling list, verbose worked examples (Examples 1–4 can collapse to a one-liner each), "Related Use Cases" tail section.
**Structure/format:** Well-structured with named phases, clear markdown templates for each output type (outline, research block, hook options, section feedback, full review), and a pre-publish checklist — all reusable as-is.
**Notes:** The citation-management section (three style variants with running references list) is particularly strong and rarely spelled out this clearly in other skills — worth preserving verbatim. Voice-preservation principles are also portable and not commonly documented. Recommend promoting as a trimmed skill with the 7-step contract above.

## support-ticket-triage/SKILL.md
**Type:** Domain workflow (customer support ops)
**Portable:** Yes
**Reason:** Pure process — no Zendesk/Intercom/Help Scout API calls, no tool bindings. The workflow is a structured classification + response-drafting loop that applies to any ticket text regardless of platform.
**Trigger:** User pastes or references support tickets, emails, or chat threads and wants triage, categorisation, priority assignment, or a drafted reply.
**Steps/contract:** (1) Parse context — issue type, severity, customer impact, reproduction hints, blockers. (2) Categorise — assign category/subcategory + priority P0–P3 with justification. (3) Draft response if requested — acknowledgment, empathy, restate, next steps, missing-info ask, reproduction checklist. (4) Internal notes — root cause hypothesis, logs to pull, teams to loop, tracking IDs. (5) Output structured summary: Category / Priority / Summary / Proposed Fix/Next Steps / Reply Draft.
**Strip:** Platform names in the description (Zendesk, Intercom, Help Scout) — these are examples, not requirements; strip from skill body or demote to examples list.
**Structure/format:** Tabular or bullet summary; five named fields. Quality-check rules are well-specified (no ETAs unless given, mask PII, present 2–3 hypotheses when signal is weak).
**Notes:** Solid, self-contained SOP. Quality checks are unusually concrete (PII masking, hedge-instead-of-promise, disambiguation heuristic). Minor lift needed: "Inputs to gather" reads as an interactive prompt to the user — rephrase as preconditions the agent should check or infer, consistent with positive/action framing preference.

## meeting-notes-and-actions/SKILL.md
**Type:** document-processing / summarisation
**Portable:** Yes
**Reason:** Pure text-transformation task — no repo structure, toolchain, or service dependencies. Works on any transcript or rough notes regardless of project type.
**Trigger:** User provides a meeting transcript, call notes, Zoom/Meet/Teams export, or long meeting chat and wants structured summary/action items.
**Steps/contract:** (1) Clarify inputs: source text/file, meeting title/date, attendees, output style, redaction rules. (2) Normalize text: strip noisy timestamps/speaker labels, clean filler, preserve quotes. (3) Extract essentials: agenda topics, decisions, open questions, risks. (4) Build action items: owner + what + when; propose due dates if absent. (5) Produce structured output (Summary / Decisions / Open Questions & Risks / Action Items with checkboxes). (6) QA: name consistency, no hallucinated facts, flag ambiguities. Optional: timeline of moments; Slack/email-ready 2–3-sentence blurb.
**Strip:** Nothing significant — workflow steps and output schema are the value. Attendee-handle convention is generic enough to keep.
**Structure/format:** Structured Markdown output with fixed sections (Summary, Decisions, Open Questions/Risks, Action Items). Optional Slack/email blurb is a nice add-on.
**Notes:** Solid, self-contained skill. The "propose due dates if missing" heuristic and Slack-blurb extras are genuinely useful. Could be strengthened by specifying how to handle multi-track agendas or back-to-back meetings in one transcript.

## skill-creator/SKILL.md / **Meta-skill / Skill Authoring SOP** / **Portable: Yes** / **Reason**: Fully generic skill-authoring workflow with no Codex-specific tool dependencies in the prose; the 6-step creation process, progressive-disclosure design pattern, and degrees-of-freedom taxonomy are universally applicable to any agent skill system / **Trigger**: User wants to create a new skill, update an existing skill, or extend an agent's capabilities with a specialised workflow / **Steps/contract**: (1) Understand with concrete examples → (2) Plan reusable contents (scripts/references/assets) → (3) Init scaffold → (4) Edit SKILL.md + resources → (5) Package/validate → (6) Iterate on real usage; bundled `init_skill.py` / `package_skill.py` scripts are Codex-specific and must be stripped / **Strip**: `init_skill.py` / `package_skill.py` bash invocations; Codex brand references; `.skill` packaging format; "scripts may be executed without loading into context window" (Codex sandbox capability) / **Structure/format**: Long-form Markdown reference doc (~500 lines); well-structured with H2/H3 hierarchy; includes code-block directory trees, pseudocode patterns, and inline examples — good template to follow for the promoted skill / **Notes**: Contains the strongest portable design principles found so far: progressive-disclosure 3-level loading (metadata → SKILL.md body → bundled resources), degrees-of-freedom taxonomy (high/medium/low freedom matched to task fragility), and the "context window is a public good" axiom. The 6-step process maps cleanly onto the existing `skill-create` skill but with better rationale for *why* each step exists. Recommend merging these principles into the promoted SOP rather than adopting the Codex-specific tooling.

## awesome-codex-skills/changelog-generator/SKILL.md
**Type:** Domain skill (git / release workflow)
**Portable:** Partial
**Reason:** Core mechanic — `git log` → categorise → translate to user-facing prose → format — is universally applicable across repos and stacks. However the skill is description-only (no runnable steps, no commands, no prompt template); it reads as marketing copy rather than an actionable SOP.
**Trigger:** User asks to generate a changelog, release notes, or product-update summary from git commit history; mentions "changelog", "release notes", "weekly update", "app store description".
**Steps/contract:**
1. Determine scope: date range (`--since`/`--until`) or tag range (`vX..vY`).
2. Run `git log` with appropriate flags to capture commit messages.
3. Filter noise: exclude refactor, test, chore, ci, docs-only commits.
4. Categorise remaining commits: Features / Improvements / Bug Fixes / Breaking Changes / Security.
5. Translate each commit from technical phrasing to customer-facing language.
6. Format under the appropriate emoji-headed section headings.
7. Optionally apply a project-specific `CHANGELOG_STYLE.md` for voice/format overrides.
8. Write output to `CHANGELOG.md` or return inline for review.
**Strip:** Author attribution ("Inspired by: Manik Aggarwal / Lenny's Newsletter"), marketing superlatives ("turns hours into minutes"), app-store-specific framing, "Related Use Cases" section (scope creep — those are downstream consumers, not part of the SOP).
**Structure/format:** Skill has a clean `name`/`description` YAML front-matter, prose "When to Use" and "What it Does" sections, example invocations, and a worked example with expected output. No formal steps block or prompt template. Steps must be inferred and written from scratch to produce a usable SOP.
**Notes:** Overlaps heavily with the existing `release` skill in this repo (`skills/release/SKILL.md`), which covers `changeset version` + GitHub release notes. This skill targets the simpler "raw git log → human prose" path without changesets, so it occupies a distinct but adjacent niche. Worth extracting as a lightweight complementary skill (or a sub-step within `release`) rather than a top-level SOP. The worked example output format (emoji-headed H2 sections) is a concrete, portable default worth preserving.

## awesome-codex-skills/webapp-testing/SKILL.md
**Type:** Tool-use / Testing protocol
**Portable:** Partial — core pattern is portable; `scripts/with_server.py` helper is repo-local
**Reason:** The reconnaissance-then-action pattern, networkidle wait discipline, and Playwright script structure are genuinely reusable across projects. The `with_server.py` helper and `examples/` reference files are tied to a specific repo layout and cannot be lifted as-is.
**Trigger:** User asks to test a local web app, verify frontend behaviour, capture screenshots, or view browser logs using Playwright.
**Steps/contract:**
1. Determine if target is static HTML or dynamic webapp.
2. For dynamic: check if server is already running; if not, start it (via helper or manually).
3. Reconnaissance: navigate → `wait_for_load_state('networkidle')` → screenshot / inspect DOM → identify selectors.
4. Execute actions with discovered selectors; close browser when done.
**Strip:** References to `scripts/with_server.py`, `examples/` directory, and the "bundled scripts as black boxes" guidance — all are repo-specific assets, not portable SOP.
**Structure/format:** Decision-tree flowchart + code snippets + pitfall callout + best-practices list. Clear and scannable; decision tree is the strongest structural element.
**Notes:** The mandatory `networkidle` wait before any DOM inspection is the single highest-value portable rule here. The decision tree (static vs dynamic, server running vs not) is a solid reusable scaffold. Existing skill at `skills/test-webapp/SKILL.md` already covers this domain — evaluate whether this adds anything not already captured there before promoting.

## mcp-builder/reference/evaluation.md / **Reference / Process Guide** / **Partially** / Detailed protocol for authoring QA evaluation suites that test MCP server quality via LLM-driven tool calls; the evaluation harness (Python script, XML format, CLI flags) is implementation-specific, but the question/answer design principles are portable to any tool-quality eval workflow / **Trigger**: when evaluating MCP server tool quality, generating eval suites, or assessing LLM-usability of any tool-based API / **Steps/contract**: (1) Inspect API docs and tool schemas (no code reading); (2) Explore content with read-only tool calls (paginated, limit <10); (3) Generate 10 QA pairs satisfying: independent, non-destructive, multi-hop, no keyword shortcut, stable/stationary answers, single verifiable value, human-readable format; (4) Self-verify each answer using the MCP tools; (5) Remove any pair requiring write/destructive ops; output as XML `<evaluation><qa_pair><question>…</question><answer>…</answer></qa_pair></evaluation>` / **Strip**: Python harness setup (pip install, OPENAI_API_KEY), CLI flags for `evaluation.py`, transport-type details (stdio/sse/http), troubleshooting section — all tool-execution scaffolding is local to this repo / **Structure/format**: Well-structured with Quick Reference box, numbered guidelines per phase, good/poor question examples with rationale, XML output schema; all principles are clearly labelled and scannable / **Notes**: The question-design rules (stability, no keyword search, multi-hop, diversity of answer modalities, ambiguity with single correct answer) are the highest-value portable content — applicable to any eval harness, not just MCP. The 5-step process (docs → tool schema → read-only exploration → task generation → self-verification) is a reusable SOP for LLM eval authoring. Harness mechanics should be stripped before promotion.

## .references/awesome-codex-skills/mcp-builder/SKILL.md

**Type:** Procedural workflow (4-phase process)
**Portable:** Partial — structure and design principles are portable; live web-fetch steps and relative reference file paths are not
**Reason:** The MCP protocol design principles (agent-centric tool design, context budget awareness, actionable errors, evaluation-driven dev) are genuinely portable and transferable to any MCP server project. However, the skill as written leans heavily on sibling reference files (`./reference/mcp_best_practices.md`, `python_mcp_server.md`, `node_mcp_server.md`, `evaluation.md`) that do not travel with the skill — it is really a launcher that delegates to those files. The live web-fetch instructions (modelcontextprotocol.io, GitHub SDKs) are also ephemeral dependencies.
**Trigger:** User is building an MCP server to integrate an external API or service (Python/FastMCP or Node/TypeScript SDK).
**Steps/contract:**
  1. Phase 1 — Research & Planning: review agent-centric design principles; fetch MCP spec + SDK docs; exhaustively read target API docs; produce implementation plan (tool selection, I/O design, error strategy)
  2. Phase 2 — Implementation: scaffold project; implement shared infrastructure first; implement tools with input schemas (Pydantic/Zod), comprehensive docstrings, annotations, async I/O
  3. Phase 3 — Review & Refine: DRY/composability/consistency/type-safety code review; safe build/syntax verification; language-specific quality checklist
  4. Phase 4 — Evaluations: create 10 read-only, verifiable, complex, independent evaluation questions; output as XML `<evaluation><qa_pair>` format
**Strip:** All `./reference/…` relative file links (they don't exist in a portable context); web-fetch URLs (better as a note than hard-coded steps); Phase 1.2 is missing (numbering jumps 1.1→1.3); evaluation XML example references domain-specific content (Anthropic/ASL) that should be genericised
**Structure/format:** Detailed phased markdown with emoji section headers, checklists, inline links; well-structured but verbose; reference links are the primary portability blocker
**Notes:** The agent-centric design principles section (Phase 1.1) is the most portable and valuable part — it contains transferable heuristics not easily found elsewhere (workflow-over-endpoints, context budget, actionable errors, natural task subdivisions, evaluation-driven iteration). A portable extraction should lift those principles as standalone guidance and convert the reference-file dependencies into inline summaries or fetch instructions with fallback heuristics.

## `.references/awesome-codex-skills/mcp-builder/reference/mcp_best_practices.md`

**Type**: Reference/standards compilation — numbered best-practices guide covering the full MCP server development lifecycle (naming, tool design, response formats, pagination, character limits, transport, testing, security, error handling, docs, compliance)

**Portable**: Yes — all conventions apply universally to any MCP server regardless of the underlying service being integrated

**Reason**: Codifies concrete, actionable standards that are service-agnostic: naming patterns (`{service}_{action}_{resource}` snake_case), pagination contract (`has_more` / `next_offset` / `total_count`), CHARACTER_LIMIT=25 000 truncation pattern, dual response format (JSON for programmatic / Markdown for display), tool annotations (`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`), OAuth 2.1 token validation rules, stdio logging constraint (stderr only), and name-disambiguation strategies for multi-server environments

**Trigger**: Building or reviewing an MCP server; user asks about MCP tool design, naming conventions, pagination, security, or transport selection

**Steps/contract**: Not a procedural SOP — structured as 14 reference sections with quick-reference tables and code examples. Distillable into a checklist (naming → tool design → response format → pagination → truncation → transport → security → error handling → testing). The pagination response schema and truncation code snippet are the most copy-paste-ready artefacts.

**Strip**:
- Everything from the `---\n\n# Tools` divider to the end of the file — this is a verbatim copy of the official MCP docs (modelcontextprotocol.io) with JSX components (`<Tabs>`, `<Tab>`, `<Note>`) that are spec reference, not best-practices guidance, and largely duplicates the earlier sections
- The "Table of Contents" block (adds no content)
- The "Summary" paragraph (generic, adds nothing)

**Structure/format**: Two-part file. First ~270 lines: clean numbered-section Markdown with quick-reference callouts and one code example per pattern — high signal, skill-ready. Remaining ~400 lines: raw MCP spec docs with JSX component syntax — low signal for a skill context.

**Notes**: A live `mcp-builder` skill already exists at `skills/mcp-builder/SKILL.md`; this reference would enrich it. Highest-value unique additions over a bare skill: the CHARACTER_LIMIT=25 000 truncation pattern with `truncation_message` guidance, the pagination response contract JSON, the tool-annotation semantics table, the transport-selection criteria table, the name-disambiguation strategies (server-prefix, random-prefix, URI-prefix), and the explicit rule that MCP tool errors must be reported inside the result object (`isError: true` in content), not as protocol-level errors.

## notion-spec-to-implementation/reference/spec-parsing.md
**Type:** Reference / methodology guide
**Portable:** Partial — core parsing logic is portable; Notion-specific tool calls are not
**Reason:** The extraction strategies (requirement identification, categorisation, priority mapping, dependency identification, scope extraction, risk identification, spec quality assessment) are genuinely tool-agnostic. The find/fetch steps use `Notion:notion-search` / `Notion:notion-fetch` MCP tools and are not portable without substitution.
**Trigger:** Agent receives a specification document (any format — PRD, user-story doc, technical design, requirements list) and needs to derive a structured implementation plan from it.
**Steps/contract:**
1. Locate the spec (search or accept URL/path)
2. Fetch/read full content
3. Identify spec format (requirements-based, user-story, TDD, PRD)
4. Extract: functional requirements, non-functional requirements, acceptance criteria, priorities, dependencies, scope (in/out), risks, assumptions
5. Flag ambiguities → produce a "Clarifications Needed" block
6. Flag missing info → produce a "Missing Information" block
7. Flag conflicts → produce a "Conflicting Requirements" block
8. Validate criteria are testable (concrete, measurable)
9. Run parsing checklist before handing off to planner
**Strip:** Remove all `Notion:notion-search` / `Notion:notion-fetch` MCP calls and replace with a generic "locate and read spec" step (file path, URL, paste). Strip Notion-branded section titles.
**Structure/format:** Markdown with fenced code-block templates for each spec shape; inline checklists (☐); ❌/✓ testability examples. Clean and adoptable as-is after stripping Notion references.
**Notes:** Strongest portable value is the *extraction taxonomy* (functional / non-functional / constraint / priority tiers / scope / risk / ambiguity handling) and the *acceptance-criteria testability rule*. These are reusable across any spec-to-plan workflow regardless of tooling. The "Spec Quality Assessment" rubric (good vs. incomplete spec checklist) is a standout addition worth preserving verbatim.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/brand-guidelines/SKILL.md / **Type**: Skill / **Portable**: no / **Reason**: It is tied to OpenAI/Codex brand assets and visual identity rules, so the guidance is organization-specific rather than broadly reusable SOP content.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/canvas-design/SKILL.md / **Type**: Skill / **Portable**: no / **Reason**: It is an output-oriented art workflow for creating polished visual artifacts, which is too medium-specific to serve as a portable operational SOP.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/competitive-ads-extractor/SKILL.md / **Type**: Skill / **Portable**: no / **Reason**: It depends on ad-library scraping and marketing-analysis tooling, making it a niche research workflow instead of a transferable general policy.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/connect/SKILL.md / **Type**: Skill / **Portable**: no / **Reason**: It is coupled to Composio setup and external app integrations, so the instructions are vendor-specific rather than portable across contexts.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/connect-apps/SKILL.md / **Type**: Skill / **Portable**: no / **Reason**: It prescribes a specific plugin and OAuth flow for Composio-connected apps, which makes it implementation-specific instead of a general SOP.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/developer-growth-analysis/SKILL.md / **Type**: Skill / **Portable**: no / **Reason**: It is built around Codex chat history, Slack delivery, and Hacker News curation, so it is tightly bound to this toolchain and user environment.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/domain-name-brainstormer/SKILL.md / **Type**: Skill / **Portable**: no / **Reason**: It centers on interactive domain ideation and availability checks, which is a narrow naming workflow rather than a reusable operating procedure.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/file-organizer/SKILL.md / **Type**: Skill / **Portable**: no / **Reason**: It is a personal file-system cleanup assistant with OS-specific shell commands and discretionary judgment, so it does not generalize cleanly into a portable SOP.

## .references/awesome-codex-skills/email-draft-polish/SKILL.md
**Type:** Workflow (communication/writing)
**Portable:** Yes
**Reason:** Pure writing workflow — no repo, language, or toolchain dependencies; applies to any email context.
**Trigger:** User wants to draft, rewrite, condense, or polish an email (cold outreach, reply, status update, escalation).
**Steps/contract:** (1) Elicit goal/audience/tone/length/CTA/constraints; (2) Outline key points; (3) Draft with subject + short paragraphs, CTA surfaced early; (4) Offer 2–3 tone/length variants when ask is vague; (5) QA for hedging, jargon, names/links, over-promising.
**Strip:** Nothing — skill is already lean; no repo-specific references.
**Structure/format:** Output: subject line → greeting → body → closing/signature placeholder; optional TL;DR + bullet summary for chat.
**Notes:** Solid, well-structured workflow. The "variants" step adds real value for ambiguous requests. QA checklist (hedging, jargon, over-promising) is a portable best-practice worth preserving verbatim.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/image-enhancer/SKILL.md / **Type**: Media utility / **Portable**: no / **Reason**: This is a narrow image-quality enhancement workflow for screenshots and photos, so it does not generalize into a reusable cross-repo SOP.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/internal-comms/SKILL.md / **Type**: Content writing workflow / **Portable**: no / **Reason**: It is tailored to internal communication formats and company-specific example files, which makes it too context-bound for portable SOP extraction.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/invoice-organizer/SKILL.md / **Type**: File organization workflow / **Portable**: no / **Reason**: The skill is built around invoice and receipt taxonomy, file naming, and tax prep conventions, which are domain-specific rather than broadly portable.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/langsmith-fetch/SKILL.md / **Type**: Debugging workflow / **Portable**: no / **Reason**: It depends on LangSmith-specific trace commands, environment variables, and debugging conventions, so it cannot be reused as a general SOP.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/lead-research-assistant/SKILL.md / **Type**: Research workflow / **Portable**: no / **Reason**: The process is optimized for sales lead generation and ICP-based prospecting, which is a specialized business use case rather than a generic operating procedure.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/linear/SKILL.md / **Type**: Product management workflow / **Portable**: no / **Reason**: It is tied to Linear MCP setup and Linear-specific issue/project operations, so the workflow is platform-bound instead of portable.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/meeting-insights-analyzer/SKILL.md / **Type**: Analysis workflow / **Portable**: no / **Reason**: This skill is centered on transcript analysis for communication coaching, which is a narrow personal-development use case rather than a general SOP.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/notion-knowledge-capture/SKILL.md / **Type**: Knowledge-management workflow / **Portable**: no / **Reason**: It is explicitly built around Notion MCP actions, Notion database schemas, and page templates, making it dependent on a specific external platform.

## .references/awesome-codex-skills/mcp-builder/reference/node_mcp_server.md / **Type:** Reference / implementation guide / **Portable:** no / **Reason:** The guidance is tightly coupled to Node/TypeScript, the MCP TypeScript SDK, Zod schemas, and a specific package/file layout, so it cannot be lifted unchanged into other runtimes or project structures.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/tailored-resume-generator/SKILL.md / **Type**: skill / **Portable**: no / **Reason**: It is tightly scoped to resume tailoring for a specific job description, so the guidance depends on applicant context and hiring goals.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/theme-factory/SKILL.md / **Type**: skill / **Portable**: no / **Reason**: It depends on a repo-specific theme showcase and directory layout, making it coupled to this artifact workflow rather than broadly reusable.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/video-downloader/SKILL.md / **Type**: skill / **Portable**: no / **Reason**: It is built around a particular YouTube downloader script, output path, and format options, so the instructions are implementation-specific.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/internal-comms/examples/3p-updates.md / **Type**: example / **Portable**: no / **Reason**: It targets a company-specific 3P update format that assumes internal tools, audience, and weekly reporting cadence.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/internal-comms/examples/company-newsletter.md / **Type**: example / **Portable**: no / **Reason**: It is tailored to a company-wide newsletter workflow with internal data sources and communication norms.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/internal-comms/examples/faq-answers.md / **Type**: example / **Portable**: no / **Reason**: It is designed for company-internal FAQs and relies on organizational communications and official responses.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/internal-comms/examples/general-comms.md / **Type**: example / **Portable**: no / **Reason**: It assumes an internal company communications context and asks for audience, purpose, and tone before drafting.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/mcp-builder/reference/python_mcp_server.md / **Type**: reference / **Portable**: no / **Reason**: It is a Python-specific MCP SDK implementation guide with language- and framework-specific conventions.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/notion-meeting-intelligence/SKILL.md
**Type:** Notion workflow (meeting prep)
**Portable:** no
**Reason:** The workflow is built around Notion MCP tools and Notion-specific template/reference paths, so it cannot be reused as-is outside a Notion-connected environment.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/notion-research-documentation/SKILL.md
**Type:** Notion research workflow
**Portable:** no
**Reason:** It depends on Notion search/fetch/create/update MCP calls plus Notion template and citation references, making the process tightly coupled to Notion.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/notion-spec-to-implementation/SKILL.md
**Type:** Notion implementation workflow
**Portable:** no
**Reason:** The skill assumes a Notion spec, Notion task database, and linked page updates, so its core contract only works in a Notion workspace.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/raffle-winner-picker/SKILL.md
**Type:** Selection utility
**Portable:** no
**Reason:** It is narrowly tailored to raffle and giveaway selection across lists, spreadsheets, and Google Sheets, so it is a task-specific utility rather than a general reusable SOP.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/skill-installer/SKILL.md
**Type:** Tooling workflow (skill installation)
**Portable:** no
**Reason:** The workflow is defined around Codex skill installation scripts and `$CODEX_HOME`, so it is specific to the Codex skill ecosystem.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/skill-share/SKILL.md
**Type:** Creation + distribution workflow
**Portable:** no
**Reason:** It combines skill creation with Slack sharing via Rube, which makes the process dependent on a specific internal integration and delivery channel.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/slack-gif-creator/SKILL.md
**Type:** Media creation toolkit
**Portable:** no
**Reason:** The content is centered on Slack-specific GIF constraints, validators, and emoji requirements, so the core guidance is tied to a single destination platform.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills/spreadsheet-formula-helper/SKILL.md
**Type:** Spreadsheet formula workflow
**Portable:** no
**Reason:** It is explicitly scoped to Excel and Google Sheets formula syntax, locale rules, and spreadsheet layouts, making it platform-bound rather than broadly portable.
