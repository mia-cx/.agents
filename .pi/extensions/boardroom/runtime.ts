import { spawn } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import type { AgentConfig, AgentRunResult, AgentRuntimeStatus, AgentRuntimeUpdate } from "./types.js";

function getPiInvocation(args: string[]): { command: string; args: string[] } {
  const currentScript = process.argv[1];
  if (currentScript && fs.existsSync(currentScript)) {
    return { command: process.execPath, args: [currentScript, ...args] };
  }
  const execName = path.basename(process.execPath).toLowerCase();
  if (!/^(node|bun)(\.exe)?$/.test(execName)) {
    return { command: process.execPath, args };
  }
  return { command: "pi", args };
}

async function writeSystemPromptFile(
  slug: string,
  prompt: string,
): Promise<{ dir: string; filePath: string }> {
  const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "boardroom-"));
  const filePath = path.join(tmpDir, `prompt-${slug}.md`);
  await fs.promises.writeFile(filePath, prompt, { encoding: "utf-8", mode: 0o600 });
  return { dir: tmpDir, filePath };
}

export type RuntimeEventHandler = (update: AgentRuntimeUpdate) => void;

function preferLocalProviderModel(model: string | undefined): string | undefined {
  if (!model) return undefined;
  if (model.includes("/")) return model;

  // Keep boardroom agents on the user's direct local providers instead of
  // letting Pi resolve generic aliases to providers like Bedrock/OpenRouter.
  if (/^(claude|sonnet|opus|haiku)\b/i.test(model)) return `anthropic/${model}`;
  if (/^(gpt|o[1-9]|codex)\b/i.test(model)) return `openai-codex/${model}`;
  return model;
}

function stringifyRuntimeError(value: unknown): string | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || undefined;
  }
  if (value instanceof Error) {
    return value.message.trim() || value.name;
  }
  if (typeof value === "object" && value) {
    if ("message" in value && typeof (value as { message?: unknown }).message === "string") {
      const message = (value as { message: string }).message.trim();
      if (message) return message;
    }
    try {
      const serialized = JSON.stringify(value);
      return serialized && serialized !== "{}" ? serialized : undefined;
    } catch {
      return String(value);
    }
  }
  return undefined;
}

/**
 * Wraps repeated Pi invocations for a single board member, tracking
 * cumulative usage across turns and emitting structured lifecycle state.
 */
export class BoardMemberSession {
  status: AgentRuntimeStatus = "idle";
  turns = 0;
  totalTokens = 0;
  totalCost = 0;
  lastError: string | null = null;
  activity = "Standing by";
  partialText = "";

  constructor(
    readonly slug: string,
    readonly name: string,
    readonly model: string | undefined,
    readonly modelAlt?: string,
    private readonly onUpdate?: RuntimeEventHandler,
  ) {}

  private publishUpdate(): void {
    this.onUpdate?.(this.snapshot());
  }

  private shouldRetryWithFallback(error: string | undefined): boolean {
    if (!error) return false;
    return /No API key found for/i.test(error);
  }

  private getAttemptModels(): Array<string | undefined> {
    const attempts: Array<string | undefined> = [];
    const pushUnique = (model: string | undefined) => {
      if (attempts.some((candidate) => candidate === model)) return;
      attempts.push(model);
    };

    pushUnique(preferLocalProviderModel(this.model));
    if (this.modelAlt) pushUnique(preferLocalProviderModel(this.modelAlt));
    pushUnique(undefined);
    return attempts;
  }

