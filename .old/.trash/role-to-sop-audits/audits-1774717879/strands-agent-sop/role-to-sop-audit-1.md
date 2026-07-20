# Audit: strands-agent-sop → role-to-sop
**Date:** 2026-03-28
**Source repo:** `.references/strands-agent-sop/`
**Auditor input:** `raw-findings.md`

---

## 1. Repo Overview

`strands-agent-sop` is a public repository by the Strands Agents project (GitHub: `strands-agents/agent-sop`, distributed via the `skills-dist` ref) that ships a structured SOP authoring system for AI coding agents. Its primary deliverable is a `.sop.md` file format together with a meta-skill (`agent-sop-author`) and standing rule (`agent-sop-format.md`) that teach agents how to write, validate, and follow SOPs. The repo targets Claude Code via a `.claude-plugin/` manifest. Alongside the authoring machinery, it includes four task SOPs: code-assist (TDD-driven implementation), code-task-generator (task scaffolding), pdd (Prompt-Driven Development pipeline), codebase-summary (documentation generation), and eval (agent evaluation). The SOPs are opinionated about workflow shape (phase sequencing, RFC 2119 constraint tiers, interactive/auto mode duality) while leaving language and framework largely unconstrained. The plugin distribution shape (`plugin.json` + `marketplace.json`) indicates it was designed for broad reuse across Claude Code installations, not just internal tooling.

---

## 2. Content Summary

| Path | Kind |
|------|------|
| `skills/agent-sop-author/SKILL.md` | Meta-skill: how to author a `.sop.md` file |
| `rules/agent-sop-format.md` | Standing rule: SOP format spec, RFC 2119 conventions, negative-constraint rule |
| `spec/agent-sops-specification.md` | Reference spec: grammar and schema underlying all `.sop.md` files |
| `agent-sops/code-assist.sop.md` | Task SOP: TDD-driven code implementation (11-sub-step, Explore→Plan→Code→Commit) |
| `agent-sops/code-task-generator.sop.md` | Task SOP: converts rough descriptions or PDD plans into `.code-task.md` tickets |
| `agent-sops/pdd.sop.md` | Task SOP: 8-phase Prompt-Driven Development (rough idea → design → implementation plan) |
| `agent-sops/codebase-summary.sop.md` | Task SOP: codebase analysis → multi-file documentation ecosystem |
| `agent-sops/eval.sop.md` | Task SOP: 5-phase AI agent evaluation (plan → test-data → execute → analyze → report) |
| `skills/agent-sop-author/validate-sop.sh` | Shell script: POSIX validator for `.sop.md` naming and section completeness |
| `AGENTS.md` | Agent context guide (repo-specific) |
| `.claude-plugin/plugin.json` | Plugin manifest: project name, repo URL, `skills-dist` ref |
| `.claude-plugin/marketplace.json` | Marketplace manifest: owner identity, plugin entry |

---

## 3. SOP Split: Port vs Leave Out

### Port (with stripping)

