import * as path from "node:path";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Type } from "@sinclair/typebox";
import { StringEnum } from "@mariozechner/pi-ai";
import { Container, Text } from "@mariozechner/pi-tui";
import { discoverAgents } from "./agents.js";
import { parseBrief, listBriefs } from "./brief-parser.js";
import { loadConfig, resolveConstraints } from "./config.js";
import { runFreeformMeeting, runStructuredMeeting } from "./meeting.js";
import type { MeetingCallbacks, MeetingResult } from "./meeting.js";
import type { AgentRuntimeUpdate, MeetingProgressSnapshot } from "./types.js";
import { listPastMeetings } from "./artifacts.js";
import { formatDashboardStatus, buildDashboardWidgetLines, buildPlainDashboardLines } from "./ui.js";
import { buildCloseoutSummary, buildThemedCloseoutLines, runPostMeetingActions } from "./closeout.js";

interface ActiveMeetingState {
  meetingId: string;
  brief: string;
  mode: string;
  constraints: string;
  phase: string;
  startedAt: number;
  lastStatus: string;
  abortController: AbortController;
  agentSnapshots: AgentRuntimeUpdate[];
  lastSnapshot: MeetingProgressSnapshot | null;
}

function prioritizeOption<T extends string>(options: T[], preferred: T): T[] {
  const unique = Array.from(new Set(options));
  const remaining = unique.filter((option) => option !== preferred);
  return [preferred, ...remaining];
}

async function runMeeting(
  cwd: string,
  brief: ReturnType<typeof parseBrief>,
  agents: ReturnType<typeof discoverAgents>,
  mode: string,
  constraintsName: string,
  constraintValues: ReturnType<typeof resolveConstraints>["values"],
  config: ReturnType<typeof loadConfig>,
  callbacks: MeetingCallbacks,
): Promise<MeetingResult> {
  if (mode === "structured") {
    return runStructuredMeeting(cwd, brief, agents, constraintsName, constraintValues, config, callbacks);
  }
  return runFreeformMeeting(cwd, brief, agents, mode as any, constraintsName, constraintValues, config, callbacks);
}

