/**
 * Tree-style thread visualization for the boardroom meeting UI.
 *
 * Renders a hierarchical tree with a main trunk and thread branches,
 * inspired by the `tree` command and git-graph branch views.
 * Child threads branch off their parents with further indentation.
 *
 * Example compact output:
 *
 *   ├─● Revenue Growth Strategy  active · 3 msgs · 2 mbrs
 *   │  ├─✓ Pricing Model Analysis  resolved · 3 msgs
 *   │  │  └ ↳ Aligned on Scenario B
 *   │
 *   ├─● Technical Debt Risk  active · 2 msgs [1 pending]
 *   │
 *   └─✗ Customer Churn Analysis  closed · 1 msg
 *
 * Example full output (with messages inline):
 *
 *   ├─● Revenue Growth Strategy  active · 3 msgs · 2 mbrs
 *   │  ├ ceo → all: Let's analyze…
 *   │  ├ cfo → ceo: My analysis…
 *   │  ├─✓ Pricing Model Analysis  resolved · 3 msgs
 *   │  │  ├ cfo → ceo: Q1 numbers…
 *   │  │  └ ↳ Aligned on Scenario B
 *   │  └ ceo → all: Incorporating…
 *   │
 *   ├─● Technical Debt Risk  active · 2 msgs
 *   │  ├ cto → all: Key risks?
 *   │  └ ◆ cfo [awaiting reply]
 *   │
 *   └─✓ Hiring Plan Q2  resolved · 1 msg
 *      └ ↳ Approved 3 eng + 1 design
 */

import type { ThreadState, Thread, RoutedMessage } from "./messaging-types.js";
import { getAllThreads, getAllMessages } from "./thread-manager.js";

// --- Graph Data Model ---

export interface ThreadGraphNode {
  id: string;
  title: string;
  status: string;
  statusIcon: string;
  depth: number;
  messageCount: number;
  participantCount: number;
  participants: string[];
  pendingReplies: number;
  isConverged: boolean;
  summary?: string;
  children: ThreadGraphNode[];
}

export interface ThreadGraphEdge {
  from: string;
  to: string;
  type: "parent-child" | "reply" | "spawn";
}

export interface ThreadGraph {
  roots: ThreadGraphNode[];
  edges: ThreadGraphEdge[];
  stats: {
    totalThreads: number;
    activeThreads: number;
    resolvedThreads: number;
    closedThreads: number;
    totalMessages: number;
    totalParticipants: number;
  };
}

// --- Build Thread Graph ---

export function buildThreadGraph(state: ThreadState): ThreadGraph {
  const threads = getAllThreads(state);
  const messages = getAllMessages(state);

  const nodeMap = new Map<string, ThreadGraphNode>();
  const rootNodes: ThreadGraphNode[] = [];

  for (const thread of threads) {
    const node: ThreadGraphNode = {
      id: thread.id,
      title: thread.title,
      status: thread.status,
      statusIcon: getStatusIcon(thread.status),
      depth: 0,
      messageCount: thread.message_ids.length,
      participantCount: thread.participants.length,
      participants: thread.participants,
      pendingReplies: thread.pending_replies.length,
      isConverged: thread.resolution_reason === "convergence-heuristic",
      summary: thread.summary,
      children: [],
    };
    nodeMap.set(thread.id, node);
  }

  for (const thread of threads) {
    const node = nodeMap.get(thread.id)!;
    if (thread.parent_id) {
      const parent = nodeMap.get(thread.parent_id);
      if (parent) {
        parent.children.push(node);
        node.depth = parent.depth + 1;
      } else {
        rootNodes.push(node);
      }
    } else {
      rootNodes.push(node);
    }
  }

  function setDepth(node: ThreadGraphNode, depth: number): void {
    node.depth = depth;
    for (const child of node.children) {
      setDepth(child, depth + 1);
    }
  }
  for (const root of rootNodes) {
    setDepth(root, 0);
  }

  const edges: ThreadGraphEdge[] = [];
  for (const thread of threads) {
    if (thread.parent_id) {
      edges.push({ from: thread.parent_id, to: thread.id, type: "parent-child" });
    }
  }
  for (const msg of messages) {
    if (msg.in_response_to) {
      edges.push({ from: msg.in_response_to, to: msg.id, type: "reply" });
    }
  }

  const uniqueParticipants = new Set<string>();
  for (const thread of threads) {
    for (const p of thread.participants) uniqueParticipants.add(p);
  }

  return {
    roots: rootNodes,
    edges,
    stats: {
      totalThreads: threads.length,
      activeThreads: threads.filter(t => t.status === "active" || t.status === "quiet").length,
      resolvedThreads: threads.filter(t => t.status === "resolved").length,
      closedThreads: threads.filter(t => t.status === "closed").length,
      totalMessages: messages.length,
      totalParticipants: uniqueParticipants.size,
    },
  };
}