| File | Short description | Reason to port |
|------|-------------------|----------------|
| `skills/agent-sop-author/SKILL.md` | Meta-skill for writing `.sop.md` files | RFC 2119 constraint conventions, negative-constraint rule, parameter-acquisition block, and before/after examples are fully general; only `validate-sop.sh` invocation needs removal |
| `rules/agent-sop-format.md` | Format spec as a standing rule | Defines the SOP grammar (naming, sections, RFC 2119, negative-constraint rationale) with no repo-specific logic; distillable to ~20 lines |
| `spec/agent-sops-specification.md` | Canonical schema for `.sop.md` structure | Structural conventions (parameter-before-steps ordering, MUST/SHOULD/MAY tiers, `because` clause for MUST NOT) are adoptable as a concise style-guide prefix; strip illustrative filler example |
| `agent-sops/pdd.sop.md` | 8-phase idea-to-plan pipeline | One-Q-at-a-time clarification loop, iteration checkpoint before design, demoable-increment implementation plan format, and phase-transition confirmation guardrails are directly reusable; strip Kiro tool names and internal paths |
| `agent-sops/codebase-summary.sop.md` | Codebase analysis + doc generation | Anti-hallucination constraints (no volatile metrics, no fabricated acronyms), Custom Instructions preservation pattern, and AGENTS.md consolidation logic are strong portable rules; strip default `.agents/summary/` path and Mermaid-only constraint |
| `agent-sops/eval.sop.md` | Agent evaluation lifecycle | Phase-dependency state machine, simulation-detection quality gate, and structured eval-plan + eval-report templates are portable with SDK coupling removed |
| `agent-sops/code-assist.sop.md` | TDD Explore→Plan→Code→Commit | Interactive/auto mode duality, no-push guardrail, conventional-commit requirement; merge into or reconcile with existing `tdd` skill rather than lift directly |

### Leave Out

| File | Reason |
|------|--------|
| `agent-sops/code-task-generator.sop.md` | PDD-mode step-folder logic (`step{NN}/task-NN-*.code-task.md`) is coupled to an Amazon-internal planning pipeline; core code-task template is extractable as a primitive only |
| `skills/agent-sop-author/validate-sop.sh` | POSIX script that hardcodes `.sop.md` naming and grep behavior; not runnable outside the source repo without modification |
| `AGENTS.md` | Tightly coupled to this repo's structure (`agent-sops/`, `python/`, `hatch`) |
| `.claude-plugin/plugin.json` | Repo-specific: project name, GitHub URL, `skills-dist` ref |
| `.claude-plugin/marketplace.json` | Owner identity and plugin entry are bound to this distribution |

---

## 4. Per-SOP Table

