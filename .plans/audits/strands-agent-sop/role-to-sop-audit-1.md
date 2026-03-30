# Role-to-SOP Audit — strands-agents/agent-sop

**Audited repo**: `strands-agents/agent-sop`
**Findings source**: `raw-findings.md` (same directory)
**Date**: 2026-03-28

---

## 1. Repo Overview

The `strands-agents/agent-sop` repo is a structured collection of AI-agent SOPs published as a Claude/Cursor plugin and a Python package (`strands-agents-sops`). It ships six domain `.sop.md` workflow files (`code-assist`, `pdd`, `codebase-summary`, `code-task-generator`, `eval`, and `agent-sop-author`), a bash linter (`.references/strands-agent-sop/skills/agent-sop-author/validate-sop.sh`), a meta-specification (`.references/strands-agent-sop/spec/agent-sops-specification.md`), format-governance rules (`.references/strands-agent-sop/rules/agent-sop-format.md`), an `.references/strands-agent-sop/AGENTS.md` schema reference, and plugin manifests. All SOPs follow a shared schema: RFC 2119 keywords (MUST / SHOULD / MAY), typed parameters with a single-prompt acquisition block, numbered steps each with an explicit `**Constraints:**` sub-section, and optional Examples and Troubleshooting sections. The linter (`.references/strands-agent-sop/skills/agent-sop-author/validate-sop.sh`) encodes this schema as machine-checkable assertions. Meta-files (`.references/strands-agent-sop/spec/agent-sops-specification.md`, `.references/strands-agent-sop/rules/agent-sop-format.md`, `.references/strands-agent-sop/AGENTS.md`, `.references/strands-agent-sop/skills/agent-sop-author/SKILL.md`) together form a self-documenting authoring system. Plugin manifests (`.references/strands-agent-sop/.claude-plugin/plugin.jsonon` and `.references/strands-agent-sop/.claude-plugin/marketplace.jsonon`) handle distribution and registration only. The repo is ecosystem-specific in its toolchain (strands Evals SDK, Amazon Bedrock, Kiro IDE, `uv`) but contains universally transferable workflow contracts and protocol patterns. The primary portable value lies in the six domain SOPs and the RFC 2119 constraint convention, not in the packaging infrastructure.

---

## 2. Content Summary

| File | Type | Portable? |
|------|------|-----------|
| `.references/strands-agent-sop/rules/agent-sop-format.md` | Meta-SOP / format governance | Partially |
| `.references/strands-agent-sop/skills/agent-sop-author/validate-sop.sh` | Shell linter | No |
| `.references/strands-agent-sop/skills/agent-sop-author/SKILL.md` | Meta-skill (SOP authoring) | Yes |
| `.references/strands-agent-sop/spec/agent-sops-specification.md` | Meta-specification / schema grammar | Partially |
| `.references/strands-agent-sop/agent-sops/code-assist.sop.md` | Domain SOP (TDD code implementation) | Yes |
| `.references/strands-agent-sop/agent-sops/code-task-generator.sop.md` | Domain SOP (task spec generation) | Partially |
| `.references/strands-agent-sop/agent-sops/codebase-summary.sop.md` | Domain SOP (codebase documentation) | Partially |
| `.references/strands-agent-sop/agent-sops/pdd.sop.md` | Domain SOP (Prompt-Driven Development) | Partially |
| `.references/strands-agent-sop/agent-sops/eval.sop.md` | Domain SOP (agent evaluation pipeline) | Partially |
| `.references/strands-agent-sop/AGENTS.md` | Project docs / SOP schema reference | Partially |
| `.references/strands-agent-sop/.claude-plugin/plugin.jsonon` | Plugin manifest | No |
| `.references/strands-agent-sop/.claude-plugin/marketplace.jsonon` | Distribution manifest | No |

**Counts**: 12 files audited. 1 fully portable, 7 partially portable (require strip), 4 non-portable (no extractable SOP content).

---

## 3. SOP Split — Port vs. Leave Out

### Port (with stripping applied)

