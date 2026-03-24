import type { AgentRuntimeStatus, AgentRuntimeUpdate, MeetingProgressSnapshot } from "./types.js";

export interface DashboardTheme {
  fg: (color: string, text: string) => string;
  bold: (text: string) => string;
}

const STATUS_ICONS: Record<AgentRuntimeStatus, string> = {
  idle: "·",
  queued: "○",
  running: "▶",
  thinking: "◌",
  tooling: "⚙",
  delegating: "⇢",
  streaming: "◉",
  completed: "✓",
  failed: "✗",
  aborted: "⊘",
};

const STATUS_COLORS: Record<AgentRuntimeStatus, string> = {
  idle: "dim",
  queued: "muted",
  running: "accent",
  thinking: "accent",
  tooling: "warning",
  delegating: "warning",
  streaming: "accent",
  completed: "success",
  failed: "error",
  aborted: "warning",
};

function progressBar(pct: number, width = 20): string {
  const clamped = Math.max(0, Math.min(100, pct));
  const filled = Math.round((clamped / 100) * width);
  const empty = width - filled;
  return "█".repeat(filled) + "░".repeat(empty);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function wrapText(text: string, width: number): string[] {
  if (width <= 0) return [text];
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  const words = normalized.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if (!current) {
      current = word;
      continue;
    }

    if (`${current} ${word}`.length <= width) {
      current += ` ${word}`;
      continue;
    }

    lines.push(current);
    current = word;
  }

  if (current) lines.push(current);
  return lines;
}

function truncateText(text: string, width: number): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (width <= 0) return "";
  if (normalized.length <= width) return normalized;
  if (width <= 3) return ".".repeat(width);
  return `${normalized.slice(0, width - 3).trimEnd()}...`;
}

function formatTokenCount(totalTokens: number): string {
  if (totalTokens >= 1_000_000) return `${(totalTokens / 1_000_000).toFixed(1)}M tok`;
  if (totalTokens >= 10_000) return `${Math.round(totalTokens / 1_000)}k tok`;
  if (totalTokens >= 1_000) return `${(totalTokens / 1_000).toFixed(1)}k tok`;
  return `${totalTokens} tok`;
}

function formatAgentIdentity(
  agent: AgentRuntimeUpdate,
  viewportWidth: number,
  theme: DashboardTheme,
): { plain: string; styled: string } {
  const name = truncateText(agent.name, clamp(Math.floor(viewportWidth * 0.18), 10, 22));
  const model = agent.modelLabel ?? "default";
  const maxIdentityWidth = clamp(Math.floor(viewportWidth * 0.42), 26, 56);
  const reserved = name.length + 3; // space + brackets
  const availableModelWidth = Math.max(8, maxIdentityWidth - reserved);
  const truncatedModel = truncateText(model, availableModelWidth);
  const plain = `${name} [${truncatedModel}]`;
  return {
    plain,
    styled: `${name} ${theme.fg("dim", `[${truncatedModel}]`)}`,
  };
}

function shouldShowAgentDetail(agent: AgentRuntimeUpdate, detailText: string): boolean {
  if (!detailText) return false;
  if (agent.status === "streaming") return true;
  if (agent.status === "running" || agent.status === "queued" || agent.status === "failed" || agent.status === "aborted") {
    return true;
  }
  return false;
}

function getStreamingPreviewLines(agent: AgentRuntimeUpdate, width: number): string[] {
  const text = agent.partialText?.replace(/\s+/g, " ").trim() ?? "";
  if (!text) return [];
  const wrapped = wrapText(text, Math.max(8, width));
  const maxLines = agent.slug === "ceo" ? 5 : 1;
  return wrapped.slice(-maxLines);
}

function getBarWidth(viewportWidth: number): number {
  return clamp(Math.floor((viewportWidth - 36) * 0.55), 12, 48);
}

function getRuleWidth(viewportWidth: number): number {
  return clamp(viewportWidth - 4, 36, 120);
}

