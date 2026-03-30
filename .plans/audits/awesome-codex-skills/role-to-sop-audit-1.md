# Structured Audit — awesome-codex-skills
**Source:** `raw-findings.md` · **Files audited:** 43 · **Date:** 2026-03-29

---

## 1. Repo Overview

The `awesome-codex-skills` repository is a community collection of skill documents for OpenAI's Codex CLI agent, following the same SKILL.md-frontmatter + markdown-body convention used in the target skills tree. The repo spans 43 files covering: MCP server building, workflow automation, communication writing, meeting intelligence, GitHub/CI operations, competitive research, file management, creative design, and a tail of third-party SaaS integrations. A layered MCP builder cluster (five files) is the most thoroughly documented subsystem, with separate reference guides for design principles, evaluation, Python, and TypeScript implementation. Communication-oriented skills — email drafting, meeting notes, internal comms, content writing — form a second strong cluster carrying uniformly high portability. Roughly half the repo is tightly coupled to the Codex runtime (sandbox escalation flags, `$CODEX_HOME`, Codex CLI commands), Notion MCP tooling, or proprietary integrations (Composio, Rube, Linear). Of the 43 files audited, 14 are fully portable as-is, 14 are partial (portable after stripping vendor/runtime references), and 15 are leave-outs due to hard vendor lock-in, vacuous content, or no transferable procedure. Quality is uneven: the planning, MCP builder, and communication clusters are well-specified with explicit contracts and quality bars; the tail (image-enhancer, domain-brainstormer, video-downloader, raffle-picker) is either aspirational documentation or thin CLI wrappers with no reusable logic. No skill in the repo uses the three-file layout (frontmatter + SKILL.md + reference/) as consistently as the agents repo does, but the MCP cluster comes closest.

---

## 2. Content Summary by Category

| Category | Files | Portability signal |
|---|---|---|
| **Planning & implementation** | `create-plan`, `notion-spec-to-implementation` (SKILL + spec-parsing.md) | High for `create-plan`; partial for `spec-parsing.md`; zero for Notion SKILL.md |
| **MCP builder cluster** | `mcp-builder/SKILL.md`, `mcp_best_practices.md`, `evaluation.md`, `python_mcp_server.md`, `node_mcp_server.md` | Partial — design/eval layer is language-agnostic; language guides are not |
| **Skill / agent meta** | `skill-creator`, `skill-installer`, `skill-share` | Partial for `skill-creator` (strip Codex branding + scripts); leave out the other two |
| **GitHub / CI workflows** | `gh-address-comments`, `gh-fix-ci` | Partial — `gh` CLI steps are portable; Codex sandbox escalation is not |
| **Communication writing** | `email-draft-polish`, `meeting-notes-and-actions`, `internal-comms`, `content-research-writer` | All fully portable; strongest cluster in the repo |
| **Meeting intelligence** | `meeting-insights-analyzer`, `notion-meeting-intelligence` | Partial — analysis framework portable; Notion MCP tool calls are not |
| **Notion integrations (pure)** | `notion-research-documentation`, `notion-knowledge-capture`, `notion-spec-to-implementation` (SKILL.md) | Leave out — every execution step is Notion-MCP-coupled |
| **SaaS / runtime integrations** | `linear`, `connect-apps`, `connect`, `langsmith-fetch`, `developer-growth-analysis`, `skill-share` | All leave out — zero portable procedure survives vendor stripping |
| **Changelog / release** | `changelog-generator` | Fully portable |
| **Testing** | `webapp-testing` | Fully portable |
| **File / data management** | `file-organizer`, `invoice-organizer`, `spreadsheet-formula-helper` | High (invoice-organizer and spreadsheet-helper are clean; file-organizer needs ~80% trim) |
| **Creative / media** | `canvas-design`, `slack-gif-creator`, `theme-factory` | Partial — conceptual/constraint layers portable; code/asset dependencies are not |
| **Research / competitive analysis** | `content-research-writer`, `competitive-ads-extractor`, `lead-research-assistant` | Partial-to-yes; analysis schemas portable, extraction mechanics tool-dependent |
| **Resume / career** | `tailored-resume-generator` | Fully portable |
| **Support operations** | `support-ticket-triage` | Fully portable |
| **Brand / design tokens** | `brand-guidelines` | Leave out — OpenAI-specific hex values, no transferable structure |
| **Narrow utilities** | `domain-name-brainstormer`, `image-enhancer`, `video-downloader`, `raffle-winner-picker` | All leave out — aspirational stubs or single-CLI wrappers |

---

## 3. SOP Split — Every File