export default function (pi: ExtensionAPI) {
  let activeMeeting: ActiveMeetingState | null = null;
  const getWorkingDirectory = (ctx: { cwd?: string }) => ctx.cwd ?? process.cwd();
  let activeMeetingTimer: ReturnType<typeof setInterval> | null = null;

  const renderWidgetLines = (lines: string[]) => (_tui: unknown, _theme: unknown) => {
    const container = new Container();
    for (const line of lines) {
      container.addChild(new Text(line, 1, 0));
    }
    return container;
  };

  const setBoardroomWidget = (
    ctx: { ui: ExtensionAPI["commands"][number] extends never ? never : any },
    snapshot: MeetingProgressSnapshot,
  ) => {
    const theme = ctx.ui.theme;
    ctx.ui.setWidget("boardroom", renderWidgetLines(buildDashboardWidgetLines(snapshot, theme)));
  };

  const setCloseoutWidget = (
    ctx: { ui: ExtensionAPI["commands"][number] extends never ? never : any },
    result: MeetingResult,
  ) => {
    const theme = ctx.ui.theme;
    ctx.ui.setWidget("boardroom", renderWidgetLines(buildThemedCloseoutLines(result, theme)));
  };

  const withLiveElapsed = (
    snapshot: MeetingProgressSnapshot,
    startedAtMs: number,
    agentSnapshots: AgentRuntimeUpdate[],
  ): MeetingProgressSnapshot => ({
    ...snapshot,
    elapsedMinutes: Math.max(snapshot.elapsedMinutes, (Date.now() - startedAtMs) / 60_000),
    agents: agentSnapshots.length > 0 ? [...agentSnapshots] : snapshot.agents,
  });

  const clearActiveMeetingTimer = () => {
    if (activeMeetingTimer) {
      clearInterval(activeMeetingTimer);
      activeMeetingTimer = null;
    }
  };

  const renderMeetingUi = (
    ctx: { hasUI: boolean; ui: ExtensionAPI["commands"][number] extends never ? never : any },
    meeting: ActiveMeetingState | null,
  ) => {
    if (!ctx.hasUI || !meeting) return;
    if (!meeting.lastSnapshot) {
      ctx.ui.setStatus("boardroom", meeting.lastStatus);
      return;
    }

    const theme = ctx.ui.theme;
    const snapshot = withLiveElapsed(meeting.lastSnapshot, meeting.startedAt, meeting.agentSnapshots);
    ctx.ui.setStatus("boardroom", formatDashboardStatus(snapshot, theme));
    setBoardroomWidget(ctx, snapshot);
  };

  pi.registerCommand("board-meeting", {
    description: "Start a boardroom meeting with the executive board",
    getArgumentCompletions: (prefix: string) => {
      const flags = ["--constraints quick", "--constraints standard", "--constraints thorough", "--constraints deep-dive", "--mode freeform", "--mode structured"];
      return flags.filter(f => f.startsWith(prefix)).map(f => ({ value: f, label: f }));
    },
    handler: async (args, ctx) => {
      if (activeMeeting) {
        ctx.ui.notify("A meeting is already in progress. Use /board-close to force-close it first.", "warning");
        return;
      }

      const cwd = getWorkingDirectory(ctx);
      const config = loadConfig(cwd);
      const agents = discoverAgents(cwd);

      if (agents.length === 0) {
        ctx.ui.notify("No executive board agents found in agents/executive-board/", "error");
        return;
      }

      let cliConstraints: string | undefined;
      let cliMode: string | undefined;
      if (args) {
        const constraintsMatch = args.match(/--constraints\s+(\S+)/);
        if (constraintsMatch) cliConstraints = constraintsMatch[1];
        const modeMatch = args.match(/--mode\s+(\S+)/);
        if (modeMatch) cliMode = modeMatch[1];
      }

      const briefPaths = listBriefs(cwd);
      if (briefPaths.length === 0) {
        ctx.ui.notify("No briefs found in boardroom/briefs/. Create one from boardroom/briefs/_template.md", "error");
        return;
      }

      const briefLabels = briefPaths.map(p => path.basename(p, ".md"));
      const selectedBriefLabel = await ctx.ui.select("Select a brief:", briefLabels);
      if (selectedBriefLabel === undefined) return;

      const selectedBriefPath = briefPaths.find((briefPath) => path.basename(briefPath, ".md") === selectedBriefLabel);
      if (!selectedBriefPath) {
        ctx.ui.notify(`Selected brief not found: ${selectedBriefLabel}`, "error");
        return;
      }

      const brief = parseBrief(selectedBriefPath);

      for (const warning of brief.warnings) {
        ctx.ui.notify(warning, "warning");
      }

      const defaultMode = (brief.mode ?? config.default_mode) as "freeform" | "structured";
      const selectedMode = cliMode === "structured" || cliMode === "freeform"
        ? cliMode
        : await ctx.ui.select(
            "Select meeting mode:",
            prioritizeOption(["structured", "freeform"], defaultMode),
          );
      if (selectedMode === undefined) return;

      const defaultConstraints = brief.constraints && config.constraints[brief.constraints]
        ? brief.constraints
        : config.default_constraints;
      const selectedConstraints = cliConstraints
        ?? await ctx.ui.select(
          "Select constraints:",
          prioritizeOption(Object.keys(config.constraints), defaultConstraints),
        );
      if (selectedConstraints === undefined) return;

      const { name: constraintsName, values: constraintValues } = resolveConstraints(config, selectedConstraints, {
        budget: brief.budgetOverride,
        time_limit_minutes: brief.timeLimitOverride,
        max_debate_rounds: brief.maxRoundsOverride,
      });

      const mode = selectedMode;

      const confirmMsg = [
        `Brief: ${brief.title}`,
        `Mode: ${mode}`,
        `Constraints: ${constraintsName} ($${constraintValues.budget} / ${constraintValues.time_limit_minutes}min / ${constraintValues.max_debate_rounds} rounds)`,
        `Agents found: ${agents.length}`,
      ].join("\n");

      const ok = await ctx.ui.confirm("Start Board Meeting?", confirmMsg);
      if (!ok) return;

      const abortController = new AbortController();
      activeMeeting = {
        meetingId: "",
        brief: brief.title,
        mode,
        constraints: constraintsName,
        phase: "starting",
        startedAt: Date.now(),
        lastStatus: "Starting...",
        abortController,
        agentSnapshots: [],
        lastSnapshot: null,
      };

      ctx.ui.setStatus("boardroom", "Board meeting in progress...");
      clearActiveMeetingTimer();
      if (ctx.hasUI) {
        activeMeetingTimer = setInterval(() => renderMeetingUi(ctx, activeMeeting), 1000);
      }

      try {
        const result = await runMeeting(
          cwd, brief, agents, mode, constraintsName, constraintValues, config,
          {
            onStatus: (msg) => {
              if (activeMeeting) {
                activeMeeting.lastStatus = msg;
                const phaseMatch = msg.match(/Phase (\d+)/i) || msg.match(/Round (\d+)/i);
                if (phaseMatch) activeMeeting.phase = `Phase ${phaseMatch[1]}`;
              }
              renderMeetingUi(ctx, activeMeeting);
            },
            onAgentUpdate: (update) => {
              if (!activeMeeting) return;
              const idx = activeMeeting.agentSnapshots.findIndex(s => s.slug === update.slug);
              if (idx >= 0) activeMeeting.agentSnapshots[idx] = update;
              else activeMeeting.agentSnapshots.push(update);

              renderMeetingUi(ctx, activeMeeting);
            },
            onSnapshot: (snapshot) => {
              if (activeMeeting) {
                activeMeeting.lastSnapshot = snapshot;
                activeMeeting.phase = snapshot.phaseLabel;
              }
              renderMeetingUi(ctx, activeMeeting);
            },
            onConfirmRoster: async (names, rationale) => {
              if (!ctx.hasUI) return true;
              return ctx.ui.confirm(
                "Confirm Board Roster",
                `CEO selected: ${names.join(", ")}\n\nRationale: ${rationale}\n\nProceed with this roster?`,
              );
            },
            signal: abortController.signal,
          },
        );

        clearActiveMeetingTimer();
        activeMeeting = null;

        if (ctx.hasUI) {
          setCloseoutWidget(ctx, result);
          ctx.ui.setStatus("boardroom", undefined);
        }

        ctx.ui.notify(buildCloseoutSummary(result), "info");

        await runPostMeetingActions(result, {
          hasUI: ctx.hasUI,
          confirm: (title, body) => ctx.ui.confirm(title, body),
          notify: (msg, type) => ctx.ui.notify(msg, type),
        });

        ctx.ui.setWidget("boardroom", undefined);
      } catch (err: any) {
        clearActiveMeetingTimer();
        activeMeeting = null;
        ctx.ui.setStatus("boardroom", undefined);
        ctx.ui.setWidget("boardroom", undefined);
        ctx.ui.notify(`Meeting failed: ${err.message}`, "error");
      }
    },
  });

  pi.registerCommand("board-status", {
    description: "Show current board meeting status",
    handler: async (_args, ctx) => {
      if (!activeMeeting) {
        ctx.ui.notify("No active meeting.", "info");
        return;
      }

      const elapsed = ((Date.now() - activeMeeting.startedAt) / 60_000).toFixed(1);
      const lines = [
        `Brief: ${activeMeeting.brief}`,
        `Mode: ${activeMeeting.mode}`,
        `Constraints: ${activeMeeting.constraints}`,
        `Phase: ${activeMeeting.phase}`,
        `Elapsed: ${elapsed} min`,
        `Status: ${activeMeeting.lastStatus}`,
      ];

      if (activeMeeting.agentSnapshots.length > 0) {
        lines.push("", "Board Members:");
        for (const agent of activeMeeting.agentSnapshots) {
          const cost = `$${agent.totalCost.toFixed(4)}`;
          const tokens = agent.totalTokens > 0 ? `${agent.totalTokens} tok` : "";
          lines.push(`  ${agent.name}: ${agent.status} (${agent.turns} turns, ${cost}${tokens ? `, ${tokens}` : ""})`);
          if (agent.error) lines.push(`    Error: ${agent.error}`);
        }
      }

      if (activeMeeting.lastSnapshot) {
        lines.push("");
        lines.push(...buildPlainDashboardLines(activeMeeting.lastSnapshot));
      }

      ctx.ui.notify(`Active Meeting\n\n${lines.join("\n")}`, "info");
    },
  });

  pi.registerCommand("board-close", {
    description: "Force-close the current board meeting",
    handler: async (_args, ctx) => {
      if (!activeMeeting) {
        ctx.ui.notify("No active meeting to close.", "info");
        return;
      }

      const ok = await ctx.ui.confirm(
        "Force-close meeting?",
        `Meeting "${activeMeeting.brief}" is in ${activeMeeting.phase}.\nThe CEO will get one final synthesis turn with available data.`,
      );

      if (ok) {
        activeMeeting.abortController.abort("force-close");
        ctx.ui.notify("Meeting force-close signal sent. CEO will synthesize with available data.", "warning");
      }
    },
  });

  pi.registerCommand("board-list", {
    description: "List past board meetings",
    handler: async (_args, ctx) => {
      const logs = listPastMeetings(getWorkingDirectory(ctx));
      if (logs.length === 0) {
        ctx.ui.notify("No past meetings found.", "info");
        return;
      }

      const header = "Date       | Mode       | Disposition     | Cost    | Participants";
      const sep =    "-----------|------------|-----------------|---------|-------------";
      const rows = logs.map((log) => {
        const date = log.started_at.slice(0, 10);
        const mode = log.mode.padEnd(10);
        const disp = log.disposition.padEnd(15);
        const cost = `$${log.total_cost.toFixed(2)}`.padEnd(7);
        const participants = log.roster.join(", ");
        return `${date} | ${mode} | ${disp} | ${cost} | ${participants}`;
      });

      ctx.ui.notify(`Past Meetings\n\n${header}\n${sep}\n${rows.join("\n")}`, "info");
    },
  });

  pi.registerTool({
    name: "board_meeting",
    label: "Board Meeting",
    description: [
      "Run a boardroom meeting with the executive board.",
      "The CEO frames the decision, selects board members, they debate in parallel, and the CEO synthesizes a final strategic memo.",
      "Requires a brief file in boardroom/briefs/.",
    ].join(" "),
    promptSnippet: "Run an executive board meeting on a brief to produce a strategic decision memo",
    parameters: Type.Object({
      brief: Type.String({ description: "Path to the brief file in boardroom/briefs/" }),
      constraints: Type.Optional(Type.String({ description: "Constraint level: quick, standard, thorough, deep-dive" })),
      mode: Type.Optional(StringEnum(["freeform", "structured"] as const, { description: "Meeting mode" })),
    }),

    async execute(_toolCallId, params, signal, onUpdate, ctx) {
      const cwd = getWorkingDirectory(ctx);
      const config = loadConfig(cwd);
      const agents = discoverAgents(cwd);
      let agentSnapshots: AgentRuntimeUpdate[] = [];
      let lastSnapshot: MeetingProgressSnapshot | null = null;
      const startedAtMs = Date.now();
      let toolUiTimer: ReturnType<typeof setInterval> | null = null;

      const renderToolUi = () => {
        if (!ctx.hasUI || !lastSnapshot) return;
        const theme = ctx.ui.theme;
        const snapshot = withLiveElapsed(lastSnapshot, startedAtMs, agentSnapshots);
        ctx.ui.setStatus("boardroom", formatDashboardStatus(snapshot, theme));
        ctx.ui.setWidget("boardroom", buildDashboardWidgetLines(snapshot, theme));
      };

      if (agents.length === 0) throw new Error("No executive board agents found in agents/executive-board/");

      const briefPath = path.resolve(cwd, params.brief);
      const fs = await import("node:fs");
      if (!fs.existsSync(briefPath)) {
        const available = listBriefs(cwd);
        const names = available.map(p => path.basename(p, ".md")).join(", ");
        throw new Error(`Brief not found: ${params.brief}. Available briefs: ${names || "none"}`);
      }
      const brief = parseBrief(briefPath);
      const { name: constraintsName, values: constraintValues } = resolveConstraints(config, params.constraints ?? brief.constraints, {
        budget: brief.budgetOverride,
        time_limit_minutes: brief.timeLimitOverride,
        max_debate_rounds: brief.maxRoundsOverride,
      });
      const mode = params.mode ?? brief.mode ?? config.default_mode;

      onUpdate?.({ content: [{ type: "text", text: `Starting board meeting: ${brief.title} (${mode}, ${constraintsName})...` }] });
      if (ctx.hasUI) {
        toolUiTimer = setInterval(renderToolUi, 1000);
      }

      let result: MeetingResult;
      try {
        result = await runMeeting(cwd, brief, agents, mode, constraintsName, constraintValues, config, {
          onStatus: (msg) => {
            onUpdate?.({ content: [{ type: "text", text: msg }] });
            if (!lastSnapshot) ctx.ui.setStatus("boardroom", msg);
            else renderToolUi();
          },
          onAgentUpdate: (update) => {
            const idx = agentSnapshots.findIndex((snapshot) => snapshot.slug === update.slug);
            if (idx >= 0) agentSnapshots[idx] = update;
            else agentSnapshots.push(update);

            renderToolUi();

            const icon = update.status === "completed" ? "✓" : update.status === "failed" ? "✗" : update.status === "streaming" ? "◉" : "▶";
            const activity = update.activity ? ` - ${update.activity}` : "";
            onUpdate?.({ content: [{ type: "text", text: `${icon} ${update.name}: ${update.status}${activity} (${update.turns} turns, $${update.totalCost.toFixed(4)})` }] });
          },
          onSnapshot: (snapshot) => {
            lastSnapshot = snapshot;
            agentSnapshots = [...snapshot.agents];
            renderToolUi();
          },
          onConfirmRoster: async () => true,
          signal,
        });
      } finally {
        if (toolUiTimer) clearInterval(toolUiTimer);
      }

      ctx.ui.setStatus("boardroom", undefined);
      if (ctx.hasUI) {
        setCloseoutWidget(ctx, result);
      }

      const summary = buildCloseoutSummary(result);

      const response = {
        content: [{
          type: "text",
          text: [
            summary,
            brief.warnings.length > 0 ? `\nWarnings: ${brief.warnings.join("; ")}` : "",
          ].filter(Boolean).join("\n"),
        }],
        details: {
          memoPath: result.memoPath,
          debateJsonPath: result.debateJsonPath,
          visualPaths: result.visualPaths,
          disposition: result.disposition,
          totalCost: result.totalCost,
        },
      };

      return response;
    },

    renderCall(args, theme, _context) {
      const briefName = args.brief ? path.basename(args.brief, ".md") : "...";
      let text = theme.fg("toolTitle", theme.bold("board_meeting "));
      text += theme.fg("accent", briefName);
      if (args.constraints) text += theme.fg("muted", ` [${args.constraints}]`);
      if (args.mode) text += theme.fg("dim", ` (${args.mode})`);
      return new Text(text, 0, 0);
    },

    renderResult(result, _options, theme, _context) {
      const text = result.content[0];
      if (!text || text.type !== "text") return new Text(theme.fg("muted", "(no output)"), 0, 0);
      const icon = result.isError ? theme.fg("error", "✗") : theme.fg("success", "✓");
      return new Text(`${icon} ${text.text}`, 0, 0);
    },
  });
}
