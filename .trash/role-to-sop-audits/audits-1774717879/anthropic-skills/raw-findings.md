
## `template/SKILL.md`
**Type:** Scaffold / meta-template
**Portable:** No
**Reason:** Empty placeholder — contains no procedural content, only a YAML frontmatter stub (`name`, `description`) and a single heading prompt. There is no trigger logic, no steps, no contract, and no behavioural guidance to extract.
**Trigger:** `description` field is a literal placeholder string ("Replace with description of the skill and when Claude should use it."); never fires in practice.
**Steps/contract:** None.
**Strip:** Nothing to strip — the entire file is boilerplate scaffolding.
**Structure/format:** Two-field YAML frontmatter (`name`, `description`) + bare `# Insert instructions below` heading. This is the canonical packaging pattern used across all skills in the repo: frontmatter declares identity/trigger, body carries procedure. Confirms the expected shape every real skill follows.
**Notes:** Value is purely structural: confirms the minimum viable skill file shape (frontmatter + prose body). Useful as a reference for the SOP packaging pattern but contributes zero portable SOP content.
## skills/doc-coauthoring/SKILL.md

**Type:** Interactive multi-stage workflow (stateful conversational SOP)
**Portable:** YES — high-value procedural core; easily separated from platform specifics
**Reason:** Encodes a rigorous, reusable document co-authoring protocol (Context Gathering → Refinement & Structure → Reader Testing) that applies to any long-form writing task regardless of toolchain. The three-stage structure, brainstorm/curate/draft/refine loop, and reader-testing concept are platform-agnostic SOPs. Only thin artifact-handling branches are platform-specific.
**Trigger:** User wants to write documentation, proposals, technical specs, decision docs, RFCs, or any substantial structured content; trigger phrases: "write a doc", "draft a proposal", "create a spec", "design doc", "decision doc", "RFC", "write up".
**Steps/contract:**
1. **Offer workflow** — explain three stages; ask if structured or freeform preferred; proceed only on acceptance.
2. **Stage 1 — Context Gathering:** Ask 5 meta-questions (doc type, audience, desired impact, template, constraints) → encourage unstructured info-dump → pull in linked docs/channels if integrations available → ask 5–10 numbered clarifying questions based on gaps → exit when edge-case questions no longer require basics explained.
3. **Stage 2 — Refinement & Structure:** Agree on section list → create scaffold with placeholder text → for each section: (a) 5–10 clarifying questions, (b) brainstorm 5–20 numbered options, (c) user curates by number, (d) gap check, (e) draft section replacing placeholder, (f) iterate via surgical edits only (never reprint whole doc) until stable; after 3 stable iterations ask "can anything be cut?"; full-doc coherence pass at 80%+ completion.
4. **Stage 3 — Reader Testing:** Generate 5–10 realistic reader questions → test with sub-agent (if available) or instruct user to use a fresh Claude session → for each question record whether Reader Claude answered correctly → run ambiguity/assumption/contradiction checks → loop back to refinement for failures → exit when Reader Claude answers consistently correctly.
5. **Final review:** Recommend owner read-through, fact-check, impact check; offer final tips (appendix linking conversation, use appendices for depth).
**Strip:**
- Artifact creation via `create_file` / `str_replace` (tool-specific)
- References to Claude.ai connectors, MCP server detection, integration availability branches
- Sub-agent invocation mechanics (replace with "open a fresh session" fallback in portable version)
- Alt-text image handling section
**Structure/format:** Skill file; YAML frontmatter (name, description); H1 title; H2 sections per stage with H3 sub-steps; numbered and bulleted lists throughout; inline bold for stage/step labels; conditional branches (with/without integrations, with/without sub-agents) embedded inline as **If … / If no …** paragraphs.
**Notes:**
- The "Reader Testing" stage is the standout differentiator: testing a doc with a zero-context Claude instance before publishing is a high-signal, portable quality gate worth extracting as a standalone SOP pattern.
- Brainstorm-then-curate loop (generate 5–20 numbered options → user selects by number → gap-check before drafting) is a reusable pattern applicable beyond doc writing.
- "Never reprint the whole doc; use surgical edits only" is a strong, opinionated working contract worth preserving verbatim.
- Conditional branching on integration availability makes the skill verbose; a portable version should collapse to a single fallback path (paste content / open fresh session) and note the enhanced path in a short aside.
- Structurally this is one of the most fully-specified skills in the set — stage exit conditions, transition prompts, and deviation-handling are all explicit, making it a good template for authoring other workflow skills.

---

## skills/skill-creator/SKILL.md

**Type:** Meta-workflow skill (skill authoring & eval framework)

**Portable:** Yes — high-value procedural core; tooling references need stripping

**Reason:** Contains a complete, principled skill-authoring loop (capture intent → interview → draft → test → eval → iterate → optimize description → package). The loop structure, writing patterns, and improvement heuristics are universally applicable regardless of runtime. The eval/tooling layer is Anthropic-infrastructure-specific but separable from the process guidance.

**Trigger:** User wants to create, edit, or optimize a skill; benchmark skill performance; or improve skill triggering accuracy.

**Steps/contract:**
1. Capture intent (extract workflow from conversation, or interview fresh: what/when/output format/test case need)
2. Interview & research — edge cases, input/output, dependencies, success criteria
3. Write SKILL.md (name, description, compatibility, body)
4. Propose 2–3 test prompts; get user sign-off; save to `evals/evals.json`
5. Spawn with-skill AND baseline subagent runs in the same turn
6. While runs execute: draft quantitative assertions; explain to user
7. Capture timing data from run notifications into `timing.json`
8. Grade each run; aggregate into `benchmark.json`; run analyst pass
9. Launch eval viewer (`generate_review.py`); wait for user feedback (`feedback.json`)
10. Improve skill (generalize feedback, keep prompt lean, explain the why, bundle repeated scripts)
11. Re-run into next iteration directory with `--previous-workspace`; repeat until satisfied
12. Optional: blind A/B comparison via `agents/comparator.md`
13. Description optimization: generate 20 trigger-eval queries → user review → `run_loop.py` → apply `best_description`
14. Package via `package_skill.py` and present `.skill` file (if `present_files` tool available)