| File | Decision | One-line reason |
|---|---|---|
| `.references/awesome-codex-skills/create-plan/SKILL.md` | **Port** | Stack-agnostic plan template with strict contracts; only path examples need stripping |
| `.references/awesome-codex-skills/mcp-builder/SKILL.md` | **Port (partial)** | Agent-centric design principles and eval framework are reusable; Phase 2 implementation is language-specific |
| `.references/awesome-codex-skills/skill-creator/SKILL.md` | **Port (partial)** | 6-step creation workflow and progressive-disclosure model are portable; strip Codex branding and Python scripts |
| `.references/awesome-codex-skills/gh-address-comments/SKILL.md` | **Port (partial)** | Three-step comment triage loop is reusable; strip Codex sandbox escalation clauses |
| `.references/awesome-codex-skills/changelog-generator/SKILL.md` | **Port** | Git-history-to-changelog procedure is fully stack-agnostic |
| `.references/awesome-codex-skills/gh-fix-ci/SKILL.md` | **Port (partial)** | Core CI triage loop and approval-gate pattern are portable; strip `sandbox_permissions` notes |
| `.references/awesome-codex-skills/webapp-testing/SKILL.md` | **Port** | Playwright decision tree and reconnaisance-before-action pattern are fully agnostic |
| `.references/awesome-codex-skills/content-research-writer/SKILL.md` | **Port** | Eight-phase collaborative writing SOP with explicit output contracts; no platform coupling |
| `.references/awesome-codex-skills/meeting-insights-analyzer/SKILL.md` | **Port (partial)** | Analysis taxonomy and output templates are portable; strip Granola/Zoom/Codex setup |
| `.references/awesome-codex-skills/email-draft-polish/SKILL.md` | **Port** | Nothing to strip; five-step email workflow is entirely tool-agnostic |
| `.references/awesome-codex-skills/meeting-notes-and-actions/SKILL.md` | **Port** | Nothing to strip; strong hallucination-avoidance and vague-to-concrete task conversion make it best-in-class |
| `.references/awesome-codex-skills/notion-spec-to-implementation/SKILL.md` | **Leave out** | Every execution step invokes a Notion MCP tool; no procedure survives stripping |
| `.references/awesome-codex-skills/notion-research-documentation/SKILL.md` | **Leave out** | 100% Notion-MCP-dependent; format-selection heuristic is the only fragment of value, too thin to port alone |
| `.references/awesome-codex-skills/linear/SKILL.md` | **Leave out** | Every workflow step is Linear-specific; vendor lock-in is total |
| `.references/awesome-codex-skills/notion-meeting-intelligence/SKILL.md` | **Port (partial)** | Meeting-format taxonomy and owner+timebox discipline are portable; all Notion MCP calls strip cleanly |
| `.references/awesome-codex-skills/notion-knowledge-capture/SKILL.md` | **Leave out** | Entirely Notion-MCP-dependent; content-type taxonomy is the only portable fragment, too thin alone |
| `.references/awesome-codex-skills/internal-comms/SKILL.md` | **Port** | 3P format, FAQ structure, and general-comms principles are org-agnostic; strip hard tool references |
| `mcp-builder/reference/mcp_best_practices.md` | **Port (partial)** | First half (Sections 1–15) is a clean, portable MCP standards checklist; second half is verbatim protocol docs—drop |
| `.references/awesome-codex-skills/mcp-builder/reference/evaluation.md` | **Port (partial)** | 13-point question design SOP and XML schema are fully agnostic; strip Python/OpenAI execution harness |
| `.references/awesome-codex-skills/tailored-resume-generator/SKILL.md` | **Port** | 10-phase pipeline is domain-agnostic; trim worked example and convert negative framing to positive |
| `.references/awesome-codex-skills/notion-spec-to-implementation/reference/spec-parsing.md` | **Port (partial)** | Requirement categorisation, acceptance criteria, ambiguity templates, and spec quality rubric are source-agnostic; strip Notion MCP calls |
| `.references/awesome-codex-skills/mcp-builder/reference/python_mcp_server.md` | **Leave out (as standalone)** | Python/FastMCP-specific throughout; keep as bundled reference companion, not a promotable SOP |
| `.references/awesome-codex-skills/skill-installer/SKILL.md` | **Leave out** | Entirely Codex-runtime-specific; no reusable procedure text survives |
| `brand-guidelines/SKILL.md` | **Leave out** | OpenAI-specific hex/font tokens; workspace already has an Anthropic analogue |
| `canvas-design/SKILL.md` | **Port (partial)** | Philosophy-creation phase and multi-phase design layout are portable; strip local font dir assumption |
| `.references/awesome-codex-skills/mcp-builder/reference/node_mcp_server.md` | **Leave out (as standalone)** | TypeScript/Node-specific throughout; best kept as bundled reference companion |
| `.references/awesome-codex-skills/connect-apps/SKILL.md` | **Leave out** | Composio vendor onboarding script; zero transferable logic |
| `.references/awesome-codex-skills/skill-share/SKILL.md` | **Leave out** | Rube/Slack dependency; creation workflow duplicates `skill-creator` |
| `competitive-ads-extractor/SKILL.md` | **Port (partial)** | Analysis schema and structured-report template are portable; extraction mechanics are tool-dependent |
| `.references/awesome-codex-skills/domain-name-brainstormer/SKILL.md` | **Leave out** | Core premise requires live WHOIS access Claude does not have; brainstorming heuristics are too thin to justify a skill |
| `.references/awesome-codex-skills/image-enhancer/SKILL.md` | **Leave out** | No concrete tooling, commands, or executable steps; aspirational documentation only |
| `.references/awesome-codex-skills/developer-growth-analysis/SKILL.md` | **Leave out** | Reads Codex-proprietary `history.jsonl`; Rube MCP for delivery; not portable without full rewrite |
| `.references/awesome-codex-skills/file-organizer/SKILL.md` | **Port (partial)** | Confirmation-gate, structured plan proposal, and 4-question scoping protocol are valuable; 80% of file is user-guide prose that needs cutting |
| `.references/awesome-codex-skills/raffle-winner-picker/SKILL.md` | **Leave out** | Single-purpose ad-hoc task; no reusable decision logic or protocol |
| `.references/awesome-codex-skills/langsmith-fetch/SKILL.md` | **Leave out** | Vendor-locked to LangSmith/LangChain ecosystem; procedure is the CLI |
| `.references/awesome-codex-skills/lead-research-assistant/SKILL.md` | **Port (partial)** | Scored-list output format and ICP-to-fit-score pipeline are portable; sales/BD domain limits general applicability |
| `invoice-organizer/SKILL.md` | **Port** | 7-step pipeline is self-contained; copy-safety guard and filename convention are clean portable artefacts |
| `.references/awesome-codex-skills/spreadsheet-formula-helper/SKILL.md` | **Port** | Nothing to strip; 5-step formula-authoring SOP is production-ready |
| `theme-factory/SKILL.md` | **Port (partial)** | Show→choose→apply loop and custom-theme-generation path are portable; strip local asset references |
| `.references/awesome-codex-skills/video-downloader/SKILL.md` | **Leave out** | Thin CLI wrapper for yt-dlp; Codex-sandbox output path; no agent procedure |
| `.references/awesome-codex-skills/slack-gif-creator/SKILL.md` | **Port (partial)** | Slack constraint specs, animation phase structure, and optimization decision tree are portable; strip Python module paths |
| `.references/awesome-codex-skills/support-ticket-triage/SKILL.md` | **Port** | Generic support-ops SOP; no platform API calls; strong quality-gate rules |
| `.references/awesome-codex-skills/connect/SKILL.md` | **Leave out** | Composio SDK tutorial; no transferable methodology |

---

## 4. Per-SOP Detail Table (Portable & Partial)

### 4.1 `.references/awesome-codex-skills/create-plan/SKILL.md`
| Field | Detail |
|---|---|
| **Source file** | `.references/awesome-codex-skills/create-plan/SKILL.md` |
| **Trigger** | User explicitly asks for a plan for a coding or implementation task |
| **Steps / contract** | (1) Read-only context scan (README, docs/, CONTRIBUTING.md, likely-touched files); (2) Ask ≤2 blocking questions only if planning is impossible without the answer — prefer multiple-choice, otherwise assume; (3) Output exact template: 1–3 sentence intent → `## Scope` (In / Out bullets) → `## Action items` checklist (6–10 items, verb-first, discovery→changes→tests→rollout) → `## Open questions` (max 3); (4) No meta-commentary — output plan directly |
| **Quality bar** | Phase ordering (discovery→changes→tests→rollout) enforced; checklist capped at 6–10; ≤3 open questions; zero commentary outside plan template |
| **Strip** | `npm test` example; `src/`, `app/`, `services/` path hints (JS-ecosystem flavoring) |
| **Notes** | ≤2 blocking-questions cap prevents over-interviewing failure mode; phase ordering heuristic is reusable across any plan-generation SOP |

### 4.2 `.references/awesome-codex-skills/mcp-builder/SKILL.md`
| Field | Detail |
|---|---|
| **Source file** | `.references/awesome-codex-skills/mcp-builder/SKILL.md` |
| **Trigger** | When building an MCP server to expose an external API or service to LLMs |
| **Steps / contract** | Four phases: (1) Research & planning — study MCP protocol docs, fetch API docs exhaustively, design agent-centric tools and I/O contracts; (2) Implementation — set up project, shared utilities first, systematic tool build; (3) Review & refine — DRY / composability / type-safety / documentation checklist; (4) Evaluations — create 10 independent, read-only, complex, verifiable QA pairs in XML format |
| **Quality bar** | Never run server directly in main process (stdio-blocking); agent-centric tool design (not endpoint wrappers); evaluation gate with 10 QA pairs before shipping |
| **Strip** | Python/FastMCP tooling (Pydantic, `@mcp.tool`); TypeScript tooling (Zod, `tsconfig.json`); `./reference/*.md` local file links; versioned SDK fetch URLs; Anthropic-branded XML evaluation example |
| **Notes** | Phase 1 agent-centric design block and Phase 4 eval framework are independently extractable as standalone SOP fragments; "safe testing" stdio-blocking invariant is uniquely valuable |

