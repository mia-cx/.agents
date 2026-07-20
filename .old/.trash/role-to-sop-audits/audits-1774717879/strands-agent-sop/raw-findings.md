
## skills/agent-sop-author/SKILL.md

**Type:** Meta-skill (teaches how to author Agent SOPs)
**Portable:** Yes — with minor stripping
**Reason:** Pure instructional content on SOP authoring; no repo-specific paths, services, or tools beyond a local `validate-sop.sh` reference. RFC 2119 constraint conventions, parameter acquisition boilerplate, and structural schema are fully general and re-usable in any agent/skill environment.
**Trigger:** Use when creating or updating a `.sop.md` workflow file, converting an unstructured prompt into a structured SOP, or validating SOP format across AI systems.
**Steps/contract:** Authoring workflow: check for `agent-sops/` dir → name file `.sop.md` (kebab-case) → write required sections (Overview, Parameters, Steps with RFC 2119 constraints, Examples, Troubleshooting) → run `validate-sop.sh` → fix all ❌ errors → address ⚠️ warnings. Parameter section MUST always include the four-line "Constraints for parameter acquisition" block verbatim.
**Strip:** Remove the `validate-sop.sh` invocation section (or generalise it to "run any available validator") since that script is repo-local and won't exist in other environments. The Mermaid flowchart is decorative and can be omitted to save tokens.
**Structure/format:** Very well-structured. Quick-reference table, common-mistakes section, before/after examples, and explicit RFC 2119 keyword definitions are all high-signal teaching aids worth keeping.
**Notes:** The four-line parameter-acquisition constraint block is a strong, copy-pasteable portable primitive. The "negative constraints need context" pattern (MUST NOT X *because* Y) is an excellent reusable rule that prevents over-constrained, opaque SOPs. Both are strong candidates for inclusion in a general SOP-authoring skill.

## rules/agent-sop-format.md
**Type:** Meta-standard / format spec
**Portable:** Yes — highly portable
**Reason:** Defines a universal SOP authoring format (structure, naming, RFC2119 keywords, negative-constraint context rules) with no repo-specific logic. Applicable to any skill/SOP system.
**Trigger:** Any agent asked to author, review, or critique an SOP or skill file.
**Steps/contract:** (1) Use `.sop.md` extension + kebab-case naming. (2) Mandatory sections: Title/Overview, Parameters (snake_case, required/optional labelled), Steps with RFC2119 constraints, optional Examples + Troubleshooting. (3) Negative constraints (MUST NOT / SHOULD NOT) MUST include "because/since/as <reason>" — rationale explicitly required. (4) Parameter acquisition: ask all required params upfront in one prompt, support direct/file/URL input methods, confirm before proceeding.
**Strip:** The `<rule>` / `globs` / `metadata` frontmatter block is Cursor-specific tooling — strip for a portable skill. The `examples` block inside `<rule>` is redundant with the body text. The "Strands" framing in the repo path is incidental; content is generic.
**Structure/format:** Long-form reference spec with markdown template snippets throughout. Best collapsed into a concise checklist + the negative-constraint pattern as a single inlineable rule block. Core distillable to ~20 lines.
**Notes:** The negative-constraint rationale rule ("MUST NOT X because Y") is the standout transferable contribution — it prevents opaque prohibitions in any skill/rule file. RFC2119 keyword table is standard but worth including verbatim. Parameter acquisition pattern (single prompt, multi-method input) is useful for interactive skills. Low overlap with other files audited so far.

---

## spec/agent-sops-specification.md

**Type:** Meta-specification / schema definition (describes the `.sop.md` format itself, not a task SOP)

**Portable:** Partial — the _structural conventions_ (file format, parameter schema, RFC 2119 constraint syntax, step design rules) are portable as a formatting standard; the file is not itself an executable SOP

**Reason:** This is an authoring specification, not a workflow. It defines the grammar every other `.sop.md` in this repo follows. Porting it means adopting its conventions (kebab-case filenames, `## Overview / Parameters / Steps` skeleton, RFC 2119 keywords, constraint blocks) into a skill's authoring guide rather than loading it as a runnable skill.

**Trigger:** Fires when a contributor is *writing or editing* an SOP/skill file, not during task execution. Closest analogue in this workspace is `skills/skill-create/SKILL.md`.

**Steps/contract:**
1. Title → Overview → Parameters (required/optional/default) → Steps (each with Constraints block) → optional Examples + Troubleshooting
2. Parameters must be declared before steps; required params must be gathered in a single prompt
3. Each step must carry RFC 2119 constraint bullets (`MUST`, `SHOULD`, `MAY`, `MUST NOT`)
4. Prohibitive constraints (`MUST NOT`) must include a `because <reason>` clause
5. Steps must name all file artifacts they produce (explicit output paths)

