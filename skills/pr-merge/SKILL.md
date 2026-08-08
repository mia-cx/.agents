---
name: pr-merge
description: >-
  Merges a pull request with style. Posts a flavourful summary comment, merges
  with a clean conventional commit subject, closes directly linked issues, then
  fast-forwards the local base branch. Use when a PR is ready to merge and the
  user asks to merge or land it.
---

# Merge a Pull Request

Read the PR, post a flavourful comment, merge with a clean subject, close its linked issues, fast-forward the local base branch.

The user's request to merge is authoritative confirmation that required human validation is complete. Do not leave the PR or a linked issue open because a validation checkbox or comment was not separately updated first.

## Workflow

### 1. Identify and read the PR

- Use the provided PR number/URL; otherwise `gh pr list --state open` and pick the obvious one (ask only if genuinely ambiguous).
- `gh pr view <number> --json title,body,headRefName,baseRefName,commits,files,reviews,comments,labels,milestone` and `gh pr diff <number>` — understand what the PR actually delivers.
- Record every open issue directly referenced by the PR body or commits (`#N`, `Fixes #N`, `Closes #N`) for closing after the merge. Do not recursively close parent, dependency, or related issues mentioned only inside those linked issues.

### 2. Check merge readiness

- CI passing: `gh pr checks <number>`
- Required approvals present (`reviews` from step 1)
- No conflicts: `gh pr view <number> --json mergeable`

If the PR is not ready, report the blockers and stop. Do not merge a PR that isn't green.

### 3. Post the flavour comment

Before merging, post the narrative as a PR comment so it lives in GitHub's timeline:

```bash
gh pr comment <number> --body "<flavour body>"
```

Summarize the PR's impact with personality — a senior dev proud of what the team shipped. Dry wit, a pun, a lyric, a mini-poem, a metaphor — all fair game, and the substance (what it delivers, key decisions, anything to watch) always comes through.

**feat:**
> *"We're not in Kansas anymore"* — and neither is the dashboard. Ships the analytics overview: real-time charts, filterable date ranges, and an export button that actually works.

**fix:**
> The auth token was expiring mid-request like a carton of milk left on the counter. Added a refresh buffer so tokens get renewed 30 seconds before expiry instead of after the 401 hits.

**chore:**
> *"I fought the deps and the deps won"* — bumped everything that wasn't pinned, fixed the two breaking changes, and updated the lockfile. CI is green and the audit is clean.

### 4. Merge

Merge immediately after the comment — no approval round-trip:

```bash
gh pr merge <number> --merge --delete-branch --subject "type(scope): short imperative description (#N)"
```

- Subject only, **no body** — the flavour lives in the comment.
- `--delete-branch` matters most in a stack: GitHub retargets a child PR onto the merged base only
  when the head branch is deleted, so keeping it means retargeting every child by hand. Merged
  branches are recoverable from the merge commit, so this costs nothing.
- Under ~72 chars, no trailing period, PR number at the end.
- `--merge` by default; match the repo's convention (`--squash` / `--rebase`) when it has one — check `gh api repos/{owner}/{repo} --jq '.allow_merge_commit, .allow_squash_merge, .allow_rebase_merge'` if unsure.

### 5. Fast-forward the local base branch

Update the local base (the PR's `baseRefName`, usually `main`) so the repo is ready for the next slice:

```bash
base="$(gh pr view <number> --json baseRefName --jq '.baseRefName')"
git fetch origin "$base"
base_worktree="$(
  git worktree list --porcelain | awk -v branch="refs/heads/$base" '
    /^worktree / { path = substr($0, 10) }
    /^branch / && substr($0, 8) == branch { print path; exit }
  '
)"

if [ -n "$base_worktree" ]; then
  git -C "$base_worktree" pull --ff-only
else
  git fetch origin "$base:$base"
fi
```

If the fast-forward fails because the local base is dirty or diverged, report that the PR merged but the local base needs attention. Do not reset, stash, or discard local work.

### 6. Close linked issues

Close every still-open issue recorded in step 1 as completed, with the completion evidence in the timeline:

```bash
gh issue close <issue-number> --reason completed \
  --comment "Completed by #<pr-number> (<merge-commit>)."
```

Close them whether linked via `Refs`, `Fixes`, or `Closes` — GitHub may have auto-closed some, so skip issues already closed. Only leave a directly linked issue open on explicit user request.

Confirm with a summary like **"PR #N merged and local main fast-forwarded. Another one bites the dust. 🎤"**
