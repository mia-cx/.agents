[RTK compacted output: source:minimal, smart-truncate]
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
  resolveThread,
  getActiveThreads,
  resetCounters,
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
import { runAgent } from "./runner.js";
import { runSemiLiveRound, DEFAULT_ROUND_CONFIG, type QueueCallbacks } from "./round-queue.js";
import { writeMemo, writeExpertise, writeVisuals } from "./artifacts.js";
import { loadScratchpad, saveScratchpad, extractScratchpadUpdate, stripScratchpadBlock } from "./scratchpad.js";
import type { ThreadState } from "./messaging-types.js";
import { buildThreadGraph, renderThreadGraph } from "./thread-graph.js";
import { extractMermaidBlocks } from "./visuals.js";
import { loadExpertise } from "./prompt-composer.js";
import { findAgentsByTag } from "./agents.js";

export interface MessagingMeetingCallbacks extends Pick<MeetingCallbacks, "onStatus" | "onConfirmRoster" | "onSnapshot" | "signal"> {}

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

function buildMessagingAgentSnapshots(
  allAgents: AgentConfig[],
  rosterAgents: AgentConfig[],
  threadState: ThreadState,
  activeSlug?: string,
): AgentRuntimeUpdate[] {
  const visibleAgents = dedupeAgentsBySlug([
    ...allAgents.filter((agent) => agent.slug === "ceo"),
    ...rosterAgents,
  ]);
  const rosterInfo = buildRosterInfo(threadState, visibleAgents.map((agent) => ({ slug: agent.slug, name: agent.name })));

  return visibleAgents.map((agent) => {
    const info = rosterInfo.find((entry) => entry.slug === agent.slug);
    const sentIds = threadState.agent_outboxes.get(agent.slug) ?? [];
    const sentMessages = sentIds
      .map((id) => threadState.messages.get(id))
      .filter((msg): msg is NonNullable<typeof msg> => !!msg);
    const totalTokens = sentMessages.reduce((sum, msg) => sum + msg.token_count, 0);
    const totalCost = sentMessages.reduce((sum, msg) => sum + msg.cost, 0);
    const status = agent.slug === activeSlug
      ? "running"
      : (info?.inbox_unread ?? 0) > 0
        ? "queued"
        : (info?.active_threads ?? 0) > 0
          ? "thinking"
          : sentMessages.length > 0
            ? "completed"
            : "idle";
    const activityParts = [
      `inbox ${(info?.inbox_unread ?? 0)}`,
      `outbox ${sentMessages.length}`,
      `threads ${info?.active_threads ?? 0}`,
    ];
    if (info && info.thread_names.length > 0) {
      activityParts.push(info.thread_names.slice(0, 2).join(", "));
    }

    return {
      slug: agent.slug,
      name: agent.name,
      status,
      modelLabel: agent.model,
      modelAltLabel: agent.modelAlt,
      activity: activityParts.join(" · "),
      turns: sentMessages.length,
      totalTokens,
      totalCost,
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
  activeSlug?: string,
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
    agents: buildMessagingAgentSnapshots(allAgents, rosterAgents, threadState, activeSlug),
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

async function runCeoWithRetry(
  cwd: string,
  ceo: AgentConfig,
  systemPrompt: string,
  task: string,
  callbacks: MessagingMeetingCallbacks,
  signal?: AbortSignal,
): Promise<{ content: string; tokenCount: number; cost: number }> {
  const result = await runAgent(cwd, ceo.slug, ceo.model, systemPrompt, task, signal);

  if (result.exitCode === 0 && result.content) {
    return { content: result.content, tokenCount: result.tokenCount, cost: result.cost };
  }

  callbacks.onStatus(`CEO failed (${result.error ?? "no output"}). Retrying with simplified context...`);

    // ... 657 lines omitted
  }
    // ... 656 lines omitted
}
    // ... 655 lines omitted
export async function runFreeformMessagingMeeting(
    // ... 654 lines omitted
    }
    // ... 653 lines omitted
    }
    // ... 652 lines omitted
    }
    // ... 651 lines omitted
      }
    // ... 650 lines omitted
      }
    // ... 649 lines omitted
      }
    // ... 648 lines omitted
      }
    // ... 647 lines omitted
        }
    // ... 646 lines omitted
        }
    // ... 645 lines omitted
      }
    }
    // ... 643 lines omitted
    }
    // ... 642 lines omitted
      }
    }
    // ... 640 lines omitted
    }
    // ... 639 lines omitted
      }
    }
    // ... 637 lines omitted
    }
    // ... 636 lines omitted
    }
    // ... 635 lines omitted
      }
    }
    // ... 633 lines omitted
  }
}
    // ... 631 lines omitted
export async function runStructuredMessagingMeeting(
    // ... 630 lines omitted
    }
    // ... 629 lines omitted
    }
    // ... 628 lines omitted
    }
    // ... 627 lines omitted
      }
    // ... 626 lines omitted
      }
    // ... 625 lines omitted
      }
    // ... 624 lines omitted
      }
    // ... 623 lines omitted
    }
    // ... 622 lines omitted
    }
    // ... 621 lines omitted
      }
    }
    // ... 619 lines omitted
    }
    // ... 618 lines omitted
      }
    }
    // ... 616 lines omitted
    }
    // ... 615 lines omitted
    }
    // ... 614 lines omitted
      }
    }
    // ... 612 lines omitted
    }
    // ... 611 lines omitted
  }
}
// ... 609 more lines (total: 767)