**Strip:** Drop the embedded "Personalized Learning Curriculum" example SOP before porting — it is illustrative filler, not a portable workflow. Also drop the "Agent Compatibility" and "Tool Integration" implementation notes (environment-specific boilerplate).

**Structure/format:** Well-structured reference doc. The format spec itself is clean and transferable as a concise style-guide section (≈ 30–40 lines) to prefix any skill-authoring guide.

**Notes:**
- The strongest portable extract is the **constraint system** (RFC 2119 table + negative-constraint rule requiring `because` clauses). This is missing from most skills in this workspace.
- The **parameter acquisition constraint** ("MUST ask for all required params upfront in a single prompt") is a high-signal UX rule worth adopting globally.
- The spec is repo-internal tooling for Strands; it references a `.sop.md` extension that does not exist in this workspace — adopt the conventions, not the extension.
- No security, auth, or environment concerns to strip.

## agent-sops/code-assist.sop.md

**Type:** Workflow SOP (TDD-driven code implementation, Explore→Plan→Code→Commit)

**Portable:** Yes — strong candidate

**Reason:** Fully language- and framework-agnostic structure. The Explore/Plan/Code/Commit phases, TDD RED→GREEN→REFACTOR loop, and interactive vs. auto mode pattern are reusable in any coding context. Concrete constraints (YAGNI, KISS, SOLID, conventional commits, no push) are universally applicable. The only non-portable pieces are filesystem path conventions and the `CODEASSIST.md` escape-hatch pattern (both easily stripped or parameterised).

**Trigger:** User provides a coding task or feature request and wants TDD-based implementation with optional human-in-the-loop confirmation gates.

**Steps/contract:**
1. **Setup** — validate/create documentation directory; discover and read instruction files (CODEASSIST.md + README/CONTRIBUTING); create `context.md` and `progress.md`.
2. **Explore 2.1** — analyse requirements; produce acceptance criteria; surface ambiguities.
3. **Explore 2.2** — search repo for existing patterns; build dependency map; update `context.md`.
4. **Explore 2.3** — compile findings into consolidated code-context document; high-level only, no full-code dumps.
5. **Plan 3.1** — design test scenarios (input/output pairs) covering all acceptance criteria; save to `plan.md`.
6. **Plan 3.2** — outline implementation structure; update `plan.md`; maintain progress checklist.
7. **Code 4.1** — write test code in repo; run tests; confirm RED failures; document reasons.
8. **Code 4.2** — implement until GREEN; strict TDD cycle; document each cycle in `progress.md`.
9. **Code 4.3** — refactor for convention alignment; maintain GREEN throughout.
10. **Code 4.4** — validate: run full test suite + build; verify coverage; confirm all checklist items done.
11. **Commit** — `git status` → stage → conventional commit (no push); record hash in `progress.md`.

Key contracts: tests before implementation (hard constraint); no code in documentation directory; no push to remote; all build output piped to log files; display checklist status after each major step.

**Strip:**
- `documentation_dir` / `repo_root` / `project_name` / `task_name` parameter machinery (replace with sensible defaults or collapse)
- `CODEASSIST.md` integration section (project-specific escape hatch, not portable logic)
- Filesystem path templates (`{documentation_dir}/{task_name}/...`) — generalise or remove
- "🤖 Assisted by the code-assist SOP" commit footer
- Troubleshooting section (operational runbook, not portable SOP logic)
- Verbose MUST/SHOULD repetition within each step (condense to key invariants)
- Mode-behaviour cross-reference callouts (can be collapsed into a single mode-behaviour preamble)

**Structure/format:** Well-structured. Parameters block → Mode Behavior preamble → numbered Steps with sub-steps → Desired Outcome → Examples → Troubleshooting → Best Practices → Artifacts. The mode-behaviour indirection (define once, reference via callout) is a clean pattern worth preserving. Steps are granular (11 sub-steps) — could be collapsed to ~5 top-level phases for a leaner skill. Constraint lists inside each step are exhaustive and repetitive; benefit from condensation.

**Notes:** The interactive/auto mode duality is the standout portable pattern here — explicit gates at each step vs. fully autonomous with decision logging. The hard separation of "documentation directory" vs. "repo root" is a useful invariant but overly verbose as written. The "no push" constraint and conventional-commit requirement are strong portable guardrails. Overlaps significantly with the `tdd` skill already in this repo (`skills/tdd/SKILL.md`) — a merged/reconciled version would be the right output rather than a direct lift.

