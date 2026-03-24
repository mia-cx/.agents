import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { describe, it, expect, vi } from "vitest";
import {
  buildNarrationWidgetLines,
  buildCloseoutSummary,
  buildThemedCloseoutLines,
  findNarrationActiveRange,
  generateHumanReadableSummary,
  getElevenLabsSettings,
  runPostMeetingActions,
  summarizeMemoForNarration,
} from "./closeout.js";
import type { CloseoutInfo, PostMeetingActionsDeps, PostMeetingContext } from "./closeout.js";

const plainTheme = {
  fg: (_color: string, text: string) => text,
  bold: (text: string) => text,
};

function makeInfo(overrides: Partial<CloseoutInfo> = {}): CloseoutInfo {
  return {
    memoPath: "/meetings/memo.md",
    debateJsonPath: "/meetings/debate.json",
    debateMarkdownPath: "/meetings/debate.md",
    visualPaths: [],
    disposition: "completed",
    briefTitle: "Test Brief",
    mode: "freeform",
    totalCost: 2.34,
    elapsedMinutes: 4.2,
    roster: ["ceo", "cto", "cfo"],
    ...overrides,
  };
}

describe("summarizeMemoForNarration", () => {
  it("converts a markdown memo into short plain narration text", () => {
    const memo = [
      "# Strategic Brief",
      "",
      "### Decision",
      "**GREENLIGHT** Option 3 for Vesta.",
      "",
      "### Strategic Question",
      "**Should we build a backup product?**",
      "",
      "### Context & Evidence",
      "- **Splice exited strategically**, not because demand vanished.",
      "- SessionDock is the closest indie competitor.",
      "- LANDR already shipped into the sample-management lane.",
      "",
      "### Risk Assessment",
      "- Willingness to pay is still unproven.",
      "- Desktop engineering experience is thin.",
      "",
      "### Timing",
      "1. Week 2 landing page check.",
      "2. Week 3 technical gate.",
      "",
      "```mermaid",
      "graph TD",
      "  A --> B",
      "```",
    ].join("\n");

    const summary = summarizeMemoForNarration(memo, 800);
    expect(summary).toContain("Boardroom summary for Strategic Brief.");
    expect(summary).toContain("Decision: GREENLIGHT Option 3 for Vesta.");
    expect(summary).toContain("Question: Should we build a backup product.");
    expect(summary).toContain("Reasons:");
    expect(summary).toContain("Risk:");
    expect(summary).toContain("Timing:");
    expect(summary).not.toContain("###");
    expect(summary).not.toContain("**");
    expect(summary).not.toContain("```");
    expect(summary).not.toContain("graph TD");
  });

  it("normalizes symbols and numeric shorthand into spoken English", () => {
    const memo = [
      "# Strategic Brief",
      "",
      "### Decision",
      "Budget is ~$120K with 4.2% churn and a 3x upside.",
      "",
      "### Strategic Question",
      "Can we hit $14.99/mo within 4-6 months?",
    ].join("\n");

    const summary = summarizeMemoForNarration(memo, 2000);
    expect(summary).toContain("approximately one-hundred-and-twenty thousand dollars");
    expect(summary).toContain("four-point-two percent");
    expect(summary).toContain("three times upside");
    expect(summary).toContain("fourteen dollars and ninety-nine cents per month");
    expect(summary).toContain("four to six months");
    expect(summary).not.toContain("$120K");
    expect(summary).not.toContain("4.2%");
    expect(summary).not.toContain("3x");
  });

  it("budgets normalized speech against the max char limit", () => {
    const memo = [
      "# Strategic Brief",
      "",
      "### Decision",
      `${"Spend ~$120K in 4-6 months for 3x upside. ".repeat(20)}`,
      "",
      "### Context & Evidence",
      `- ${"Revenue could hit $14.99/mo with 4.2% churn risk. ".repeat(20)}`,
      "",
      "### Risk Assessment",
      `- ${"Storage could cost $20K-$30K/month. ".repeat(10)}`,
    ].join("\n");

    const summary = summarizeMemoForNarration(memo, 260);
    expect(summary.length).toBeLessThanOrEqual(260);
    expect(summary).not.toContain("$");
    expect(summary).not.toContain("%");
    expect(summary).not.toContain("/mo");
  });

  it("truncates long narration safely", () => {
    const memo = [
      "# Strategic Brief",
      "",
      "### Decision",
      `${"Verylongdecisionword ".repeat(80)}`,
      "",
      "### Context & Evidence",
      `- ${"Evidence. ".repeat(40)}`,
    ].join("\n");

    const summary = summarizeMemoForNarration(memo, 80);
    expect(summary.length).toBeLessThanOrEqual(83);
    expect(summary.endsWith("...")).toBe(true);
  });

  it("uses a larger default narration cap", () => {
    const memo = [
      "# Strategic Brief",
      "",
      "### Decision",
      `${"Verylongdecisionword ".repeat(220)}`,
      "",
      "### Context & Evidence",
      `- ${"Evidence without punctuation ".repeat(80)}`,
    ].join("\n");

    const summary = summarizeMemoForNarration(memo);
    expect(summary.length).toBeGreaterThan(1800);
    expect(summary.length).toBeLessThanOrEqual(5003);
  });

  it("summarizes multi-decision memos instead of fixating on one heading", () => {
    const memo = [
      "# Strategic Brief — Board Synthesis",
      "",
      "## Executive Summary",
      "",
      "1. Counter on structure for the acquisition.",
      "2. Greenlight a trust-first Splice replacement.",
      "",
      "## Decision 1: Acquisition Offer",
      "",
      "### Strategic Question",
      "Should we accept, counter, or decline the acquisition offer?",
      "",
      "### Board Consensus",
      "Counter on structure, increase upfront cash, and keep earnout objective.",
      "",
      "## Decision 2: Splice Studio Replacement",
      "",
      "### Strategic Question",
      "Should Vesta build a Splice replacement, and what should V1 include?",
      "",
      "### Board Decision: GREENLIGHT",
      "Build a trust-first V1 with backup, dependency tracking, and restore history.",
      "",
      "## Cross-Cutting Themes",
      "",
      "1. Trust matters in both decisions.",
      "2. Timing matters because the market window is open now.",
      "",
      "## Final Recommendations",
      "",
      "- Counter on structure for the acquisition.",
      "- Greenlight the trust-first Splice replacement.",
    ].join("\n");

    const summary = summarizeMemoForNarration(memo, 2000);
    expect(summary).toContain("Executive summary:");
    expect(summary).toContain("Decisions covered:");
    expect(summary).toContain("Acquisition Offer:");
    expect(summary).toContain("Splice Studio Replacement:");
    expect(summary).toContain("Questions addressed:");
    expect(summary).toContain("Cross-cutting themes:");
    expect(summary).toContain("Recommendations:");
  });
});

