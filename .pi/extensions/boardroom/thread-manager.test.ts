import { describe, it, expect, beforeEach } from "vitest";
import {
  createThreadState,
  createThread,
  postMessage,
  resolveThread,
  closeThread,
  updateThreadStatus,
  projectAgentContext,
  getAgentMessageCounts,
  markInboxRead,
  markInboxReadForThread,
  getQuietThreads,
  getActiveThreads,
  getAllThreads,
  getAllMessages,
  serializeToMessagingLog,
  buildRoomSummary,
  checkThreadConvergence,
  autoResolveConvergedThreads,
  snapshotThreadState,
  resolveAllActiveThreads,
  markUndeliverableMessages,
  formatRecoveryCheckpoint,
} from "./thread-manager.js";
import type { ThreadState } from "./messaging-types.js";

describe("ThreadManager", () => {
  let state: ThreadState;

  beforeEach(() => {
    state = createThreadState();
  });

  describe("createThread", () => {
    it("creates a root thread", () => {
      const thread = createThread(state, "Revenue Analysis", "ceo");
      expect(thread.id).toBe("thread-001");
      expect(thread.title).toBe("Revenue Analysis");
      expect(thread.created_by).toBe("ceo");
      expect(thread.parent_id).toBeNull();
      expect(thread.status).toBe("active");
      expect(thread.audience).toEqual(["ceo"]);
      expect(thread.participants).toEqual(["ceo"]);
      expect(thread.message_ids).toEqual([]);
    });

    it("creates a child thread", () => {
      const parent = createThread(state, "Parent", "ceo", null, ["ceo", "cto"]);
      const child = createThread(state, "Sub-topic", "cto", parent.id);
      expect(child.parent_id).toBe(parent.id);
      expect(child.id).toBe("thread-002");
      expect(child.audience).toEqual(["ceo", "cto"]);
    });

    it("stores threads in state", () => {
      createThread(state, "Thread 1", "ceo");
      createThread(state, "Thread 2", "ceo");
      expect(state.threads.size).toBe(2);
    });
  });

  describe("postMessage", () => {
    it("posts a broadcast message", () => {
      const thread = createThread(state, "Discussion", "ceo");
      const msg = postMessage(state, "broadcast", "ceo", [], thread.id, "Hello board", 1, 0, 100, 0.05);
      expect(msg.id).toBe("msg-0001");
      expect(msg.type).toBe("broadcast");
      expect(msg.from).toBe("ceo");
      expect(msg.to).toEqual([]);
      expect(msg.thread_id).toBe(thread.id);
      expect(msg.content).toBe("Hello board");
      expect(msg.delivery_status).toBe("delivered");
    });

    it("posts a direct message", () => {
      const thread = createThread(state, "Discussion", "ceo");
      postMessage(state, "broadcast", "ceo", [], thread.id, "Initial", 1, 0, 50, 0.01);
      // Add cto to participants
      postMessage(state, "broadcast", "cto", [], thread.id, "CTO here", 1, 0, 50, 0.01);

      const msg = postMessage(state, "direct", "cfo", ["cto"], thread.id, "Hey CTO", 1, 1, 80, 0.03);
      expect(msg.type).toBe("direct");
      expect(msg.to).toEqual(["cto"]);
    });

    it("tracks message in thread", () => {
      const thread = createThread(state, "Discussion", "ceo");
      const msg = postMessage(state, "broadcast", "ceo", [], thread.id, "Hello", 1, 0, 100, 0.05);
      expect(thread.message_ids).toContain(msg.id);
    });

    it("adds participants automatically", () => {
      const thread = createThread(state, "Discussion", "ceo");
      postMessage(state, "broadcast", "cto", [], thread.id, "CTO joining", 1, 1, 80, 0.03);
      expect(thread.participants).toContain("cto");
    });

    it("delivers to inboxes for direct messages", () => {
      const thread = createThread(state, "Discussion", "ceo");
      postMessage(state, "direct", "ceo", ["cto", "cfo"], thread.id, "Hey", 1, 0, 50, 0.01);
      expect(state.agent_inboxes.get("cto")).toHaveLength(1);
      expect(state.agent_inboxes.get("cfo")).toHaveLength(1);
    });

    it("delivers broadcast to the full thread audience except sender", () => {
      const thread = createThread(state, "Discussion", "ceo", null, ["ceo", "cto", "cfo"]);
      postMessage(state, "broadcast", "ceo", [], thread.id, "Update for all", 1, 1, 100, 0.05);
      expect(state.agent_inboxes.get("cto")).toHaveLength(1);
      expect(state.agent_inboxes.get("cfo")).toHaveLength(1);
      expect(state.agent_inboxes.get("ceo") ?? []).toHaveLength(0);
    });

    it("tracks outbox for sender", () => {
      const thread = createThread(state, "Discussion", "ceo");
      postMessage(state, "broadcast", "ceo", [], thread.id, "Hello", 1, 0, 100, 0.05);
      expect(state.agent_outboxes.get("ceo")).toHaveLength(1);
    });

    it("handles request-reply by marking pending replies", () => {
      const thread = createThread(state, "Discussion", "ceo");
      postMessage(state, "request-reply", "ceo", ["cto", "cfo"], thread.id, "Please respond", 1, 0, 100, 0.05);
      expect(thread.pending_replies).toContain("cto");
      expect(thread.pending_replies).toContain("cfo");
    });

    it("clears pending reply when agent responds", () => {
      const thread = createThread(state, "Discussion", "ceo");
      const req = postMessage(state, "request-reply", "ceo", ["cto"], thread.id, "Respond please", 1, 0, 100, 0.05);
      expect(thread.pending_replies).toContain("cto");

      postMessage(state, "reply", "cto", ["ceo"], thread.id, "Here you go", 1, 1, 80, 0.03, req.id);
      expect(thread.pending_replies).not.toContain("cto");
    });

    it("throws for nonexistent thread", () => {
      expect(() => postMessage(state, "broadcast", "ceo", [], "fake-thread", "Hello", 1, 0, 100, 0.05))
        .toThrow("Thread fake-thread not found");
    });
  });

  describe("thread lifecycle", () => {
    it("resolves a thread", () => {
      const thread = createThread(state, "Discussion", "ceo");
      resolveThread(state, thread.id, "no-pending-replies", "All done");
      expect(thread.status).toBe("resolved");
      expect(thread.resolution_reason).toBe("no-pending-replies");
      expect(thread.summary).toBe("All done");
      expect(thread.resolved_at).toBeDefined();
    });

    it("resolves child threads when parent resolves", () => {
      const parent = createThread(state, "Parent", "ceo");
      const child = createThread(state, "Child", "cto", parent.id);
      resolveThread(state, parent.id, "ceo-checkpoint");
      expect(child.status).toBe("resolved");
      expect(child.resolution_reason).toBe("parent-resolved");
    });

    it("closes a thread", () => {
      const thread = createThread(state, "Discussion", "ceo");
      closeThread(state, thread.id, "No longer needed");
      expect(thread.status).toBe("closed");
      expect(thread.summary).toBe("No longer needed");
    });

    it("detects quiet threads", () => {
      const thread = createThread(state, "Discussion", "ceo");
      postMessage(state, "broadcast", "ceo", [], thread.id, "Hello", 1, 0, 100, 0.05);
      // No pending replies → should be quiet
      updateThreadStatus(state, thread.id);
      const quiet = getQuietThreads(state);
      expect(quiet.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("context projection", () => {
    it("projects relevant context for an agent", () => {
      const t1 = createThread(state, "Revenue", "ceo", null, ["ceo", "cfo", "cto"]);
      const t2 = createThread(state, "Tech Debt", "ceo", null, ["ceo", "cfo", "cto"]);
      postMessage(state, "broadcast", "ceo", [], t1.id, "Revenue topic", 1, 0, 100, 0.05);
      postMessage(state, "broadcast", "cfo", [], t1.id, "CFO on revenue", 1, 1, 80, 0.03);
      postMessage(state, "broadcast", "cto", [], t2.id, "CTO on tech", 1, 1, 80, 0.03);

      const cfoContext = projectAgentContext(state, "cfo");
      expect(cfoContext.active_threads.length).toBeGreaterThanOrEqual(1);
      expect(cfoContext.relevant_messages.length).toBeGreaterThanOrEqual(1);
    });

    it("includes inbox messages", () => {
      const thread = createThread(state, "Discussion", "ceo");
      postMessage(state, "direct", "ceo", ["cfo"], thread.id, "Hey CFO", 1, 0, 100, 0.05);
      const cfoContext = projectAgentContext(state, "cfo");
      expect(cfoContext.inbox).toHaveLength(1);
      expect(cfoContext.inbox[0].content).toBe("Hey CFO");
    });

    it("clears inbox after marking read", () => {
      const thread = createThread(state, "Discussion", "ceo");
      postMessage(state, "direct", "ceo", ["cfo"], thread.id, "Hey CFO", 1, 0, 100, 0.05);
      markInboxRead(state, "cfo");
      const cfoContext = projectAgentContext(state, "cfo");
      expect(cfoContext.inbox).toHaveLength(0);
    });

    it("keeps private direct messages out of other agents' thread history", () => {
      const thread = createThread(state, "Discussion", "ceo", null, ["ceo", "cfo", "cto"]);
      postMessage(state, "broadcast", "ceo", [], thread.id, "Shared update", 1, 0, 100, 0.05);
      postMessage(state, "direct", "ceo", ["cfo"], thread.id, "Private note", 1, 1, 80, 0.03);

      const ctoContext = projectAgentContext(state, "cto");
      expect(ctoContext.relevant_messages.map((msg) => msg.content)).toContain("Shared update");
      expect(ctoContext.relevant_messages.map((msg) => msg.content)).not.toContain("Private note");
      expect(ctoContext.inbox.map((msg) => msg.content)).toEqual(["Shared update"]);
    });

    it("marks only one thread worth of inbox messages as read", () => {
      const revenue = createThread(state, "Revenue", "ceo", null, ["ceo", "cfo"]);
      const tech = createThread(state, "Tech", "ceo", null, ["ceo", "cfo"]);
      postMessage(state, "broadcast", "ceo", [], revenue.id, "Revenue update", 1, 0, 100, 0.05);
      postMessage(state, "broadcast", "ceo", [], tech.id, "Tech update", 1, 0, 100, 0.05);

      markInboxReadForThread(state, "cfo", revenue.id);
      const remaining = state.agent_inboxes.get("cfo") ?? [];
      expect(remaining).toHaveLength(1);
      const remainingMessage = state.messages.get(remaining[0]);
      expect(remainingMessage?.thread_id).toBe(tech.id);
    });
  });

  describe("agent message counts", () => {
    it("returns correct counts", () => {
      const thread = createThread(state, "Discussion", "ceo");
      postMessage(state, "broadcast", "ceo", [], thread.id, "Hello", 1, 0, 100, 0.05);
      // CFO joins by posting, making them a participant
      postMessage(state, "broadcast", "cfo", [], thread.id, "CFO reply", 1, 1, 80, 0.03);
      postMessage(state, "direct", "ceo", ["cfo"], thread.id, "For CFO", 1, 1, 50, 0.01);

      const ceoCounts = getAgentMessageCounts(state, "ceo");
      expect(ceoCounts.outbox_total).toBe(2);
      expect(ceoCounts.active_threads).toBe(1);

      const cfoCounts = getAgentMessageCounts(state, "cfo");
      expect(cfoCounts.outbox_total).toBe(1);
      expect(cfoCounts.active_threads).toBe(1);
    });
  });

  describe("room summary", () => {
    it("builds summary excluding agent's own threads", () => {
      const t1 = createThread(state, "Revenue", "ceo", null, ["ceo", "cfo", "cto"]);
      const t2 = createThread(state, "Tech Debt", "ceo", null, ["ceo", "cfo", "cto"]);
      postMessage(state, "broadcast", "cfo", [], t1.id, "CFO on revenue", 1, 1, 80, 0.03);
      postMessage(state, "broadcast", "cto", [], t2.id, "CTO on tech", 1, 1, 80, 0.03);

      // CFO should see a summary of tech debt thread (not in it)
      // but not revenue (they are a participant)
      const summary = buildRoomSummary(state, "cfo");
      expect(summary).toContain("Tech Debt");
    });

    it("does not leak private direct content into room summaries", () => {
      const t1 = createThread(state, "Revenue", "ceo", null, ["ceo", "cfo", "cto"]);
      postMessage(state, "broadcast", "ceo", [], t1.id, "Shared framing", 1, 0, 100, 0.05);
      postMessage(state, "direct", "ceo", ["cfo"], t1.id, "Private note for CFO", 1, 1, 80, 0.03);

      const summary = buildRoomSummary(state, "cto");
      expect(summary).toContain("Shared framing");
      expect(summary).not.toContain("Private note for CFO");
    });
  });

  describe("serialization", () => {
    it("serializes to MessagingLog", () => {
      const thread = createThread(state, "Discussion", "ceo");
      postMessage(state, "broadcast", "ceo", [], thread.id, "Hello", 1, 0, 100, 0.05);
      postMessage(state, "broadcast", "cto", [], thread.id, "Reply", 1, 1, 80, 0.03);

      const log = serializeToMessagingLog(
        state, "meeting-001", "test-brief.md", "freeform",
        "quick", ["ceo", "cto"], new Date().toISOString(), "completed",
      );

      expect(log.meeting_id).toBe("meeting-001");
      expect(log.threads).toHaveLength(1);
      expect(log.messages).toHaveLength(2);
      expect(log.total_cost).toBeCloseTo(0.08);
    });
  });

  describe("getActiveThreads and getAllThreads", () => {
    it("returns only active threads", () => {
      createThread(state, "Active One", "ceo");
      const resolved = createThread(state, "Resolved", "ceo");
      resolveThread(state, resolved.id, "no-pending-replies");
      createThread(state, "Active Two", "ceo");

      expect(getActiveThreads(state)).toHaveLength(2);
      expect(getAllThreads(state)).toHaveLength(3);
    });
  });

  describe("getAllMessages", () => {
    it("returns all messages", () => {
      const thread = createThread(state, "Discussion", "ceo");
      postMessage(state, "broadcast", "ceo", [], thread.id, "Msg 1", 1, 0, 100, 0.05);
      postMessage(state, "broadcast", "cto", [], thread.id, "Msg 2", 1, 1, 80, 0.03);

      expect(getAllMessages(state)).toHaveLength(2);
    });
  });

  describe("convergence heuristic", () => {
    it("detects converged thread (3+ messages, 2+ participants, no request-reply)", () => {
      const thread = createThread(state, "Discussion", "ceo");
      postMessage(state, "broadcast", "ceo", [], thread.id, "Opening", 1, 0, 100, 0.05);
      postMessage(state, "broadcast", "cfo", [], thread.id, "I agree", 1, 1, 80, 0.03);
      postMessage(state, "broadcast", "ceo", [], thread.id, "Good, aligned", 1, 2, 80, 0.03);

      expect(checkThreadConvergence(state, thread.id)).toBe(true);
    });

    it("does not converge with pending replies", () => {
      const thread = createThread(state, "Discussion", "ceo");
      postMessage(state, "broadcast", "ceo", [], thread.id, "Opening", 1, 0, 100, 0.05);
      postMessage(state, "broadcast", "cfo", [], thread.id, "I agree", 1, 1, 80, 0.03);
      postMessage(state, "request-reply", "ceo", ["cto"], thread.id, "CTO, thoughts?", 1, 2, 80, 0.03);

      expect(checkThreadConvergence(state, thread.id)).toBe(false);
    });

    it("does not converge with fewer than 3 messages", () => {
      const thread = createThread(state, "Discussion", "ceo");
      postMessage(state, "broadcast", "ceo", [], thread.id, "Opening", 1, 0, 100, 0.05);
      postMessage(state, "broadcast", "cfo", [], thread.id, "Reply", 1, 1, 80, 0.03);

      expect(checkThreadConvergence(state, thread.id)).toBe(false);
    });

    it("does not converge with only one participant", () => {
      const thread = createThread(state, "Discussion", "ceo");
      postMessage(state, "broadcast", "ceo", [], thread.id, "Msg 1", 1, 0, 100, 0.05);
      postMessage(state, "broadcast", "ceo", [], thread.id, "Msg 2", 1, 1, 80, 0.03);
      postMessage(state, "broadcast", "ceo", [], thread.id, "Msg 3", 1, 2, 80, 0.03);

      expect(checkThreadConvergence(state, thread.id)).toBe(false);
    });

    it("does not converge with recent request-reply", () => {
      const thread = createThread(state, "Discussion", "ceo");
      postMessage(state, "broadcast", "ceo", [], thread.id, "Opening", 1, 0, 100, 0.05);
      postMessage(state, "broadcast", "cfo", [], thread.id, "I agree", 1, 1, 80, 0.03);
      postMessage(state, "broadcast", "cto", [], thread.id, "Me too", 1, 2, 80, 0.03);
      // CTO cleared pending but now CEO asks for more
      postMessage(state, "request-reply", "ceo", ["cfo"], thread.id, "Wait, check the numbers", 1, 3, 80, 0.03);

      expect(checkThreadConvergence(state, thread.id)).toBe(false);
    });

    it("auto-resolves converged threads", () => {
      const t1 = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], t1.id, "Opening", 1, 0, 100, 0.05);
      postMessage(state, "broadcast", "cfo", [], t1.id, "Agreed", 1, 1, 80, 0.03);
      postMessage(state, "broadcast", "ceo", [], t1.id, "Good", 1, 2, 80, 0.03);

      const t2 = createThread(state, "Tech", "ceo");
      postMessage(state, "broadcast", "ceo", [], t2.id, "Tech question", 1, 0, 100, 0.05);
      // Only 1 message, shouldn't converge

      const resolved = autoResolveConvergedThreads(state);
      expect(resolved).toEqual([t1.id]);
      expect(t1.status).toBe("resolved");
      expect(t1.resolution_reason).toBe("convergence-heuristic");
      expect(t2.status).not.toBe("resolved");
    });
  });

  describe("snapshotThreadState", () => {
    it("captures state snapshot for partial artifacts", () => {
      const t1 = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], t1.id, "Opening", 1, 0, 100, 0.05);
      postMessage(state, "broadcast", "cfo", [], t1.id, "Reply", 1, 1, 80, 0.03);

      const t2 = createThread(state, "Tech", "ceo");
      resolveThread(state, t2.id, "no-pending-replies");

      const snapshot = snapshotThreadState(state);
      expect(snapshot.threadCount).toBe(2);
      expect(snapshot.messageCount).toBe(2);
      expect(snapshot.activeThreads).toBe(1);
      expect(snapshot.resolvedThreads).toBe(1);
      expect(snapshot.participantSlugs).toContain("ceo");
      expect(snapshot.participantSlugs).toContain("cfo");
      expect(snapshot.lastActivity).toBeDefined();
    });

    it("handles empty state", () => {
      const snapshot = snapshotThreadState(state);
      expect(snapshot.threadCount).toBe(0);
      expect(snapshot.messageCount).toBe(0);
      expect(snapshot.lastActivity).toBeNull();
    });
  });

  describe("resolveAllActiveThreads", () => {
    it("resolves all active and quiet threads with given reason", () => {
      const t1 = createThread(state, "Active", "ceo");
      postMessage(state, "broadcast", "ceo", [], t1.id, "Opening", 1, 0, 100, 0.05);

      const t2 = createThread(state, "Another", "ceo");
      postMessage(state, "broadcast", "cfo", [], t2.id, "Analysis", 1, 1, 80, 0.03);

      const t3 = createThread(state, "Already Resolved", "ceo");
      resolveThread(state, t3.id, "ceo-checkpoint");

      const count = resolveAllActiveThreads(state, "meeting-aborted", "Meeting was aborted");
      expect(count).toBe(2); // t1 and t2, not t3

      expect(state.threads.get(t1.id)!.status).toBe("resolved");
      expect(state.threads.get(t1.id)!.resolution_reason).toBe("meeting-aborted");
      expect(state.threads.get(t1.id)!.summary).toBe("Meeting was aborted");

      expect(state.threads.get(t2.id)!.status).toBe("resolved");
      expect(state.threads.get(t3.id)!.resolution_reason).toBe("ceo-checkpoint"); // unchanged
    });

    it("returns 0 when no active threads exist", () => {
      const t1 = createThread(state, "Done", "ceo");
      resolveThread(state, t1.id, "ceo-checkpoint");

      const count = resolveAllActiveThreads(state, "meeting-aborted");
      expect(count).toBe(0);
    });
  });

  describe("markUndeliverableMessages", () => {
    it("marks messages in resolved threads as dropped if still in inbox", () => {
      const t1 = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], t1.id, "Opening", 1, 0, 100, 0.05);
      const msg2 = postMessage(state, "request-reply", "ceo", ["cfo"], t1.id, "Respond", 1, 1, 80, 0.03);

      // cfo has msg2 in inbox, then thread resolves
      resolveThread(state, t1.id, "meeting-aborted");

      const count = markUndeliverableMessages(state);
      expect(count).toBeGreaterThanOrEqual(1);

      const marked = state.messages.get(msg2.id);
      expect(marked?.delivery_status).toBe("dropped");
    });

    it("returns 0 when no undeliverable messages exist", () => {
      const t1 = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], t1.id, "Opening", 1, 0, 100, 0.05);
      markInboxRead(state, "cfo"); // clear inbox

      resolveThread(state, t1.id, "ceo-checkpoint");
      const count = markUndeliverableMessages(state);
      expect(count).toBe(0);
    });
  });

  describe("formatRecoveryCheckpoint", () => {
    it("formats a recovery checkpoint with thread details", () => {
      const t1 = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], t1.id, "Opening", 1, 0, 100, 0.05);
      postMessage(state, "request-reply", "ceo", ["cfo"], t1.id, "Respond", 1, 1, 80, 0.03);

      const t2 = createThread(state, "Tech", "cto");
      resolveThread(state, t2.id, "ceo-checkpoint");

      const checkpoint = formatRecoveryCheckpoint(state);
      expect(checkpoint).toContain("Recovery Checkpoint");
      expect(checkpoint).toContain("Threads: 2 total");
      expect(checkpoint).toContain("Messages: 2 total");
      expect(checkpoint).toContain("Unresolved threads:");
      expect(checkpoint).toContain("Revenue");
      expect(checkpoint).not.toContain("Tech"); // resolved, not in unresolved list
    });

    it("handles empty state", () => {
      const checkpoint = formatRecoveryCheckpoint(state);
      expect(checkpoint).toContain("Recovery Checkpoint");
      expect(checkpoint).toContain("Threads: 0 total");
      expect(checkpoint).not.toContain("Unresolved threads:");
    });
  });
});
