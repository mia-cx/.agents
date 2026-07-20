# Audit: awesome-codex-skills → role-to-sop
**Compiled from:** `.plans/audits/awesome-codex-skills/raw-findings.md`
**Date:** 2026-03-28

---

## 1. Repo Overview

`awesome-codex-skills` is a community-curated library of agent skills built for OpenAI's Codex (and compatible Claude-style agent runtimes). The repo ships ~40+ skill files covering diverse domains — coding workflows, writing, research, media, ops, and tooling setup. Skills follow a consistent packaging convention: a `SKILL.md` prose file plus optional sibling reference documents and helper scripts bundled in subdirectories. The repo carries Codex-specific scaffolding throughout: `sandbox_permissions` escalation notes, `$CODEX_HOME`-relative paths, Codex brand assets, and helper scripts (`init_skill.py`, `package_skill.py`) that are only executable inside the Codex sandbox. Several skills are thin launchers that delegate to sibling reference files — they are not self-contained. Author attribution lines ("Inspired by: Manik Aggarwal / Lenny's Newsletter") appear in a subset of skills, indicating community contributions rather than a single-author corpus. The overall quality range is wide: a handful of skills are clean, tightly-scoped SOPs; others read as marketing copy with no actionable steps.

---

## 2. Content Summary

The repo contains three content layers: (1) **top-level workflow skills** — `SKILL.md` files for coding, writing, and ops tasks; (2) **reference documents** — Markdown guides bundled inside skill subdirectories (e.g., `mcp-builder/reference/`); and (3) **examples and templates** — worked-output samples and internal-comms templates, all tied to Codex or specific platforms (Notion, Slack, Composio, LangSmith, Linear). Roughly half the skills are domain-specific utilities (invoice organiser, video downloader, raffle picker, slack-gif creator) that are non-portable by design. The coding-adjacent skills (CI fix, PR comments, changelog, webapp testing) follow a numbered-steps format and are the highest-signal tier. Writing skills (content research writer, email polish, meeting notes, support triage) are generally self-contained and clean. The MCP-builder cluster is the largest cohesive sub-system: one launcher skill + three reference files + one evaluation guide, with the best-practices reference being the single most information-dense file in the corpus.

---

## 3. SOP Split

### Port

| Skill | Short reason |
|---|---|
| `create-plan/SKILL.md` | Fully repo-agnostic planning SOP; no strip needed; high-quality template with explicit read-only constraint and verb-first checklist discipline. |
| `gh-fix-ci/SKILL.md` | Solid CI-debug SOP; manual `gh` fallback is fully portable after removing bundled-script path and Codex sandbox escalation metadata. |
| `support-ticket-triage/SKILL.md` | Pure process; platform names (Zendesk, Intercom) are examples only; PII-masking and hedging QA rules are standout portable policy. |
| `meeting-notes-and-actions/SKILL.md` | Zero repo or toolchain dependencies; strong output schema with action-item ownership + proposed due-date heuristic. |
| `skill-creator/SKILL.md` | Meta-skill authoring SOP; the progressive-disclosure design pattern and degrees-of-freedom taxonomy are the most portable design principles in the entire corpus; strip Codex tooling calls. |
| `mcp-builder/reference/mcp_best_practices.md` | Best-practices reference for any MCP server; CHARACTER_LIMIT=25 000 truncation pattern, pagination contract, and tool-annotation semantics table are portable artefacts not found elsewhere; strip JSX spec-docs tail (~400 lines). |
| `email-draft-polish/SKILL.md` | Already lean; pure writing workflow; QA checklist (hedging, jargon, over-promising) is verbatim portable. |
| `content-research-writer/SKILL.md` (trimmed) | 7-step editorial contract is strong; citation-management section and voice-preservation principles are rarely documented elsewhere; strip ~40% tooling/example bulk. |
| `mcp-builder/reference/evaluation.md` (trimmed) | QA-pair design rules (stability, multi-hop, no keyword shortcut, single verifiable value) are portable to any eval harness; strip Python harness and transport scaffolding. |
| `notion-spec-to-implementation/reference/spec-parsing.md` (trimmed) | Spec-extraction taxonomy and acceptance-criteria testability rules are tool-agnostic; strip Notion MCP calls, replace with generic "locate and read spec" step. |

