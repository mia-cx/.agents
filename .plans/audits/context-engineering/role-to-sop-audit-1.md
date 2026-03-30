# Structured Audit: context-engineering repo
**Source:** `.plans/audits/context-engineering/raw-findings.md` — 50+ files audited  
**Date:** 2026-03-29  
**Auditor:** Worker agent (chain step 2, full rewrite)

---

## 1. Repo Overview

The `context-engineering` repository is a curated skill collection for building and operating LLM agent systems, organised into a `skills/` tree of 13 named skills, a `.references/context-engineering/docs/` meta-analysis layer, a `.references/` directory containing the collection-level index and canonical authoring template, an `.references/context-engineering/examples/` tree with four worked agent implementations (LLM-as-judge pipeline, interleaved-thinking optimizer, book SFT pipeline, digital-brain PKM), and a `.references/context-engineering/researcher/` directory containing a bespoke curation rubric. Each core skill is accompanied by a `references/` subdirectory holding deeper benchmarks, implementation patterns, and rubrics — a layered architecture that keeps the primary `.references/context-engineering/SKILL.md` under 500 lines while making detail available on demand. All 13 core skills are explicitly model- and framework-agnostic: code examples appear only as illustration and are confined to named subsections clearly marked as non-required reading. Quantitative benchmarks are prominent throughout — 15× multi-agent token multiplier, 70–80% compaction trigger, 40% tool-description optimisation lift, 36,000-message compression evaluation, 95% variance finding — giving the collection empirical grounding uncommon in skill libraries. The `.references/context-engineering/examples/` tree leans toward TypeScript/Python implementations coupled to vendor APIs (MiniMax, Tinker, Vercel AI SDK, OpenAI), making them lower portability targets than the core skills, though their embedded system prompts and orchestration protocols are independently valuable. Three files (`.references/context-engineering/docs/skills-improvement-analysis.md`, `.references/context-engineering/SKILL.md`, and all BDI reference files) are explicitly repo-internal and carry no extractable SOP content. The collection's defining strengths are its ordered-strategy frameworks, dense gotchas lists (7–10 items per skill), and quantified performance targets that translate directly into measurable acceptance criteria. The authoring meta-layer (`.references/context-engineering/CLAUDE.md` rules, `.references/context-engineering/template/SKILL.md`) is itself a high-value portable artefact — a self-describing SOP for writing SOPs.

---

## 2. Content Summary

### 2a. Context Engineering Cluster
*Files:* `.references/context-engineering/skills/context-fundamentals`, `.references/context-engineering/skills/context-degradation`, `.references/context-engineering/skills/context-compression`, `.references/context-engineering/skills/context-optimization`, and their `references/` companions  
**Portability signal: HIGH.** All four skills are model- and framework-agnostic; they share a coherent vocabulary (context budget, U-curve recall, compaction trigger, observation masking, KV-cache) and quantitative thresholds that hold across any LLM deployment. The reference files add benchmarks and implementation scaffolding — concepts are portable, Python class bodies are not.

### 2b. Multi-Agent Architecture Cluster
*Files:* `.references/context-engineering/skills/multi-agent-patterns`, `.references/context-engineering/skills/filesystem-context`, `.references/context-engineering/skills/hosted-agents`, `.references/context-engineering/skills/project-development`, `.references/context-engineering/skills/memory-systems`, and their `references/` companions  
**Portability signal: HIGH (core skills) / PARTIAL (reference implementations).** The five core skills are pattern-level documents. Vendor-specific code in `.references/context-engineering/skills/hosted-agents/references/infrastructure-patterns.md` and `.references/context-engineering/skills/multi-agent-patterns/references/frameworks.md` is illustrative only. The `.references/context-engineering/skills/project-development/SKILL.md` pipeline pattern and `.references/context-engineering/skills/filesystem-context/SKILL.md` failure taxonomy are immediately transplantable.

### 2c. Evaluation / LLM-as-Judge Cluster
*Files:* `.references/context-engineering/skills/evaluation`, `.references/context-engineering/skills/advanced-evaluation`, all `.references/context-engineering/examples/llm-as-judge-skills`, `.references/context-engineering/researcher/llm-as-a-judge.md`, evaluation `references/` files  
**Portability signal: HIGH.** The strongest self-contained cluster in the collection. Prompt templates (`.references/context-engineering/examples/llm-as-judge-skills/prompts/evaluation/direct-scoring-prompt.md`, `.references/context-engineering/examples/llm-as-judge-skills/prompts/evaluation/pairwise-comparison-prompt.md`) are ready to use after stripping Handlebars syntax. Agent system prompts (orchestrator, evaluator, research) carry transferable orchestration and bias-mitigation policies. The `.references/context-engineering/skills/advanced-evaluation/references/bias-mitigation.md` and `.references/context-engineering/skills/advanced-evaluation/references/metrics-guide.md` references are high-signal standalone references.

### 2d. Tool Design Cluster
*Files:* `.references/context-engineering/skills/tool-design`, `.references/context-engineering/skills/tool-design/references/best_practices.md`, `.references/context-engineering/skills/tool-design/references/architectural_reduction.md`  
**Portability signal: HIGH.** Entirely framework-agnostic; the 4-question description template, consolidation principle (Vercel 17→2 benchmark), and MCP naming conventions apply across all agent tooling ecosystems.

### 2e. Skill / SOP Authoring Meta-Layer
*Files:* `.references/context-engineering/docs/agentskills.md`, `.references/context-engineering/template/SKILL.md`, `.references/context-engineering/CLAUDE.md`  
**Portability signal: MEDIUM–HIGH.** The `.references/context-engineering/template/SKILL.md` and `.references/context-engineering/CLAUDE.md` authoring rules are directly portable as a "how to write a skill" SOP. `.references/context-engineering/docs/agentskills.md` is a multi-page concatenation of varying density; its degrees-of-freedom framework, eval-first methodology, and progressive-disclosure rules are the best portable extractions.

### 2f. Domain-Specific / Low-Portability Files
*Files:* `.references/context-engineering/skills/bdi-mental-states` + all BDI references, `.references/context-engineering/examples/interleaved-thinking/SKILL.md`, `.references/context-engineering/examples/digital-brain-skill/SKILL.md`, `.references/context-engineering/examples/book-sft-pipeline/SKILL.md`  
**Portability signal: LOW.** These files are coupled to proprietary APIs (MiniMax, Tinker), user-specific file trees, or formal ontology toolchains (RDF/OWL/SPARQL). The BDI failure taxonomy and progressive-disclosure loading pattern are the only extractable fragments.

### 2g. Internal Meta / Index Files
*Files:* `.references/context-engineering/docs/skills-improvement-analysis.md`, `.references/context-engineering/SKILL.md`, `.references/context-engineering/.plugin/plugin.jsonon`, `.references/context-engineering/.claude-plugin/marketplace.jsonon`  
**Portability signal: NONE.** Point-in-time audits, navigation manifests, and package descriptors for this specific repo; every reference is to named internal skills, commit hashes, or local directory structures.