| File | Rationale |
|------|-----------|
| `.references/strands-agent-sop/skills/agent-sop-author/SKILL.md` | Self-contained meta-skill; RFC 2119 pattern, parameter-acquisition block, and section checklist are fully system-agnostic. Strongest format-governance artefact in the repo. |
| `.references/strands-agent-sop/agent-sops/code-assist.sop.md` | Most complete domain SOP. Interactive/auto mode bifurcation pattern, strict TDD sequencing, and "only interrupt when genuinely blocked" rule are all portable. |
| `.references/strands-agent-sop/agent-sops/pdd.sop.md` | High-quality planning SOP. One-question-at-a-time clarification loop and verbatim implementation-plan prompt snippet are directly extractable. |
| `.references/strands-agent-sop/agent-sops/codebase-summary.sop.md` | Anti-pattern constraints in Step 5 (no volatile metrics, no fabricated acronyms, no common build commands, preserve manually-maintained sections) are high-signal and rarely stated this explicitly. |
| `.references/strands-agent-sop/agent-sops/eval.sop.md` | Anti-simulation checklist, phase-dependency management pattern, and eval-plan/eval-report templates are portable. Long but structured; primary extraction targets are the templates and anti-simulation rules. |
| `.references/strands-agent-sop/agent-sops/code-task-generator.sop.md` | Description-mode workflow (analysis → GWT criteria → approval gate → file generation) is fully portable; the Code Task Format Specification is directly adoptable. |
| `.references/strands-agent-sop/rules/agent-sop-format.md` | RFC 2119 convention and negative-constraint-with-context rule are top-tier portable guidance. Strip Cursor wrapper before porting. |
| `.references/strands-agent-sop/spec/agent-sops-specification.md` | The RFC 2119 constraint-authoring pattern and parameter-acquisition guidance (single prompt, confirm before proceeding) are portable schema building blocks. |

### Leave Out

| File | Rationale |
|------|-----------|
| `.references/strands-agent-sop/skills/agent-sop-author/validate-sop.sh` | Tooling artefact; not a SOP. Schema contract it encodes is already documented in `.references/strands-agent-sop/skills/agent-sop-author/SKILL.md` and `.references/strands-agent-sop/spec/agent-sops-specification.md`. |
| `.references/strands-agent-sop/.claude-plugin/plugin.jsonon` | Pure registration metadata; zero workflow content. |
| `.references/strands-agent-sop/.claude-plugin/marketplace.jsonon` | Distribution manifest; zero workflow content. |
| `.references/strands-agent-sop/AGENTS.md` | Reinforces schema already in `.references/strands-agent-sop/skills/agent-sop-author/SKILL.md`; unique signal is only the RFC 2119 keyword table (already covered). Skip to avoid duplication. |

---

## 4. Per-SOP Table

> **Column definitions**
> - **Quality bar**: criteria for accepting this SOP as correctly applied
> - **Escalation**: conditions under which the SOP mandates user check-in
> - **Strip**: what must be removed before porting

### `.references/strands-agent-sop/skills/agent-sop-author/SKILL.md`

| Field | Detail |
|-------|--------|
| **Source file** | `.references/strands-agent-sop/skills/agent-sop-author/SKILL.md` |
| **Trigger** | Authoring, updating, or validating an agent SOP or multi-step workflow document |
| **Steps/contract** | (1) Check for `agent-sops/` directory; (2) name file `<kebab-case>.sop.md`; (3) write sections in order — Overview → Parameters (with acquisition-constraints block) → Steps (numbered, each with RFC 2119 Constraints) → Examples → Troubleshooting; (4) run validation; (5) fix all errors before proceeding |
| **Quality bar** | All required sections present; every step has a `**Constraints:**` block; every MUST NOT includes a `because/since/as` rationale; all required parameters solicited in a single prompt |
| **Escalation** | Escalate if SOP target domain is ambiguous; confirm format choices before generating output |
| **Strip** | `.references/strands-agent-sop/skills/agent-sop-author/validate-sop.sh` script reference (replace with generic checklist); multi-modal distribution mention (MCP/Python/Skills); Mermaid flowchart (decorative); verbose Before/After pattern block (condense to quick-reference table) |
| **Notes** | Self-referential — defines the format used by other SOPs. The parameter-acquisition constraints block should be extracted as a reusable snippet referenced by downstream skills. |

---

### `.references/strands-agent-sop/agent-sops/code-assist.sop.md`

| Field | Detail |
|-------|--------|
| **Source file** | `.references/strands-agent-sop/agent-sops/code-assist.sop.md` |
| **Trigger** | Implementing a feature, bug fix, or utility function using TDD in any codebase |
| **Steps/contract** | (1) Setup — validate/create docs directory, discover instruction files, create `context.md` and `progress.md`; (2) Explore — analyse requirements, map dependencies, compile code-context document; (3) Plan — design test strategy with explicit input/output pairs, save to `plan.md`; (4) Code — implement ALL tests first (RED), implement code to pass (GREEN), refactor, validate all tests pass; (5) Commit — conventional commit message, stage all relevant files, no push |
| **Quality bar** | All tests pass before any commit; no implementation code written before test suite exists; build output passes grep for pass/fail markers; commit message follows conventional format |
| **Escalation** | In interactive mode: check in at each phase gate. In auto mode: only seek user input when genuinely blocked; never interrupt for routine decisions |
| **Strip** | `CODEASSIST.md` specific reference (generalise to "project instruction file at repo root"); `.agents/scratchpad/{project_name}` default path; "🤖 Assisted by code-assist SOP" commit footer; specific `find` command for instruction-file discovery; multi-package coordination troubleshooting block; internal step-numbering reference error (Step 4.4 → Step 5.2) |
| **Notes** | Interactive/auto mode bifurcation is the standout portable innovation — define both modes once in a `## Mode Behavior` section, reference throughout. "Implement ALL tests before ANY implementation code" and "only seek user input when stuck" are stronger than generic TDD guidance. |