### Leave out

| Skill | Short reason |
|---|---|
| `gh-address-comments/SKILL.md` | Core workflow (fetch → summarise → select → fix) is already covered by existing `pr-resolve-discussions` skill; primary value is an auth-check pattern worth merging, not a standalone skill. |
| `changelog-generator/SKILL.md` | Description-only; no runnable steps; overlaps with existing `release` skill; worth folding the emoji-headed output format as a sub-step, not promoting standalone. |
| `webapp-testing/SKILL.md` | Existing `test-webapp/SKILL.md` already covers this domain; primary new value is the `networkidle` wait rule — single-sentence addition to that skill, not a separate SOP. |
| `mcp-builder/SKILL.md` (launcher) | A reference-file launcher; the real value lives in `mcp_best_practices.md` and `evaluation.md`; its Phase 1.1 design principles should be merged into the existing `mcp-builder` skill rather than promoted standalone. |
| `brand-guidelines/SKILL.md` | Tied to OpenAI/Codex visual identity; organisation-specific, not transferable. |
| `canvas-design/SKILL.md` | Output-medium-specific art workflow; not an operational SOP. |
| `competitive-ads-extractor/SKILL.md` | Depends on ad-library scraping; niche marketing research, not general policy. |
| `connect/SKILL.md` + `connect-apps/SKILL.md` | Vendor-locked to Composio setup and OAuth flow. |
| `developer-growth-analysis/SKILL.md` | Tightly bound to Codex chat history, Slack, and Hacker News curation. |
| `domain-name-brainstormer/SKILL.md` | Narrow naming utility; not a reusable operating procedure. |
| `file-organizer/SKILL.md` | OS-specific shell commands and discretionary judgment; not portable. |
| `image-enhancer/SKILL.md` | Narrow image-quality enhancement; not a cross-repo SOP. |
| `internal-comms/SKILL.md` + examples | Company-specific communication formats; context-bound. |
| `invoice-organizer/SKILL.md` | Domain-specific tax-prep taxonomy; not broadly portable. |
| `langsmith-fetch/SKILL.md` | Depends on LangSmith trace commands and env vars. |
| `lead-research-assistant/SKILL.md` | Sales lead generation; specialised business use case. |
| `linear/SKILL.md` | Platform-bound to Linear MCP. |
| `meeting-insights-analyzer/SKILL.md` | Communication coaching use case; not a general SOP. |
| `notion-knowledge-capture/SKILL.md` | Notion MCP dependency throughout. |
| `notion-meeting-intelligence/SKILL.md` | Notion MCP + template paths; not portable outside Notion. |
| `notion-research-documentation/SKILL.md` | Notion search/fetch/create/update calls; platform-coupled. |
| `notion-spec-to-implementation/SKILL.md` | Assumes Notion workspace and task database. |
| `node_mcp_server.md` | Node/TypeScript SDK + Zod; language-specific, not portable to other runtimes. |
| `python_mcp_server.md` | Python FastMCP SDK; language-specific. |
| `raffle-winner-picker/SKILL.md` | Narrow utility; not a general SOP. |
| `skill-installer/SKILL.md` | Codex `$CODEX_HOME` installation scripts; ecosystem-specific. |
| `skill-share/SKILL.md` | Slack-via-Rube delivery integration; internal platform dependency. |
| `slack-gif-creator/SKILL.md` | Slack-specific GIF constraints; single-platform output. |
| `spreadsheet-formula-helper/SKILL.md` | Excel/Google Sheets syntax; platform-bound. |
| `tailored-resume-generator/SKILL.md` | Applicant-context dependent; not generalisable. |
| `theme-factory/SKILL.md` | Repo-specific theme showcase + directory layout dependency. |
| `video-downloader/SKILL.md` | Specific downloader script + output path; implementation-specific. |