---

## 3. SOP Split

### PORT (full or partial)

| File | Decision | One-line reason |
|------|----------|-----------------|
| `.references/context-engineering/skills/context-fundamentals/SKILL.md` | **Port** | Universal quantitative thresholds (U-curve, 70–80% trigger, 60–70% effective capacity) with no repo dependencies. |
| `.references/context-engineering/skills/context-degradation/SKILL.md` | **Port (strip)** | Five-pattern taxonomy and four-bucket mitigation framework are portable; integration/references sections are not. |
| `.references/context-engineering/skills/context-compression/SKILL.md` | **Port** | Three-method taxonomy, structured summary template, probe-based eval, and 7-item gotchas are all framework-agnostic. |
| `.references/context-engineering/skills/context-optimization/SKILL.md` | **Port** | Ordered four-step strategy hierarchy with concrete performance targets and production-hardened gotchas. |
| `.references/context-engineering/skills/multi-agent-patterns/SKILL.md` | **Port (strip)** | All decision frameworks are portable; strip LangGraph/AutoGen/CrewAI code blocks and replace with pseudocode. |
| `.references/context-engineering/skills/filesystem-context/SKILL.md` | **Port** | 4-mode failure taxonomy and 6 patterns require only generic file-read/write tools; no vendor APIs. |
| `.references/context-engineering/skills/evaluation/SKILL.md` | **Port** | 8-step procedural framework with calibrated thresholds (0.7/0.9 pass gates, 50-case floor) is actionable anywhere. |
| `.references/context-engineering/skills/advanced-evaluation/SKILL.md` | **Port** | Complete LLM-as-judge methodology with bias-mitigation protocol and research-backed benchmarks. |
| `.references/context-engineering/skills/tool-design/SKILL.md` | **Port** | 4-question description template, consolidation principle, and MCP naming convention are universally applicable. |
| `.references/context-engineering/skills/hosted-agents/SKILL.md` | **Port (strip)** | Core infrastructure principles (warm-pool, predictive warm-up, per-session isolation) are portable; client impl section is not. |
| `.references/context-engineering/skills/project-development/SKILL.md` | **Port** | Canonical 5-stage pipeline, file-system state machine, and 5-phase project template have no repo dependencies. |
| `.references/context-engineering/skills/memory-systems/SKILL.md` | **Port** | Memory escalation ladder, "invalidate but don't discard" rule, and error-recovery hierarchy are framework-agnostic. |
| `.references/context-engineering/template/SKILL.md` | **Port** | Self-contained skill-authoring template; requires only removal of placeholder text. |
| `.references/context-engineering/CLAUDE.md` | **Port (partial)** | Skill-authoring rules block (8 rules) and Key Design Principles are portable; project-infrastructure sections are not. |
| `.references/context-engineering/docs/agentskills.md` | **Port (partial)** | Degrees-of-freedom framework, eval-first methodology, and 24-item authoring checklist are portable; adoption/integration sections are not. |
| `.references/context-engineering/skills/bdi-mental-states/SKILL.md` | **Port (partial)** | BDI conceptual frame, T2B2T pipeline principle, and gotchas 2/4/5/6/7 are portable; all RDF/Turtle/SPARQL content is not. |
| `.references/context-engineering/skills/evaluation/references/metrics.md` | **Port (strip)** | Dimension table with weights and five-level scale is directly reusable; Python class bodies are not. |
| `.references/context-engineering/skills/advanced-evaluation/references/bias-mitigation.md` | **Port (strip)** | Summary table (bias → mitigation → detection) is a ready-made SOP checklist; strip Python implementation bodies. |
| `.references/context-engineering/skills/context-fundamentals/references/context-components.md` | **Port (strip)** | Token-budget table and before/after examples are portable; pseudocode implementations are not. |
| `.references/context-engineering/skills/context-degradation/references/patterns.md` | **Port (partial)** | Alert thresholds and truncation priority order are portable; class-based monitoring code assumes unavailable API access. |
| `.references/context-engineering/skills/context-compression/references/evaluation-framework.md` | **Port (strip)** | Probe types, 0–5 rubrics, and "artifact trail is universally weak" finding are portable; dated benchmark numbers are not. |
| `.references/context-engineering/skills/context-optimization/references/optimization_techniques.md` | **Port (strip)** | Decision framework and common-pitfalls section are portable; `OptimizingAgent` integration code is not. |
| `.references/context-engineering/skills/advanced-evaluation/references/metrics-guide.md` | **Port (strip)** | Decision tree, threshold table, and reporting template are portable; `sklearn`/`scipy` code is not. |
| `.references/context-engineering/skills/project-development/references/pipeline-patterns.md` | **Port (strip)** | Stage-characteristics table, directory structure pattern, and checkpoint interface are portable; CLI boilerplate is not. |
| `.references/context-engineering/skills/tool-design/references/best_practices.md` | **Port (strip)** | 4-question framework, dual-audience error design, and pre-deployment checklist are portable; Python snippet is not. |
| `.references/context-engineering/skills/tool-design/references/architectural_reduction.md` | **Port (strip)** | Four prerequisites + four failure conditions form a portable decision matrix; Vercel-SDK code is not. |
| `.references/context-engineering/skills/multi-agent-patterns/references/frameworks.md` | **Port (partial)** | File-system coordination pattern, checkpoint/resume, and consensus mechanisms are portable; LangGraph/AutoGen/CrewAI code is not. |
| `.references/context-engineering/skills/memory-systems/references/implementation.md` | **Port (partial)** | Architecture decisions (vector+graph tiers, temporal scoping, consolidation trigger) are portable; NumPy/SDK code is not. |
| `.references/context-engineering/skills/filesystem-context/references/implementation-patterns.md` | **Port (partial)** | Conceptual pattern names and token-accounting benchmarks are portable; Python class bodies are not. |
| `.references/context-engineering/skills/advanced-evaluation/references/implementation-patterns.md` | **Port (strip)** | PoLL pattern, hierarchical cheap→expensive routing, and position-swap bias mitigation are portable; `gpt-5.2` copy-paste error in source needs correction on promotion. |
| `.references/context-engineering/researcher/llm-as-a-judge.md` | **Port (partial)** | 4-gate/4-dimension gatekeeper scoring template is portable; CE-domain criteria must be swapped for other domains. |
| `.references/context-engineering/examples/llm-as-judge-skills/prompts/evaluation/direct-scoring-prompt.md` | **Port** | Complete, self-contained LLM-as-judge scoring prompt; highest-portability artefact in the examples tree. |
| `.references/context-engineering/examples/llm-as-judge-skills/prompts/evaluation/pairwise-comparison-prompt.md` | **Port (strip)** | Three-step evaluation scaffold and position-bias mitigation protocol are portable; TypeScript implementation is not. |
| `.references/context-engineering/examples/llm-as-judge-skills/prompts/agent-system/orchestrator-prompt.md` | **Port (partial)** | Five-phase workflow, task-delegation template, and error-handling protocol are portable; specific agent roster is not. |
| `.references/context-engineering/examples/llm-as-judge-skills/prompts/research/research-synthesis-prompt.md` | **Port (partial)** | Seven-section synthesis framework is portable; LLM-evaluation worked example and Handlebars syntax are not. |
| `.references/context-engineering/examples/llm-as-judge-skills/agents/orchestrator-agent/orchestrator-agent.md` | **Port (strip)** | Orchestration principles and Mermaid topology diagrams are portable; TypeScript SDK wiring is not. |
| `.references/context-engineering/examples/llm-as-judge-skills/agents/evaluator-agent/evaluator-agent.md` | **Port (strip)** | Bias-mitigation rules and four-capability taxonomy are portable; TypeScript SDK wiring is not. |
| `.references/context-engineering/examples/llm-as-judge-skills/agents/research-agent/research-agent.md` | **Port (strip)** | Research methodology and quality standards sections are portable; model-specific config is not. |
| `.references/context-engineering/examples/llm-as-judge-skills/tools/index.md` | **Port (partial)** | Three interaction patterns (sequential pipeline, parallel fan-out, iterative refinement) are portable; specific tool names are not. |
| `.references/context-engineering/examples/llm-as-judge-skills/skills/llm-evaluator/llm-evaluator.md` | **Port (partial)** | Scoring-approach taxonomy and bias-mitigation checklist are portable; TypeScript interfaces are not. |
| `.references/context-engineering/examples/llm-as-judge-skills/tools/evaluation/direct-score.md` | **Port (strip)** | Weighted criteria array, configurable rubric scale, and justification-first protocol are portable; Vercel AI SDK wiring is not. |
| `.references/context-engineering/examples/llm-as-judge-skills/tools/evaluation/pairwise-compare.md` | **Port (strip)** | Position-swap algorithm and `positionConsistency` flag pattern are portable; SDK wiring is not. |
| `.references/context-engineering/examples/llm-as-judge-skills/tools/evaluation/generate-rubric.md` | **Port (strip)** | Generate-rubric-before-scoring as a distinct SOP step, plus three ready-made rubric templates, are portable. |
| `.references/context-engineering/examples/llm-as-judge-skills/tools/orchestration/delegate-to-agent.md` | **Port (strip)** | Context-passing contract (previousOutputs + documents + constraints), error taxonomy with `retryable` flag, and token-tracking discipline are portable. |
| `.references/context-engineering/examples/llm-as-judge-skills/prompts/index.md` | **Port (partial)** | Four design principles and six-item prompt-testing checklist are portable; category file-path table is not. |
| `.references/context-engineering/examples/interleaved-thinking/generated_skills/comprehensive-research-agent/SKILL.md` | **Port** | All guidance is model-agnostic; only "Score Expectations" section is vendor-specific. |
| `.references/context-engineering/examples/llm-as-judge-skills/skills/context-fundamentals/context-fundamentals.md` | **Port (strip)** | Context-type taxonomy (static/dynamic/ephemeral) and utilisation metrics checklist are portable; SDK RAG template placeholders are illustrative only. |
| `.references/context-engineering/examples/llm-as-judge-skills/skills/tool-design/tool-design.md` | **Port (partial)** | Single-responsibility principle, typed output contract, and three-tier danger classification (read-only/state-modifying/dangerous) are portable; AI SDK 6 code is not. |
| `.references/context-engineering/examples/digital-brain-skill/identity/voice.md` | **Port (partial)** | Five-axis attribute table and "Never Use" deny-list structure are a portable canonical voice-profile template. |
| `.references/context-engineering/examples/digital-brain-skill/content/CONTENT.md` | **Port (partial)** | Five-stage content pipeline (capture→develop→voice-check→publish→log) and append-only log discipline are portable; specific file names are not. |

