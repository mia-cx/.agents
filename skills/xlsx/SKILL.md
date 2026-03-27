---
name: xlsx
description: "Creates, reads, cleans, and edits spreadsheet files such as `.xlsx`, `.xlsm`, `.csv`, and `.tsv`. Use when a spreadsheet is the primary input or output, including cleanup, formulas, formatting, charting, conversions, or restructuring messy tabular data into a proper sheet. Not for Word docs, slide decks, HTML reports, or database pipelines unless the deliverable is a spreadsheet file."
license: Proprietary. LICENSE.txt has complete terms
---

# XLSX creation, editing, and analysis

Treat this file as a router. Decide whether you are applying spreadsheet standards, doing data/file manipulation, or debugging formulas, then read only the relevant guide.

## Workflow

1. Confirm the spreadsheet task:
   - create or edit a workbook
   - analyze or clean tabular data
   - build formulas / financial modeling logic
   - verify and recalculate formulas
2. Read only what matches:
   - `references/requirements.md` for output standards, financial-model conventions, and formatting rules
   - `references/workflows.md` for pandas/openpyxl workflows, formula guidance, recalculation, and verification
3. Use formulas instead of hardcoded calculated values whenever the spreadsheet should stay live.
4. If formulas are present, run `scripts/recalc.py`, inspect the reported errors, and fix them before delivery.

## Rules

- Respect the existing workbook’s conventions when editing a template.
- Treat formula verification as mandatory, not optional.
- Load the requirements guide for finance-heavy work or whenever presentation quality matters.
