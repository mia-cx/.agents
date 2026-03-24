import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AgentConfig, ConstraintSet, ParsedBrief } from "./types.js";
import type { MessagingLog } from "./messaging-types.js";

vi.mock("./runner.js", () => ({
  runAgent: vi.fn(),
}));

vi.mock("./messaging-prompts.js", () => ({
  composeMessagingFramingPrompt: vi.fn(() => "framing prompt"),
  composeMessagingSynthesisPrompt: vi.fn(() => "synthesis prompt"),
  parseWorkstreamsFromCeoOutput: vi.fn(() => ({
    workstreams: [
      { title: "Revenue", description: "Review revenue impact" },
      { title: "Technology", description: "Review implementation risk" },
    ],
    roster: [{ name: "cto", reason: "Needs technical review" }],
    rationale: "Need focused technical input",
  })),
}));

vi.mock("./round-queue.js", () => ({
  runSemiLiveRound: vi.fn(),
  DEFAULT_ROUND_CONFIG: { maxMessagesPerRound: 12, roundTimeoutSeconds: 180 },
}));

vi.mock("./artifacts.js", () => ({
  writeMemo: vi.fn(() => "/tmp/memo.md"),
  writeExpertise: vi.fn(),
  writeVisuals: vi.fn(() => []),
}));

vi.mock("./messaging-artifacts.js", () => ({
  writeMessagingLog: vi.fn(() => ({ jsonPath: "/tmp/debate.json", mdPath: "/tmp/debate.md" })),
}));

vi.mock("./scratchpad.js", () => ({
  loadScratchpad: vi.fn(() => null),
  saveScratchpad: vi.fn(),
  extractScratchpadUpdate: vi.fn(() => null),
  stripScratchpadBlock: vi.fn((content: string) => content),
  composeScratchpadInstructions: vi.fn(() => ""),
}));

vi.mock("./prompt-composer.js", () => ({
  loadExpertise: vi.fn(() => null),
}));

import { runFreeformMessagingMeeting, runStructuredMessagingMeeting } from "./messaging-meeting.js";
import { runAgent } from "./runner.js";
import { writeMessagingLog } from "./messaging-artifacts.js";

const mockRunAgent = vi.mocked(runAgent);
const mockWriteMessagingLog = vi.mocked(writeMessagingLog);

const makeBrief = (): ParsedBrief => ({
  title: "Test Decision",
  slug: "test-decision",
  content: "Should we ship the boardroom update?",
  filePath: "boardroom/briefs/test-decision.md",
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

const makeConstraints = (): ConstraintSet => ({
  budget: 0,
  time_limit_minutes: 30,
  max_debate_rounds: 1,
});

const makeCallbacks = () => ({
  onStatus: vi.fn(),
  onConfirmRoster: vi.fn(async () => ({ action: "approve" as const })),
});

describe("messaging-meeting cost accounting", () => {
  let capturedLog: MessagingLog | undefined;

  beforeEach(() => {
    vi.clearAllMocks();
    capturedLog = undefined;
    mockWriteMessagingLog.mockImplementation((_cwd, log) => {
      capturedLog = log;
      return { jsonPath: "/tmp/debate.json", mdPath: "/tmp/debate.md" };
    });
  });

  it("charges CEO framing cost once across freeform workstream threads", async () => {
    mockRunAgent
      .mockResolvedValueOnce({
        agent: "ceo",
        content: "CEO framing",
        exitCode: 0,
        tokenCount: 120,
        cost: 0.12,
      })
      .mockResolvedValueOnce({
        agent: "ceo",
        content: "Final decision",
        exitCode: 0,
        tokenCount: 80,
        cost: 0.08,
      });

    const callbacks = makeCallbacks();
    const result = await runFreeformMessagingMeeting(
      "/tmp/boardroom",
      makeBrief(),
      [makeAgent("ceo", "CEO"), makeAgent("cto", "CTO")],
      "freeform",
      "test",
      makeConstraints(),
      { budget_hard_stop: true, time_hard_stop: false },
      callbacks,
    );

    expect(result.totalCost).toBeCloseTo(0.2);
    expect(capturedLog?.total_cost).toBeCloseTo(0.2);

    const framingMessages = capturedLog?.messages.filter((msg) => msg.phase === 1 && msg.from === "ceo") ?? [];
    expect(framingMessages).toHaveLength(2);
    expect(framingMessages.map((msg) => msg.token_count)).toEqual([120, 0]);
    expect(framingMessages.map((msg) => msg.cost)).toEqual([0.12, 0]);
  });

  it("charges CEO framing cost once across structured workstream threads", async () => {
    mockRunAgent
      .mockResolvedValueOnce({
        agent: "ceo",
        content: "CEO framing",
        exitCode: 0,
        tokenCount: 150,
        cost: 0.15,
      })
      .mockResolvedValueOnce({
        agent: "ceo",
        content: "Final decision",
        exitCode: 0,
        tokenCount: 50,
        cost: 0.05,
      });

    const callbacks = makeCallbacks();
    const result = await runStructuredMessagingMeeting(
      "/tmp/boardroom",
      makeBrief(),
      [makeAgent("ceo", "CEO"), makeAgent("cto", "CTO")],
      "test",
      makeConstraints(),
      { budget_hard_stop: true, time_hard_stop: false },
      callbacks,
    );

    expect(result.totalCost).toBeCloseTo(0.2);
    expect(capturedLog?.total_cost).toBeCloseTo(0.2);

    const framingMessages = capturedLog?.messages.filter((msg) => msg.phase === 1 && msg.from === "ceo") ?? [];
    expect(framingMessages).toHaveLength(2);
    expect(framingMessages.map((msg) => msg.token_count)).toEqual([150, 0]);
    expect(framingMessages.map((msg) => msg.cost)).toEqual([0.15, 0]);
  });
});
