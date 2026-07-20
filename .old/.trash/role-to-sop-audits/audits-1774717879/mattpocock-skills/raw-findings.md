
## skills/grill-me/SKILL.md
**Type:** Behavioural / interview protocol
**Portable:** Yes — fully portable, zero repo-specific content
**Reason:** Defines a reusable Socratic stress-testing loop with no project, domain, or toolchain dependencies. The pattern (relentless one-question-at-a-time interrogation, recommendation per question, codebase exploration as a fallback) is universally applicable to any planning or design session.
**Trigger:** User mentions "grill me", wants to stress-test a plan, or asks to interrogate a design decision tree.
**Steps/contract:**
1. Ask questions one at a time, following each branch of the decision tree.
2. For each question, provide a recommended answer before waiting for the user's response.
3. If a question can be answered by exploring the codebase, explore it instead of asking the user.
4. Continue until every branch is resolved and shared understanding is reached.
**Strip:** Nothing — the skill is already minimal; description frontmatter is reusable as-is.
**Structure/format:** Single-paragraph instruction block; extremely terse. No phase structure or output templates — the format is conversational by design.
**Notes:** Identical in intent to the in-repo `skills/grill-me/SKILL.md` in the home agents repo. Both are strong, but this version is marginally more explicit about the "recommended answer per question" contract, which is a useful refinement worth keeping if merging. Low-effort promotion candidate.

## design-an-interface/SKILL.md
**Type:** Workflow (multi-agent parallel design exploration)
**Portable:** Yes
**Reason:** Encodes "Design It Twice" (Ousterhout) as a concrete 5-step process with sub-agent parallelism — entirely language- and domain-agnostic. No repo-specific references.
**Trigger:** User wants to design an API/module interface, explore multiple design options, compare module shapes, or mentions "design it twice".
**Steps/contract:**
1. Gather requirements (callers, operations, constraints, what to hide)
2. Spawn 3+ parallel sub-agents each with a different constraint (minimize methods / maximize flexibility / optimize common case / paradigm inspiration)
3. Each sub-agent outputs: interface signature, usage example, what it hides, trade-offs
4. Present designs sequentially; compare on simplicity, generality, implementation efficiency, depth, ease of correct use
5. Synthesize — ask which design fits the primary use case and whether elements from others are worth incorporating
**Strip:** None — no repo-specific content present
**Structure/format:** Checklist for requirements gathering; prompt template for sub-agents; prose comparison (not tables); evaluation rubric drawn from APOSD
**Notes:** Strong theoretical grounding (APOSD "deep module" criterion). Anti-patterns section actively guards against the most common failure modes (similar designs, skipping comparison, premature implementation). Directly adopted as `design-interface` skill in the local skills tree — verify that adoption preserved the APOSD evaluation criteria.

## git-guardrails-claude-code/SKILL.md
**Type:** Setup / tooling installation
**Portable:** Yes — with minor adjustments
**Reason:** Installs a Claude Code PreToolUse hook to block destructive git commands. Logic is self-contained: a shell script + JSON settings merge. No project-specific values baked in beyond scope (project vs global).
**Trigger:** User wants to prevent destructive git operations, add git safety hooks, or block git push/reset in Claude Code.
**Steps/contract:** 5 steps — (1) ask scope (project vs global), (2) copy bundled shell script to target location and chmod +x, (3) merge hook entry into settings.json PreToolUse array, (4) ask about pattern customisation, (5) verify with echo-pipe test.
**Strip:** Reference to `scripts/block-dangerous-git.sh` bundled path — a receiving repo must either bundle the script or inline it; the link will be broken without it. Step wording is otherwise clean.
**Structure/format:** Clear H2 "What Gets Blocked" list + numbered Steps with inline JSON snippets. Merge-not-overwrite note is explicit and useful.
**Notes:** Strong, concrete SOP. The dependency on a companion shell script (`scripts/block-dangerous-git.sh`) is the only portability friction — recommend either inlining the script content into the SKILL or making step 2 emit it via heredoc. Blocked-command list is explicit and easy to extend. Verification step is a nice close-out pattern worth preserving.