  private async runOnce(
    cwd: string,
    model: string | undefined,
    systemPrompt: string,
    task: string,
    activity: string | undefined,
    signal?: AbortSignal,
    onStream?: (partialText: string) => void,
  ): Promise<AgentRunResult> {
    this.status = "running";
    this.lastError = null;
    this.activity = activity ?? "Working";
    this.partialText = "";
    this.publishUpdate();

    const args: string[] = ["--no-extensions", "--mode", "json", "-p", "--no-session"];
    if (model) args.push("--model", model);

    let tmpDir: string | null = null;
    let tmpPath: string | null = null;

    const usage = { input: 0, output: 0, cost: 0, turns: 0 };
    let finalOutput = "";
    let streamedOutput = "";
    let finalError = "";

    try {
      if (systemPrompt.trim()) {
        const tmp = await writeSystemPromptFile(this.slug, systemPrompt);
        tmpDir = tmp.dir;
        tmpPath = tmp.filePath;
        args.push("--append-system-prompt", tmpPath);
      }

      args.push(`Task: ${task}`);
      let wasAborted = false;

      const exitCode = await new Promise<number>((resolve) => {
        const invocation = getPiInvocation(args);
        const proc = spawn(invocation.command, invocation.args, {
          cwd,
          shell: false,
          stdio: ["ignore", "pipe", "pipe"],
        });
        let buffer = "";
        let stderr = "";

        const processLine = (line: string) => {
          if (!line.trim()) return;
          let event: any;
          try {
            event = JSON.parse(line);
          } catch {
            return;
          }

          if (
            event.type === "message_update" &&
            event.assistantMessageEvent?.type === "text_delta"
          ) {
            const delta = String(event.assistantMessageEvent.delta ?? "");
            this.status = "streaming";
            this.activity = activity ?? "Streaming response";
            streamedOutput += delta;
            this.partialText = streamedOutput;
            this.lastError = null;
            this.publishUpdate();
            onStream?.(delta);
          }

          if (event.type === "error") {
            finalError = stringifyRuntimeError(event.error) ?? finalError;
          }

          if (event.type === "message_end" && event.message) {
            const msg = event.message;
            if (msg.role === "assistant") {
              usage.turns++;
              if (msg.usage) {
                usage.input += msg.usage.input || 0;
                usage.output += msg.usage.output || 0;
                usage.cost += msg.usage.cost?.total || 0;
              }
              const textParts: string[] = [];
              for (const part of msg.content || []) {
                if (part.type === "text") textParts.push(part.text);
              }
              if (textParts.length > 0) finalOutput = textParts.join("");
              if (typeof msg.errorMessage === "string" && msg.errorMessage.trim()) {
                finalError = msg.errorMessage.trim();
              }
            }
          }

          if (
            event.type === "message_update" &&
            event.assistantMessageEvent?.type === "message_end" &&
            event.assistantMessageEvent.message?.role === "assistant"
          ) {
            const textParts: string[] = [];
            for (const part of event.assistantMessageEvent.message.content || []) {
              if (part.type === "text") textParts.push(part.text);
            }
            if (textParts.length > 0) {
              finalOutput = textParts.join("");
            }
          }
        };

        proc.stdout.on("data", (data: Buffer) => {
          buffer += data.toString();
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) processLine(line);
        });

        proc.stderr.on("data", (data: Buffer) => {
          stderr += data.toString();
        });

        proc.on("close", (code) => {
          if (buffer.trim()) processLine(buffer);
          const trimmedStderr = stderr.trim();
          if (trimmedStderr) finalError = trimmedStderr;
          resolve(code ?? 0);
        });

        proc.on("error", () => resolve(1));

        if (signal) {
          const killProc = () => {
            wasAborted = true;
            proc.kill("SIGTERM");
            setTimeout(() => {
              if (!proc.killed) proc.kill("SIGKILL");
            }, 5000);
          };
          if (signal.aborted) killProc();
          else signal.addEventListener("abort", killProc, { once: true });
        }
      });

      const tokenCount = usage.input + usage.output;
      if (!finalOutput && streamedOutput.trim()) {
        finalOutput = streamedOutput;
      }
      this.turns++;
      this.totalTokens += tokenCount;
      this.totalCost += usage.cost;

      if (wasAborted) {
        this.status = "aborted";
        this.activity = "Aborted";
        this.lastError = "Subagent was aborted";
        this.publishUpdate();
        throw new Error("Subagent was aborted");
      }

      if (exitCode !== 0) {
        this.status = "failed";
        this.lastError = finalError || `Process exited with code ${exitCode}`;
        this.activity = "Failed";
      } else {
        this.status = "completed";
        this.activity = "Completed";
        this.partialText = "";
      }
      this.publishUpdate();

      return {
        agent: this.slug,
        content: finalOutput,
        exitCode,
        tokenCount,
        cost: usage.cost,
        error: exitCode !== 0 ? (finalError || `Process exited with code ${exitCode}`) : undefined,
      };
    } catch (err: any) {
      this.lastError = err.message ?? "Unknown error";
      if (this.status === "aborted") throw err;
      this.status = "failed";
      this.activity = "Failed";
      this.publishUpdate();
      return {
        agent: this.slug,
        content: "",
        exitCode: 1,
        tokenCount: 0,
        cost: 0,
        error: this.lastError!,
      };
    } finally {
      if (tmpPath) try { fs.unlinkSync(tmpPath); } catch {}
      if (tmpDir) try { fs.rmdirSync(tmpDir); } catch {}
    }
  }

  async run(
    cwd: string,
    systemPrompt: string,
    task: string,
    activity?: string,
    signal?: AbortSignal,
    onStream?: (partialText: string) => void,
  ): Promise<AgentRunResult> {
    const attemptModels = this.getAttemptModels();
    let lastResult: AgentRunResult | null = null;

    for (let i = 0; i < attemptModels.length; i++) {
      const attemptModel = attemptModels[i];
      const result = await this.runOnce(cwd, attemptModel, systemPrompt, task, activity, signal, onStream);
      lastResult = result;

      if (result.exitCode === 0) return result;
      if (!this.shouldRetryWithFallback(result.error)) return result;
      if (i === attemptModels.length - 1) return result;
    }

    return lastResult ?? {
      agent: this.slug,
      content: "",
      exitCode: 1,
      tokenCount: 0,
      cost: 0,
      error: "Unknown runtime failure",
    };
  }

  snapshot(): AgentRuntimeUpdate {
    return {
      slug: this.slug,
      name: this.name,
      status: this.status,
      activity: this.activity,
      partialText: this.partialText || undefined,
      turns: this.turns,
      totalTokens: this.totalTokens,
      totalCost: this.totalCost,
      error: this.lastError ?? undefined,
    };
  }

  markAborted(): void {
    this.status = "aborted";
    this.activity = "Aborted";
    this.publishUpdate();
  }

  setQueued(activity: string): void {
    this.status = "queued";
    this.activity = activity;
    this.publishUpdate();
  }

  setIdle(activity = "Standing by"): void {
    if (this.status === "idle") this.activity = activity;
    this.publishUpdate();
  }
}