---

## 4. Per-SOP Table (Portable Candidates)

| # | Source file | Trigger | Steps / contract | Quality bar | Escalation | Strip | Notes |
|---|---|---|---|---|---|---|---|
| 1 | `create-plan/SKILL.md` | User explicitly asks for a plan related to a coding task | (1) Scan README/docs/constraints read-only; (2) Ask ≤2 blocking follow-ups, prefer multiple-choice, assume otherwise; (3) Emit plan: Intent → Scope (in/out) → Action items checklist (6–10, verb-first, ordered discovery→changes→tests→rollout) → Open questions (max 3); (4) Output plan only — no meta-commentary preamble | Each checklist item names a concrete file path or named validation; no vague steps or micro-steps | None required | Nothing — skill is already clean | Read-only constraint is explicit; "ask only if blocking" heuristic and verb-first ordering discipline are verbatim-preservable best practices |
| 2 | `gh-fix-ci/SKILL.md` | User asks to debug or fix failing PR CI/CD checks on GitHub Actions | (1) Verify `gh` auth (workflow/repo scopes); (2) Resolve target PR (current branch or supplied number/URL); (3) Fetch failing check logs via `gh pr checks`, `gh run view`, `gh api`; (4) Scope non-GHA checks as external — report URL only; (5) Summarise failure (check name, run URL, log snippet); (6) Draft fix plan, request user approval; (7) Implement after approval, summarise diffs/tests; (8) Recheck with `gh pr checks` | User approval required before any implementation; non-GHA checks must be labelled external and not touched | `gh` auth prompt if not authenticated | Remove bundled-script path (`scripts/inspect_pr_checks.py`) — keep manual `gh` fallback as canonical; remove `sandbox_permissions=require_escalated`; remove `plan` skill dependency reference — inline as "draft a concise fix plan and request approval" | `gh` field-drift note (rerun with available fields if a field is rejected) is a useful resilience tip to preserve verbatim |
| 3 | `support-ticket-triage/SKILL.md` | User pastes or references support tickets, emails, or chat threads and wants triage, categorisation, priority assignment, or a drafted reply | (1) Parse context — issue type, severity, customer impact, reproduction hints, blockers; (2) Categorise — assign category/subcategory + priority P0–P3 with justification; (3) Draft response if requested — acknowledgment, empathy, restate, next steps, missing-info ask, reproduction checklist; (4) Internal notes — root cause hypothesis, logs to pull, teams to loop, tracking IDs; (5) Output structured summary: Category / Priority / Summary / Proposed Fix / Reply Draft | No ETAs unless explicitly given; PII must be masked; present 2–3 hypotheses when signal is weak; hedge instead of promise | None | Remove platform names (Zendesk, Intercom, Help Scout) from skill body — demote to examples list; rephrase "Inputs to gather" as preconditions the agent checks or infers (positive framing) | PII masking and disambiguation heuristic rules are unusually concrete — preserve verbatim |
| 4 | `meeting-notes-and-actions/SKILL.md` | User provides a meeting transcript, call notes, or export and wants structured summary/action items | (1) Clarify inputs: source text/file, title/date, attendees, output style, redaction rules; (2) Normalize: strip noisy timestamps/labels, clean filler, preserve quotes; (3) Extract: agenda topics, decisions, open questions, risks; (4) Build action items: owner + what + when; propose due dates if absent; (5) Produce: Summary / Decisions / Open Questions & Risks / Action Items (checkboxes); (6) QA: name consistency, no hallucinated facts, flag ambiguities; Optional: Slack/email 2–3-sentence blurb | No facts hallucinated; ambiguities flagged; name consistency checked | None | Nothing significant | "Propose due dates if missing" heuristic and Slack-blurb add-on are genuine extras; could be strengthened for multi-track agendas |
| 5 | `skill-creator/SKILL.md` | User wants to create a new skill, update an existing skill, or extend an agent's capabilities with a specialised workflow | (1) Understand with concrete examples; (2) Plan reusable contents (scripts/references/assets); (3) Init scaffold; (4) Edit SKILL.md + resources; (5) Package/validate; (6) Iterate on real usage | Progressive-disclosure loading respected (metadata → SKILL.md body → bundled resources); degrees-of-freedom taxonomy applied (high/medium/low freedom matched to task fragility) | None | Remove `init_skill.py` / `package_skill.py` bash invocations; remove Codex brand references; remove `.skill` packaging format; remove "scripts may be executed without loading into context window" (Codex sandbox capability) | Contains the strongest portable design principles in the corpus: progressive-disclosure 3-level loading and the "context window is a public good" axiom — preserve verbatim |
| 6 | `mcp-builder/reference/mcp_best_practices.md` | Building or reviewing an MCP server; user asks about tool design, naming, pagination, security, or transport | Not procedural — structured reference across 14 sections: naming → tool design → response format → pagination → truncation → transport → security → error handling → testing; distillable into a checklist | CHARACTER_LIMIT=25 000 per response; `has_more` / `next_offset` / `total_count` pagination contract; tool errors reported inside result object (`isError: true`), not as protocol-level errors; stdio logging to stderr only | None | Strip everything from the `---\n\n# Tools` divider to end of file (~400 lines of raw MCP spec JSX); strip Table of Contents and generic Summary paragraph | Highest-value unique additions to existing `mcp-builder` skill: truncation pattern, pagination JSON schema, tool-annotation semantics table, transport-selection criteria table, name-disambiguation strategies |
| 7 | `email-draft-polish/SKILL.md` | User wants to draft, rewrite, condense, or polish an email | (1) Elicit goal/audience/tone/length/CTA/constraints; (2) Outline key points; (3) Draft: subject line → short paragraphs, CTA surfaced early → closing/signature placeholder; (4) Offer 2–3 tone/length variants when request is vague; (5) QA: hedging, jargon, names/links, over-promising | No hedging language; no jargon; no over-promising; names/links verified | None | Nothing — already lean | "Variants" step for ambiguous requests adds real value; QA checklist is portable best practice verbatim |
| 8 | `content-research-writer/SKILL.md` (trimmed) | User wants to write an article, blog post, newsletter, tutorial, case study, or thought-leadership piece | (1) Clarify project (topic, audience, format, goal, sources, voice); (2) Co-produce structured outline (hook → intro → sections → conclusion → research to-do); (3) Research on demand — findings, quotes, citations in requested format; (4) Improve hooks — analyse current + offer 3 typed alternatives (bold claim / story / data) with rationale; (5) Section feedback loop: what works ✓, clarity/flow/evidence/style suggestions, line edits, questions; (6) Preserve writer's voice — suggest rather than override; periodically ask "does this sound like you?"; (7) Final review — overall assessment + pre-publish checklist | No voice override; 3 hook variants minimum; pre-publish checklist completed before signoff | None | Strip VS Code/terminal setup advice, Teresa Torres persona example, file-organisation tree, "Pro Tips" tooling list, verbose worked examples (Examples 1–4 collapse to one-liners), "Related Use Cases" tail section | Citation-management section (three style variants with running references list) is rarely spelled out elsewhere — preserve verbatim |
| 9 | `mcp-builder/reference/evaluation.md` (trimmed) | Evaluating MCP server tool quality; generating eval suites; assessing LLM-usability of any tool-based API | (1) Inspect API docs and tool schemas (no code reading); (2) Explore content with read-only tool calls (paginated, limit <10); (3) Generate 10 QA pairs: independent, non-destructive, multi-hop, no keyword shortcut, stable/stationary answers, single verifiable value, human-readable format; (4) Self-verify each answer using MCP tools; (5) Remove any pair requiring write/destructive ops; output as XML `<evaluation><qa_pair><question>…</question><answer>…</answer></qa_pair></evaluation>` | Each pair must be independent, verifiable, multi-hop, stable, and non-destructive | None | Strip Python harness setup (pip install, OPENAI_API_KEY), CLI flags for `evaluation.py`, transport-type details, troubleshooting section | Question-design rules are portable to any eval harness, not just MCP; 5-step process (docs → schema → read-only exploration → generation → self-verification) is a reusable eval-authoring SOP |
| 10 | `notion-spec-to-implementation/reference/spec-parsing.md` (trimmed) | Agent receives a specification document (PRD, user-story doc, technical design, requirements list) and needs to derive a structured implementation plan | (1) Locate and read spec (file path, URL, or paste — generic); (2) Identify spec format (requirements-based, user-story, TDD, PRD); (3) Extract: functional requirements, non-functional requirements, acceptance criteria, priorities, dependencies, scope (in/out), risks, assumptions; (4) Flag ambiguities → "Clarifications Needed" block; (5) Flag missing info → "Missing Information" block; (6) Flag conflicts → "Conflicting Requirements" block; (7) Validate criteria are testable (concrete, measurable); (8) Run parsing checklist before handoff to planner | All acceptance criteria must be concrete and measurable; ambiguities, gaps, and conflicts surfaced as distinct named blocks | None | Remove all `Notion:notion-search` / `Notion:notion-fetch` MCP calls; replace with generic "locate and read spec" step; strip Notion-branded section titles | Extraction taxonomy (functional / non-functional / constraint / priority / scope / risk / ambiguity) and the Spec Quality Assessment rubric (good vs. incomplete spec checklist) are the standout portable artefacts |