**Strip for SOP:**
- All paths to `eval-viewer/generate_review.py`, `scripts/aggregate_benchmark`, `scripts/run_loop`, `scripts/package_skill`
- References to `agents/grader.md`, `agents/comparator.md`, `agents/analyzer.md`, `references/schemas.md`
- `present_files` tool check and `.skill` packaging step
- Cowork-specific and Claude.ai-specific adaptation sections
- Specific model-ID flag (`--model <model-id>`) in `run_loop.py` invocation
- The "billions in economic value" motivational aside

**Structure/format:** Long-form Markdown with H2 phases, numbered steps within phases, fenced code blocks for JSON schemas and bash commands, inline pattern callouts. Three-level progressive disclosure model documented explicitly (metadata → SKILL.md body → bundled resources). Directory anatomy shown as a tree. Substantial "writing style" philosophy section embedded inline.

**Notes:**
- **High-signal writing principles** worth extracting verbatim: (a) explain *why* over MUST/NEVER directives; (b) generalize from examples rather than overfit; (c) keep prompts lean; (d) bundle repeated scripts discovered across test runs; (e) "pushy" description framing to counteract undertriggering.
- The description-optimization section is the strongest portable piece — the trigger-eval design heuristics (realistic queries, near-miss negatives, avoid trivially obvious cases) are runtime-agnostic best practice.
- Eval assertion guidance ("objectively verifiable, descriptive names, don't force assertions on subjective outputs") is directly reusable.
- The three-level loading hierarchy (metadata / SKILL.md / bundled resources) is an architectural pattern worth capturing as a skill-packaging SOP.
- Progressive-disclosure file size guidance (<500 lines SKILL.md, >300-line refs need ToC) is a concrete, actionable rule.
- Audit flag: skill bundles its own agent sub-definitions (`agents/` dir) — unusual pattern that implies a mini-framework, not just a skill; the SOP should document this pattern separately from simpler skills.


## skills/skill-creator/agents/comparator.md
**Type:** Sub-agent protocol (blind evaluator / judge agent)
**Portable:** Yes — fully portable; no repo-specific references
**Reason:** Self-contained blind-comparison procedure usable any time two candidate outputs need impartial scoring. The rubric-generation step (content × structure, task-adapted criteria) and the JSON output contract are generic enough to apply across skill evals, PR reviews, design comparisons, or any A/B output assessment context.
**Trigger:** Invoked by a parent orchestrator whenever two skill outputs must be ranked without knowing which skill produced them; also useful standalone whenever two LLM-generated artifacts need impartial scoring.
**Steps/contract:**
1. Read both outputs (files or directories).
2. Parse the eval_prompt to identify required qualities.
3. Generate a task-adapted 2-dimension rubric (Content: correctness, completeness, accuracy; Structure: organization, formatting, usability) with 1/3/5 anchors.
4. Score each output per criterion → compute content_score, structure_score, overall_score (1–10).
5. Check any provided expectations (pass/fail per assertion; secondary evidence only).
6. Declare winner A/B/TIE by rubric first, assertions second, with tie as last resort.
7. Write structured JSON to `comparison.json` (or caller-specified path).
**Strip:** skill-creator ecosystem references (paths like `output_a_path`/`output_b_path` can be generalised); JSON schema field names are implementation detail but sensible defaults.
**Structure/format:** Agent markdown with Role / Inputs / Process (numbered steps) / Output Format (JSON schema with inline example) / Field Descriptions / Guidelines sections. Clear, reusable layout — this is a strong sub-agent template pattern.
**Notes:** The "stay blind" invariant is the key design insight: separating the executor from the judge prevents self-serving bias. The rubric-generation step (Step 3) is dynamically task-adapted rather than fixed, which makes the protocol domain-agnostic. The JSON output contract is machine-readable and suitable for downstream aggregation. Worth extracting as a standalone `blind-comparator` SOP / sub-agent template.

## skills/skill-creator/agents/grader.md

**Type:** Agent role — eval grader (structured sub-agent within a skill-eval harness)

**Portable:** Yes — the grading procedure is fully portable; only file-path conventions are harness-specific

**Reason:** Defines a tight 8-step evidence-based grading loop that applies to any skill-eval framework. The core insight — PASS requires genuine substance, not surface compliance — is a reusable quality gate. The dual-job framing (grade outputs *and* critique the evals themselves) is a distinctive, high-value meta-pattern that lifts eval quality over time.

**Trigger:** Invoke after a skill execution run when a transcript + expectation list are available and a pass/fail verdict is needed. The grader receives `expectations`, `transcript_path`, and `outputs_dir` as parameters.

**Steps/contract:**
1. Read transcript completely (eval prompt, steps, errors)
2. Examine output files in `outputs_dir` directly — do not rely solely on transcript claims
3. Evaluate each assertion: PASS = clear evidence of genuine completion; FAIL = absent, contradicted, superficial, or coincidental evidence; burden of proof is on PASS
4. Extract implicit claims from outputs (factual / process / quality) and verify each; flag unverifiable claims
5. Read `user_notes.md` if present; surface executor uncertainties in output
6. Critique the evals: flag assertions that would pass on a clearly wrong output, important outcomes no assertion covers, or assertions that can't be verified from available files — keep bar high
7. Write `grading.json` (sibling of outputs_dir): expectations array with evidence, summary stats, claims array, user_notes_summary, eval_feedback
8. Attach executor metrics and wall-clock timing from `metrics.json` / `timing.json` if present

**Strip when porting:**
- Concrete file paths (`{outputs_dir}/../grading.json`, `metrics.json`, `timing.json`) — replace with caller-provided references
- Detailed JSON field descriptions (compress to schema skeleton in the skill, expand only in implementation notes)
- Harness-specific parameter names if the target framework uses different conventions

**Structure/format:**
- Input: structured prompt parameters (expectations list, two paths)
- Output: JSON with five top-level keys — `expectations[]`, `summary`, `execution_metrics`, `claims[]`, `eval_feedback`; `timing` appended when available
- `eval_feedback.suggestions` is optional; emit only when there is a genuine gap (high-bar principle stated explicitly)

**Notes:**
- **Anti-superficiality principle** is the standout extractable rule: *"A passing grade on a weak assertion is worse than useless — it creates false confidence."* Worth naming as a standalone principle in any eval-quality SOP.
- The claim-extraction step (Step 4) turns the grader into an active verifier rather than a passive scorer — strong pattern for any output-quality SOP.
- Dual-job framing (grade + meta-critique) could be split into two composable roles if eval critique is unwanted overhead in lightweight contexts.
- No environment assumptions beyond file I/O and a JSON writer; very easy to adapt.