## agent-sops/code-task-generator.sop.md

**Type:** Generative / task-scaffolding SOP — converts rough descriptions or PDD implementation plans into structured `.code-task.md` files

**Portable:** Partially — the *task-file format spec* and the *acceptance-criteria (Given-When-Then) pattern* are fully portable; the PDD-mode step-folder conventions (`step{NN}/task-NN-*.code-task.md`) are coupled to a specific Amazon-internal planning structure (PDD + `.agents/tasks/` directory layout)

**Reason:** Core value is the opinionated code-task template (Description / Background / Reference Docs / Technical Requirements / Dependencies / Implementation Approach / Acceptance Criteria / Metadata) and the rule that tests are *integrated* into each implementation task rather than spun off as separate tasks. These translate cleanly to any project. The PDD-detection logic and folder-naming scheme assume a proprietary planning pipeline that won't exist elsewhere.

**Trigger:** User supplies a rough task description, a file path, or a planning-document path and asks to generate a structured work ticket / code task file

**Steps / contract:**
1. Detect input mode (description vs. PDD plan) by checking whether the path exists and contains a checklist
2. Analyze input — extract requirements, complexity, tech stack
3. Structure requirements — functional requirements, Given-When-Then acceptance criteria, dependencies
4. Plan tasks — present one-line summaries per sub-task and await explicit user approval before writing any files
5. Generate tasks — create `.code-task.md` files (single file for description mode; `step{NN}/task-NN-*.code-task.md` tree for PDD mode)
6. Report results — list all generated paths and suggest next action (run code-assist per task in sequence)

**Strip:**
- All PDD-mode logic (`step{NN}` folder naming, plan.md detection, "Reference Documentation → Design: planning/design/detailed-design.md" hard-coded path)
- `.agents/tasks/{project_name}` default output path convention
- References to `code-assist` as the follow-on command (tool-specific)
- "URL to internal documentation" as an input method (internal-only)
- Troubleshooting sections for PDD-specific error states (Plan File Not Found, Invalid Plan Format, No Uncompleted Steps)

**Structure / format:** Well-structured with clear `## Steps` + per-step `**Constraints:**` blocks; includes a complete format spec with an annotated example and end-to-end I/O examples. Approval gate in Step 4 is explicit and enforceable. Format spec is copy-pasteable as a standalone template.

**Notes:** The most portable extraction is a standalone *"Code Task Template + generation SOP"* skill: (1) the `.code-task.md` schema, (2) the rule that tests live inside each functional task (not as separate tasks), (3) the Given-When-Then acceptance-criteria pattern, and (4) the plan-then-approve gate before file generation. Complexity metadata (`Low/Medium/High`) and labels/required-skills fields are also worth keeping as they feed downstream triage.

## agent-sops/pdd.sop.md

**Type:** Workflow SOP — 8-phase Prompt-Driven Development pipeline (rough idea → design doc → implementation plan)

**Portable:** Partial — core workflow is highly portable; strip Kiro-specific tool names and `/context add` command

**Reason:** Comprehensive, well-constrained methodology for turning a rough idea into a structured design and TDD implementation plan. One-question-at-a-time requirements clarification, explicit iteration checkpoints, and demoable-increment step sequencing are universally valuable patterns independent of any platform.

**Trigger:** User provides a rough idea and wants a detailed design document plus an incremental implementation plan.

**Steps/contract:**
1. Collect params (rough_idea required; project_name, project_dir optional) — all in one prompt; support text / file path / URL input
2. Create project directory structure (rough-idea.md, idea-honing.md, research/, design/, implementation/)
3. Initial process planning — ask user: start with clarification, preliminary research, or extra context
4. Requirements clarification — strict one-Q-at-a-time loop: formulate → append to idea-honing.md → present → wait → record answer → next Q; continue until user confirms complete
5. Research — propose plan, incorporate user suggestions, document findings in research/ as topic-named .md files, include mermaid diagrams and source links, check in with user periodically
6. Iteration checkpoint — summarise state; ask user: proceed to design, back to clarification, or more research
7. Create detailed design — detailed-design.md with Overview, Detailed Requirements, Architecture, Components/Interfaces, Data Models, Error Handling, Testing Strategy, Appendices; mermaid diagrams required; iterate with user before proceeding
8. Develop implementation plan — plan.md with upfront checklist; steps formatted as "Step N:" with objective, guidance, test requirements, integration notes, and Demo; TDD-first; demoable increments; no orphaned/untested code
9. Summary — summary.md listing all artefacts; present in conversation with next-steps suggestions