---

## 5. Portability Ranking

### High

Skills that are usable as-is after stripping ≤3 lines of Codex-specific scaffolding. No structural rewrite needed.

- `create-plan/SKILL.md` — zero strip needed; strongest single SOP in the corpus
- `meeting-notes-and-actions/SKILL.md` — zero strip needed; self-contained
- `email-draft-polish/SKILL.md` — zero strip needed; already lean
- `support-ticket-triage/SKILL.md` — remove 3 platform names; rephrase one framing issue
- `mcp-builder/reference/mcp_best_practices.md` — strip the ~400-line JSX spec tail; first ~270 lines are skill-ready

### Medium

Skills with clearly isolable portable sections requiring a meaningful but bounded rewrite.

- `gh-fix-ci/SKILL.md` — remove script path, sandbox escalation note, and skill dependency reference; manual `gh` fallback is fully described
- `content-research-writer/SKILL.md` — strip ~40% tooling/example bulk; 7-step contract and citation/voice sections survive intact
- `skill-creator/SKILL.md` — strip Codex tooling invocations; design principles section (~500 lines minus script calls) is the target
- `mcp-builder/reference/evaluation.md` — strip Python harness; QA-pair design rules survive intact
- `notion-spec-to-implementation/reference/spec-parsing.md` — replace Notion MCP calls with generic "read spec" step; extraction taxonomy survives intact

