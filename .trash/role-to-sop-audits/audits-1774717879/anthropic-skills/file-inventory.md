# File Inventory — `anthropic-skills`

> Scanned: `/Users/mia/.agents/.worktrees/role-to-sop/.references/anthropic-skills`
> Includes only files that directly instruct an agent or define a procedure.

---

## Top-level infrastructure

```
template/SKILL.md | config | Skeleton frontmatter + blank body — the canonical template for authoring a new skill.
.claude-plugin/marketplace.json | config | Declares which skills belong to each installable plugin bundle (document-skills, example-skills, claude-api).
```

---

## Skill definitions (`skills/*/SKILL.md`)

Each file is the primary instruction set for that skill — loaded into context whenever the skill triggers.

```
skills/algorithmic-art/SKILL.md | skill | Two-phase workflow: write an algorithmic-art philosophy (.md), then implement it as a seeded p5.js generative-art HTML artifact built from a fixed Anthropic-branded template.
skills/brand-guidelines/SKILL.md | skill | Provides Anthropic brand colours (hex) and typography (Poppins/Lora) for applying consistent visual identity to any artifact.
skills/canvas-design/SKILL.md | skill | Two-phase workflow: write a visual design philosophy (.md), then render it as a museum-quality static PDF/PNG using canvas tools.
skills/claude-api/SKILL.md | skill | Routes the agent to the correct language-specific Claude API/Agent SDK reference files based on project detection, with defaults for model, thinking mode, streaming, and error handling.
skills/doc-coauthoring/SKILL.md | skill | Three-stage co-authoring SOP: context gathering (info-dump + clarifying questions), section-by-section refinement (brainstorm → curate → draft → iterate), then reader-testing via sub-agent or manual Claude session.
skills/docx/SKILL.md | skill | Procedures for creating (docx-js), editing (unpack XML → edit → repack), and validating .docx files, including tracked-change XML patterns and critical rendering rules.
skills/frontend-design/SKILL.md | skill | Directs agent to commit to a bold aesthetic direction before coding and produce production-grade, visually distinctive HTML/CSS/JS or React interfaces — explicitly rejecting generic AI aesthetics.
skills/internal-comms/SKILL.md | skill | Routes requests for internal communications to the correct format-specific guideline file in examples/ (3P updates, newsletters, FAQs, general comms).
skills/mcp-builder/SKILL.md | skill | Four-phase MCP server development SOP: research + planning, implementation, review/test, and evaluation creation — with pointers to language-specific reference files.
skills/pdf/SKILL.md | skill | Reference guide for PDF operations (merge, split, extract, OCR, create, encrypt) using pypdf, pdfplumber, reportlab, and CLI tools; delegates form filling to forms.md.
skills/pptx/SKILL.md | skill | Routes .pptx work to either the editing workflow (template-based) or creation-from-scratch workflow (pptxgenjs.md) based on whether a template exists.
skills/skill-creator/SKILL.md | skill | End-to-end meta-skill for creating, testing, benchmarking, and iteratively improving skills: intent capture → draft → parallel eval runs with baselines → human review via browser viewer → iteration loop → description optimisation.
skills/slack-gif-creator/SKILL.md | skill | Toolkit and constraints for generating Slack-optimised animated GIFs (dimensions, FPS, colour limits) using a GIFBuilder Python core.
skills/theme-factory/SKILL.md | skill | Displays a theme showcase PDF, captures user selection, then applies chosen colour/font theme to any artifact; 10 pre-set themes available.
skills/web-artifacts-builder/SKILL.md | skill | Scaffolds multi-component claude.ai HTML artifacts using React 18 + Tailwind + shadcn/ui via init and bundle shell scripts.
skills/webapp-testing/SKILL.md | skill | Decision-tree workflow for testing local web apps with Playwright: static HTML → direct selectors; dynamic app → server lifecycle helper + DOM reconnaissance before scripting.
skills/xlsx/SKILL.md | skill | Output-quality rules for Excel files: professional fonts, zero formula errors, colour-coding standards (blue=hardcoded, black=formula, green=cross-sheet link), number-formatting conventions, and financial-model construction rules.
```

