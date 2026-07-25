# Personal Preferences

@~/.agents/SYSTEM.md

## Subagents & delegation

- Claude Opus 5 orchestrates: tasks are defined with acceptance criteria and outputs are verified against them before acceptance. See the `codex-subagents` skill for the workflow and exact commands.

## Picking the right models

Higher ranking is better

- **Cost**: what a task actually costs me, not per-token list price — a low token price means nothing when the model burns millions of tokens per request (why sonnet-5 ranks low despite cheap tokens). Scores follow Artificial Analysis cost-per-task at the effort we run; the near-free Codex subscription lifts GPT models into the top band.
- **Intelligence**: how hard a problem the model can handle unsupervised. Rescaled 0–10 from Artificial Analysis max-reasoning-effort scores — the model's ceiling. Still always run at high reasoning effort (token efficiency); bridge the gap to the ceiling with tools, skills, and prompt engineering.
- **Taste**: Everything user-facing. UI/UX, copy, code quality and API design.

| model         | cost | intelligence | taste |
| ------------- | ---- | ------------ | ----- |
| opus-5        | 5    | 10           | 9     |
| fable-5       | 2    | 9.7          | 9     |
| gpt-5.6-sol   | 9    | 9.4          | 4     |
| opus-4.8      | 4.5  | 8            | 8     |
| gpt-5.6-terra | 9.5  | 7.5          | 4     |
| gpt-5.5       | 8.5  | 7            | 4     |
| sonnet-5      | 5.5  | 6.5          | 7     |
| gpt-5.6-luna  | 10   | 5.5          | 3     |
| sonnet-4.6    | 6.5  | 3.5          | 7.5   |

How to apply:

- These are defaults, not limits. You have standing permission to override them: if a cheaper model's output doesn't meet the bar, rerun or redo the work with a smarter model without asking. Judge the output, not the price tag. Escalating costs less than shipping mediocre work.
- Don't let cost prevent you from using the right model for the job. Instead, take advantage of cheaper options to get more information and try things before moving the work to a more expensive option.
- Bulk/mechanical work (clear-spec implementation, data analysis, migrations): gpt-5.5 — it's effectively free.
- Anything user-facing (UI, copy, API design) needs taste ≥ 7.
- Reviews of plans/implementations: opus-5 or opus-4.8, optionally gpt-5.6-sol as an extra independent perspective.
- Never use Haiku.

Mechanics:

- GPT models (gpt-5.6-sol, gpt-5.5) are only reachable through the Codex CLI — `codex exec` / `codex review` (my `~/.codex/config.toml` defaults to gpt-5.6-sol:high, so pass `-m` and `-c model_reasoning_effort=medium` explicitly for delegated work). Use the `codex-subagents` skill; for work it doesn't cover (investigation, data analysis), run `codex exec -s read-only` directly with a self-contained prompt.
- Claude models (sonnet-5, opus-5, opus-4.8, fable-5) run via the Agent/Workflow model parameter.

Using GPT models inside workflows and subagents (the model parameter only takes Claude models, so use a wrapper):

- Spawn a thin Claude wrapper agent with `model: 'sonnet', effort: 'low'` whose prompt instructs it to shell out to codex via Bash with exactly the prompt it was handed, and return the report (use `schema` on the wrapper to get structured output back).
- Always label these agents with a `gpt-5.6-sol:` prefix, e.g. `{label: 'gpt-5.6-sol:review-auth'}` — the workflow UI shows the wrapper's Claude model, so the label is the only indication the real worker is gpt-5.6-sol.
- Codex runs can exceed Bash's 10-minute timeout: pass an explicit timeout, or run in the background and poll for the report file.
- Parallel gpt-5.6-sol implementation agents must use `isolation: 'worktree'` so codex edits don't collide in the shared checkout.
- Workflow token budgets only count Claude tokens; codex work is free and invisible to `budget.spent()`.

## Computer use

- If computer use is helpful for completing or verifying work, shell out to `gpt-5.6-sol:medium` with Codex for it.
