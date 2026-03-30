# Compare Format — Compile Cross-Repo Shortlist

Read `.plans/audits/raw-comparison.md` and compile it into the final cross-repo shortlist.

## Context

Agent instructions are often framed as role-and-responsibility theater — human org structures projected onto AI. The value is not in the persona or the role; it lives in the context, rules, checks, escalation paths, and execution flow. Your job is to compile the per-SOP comparison findings into a structured shortlist that surfaces the strongest portable version of each procedure.

Meta-context summary: `.plans/reference-material/theo-meta-context-v2.md`
If you need more depth, read the full transcript at `.plans/reference-material/theo-jira-and-linear-are-legacy-software-transcript.md` and append a brief section to `theo-meta-context-v2.md` with what you needed and found that was missing from the summary.

## Constraints

- Use `raw-comparison.md` as your evidence base — every claim in the output must be traceable to a findings block in that file.
- Write the final document to `.plans/audits/cross-repo-shortlist.md`.

## Output shape

Write a single markdown document at `.plans/audits/cross-repo-shortlist.md` containing:

1. **Summary** (1–10 sentences): what SOP categories emerged across the corpus, any surprising gaps or overlaps, and the overall signal-to-noise ratio across repos.

2. **Ranked shortlist**: for each SOP, ordered by portability and durability:

   | Field | Content |
   |---|---|
   | Canonical name | proposed output filename used in synthesis |
   | Repos | which repos contain it and how consistently |
   | Strongest source | repo + file path |
   | Why strongest | what makes it most portable and operationally complete |
   | Output form | skill / rule / subagent prompt |
   | Port | operative steps, contract, quality bar, escalation path |
   | Strip | persona, branding, org-local names, tool-specific details |
   | Source citations | at least 3 specific file/line references |

3. **Cross-cutting protocol primitives**: reusable fragments smaller than a full SOP — decision routing patterns, completeness checks, escalation conventions, config discovery patterns, etc. Each with source citations.

4. **Structural patterns**: cross-repo observations on how skills are packaged — frontmatter schemas, trigger description conventions, file naming, cross-skill references. Note the strongest patterns worth adopting in the output repo.
5. **Role-theater overhead**: brief notes on how much persona/role wrapping each repo uses and what it obscures.

## Quality

- Operational observations, not praise or marketing language.
- Separate what the data shows from interpretation; make the split explicit.
- Rank by portability and durability — not by repo size or popularity.
- Every claim traceable to a findings block in `raw-comparison.md`.
