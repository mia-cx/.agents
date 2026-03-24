import * as path from "node:path";
import { execFileSync } from "node:child_process";
import { DynamicBorder, type ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Type } from "@sinclair/typebox";
import { StringEnum } from "@mariozechner/pi-ai";
import { Container, Spacer, Text } from "@mariozechner/pi-tui";
import { discoverAgents } from "./agents.js";
import { parseBrief, listBriefs } from "./brief-parser.js";
import { loadConfig, resolveConstraints } from "./config.js";
import { runFreeformMeeting, runStructuredMeeting } from "./meeting.js";
import type { MeetingCallbacks, MeetingResult, RosterConfirmation } from "./meeting.js";
import type { AgentConfig } from "./types.js";
import type { AgentRuntimeUpdate, MeetingProgressSnapshot } from "./types.js";
import { listPastMeetings } from "./artifacts.js";
import { formatDashboardStatus, buildDashboardWidgetLines, buildPlainDashboardLines } from "./ui.js";
import {
  buildCloseoutSummary,
  buildNarrationWidgetLines,
  buildThemedCloseoutLines,
  generateHumanReadableSummary,
  runPostMeetingActions,
} from "./closeout.js";
import type { NarrationDisplayState } from "./closeout.js";

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
  pausedAt: number | null;
  pausedTotalMs: number;
}

type RosterEditorResult = string[] | undefined;

type ReasoningEffort = "default" | "low" | "medium" | "high";
type ModelPickerMode = "single" | "all";
type ModelPickerStage = "model" | "effort";

interface PiModelCatalogEntry {
  provider: string;
  model: string;
  context?: string;
  maxOut?: string;
  thinking?: string;
  images?: string;
}

let piModelCatalogCache: PiModelCatalogEntry[] | null = null;

function prioritizeOption<T extends string>(options: T[], preferred: T): T[] {
  const unique = Array.from(new Set(options));
  const remaining = unique.filter((option) => option !== preferred);
  return [preferred, ...remaining];
}

function orderRosterSelection(
  available: AgentConfig[],
  preferredSlugs: string[],
): AgentConfig[] {
  const preferred = new Set(preferredSlugs);
  return [
    ...available.filter((agent) => preferred.has(agent.slug)),
    ...available.filter((agent) => !preferred.has(agent.slug)),
  ];
}

function truncateInline(text: string, maxLength: number): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
}

