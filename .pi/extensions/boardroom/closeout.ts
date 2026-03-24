import { execFile, execFileSync } from "node:child_process";
import * as fs from "node:fs";
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
const DEFAULT_NARRATION_MAX_CHARS = 1800;

export interface ElevenLabsSettings {
  apiKey: string | undefined;
  voiceId: string;
  modelId: string;
  outputFormat: string;
  loadedEnvPath: string | null;
}

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
    `  Total Cost: $${info.totalCost.toFixed(2)}`,
    `  Participants: ${info.roster.join(", ")}`,
    ...(info.abortReason ? [`  Abort Reason: ${info.abortReason}`] : []),
    "",
    `  Artifacts:`,
    `    Memo: ${info.memoPath}`,
    `    Debate log: ${info.debateJsonPath}`,
    `    Debate (md): ${info.debateMarkdownPath}`,
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
  lines.push(`  ${muted("Total Cost:")} ${accent(`$${info.totalCost.toFixed(2)}`)}`);
  lines.push(`  ${muted("Participants:")} ${info.roster.join(", ")}`);
  if (info.abortReason) {
    lines.push(`  ${muted("Abort Reason:")} ${theme.fg("warning", info.abortReason)}`);
  }
  lines.push("");

  lines.push(`  ${theme.bold(muted("Artifacts:"))}`);
  lines.push(`    ${muted("Memo:")} ${accent(info.memoPath)}`);
  lines.push(`    ${muted("Debate:")} ${info.debateJsonPath}`);
  lines.push(`    ${muted("Debate (md):")} ${info.debateMarkdownPath}`);

  if (info.visualPaths.length > 0) {
    lines.push(`    ${muted("Visuals:")} ${info.visualPaths.length} diagram${info.visualPaths.length !== 1 ? "s" : ""}`);
    for (const vp of info.visualPaths) {
      lines.push(`      ${dim(vp)}`);
    }
  }

  lines.push("");
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

export function summarizeMemoForNarration(markdown: string, maxChars = DEFAULT_NARRATION_MAX_CHARS): string {
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  const title = stripMarkdownSyntax(titleMatch?.[1] ?? "Boardroom meeting");

  const decision = stripMarkdownSyntax(extractSection(markdown, "Decision"));
  const question = stripMarkdownSyntax(extractSection(markdown, "Strategic Question"));
  const evidencePoints = summarizeSection(
    extractSection(markdown, "Context & Evidence") || extractSection(markdown, "Context"),
    3,
  );
  const riskPoints = summarizeSection(extractSection(markdown, "Risk Assessment"), 2);
  const timingPoints = summarizeSection(extractSection(markdown, "Timing"), 2);

  const parts: string[] = [`Boardroom summary for ${title}.`];

  if (decision) {
    parts.push(`The decision is: ${decision}`);
  }
  if (question) {
    parts.push(`The core question was: ${question}`);
  }
  if (evidencePoints.length > 0) {
    parts.push(`The main reasons were: ${evidencePoints.join(" ")}`);
  }
  if (riskPoints.length > 0) {
    parts.push(`The key risks were: ${riskPoints.join(" ")}`);
  }
  if (timingPoints.length > 0) {
    parts.push(`The next timing checkpoints were: ${timingPoints.join(" ")}`);
  }

  const summary = stripMarkdownSyntax(parts.join(" "));
  if (summary.length <= maxChars) return summary;

  return `${summary.slice(0, maxChars).trimEnd()}...`;
}

function extractNarrationText(memoPath: string, maxChars = DEFAULT_NARRATION_MAX_CHARS): string {
  try {
    const content = fs.readFileSync(memoPath, "utf-8");
    return summarizeMemoForNarration(content, maxChars);
  } catch {
    return "";
  }
}

export async function generateNarration(
  memoPath: string,
  outputDir: string,
): Promise<{ ok: boolean; audioPath?: string; error?: string }> {
  const settings = getElevenLabsSettings(memoPath);
  if (!settings.apiKey) return { ok: false, error: "ELEVENLABS_API_KEY not set" };

  const text = extractNarrationText(memoPath);
  if (!text) return { ok: false, error: "Could not read memo for narration" };

  try {
    const elevenlabs = new ElevenLabsClient({
      apiKey: settings.apiKey,
    });
    const audio = await elevenlabs.textToSpeech.convert(settings.voiceId, {
      text,
      modelId: settings.modelId,
      outputFormat: settings.outputFormat,
      voiceSettings: {
        stability: 0.5,
        similarityBoost: 0.75,
      },
    });
    const buffer = Buffer.from(await new Response(audio).arrayBuffer());
    const audioPath = path.join(outputDir, `${path.basename(memoPath, ".md")}-narration.mp3`);
    await fs.promises.writeFile(audioPath, buffer);
    return { ok: true, audioPath };
  } catch (err: any) {
    return { ok: false, error: err.message ?? "Unknown ElevenLabs error" };
  }
}

export async function playAudio(audioPath: string): Promise<{ ok: boolean; error?: string }> {
  return new Promise((resolve) => {
    const player = process.platform === "darwin" ? "afplay" : "mpv";
    execFile(player, [audioPath], (err) => {
      if (err) resolve({ ok: false, error: err.message });
      else resolve({ ok: true });
    });
  });
}

export interface PostMeetingContext {
  hasUI: boolean;
  confirm: (title: string, body: string) => Promise<boolean>;
  notify: (msg: string, type: "info" | "warning" | "error") => void;
}

export interface PostMeetingActionsDeps {
  isCursorAvailable: () => boolean;
  openInCursor: (filePath: string) => Promise<{ ok: boolean; error?: string }>;
  isElevenLabsConfigured: (startPath: string) => boolean;
  generateNarration: (
    memoPath: string,
    outputDir: string,
  ) => Promise<{ ok: boolean; audioPath?: string; error?: string }>;
  playAudio: (audioPath: string) => Promise<{ ok: boolean; error?: string }>;
}

const defaultPostMeetingDeps: PostMeetingActionsDeps = {
  isCursorAvailable,
  openInCursor,
  isElevenLabsConfigured,
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
      ctx.notify("Generating narration via ElevenLabs...", "info");
      const outputDir = path.dirname(info.memoPath);
      const result = await deps.generateNarration(info.memoPath, outputDir);

      if (result.ok && result.audioPath) {
        ctx.notify(`Narration saved: ${result.audioPath}`, "info");

        const play = await ctx.confirm(
          "Play narration?",
          `Play ${path.basename(result.audioPath)} now?`,
        );
        if (play) {
          const playResult = await deps.playAudio(result.audioPath);
          if (!playResult.ok) {
            ctx.notify(`Playback failed: ${playResult.error}`, "warning");
          }
        }
      } else {
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
