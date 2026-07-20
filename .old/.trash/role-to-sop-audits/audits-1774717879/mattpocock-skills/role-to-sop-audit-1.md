# Repo Audit — `mattpocock-skills`
*Compiled from `raw-findings.md` · 2026-03-28*

---

## 1. Repo Overview

`mattpocock-skills` is a skills library authored by Matt Pocock (TypeScript educator, Total TypeScript) for use with Claude Code and similar agent harnesses. Its purpose is to encode repeatable engineering workflows — TDD, architecture improvement, refactor planning, PRD authoring, QA — as reusable SKILL.md files that an LLM agent can load on demand. The skills are written for a Node/TypeScript-first environment but deliberately avoid framework lock-in in their core process logic. A small number of skills are domain-specific (Obsidian vault management, exercise scaffolding, shoehorn migration) and were written for the author's own toolchain rather than for distribution. The majority of skills are general-purpose SOPs with clean portability profiles.

---

## 2. Content Summary

The repo contains approximately 15 SKILL.md files spanning behavioural protocols, multi-step agentic workflows, tool-setup recipes, and a meta skill-authoring SOP. Companion reference files appear under `tdd/` (`tests.md`, `mocking.md`, `deep-modules.md`, `interface-design.md`, `refactoring.md`) and `improve-codebase-architecture/REFERENCE.md`, providing the conceptual scaffolding that SKILL.md files cross-reference rather than inline. A companion shell script (`git-guardrails-claude-code/scripts/block-dangerous-git.sh`) ships alongside its SKILL.md. Three skills are repo- or tool-specific and are not portable without significant rework: `obsidian-vault`, `scaffold-exercises`, and `migrate-to-shoehorn`.

---

## 3. SOP Split — Port vs Leave Out

### Port (fully or with minor strip)

| Skill | Reason to port |
|---|---|
| `grill-me` | Zero repo-specific content; reusable Socratic interrogation loop. Already mirrored locally — merge "recommended answer per question" refinement. |
| `design-an-interface` | "Design It Twice" + APOSD evaluation criteria are language-agnostic. Already adopted as `design-interface`; verify APOSD criteria survived. |
| `git-guardrails-claude-code` | Self-contained PreToolUse hook + shell script. Inline or heredoc the companion script to resolve the broken-link portability friction. |
| `improve-codebase-architecture` | Deep-module exploration + parallel sub-agent design is universally applicable. Strip `subagent_type=Explore`, `REFERENCE.md` path reference, and `gh issue create` specifics; inline or flatten dependency-category taxonomy. |
| `request-refactor-plan` | Clean interview → tiny-commits → GitHub issue workflow. No strip needed. |
| `prd-to-issues` | Vertical-slice / HITL-AFK taxonomy is a standout portable concept. Strip only `gh issue create` CLI call. |
| `prd-to-plan` | Pure process SOP; embedded `<vertical-slice-rules>` and `<plan-template>` XML blocks are copy-ready. No material strip needed. |
| `qa` | Issue-writing rules (no file paths, domain language, behaviour-focused) are the most portable asset. Strip `gh issue create` + advisory `UBIQUITOUS_LANGUAGE.md` reference. |
| `triage-issue` | Bug-triage-to-TDD-fix-plan pipeline is universally applicable. Strip only `gh issue create`. |
| `ubiquitous-language` | Self-contained DDD glossary SOP; output path is parameterisable. No strip needed. |
| `setup-pre-commit` | Fully self-contained Husky v9 + lint-staged + Prettier recipe. No strip needed. |
| `tdd` | Framework-agnostic red-green-refactor protocol; per-cycle checklist is immediately usable. Strip five intra-repo cross-reference links; inline key guidance. |
| `write-a-skill` | Description-quality guidance (1024-char cap, good/bad examples, third-person) is the most portable differentiator. No strip needed. |
| `write-a-prd` | Solid PRD interview + deep-module framing + templated output. Strip "submit as GitHub issue" to make optional. |
| `edit-article` | Pure editorial process; DAG section model and 240-char paragraph cap are transferable. No strip needed. |

### Leave Out

| Skill | Reason to exclude |
|---|---|
| `obsidian-vault` | Anchored to a specific vault path and Obsidian naming workflow; not portable without full rewrite. |
| `scaffold-exercises` | Directory rules and lint command are repo/tooling-specific; the scaffolding pattern itself transfers only partially. |
| `migrate-to-shoehorn` | Tightly coupled to the `@total-typescript/shoehorn` library and TypeScript test conventions; useful only if project already uses shoehorn. |

