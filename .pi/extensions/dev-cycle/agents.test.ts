import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { discoverTeamAgents, selectImplementationOrchestrator, summarizeAgents } from "./agents.js";

function writeAgent(filePath: string, name: string, description: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(
    filePath,
    `---\nname: "${name}"\ndescription: "${description}"\nmodel: "gpt-5.4:medium"\n---\n\nPrompt.\n`,
    "utf-8",
  );
}

describe("agent discovery", () => {
  let tempDir = "";

  afterEach(() => {
    if (tempDir) fs.rmSync(tempDir, { recursive: true, force: true });
    delete process.env.PI_AGENT_DIR;
  });

  it("discovers built-in, user, and project agents", () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "dev-cycle-agents-"));
    writeAgent(path.join(tempDir, "agents", "engineering", "orchestrator.md"), "Engineering Orchestrator", "Runs work.");
    writeAgent(path.join(tempDir, ".pi", "agents", "local.md"), "Local Specialist", "Local work.");

    const userDir = path.join(tempDir, "user-home");
    process.env.PI_AGENT_DIR = userDir;
    writeAgent(path.join(userDir, "agents", "global.md"), "Global Specialist", "Global work.");

    const agents = discoverTeamAgents(tempDir);
    expect(agents.map((agent) => agent.name)).toEqual([
      "Engineering Orchestrator",
      "Global Specialist",
      "Local Specialist",
    ]);
  });

  it("prefers engineering orchestrator when choosing implementation entry point", () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "dev-cycle-orchestrator-"));
    writeAgent(path.join(tempDir, "agents", "engineering", "orchestrator.md"), "Engineering Orchestrator", "Runs work.");
    writeAgent(path.join(tempDir, "agents", "engineering", "developer.md"), "Developer", "Builds work.");

    const orchestrator = selectImplementationOrchestrator(discoverTeamAgents(tempDir));
    expect(orchestrator?.name).toBe("Engineering Orchestrator");
  });

  it("summarizes available team members", () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "dev-cycle-summary-"));
    writeAgent(path.join(tempDir, "agents", "engineering", "developer.md"), "Developer", "Builds work.");
    const summary = summarizeAgents(discoverTeamAgents(tempDir));
    expect(summary).toContain("Developer");
    expect(summary).toContain("built-in");
  });
});
