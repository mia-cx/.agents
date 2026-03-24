import * as fs from "node:fs";
import * as path from "node:path";
import type { MeetingMode, ParsedBrief } from "./types.js";

const RECOMMENDED_SECTIONS = [
  "Context",
  "Decision Required",
  "Constraints",
  "Success Criteria",
];

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

interface BriefFrontmatter {
  title?: string;
  constraints?: string;
  mode?: string;
  messaging_mode?: string;
  budget?: number;
  time_limit_minutes?: number;
  max_debate_rounds?: number;
}

function parseBriefFrontmatter(content: string): { frontmatter: BriefFrontmatter; body: string } {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

  const fm: BriefFrontmatter = {};
  for (const line of match[1].split("\n")) {
    if (line.trim().startsWith("#")) continue;
    const kv = line.match(/^(\w[\w_]*)\s*:\s*"?([^"]*)"?\s*$/);
    if (!kv) continue;
    const key = kv[1];
    const val = kv[2].trim();
    if (key === "title") fm.title = val;
    else if (key === "constraints") fm.constraints = val;
    else if (key === "mode") fm.mode = val;
    else if (key === "messaging_mode") fm.messaging_mode = val;
    else if (key === "budget") fm.budget = Number(val);
    else if (key === "time_limit_minutes") fm.time_limit_minutes = Number(val);
    else if (key === "max_debate_rounds") fm.max_debate_rounds = Number(val);
  }
  return { frontmatter: fm, body: match[2] };
}

export function parseBrief(filePath: string): ParsedBrief {
  const content = fs.readFileSync(filePath, "utf-8");
  const { frontmatter, body } = parseBriefFrontmatter(content);

  const warnings: string[] = [];
  for (const section of RECOMMENDED_SECTIONS) {
    const pattern = new RegExp(`^##\\s+${section}`, "mi");
    if (!pattern.test(body)) {
      warnings.push(`Missing recommended section: "${section}"`);
    }
  }

  const title = frontmatter.title || path.basename(filePath, ".md").replace(/-/g, " ");

  return {
    title,
    slug: slugify(title),
    content: body.trim(),
    filePath,
    constraints: frontmatter.constraints,
    mode: frontmatter.mode === "structured" ? "structured" : frontmatter.mode === "freeform" ? "freeform" : undefined,
    messagingMode: frontmatter.messaging_mode === "threading"
      ? "threading"
      : frontmatter.messaging_mode === "fanout"
        ? "fanout"
        : undefined,
    budgetOverride: frontmatter.budget && !isNaN(frontmatter.budget) ? frontmatter.budget : undefined,
    timeLimitOverride: frontmatter.time_limit_minutes && !isNaN(frontmatter.time_limit_minutes) ? frontmatter.time_limit_minutes : undefined,
    maxRoundsOverride: frontmatter.max_debate_rounds && !isNaN(frontmatter.max_debate_rounds) ? frontmatter.max_debate_rounds : undefined,
    warnings,
  };
}

export function listBriefs(cwd: string): string[] {
  const briefsDir = path.join(cwd, "boardroom", "briefs");
  if (!fs.existsSync(briefsDir)) return [];
  try {
    return fs.readdirSync(briefsDir)
      .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
      .map((f) => path.join(briefsDir, f));
  } catch {
    return [];
  }
}