---

## Sub-agent definitions (`skills/skill-creator/agents/`)

Spawned by the skill-creator orchestrator; each file defines a specialised evaluator role.

```
skills/skill-creator/agents/grader.md | agent | Evaluates assertions against execution transcripts and output files; produces grading.json with pass/fail + evidence, and critiques weak assertions.
skills/skill-creator/agents/comparator.md | agent | Blind A/B comparator that scores two outputs on a content+structure rubric without knowing which skill produced which, then writes comparison.json.
skills/skill-creator/agents/analyzer.md | agent | Post-hoc win/loss analysis agent that unblids results, reads both skills and transcripts, and generates prioritised improvement suggestions; also analyses benchmark data for patterns hidden by aggregate stats.
```

---

## Skill-creator config / schemas

```
skills/skill-creator/references/schemas.md | config | JSON schemas for all skill-creator data files: evals.json, grading.json, benchmark.json, comparison.json, analysis.json, history.json, metrics.json, timing.json.
```

---

## Internal-comms format templates (`skills/internal-comms/examples/`)

Loaded by the internal-comms skill at execution time; each defines format, tone, and content rules for one communication type.

```
skills/internal-comms/examples/3p-updates.md | prompt | Format and tone rules for weekly Progress/Plans/Problems team updates targeted at leadership.
skills/internal-comms/examples/company-newsletter.md | prompt | Format and tone rules for company-wide newsletters.
skills/internal-comms/examples/faq-answers.md | prompt | Format and tone rules for writing FAQ-style answers to common questions.
skills/internal-comms/examples/general-comms.md | prompt | Fallback format and tone rules for internal communications that don't fit the other templates.
```

---

## PDF sub-procedures (`skills/pdf/`)

```
skills/pdf/forms.md | sop | Mandatory decision-tree SOP for filling PDF forms: detect fillable fields → use extract/fill scripts for fillable PDFs, or overlay annotations for non-fillable PDFs.
skills/pdf/reference.md | sop | Extended PDF reference covering pypdfium2 advanced usage, JavaScript pdf-lib patterns, and troubleshooting guides.
```

---

## PPTX sub-procedures (`skills/pptx/`)

```
skills/pptx/editing.md | sop | Template-based presentation editing workflow: analyse slides with thumbnail.py → unpack XML → edit content → clean → repack.
skills/pptx/pptxgenjs.md | sop | Creation-from-scratch workflow using PptxGenJS: slide dimensions, master layouts, shape/image/chart APIs, and common patterns.
```

---

## MCP builder reference files (`skills/mcp-builder/reference/`)

Loaded by the mcp-builder skill during the relevant phase; each encodes rules or procedures for a specific aspect of MCP server development.

```
skills/mcp-builder/reference/mcp_best_practices.md | rule | Universal MCP design rules: server/tool naming conventions, response format (JSON vs Markdown), pagination standards, transport selection, security, and error-message guidance.
skills/mcp-builder/reference/evaluation.md | sop | Step-by-step procedure for creating 10-question read-only MCP server evaluations: tool inspection, content exploration, question generation, answer verification, and XML output format.
skills/mcp-builder/reference/node_mcp_server.md | sop | TypeScript/Node MCP server implementation guide: project structure, Zod schema patterns, tool registration, quality checklist, and testing with MCP Inspector.
skills/mcp-builder/reference/python_mcp_server.md | sop | Python/FastMCP server implementation guide: server init patterns, Pydantic model examples, @mcp.tool registration, working examples, and quality checklist.
```

---

## Claude API reference files (`skills/claude-api/`)

Loaded selectively by the claude-api skill based on detected language and task type.

