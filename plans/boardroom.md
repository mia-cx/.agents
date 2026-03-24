# Plan: Boardroom — Multi-Agent Strategic Decision-Making Pi Extension

> Source PRD: `boardroom-multi-agent-strategic-decision-making-pi-extension.md` ([GitHub #1](https://github.com/mia-cx/.agents/issues/1))

## Architectural decisions

Durable decisions that apply across all phases:

- **Extension location**: `.pi/extensions/boardroom/` — hot-reloadable via Pi's `/reload`
- **Subprocess model**: Each agent runs as `pi --mode json -p --no-session --append-system-prompt <prompt> --model <model> <task>` — isolated processes, no shared memory
- **Agent source of truth**: `agents/executive-board/*.md` — YAML frontmatter (`name`, `description`, `model`, `model_alt`, `tools`) + Markdown body (system prompt)
- **Model format**: Frontmatter `model` field uses `provider:effort` format (e.g. `claude-opus-4-6:high`) parsed into Pi's `--model` flag
- **Config**: `boardroom/config.yaml` loaded with `js-yaml`, hardcoded defaults for all fields
- **Presets**: Four named constraint bundles — `quick` ($5/5min/1 round), `standard` ($15/15min/3 rounds), `thorough` ($50/30min/5 rounds, default), `deep-dive` ($150/60min/10 rounds). Hard safety cap: 10 rounds
- **Artifact paths**: `boardroom/memos/<timestamp>-<slug>.md`, `boardroom/debates/<timestamp>-<slug>.json` (source of truth) + `.md` (rendered from JSON), `boardroom/expertise/<agent-name>.md`
- **Conversation log**: JSON directed conversation graph — each entry has `from`, `to` (addressees), `in_response_to` (entry ID), `phase`, `round`, `role`, `content`, `token_count`, `cost`. Addressees populated by phase semantics + name extraction from agent output. Enables quality review and prompt enhancement
- **Meeting modes**: `freeform` (CEO-driven debate rounds) and `structured` (6-phase orchestrator workflow)
- **Commands**: `/board-meeting`, `/board-status`, `/board-close`, `/board-list` + `board_meeting` tool
- **Testing**: Vitest, unit tests for pure-function modules, integration test with mocked subprocess runner

---

## Phase 1: Scaffold + Single-Agent Tracer Bullet

**User stories**: 1 (narrow path), 11

**GitHub issue**: #2

### What to build

Wire the thinnest possible end-to-end path: user submits a brief, the CEO agent responds via subprocess, and a memo is written to disk. This establishes every module in the extension (even if most are minimal stubs) and proves the subprocess spawning pattern works with real executive-board agent definitions.

Covers: extension registration (`index.ts` with `/board-meeting` command), shared types (`types.ts`), YAML config loading with defaults (`config.ts` + `config.yaml`), agent discovery from `agents/executive-board/*.md` (`agents.ts`), brief parsing with section validation and soft warnings (`brief-parser.ts`), subprocess spawning adapted from the Pi subagent example (`runner.ts`), minimal prompt composition (`prompt-composer.ts`), CEO-only freeform meeting path (`meeting.ts`), memo output (`artifacts.ts`), brief template (`boardroom/briefs/_template.md`), and `package.json` with `js-yaml`.

### Acceptance criteria

- [ ] Extension loads via Pi's `/reload` and registers `/board-meeting`
- [ ] `config.yaml` loads with four preset definitions and sensible defaults
- [ ] `agents.ts` discovers all `agents/executive-board/*.md` and parses frontmatter
- [ ] `/board-meeting` presents brief selection, parses the brief, shows soft warnings for missing sections
- [ ] CEO agent spawned as subprocess with brief content in prompt
- [ ] CEO's response written as memo to `boardroom/memos/<timestamp>-<slug>.md`
- [ ] Brief template exists at `boardroom/briefs/_template.md`
- [ ] Unit tests pass for `brief-parser`, `config`, and `prompt-composer`

---

## Phase 2: Multi-Agent Parallel Debate

**User stories**: 2, 4

**GitHub issue**: #3

### What to build

Upgrade from single-agent to multi-agent. The CEO frames the decision and outputs a JSON block naming which board members to convene (with per-member rationale). The extension parses this JSON, confirms the roster with the user, spawns selected agents in parallel, collects their assessments, and feeds everything back to the CEO for synthesis.

This is the core mechanic that makes the boardroom more than sequential Q&A — agents respond to the same framing in parallel, and the CEO sees all positions before deciding.

### Acceptance criteria

- [ ] CEO's framing includes parseable roster JSON with per-member rationale
- [ ] Roster confirmation dialog shown to user
- [ ] JSON parse failure falls back to full board
- [ ] Selected board members spawned in parallel (not sequential)
- [ ] Each board member's prompt includes brief + CEO framing
- [ ] CEO receives all assessments and produces synthesized memo
- [ ] Works correctly with 1, 3, and 6+ board members

---

## Phase 3: Constraint Enforcement + Presets

**User stories**: 5, 12

**GitHub issue**: #4

### What to build

Add resource constraints so meetings don't run away. `ConstraintTracker` state machine (ok → warn → exceeded) for budget and time. Four named presets in config. Briefs select preset via frontmatter and can override individual fields. Budget hard-stop triggers CEO final synthesis. Time soft-stop warns but allows overrun. 80% threshold warnings via status.

### Acceptance criteria

- [ ] `ConstraintTracker` transitions correctly through ok → warn → exceeded
- [ ] Four presets with correct values; `thorough` is default
- [ ] Brief frontmatter `preset:` and individual overrides work
- [ ] `/board-meeting --preset quick` applies preset
- [ ] 80% threshold triggers warning
- [ ] Budget exceeded triggers early close with CEO final synthesis
- [ ] Time exceeded warns but does not hard-stop (default)
- [ ] Hard cap at 10 rounds regardless of config
- [ ] Unit tests for state transitions and preset resolution

---

## Phase 4: Structured Meeting Mode (6-Phase Workflow)

**User stories**: 3

**GitHub issue**: #5

### What to build

Implement the structured meeting path following the 6-phase workflow from `agents/executive-board/orchestrator.md`: intake → framing → parallel eval → stress test → conflict synthesis → CEO decision → close. Mode selection via `--mode structured` or brief frontmatter. Max 2 CEO re-engagement loops before forced progression to Phase 5. Constraint enforcement applies (early close skips remaining phases).

### Acceptance criteria

- [ ] `--mode structured` and frontmatter `mode: structured` both work
- [ ] All 6 phases complete in sequence (no skipping)
- [ ] Phase 2 uses parallel debate mechanics from Phase 2 of this plan
- [ ] Phase-specific task instructions in each agent's prompt
- [ ] CEO can re-engage board up to 2 times; third attempt blocked
- [ ] Constraint enforcement triggers early close through remaining phases
- [ ] Final memo indicates which phases produced key insights

---

## Phase 5: Conversation Log + Expertise Persistence

**User stories**: 6, 7, 13

**GitHub issue**: #6

### What to build

Structured JSON conversation logging and cross-meeting expertise accumulation. The core artifact is a JSON conversation log (`boardroom/debates/<timestamp>-<slug>.json`) that captures the full meeting as a directed conversation graph. Every entry tracks speaker (`from`), addressee(s) (`to`), which prior entry is being responded to (`in_response_to`), phase, round, role, content, token count, and cost.

Addressee tracking is populated by the harness based on phase semantics (framing → all roster, assessment → CEO, stress test → agents whose positions are challenged). During rebuttal phases, agents are prompted to name who they're addressing; `conversation.ts` extracts names from output (falls back to `["ceo"]`).

The markdown debate log is rendered from the JSON — JSON is the source of truth. Transcript compression for downstream agents preserves conversation structure (who said what to whom). CEO always receives full transcripts. Per-agent expertise extracted after each meeting and loaded into prompt composition for subsequent meetings (last 3).

This structured format enables programmatic quality review of meeting dynamics and data-driven prompt enhancement for board members.

### Acceptance criteria

- [ ] JSON conversation log written to `boardroom/debates/<timestamp>-<slug>.json` with full schema
- [ ] Every entry includes `id`, `from`, `to`, `in_response_to`, `phase`, `round`, `timestamp`, `role`, `content`, `token_count`, `cost`
- [ ] `to` field correctly populated per phase semantics; addressee extraction from agent output with fallback
- [ ] `in_response_to` links entries to prior entry being responded to
- [ ] Markdown debate log rendered from JSON (not independently generated)
- [ ] Non-CEO agents get compressed summaries preserving conversation structure
- [ ] CEO gets full transcripts
- [ ] Per-agent expertise files written after each meeting
- [ ] Last 3 meetings' expertise loaded into prompt composition
- [ ] Second meeting demonstrably references first meeting's expertise
- [ ] Unit tests for conversation log schema, addressee extraction, compression, and expertise format

---

## Phase 6: Meeting Management Commands + Observability

**User stories**: 9, 10, 13, 14

**GitHub issue**: #7

### What to build

Three additional slash commands for meeting lifecycle management. `/board-status` shows live meeting state (phase, time, cost, per-agent breakdown). `/board-close` force-closes with CEO final synthesis from available data. `/board-list` shows meeting history with dispositions. Real-time status updates pushed via `ctx.ui.setStatus()` during phase transitions.

### Acceptance criteria

- [ ] `/board-status` displays phase, elapsed time, cost, budget remaining, per-agent cost
- [ ] `/board-close` triggers CEO final synthesis and writes partial memo
- [ ] Force-closed debates marked in debate log
- [ ] `/board-list` shows past meetings with date, title, mode, disposition, cost, participants
- [ ] Phase transitions emit real-time status updates
- [ ] Commands handle "no active meeting" gracefully

---

## Phase 7: Error Handling + Soft Validation

**User stories**: 8

**GitHub issue**: #8

### What to build

Harden every failure path. Brief soft warnings (warn, never reject). Non-CEO agent failure (meeting continues, CEO informed, failure logged). CEO failure (one retry with simplified context, then partial memo with failure notice). User abort (SIGTERM → SIGKILL, partial debate log saved). Off-script output tolerance. Config-missing defaults. Brief-not-found error with available briefs list.

### Acceptance criteria

- [ ] Incomplete briefs trigger soft warnings but meeting proceeds
- [ ] Non-CEO failure doesn't crash meeting; CEO informed; failure logged
- [ ] CEO failure triggers one retry with simplified context
- [ ] Double CEO failure produces partial memo with failure notice
- [ ] Ctrl+C saves partial debate log marked "aborted"
- [ ] Off-script output doesn't crash harness
- [ ] Missing config loads hardcoded defaults
- [ ] Missing brief returns error with available briefs list
- [ ] Integration test: mock agent failure, verify meeting completes
