export interface AgentConfig {
  name: string;
  slug: string;
  description: string;
  model?: string;
  modelAlt?: string;
  tools?: string[];
  tags: string[];
  systemPrompt: string;
  filePath: string;
}

export type MeetingMode = "freeform" | "structured";

export type MeetingDisposition =
  | "completed"
  | "force-closed"
  | "budget-exceeded"
  | "aborted";

export type ConstraintState = "ok" | "warn" | "exceeded";

export interface ConstraintSet {
  budget: number;
  time_limit_minutes: number;
  max_debate_rounds: number;
}

export interface BoardroomConfig {
  default_constraints: string;
  default_mode: MeetingMode;
  budget_hard_stop: boolean;
  time_hard_stop: boolean;
  constraints: Record<string, ConstraintSet>;
}

export interface ParsedBrief {
  title: string;
  slug: string;
  content: string;
  filePath: string;
  constraints?: string;
  mode?: MeetingMode;
  budgetOverride?: number;
  timeLimitOverride?: number;
  maxRoundsOverride?: number;
  warnings: string[];
}

export interface ConversationEntry {
  id: string;
  from: string;
  to: string[];
  in_response_to: string | null;
  phase: number;
  round: number;
  timestamp: string;
  role: string;
  content: string;
  token_count: number;
  cost: number;
}

export interface ConversationLog {
  meeting_id: string;
  brief: string;
  mode: MeetingMode;
  constraints: string;
  roster: string[];
  started_at: string;
  ended_at: string;
  disposition: MeetingDisposition;
  total_cost: number;
  entries: ConversationEntry[];
}

export interface MeetingState {
  id: string;
  brief: ParsedBrief;
  mode: MeetingMode;
  constraints: string;
  resolvedConstraints: ConstraintSet;
  roster: AgentConfig[];
  allAgents: AgentConfig[];
  phase: number;
  round: number;
  startedAt: Date;
  disposition: MeetingDisposition | null;
  log: ConversationLog;
  totalCost: number;
  entryCounter: number;
}

export interface AgentRunResult {
  agent: string;
  content: string;
  exitCode: number;
  tokenCount: number;
  cost: number;
  error?: string;
}
