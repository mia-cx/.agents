# Role-to-SOP Audit: `anthropic-skills`

**Audit pass:** 1  
**Source repo:** `/Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills`  
**Date:** 2026-03-28  

---

## Repo Overview

`anthropic-skills` is Anthropic's official reference implementation of the Agent Skills standard (agentskills.io). It ships as a Claude Code plugin marketplace entry and a Claude.ai skills library. Its purpose is dual: (1) demonstrate what's possible with the skills system — giving developers patterns to copy — and (2) power several production capabilities in Claude (docx, xlsx, pdf, pptx generation). Skills are self-contained folders with a `SKILL.md` (YAML frontmatter + instruction markdown) plus optional scripts, examples, and reference files. Licensing is mixed: most example skills are Apache 2.0; the four document skills (docx, xlsx, pdf, pptx) are source-available proprietary. The repo contains 17 skills plus a template, a spec stub (pointing to agentskills.io), and a `.claude-plugin/marketplace.json`.

---

## What Kinds of Rules/Skills Are Present

The repo has three broad categories:

1. **Document-file skills** (`docx`, `xlsx`, `pdf`, `pptx`) — deep procedural instructions for reading, creating, and editing specific file formats using Python libraries (openpyxl, pypdf, python-pptx, pandoc) with formula recalculation scripts and strict quality bars (zero formula errors, color-coding standards). Proprietary license.

2. **Creative/design skills** (`algorithmic-art`, `canvas-design`, `frontend-design`, `theme-factory`, `slack-gif-creator`, `web-artifacts-builder`) — instruction sets for generating visual artifacts; heavily tool-specific (PIL, p5.js, React/Tailwind/shadcn). Mostly narrow aesthetic guidance.

3. **Workflow/process skills** (`skill-creator`, `webapp-testing`, `mcp-builder`, `doc-coauthoring`, `internal-comms`, `claude-api`, `brand-guidelines`) — structured multi-step procedures for repeatable professional tasks. These are the highest-portability candidates.

Skills follow a consistent structure: trigger description in frontmatter → decision tree or phase model → tool/library invocations → quality checks → escalation/iteration. No persona wrappers, no role theater — instructions are written as direct agent procedures.

---

## Source-to-Portable Split Summary

| Skill | Port? | Reason |
|---|---|---|
| `skill-creator` | **Yes** | Portable eval-iterate loop for building/improving any skill or SOP |
| `webapp-testing` | **Yes** | Generic recon-then-action pattern for browser automation, broadly portable |
| `mcp-builder` | **Yes** | Phase model for building integration servers; patterns apply to any API integration |
| `doc-coauthoring` | **Yes** | 3-stage co-authoring workflow (context → structure → reader test); entirely tool-agnostic |
| `internal-comms` | **Yes (partial)** | Template-dispatch workflow is portable; actual templates are Anthropic-branded |
| `claude-api` | **Yes (partial)** | Language-detection + SDK-default pattern is portable; SDK specifics are Anthropic-local |
| `docx` | **No** | Proprietary + highly tool-specific (pandoc, python-docx XML) |
| `xlsx` | **No** | Proprietary + Excel-specific (openpyxl, LibreOffice recalc) |
| `pdf` | **No** | Proprietary + PDF-toolchain-specific (pypdf, OCR) |
| `pptx` | **No** | Proprietary + pptx-toolchain-specific (pptxgenjs, markitdown) |
| `algorithmic-art` | **No** | Narrow creative tool (p5.js); non-coding workflow |
| `canvas-design` | **No** | PNG/PDF visual design; non-portable |
| `frontend-design` | **No** | React/HTML aesthetic guidance; opinionated and context-specific |
| `web-artifacts-builder` | **No** | Claude.ai artifact system-specific (React+Vite+Parcel bundle-to-HTML) |
| `slack-gif-creator` | **No** | Single-tool (PIL+Slack GIF format); too narrow |
| `theme-factory` | **No** | Pre-set color/font themes; design artifact, not a process |
| `brand-guidelines` | **No** | Anthropic-specific branding; strip entirely |

---

## SOPs to Port

### SOP 1: `skill-creator` — Iterative Artifact Improvement Loop

**Source:** `skills/skill-creator/SKILL.md`

