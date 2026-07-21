---
name: address-issue
description: >-
  Addresses a provided GitHub issue end-to-end in the workspace supplied by the
  harness, planning the work, executing TODOs with one commit per completed
  TODO, and filing a PR when the issue needs a code change. Use when the user
  says "address issue", asks to work an issue end-to-end, implement an issue
  with TODO commits, or file a PR for an issue.
---

# Address Issue

Implement a provided issue end-to-end in the workspace and Git context supplied
by the harness or user. Keep the plan visible and history tidy: understand the
issue, draft concrete TODOs, update them as work progresses, commit after each
TODO, then file a PR.

## Workflow

### 1. Identify the issue and repo state

- Parse the provided issue number or URL. If ambiguous, ask for the issue.
- The harness-supplied repository location, worktree, branch, and base branch
  are authoritative — change them only on explicit user request.
- From the supplied repository root, confirm the working tree is safe:

```bash
git rev-parse --show-toplevel
git status --short
gh issue view <issue-number> --json number,title,body,labels,state
```

If the issue is closed, stop unless the user explicitly asked to reopen or work
closed issues. If local uncommitted changes exist outside `.plans/`, avoid mixing
work: ask the user how to handle it. Do not move the task elsewhere as a
workaround.

### 2. Read, understand, and draft the plan

Read the full issue body and relevant code before editing. Search for existing
patterns, tests, and project conventions.

Not every issue needs an implementation fix. If investigation shows no code
change is warranted — a question to answer, a duplicate, already fixed, or
works-as-intended — post the findings as an issue comment, close with the
matching reason (`gh issue close <n> --reason "not planned"` or `completed`),
and stop. No branch, no PR.

Create or update a plan file at `.plans/<number>-<slug>.md` when plans are part
of the repository's conventions:

```markdown
# #<number> <issue title>

## Summary
<What the issue asks for in your own words.>

## Acceptance criteria
- [ ] <Observable outcome from the issue>

## TODOs
- [ ] <Small concrete implementation step>
- [ ] <Small concrete test/validation step>

## Notes
- Decisions, discoveries, and commands run.
```

Rules for TODOs:

- Make each TODO independently committable.
- Include tests/validation as TODOs, not afterthoughts.
- Prefer 3–8 TODOs. Split vague TODOs before starting.
- If requirements are unclear, add questions under Notes and ask before coding.

Commit the initial plan if it is part of the repo's normal workflow. If `.plans/`
is ignored or repo-local only, keep it updated without committing.

### 3. Execute one TODO at a time

For each TODO:

1. Mark it in progress in the plan (`- [~]`) or add a short Notes entry.
2. Make the smallest code/test/doc changes needed.
3. Run focused validation for that TODO.
4. Update the plan:
   - Mark the TODO complete (`- [x]`).
   - Record validation commands and results.
   - Add or revise TODOs when discoveries change the plan.
5. Commit immediately before starting the next TODO:

```bash
git status --short
git diff
git add <paths>
git commit -m "<type>(<scope>): <complete this TODO>" -m "Implements TODO: <exact TODO text>." -m "Refs #<issue-number>"
```

Commit guidelines:

- One completed TODO per commit, unless a TODO was split; then commit each split
  item separately.
- Keep commits buildable.
- Include `Refs #<issue-number>` in intermediate commits. `Closes #<issue-number>`
  appears only in the final implementation commit or PR body, and only when the
  issue is fully resolved.

### 4. Final validation

After all TODOs are complete:

```bash
git status --short
# Run the repo's relevant checks, e.g.:
pnpm test
pnpm lint
pnpm check
```

Use the project's actual scripts. If a command fails, diagnose and either fix it
or record the residual risk clearly before filing the PR.

### 5. Push and file the PR

Push the harness-provided current branch without renaming or replacing it:

```bash
git push -u origin HEAD
```

Use the target base supplied by the harness or user. If neither specifies one,
follow the repository's established default. Check repo conventions before
building the body: a `.github/PULL_REQUEST_TEMPLATE.md` is the body skeleton
when present, and PR rules in CONTRIBUTING.md (required sections, title format)
win over this skill's defaults. Default body:

```markdown
<Flavour opener: 1-3 sentences summarizing the PR's impact with personality —
same voice as the pr-merge comment and git-commit-and-push bodies. Dry wit, a
pun, a lyric all work; the substance always comes through.>

Closes #<n>
Refs #<m> — addresses <scope covered>; still open: <what remains>

### Acceptance criteria
- [x] <Observable outcome from the plan file or issue>

### What's in this PR
- <What was built, key decisions, notable APIs>

### Tests
- `<command>` — actual result (e.g. 42/42 passing)
```

Body rules:

- Link every issue the PR addresses, and choose the keyword deliberately:
  `Closes #n` only when the PR fully resolves the issue; otherwise `Refs #n`
  with one line on the scope covered and what remains. This is what `pr-merge`
  reads to decide which issues to close.
- Acceptance criteria come from the plan file or issue. All checked — or the
  PR isn't ready; explicitly deferred criteria stay unchecked under a `Refs`
  issue with the deferral noted.
- Tests reflect what was actually run, with real results.
- No `Co-Authored-By` trailers in the PR body.

Create the PR — title in conventional style, under ~72 chars, no trailing
period, no PR number:

```bash
gh pr create --base <base> --head <current-branch> --title "<type>(<scope>): <summary>" --body-file <body-file>
```

Report the PR URL, current branch, completed TODOs, and validation.

## Rules

- Workspace, worktree, branch, and base-branch selection belongs to the harness
  or explicit user instruction.
- The plan file is the source of truth — keep it current while working.
- File the PR only when all TODOs are complete or explicitly deferred with a
  reason.
- Prefer existing repo conventions over this skill's defaults.
