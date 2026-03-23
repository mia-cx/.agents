---
name: organize-commits
description: >-
  Splits uncommitted changes into a small set of logical, single-concern git commits, then executes the commits and pushes to remote. Use when the user wants to organize changes into logical commits, split a large change into multiple commits, or create a series of conventional commits from the current working tree.
---

<!-- @format -->

# Organize Changes Into Logical Commits

You organize uncommitted changes into atomic, single-concern commits (e.g. one per: config, formatting, behavior, tests, docs) so history stays readable. You then **execute every commit** and **push to remote** — no copy-pasting required. Follow the workflow below.

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
2. `git commit` with subject, flavourful body, issue refs (if any), and trailer

After all commits are done, run:
```
git push
```

Then confirm with a summary table of what landed and a one-liner like **"X commits pushed. History looking tidy. 🚀"**

## Commit message format

### Subject (heading)

Standard conventional commits — keep it clean and professional:

```
type(scope): short imperative description
```

- Types: `chore`, `feat`, `fix`, `docs`, `test`, `style`, `refactor`
- Present tense, under ~72 chars, no trailing period.

### Body (flavour zone 🎉)

Every commit gets a body. The body should be **genuinely useful** (explain the *why*, call out tricky decisions, mention breaking changes) but written with **personality and a light touch of fun**. Think: a senior dev who's good at their job and also enjoys writing commit messages.

Guidelines for flavourful bodies:
- Use casual, conversational tone — short sentences, contractions fine.
- Flavour can take many forms: dry wit, a pun, a one-liner, a relevant song lyric or quote, a mini-poem, a metaphor, a cheeky aside — all fair game.
- Don't overdo it — the flavour should complement the content, not drown it.
- Still cover the real *why*: what was wrong, what changed, what to watch out for.
- If a commit fixes a GitHub issue, add `Fixes #N` or `Closes #N` on its own line after the body text.

#### Body examples by type

**feat:**
> Turns out users actually want to see their data sorted. Wild, I know. Added ascending sort by default with a toggle for desc — the toggle was basically free so it's in there too.

**fix:**
> This one had been lurking since the refactor in January. Off-by-one on the section index meant the last heading always got swallowed. Not anymore. Squashed with extreme prejudice.

**chore:**
> Housekeeping commit. Nothing exciting here — bumped @types/node, wired up the validate script so CI stops complaining, and called it a day.

**style:**
> Pure cosmetic pass. No logic changed, pinky promise. Just coaxing the formatter into submission so the diff noise in future PRs stays minimal.

**test:**
> Tests were, uh, missing. They are now less missing. Coverage for the happy path and the two edge cases that bit us last sprint.

**docs:**
> Wrote the thing the team kept asking about in standups. Documented the PRIVATE_ env convention and the sync flow so we can stop re-explaining it in Slack.

**refactor:**
> Same behaviour, tidier internals. Pulled the duplicate logic into a shared helper — three call sites were all doing the same dance with slightly different shoes.

## Full example

```
fix(decompose): correct section index and guard empty headings

This bug had been quietly misfiling the last section of every decomposed
doc since the index refactor. Off-by-one. Classic. Also added a guard for
empty heading strings so we stop generating phantom commits in edge cases.

Fixes #12

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

## Checklist before finishing

- [ ] GitHub issues checked; any commit that fixes an issue includes `Fixes #N` or `Closes #N`.
- [ ] All commits executed via Bash tool — not just printed.
- [ ] Every commit body has real content + a touch of flavour.
- [ ] `git push` run after the final commit.
- [ ] Confirmation summary sent to user.
