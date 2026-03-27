---
name: design-interface
description: "Generates multiple sharply different interface or API designs for the same module so the user can compare tradeoffs before implementation. Use when the user wants to design an API, compare shapes, explore alternatives, or explicitly says to design it twice. Prefer this before coding when solution-space exploration matters more than immediate implementation."
---

# Design an Interface

Treat this file as a router. Use the workflow guide to generate contrasting designs, then load evaluation guidance when comparing them.

## Workflow

1. Read `references/workflow.md` for requirement gathering, parallel design generation, presentation, comparison, and synthesis.
2. Read `references/evaluation.md` when you need the deeper criteria from *A Philosophy of Software Design*.
3. Keep the work focused on interface shape and tradeoffs, not implementation.

## Rules

- Force genuine design diversity before comparing options.
- Use evaluation criteria to explain tradeoffs, not to crown a winner prematurely.
- Stop at the design boundary unless the user explicitly moves to implementation.
