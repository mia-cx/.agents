import type { AgentRuntimeStatus, AgentRuntimeUpdate, MeetingProgressSnapshot } from "./types.js";

export interface DashboardTheme {
  fg: (color: string, text: string) => string;
  bold: (text: string) => string;
}

const STATUS_ICONS: Record<AgentRuntimeStatus, string> = {
  idle: "·",
  queued: "○",
  running: "▶",
  streaming: "◉",
  completed: "✓",
  failed: "✗",
  aborted: "⊘",
};

const STATUS_COLORS: Record<AgentRuntimeStatus, string> = {
  idle: "dim",
  queued: "muted",
  running: "accent",
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
): string[] {
  const lines: string[] = [];
  const dim = (t: string) => theme.fg("dim", t);
  const accent = (t: string) => theme.fg("accent", t);
  const muted = (t: string) => theme.fg("muted", t);

  const rule = dim("─".repeat(50));
  lines.push(rule);
  lines.push(
    `  ${theme.bold(accent("BOARDROOM"))} ${dim("·")} ${theme.fg("muted", snapshot.briefTitle)}`,
  );
  lines.push(rule);
  lines.push("");

  lines.push(`  ${muted("Phase:")} ${accent(snapshot.phaseLabel)} ${dim("|")} ${muted("Rounds:")} ${snapshot.roundsUsed}/${snapshot.maxRounds}`);
  lines.push(`  ${muted("CEO:")} ${snapshot.presidentNote}`);
  lines.push("");

  const budgetPct = snapshot.budgetLimit > 0 ? (snapshot.budgetUsed / snapshot.budgetLimit) * 100 : 0;
  const timePct = snapshot.timeLimitMinutes > 0 ? (snapshot.elapsedMinutes / snapshot.timeLimitMinutes) * 100 : 0;

  const budgetColor = budgetPct >= 80 ? "warning" : budgetPct >= 100 ? "error" : "accent";
  const timeColor = timePct >= 80 ? "warning" : timePct >= 100 ? "error" : "accent";

  lines.push(
    `  ${muted("Budget:")} ${theme.fg(budgetColor, `[${progressBar(budgetPct)}]`)} ${theme.fg(budgetColor, `${budgetPct.toFixed(0)}%`)} $${snapshot.budgetUsed.toFixed(2)}/$${snapshot.budgetLimit}`,
  );
  lines.push(
    `  ${muted("Time:")}   ${theme.fg(timeColor, `[${progressBar(timePct)}]`)} ${theme.fg(timeColor, `${timePct.toFixed(0)}%`)} ${snapshot.elapsedMinutes.toFixed(1)}/${snapshot.timeLimitMinutes}min`,
  );
  lines.push("");

  if (snapshot.agents.length > 0) {
    lines.push(`  ${theme.bold(muted("Board Members:"))}`);
    for (const agent of snapshot.agents) {
      lines.push(formatAgentLine(agent, theme));
    }
    lines.push("");
  }

  if (snapshot.transcript.length > 0) {
    lines.push(`  ${theme.bold(muted("Recent:"))}`);
    for (const entry of snapshot.transcript.slice(-3)) {
      const preview = entry.length > 72 ? entry.slice(0, 69) + "..." : entry;
      lines.push(`    ${dim(preview)}`);
    }
  }

  return lines;
}

function formatAgentLine(agent: AgentRuntimeUpdate, theme: DashboardTheme): string {
  const icon = STATUS_ICONS[agent.status];
  const color = STATUS_COLORS[agent.status];
  const name = agent.name.length > 22 ? agent.name.slice(0, 19) + "..." : agent.name.padEnd(22);
  const status = agent.status.padEnd(10);
  const turns = `${agent.turns} turn${agent.turns !== 1 ? "s" : ""}`.padEnd(9);
  const cost = `$${agent.totalCost.toFixed(4)}`;

  let line = `    ${theme.fg(color, icon)} ${name} ${theme.fg(color, status)} ${turns} ${cost}`;
  if (agent.error) line += ` ${theme.fg("error", "[err]")}`;
  return line;
}

export function buildPlainDashboardLines(snapshot: MeetingProgressSnapshot): string[] {
  const lines: string[] = [];

  lines.push(`── BOARDROOM: ${snapshot.briefTitle} ──`);
  lines.push(`Phase: ${snapshot.phaseLabel} | Rounds: ${snapshot.roundsUsed}/${snapshot.maxRounds}`);
  lines.push(`CEO: ${snapshot.presidentNote}`);

  const budgetPct = snapshot.budgetLimit > 0 ? (snapshot.budgetUsed / snapshot.budgetLimit) * 100 : 0;
  const timePct = snapshot.timeLimitMinutes > 0 ? (snapshot.elapsedMinutes / snapshot.timeLimitMinutes) * 100 : 0;

  lines.push(`Budget: [${progressBar(budgetPct, 15)}] ${budgetPct.toFixed(0)}% $${snapshot.budgetUsed.toFixed(2)}/$${snapshot.budgetLimit}`);
  lines.push(`Time:   [${progressBar(timePct, 15)}] ${timePct.toFixed(0)}% ${snapshot.elapsedMinutes.toFixed(1)}/${snapshot.timeLimitMinutes}min`);

  if (snapshot.agents.length > 0) {
    lines.push("");
    lines.push("Board Members:");
    for (const agent of snapshot.agents) {
      const icon = STATUS_ICONS[agent.status];
      const cost = `$${agent.totalCost.toFixed(4)}`;
      const turns = `${agent.turns} turn${agent.turns !== 1 ? "s" : ""}`;
      let line = `  ${icon} ${agent.name.padEnd(22)} ${agent.status.padEnd(10)} ${turns.padEnd(9)} ${cost}`;
      if (agent.error) line += ` [${agent.error}]`;
      lines.push(line);
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
