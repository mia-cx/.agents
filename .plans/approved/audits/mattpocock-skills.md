# Role-to-SOP Audit — mattpocock-skills
**Source repo**: `.references/mattpocock-skills/`
**Auditor**: worker-agent (chain step 2)
**Date**: 2026-03-28
**Input**: `raw-findings.md` (25 entries across 18 source files)

---

## 1. Repo Overview

The `mattpocock-skills` repository is a personal agent-skills library assembled by Matt Pocock for use with Claude Code and compatible LLM harnesses. It contains 18 skill/reference files organized into named skill directories, each following a consistent SKILL.md + optional REFERENCE.md + optional scripts/ pattern. The library covers the full software-development lifecycle: requirements (PRD, issue triage, QA), architecture (codebase improvement, interface design, deep modules), testing (TDD, mocking, test quality), workflow automation (pre-commit hooks, git guardrails, refactor planning), documentation (article editing, ubiquitous language), and meta-tooling (write-a-skill). Two skills are repo-specific and non-portable: `obsidian-vault` (hardcoded Windows/WSL path) and `scaffold-exercises` (tied to the `ai-hero-cli` monorepo and its proprietary linter). The remaining 16 skills and all reference fragments are fully or conditionally portable. A recurring structural pattern across all portable skills is the use of `gh issue create` as a terminal delivery step, making the GitHub CLI an implicit shared dependency. The library is a strong source for cross-repo SOP extraction: it is already written in a transferable, minimally-opinionated format with low prose overhead.

---

## 2. Content Summary

| Directory | Files assessed | Type |
|---|---|---|
| `edit-article/` | SKILL.md | Workflow SOP |
| `design-an-interface/` | SKILL.md | Workflow SOP |
| `git-guardrails-claude-code/` | SKILL.md, scripts/block-dangerous-git.sh | Setup SOP + bash script |
| `grill-me/` | SKILL.md | Workflow SOP |
| `migrate-to-shoehorn/` | SKILL.md | Migration SOP |
| `improve-codebase-architecture/` | SKILL.md, REFERENCE.md | Workflow SOP + reference |
| `prd-to-plan/` | SKILL.md | Workflow SOP |
| `qa/` | SKILL.md | Workflow SOP |
| `prd-to-issues/` | SKILL.md | Workflow SOP |
| `obsidian-vault/` | SKILL.md | Environment config (non-portable) |
| `request-refactor-plan/` | SKILL.md | Workflow SOP |
| `scaffold-exercises/` | SKILL.md | Scaffolding (non-portable) |
| `setup-pre-commit/` | SKILL.md | Setup SOP |
| `tdd/` | SKILL.md, tests.md, interface-design.md, deep-modules.md, mocking.md, refactoring.md | Workflow SOP + 5 reference fragments |
| `triage-issue/` | SKILL.md | Workflow SOP |
| `ubiquitous-language/` | SKILL.md | Workflow SOP |
| `write-a-prd/` | SKILL.md | Workflow SOP |
| `write-a-skill/` | SKILL.md | Meta-skill SOP |

**Total files assessed**: 25 (18 SKILL.md / reference files + 1 bash script)
**Fully portable skills**: 14 standalone SOPs
**Conditionally portable**: 2 (migrate-to-shoehorn — TypeScript only; deep-modules — too thin to stand alone)
**Reference fragments (inline rather than promote)**: 5 (tdd/tests.md, tdd/interface-design.md, tdd/deep-modules.md, tdd/mocking.md, tdd/refactoring.md)
**Non-portable / leave out**: 2 (obsidian-vault, scaffold-exercises)

---

## 3. SOP Split — Port vs Leave Out

### Port (promote or incorporate)