---

### `.references/strands-agent-sop/agent-sops/pdd.sop.md`

| Field | Detail |
|-------|--------|
| **Source file** | `.references/strands-agent-sop/agent-sops/pdd.sop.md` |
| **Trigger** | User presents a rough idea for a feature, tool, or system and wants a full design document with an actionable implementation plan |
| **Steps/contract** | (1) Acquire `rough_idea` (required), `project_name`, `project_dir` (optional) in a single prompt; (2) create directory scaffold (`rough-idea.md`, `idea-honing.md`, `research/`, `design/`, `implementation/`); (3) ask preferred starting point (requirements vs. research); (4) one-question-at-a-time clarification loop — append each Q+A to `idea-honing.md` before asking the next, loop until user confirms complete; (5) research phase — propose plan, document findings with diagrams; (6) iteration checkpoint — summarise, offer to iterate or proceed; (7) produce `design/detailed-design.md` with eight required sections; (8) produce `implementation/plan.md` as numbered steps each with objective, guidance, test requirements, integration notes, and a Demo description; no standalone test-only steps; (9) produce `summary.md` |
| **Quality bar** | Each implementation step has a Demo description and produces a demoable increment; no step is solely dedicated to testing; design document includes all eight required sections; each Q+A appended to `idea-honing.md` before next question |
| **Escalation** | After requirements clarification (confirm complete before proceeding); before writing design doc (user review required); after presenting design (confirm before writing plan) |
| **Strip** | `/context add {project_dir}/**/*.md` Kiro IDE command (replace with generic "ensure project files are in context"); `search_internal_code` and `read_internal_website` tool names; default `project_dir` value of `.agents/planning/{project_name}` |
| **Notes** | One-question-at-a-time clarification loop (Step 4) is the single highest-value portable pattern — prevents user overload and produces a traceable Q+A file. The implementation-plan prompt snippet is copy-pasteable as a reusable skill fragment. |

---

### `.references/strands-agent-sop/agent-sops/codebase-summary.sop.md`

| Field | Detail |
|-------|--------|
| **Source file** | `.references/strands-agent-sop/agent-sops/codebase-summary.sop.md` |
| **Trigger** | User wants to generate codebase documentation for AI assistants, create/refresh an `AGENTS.md`, audit a repo, or summarise a codebase for onboarding |
| **Steps/contract** | (1) Validate codebase path, create `output_dir`; (2) analyse structure — packages, components, architecture, interfaces; (3) generate `index.md` plus six artifact files (architecture, components, interfaces, data_models, workflows, dependencies); (4) review for consistency and completeness, write `review_notes.md`; (5) if `consolidate=true`, generate per-target consolidated files — preserve manually-maintained sections, omit volatile metrics/fabricated acronyms/common commands; (6) summarise and advise on maintenance |
| **Quality bar** | No LoC counts or file-size figures; no fabricated acronyms; no generic build commands (e.g. `npm install`); manually-maintained sections preserved verbatim on refresh; all six artifact files present before consolidation step runs |
| **Escalation** | Confirm `output_dir` before writing; ask before overwriting existing consolidated files; flag if manually-maintained sections are detected during refresh |
| **Strip** | Default `output_dir` value `.agents/summary/` (make caller-supplied); Mermaid-only diagram constraint (relax to "prefer Mermaid"); specific AGENTS.md Custom Instructions HTML comment block (simplify to generic "preserve human-maintained sections" rule); six hardcoded artifact filenames in Step 3 (surface as defaults, not requirements) |
| **Notes** | Anti-pattern constraints in Step 5 are the highest-signal portable content. "Preserve manually-maintained sections" is a broadly applicable refresh-workflow rule, not limited to AGENTS.md. |

---

### `.references/strands-agent-sop/agent-sops/eval.sop.md`

