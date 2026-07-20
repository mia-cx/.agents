---
name: audit-security
description: Run a whole-codebase security audit — secrets scanning, trust boundary analysis, OWASP Top 10 evaluation, configuration review, and dependency audit. Use when user wants a security review of the entire project (not just a PR), mentions "security audit", "pen test", "hardening", or "vulnerability scan".
---

# Security Audit

Full-codebase security assessment. Unlike `pr-review` (which scopes the Security Reviewer agent to a single PR diff), this skill points it at the entire repository and supplements with automated scanning.

## Subagent

The heavy lifting is done by the **Security Reviewer** agent at `~/.agents/agents/review-and-qa/security-reviewer.md`. Read it before spawning to confirm its interface.

When spawning for a full audit, **override its scoping rule** — the agent's default is "scope to the change" (PR-mode). Instruct it explicitly:

> "This is a full-codebase security audit, not a PR review. Examine all source files, configuration, and trust boundaries across the entire repository. Do not limit scope to recent changes."

## Workflow

### 1. Automated scanning

Run these before spawning the subagent — feed the results in as context so it doesn't duplicate mechanical work.

**Secrets scan:**

```bash
# Check for common secret patterns in tracked files
git ls-files | xargs grep -rlnE \
  '(AKIA[0-9A-Z]{16}|ghp_[a-zA-Z0-9]{36}|sk-[a-zA-Z0-9]{48}|-----BEGIN (RSA |EC )?PRIVATE KEY-----|xox[bpoas]-[a-zA-Z0-9-]+)' \
  2>/dev/null || echo "No obvious secrets found"

# Check for .env files committed to git
git ls-files | grep -iE '\.env($|\.)' | grep -v '\.example' || echo "No .env files in git"

# Check gitignore covers secrets
grep -qE '\.env' .gitignore 2>/dev/null && echo ".env in gitignore ✅" || echo "⚠️  .env not in .gitignore"
```

**Configuration review:**

```bash
# CORS configuration
grep -rnE 'cors|Access-Control-Allow' --include='*.ts' --include='*.js' --include='*.json' --include='*.toml' . 2>/dev/null | head -20

# Auth/session config
grep -rnE 'cookie|session|jwt|bearer|auth' --include='*.ts' --include='*.js' --include='*.svelte' . 2>/dev/null | head -30

# CSP / security headers
grep -rnE 'Content-Security-Policy|X-Frame-Options|Strict-Transport' --include='*.ts' --include='*.js' --include='*.toml' --include='*.json' . 2>/dev/null | head -10

# Debug/dev modes exposed
grep -rnE 'debug.*true|DEBUG|NODE_ENV.*development|verbose.*true' --include='*.ts' --include='*.js' --include='*.json' --include='*.toml' . 2>/dev/null | grep -v node_modules | grep -v test | head -10
```

**Dependency audit** (delegate to the `audit-deps` skill for full treatment, but grab the summary):

```bash
pnpm audit --json 2>/dev/null | head -50 || pnpm audit 2>/dev/null | head -30
```

### 2. Map the attack surface

Before spawning the subagent, build a quick map of what's in the repo:

```bash
# Entry points (HTTP handlers, API routes, CLI args)
find src -name '+server.ts' -o -name '+server.js' -o -name 'api' -type d 2>/dev/null
find src -name '*.ts' | xargs grep -lE 'app\.(get|post|put|delete|patch|use)\(' 2>/dev/null

# User input handling
grep -rnlE 'request\.(body|params|query|headers|cookies)|FormData|URLSearchParams|event\.request' --include='*.ts' --include='*.svelte' src/ 2>/dev/null

# Database/storage interactions
grep -rnlE 'query\(|\.execute\(|\.prepare\(|\.run\(|D1|KV|R2|Durable' --include='*.ts' --include='*.js' src/ 2>/dev/null

# External API calls
grep -rnlE 'fetch\(|axios|got\(|https\.request' --include='*.ts' --include='*.js' src/ 2>/dev/null
```

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
