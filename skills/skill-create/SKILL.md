---
name: skill-create
description: "Creates new skills and improves existing ones through drafting, trigger design, evaluation, and iterative refinement. Use when the user wants to make a skill, edit a skill, benchmark a skill, or optimize a skill’s description for better activation. Prefer this over generic prompt editing when the deliverable is a reusable skill package or SKILL.md."
---

# Skill Creator

Treat this file as a router. Figure out what phase the user is in, then load only the guidance for that phase.

## Workflow

1. Identify the job:
   - create a new skill
   - improve an existing skill
   - run benchmarks / human review loops
   - optimize the description for better triggering
2. Read only the matching guide:
   - `references/creation-guide.md` for interviewing, drafting, and skill-structure decisions
   - `references/evaluation-loop.md` for test execution, grading, reviewer generation, and iteration
   - `references/description-optimization.md` for trigger evals and description tuning
   - `references/platform-notes.md` for Claude.ai / Cowork differences
3. When the workflow needs specialist review, read the matching agent instructions:
   - `agents/grader.md`
   - `agents/comparator.md`
   - `agents/analyzer.md`
4. Use `references/schemas.md` whenever you need the exact JSON formats.

## Rules

- Keep the user-facing process staged: draft → test → review → improve.
- Match your jargon to the user’s familiarity level.
- Do not skip the review loop for benchmark-driven skill work.