| Field | Detail |
|-------|--------|
| **Source file** | `.references/strands-agent-sop/agent-sops/eval.sop.md` |
| **Trigger** | User wants to evaluate an AI agent — defining metrics, generating test cases, running evaluations, and producing an evidence-based report with prioritised recommendations |
| **Steps/contract** | (1) Setup — validate agent path, create `eval/` as sibling; (2) Planning — parse focus, analyse architecture, define measurable metrics, write `eval/eval-plan.md`; (3) Test data generation — generate JSONL test cases covering all scenarios, save to `eval/test-cases.jsonl`; (4) Execution — run pipeline against real agent (never mock), save to `eval/results/`, create `eval/README.md`; (5) Analysis — apply anti-simulation red-flag checks, perform success/failure analysis, generate prioritised recommendations (Critical / Quality / Enhancement), write `eval/eval-report.md`; (6) Completion — verify all artifacts in `eval/`, no eval files inside agent folder |
| **Quality bar** | Results show natural score variation; no identical metrics across cases; no 100% success rates on large sets; no keywords like "simulated"/"mocked"/"fake" in result data; all phases completed in order with phase-dependency validation |
| **Escalation** | Present options (not errors) when phase prerequisites are absent; suggest the logical next phase after each completion; block on missing eval plan before test generation; block on missing test cases before execution |
| **Strip** | Strands Evals SDK class names (Case, Experiment, OutputEvaluator, TrajectoryEvaluator, InteractionsEvaluator); Amazon Bedrock as default provider; `uv` toolchain references; Python 3.11+ hard requirement; context7 MCP hard-stop and fallback clone block; `requirements.txt` at repo root convention; AWS/Bedrock configuration assumptions |
| **Notes** | Three standout extractions: (a) anti-simulation red-flag checklist; (b) "MUST validate results are from real agent execution" constraint; (c) phase-dependency management pattern with graceful degradation. The two appendix templates (`eval-plan.md`, `eval-report.md`) are the most immediately reusable outputs. |

---

### `.references/strands-agent-sop/agent-sops/code-task-generator.sop.md`

| Field | Detail |
|-------|--------|
| **Source file** | `.references/strands-agent-sop/agent-sops/code-task-generator.sop.md` |
| **Trigger** | User wants to convert a vague task description into a structured, machine-readable task file with acceptance criteria, technical requirements, and metadata |
| **Steps/contract** | (1) Detect input mode (description text vs. plan file); (2) analyse input to extract requirements, complexity, tech stack; (3) structure requirements using Given-When-Then acceptance criteria; (4) present proposed task breakdown for explicit user approval before writing any files; (5) generate `.code-task.md` files with mandatory sections (Description, Background, Technical Requirements, Dependencies, Implementation Approach, Acceptance Criteria, Metadata); (6) report paths and suggest next steps |
| **Quality bar** | Task breakdown presented and approved before any file is written; every acceptance criterion in GWT format; no separate testing tasks — tests integrated into each functional task |
| **Escalation** | Mandatory approval gate at Step 4 — do not generate files until user explicitly approves task breakdown |
| **Strip** | All PDD-mode branches (step-folder naming, PDD checklist parsing, "next uncompleted step" logic); mandatory `Reference Documentation` section pointing to `planning/design/detailed-design.md`; hardcoded output path `.agents/tasks/{project_name}`; YYYY-MM-DD date-prefix naming convention; `step_number` parameter |
| **Notes** | Two standout portable principles: approval gate before file generation (low-cost safety pattern applicable to any file-generating SOP); "do not create separate test tasks" rule (prevents a common agent failure mode). GWT acceptance-criteria format is the strongest part of the output template. |

---

### `.references/strands-agent-sop/rules/agent-sop-format.md`

| Field | Detail |
|-------|--------|
| **Source file** | `.references/strands-agent-sop/rules/agent-sop-format.md` |
| **Trigger** | Creating a new SOP, auditing an existing SOP for format compliance, or onboarding contributors who will write SOPs |
| **Steps/contract** | (1) Name files in kebab-case; (2) include five canonical sections (Title+Overview, Parameters, Steps, Examples, Troubleshooting); (3) snake_case parameter names; (4) RFC 2119 keywords for all constraints; (5) every negative constraint must supply a `because/since/as` rationale clause; (6) ask all required parameters in one prompt; (7) save artifacts to specified paths |
| **Quality bar** | Every MUST NOT has a context clause; all five sections present; parameters in snake_case; file in kebab-case |
| **Escalation** | Escalate to document owner if section or constraint pattern is ambiguous |
| **Strip** | `<rule>` / `</rule>` XML wrapper; `globs`, `filters`, `actions`, `metadata` front-matter fields; Cursor "suggest" action wrapper; duplicate examples (collapse to one canonical copy) |
| **Notes** | "Negative constraints require context" rule is a standout portable principle that directly addresses a common LLM prompt failure mode. Consider promoting to a cross-cutting rule rather than embedding inside a format spec. |

