---
name: tdd
description: "Implements or fixes software using the red-green-refactor loop with tests written first. Use when the user asks for TDD, test-first development, red-green-refactor, or wants a bug fix or feature built through failing and then passing tests. Not for ad hoc coding when tests are explicitly out of scope."
---

# Test-Driven Development

Treat this file as a router. Read the philosophy guide first if you need to reset the testing mindset, then use the workflow guide for the actual red-green-refactor loop.

## Workflow

1. Read `references/philosophy.md` when you need the principles behind behavioral tests and the warning signs of implementation-coupled testing.
2. Read `references/workflow.md` for the anti-pattern warning, worktree setup, planning, tracer bullet, incremental loop, refactor step, and cycle checklist.
3. Work one behavior at a time until all targeted behavior is covered.

## Rules

- Keep philosophy separate from execution so the main file stays operational.
- Favor vertical slices over test batching.
- Never refactor while red.
