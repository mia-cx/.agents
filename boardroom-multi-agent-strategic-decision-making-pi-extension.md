# Boardroom — Multi-Agent Strategic Decision-Making Pi Extension

## Context

We manage a `.agents` repository (`/Users/mia/.agents`) containing 30 agent definitions organized by domain (executive-board, engineering, review-and-qa, customer-service, meta), plus skills and rules for AI agent workflows. The executive board already has 8 well-defined agents (CEO, CTO, CFO, CPO, VP Eng, VP Design, Head of QA, Orchestrator) with structured system prompts and output formats.

The problem: these agents can only be invoked one at a time via Claude Code's Agent tool. There's no way to run a structured multi-agent debate where the CEO orchestrates board members, agents see each other's positions, and the system enforces time/budget constraints. IndyDevDan's "CEO & Board" pattern (https://youtu.be/TqjmTZRL31E) demonstrates that a customized Pi agent harness can achieve this — spawning isolated subprocess agents that debate in parallel rounds, with persistent expertise accumulation.

The goal: build a Pi extension that turns our existing executive-board agent definitions into a live boardroom meeting system. Brief in → deliberation → memo out.

---

## Problem Statement

Strategic decisions require multiple specialized perspectives debated against each other — not just sequential Q&A. Currently, invoking executive agents individually through Claude Code produces siloed assessments with no cross-agent awareness, no adversarial debate, and no constraint enforcement. There is no mechanism for a CEO agent to dynamically select which specialists to consult, iterate on disagreements, or produce a synthesized decision under time/budget pressure.

## Solution

A Pi coding agent extension (`boardroom`) that orchestrates multi-agent board meetings. The user submits a structured brief, the CEO agent frames the decision and selects which board members to convene, those members debate in parallel subprocess rounds, and the CEO synthesizes a final memo. Two meeting modes: **structured** (follows the existing 6-phase orchestrator workflow) and **freeform** (open debate rounds until constraints hit). All conversations are logged, expertise persists across meetings, and time/budget constraints are enforced by the harness.

## User Stories

1. As an engineer, I want to submit a brief and get a strategic decision memo, so that I can make high-leverage decisions with multi-perspective intelligence
2. As an engineer, I want the CEO to dynamically pick which board members to involve, so that I don't waste budget on irrelevant perspectives
3. As an engineer, I want to choose between structured (6-phase) and freeform (debate rounds) meeting modes, so that I can match the deliberation style to the decision type
4. As an engineer, I want board members to see each other's positions, so that they can challenge weak arguments and surface tensions
5. As an engineer, I want time and budget constraints enforced by the harness, so that meetings don't run away
6. As an engineer, I want a full debate transcript saved alongside the memo, so that I can review the reasoning behind the decision
7. As an engineer, I want agents to accumulate expertise across meetings, so that recurring topics benefit from prior context
8. As an engineer, I want soft warnings (not rejections) when my brief is missing sections, so that I can still run a meeting with incomplete input
9. As an engineer, I want to see real-time status (phase, cost, time) during a meeting, so that I know what's happening
10. As an engineer, I want to force-close a meeting early, so that I can get a decision with available data if time is critical
11. As an engineer, I want the extension to reuse my existing `agents/executive-board/*.md` definitions, so that there's a single source of truth for agent prompts
12. As an engineer, I want per-brief overrides for mode/budget/time, so that high-stakes decisions get more resources
13. As an engineer, I want the meeting flow to be observable — debate logs, per-agent cost, which agents were convened and why
14. As an engineer, I want to list past meetings and their dispositions, so that I can track decision history

## Implementation Decisions

### Architecture

- **Pi extension** at `.pi/extensions/boardroom/` (TypeScript, ~10 modules)
- **Subprocess isolation**: each agent runs as `pi --mode json -p --no-session --append-system-prompt <prompt> --model <model> <task>` — same pattern as Pi's built-in subagent example
- **Hybrid agent loading**: read `agents/executive-board/*.md` at runtime for base system prompts + frontmatter; overlay meeting-specific context (conversation history, expertise, phase instructions) via `prompt-composer.ts`
- **Config**: `boardroom/config.yaml` (YAML, loaded with `js-yaml`)
- **Artifacts**: `boardroom/memos/`, `boardroom/debates/`, `boardroom/expertise/`
- **Conversation log**: `boardroom/debates/<timestamp>-<slug>.json` — structured JSON log alongside the markdown summary. Each entry tracks `from` (speaker), `to` (addressee agent names), `in_response_to` (entry ID being replied to), `phase`, `round`, `timestamp`, `content`, and `token_count`. Enables programmatic quality review of meeting dynamics and data-driven prompt enhancement for board members

### File Structure

```
.pi/extensions/boardroom/
├── index.ts              # Entry point — registers /board-meeting, /board-status, /board-close, /board-list commands + board_meeting tool
├── types.ts              # Shared interfaces (MeetingState, TranscriptEntry, AgentConfig, etc.)
├── config.ts             # YAML config loading with defaults
├── agents.ts             # Agent discovery from agents/executive-board/*.md (adapts subagent example pattern)
├── brief-parser.ts       # Parse brief markdown, validate required sections with soft warnings
├── constraints.ts        # Budget/time tracker — checkBudget(), checkTime(), canSpawn()
├── runner.ts             # Subprocess spawning (port of subagent's runSingleAgent)
├── prompt-composer.ts    # Build composite prompts: base agent + meeting overlay
├── conversation.ts       # Transcript accumulation + context compression for downstream agents
├── meeting.ts            # Meeting state machine — orchestrates freeform and structured modes
├── artifacts.ts          # Write memos, debate logs, expertise files
└── package.json          # js-yaml dependency
```

### Meeting Modes

**Freeform**: CEO frames → picks roster → board debates in parallel → CEO reviews → iterate or close → memo
**Structured**: Phase 0 (intake) → Phase 1 (framing) → Phase 2 (parallel eval) → Phase 3 (stress test) → Phase 4 (conflict synthesis) → Phase 5 (CEO decision) → Phase 6 (close)

### CEO Roster Selection

During framing, the CEO outputs a JSON block naming which board members to convene with rationale. The extension parses this and confirms with the user via `ctx.ui.confirm()`. If JSON parse fails, falls back to full board.

### Constraint Presets

The config defines named presets that bundle budget, time, and round limits. Briefs can reference a preset by name, or override individual values.

```yaml
presets:
  quick:          # Fast triage, low-stakes decisions
    budget: 5
    time_limit_minutes: 5
    max_debate_rounds: 1
  standard:       # Day-to-day product/technical decisions
    budget: 15
    time_limit_minutes: 15
    max_debate_rounds: 3
  thorough:       # Important strategic decisions (default)
    budget: 50
    time_limit_minutes: 30
    max_debate_rounds: 5
  deep-dive:      # High-stakes, career/company-defining decisions
    budget: 150
    time_limit_minutes: 60
    max_debate_rounds: 10
```

Briefs select a preset via frontmatter: `preset: thorough` (or omit to use the config's `default_preset`). Individual fields can still be overridden: `preset: standard` + `budget: 25` uses standard's time/rounds but raises the budget.

The `/board-meeting` command shows the active preset name + values in the confirmation dialog. Users can also pass a preset inline: `/board-meeting --preset quick`.

### Constraint Enforcement

- Budget and time tracked by `ConstraintTracker` state machine
- Warn at 80% threshold via `ctx.ui.setStatus()`
- Budget hard-stop (configurable, default on) triggers early close — CEO gets one final synthesis turn
- Time hard-stop (configurable, default off) — warns but allows overrun
- Max rounds from preset (hard safety cap at 10 regardless)
- Max 2 CEO re-engagement loops for structured mode

### Conversation Log Format

Each meeting produces a structured JSON log at `boardroom/debates/<timestamp>-<slug>.json`:

```json
{
  "meeting_id": "2026-03-23T14-30-00-platform-migration",
  "brief": "boardroom/briefs/platform-migration.md",
  "mode": "structured",
  "preset": "thorough",
  "roster": ["ceo", "cto", "cfo", "vp-engineering"],
  "started_at": "2026-03-23T14:30:00Z",
  "ended_at": "2026-03-23T14:47:12Z",
  "disposition": "completed",
  "total_cost": 12.34,
  "entries": [
    {
      "id": "e001",
      "from": "ceo",
      "to": ["cto", "cfo", "vp-engineering"],
      "in_response_to": null,
      "phase": 1,
      "round": 1,
      "timestamp": "2026-03-23T14:31:02Z",
      "role": "framing",
      "content": "...",
      "token_count": 842,
      "cost": 0.03
    },
    {
      "id": "e002",
      "from": "cto",
      "to": ["ceo"],
      "in_response_to": "e001",
      "phase": 2,
      "round": 1,
      "timestamp": "2026-03-23T14:32:15Z",
      "role": "assessment",
      "content": "...",
      "token_count": 1204,
      "cost": 0.05
    }
  ]
}
```

The `to` field is populated by the harness based on meeting phase semantics:
- **Framing** (CEO → all roster members): `to` = full roster
- **Parallel assessment** (member → CEO): `to` = `["ceo"]`
- **Stress test / rebuttal** (member → specific members): `to` = agents whose positions are being challenged (parsed from the agent's output when it names other agents, falls back to `["ceo"]`)
- **Synthesis** (CEO → all): `to` = full roster

The markdown debate log (`boardroom/debates/<timestamp>-<slug>.md`) is rendered from this JSON for human reading. The JSON is the source of truth.

### Prompt Composition

Each subprocess receives: base system prompt (from .md file) + meeting overlay containing:
- The brief content
- CEO's framing (if past Phase 0)
- Prior assessments from other agents (compressed for non-CEO, full for CEO)
- Agent's accumulated expertise (last 3 meetings)
- Budget/time remaining awareness
- Phase-specific task instructions
- Instruction to name the agent(s) being addressed when responding to specific positions (enables addressee extraction for conversation log)

### Error Handling

- Non-CEO agent failure: meeting continues without that input, CEO is notified
- CEO failure: one retry with simplified context, then partial memo with failure notice
- User abort (Ctrl+C): SIGTERM → SIGKILL, partial debate log saved
- Off-script output: no hard-fail, CEO handles messy input
- Config missing: hardcoded defaults
- Brief not found: immediate error with list of available briefs

## Testing Decisions

### What makes a good test
Tests should verify the meeting orchestration flow end-to-end, not internal implementation. Test that briefs are parsed correctly, configs load with proper defaults, prompts are composed with all required sections, and artifacts are written in the expected format.

### Modules to test
- **brief-parser.ts**: Parse valid/invalid briefs, verify soft warnings for missing sections
- **config.ts**: Load YAML with overrides, verify defaults for missing fields
- **prompt-composer.ts**: Verify composed prompts contain base prompt + meeting overlay + expertise
- **constraints.ts**: Budget/time state transitions (ok → warn → exceeded)
- **conversation.ts**: Transcript compression, summary generation, addressee extraction from agent output
- **artifacts.ts**: Verify memo/debate/expertise file format and path naming; verify JSON conversation log schema and entry relationships

### Testing approach
- Unit tests for pure-function modules (brief-parser, config, constraints, prompt-composer)
- Integration test: mock `runner.ts` subprocess spawning, run full meeting flow through `meeting.ts`, verify artifact output
- Pi's test setup uses `vitest` (see `.references/pi-coding-agent/vitest.config.ts`)

## Out of Scope

- Claude Code compatibility (Pi extension only — no parallel skill)
- Audio/TTS output (IndyDevDan's 11Labs integration — nice-to-have for later)
- SVG visualization generation by agents
- Real-time streaming of agent output during meetings (subprocesses run to completion, status updates are phase-level)
- Cross-vendor model diversity within a single meeting (all agents use their `model` frontmatter field; mixing Claude/GPT/Kimi within one meeting is theoretically supported by model field but not tested)
- Web UI or dashboard for meetings

## Further Notes

- The extension should be hot-reloadable via Pi's `/reload` command since it lives in `.pi/extensions/`
- Brief template at `boardroom/briefs/_template.md` should be created as part of the extension setup
- `boardroom/expertise/` files accumulate over time — they should be committed to git so expertise persists across machines
- Default preset is `thorough` ($50 / 30 min / 5 rounds). Four presets ship out of the box: `quick` ($5/5min/1 round), `standard` ($15/15min/3 rounds), `thorough` ($50/30min/5 rounds), `deep-dive` ($150/60min/10 rounds). Users can define custom presets in config.yaml
- The `model` field in agent frontmatter uses `provider:effort` format (e.g. `claude-opus-4-6:high`) which needs to be parsed into Pi's `--model` flag format

### Key Reference Files
- `.references/pi-coding-agent/packages/coding-agent/examples/extensions/subagent/index.ts` — subprocess spawning, JSON parsing, parallel execution
- `.references/pi-coding-agent/packages/coding-agent/examples/extensions/subagent/agents.ts` — agent discovery with `parseFrontmatter`
- `.references/pi-coding-agent/packages/coding-agent/docs/extensions.md` — full Extension API
- `agents/executive-board/orchestrator.md` — 6-phase structured workflow to implement
- `agents/executive-board/ceo.md` — CEO output format (Strategic Brief)

### Verification

1. Install extension: symlink or place in `.pi/extensions/boardroom/`
2. Create a test brief in `boardroom/briefs/test-brief.md`
3. Run `pi` in the `.agents` repo, type `/board-meeting`
4. Verify: brief selection UI appears, CEO frames and picks roster, user confirms roster, board members respond in parallel, CEO iterates or closes, memo + debate log written to `boardroom/memos/` and `boardroom/debates/`
5. Check `boardroom/expertise/` for accumulated agent learnings
6. Run a second meeting to verify expertise is loaded and referenced
7. Test constraint enforcement: set budget to $1 in config, verify early close triggers
8. Test `/board-status`, `/board-close`, `/board-list` commands
