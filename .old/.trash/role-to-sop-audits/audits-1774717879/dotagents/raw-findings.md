
---

## skills/prd-to-issues/SKILL.md

**Type:** Skill (process workflow)
**Portable:** Partial
**Reason:** The vertical-slice decomposition methodology and HITL/AFK classification are universally portable. The execution layer is tightly coupled to GitHub (sub-issues API, GraphQL `addBlockedBy`, `gh` CLI, labels/milestones/projects). Teams on GitLab, Linear, or plain task boards cannot use the implementation as-is.
**Trigger:** User wants to convert a PRD into tracked implementation tickets or GitHub issues.
**Steps/contract:**
1. Fetch PRD from GitHub issue
2. Explore codebase (optional)
3. Discover repo metadata (labels, issue types, milestones, projects, assignees)
4. Draft tracer-bullet vertical slices (HITL vs AFK, dependency order)
5. Quiz user on granularity, dependencies, metadata assignments — iterate
6. Create issues in dependency order; attach as sub-issues; set blocking relationships via GraphQL
7. Print summary table; verify sub-issue checklist and blocking links on GitHub
**Strip:** GitHub-specific API calls (`gh api`, GraphQL `addBlockedBy`, sub-issues endpoint), `gh issue create` flags. These are platform bindings, not the SOP.
**Structure/format:** Numbered process steps; `<vertical-slice-rules>` XML block; bash code blocks with full API commands; `<issue-template>` XML block; final summary table format.
**Notes:** The core SOP — decompose PRD into thin vertical slices, classify HITL/AFK, establish dependency order, quiz user before committing — is strong and portable. Recommend extracting a platform-agnostic "PRD → Slices" SOP and treating the GitHub mechanics as an adapter. The HITL/AFK framing is a standout concept worth preserving.

---

## skills/prd-to-plan/SKILL.md

**Type:** Skill (process workflow)
**Portable:** High
**Reason:** Entirely local-file-based output; no platform dependencies. The tracer-bullet slicing methodology, codebase exploration phase, architectural-decisions identification, and user quiz loop are all generic engineering practices. Works with any VCS, any issue tracker, any stack.
**Trigger:** User wants to break a PRD into a phased local implementation plan saved as Markdown files.
**Steps/contract:**
1. Confirm PRD is in context (paste or file)
2. Explore codebase to understand current architecture and patterns
3. Identify durable architectural decisions (routes, schema, models, auth, service boundaries)
4. Draft vertical slices — thin, end-to-end, demoable each
5. Quiz user on granularity, merges/splits — iterate until approved
6. Create `.plans/` directory; add to `.gitignore`; write one `.md` per slice + root `README.md`
**Strip:** Worktree-specific bash snippet (`git worktree add`) in templates — minor implementation detail, not core SOP logic.
**Structure/format:** Numbered process steps; `<vertical-slice-rules>` XML block; `<root-plan-template>` and `<slice-plan-template>` XML blocks with full Markdown scaffolding.
**Notes:** Cleanest and most portable skill in this batch. The architectural-decisions step (identify durable vs. volatile decisions before slicing) is a particularly strong addition not always found in planning skills. The template pair (root README + per-slice file) is a reusable artifact pattern worth extracting. Pair with `prd-to-issues` for a full local→GitHub promotion pipeline.

---

## skills/release/SKILL.md

