/**
 * Explicit messaging protocol for boardroom meetings.
 *
 * Replaces the inferred-addressee model with authoritative routing,
 * thread/workstream state, and structured delivery semantics.
 */

// --- Message Routing ---

export type MessageType =
  | "broadcast"       // Visible to all roster members
  | "direct"          // Delivered to specific agent(s)
  | "ceo-only"        // Only CEO sees this
  | "request-reply"   // Directed with expectation of response
  | "reply"           // Explicit reply to a prior message
  | "moderation";     // CEO intervention (redirect, checkpoint, close, spawn)

export type DeliveryStatus =
  | "pending"         // Created, not yet delivered
  | "delivered"       // Recipient(s) received it
  | "read"            // Recipient included it in their context
  | "dropped";        // Delivery failed (agent down, thread closed, etc.)

export interface RoutedMessage {
  id: string;
  type: MessageType;
  from: string;                    // agent slug
  to: string[];                    // recipient slugs (empty = broadcast)
  in_response_to: string | null;   // message id this replies to
  thread_id: string;               // workstream/thread this belongs to
  phase: number;
  round: number;
  timestamp: string;
  content: string;
  token_count: number;
  cost: number;
  delivery_status: DeliveryStatus;
  metadata?: Record<string, unknown>;
}

// --- Threads / Workstreams ---

export type ThreadStatus =
  | "active"
  | "quiet"           // No pending replies remain
  | "resolved"        // Explicitly or automatically resolved
  | "closed";         // CEO closed it

export type ThreadResolutionReason =
  | "no-pending-replies"
  | "explicit-close"
  | "ceo-checkpoint"
  | "convergence-heuristic"
  | "parent-resolved"
  | "meeting-aborted"
  | "meeting-force-closed"
  | "constraints-exceeded";

export interface Thread {
  id: string;
  title: string;
  parent_id: string | null;        // null = root workstream, string = child thread
  created_by: string;              // agent slug
  created_at: string;
  status: ThreadStatus;
  resolution_reason?: ThreadResolutionReason;
  resolved_at?: string;
  audience: string[];               // agent slugs allowed to view shared thread content
  participants: string[];           // agent slugs that have posted
  pending_replies: string[];        // agent slugs expected to reply
  message_ids: string[];            // ordered message ids in this thread
  summary?: string;                 // CEO-authored or auto-generated summary
}

// --- Thread State Manager ---

export interface ThreadState {
  threads: Map<string, Thread>;
  messages: Map<string, RoutedMessage>;
  agent_inboxes: Map<string, string[]>;   // agent slug → unread message ids
  agent_outboxes: Map<string, string[]>;  // agent slug → sent message ids
}

// --- Meeting-Level Messaging Log ---

export interface MessagingLog {
  meeting_id: string;
  brief: string;
  mode: string;
  constraints: string;
  roster: string[];
  started_at: string;
  ended_at: string;
  disposition: string;
  total_cost: number;
  threads: Thread[];
  messages: RoutedMessage[];
}

// --- Agent Context Projection ---

export interface AgentContextProjection {
  /** Messages in threads the agent participates in */
  relevant_messages: RoutedMessage[];
  /** Agent's unread inbox */
  inbox: RoutedMessage[];
  /** CEO summary of threads the agent is NOT in */
  room_summary: string;
  /** Thread metadata for threads the agent participates in */
  active_threads: Thread[];
}

// --- Inbox/Outbox Counts for UI ---

export interface AgentMessageCounts {
  slug: string;
  inbox_unread: number;
  inbox_total: number;
  outbox_total: number;
  active_threads: number;
  threads: string[];  // thread ids agent is participating in
}