### Partial (merge candidates — not standalone SOPs)

Skills where the portable value is a small number of rules or patterns, best merged into an existing skill rather than promoted standalone.

- `gh-address-comments/SKILL.md` — auth-check + user-selection loop pattern → merge into `pr-resolve-discussions`
- `changelog-generator/SKILL.md` — emoji-headed output format → merge into `release` skill
- `webapp-testing/SKILL.md` — `networkidle` wait rule → single-sentence addition to `test-webapp`
- `mcp-builder/SKILL.md` (launcher) — Phase 1.1 agent-centric design principles → merge into existing `mcp-builder` skill

---

## 6. Cross-Cutting Protocol Primitives

Patterns smaller than a full skill that recur across multiple files and are worth adopting as standing protocol.

**Auth-check gate** (`gh-address-comments`, `gh-fix-ci`)
Run `gh auth status` before any `gh` command; prompt login if not authenticated. One-liner prereq block; no output if already authenticated.

**User-approval gate before implementation** (`gh-fix-ci`, `mcp-builder/SKILL.md`)
Draft a plan and surface it to the user; wait for explicit approval before writing any files or running any commands. Prevents silent destructive actions.

**External-scope labelling** (`gh-fix-ci`)
When a dependency lies outside the agent's authority (non-GHA CI checks), label it as external and report the URL only — no attempt to fix or diagnose. Clean trust-boundary enforcement.

