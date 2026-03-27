---
name: pr-merge
description: "Merges a pull request with a clean conventional commit while posting a memorable summary comment on GitHub. Use when a PR is already review-complete and the user wants it merged with context preserved in the PR conversation instead of the git history. Not for reviewing a PR or resolving feedback before it is merge-ready."
---

# Merge a Pull Request

Treat this file as a router. Read the merge workflow first, then load the comment/subject guidance when you're ready to post and merge.

## Workflow

1. Read `references/workflow.md` for PR discovery, diff reading, readiness checks, comment posting, and merge execution.
2. Read `references/comment-and-subject-guidance.md` for flavour-comment patterns, merge-subject rules, and finishing checks.
3. Merge only after the PR is green and the summary comment is ready.

## Rules

- Keep merge mechanics separate from writing guidance.
- Put narrative context in the PR comment, not in the merge commit body.
- Do not merge blocked or failing PRs.