describe("findNarrationActiveRange", () => {
  it("returns the active word range from character timestamps", () => {
    const text = "hello world";
    const alignment = {
      characters: text.split(""),
      characterStartTimesSeconds: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      characterEndTimesSeconds: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1],
    };

    expect(findNarrationActiveRange(text, alignment, 0.15)).toEqual({ start: 0, end: 5 });
    expect(findNarrationActiveRange(text, alignment, 0.75)).toEqual({ start: 6, end: 11 });
  });
});

describe("buildCloseoutSummary", () => {
  it("includes brief title and mode", () => {
    const summary = buildCloseoutSummary(makeInfo());
    expect(summary).toContain("Test Brief");
    expect(summary).toContain("freeform");
  });

  it("includes estimated cost and duration", () => {
    const summary = buildCloseoutSummary(makeInfo());
    expect(summary).toContain("Estimated Cost");
    expect(summary).toContain("$2.34");
    expect(summary).toContain("4.2 minutes");
  });

  it("includes artifact paths", () => {
    const summary = buildCloseoutSummary(makeInfo());
    expect(summary).toContain("/meetings/memo.md");
    expect(summary).toContain("/meetings/debate.json");
    expect(summary).toContain("/meetings/debate.md");
  });

  it("includes visual count when present", () => {
    const summary = buildCloseoutSummary(makeInfo({
      visualPaths: ["/meetings/vis1.mmd", "/meetings/vis2.mmd"],
    }));
    expect(summary).toContain("2 diagrams");
    expect(summary).toContain("/meetings/vis1.mmd");
  });

  it("shows completed disposition", () => {
    const summary = buildCloseoutSummary(makeInfo({ disposition: "completed" }));
    expect(summary).toContain("✓");
    expect(summary).toContain("Completed");
    expect(summary).toContain("successfully");
  });

  it("shows force-closed disposition", () => {
    const summary = buildCloseoutSummary(makeInfo({ disposition: "force-closed" }));
    expect(summary).toContain("⚠");
    expect(summary).toContain("Force-closed");
  });

  it("shows budget-exceeded disposition", () => {
    const summary = buildCloseoutSummary(makeInfo({ disposition: "budget-exceeded" }));
    expect(summary).toContain("💰");
    expect(summary).toContain("Budget reached");
  });

  it("shows aborted disposition", () => {
    const summary = buildCloseoutSummary(makeInfo({ disposition: "aborted" }));
    expect(summary).toContain("✗");
    expect(summary).toContain("Aborted");
    expect(summary).toContain("Partial artifacts");
  });

  it("includes roster", () => {
    const summary = buildCloseoutSummary(makeInfo());
    expect(summary).toContain("ceo, cto, cfo");
  });
});

