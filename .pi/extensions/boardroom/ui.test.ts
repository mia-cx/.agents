import { describe, it, expect } from "vitest";
import { formatDashboardStatus, buildDashboardWidgetLines, buildPlainDashboardLines } from "./ui.js";
import type { MeetingProgressSnapshot } from "./types.js";

const identity = (text: string) => text;
const plainTheme = {
  fg: (_color: string, text: string) => text,
  bold: (text: string) => text,
};

function makeSnapshot(overrides: Partial<MeetingProgressSnapshot> = {}): MeetingProgressSnapshot {
  return {
    meetingId: "test-meeting",
    briefTitle: "Test Brief",
    mode: "freeform",
    constraints: "quick",
    phase: 2,
    phaseLabel: "Debate Round 1",
    round: 1,
    startedAt: "2026-01-01T00:00:00.000Z",
    budgetUsed: 1.20,
    budgetLimit: 5.00,
    elapsedMinutes: 3.2,
    timeLimitMinutes: 10,
    roundsUsed: 1,
    maxRounds: 3,
    roster: ["cto", "cfo"],
    agents: [
      { slug: "cto", name: "CTO", status: "completed", modelLabel: "anthropic/claude-sonnet-4-6:medium", activity: "Completed", turns: 2, totalTokens: 1200, totalCost: 0.45 },
      { slug: "cfo", name: "CFO", status: "streaming", modelLabel: "openai-codex/gpt-5.4:medium", activity: "Evaluating the brief", turns: 1, totalTokens: 600, totalCost: 0.22 },
    ],
    presidentNote: "Reviewing board input.",
    transcript: [
      "[cto] Architecture looks solid for this approach.",
      "[cfo] Budget projections are favorable.",
    ],
    disposition: "in-progress",
    ...overrides,
  };
}

describe("formatDashboardStatus", () => {
  it("includes phase, budget, time, and rounds", () => {
    const status = formatDashboardStatus(makeSnapshot(), plainTheme);
    expect(status).toContain("Debate Round 1");
    expect(status).toContain("est $1.20/$5");
    expect(status).toContain("3.2/10min");
    expect(status).toContain("1/3 rds");
  });

  it("handles zero values", () => {
    const snap = makeSnapshot({
      budgetUsed: 0, budgetLimit: 0, elapsedMinutes: 0,
      timeLimitMinutes: 0, roundsUsed: 0, maxRounds: 0,
    });
    const status = formatDashboardStatus(snap, plainTheme);
    expect(status).toContain("est $0.00/$0");
    expect(status).toContain("0/0 rds");
  });
});

