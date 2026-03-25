/**
 * Freeform meeting runner using the explicit messaging model.
 *
 * Replaces the fan-out/fan-in model with thread-routed messaging:
 * - CEO opens workstream threads
 * - Agents post routed messages into threads
 * - Routing headers parsed from agent output determine delivery
 * - Thread state is authoritative for the debate log
 */

import type { AgentConfig, AgentRuntimeUpdate, ConstraintSet, MeetingMode, ParsedBrief } from "./types.js";
import type { MeetingCallbacks, MeetingResult } from "./meeting.js";
import { getAbortDisposition } from "./meeting.js";
import { ConstraintTracker } from "./constraints.js";
import {
  createThreadState,
  createThread,
  postMessage,
  getAllThreads,
  getAllMessages,
  serializeToMessagingLog,
  resolveAllActiveThreads,
  markUndeliverableMessages,
  formatRecoveryCheckpoint,
} from "./thread-manager.js";
import {
  composeMessagingFramingPrompt,
  composeMessagingSynthesisPrompt,
  parseWorkstreamsFromCeoOutput,
} from "./messaging-prompts.js";
import { writeMessagingLog } from "./messaging-artifacts.js";
import { buildRosterInfo } from "./messaging-ui.js";
import { SessionPool } from "./runtime.js";
import { runSemiLiveRound, DEFAULT_ROUND_CONFIG, type QueueCallbacks } from "./round-queue.js";
import { writeMemo, writeExpertise, writeVisuals } from "./artifacts.js";
import { loadScratchpad, saveScratchpad, extractScratchpadUpdate, stripScratchpadBlock } from "./scratchpad.js";
import type { Thread, ThreadState } from "./messaging-types.js";
import { buildThreadGraph, renderThreadGraph } from "./thread-graph.js";
import { extractMermaidBlocks } from "./visuals.js";
import { loadExpertise } from "./prompt-composer.js";
import { findAgentsByTag } from "./agents.js";

export interface MessagingMeetingCallbacks extends Pick<MeetingCallbacks, "onStatus" | "onAgentUpdate" | "onConfirmRoster" | "onSnapshot" | "signal"> {}

export interface MessagingMeetingResult extends MeetingResult {}