```
skills/claude-api/shared/tool-use-concepts.md | sop | Conceptual foundations for tool use: tool types, output constraints, structured outputs, server-side vs user-defined tools.
skills/claude-api/shared/prompt-caching.md | rule | Prefix-stability rules for prompt caching: render order, breakpoint placement, silent-invalidator audit checklist.
skills/claude-api/shared/error-codes.md | sop | HTTP error code reference and error-handling implementation patterns for all Claude API SDKs.
skills/claude-api/shared/models.md | sop | Live model capability lookup patterns using the Models API; covers context windows, thinking/effort support, and capability filtering.
skills/claude-api/shared/live-sources.md | config | WebFetch URLs for pulling the latest official Claude API and Agent SDK documentation.
skills/claude-api/python/claude-api/README.md | sop | Python SDK quick-start, installation, common patterns, streaming, compaction, and error handling.
skills/claude-api/python/claude-api/tool-use.md | sop | Python-specific tool use code examples: tool runner, manual loop, code execution, memory, structured outputs.
skills/claude-api/python/claude-api/streaming.md | sop | Python streaming patterns for chat UIs and incremental response display.
skills/claude-api/python/claude-api/batches.md | sop | Python batch processing patterns (async, 50% cost) for non-latency-sensitive workloads.
skills/claude-api/python/claude-api/files-api.md | sop | Python Files API patterns for reusing file uploads across multiple requests.
skills/claude-api/python/agent-sdk/README.md | sop | Python Agent SDK quick-start: installation, built-in tools (file/web/terminal), permissions, MCP integration, hooks.
skills/claude-api/python/agent-sdk/patterns.md | sop | Python Agent SDK advanced patterns: custom tools, hooks, subagents, MCP integration, session resumption.
skills/claude-api/typescript/claude-api/README.md | sop | TypeScript SDK quick-start, installation, common patterns, streaming, compaction, and error handling.
skills/claude-api/typescript/claude-api/tool-use.md | sop | TypeScript-specific tool use code examples: betaZodTool, tool runner, manual loop, structured outputs.
skills/claude-api/typescript/claude-api/streaming.md | sop | TypeScript streaming patterns for chat UIs and incremental response display.
skills/claude-api/typescript/claude-api/batches.md | sop | TypeScript batch processing patterns (async, 50% cost) for non-latency-sensitive workloads.
skills/claude-api/typescript/claude-api/files-api.md | sop | TypeScript Files API patterns for reusing file uploads across multiple requests.
skills/claude-api/typescript/agent-sdk/README.md | sop | TypeScript Agent SDK quick-start: built-in tools, permissions, MCP, hooks.
skills/claude-api/typescript/agent-sdk/patterns.md | sop | TypeScript Agent SDK advanced patterns: custom tools, hooks, subagents, MCP integration.
skills/claude-api/java/claude-api.md | sop | Java/Kotlin/Scala SDK patterns covering all Claude API basics including beta tool use.
skills/claude-api/go/claude-api.md | sop | Go SDK patterns covering all Claude API basics including BetaToolRunner.
skills/claude-api/ruby/claude-api.md | sop | Ruby SDK patterns covering all Claude API basics including BaseTool and tool_runner.
skills/claude-api/csharp/claude-api.md | sop | C# SDK patterns covering all Claude API basics (no tool runner or Agent SDK).
skills/claude-api/php/claude-api.md | sop | PHP SDK patterns covering all Claude API basics including BetaRunnableTool and toolRunner().
skills/claude-api/curl/examples.md | sop | Raw HTTP/cURL examples for the Claude API for use in unsupported languages.
```

---

## Algorithmic art templates (`skills/algorithmic-art/templates/`)

Referenced as mandatory starting points by the algorithmic-art SKILL.md.

```
skills/algorithmic-art/templates/viewer.html | prompt | Anthropic-branded HTML template that all algorithmic-art artifacts must be built from (fixed header/sidebar/seed controls; variable algorithm and parameter sections).
skills/algorithmic-art/templates/generator_template.js | sop | p5.js code structure reference: parameter organisation, seeded-randomness patterns, and class layout principles for generative-art algorithms.
```