describe("buildThemedCloseoutLines", () => {
  it("returns themed lines with boardroom header", () => {
    const lines = buildThemedCloseoutLines(makeInfo(), plainTheme);
    const joined = lines.join("\n");
    expect(joined).toContain("BOARDROOM MEETING");
    expect(joined).toContain("COMPLETED");
  });

  it("includes all artifact paths", () => {
    const lines = buildThemedCloseoutLines(makeInfo(), plainTheme);
    const joined = lines.join("\n");
    expect(joined).toContain("/meetings/memo.md");
    expect(joined).toContain("/meetings/debate.json");
  });

  it("shows visuals when present", () => {
    const lines = buildThemedCloseoutLines(
      makeInfo({ visualPaths: ["/vis/chart.mmd"] }),
      plainTheme,
    );
    const joined = lines.join("\n");
    expect(joined).toContain("1 diagram");
    expect(joined).toContain("/vis/chart.mmd");
  });

  it("handles all dispositions", () => {
    for (const disp of ["completed", "force-closed", "budget-exceeded", "aborted"] as const) {
      const lines = buildThemedCloseoutLines(makeInfo({ disposition: disp }), plainTheme);
      expect(lines.length).toBeGreaterThan(5);
    }
  });
});

describe("buildNarrationWidgetLines", () => {
  it("renders a generating indicator while ElevenLabs audio is being created", () => {
    const lines = buildNarrationWidgetLines(
      {
        phase: "generating",
        summaryText: "Boardroom summary for Vesta acquisition.",
        summaryPath: "/meetings/memo-narration.txt",
        indicatorFrame: 2,
      },
      plainTheme,
    );

    const joined = lines.join("\n");
    expect(joined).toContain("Narration");
    expect(joined).toContain("Generating ElevenLabs audio");
    expect(joined).toContain("/meetings/memo-narration.txt");
  });

  it("renders narration summary and speaking indicator", () => {
    const lines = buildNarrationWidgetLines(
      {
        phase: "playing",
        summaryText: "Boardroom summary for Vesta acquisition.",
        summaryPath: "/meetings/memo-narration.txt",
        indicatorFrame: 1,
        activeRange: { start: 10, end: 17 },
      },
      plainTheme,
    );

    const joined = lines.join("\n");
    expect(joined).toContain("Narration");
    expect(joined).toContain("Playing ElevenLabs summary");
    expect(joined).toContain("/meetings/memo-narration.txt");
    expect(joined).toContain("summary");
  });
});

