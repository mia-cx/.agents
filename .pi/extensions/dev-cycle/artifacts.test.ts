import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { ensureRuntimeGitignore, readCycle, readGraph, writeCycle, writeGraph, writePlanFile } from "./artifacts.js";
import { createExecutionGraph } from "./graph.js";
import { createCycleRecord } from "./stages.js";

describe("artifacts", () => {
  let tempDir = "";

  afterEach(() => {
    if (tempDir) fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("writes and reads cycles and graphs", () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "dev-cycle-artifacts-"));
    const cycle = createCycleRecord(tempDir, "Fix cycle status output");
    writeCycle(tempDir, cycle);

    const graph = createExecutionGraph(cycle.slug, cycle.title);
    writeGraph(tempDir, cycle.slug, graph);

    expect(readCycle(tempDir, cycle.slug)?.slug).toBe(cycle.slug);
    expect(readGraph(tempDir, cycle.slug)?.rootId).toBe(graph.rootId);
  });

  it("adds runtime storage to gitignore once", () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "dev-cycle-gitignore-"));
    fs.writeFileSync(path.join(tempDir, ".gitignore"), "node_modules/\n", "utf-8");

    ensureRuntimeGitignore(tempDir);
    ensureRuntimeGitignore(tempDir);

    const content = fs.readFileSync(path.join(tempDir, ".gitignore"), "utf-8");
    expect(content.match(/\.pi\/dev-cycles\//g)).toHaveLength(1);
  });

  it("writes plan files into plans directory", () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "dev-cycle-plan-"));
    const planPath = writePlanFile(tempDir, "my-cycle", "# Plan");

    expect(planPath).toBe(path.join(tempDir, "plans", "my-cycle.md"));
    expect(fs.readFileSync(planPath, "utf-8")).toBe("# Plan");
  });
});
