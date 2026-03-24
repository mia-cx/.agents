---
name: Boardroom Messaging Model
overview: "Phased implementation plan for PRD #31, introducing explicit routed messaging, thread/workstream state, semi-live round execution, and richer boardroom UI across both meeting modes. The plan mirrors the approved slice issues so each phase remains independently demoable."
todos:
  - id: phase-1
    content: Implement freeform shared-thread messaging skeleton
    status: pending
  - id: phase-2
    content: Add directed routing and focused agent context
    status: pending
  - id: phase-3
    content: Introduce semi-live freeform queue with CEO checkpoints
    status: pending
  - id: phase-4
    content: Add child threads, resolution state, and message inspector
    status: pending
  - id: phase-5
    content: Bring explicit messaging to structured mode
    status: pending
  - id: phase-6
    content: Build live thread graph and review with user
    status: pending
  - id: phase-7
    content: Harden failure recovery and partial artifacts
    status: pending
isProject: false
---

# Plan: Boardroom Messaging Model

> Source PRD: GitHub issue `#31`
> Related slices: `#32` through `#38`

## Architectural Decisions

- **Implementation workspace**: reserve `./.worktrees/boardroom-messaging-model` on branch `feat/boardroom-messaging-model` before coding starts.
- **Canonical protocol**: replace inferred addressee semantics with an explicit messaging protocol that is authoritative for delivery, visibility, and artifact rendering.
- **Core schema**: model the debate as hybrid thread/workstream state, where named workstreams contain directed reply trees and support broadcast, direct delivery, CEO-only delivery, request-for-reply, and explicit reply linkage.
- **Moderator model**: keep the CEO as a light moderator. The CEO may redirect, checkpoint, close, or spawn workstreams, but agents can debate directly during an active round.
- **Execution model**: use semi-live intra-round queue processing with explicit checkpoints. Rounds end on time cap, quiet-thread detection, or CEO moderation checkpoint.
- **Constraint policy**: count routed message turns explicitly against budget/time accounting; do not hide richer debate behind free internal traffic.
- **Context projection**: each agent should primarily see relevant threads and inbox state, plus a CEO-authored summary of the rest of the room.
- **UI shape**: evolve the boardroom UI into three surfaces: roster/inbox state, explicit thread navigation and inspection, and a right-side live graph of branching and convergence.
- **Artifact strategy**: persist explicit thread, routing, and resolution state into meeting artifacts so memo generation and post-meeting review are grounded in the same source of truth.
- **Mode parity**: the messaging model must land in both freeform and structured meetings rather than becoming a freeform-only side path.

---

## Phase 1: Freeform Shared-Thread Skeleton

**User stories**: 1, 2, 7, 8, 16, 19

### What to build

Introduce the first authoritative thread/workstream slice in freeform meetings. The CEO opens a primary workstream, board members emit structured broadcast and reply messages into it, and the active meeting plus stored artifacts reflect the thread model directly instead of inferring recipients from freeform text.

### Acceptance criteria

- [ ] A freeform meeting can run through at least one CEO-created workstream using explicit message routing semantics.
- [ ] The active meeting shows a basic thread list driven by the new message/thread state.
- [ ] Debate artifacts preserve thread identity and routing as source-of-truth.

---

## Phase 2: Directed Routing And Focused Context

**User stories**: 3, 4, 5, 6, 15, 17, 18

### What to build

Add directed delivery semantics on top of the freeform skeleton: direct-to-one, direct-to-many, CEO-only, and request-for-reply. Update agent context projection so each participant sees relevant threads and inbox state plus a CEO summary of the rest, and expose inbox/outbox and thread participation indicators in the roster.

### Acceptance criteria

- [ ] The runtime supports direct delivery, CEO-only delivery, and request-for-reply behavior.
- [ ] Agent context stays focused to relevant threads plus CEO summary context.
- [ ] The roster UI shows inbox/outbox counts and current thread participation.

---

## Phase 3: Semi-Live Queue With CEO Checkpoints

**User stories**: 10, 11, 12, 13, 14, 22

### What to build

Replace the current batch freeform debate pass with a semi-live intra-round queue. Agents can exchange messages within a round, but rounds remain bounded by time cap, quiet-thread detection, or CEO checkpointing. The CEO may intervene mid-round only through moderation actions, and every message turn counts toward meeting constraints.

### Acceptance criteria

- [ ] Freeform meetings use an intra-round queue rather than a single batch assessment pass.
- [ ] Rounds end on quiet-thread detection, time cap, or CEO checkpoint.
- [ ] Message traffic is reflected in meeting constraint accounting.

---

## Phase 4: Child Threads, Resolution, And Inspection

**User stories**: 9, 19, 20, 25, 26, 27

### What to build

Extend the workstream model to support limited child-thread creation under CEO-defined threads, automatic and explicit resolution signals, and a message/thread inspector in the UI. Ensure the final memo and meeting artifacts explain which threads mattered and how they resolved.

### Acceptance criteria

- [ ] Agents can spawn limited child threads beneath CEO workstreams.
- [ ] Threads carry explicit resolution state plus automatic resolution heuristics.
- [ ] The UI exposes thread/message inspection, and the final memo summarizes important thread outcomes.

---

## Phase 5: Structured-Mode Messaging Parity

**User stories**: 24, plus the structured-mode side of 1, 8, 10, 16, 25, 27

### What to build

Bring the same explicit messaging, checkpoint, and resolution semantics into structured meetings so both modes share a consistent debate model. Structured phases should layer on top of the message-driven runtime instead of maintaining a separate fan-out/fan-in debate path.

### Acceptance criteria

- [ ] Structured meetings use the explicit messaging model rather than the prior batch debate pattern.
- [ ] Structured phases honor the same routing, checkpoint, and resolution semantics already proven in freeform mode.
- [ ] Users can switch modes without losing the new messaging behavior.

---

## Phase 6: Live Thread Graph Visualization

**User stories**: 18, 19, 20, 21

### What to build

Add the right-side branch-style graph that visualizes active and resolved workstreams, reply branching, and convergence. This is the planned HITL checkpoint: once the first complete graph experience is wired to real meeting data, pause for UX review before further polish.

### Acceptance criteria

- [ ] The meeting UI renders a live graph of active and resolved threads using real meeting data.
- [ ] The graph makes branching, convergence, and current activity legible during a run.
- [ ] The phase is demoable and ready for explicit human UX review.

---

## Phase 7: Failure Recovery And Partial Artifacts

**User stories**: 16, 22, 23, 27

### What to build

Harden the messaging model against dropped replies, agent failures, force-close, and abort paths. Preserve the best available thread state in logs, memo artifacts, and UI so richer debate does not regress resilience.

### Acceptance criteria

- [ ] Agent failures and dropped replies do not corrupt message/thread state or crash meetings unnecessarily.
- [ ] Force-close and abort paths preserve partial thread state in artifacts.
- [ ] Partial or failed messaging-heavy meetings remain intelligible in both UI and saved outputs.
