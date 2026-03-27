---
name: codebase-architecture
description: "Analyzes a codebase for architectural improvements that deepen modules, reduce coupling, and make the system more testable and AI-navigable. Use when the user asks for architecture review, refactor opportunities, module boundaries, consolidation plans, or ways to make a codebase easier to change. Prefer this over issue triage when the goal is structural improvement rather than fixing one bug."
---

# Improve Codebase Architecture

Treat this file as a router. Read the workflow guide, then use `REFERENCE.md` only when you need the dependency categories or RFC template details.

## Workflow

1. Read `references/workflow.md` for the exploration, candidate framing, interface-design, and issue-creation loop.
2. Read `REFERENCE.md` when you need:
   - dependency-category definitions
   - the refactor RFC template
   - any deeper supporting taxonomy used by the workflow
3. Keep the work centered on module depth, testability, and navigability.

## Rules

- Let exploration friction guide the architecture candidates.
- Keep the main file small; detailed taxonomies belong in the reference file.
- Stop at the RFC boundary unless the user asks to implement the refactor.
