---
name: issue-triage
description: "Investigates a bug or reported issue, finds the likely root cause in the codebase, and turns that into a GitHub issue with a TDD-oriented fix plan. Use when the user reports a bug, wants an issue filed, or asks to triage and plan a fix before coding. Prefer this over broad architecture review when the task is one concrete problem."
---

# Triage Issue

Treat this file as a router. Read the workflow guide, then move linearly from diagnosis to GitHub issue creation.

## Workflow

1. Read `references/workflow.md` for the full sequence:
   - capture the problem
   - investigate root cause
   - determine the fix approach
   - design a TDD plan
   - create the GitHub issue
2. Keep user questions minimal until the investigation genuinely stalls.
3. Finish by creating the issue instead of stopping at analysis.

## Rules

- Triage is about root cause, not symptom cataloging.
- The deliverable is a useful GitHub issue with a behavioral test plan.
- Keep the plan durable so it survives refactors.
