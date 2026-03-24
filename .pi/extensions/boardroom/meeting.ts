import type {
  AgentConfig,
  AgentRuntimeUpdate,
  ConversationEntry,
  MeetingDisposition,
  MeetingMode,
  MeetingProgressSnapshot,
  MeetingState,
  ParsedBrief,
  ConstraintSet,
} from "./types.js";
import { ConstraintTracker } from "./constraints.js";
import { addEntry, closeLog, createConversationLog, extractAddressees } from "./conversation.js";
import { loadMetaPrompt } from "./meta-prompts.js";
import { composeAssessmentPrompt, composeFramingPrompt, composeSynthesisPrompt, loadExpertise } from "./prompt-composer.js";
import { SessionPool } from "./runtime.js";
import { writeConversationLog, writeExpertise, writeMemo, writeVisuals } from "./artifacts.js";
import { loadScratchpad, saveScratchpad, extractScratchpadUpdate, stripScratchpadBlock } from "./scratchpad.js";
import { extractVisualBlocks } from "./visuals.js";
import { findAgentsByTag } from "./agents.js";

export interface MeetingCallbacks {
  onStatus: (msg: string) => void;
  onAgentUpdate?: (update: AgentRuntimeUpdate) => void;
  onSnapshot?: (snapshot: MeetingProgressSnapshot) => void;
  onConfirmRoster: (
    proposed: AgentConfig[],
    available: AgentConfig[],
    rationale: string,
  ) => Promise<RosterConfirmation>;
  signal?: AbortSignal;
}

export type RosterConfirmation =
  | { action: "approve" }
  | { action: "reject" }
  | { action: "edit"; roster: string[] };

export interface MeetingResult {
  memoPath: string;
  debateJsonPath: string;
  debateMarkdownPath: string;
  visualPaths: string[];
  summaryPath?: string;
  summaryText?: string;
  disposition: MeetingDisposition;
  abortReason?: string;
  briefTitle: string;
  mode: MeetingMode;
  totalCost: number;
  elapsedMinutes: number;
  roster: string[];
}

function loadBoardroomTaskPrompt(
  cwd: string,
  fileName: string,
  fallback: string,
  replacements: Record<string, string> = {},
): string {
  return loadMetaPrompt(cwd, fileName, fallback, replacements);
}

export function getAbortDisposition(signal?: AbortSignal): "force-closed" | "aborted" {
  return signal?.aborted && signal.reason === "force-close" ? "force-closed" : "aborted";
}

function isForceCloseRequested(signal?: AbortSignal): boolean {
  return signal?.aborted === true && signal.reason === "force-close";
}

function stringifyAbortReason(value: unknown): string | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
  if (value instanceof Error) {
    return value.message.trim() || value.name;
  }
  if (typeof value === "object" && value && "message" in value) {
    const message = (value as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) {
      return message.trim();
    }
  }
  if (value === undefined || value === null) return undefined;
  try {
    const serialized = JSON.stringify(value);
    return serialized && serialized !== "{}" ? serialized : String(value);
  } catch {
    return String(value);
  }
}

function describeAbortReason(
  disposition: "force-closed" | "aborted",
  err: unknown,
  signal?: AbortSignal,
): string {
  const signalReason = stringifyAbortReason(signal?.reason);
  const errorReason = stringifyAbortReason(err);

  if (disposition === "force-closed") {
    return signalReason && signalReason !== "force-close"
      ? `Meeting was force-closed by operator: ${signalReason}`
      : "Meeting was force-closed by operator.";
  }

  if (signal?.aborted) {
    if (signalReason && signalReason !== "force-close") {
      return errorReason && errorReason !== "Subagent was aborted"
        ? `Abort signal received: ${signalReason}. Error: ${errorReason}`
        : `Abort signal received: ${signalReason}`;
    }
    return errorReason && errorReason !== "Subagent was aborted"
      ? `Abort signal received. Error: ${errorReason}`
      : "Abort signal received.";
  }

  if (errorReason) {
    return errorReason;
  }

  return "Unknown abort reason.";
}

function generateMeetingId(brief: ParsedBrief): string {
  const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  return `${ts}-${brief.slug}`;
}

function nextEntryId(state: MeetingState): string {
  state.entryCounter++;
  return `e${String(state.entryCounter).padStart(3, "0")}`;
}

function parseRosterJson(content: string): { agents: string[]; rationale: string } | null {
  const jsonMatch = content.match(/```(?:json)?\s*\n([\s\S]*?)\n```/);
  if (!jsonMatch) return null;
  try {
    const parsed = JSON.parse(jsonMatch[1]);
    if (parsed.roster && Array.isArray(parsed.roster)) {
      const agents = parsed.roster.map((r: any) => typeof r === "string" ? r : r.name || r.agent || "").filter(Boolean);
      const rationale = parsed.rationale || parsed.reasoning || "No rationale provided";
      return { agents, rationale: typeof rationale === "string" ? rationale : JSON.stringify(rationale) };
    }
  } catch {}
  return null;
}

function getPlannedRoundCount(constraintValues: ConstraintSet): number {
  return Math.max(1, constraintValues.max_debate_rounds);
}

function getNonCeoAgents(allAgents: AgentConfig[]): AgentConfig[] {
  return allAgents.filter(a => a.slug !== "ceo" && a.slug !== "executive-board-orchestrator");
}

function dedupeAgentsBySlug(agents: AgentConfig[]): AgentConfig[] {
  const seen = new Set<string>();
  return agents.filter((agent) => {
    if (seen.has(agent.slug)) return false;
    seen.add(agent.slug);
    return true;
  });
}

function resolveRosterSelection(allAgents: AgentConfig[], slugs: string[]): AgentConfig[] {
  const resolved = slugs
    .map((slug) => allAgents.find((agent) => agent.slug === slug))
    .filter((agent): agent is AgentConfig => !!agent && agent.slug !== "ceo" && agent.slug !== "executive-board-orchestrator");
  return dedupeAgentsBySlug(resolved);
}

function resolveRoster(allAgents: AgentConfig[], ceoOutput: string): AgentConfig[] {
  const parsed = parseRosterJson(ceoOutput);
  const nonCeo = getNonCeoAgents(allAgents);

  if (!parsed || parsed.agents.length === 0) return [...nonCeo];

  const resolved = parsed.agents
    .map(s => {
      const slug = s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return allAgents.find(a => a.slug === slug);
    })
    .filter((a): a is AgentConfig => a !== undefined && a.slug !== "ceo");

  return resolved.length > 0 ? resolved : [...nonCeo];
}

