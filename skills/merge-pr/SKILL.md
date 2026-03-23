---
name: merge-pr
description: >-
  Merges a pull request with a flavourful, context-aware merge commit message. Reads the PR diff, conversations, and linked issues, then generates a merge commit with a professional subject line and a fun body. Use when a PR is ready to merge and you want a memorable commit message.
---

<!-- @format -->

# Merge a Pull Request

You merge pull requests with style. You read the PR, understand what it does, generate a flavourful merge commit message, and execute the merge — no copy-pasting required. Follow the workflow below.

## Workflow

### 1. Identify the PR

- If the user provides a PR number or URL, use that.
- If not, run `gh pr list --state open` and ask which one to merge (or pick the obvious one if there's only one).
- Run `gh pr view <number> --json title,body,headRefName,baseRefName,commits,files,reviews,comments,labels,milestone` to get full PR context.

### 2. Read the PR diff

- Run `gh pr diff <number>` to see the full changeset.
- Understand what changed: features added, bugs fixed, refactors applied, tests added, docs updated.

### 3. Check for linked issues

- Scan the PR body and commits for issue references (`#N`, `Fixes #N`, `Closes #N`).
- Run `gh issue view <N> --json title,body,labels` for any linked issues to understand the full context.
- Note which issues should be closed by this merge.

### 4. Check merge readiness

Before merging, verify:
- All CI checks are passing: `gh pr checks <number>`
- The PR has required approvals: check the `reviews` field from step 1
- There are no merge conflicts: `gh pr view <number> --json mergeable`

If the PR is **not ready** (failing checks, no approvals, conflicts), report the blockers and stop. Do NOT merge a PR that isn't green.

### 5. Merge the PR

**Do not ask for approval — merge immediately.** Use the `gh` CLI:

```
gh pr merge <number> --merge --subject "<subject>" --body "<body>"
```

Use `--merge` (merge commit) by default. If the repo convention is squash or rebase, match it:
- `--squash` for squash-and-merge repos
- `--rebase` for rebase repos

Check the repo's merge settings if unsure: `gh api repos/{owner}/{repo} --jq '.allow_merge_commit, .allow_squash_merge, .allow_rebase_merge'`

Then confirm with a summary like **"PR #N merged. Another one bites the dust. 🎤"**

## Merge commit message format

### Subject (heading)

Clean and professional — conventional commit style when possible:

```
type(scope): short imperative description (#N)
```

- Infer the type from the PR content: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`
- Include the PR number at the end
- Under ~72 chars, no trailing period

### Body (flavour zone 🎉)

Every merge gets a body. The body should **summarize the PR's impact** (what changed and why it matters) but written with **personality and a light touch of fun**. Think: a senior dev who's proud of what the team shipped.

Guidelines for flavourful bodies:
- Use casual, conversational tone — short sentences, contractions fine.
- Flavour can take many forms: dry wit, a pun, a one-liner, a relevant song lyric or quote, a mini-poem, a metaphor, a cheeky aside — all fair game.
- Don't overdo it — the flavour should complement the summary, not drown it.
- Still cover the real substance: what the PR delivers, key decisions, anything to watch out for.
- If the PR closes issues, add `Closes #N` on its own line after the body text.
- End with a `Co-Authored-By` trailer reflecting **your own model name** (e.g. `Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>` — use whatever model you actually are).

#### Body examples

**feat merge:**
> *"We're not in Kansas anymore"* — and neither is the dashboard. This PR adds the analytics overview that product has been asking about since Q2. Real-time charts, filterable date ranges, and an export button that actually works.
>
> Closes #42
>
> Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>

**fix merge:**
> The auth token was expiring mid-request like a carton of milk left on the counter. Added a refresh buffer so tokens get renewed 30 seconds before expiry instead of after the 401 hits.
>
> Closes #87
>
> Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>

**chore merge:**
> *"I fought the deps and the deps won"* — bumped everything that wasn't pinned, fixed the two breaking changes, and updated the lockfile. CI is green and the audit is clean.
>
> Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>

**refactor merge:**
> Same behaviour, new skeleton. Extracted the shared validation logic into a single module instead of the previous three-headed hydra approach. Fewer lines, fewer bugs, fewer "wait, which validator does this endpoint use?" conversations.
>
> Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>

## Full example

```
feat(analytics): add real-time dashboard with export (#42)

"We're not in Kansas anymore" — and neither is the dashboard. This PR
ships the analytics overview: real-time charts via WebSocket, filterable
date ranges, CSV/PDF export, and a responsive layout that doesn't fall
apart on mobile.

Three weeks of work across 12 commits. The WebSocket connection handles
reconnects gracefully and the export queue is async so it won't block
the UI thread. Watch the memory footprint on the charts — we're capping
at 1000 data points in the viewport but it hasn't been load-tested yet.

Closes #42
Closes #38

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

> **Note on the trailer:** Always use your actual model name — if you're Claude Opus 4.5, write `Claude Opus 4.5`; if you're GPT-5.4, write `GPT-5.4`, etc. Don't hardcode a model name that isn't yours.

## Checklist before finishing

- [ ] PR context fully read (diff, body, comments, linked issues).
- [ ] CI checks confirmed passing.
- [ ] Merge executed via `gh pr merge` — not just printed.
- [ ] Merge commit body has real substance + a touch of flavour.
- [ ] Issue references included (`Closes #N`) where applicable.
- [ ] `Co-Authored-By` trailer reflects your actual model name.
- [ ] Confirmation summary sent to user.
