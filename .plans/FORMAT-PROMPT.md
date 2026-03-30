# Format — Compile Audit Document

Read `.plans/audits/{{REPO_NAME}}/raw-findings.md` and compile it into a structured audit document.

## Context

Agent instructions are often framed as role-and-responsibility theater — human org structures projected onto AI. The value is not in the persona or the role; it lives in the context, rules, checks, escalation paths, and execution flow. Your job is to compile the per-file findings into a structured audit that surfaces what is worth porting as a portable SOP.

Meta-context summary: `.plans/reference-material/theo-meta-context-v2.md`
If you need more depth, read the full transcript at `.plans/reference-material/theo-jira-and-linear-are-legacy-software-transcript.md` and append a brief section to `theo-meta-context-v2.md` with what you needed and found that was missing from the summary.

## Constraints

- Read only `.plans/audits/{{REPO_NAME}}/raw-findings.md` and the meta-context files above.
- Write the final audit document to `.plans/audits/{{REPO_NAME}}/role-to-sop-audit-1.md`.
- Use `raw-findings.md` as your evidence base — it contains all relevant excerpts from the source repo.

## Output shape

Write a single markdown document at `.plans/audits/{{REPO_NAME}}/role-to-sop-audit-1.md` containing:

1. **Repo overview** (1–10 sentences): who made `{{REPO_NAME}}` and why it exists — infer from the findings.
2. **Content summary** (1–10 sentences): what kinds of rules/skills/agents/prompts are present and how they are structured.
3. **SOP split**: two lists — SOPs to port, SOPs to leave out — each with a short description and the reason for the decision.
4. **Per-SOP table** for every portable candidate:

   | Field | Content |
   |---|---|
   | Source file | exact path relative to repo root — must be present for every candidate |
   | Trigger | when to use |
   | Steps/contract | key steps or operative contract |
   | Quality bar | what done looks like |
   | Escalation | what to do when it fails or is ambiguous |
   | Strip | persona, branding, org-local material to remove |
   | Notes | anything else |

   Source file paths must be explicit and complete (e.g. `skills/pr-review/SKILL.md`, not just `pr-review`). These paths are used downstream to locate source files without re-scanning the repo.

5. **Portability ranking**: portable candidates grouped or ranked — high / medium / partial.
6. **Cross-cutting protocol primitives**: patterns smaller than a full skill that appear across multiple files — user-decision routing, completeness checks, test-failure triage, config discovery, status/escalation conventions, etc.
7. **Default recommendation**: what should ship in `.agents` by default, and in what form (skill / rule / subagent prompt).
8. **Structural patterns**: anything interesting about how this repo packages its skills — frontmatter schemas, trigger description conventions, file naming, cross-skill references, YAML vs inline structure. Note anything worth adopting or avoiding in the output repo.
9. **Evidence**: at least 10 specific citations traceable to source files in the raw findings.

## Quality

- Operational observations, not praise or marketing language.
- Separate direct evidence from interpretation; make the split explicit.
- Concise but dense — shortest wording that preserves traceability.
- Every claim in the output should be traceable to a findings block in raw-findings.md.
