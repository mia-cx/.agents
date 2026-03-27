---
name: audit-deps
description: "Audits project dependencies for outdated packages, vulnerabilities, and risky upgrade paths, then proposes safe, staged upgrades. Use when the user mentions package audits, outdated deps, npm/pnpm/pip upgrades, CVEs, advisories, or dependency hygiene. Prefer this over a whole-codebase security review when the focus is dependencies rather than application logic."
---

# Dependency Audit & Upgrade

Treat this file as a router. First identify whether the task is an audit, a safe update pass, or a major-upgrade plan, then load only the relevant workflow guidance.

## Workflow

1. Read `references/audit-workflow.md`.
   - It covers ecosystem detection, vulnerability audits, outdated-package review, safe updates, major-upgrade planning, and transitive-vulnerability handling.
2. Read `references/rules.md` before executing updates so the verification and worktree rules stay in force.
3. Execute only the risk level that matches the user’s request:
   - report only
   - patch/minor updates
   - major-upgrade issue planning

## Rules

- Keep audit, execution, and major-upgrade planning conceptually separate.
- Prefer direct low-risk updates and issue-based planning for major changes.
- Verify every dependency change with the project’s available quality gates.
