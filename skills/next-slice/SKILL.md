---
name: next-slice
description: >-
  Advance to the next implementation slice after merging a PR. Cleans up the
  current worktree and branch, fast-forwards main, then sets up a fresh
  worktree and branch for the next slice — from local plan files if available,
  or from GitHub issues as fallback. Use when the user says "next slice", "move
  on", "next plan", "advance", or wants to start the next issue after a merge.
---

# Next Slice

Transition from a just-merged slice to the next one. Handles worktree cleanup,
branch hygiene, main fast-forward, and fresh worktree setup — then reads the
plan so implementation can begin immediately.

## Workflow

### 1. Identify the current state

Determine:
- **Repo root** — the main worktree (not a `.worktrees/` child).
- **Current worktree** — if the session is inside `.worktrees/<name>`, that's the one to clean up.
- **Current branch** — the feature branch associated with the worktree.
- **Merged PR** — confirm the PR for the current slice is merged. If not, stop and report.

### 2. Clean up the finished slice

From the **repo root** (not from inside the worktree being removed):

```bash
cd <repo-root>
git worktree remove .worktrees/<current-name>
git branch -d <current-branch>
```

If the branch delete warns about not being merged to HEAD, that's expected —
it was merged to `origin/main` via the PR. Use `-D` only if `-d` fails and
the PR is confirmed merged.

### 3. Fast-forward main

```bash
cd <repo-root>
git pull --ff-only origin main
```

Confirm the repo root is clean and tracking `origin/main`.

### 4. Find the next slice

Check for local plan files:

```bash
ls .plans/*.md 2>/dev/null | sort -t/ -k2 -n
```

Pick the lowest-numbered plan whose corresponding GitHub issue is still open:

```bash
gh issue view <number> --json state --jq '.state'
```

**If no plan file exists for the next issue** — fetch the issue from GitHub,
generate the plan, write it to `.plans/<N>-<slug>.md`, and proceed with that
plan. Do not skip ahead or fall back to working directly from the issue body.

```bash
gh issue list --state open --json number,title,labels,body | head -20
```

Prefer issues with a label like `slice`, `implementation`, or `feat`. If none
are labelled, use your judgement from the title and body to skip meta/tracking
issues (e.g. PRDs, discussions, umbrella trackers) and find the next actionable
implementation issue.

If no open slice remains, report that all slices are complete.

### 5. Read (or create) the plan

**If the plan file already exists** — read the full `.plans/<N>-<slug>.md` file and extract:
- **Issue number and title**
- **Worktree name** — from the plan's worktree setup section (e.g. `.worktrees/rpc`)
- **Branch name** — from the plan's worktree setup section (e.g. `feat/rpc`)
- **What to build** — the implementation spec
- **Acceptance criteria** — the checklist to satisfy

**If no plan file exists for the chosen issue** — fetch the full issue:

```bash
gh issue view <number> --json number,title,body,labels
```

Generate a plan in the same format as existing `.plans/` files, using the issue
body as the source of truth. Write it to `.plans/<N>-<slug>.md` before
proceeding. Derive worktree and branch names from the issue's worktree setup
section if present, otherwise from the title:
- Worktree: `.worktrees/<slugified-title>`
- Branch: `feat/<slugified-title>`

Then treat the newly written plan as the canonical source for the rest of the workflow.

### 6. Create the new worktree

```bash
cd <repo-root>
git worktree add .worktrees/<name> -b <branch> main
```

Confirm the worktree was created and is on the correct branch at the same
commit as `main`.

### 7. Report and hand off

Present a summary:

```
Cleaned up: .worktrees/<old> (branch <old-branch> deleted)
Main: <commit> on origin/main
Next slice: #<N> — <title>
Plan: .plans/<N>-<slug>.md (existing | generated from issue #<N>)
Worktree: .worktrees/<new> on branch <new-branch>
```

Then read the plan's "What to build" section and begin implementation, or
wait for the user's go-ahead — match whatever the user asked for.

### 8. Plan execution order

Before starting implementation:

- Use the recommended execution order from the plan file if one is present.
- If none is present, derive one by analysing the dependency graph between tasks in the slice — tasks that have no inter-dependencies can run concurrently; tasks that depend on earlier output must run sequentially.
- Present the proposed order to the user if it's non-obvious, then proceed.

### 9. Implement with concurrency and appropriate models

For tasks that can run concurrently, spawn subagents in parallel via the Agent tool. For sequential tasks, run them one at a time.

When spawning subagents, choose the model based on slice complexity:
- **Opus** — deep architecture decisions, complex multi-file refactors, ambiguous requirements
- **Sonnet** — standard feature implementation, moderate complexity
- **Haiku** — simple, well-scoped tasks (boilerplate, file moves, trivial edits)

Each slice should be implemented in its own worktree at `.worktrees/<branch-name>` off `main`.

Forward these instructions to every subagent:
- Use the `/gc` skill to commit as you work.
- Use the `/pr-file` skill after finishing the slice.

## Rules

- Always operate from the repo root when removing worktrees or pulling main.
- Never force-delete branches (`-D`) without confirming the PR is merged.
- If the plan file specifies a different worktree/branch name than the convention, use the plan's names.
- If the GitHub issue for the next slice is closed, skip it and try the one after.
- Don't start implementation unless the user asked for it or the context clearly implies it.
- Each slice gets its own worktree under `.worktrees/` — never implement directly on `main`.
- Always use `/gc` to commit during implementation and `/pr-file` to file the PR when done.
