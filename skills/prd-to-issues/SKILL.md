---
name: prd-to-issues
description: "Breaks a PRD into independently grabbable GitHub issues using tracer-bullet vertical slices. Use when the user already has a PRD and wants implementation tickets, execution slices, or a backlog derived from that document. Not for writing the PRD itself or creating a local-only phase plan."
---

# PRD to Issues

Treat this file as a router. First design the slice breakdown, then load the GitHub mechanics only when you are ready to create issues.

## Workflow

1. Read `references/planning-workflow.md` for:
   - locating the PRD
   - optional codebase exploration
   - metadata discovery
   - drafting vertical slices
   - quizzing the user and getting approval
2. Once the breakdown is approved, read:
   - `references/github-operations.md` for sub-issues and blocking-relationship mechanics
   - `references/issue-template.md` for the issue body structure
   - `references/confirmation.md` for the final verification pass
3. Keep planning in context first; do not load GitHub API mechanics before the user approves the slice breakdown.

## Rules

- Keep tracer-bullet planning separate from issue-creation mechanics.
- Prefer many demoable vertical slices over layer-by-layer tickets.
- Only create GitHub issues after the dependency graph and metadata plan are approved.
