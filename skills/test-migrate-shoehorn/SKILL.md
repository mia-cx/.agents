---
name: test-migrate-shoehorn
description: "Migrates test data from brittle `as` type assertions to `@total-typescript/shoehorn` helpers. Use when the user mentions shoehorn, wants to replace `as` in tests, or needs partial or focused test fixtures without unsafe casts. Not for general TypeScript refactors outside test code."
---

# Migrate to Shoehorn

Treat this file as a router. Read the migration-pattern guide for conversion choices, then load the workflow guide when you are ready to execute the migration.

## Workflow

1. Read `references/migration-patterns.md` for why shoehorn exists, which helper to use, and before/after migration patterns.
2. Read `references/workflow.md` for repo questions, worktree setup, installation, replacement steps, and verification.
3. Keep the migration scoped to test code only.

## Rules

- Separate pattern selection from repo-wide execution.
- Use `fromPartial()` for partial valid fixtures and `fromAny()` for intentionally invalid data.
- Do not spread shoehorn into production code.
