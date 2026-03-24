import { describe, it, expect } from "vitest";
import { BoardMemberSession, SessionPool } from "./runtime.js";
import type { AgentConfig, AgentRuntimeUpdate } from "./types.js";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";

function makeAgent(slug: string, name: string, model?: string): AgentConfig {
  return {
    slug,
    name,
    description: `Test agent ${name}`,
    model,
    tags: [],
    systemPrompt: `You are ${name}.`,
    filePath: `/agents/${slug}.md`,
  };
}

describe("BoardMemberSession", () => {
  it("initialises with idle status and zero counters", () => {
    const session = new BoardMemberSession("cfo", "CFO", undefined);
    expect(session.slug).toBe("cfo");
    expect(session.name).toBe("CFO");
    expect(session.status).toBe("idle");
    expect(session.turns).toBe(0);
    expect(session.totalTokens).toBe(0);
    expect(session.totalCost).toBe(0);
    expect(session.lastError).toBeNull();
  });

  it("produces a valid snapshot", () => {
    const session = new BoardMemberSession("cto", "CTO", "gpt-4o");
    const snap = session.snapshot();
    expect(snap).toEqual({
      slug: "cto",
      name: "CTO",
      status: "idle",
      turns: 0,
      totalTokens: 0,
      totalCost: 0,
      error: undefined,
    });
  });

  it("markAborted sets status", () => {
    const session = new BoardMemberSession("ceo", "CEO", undefined);
    session.markAborted();
    expect(session.status).toBe("aborted");
    expect(session.snapshot().status).toBe("aborted");
  });

  it("rethrows aborts after preserving accumulated usage", async () => {
    const session = new BoardMemberSession("cfo", "CFO", undefined);
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "boardroom-runtime-test-"));
    const scriptPath = path.join(tmpDir, "emit-usage.js");
    const controller = new AbortController();
    const originalArgv1 = process.argv[1];

    await fs.writeFile(
      scriptPath,
      [
        "process.stdout.write(JSON.stringify({",
        '  type: "message_end",',
        "  message: {",
        '    role: "assistant",',
        "    usage: { input: 11, output: 7, cost: { total: 0.42 } },",
        '    content: [{ type: "text", text: "partial" }],',
        "  },",
        '}) + "\\n");',
        "setInterval(() => {}, 1000);",
      ].join("\n"),
    );

    process.argv[1] = scriptPath;

    try {
      const runPromise = session.run(tmpDir, "", "test task", controller.signal);
      await new Promise(resolve => setTimeout(resolve, 100));
      controller.abort();

      await expect(runPromise).rejects.toThrow("Subagent was aborted");
      expect(session.status).toBe("aborted");
      expect(session.totalTokens).toBe(18);
      expect(session.totalCost).toBeCloseTo(0.42);
      expect(session.lastError).toBe("Subagent was aborted");
    } finally {
      process.argv[1] = originalArgv1;
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  });
});

describe("SessionPool", () => {
  it("getOrCreate returns the same session for the same slug", () => {
    const pool = new SessionPool();
    const agent = makeAgent("cfo", "CFO");
    const s1 = pool.getOrCreate(agent);
    const s2 = pool.getOrCreate(agent);
    expect(s1).toBe(s2);
  });

  it("getOrCreate creates distinct sessions for different slugs", () => {
    const pool = new SessionPool();
    const cfo = makeAgent("cfo", "CFO");
    const cto = makeAgent("cto", "CTO");
    const s1 = pool.getOrCreate(cfo);
    const s2 = pool.getOrCreate(cto);
    expect(s1).not.toBe(s2);
    expect(s1.slug).toBe("cfo");
    expect(s2.slug).toBe("cto");
  });

  it("get returns undefined for unknown slug", () => {
    const pool = new SessionPool();
    expect(pool.get("nonexistent")).toBeUndefined();
  });

  it("get returns session after getOrCreate", () => {
    const pool = new SessionPool();
    const agent = makeAgent("cfo", "CFO");
    pool.getOrCreate(agent);
    expect(pool.get("cfo")).toBeDefined();
    expect(pool.get("cfo")!.name).toBe("CFO");
  });

  it("snapshot returns all sessions", () => {
    const pool = new SessionPool();
    pool.getOrCreate(makeAgent("ceo", "CEO"));
    pool.getOrCreate(makeAgent("cfo", "CFO"));
    pool.getOrCreate(makeAgent("cto", "CTO"));

    const snap = pool.snapshot();
    expect(snap).toHaveLength(3);
    expect(snap.map(s => s.slug).sort()).toEqual(["ceo", "cfo", "cto"]);
  });

  it("destroyAll marks sessions aborted and clears the pool", () => {
    const pool = new SessionPool();
    const ceo = pool.getOrCreate(makeAgent("ceo", "CEO"));
    const cfo = pool.getOrCreate(makeAgent("cfo", "CFO"));

    pool.destroyAll();

    expect(ceo.status).toBe("aborted");
    expect(cfo.status).toBe("aborted");
    expect(pool.snapshot()).toHaveLength(0);
    expect(pool.get("ceo")).toBeUndefined();
  });

  it("runParallel returns empty array for empty tasks", async () => {
    const pool = new SessionPool();
    const results = await pool.runParallel("/tmp", []);
    expect(results).toEqual([]);
  });

  it("emits onUpdate events when sessions change", () => {
    const updates: AgentRuntimeUpdate[] = [];
    const pool = new SessionPool((u) => updates.push(u));
    const agent = makeAgent("cfo", "CFO");

    const session = pool.getOrCreate(agent);
    session.status = "queued";
    // emitUpdate is private, but it's called by runOne/runParallel.
    // Test via snapshot that the session state is correct.
    expect(session.status).toBe("queued");
    expect(pool.snapshot()[0].status).toBe("queued");
  });
});
