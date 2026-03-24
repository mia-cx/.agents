/**
 * Thread/workstream state manager for the boardroom messaging model.
 *
 * Manages the lifecycle of threads (create, post, resolve, close) and
 * maintains per-agent inbox/outbox state. This is the authoritative
 * source of truth for message routing and thread status.
 */

import type {
  RoutedMessage,
  MessageType,
  Thread,
  ThreadStatus,
  ThreadResolutionReason,
  ThreadState,
  AgentContextProjection,
  AgentMessageCounts,
  MessagingLog,
} from "./messaging-types.js";

let messageCounter = 0;
let threadCounter = 0;

function nextMessageId(): string {
  messageCounter++;
  return `msg-${String(messageCounter).padStart(4, "0")}`;
}

function nextThreadId(): string {
  threadCounter++;
  return `thread-${String(threadCounter).padStart(3, "0")}`;
}

export function resetCounters(): void {
  messageCounter = 0;
  threadCounter = 0;
}

// --- Thread State Factory ---

export function createThreadState(): ThreadState {
  return {
    threads: new Map(),
    messages: new Map(),
    agent_inboxes: new Map(),
    agent_outboxes: new Map(),
  };
}

// --- Thread Lifecycle ---

export function createThread(
  state: ThreadState,
  title: string,
  createdBy: string,
  parentId: string | null = null,
): Thread {
  const thread: Thread = {
    id: nextThreadId(),
    title,
    parent_id: parentId,
    created_by: createdBy,
    created_at: new Date().toISOString(),
    status: "active",
    participants: [createdBy],
    pending_replies: [],
    message_ids: [],
  };
  state.threads.set(thread.id, thread);
  return thread;
}

export function resolveThread(
  state: ThreadState,
  threadId: string,
  reason: ThreadResolutionReason,
  summary?: string,
): void {
  const thread = state.threads.get(threadId);
  if (!thread) return;

  thread.status = "resolved";
  thread.resolution_reason = reason;
  thread.resolved_at = new Date().toISOString();
  if (summary) thread.summary = summary;

  // Resolve child threads too
  for (const [, child] of state.threads) {
    if (child.parent_id === threadId && child.status === "active") {
      resolveThread(state, child.id, "parent-resolved");
    }
  }
}

export function closeThread(
  state: ThreadState,
  threadId: string,
  summary?: string,
): void {
  const thread = state.threads.get(threadId);
  if (!thread) return;

  thread.status = "closed";
  thread.resolution_reason = "explicit-close";
  thread.resolved_at = new Date().toISOString();
  if (summary) thread.summary = summary;
}

export function updateThreadStatus(state: ThreadState, threadId: string): void {
  const thread = state.threads.get(threadId);
  if (!thread || thread.status !== "active") return;

  // Auto-detect quiet threads
  if (thread.pending_replies.length === 0 && thread.message_ids.length > 0) {
    thread.status = "quiet";
  }
}

// --- Message Posting ---

export function postMessage(
  state: ThreadState,
  type: MessageType,
  from: string,
  to: string[],
  threadId: string,
  content: string,
  phase: number,
  round: number,
  tokenCount: number,
  cost: number,
  inResponseTo: string | null = null,
  metadata?: Record<string, unknown>,
): RoutedMessage {
  const thread = state.threads.get(threadId);
  if (!thread) throw new Error(`Thread ${threadId} not found`);

  const message: RoutedMessage = {
    id: nextMessageId(),
    type,
    from,
    to: type === "broadcast" ? [] : to,
    in_response_to: inResponseTo,
    thread_id: threadId,
    phase,
    round,
    timestamp: new Date().toISOString(),
    content,
    token_count: tokenCount,
    cost,
    delivery_status: "delivered",
    metadata,
  };

  state.messages.set(message.id, message);
  thread.message_ids.push(message.id);

  // Track participant
  if (!thread.participants.includes(from)) {
    thread.participants.push(from);
  }

  // Update outbox
  const outbox = state.agent_outboxes.get(from) ?? [];
  outbox.push(message.id);
  state.agent_outboxes.set(from, outbox);

  // Deliver to inboxes
  const recipients = type === "broadcast"
    ? [...thread.participants.filter(p => p !== from)]
    : to;

  for (const recipient of recipients) {
    const inbox = state.agent_inboxes.get(recipient) ?? [];
    inbox.push(message.id);
    state.agent_inboxes.set(recipient, inbox);
  }

  // Remove sender from pending replies if this is a reply
  if (inResponseTo) {
    const idx = thread.pending_replies.indexOf(from);
    if (idx !== -1) thread.pending_replies.splice(idx, 1);
  }

  // If request-reply, mark recipients as pending
  if (type === "request-reply") {
    for (const recipient of to) {
      if (!thread.pending_replies.includes(recipient)) {
        thread.pending_replies.push(recipient);
      }
    }
  }

  // Update thread status
  updateThreadStatus(state, threadId);

  return message;
}

// --- Context Projection ---

