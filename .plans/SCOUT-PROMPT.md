# Scout — File Inventory

Scan `{{REPO_PATH}}` and identify files that encode agent behaviour: rules, skills, agents, prompts, SOPs, and behaviour-shaping config.

## Context

Agent instructions are often framed as role-and-responsibility theater — human org structures projected onto AI. The value is not in the persona or the role; it lives in the context, rules, checks, escalation paths, and execution flow. Your job is to identify the files that encode that procedural core, so they can be assessed as portable SOP candidates.

Meta-context summary: `.plans/reference-material/theo-meta-context-v2.md`
If you need more depth, read the full transcript at `.plans/reference-material/theo-jira-and-linear-are-legacy-software-transcript.md` and append a brief section to `theo-meta-context-v2.md` with what you needed and found that was missing from the summary.

## What to include

Files that directly instruct an agent or define a procedure — rules, skills, agent definitions, prompt templates, SOPs, behaviour config.

## What to skip

READMEs, lock files, images, binaries, test fixtures, changelogs, licence files, and any file that does not directly instruct an agent or define a procedure.

## Output

For each relevant file write one line:

```
<relative-path> | <type> | <one sentence: what procedure or rule it encodes>
```

Types: `rule` / `skill` / `agent` / `prompt` / `sop` / `config`

Write the list to `/Users/mia/.agents/.worktrees/role-to-sop/.plans/audits/{{REPO_NAME}}/file-inventory.md`. Read only files within `{{REPO_PATH}}`.