### 4.3 `.references/awesome-codex-skills/skill-creator/SKILL.md`
| Field | Detail |
|---|---|
| **Source file** | `.references/awesome-codex-skills/skill-creator/SKILL.md` |
| **Trigger** | When creating a new skill or substantially revising an existing one for any agent platform |
| **Steps / contract** | (1) Understand skill with concrete examples; (2) Plan reusable contents (scripts / references / assets); (3) Initialise skill directory; (4) Edit SKILL.md + implement resources; (5) Validate & package; (6) Iterate on real usage |
| **Quality bar** | SKILL.md body ≤500 lines; only essential files — no READMEs, changelogs, or auxiliary docs; scripts tested before shipping; description frontmatter is sole trigger mechanism |
| **Strip** | All "Codex" branding; `init_skill.py` / `package_skill.py` / `quick_validate.py` script references; `.skill` zip-packaging format; internal companion doc references |
| **Notes** | Three-level progressive-disclosure loading model (metadata → SKILL.md body → bundled resources) and degrees-of-freedom spectrum (high/medium/low freedom → text/pseudocode/script) are independently valuable design heuristics |

### 4.4 `.references/awesome-codex-skills/gh-address-comments/SKILL.md`
| Field | Detail |
|---|---|
| **Source file** | `.references/awesome-codex-skills/gh-address-comments/SKILL.md` |
| **Trigger** | Agent has an open GitHub PR and needs to surface, triage, and apply fixes for review comments |
| **Steps / contract** | (1) Auth gate — verify `gh auth status`; (2) Fetch all comment types (conversation, review submissions, inline threads) via companion script; (3) Number every thread and present one-line summary to user; (4) Receive user selection; (5) Apply fixes for selected items only |
| **Quality bar** | All three comment type categories fetched; per-thread summary presented before any edit; user confirms selection |
| **Strip** | `sandbox_permissions=require_escalated`; `include workflow/repo scopes` / `rerun with sandbox_permissions` clauses |
| **Notes** | Python helper (`scripts/fetch_comments.py`) is drop-in reusable anywhere `gh` CLI is present; only auth-escalation language needs updating for other runtimes |

### 4.5 `.references/awesome-codex-skills/changelog-generator/SKILL.md`
| Field | Detail |
|---|---|
| **Source file** | `.references/awesome-codex-skills/changelog-generator/SKILL.md` |
| **Trigger** | Preparing release notes, creating a changelog for a version tag or date range, or documenting changes for customers |
| **Steps / contract** | (1) Scan git history for range (version tags or date window); (2) Categorise into: new features / improvements / bug fixes / breaking changes / security; (3) Filter noise (refactoring, tests, CI); (4) Translate technical commits to customer-facing copy; (5) Format as structured markdown with emoji-prefixed sections; (6) Optionally apply `CHANGELOG_STYLE.md` if present |
| **Quality bar** | Noise filtered; customer-facing language enforced; emoji-prefixed section headers |
| **Strip** | "Inspired by" attribution; specific example dates; Related Use Cases section; tip about saving to CHANGELOG.md |
| **Notes** | Narrower than the agents repo `release` skill — consider as a sub-procedure for mid-cycle summaries; good standalone for weekly digests |

### 4.6 `.references/awesome-codex-skills/gh-fix-ci/SKILL.md`
| Field | Detail |
|---|---|
| **Source file** | `.references/awesome-codex-skills/gh-fix-ci/SKILL.md` |
| **Trigger** | User asks to debug or fix failing PR CI/CD checks on GitHub Actions |
| **Steps / contract** | (1) Verify `gh auth`; (2) Resolve PR from branch or explicit input; (3) Inspect failing checks via script or manual `gh` fallback; (4) Scope non-GA checks as out-of-scope (report URL only); (5) Summarise failure snippet to user; (6) Draft fix plan via `plan` skill + await approval; (7) Implement approved plan; (8) Suggest recheck with `gh pr checks` |
| **Quality bar** | External checks (Buildkite etc.) reported but not fixed; approval gate before any code change; `gh` field-drift handled with rerun fallback |
| **Strip** | `sandbox_permissions=require_escalated`; bundled script path convention should be abstracted to "run the bundled helper" |
| **Notes** | `gh` field-drift workaround pattern is a useful defensive SOP for any tool with schema drift; approval-gate before implementation is strong guardrail |

### 4.7 `.references/awesome-codex-skills/webapp-testing/SKILL.md`
| Field | Detail |
|---|---|
| **Source file** | `.references/awesome-codex-skills/webapp-testing/SKILL.md` |
| **Trigger** | Verifying or testing a local web application's frontend behavior using Playwright |
| **Steps / contract** | (1) Determine app type: static HTML → read file; dynamic → check server state; (2) If server not running, invoke `with_server.py --help` then run with helper; (3) Reconnaissance: navigate, wait for `networkidle`, screenshot/inspect DOM; (4) Action: execute interactions using discovered selectors with appropriate waits; (5) Always close browser on completion |
| **Quality bar** | `networkidle` wait before any inspection; selectors discovered from rendered state, not hardcoded; browser closed on completion |
| **Strip** | `scripts/with_server.py` path reference; `examples/` directory references (re-express as generic example types) |
| **Notes** | ASCII flowchart decision tree for static/dynamic/server-state branching is the standout structural pattern; ❌/✅ negative-to-positive constraint format is a reusable teaching pattern |

### 4.8 `.references/awesome-codex-skills/content-research-writer/SKILL.md`
| Field | Detail |
|---|---|
| **Source file** | `.references/awesome-codex-skills/content-research-writer/SKILL.md` |
| **Trigger** | User wants to write blog posts, articles, newsletters, case studies, or tutorials with a structured writing partner |
| **Steps / contract** | Eight phases: (1) Intake Q&A (topic, audience, length, goal, sources, style); (2) Collaborative outlining with placeholders; (3) Research with formatted citations; (4) Hook improvement — 3 typed alternatives + 4 quality-gate questions; (5) Section-by-section feedback template; (6) Voice preservation ("suggest, don't replace"); (7) Citation management by preferred format; (8) Final review with pre-publish checklist |
| **Quality bar** | No draft before outline approved; citations formatted at intake not deferred; periodic "Does this sound like you?" tone check; pre-publish checklist covers claims/citations/transitions/CTA/proofread |
| **Strip** | `mkdir ~/writing/...` / `touch article-draft.md` commands; "Work in VS Code" tip; "Teresa Torres" named persona; "Ready to publish! 🚀" sign-off; folder structure suggestion |
| **Notes** | Adds research/citation-management dimension absent from `doc-coauthor` and `doc-edit-article` in agents repo; hook improvement framework and voice-preservation invariants are independently extractable |

### 4.9 `.references/awesome-codex-skills/meeting-insights-analyzer/SKILL.md`
| Field | Detail |
|---|---|
| **Source file** | `.references/awesome-codex-skills/meeting-insights-analyzer/SKILL.md` |
| **Trigger** | User uploads meeting transcripts and asks for communication pattern analysis, speaking ratio assessment, or facilitation coaching |
| **Steps / contract** | (1) Discover transcript files (`.txt`, `.md`, `.vtt`, `.srt`, `.docx`); (2) Clarify analysis goals; (3) Analyse each pattern (conflict avoidance, speaking ratios, filler words, active listening, facilitation) with timestamped quotes; (4) Emit per-pattern findings block (finding → frequency → 2–3 examples with what/why/better); (5) Synthesise summary report (statistics, strengths, growth opportunities, next steps) |
| **Quality bar** | Each finding backed by timestamped examples; "better approach" provided for every observed pattern; statistics included in summary |
| **Strip** | All tool-specific setup instructions (Granola, Zoom, Fireflies.ai); Codex folder-navigation framing; "Common Analysis Requests" and "Related Use Cases" sections; "Inspired by Dan Shipper" attribution |
| **Notes** | Two output templates (per-pattern block + summary report) are the highest-value extractable artefacts; pattern taxonomy is a reusable checklist |

