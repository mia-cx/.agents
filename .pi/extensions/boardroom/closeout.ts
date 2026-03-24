import { execFile, execFileSync, spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import * as fs from "node:fs";
import * as net from "node:net";
import * as os from "node:os";
import * as path from "node:path";
import dotenv from "dotenv";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import type { MeetingDisposition, MeetingMode } from "./types.js";
import type { DashboardTheme } from "./ui.js";

export interface CloseoutInfo {
  memoPath: string;
  debateJsonPath: string;
  debateMarkdownPath: string;
  visualPaths: string[];
  summaryPath?: string;
  summaryText?: string;
  disposition: MeetingDisposition;
  abortReason?: string;
  briefTitle: string;
  mode: MeetingMode;
  totalCost: number;
  elapsedMinutes: number;
  roster: string[];
}

interface DispositionDisplay {
  icon: string;
  label: string;
  description: string;
  color: string;
}

const DISPOSITIONS: Record<MeetingDisposition, DispositionDisplay> = {
  completed: {
    icon: "✓",
    label: "Completed",
    description: "Full board deliberation concluded successfully.",
    color: "success",
  },
  "force-closed": {
    icon: "⚠",
    label: "Force-closed",
    description: "Meeting was force-closed. CEO synthesized with available data.",
    color: "warning",
  },
  "budget-exceeded": {
    icon: "💰",
    label: "Budget reached",
    description: "Budget limit was reached. CEO synthesized with available data.",
    color: "warning",
  },
  "constraints-reached": {
    icon: "⏱",
    label: "Constraints reached",
    description: "Time or round constraints ended the meeting. CEO synthesized with available data.",
    color: "warning",
  },
  aborted: {
    icon: "✗",
    label: "Aborted",
    description: "Meeting was aborted. Partial artifacts were saved.",
    color: "error",
  },
};

const DEFAULT_ELEVENLABS_VOICE_ID = "56bWURjYFHyYyVf490Dp";
const DEFAULT_ELEVENLABS_MODEL_ID = "eleven_multilingual_v2";
const DEFAULT_ELEVENLABS_OUTPUT_FORMAT = "mp3_44100_128";
const DEFAULT_NARRATION_MAX_CHARS = 5000;

export interface ElevenLabsSettings {
  apiKey: string | undefined;
  voiceId: string;
  modelId: string;
  outputFormat: string;
  loadedEnvPath: string | null;
}

export interface NarrationAlignment {
  characters: string[];
  characterStartTimesSeconds: number[];
  characterEndTimesSeconds: number[];
}

export interface NarrationResult {
  ok: boolean;
  audioPath?: string;
  summaryPath?: string;
  summaryText?: string;
  alignment?: NarrationAlignment;
  error?: string;
}

interface NarrationSummaryInput {
  summaryText?: string;
  summaryPath?: string;
}

export interface HumanReadableSummaryResult {
  ok: boolean;
  summaryPath?: string;
  summaryText?: string;
  error?: string;
  warning?: string;
}

interface HumanReadableSummaryDeps {
  summarizeMemo?: (
    memoPath: string,
    markdown: string,
    maxChars: number,
  ) => Promise<string | { text?: string | null; error?: string } | null | undefined>;
}

export interface NarrationDisplayState {
  phase: "generating" | "playing" | "paused" | "completed";
  summaryText: string;
  summaryPath?: string;
  indicatorFrame: number;
  activeRange?: { start: number; end: number };
  elapsedSeconds?: number;
  durationSeconds?: number;
  controlsLabel?: string;
}

export interface NarrationPlaybackRequest {
  audioPath: string;
  summaryText: string;
  summaryPath?: string;
  alignment?: NarrationAlignment;
  autoplay?: boolean;
}

export interface NarrationPlaybackResult {
  ok: boolean;
  error?: string;
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

function sanitizeJsonEventLine(line: string): string | null {
  const withoutOsc = line.replace(/\u001b\][^\u0007]*(?:\u0007|\u001b\\)/g, "");
  const withoutAnsi = withoutOsc.replace(/\u001b\[[0-9;?]*[ -/]*[@-~]/g, "");
  const trimmed = withoutAnsi.trim();
  if (!trimmed) return null;
  const jsonStart = trimmed.indexOf("{");
  if (jsonStart === -1) return null;
  return trimmed.slice(jsonStart);
}

async function writeSummarySystemPromptFile(prompt: string): Promise<{ dir: string; filePath: string }> {
  const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "boardroom-summary-"));
  const filePath = path.join(tmpDir, "summary-system-prompt.md");
  await fs.promises.writeFile(filePath, prompt, { encoding: "utf-8", mode: 0o600 });
  return { dir: tmpDir, filePath };
}

function getNarrationSummaryModel(): string | undefined {
  const model = process.env.BOARDROOM_SUMMARY_MODEL?.trim();
  return model ? model : undefined;
}

function getNarrationSummaryTimeoutMs(): number {
  const raw = Number(process.env.BOARDROOM_SUMMARY_TIMEOUT_MS ?? "90000");
  return Number.isFinite(raw) ? Math.max(5000, raw) : 90000;
}

const DEFAULT_NARRATION_SUMMARY_SYSTEM_PROMPT = [
  "You write spoken narration scripts for ElevenLabs.",
  "",
  "Summarize the ENTIRE memo, not just one section or heading.",
  "",
  "Your job is to explain the meeting outcome to a human listener in plain spoken English.",
  "",
  "Focus on four things, in this order:",
  "1. What the board discussed.",
  "2. The key roadblocks, constraints, disagreements, or considerations.",
  "3. The final decision.",
  "4. Why the board landed there.",
  "",
  "Prefer synthesis over enumeration. Do not turn the memo into a laundry list of findings, tables, sections, or metrics.",
  "",
  "Only mention numbers, timelines, risks, or specific details when they materially explain the decision.",
  "",
  "If the memo includes multiple options or disagreements, explain the tradeoff that mattered and how it got resolved.",
  "",
  "End with a clear bottom line.",
  "",
  "Return plain English prose only. No markdown, no bullets, no headings, no tables, no XML, and no code fences.",
  "",
  "Write in natural, speakable English that sounds good when read aloud.",
  "",
  "Use one compact spoken narrative, not a section-by-section recap.",
  "",
  "Expand symbols and abbreviations into spoken English where helpful.",
  "",
  "Do not mention that you are summarizing or that a memo was provided.",
  "",
  "Do not narrate your process.",
  "",
  "Do not begin with status text like \"Creating...\", \"Drafting...\", \"Generating...\", or \"Here is...\".",
  "",
  "The first sentence must already be part of the final spoken narration.",
  "",
  "Do not use tools.",
  "",
  "Keep the response under {{MAX_CHARS}} characters.",
  "",
  "Start directly with the substance.",
].join("\n");

function getNarrationSummaryPromptPath(memoPath: string): string | null {
  const workspaceRoot = findWorkspaceRoot(memoPath);
  if (!workspaceRoot) return null;
  return path.join(workspaceRoot, "agents", "meta", "narration-summarizer.md");
}

function loadNarrationSummarySystemPrompt(memoPath: string, maxChars: number): string {
  const promptPath = getNarrationSummaryPromptPath(memoPath);
  let template = DEFAULT_NARRATION_SUMMARY_SYSTEM_PROMPT;

  if (promptPath) {
    try {
      const fileTemplate = fs.readFileSync(promptPath, "utf-8").trim();
      if (fileTemplate) template = fileTemplate;
    } catch {}
  }

  return template.replaceAll("{{MAX_CHARS}}", String(maxChars));
}