## improve-codebase-architecture/SKILL.md
**Type**: Workflow (multi-step interactive)
**Portable**: Yes — with light stripping
**Reason**: The codebase-exploration-to-RFC pattern is domain-agnostic; John Ousterhout's deep-module framing is universally applicable. No repo-specific tooling baked in except `gh issue create` at the final step.
**Trigger**: User wants to improve architecture, find refactoring opportunities, consolidate tightly-coupled modules, or make a codebase more AI-navigable.
**Steps/contract**:
1. Explore codebase organically (friction = signal); note shallow modules, tight coupling, untestable seams.
2. Present numbered candidate list (cluster, coupling reason, dependency category, test impact). Pause — ask user to pick.
3. User selects candidate.
4. Write user-facing problem-space framing (constraints, dependencies, illustrative sketch). Proceed immediately to step 5 in parallel.
5. Spawn 3+ parallel sub-agents each with a radically different interface design (minimize / maximize flexibility / optimise common caller / ports-and-adapters). Each outputs: signature, usage example, hidden complexity, dependency strategy, trade-offs. Compare in prose, give opinionated recommendation.
6. User picks interface (or accepts recommendation).
7. File refactor RFC as GitHub issue; share URL without asking for pre-review.
**Strip**: References to `REFERENCE.md` (dependency categories, issue template) — either inline the content or link to a portable equivalent; `subagent_type=Explore` (tool-specific); `gh issue create` command (replace with generic "file a tracking issue").
**Structure/format**: Prose with numbered process steps and bold sub-labels per candidate/design. Clean and scannable. Inherits well to a standalone SKILL.md.
**Notes**: Strong opinionated close (step 5 recommendation) is a differentiator worth preserving. The "user reads while sub-agents work" concurrency pattern is a notable UX touch. The `REFERENCE.md` dependency-category taxonomy is referenced but not inlined — need to check that file before finalising portability judgment.

## request-refactor-plan/SKILL.md
**Type**: Workflow (interactive interview → GitHub issue)
**Portable**: Yes
**Reason**: No repo-specific logic; the interview loop, tiny-commit discipline, and issue template are universally applicable to any codebase.
**Trigger**: User wants to plan a refactor, create a refactoring RFC, or break a refactor into safe incremental steps.
**Steps/contract**:
1. Collect long problem description + solution ideas from user.
2. Explore repo to verify assertions and understand current state.
3. Surface alternative options; ask if user considered them.
4. Deep-dive interview on implementation details.
5. Lock exact scope — what changes, what does not.
6. Review test coverage for the affected area; surface gaps.
7. Break work into the smallest possible commits (each leaves codebase working — Fowler principle).
8. File a GitHub issue using the structured template: Problem Statement / Solution / Commits / Decision Document / Testing Decisions / Out of Scope / Further Notes.
**Strip**: None — template sections and interview cadence are all valuable.
**Structure/format**: Numbered steps with optional-skip note; embedded XML issue template with seven named sections; Martin Fowler citation anchors the tiny-commit rule.
**Notes**: Pairs naturally with `tdd` skill (test-coverage step 6) and `cot-gate` (pre-commit reasoning). The "Decision Document" section explicitly bans file paths and code snippets to prevent staleness — a strong, portable rule worth preserving verbatim.

## prd-to-issues/SKILL.md
**Type:** Workflow (interactive, multi-step)
**Portable:** Yes — with minor adaptation
**Reason:** Pure process SOP for decomposing a PRD into vertical-slice GitHub issues. GitHub-specific only in step 5 (`gh issue create`) and the issue-body template; the decomposition logic, HITL/AFK typing, dependency ordering, and quiz loop are all platform-agnostic.
**Trigger:** User wants to convert a PRD into implementation tickets / work items; mentions "tracer bullets", "break down a PRD", "create issues from PRD".
**Steps/contract:**
1. Locate PRD (fetch via `gh issue view <n>` or accept from context)
2. Optionally explore codebase for current-state awareness
3. Draft tracer-bullet vertical slices (HITL vs AFK, each slice = complete end-to-end path through all layers, demoable on its own)
4. Quiz user on granularity, deps, HITL/AFK assignments; iterate until approved
5. Create GitHub issues in dependency order; each issue uses a structured template (Parent PRD, What to build, Acceptance criteria, Blocked by, User stories addressed)
**Strip:** `gh issue create` call and the GitHub issue-body template — replace with equivalent if targeting a different tracker (Linear, Jira, plain Markdown, etc.).
**Structure/format:** Numbered process steps; XML fence `<vertical-slice-rules>` for slice constraints; `<issue-template>` fence for output format. Clean and copy-ready.
**Notes:** The HITL/AFK slice-type taxonomy is a standout portable concept worth preserving verbatim. Vertical-slice rules are tight and reusable. Dependency-order creation (blockers first so real issue numbers can be referenced) is a small but valuable implementation detail.