---

## 4. Per-SOP Table

| Skill | Source file | Trigger | Steps / contract | Quality bar | Escalation | Strip | Notes |
|---|---|---|---|---|---|---|---|
| **grill-me** | `skills/grill-me/SKILL.md` | "grill me", stress-test a plan, interrogate a design decision tree | 4 steps: one question at a time → recommended answer per question → codebase explore if answerable → continue until all branches resolved | Every branch of decision tree resolved; shared understanding reached | None specified | Nothing — already minimal | Marginally more explicit than local equivalent on "recommended answer" contract; worth merging |
| **design-an-interface** | `design-an-interface/SKILL.md` | Design API/module, "design it twice", compare interface options | 5 steps: gather requirements → spawn 3+ parallel sub-agents with constraint variants → each outputs signature + examples + trade-offs → sequential presentation + APOSD comparison → synthesise | APOSD deep-module criterion applied; anti-pattern guards fire | None specified | None | Local `design-interface` adoption — verify APOSD criteria survived |
| **git-guardrails-claude-code** | `git-guardrails-claude-code/SKILL.md` | Block destructive git ops, add git safety hooks | 5 steps: scope (project vs global) → copy/emit shell script + chmod → merge PreToolUse hook into settings.json → pattern customisation → echo-pipe verification | Merge-not-overwrite; verification step required | None specified | Inline or heredoc `scripts/block-dangerous-git.sh` content; remove bundled path reference | Blocked-command list is explicit and extensible |
| **improve-codebase-architecture** | `improve-codebase-architecture/SKILL.md` | Improve architecture, find refactoring opportunities, consolidate coupling | 7 steps: organic explore → numbered candidate list (pause) → user picks → problem-space framing (concurrent with step 5) → 3+ parallel sub-agent designs → user picks → file RFC as GitHub issue | Opinionated recommendation required at step 5; "user reads while agents work" concurrency | None specified | Strip `REFERENCE.md` path ref, `subagent_type=Explore`, `gh issue create`; inline dependency-category taxonomy | Dependency-category taxonomy in `REFERENCE.md` must be flattened before promotion |
| **request-refactor-plan** | `request-refactor-plan/SKILL.md` | Plan a refactor, create refactoring RFC, break into safe incremental steps | 8 steps: long problem description → repo explore → surface alternatives → deep-dive interview → lock scope → test coverage review → smallest-possible commits → GitHub issue with 7-section template | Tiny-commit rule (Fowler): each commit leaves codebase working; Decision Document bans file paths/code snippets | None specified | None | "Decision Document" no-file-paths rule is a standout portable rule worth preserving verbatim |
| **prd-to-issues** | `prd-to-issues/SKILL.md` | Convert PRD to tickets, "tracer bullets", "create issues from PRD" | 5 steps: locate PRD → optional codebase explore → draft tracer-bullet vertical slices (HITL/AFK typed) → quiz user on granularity/deps → create issues in dependency order | Each slice = complete end-to-end path, independently demoable; blockers created first for real issue numbers | Quiz loop until approved | `gh issue create` CLI call + GitHub issue-body template | HITL/AFK slice-type taxonomy is standout portable concept |
| **prd-to-plan** | `prd-to-plan/SKILL.md` | Break down a PRD, multi-phase plan, "tracer bullets" | 6 steps: confirm PRD in context → codebase explore → identify durable architectural decisions → draft vertical slices → quiz user → write `./plans/<feature>.md` from template | Five explicit vertical-slice rules; slices must be independently demoable | Quiz loop until approved | Nothing material | Step 3 codebase explore could be conditional for greenfield; output path `./plans/` should be noted as configurable |
| **qa** | `qa/SKILL.md` | Report bugs, QA session, file issues conversationally | 5 steps: listen + light clarify (≤3 questions) → background codebase explore (no fix-seeking) → scope assessment (single vs breakdown) → file issues without pre-review → print URLs + ask "Next issue?" | No file paths or line numbers in issue bodies; domain language only; 30-second read target; dependency order for breakdowns | None specified | `gh issue create` CLI; advisory `UBIQUITOUS_LANGUAGE.md` reference | Issue-writing rules are the most portable asset; worth extracting as standalone rule even if full workflow not adopted |
| **triage-issue** | `triage-issue/SKILL.md` | User reports bug, "triage", investigate and plan a fix | 5 steps: capture problem (one question max) → explore/diagnose → identify fix approach → design TDD fix plan (RED-GREEN cycles on public interfaces) → create GitHub issue without pre-review | TDD plan describes contracts not diffs; durability rule: observable outcomes only; no file paths in issue | None specified | Nothing; `gh issue create` is a universal dependency | "Describe behaviors and contracts, not internal structure" is standout portable rule |
| **ubiquitous-language** | `ubiquitous-language/SKILL.md` | Define domain terms, glossary, "domain model", "DDD" | 5 steps: scan conversation for domain nouns/verbs → identify ambiguities + synonyms → propose canonical terms (opinionated) → write `UBIQUITOUS_LANGUAGE.md` (grouped tables + Relationships + Example dialogue + Flagged ambiguities) → inline summary; re-run merges | Opinionated term choices; conflicts flagged explicitly; example dialogue required (3–5 exchanges) | None specified | Nothing — no repo-specific content | Example dialogue section teaches correct usage in context; local equivalent may have drifted — compare on merge |
| **setup-pre-commit** | `setup-pre-commit/SKILL.md` | Add pre-commit hooks, Husky setup, lint-staged, commit-time formatting | 8 steps: detect package manager → install deps → husky init → write `.husky/pre-commit` → create `.lintstagedrc` → create `.prettierrc` → verify checklist → stage & commit smoke test | Verification checklist; step 8 smoke test required; Husky v9+ (no shebang) | None specified | Nothing — no repo-specific content | No monorepo guidance; acceptable gap for a portable SOP |
| **tdd** | `tdd/SKILL.md` | TDD, red-green-refactor, integration tests, test-first development | 4 phases: Planning → Tracer Bullet (one failing test) → Incremental Loop (one behavior at a time) → Refactor (after GREEN only) + per-cycle checklist | Tests use public interface only; survive internal refactor; no speculative features; 90% coverage implied | None specified | Strip five intra-repo cross-reference links (`tests.md`, `mocking.md`, etc.) — inline key guidance | Per-cycle checklist is immediately usable; anti-horizontal-slicing diagram is portable signal |
| **write-a-skill** | `write-a-skill/SKILL.md` | Create, write, or build a new agent skill | 3 steps: gather requirements → draft SKILL.md + optional REFERENCE.md/EXAMPLES.md/scripts → review with user | SKILL.md ≤ 100 lines; description ≤ 1024 chars; no time-sensitive info; refs one level deep; concrete examples present | Review loop until coverage confirmed | Nothing | Description-quality guidance (good/bad examples, third-person, 1024-char cap) is the most portable differentiator; scripts-vs-inline heuristic is absent from some local equivalents |
| **write-a-prd** | `write-a-prd/SKILL.md` | Write a PRD, product requirements document, plan a new feature | 5 steps: elicit long problem description → explore repo → relentless interview (one branch at a time) → sketch major modules (deep-module framing) → write PRD template + optional GitHub issue | Deep-module framing required at step 4; Implementation Decisions excludes file paths/code snippets; User Stories in "As a/I want/so that" format | Interview loop until shared understanding reached | Make "submit as GitHub issue" conditional/optional | Deep-module framing in step 4 is differentiator absent from most PRD skills |
| **edit-article** | `edit-article/SKILL.md` | Edit, revise, or improve an article draft | 2 steps: divide by heading → map DAG dependency order → confirm with user; per-section: rewrite for clarity + cap paragraphs at 240 chars | 240-char paragraph cap; DAG order respected | None specified | Nothing | Workflow is minimal; missing editorial-goals elicitation before rewriting begins |

