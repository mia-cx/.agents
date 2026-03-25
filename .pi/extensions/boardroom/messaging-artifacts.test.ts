import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { writeMessagingLog } from "./messaging-artifacts.js";
import type { MessagingLog } from "./messaging-types.js";

describe("writeMessagingLog", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "boardroom-artifacts-test-"));
    fs.mkdirSync(path.join(tmpDir, "boardroom", "debates"), { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("writes JSON and markdown files", () => {
    const log: MessagingLog = {
      meeting_id: "2026-03-24T00-00-00-test",
      brief: "test-brief.md",
      mode: "freeform",
      constraints: "quick",
      roster: ["ceo", "cto"],
      started_at: new Date().toISOString(),
      ended_at: new Date().toISOString(),
      disposition: "completed",
      total_cost: 0.15,
      threads: [{
        id: "thread-001",
        title: "Revenue Analysis",
        parent_id: null,
        created_by: "ceo",
        created_at: new Date().toISOString(),
        status: "resolved",
        resolution_reason: "ceo-checkpoint",
        resolved_at: new Date().toISOString(),
        audience: ["ceo", "cto"],
        participants: ["ceo", "cto"],
        pending_replies: [],
        message_ids: ["msg-0001", "msg-0002"],
        summary: "Revenue looks promising",
      }],
      messages: [
        {
          id: "msg-0001",
          type: "broadcast",
          from: "ceo",
          to: [],
          in_response_to: null,
          thread_id: "thread-001",
          phase: 1,
          round: 0,
          timestamp: new Date().toISOString(),
          content: "Let's discuss revenue.",
          token_count: 100,
          cost: 0.05,
          delivery_status: "delivered",
        },
        {
          id: "msg-0002",
          type: "direct",
          from: "cto",
          to: ["ceo"],
          in_response_to: "msg-0001",
          thread_id: "thread-001",
          phase: 1,
          round: 1,
          timestamp: new Date().toISOString(),
          content: "Revenue impact is positive.",
          token_count: 80,
          cost: 0.03,
          delivery_status: "delivered",
        },
      ],
    };

    const { jsonPath, mdPath } = writeMessagingLog(tmpDir, log);

    expect(fs.existsSync(jsonPath)).toBe(true);
    expect(fs.existsSync(mdPath)).toBe(true);

    const jsonContent = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    expect(jsonContent.threads).toHaveLength(1);
    expect(jsonContent.messages).toHaveLength(2);

    const mdContent = fs.readFileSync(mdPath, "utf-8");
    expect(mdContent).toContain("Thread Overview");
    expect(mdContent).toContain("Revenue Analysis");
    expect(mdContent).toContain("[broadcast]");
    expect(mdContent).toContain("[direct]");
    expect(mdContent).toContain("✓"); // resolved thread
  });
});