function getAgentModelLabel(model: string | undefined): string {
  if (!model) return "default";
  if (model.includes("/")) return model;
  if (/^(claude|sonnet|opus|haiku)\b/i.test(model)) return `anthropic/${model}`;
  if (/^(gpt|o[1-9]|codex)\b/i.test(model)) return `openai-codex/${model}`;
  return model;
}

function applyRosterLimit(roster: AgentConfig[], constraints: ConstraintSet): AgentConfig[] {
  if (!constraints.max_roster_size || constraints.max_roster_size <= 0) return roster;
  return roster.slice(0, constraints.max_roster_size);
}

function processScratchpadOutput(cwd: string, agentSlug: string, output: string): string {
  const update = extractScratchpadUpdate(output);
  if (update) {
    saveScratchpad(cwd, agentSlug, update);
  }
  return stripScratchpadBlock(output);
}

function collectVisualsFromLog(
  log: ReturnType<typeof createConversationLog>,
): Array<{ label: string; format: "mermaid" | "svg"; code: string }> {
  const all: Array<{ label: string; format: "mermaid" | "svg"; code: string }> = [];
  for (const entry of log.entries) {
    const blocks = extractVisualBlocks(entry.content);
    for (const block of blocks) {
      all.push({ label: `${entry.from}-${entry.role}`, format: block.format, code: block.code });
    }
  }
  return all;
}

function emitConstraintWarnings(tracker: ConstraintTracker, callbacks: MeetingCallbacks): void {
  if (tracker.budgetState === "warn") {
    callbacks.onStatus(`Warning: Budget at 80%+ (${tracker.summary})`);
  }
  if (tracker.timeState === "warn") {
    callbacks.onStatus(`Warning: Time at 80%+ (${tracker.summary})`);
  }
}

function buildVisibleAgentSnapshots(state: MeetingState, pool: SessionPool): AgentRuntimeUpdate[] {
  const sessionSnapshots = new Map(pool.snapshot().map((snapshot) => [snapshot.slug, snapshot]));
  const ordered: AgentRuntimeUpdate[] = [];
  const visibleAgents = [
    ...state.allAgents.filter((agent) => agent.slug === "ceo"),
    ...state.roster,
  ];

  for (const agent of visibleAgents) {
    const existing = sessionSnapshots.get(agent.slug);
    ordered.push(existing ?? {
      slug: agent.slug,
      name: agent.name,
      status: "idle",
      modelLabel: getAgentModelLabel(agent.model),
      modelAltLabel: agent.modelAlt ? getAgentModelLabel(agent.modelAlt) : undefined,
      activity: "Awaiting turn",
      turns: 0,
      totalTokens: 0,
      totalCost: 0,
    });
    sessionSnapshots.delete(agent.slug);
  }

  for (const snapshot of sessionSnapshots.values()) {
    ordered.push(snapshot);
  }

  return ordered;
}

function emitSnapshot(
  state: MeetingState,
  tracker: ConstraintTracker,
  pool: SessionPool,
  phaseLabel: string,
  presidentNote: string,
  callbacks: MeetingCallbacks,
): void {
  if (!callbacks.onSnapshot) return;

  const lastEntries = state.log.entries.slice(-5);
  callbacks.onSnapshot({
    meetingId: state.id,
    briefTitle: state.brief.title,
    mode: state.mode,
    constraints: state.constraints,
    phase: state.phase,
    phaseLabel,
    round: state.round,
    startedAt: state.startedAt.toISOString(),
    budgetUsed: tracker.totalCost,
    budgetLimit: state.resolvedConstraints.budget,
    elapsedMinutes: tracker.elapsedMinutes,
    timeLimitMinutes: state.resolvedConstraints.time_limit_minutes,
    roundsUsed: tracker.currentRound,
    maxRounds: state.resolvedConstraints.max_debate_rounds,
    roster: state.roster.map(a => a.slug),
    agents: buildVisibleAgentSnapshots(state, pool),
    presidentNote,
    transcript: lastEntries.map(e => `[${e.from}] ${e.content.slice(0, 200)}`),
    disposition: state.disposition ?? "in-progress",
  });
}

async function runCeoWithRetry(
  cwd: string,
  pool: SessionPool,
  ceo: AgentConfig,
  systemPrompt: string,
  task: string,
  activity: string,
  callbacks: MeetingCallbacks,
  signal?: AbortSignal,
): Promise<{ content: string; tokenCount: number; cost: number }> {
  const result = await pool.runOne(cwd, ceo, systemPrompt, task, activity, signal);

  if (result.exitCode === 0 && result.content) {
    return { content: result.content, tokenCount: result.tokenCount, cost: result.cost };
  }

  callbacks.onStatus(`CEO failed (${result.error ?? "no output"}). Retrying with simplified context...`);

  const simplifiedPrompt = [
    ceo.systemPrompt,
    "",
    "--- SIMPLIFIED CONTEXT (retry after failure) ---",
    "The previous attempt failed. Provide your best assessment with the information available.",
  ].join("\n");

  const retry = await pool.runOne(cwd, ceo, simplifiedPrompt, task, `${activity} (retry)`, signal);
  const totalCost = result.cost + retry.cost;
  const totalTokens = result.tokenCount + retry.tokenCount;

  if (retry.exitCode === 0 && retry.content) {
    return { content: retry.content, tokenCount: totalTokens, cost: totalCost };
  }

  return {
    content: `[CEO failed after retry. Error: ${retry.error ?? "no output"}. Partial data from this meeting may be available in the debate log.]`,
    tokenCount: totalTokens,
    cost: totalCost,
  };
}

function savePartialArtifacts(
  cwd: string,
  meetingId: string,
  brief: ParsedBrief,
  log: ReturnType<typeof createConversationLog>,
  startedAt: Date,
  disposition: "force-closed" | "aborted",
  abortReason?: string,
): MeetingResult {
  closeLog(log, disposition, abortReason);

  const lastEntry = log.entries.findLast(e => e.from === "ceo");
  const traceLine = abortReason
    ? `[Boardroom ${disposition}. Reason: ${abortReason}]`
    : (
        disposition === "force-closed"
          ? "[Meeting was force-closed before CEO synthesis. See debate log for available data.]"
          : "[Meeting aborted. No CEO synthesis available. See debate log for partial data.]"
      );
  const memoContent = lastEntry?.content
    ? `${lastEntry.content}\n\n---\n\n${traceLine}`
    : traceLine;

  const memoPath = writeMemo(cwd, brief.slug, memoContent, startedAt);
  const { jsonPath, mdPath } = writeConversationLog(cwd, log, startedAt);

  const allVisuals = collectVisualsFromLog(log);
  const visualPaths = allVisuals.length > 0 ? writeVisuals(cwd, meetingId, allVisuals) : [];

  return {
    memoPath,
    debateJsonPath: jsonPath,
    debateMarkdownPath: mdPath,
    visualPaths,
    disposition,
    abortReason,
    briefTitle: brief.title,
    mode: brief.mode ?? "structured",
    totalCost: log.total_cost,
    elapsedMinutes: Math.max(0, (Date.now() - startedAt.getTime()) / 60000),
    roster: log.roster,
  };
}

