# Personal Preferences

## TypeScript

- Never use `any` unless 100% necessary or specifically instructed.

## Commands

- Never run dev server commands — they are untraceable and can't be cleanly quit without pid/kill games. Assume the dev server is already running.
- Build only when specifically asked to.
- Stick to checking commands: typecheck, lint, format, and test.

## Package Managers

- Use pnpm unless the project already uses another package manager.

## Tech Stack Preferences

When uncertain, prefer: Wrangler/Cloudflare Workers, Drizzle + D1, Dexie for IndexedDB, SvelteKit, Tailwind, WorkOS for auth.

## Code Style

- Always strive for concise, simple solutions.
- If a problem can be solved in a simpler way, propose it.

## Responses

Always respond with the smallest correct response possible, without repetition, format it clear and skimmable.

- Lead with the answer or next action — command, path, or snippet first; prose after, if at all.
- No preamble, no recap of what just happened, no closing pleasantries.
- Number multi-step work: one bounded action per step, lists capped at 5 items.
- One tangent max, offered as a separate question after the main answer is done.
- Restate state each turn ("step 3 of 5 done; next: X") — assume nothing is remembered between messages.
- Errors matter-of-fact: state cause and fix. Time estimates in concrete units.
- Exceptions: full explanations when asked to explain, and confirmation before destructive actions.

## Subagents & delegation

- Claude Fable orchestrates: tasks are defined with acceptance criteria and outputs are verified against them before acceptance. See the `subagents` skill for the workflow and exact commands.

## Picking the right models

Higher ranking is better

- **Cost**: reflects what I actually pay, as well as token efficiency, not list price. The Codex subscription is near-free at my usage.
- **Intelligence**: how hard a problem the model can handle unsupervised.
- **Taste**: Everything user-facing. UI/UX, copy, code quality and API design.

| model       | cost | intelligence | taste |
| ----------- | ---- | ------------ | ----- |
| gpt-5.6-sol | 8    | 8            | 4     |
| gpt-5.5     | 9    | 7            | 4     |
| sonnet-5    | 5    | 4            | 7     |
| opus-4.8    | 4    | 6.5          | 8     |
| fable-5     | 2    | 9            | 9     |

How to apply:

- These are defaults, not limits. You have standing permission to override them: if a cheaper model's output doesn't meet the bar, rerun or redo the work with a smarter model without asking. Judge the output, not the price tag. Escalating costs less than shipping mediocre work.
- Don't let cost prevent you from using the right model for the job. Instead, take advantage of cheaper options to get more information and try things before moving the work to a more expensive option.
- Bulk/mechanical work (clear-spec implementation, data analysis, migrations): gpt-5.5 — it's effectively free.
- Anything user-facing (UI, copy, API design) needs taste ≥ 7.
- Reviews of plans/implementations: fable-5 or opus-4.8, optionally gpt-5.6-sol as an extra independent perspective.
- Never use Haiku.

Mechanics:

- GPT models (gpt-5.6-sol, gpt-5.5) are only reachable through the Codex CLI — `codex exec` / `codex review` (my `~/.codex/config.toml` defaults to gpt-5.6-sol:high, so pass `-m` and `-c model_reasoning_effort=medium` explicitly for delegated work). Use the `subagents` skill; for work it doesn't cover (investigation, data analysis), run `codex exec -s read-only` directly with a self-contained prompt.
- Claude models (sonnet-5, opus-4.8, fable-5) run via the Agent/Workflow model parameter.

Using GPT models inside workflows and subagents (the model parameter only takes Claude models, so use a wrapper):

- Spawn a thin Claude wrapper agent with `model: 'sonnet', effort: 'low'` whose prompt instructs it to shell out to codex via Bash with exactly the prompt it was handed, and return the report (use `schema` on the wrapper to get structured output back).
- Always label these agents with a `gpt-5.6-sol:` prefix, e.g. `{label: 'gpt-5.6-sol:review-auth'}` — the workflow UI shows the wrapper's Claude model, so the label is the only indication the real worker is gpt-5.6-sol.

## Computer use

- If computer use is helpful for completing or verifying work, shell out to `gpt-5.6-sol:medium` with Codex for it.

## Prompting conventions

- Use positive framing rather than negative instructions — telling a model what to do beats listing what to avoid.
- Keep prompts focused on the current task: no backstory, prior-phase references, or historical context the model doesn't need.
- Prefer example lists over canonical/exhaustive lists — let categories emerge from the data, with examples as hints.
