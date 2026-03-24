import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import {
  loadScratchpad,
  saveScratchpad,
  extractScratchpadUpdate,
  stripScratchpadBlock,
  composeScratchpadInstructions,
} from "./scratchpad.js";

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "scratchpad-test-"));
  fs.mkdirSync(path.join(tmpDir, "boardroom", "scratchpads"), { recursive: true });
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("loadScratchpad", () => {
  it("returns null when no file exists", () => {
    expect(loadScratchpad(tmpDir, "cto")).toBeNull();
  });

  it("returns null for empty file", () => {
    fs.writeFileSync(path.join(tmpDir, "boardroom/scratchpads/cto.md"), "", "utf-8");
    expect(loadScratchpad(tmpDir, "cto")).toBeNull();
  });

  it("reads existing scratchpad content", () => {
    fs.writeFileSync(path.join(tmpDir, "boardroom/scratchpads/cto.md"), "Key fact: budget is $1M\n", "utf-8");
    expect(loadScratchpad(tmpDir, "cto")).toBe("Key fact: budget is $1M");
  });
});

describe("saveScratchpad", () => {
  it("creates the scratchpads directory if needed", () => {
    const newDir = fs.mkdtempSync(path.join(os.tmpdir(), "scratchpad-save-"));
    saveScratchpad(newDir, "cfo", "Revenue target: $5M");
    const content = fs.readFileSync(path.join(newDir, "boardroom/scratchpads/cfo.md"), "utf-8");
    expect(content).toBe("Revenue target: $5M\n");
    fs.rmSync(newDir, { recursive: true, force: true });
  });

  it("overwrites previous content", () => {
    saveScratchpad(tmpDir, "cto", "Version 1");
    saveScratchpad(tmpDir, "cto", "Version 2");
    expect(loadScratchpad(tmpDir, "cto")).toBe("Version 2");
  });
});

describe("extractScratchpadUpdate", () => {
  it("returns null when no scratchpad block", () => {
    expect(extractScratchpadUpdate("Normal agent output")).toBeNull();
  });

  it("extracts content between markers", () => {
    const output = [
      "My assessment is positive.",
      "<!-- SCRATCHPAD -->",
      "Key fact: budget is $1M",
      "Open question: timeline TBD",
      "<!-- /SCRATCHPAD -->",
      "In conclusion...",
    ].join("\n");
    expect(extractScratchpadUpdate(output)).toBe("Key fact: budget is $1M\nOpen question: timeline TBD");
  });

  it("returns null for malformed markers", () => {
    expect(extractScratchpadUpdate("<!-- /SCRATCHPAD -->before<!-- SCRATCHPAD -->")).toBeNull();
  });
});

describe("stripScratchpadBlock", () => {
  it("returns original when no block present", () => {
    expect(stripScratchpadBlock("Normal output")).toBe("Normal output");
  });

  it("removes the scratchpad block from output", () => {
    const output = [
      "Before content.",
      "<!-- SCRATCHPAD -->",
      "Notes here",
      "<!-- /SCRATCHPAD -->",
      "After content.",
    ].join("\n");
    expect(stripScratchpadBlock(output)).toBe("Before content.\n\nAfter content.");
  });
});

describe("composeScratchpadInstructions", () => {
  it("includes 'empty' message when no existing pad", () => {
    const result = composeScratchpadInstructions(null);
    expect(result).toContain("currently empty");
    expect(result).toContain("<!-- SCRATCHPAD -->");
  });

  it("includes existing content when pad has data", () => {
    const result = composeScratchpadInstructions("Key fact: budget is $1M");
    expect(result).toContain("Key fact: budget is $1M");
    expect(result).not.toContain("currently empty");
  });
});