## prd-to-plan/SKILL.md
**Type**: Workflow / process SOP
**Portable**: Yes
**Reason**: Pure process — no repo-specific paths, tooling, or framework assumptions beyond a `./plans/` output directory convention that is itself parameterisable. Vertical-slice decomposition and tracer-bullet methodology are universally applicable to any software project with a PRD.
**Trigger**: User wants to break down a PRD into an implementation plan, plan phases from a PRD, create a multi-phase breakdown, or mentions "tracer bullets".
**Steps/contract**:
1. Confirm PRD is in context (or ask user to paste/point to it).
2. Explore the codebase to understand current architecture and integration layers.
3. Identify durable architectural decisions (routes, schema, models, auth, 3P boundaries) — placed in plan header.
4. Draft vertical slices as tracer bullets: each slice cuts end-to-end through all layers, is independently demoable, avoids volatile implementation details.
5. Quiz user on granularity; iterate until approved.
6. Write `./plans/<feature>.md` using the prescribed template (feature name, source PRD reference, architectural decisions block, repeating phase sections each with user stories / what-to-build / acceptance criteria checklist).
**Strip**: Nothing material to strip — no repo-specific references, no hardcoded tool names.
**Structure/format**: Well-structured. Clear numbered process, embedded `<vertical-slice-rules>` XML block with five explicit rules, and a `<plan-template>` XML block giving the exact Markdown output format. Template is thorough without being prescriptive about implementation details.
**Notes**: Strong candidate. The vertical-slice rules section is the most distinctive and portable asset — it encodes the "why tracer bullets" rationale (completeness per layer, demoability, thin over thick). Minor improvement opportunity: step 3 (codebase exploration) could be made conditional ("if a codebase exists") so the SOP applies equally to greenfield projects. Output path `./plans/` is a sensible convention but should be noted as configurable.

## qa/SKILL.md

**Type:** Interactive workflow (conversational bug-reporting → GitHub issue filing)
**Portable:** Yes — with minor repo-tool assumptions
**Reason:** Workflow is purely behavioural: listen, clarify, explore context, assess scope, file structured issues. No project-specific logic; only dependency is `gh issue create` and an optional `UBIQUITOUS_LANGUAGE.md` file.
**Trigger:** User wants to report bugs, do QA, file issues conversationally, or says "QA session".
**Steps/contract:**
1. Listen and lightly clarify (≤ 2–3 questions: expected vs actual, repro steps, consistency).
2. Background codebase explore — learn domain language and feature boundary; do NOT seek a fix; do NOT reference internals in the issue.
3. Assess scope: single issue vs breakdown (multiple separable concerns, parallel workstreams).
4. File via `gh issue create` without asking for review first; share URLs immediately.
   - Single-issue template: What happened / What I expected / Steps to reproduce / Additional context.
   - Breakdown template: Parent issue / What's wrong / What I expected / Steps / Blocked by / Additional context — create in dependency order, maximise parallelism.
   - Rules for all bodies: no file paths or line numbers; use domain language; behaviours not code; mandatory repro steps; 30-second read target.
5. Print all issue URLs (with blocking relationships), then ask "Next issue, or are we done?"
**Strip:** `gh issue create` CLI call — swap for any issue-tracker API (Jira, Linear, GitHub REST) on adoption. Reference to `UBIQUITOUS_LANGUAGE.md` is advisory; remove if project has no such file.
**Structure/format:** Well-structured. Clear numbered phases, inline issue-body templates with concrete field names, explicit decision criteria for single-vs-breakdown, rules callout block. Highly readable.
**Notes:** The "explore in background" step is a subagent hint (subagent_type=Explore) that may need adapting for environments without parallel tool calls. The issue-writing rules (no file paths, domain language, behaviour-focused) are the most portable and durable part — worth extracting as a standalone rule if not adopting the full QA workflow. Breakdown guidance (dependency order, maximise parallelism) is genuinely strong SOP material rarely captured this explicitly elsewhere.

