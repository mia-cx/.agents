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
    // ... 149 lines omitted
    }
    // ... 148 lines omitted
}
    // ... 147 lines omitted
function emitMessagingSnapshot(
    // ... 146 lines omitted
}
    // ... 145 lines omitted
function processScratchpadOutput(cwd: string, agentSlug: string, output: string): string {
    // ... 144 lines omitted
  }
    // ... 143 lines omitted
}
    // ... 142 lines omitted
async function runCeoWithRetry(
    // ... 141 lines omitted
  }
    // ... 140 lines omitted
  }
}
export async function runFreeformMessagingMeeting(
    }
    }
    }
      }
      }
      }
      }
        }
        }
      }
    }
    }
      }
    }
    }
      }
    }
    }
    }
      }
    }
  }
}
export async function runStructuredMessagingMeeting(
    }
    }
    }
      }
      }
      }
      }
    }
    }
      }
    }
    }
      }
    }
    }
    }
      }
    }
    }
  }
}
// ... 92 more lines (total: 259)