---
name: git-guardrails
description: "Installs Claude Code hooks that block destructive git commands before they run. Use when the user wants guardrails against `push`, `reset --hard`, `clean`, branch deletion, or similar risky operations in Claude Code. Not for general git workflow advice or repo policy docs."
---

# Setup Git Guardrails

Treat this file as a router. Read the setup guide, then use the bundled script directly when installing and customizing the hook.

## Workflow

1. Read `references/setup.md` for scope selection, script installation, settings updates, customization, and verification.
2. Use `scripts/block-dangerous-git.sh` as the implementation artifact; do not retype or reinvent it.
3. Verify the hook after installation.

## Rules

- Keep the main file focused on routing and intent, not the full install walkthrough.
- Merge hook config into existing Claude settings instead of overwriting them.
- Validate the block behavior before declaring success.