async function finalizeForceClosedMeeting(
  cwd: string,
  brief: ParsedBrief,
  meetingId: string,
  startedAt: Date,
  state: MeetingState,
  tracker: ConstraintTracker,
  pool: SessionPool,
  ceo: AgentConfig,
  ceoFraming: string,
  callbacks: MeetingCallbacks,
  mode: MeetingMode,
): Promise<MeetingResult> {
  const abortReason = "Meeting was force-closed by operator.";

  for (const agent of state.roster) {
    pool.get(agent.slug)?.markAborted();
  }

  state.disposition = "force-closed";
  state.phase = Math.max(state.phase + 1, mode === "structured" ? 5 : 4);
  callbacks.onStatus("Meeting force-closed. CEO producing final decision with available data...");
  emitSnapshot(
    state,
    tracker,
    pool,
    mode === "structured" ? "CEO Final Decision" : "CEO Synthesis",
    "Board members interrupted. CEO finalizing with available data.",
    callbacks,
  );

  const finalEntries = state.log.entries.filter((entry) => entry.role !== "framing");
  const ceoScratchpad = loadScratchpad(cwd, ceo.slug);
  const finalPrompt = composeSynthesisPrompt(
    ceo,
    brief,
    ceoFraming,
    finalEntries,
    loadExpertise(cwd, ceo.slug),
    ceoScratchpad,
  );
  const finalTask = loadBoardroomTaskPrompt(
    cwd,
    "boardroom-force-close-final-task.md",
    [
      "The operator force-closed the board meeting.",
      "Produce your FINAL Strategic Brief using only the information gathered so far.",
      "Do not ask for another round or more discussion.",
      "Explicitly call out which questions, risks, or workstreams remain unresolved because the meeting was interrupted.",
      "",
      "If the decision involves data worth visualizing (costs, timelines, risk matrices, architectures),",
      "include one or more visuals in your output using ```mermaid fences, ```svg fences, or both.",
    ].join("\n"),
  );

  const finalRes = await runCeoWithRetry(
    cwd,
    pool,
    ceo,
    finalPrompt,
    finalTask,
    "Force-closing with final synthesis",
    callbacks,
    undefined,
  );
  finalRes.content = processScratchpadOutput(cwd, ceo.slug, finalRes.content);
  tracker.addCost(finalRes.cost);
  addEntry(
    state.log,
    nextEntryId(state),
    "ceo",
    state.roster.map((agent) => agent.slug),
    null,
    state.phase,
    0,
    mode === "structured" ? "final-decision" : "synthesis",
    finalRes.content,
    finalRes.tokenCount,
    finalRes.cost,
  );

  const allVisuals = collectVisualsFromLog(state.log);
  const visualPaths = allVisuals.length > 0 ? writeVisuals(cwd, meetingId, allVisuals) : [];
  closeLog(state.log, "force-closed", abortReason);
  const memoPath = writeMemo(cwd, brief.slug, finalRes.content, startedAt);
  const { jsonPath: debateJsonPath, mdPath: debateMarkdownPath } = writeConversationLog(cwd, state.log, startedAt);

  for (const entry of state.log.entries) {
    if (entry.content && entry.content.length > 100 && !entry.content.startsWith("[")) {
      writeExpertise(cwd, entry.from, meetingId, entry.content.slice(0, 500));
    }
  }

  callbacks.onStatus(`Meeting complete (force-closed). ${tracker.summary}`);
  emitSnapshot(state, tracker, pool, "Complete", "Meeting force-closed after CEO final synthesis.", callbacks);
  pool.destroyAll();

  return {
    memoPath,
    debateJsonPath,
    debateMarkdownPath,
    visualPaths,
    disposition: "force-closed",
    abortReason,
    briefTitle: brief.title,
    mode,
    totalCost: tracker.totalCost,
    elapsedMinutes: tracker.elapsedMinutes,
    roster: ["ceo", ...state.roster.map((agent) => agent.slug)],
  };
}

// --- Freeform Meeting ---

