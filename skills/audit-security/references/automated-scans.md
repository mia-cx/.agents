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