function isRightArrowKey(keyData: string, keybindings: any): boolean {
  return keybindings.matches(keyData, "tui.select.right")
    || keyData === "\u001b[C"
    || keyData === "\u001bOC"
    || /^\u001b\[[0-9;]*C$/.test(keyData);
}

function resolveModelLabel(model: string | undefined): string {
  if (!model) return "default";
  if (model.includes("/")) return model;
  if (/^(claude|sonnet|opus|haiku)\b/i.test(model)) return `anthropic/${model}`;
  if (/^(gpt|o[1-9]|codex)\b/i.test(model)) return `openai-codex/${model}`;
  return model;
}

function parseModelSpec(model: string | undefined): { base: string | undefined; effort: ReasoningEffort } {
  const resolved = resolveModelLabel(model);
  if (!resolved || resolved === "default") return { base: undefined, effort: "default" };
  const match = resolved.match(/^(.*?)(?::(low|medium|high))$/);
  if (!match) return { base: resolved, effort: "default" };
  return {
    base: match[1],
    effort: match[2] as ReasoningEffort,
  };
}

function formatModelSpec(base: string | undefined, effort: ReasoningEffort): string | undefined {
  if (!base) return undefined;
  return effort === "default" ? base : `${base}:${effort}`;
}

function parsePiModelCatalog(output: string): PiModelCatalogEntry[] {
  const lines = output
    .split("\n")
    .map((line) => line.trimEnd())
    .filter(Boolean);
  if (lines.length <= 1) return [];

  const entries: PiModelCatalogEntry[] = [];
  for (const line of lines.slice(1)) {
    const parts = line.split(/\s{2,}/).map((part) => part.trim()).filter(Boolean);
    if (parts.length < 2) continue;
    entries.push({
      provider: parts[0],
      model: parts[1],
      context: parts[2],
      maxOut: parts[3],
      thinking: parts[4],
      images: parts[5],
    });
  }
  return entries;
}

function getPiModelCatalog(): PiModelCatalogEntry[] {
  if (piModelCatalogCache) return piModelCatalogCache;
  try {
    const output = execFileSync("pi", ["--list-models"], {
      encoding: "utf-8",
      timeout: 10_000,
    });
    piModelCatalogCache = parsePiModelCatalog(output);
  } catch {
    piModelCatalogCache = [];
  }
  return piModelCatalogCache;
}

function modelProvider(label: string): string {
  return label.includes("/") ? label.split("/")[0] : "other";
}

function buildAvailableModelOptions(
  agents: AgentConfig[],
  currentModel?: string,
): Array<{ value: string; label: string; provider: string; meta?: string }> {
  const options: Array<{ value: string; label: string; provider: string; meta?: string }> = [];
  const seen = new Set<string>();
  const push = (label: string | undefined, meta?: string) => {
    const base = parseModelSpec(label).base;
    const resolved = resolveModelLabel(base);
    if (!resolved || resolved === "default" || seen.has(resolved)) return;
    seen.add(resolved);
    options.push({
      value: resolved,
      label: resolved,
      provider: modelProvider(resolved),
      meta,
    });
  };

  for (const entry of getPiModelCatalog()) {
    push(
      `${entry.provider}/${entry.model}`,
      [entry.context, entry.thinking === "yes" ? "thinking" : undefined].filter(Boolean).join(" · ") || undefined,
    );
  }

  push(currentModel);
  for (const agent of agents) {
    push(agent.model);
    push(agent.modelAlt);
  }

  return options;
}

function collectModelBaseOptions(agents: AgentConfig[], currentModel?: string): string[] {
  const options = new Set<string>();
  const current = parseModelSpec(currentModel).base;
  if (current) options.add(current);
  for (const agent of agents) {
    const primary = parseModelSpec(agent.model).base;
    const fallback = parseModelSpec(agent.modelAlt).base;
    if (primary) options.add(primary);
    if (fallback) options.add(fallback);
  }
  return Array.from(options);
}

function fuzzyMatches(text: string, query: string): boolean {
  const target = text.toLowerCase();
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  if (target.includes(needle)) return true;
  let index = 0;
  for (const char of needle) {
    index = target.indexOf(char, index);
    if (index === -1) return false;
    index += 1;
  }
  return true;
}

async function chooseAgentModel(
  ctx: { ui: ExtensionAPI["commands"][number] extends never ? never : any },
  allAgents: AgentConfig[],
  agent: AgentConfig,
  defaultModel: string | undefined,
  title = `Choose primary model for ${agent.name}`,
): Promise<string | undefined | null> {
  const current = parseModelSpec(agent.model);
  const baseChoices = collectModelBaseOptions(allAgents, agent.model);
  const defaultLabel = defaultModel
    ? `Use default (${resolveModelLabel(defaultModel)})`
    : "Use Pi default";
  const currentBase = current.base;
  const orderedBases = currentBase
    ? [currentBase, ...baseChoices.filter((base) => base !== currentBase)]
    : baseChoices;
  const baseChoice = await ctx.ui.select(
    [
      title,
      "",
      `Current: ${resolveModelLabel(agent.model)}`,
      agent.modelAlt ? `Fallback: ${resolveModelLabel(agent.modelAlt)}` : "Fallback: none",
      "Tip: type to filter models.",
    ].join("\n"),
    [defaultLabel, ...orderedBases],
  );
  if (baseChoice === undefined) return null;
  if (baseChoice === defaultLabel) return defaultModel;

  const currentEffortLabel = current.effort === "default" ? "default reasoning" : current.effort;
  const effortChoice = await ctx.ui.select(
    [
      `Reasoning effort for ${agent.name}`,
      "",
      `Model: ${baseChoice}`,
      "Choose the effort suffix appended to this model.",
    ].join("\n"),
    prioritizeOption(["default reasoning", "medium", "high", "low"], currentEffortLabel),
  );
  if (effortChoice === undefined) return null;
  const effort = effortChoice === "default reasoning" ? "default" : effortChoice as ReasoningEffort;
  return formatModelSpec(baseChoice, effort) ?? null;
}

async function chooseSharedModel(
  ctx: { ui: ExtensionAPI["commands"][number] extends never ? never : any },
  allAgents: AgentConfig[],
  currentModels: Array<string | undefined>,
): Promise<string | "reset-defaults" | null> {
  const uniqueCurrent = Array.from(new Set(currentModels.map((model) => resolveModelLabel(model))));
  const currentLabel = uniqueCurrent.length === 1 ? uniqueCurrent[0] : "mixed";
  const currentEfforts = Array.from(new Set(currentModels.map((model) => parseModelSpec(model).effort)));
  const currentEffortLabel = currentEfforts.length === 1
    ? (currentEfforts[0] === "default" ? "default reasoning" : currentEfforts[0])
    : "default reasoning";
  const baseChoices = collectModelBaseOptions(allAgents);
  const resetLabel = "Reset all to defaults";
  const baseChoice = await ctx.ui.select(
    [
      "Choose one model for all listed board members",
      "",
      `Current: ${currentLabel}`,
      "Tip: type to filter models.",
    ].join("\n"),
    [resetLabel, ...baseChoices],
  );
  if (baseChoice === undefined) return null;
  if (baseChoice === resetLabel) return "reset-defaults";

  const effortChoice = await ctx.ui.select(
    [
      "Reasoning effort for all listed board members",
      "",
      `Model: ${baseChoice}`,
      "Choose the shared effort suffix appended to this model.",
    ].join("\n"),
    prioritizeOption(["default reasoning", "medium", "high", "low"], currentEffortLabel),
  );
  if (effortChoice === undefined) return null;
  const effort = effortChoice === "default reasoning" ? "default" : effortChoice as ReasoningEffort;
  return formatModelSpec(baseChoice, effort) ?? null;
}

function createRosterEditorComponent(
  tui: any,
  theme: any,
  keybindings: any,
  agents: AgentConfig[],
  selectedSlugs: string[],
  lockedSlugs: string[],
  maxSelectable: number | undefined,
  rationale: string,
  onDone: (result: RosterEditorResult) => void,
): any {
  const MODAL_WIDTH = 110;
  const MODAL_INNER_WIDTH = MODAL_WIDTH - 8;
  const PICKER_GUTTER = 3;
  const PICKER_MAX_INNER_WIDTH = 34;
  const root: any = new Container();
  const listContainer: any = new Container();
  const titleText: any = new Text("", 1, 0);
  const summaryText: any = new Text("", 1, 0);
  const rationaleText: any = new Text("", 1, 0);
  const statusText: any = new Text("", 1, 0);
  const selected = new Set(selectedSlugs);
  const initialModels = new Map(agents.map((agent) => [agent.slug, agent.model]));
  let selectedIndex = 0;
  let pickerState:
    | {
        mode: ModelPickerMode;
        stage: ModelPickerStage;
        targetSlug?: string;
        query: string;
        optionIndex: number;
        draftBase?: string;
      }
    | null = null;

  const getCurrentAgent = () => agents[selectedIndex];

  const buildModelOptions = () => {
    const state = pickerState;
    if (!state) return [] as Array<{ value: string; label: string; provider: string; meta?: string }>;
    const options = buildAvailableModelOptions(agents, getCurrentAgent()?.model);
    const resetLabel = state.mode === "all" ? "Reset all to defaults" : "Use member default";
    const filtered = [
      { value: "__reset__", label: resetLabel, provider: "actions" },
      ...options,
    ].filter((option) =>
      fuzzyMatches(option.label, state.query)
      || fuzzyMatches(option.provider, state.query)
      || fuzzyMatches(option.meta ?? "", state.query),
    );
    return filtered;
  };

  const buildModelDisplayRows = () => {
    const state = pickerState;
    if (!state || state.stage !== "model") {
      return { rows: [] as Array<{ kind: "header" | "option"; text: string }>, optionCount: 0 };
    }

    const options = buildModelOptions();
    const rows: Array<{ kind: "header" | "option"; text: string }> = [];
    let currentProvider: string | null = null;
    let selectableIndex = 0;
    let selectedRowIndex = 0;

    for (const option of options) {
      if (option.provider !== currentProvider) {
        currentProvider = option.provider;
        rows.push({ kind: "header", text: `[${currentProvider}]` });
      }
      if (selectableIndex === state.optionIndex) selectedRowIndex = rows.length;
      const prefix = selectableIndex === state.optionIndex ? ">" : " ";
      const meta = option.meta ? ` (${option.meta})` : "";
      rows.push({ kind: "option", text: `${prefix} ${truncateInline(option.label, 34)}${truncateInline(meta, 16)}` });
      selectableIndex += 1;
    }

    const maxVisible = 10;
    const windowStart = Math.max(0, selectedRowIndex - Math.floor(maxVisible / 2));
    const visibleRows = rows.slice(windowStart, windowStart + maxVisible);
    return {
      rows: visibleRows,
      optionCount: options.length,
    };
  };

  const buildEffortOptions = () => {
    return [
      { value: "default", label: "default reasoning" },
      { value: "medium", label: "medium" },
      { value: "high", label: "high" },
      { value: "low", label: "low" },
    ] satisfies Array<{ value: ReasoningEffort; label: string }>;
  };

  const openSinglePicker = () => {
    const current = getCurrentAgent();
    if (!current) return;
    pickerState = {
      mode: "single",
      stage: "model",
      targetSlug: current.slug,
      query: "",
      optionIndex: 0,
    };
  };

  const openAllPicker = () => {
    pickerState = {
      mode: "all",
      stage: "model",
      query: "",
      optionIndex: 0,
    };
  };

  const closePicker = () => {
    pickerState = null;
  };

  const buildPickerBoxLines = (current: AgentConfig | undefined): string[] => {
    const contentLines = renderPickerLines(current);
    if (contentLines.length === 0) return [];
    const innerWidth = Math.min(
      PICKER_MAX_INNER_WIDTH,
      Math.max(26, ...contentLines.map((line) => line.length)),
    );
    const pad = (text: string) => `${text}${" ".repeat(Math.max(0, innerWidth - text.length))}`;
    return [
      `┌${"─".repeat(innerWidth + 2)}┐`,
      ...contentLines.map((line) => `│ ${pad(truncateInline(line, innerWidth))} │`),
      `└${"─".repeat(innerWidth + 2)}┘`,
    ];
  };

  const applyPickerChoice = () => {
    const state = pickerState;
    if (!state) return;
    if (state.stage === "model") {
      const options = buildModelOptions();
      const choice = options[Math.max(0, Math.min(state.optionIndex, options.length - 1))];
      if (!choice) return;
      if (choice.value === "__reset__") {
        if (state.mode === "all") {
          for (const agent of agents) {
            agent.model = initialModels.get(agent.slug);
          }
        } else if (state.targetSlug) {
          const target = agents.find((agent) => agent.slug === state.targetSlug);
          if (target) target.model = initialModels.get(target.slug);
        }
        closePicker();
        return;
      }
      pickerState = {
        ...state,
        stage: "effort",
        optionIndex: 0,
        draftBase: choice.value,
      };
      return;
    }

    const options = buildEffortOptions();
    const choice = options[Math.max(0, Math.min(state.optionIndex, options.length - 1))];
    if (!choice || !state.draftBase) return;
    const modelSpec = formatModelSpec(state.draftBase, choice.value);
    if (state.mode === "all") {
      for (const agent of agents) {
        agent.model = modelSpec;
      }
    } else if (state.targetSlug) {
      const target = agents.find((agent) => agent.slug === state.targetSlug);
      if (target) target.model = modelSpec;
    }
    closePicker();
  };

  const renderPickerLines = (current: AgentConfig | undefined): string[] => {
    const state = pickerState;
    if (!state) return [];
    const title = state.mode === "all"
      ? "All Members Model"
      : `${current?.name ?? "Member"} Model`;
    if (state.stage === "model") {
      const display = buildModelDisplayRows();
      return [
        title,
        `Search: ${state.query || "type model or provider"}`,
        ...display.rows.map((row) => row.kind === "header" ? row.text : row.text),
        "Enter select  Esc close",
      ];
    }

    const effortOptions = buildEffortOptions();
    return [
      title,
      `Base: ${truncateInline(state.draftBase ?? "", 44)}`,
      ...effortOptions.map((option, index) => {
        const prefix = index === state.optionIndex ? ">" : " ";
        return `${prefix} ${option.label}`;
      }),
      "Enter apply  Esc back",
    ];
  };

  const refresh = (statusMessage?: string) => {
    const current = agents[selectedIndex];
    const selectableCount = Math.max(0, selected.size - lockedSlugs.length);
    const limitLabel = maxSelectable && maxSelectable > 0
      ? `${selectableCount}/${maxSelectable} selectable`
      : `${selectableCount} selectable`;
    titleText.setText(theme.bold(theme.fg("accent", "Edit Board Roster")));
    summaryText.setText(
      theme.fg(
        "dim",
        `${selected.size} total selected ${theme.fg("muted", `(${limitLabel})`)}${current ? `  |  Focus: ${current.name} [${truncateInline(resolveModelLabel(current.model), 34)}]` : ""}`,
      ),
    );
    statusText.setText(
      statusMessage
        ? theme.fg("warning", statusMessage)
        : current
          ? theme.fg(
              "muted",
              `Primary model: ${resolveModelLabel(current.model)}${current.modelAlt ? `  |  Fallback: ${resolveModelLabel(current.modelAlt)}` : ""}`,
            )
          : "",
    );
    rationaleText.setText(theme.fg("muted", `CEO rationale: ${truncateInline(rationale ?? "", 120)}`));

    listContainer.clear();
    const boxLines = pickerState ? buildPickerBoxLines(current) : [];
    const pickerWidth = boxLines.length > 0 ? Math.max(...boxLines.map((line) => line.length)) : 0;
    const rowWidth = pickerState
      ? Math.max(28, MODAL_INNER_WIDTH - pickerWidth - PICKER_GUTTER)
      : MODAL_INNER_WIDTH;
    const rosterRows = agents.map((agent, index) => {
      const isCurrent = index === selectedIndex;
      const isSelected = selected.has(agent.slug);
      const prefix = isCurrent ? "→ " : "  ";
      const checkbox = isSelected ? "[x]" : "[ ]";
      const model = truncateInline(resolveModelLabel(agent.model), 34);
      const description = truncateInline(agent.description, 34);
      const base = `${checkbox} ${agent.name} [${model}]${description ? ` - ${description}` : ""}`;
      const raw = `${prefix}${truncateInline(base, Math.max(16, rowWidth - prefix.length))}`;
      return {
        raw,
        display: isCurrent ? theme.bold(theme.fg("accent", raw)) : raw,
      };
    });

    if (pickerState) {
      const boxStart = selectedIndex;
      const totalRows = Math.max(rosterRows.length, boxStart + boxLines.length);
      for (let rowIndex = 0; rowIndex < totalRows; rowIndex += 1) {
        const row = rosterRows[rowIndex];
        const boxLine = rowIndex >= boxStart && rowIndex < boxStart + boxLines.length
          ? boxLines[rowIndex - boxStart]
          : null;

        if (!boxLine) {
          if (row) listContainer.addChild(new Text(row.display, 1, 0));
          continue;
        }

        const leftRaw = truncateInline(row?.raw ?? "", rowWidth).padEnd(rowWidth);
        const leftDisplay = row && rowIndex === selectedIndex
          ? theme.bold(theme.fg("accent", leftRaw))
          : leftRaw;
        listContainer.addChild(new Text(`${leftDisplay}${" ".repeat(PICKER_GUTTER)}${theme.fg("muted", boxLine)}`, 1, 0));
      }
      root.invalidate();
      tui.requestRender();
      return;
    }

    for (let index = 0; index < agents.length; index += 1) {
      listContainer.addChild(new Text(rosterRows[index].display, 1, 0));
    }

    root.invalidate();
    tui.requestRender();
  };

  const toggleCurrent = () => {
    const current = agents[selectedIndex];
    if (!current) return;
    if (lockedSlugs.includes(current.slug)) {
      refresh(`${current.name} is always included.`);
      return;
    }
    if (selected.has(current.slug)) selected.delete(current.slug);
    else {
      const selectableCount = selected.size - lockedSlugs.length;
      if (maxSelectable && maxSelectable > 0 && selectableCount >= maxSelectable) {
        refresh(`Roster cap reached: choose up to ${maxSelectable} non-CEO member${maxSelectable === 1 ? "" : "s"}.`);
        return;
      }
      selected.add(current.slug);
    }
  };

  const reset = () => {
    selected.clear();
    for (const slug of selectedSlugs) selected.add(slug);
    for (const agent of agents) {
      agent.model = initialModels.get(agent.slug);
    }
  };

  const finish = () => {
    if (selected.size === 0) {
      refresh("Select at least one board member before continuing.");
      return;
    }
    onDone(agents.filter((agent) => selected.has(agent.slug)).map((agent) => agent.slug));
  };

  root.addChild(new DynamicBorder());
  root.addChild(new Spacer(1));
  root.addChild(titleText);
  root.addChild(summaryText);
  root.addChild(rationaleText);
  root.addChild(new Spacer(1));
  root.addChild(listContainer);
  root.addChild(new Spacer(1));
  root.addChild(statusText);
  root.addChild(new Spacer(1));
  root.addChild(new Text("Space toggle  Right/M model  A all models  Enter continue  R reset  Esc cancel", 1, 0));
  if (maxSelectable && maxSelectable > 0) {
    root.addChild(new Text(`Cap: choose up to ${maxSelectable} non-CEO member${maxSelectable === 1 ? "" : "s"}.`, 1, 0));
    root.addChild(new Spacer(1));
  }
  root.addChild(new Spacer(1));
  root.addChild(new DynamicBorder());

  root.handleInput = (keyData: string) => {
    if (pickerState) {
      if (keybindings.matches(keyData, "tui.select.up") || keyData === "k") {
        pickerState.optionIndex = Math.max(0, pickerState.optionIndex - 1);
        refresh();
        return;
      }
      if (keybindings.matches(keyData, "tui.select.down") || keyData === "j") {
        const optionsLength = pickerState.stage === "model" ? buildModelDisplayRows().optionCount : buildEffortOptions().length;
        pickerState.optionIndex = Math.min(Math.max(0, optionsLength - 1), pickerState.optionIndex + 1);
        refresh();
        return;
      }
      if (keybindings.matches(keyData, "tui.select.confirm") || keyData === "\n") {
        applyPickerChoice();
        refresh();
        return;
      }
      if (keybindings.matches(keyData, "tui.select.cancel")) {
        if (pickerState.stage === "effort") {
          pickerState = {
            ...pickerState,
            stage: "model",
            optionIndex: 0,
          };
        } else {
          closePicker();
        }
        refresh();
        return;
      }
      if (pickerState.stage === "model" && (keyData === "\u007f" || keyData === "\b")) {
        pickerState.query = pickerState.query.slice(0, -1);
        pickerState.optionIndex = 0;
        refresh();
        return;
      }
      if (pickerState.stage === "model" && /^[ -~]$/.test(keyData)) {
        pickerState.query += keyData;
        pickerState.optionIndex = 0;
        refresh();
        return;
      }
    }

    if (keybindings.matches(keyData, "tui.select.up") || keyData === "k") {
      selectedIndex = Math.max(0, selectedIndex - 1);
      refresh();
      return;
    }
    if (keybindings.matches(keyData, "tui.select.down") || keyData === "j") {
      selectedIndex = Math.min(agents.length - 1, selectedIndex + 1);
      refresh();
      return;
    }
    if (keyData === " ") {
      toggleCurrent();
      refresh();
      return;
    }
    if (isRightArrowKey(keyData, keybindings) || keyData === "l" || keyData === "m" || keyData === "M") {
      openSinglePicker();
      refresh();
      return;
    }
    if (keyData === "a" || keyData === "A") {
      openAllPicker();
      refresh();
      return;
    }
    if (keybindings.matches(keyData, "tui.select.confirm") || keyData === "\n") {
      finish();
      return;
    }
    if (keybindings.matches(keyData, "tui.select.cancel")) {
      onDone(undefined);
      return;
    }
    if (keyData === "r" || keyData === "R") {
      reset();
      refresh();
    }
  };

  refresh();
  return root;
}

function createRosterApprovalComponent(
  tui: any,
  theme: any,
  keybindings: any,
  proposed: AgentConfig[],
  rationale: string,
  onDone: (result: "Yes" | "Edit roster" | "No" | undefined) => void,
): any {
  const root: any = new Container();
  const titleText: any = new Text("", 1, 0);
  const rosterText: any = new Text("", 1, 0);
  const rationaleText: any = new Text("", 1, 0);
  const listContainer: any = new Container();
  const statusText: any = new Text("", 1, 0);
  const options = ["Yes", "Edit roster", "No"] as const;
  let selectedIndex = 0;

  const refresh = (statusMessage?: string) => {
    titleText.setText(theme.bold(theme.fg("accent", "Approve Board Roster?")));
    rosterText.setText(theme.fg("muted", `CEO selected: ${proposed.map((agent) => agent.name).join(", ")}`));
    rationaleText.setText(theme.fg("muted", `Rationale: ${truncateInline(rationale, 120)}`));
    statusText.setText(statusMessage ? theme.fg("warning", statusMessage) : "");

    listContainer.clear();
    for (let index = 0; index < options.length; index += 1) {
      const option = options[index];
      const isCurrent = index === selectedIndex;
      const prefix = isCurrent ? theme.fg("accent", "→ ") : "  ";
      const line = isCurrent
        ? `${prefix}${theme.bold(theme.fg("accent", option))}`
        : `  ${option}`;
      listContainer.addChild(new Text(line, 1, 0));
    }

    root.invalidate();
    tui.requestRender();
  };

  root.addChild(new DynamicBorder());
  root.addChild(new Spacer(1));
  root.addChild(titleText);
  root.addChild(rosterText);
  root.addChild(rationaleText);
  root.addChild(new Spacer(1));
  root.addChild(listContainer);
  root.addChild(new Spacer(1));
  root.addChild(statusText);
  root.addChild(new Spacer(1));
  root.addChild(new Text("Y yes  N no  E edit roster  Enter select  Esc cancel", 1, 0));
  root.addChild(new Spacer(1));
  root.addChild(new DynamicBorder());

  root.handleInput = (keyData: string) => {
    if (keybindings.matches(keyData, "tui.select.up") || keyData === "k") {
      selectedIndex = Math.max(0, selectedIndex - 1);
      refresh();
      return;
    }
    if (keybindings.matches(keyData, "tui.select.down") || keyData === "j") {
      selectedIndex = Math.min(options.length - 1, selectedIndex + 1);
      refresh();
      return;
    }
    if (keyData === "y" || keyData === "Y") {
      onDone("Yes");
      return;
    }
    if (keyData === "n" || keyData === "N") {
      onDone("No");
      return;
    }
    if (keyData === "e" || keyData === "E") {
      onDone("Edit roster");
      return;
    }
    if (keybindings.matches(keyData, "tui.select.confirm") || keyData === "\n") {
      onDone(options[selectedIndex]);
      return;
    }
    if (keybindings.matches(keyData, "tui.select.cancel")) {
      onDone(undefined);
    }
  };

  refresh();
  return root;
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
    ctx.ui.setWidget("boardroom", (_tui: unknown, theme: unknown) => ({
      render: (width: number) => buildDashboardWidgetLines(snapshot, theme as any, width),
      invalidate: () => {},
    }));
  };

  const setCloseoutWidget = (
    ctx: { ui: ExtensionAPI["commands"][number] extends never ? never : any },
    result: MeetingResult,
  ) => {
    const theme = ctx.ui.theme;
    ctx.ui.setWidget("boardroom", renderWidgetLines(buildThemedCloseoutLines(result, theme)));
  };

  const setNarrationWidget = (
    ctx: { ui: ExtensionAPI["commands"][number] extends never ? never : any },
    state: NarrationDisplayState,
  ) => {
    const theme = ctx.ui.theme;
    ctx.ui.setWidget("boardroom", renderWidgetLines(buildNarrationWidgetLines(state, theme)));
  };

  const withLiveElapsed = (
    snapshot: MeetingProgressSnapshot,
    startedAtMs: number,
    agentSnapshots: AgentRuntimeUpdate[],
    pausedAtMs: number | null,
    pausedTotalMs: number,
  ): MeetingProgressSnapshot => {
    const mergedAgents = agentSnapshots.length > 0 ? [...agentSnapshots] : snapshot.agents;
    const liveBudgetUsed = mergedAgents.reduce((sum, agent) => sum + agent.totalCost, 0);
    return {
      ...snapshot,
      budgetUsed: Math.max(snapshot.budgetUsed, liveBudgetUsed),
      elapsedMinutes: Math.max(
        snapshot.elapsedMinutes,
        (((pausedAtMs ?? Date.now()) - startedAtMs - pausedTotalMs) / 60_000),
      ),
      agents: mergedAgents,
    };
  };

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
    const snapshot = withLiveElapsed(
      meeting.lastSnapshot,
      meeting.startedAt,
      meeting.agentSnapshots,
      meeting.pausedAt,
      meeting.pausedTotalMs,
    );
    ctx.ui.setStatus("boardroom", formatDashboardStatus(snapshot, theme));
    setBoardroomWidget(ctx, snapshot);
  };

  const pauseMeetingUi = (
    ctx: { hasUI: boolean; ui: ExtensionAPI["commands"][number] extends never ? never : any },
  ) => {
    if (!activeMeeting || activeMeeting.pausedAt !== null) return;
    activeMeeting.pausedAt = Date.now();
    clearActiveMeetingTimer();
    renderMeetingUi(ctx, activeMeeting);
  };

  const resumeMeetingUi = (
    ctx: { hasUI: boolean; ui: ExtensionAPI["commands"][number] extends never ? never : any },
  ) => {
    if (!activeMeeting || activeMeeting.pausedAt === null) return;
    activeMeeting.pausedTotalMs += Date.now() - activeMeeting.pausedAt;
    activeMeeting.pausedAt = null;
    renderMeetingUi(ctx, activeMeeting);
    if (ctx.hasUI) {
      clearActiveMeetingTimer();
      activeMeetingTimer = setInterval(() => renderMeetingUi(ctx, activeMeeting), 1000);
    }
  };

  const editRosterSelection = async (
    ctx: { ui: ExtensionAPI["commands"][number] extends never ? never : any },
    ceo: AgentConfig,
    proposed: AgentConfig[],
    available: AgentConfig[],
    maxRosterSize: number | undefined,
    rationale: string,
  ): Promise<string[] | undefined> => {
    let selectedRosterSlugs = proposed.map((agent) => agent.slug);
    const orderedAgents = [ceo, ...orderRosterSelection(available, selectedRosterSlugs)];
    const result = await ctx.ui.custom(
      (tui, theme, keybindings, done) => (
        createRosterEditorComponent(
          tui,
          theme,
          keybindings,
          orderedAgents,
          [ceo.slug, ...selectedRosterSlugs],
          [ceo.slug],
          maxRosterSize,
          rationale,
          done,
        )
      ),
      {
        overlay: true,
        overlayOptions: {
          width: 110,
          maxHeight: "80%",
          anchor: "center",
          margin: 1,
        },
      },
    ) as RosterEditorResult;
    if (result === undefined) return undefined;
    selectedRosterSlugs = result.filter((slug) => slug !== ceo.slug);
    return selectedRosterSlugs;
  };

  const confirmRosterDecision = async (
    ctx: { ui: ExtensionAPI["commands"][number] extends never ? never : any },
    proposed: AgentConfig[],
    rationale: string,
  ): Promise<"Yes" | "Edit roster" | "No" | undefined> => {
    return ctx.ui.custom(
      (tui, theme, keybindings, done) => (
        createRosterApprovalComponent(tui, theme, keybindings, proposed, rationale, done)
      ),
      {
        overlay: true,
        overlayOptions: {
          width: 78,
          maxHeight: "70%",
          anchor: "center",
          margin: 1,
        },
      },
    );
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
      const ceo = agents.find((agent) => agent.slug === "ceo");
      if (!ceo) {
        ctx.ui.notify("CEO agent not found in agents/executive-board/", "error");
        return;
      }
      const selectedCeoModel = await chooseAgentModel(
        ctx,
        agents,
        ceo,
        ceo.model,
        "Select CEO model:",
      );
      if (selectedCeoModel === null) return;
      ceo.model = selectedCeoModel;

      const confirmMsg = [
        `Brief: ${brief.title}`,
        `Mode: ${mode}`,
        `Constraints: ${constraintsName} ($${constraintValues.budget} / ${constraintValues.time_limit_minutes}min / ${constraintValues.max_debate_rounds} rounds)`,
        `CEO Model: ${resolveModelLabel(ceo.model)}`,
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
        pausedAt: null,
        pausedTotalMs: 0,
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
            onConfirmRoster: async (proposed, available, rationale): Promise<RosterConfirmation> => {
              if (!ctx.hasUI) return { action: "approve" };
              pauseMeetingUi(ctx);
              try {
                while (true) {
                  const choice = await confirmRosterDecision(ctx, proposed, rationale);
                  if (choice === undefined || choice === "No") {
                    return { action: "reject" };
                  }
                  if (choice === "Yes") {
                    return { action: "approve" };
                  }

                  const edited = await editRosterSelection(
                    ctx,
                    ceo,
                    proposed,
                    available,
                    constraintValues.max_roster_size,
                    rationale,
                  );
                  if (edited === undefined) continue;
                  return { action: "edit", roster: edited };
                }
              } finally {
                resumeMeetingUi(ctx);
              }
            },
            signal: abortController.signal,
          },
        );

        clearActiveMeetingTimer();
        activeMeeting = null;

        const humanSummary = await generateHumanReadableSummary(result.memoPath, path.dirname(result.memoPath));
        if (humanSummary.ok) {
          result.summaryPath = humanSummary.summaryPath;
          result.summaryText = humanSummary.summaryText;
        } else if (ctx.hasUI) {
          ctx.ui.notify(`Human-readable summary failed: ${humanSummary.error}`, "warning");
        }

        if (ctx.hasUI) {
          setCloseoutWidget(ctx, result);
          ctx.ui.setStatus("boardroom", undefined);
        }

        ctx.ui.notify(buildCloseoutSummary(result), "info");

        await runPostMeetingActions(result, {
          hasUI: ctx.hasUI,
          confirm: (title, body) => ctx.ui.confirm(title, body),
          notify: (msg, type) => ctx.ui.notify(msg, type),
          setNarrationState: (state) => {
            if (!ctx.hasUI) return;
            if (state) {
              setNarrationWidget(ctx, state);
              ctx.ui.setStatus("boardroom", state.phase === "generating" ? "Narration generating..." : "Narration playing...");
            } else {
              setCloseoutWidget(ctx, result);
              ctx.ui.setStatus("boardroom", undefined);
            }
          },
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
          lines.push(
            `  ${agent.name} [${agent.modelLabel ?? "default"}]: ${agent.status} (${agent.turns} turns, ${cost}${tokens ? `, ${tokens}` : ""})`,
          );
          if (agent.error) lines.push(`    Error: ${agent.error}`);
        }
      }

      if (activeMeeting.lastSnapshot) {
        const liveSnapshot = withLiveElapsed(
          activeMeeting.lastSnapshot,
          activeMeeting.startedAt,
          activeMeeting.agentSnapshots,
          activeMeeting.pausedAt,
          activeMeeting.pausedTotalMs,
        );
        lines.push("");
        lines.push(...buildPlainDashboardLines(liveSnapshot));
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
        const snapshot = withLiveElapsed(lastSnapshot, startedAtMs, agentSnapshots, null, 0);
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
          onConfirmRoster: async () => ({ action: "approve" }),
          signal,
        });
      } finally {
        if (toolUiTimer) clearInterval(toolUiTimer);
      }

      ctx.ui.setStatus("boardroom", undefined);
      const humanSummary = await generateHumanReadableSummary(result.memoPath, path.dirname(result.memoPath));
      if (humanSummary.ok) {
        result.summaryPath = humanSummary.summaryPath;
        result.summaryText = humanSummary.summaryText;
      }
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
          summaryPath: result.summaryPath,
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
