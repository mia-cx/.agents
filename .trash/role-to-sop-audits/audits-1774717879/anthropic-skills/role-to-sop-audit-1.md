# Audit: `anthropic-skills` → `.agents` SOP Extraction
**Source repo:** `.references/anthropic-skills/`  
**Findings source:** `raw-findings.md`  
**Date:** 2026-03-28

---

## 1. Repo Overview

`anthropic-skills` is a skills library maintained by Anthropic for use with Claude.ai and the Claude Agent SDK. Its purpose is to package reusable AI-workflow procedures as loadable skill files that Claude instances can consume at runtime. The repo ships skills across three capability clusters registered in a plugin marketplace manifest: document-production skills (`doc-coauthoring`, `internal-comms`, file-format skills), example skills (creative/media tools), and API-integration skills (`mcp-builder`, `claude-api`, `skill-creator`). Each skill follows a two-part packaging convention: YAML frontmatter declaring identity and trigger description, followed by a Markdown prose body carrying the procedural contract. Larger skills bundle subordinate agent specs, reference docs, and eval scaffolding alongside the primary `SKILL.md`. The repo includes a `template/SKILL.md` scaffold that confirms the minimum viable file shape. Skills load lazily and in full at trigger time; there is no partial-section loading within a single `SKILL.md`. Several skills (`mcp-builder`, `skill-creator`) rely on linked reference files loaded during specific phases to control context window size.

---

## 2. Content Summary

