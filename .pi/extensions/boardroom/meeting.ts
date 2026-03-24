import type {
  AgentConfig,
  AgentRuntimeUpdate,
  ConversationEntry,
  MeetingMode,
  MeetingProgressSnapshot,
  MeetingState,
  ParsedBrief,
  ConstraintSet,
} from "./types.js";
import { ConstraintTracker } from "./constraints.js";
import { addEntry, closeLog, createConversationLog, extractAddressees } from "./conversation.js";
import { composeAssessmentPrompt, composeFramingPrompt, composeSynthesisPrompt, loadExpertise } from "./prompt-composer.js";
import { SessionPool } from "./runtime.js";
import { writeConversationLog, writeExpertise, writeMemo, writeVisuals } from "./artifacts.js";
import { loadScratchpad, saveScratchpad, extractScratchpadUpdate, stripScratchpadBlock } from "./scratchpad.js";
import { extractMermaidBlocks } from "./visuals.js";
import { findAgentsByTag } from "./agents.js";

export interface MeetingCallbacks {
  onStatus: (msg: string) => void;
  onAgentUpdate?: (update: AgentRuntimeUpdate) => void;
  onSnapshot?: (snapshot: MeetingProgressSnapshot) => void;
  onConfirmRoster: (names: string[], rationale: string) => Promise<boolean>;
  signal?: AbortSignal;
}

