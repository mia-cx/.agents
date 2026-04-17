import type { CycleRecord, ExecutionGraph, ExecutionNodeStatus } from "./types.js";

export interface WidgetTheme {
  fg: (color: string, text: string) => string;
  bold: (text: string) => string;
}

const STATUS_ICON: Record<ExecutionNodeStatus, string> = {
  queued: "○",
  running: "▶",
  completed: "✓",
  failed: "✗",
  aborted: "⊘",
};

const STATUS_COLOR: Record<ExecutionNodeStatus, string> = {
  queued: "muted",
  running: "accent",
  completed: "success",
  failed: "error",
  aborted: "warning",
};

export function buildStatusLine(cycle: CycleRecord): string {
  const approvals = [
    cycle.approvals.prd ? "prd" : "",
    cycle.approvals.issues ? "issues" : "",
    cycle.approvals.plan ? "plan" : "",
  ].filter(Boolean);

  const approvalText = approvals.length > 0 ? ` | approved: ${approvals.join(", ")}` : "";
  return `${cycle.slug} | ${cycle.classification.route} | ${cycle.currentStage}${approvalText}`;
}

export function buildPlainStatusLines(cycle: CycleRecord, graph: ExecutionGraph | null): string[] {
  const lines = [
    `Cycle: ${cycle.title} (${cycle.slug})`,
    `Route: ${cycle.classification.route}`,
    `Current stage: ${cycle.currentStage}`,
    `Approvals: prd=${cycle.approvals.prd} issues=${cycle.approvals.issues} plan=${cycle.approvals.plan}`,
  ];

  if (cycle.artifacts.worktreePath) lines.push(`Worktree: ${cycle.artifacts.worktreePath}`);
  if (cycle.artifacts.branchName) lines.push(`Branch: ${cycle.artifacts.branchName}`);

  if (graph) {
    lines.push("");
    lines.push("Execution tree:");
    lines.push(...renderExecutionTree(graph));
  }

  return lines;
}

export function buildWidgetLines(cycle: CycleRecord, graph: ExecutionGraph | null, theme: WidgetTheme): string[] {
  const lines: string[] = [];
  lines.push(theme.bold(theme.fg("accent", "DEV CYCLE")));
  lines.push(theme.fg("muted", cycle.title));
  lines.push(theme.fg("dim", `${cycle.slug} · ${cycle.currentStage} · ${cycle.classification.route}`));
  lines.push("");
  lines.push(
    theme.fg(
      "muted",
      `Approvals: prd=${cycle.approvals.prd} issues=${cycle.approvals.issues} plan=${cycle.approvals.plan}`,
    ),
  );

  if (cycle.artifacts.worktreePath) {
    lines.push(theme.fg("muted", `Worktree: ${cycle.artifacts.worktreePath}`));
  }

  if (graph) {
    lines.push("");
    lines.push(theme.bold(theme.fg("muted", "Execution tree")));
    lines.push(...renderExecutionTree(graph, theme));
  }

  return lines;
}

export function renderExecutionTree(graph: ExecutionGraph, theme?: WidgetTheme): string[] {
  return renderNode(graph, graph.rootId, 0, theme);
}

function renderNode(graph: ExecutionGraph, nodeId: string, depth: number, theme?: WidgetTheme): string[] {
  const node = graph.nodes[nodeId];
  if (!node) return [];

  const prefix = `${"  ".repeat(depth)}${STATUS_ICON[node.status]} `;
  const label = theme
    ? theme.fg(STATUS_COLOR[node.status], `${prefix}${node.label}`)
    : `${prefix}${node.label}`;
  const detail = node.detail ? `${"  ".repeat(depth + 1)}${node.detail.split("\n")[0]}` : null;
  const lines = [label];
  if (detail) lines.push(theme ? theme.fg("dim", detail) : detail);

  for (const childId of node.children) {
    lines.push(...renderNode(graph, childId, depth + 1, theme));
  }

  return lines;
}