**Ask only if blocking** (`create-plan`)
Ask at most 1–2 follow-up questions; prefer multiple-choice formats; assume reasonable defaults when not blocked. Keeps interaction latency low without sacrificing correctness.

**Read-only reconnaissance before action** (`create-plan`, `mcp-builder/reference/evaluation.md`, `webapp-testing`)
Always scan/explore before modifying. Reconnaissance must be non-destructive (read-only, paginated, limit <10 results per call in eval context).

**Propose when absent** (`meeting-notes-and-actions`)
When expected metadata is missing (e.g., action-item due dates), propose reasonable values rather than leaving fields blank or blocking. Flag proposals as inferred.

**2–3 hypothesis minimum** (`support-ticket-triage`)
When signal is weak, surface 2–3 hypotheses rather than committing to one. Prevents premature root-cause lock-in.

**PII masking and hedge-instead-of-promise** (`support-ticket-triage`)
Mask all personally identifiable information in outputs; never commit to ETAs or resolutions unless explicitly given data to support them. Dual QA gate — applies to any user-facing draft.

**Progressive-disclosure loading** (`skill-creator`)
Load metadata first → SKILL.md body only when triggered → bundled reference files only when actively needed. Treat the context window as a public good; don't pre-load large reference files.

**`gh` field-drift resilience** (`gh-fix-ci`)
If a `gh` API call is rejected for an unrecognised field, rerun the command omitting that field and proceed. Makes `gh`-dependent skills robust to API version drift.

**Degrees-of-freedom taxonomy** (`skill-creator`)
Classify each step of a skill as high/medium/low agent freedom, matched to task fragility. High-freedom steps (creative, exploratory) tolerate variance; low-freedom steps (auth, file writes) require exact commands.

---

## 7. Default Recommendation

**Ship the following as new or enriched skills in `.agents`:**

| Action | Target skill | Source |
|---|---|---|
| **Promote as new skill** | `plan-coding-task` (or fold into `prd-to-plan`) | `create-plan/SKILL.md` — highest-quality standalone SOP; no existing equivalent for single-task coding plans |
| **Promote as new skill** | `fix-ci` | `gh-fix-ci/SKILL.md` — no existing CI-debug skill; after strip, fully portable |
| **Promote as new skill** | `triage-support-ticket` | `support-ticket-triage/SKILL.md` — no existing triage skill; clean PII/hedging QA rules |
| **Promote as new skill** | `meeting-notes` | `meeting-notes-and-actions/SKILL.md` — no existing meeting-notes skill; zero strip needed |
| **Promote as new skill** | `draft-email` | `email-draft-polish/SKILL.md` — no existing email skill; already lean |
| **Promote as new skill** | `spec-parse` | `notion-spec-to-implementation/reference/spec-parsing.md` (strip Notion calls) — extraction taxonomy complements existing `prd-to-plan` |
| **Enrich existing skill** | `skills/mcp-builder/SKILL.md` | Merge best-practices from `mcp_best_practices.md` (truncation pattern, pagination contract, tool-annotation table) + Phase 1.1 design principles from `mcp-builder/SKILL.md` launcher |
| **Enrich existing skill** | `skills/skill-create/SKILL.md` | Merge progressive-disclosure loading, degrees-of-freedom taxonomy, and "context window as public good" axiom from `skill-creator/SKILL.md` |
| **Enrich existing skill** | `skills/pr-resolve-discussions/SKILL.md` | Add auth-check prereq block and user-selection loop from `gh-address-comments/SKILL.md` |
| **Enrich existing skill** | `skills/release/SKILL.md` | Add emoji-headed H2 output format and noise-filter commit categories from `changelog-generator/SKILL.md` |
| **Enrich existing skill** | `skills/test-webapp/SKILL.md` | Add single-sentence `networkidle` wait rule from `webapp-testing/SKILL.md` |
| **Defer** | `content-research-writer` | Overlaps with `doc-coauthor`; promote only if the citation-management and voice-preservation sections are not already covered there |
| **Defer** | `mcp-builder/reference/evaluation.md` | Promote eval-authoring SOP only when an eval workflow is being built; valuable but low immediate priority |

