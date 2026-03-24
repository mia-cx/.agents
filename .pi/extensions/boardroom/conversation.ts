import type { AgentConfig, ConversationEntry, ConversationLog, MeetingDisposition, MeetingMode } from "./types.js";

export function createConversationLog(
  meetingId: string,
  briefPath: string,
  mode: MeetingMode,
  constraints: string,
  roster: string[],
): ConversationLog {
  return {
    meeting_id: meetingId,
    brief: briefPath,
    mode,
    constraints,
    roster,
    started_at: new Date().toISOString(),
    ended_at: "",
    disposition: "completed",
    total_cost: 0,
    entries: [],
  };
}

export function addEntry(
  log: ConversationLog,
  id: string,
  from: string,
  to: string[],
  inResponseTo: string | null,
  phase: number,
  round: number,
  role: string,
  content: string,
  tokenCount: number,
  cost: number,
): ConversationEntry {
  const entry: ConversationEntry = {
    id,
    from,
    to,
    in_response_to: inResponseTo,
    phase,
    round,
    timestamp: new Date().toISOString(),
    role,
    content,
    token_count: tokenCount,
    cost,
  };
  log.entries.push(entry);
  log.total_cost += cost;
  return entry;
}

export function closeLog(log: ConversationLog, disposition: MeetingDisposition, abortReason?: string): void {
  log.ended_at = new Date().toISOString();
  log.disposition = disposition;
  if (abortReason?.trim()) {
    log.abort_reason = abortReason.trim();
    return;
  }
  delete log.abort_reason;
}

export function compressEntries(entries: ConversationEntry[]): string {
  if (entries.length === 0) return "";
  return entries
    .map((e) => {
      const preview = e.content.length > 300 ? e.content.slice(0, 300) + "..." : e.content;
      const addressing = e.to.length > 0 ? ` (addressing ${e.to.join(", ")})` : "";
      const replyNote = e.in_response_to ? ` [replying to ${e.in_response_to}]` : "";
      return `**${e.from}**${addressing}${replyNote} (${e.role}):\n${preview}`;
    })
    .join("\n\n---\n\n");
}

/**
 * Builds match patterns for an agent from its name, producing:
 * - The full name lowercased ("VP of Engineering" → "vp of engineering")
 * - Name without filler words ("vp engineering")
 * - Initialism for multi-word names with 2-4 words ("cto", "cfo", "cpo")
 * - Description keywords from the name itself ("contrarian", "moonshot")
 */
export function buildAgentAliases(agent: AgentConfig): string[] {
  const aliases: string[] = [];
  const name = agent.name.toLowerCase();
  aliases.push(name);

  const stripped = name.replace(/\b(of|the|and|for)\b/g, "").replace(/\s+/g, " ").trim();
  if (stripped !== name) aliases.push(stripped);

  const words = name.split(/\s+/);
  if (words.length >= 2 && words.length <= 4) {
    const initialism = words.map(w => w[0]).join("");
    if (initialism.length >= 2) aliases.push(initialism);
  }

  return aliases;
}

export function extractAddressees(
  content: string,
  rosterSlugs: string[],
  agents: AgentConfig[],
): string[] {
  const found = new Set<string>();
  const lower = content.toLowerCase();

  for (const slug of rosterSlugs) {
    const patterns: string[] = [
      slug,
      slug.replace(/-/g, " "),
    ];

    const agent = agents.find(a => a.slug === slug);
    if (agent) {
      patterns.push(...buildAgentAliases(agent));
    }

    for (const p of patterns) {
      if (lower.includes(p)) {
        found.add(slug);
        break;
      }
    }
  }

  return Array.from(found);
}
