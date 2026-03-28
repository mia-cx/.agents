# Roles to SOPs - Shortlist of Drafts/Proposals

Extract reusable SOPs (Standard Operating Procedures) from {{REPO_PATH}} into a neutral, portable draft/proposal shortlist, explaining why this SOP should be written, what should be retained from source, and what should be stripped out (persona, branding, repo-specific name).

## Context

Agent instructions are often framed in a role-responsibility model/manner, but these are very human-first systems. In the era of AI, these systems should be treated as legacy, as much of that procedural overhead can be compressed. The value has shifted from the role theater to the context, rules, checks, escalation, and execution flow.
You can use this lean summary of the transcript of a Theo video about this topic as meta-context for the thesis in this project: `/Users/mia/.agents/.worktrees/role-to-sop/.plans/reference-material/theo-meta-context-v2.md`
If you find reason to go in more depth, you can check the full transcript at `/Users/mia/.agents/.worktrees/role-to-sop/.plans/reference-material/theo-jira-and-linear-are-legacy-software-transcript.md`. If you touch this file, please append a section to `/Users/mia/.agents/.worktrees/role-to-sop/.plans/reference-material/theo-meta-context-v2.md` with the information you needed and found, that wasn't in the summary when you needed it.

## Constraints

You should only work inside `/Users/mia/.agents/.worktrees/role-to-sop/.plans/audits` (with the exception being the earlier rule about `theo-meta-context-v2.md`). Drafting the final set of SOPs and what they should cover is deferred until we've audited all repos.
You should only audit {{REPO_PATH}}, other repos will be handled by future workers.
Cross-repo comparisons are deferred until all other repos have been audited, and reviewed by a Human-in-the-Loop.

## Objective

Produce exactly one markdown normalization / extraction map at:
`/Users/mia/.agents/.worktrees/role-to-sop/.plans/audits/{{REPO_NAME}}/role-to-sop-audit-<PASS>.md`

Your task is complete if and only if all of the following criteria are met:

1. The markdown file exists, and is non-empty.
2. It organizes rules/skills/agents/prompts into SOP candidates and non-candidates, with what they cover and why they are or are not included.
3. It identifies which aspects of each SOP candidate should be ported and which stripped. Persona, branding, and repo-local material should be stripped.
4. It references the source file for each candidate.
5. A verification step confirms the file exists after writing.

### Shape

The markdown file should contain:

- A 1-10 sentence overview of {{REPO_PATH}}: who made it and why it exists.
- A 1-10 sentence summary of what kinds of rules/skills/agents are present.
- A split list of SOPs to port and SOPs to leave out, with a short description of each and the reason for the decision.
- A table for each SOP to port: source file, trigger/when to use, steps or contract, quality bar, escalation path, next action, what to strip, and optional notes.

The output must preserve traceability to source files and clearly state what should be shipped, what should stay local, and what should be rewritten.

Required content, regardless of shape:

1. A summary of the source-to-portable split.
2. A section or table of reusable SOPs, ranked or grouped by portability.
3. A separate section for **cross-cutting protocol primitives** — smaller than full skills — such as user-decision routing, completeness checks, repo ownership, test-failure triage, generated-doc freshness, config discovery, and status/escalation.
4. A concrete recommendation for what should ship by default in `.agents`.
5. An evidence section with specific file/line citations.

## More constraints

Use source repo category names; explain any renaming.
Keep the output focused on portable SOP extraction for coding and business workflows.
Avoid narrow SOPs for Excel, BI, spreadsheets, PDFs, slides, docx/pptx/xlsx, media generation, image/video/social workflows, or similarly narrow tooling — these are too tool-specific to be portable across repos.

## Quality

- prefer operational observations over praise or marketing language
- separate direct repo evidence from interpretation, and interpretation from reusable SOP extraction; make the split explicit
- keep output concise but dense enough to be useful, in the shortest wording that preserves traceability
- include at least 10 concrete evidence bullets or rows, specific enough that a human can trace major claims back to source material