| Skill | Reason |
|---|---|
| `edit-article` | Domain-agnostic DAG-ordering heuristic + 240-char paragraph constraint. Already minimal; high signal-to-noise. |
| `design-an-interface` | Enforced divergent parallel design ("Design It Twice") with preset constraint archetypes. Framework-agnostic; no implementation code produced. |
| `git-guardrails-claude-code` | Pure safety guardrail. Hook mechanism + script pattern applies to any Claude Code project. Requires inlining the script body for standalone portability. |
| `grill-me` | Socratic one-question-at-a-time interview with recommended-answer requirement. ~60 words; highest signal-to-noise in the repo. Check delta against existing `skills/grill-me/SKILL.md` before promoting. |
| `migrate-to-shoehorn` | Conditional — TypeScript projects only. Three-pattern mapping is precise and executable. Strong match to existing `test-migrate-shoehorn` skill; diff for delta (grep command, fromExact() note). |
| `improve-codebase-architecture` | Superset of `design-an-interface`: adds upstream friction-signal discovery phase and downstream RFC creation. REFERENCE.md dependency must be inlined. |
| `improve-codebase-architecture/REFERENCE.md` | Dependency taxonomy + "replace, don't layer" testing principle + RFC issue template. Inline into parent SOP on promotion. |
| `prd-to-plan` | Tracer-bullet vertical-slice discipline + durable-decisions-upfront rule. Close match to existing `prd-to-plan`; check delta (ephemeral-names rule). |
| `qa` | Multi-turn conversational bug-reporting and issue-filing session. "No file paths in issues" rule is standout portable constraint. Distinct from `issue-triage` by session model. |
| `prd-to-issues` | Tracer-bullet PRD decomposition with HITL/AFK classification. Close match to existing `prd-to-issues`; check delta (dependency-ordering instruction, parent-PRD guardrail). |
| `request-refactor-plan` | 8-step interview-then-document pattern with test-coverage gate and tiny-commits philosophy. Close match to existing `refactor-plan`; check delta (step 6 coverage gate, "no paths in Decision Document" rule). |
| `setup-pre-commit` | Complete, reproducible recipe for Husky v9 + lint-staged + Prettier with PM detection. Close match to existing `setup-pre-commit`; check delta (Husky v9 shebang-free hook, commit-as-smoke-test). |
| `tdd` | Red-green-refactor loop with vertical-slice discipline, horizontal-slicing anti-pattern block, and per-cycle checklist. Close match to existing `tdd`; check delta (anti-pattern ASCII diagram, "outrun your headlights" framing). Companion fragment references (tests.md etc.) must be inlined or dropped. |
| `triage-issue` | End-to-end bug triage: investigate → TDD plan → GitHub issue. "Good suggestion reads like a spec, not a diff" rule is standout portable insight. |
| `ubiquitous-language` | DDD glossary extraction with flagged-ambiguities section and "aliases to avoid" column. Strong match to existing `ubiquitous-language`; confirm all three standout elements are present in destination. |
| `write-a-prd` | Interview-driven PRD with deep-module sketching step. Close match to existing `prd-create`; check delta (decision-tree interview framing, Testing Decisions as first-class section). |
| `write-a-skill` | Meta-SOP for authoring skills. 100-line body limit + description-as-trigger-signal framing + scripts-for-deterministic-ops rationale. Close match to existing `skill-create`; check delta on all three standout elements. |
| `tdd/tests.md` | Good-test vs bad-test pattern catalogue. Inline into `tdd` SOP as "What a Valid Test Looks Like" sub-section. |
| `tdd/mocking.md` | Boundary-only mocking + SDK-style interface design-for-mockability. Inline into `tdd` SOP or `codebase-architecture` SOP as "Mocking" sub-section. |
| `tdd/refactoring.md` | 6-smell post-green refactor checklist. Inline into `tdd` SOP as "Refactor" checklist. |

### Leave Out

| Skill | Reason |
|---|---|
| `obsidian-vault` | Hardcoded Windows/WSL absolute path (`/mnt/d/Obsidian Vault/AI Research/`). Machine-specific bash commands. Not a shared process SOP — personal note-taking convention. |
| `scaffold-exercises` | Every concrete detail (directory schema, `pnpm ai-hero-cli internal lint` command, the `ai-hero` CLI) is tied to a single proprietary course repo. Remaining generic pattern ("scaffold → lint → commit") is too thin to stand alone. |
| `tdd/interface-design.md` | Three testability principles (inject deps, return results, minimise surface). Too thin to stand alone. Content partially covered by `design-an-interface`; add orthogonal testability lens as a footnote if absent from destination. |
| `tdd/deep-modules.md` | Concept note only — no workflow steps, no trigger, no procedural contract. Already invoked by name in `improve-codebase-architecture`. Inline the three design questions as a callout block inside the architecture SOP rather than promoting independently. |