export function projectAgentContext(
  state: ThreadState,
  agentSlug: string,
  ceoSummary: string = "",
): AgentContextProjection {
  const relevantThreads: Thread[] = [];
  const relevantMessages: RoutedMessage[] = [];
  const inboxMessages: RoutedMessage[] = [];

  // Find threads this agent participates in
  for (const [, thread] of state.threads) {
    if (
      thread.participants.includes(agentSlug) ||
      thread.pending_replies.includes(agentSlug)
    ) {
      relevantThreads.push(thread);
      for (const msgId of thread.message_ids) {
        const msg = state.messages.get(msgId);
        if (msg) relevantMessages.push(msg);
      }
    }
  }

  // Build inbox
  const inboxIds = state.agent_inboxes.get(agentSlug) ?? [];
  for (const msgId of inboxIds) {
    const msg = state.messages.get(msgId);
    if (msg) inboxMessages.push(msg);
  }

  return {
    relevant_messages: relevantMessages,
    inbox: inboxMessages,
    room_summary: ceoSummary,
    active_threads: relevantThreads.filter(t => t.status === "active" || t.status === "quiet"),
  };
}

// --- Agent Message Counts (for UI) ---

export function getAgentMessageCounts(
  state: ThreadState,
  agentSlug: string,
): AgentMessageCounts {
  const inboxIds = state.agent_inboxes.get(agentSlug) ?? [];
  const outboxIds = state.agent_outboxes.get(agentSlug) ?? [];

  const threadIds = new Set<string>();
  for (const [, thread] of state.threads) {
    if (thread.participants.includes(agentSlug) && (thread.status === "active" || thread.status === "quiet")) {
      threadIds.add(thread.id);
    }
  }

  return {
    slug: agentSlug,
    inbox_unread: inboxIds.length,
    inbox_total: inboxIds.length,
    outbox_total: outboxIds.length,
    active_threads: threadIds.size,
    threads: Array.from(threadIds),
  };
}

// --- Mark Messages Read ---

export function markInboxRead(state: ThreadState, agentSlug: string): void {
  state.agent_inboxes.set(agentSlug, []);
}

// --- Quiet Thread Detection ---

export function getQuietThreads(state: ThreadState): Thread[] {
  const quiet: Thread[] = [];
  for (const [, thread] of state.threads) {
    if (thread.status === "active" && thread.pending_replies.length === 0 && thread.message_ids.length > 0) {
      quiet.push(thread);
    }
  }
  return quiet;
}

export function getActiveThreads(state: ThreadState): Thread[] {
  const active: Thread[] = [];
  for (const [, thread] of state.threads) {
    if (thread.status === "active") {
      active.push(thread);
    }
  }
  return active;
}

export function getAllThreads(state: ThreadState): Thread[] {
  return Array.from(state.threads.values());
}

export function getAllMessages(state: ThreadState): RoutedMessage[] {
  return Array.from(state.messages.values());
}

// --- Serialization for Artifacts ---

export function serializeToMessagingLog(
  state: ThreadState,
  meetingId: string,
  brief: string,
  mode: string,
  constraints: string,
  roster: string[],
  startedAt: string,
  disposition: string,
): MessagingLog {
  const messages = getAllMessages(state);
  const totalCost = messages.reduce((sum, m) => sum + m.cost, 0);

  return {
    meeting_id: meetingId,
    brief,
    mode,
    constraints,
    roster,
    started_at: startedAt,
    ended_at: new Date().toISOString(),
    disposition,
    total_cost: totalCost,
    threads: getAllThreads(state),
    messages,
  };
}

// --- Convergence Heuristic ---

/**
 * Check if a thread has converged based on message patterns.
 * A thread is considered converged when:
 * - It has at least 3 messages
 * - No pending replies remain
 * - The last N messages don't introduce new disagreements (no request-reply)
 * - At least 2 unique participants have posted
 */
export function checkThreadConvergence(state: ThreadState, threadId: string, lookbackCount = 3): boolean {
  const thread = state.threads.get(threadId);
  if (!thread) return false;
  if (thread.status !== "active" && thread.status !== "quiet") return false;
  if (thread.pending_replies.length > 0) return false;
  if (thread.message_ids.length < 3) return false;
  if (thread.participants.length < 2) return false;

  // Check last N messages for escalation signals
  const lastIds = thread.message_ids.slice(-lookbackCount);
  for (const msgId of lastIds) {
    const msg = state.messages.get(msgId);
    if (!msg) continue;
    if (msg.type === "request-reply") return false; // Still requesting data
  }

  return true;
}

/**
 * Auto-resolve converged threads.
 * Returns the list of thread IDs that were resolved.
 */
export function autoResolveConvergedThreads(state: ThreadState, lookbackCount = 3): string[] {
  const resolved: string[] = [];
  for (const [threadId, thread] of state.threads) {
    if (thread.status !== "active" && thread.status !== "quiet") continue;
    if (checkThreadConvergence(state, threadId, lookbackCount)) {
      resolveThread(state, threadId, "convergence-heuristic", "Thread converged (no pending replies, no new requests).");
      resolved.push(threadId);
    }
  }
  return resolved;
}

