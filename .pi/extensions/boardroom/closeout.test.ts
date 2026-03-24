import { describe, it, expect } from "vitest";
import { buildCloseoutSummary, buildThemedCloseoutLines } from "./closeout.js";
import type { CloseoutInfo } from "./closeout.js";

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
