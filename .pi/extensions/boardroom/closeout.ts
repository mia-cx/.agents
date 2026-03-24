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

export interface HumanReadableSummaryResult {
  ok: boolean;
  summaryPath?: string;
  summaryText?: string;
  error?: string;
}

export interface NarrationDisplayState {
  phase: "generating" | "playing";
  summaryText: string;
  summaryPath?: string;
  indicatorFrame: number;
  activeRange?: { start: number; end: number };
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
    : ["[generating ]", "[ generating]", "[  generating]", "[   generating]"];
  const frame = frames[state.indicatorFrame % frames.length] ?? frames[0];
  const muted = (text: string) => theme.fg("muted", text);
  const accent = (text: string) => theme.fg("accent", text);
  const success = (text: string) => theme.fg("success", text);

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
  return [
    muted("Narration"),
    `${accent(frame)} ${theme.bold(state.phase === "playing" ? "Playing ElevenLabs summary" : "Generating ElevenLabs audio")}`,
    ...(state.summaryPath ? [muted(state.summaryPath)] : []),
    "",
    ...wrapped,
  ];
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

  const decision = stripTrailingSentencePunctuation(
    normalizeNarrationText(firstSentences(stripMarkdownSyntax(extractSection(markdown, "Decision")), 2)),
  );
  const question = stripTrailingSentencePunctuation(
    normalizeNarrationText(trimToSentence(stripMarkdownSyntax(extractSection(markdown, "Strategic Question")))),
  );
  const evidencePoints = summarizeSection(
    extractSection(markdown, "Context & Evidence") || extractSection(markdown, "Context"),
    3,
  );
  const riskPoints = summarizeSection(extractSection(markdown, "Risk Assessment"), 2);
  const timingPoints = summarizeSection(extractSection(markdown, "Timing"), 2);
  const bottomLineParagraph = compactNarrationParagraph("Bottom line:", extractSection(markdown, "The bottom line"), 2);

  const segments = [
    `Boardroom summary for ${title}.`,
    decision ? `Decision: ${decision}.` : "",
    question ? `Question: ${question}.` : "",
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

function extractNarrationText(memoPath: string, maxChars = DEFAULT_NARRATION_MAX_CHARS): string {
  try {
    const content = fs.readFileSync(memoPath, "utf-8");
    return summarizeMemoForNarration(content, maxChars);
  } catch {
    return "";
  }
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
): Promise<HumanReadableSummaryResult> {
  const text = extractNarrationText(memoPath);
  if (!text) return { ok: false, error: "Could not read memo for human-readable summary" };

  const { summaryPath } = getNarrationArtifactPaths(memoPath, outputDir);
  try {
    await fs.promises.writeFile(summaryPath, `${text}\n`, "utf-8");
    return {
      ok: true,
      summaryPath,
      summaryText: text,
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
): Promise<NarrationResult> {
  const settings = getElevenLabsSettings(memoPath);
  if (!settings.apiKey) return { ok: false, error: "ELEVENLABS_API_KEY not set" };

  const summary = await generateHumanReadableSummary(memoPath, outputDir);
  if (!summary.ok || !summary.summaryText || !summary.summaryPath) {
    return { ok: false, error: summary.error ?? "Could not read memo for narration" };
  }
  const text = summary.summaryText;

  const { audioPath } = getNarrationArtifactPaths(memoPath, outputDir);
  const summaryPath = summary.summaryPath;

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
  setNarrationState?: (state: NarrationDisplayState | null) => void;
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
        result = await deps.generateNarration(info.memoPath, outputDir);
      } finally {
        clearInterval(generationTimer);
        ctx.setNarrationState?.(null);
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
            });
            indicatorFrame += 1;
          };

          updateNarration();
          const playbackTimer = setInterval(updateNarration, 200);
          const playResult = await deps.playAudio(result.audioPath);
          clearInterval(playbackTimer);
          ctx.setNarrationState?.(null);
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
