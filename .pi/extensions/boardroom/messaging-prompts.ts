/**
 * Prompt composition for the explicit messaging model.
 *
 * Each agent sees: their relevant threads + inbox + CEO room summary.
 * Messages include explicit routing metadata in the prompt context.
 */

import type { AgentConfig, ParsedBrief } from "./types.js";
import { getThreadStatusIcon } from "./messaging-types.js";
import type { AgentContextProjection, RoutedMessage, Thread } from "./messaging-types.js";
import { composeScratchpadInstructions } from "./scratchpad.js";

// --- Messaging-Aware Framing ---

export function composeMessagingFramingPrompt(
  ceo: AgentConfig,
  brief: ParsedBrief,
  scratchpad: string | null = null,
): string {
  const parts = [
    ceo.systemPrompt,
    "",
    "--- BOARD MEETING CONTEXT (Messaging Model) ---",
    "",
    `## Brief: ${brief.title}`,
    "",
    brief.content,
    "",
    "--- MESSAGING PROTOCOL ---",
    "",
    "This meeting uses explicit routed messaging. As CEO you will:",
    "1. Frame the decision and create initial workstream threads.",
    "2. Select which board members to consult.",
    "3. Each workstream should focus on a distinct aspect of the decision.",
    "",
    "For each workstream, output a structured block:",
    "```json",
    '{ "workstreams": [{ "title": "<workstream name>", "description": "<what to discuss>" }],',
    '  "roster": [{ "name": "<agent-slug>", "reason": "<why needed>" }],',
    '  "rationale": "<overall reasoning>" }',
    "```",
    "",
    "Message types available: broadcast (all), direct (specific agents), ceo-only (private to you), request-reply (expects response).",
    "",
    "--- END PROTOCOL ---",
  ];

  parts.push(composeScratchpadInstructions(scratchpad));

  return parts.join("\n");
}

// --- Messaging-Aware Assessment ---

export function composeMessagingAssessmentPrompt(
  agent: AgentConfig,
  brief: ParsedBrief,
  ceoFraming: string,
  context: AgentContextProjection,
  expertise: string | null,
  scratchpad: string | null = null,
): string {
  const parts = [
    agent.systemPrompt,
    "",
    "--- BOARD MEETING CONTEXT (Messaging Model) ---",
    "",
    `## Brief: ${brief.title}`,
    "",
    brief.content,
    "",
    "## CEO's Framing",
    "",
    ceoFraming,
  ];

  // Active threads for this agent
  if (context.active_threads.length > 0) {
    parts.push("", "## Your Active Threads", "");
    for (const thread of context.active_threads) {
      parts.push(`### Thread: ${thread.title} [${thread.id}]`);
      parts.push(`Status: ${thread.status} | Participants: ${thread.participants.join(", ")}`);
      parts.push("");
    }
  }

  // Relevant messages (in threads the agent participates in)
  if (context.relevant_messages.length > 0) {
    parts.push("", "## Thread Messages (your threads)", "");
    for (const msg of context.relevant_messages) {
      const typeTag = `[${msg.type}]`;
      const recipients = msg.to.length > 0 ? ` → ${msg.to.join(", ")}` : " → all";
      parts.push(
        `**${msg.from}${recipients}** ${typeTag} (${msg.id}):`,
        msg.content.length > 500 ? msg.content.slice(0, 500) + "..." : msg.content,
        "",
      );
    }
  }

  // Inbox (unread messages directed to this agent)
  if (context.inbox.length > 0) {
    parts.push("", "## Your Inbox (unread)", "");
    for (const msg of context.inbox) {
      parts.push(
        `**From ${msg.from}** [${msg.type}] (${msg.id}):`,
        msg.content.length > 300 ? msg.content.slice(0, 300) + "..." : msg.content,
        "",
      );
    }
  }

  // CEO summary of the rest of the room
  if (context.room_summary) {
    parts.push("", context.room_summary);
  }

  if (expertise) {
    parts.push("", "## Your Accumulated Expertise (from prior meetings)", "", expertise);
  }

  parts.push(composeScratchpadInstructions(scratchpad));

  parts.push(
    "",
    "--- MESSAGING INSTRUCTIONS ---",
    "",
    "You are participating in an explicit messaging model. Your output will be routed as messages.",
    "",
    "To address specific board members, use this format at the start of your response:",
    '  TO: <agent-slug>, <agent-slug>',
    '  REPLY-TO: <message-id>',
    '  TYPE: broadcast | direct | ceo-only | request-reply | reply',
    '  NEW-THREAD: <thread title>',
    "",
    "If you omit routing headers, your message defaults to broadcast in your current thread.",
    "",
    "When responding to or challenging a specific board member's position, name them explicitly.",
    "When you need information from another board member, use TYPE: request-reply.",
    "When you have private concerns for the CEO only, use TYPE: ceo-only.",
    "When a sub-topic deserves focused discussion, use NEW-THREAD to create a child thread.",
    "",
    "--- END CONTEXT ---",
  );

  return parts.join("\n");
}

// --- Messaging-Aware Synthesis ---

