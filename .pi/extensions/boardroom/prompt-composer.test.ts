import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { composeFramingPrompt, composeAssessmentPrompt, composeSynthesisPrompt, loadExpertise } from "./prompt-composer.js";
import type { AgentConfig, ConversationEntry, ParsedBrief } from "./types.js";

const mockAgent: AgentConfig = {
  name: "CTO",
  slug: "cto",
  description: "Chief Technology Officer",
  model: "claude-sonnet-4-6:medium",
  systemPrompt: "You are the CTO.",
  filePath: "/agents/cto.md",
};

const mockBrief: ParsedBrief = {
  title: "Test Decision",
  slug: "test-decision",
  content: "Should we adopt GraphQL?",
  filePath: "/briefs/test.md",
  warnings: [],
};

describe("prompt-composer", () => {
  describe("composeFramingPrompt", () => {
    it("includes agent system prompt and brief", () => {
      const prompt = composeFramingPrompt(mockAgent, mockBrief);
      expect(prompt).toContain("You are the CTO.");
      expect(prompt).toContain("Test Decision");
      expect(prompt).toContain("GraphQL");
    });
  });

  describe("composeAssessmentPrompt", () => {
    it("includes framing and instructions to name addressees", () => {
      const prompt = composeAssessmentPrompt(mockAgent, mockBrief, "CEO framing here", [], null);
      expect(prompt).toContain("CEO framing here");
      expect(prompt).toContain("name them explicitly");
    });

    it("includes prior entries when provided", () => {
      const prior: ConversationEntry[] = [{
        id: "e001", from: "cfo", to: ["ceo"], in_response_to: null,
        phase: 2, round: 1, timestamp: "", role: "assessment",
        content: "Budget looks tight.", token_count: 50, cost: 0.1,
      }];
      const prompt = composeAssessmentPrompt(mockAgent, mockBrief, "CEO framing", prior, null);
      expect(prompt).toContain("Budget looks tight");
      expect(prompt).toContain("cfo");
    });

    it("includes expertise when provided", () => {
      const prompt = composeAssessmentPrompt(mockAgent, mockBrief, "framing", [], "Prior meeting insight");
      expect(prompt).toContain("Prior meeting insight");
    });
  });

  describe("composeSynthesisPrompt", () => {
    it("includes all assessments", () => {
      const assessments: ConversationEntry[] = [
        { id: "e001", from: "cto", to: ["ceo"], in_response_to: null, phase: 2, round: 1, timestamp: "", role: "assessment", content: "Tech feasible.", token_count: 50, cost: 0.1 },
        { id: "e002", from: "cfo", to: ["ceo"], in_response_to: null, phase: 2, round: 1, timestamp: "", role: "assessment", content: "Budget ok.", token_count: 50, cost: 0.1 },
      ];
      const prompt = composeSynthesisPrompt(mockAgent, mockBrief, "framing", assessments, null);
      expect(prompt).toContain("Tech feasible");
      expect(prompt).toContain("Budget ok");
    });
  });

  describe("loadExpertise", () => {
    let tmpDir: string;

    beforeEach(() => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "boardroom-test-"));
    });

    afterEach(() => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    it("returns null when file missing", () => {
      expect(loadExpertise(tmpDir, "cto")).toBeNull();
    });

    it("loads expertise content", () => {
      const dir = path.join(tmpDir, "boardroom", "expertise");
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, "cto.md"), "## Meeting: test\n\nInsight here.");
      expect(loadExpertise(tmpDir, "cto")).toContain("Insight here");
    });

    it("limits to last 3 meetings", () => {
      const dir = path.join(tmpDir, "boardroom", "expertise");
      fs.mkdirSync(dir, { recursive: true });
      const meetings = Array.from({ length: 5 }, (_, i) => `\n\n## Meeting: m${i + 1}\n\nInsight ${i + 1}`).join("");
      fs.writeFileSync(path.join(dir, "cto.md"), meetings.trim());

      const expertise = loadExpertise(tmpDir, "cto");
      expect(expertise).not.toContain("Insight 1");
      expect(expertise).not.toContain("Insight 2");
      expect(expertise).toContain("Insight 3");
      expect(expertise).toContain("Insight 4");
      expect(expertise).toContain("Insight 5");
    });
  });
});