describe("getElevenLabsSettings", () => {
  it("defaults to the preferred boardroom voice", () => {
    const previousKey = process.env.ELEVENLABS_API_KEY;
    const previousVoice = process.env.ELEVENLABS_VOICE_ID;
    const previousModel = process.env.ELEVENLABS_MODEL_ID;
    const previousFormat = process.env.ELEVENLABS_OUTPUT_FORMAT;

    delete process.env.ELEVENLABS_API_KEY;
    delete process.env.ELEVENLABS_VOICE_ID;
    delete process.env.ELEVENLABS_MODEL_ID;
    delete process.env.ELEVENLABS_OUTPUT_FORMAT;

    const settings = getElevenLabsSettings("/tmp/boardroom/memo.md");
    expect(settings.voiceId).toBe("56bWURjYFHyYyVf490Dp");
    expect(settings.modelId).toBe("eleven_multilingual_v2");
    expect(settings.outputFormat).toBe("mp3_44100_128");

    if (previousKey === undefined) delete process.env.ELEVENLABS_API_KEY;
    else process.env.ELEVENLABS_API_KEY = previousKey;
    if (previousVoice === undefined) delete process.env.ELEVENLABS_VOICE_ID;
    else process.env.ELEVENLABS_VOICE_ID = previousVoice;
    if (previousModel === undefined) delete process.env.ELEVENLABS_MODEL_ID;
    else process.env.ELEVENLABS_MODEL_ID = previousModel;
    if (previousFormat === undefined) delete process.env.ELEVENLABS_OUTPUT_FORMAT;
    else process.env.ELEVENLABS_OUTPUT_FORMAT = previousFormat;
  });

  it("loads ElevenLabs settings from boardroom/.env.local", () => {
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "boardroom-env-"));
    const boardroomDir = path.join(tmpRoot, "boardroom");
    fs.mkdirSync(boardroomDir, { recursive: true });
    fs.writeFileSync(
      path.join(boardroomDir, ".env.local"),
      [
        "ELEVENLABS_API_KEY=test-key",
        "ELEVENLABS_VOICE_ID=custom-voice",
        "ELEVENLABS_MODEL_ID=eleven_flash_v2_5",
        "ELEVENLABS_OUTPUT_FORMAT=mp3_22050_32",
      ].join("\n"),
    );
    const memoPath = path.join(boardroomDir, "memos", "memo.md");
    fs.mkdirSync(path.dirname(memoPath), { recursive: true });
    fs.writeFileSync(memoPath, "memo");

    const previousKey = process.env.ELEVENLABS_API_KEY;
    const previousVoice = process.env.ELEVENLABS_VOICE_ID;
    const previousModel = process.env.ELEVENLABS_MODEL_ID;
    const previousFormat = process.env.ELEVENLABS_OUTPUT_FORMAT;
    delete process.env.ELEVENLABS_API_KEY;
    delete process.env.ELEVENLABS_VOICE_ID;
    delete process.env.ELEVENLABS_MODEL_ID;
    delete process.env.ELEVENLABS_OUTPUT_FORMAT;

    const settings = getElevenLabsSettings(memoPath);
    expect(settings.apiKey).toBe("test-key");
    expect(settings.voiceId).toBe("custom-voice");
    expect(settings.modelId).toBe("eleven_flash_v2_5");
    expect(settings.outputFormat).toBe("mp3_22050_32");
    expect(settings.loadedEnvPath).toBe(path.join(boardroomDir, ".env.local"));

    if (previousKey === undefined) delete process.env.ELEVENLABS_API_KEY;
    else process.env.ELEVENLABS_API_KEY = previousKey;
    if (previousVoice === undefined) delete process.env.ELEVENLABS_VOICE_ID;
    else process.env.ELEVENLABS_VOICE_ID = previousVoice;
    if (previousModel === undefined) delete process.env.ELEVENLABS_MODEL_ID;
    else process.env.ELEVENLABS_MODEL_ID = previousModel;
    if (previousFormat === undefined) delete process.env.ELEVENLABS_OUTPUT_FORMAT;
    else process.env.ELEVENLABS_OUTPUT_FORMAT = previousFormat;
  });
});