## triage-issue/SKILL.md
**Type:** Agentic workflow (investigation + GitHub issue creation)
**Portable:** Yes
**Reason:** The bug-triage-to-issue pipeline is universally applicable across repos. Only coupling is `gh issue create` CLI and TDD fix-plan framing — both widely reusable.
**Trigger:** User reports a bug, mentions "triage", wants to file an issue, or asks to investigate and plan a fix for a problem.
**Steps/contract:**
1. Capture problem (ask ONE question max)
2. Explore/diagnose (source files, git log, error handling, similar patterns, existing tests)
3. Identify fix approach (minimal change, affected modules, regression vs design flaw)
4. Design TDD fix plan — RED-GREEN cycles targeting public interfaces/observable behaviour; durability rule: describe contracts not diffs
5. Create GitHub issue via `gh issue create` without asking user to review first; print URL + one-line root cause summary
**Strip:** Nothing — workflow is fully portable; `gh issue create` is a universal dependency
**Structure/format:** Structured issue template with sections: Problem, Root Cause Analysis (no file paths/line numbers), TDD Fix Plan (numbered RED-GREEN cycles + REFACTOR), Acceptance Criteria checkboxes
**Notes:** Strong durability principle baked into TDD plan ("describe behaviors and contracts, not internal structure; tests assert on observable outcomes"). The "no file paths in issue" rule is a standout portable SOP worth preserving verbatim. Complements `cot-gate` and `tdd` skills well.

## ubiquitous-language/SKILL.md / **SOP** / **Portable: Yes** / **Reason**: Self-contained workflow for extracting DDD glossaries from conversation context; no repo-specific dependencies — output path (`UBIQUITOUS_LANGUAGE.md`) is parameterisable by working directory / **Trigger**: User wants to define domain terms, build a glossary, harden terminology, mentions "domain model" or "DDD" / **Steps/contract**: (1) Scan conversation for domain nouns/verbs/concepts → (2) Identify ambiguities, synonyms, overloaded terms → (3) Propose canonical glossary with opinionated term choices → (4) Write `UBIQUITOUS_LANGUAGE.md` (grouped tables: Term | Definition | Aliases to avoid; Relationships section; Example dialogue 3–5 exchanges; Flagged ambiguities) → (5) Output inline summary; re-run merges into existing file / **Strip**: Nothing — no repo-specific content; the example dialogue uses a generic sync-service domain, safe to keep as illustrative reference / **Structure/format**: Well-structured; frontmatter, numbered process, output format spec with full markdown template, opinionated rules list, re-running section — exemplary SOP layout / **Notes**: Strong "be opinionated" and "flag conflicts explicitly" rules elevate this above a generic glossary template; the example dialogue section is a differentiator that teaches correct term usage in context; directly mirrors the local `skills/ubiquitous-language/SKILL.md` — compare on merge to see if local version has drifted

## setup-pre-commit/SKILL.md
**Type:** Tool-setup SOP
**Portable:** Yes
**Reason:** Fully self-contained setup recipe for Husky + lint-staged + Prettier pre-commit hooks. Zero repo-specific content — all steps are universal for any Node/TS project. Package-manager detection logic is generic and well-specified.
**Trigger:** User wants to add pre-commit hooks, set up Husky, configure lint-staged, or add commit-time formatting/typechecking/testing.
**Steps/contract:** 8 ordered steps — (1) detect package manager, (2) install husky/lint-staged/prettier as devDeps, (3) `npx husky init`, (4) write `.husky/pre-commit` with lint-staged + typecheck + test, (5) create `.lintstagedrc`, (6) create `.prettierrc` if absent, (7) verify checklist, (8) stage & commit as smoke test.
**Strip:** Nothing to strip — no repo-specific paths, names, or org details.
**Structure/format:** Frontmatter name+description → What-this-sets-up summary → numbered Steps with code blocks → verification checklist → commit step → Notes. Clean and actionable.
**Notes:** Targets Husky v9+ (no shebang needed). Adapt step correctly notes to omit typecheck/test lines if scripts are absent. Step 8 doubles as a smoke test, which is a nice contract touch. Minor gap: no guidance on monorepo root vs. package-level placement, but acceptable for a portable SOP.