/**
 * Manages one BoardMemberSession per agent for the duration of a meeting.
 */
export class SessionPool {
  private sessions = new Map<string, BoardMemberSession>();
  private onUpdate: RuntimeEventHandler | undefined;

  constructor(onUpdate?: RuntimeEventHandler) {
    this.onUpdate = onUpdate;
  }

  getOrCreate(agent: AgentConfig): BoardMemberSession {
    let session = this.sessions.get(agent.slug);
    if (!session) {
      session = new BoardMemberSession(agent.slug, agent.name, agent.model, agent.modelAlt, this.onUpdate);
      this.sessions.set(agent.slug, session);
    }
    return session;
  }

  get(slug: string): BoardMemberSession | undefined {
    return this.sessions.get(slug);
  }

  ensureAgents(agents: AgentConfig[], activity = "Awaiting assignment"): void {
    for (const agent of agents) {
      const session = this.getOrCreate(agent);
      session.setIdle(activity);
    }
  }

  async runOne(
    cwd: string,
    agent: AgentConfig,
    systemPrompt: string,
    task: string,
    activity: string,
    signal?: AbortSignal,
  ): Promise<AgentRunResult> {
    const session = this.getOrCreate(agent);
    session.setQueued(activity);

    try {
      const result = await session.run(cwd, systemPrompt, task, activity, signal);
      return result;
    } finally {}
  }

  async runParallel(
    cwd: string,
    tasks: Array<{ agent: AgentConfig; systemPrompt: string; task: string; activity: string }>,
    signal?: AbortSignal,
    concurrency = 4,
  ): Promise<AgentRunResult[]> {
    if (tasks.length === 0) return [];

    for (const t of tasks) {
      const session = this.getOrCreate(t.agent);
      session.setQueued(t.activity);
    }

    const limit = Math.max(1, Math.min(concurrency, tasks.length));
    const results: AgentRunResult[] = new Array(tasks.length);
    let nextIndex = 0;

    const workers = new Array(limit).fill(null).map(async () => {
      while (true) {
        const current = nextIndex++;
        if (current >= tasks.length) return;
        const t = tasks[current];
        const session = this.getOrCreate(t.agent);
        try {
          results[current] = await session.run(cwd, t.systemPrompt, t.task, t.activity, signal);
        } finally {}
      }
    });

    await Promise.all(workers);
    return results;
  }

  snapshot(): AgentRuntimeUpdate[] {
    return Array.from(this.sessions.values()).map((s) => s.snapshot());
  }

  destroyAll(): void {
    for (const session of this.sessions.values()) {
      session.markAborted();
    }
    this.sessions.clear();
  }
}
