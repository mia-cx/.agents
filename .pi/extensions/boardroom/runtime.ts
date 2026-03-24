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

  constructor(
    readonly slug: string,
    readonly name: string,
    readonly model: string | undefined,
  ) {}

  async run(
    cwd: string,
    systemPrompt: string,
    task: string,
    signal?: AbortSignal,
    onStream?: (partialText: string) => void,
  ): Promise<AgentRunResult> {
    this.status = "running";
    this.lastError = null;

    const args: string[] = ["--no-extensions", "--mode", "json", "-p", "--no-session"];
    if (this.model) args.push("--model", this.model);

    let tmpDir: string | null = null;
    let tmpPath: string | null = null;

    const usage = { input: 0, output: 0, cost: 0, turns: 0 };
    let finalOutput = "";
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
            this.status = "streaming";
            onStream?.(event.assistantMessageEvent.delta);
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
              for (const part of msg.content || []) {
                if (part.type === "text") finalOutput = part.text;
              }
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
      this.turns++;
      this.totalTokens += tokenCount;
      this.totalCost += usage.cost;

      if (wasAborted) {
        this.status = "aborted";
        throw new Error("Subagent was aborted");
      }

      if (exitCode !== 0) {
        this.status = "failed";
        this.lastError = finalError || `Process exited with code ${exitCode}`;
      } else {
        this.status = "completed";
      }

      return {
        agent: this.slug,
        content: finalOutput,
        exitCode,
        tokenCount,
        cost: usage.cost,
        error: exitCode !== 0 ? (finalError || `Process exited with code ${exitCode}`) : undefined,
      };
    } catch (err: any) {
      if (this.status !== "aborted") this.status = "failed";
      this.lastError = err.message ?? "Unknown error";
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

  snapshot(): AgentRuntimeUpdate {
    return {
      slug: this.slug,
      name: this.name,
      status: this.status,
      turns: this.turns,
      totalTokens: this.totalTokens,
      totalCost: this.totalCost,
      error: this.lastError ?? undefined,
    };
  }

  markAborted(): void {
    this.status = "aborted";
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
      session = new BoardMemberSession(agent.slug, agent.name, agent.model);
      this.sessions.set(agent.slug, session);
    }
    return session;
  }

  get(slug: string): BoardMemberSession | undefined {
    return this.sessions.get(slug);
  }

  private emitUpdate(session: BoardMemberSession): void {
    this.onUpdate?.(session.snapshot());
  }

  async runOne(
    cwd: string,
    agent: AgentConfig,
    systemPrompt: string,
    task: string,
    signal?: AbortSignal,
  ): Promise<AgentRunResult> {
    const session = this.getOrCreate(agent);
    session.status = "queued";
    this.emitUpdate(session);

    const result = await session.run(cwd, systemPrompt, task, signal);
    this.emitUpdate(session);
    return result;
  }

  async runParallel(
    cwd: string,
    tasks: Array<{ agent: AgentConfig; systemPrompt: string; task: string }>,
    signal?: AbortSignal,
    concurrency = 4,
  ): Promise<AgentRunResult[]> {
    if (tasks.length === 0) return [];

    for (const t of tasks) {
      const session = this.getOrCreate(t.agent);
      session.status = "queued";
      this.emitUpdate(session);
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
        results[current] = await session.run(cwd, t.systemPrompt, t.task, signal);
        this.emitUpdate(session);
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
