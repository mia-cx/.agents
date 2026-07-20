---
name: subagents
description: >-
  Delegation policy for all subagent work. Use BEFORE spawning any subagent, launching parallel work, using the Agent tool, or authoring a Workflow — whenever work could be delegated to another agent. All delegated work runs through the Codex CLI with gpt-5.6-sol:medium; Claude Fable acts as orchestrator and verifier only.
---

# Subagents: Codex Workers, Fable Orchestrates

## Core policy

Subagent work runs through the Codex CLI; the default worker is `gpt-5.6-sol` at `medium` reasoning effort, with escalation governed by CLAUDE.md's "Picking the right models" (defaults, not limits). Claude subagents are reserved for the one wrapper pattern described under "Workflows" — every other delegation shells out to Codex:

```bash
codex exec -m gpt-5.6-sol -c model_reasoning_effort=medium -s workspace-write "<task>" </dev/null
```

- **Close stdin** (`</dev/null`): with piped stdin, codex blocks on "reading additional input" instead of running the prompt.
- **Untrusted directories**: outside a trusted git repo, codex exits early with a cwd reset — add `--skip-git-repo-check` (or `git init` the scratch dir) when dispatching outside tracked projects.
- **Parallel tasks**: launch multiple `codex exec` calls via background Bash — one per task.
- **Follow-ups to the same worker**: `codex exec resume --last -m gpt-5.6-sol -c model_reasoning_effort=medium "<feedback>" </dev/null` preserves that worker's context.
- **Read-only work** (investigation, analysis, review): use `-s read-only` instead of `workspace-write`.
- **Visibility**: prefix delegated-work labels and log lines with `gpt-5.6-sol:` so codex-backed runs are identifiable at a glance.

## Orchestrator loop

Fable's job is decomposition, dispatch, verification, and integration — not implementation of delegated tasks.

1. **Decompose** — write each task with explicit acceptance criteria: observable, checkable outcomes (files changed, tests passing, specific behaviors demonstrated).
2. **Dispatch** — one codex invocation per task. Prompts follow the AGENTS.md conventions: positive framing, no backstory or prior-phase references, current-task context only, example lists over exhaustive lists.
3. **Verify** — check the worker's output against the acceptance criteria yourself: read the diff, run the tests and typecheck. A worker's self-report is a claim, not evidence.
4. **Iterate** — on a missed criterion, re-dispatch via `resume` with specific, criteria-referenced feedback. Cap at ~3 rounds; after that, do the work directly or surface the blocker to the user.
5. **Integrate** — Fable owns final assembly, commits, and the user-facing summary.

## Prompting Codex

Codex is not Claude — prompt it simply. Self-contained, short, direct. Codex does what it is told and only what it is told, so leave out Claude-style guardrails ("do not edit files", role-play framing, elaborate context).

- Every review/investigation prompt must include: "If you find nothing, say so clearly and name what you inspected." An empty result reported explicitly prevents the orchestrator from misreading silence and re-dispatching.
- Long runs can time out — size tasks to bounded chunks rather than open-ended marathons.

## Workflows

The Workflow tool can only spawn Claude models as workflow subagents. When a workflow stage needs gpt-5.6-sol, spawn a cheap Sonnet wrapper subagent whose label is prefixed with `gpt-5.6-sol:` (so codex-backed stages are visible in the progress tree). The wrapper's entire instruction: shell out to codex via the Bash tool with exactly the prompt it was handed, then relay codex's output verbatim as its result. The wrapper adds no analysis of its own.

## When to skip delegation

Trivial single-file lookups or one-line fixes: do them inline. Delegation has real overhead — dispatch only work that outweighs it.

## Living document

This skill is seeded lean on purpose. When a worker misbehaves, ask what went wrong and what the correct structure was, then append the fix here. The best rules accrete from real failures.
