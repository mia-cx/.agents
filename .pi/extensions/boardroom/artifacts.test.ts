import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { writeMemo, writeConversationLog, writeExpertise, listPastMeetings } from "./artifacts.js";
import { createConversationLog, addEntry, closeLog } from "./conversation.js";

describe("artifacts", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "boardroom-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  describe("writeMemo", () => {
    it("writes memo to boardroom/memos/", () => {
      const memoPath = writeMemo(tmpDir, "test-decision", "# Strategic Brief\n\nContent here.", new Date());
      expect(fs.existsSync(memoPath)).toBe(true);
      expect(memoPath).toContain("boardroom/memos/");
      expect(memoPath).toContain("test-decision");
      const content = fs.readFileSync(memoPath, "utf-8");
      expect(content).toContain("Strategic Brief");
    });
  });

  describe("writeConversationLog", () => {
    it("writes JSON and markdown files", () => {
      const log = createConversationLog("test-meeting", "/brief.md", "freeform", "thorough", ["ceo", "cto"]);
      addEntry(log, "e001", "ceo", ["cto"], null, 1, 0, "framing", "CEO framing text", 100, 0.5);
      closeLog(log, "completed");

      const { jsonPath, mdPath } = writeConversationLog(tmpDir, log, new Date());

      expect(fs.existsSync(jsonPath)).toBe(true);
      expect(fs.existsSync(mdPath)).toBe(true);

      const jsonContent = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
      expect(jsonContent.meeting_id).toBe("test-meeting");
      expect(jsonContent.entries.length).toBe(1);
      expect(jsonContent.entries[0].from).toBe("ceo");
      expect(jsonContent.entries[0].to).toEqual(["cto"]);
      expect(jsonContent.entries[0].in_response_to).toBeNull();

      const mdContent = fs.readFileSync(mdPath, "utf-8");
      expect(mdContent).toContain("Board Meeting");
      expect(mdContent).toContain("CEO framing text");
    });
  });

  describe("writeExpertise", () => {
    it("appends expertise to agent file", () => {
      writeExpertise(tmpDir, "cto", "meeting-1", "First insight");
      writeExpertise(tmpDir, "cto", "meeting-2", "Second insight");

      const expertisePath = path.join(tmpDir, "boardroom", "expertise", "cto.md");
      const content = fs.readFileSync(expertisePath, "utf-8");
      expect(content).toContain("meeting-1");
      expect(content).toContain("First insight");
      expect(content).toContain("meeting-2");
      expect(content).toContain("Second insight");
    });
  });

  describe("listPastMeetings", () => {
    it("returns empty when no debates dir", () => {
      expect(listPastMeetings(tmpDir)).toEqual([]);
    });

    it("lists past meetings from JSON files", () => {
      const debatesDir = path.join(tmpDir, "boardroom", "debates");
      fs.mkdirSync(debatesDir, { recursive: true });

      const log1 = createConversationLog("m1", "/b1.md", "freeform", "quick", ["ceo"]);
      closeLog(log1, "completed");
      fs.writeFileSync(path.join(debatesDir, "m1.json"), JSON.stringify(log1));

      const log2 = createConversationLog("m2", "/b2.md", "structured", "thorough", ["ceo", "cto"]);
      closeLog(log2, "budget-exceeded");
      fs.writeFileSync(path.join(debatesDir, "m2.json"), JSON.stringify(log2));

      const meetings = listPastMeetings(tmpDir);
      expect(meetings.length).toBe(2);
    });
  });
});
