---
name: codex-review
description: >-
  Ask the Codex CLI (gpt-5.6-sol) for an independent code review of
  uncommitted changes, a branch diff, a commit, or a specific implementation.
  Use when the user asks for a Codex or GPT review or a second-pass review,
  when CLAUDE.md's model rubric calls for an extra independent review
  perspective, or when Codex should audit a diff, find bugs or regressions, or
  compare an implementation against requirements. For a review by Claude
  itself, use the normal review process instead.
---

# Codex Review

Use Codex as an independent reviewer when the user wants a second-pass review or when a change is broad enough that another perspective is useful. For small local checks, review directly — and read the code yourself either way. Treat Codex's output as evidence, not authority.

## Workflow

1. Identify the review target: uncommitted changes, base branch, commit SHA, PR checkout, or specific files.
2. Create a temporary artifact directory for the prompt and report.
3. Run `codex review` from the repo root with a focused review prompt.
4. Read the report and verify important claims against the code before presenting them.

Command shapes:

```bash
ARTIFACT_DIR="$(mktemp -d "${TMPDIR:-/tmp}/codex-review.XXXXXX")"
REPORT="$ARTIFACT_DIR/report.md"
PROMPT="$ARTIFACT_DIR/prompt.md"

# Review staged, unstaged, and untracked changes.
codex review --uncommitted - < "$PROMPT" > "$REPORT"

# Review current branch against a base branch.
codex review --base main - < "$PROMPT" > "$REPORT"

# Review a single commit.
codex review --commit <sha> - < "$PROMPT" > "$REPORT"
```

- The model comes from `~/.codex/config.toml` (gpt-5.6-sol:high — the right tier for review depth); override with `-c model="..."` when the rubric says otherwise.
- Stdin carries the prompt here, so `</dev/null` does not apply.
- Long reviews can exceed Bash's 10-minute timeout: pass an explicit timeout, or run in the background and poll for `$REPORT`.

## Review Prompt

Keep it simple and self-contained — Codex needs no Claude-style scaffolding:

```text
Review these changes for bugs, regressions, missing tests, security issues, and requirement mismatches.

Prioritize findings over summary. For each finding include:
- severity
- file and line reference
- concrete failure mode
- suggested fix direction

If there are no substantive findings, say so and name any residual test gaps.
```

Add task-specific context when useful: requirements, risky areas, expected behavior, relevant tests, or files you are unsure about.

## Reporting Back

Before relaying a finding, inspect the cited code or diff enough to decide whether it is real. In the user-facing response, separate confirmed issues from unverified Codex suggestions.

If Codex finds nothing, say that clearly and mention what review target it inspected.

If `codex` is not installed or the command fails, report the error and offer to review the changes directly instead.
