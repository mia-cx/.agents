export type BranchType = "feat" | "fix" | "chore";

export type CycleRoute = "quickfix" | "planned";

export type CycleStageKey =
  | "classify"
  | "prd"
  | "issues"
  | "plan"
  | "implementation"
  | "verification"
  | "closed";

export type StageStatus =
  | "pending"
  | "running"
  | "awaiting_approval"
  | "approved"
  | "completed"
  | "skipped"
  | "failed";

export interface CycleRequest {
  problem: string;
  userStories: string[];
  branchType: BranchType;
}

export interface CycleClassification {
  route: CycleRoute;
  rationale: string;
  confidence: "low" | "medium" | "high";
  requiredStages: CycleStageKey[];
}

export interface SliceIssue {
  title: string;
  type: "AFK" | "HITL";
  summary: string;
  acceptanceCriteria: string[];
  blockedBy: string[];
  userStories: number[];
  issueNumber?: number;
  issueUrl?: string;
}

export interface StageArtifactState {
  status: StageStatus;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  note?: string;
}

export interface CycleArtifacts {
  prdTitle?: string;
  prdBody?: string;
  prdIssueNumber?: number;
  prdIssueUrl?: string;
  slices?: SliceIssue[];
  planMarkdown?: string;
  planPath?: string;
  worktreePath?: string;
  branchName?: string;
  implementationSummary?: string;
  verificationSummary?: string;
  executionGraphPath?: string;
}

export interface CycleRecord {
  version: 1;
  slug: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  cwd: string;
  request: CycleRequest;
  classification: CycleClassification;
  currentStage: CycleStageKey;
  approvals: {
    prd: boolean;
    issues: boolean;
    plan: boolean;
  };
  stages: Record<CycleStageKey, StageArtifactState>;
  artifacts: CycleArtifacts;
  history: string[];
}

export type ExecutionNodeKind = "cycle" | "stage" | "agent" | "tool";

export type ExecutionNodeStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "aborted";

export interface ExecutionNode {
  id: string;
  parentId: string | null;
  kind: ExecutionNodeKind;
  label: string;
  status: ExecutionNodeStatus;
  startedAt: string;
  endedAt?: string;
  detail?: string;
  metadata?: Record<string, string | number | boolean | null>;
  children: string[];
}

export interface ExecutionGraph {
  cycleSlug: string;
  rootId: string;
  nodes: Record<string, ExecutionNode>;
  updatedAt: string;
}

export interface UsageTotals {
  input: number;
  output: number;
  cost: number;
  turns: number;
}

export interface DiscoveredAgent {
  name: string;
  slug: string;
  description: string;
  category: string;
  source: "built-in" | "project" | "user";
  model?: string;
  tools?: string[];
  systemPrompt: string;
  filePath: string;
}

export interface CycleStatusView {
  slug: string;
  title: string;
  route: CycleRoute;
  currentStage: CycleStageKey;
  approvals: CycleRecord["approvals"];
  worktreePath?: string;
  branchName?: string;
}

export interface PiRunOptions {
  cwd: string;
  systemPrompt: string;
  task: string;
  allowExtensions?: boolean;
  model?: string;
  tools?: string[];
  env?: Record<string, string>;
  signal?: AbortSignal;
  graph?: ExecutionGraph;
  parentNodeId?: string;
  nodeLabel?: string;
  onGraphUpdate?: (graph: ExecutionGraph) => void;
}

export interface PiRunResult {
  exitCode: number;
  output: string;
  stderr: string;
  stopReason?: string;
  errorMessage?: string;
  usage: UsageTotals;
  rootNodeId: string;
  graph: ExecutionGraph;
}

export interface SubagentTask {
  agent: string;
  task: string;
  cwd?: string;
}

export interface SubagentResult {
  agent: string;
  source: "built-in" | "project" | "user" | "unknown";
  task: string;
  exitCode: number;
  output: string;
  stderr: string;
  usage: UsageTotals;
  model?: string;
  graph?: ExecutionGraph;
}
