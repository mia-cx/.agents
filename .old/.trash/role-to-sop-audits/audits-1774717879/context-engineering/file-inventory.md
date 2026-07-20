# File Inventory — context-engineering

Repo root: `.references/context-engineering`

---

## Root / Meta

CLAUDE.md | config | Skill-authoring rules and design principles injected into Claude when editing this repo (500-line limit, YAML frontmatter, third-person, token-conscious, Gotchas section required).
SKILL.md | skill | Collection-level skill map: activation triggers and procedural summaries for all 13 sub-skills.
template/SKILL.md | sop | Canonical template for creating new skills — defines required sections, authoring heuristics, and quality gates.

---

## Plugin Manifests

.claude-plugin/marketplace.json | config | Claude Code marketplace manifest registering all 13 skills as a single `context-engineering` plugin with progressive disclosure.
.plugin/plugin.json | config | Open Plugins v2.0.0 manifest for platform-agnostic skill distribution.

---

## Core Skills (skills/)

skills/context-fundamentals/SKILL.md | skill | Encodes four context assembly principles (informativity, position-aware placement, progressive disclosure, iterative curation) with U-curve attention thresholds.
skills/context-degradation/SKILL.md | skill | Defines five degradation patterns (lost-in-middle, poisoning, distraction, confusion, clash) with per-pattern detection signals and mitigation procedures.
skills/context-compression/SKILL.md | skill | Prescribes three compression strategies (anchored iterative, opaque, regenerative) and reframes optimization target as tokens-per-task, not tokens-per-request.
skills/context-optimization/SKILL.md | skill | Ordered four-strategy procedure (KV-cache → masking → compaction → partitioning) for extending effective context capacity.
skills/multi-agent-patterns/SKILL.md | skill | Defines three coordination architectures (supervisor, peer-to-peer, hierarchical) with context isolation — not role simulation — as the primary rationale for sub-agents.
skills/memory-systems/SKILL.md | skill | Memory selection procedure across five frameworks (Mem0, Zep/Graphiti, Letta, LangMem, Cognee) with benchmark-driven guidance for when to add structure.
skills/tool-design/SKILL.md | skill | Tool design procedure: consolidation principle, tool-as-contract model, description-as-system-prompt, namespacing, error contract, and response format options.
skills/filesystem-context/SKILL.md | skill | Diagnoses four context failure modes and prescribes filesystem patterns (scratchpad, plan persistence, sub-agent comms via shared files, dynamic discovery).
skills/hosted-agents/SKILL.md | skill | Three-layer hosted agent architecture (sandbox, API, clients) with warm pool, snapshot persistence, and self-spawning sub-agents.
skills/evaluation/SKILL.md | skill | Agent evaluation procedure: multi-dimensional rubrics, outcome-not-path focus, LLM-as-judge for scale, human review for edge cases.
skills/advanced-evaluation/SKILL.md | skill | LLM-as-judge taxonomy: direct scoring vs. pairwise comparison selection criteria, bias catalogue, calibration and position-swap debiasing procedures.
skills/project-development/SKILL.md | skill | Task-model fit analysis gate, staged idempotent pipeline architecture (acquire → prepare → process → parse → render), manual-prototype-first methodology.
skills/bdi-mental-states/SKILL.md | skill | Procedure for transforming RDF context into BDI mental state representations (beliefs, desires, intentions) with formal ontology patterns.

---

## Skill Reference Files (skills/*/references/)

