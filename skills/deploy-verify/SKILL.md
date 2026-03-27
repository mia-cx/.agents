---
name: deploy-verify
description: "Verifies a deployed app by checking HTTP responses, rendered content, screenshots, and obvious runtime errors. Use after a deploy, release, or production change when the user wants a smoke test, deployment check, or confirmation that a site is healthy. Not for local feature testing before deployment."
---

# Verify Deploy

Treat this file as a router. Start with the smoke-test workflow, then load CI notes only if the user wants deploy verification automated.

## Workflow

1. Read `references/smoke-test-workflow.md` for:
   - finding the deployment URL
   - selecting routes
   - writing/running the Playwright smoke test
   - presenting screenshots and verdicts
   - deeper manual checks
2. Read `references/ci-and-rules.md` only when the user wants post-deploy automation or you need the operational guardrails.
3. Keep the scope read-only unless the user explicitly asks for deeper interactive testing.

## Rules

- This skill is for live deployments, not local app testing.
- Treat screenshots as part of the evidence, not an optional extra.
- Load CI integration guidance only when automation is part of the task.
