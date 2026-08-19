---
name: address-issue
description: >-
  Use when the user says "address issue", asks to implement or work a GitHub
  issue end-to-end, or wants issue work done as TODOs with one commit per TODO
  and a PR. Not for filing or merging an already-finished branch (pr-file /
  pr-merge), and not for triage alone.
---

# Address Issue

Implement a provided issue in the harness- or user-supplied workspace and Git
context. Core loop: plan → atomic TODOs → one commit per TODO → PR (or
comment+close when no code change).

## Workflow

### 1. Identify the issue and repo state

- Parse the issue number or URL; ask only if ambiguous.
- Harness-supplied repo root, worktree, branch, and base are authoritative —
  change them only on explicit user request. Do not relocate the task to dodge a
  dirty tree.
- From that root:

```bash
git rev-parse --show-toplevel
git status --short
gh issue view <issue-number> --json number,title,body,labels,state
```

If the issue is closed, stop unless the user asked to reopen or work closed
issues. If uncommitted changes exist outside `.plans/`, ask how to handle them
before mixing work.

### 2. Read, understand, and draft the plan

Read the issue body and relevant code first. Search for existing patterns, tests,
and conventions.

If no code change is warranted (question, duplicate, already fixed,
works-as-intended): post findings as an issue comment, close with
`gh issue close <n> --reason "not planned"` or `completed`, and stop — no branch,
no PR.

When plans are part of the repo's conventions, create/update
`.plans/<number>-<slug>.md`:

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

TODO rules: each independently committable; include tests/validation as TODOs;
prefer 3–8; split vague ones before coding; unclear requirements → Notes + ask
before coding.

Commit the initial plan only when that is normal for the repo. If `.plans/` is
ignored or local-only, keep it updated without committing.

### 3. Execute one TODO at a time

For each TODO:

1. Mark in progress (`- [~]`) or note it under Notes.
2. Smallest change that completes it.
3. Focused validation for that TODO.
4. Mark complete (`- [x]`), record validation, revise TODOs on discovery.
5. Commit before the next TODO:

```bash
git status --short
git diff
git add <paths>
git commit -m "<type>(<scope>): <complete this TODO>" -m "Implements TODO: <exact TODO text>." -m "Refs #<issue-number>"
```

One completed TODO per commit (or per split item). Keep commits buildable.
`Refs #<n>` on intermediate commits; `Closes #<n>` only on the final
implementation commit or PR body when the issue is fully resolved.

### 4. Final validation

After all TODOs:

```bash
git status --short
# Project scripts, e.g. pnpm test / lint / check
```

On failure: diagnose, fix, or record residual risk before filing the PR.

### 5. Push and file the PR

Push the current harness-provided branch (no rename/replace). Then follow
[pr-file](../pr-file/SKILL.md) for rebase, title, push mechanics, and creation —
repo templates and CONTRIBUTING win over defaults.

Issue-specific body deltas on top of pr-file:

- Keyword deliberately: `Closes #n` only when this PR fully resolves the issue;
  otherwise `Refs #n` plus one line on scope covered and what remains.
  `pr-merge` closes every directly referenced open issue.
- Acceptance criteria from the plan/issue — all checked, or defer under a
  `Refs` issue with the deferral noted.
- Tests: commands actually run, with real results.

Report the PR URL, branch, completed TODOs, and validation.

## Rules

- Workspace / worktree / branch / base belong to the harness or explicit user
  instruction.
- The plan file is source of truth while working — keep it current.
- File the PR only when every TODO is complete or explicitly deferred with a
  reason.
- Prefer existing repo conventions over this skill's defaults.
