import * as path from "node:path";
import * as fs from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import { DynamicBorder, isToolCallEventType, type ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Type } from "@sinclair/typebox";
import { StringEnum } from "@mariozechner/pi-ai";
import { Container, Spacer, Text } from "@mariozechner/pi-tui";
import { discoverAgents } from "./agents.js";
import { parseBrief, listBriefs } from "./brief-parser.js";
import { loadConfig, resolveConstraints } from "./config.js";
import { runFreeformMeeting, runStructuredMeeting } from "./meeting.js";
import { runFreeformMessagingMeeting, runStructuredMessagingMeeting } from "./messaging-meeting.js";
import { getBoardroomExecutiveWritePolicy, isMutatingBashCommand } from "./runtime.js";
import type { MeetingCallbacks, MeetingResult, RosterConfirmation } from "./meeting.js";
import type { AgentConfig, AgentRuntimeUpdate, MeetingMode, MeetingProgressSnapshot, MessagingMode } from "./types.js";
import { listPastMeetings } from "./artifacts.js";
import { formatDashboardStatus, buildDashboardWidgetLines, buildPlainDashboardLines } from "./ui.js";
import {
  buildCloseoutSummary,
  findNarrationActiveRange,
  buildNarrationWidgetLines,
  buildThemedCloseoutLines,
  generateHumanReadableSummary,
  NarrationPlaybackController,
  runPostMeetingActions,
} from "./closeout.js";
import type {
  NarrationAlignment,
  NarrationDisplayState,
  NarrationPlaybackRequest,
  NarrationPlaybackResult,
} from "./closeout.js";

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

interface ActiveNarrationState {
  request: NarrationPlaybackRequest;
  state: NarrationDisplayState;
  controller: NarrationPlaybackController | null;
  fallbackProcess: ReturnType<typeof spawn> | null;
  ui: ExtensionAPI["commands"][number] extends never ? never : any;
}

type RosterEditorResult = string[] | undefined;

type ThinkingLevel = "off" | "minimal" | "low" | "medium" | "high" | "xhigh";
type ReasoningEffort = "default" | ThinkingLevel;
type ModelPickerMode = "single" | "all";
type ModelPickerStage = "model" | "effort";
type EffortOption = { value: ReasoningEffort; label: string };

interface PiModelCatalogEntry {
  provider: string;
  model: string;
  context?: string;
  maxOut?: string;
  thinking?: string;
  images?: string;
}

let piModelCatalogCache: PiModelCatalogEntry[] | null = null;
let piScopedModelPatternsCache: string[] | undefined;
const thinkingLevelsCache = new Map<string, Promise<ThinkingLevel[]>>();
const THINKING_LEVEL_ORDER: ThinkingLevel[] = ["off", "minimal", "low", "medium", "high", "xhigh"];

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

function resolveToolPath(cwd: string, maybePath: string | undefined): string | undefined {
  if (!maybePath?.trim()) return undefined;
  return path.isAbsolute(maybePath) ? path.normalize(maybePath) : path.resolve(cwd, maybePath);
}

