---
name: pr-file
description: Use when the user asks to file a pull request or put the current branch up for review.
---

# File a pull request

Rebase the finished branch, push it safely, and open a real PR. Run immediately
when the user asks to file the PR; do not add an approval round-trip.

## Workflow

### 1. Read the branch and repository conventions

- Confirm the repository root, current branch, working tree, and remotes.
- Use the base branch supplied by the user or harness. Otherwise use the repo's
  default branch, usually `main`.
- Stop if the current branch is the base, has no commits to file, or the working
  tree is dirty. Do not stash, discard, or mix uncommitted work into the PR.
- Check for an existing open PR from the current branch. If one exists, report
  its URL instead of creating a duplicate.
- Read relevant `AGENTS.md`, `CONTRIBUTING.md`, and pull-request templates before
  composing the PR. Repository conventions win where they are more specific.

### 2. Rebase onto the latest base

Fetch the remote state, first making sure the current branch is not behind or
diverged from its published upstream. Then rebase onto the latest remote base:

```bash
git fetch origin
git rebase "origin/<base>"
```

Resolve straightforward conflicts according to the code's intent and run
focused validation afterward. If a resolution is genuinely ambiguous, report
the conflicting files and stop. Never skip the rebase merely to get the PR open.

### 3. Understand what the PR delivers

Read the commits and full diff against the rebased base:

```bash
git log --oneline "origin/<base>..HEAD"
git diff --stat "origin/<base>...HEAD"
git diff "origin/<base>...HEAD"
```

Run the repository's focused required checks after the rebase when they are
discoverable. Do not invent results or add ceremonial test runs.

### 4. Write the title and body

Use a conventional title:

```text
type(scope): short description of the problem solved
```

- Keep it under about 72 characters, with no trailing period or PR number.
- Describe the user-visible outcome or problem solved, not the implementation
  technique. Prefer `fix(web): tile fetches are no longer intercepted` over
  `fix(web): add early return to fetch handler`.

Follow the repository's PR template when present. Otherwise keep the body this
simple:

```markdown
<One or two sentences stating the problem or desired feature.>

<One or two sentences explaining how this PR solves it.>

<Closes #N, only when merge should complete that issue.>

---
Made with <actual model> using <actual harness>.
```

- Open with the problem, then the solution. Remove headings that add no clarity.
- Name the actual model and harness that produced the change; never guess or use
  a generic attribution. Name multiple contributors succinctly when needed.
- Include validation only when the repo template requires it or the result is
  important context. State only checks actually run.
- Directly reference only issues that should be completed by the merge. The
  paired `pr-merge` skill treats every direct issue reference as close intent.

### 5. Push and create the PR

Push the current branch. Use a normal push when possible. If the rebase rewrote
an already-published branch, use `--force-with-lease` only after confirming the
remote has not advanced; never use `--force`.

Create the PR with the chosen base, current branch, title, and body:

```bash
gh pr create \
  --base "<base>" \
  --head "<current-branch>" \
  --title "type(scope): short description" \
  --body-file "<body-file>"
```

Do not pass `--draft`. The requested result is a real PR ready for CI and review.

### 6. Verify and report

Verify the created PR's URL, title, base, head, and non-draft state with
`gh pr view`. Report the URL, rebase result, and checks actually run.