---

## 4. Per-SOP Table

| Source file | Trigger | Steps / contract | Quality bar | Escalation | Strip | Notes |
|---|---|---|---|---|---|---|
| `edit-article/SKILL.md` | User wants to edit, revise, or improve an article draft | (1) Divide into sections; model order as DAG; confirm with user. (2) For each section: rewrite for clarity + flow; enforce ≤240 chars/paragraph | Confirmed section order; all paragraphs ≤240 chars; user sign-off on each section | None stated — no review step; gap worth adding | Nothing | Lacks explicit voice/tone preservation step. DAG metaphor is standout. |
| `design-an-interface/SKILL.md` | User wants to design an API, explore interface options, or says "design it twice" | (1) Gather requirements (5 questions). (2) Spawn ≥3 parallel sub-agents, each with a divergent constraint. (3) Present designs sequentially. (4) Compare on 4 axes. (5) Synthesize + invite cherry-pick | ≥3 designs presented; each returns signature + usage example + trade-offs; comparison mandatory | None stated | Book citation in eval criteria (cosmetic) | "Don't implement" guardrail must be preserved verbatim. |
| `git-guardrails-claude-code/SKILL.md` | User wants to block destructive git commands in Claude Code | (1) Ask scope (project vs global). (2) Copy script + chmod +x. (3) Merge hook entry into settings.json. (4) Offer pattern customization. (5) Verify via echo pipe test | exit-code 2 + BLOCKED output on test command; no overwrite of existing settings keys | None stated | Inline script body (currently references bundled file) | "Merge, don't overwrite" instruction must be preserved. |
| `git-guardrails-claude-code/scripts/block-dangerous-git.sh` | PreToolUse hook fires on every Bash tool call | (1) Read stdin JSON. (2) Extract `.tool_input.command` via jq. (3) Pattern-match DANGEROUS_PATTERNS. (4) Match → exit 2 + stderr message; no match → exit 0 | exit 2 on any dangerous pattern; exit 0 otherwise; message attributes block to user | None (hard block, no allowlist) | Nothing — already minimal | Blocking message wording ("The user has prevented you") is intentional UX. |
| `grill-me/SKILL.md` | User wants to stress-test a plan or says "grill me" | (1) Interview relentlessly on every aspect. (2) Walk decision-tree branch-by-branch, resolving dependencies in order. (3) Each question includes a recommended answer. (4) One question at a time. (5) Explore codebase instead of asking when possible | Every decision-tree branch resolved; user has a recommended answer for each | None stated | Nothing (~60 words body) | Near-identical to existing `grill-me`; check for delta before promoting. |
| `migrate-to-shoehorn/SKILL.md` | User wants to migrate `as` assertions from test files; TypeScript project | (1) Gather: affected files, partial vs wrong data. (2) Install `@total-typescript/shoehorn`. (3) Discover with grep. (4) Replace `as Type` → `fromPartial()`. (5) Replace `as unknown as Type` → `fromAny()`. (6) Add imports. (7) Run type check | Clean type check; no `as` casts remain in targeted test files | None stated | "Why shoehorn?" motivation section; fromExact() footnote | "Test code only, never production" guardrail must be preserved. |
| `improve-codebase-architecture/SKILL.md` | User wants to improve architecture, make codebase more testable/AI-navigable | (1) Organic exploration (note friction). (2) Present numbered deepening candidates. (3) User picks. (4) Frame constraints + code sketch. (5) Spawn ≥3 parallel sub-agents (minimize / maximize / optimize / ports-adapters). (6) User picks interface. (7) File RFC via `gh issue create` | RFC issue created with URL printed; ≥3 interface designs compared; user sign-off before issue creation is waived | GitHub CLI must be available | REFERENCE.md must be inlined; replace Claude-internal `Agent tool` phrasing | Superset of `design-an-interface`. "Friction you encounter IS the signal" must be preserved. |
| `improve-codebase-architecture/REFERENCE.md` | Supporting reference for architecture SOP (not independently triggered) | (1) Classify dependency (4 categories). (2) Apply "replace, don't layer" testing principle. (3) Use 5-section issue template | Dependency correctly classified; old shallow-module tests deleted after boundary tests exist | None stated | XML `<issue-template>` wrapper (formatting artifact) | Inline into parent SOP. "Replace, don't layer" must be preserved verbatim. |
| `prd-to-plan/SKILL.md` | User wants a phased implementation plan from a PRD | (1) Confirm PRD in context. (2) Explore codebase for patterns. (3) Identify durable architectural decisions. (4) Draft tracer-bullet phases. (5) Quiz user + iterate. (6) Write `./plans/<feature>.md` | Each phase is thin, complete, end-to-end, demoable; no ephemeral file/function names in plan | User approval of phases required before writing | Hard-coded `./plans/` path (make configurable) | "Explore codebase" step may not apply outside code contexts. Check delta vs existing `prd-to-plan`. |
| `qa/SKILL.md` | User wants to report bugs, run a QA pass, or says "QA session" | (1) Listen + ≤3 clarifying questions. (2) Background codebase explore (domain language only, no fix). (3) Scope decision (single vs breakdown). (4) File via `gh issue create` without review gate; share URL. (5) Print URLs with blocking relationships; ask "Next issue or done?" | Issues use domain language, no file paths, no line numbers, ≤30-second read; repro steps mandatory | None stated — "next issue or done?" loop handles pacing | Breakdown parent-issue "Reported during QA session" fallback (noise) | Background exploration must stay separate from issue body. |
| `prd-to-issues/SKILL.md` | User wants to convert a PRD to GitHub issues | (1) Locate PRD (gh issue view). (2) Optional codebase exploration. (3) Draft vertical slices with HITL/AFK labels. (4) Quiz user (title / type / blocked-by / user-stories). (5) Create issues in dependency order | Issues created in dependency order; each independently demoable/verifiable; parent PRD not modified | GitHub CLI required | Nothing structural; HITL/AFK is contextual footnote for non-agentic use | "Do NOT close or modify the parent PRD issue" guardrail must be preserved. |
| `request-refactor-plan/SKILL.md` | User wants to plan a refactor or create a refactoring RFC | (1) Gather long-form problem + candidate solutions. (2) Explore codebase to verify assertions. (3) Surface and discuss alternatives. (4) Deep implementation interview. (5) Nail exact scope. (6) Check test coverage; if insufficient, ask testing plan. (7) Tiny commits breakdown. (8) File GitHub issue with 7-section template | 7-section issue filed; test coverage addressed; no file paths or code snippets in Decision Document | User must provide testing plan when coverage is insufficient (step 6) | "You may skip steps" permissiveness — replace with explicit skip conditions | "No file paths / no code snippets in Decision Document" must be preserved. |
| `setup-pre-commit/SKILL.md` | User wants to add pre-commit hooks or set up Husky | (1) Detect PM from lockfile. (2) Install husky + lint-staged + prettier. (3) husky init. (4) Write .husky/pre-commit. (5) Write .lintstagedrc. (6) Write .prettierrc if absent. (7) Verify (file existence + executability + manual run). (8) Commit all files | Clean lint-staged run; hook fires on commit; typecheck/test lines present only if scripts exist | None stated | Nothing — already lean | Commit-as-smoke-test (step 8) is self-verifying closure; preserve verbatim. |
| `tdd/SKILL.md` | User wants TDD, mentions "red-green-refactor", or asks for test-first development | (1) Plan: confirm interfaces, prioritize behaviors, identify deep-module opportunities, get approval. (2) Tracer bullet: one test → RED → minimal code → GREEN. (3) Incremental loop: one behavior at a time, public interface only. (4) Refactor: after all GREEN, extract duplication, deepen modules | All tests GREEN before refactor; per-cycle checklist satisfied; no refactor while RED | User approval required before writing code (step 1) | Companion-file cross-references (tests.md, mocking.md, etc.) — inline or drop | Horizontal-slicing anti-pattern block is standout high-signal content. |
| `triage-issue/SKILL.md` | User reports a bug, wants to file an issue, or says "triage" | (1) One-sentence problem; one question max; investigate immediately. (2) Deep codebase explore (locate, trace, root cause, tests, git history). (3) Determine fix approach. (4) Design ordered RED-GREEN TDD cycles. (5) gh issue create without review gate; print URL + one-line root cause | Issue filed with canonical template; root cause identified; TDD cycles defined; "reads like a spec, not a diff" | None stated for ambiguous root cause — gap | Sub-agent `Agent tool` phrasing (replace with generic parallel-execution framing) | "Create immediately, no review gate" is an opinionated but coherent named decision. |
| `ubiquitous-language/SKILL.md` | User wants to define domain terms, build a glossary, or mentions "DDD" | (1) Scan conversation for domain terms. (2) Identify ambiguity / synonym / overloaded-term problems. (3) Propose canonical glossary (one winner per concept, aliases listed). (4) Write UBIQUITOUS_LANGUAGE.md. (5) Output inline summary. Re-run: read existing file, incorporate + update + re-flag | Flagged ambiguities section present; "aliases to avoid" column populated; example dialogue (3–5 exchanges) included | None stated | Illustrative `<example>` block + domain-specific table examples (replaceable scaffolding) | Three standout elements must be preserved: flagged-ambiguities section, aliases-to-avoid column, required example dialogue. |
| `write-a-prd/SKILL.md` | User wants to write a PRD or plan a new feature | (1) Long-form problem gather. (2) Codebase exploration. (3) Relentless multi-branch interview (one question at a time, decision-tree order). (4) Sketch deep-module opportunities; confirm modules + testing scope. (5) Write 7-section PRD and file as GitHub issue | 7-section PRD filed; Testing Decisions present as first-class section; no file paths or code snippets in Implementation Decisions | User sign-off on module list and testing scope required before writing (step 4) | "You may skip steps" permissiveness — replace with explicit skip conditions; `<prd-template>` XML wrapper | "Decision-tree interview" framing + deep-module sketching step + Testing Decisions section are standout deltas vs generic PRD workflows. |
| `write-a-skill/SKILL.md` | User wants to create or build a new agent skill | (1) Gather: domain, use cases, scripts needed, reference materials. (2) Draft SKILL.md (required) + optional REFERENCE.md / EXAMPLES.md / scripts/. (3) Review with user (3 targeted questions). Structural rules: description ≤1024 chars, body ≤100 lines, split for distinct domains | SKILL.md body ≤100 lines; description written in third person; first sentence = capability; second sentence = "Use when [triggers]" | None stated | "Bad example" annotation (condensable); justification paragraph for the 1024-char limit | "Description is the only thing your agent sees" insight is the standout; preserving the 100-line threshold and scripts-reliability rationale. |

