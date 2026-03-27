---
name: pdf
description: "Handles PDF workflows including reading, OCR, merging, splitting, rotating, watermarking, form filling, and extracting text or images. Use whenever a `.pdf` file is the input or output, or when the user wants a PDF deliverable. Not for Word documents, spreadsheets, or slide decks unless a PDF is explicitly part of the task."
license: Proprietary. LICENSE.txt has complete terms
---

# PDF Processing Guide

Treat this file as a router. Decide whether the task is a general PDF operation, a form-filling workflow, or an advanced/troubleshooting case, then read only the matching reference.

## Workflow

1. Classify the task:
   - general PDF operations such as read, OCR, merge, split, rotate, watermark, extract text/images, or create a PDF
   - PDF form filling or field inspection
   - advanced library choices or troubleshooting
2. Read only what matches:
   - `references/operations.md` for the core PDF workflows and common commands
   - `forms.md` for fillable-form work
   - `reference.md` for advanced features, JavaScript options, and troubleshooting
3. Use the included scripts for form inspection and validation when the task touches forms.
4. Verify the final PDF output, especially after OCR, merging, or form filling.

## Rules

- Prefer the narrowest guide that fits the task.
- Do not load form guidance for ordinary PDF extraction/merge work.
- Check rendered output, not just file creation, when appearance matters.