**Type:** Skill (process workflow)
**Portable:** Moderate
**Reason:** The dual-path detection (changesets vs. conventional commits), semver bump logic from commit types, and changelog-entry structure are universally applicable. The execution layer binds to pnpm, `@changesets/cli`, and `gh release create`. The conventional-commits path is more portable than the changesets path.
**Trigger:** User says "release", "cut a release", "publish", "changelog", or "release notes".
**Steps/contract:**
*Changesets path:* check pending changesets → `pnpm changeset version` → review/edit CHANGELOG → commit + push + tags → create GitHub Release from changelog section.
*Manual path:* find last tag → collect commits since tag → determine semver bump from commit types → generate grouped changelog entry → write/prepend CHANGELOG.md → user review → bump version in package.json → commit + tag + push → create GitHub Release.
**Strip:** `pnpm`-specific commands (replace with `npm`/`yarn`/generic); `gh release create` (GitHub-specific); `@changesets/cli` tooling. Semver bump table and changelog grouping rules are keeper.
**Structure/format:** H2 sections for each path; detection logic upfront; bash code blocks throughout; semver bump decision table; final checklist.
**Notes:** The semver bump table (feat→minor, fix→patch, BREAKING→major, chore-only→patch-or-skip) is a concise, portable decision rule worth extracting standalone. The worktree-safety note ("release from main, not a worktree") is a good guardrail. The checklist at the end is a clean portable artifact.

---

## skills/setup-changesets/SKILL.md

**Type:** Skill (setup/scaffolding)
**Portable:** Low
**Reason:** Fully coupled to a specific toolchain: `@changesets/cli`, pnpm, GitHub Actions, and optionally Cloudflare. The *concept* of capturing release intent at PR time (changeset-per-PR model) is portable, but every step is tool-specific. Teams on other stacks get no actionable guidance.
**Trigger:** User wants to add changesets, set up versioning/changelog automation, or mentions "changesets".
**Steps/contract:**
1. Detect project shape (mono vs. single, private vs. public, existing `.changeset/`, Cloudflare presence)
2. `pnpm add -D @changesets/cli @changesets/changelog-github`
3. `pnpm changeset init`
4. Configure `.changeset/config.json` (single-package vs. monorepo variants, `privatePackages` settings)
5. Ensure `package.json` has `name`, `private`, `version` fields
6. Create `.github/workflows/release.yml` with changesets action; optionally add Cloudflare deploy step
7. Optionally add `pnpm changeset status` check to CI workflow
8. Commit with conventional commit message
**Strip:** Essentially the entire implementation is tool-specific. The model (PR-time release intent capture → batch version PR → merge to release) is the portable concept.
**Structure/format:** Checklist steps with bash commands; JSON config blocks for single vs. monorepo; full YAML workflow templates; usage guidance for worktrees and non-interactive changeset authoring.
**Notes:** Best value as a reference implementation for the changesets-specific pattern, not as a portable SOP. The non-interactive changeset authoring section (write `.changeset/<name>.md` directly via heredoc) is a useful agent-workflow tip. Cross-reference with `setup-ci` — they share the pnpm caching strategy.

---

## skills/setup-ci/SKILL.md

