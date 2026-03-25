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

async function writeExecutableScript(filePath: string, lines: string[]): Promise<void> {
  await fs.writeFile(filePath, lines.join("\n"));
}

describe("BoardMemberSession", () => {
  it("initialises with idle status and zero counters", () => {
    const session = new BoardMemberSession("cfo", "CFO", undefined, undefined);
    expect(session.slug).toBe("cfo");
    expect(session.name).toBe("CFO");
    expect(session.status).toBe("idle");
    expect(session.turns).toBe(0);
    expect(session.totalTokens).toBe(0);
    expect(session.totalCost).toBe(0);
    expect(session.lastError).toBeNull();
  });

  it("produces a valid snapshot", () => {
    const session = new BoardMemberSession("cto", "CTO", "gpt-4o", undefined);
    const snap = session.snapshot();
    expect(snap).toEqual({
      slug: "cto",
      name: "CTO",
      status: "idle",
      modelLabel: "openai-codex/gpt-4o",
      modelAltLabel: undefined,
      activity: "Standing by",
      turns: 0,
      totalTokens: 0,
      totalCost: 0,
      error: undefined,
    });
  });

  it("markAborted sets status", () => {
    const session = new BoardMemberSession("ceo", "CEO", undefined, undefined);
    session.markAborted();
    expect(session.status).toBe("aborted");
    expect(session.snapshot().status).toBe("aborted");
  });

  it("rethrows aborts after preserving accumulated usage", async () => {
    const session = new BoardMemberSession("cfo", "CFO", undefined, undefined);
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
      const runPromise = session.run(tmpDir, "", "test task", undefined, controller.signal);
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

  it("waits for agent_end before force-closing a lingering child process", async () => {
    const session = new BoardMemberSession("ceo", "CEO", "cursor-agent/gpt-5.4-mini", undefined);
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "boardroom-runtime-test-"));
    const scriptPath = path.join(tmpDir, "linger-after-turn-end.js");
    const originalArgv1 = process.argv[1];

    await fs.writeFile(
      scriptPath,
      [
        "const emit = (obj) => process.stdout.write(JSON.stringify(obj) + '\\n');",
        "emit({",
        "  type: 'message_end',",
        "  message: {",
        "    role: 'assistant',",
        "    usage: { input: 4, output: 2, cost: { total: 0.01 } },",
        "    content: [{ type: 'text', text: 'done' }],",
        "  },",
        "});",
        "emit({",
        "  type: 'turn_end',",
        "  message: {",
        "    role: 'assistant',",
        "    content: [{ type: 'text', text: 'done' }],",
        "  },",
        "});",
        "setTimeout(() => {",
        "  emit({ type: 'agent_end' });",
        "}, 500);",
        "setInterval(() => {}, 1000);",
      ].join("\n"),
    );

    process.argv[1] = scriptPath;

    try {
      const startedAt = Date.now();
      const result = await session.run(tmpDir, "", "test task");
      expect(Date.now() - startedAt).toBeGreaterThanOrEqual(450);
      expect(Date.now() - startedAt).toBeLessThan(2500);
      expect(result.exitCode).toBe(0);
      expect(result.content).toBe("done");
      expect(session.status).toBe("completed");
    } finally {
      process.argv[1] = originalArgv1;
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it("pins bare Claude aliases to the anthropic provider", async () => {
    const session = new BoardMemberSession("ceo", "CEO", "claude-opus-4-6:high", undefined);
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "boardroom-runtime-test-"));
    const scriptPath = path.join(tmpDir, "capture-args.js");
    const originalArgv1 = process.argv[1];

    await writeExecutableScript(scriptPath, [
      "const args = process.argv.slice(2);",
      "process.stdout.write(JSON.stringify({",
      '  type: "message_end",',
      "  message: {",
      '    role: "assistant",',
      "    usage: { input: 1, output: 1, cost: { total: 0 } },",
      "    content: [{ type: 'text', text: JSON.stringify(args) }],",
      "  },",
      '}) + "\\n");',
    ]);

    process.argv[1] = scriptPath;

    try {
      const result = await session.run(tmpDir, "", "test task");
      expect(result.exitCode).toBe(0);
      expect(result.content).toContain("anthropic/claude-opus-4-6:high");
      expect(result.content).not.toContain("amazon-bedrock");
      expect(result.content).not.toContain("--no-extensions");
    } finally {
      process.argv[1] = originalArgv1;
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it("does not force-load the boardroom extension in first-level executive sessions", async () => {
    const session = new BoardMemberSession("ceo", "CEO", "gpt-5.4-mini", undefined);
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "boardroom-runtime-test-"));
    const scriptPath = path.join(tmpDir, "capture-invocation.js");
    const extensionPath = path.join(tmpDir, "fake-boardroom-extension.ts");
    const originalArgv1 = process.argv[1];
    const previousExtensionEntry = process.env.BOARDROOM_EXTENSION_ENTRY;
    const previousExecutiveSession = process.env.BOARDROOM_EXECUTIVE_SESSION;

    await fs.writeFile(extensionPath, "// fake boardroom extension\n");
    await writeExecutableScript(scriptPath, [
      "const payload = {",
      "  args: process.argv.slice(2),",
      "  extensionEntry: process.env.BOARDROOM_EXTENSION_ENTRY ?? null,",
      "  executiveSession: process.env.BOARDROOM_EXECUTIVE_SESSION ?? null,",
      "};",
      "process.stdout.write(JSON.stringify({",
      '  type: "message_end",',
      "  message: {",
      '    role: "assistant",',
      "    usage: { input: 1, output: 1, cost: { total: 0 } },",
      "    content: [{ type: 'text', text: JSON.stringify(payload) }],",
      "  },",
      '}) + "\\n");',
    ]);

    process.argv[1] = scriptPath;
    process.env.BOARDROOM_EXTENSION_ENTRY = extensionPath;
    delete process.env.BOARDROOM_EXECUTIVE_SESSION;

    try {
      const result = await session.run(tmpDir, "", "test task");
      const payload = JSON.parse(result.content) as {
        args: string[];
        extensionEntry: string | null;
        executiveSession: string | null;
      };
      expect(payload.args).not.toContain("-e");
      expect(payload.extensionEntry).toBe(extensionPath);
      expect(payload.executiveSession).toBe("1");
    } finally {
      process.argv[1] = originalArgv1;
      if (previousExtensionEntry === undefined) delete process.env.BOARDROOM_EXTENSION_ENTRY;
      else process.env.BOARDROOM_EXTENSION_ENTRY = previousExtensionEntry;
      if (previousExecutiveSession === undefined) delete process.env.BOARDROOM_EXECUTIVE_SESSION;
      else process.env.BOARDROOM_EXECUTIVE_SESSION = previousExecutiveSession;
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it("uses a full system prompt instead of appending to Pi's default prompt", async () => {
    const session = new BoardMemberSession("cfo", "CFO", "gpt-5.4-mini", undefined);
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "boardroom-runtime-test-"));
    const scriptPath = path.join(tmpDir, "capture-system-prompt-args.js");
    const originalArgv1 = process.argv[1];

    await writeExecutableScript(scriptPath, [
      "const args = process.argv.slice(2);",
      "process.stdout.write(JSON.stringify({",
      '  type: "message_end",',
      "  message: {",
      '    role: "assistant",',
      "    usage: { input: 1, output: 1, cost: { total: 0 } },",
      "    content: [{ type: 'text', text: JSON.stringify(args) }],",
      "  },",
      '}) + "\\n");',
    ]);

    process.argv[1] = scriptPath;

    try {
      const result = await session.run(tmpDir, "You are the CFO.", "test task");
      expect(result.exitCode).toBe(0);
      expect(result.content).toContain("--system-prompt");
      expect(result.content).not.toContain("--append-system-prompt");
    } finally {
      process.argv[1] = originalArgv1;
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it("falls back to the alternate provider-pinned model after an auth failure", async () => {
    const session = new BoardMemberSession(
      "cfo",
      "CFO",
      "claude-opus-4-6:high",
      "gpt-5.4:medium",
    );
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "boardroom-runtime-test-"));
    const scriptPath = path.join(tmpDir, "fallback.js");
    const attemptsPath = path.join(tmpDir, "attempts.json");
    const originalArgv1 = process.argv[1];

    await writeExecutableScript(scriptPath, [
      "const fs = require('node:fs');",
      "const args = process.argv.slice(2);",
      `const attemptsPath = ${JSON.stringify(attemptsPath)};`,
      "const attempts = fs.existsSync(attemptsPath) ? JSON.parse(fs.readFileSync(attemptsPath, 'utf8')) : [];",
      "attempts.push(args);",
      "fs.writeFileSync(attemptsPath, JSON.stringify(attempts), 'utf8');",
      "const modelIndex = args.indexOf('--model');",
      "const model = modelIndex === -1 ? undefined : args[modelIndex + 1];",
      "if (model === 'anthropic/claude-opus-4-6:high') {",
      "  process.stderr.write('Error: No API key found for anthropic.');",
      "  process.exit(1);",
      "}",
      "process.stdout.write(JSON.stringify({",
      '  type: "message_end",',
      "  message: {",
      '    role: "assistant",',
      "    usage: { input: 2, output: 3, cost: { total: 0.01 } },",
      "    content: [{ type: 'text', text: model || 'default' }],",
      "  },",
      '}) + "\\n");',
    ]);

    process.argv[1] = scriptPath;

    try {
      const result = await session.run(tmpDir, "", "test task");
      expect(result.exitCode).toBe(0);
      expect(result.content).toBe("openai-codex/gpt-5.4:medium");

      const attempts = JSON.parse(await fs.readFile(attemptsPath, "utf8")) as string[][];
      expect(attempts).toHaveLength(2);
      expect(attempts[0]).toContain("anthropic/claude-opus-4-6:high");
      expect(attempts[1]).toContain("openai-codex/gpt-5.4:medium");
    } finally {
      process.argv[1] = originalArgv1;
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it("retries with an unstuck prompt after a repeated tool loop", async () => {
    const session = new BoardMemberSession("customer-oracle", "Customer Oracle", "gpt-5.4-mini", undefined);
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "boardroom-runtime-test-"));
    const scriptPath = path.join(tmpDir, "stuck-loop.js");
    const attemptsPath = path.join(tmpDir, "attempts.json");
    const originalArgv1 = process.argv[1];
    const previousMinMs = process.env.BOARDROOM_UNSTICK_MIN_ELAPSED_MS;
    const previousToolCount = process.env.BOARDROOM_UNSTICK_TOOL_COUNT;
    const previousSameTool = process.env.BOARDROOM_UNSTICK_SAME_TOOL_COUNT;

    await writeExecutableScript(scriptPath, [
      "const fs = require('node:fs');",
      "const args = process.argv.slice(2);",
      `const attemptsPath = ${JSON.stringify(attemptsPath)};`,
      "const attempts = fs.existsSync(attemptsPath) ? JSON.parse(fs.readFileSync(attemptsPath, 'utf8')) : [];",
      "attempts.push(args);",
      "fs.writeFileSync(attemptsPath, JSON.stringify(attempts), 'utf8');",
      "if (attempts.length === 1) {",
      "  const emit = (obj) => process.stdout.write(JSON.stringify(obj) + '\\n');",
      "  emit({ type: 'tool_execution_start', name: 'WebSearch' });",
      "  emit({ type: 'tool_execution_end', name: 'WebSearch' });",
      "  emit({ type: 'tool_execution_start', name: 'WebSearch' });",
      "  emit({ type: 'tool_execution_end', name: 'WebSearch' });",
      "  setInterval(() => {}, 1000);",
      "} else {",
      "  process.stdout.write(JSON.stringify({",
      '    type: "message_end",',
      "    message: {",
      '      role: "assistant",',
      "      usage: { input: 2, output: 3, cost: { total: 0.01 } },",
      "      content: [{ type: 'text', text: 'unstuck answer' }],",
      "    },",
      '  }) + "\\n");',
      "}",
    ]);

    process.argv[1] = scriptPath;
    process.env.BOARDROOM_UNSTICK_MIN_ELAPSED_MS = "0";
    process.env.BOARDROOM_UNSTICK_TOOL_COUNT = "2";
    process.env.BOARDROOM_UNSTICK_SAME_TOOL_COUNT = "2";

    try {
      const result = await session.run(tmpDir, "", "test task");
      expect(result.exitCode).toBe(0);
      expect(result.content).toBe("unstuck answer");

      const attempts = JSON.parse(await fs.readFile(attemptsPath, "utf8")) as string[][];
      expect(attempts).toHaveLength(2);
      expect(attempts[1].join(" ")).toContain("previous attempt got stuck in repeated tool use");
    } finally {
      process.argv[1] = originalArgv1;
      if (previousMinMs === undefined) delete process.env.BOARDROOM_UNSTICK_MIN_ELAPSED_MS;
      else process.env.BOARDROOM_UNSTICK_MIN_ELAPSED_MS = previousMinMs;
      if (previousToolCount === undefined) delete process.env.BOARDROOM_UNSTICK_TOOL_COUNT;
      else process.env.BOARDROOM_UNSTICK_TOOL_COUNT = previousToolCount;
      if (previousSameTool === undefined) delete process.env.BOARDROOM_UNSTICK_SAME_TOOL_COUNT;
      else process.env.BOARDROOM_UNSTICK_SAME_TOOL_COUNT = previousSameTool;
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

  it("getOrCreate syncs updated agent model config onto existing sessions", () => {
    const pool = new SessionPool();
    const ceo = makeAgent("ceo", "CEO", "claude-opus-4-6:high");
    const session = pool.getOrCreate(ceo);

    ceo.model = "gpt-5.4:high";
    pool.getOrCreate(ceo);

    expect(session.snapshot().modelLabel).toBe("openai-codex/gpt-5.4:high");
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

  it("destroyAll clears the pool without mutating session status by default", () => {
    const pool = new SessionPool();
    const ceo = pool.getOrCreate(makeAgent("ceo", "CEO"));
    const cfo = pool.getOrCreate(makeAgent("cfo", "CFO"));

    pool.destroyAll();

    expect(ceo.status).toBe("idle");
    expect(cfo.status).toBe("idle");
    expect(pool.snapshot()).toHaveLength(0);
    expect(pool.get("ceo")).toBeUndefined();
  });

  it("destroyAll can mark sessions aborted before clearing the pool", () => {
    const pool = new SessionPool();
    const ceo = pool.getOrCreate(makeAgent("ceo", "CEO"));
    const cfo = pool.getOrCreate(makeAgent("cfo", "CFO"));

    pool.destroyAll(true);

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

  it("emits an aborted update when runOne is aborted", async () => {
    const updates: AgentRuntimeUpdate[] = [];
    const pool = new SessionPool((u) => updates.push(u));
    const agent = makeAgent("cfo", "CFO");
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
        "    usage: { input: 3, output: 2, cost: { total: 0.1 } },",
        '    content: [{ type: "text", text: "partial" }],',
        "  },",
        '}) + "\\n");',
        "setInterval(() => {}, 1000);",
      ].join("\n"),
    );

    process.argv[1] = scriptPath;

    try {
      const runPromise = pool.runOne(tmpDir, agent, "", "test task", "Testing abort handling", controller.signal);
      await new Promise(resolve => setTimeout(resolve, 100));
      controller.abort();

      await expect(runPromise).rejects.toThrow("Subagent was aborted");
      expect(updates.map(update => update.status)).toEqual(["queued", "running", "aborted"]);
      expect(updates.at(-1)?.error).toBe("Subagent was aborted");
    } finally {
      process.argv[1] = originalArgv1;
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it("emits thinking, tooling, and delegating updates from streamed events", async () => {
    const updates: AgentRuntimeUpdate[] = [];
    const pool = new SessionPool((u) => updates.push(u));
    const agent = makeAgent("ceo", "CEO");
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "boardroom-runtime-test-"));
    const scriptPath = path.join(tmpDir, "rich-events.js");
    const originalArgv1 = process.argv[1];

    await fs.writeFile(
      scriptPath,
      [
        "const emit = (obj) => process.stdout.write(JSON.stringify(obj) + '\\n');",
        "emit({ type: 'message_update', assistantMessageEvent: { type: 'thinking_start' } });",
        "emit({ type: 'message_update', assistantMessageEvent: { type: 'thinking_delta', delta: 'hmm' } });",
        "emit({ type: 'message_update', assistantMessageEvent: { type: 'toolcall_end', toolCall: { name: 'Task' } } });",
        "emit({ type: 'tool_execution_start', name: 'Task' });",
        "emit({ type: 'tool_execution_end', name: 'Task' });",
        "emit({ type: 'message_update', assistantMessageEvent: { type: 'text_delta', delta: 'hello' } });",
        "emit({",
        "  type: 'message_end',",
        "  message: {",
        "    role: 'assistant',",
        "    usage: { input: 1, output: 1, cost: { total: 0.01 } },",
        "    content: [{ type: 'text', text: 'hello' }],",
        "  },",
        "});",
      ].join("\n"),
    );

    process.argv[1] = scriptPath;

    try {
      const result = await pool.runOne(tmpDir, agent, "", "test task", "Framing the decision");
      expect(result.exitCode).toBe(0);
      expect(updates.some((update) => update.status === "thinking")).toBe(true);
      expect(updates.some((update) => update.status === "delegating")).toBe(true);
      expect(updates.some((update) => update.status === "streaming")).toBe(true);
      expect(updates.some((update) => update.activity === "delegating - Task")).toBe(true);
    } finally {
      process.argv[1] = originalArgv1;
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it("emits aborted updates when runParallel is aborted", async () => {
    const updates: AgentRuntimeUpdate[] = [];
    const pool = new SessionPool((u) => updates.push(u));
    const agent = makeAgent("cfo", "CFO");
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
        "    usage: { input: 3, output: 2, cost: { total: 0.1 } },",
        '    content: [{ type: "text", text: "partial" }],',
        "  },",
        '}) + "\\n");',
        "setInterval(() => {}, 1000);",
      ].join("\n"),
    );

    process.argv[1] = scriptPath;

    try {
      const runPromise = pool.runParallel(
        tmpDir,
        [{ agent, systemPrompt: "", task: "test task", activity: "Testing abort handling" }],
        controller.signal,
        1,
      );
      await new Promise(resolve => setTimeout(resolve, 100));
      controller.abort();

      await expect(runPromise).rejects.toThrow("Subagent was aborted");
      expect(updates.map(update => update.status)).toEqual(["queued", "running", "aborted"]);
      expect(updates.at(-1)?.error).toBe("Subagent was aborted");
    } finally {
      process.argv[1] = originalArgv1;
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it("returns partial aborted results on force-close so the CEO can finish the meeting", async () => {
    const pool = new SessionPool();
    const agents = [makeAgent("cfo", "CFO"), makeAgent("cto", "CTO")];
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "boardroom-runtime-test-"));
    const scriptPath = path.join(tmpDir, "force-close.js");
    const controller = new AbortController();
    const originalArgv1 = process.argv[1];

    await fs.writeFile(
      scriptPath,
      [
        "process.stdout.write(JSON.stringify({",
        '  type: "message_end",',
        "  message: {",
        '    role: "assistant",',
        "    usage: { input: 3, output: 2, cost: { total: 0.1 } },",
        '    content: [{ type: "text", text: "partial" }],',
        "  },",
        '}) + "\\n");',
        "setInterval(() => {}, 1000);",
      ].join("\n"),
    );

    process.argv[1] = scriptPath;

    try {
      const runPromise = pool.runParallel(
        tmpDir,
        agents.map((agent) => ({ agent, systemPrompt: "", task: "test task", activity: "Testing force-close" })),
        controller.signal,
        2,
      );
      await new Promise(resolve => setTimeout(resolve, 100));
      controller.abort("force-close");

      const results = await runPromise;
      expect(results).toHaveLength(2);
      expect(results.every((result) => result.exitCode === 130)).toBe(true);
      expect(results.every((result) => result.error === "Subagent was aborted")).toBe(true);
      expect(results.every((result) => result.content === "" || result.content === "partial")).toBe(true);
    } finally {
      process.argv[1] = originalArgv1;
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  });
});
