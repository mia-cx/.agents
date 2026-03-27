---
name: web-app-builder
description: "Builds multi-page web applications using the SvelteKit, Tailwind, and shadcn-svelte stack with routing, state, and production-oriented structure. Use when the user wants a real web app, dashboard, marketing site, admin UI, or routed frontend rather than a one-off HTML snippet. Not for simple single-file mockups or framework-agnostic UI exploration."
license: Complete terms in LICENSE.txt
---

# Web Artifacts Builder

Treat this file as a router. Use the setup guide to scaffold and run the stack, then load the design/component guide when building the actual interface.

## Workflow

1. Read `references/stack-and-setup.md` for the stack, quick-start commands, deploy flow, and infrastructure notes.
2. Read `references/design-and-components.md` for:
   - design/style guidance
   - shadcn-svelte usage
   - radix-svelte notes
   - dark mode
   - routing and optional testing guidance
3. Use `scripts/` for project bootstrap/build, but keep interface-building decisions grounded in the design guide.

## Rules

- Separate infrastructure setup from UI/design guidance in context.
- Prefer styled shadcn-svelte components unless you specifically need a lower-level primitive.
- Keep the app visually intentional; do not settle for framework-default aesthetics.
