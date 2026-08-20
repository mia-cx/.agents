---
name: codex-computer-use
description: >-
  Use when the user asks to test a flow, verify UI behavior, inspect a running app, or capture screenshots.
---

# Codex Computer Use

Use Codex as a separate local verification agent when the task needs real UI interaction, screenshots, simulator/browser/device state, or an independent runtime check outside the current context. For code reading, typechecking, linting, or tests, run them directly instead — no computer use needed.

Launching apps, simulators, or browsers to verify the requested work is fine without asking; ask first only if the run could disrupt the user's environment beyond that (closing their apps, changing system settings, acting on real accounts or data).

## Environment

Capability depends on where this runs — check before dispatching:

- **Browser automation (the common case)**: the codex CLI drives Chrome via CDP (`browser_use` feature, stable and enabled). Needs Chrome and a display; works on the laptop, not on a headless devbox.
- **Full OS control** (native apps, simulators, cross-app flows): requires the Codex desktop app on macOS or Windows — macOS needs Screen Recording + Accessibility permissions. Linux is unsupported.
- **Headless environment** (no display/Chrome): report that computer use is unavailable and fall back to non-GUI verification — curl the endpoints, run the test suite, read logs.

## Workflow

1. Confirm the target is reachable: app running, URL or app name known, test credentials if the flow needs them.
2. Create a temporary artifact directory; write the verification prompt to `$ARTIFACT_DIR/prompt.md`.
3. Run `codex exec`:

```bash
ARTIFACT_DIR="$(mktemp -d "${TMPDIR:-/tmp}/codex-verify.XXXXXX")"

codex exec -m gpt-5.6-sol -c model_reasoning_effort=medium -s workspace-write \
  -C "$ARTIFACT_DIR" --skip-git-repo-check \
  - < "$ARTIFACT_DIR/prompt.md" > "$ARTIFACT_DIR/log.md"
```

Set the Codex working root to the temporary artifact directory. This keeps `workspace-write` available for screenshots and the report without making the source repository writable.

Computer-use runs are long: pass an explicit Bash timeout, or run in the background and poll for `$ARTIFACT_DIR/report.md`.

## Verification Prompt

Keep it simple and self-contained:

```text
Verify this flow in <app / URL>:

1. <step>
2. <step>
3. <expected outcome>

Use the browser to walk the flow. Save a screenshot per step to <artifact dir> and write <artifact dir>/report.md with pass/fail per step, each referencing its screenshot.

Report only — do not edit any files outside <artifact dir>. If a step cannot be completed, capture the failing state and say exactly where it stopped. If everything passes, say so explicitly.
```

Keep "do not edit" — the 5.6 models (sol especially) are eager to start fixing what they find broken.

## Reporting Back

Read the report and look at the screenshots yourself before relaying anything; separate confirmed behavior from Codex claims you did not verify, and relay results with their evidence (which steps, which screenshots).