| Source file | Trigger | Steps / contract | Quality bar | Escalation | Strip | Notes |
|-------------|---------|-----------------|-------------|------------|-------|-------|
| `skills/agent-sop-author/SKILL.md` | Creating or updating a `.sop.md`; converting unstructured prompts to SOPs; validating SOP format across AI systems | Check for `agent-sops/` dir → name `.sop.md` (kebab-case) → write required sections → run validator → fix ❌ errors → address ⚠️ warnings | All ❌ errors resolved; parameter block includes four-line acquisition constraint verbatim | N/A (authoring tool) | `validate-sop.sh` invocation (repo-local); Mermaid flowchart (decorative) | Four-line parameter-acquisition block and "negative constraints need context" pattern are copy-pasteable primitives |
| `rules/agent-sop-format.md` | Any agent authoring, reviewing, or critiquing an SOP or skill file | (1) `.sop.md` + kebab-case; (2) mandatory sections; (3) MUST NOT includes `because <reason>`; (4) parameter acquisition in single prompt, multi-method input | Negative constraints carry explicit rationale; parameters fully declared before steps | N/A (standing rule) | `<rule>` / `globs` / `metadata` frontmatter (Cursor-specific); redundant `examples` block inside `<rule>` | Core distillable to ~20 lines; negative-constraint rationale rule is the standout transferable contribution |
| `spec/agent-sops-specification.md` | Contributor writing or editing an SOP/skill file | Title → Overview → Parameters → Steps (RFC 2119 constraints each) → optional Examples + Troubleshooting; required params gathered in single prompt; MUST NOT includes `because`; steps name output artifacts explicitly | Schema fully followed; no MUST NOT without rationale | N/A (spec) | "Personalized Learning Curriculum" example SOP; "Agent Compatibility" and "Tool Integration" implementation notes | Strongest extract: constraint system + parameter acquisition rule (~30–40 lines); adopt conventions, not `.sop.md` extension |
| `agent-sops/code-assist.sop.md` | User provides coding task and wants TDD implementation with optional human-in-the-loop gates | 11 sub-steps across Setup / Explore (×3) / Plan (×2) / Code (×4) / Commit; tests before implementation (hard); no push to remote; all build output piped to log files; display checklist status after each major step | Full test suite GREEN; build clean; coverage gate met; conventional commit recorded | N/A | `documentation_dir` path machinery; `CODEASSIST.md` integration; filesystem path templates; commit footer branding; troubleshooting section | Overlaps with existing `tdd` skill — merge rather than lift; interactive/auto mode duality is the standout portable pattern |
| `agent-sops/code-task-generator.sop.md` | User supplies rough task description, file path, or planning-document path and wants a structured work ticket | Detect input mode → analyze → structure requirements (Given-When-Then) → present summaries, await approval → generate `.code-task.md` files → report results | User approves task summaries before any file is written | N/A | PDD-mode `step{NN}` folder logic; `.agents/tasks/` default path; `code-assist` as follow-on command; internal-URL input method; PDD-specific troubleshooting | Portable extract only: `.code-task.md` schema + Given-When-Then AC pattern + plan-then-approve gate |
| `agent-sops/pdd.sop.md` | User provides rough idea and wants design doc plus incremental implementation plan | 9 phases: collect params → create dirs → initial planning → requirements clarification (one-Q-at-a-time loop) → research → iteration checkpoint → detailed design → implementation plan → summary; MUST NOT proceed without explicit user confirmation at each phase transition | Each phase artifact written to file before advancing; demoable increments; no orphaned/untested code in plan | Stall / research-gap / complexity scenarios covered in troubleshooting | Kiro tool names (`search_internal_code`, `read_internal_website`, `fs_read`, `/context add`); `.agents/planning/` default path; "peccy web search" mention | One-Q-at-a-time clarification loop with file-persistence is the strongest portable pattern; partial overlap with `prd-to-plan` (lacks research phase and rigorous clarification loop) |
| `agent-sops/codebase-summary.sop.md` | User asks to document a codebase; create/refresh AGENTS.md, README.md, CONTRIBUTING.md; generate AI-ready context files | Setup → Analyze → Generate docs (index.md, architecture.md, components.md, interfaces.md, data_models.md, workflows.md, dependencies.md) → Review → Consolidate → Summary; preserve `Custom Instructions` sections verbatim; omit volatile metrics, fabricated acronyms, common build commands | No fabricated content; no LOC/byte-size metrics; consolidated files concise | Consistency + completeness review step produces `review_notes.md` before consolidation | Default `.agents/summary/` path; Mermaid-only diagram constraint; verbose status-checkmark example outputs; troubleshooting section | Anti-hallucination constraints and Custom Instructions preservation are independently portable; two sub-skills extractable: `generate-agents-md` and `codebase-analyze` |
| `agent-sops/eval.sop.md` | User wants to evaluate an AI agent; mentions "evaluate my agent", "create evaluation plan", "generate test cases", "run evaluation", "analyze results" | 7 steps: acquire `agent_path` → setup (`eval/` as sibling) → planning (measurable metrics → `eval-plan.md`) → test-data generation (JSONL → `test-cases.jsonl`) → execution (timestamped results) → analysis (reject simulation artefacts, prioritized recommendations) → completion (verify no files leaked); phase-dependency check at each step | Simulation-detection gate: reject identical metrics, 100% success on large sets, "simulated/mocked/fake" keywords | Phase-dependency management: if prerequisite missing, offer to create it rather than block silently | Strands Evals SDK; Amazon Bedrock; `uv` as package manager; Python 3.11+ hard requirement; context7 MCP blocker; JSONL-only format; strands-agents/evals source clone reference | "Red flags for simulation" checklist and `eval/` sibling-folder constraint are portable quality-gate rules; two appendix templates (eval-plan.md, eval-report.md) worth carrying with genericised placeholders |

---

## 5. Portability Ranking

### High portability — port directly with minor stripping

