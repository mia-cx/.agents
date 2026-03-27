---
name: release
description: "Cuts a release by versioning, reviewing the release PR, drafting notes, and publishing the GitHub release, with or without Changesets. Use when the user wants to release, publish, tag, version, write release notes, or build a changelog from recent work. Not for initial changeset setup or CI pipeline creation."
---

# Release

Treat this file as a router. Detect the release mode first, then load only the guide for that mode.

## Workflow

1. Detect the repo’s release strategy:
   - Changesets repo → read `references/changesets-release.md`
   - No Changesets setup → read `references/manual-release.md`
2. Read `references/worktree-and-checklist.md` before final execution so you cut the release from the right place and verify all release steps happened.
3. Show the user the proposed version and release notes before pushing tags or publishing the GitHub release.

## Rules

- Keep Changesets and manual release logic separate in context.
- Cut releases from `main`, not from an arbitrary worktree.
- Do not publish until changelog/release notes have been reviewed.
