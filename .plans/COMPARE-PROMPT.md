# Roles to SOPs - Cross-Repo Comparison

Compare the human-approved audit shortlists in `.plans/approved/audits/` against each other to identify the strongest, most portable SOP candidates for `.agents`.

## Context

You are running as a subagent inside [pi-messenger](https://github.com/nicobailon/pi-messenger), a multi-agent coordination extension for the pi coding agent. You have access to shared channels where other subagents working on this same comparison task are posting their observations. Join the mesh on startup, post your findings to the shared channel(s) as you work, and read what other subagents have posted before drawing conclusions — their observations may surface patterns you haven't seen yet.

The orchestrator will tell you which channels exist and which you have access to when it spawns you.

Each audit file in `.plans/approved/audits/` is a human-reviewed shortlist of SOP candidates from one reference repo. Your job is not to re-audit — the per-repo work is done. Your job is to compare across repos: find the procedure categories that recur, identify which repo has the strongest encoding of each, and produce a ranked cross-repo shortlist.

The thesis: agent instructions are over-indexed on role-theater. The value is in context, rules, checks, escalation, and execution flow — not the persona wrapped around them. Use this as a lens when evaluating which version of a procedure is strongest.

## Constraints

Work only inside `/Users/mia/.agents/.worktrees/role-to-sop`.
Start from `.plans/approved/audits/` as the index of what's worth comparing, but read directly from the reference repos in `.references/` when you need to compare the actual implementation of a skill, rule, or prompt between sources.
Cross-cutting primitives (small reusable fragments, not full SOPs) get their own section.

## Objective

Produce exactly one markdown file at:
`.plans/audits/cross-repo-shortlist.md`

Your task is complete if and only if:

1. The file exists and is non-empty.
2. It identifies procedure categories that emerge across repos (bottom-up from the data, not a fixed list).
3. For each category, it names which repo has the strongest encoding and why.
4. It contains a ranked shortlist of SOP candidates with the shape defined below.
5. It has a separate section for cross-cutting protocol primitives.
6. A verification step confirms the file exists after writing.

### Shape

The output file should contain:

- A brief summary of what procedure categories emerged across the corpus and any surprising gaps or overlaps.
- A ranked shortlist of SOP candidates. For each:
  - proposed canonical name (used as the output filename in synthesis)
  - which repos contain it and how consistently it is encoded
  - which repo has the strongest version and what makes it strongest (prototype-first procedures that front-load investigation over planning ceremony are a positive signal)
  - whether it belongs as a skill, rule, or subagent prompt
  - what to port and what to strip (persona, branding, repo-local material)
  - source file citations from the strongest repo
- A separate section for **cross-cutting protocol primitives** — reusable fragments smaller than a full SOP (e.g. user-decision routing, completeness checks, escalation paths, repo ownership checks).
- A section on persona/role-theater overhead: how much each repo uses, and at what cost.

## Quality

- Prefer operational observations over praise or marketing language
- Separate what the data shows from your interpretation
- Rank by portability and durability, not by repo popularity or size
- Include at least 10 concrete evidence bullets or rows traceable to source audit files
- Keep output concise but dense enough to be useful