### LEAVE OUT

| File | Decision | One-line reason |
|------|----------|-----------------|
| `.references/context-engineering/docs/skills-improvement-analysis.md` | **Leave out** | Point-in-time audit of this repo's 13 skills; every sentence references internal names, commit hashes, or local directory paths. |
| `.references/context-engineering/SKILL.md` | **Leave out** | Navigation manifest for the sub-collection; contains survey prose, not executable guidance. |
| `.references/context-engineering/.plugin/plugin.jsonon` | **Leave out** | Package descriptor only; no actionable content. |
| `.references/context-engineering/.claude-plugin/marketplace.jsonon` | **Leave out** | Skill registry manifest; useful only for repo navigation. |
| `.references/context-engineering/skills/bdi-mental-states/references/bdi-ontology-core.md` | **Leave out** | Pure OWL/RDF namespace spec for a niche academic ontology; no transferable SOP pattern. |
| `.references/context-engineering/skills/bdi-mental-states/references/framework-integration.md` | **Leave out** | Tightly coupled to SEMAS Prolog, JADE/JADEX agent platforms, and FIPA ACL; no general-purpose applicability. |
| `.references/context-engineering/skills/bdi-mental-states/references/sparql-competency.md` | **Leave out** | SPARQL test harness for one ontology; no portable policy or workflow pattern. |
| `.references/context-engineering/skills/hosted-agents/references/infrastructure-patterns.md` | **Leave out** | Almost every section is vendor-bound (Modal, Cloudflare DO, Slack Bolt); warm-pool concept salvageable only as brief prose notes in the parent skill. |
| `.references/context-engineering/skills/advanced-evaluation/references/evaluation-pipeline.md` | **Leave out** | Thin ASCII diagram reference; stage list is fully absorbed by the parent skill's pipeline description. |
| `.references/context-engineering/examples/interleaved-thinking/SKILL.md` | **Leave out** | Entire skill is coupled to MiniMax M2.1's proprietary API and a vendor CLI tool (`rto`). |
| `.references/context-engineering/examples/digital-brain-skill/SKILL.md` | **Leave out** | Requires a user-specific pre-populated file tree; non-functional without it. |
| `.references/context-engineering/examples/digital-brain-skill/AGENT.md` | **Leave out** | Routing table and file conventions are instance-specific to the Digital Brain layout. |
| `.references/context-engineering/examples/digital-brain-skill/agents/AGENTS.md` | **Leave out** | Hard-wired to Digital Brain script names and file paths; no portable SOP. |
| `.references/context-engineering/examples/digital-brain-skill/content/templates/linkedin-post.md` | **Leave out** | Platform-specific (LinkedIn) and persona-specific; not generally portable. |
| `.references/context-engineering/examples/digital-brain-skill/content/templates/newsletter.md` | **Leave out** | Email-channel-specific and persona-specific; structure pattern is absorbed by `.references/context-engineering/examples/digital-brain-skill/content/CONTENT.md`. |
| `.references/context-engineering/examples/digital-brain-skill/content/templates/thread.md` | **Leave out** | Hard-wired to Twitter/X character limits and thread-number conventions. |
| `.references/context-engineering/examples/book-sft-pipeline/SKILL.md` | **Leave out** | Training phase is Tinker-platform-specific; general extraction value too low relative to stripping effort. |
| `.references/context-engineering/examples/llm-as-judge-skills/tools/research/web-search.md` | **Leave out** | Framework-specific (Vercel AI SDK + Zod); query-optimisation tips absorbed by `.references/context-engineering/skills/tool-design/SKILL.md`. |
| `.references/context-engineering/examples/llm-as-judge-skills/tools/research/read-url.md` | **Leave out** | Framework-specific; error-code taxonomy absorbed by `.references/context-engineering/skills/tool-design/SKILL.md`. |