| Field | Content |
|---|---|
| **Trigger / when to use** | When building any new procedural instruction set, rule, or SOP from scratch; or improving an existing one based on test results |
| **Steps / contract** | 1. Understand the artifact's purpose. 2. Draft instructions. 3. Create test prompts (3–5 realistic cases). 4. Run agent on test prompts (parallel if subagents available). 5. Grade outputs against assertions. 6. Present results to human reviewer (qualitative + quantitative). 7. Revise based on feedback. 8. Repeat until feedback is empty or human approves. 9. Optimize trigger/description separately after content is stable. |
| **Quality bar** | Assertions must be graded against actual outputs; grader must use `text`/`passed`/`evidence` schema; aggregate pass rate tracked per iteration. |
| **Escalation path** | Human-in-the-loop at review step; agent does not self-approve iterations. |
| **Next action** | Package/finalize artifact when feedback clears. |
| **What to strip** | `scripts/` toolchain (Python eval scripts, `aggregate_benchmark.py`, `run_loop.py`, `generate_review.py`); Claude.ai-specific subagent mechanics; `present_files` tool reference; Cowork-specific instructions. |
| **What to port** | Phase structure (draft → test → review → revise → repeat); the insight that eval queries must be substantive and realistic; the principle of separating description-optimization from content-optimization; the warning against overfitting to small test sets; the guidance to explain *why* behind every instruction rather than issuing rigid rules. |
| **Notes** | The core loop is the most transferable SOP in the repo. The tooling scaffolding is Anthropic-internal but the procedure generalizes to any artifact type. See `sops/skill-eval-toolchain/SKILL.md` for the second-order SOP documenting the eval/benchmark toolchain (grader, aggregator, comparator, analyzer, trigger optimizer) as a portable re-implementation specification. |

---

### SOP 2: `webapp-testing` — Recon-Then-Action Browser Automation

**Source:** `skills/webapp-testing/SKILL.md`

| Field | Content |
|---|---|
| **Trigger / when to use** | Any task requiring interaction with a running web application: UI verification, functional testing, selector discovery, screenshot capture, log capture. |
| **Steps / contract** | 1. Classify input (static HTML vs. dynamic app). 2. For static: read HTML, extract selectors, write automation. 3. For dynamic: check if server running; if not, start server with lifecycle manager. 4. Wait for `networkidle` before any inspection. 5. Take screenshot or inspect DOM to discover selectors. 6. Execute actions with discovered selectors. 7. Add waits before assertions. |
| **Quality bar** | Always wait for `networkidle` before inspection on dynamic apps; always close browser when done; use descriptive selectors (text=, role=, CSS, ID). |
| **Escalation path** | If DOM inspection fails after `networkidle`, treat app as dynamic and restart with server-managed approach. |
| **Next action** | Report pass/fail, screenshots, or logs to caller. |
| **What to strip** | `scripts/with_server.py` specific invocations; Playwright-specific syntax (these are implementation details); `examples/` directory references. |
| **What to port** | Decision tree structure (static vs. dynamic → server running? → recon → action); the principle of reconnaissance before action; the `networkidle` wait as a mandatory gate; the black-box script principle (run `--help` before reading source). |
| **Notes** | Decision tree pattern is portable to any UI automation context. Playwright is the most common tool for this pattern but the SOP doesn't need to mandate it. |

---

### SOP 3: `mcp-builder` — API Integration Server Build Process

**Source:** `skills/mcp-builder/SKILL.md`

| Field | Content |
|---|---|
| **Trigger / when to use** | Building any integration layer between an AI agent and an external API or service. |
| **Steps / contract** | Phase 1: Research (understand API coverage vs. workflow tool tradeoff; decide tool naming convention). Phase 2: Design (balance comprehensive coverage with workflow convenience; use action-oriented consistent naming prefixes). Phase 3: Implement. Phase 4: Test and validate tool discoverability. |
| **Quality bar** | Tool names must be clear and action-oriented; discoverability is the primary quality metric; comprehensive API coverage preferred over narrow workflow tools unless client constraints favor the latter. |
| **Escalation path** | Not specified in source (short skill header only — full body requires reading reference/ directory). |
| **Next action** | Validate tool discoverability with an agent before shipping. |
| **What to strip** | FastMCP/MCP SDK specifics; Python/TypeScript implementation code. |
| **What to port** | Phase model; API coverage vs. workflow tool tradeoff analysis; tool naming convention (consistent prefix + action verb); discoverability as primary quality metric. |
| **Notes** | Skill body is short; deeper guidance lives in `reference/` subdirectory. Port the phase structure and the coverage/workflow tradeoff framing. |