---

## 5. Portability Ranking

### High — promote as standalone SOP (minimal adaptation)

- `grill-me/SKILL.md` — already at minimum viable size; essentially format-complete
- `design-an-interface/SKILL.md` — self-contained; single prerequisite (drop book citation)
- `setup-pre-commit/SKILL.md` — complete, step-by-step, PM-agnostic
- `ubiquitous-language/SKILL.md` — strong format, concrete rules, no external dependencies
- `triage-issue/SKILL.md` — clear contract, reusable template, one named gap (ambiguous root cause)
- `qa/SKILL.md` — complete session model, distinctive multi-turn framing
- `git-guardrails-claude-code/SKILL.md` + `scripts/block-dangerous-git.sh` — single inlining prerequisite

### Medium — promote after resolving one clear prerequisite

- `improve-codebase-architecture/SKILL.md` — must inline REFERENCE.md; replace Claude-internal phrasing
- `tdd/SKILL.md` — must inline or drop 5 companion-file references
- `write-a-prd/SKILL.md` — diff against existing `prd-create` to confirm delta
- `write-a-skill/SKILL.md` — diff against existing `skill-create` to confirm delta
- `request-refactor-plan/SKILL.md` — diff against existing `refactor-plan` to confirm delta
- `prd-to-issues/SKILL.md` — diff against existing `prd-to-issues` to confirm delta
- `prd-to-plan/SKILL.md` — diff against existing `prd-to-plan`; make output path configurable
- `edit-article/SKILL.md` — add voice/tone preservation step before promoting