describe("generateHumanReadableSummary", () => {
  it("always writes the human-readable summary artifact", async () => {
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "boardroom-summary-"));
    const memoPath = path.join(tmpRoot, "memo.md");
    fs.writeFileSync(
      memoPath,
      [
        "# Strategic Brief",
        "",
        "### Decision",
        "Ship the focused replacement.",
        "",
        "### Context & Evidence",
        "- Demand still exists.",
      ].join("\n"),
      "utf-8",
    );

    const result = await generateHumanReadableSummary(memoPath, tmpRoot, {
      summarizeMemo: async () => "This is a spoken summary of the whole memo for ElevenLabs.",
    });
    expect(result.ok).toBe(true);
    expect(result.summaryPath).toBe(path.join(tmpRoot, "memo-narration.txt"));
    expect(result.summaryText).toBe("This is a spoken summary of the whole memo for ElevenLabs.");
    expect(fs.readFileSync(result.summaryPath!, "utf-8")).toContain("spoken summary of the whole memo");
  });

  it("falls back to deterministic summarization when the llm summary fails", async () => {
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "boardroom-summary-fallback-"));
    const memoPath = path.join(tmpRoot, "memo.md");
    fs.writeFileSync(
      memoPath,
      [
        "# Strategic Brief",
        "",
        "### Decision",
        "Ship the focused replacement.",
        "",
        "### Context & Evidence",
        "- Demand still exists.",
      ].join("\n"),
      "utf-8",
    );

    const result = await generateHumanReadableSummary(memoPath, tmpRoot, {
      summarizeMemo: async () => null,
    });
    expect(result.ok).toBe(true);
    expect(result.summaryText).toContain("Boardroom summary for Strategic Brief.");
  });

  it("strips meta commentary from llm narration summaries", async () => {
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "boardroom-summary-meta-"));
    const memoPath = path.join(tmpRoot, "memo.md");
    fs.writeFileSync(
      memoPath,
      [
        "# Strategic Brief",
        "",
        "### Decision",
        "Ship the focused replacement.",
      ].join("\n"),
      "utf-8",
    );

    const result = await generateHumanReadableSummary(memoPath, tmpRoot, {
      summarizeMemo: async () => "Creating a concise TTS narration script that covers the whole memo and stays under 5000 characters. Vesta should build the focused replacement now.",
    });
    expect(result.ok).toBe(true);
    expect(result.summaryText).toBe("Vesta should build the focused replacement now.");
  });

  it("strips narration labels, separators, and character-count boilerplate", async () => {
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "boardroom-summary-labels-"));
    const memoPath = path.join(tmpRoot, "memo.md");
    fs.writeFileSync(memoPath, "# Strategic Brief", "utf-8");

    const result = await generateHumanReadableSummary(memoPath, tmpRoot, {
      summarizeMemo: async () => "Spoken Narration Script: Splice Studio Replacement for Vesta Here is a concise TTS-ready script under 5000 characters: --- Decision: Vesta should build the replacement now. --- Character count: approximately 2,345 characters, under the 5,000 limit.",
    });

    expect(result.ok).toBe(true);
    expect(result.summaryText).toBe("Decision: Vesta should build the replacement now.");
  });

  it("strips a bare narration script prefix before the actual summary", async () => {
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "boardroom-summary-prefix-"));
    const memoPath = path.join(tmpRoot, "memo.md");
    fs.writeFileSync(memoPath, "# Strategic Brief", "utf-8");

    const result = await generateHumanReadableSummary(memoPath, tmpRoot, {
      summarizeMemo: async () =>
        "Narration Script The board discussed whether to accept the acquisition offer and decided to decline it because the price undervalued the company.",
    });

    expect(result.ok).toBe(true);
    expect(result.summaryText).toBe(
      "The board discussed whether to accept the acquisition offer and decided to decline it because the price undervalued the company.",
    );
  });
});

