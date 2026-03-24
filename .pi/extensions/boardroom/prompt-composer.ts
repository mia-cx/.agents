import * as fs from "node:fs";
import * as path from "node:path";
import type { AgentConfig, ConversationEntry, ParsedBrief } from "./types.js";
import { composeScratchpadInstructions } from "./scratchpad.js";

export function composeFramingPrompt(agent: AgentConfig, brief: ParsedBrief, scratchpad: string | null = null): string {
  const parts = [
    agent.systemPrompt,
    "",
    "--- BOARD MEETING CONTEXT ---",
    "",
    `## Brief: ${brief.title}`,
    "",
    brief.content,
    "",
    "--- END BRIEF ---",
  ];

  if (scratchpad !== undefined) {
    parts.push(composeScratchpadInstructions(scratchpad));
  }

  return parts.join("\n");
}

export function composeAssessmentPrompt(
  agent: AgentConfig,
  brief: ParsedBrief,
  ceoFraming: string,
  priorEntries: ConversationEntry[],
  expertise: string | null,
  scratchpad: string | null = null,
): string {
  const parts = [
    agent.systemPrompt,
    "",
    "--- BOARD MEETING CONTEXT ---",
    "",
    `## Brief: ${brief.title}`,
    "",
    brief.content,
    "",
    "## CEO's Framing",
    "",
    ceoFraming,
  ];

  if (priorEntries.length > 0) {
    parts.push("", "## Prior Board Assessments", "");
    for (const entry of priorEntries) {
      parts.push(`### ${entry.from} (${entry.role})`, "", entry.content, "");
    }
  }

  if (expertise) {
    parts.push("", "## Your Accumulated Expertise (from prior meetings)", "", expertise);
  }

  parts.push(composeScratchpadInstructions(scratchpad));

  parts.push(
    "",
    "--- INSTRUCTIONS ---",
    "",
    "When responding to or challenging a specific board member's position, name them explicitly (e.g., \"I disagree with the CTO's assessment because...\").",
    "This helps the CEO and other board members follow the debate.",
    "",
    "--- END CONTEXT ---",
  );

  return parts.join("\n");
}

export function composeSynthesisPrompt(
  ceo: AgentConfig,
  brief: ParsedBrief,
  ceoFraming: string,
  assessments: ConversationEntry[],
  expertise: string | null,
  scratchpad: string | null = null,
): string {
  const parts = [
    ceo.systemPrompt,
    "",
    "--- BOARD MEETING CONTEXT ---",
    "",
    `## Brief: ${brief.title}`,
    "",
    brief.content,
    "",
    "## Your Earlier Framing",
    "",
    ceoFraming,
    "",
    "## Board Member Assessments",
    "",
  ];

  for (const entry of assessments) {
    parts.push(`### ${entry.from} (${entry.role})`, "", entry.content, "");
  }

  if (expertise) {
    parts.push("## Your Accumulated Expertise (from prior meetings)", "", expertise, "");
  }

  parts.push(composeScratchpadInstructions(scratchpad));

  parts.push(
    "--- INSTRUCTIONS ---",
    "",
    "Synthesize all board input into your final Strategic Brief.",
    "Address key tensions and disagreements between board members explicitly.",
    "Produce your output in Strategic Brief format as defined in your system prompt.",
    "",
    "--- END CONTEXT ---",
  );

  return parts.join("\n");
}

const MAX_EXPERTISE_MEETINGS = 3;

export function loadExpertise(cwd: string, agentSlug: string): string | null {
  const expertisePath = path.join(cwd, "boardroom", "expertise", `${agentSlug}.md`);
  if (!fs.existsSync(expertisePath)) return null;
  try {
    const content = fs.readFileSync(expertisePath, "utf-8").trim();
    if (!content) return null;

    const meetings = content.split(/\n## Meeting: /).filter(Boolean);
    if (meetings.length <= MAX_EXPERTISE_MEETINGS) return content;

    const recent = meetings.slice(-MAX_EXPERTISE_MEETINGS);
    return recent.map((m, i) => (i === 0 && !m.startsWith("## Meeting:") ? m : `## Meeting: ${m}`)).join("\n");
  } catch {
    return null;
  }
}
