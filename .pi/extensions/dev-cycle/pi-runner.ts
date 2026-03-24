import { spawn } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { addNode, attachSubagentResults, createExecutionGraph, finishNode, updateNode } from "./graph.js";
import type { PiRunOptions, PiRunResult, SubagentResult, UsageTotals } from "./types.js";

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

async function writePromptFile(prompt: string, label: string): Promise<{ dir: string; filePath: string }> {
  const dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "dev-cycle-"));
  const filePath = path.join(dir, `${label}.md`);
  await fs.promises.writeFile(filePath, prompt, { encoding: "utf-8", mode: 0o600 });
  return { dir, filePath };
}

function previewFromContent(content: unknown): string | undefined {
  if (!Array.isArray(content)) return undefined;
  const textPart = content.find(
    (item): item is { type: string; text?: string } =>
      !!item && typeof item === "object" && (item as { type?: string }).type === "text",
  );
  return textPart?.text;
}

export async function runPiTask(options: PiRunOptions): Promise<PiRunResult> {
  const graph = options.graph ?? createExecutionGraph("adhoc", options.nodeLabel ?? "Pi task");
  const parentNodeId = options.parentNodeId ?? graph.rootId;
  const rootNodeId = addNode(graph, parentNodeId, "agent", options.nodeLabel ?? "Pi task", "running");
  options.onGraphUpdate?.(graph);

  const args: string[] = ["--mode", "json", "-p", "--no-session"];
  if (!options.allowExtensions) args.unshift("--no-extensions");
  if (options.model) args.push("--model", options.model);
  if (options.tools && options.tools.length > 0) args.push("--tools", options.tools.join(","));

  let tmpDir: string | null = null;
  let tmpPath: string | null = null;

  const usage: UsageTotals = { input: 0, output: 0, cost: 0, turns: 0 };
  let finalOutput = "";
  let stderr = "";
  let stopReason: string | undefined;
  let errorMessage: string | undefined;

  try {
    if (options.systemPrompt.trim()) {
      const promptFile = await writePromptFile(options.systemPrompt, "system-prompt");
      tmpDir = promptFile.dir;
      tmpPath = promptFile.filePath;
      args.push("--append-system-prompt", promptFile.filePath);
    }

    args.push(`Task: ${options.task}`);

    const toolNodes = new Map<string, string>();
    let buffer = "";
    let aborted = false;

    const exitCode = await new Promise<number>((resolve) => {
      const invocation = getPiInvocation(args);
      const proc = spawn(invocation.command, invocation.args, {
        cwd: options.cwd,
        shell: false,
        stdio: ["ignore", "pipe", "pipe"],
        env: { ...process.env, ...options.env },
      });

      const processLine = (line: string) => {
        if (!line.trim()) return;

        let event: any;
        try {
          event = JSON.parse(line);
        } catch {
          return;
        }

        if (event.type === "message_update" && event.assistantMessageEvent?.type === "text_delta") {
          finalOutput += event.assistantMessageEvent.delta;
          updateNode(graph, rootNodeId, { detail: finalOutput.slice(-400) });
          options.onGraphUpdate?.(graph);
          return;
        }

        if (event.type === "tool_execution_start") {
          const label = `${event.toolName}`;
          const detail = JSON.stringify(event.args ?? {});
          const nodeId = addNode(graph, rootNodeId, "tool", label, "running", {
            toolCallId: event.toolCallId,
          });
          updateNode(graph, nodeId, { detail });
          toolNodes.set(event.toolCallId, nodeId);
          options.onGraphUpdate?.(graph);
          return;
        }

        if (event.type === "tool_execution_update") {
          const nodeId = toolNodes.get(event.toolCallId);
          if (!nodeId) return;
          const preview = previewFromContent(event.partialResult?.content);
          if (preview) updateNode(graph, nodeId, { detail: preview.slice(0, 400) });
          options.onGraphUpdate?.(graph);
          return;
        }

        if (event.type === "tool_execution_end") {
          const nodeId = toolNodes.get(event.toolCallId);
          if (!nodeId) return;
          const preview = previewFromContent(event.result?.content) ?? JSON.stringify(event.result?.details ?? {});
          finishNode(graph, nodeId, event.result?.isError ? "failed" : "completed", preview.slice(0, 400));

          const details = event.result?.details as { results?: SubagentResult[] } | undefined;
          if (details?.results && Array.isArray(details.results)) {
            attachSubagentResults(graph, nodeId, details.results);
          }

          options.onGraphUpdate?.(graph);
          return;
        }

        if (event.type === "message_end" && event.message?.role === "assistant") {
          for (const part of event.message.content ?? []) {
            if (part.type === "text") finalOutput = part.text;
          }

          if (event.message.usage) {
            usage.input += event.message.usage.input || 0;
            usage.output += event.message.usage.output || 0;
            usage.cost += event.message.usage.cost?.total || 0;
          }
          usage.turns += 1;
          stopReason = event.message.stopReason;
          errorMessage = event.message.errorMessage;
          updateNode(graph, rootNodeId, { detail: finalOutput.slice(-400) });
          options.onGraphUpdate?.(graph);
        }
      };

      proc.stdout.on("data", (chunk: Buffer) => {
        buffer += chunk.toString();
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) processLine(line);
      });

      proc.stderr.on("data", (chunk: Buffer) => {
        stderr += chunk.toString();
      });

      proc.on("close", (code) => {
        if (buffer.trim()) processLine(buffer);
        resolve(code ?? 0);
      });

      proc.on("error", () => resolve(1));

      if (options.signal) {
        const killProc = () => {
          aborted = true;
          proc.kill("SIGTERM");
          setTimeout(() => {
            if (!proc.killed) proc.kill("SIGKILL");
          }, 5000);
        };

        if (options.signal.aborted) killProc();
        else options.signal.addEventListener("abort", killProc, { once: true });
      }
    });

    finishNode(
      graph,
      rootNodeId,
      aborted ? "aborted" : exitCode === 0 ? "completed" : "failed",
      finalOutput || stderr || errorMessage,
    );
    if (parentNodeId === graph.rootId) {
      finishNode(graph, graph.rootId, aborted ? "aborted" : exitCode === 0 ? "completed" : "failed");
    }
    options.onGraphUpdate?.(graph);

    return {
      exitCode,
      output: finalOutput,
      stderr,
      stopReason,
      errorMessage,
      usage,
      rootNodeId,
      graph,
    };
  } catch (error: any) {
    finishNode(graph, rootNodeId, "failed", error.message ?? "Unknown error");
    if (parentNodeId === graph.rootId) {
      finishNode(graph, graph.rootId, "failed");
    }
    options.onGraphUpdate?.(graph);
    return {
      exitCode: 1,
      output: "",
      stderr: error.message ?? "Unknown error",
      usage,
      rootNodeId,
      graph,
      errorMessage: error.message ?? "Unknown error",
    };
  } finally {
    if (tmpPath) try { fs.unlinkSync(tmpPath); } catch {}
    if (tmpDir) try { fs.rmdirSync(tmpDir); } catch {}
  }
}