describe("runPostMeetingActions", () => {
  function makeContext(): {
    ctx: PostMeetingContext;
    confirms: Array<{ title: string; body: string }>;
    notifications: Array<{ msg: string; type: "info" | "warning" | "error" }>;
  } {
    const confirms: Array<{ title: string; body: string }> = [];
    const notifications: Array<{ msg: string; type: "info" | "warning" | "error" }> = [];
    return {
      confirms,
      notifications,
      ctx: {
        hasUI: true,
        confirm: async (title, body) => {
          confirms.push({ title, body });
          return false;
        },
        notify: (msg, type) => notifications.push({ msg, type }),
      },
    };
  }

  function makeDeps(overrides: Partial<PostMeetingActionsDeps> = {}): PostMeetingActionsDeps {
    return {
      isCursorAvailable: () => true,
      openInCursor: async () => ({ ok: true }),
      isElevenLabsConfigured: () => true,
      generateHumanReadableSummary: async () => ({
        ok: true,
        summaryPath: "/tmp/narration.txt",
        summaryText: "Boardroom summary for Test Brief.",
      }),
      generateNarration: async () => ({
        ok: true,
        audioPath: "/tmp/narration.mp3",
        summaryPath: "/tmp/narration.txt",
        summaryText: "Boardroom summary for Test Brief.",
      }),
      playAudio: async () => ({ ok: true }),
      ...overrides,
    };
  }

  it("does nothing in headless mode", async () => {
    const { notifications } = makeContext();
    await runPostMeetingActions(
      makeInfo(),
      {
        hasUI: false,
        confirm: async () => false,
        notify: (msg, type) => notifications.push({ msg, type }),
      },
      makeDeps(),
    );
    expect(notifications).toEqual([]);
  });

  it("prompts to open in Cursor when CLI is available", async () => {
    const { ctx, confirms } = makeContext();
    await runPostMeetingActions(makeInfo(), ctx, makeDeps());
    expect(confirms[0]?.title).toBe("Open memo in Cursor?");
  });

  it("notifies when Cursor CLI is missing", async () => {
    const { ctx, notifications } = makeContext();
    await runPostMeetingActions(
      makeInfo(),
      ctx,
      makeDeps({ isCursorAvailable: () => false }),
    );
    expect(notifications.some((n) => n.msg.includes("Cursor CLI not found"))).toBe(true);
  });

  it("prompts for ElevenLabs narration when configured", async () => {
    const { ctx, confirms } = makeContext();
    await runPostMeetingActions(makeInfo(), ctx, makeDeps());
    expect(confirms.some((c) => c.title === "Generate audio narration?")).toBe(true);
  });

  it("notifies when ElevenLabs is not configured", async () => {
    const { ctx, notifications } = makeContext();
    await runPostMeetingActions(
      makeInfo(),
      ctx,
      makeDeps({ isElevenLabsConfigured: () => false }),
    );
    expect(
      notifications.some((n) => n.msg.includes("ElevenLabs is not configured")),
    ).toBe(true);
  });

  it("opens Cursor when confirmed", async () => {
    const notifications: Array<{ msg: string; type: "info" | "warning" | "error" }> = [];
    const openInCursor = vi.fn(async () => ({ ok: true }));
    const ctx: PostMeetingContext = {
      hasUI: true,
      confirm: async (title) => title === "Open memo in Cursor?",
      notify: (msg, type) => notifications.push({ msg, type }),
    };
    await runPostMeetingActions(
      makeInfo(),
      ctx,
      makeDeps({
        openInCursor,
        isElevenLabsConfigured: () => false,
      }),
    );
    expect(openInCursor).toHaveBeenCalledWith("/meetings/memo.md");
    expect(notifications.some((n) => n.msg.includes("Opened memo in Cursor"))).toBe(true);
  });

  it("publishes narration state while audio is playing", async () => {
    vi.useFakeTimers();
    const narrationStates: Array<any> = [];
    const playAudio = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 450));
      return { ok: true };
    });

    const ctx: PostMeetingContext = {
      hasUI: true,
      confirm: async (title) => title !== "Open memo in Cursor?",
      notify: () => {},
      setNarrationState: (state) => narrationStates.push(state),
    };

    const promise = runPostMeetingActions(
      makeInfo(),
      ctx,
      makeDeps({
        playAudio,
        generateNarration: async () => ({
          ok: true,
          audioPath: "/tmp/narration.mp3",
          summaryPath: "/tmp/narration.txt",
          summaryText: "hello world",
          alignment: {
            characters: "hello world".split(""),
            characterStartTimesSeconds: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
            characterEndTimesSeconds: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1],
          },
        }),
      }),
    );

    await vi.advanceTimersByTimeAsync(700);
    await promise;

    expect(playAudio).toHaveBeenCalledWith("/tmp/narration.mp3");
    expect(narrationStates.some((state) => state && state.phase === "playing")).toBe(true);
    expect(narrationStates.at(-1)).toBeNull();
    vi.useRealTimers();
  });

  it("publishes an animated generation state while ElevenLabs audio is being created", async () => {
    vi.useFakeTimers();
    const narrationStates: Array<any> = [];
    const ctx: PostMeetingContext = {
      hasUI: true,
      confirm: async (title) => title === "Generate audio narration?",
      notify: () => {},
      setNarrationState: (state) => narrationStates.push(state),
    };

    const promise = runPostMeetingActions(
      makeInfo({
        summaryPath: "/tmp/narration.txt",
        summaryText: "Boardroom summary for Test Brief.",
      }),
      ctx,
      makeDeps({
        generateNarration: async () => {
          await new Promise((resolve) => setTimeout(resolve, 450));
          return {
            ok: true,
            audioPath: "/tmp/narration.mp3",
            summaryPath: "/tmp/narration.txt",
            summaryText: "Boardroom summary for Test Brief.",
          };
        },
      }),
    );

    await vi.advanceTimersByTimeAsync(500);
    await promise;

    expect(narrationStates.some((state) => state && state.phase === "generating")).toBe(true);
    expect(narrationStates.at(-1)).toBeNull();
    vi.useRealTimers();
  });

  it("reuses the precomputed summary when generating narration", async () => {
    const { ctx } = makeContext();
    const generateNarration = vi.fn(async () => ({
      ok: true,
      audioPath: "/tmp/narration.mp3",
      summaryPath: "/tmp/narration.txt",
      summaryText: "Precomputed spoken summary.",
    }));
    const generateHumanReadableSummary = vi.fn(async () => ({
      ok: true,
      summaryPath: "/tmp/narration.txt",
      summaryText: "Precomputed spoken summary.",
    }));

    await runPostMeetingActions(
      makeInfo({
        summaryPath: "/tmp/narration.txt",
        summaryText: "Precomputed spoken summary.",
      }),
      {
        ...ctx,
        confirm: async (title) => title === "Generate audio narration?",
      },
      makeDeps({
        generateHumanReadableSummary,
        generateNarration,
      }),
    );

    expect(generateHumanReadableSummary).not.toHaveBeenCalled();
    expect(generateNarration).toHaveBeenCalledWith("/meetings/memo.md", "/meetings", {
      summaryText: "Precomputed spoken summary.",
      summaryPath: "/tmp/narration.txt",
    });
  });
});