---

### SOP 4: `doc-coauthoring` — Three-Stage Document Co-Authoring

**Source:** `skills/doc-coauthoring/SKILL.md`

| Field | Content |
|---|---|
| **Trigger / when to use** | User wants to write documentation, specs, decision docs, proposals, PRDs, RFCs, or any substantial structured prose. |
| **Steps / contract** | Stage 1 (Context Gathering): Close the knowledge gap — ask clarifying questions, capture all context before drafting. Stage 2 (Refinement & Structure): Iteratively build each section via brainstorm + edit cycles. Stage 3 (Reader Testing): Test the draft with a fresh context-free agent to catch blind spots and assumed knowledge. Present each stage as an opt-in offer; allow freeform mode if user declines. |
| **Quality bar** | Document must survive a "cold reader" test (fresh agent with no prior context can understand it). |
| **Escalation path** | User gates each stage transition; agent does not advance autonomously. |
| **Next action** | Deliver final draft after reader test confirms comprehension. |
| **What to strip** | No Anthropic-specific content; skill is already brand-neutral. Strip mentions of "Claude" as the reader-testing agent (use "fresh context" instead). |
| **What to port** | All three stages. The cold-reader test (Stage 3) is the highest-value primitive — it catches the most common doc failure mode (assumed context). The opt-in offer pattern (workflow vs. freeform) is also reusable. |
| **Notes** | Most portable writing workflow in the repo. No tooling dependencies. Applies to any documentation task. |

---

### SOP 5: `internal-comms` — Communication Type Dispatch

**Source:** `skills/internal-comms/SKILL.md`

| Field | Content |
|---|---|
| **Trigger / when to use** | User needs to write a structured internal communication: status report, leadership update, incident report, newsletter, FAQ, project update. |
| **Steps / contract** | 1. Identify communication type from request. 2. Load appropriate template/guideline file (3P updates, newsletter, FAQ, general). 3. Follow format, tone, and content instructions in that file. 4. If type doesn't match, ask for clarification. |
| **Quality bar** | Match the format and tone specified in the guideline file; ask rather than guess on ambiguous type. |
| **Escalation path** | Clarify with user when type is ambiguous. |
| **Next action** | Deliver formatted communication. |
| **What to strip** | All `examples/` template files (contain Anthropic-specific formats and tone); the word "company" as a specific entity. |
| **What to port** | The dispatch pattern: identify type → load format-specific guidance → follow it. The type taxonomy (3P updates, newsletters, FAQ, incident reports) is itself a portable pattern for any org. The "ask rather than invent" escalation for ambiguous types. |
| **Notes** | The *structure* of the skill is portable; the *content* of the example files is not. A ported SOP would define the same dispatch pattern with blank-slate templates. |

---

### SOP 6: `claude-api` (Generalized: LLM SDK Integration Defaults)

**Source:** `skills/claude-api/SKILL.md`

| Field | Content |
|---|---|
| **Trigger / when to use** | Starting or extending code that integrates with an LLM SDK. |
| **Steps / contract** | 1. Detect project language (from file extensions, manifests). 2. Load language-specific documentation/examples. 3. Apply sensible defaults (model selection, streaming for long I/O, thinking/reasoning mode for complex tasks). 4. Use SDK helpers to simplify async handling. |
| **Quality bar** | Always stream for requests with long input or output to avoid timeouts; always use the highest-capability model unless cost-constrained. |
| **Escalation path** | Not specified. |
| **Next action** | Implement with detected language SDK. |
| **What to strip** | Anthropic model strings (`claude-opus-4-6`); `claude_agent_sdk` import trigger; all SDK-specific code examples. |
| **What to port** | Language detection heuristic (file extension → manifest → SDK namespace pattern); the defaults reasoning (stream long I/O; use capable model by default; use reasoning/thinking for complex tasks); the "detect then load" pattern for multi-language skills. |
| **Notes** | Mostly Anthropic-specific; the portable extract is the language-detection pattern and the streaming/model defaults rationale — these apply to any LLM SDK integration. |

---

## Cross-Cutting Protocol Primitives

