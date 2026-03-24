const MERMAID_FENCE = /```mermaid\s*\n([\s\S]*?)```/gi;
const SVG_FENCE = /```svg\s*\n([\s\S]*?)```/gi;
const RAW_SVG_BLOCK = /<svg\b[\s\S]*?<\/svg>/gi;

export interface ExtractedVisualBlock {
  format: "mermaid" | "svg";
  code: string;
}

export function extractMermaidBlocks(content: string): string[] {
  return extractFencedBlocks(content, MERMAID_FENCE);
}

export function extractSvgBlocks(content: string): string[] {
  const blocks = extractFencedBlocks(content, SVG_FENCE);
  const seen = new Set(blocks.map(normalizeVisualCode));

  let match: RegExpExecArray | null;
  while ((match = RAW_SVG_BLOCK.exec(content)) !== null) {
    const code = match[0].trim();
    const normalized = normalizeVisualCode(code);
    if (code && !seen.has(normalized)) {
      blocks.push(code);
      seen.add(normalized);
    }
  }
  RAW_SVG_BLOCK.lastIndex = 0;

  return blocks;
}

export function extractVisualBlocks(content: string): ExtractedVisualBlock[] {
  return [
    ...extractMermaidBlocks(content).map((code) => ({ format: "mermaid" as const, code })),
    ...extractSvgBlocks(content).map((code) => ({ format: "svg" as const, code })),
  ];
}

function extractFencedBlocks(content: string, pattern: RegExp): string[] {
  const blocks: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(content)) !== null) {
    const code = match[1].trim();
    if (code) blocks.push(code);
  }
  pattern.lastIndex = 0;
  return blocks;
}

function normalizeVisualCode(code: string): string {
  return code.replace(/\s+/g, " ").trim();
}
