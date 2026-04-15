---
description: Write-back gate — three-question check before persisting any artifact. Apply whenever deciding whether to write a note, fact, rule, or doc to a permanent file.
alwaysApply: false
---

# Write-back gate

Write back only when the information is both stable and reusable.

Before committing anything to a permanent file, answer all three questions:

1. **Will this still matter later?**
2. **Can this be reused later?**
3. **Does it have a clear destination file?**

If the answer to any of the three is not clearly yes, do not write it back.

## Write back when

- project scope or boundaries became clearer and the clarity will outlast this task
- a validation reference or decision pattern became stable enough to reuse
- a workflow rule has repeated enough to be worth naming
- a repeated procedure should become or update a skill

## Write back to the right layer

| Content type | Destination |
|---|---|
| Stable reusable project context | `<project>/facts/*` or equivalent facts layer |
| Repeatable procedures | `<project>/skills/*` or equivalent skills layer |
| Repository-wide operating guidance | Top-level `AGENTS.md` or equivalent rules file |
| Task-local delivery notes | Change summary — not a permanent file |

When adding, removing, or renaming fact files, update the facts index.
When adding, removing, or renaming skill files, update the skill registry.

## Routing labels (hints, not a filing system)

Use labels such as `facts_update`, `skill_promotion`, `decision_rationale`, `phase_lesson`, `task_pattern`, and `anti_pattern` only as routing hints to identify the right destination.
Do not let the label taxonomy become a new archive of task history.

## Do not write back

- temporary debugging notes or exploration chatter
- unstable ideas that have not stabilized across tasks
- one-off implementation details specific to a single task
- reasoning that has no future reuse value

## Why this rule exists

Facts layers and rule libraries bloat when every decision gets persisted. The three-question gate keeps permanent storage to stable, reusable content and prevents documentation debt from accumulating across tasks.

Facts are stable context, not a conversation archive.