## `skills/skill-creator/agents/analyzer.md`
**Type:** Dual-role sub-agent spec (post-hoc comparative analyzer + benchmark pattern analyzer)
**Portable:** Partially — the *analytical reasoning protocols* are highly portable; the *I/O contract* is tightly coupled to the skill-creator eval harness
**Reason:** Contains two distinct, well-structured analytical workflows. The comparative analysis loop (read winner/loser skills + transcripts → score instruction-following → identify strengths/weaknesses → generate prioritised suggestions) is a reusable review pattern applicable to any head-to-head skill comparison. The benchmark pattern-analysis workflow (per-assertion pass/fail matrix, variance flagging, cross-eval pattern noting) is a portable quality-signal extraction protocol. Both are corrupted for direct reuse only by their harness-specific JSON I/O schema.
**Trigger:** Invoked programmatically by a skill-eval orchestrator after blind comparison resolves a winner; not user-facing. Portable trigger equivalent: "given two candidate skill outputs and a judge verdict, diagnose *why* and propose concrete fixes."
**Steps/contract:**
- *Comparative path (8 steps):* (1) Read blind-comparator verdict → (2) Read both SKILL.md files → (3) Read both execution transcripts → (4) Score instruction-following 1–10 per side → (5) Surface winner strengths with quotes → (6) Surface loser weaknesses with quotes → (7) Generate prioritised improvement suggestions (high/medium/low × category) → (8) Write structured JSON to output_path
- *Benchmark path (6 steps):* (1) Read benchmark.json → (2) Classify each assertion as always-pass/always-fail/differentiating/hurting/flaky → (3) Cross-eval pattern scan → (4) Metrics scan (time, tokens, tool_calls) → (5) Generate freeform observation strings → (6) Write JSON array to output_path
- Output schema: rich JSON (comparison_summary, winner_strengths[], loser_weaknesses[], instruction_following scores+issues, improvement_suggestions[{priority,category,suggestion,expected_impact}], transcript_insights) / benchmark: string[]
**Strip:** harness-specific paths (winner_skill_path, loser_skill_path, comparison_result_path, output_path parameters), JSON file-write step, the benchmark sub-role (keep as separate SOP if needed)
**Structure/format:** Single markdown file doubling as two agent specs under one header; no frontmatter; sections separated by `---`; clean numbered steps with sub-bullets; exemplary JSON output schemas inline; structured reference table for suggestion categories and priority levels
**Notes:** The instruction-following scoring rubric (1–10 with explicit issue categories: missed tools, invented steps, skipped instructions) is a strong portable primitive. The improvement-suggestion taxonomy (instructions / tools / examples / error_handling / structure / references × high/medium/low) is directly reusable as a skill-review checklist. The "consider causation" guideline (did the skill weakness *actually* cause worse output?) is a noteworthy intellectual honesty constraint worth preserving in any comparative review SOP. Dual-role design in one file is a packaging anti-pattern for a skills library — the two protocols should be separate SOPs.

## skills/webapp-testing/SKILL.md

**Type:** Tool-augmented procedural SOP (Playwright testing workflow)
**Portable:** YES — moderate-value procedural core; portable decision logic but tightly coupled to bundled helper scripts
**Reason:** Encodes a solid, reusable reconnaissance-then-action pattern for testing local web apps via Playwright that applies beyond this specific repo. The decision tree (static HTML vs. dynamic app, server-already-running vs. not), the `networkidle` pitfall warning, and the inspect-before-act loop are platform-agnostic SOPs. However, the `scripts/with_server.py` black-box invocation pattern is repo-local; portable version must replace it with a generic "manage your own server lifecycle" instruction or a parameterised placeholder.
**Trigger:** User wants to test, verify, or automate a local web application; trigger phrases: "test my webapp", "Playwright script", "verify frontend", "screenshot the app", "check UI behaviour", "debug browser", "browser automation".
**Steps/contract:**
1. **Branch on app type** — static HTML → read file directly for selectors → write Playwright script; dynamic → check whether server is running.
2. **Server lifecycle** — if not running: invoke server lifecycle helper (or instruct user to start server and specify port); if already running: proceed to reconnaissance.
3. **Reconnaissance** — navigate to `localhost:<port>`, call `page.wait_for_load_state('networkidle')`, take screenshot or dump `page.content()`, enumerate locators (`page.locator('button').all()` etc.).
4. **Selector identification** — derive selectors from rendered DOM (prefer `text=`, `role=`, CSS, IDs).
5. **Action execution** — run the automation/test logic using discovered selectors; add explicit waits (`wait_for_selector`, `wait_for_timeout`) as needed.
6. **Cleanup** — always call `browser.close()` at end of script; run headless (`headless=True`) unless debugging.
**Strip:** `scripts/with_server.py` specific invocation examples (replace with generic server-lifecycle placeholder); `scripts/` and `examples/` file-path references that are repo-local; the "read with `--help` first, never read source" directive (tool-packaging heuristic, not a testing SOP).
**Structure/format:** YAML frontmatter (`name`, `description`, `license`) + `# Heading` + decision-tree code-fence + named pattern sections + pitfall callout (`❌`/`✅`) + best-practices list + reference-files list. Follows the canonical repo packaging shape. Decision-tree code-fence is a useful structural device worth retaining in any portable version.
**Notes:** The reconnaissance-then-action pattern and the `networkidle`-before-inspection rule are the highest-value portable pieces. The helper-script black-box discipline ("invoke as CLI, don't read source") is a reusable meta-pattern for any skill that bundles large support scripts but is not itself a testing SOP. Overlap likely with the existing `test-webapp` skill already in the local skills tree — audit for delta before promoting.

## `skills/mcp-builder/SKILL.md`