---

## 4. Per-SOP Detail Table

*Covers all PORT decisions (full or partial). Reference files listed as sub-rows under their parent skill where relevant.*

| Source file | Trigger | Steps / contract | Quality bar | Strip | Notes |
|-------------|---------|-----------------|-------------|-------|-------|
| `.references/context-engineering/skills/context-fundamentals/SKILL.md` | Designing agent architectures; debugging unexpected agent behaviour; optimising token costs; onboarding to context engineering | Reference structure: core principles → anatomy → attention mechanics → practical guidance → 8-item guidelines → 7-item gotchas | Preserve quantitative thresholds verbatim: effective capacity 60–70%; compaction trigger 70–80%; sub-agent return budget 1K–2K tokens; 2–3× serialisation inflation; middle recall 76–82% vs 85–95% at ends | Author/version metadata; Integration cross-links to sibling skills; `.references/context-engineering/skills/context-fundamentals/references/context-components.md` path; vague external attributions | Highest-signal foundational reference. Consider splitting into "Context Budget Cheatsheet" (thresholds/gotchas) and "Context Engineering Primer" (conceptual depth). |
| `.references/context-engineering/skills/context-degradation/SKILL.md` | User asks to diagnose context problems, debug agent failures, fix lost-in-middle, mentions context poisoning / degradation / attention patterns | No explicit procedure; closest is the four-bucket framework: detect pattern → apply Write / Select / Compress / Isolate | Preserve five-pattern taxonomy, four-bucket labels, U-curve placement rule ("critical info at start and end, never middle"), and 7-item gotchas verbatim | "Core Concepts" prose (duplicates detailed-topics); YAML illustrative examples; "When Larger Contexts Hurt" section; Integration and References sections; verbose "Counterintuitive Findings" intro | Add an explicit pattern→mitigation decision table on extraction to convert from reference to SOP. |
| `.references/context-engineering/skills/context-compression/SKILL.md` | Agent session approaching context window limit; designing summarisation strategy; debugging agent "forgetting"; building compression eval frameworks | 7-step procedural sequence: choose method → trigger at 70–80% → build structured summary → merge on subsequent compression → preserve identifiers verbatim → evaluate with 6-dimension probes → monitor re-fetching frequency | "Tokens-per-task not tokens-per-request" as headline principle; artifact trail warning (2.2–2.5/5.0) as design constraint; 7-item gotchas must survive verbatim | `## Integration` cross-links; `## References` internal sub-section; `## Skill Metadata` block | Strongest SOP in the context-engineering cluster. Three-phase compression workflow (Research → Planning → Implementation) is a high-value portable pattern. |
| `.references/context-engineering/skills/context-optimization/SKILL.md` | Context limits constrain task complexity; cost/latency reduction required; context utilisation exceeds 70% | Priority-ordered 4-step hierarchy: KV-cache first (zero quality risk) → observation masking (largest capacity gain) → compaction at ≥70% (lossy) → context partitioning when estimated context >60% of window | Performance targets are measurable acceptance criteria: 50%+ cost reduction from caching; <5% quality loss from compaction; <2% from masking; 70%+ cache-hit-rate goal | Integration cross-links to sibling skills; `.references/context-engineering/skills/context-optimization/references/optimization_techniques.md` link; skill-metadata block | "Compaction under pressure" gotcha (trigger at 70–80%, not 90%+; use separate clean-context model call if forced late) is production-hardened tribal knowledge worth quoting verbatim. |
| `.references/context-engineering/skills/multi-agent-patterns/SKILL.md` | Designing or implementing a multi-agent system; choosing between orchestration patterns; coordinating sub-agents or parallel execution; diagnosing coordination overhead | Decision guide: (1) when to use multi-agent at all, (2) pattern selection by coordination need (supervisor/swarm/hierarchical), (3) context isolation mechanisms, (4) consensus and anti-sycophancy protocols, (5) failure modes + mitigations, (6) gotchas | Preserve 15× token cost benchmark; 8-item gotchas list; "context isolation as primary purpose, not role anthropomorphism" design principle | Framework-specific code blocks (LangGraph/AutoGen/CrewAI); `forward_message` Python snippet; internal cross-skill references; Skill Metadata footer | Replace framework code with pseudocode. Supervisor scaling cap, sycophantic consensus, over-decomposition, and telephone game gotchas are the primary extraction targets. |
| `.references/context-engineering/skills/filesystem-context/SKILL.md` | "Offload context to files", "dynamic context discovery", "filesystem for agent memory", tool output persistence, agent scratch pads, just-in-time context loading | 4-mode failure taxonomy → 6 patterns: (1) scratch pad for large tool outputs, (2) plan persistence in YAML, (3) per-agent workspace dirs, (4) dynamic skill loading, (5) terminal/log persistence + grep, (6) self-modification of instruction files | 4-mode failure taxonomy must survive verbatim (missing / under-retrieved / over-retrieved / buried context); 8-item gotchas list is unusually thorough | Python pseudocode snippets; Integration cross-refs; external resource links | Dynamic skill loading pattern (pattern 4) is self-referential but highly reusable for any skills-based agent system. |
| `.references/context-engineering/skills/evaluation/SKILL.md` | Building an evaluation framework for agents; measuring agent quality; setting up LLM-as-judge pipelines; establishing quality gates for deployment; diagnosing regressions | 8-step procedural sequence: define dimensions → create rubrics → build test sets → implement pipeline → establish baseline → run on changes → track over time → add human review | 95% variance finding (80% tokens / ~10% tool calls / ~5% model) must survive as a calibrated benchmark; thresholds (0.7 general pass / 0.9 high-stakes; 50-case floor; 0.85 warning / 0.70 critical alerts) are measurable | Integration cross-links (all dead outside source repo); `## References` internal sub-section; `## Skill Metadata` block; trivially obvious Python snippet | "Outcomes not paths" principle and multi-dimensional rubric with per-dimension failure threshold are the highest-value standalone extractions. |
| `.references/context-engineering/skills/advanced-evaluation/SKILL.md` | Implement LLM-as-judge; compare model outputs; create evaluation rubrics; mitigate evaluation bias; pairwise comparison; position bias; automated quality assessment | (1) Taxonomy decision (direct vs pairwise), (2) Bias mitigation protocol (2-pass position swap + consistency check), (3) Metric selection table, (4) Rubric generation (5 required components), (5) Pipeline layers (Criteria Loader → Primary Scorer → Bias Mitigation → Confidence Scoring → Output), (6) Scaling strategies (PoLL, hierarchical, human-in-the-loop) | 2-pass position-swap protocol and confidence calibration mapping must survive as concrete procedures; research citations (Zheng 2023: CoT improves reliability 15–25%; rubrics reduce variance 40–60%) give credibility | Internal links (`.references/context-engineering/skills/advanced-evaluation/references/bias-mitigation.md`, `.references/context-engineering/skills/advanced-evaluation/references/evaluation-pipeline.md`, `.references/context-engineering/skills/advanced-evaluation/references/implementation-patterns.md`, `.references/context-engineering/skills/advanced-evaluation/references/metrics-guide.md`); Integration section; Skill Metadata block | One of the highest-signal skills in the collection. Strong concrete grounding with research citations. |
| `.references/context-engineering/skills/tool-design/SKILL.md` | Designing new tools for agent systems; debugging tool-selection failures; reducing tool count; optimising tool descriptions; implementing or auditing MCP tools | (1) 5-step Tool Selection Framework, (2) 4-question description template (what / when / inputs / returns), (3) description-optimisation feedback loop | "Description as prompt, not documentation" is the primary reframe; Vercel 17→2 benchmark with explanation of why it works (attention budget, context token cost, selection ambiguity); tool count limit 10–20 with research backing | Integration cross-links; `## References` internal sub-section; `## Skill Metadata` block; external URL block (retain as footnotes); Python snippet (retain as pattern, not code) | Gotchas #6 (description rot), #7 (over-consolidation at 8–10 params), and #8 (parameter explosion) are production-hardened and non-obvious. |
| `.references/context-engineering/skills/hosted-agents/SKILL.md` | Building background or hosted coding agents; designing sandboxed execution environments; scaling agent infrastructure; implementing multiplayer sessions; building self-spawning sub-agent systems | Architecture guide: sandbox infrastructure → framework selection → speed optimisations → self-spawning agents (3 primitives: start/status/continue) → API layer → multiplayer → auth → 8-item guidelines → 8-item gotchas | Warm-pool + predictive warm-up pattern; "reads before writes during git sync"; per-session state isolation with SQLite; "commits attributed to prompting user, not app identity" auth principle | Client implementations section (Slack/Web/Chrome); vendor-specific URLs; internal cross-skill references; GitHub-specific auth detail | Eight-item gotchas (cold start, image staleness, cost runaway, auth expiration mid-session, missing git config, state loss on recycle, warm pool oversubscription, missing output extraction) are dense tribal knowledge. |
| `.references/context-engineering/skills/project-development/SKILL.md` | Starting a new LLM-powered project; evaluating task-model fit; designing a batch pipeline; choosing single vs multi-agent; estimating token costs; structuring agent-assisted development | Dual-mode: 5-phase project planning template (Task Analysis → Manual Validation → Architecture Selection → Cost Estimation → Development Plan) + reference content (task-model fit tables, canonical 5-stage pipeline, file-system state machine, cost formula) | Task-model fit tables (proceed/stop with rationale) and canonical pipeline (acquire → prepare → process → parse → render) with deterministic/non-deterministic labelling must survive; cost formula (items × tokens_per_item × price + 20–30% buffer) | Integration cross-links; `## References` sub-section (relative paths not portable); `## Skill Metadata` block; inline sibling-skill cross-references | Manual prototype step as a mandatory validation gate before any automation is the highest-signal standalone heuristic. Overlaps with `.references/context-engineering/skills/tool-design/references/architectural_reduction.md` (architectural reduction section) — cross-note preferred over deduplication. |
| `.references/context-engineering/skills/memory-systems/SKILL.md` | Building agents that persist knowledge across sessions; choosing between memory frameworks; implementing knowledge graphs or temporal KGs; designing retrieval strategies; evaluating memory quality | Decision guide with escalation ladder: (1) prototype with file-system memory, (2) scale to vector store for semantic search + multi-tenant isolation, (3) add relationship traversal and temporal validity, (4) use full agent self-management. Supporting: framework selection table → memory layer taxonomy → retrieval strategy matrix → consolidation policy → error-recovery hierarchy | "Reliability beats tool complexity" benchmark (Letta filesystem 74% vs Mem0 68.5% on LoCoMo) must survive; "invalidate but do not discard" consolidation rule; just-in-time retrieval + attention-favored position placement | Integration cross-links; `## References` internal sub-section; `## Skill Metadata` block | Benchmark table is time-sensitive — add "directional signals, not definitive rankings" caveat. Temporal validity pattern (valid_from/valid_until) is a portable data-model decision. |
| `.references/context-engineering/template/SKILL.md` | Creating a new skill from scratch; restructuring an existing skill; reviewing a skill for quality | Implied sequential structure: YAML frontmatter → description → When to Activate → Core Concepts → Detailed Topics → Practical Guidance → Examples → Guidelines → Gotchas → Integration → References → Skill Metadata; each section has inline authoring criteria | Inline authoring guidance per section (especially freedom-level tiering and Gotchas rationale) is the primary portable value; preserve verbatim after removing placeholder text | Placeholder text ("Skill Name", "[Date]", "[Author or Attribution]"); opening meta-instruction about the template itself | Strongest portable artefact in the authoring-meta cluster. Adoptable directly as canonical SKILL.md template with only Integration section convention update. |
| `.references/context-engineering/CLAUDE.md` (partial) | Creating or editing a SKILL.md file; adding skills to any collection | 8 skill-authoring rules (unordered checklist): 500-line cap, required YAML frontmatter, lowercase-hyphen folder names, third-person prose, platform-agnosticism, token-consciousness, mandatory Gotchas section, manifest update obligation | "Include a Gotchas section" rule with rationale ("highest-signal content in any skill") must survive; "challenge each paragraph for token cost" is the single most actionable rule | Everything under Project Overview, Repository Structure, Build & Test Commands, Plugin Architecture | 8 rules + 4 design principles would make a compact portable SOP for skill authoring. |
| `.references/context-engineering/docs/agentskills.md` (partial) | Writing or auditing a SKILL.md; establishing quality standards for a skills library; onboarding skill authors | Eval-driven development sequence: run without skill → document failures → create 3 evals → establish baseline → write minimal instructions → iterate; Claude A/B iterative pattern (one instance writes, fresh instance tests) | Degrees-of-freedom framework (narrow-bridge/open-field analogy; three tiers: text instructions / pseudocode-with-params / exact-script-no-flags) must survive with explicit "use when" criteria | Overview/adoption section; "Integrate skills into your agent" section; eval JSON structure caveat; all external GitHub links; model-tier-specific testing note | "Concise is key / default assumption is Claude is already smart" is the single most important reframe and should survive verbatim. |
| `.references/context-engineering/examples/llm-as-judge-skills/prompts/evaluation/direct-scoring-prompt.md` | Automated LLM-as-judge scoring; single-response quality assessment; evidence-grounded rubric evaluation | Evidence-first evaluation chain: evidence → score → justification → improvement; anti-bias guidelines; JSON output schema; documented template variables | Best Practices section (Evidence First, Rubric Alignment, Constructive Feedback, Consistency, Calibration) must survive verbatim | Handlebars `{{#each}}`/`{{#if}}` syntax (replace with neutral placeholder); JSON code-fence wrapping template body | Highest-portability artefact in the examples tree. Pairs with findings in `.references/context-engineering/examples/llm-as-judge-skills/agents/evaluator-agent/evaluator-agent.md`; co-locate in any resulting llm-as-judge skill. |
| `.references/context-engineering/examples/llm-as-judge-skills/prompts/evaluation/pairwise-comparison-prompt.md` | Pairwise LLM output comparison; subjective preference evaluation; position-bias mitigation | Three-step scaffold: independent analysis → criterion-by-criterion head-to-head → final determination with confidence score; position-swap protocol | Position-bias mitigation pattern (swap positions, average, flag inconsistency) must survive as a concrete, reusable operational technique | TypeScript `compareWithPositionSwap` implementation; "explain the benefits of regular exercise" worked example | Bias-mitigation protocol alone is worth extracting as a standalone policy. JSON output schema is a useful reference. |
| `.references/context-engineering/examples/llm-as-judge-skills/prompts/agent-system/orchestrator-prompt.md` | Orchestrating multi-agent task execution; decomposing work across specialised agents; monitoring parallel execution | Five-phase workflow: Task Analysis → Agent Assignment → Execution Planning → Execution & Monitoring → Synthesis; task-delegation template (Agent / Task / Context / Expected Output / Success Criteria); three-step error-handling protocol (Assess → Decide → Document) | Parallelism principle ("Parallel When Possible") and quality-gate principle must survive explicitly | Specific agent roster (Evaluator, Researcher, Writer, Analyst with capability descriptions); "LLM evaluation report" worked example | Task-delegation template and error-handling protocol are the highest-value extractions. |
| `.references/context-engineering/examples/interleaved-thinking/generated_skills/comprehensive-research-agent/SKILL.md` | Research agent quality; multi-source verification; anti-hallucination guidance | Seven named anti-patterns each with concrete before/after example; pre-completion checklist; pre-read source ranking; `read_file` over `list_directory` for write verification | Paired anti-pattern/recommended-practice format must survive; seven anti-patterns with before/after are the primary portable value | "Score Expectations" section (M2.1-specific benchmarks); generated-metadata footer | Strong candidate for direct promotion or merging into a research-agent SOP. |
| `.references/context-engineering/researcher/llm-as-a-judge.md` | Content curation and triage tasks using a gatekeeper scoring model | 4-gate hard-stops → 4-dimension weighted scoring → JSON output (APPROVE/HUMAN_REVIEW/REJECT); override rules for conflicting signals | Gatekeeper + dimensional scoring model is the portable template; specific CE-domain criteria must be replaced per domain | CE-domain gate labels and dimension criteria | Best cross-domain reuse candidate in the researcher directory. Extract as a generic `triage-with-rubric` template. |

