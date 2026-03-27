### 6. Write the plan files

Create `.plans/` if it doesn't exist. Add `.plans/` to `.gitignore` if not already present — plans are working documents, not committed artifacts.

Write **one Markdown file per slice**, named `<issue-number>-<short-name>.md` (e.g. `.plans/42-sqlite-store.md`). If the slices come from a `prd-to-issues` breakdown with GitHub issue numbers, use those numbers. Otherwise use sequential phase numbers.

Also write a **root plan file** `.plans/README.md` that links all slices together with the dependency graph and architectural decisions.

<root-plan-template>
# Plan: <Feature Name>

> Source PRD: <brief identifier or link>

## Architectural decisions

Durable decisions that apply across all slices:

- **Schema**: ...
- **Key models**: ...
- **Routes / API contracts**: ...
- (add/remove sections as appropriate)

## Slices

| # | Plan | Title | Blocked by | Status |
|---|------|-------|------------|--------|
| 3 | [scaffold](.plans/3-scaffold.md) | Package scaffold | — | ☐ |
| 4 | [store](.plans/4-sqlite-store.md) | SQLite store | #3 | ☐ |
| ... | ... | ... | ... | ... |

## Worktree setup

Each slice should be implemented in a dedicated worktree:

```bash
git worktree add .worktrees/<short-name> -b feat/<short-name>
cd .worktrees/<short-name>
```

Merge back to `main` only after the slice is complete and reviewed.
</root-plan-template>

<slice-plan-template>
# Slice: <Title>

> Issue: #<number> | PRD: #<prd-number>
> Blocked by: #<blocker-numbers> (or "None")

## Worktree setup

```bash
git worktree add .worktrees/<short-name> -b feat/<short-name>
cd .worktrees/<short-name>
```

## What to build

A concise description of this vertical slice. Describe the end-to-end behavior, not layer-by-layer implementation. Reference specific sections of the parent PRD rather than duplicating content.

## Key decisions

Decisions specific to this slice that aren't in the root plan:

- ...

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## User stories addressed

- User story N
- User story M
</slice-plan-template>