### Partial — inline into a parent SOP rather than promote independently

- `improve-codebase-architecture/REFERENCE.md` — inline into architecture SOP
- `tdd/tests.md` — inline into TDD SOP
- `tdd/mocking.md` — inline into TDD SOP or architecture SOP
- `tdd/refactoring.md` — inline into TDD SOP as refactor checklist
- `tdd/interface-design.md` — footnote in `design-an-interface` or TDD SOP
- `tdd/deep-modules.md` — three design questions as callout block in architecture SOP
- `migrate-to-shoehorn/SKILL.md` — conditional; compare against existing `test-migrate-shoehorn`

---

## 6. Cross-Cutting Protocol Primitives

These patterns recur across ≥3 unrelated skills and represent a stable shared vocabulary for agent SOPs in this library:

| Primitive | Appears in | Canonical form |
|---|---|---|
| **`gh issue create` without review gate** | `qa`, `triage-issue`, `prd-to-issues`, `request-refactor-plan`, `improve-codebase-architecture`, `write-a-prd` | File immediately; print URL; the artifact IS the deliverable |
| **One question at a time** | `grill-me`, `write-a-prd`, `qa` | "Ask one question at a time; never batch questions" |
| **Tracer-bullet vertical slices** | `tdd`, `prd-to-plan`, `prd-to-issues` | Each slice is thin, end-to-end, independently demoable/verifiable |
| **Codebase exploration before acting** | `improve-codebase-architecture`, `triage-issue`, `prd-to-plan`, `write-a-prd`, `request-refactor-plan`, `prd-to-issues` | Explore first to verify assertions; do not hunt for fix during exploration |
| **No file paths / no code snippets in issue bodies** | `qa`, `request-refactor-plan`, `write-a-prd`, `triage-issue` | Issues describe behaviors and contracts; "reads like a spec, not a diff" |
| **Deep-module framing (Ousterhout)** | `improve-codebase-architecture`, `tdd`, `write-a-prd`, `tdd/deep-modules.md` | Small interface hiding large implementation; reduce methods / simplify params / hide more complexity |
| **Parallel divergent sub-agent spawning** | `design-an-interface`, `improve-codebase-architecture` | ≥3 agents each under a distinct constraint; present sequentially; compare in prose |
| **"Replace, don't layer" testing** | `improve-codebase-architecture/REFERENCE.md`, `tdd` | Once boundary tests exist, delete old shallow-module unit tests |
| **Behavior-not-implementation test assertion** | `tdd/SKILL.md`, `tdd/tests.md`, `triage-issue` | Tests assert on observable outcomes through public interface; survive internal refactor |
| **SKILL.md body ≤100 lines with progressive disclosure** | `write-a-skill` | Split into REFERENCE.md / EXAMPLES.md / scripts/ when body exceeds ~100 lines |