### 4.10 `.references/awesome-codex-skills/email-draft-polish/SKILL.md`
| Field | Detail |
|---|---|
| **Source file** | `.references/awesome-codex-skills/email-draft-polish/SKILL.md` |
| **Trigger** | User wants to draft, rewrite, or condense an email where tone, brevity, and clarity matter |
| **Steps / contract** | (1) Gather inputs: goal / audience / tone / length / must-include / taboo / CTA; (2) Outline key points and surface open questions before drafting; (3) Draft subject line + concise body with CTA surfaced early; (4) Produce 2–3 tone/length variants when ask is vague; (5) QA gate: hedging vs directness, jargon, names/links, over-promising |
| **Quality bar** | Variants produced when ask is underspecified; QA gate explicitly checks hedging, jargon, name accuracy, and over-promising |
| **Strip** | Nothing — zero platform/tool coupling |
| **Notes** | "Offer variants when ask is vague" heuristic is broadly reusable in any writing SOP; QA checklist maps onto a generic written-communication quality gate |

### 4.11 `.references/awesome-codex-skills/meeting-notes-and-actions/SKILL.md`
| Field | Detail |
|---|---|
| **Source file** | `.references/awesome-codex-skills/meeting-notes-and-actions/SKILL.md` |
| **Trigger** | User provides a meeting transcript, rough call notes, or long meeting chat and wants a structured summary with action items |
| **Steps / contract** | (1) Collect inputs and output-style preferences; (2) Normalise text (strip noise, preserve quotes); (3) Extract agenda topics, decisions, open questions, risks; (4) Build action items (who/what/when; vague→concrete; propose due dates); (5) Produce output: header + Summary / Decisions / Open Questions+Risks / Action Items (checkboxes + owner + due); (6) Quality-check: consistent names, no hallucinated facts, flag ambiguities; (7) Optional Slack/email-ready blurb |
| **Quality bar** | No invented facts; ambiguities flagged as clarifying questions rather than resolved silently; vague asks converted to concrete tasks |
| **Strip** | Nothing — entirely self-contained |
| **Notes** | Strongest meeting-notes SOP in the repo due to explicit hallucination-avoidance and vague-to-concrete conversion; good complement to `meeting-insights-analyzer` |

### 4.12 `.references/awesome-codex-skills/notion-meeting-intelligence/SKILL.md` (after strip)
| Field | Detail |
|---|---|
| **Source file** | `.references/awesome-codex-skills/notion-meeting-intelligence/SKILL.md` |
| **Trigger** | User wants to prepare meeting materials, draft an agenda or pre-read, or gather context before a meeting |
| **Steps / contract** | (1) Confirm objective, outcomes needed, attendees, duration, date, prior materials; (2) Gather context from knowledge base; (3) Select meeting format from taxonomy: status-update / decision / planning / retrospective / 1:1 / brainstorming; (4) Build agenda with context section, goals, agenda items each with assigned owner and timebox, decisions needed, risks, prep asks; (5) Enrich with research — claims cited with sources, fact separated from opinion; (6) Add next steps with owners |
| **Quality bar** | Owner + timebox per agenda item; external claims cited with source links; fact/opinion separation enforced |
| **Strip** | All `Notion:notion-*` MCP tool calls; Codex MCP setup instructions; Step 0 error-recovery block |
| **Notes** | Meeting-format taxonomy (6 types) and owner+timebox discipline are the highest-value portable fragments |

### 4.13 `.references/awesome-codex-skills/internal-comms/SKILL.md`
| Field | Detail |
|---|---|
| **Source file** | `.references/awesome-codex-skills/internal-comms/SKILL.md` (+ example files) |
| **Trigger** | User asks to write any internal communication: status report, leadership update, 3P, newsletter, FAQ, incident report, project update |
| **Steps / contract** | (1) Identify communication type; (2) Load matching sub-prompt (3P / newsletter / FAQ / general-comms); (3) Clarify scope → gather info → draft → review for conciseness/metrics. 3P format: `[emoji] [Team] (Dates) / Progress / Plans / Problems`, 1–3 sentences each, data-driven. Newsletter: ~20–25 bullets in thematic sections, "we" voice, links. FAQ: Q/A pairs, 1 sentence / 1–2 sentences. General: ask audience+purpose+tone first, apply active-voice / most-important-first |
| **Quality bar** | 3P: 30–60 second readability target; data-driven over anecdote; newsletter: "we" voice throughout; FAQ: hedge uncertainty, cite sources, flag executive-input needs |
| **Strip** | Hard tool references (Slack, Google Drive, Email); "1000+ people" headcount assumption (reframe as large-org guidance); `license: Complete terms in LICENSE.txt` frontmatter |
| **Notes** | Dispatcher pattern (SKILL.md as pure router, logic in per-format example files) is a clean structural model worth replicating; 3P sub-prompt is the strongest individual piece |

### 4.14 `mcp-builder/reference/mcp_best_practices.md`
| Field | Detail |
|---|---|
| **Source file** | `mcp-builder/reference/mcp_best_practices.md` |
| **Trigger** | When building any MCP server regardless of language or transport — reference companion to any MCP builder SOP |
| **Steps / contract** | Checklist by concern: naming → tool design → response formats → pagination → char limits → transport selection → testing → OAuth/security → error handling → documentation → compliance. Key invariants: (1) `{service}_{action}_{resource}` tool naming with service prefix; (2) list tools return `has_more` + `next_offset` + `total_count`; (3) char limit 25,000 with `truncated` + `truncation_message` fields; (4) tool errors in result objects (`isError: true`), never as protocol errors; (5) OAuth tokens never passed through from MCP clients; (6) `stdio` servers log to `stderr` only |
| **Quality bar** | All six key invariants respected; tool names conflict-disambiguated; pagination schema complete |
| **Strip** | Language-specific server naming conventions (present as examples); entire second half from `----------` onward (verbatim protocol docs with JSX markup); Python/TypeScript boilerplate code examples |
| **Notes** | Quick Reference summary box at top is the densest portable artefact; tool-name conflict disambiguation section (three strategies) is uniquely practical and not in SKILL.md |

### 4.15 `.references/awesome-codex-skills/mcp-builder/reference/evaluation.md`
| Field | Detail |
|---|---|
| **Source file** | `.references/awesome-codex-skills/mcp-builder/reference/evaluation.md` |
| **Trigger** | When building or quality-gating an MCP server or any tool-based agent capability and needing a stable test suite |
| **Steps / contract** | (1) Design 10 read-only, independent, non-destructive questions against 13 design rules (independent pairs, idempotent only, multi-hop, no keyword-search shortcut, stable answers); (2) Apply 6 answer guidelines (string-comparable, human-readable, closed/stable concepts, unambiguous); (3) 5-step creation process: inspect API docs in parallel → inspect tool schemas without calling → iterate understanding → explore live content read-only → generate 10 QA pairs; (4) Emit as XML `<evaluation><qa_pair>` structure; (5) Verify by solving each task yourself, correct wrong answers |
| **Quality bar** | 10 QA pairs; all read-only; no answers require write/destructive ops; diverse modalities across pairs; answers are single verifiable values |
| **Strip** | Entire "Running Evaluations" section (Python harness, `pip install`, `OPENAI_API_KEY`, `scripts/evaluation.py` CLI); `scripts/example_evaluation.xml` path reference |
| **Notes** | 13-point question checklist is independently extractable for any eval design task; "do not let the MCP server restrict the kinds of questions you create" is a strong anti-Goodhart invariant; this is more authoritative than Phase 4 of SKILL.md |

