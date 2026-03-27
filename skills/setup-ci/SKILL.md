---
name: setup-ci
description: "Sets up GitHub Actions CI/CD workflows for linting, testing, builds, and optionally deployment. Use when the user wants CI, GitHub Actions automation, PR checks, deployment pipelines, or Cloudflare Pages release flows. Not for local pre-commit hooks or versioning-only changes."
---

# Setup CI/CD

Treat this file as a router. First determine the repo shape, then load only the workflow guidance needed to scaffold CI/CD.

## Workflow

1. Read `references/workflow.md` for repo inspection, workflow generation, secret requirements, and commit guidance.
2. Read `references/caching.md` when you need the pnpm caching rationale or exact cache strategy details.
3. Adapt generated workflows to the project’s actual scripts, runtime, deployment target, and build output path.

## Rules

- Keep the main SKILL focused on routing and project-shape decisions.
- Do not cargo-cult workflow steps: match actual scripts and deployment targets.
- Only load caching theory when you need to justify or tweak the cache implementation.