export async function runFreeformMeeting(
  cwd: string,
  brief: ParsedBrief,
  allAgents: AgentConfig[],
  mode: MeetingMode,
  constraintsName: string,
  constraintValues: ConstraintSet,
  config: { budget_hard_stop: boolean; time_hard_stop: boolean },
  callbacks: MeetingCallbacks,
): Promise<MeetingResult> {
  const ceo = allAgents.find((a) => a.slug === "ceo");
  if (!ceo) throw new Error("CEO agent not found in agents/executive-board/");

  const meetingId = generateMeetingId(brief);
  const tracker = new ConstraintTracker(constraintValues);
  const log = createConversationLog(meetingId, brief.filePath, mode, constraintsName, []);
  const startedAt = new Date();

  const pool = new SessionPool(callbacks.onAgentUpdate);
  let framingContent = "";
  pool.ensureAgents([ceo], "Preparing framing");
  pool.ensureAgents([ceo], "Preparing framing");

  const state: MeetingState = {
    id: meetingId,
    brief,
    mode,
    constraints: constraintsName,
    resolvedConstraints: constraintValues,
    roster: [],
    allAgents,
    phase: 0,
    round: 0,
    startedAt,
    disposition: null,
    log,
    totalCost: 0,
    entryCounter: 0,
  };

  try {
    // --- Phase 1: CEO Framing ---
    callbacks.onStatus("Phase 1: CEO framing the decision...");
    state.phase = 1;
    emitSnapshot(state, tracker, pool, "CEO Framing", "Framing the strategic question...", callbacks);

    const ceoExpertise = loadExpertise(cwd, ceo.slug);
    const ceoScratchpad = loadScratchpad(cwd, ceo.slug);
    const framingPrompt = composeFramingPrompt(ceo, brief, ceoScratchpad);
    const framingTask = [
      "Frame this decision for the executive board.",
      "1. Restate the strategic question in one sentence.",
      `2. Select which board members should be consulted${constraintValues.max_roster_size ? ` (up to ${constraintValues.max_roster_size})` : ""}. Output a JSON block:`,
      "```json",
      '{ "roster": [{ "name": "<agent-slug>", "reason": "<why needed>" }], "rationale": "<overall reasoning>" }',
      "```",
      `Available board members: ${getNonCeoAgents(allAgents).map(a => `${a.slug} (${a.name}: ${a.description.slice(0, 80)})`).join("; ")}`,
      "3. Provide your initial framing and key questions for the board to address.",
    ].join("\n");

    const framingRes = await runCeoWithRetry(cwd, pool, ceo, framingPrompt, framingTask, "Framing the decision", callbacks, callbacks.signal);
    framingRes.content = processScratchpadOutput(cwd, ceo.slug, framingRes.content);
    framingContent = framingRes.content;
    tracker.addCost(framingRes.cost);

    const framingEntry = addEntry(
      log, nextEntryId(state), "ceo",
      getNonCeoAgents(allAgents).map(a => a.slug),
      null, 1, 0, "framing",
      framingRes.content, framingRes.tokenCount, framingRes.cost,
    );

    emitConstraintWarnings(tracker, callbacks);
    callbacks.onStatus(`Phase 1 complete. ${tracker.summary}`);
    emitSnapshot(state, tracker, pool, "CEO Framing", "Framing complete. Selecting roster.", callbacks);

    // --- Roster Selection ---
    let rosterAgents = applyRosterLimit(resolveRoster(allAgents, framingRes.content), constraintValues);
    log.roster = ["ceo", ...rosterAgents.map(a => a.slug)];
    state.roster = rosterAgents;

    const rosterParsed = parseRosterJson(framingRes.content);
    const rosterRationale = rosterParsed?.rationale ?? "Full board (CEO roster selection could not be parsed)";
    tracker.pause();
    let rosterDecision: RosterConfirmation;
    try {
      rosterDecision = await callbacks.onConfirmRoster(rosterAgents, getNonCeoAgents(allAgents), rosterRationale);
    } finally {
      tracker.resume();
    }
    if (rosterDecision.action === "reject") {
      rosterAgents = applyRosterLimit([...getNonCeoAgents(allAgents)], constraintValues);
    } else if (rosterDecision.action === "edit") {
      const editedRoster = resolveRosterSelection(allAgents, rosterDecision.roster);
      rosterAgents = applyRosterLimit(
        editedRoster.length > 0 ? editedRoster : [...getNonCeoAgents(allAgents)],
        constraintValues,
      );
    }
    log.roster = ["ceo", ...rosterAgents.map(a => a.slug)];
    state.roster = rosterAgents;
    pool.ensureAgents(rosterAgents, "Awaiting first evaluation");

    // --- Debate Rounds ---
    const plannedRounds = getPlannedRoundCount(constraintValues);
    let debateRound = 0;
    let lastAssessmentEntries: ConversationEntry[] = [];

    while (tracker.canContinue(config.budget_hard_stop, config.time_hard_stop)) {
      debateRound++;
      tracker.incrementRound();
      state.phase = 1 + debateRound;
      state.round = debateRound;

      const phaseLabel = `Debate Round ${debateRound}`;
      callbacks.onStatus(`Round ${debateRound}/${plannedRounds}: ${rosterAgents.length} board members assessing in parallel...`);
      emitSnapshot(state, tracker, pool, phaseLabel, `Round ${debateRound}: board members deliberating.`, callbacks);

      const priorEntries = debateRound > 1 ? lastAssessmentEntries : [];

      const agentTasks = rosterAgents.map((agent) => {
        const expertise = loadExpertise(cwd, agent.slug);
        const agentScratchpad = loadScratchpad(cwd, agent.slug);
        const prompt = composeAssessmentPrompt(agent, brief, framingRes.content, priorEntries, expertise, agentScratchpad);
        const roundContext = debateRound > 1
          ? `This is round ${debateRound}. Review the prior assessments and respond to specific points of disagreement.`
          : "";
        return {
          agent,
          systemPrompt: prompt,
          task: `Provide your assessment as the ${agent.name}. ${roundContext} Follow your output format.`,
          activity: debateRound > 1 ? "Responding to disagreements" : "Evaluating the brief",
        };
      });

      const results = await pool.runParallel(cwd, agentTasks, callbacks.signal);

      lastAssessmentEntries = [];
      const rosterSlugs = rosterAgents.map(a => a.slug);
      let failedCount = 0;

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const agent = rosterAgents[i];
        tracker.addCost(result.cost);

        if (result.exitCode !== 0 || !result.content) {
          failedCount++;
          callbacks.onStatus(`${agent.name} failed: ${result.error ?? "no output"}. Continuing without.`);
          const failContent = `[${agent.name} failed to respond: ${result.error ?? "process error"}]`;
          const entry = addEntry(log, nextEntryId(state), agent.slug, ["ceo"],
            framingEntry.id, state.phase, debateRound, "assessment",
            failContent, result.tokenCount, result.cost);
          lastAssessmentEntries.push(entry);
          continue;
        }

        result.content = processScratchpadOutput(cwd, agent.slug, result.content);
        const addressees = extractAddressees(result.content, rosterSlugs.filter(s => s !== agent.slug), allAgents);
        const to = addressees.length > 0 ? ["ceo", ...addressees] : ["ceo"];

        const entry = addEntry(
          log, nextEntryId(state), agent.slug, to,
          framingEntry.id, state.phase, debateRound, "assessment",
          result.content, result.tokenCount, result.cost,
        );
        lastAssessmentEntries.push(entry);
      }

      if (failedCount > 0) {
        callbacks.onStatus(`Round ${debateRound}: ${failedCount}/${rosterAgents.length} agents failed. CEO will be informed.`);
      }

      emitConstraintWarnings(tracker, callbacks);
      callbacks.onStatus(`Round ${debateRound} complete. ${tracker.summary}`);
      emitSnapshot(state, tracker, pool, phaseLabel, `Round ${debateRound} complete.`, callbacks);

      if (isForceCloseRequested(callbacks.signal)) {
        callbacks.onStatus("Force-close requested. Moving to CEO final synthesis.");
        break;
      }

      if (!tracker.canContinue(config.budget_hard_stop, config.time_hard_stop)) {
        callbacks.onStatus("Constraints reached. Moving to CEO final synthesis.");
        break;
      }

      if (debateRound >= plannedRounds) {
        callbacks.onStatus("Planned round target reached. Moving to CEO final synthesis.");
        break;
      }

      if (plannedRounds > 1) {
        const ceoReviewScratchpad = loadScratchpad(cwd, ceo.slug);
        const reviewPrompt = composeSynthesisPrompt(ceo, brief, framingRes.content, lastAssessmentEntries, ceoExpertise, ceoReviewScratchpad);
        const reviewTask = loadBoardroomTaskPrompt(
          cwd,
          "boardroom-freeform-review-task.md",
          [
            "Round {{ROUND_NUMBER}} of planned {{PLANNED_ROUNDS}}. Budget: {{TRACKER_SUMMARY}}",
            "You must continue to round {{NEXT_ROUND}} unless budget or time constraints force an earlier stop.",
            "Do not produce the final Strategic Brief yet.",
            "Summarize the strongest disagreements, missing evidence, and the concrete questions the next round must resolve.",
          ].join("\n"),
          {
            ROUND_NUMBER: String(debateRound),
            PLANNED_ROUNDS: String(plannedRounds),
            TRACKER_SUMMARY: tracker.summary,
            NEXT_ROUND: String(debateRound + 1),
          },
        );

        const reviewRes = await runCeoWithRetry(cwd, pool, ceo, reviewPrompt, reviewTask, "Reviewing disagreements", callbacks, callbacks.signal);
        reviewRes.content = processScratchpadOutput(cwd, ceo.slug, reviewRes.content);
        tracker.addCost(reviewRes.cost);

        const reviewEntry = addEntry(log, nextEntryId(state), "ceo", rosterAgents.map(a => a.slug),
          null, state.phase, debateRound, "review",
          reviewRes.content, reviewRes.tokenCount, reviewRes.cost);
        lastAssessmentEntries.push(reviewEntry);
        callbacks.onStatus(`CEO set the agenda for round ${debateRound + 1}.`);
      }
    }

    // --- Final Synthesis ---
    const forceClosed = isForceCloseRequested(callbacks.signal);
    const synthSignal = forceClosed ? undefined : callbacks.signal;
    const synthPhase = state.phase + 1;
    state.phase = synthPhase;
    callbacks.onStatus(
      forceClosed
        ? "Meeting force-closed. CEO synthesizing final decision with available data..."
        : "CEO synthesizing final decision...",
    );
    emitSnapshot(state, tracker, pool, "CEO Synthesis", "Synthesizing final decision...", callbacks);

    const allAssessments = log.entries.filter(e => e.role === "assessment" || e.role === "review");
    const synthExpertise = loadExpertise(cwd, ceo.slug);
    const ceoSynthScratchpad = loadScratchpad(cwd, ceo.slug);
    const synthPrompt = composeSynthesisPrompt(ceo, brief, framingRes.content, allAssessments, synthExpertise, ceoSynthScratchpad);

    const earlyClose = !forceClosed && !tracker.canContinue(config.budget_hard_stop, config.time_hard_stop);
    const synthTask = forceClosed
      ? loadBoardroomTaskPrompt(
          cwd,
          "boardroom-force-close-final-task.md",
          [
            "The operator force-closed the board meeting.",
            "Produce your FINAL Strategic Brief using only the information gathered so far.",
            "Do not ask for another round or more discussion.",
            "Explicitly note which questions or workstreams remain unresolved because the meeting was interrupted.",
            "",
            "If the decision involves data worth visualizing (costs, timelines, risk matrices, architectures),",
            "include one or more visuals in your output using ```mermaid fences, ```svg fences, or both.",
          ].join("\n"),
        )
      : earlyClose
      ? loadBoardroomTaskPrompt(
          cwd,
          "boardroom-constraints-reached-final-task.md",
          "Constraints reached. Produce your final Strategic Brief with available data. Note any gaps.",
        )
      : loadBoardroomTaskPrompt(
          cwd,
          "boardroom-final-synthesis-task.md",
          [
            "Synthesize all board input into your final Strategic Brief. Address disagreements explicitly.",
            "",
            "If the decision involves data worth visualizing (costs, timelines, risk matrices, architectures),",
            "include one or more visuals in your output using ```mermaid fences, ```svg fences, or both.",
          ].join("\n"),
        );

    const synthRes = await runCeoWithRetry(cwd, pool, ceo, synthPrompt, synthTask, "Synthesizing final brief", callbacks, synthSignal);
    synthRes.content = processScratchpadOutput(cwd, ceo.slug, synthRes.content);
    tracker.addCost(synthRes.cost);

    addEntry(log, nextEntryId(state), "ceo", rosterAgents.map(a => a.slug),
      null, synthPhase, 0, "synthesis", synthRes.content, synthRes.tokenCount, synthRes.cost);

    // --- Extract Visuals ---
    const allVisuals = collectVisualsFromLog(log);
    let visualPaths: string[] = [];

    // --- Write Artifacts ---
    const disposition = forceClosed
      ? "force-closed" as const
      : earlyClose
      ? (tracker.budgetState === "exceeded" ? "budget-exceeded" as const : "completed" as const)
      : "completed" as const;
    const abortReason = forceClosed ? "Meeting was force-closed by operator." : undefined;

    state.disposition = disposition;
    closeLog(log, disposition, abortReason);
    const memoPath = writeMemo(cwd, brief.slug, synthRes.content, startedAt);
    const { jsonPath: debateJsonPath, mdPath: debateMarkdownPath } = writeConversationLog(cwd, log, startedAt);

    if (allVisuals.length > 0) {
      visualPaths = writeVisuals(cwd, meetingId, allVisuals);
      callbacks.onStatus(`Generated ${visualPaths.length} visual(s).`);
    }

    for (const entry of log.entries) {
      if (entry.content && entry.content.length > 100 && !entry.content.startsWith("[")) {
        writeExpertise(cwd, entry.from, meetingId, entry.content.slice(0, 500));
      }
    }

    callbacks.onStatus(`Meeting complete (${disposition}). ${tracker.summary}`);
    emitSnapshot(state, tracker, pool, "Complete", `Meeting ${disposition}.`, callbacks);
    pool.destroyAll();
    return {
      memoPath, debateJsonPath, debateMarkdownPath, visualPaths,
      disposition, abortReason, briefTitle: brief.title, mode,
      totalCost: tracker.totalCost, elapsedMinutes: tracker.elapsedMinutes,
      roster: ["ceo", ...rosterAgents.map(a => a.slug)],
    };

  } catch (err: any) {
    if (err.message === "Subagent was aborted" || callbacks.signal?.aborted) {
      const disposition = getAbortDisposition(callbacks.signal);
      if (disposition === "force-closed") {
        return finalizeForceClosedMeeting(
          cwd,
          brief,
          meetingId,
          startedAt,
          state,
          tracker,
          pool,
          ceo,
          framingContent,
          callbacks,
          mode,
        );
      }
      const abortReason = describeAbortReason(disposition, err, callbacks.signal);
      const note = disposition === "force-closed" ? "Meeting force-closed." : "Meeting aborted.";
      callbacks.onStatus(`${note} Saving partial log...`);
      state.disposition = disposition;
      emitSnapshot(
        state,
        tracker,
        pool,
        disposition === "force-closed" ? "Force-closed" : "Aborted",
        `${note} ${abortReason}`,
        callbacks,
      );
      pool.destroyAll();
      const partial = savePartialArtifacts(cwd, meetingId, brief, log, startedAt, disposition, abortReason);
      return {
        ...partial, disposition, briefTitle: brief.title, mode,
        totalCost: tracker.totalCost, elapsedMinutes: tracker.elapsedMinutes,
        roster: ["ceo", ...state.roster.map(a => a.slug)],
      };
    }
    callbacks.onStatus(`Meeting error: ${err.message}. Saving partial log...`);
    state.disposition = "aborted";
    const abortReason = describeAbortReason("aborted", err, callbacks.signal);
    emitSnapshot(state, tracker, pool, "Error", `Error: ${abortReason}`, callbacks);
    pool.destroyAll();
    const partial = savePartialArtifacts(cwd, meetingId, brief, log, startedAt, "aborted", abortReason);
    return {
      ...partial, disposition: "aborted" as const, briefTitle: brief.title, mode,
      totalCost: tracker.totalCost, elapsedMinutes: tracker.elapsedMinutes,
      roster: ["ceo", ...state.roster.map(a => a.slug)],
    };
  }
}

