import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import type { DiscoveredAgent } from "./types.js";

interface Frontmatter {
  name?: string;
  description?: string;
  model?: string;
  tools?: string;
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function parseFrontmatter(content: string): { frontmatter: Frontmatter; body: string } {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

  const frontmatter: Frontmatter = {};
  for (const line of match[1].split("\n")) {
    const kv = line.match(/^(\w[\w_]*)\s*:\s*"?([^"]*)"?\s*$/);
    if (kv) {
      (frontmatter as Record<string, string>)[kv[1]] = kv[2].trim();
    }
  }

  return { frontmatter, body: match[2] };
}

function loadMarkdownAgents(
  dir: string,
  source: DiscoveredAgent["source"],
  category: string,
): DiscoveredAgent[] {
  if (!fs.existsSync(dir)) return [];
  const agents: DiscoveredAgent[] = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isFile() && !entry.isSymbolicLink()) continue;
    if (!entry.name.endsWith(".md")) continue;

    const filePath = path.join(dir, entry.name);
    const content = fs.readFileSync(filePath, "utf-8");
    const { frontmatter, body } = parseFrontmatter(content);
    if (!frontmatter.name || !frontmatter.description) continue;

    agents.push({
      name: frontmatter.name,
      slug: slugify(frontmatter.name),
      description: frontmatter.description,
      category,
      source,
      model: frontmatter.model,
      tools: frontmatter.tools?.split(",").map((item) => item.trim()).filter(Boolean),
      systemPrompt: body,
      filePath,
    });
  }

  return agents;
}

function loadBuiltInAgents(cwd: string): DiscoveredAgent[] {
  const root = path.join(cwd, "agents");
  if (!fs.existsSync(root)) return [];

  const agents: DiscoveredAgent[] = [];
  for (const categoryEntry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!categoryEntry.isDirectory()) continue;
    agents.push(...loadMarkdownAgents(path.join(root, categoryEntry.name), "built-in", categoryEntry.name));
  }
  return agents;
}

function loadProjectAgents(cwd: string): DiscoveredAgent[] {
  const dir = path.join(cwd, ".pi", "agents");
  return loadMarkdownAgents(dir, "project", "project");
}

function loadUserAgents(): DiscoveredAgent[] {
  const agentHome = process.env.PI_AGENT_DIR || path.join(os.homedir(), ".pi", "agent");
  return loadMarkdownAgents(path.join(agentHome, "agents"), "user", "user");
}

export function discoverTeamAgents(cwd: string): DiscoveredAgent[] {
  const merged = new Map<string, DiscoveredAgent>();

  for (const agent of loadBuiltInAgents(cwd)) merged.set(agent.name, agent);
  for (const agent of loadUserAgents()) merged.set(agent.name, agent);
  for (const agent of loadProjectAgents(cwd)) merged.set(agent.name, agent);

  return Array.from(merged.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function selectImplementationOrchestrator(agents: DiscoveredAgent[]): DiscoveredAgent | null {
  const preferred = [
    "Engineering Orchestrator",
    "engineering-orchestrator",
    "Developer",
  ];

  for (const needle of preferred) {
    const found = agents.find((agent) => agent.name === needle || agent.slug === needle);
    if (found) return found;
  }

  return agents[0] ?? null;
}

export function summarizeAgents(agents: DiscoveredAgent[], maxItems = 12): string {
  if (agents.length === 0) return "none";
  const listed = agents.slice(0, maxItems);
  const summary = listed.map((agent) => `${agent.name} [${agent.source}/${agent.category}]`).join(", ");
  if (agents.length <= maxItems) return summary;
  return `${summary}, +${agents.length - maxItems} more`;
}
