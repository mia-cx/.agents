import * as fs from "node:fs";
import * as path from "node:path";
import type { AgentConfig } from "./types.js";

interface Frontmatter {
  name?: string;
  description?: string;
  model?: string;
  model_alt?: string;
  tools?: string;
  tags?: string;
}

function parseFrontmatter(content: string): { frontmatter: Frontmatter; body: string } {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

  const fm: Frontmatter = {};
  for (const line of match[1].split("\n")) {
    const kv = line.match(/^(\w[\w_]*)\s*:\s*"?([^"]*)"?\s*$/);
    if (kv) {
      (fm as any)[kv[1]] = kv[2].trim();
    }
  }
  return { frontmatter: fm, body: match[2] };
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function discoverAgents(cwd: string): AgentConfig[] {
  const agentDir = path.join(cwd, "agents", "executive-board");
  if (!fs.existsSync(agentDir)) return [];

  const agents: AgentConfig[] = [];
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(agentDir, { withFileTypes: true });
  } catch {
    return [];
  }

  for (const entry of entries) {
    if (!entry.name.endsWith(".md")) continue;
    if (!entry.isFile() && !entry.isSymbolicLink()) continue;
    if (entry.name === "orchestrator.md") continue;

    const filePath = path.join(agentDir, entry.name);
    let content: string;
    try {
      content = fs.readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    const { frontmatter, body } = parseFrontmatter(content);
    if (!frontmatter.name || !frontmatter.description) continue;

    const slug = slugify(frontmatter.name);
    if (!slug || /[/\\]|\.\./.test(slug)) continue;

    agents.push({
      name: frontmatter.name,
      slug,
      description: frontmatter.description,
      model: frontmatter.model,
      modelAlt: frontmatter.model_alt,
      tools: frontmatter.tools?.split(",").map((t) => t.trim()).filter(Boolean),
      tags: frontmatter.tags?.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean) ?? [],
      systemPrompt: body,
      filePath,
    });
  }

  return agents;
}

export function findAgent(agents: AgentConfig[], nameOrSlug: string): AgentConfig | undefined {
  const lower = nameOrSlug.toLowerCase();
  return agents.find(
    (a) => a.slug === lower || a.name.toLowerCase() === lower,
  );
}

export function findAgentsByTag(agents: AgentConfig[], tag: string): AgentConfig[] {
  const lower = tag.toLowerCase();
  return agents.filter((a) => a.tags.includes(lower));
}
