import { spawn } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import type { AgentRunResult } from "./types.js";

async function writePromptToTempFile(agentSlug: string, prompt: string): Promise<{ dir: string; filePath: string }> {
  const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "boardroom-"));
  const filePath = path.join(tmpDir, `prompt-${agentSlug}.md`);
  await fs.promises.writeFile(filePath, prompt, { encoding: "utf-8", mode: 0o600 });
  return { dir: tmpDir, filePath };
}

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

interface UsageAccumulator {
  input: number;
  output: number;
  cost: number;
  turns: number;
}

export async function runAgent(
  cwd: string,
  agentSlug: string,
  model: string | undefined,
  systemPrompt: string,
  task: string,
  signal?: AbortSignal,
): Promise<AgentRunResult> {
  // Spawn board-member subprocesses in isolation so they don't rediscover
  // project/global extensions and fail on duplicate tool registrations.
  const args: string[] = ["--no-extensions", "--mode", "json", "-p", "--no-session"];
  if (model) args.push("--model", model);

  let tmpDir: string | null = null;
  let tmpPath: string | null = null;

  const usage: UsageAccumulator = { input: 0, output: 0, cost: 0, turns: 0 };
  let finalOutput = "";
  let finalError: string | undefined;

  try {
    if (systemPrompt.trim()) {
      const tmp = await writePromptToTempFile(agentSlug, systemPrompt);
      tmpDir = tmp.dir;
      tmpPath = tmp.filePath;
      args.push("--append-system-prompt", tmpPath);
    }

    args.push(`Task: ${task}`);


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
        if (trimmedStderr) {
          finalError = trimmedStderr;
        }
        resolve(code ?? 0);
      });

      proc.on("error", () => resolve(1));

      if (signal) {
        const killProc = () => {
          proc.kill("SIGTERM");
          setTimeout(() => {
            if (!proc.killed) proc.kill("SIGKILL");
          }, 5000);
        };
        if (signal.aborted) killProc();
        else signal.addEventListener("abort", killProc, { once: true });
      }
    });

    return {
      agent: agentSlug,
      content: finalOutput,
      exitCode,
      tokenCount: usage.input + usage.output,
      cost: usage.cost,
      error: exitCode !== 0 ? (finalError || `Process exited with code ${exitCode}`) : undefined,
    };
  } catch (err: any) {
    return {
      agent: agentSlug,
      content: "",
      exitCode: 1,
      tokenCount: 0,
      cost: 0,
      error: err.message ?? "Unknown error",
    };
  } finally {
    if (tmpPath) try { fs.unlinkSync(tmpPath); } catch {}
    if (tmpDir) try { fs.rmSync(tmpDir, { recursive: true }); } catch {}
  }
}

