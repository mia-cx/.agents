import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { writeCycle, readCycle, writeGraph, readGraph } from "./artifacts.js";
import { createExecutionGraph, addNode, finishNode } from "./graph.js";
import { createCycleRecord, approveStage, determineCurrentStage } from "./stages.js";
import { buildPlainStatusLines } from "./ui.js";
import { ensureCycleWorktree, getCycleBranchName, getCycleWorktreePath } from "./worktree.js";

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "dev-cycle-smoke-"));

try {
  const cycle = createCycleRecord(
    tempDir,
    "Build a generic dev-cycle extension",
    [
      "As a developer, I want the workflow to be resumable.",
      "As a developer, I want an explicit implementation trigger.",
    ],
  );

  approveStage(cycle, "prd");
  approveStage(cycle, "issues");
  approveStage(cycle, "plan");

  if (determineCurrentStage(cycle) !== "implementation") {
    throw new Error(`Expected implementation stage, got ${determineCurrentStage(cycle)}`);
  }

  writeCycle(tempDir, cycle);
  const graph = createExecutionGraph(cycle.slug, cycle.title);
  const stageId = addNode(graph, graph.rootId, "stage", "Implementation stage", "running");
  const toolId = addNode(graph, stageId, "tool", "cycle_subagent", "running");
  finishNode(graph, toolId, "completed", "Delegated to Developer");
  finishNode(graph, stageId, "completed", "Stage complete");
  writeGraph(tempDir, cycle.slug, graph);

  const reloadedCycle = readCycle(tempDir, cycle.slug);
  const reloadedGraph = readGraph(tempDir, cycle.slug);
  if (!reloadedCycle || !reloadedGraph) {
    throw new Error("Failed to reload cycle artifacts");
  }

  const worktreePath = getCycleWorktreePath("/repo", cycle.slug);
  const branchName = getCycleBranchName("feat", cycle.slug);
  const ensured = await ensureCycleWorktree("/repo", cycle.slug, "feat", async (_command, args) => {
    if (args[0] === "branch") return { stdout: "", stderr: "", exitCode: 0 };
    if (args[0] === "worktree" && args[2] === "--porcelain") return { stdout: "", stderr: "", exitCode: 0 };
    return { stdout: "", stderr: "", exitCode: 0 };
  });

  console.log("smoke:ok");
  console.log(reloadedCycle.slug);
  console.log(buildPlainStatusLines(reloadedCycle, reloadedGraph).slice(0, 4).join(" | "));
  console.log(`${worktreePath} :: ${branchName} :: reused=${ensured.reused}`);
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