- `rules/agent-sop-format.md` — pure convention, no dependencies
- `skills/agent-sop-author/SKILL.md` — only `validate-sop.sh` needs removal
- `spec/agent-sops-specification.md` — strip illustrative example SOP, adopt as style-guide section

### Medium portability — port after targeted stripping

- `agent-sops/pdd.sop.md` — strip Kiro tool names and internal paths; core workflow is clean
- `agent-sops/codebase-summary.sop.md` — strip default output path and diagram constraint
- `agent-sops/eval.sop.md` — strip SDK, runtime, and package manager coupling; workflow and templates survive intact

### Partial portability — extract primitives only, do not lift as-is

- `agent-sops/code-assist.sop.md` — merge into existing `tdd` skill; interactive/auto mode pattern is the extractable primitive
- `agent-sops/code-task-generator.sop.md` — extract `.code-task.md` schema, Given-When-Then AC pattern, and plan-then-approve gate only
- `validate-sop.sh` — adapt POSIX script or replace with inline checklist; do not lift verbatim

---

## 6. Cross-Cutting Protocol Primitives

These patterns appear across multiple SOPs and are smaller than a full skill. Each is independently adoptable.

**1. Four-line parameter acquisition constraint block**
Appears in `agent-sop-author/SKILL.md` and `agent-sop-format.md`. Prescribes: ask all required params upfront in a single prompt; support text / file path / URL input methods; confirm before proceeding. Prevents multi-turn parameter collection.

**2. Negative-constraint rationale rule (`MUST NOT X because Y`)**
Appears in `rules/agent-sop-format.md`, `spec/agent-sops-specification.md`, and every task SOP's Steps section. Requires that every prohibitive constraint carry an explicit `because/since/as <reason>` clause. Prevents opaque prohibitions in any skill or rule file.

**3. Interactive / auto mode duality**
Appears in `code-assist.sop.md`. Defines two execution paths: interactive (confirmation gate at each step) vs. auto (fully autonomous with decision logging). Clean portable pattern for any skill that may run supervised or headless.

**4. One-Q-at-a-time requirements clarification loop**
Appears in `pdd.sop.md`. Formulate one question → append to file → present → wait → record answer → next question. Prevents ambiguity accumulation before design.

**5. Phase-dependency state machine**
Appears in `eval.sop.md`. Each phase checks whether its prerequisite artifact exists; if absent, offers to create it rather than blocking silently. Applicable to any multi-phase skill where phases can be entered mid-flow.

**6. Anti-hallucination output constraints**
Appears in `codebase-summary.sop.md`. Three rules: (a) omit volatile metrics (LOC counts, byte sizes), (b) omit fabricated acronyms, (c) omit common build/test/lint commands. Apply to any documentation-generation skill.

**7. Custom Instructions preservation pattern**
Appears in `codebase-summary.sop.md`. When updating a file that may contain human-curated sections, preserve those sections verbatim across re-runs. Applicable to any skill that writes or regenerates shared context files (AGENTS.md, CLAUDE.md, etc.).

**8. Simulation-detection quality gate**
Appears in `eval.sop.md`. Reject execution results that show identical metrics across cases, 100% success on large test sets, or contain keywords "simulated/mocked/fake". Portable to any skill that validates agent-produced outputs.

**9. Demoable-increment implementation plan format**
Appears in `pdd.sop.md`. Each implementation step must be independently demoable and carry co-located tests; no orphaned/untested code permitted. Applicable to any planning skill.

**10. Plan-then-approve gate before file generation**
Appears in `code-task-generator.sop.md`. Present one-line task summaries and await explicit user approval before writing any files to disk. Applicable to any generative skill that produces multiple output files.

---

## 7. Default Recommendation

**Ship the following in `.agents` (this workspace):**