---

## 5. Portability Ranking

### Tier 1 — High Portability (port as-is or strip-and-promote)

These files carry complete, actionable guidance with minimal repo-specific dependencies. Strip items are narrowly scoped (metadata blocks, dead cross-links, vendor code examples).

| Rank | File | Primary value |
|------|------|---------------|
| 1 | `.references/context-engineering/skills/context-compression/SKILL.md` | Most procedurally complete SOP in the collection; 7-step contract + structured summary template + probe-based eval methodology. |
| 2 | `.references/context-engineering/examples/llm-as-judge-skills/prompts/evaluation/direct-scoring-prompt.md` | Ready-to-use complete LLM-as-judge prompt; highest-portability single artefact in the collection. |
| 3 | `.references/context-engineering/skills/context-optimization/SKILL.md` | Clear ordered-strategy hierarchy with measurable performance targets and production-hardened gotchas. |
| 4 | `.references/context-engineering/skills/context-fundamentals/SKILL.md` | Foundational quantitative benchmarks that all other context skills reference; no dependencies. |
| 5 | `.references/context-engineering/skills/tool-design/SKILL.md` | 4-question template + consolidation principle + empirical Vercel benchmark; universally applicable. |
| 6 | `.references/context-engineering/skills/evaluation/SKILL.md` | 8-step procedural framework with calibrated thresholds and 95% variance finding. |
| 7 | `.references/context-engineering/template/SKILL.md` | Canonical skill-authoring template; adoptable with minimal changes. |
| 8 | `.references/context-engineering/skills/filesystem-context/SKILL.md` | 4-mode failure taxonomy + 6 patterns; one of the most actionable skills in the collection. |
| 9 | `.references/context-engineering/skills/project-development/SKILL.md` | Canonical 5-stage pipeline + file-system state machine + 5-phase project template. |
| 10 | `.references/context-engineering/skills/advanced-evaluation/SKILL.md` | Complete LLM-as-judge methodology with bias-mitigation protocol and research citations. |

