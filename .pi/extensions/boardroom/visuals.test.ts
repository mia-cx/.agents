import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { extractMermaidBlocks } from "./visuals.js";
import { writeVisuals } from "./artifacts.js";

describe("extractMermaidBlocks", () => {
  it("returns empty array when no mermaid fences", () => {
    expect(extractMermaidBlocks("No diagrams here.")).toEqual([]);
  });

  it("extracts a single mermaid block", () => {
    const content = [
      "Some text before.",
      "```mermaid",
      "graph TD",
      "  A-->B",
      "```",
      "Some text after.",
    ].join("\n");
    expect(extractMermaidBlocks(content)).toEqual(["graph TD\n  A-->B"]);
  });

  it("extracts multiple mermaid blocks", () => {
    const content = [
      "```mermaid",
      "graph LR",
      "  A-->B",
      "```",
      "Middle text.",
      "```mermaid",
      "pie",
      '  "Slice A": 40',
      '  "Slice B": 60',
      "```",
    ].join("\n");
    const blocks = extractMermaidBlocks(content);
    expect(blocks).toHaveLength(2);
    expect(blocks[0]).toContain("graph LR");
    expect(blocks[1]).toContain("pie");
  });

  it("skips empty mermaid blocks", () => {
    const content = "```mermaid\n\n```";
    expect(extractMermaidBlocks(content)).toEqual([]);
  });

  it("ignores non-mermaid code fences", () => {
    const content = "```json\n{}\n```\n```mermaid\ngraph TD\n  A-->B\n```";
    expect(extractMermaidBlocks(content)).toEqual(["graph TD\n  A-->B"]);
  });
});

describe("writeVisuals", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "visuals-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("creates visuals directory and writes .mmd files", () => {
    const diagrams = [
      { label: "ceo-synthesis", code: "graph TD\n  A-->B" },
    ];
    const paths = writeVisuals(tmpDir, "2026-03-23-test", diagrams);
    expect(paths).toHaveLength(1);
    expect(paths[0]).toContain(".mmd");
    const content = fs.readFileSync(paths[0], "utf-8");
    expect(content).toContain("graph TD");
  });

  it("writes multiple diagrams with numbered suffixes", () => {
    const diagrams = [
      { label: "cfo-assessment", code: "pie\n  A: 40\n  B: 60" },
      { label: "cto-assessment", code: "graph LR\n  X-->Y" },
    ];
    const paths = writeVisuals(tmpDir, "2026-03-23-multi", diagrams);
    expect(paths).toHaveLength(2);
    expect(paths[0]).toContain("-1.mmd");
    expect(paths[1]).toContain("-2.mmd");
  });
});