The repo contains approximately 50 files across four categories. First, primary skill files (`SKILL.md` per skill directory) encode triggers, workflow steps, and decision trees — the procedural core. Second, sub-agent specs (`agents/` subdirectories in `skill-creator`) define role-bounded sub-agents invoked programmatically by a parent skill. Third, reference docs (`reference/` subdirectories in `mcp-builder` and `claude-api`) provide language-specific implementation guides, API catalogs, naming standards, and eval methodology; many of these are vendor- or SDK-specific and not portable. Fourth, one structural artifact — `.claude-plugin/marketplace.json` — defines how skills are grouped into named plugin bundles for discovery and installation. The `claude-api` skill is the largest subtree, containing multi-language SDK guides (TypeScript, Python, Java, Go, Ruby, C#, PHP, cURL) that are uniformly non-portable. The `skill-creator` subtree is the most architecturally complex, bundling five interdependent files (SKILL.md, three agent specs, one schema catalogue) that together constitute a complete eval harness. Creative/media skills (`algorithmic-art`, `canvas-design`, `slack-gif-creator`, `theme-factory`) are structurally simple but procedurally narrow. File-format skills (`xlsx`, `docx`, `pdf`, `pptx`) follow the same pattern and are uniformly tool-dependent.

---

## 3. SOP Split

### Port

| File | Short description | Reason to port |
|------|-------------------|---------------|
| `skills/doc-coauthoring/SKILL.md` | Three-stage document co-authoring workflow (Context Gathering → Refinement → Reader Testing) | Platform-agnostic multi-stage writing SOP; reader-testing gate and brainstorm-curate loop are reusable beyond doc writing |
| `skills/skill-creator/SKILL.md` | End-to-end skill authoring and eval loop (capture → interview → draft → test → eval → optimize → package) | Writing principles, description-optimization heuristics, and eval-loop structure are universally applicable; tooling layer is strippable |
| `skills/skill-creator/agents/comparator.md` | Blind A/B output comparison sub-agent | Self-contained; no repo-specific references; rubric-generation step is dynamically task-adapted; JSON output contract is machine-readable |
| `skills/skill-creator/agents/grader.md` | Evidence-based eval grader sub-agent | Tight 8-step grading loop; dual-job framing (grade + meta-critique); anti-superficiality principle is directly extractable as a standalone quality rule |
| `skills/skill-creator/agents/analyzer.md` | Post-hoc comparative analyzer (partial port) | Instruction-following scoring rubric and improvement-suggestion taxonomy are portable; I/O contract is harness-specific and must be stripped |
| `skills/skill-creator/references/schemas.md` | Eight JSON schemas encoding a complete two-agent eval architecture | Battle-tested eval architecture (executor/grader separation, blind comparison, hill-climbing version history, self-improving grader); patterns apply to any LLM skill eval pipeline |
| `skills/mcp-builder/SKILL.md` | Four-phase MCP server build SOP (Research → Implement → Review → Evaluate) | Four-phase macro-pattern and tool-design heuristics are language-agnostic; strongest "build an integration" SOP in the repo |
| `skills/mcp-builder/reference/mcp_best_practices.md` | MCP naming, transport, pagination, security, annotation standards | No org-specific content; directly reusable as a companion reference or condensed checklist; nothing to strip |
| `skills/mcp-builder/reference/evaluation.md` | 13-rule QA evaluation design protocol for LLM tool-calling | Question-design ruleset (independence, idempotence, synonym paraphrase, verifiable single answer, multi-hop complexity) is runtime-agnostic; execution section (Python harness) must be stripped |
| `skills/webapp-testing/SKILL.md` | Playwright reconnaissance-then-action testing SOP | Reconnaisance-before-act pattern and `networkidle` pitfall warning are portable; check delta against existing `test-webapp` skill before promoting |
| `skills/claude-api/SKILL.md` | Multi-signal language detection and dispatch router | Router architecture (file-signature fingerprinting → AskUserQuestion fallback → sub-doc dispatch) is a reusable structural pattern for any multi-path skill; strip all Claude API content |
| `skills/claude-api/shared/prompt-caching.md` | Prefix-cache alignment discipline and silent-invalidator audit | Core invariant, stability taxonomy, and silent-invalidator checklist survive full API-stripping; applicable to any prefix-keyed caching system |
| `.claude-plugin/marketplace.json` | Plugin bundle registry schema | Thematic bundle grouping pattern (name/strict/skills/source) is directly reusable for any skills marketplace; strip PII and org-specific paths |

### Leave Out

| File | Short description | Reason to exclude |
|------|-------------------|-------------------|
| `template/SKILL.md` | Empty scaffold with placeholder frontmatter | Contains no procedural content; pure boilerplate; value is only as a shape reference |
| `skills/algorithmic-art/SKILL.md` | p5.js generative art workflow | Tightly coupled to p5.js HTML artifact generation and specific viewer/template workflow; narrow creative tool |
| `skills/brand-guidelines/SKILL.md` | Anthropic brand palette and typography reference | Organisation-specific; palette and typography rules not transferable |
| `skills/canvas-design/SKILL.md` | Single-page PDF/PNG visual art production | Specialised creative production workflow; not a general SOP |
| `skills/slack-gif-creator/SKILL.md` | Slack-optimised animated GIF workflow | Platform-specific media production with Slack format constraints |
| `skills/theme-factory/SKILL.md` | Theme selection and artifact styling | Bound to the repo's artifact styling system; presentation-design utility |
| `skills/xlsx/SKILL.md` | Excel formula, formatting, and recalculation workflow | Tool-dependent; no portable process layer |
| `skills/docx/SKILL.md` | Word document generation and editing via docx-js | Format-specific; XML internals and docx-js patterns are not portable |
| `skills/pdf/SKILL.md` | PDF manipulation workflow | Tied to specific libraries and CLI tools; a tool manual not a SOP |
| `skills/pptx/SKILL.md` | PowerPoint generation and editing | Tightly coupled to PPTX-specific tooling and slide-render QA |
| `skills/frontend-design/SKILL.md` | Production UI code and aesthetics guidance | Implementation- and medium-specific; not a general SOP |
| `skills/web-artifacts-builder/SKILL.md` | React/Tailwind/shadcn artifact pipeline | Toolchain recipe bound to a specific stack |
| `skills/internal-comms/SKILL.md` | Internal communications dispatcher | Real SOP value locked in missing `examples/` files; dispatcher skeleton alone delivers nothing actionable |
| `skills/internal-comms/examples/*.md` | 3P updates, newsletter, FAQ, general-comms templates | Org-specific communication templates; not generalizable beyond those formats |
| `skills/claude-api/shared/live-sources.md` | Anthropic documentation URL index | Retrieval aid, not a SOP |
| `skills/claude-api/python/**`, `typescript/**`, `java/**`, `go/**`, `ruby/**`, `csharp/**`, `php/**`, `curl/**` | Language-specific SDK guides | All uniformly vendor- and SDK-locked; no portable process layer |
| `skills/mcp-builder/reference/node_mcp_server.md` | Node/TypeScript MCP server implementation recipe | SDK-specific; not a general SOP |
| `skills/mcp-builder/reference/python_mcp_server.md` | Python FastMCP implementation guide | Language- and SDK-specific |
| `skills/pdf/forms.md`, `skills/pdf/reference.md` | PDF form-filling and library reference | Format-specific toolchain |
| `skills/pptx/editing.md`, `skills/pptx/pptxgenjs.md` | PPTX XML and PptxGenJS library guides | Library-specific implementation details |
| `skills/algorithmic-art/templates/*` | p5.js viewer HTML and generator JS templates | Project-specific scaffolding artifacts |

---

## 4. Per-SOP Table (Portable Candidates)

| # | Source file | Trigger | Steps / contract summary | Quality bar | Escalation | Strip | Notes |
|---|-------------|---------|--------------------------|-------------|------------|-------|-------|
| 1 | `skills/doc-coauthoring/SKILL.md` | User wants to write documentation, proposals, specs, RFCs, decision docs; phrases: "write a doc", "draft a proposal", "create a spec", "design doc" | (1) Offer workflow, get consent; (2) Stage 1 — 5 meta-questions, info-dump, 5–10 numbered clarifying questions; (3) Stage 2 — agree section list, scaffold, per-section brainstorm→curate→draft→surgical-edit loop, coherence pass at 80%; (4) Stage 3 — generate 5–10 reader questions, test with fresh zero-context session, record pass/fail, loop back to Stage 2 on failures; (5) Final owner read-through + impact check | Reader Claude must answer all generated questions correctly before exit | Loop back to Stage 2 for any Reader Claude failure; escalate to user only if fundamentally scoped wrong | Strip: `create_file`/`str_replace` tool calls; Claude.ai connector references; sub-agent invocation mechanics (replace with "open fresh session" fallback); alt-text image handling section | "Never reprint the whole doc; use surgical edits only" is a hard working contract. Reader Testing stage is the standout differentiator and highest-value portable piece. |
| 2 | `skills/skill-creator/SKILL.md` | User wants to create, edit, or optimise a skill; benchmark skill performance; improve skill triggering accuracy | (1) Capture intent or interview; (2) Research edge cases, I/O, success criteria; (3) Write SKILL.md; (4) Propose 2–3 test prompts, save to evals; (5) Spawn with/without-skill runs; (6) Draft assertions; (7) Capture timing; (8) Grade, aggregate benchmark; (9) Launch review, await feedback; (10) Improve skill; (11) Re-run in next iteration dir; (12) Optional blind A/B; (13) Description optimisation (20 trigger-eval queries → run_loop → apply best_description); (14) Package | Pass rate improves or matches across iteration versions; description triggers on near-miss negatives | Re-run full eval loop; escalate to user when eval feedback (grader meta-critique) suggests evals themselves are flawed | Strip: all script paths (`generate_review.py`, `aggregate_benchmark`, `run_loop.py`, `package_skill.py`); agent sub-paths; `present_files` tool check; Cowork/Claude.ai-specific adaptation sections; model-ID flags; motivational aside | Three-level loading hierarchy (metadata / SKILL.md / bundled resources) is an architectural pattern worth capturing separately. `<500 lines SKILL.md`, `>300-line refs need ToC` are concrete packaging rules. |
| 3 | `skills/skill-creator/agents/comparator.md` | Parent orchestrator needs to rank two skill outputs without knowing their origin; or any two LLM artifacts need impartial scoring | (1) Read both outputs; (2) Parse eval prompt for required qualities; (3) Generate task-adapted 2-dimension rubric (Content + Structure, 1/3/5 anchors); (4) Score each output per criterion; (5) Check provided expectations pass/fail; (6) Declare winner by rubric first, assertions second, TIE last; (7) Write structured JSON to output path | Stay blind throughout: comparator must not know which skill produced which output | If tie is unavoidable, declare TIE with reasoning — do not force a winner | Strip: skill-creator ecosystem path conventions (`output_a_path`, `output_b_path`); generalise to caller-provided references | "Stay blind" invariant prevents self-serving bias. Rubric-generation is dynamically task-adapted rather than fixed — makes protocol domain-agnostic. Strong sub-agent template pattern. |
| 4 | `skills/skill-creator/agents/grader.md` | After a skill execution run when transcript + expectation list are available and a pass/fail verdict is needed | (1) Read transcript completely; (2) Examine output files directly — do not rely on transcript claims alone; (3) Evaluate each assertion (PASS = clear genuine evidence; burden of proof is on PASS); (4) Extract and verify implicit claims; (5) Read `user_notes.md` if present; (6) Critique the evals themselves (flag weak assertions, coverage gaps, unverifiable assertions); (7) Write `grading.json`; (8) Attach executor metrics and timing if present | A passing grade on a weak assertion is worse than useless — it creates false confidence | Emit `eval_feedback.suggestions` only when a genuine gap exists; high bar stated explicitly | Strip: concrete file paths (`{outputs_dir}/../grading.json`, `metrics.json`, `timing.json`); replace with caller-provided references; compress JSON field descriptions to schema skeleton | Dual-job framing (grade + meta-critique) is the standout extractable pattern. Claim-extraction step (Step 4) makes grader an active verifier not passive scorer. |
| 5 | `skills/skill-creator/agents/analyzer.md` | Given two candidate skill outputs and a judge verdict, diagnose why and propose concrete fixes | *Comparative path (8 steps):* read verdict → read both SKILL.md files → read both transcripts → score instruction-following 1–10 per side → surface winner strengths with quotes → surface loser weaknesses with quotes → generate prioritised suggestions (high/medium/low × category) → write JSON. *Benchmark path (6 steps):* read benchmark.json → classify assertions → cross-eval scan → metrics scan → generate observations → write JSON array | "Consider causation" constraint: skill weakness must have actually caused worse output, not merely correlated | Flag when verdict is ambiguous; do not force a winner/loser diagnosis | Strip: harness-specific paths (winner_skill_path, loser_skill_path, comparison_result_path); JSON file-write step; benchmark sub-role should become a separate SOP | Instruction-following scoring rubric (1–10 with issue categories: missed tools, invented steps, skipped instructions) and suggestion taxonomy (instructions/tools/examples/error_handling/structure/references × priority) are directly reusable as a skill-review checklist. |
| 6 | `skills/skill-creator/references/schemas.md` | Skill evaluation, agent benchmarking, version comparison, measuring skill impact; phrases: "eval a skill", "benchmark this agent", "compare skill versions", "measure skill impact" | (1) Define `evals.json` expectations (human-readable, not code assertions); (2) Execute → emit `metrics.json` + `timing.json`; (3) Grade → produce `grading.json` with per-expectation evidence + `eval_feedback`; (4) Benchmark N reps per configuration → `benchmark.json` with run_summary stats + delta; (5) Blind compare → `comparison.json` with dimensional rubric + winner; (6) Analyse → `analysis.json` with improvement suggestions + transcript insights; (7) Track versions in `history.json` parent-chain tree; hill-climb stops when no candidate beats `current_best` | Pass rate is primary metric; blind comparison removes experimenter bias; hill-climbing stops at `current_best` | When grader `eval_feedback` flags coverage gaps, fix the evals before running another benchmark iteration | Strip: directory layout conventions (`evals/evals.json`, `<run-dir>/outputs/`); replace with caller-provided references; treat field names as API surfaces (warn: renaming `configuration` to `config` silently breaks consumers) | `timing.json` capture note is critical: ephemeral data that cannot be recovered after subagent completion. Eight schemas form a coherent data-flow system (executor → grader → benchmarker → comparator → analyzer); document flow, not schemas in isolation. |
| 7 | `skills/mcp-builder/SKILL.md` | User wants to build an MCP server, expose an API to an LLM, create agent tools; phrases: "MCP server", "Model Context Protocol", "tool server", "integrate [service] with an AI agent" | (1) Research: fetch MCP spec, load SDK docs, study target API, plan tool inventory (API coverage vs workflow balance), decide transport; (2) Implement: shared infrastructure (API client, error helpers, response formatting, pagination) + each tool (typed input schema, `outputSchema`+`structuredContent`, concise description, behavioral annotations); (3) Review: code quality pass (DRY, consistent error handling, full type coverage), build verification, functional test with MCP Inspector; (4) Evaluate: list tools, inspect schemas, explore live data read-only, generate 10 QA pairs (independent/read-only/complex/realistic/verifiable/stable), verify answers, output as XML | All 10 eval QA pairs must be verifiable by the author before submission; zero write operations in eval phase | If build verification fails, stop Phase 3 and fix before proceeding to eval | Strip: local relative reference paths (`./reference/mcp_best_practices.md`, etc.) — inline key content or replace with live URLs; emoji in headings is cosmetic wayfinding (retain or drop) | Four-phase macro-pattern (Research → Build → Review → Evaluate) is a reusable template for any "build an integration" SOP. Reference files are loaded lazily *during the relevant phase* — a packaging anti-pattern-prevention worth replicating. |
| 8 | `skills/mcp-builder/reference/mcp_best_practices.md` | Building or reviewing any MCP server; questions about tool naming, transport choice, pagination, auth, or error handling in an MCP context | (1) Apply `{service}_{action}_{resource}` snake_case naming; (2) Annotate every tool with `readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`; (3) Support json + markdown response formats; (4) Implement pagination (limit/has_more/next_offset or next_cursor/total_count; default 20–50 items); (5) Choose transport (stdio for local/single-client; Streamable HTTP for remote/multi-client; avoid SSE); (6) Secure with OAuth 2.1 or env-var API keys; validate/sanitize all inputs; suppress internal errors to clients; (7) Error responses inside result objects (`isError: true`), not protocol-level, with actionable next-step hints; (8) Test functional, integration, security, performance, error paths; (9) Document all tools with ≥3 working examples, permissions, rate limits | ≥3 working examples per tool; all test categories covered; every tool annotated | N/A — reference doc, not a workflow | Nothing to strip; no org-specific content present | Can be condensed into a checklist section within mcp-builder skill or kept as a standalone reference loaded on demand. Pagination schema and transport decision table are especially reusable as-is. |
| 9 | `skills/mcp-builder/reference/evaluation.md` | Designing a QA evaluation suite for any LLM tool-calling system; mentions of "eval", "benchmark", "test my tools" | (1) Inspect documentation in parallel (sub-agents, no code reading); (2) Inspect tool schemas — do not call tools yet; (3) Iterate until good understanding formed; (4) Read-only content inspection via tools (incremental, paginated, `limit < 10`); (5) Generate 10 QA pairs following 13 question rules + 6 answer rules; (6) Verify each answer yourself, replace wrong answers, remove any requiring write ops. Output: XML `<evaluation><qa_pair><question/><answer/></qa_pair></evaluation>` | Each question: independent, idempotent, paraphrase (no keyword search), single verifiable answer with format spec, stable/historical data only, explicitly multi-hop complex, diverse modalities | If any QA pair requires write operations, remove it entirely — no exceptions | Strip: entire "Running Evaluations" section (Python harness install, `scripts/evaluation.py` CLI, transport types, command-line option table, troubleshooting) | 13 question-design rules are the strongest portable extract. Good/bad example pairs in the source file are excellent teaching material worth preserving verbatim in any port. |
| 10 | `skills/webapp-testing/SKILL.md` | User wants to test, verify, or automate a local web app; phrases: "test my webapp", "Playwright script", "verify frontend", "screenshot the app", "check UI behaviour" | (1) Branch on app type: static HTML → read file for selectors → write Playwright script; dynamic → check server status; (2) Server lifecycle: if not running, manage lifecycle or instruct user; (3) Reconnaissance: navigate to localhost, `wait_for_load_state('networkidle')`, screenshot or `page.content()`, enumerate locators; (4) Selector identification from rendered DOM (prefer `text=`, `role=`, CSS, IDs); (5) Action execution with explicit waits; (6) Cleanup: always `browser.close()`; run `headless=True` unless debugging | Reconnaisance step is mandatory before any action step — no selector assumptions from source code | If `networkidle` times out, fall back to `wait_for_selector` on a known stable element | Strip: `scripts/with_server.py` specific invocation examples; `scripts/` and `examples/` repo-local path references; "read with `--help` first, never read source" directive | Check delta against existing `test-webapp` skill in `.agents` before promoting — likely overlap. Decision-tree code-fence in source is a useful structural device worth retaining. |
| 11 | `skills/claude-api/SKILL.md` *(router pattern only)* | Any skill that must route to language-specific or modality-specific sub-documents based on project context | (1) Detect context from file signatures (ordered extension → language mappings); (2) If multiple contexts: check current file/question first; if still ambiguous, ask user; (3) If undetectable: ask with option list; fallback to default with disclosure; (4) If unsupported: offer closest equivalent + note limitations; (5) Resolve tier via decision tree (simplest-first, escalate when all criteria met); (6) Dispatch to minimal targeted file list, not full folder | Dispatch must resolve to the minimal doc set needed — never load the full folder | If context cannot be resolved after one clarification question, surface all available options | Strip: all Claude model names, IDs, pricing, SDK pitfalls, Anthropic API endpoints, caching/streaming specifics, Agent SDK references, Common Pitfalls section | Quick-task reference matrix (use case → minimal file list) is the most portable sub-pattern. Four-criteria agent-complexity gate (complexity / value / viability / cost-of-error) is independently portable as a generic tier-selection rule. |
| 12 | `skills/claude-api/shared/prompt-caching.md` *(discipline only)* | Designing or auditing any system that caches composed inputs by prefix match — LLM prompt pipelines, CDN caching, memoized request builders | (1) Trace input assembly path — find every source feeding the cacheable prefix; (2) Classify each source by stability (constant / per-session / per-turn / per-request); (3) Verify rendered order matches stability order (stable before volatile); (4) Place breakpoints at stability boundaries, not at end of volatile content; (5) Audit for silent invalidators (datetime/UUID injection, non-deterministic serialization, conditional content branches, per-user fields in shared prefix); (6) Verify with byte-for-byte diff of two rendered inputs | No volatile value may appear before a stable value in the composed prefix | If a silent invalidator cannot be eliminated, document it explicitly and move it to the volatile tail | Strip: `cache_control` JSON, `tools/system/messages` render-order specifics, token minimums, cost ratios, `response.usage.*` field names, language-specific access syntax | "Freeze the shared prefix" architectural guidance and the fork-operation rule (side computations must copy parent prefix verbatim) are the highest-signal portable takeaways. Silent-invalidator table is a strong checklist asset. |
| 13 | `.claude-plugin/marketplace.json` *(pattern only)* | Setting up a skills marketplace or plugin registry for a multi-skill repo | (1) Group skills into named bundles by capability type; (2) Each bundle carries: `name`, `owner`, `version`, `description`, `strict` flag, `source` root, `skills[]` relative path list; (3) Set `strict: true` in production bundles; (4) Use capability-type grouping (document / example / api) not domain grouping | `strict: true` in all production bundles — `strict: false` silently swallows missing skills | Log and surface any missing skill at install time | Strip: owner email/name (PII), org-specific skill paths, version string | `strict: false` default across all plugins in source repo is a silent-failure footgun — document this explicitly in any ported version. |

---

## 5. Portability Ranking

### High — port as-is with documented strips

- `skills/doc-coauthoring/SKILL.md` — complete, well-specified workflow; stage exit conditions explicit; strips are localised
- `skills/mcp-builder/SKILL.md` — strongest "build an integration" macro-pattern in the repo; reference-file dependency is the only structural gap
- `skills/mcp-builder/reference/mcp_best_practices.md` — no strips required; comprehensive standards doc
- `skills/skill-creator/agents/comparator.md` — self-contained; no repo-specific references; machine-readable output contract
- `skills/skill-creator/agents/grader.md` — tight grading loop; anti-superficiality principle is immediately extractable
- `skills/skill-creator/references/schemas.md` — highest-density architectural artifact in the repo; complete eval data-flow system
- `skills/mcp-builder/reference/evaluation.md` — 13 question-design rules are runtime-agnostic; execution section is the only strip

### Medium — port with moderate rework

- `skills/skill-creator/SKILL.md` — tooling references are substantial but separable from the process guidance; writing principles section is high value
- `skills/webapp-testing/SKILL.md` — reconnaisance-before-action pattern is portable; helper-script coupling requires rework; delta-check against existing `test-webapp` skill required before promoting
- `skills/claude-api/shared/prompt-caching.md` — discipline survives full API-stripping intact; requires terminology substitution throughout

### Partial — extract a pattern, not the full skill

- `skills/skill-creator/agents/analyzer.md` — comparative analysis loop is portable; I/O contract and benchmark sub-role need significant restructuring; dual-role-in-one-file is a packaging anti-pattern that should be split on extraction
- `skills/claude-api/SKILL.md` — router/dispatch architecture only; all Claude API content must be stripped; what remains is a structural skeleton
- `skills/internal-comms/SKILL.md` — dispatcher skeleton (type-enum → sub-template lookup) is a clean structural pattern; no actionable content without the missing `examples/` files; promote the pattern, not the skill
- `.claude-plugin/marketplace.json` — bundle-grouping schema is reusable; all content is org-specific; value is purely structural

---

## 6. Cross-Cutting Protocol Primitives

Patterns smaller than a full skill appearing across multiple source files:

1. **Brainstorm-then-curate loop** (`doc-coauthoring`): Generate N numbered options → user selects by number → gap-check before drafting. Reusable in any decision-making workflow where options should be surfaced before commitment.

2. **Executor / grader separation** (`skill-creator/agents/grader.md`, `skill-creator/references/schemas.md`): The agent that executes a task is never the same agent that grades its output. Prevents self-serving bias. Appears as a design invariant across the entire eval harness.

3. **Blind comparison invariant** (`skill-creator/agents/comparator.md`): Judge must not know which version produced which output during scoring. Implemented as a structural constraint on input labelling (A/B, not version names).

4. **Lazy-load reference files during the relevant phase** (`mcp-builder/SKILL.md`): Reference files are loaded at the start of the phase that needs them, not upfront. Reduces context window bloat and keeps each phase self-contained. Appears as an explicit design choice in the skill-creator progressive-disclosure model (three levels: metadata → SKILL.md → bundled resources).

5. **Dispatcher / router skeleton** (`claude-api/SKILL.md`, `internal-comms/SKILL.md`): identify type → map to sub-document → follow sub-document instructions. Clean separation between routing logic and content logic. The quick-task reference matrix (use case → minimal file list) is the densest instantiation.

6. **Zero-context reader test** (`doc-coauthoring`): Test a document by asking a fresh Claude session with zero context to answer questions about it. Acts as a publication quality gate independent of the author's own comprehension.

7. **Surgical-edit discipline** (`doc-coauthoring`): "Never reprint the whole document; use surgical edits only." Appears as an explicit working contract. Applicable to any long-form iterative editing workflow.

8. **Anti-superficiality PASS burden** (`skill-creator/agents/grader.md`): "PASS requires clear evidence of genuine completion; burden of proof is on PASS." Counteracts the tendency for evaluators to award PASS on surface compliance.

9. **Stability-ordered prefix assembly** (`claude-api/shared/prompt-caching.md`): Stable inputs must physically precede volatile inputs in any composed prefix. Silent-invalidator audit (datetime injection, non-deterministic serialization, conditional branches, per-user fields) is the enforcement mechanism.

10. **Meta-critique / self-improving eval loop** (`skill-creator/agents/grader.md`, `skill-creator/references/schemas.md`): The grader is required to critique the evals themselves (`eval_feedback` field) — flagging weak assertions, coverage gaps, and unverifiable claims. The evaluation loop is self-improving by design.

11. **Reconnaissance-before-action** (`webapp-testing/SKILL.md`): Navigate to the target, capture its current state (screenshot or DOM dump), enumerate locators from the rendered DOM — then act. Prevents selector assumptions from source code that may not reflect runtime state.

---

## 7. Default Recommendation

**Ship in `.agents` by default:**

| Artifact | Form | Notes |
|----------|------|-------|
| `doc-coauthoring` port | Full skill at `skills/doc-coauthoring/SKILL.md` | Strip tool-specific artifact creation; collapse integration-conditional branches to single fallback path |
| `mcp-builder` port | Full skill at `skills/mcp-builder/SKILL.md` + `reference/mcp_best_practices.md` | Inline key content from `node_mcp_server.md` / `python_mcp_server.md` into phase steps or link to live docs; retain lazy-load pattern |
| `mcp-eval-design` SOP | Standalone `skills/mcp-eval-design/SKILL.md` extracted from `mcp-builder/reference/evaluation.md` | Strip Python harness entirely; preserve 13 question rules and good/bad examples verbatim |
| `skill-creator` stripped port | Full skill at `skills/skill-create/SKILL.md` | Strip all script paths; keep writing principles, description-optimisation heuristics, and eval-loop structure |
| `blind-comparator` sub-agent | `skills/skill-create/agents/comparator.md` | No modifications required beyond path generalisation |
| `eval-grader` sub-agent | `skills/skill-create/agents/grader.md` | Replace concrete file paths with caller-provided references |
| Eval architecture schemas | `skills/skill-create/references/schemas.md` | Document data-flow between schemas; retain field-name stability warning |

**Port as protocol primitives into rules or companion docs (not full skills):**

| Artifact | Form |
|----------|------|
| Dispatcher/router skeleton | Add as a structural pattern note to `skill-create` |
| Prefix-cache discipline | `rules/prefix-cache-design.md` — stability taxonomy + silent-invalidator checklist; strip all API syntax |
| Marketplace bundle schema | `rules/skill-packaging.md` — document bundle grouping pattern + `strict: true` recommendation |

**Defer (investigate delta first):**

- `webapp-testing` — audit against existing `test-webapp` skill; promote only the reconnaisance-before-action pattern if significant overlap exists

**Do not ship:**

All creative/media skills, file-format skills, brand-guidelines, org-specific internal-comms content, and all Claude API language-specific guides.

---

## 8. Structural Patterns

### Frontmatter schema
All skills use two-field YAML frontmatter: `name` (identifier) and `description` (trigger selector — the text Claude reads to decide whether to activate the skill). A third field `license` appears in `mcp-builder` and `webapp-testing`. No other frontmatter fields are used in this repo. The `template/SKILL.md` scaffold confirms this is the canonical minimum. The `description` field is the sole trigger mechanism — it is used both as human-readable documentation and as a semantic match target. **Pattern worth adopting:** keep `description` operationally specific; avoid vague descriptions that undertrigger.

### Three-level progressive disclosure
Documented explicitly in `skill-creator/SKILL.md`: (1) metadata tier (frontmatter + description), (2) SKILL.md body (the procedural core, `<500 lines`), (3) bundled resources (reference docs, agent specs, eval harness). Level 3 is loaded lazily during the phase that needs it. Reference files longer than 300 lines should have a table of contents. **Pattern worth adopting:** file size limits and the three-level model directly improve context window hygiene.

### Lazy-load reference files
`mcp-builder/SKILL.md` explicitly defers loading of `./reference/mcp_best_practices.md`, `./reference/node_mcp_server.md`, etc. to the phase that uses them rather than loading all references upfront. This is a deliberate design choice documented in the skill. **Pattern worth adopting:** any skill with multiple reference files should specify *when* each is loaded, not just *that* it exists.

### Sub-agent bundling
`skill-creator` bundles three sub-agent specs (`agents/comparator.md`, `agents/grader.md`, `agents/analyzer.md`) alongside the primary `SKILL.md`. These are invoked programmatically by the parent skill. This creates a mini-framework, not a standard skill — the sub-agents cannot function standalone without the orchestrating harness. **Pattern to adopt selectively:** bundle sub-agents only when they are invoked by the parent orchestrator and have no independent use case. If a sub-agent is independently useful (e.g., `comparator`), factor it out as a separate skill or named SOP so it can be composed freely.

### Packaging convention — `skill` directories vs flat files
Every skill lives in its own directory (`skills/<name>/SKILL.md`). Support files (references, agents, examples) are subdirectories of the skill directory. The `.claude-plugin/marketplace.json` registry uses relative paths from a declared `source` root. **Pattern worth adopting:** directory-per-skill isolation prevents naming collisions and makes skill dependencies explicit.

### Dual-role files (anti-pattern)
`skill-creator/agents/analyzer.md` encodes two distinct agent protocols (comparative analyzer + benchmark pattern analyzer) under a single `---` separator. The two protocols have different I/O contracts and different trigger conditions. **Pattern to avoid:** dual-role files in a skills library increase cognitive load and complicate targeted loading. Split into separate files on extraction.

### Marketplace bundle registry
`.claude-plugin/marketplace.json` groups skills into named bundles with a `strict` flag. `strict: false` is the default across all bundles in the source repo — this silently swallows missing skills at load time. The three-bundle taxonomy (document / example / api) uses capability-type grouping rather than domain grouping, which maps better to user mental models when selecting skills. **Pattern to adopt with modification:** use `strict: true` in production; document the failure-mode difference explicitly.

---

## 9. Evidence

Specific citations traceable to `raw-findings.md` findings blocks:

1. **"Never reprint the whole doc; use surgical edits only"** is stated as a hard working contract in the `skills/doc-coauthoring/SKILL.md` findings block. The findings note it is "a strong, opinionated working contract worth preserving verbatim."

2. **Three-level progressive disclosure model** (`metadata → SKILL.md body → bundled resources`) is documented explicitly in the `skills/skill-creator/SKILL.md` findings block, which describes it as an "architectural pattern worth capturing as a skill-packaging SOP" and provides the `<500 lines` / `>300-line refs need ToC` rules.

3. **"A passing grade on a weak assertion is worse than useless — it creates false confidence"** is the verbatim anti-superficiality principle extracted from the `skills/skill-creator/agents/grader.md` findings block, identified there as "the standout extractable rule."

4. **Stay-blind invariant** in the comparator is identified in the `skills/skill-creator/agents/comparator.md` findings block: "The 'stay blind' invariant is the key design insight: separating the executor from the judge prevents self-serving bias."

5. **`timing.json` ephemeral data warning**: the `skills/skill-creator/references/schemas.md` findings block contains a uniquely valuable **capture timing note** — timing data is ephemeral and cannot be recovered after subagent completion. Identified as content to "retain verbatim in any portable extraction."

6. **`strict: false` silent-failure footgun**: the `.claude-plugin/marketplace.json` findings block notes that "`strict: false` should be reviewed per deployment — defaulting to false silently swallows missing skills" and recommends `strict: true` in production bundles.

7. **Lazy-load reference pattern**: the `skills/mcp-builder/SKILL.md` findings block calls out explicitly: "Notable packaging pattern: reference files are loaded lazily *during the relevant phase* rather than upfront — reduces context bloat and keeps each phase self-contained."

8. **Dual-role file packaging anti-pattern**: the `skills/skill-creator/agents/analyzer.md` findings block states: "Dual-role design in one file is a packaging anti-pattern for a skills library — the two protocols should be separate SOPs."

9. **Four-criteria agent-complexity gate**: the `skills/claude-api/SKILL.md` findings block identifies the "Should I Build an Agent?" checklist (complexity / value / viability / cost-of-error) as "independently portable as a generic complexity-tier gate."

10. **Internal-comms SOP value locked in missing files**: the `skills/internal-comms/SKILL.md` findings block states: "The real SOP value is locked in the missing `examples/` files. To promote this as a portable skill the example files must either be inlined or replaced with generic format templates."

11. **Evaluation self-improvement loop**: the `skills/skill-creator/references/schemas.md` findings block identifies `eval_feedback` (where the grader critiques the evals themselves) as "a particularly sophisticated pattern: the evaluation loop is self-improving."

12. **`networkidle` pitfall warning**: the `skills/webapp-testing/SKILL.md` findings block identifies `page.wait_for_load_state('networkidle')` as a known pitfall requiring explicit guidance, and flags it as one of "the highest-value portable pieces" alongside the reconnaissance-then-action pattern.

13. **Schema field-name stability principle**: the `skills/skill-creator/references/schemas.md` findings block warns that "renaming `configuration` to `config` silently breaks the viewer" and frames this as a **schema-stability principle** — "field names in inter-agent contracts must be treated as API surfaces — renaming breaks consumers silently."
