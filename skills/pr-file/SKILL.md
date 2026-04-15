---
name: pr-file
description: >-
  File a pull request on GitHub with a structured body, linked issues, and
  acceptance criteria. Use when the user says "file a PR", "open a PR",
  "create a PR", or wants to submit a feature branch for review.
---

# File a Pull Request

Create a well-structured GitHub PR from the current feature branch. Gather
context from the branch, commits, linked issues, and plan files, then file
the PR with a single `gh pr create` call.

## Workflow

### 1. Check for repo conventions

Before building the PR, look for local guidelines that override or extend
this skill's defaults:

```bash
# PR template — if present, use it as the body skeleton instead of the default template
cat .github/PULL_REQUEST_TEMPLATE.md 2>/dev/null \
  || cat .github/pull_request_template.md 2>/dev/null \
  || cat docs/pull_request_template.md 2>/dev/null \
  || cat PULL_REQUEST_TEMPLATE.md 2>/dev/null

# Contributing guide — scan for PR-specific rules
cat CONTRIBUTING.md 2>/dev/null | head -200
```

If a **PR template** exists, use it as the body structure. Fill in each
section from the gathered context. Only fall back to the default template
below when no repo template is found.

If a **CONTRIBUTING.md** exists, scan it for:
- Required PR body sections (e.g. "How Has This Been Tested?")
- Commit message or title conventions that differ from conventional commits
- Branch naming rules
- Checklist items the project expects (e.g. "I have run `npm run lint`")
- Any explicit "do not" rules (e.g. "do not target `master`")

Incorporate any project-specific requirements into the PR body and title.
When the repo's conventions conflict with this skill's defaults, **the repo
wins**.

### 2. Determine the branch and base

```bash
git rev-parse --abbrev-ref HEAD   # feature branch
gh repo view --json defaultBranchRef --jq '.defaultBranchRef.name'  # base (usually main)
```

If the branch isn't pushed yet, push it first:
```bash
git push -u origin <branch>
```

### 3. Gather context

- **Commits**: `git log --oneline main..<branch>` — understand what changed.
- **Linked issue**: Scan commit messages and any local plan file for `#N` references. Run `gh issue view <N> --json title,body` for the linked issue.
- **Plan file**: If a `.plans/<N>-<slug>.md` exists for the linked issue, read the acceptance criteria from it.
- **Diff stats**: `git diff --stat main..<branch>` — summarize files changed.

### 4. Build the PR body

Use the repo's PR template if one was found in step 1. Otherwise, use
this default template:

```markdown
## Closes #<N>

<1-2 sentence summary of what this PR delivers.>

### What's in this PR

<Concise description of the implementation. Use bullet points, tables, or
short paragraphs — whatever fits the change. Cover:>
- What was built
- Key design decisions
- Notable APIs or types introduced

### Tests

<What was validated before filing. Include the actual commands and results
so reviewers can reproduce without guessing.>

- **Lint**: `<command>` — pass / N issues
- **Unit tests**: `<command>` — N/N passing
- **Manual checks**: <any ad-hoc verification performed>

### Acceptance criteria

- [x] Criterion 1
- [x] Criterion 2
- ...
```

Guidelines:
- The `## Closes #N` line must be the first line so GitHub auto-links.
- Acceptance criteria come from the plan file or the linked issue. Mark them all `[x]` if the implementation satisfies them (it should, or the PR isn't ready).
- The **Tests** section should reflect what was actually run, not aspirational coverage. If a test runner exists, run it and report the real result. If there's no test suite, say so.
- Keep the body factual and scannable. No flavour — that belongs in the merge comment.
- If there are no acceptance criteria in the issue or plan, omit that section.
- If the CONTRIBUTING.md requires additional sections (screenshots, breaking change notes, environment details), add them.

### 5. Choose the title

Use conventional commit style matching the primary change type, unless the
repo's CONTRIBUTING.md or PR template specifies a different convention:

```
type(scope): short imperative description
```

- `feat`, `fix`, `chore`, `docs`, `refactor`, `test` — infer from the commits.
- Scope is the module or area touched (e.g. `store`, `agents`, `rpc-client`).
- Under ~72 chars, no trailing period.
- Do NOT include the PR number — GitHub adds it at merge time.

### 6. File the PR

```bash
gh pr create \
  --title "<title>" \
  --body-file - \
  --base <base> \
  --head <branch> <<'EOF'
<body>
EOF
```

Report the resulting PR URL to the user.

## Rules

- File exactly one PR. Don't ask for confirmation — the user already asked to file it.
- If the branch has no commits beyond the base, stop and report that there's nothing to PR.
- If the push fails (e.g. no upstream), push first, then file.
- Never include a `Co-Authored-By` trailer in the PR body.
- When a repo PR template exists, use it — don't silently override it with the default.
- When CONTRIBUTING.md defines PR rules, follow them even if they add friction.