// --- Structured Meeting Mode ---

export async function runStructuredMeeting(
  cwd: string,
  brief: ParsedBrief,
  allAgents: AgentConfig[],
  constraintsName: string,
  constraintValues: ConstraintSet,
  config: { budget_hard_stop: boolean; time_hard_stop: boolean },
  callbacks: MeetingCallbacks,
): Promise<MeetingResult> {
  const ceo = allAgents.find(a => a.slug === "ceo");
  if (!ceo) throw new Error("CEO agent not found in agents/executive-board/");

  const meetingId = generateMeetingId(brief);
  const tracker = new ConstraintTracker(constraintValues);
  const log = createConversationLog(meetingId, brief.filePath, "structured", constraintsName, []);
  const nonCeo = getNonCeoAgents(allAgents);
  const startedAt = new Date();

  const pool = new SessionPool(callbacks.onAgentUpdate);
  let framingContent = "";

  const state: MeetingState = {
    id: meetingId,
    brief,
    mode: "structured",
    constraints: constraintsName,
    resolvedConstraints: constraintValues,
    roster: [],
    allAgents,
    phase: 0,
    round: 0,
    startedAt,
    disposition: null,
    log,
    totalCost: 0,
    entryCounter: 0,
  };

  try {
    // Phase 1: CEO Framing
    callbacks.onStatus("Phase 1: CEO framing...");
    state.phase = 1;
    emitSnapshot(state, tracker, pool, "CEO Framing", "Framing the strategic question...", callbacks);

    const ceoStructuredScratchpad = loadScratchpad(cwd, ceo.slug);
    const framingPrompt = composeFramingPrompt(ceo, brief, ceoStructuredScratchpad);
    const framingTask = [
      "Frame this decision for the executive board in structured meeting mode.",
      "1. Restate the strategic question.",
      `2. Select board members${constraintValues.max_roster_size ? ` (up to ${constraintValues.max_roster_size})` : ""} with roster JSON:`,
      "```json",
      '{ "roster": [{ "name": "<slug>", "reason": "<why>" }], "rationale": "<reasoning>" }',
      "```",
      `Available: ${nonCeo.map(a => `${a.slug} (${a.name})`).join("; ")}`,
      "3. Frame the key questions for parallel evaluation.",
    ].join("\n");

    const framingRes = await runCeoWithRetry(cwd, pool, ceo, framingPrompt, framingTask, "Framing the decision", callbacks, callbacks.signal);
    framingRes.content = processScratchpadOutput(cwd, ceo.slug, framingRes.content);
    framingContent = framingRes.content;
    tracker.addCost(framingRes.cost);

    const framingEntry = addEntry(
      log, nextEntryId(state), "ceo", nonCeo.map(a => a.slug),
      null, 1, 0, "framing", framingRes.content, framingRes.tokenCount, framingRes.cost,
    );

    let rosterAgents = applyRosterLimit(resolveRoster(allAgents, framingRes.content), constraintValues);
    log.roster = ["ceo", ...rosterAgents.map(a => a.slug)];
    state.roster = rosterAgents;

    const rosterParsed = parseRosterJson(framingRes.content);
    tracker.pause();
    let rosterDecision: RosterConfirmation;
    try {
      rosterDecision = await callbacks.onConfirmRoster(rosterAgents, nonCeo, rosterParsed?.rationale ?? "Full board");
    } finally {
      tracker.resume();
    }
    if (rosterDecision.action === "reject") {
      rosterAgents = applyRosterLimit([...nonCeo], constraintValues);
    } else if (rosterDecision.action === "edit") {
      const editedRoster = resolveRosterSelection(allAgents, rosterDecision.roster);
      rosterAgents = applyRosterLimit(
        editedRoster.length > 0 ? editedRoster : [...nonCeo],
        constraintValues,
      );
    }
    log.roster = ["ceo", ...rosterAgents.map(a => a.slug)];
    state.roster = rosterAgents;
    pool.ensureAgents(rosterAgents, "Awaiting evaluation");

    emitConstraintWarnings(tracker, callbacks);
    emitSnapshot(state, tracker, pool, "CEO Framing", "Framing complete. Roster confirmed.", callbacks);

    const plannedRounds = getPlannedRoundCount(constraintValues);

    while (tracker.canContinue(config.budget_hard_stop, config.time_hard_stop) && !tracker.hasMetRoundTarget) {
      if (isForceCloseRequested(callbacks.signal)) {
        callbacks.onStatus("Force-close requested. Moving to CEO final decision.");
        break;
      }
      const roundNumber = tracker.currentRound + 1;

      // Phase 2: Parallel Evaluation
      state.phase = 2;
      tracker.incrementRound();
      state.round = roundNumber;
      const evalLabel = `Parallel Evaluation (round ${roundNumber}/${plannedRounds})`;
      callbacks.onStatus(`Phase 2: ${evalLabel}...`);
      emitSnapshot(state, tracker, pool, evalLabel, "Board members evaluating in parallel.", callbacks);

      const priorAssessments = log.entries.filter(
        (entry) => entry.role === "assessment" || entry.role === "stress-test" || entry.role === "conflict-synthesis",
      );
      const agentTasks = rosterAgents.map(agent => {
        const expertise = loadExpertise(cwd, agent.slug);
        const agentScratchpad = loadScratchpad(cwd, agent.slug);
        const prompt = composeAssessmentPrompt(agent, brief, framingRes.content, priorAssessments, expertise, agentScratchpad);
        const roundContext = roundNumber > 1
          ? `This is round ${roundNumber} of planned ${plannedRounds}. Respond to the unresolved tensions from the prior round.`
          : "";
        return {
          agent,
          systemPrompt: prompt,
          task: `Evaluate this decision as ${agent.name}. ${roundContext} Follow your output format.`,
          activity: roundNumber > 1 ? "Responding to unresolved tensions" : "Evaluating the brief",
        };
      });

      const evalResults = await pool.runParallel(cwd, agentTasks, callbacks.signal);
      const rosterSlugs = rosterAgents.map(a => a.slug);

      for (let i = 0; i < evalResults.length; i++) {
        const result = evalResults[i];
        const agent = rosterAgents[i];
        tracker.addCost(result.cost);

        if (result.exitCode !== 0 || !result.content) {
          callbacks.onStatus(`${agent.name} failed. Continuing without.`);
          addEntry(log, nextEntryId(state), agent.slug, ["ceo"],
            framingEntry.id, 2, roundNumber, "assessment",
            `[${agent.name} failed: ${result.error ?? "no output"}]`, result.tokenCount, result.cost);
          continue;
        }

        result.content = processScratchpadOutput(cwd, agent.slug, result.content);
        const addressees = extractAddressees(result.content, rosterSlugs.filter(s => s !== agent.slug), allAgents);
        addEntry(log, nextEntryId(state), agent.slug,
          addressees.length > 0 ? ["ceo", ...addressees] : ["ceo"],
          framingEntry.id, 2, roundNumber, "assessment",
          result.content, result.tokenCount, result.cost);
      }

      emitConstraintWarnings(tracker, callbacks);
      emitSnapshot(state, tracker, pool, evalLabel, "Evaluation complete.", callbacks);
      if (isForceCloseRequested(callbacks.signal)) {
        callbacks.onStatus("Force-close requested. Skipping to CEO final decision.");
        break;
      }
      if (!tracker.canContinue(config.budget_hard_stop, config.time_hard_stop)) break;

      // Phase 3: Stress Test
      state.phase = 3;
      callbacks.onStatus("Phase 3: Stress test...");
      emitSnapshot(state, tracker, pool, "Stress Test", "Running adversarial review.", callbacks);

      const stressAgents = dedupeAgentsBySlug(
        findAgentsByTag(rosterAgents, "stress-test"),
      );

      if (stressAgents.length > 0) {
        pool.ensureAgents(stressAgents, "Awaiting stress test");
      }

      if (stressAgents.length > 0) {
        const allAssessments = log.entries.filter(e => e.role === "assessment");
        const stressTasks = stressAgents.map(agent => {
          const expertise = loadExpertise(cwd, agent.slug);
          const stressScratchpad = loadScratchpad(cwd, agent.slug);
          const prompt = composeAssessmentPrompt(agent, brief, framingRes.content, allAssessments, expertise, stressScratchpad);
          return {
            agent,
            systemPrompt: prompt,
            task: `Stress-test the board's assessments as ${agent.name}. Challenge weak assumptions.`,
            activity: "Stress-testing the plan",
          };
        });

        const stressResults = await pool.runParallel(cwd, stressTasks, callbacks.signal);
        for (let i = 0; i < stressResults.length; i++) {
          tracker.addCost(stressResults[i].cost);
          if (stressResults[i].exitCode !== 0 || !stressResults[i].content) {
            callbacks.onStatus(`${stressAgents[i].name} failed in stress test. Continuing.`);
            addEntry(log, nextEntryId(state), stressAgents[i].slug, ["ceo"],
              null, 3, roundNumber, "stress-test",
              `[${stressAgents[i].name} failed]`, stressResults[i].tokenCount, stressResults[i].cost);
            continue;
          }
          stressResults[i].content = processScratchpadOutput(cwd, stressAgents[i].slug, stressResults[i].content);
          const challenged = extractAddressees(stressResults[i].content, rosterSlugs, allAgents);
          addEntry(log, nextEntryId(state), stressAgents[i].slug,
            challenged.length > 0 ? challenged : ["ceo"],
            null, 3, roundNumber, "stress-test",
            stressResults[i].content, stressResults[i].tokenCount, stressResults[i].cost);
        }
      }

      emitConstraintWarnings(tracker, callbacks);
      emitSnapshot(state, tracker, pool, "Stress Test", "Stress test complete.", callbacks);
      if (isForceCloseRequested(callbacks.signal)) {
        callbacks.onStatus("Force-close requested. Skipping to CEO final decision.");
        break;
      }
      if (!tracker.canContinue(config.budget_hard_stop, config.time_hard_stop)) break;

      // Phase 4: CEO conflict synthesis
      state.phase = 4;
      callbacks.onStatus("Phase 4: Conflict synthesis...");
      emitSnapshot(state, tracker, pool, "Conflict Synthesis", "CEO reviewing disagreements.", callbacks);

      const allEntries = log.entries.filter(e => e.role === "assessment" || e.role === "stress-test");
      const ceoConflictScratchpad = loadScratchpad(cwd, ceo.slug);
      const synthPrompt = composeSynthesisPrompt(ceo, brief, framingRes.content, allEntries, loadExpertise(cwd, ceo.slug), ceoConflictScratchpad);
      const reviewTask = tracker.currentRound < plannedRounds
        ? loadBoardroomTaskPrompt(
            cwd,
            "boardroom-structured-review-task.md",
            [
              "Round {{ROUND_NUMBER}} of planned {{PLANNED_ROUNDS}}. Budget: {{TRACKER_SUMMARY}}.",
              "You must continue to round {{NEXT_ROUND}} unless budget or time constraints force an earlier stop.",
              "Do not produce the final Strategic Brief yet.",
              "Summarize where the board agrees, where disagreement remains, and what the next round must pressure-test.",
            ].join("\n"),
            {
              ROUND_NUMBER: String(roundNumber),
              PLANNED_ROUNDS: String(plannedRounds),
              TRACKER_SUMMARY: tracker.summary,
              NEXT_ROUND: String(roundNumber + 1),
            },
          )
        : loadBoardroomTaskPrompt(
            cwd,
            "boardroom-structured-review-final-round-task.md",
            [
              "Round {{ROUND_NUMBER}} of planned {{PLANNED_ROUNDS}}. Budget: {{TRACKER_SUMMARY}}.",
              "The planned round target is complete.",
              "Summarize the unresolved tensions and the points the final Strategic Brief must explicitly address.",
              "Do not produce the final Strategic Brief yet.",
            ].join("\n"),
            {
              ROUND_NUMBER: String(roundNumber),
              PLANNED_ROUNDS: String(plannedRounds),
              TRACKER_SUMMARY: tracker.summary,
            },
          );

      const reviewRes = await runCeoWithRetry(cwd, pool, ceo, synthPrompt, reviewTask, "Resolving board conflicts", callbacks, callbacks.signal);
      reviewRes.content = processScratchpadOutput(cwd, ceo.slug, reviewRes.content);
      tracker.addCost(reviewRes.cost);
      addEntry(log, nextEntryId(state), "ceo", rosterAgents.map(a => a.slug),
        null, 4, roundNumber, "conflict-synthesis",
        reviewRes.content, reviewRes.tokenCount, reviewRes.cost);

      emitSnapshot(state, tracker, pool, "Conflict Synthesis", "CEO synthesis complete.", callbacks);

      if (!tracker.canContinue(config.budget_hard_stop, config.time_hard_stop)) {
        callbacks.onStatus("Constraints reached. Moving to CEO final decision.");
        break;
      }
      if (tracker.hasMetRoundTarget) {
        callbacks.onStatus("Planned round target reached. Moving to CEO final decision.");
        break;
      }

      callbacks.onStatus(`CEO re-engaging board for round ${tracker.currentRound + 1}...`);
    }

    // Phase 5: CEO Final Decision
    const forceClosed = isForceCloseRequested(callbacks.signal);
    const finalSignal = forceClosed ? undefined : callbacks.signal;
    state.phase = 5;
    callbacks.onStatus(
      forceClosed
        ? "Meeting force-closed. CEO producing final decision with available data..."
        : "Phase 5: CEO final decision...",
    );
    emitSnapshot(state, tracker, pool, "CEO Final Decision", "CEO producing final decision.", callbacks);

    let memoContent: string;

    const finalEntries = log.entries.filter(e => e.role !== "framing");
    const ceoFinalScratchpad = loadScratchpad(cwd, ceo.slug);
    const finalPrompt = composeSynthesisPrompt(ceo, brief, framingRes.content, finalEntries, loadExpertise(cwd, ceo.slug), ceoFinalScratchpad);
    const finalTask = forceClosed
      ? loadBoardroomTaskPrompt(
          cwd,
          "boardroom-force-close-final-task.md",
          [
            "The operator force-closed the board meeting.",
            "Produce your FINAL Strategic Brief using only the information gathered so far.",
            "Do not ask for another round or more discussion.",
            "Explicitly note which questions or workstreams remain unresolved because the meeting was interrupted.",
            "",
            "If the decision involves data worth visualizing (costs, timelines, risk matrices, architectures),",
            "include one or more visuals in your output using ```mermaid fences, ```svg fences, or both.",
          ].join("\n"),
        )
      : loadBoardroomTaskPrompt(
          cwd,
          "boardroom-structured-final-task.md",
          [
            "Produce your FINAL Strategic Brief.",
            "",
            "If the decision involves data worth visualizing (costs, timelines, risk matrices, architectures),",
            "include one or more visuals in your output using ```mermaid fences, ```svg fences, or both.",
          ].join("\n"),
        );
    const finalRes = await runCeoWithRetry(cwd, pool, ceo, finalPrompt, finalTask, "Producing final decision", callbacks, finalSignal);
    finalRes.content = processScratchpadOutput(cwd, ceo.slug, finalRes.content);
    tracker.addCost(finalRes.cost);
    addEntry(log, nextEntryId(state), "ceo", rosterAgents.map(a => a.slug),
      null, 5, 0, "final-decision", finalRes.content, finalRes.tokenCount, finalRes.cost);
    memoContent = finalRes.content;

    // --- Extract Visuals ---
    const allVisuals = collectVisualsFromLog(log);
    let visualPaths: string[] = [];

    // Phase 6: Close
    const disposition = forceClosed
      ? "force-closed" as const
      : (tracker.budgetState === "exceeded" ? "budget-exceeded" as const : "completed" as const);
    const abortReason = forceClosed ? "Meeting was force-closed by operator." : undefined;
    state.disposition = disposition;
    closeLog(log, disposition, abortReason);
    const memoPath = writeMemo(cwd, brief.slug, memoContent, startedAt);
    const { jsonPath: debateJsonPath, mdPath: debateMarkdownPath } = writeConversationLog(cwd, log, startedAt);

    if (allVisuals.length > 0) {
      visualPaths = writeVisuals(cwd, meetingId, allVisuals);
      callbacks.onStatus(`Generated ${visualPaths.length} visual(s).`);
    }

    for (const entry of log.entries) {
      if (entry.content && entry.content.length > 100 && !entry.content.startsWith("[")) {
        writeExpertise(cwd, entry.from, meetingId, entry.content.slice(0, 500));
      }
    }

    callbacks.onStatus(`Structured meeting complete (${disposition}). ${tracker.summary}`);
    emitSnapshot(state, tracker, pool, "Complete", `Structured meeting ${disposition}.`, callbacks);
    pool.destroyAll();
    return {
      memoPath, debateJsonPath, debateMarkdownPath, visualPaths,
      disposition, abortReason, briefTitle: brief.title, mode: "structured" as const,
      totalCost: tracker.totalCost, elapsedMinutes: tracker.elapsedMinutes,
      roster: ["ceo", ...rosterAgents.map(a => a.slug)],
    };

  } catch (err: any) {
    if (err.message === "Subagent was aborted" || callbacks.signal?.aborted) {
      const disposition = getAbortDisposition(callbacks.signal);
      if (disposition === "force-closed") {
        return finalizeForceClosedMeeting(
          cwd,
          brief,
          meetingId,
          startedAt,
          state,
          tracker,
          pool,
          ceo,
          framingContent,
          callbacks,
          "structured",
        );
      }
      const abortReason = describeAbortReason(disposition, err, callbacks.signal);
      const note = disposition === "force-closed" ? "Meeting force-closed." : "Meeting aborted.";
      callbacks.onStatus(`${note} Saving partial log...`);
      state.disposition = disposition;
      emitSnapshot(
        state,
        tracker,
        pool,
        disposition === "force-closed" ? "Force-closed" : "Aborted",
        `${note} ${abortReason}`,
        callbacks,
      );
      pool.destroyAll();
      const partial = savePartialArtifacts(cwd, meetingId, brief, log, startedAt, disposition, abortReason);
      return {
        ...partial, disposition, briefTitle: brief.title, mode: "structured" as const,
        totalCost: tracker.totalCost, elapsedMinutes: tracker.elapsedMinutes,
        roster: ["ceo", ...state.roster.map(a => a.slug)],
      };
    }
    callbacks.onStatus(`Meeting error: ${err.message}. Saving partial log...`);
    state.disposition = "aborted";
    const abortReason = describeAbortReason("aborted", err, callbacks.signal);
    emitSnapshot(state, tracker, pool, "Error", `Error: ${abortReason}`, callbacks);
    pool.destroyAll();
    const partial = savePartialArtifacts(cwd, meetingId, brief, log, startedAt, "aborted", abortReason);
    return {
      ...partial, disposition: "aborted" as const, briefTitle: brief.title, mode: "structured" as const,
      totalCost: tracker.totalCost, elapsedMinutes: tracker.elapsedMinutes,
      roster: ["ceo", ...state.roster.map(a => a.slug)],
    };
  }
}