## tdd/SKILL.md
**Type:** Workflow / Protocol
**Portable:** Yes
**Reason:** Framework-agnostic TDD methodology. No tool, language, or repo-specific references in the core content. Cross-references (`tests.md`, `mocking.md`, `deep-modules.md`, `interface-design.md`, `refactoring.md`) are intra-repo links that would need stripping or flattening, but the protocol itself is self-contained.
**Trigger:** User wants to build features or fix bugs using TDD, mentions "red-green-refactor", wants integration tests, or asks for test-first development.
**Steps/contract:**
1. Planning — confirm interface changes, list behaviors to test, get user approval.
2. Tracer Bullet — write ONE failing test for ONE behavior, then minimal code to pass.
3. Incremental Loop — repeat RED→GREEN one behavior at a time; no speculation.
4. Refactor — extract duplication, deepen modules, apply SOLID; run tests after each step; never refactor while RED.
Per-cycle checklist: test describes behavior (not implementation); uses public interface only; survives internal refactor; code is minimal; no speculative features.
**Strip:** Relative cross-reference links (`tests.md`, `mocking.md`, `deep-modules.md`, `interface-design.md`, `refactoring.md`) — either inline the key guidance or drop the links.
**Structure/format:** Markdown with philosophy narrative, an anti-pattern block with ASCII diagram, four numbered workflow phases with checklists, and a per-cycle checklist code block. Clean and well-structured.
**Notes:** Strong "vertical slice / tracer bullet" framing with an explicit anti-pattern section against horizontal slicing. The per-cycle checklist is immediately usable as-is. Philosophy section ("tests verify behavior through public interfaces, not implementation details") is portable signal worth preserving verbatim. High-value candidate.

## `write-a-skill/SKILL.md`
**Type:** Meta / skill-authoring process
**Portable:** Yes — generic skill-creation SOP, no repo-specific tooling
**Reason:** Covers gather-requirements → draft → review loop with explicit structure guidance, description requirements, file-splitting heuristics, and a review checklist. All rules are universal to any skill-based agent system.
**Trigger:** User wants to create, write, or build a new agent skill
**Steps/contract:**
1. Gather requirements (domain, use cases, scripts needed, reference materials)
2. Draft SKILL.md + optional REFERENCE.md / EXAMPLES.md / scripts/
3. Review draft with user (coverage, gaps, detail level)
Review checklist: description has triggers · SKILL.md ≤ 100 lines · no time-sensitive info · consistent terminology · concrete examples · refs one level deep
**Strip:** Nothing — fully repo-agnostic
**Structure/format:** Folder layout diagram + SKILL.md template + description rules (max 1024 chars, third person, "Use when …") + when-to-add-scripts + when-to-split-files + review checklist
**Notes:** Strong match with the existing `skill-create` skill in this repo; the description-quality guidance (good/bad examples, 1024-char cap, third-person) is the most portable differentiator worth extracting. Scripts-vs-inline-code heuristic is a useful addition absent from some equivalents.

## mattpocock-skills/write-a-prd/SKILL.md
**Type:** Workflow (multi-step interview → artefact)
**Portable:** Yes — minor adaptation needed
**Reason:** Solid structured PRD workflow: relentless user interview, codebase exploration, module design with deep-vs-shallow framing, then templated output. The template itself (Problem Statement, Solution, User Stories, Implementation Decisions, Testing Decisions, Out of Scope, Further Notes) is clean and repo-agnostic. Only repo-coupling is the final "submit as a GitHub issue" step — easily made optional or swappable.
**Trigger:** User wants to write a PRD, create a product requirements document, or plan a new feature.
**Steps/contract:**
1. Elicit a long, detailed problem description and solution ideas from the user.
2. Explore the repo to verify assertions and understand codebase state.
3. Interview relentlessly until shared understanding is reached — walk each branch of the design tree, resolving decision dependencies one-by-one.
4. Sketch major modules to build/modify; actively seek deep modules (rich functionality, simple testable interface). Confirm with user which modules need tests.
5. Write the PRD using the template (Problem Statement / Solution / User Stories / Implementation Decisions / Testing Decisions / Out of Scope / Further Notes) and submit as a GitHub issue.
**Strip:** "submit as a GitHub issue" — make it conditional/optional so the skill works in non-GitHub contexts.
**Structure/format:** Named `<prd-template>` XML block with labelled H2 sections. User Stories require a long numbered list in "As a <actor>, I want <feature>, so that <benefit>" format. Implementation Decisions explicitly excludes file paths and code snippets (good discipline). Testing Decisions focuses on external-behaviour testing and prior art.
**Notes:** The deep-module framing in step 4 is a differentiator worth preserving verbatim — it gives the agent concrete architectural guidance most PRD skills lack. "You may skip steps if you don't consider them necessary" is permissive but risks shortcuts; the local `prd-create` skill may tighten this. Cross-reference with local `skills/prd-create/SKILL.md` before promoting.

