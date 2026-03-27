---
name: prd-to-plan
description: "Turns a PRD into a phased implementation plan saved as local Markdown files in `.plans/`, using tracer-bullet vertical slices. Use when the user wants a step-by-step build plan from an existing PRD, especially before creating tickets or coding. Prefer this over PRD-to-issues when the output should stay local and phase-oriented."
---

# PRD to Plan

Treat this file as a router. First design the vertical-slice breakdown, then load the plan-writing templates only when the slice structure is approved.

## Workflow

1. Read `references/planning-workflow.md` for PRD intake, codebase exploration, durable decisions, slice drafting, and user approval.
2. Read `references/plan-templates.md` when writing `.plans/README.md` and the per-slice plan files.
3. Keep planning in terms of behavior, dependencies, and durable architecture rather than volatile file-level details.

## Rules

- Separate the slice-design conversation from the final markdown-writing step.
- Prefer thin, demoable phases with clear blockers.
- Keep plans local and phase-oriented unless the user explicitly wants GitHub issues instead.
