import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AgentConfig, ConstraintSet, ParsedBrief } from "./types.js";
import type { RosterConfirmation } from "./meeting.js";
import type { MessagingMeetingCallbacks } from "./messaging-meeting.js";

vi.mock("./runner.js", () => ({
  runAgent: vi.fn(),
}));

vi.mock("./round-queue.js", () => ({
  runSemiLiveRound: vi.fn(),
  DEFAULT_ROUND_CONFIG: { maxMessagesPerRound: 20, roundTimeoutSeconds: 180 },
}));

import { runAgent } from "./runner.js";
import { runSemiLiveRound } from "./round-queue.js";
import { resetCounters } from "./thread-manager.js";
import { runFreeformMessagingMeeting, runStructuredMessagingMeeting } from "./messaging-meeting.js";

const mockRunAgent = vi.mocked(runAgent);
const mockRunSemiLiveRound = vi.mocked(runSemiLiveRound);

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

function makeCallbacks(decision: RosterConfirmation): MessagingMeetingCallbacks {
  return {
    onStatus: vi.fn(),
    onConfirmRoster: vi.fn(async () => decision),
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
    resetCounters();
    vi.clearAllMocks();
    mockRunSemiLiveRound.mockResolvedValue({
      messagesPosted: 0,
      failedAgents: 0,
      droppedMessages: 0,
      totalCost: 0,
      totalTokens: 0,
      endReason: "quiet",
    });
  });

  it("keeps thread and message IDs increasing across freeform meetings", async () => {
    const cwd = makeTempDir();
    const agents = [
      makeAgent("ceo", "CEO"),
      makeAgent("cfo", "CFO"),
      makeAgent("cto", "CTO"),
    ];
    const callbacks = makeCallbacks({ action: "approve" });

    mockRunAgent
      .mockResolvedValueOnce({
        agent: "ceo",
        content: makeFramingOutput(["cfo"]),
        exitCode: 0,
        tokenCount: 100,
        cost: 0.05,
      })
      .mockResolvedValueOnce({
        agent: "ceo",
        content: "Final brief for the first meeting.",
        exitCode: 0,
        tokenCount: 120,
        cost: 0.06,
      })
      .mockResolvedValueOnce({
        agent: "ceo",
        content: makeFramingOutput(["cto"]),
        exitCode: 0,
        tokenCount: 100,
        cost: 0.05,
      })
      .mockResolvedValueOnce({
        agent: "ceo",
        content: "Final brief for the second meeting.",
        exitCode: 0,
        tokenCount: 120,
        cost: 0.06,
      });

    const first = await runFreeformMessagingMeeting(
      cwd,
      makeBrief("first-decision"),
      agents,
      "freeform",
      "standard",
      makeConstraints(),
      { budget_hard_stop: false, time_hard_stop: false },
      callbacks,
    );
    const second = await runFreeformMessagingMeeting(
      cwd,
      makeBrief("second-decision"),
      agents,
      "freeform",
      "standard",
      makeConstraints(),
      { budget_hard_stop: false, time_hard_stop: false },
      callbacks,
    );

    const firstLog = JSON.parse(fs.readFileSync(first.debateJsonPath, "utf-8"));
    const secondLog = JSON.parse(fs.readFileSync(second.debateJsonPath, "utf-8"));

    expect(firstLog.threads.map((thread: { id: string }) => thread.id)).toEqual(["thread-001"]);
    expect(firstLog.messages.map((message: { id: string }) => message.id)).toEqual(["msg-0001", "msg-0002"]);
    expect(secondLog.threads.map((thread: { id: string }) => thread.id)).toEqual(["thread-002"]);
    expect(secondLog.messages.map((message: { id: string }) => message.id)).toEqual(["msg-0003", "msg-0004"]);
  });

  it("applies max roster size to parsed and rejected freeform rosters", async () => {
    const cwd = makeTempDir();
    const agents = [
      makeAgent("ceo", "CEO"),
      makeAgent("cfo", "CFO"),
      makeAgent("cto", "CTO"),
      makeAgent("coo", "COO"),
    ];
    const callbacks = makeCallbacks({ action: "reject" });

    mockRunAgent
      .mockResolvedValueOnce({
        agent: "ceo",
        content: makeFramingOutput(["cfo", "cto", "coo"]),
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
      makeBrief("limited-freeform"),
      agents,
      "freeform",
      "quick",
      makeConstraints({ max_roster_size: 1 }),
      { budget_hard_stop: false, time_hard_stop: false },
      callbacks,
    );

    expect(callbacks.onConfirmRoster).toHaveBeenCalledTimes(1);
    expect(vi.mocked(callbacks.onConfirmRoster).mock.calls[0]?.[0].map((agent) => agent.slug)).toEqual(["cfo"]);
    expect(result.roster).toEqual(["ceo", "cfo"]);
    expect(mockRunSemiLiveRound.mock.calls[0]?.[2].map((agent) => agent.slug)).toEqual(["cfo"]);
  });

  it("applies max roster size after structured roster edits", async () => {
    const cwd = makeTempDir();
    const agents = [
      makeAgent("ceo", "CEO"),
      makeAgent("cfo", "CFO"),
      makeAgent("cto", "CTO"),
      makeAgent("coo", "COO"),
    ];
    const callbacks = makeCallbacks({ action: "edit", roster: ["cfo", "cto", "coo"] });

    mockRunAgent
      .mockResolvedValueOnce({
        agent: "ceo",
        content: makeFramingOutput(["cfo", "cto", "coo"]),
        exitCode: 0,
        tokenCount: 100,
        cost: 0.05,
      })
      .mockResolvedValueOnce({
        agent: "ceo",
        content: "No critical disagreements remain.",
        exitCode: 0,
        tokenCount: 80,
        cost: 0.04,
      })
      .mockResolvedValueOnce({
        agent: "ceo",
        content: "Final structured brief.",
        exitCode: 0,
        tokenCount: 120,
        cost: 0.06,
      });

    const result = await runStructuredMessagingMeeting(
      cwd,
      makeBrief("limited-structured"),
      agents,
      "quick",
      makeConstraints({ max_roster_size: 2 }),
      { budget_hard_stop: false, time_hard_stop: false },
      callbacks,
    );

    expect(callbacks.onConfirmRoster).toHaveBeenCalledTimes(1);
    expect(vi.mocked(callbacks.onConfirmRoster).mock.calls[0]?.[0].map((agent) => agent.slug)).toEqual(["cfo", "cto"]);
    expect(result.roster).toEqual(["ceo", "cfo", "cto"]);
    expect(mockRunSemiLiveRound.mock.calls[0]?.[2].map((agent) => agent.slug)).toEqual(["cfo", "cto"]);
  });
});
