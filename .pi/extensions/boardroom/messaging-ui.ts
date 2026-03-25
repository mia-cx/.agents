/**
 * UI helpers for the messaging model.
 *
 * Provides inbox/outbox counts, thread participation indicators,
 * and thread list formatting for the roster and dashboard.
 */

import type { ThreadState, Thread, RoutedMessage } from "./messaging-types.js";
import { getAgentMessageCounts, getAllThreads, getAllMessages } from "./thread-manager.js";

// --- Roster Line with Messaging Counts ---

export interface RosterLineInfo {
  slug: string;
  name: string;
  inbox_unread: number;
  outbox_total: number;
  active_threads: number;
  thread_names: string[];
}

export function buildRosterInfo(
  state: ThreadState,
  agents: { slug: string; name: string }[],
): RosterLineInfo[] {
  return agents.map(agent => {
    const counts = getAgentMessageCounts(state, agent.slug);
    const threadNames: string[] = [];
    for (const threadId of counts.threads) {
      const thread = state.threads.get(threadId);
      if (thread) threadNames.push(thread.title);
    }
    return {
      slug: agent.slug,
      name: agent.name,
      inbox_unread: counts.inbox_unread,
      outbox_total: counts.outbox_total,
      active_threads: counts.active_threads,
      thread_names: threadNames,
    };
  });
}

// --- Format Roster Line for Display ---

export function formatRosterLine(info: RosterLineInfo): string {
  const inboxIcon = info.inbox_unread > 0 ? `📥${info.inbox_unread}` : "📥0";
  const outboxIcon = `📤${info.outbox_total}`;
  const threadIcon = info.active_threads > 0 ? `🧵${info.active_threads}` : "";
  const threadList = info.thread_names.length > 0
    ? ` [${info.thread_names.join(", ")}]`
    : "";
  return `${info.name} ${inboxIcon} ${outboxIcon} ${threadIcon}${threadList}`;
}

// --- Thread List for Display ---

export interface ThreadListEntry {
  id: string;
  title: string;
  status: string;
  statusIcon: string;
  messageCount: number;
  participantCount: number;
  participants: string[];
  pendingReplies: number;
  isChild: boolean;
  summary?: string;
}

export function buildThreadList(state: ThreadState): ThreadListEntry[] {
  const threads = getAllThreads(state);
  return threads.map(thread => ({
    id: thread.id,
    title: thread.title,
    status: thread.status,
    statusIcon: thread.status === "active" ? "●"
      : thread.status === "quiet" ? "○"
      : thread.status === "resolved" ? "✓"
      : "✗",
    messageCount: thread.message_ids.length,
    participantCount: thread.participants.length,
    participants: thread.participants,
    pendingReplies: thread.pending_replies.length,
    isChild: thread.parent_id !== null,
    summary: thread.summary,
  }));
}

export function formatThreadListLine(entry: ThreadListEntry): string {
  const indent = entry.isChild ? "  └─ " : "";
  const pending = entry.pendingReplies > 0 ? ` (${entry.pendingReplies} pending)` : "";
  return `${indent}${entry.statusIcon} ${entry.title} [${entry.messageCount} msgs, ${entry.participantCount} members]${pending}`;
}

// --- Thread Inspection (detailed single-thread view) ---

export interface ThreadInspection {
  thread: ThreadListEntry;
  messages: {
    id: string;
    from: string;
    to: string[];
    type: string;
    inResponseTo: string | null;
    content: string;
    timestamp: string;
    tokenCount: number;
    cost: number;
  }[];
  childThreads: ThreadListEntry[];
  totalCost: number;
  totalTokens: number;
}