// --- Snapshot for Partial Artifacts ---

/**
 * Create a snapshot summary of thread state for partial artifact preservation.
 * Used when a meeting is aborted or force-closed to capture the best available state.
 */
export function snapshotThreadState(state: ThreadState): {
  threadCount: number;
  messageCount: number;
  activeThreads: number;
  resolvedThreads: number;
  participantSlugs: string[];
  lastActivity: string | null;
} {
  const threads = getAllThreads(state);
  const messages = getAllMessages(state);
  const participants = new Set<string>();
  for (const thread of threads) {
    for (const p of thread.participants) participants.add(p);
  }

  const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;

  return {
    threadCount: threads.length,
    messageCount: messages.length,
    activeThreads: threads.filter(t => t.status === "active" || t.status === "quiet").length,
    resolvedThreads: threads.filter(t => t.status === "resolved").length,
    participantSlugs: Array.from(participants),
    lastActivity: lastMsg?.timestamp ?? null,
  };
}

// --- Graceful Shutdown / Abort Helpers ---

/**
 * Resolve all active/quiet threads with a meeting-level resolution reason.
 * Used when a meeting is aborted, force-closed, or exceeds constraints.
 * Returns the count of threads resolved.
 */
export function resolveAllActiveThreads(
  state: ThreadState,
  reason: ThreadResolutionReason,
  summary?: string,
): number {
  let count = 0;
  for (const [, thread] of state.threads) {
    if (thread.status === "active" || thread.status === "quiet") {
      thread.status = "resolved";
      thread.resolution_reason = reason;
      thread.resolved_at = new Date().toISOString();
      if (summary) thread.summary = summary;
      count++;
    }
  }
  return count;
}

/**
 * Mark undeliverable messages as dropped.
 * Messages targeting resolved/closed threads that were never read
 * get their delivery_status set to "dropped".
 */
export function markUndeliverableMessages(state: ThreadState): number {
  let count = 0;
  for (const [, msg] of state.messages) {
    if (msg.delivery_status !== "delivered") continue;
    const thread = state.threads.get(msg.thread_id);
    if (thread && (thread.status === "resolved" || thread.status === "closed")) {
      // Check if any recipient still has this in their inbox
      let stillInInbox = false;
      for (const [, inbox] of state.agent_inboxes) {
        if (inbox.includes(msg.id)) {
          stillInInbox = true;
          break;
        }
      }
      if (stillInInbox) {
        msg.delivery_status = "dropped";
        count++;
      }
    }
  }
  return count;
}

/**
 * Format a human-readable recovery checkpoint for display when a
 * meeting is interrupted, aborted, or fails.
 */
export function formatRecoveryCheckpoint(state: ThreadState): string {
  const snapshot = snapshotThreadState(state);
  const lines: string[] = [];

  lines.push("── Recovery Checkpoint ──");
  lines.push(`Threads: ${snapshot.threadCount} total (${snapshot.activeThreads} active, ${snapshot.resolvedThreads} resolved)`);
  lines.push(`Messages: ${snapshot.messageCount} total`);
  lines.push(`Participants: ${snapshot.participantSlugs.join(", ") || "none"}`);
  if (snapshot.lastActivity) {
    lines.push(`Last activity: ${snapshot.lastActivity}`);
  }

  // Show unresolved threads
  const unresolved: string[] = [];
  for (const [, thread] of state.threads) {
    if (thread.status === "active" || thread.status === "quiet") {
      const pending = thread.pending_replies.length > 0
        ? ` [${thread.pending_replies.length} pending]`
        : "";
      unresolved.push(`  ○ ${thread.title} (${thread.message_ids.length} msgs)${pending}`);
    }
  }
  if (unresolved.length > 0) {
    lines.push("");
    lines.push("Unresolved threads:");
    lines.push(...unresolved);
  }

  return lines.join("\n");
}

// --- Thread Summary for Non-Participants ---

export function buildRoomSummary(
  state: ThreadState,
  excludeAgent: string,
): string {
  const parts: string[] = [];

  for (const [, thread] of state.threads) {
    if (thread.participants.includes(excludeAgent)) continue;
    if (thread.status === "closed" || thread.status === "resolved") {
      parts.push(`- [${thread.status}] "${thread.title}": ${thread.summary ?? "resolved"}`);
      continue;
    }

    const msgCount = thread.message_ids.length;
    const lastMsg = thread.message_ids.length > 0
      ? state.messages.get(thread.message_ids[thread.message_ids.length - 1])
      : null;
    const preview = lastMsg
      ? lastMsg.content.slice(0, 150) + (lastMsg.content.length > 150 ? "..." : "")
      : "";

    parts.push(
      `- [${thread.status}] "${thread.title}" (${msgCount} messages, participants: ${thread.participants.join(", ")})`
      + (preview ? `\n  Latest: ${preview}` : ""),
    );
  }

  return parts.length > 0
    ? `## Room Summary (threads you are not in)\n\n${parts.join("\n")}`
    : "";
}