**Strip:**
- Kiro-specific tool references (`search_internal_code`, `read_internal_website`, `fs_read`, "Kiro's context")
- `/context add {project_dir}/**/*.md` command
- Default path `.agents/planning/{project_name}` (replace with repo-relative `.plans/` or make fully configurable)
- "peccy web search" example mention

**Structure/format:** Excellent — Parameters block with acquisition constraints; numbered Steps each with granular MUST/SHOULD/MAY sub-constraints; worked Example (input + output); Troubleshooting section for stall/research-gap/complexity scenarios. Very high constraint density.

**Notes:** Strongest portable patterns here are (a) the one-Q-at-a-time requirements clarification loop with file-persistence of Q&A, (b) the explicit iteration checkpoint before design, (c) the implementation plan format requiring demoable increments and co-located tests (no separate test-only steps), and (d) the "MUST NOT proceed without explicit user confirmation" guardrails at every phase transition. These are directly reusable in a `prd-to-plan` or `doc-coauthor` skill. Low overlap with existing skills except partial overlap with `prd-to-plan` (which lacks the research phase and the rigorous clarification loop).

## agent-sops/codebase-summary.sop.md

**Type**: Codebase documentation generation SOP — analyzes a repo and produces a structured documentation ecosystem (architecture, components, interfaces, data models, workflows, dependencies) plus consolidated files (AGENTS.md / README.md / CONTRIBUTING.md).

**Portable**: Yes — with targeted stripping. The full 6-step pattern (setup → analyze → generate docs → review → consolidate → summarize) is universally applicable; only the default output path and Mermaid-only diagram constraint are opinionated.

**Reason**: Every engineering project benefits from AI-navigable codebase documentation. The core workflow, the "Custom Instructions" preservation pattern (protect human-curated sections across re-runs), and the anti-hallucination constraints (no volatile metrics, no fabricated acronyms, no common build commands) are strong portable patterns with no repo-specific logic.

**Trigger**: User asks to document or summarize a codebase; create or refresh AGENTS.md, README.md, or CONTRIBUTING.md; generate AI-ready context files; or get an architectural overview of a project.

**Steps/contract**:
1. **Setup** — validate `codebase_path`, create `output_dir` (default `.agents/summary/`)
2. **Analyze** — map structure, components, dependencies, design patterns; write `codebase_info.md`; use Mermaid diagrams
3. **Generate docs** — produce `index.md` (AI knowledge-base index), `architecture.md`, `components.md`, `interfaces.md`, `data_models.md`, `workflows.md`, `dependencies.md`
4. **Review** — consistency + completeness checks; write `review_notes.md` with gaps and language-support limitations
5. **Consolidate** — if `consolidate=true`, write target files (AGENTS.md/README.md/CONTRIBUTING.md) to repo root; preserve `Custom Instructions` sections verbatim; tailor content per target type
6. **Summary** — report what was created; guide user on adding `index.md` to AI context; advise on doc maintenance

Key contract rules: ask for all params upfront in a single prompt; preserve manually-maintained sections; omit volatile metrics (LOC counts, byte sizes); omit fabricated acronyms; omit common build/test/lint commands; keep consolidated files concise.

**Strip**:
- Default output path `.agents/summary/` — make fully configurable with no default assumption
- "You MUST use Mermaid diagrams… MUST NOT use ASCII art" — opinionated tooling constraint; relax to "prefer structured diagrams"
- Verbose status-checkmark example outputs (illustrative noise, not prescriptive)
- Troubleshooting section — operational support doc, not SOP behavior
- `consolidate_prompt` default example is Strands-flavored; extract as a standalone example, not inline guidance

**Structure/format**: Well-structured — Parameters block with constraint notes, numbered Steps each with a Constraints sub-list, Examples section, Troubleshooting appendix. Steps are clearly sequenced and non-overlapping. Slightly over-specified (Troubleshooting belongs in a separate runbook). A clean extraction would be ~40% shorter.

**Notes**: Two sub-patterns are independently portable and could be promoted as standalone skills: (1) **generate-agents-md** — the AGENTS.md consolidation logic with Custom Instructions preservation; (2) **codebase-analyze** — the structural analysis + multi-file doc generation. The anti-hallucination constraints (no volatile metrics, no fabricated acronyms) are the strongest portable rules in this SOP and should be surfaced at the skill level regardless of whether the full SOP is adopted.

## agent-sops/eval.sop.md

**Type**: Conversational multi-phase evaluation workflow SOP (plan → test-data → execute → analyze → report)

