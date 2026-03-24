/**
 * Semi-live intra-round queue for boardroom messaging.
 *
 * Within a round, agents can exchange messages. The round ends when:
 * - All active threads go quiet (no pending replies)
 * - A configurable time slice is reached
 * - CEO forces a checkpoint
 * - Message turn limit is reached
 *
 * Each message turn counts against budget/time accounting.
 */

import type { AgentConfig, ParsedBrief, ConstraintSet } from "./types.js";
import type { ThreadState, RoutedMessage, MessageType, Thread } from "./messaging-types.js";
import {
  postMessage,
  createThread,
  projectAgentContext,
  markInboxRead,
  getActiveThreads,
  getQuietThreads,
  getAllThreads,
  buildRoomSummary,
  autoResolveConvergedThreads,
} from "./thread-manager.js";
import {
  composeMessagingAssessmentPrompt,
  parseRoutingHeaders,
} from "./messaging-prompts.js";
import { loadExpertise } from "./prompt-composer.js";
import { loadScratchpad, saveScratchpad, extractScratchpadUpdate, stripScratchpadBlock } from "./scratchpad.js";
import { runAgent } from "./runner.js";
import { ConstraintTracker } from "./constraints.js";

export interface QueueCallbacks {
  onStatus: (msg: string) => void;
  onMessagePosted: (msg: RoutedMessage) => void;
  signal?: AbortSignal;
}

export interface RoundConfig {
  /** Max messages in a single round before forcing checkpoint */
  maxMessagesPerRound: number;
  /** Max seconds for a single round */
  roundTimeoutSeconds: number;
}

export const DEFAULT_ROUND_CONFIG: RoundConfig = {
  maxMessagesPerRound: 20,
  roundTimeoutSeconds: 180, // 3 minutes
};

export interface RoundResult {
  messagesPosted: number;
  failedAgents: number;
  droppedMessages: number;
  totalCost: number;
  totalTokens: number;
  endReason: "quiet" | "time-cap" | "message-cap" | "ceo-checkpoint" | "constraints" | "aborted";
}

/**
 * Run a single semi-live round.
 *
 * Agents with pending inbox messages or pending reply obligations
 * are queued for execution. The queue drains until a termination
 * condition is met.
 */
/** Get threads that can receive new messages (active or quiet). */
function getPostableThreads(threadState: ThreadState): Thread[] {
  return getAllThreads(threadState).filter(t => t.status === "active" || t.status === "quiet");
}