---

## 7. Default Recommendation

**Promote 7 skills immediately** (high portability, minimal prerequisites):

1. `grill-me/SKILL.md` — diff against existing, then incorporate any delta or confirm identical
2. `design-an-interface/SKILL.md` — drop book citation; preserve "don't implement" guardrail verbatim
3. `setup-pre-commit/SKILL.md` — diff for Husky v9 / commit-as-smoke-test delta
4. `ubiquitous-language/SKILL.md` — preserve flagged-ambiguities section + aliases-to-avoid column
5. `triage-issue/SKILL.md` — replace Claude-internal sub-agent phrasing; preserve durability constraint
6. `qa/SKILL.md` — preserve "no file paths in issues" rule and background-explore architecture
7. `git-guardrails-claude-code/` — inline script body from `scripts/block-dangerous-git.sh` first

**Batch-diff 6 skills against existing counterparts** before promoting (medium portability):

- `.references/mattpocock-skills/tdd/SKILL.md` → `skills/tdd/SKILL.md` (check: anti-pattern block, companion fragment content)
- `.references/mattpocock-skills/write-a-prd/SKILL.md` → `skills/prd-create/SKILL.md` (check: decision-tree framing, Testing Decisions section)
- `.references/mattpocock-skills/write-a-skill/SKILL.md` → `skills/skill-create/SKILL.md` (check: 100-line threshold, description-as-signal framing)
- `.references/mattpocock-skills/request-refactor-plan/SKILL.md` → `skills/refactor-plan/SKILL.md` (check: coverage gate, no-paths rule)
- `.references/mattpocock-skills/prd-to-issues/SKILL.md` → `skills/prd-to-issues/SKILL.md` (check: HITL/AFK labels, dependency-order instruction)
- `.references/mattpocock-skills/prd-to-plan/SKILL.md` → `skills/prd-to-plan/SKILL.md` (check: ephemeral-names rule, configurable output path)

