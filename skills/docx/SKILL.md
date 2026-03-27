---
name: docx
description: "Creates, reads, edits, and restructures Microsoft Word documents, including professional deliverables that need Word-specific formatting. Use when the user mentions `.docx`, Word docs, memos, letters, reports, templates, tracked changes, comments, page numbers, TOCs, or replacing content inside a Word file. Not for PDFs, slide decks, spreadsheets, or Google Docs-only workflows."
license: Proprietary. LICENSE.txt has complete terms
---

# DOCX creation, editing, and analysis

Treat this file as a router. Start by deciding whether the task is **reading**, **creating**, or **editing** a Word document, then load only the matching guide.

## Workflow

1. Confirm the job:
   - analyze or extract from an existing `.docx`
   - create a new `.docx`
   - edit an existing `.docx`, especially tracked changes, comments, or XML-level structure
2. Read only the guide you need:
   - `references/quick-reference.md` for conversion, extraction, rendering, and accept-changes flows
   - `references/create-docx.md` for generating new documents with `docx`
   - `references/edit-docx.md` for unpack/edit/repack workflows, tracked changes, comments, and XML rules
3. Use the bundled scripts when the selected guide points to them.
4. Validate the final document and inspect rendered output when layout or comments matter.

## Rules

- Keep the main task narrow: do not load XML mechanics unless you are editing an existing document.
- Prefer the creation guide for greenfield files and the editing guide for in-place revisions.
- Validate every delivered `.docx` before declaring success.
