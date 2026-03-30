# Compare — Per-SOP Cross-Repo Analysis

Investigate `{{SOP_NAME}}` across all repos that contain it and identify the strongest portable version.

## Context

Agent instructions are often framed as role-and-responsibility theater — human org structures projected onto AI. The value is not in the persona or the role; it lives in the context, rules, checks, escalation paths, and execution flow. Your job is to read the actual source files across repos, find the strongest parts of each implementation, and surface what should be ported.

Meta-context summary: `.plans/reference-material/theo-meta-context-v2.md`
If you need more depth, read the full transcript at `.plans/reference-material/theo-jira-and-linear-are-legacy-software-transcript.md` and append a brief section to `theo-meta-context-v2.md` with what you needed and found that was missing from the summary.

## Constraints

- Start from `sop-inventory.md` (`.plans/audits/sop-inventory.md`) as your primary input — it contains pre-consolidated findings and source file paths for `{{SOP_NAME}}` across all repos. Read source files directly from `.references/` to verify or supplement where the consolidated findings need more depth.
- Use `.plans/approved/audits/` to find which repos contain this SOP and where the source files are.
- Bash-append your findings block to `/Users/mia/.agents/.worktrees/role-to-sop/.plans/audits/raw-comparison.md` using a bash heredoc (absolute path required). Use bash append to avoid race conditions with parallel agents:

```bash
cat >> .plans/audits/raw-comparison.md << 'EOF'
<your findings block here>
EOF
```

- Focus on coding and business workflows. Skip narrow tool-specific procedures.

## Investigation

For each repo that contains `{{SOP_NAME}}`:

1. Find the source file(s) via the approved audit
2. Read the actual implementation directly from `.references/<repo>/...`
3. Note what it does well — specific steps, quality bars, escalation paths, trigger conditions
4. Note what is repo-local overhead — persona names, org branding, tool-specific details, unnecessary ceremony

Then assess across all sources: which parts are strongest and why.

## Findings block

```
## {{SOP_NAME}}

**Sources**:
| Repo | File | Portable | Strongest aspect |
|------|------|----------|-----------------|
| <repo> | <path> | yes/partial/no | <what this version does best> |

**Recommended canonical form**: <skill | rule | subagent prompt>

**Trigger**: <when to use — synthesised across strongest sources>

**Steps/contract**: <the operative core — quote the strongest version verbatim where possible, note any meaningful differences across sources>

**Quality bar**: <what done looks like — best version across sources>

**Escalation**: <what to do when it fails or is ambiguous>

**Strip**: <persona, branding, org-local names, tool-specific details>

**Cross-cutting primitives**: <any reusable fragments smaller than the full SOP>

**Evidence**: <at least 3 specific file/line citations from the source repos>
```
