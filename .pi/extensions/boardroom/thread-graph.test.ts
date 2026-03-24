import { describe, it, expect, beforeEach } from "vitest";
import {
  buildThreadGraph,
  renderThreadGraph,
  renderActivityLine,
  renderMessageFlow,
} from "./thread-graph.js";
import {
  createThreadState,
  createThread,
  postMessage,
  resolveThread,
  closeThread,
  resetCounters,
} from "./thread-manager.js";
import type { ThreadState } from "./messaging-types.js";

describe("thread-graph", () => {
  let state: ThreadState;

  beforeEach(() => {
    resetCounters();
    state = createThreadState();
  });

  describe("buildThreadGraph", () => {
    it("builds a graph from thread state", () => {
      const t1 = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], t1.id, "Opening", 1, 0, 100, 0.05);
      postMessage(state, "broadcast", "cfo", [], t1.id, "Analysis", 1, 1, 80, 0.03);

      const t2 = createThread(state, "Tech Risk", "ceo");
      postMessage(state, "broadcast", "cto", [], t2.id, "Assessment", 1, 1, 80, 0.03);

      const graph = buildThreadGraph(state);
      expect(graph.roots).toHaveLength(2);
      expect(graph.stats.totalThreads).toBe(2);
      expect(graph.stats.totalMessages).toBe(3);
      expect(graph.stats.totalParticipants).toBe(3);
    });

    it("handles parent-child hierarchy", () => {
      const parent = createThread(state, "Revenue", "ceo");
      createThread(state, "Q1 Revenue", "cfo", parent.id);
      createThread(state, "Q2 Revenue", "cfo", parent.id);

      const graph = buildThreadGraph(state);
      expect(graph.roots).toHaveLength(1);
      expect(graph.roots[0].children).toHaveLength(2);
      expect(graph.roots[0].children[0].title).toBe("Q1 Revenue");
      expect(graph.roots[0].children[0].depth).toBe(1);
    });

    it("computes status icons correctly", () => {
      createThread(state, "Active", "ceo");
      const t2 = createThread(state, "Resolved", "ceo");
      resolveThread(state, t2.id, "no-pending-replies");
      const t3 = createThread(state, "Closed", "ceo");
      closeThread(state, t3.id);

      const graph = buildThreadGraph(state);
      const active = graph.roots.find(n => n.title === "Active")!;
      const resolved = graph.roots.find(n => n.title === "Resolved")!;
      const closed = graph.roots.find(n => n.title === "Closed")!;

      expect(active.statusIcon).toBe("●");
      expect(resolved.statusIcon).toBe("✓");
      expect(closed.statusIcon).toBe("✗");
    });

    it("marks converged threads", () => {
      const t1 = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], t1.id, "Opening", 1, 0, 100, 0.05);
      postMessage(state, "broadcast", "cfo", [], t1.id, "Agreed", 1, 1, 80, 0.03);
      postMessage(state, "broadcast", "ceo", [], t1.id, "Good", 1, 2, 80, 0.03);
      resolveThread(state, t1.id, "convergence-heuristic");

      const graph = buildThreadGraph(state);
      expect(graph.roots[0].isConverged).toBe(true);
    });

    it("builds reply edges", () => {
      const t1 = createThread(state, "Revenue", "ceo");
      const msg1 = postMessage(state, "broadcast", "ceo", [], t1.id, "Opening", 1, 0, 100, 0.05);
      postMessage(state, "reply", "cfo", ["ceo"], t1.id, "Reply", 1, 1, 80, 0.03, msg1.id);

      const graph = buildThreadGraph(state);
      expect(graph.edges.some(e => e.type === "reply")).toBe(true);
    });

    it("computes stats correctly", () => {
      createThread(state, "Active 1", "ceo");
      createThread(state, "Active 2", "ceo");
      const resolved = createThread(state, "Resolved", "ceo");
      resolveThread(state, resolved.id, "no-pending-replies");
      const closed = createThread(state, "Closed", "ceo");
      closeThread(state, closed.id);

      const graph = buildThreadGraph(state);
      expect(graph.stats.activeThreads).toBe(2);
      expect(graph.stats.resolvedThreads).toBe(1);
      expect(graph.stats.closedThreads).toBe(1);
    });
  });

  describe("renderThreadGraph (compact)", () => {
    it("renders a compact tree with branches", () => {
      const t1 = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], t1.id, "Opening", 1, 0, 100, 0.05);
      createThread(state, "Q1 Detail", "cfo", t1.id);
      createThread(state, "Tech Risk", "ceo"); // second root so first gets ├

      const graph = buildThreadGraph(state);
      const text = renderThreadGraph(graph);

      expect(text).toContain("Revenue");
      expect(text).toContain("Q1 Detail");
      // Should have tree branch characters
      expect(text).toContain("├");
      expect(text).toContain("│");
    });

    it("shows summary for resolved threads", () => {
      const t1 = createThread(state, "Revenue", "ceo");
      resolveThread(state, t1.id, "ceo-checkpoint", "Aligned on growth target");

      const graph = buildThreadGraph(state);
      const text = renderThreadGraph(graph);
      expect(text).toContain("Aligned on growth target");
    });

    it("shows stats header", () => {
      createThread(state, "Revenue", "ceo");
      createThread(state, "Tech", "ceo");

      const graph = buildThreadGraph(state);
      const text = renderThreadGraph(graph);
      expect(text).toContain("2 threads");
      expect(text).toContain("2 active");
    });

    it("renders last root with └ connector", () => {
      createThread(state, "First", "ceo");
      createThread(state, "Last", "ceo");

      const graph = buildThreadGraph(state);
      const text = renderThreadGraph(graph);
      expect(text).toContain("├─●");
      expect(text).toContain("└─●");
    });

    it("renders child thread hierarchy with indentation", () => {
      const parent = createThread(state, "Revenue", "ceo");
      const child = createThread(state, "Q1 Detail", "cfo", parent.id);
      createThread(state, "January", "cfo", child.id);

      const graph = buildThreadGraph(state);
      const text = renderThreadGraph(graph);
      // All three should appear
      expect(text).toContain("Revenue");
      expect(text).toContain("Q1 Detail");
      expect(text).toContain("January");
    });
  });

  describe("renderThreadGraph (full)", () => {
    it("renders messages under each thread", () => {
      const t1 = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], t1.id, "Let's discuss revenue", 1, 0, 100, 0.05);
      postMessage(state, "broadcast", "cfo", [], t1.id, "Here is my analysis", 1, 1, 80, 0.03);

      const graph = buildThreadGraph(state);
      const text = renderThreadGraph(graph, state, "full");

      expect(text).toContain("Revenue");
      expect(text).toContain("●"); // message dots
      expect(text).toContain("ceo → all");
      expect(text).toContain("cfo → all");
    });

    it("renders child thread as branch within parent", () => {
      const parent = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], parent.id, "Opening framing", 1, 0, 100, 0.05);

      const child = createThread(state, "Q1 Deep-Dive", "cfo", parent.id);
      postMessage(state, "broadcast", "cfo", [], child.id, "Q1 numbers", 1, 1, 80, 0.03);
      resolveThread(state, child.id, "convergence-heuristic", "Q1 aligned");

      postMessage(state, "broadcast", "ceo", [], parent.id, "Incorporating Q1", 1, 2, 80, 0.03);

      const graph = buildThreadGraph(state);
      const text = renderThreadGraph(graph, state, "full");

      expect(text).toContain("Revenue");
      expect(text).toContain("Q1 Deep-Dive");
      // Tree branch characters (├ for messages within the thread)
      expect(text).toContain("├");
      // Child should show its summary
      expect(text).toContain("Q1 aligned");
    });

    it("shows pending replies with diamond marker", () => {
      const t1 = createThread(state, "Revenue", "ceo");
      postMessage(state, "request-reply", "ceo", ["cfo"], t1.id, "Please respond", 1, 0, 100, 0.05);

      const graph = buildThreadGraph(state);
      const text = renderThreadGraph(graph, state, "full");

      expect(text).toContain("◆");
      expect(text).toContain("awaiting reply");
    });

    it("shows direct message type tags", () => {
      const t1 = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], t1.id, "Opening", 1, 0, 100, 0.05);
      postMessage(state, "direct", "cfo", ["cto"], t1.id, "Hey CTO", 1, 1, 80, 0.03);

      const graph = buildThreadGraph(state);
      const text = renderThreadGraph(graph, state, "full");

      expect(text).toContain("[direct]");
      expect(text).toContain("cfo → cto");
    });
  });

  describe("renderActivityLine", () => {
    it("renders compact activity", () => {
      createThread(state, "Revenue", "ceo");
      createThread(state, "Tech", "ceo");

      const graph = buildThreadGraph(state);
      const line = renderActivityLine(graph);
      expect(line).toContain("Revenue");
      expect(line).toContain("Tech");
      expect(line).toContain("│");
    });

    it("shows pending replies", () => {
      const t1 = createThread(state, "Revenue", "ceo");
      postMessage(state, "request-reply", "ceo", ["cfo"], t1.id, "Respond", 1, 0, 100, 0.05);

      const graph = buildThreadGraph(state);
      const line = renderActivityLine(graph);
      expect(line).toContain("!1");
    });
  });

  describe("renderMessageFlow", () => {
    it("renders git-log-style message flow", () => {
      const t1 = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], t1.id, "Let's discuss revenue", 1, 0, 100, 0.05);
      postMessage(state, "direct", "cfo", ["ceo"], t1.id, "Here's my analysis", 1, 1, 80, 0.03);

      const flow = renderMessageFlow(state, t1.id);
      expect(flow).toContain("Revenue");
      expect(flow).toContain("ceo → all");
      expect(flow).toContain("cfo → ceo");
      expect(flow).toContain("[direct]");
      // Tree-style connectors
      expect(flow).toContain("├");
      expect(flow).toContain("●");
    });

    it("shows pending replies with diamond", () => {
      const t1 = createThread(state, "Revenue", "ceo");
      postMessage(state, "request-reply", "ceo", ["cfo"], t1.id, "Respond please", 1, 0, 100, 0.05);

      const flow = renderMessageFlow(state, t1.id);
      expect(flow).toContain("◆");
      expect(flow).toContain("cfo");
      expect(flow).toContain("awaiting reply");
    });

    it("returns error for unknown thread", () => {
      const flow = renderMessageFlow(state, "fake-thread");
      expect(flow).toContain("not found");
    });
  });
});