### 4.16 `.references/awesome-codex-skills/tailored-resume-generator/SKILL.md`
| Field | Detail |
|---|---|
| **Source file** | `.references/awesome-codex-skills/tailored-resume-generator/SKILL.md` |
| **Trigger** | User wants to tailor a resume to a specific job posting, optimise for ATS, or create a role-type-specific version |
| **Steps / contract** | 10 phases: (1) gather JD + background; (2) extract/prioritise requirements (must-have / important / nice-to-have); (3) map candidate experience to each requirement, flag gaps; (4) structure resume (summary → skills → experience → education); (5) ATS keyword optimisation; (6) format guidance (1 vs 2 page heuristics); (7) strategic recommendations (strengths, gap analysis, cover-letter hooks); (8) iterate/refine; (9) best-practices; (10) role-type variants (career changers, new grads, executives, technical, creative) |
| **Quality bar** | Every requirement tiered; gaps explicitly flagged; ATS keywords sourced from JD not invented; role-type variants produced for relevant cases |
| **Strip** | Full worked example (~40 lines); "Tips for Best Results" section; "Privacy Note" boilerplate; "Don't" list (convert to positive imperatives) |
| **Notes** | JD-analysis → priority-tiering → experience-mapping → ATS pipeline is the genuinely reusable core; can be tightened ~40% without losing SOP value |

### 4.17 `.references/awesome-codex-skills/notion-spec-to-implementation/reference/spec-parsing.md`
| Field | Detail |
|---|---|
| **Source file** | `.references/awesome-codex-skills/notion-spec-to-implementation/reference/spec-parsing.md` |
| **Trigger** | When parsing a spec document to extract requirements before building an implementation plan |
| **Steps / contract** | (1) Obtain spec content from any source; (2) Identify spec type (requirements-based / user-story / technical design doc / PRD) and apply matching extraction pattern; (3) Extract functional requirements, non-functional requirements, acceptance criteria, priorities, scope (in/out/assumptions); (4) Surface ambiguities via structured templates (Clarifications Needed / Missing Information / Conflicting Requirements, each with: Current text / Question / Impact / Assumed for now); (5) Identify dependencies; (6) Assess spec quality against good/incomplete rubric; (7) Validate completeness via 9-item pre-planning checklist |
| **Quality bar** | Spec quality rubric gate before proceeding; acceptance criteria have explicit + implicit + testability triad; ambiguities surfaced before planning |
| **Strip** | `Notion:notion-search` and `Notion:notion-fetch` code blocks in "Finding the Specification" and "Reading Specifications" sections |
| **Notes** | Acceptance criteria section (explicit/implicit/testable triad) is the strongest portable piece; ambiguity templates are structured and immediately reusable |

### 4.18 `canvas-design/SKILL.md`
| Field | Detail |
|---|---|
| **Source file** | `canvas-design/SKILL.md` |
| **Trigger** | User asks to create a poster, piece of art, design, or other static visual piece |
| **Steps / contract** | (1) Name aesthetic movement, write 4–6 paragraph visual manifesto, output as `.md`; (2) Extract conceptual thread from request, weave invisibly into work; (3) Express philosophy as single `.pdf`/`.png` via code (minimal text, repeating patterns); (4) Refinement pass for museum-quality polish without new elements; (5) Optional multi-page variant |
| **Quality bar** | Philosophy articulated before canvas execution; second refinement pass mandatory; no new elements added in refinement |
| **Strip** | `./canvas-fonts` local path reference; "FINAL STEP" fake-user-complaint injection (replace with explicit second-pass instruction) |
| **Notes** | Philosophy-creation phase alone is a portable ideation SOP; multi-phase layout is a good model for other creative workflow skills |

### 4.19 `competitive-ads-extractor/SKILL.md`
| Field | Detail |
|---|---|
| **Source file** | `competitive-ads-extractor/SKILL.md` |
| **Trigger** | User wants to research competitor ad strategies, understand market messaging, or plan a campaign with proven patterns |
| **Steps / contract** | (1) Identify target competitors and platforms; (2) Extract/capture active ads; (3) Analyse messaging (problems, use cases, value props); (4) Categorise by theme, audience, format; (5) Identify repeating patterns; (6) Produce structured report: Overview → Key Problems → Creative Patterns → Copy Formulas → Audience Insights → Recommendations; (7) Save outputs (markdown analysis, CSV of copy/CTAs) |
| **Quality bar** | Report schema enforced with six named sections; theme → count → representative copy → "why it works" sub-structure per pattern |
| **Strip** | Notion-specific example output; "Inspired by" attribution; hardcoded file paths; progress-bar ASCII art |
| **Notes** | Analysis framework portability is high; extraction step depends entirely on runtime browser/scraping tools; legal/ethical guidance sidebar is a clean portable addition |

### 4.20 `.references/awesome-codex-skills/file-organizer/SKILL.md`
| Field | Detail |
|---|---|
| **Source file** | `.references/awesome-codex-skills/file-organizer/SKILL.md` |
| **Trigger** | User mentions disorganised folders, Downloads cleanup, duplicate files, or wants to restructure a filesystem location |
| **Steps / contract** | (1) 4-question scoping: which directory / main problem / files to skip / aggressiveness level; (2) Analyse with shell commands; (3) Identify organisation pattern (type / purpose / date); (4) Find duplicates by hash/name/size with per-set confirmation gate; (5) Output structured plan proposal (current state → proposed tree → change list → ambiguous files → yes/no/modify gate); (6) Execute with logging, copy not move, stop on unexpected; (7) Summarise with maintenance cadence |
| **Quality bar** | `yes/no/modify` gate before any execution; copy-not-move default; logging all moves for potential undo; stop on unexpected situations |
| **Strip** | OS-specific bash snippets; all four worked examples; "Pro Tips", "Best Practices", "When to Archive", "Related Use Cases" sections; attribution byline |
| **Notes** | Confirmation-gate-before-execution and structured plan proposal are strong reusable SOP elements; ~80% of file is user-guide prose requiring removal |

