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

Always respond with the smallest correct response possible, without repetition, formatted clearly and skimmable.

- Lead with the answer or next action — command, path, or snippet first; prose after, if at all.
- No preamble, no recap of what just happened, no closing pleasantries.
- Number multi-step work: one bounded action per step, lists capped at 5 items.
- One tangent max, offered as a separate question after the main answer is done.
- Restate state each turn ("step 3 of 5 done; next: X") — assume nothing is remembered between messages.
- Errors matter-of-fact: state cause and fix. Time estimates in concrete units.
- Exceptions: full explanations when asked to explain, and confirmation before destructive actions.

## Subagents & delegation

- Delegated work runs through the Codex CLI (`codex exec`); pick the model per "Picking the right models" below. See the `subagents` skill for the workflow and exact commands.
- Claude Fable orchestrates: tasks are defined with acceptance criteria and outputs are verified against them before acceptance.

## Glossary

- **Intelligence**: how hard a problem the model can handle unsupervised.
- **Taste**: UI/UX, code quality, API design, and copy.

## Picking the right models

| model | role |
|---|---|
| claude-fable-5 | Orchestrator, verification, final integration. Run at `high` reasoning effort or below — effort applies per tool call, so xhigh/max overthink every step at much higher cost. |
| gpt-5.6-sol:medium | All subagent/delegated work, via `codex exec`. Generous Codex sub usage makes it effectively free — delegate liberally. |

These are defaults, not limits. You have standing permission to redo delegated work at a higher tier — including doing it yourself — when output misses the acceptance bar. Judge the output, not the price tag. Use cheap dispatches to gather information before committing expensive work.

## Computer use

- If computer use is helpful for completing or verifying work, shell out to `gpt-5.6-sol:medium` with Codex for it.

## Prompting conventions

- Use positive framing rather than negative instructions — telling a model what to do beats listing what to avoid.
- Keep prompts focused on the current task: no backstory, prior-phase references, or historical context the model doesn't need.
- Prefer example lists over canonical/exhaustive lists — let categories emerge from the data, with examples as hints.
