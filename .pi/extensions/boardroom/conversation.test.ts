import { describe, it, expect } from "vitest";
import { createConversationLog, addEntry, closeLog, compressEntries, extractAddressees, buildAgentAliases } from "./conversation.js";
import type { AgentConfig } from "./types.js";

function makeAgent(name: string, slug: string, tags: string[] = []): AgentConfig {
  return { name, slug, description: "", model: undefined, modelAlt: undefined, tools: undefined, tags, systemPrompt: "", filePath: "" };
}

const testAgents: AgentConfig[] = [
  makeAgent("CTO", "cto"),
  makeAgent("CFO", "cfo"),
  makeAgent("CPO", "cpo"),
  makeAgent("VP of Engineering", "vp-of-engineering"),
  makeAgent("Head of QA", "head-of-qa", ["stress-test"]),
  makeAgent("Contrarian", "contrarian", ["stress-test"]),
  makeAgent("Moonshot", "moonshot", ["stress-test"]),
  makeAgent("Revenue", "revenue"),
  makeAgent("Market Strategist", "market-strategist"),
  makeAgent("Customer Oracle", "customer-oracle"),
  makeAgent("Compounder", "compounder"),
];

describe("conversation", () => {
  describe("createConversationLog", () => {
    it("creates a log with correct initial state", () => {
      const log = createConversationLog("test-id", "/brief.md", "freeform", "thorough", ["ceo", "cto"]);
      expect(log.meeting_id).toBe("test-id");
      expect(log.mode).toBe("freeform");
      expect(log.roster).toEqual(["ceo", "cto"]);
      expect(log.entries).toEqual([]);
      expect(log.total_cost).toBe(0);
    });
  });

  describe("addEntry", () => {
    it("adds entry and accumulates cost", () => {
      const log = createConversationLog("test", "/b.md", "freeform", "thorough", []);
      const entry = addEntry(log, "e001", "ceo", ["cto"], null, 1, 0, "framing", "test content", 100, 0.5);
      expect(log.entries.length).toBe(1);
      expect(log.total_cost).toBeCloseTo(0.5);
      expect(entry.id).toBe("e001");
      expect(entry.from).toBe("ceo");
      expect(entry.to).toEqual(["cto"]);
    });

    it("links entries with in_response_to", () => {
      const log = createConversationLog("test", "/b.md", "freeform", "thorough", []);
      addEntry(log, "e001", "ceo", [], null, 1, 0, "framing", "framing", 100, 0.5);
      const reply = addEntry(log, "e002", "cto", ["ceo"], "e001", 2, 1, "assessment", "response", 200, 1.0);
      expect(reply.in_response_to).toBe("e001");
    });
  });

  describe("closeLog", () => {
    it("sets ended_at and disposition", () => {
      const log = createConversationLog("test", "/b.md", "freeform", "thorough", []);
      closeLog(log, "completed");
      expect(log.ended_at).toBeTruthy();
      expect(log.disposition).toBe("completed");
    });

    it("marks as aborted", () => {
      const log = createConversationLog("test", "/b.md", "freeform", "thorough", []);
      closeLog(log, "aborted");
      expect(log.disposition).toBe("aborted");
    });
  });

  describe("compressEntries", () => {
    it("returns empty string for no entries", () => {
      expect(compressEntries([])).toBe("");
    });

    it("compresses with addressing info", () => {
      const entries = [
        { id: "e001", from: "ceo", to: ["cto", "cfo"], in_response_to: null, phase: 1, round: 0, timestamp: "", role: "framing", content: "Short text", token_count: 10, cost: 0.1 },
      ];
      const compressed = compressEntries(entries);
      expect(compressed).toContain("ceo");
      expect(compressed).toContain("cto, cfo");
      expect(compressed).toContain("Short text");
    });

    it("truncates long content", () => {
      const longContent = "x".repeat(500);
      const entries = [
        { id: "e001", from: "ceo", to: [], in_response_to: null, phase: 1, round: 0, timestamp: "", role: "framing", content: longContent, token_count: 500, cost: 0.1 },
      ];
      const compressed = compressEntries(entries);
      expect(compressed).toContain("...");
      expect(compressed.length).toBeLessThan(longContent.length);
    });
  });

  describe("extractAddressees", () => {
    it("extracts agent slugs mentioned in content", () => {
      const content = "I disagree with the CTO's assessment on this matter.";
      const addressees = extractAddressees(content, ["cto", "cfo", "cpo"], testAgents);
      expect(addressees).toContain("cto");
      expect(addressees).not.toContain("cfo");
    });

    it("matches VP of Engineering by name from agent config", () => {
      const content = "The VP of Engineering raises a valid concern about staffing.";
      const addressees = extractAddressees(content, ["vp-of-engineering", "cfo"], testAgents);
      expect(addressees).toContain("vp-of-engineering");
    });

    it("matches hyphenated slugs as spaced names", () => {
      const content = "Head of QA should review this.";
      const addressees = extractAddressees(content, ["head-of-qa", "cto"], testAgents);
      expect(addressees).toContain("head-of-qa");
    });

    it("matches Market Strategist by name", () => {
      const content = "As the Market Strategist noted, the competitive window is closing.";
      const addressees = extractAddressees(content, ["market-strategist", "cfo"], testAgents);
      expect(addressees).toContain("market-strategist");
      expect(addressees).not.toContain("cfo");
    });

    it("matches Customer Oracle by name", () => {
      const content = "The Customer Oracle flagged churn risk in this segment.";
      const addressees = extractAddressees(content, ["customer-oracle", "cto"], testAgents);
      expect(addressees).toContain("customer-oracle");
    });

    it("matches by initialism for multi-word names", () => {
      const content = "The MS pointed out a strategic window.";
      const addressees = extractAddressees(content, ["market-strategist"], testAgents);
      expect(addressees).toContain("market-strategist");
    });

    it("returns empty for no matches", () => {
      const content = "This is a general statement.";
      const addressees = extractAddressees(content, ["cto", "cfo"], testAgents);
      expect(addressees).toEqual([]);
    });

    it("deduplicates results", () => {
      const content = "The CTO said this and the CTO also said that.";
      const addressees = extractAddressees(content, ["cto"], testAgents);
      expect(addressees).toEqual(["cto"]);
    });
  });

  describe("buildAgentAliases", () => {
    it("generates full name, stripped, and initialism for multi-word name", () => {
      const agent = makeAgent("VP of Engineering", "vp-of-engineering");
      const aliases = buildAgentAliases(agent);
      expect(aliases).toContain("vp of engineering");
      expect(aliases).toContain("vp engineering");
      expect(aliases).toContain("voe");
    });

    it("generates initialism for Market Strategist", () => {
      const agent = makeAgent("Market Strategist", "market-strategist");
      const aliases = buildAgentAliases(agent);
      expect(aliases).toContain("market strategist");
      expect(aliases).toContain("ms");
    });

    it("handles single-word names without initialism", () => {
      const agent = makeAgent("Contrarian", "contrarian");
      const aliases = buildAgentAliases(agent);
      expect(aliases).toContain("contrarian");
      expect(aliases.every(a => a.length > 1)).toBe(true);
    });

    it("handles 3-letter abbreviations", () => {
      const agent = makeAgent("Head of QA", "head-of-qa");
      const aliases = buildAgentAliases(agent);
      expect(aliases).toContain("head of qa");
      expect(aliases).toContain("head qa");
      expect(aliases).toContain("hoq");
    });
  });
});
