import { execFile } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import type { MeetingDisposition, MeetingMode } from "./types.js";
import type { DashboardTheme } from "./ui.js";

export interface CloseoutInfo {
  memoPath: string;
  debateJsonPath: string;
  debateMarkdownPath: string;
  visualPaths: string[];
  disposition: MeetingDisposition;
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
    const { execFileSync } = require("node:child_process");
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

export function isElevenLabsConfigured(): boolean {
  return !!process.env.ELEVENLABS_API_KEY;
}

function extractNarrationText(memoPath: string, maxChars = 3000): string {
  try {
    const content = fs.readFileSync(memoPath, "utf-8");
    if (content.length <= maxChars) return content;
    return content.slice(0, maxChars) + "\n\n[Narration truncated for length.]";
  } catch {
    return "";
  }
}

export async function generateNarration(
  memoPath: string,
  outputDir: string,
): Promise<{ ok: boolean; audioPath?: string; error?: string }> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return { ok: false, error: "ELEVENLABS_API_KEY not set" };

  const voiceId = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
  const modelId = process.env.ELEVENLABS_MODEL_ID || "eleven_monolingual_v1";

  const text = extractNarrationText(memoPath);
  if (!text) return { ok: false, error: "Could not read memo for narration" };

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    });

    if (!response.ok) {
      return { ok: false, error: `ElevenLabs API returned ${response.status}: ${response.statusText}` };
    }

    const buffer = Buffer.from(await response.arrayBuffer());
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

export async function runPostMeetingActions(
  info: CloseoutInfo,
  ctx: PostMeetingContext,
): Promise<void> {
  if (!ctx.hasUI) return;

  if (isCursorAvailable()) {
    const openCursor = await ctx.confirm(
      "Open memo in Cursor?",
      `Open ${path.basename(info.memoPath)} in Cursor IDE?`,
    );
    if (openCursor) {
      const result = await openInCursor(info.memoPath);
      if (result.ok) {
        ctx.notify("Opened memo in Cursor.", "info");
      } else {
        ctx.notify(`Failed to open in Cursor: ${result.error}`, "warning");
      }
    }
  } else {
    ctx.notify("Cursor CLI not found. Install from Cursor > Settings > Install CLI.", "info");
  }

  if (isElevenLabsConfigured()) {
    const generateAudio = await ctx.confirm(
      "Generate audio narration?",
      "Use ElevenLabs to generate a spoken summary of the board memo?",
    );
    if (generateAudio) {
      ctx.notify("Generating narration via ElevenLabs...", "info");
      const outputDir = path.dirname(info.memoPath);
      const result = await generateNarration(info.memoPath, outputDir);

      if (result.ok && result.audioPath) {
        ctx.notify(`Narration saved: ${result.audioPath}`, "info");

        const play = await ctx.confirm(
          "Play narration?",
          `Play ${path.basename(result.audioPath)} now?`,
        );
        if (play) {
          const playResult = await playAudio(result.audioPath);
          if (!playResult.ok) {
            ctx.notify(`Playback failed: ${playResult.error}`, "warning");
          }
        }
      } else {
        ctx.notify(`Narration failed: ${result.error}`, "warning");
      }
    }
  }
}