**Portable**: Partially — the 5-phase evaluation lifecycle, phase-dependency state machine, prerequisite gating, and report/plan templates are fully portable; Strands Evals SDK, Amazon Bedrock, uv, and context7 MCP are framework-specific noise

**Reason**: The phase structure is an excellent portable pattern: validate environment → author eval plan → generate JSONL test cases → execute and collect results → analyze with evidence-based recommendations → finalize artifacts. Phase-dependency management (missing prerequisite → offer to create it) and the "red flags for simulated results" quality gate are strong reusable ideas. The two appendix templates (eval-plan.md, eval-report.md) are well-structured and worth carrying forward with placeholders genericised.

**Trigger**: User wants to evaluate an AI agent; mentions "evaluate my agent", "create evaluation plan", "generate test cases", "run evaluation", "analyze results", or provides an agent path for assessment.

**Steps/contract**:
1. Acquire `agent_path` (required) — block if missing; infer `evaluation_focus` from natural language
2. **Setup**: verify agent folder exists, create `eval/` as sibling (never inside agent folder), check runtime prerequisites
3. **Planning**: analyse agent architecture and capabilities → design metrics (measurable, verifiable, implementation-ready) → write `eval/eval-plan.md` using structured template
4. **Test-data generation**: load plan → generate test cases in JSONL → save to `eval/test-cases.jsonl` → update progress log in plan
5. **Execution**: implement evaluation pipeline using available eval framework → run against agent → save timestamped results to `eval/results/` → create `eval/README.md`
6. **Analysis**: load results → validate real execution (reject simulation artefacts) → compute success rates and quality scores → produce prioritised recommendations (Critical / Quality / Enhancement) → write `eval/eval-report.md`
7. **Completion**: verify all artefacts are in `eval/`, no files leaked into agent folder, README complete; suggest next steps

Phase-dependency rules: each phase checks for its prerequisite and offers to create it if absent rather than blocking silently.

**Strip**:
- Strands Evals SDK (`Case`, `Experiment`, `OutputEvaluator`, etc.) — replace with generic "evaluation framework of choice"
- Amazon Bedrock as default LLM provider
- `uv` as mandatory package manager — use project's standard tool
- Python 3.11+ hard requirement
- context7 MCP blocker (hard stop until context7 or source clone) — too workflow-specific; replace with "consult framework docs"
- JSONL-only format constraint — generalise to structured test-case format
- Reference to cloning `strands-agents/evals` source

**Structure/format**: High quality — parameterised phases with explicit intent-recognition keywords, MUST/SHOULD/MAY constraint tiers, two complete appendix templates (eval-plan.md with agent analysis table + mermaid diagram slot; eval-report.md with executive summary, results table, strengths, failure analysis, and action items), and a troubleshooting section per common failure mode. Templates use HTML comment `<!-- ACTION REQUIRED -->` guidance that is stripped from final output.

**Notes**: The "red flags for simulation" checklist (identical metrics across cases, 100% success on large sets, keywords "simulated/mocked/fake") is a portable quality-gate worth preserving. The iterative-refinement example (user adds focus mid-flow, plan updates propagate) illustrates a good conversational state-management pattern. Folder structure diagram (eval/ as sibling, never nested) is clear and reusable. Overall one of the more complete and well-structured SOPs in this repo; strip SDK coupling and it becomes a strong generic agent-evaluation skill.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/strands-agent-sop/skills/agent-sop-author/validate-sop.sh / **Type**: shell script / **Portable**: partial / **Reason**: POSIX shell validator, but it hardcodes `.sop.md` naming and relies on grep behavior that can vary by environment. / **Notes**: checks Overview, Parameters, Steps, RFC 2119 keywords, and constraint wording.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/strands-agent-sop/AGENTS.md / **Type**: agent context guide / **Portable**: no / **Reason**: It is tightly coupled to this repository’s structure, workflows, and package-specific conventions. / **Notes**: references `agent-sops/`, `python/`, `hatch`, and local SOP authoring patterns.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/strands-agent-sop/.claude-plugin/plugin.json / **Type**: plugin manifest / **Portable**: partial / **Reason**: The manifest shape is reusable, but the project name, repository URL, and release ref are specific to this distribution. / **Notes**: points at `https://github.com/strands-agents/agent-sop.git` with ref `skills-dist`.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/strands-agent-sop/.claude-plugin/marketplace.json / **Type**: marketplace manifest / **Portable**: partial / **Reason**: The schema is generic, but the owner identity, plugin entry, and source ref are bound to this project. / **Notes**: plugin source uses `skills-dist` from the agent-sop repo.
