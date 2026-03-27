---
name: refactor-plan
description: "Creates a detailed refactor plan with tiny, safe commit steps and files it as a GitHub issue. Use when the user wants to plan a refactor, de-risk a large code change, or break an architectural cleanup into incremental steps. Not for executing the refactor immediately or for greenfield feature planning."
---

# Refactor Plan

Treat this file as a router. Use the workflow guide to shape the refactor, then load the issue template when you are ready to file the plan.

## Workflow

1. Read `references/workflow.md` for problem discovery, repo exploration, option analysis, scope-setting, testing discussion, and tiny-commit planning.
2. Read `references/issue-template.md` when drafting the GitHub issue body.
3. Keep the plan focused on safe, incremental refactor steps rather than implementation diff details.

## Rules

- Separate refactor discovery from issue-template mechanics.
- Bias toward tiny commits that preserve a working codebase.
- The deliverable is a filed GitHub issue with an executable plan.
