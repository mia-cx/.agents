# Audit — Single File Assessment

Assess `{{FILE_PATH}}` as a portable SOP candidate.

## Context

Agent instructions are often framed as role-and-responsibility theater — human org structures projected onto AI. The value is not in the persona or the role; it lives in the context, rules, checks, escalation paths, and execution flow. Your job is to extract the durable procedural core and identify what is portable versus what is org/tool/persona-specific overhead.

Meta-context summary: `.plans/reference-material/theo-meta-context-v2.md`
If you need more depth, read the full transcript at `.plans/reference-material/theo-jira-and-linear-are-legacy-software-transcript.md` and append a brief section to `theo-meta-context-v2.md` with what you needed and found that was missing from the summary.

## Constraints

- Read only `{{FILE_PATH}}`.
- Append your findings to `/Users/mia/.agents/.worktrees/role-to-sop/.plans/audits/{{REPO_NAME}}/raw-findings.md` using a bash heredoc append (absolute path — required since cwd is scoped to the source repo). Use bash append to avoid race conditions with parallel agents:

```bash
cat >> /Users/mia/.agents/.worktrees/role-to-sop/.plans/audits/{{REPO_NAME}}/raw-findings.md << 'EOF'
<your findings block here>
EOF
```

- Focus on coding and business workflows. Skip narrow tool-specific content (spreadsheets, PDFs, slides, media generation, image/video/social).

## Assessment

Produce a findings block with these fields:

```
## {{FILE_PATH}}
**Type**: <rule | skill | agent | prompt | sop | config>
**Portable**: <yes | no | partial>
**Reason**: <one sentence — why portable or not>
**Trigger**: <when would someone use this procedure>
**Steps/contract**: <verbatim key steps or the operative contract — quote directly where possible>
**Strip**: <what to remove: persona names, org branding, tool-specific details, repo-local paths>
**Structure/format**: <anything interesting about how this file is packaged — frontmatter fields, trigger description conventions, file naming, how it references other skills, YAML vs inline, etc.>
**Notes**: <anything else relevant to porting>
```

If the file is not a portable candidate, still write the block with `Portable: no` and a reason. Traceability matters.
