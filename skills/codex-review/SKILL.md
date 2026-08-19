---
name: codex-review
description: >-
  Get an independent code review from the Codex CLI (gpt-5.6-sol) — uncommitted
  changes, a branch diff, a commit, or a specific implementation.
disable-model-invocation: true
---

# Codex Review

Use Codex as an independent reviewer when the user wants a second-pass review or when a change is broad enough that another perspective is useful. For small local checks, review directly — and read the code yourself either way. Treat Codex's output as evidence, not authority.

## Workflow

1. Identify the review target: uncommitted changes, base branch, commit SHA, PR checkout, or specific files.
2. Create a temporary artifact directory for the report and, for a custom review, the prompt.
3. Run `codex review` from the repo root with either a built-in target or a custom prompt.
4. Read the report and verify important claims against the code before presenting them.

Command shapes:

```bash
ARTIFACT_DIR="$(mktemp -d "${TMPDIR:-/tmp}/codex-review.XXXXXX")"
REPORT="$ARTIFACT_DIR/report.md"
PROMPT="$ARTIFACT_DIR/prompt.md"

# Review staged, unstaged, and untracked changes.
codex review --uncommitted </dev/null > "$REPORT"

# Review current branch against a base branch.
codex review --base main </dev/null > "$REPORT"

# Review a single commit.
codex review --commit <sha> </dev/null > "$REPORT"

# Use custom instructions instead of a built-in target.
codex review - < "$PROMPT" > "$REPORT"
```

- The model comes from `~/.codex/config.toml` (gpt-5.6-sol:high — the right tier for review depth); override with `-c model="..."` when the rubric says otherwise.
- `--uncommitted`, `--base`, and `--commit` are mutually exclusive with a custom `PROMPT`. Use one of the first three command shapes for a built-in target; use the final shape when custom instructions matter more.
- Built-in targets take `</dev/null` so codex doesn't wait on input; the custom shape uses stdin for the prompt instead.
- Long reviews can exceed Bash's 10-minute timeout: pass an explicit timeout, or run in the background and poll for `$REPORT`.

## Review Prompt

For a custom-prompt review, keep the prompt simple and self-contained — Codex needs no Claude-style scaffolding:

```text
Review these changes for bugs, regressions, missing tests, security issues, and requirement mismatches.

Prioritize findings over summary. For each finding include:
- severity
- file and line reference
- concrete failure mode
- suggested fix direction

Do not edit files. If there are no substantive findings, say so and name any residual test gaps.
```

Keep "Do not edit files" — the 5.6 models (sol especially) are eager to start fixing what they review.

Add task-specific context when useful: requirements, risky areas, expected behavior, relevant tests, or files you are unsure about.

## Reporting Back

Before relaying a finding, inspect the cited code or diff enough to decide whether it is real. In the user-facing response, separate confirmed issues from unverified Codex suggestions.

If Codex finds nothing, say that clearly and mention what review target it inspected.

If `codex` is not installed or the command fails, report the error and offer to review the changes directly instead.
