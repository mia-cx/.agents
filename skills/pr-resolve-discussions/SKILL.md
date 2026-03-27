---
name: pr-resolve-discussions
description: "Resolves unresolved GitHub PR review discussions by validating the findings and implementing durable fixes for the real issues. Use when a PR is blocked on review threads, the user wants to address PR feedback, or asks to resolve discussions before merge. Prefer this over PR review when the feedback already exists and needs to be worked through."
---

# Resolve PR Discussions

Treat this file as a router. Keep the main file focused on the resolution loop, then load philosophy and detailed mechanics only when needed.

## Workflow

1. Read `references/workflow.md` for the operational sequence:
   - gather unresolved threads
   - classify each finding
   - investigate root causes
   - implement fixes
   - reply, resolve, commit, and summarize
2. Read `references/philosophy.md` when you need the deeper standard for what counts as an architectural fix.
3. Read `references/garbage-elimination-principles.md` while implementing fixes so you remove systemic slop instead of patching symptoms.

## Rules

- Resolve review threads by fixing the underlying problem class, not just the quoted line.
- Keep reply mechanics and coding principles out of the main router unless they are actively needed.
- Treat false positives as something to prove with evidence, not instinct.
