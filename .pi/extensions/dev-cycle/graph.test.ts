import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { addNode, attachSubagentResults, createExecutionGraph, finishNode } from "./graph.js";
import { runPiTask } from "./pi-runner.js";

describe("graph helpers", () => {
  let tempDir = "";
  const originalArgv1 = process.argv[1];

  afterEach(() => {
    process.argv[1] = originalArgv1;
    if (tempDir) fs.rmSync(tempDir, { recursive: true, force: true });
  });

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

  it("finishes the graph root when the task runs directly under it", async () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "dev-cycle-pi-"));
    const fakePiPath = path.join(tempDir, "pi");
    fs.writeFileSync(
      fakePiPath,
      [
        "#!/usr/bin/env node",
        'process.stdout.write(JSON.stringify({ type: "message_end", message: { role: "assistant", content: [{ type: "text", text: "ok" }], usage: { input: 1, output: 1, cost: { total: 0 } }, stopReason: "end_turn" } }) + "\\n");',
      ].join("\n"),
      { encoding: "utf-8", mode: 0o755 },
    );
    process.argv[1] = path.join(tempDir, "missing-script.js");

    const graph = createExecutionGraph("demo", "Demo cycle");
    const result = await runPiTask({
      cwd: "/workspace/.pi/extensions/dev-cycle",
      systemPrompt: "",
      task: "Return the word ok.",
      allowExtensions: false,
      graph,
      env: { PATH: `${tempDir}:${process.env.PATH ?? ""}` },
    });

    expect(result.exitCode).toBe(0);
    expect(result.graph.nodes[result.graph.rootId]?.status).toBe("completed");
  });
});
