---
name: setup-pre-commit
description: "Sets up Husky pre-commit hooks with lint-staged, formatting, typechecks, and tests. Use when the user wants commit-time guardrails, local formatting hooks, or pre-commit automation before code reaches CI. Not for GitHub Actions CI or Changesets-based release automation."
---

# Setup Pre-Commit Hooks

Treat this file as a router. Read the setup guide, then execute the hook installation and verification in order.

## Workflow

1. Read `references/setup.md` for package-manager detection, dependency installation, Husky/lint-staged setup, verification, and commit guidance.
2. Adapt the generated hook to the repo’s actual scripts instead of assuming `typecheck` and `test` always exist.
3. Verify the hook locally before treating the setup as complete.

## Rules

- Keep the main file operational and route the details into the setup reference.
- Prefer minimal, repo-matching hooks over boilerplate that breaks commits.
- Use a worktree when hook breakage could disrupt broader work.
