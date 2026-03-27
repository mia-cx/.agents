### 3. Spawn Security Reviewer

Spawn the agent with this context:

- The automated scan results from step 1
- The attack surface map from step 2
- The full-audit override instruction (see top of this skill)
- Instruction to produce the full Security Assessment format (Scope, Threat Model, Findings, Dependency Audit, Verdict)

The agent will:
- Map trust boundaries across the whole codebase
- Evaluate against OWASP Top 10
- Classify findings by severity (CRITICAL/HIGH/MEDIUM/LOW)
- Distinguish practical vs theoretical exploitability
- Provide specific remediation for each finding

### 4. Present combined results

Merge the automated scan output with the agent's assessment:

```markdown
## Security Audit: <repo-name>

### Automated Scans
- **Secrets**: [N found / clean]
- **Dependencies**: [N critical, N high, N moderate CVEs — see audit-deps for full treatment]
- **Config**: [notable findings from grep scans]

### Security Reviewer Assessment
<paste agent's full Security Assessment here>

### Action Items

#### Must fix (before next release)
1. [CRITICAL/HIGH findings — one line each with location]

#### Should fix (near term)
1. [MEDIUM findings]

#### Consider (defense in depth)
1. [LOW findings]

### Next Steps
- [ ] Fix critical/high items (create issues or fix directly)
- [ ] Run `audit-deps` skill for full dependency upgrade plan
- [ ] Re-audit after fixes to verify remediation
```

### 5. Create issues for findings (optional)

If the user wants, create a GitHub issue for each CRITICAL or HIGH finding:

```bash
gh issue create \
  --title "security: <short title>" \
  --label "security" \
  --body "<finding details + remediation steps + worktree setup>"
```

Include worktree setup in each issue since security fixes often touch auth/data paths across multiple files.

## When to run this

- Before a public launch or major release
- After adding auth, payments, or user data handling
- Periodically (quarterly) for active projects
- When onboarding a new codebase
- After a dependency with a known CVE is discovered

## Rules

- **Automated scans first, agent second.** Don't waste the agent's context on things grep can find mechanically.
- **Delegate dependency work to `audit-deps`.** This skill focuses on code and config, not package versions.
- **No security theater.** Every recommendation must have a concrete threat it mitigates. "You should add rate limiting" is useless without explaining what attack it prevents in this specific codebase.
- **Evidence-based.** Findings reference specific files and lines. No vague hand-waving.
- **Don't fix — report.** This skill produces the assessment. Fixes happen through separate issues/PRs, ideally via TDD in a worktree.