### 4.21 `.references/awesome-codex-skills/lead-research-assistant/SKILL.md`
| Field | Detail |
|---|---|
| **Source file** | `.references/awesome-codex-skills/lead-research-assistant/SKILL.md` |
| **Trigger** | User wants to identify and qualify target companies or prospects for a product or service |
| **Steps / contract** | (1) Understand product — analyse codebase if present, ask for value prop; (2) Define ICP (industries, size, geography, pain points, tech requirements); (3) Research and identify leads — match against ICP, look for need signals; (4) Score 1–10 with rationale covering ICP alignment / urgency / budget / timing; (5) Per-lead output (Company, Score, Industry, Size, Why, Decision Maker, Value Prop, Outreach Strategy, Conversation Starters); (6) Format as markdown with Summary block; (7) Offer CSV export / outreach drafts |
| **Quality bar** | Every lead scored with labelled rationale factors; Summary block with totals and average; explicit ICP definition before research |
| **Strip** | Named examples (Lenny's Newsletter, Bay Area specifics); LinkedIn URL field; CRM/CSV import suggestions; "run from your codebase" framing |
| **Notes** | 1–10 fit score with labelled rationale factors is the most portable element — applicable to any evaluation or ranking workflow |

### 4.22 `invoice-organizer/SKILL.md`
| Field | Detail |
|---|---|
| **Source file** | `invoice-organizer/SKILL.md` |
| **Trigger** | User asks to organise invoices or receipts for taxes, expense reconciliation, bookkeeping cleanup, or accountant handoff |
| **Steps / contract** | (1) Scan folder (enumerate PDF/image files, report count, types, date range); (2) Extract key fields per file (vendor, date, invoice #, amount, description; flag extraction failures); (3) Determine strategy (by vendor/category/date/tax category — ask if unspecified); (4) Standardise filenames (`YYYY-MM-DD Vendor - Invoice - Description.ext`); (5) Preview plan (folder tree + before/after renames) + await approval; (6) Execute — copy not move originals; (7) Generate CSV summary + completion report |
| **Quality bar** | Copy-not-move default; plan preview before any execution; extraction failures flagged not silently skipped |
| **Strip** | "Examples" section; "Pro Tips"; "Common Organisation Patterns"; "Automation Setup"; "Related Use Cases"; attribution byline |
| **Notes** | Filename convention and plan-preview-before-execute guard are the two highest-value portable artefacts; clean 7-step core after trimming |

### 4.23 `.references/awesome-codex-skills/spreadsheet-formula-helper/SKILL.md`
| Field | Detail |
|---|---|
| **Source file** | `.references/awesome-codex-skills/spreadsheet-formula-helper/SKILL.md` |
| **Trigger** | User needs a formula written, debugged, or ported between Excel and Google Sheets |
| **Steps / contract** | (1) Restate problem with explicit ranges; (2) Draft formula preferring dynamic arrays; (3) Explain placement + named ranges; (4) Handle edge cases (blanks, types, dates, duplicates) with IFERROR/LET/LAMBDA guards; (5) Provide Excel and Sheets variants when porting. Output: primary formula + short explanation + 2–3 row worked example |
| **Quality bar** | Edge cases addressed; Excel/Sheets variants produced for porting requests; named ranges documented |
| **Strip** | Nothing |
| **Notes** | Minor gap: locale/separator handling mentioned in inputs list but not enforced in workflow steps; fold into step 1 |

### 4.24 `theme-factory/SKILL.md`
| Field | Detail |
|---|---|
| **Source file** | `theme-factory/SKILL.md` |
| **Trigger** | User wants to style an artifact (slides, doc, HTML page, report) with a cohesive visual theme |
| **Steps / contract** | (1) Display theme showcase or enumerate available themes; (2) Ask for explicit selection; (3) Read selected theme spec (colors + font pairings); (4) Apply palette and fonts consistently; (5) If no preset fits: elicit description → generate named custom theme → show for review → apply |
| **Quality bar** | Contrast and readability verified; explicit user selection required before applying; custom theme reviewed before application |
| **Strip** | References to `theme-showcase.pdf` and local `themes/` directory; hard-coded theme names (treat as examples) |
| **Notes** | Custom-theme-generation path (description → spec → review → apply) is the most portable piece; "show palette before asking" prevents blind-choice failure mode |

### 4.25 `.references/awesome-codex-skills/slack-gif-creator/SKILL.md`
| Field | Detail |
|---|---|
| **Source file** | `.references/awesome-codex-skills/slack-gif-creator/SKILL.md` |
| **Trigger** | User asks to create an animated GIF for Slack (message or custom emoji) |
| **Steps / contract** | (1) Understand creative vision (what happens, mood); (2) Design in phases: anticipation → action → reaction; (3) Apply composable primitives (shake, bounce, pulse, slide, zoom, explode, wiggle, flip, morph, move); (4) Validate against Slack constraints: message GIF ≤2MB at 480×480px / 15–20fps / 128–256 colors; emoji GIF ≤64KB at 128×128px / 10–12fps / 32–48 colors / 10–15 frames; (5) Iterate if over limits (reduce frames/colors first, then dimensions) |
| **Quality bar** | Constraint validation gate before shipping; optimization order enforced (frames/colors → dimensions → complexity) |
| **Strip** | All Python import statements and module paths (`from core.*`, `from templates.*`); pip install block; `GIFBuilder` class usage |
| **Notes** | Slack constraint numbers are empirical platform limits any implementation must respect; 3-phase animation design structure maps to a language-agnostic SOP |

### 4.26 `.references/awesome-codex-skills/support-ticket-triage/SKILL.md`
| Field | Detail |
|---|---|
| **Source file** | `.references/awesome-codex-skills/support-ticket-triage/SKILL.md` |
| **Trigger** | User pastes or references a support ticket, email thread, or chat export and wants triage, categorisation, or a drafted response |
| **Steps / contract** | (1) Gather ticket text + product area + customer tier; (2) Parse severity/impact/reproduction hints; (3) Categorise with priority P0–P3 + justification; (4) Draft acknowledgment reply (empathy, restatement, next steps, missing-info asks, repro checklist); (5) Produce internal notes (root cause hypothesis, logs needed, teams to loop, tracking IDs); (6) Deliver tabular summary: Category | Priority | Summary | Proposed Fix | Reply Draft |
| **Quality bar** | No ETAs without data; PII masking; multi-hypothesis output when signal is weak |
| **Strip** | Platform brand names in description (Zendesk/Intercom/Help Scout — list as examples, not requirements) |
| **Notes** | Strong quality-gate rules; pairs well with `issue-triage` (engineering bug path) and `doc-internal-comms` (escalation write-ups) |

---

## 5. Portability Ranking

### High (port as-is or with trivial strip)

| Rank | File | Rationale |
|---|---|---|
| 1 | `.references/awesome-codex-skills/email-draft-polish/SKILL.md` | Nothing to strip; complete workflow with explicit quality gate |
| 2 | `.references/awesome-codex-skills/meeting-notes-and-actions/SKILL.md` | Nothing to strip; explicit hallucination-avoidance and vague→concrete conversion are best-in-class |
| 3 | `.references/awesome-codex-skills/support-ticket-triage/SKILL.md` | Platform-agnostic; strong P0–P3 quality bar and PII-masking rule |
| 4 | `.references/awesome-codex-skills/create-plan/SKILL.md` | Only path-example strip needed; phase-ordered checklist template is prescriptive and immediately reusable |
| 5 | `.references/awesome-codex-skills/spreadsheet-formula-helper/SKILL.md` | Nothing to strip; production-ready |
| 6 | `invoice-organizer/SKILL.md` | Clean 7-step core after trimming examples section |
| 7 | `.references/awesome-codex-skills/changelog-generator/SKILL.md` | Attributions and Related Use Cases strip quickly; core is clean |
| 8 | `.references/awesome-codex-skills/webapp-testing/SKILL.md` | Script path strip only; decision tree pattern is the standout portable artefact |

### Medium (port after targeted strip, ~1–2 hours work)

| Rank | File | Key stripping task |
|---|---|---|
| 9 | `.references/awesome-codex-skills/internal-comms/SKILL.md` | Replace hard tool references with generic language |
| 10 | `.references/awesome-codex-skills/content-research-writer/SKILL.md` | Strip filesystem commands and named persona |
| 11 | `.references/awesome-codex-skills/tailored-resume-generator/SKILL.md` | Remove worked example, convert negative framing |
| 12 | `mcp-builder/reference/mcp_best_practices.md` | Drop second half (verbatim protocol docs); strip code boilerplate |
| 13 | `.references/awesome-codex-skills/mcp-builder/reference/evaluation.md` | Drop Python/OpenAI execution harness section |
| 14 | `.references/awesome-codex-skills/mcp-builder/SKILL.md` | Strip language-specific Phase 2; keep phases 1, 3, 4 |
| 15 | `.references/awesome-codex-skills/gh-fix-ci/SKILL.md` | Strip sandbox escalation notes |
| 16 | `.references/awesome-codex-skills/gh-address-comments/SKILL.md` | Strip sandbox escalation clauses |

### Partial (port after significant rewrite or extract sub-procedure only)

| Rank | File | What to extract |
|---|---|---|
| 17 | `.references/awesome-codex-skills/notion-meeting-intelligence/SKILL.md` | Meeting-format taxonomy + owner/timebox discipline |
| 18 | `.references/awesome-codex-skills/meeting-insights-analyzer/SKILL.md` | Two output templates + pattern taxonomy checklist |
| 19 | `.references/awesome-codex-skills/notion-spec-to-implementation/reference/spec-parsing.md` | Acceptance criteria triad + ambiguity templates + spec quality rubric |
| 20 | `.references/awesome-codex-skills/skill-creator/SKILL.md` | 6-step workflow + progressive-disclosure model + naming conventions |
| 21 | `canvas-design/SKILL.md` | Philosophy-creation phase only |
| 22 | `competitive-ads-extractor/SKILL.md` | Analysis schema + structured-report template |
| 23 | `theme-factory/SKILL.md` | Custom-theme-generation sub-procedure |
| 24 | `.references/awesome-codex-skills/slack-gif-creator/SKILL.md` | Constraint table + 3-phase animation structure |
| 25 | `.references/awesome-codex-skills/file-organizer/SKILL.md` | Confirmation-gate + structured plan proposal template |
| 26 | `.references/awesome-codex-skills/lead-research-assistant/SKILL.md` | Scored-list output format |

---

## 6. Cross-Cutting Protocol Primitives

Patterns observed in two or more files, independent of domain.

### 6.1 Confirmation gate before execution
**Files:** `file-organizer`, `invoice-organizer`, `gh-address-comments`, `gh-fix-ci`, `notion-spec-to-implementation`  
User sees a structured plan/preview and must issue explicit approval (`yes/no/modify`) before any side-effecting action. `file-organizer` codifies it as a markdown template (current state → proposed tree → change list → ambiguous files → gate). `invoice-organizer` uses a folder-tree + before/after sample. Both enforce copy-not-move as the safe default alongside the gate.

### 6.2 Auth / MCP connection pre-flight guard
**Files:** `gh-address-comments`, `gh-fix-ci`, `notion-spec-to-implementation`, `notion-research-documentation`, `notion-knowledge-capture`, `notion-meeting-intelligence`, `linear`  
All tool-dependent skills open with a connection/auth verification step. The pattern: verify credential/connection → if absent, walk through setup → instruct user to restart agent. The Notion/Codex variants use `codex mcp add` / OAuth; the GitHub variants use `gh auth status`. The abstract pattern (gate on tool availability before proceeding) is platform-agnostic.

### 6.3 Structured plan proposal before code/file changes
**Files:** `create-plan`, `gh-fix-ci`, `file-organizer`, `invoice-organizer`, `notion-spec-to-implementation`  
Plan is presented in a fixed template (intent paragraph, scope in/out, ordered action items, open questions) and awaits approval. `create-plan` defines the canonical template; `gh-fix-ci` routes through the `plan` skill explicitly. The common invariants: no execution before approval; plan structure includes what is out of scope; open questions capped.

### 6.4 Offer variants when the ask is underspecified
**Files:** `email-draft-polish`, `content-research-writer`, `canvas-design`  
When user intent is ambiguous, produce 2–3 alternatives rather than committing to one interpretation. `email-draft-polish` mandates "2–3 tone/length variants when the ask is vague." `content-research-writer` offers "3 typed hook alternatives" with rationale. `canvas-design` implicitly encodes this in the multi-philosophy exploration. The shared invariant: resolve ambiguity by showing options, not asking follow-up questions.

### 6.5 Noise-filtered output with explicit quality gate
**Files:** `changelog-generator`, `meeting-notes-and-actions`, `support-ticket-triage`, `tailored-resume-generator`  
Each SOP includes an explicit filter or gate that prevents low-signal content from passing through: `changelog-generator` excludes internal/maintenance commits; `meeting-notes-and-actions` flags ambiguities rather than inventing answers; `support-ticket-triage` enforces no-ETAs-without-data and multi-hypothesis output under weak signal; `tailored-resume-generator` explicitly scopes in/out requirements by tier.

### 6.6 Copy-not-move / non-destructive execution default
**Files:** `file-organizer`, `invoice-organizer`  
Both file-management skills default to copying originals rather than moving or deleting. `file-organizer` also mandates logging all moves for undo. The shared principle: preserve the pre-operation state until the user has verified the result.

### 6.7 Bundled helper script as black box
**Files:** `gh-address-comments`, `gh-fix-ci`, `webapp-testing`, `mcp-builder/evaluation.md`  
Each skill ships a companion script (Python or similar) and instructs the agent to invoke it as a black box rather than re-implementing the logic inline. `webapp-testing` articulates this explicitly as "run `--help` first, treat scripts as black boxes." The pattern keeps SKILL.md free of implementation detail and makes the script independently replaceable.

### 6.8 Hallucination-avoidance invariant
**Files:** `meeting-notes-and-actions`, `support-ticket-triage`, `content-research-writer`  
Each explicitly prohibits the agent from inventing unverified facts. `meeting-notes-and-actions`: "no hallucinated facts — flag ambiguities as clarifying questions." `support-ticket-triage`: "no ETAs without data; multi-hypothesis when signal is weak." `content-research-writer`: citations formatted at intake, "suggest don't replace" for voice preservation. The shared contract: gaps surface as questions, not filled with plausible guesses.

### 6.9 Read-before-write execution order
**Files:** `linear`, `gh-address-comments`, `mcp-builder/evaluation.md`, `notion-spec-to-implementation`  
All tool-using skills that can perform both read and write operations mandate reading first. `linear` states this as a hard rule. `evaluation.md` requires exploring live content via read-only tool calls before generating QA pairs. `notion-spec-to-implementation` fetches and parses the spec before creating any pages. The shared invariant: write operations are never the first action.

---

## 7. Default Recommendation — Top Picks for Cross-Repo Comparison

The following eight SOPs are the highest-priority candidates for the cross-repo comparison phase. They represent distinct SOP archetypes with few or no competitors in the current agents repo, maximum portability, and clear quality bars.

| Priority | SOP | Why this one |
|---|---|---|
| ★★★ | `.references/awesome-codex-skills/meeting-notes-and-actions/SKILL.md` | Best-in-class for hallucination-avoidance and vague→concrete conversion; nothing equivalent in agents repo; zero stripping required |
| ★★★ | `.references/awesome-codex-skills/email-draft-polish/SKILL.md` | Complete, tight, zero coupling; explicit variant-under-uncertainty heuristic is a broadly reusable writing primitive |
| ★★★ | `.references/awesome-codex-skills/support-ticket-triage/SKILL.md` | Strong P0–P3 quality bar and PII-masking rule; no platform dependency; pairs with existing `issue-triage` to cover support+engineering triage together |
| ★★★ | `.references/awesome-codex-skills/create-plan/SKILL.md` | Prescriptive plan template with phase ordering and blocking-question cap is immediately promotable; minor strip only |
| ★★ | `mcp-builder/reference/mcp_best_practices.md` (first half only) | Six portable invariants (naming, pagination schema, char-limit, error placement, OAuth, stdio logging) are the most precise MCP reference in any audited repo; complements existing `mcp-builder` skill in agents repo |
| ★★ | `.references/awesome-codex-skills/mcp-builder/reference/evaluation.md` (design section only) | 13-point question checklist is the best eval-design SOP seen across all audited repos; applicable beyond MCP |
| ★★ | `.references/awesome-codex-skills/internal-comms/SKILL.md` | Dispatcher pattern covers 4 communication types in one skill; 3P sub-prompt is immediately promotable; overlaps with `doc-internal-comms` but extends it with clearer scope-scaling rules |
| ★★ | `invoice-organizer/SKILL.md` | Clean 7-step pipeline with filename convention and copy-safety guard; no equivalent in agents repo; trim to core is straightforward |

**Runner-ups for consideration if scope allows:**  
`.references/awesome-codex-skills/tailored-resume-generator/SKILL.md` (10-phase pipeline is unique; needs 40% trim), `.references/awesome-codex-skills/webapp-testing/SKILL.md` (decision tree pattern is distinct from existing `test-webapp` skill — compare before deciding), `.references/awesome-codex-skills/content-research-writer/SKILL.md` (research/citation dimension not present in agents repo `doc-coauthor`).

---

## 8. Structural Patterns

### 8.1 Dispatcher pattern (thin SKILL.md → per-format sub-files)
Seen in `internal-comms/SKILL.md`: the root SKILL.md is a pure type-router; all format-specific logic, tone rules, and output templates live in per-format example files. This keeps the root file scannable and lets individual formats be updated independently. Recommended for any SOP that handles multiple distinct output formats under one trigger.

### 8.2 Quick Reference box as the first artefact
Seen in `mcp_best_practices.md`, `python_mcp_server.md`, `evaluation.md`: a dense summary block (5–10 lines) at the top of the document answers "what are the key rules?" before any procedural detail. Consistently the most reused section in reference-style docs. A strong pattern for any SOP that includes a reference checklist.

### 8.3 Phase-gated loading (load context only when phase is reached)
Seen in `mcp-builder/SKILL.md`: companion reference files (`python_mcp_server.md`, `node_mcp_server.md`, `evaluation.md`) are loaded only when the agent reaches the relevant phase, not upfront. This respects context-window budget and mirrors the three-level progressive-disclosure model in `skill-creator`. Applicable to any multi-phase SOP with language-specific or mode-specific sub-procedures.

### 8.4 ASCII decision tree / flowchart for branching logic
Seen in `webapp-testing/SKILL.md`: static-vs-dynamic and server-running-vs-not branches expressed as a compact ASCII flow diagram. Removes ambiguity in conditionals that prose would leave fuzzy. Low overhead to produce; high cognitive value for any SOP with two or more significant branch points.

### 8.5 ❌/✅ negative-to-positive constraint format
Seen in `webapp-testing/SKILL.md` (`networkidle` anti-pattern callout): forbidden behaviour shown with ❌, correct alternative shown with ✅ on adjacent lines. More memorable than prose rules because the contrast is explicit. Applicable wherever a common failure mode needs to be pre-empted.

### 8.6 Per-type output template blocks
Seen in `content-research-writer/SKILL.md`, `meeting-insights-analyzer/SKILL.md`, `meeting-notes-and-actions/SKILL.md`: each phase or output type has a concrete, copy-paste-ready template block specifying the exact structure of the output (field names, ordering, presence/absence of metadata). These remove ambiguity about what "done" looks like and make evaluation of output quality mechanical.

### 8.7 Numbered explicit strip list
Seen in `mcp-builder/SKILL.md`, `skill-creator/SKILL.md`, `content-research-writer/SKILL.md`: source-file raw-findings include explicit bulleted "Strip:" lists specifying exactly what to remove for portability. This is a strong convention worth adopting in every SOP audit going forward — it makes the difference between "partial" and "yes" actionable without ambiguity.

### 8.8 Annotated good/poor example pairs
Seen in `evaluation.md`: each rule is illustrated with a good example and a poor example, each tagged with "this is good/poor because [reason]." More effective than rules alone because it shows the model what the rule looks like in practice. Applicable to any SOP where the boundary between correct and incorrect output is subtle.

---

## 9. Evidence

All citations are traceable to section headers in `raw-findings.md`.

1. **`create-plan` ≤2 blocking-questions cap:** *"The cap on follow-up questions (≤2, blocking only) prevents the common failure mode of over-interviewing before acting."* — `.references/awesome-codex-skills/create-plan/SKILL.md` Notes section.

2. **`mcp-builder` agent-centric design extractability:** *"The agent-centric design principles block (Phase 1.1) is independently extractable as a high-value reusable SOP fragment applicable to any tool-building or API-wrapper task, not just MCP."* — `.references/awesome-codex-skills/mcp-builder/SKILL.md` Notes section.

3. **`skill-creator` context-window framing:** *"The 'context window is a public good' framing and the prohibition on auxiliary docs (README, CHANGELOG, etc.) inside skill packages are particularly high-signal policies worth lifting verbatim."* — `.references/awesome-codex-skills/skill-creator/SKILL.md` Notes section.

4. **`meeting-notes-and-actions` hallucination avoidance:** *"Stronger than most meeting-notes patterns because it explicitly handles hallucination-avoidance (no invented facts, flag ambiguities) and vague-task→concrete-task conversion."* — `.references/awesome-codex-skills/meeting-notes-and-actions/SKILL.md` Notes section.

5. **`mcp_best_practices.md` six portable invariants:** *"Key invariants to preserve: (1) tool names must use `{service}_{action}_{resource}` pattern… (2) all list tools return `has_more` + `next_offset` + `total_count`… (4) tool errors go in result objects (set `isError: true`), never as protocol-level errors… (6) `stdio` servers must log to `stderr`, never `stdout`."* — `mcp-builder/reference/mcp_best_practices.md` Steps/contract section.

6. **`evaluation.md` anti-Goodhart invariant:** *"The 'do not let the MCP server restrict the kinds of questions you create' invariant is a strong anti-goodhart guardrail worth preserving."* — `.references/awesome-codex-skills/mcp-builder/reference/evaluation.md` Notes section.

7. **`email-draft-polish` variants heuristic:** *"The 'offer variants when the ask is vague' heuristic is broadly reusable in any writing SOP — it sidesteps the common failure mode of committing to one interpretation and iterating."* — `.references/awesome-codex-skills/email-draft-polish/SKILL.md` Notes section.

8. **`webapp-testing` networkidle rule:** *"The `networkidle` wait-before-inspection rule is the most reusable single heuristic — it prevents the most common failure mode in dynamic app testing."* — `.references/awesome-codex-skills/webapp-testing/SKILL.md` Notes section.

9. **`support-ticket-triage` quality-gate rules:** *"Strong quality-gate rules (no ETAs without data, PII masking, multi-hypothesis output when signal is weak)."* — `.references/awesome-codex-skills/support-ticket-triage/SKILL.md` Notes section.

10. **`file-organizer` confirmation gate:** *"The confirmation-gate-before-execution pattern and the structured proposal template are strong reusable SOP elements worth extracting independently."* — `.references/awesome-codex-skills/file-organizer/SKILL.md` Notes section.

11. **`notion-spec-to-implementation/reference/spec-parsing.md` acceptance criteria:** *"The acceptance criteria section is the strongest portable piece — the explicit/implicit/testable triad is a rigorous pattern rarely stated this clearly."* — `.references/awesome-codex-skills/notion-spec-to-implementation/reference/spec-parsing.md` Notes section.

12. **`internal-comms` 3P sub-prompt:** *"The 3P sub-prompt is the strongest individual piece — concrete format, scope-scaling heuristic (bigger team = less granular bullets), and 30–60 second readability target make it immediately usable."* — `.references/awesome-codex-skills/internal-comms/SKILL.md` Notes section.

13. **`mcp_best_practices.md` second-half drop:** *"The second half (after the `----------` separator) is a near-verbatim copy of the official MCP Tools protocol documentation… adds no original best-practice content, and should be dropped in favour of a URL reference."* — `mcp-builder/reference/mcp_best_practices.md` Portable/Reason section.

14. **`invoice-organizer` copy-safety guard:** *"The filename convention and the plan-preview-before-execute guard are the two highest-value portable artefacts."* — `invoice-organizer/SKILL.md` Notes section.

15. **`content-research-writer` research/citation gap:** *"This skill substantially overlaps with our `doc-coauthor` and `doc-edit-article` skills but adds a distinct research/citation-management dimension those lack."* — `.references/awesome-codex-skills/content-research-writer/SKILL.md` Notes section.