function generateMeetingId(brief: ParsedBrief): string {
  const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  return `${ts}-${brief.slug}`;
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

function resolveRoster(allAgents: AgentConfig[], names: string[]): AgentConfig[] {
  const nonCeo = getNonCeoAgents(allAgents);
  if (names.length === 0) return [...nonCeo];

  const resolved = names
    .map(s => {
      const slug = s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return allAgents.find(a => a.slug === slug);
    })
    .filter((a): a is AgentConfig => a !== undefined && a.slug !== "ceo");

  return resolved.length > 0 ? resolved : [...nonCeo];
}

function resolveRosterSelection(allAgents: AgentConfig[], slugs: string[]): AgentConfig[] {
  return dedupeAgentsBySlug(
    slugs
      .map((slug) => allAgents.find((agent) => agent.slug === slug))
      .filter((agent): agent is AgentConfig => !!agent && agent.slug !== "ceo" && agent.slug !== "executive-board-orchestrator"),
  );
}

function applyRosterLimit(roster: AgentConfig[], constraints: ConstraintSet): AgentConfig[] {
  if (!constraints.max_roster_size || constraints.max_roster_size <= 0) return roster;
  return roster.slice(0, constraints.max_roster_size);
}

function buildMessagingAgentSnapshots(
  allAgents: AgentConfig[],
  rosterAgents: AgentConfig[],
  threadState: ThreadState,
  pool: SessionPool,
): AgentRuntimeUpdate[] {
  // Merge real SessionPool snapshots (live streaming/thinking/cost) with
  // thread-state counts (inbox/outbox/thread participation). Pool snapshots
  // are authoritative for status, cost, and tokens; thread state adds
  // messaging-specific activity context.
  const poolSnapshots = new Map(pool.snapshot().map((s) => [s.slug, s]));
  const visibleAgents = dedupeAgentsBySlug([
    ...allAgents.filter((agent) => agent.slug === "ceo"),
    ...rosterAgents,
  ]);
  const rosterInfo = buildRosterInfo(threadState, visibleAgents.map((agent) => ({ slug: agent.slug, name: agent.name })));

  return visibleAgents.map((agent) => {
    const poolSnap = poolSnapshots.get(agent.slug);
    const info = rosterInfo.find((entry) => entry.slug === agent.slug);
    const activityParts = [
      `inbox ${(info?.inbox_unread ?? 0)}`,
      `outbox ${(info?.outbox_total ?? 0)}`,
      `threads ${info?.active_threads ?? 0}`,
    ];
    if (info && info.thread_names.length > 0) {
      activityParts.push(info.thread_names.slice(0, 2).join(", "));
    }
    const threadActivity = activityParts.join(" \u00b7 ");

    // If pool has a live snapshot, use its status/cost/tokens and append
    // thread context to its activity string.
    if (poolSnap) {
      return {
        ...poolSnap,
        activity: poolSnap.status === "idle" || poolSnap.status === "completed"
          ? threadActivity
          : `${poolSnap.activity} \u00b7 ${threadActivity}`,
      };
    }

    // Fallback for agents not yet in the pool
    return {
      slug: agent.slug,
      name: agent.name,
      status: "idle" as const,
      modelLabel: agent.model,
      modelAltLabel: agent.modelAlt,
      activity: threadActivity,
      turns: 0,
      totalTokens: 0,
      totalCost: 0,
    };
  });
}

function emitMessagingSnapshot(
  meetingId: string,
  brief: ParsedBrief,
  mode: MeetingMode,
  constraintsName: string,
  constraintValues: ConstraintSet,
  tracker: ConstraintTracker,
  startedAt: Date,
  threadState: ThreadState,
  allAgents: AgentConfig[],
  rosterAgents: AgentConfig[],
  phase: number,
  phaseLabel: string,
  presidentNote: string,
  callbacks: MessagingMeetingCallbacks,
  pool: SessionPool,
): void {
  if (!callbacks.onSnapshot) return;

  const graph = buildThreadGraph(threadState);
  const allMessages = getAllMessages(threadState);
  callbacks.onSnapshot({
    meetingId,
    briefTitle: brief.title,
    mode,
    constraints: constraintsName,
    phase,
    phaseLabel,
    round: tracker.currentRound,
    startedAt: startedAt.toISOString(),
    budgetUsed: tracker.totalCost,
    budgetLimit: constraintValues.budget,
    elapsedMinutes: tracker.elapsedMinutes,
    timeLimitMinutes: constraintValues.time_limit_minutes,
    roundsUsed: tracker.currentRound,
    maxRounds: constraintValues.max_debate_rounds,
    roster: rosterAgents.map((agent) => agent.slug),
    agents: buildMessagingAgentSnapshots(allAgents, rosterAgents, threadState, pool),
    presidentNote,
    transcript: allMessages.slice(-5).map((msg) => `[${msg.from}] ${msg.content.slice(0, 200)}`),
    threadGraphLines: renderThreadGraph(graph, threadState, "compact").split("\n"),
    disposition: "in-progress",
  });
}

function processScratchpadOutput(cwd: string, agentSlug: string, output: string): string {
  const update = extractScratchpadUpdate(output);
  if (update) {
    saveScratchpad(cwd, agentSlug, update);
  }
  return stripScratchpadBlock(output);
}

function describeMessagingAbortReason(err: unknown, signal?: AbortSignal): string {
  const errorMessage = err instanceof Error
    ? err.message
    : typeof err === "string"
      ? err
      : "Unknown error";

  if (signal?.aborted && signal.reason === "force-close") {
    return "Meeting was force-closed by operator.";
  }
  if (errorMessage === "Meeting cancelled during roster review.") {
    return errorMessage;
  }
  if (signal?.aborted) {
    return errorMessage === "Subagent was aborted"
      ? "Abort signal received."
      : `Abort signal received. Error: ${errorMessage}`;
  }
  return errorMessage;
}

function hasUsablePartialContent(content: string | undefined): boolean {
  return typeof content === "string" && content.trim().length > 0;
}

function isForceCloseRequested(signal?: AbortSignal): boolean {
  return signal?.aborted === true && signal.reason === "force-close";
}

function finalizeMessagingResult(
  memoPath: string,
  debateJsonPath: string,
  debateMarkdownPath: string,
  visualPaths: string[],
  disposition: MessagingMeetingResult["disposition"],
  brief: ParsedBrief,
  mode: MeetingMode,
  tracker: ConstraintTracker,
  roster: string[],
  abortReason?: string,
): MessagingMeetingResult {
  return {
    memoPath,
    debateJsonPath,
    debateMarkdownPath,
    visualPaths,
    disposition,
    abortReason,
    briefTitle: brief.title,
    mode,
    totalCost: tracker.totalCost,
    elapsedMinutes: tracker.elapsedMinutes,
    roster,
  };
}

async function runCeoWithRetry(
  cwd: string,
  pool: SessionPool,
  ceo: AgentConfig,
  systemPrompt: string,
  task: string,
  activity: string,
  callbacks: MessagingMeetingCallbacks,
  signal?: AbortSignal,
): Promise<{ content: string; tokenCount: number; cost: number }> {
  let result;
  try {
    result = await pool.runOne(cwd, ceo, systemPrompt, task, activity, signal);
  } catch (err: any) {
    if (signal?.reason === "force-close" && err?.message === "Subagent was aborted" && hasUsablePartialContent(err.partialResult?.content)) {
      callbacks.onStatus("CEO was interrupted by force-close. Using partial output.");
      return {
        content: err.partialResult.content,
        tokenCount: err.partialResult.tokenCount ?? 0,
        cost: err.partialResult.cost ?? 0,
      };
    }
    throw err;
  }

  if (result.exitCode === 0 && result.content) {
    return { content: result.content, tokenCount: result.tokenCount, cost: result.cost };
  }

  callbacks.onStatus(`CEO failed (${result.error ?? "no output"}). Retrying with simplified context...`);
  const simplifiedPrompt = [
    systemPrompt,
    "",
    "--- SIMPLIFIED CONTEXT (retry after failure) ---",
    "The previous attempt failed. Provide your best assessment with the information available.",
  ].join("\n");

  let retry;
  try {
    retry = await pool.runOne(cwd, ceo, simplifiedPrompt, task, `${activity} (retry)`, signal);
  } catch (err: any) {
    if (signal?.reason === "force-close" && err?.message === "Subagent was aborted" && hasUsablePartialContent(err.partialResult?.content)) {
      callbacks.onStatus("CEO retry was interrupted by force-close. Using partial output.");
      return {
        content: err.partialResult.content,
        tokenCount: result.tokenCount + (err.partialResult.tokenCount ?? 0),
        cost: result.cost + (err.partialResult.cost ?? 0),
      };
    }
    throw err;
  }
  const totalCost = result.cost + retry.cost;
  const totalTokens = result.tokenCount + retry.tokenCount;

  if (retry.exitCode === 0 && retry.content) {
    return { content: retry.content, tokenCount: totalTokens, cost: totalCost };
  }

  return {
    content: `[CEO failed after retry. Error: ${retry.error ?? "no output"}]`,
    tokenCount: totalTokens,
    cost: totalCost,
  };
}

interface MessagingMeetingSetup {
  framingContent: string;
  rosterAgents: AgentConfig[];
  rosterSlugs: string[];
  createdThreads: Thread[];
}

interface MessagingSynthesisPhaseConfig {
  phase: number;
  phaseLabel: string;
  statusMessage: string;
  forceClosedStatusMessage: string;
  snapshotNote: string;
  completionStatusMessage: string;
}

function buildMessagingFramingTask(
  framingIntro: string,
  constraintValues: ConstraintSet,
  nonCeo: AgentConfig[],
): string {
  return [
    framingIntro,
    "1. Restate the strategic question in one sentence.",
    "2. Define workstream threads for the key aspects of this decision.",
    `3. Select which board members should be consulted${constraintValues.max_roster_size ? ` (up to ${constraintValues.max_roster_size})` : ""}.`,
    "Output the structured JSON block as specified in the protocol.",
    `Available board members: ${nonCeo.map(a => `${a.slug} (${a.name}: ${a.description.slice(0, 80)})`).join("; ")}`,
    "4. Provide your initial framing and key questions for the board to address.",
  ].join("\n");
}

async function prepareMessagingMeeting(
  cwd: string,
  brief: ParsedBrief,
  allAgents: AgentConfig[],
  ceo: AgentConfig,
  meetingId: string,
  mode: MeetingMode,
  constraintsName: string,
  constraintValues: ConstraintSet,
  tracker: ConstraintTracker,
  threadState: ThreadState,
  startedAt: Date,
  callbacks: MessagingMeetingCallbacks,
  pool: SessionPool,
  framingIntro: string,
): Promise<MessagingMeetingSetup> {
  const nonCeo = getNonCeoAgents(allAgents);

  callbacks.onStatus("Phase 1: CEO framing the decision...");

  const ceoScratchpad = loadScratchpad(cwd, ceo.slug);
  const framingPrompt = composeMessagingFramingPrompt(ceo, brief, ceoScratchpad);
  const framingTask = buildMessagingFramingTask(framingIntro, constraintValues, nonCeo);

  const framingRes = await runCeoWithRetry(cwd, pool, ceo, framingPrompt, framingTask, "Framing the decision", callbacks, callbacks.signal);
  const framingContent = processScratchpadOutput(cwd, ceo.slug, framingRes.content);
  tracker.addCost(framingRes.cost);

  const parsed = parseWorkstreamsFromCeoOutput(framingContent);
  const rosterNames = parsed?.roster.map(r => r.name) ?? [];
  let rosterAgents = applyRosterLimit(resolveRoster(allAgents, rosterNames), constraintValues);
  const rosterRationale = parsed?.rationale ?? "Full board (CEO workstream selection could not be parsed)";

  tracker.pause();
  let rosterDecision;
  try {
    rosterDecision = await callbacks.onConfirmRoster(rosterAgents, nonCeo, rosterRationale);
  } finally {
    tracker.resume();
  }
  if (rosterDecision.action === "cancel") {
    callbacks.onStatus("Meeting cancelled during roster review.");
    throw new Error("Meeting cancelled during roster review.");
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

  const rosterSlugs = ["ceo", ...rosterAgents.map(a => a.slug)];
  pool.ensureAgents(rosterAgents, "Awaiting first round");

  const workstreams = parsed?.workstreams ?? [{ title: "General Discussion", description: brief.title }];
  const createdThreads = workstreams.map(ws =>
    createThread(threadState, ws.title, "ceo", null, rosterSlugs),
  );

  // Only the first thread carries the CEO framing cost/tokens so the
  // serialized transcript does not double-count the shared broadcast.
  for (let i = 0; i < createdThreads.length; i++) {
    postMessage(
      threadState, "broadcast", "ceo", [],
      createdThreads[i].id, framingContent, 1, 0,
      i === 0 ? framingRes.tokenCount : 0,
      i === 0 ? framingRes.cost : 0,
    );
  }

  callbacks.onStatus(`Phase 1 complete. Created ${createdThreads.length} workstream(s). ${tracker.summary}`);
  emitMessagingSnapshot(
    meetingId,
    brief,
    mode,
    constraintsName,
    constraintValues,
    tracker,
    startedAt,
    threadState,
    allAgents,
    rosterAgents,
    1,
    "CEO Framing",
    "Framing complete. Roster confirmed.",
    callbacks,
    pool,
  );

  return {
    framingContent,
    rosterAgents,
    rosterSlugs,
    createdThreads,
  };
}

function collectMessagingVisuals(messages: ReturnType<typeof getAllMessages>): { label: string; code: string }[] {
  const allMermaid: { label: string; code: string }[] = [];
  for (const msg of messages) {
    for (const block of extractMermaidBlocks(msg.content)) {
      allMermaid.push({ label: `${msg.from}-${msg.type}`, code: block });
    }
  }
  return allMermaid;
}

function writeMessagingExpertise(
  cwd: string,
  meetingId: string,
  messages: ReturnType<typeof getAllMessages>,
): void {
  for (const msg of messages) {
    if (msg.content && msg.content.length > 100 && !msg.content.startsWith("[")) {
      writeExpertise(cwd, msg.from, meetingId, msg.content.slice(0, 500));
    }
  }
}

async function completeMessagingMeeting(
  cwd: string,
  brief: ParsedBrief,
  ceo: AgentConfig,
  framingContent: string,
  mode: MeetingMode,
  constraintsName: string,
  constraintValues: ConstraintSet,
  config: { budget_hard_stop: boolean; time_hard_stop: boolean },
  tracker: ConstraintTracker,
  threadState: ThreadState,
  startedAt: Date,
  meetingId: string,
  allAgents: AgentConfig[],
  rosterAgents: AgentConfig[],
  rosterSlugs: string[],
  createdThreads: Thread[],
  callbacks: MessagingMeetingCallbacks,
  pool: SessionPool,
  phaseConfig: MessagingSynthesisPhaseConfig,
): Promise<MessagingMeetingResult> {
  const forceClosed = isForceCloseRequested(callbacks.signal);
  callbacks.onStatus(
    forceClosed
      ? phaseConfig.forceClosedStatusMessage
      : phaseConfig.statusMessage,
  );
  emitMessagingSnapshot(
    meetingId,
    brief,
    mode,
    constraintsName,
    constraintValues,
    tracker,
    startedAt,
    threadState,
    allAgents,
    rosterAgents,
    phaseConfig.phase,
    phaseConfig.phaseLabel,
    forceClosed ? "Meeting force-closed. CEO synthesizing final decision." : phaseConfig.snapshotNote,
    callbacks,
    pool,
  );

  const synthExpertise = loadExpertise(cwd, ceo.slug);
  const ceoSynthScratchpad = loadScratchpad(cwd, ceo.slug);
  const synthPrompt = composeMessagingSynthesisPrompt(
    ceo, brief, framingContent,
    getAllThreads(threadState),
    getAllMessages(threadState),
    synthExpertise,
    ceoSynthScratchpad,
  );

  const earlyClose = !forceClosed && !tracker.canContinue(config.budget_hard_stop, config.time_hard_stop);
  const synthTask = forceClosed
    ? [
        "The operator force-closed the board meeting.",
        "Produce your final Strategic Brief using only the information gathered so far.",
        "Do not ask for another round of discussion.",
        "Explicitly call out which questions, risks, or workstreams remain unresolved because the meeting was interrupted.",
        "",
        "If the decision involves data worth visualizing, include Mermaid diagrams.",
      ].join("\n")
    : earlyClose
      ? "Constraints reached. Produce your final Strategic Brief with available data. Note any gaps. Reference thread outcomes."
      : [
          "Synthesize all thread discussions into your final Strategic Brief.",
          "Address disagreements explicitly. Reference specific threads and their resolution.",
          "",
          "If the decision involves data worth visualizing, include Mermaid diagrams.",
        ].join("\n");

  const synthSignal = forceClosed ? undefined : callbacks.signal;
  const synthRes = await runCeoWithRetry(cwd, pool, ceo, synthPrompt, synthTask, "Synthesizing final decision", callbacks, synthSignal);
  synthRes.content = processScratchpadOutput(cwd, ceo.slug, synthRes.content);
  tracker.addCost(synthRes.cost);

  if (createdThreads.length > 0) {
    postMessage(
      threadState, "broadcast", "ceo", [],
      createdThreads[0].id, synthRes.content,
      99, 0,
      synthRes.tokenCount, synthRes.cost,
    );
  }

  const resolveReason = forceClosed
    ? "meeting-force-closed" as const
    : earlyClose
      ? "constraints-exceeded" as const
      : "ceo-checkpoint" as const;
  const resolveSummary = forceClosed
    ? "Meeting force-closed after CEO final synthesis."
    : earlyClose
      ? "Meeting concluded early due to constraint limits."
      : "Meeting concluded by CEO synthesis.";
  resolveAllActiveThreads(threadState, resolveReason, resolveSummary);

  const allMessages = getAllMessages(threadState);
  const allMermaid = collectMessagingVisuals(allMessages);
  let visualPaths: string[] = [];

  const disposition = forceClosed
    ? "force-closed"
    : earlyClose
      ? (tracker.budgetState === "exceeded" ? "budget-exceeded" : "completed")
      : "completed";
  const abortReason = forceClosed ? "Meeting was force-closed by operator." : undefined;

  const messagingLog = serializeToMessagingLog(
    threadState, meetingId, brief.filePath, mode, constraintsName,
    rosterSlugs, startedAt.toISOString(), disposition,
  );
  const memoPath = writeMemo(
    cwd,
    brief.slug,
    forceClosed
      ? `${synthRes.content}\n\n[Boardroom force-closed. Reason: ${abortReason}]`
      : synthRes.content,
    startedAt,
  );
  const { jsonPath: debateJsonPath, mdPath: debateMarkdownPath } = writeMessagingLog(cwd, messagingLog);

  if (allMermaid.length > 0) {
    visualPaths = writeVisuals(cwd, meetingId, allMermaid);
    callbacks.onStatus(`Generated ${visualPaths.length} visual(s).`);
  }

  writeMessagingExpertise(cwd, meetingId, allMessages);

  callbacks.onStatus(`${phaseConfig.completionStatusMessage} (${disposition}). ${tracker.summary}`);
  pool.destroyAll();
  return finalizeMessagingResult(memoPath, debateJsonPath, debateMarkdownPath, visualPaths, disposition, brief, mode, tracker, rosterSlugs, abortReason);
}

function recoverMessagingMeeting(
  cwd: string,
  err: unknown,
  brief: ParsedBrief,
  mode: MeetingMode,
  constraintsName: string,
  tracker: ConstraintTracker,
  threadState: ThreadState,
  startedAt: Date,
  meetingId: string,
  rosterSlugs: string[],
  callbacks: MessagingMeetingCallbacks,
  pool: SessionPool,
  statusPrefix: string,
): MessagingMeetingResult {
  const disposition = callbacks.signal?.aborted ? getAbortDisposition(callbacks.signal) : "aborted";
  const abortReason = describeMessagingAbortReason(err, callbacks.signal);
  if (abortReason === "Meeting cancelled during roster review.") {
    callbacks.onStatus(abortReason);
  } else if (disposition === "force-closed") {
    callbacks.onStatus(`${statusPrefix} force-closed. Saving partial state...`);
  } else if (callbacks.signal?.aborted) {
    callbacks.onStatus(`${statusPrefix} aborted. Saving partial state...`);
  } else {
    callbacks.onStatus(`${statusPrefix} error: ${abortReason}. Saving partial state...`);
  }

  const reason = disposition === "force-closed" ? "meeting-force-closed" as const : "meeting-aborted" as const;
  const resolvedCount = resolveAllActiveThreads(
    threadState,
    reason,
    `Meeting ${disposition === "force-closed" ? "force-closed" : "aborted"}: ${abortReason}`,
  );
  const droppedCount = markUndeliverableMessages(threadState);

  if (resolvedCount > 0 || droppedCount > 0) {
    callbacks.onStatus(`Cleaned up: ${resolvedCount} thread(s) resolved, ${droppedCount} message(s) marked dropped.`);
  }

  callbacks.onStatus(formatRecoveryCheckpoint(threadState));

  const allMessages = getAllMessages(threadState);
  const messagingLog = serializeToMessagingLog(
    threadState, meetingId, brief.filePath, mode, constraintsName,
    rosterSlugs, startedAt.toISOString(), disposition,
  );

  const lastCeoMsg = allMessages.findLast(m => m.from === "ceo");
  const memoContent = lastCeoMsg?.content ?? "[Meeting aborted. No CEO synthesis available.]";

  const memoPath = writeMemo(cwd, brief.slug, memoContent, startedAt);
  const { jsonPath: debateJsonPath, mdPath: debateMarkdownPath } = writeMessagingLog(cwd, messagingLog);

  const allMermaid = collectMessagingVisuals(allMessages);
  const visualPaths = allMermaid.length > 0 ? writeVisuals(cwd, meetingId, allMermaid) : [];

  pool.destroyAll();
  return finalizeMessagingResult(memoPath, debateJsonPath, debateMarkdownPath, visualPaths, disposition, brief, mode, tracker, rosterSlugs, abortReason);
}

// --- Freeform Messaging Meeting ---

export async function runFreeformMessagingMeeting(
  cwd: string,
  brief: ParsedBrief,
  allAgents: AgentConfig[],
  mode: MeetingMode,
  constraintsName: string,
  constraintValues: ConstraintSet,
  config: { budget_hard_stop: boolean; time_hard_stop: boolean },
  callbacks: MessagingMeetingCallbacks,
): Promise<MessagingMeetingResult> {
  const ceo = allAgents.find(a => a.slug === "ceo");
  if (!ceo) throw new Error("CEO agent not found in agents/executive-board/");

  const meetingId = generateMeetingId(brief);
  const tracker = new ConstraintTracker(constraintValues);
  const threadState = createThreadState();
  const startedAt = new Date();
  let rosterSlugs = ["ceo"];
  const pool = new SessionPool(callbacks.onAgentUpdate);
  pool.ensureAgents([ceo], "Preparing framing");

  try {
    const {
      framingContent,
      rosterAgents,
      rosterSlugs: confirmedRosterSlugs,
      createdThreads,
    } = await prepareMessagingMeeting(
      cwd,
      brief,
      allAgents,
      ceo,
      meetingId,
      mode,
      constraintsName,
      constraintValues,
      tracker,
      threadState,
      startedAt,
      callbacks,
      pool,
      "Frame this decision for the executive board using the messaging model.",
    );
    rosterSlugs = confirmedRosterSlugs;

    // ── Debate Rounds (Semi-Live Queue) ──
    let debateRound = 0;

    const queueCallbacks: QueueCallbacks = {
      onStatus: callbacks.onStatus,
      onMessagePosted: () => {},
      signal: callbacks.signal,
    };

    while (tracker.canContinue(config.budget_hard_stop, config.time_hard_stop)) {
      debateRound++;
      tracker.incrementRound();

      callbacks.onStatus(`Round ${debateRound}/${constraintValues.max_debate_rounds}: ${rosterAgents.length} board members in semi-live queue...`);
      emitMessagingSnapshot(meetingId, brief, mode, constraintsName, constraintValues, tracker, startedAt, threadState, allAgents, rosterAgents, 1 + debateRound, `Debate Round ${debateRound}`, `Round ${debateRound}: semi-live discussion in progress.`, callbacks, pool);

      const roundResult = await runSemiLiveRound(
        cwd, threadState, rosterAgents, allAgents, brief, framingContent,
        1 + debateRound, debateRound, tracker, constraintValues, config,
        DEFAULT_ROUND_CONFIG, queueCallbacks, pool,
      );

      // Constraint warnings
      if (tracker.budgetState === "warn") {
        callbacks.onStatus(`Warning: Budget at 80%+ (${tracker.summary})`);
      }
      if (tracker.timeState === "warn") {
        callbacks.onStatus(`Warning: Time at 80%+ (${tracker.summary})`);
      }

      const failInfo = roundResult.failedAgents > 0 || roundResult.droppedMessages > 0
        ? ` (${roundResult.failedAgents} failed, ${roundResult.droppedMessages} dropped)`
        : "";
      callbacks.onStatus(`Round ${debateRound} complete (${roundResult.endReason}): ${roundResult.messagesPosted} messages${failInfo}. ${tracker.summary}`);
      emitMessagingSnapshot(meetingId, brief, mode, constraintsName, constraintValues, tracker, startedAt, threadState, allAgents, rosterAgents, 1 + debateRound, `Debate Round ${debateRound}`, `Round ${debateRound} complete.`, callbacks, pool);

      if (roundResult.endReason === "aborted") break;
      if (roundResult.endReason === "constraints") {
        callbacks.onStatus("Constraints reached. Moving to CEO synthesis.");
        break;
      }

      if (!tracker.canContinue(config.budget_hard_stop, config.time_hard_stop)) {
        callbacks.onStatus("Constraints reached. Moving to CEO synthesis.");
        break;
      }

      if (debateRound >= constraintValues.max_debate_rounds) break;

      // CEO checkpoint between rounds (multi-round only)
      if (constraintValues.max_debate_rounds > 1) {
        callbacks.onStatus("CEO reviewing thread discussions...");
        const ceoReviewScratchpad = loadScratchpad(cwd, ceo.slug);
        const reviewPrompt = composeMessagingSynthesisPrompt(
          ceo, brief, framingContent,
          getAllThreads(threadState),
          getAllMessages(threadState),
          loadExpertise(cwd, ceo.slug),
          ceoReviewScratchpad,
        );
        const reviewTask = [
          `Round ${debateRound} of ${constraintValues.max_debate_rounds}. Budget: ${tracker.summary}`,
          "Review all thread discussions.",
          "If critical disagreements remain, say 'NEED MORE DATA' to re-engage.",
          "Otherwise, proceed with your Strategic Brief.",
        ].join("\n");

        const reviewRes = await runCeoWithRetry(cwd, pool, ceo, reviewPrompt, reviewTask, "Reviewing discussions", callbacks, callbacks.signal);
        reviewRes.content = processScratchpadOutput(cwd, ceo.slug, reviewRes.content);
        tracker.addCost(reviewRes.cost);

        // Post CEO checkpoint as broadcast in first thread
        if (createdThreads.length > 0) {
          postMessage(
            threadState, "moderation", "ceo", [],
            createdThreads[0].id, reviewRes.content,
            1 + debateRound, debateRound,
            reviewRes.tokenCount, reviewRes.cost,
          );
        }

        const lower = reviewRes.content.toLowerCase();
        if (!lower.includes("need more data") && !lower.includes("another round") && !lower.includes("re-engage")) {
          break;
        }
        callbacks.onStatus("CEO requested another round of discussion.");
      } else {
        break;
      }
    }

    return completeMessagingMeeting(
      cwd,
      brief,
      ceo,
      framingContent,
      mode,
      constraintsName,
      constraintValues,
      config,
      tracker,
      threadState,
      startedAt,
      meetingId,
      allAgents,
      rosterAgents,
      rosterSlugs,
      createdThreads,
      callbacks,
      pool,
      {
        phase: 99,
        phaseLabel: "CEO Synthesis",
        statusMessage: "CEO synthesizing final decision...",
        forceClosedStatusMessage: "Meeting force-closed. CEO synthesizing final decision with available data...",
        snapshotNote: "CEO synthesizing final decision.",
        completionStatusMessage: "Meeting complete",
      },
    );

  } catch (err: any) {
    return recoverMessagingMeeting(
      cwd,
      err,
      brief,
      mode,
      constraintsName,
      tracker,
      threadState,
      startedAt,
      meetingId,
      rosterSlugs,
      callbacks,
      pool,
      "Meeting",
    );
  }
}

// --- Structured Messaging Meeting ---

/**
 * Structured meeting using the explicit messaging model.
 *
 * Maps structured phases to message threads:
 * - Phase 1 (CEO framing) → creates workstream threads
 * - Phase 2 (Parallel evaluation) → semi-live round with all roster agents
 * - Phase 3 (Stress test) → semi-live round with stress-test tagged agents
 * - Phase 4 (Conflict synthesis) → CEO checkpoint with optional re-engagement
 * - Phase 5 (Final decision) → CEO synthesis
 */
export async function runStructuredMessagingMeeting(
  cwd: string,
  brief: ParsedBrief,
  allAgents: AgentConfig[],
  constraintsName: string,
  constraintValues: ConstraintSet,
  config: { budget_hard_stop: boolean; time_hard_stop: boolean },
  callbacks: MessagingMeetingCallbacks,
): Promise<MessagingMeetingResult> {
  const ceo = allAgents.find(a => a.slug === "ceo");
  if (!ceo) throw new Error("CEO agent not found in agents/executive-board/");

  const meetingId = generateMeetingId(brief);
  const tracker = new ConstraintTracker(constraintValues);
  const threadState = createThreadState();
  const startedAt = new Date();
  let rosterSlugs = ["ceo"];
  const pool = new SessionPool(callbacks.onAgentUpdate);
  pool.ensureAgents([ceo], "Preparing framing");

  try {
    const {
      framingContent,
      rosterAgents,
      rosterSlugs: confirmedRosterSlugs,
      createdThreads,
    } = await prepareMessagingMeeting(
      cwd,
      brief,
      allAgents,
      ceo,
      meetingId,
      "structured",
      constraintsName,
      constraintValues,
      tracker,
      threadState,
      startedAt,
      callbacks,
      pool,
      "Frame this decision for the executive board in structured meeting mode.",
    );
    rosterSlugs = confirmedRosterSlugs;

    let reEngagementCount = 0;
    const MAX_RE_ENGAGEMENTS = 2;

    const queueCallbacks: QueueCallbacks = {
      onStatus: callbacks.onStatus,
      onMessagePosted: () => {},
      signal: callbacks.signal,
    };

    while (reEngagementCount <= MAX_RE_ENGAGEMENTS) {
      if (!tracker.canContinue(config.budget_hard_stop, config.time_hard_stop)) {
        callbacks.onStatus("Constraints reached. Skipping to CEO decision.");
        break;
      }

      // ── Phase 2: Parallel Evaluation (semi-live round) ──
      tracker.incrementRound();
      callbacks.onStatus(`Phase 2: Parallel evaluation (attempt ${reEngagementCount + 1}) via semi-live queue...`);
      emitMessagingSnapshot(meetingId, brief, "structured", constraintsName, constraintValues, tracker, startedAt, threadState, allAgents, rosterAgents, 2, `Parallel Evaluation (attempt ${reEngagementCount + 1})`, "Board members evaluating in semi-live queue.", callbacks, pool);

      const evalResult = await runSemiLiveRound(
        cwd, threadState, rosterAgents, allAgents, brief, framingContent,
        2, reEngagementCount + 1, tracker, constraintValues, config,
        DEFAULT_ROUND_CONFIG, queueCallbacks, pool,
      );

      const evalFailInfo = evalResult.failedAgents > 0 || evalResult.droppedMessages > 0
        ? ` (${evalResult.failedAgents} failed, ${evalResult.droppedMessages} dropped)`
        : "";
      callbacks.onStatus(`Phase 2 complete (${evalResult.endReason}): ${evalResult.messagesPosted} messages${evalFailInfo}. ${tracker.summary}`);
      emitMessagingSnapshot(meetingId, brief, "structured", constraintsName, constraintValues, tracker, startedAt, threadState, allAgents, rosterAgents, 2, `Parallel Evaluation (attempt ${reEngagementCount + 1})`, "Parallel evaluation complete.", callbacks, pool);

      if (evalResult.endReason === "aborted") break;
      if (!tracker.canContinue(config.budget_hard_stop, config.time_hard_stop)) break;

      // ── Phase 3: Stress Test (semi-live with stress-test agents) ──
      const stressAgents = findAgentsByTag(rosterAgents, "stress-test");

      if (stressAgents.length > 0) {
        callbacks.onStatus("Phase 3: Stress test via semi-live queue...");
        emitMessagingSnapshot(meetingId, brief, "structured", constraintsName, constraintValues, tracker, startedAt, threadState, allAgents, rosterAgents, 3, "Stress Test", "Running adversarial stress test.", callbacks, pool);

        // Create a stress-test thread
        const stressThread = createThread(threadState, "Stress Test", "ceo");
        postMessage(
          threadState, "moderation", "ceo", stressAgents.map(a => a.slug),
          stressThread.id,
          "Challenge the board's assessments. Find weak assumptions, missing risks, and blind spots.",
          3, reEngagementCount + 1, 0, 0,
        );

        const stressResult = await runSemiLiveRound(
          cwd, threadState, stressAgents, allAgents, brief, framingContent,
          3, reEngagementCount + 1, tracker, constraintValues, config,
          { maxMessagesPerRound: 10, roundTimeoutSeconds: 120 },
          queueCallbacks, pool,
        );

        const stressFailInfo = stressResult.failedAgents > 0 || stressResult.droppedMessages > 0
          ? ` (${stressResult.failedAgents} failed, ${stressResult.droppedMessages} dropped)`
          : "";
        callbacks.onStatus(`Phase 3 complete (${stressResult.endReason}): ${stressResult.messagesPosted} messages${stressFailInfo}. ${tracker.summary}`);
      }

      if (!tracker.canContinue(config.budget_hard_stop, config.time_hard_stop)) break;

      // ── Phase 4: CEO Conflict Synthesis / Checkpoint ──
      callbacks.onStatus("Phase 4: CEO conflict synthesis...");
      emitMessagingSnapshot(meetingId, brief, "structured", constraintsName, constraintValues, tracker, startedAt, threadState, allAgents, rosterAgents, 4, "CEO Conflict Synthesis", "CEO reviewing conflicts and open questions.", callbacks, pool);

      const canReEngage = reEngagementCount < MAX_RE_ENGAGEMENTS && tracker.canContinue(config.budget_hard_stop, config.time_hard_stop);
      const ceoConflictScratchpad = loadScratchpad(cwd, ceo.slug);
      const conflictPrompt = composeMessagingSynthesisPrompt(
        ceo, brief, framingContent,
        getAllThreads(threadState),
        getAllMessages(threadState),
        loadExpertise(cwd, ceo.slug),
        ceoConflictScratchpad,
      );

      const reviewTask = canReEngage
        ? [
            `Review all thread discussions. Re-engagements left: ${MAX_RE_ENGAGEMENTS - reEngagementCount}. Budget: ${tracker.summary}`,
            "If critical disagreements remain, say 'NEED MORE DATA' to re-engage.",
            "Otherwise, produce your Strategic Brief.",
          ].join("\n")
        : "Final round. Produce your Strategic Brief now.";

      const reviewRes = await runCeoWithRetry(cwd, pool, ceo, conflictPrompt, reviewTask, "Conflict synthesis", callbacks, callbacks.signal);
      reviewRes.content = processScratchpadOutput(cwd, ceo.slug, reviewRes.content);
      tracker.addCost(reviewRes.cost);

      // Post CEO review as moderation
      if (createdThreads.length > 0) {
        postMessage(
          threadState, "moderation", "ceo", [],
          createdThreads[0].id, reviewRes.content,
          4, reEngagementCount + 1,
          reviewRes.tokenCount, reviewRes.cost,
        );
      }

      const lower = reviewRes.content.toLowerCase();
      if (!canReEngage || (!lower.includes("need more data") && !lower.includes("another round") && !lower.includes("re-engage"))) {
        break;
      }

      reEngagementCount++;
      callbacks.onStatus(`CEO re-engaging board (attempt ${reEngagementCount + 1})...`);
    }

    return completeMessagingMeeting(
      cwd,
      brief,
      ceo,
      framingContent,
      "structured",
      constraintsName,
      constraintValues,
      config,
      tracker,
      threadState,
      startedAt,
      meetingId,
      allAgents,
      rosterAgents,
      rosterSlugs,
      createdThreads,
      callbacks,
      pool,
      {
        phase: 5,
        phaseLabel: "CEO Final Decision",
        statusMessage: "Phase 5: CEO final decision...",
        forceClosedStatusMessage: "Structured meeting force-closed. CEO synthesizing final decision with available data...",
        snapshotNote: "CEO synthesizing the final decision.",
        completionStatusMessage: "Structured meeting complete",
      },
    );

  } catch (err: any) {
    return recoverMessagingMeeting(
      cwd,
      err,
      brief,
      "structured",
      constraintsName,
      tracker,
      threadState,
      startedAt,
      meetingId,
      rosterSlugs,
      callbacks,
      pool,
      "Structured meeting",
    );
  }
}