## mattpocock-skills/edit-article/SKILL.md
**Type:** Workflow (interactive, iterative)
**Portable:** Yes
**Reason:** Pure editorial process — no repo-specific tooling, APIs, or file paths. Applies to any article-editing task regardless of domain or stack.
**Trigger:** User wants to edit, revise, or improve an article draft.
**Steps/contract:**
1. Divide article into sections by heading; map dependency order (DAG model); confirm sections with user.
2. For each section: rewrite for clarity, coherence, and flow; cap paragraphs at 240 characters.
**Strip:** Nothing — no repo-specific references present.
**Structure/format:** Numbered steps (1, 2a); very concise (no fluff). Missing: no output format spec, no "done" signal, no examples.
**Notes:** The DAG framing for section ordering is a strong, transferable heuristic. The 240-char paragraph cap is an opinionated but concrete constraint worth preserving. Workflow is minimal — could benefit from a step that asks the user for editorial goals/tone before rewriting begins.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/mattpocock-skills/tdd/tests.md / **Type**: doc / **Portable**: yes / **Reason**: It defines behavior-first test guidance that applies across codebases. / **Notes**: Test observable behavior through the public API; keep one logical assertion per test.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/mattpocock-skills/tdd/mocking.md / **Type**: doc / **Portable**: yes / **Reason**: The boundary-only mocking rule and dependency-injection advice are broadly reusable. / **Notes**: Mock system boundaries, not internal collaborators; prefer SDK-style interfaces.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/mattpocock-skills/tdd/deep-modules.md / **Type**: doc / **Portable**: yes / **Reason**: The deep-module principle is a general architectural heuristic rather than a repo-specific instruction. / **Notes**: Favor small interfaces with complex hidden implementation.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/mattpocock-skills/tdd/interface-design.md / **Type**: doc / **Portable**: yes / **Reason**: It captures testable interface design principles that transfer well to other systems. / **Notes**: Accept dependencies, return results, and keep the surface area small.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/mattpocock-skills/tdd/refactoring.md / **Type**: doc / **Portable**: yes / **Reason**: The refactor-candidate checklist is a universal follow-on to TDD-driven change. / **Notes**: Watch for duplication, long methods, shallow modules, feature envy, and primitive obsession.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/mattpocock-skills/improve-codebase-architecture/REFERENCE.md / **Type**: reference / **Portable**: yes / **Reason**: It gives a durable taxonomy for dependency handling and a reusable issue template for architecture work. / **Notes**: Classify dependencies as in-process, local-substitutable, remote-owned, or true external.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/mattpocock-skills/git-guardrails-claude-code/scripts/block-dangerous-git.sh / **Type**: script / **Portable**: partial / **Reason**: The blocking pattern is reusable, but the script is wired to a specific command payload shape and environment. / **Notes**: Regex-block dangerous git commands before execution.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/mattpocock-skills/obsidian-vault/SKILL.md / **Type**: skill / **Portable**: no / **Reason**: It is anchored to a specific Obsidian vault path and vault naming workflow. / **Notes**: Use Title Case note names, wikilinks, and index notes in the configured vault.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/mattpocock-skills/scaffold-exercises/SKILL.md / **Type**: skill / **Portable**: partial / **Reason**: The exercise-scaffolding pattern transfers, but the directory rules and lint command are repo/tooling-specific. / **Notes**: Scaffold section/exercise folders with readme stubs, then validate with lint.

## /Users/mia/.agents/.worktrees/role-to-sop/.references/mattpocock-skills/migrate-to-shoehorn/SKILL.md / **Type**: skill / **Portable**: partial / **Reason**: The migration workflow is useful beyond one repo, but it is tightly coupled to the shoehorn library and TypeScript test code. / **Notes**: Replace `as` assertions with `fromPartial()` or `fromAny()` in tests.