**Type:** Skill (setup/scaffolding)
**Portable:** Low
**Reason:** Opinionated stack implementation: pnpm + GitHub Actions + Cloudflare Pages/Workers. The *principles* (cache the full module tree, key on lockfile hash, don't retry blindly on cache hit, separate CI and deploy workflows, use concurrency groups) are portable; the YAML and CLI commands are not.
**Trigger:** User wants to add CI, set up GitHub Actions, configure deployment pipelines, or automate lint/test/build/deploy.
**Steps/contract:**
1. Detect project shape (scripts, wrangler config, framework, Node version, .npmrc)
2. Configure pnpm `store-dir=node_modules/.pnpm-store` in `.npmrc`
3. Generate CI workflow (`ci.yml`): checkout → pnpm setup → cache node_modules → install → lint → typecheck → test → build
4. Generate Deploy workflow (`deploy.yml`): checkout → pnpm setup → cache → install → build → Cloudflare Pages deploy via wrangler-action
5. Remind user to add GitHub secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`)
6. Commit with conventional commit message
**Strip:** All GitHub Actions YAML, Cloudflare-specific steps, pnpm-specific commands. The caching explanation table is worth keeping as rationale.
**Structure/format:** Checklist workflow steps; YAML blocks for CI and deploy workflows; comparison table for caching approaches; bullet notes on concurrency and safety flags.
**Notes:** The caching strategy explanation is the most portable and reusable content — the reasoning (cache `node_modules` with store inside vs. store-only) is a well-argued engineering decision that applies beyond this stack. The two-workflow split (CI on PRs, Deploy on main merge) is a sound pattern. Low SOP value for non-pnpm/non-GHA/non-Cloudflare teams.

---

## agents/engineering/orchestrator.md

**Type:** Agent definition (orchestration role)
**Portable:** High
**Reason:** The core orchestration model — route vs. orchestrate classification, wave-based execution, verify-then-proceed gates, specialist routing table with use/don't-use conditions, plan formats — is a universally applicable agentic engineering pattern. No tool/language/platform dependencies.
**Trigger:** Engineering work arrives that needs to be routed to a specialist or broken into multi-task waves. Single entry point for any engineering request.
**Steps/contract:**
*Route workflow:* classify → write Routing Plan → STOP for approval → dispatch specialist → evaluate result → re-route if needed → report.
*Orchestrate workflow:* clarify (1-4 questions) → research codebase → write Wave Plan → STOP for approval → delegate Wave 1 → wait → verify → iterate → final verify → report.
*Common patterns:* New Feature, Bug Fix, Refactor, Investigation, Test Fixing, UI Work, Documentation, Infrastructure, Simple Task — each mapped to specialist sequence.
**Strip:** Model identifiers (`claude-opus-4-6:medium`, `gpt-5.4:medium`) — implementation details. Specific tool names (Agent tool, Grep/Glob) are framework-specific but the capability concepts are portable.
**Structure/format:** Hard Rules list; specialist routing table (Use When / Do NOT Use When); two workflow narratives with numbered steps; common workflow patterns section; Routing Plan and Wave Plan format blocks.
**Notes:** The "assess before acting + wait for approval" hard rule (rules 2-3) is a standout portable guardrail. The specialist routing table is the highest-value extractable element — the Use/Don't-Use framing prevents misrouting. Wave Plan format is a clean, reusable artifact. The "don't retry with same inputs — change inputs or change specialist" rule (rule 5) is an underappreciated agent design principle worth preserving.

---

## agents/engineering/developer.md

**Type:** Agent definition (implementation role)
**Portable:** High
**Reason:** Spec-first, wait-for-approval, self-verify workflow is a universally applicable solo implementation discipline. No platform, language, or toolchain dependencies. The Spec Format and Verification Report Format are standalone portable artifacts.
**Trigger:** Focused, single-scope implementation work where one agent can handle the full job without delegation; routed from orchestrator or invoked directly for simple tasks.
**Steps/contract:**
1. Understand: ask 1-4 clarifying questions if ambiguous; skip if clear
2. Research: read existing code, study patterns
3. Spec: write spec in defined format
4. STOP: present spec, say "Please review and approve." Wait.
5. Implement: work through tasks in order, follow existing patterns
6. Test: visual test if UI with dev server
7. Stay focused: note out-of-scope discoveries as follow-ups, don't act on them
8. Verify: run every command in Verification Plan
9. Report: Verification Report with ✅/⚠️/❌ per criterion
**Strip:** Nothing substantial — the agent definition is already lean and generic.
**Structure/format:** Hard Rules list; numbered workflow; Spec Format block; Verification Report Format block with emoji status markers.
**Notes:** The Verification Report format (✅ VERIFIED with evidence / ⚠️ PARTIAL with gap description / ❌ MISSING with impact) is a highly reusable output contract worth extracting as a standalone pattern. The "no scope creep" hard rule enforced by re-confirming discovered work is a strong agentic discipline. Pairs naturally with orchestrator.md as the leaf node in multi-agent trees.

---

## agents/engineering/debugger.md

**Type:** Agent definition (diagnostic specialist)
**Portable:** High
**Reason:** The systematic debugging methodology — reproduce first, evidence-based hypotheses, eliminate one at a time, document dead ends, stop at root cause — is universally applicable regardless of stack, language, or platform. The Root Cause Report format is a first-class portable artifact.
**Trigger:** Something is broken and root cause is unknown; bug report received; production incident; regression discovered. NOT triggered when cause is already understood.
**Steps/contract:**
1. Triage: identify symptom precisely (what's happening vs. what should happen)
2. Reproduce: attempt local reproduction; if fails, investigate environment differences first
3. Gather evidence: stack traces, logs, error messages, recent git history, config state
4. Form hypotheses: 2-5 candidates ranked by likelihood with supporting evidence
5. Investigate systematically: one hypothesis at a time; design and run a confirming/refuting test; record result
6. Bisect if needed: use `git bisect` for regressions when hypotheses aren't narrowing
7. Write Root Cause Report: all sections filled
8. Hand off: present report; do NOT implement fix
**Strip:** Nothing — the methodology is already platform-agnostic. Model identifier (`claude-opus-4-6:high`) is implementation detail.
**Structure/format:** Hard Rules list; numbered workflow; Root Cause Report Format block (Symptom, Reproduction Steps, Root Cause, Evidence Chain, Introducing Change, Hypotheses Ruled Out, Recommended Fix, Severity & Blast Radius, Follow-ups).
**Notes:** The "diagnose only, never fix" hard rule is a strong separation-of-concerns principle that prevents the common agent failure mode of fixing before understanding. The Evidence Chain section format (observed → what it proves) enforces traceability. "Document dead ends — knowing what it ISN'T is as valuable" is a standout principle. The `git bisect` guidance for regressions adds practical depth. This is one of the strongest agent definitions in the batch.

---

## skills/deploy-verify/SKILL.md

**Type:** Executable workflow skill (post-deploy smoke test)

**Portable:** Mostly — core pattern is universal; some Cloudflare/wrangler/SvelteKit details are incidental

**Reason:** The smoke-test loop (get URL → define routes → Playwright script → results table → screenshots) applies to any web deployment regardless of host or framework. Wrangler CLI snippets for fetching the deployment URL and the SvelteKit route-scan one-liner are incidental and can be stripped or parameterised. The CI YAML snippet is Cloudflare-specific but the concept is not.

**Trigger:** After deploying; user says "verify deploy", "smoke test", "check production", or wants to confirm deployment health

**Steps/contract:**
1. Resolve production URL (ask user or fetch from deployment tooling)
2. Define routes to check (ask or infer from project structure)
3. Write + execute Playwright smoke-test script (Python; provided inline)
4. Present results table (route / status / title / screenshot)
5. Offer deeper checks if requested (response time, meta tags, API health, visual diff)
6. Optional: integrate as post-deploy CI step

**Strip:**
- `pnpm exec wrangler pages deployment list` URL-discovery snippet
- SvelteKit-specific `find src/routes -name '+page.svelte'` route-scan
- GitHub Actions YAML with `cloudflare/wrangler-action@v3` output reference
- `pip install playwright` in CI step (build-system-specific)

**Structure/format:** Prose intro + numbered H3 workflow steps + fenced code blocks (bash, python, markdown) + rules list. Well-structured and dense; could be tightened by making the Python script a reference rather than inline.

**Notes:** The "do not modify anything" and "screenshot every route" rules are strong portable principles. The philosophy of visual evidence > status codes is worth preserving verbatim.

---

## skills/gc/SKILL.md

**Type:** Executable workflow skill (git commit organisation + push)

**Portable:** High — the entire workflow is git + gh CLI; no framework, language, or host assumptions

**Reason:** Inspects diff, maps changes to conventional-commit concerns, executes commits with flavourful bodies, checks GitHub issues for auto-close references, then pushes. All logic is expressed in terms of standard git commands and the `gh` CLI. The concern-mapping table and commit message format are universally applicable conventions.

**Trigger:** User wants to organise uncommitted changes into logical commits, split a large change, or create conventional commits without copy-pasting

**Steps/contract:**
1. `git status` / `git diff` / `git diff --staged` — inspect state
2. `gh issue list` — find issue numbers to reference in commit bodies
3. Group changes by concern (config, formatting, feature, tests, docs, misc) — one commit per concern
4. Execute commits immediately via Bash (`git add`, `git commit`) — no approval needed
5. `git push`
6. Confirmation summary table

**Strip:**
- Nothing mandatory — the model-name trailer instruction ("use your actual model name") is self-referential but useful to preserve as a pattern note

**Structure/format:** Prose intro + numbered H3 steps + concern-mapping table + commit format spec with subject/body breakdown + extensive body examples by type + full example block + checklist. Exceptionally well-structured; the example-per-type pattern is reusable as a prompt engineering pattern.

**Notes:** The "flavourful body" philosophy is distinctive and worth preserving as a named convention. The "execute immediately, no approval" instruction is a strong agent-behaviour signal. The `Co-Authored-By` trailer pattern is portable but model-name must be resolved at runtime.

---

## skills/next-slice/SKILL.md

**Type:** Executable workflow skill (slice-to-slice worktree transition)

**Portable:** Low-medium — tightly coupled to the `.worktrees/` + `.plans/<N>-<slug>.md` repo layout convention; portable only to teams using that exact pattern

**Reason:** The workflow is fully deterministic and well-specified, but it assumes: (a) feature work happens in `git worktree add .worktrees/<name>`, (b) plan files live at `.plans/<N>-<slug>.md` with numbered slugs, and (c) each plan file contains a "worktree setup" section with branch/worktree names. Teams not using this layout would need to adapt all five steps. The git hygiene principles (fast-forward main, `-d` vs `-D` branch delete, operate from repo root) are universally portable.

**Trigger:** After merging a PR; user says "next slice", "move on", "next plan", "advance", or wants to start the next issue

**Steps/contract:**
1. Identify repo root, current worktree, current branch, confirm PR merged
2. `git worktree remove` + `git branch -d` from repo root
3. `git pull --ff-only origin main`
4. Scan `.plans/*.md` sorted numerically; pick lowest with open GitHub issue
5. Read plan file — extract issue number, worktree name, branch name, spec, acceptance criteria
6. `git worktree add .worktrees/<name> -b <branch> main`
7. Report summary; optionally begin implementation

**Strip:**
- The `.plans/<N>-<slug>.md` naming convention (repo-specific)
- The "worktree setup section" expectation in plan files (repo-specific)
- Replace with a parameterisable convention note

**Structure/format:** Prose intro + numbered H3 steps + bash snippets + rules list. Compact and clean. The rules list is strong.

**Notes:** The git safety rules (always operate from repo root, never force-delete without confirming merge) are independently valuable and should be extracted as reusable guardrails. The "skip closed issues" logic is a useful detail.

---

## skills/pr-file/SKILL.md

**Type:** Executable workflow skill (GitHub PR creation)

**Portable:** High — works with any GitHub repo; actively adapts to repo conventions via CONTRIBUTING.md + PR template discovery

**Reason:** The skill begins by checking for local overrides (PR template, CONTRIBUTING.md) and gives repo conventions priority over its own defaults. The default PR body template (Closes #N / What's in this PR / Tests / Acceptance criteria) is a sound universal structure. All commands are `gh` CLI. No framework, language, or host assumptions.

**Trigger:** User says "file a PR", "open a PR", "create a PR", or wants to submit a feature branch for review

**Steps/contract:**
1. Check for `.github/PULL_REQUEST_TEMPLATE.md` and `CONTRIBUTING.md`; extract any PR rules
2. Determine feature branch and base branch; push if not yet pushed
3. Gather context: commits, linked issues, plan file acceptance criteria, diff stats
4. Build PR body (repo template if found, else default template); populate all sections
5. Choose title (conventional commit style unless repo specifies otherwise)
6. `gh pr create --title ... --body-file - --base ... --head ...`
7. Report resulting PR URL

**Strip:**
- `.plans/<N>-<slug>.md` acceptance-criteria lookup (repo-specific layout; make it a "if plan files exist" conditional)

**Structure/format:** Prose intro + numbered H3 steps + bash snippets + markdown PR body template + title format spec + rules list. Well-organised; the "repo wins" principle is clearly stated and strong.

**Notes:** "No flavour in the PR body — that belongs in the merge comment" is an important cross-skill design decision worth preserving as an explicit convention. The fallback template is production-quality and reusable verbatim.

---

## skills/pr-merge/SKILL.md

**Type:** Executable workflow skill (GitHub PR merge with commentary)

**Portable:** High — uses `gh` CLI throughout; merge strategy detection via API is generic; flavour conventions are style, not coupling

**Reason:** The entire workflow is expressed via `gh pr view`, `gh pr diff`, `gh pr checks`, `gh pr comment`, and `gh pr merge`. The merge strategy check (`allow_merge_commit` / `allow_squash_merge` / `allow_rebase_merge`) is a GitHub API standard. No framework, language, or host assumptions.

**Trigger:** PR is ready to merge and user wants to land it with context visible in the GitHub timeline

**Steps/contract:**
1. Identify PR (number/URL from user, or `gh pr list`)
2. Read diff (`gh pr diff`) — understand what changed
3. Check linked issues (scan body + commits for `#N` references)
4. Verify merge readiness: CI checks passing, required approvals, no conflicts
5. Post flavourful summary as PR comment (`gh pr comment`) — BEFORE merging
6. `gh pr merge <number> --merge --subject "<subject>"` (no body)
7. Confirmation summary

**Strip:**
- Flavour examples (style; keep the format spec, drop the verbatim examples or keep as reference)
- Nothing structural needs stripping

**Structure/format:** Prose intro + numbered H3 steps + code blocks + commit subject format spec + comment examples + checklist. Clean and well-paced. The checklist is actionable.

**Notes:** "Comment before merge" ordering is a deliberate and important design choice — the flavour comment appears in the GitHub timeline at the right moment. The "no body in merge commit" / "all narrative goes in the comment" split is a strong, portable convention worth naming explicitly.

---

## skills/pr-resolve-discussions/SKILL.md

**Type:** Executable workflow skill (PR review thread resolution + architectural fixing)

**Portable:** High — uses GitHub GraphQL API for thread fetching/resolving; philosophy and classification framework are universally applicable

**Reason:** All GitHub interactions use standard GraphQL mutations (`reviewThreads`, `addPullRequestReviewThreadReply`, `resolveReviewThread`). The classification table (real bug / design smell / already handled / false positive / preference) is a reusable decision framework. The Garbage Elimination Principles are language-agnostic software quality rules.

**Trigger:** PR has unresolved review threads; user mentions "resolve discussions", "fix review comments", "address PR feedback", or PR is blocked on threads

**Steps/contract:**
1. Fetch PR context + all review threads via GraphQL
2. Classify each thread (real bug / design smell / valid-already-handled / false positive / preference)
3. Investigate real findings: trace blast radius, find root cause, check for same class of bug elsewhere, design fix at correct abstraction level
4. Implement fixes directly (no issues, no permission-asking); update callers, tests; run test suite
5. Reply to each thread on GitHub (fixed: cite commit + rationale; false positive: cite evidence trail)
6. Resolve threads via GraphQL mutation
7. Commit fixes (logical grouping), push, present summary table

**Strip:**
- Nothing critical — the GraphQL queries include placeholder `OWNER/REPO/NUMBER` vars that need parameterisation but are not coupled to a specific repo

**Structure/format:** Philosophy section + numbered H3 steps + classification table + implementation standards + reply format specs + bash/GraphQL code blocks + Garbage Elimination Principles list + summary table format. Richly structured; the philosophy and principles sections are unusually strong and should be preserved verbatim.

**Notes:** The "err on the side of real" heuristic (60% sure it's false positive → treat as real) is a high-signal agent-behaviour rule. The Garbage Elimination Principles (7 numbered rules) are independently valuable as a code-quality policy and could be extracted as a standalone skill component.

---

## skills/pr-review/SKILL.md

**Type:** Orchestration skill (parallel review subagent dispatcher)

**Portable:** Medium — the orchestration logic and GitHub inline-comment posting are generic; the subagent routing is tightly coupled to files at `~/.agents/agents/review-and-qa/`

**Reason:** The skill is an orchestrator that delegates to three named subagents (PR Reviewer, Security Reviewer, Verifier) whose definitions live at hard-coded paths. Any team adopting this skill must either have those agent files or substitute their own. The dispatch logic (standard vs security-sensitive vs has-criteria matrix) and the inline review comment posting pattern are fully portable. The severity emoji prefix convention (`🔴 🟠 🟡`) and the "one thread per finding" approach are strong portable conventions.

**Trigger:** User asks to review a PR, check a PR, or wants feedback before merging

**Steps/contract:**
1. Gather PR context: `gh pr view` + `gh pr diff`
2. Determine change sensitivity (security-sensitive? has acceptance criteria?)
3. Select agents per dispatch matrix (PR Reviewer always; +Security Reviewer if sensitive; +Verifier if criteria exist)
4. Spawn selected agents in parallel with PR number, diff, focus area, upstream context
5. Collate results into structured review summary (Code / Security / Verification / Overall Verdict)
6. Post as inline review via `gh api repos/{owner}/{repo}/pulls/{number}/reviews` with per-finding inline comments
7. If no PR exists, present in chat

**Strip:**
- Hard-coded agent file paths (`~/.agents/agents/review-and-qa/*.md`) — replace with parameterisable agent references or inline the agent prompts
- The `--request-changes` prohibition note is GitHub-platform-specific but worth keeping as a rules item

**Structure/format:** Prose intro + subagent table + numbered H3 steps + dispatch matrix table + collation template + inline-comment code block + rules list + follow-up skills section. Well-organised; the dispatch matrix is reusable as a decision table.

**Notes:** The inline comment batch API call pattern (single `reviews` POST with `comments` array) is the correct GitHub approach and is non-obvious — high value to preserve verbatim. The "zero-issue reviews are valid" rule prevents false positives from being fabricated to look useful.

---

## skills/prd-create/SKILL.md

**Type:** Interactive workflow skill (PRD authoring via user interview + issue filing)

**Portable:** High — the interview/module-design process and PRD template are framework-agnostic; GitHub issue filing with metadata discovery is generic; the "deep module" concept is universally applicable

**Reason:** The 5-step process (get description → explore repo → relentless interview → sketch modules → write PRD as GitHub issue) works for any software project on GitHub. The PRD template sections (Problem Statement, Solution, User Stories, Implementation Decisions, Testing Decisions, Out of Scope) are standard. The metadata discovery commands (`gh label list`, `gh api milestones`, `gh project list`) are generic GitHub API calls.

**Trigger:** User wants to write a PRD, create a product requirements document, or plan a new feature

**Steps/contract:**
1. Elicit long, detailed problem description + solution ideas from user
2. Explore repo — verify assertions, understand current state
3. Relentless interview until shared understanding; resolve dependency tree of design decisions
4. Sketch major modules (prefer deep modules with simple testable interfaces); confirm with user; confirm testing scope
5. Discover repo metadata (labels, issue types, milestones, projects, assignees)
6. Write PRD using template; create as GitHub issue with appropriate metadata flags

**Strip:**
- Worktree Setup section in the PRD template (`.worktrees/<feature-name>` / `feat/<feature-name>` convention) — repo-layout-specific; replace with a generic "implementation isolation" note or make conditional
- "Do NOT include specific file paths or code snippets" instruction in Implementation Decisions is a strong reusable rule — keep

**Structure/format:** Minimal prose framing + numbered flat steps + inline PRD template (fenced in `<prd-template>` tags) + metadata discovery bash snippets. Unusually sparse for its scope — the template is the primary artefact. The "you may skip steps if not necessary" opener is a useful flexibility signal.

**Notes:** The "deep module" definition (encapsulates lot of functionality in simple, testable interface that rarely changes) is a crisp, portable software design principle worth preserving verbatim. The instruction to test only external behaviour (not implementation details) in the Testing Decisions section is a strong, portable testing philosophy.