function isPathWithin(targetPath: string | undefined, parentPath: string | undefined): boolean {
  if (!targetPath || !parentPath) return false;
  const relative = path.relative(parentPath, targetPath);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function parseModelSpec(model: string | undefined): { base: string | undefined; effort: ReasoningEffort } {
  const resolved = resolveModelLabel(model);
  if (!resolved || resolved === "default") return { base: undefined, effort: "default" };
  const match = resolved.match(/^(.*?)(?::(off|minimal|low|medium|high|xhigh))$/);
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

function formatEffortLabel(effort: ReasoningEffort): string {
  return effort === "default" ? "Pi default (clamped)" : effort;
}

function normalizeThinkingLevel(value: unknown): ThinkingLevel | undefined {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim().toLowerCase();
  return THINKING_LEVEL_ORDER.find((level) => level === normalized);
}

function parsePiModelCatalog(output: string): PiModelCatalogEntry[] {
  const lines = output
    .split("\n")
    .map((line) => line.trimEnd())
    .filter(Boolean);
  const headerIndex = lines.findIndex((line) => /^provider\s+model(\s+|$)/i.test(line.trim()));
  if (headerIndex === -1 || lines.length <= headerIndex + 1) return [];

  const entries: PiModelCatalogEntry[] = [];
  for (const line of lines.slice(headerIndex + 1)) {
    if (/^(warning:|failed to load extension)/i.test(line.trim())) continue;
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
    const result = spawnSync("pi", ["--list-models"], {
      encoding: "utf-8",
      timeout: 10_000,
      stdio: ["ignore", "pipe", "pipe"],
    });
    const combinedOutput = `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim();
    piModelCatalogCache = parsePiModelCatalog(combinedOutput);
  } catch {
    piModelCatalogCache = [];
  }
  return piModelCatalogCache;
}

function getPiScopedModelPatterns(): string[] {
  if (piScopedModelPatternsCache !== undefined) return piScopedModelPatternsCache;

  const agentDir = process.env.PI_CODING_AGENT_DIR
    ?? path.join(process.env.HOME ?? "", ".pi", "agent");
  const settingsPath = path.join(agentDir, "settings.json");
  if (!settingsPath || !fs.existsSync(settingsPath)) {
    piScopedModelPatternsCache = [];
    return piScopedModelPatternsCache;
  }

  try {
    const raw = fs.readFileSync(settingsPath, "utf-8");
    const parsed = JSON.parse(raw) as {
      enabledModels?: unknown;
      scopedModels?: unknown;
      ["scoped-models"]?: unknown;
    };
    const candidates = [
      parsed.enabledModels,
      parsed.scopedModels,
      parsed["scoped-models"],
    ];
    for (const candidate of candidates) {
      if (!Array.isArray(candidate)) continue;
      piScopedModelPatternsCache = candidate
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean);
      return piScopedModelPatternsCache;
    }
  } catch {
    // Ignore malformed settings and fall back to the full catalog.
  }

  piScopedModelPatternsCache = [];
  return piScopedModelPatternsCache;
}

function globPatternToRegExp(pattern: string): RegExp {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escaped.replace(/\*/g, ".*").replace(/\?/g, ".")}$`, "i");
}

function modelMatchesScopedPattern(modelId: string, pattern: string): boolean {
  const normalizedPattern = pattern.trim();
  if (!normalizedPattern) return false;
  if (!/[*?]/.test(normalizedPattern)) return modelId.toLowerCase() === normalizedPattern.toLowerCase();
  return globPatternToRegExp(normalizedPattern).test(modelId);
}

function getVisiblePiModelCatalog(): PiModelCatalogEntry[] {
  const catalog = getPiModelCatalog();
  const scopedPatterns = getPiScopedModelPatterns();
  if (scopedPatterns.length === 0) return catalog;
  return catalog.filter((entry) =>
    scopedPatterns.some((pattern) => modelMatchesScopedPattern(`${entry.provider}/${entry.model}`, pattern)),
  );
}

function getModelCatalogSourceLabel(): string {
  return getPiScopedModelPatterns().length > 0
    ? "Pi scoped model catalog"
    : "live Pi model catalog";
}

function getCatalogThinkingFallback(baseModel: string | undefined): ThinkingLevel[] {
  if (!baseModel) return ["off"];
  const catalogMatch = getVisiblePiModelCatalog().find((entry) => `${entry.provider}/${entry.model}` === baseModel);
  if (!catalogMatch) return ["off"];
  return catalogMatch.thinking === "yes" ? [...THINKING_LEVEL_ORDER] : ["off"];
}

async function getAvailableThinkingLevels(baseModel: string | undefined): Promise<ThinkingLevel[]> {
  const normalizedBase = parseModelSpec(baseModel).base;
  if (!normalizedBase) return ["off"];
  const cached = thinkingLevelsCache.get(normalizedBase);
  if (cached) return cached;

  const probePromise = (async () => {
    const fallback = getCatalogThinkingFallback(normalizedBase);
    try {
      const piSdk = await import("@mariozechner/pi-coding-agent");
      const agentDir = piSdk.getAgentDir();
      const diskSettings = piSdk.SettingsManager.create(process.cwd(), agentDir);
      const probeSettings = piSdk.SettingsManager.inMemory(diskSettings.getGlobalSettings());
      probeSettings.applyOverrides(diskSettings.getProjectSettings());

      const { session } = await piSdk.createAgentSession({
        cwd: process.cwd(),
        agentDir,
        settingsManager: probeSettings,
        sessionManager: piSdk.SessionManager.inMemory(),
      });

      try {
        const [provider, ...modelParts] = normalizedBase.split("/");
        const modelId = modelParts.join("/");
        const model = session.modelRegistry.find(provider, modelId);
        if (!model) return fallback;
        await session.setModel(model);
        const levels = session.getAvailableThinkingLevels()
          .map(normalizeThinkingLevel)
          .filter((level): level is ThinkingLevel => !!level);
        return levels.length > 0 ? levels : fallback;
      } finally {
        session.dispose();
      }
    } catch {
      return fallback;
    }
  })();

  thinkingLevelsCache.set(normalizedBase, probePromise);
  return probePromise;
}

function orderEffortOptions(options: EffortOption[], preferred: ReasoningEffort): EffortOption[] {
  const preferredLabel = formatEffortLabel(preferred);
  const preferredOption = options.find((option) => option.label === preferredLabel);
  if (!preferredOption) return options;
  return [
    preferredOption,
    ...options.filter((option) => option.label !== preferredLabel),
  ];
}

async function getEffortOptionsForModel(baseModel: string | undefined): Promise<EffortOption[]> {
  const availableLevels = await getAvailableThinkingLevels(baseModel);
  return [
    { value: "default", label: formatEffortLabel("default") },
    ...THINKING_LEVEL_ORDER
      .filter((level) => availableLevels.includes(level))
      .map((level) => ({ value: level, label: formatEffortLabel(level) })),
  ];
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

  for (const entry of getVisiblePiModelCatalog()) {
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

function formatSelectableModelOption(
  option: { label: string; meta?: string },
): string {
  return option.meta ? `${option.label} (${option.meta})` : option.label;
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
  const baseChoices = buildAvailableModelOptions(allAgents, agent.model);
  const defaultLabel = defaultModel
    ? `Use default (${resolveModelLabel(defaultModel)})`
    : "Use Pi default";
  const currentBase = current.base;
  const orderedBases = currentBase
    ? [
        ...baseChoices.filter((option) => option.value === currentBase),
        ...baseChoices.filter((option) => option.value !== currentBase),
      ]
    : baseChoices;
  const modelChoiceLabels = orderedBases.map(formatSelectableModelOption);
  const modelChoiceByLabel = new Map(
    orderedBases.map((option) => [formatSelectableModelOption(option), option.value]),
  );
  const baseChoice = await ctx.ui.select(
    [
      title,
      "",
      `Current: ${resolveModelLabel(agent.model)}`,
      agent.modelAlt ? `Fallback: ${resolveModelLabel(agent.modelAlt)}` : "Fallback: none",
      `Source: ${getModelCatalogSourceLabel()}. Type to filter provider, model, or context.`,
    ].join("\n"),
    [defaultLabel, ...modelChoiceLabels],
  );
  if (baseChoice === undefined) return null;
  if (baseChoice === defaultLabel) return defaultModel;
  const selectedBase = modelChoiceByLabel.get(baseChoice);
  if (!selectedBase) return null;

  const effortOptions = orderEffortOptions(
    await getEffortOptionsForModel(selectedBase),
    current.effort,
  );
  const effortChoice = await ctx.ui.select(
    [
      `Reasoning effort for ${agent.name}`,
      "",
      `Model: ${selectedBase}`,
      "Choose the actual Pi-supported effort suffix for this model.",
    ].join("\n"),
    effortOptions.map((option) => option.label),
  );
  if (effortChoice === undefined) return null;
  const effort = effortOptions.find((option) => option.label === effortChoice)?.value;
  if (!effort) return null;
  return formatModelSpec(selectedBase, effort) ?? null;
}

async function chooseSharedModel(
  ctx: { ui: ExtensionAPI["commands"][number] extends never ? never : any },
  allAgents: AgentConfig[],
  currentModels: Array<string | undefined>,
): Promise<string | "reset-defaults" | null> {
  const uniqueCurrent = Array.from(new Set(currentModels.map((model) => resolveModelLabel(model))));
  const currentLabel = uniqueCurrent.length === 1 ? uniqueCurrent[0] : "mixed";
  const currentEfforts = Array.from(new Set(currentModels.map((model) => parseModelSpec(model).effort)));
  const currentEffort = currentEfforts.length === 1 ? currentEfforts[0] : "default";
  const baseChoices = buildAvailableModelOptions(allAgents);
  const resetLabel = "Reset all to defaults";
  const modelChoiceLabels = baseChoices.map(formatSelectableModelOption);
  const modelChoiceByLabel = new Map(
    baseChoices.map((option) => [formatSelectableModelOption(option), option.value]),
  );
  const baseChoice = await ctx.ui.select(
    [
      "Choose one model for all listed board members",
      "",
      `Current: ${currentLabel}`,
      `Source: ${getModelCatalogSourceLabel()}. Type to filter provider, model, or context.`,
    ].join("\n"),
    [resetLabel, ...modelChoiceLabels],
  );
  if (baseChoice === undefined) return null;
  if (baseChoice === resetLabel) return "reset-defaults";
  const selectedBase = modelChoiceByLabel.get(baseChoice);
  if (!selectedBase) return null;

  const effortOptions = orderEffortOptions(
    await getEffortOptionsForModel(selectedBase),
    currentEffort,
  );
  const effortChoice = await ctx.ui.select(
    [
      "Reasoning effort for all listed board members",
      "",
      `Model: ${selectedBase}`,
      "Choose the actual Pi-supported effort suffix for this model.",
    ].join("\n"),
    effortOptions.map((option) => option.label),
  );
  if (effortChoice === undefined) return null;
  const effort = effortOptions.find((option) => option.label === effortChoice)?.value;
  if (!effort) return null;
  return formatModelSpec(selectedBase, effort) ?? null;
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
        effortOptions?: EffortOption[];
        effortLoading?: boolean;
        effortError?: string;
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
    if (!pickerState?.effortOptions || pickerState.effortOptions.length === 0) {
      return [{ value: "default", label: formatEffortLabel("default") }] satisfies EffortOption[];
    }
    return pickerState.effortOptions;
  };

  const loadEffortOptionsForPicker = (baseModel: string, preferred: ReasoningEffort) => {
    void getEffortOptionsForModel(baseModel)
      .then((options) => {
        if (!pickerState || pickerState.stage !== "effort" || pickerState.draftBase !== baseModel) return;
        pickerState = {
          ...pickerState,
          effortOptions: orderEffortOptions(options, preferred),
          effortLoading: false,
          effortError: undefined,
          optionIndex: 0,
        };
        refresh();
      })
      .catch((error) => {
        if (!pickerState || pickerState.stage !== "effort" || pickerState.draftBase !== baseModel) return;
        pickerState = {
          ...pickerState,
          effortOptions: [{ value: "default", label: formatEffortLabel("default") }],
          effortLoading: false,
          effortError: error instanceof Error ? error.message : "Could not load thinking levels.",
          optionIndex: 0,
        };
        refresh("Could not probe thinking levels. Falling back to Pi default.");
      });
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
        effortOptions: [{ value: "default", label: formatEffortLabel("default") }],
        effortLoading: true,
        effortError: undefined,
      };
      const preferredEffort = state.mode === "all"
        ? (() => {
            const efforts = Array.from(new Set(
              agents
                .filter((agent) => selected.has(agent.slug))
                .map((agent) => parseModelSpec(agent.model).effort),
            ));
            return efforts.length === 1 ? efforts[0] : "default";
          })()
        : parseModelSpec(agents.find((agent) => agent.slug === state.targetSlug)?.model).effort;
      loadEffortOptionsForPicker(choice.value, preferredEffort);
      return;
    }

    const options = buildEffortOptions();
    if (state.effortLoading) return;
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
    if (state.effortLoading) {
      return [
        title,
        `Base: ${truncateInline(state.draftBase ?? "", 44)}`,
        "Loading actual Pi reasoning levels...",
        "Esc back",
      ];
    }
    return [
      title,
      `Base: ${truncateInline(state.draftBase ?? "", 44)}`,
      ...(state.effortError ? [truncateInline(`Warning: ${state.effortError}`, 44)] : []),
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
    const nonLockedSelectionCount = Array.from(selected).filter((slug) => !lockedSlugs.includes(slug)).length;
    if (nonLockedSelectionCount === 0) {
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
        const optionsLength = pickerState.stage === "model"
          ? buildModelDisplayRows().optionCount
          : (pickerState.effortLoading ? 1 : buildEffortOptions().length);
        pickerState.optionIndex = Math.min(Math.max(0, optionsLength - 1), pickerState.optionIndex + 1);
        refresh();
        return;
      }
      if (keybindings.matches(keyData, "tui.select.confirm") || keyData === "\n") {
        if (pickerState.stage === "effort" && pickerState.effortLoading) return;
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
      refresh();
      return;
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
      reset();
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

function resolveMessagingMode(value: string | undefined): MessagingMode | undefined {
  return value === "threading"
    ? "threading"
    : value === "fanout"
      ? "fanout"
      : undefined;
}

async function runMeeting(
  cwd: string,
  brief: ReturnType<typeof parseBrief>,
  agents: ReturnType<typeof discoverAgents>,
  mode: MeetingMode,
  messagingMode: MessagingMode,
  constraintsName: string,
  constraintValues: ReturnType<typeof resolveConstraints>["values"],
  config: ReturnType<typeof loadConfig>,
  callbacks: MeetingCallbacks,
): Promise<MeetingResult> {
  if (messagingMode === "threading") {
    if (mode === "structured") {
      return runStructuredMessagingMeeting(cwd, brief, agents, constraintsName, constraintValues, config, callbacks);
    }
    return runFreeformMessagingMeeting(cwd, brief, agents, "freeform", constraintsName, constraintValues, config, callbacks);
  }
  if (mode === "structured") {
    return runStructuredMeeting(cwd, brief, agents, constraintsName, constraintValues, config, callbacks);
  }
  return runFreeformMeeting(cwd, brief, agents, "freeform", constraintsName, constraintValues, config, callbacks);
}

export default function (pi: ExtensionAPI) {
  const executiveWritePolicy = getBoardroomExecutiveWritePolicy();
  if (executiveWritePolicy) {
    pi.on("tool_call", async (event, ctx) => {
      if (isToolCallEventType("write", event) || isToolCallEventType("edit", event)) {
        const targetPath = resolveToolPath(ctx.cwd, String(event.input.path ?? ""));
        const allowedScratchpadPath = resolveToolPath(ctx.cwd, executiveWritePolicy.allowedWritePath);
        const briefsDir = resolveToolPath(ctx.cwd, executiveWritePolicy.briefsDir);

        if (isPathWithin(targetPath, briefsDir)) {
          return {
            block: true,
            reason: "Boardroom source briefs are immutable during executive sessions. Return your deliverable in the message body instead.",
          };
        }

        if (!allowedScratchpadPath || targetPath !== allowedScratchpadPath) {
          return {
            block: true,
            reason: `Boardroom executive sessions may only write to ${allowedScratchpadPath ?? "their own scratchpad"}. Use the hidden scratchpad block plus your assistant message instead of file mutation tools.`,
          };
        }
      }

      if (isToolCallEventType("bash", event)) {
        const command = String(event.input.command ?? "");
        if (isMutatingBashCommand(command)) {
          return {
            block: true,
            reason: "Boardroom executive sessions may not mutate files via bash. Use read-only investigation, keep private notes in the scratchpad block, and return the deliverable in your assistant message.",
          };
        }
      }

      return undefined;
    });
  }

  let activeMeeting: ActiveMeetingState | null = null;
  const getWorkingDirectory = (ctx: { cwd?: string }) => ctx.cwd ?? process.cwd();
  let activeMeetingTimer: ReturnType<typeof setInterval> | null = null;
  let activeNarration: ActiveNarrationState | null = null;
  let activeNarrationTimer: ReturnType<typeof setInterval> | null = null;
  let lastCloseoutResult: MeetingResult | null = null;
  const NARRATION_CONTROLS_LABEL = "Controls: Alt+Space pause/resume · Left/Right seek · Home restart · End stop · Esc dismiss · /board-narration ...";

  const stopFallbackNarrationProcess = async (proc: ReturnType<typeof spawn> | null | undefined) => {
    if (!proc || proc.exitCode !== null || proc.signalCode !== null) return;
    await new Promise<void>((resolve) => {
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        resolve();
      };
      proc.once("close", finish);
      try {
        proc.kill("SIGTERM");
      } catch {
        finish();
        return;
      }
      setTimeout(() => {
        if (proc.exitCode === null && proc.signalCode === null) {
          try { proc.kill("SIGKILL"); } catch {}
        }
        finish();
      }, 1000);
    });
  };

  const getWidgetLineBudget = () => {
    const rows = typeof process.stdout?.rows === "number" && Number.isFinite(process.stdout.rows)
      ? process.stdout.rows
      : Number(process.env.LINES ?? 0);
    if (!Number.isFinite(rows) || rows <= 0) return undefined;
    return Math.max(8, Math.floor(rows) - 8);
  };

  const limitWidgetLines = (
    lines: string[],
    maxLines: number | undefined,
    overflowLine = "  ... more hidden",
  ) => {
    if (!maxLines || lines.length <= maxLines) return lines;
    if (maxLines <= 1) return [overflowLine];
    return [...lines.slice(0, maxLines - 1), overflowLine];
  };

  const renderWidgetLines = (lines: string[]) => (_tui: unknown, _theme: unknown) => {
    const container = new Container();
    const cappedLines = limitWidgetLines(lines, getWidgetLineBudget());
    for (const line of cappedLines) {
      container.addChild(new Text(line, 1, 0));
    }
    return container;
  };

  const setBoardroomWidget = (
    ctx: { ui: ExtensionAPI["commands"][number] extends never ? never : any },
    snapshot: MeetingProgressSnapshot,
  ) => {
    ctx.ui.setWidget("boardroom", (_tui: unknown, theme: unknown) => ({
      render: (width: number) => limitWidgetLines(
        buildDashboardWidgetLines(snapshot, theme as any, width),
        getWidgetLineBudget(),
        (theme as any).fg?.("dim", "  ... more hidden") ?? "  ... more hidden",
      ),
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

  const clearNarrationTimer = () => {
    if (activeNarrationTimer) {
      clearInterval(activeNarrationTimer);
      activeNarrationTimer = null;
    }
  };

  const syncNarrationState = (forceFrameAdvance = true) => {
    if (!activeNarration) return;
    const controller = activeNarration.controller;
    const elapsedSeconds = controller?.elapsedSeconds ?? activeNarration.state.elapsedSeconds ?? 0;
    const durationSeconds = controller?.durationSeconds ?? activeNarration.state.durationSeconds;
    const phase = controller
      ? (controller.completed ? "completed" : controller.paused ? "paused" : "playing")
      : activeNarration.state.phase;
    activeNarration.state = {
      ...activeNarration.state,
      phase,
      elapsedSeconds,
      durationSeconds,
      activeRange: phase === "playing"
        ? findNarrationActiveRange(activeNarration.request.summaryText, activeNarration.request.alignment, elapsedSeconds)
        : undefined,
      indicatorFrame: forceFrameAdvance ? activeNarration.state.indicatorFrame + 1 : activeNarration.state.indicatorFrame,
      controlsLabel: NARRATION_CONTROLS_LABEL,
    };
  };

  const renderNarrationUi = () => {
    if (!activeNarration) return;
    syncNarrationState();
    setNarrationWidget({ ui: activeNarration.ui } as any, activeNarration.state);
    const status = activeNarration.state.phase === "playing"
      ? "Narration playing..."
      : activeNarration.state.phase === "paused"
      ? "Narration paused."
      : activeNarration.state.phase === "completed"
      ? "Narration ready."
      : "Narration generating...";
    activeNarration.ui.setStatus("boardroom", status);
  };

  const ensureNarrationTimer = () => {
    clearNarrationTimer();
    if (!activeNarration?.controller || activeNarration.controller.completed) return;
    activeNarrationTimer = setInterval(() => {
      if (!activeNarration) {
        clearNarrationTimer();
        return;
      }
      renderNarrationUi();
      if (activeNarration.controller?.completed) clearNarrationTimer();
    }, 200);
  };

  const dismissNarration = async (ctx?: { ui: ExtensionAPI["commands"][number] extends never ? never : any }) => {
    clearNarrationTimer();
    const narration = activeNarration;
    activeNarration = null;
    if (narration?.controller) {
      await narration.controller.dispose();
    }
    if (narration?.fallbackProcess) {
      await stopFallbackNarrationProcess(narration.fallbackProcess);
    }
    const ui = ctx?.ui ?? narration?.ui;
    if (ui) {
      ui.setStatus("boardroom", undefined);
      if (lastCloseoutResult) {
        setCloseoutWidget({ hasUI: true, ui } as any, lastCloseoutResult);
      } else if (activeMeeting) {
        renderMeetingUi({ hasUI: true, ui } as any, activeMeeting);
      } else {
        ui.setWidget("boardroom", undefined);
      }
    }
  };

  const setPinnedNarrationState = (
    ctx: { ui: ExtensionAPI["commands"][number] extends never ? never : any },
    state: NarrationDisplayState | null,
  ) => {
    if (!state) {
      void dismissNarration(ctx);
      return;
    }
    activeNarration = {
      request: activeNarration?.request ?? {
        audioPath: "",
        summaryText: state.summaryText,
        summaryPath: state.summaryPath,
      },
      state: {
        ...state,
        controlsLabel: state.controlsLabel ?? (state.phase === "generating"
          ? "Generating narration audio..."
          : NARRATION_CONTROLS_LABEL),
      },
      controller: activeNarration?.controller ?? null,
      fallbackProcess: activeNarration?.fallbackProcess ?? null,
      ui: ctx.ui,
    };
    renderNarrationUi();
  };

  const startNarrationPlayback = async (
    ctx: { ui: ExtensionAPI["commands"][number] extends never ? never : any },
    request: NarrationPlaybackRequest,
  ): Promise<NarrationPlaybackResult> => {
    const existingController = activeNarration?.controller;
    if (existingController) {
      await existingController.dispose();
    }
    const existingFallback = activeNarration?.fallbackProcess;
    if (existingFallback) {
      await stopFallbackNarrationProcess(existingFallback);
    }
    const controller = new NarrationPlaybackController(request.audioPath, () => {
      if (!activeNarration) return;
      renderNarrationUi();
      if (activeNarration.controller?.completed) clearNarrationTimer();
    });
    if (!controller.isControllable) {
      const durationSeconds = request.alignment?.characterEndTimesSeconds.at(-1) ?? controller.durationSeconds;
      activeNarration = {
        request,
        state: {
          phase: request.autoplay === false ? "completed" : "playing",
          summaryText: request.summaryText,
          summaryPath: request.summaryPath,
          indicatorFrame: 0,
          elapsedSeconds: 0,
          durationSeconds,
          controlsLabel: request.autoplay === false
            ? "Install mpv for pause/rewind/forward controls. Restart plays with system audio. Dismiss with Escape or a new prompt."
            : "Playback controls require mpv. Dismiss with Escape or a new prompt.",
        },
        controller: null,
        fallbackProcess: null,
        ui: ctx.ui,
      };
      renderNarrationUi();
      if (request.autoplay === false) {
        return { ok: true };
      }
      if (process.platform !== "darwin") {
        return { ok: false, error: "Controllable playback requires mpv on this platform." };
      }

      try {
        const proc = spawn("afplay", [request.audioPath], {
          stdio: ["ignore", "ignore", "ignore"],
        });
        activeNarration.fallbackProcess = proc;
        activeNarration.state = {
          ...activeNarration.state,
          phase: "playing",
          controlsLabel: "Playback controls require mpv. Stop or dismiss to end system playback.",
        };
        renderNarrationUi();
        ensureNarrationTimer();

        const startedAt = Date.now();
        let indicatorFrame = 0;
        const playbackTimer = setInterval(() => {
          if (!activeNarration || activeNarration.request.audioPath !== request.audioPath || activeNarration.fallbackProcess !== proc) {
            clearInterval(playbackTimer);
            return;
          }
          activeNarration.state = {
            ...activeNarration.state,
            phase: "playing",
            indicatorFrame,
            elapsedSeconds: (Date.now() - startedAt) / 1000,
            durationSeconds,
            activeRange: request.alignment
              ? findNarrationActiveRange(
                  request.summaryText,
                  request.alignment,
                  (Date.now() - startedAt) / 1000,
                )
              : undefined,
          };
          indicatorFrame += 1;
          renderNarrationUi();
        }, 200);

        proc.once("close", () => {
          clearInterval(playbackTimer);
          if (!activeNarration || activeNarration.request.audioPath !== request.audioPath || activeNarration.fallbackProcess !== proc) {
            return;
          }
          activeNarration.fallbackProcess = null;
          activeNarration.state = {
            ...activeNarration.state,
            phase: "completed",
            indicatorFrame: 0,
            activeRange: undefined,
            elapsedSeconds: durationSeconds ?? ((Date.now() - startedAt) / 1000),
            durationSeconds,
            controlsLabel: "Restart to play again, or dismiss with Escape or a new prompt.",
          };
          renderNarrationUi();
          clearNarrationTimer();
        });

        proc.once("error", (err) => {
          clearInterval(playbackTimer);
          if (!activeNarration || activeNarration.request.audioPath !== request.audioPath || activeNarration.fallbackProcess !== proc) {
            return;
          }
          activeNarration.fallbackProcess = null;
          activeNarration.state = {
            ...activeNarration.state,
            phase: "completed",
            controlsLabel: "Playback failed. Dismiss with Escape or a new prompt.",
          };
          renderNarrationUi();
          clearNarrationTimer();
          ctx.ui.notify(err.message ?? "Failed to start narration playback", "warning");
        });

        return { ok: true };
      } catch (err: any) {
        return { ok: false, error: err.message ?? "Failed to start fallback playback" };
      }
    }

    activeNarration = {
      request,
      state: {
        phase: request.autoplay === false ? "completed" : "playing",
        summaryText: request.summaryText,
        summaryPath: request.summaryPath,
        indicatorFrame: 0,
        elapsedSeconds: 0,
        durationSeconds: controller.durationSeconds,
        controlsLabel: NARRATION_CONTROLS_LABEL,
      },
      controller: request.autoplay === false ? null : controller,
      fallbackProcess: null,
      ui: ctx.ui,
    };

    if (request.autoplay === false) {
      renderNarrationUi();
      return { ok: true };
    }

    try {
      await controller.start(0, false);
      renderNarrationUi();
      ensureNarrationTimer();
      return { ok: true };
    } catch (err: any) {
      activeNarration.state = {
        ...activeNarration.state,
        phase: "completed",
        controlsLabel: "Playback failed. Dismiss with Escape or a new prompt.",
      };
      renderNarrationUi();
      return { ok: false, error: err.message ?? "Failed to start narration playback" };
    }
  };

  const applyNarrationAction = async (
    action: "pause" | "rewind" | "forward" | "restart" | "stop" | "dismiss",
    ctx: { ui: ExtensionAPI["commands"][number] extends never ? never : any },
  ) => {
    if (!activeNarration) {
      ctx.ui.notify("No active narration.", "info");
      return;
    }
    if (action === "dismiss") {
      await dismissNarration(ctx);
      return;
    }
    if (!activeNarration.request.audioPath) {
      ctx.ui.notify("Narration audio is still being generated.", "info");
      return;
    }
    if (action === "restart") {
      const result = await startNarrationPlayback(ctx, { ...activeNarration.request, autoplay: true });
      if (!result.ok && result.error) ctx.ui.notify(result.error, "warning");
      return;
    }
    if (action === "stop") {
      if (activeNarration.controller) {
        await activeNarration.controller.dispose();
      }
      if (activeNarration.fallbackProcess) {
        await stopFallbackNarrationProcess(activeNarration.fallbackProcess);
        activeNarration.fallbackProcess = null;
      }
      activeNarration.controller = null;
      activeNarration.state = {
        ...activeNarration.state,
        phase: "completed",
        activeRange: undefined,
        elapsedSeconds: activeNarration.state.durationSeconds ?? activeNarration.state.elapsedSeconds ?? 0,
      };
      renderNarrationUi();
      clearNarrationTimer();
      return;
    }
    if (!activeNarration.controller) {
      ctx.ui.notify("Narration controls require mpv playback.", "warning");
      return;
    }
    if (action === "pause") {
      await activeNarration.controller.togglePause();
    } else if (action === "rewind") {
      await activeNarration.controller.seekRelative(-5);
    } else if (action === "forward") {
      await activeNarration.controller.seekRelative(5);
    }
    renderNarrationUi();
    ensureNarrationTimer();
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

  pi.on("input", async (event, ctx) => {
    if (activeNarration && event.source === "interactive" && event.text.trim()) {
      await dismissNarration(ctx as any);
    }
    return { action: "continue" as const };
  });

  pi.registerShortcut("escape", {
    description: "Dismiss narration panel",
    handler: async (ctx) => {
      if (!activeNarration) return;
      await dismissNarration(ctx as any);
    },
  });
  pi.registerShortcut("alt+space", {
    description: "Pause or resume narration",
    handler: async (ctx) => {
      if (!activeNarration) return;
      await applyNarrationAction("pause", ctx as any);
    },
  });
  pi.registerShortcut("left", {
    description: "Rewind narration five seconds",
    handler: async (ctx) => {
      if (!activeNarration) return;
      await applyNarrationAction("rewind", ctx as any);
    },
  });
  pi.registerShortcut("right", {
    description: "Forward narration five seconds",
    handler: async (ctx) => {
      if (!activeNarration) return;
      await applyNarrationAction("forward", ctx as any);
    },
  });
  pi.registerShortcut("home", {
    description: "Restart narration playback",
    handler: async (ctx) => {
      if (!activeNarration) return;
      await applyNarrationAction("restart", ctx as any);
    },
  });
  pi.registerShortcut("end", {
    description: "Stop narration playback",
    handler: async (ctx) => {
      if (!activeNarration) return;
      await applyNarrationAction("stop", ctx as any);
    },
  });

  pi.registerCommand("board-narration", {
    description: "Control pinned narration playback",
    handler: async (args, ctx) => {
      const action = (args ?? "").trim().toLowerCase();
      if (!action) {
        ctx.ui.notify("Usage: /board-narration pause|rewind|forward|restart|stop|dismiss", "info");
        return;
      }
      if (!["pause", "rewind", "forward", "restart", "stop", "dismiss"].includes(action)) {
        ctx.ui.notify(`Unknown narration action: ${action}`, "warning");
        return;
      }
      await applyNarrationAction(action as "pause" | "rewind" | "forward" | "restart" | "stop" | "dismiss", ctx as any);
    },
  });

  const editRosterSelection = async (
    ctx: { ui: ExtensionAPI["commands"][number] extends never ? never : any },
    ceo: AgentConfig,
    proposed: AgentConfig[],
    available: AgentConfig[],
    maxRosterSize: number | undefined,
    rationale: string,
    signal?: AbortSignal,
  ): Promise<string[] | undefined> => {
    let selectedRosterSlugs = proposed.map((agent) => agent.slug);
    const orderedAgents = [ceo, ...orderRosterSelection(available, selectedRosterSlugs)];
    const FORCE_CLOSE_SENTINEL = "__force_close__";
    let removeAbortListener: (() => void) | undefined;
    const result = await ctx.ui.custom(
      (tui, theme, keybindings, done) => (
        (() => {
          const onAbort = () => done(FORCE_CLOSE_SENTINEL as any);
          if (signal) {
            if (signal.aborted) onAbort();
            else {
              signal.addEventListener("abort", onAbort, { once: true });
              removeAbortListener = () => signal.removeEventListener("abort", onAbort);
            }
          }
          return createRosterEditorComponent(
            tui,
            theme,
            keybindings,
            orderedAgents,
            [ceo.slug, ...selectedRosterSlugs],
            [ceo.slug],
            maxRosterSize,
            rationale,
            done,
          );
        })()
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
    removeAbortListener?.();
    if ((result as string | undefined) === FORCE_CLOSE_SENTINEL) {
      throw new Error("Subagent was aborted");
    }
    if (result === undefined) return undefined;
    selectedRosterSlugs = result.filter((slug) => slug !== ceo.slug);
    return selectedRosterSlugs;
  };

  const confirmRosterDecision = async (
    ctx: { ui: ExtensionAPI["commands"][number] extends never ? never : any },
    proposed: AgentConfig[],
    rationale: string,
    signal?: AbortSignal,
  ): Promise<"Yes" | "Edit roster" | "No" | undefined> => {
    const FORCE_CLOSE_SENTINEL = "__force_close__";
    let removeAbortListener: (() => void) | undefined;
    return ctx.ui.custom(
      (tui, theme, keybindings, done) => {
        const onAbort = () => done(FORCE_CLOSE_SENTINEL as any);
        if (signal) {
          if (signal.aborted) onAbort();
          else {
            signal.addEventListener("abort", onAbort, { once: true });
            removeAbortListener = () => signal.removeEventListener("abort", onAbort);
          }
        }
        return createRosterApprovalComponent(tui, theme, keybindings, proposed, rationale, done);
      },
      {
        overlay: true,
        overlayOptions: {
          width: 78,
          maxHeight: "70%",
          anchor: "center",
          margin: 1,
        },
      },
    ).then((result) => {
      removeAbortListener?.();
      if (result === FORCE_CLOSE_SENTINEL) {
        throw new Error("Subagent was aborted");
      }
      return result;
    });
  };

  pi.registerCommand("board-meeting", {
    description: "Start a boardroom meeting with the executive board",
    getArgumentCompletions: (prefix: string) => {
      const flags = ["--constraints quick", "--constraints standard", "--constraints thorough", "--constraints deep-dive", "--mode freeform", "--mode structured", "--messaging-mode fanout", "--messaging-mode threading"];
      return flags.filter(f => f.startsWith(prefix)).map(f => ({ value: f, label: f }));
    },
    handler: async (args, ctx) => {
      if (activeNarration) {
        await dismissNarration(ctx as any);
      }
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
      let cliMessagingMode: string | undefined;
      if (args) {
        const constraintsMatch = args.match(/--constraints\s+(\S+)/);
        if (constraintsMatch) cliConstraints = constraintsMatch[1];
        const modeMatch = args.match(/--mode\s+(\S+)/);
        if (modeMatch) cliMode = modeMatch[1];
        const messagingModeMatch = args.match(/--messaging-mode\s+(\S+)/);
        if (messagingModeMatch) cliMessagingMode = messagingModeMatch[1];
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

      const defaultMessagingMode = brief.messagingMode ?? config.default_messaging_mode;
      const selectedMessagingMode = resolveMessagingMode(cliMessagingMode)
        ?? await ctx.ui.select(
          "Select messaging mode:",
          prioritizeOption(["fanout", "threading"], defaultMessagingMode),
        );
      if (selectedMessagingMode === undefined) return;

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
        `Messaging: ${selectedMessagingMode}`,
        `Constraints: ${constraintsName} ($${constraintValues.budget} / ${constraintValues.time_limit_minutes}min / ${constraintValues.max_debate_rounds} rounds)`,
        `CEO Model: ${resolveModelLabel(ceo.model)}`,
        `Agents found: ${agents.length}`,
      ].join("\n");

      const ok = await ctx.ui.confirm("Start Board Meeting?", confirmMsg);
      if (!ok) return;

      const abortController = new AbortController();
      lastCloseoutResult = null;
      activeMeeting = {
        meetingId: "",
        brief: brief.title,
        mode: `${mode} / ${selectedMessagingMode}`,
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
          cwd, brief, agents, mode, selectedMessagingMode, constraintsName, constraintValues, config,
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
                  const choice = await confirmRosterDecision(ctx, proposed, rationale, abortController.signal);
                  if (choice === undefined) {
                    return { action: "cancel" };
                  }
                  if (choice === "No") {
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
                    abortController.signal,
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
        if (activeMeeting) {
          activeMeeting.phase = "closeout";
          activeMeeting.lastStatus = "Generating spoken narration summary...";
        }

        if (ctx.hasUI) {
          ctx.ui.setStatus("boardroom", "Generating spoken narration summary...");
        }
        const humanSummary = await generateHumanReadableSummary(result.memoPath, path.dirname(result.memoPath));
        if (humanSummary.ok) {
          result.summaryPath = humanSummary.summaryPath;
          result.summaryText = humanSummary.summaryText;
          if (humanSummary.warning && ctx.hasUI) {
            ctx.ui.notify(humanSummary.warning, "warning");
          }
        } else if (ctx.hasUI) {
          ctx.ui.notify(`Human-readable summary failed: ${humanSummary.error}`, "warning");
        }

        if (ctx.hasUI) {
          lastCloseoutResult = result;
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
            setPinnedNarrationState(ctx as any, state);
          },
          startNarrationPlayback: (request) => startNarrationPlayback(ctx as any, request),
        });

        if (!activeNarration) {
          setCloseoutWidget(ctx, result);
          ctx.ui.setStatus("boardroom", undefined);
        }
        activeMeeting = null;
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
          const cost = `est. $${agent.totalCost.toFixed(4)}`;
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
      if (activeMeeting.phase === "closeout") {
        ctx.ui.notify("Closeout is already running. Force-close no longer applies at this stage.", "info");
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
      messagingMode: Type.Optional(StringEnum(["fanout", "threading"] as const, { description: "Messaging mode" })),
    }),

    async execute(_toolCallId, params, signal, onUpdate, ctx) {
      const cwd = getWorkingDirectory(ctx);
      if (activeMeeting) {
        throw new Error("A board meeting is already in progress. Use /board-close before starting another one.");
      }
      if (activeNarration) {
        await dismissNarration(ctx as any);
      }
      try {
        const config = loadConfig(cwd);
        const agents = discoverAgents(cwd);
        let agentSnapshots: AgentRuntimeUpdate[] = [];
        let lastSnapshot: MeetingProgressSnapshot | null = null;
        const startedAtMs = Date.now();
        let toolUiTimer: ReturnType<typeof setInterval> | null = null;
        const abortController = new AbortController();
        const forwardAbort = () => abortController.abort(signal?.reason ?? "aborted");

        lastCloseoutResult = null;

        const renderToolUi = () => {
          if (!ctx.hasUI || !lastSnapshot) return;
          const theme = ctx.ui.theme;
          const snapshot = withLiveElapsed(lastSnapshot, startedAtMs, agentSnapshots, null, 0);
          ctx.ui.setStatus("boardroom", formatDashboardStatus(snapshot, theme));
          setBoardroomWidget(ctx, snapshot);
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
        const messagingMode = resolveMessagingMode(params.messagingMode) ?? brief.messagingMode ?? config.default_messaging_mode;

        activeMeeting = {
          meetingId: "",
          brief: brief.title,
          mode: `${mode} / ${messagingMode}`,
          constraints: constraintsName,
          phase: "starting",
          startedAt: startedAtMs,
          lastStatus: "Starting...",
          abortController,
          agentSnapshots: [],
          lastSnapshot: null,
          pausedAt: null,
          pausedTotalMs: 0,
        };
        if (signal) {
          if (signal.aborted) forwardAbort();
          else signal.addEventListener("abort", forwardAbort, { once: true });
        }

        onUpdate?.({ content: [{ type: "text", text: `Starting board meeting: ${brief.title} (${mode}, ${messagingMode}, ${constraintsName})...` }] });
        if (ctx.hasUI) {
          ctx.ui.setStatus("boardroom", "Board meeting in progress...");
          toolUiTimer = setInterval(renderToolUi, 1000);
        }

        let result: MeetingResult;
        try {
          result = await runMeeting(cwd, brief, agents, mode, messagingMode, constraintsName, constraintValues, config, {
          onStatus: (msg) => {
            onUpdate?.({ content: [{ type: "text", text: msg }] });
            if (activeMeeting) {
              activeMeeting.lastStatus = msg;
              const phaseMatch = msg.match(/Phase (\d+)/i) || msg.match(/Round (\d+)/i);
              if (phaseMatch) activeMeeting.phase = `Phase ${phaseMatch[1]}`;
            }
            if (!lastSnapshot && ctx.hasUI) ctx.ui.setStatus("boardroom", msg);
            else renderToolUi();
          },
          onAgentUpdate: (update) => {
            if (activeMeeting) {
              const activeIdx = activeMeeting.agentSnapshots.findIndex((snapshot) => snapshot.slug === update.slug);
              if (activeIdx >= 0) activeMeeting.agentSnapshots[activeIdx] = update;
              else activeMeeting.agentSnapshots.push(update);
            }
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
            if (activeMeeting) {
              activeMeeting.lastSnapshot = snapshot;
              activeMeeting.phase = snapshot.phaseLabel;
            }
            renderToolUi();
          },
          onConfirmRoster: async () => ({ action: "approve" }),
          signal: abortController.signal,
        });
        } finally {
          if (toolUiTimer) clearInterval(toolUiTimer);
          if (signal) signal.removeEventListener("abort", forwardAbort);
        }

        if (activeMeeting) {
          activeMeeting.phase = "closeout";
          activeMeeting.lastStatus = "Generating spoken narration summary...";
        }
        if (ctx.hasUI) ctx.ui.setStatus("boardroom", "Generating spoken narration summary...");
        const humanSummary = await generateHumanReadableSummary(result.memoPath, path.dirname(result.memoPath));
        if (humanSummary.ok) {
          result.summaryPath = humanSummary.summaryPath;
          result.summaryText = humanSummary.summaryText;
          if (humanSummary.warning && ctx.hasUI) {
            ctx.ui.notify(humanSummary.warning, "warning");
          }
        } else if (ctx.hasUI) {
          ctx.ui.notify(`Human-readable summary failed: ${humanSummary.error}`, "warning");
        }
        if (ctx.hasUI) {
          lastCloseoutResult = result;
          setCloseoutWidget(ctx, result);
          ctx.ui.setStatus("boardroom", undefined);
        }

        await runPostMeetingActions(result, {
          hasUI: ctx.hasUI,
          confirm: (title, body) => ctx.ui.confirm(title, body),
          notify: (msg, type) => ctx.ui.notify(msg, type),
          setNarrationState: (state) => {
            if (!ctx.hasUI) return;
            setPinnedNarrationState(ctx as any, state);
          },
          startNarrationPlayback: (request) => startNarrationPlayback(ctx as any, request),
        });

        if (!activeNarration && ctx.hasUI) {
          setCloseoutWidget(ctx, result);
          ctx.ui.setStatus("boardroom", undefined);
        }

        activeMeeting = null;
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
      } catch (err) {
        activeMeeting = null;
        if (!activeNarration && ctx.hasUI) {
          ctx.ui.setStatus("boardroom", undefined);
          ctx.ui.setWidget("boardroom", undefined);
        }
        throw err;
      }
    },

    renderCall(args, theme, _context) {
      const briefName = args.brief ? path.basename(args.brief, ".md") : "...";
      let text = theme.fg("toolTitle", theme.bold("board_meeting "));
      text += theme.fg("accent", briefName);
      if (args.constraints) text += theme.fg("muted", ` [${args.constraints}]`);
      if (args.mode) text += theme.fg("dim", ` (${args.mode})`);
      if (args.messagingMode) text += theme.fg("muted", ` <${args.messagingMode}>`);
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
