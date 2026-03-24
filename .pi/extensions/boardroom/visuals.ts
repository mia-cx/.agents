const MERMAID_FENCE = /```mermaid\s*\n([\s\S]*?)```/g;

export function extractMermaidBlocks(content: string): string[] {
  const blocks: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = MERMAID_FENCE.exec(content)) !== null) {
    const code = match[1].trim();
    if (code) blocks.push(code);
  }
  MERMAID_FENCE.lastIndex = 0;
  return blocks;
}