function getStatusIcon(status: string): string {
  switch (status) {
    case "active": return "●";
    case "quiet": return "○";
    case "resolved": return "✓";
    case "closed": return "✗";
    default: return "?";
  }
}

// --- Tree Text Renderer ---

const CONTENT_LIMIT = 55;

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

function formatMsgLine(msg: RoutedMessage): string {
  const recipients = msg.to.length > 0 ? msg.to.join(", ") : "all";
  const typeTag = msg.type !== "broadcast" ? ` [${msg.type}]` : "";
  const replyRef = msg.in_response_to ? ` ← ${msg.in_response_to}` : "";
  const preview = truncate(msg.content.replace(/\n/g, " "), CONTENT_LIMIT);
  return `${msg.from} → ${recipients}${typeTag}${replyRef}: ${preview}`;
}

/**
 * Render a tree-style visualization.
 *
 * Two modes:
 * - "compact": shows only thread structure (overview)
 * - "full": shows messages inline under each thread
 */
export function renderThreadGraph(
  graph: ThreadGraph,
  state?: ThreadState,
  mode: "full" | "compact" = "compact",
): string {
  const lines: string[] = [];

  // Stats header
  const s = graph.stats;
  lines.push(
    `${s.totalThreads} threads · ${s.totalMessages} msgs · ${s.totalParticipants} participants` +
    ` (${s.activeThreads} active, ${s.resolvedThreads} resolved, ${s.closedThreads} closed)`,
  );
  lines.push("");

  for (let i = 0; i < graph.roots.length; i++) {
    const isLast = i === graph.roots.length - 1;
    renderTreeNode(graph.roots[i], "", isLast, state, mode, lines);
    // Gap between root threads (except after last)
    if (!isLast) {
      lines.push("│");
    }
  }

  return lines.join("\n");
}

/**
 * Check if a node and all its descendants are resolved or closed.
 * A fully-resolved subtree collapses to a single line in compact mode.
 */
function isFullyResolved(node: ThreadGraphNode): boolean {
  if (node.status !== "resolved" && node.status !== "closed") return false;
  return node.children.every(isFullyResolved);
}

/**
 * Recursively render a thread node and its children as a tree.
 *
 * Compact mode collapsing rules:
 * - A fully-resolved subtree (node + all descendants resolved/closed)
 *   renders as a single collapsed line with summary.
 * - Resolved children of an active parent collapse to one-liners,
 *   while active children expand normally.
 *
 * @param node       The thread graph node
 * @param prefix     Inherited indentation prefix from parent (e.g., "│  │  ")
 * @param isLast     Whether this node is the last sibling
 * @param state      Optional thread state (needed for full mode to show messages)
 * @param mode       "compact" or "full"
 * @param lines      Output lines array
 * @param forceExpand  If true, skip collapsing (used for root-level rendering)
 */
function renderTreeNode(
  node: ThreadGraphNode,
  prefix: string,
  isLast: boolean,
  state: ThreadState | undefined,
  mode: "full" | "compact",
  lines: string[],
  forceExpand = false,
): void {
  // Branch character: ├─ for non-last, └─ for last
  const branch = isLast ? "└─" : "├─";
  // Continuation prefix for children: │  for non-last, spaces for last
  const childPrefix = prefix + (isLast ? "   " : "│  ");

  // In compact mode, collapse fully-resolved subtrees to a single line
  if (mode === "compact" && !forceExpand && isFullyResolved(node)) {
    const summaryText = node.summary ? `  ↳ ${truncate(node.summary, 50)}` : "";
    const childCount = countDescendants(node);
    const childTag = childCount > 0 ? ` (+${childCount})` : "";
    lines.push(`${prefix}${branch}${node.statusIcon} ${node.title}${childTag}${summaryText}`);
    return;
  }

  // Thread header
  const meta = `${node.status} · ${node.messageCount} msgs · ${node.participantCount} mbrs`;
  const pendingTag = node.pendingReplies > 0 ? ` [${node.pendingReplies} pending]` : "";
  const convergedTag = node.isConverged ? " ≡" : "";
  lines.push(`${prefix}${branch}${node.statusIcon} ${node.title}  ${meta}${pendingTag}${convergedTag}`);

  // In full mode, render messages and child threads interleaved
  if (mode === "full" && state) {
    renderThreadContents(node, childPrefix, state, lines);
  } else {
    // Compact mode: show summary and child threads
    // Resolved children collapse; active children expand
    if (node.summary && (node.status === "resolved" || node.status === "closed")) {
      const hasActiveChildren = node.children.some(c => !isFullyResolved(c));
      if (!hasActiveChildren) {
        // All children resolved, show summary as last item
        lines.push(`${childPrefix}└ ↳ ${truncate(node.summary, 60)}`);
      } else {
        // Show summary before active children
        lines.push(`${childPrefix}├ ↳ ${truncate(node.summary, 60)}`);
      }
    }
    for (let i = 0; i < node.children.length; i++) {
      const isLastChild = i === node.children.length - 1;
      renderTreeNode(node.children[i], childPrefix, isLastChild, state, mode, lines);
    }
  }
}

