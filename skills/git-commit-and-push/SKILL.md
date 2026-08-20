---
name: git-commit-and-push
description: >-
  Splits uncommitted changes into a small set of logical, single-concern git
  commits, then executes the commits and pushes to remote. Use when the user
  wants to commit and push, organize changes into logical commits, split a
  large change into multiple commits, or create a series of conventional
  commits from the current working tree.
---

# Git commit and push

Organize uncommitted changes into atomic, single-concern commits (one per: config, formatting, behavior, tests, docs) so history stays readable. Execute every commit and push. Run immediately, no approval round-trip.

## Workflow

### 1. Inspect current state

- Run `git status`, `git diff`, and (if anything is staged) `git diff --staged`.
- Record which areas changed: config, source, tests, docs, rules.

### 2. Check GitHub issues

- Run `gh issue list --state open` and match issues against the planned commits.
- When a commit fixes an issue, add `Fixes #N` / `Closes #N` on its own line in the commit body (or ` (fixes #N)` in the subject when it's the main fix and fits).

### 3. Group by logical concern

One commit per concern, not per file:

| Concern | Examples | Conventional type |
| --- | --- | --- |
| Config / tooling | ESLint, tsconfig, package.json scripts | `chore` or `build` |
| Formatting only | Blank lines, quotes, line length | `style` |
| Feature / behavior | New logic, changed behavior | `feat` or `fix` |
| Tests | New or moved tests, fixtures | `test` |
| Docs / rules | AGENTS.md, docs, skills | `docs` |
| Misc / cleanup | Unrelated small fixes | `chore`, or split when feasible |

When a file spans two concerns, assign it to the dominant one and note the mix in the body.

### 4. Execute and push

For each commit in order: `git add <paths>`, then `git commit` with subject, flavourful body, issue refs, and a `Co-Authored-By` trailer with your actual model name (e.g. `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`, whatever model you actually are). Execute every commit via Bash; printing the commands is not committing.

After the final commit: `git push`. Confirm with a summary table of what landed.

## Commit message format

### Subject

```
type(scope): short imperative description
```

Types: `chore`, `feat`, `fix`, `docs`, `test`, `style`, `refactor`. Present tense, under ~72 chars, no trailing period.

### Body (flavour zone)

Every commit gets a body: genuinely useful (the *why*, tricky decisions, breaking changes) with a light touch of fun. Dry wit, a pun, a lyric, a mini-poem. The flavour complements the content; the *why* always comes through.

This body is a sanctioned flavour zone: it overrides global style rules that ban idioms, metaphors, and wordplay, on purpose.

**fix:**
> We had a real commitment issue. The index was off by one, which is ironic for a commit tool. Fixed now, no more therapy needed.

**style:**
> Roses are red,
> diffs should be small,
> this is formatting only,
> no logic at all.

**chore:**
> *"Another one bites the dust"*, dependency edition. Bumped @types/node, wired up the validate script, and sent CI's complaints to voicemail.

Full example:

```
fix(decompose): correct section index and guard empty headings

This bug had been quietly misfiling the last section of every decomposed
doc since the index refactor. Off-by-one. Classic. Also added a guard for
empty heading strings so we stop generating phantom commits in edge cases.

Fixes #12

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
```