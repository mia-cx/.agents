import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { parseBrief, listBriefs } from "./brief-parser.js";

describe("brief-parser", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "boardroom-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  describe("parseBrief", () => {
    it("parses a full brief with frontmatter", () => {
      const briefPath = path.join(tmpDir, "test.md");
      fs.writeFileSync(briefPath, [
        "---",
        'title: "Test Decision"',
        "constraints: quick",
        "mode: structured",
        "messaging_mode: threading",
        "budget: 10",
        "---",
        "",
        "## Context",
        "Some context here.",
        "",
        "## Decision Required",
        "What to decide.",
        "",
        "## Constraints",
        "Time pressure.",
        "",
        "## Success Criteria",
        "Metrics.",
      ].join("\n"));

      const brief = parseBrief(briefPath);
      expect(brief.title).toBe("Test Decision");
      expect(brief.slug).toBe("test-decision");
      expect(brief.constraints).toBe("quick");
      expect(brief.mode).toBe("structured");
      expect(brief.messagingMode).toBe("threading");
      expect(brief.budgetOverride).toBe(10);
      expect(brief.warnings).toHaveLength(0);
    });

    it("generates warnings for missing recommended sections", () => {
      const briefPath = path.join(tmpDir, "sparse.md");
      fs.writeFileSync(briefPath, [
        "---",
        'title: "Sparse Brief"',
        "---",
        "",
        "Just some text.",
      ].join("\n"));

      const brief = parseBrief(briefPath);
      expect(brief.warnings.length).toBe(4);
      expect(brief.warnings[0]).toContain("Context");
    });

    it("derives title from filename when missing", () => {
      const briefPath = path.join(tmpDir, "my-great-decision.md");
      fs.writeFileSync(briefPath, "Just text, no frontmatter.\n");

      const brief = parseBrief(briefPath);
      expect(brief.title).toBe("my great decision");
    });

    it("handles brief with no frontmatter", () => {
      const briefPath = path.join(tmpDir, "plain.md");
      fs.writeFileSync(briefPath, "No frontmatter here.\n## Context\nSome context.\n");

      const brief = parseBrief(briefPath);
      expect(brief.constraints).toBeUndefined();
      expect(brief.mode).toBeUndefined();
      expect(brief.messagingMode).toBeUndefined();
      expect(brief.content).toContain("Context");
    });
  });

  describe("listBriefs", () => {
    it("returns empty when no briefs dir", () => {
      expect(listBriefs(tmpDir)).toEqual([]);
    });

    it("lists .md files, excluding _template", () => {
      const briefsDir = path.join(tmpDir, "boardroom", "briefs");
      fs.mkdirSync(briefsDir, { recursive: true });
      fs.writeFileSync(path.join(briefsDir, "_template.md"), "template");
      fs.writeFileSync(path.join(briefsDir, "decision-a.md"), "a");
      fs.writeFileSync(path.join(briefsDir, "decision-b.md"), "b");
      fs.writeFileSync(path.join(briefsDir, "notes.txt"), "not a brief");

      const briefs = listBriefs(tmpDir);
      expect(briefs.length).toBe(2);
      expect(briefs.every(b => b.endsWith(".md"))).toBe(true);
      expect(briefs.every(b => !b.includes("_template"))).toBe(true);
    });
  });
});
