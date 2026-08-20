---
name: next-slice
description: >-
  Advance to the next PRD slice after a merge: clean up the finished worktree
  and branch, fast-forward main, pick the next unblocked sub-issue of the PRD,
  set up a fresh worktree, and hand off to address-issue. Use when the user
  says "next slice", "move on", "advance", or wants to start the next issue
  after a merge.
---

# Next slice

Transition from a just-merged slice to the next one. This skill handles the in-between (cleanup, branch hygiene, slice selection, fresh worktree), then hands the chosen issue to the `address-issue` skill, which owns planning, implementation, and the PR.

## Workflow

### 1. Verify the current slice is done

- Identify the repo root (the main worktree, not a `.worktrees/` child), the current worktree, and its feature branch.
- Confirm the PR for the current slice is merged. If not, stop and report: the slice isn't done (`review-relay` / `pr-merge` come first).

### 2. Clean up the finished slice

From the **repo root** (not from inside the worktree being removed):

```bash
cd <repo-root>
git worktree remove .worktrees/<current-name>
git branch -d <current-branch>
git pull --ff-only origin main
```

A `-d` warning about the branch not being merged to HEAD is expected; it merged to `origin/main` via the PR. Use `-D` only if `-d` fails and the PR is confirmed merged. Confirm the repo root ends up clean and tracking `origin/main`.

### 3. Pick the next slice

The parent PRD's sub-issues are the source of truth. A slice is eligible when it is **open** and **unblocked** (every issue in its "Blocked by" section is closed):

```bash
# Sub-issues of the PRD with their state
gh api graphql -f owner=OWNER -f repo=REPO -F number=PRD_NUMBER -f query='
  query($owner:String!,$repo:String!,$number:Int!){
    repository(owner:$owner,name:$repo){issue(number:$number){
      subIssues(first:50){nodes{number title state}}}}}'

# Check a candidate's blockers via its body's "Blocked by" section
gh issue view <number> --json body,state
```

Pick the lowest-numbered eligible slice; prefer AFK slices when an HITL slice would otherwise block unattended progress. Without a PRD, fall back to `.plans/*.md` order or open implementation issues. Skip meta/tracking issues (PRDs, discussions, umbrella trackers).

If no eligible slice remains: report all slices complete, or name the HITL/blocked issues that need the user.

### 4. Set up the new worktree

Derive the worktree and branch names from the issue title:

```bash
cd <repo-root>
git worktree add .worktrees/<short-name> -b feat/<short-name> main
```

### 5. Report and hand off

```
Cleaned up: .worktrees/<old> (branch <old-branch> deleted)
Main: <commit> on origin/main
Next slice: #<N> <title> (sub-issue of PRD #<P>)
Worktree: .worktrees/<new> on branch <new-branch>
```

Then run the `address-issue` skill on issue `#<N>` in the new worktree; it owns the plan file, TODO-per-commit implementation, and the PR. Begin immediately if the user asked to advance and implement; otherwise wait for their go-ahead.

## Rules

- Always operate from the repo root when removing worktrees or pulling main.
- Never force-delete branches without confirming the PR is merged.
- Each slice gets its own worktree under `.worktrees/`; never implement directly on `main`.
- If the next eligible slice is HITL, surface the decision it needs instead of starting it unattended.