export function formatDashboardStatus(
  snapshot: MeetingProgressSnapshot,
  theme: DashboardTheme,
): string {
  const phase = theme.fg("accent", snapshot.phaseLabel);
  const budget = `$${snapshot.budgetUsed.toFixed(2)}/$${snapshot.budgetLimit}`;
  const time = `${snapshot.elapsedMinutes.toFixed(1)}/${snapshot.timeLimitMinutes}min`;
  const rounds = `${snapshot.roundsUsed}/${snapshot.maxRounds}`;
  return `${theme.fg("muted", "🏛")} ${phase} ${theme.fg("dim", "|")} ${budget} ${theme.fg("dim", "|")} ${time} ${theme.fg("dim", "|")} ${rounds} rds`;
}

export function buildDashboardWidgetLines(
  snapshot: MeetingProgressSnapshot,
  theme: DashboardTheme,
  viewportWidth = 80,
): string[] {
  const lines: string[] = [];
  const dim = (t: string) => theme.fg("dim", t);
  const accent = (t: string) => theme.fg("accent", t);
  const muted = (t: string) => theme.fg("muted", t);

  const ruleWidth = getRuleWidth(viewportWidth);
  const barWidth = getBarWidth(viewportWidth);
  const transcriptWidth = clamp(viewportWidth - 10, 36, 120);
  const ceoWidth = clamp(viewportWidth - 14, 28, 108);
  const rule = dim("─".repeat(ruleWidth));
  lines.push(rule);
  lines.push(
    `  ${theme.bold(accent("BOARDROOM"))} ${dim("·")} ${theme.fg("muted", truncateText(snapshot.briefTitle, ruleWidth - 18))}`,
  );
  lines.push(rule);
  lines.push("");

  lines.push(`  ${muted("Phase:")} ${accent(snapshot.phaseLabel)} ${dim("|")} ${muted("Rounds:")} ${snapshot.roundsUsed}/${snapshot.maxRounds}`);
  for (const line of wrapText(snapshot.presidentNote, ceoWidth)) {
    lines.push(`  ${muted("CEO:")} ${line}`);
  }
  lines.push("");

  const budgetPct = snapshot.budgetLimit > 0 ? (snapshot.budgetUsed / snapshot.budgetLimit) * 100 : 0;
  const timePct = snapshot.timeLimitMinutes > 0 ? (snapshot.elapsedMinutes / snapshot.timeLimitMinutes) * 100 : 0;

  const budgetColor = budgetPct >= 100 ? "error" : budgetPct >= 80 ? "warning" : "accent";
  const timeColor = timePct >= 100 ? "error" : timePct >= 80 ? "warning" : "accent";

  lines.push(
    `  ${muted("Budget:")} ${theme.fg(budgetColor, `[${progressBar(budgetPct, barWidth)}]`)} ${theme.fg(budgetColor, `${budgetPct.toFixed(0)}%`)} $${snapshot.budgetUsed.toFixed(2)}/$${snapshot.budgetLimit}`,
  );
  lines.push(
    `  ${muted("Time:")}   ${theme.fg(timeColor, `[${progressBar(timePct, barWidth)}]`)} ${theme.fg(timeColor, `${timePct.toFixed(0)}%`)} ${snapshot.elapsedMinutes.toFixed(1)}/${snapshot.timeLimitMinutes}min`,
  );
  lines.push("");

  if (snapshot.agents.length > 0) {
    lines.push(`  ${theme.bold(muted("Board Members:"))}`);
    for (const agent of snapshot.agents) {
      lines.push(...formatAgentLines(agent, theme, viewportWidth));
    }
    lines.push("");
  }

  if (snapshot.transcript.length > 0) {
    lines.push(`  ${theme.bold(muted("Recent:"))}`);
    for (const entry of snapshot.transcript.slice(-3)) {
      const preview = truncateText(entry, transcriptWidth);
      lines.push(`    ${dim(preview)}`);
    }
  }

  return lines;
}