export interface MeetingResult {
  memoPath: string;
  debateJsonPath: string;
  debateMarkdownPath: string;
  visualPaths: string[];
  disposition: MeetingDisposition;
  briefTitle: string;
  mode: MeetingMode;
  totalCost: number;
  elapsedMinutes: number;
  roster: string[];
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

function parseCeoDisposition(content: string): "iterate" | "close" {
  const lower = content.toLowerCase();
  if (lower.includes("need more data") || lower.includes("another round") || lower.includes("re-engage")) {
    return "iterate";
  }
  return "close";
}

function getNonCeoAgents(allAgents: AgentConfig[]): AgentConfig[] {
  return allAgents.filter(a => a.slug !== "ceo" && a.slug !== "executive-board-orchestrator");
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

function processScratchpadOutput(cwd: string, agentSlug: string, output: string): string {
  const update = extractScratchpadUpdate(output);
  if (update) {
    saveScratchpad(cwd, agentSlug, update);
  }
  return stripScratchpadBlock(output);
}

function collectMermaidFromLog(log: ReturnType<typeof createConversationLog>): { label: string; code: string }[] {
  const all: { label: string; code: string }[] = [];
  for (const entry of log.entries) {
    const blocks = extractMermaidBlocks(entry.content);
    for (const block of blocks) {
      all.push({ label: `${entry.from}-${entry.role}`, code: block });
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
    agents: pool.snapshot(),
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
  callbacks: MeetingCallbacks,
  signal?: AbortSignal,
): Promise<{ content: string; tokenCount: number; cost: number }> {
  const result = await pool.runOne(cwd, ceo, systemPrompt, task, signal);

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

  const retry = await pool.runOne(cwd, ceo, simplifiedPrompt, task, signal);
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
): MeetingResult {
  closeLog(log, "aborted");

  const lastEntry = log.entries.findLast(e => e.from === "ceo");
  const memoContent = lastEntry?.content
    ?? "[Meeting aborted. No CEO synthesis available. See debate log for partial data.]";

  const memoPath = writeMemo(cwd, brief.slug, memoContent, startedAt);
  const { jsonPath, mdPath } = writeConversationLog(cwd, log, startedAt);

  const allMermaid = collectMermaidFromLog(log);
  const visualPaths = allMermaid.length > 0 ? writeVisuals(cwd, meetingId, allMermaid) : [];

  return { memoPath, debateJsonPath: jsonPath, debateMarkdownPath: mdPath, visualPaths };
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
      "2. Select which board members should be consulted. Output a JSON block:",
      "```json",
      '{ "roster": [{ "name": "<agent-slug>", "reason": "<why needed>" }], "rationale": "<overall reasoning>" }',
      "```",
      `Available board members: ${getNonCeoAgents(allAgents).map(a => `${a.slug} (${a.name}: ${a.description.slice(0, 80)})`).join("; ")}`,
      "3. Provide your initial framing and key questions for the board to address.",
    ].join("\n");

    const framingRes = await runCeoWithRetry(cwd, pool, ceo, framingPrompt, framingTask, callbacks, callbacks.signal);
    framingRes.content = processScratchpadOutput(cwd, ceo.slug, framingRes.content);
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
    const rosterAgents = resolveRoster(allAgents, framingRes.content);
    log.roster = ["ceo", ...rosterAgents.map(a => a.slug)];
    state.roster = rosterAgents;

    const rosterParsed = parseRosterJson(framingRes.content);
    const rosterRationale = rosterParsed?.rationale ?? "Full board (CEO roster selection could not be parsed)";

    const confirmed = await callbacks.onConfirmRoster(rosterAgents.map(a => a.name), rosterRationale);
    if (!confirmed) {
      rosterAgents.length = 0;
      rosterAgents.push(...getNonCeoAgents(allAgents));
      log.roster = ["ceo", ...rosterAgents.map(a => a.slug)];
    }

    // --- Debate Rounds ---
    let debateRound = 0;
    let lastAssessmentEntries: ConversationEntry[] = [];

    while (tracker.canContinue(config.budget_hard_stop, config.time_hard_stop)) {
      debateRound++;
      tracker.incrementRound();
      state.phase = 1 + debateRound;
      state.round = debateRound;

      const phaseLabel = `Debate Round ${debateRound}`;
      callbacks.onStatus(`Round ${debateRound}/${constraintValues.max_debate_rounds}: ${rosterAgents.length} board members assessing in parallel...`);
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

      if (!tracker.canContinue(config.budget_hard_stop, config.time_hard_stop)) {
        callbacks.onStatus("Constraints reached. Moving to CEO final synthesis.");
        break;
      }

      if (debateRound >= constraintValues.max_debate_rounds) break;

      if (constraintValues.max_debate_rounds > 1) {
        const ceoReviewScratchpad = loadScratchpad(cwd, ceo.slug);
        const reviewPrompt = composeSynthesisPrompt(ceo, brief, framingRes.content, lastAssessmentEntries, ceoExpertise, ceoReviewScratchpad);
        const reviewTask = [
          `Round ${debateRound} of ${constraintValues.max_debate_rounds}. Budget: ${tracker.summary}`,
          "If critical disagreements remain, say 'NEED MORE DATA' to re-engage.",
          "Otherwise, proceed with your Strategic Brief.",
        ].join("\n");

        const reviewRes = await runCeoWithRetry(cwd, pool, ceo, reviewPrompt, reviewTask, callbacks, callbacks.signal);
        reviewRes.content = processScratchpadOutput(cwd, ceo.slug, reviewRes.content);
        tracker.addCost(reviewRes.cost);

        addEntry(log, nextEntryId(state), "ceo", rosterAgents.map(a => a.slug),
          null, state.phase, debateRound, "review",
          reviewRes.content, reviewRes.tokenCount, reviewRes.cost);

        if (parseCeoDisposition(reviewRes.content) === "close") break;
        callbacks.onStatus("CEO requested another round.");
      } else {
        break;
      }
    }

    // --- Final Synthesis ---
    const synthPhase = state.phase + 1;
    state.phase = synthPhase;
    callbacks.onStatus("CEO synthesizing final decision...");
    emitSnapshot(state, tracker, pool, "CEO Synthesis", "Synthesizing final decision...", callbacks);

    const allAssessments = log.entries.filter(e => e.role === "assessment" || e.role === "review");
    const synthExpertise = loadExpertise(cwd, ceo.slug);
    const ceoSynthScratchpad = loadScratchpad(cwd, ceo.slug);
    const synthPrompt = composeSynthesisPrompt(ceo, brief, framingRes.content, allAssessments, synthExpertise, ceoSynthScratchpad);

    const earlyClose = !tracker.canContinue(config.budget_hard_stop, config.time_hard_stop);
    const synthTask = earlyClose
      ? "Constraints reached. Produce your final Strategic Brief with available data. Note any gaps."
      : [
          "Synthesize all board input into your final Strategic Brief. Address disagreements explicitly.",
          "",
          "If the decision involves data worth visualizing (costs, timelines, risk matrices, architectures),",
          "include one or more Mermaid diagram blocks in your output using ```mermaid fences.",
        ].join("\n");

    const synthRes = await runCeoWithRetry(cwd, pool, ceo, synthPrompt, synthTask, callbacks, callbacks.signal);
    synthRes.content = processScratchpadOutput(cwd, ceo.slug, synthRes.content);
    tracker.addCost(synthRes.cost);

    addEntry(log, nextEntryId(state), "ceo", rosterAgents.map(a => a.slug),
      null, synthPhase, 0, "synthesis", synthRes.content, synthRes.tokenCount, synthRes.cost);

    // --- Extract Visuals ---
    const allMermaid = collectMermaidFromLog(log);
    let visualPaths: string[] = [];

    // --- Write Artifacts ---
    const disposition = earlyClose
      ? (tracker.budgetState === "exceeded" ? "budget-exceeded" as const : "completed" as const)
      : "completed" as const;

    state.disposition = disposition;
    closeLog(log, disposition);
    const memoPath = writeMemo(cwd, brief.slug, synthRes.content, startedAt);
    const { jsonPath: debateJsonPath, mdPath: debateMarkdownPath } = writeConversationLog(cwd, log, startedAt);

    if (allMermaid.length > 0) {
      visualPaths = writeVisuals(cwd, meetingId, allMermaid);
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
      disposition, briefTitle: brief.title, mode,
      totalCost: tracker.totalCost, elapsedMinutes: tracker.elapsedMinutes,
      roster: ["ceo", ...rosterAgents.map(a => a.slug)],
    };

  } catch (err: any) {
    pool.destroyAll();
    if (err.message === "Subagent was aborted" || callbacks.signal?.aborted) {
      callbacks.onStatus("Meeting aborted. Saving partial log...");
      state.disposition = "aborted";
      emitSnapshot(state, tracker, pool, "Aborted", "Meeting aborted.", callbacks);
      const partial = savePartialArtifacts(cwd, meetingId, brief, log, startedAt);
      return {
        ...partial, disposition: "aborted" as const, briefTitle: brief.title, mode,
        totalCost: tracker.totalCost, elapsedMinutes: tracker.elapsedMinutes,
        roster: ["ceo", ...state.roster.map(a => a.slug)],
      };
    }
    callbacks.onStatus(`Meeting error: ${err.message}. Saving partial log...`);
    state.disposition = "aborted";
    emitSnapshot(state, tracker, pool, "Error", `Error: ${err.message}`, callbacks);
    const partial = savePartialArtifacts(cwd, meetingId, brief, log, startedAt);
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
      "2. Select board members with roster JSON:",
      "```json",
      '{ "roster": [{ "name": "<slug>", "reason": "<why>" }], "rationale": "<reasoning>" }',
      "```",
      `Available: ${nonCeo.map(a => `${a.slug} (${a.name})`).join("; ")}`,
      "3. Frame the key questions for parallel evaluation.",
    ].join("\n");

    const framingRes = await runCeoWithRetry(cwd, pool, ceo, framingPrompt, framingTask, callbacks, callbacks.signal);
    framingRes.content = processScratchpadOutput(cwd, ceo.slug, framingRes.content);
    tracker.addCost(framingRes.cost);

    const framingEntry = addEntry(
      log, nextEntryId(state), "ceo", nonCeo.map(a => a.slug),
      null, 1, 0, "framing", framingRes.content, framingRes.tokenCount, framingRes.cost,
    );

    const rosterAgents = resolveRoster(allAgents, framingRes.content);
    log.roster = ["ceo", ...rosterAgents.map(a => a.slug)];
    state.roster = rosterAgents;

    const rosterParsed = parseRosterJson(framingRes.content);
    await callbacks.onConfirmRoster(rosterAgents.map(a => a.name), rosterParsed?.rationale ?? "Full board");

    emitConstraintWarnings(tracker, callbacks);
    emitSnapshot(state, tracker, pool, "CEO Framing", "Framing complete. Roster confirmed.", callbacks);

    let reEngagementCount = 0;
    const MAX_RE_ENGAGEMENTS = 2;

    while (reEngagementCount <= MAX_RE_ENGAGEMENTS) {
      if (!tracker.canContinue(config.budget_hard_stop, config.time_hard_stop)) {
        callbacks.onStatus("Constraints reached. Skipping to CEO decision.");
        break;
      }

      // Phase 2: Parallel Evaluation
      state.phase = 2;
      tracker.incrementRound();
      const evalLabel = `Parallel Evaluation (attempt ${reEngagementCount + 1})`;
      callbacks.onStatus(`Phase 2: ${evalLabel}...`);
      emitSnapshot(state, tracker, pool, evalLabel, "Board members evaluating in parallel.", callbacks);

      const priorAssessments = log.entries.filter(e => e.role === "assessment");
      const agentTasks = rosterAgents.map(agent => {
        const expertise = loadExpertise(cwd, agent.slug);
        const agentScratchpad = loadScratchpad(cwd, agent.slug);
        const prompt = composeAssessmentPrompt(agent, brief, framingRes.content, priorAssessments, expertise, agentScratchpad);
        return {
          agent,
          systemPrompt: prompt,
          task: `Evaluate this decision as ${agent.name}. Follow your output format.`,
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
            framingEntry.id, 2, reEngagementCount + 1, "assessment",
            `[${agent.name} failed: ${result.error ?? "no output"}]`, result.tokenCount, result.cost);
          continue;
        }

        result.content = processScratchpadOutput(cwd, agent.slug, result.content);
        const addressees = extractAddressees(result.content, rosterSlugs.filter(s => s !== agent.slug), allAgents);
        addEntry(log, nextEntryId(state), agent.slug,
          addressees.length > 0 ? ["ceo", ...addressees] : ["ceo"],
          framingEntry.id, 2, reEngagementCount + 1, "assessment",
          result.content, result.tokenCount, result.cost);
      }

      emitConstraintWarnings(tracker, callbacks);
      emitSnapshot(state, tracker, pool, evalLabel, "Evaluation complete.", callbacks);
      if (!tracker.canContinue(config.budget_hard_stop, config.time_hard_stop)) break;

      // Phase 3: Stress Test
      state.phase = 3;
      callbacks.onStatus("Phase 3: Stress test...");
      emitSnapshot(state, tracker, pool, "Stress Test", "Running adversarial review.", callbacks);

      const stressAgents = findAgentsByTag(rosterAgents, "stress-test");

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
          };
        });

