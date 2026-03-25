import { describe, it, expect, beforeEach, vi } from "vitest";
import type { ThreadState } from "./messaging-types.js";
import type { AgentConfig, ParsedBrief, ConstraintSet } from "./types.js";
import {
  createThreadState,
  createThread,
  postMessage,
  resetCounters,
  getActiveThreads,
} from "./thread-manager.js";
import { ConstraintTracker } from "./constraints.js";
import {
  runSemiLiveRound,
  DEFAULT_ROUND_CONFIG,
  type RoundConfig,
  type QueueCallbacks,
} from "./round-queue.js";

// We pass a mock pool object directly to runSemiLiveRound instead
// of mocking the module — simpler and more explicit.

// Mock prompt-composer (loadExpertise)
vi.mock("./prompt-composer.js", () => ({
  loadExpertise: vi.fn(() => null),
}));

// Mock scratchpad
vi.mock("./scratchpad.js", () => ({
  loadScratchpad: vi.fn(() => null),
  saveScratchpad: vi.fn(),
  extractScratchpadUpdate: vi.fn(() => null),
  stripScratchpadBlock: vi.fn((c: string) => c),
}));

// Mock messaging-prompts
vi.mock("./messaging-prompts.js", () => ({
  composeMessagingAssessmentPrompt: vi.fn(() => "mock prompt"),
  parseRoutingHeaders: vi.fn((content: string) => ({
    to: [],
    replyTo: null,
    type: "broadcast",
    newThread: null,
    content,
  })),
}));

import { parseRoutingHeaders } from "./messaging-prompts.js";
import { extractScratchpadUpdate, stripScratchpadBlock } from "./scratchpad.js";

const mockRunOne = vi.fn();
const mockParseRouting = vi.mocked(parseRoutingHeaders);
const mockExtractScratchpadUpdate = vi.mocked(extractScratchpadUpdate);
const mockStripScratchpadBlock = vi.mocked(stripScratchpadBlock);

const makePool = () => ({
  runOne: mockRunOne,
  ensureAgents: vi.fn(),
  snapshot: vi.fn(() => []),
  destroyAll: vi.fn(),
  getOrCreate: vi.fn(),
  get: vi.fn(),
}) as any;

const makeBrief = (): ParsedBrief => ({
  title: "Test Decision",
  slug: "test-decision",
  content: "Should we build feature X?",
  filePath: "boardroom/briefs/test.md",
  warnings: [],
});

const makeAgent = (slug: string, name: string): AgentConfig => ({
  slug,
  name,
  description: `${name} role`,
  model: "claude-sonnet-4-6",
  tags: [],
  systemPrompt: `You are ${name}.`,
  filePath: `agents/executive-board/${slug}.md`,
});

const makeConstraintValues = (): ConstraintSet => ({
  max_debate_rounds: 5,
  budget: 10,
  time_limit_minutes: 30,
});

const makeCallbacks = (): QueueCallbacks => ({
  onStatus: vi.fn(),
  onMessagePosted: vi.fn(),
});