---

## 5. Portability Ranking

### High — port as-is (zero or trivial strip)

- `grill-me`
- `request-refactor-plan`
- `prd-to-plan`
- `ubiquitous-language`
- `setup-pre-commit`
- `write-a-skill`
- `edit-article`

### Medium — port with defined strip

- `design-an-interface` (verify APOSD criteria on local adoption)
- `git-guardrails-claude-code` (inline companion shell script)
- `prd-to-issues` (strip `gh issue create`)
- `qa` (strip `gh issue create` + advisory file reference)
- `triage-issue` (strip `gh issue create`)
- `tdd` (strip five intra-repo cross-reference links; inline key guidance)
- `write-a-prd` (make GitHub issue submission optional)

### Partial — not promoted without significant rework

- `improve-codebase-architecture` (flatten `REFERENCE.md` taxonomy; strip tool-specific hooks)
- `scaffold-exercises` (directory rules and lint command are repo-specific)
- `migrate-to-shoehorn` (tightly coupled to shoehorn library + TypeScript test conventions)

### Exclude

- `obsidian-vault` (vault-path-anchored; not portable)

---

## 6. Cross-Cutting Protocol Primitives

These patterns appear across multiple skills and are smaller than a full skill. Each is worth encoding as a standalone rule or injected into existing skills.

