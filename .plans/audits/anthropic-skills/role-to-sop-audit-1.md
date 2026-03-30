# anthropic-skills — role-to-sop audit (compiled)

**Evidence base:** `.plans/audits/anthropic-skills/raw-findings.md` only.  
**Interpretation** below is explicitly separated from **direct evidence** (paraphrased claims grounded in that file).

---

## 1. Repo overview

**Evidence:** The audited corpus is a skills library for Claude (Anthropic): procedural **skills** under `skills/`, a **skill-creator** meta-workflow with eval agents and schemas, **claude-api** reference trees per language, plugin **template** and **marketplace** metadata, and creative/design skills (canvas, algorithmic art, themes, brand guidelines).

**Interpretation:** `anthropic-skills` is Anthropic’s packaged collection of agent-facing instructions—mixing portable engineering SOPs (documents, MCP, APIs, testing) with design/creative skills and pi-platform distribution glue. It exists to give agents repeatable workflows and reference material, not to model human org charts.

---

## 2. Content summary

**Evidence:** Findings describe: multi-phase **process** skills (mcp-builder, doc-coauthoring, skill-creator, webapp-testing); **index/dispatch** skills (claude-api routing to language files); **reference companions** (MCP best practices, Node/Python MCP guides, PDF/PPTX sub-guides); **document** skills (xlsx, pdf, pptx, docx); **internal comms** with dispatcher + `examples/`; **sub-agent prompts** (grader, comparator, analyzer); **meta** schemas for eval pipelines; **creative** skills (frontend-design, canvas-design, algorithmic-art, theme-factory, web-artifacts-builder, slack-gif-creator); **template** scaffold; **curl** wire-protocol examples; **live-sources** URL catalog.

**Interpretation:** Structure mixes “single SKILL.md + bundled scripts” and “SKILL.md + deep reference tree.” Highest SOP value clusters around documents, MCP, API integration, testing, and meta-skill authoring; creative skills are lighter on procedural contracts.

---

## 3. SOP split

### 3.1 SOPs to port (with reason)

| Focus                                                                                                                                                             | Reason (from findings)                                                                                                                                               |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Doc co-authoring** (`skills/doc-coauthoring/SKILL.md`)                                                                                                          | High portability; three-stage workflow + reader testing is LLM-agnostic.                                                                                             |
| **MCP builder + references** (`skills/mcp-builder/SKILL.md`, `reference/mcp_best_practices.md`, `reference/node_mcp_server.md`, `reference/python_mcp_server.md`) | Core tool-design, transport, security, and implementation patterns portable; inline or replace broken `./reference/*.md` links.                                      |
| **MCP evaluation design** (portable half of `reference/evaluation.md`)                                                                                            | Question/answer guidelines and 5-step design process portable; strip runner machinery.                                                                               |
| **Webapp testing** (`skills/webapp-testing/SKILL.md`)                                                                                                             | Playwright decision tree and recon-then-action portable; strip bundled `with_server.py` / `examples/`.                                                               |
| **Internal comms** (`skills/internal-comms/SKILL.md` + examples/)                                                                                                 | 3P / FAQ / newsletter patterns broadly portable; strip org-size assumptions.                                                                                         |
| **Claude API skill** (`skills/claude-api/SKILL.md`) + **shared + Python/TS deep refs**                                                                            | Tier/routing/pitfalls portable; strip volatile model IDs/pricing/beta headers per findings.                                                                          |
| **Shared Claude API concepts** (`skills/claude-api/shared/*.md` as cited in findings)                                                                             | Tool concepts, prompt caching, error codes, models (discovery pattern)—portable with pruning of dated tables.                                                        |
| **Python/TypeScript Claude API + Agent SDK** subfiles under `skills/claude-api/python/` and `typescript/`                                                         | SDK patterns portable; strip beta flags and toy examples where noted.                                                                                                |
| **cURL wire examples** (`skills/claude-api/curl/examples.md`)                                                                                                     | Language-agnostic protocol truth; high portability per findings.                                                                                                     |
| **Skill creator** (distilled from `skills/skill-creator/SKILL.md`)                                                                                                | Conceptual loop + writing principles + progressive disclosure portable; replace script/bundled agent paths.                                                          |
| **Eval sub-agents** (`skills/skill-creator/agents/grader.md`, `comparator.md`, `analyzer.md`)                                                                     | Generic grading/blind-compare/analysis patterns per findings.                                                                                                        |
| **Frontend design** (`skills/frontend-design/SKILL.md`)                                                                                                           | Anti-AI-slop design direction; opinionated aesthetic rules (no Inter/Roboto/purple gradients) are high-value craft guidance worth carrying as a design policy layer. |
| **Web artifacts builder** (`skills/web-artifacts-builder/SKILL.md`)                                                                                               | Reproducible stack + bundling SOP; replace internal script paths.                                                                                                    |
| **Algorithmic art** (partial: `templates/generator_template.js`, structural shell of `templates/viewer.html`)                                                     | Seeded randomness and p5 skeleton portable; strip Anthropic branding in viewer.                                                                                      |
| **Theme factory** (workflow pattern from `skills/theme-factory/SKILL.md`)                                                                                         | Catalogue + selection UX portable; replace `theme-showcase.pdf` / `themes/` deps.                                                                                    |
| **Brand guidelines** (pattern from `skills/brand-guidelines/SKILL.md`)                                                                                            | Token-set *pattern* portable; replace Anthropic hex/fonts per findings.                                                                                              |