**Inline 6 reference fragments** into parent SOPs during the batch-diff pass:
`tdd/tests.md`, `tdd/mocking.md`, `tdd/refactoring.md` → TDD SOP;
`improve-codebase-architecture/REFERENCE.md`, `tdd/deep-modules.md` → architecture SOP;
`tdd/interface-design.md` → footnote in design-an-interface or TDD SOP.

**Resolve one compound SOP** (`improve-codebase-architecture`) by inlining REFERENCE.md and deciding whether to promote as an independent SOP or refactor it to call `design-an-interface` as a named sub-skill.

**Do not promote**: `obsidian-vault`, `scaffold-exercises`, `tdd/deep-modules.md` (standalone).

---

## 8. Structural Patterns

The following structural patterns recur across this skill library and are worth preserving or standardizing in any promoted SOP:

**1. YAML frontmatter + numbered workflow body**
Every standalone SKILL.md uses YAML `name`/`description` frontmatter followed by a numbered procedural body. The description is the primary trigger mechanism — it is the only field the agent sees during routing. All descriptions follow: sentence 1 = capability; sentence 2 = "Use when [specific triggers]".

**2. Fenced template blocks inside workflow files**
`write-a-prd`, `request-refactor-plan`, `prd-to-issues`, `prd-to-plan` embed their output templates as fenced XML blocks (`<prd-template>`, `<refactor-plan-template>`, `<issue-template>`, `<vertical-slice-rules>`) directly inside the SKILL.md. This pattern keeps the template co-located with the workflow steps but creates a formatting artifact (the XML wrapper) that should be inlined as plain markdown sections on promotion.

**3. No-review-gate delivery**
Six skills explicitly instruct the agent to create the GitHub issue or deliverable artifact without asking the user to review first, then share the URL immediately. This is a deliberate pattern — not an omission — reflecting the philosophy that the artifact IS the deliverable; user iteration happens post-creation, not pre-creation.

**4. Progressive disclosure via companion files**
The `tdd/` directory uses a hub-and-spoke structure: SKILL.md is the procedural hub; five companion reference files (tests.md, mocking.md, refactoring.md, interface-design.md, deep-modules.md) hold supporting detail. SKILL.md references these by relative path. This keeps the main skill body short (≤100 lines) while preserving full reference depth. The pattern is consistent with the `write-a-skill` meta-SOP's SKILL.md/REFERENCE.md split instruction.

**5. Parallel sub-agent spawning with divergent constraints**
Two skills (`design-an-interface`, `improve-codebase-architecture`) use structurally identical parallel sub-agent invocation: ≥3 agents, each given a distinct constraint, each returning a fixed-schema response (signature + usage example + trade-offs). This is a named pattern in the library ("Design It Twice"). It should be treated as a reusable primitive rather than duplicated in each SOP.

**6. Step permissiveness anti-pattern**
Two skills (`write-a-prd`, `request-refactor-plan`) include a preamble that says "You may skip steps if you don't consider them necessary." This is flagged in both raw findings as an anti-pattern for a portable SOP. All promoted versions should replace this with explicit per-step skip conditions.

**7. Minimal body as a quality signal**
The three shortest skills by word count (`grill-me` ~60 words, `edit-article` ~120 words, `tdd/refactoring.md` ~60 words) all carry the highest signal-to-noise ratio. Length anti-correlates with quality in this library: the longest skills are the least portable (`obsidian-vault`, `scaffold-exercises`).

---

## 9. Evidence

All citations trace to line ranges in `raw-findings.md`.

**[E01]** DAG-ordering heuristic and 240-char paragraph constraint:
> "The DAG framing is novel enough to keep verbatim. Paragraph-length cap (240 chars) is an opinionated but portable constraint."
— `raw-findings.md` § `edit-article/SKILL.md`