**Form:** All new skills ship as `skills/<name>/SKILL.md` with the standard YAML frontmatter, no bundled scripts, and no Codex packaging metadata. Reference documents (e.g., citation-management templates) may ship as sibling Markdown files, loaded on demand per progressive-disclosure pattern.

---

## 8. Structural Patterns

### Worth adopting

**Progressive-disclosure 3-level loading** (`skill-creator/SKILL.md`)
> Metadata → SKILL.md body → bundled resource files, in that order. Only load the next level when actively needed.

Prevents bloated context windows. The principle is explicit: "context window is a public good." Apply this to any skill that ships with companion reference documents.

**Literal output templates in SKILL.md** (`create-plan`, `support-ticket-triage`, `meeting-notes-and-actions`, `notion-spec-to-implementation/reference/spec-parsing.md`)
Providing a verbatim Markdown template (with section names, placeholder item counts, and example rows) is consistently the factor that separates actionable SOPs from description-only files. The `create-plan` template (Intent → Scope → Checklist → Open Questions) is a model to replicate.

**Good-vs-bad item examples** (`create-plan`)
Pairing each rule with a ✓ concrete example and an ✗ vague counter-example doubles comprehension speed. Use for any checklist-heavy skill.

**Named output blocks for ambiguity/gap/conflict** (`notion-spec-to-implementation/reference/spec-parsing.md`)
Separating "Clarifications Needed", "Missing Information", and "Conflicting Requirements" into distinct named blocks forces the agent to categorise signals rather than lumping them. Portable to any spec-analysis or planning skill.

**Degrees-of-freedom annotation per step** (`skill-creator`)
Annotating each skill step with high/medium/low agent freedom makes it explicit where the agent should be creative vs. deterministic. Low-freedom steps should include exact commands; high-freedom steps describe outcomes only.

**QA checklist as final step** (`support-ticket-triage`, `email-draft-polish`, `meeting-notes-and-actions`, `content-research-writer`)
Every output-producing skill benefits from a named QA step at the end. The most portable rules across all four skills: no hallucinated facts, no hedging language, no over-promising, flag ambiguities explicitly.

**Decision-tree flowchart as entry point** (`webapp-testing/SKILL.md`)
For skills with branching execution paths (static vs. dynamic app, server running vs. not), a decision tree before the step list is more scannable than a flat numbered list with nested conditions.

### Worth avoiding

**Reference-launcher pattern** (`mcp-builder/SKILL.md`)
A skill that consists primarily of links to sibling reference files is not self-contained and breaks portability. If the reference files don't travel with the skill, the launcher is useless. Inline summaries or fetch-with-fallback patterns are preferable.

**Bundled helper scripts as primary path** (`gh-fix-ci`, `gh-address-comments`, `webapp-testing`)
Skills that list a bundled Python/bash script as the "preferred" path and a manual `gh`/CLI method as a "fallback" invert the portability hierarchy. The CLI-based path should always be canonical; the helper should be optional and additive.

**Marketing copy mixed with SOP** (`changelog-generator`, `content-research-writer`)
Skills that interleave "turns hours into minutes"-style superlatives with procedural steps create noise that makes the contract harder to extract. SOP and rationale should be clearly separated from promotional framing.

**Author attribution as skill content** (`changelog-generator`)
"Inspired by: Manik Aggarwal / Lenny's Newsletter" lines have no operational value and should be stripped before promotion. Attribution belongs in repo commit history, not in a deployed skill.

**Hard-coded placeholder counts that conflict with prose** (`create-plan`)
The `create-plan` template hard-codes 6 placeholder action items while the prose says 6–10. This creates unnecessary ambiguity. When a template is illustrative (not limiting), add a comment to that effect directly in the template.