These are sub-SOP patterns appearing across multiple skills — smaller than a full SOP but reusable as building blocks.

| Primitive | Where found | What it is |
|---|---|---|
| **Decision tree routing** | `webapp-testing/SKILL.md` | Explicit conditional logic (static vs. dynamic? server running?) before executing. Prevents wrong-path execution. |
| **Reconnaissance before action** | `webapp-testing/SKILL.md` | Always observe/inspect first, then act. Applied to DOM but generalizes to any stateful system. |
| **`--help` before source read** | `webapp-testing/SKILL.md` | Run a script's help flag before reading its source to avoid polluting context window. Context-budget discipline. |
| **Cold-reader completeness check** | `doc-coauthoring/SKILL.md` | Test output with a fresh (context-free) agent before declaring done. Catches assumed-knowledge gaps. |
| **Opt-in workflow offer** | `doc-coauthoring/SKILL.md` | Offer structured workflow, allow freeform fallback. Respects user preference without abandoning the SOP. |
| **Type-dispatch pattern** | `internal-comms/SKILL.md` | Identify category → load category-specific rules → follow them. Scales to any multi-format output task. |
| **Eval-then-revise gate** | `skill-creator/SKILL.md` | Human reviews results before agent revises. Prevents runaway self-improvement without grounding. |
| **Assertion schema discipline** | `skill-creator/SKILL.md` | Grader must use exact field names (`text`/`passed`/`evidence`); viewer depends on schema. Brittle-integration warning. |
| **Explain the why** | `skill-creator/SKILL.md` | Instructions should explain reasoning, not just mandate behavior. Reduces rule-gaming and improves generalization. |
| **Description-optimization separation** | `skill-creator/SKILL.md` | Optimize trigger description only after content is stable. Avoids local-optimum traps in trigger tuning. |
| **Zero-error quality gate** | `xlsx/SKILL.md` | Every output must pass automated error scan before delivery (`#REF!`, `#DIV/0!`, etc.). Generalizes to any verifiable output format. |
| **Formula-not-hardcode discipline** | `xlsx/SKILL.md` | Prefer dynamic formulas over computed constants; deliverables should remain updateable. Generalizes to any template-based output. |
| **Black-box script principle** | `webapp-testing/SKILL.md`, `skill-creator/SKILL.md` | Use bundled scripts as opaque tools; read source only when customization is absolutely necessary. |
| **Near-miss negative trigger evals** | `skill-creator/SKILL.md` | Should-not-trigger test cases must be near-misses (adjacent domain, ambiguous phrasing) not obviously-irrelevant queries. Tests trigger discrimination, not just trigger recall. |
| **Parallel baseline+treatment eval runs** | `skill-creator/SKILL.md` | Spawn test cases in parallel (when subagents available); run baseline (no skill) alongside treatment (with skill). Ensures fair comparison and prevents author-grade bias. |

---

## Recommendation: What Should Ship by Default in `.agents`

**Tier 1 — Ship unconditionally:**
1. **Doc Co-Authoring SOP** (`doc-coauthoring`) — zero tooling dependencies, applies to any documentation task, cold-reader test is high-value primitive.
2. **Iterative Artifact Improvement Loop** (from `skill-creator`) — the core draft→test→review→revise loop stripped of Anthropic tooling. Applies to building any agent instruction or SOP.
3. **Communication Type Dispatch** (from `internal-comms`) — the dispatch pattern without the Anthropic templates; orgs supply their own templates.

**Tier 2 — Ship with light adaptation:**
4. **Recon-Then-Action Browser Automation** (`webapp-testing`) — strip Playwright specifics to a decision tree + principle set; add tool section as optional extension.
5. **Cross-cutting primitives** (cold-reader check, opt-in workflow offer, explain-the-why, eval-then-revise gate, zero-error gate) — ship as a `protocol-primitives.md` reference document.

**Leave out:**
- `claude-api` — too Anthropic-specific to be worth generalizing
- `mcp-builder` — valuable but MCP is sufficiently niche; include only in a "integration patterns" optional pack
- All document-format skills (docx/xlsx/pdf/pptx) — proprietary and too tool-specific
- All creative/design skills — too narrow, non-coding context

---

## Evidence: Specific File/Line Citations