| Primitive | Source(s) | Formulation |
|---|---|---|
| **One-question-at-a-time interview** | `grill-me`, `write-a-prd`, `request-refactor-plan` | Ask exactly one question, provide a recommended answer, wait for response before proceeding. |
| **Recommended answer per question** | `grill-me` | Accompany each interview question with a concrete recommendation — prevents open-ended stalling and models good defaults. |
| **No file paths or line numbers in issue bodies** | `triage-issue`, `request-refactor-plan`, `qa`, `write-a-prd` | Issue and decision bodies must describe behaviours and contracts, not internal structure, to prevent staleness. |
| **Domain language only in external artefacts** | `qa`, `triage-issue` | Issues, tickets, and PRDs use domain nouns/verbs, not source file names or module paths. |
| **Codebase explore before asking the user** | `grill-me`, `improve-codebase-architecture`, `qa`, `prd-to-plan` | If a question can be answered by exploring the codebase, explore it instead of asking the user. |
| **Tracer-bullet / vertical-slice decomposition** | `prd-to-plan`, `prd-to-issues`, `tdd` | Each slice must cut end-to-end through all layers and be independently demoable. Avoid horizontal slicing. |
| **HITL vs AFK slice typing** | `prd-to-issues` | Classify each work item as Human-In-The-Loop (requires interactive approval gates) or Away-From-Keyboard (can run autonomously). |
| **Deep-module framing** | `improve-codebase-architecture`, `write-a-prd`, `tdd/deep-modules.md` | Favour small interfaces with complex hidden implementation (APOSD criterion); flag shallow modules as refactor candidates. |
| **Refactor only while GREEN** | `tdd` | Never refactor while a test is RED; run tests after each refactor step. |
| **Verification / smoke-test close-out** | `git-guardrails-claude-code`, `setup-pre-commit` | Every setup SOP ends with a concrete verification step (echo-pipe test, stage-and-commit smoke test) before declaring done. |
| **File without asking for pre-review** | `triage-issue`, `qa` | Create issues/PRs immediately after drafting; share URL; do not request user approval before filing. |
| **Dependency-order creation** | `prd-to-issues`, `qa` | Create blocking issues first so real issue numbers can be referenced in dependent items. |
| **Decision Document bans volatile references** | `request-refactor-plan`, `write-a-prd` | Implementation Decisions and Decision Document sections explicitly exclude file paths and code snippets to prevent staleness. |

---

## 7. Default Recommendation

**Ship in `.agents` skills tree:**

| Skill | Form | Action |
|---|---|---|
| `grill-me` | Merge into existing `skills/grill-me/SKILL.md` | Add "recommended answer per question" clause from this version |
| `design-interface` | Verify existing adoption | Confirm APOSD deep-module evaluation criteria survived adoption from `design-an-interface/SKILL.md` |
| `git-guardrails` | Update existing `skills/git-guardrails/SKILL.md` | Inline `block-dangerous-git.sh` content via heredoc; add verification step |
| `codebase-architecture` | Update existing `skills/codebase-architecture/SKILL.md` | Inline dependency-category taxonomy from `REFERENCE.md`; strip tool-specific hooks |
| `refactor-plan` | Update existing `skills/refactor-plan/SKILL.md` | Preserve verbatim "Decision Document bans file paths/code snippets" rule |
| `prd-to-issues` | Update existing `skills/prd-to-issues/SKILL.md` | Add HITL/AFK taxonomy; preserve dependency-order creation rule |
| `prd-to-plan` | Verify existing adoption | Confirm `<vertical-slice-rules>` XML block is present; add greenfield conditional to codebase-explore step |
| `issue-triage` | Update existing `skills/issue-triage/SKILL.md` | Preserve "describe contracts not diffs" TDD durability rule verbatim |
| `ubiquitous-language` | Compare and merge with existing | Check for drift; add example-dialogue section if absent |
| `setup-pre-commit` | Update existing `skills/setup-pre-commit/SKILL.md` | Adopt Husky v9+ no-shebang note; add smoke-test close-out step |
| `tdd` | Update existing `skills/tdd/SKILL.md` | Inline key guidance from `tests.md`, `mocking.md`, `deep-modules.md`, `interface-design.md`, `refactoring.md`; drop broken cross-reference links |
| `skill-create` | Merge into existing `skills/skill-create/SKILL.md` | Add description-quality guidance (1024-char cap, good/bad examples, third-person, scripts-vs-inline heuristic) from `write-a-skill/SKILL.md` |
| `prd-create` | Compare and merge with existing | Cross-reference `write-a-prd/SKILL.md`; add deep-module framing at module-sketch step; make GitHub issue submission optional |
| `doc-edit-article` | Update existing `skills/doc-edit-article/SKILL.md` | Add DAG section-ordering model; add 240-char paragraph cap; add editorial-goals elicitation step |
| `qa` skill | Promote as new `skills/qa/SKILL.md` | No direct local equivalent found; the issue-writing rules (no file paths, domain language, 30-second read target) are the highest-value extract |

