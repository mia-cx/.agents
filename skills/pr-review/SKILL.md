---
name: pr-review
description: Review a pull request with production-code-first prioritization for bugs, security issues, spec compliance, and regression-safe remediation by spawning parallel review subagents. Use when user asks to review a PR, check a PR, validate proposed fixes, or wants feedback before merging.
---

# Review PR

Review a pull request by delegating to specialist subagents in parallel. This skill orchestrates the review — it does not review code itself.

## Subagents

Agents live in `~/.agents/agents/review-and-qa/`. Read the agent file before spawning to confirm its interface.

When spawning reviewer subagents, explicitly set the model to `openai-codex/gpt-5.6-sol:low`. The OpenAI provider name in the pi runtime is `openai-codex`, not `openai`; using `openai/gpt-*` will fail with a missing API key. Use low reasoning effort by default for PR review fan-out to keep review latency and cost down.

| Agent | File | Purpose |
|---|---|---|
| **PR Reviewer** | `review-and-qa/pr-reviewer.md` | Bugs, correctness, API contracts. High-confidence issues only. |
| **Security Reviewer** | `review-and-qa/security-reviewer.md` | Threat modeling, auth/authz, OWASP Top 10, dependency audit. |
| **Verifier** | `review-and-qa/verifier.md` | Evidence-driven check against acceptance criteria. |

## Production-first review policy

Treat production/runtime code as the product and tests as evidence about that product. Spend review attention in this order:

1. Production correctness, security, data integrity, concurrency, API contracts, and acceptance-criteria behavior
2. Configuration, migrations, deployment behavior, and user-facing documentation
3. Test correctness only where the tests materially affect confidence in the product or the required CI gate

Unless the PR explicitly delivers shared test infrastructure as its product, do not perform an open-ended audit of test code. Read tests to understand intended behavior and judge the evidence they provide. Do not spend review budget polishing tests while production/runtime changes remain insufficiently examined. If shared test tooling is itself the stated deliverable, review that tooling under the normal production correctness standard.

A test-only finding is admissible only when there is concrete evidence of a real correctness problem:

- The test can pass while required production behavior is broken because an assertion, mock, fixture, or exercised path is wrong.
- The test rejects correct production behavior or makes required CI fail or flake, demonstrated by a failing run or a reliable reproduction.
- The test causes an observable harmful side effect such as corrupting shared state or leaking resources across tests, with concrete evidence.
- A changed test removes or contradicts the only evidence for an explicit acceptance criterion or a high-risk production contract.

Do not report theoretical test flakes, timeout-budget speculation, test-helper architecture, duplication, naming, type purity, incidental coverage gaps, or extra edge cases merely to make the suite more issue-less. A coverage gap is review-worthy only when an explicit criterion requires it or a high-risk production contract otherwise has no meaningful verification.

Test-only findings must state the concrete false-positive, false-negative, reproduced CI failure, or harmful side effect. They are non-blocking by default. Block only when the issue currently breaks a required gate or can conceal a material production regression.

Do not recursively turn fixes to tests into another general review of the test harness. Verify the narrow correction and stop unless new concrete evidence shows another correctness failure. CI failures still need diagnosis, but a harness failure should receive the smallest reliable fix rather than architectural expansion.

## Workflow

### 1. Gather PR context

```bash
gh pr view <number> --json title,body,headRefName,baseRefName,files,additions,deletions
gh pr diff <number>
```

Determine:
- **PR number and title**
- **Files changed** and their domains (production/runtime, tests, auth, UI, data, infra, docs, etc.)
- **Whether acceptance criteria exist** (in the PR body, linked issue, or parent PRD)
- **Whether changes are security-sensitive** — touches auth, secrets, user input, data storage, external APIs, permissions, CORS, or crypto

### 2. Decide which reviewers to spawn

| Scenario | Agents | Execution |
|---|---|---|
| Standard change | PR Reviewer | Single agent |
| Security-sensitive change | Security Reviewer + PR Reviewer | Parallel — security findings fed to PR Reviewer summary |
| PR has acceptance criteria | PR Reviewer + Verifier | Parallel |
| Security-sensitive + has criteria | Security Reviewer + PR Reviewer + Verifier | All three parallel |

Default to **PR Reviewer + Security Reviewer** in parallel if unsure. Less noise is better than missed vulnerabilities.

### 3. Spawn subagents

Spawn selected agents in parallel using the subagent/Task tool. Each agent receives:

- The PR number and title
- The diff (or instruction to fetch it via `gh pr diff`)
- Their specific focus area
- Any upstream context (e.g., if running sequentially, Security Reviewer findings go to PR Reviewer)
- An explicit instruction to perform remediation-impact analysis for every finding: propose a fix, trace what that fix would affect, identify new failure modes it could introduce, and revise the recommendation to prevent those regressions
- An explicit instruction to review production/runtime code first and apply the test-only finding gate above before reporting anything in test code

If acceptance criteria exist, pass them verbatim to the Verifier.

### 4. Stress-test proposed remediations

A review is incomplete if it identifies the current defect but recommends a fix that predictably creates another one. For every valid finding, require the reviewing agent to:

1. **Trace the blast radius of the proposed fix.** Follow affected callers, callees, shared interfaces, state ownership, persistence, permissions, concurrency, and external contracts.
2. **Model induced failure modes.** Ask what becomes newly possible after the fix: regressions, stale state, rollback, privilege expansion, data loss, races, broken compatibility, hidden buffering/resource limits, or a second path that bypasses the new guard.
3. **Search for sibling cases.** Check whether the same abstraction or pattern appears elsewhere and whether a local fix would leave equivalent bugs behind.
4. **Strengthen the remediation.** Incorporate safeguards for credible induced risks into the proposed solution itself. Prefer changing the ownership boundary, type, or shared abstraction over stacking one-off guards.
5. **Specify proportionate regression evidence.** Require tests for the original production bug and high-confidence induced production failure modes. If production behavior depends on a real tool or service contract, prefer a production-shaped adapter/integration test over permissive fakes. Do not require meta-tests for test helpers or tests for every theoretical induced risk.

Keep this analysis evidence-based. Do not inflate reviews with hypothetical chains that require implausible preconditions; report induced risks only when they follow concretely from the proposed change or affected contract.

For an admissible test-only finding, prefer the smallest correction that restores trustworthy evidence or a reliable required gate. Do not broaden the test harness, introduce new supervisors/frameworks, or demand regression tests for the test infrastructure unless that shared infrastructure has a reproduced correctness failure.

### 5. Collate results

Once all agents return, combine into a single review summary:

```markdown
## PR Review: #<number> — <title>

### Code Review
<PR Reviewer output: summary + verdict + production/runtime issues first, then admissible test-correctness issues if any>

### Security Assessment
<Security Reviewer output: verdict + findings, or "Not applicable — no security-sensitive changes">

### Verification
<Verifier output: verdict + criteria checklist, or "No acceptance criteria provided">

### Remediation Safety
<For each finding: proposed architectural fix, affected contracts, credible induced risks, safeguards incorporated into the recommendation, and required regression tests>

### Overall Verdict
[✅ Approved | ⚠️ Approved with recommendations | ❌ Changes requested]

<1-2 sentence summary of what matters most>
```

### 6. Post findings to the PR

Always check whether a GitHub PR exists for the current branch, even if the user didn't mention one:

```bash
gh pr view --json number,url 2>/dev/null
```

If a PR exists, post the review as a **comment review** with every valid finding attached as an **inline review comment** anchored to the specific file and line, so each finding becomes its own discussion thread the author can resolve:

```bash
# Start a review, add inline comments, then submit in one batch.
# This creates proper review threads (not standalone comments).
gh api repos/{owner}/{repo}/pulls/{number}/reviews -f event=COMMENT -f body="<overall summary>" -f comments='[
  {"path": "src/foo.ts", "line": 42, "body": "🔴 **Bug**: <description>\n\n**Regression-safe fix:** <architectural remediation>\n**Induced-risk check:** <what a naive fix could break and how this design avoids it>\n**Tests:** <original bug + induced regression cases>"},
  {"path": "src/bar.ts", "line": 17, "body": "🟠 **Design smell**: <description>\n\n**Regression-safe fix:** <ownership/type/interface change>\n**Induced-risk check:** <credible secondary failure modes>\n**Tests:** <evidence required>"}
]'
```

Key rules for inline comments:
- One comment per finding, anchored to the most relevant changed line in the diff.
- Each comment must describe the defect, the regression-safe architectural fix, the credible problems a naive fix could introduce, and the tests that prevent both the original and induced failures. Keep it concise when no induced risk exists.
- For a test-only finding, include the concrete failing run/reproduction or explain exactly how the test produces false confidence in material production behavior. Do not post test polish as a finding.
- Use the severity emoji prefix (`🔴`, `🟠`, `🟡`) so authors can triage at a glance.
- If a finding spans multiple files, comment on the primary location and mention the others in the body.
- If a finding applies to unchanged context lines (not part of the diff), post it as a top-level review body note instead — GitHub only allows inline comments on diff lines.
- Put the overall verdict (`✅ Approved`, `⚠️ Approved with recommendations`, or `❌ Changes requested`) in the review body itself.
- Do **not** call `gh pr review --request-changes` or any other follow-up review-submission command after posting the inline review.
- This avoids the GitHub limitation where authors cannot formally request changes on their own PRs, while still creating resolvable discussion threads for every finding.

If no PR exists, present the summary to the user in chat and note that findings weren't posted because there's no open PR.

## Rules

- **Do not review code yourself.** You are the orchestrator. Delegate everything to subagents.
- **Do not implement fixes.** Review only. “Fix preemptively” means designing the recommendation so it already accounts for foreseeable regressions; use `pr-resolve-discussions` when the user wants code changes.
- **Do not merge.** Review only. Use the `pr-merge` skill separately if the user wants to merge.
- **Production code dominates review attention.** Do not trade investigation of runtime behavior for attempts to make the test suite issue-less.
- **Do not recurse on test polish.** After a test-only correction, verify the reported failure is fixed; do not start another broad review of the changed test scaffolding without new correctness evidence.
- **Zero-issue reviews are valid.** If agents find nothing, the verdict is ✅ Approved with a clean summary.
- **Bias toward fewer agents.** Don't spawn Verifier if there are no acceptance criteria. Don't spawn Security Reviewer for a docs-only PR.

## Follow-up Skills

- **`pr-resolve-discussions`** — If the PR already has unresolved review threads (from a prior review or from this one), suggest using `pr-resolve-discussions` to validate and fix them. That skill investigates each finding, implements architectural fixes for real issues, and resolves threads on GitHub.
- **`pr-merge`** — Once the review is clean and all discussions are resolved, use `pr-merge` to land it.