**Type:** Multi-phase implementation SOP (Research → Implement → Review → Evaluate)
**Portable:** YES — high-value procedural core; the four-phase workflow and tool-design principles are language-agnostic
**Reason:** Encodes a rigorous, repeatable build process for any MCP server with clear decision criteria at each phase. Tool design heuristics (API coverage vs workflow tools, naming conventions, context management, actionable errors, structured output, behavioral annotations), the quality-review checklist, and the evaluation harness are all platform-agnostic and apply to any "build a tool/integration" task. Language-specific content (TypeScript vs Python) is modular and explicitly deferred to reference files, making the spine portable.
**Trigger:** User wants to build an MCP server, expose an external API to an LLM, create agent tools, or mentions "MCP server", "Model Context Protocol", "tool server", or "integrate [service] with an AI agent".
**Steps/contract:**
1. **Phase 1 — Research & Planning:** Fetch MCP spec (sitemap → specific pages with `.md` suffix); load SDK docs (TypeScript recommended: streamable HTTP for remote, stdio for local); study target API (endpoints, auth, data models); plan tool inventory balancing API coverage vs workflow tools; decide transport.
2. **Phase 2 — Implementation:** Set up project structure per language guide; build shared infrastructure (API client + auth, error helpers with actionable messages, response formatting, pagination); implement each tool with: (a) typed input schema (Zod/Pydantic, field descriptions + examples), (b) `outputSchema` + `structuredContent` for structured output, (c) concise tool description, (d) async I/O + error handling, (e) behavioral annotations (`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`).
3. **Phase 3 — Review & Test:** Code quality pass (DRY, consistent error handling, full type coverage, clear tool descriptions); build verification (`npm run build` / `py_compile`); functional test with MCP Inspector (`npx @modelcontextprotocol/inspector`).
4. **Phase 4 — Evaluations:** Inspect all tools; explore live data via read-only calls; generate 10 questions that are independent, read-only, complex (multiple tool calls), realistic, verifiable (single string answer), and stable; verify each answer yourself; output as XML `<evaluation><qa_pair><question>…</question><answer>…</answer></qa_pair></evaluation>`.

**Strip:** Local relative reference paths (`./reference/mcp_best_practices.md`, `./reference/node_mcp_server.md`, `./reference/python_mcp_server.md`, `./reference/evaluation.md`) — these are internal packaging artifacts. A portable SOP must inline their key content or replace with live URLs. Emoji in headings are cosmetic wayfinding; can be retained or dropped.
**Structure/format:** YAML frontmatter (`name`, `description`, `license`) → `# MCP Server Development Guide` → `## Overview` → `# Process` with four `### Phase N` sections each subdivided into numbered `#### N.N` subsections → `# Reference Files` lazy-load index. Clean hierarchical prose; no tables. Notable packaging pattern: reference files are loaded lazily *during the relevant phase* rather than upfront — reduces context bloat and keeps each phase self-contained. Phase gates are implicit (each phase assumes prior complete).
**Notes:** One of the strongest SOP candidates in the repo. The four-phase shape (Research → Build → Review → Evaluate) is a reusable macro-pattern for any "build an integration" SOP. The tool-design principles section is independently extractable as a concise "tool design checklist" SOP. The evaluation framework (10 independent/read-only/complex/realistic/verifiable/stable questions in XML) is a reusable eval harness worth promoting as a standalone SOP. Main weakness: the SKILL.md spine is intentionally thin — it depends heavily on linked reference files for the procedural detail of Phases 2–3; a portable extraction must either inline those references or restructure as a multi-file skill bundle.

## skills/mcp-builder/reference/mcp_best_practices.md
**Type:** Reference / standards doc (naming conventions, transport, security, pagination, annotations, testing)
**Portable:** Yes — high value
**Reason:** Comprehensive, implementation-agnostic standards for MCP server construction. Covers naming, tool design, response formats, pagination contracts, transport selection, security (OAuth 2.1, input validation, DNS rebinding), tool annotations, error handling, and testing/documentation requirements. Nothing Anthropic-org-specific; fully applicable to any MCP server project.
**Trigger:** Use when building or reviewing an MCP server; when user asks about tool naming, transport choice, pagination, auth, or error handling in an MCP context.
**Steps/contract:**
1. Apply server naming convention (`{service}_mcp` / `{service}-mcp-server`).
2. Name tools with snake_case + service prefix + verb (`{service}_{action}_{resource}`).
3. Provide `readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint` annotations on every tool.
4. Support `json` and `markdown` response formats; default to markdown.
5. Implement pagination with `limit`, `has_more`, `next_offset`/`next_cursor`, `total_count`; default 20–50 items.
6. Choose transport: stdio (local/single-client) vs Streamable HTTP (remote/multi-client); avoid SSE.
7. Secure: OAuth 2.1 or env-var API keys; validate/sanitize all inputs (Pydantic/Zod); suppress internal errors to clients.
8. Error responses inside result objects (`isError: true`), not protocol-level; include actionable next-step hints.
9. Test functional, integration, security, performance, and error paths.
10. Document all tools with ≥3 working examples, permissions, rate limits.
**Strip:** Nothing — no org-specific content present.
**Structure/format:** Well-structured reference doc with quick-reference table, named sections, decision table for transport, annotation table, and code examples. Suitable for direct inclusion in a skill or as a companion reference file.
**Notes:** Pairs naturally with the existing `mcp-builder` skill. Could be condensed into a checklist section within the skill, or kept as a standalone reference and loaded on demand. The pagination JSON schema and transport decision table are especially reusable as-is.

## skills/claude-api/SKILL.md

**Type:** Dispatch router + tiered decision framework
**Portable:** Partially — the routing/dispatch architecture is highly portable; the Claude-specific API content is not
**Reason:** The skill contains two reusable structural patterns independent of Claude API content: (1) a multi-signal language detection and dispatch algorithm (file-extension fingerprinting → ambiguity resolution → AskUserQuestion fallback → unsupported-language fallback), and (2) a tiered use-case decision framework (complexity/value/viability/error-cost criteria for tier selection, plus a decision tree that starts from simplest tier and escalates). Both patterns are strong portable SOPs for any skill that must route to language-specific or modality-specific sub-docs.
**Trigger:** When a skill needs to select a sub-document or sub-path based on project context (language, stack, use-case tier) — i.e., any "router" skill
**Steps/contract:**
  1. Detect context from file signatures (ordered list of extension → lang mappings)
  2. If multiple contexts detected: check current file/question first; if still ambiguous, ask user with AskUserQuestion
  3. If context undetectable: use AskUserQuestion with option list; fallback to default with disclosure
  4. If unsupported context: offer closest equivalent + note limitations
  5. Resolve tier/surface via decision tree (simplest-first, escalate only when all criteria met)
  6. Dispatch to task-specific reading guide (quick task reference → targeted file list, not full folder)