---

### `.references/strands-agent-sop/spec/agent-sops-specification.md`

| Field | Detail |
|-------|--------|
| **Source file** | `.references/strands-agent-sop/spec/agent-sops-specification.md` |
| **Trigger** | Not an executable SOP; applies as reference schema when authoring any SOP or skill. Embedded Personalized Learning Curriculum example triggers when user wants a custom learning path from a stated goal, level, time commitment, and learning style |
| **Steps/contract** | Schema mandates: Title → Overview → Parameters (required/optional/default, snake_case) → numbered Steps (each with natural-language description + RFC 2119 **Constraints:** block) → optional Examples and Troubleshooting. Conditional logic expressed inline with explicit if/else constraint branches. Parameter-acquisition: ask all required params in a single prompt, support multiple input methods, confirm before proceeding |
| **Quality bar** | Every step constraint is specific and measurable; conditional branches fully specified; no ambiguous "should" where a MUST or MAY is intended |
| **Escalation** | Confirm parameter values before proceeding for any SOP that writes files |
| **Strip** | `.sop.md` file-extension convention; hardcoded output filenames in embedded curriculum example; "Agent Compatibility" and "Tool Integration" implementation notes; kebab-case naming convention (format preference, not substance) |
| **Notes** | Primary extraction value is the RFC 2119 constraint-authoring pattern and the parameter-acquisition guidance. The embedded curriculum SOP is a clean portable template for a learning-path task — could be extracted as a standalone skill. |

---

## 5. Portability Ranking

### High

| File | Reason |
|------|--------|
| `.references/strands-agent-sop/skills/agent-sop-author/SKILL.md` | Fully system-agnostic format conventions; no ecosystem dependencies after minor strip. Self-contained and immediately promotable. |
| `.references/strands-agent-sop/agent-sops/code-assist.sop.md` | Mode bifurcation pattern, TDD sequencing, and auto-mode interruption contract are portable without ecosystem coupling once path defaults and toolchain branding are stripped. |

### Medium

| File | Reason |
|------|--------|
| `.references/strands-agent-sop/agent-sops/pdd.sop.md` | Only three ecosystem-specific references (Kiro IDE command, two internal MCP tool names, one default path); core workflow and clarification-loop pattern are high-quality and portable. |
| `.references/strands-agent-sop/agent-sops/codebase-summary.sop.md` | Core six-step workflow and Step 5 anti-pattern constraints are portable; Mermaid-only and default-path constraints are minor strips. |
| `.references/strands-agent-sop/rules/agent-sop-format.md` | Format conventions and negative-constraint rule are immediately usable; Cursor XML wrapper is mechanical to strip. |
| `.references/strands-agent-sop/spec/agent-sops-specification.md` | Schema and constraint-authoring pattern are portable schema building blocks; strip is minimal. |

### Partial

| File | Reason |
|------|--------|
| `.references/strands-agent-sop/agent-sops/eval.sop.md` | High structural quality but deeply coupled to Strands Evals SDK (class names, Bedrock defaults, `uv` toolchain); anti-simulation rules and templates are portable but require significant strip to disentangle from SDK-specific implementation steps. |
| `.references/strands-agent-sop/agent-sops/code-task-generator.sop.md` | Description-mode workflow is fully portable; PDD-mode (approximately 40% of the SOP) must be stripped entirely. Approval gate and GWT format survive cleanly. |
| `.references/strands-agent-sop/AGENTS.md` | Only unique portable signal is the RFC 2119 keyword table, already covered by `.references/strands-agent-sop/skills/agent-sop-author/SKILL.md`; skip to avoid duplication. |

---

## 6. Cross-Cutting Protocol Primitives

These patterns appear across multiple files and represent the repo's portable infrastructure-level conventions. They are not domain logic — they are reusable agent-interaction micro-patterns worth standardising in the skills tree.

### P1 — RFC 2119 Constraint Levels
**Origin**: `.references/strands-agent-sop/rules/agent-sop-format.md`, `.references/strands-agent-sop/spec/agent-sops-specification.md`, `.references/strands-agent-sop/skills/agent-sop-author/SKILL.md`, `.references/strands-agent-sop/AGENTS.md`
**Pattern**: Every constraint in a step is expressed using MUST / MUST NOT / SHOULD / SHOULD NOT / MAY. Every MUST NOT carries a `because/since/as` rationale clause.
**Why it matters**: Makes constraint levels unambiguous; "because" clause prevents LLM seeding (model considers the forbidden option when told "don't do X" without context).

