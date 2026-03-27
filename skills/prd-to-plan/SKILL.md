---
name: prd-to-plan
description: Turn a PRD into a multi-phase implementation plan using tracer-bullet vertical slices, saved as local Markdown files in .plans/. Use when user wants to break down a PRD, create an implementation plan, plan phases from a PRD, or mentions "tracer bullets".
---

# PRD to Plan

Break a PRD into a phased implementation plan using vertical slices (tracer bullets). Output is one Markdown file per slice in `.plans/` (gitignored — plans are working documents, not committed artifacts).

## Process

### 1. Confirm the PRD is in context

The PRD should already be in the conversation. If it isn't, ask the user to paste it or point you to the file.

### 2. Explore the codebase

If you have not already explored the codebase, do so to understand the current architecture, existing patterns, and integration layers.

### 3. Identify durable architectural decisions

Before slicing, identify high-level decisions that are unlikely to change throughout implementation:

- Route structures / URL patterns
- Database schema shape
- Key data models
- Authentication / authorization approach
- Third-party service boundaries

These go in the plan header so every phase can reference them.

### 4. Draft vertical slices

Break the PRD into **tracer bullet** phases. Each phase is a thin vertical slice that cuts through ALL integration layers end-to-end, NOT a horizontal slice of one layer.

<vertical-slice-rules>
- Each slice delivers a narrow but COMPLETE path through every layer (schema, API, UI, tests)
- A completed slice is demoable or verifiable on its own
- Prefer many thin slices over few thick ones
- Do NOT include specific file names, function names, or implementation details that are likely to change as later phases are built
- DO include durable decisions: route paths, schema shapes, data model names
</vertical-slice-rules>

### 5. Quiz the user

Present the proposed breakdown as a numbered list. For each phase show:

- **Title**: short descriptive name
- **User stories covered**: which user stories from the PRD this addresses

Ask the user:

- Does the granularity feel right? (too coarse / too fine)
- Should any phases be merged or split further?

Iterate until the user approves the breakdown.

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
