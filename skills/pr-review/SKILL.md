---
name: pr-review
description: Review a pull request for bugs, security issues, and spec compliance by spawning parallel review subagents. Use when user asks to review a PR, check a PR, or wants feedback on changes before merging.
---

# Review PR

Review a pull request by delegating to specialist subagents in parallel. This skill orchestrates the review — it does not review code itself.

## Subagents

Agents live in `~/.agents/agents/review-and-qa/`. Read the agent file before spawning to confirm its interface.

| Agent | File | Purpose |
|---|---|---|
| **PR Reviewer** | `review-and-qa/pr-reviewer.md` | Bugs, correctness, API contracts. High-confidence issues only. |
| **Security Reviewer** | `review-and-qa/security-reviewer.md` | Threat modeling, auth/authz, OWASP Top 10, dependency audit. |
| **Verifier** | `review-and-qa/verifier.md` | Evidence-driven check against acceptance criteria. |

## Workflow

### 1. Gather PR context

```bash
gh pr view <number> --json title,body,headRefName,baseRefName,files,additions,deletions
gh pr diff <number>
```

Determine:
- **PR number and title**
- **Files changed** and their domains (auth, UI, data, infra, etc.)
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

If acceptance criteria exist, pass them verbatim to the Verifier.

### 4. Collate results

Once all agents return, combine into a single review summary:

```markdown
## PR Review: #<number> — <title>

### Code Review
<PR Reviewer output: summary + verdict + issues>

### Security Assessment
<Security Reviewer output: verdict + findings, or "Not applicable — no security-sensitive changes">

### Verification
<Verifier output: verdict + criteria checklist, or "No acceptance criteria provided">

### Overall Verdict
[✅ Approved | ⚠️ Approved with recommendations | ❌ Changes requested]

<1-2 sentence summary of what matters most>
```

### 5. Post findings to the PR

Always check whether a GitHub PR exists for the current branch, even if the user didn't mention one:

```bash
gh pr view --json number,url 2>/dev/null
```

If a PR exists, post the review as a **comment review** with every valid finding attached as an **inline review comment** anchored to the specific file and line, so each finding becomes its own discussion thread the author can resolve:

```bash
# Start a review, add inline comments, then submit in one batch.
# This creates proper review threads (not standalone comments).
gh api repos/{owner}/{repo}/pulls/{number}/reviews -f event=COMMENT -f body="<overall summary>" -f comments='[
  {"path": "src/foo.ts", "line": 42, "body": "🔴 **Bug**: <description>\n\n<suggested fix>"},
  {"path": "src/bar.ts", "line": 17, "body": "🟠 **Design smell**: <description>\n\n<architectural fix>"}
]'
```

Key rules for inline comments:
- One comment per finding, anchored to the most relevant changed line in the diff.
- Use the severity emoji prefix (`🔴`, `🟠`, `🟡`) so authors can triage at a glance.
- If a finding spans multiple files, comment on the primary location and mention the others in the body.
- If a finding applies to unchanged context lines (not part of the diff), post it as a top-level review body note instead — GitHub only allows inline comments on diff lines.
- Put the overall verdict (`✅ Approved`, `⚠️ Approved with recommendations`, or `❌ Changes requested`) in the review body itself.
- Do **not** call `gh pr review --request-changes` or any other follow-up review-submission command after posting the inline review.
- This avoids the GitHub limitation where authors cannot formally request changes on their own PRs, while still creating resolvable discussion threads for every finding.

If no PR exists, present the summary to the user in chat and note that findings weren't posted because there's no open PR.

## Rules

- **Do not review code yourself.** You are the orchestrator. Delegate everything to subagents.
- **Do not merge.** Review only. Use the `pr-merge` skill separately if the user wants to merge.
- **Zero-issue reviews are valid.** If agents find nothing, the verdict is ✅ Approved with a clean summary.
- **Bias toward fewer agents.** Don't spawn Verifier if there are no acceptance criteria. Don't spawn Security Reviewer for a docs-only PR.

## Follow-up Skills

- **`pr-resolve-discussions`** — If the PR already has unresolved review threads (from a prior review or from this one), suggest using `pr-resolve-discussions` to validate and fix them. That skill investigates each finding, implements architectural fixes for real issues, and resolves threads on GitHub.
- **`pr-merge`** — Once the review is clean and all discussions are resolved, use `pr-merge` to land it.