        const stressResults = await pool.runParallel(cwd, stressTasks, callbacks.signal);
        for (let i = 0; i < stressResults.length; i++) {
          tracker.addCost(stressResults[i].cost);
          if (stressResults[i].exitCode !== 0 || !stressResults[i].content) {
            callbacks.onStatus(`${stressAgents[i].name} failed in stress test. Continuing.`);
            addEntry(log, nextEntryId(state), stressAgents[i].slug, ["ceo"],
              null, 3, reEngagementCount + 1, "stress-test",
              `[${stressAgents[i].name} failed]`, stressResults[i].tokenCount, stressResults[i].cost);
            continue;
          }
          stressResults[i].content = processScratchpadOutput(cwd, stressAgents[i].slug, stressResults[i].content);
          const challenged = extractAddressees(stressResults[i].content, rosterSlugs, allAgents);
          addEntry(log, nextEntryId(state), stressAgents[i].slug,
            challenged.length > 0 ? challenged : ["ceo"],
            null, 3, reEngagementCount + 1, "stress-test",
            stressResults[i].content, stressResults[i].tokenCount, stressResults[i].cost);
        }
      }

      emitConstraintWarnings(tracker, callbacks);
      emitSnapshot(state, tracker, pool, "Stress Test", "Stress test complete.", callbacks);
      if (!tracker.canContinue(config.budget_hard_stop, config.time_hard_stop)) break;

      // Phase 4: CEO conflict synthesis
      state.phase = 4;
      callbacks.onStatus("Phase 4: Conflict synthesis...");
      emitSnapshot(state, tracker, pool, "Conflict Synthesis", "CEO reviewing disagreements.", callbacks);

      const allEntries = log.entries.filter(e => e.role === "assessment" || e.role === "stress-test");
      const ceoConflictScratchpad = loadScratchpad(cwd, ceo.slug);
      const synthPrompt = composeSynthesisPrompt(ceo, brief, framingRes.content, allEntries, loadExpertise(cwd, ceo.slug), ceoConflictScratchpad);
      const canReEngage = reEngagementCount < MAX_RE_ENGAGEMENTS && tracker.canContinue(config.budget_hard_stop, config.time_hard_stop);

      const reviewTask = canReEngage
        ? `Review all board input. If critical disagreements remain, say 'NEED MORE DATA'. Re-engagements left: ${MAX_RE_ENGAGEMENTS - reEngagementCount}. Budget: ${tracker.summary}. Otherwise, produce your Strategic Brief.`
        : "Final round. Produce your Strategic Brief now.";

      const reviewRes = await runCeoWithRetry(cwd, pool, ceo, synthPrompt, reviewTask, callbacks, callbacks.signal);
      reviewRes.content = processScratchpadOutput(cwd, ceo.slug, reviewRes.content);
      tracker.addCost(reviewRes.cost);
      addEntry(log, nextEntryId(state), "ceo", rosterAgents.map(a => a.slug),
        null, 4, reEngagementCount + 1, "conflict-synthesis",
        reviewRes.content, reviewRes.tokenCount, reviewRes.cost);

      emitSnapshot(state, tracker, pool, "Conflict Synthesis", "CEO synthesis complete.", callbacks);

      if (!canReEngage || parseCeoDisposition(reviewRes.content) === "close") break;

      reEngagementCount++;
      callbacks.onStatus(`CEO re-engaging board (attempt ${reEngagementCount + 1})...`);
    }

    // Phase 5: CEO Final Decision
    state.phase = 5;
    callbacks.onStatus("Phase 5: CEO final decision...");
    emitSnapshot(state, tracker, pool, "CEO Final Decision", "CEO producing final decision.", callbacks);

    const lastConflict = log.entries.findLast(e => e.role === "conflict-synthesis");
    let memoContent: string;

    if (lastConflict && parseCeoDisposition(lastConflict.content) === "close") {
      memoContent = lastConflict.content;
    } else {
      const finalEntries = log.entries.filter(e => e.role !== "framing");
      const ceoFinalScratchpad = loadScratchpad(cwd, ceo.slug);
      const finalPrompt = composeSynthesisPrompt(ceo, brief, framingRes.content, finalEntries, loadExpertise(cwd, ceo.slug), ceoFinalScratchpad);
      const finalTask = [
        "Produce your FINAL Strategic Brief.",
        "",
        "If the decision involves data worth visualizing (costs, timelines, risk matrices, architectures),",
        "include one or more Mermaid diagram blocks in your output using ```mermaid fences.",
      ].join("\n");
      const finalRes = await runCeoWithRetry(cwd, pool, ceo, finalPrompt, finalTask, callbacks, callbacks.signal);
      finalRes.content = processScratchpadOutput(cwd, ceo.slug, finalRes.content);
      tracker.addCost(finalRes.cost);
      addEntry(log, nextEntryId(state), "ceo", rosterAgents.map(a => a.slug),
        null, 5, 0, "final-decision", finalRes.content, finalRes.tokenCount, finalRes.cost);
      memoContent = finalRes.content;
    }

    // --- Extract Visuals ---
    const allMermaid = collectMermaidFromLog(log);
    let visualPaths: string[] = [];

    // Phase 6: Close
    const disposition = tracker.budgetState === "exceeded" ? "budget-exceeded" as const : "completed" as const;
    state.disposition = disposition;
    closeLog(log, disposition);
    const memoPath = writeMemo(cwd, brief.slug, memoContent, startedAt);
    const { jsonPath: debateJsonPath, mdPath: debateMarkdownPath } = writeConversationLog(cwd, log, startedAt);

    if (allMermaid.length > 0) {
      visualPaths = writeVisuals(cwd, meetingId, allMermaid);
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
      disposition, briefTitle: brief.title, mode: "structured" as const,
      totalCost: tracker.totalCost, elapsedMinutes: tracker.elapsedMinutes,
      roster: ["ceo", ...rosterAgents.map(a => a.slug)],
    };

  } catch (err: any) {
    pool.destroyAll();
    if (err.message === "Subagent was aborted" || callbacks.signal?.aborted) {
      callbacks.onStatus("Meeting aborted. Saving partial log...");
      state.disposition = "aborted";
      emitSnapshot(state, tracker, pool, "Aborted", "Meeting aborted.", callbacks);
      const partial = savePartialArtifacts(cwd, meetingId, brief, log, startedAt);
      return {
        ...partial, disposition: "aborted" as const, briefTitle: brief.title, mode: "structured" as const,
        totalCost: tracker.totalCost, elapsedMinutes: tracker.elapsedMinutes,
        roster: ["ceo", ...state.roster.map(a => a.slug)],
      };
    }
    callbacks.onStatus(`Meeting error: ${err.message}. Saving partial log...`);
    state.disposition = "aborted";
    emitSnapshot(state, tracker, pool, "Error", `Error: ${err.message}`, callbacks);
    const partial = savePartialArtifacts(cwd, meetingId, brief, log, startedAt);
    return {
      ...partial, disposition: "aborted" as const, briefTitle: brief.title, mode: "structured" as const,
      totalCost: tracker.totalCost, elapsedMinutes: tracker.elapsedMinutes,
      roster: ["ceo", ...state.roster.map(a => a.slug)],
    };
  }
}
