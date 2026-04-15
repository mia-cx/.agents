---
name: pr-merge
description: >-
  Merges a pull request with style. Posts a flavourful summary as a PR comment (visible in GitHub), then merges with a clean conventional commit subject. Use when a PR is ready to merge and you want memorable context without cluttering the git log.
---

<!-- @format -->

# Merge a Pull Request

You merge pull requests with style. You read the PR, understand what it does, post a flavourful comment on the PR, then execute the merge with a clean commit — no copy-pasting required. Follow the workflow below.

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

### 5. Post the flavour comment

**Before merging**, post the flavourful summary as a PR comment so it's readable in GitHub's timeline:

```
gh pr comment <number> --body "<flavour body>"
```

The comment body should **summarize the PR's impact** with **personality and a light touch of fun**. Think: a senior dev who's proud of what the team shipped.

Guidelines:
- Use casual, conversational tone — short sentences, contractions fine.
- Flavour can take many forms: dry wit, a pun, a one-liner, a relevant song lyric or quote, a mini-poem, a metaphor, a cheeky aside — all fair game.
- Don't overdo it — flavour should complement the substance, not drown it.
- Still cover the real substance: what the PR delivers, key decisions, anything to watch out for.

#### Comment examples

**feat:**
> *"We're not in Kansas anymore"* — and neither is the dashboard. Ships the analytics overview: real-time charts, filterable date ranges, and an export button that actually works.

**fix:**
> The auth token was expiring mid-request like a carton of milk left on the counter. Added a refresh buffer so tokens get renewed 30 seconds before expiry instead of after the 401 hits.

**chore:**
> *"I fought the deps and the deps won"* — bumped everything that wasn't pinned, fixed the two breaking changes, and updated the lockfile. CI is green and the audit is clean.

**refactor:**
> Same behaviour, new skeleton. Extracted the shared validation logic into a single module instead of the previous three-headed hydra approach. Fewer lines, fewer bugs, fewer "wait, which validator does this endpoint use?" conversations.

### 6. Merge the PR

**Do not ask for approval — merge immediately after posting the comment.** Use the `gh` CLI:

```
gh pr merge <number> --merge --subject "<subject>"
```

The commit subject only — **no body**. The flavour lives in the comment.

Use `--merge` (merge commit) by default. If the repo convention is squash or rebase, match it:
- `--squash` for squash-and-merge repos
- `--rebase` for rebase repos

Check the repo's merge settings if unsure: `gh api repos/{owner}/{repo} --jq '.allow_merge_commit, .allow_squash_merge, .allow_rebase_merge'`

Then confirm with a summary like **"PR #N merged. Another one bites the dust. 🎤"**

## Merge commit subject format

Clean and professional — conventional commit style:

```
type(scope): short imperative description (#N)
```

- Infer the type from the PR content: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`
- Include the PR number at the end
- Under ~72 chars, no trailing period
- **No body** — all narrative goes in the comment (step 5)


## Checklist before finishing

- [ ] PR context fully read (diff, body, comments, linked issues).
- [ ] CI checks confirmed passing.
- [ ] Flavour comment posted via `gh pr comment` — visible in GitHub timeline.
- [ ] Merge executed via `gh pr merge` with subject only — no body.
- [ ] Confirmation summary sent to user.
