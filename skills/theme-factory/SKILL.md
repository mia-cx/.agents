---
name: theme-factory
description: "Applies a curated visual theme to decks, docs, landing pages, and other artifacts using preset palettes and font pairings. Use when the user wants to choose from existing themes or quickly style an artifact without inventing a bespoke brand system from scratch. Prefer this over brand-guidelines when the goal is general theming rather than Anthropic branding."
license: Complete terms in LICENSE.txt
---

# Theme Factory Skill

Treat this file as a router. Use the workflow guide to select or create a theme, then load the chosen theme file from `themes/` when applying it.

## Workflow

1. Read `references/workflow.md` for showcase, theme selection, custom-theme fallback, and application steps.
2. Show `theme-showcase.pdf` when the user needs to choose among the preset themes.
3. Once a theme is chosen, read the corresponding file in `themes/` and apply it consistently.

## Rules

- Keep the main file focused on selection flow, not theme catalog detail.
- Prefer existing curated themes before inventing a new one.
- Apply the chosen theme consistently across the artifact.