**Strip:** All Claude model names, model IDs, pricing, SDK-specific pitfalls, Anthropic API endpoints, compaction/caching/streaming specifics, Agent SDK references, and "Common Pitfalls" section (all Claude-specific)
**Structure/format:** Three-section hierarchy: language detection algorithm → tier/surface decision tree → reading guide (quick-task matrix + full file reference). Quick-task matrix (use case → read only these files) is the most portable sub-pattern — reusable as a "what to load" dispatch table for any multi-doc skill.
**Notes:** The four-criteria "Should I Build an Agent?" checklist (complexity / value / viability / cost-of-error) is independently portable as a generic complexity-tier gate. The language detection table's "grouped aliases" approach (Kotlin/Scala → Java SDK, JS → TS SDK) is a clean pattern for mapping dialects/variants to a canonical implementation path. The quick-task reference matrix deserves extraction as a standalone SOP pattern: map task description → minimal doc set, avoiding over-reading.

## skills/mcp-builder/reference/evaluation.md
**Type:** Process / methodology guide — structured protocol for designing and running evaluations for MCP server tool-calling quality

**Portable:** Mostly yes (question/answer design principles); partially no (execution section)

**Reason:** The 13 question-design rules and 6 answer-design rules (independence, non-destructive, stable/stationary answers, single verifiable value, no keyword-search solvability, complexity via multi-hop, diverse modalities) are generic LLM evaluation design principles applicable to any tool-using agent — not MCP-specific. The "Running Evaluations" section is tied to a concrete Python harness (`scripts/evaluation.py`) with transport-specific CLI flags and is not portable.

**Trigger:** When designing a QA evaluation suite for any LLM tool-calling system (MCP server, agent toolset, API wrapper); mentions of "eval", "benchmark", "test my tools", "how do I know the agent can use this"

**Steps/contract:**
1. Documentation inspection (parallelize sub-agents, no code reading)
2. Tool inspection (list tools, inspect schemas — do not call yet)
3. Iterate until good understanding formed
4. Read-only content inspection via tools (incremental, paginated, `limit < 10`)
5. Generate 10 QA pairs following question + answer guidelines
6. Verification: solve each question yourself, replace wrong answers, remove any requiring write ops
Output: XML `<evaluation><qa_pair><question/><answer/></qa_pair></evaluation>`

**Strip:** Entire "Running Evaluations" section (Python harness install, `scripts/evaluation.py` CLI, transport types stdio/sse/http, command-line option table, troubleshooting). All are specific to the Anthropic MCP eval harness, not the SOP logic.

**Structure/format:** Well-structured — Quick Reference box, numbered guidelines under Question and Answer sections, Good/Poor example pairs with commentary, 5-step process, XML output schema. High signal, low noise in the portable half.

**Notes:** Strongest portable extract is the question-design ruleset: independence, idempotent/non-destructive, no exact-keyword solvability (use synonyms/paraphrase), single verifiable answer with format spec in question, stable/historical data only, diverse answer modalities, explicitly difficult (dozens of tool calls). These 13 rules could form a reusable "LLM Eval Design" SOP. The good/bad example pairs are excellent teaching material worth preserving verbatim.

## `skills/skill-creator/references/schemas.md`