export async function runSemiLiveRound(
  cwd: string,
  threadState: ThreadState,
  rosterAgents: AgentConfig[],
  allAgents: AgentConfig[],
  brief: ParsedBrief,
  ceoFraming: string,
  phase: number,
  round: number,
  tracker: ConstraintTracker,
  constraintValues: ConstraintSet,
  config: { budget_hard_stop: boolean; time_hard_stop: boolean },
  roundConfig: RoundConfig,
  callbacks: QueueCallbacks,
): Promise<RoundResult> {
  const roundStart = Date.now();
  let messagesPosted = 0;
  let failedAgents = 0;
  let droppedMessages = 0;
  let totalCost = 0;
  let totalTokens = 0;
  let endReason: RoundResult["endReason"] = "quiet";

  // Build initial queue: agents with unread inbox or pending replies
  const agentQueue = new Set<string>();

  // On first pass of a round, queue all roster agents
  if (round === 1) {
    for (const agent of rosterAgents) {
      agentQueue.add(agent.slug);
    }
  } else {
    // Queue agents with unread messages or pending reply obligations
    for (const agent of rosterAgents) {
      const inbox = threadState.agent_inboxes.get(agent.slug);
      if (inbox && inbox.length > 0) {
        agentQueue.add(agent.slug);
      }
      // Check if agent has pending reply obligations in any thread
      for (const [, thread] of threadState.threads) {
        if (thread.pending_replies.includes(agent.slug)) {
          agentQueue.add(agent.slug);
        }
      }
    }
  }

  // Process queue
  while (agentQueue.size > 0) {
    // Check termination conditions
    if (callbacks.signal?.aborted) {
      endReason = "aborted";
      break;
    }

    if (!tracker.canContinue(config.budget_hard_stop, config.time_hard_stop)) {
      endReason = "constraints";
      break;
    }

    if (messagesPosted >= roundConfig.maxMessagesPerRound) {
      endReason = "message-cap";
      break;
    }

    const elapsed = (Date.now() - roundStart) / 1000;
    if (elapsed >= roundConfig.roundTimeoutSeconds) {
      endReason = "time-cap";
      break;
    }

    // Pick next agent from queue
    const nextSlug = agentQueue.values().next().value;
    if (!nextSlug) break;
    agentQueue.delete(nextSlug);

    const agent = rosterAgents.find(a => a.slug === nextSlug);
    if (!agent) continue;

    try {
      // Build context and run agent
      const expertise = loadExpertise(cwd, agent.slug);
      const scratchpad = loadScratchpad(cwd, agent.slug);
      const context = projectAgentContext(threadState, agent.slug, buildRoomSummary(threadState, agent.slug));
      const prompt = composeMessagingAssessmentPrompt(agent, brief, ceoFraming, context, expertise, scratchpad);

      const task = round === 1
        ? `Provide your assessment as ${agent.name}. Use routing headers to direct your response.`
        : `Continue the discussion as ${agent.name}. Respond to unread messages. Use routing headers.`;

      callbacks.onStatus(`${agent.name} responding...`);

      const result = await runAgent(cwd, agent.slug, agent.model, prompt, task, callbacks.signal);
      tracker.addCost(result.cost);
      totalCost += result.cost;
      totalTokens += result.tokenCount;

      if (result.exitCode !== 0 || !result.content) {
        failedAgents++;
        callbacks.onStatus(`${agent.name} failed: ${result.error ?? "no output"}`);
        // Post failure notice in first postable thread
        const postableThreads = getPostableThreads(threadState);
        if (postableThreads.length > 0) {
          const failMsg = postMessage(
            threadState, "broadcast", agent.slug, [],
            postableThreads[0].id,
            `[${agent.name} failed to respond: ${result.error ?? "process error"}]`,
            phase, round, result.tokenCount, result.cost,
          );
          callbacks.onMessagePosted(failMsg);
          messagesPosted++;
        }
        continue;
      }

      // Process scratchpad (file I/O errors should not crash the round)
      let content = result.content;
      const scratchpadUpdate = extractScratchpadUpdate(content);
      if (scratchpadUpdate) {
        try {
          saveScratchpad(cwd, agent.slug, scratchpadUpdate);
        } catch (scratchpadErr: any) {
          callbacks.onStatus(`${agent.name}: scratchpad save failed (${scratchpadErr.message ?? "unknown"}). Continuing.`);
        }
      }
      content = stripScratchpadBlock(content);

      // Parse routing headers
      const routing = parseRoutingHeaders(content);

      // Determine target thread (active or quiet threads can receive messages)
      let targetThread = getPostableThreads(threadState)[0];
      if (routing.replyTo) {
        const replyMsg = threadState.messages.get(routing.replyTo);
        if (replyMsg) {
          const t = threadState.threads.get(replyMsg.thread_id);
          if (t && (t.status === "active" || t.status === "quiet")) {
            targetThread = t;
          }
          // If reply-to references a resolved/closed thread, fall through to default
        }
      }

      // Handle child thread creation
      if (routing.newThread && targetThread) {
        const childThread = createThread(threadState, routing.newThread, agent.slug, targetThread.id);
        callbacks.onStatus(`${agent.name} created child thread: "${routing.newThread}"`);
        targetThread = childThread;
      }

      if (!targetThread) {
        droppedMessages++;
        callbacks.onStatus(`${agent.name}: no active thread to post in. Message dropped.`);
        continue;
      }

      // Determine message type
      let msgType: MessageType = "broadcast";
      if (routing.type === "direct" || routing.type === "request-reply" || routing.type === "reply" || routing.type === "ceo-only") {
        msgType = routing.type as MessageType;
      }
      const to = routing.to.length > 0 ? routing.to : (msgType === "ceo-only" ? ["ceo"] : []);

      const posted = postMessage(
        threadState, msgType, agent.slug, to,
        targetThread.id, routing.content,
        phase, round, result.tokenCount, result.cost,
        routing.replyTo,
      );

      callbacks.onMessagePosted(posted);
      messagesPosted++;

      // Mark agent's inbox as read
      markInboxRead(threadState, agent.slug);

      // Re-queue agents that received this message (if they have unread inbox)
      const recipients = msgType === "broadcast"
        ? rosterAgents.filter(a => a.slug !== agent.slug).map(a => a.slug)
        : to;

      for (const recipientSlug of recipients) {
        const recipientInbox = threadState.agent_inboxes.get(recipientSlug);
        if (recipientInbox && recipientInbox.length > 0) {
          const recipientAgent = rosterAgents.find(a => a.slug === recipientSlug);
          if (recipientAgent) {
            agentQueue.add(recipientSlug);
          }
        }
      }

      // Auto-resolve converged threads
      const converged = autoResolveConvergedThreads(threadState);
      if (converged.length > 0) {
        callbacks.onStatus(`Auto-resolved ${converged.length} converged thread(s).`);
      }
    } catch (agentErr: any) {
      // Catch unexpected errors in individual agent processing to prevent
      // one agent from crashing the entire round
      failedAgents++;
      callbacks.onStatus(`${agent.name} encountered unexpected error: ${agentErr.message ?? "unknown"}. Continuing.`);
      continue;
    }

    // Check quiet-thread detection
    // A round is "quiet" when all postable threads have no pending replies
    // AND no agents remain queued for processing
    const postable = getPostableThreads(threadState);
    const allQuiet = postable.length === 0 || postable.every(t => t.pending_replies.length === 0);
    if (allQuiet && agentQueue.size === 0) {
      endReason = "quiet";
      break;
    }
  }

  // If queue emptied naturally
  if (agentQueue.size === 0 && endReason !== "aborted" && endReason !== "constraints" && endReason !== "message-cap" && endReason !== "time-cap") {
    endReason = "quiet";
  }

  return { messagesPosted, failedAgents, droppedMessages, totalCost, totalTokens, endReason };
}