### Tier 2 — Medium Portability (strip and restructure)

Require stripping of integration sections and/or addition of a decision table or explicit input/output contract to convert from reference to SOP.

| File | Why medium | Key restructuring needed |
|------|-----------|--------------------------|
| `.references/context-engineering/skills/multi-agent-patterns/SKILL.md` | Framework code examples mixed with portable patterns | Replace LangGraph/AutoGen/CrewAI code with pseudocode |
| `.references/context-engineering/skills/memory-systems/SKILL.md` | Benchmark table is time-sensitive; framework code is illustrative | Add "directional signals" caveat to benchmark table; strip SDK code |
| `.references/context-engineering/skills/context-degradation/SKILL.md` | Lacks an explicit trigger→action→output loop | Add pattern→mitigation decision table on extraction |

| `.references/context-engineering/skills/hosted-agents/SKILL.md` | Client implementations section is too product-specific | Remove client implementations section; reduce vendor specifics |
| `.references/context-engineering/examples/llm-as-judge-skills/prompts/agent-system/orchestrator-prompt.md` | Specific agent roster is project-specific | Replace agent roster with placeholder instruction |
| `.references/context-engineering/docs/agentskills.md` | Multi-page concatenation with inconsistent header levels | Restructure as 5 named sections; keep only authoring principles content |
| `.references/context-engineering/CLAUDE.md` | Project-infrastructure sections dominate the document | Retain only Skill Authoring Rules block and Key Design Principles |
| `.references/context-engineering/skills/advanced-evaluation/references/bias-mitigation.md` | Python implementation bodies obscure portable summary table | Strip implementation code; preserve summary table verbatim |
| `.references/context-engineering/skills/advanced-evaluation/references/metrics-guide.md` | Language-specific metric library code | Strip `sklearn`/`scipy` implementations; keep decision tree and threshold table |
| `.references/context-engineering/examples/llm-as-judge-skills/agents/orchestrator-agent/orchestrator-agent.md` | TypeScript SDK wiring is substantial | Strip SDK scaffolding; preserve orchestration principles and Mermaid diagrams |

