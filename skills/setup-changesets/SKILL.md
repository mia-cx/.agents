---
name: setup-changesets
description: "Sets up Changesets for versioning, changelog generation, and release automation in a repo. Use when the user wants to add Changesets, automate version PRs, or establish a release workflow for a package or monorepo. Not for actually cutting a release that is already configured."
---

# Setup Changesets

Treat this file as a router. Use the setup guide for installation and automation, then load usage guidance only when you need day-to-day authoring behavior.

## Workflow

1. Read `references/setup.md` for project detection, installation, config, workflow creation, and CI reminders.
2. Read `references/using-changesets.md` when the user needs worktree usage patterns or non-interactive changeset authoring.
3. Coordinate with `setup-ci` only when the repo also needs CI wiring or pnpm cache conventions.

## Rules

- Keep setup concerns separate from contributor-usage guidance.
- Prefer repository-specific config over generic defaults when package shape or deployment flow differs.
- Do not use this skill to cut a release that is already configured; that belongs to `release`.