| Artifact | Form | Action |
|----------|------|--------|
| `rules/agent-sop-format.md` (stripped) | New rule file at `rules/sop-format.md` | Drop Cursor `<rule>` frontmatter; inline the RFC 2119 table and negative-constraint rationale rule; keep parameter acquisition pattern |
| `skills/agent-sop-author/SKILL.md` (stripped) | New skill at `skills/sop-author/SKILL.md` | Remove `validate-sop.sh` invocation; replace with inline checklist; keep before/after examples and common-mistakes section |
| Structural conventions from `spec/agent-sops-specification.md` | Inline prefix in `skills/skill-create/SKILL.md` | Add ~30-line style-guide section covering section ordering, RFC 2119 tiers, and negative-constraint rule |
| `agent-sops/pdd.sop.md` (stripped) | New skill at `skills/pdd/SKILL.md` | Strip Kiro tooling; replace `.agents/planning/` default with `.plans/`; keep clarification loop, checkpoint gate, and demoable-increment format |
| `agent-sops/codebase-summary.sop.md` (stripped) | Extend `skills/codebase-architecture/SKILL.md` | Add anti-hallucination constraints and Custom Instructions preservation pattern; extract `generate-agents-md` as a separate skill |
| `agent-sops/eval.sop.md` (stripped) | New skill at `skills/eval-agent/SKILL.md` | Strip Strands SDK, Bedrock, uv, and Python 3.11 hard requirements; carry eval-plan.md and eval-report.md templates with genericised placeholders |
| `agent-sops/code-assist.sop.md` (interactive/auto pattern only) | Merge into `skills/tdd/SKILL.md` | Add interactive/auto mode preamble and no-push guardrail; do not duplicate the full Explore→Plan→Code→Commit flow |
| Cross-cutting primitives (§6 items 1–10) | Inline additions to relevant existing skills | Parameter acquisition block → add to any skill that takes required inputs; anti-hallucination rules → add to any doc-generation skill |

**Do not ship:**
- `code-task-generator.sop.md` as a full skill (PDD coupling too deep; extract primitives only)
- `validate-sop.sh` (adapt or replace)
- `AGENTS.md`, plugin manifests (repo-specific)

---

## 8. Structural Patterns Worth Adopting

### `.sop.md` file format
Defined in `spec/agent-sops-specification.md` and enforced by `rules/agent-sop-format.md`. Canonical section order: **Title / Overview → Parameters → Steps → Examples → Troubleshooting**. Parameters are declared before steps. Each step carries a `**Constraints:**` sub-list. Files use kebab-case naming. This workspace uses `SKILL.md` files rather than `.sop.md`; the section ordering and constraint-block pattern are adoptable without changing the extension.

### RFC 2119 constraint system
All task SOPs use a three-tier modal constraint vocabulary: `MUST` / `MUST NOT` for hard invariants, `SHOULD` / `SHOULD NOT` for strong defaults, `MAY` for discretionary choices. Every `MUST NOT` includes a `because <reason>` clause. This system is absent from most skills in this workspace. Adopting it would make invariants machine-distinguishable from suggestions, reducing ambiguity in instruction-following.

### Parameter acquisition block
Every SOP that takes inputs opens with a Parameters section that (a) lists all params with `required` / `optional (default: X)` labels, (b) declares the four-line acquisition constraint: ask all required params in one prompt, support text / file path / URL input, confirm before proceeding. This prevents multi-turn parameter drip and makes input contracts explicit. Currently underspecified in most `.agents` skills.

### Negative-constraint rationale rule
`MUST NOT X because Y` — every prohibition carries an explicit rationale. Defined in `rules/agent-sop-format.md` and `spec/agent-sops-specification.md`. Prevents opaque blocking rules that agents (and humans) cannot reason about or override safely. This is the single highest-value transferable convention in this repo.

### Phase-dependency state machine
Defined operationally in `eval.sop.md`. Each phase checks for its prerequisite artifact and offers to create it if absent rather than failing silently. Applicable to any multi-phase skill where users may enter mid-flow (common in interactive coding sessions).