### Tier 3 — Partial Portability (extract specific fragments only)

Require significant scoping or only specific sections are portable. Not suitable for wholesale promotion.

| File | Extractable fragment | Reason for partial only |
|------|---------------------|-------------------------|
| `.references/context-engineering/skills/bdi-mental-states/SKILL.md` | BDI taxonomy as conceptual frame; T2B2T pipeline principle; gotchas 2/4/5/6/7 | Bulk of skill is RDF/Turtle/SPARQL/SEMAS-specific; low audience breadth |
| `.references/context-engineering/researcher/llm-as-a-judge.md` | 4-gate/4-dimension gatekeeper scoring template | CE-domain criteria must be replaced; not a self-contained SOP |
| `.references/context-engineering/skills/context-degradation/references/patterns.md` | Alert thresholds (70% warning / 90% critical); truncation priority order (5 categories) | Python class bodies assume access to raw attention weights unavailable on hosted APIs |
| `.references/context-engineering/skills/context-compression/references/evaluation-framework.md` | Probe types (recall/artifact/continuation/decision); 0–5 rubrics; "artifact trail is universally weak" finding | Specific benchmark scores will date; retain ranking only |
| `.references/context-engineering/examples/llm-as-judge-skills/prompts/research/research-synthesis-prompt.md` | Seven-section synthesis framework; Gaps/Limitations and Source Quality Assessment sections | Worked example is LLM-evaluation-specific; Handlebars syntax is not portable |
| `.references/context-engineering/skills/filesystem-context/references/implementation-patterns.md` | Conceptual pattern names; token-accounting benchmarks; `PreferenceStore` self-modification guard | Python class implementations are scaffolding, not portable |
| `.references/context-engineering/skills/memory-systems/references/implementation.md` | Architecture decisions (vector+graph tiers, temporal scoping, consolidation trigger) | NumPy/SDK code; `np.random.seed(hash(text))` is a deterministic pseudo-embedding placeholder, not real code |
| `.references/context-engineering/examples/digital-brain-skill/identity/voice.md` | Five-axis attribute table; "Never Use" deny-list section structure | Persona-specific content must be blanked; value is purely the template shape |
| `.references/context-engineering/examples/llm-as-judge-skills/tools/index.md` | Three interaction patterns (sequential, fan-out, iterative refinement) | Specific tool names and agent capability lists are project-specific |

---

## 6. Cross-Cutting Protocol Primitives

Patterns that appear independently in two or more files, confirming they are cross-cutting design principles rather than file-local opinions.

### P1. 70–80% Context Utilisation Compaction Trigger
**Appears in:** `.references/context-engineering/skills/context-fundamentals/SKILL.md`, `.references/context-engineering/skills/context-compression/SKILL.md`, `.references/context-engineering/skills/context-optimization/SKILL.md`, `.references/context-engineering/skills/context-degradation/references/patterns.md`, `.references/context-engineering/skills/memory-systems/SKILL.md`  
**Protocol:** Trigger compaction, masking, or consolidation when context reaches roughly 70–80% of the window limit rather than waiting for 90%+. Under forced late compaction, prefer a separate clean-context model call.

### P2. U-Curve Placement Rule
**Appears in:** `.references/context-engineering/skills/context-fundamentals/SKILL.md`, `.references/context-engineering/skills/context-degradation/SKILL.md`, `.references/context-engineering/skills/memory-systems/SKILL.md`  
**Protocol:** Keep safety-critical instructions and retrievals near the start or end of context; avoid burying them mid-window where recall degrades.

### P3. Pairwise Position-Swap & Consistency Checks
**Appears in:** `.references/context-engineering/skills/advanced-evaluation/SKILL.md`, `.references/context-engineering/examples/llm-as-judge-skills/prompts/evaluation/pairwise-comparison-prompt.md`, `.references/context-engineering/examples/llm-as-judge-skills/tools/evaluation/pairwise-compare.md`  
**Protocol:** Run paired evaluations with swapped ordering, reconcile disagreements, and expose an explicit consistency flag before finalising a verdict.

### P4. Tool Consolidation & Description-as-Prompt Engineering
**Appears in:** `.references/context-engineering/skills/tool-design/SKILL.md`, `.references/context-engineering/skills/multi-agent-patterns/SKILL.md`, `.references/context-engineering/skills/project-development/SKILL.md`  
**Protocol:** Treat descriptions as model-facing prompts, consolidate overlapping tools, and iterate descriptions using observed failure telemetry rather than one-shot drafting.

### P5. Filesystem Offload & Progressive Disclosure
**Appears in:** `.references/context-engineering/skills/filesystem-context/SKILL.md`, `.references/context-engineering/docs/agentskills.md`, `.references/context-engineering/template/SKILL.md`  
**Protocol:** Persist bulky artefacts on disk, load `references/` files just-in-time, and keep primary `SKILL.md` bodies within explicit token ceilings.

### P6. Evaluation Budgeting & Rubric Discipline
**Appears in:** `.references/context-engineering/skills/evaluation/SKILL.md`, `.references/context-engineering/skills/advanced-evaluation/SKILL.md`, `.references/context-engineering/skills/context-compression/SKILL.md`  
**Protocol:** Allocate evaluation effort using the dominant-variance decomposition for agent regressions, pair rubrics with per-dimension failure gates, and apply probe-based scoring when validating summarisation quality.

---

## 7. Default Recommendation

Ship the Tier 1 ranked list in §5 first—especially `.references/context-engineering/skills/context-compression/SKILL.md`, `.references/context-engineering/examples/llm-as-judge-skills/prompts/evaluation/direct-scoring-prompt.md`, `.references/context-engineering/skills/context-optimization/SKILL.md`, `.references/context-engineering/skills/context-fundamentals/SKILL.md`, `.references/context-engineering/skills/tool-design/SKILL.md`, `.references/context-engineering/skills/evaluation/SKILL.md`, `.references/context-engineering/template/SKILL.md`, `.references/context-engineering/skills/filesystem-context/SKILL.md`, `.references/context-engineering/skills/project-development/SKILL.md`, and `.references/context-engineering/skills/advanced-evaluation/SKILL.md`—applying the strip guidance catalogued in §3–§4. Layer Tier 2/3 fragments only after those cores land, and keep BDI, MiniMax/Tinker harnesses, or Digital Brain layouts behind explicit feature flags.

