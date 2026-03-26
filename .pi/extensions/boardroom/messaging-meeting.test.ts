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
  preferLocalProviderModel: (model: string | undefined) => {
    if (!model) return undefined;
    if (model.includes("/")) return model;
    if (/^(claude|sonnet|opus|haiku)\b/i.test(model)) return `anthropic/${model}`;
    if (/^(gpt|o[1-9]|codex)\b/i.test(model)) return `openai-codex/${model}`;
    return model;
  },
}));

vi.mock("./round-queue.js", () => ({
  runSemiLiveRound: roundQueueMocks.runSemiLiveRound,
  DEFAULT_ROUND_CONFIG: { maxMessagesPerRound: 20, roundTimeoutSeconds: 180 },
}));

import { runFreeformMessagingMeeting, runStructuredMessagingMeeting } from "./messaging-meeting.js";

function makeAgent(slug: string, name: string, overrides: Partial<AgentConfig> = {}): AgentConfig {
  return {
    slug,
    name,
    description: `${name} role`,
    model: "claude-sonnet-4-6",
    tags: [],
    systemPrompt: `You are ${name}.`,
    filePath: `agents/executive-board/${slug}.md`,
    ...overrides,
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

  it("normalizes fallback model labels in messaging snapshots", async () => {
    const cwd = makeTempDir();
    const agents = [
      makeAgent("ceo", "CEO"),
      makeAgent("cfo", "CFO"),
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

    await runFreeformMessagingMeeting(
      cwd,
      makeBrief("snapshot-model-labels"),
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

    const framingSnapshot = onSnapshot.mock.calls
      .map(([snapshot]) => snapshot)
      .find((snapshot) => snapshot.phaseLabel === "CEO Framing");

    expect(framingSnapshot?.agents).toEqual(expect.arrayContaining([
      expect.objectContaining({ slug: "ceo", modelLabel: "anthropic/claude-sonnet-4-6" }),
      expect.objectContaining({ slug: "cfo", modelLabel: "anthropic/claude-sonnet-4-6" }),
    ]));
  });

  it("preserves partial CEO framing output during force-close", async () => {
    const cwd = makeTempDir();
    const agents = [
      makeAgent("ceo", "CEO"),
      makeAgent("cfo", "CFO"),
    ];
    const controller = new AbortController();
    controller.abort("force-close");

    const partialError = Object.assign(new Error("Subagent was aborted"), {
      partialResult: {
        agent: "ceo",
        content: makeFramingOutput(["cfo"]),
        tokenCount: 90,
        cost: 0.04,
      },
    });

    runtimeMocks.runOne
      .mockRejectedValueOnce(partialError)
      .mockResolvedValueOnce({
        agent: "ceo",
        content: "Final brief from force-close.",
        exitCode: 0,
        tokenCount: 120,
        cost: 0.06,
      });

    const result = await runFreeformMessagingMeeting(
      cwd,
      makeBrief("force-close-partial"),
      agents,
      "freeform",
      "standard",
      makeConstraints(),
      { budget_hard_stop: false, time_hard_stop: false },
      {
        onStatus: vi.fn(),
        onAgentUpdate: vi.fn(),
        onConfirmRoster: vi.fn(async () => ({ action: "approve" })),
        onSnapshot: vi.fn(),
        signal: controller.signal,
      },
    );

    expect(result.disposition).toBe("force-closed");
    expect(fs.readFileSync(result.memoPath, "utf-8")).toContain("Final brief from force-close.");
    expect(fs.readFileSync(result.memoPath, "utf-8")).toContain("Boardroom force-closed");
  });

  it("resets thread and message ids for each meeting", async () => {
    const cwd = makeTempDir();
    const agents = [
      makeAgent("ceo", "CEO"),
      makeAgent("cfo", "CFO"),
      makeAgent("cto", "CTO"),
    ];

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
        content: "First final brief.",
        exitCode: 0,
        tokenCount: 120,
        cost: 0.06,
      })
      .mockResolvedValueOnce({
        agent: "ceo",
        content: makeFramingOutput(["cto"]),
        exitCode: 0,
        tokenCount: 110,
        cost: 0.05,
      })
      .mockResolvedValueOnce({
        agent: "ceo",
        content: "Second final brief.",
        exitCode: 0,
        tokenCount: 130,
        cost: 0.07,
      });

    const first = await runFreeformMessagingMeeting(
      cwd,
      makeBrief("first-meeting"),
      agents,
      "freeform",
      "standard",
      makeConstraints(),
      { budget_hard_stop: false, time_hard_stop: false },
      {
        onStatus: vi.fn(),
        onAgentUpdate: vi.fn(),
        onConfirmRoster: vi.fn(async () => ({ action: "approve" })),
        onSnapshot: vi.fn(),
      },
    );
    const second = await runFreeformMessagingMeeting(
      cwd,
      makeBrief("second-meeting"),
      agents,
      "freeform",
      "standard",
      makeConstraints(),
      { budget_hard_stop: false, time_hard_stop: false },
      {
        onStatus: vi.fn(),
        onAgentUpdate: vi.fn(),
        onConfirmRoster: vi.fn(async () => ({ action: "approve" })),
        onSnapshot: vi.fn(),
      },
    );

    const firstLog = JSON.parse(fs.readFileSync(first.debateJsonPath, "utf-8")) as {
      threads: Array<{ id: string }>;
      messages: Array<{ id: string }>;
    };
    const secondLog = JSON.parse(fs.readFileSync(second.debateJsonPath, "utf-8")) as {
      threads: Array<{ id: string }>;
      messages: Array<{ id: string }>;
    };

    expect(firstLog.threads[0]?.id).toBe("thread-001");
    expect(firstLog.messages[0]?.id).toBe("msg-0001");
    expect(secondLog.threads[0]?.id).toBe("thread-001");
    expect(secondLog.messages[0]?.id).toBe("msg-0001");
  });

  it("applies max roster size to parsed and rejected freeform rosters", async () => {
    const cwd = makeTempDir();
    const agents = [
      makeAgent("ceo", "CEO"),
      makeAgent("cfo", "CFO"),
      makeAgent("cto", "CTO"),
      makeAgent("coo", "COO"),
    ];
    const onConfirmRoster = vi.fn(async (roster: AgentConfig[]) => {
      expect(roster.map((agent) => agent.slug)).toEqual(["cfo"]);
      return { action: "reject" as const };
    });

    runtimeMocks.runOne
      .mockResolvedValueOnce({
        agent: "ceo",
        content: makeFramingOutput(["cfo", "cto", "coo"]),
        exitCode: 0,
        tokenCount: 100,
        cost: 0.05,
      })
      .mockResolvedValueOnce({
        agent: "ceo",
        content: "Final brief after reject.",
        exitCode: 0,
        tokenCount: 120,
        cost: 0.06,
      });

    const result = await runFreeformMessagingMeeting(
      cwd,
      makeBrief("freeform-roster-limit"),
      agents,
      "freeform",
      "quick",
      makeConstraints({ max_roster_size: 1 }),
      { budget_hard_stop: false, time_hard_stop: false },
      {
        onStatus: vi.fn(),
        onAgentUpdate: vi.fn(),
        onConfirmRoster,
        onSnapshot: vi.fn(),
      },
    );

    expect(result.roster).toEqual(["ceo", "cfo"]);
  });

  it("applies max roster size after structured roster edits", async () => {
    const cwd = makeTempDir();
    const agents = [
      makeAgent("ceo", "CEO"),
      makeAgent("cfo", "CFO"),
      makeAgent("cto", "CTO"),
    ];
    const onConfirmRoster = vi.fn(async (roster: AgentConfig[]) => {
      expect(roster.map((agent) => agent.slug)).toEqual(["cfo"]);
      return { action: "edit" as const, roster: ["cto", "cfo"] };
    });

    runtimeMocks.runOne
      .mockResolvedValueOnce({
        agent: "ceo",
        content: makeFramingOutput(["cfo", "cto"]),
        exitCode: 0,
        tokenCount: 100,
        cost: 0.05,
      })
      .mockResolvedValueOnce({
        agent: "ceo",
        content: "Structured final brief.",
        exitCode: 0,
        tokenCount: 120,
        cost: 0.06,
      });

    const result = await runStructuredMessagingMeeting(
      cwd,
      makeBrief("structured-roster-limit"),
      agents,
      "quick",
      makeConstraints({ max_roster_size: 1 }),
      { budget_hard_stop: false, time_hard_stop: false },
      {
        onStatus: vi.fn(),
        onAgentUpdate: vi.fn(),
        onConfirmRoster,
        onSnapshot: vi.fn(),
      },
    );

    expect(result.roster).toEqual(["ceo", "cto"]);
  });

  it("counts the structured stress-test phase as its own semi-live round", async () => {
    const cwd = makeTempDir();
    const agents = [
      makeAgent("ceo", "CEO"),
      makeAgent("cfo", "CFO", { tags: ["stress-test"] }),
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
        content: "Structured final brief.",
        exitCode: 0,
        tokenCount: 120,
        cost: 0.06,
      });

    await runStructuredMessagingMeeting(
      cwd,
      makeBrief("structured-stress-rounds"),
      agents,
      "standard",
      makeConstraints({ max_debate_rounds: 2 }),
      { budget_hard_stop: false, time_hard_stop: false },
      {
        onStatus: vi.fn(),
        onAgentUpdate: vi.fn(),
        onConfirmRoster: vi.fn(async () => ({ action: "approve" })),
        onSnapshot,
      },
    );

    const stressSnapshot = onSnapshot.mock.calls
      .map(([snapshot]) => snapshot)
      .find((snapshot) => snapshot.phaseLabel === "Stress Test");

    expect(roundQueueMocks.runSemiLiveRound).toHaveBeenCalledTimes(2);
    expect(stressSnapshot).toEqual(expect.objectContaining({
      phase: 3,
      roundsUsed: 2,
    }));
  });

  it("stops structured re-engagement when the round budget is exhausted", async () => {
    const cwd = makeTempDir();
    const agents = [
      makeAgent("ceo", "CEO"),
      makeAgent("cfo", "CFO", { tags: ["stress-test"] }),
    ];
    const onStatus = vi.fn();

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
        content: "NEED MORE DATA before we commit.",
        exitCode: 0,
        tokenCount: 80,
        cost: 0.04,
      })
      .mockResolvedValueOnce({
        agent: "ceo",
        content: "Structured final brief.",
        exitCode: 0,
        tokenCount: 120,
        cost: 0.06,
      });

    await runStructuredMessagingMeeting(
      cwd,
      makeBrief("structured-round-budget"),
      agents,
      "standard",
      makeConstraints({ max_debate_rounds: 2 }),
      { budget_hard_stop: false, time_hard_stop: false },
      {
        onStatus,
        onAgentUpdate: vi.fn(),
        onConfirmRoster: vi.fn(async () => ({ action: "approve" })),
        onSnapshot: vi.fn(),
      },
    );

    expect(roundQueueMocks.runSemiLiveRound).toHaveBeenCalledTimes(2);
    expect(runtimeMocks.runOne).toHaveBeenCalledTimes(3);
    expect(onStatus).not.toHaveBeenCalledWith(expect.stringContaining("CEO re-engaging board"));
    expect(onStatus).toHaveBeenCalledWith("Phase 5: CEO final decision...");
  });

  it("falls back to a default thread when CEO emits no workstreams", async () => {
    const cwd = makeTempDir();
    const agents = [
      makeAgent("ceo", "CEO"),
      makeAgent("cfo", "CFO"),
    ];

    runtimeMocks.runOne
      .mockResolvedValueOnce({
        agent: "ceo",
        content: [
          "CEO framing",
          "",
          "```json",
          JSON.stringify({
            workstreams: [],
            roster: [{ name: "cfo", reason: "Finance coverage" }],
            rationale: "Keep the room small.",
          }, null, 2),
          "```",
        ].join("\n"),
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
      makeBrief("default-thread-fallback"),
      agents,
      "freeform",
      "standard",
      makeConstraints(),
      { budget_hard_stop: false, time_hard_stop: false },
      {
        onStatus: vi.fn(),
        onAgentUpdate: vi.fn(),
        onConfirmRoster: vi.fn(async () => ({ action: "approve" })),
        onSnapshot: vi.fn(),
      },
    );

    const debate = JSON.parse(fs.readFileSync(result.debateJsonPath, "utf-8")) as { threads: Array<{ title: string }> };
    expect(debate.threads).toHaveLength(1);
    expect(debate.threads[0]?.title).toBe("General Discussion");
  });
});
