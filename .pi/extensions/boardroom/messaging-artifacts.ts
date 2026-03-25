/**
 * Artifact writers for the messaging model.
 *
 * Writes thread-aware debate logs (JSON + markdown) that preserve
 * thread identity, routing, and resolution as source-of-truth.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { getThreadStatusIcon } from "./messaging-types.js";
import type { MessagingLog, Thread, RoutedMessage } from "./messaging-types.js";

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function writeMessagingLog(
  cwd: string,
  log: MessagingLog,
): { jsonPath: string; mdPath: string } {
  const dir = path.join(cwd, "boardroom", "debates");
  ensureDir(dir);
  const slug = log.meeting_id;
  const jsonPath = path.join(dir, `${slug}.json`);
  const mdPath = path.join(dir, `${slug}.md`);

  fs.writeFileSync(jsonPath, JSON.stringify(log, null, 2), "utf-8");
  fs.writeFileSync(mdPath, renderMessagingLogAsMarkdown(log), "utf-8");
  return { jsonPath, mdPath };
}

function renderMessagingLogAsMarkdown(log: MessagingLog): string {
  const lines = [
    `# Board Meeting: ${log.meeting_id}`,
    "",
    `- **Mode**: ${log.mode}`,
    `- **Constraints**: ${log.constraints}`,
    `- **Roster**: ${log.roster.join(", ")}`,
    `- **Started**: ${log.started_at}`,
    `- **Ended**: ${log.ended_at}`,
    `- **Disposition**: ${log.disposition}`,
    `- **Total Cost**: $${log.total_cost.toFixed(2)}`,
    `- **Threads**: ${log.threads.length}`,
    `- **Messages**: ${log.messages.length}`,
    "",
    "---",
    "",
  ];

  // Render thread summaries
  lines.push("## Thread Overview", "");
  for (const thread of log.threads) {
    const statusIcon = getThreadStatusIcon(thread.status);
    lines.push(
      `### ${statusIcon} ${thread.title}`,
      `- **ID**: ${thread.id}${thread.parent_id ? ` (child of ${thread.parent_id})` : ""}`,
      `- **Status**: ${thread.status}${thread.resolution_reason ? ` (${thread.resolution_reason})` : ""}`,
      `- **Created by**: ${thread.created_by} at ${thread.created_at}`,
      `- **Participants**: ${thread.participants.join(", ")}`,
      `- **Messages**: ${thread.message_ids.length}`,
    );
    if (thread.summary) {
      lines.push(`- **Summary**: ${thread.summary}`);
    }
    lines.push("");
  }

  lines.push("---", "", "## Message Log", "");

  // Group messages by thread
  const threadMap = new Map<string, Thread>();
  for (const thread of log.threads) {
    threadMap.set(thread.id, thread);
  }

  // Render messages chronologically within threads
  const messagesByThread = new Map<string, RoutedMessage[]>();
  for (const msg of log.messages) {
    const existing = messagesByThread.get(msg.thread_id) ?? [];
    existing.push(msg);
    messagesByThread.set(msg.thread_id, existing);
  }

  for (const [threadId, messages] of messagesByThread) {
    const thread = threadMap.get(threadId);
    lines.push(`### Thread: ${thread?.title ?? threadId}`, "");

    for (const msg of messages) {
      const typeTag = `[${msg.type}]`;
      const recipients = msg.to.length > 0 ? ` → ${msg.to.join(", ")}` : " → all";
      const replyNote = msg.in_response_to ? ` (replying to ${msg.in_response_to})` : "";
      lines.push(
        `#### ${msg.from}${recipients} ${typeTag}${replyNote}`,
        `*${msg.timestamp} | ${msg.token_count} tokens | $${msg.cost.toFixed(4)} | ${msg.id}*`,
        "",
        msg.content,
        "",
        "---",
        "",
      );
    }
  }

  return lines.join("\n");
}
