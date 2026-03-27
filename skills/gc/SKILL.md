---
name: gc
description: "Splits the current working tree into a small set of logical, single-concern git commits, executes the commits, and pushes them. Use when the user wants help organizing uncommitted changes, producing clean conventional commits, or turning one messy diff into a readable commit series. Not for branch strategy, rebases, or PR review unless the main task is commit hygiene."
---

# Organize Changes Into Logical Commits

Treat this file as a router. First group the diff into concerns, then load the commit-writing guidance only when you're ready to execute commits.

## Workflow

1. Read `references/workflow.md` for repository inspection, issue matching, concern grouping, and commit execution.
2. Read `references/commit-messages.md` for subject/body conventions, flavour guidance, and final checks.
3. Execute the commits and push once the grouping plan is clear.

## Rules

- Keep commit grouping separate from commit prose so the history shape is decided first.
- One concern per commit beats one file per commit.
- Do the work, don't just propose it.