function stripNarrationMetaCommentary(text: string): string {
  let cleaned = text.trim();
  const metaLinePatterns = [
    /^(?:(?:spoken\s+)?narration\s+script\b(?:\s*:\s*|\s+))/i,
    /^(creating|drafting|writing|generating|preparing)\b[^.!?\n]*[.!?]\s*/i,
    /^(here is|here's)\b[^:\n]*(?::\s*|[.!?]\s*)/i,
    /^[^.!?\n]{0,160}\b(?:here is|here's)\b[^:\n]*(?::\s*|[.!?]\s*)/i,
    /^(?:a\s+)?concise\s+tts(?:-ready)?\s+script\b[^:\n]*(?::\s*|[.!?]\s*)/i,
    /^(i am|i'm|i will|i'll)\b[^.!?\n]*[.!?]\s*/i,
    /^character count\s*:\s*[^.!?\n]*(?:[.!?]\s*|$)/i,
  ];

  let changed = true;
  while (changed) {
    changed = false;
    for (const pattern of metaLinePatterns) {
      const next = cleaned.replace(pattern, "").trimStart();
      if (next !== cleaned) {
        cleaned = next;
        changed = true;
      }
    }
  }

  cleaned = cleaned
    .replace(/\s*---+\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const trailingMetaPatterns = [
    /\bcharacter count\s*:\s*[^.!?\n]*(?:[.!?]\s*|$)/i,
    /\bunder\s+\d[\d,]*\s+characters\b[^.!?\n]*(?:[.!?]\s*|$)/i,
  ];
  for (const pattern of trailingMetaPatterns) {
    cleaned = cleaned.replace(pattern, "").trim();
  }

  return cleaned;
}

async function summarizeMemoWithLlm(
  memoPath: string,
  markdown: string,
  maxChars: number,
): Promise<{ text?: string | null; error?: string }> {
  const systemPrompt = loadNarrationSummarySystemPrompt(memoPath, maxChars);

  let tmpDir: string | null = null;
  let finalOutput = "";
  let streamedOutput = "";
  let finalError = "";

  try {
    const tmp = await writeSummarySystemPromptFile(systemPrompt);
    tmpDir = tmp.dir;

    const args = ["--mode", "json", "-p", "--no-session"];
    const model = getNarrationSummaryModel();
    if (model) args.push("--model", model);
    args.push("--system-prompt", tmp.filePath);
    args.push(
      [
        "Task: Turn the following strategic memo into a concise spoken narration script for text-to-speech.",
        `It must cover the whole memo and stay under ${maxChars} characters.`,
        "",
        "Required content order:",
        "1. What the board discussed.",
        "2. The main constraints, disagreements, or roadblocks.",
        "3. The final decision.",
        "4. Why that decision won.",
        "",
        "Quality bar:",
        "Write like an executive recap someone could listen to once and understand the meeting.",
        "Do not mirror the memo's section structure.",
        "Do not list every supporting fact.",
        "Do not include tables, separators, labels, character counts, or meta commentary.",
        "Return only the spoken narration itself.",
        "Do not prepend or append anything.",
        "Do not write labels like 'Narration Script', 'Spoken Narration Script', or 'Summary'.",
        "Do not write helper text like 'Here is...', 'Below is...', or 'This script...'.",
        "Do not mention the character limit or whether you satisfied it.",
        "If your first words are a label or framing phrase instead of the narration itself, the answer is wrong.",
        "",
        "--- MEMO START ---",
        markdown,
        "--- MEMO END ---",
      ].join("\n"),
    );

    const invocation = getPiInvocation(args);
    const output = await new Promise<{
      stdout: string;
      stderr: string;
      exitCode: number;
      finalError: string;
      finalOutput: string;
      streamedOutput: string;
    }>((resolve) => {
      const proc = spawn(invocation.command, invocation.args, {
        shell: false,
        stdio: ["ignore", "pipe", "pipe"],
      });
      let stdout = "";
      let stderr = "";
      let buffer = "";
      let completionRequested = false;
      let completionTimer: ReturnType<typeof setTimeout> | null = null;
      let completionForcedKillTimer: ReturnType<typeof setTimeout> | null = null;
      let timeoutTimer: ReturnType<typeof setTimeout> | null = null;
      let timedOut = false;
      const requestCompletionShutdown = () => {
        if (completionRequested || timedOut) return;
        completionRequested = true;
        completionTimer = setTimeout(() => {
          if (proc.exitCode === null && proc.signalCode === null) proc.kill("SIGTERM");
          completionForcedKillTimer = setTimeout(() => {
            if (proc.exitCode === null && proc.signalCode === null) proc.kill("SIGKILL");
          }, 2000);
        }, 100);
      };
      const processLine = (line: string) => {
        const sanitized = sanitizeJsonEventLine(line);
        if (!sanitized) return;
        let event: any;
        try {
          event = JSON.parse(sanitized);
        } catch {
          return;
        }

        if (
          event.type === "message_update"
          && event.assistantMessageEvent?.type === "text_delta"
        ) {
          streamedOutput += String(event.assistantMessageEvent.delta ?? "");
        }

        if (event.type === "message_end" && event.message?.role === "assistant") {
          const textParts: string[] = [];
          for (const part of event.message.content ?? []) {
            if (part.type === "text") textParts.push(part.text);
          }
          if (textParts.length > 0) finalOutput = textParts.join("");
          if (typeof event.message.errorMessage === "string" && event.message.errorMessage.trim()) {
            finalError = event.message.errorMessage.trim();
          }
          requestCompletionShutdown();
        }

        if (
          event.type === "message_update"
          && event.assistantMessageEvent?.type === "message_end"
          && event.assistantMessageEvent.message?.role === "assistant"
        ) {
          const textParts: string[] = [];
          for (const part of event.assistantMessageEvent.message.content ?? []) {
            if (part.type === "text") textParts.push(part.text);
          }
          if (textParts.length > 0) finalOutput = textParts.join("");
          requestCompletionShutdown();
        }

        if (event.type === "agent_end") {
          requestCompletionShutdown();
        }

        if (event.type === "error" && event.error) {
          finalError = typeof event.error === "string"
            ? event.error
            : (event.error.message ?? finalError);
        }
      };
      proc.stdout.on("data", (chunk: Uint8Array | string) => {
        const text = chunk.toString();
        stdout += text;
        buffer += text;
        let newlineIndex = buffer.indexOf("\n");
        while (newlineIndex !== -1) {
          processLine(buffer.slice(0, newlineIndex));
          buffer = buffer.slice(newlineIndex + 1);
          newlineIndex = buffer.indexOf("\n");
        }
      });
      proc.stderr.on("data", (chunk: Uint8Array | string) => {
        stderr += chunk.toString();
      });
      timeoutTimer = setTimeout(() => {
        timedOut = true;
        finalError = finalError || `LLM narration summary timed out after ${Math.round(getNarrationSummaryTimeoutMs() / 1000)}s`;
        if (proc.exitCode === null && proc.signalCode === null) proc.kill("SIGTERM");
        completionForcedKillTimer = setTimeout(() => {
          if (proc.exitCode === null && proc.signalCode === null) proc.kill("SIGKILL");
        }, 2000);
      }, getNarrationSummaryTimeoutMs());
      proc.on("close", (code) => {
        if (timeoutTimer) clearTimeout(timeoutTimer);
        if (completionTimer) clearTimeout(completionTimer);
        if (completionForcedKillTimer) clearTimeout(completionForcedKillTimer);
        if (buffer.trim()) processLine(buffer);
        resolve({
          stdout,
          stderr,
          exitCode: completionRequested && !timedOut ? 0 : (code ?? 0),
          finalError,
          finalOutput,
          streamedOutput,
        });
      });
      proc.on("error", (err) => {
        if (timeoutTimer) clearTimeout(timeoutTimer);
        if (completionTimer) clearTimeout(completionTimer);
        if (completionForcedKillTimer) clearTimeout(completionForcedKillTimer);
        finalError = finalError || err.message;
        resolve({
          stdout,
          stderr: `${stderr}\n${err.message}`.trim(),
          exitCode: 1,
          finalError,
          finalOutput,
          streamedOutput,
        });
      });
    });

    const rawSummary = (output.finalOutput || output.streamedOutput).replace(/\s+/g, " ").trim();
    if (!rawSummary || output.exitCode !== 0 || output.finalError) {
      return {
        text: null,
        error: output.finalError || output.stderr.trim() || "LLM narration summary produced no output",
      };
    }

    const normalized = normalizeNarrationText(stripMarkdownSyntax(stripNarrationMetaCommentary(rawSummary)));
    return normalized
      ? { text: fitSegmentToBudget(normalized, maxChars) }
      : { text: null, error: "LLM narration summary produced empty normalized output" };
  } catch (err: any) {
    return { text: null, error: err?.message ?? "LLM narration summary failed" };
  } finally {
    if (tmpDir) {
      try {
        await fs.promises.rm(tmpDir, { recursive: true, force: true });
      } catch {}
    }
  }
}

const defaultHumanReadableSummaryDeps: HumanReadableSummaryDeps = {
  summarizeMemo: summarizeMemoWithLlm,
};

function findWorkspaceRoot(startPath: string): string | null {
  let current = startPath;
  try {
    if (!fs.statSync(current).isDirectory()) current = path.dirname(current);
  } catch {
    current = path.dirname(current);
  }

  while (true) {
    if (fs.existsSync(path.join(current, "boardroom"))) return current;
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

export function loadBoardroomEnv(startPath: string): string | null {
  const workspaceRoot = findWorkspaceRoot(startPath);
  if (!workspaceRoot) return null;

  const candidates = [
    path.join(workspaceRoot, "boardroom", ".env.local"),
    path.join(workspaceRoot, "boardroom", ".env"),
    path.join(workspaceRoot, ".env.local"),
    path.join(workspaceRoot, ".env"),
  ];

  for (const candidate of candidates) {
    if (!fs.existsSync(candidate)) continue;
    dotenv.config({ path: candidate, override: false });
    return candidate;
  }

  return null;
}

export function getElevenLabsSettings(startPath: string): ElevenLabsSettings {
  const loadedEnvPath = loadBoardroomEnv(startPath);
  return {
    apiKey: process.env.ELEVENLABS_API_KEY,
    voiceId: process.env.ELEVENLABS_VOICE_ID || DEFAULT_ELEVENLABS_VOICE_ID,
    modelId: process.env.ELEVENLABS_MODEL_ID || DEFAULT_ELEVENLABS_MODEL_ID,
    outputFormat: process.env.ELEVENLABS_OUTPUT_FORMAT || DEFAULT_ELEVENLABS_OUTPUT_FORMAT,
    loadedEnvPath,
  };
}

export function buildCloseoutSummary(info: CloseoutInfo): string {
  const disp = DISPOSITIONS[info.disposition];
  const lines = [
    `${disp.icon} BOARDROOM MEETING ${disp.label.toUpperCase()}`,
    "",
    `  Brief: ${info.briefTitle}`,
    `  Mode: ${info.mode}`,
    `  Outcome: ${disp.icon} ${disp.label} - ${disp.description}`,
    "",
    `  Duration: ${info.elapsedMinutes.toFixed(1)} minutes`,
    `  Estimated Cost: $${info.totalCost.toFixed(2)}`,
    `  Participants: ${info.roster.join(", ")}`,
    ...(info.abortReason ? [`  Abort Reason: ${info.abortReason}`] : []),
    "",
    `  Artifacts:`,
    `    Memo: ${info.memoPath}`,
    `    Debate log: ${info.debateJsonPath}`,
    `    Debate (md): ${info.debateMarkdownPath}`,
    ...(info.summaryPath ? [`    Summary: ${info.summaryPath}`] : []),
  ];

  if (info.visualPaths.length > 0) {
    lines.push(`    Visuals: ${info.visualPaths.length} diagram${info.visualPaths.length !== 1 ? "s" : ""}`);
    for (const vp of info.visualPaths) {
      lines.push(`      ${vp}`);
    }
  }

  return lines.join("\n");
}

export function buildThemedCloseoutLines(
  info: CloseoutInfo,
  theme: DashboardTheme,
): string[] {
  const disp = DISPOSITIONS[info.disposition];
  const lines: string[] = [];

  const dim = (t: string) => theme.fg("dim", t);
  const accent = (t: string) => theme.fg("accent", t);
  const muted = (t: string) => theme.fg("muted", t);

  const rule = dim("─".repeat(50));
  lines.push(rule);
  lines.push(`  ${theme.fg(disp.color, disp.icon)} ${theme.bold(accent("BOARDROOM MEETING"))} ${theme.fg(disp.color, disp.label.toUpperCase())}`);
  lines.push(rule);
  lines.push("");

  lines.push(`  ${muted("Brief:")} ${info.briefTitle}`);
  lines.push(`  ${muted("Mode:")} ${info.mode}`);
  lines.push(`  ${muted("Outcome:")} ${theme.fg(disp.color, `${disp.icon} ${disp.label}`)} ${dim("·")} ${disp.description}`);
  lines.push("");

  lines.push(`  ${muted("Duration:")} ${info.elapsedMinutes.toFixed(1)} minutes`);
  lines.push(`  ${muted("Estimated Cost:")} ${accent(`$${info.totalCost.toFixed(2)}`)}`);
  lines.push(`  ${muted("Participants:")} ${info.roster.join(", ")}`);
  if (info.abortReason) {
    lines.push(`  ${muted("Abort Reason:")} ${theme.fg("warning", info.abortReason)}`);
  }
  lines.push("");

  lines.push(`  ${theme.bold(muted("Artifacts:"))}`);
  lines.push(`    ${muted("Memo:")} ${accent(info.memoPath)}`);
  lines.push(`    ${muted("Debate:")} ${info.debateJsonPath}`);
  lines.push(`    ${muted("Debate (md):")} ${info.debateMarkdownPath}`);
  if (info.summaryPath) {
    lines.push(`    ${muted("Summary:")} ${accent(info.summaryPath)}`);
  }

  if (info.visualPaths.length > 0) {
    lines.push(`    ${muted("Visuals:")} ${info.visualPaths.length} diagram${info.visualPaths.length !== 1 ? "s" : ""}`);
    for (const vp of info.visualPaths) {
      lines.push(`      ${dim(vp)}`);
    }
  }

  lines.push("");
  return lines;
}

export function buildNarrationWidgetLines(
  state: NarrationDisplayState,
  theme: DashboardTheme,
): string[] {
  const frames = state.phase === "playing"
    ? ["[speaking   ]", "[ speaking  ]", "[  speaking ]", "[   speaking]"]
    : state.phase === "paused"
    ? ["[ paused    ]"]
    : state.phase === "completed"
    ? ["[ complete  ]"]
    : ["[generating ]", "[generating ]", "[ generating]", "[ generating]"];
  const frame = frames[state.indicatorFrame % frames.length] ?? frames[0];
  const muted = (text: string) => theme.fg("muted", text);
  const accent = (text: string) => theme.fg("accent", text);
  const success = (text: string) => theme.fg("success", text);
  const phaseLabel = state.phase === "playing"
    ? "Playing ElevenLabs summary"
    : state.phase === "paused"
    ? "Narration paused"
    : state.phase === "completed"
    ? "Narration ready"
    : "Generating ElevenLabs audio";

  let summary = state.summaryText;
  if (
    state.activeRange &&
    state.activeRange.start >= 0 &&
    state.activeRange.end > state.activeRange.start &&
    state.activeRange.end <= summary.length
  ) {
    const before = summary.slice(0, state.activeRange.start);
    const active = summary.slice(state.activeRange.start, state.activeRange.end);
    const after = summary.slice(state.activeRange.end);
    summary = `${before}${success(theme.bold(active))}${after}`;
  }

  const wrapped = wrapNarrationText(summary, 72);
  const progress = state.durationSeconds && Number.isFinite(state.durationSeconds)
    ? `${formatPlaybackTime(state.elapsedSeconds ?? 0)} / ${formatPlaybackTime(state.durationSeconds)}`
    : (state.elapsedSeconds !== undefined ? formatPlaybackTime(state.elapsedSeconds) : undefined);
  return [
    muted("Narration"),
    `${accent(frame)} ${theme.bold(phaseLabel)}`,
    ...(state.summaryPath ? [muted(state.summaryPath)] : []),
    ...(progress ? [muted(`Progress: ${progress}`)] : []),
    ...(state.controlsLabel ? [muted(state.controlsLabel)] : []),
    "",
    ...wrapped,
  ];
}

function formatPlaybackTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function wrapNarrationText(text: string, width: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    // Strip ANSI control codes when measuring so highlighted words do not blow out wrapping.
    const visibleLength = next.replace(/\x1b\[[0-9;]*m/g, "").length;
    if (current && visibleLength > width) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines;
}

export function isCursorAvailable(): boolean {
  try {
    execFileSync("which", ["cursor"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

export async function openInCursor(filePath: string): Promise<{ ok: boolean; error?: string }> {
  return new Promise((resolve) => {
    execFile("cursor", [filePath], (err) => {
      if (err) resolve({ ok: false, error: err.message });
      else resolve({ ok: true });
    });
  });
}

export function isElevenLabsConfigured(startPath: string): boolean {
  return !!getElevenLabsSettings(startPath).apiKey;
}

function stripMarkdownSyntax(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/^>\s*/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\|/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractSection(markdown: string, heading: string): string {
  const lines = markdown.split("\n");
  const target = heading.trim().toLowerCase();
  const sectionLines: string[] = [];
  let inSection = false;

  for (const line of lines) {
    const headingMatch = line.match(/^#{1,6}\s+(.+)$/);
    if (headingMatch) {
      const currentHeading = stripMarkdownSyntax(headingMatch[1]).toLowerCase();
      if (inSection) break;
      inSection = currentHeading === target;
      continue;
    }
    if (inSection) sectionLines.push(line);
  }

  return sectionLines.join("\n").trim();
}

function extractSectionByPrefix(markdown: string, headingPrefix: string): string {
  const lines = markdown.split("\n");
  const target = headingPrefix.trim().toLowerCase();
  const sectionLines: string[] = [];
  let inSection = false;

  for (const line of lines) {
    const headingMatch = line.match(/^#{1,6}\s+(.+)$/);
    if (headingMatch) {
      const currentHeading = stripMarkdownSyntax(headingMatch[1]).toLowerCase();
      if (inSection) break;
      inSection = currentHeading.startsWith(target);
      continue;
    }
    if (inSection) sectionLines.push(line);
  }

  return sectionLines.join("\n").trim();
}

function extractTopLevelSectionsByPrefix(markdown: string, headingPrefix: string): Array<{ heading: string; content: string }> {
  const lines = markdown.split("\n");
  const target = headingPrefix.trim().toLowerCase();
  const sections: Array<{ heading: string; content: string }> = [];
  let current: { heading: string; content: string[] } | null = null;

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const headingText = stripMarkdownSyntax(headingMatch[2]).trim();
      const normalizedHeading = headingText.toLowerCase();

      if (current && level <= 2) {
        sections.push({ heading: current.heading, content: current.content.join("\n").trim() });
        current = null;
      }

      if (level === 2 && normalizedHeading.startsWith(target)) {
        current = { heading: headingText, content: [] };
      }
      continue;
    }

    if (current) current.content.push(line);
  }

  if (current) {
    sections.push({ heading: current.heading, content: current.content.join("\n").trim() });
  }

  return sections;
}

function summarizeDecisionBlock(heading: string, content: string): string {
  const label = heading.replace(/^Decision\s*\d*\s*:?\s*/i, "").trim();
  const preferredSource = extractSectionByPrefix(content, "Board Decision")
    || extractSectionByPrefix(content, "Board Consensus")
    || extractSection(content, "Decision");
  const fallbackSource = stripMarkdownSyntax(content);
  const source = preferredSource || fallbackSource;
  const summary = stripTrailingSentencePunctuation(
    normalizeNarrationText(firstSentences(stripMarkdownSyntax(source), preferredSource ? 2 : 1)),
  );
  if (!label || !summary) return "";
  return `${label}: ${summary}`;
}

function summarizeSection(markdown: string, limit: number): string[] {
  if (!markdown) return [];

  const bulletMatches = markdown.match(/^\s*(?:[-*+]|\d+\.)\s+.+$/gm) ?? [];
  const source = bulletMatches.length > 0
    ? bulletMatches.map(line => stripMarkdownSyntax(line))
    : stripMarkdownSyntax(markdown).split(/(?<=[.!?])\s+/);

  return source
    .map(line => line.trim())
    .filter(Boolean)
    .slice(0, limit);
}

function trimToSentence(text: string): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  return splitSentences(normalized)[0] ?? normalized;
}

function firstSentences(text: string, count: number): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  return splitSentences(normalized).slice(0, count).join(" ").trim();
}

function splitSentences(text: string): string[] {
  const placeholder = "__DECIMAL_POINT__";
  const protectedText = text.replace(/(\d)\.(\d)/g, `$1${placeholder}$2`);
  const matches = protectedText.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [];
  return matches
    .map(sentence => sentence.replace(new RegExp(placeholder, "g"), ".").trim())
    .filter(Boolean);
}

const SMALL_NUMBER_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen",
];

const TENS_WORDS = [
  "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety",
];

function chunkToWords(value: number): string {
  if (value < 20) return SMALL_NUMBER_WORDS[value] ?? String(value);
  if (value < 100) {
    const tens = Math.floor(value / 10);
    const rest = value % 10;
    return rest === 0 ? TENS_WORDS[tens] : `${TENS_WORDS[tens]}-${SMALL_NUMBER_WORDS[rest]}`;
  }
  const hundreds = Math.floor(value / 100);
  const rest = value % 100;
  if (rest === 0) return `${SMALL_NUMBER_WORDS[hundreds]}-hundred`;
  return `${SMALL_NUMBER_WORDS[hundreds]}-hundred-and-${chunkToWords(rest)}`;
}

function integerToWords(value: number): string {
  if (!Number.isFinite(value)) return String(value);
  if (value === 0) return "zero";
  if (value < 0) return `minus ${integerToWords(Math.abs(value))}`;

  const scales: Array<{ value: number; label: string }> = [
    { value: 1_000_000_000, label: "billion" },
    { value: 1_000_000, label: "million" },
    { value: 1_000, label: "thousand" },
  ];

  let remaining = value;
  const parts: string[] = [];

  for (const scale of scales) {
    if (remaining < scale.value) continue;
    const count = Math.floor(remaining / scale.value);
    parts.push(`${chunkToWords(count)} ${scale.label}`);
    remaining %= scale.value;
  }

  if (remaining > 0) {
    parts.push(chunkToWords(remaining));
  }

  return parts.join(" ");
}

function decimalToWords(raw: string): string {
  const normalized = raw.replace(/,/g, "");
  const [wholePart, fractionPart = ""] = normalized.split(".");
  const whole = integerToWords(Number(wholePart || "0"));
  if (!fractionPart) return whole;
  const fraction = fractionPart
    .split("")
    .map((digit) => SMALL_NUMBER_WORDS[Number(digit)] ?? digit)
    .join("-");
  return `${whole}-point-${fraction}`;
}

function scaledSuffixMultiplier(suffix?: string): number {
  switch ((suffix ?? "").toUpperCase()) {
    case "K": return 1_000;
    case "M": return 1_000_000;
    case "B": return 1_000_000_000;
    default: return 1;
  }
}

function scaledNumberToWords(raw: string, suffix?: string): string {
  const normalized = raw.replace(/,/g, "");
  const scaled = Number(normalized) * scaledSuffixMultiplier(suffix);
  if (Number.isInteger(scaled)) {
    return integerToWords(Math.round(scaled));
  }
  return decimalToWords(String(scaled));
}

function moneyToWords(raw: string, suffix?: string): string {
  if (suffix) {
    return `${scaledNumberToWords(raw, suffix)} dollars`;
  }

  const normalized = raw.replace(/,/g, "");
  const value = Number(normalized);
  if (!Number.isFinite(value)) return `${raw} dollars`;

  if (normalized.includes(".")) {
    const dollars = Math.trunc(value);
    const cents = Math.round((value - dollars) * 100);
    if (dollars === 0 && cents > 0) {
      return `${integerToWords(cents)} cents`;
    }
    if (cents === 0) {
      return `${integerToWords(dollars)} dollars`;
    }
    return `${integerToWords(dollars)} dollars and ${integerToWords(cents)} cents`;
  }

  return `${integerToWords(value)} dollars`;
}

function applyApproximation(prefix: string | undefined, spoken: string): string {
  return prefix ? `approximately ${spoken}` : spoken;
}

function normalizeNarrationText(text: string): string {
  let normalized = text;

  normalized = normalized
    .replace(/\bARR\b/g, "annual recurring revenue")
    .replace(/\bMRR\b/g, "monthly recurring revenue")
    .replace(/\bLOI\b/g, "letter of intent")
    .replace(/\bDAW\b/g, "digital audio workstation")
    .replace(/≤/g, " less than or equal to ")
    .replace(/≥/g, " greater than or equal to ");

  normalized = normalized.replace(
    /(~)?\$(\d[\d,]*(?:\.\d+)?)(?:\s*-\s*\$?(\d[\d,]*(?:\.\d+)?))?([KMB])?(\/(?:month|mo|year|yr))?/gi,
    (_match, approx, start, end, suffix, cadence) => {
      const range = end
        ? `${scaledNumberToWords(start, suffix)} to ${scaledNumberToWords(end, suffix)} dollars`
        : moneyToWords(start, suffix);
      const period = cadence
        ? cadence.toLowerCase().includes("year")
          ? " per year"
          : " per month"
        : "";
      return `${applyApproximation(approx, range)}${period}`;
    },
  );

  normalized = normalized.replace(
    /(~)?(\d[\d,]*(?:\.\d+)?)(?:\s*-\s*(\d[\d,]*(?:\.\d+)?))%/g,
    (_match, approx, start, end) => applyApproximation(
      approx,
      `${decimalToWords(start)} to ${decimalToWords(end)} percent`,
    ),
  );

  normalized = normalized.replace(
    /(~)?(\d[\d,]*(?:\.\d+)?)%/g,
    (_match, approx, value) => applyApproximation(approx, `${decimalToWords(value)} percent`),
  );

  normalized = normalized.replace(
    /\b(\d[\d,]*(?:\.\d+)?)([KMB])?\s*-\s*(\d[\d,]*(?:\.\d+)?)([KMB]?)(?=\s+(months?|weeks?|days?|years?|users?|engineers?|sprints?|hours?|minutes?|projects?|signups?))/gi,
    (_match, start, startSuffix, end, endSuffix) => `${scaledNumberToWords(start, startSuffix || endSuffix)} to ${scaledNumberToWords(end, endSuffix || startSuffix)}`,
  );

  normalized = normalized.replace(
    /\b(\d[\d,]*(?:\.\d+)?)\s*[–—-]\s*(\d[\d,]*(?:\.\d+)?)(?![A-Za-z])/g,
    (_match, start, end) => `${decimalToWords(start)} to ${decimalToWords(end)}`,
  );

  normalized = normalized.replace(
    /\b(\d[\d,]*(?:\.\d+)?)([KMB]?)(?=\s+(months?|weeks?|days?|years?|users?|engineers?|sprints?|hours?|minutes?|projects?|signups?|squads?|milestones?))/gi,
    (_match, value, suffix) => scaledNumberToWords(value, suffix),
  );

  normalized = normalized.replace(
    /\b(\d[\d,]*(?:\.\d+)?)([KMB])?\+(?=\b|\s)/gi,
    (_match, value, suffix) => `${scaledNumberToWords(value, suffix)} or more`,
  );

  normalized = normalized.replace(
    /\b(\d[\d,]*(?:\.\d+)?)x\b/gi,
    (_match, value) => `${decimalToWords(value)} times`,
  );

  normalized = normalized
    .replace(/\/month\b/gi, " per month")
    .replace(/\/mo\b/gi, " per month")
    .replace(/\/yr\b/gi, " per year")
    .replace(/\/year\b/gi, " per year")
    .replace(/[–—]/g, ", ")
    .replace(/~/g, "approximately ")
    .replace(/\s+/g, " ")
    .trim();

  return normalized;
}

function fitSegmentToBudget(segment: string, remainingChars: number): string {
  if (remainingChars <= 0) return "";
  if (segment.length <= remainingChars) return segment;
  if (remainingChars <= 3) return ".".repeat(remainingChars);

  const sliced = segment.slice(0, remainingChars - 3).trimEnd();
  const sentenceBoundary = Math.max(
    sliced.lastIndexOf(". "),
    sliced.lastIndexOf("! "),
    sliced.lastIndexOf("? "),
  );
  if (sentenceBoundary > Math.max(remainingChars * 0.45, 24)) {
    return `${sliced.slice(0, sentenceBoundary + 1).trimEnd()}...`;
  }

  const wordBoundary = sliced.lastIndexOf(" ");
  if (wordBoundary > 20) {
    return `${sliced.slice(0, wordBoundary).trimEnd()}...`;
  }

  return `${sliced}...`;
}

function compactNarrationSection(label: string, items: string[], joiner = " "): string {
  const cleaned = items
    .map(item => normalizeNarrationText(trimToSentence(stripMarkdownSyntax(item))))
    .map(item => item.replace(/\.$/, "").trim())
    .filter(Boolean);
  if (cleaned.length === 0) return "";
  return `${label} ${cleaned.join(joiner)}.`;
}

function stripTrailingSentencePunctuation(text: string): string {
  return text.replace(/[.!?]+$/g, "").trim();
}

function compactNarrationParagraph(label: string, markdown: string, sentenceCount: number): string {
  const raw = stripMarkdownSyntax(markdown);
  if (!raw) return "";
  const spoken = normalizeNarrationText(firstSentences(raw, sentenceCount));
  const cleaned = stripTrailingSentencePunctuation(spoken);
  if (!cleaned) return "";
  return `${label} ${cleaned}.`;
}

export function summarizeMemoForNarration(markdown: string, maxChars = DEFAULT_NARRATION_MAX_CHARS): string {
  const titleMatch = markdown.match(/^#{1,6}\s+(.+)$/m);
  const title = normalizeNarrationText(stripMarkdownSyntax(titleMatch?.[1] ?? "Boardroom meeting"));
  const decisionSections = extractTopLevelSectionsByPrefix(markdown, "Decision");
  const decisionSummaries = decisionSections
    .map(({ heading, content }) => summarizeDecisionBlock(heading, content))
    .filter(Boolean);
  const executiveSummaryPoints = summarizeSection(extractSection(markdown, "Executive Summary"), 4);
  const crossCuttingPoints = summarizeSection(extractSection(markdown, "Cross-Cutting Themes"), 3);
  const finalRecommendationPoints = summarizeSection(extractSection(markdown, "Final Recommendations"), 3);

  const decision = stripTrailingSentencePunctuation(
    normalizeNarrationText(firstSentences(stripMarkdownSyntax(extractSection(markdown, "Decision")), 2)),
  );
  const question = decisionSections.length <= 1
    ? stripTrailingSentencePunctuation(
        normalizeNarrationText(trimToSentence(stripMarkdownSyntax(extractSection(markdown, "Strategic Question")))),
      )
    : "";
  const multiDecisionQuestions = decisionSections
    .map(({ heading, content }) => {
      const label = heading.replace(/^Decision\s*\d*\s*:?\s*/i, "").trim();
      const sectionQuestion = stripTrailingSentencePunctuation(
        normalizeNarrationText(trimToSentence(stripMarkdownSyntax(extractSection(content, "Strategic Question")))),
      );
      if (!label || !sectionQuestion) return "";
      return `${label}: ${sectionQuestion}`;
    })
    .filter(Boolean);
  const evidencePoints = summarizeSection(
    extractSection(markdown, "Context & Evidence") || extractSection(markdown, "Context"),
    3,
  );
  const riskPoints = summarizeSection(
    extractSection(markdown, "Risk Assessment") || extractSectionByPrefix(markdown, "Risk"),
    2,
  );
  const timingPoints = summarizeSection(extractSection(markdown, "Timing"), 2);
  const bottomLineParagraph = compactNarrationParagraph("Bottom line:", extractSection(markdown, "The bottom line"), 2);

  const segments = [
    `Boardroom summary for ${title}.`,
    compactNarrationSection("Executive summary:", executiveSummaryPoints),
    decisionSummaries.length > 0 ? compactNarrationSection("Decisions covered:", decisionSummaries) : "",
    finalRecommendationPoints.length > 0 ? compactNarrationSection("Recommendations:", finalRecommendationPoints) : "",
    decision && executiveSummaryPoints.length === 0 ? `Decision: ${decision}.` : "",
    question ? `Question: ${question}.` : "",
    multiDecisionQuestions.length > 0 ? compactNarrationSection("Questions addressed:", multiDecisionQuestions) : "",
    crossCuttingPoints.length > 0 ? compactNarrationSection("Cross-cutting themes:", crossCuttingPoints) : "",
    compactNarrationSection("Reasons:", evidencePoints),
    compactNarrationSection("Risk:", riskPoints),
    compactNarrationSection("Timing:", timingPoints),
    bottomLineParagraph,
  ].filter(Boolean);

  const assembled: string[] = [];
  let remainingChars = maxChars;

  for (const segment of segments) {
    const prefix = assembled.length > 0 ? " " : "";
    const candidate = `${prefix}${segment}`;
    const fitted = fitSegmentToBudget(candidate, remainingChars);
    if (!fitted) break;
    assembled.push(assembled.length > 0 ? fitted.trimStart() : fitted);
    remainingChars -= fitted.length;
    if (fitted.endsWith("...")) break;
  }

  const summary = normalizeNarrationText(assembled.join(" ").replace(/\s+/g, " ").trim());
  if (summary.length <= maxChars) return summary;
  return fitSegmentToBudget(summary, maxChars);
}

function getNarrationArtifactPaths(memoPath: string, outputDir: string): {
  audioPath: string;
  summaryPath: string;
} {
  const stem = path.basename(memoPath, ".md");
  return {
    audioPath: path.join(outputDir, `${stem}-narration.mp3`),
    summaryPath: path.join(outputDir, `${stem}-narration.txt`),
  };
}

export async function generateHumanReadableSummary(
  memoPath: string,
  outputDir: string,
  deps: HumanReadableSummaryDeps = defaultHumanReadableSummaryDeps,
): Promise<HumanReadableSummaryResult> {
  let markdown = "";
  try {
    markdown = await fs.promises.readFile(memoPath, "utf-8");
  } catch {
    return { ok: false, error: "Could not read memo for human-readable summary" };
  }

  const llmResult = await deps.summarizeMemo?.(memoPath, markdown, DEFAULT_NARRATION_MAX_CHARS);
  const llmText = typeof llmResult === "string" ? llmResult : llmResult?.text;
  const llmError = typeof llmResult === "string" ? undefined : llmResult?.error;
  const cleanedLlmText = llmText?.trim()
    ? normalizeNarrationText(stripMarkdownSyntax(stripNarrationMetaCommentary(llmText)))
    : "";
  const text = cleanedLlmText || summarizeMemoForNarration(markdown);
  if (!text) return { ok: false, error: "Could not read memo for human-readable summary" };

  const { summaryPath } = getNarrationArtifactPaths(memoPath, outputDir);
  try {
    await fs.promises.writeFile(summaryPath, `${text}\n`, "utf-8");
    return {
      ok: true,
      summaryPath,
      summaryText: text,
      warning: cleanedLlmText
        ? undefined
        : `LLM summary failed (${llmError ?? "no output"}). Fell back to deterministic narration summary.`,
    };
  } catch (err: any) {
    return { ok: false, error: err.message ?? "Failed to write human-readable summary" };
  }
}

function toNarrationAlignment(
  alignment?: {
    characters?: string[];
    characterStartTimesSeconds?: number[];
    characterEndTimesSeconds?: number[];
  } | null,
): NarrationAlignment | undefined {
  if (!alignment) return undefined;
  const characters = Array.isArray(alignment.characters) ? alignment.characters : [];
  const starts = Array.isArray(alignment.characterStartTimesSeconds)
    ? alignment.characterStartTimesSeconds
    : [];
  const ends = Array.isArray(alignment.characterEndTimesSeconds)
    ? alignment.characterEndTimesSeconds
    : [];
  const count = Math.min(characters.length, starts.length, ends.length);
  if (count === 0) return undefined;
  return {
    characters: characters.slice(0, count),
    characterStartTimesSeconds: starts.slice(0, count),
    characterEndTimesSeconds: ends.slice(0, count),
  };
}

export function findNarrationActiveRange(
  text: string,
  alignment: NarrationAlignment | undefined,
  elapsedSeconds: number,
): { start: number; end: number } | undefined {
  if (!alignment) return undefined;

  const count = Math.min(
    alignment.characters.length,
    alignment.characterStartTimesSeconds.length,
    alignment.characterEndTimesSeconds.length,
    text.length,
  );

  for (let index = 0; index < count; index += 1) {
    const start = alignment.characterStartTimesSeconds[index];
    const end = alignment.characterEndTimesSeconds[index];
    if (elapsedSeconds < start || elapsedSeconds > end) continue;
    if (/\s/.test(text[index] ?? "")) continue;

    let rangeStart = index;
    let rangeEnd = index + 1;

    while (rangeStart > 0 && !/\s/.test(text[rangeStart - 1] ?? "")) {
      rangeStart -= 1;
    }
    while (rangeEnd < text.length && !/\s/.test(text[rangeEnd] ?? "")) {
      rangeEnd += 1;
    }

    return { start: rangeStart, end: rangeEnd };
  }

  return undefined;
}

export async function generateNarration(
  memoPath: string,
  outputDir: string,
  summaryInput?: NarrationSummaryInput,
): Promise<NarrationResult> {
  const settings = getElevenLabsSettings(memoPath);
  if (!settings.apiKey) return { ok: false, error: "ELEVENLABS_API_KEY not set" };

  const { audioPath } = getNarrationArtifactPaths(memoPath, outputDir);
  let text = summaryInput?.summaryText;
  let summaryPath = summaryInput?.summaryPath;

  if (!text || !summaryPath) {
    const summary = await generateHumanReadableSummary(memoPath, outputDir);
    if (!summary.ok || !summary.summaryText || !summary.summaryPath) {
      return { ok: false, error: summary.error ?? "Could not read memo for narration" };
    }
    text = summary.summaryText;
    summaryPath = summary.summaryPath;
  }

  try {
    const elevenlabs = new ElevenLabsClient({
      apiKey: settings.apiKey,
    });
    const response = await elevenlabs.textToSpeech.convertWithTimestamps(settings.voiceId, {
      text,
      modelId: settings.modelId,
      outputFormat: settings.outputFormat as any,
      voiceSettings: {
        stability: 0.5,
        similarityBoost: 0.75,
      },
    });
    const alignment = toNarrationAlignment(response.normalizedAlignment ?? response.alignment);
    const spokenText = alignment?.characters.join("") || text;
    const buffer = Buffer.from(response.audioBase64, "base64");
    await fs.promises.writeFile(audioPath, buffer);
    if (spokenText !== text) {
      await fs.promises.writeFile(summaryPath, `${spokenText}\n`, "utf-8");
    }
    return {
      ok: true,
      audioPath,
      summaryPath,
      summaryText: spokenText,
      alignment,
    };
  } catch (err: any) {
    return { ok: false, error: err.message ?? "Unknown ElevenLabs error" };
  }
}

export async function playAudio(audioPath: string): Promise<{ ok: boolean; error?: string }> {
  return new Promise((resolve) => {
    const player = process.platform === "darwin" ? "afplay" : "mpv";
    execFile(player, ["--", audioPath], (err) => {
      if (err) resolve({ ok: false, error: err.message });
      else resolve({ ok: true });
    });
  });
}

function isMpvAvailable(): boolean {
  try {
    execFileSync("which", ["mpv"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function getAudioDurationSeconds(audioPath: string): number | undefined {
  try {
    const output = execFileSync(
      "ffprobe",
      [
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "default=noprint_wrappers=1:nokey=1",
        "--",
        audioPath,
      ],
      { encoding: "utf-8" },
    ).trim();
    const duration = Number(output);
    return Number.isFinite(duration) && duration > 0 ? duration : undefined;
  } catch {
    return undefined;
  }
}

export class NarrationPlaybackController {
  private proc: ReturnType<typeof spawn> | null = null;
  private socketPath = path.join(os.tmpdir(), `boardroom-mpv-${randomUUID()}.sock`);
  private baseOffsetSeconds = 0;
  private startedAtMs: number | null = null;
  private stopping = false;

  paused = false;
  completed = false;
  readonly durationSeconds: number | undefined;

  constructor(
    readonly audioPath: string,
    private readonly onStateChange?: () => void,
  ) {
    this.durationSeconds = getAudioDurationSeconds(audioPath);
  }

  get isControllable(): boolean {
    return isMpvAvailable();
  }

  get elapsedSeconds(): number {
    if (this.completed) return this.durationSeconds ?? this.baseOffsetSeconds;
    if (this.paused || this.startedAtMs === null) return this.baseOffsetSeconds;
    const elapsed = this.baseOffsetSeconds + ((Date.now() - this.startedAtMs) / 1000);
    if (this.durationSeconds === undefined) return elapsed;
    return Math.min(this.durationSeconds, elapsed);
  }

  private notifyStateChange(): void {
    this.onStateChange?.();
  }

  private async waitForSocketReady(timeoutMs = 3000): Promise<void> {
    const startedAt = Date.now();
    while (!fs.existsSync(this.socketPath)) {
      if (Date.now() - startedAt > timeoutMs) {
        throw new Error("Timed out waiting for mpv control socket.");
      }
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  private async sendCommand(command: unknown[]): Promise<void> {
    await this.waitForSocketReady();
    await new Promise<void>((resolve, reject) => {
      const socket = net.createConnection(this.socketPath);
      socket.on("connect", () => {
        socket.write(`${JSON.stringify({ command })}\n`);
      });
      socket.on("data", () => {
        socket.end();
        resolve();
      });
      socket.on("error", (err) => {
        socket.destroy();
        reject(err);
      });
    });
  }

  private async stopProcess(): Promise<void> {
    if (!this.proc) return;
    const proc = this.proc;
    this.proc = null;
    this.stopping = true;
    await new Promise<void>((resolve) => {
      let killTimer: ReturnType<typeof setTimeout> | null = null;
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        if (killTimer) clearTimeout(killTimer);
        resolve();
      };
      proc.once("close", finish);
      proc.kill("SIGTERM");
      killTimer = setTimeout(() => {
        if (proc.exitCode === null && proc.signalCode === null) {
          try {
            proc.kill("SIGKILL");
          } catch {
            // Ignore if already closed.
          }
        }
      }, 1000);
    });
    this.stopping = false;
  }

  async start(startSeconds = 0, paused = false): Promise<void> {
    if (!this.isControllable) {
      throw new Error("Controllable narration playback requires mpv.");
    }

    await this.stopProcess();
    if (fs.existsSync(this.socketPath)) {
      try { fs.unlinkSync(this.socketPath); } catch {}
    }

    const args = [
      "--no-terminal",
      "--really-quiet",
      "--force-window=no",
      `--input-ipc-server=${this.socketPath}`,
      ...(startSeconds > 0 ? [`--start=${startSeconds}`] : []),
      ...(paused ? ["--pause=yes"] : []),
      "--",
      this.audioPath,
    ];

    this.baseOffsetSeconds = Math.max(0, startSeconds);
    this.startedAtMs = paused ? null : Date.now();
    this.paused = paused;
    this.completed = false;
    const proc = spawn("mpv", args, {
      stdio: ["ignore", "ignore", "ignore"],
    });
    this.proc = proc;

    await new Promise<void>((resolve, reject) => {
      const handleSpawn = () => {
        proc.off("error", handleError);
        resolve();
      };
      const handleError = (err: Error) => {
        proc.off("spawn", handleSpawn);
        this.proc = null;
        try { fs.unlinkSync(this.socketPath); } catch {}
        reject(err);
      };
      proc.once("spawn", handleSpawn);
      proc.once("error", handleError);
    });

    proc.once("close", () => {
      this.proc = null;
      try { fs.unlinkSync(this.socketPath); } catch {}
      if (this.stopping) return;
      this.baseOffsetSeconds = this.durationSeconds ?? this.elapsedSeconds;
      this.startedAtMs = null;
      this.paused = false;
      this.completed = true;
      this.notifyStateChange();
    });

    this.notifyStateChange();
  }

  async togglePause(): Promise<void> {
    if (this.completed) {
      await this.start(0, false);
      return;
    }
    if (!this.proc) {
      await this.start(this.baseOffsetSeconds, false);
      return;
    }

    if (this.paused) {
      await this.sendCommand(["set_property", "pause", false]);
      this.paused = false;
      this.startedAtMs = Date.now();
    } else {
      this.baseOffsetSeconds = this.elapsedSeconds;
      await this.sendCommand(["set_property", "pause", true]);
      this.paused = true;
      this.startedAtMs = null;
    }
    this.notifyStateChange();
  }

  async seekRelative(deltaSeconds: number): Promise<void> {
    const target = Math.max(
      0,
      Math.min(this.durationSeconds ?? Number.MAX_SAFE_INTEGER, this.elapsedSeconds + deltaSeconds),
    );

    if (this.completed || !this.proc) {
      await this.start(target, false);
      return;
    }

    await this.sendCommand(["seek", deltaSeconds, "relative"]);
    this.baseOffsetSeconds = target;
    this.startedAtMs = this.paused ? null : Date.now();
    this.completed = false;
    this.notifyStateChange();
  }

  async restart(): Promise<void> {
    await this.start(0, false);
  }

  async dispose(): Promise<void> {
    await this.stopProcess();
    try { fs.unlinkSync(this.socketPath); } catch {}
  }
}

export interface PostMeetingContext {
  hasUI: boolean;
  confirm: (title: string, body: string) => Promise<boolean>;
  notify: (msg: string, type: "info" | "warning" | "error") => void;
  setNarrationState?: (state: NarrationDisplayState | null) => void;
  startNarrationPlayback?: (request: NarrationPlaybackRequest) => Promise<NarrationPlaybackResult>;
}

export interface PostMeetingActionsDeps {
  isCursorAvailable: () => boolean;
  openInCursor: (filePath: string) => Promise<{ ok: boolean; error?: string }>;
  isElevenLabsConfigured: (startPath: string) => boolean;
  generateHumanReadableSummary: (
    memoPath: string,
    outputDir: string,
  ) => Promise<HumanReadableSummaryResult>;
  generateNarration: (
    memoPath: string,
    outputDir: string,
    summaryInput?: NarrationSummaryInput,
  ) => Promise<NarrationResult>;
  playAudio: (audioPath: string) => Promise<{ ok: boolean; error?: string }>;
}

const defaultPostMeetingDeps: PostMeetingActionsDeps = {
  isCursorAvailable,
  openInCursor,
  isElevenLabsConfigured,
  generateHumanReadableSummary,
  generateNarration,
  playAudio,
};

export async function runPostMeetingActions(
  info: CloseoutInfo,
  ctx: PostMeetingContext,
  deps: PostMeetingActionsDeps = defaultPostMeetingDeps,
): Promise<void> {
  if (!ctx.hasUI) return;
  const elevenLabsSettings = getElevenLabsSettings(info.memoPath);
  const outputDir = path.dirname(info.memoPath);

  if (deps.isCursorAvailable()) {
    const openCursor = await ctx.confirm(
      "Open memo in Cursor?",
      `Open ${path.basename(info.memoPath)} in Cursor IDE?`,
    );
    if (openCursor) {
      const result = await deps.openInCursor(info.memoPath);
      if (result.ok) {
        ctx.notify("Opened memo in Cursor.", "info");
      } else {
        ctx.notify(`Failed to open in Cursor: ${result.error}`, "warning");
      }
    }
  } else {
    ctx.notify("Cursor CLI not found. Install from Cursor > Settings > Install CLI.", "info");
  }

  if (deps.isElevenLabsConfigured(info.memoPath)) {
    const generateAudio = await ctx.confirm(
      "Generate audio narration?",
      `Use ElevenLabs to generate a spoken summary of the board memo?\n\nVoice: ${elevenLabsSettings.voiceId}\nModel: ${elevenLabsSettings.modelId}`,
    );
    if (generateAudio) {
      if (!info.summaryText || !info.summaryPath) {
        const summaryResult = await deps.generateHumanReadableSummary(info.memoPath, outputDir);
        if (summaryResult.ok) {
          info.summaryText = summaryResult.summaryText;
          info.summaryPath = summaryResult.summaryPath;
        }
      }

      ctx.notify("Generating narration via ElevenLabs...", "info");
      let indicatorFrame = 0;
      const updateGenerating = () => {
        ctx.setNarrationState?.({
          phase: "generating",
          summaryText: info.summaryText ?? "Preparing human-readable summary for narration.",
          summaryPath: info.summaryPath,
          indicatorFrame,
        });
        indicatorFrame += 1;
      };
      updateGenerating();
      const generationTimer = setInterval(updateGenerating, 200);
      let result: NarrationResult;
      try {
        result = await deps.generateNarration(info.memoPath, outputDir, {
          summaryText: info.summaryText,
          summaryPath: info.summaryPath,
        });
      } finally {
        clearInterval(generationTimer);
      }

      if (result.ok && result.audioPath && result.summaryText) {
        ctx.notify(`Narration saved: ${result.audioPath}`, "info");
        if (result.summaryPath) {
          ctx.notify(`Narration summary saved: ${result.summaryPath}`, "info");
        }

        const play = await ctx.confirm(
          "Play narration?",
          [
            `Play ${path.basename(result.audioPath)} now?`,
            result.summaryPath ? `Summary: ${path.basename(result.summaryPath)}` : "",
            "",
            result.summaryText,
          ].filter(Boolean).join("\n"),
        );
        if (play) {
          if (ctx.startNarrationPlayback) {
            const startResult = await ctx.startNarrationPlayback({
              audioPath: result.audioPath,
              summaryText: result.summaryText,
              summaryPath: result.summaryPath,
              alignment: result.alignment,
              autoplay: true,
            });
            if (!startResult.ok) {
              ctx.notify(`Playback failed: ${startResult.error}`, "warning");
            }
          } else {
            let indicatorFrame = 0;
            const startedAt = Date.now();
            const updateNarration = () => {
              ctx.setNarrationState?.({
                phase: "playing",
                summaryText: result.summaryText!,
                summaryPath: result.summaryPath,
                indicatorFrame,
                activeRange: findNarrationActiveRange(
                  result.summaryText!,
                  result.alignment,
                  (Date.now() - startedAt) / 1000,
                ),
                controlsLabel: "Dismiss with Escape or by sending a new prompt.",
              });
              indicatorFrame += 1;
            };

            updateNarration();
            const playbackTimer = setInterval(updateNarration, 200);
            const playResult = await deps.playAudio(result.audioPath);
            clearInterval(playbackTimer);
            ctx.setNarrationState?.({
              phase: "completed",
              summaryText: result.summaryText!,
              summaryPath: result.summaryPath,
              indicatorFrame: 0,
              elapsedSeconds: result.alignment?.characterEndTimesSeconds.at(-1),
              durationSeconds: result.alignment?.characterEndTimesSeconds.at(-1),
              controlsLabel: "Dismiss with Escape or by sending a new prompt.",
            });
            if (!playResult.ok) {
              ctx.notify(`Playback failed: ${playResult.error}`, "warning");
            }
          }
        } else {
          if (ctx.startNarrationPlayback) {
            await ctx.startNarrationPlayback({
              audioPath: result.audioPath,
              summaryText: result.summaryText,
              summaryPath: result.summaryPath,
              alignment: result.alignment,
              autoplay: false,
            });
          } else {
            ctx.setNarrationState?.({
              phase: "completed",
              summaryText: result.summaryText,
              summaryPath: result.summaryPath,
              indicatorFrame: 0,
              elapsedSeconds: 0,
              durationSeconds: result.alignment?.characterEndTimesSeconds.at(-1),
              controlsLabel: "Use /board-narration restart to play, or dismiss with Escape/new prompt.",
            });
          }
        }
      } else {
        ctx.setNarrationState?.(null);
        ctx.notify(`Narration failed: ${result.error}`, "warning");
      }
    }
  } else {
    const envHint = elevenLabsSettings.loadedEnvPath
      ? `Checked ${elevenLabsSettings.loadedEnvPath}`
      : "Expected boardroom/.env.local, boardroom/.env, .env.local, or .env";
    ctx.notify(`ElevenLabs is not configured. Set ELEVENLABS_API_KEY to enable narration. ${envHint}`, "info");
  }
}