**Codex sandbox metadata in portable skills** (`gh-fix-ci`, `gh-address-comments`)
`sandbox_permissions`, `require_escalated`, and `$CODEX_HOME` fields are Codex-runtime-specific. They add no value in other agent environments and must be stripped before any promotion.

---

## 9. Evidence

All citations reference exact content in `raw-findings.md`.

1. **`create-plan/SKILL.md` — "ask only if blocking, prefer multiple-choice, assume otherwise"**
   Raw: *"Ask at most 1–2 blocking follow-ups; prefer multiple-choice; assume when not blocked."* Preserved verbatim as a portable heuristic.

2. **`create-plan/SKILL.md` — read-only constraint**
   Raw: *"Workflow operates read-only and produces a templated markdown plan; no assumptions about language, framework, or tooling beyond 'scan README/docs first.'"*

3. **`gh-fix-ci/SKILL.md` — external-scope labelling rule**
   Raw: *"The scoping rule for non-GitHub-Actions checks (label as external, report URL only) is a strong portable policy worth keeping verbatim."*

4. **`gh-fix-ci/SKILL.md` — `gh` field-drift resilience**
   Raw: *"The `gh` field-drift handling note (rerun with available fields if a field is rejected) is a useful resilience tip to preserve."*

5. **`skill-creator/SKILL.md` — progressive-disclosure axiom**
   Raw: *"Contains the strongest portable design principles found so far: progressive-disclosure 3-level loading (metadata → SKILL.md body → bundled resources), degrees-of-freedom taxonomy (high/medium/low freedom matched to task fragility), and the 'context window is a public good' axiom."*

6. **`mcp-builder/reference/mcp_best_practices.md` — truncation pattern**
   Raw: *"CHARACTER_LIMIT=25 000 truncation pattern with `truncation_message` guidance, the pagination response contract JSON, the tool-annotation semantics table."*

7. **`mcp-builder/reference/mcp_best_practices.md` — error reporting contract**
   Raw: *"The explicit rule that MCP tool errors must be reported inside the result object (`isError: true` in content), not as protocol-level errors."*

8. **`support-ticket-triage/SKILL.md` — PII and hedging rules**
   Raw: *"Quality checks are unusually concrete (PII masking, hedge-instead-of-promise, disambiguation heuristic)."*

9. **`content-research-writer/SKILL.md` — citation-management section**
   Raw: *"The citation-management section (three style variants with running references list) is particularly strong and rarely spelled out this clearly in other skills — worth preserving verbatim."*

10. **`notion-spec-to-implementation/reference/spec-parsing.md` — Spec Quality Assessment rubric**
    Raw: *"The 'Spec Quality Assessment' rubric (good vs. incomplete spec checklist) is a standout addition worth preserving verbatim."*

11. **`mcp-builder/reference/evaluation.md` — QA-pair design rules**
    Raw: *"The question-design rules (stability, no keyword search, multi-hop, diversity of answer modalities, ambiguity with single correct answer) are the highest-value portable content — applicable to any eval harness, not just MCP."*

12. **`changelog-generator/SKILL.md` — description-only limitation**
    Raw: *"The skill is description-only (no runnable steps, no commands, no prompt template); it reads as marketing copy rather than an actionable SOP."*

13. **`webapp-testing/SKILL.md` — `networkidle` rule**
    Raw: *"The mandatory `networkidle` wait before any DOM inspection is the single highest-value portable rule here."*

14. **`gh-address-comments/SKILL.md` — merge-not-promote recommendation**
    Raw: *"Complements the existing `pr-resolve-discussions` skill but is lighter-weight (no parallel sub-agents). Worth merging the auth-check pattern and user-selection loop into that skill rather than promoting as a standalone."*

15. **`mcp-builder/reference/mcp_best_practices.md` — two-part file structure**
    Raw: *"Two-part file. First ~270 lines: clean numbered-section Markdown with quick-reference callouts and one code example per pattern — high signal, skill-ready. Remaining ~400 lines: raw MCP spec docs with JSX component syntax — low signal for a skill context."*