### 3.2 SOPs to leave out (with reason)

| Item                                                                                       | Reason (from findings)                                                                                    |
| ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| **Canvas design** (`skills/canvas-design/SKILL.md`)                                        | Creative workflow; claude.ai artifact coupling; not a coding SOP.                                         |
| **xlsx / pdf / pptx / docx** skills and subdocs                                            | File-format processing skills; out of scope for engineering SOP set.                                      |
| **Slack GIF creator** (`skills/slack-gif-creator/SKILL.md`)                                | Media creation skill; out of scope.                                                                       |
| **Template** (`template/SKILL.md`)                                                         | Empty scaffold; no behavioural content.                                                                   |
| **Marketplace manifest** (`.claude-plugin/marketplace.json`)                               | Distribution metadata only; zero procedural guidance.                                                     |
| **Live sources catalog** (`skills/claude-api/shared/live-sources.md`)                      | Vendor URL index; no reusable procedure worth a standalone SOP.                                           |
| **skill-creator `references/schemas.md`** (as a whole)                                     | Harness-coupled JSON contracts; low portability except tiny eval-feedback principles.                     |
| **Language-specific API guides** marked **Portable: No** (Java, Go, Ruby, C# per findings) | Keep only as language cheatsheets if those stacks matter; not default portable SOP atoms.                 |
| **MCP Phase 4 / evaluation runner** (as shipped)                                           | Anthropic-internal eval runner + XML harness—not portable as-is.                                          |
| **PHP claude-api.md** (as primary port)                                                    | Findings: mostly PHP surface; extract only noted cross-language footguns into shared SOP, not whole file. |

---

## 4. Per-SOP tables (portable candidates)

Each **Source file** is an absolute path under `.references/anthropic-skills/`.

### 4.1 High portability

| Field | Content |
|-------|---------|
| **Source file** | `.references/anthropic-skills/skills/doc-coauthoring/SKILL.md` |
| **Trigger** | User writing docs, proposals, specs, RFCs, design docs; phrases like “write a doc”, “draft a proposal”, “create a spec”. |
| **Steps/contract** | Offer structured workflow or fallback → Stage 1 context (meta-questions, dump, clarifiers) → Stage 2 structure (scaffold, per-section brainstorm→curate→draft→refine, coherence pass) → Stage 3 reader testing (fresh context) → final owner review / appendix guidance. |
| **Quality bar** | Reader questions answered without assumed knowledge; contradictions surfaced; sections stable after iterative refinement. |
| **Escalation** | If integrations unknown: branch per findings (avoid hard dependency on specific connectors); if no sub-agent: manual fresh session for reader test. |
| **Strip** | Slack/Teams/Drive/SharePoint, claude.ai URLs, connector settings, concrete tool names for artifacts (`create_file`, `str_replace`—keep pattern). |
| **Notes** | Reader-testing stage and brainstorm→curate are headline upgrades vs a typical doc skill. |

| Field | Content |
|-------|---------|
| **Source file** | `.references/anthropic-skills/skills/mcp-builder/reference/mcp_best_practices.md` |
| **Trigger** | Loaded alongside MCP server work (companion reference, not usually user-direct). |
| **Steps/contract** | Reference: naming, pagination contract, transport matrix, security (OAuth, env secrets, validation, DNS rebinding, bind `127.0.0.1`), annotation flags table, error-at-result-level guidance, testing categories. |
| **Quality bar** | Tools namespaced, paginated responses complete, transport matches deployment, annotations accurate, errors actionable. |
| **Escalation** | If spec ambiguous: cross-check MCP protocol docs (per parent skill’s doc-fetch pattern). |
| **Strip** | Per findings: nothing material; optional tightening of thin sections. |
| **Notes** | Quick Reference + tables pattern recommended to inline into parent MCP skill. |

| Field | Content |
|-------|---------|
| **Source file** | `.references/anthropic-skills/skills/skill-creator/agents/grader.md` |
| **Trigger** | Post-run eval grading in a skill-eval pipeline. |
| **Steps/contract** | Read transcripts/outputs → pass/fail assertions → extract implicit claims → critique eval quality → write `grading.json`. |
| **Quality bar** | Assertions match evidence; superficial compliance flagged. |
| **Escalation** | Adapt output paths from Anthropic conventions to host layout. |
| **Strip** | Path conventions only. |
| **Notes** | Claim-extraction step called strongest lift. |

| Field | Content |
|-------|---------|
| **Source file** | `.references/anthropic-skills/skills/skill-creator/agents/comparator.md` |
| **Trigger** | Blind A/B comparison of two skill outputs. |
| **Steps/contract** | Dynamic rubric → score content/structure → check assertions → decisive winner → `comparison.json`. |
| **Quality bar** | Blindness preserved; ties rare; rubric task-specific. |
| **Escalation** | If rubric unstable: narrow task scope and re-run. |
| **Strip** | None required per findings. |
| **Notes** | “Stay blind” constraint is core design guarantee. |

| Field | Content |
|-------|---------|
| **Source file** | `.references/anthropic-skills/skills/skill-creator/agents/analyzer.md` |
| **Trigger** | Post-hoc explanation of blind results OR benchmark pattern mining. |
| **Steps/contract** | Dual mode: unblind + instruction-following score + prioritized suggestions; or benchmark analysis without improvement advice. |
| **Quality bar** | Suggestions map to taxonomy (instructions, tools, examples, error_handling, structure, references). |
| **Escalation** | Use benchmark mode when separation of concerns requires no skill-edit advice yet. |
| **Strip** | None required per findings. |
| **Notes** | Instruction-following 1–10 score called unique/high value. |

| Field | Content |
|-------|---------|
| **Source file** | `.references/anthropic-skills/skills/claude-api/shared/tool-use-concepts.md` |
| **Trigger** | Designing or debugging tool use across SDKs. |
| **Steps/contract** | Conceptual map: user tools, tool choice, runner vs manual loop, server-side tools, memory, structured outputs + security notes. |
| **Quality bar** | Tool descriptions validated; side effects gated; structured-output limits respected. |
| **Escalation** | Prune dated beta/model strings; replace forward-only links with stable doc pointers. |
| **Strip** | Per findings: aging beta notices and model IDs; over-broad link maintenance. |
| **Notes** | Security callouts and structured-output limits table called keep-worthy. |

| Field | Content |
|-------|---------|
| **Source file** | `.references/anthropic-skills/skills/claude-api/shared/prompt-caching.md` |
| **Trigger** | Building prompts for repeated multi-turn or high-volume API use. |
| **Steps/contract** | Prefix invariance (`tools → system → messages`), breakpoints, silent invalidators, verification, architectural rules. |
| **Quality bar** | Measured cache hits where expected; no silent prefix drift. |
| **Escalation** | Language-specific field access belongs in per-language refs per findings. |
| **Strip** | Cross-language token field spellings from shared layer if deduplicating. |
| **Notes** | Economics break-even heuristic noted in findings. |

| Field | Content |
|-------|---------|
| **Source file** | `.references/anthropic-skills/skills/claude-api/shared/error-codes.md` |
| **Trigger** | Handling API failures and retries. |
| **Steps/contract** | Typed errors, retry policy, common mistakes, status checks. |
| **Quality bar** | No string-matching on errors; retry only when safe per table. |
| **Escalation** | Check service status on persistent 5xx per findings. |
| **Strip** | Duplicate language exception tables if folded into one policy doc. |
| **Notes** | `budget_tokens` vs `max_tokens` gotcha flagged. |

| Field | Content |
|-------|---------|
| **Source file** | `.references/anthropic-skills/skills/claude-api/curl/examples.md` |
| **Trigger** | Wire-level debugging or non-SDK integration. |
| **Steps/contract** | cURL patterns: headers, SSE, tool round-trip, caching, thinking; jq parsing guidance. |
| **Quality bar** | Headers and event sequences match live API behavior. |
| **Escalation** | Regenerate examples when API version bumps invalidate headers. |
| **Strip** | Trivial shell env lines per findings. |
| **Notes** | SSE sequence promotion recommended in findings. |

| Field | Content |
|-------|---------|
| **Source file** | `.references/anthropic-skills/skills/algorithmic-art/templates/generator_template.js` |
| **Trigger** | p5.js generative art with reproducible seeds. |
| **Steps/contract** | `params` object, dual seeding, lifecycle options, entity pattern, utilities, export. |
| **Quality bar** | Same seed → same output; performance heuristics respected. |
| **Escalation** | Replace illustrative hex in `fadeBackground` per findings. |
| **Strip** | Hardcoded background hex. |
| **Notes** | Sections 1–3 and 6–8 called highest value. |

### 4.2 Medium portability (requires stripping or generalization)

| Field | Content |
|-------|---------|
| **Source file** | `.references/anthropic-skills/skills/mcp-builder/SKILL.md` |
| **Trigger** | Building MCP servers (Python FastMCP or TS SDK) for external APIs. |
| **Steps/contract** | Four phases: research/plan → implement → review/test → evaluations (strip Phase 4 harness) per findings. |
| **Quality bar** | Inspector smoke test passes; schemas and annotations complete; transport matches deployment. |
| **Escalation** | Replace `./reference/*.md` with inlined Quick Reference or live fetch URLs per findings. |
| **Strip** | Relative reference links; Phase 4 XML + eval-runner; “MCPB” internal tooling. |
| **Notes** | Preserve `raw.githubusercontent.com` SDK fetch URLs as portable alternative. |

| Field | Content |
|-------|---------|
| **Source file** | `.references/anthropic-skills/skills/mcp-builder/reference/evaluation.md` |
| **Trigger** | Designing eval Q&A for tool-using agents / MCP quality. |
| **Steps/contract** | 13 question rules + 6 answer rules; 5-step creation process; XML output shape for pairs—**strip** runner section entirely per findings. |
| **Quality bar** | Independent, read-only, verifiable answers; pre-verified before ship. |
| **Escalation** | Replace `scripts/evaluation.py` flow with adopter harness. |
| **Strip** | Running Evaluations section, pip/requirements, transport CLI, complete runner workflow. |
| **Notes** | Split design principles vs runner mechanics per findings. |

| Field | Content |
|-------|---------|
| **Source file** | `.references/anthropic-skills/skills/mcp-builder/reference/node_mcp_server.md` |
| **Trigger** | Node/TS MCP server implementation. |
| **Steps/contract** | `registerTool`, Zod schemas, annotations, transports, truncation pattern, quality checklist. |
| **Quality bar** | Checklist passes: design, implementation, TS quality, advanced features, config, tests. |
| **Escalation** | Refresh pinned versions periodically per findings. |
| **Strip** | Pinned semver in examples; placeholder fragments in samples. |
| **Notes** | Checklist alone flagged as high-value fragment. |

| Field | Content |
|-------|---------|
| **Source file** | `.references/anthropic-skills/skills/mcp-builder/reference/python_mcp_server.md` |
| **Trigger** | Python FastMCP server implementation. |
| **Steps/contract** | Pydantic v2 models, `@mcp.tool` annotations, shared error helpers, `Context` APIs, lifespan, quality checklist. |
| **Quality bar** | Async patterns, validation strictness, structured returns consistent. |
| **Escalation** | Verify imports against current `mcp` package per findings. |
| **Strip** | Stale version paths; illustrative service names. |
| **Notes** | Pairs with Node guide as language-dual SOP per findings. |

| Field | Content |
|-------|---------|
| **Source file** | `.references/anthropic-skills/skills/claude-api/SKILL.md` |
| **Trigger** | Repo imports Anthropic SDKs; user asks for Claude API / Agent SDK (explicitly not generic programming per findings). |
| **Steps/contract** | Detect language from project → tier select (single/workflow/agent) → defaults → read language files for examples. |
| **Quality bar** | Correct surface tier; pitfalls avoided (truncation, max_tokens, SDK types). |
| **Escalation** | Web-fetch live docs when cached material stale per findings. |
| **Strip** | Model table/pricing, “ALWAYS opus” directives, specific beta headers, brittle capability cache. |
| **Notes** | “Should I Build an Agent?” gate worth standalone SOP per findings. |

| Field | Content |
|-------|---------|
| **Source file** | `.references/anthropic-skills/skills/webapp-testing/SKILL.md` |
| **Trigger** | Local web app testing, UI debug, screenshots, browser logs. |
| **Steps/contract** | Static vs dynamic decision → server lifecycle → recon after `networkidle` → selectors → actions → close. |
| **Quality bar** | Selectors validated on real DOM; waits appropriate for dynamism. |
| **Escalation** | If server management needed without helper script: document substitute per findings. |
| **Strip** | `scripts/with_server.py`, `examples/`, bundled-script `--help` heuristic. |
| **Notes** | `networkidle` + recon-then-action highlighted as core discipline. |

| Field | Content |
|-------|---------|
| **Source file** | `.references/anthropic-skills/skills/internal-comms/SKILL.md` |
| **Trigger** | Internal comms: 3P/PPP, newsletters, FAQs, general updates. |
| **Steps/contract** | Route to format: 3P strict template; newsletter thematic bullets; FAQ Q/A pairs; general asks audience/tone. |
| **Quality bar** | 3P length/structure constraints met; FAQs sourced; newsletter scannable. |
| **Escalation** | If tool access to Slack/email missing: user-supplied context per dispatcher pattern. |
| **Strip** | “1000+ people” assumption; implicit Anthropic brand cues per findings. |
| **Notes** | Companion files under `skills/internal-comms/examples/` per findings heading. |

| Field | Content |
|-------|---------|
| **Source file** | `.references/anthropic-skills/skills/skill-creator/SKILL.md` |
| **Trigger** | Create/optimize skills, run evals, benchmark variance, tune descriptions. |
| **Steps/contract** | Intent → interview → SKILL.md → eval cases → parallel runs → grade/aggregate → iterate → description optimization → package. |
| **Quality bar** | Assertions discriminate; feedback generalized; descriptions not overfit. |
| **Escalation** | Replace Python viewer/scripts with host tooling per findings. |
| **Strip** | `generate_review.py`, `aggregate_benchmark.py`, `run_loop.py`, `package_skill.py`, blind compare section, motivational aside, cowork/claude.ai sections. |
| **Notes** | Findings recommend splitting skill-creation loop vs description-optimization; ~150-line distilled SOP possible. |

| Field | Content |
|-------|---------|
| **Source file** | `.references/anthropic-skills/skills/web-artifacts-builder/SKILL.md` |
| **Trigger** | Single-file bundled HTML/React artifacts with sane aesthetics. |
| **Steps/contract** | React+TS+Vite+Tailwind+shadcn stack; init/bundle scripts; anti-“AI slop” design heuristics. |
| **Quality bar** | Bundle is self-contained per stack goals; avoids generic purple/Inter monoculture per findings. |
| **Escalation** | Swap `init-artifact.sh` / `bundle-artifact.sh` naming to local equivalents. |
| **Strip** | Internal script paths; artifact-specific CDN exception notes per findings. |
| **Notes** | Parcel/html-inline bundling called concrete SOP. |

| Field | Content |
|-------|---------|
| **Source file** | `.references/anthropic-skills/skills/theme-factory/SKILL.md` |
| **Trigger** | User selects among many UI themes before implementation. |
| **Steps/contract** | Show catalogue → confirm choice → apply tokens. |
| **Quality bar** | Selected theme consistently applied across artifacts. |
| **Escalation** | Inline palette tables if packaged PDF/themes unavailable. |
| **Strip** | `theme-showcase.pdf`, `themes/` directory dependencies. |
| **Notes** | Extract pattern more than literal assets per findings. |

| Field | Content |
|-------|---------|
| **Source file** | `.references/anthropic-skills/skills/brand-guidelines/SKILL.md` |
| **Trigger** | Applying consistent brand identity to artifacts (when org tokens exist). |
| **Steps/contract** | Token categories: colors, typography, fallbacks per findings’ *pattern*. |
| **Quality bar** | No drift across slides/docs/artifacts for adopted tokens. |
| **Escalation** | Replace placeholder tokens when org brand unknown. |
| **Strip** | Anthropic hex/fonts; python-pptx RGB specifics per findings. |
| **Notes** | Distill to generic “brand token application” SOP. |

| Field | Content |
|-------|---------|
| **Source file** | `.references/anthropic-skills/skills/algorithmic-art/templates/viewer.html` |
| **Trigger** | Interactive p5.js artifact shell with seed controls. |
| **Steps/contract** | Sidebar + canvas; seed prev/next/random; params reset; responsive layout per findings. |
| **Quality bar** | Seeds reproduce output; controls wired without breaking sketch lifecycle. |
| **Escalation** | Remove Anthropic CSS variables if target brand differs. |
| **Strip** | `--anthropic-*` tokens, Google Fonts links, placeholder titles, stub sketch bodies per findings. |
| **Notes** | Top-of-file WHAT TO KEEP / WHAT TO EDIT banner called good scaffolding. |

| Field | Content |
|-------|---------|
| **Source file** | `.references/anthropic-skills/skills/algorithmic-art/SKILL.md` |
| **Trigger** | Generative art with deterministic seeds / Art Blocks–style workflow. |
| **Steps/contract** | Two-phase philosophy→implementation; seeded randomness coupling per findings—**strip** branded template coupling. |
| **Quality bar** | Reproducible exports; performance acceptable on target devices. |
| **Escalation** | If templates unavailable: extract patterns from `generator_template.js` instead. |
| **Strip** | Anthropic UI branding; `./templates/` hard dependency per findings. |
| **Notes** | Seeded `randomSeed`/`noiseSeed` idiom portable. |

### 4.3 Partial — Claude API language deep refs (Python / TypeScript)

**Direct evidence:** Findings mark these as portable SDK/API references with selective stripping (beta flags, toy paths, logging noise). Use live docs when stale.

| Source file                                                                         | Role                                                                                      |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `.references/anthropic-skills/skills/claude-api/python/agent-sdk/README.md`         | Agent SDK Python surface: permissions, hooks, subagents, session patterns.                |
| `.references/anthropic-skills/skills/claude-api/python/agent-sdk/patterns.md`       | Composed recipes: MCP tools, hooks, errors, resumption.                                   |
| `.references/anthropic-skills/skills/claude-api/python/claude-api/README.md`        | Core messages API usage, compaction, cost patterns.                                       |
| `.references/anthropic-skills/skills/claude-api/python/claude-api/tool-use.md`      | Tool runner + manual loop + structured outputs.                                           |
| `.references/anthropic-skills/skills/claude-api/python/claude-api/streaming.md`     | Streaming events + best practices.                                                        |
| `.references/anthropic-skills/skills/claude-api/python/claude-api/batches.md`       | Batch workflow + error categories.                                                        |
| `.references/anthropic-skills/skills/claude-api/python/claude-api/files-api.md`     | Upload-once / reuse `file_id` lifecycle.                                                  |
| `.references/anthropic-skills/skills/claude-api/typescript/claude-api/README.md`    | TS core patterns + narrowing caveats.                                                     |
| `.references/anthropic-skills/skills/claude-api/typescript/claude-api/tool-use.md`  | TS tool-use + server-side tool typing traps.                                              |
| `.references/anthropic-skills/skills/claude-api/typescript/claude-api/streaming.md` | TS streaming + `finalMessage()` anti-pattern warning.                                     |
| `.references/anthropic-skills/skills/claude-api/typescript/claude-api/batches.md`   | TS batch polling + retry semantics.                                                       |
| `.references/anthropic-skills/skills/claude-api/typescript/claude-api/files-api.md` | TS Files API patterns + beta caveats.                                                     |
| `.references/anthropic-skills/skills/claude-api/typescript/agent-sdk/README.md`     | TS Agent SDK options + permission clarifications.                                         |
| `.references/anthropic-skills/skills/claude-api/typescript/agent-sdk/patterns.md`   | TS patterns: hooks, fork, resume.                                                         |
| `.references/anthropic-skills/skills/claude-api/shared/models.md`                   | **Port:** programmatic model discovery; **strip/refresh:** static ID tables per findings. |

**Shared contract for these rows:** Trigger when implementing or debugging that SDK area; steps are the code patterns and checklists in each file; quality bar is correct typing, handling of tool/results round-trip, and streaming completion; escalation is official SDK/docs refresh; strip per-file beta and hardcoded model names noted in findings.

### 4.4 Partial — schema harness (`references/schemas.md`)

| Field | Content |
|-------|---------|
| **Source file** | `.references/anthropic-skills/skills/skill-creator/references/schemas.md` |
| **Trigger** | Building an eval artifact pipeline compatible with skill-creator tooling (rare outside Anthropic harness). |
| **Steps/contract** | JSON schema contracts for evals, grading, benchmarks per findings—mostly implementation-bound. |
| **Quality bar** | Fields align with consumer scripts (if retaining harness). |
| **Escalation** | Prefer extracting only eval-feedback principles per findings, not full schemas. |
| **Strip** | Path conventions, viewer coupling, large examples per findings. |
| **Notes** | `eval_feedback.suggestions` and timing/token availability caveat called micro-portable. |

| Field | Content |
|-------|---------|
| **Source file** | `.references/anthropic-skills/skills/claude-api/php/claude-api.md` |
| **Trigger** | PHP Claude SDK projects only. |
| **Steps/contract** | Per findings: generic tool loop and content-block guards portable; rest PHP-specific. |
| **Quality bar** | PHPStan-safe narrowing; correct `stopReason` sentinel per findings. |
| **Escalation** | Fold portable footguns into shared tool-use SOP instead of porting whole file. |
| **Strip** | Composer install, PHP boilerplate, `StructuredOutputModel` trait per findings. |
| **Notes** | Explicitly “partial” portability in findings. |

---

## 5. Portability ranking

**High** — Ready with minimal or no stripping: doc-coauthoring; mcp_best_practices; skill-creator agents (grader, comparator, analyzer); claude-api shared tool-use + caching + error codes; curl examples; algorithmic `generator_template.js`; most Python/TS API reference files subject only to beta/model pruning.

**Medium** — Strong value but mandatory generalization: mcp-builder main skill + node/python refs + evaluation *design half*; claude-api index SKILL; webapp-testing; internal-comms; skill-creator distillation; theme-factory pattern; brand token pattern; algorithmic-art viewer shell + SKILL partial.

**Partial / conditional** — `schemas.md` (harness); `models.md` (discovery vs tables); `php/claude-api.md` (footnotes into shared SOP); creative/brand skills where only fragments matter.

---

## 6. Cross-cutting protocol primitives

**Direct evidence anchors (concepts named in findings):**

- **User-intent / surface routing:** Claude API skill language detection + tier decision tree + negative routing (exclude non-Claude workflows).
- **Fresh-context reader testing:** doc-coauthoring Stage 3; blind comparator “stay blind” constraint; visual QA “fresh eyes” in pptx.
- **Brainstorm → curate → gap check:** doc-coauthoring section loop; generalizable beyond docs.
- **Reconnaissance-then-action:** webapp-testing Playwright flow with `networkidle`.
- **Progressive disclosure:** skill-creator anatomy (metadata ~100w, body <500 lines, bundled resources).
- **Description / trigger optimization:** realistic near-miss queries, train/test split rationale—portable without `run_loop.py`.
- **Eval design checklist:** mcp evaluation.md thirteen question rules + stable-answer principle.
- **Parallel exploration with safety caps:** evaluation.md step 4 sub-agent pattern with `limit` + pagination.
- **Quality gates with external verifier:** xlsx LibreOffice recalc; pptx image QA loop; docx validate step (conceptually).
- **Security baselines:** mcp_best_practices OAuth/env validation/DNS rebinding; tool-use-concepts path traversal / PII notes.
- **Prompt cache invariants:** shared prompt-caching prefix rules and silent invalidators.
- **Wire-protocol SSOT:** curl SSE sequences and header tables complement SDK docs.

---

## 7. Default recommendation (for `.agents`)

**Interpretation grounded in findings:**

| Ship by default | Form | Rationale (evidence) |
|-----------------|------|----------------------|
| **Doc co-authoring workflow** | Skill | Highest generic writing SOP; no vendor API lock-in per findings. |
| **MCP builder** (merged SKILL + inlined Quick Reference from `mcp_best_practices`) | Skill | Central dev task; broken relative refs must be fixed per findings. |
| **Webapp testing** (Playwright tree, no bundled scripts) | Skill | Universal local UI verification pattern. |
| **Claude API** | Rule + optional skill bundle | Index routing + shared conceptual docs + **only** languages the team uses (typically Python/TS); strip volatile tables per findings. |
| **Skill creator (distilled)** | Skill or agent brief | Principles + loop without Anthropic scripts per findings. |
| **Eval agents (grader/comparator/analyzer)** | Subagent prompts | Explicitly portable across eval stacks per findings. |

Defer by default: creative-only skills (canvas), marketplace manifest, live-sources URL table, full `schemas.md`, single-language API guides (Java/Go/Ruby/C#) unless those stacks are in use.

---

## 8. Structural patterns

**Evidence from findings:**

- **Multi-phase skills** with emoji/H2 markers and numbered sub-steps (mcp-builder, doc-coauthoring).
- **Index skill → language sub-files** with inline quick-reference “defaults” block (claude-api).
- **Dispatcher + `examples/`** directory for format variants (internal-comms).
- **Reference split:** normative standards (`mcp_best_practices`) vs tutorials (`node_mcp_server`, `python_mcp_server`) vs eval design (`evaluation.md`).
- **ASCII decision trees + pitfall callouts** (webapp-testing, xlsx).
- **Bundled Python/JS utilities** referenced by path—common portability hazard across skills (xlsx, pptx, docx, webapp-testing, mcp-builder).
- **Sub-agent prompts** colocated under `skills/skill-creator/agents/`.
- **Shared `/shared` layer** for cross-language API concepts parallel to `python/` and `typescript/` trees.

**Interpretation:** Favor packaging that inlines or parameterizes bundled paths; prefer shared conceptual layers with thin language skins—the repo already demonstrates that separation for `claude-api`.

---

## 9. Evidence (≥10 traceable citations)

Each line cites **direct evidence** from `raw-findings.md` (block heading = source excerpt scope). Paths below are absolute under the references clone as required.

1. `.references/anthropic-skills/skills/mcp-builder/SKILL.md` — four-phase workflow, relative `./reference/*.md` gap, Phase 4 Anthropic-internal eval (findings § `skills/mcp-builder/SKILL.md`).
2. `.references/anthropic-skills/skills/doc-coauthoring/SKILL.md` — three-stage co-authoring + reader testing, high portability, strip integrations (findings § `skills/doc-coauthoring/SKILL.md`).
3. `.references/anthropic-skills/skills/claude-api/SKILL.md` — tiered surface selection + pitfalls + partial portability of model tables (findings § `skills/claude-api/SKILL.md`).
4. `.references/anthropic-skills/skills/skill-creator/SKILL.md` — full lifecycle + scripts to strip + progressive disclosure gem (findings § `skills/skill-creator/SKILL.md`).
5. `.references/anthropic-skills/skills/webapp-testing/SKILL.md` — recon-then-action + `networkidle`; strip `with_server.py` (findings § `skills/webapp-testing/SKILL.md`).
6. `.references/anthropic-skills/skills/mcp-builder/reference/mcp_best_practices.md` — Quick Reference + pagination + transport + annotation defaults (findings § `reference/mcp_best_practices.md`).
7. `.references/anthropic-skills/skills/mcp-builder/reference/evaluation.md` — 13 question rules + strip runner section (findings § `reference/evaluation.md`).
8. `.references/anthropic-skills/skills/skill-creator/agents/grader.md` — claim extraction + superficial compliance FAIL (findings § `grader.md`).
9. `.references/anthropic-skills/skills/frontend-design/SKILL.md` — anti-AI-slop design direction; opinionated aesthetic rules (no Inter/Roboto/purple gradients) are high-value craft guidance worth carrying as a design policy layer.
12. `.references/anthropic-skills/skills/claude-api/shared/prompt-caching.md` — prefix invariance + silent invalidators (findings § `shared/prompt-caching.md`).
13. `.references/anthropic-skills/skills/claude-api/curl/examples.md` — wire-protocol portability + SSE sequence (findings § `curl/examples.md`).
15. `.references/anthropic-skills/.claude-plugin/marketplace.json` — non-procedural manifest (findings § `.claude-plugin/marketplace.json`).

---

## Traceability note

**Direct evidence** in this document is limited to paraphrases and quotes of material attributed to `.plans/audits/anthropic-skills/raw-findings.md`. **Interpretation** is labeled in sections 1–2, 7, ranking prose where synthesis extends beyond a single finding block.

---

*Compiled audit document — `anthropic-skills` — `role-to-sop-audit-1.md`.*
