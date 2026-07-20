---
description: Worktree placement for local git repos. Apply when creating or moving project worktrees. Put new worktrees inside the repo root's `./.worktrees/` directory so each repo keeps its own worktree set together and agents avoid scattering them across tool-specific folders.
alwaysApply: false
---

# Worktree Location

Create new project worktrees inside the repo root's `./.worktrees/` directory.

Examples:

- `~/vesta-cx/vesta` -> `~/vesta-cx/vesta/.worktrees/<name>`
- `~/mia-cx/textile` -> `~/mia-cx/textile/.worktrees/<name>`

Why:

- Keeps worktrees grouped with the repo they belong to.
- Avoids scattering worktrees across tool-specific directories like `.cursor/`, `.t3/`, or other agent folders.
- Makes cleanup, discovery, and manual Git inspection predictable.

Workflow:

1. From the repo root, ensure `./.worktrees/` exists.
2. Create new worktrees under `./.worktrees/<branch-or-task-name>`.
3. Leave existing worktrees where they are unless the user explicitly asks to move them.
4. If a repo has its own documented worktree convention, follow that repo-specific rule for that task.
