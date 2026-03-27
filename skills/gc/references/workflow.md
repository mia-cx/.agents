## Workflow

### 1. Inspect current state

- Run `git status`, `git diff`, and (if anything is staged) `git diff --staged`.
- Record which files and areas changed: config, source, tests, docs, rules.

### 2. Check GitHub issues

- Run `gh issue list --state open` to fetch open issues for the current repo.
- Compare issue titles and descriptions to the changes and your planned commits. If a commit clearly fixes or implements an issue, note the issue number.
- When writing commit messages (step 3), add a reference so GitHub auto-closes the issue: in the commit **body** use `Fixes #N` or `Closes #N` (one per line if multiple), or in the **subject** append ` (fixes #N)` when it's the main fix. Prefer body for multiple issues or long subjects.

### 3. Group by logical concern

Assign each change to one **concern**; one commit per concern, not per file. Use this mapping:

| Concern | Examples | Conventional type |
| --- | --- | --- |
| Config / tooling | ESLint, Prettier, tsconfig, package.json scripts | `chore` or `build` |
| Formatting only | Blank lines, quotes, line length | `style` or `chore(style)` |
| Feature / behavior | New logic, compose order, numbering | `feat` or `fix` |
| Tests | New or moved tests, fixtures | `test` |
| Docs / rules | AGENTS.md, docs content, .mdc rules, skills | `docs` |
| Misc / cleanup | Unrelated small fixes | `chore` or split when feasible |

When a single file has edits that span two concerns, assign it to the dominant concern and note the mix.

### 4. Execute commits

**Do not ask for approval — run the commits immediately.** Use the Bash tool for each commit in order:

1. `git add <paths>`
2. `git commit` with subject, flavourful body, issue refs (if any), and a `Co-Authored-By` trailer reflecting **your own model name** (e.g. `Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>` — use whatever model you actually are)

After all commits are done, run:
```
git push
```

Then confirm with a summary table of what landed and a one-liner like **"X commits pushed. History looking tidy. 🚀"**
