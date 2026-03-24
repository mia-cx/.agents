import * as path from "node:path";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Type } from "@sinclair/typebox";
import { StringEnum } from "@mariozechner/pi-ai";
import { Text } from "@mariozechner/pi-tui";
import { discoverAgents } from "./agents.js";
import { parseBrief, listBriefs } from "./brief-parser.js";
import { loadConfig, resolveConstraints } from "./config.js";
import { runFreeformMeeting, runStructuredMeeting } from "./meeting.js";
import type { MeetingCallbacks, MeetingResult } from "./meeting.js";
import { listPastMeetings } from "./artifacts.js";

interface ActiveMeetingState {
  meetingId: string;
  brief: string;
  mode: string;
  constraints: string;
  phase: string;
  startedAt: number;
  lastStatus: string;
  abortController: AbortController;
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

      const cwd = ctx.cwd;
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
      const selectedIdx = await ctx.ui.select("Select a brief:", briefLabels);
      if (selectedIdx === undefined) return;

      const brief = parseBrief(briefPaths[selectedIdx]);

      for (const warning of brief.warnings) {
        ctx.ui.notify(warning, "warning");
      }

      const { name: constraintsName, values: constraintValues } = resolveConstraints(config, cliConstraints ?? brief.constraints, {
        budget: brief.budgetOverride,
        time_limit_minutes: brief.timeLimitOverride,
        max_debate_rounds: brief.maxRoundsOverride,
      });

      const mode = (cliMode === "structured" ? "structured" : cliMode === "freeform" ? "freeform" : brief.mode) ?? config.default_mode;

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
      };

      ctx.ui.setStatus("boardroom", "Board meeting in progress...");

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
              ctx.ui.setStatus("boardroom", msg);
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

        activeMeeting = null;
        ctx.ui.setStatus("boardroom", undefined);
        const visualMsg = result.visualPaths.length > 0 ? `\nVisuals: ${result.visualPaths.join(", ")}` : "";
        ctx.ui.notify(`Meeting complete!\nMemo: ${result.memoPath}\nDebate: ${result.debateJsonPath}${visualMsg}`, "info");
      } catch (err: any) {
        activeMeeting = null;
        ctx.ui.setStatus("boardroom", undefined);
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
        activeMeeting.abortController.abort();
        ctx.ui.notify("Meeting force-close signal sent. CEO will synthesize with available data.", "warning");
      }
    },
  });

  pi.registerCommand("board-list", {
    description: "List past board meetings",
    handler: async (_args, ctx) => {
      const logs = listPastMeetings(ctx.cwd);
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
      const cwd = ctx.cwd;
      const config = loadConfig(cwd);
      const agents = discoverAgents(cwd);

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

      const result = await runMeeting(cwd, brief, agents, mode, constraintsName, constraintValues, config, {
        onStatus: (msg) => {
          onUpdate?.({ content: [{ type: "text", text: msg }] });
          ctx.ui.setStatus("boardroom", msg);
        },
        onConfirmRoster: async () => true,
        signal,
      });

      ctx.ui.setStatus("boardroom", undefined);

      return {
        content: [{
          type: "text",
          text: [
            `Board meeting complete.`,
            `Memo: ${result.memoPath}`,
            `Debate log: ${result.debateJsonPath}`,
            result.visualPaths.length > 0 ? `Visuals: ${result.visualPaths.join(", ")}` : "",
            brief.warnings.length > 0 ? `Warnings: ${brief.warnings.join("; ")}` : "",
          ].filter(Boolean).join("\n"),
        }],
        details: { memoPath: result.memoPath, debateJsonPath: result.debateJsonPath, visualPaths: result.visualPaths },
      };
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