**Ship as standalone rules (not full skills):**

- `no-file-paths-in-artefacts.md` — consolidate the cross-skill "no file paths or line numbers in issue/decision bodies" rule
- `codebase-first.md` — consolidate the "explore codebase before asking the user" primitive

---

## 8. Structural Patterns

### SKILL.md + reference-file pattern

`tdd/SKILL.md` cross-references five companion docs (`tests.md`, `mocking.md`, `deep-modules.md`, `interface-design.md`, `refactoring.md`) and `improve-codebase-architecture/SKILL.md` cross-references `REFERENCE.md`. This pattern keeps the primary SKILL.md short (≤ 100 lines per the `write-a-skill` rule) while making deeper conceptual scaffolding available on demand. **Portability risk**: cross-reference links are intra-repo relative paths; they break on copy. Mitigation: inline critical guidance from reference files directly into the SKILL.md at promotion time, or convert links to absolute paths within the receiving repo.

### Description conventions

`write-a-skill/SKILL.md` encodes the following description rules, which are consistently observed across the high-quality skills in this repo:

- Maximum 1024 characters
- Third-person voice ("Use when …", not "I will …")
- Trigger-first framing: lead with when to use, not what the skill does
- Concrete use-case examples, not abstract capability statements
- No time-sensitive information (no version numbers, no dated links)

**Good example** (from `tdd`): *"Use when user wants to build features or fix bugs using TDD, mentions 'red-green-refactor', wants integration tests, or asks for test-first development."*

**Weak pattern** (from `edit-article`): Workflow is minimal; description is functional but missing editorial-goals elicitation, which means the agent may rewrite without knowing the author's tone intent.

### What works

- **Numbered process steps** with a clear pause/decision point (e.g., `prd-to-issues` quiz loop, `improve-codebase-architecture` candidate selection) — prevents the agent from running past user checkpoints.
- **Embedded XML template blocks** (`<prd-template>`, `<vertical-slice-rules>`, `<plan-template>`) — copy-ready output formats that survive context window compression better than prose descriptions.
- **Explicit "don't do" guards as anti-patterns** (e.g., `tdd` anti-horizontal-slicing diagram, `qa` "do NOT seek a fix during exploration") — encode failure modes alongside the happy path.
- **Close-out verification steps** (`setup-pre-commit` smoke test, `git-guardrails` echo-pipe test) — make completion observable, not assumed.
- **Companion scripts inlined or bundled** — when a skill depends on a script, the script should ship in the same directory; `git-guardrails-claude-code/scripts/block-dangerous-git.sh` is the model, though it should be inlined via heredoc for true portability.

### What to avoid

- **Intra-repo relative cross-reference links** without an inline fallback — they silently break on copy (`tdd` cross-references to five companion docs).
- **Unconditional tool-specific steps** (`subagent_type=Explore`, `gh issue create`) without a generic fallback — makes the skill unusable in non-Claude-Code or non-GitHub environments.
- **Missing "done" signal** — `edit-article` has no explicit completion signal; the agent may loop indefinitely or stop without confirming all sections are addressed.
- **Permissive skip clauses** ("you may skip steps if you don't consider them necessary") — creates agent discretion that undermines the SOP contract; prefer explicit conditional logic ("if a codebase exists, explore it; otherwise skip step X").

---

## 9. Evidence

