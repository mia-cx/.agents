---
name: test-webapp
description: "Tests local web applications with Playwright, including browser interaction, screenshots, console inspection, and debugging of frontend behavior. Use when the user wants to verify a local site, reproduce UI bugs, exercise browser flows, or inspect page behavior in a running webapp. Not for static design work or non-browser server testing."
license: Complete terms in LICENSE.txt
---

# Web Application Testing

Treat this file as a router. Decide whether the task is static HTML, a local app needing server orchestration, or an already-running app, then load only the matching guidance.

## Workflow

1. Read `references/workflow.md` for the decision tree, `with_server.py` usage, reconnaissance-then-action pattern, and Playwright setup examples.
2. Read `references/best-practices.md` for pitfalls, operating rules, and example-file pointers.
3. Treat `scripts/with_server.py` as a black box unless you have already tried `--help` and still need custom behavior.

## Rules

- Keep helper scripts out of context unless customization is unavoidable.
- Wait for rendered state before inspecting dynamic apps.
- Use examples as pattern references, not as mandatory templates.
