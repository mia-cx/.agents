---
description: Skill promotion rule — criteria for when a workflow earns its own skill file and when it should not. Apply when deciding whether to extract a repeated procedure into a reusable skill.
alwaysApply: false
---

# Skill promotion rule

A skill is a reusable workflow, not just a useful prompt.

## Promote a workflow into a skill when ALL of these are true

- **It repeats across tasks** — the procedure has come up in more than one distinct context
- **Its inputs and outputs are recognizable** — you can describe what goes in and what comes out in concrete terms
- **Its value is not tied to a single one-off task** — the workflow would be useful even if that original task never existed
- **It reduces repeated reasoning effort** — without the skill, you would re-derive the same steps each time
- **It can be described clearly enough to reuse** — someone (or another agent) could follow it without reading the original task context

When all five hold, the workflow has earned its own skill file.

## Do not create a skill when

- the idea is still unstable or unproven across tasks
- the procedure is tied to one narrow task only
- the content is better expressed as a task spec or change summary
- the workflow is too vague to follow without re-inventing it each time
- a new skill file would duplicate an existing one

## Registry discipline

When adding, removing, or renaming a skill, update the skill registry immediately.
Do not let the registry fall out of sync with the skill files.

## Why this rule exists

Premature skill extraction creates a library of orphaned procedures that are never actually reused. The five-criteria gate keeps the skill set lean and operational by ensuring every skill earns its place through demonstrated repetition and recognizable reuse value.

Do not create a new skill for every useful prompt.
