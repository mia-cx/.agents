import * as fs from "node:fs";
import * as path from "node:path";
import type { CycleRecord, ExecutionGraph } from "./types.js";

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getRuntimeRoot(cwd: string): string {
  return path.join(cwd, ".pi", "dev-cycles");
}

export function getCyclesDir(cwd: string): string {
  return path.join(getRuntimeRoot(cwd), "cycles");
}

export function getGraphsDir(cwd: string): string {
  return path.join(getRuntimeRoot(cwd), "graphs");
}

export function ensureRuntimeDirs(cwd: string): void {
  ensureDir(getCyclesDir(cwd));
  ensureDir(getGraphsDir(cwd));
}

export function ensureRuntimeGitignore(cwd: string): void {
  const gitignorePath = path.join(cwd, ".gitignore");
  const entry = ".pi/dev-cycles/";

  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, `${entry}\n`, "utf-8");
    return;
  }

  const current = fs.readFileSync(gitignorePath, "utf-8");
  if (!current.includes(entry)) {
    const next = current.endsWith("\n") ? `${current}${entry}\n` : `${current}\n${entry}\n`;
    fs.writeFileSync(gitignorePath, next, "utf-8");
  }
}

export function getCyclePath(cwd: string, slug: string): string {
  return path.join(getCyclesDir(cwd), `${slug}.json`);
}

export function writeCycle(cwd: string, cycle: CycleRecord): string {
  ensureRuntimeDirs(cwd);
  const filePath = getCyclePath(cwd, cycle.slug);
  fs.writeFileSync(filePath, JSON.stringify(cycle, null, 2), "utf-8");
  return filePath;
}

export function readCycle(cwd: string, slug: string): CycleRecord | null {
  const filePath = getCyclePath(cwd, slug);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as CycleRecord;
}

export function listCycles(cwd: string): CycleRecord[] {
  const dir = getCyclesDir(cwd);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => {
      const content = fs.readFileSync(path.join(dir, name), "utf-8");
      return JSON.parse(content) as CycleRecord;
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getGraphPath(cwd: string, slug: string): string {
  return path.join(getGraphsDir(cwd), `${slug}.json`);
}

export function writeGraph(cwd: string, slug: string, graph: ExecutionGraph): string {
  ensureRuntimeDirs(cwd);
  const filePath = getGraphPath(cwd, slug);
  fs.writeFileSync(filePath, JSON.stringify(graph, null, 2), "utf-8");
  return filePath;
}

export function readGraph(cwd: string, slug: string): ExecutionGraph | null {
  const filePath = getGraphPath(cwd, slug);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as ExecutionGraph;
}

export function writePlanFile(cwd: string, slug: string, markdown: string): string {
  const dir = path.join(cwd, "plans");
  ensureDir(dir);
  const filePath = path.join(dir, `${slug}.md`);
  fs.writeFileSync(filePath, markdown, "utf-8");
  return filePath;
}