### P2 — Single-Prompt Parameter Acquisition
**Origin**: `.references/strands-agent-sop/skills/agent-sop-author/SKILL.md`, `.references/strands-agent-sop/spec/agent-sops-specification.md`, `.references/strands-agent-sop/agent-sops/pdd.sop.md`, `.references/strands-agent-sop/agent-sops/code-task-generator.sop.md`
**Pattern**: All required parameters solicited in one prompt; optional parameters discovered from context or prompted with defaults; confirm before proceeding.
**Why it matters**: Prevents multi-turn interrogation that frustrates users; produces a complete parameter set before any side effects.

### P3 — Interactive / Auto Mode Bifurcation
**Origin**: `.references/strands-agent-sop/agent-sops/code-assist.sop.md`
**Pattern**: Define both modes once in a `## Mode Behavior` section; every step references it with a callout rather than repeating mode logic inline.
**Why it matters**: Eliminates duplication; keeps per-step content focused on what to do, not how to behave.

### P4 — Approval Gate Before File Generation
**Origin**: `.references/strands-agent-sop/agent-sops/code-task-generator.sop.md`, `.references/strands-agent-sop/agent-sops/pdd.sop.md`
**Pattern**: Present proposed output (task breakdown, design doc outline) to user and receive explicit approval before writing any files.
**Why it matters**: Low-cost safety pattern that prevents regeneration cost and unwanted file clutter; applicable to any file-generating SOP.

### P5 — Phase-Dependency Management with Graceful Degradation
**Origin**: `.references/strands-agent-sop/agent-sops/eval.sop.md`
**Pattern**: Each phase checks that its required inputs exist before executing; if missing, present options (including how to produce them) rather than failing.
**Why it matters**: Produces navigable, resumable workflows rather than hard stops; surfaces the logical next step to the user.

### P6 — One-Question-at-a-Time Clarification Loop
**Origin**: `.references/strands-agent-sop/agent-sops/pdd.sop.md`
**Pattern**: Ask one clarifying question at a time; append the Q+A to a persistent file before asking the next; loop until user confirms requirements are complete.
**Why it matters**: Prevents user overload from multi-question dumps; produces a traceable requirements artefact automatically.

### P7 — Negative Constraints with Context
**Origin**: `.references/strands-agent-sop/rules/agent-sop-format.md`, `.references/strands-agent-sop/spec/agent-sops-specification.md`
**Pattern**: Any MUST NOT is followed by a clause beginning with "because", "since", or "as" explaining why the action is prohibited.
**Why it matters**: Directly addresses the "pink elephant" failure mode — negative instructions seed the model to consider the forbidden option unless the reason re-frames the goal positively.

### P8 — Integrate Tests into Functional Tasks (No Standalone Test Steps)
**Origin**: `.references/strands-agent-sop/agent-sops/pdd.sop.md`, `.references/strands-agent-sop/agent-sops/code-task-generator.sop.md`
**Pattern**: Test-only implementation steps are prohibited; every functional step includes its own test requirements.
**Why it matters**: Enforces genuine TDD sequencing rather than deferred testing; prevents the common agent failure mode of writing code and then adding tests as an afterthought.

---

## 7. Default Recommendation

**Port all eight files listed in §3 (Port) with strip applied. Do not port the four non-portable files.**

Priority order for extraction into the skills tree:

1. **`.references/strands-agent-sop/skills/agent-sop-author/SKILL.md`** → Promote as `.references/strands-agent-sop/skills/agent-sop-author/SKILL.md`. Only strip needed: remove `.references/strands-agent-sop/skills/agent-sop-author/validate-sop.sh` reference, Mermaid diagram, and distribution mentions. This is the foundational meta-skill that governs all downstream SOPs.

2. **`.references/strands-agent-sop/agent-sops/code-assist.sop.md`** → Promote as `.references/strands-agent-sop/agent-sops/code-assist.sop.md`. Primary value: mode bifurcation pattern, strict TDD sequencing, auto-mode interruption contract. Strip: path defaults, commit footer branding, strands-specific instruction-file discovery command.

3. **`.references/strands-agent-sop/agent-sops/pdd.sop.md`** → Promote as `.references/strands-agent-sop/agent-sops/pdd.sop.md`. Primary value: one-question clarification loop, verbatim implementation-plan prompt snippet, no-standalone-test-steps rule. Strip: three ecosystem references (Kiro IDE command, two MCP tool names, default path).

4. **`.references/strands-agent-sop/agent-sops/eval.sop.md`** → Promote as `.references/strands-agent-sop/agent-sops/eval.sop.md`. Extract `eval-plan.md` and `eval-report.md` as standalone skill fragments. Strip: Strands SDK class names, Bedrock defaults, `uv`, Python 3.11+ requirement.

