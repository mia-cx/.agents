import { describe, expect, it } from "vitest";
import { createExecutionGraph, addNode, finishNode } from "./graph.js";
import { createCycleRecord } from "./stages.js";
import { buildPlainStatusLines, buildStatusLine, renderExecutionTree } from "./ui.js";

describe("ui helpers", () => {
  it("builds a compact status line", () => {
    const cycle = createCycleRecord("/repo", "Fix cycle output");
    expect(buildStatusLine(cycle)).toContain("implementation");
  });

  it("renders a recursive execution tree", () => {
    const graph = createExecutionGraph("demo", "Demo");
    const stageId = addNode(graph, graph.rootId, "stage", "Implementation stage", "running");
    const agentId = addNode(graph, stageId, "agent", "Engineering Orchestrator", "running");
    finishNode(graph, agentId, "completed", "Done");

    const lines = renderExecutionTree(graph);
    expect(lines.join("\n")).toContain("Implementation stage");
    expect(lines.join("\n")).toContain("Engineering Orchestrator");
  });

  it("builds plain status lines with worktree info", () => {
    const cycle = createCycleRecord("/repo", "Build a dev cycle extension", ["As a user, I want planning."]);
    cycle.artifacts.worktreePath = "/repo/.worktrees/cycles/demo";
    cycle.artifacts.branchName = "feat/demo";

    const lines = buildPlainStatusLines(cycle, null);
    expect(lines.join("\n")).toContain("feat/demo");
    expect(lines.join("\n")).toContain(".worktrees/cycles/demo");
  });
});
