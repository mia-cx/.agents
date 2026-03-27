---
name: pptx
description: "Creates, reads, edits, and restructures PowerPoint presentations and `.pptx` files. Use when the user mentions slides, decks, presentations, speaker notes, layouts, or any `.pptx` file as input or output, even if the extracted content will be reused elsewhere. Not for Word docs, PDFs, or generic webpage design unless a slide deck is involved."
license: Proprietary. LICENSE.txt has complete terms
---

# PPTX Skill

Treat this file as a router. Choose the workflow first, then load only the files that match the job.

## Workflow

1. Decide what kind of slide work the user needs:
   - read or analyze an existing deck
   - edit an existing deck or template
   - create a new deck from scratch
2. Read only the matching file(s):
   - `editing.md` for template-based edits and XML-level deck changes
   - `pptxgenjs.md` for greenfield deck creation
   - `references/design.md` for layout, palette, typography, QA, and visual review guidance
3. When layout quality matters, convert slides to images and run the QA loop from the design guide.
4. Keep decks visually specific to the content; do not stop at a mechanically correct but bland slide deck.

## Rules

- Always pair implementation work with the design guide when the user cares about slide quality.
- Use the editing guide for existing decks and the pptxgenjs guide for new decks.
- Visually inspect slides before declaring them done.
