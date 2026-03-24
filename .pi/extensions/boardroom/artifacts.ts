import * as fs from "node:fs";
import * as path from "node:path";
import type { ConversationLog } from "./types.js";
import type { ExtractedVisualBlock } from "./visuals.js";

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function timestampSlug(date: Date, briefSlug: string): string {
  const ts = date.toISOString().replace(/[:.]/g, "-").slice(0, 19);
  return `${ts}-${briefSlug}`;
}

export function writeMemo(cwd: string, briefSlug: string, content: string, date: Date): string {
  const dir = path.join(cwd, "boardroom", "memos");
  ensureDir(dir);
  const filename = `${timestampSlug(date, briefSlug)}.md`;
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, content, "utf-8");
  return filePath;
}

export function writeConversationLog(cwd: string, log: ConversationLog, date: Date): { jsonPath: string; mdPath: string } {
  const dir = path.join(cwd, "boardroom", "debates");
  ensureDir(dir);
  const slug = log.meeting_id;
  const jsonPath = path.join(dir, `${slug}.json`);
  const mdPath = path.join(dir, `${slug}.md`);

  fs.writeFileSync(jsonPath, JSON.stringify(log, null, 2), "utf-8");
  fs.writeFileSync(mdPath, renderLogAsMarkdown(log), "utf-8");
  return { jsonPath, mdPath };
}

function renderLogAsMarkdown(log: ConversationLog): string {
  const lines = [
    `# Board Meeting: ${log.meeting_id}`,
    "",
    `- **Mode**: ${log.mode}`,
    `- **Constraints**: ${log.constraints}`,
    `- **Roster**: ${log.roster.join(", ")}`,
    `- **Started**: ${log.started_at}`,
    `- **Ended**: ${log.ended_at}`,
    `- **Disposition**: ${log.disposition}`,
    ...(log.abort_reason ? [`- **Abort Reason**: ${log.abort_reason}`] : []),
    `- **Total Cost**: $${log.total_cost.toFixed(2)}`,
    "",
    "---",
    "",
  ];

  let currentPhase = -1;
  for (const entry of log.entries) {
    if (entry.phase !== currentPhase) {
      currentPhase = entry.phase;
      lines.push(`## Phase ${currentPhase}`, "");
    }
    const addressing = entry.to.length > 0 ? ` → ${entry.to.join(", ")}` : "";
    lines.push(
      `### ${entry.from}${addressing} (${entry.role})`,
      `*${entry.timestamp} | ${entry.token_count} tokens | $${entry.cost.toFixed(4)}*`,
      "",
      entry.content,
      "",
      "---",
      "",
    );
  }

  return lines.join("\n");
}

export function writeExpertise(cwd: string, agentSlug: string, meetingId: string, insights: string): void {
  const dir = path.join(cwd, "boardroom", "expertise");
  ensureDir(dir);
  const filePath = path.join(dir, `${agentSlug}.md`);

  const header = `\n\n## Meeting: ${meetingId} (${new Date().toISOString().slice(0, 10)})\n\n`;
  const entry = header + insights + "\n";

  fs.appendFileSync(filePath, entry, "utf-8");
}

export function writeVisuals(
  cwd: string,
  meetingId: string,
  diagrams: Array<ExtractedVisualBlock & { label: string }>,
): string[] {
  const dir = path.join(cwd, "boardroom", "visuals");
  ensureDir(dir);

  const paths: string[] = [];
  for (let i = 0; i < diagrams.length; i++) {
    const suffix = diagrams.length === 1 ? "" : `-${i + 1}`;
    const extension = diagrams[i].format === "svg" ? "svg" : "mmd";
    const filename = `${meetingId}-${diagrams[i].label}${suffix}.${extension}`;
    const filePath = path.join(dir, filename);
    fs.writeFileSync(filePath, diagrams[i].code + "\n", "utf-8");
    paths.push(filePath);
  }

  return paths;
}

export function listPastMeetings(cwd: string): ConversationLog[] {
  const dir = path.join(cwd, "boardroom", "debates");
  if (!fs.existsSync(dir)) return [];

  const logs: ConversationLog[] = [];
  try {
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort().reverse();
    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(dir, file), "utf-8");
        logs.push(JSON.parse(content));
      } catch {
        continue;
      }
    }
  } catch {}
  return logs;
}