1. `skills/skill-creator/SKILL.md` (full file) — "Explain the why. Try hard to explain the **why** behind everything you're asking the model to do." Core anti-rigidity principle.
2. `skills/skill-creator/SKILL.md` — "if you find yourself writing ALWAYS or NEVER in all caps… reframe and explain the reasoning" — explicit warning against rule theater.
3. `skills/skill-creator/SKILL.md` — "Keep the prompt lean. Remove things that aren't pulling their weight." — SOP minimalism principle.
4. `skills/skill-creator/SKILL.md` — grading schema: "The grading.json expectations array must use the fields `text`, `passed`, and `evidence` (not `name`/`met`/`details` or other variants) — the viewer depends on these exact field names." — brittle-integration example; schema discipline matters.
5. `skills/skill-creator/SKILL.md` — "Generalize from the feedback… if the skill you and the user are codeveloping works only for those examples, it's useless." — anti-overfitting principle.
6. `skills/webapp-testing/SKILL.md` — Decision tree: "User task → Is it static HTML? … No (dynamic webapp) → Is the server already running?" — explicit routing before execution.
7. `skills/webapp-testing/SKILL.md` — "Always run scripts with `--help` first … DO NOT read the source until you try running the script first and find that a customized solution is absolutely necessary." — context-budget discipline.
8. `skills/webapp-testing/SKILL.md` — "❌ Don't inspect the DOM before waiting for `networkidle` on dynamic apps" — explicit anti-pattern with corrective.
9. `skills/doc-coauthoring/SKILL.md` — Stage 3: "Test the doc with a fresh Claude (no context) to catch blind spots before others read it." — cold-reader completeness check.
10. `skills/doc-coauthoring/SKILL.md` — "If user declines, work freeform." — opt-in workflow pattern with graceful fallback.
11. `skills/internal-comms/SKILL.md` — "If the communication type doesn't match any existing guideline, ask for clarification" — escalate rather than invent.
12. `skills/xlsx/SKILL.md` — "Every Excel model MUST be delivered with ZERO formula errors (#REF!, #DIV/0!, #VALUE!, #N/A, #NAME?)" — hard quality gate.
13. `skills/xlsx/SKILL.md` — "CRITICAL: Use Formulas, Not Hardcoded Values … The spreadsheet should be able to recalculate when source data changes." — dynamic-output discipline; generalizes.
14. `skills/mcp-builder/SKILL.md` — "The quality of an MCP server is measured by how well it enables LLMs to accomplish real-world tasks." — functional quality framing over structural.
15. `skills/brand-guidelines/SKILL.md` — Hex codes for Anthropic brand colors; `#d97757` orange, `#6a9bcc` blue, `#141413` dark — fully Anthropic-local, strip entirely.
16. `README.md` — "These skills are provided for demonstration and educational purposes only." — official disclaimer; skills are reference patterns, not production guarantees.
17. `skills/skill-creator/SKILL.md` — "the user's evaluation of the results (and also if there are any glaring flaws that become apparent from the quantitative benchmarks)" — human-in-the-loop gate before revision.
18. `skills/skill-creator/SKILL.md` — description optimization: "60% train and 40% held-out test… selected by test score rather than train score to avoid overfitting." — generalization-over-memorization principle in trigger tuning.

---

## Warnings / Risks

- **Proprietary license on document skills:** `docx`, `xlsx`, `pdf`, `pptx` are source-available but not open source. Do not incorporate their scripts or detailed procedures into `.agents` defaults without legal review.
- **Tooling coupling:** Most portable candidates (`skill-creator`, `webapp-testing`) have Python scripts that are tightly coupled to their internal toolchain (Playwright, `aggregate_benchmark.py`, `run_loop.py`). Porting the SOP means extracting the *procedure*, not the *scripts*.
- **Anthropic-specific defaults in `claude-api`:** Model strings and SDK namespaces will mislead users of other LLM providers; strip before porting.
- **Brand guidelines are fully local:** `brand-guidelines/SKILL.md` contains only Anthropic color/font specs. No portable content; exclude entirely.
- **`skill-creator` is self-referential:** It describes how to build skills using Anthropic's internal eval infrastructure. The loop is portable; the tooling is not. Be explicit about this split in the ported SOP.

---

## Worker QA Verification (Pass 1 — 2026-03-28)

