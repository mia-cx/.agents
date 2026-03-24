import { describe, it, expect, vi } from "vitest";
import { buildCloseoutSummary, buildThemedCloseoutLines, runPostMeetingActions } from "./closeout.js";
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

describe("buildCloseoutSummary", () => {
  it("includes brief title and mode", () => {
    const summary = buildCloseoutSummary(makeInfo());
    expect(summary).toContain("Test Brief");
    expect(summary).toContain("freeform");
  });

  it("includes cost and duration", () => {
    const summary = buildCloseoutSummary(makeInfo());
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
      generateNarration: async () => ({ ok: true, audioPath: "/tmp/narration.mp3" }),
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
});
