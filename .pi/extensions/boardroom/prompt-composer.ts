import * as fs from "node:fs";
import * as path from "node:path";
import type { AgentConfig, ConversationEntry, ParsedBrief } from "./types.js";
import { composeScratchpadInstructions } from "./scratchpad.js";

function composeBoardroomArtifactDiscipline(
  agent: AgentConfig,
  brief: ParsedBrief,
  options?: { finalMemo?: boolean },
): string {
  const lines = [
    "--- BOARDROOM OUTPUT DISCIPLINE ---",
    "",
    `The source brief at "${brief.filePath}" is immutable input.`,
    "Never rewrite, patch, append to, or save over the source brief.",
    "Never use file mutation tools or mutating bash commands on anything under boardroom/briefs/.",
    `Your only allowed persistent working memory is your own scratch pad at boardroom/scratchpads/${agent.slug}.md, and it should normally be updated through the hidden scratch pad block in your response rather than by calling file mutation tools directly.`,
    options?.finalMemo
      ? "Return the full final memo in your assistant message. The boardroom runtime will save that message as the final memo artifact for you. Do not write the final memo to a file yourself."
      : "Return your deliverable in your assistant message. Do not write your assessment, report, or brief to a file yourself.",
    "Never open with preamble, meta-commentary, or narration about what you are about to do. Start directly with substantive content.",
    "",
    "--- END BOARDROOM OUTPUT DISCIPLINE ---",
  ];
  return lines.join("\n");
}

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
    "",
    composeBoardroomArtifactDiscipline(agent, brief),
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
    composeBoardroomArtifactDiscipline(agent, brief),
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
    composeBoardroomArtifactDiscipline(ceo, brief, { finalMemo: true }),
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
    "Do not call tools to save, patch, or rewrite the brief or memo files. Return the final memo as your assistant message only.",
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