**Reviewer:** Worker Ant (verify-audit-quality task)  
**Method:** Systematic spot-check of all 5 AUDIT-PROMPT.md completeness criteria + shape requirements + evidence accuracy.

### Completeness Criteria

| # | Criterion | Status | Notes |
|---|---|---|---|
| 1 | File exists and is non-empty | ✅ PASS | 228 lines, 21,913 bytes |
| 2 | Organizes into candidates / non-candidates with reasons | ✅ PASS | Split table covers all 17 skills; reasons given per row |
| 3 | Identifies port vs. strip per SOP candidate | ✅ PASS | Each of 6 SOP tables has explicit "What to strip" / "What to port" rows |
| 4 | References source file for each candidate | ✅ PASS | All 9 source files cited exist on disk; all links verified |
| 5 | Verification step confirms file exists after writing | ✅ PASS | Scout confirmed in pheromone: "200 lines, 21KB, non-empty" |

### Shape Requirements

| Section | Required | Present | Status |
|---|---|---|---|
| Repo overview (1–10 sentences) | ✅ | ✅ `## Repo Overview` | PASS |
| Summary of kinds of rules/skills | ✅ | ✅ `## What Kinds of Rules/Skills Are Present` | PASS |
| Split list (SOPs to port / leave out) | ✅ | ✅ `## Source-to-Portable Split Summary` | PASS |
| Table per SOP-to-port (7 fields) | ✅ | ✅ 6 SOP tables, all with required fields | PASS |
| Cross-cutting protocol primitives section | ✅ | ✅ `## Cross-Cutting Protocol Primitives` | PASS (extended from 13→15 rows by this QA) |
| Concrete recommendation for `.agents` | ✅ | ✅ `## Recommendation: What Should Ship by Default in .agents` | PASS |
| Evidence section (≥10 bullets) | ✅ | ✅ 18 bullets | PASS |

### Evidence Accuracy Spot-Check (18 claims verified against source)

All 18 evidence bullets cross-checked against source files. All quotes match. Key verifications:

- Claim 1 (explain the why) → `skill-creator/SKILL.md` line 302 ✅  
- Claim 2 (ALWAYS/NEVER reframe) → same line 302 ✅  
- Claim 3 (keep prompt lean) → line 300 ✅  
- Claim 4 (grading schema `text`/`passed`/`evidence`) → line 225 ✅  
- Claim 5 (anti-overfitting) → line 298 ✅  
- Claim 6 (decision tree) → `webapp-testing/SKILL.md` line 25ff ✅  
- Claim 7 (`--help` before source) → line 14 ✅  
- Claim 8 (`networkidle` anti-pattern) → lines 80–81 ✅  
- Claim 9 (Stage 3 cold-reader) → `doc-coauthoring/SKILL.md` lines 22, 242 ✅  
- Claim 10 (freeform fallback) → line 26 ✅  
- Claim 11 (internal-comms ask for clarification) → line 29 ✅  
- Claim 12 (zero formula errors) → `xlsx/SKILL.md` line 15 ✅  
- Claim 13 (formulas not hardcode) → confirmed present ✅  
- Claim 14 (mcp-builder quality framing) → line 11 ✅  
- Claim 15 (brand-guidelines hex codes) → lines 21, 28, 29 ✅  
- Claim 16 (README disclaimer) → line 22 ✅  
- Claim 17 (human-in-the-loop gate) → confirmed present ✅  
- Claim 18 (60/40 train/test split) → line 394 ✅  

### Defects Found and Fixed

| Defect | Severity | Fix Applied |
|---|---|---|
| `webapp-testing` listed **twice** in the Source-to-Portable Split table (rows 34 and 39) | Minor (cosmetic / confusing) | Removed duplicate row — table now has 17 rows matching the 17 skills |
| **Near-miss negative trigger eval** primitive missing from cross-cutting table (source: `skill-creator/SKILL.md` line 356) | Minor (omission) | Added row to cross-cutting primitives table |
| **Parallel baseline+treatment eval** primitive missing from cross-cutting table (source: `skill-creator/SKILL.md` line 449) | Minor (omission) | Added row to cross-cutting primitives table |

### Verdict

**PASS.** All 5 completeness criteria met. All shape requirements met. All 18 evidence claims verified against source. Three minor defects corrected in-place (no structural changes required). Audit is ready for cross-repo synthesis.