export function inspectThread(
  state: ThreadState,
  threadId: string,
): ThreadInspection | null {
  const thread = state.threads.get(threadId);
  if (!thread) return null;

  const entry = buildThreadList(state).find(e => e.id === threadId);
  if (!entry) return null;

  const messages = thread.message_ids
    .map(id => state.messages.get(id))
    .filter((m): m is import("./messaging-types.js").RoutedMessage => m !== undefined)
    .map(m => ({
      id: m.id,
      from: m.from,
      to: m.to,
      type: m.type,
      inResponseTo: m.in_response_to,
      content: m.content,
      timestamp: m.timestamp,
      tokenCount: m.token_count,
      cost: m.cost,
    }));

  const childThreads = buildThreadList(state).filter(e =>
    state.threads.get(e.id)?.parent_id === threadId,
  );

  const totalCost = messages.reduce((sum, m) => sum + m.cost, 0);
  const totalTokens = messages.reduce((sum, m) => sum + m.tokenCount, 0);

  return { thread: entry, messages, childThreads, totalCost, totalTokens };
}

export function formatThreadInspection(inspection: ThreadInspection): string {
  const lines = [
    `## ${inspection.thread.statusIcon} ${inspection.thread.title} [${inspection.thread.id}]`,
    `Status: ${inspection.thread.status} | ${inspection.thread.messageCount} messages | ${inspection.thread.participantCount} participants`,
    `Cost: $${inspection.totalCost.toFixed(4)} | Tokens: ${inspection.totalTokens}`,
  ];

  if (inspection.thread.summary) {
    lines.push(`Summary: ${inspection.thread.summary}`);
  }

  if (inspection.thread.pendingReplies > 0) {
    lines.push(`Pending replies: ${inspection.thread.pendingReplies}`);
  }

  lines.push("", "### Messages", "");

  for (const msg of inspection.messages) {
    const recipients = msg.to.length > 0 ? ` → ${msg.to.join(", ")}` : " → all";
    const replyNote = msg.inResponseTo ? ` (reply to ${msg.inResponseTo})` : "";
    lines.push(
      `**${msg.from}${recipients}** [${msg.type}]${replyNote}`,
      msg.content.length > 200 ? msg.content.slice(0, 200) + "..." : msg.content,
      "",
    );
  }

  if (inspection.childThreads.length > 0) {
    lines.push("### Child Threads", "");
    for (const child of inspection.childThreads) {
      lines.push(formatThreadListLine(child));
    }
  }

  return lines.join("\n");
}

// --- Thread Outcome Summary for Synthesis ---

export function buildThreadOutcomeSummary(state: ThreadState): string {
  const threads = getAllThreads(state);
  if (threads.length === 0) return "";

  const lines = ["## Thread Outcomes", ""];

  for (const thread of threads) {
    const statusIcon = thread.status === "resolved" ? "✓"
      : thread.status === "closed" ? "✗"
      : thread.status === "quiet" ? "○"
      : "●";

    const msgCount = thread.message_ids.length;
    const participantList = thread.participants.join(", ");

    lines.push(`### ${statusIcon} ${thread.title}`);
    lines.push(`- Status: ${thread.status}${thread.resolution_reason ? ` (${thread.resolution_reason})` : ""}`);
    lines.push(`- Messages: ${msgCount} | Participants: ${participantList}`);

    if (thread.summary) {
      lines.push(`- Summary: ${thread.summary}`);
    }

    // Show child threads
    const children = threads.filter(t => t.parent_id === thread.id);
    if (children.length > 0) {
      for (const child of children) {
        const childIcon = child.status === "resolved" ? "✓" : "●";
        lines.push(`  └─ ${childIcon} ${child.title} (${child.message_ids.length} msgs)`);
      }
    }

    lines.push("");
  }

  return lines.join("\n");
}

// --- Meeting Summary with Threads ---

export function formatMeetingSummary(state: ThreadState): string {
  const threads = getAllThreads(state);
  const messages = getAllMessages(state);

  const active = threads.filter(t => t.status === "active" || t.status === "quiet").length;
  const resolved = threads.filter(t => t.status === "resolved").length;
  const closed = threads.filter(t => t.status === "closed").length;

  const totalCost = messages.reduce((sum, m) => sum + m.cost, 0);

  return [
    `Threads: ${threads.length} total (${active} active, ${resolved} resolved, ${closed} closed)`,
    `Messages: ${messages.length} total ($${totalCost.toFixed(2)})`,
  ].join(" | ");
}
