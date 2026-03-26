import { describe, it, expect, beforeEach } from "vitest";
import {
  buildRosterInfo,
  formatRosterLine,
  buildThreadList,
  formatThreadListLine,
  formatMeetingSummary,
  inspectThread,
  formatThreadInspection,
  buildThreadOutcomeSummary,
} from "./messaging-ui.js";
import {
  createThreadState,
  createThread,
  postMessage,
  resolveThread,
  closeThread,
} from "./thread-manager.js";
import type { ThreadState } from "./messaging-types.js";

describe("messaging-ui", () => {
  let state: ThreadState;

  beforeEach(() => {
    state = createThreadState();
  });

  describe("buildRosterInfo", () => {
    it("returns roster info with counts", () => {
      const thread = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], thread.id, "Hello", 1, 0, 100, 0.05);
      postMessage(state, "broadcast", "cfo", [], thread.id, "CFO here", 1, 1, 80, 0.03);
      postMessage(state, "direct", "ceo", ["cfo"], thread.id, "Hey CFO", 1, 1, 50, 0.01);

      const agents = [
        { slug: "ceo", name: "CEO" },
        { slug: "cfo", name: "CFO" },
        { slug: "cto", name: "CTO" },
      ];

      const roster = buildRosterInfo(state, agents);
      expect(roster).toHaveLength(3);

      const ceo = roster.find(r => r.slug === "ceo")!;
      expect(ceo.outbox_total).toBe(2);
      expect(ceo.active_threads).toBe(1);

      const cfo = roster.find(r => r.slug === "cfo")!;
      expect(cfo.inbox_unread).toBeGreaterThanOrEqual(1);
      expect(cfo.outbox_total).toBe(1);

      const cto = roster.find(r => r.slug === "cto")!;
      expect(cto.active_threads).toBe(0);
    });
  });

  describe("formatRosterLine", () => {
    it("formats a roster line", () => {
      const line = formatRosterLine({
        slug: "cfo",
        name: "CFO",
        inbox_unread: 2,
        outbox_total: 3,
        active_threads: 1,
        thread_names: ["Revenue"],
      });
      expect(line).toContain("CFO");
      expect(line).toContain("📥2");
      expect(line).toContain("📤3");
      expect(line).toContain("🧵1");
      expect(line).toContain("[Revenue]");
    });

    it("shows zero inbox without icon clutter", () => {
      const line = formatRosterLine({
        slug: "cto",
        name: "CTO",
        inbox_unread: 0,
        outbox_total: 0,
        active_threads: 0,
        thread_names: [],
      });
      expect(line).toContain("📥0");
      expect(line).toContain("📤0");
      expect(line).not.toContain("🧵");
    });
  });

  describe("buildThreadList", () => {
    it("builds a list of threads with metadata", () => {
      const t1 = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], t1.id, "Msg", 1, 0, 100, 0.05);
      postMessage(state, "broadcast", "cfo", [], t1.id, "Reply", 1, 1, 80, 0.03);

      const t2 = createThread(state, "Tech Risk", "ceo");
      resolveThread(state, t2.id, "no-pending-replies", "No major risks");

      const list = buildThreadList(state);
      expect(list).toHaveLength(2);

      const revenue = list.find(e => e.title === "Revenue")!;
      expect(revenue.messageCount).toBe(2);
      expect(revenue.participantCount).toBe(2);

      const tech = list.find(e => e.title === "Tech Risk")!;
      expect(tech.status).toBe("resolved");
      expect(tech.statusIcon).toBe("✓");
      expect(tech.summary).toBe("No major risks");
    });

    it("marks child threads", () => {
      const parent = createThread(state, "Parent", "ceo");
      createThread(state, "Child", "cto", parent.id);

      const list = buildThreadList(state);
      const child = list.find(e => e.title === "Child")!;
      expect(child.isChild).toBe(true);
    });
  });

  describe("formatThreadListLine", () => {
    it("formats active thread", () => {
      const line = formatThreadListLine({
        id: "thread-001",
        title: "Revenue",
        status: "active",
        statusIcon: "●",
        messageCount: 5,
        participantCount: 3,
        participants: ["ceo", "cfo", "cto"],
        pendingReplies: 1,
        isChild: false,
      });
      expect(line).toContain("● Revenue");
      expect(line).toContain("5 msgs");
      expect(line).toContain("1 pending");
    });

    it("formats child thread with indent", () => {
      const line = formatThreadListLine({
        id: "thread-002",
        title: "Sub-topic",
        status: "active",
        statusIcon: "●",
        messageCount: 2,
        participantCount: 2,
        participants: ["ceo", "cto"],
        pendingReplies: 0,
        isChild: true,
      });
      expect(line).toContain("└─");
    });
  });

  describe("formatMeetingSummary", () => {
    it("summarizes meeting thread state", () => {
      const t1 = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], t1.id, "Hello", 1, 0, 100, 0.05);
      postMessage(state, "broadcast", "cfo", [], t1.id, "Reply", 1, 1, 80, 0.03);

      const t2 = createThread(state, "Tech", "ceo");
      resolveThread(state, t2.id, "no-pending-replies");

      const summary = formatMeetingSummary(state);
      expect(summary).toContain("2 total");
      expect(summary).toContain("1 resolved");
      expect(summary).toContain("2 total");
    });
  });

  describe("inspectThread", () => {
    it("returns detailed thread inspection", () => {
      const t1 = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], t1.id, "Opening analysis", 1, 0, 100, 0.05);
      postMessage(state, "direct", "cfo", ["ceo"], t1.id, "CFO response", 1, 1, 80, 0.03);

      const inspection = inspectThread(state, t1.id);
      expect(inspection).not.toBeNull();
      expect(inspection!.messages).toHaveLength(2);
      expect(inspection!.messages[0].from).toBe("ceo");
      expect(inspection!.messages[1].from).toBe("cfo");
      expect(inspection!.totalCost).toBeCloseTo(0.08);
      expect(inspection!.totalTokens).toBe(180);
    });

    it("includes child threads", () => {
      const parent = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], parent.id, "Opening", 1, 0, 100, 0.05);
      createThread(state, "Revenue Sub-topic", "cfo", parent.id);

      const inspection = inspectThread(state, parent.id);
      expect(inspection).not.toBeNull();
      expect(inspection!.childThreads).toHaveLength(1);
      expect(inspection!.childThreads[0].title).toBe("Revenue Sub-topic");
    });

    it("returns null for unknown thread", () => {
      expect(inspectThread(state, "fake-thread")).toBeNull();
    });
  });

  describe("formatThreadInspection", () => {
    it("formats a detailed inspection", () => {
      const t1 = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], t1.id, "Analysis here", 1, 0, 100, 0.05);

      const inspection = inspectThread(state, t1.id)!;
      const formatted = formatThreadInspection(inspection);
      expect(formatted).toContain("Revenue");
      expect(formatted).toContain("Messages");
      expect(formatted).toContain("ceo");
    });
  });

  describe("buildThreadOutcomeSummary", () => {
    it("builds outcome summary for synthesis", () => {
      const t1 = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], t1.id, "Opening", 1, 0, 100, 0.05);
      postMessage(state, "broadcast", "cfo", [], t1.id, "Reply", 1, 1, 80, 0.03);
      const quietChild = createThread(state, "Revenue Detail", "cfo", t1.id);
      postMessage(state, "broadcast", "cfo", [], quietChild.id, "Detail", 1, 1, 30, 0.01);

      const t2 = createThread(state, "Tech", "ceo");
      resolveThread(state, t2.id, "convergence-heuristic", "All agreed on tech approach");
      const closedChild = createThread(state, "Tech Detail", "cto", t2.id);
      closeThread(state, closedChild.id, "Closed for follow-up");

      const summary = buildThreadOutcomeSummary(state);
      expect(summary).toContain("Thread Outcomes");
      expect(summary).toContain("Revenue");
      expect(summary).toContain("Tech");
      expect(summary).toContain("convergence-heuristic");
      expect(summary).toContain("All agreed on tech approach");
      expect(summary).toContain("○ Revenue Detail");
      expect(summary).toContain("✗ Tech Detail");
      expect(summary.match(/Tech Detail/g)).toHaveLength(1);
    });

    it("returns empty for no threads", () => {
      expect(buildThreadOutcomeSummary(state)).toBe("");
    });
  });
});