describe("buildDashboardWidgetLines", () => {
  it("includes boardroom header", () => {
    const lines = buildDashboardWidgetLines(makeSnapshot(), plainTheme);
    const joined = lines.join("\n");
    expect(joined).toContain("BOARDROOM");
    expect(joined).toContain("Test Brief");
  });

  it("includes phase and president note", () => {
    const lines = buildDashboardWidgetLines(makeSnapshot(), plainTheme);
    const joined = lines.join("\n");
    expect(joined).toContain("Debate Round 1");
    expect(joined).toContain("Reviewing board input.");
  });

  it("includes budget and time progress bars", () => {
    const lines = buildDashboardWidgetLines(makeSnapshot(), plainTheme);
    const joined = lines.join("\n");
    expect(joined).toContain("Estimated Cost:");
    expect(joined).toContain("Time:");
    expect(joined).toContain("█");
    expect(joined).toContain("░");
  });

  it("uses error styling when budget or time exceed 100%", () => {
    const theme = {
      fg: (color: string, text: string) => `[${color}]${text}[/${color}]`,
      bold: identity,
    };
    const lines = buildDashboardWidgetLines(
      makeSnapshot({
        budgetUsed: 5.5,
        budgetLimit: 5,
        elapsedMinutes: 12,
        timeLimitMinutes: 10,
      }),
      theme,
    );
    const joined = lines.join("\n");
    expect(joined).toMatch(/\[error\]\[[█░]+\]\[\/error\]/);
    expect(joined).toContain("[error]110%[/error]");
    expect(joined).toContain("[error]120%[/error]");
  });

  it("includes board member rows", () => {
    const lines = buildDashboardWidgetLines(makeSnapshot(), plainTheme);
    const joined = lines.join("\n");
    expect(joined).toContain("CTO");
    expect(joined).toContain("completed");
    expect(joined).toContain("anthropic/claude");
    expect(joined).toContain("1.2k tok");
    expect(joined).toContain("CFO");
    expect(joined).toContain("streaming");
    expect(joined).toContain("openai-codex/gpt");
    expect(joined).toContain("600 tok");
    expect(joined).toContain("Evaluating the brief");
  });

  it("renders streaming detail on a separate indented line", () => {
    const lines = buildDashboardWidgetLines(
      makeSnapshot({
        agents: [
          { slug: "cfo", name: "CFO", status: "streaming", activity: "Evaluating the brief", turns: 1, totalTokens: 600, totalCost: 0.22, partialText: "Revenue expansion looks promising but churn remains a concern." },
        ],
      }),
      plainTheme,
      90,
    );
    expect(lines.some((line) => line.includes("↳ Revenue expansion looks promising"))).toBe(true);
  });

  it("shows only the tail line for non-ceo streaming agents", () => {
    const text = Array.from({ length: 20 }, (_, i) => `chunk${i}`).join(" ");
    const lines = buildDashboardWidgetLines(
      makeSnapshot({
        agents: [
          { slug: "cfo", name: "CFO", status: "streaming", activity: "Evaluating the brief", turns: 1, totalTokens: 600, totalCost: 0.22, partialText: text },
        ],
      }),
      plainTheme,
      60,
    );
    const streamLines = lines.filter((line) => line.includes("↳"));
    expect(streamLines).toHaveLength(1);
    expect(streamLines[0]).toContain("chunk");
    expect(streamLines[0]).toContain("chunk19");
  });

  it("caps ceo streaming preview at five tail-aligned lines", () => {
    const text = Array.from({ length: 120 }, (_, i) => `word${i}`).join(" ");
    const lines = buildDashboardWidgetLines(
      makeSnapshot({
        agents: [
          { slug: "ceo", name: "CEO", status: "streaming", activity: "Framing the strategic question", turns: 0, totalTokens: 0, totalCost: 0, partialText: text },
        ],
      }),
      plainTheme,
      70,
    );
    const streamLines = lines.filter((line) => line.includes("↳") || line.startsWith("        "));
    expect(streamLines.length).toBeLessThanOrEqual(5);
    expect(streamLines.join(" ")).toContain("word119");
  });

  it("stretches progress bars on wider viewports", () => {
    const narrow = buildDashboardWidgetLines(makeSnapshot(), plainTheme, 60).join("\n");
    const wide = buildDashboardWidgetLines(makeSnapshot(), plainTheme, 120).join("\n");
    const narrowBar = narrow.match(/Estimated Cost:\s+\[([█░]+)\]/)?.[1];
    const wideBar = wide.match(/Estimated Cost:\s+\[([█░]+)\]/)?.[1];
    expect(narrowBar).toBeTruthy();
    expect(wideBar).toBeTruthy();
    expect((wideBar ?? "").length).toBeGreaterThan((narrowBar ?? "").length);
  });

  it("shows error marker for failed agents", () => {
    const snap = makeSnapshot({
      agents: [
        { slug: "cto", name: "CTO", status: "failed", activity: "Failed", turns: 1, totalTokens: 0, totalCost: 0, error: "timeout" },
      ],
    });
    const lines = buildDashboardWidgetLines(snap, plainTheme);
    const joined = lines.join("\n");
    expect(joined).toContain("[err]");
    expect(joined).toContain("✗");
  });

  it("includes transcript preview", () => {
    const lines = buildDashboardWidgetLines(makeSnapshot(), plainTheme);
    const joined = lines.join("\n");
    expect(joined).toContain("[cto] Architecture looks solid");
    expect(joined).toContain("[cfo] Budget projections");
  });

  it("limits transcript to last 3 entries", () => {
    const snap = makeSnapshot({
      transcript: ["[a] one", "[b] two", "[c] three", "[d] four", "[e] five"],
    });
    const lines = buildDashboardWidgetLines(snap, plainTheme);
    const joined = lines.join("\n");
    expect(joined).not.toContain("[a] one");
    expect(joined).not.toContain("[b] two");
    expect(joined).toContain("[c] three");
    expect(joined).toContain("[d] four");
    expect(joined).toContain("[e] five");
  });

  it("handles empty agents list", () => {
    const snap = makeSnapshot({ agents: [] });
    const lines = buildDashboardWidgetLines(snap, plainTheme);
    const joined = lines.join("\n");
    expect(joined).not.toContain("Board Members:");
  });

  it("renders thread graph lines when provided", () => {
    const lines = buildDashboardWidgetLines(
      makeSnapshot({
        threadGraphLines: [
          "3 threads · 8 msgs · 4 participants (2 active, 1 resolved, 0 closed)",
          "",
          "├─● Revenue Growth Strategy  active · 3 msgs · 2 mbrs",
          "└─✓ Pricing Model Analysis  resolved · 2 msgs",
        ],
      }),
      plainTheme,
    );
    const joined = lines.join("\n");
    expect(joined).toContain("Thread Graph:");
    expect(joined).toContain("Revenue Growth Strategy");
    expect(joined).toContain("Pricing Model Analysis");
  });

});

describe("buildPlainDashboardLines", () => {
  it("produces readable plain-text output", () => {
    const lines = buildPlainDashboardLines(makeSnapshot());
    const joined = lines.join("\n");
    expect(joined).toContain("BOARDROOM");
    expect(joined).toContain("Test Brief");
    expect(joined).toContain("CTO");
    expect(joined).toContain("CFO");
    expect(joined).toContain("anthropic/claude");
    expect(joined).toContain("1.2k tok");
    expect(joined).toContain("Estimated Cost:");
    expect(joined).toContain("Time:");
  });

  it("includes status icons", () => {
    const lines = buildPlainDashboardLines(makeSnapshot());
    const joined = lines.join("\n");
    expect(joined).toContain("✓");
    expect(joined).toContain("◉");
  });

  it("includes thread graph lines when provided", () => {
    const lines = buildPlainDashboardLines(makeSnapshot({
      threadGraphLines: [
        "2 threads · 5 msgs · 3 participants (1 active, 1 resolved, 0 closed)",
        "",
        "└─● Technical Debt Risk  active · 2 msgs",
      ],
    }));
    const joined = lines.join("\n");
    expect(joined).toContain("Thread Graph:");
    expect(joined).toContain("Technical Debt Risk");
  });

});
