import * as fs from "node:fs";
import * as path from "node:path";

export function findBoardroomWorkspaceRoot(startPath: string): string | null {
  let current = startPath;
  try {
    if (!fs.statSync(current).isDirectory()) current = path.dirname(current);
  } catch {
    current = path.dirname(current);
  }

  while (true) {
    if (fs.existsSync(path.join(current, "boardroom"))) return current;
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

export function loadMetaPrompt(
  startPath: string,
  fileName: string,
  fallback: string,
  replacements: Record<string, string> = {},
): string {
  const workspaceRoot = findBoardroomWorkspaceRoot(startPath);
  let template = fallback;

  if (workspaceRoot) {
    const promptPath = path.join(workspaceRoot, "agents", "meta", fileName);
    try {
      const fileTemplate = fs.readFileSync(promptPath, "utf-8").trim();
      if (fileTemplate) template = fileTemplate;
    } catch {}
  }

  let resolved = template;
  for (const [key, value] of Object.entries(replacements)) {
    resolved = resolved.replaceAll(`{{${key}}}`, value);
  }
  return resolved;
}