5. **`.references/strands-agent-sop/agent-sops/codebase-summary.sop.md`** → Promote as `.references/strands-agent-sop/agent-sops/codebase-summary.sop.md`. Primary value: Step 5 anti-pattern constraints. Strip: `.agents/summary/` default, Mermaid-only constraint, AGENTS.md HTML comment block.

6. **`.references/strands-agent-sop/agent-sops/code-task-generator.sop.md`** → Promote as `.references/strands-agent-sop/agent-sops/code-task-generator.sop.md`. Port description-mode workflow only; strip PDD-mode branches entirely. Preserve GWT acceptance-criteria template verbatim.

7. **`.references/strands-agent-sop/rules/agent-sop-format.md`** → Promote negative-constraint rule (P7) as a cross-cutting rule in `rules/`. Condense format conventions into `.references/strands-agent-sop/skills/agent-sop-author/SKILL.md` — do not create a separate file.

8. **`.references/strands-agent-sop/spec/agent-sops-specification.md`** → Extract RFC 2119 constraint-authoring pattern and parameter-acquisition guidance as a reference section inside `.references/strands-agent-sop/skills/agent-sop-author/SKILL.md`. Do not promote the spec itself as a standalone skill.

---

## 8. Structural Patterns

### S1 — Five-Section Canonical Schema
All SOPs follow the same section hierarchy: Overview → Parameters → Steps → Examples → Troubleshooting. Enforced by `.references/strands-agent-sop/skills/agent-sop-author/validate-sop.sh` and `.references/strands-agent-sop/skills/agent-sop-author/SKILL.md`. The schema is the strongest structural convention in the repo and should be adopted as the standard for any new skills authored in this tree.

### S2 — Per-Step RFC 2119 Constraints Blocks
Every numbered step contains a `**Constraints:**` sub-section with bulleted RFC 2119 lines. This makes step-level rules machine-scannable and unambiguous. Contrast with skills in other repos that embed constraints as prose paragraphs — the per-step block structure makes diffs, linting, and human review substantially easier.

### S3 — Typed Parameter Definitions
Parameters declared as `required`, `optional`, or `optional, default: "value"` in snake_case. Parameter section always includes a "Constraints for parameter acquisition" sub-block that defines how to solicit values. This is more expressive than bare parameter lists and directly governs agent-user interaction.

### S4 — Verbatim Prompt Snippets as Skill Fragments
`.references/strands-agent-sop/agent-sops/pdd.sop.md` embeds a verbatim implementation-plan prompt snippet directly in the SOP. This "prompt-as-artefact" pattern is unusual and high-value — it ensures the exact LLM instruction is preserved in the skill, not paraphrased or degraded by summarisation. Worth adopting for any skill that must issue a precise generation instruction.

### S5 — Output Templates as Appendices
`.references/strands-agent-sop/agent-sops/eval.sop.md` includes full `eval-plan.md` and `eval-report.md` templates as appendices, with `<!-- ACTION REQUIRED -->` comments stripped from final output. This co-locates the skill's procedural contract with its output artefact format, eliminating ambiguity about what "done" looks like.

### S6 — Mode Behaviour Centralisation
`.references/strands-agent-sop/agent-sops/code-assist.sop.md` defines interactive and auto modes in a single `## Mode Behavior` section and references it with a callout (`> 💬 See Mode Behavior`) at the end of each step. This prevents duplication while keeping mode logic present contextually. Applicable to any SOP that must behave differently based on an execution context flag.

### S7 — Anti-Pattern Catalogues in Troubleshooting Sections
`.references/strands-agent-sop/agent-sops/code-task-generator.sop.md` covers four realistic failure modes; `.references/strands-agent-sop/agent-sops/eval.sop.md` has an explicit anti-simulation red-flag checklist; `.references/strands-agent-sop/agent-sops/codebase-summary.sop.md` prohibits five specific documentation anti-patterns by name. Unlike boilerplate Troubleshooting sections, these are actionable and domain-specific. The anti-pattern catalogue pattern is worth preserving verbatim in ported skills.

---

## 9. Evidence

All citations traceable to `raw-findings.md`.

> **[E1]** RFC 2119 constraint pattern — universally stated across four files: *"RFC2119 keywords for all constraints; every negative constraint must supply a `because/since/as` rationale clause"* (`.references/strands-agent-sop/rules/agent-sop-format.md` finding); *"RFC 2119 language (MUST/SHOULD/MAY) provides unambiguous constraint levels… Negative-constraint guidance (MUST NOT X because Y) aligns well with positive-framing best practices"* (`.references/strands-agent-sop/skills/agent-sop-author/SKILL.md` finding).