function formatAgentLines(
  agent: AgentRuntimeUpdate,
  theme: DashboardTheme,
  viewportWidth: number,
): string[] {
  const icon = STATUS_ICONS[agent.status];
  const color = STATUS_COLORS[agent.status];
  const identityWidth = clamp(Math.floor(viewportWidth * 0.42), 26, 56);
  const detailWidth = clamp(viewportWidth - 12, 26, 108);
  const identity = formatAgentIdentity(agent, viewportWidth, theme);
  const identityPadding = " ".repeat(Math.max(0, identityWidth - identity.plain.length));
  const status = agent.status.padEnd(10);
  const turns = `${agent.turns} turn${agent.turns !== 1 ? "s" : ""}`.padEnd(9);
  const tokens = formatTokenCount(agent.totalTokens).padStart(8);
  const cost = `$${agent.totalCost.toFixed(4)}`;
  const detailText = agent.activity || "";

  let line = `    ${theme.fg(color, icon)} ${identity.styled}${identityPadding} ${theme.fg(color, status)} ${turns} ${theme.fg("muted", tokens)} ${cost}`;
  if (agent.error) line += ` ${theme.fg("error", "[err]")}`;
  const lines = [line];

  if (agent.status === "streaming" && agent.partialText) {
    const detailPrefix = `      ${theme.fg("muted", "↳")} `;
    const previewLines = getStreamingPreviewLines(agent, detailWidth);
    previewLines.forEach((detailLine, index) => {
      const prefix = index === 0 ? detailPrefix : "        ";
      lines.push(`${prefix}${theme.fg("muted", detailLine)}`);
    });
  } else if (shouldShowAgentDetail(agent, detailText)) {
    const detailPrefix = `      ${theme.fg("muted", "↳")} `;
    const detailLine = truncateText(detailText, Math.max(8, detailWidth));
    lines.push(`${detailPrefix}${theme.fg("muted", detailLine)}`);
  }

  return lines;
}

export function buildPlainDashboardLines(snapshot: MeetingProgressSnapshot): string[] {
  const lines: string[] = [];
  const barWidth = 15;

  lines.push(`── BOARDROOM: ${snapshot.briefTitle} ──`);
  lines.push(`Phase: ${snapshot.phaseLabel} | Rounds: ${snapshot.roundsUsed}/${snapshot.maxRounds}`);
  lines.push(`CEO: ${snapshot.presidentNote}`);

  const budgetPct = snapshot.budgetLimit > 0 ? (snapshot.budgetUsed / snapshot.budgetLimit) * 100 : 0;
  const timePct = snapshot.timeLimitMinutes > 0 ? (snapshot.elapsedMinutes / snapshot.timeLimitMinutes) * 100 : 0;

  lines.push(`Budget: [${progressBar(budgetPct, barWidth)}] ${budgetPct.toFixed(0)}% $${snapshot.budgetUsed.toFixed(2)}/$${snapshot.budgetLimit}`);
  lines.push(`Time:   [${progressBar(timePct, barWidth)}] ${timePct.toFixed(0)}% ${snapshot.elapsedMinutes.toFixed(1)}/${snapshot.timeLimitMinutes}min`);

  if (snapshot.agents.length > 0) {
    lines.push("");
    lines.push("Board Members:");
    for (const agent of snapshot.agents) {
      const icon = STATUS_ICONS[agent.status];
      const cost = `$${agent.totalCost.toFixed(4)}`;
      const tokens = formatTokenCount(agent.totalTokens).padStart(8);
      const identity = `${agent.name} [${truncateText(agent.modelLabel ?? "default", 28)}]`.padEnd(34);
      const turns = `${agent.turns} turn${agent.turns !== 1 ? "s" : ""}`;
      let line = `  ${icon} ${identity} ${agent.status.padEnd(10)} ${turns.padEnd(9)} ${tokens} ${cost}`;
      if (agent.error) line += ` [${agent.error}]`;
      lines.push(line);
      if (agent.status === "streaming" && agent.partialText) {
        for (const detailLine of getStreamingPreviewLines(agent, 72)) {
          lines.push(`    ↳ ${detailLine}`);
        }
      } else if (shouldShowAgentDetail(agent, agent.activity ?? "")) {
        lines.push(`    ↳ ${truncateText(agent.activity ?? "", 72)}`);
      }
    }
  }

  if (snapshot.transcript.length > 0) {
    lines.push("");
    lines.push("Recent:");
    for (const entry of snapshot.transcript.slice(-3)) {
      const preview = entry.length > 80 ? entry.slice(0, 77) + "..." : entry;
      lines.push(`  ${preview}`);
    }
  }

  return lines;
}