/** Count total descendants (children, grandchildren, etc.) */
function countDescendants(node: ThreadGraphNode): number {
  let count = node.children.length;
  for (const child of node.children) {
    count += countDescendants(child);
  }
  return count;
}

/**
 * Render the full contents of a thread: messages interleaved with child thread branches.
 * Child threads are positioned after the parent message they branched from.
 */
function renderThreadContents(
  node: ThreadGraphNode,
  prefix: string,
  state: ThreadState,
  lines: string[],
): void {
  const thread = state.threads.get(node.id);
  if (!thread) return;

  // Build a map: after which parent message index does each child branch?
  const childBranchPoints = new Map<number, ThreadGraphNode[]>();
  for (const child of node.children) {
    const childThread = state.threads.get(child.id);
    if (!childThread) continue;
    let insertAfter = -1;
    for (let i = 0; i < thread.message_ids.length; i++) {
      const parentMsg = state.messages.get(thread.message_ids[i]);
      if (parentMsg && childThread.created_at >= parentMsg.timestamp) {
        insertAfter = i;
      }
    }
    const arr = childBranchPoints.get(insertAfter) ?? [];
    arr.push(child);
    childBranchPoints.set(insertAfter, arr);
  }

  // Collect all items (messages + child branches + pending + summary) to determine last item
  interface ContentItem {
    kind: "message" | "child" | "pending" | "summary";
    msg?: RoutedMessage;
    childNode?: ThreadGraphNode;
    childIsLast?: boolean;
    agentSlug?: string;
    text?: string;
  }

  const items: ContentItem[] = [];

  // Early children (branch before any messages)
  const earlyChildren = childBranchPoints.get(-1);
  if (earlyChildren) {
    for (const child of earlyChildren) {
      items.push({ kind: "child", childNode: child });
    }
  }

  // Messages interleaved with child branches
  for (let i = 0; i < thread.message_ids.length; i++) {
    const msg = state.messages.get(thread.message_ids[i]);
    if (msg) {
      items.push({ kind: "message", msg });
    }
    const children = childBranchPoints.get(i);
    if (children) {
      for (const child of children) {
        items.push({ kind: "child", childNode: child });
      }
    }
  }

  // Pending replies
  for (const slug of thread.pending_replies) {
    items.push({ kind: "pending", agentSlug: slug });
  }

  // Summary
  if (node.summary) {
    items.push({ kind: "summary", text: node.summary });
  }

  // Render each item
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const isLast = i === items.length - 1;

    switch (item.kind) {
      case "message": {
        const connector = isLast ? "└" : "├";
        const line = formatMsgLine(item.msg!);
        lines.push(`${prefix}${connector} ● ${line}`);
        break;
      }
      case "child": {
        renderTreeNode(item.childNode!, prefix, isLast, state, "full", lines);
        break;
      }
      case "pending": {
        const connector = isLast ? "└" : "├";
        lines.push(`${prefix}${connector} ◆ ${item.agentSlug} [awaiting reply]`);
        break;
      }
      case "summary": {
        lines.push(`${prefix}└ ↳ ${truncate(item.text!, 60)}`);
        break;
      }
    }
  }
}

// --- Compact Activity Line (status bar) ---

export function renderActivityLine(graph: ThreadGraph): string {
  const parts: string[] = [];
  for (const root of graph.roots) {
    const pending = root.pendingReplies > 0 ? `!${root.pendingReplies}` : "";
    parts.push(`${root.statusIcon}${root.title}${pending}`);
  }
  return parts.join(" │ ");
}

// --- Per-Thread Message Flow ---

export function renderMessageFlow(state: ThreadState, threadId: string): string {
  const thread = state.threads.get(threadId);
  if (!thread) return `Thread ${threadId} not found.`;

  const lines: string[] = [];
  const icon = getStatusIcon(thread.status);
  lines.push(`${icon} ${thread.title} [${thread.id}]  ${thread.status} · ${thread.message_ids.length} msgs`);
  lines.push("│");

  const totalItems = thread.message_ids.length + thread.pending_replies.length;

  for (let i = 0; i < thread.message_ids.length; i++) {
    const msg = state.messages.get(thread.message_ids[i]);
    if (!msg) continue;
    const isLast = i === totalItems - 1;
    const connector = isLast ? "└" : "├";
    lines.push(`${connector}─● ${formatMsgLine(msg)}`);
  }

  for (let i = 0; i < thread.pending_replies.length; i++) {
    const isLast = i === thread.pending_replies.length - 1;
    const connector = isLast ? "└" : "├";
    lines.push(`${connector}─◆ ${thread.pending_replies[i]} [awaiting reply]`);
  }

  return lines.join("\n");
}