skills/context-fundamentals/references/context-components.md | sop | Detailed engineering patterns for system prompt structure, section organization, and context assembly sequencing.
skills/context-degradation/references/patterns.md | sop | Extended detection signals and recovery procedures for each of the five degradation patterns.
skills/context-compression/references/evaluation-framework.md | sop | Framework for measuring compression quality: information preservation metrics, probe-based evaluation, artifact trail integrity checks.
skills/context-optimization/references/optimization_techniques.md | sop | Implementation patterns for KV-cache reordering, observation masking, compaction triggers, and context partitioning thresholds.
skills/multi-agent-patterns/references/frameworks.md | sop | LangGraph, AutoGen, and CrewAI implementation patterns for supervisor, swarm, and hierarchical architectures with benchmark data.
skills/memory-systems/references/implementation.md | sop | Implementation guide for memory layers, vector store integration, temporal knowledge graph construction, and benchmark evaluation setup.
skills/tool-design/references/best_practices.md | sop | Extended tool description writing guidelines, parameter naming conventions, error contract specification, and edge case handling.
skills/tool-design/references/architectural_reduction.md | sop | Step-by-step procedure for reducing tool set size through consolidation, overlap elimination, and ambiguity resolution.
skills/filesystem-context/references/implementation-patterns.md | sop | Concrete filesystem patterns: scratchpad setup, plan file schemas, sub-agent handoff via files, grep-structured retrieval.
skills/hosted-agents/references/infrastructure-patterns.md | sop | Warm pool management, sandbox lifecycle, session snapshot strategies, and multiplayer state-sharing architecture.
skills/evaluation/references/metrics.md | sop | Metric definitions, scoring rubric templates, and acceptable threshold ranges for multi-dimensional agent evaluation.
skills/advanced-evaluation/references/bias-mitigation.md | sop | Procedures for detecting and correcting position bias, verbosity bias, and self-enhancement bias in LLM judge outputs.
skills/advanced-evaluation/references/evaluation-pipeline.md | sop | End-to-end pipeline specification for running LLM-as-judge evaluations at scale with consistency controls.
skills/advanced-evaluation/references/implementation-patterns.md | sop | Implementation patterns for evaluation workflow composition, batching, and result aggregation.
skills/advanced-evaluation/references/metrics-guide.md | sop | Guide for selecting, calibrating, and validating evaluation metrics for different task types.
skills/project-development/references/pipeline-patterns.md | sop | Staged idempotent pipeline implementation patterns with filesystem state management and caching strategies.
skills/bdi-mental-states/references/bdi-ontology-core.md | sop | Core BDI ontology definitions, endurant/perdurant distinction, and mental state modeling procedure.
skills/bdi-mental-states/references/framework-integration.md | sop | Integration patterns for applying BDI models in SEMAS, JADE, and JADEX multi-agent frameworks.
skills/bdi-mental-states/references/sparql-competency.md | sop | SPARQL query patterns for BDI knowledge graph retrieval and competency verification.

---

## Example: llm-as-judge-skills (examples/llm-as-judge-skills/)

examples/llm-as-judge-skills/agents/orchestrator-agent/orchestrator-agent.md | agent | Orchestrator agent definition: task decomposition, specialist delegation, dependency management, and coherent synthesis system prompt.
examples/llm-as-judge-skills/agents/evaluator-agent/evaluator-agent.md | agent | Evaluator agent definition: direct scoring and pairwise comparison with configurable rubrics via LLM-as-judge pattern.
examples/llm-as-judge-skills/agents/research-agent/research-agent.md | agent | Research agent definition: multi-step research with query decomposition, source verification, and citation tracking.
examples/llm-as-judge-skills/agents/index.md | config | Agent registry: capabilities, routing guidance, and tool assignments for each specialized agent.
examples/llm-as-judge-skills/prompts/agent-system/orchestrator-prompt.md | prompt | Orchestrator system prompt template: task decomposition, agent assignment, dependency tracking, error handling instructions.
examples/llm-as-judge-skills/prompts/evaluation/direct-scoring-prompt.md | prompt | Direct scoring prompt template: evidence-identification-first protocol before score assignment with rubric application.
examples/llm-as-judge-skills/prompts/evaluation/pairwise-comparison-prompt.md | prompt | Pairwise comparison prompt template: independent analysis → direct comparison → confidence-rated determination protocol.
examples/llm-as-judge-skills/prompts/research/research-synthesis-prompt.md | prompt | Research synthesis prompt template: theme identification, consensus/disagreement mapping, actionable insight extraction.
examples/llm-as-judge-skills/prompts/index.md | config | Prompt registry: categories, usage routing, and which agents/tools consume each prompt.
examples/llm-as-judge-skills/tools/evaluation/direct-score.md | prompt | Tool definition for direct response scoring: description injected into agent context to steer when/how scoring is invoked.
examples/llm-as-judge-skills/tools/evaluation/generate-rubric.md | prompt | Tool definition for automated rubric generation with per-score-level description requirements.
examples/llm-as-judge-skills/tools/evaluation/pairwise-compare.md | prompt | Tool definition for pairwise comparison: use-case guidance (subjective evaluations), input schema, and output contract.
examples/llm-as-judge-skills/tools/orchestration/delegate-to-agent.md | prompt | Tool definition for task delegation: context passing protocol, result collection, and error propagation handling.
examples/llm-as-judge-skills/tools/research/web-search.md | prompt | Tool definition for web search: structured result schema and usage constraints injected into agent context.
examples/llm-as-judge-skills/tools/research/read-url.md | prompt | Tool definition for URL content extraction with structured metadata output.
examples/llm-as-judge-skills/tools/index.md | config | Tool registry: categories, approval requirements, and agent-tool assignments.
examples/llm-as-judge-skills/skills/llm-evaluator/llm-evaluator.md | skill | LLM-as-judge foundational skill: scoring approach selection, baseline targets, bias awareness, and calibration guidance.
examples/llm-as-judge-skills/skills/tool-design/tool-design.md | skill | Tool design principles (single responsibility, description clarity, error contracts) adapted for the llm-as-judge project.
examples/llm-as-judge-skills/skills/context-fundamentals/context-fundamentals.md | skill | Context window management and signal-to-noise principles adapted for the llm-as-judge project context.