---

## 8. Structural Patterns

### S1 — YAML Frontmatter plus Activation + Gotchas Spine
`.references/context-engineering/template/SKILL.md` and `.references/context-engineering/CLAUDE.md` encode the same spine: structured frontmatter, explicit activation cues, and a mandatory gotchas block for highest-signal warnings.

### S2 — Reference Fan-Out Under `skills/*/references/`
Each portable skill keeps deep dives in sibling `references/` files so the parent `SKILL.md` in that skill's directory (for example `.references/context-engineering/skills/context-fundamentals/SKILL.md`) stays under the ~500-line ceiling while preserving benchmarks on demand.

### S3 — Inline Quantified Thresholds
Thresholds such as 60–70% effective capacity, 70–80% compaction triggers, 15× multi-agent economics, and the 95% evaluation variance split remain in the primary narrative (`.references/context-engineering/skills/context-fundamentals/SKILL.md`, `.references/context-engineering/skills/evaluation/SKILL.md`) instead of hiding them in appendices.

### S4 — Dual-Mode Skills (Procedure + Reference Layer)
`.references/context-engineering/skills/context-compression/SKILL.md`, `.references/context-engineering/skills/evaluation/SKILL.md`, and `.references/context-engineering/skills/project-development/SKILL.md` pair executable sequences with encyclopaedic reference material so teams can skim or study without forking the repository layout.

### S5 — Token-Budget Self-Annotations
Authoring notes across `.references/context-engineering/skills/context-fundamentals/SKILL.md`, `.references/context-engineering/skills/tool-design/SKILL.md`, and `.references/context-engineering/skills/memory-systems/SKILL.md` document their own loading cost so orchestrators can defer reads until needed.

### S6 — Examples Tree Isolation
`.references/context-engineering/examples/llm-as-judge-skills/` keeps runnable TypeScript/AI SDK scaffolding separate from the framework-agnostic cores, enabling copy/paste starter kits without contaminating portable prose.

### S7 — Skill Quality Meta Standards
`.references/context-engineering/docs/agentskills.md` and `.references/context-engineering/docs/skills-improvement-analysis.md` (internal) document checklist-backed authoring standards—use the former, ignore the latter for extraction.

---

## 9. Evidence

All citations are directly traceable to `.plans/audits/context-engineering/raw-findings.md`. No inference has been made from outside that document.

> **[E1]** — "compaction trigger at 70–80 % utilisation; sub-agent return budget 1 K–2 K tokens; middle-of-context recall drops to 76–82 % vs 85–95 % at ends"  
> Source: `.references/context-engineering/skills/context-fundamentals/SKILL.md` → Steps/contract field.

> **[E2]** — "Trigger at 70–80% context utilization; default to sliding window + structured summaries for coding agents."  
> Source: `.references/context-engineering/skills/context-compression/SKILL.md` → Steps/contract field.

> **[E3]** — "Priority-ordered four-step framework — (1) KV-cache optimisation first (zero quality risk), (2) observation masking (largest capacity gain), (3) compaction at ≥ 70 % utilisation (lossy; apply after masking), (4) context partitioning when estimated context exceeds 60 % of window limit."  
> Source: `.references/context-engineering/skills/context-optimization/SKILL.md` → Steps/contract field.

> **[E4]** — "Includes concrete token-cost benchmarks (15× multiplier)."  
> Source: `.references/context-engineering/skills/multi-agent-patterns/SKILL.md` → Steps/contract field.

> **[E5]** — "The 95% variance finding (80% tokens / ~10% tool calls / ~5% model) is a calibrated benchmark with direct design implications"  
> Source: `.references/context-engineering/skills/evaluation/SKILL.md` → Reason field.

> **[E6]** — ""description as prompt, not documentation" framing — the most important reframe in the skill; (b) consolidation principle with Vercel 17→2 benchmark"  
> Source: `.references/context-engineering/skills/tool-design/SKILL.md` → Notes field.

> **[E7]** — **"invalidate but do not discard" consolidation rule** — prevents temporal queries from losing historical state.  
> Source: `.references/context-engineering/skills/memory-systems/SKILL.md` → Notes field.

> **[E8]** — "Bias mitigation protocol — position swap (2-pass + consistency check), length-neutrality instructions, separate generator/evaluator models"  
> Source: `.references/context-engineering/skills/advanced-evaluation/SKILL.md` → Steps/contract field.

> **[E9]** — "eval-driven development sequence (run without skill → document failures → create 3 evals → establish baseline → write minimal instructions → iterate)"  
> Source: `.references/context-engineering/docs/agentskills.md` → Steps/contract field.

> **[E10]** — "(a) "context isolation as primary purpose, not role anthropomorphism" design principle; (b) the 15× token cost benchmark with variance breakdown"  
> Source: `.references/context-engineering/skills/multi-agent-patterns/SKILL.md` → Notes field.

> **[E11]** — "Skill Authoring Rules block (8 numbered rules) and "Key Design Principles" block are genuinely portable — they encode craft knowledge about writing LLM skill files that applies to any skill-authoring context."  
> Source: `.references/context-engineering/CLAUDE.md` → Reason field.

> **[E12]** — "Nearly every sentence references repo-specific internals: named skills (`context-compression`, `multi-agent-patterns`, etc.), commit hashes (`c847b20`), specific directory structures (`scripts/`, `references/`, `sandbox/`), score statistics computed over this repo's 13 files"  
> Source: `.references/context-engineering/docs/skills-improvement-analysis.md` → Reason field.

> **[E13]** — "Key portable ideas — (1) always swap positions in production to detect position bias, (2) return `positionConsistency` flag — downgrade to TIE when passes disagree"  
> Source: `.references/context-engineering/examples/llm-as-judge-skills/tools/evaluation/pairwise-compare.md` → Notes field.

> **[E14]** — "The four prerequisites (high doc quality, sufficient model capability, safety constraints permit, navigable domain) and four failure conditions (messy data layer, required specialist knowledge, compliance restrictions, genuinely complex workflows) together form a ready-made decision matrix"  
> Source: `.references/context-engineering/skills/tool-design/references/architectural_reduction.md` → Notes field.

> **[E15]** — "Approximately 1 800 tokens — suitable as a loaded reference rather than always-on context" *and* "approximately 2,200 tokens. Best loaded as a reference" *and* "Approximately 2,400 tokens — suitable as a loaded reference rather than always-on context"  
> Source: `.references/context-engineering/skills/context-fundamentals/SKILL.md`, `.references/context-engineering/skills/tool-design/SKILL.md`, `.references/context-engineering/skills/memory-systems/SKILL.md` → Notes field; structural pattern documented in `.plans/audits/context-engineering/role-to-sop-audit-1.md` §8**S5**.

---

*All claims in this report are operationally derived from `.plans/audits/context-engineering/raw-findings.md`. No inference has been made from outside that document.*

