# Personal Preferences

## Subagents & delegation

- All subagents run via the Codex CLI with `gpt-5.6-sol:medium`. No Claude subagents (the sole exception is the Sonnet workflow-wrapper pattern in the `subagents` skill).
- Claude Fable orchestrates: tasks are defined with acceptance criteria and outputs are verified against them before acceptance. See the `subagents` skill for the workflow and exact commands.

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