### Troubleshooting as a separate appendix
All task SOPs include a `## Troubleshooting` section that covers named failure modes (stall, research gap, complexity blowup, simulation artefacts). `codebase-summary.sop.md` notes this belongs in a "separate runbook, not SOP behavior" — a useful distinction. Skills in this workspace should either omit troubleshooting or move it to a dedicated appendix rather than inline it with step logic.

---

## 9. Evidence

1. **`validate-sop.sh` is repo-local:** raw-findings.md, `agent-sop-author/SKILL.md` entry: *"Remove the `validate-sop.sh` invocation section (or generalise it to 'run any available validator') since that script is repo-local and won't exist in other environments."*

2. **Negative-constraint rationale rule defined in `rules/agent-sop-format.md`:** *"Negative constraints (MUST NOT / SHOULD NOT) MUST include 'because/since/as <reason>' — rationale explicitly required."*

3. **Parameter acquisition four-line block is a named portable primitive:** raw-findings.md, `agent-sop-author/SKILL.md` entry: *"The four-line parameter-acquisition constraint block is a strong, copy-pasteable portable primitive."*

4. **`code-task-generator.sop.md` is coupled to Amazon-internal PDD pipeline:** *"the PDD-mode step-folder conventions (`step{NN}/task-NN-*.code-task.md`) are coupled to a specific Amazon-internal planning structure (PDD + `.agents/tasks/` directory layout)"*

5. **`code-assist.sop.md` overlaps with existing `tdd` skill:** *"Overlaps significantly with the `tdd` skill already in this repo (`skills/tdd/SKILL.md`) — a merged/reconciled version would be the right output rather than a direct lift."*

6. **Anti-hallucination constraints in `codebase-summary.sop.md` are the strongest portable rules in that SOP:** *"The anti-hallucination constraints (no volatile metrics, no fabricated acronyms) are the strongest portable rules in this SOP and should be surfaced at the skill level regardless of whether the full SOP is adopted."*

7. **`pdd.sop.md` has low overlap with existing skills:** *"Low overlap with existing skills except partial overlap with `prd-to-plan` (which lacks the research phase and the rigorous clarification loop)."*

8. **`eval.sop.md` simulation-detection gate:** *"The 'red flags for simulation' checklist (identical metrics across cases, 100% success on large sets, keywords 'simulated/mocked/fake') is a portable quality-gate worth preserving."*

9. **`spec/agent-sops-specification.md` extension does not exist in this workspace:** *"The spec is repo-internal tooling for Strands; it references a `.sop.md` extension that does not exist in this workspace — adopt the conventions, not the extension."*

10. **`AGENTS.md` is not portable:** *"It is tightly coupled to this repository's structure, workflows, and package-specific conventions… references `agent-sops/`, `python/`, `hatch`, and local SOP authoring patterns."*

11. **`plugin.json` is bound to this distribution:** *"The manifest shape is reusable, but the project name, repository URL, and release ref are specific to this distribution… points at `https://github.com/strands-agents/agent-sop.git` with ref `skills-dist`."*

12. **`eval.sop.md` phase-dependency pattern:** *"Phase-dependency rules: each phase checks for its prerequisite and offers to create it if absent rather than blocking silently."*

13. **`pdd.sop.md`'s clarification loop is file-persistent:** *"one-Q-at-a-time requirements clarification loop: formulate → append to idea-honing.md → present → wait → record answer → next Q; continue until user confirms complete"*

14. **`codebase-summary.sop.md` recommends troubleshooting as a separate runbook:** *"Troubleshooting belongs in a separate runbook, not SOP behavior… A clean extraction would be ~40% shorter."*

15. **Interactive/auto mode duality in `code-assist.sop.md` is the standout portable pattern:** *"The interactive/auto mode duality is the standout portable pattern here — explicit gates at each step vs. fully autonomous with decision logging."*
