import { describe, expect, it } from "vitest";
import { addNode, attachSubagentResults, createExecutionGraph, finishNode } from "./graph.js";

describe("graph helpers", () => {
  it("adds nodes and attaches nested subagent results", () => {
    const graph = createExecutionGraph("demo", "Demo cycle");
    const toolNode = addNode(graph, graph.rootId, "tool", "cycle_subagent", "running");
    const childGraph = createExecutionGraph("child", "Child");
    const nestedAgent = addNode(childGraph, childGraph.rootId, "agent", "Developer", "running");
    finishNode(childGraph, nestedAgent, "completed", "Patched files");

    attachSubagentResults(graph, toolNode, [
      {
        agent: "Developer",
        source: "built-in",
        task: "Implement the feature",
        exitCode: 0,
        output: "Done",
        stderr: "",
        usage: { input: 1, output: 1, cost: 0, turns: 1 },
        graph: childGraph,
      },
    ]);

    const labels = Object.values(graph.nodes).map((node) => node.label);
    expect(labels).toContain("Developer");
    expect(labels).toContain("cycle_subagent");
  });
});
