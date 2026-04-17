import { describe, expect, it } from "vitest";
import {
  approveStage,
  buildIssuePrompt,
  buildPlanPrompt,
  buildPrdPrompt,
  createCycleRecord,
  createSliceIssueBody,
  determineCurrentStage,
  parsePrdDraft,
  parseSliceDraft,
} from "./stages.js";

describe("stages", () => {
  it("creates planned cycles with PRD as the first stage", () => {
    const cycle = createCycleRecord("/repo", "Build a dev cycle extension", [
      "As a developer, I want planning.",
      "As a developer, I want implementation.",
    ]);

    expect(cycle.currentStage).toBe("prd");
    expect(cycle.classification.route).toBe("planned");
  });

  it("advances after approvals", () => {
    const cycle = createCycleRecord("/repo", "Build a dev cycle extension", [
      "As a developer, I want planning.",
      "As a developer, I want implementation.",
    ]);

    approveStage(cycle, "prd");
    expect(determineCurrentStage(cycle)).toBe("issues");
    approveStage(cycle, "issues");
    expect(determineCurrentStage(cycle)).toBe("plan");
  });

  it("parses fenced PRD and slice JSON", () => {
    const prd = parsePrdDraft('```json\n{"title":"PRD: Demo","body":"## Problem Statement"}\n```');
    const slices = parseSliceDraft('```json\n[{"title":"Slice","type":"AFK","summary":"One","acceptanceCriteria":["A"],"blockedBy":[],"userStories":[1]}]\n```');

    expect(prd.title).toBe("PRD: Demo");
    expect(slices[0].title).toBe("Slice");
  });

  it("builds prompts and issue bodies from cycle data", () => {
    const cycle = createCycleRecord("/repo", "Build a dev cycle extension", ["As a developer, I want planning."]);
    cycle.artifacts.prdIssueNumber = 14;
    cycle.artifacts.prdBody = "## Problem Statement\nTest";
    cycle.artifacts.slices = [
      {
        title: "Cycle shell",
        type: "AFK",
        summary: "Create the shell",
        acceptanceCriteria: ["It exists"],
        blockedBy: [],
        userStories: [1],
      },
    ];

    expect(buildPrdPrompt(cycle)).toContain("## Problem Statement");
    expect(buildIssuePrompt(cycle)).toContain("PRD title");
    expect(buildPlanPrompt(cycle)).toContain("Approved slices");
    expect(createSliceIssueBody(cycle, cycle.artifacts.slices[0], [])).toContain("#14");
  });
});
