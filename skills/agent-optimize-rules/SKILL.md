---
name: agent-optimize-rules
description: "Tightens rules, skills, and subagents by removing noise, preserving tribal knowledge, and rewriting vague guidance into specific, actionable instructions. Use when the user wants to improve prompts, agent rules, skill docs, trigger descriptions, or other agent-facing instructions. Prefer this over generic editing when the goal is better activation, less overlap, or cleaner operational guidance."
---

# Optimize Agent Rules (Rules, Skills, Subagents)

Treat this file as a router. Identify whether you are auditing rules, skills, or subagents, then load only the matching reference material.

## Workflow

1. Read the target rule, skill, or subagent.
2. Load the narrowest supporting guide you need:
   - `references/checklists.md` for the audit checklist by artifact type
   - `references/refactoring-patterns.md` for the rewrite patterns (vague→specific, negative→positive, imprecise→precise)
   - `references/examples.md` for before/after examples and cleanup models
3. Apply the workflow:
   - remove inferrable content
   - keep tribal knowledge
   - tighten wording and scope
4. Rewrite the artifact so it is shorter, sharper, and more operational.

## Rules

- Prefer deleting noise over polishing noise.
- Keep the main file focused on the audit loop, not the full pattern catalog.
- Use examples only when they help you choose a rewrite strategy.
