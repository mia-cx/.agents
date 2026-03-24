import * as fs from "node:fs";
import * as path from "node:path";

const SCRATCHPAD_DIR = "boardroom/scratchpads";
const SCRATCHPAD_OPEN = "<!-- SCRATCHPAD -->";
const SCRATCHPAD_CLOSE = "<!-- /SCRATCHPAD -->";

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function loadScratchpad(cwd: string, agentSlug: string): string | null {
  const filePath = path.join(cwd, SCRATCHPAD_DIR, `${agentSlug}.md`);
  if (!fs.existsSync(filePath)) return null;
  try {
    const content = fs.readFileSync(filePath, "utf-8").trim();
    return content || null;
  } catch {
    return null;
  }
}

export function saveScratchpad(cwd: string, agentSlug: string, content: string): void {
  const dir = path.join(cwd, SCRATCHPAD_DIR);
  ensureDir(dir);
  const filePath = path.join(dir, `${agentSlug}.md`);
  fs.writeFileSync(filePath, content.trim() + "\n", "utf-8");
}

export function extractScratchpadUpdate(agentOutput: string): string | null {
  const openIdx = agentOutput.indexOf(SCRATCHPAD_OPEN);
  const closeIdx = agentOutput.indexOf(SCRATCHPAD_CLOSE);
  if (openIdx === -1 || closeIdx === -1 || closeIdx <= openIdx) return null;

  return agentOutput.slice(openIdx + SCRATCHPAD_OPEN.length, closeIdx).trim();
}

export function stripScratchpadBlock(agentOutput: string): string {
  const openIdx = agentOutput.indexOf(SCRATCHPAD_OPEN);
  const closeIdx = agentOutput.indexOf(SCRATCHPAD_CLOSE);
  if (openIdx === -1 || closeIdx === -1 || closeIdx <= openIdx) return agentOutput;

  return (
    agentOutput.slice(0, openIdx) +
    agentOutput.slice(closeIdx + SCRATCHPAD_CLOSE.length)
  ).trim();
}

export function composeScratchpadInstructions(existing: string | null): string {
  const parts = [
    "",
    "--- SCRATCH PAD ---",
    "",
    "You have a persistent scratch pad for tracking important context across rounds and meetings.",
    "Use it to record: key data points, your evolving position, open questions, things to follow up on, and reference numbers/facts you don't want to lose.",
    "",
  ];

  if (existing) {
    parts.push(
      "Your current scratch pad contents:",
      "",
      existing,
      "",
    );
  } else {
    parts.push("Your scratch pad is currently empty.", "");
  }

  parts.push(
    "To update your scratch pad, include this block anywhere in your response:",
    "",
    SCRATCHPAD_OPEN,
    "Your updated notes here...",
    SCRATCHPAD_CLOSE,
    "",
    "The scratch pad block will be stripped from the visible output. Only include it if you have notes worth preserving.",
    "",
    "--- END SCRATCH PAD ---",
  );

  return parts.join("\n");
}