All citations traceable to `raw-findings.md`.

1. **`grill-me` "recommended answer per question"** — *"this version is marginally more explicit about the 'recommended answer per question' contract, which is a useful refinement worth keeping if merging"* (`raw-findings.md`, grill-me entry).

2. **APOSD evaluation criteria in `design-an-interface`** — *"Strong theoretical grounding (APOSD 'deep module' criterion). Anti-patterns section actively guards against the most common failure modes (similar designs, skipping comparison, premature implementation)"* (`raw-findings.md`, design-an-interface entry).

3. **`git-guardrails` companion script portability friction** — *"The dependency on a companion shell script (`scripts/block-dangerous-git.sh`) is the only portability friction — recommend either inlining the script content into the SKILL or making step 2 emit it via heredoc"* (`raw-findings.md`, git-guardrails-claude-code entry).

4. **`improve-codebase-architecture` `REFERENCE.md` dependency** — *"`REFERENCE.md` dependency-category taxonomy is referenced but not inlined — need to check that file before finalising portability judgment"* and `REFERENCE.md` raw-findings: *"It gives a durable taxonomy for dependency handling … Classify dependencies as in-process, local-substitutable, remote-owned, or true external"* (`raw-findings.md`, improve-codebase-architecture + REFERENCE.md entries).

5. **`request-refactor-plan` Decision Document no-file-paths rule** — *"The 'Decision Document' section explicitly bans file paths and code snippets to prevent staleness — a strong, portable rule worth preserving verbatim"* (`raw-findings.md`, request-refactor-plan entry).

6. **HITL/AFK taxonomy in `prd-to-issues`** — *"The HITL/AFK slice-type taxonomy is a standout portable concept worth preserving verbatim"* (`raw-findings.md`, prd-to-issues entry).

7. **`triage-issue` TDD durability rule** — *"Strong durability principle baked into TDD plan ('describe behaviors and contracts, not internal structure; tests assert on observable outcomes'). The 'no file paths in issue' rule is a standout portable SOP worth preserving verbatim"* (`raw-findings.md`, triage-issue entry).

8. **`tdd` intra-repo cross-reference links** — *"Cross-references (`tests.md`, `mocking.md`, `deep-modules.md`, `interface-design.md`, `refactoring.md`) are intra-repo links that would need stripping or flattening, but the protocol itself is self-contained"* (`raw-findings.md`, tdd entry).

9. **`write-a-skill` description-quality guidance** — *"The description-quality guidance (good/bad examples, 1024-char cap, third-person) is the most portable differentiator worth extracting. Scripts-vs-inline-code heuristic is a useful addition absent from some equivalents"* (`raw-findings.md`, write-a-skill entry).

10. **`write-a-prd` deep-module framing as differentiator** — *"The deep-module framing in step 4 is a differentiator worth preserving verbatim — it gives the agent concrete architectural guidance most PRD skills lack"* (`raw-findings.md`, write-a-prd entry).

11. **`prd-to-plan` vertical-slice rules as primary asset** — *"The vertical-slice rules section is the most distinctive and portable asset — it encodes the 'why tracer bullets' rationale (completeness per layer, demoability, thin over thick)"* (`raw-findings.md`, prd-to-plan entry).

12. **`qa` issue-writing rules as highest-value extract** — *"The issue-writing rules (no file paths, domain language, behaviour-focused) are the most portable and durable part — worth extracting as a standalone rule if not adopting the full QA workflow"* and *"Breakdown guidance (dependency order, maximise parallelism) is genuinely strong SOP material rarely captured this explicitly elsewhere"* (`raw-findings.md`, qa entry).

13. **`obsidian-vault` excluded as non-portable** — *"Portable: no. Reason: It is anchored to a specific Obsidian vault path and vault naming workflow"* (`raw-findings.md`, obsidian-vault entry).

14. **`migrate-to-shoehorn` partial portability** — *"Portable: partial. Reason: The migration workflow is useful beyond one repo, but it is tightly coupled to the shoehorn library and TypeScript test code"* (`raw-findings.md`, migrate-to-shoehorn entry).

15. **`edit-article` DAG model and 240-char cap** — *"The DAG framing for section ordering is a strong, transferable heuristic. The 240-char paragraph cap is an opinionated but concrete constraint worth preserving"* and *"Workflow is minimal — could benefit from a step that asks the user for editorial goals/tone before rewriting begins"* (`raw-findings.md`, edit-article entry).