**Type:** Data-contract reference (JSON schema catalogue for a two-agent eval loop)
**Portable:** YES — high-value architecture pattern; the schema set is the most reusable structural artifact in the skill-creator bundle
**Reason:** The eight schemas together encode a complete, battle-tested eval architecture: a prompt-driven executor agent produces `metrics.json` + output files; a separate grader agent produces `grading.json`; a benchmarker compares `with_skill` vs `without_skill` distributions; a blind comparator produces `comparison.json`; a post-hoc analyzer produces `analysis.json` with improvement suggestions. The pass-rate-as-primary-metric, dual-agent separation, and hill-climbing version history are all platform-agnostic patterns directly applicable to any skill or agent evaluation pipeline. The schema field names are strict (the `benchmark.json` note warns that renaming `configuration` to `config` silently breaks the viewer) — a portable SOP should reproduce these contracts exactly or document the invariants clearly.
**Trigger:** Any task involving skill evaluation, agent benchmarking, version comparison, or "does this skill improve outcomes?" questions. Trigger phrases: "eval a skill", "benchmark this agent", "compare skill versions", "measure skill impact", "grading pass rate", "with vs without skill".
**Steps/contract (eval architecture implied by schemas):**
1. **Define expectations** — author `evals/evals.json`: each case has `id`, `prompt`, optional `files[]`, and an `expectations[]` list of human-readable verifiable statements (not code assertions).
2. **Execute** — executor agent runs the prompt + skill, emits `outputs/metrics.json` (tool call counts per type, `files_created`, `errors_encountered`, `output_chars`) and `timing.json` (capture `total_tokens` + `duration_ms` from subagent completion notification — ephemeral, cannot be recovered later).
3. **Grade** — grader agent reads executor transcript + expectations, produces `grading.json`: per-expectation `{text, passed, evidence}`, `summary` (pass/fail/total/pass_rate), `execution_metrics`, `timing`, `claims[]` (extracted + verified), `user_notes_summary` (uncertainties / workarounds), and optional `eval_feedback` (meta-suggestions to improve the evals themselves).
4. **Benchmark** — run N repetitions per configuration (`with_skill` / `without_skill`); collect into `benchmark.json` with `run_summary` statistics (`mean`, `stddev`, `min`, `max` per metric) and a `delta` section; analyzer emits free-form `notes[]` flagging flaky evals, ceiling-effect assertions, and high-variance cases.
5. **Compare (blind)** — comparator receives two outputs labelled A/B without knowing which version they came from; produces `comparison.json` with dimensional rubric (`content`: correctness/completeness/accuracy; `structure`: organization/formatting/usability), per-output `output_quality` (score + strengths/weaknesses), `expectation_results`, and `winner` with `reasoning`.
6. **Analyse** — post-hoc analyzer reads comparison + transcripts; produces `analysis.json`: `winner_strengths`, `loser_weaknesses`, `instruction_following` scores, `improvement_suggestions` (priority + category + suggestion + expected_impact), `transcript_insights` (execution pattern summaries).
7. **Track versions** — `history.json` records a parent-chain tree: each `iteration` has `version`, `parent`, `expectation_pass_rate`, `grading_result` (baseline / won / lost / tie), `is_current_best`; `current_best` points to the champion version. Hill-climbing stops when no candidate beats `current_best`.
**Strip:** File path conventions (`evals/evals.json`, `<run-dir>/outputs/`) are local packaging detail — a portable SOP should describe the schema shapes and agent roles, not the directory layout. The warning about viewer field-name sensitivity (`configuration` not `config`) is implementation-specific; retain as a **schema-stability principle** ("field names in inter-agent contracts must be treated as API surfaces — renaming breaks consumers silently") rather than as a viewer quirk.
**Structure/format:** Flat Markdown with `## <schema-name>.json` H2 sections, each containing: JSON code fence (canonical example), `**Fields:**` bullet list with per-field descriptions, and inline warnings where applicable. No frontmatter, no tables. The schema-per-section pattern is clean and portable; the field description bullets are dense but unambiguous. `timing.json` includes a uniquely valuable **capture timing note** (ephemeral data warning) that should be retained verbatim in any portable extraction.
**Notes:** This file is the highest-density architectural artifact in the skill-creator bundle. The patterns it encodes — two-agent executor/grader separation, expectation lists over code assertions, blind comparison to remove experimenter bias, meta-feedback loop where grader critiques the evals themselves, hill-climbing version history with explicit `current_best` — are mature eval-engineering practices that apply to any LLM skill or agent, not just skill-creator. The `eval_feedback` field (grader suggests improvements to the evals) is a particularly sophisticated pattern: the evaluation loop is self-improving. A portable SOP extraction should treat the eight schemas as a coherent system and document the data-flow between them (executor → grader → benchmarker → comparator → analyzer) rather than presenting them as isolated contracts.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/algorithmic-art/SKILL.md / **Type**: skill / **Portable**: no / **Reason**: This is tightly coupled to p5.js HTML artifact generation and Anthropic’s specific viewer/template workflow, so it is a narrow creative-tool procedure rather than a general SOP.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/brand-guidelines/SKILL.md / **Type**: skill / **Portable**: no / **Reason**: This is a brand-style reference with fixed Anthropic palette and typography rules, making it organization-specific guidance instead of a broadly portable operating procedure.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/canvas-design/SKILL.md / **Type**: skill / **Portable**: no / **Reason**: This focuses on generating single-page PDF/PNG visual artifacts with a bespoke design workflow, which is specialized creative production guidance rather than a reusable SOP.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/slack-gif-creator/SKILL.md / **Type**: skill / **Portable**: no / **Reason**: This is a Slack-specific animated GIF workflow with tool and format constraints, so it is narrow media-production guidance and not a general SOP.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/theme-factory/SKILL.md / **Type**: skill / **Portable**: no / **Reason**: This is a theme-selection and application workflow bound to the repo’s artifact styling system, making it a presentation-design utility rather than a portable process.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/xlsx/SKILL.md / **Type**: skill / **Portable**: no / **Reason**: This is a spreadsheet-specific implementation guide with Excel formula, formatting, and recalculation rules, which are tool-dependent rather than an abstract SOP.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/docx/SKILL.md / **Type**: skill / **Portable**: no / **Reason**: This is a Word-processing workflow for creating and editing .docx files via XML and docx-js, so it is format-specific technical guidance instead of a general SOP.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/pdf/SKILL.md / **Type**: skill / **Portable**: no / **Reason**: This is a PDF manipulation guide tied to specific libraries and CLI tools, making it a file-format tool manual rather than a portable operating procedure.

## skills/claude-api/shared/prompt-caching.md

**Type**: Optimization workflow + design discipline (prefix-cache alignment)

**Portable**: Partially — the discipline is highly portable; the API syntax is not

**Reason**: The core invariant ("a prefix-keyed cache is invalidated by any change at or before the breakpoint") and the five-step optimization workflow (trace → classify by stability → verify order → place breakpoints → audit silent invalidators) apply to any system with composable, prefix-keyed inputs: HTTP/CDN caching, memoization pipelines, compiled prompt stores, request deduplication layers. The stability taxonomy (constant / per-session / per-turn / per-request) and the silent-invalidator grep list (datetime injection, random IDs, non-deterministic serialization, conditional content, per-user variation) are directly reusable. What is NOT portable: `cache_control` JSON syntax, `tools → system → messages` render order, specific token-count minimums, and the write/read cost ratios.

**Trigger**: When designing or auditing any system that caches composed inputs by prefix match — LLM prompt pipelines, CDN caching, memoized request builders, or any multi-part input assembled from stable + volatile components.

**Steps/contract**:
1. Trace the input assembly path — find every source that feeds the cacheable prefix.
2. Classify each source by stability: constant → per-session → per-turn → per-request.
3. Verify rendered order matches stability order (stable physically before volatile; a volatile value injected early makes everything downstream uncacheable).
4. Place breakpoints at stability boundaries (not at the end of volatile content — nothing there will ever be read back).
5. Audit for silent invalidators: datetime/UUID injection, non-deterministic serialization (unsorted maps/sets), conditional content branches, per-user fields in the shared prefix. Move or eliminate them.
6. Verify with a diff: compare two rendered inputs byte-for-byte; any unexpected difference is an invalidator.

**Strip**: Remove all `cache_control` JSON, `tools/system/messages` render-order specifics, token minimums, cost ratios, `response.usage.*` field names, and language-specific access syntax. Replace with generic "breakpoint marker" and "cache key prefix" terminology.

**Structure/format**: One-liner invariant up front → numbered workflow checklist → stability taxonomy (table or bullet tiers) → named placement patterns (one section per scenario) → architectural guidance (freeze-prefix rules) → silent-invalidator table (pattern / why it breaks) → verification loop. Clean progressive structure; the invariant-first opening is unusually effective and worth keeping.

