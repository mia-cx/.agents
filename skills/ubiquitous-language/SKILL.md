---
name: ubiquitous-language
description: "Extracts a DDD-style ubiquitous language glossary from the conversation, flags ambiguous terms, and writes canonical terminology to `UBIQUITOUS_LANGUAGE.md`. Use when the user wants a domain glossary, shared vocabulary, DDD language, or help reconciling inconsistent terms across a project. Not for full PRDs or architecture plans."
---

# Ubiquitous Language

Treat this file as a router. Read the workflow guide to extract and normalize terms, then load the format/rules guide when writing or updating the glossary file.

## Workflow

1. Read `references/workflow.md` for conversation scanning, ambiguity detection, glossary proposal, re-run behavior, and final user-facing output.
2. Read `references/output-format-and-rules.md` when writing `UBIQUITOUS_LANGUAGE.md` so the glossary structure and naming rules stay consistent.
3. Rewrite the file rather than incrementally patching terminology drift.

## Rules

- Be opinionated about canonical terms.
- Keep the main file focused on the extraction loop, not the full markdown template.
- Use the glossary to stabilize language going forward.