**[E02]** "Don't implement" guardrail in `design-an-interface`:
> "The explicit 'don't implement — this is purely about interface shape' guardrail is high-value and should be preserved verbatim."
— `raw-findings.md` § `design-an-interface/SKILL.md`

**[E03]** Blocking message attribution in `block-dangerous-git.sh`:
> "The blocked-command message deliberately includes the phrase 'The user has prevented you from doing this.' — this is intentional UX to attribute the block to the user, not Claude, reducing confusion."
— `raw-findings.md` § `git-guardrails-claude-code/scripts/block-dangerous-git.sh`

**[E04]** "Merge, don't overwrite" instruction for settings.json:
> "The 'merge, don't overwrite' instruction for existing settings.json is good defensive practice worth preserving verbatim."
— `raw-findings.md` § `git-guardrails-claude-code/SKILL.md`

**[E05]** Non-portability of `obsidian-vault` due to hardcoded path:
> "The skill is bound to a hardcoded Windows/WSL absolute path (/mnt/d/Obsidian Vault/AI Research/) and to Obsidian-specific affordances… The bash commands embed the vault path directly, so the skill only works on the original author's machine without manual adaptation."
— `raw-findings.md` § `obsidian-vault/SKILL.md`

**[E06]** "Friction as signal" exploration philosophy:
> "'the friction you encounter IS the signal.'"
— `raw-findings.md` § `improve-codebase-architecture/SKILL.md`

**[E07]** "Replace, don't layer" testing principle:
> "The 'replace, don't layer' testing principle … once boundary tests exist, delete old shallow-module unit tests; all new tests assert observable outcomes through the public interface, not internal state."
— `raw-findings.md` § `improve-codebase-architecture/REFERENCE.md`

**[E08]** Horizontal-slicing anti-pattern in `tdd`:
> "The explicit anti-pattern section ('DO NOT write all tests first — this is horizontal slicing') is the standout high-signal content: it names the failure mode, explains why it produces poor tests, and backs it up with a concrete ASCII diagram."
— `raw-findings.md` § `tdd/SKILL.md`

**[E09]** "Good suggestion reads like a spec, not a diff" — durability constraint:
> "The durability constraint ('A good suggestion reads like a spec; a bad one reads like a diff') is the standout insight and should survive verbatim into any promoted SOP."
— `raw-findings.md` § `triage-issue/SKILL.md`

**[E10]** "No file paths in issues" rule in `qa`:
> "The 'no file paths in issues' rule is the standout portable constraint."
— `raw-findings.md` § `qa/SKILL.md`

**[E11]** Non-portability of `scaffold-exercises` — repo-specific linter:
> "Every concrete detail (directory schema XX-section-name/ / XX.YY-exercise-name/, the pnpm ai-hero-cli internal lint command, the ai-hero CLI itself, and the exercises/ root path) is tied to a single proprietary course repo."
— `raw-findings.md` § `scaffold-exercises/SKILL.md`

**[E12]** "Description is the only thing your agent sees" insight in `write-a-skill`:
> "the description is the only thing your agent sees framing — this insight correctly surfaces the description as the load-bearing trigger mechanism, not the body"
— `raw-findings.md` § `write-a-skill/SKILL.md`

**[E13]** "Do NOT close or modify the parent PRD issue" guardrail in `prd-to-issues`:
> "The 'do NOT close or modify the parent PRD issue' guardrail is high-signal and should be preserved verbatim."
— `raw-findings.md` § `prd-to-issues/SKILL.md`

**[E14]** Step-permissiveness anti-pattern in `write-a-prd` and `request-refactor-plan`:
> "Step permissiveness ('You may skip steps if you don't consider them necessary') — this is an anti-pattern for a portable SOP; a promoted version should state conditions for skipping each step explicitly rather than leaving it to agent discretion."
— `raw-findings.md` § `write-a-prd/SKILL.md` and `request-refactor-plan/SKILL.md`

**[E15]** `deep-modules.md` too thin to stand alone:
> "Best disposition: inline verbatim as a callout/sidebar inside the architecture SOP or TDD skill rather than promoting as a standalone skill. Do not promote independently — too thin; add no standalone value beyond what the parent skills already convey."
— `raw-findings.md` § `tdd/deep-modules.md`