> **[E2]** Anti-simulation checklist — explicitly enumerated in `.references/strands-agent-sop/agent-sops/eval.sop.md` finding: *"identical metrics across cases, perfect 100% success rates on large sets, keywords like 'simulated'/'mocked'/'fake', no natural score variation"* — described as *"unusually rare and high-signal"* and *"rarely stated this explicitly anywhere."*

> **[E3]** Interactive/auto mode bifurcation — `.references/strands-agent-sop/agent-sops/code-assist.sop.md` finding: *"The interactive/auto mode bifurcation is the standout transferable innovation — defining both modes once and referencing throughout avoids duplication and keeps each step clean."*

> **[E4]** One-question-at-a-time clarification loop — `.references/strands-agent-sop/agent-sops/pdd.sop.md` finding: *"one-question-at-a-time requirements clarification that appends each Q+A to a persistent file before moving on"* — rated *"the single highest-value portable pattern here."*

> **[E5]** Approval gate before file generation — `.references/strands-agent-sop/agent-sops/code-task-generator.sop.md` finding: *"the approval gate in Step 4 — present task breakdown first, generate files only on explicit approval — is a low-cost safety pattern worth carrying forward into any file-generating SOP."*

> **[E6]** No standalone test-only steps — `.references/strands-agent-sop/agent-sops/pdd.sop.md` finding: *"'MUST NOT create steps solely dedicated to testing' rule is a strong, rarely-stated TDD principle worth standardising"*; corroborated by `.references/strands-agent-sop/agent-sops/code-task-generator.sop.md` finding: *"'do not create separate test tasks — integrate tests into each functional task' rule is opinionated but well-justified and directly prevents a common agent failure mode."*

> **[E7]** Step 5 anti-pattern constraints in `.references/strands-agent-sop/agent-sops/codebase-summary.sop.md` — finding: *"no volatile metrics (LoC counts, file sizes), no fabricated acronyms, no common build commands, preserve manually-maintained sections on refresh. These are actionable and rarely stated this explicitly — they directly prevent a common AGENTS.md generation failure mode."*

> **[E8]** Phase-dependency management — `.references/strands-agent-sop/agent-sops/eval.sop.md` finding: *"the phase-dependency management pattern with graceful degradation messaging — offering alternatives rather than failing when prerequisites are absent"* — identified as one of three standout portable extractions.

> **[E9]** Verbatim implementation-plan prompt snippet — `.references/strands-agent-sop/agent-sops/pdd.sop.md` finding: *"The implementation-plan prompt snippet ('Convert the design into a series of implementation steps… Each step must result in a working, demoable increment…') is suitable for direct extraction as a reusable skill fragment."*

> **[E10]** Plugin manifest confirming six named SOPs — `.references/strands-agent-sop/.claude-plugin/plugin.jsonon` finding: *"Confirms the repo bundles six named SOPs (code-assist, pdd, codebase-summary, code-task-generator, eval, agent-sop-author); those workflow files are the actual audit targets, not this manifest."*

> **[E11]** Negative-constraint framing as LLM safety principle — `.references/strands-agent-sop/rules/agent-sop-format.md` finding: *"The 'negative constraints require context' rule is a standout portable principle — directly addresses a common LLM prompt failure mode (seeding the model to consider the forbidden action). Consider promoting to a cross-cutting rule rather than burying it inside a format spec."*

> **[E12]** Validate-sop.sh as schema documentation — `.references/strands-agent-sop/skills/agent-sop-author/validate-sop.sh` finding: *"High secondary value as schema documentation. The structural contract it enforces (numbered steps, per-step Constraints blocks, RFC 2119 keywords, parameter constraints sub-section) is the clearest machine-readable spec of what a valid strands SOP looks like."*

> **[E13]** Portability of `.references/strands-agent-sop/agent-sops/code-assist.sop.md` — finding: *"Most complete code-implementation SOP in this repo… The 'only interrupt the user if genuinely blocked' rule in auto mode is high-signal and rarely stated this precisely."*

> **[E14]** Eval output templates as highest-value artefacts — `.references/strands-agent-sop/agent-sops/eval.sop.md` finding: *"The eval-plan.md and eval-report.md templates are the most immediately reusable outputs; promote them as standalone skill fragments."*

> **[E15]** PDD-mode stripping from `.references/strands-agent-sop/agent-sops/code-task-generator.sop.md` — finding: *"PDD-mode logic is tightly coupled to a proprietary plan format and hardcoded `.agents/` directory conventions; strip entirely"* — while description-mode is rated *"fully portable."*
