import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AgentConfig, ConstraintSet, ParsedBrief } from "./types.js";

const runtimeMocks = vi.hoisted(() => ({
  ensureAgents: vi.fn(),
  runOne: vi.fn(),
  snapshot: vi.fn(() => []),
  destroyAll: vi.fn(),
}));

const roundQueueMocks = vi.hoisted(() => ({
  runSemiLiveRound: vi.fn(),
}));

vi.mock("./runtime.js", () => ({
  SessionPool: class {
    constructor(_onUpdate?: unknown) {}

    ensureAgents(...args: unknown[]) {
      return runtimeMocks.ensureAgents(...args);
    }

    runOne(...args: unknown[]) {
      return runtimeMocks.runOne(...args);
    }

    snapshot() {
      return runtimeMocks.snapshot();
    }

    destroyAll(...args: unknown[]) {
      return runtimeMocks.destroyAll(...args);
    }
  },
}));

vi.mock("./round-queue.js", () => ({
  runSemiLiveRound: roundQueueMocks.runSemiLiveRound,
  DEFAULT_ROUND_CONFIG: { maxMessagesPerRound: 20, roundTimeoutSeconds: 180 },
}));

import { runFreeformMessagingMeeting } from "./messaging-meeting.js";

function makeAgent(slug: string, name: string): AgentConfig {
  return {
    slug,
    name,
    description: `${name} role`,
    model: "claude-sonnet-4-6",
    tags: [],
    systemPrompt: `You are ${name}.`,
    filePath: `agents/executive-board/${slug}.md`,
  };
}

function makeBrief(slug: string): ParsedBrief {
  return {
    title: slug.replace(/-/g, " "),
    slug,
    content: "## Context\n\nTest brief content.",
    filePath: `boardroom/briefs/${slug}.md`,
    warnings: [],
  };
}

function makeConstraints(overrides: Partial<ConstraintSet> = {}): ConstraintSet {
  return {
    budget: 10,
    time_limit_minutes: 30,
    max_debate_rounds: 1,
    ...overrides,
  };
}

function makeTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "boardroom-messaging-meeting-"));
}

function makeFramingOutput(roster: string[]): string {
  return [
    "CEO framing",
    "",
    "```json",
    JSON.stringify({
      workstreams: [{ title: "Revenue", description: "Discuss revenue" }],
      roster: roster.map((name) => ({ name, reason: `${name} is needed` })),
      rationale: "Selected for relevant expertise.",
    }, null, 2),
    "```",
  ].join("\n");
}

describe("messaging-meeting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    runtimeMocks.snapshot.mockReturnValue([]);
    roundQueueMocks.runSemiLiveRound.mockResolvedValue({
      messagesPosted: 0,
      failedAgents: 0,
      droppedMessages: 0,
      totalCost: 0,
      totalTokens: 0,
      endReason: "quiet",
    });
  });

  it("emits freeform debate snapshots without crashing", async () => {
    const cwd = makeTempDir();
    const agents = [
      makeAgent("ceo", "CEO"),
      makeAgent("cfo", "CFO"),
      makeAgent("cto", "CTO"),
    ];
    const onSnapshot = vi.fn();

    runtimeMocks.runOne
      .mockResolvedValueOnce({
        agent: "ceo",
        content: makeFramingOutput(["cfo"]),
        exitCode: 0,
        tokenCount: 100,
        cost: 0.05,
      })
      .mockResolvedValueOnce({
        agent: "ceo",
        content: "Final brief.",
        exitCode: 0,
        tokenCount: 120,
        cost: 0.06,
      });

    const result = await runFreeformMessagingMeeting(
      cwd,
      makeBrief("freeform-snapshot"),
      agents,
      "freeform",
      "standard",
      makeConstraints(),
      { budget_hard_stop: false, time_hard_stop: false },
      {
        onStatus: vi.fn(),
        onAgentUpdate: vi.fn(),
        onConfirmRoster: vi.fn(async () => ({ action: "approve" })),
        onSnapshot,
      },
    );

    expect(result.disposition).toBe("completed");
    expect(roundQueueMocks.runSemiLiveRound).toHaveBeenCalledTimes(1);
    expect(runtimeMocks.snapshot).toHaveBeenCalled();
    expect(onSnapshot).toHaveBeenCalledWith(expect.objectContaining({
      phaseLabel: "Debate Round 1",
      presidentNote: "Round 1: semi-live discussion in progress.",
    }));
    expect(fs.existsSync(result.debateJsonPath)).toBe(true);
  });
});
