import { describe, it, expect } from "vitest";
import { ConstraintTracker } from "./constraints.js";

describe("ConstraintTracker", () => {
  it("starts in ok state", () => {
    const tracker = new ConstraintTracker({ budget: 50, time_limit_minutes: 30, max_debate_rounds: 5 });
    expect(tracker.budgetState).toBe("ok");
    expect(tracker.timeState).toBe("ok");
    expect(tracker.roundsState).toBe("ok");
    expect(tracker.canContinue(true, true)).toBe(true);
  });

  it("transitions budget to warn at 80%", () => {
    const tracker = new ConstraintTracker({ budget: 10, time_limit_minutes: 30, max_debate_rounds: 5 });
    tracker.addCost(8);
    expect(tracker.budgetState).toBe("warn");
    expect(tracker.canContinue(true, true)).toBe(true);
  });

  it("transitions budget to exceeded at 100%", () => {
    const tracker = new ConstraintTracker({ budget: 10, time_limit_minutes: 30, max_debate_rounds: 5 });
    tracker.addCost(10);
    expect(tracker.budgetState).toBe("exceeded");
    expect(tracker.canContinue(true, true)).toBe(false);
  });

  it("budget exceeded does not block when budget_hard_stop is false", () => {
    const tracker = new ConstraintTracker({ budget: 10, time_limit_minutes: 30, max_debate_rounds: 5 });
    tracker.addCost(15);
    expect(tracker.budgetState).toBe("exceeded");
    expect(tracker.canContinue(false, true)).toBe(true);
  });

  it("tracks rounds and blocks when exceeded", () => {
    const tracker = new ConstraintTracker({ budget: 50, time_limit_minutes: 30, max_debate_rounds: 2 });
    tracker.incrementRound();
    expect(tracker.roundsState).toBe("ok");
    tracker.incrementRound();
    expect(tracker.roundsState).toBe("exceeded");
    expect(tracker.canContinue(true, true)).toBe(false);
  });

  it("produces a summary string", () => {
    const tracker = new ConstraintTracker({ budget: 50, time_limit_minutes: 30, max_debate_rounds: 5 });
    tracker.addCost(12.5);
    tracker.incrementRound();
    const summary = tracker.summary;
    expect(summary).toContain("$12.50/$50");
    expect(summary).toContain("1/5 rounds");
  });

  it("reports totalCost", () => {
    const tracker = new ConstraintTracker({ budget: 50, time_limit_minutes: 30, max_debate_rounds: 5 });
    tracker.addCost(3.14);
    tracker.addCost(2.86);
    expect(tracker.totalCost).toBeCloseTo(6);
  });
});