export function composeMessagingSynthesisPrompt(
  ceo: AgentConfig,
  brief: ParsedBrief,
  ceoFraming: string,
  threads: Thread[],
  messages: RoutedMessage[],
  expertise: string | null,
  scratchpad: string | null = null,
): string {
  const parts = [
    ceo.systemPrompt,
    "",
    "--- BOARD MEETING SYNTHESIS CONTEXT ---",
    "",
    `## Brief: ${brief.title}`,
    "",
    brief.content,
    "",
    "## Your Earlier Framing",
    "",
    ceoFraming,
    "",
    "## Thread Summary",
    "",
  ];

  for (const thread of threads) {
    const statusIcon = getThreadStatusIcon(thread.status);
    const parentNote = thread.parent_id ? ` (child of ${thread.parent_id})` : "";
    parts.push(`### ${statusIcon} ${thread.title} [${thread.id}]${parentNote}`);
    parts.push(`Status: ${thread.status}${thread.resolution_reason ? ` (${thread.resolution_reason})` : ""} | Participants: ${thread.participants.join(", ")}`);
    if (thread.summary) parts.push(`Summary: ${thread.summary}`);
    parts.push("");

    const threadMsgs = messages.filter(m => m.thread_id === thread.id);
    for (const msg of threadMsgs) {
      const typeTag = `[${msg.type}]`;
      const recipients = msg.to.length > 0 ? ` → ${msg.to.join(", ")}` : " → all";
      parts.push(
        `**${msg.from}${recipients}** ${typeTag}:`,
        msg.content.length > 500 ? msg.content.slice(0, 500) + "..." : msg.content,
        "",
      );
    }
    parts.push("---", "");
  }

  if (expertise) {
    parts.push("## Your Accumulated Expertise (from prior meetings)", "", expertise, "");
  }

  parts.push(composeScratchpadInstructions(scratchpad));

  parts.push(
    "",
    "--- INSTRUCTIONS ---",
    "",
    "Synthesize all thread discussions into your final Strategic Brief.",
    "Reference specific threads and their resolution status.",
    "Address key tensions and disagreements between board members explicitly.",
    "Note which threads resolved naturally and which remain contentious.",
    "",
    "If the decision involves data worth visualizing, include Mermaid diagrams.",
    "",
    "--- END CONTEXT ---",
  );

  return parts.join("\n");
}

// --- Parse Routing Headers from Agent Output ---

export interface ParsedRoutingHeaders {
  to: string[];
  replyTo: string | null;
  type: string;
  content: string;   // content with headers stripped
  newThread: string | null;  // title for child thread creation
}

export function parseRoutingHeaders(output: string): ParsedRoutingHeaders {
  const lines = output.split("\n");
  const result: ParsedRoutingHeaders = {
    to: [],
    replyTo: null,
    type: "broadcast",
    content: output,
    newThread: null,
  };

  let headerEnd = 0;
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i].trim();
    const toMatch = line.match(/^TO:\s*(.+)/i);
    if (toMatch) {
      result.to = toMatch[1].split(",").map(s => s.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")).filter(Boolean);
      headerEnd = i + 1;
      continue;
    }
    const replyMatch = line.match(/^REPLY-TO:\s*(.+)/i);
    if (replyMatch) {
      result.replyTo = replyMatch[1].trim();
      headerEnd = i + 1;
      continue;
    }
    const typeMatch = line.match(/^TYPE:\s*(.+)/i);
    if (typeMatch) {
      const t = typeMatch[1].trim().toLowerCase();
      if (["broadcast", "direct", "ceo-only", "request-reply", "reply"].includes(t)) {
        result.type = t;
      }
      headerEnd = i + 1;
      continue;
    }
    const threadMatch = line.match(/^NEW-THREAD:\s*(.+)/i);
    if (threadMatch) {
      result.newThread = threadMatch[1].trim();
      headerEnd = i + 1;
      continue;
    }
    // Stop scanning if we hit a non-header line
    if (line && !toMatch && !replyMatch && !typeMatch && !threadMatch) break;
  }

  if (headerEnd > 0) {
    result.content = lines.slice(headerEnd).join("\n").trim();
  }

  // Infer type from headers if not explicit
  if (result.type === "broadcast" && result.to.length > 0) {
    result.type = "direct";
  }
  if (result.type === "broadcast" && result.replyTo) {
    result.type = "reply";
  }

  return result;
}

// --- Parse Workstream Definitions from CEO Output ---

export interface ParsedWorkstreams {
  workstreams: { title: string; description: string }[];
  roster: { name: string; reason: string }[];
  rationale: string;
}

export function parseWorkstreamsFromCeoOutput(content: string): ParsedWorkstreams | null {
  const jsonMatch = content.match(/```(?:json)?\s*\n([\s\S]*?)\n```/);
  if (!jsonMatch) return null;

  try {
    const parsed = JSON.parse(jsonMatch[1]);

    const workstreams = (parsed.workstreams ?? []).map((w: any) => ({
      title: w.title || "Untitled workstream",
      description: w.description || "",
    }));

    const roster = (parsed.roster ?? []).map((r: any) => ({
      name: typeof r === "string" ? r : r.name || r.agent || "",
      reason: typeof r === "string" ? "" : r.reason || "",
    })).filter((r: any) => r.name);

    const rationale = typeof parsed.rationale === "string" ? parsed.rationale : "No rationale provided";

    return { workstreams, roster, rationale };
  } catch {
    return null;
  }
}