**Notes**: The "freeze the shared prefix" architectural guidance (don't interpolate dynamic data into the stable head; push it to the tail as a separate message/block) is the highest-signal portable takeaway. The fork-operation rule (side computations must copy the parent's prefix verbatim) is a non-obvious but important corollary. Both survive API-stripping intact. The silent-invalidator table is a strong checklist asset. Overall: strip the API layer and this becomes a solid general-purpose prefix-cache design checklist.

## skills/internal-comms/SKILL.md
**Type:** Routing dispatcher skill  
**Portable:** Partially — pattern yes, content no  
**Reason:** The skill itself is a thin router; all format/tone/content logic lives in external `examples/` files (`3p-updates.md`, `company-newsletter.md`, `faq-answers.md`, `general-comms.md`) that are not present in this file. Without those example files the skill delivers no actionable SOP. The *dispatcher pattern* (identify type → load guideline → follow instructions) is a clean, reusable structure worth extracting.  
**Trigger:** Any request to write internal communications — status reports, 3P updates, newsletters, FAQs, incident reports, leadership updates, project updates.  
**Steps/contract:**  
1. Identify communication type from the request.  
2. Map type to the appropriate guideline file (enum of 4 buckets: 3p-updates / company-newsletter / faq-answers / general-comms).  
3. Follow instructions in that file for formatting, tone, content gathering.  
4. If type is ambiguous, ask for clarification.  
**Strip:** All `examples/` file references (org-specific paths). The keyword list is noisy boilerplate; can drop or consolidate.  
**Structure/format:** YAML frontmatter → "When to use" enumeration → "How to use" numbered steps → keywords footer. Matches the standard skill template pattern used across this repo.  
**Notes:** The real SOP value is locked in the missing `examples/` files. To promote this as a portable skill the example files must either be inlined or replaced with generic format templates. The dispatcher skeleton itself (type-enum → sub-template lookup) is a strong pattern for any multi-format writing skill.

---