---

## Example: digital-brain-skill (examples/digital-brain-skill/)

examples/digital-brain-skill/SKILL.md | skill | Digital brain personal OS skill: progressive module loading, activation triggers per task type (content, contacts, tasks, weekly review).
examples/digital-brain-skill/AGENT.md | agent | Claude project rules: always read voice.md before writing, append-only JSONL convention, cross-module reference protocol.
examples/digital-brain-skill/agents/AGENTS.md | skill | Automation scripts module instructions: script inventory, run frequency, and orchestration guidance for recurring agent tasks.
examples/digital-brain-skill/identity/IDENTITY.md | skill | Identity module instructions: load order for voice/brand/values/bio files and when to reference each for external-facing tasks.
examples/digital-brain-skill/identity/voice.md | prompt | Voice and tone guide template: personality attributes, signature phrases, forbidden patterns, and platform-specific register rules.
examples/digital-brain-skill/identity/prompts/content-generation.xml | prompt | XML prompt template for content generation: voice pre-check protocol, platform-specific format rules, engagement hook requirements.
examples/digital-brain-skill/identity/prompts/reply-generator.xml | prompt | XML prompt template for reply generation: relationship-aware tone matching and authentic voice constraints.
examples/digital-brain-skill/operations/OPERATIONS.md | skill | Operations module instructions: todo/goal/meeting/metrics workflow definitions and review cadence procedures.
examples/digital-brain-skill/content/CONTENT.md | skill | Content hub module instructions: idea capture, drafting, calendar scheduling, and post-publish tracking workflow.
examples/digital-brain-skill/knowledge/KNOWLEDGE.md | skill | Knowledge base module instructions: bookmark schema, research file structure, learning goal tracking conventions.
examples/digital-brain-skill/network/NETWORK.md | skill | Network module instructions: contact schema, interaction logging, relationship tier definitions, and outreach workflow.
examples/digital-brain-skill/content/templates/linkedin-post.md | prompt | LinkedIn post template: hook/body/CTA structure with engagement metadata and formatting constraints.
examples/digital-brain-skill/content/templates/newsletter.md | prompt | Newsletter template: issue metadata, section structure, and editorial conventions for recurring publication.
examples/digital-brain-skill/content/templates/thread.md | prompt | Twitter/X thread template: hook/body/CTA/engagement structure with per-tweet character discipline.

---

## Example: book-sft-pipeline (examples/book-sft-pipeline/)

examples/book-sft-pipeline/SKILL.md | skill | End-to-end book-to-SFT dataset pipeline: ePub extraction, segmentation strategy selection, Tinker format specification, and LoRA training configuration guidance.

---

## Example: interleaved-thinking (examples/interleaved-thinking/)

examples/interleaved-thinking/SKILL.md | skill | Reasoning trace debug/optimization procedure: capture → analyse failure patterns → generate prompt fixes using interleaved thinking.
examples/interleaved-thinking/generated_skills/comprehensive-research-agent/SKILL.md | skill | Research agent reliability protocol: validation checkpoints, error recovery procedures, and reasoning transparency requirements for multi-tool tasks.

---

## Researcher Prompt

researcher/llm-as-a-judge.md | prompt | System prompt for a principal research curator agent: domain scope, evaluation criteria, and output format for identifying implementable context-engineering primitives.

---

## Docs (behaviour-shaping)

docs/agentskills.md | sop | Official Agent Skills format specification: folder structure conventions, YAML frontmatter requirements, distribution model, and platform integration rules.
docs/skills-improvement-analysis.md | sop | Meta-analysis of skill quality patterns with improvement procedures derived from Anthropic's guidelines (description trigger format, Gotchas prioritisation, token discipline).
