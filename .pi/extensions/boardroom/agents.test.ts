import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { discoverAgents, findAgent, findAgentsByTag } from "./agents.js";

let tmpDir: string;

function writeAgent(dir: string, filename: string, name: string, description: string, tags?: string): void {
  const tagLine = tags ? `\ntags: "${tags}"` : "";
  const content = [
    "---",
    `name: "${name}"`,
    `description: "${description}"`,
    `model: "test-model"${tagLine}`,
    "---",
    "",
    `You are ${name}. Do your job.`,
  ].join("\n");
  fs.writeFileSync(path.join(dir, filename), content, "utf-8");
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "agents-test-"));
  const agentDir = path.join(tmpDir, "agents", "executive-board");
  fs.mkdirSync(agentDir, { recursive: true });
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("discoverAgents", () => {
  it("discovers agents from markdown files", () => {
    const dir = path.join(tmpDir, "agents", "executive-board");
    writeAgent(dir, "ceo.md", "CEO", "Chief Executive");
    writeAgent(dir, "cto.md", "CTO", "Chief Technology Officer");

    const agents = discoverAgents(tmpDir);
    expect(agents).toHaveLength(2);
    expect(agents.map(a => a.slug).sort()).toEqual(["ceo", "cto"]);
  });

  it("skips orchestrator.md", () => {
    const dir = path.join(tmpDir, "agents", "executive-board");
    writeAgent(dir, "ceo.md", "CEO", "Chief Executive");
    writeAgent(dir, "orchestrator.md", "Orchestrator", "Facilitates board");

    const agents = discoverAgents(tmpDir);
    expect(agents).toHaveLength(1);
    expect(agents[0].slug).toBe("ceo");
  });

  it("parses tags from frontmatter", () => {
    const dir = path.join(tmpDir, "agents", "executive-board");
    writeAgent(dir, "contrarian.md", "Contrarian", "Devil's advocate", "stress-test");
    writeAgent(dir, "moonshot.md", "Moonshot", "Big-bet thinker", "stress-test, creative");

    const agents = discoverAgents(tmpDir);
    const contrarian = agents.find(a => a.slug === "contrarian")!;
    const moonshot = agents.find(a => a.slug === "moonshot")!;

    expect(contrarian.tags).toEqual(["stress-test"]);
    expect(moonshot.tags).toEqual(["stress-test", "creative"]);
  });

  it("defaults tags to empty array when not specified", () => {
    const dir = path.join(tmpDir, "agents", "executive-board");
    writeAgent(dir, "ceo.md", "CEO", "Chief Executive");

    const agents = discoverAgents(tmpDir);
    expect(agents[0].tags).toEqual([]);
  });

  it("returns empty array when directory does not exist", () => {
    const agents = discoverAgents("/nonexistent/path");
    expect(agents).toEqual([]);
  });
});

describe("findAgent", () => {
  it("finds by slug", () => {
    const dir = path.join(tmpDir, "agents", "executive-board");
    writeAgent(dir, "cto.md", "CTO", "Chief Technology Officer");

    const agents = discoverAgents(tmpDir);
    expect(findAgent(agents, "cto")).toBeDefined();
  });

  it("finds by name (case-insensitive)", () => {
    const dir = path.join(tmpDir, "agents", "executive-board");
    writeAgent(dir, "vp-eng.md", "VP of Engineering", "VP Eng");

    const agents = discoverAgents(tmpDir);
    expect(findAgent(agents, "vp of engineering")).toBeDefined();
  });

  it("returns undefined for no match", () => {
    const agents = discoverAgents(tmpDir);
    expect(findAgent(agents, "nobody")).toBeUndefined();
  });
});

describe("findAgentsByTag", () => {
  it("returns agents with matching tag", () => {
    const dir = path.join(tmpDir, "agents", "executive-board");
    writeAgent(dir, "contrarian.md", "Contrarian", "Devil's advocate", "stress-test");
    writeAgent(dir, "moonshot.md", "Moonshot", "Big-bet thinker", "stress-test");
    writeAgent(dir, "ceo.md", "CEO", "Chief Executive");

    const agents = discoverAgents(tmpDir);
    const stressTesters = findAgentsByTag(agents, "stress-test");
    expect(stressTesters).toHaveLength(2);
    expect(stressTesters.map(a => a.slug).sort()).toEqual(["contrarian", "moonshot"]);
  });

  it("returns empty when no agents have the tag", () => {
    const dir = path.join(tmpDir, "agents", "executive-board");
    writeAgent(dir, "ceo.md", "CEO", "Chief Executive");

    const agents = discoverAgents(tmpDir);
    expect(findAgentsByTag(agents, "stress-test")).toEqual([]);
  });

  it("matches tags case-insensitively", () => {
    const dir = path.join(tmpDir, "agents", "executive-board");
    writeAgent(dir, "qa.md", "Head of QA", "QA lead", "Stress-Test");

    const agents = discoverAgents(tmpDir);
    expect(findAgentsByTag(agents, "stress-test")).toHaveLength(1);
  });
});