## .claude-plugin/marketplace.json
**Type:** Plugin registry / structural packaging manifest  
**Portable:** Yes — pattern portable; content is org-specific  
**Reason:** Defines how individual skills are grouped into named plugin bundles (`document-skills`, `example-skills`, `claude-api`) with metadata (owner, version, description, strict flag, source path). No SOP or procedural logic — pure discovery/packaging schema. The grouping pattern (thematic bundle with a shared `source` root and per-skill relative paths) is directly reusable for any skills repo that wants marketplace-style discoverability.  
**Trigger:** N/A — not a skill that triggers on user requests. Consumed by the Claude plugin loader at install/resolution time.  
**Steps/contract:** JSON schema only. Fields of note:  
- `plugins[].name` — bundle identifier  
- `plugins[].strict` — boolean; false = soft-load (don't fail on missing skills)  
- `plugins[].skills[]` — relative paths to skill directories  
- `plugins[].source` — root path for resolving skill paths  
**Strip:** Owner email/name (PII), version string, org-specific skill paths. `strict: false` should be reviewed per deployment — defaulting to false silently swallows missing skills.  
**Structure/format:** Flat JSON with top-level `name`, `owner`, `metadata`, and `plugins` array. No nesting beyond one level of plugin → skills list. Clean and minimal.  
**Notes:** Useful as a reference for how to package a skills marketplace. The `strict: false` default across all plugins is a potential silent-failure footgun — a portable SOP should recommend `strict: true` in production bundles or at minimum document the failure-mode difference. The three-bundle split (document / example / api) demonstrates a sensible taxonomy: capability-type grouping rather than domain grouping.
## `/Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/pptx/SKILL.md` / **Type**: slide deck production skill / **Portable**: no / **Reason**: It is tightly coupled to PPTX-specific tooling, file conversion scripts, and slide-render QA, so the SOP content is presentation-format-specific rather than broadly reusable.
## `/Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/frontend-design/SKILL.md` / **Type**: frontend design guidance / **Portable**: no / **Reason**: The guidance is for building production UI code and aesthetics for web interfaces, which is too implementation- and medium-specific to lift as a general SOP.
## `/Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/web-artifacts-builder/SKILL.md` / **Type**: web artifact build workflow / **Portable**: no / **Reason**: The process is bound to a particular React/Tailwind/shadcn artifact pipeline and bundling scripts, making it a toolchain recipe rather than a portable operating procedure.
## `/Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/internal-comms/examples/3p-updates.md` / **Type**: internal communications template / **Portable**: no / **Reason**: It is a narrowly scoped 3P update format with audience, cadence, and section rules specific to leadership/status reporting, so it does not generalize cleanly beyond that communication type.
## `/Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/internal-comms/examples/company-newsletter.md` / **Type**: internal newsletter template / **Portable**: no / **Reason**: The file is a company-wide newsletter structure optimized for Slack/email distribution and executive announcements, which is a communication artifact template rather than a portable SOP.
## `/Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/internal-comms/examples/faq-answers.md` / **Type**: FAQ drafting template / **Portable**: no / **Reason**: It defines a company FAQ output format tied to enterprise communication and official-source linking, so the guidance is content-format-specific and not a generic SOP.
## `/Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/internal-comms/examples/general-comms.md` / **Type**: internal comms prompt / **Portable**: no / **Reason**: It is a conversational brief for drafting miscellaneous internal messages after clarifying audience, tone, and format, which is a situational writing prompt rather than a standalone portable procedure.
## `/Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/pdf/forms.md` / **Type**: PDF form-filling procedure / **Portable**: no / **Reason**: The workflow is dedicated to detecting, extracting, and filling PDF form fields with PDF/image coordinate handling, so it is narrowly tied to one document type and toolchain.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/claude-api/shared/live-sources.md / **Type**: reference index / **Portable**: no / **Reason**: It only lists live documentation URLs and fetch prompts for Anthropic docs, so it is a retrieval aid rather than a reusable SOP.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/claude-api/python/claude-api/README.md / **Type**: API reference / **Portable**: no / **Reason**: It is a Python SDK reference full of concrete Anthropic client calls and feature-specific examples, which makes it narrow and implementation-specific.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/claude-api/python/claude-api/tool-use.md / **Type**: API guide / **Portable**: no / **Reason**: It focuses on Anthropic tool-use patterns, decorators, and loop handling for the Python SDK, so the guidance is tightly bound to that API.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/claude-api/python/claude-api/streaming.md / **Type**: API guide / **Portable**: no / **Reason**: It documents Python SDK streaming events and message handling for Claude responses, which is specific to Anthropic's client surface.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/claude-api/python/claude-api/batches.md / **Type**: API guide / **Portable**: no / **Reason**: It describes the Claude Messages Batches endpoint, request types, and polling flow, so it is an Anthropic-specific operational guide.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/claude-api/python/claude-api/files-api.md / **Type**: API guide / **Portable**: no / **Reason**: It covers the Anthropic Files API beta, file IDs, and message integration details that are tied to one vendor's beta feature.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/claude-api/python/agent-sdk/README.md / **Type**: SDK reference / **Portable**: no / **Reason**: It is a Claude Agent SDK README centered on the Python package's classes, options, and built-in tools, so it is not a generic SOP.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/claude-api/python/agent-sdk/patterns.md / **Type**: SDK patterns / **Portable**: no / **Reason**: It presents Python-specific Claude Agent SDK patterns for custom tools, hooks, and subagents, making it vendor- and SDK-bound.
## `/Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/pdf/reference.md` / **Type**: PDF processing reference / **Portable**: no / **Reason**: It is a tool-specific reference for PDF rendering, text extraction, and manipulation libraries, so the guidance is tightly bound to PDF workflows rather than a reusable SOP.
## `/Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/pptx/editing.md` / **Type**: PPTX editing workflow / **Portable**: no / **Reason**: The procedure depends on PowerPoint XML internals and repo-specific helper scripts, making it presentation-file tooling rather than a general operating procedure.
## `/Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/pptx/pptxgenjs.md` / **Type**: PPTXGenJS tutorial / **Portable**: no / **Reason**: It is a library-specific API guide for generating slides with PptxGenJS, so the steps and examples are tied to that implementation instead of being broadly portable.
## `/Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/mcp-builder/reference/node_mcp_server.md` / **Type**: MCP server implementation guide (Node/TypeScript) / **Portable**: no / **Reason**: The content is an SDK-specific server build recipe with Node/TypeScript imports, Zod schemas, and MCP registration patterns, so it is not a general SOP.
## `/Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/mcp-builder/reference/python_mcp_server.md` / **Type**: MCP server implementation guide (Python) / **Portable**: no / **Reason**: It is a Python FastMCP implementation guide with Pydantic and decorator-based registration, which makes it language- and SDK-specific rather than portable.
## `/Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/claude-api/shared/tool-use-concepts.md` / **Type**: Claude API tool-use reference / **Portable**: no / **Reason**: This file documents Claude-specific tool runner semantics, server-side tools, and API control flow, so it is API-contract guidance instead of a reusable SOP.
## `/Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/claude-api/shared/error-codes.md` / **Type**: Claude API error reference / **Portable**: no / **Reason**: It enumerates Claude API HTTP errors, retry behavior, and SDK exception classes, which are specific to that API surface rather than a portable process.
## `/Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/claude-api/shared/models.md` / **Type**: Claude model catalog / **Portable**: no / **Reason**: It is a model-ID and capability reference for Claude APIs, so its content is inherently vendor- and API-specific rather than a general SOP.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/claude-api/typescript/claude-api/README.md / **Type**: API-specific guide / **Portable**: no / **Reason**: This is a TypeScript Claude API reference with SDK calls, model names, and response-shape details that are tied to Anthropic’s client.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/claude-api/typescript/claude-api/tool-use.md / **Type**: API-specific guide / **Portable**: no / **Reason**: It documents Claude SDK tool-runner, tool schemas, and message-loop mechanics that only apply to the Anthropic TypeScript SDK.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/claude-api/typescript/claude-api/streaming.md / **Type**: API-specific guide / **Portable**: no / **Reason**: The streaming events, `stream()` API, and SDK-specific event handling are Anthropic TypeScript implementation details.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/claude-api/typescript/claude-api/batches.md / **Type**: API-specific guide / **Portable**: no / **Reason**: This is a narrow reference for the Claude Messages Batches endpoint, including request/response fields and polling patterns specific to the SDK.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/claude-api/typescript/claude-api/files-api.md / **Type**: API-specific guide / **Portable**: no / **Reason**: It covers Anthropic’s beta Files API, including file IDs, beta headers, and message block formats that are vendor-specific.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/claude-api/typescript/agent-sdk/README.md / **Type**: API-specific guide / **Portable**: no / **Reason**: This documents the Claude Agent SDK interface, permissions, hooks, MCP support, and session APIs that are unique to Anthropic’s agent runtime.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/claude-api/typescript/agent-sdk/patterns.md / **Type**: API-specific patterns / **Portable**: no / **Reason**: The examples are entirely centered on Claude Agent SDK query options, hooks, subagents, and session management, so they do not generalize cleanly.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/claude-api/java/claude-api.md / **Type**: API-specific guide / **Portable**: no / **Reason**: This is a Java SDK reference for Anthropic’s Claude API and beta namespaces, with class names and builders that are SDK-locked.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/claude-api/go/claude-api.md / **Type**: language-specific SDK guide / **Portable**: no / **Reason**: Go-only SDK usage with generated types, BetaToolRunner, and Go-specific streaming/tool-loop patterns.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/claude-api/ruby/claude-api.md / **Type**: language-specific SDK guide / **Portable**: no / **Reason**: Ruby-only client, beta tool runner, and prompt-caching conventions tied to Ruby syntax and SDK types.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/claude-api/csharp/claude-api.md / **Type**: language-specific SDK guide / **Portable**: no / **Reason**: C#-specific union handling, beta namespaces, and typed tool/output APIs are bound to the C# Anthropic SDK.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/claude-api/php/claude-api.md / **Type**: language-specific SDK guide / **Portable**: no / **Reason**: PHP SDK examples rely on PHP arrays, named arguments, and Anthropic PHP client conventions.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/claude-api/curl/examples.md / **Type**: raw HTTP example / **Portable**: no / **Reason**: cURL snippets are useful as reference, but they are API-specific request/response examples rather than a portable SOP.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/algorithmic-art/templates/viewer.html / **Type**: HTML template / **Portable**: no / **Reason**: This is a specific generative-art viewer scaffold with Anthropic branding and inline p5.js UI assumptions.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills/skills/algorithmic-art/templates/generator_template.js / **Type**: JavaScript template / **Portable**: no / **Reason**: This is a p5.js generative-art starter file with project-specific structure and comments, not a general SOP.
