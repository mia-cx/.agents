---
name: pr-review
description: "Reviews a pull request for bugs, security issues, and spec mismatches using parallel review passes. Use when the user wants feedback on an existing PR, asks to review changes before merge, or wants a merge-readiness check. Not for resolving already-filed review threads or performing a whole-codebase audit."
---

# Review PR

Treat this file as a router. Use the subagent/workflow guide to orchestrate the review, then load the rules/follow-up notes when finalizing the result.

## Workflow

1. Read `references/subagents-and-workflow.md` for subagent selection, PR context gathering, result collation, and GitHub posting mechanics.
2. Read `references/rules-and-followups.md` for orchestration guardrails and the right next skill after review.
3. Stay in orchestrator mode throughout: delegate, collate, post.

## Rules

- Separate the mechanics of running the review from the policy about what not to do.
- Keep the review focused on actionable, high-signal findings.
- Hand off unresolved-thread work to `pr-resolve-discussions`, and merge work to `pr-merge`.
