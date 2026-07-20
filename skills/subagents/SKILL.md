---
name: subagents
description: >-
  Dispatch subagent work to GPT models via the Codex CLI — directly for
  regular subagents, or through thin Sonnet wrapper agents inside Workflows.
  Use before spawning any subagent, launching parallel work, using the Agent
  tool, or authoring a Workflow. Model choice is covered by CLAUDE.md's
  "Picking the right models".
---

# Subagents

Two dispatch mechanisms. Model choice and when-to-escalate live in CLAUDE.md.

## Regular subagents: codex CLI

```bash
codex exec -m gpt-5.6-sol -c model_reasoning_effort=medium -s workspace-write "<task>" </dev/null
```

- **Close stdin** (`</dev/null`): piped stdin makes codex block on "reading additional input" instead of running.
- **Sandbox**: `-s workspace-write` for implementation, `-s read-only` for investigation and review.
- **Untrusted directories**: outside a trusted git repo codex exits early — add `--skip-git-repo-check` or `git init` the scratch dir.
- **Parallel**: one background Bash call per task. Parallel implementation tasks get separate worktrees so edits don't collide.
- **Follow-up to the same worker**: `codex exec resume --last -m gpt-5.6-sol -c model_reasoning_effort=medium "<feedback>" </dev/null` — preserves that worker's context.
- **Timeout**: codex runs can exceed Bash's 10-minute default — pass an explicit timeout, or run in the background and poll for a report file.

## In Workflows: Sonnet wrapper

Workflow/Agent `model` parameters only take Claude models. To use a GPT model in a workflow stage, spawn a thin Sonnet wrapper that shells out and relays:

```js
agent(
  `Run this exact command via Bash and return its output verbatim, adding no analysis:
codex exec -m gpt-5.6-sol -c model_reasoning_effort=medium -s read-only "<task>" </dev/null`,
  { model: 'sonnet', effort: 'low', label: 'gpt-5.6-sol:review-auth', schema: REPORT }
)
```

- **Label with a `gpt-5.6-sol:` prefix** — the workflow UI shows the wrapper's Claude model, so the label is the only indication of the real worker.
- **`schema` on the wrapper** gets structured output back from codex's free-text report.
- **`isolation: 'worktree'`** for parallel implementation wrappers.
- Workflow token budgets only count Claude tokens; codex work is invisible to `budget.spent()`.

## Orchestrating

1. **Decompose** — each task gets acceptance criteria: observable, checkable outcomes (files changed, tests passing, behaviors demonstrated).
2. **Dispatch** — simple, self-contained prompts. Codex is not Claude: it does only what it's told, so drop guardrail scaffolding. Review/investigation prompts end with: "If you find nothing, say so clearly and name what you inspected."
3. **Verify** — check output against the acceptance criteria yourself (read the diff, run typecheck/tests). A worker's self-report is a claim, not evidence.
4. **Iterate** — `resume` with criteria-referenced feedback, ~3 rounds; then do it yourself or surface the blocker.
5. **Integrate** — final assembly, commits, and user-facing summary stay with the orchestrator.

Skip delegation for trivial single-file lookups — dispatch only work that outweighs the overhead.

When a worker misbehaves, ask what went wrong and append the fix here.