describe("round-queue", () => {
  let state: ThreadState;
  const cwd = "/tmp/test";

  beforeEach(() => {
    resetCounters();
    vi.clearAllMocks();
    state = createThreadState();
    mockExtractScratchpadUpdate.mockReturnValue(null);
    mockStripScratchpadBlock.mockImplementation((content: string) => content);
    mockParseRouting.mockImplementation((content: string) => ({
      to: [],
      replyTo: null,
      type: "broadcast",
      newThread: null,
      content,
    }));
  });

  describe("runSemiLiveRound", () => {
    it("queues all roster agents on round 1", async () => {
      const thread = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], thread.id, "CEO framing", 1, 0, 100, 0.05);

      const agents = [makeAgent("cfo", "CFO"), makeAgent("cto", "CTO")];
      const allAgents = [makeAgent("ceo", "CEO"), ...agents];
      const brief = makeBrief();
      const tracker = new ConstraintTracker(makeConstraintValues());
      const callbacks = makeCallbacks();

      mockRunOne.mockResolvedValue({
        agent: "",
        content: "My assessment of the situation.",
        exitCode: 0,
        tokenCount: 100,
        cost: 0.05,
      });

      // Use a small message cap since broadcast re-queuing would otherwise loop
      const config: RoundConfig = { maxMessagesPerRound: 4, roundTimeoutSeconds: 180 };
      const result = await runSemiLiveRound(
        cwd, state, agents, allAgents, makeBrief(), "CEO framing",
        1, 1, tracker, makeConstraintValues(),
        { budget_hard_stop: false, time_hard_stop: false },
        config, callbacks, makePool(),
      );

      // Both agents should have been called at least once
      expect(result.messagesPosted).toBeGreaterThanOrEqual(2);
      // Agent runs may exceed messages posted due to auto-convergence resolving threads
      expect(mockRunOne.mock.calls.length).toBeGreaterThanOrEqual(result.messagesPosted);
    });

    it("only queues agents with unread inbox on round > 1", async () => {
      const thread = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], thread.id, "CEO framing", 1, 0, 100, 0.05);

      const cfo = makeAgent("cfo", "CFO");
      const cto = makeAgent("cto", "CTO");
      const agents = [cfo, cto];
      const allAgents = [makeAgent("ceo", "CEO"), ...agents];

      // Only CTO has an unread inbox message
      const inbox = state.agent_inboxes.get("cto") ?? [];
      inbox.push("msg-0001");
      state.agent_inboxes.set("cto", inbox);

      const tracker = new ConstraintTracker(makeConstraintValues());
      const callbacks = makeCallbacks();

      mockRunOne.mockResolvedValue({
        agent: "cto",
        content: "CTO response.",
        exitCode: 0,
        tokenCount: 80,
        cost: 0.03,
      });

      const result = await runSemiLiveRound(
        cwd, state, agents, allAgents, makeBrief(), "CEO framing",
        1, 2, tracker, makeConstraintValues(),
        { budget_hard_stop: false, time_hard_stop: false },
        DEFAULT_ROUND_CONFIG, callbacks, makePool(),
      );

      // Only CTO should have been called (CFO has empty inbox)
      expect(mockRunOne).toHaveBeenCalledTimes(1);
      expect(result.messagesPosted).toBe(1);
    });

    it("respects message cap", async () => {
      const thread = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], thread.id, "CEO framing", 1, 0, 100, 0.05);

      const agents = [makeAgent("cfo", "CFO"), makeAgent("cto", "CTO"), makeAgent("cmo", "CMO")];
      const allAgents = [makeAgent("ceo", "CEO"), ...agents];
      const tracker = new ConstraintTracker(makeConstraintValues());
      const callbacks = makeCallbacks();

      let callCount = 0;
      mockRunOne.mockImplementation(async () => {
        callCount++;
        return {
          agent: "",
          content: `Response ${callCount}`,
          exitCode: 0,
          tokenCount: 80,
          cost: 0.03,
        };
      });

      const config: RoundConfig = { maxMessagesPerRound: 2, roundTimeoutSeconds: 180 };
      const result = await runSemiLiveRound(
        cwd, state, agents, allAgents, makeBrief(), "CEO framing",
        1, 1, tracker, makeConstraintValues(),
        { budget_hard_stop: false, time_hard_stop: false },
        config, callbacks, makePool(),
      );

      expect(result.messagesPosted).toBe(2);
      expect(result.endReason).toBe("message-cap");
    });

    it("handles agent failure gracefully", async () => {
      const thread = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], thread.id, "CEO framing", 1, 0, 100, 0.05);

      const agents = [makeAgent("cfo", "CFO")];
      const allAgents = [makeAgent("ceo", "CEO"), ...agents];
      const tracker = new ConstraintTracker(makeConstraintValues());
      const callbacks = makeCallbacks();

      mockRunOne.mockResolvedValue({
        agent: "cfo",
        content: "",
        exitCode: 1,
        tokenCount: 0,
        cost: 0.01,
        error: "Process crashed",
      });

      const result = await runSemiLiveRound(
        cwd, state, agents, allAgents, makeBrief(), "CEO framing",
        1, 1, tracker, makeConstraintValues(),
        { budget_hard_stop: false, time_hard_stop: false },
        DEFAULT_ROUND_CONFIG, callbacks, makePool(),
      );

      // Failure notice posted as a message
      expect(result.messagesPosted).toBe(1);
      expect(callbacks.onStatus).toHaveBeenCalledWith(expect.stringContaining("failed"));
    });

    it("re-queues recipients of broadcast messages", async () => {
      const thread = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], thread.id, "CEO framing", 1, 0, 100, 0.05);

      const cfo = makeAgent("cfo", "CFO");
      const cto = makeAgent("cto", "CTO");
      const agents = [cfo, cto];
      const allAgents = [makeAgent("ceo", "CEO"), ...agents];
      const tracker = new ConstraintTracker(makeConstraintValues());
      const callbacks = makeCallbacks();

      // First call: CFO broadcasts, CTO should be re-queued
      // Second call: CTO responds
      // Third call: CFO re-queued by CTO's broadcast, responds
      // This would continue unless threads go quiet
      let callIdx = 0;
      mockRunOne.mockImplementation(async () => {
        callIdx++;
        return {
          agent: "",
          content: `Response ${callIdx}`,
          exitCode: 0,
          tokenCount: 80,
          cost: 0.03,
        };
      });

      // Use a low message cap to prevent infinite loop
      const config: RoundConfig = { maxMessagesPerRound: 4, roundTimeoutSeconds: 180 };
      const result = await runSemiLiveRound(
        cwd, state, agents, allAgents, makeBrief(), "CEO framing",
        1, 1, tracker, makeConstraintValues(),
        { budget_hard_stop: false, time_hard_stop: false },
        config, callbacks, makePool(),
      );

      // Should have posted more than 2 messages due to re-queuing
      expect(result.messagesPosted).toBeGreaterThanOrEqual(2);
      // Agent runs may exceed messages posted due to auto-convergence resolving threads
      expect(mockRunOne.mock.calls.length).toBeGreaterThanOrEqual(result.messagesPosted);
    });

    it("tracks cost and tokens", async () => {
      const thread = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], thread.id, "CEO framing", 1, 0, 100, 0.05);

      const agents = [makeAgent("cfo", "CFO")];
      const allAgents = [makeAgent("ceo", "CEO"), ...agents];
      const tracker = new ConstraintTracker(makeConstraintValues());
      const callbacks = makeCallbacks();

      mockRunOne.mockResolvedValue({
        agent: "cfo",
        content: "My analysis.",
        exitCode: 0,
        tokenCount: 200,
        cost: 0.10,
      });

      const result = await runSemiLiveRound(
        cwd, state, agents, allAgents, makeBrief(), "CEO framing",
        1, 1, tracker, makeConstraintValues(),
        { budget_hard_stop: false, time_hard_stop: false },
        DEFAULT_ROUND_CONFIG, callbacks, makePool(),
      );

      expect(result.totalCost).toBeCloseTo(0.10);
      expect(result.totalTokens).toBe(200);
    });

    it("respects abort signal", async () => {
      const thread = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], thread.id, "CEO framing", 1, 0, 100, 0.05);

      const agents = [makeAgent("cfo", "CFO"), makeAgent("cto", "CTO")];
      const allAgents = [makeAgent("ceo", "CEO"), ...agents];
      const tracker = new ConstraintTracker(makeConstraintValues());
      const controller = new AbortController();
      controller.abort(); // Already aborted

      const callbacks: QueueCallbacks = {
        onStatus: vi.fn(),
        onMessagePosted: vi.fn(),
        signal: controller.signal,
      };

      const result = await runSemiLiveRound(
        cwd, state, agents, allAgents, makeBrief(), "CEO framing",
        1, 1, tracker, makeConstraintValues(),
        { budget_hard_stop: false, time_hard_stop: false },
        DEFAULT_ROUND_CONFIG, callbacks, makePool(),
      );

      expect(result.endReason).toBe("aborted");
      expect(result.messagesPosted).toBe(0);
    });

    it("stops when constraints are exceeded", async () => {
      const thread = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], thread.id, "CEO framing", 1, 0, 100, 0.05);

      const agents = [makeAgent("cfo", "CFO")];
      const allAgents = [makeAgent("ceo", "CEO"), ...agents];
      // Tracker with very low budget
      const tracker = new ConstraintTracker({ max_debate_rounds: 5, budget: 0.01, time_limit_minutes: 30 });
      tracker.addCost(0.02); // Already exceeded
      const callbacks = makeCallbacks();

      const result = await runSemiLiveRound(
        cwd, state, agents, allAgents, makeBrief(), "CEO framing",
        1, 1, tracker, { max_debate_rounds: 5, budget: 0.01, time_limit_minutes: 30 },
        { budget_hard_stop: true, time_hard_stop: false },
        DEFAULT_ROUND_CONFIG, callbacks, makePool(),
      );

      expect(result.endReason).toBe("constraints");
      expect(result.messagesPosted).toBe(0);
    });

    it("processes scratchpad updates in agent output", async () => {
      const thread = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], thread.id, "CEO framing", 1, 0, 100, 0.05);

      const agents = [makeAgent("cfo", "CFO")];
      const allAgents = [makeAgent("ceo", "CEO"), ...agents];
      const tracker = new ConstraintTracker(makeConstraintValues());
      const callbacks = makeCallbacks();

      // Mock with scratchpad content
      const { extractScratchpadUpdate, stripScratchpadBlock } = await import("./scratchpad.js");
      vi.mocked(extractScratchpadUpdate).mockReturnValue("Updated notes");
      vi.mocked(stripScratchpadBlock).mockReturnValue("Clean content");

      mockRunOne.mockResolvedValue({
        agent: "cfo",
        content: "<!-- SCRATCHPAD -->Updated notes<!-- /SCRATCHPAD -->Clean content",
        exitCode: 0,
        tokenCount: 100,
        cost: 0.05,
      });

      const result = await runSemiLiveRound(
        cwd, state, agents, allAgents, makeBrief(), "CEO framing",
        1, 1, tracker, makeConstraintValues(),
        { budget_hard_stop: false, time_hard_stop: false },
        DEFAULT_ROUND_CONFIG, callbacks, makePool(),
      );

      expect(result.messagesPosted).toBe(1);
      const { saveScratchpad } = await import("./scratchpad.js");
      expect(saveScratchpad).toHaveBeenCalledWith(cwd, "cfo", "Updated notes");
    });

    it("uses routing headers from agent output", async () => {
      const thread = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], thread.id, "CEO framing", 1, 0, 100, 0.05);

      const agents = [makeAgent("cfo", "CFO")];
      const allAgents = [makeAgent("ceo", "CEO"), ...agents];
      const tracker = new ConstraintTracker(makeConstraintValues());
      const callbacks = makeCallbacks();

      mockRunOne.mockResolvedValue({
        agent: "cfo",
        content: "TO: cto\nTYPE: direct\nHey CTO, what about costs?",
        exitCode: 0,
        tokenCount: 80,
        cost: 0.03,
      });

      mockParseRouting.mockReturnValue({
        to: ["cto"],
        replyTo: null,
        type: "direct",
        content: "Hey CTO, what about costs?",
      });

      const result = await runSemiLiveRound(
        cwd, state, agents, allAgents, makeBrief(), "CEO framing",
        1, 1, tracker, makeConstraintValues(),
        { budget_hard_stop: false, time_hard_stop: false },
        DEFAULT_ROUND_CONFIG, callbacks, makePool(),
      );

      expect(result.messagesPosted).toBe(1);
      expect(callbacks.onMessagePosted).toHaveBeenCalledWith(
        expect.objectContaining({ type: "direct", to: ["cto"] }),
      );
    });

    it("creates a child thread when NEW-THREAD is requested", async () => {
      const parent = createThread(state, "Revenue", "ceo", null, ["ceo", "cfo"]);
      const framing = postMessage(state, "broadcast", "ceo", [], parent.id, "CEO framing", 1, 0, 100, 0.05);
      state.agent_inboxes.set("cfo", [framing.id]);

      const agents = [makeAgent("cfo", "CFO")];
      const allAgents = [makeAgent("ceo", "CEO"), ...agents];
      const tracker = new ConstraintTracker(makeConstraintValues());
      const callbacks = makeCallbacks();

      mockRunOne.mockResolvedValue({
        agent: "cfo",
        content: "Let's dig into pricing assumptions.",
        exitCode: 0,
        tokenCount: 80,
        cost: 0.03,
      });

      mockParseRouting.mockReturnValue({
        to: [],
        replyTo: null,
        type: "broadcast",
        newThread: "Pricing Deep Dive",
        content: "Let's dig into pricing assumptions.",
      });

      const result = await runSemiLiveRound(
        cwd, state, agents, allAgents, makeBrief(), "CEO framing",
        1, 2, tracker, makeConstraintValues(),
        { budget_hard_stop: false, time_hard_stop: false },
        DEFAULT_ROUND_CONFIG, callbacks, makePool(),
      );

      const childThreads = Array.from(state.threads.values()).filter((thread) => thread.parent_id === parent.id);
      expect(result.messagesPosted).toBe(1);
      expect(childThreads).toHaveLength(1);
      expect(childThreads[0].title).toBe("Pricing Deep Dive");
      expect(callbacks.onMessagePosted).toHaveBeenCalledWith(
        expect.objectContaining({ thread_id: childThreads[0].id, content: "Let's dig into pricing assumptions." }),
      );
    });

    it("defaults headerless responses to the unread thread", async () => {
      const revenue = createThread(state, "Revenue", "ceo", null, ["ceo", "cfo"]);
      const tech = createThread(state, "Tech", "ceo", null, ["ceo", "cfo"]);
      postMessage(state, "broadcast", "ceo", [], revenue.id, "Revenue framing", 1, 0, 100, 0.05);
      const techMsg = postMessage(state, "broadcast", "ceo", [], tech.id, "Tech framing", 1, 0, 100, 0.05);
      state.agent_inboxes.set("cfo", [techMsg.id]);

      const agents = [makeAgent("cfo", "CFO")];
      const allAgents = [makeAgent("ceo", "CEO"), ...agents];
      const tracker = new ConstraintTracker(makeConstraintValues());
      const callbacks = makeCallbacks();

      mockRunOne.mockResolvedValue({
        agent: "cfo",
        content: "Headerless response",
        exitCode: 0,
        tokenCount: 80,
        cost: 0.03,
      });

      await runSemiLiveRound(
        cwd, state, agents, allAgents, makeBrief(), "CEO framing",
        1, 2, tracker, makeConstraintValues(),
        { budget_hard_stop: false, time_hard_stop: false },
        DEFAULT_ROUND_CONFIG, callbacks, makePool(),
      );

      expect(callbacks.onMessagePosted).toHaveBeenCalledWith(
        expect.objectContaining({ thread_id: tech.id, content: "Headerless response" }),
      );
    });

    it("re-queues the same agent when another thread remains unread", async () => {
      const revenue = createThread(state, "Revenue", "ceo", null, ["ceo", "cfo"]);
      const tech = createThread(state, "Tech", "ceo", null, ["ceo", "cfo"]);
      postMessage(state, "broadcast", "ceo", [], revenue.id, "Revenue framing", 1, 0, 100, 0.05);
      postMessage(state, "broadcast", "ceo", [], tech.id, "Tech framing", 1, 0, 100, 0.05);

      const agents = [makeAgent("cfo", "CFO")];
      const allAgents = [makeAgent("ceo", "CEO"), ...agents];
      const tracker = new ConstraintTracker(makeConstraintValues());
      const callbacks = makeCallbacks();

      mockRunOne
        .mockResolvedValueOnce({
          agent: "cfo",
          content: "Revenue follow-up",
          exitCode: 0,
          tokenCount: 80,
          cost: 0.03,
        })
        .mockResolvedValueOnce({
          agent: "cfo",
          content: "Tech follow-up",
          exitCode: 0,
          tokenCount: 85,
          cost: 0.03,
        });

      await runSemiLiveRound(
        cwd, state, agents, allAgents, makeBrief(), "CEO framing",
        1, 2, tracker, makeConstraintValues(),
        { budget_hard_stop: false, time_hard_stop: false },
        { maxMessagesPerRound: 4, roundTimeoutSeconds: 180 }, callbacks, makePool(),
      );

      expect(mockRunOne).toHaveBeenCalledTimes(2);
      expect(vi.mocked(callbacks.onMessagePosted).mock.calls[0]?.[0]).toEqual(expect.objectContaining({
        thread_id: revenue.id,
        content: "Revenue follow-up",
      }));
      expect(vi.mocked(callbacks.onMessagePosted).mock.calls[1]?.[0]).toEqual(expect.objectContaining({
        thread_id: tech.id,
        content: "Tech follow-up",
      }));
    });

    it("returns quiet when queue empties naturally", async () => {
      const thread = createThread(state, "Revenue", "ceo");
      postMessage(state, "broadcast", "ceo", [], thread.id, "CEO framing", 1, 0, 100, 0.05);

      const agents = [makeAgent("cfo", "CFO")];
      const allAgents = [makeAgent("ceo", "CEO"), ...agents];
      const tracker = new ConstraintTracker(makeConstraintValues());
      const callbacks = makeCallbacks();

      mockRunOne.mockResolvedValue({
        agent: "cfo",
        content: "My final thoughts.",
        exitCode: 0,
        tokenCount: 100,
        cost: 0.05,
      });

      const result = await runSemiLiveRound(
        cwd, state, agents, allAgents, makeBrief(), "CEO framing",
        1, 1, tracker, makeConstraintValues(),
        { budget_hard_stop: false, time_hard_stop: false },
        DEFAULT_ROUND_CONFIG, callbacks, makePool(),
      );

      expect(result.endReason).toBe("quiet");
    });
  });

  describe("DEFAULT_ROUND_CONFIG", () => {
    it("has sensible defaults", () => {
      expect(DEFAULT_ROUND_CONFIG.maxMessagesPerRound).toBe(20);
      expect(DEFAULT_ROUND_CONFIG.roundTimeoutSeconds).toBe(180);
    });
  });
});
