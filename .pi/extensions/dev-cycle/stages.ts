import { classifyRequest, deriveCycleTitle, inferBranchType, normalizeUserStories, slugify } from "./classify.js";
import type {
  BranchType,
  CycleRecord,
  CycleStageKey,
  SliceIssue,
  StageArtifactState,
} from "./types.js";

type IssueRef = { number: number; url: string };

const STAGE_KEYS: CycleStageKey[] = [
  "classify",
  "prd",
  "issues",
  "plan",
  "implementation",
  "verification",
  "closed",
];

function now(): string {
  return new Date().toISOString();
}

function emptyStage(status: StageArtifactState["status"] = "pending"): StageArtifactState {
  return { status };
}

export function createCycleRecord(
  cwd: string,
  problem: string,
  userStoriesInput?: string | string[],
  branchTypeInput?: BranchType,
  preferredSlug?: string,
): CycleRecord {
  const userStories = normalizeUserStories(userStoriesInput);
  const branchType = branchTypeInput ?? inferBranchType(problem, userStories);
  const title = deriveCycleTitle(problem, userStories);
  const slug = preferredSlug ? slugify(preferredSlug) : slugify(title);
  const classification = classifyRequest({ problem, userStories, branchType });

  const stages = Object.fromEntries(STAGE_KEYS.map((key) => [key, emptyStage()])) as CycleRecord["stages"];
  stages.classify = { status: "completed", startedAt: now(), completedAt: now(), note: classification.rationale };

  if (classification.route === "quickfix") {
    stages.prd = { status: "skipped", note: "Quickfix route" };
    stages.issues = { status: "skipped", note: "Quickfix route" };
    stages.plan = { status: "skipped", note: "Quickfix route" };
  }

  return {
    version: 1,
    slug,
    title,
    createdAt: now(),
    updatedAt: now(),
    cwd,
    request: { problem, userStories, branchType },
    classification,
    currentStage: classification.route === "quickfix" ? "implementation" : "prd",
    approvals: { prd: false, issues: false, plan: false },
    stages,
    artifacts: {},
    history: [`Cycle created: ${title}`],
  };
}

export function touchCycle(cycle: CycleRecord, message?: string): CycleRecord {
  cycle.updatedAt = now();
  if (message) cycle.history.unshift(`${cycle.updatedAt} ${message}`);
  return cycle;
}

export function stageNeedsApproval(stage: CycleStageKey): stage is "prd" | "issues" | "plan" {
  return stage === "prd" || stage === "issues" || stage === "plan";
}

export function determineCurrentStage(cycle: CycleRecord): CycleStageKey {
  if (cycle.stages.implementation.status === "failed") return "implementation";
  if (cycle.stages.verification.status === "failed") return "verification";

  if (cycle.classification.route === "planned") {
    if (!cycle.approvals.prd) return "prd";
    if (!cycle.approvals.issues) return "issues";
    if (!cycle.approvals.plan) return "plan";
  }

  if (cycle.stages.implementation.status !== "completed") return "implementation";
  if (cycle.stages.verification.status !== "completed") return "verification";
  return "closed";
}

export function approveStage(cycle: CycleRecord, stage: "prd" | "issues" | "plan"): CycleRecord {
  cycle.approvals[stage] = true;
  cycle.stages[stage].status = "approved";
  cycle.stages[stage].completedAt = now();
  touchCycle(cycle, `Approved ${stage}`);
  cycle.currentStage = determineCurrentStage(cycle);
  return cycle;
}

function extractJsonBlock<T>(text: string): T {
  const fenced = text.match(/```json\s*\n([\s\S]*?)\n```/);
  const source = fenced?.[1] ?? text;
  return JSON.parse(source) as T;
}

export function buildPrdPrompt(cycle: CycleRecord): string {
  return [
    "You are writing a product requirements document for a dev-cycle extension.",
    "Return exactly one JSON object inside a ```json fence with this shape:",
    '{ "title": "PRD: ...", "body": "## Problem Statement\\n..." }',
    "The body must include these headings in order:",
    "## Problem Statement",
    "## Solution",
    "## User Stories",
    "## Implementation Decisions",
    "## Testing Decisions",
    "## Out of Scope",
    "## Further Notes",
    "",
    `Problem statement: ${cycle.request.problem}`,
    cycle.request.userStories.length > 0
      ? `User stories:\n${cycle.request.userStories.map((story, index) => `${index + 1}. ${story}`).join("\n")}`
      : "User stories: none supplied; infer an appropriate set from the problem statement.",
    "",
    "Be specific, concise, and implementation-ready.",
  ].join("\n");
}

export function parsePrdDraft(text: string): { title: string; body: string } {
  return extractJsonBlock<{ title: string; body: string }>(text);
}

export function buildIssuePrompt(cycle: CycleRecord): string {
  return [
    "Break this approved PRD into thin vertical slices.",
    "Return exactly one JSON array inside a ```json fence. Each item must have:",
    '{ "title": "...", "type": "AFK", "summary": "...", "acceptanceCriteria": ["..."], "blockedBy": ["other title"], "userStories": [1, 2] }',
    "Prefer AFK slices. Use dependency titles in blockedBy; they will be resolved later.",
    "",
    `PRD title: ${cycle.artifacts.prdTitle ?? cycle.title}`,
    cycle.artifacts.prdBody ?? "",
  ].join("\n");
}

export function parseSliceDraft(text: string): SliceIssue[] {
  return extractJsonBlock<SliceIssue[]>(text);
}

export function buildPlanPrompt(cycle: CycleRecord): string {
  const sliceSummary = (cycle.artifacts.slices ?? [])
    .map((slice, index) => {
      const blockedBy = slice.blockedBy.length > 0 ? `blocked by: ${slice.blockedBy.join(", ")}` : "no blockers";
      return `${index + 1}. ${slice.title} (${blockedBy})`;
    })
    .join("\n");

  return [
    "Write a phased implementation plan in markdown.",
    "Use this structure:",
    "# Plan: <Feature Name>",
    "> Source PRD: <identifier>",
    "## Architectural decisions",
    "---",
    "## Phase 1: <Title>",
    "**User stories**: ...",
    "### What to build",
    "### Acceptance criteria",
    "",
    `Cycle title: ${cycle.title}`,
    `Source PRD issue: #${cycle.artifacts.prdIssueNumber ?? "unknown"}`,
    `Approved slices:\n${sliceSummary}`,
    "",
    "Keep the plan high-signal, with durable decisions and thin vertical slices.",
  ].join("\n");
}

export function createSliceIssueBody(
  cycle: CycleRecord,
  slice: SliceIssue,
  blockedByNumbers: number[],
): string {
  return [
    "## Parent PRD",
    "",
    `#${cycle.artifacts.prdIssueNumber}`,
    "",
    "## What to build",
    "",
    slice.summary,
    "",
    "## Acceptance criteria",
    "",
    ...slice.acceptanceCriteria.map((criterion) => `- [ ] ${criterion}`),
    "",
    "## Blocked by",
    "",
    blockedByNumbers.length > 0
      ? blockedByNumbers.map((value) => `- Blocked by #${value}`).join("\n")
      : "None - can start immediately",
    "",
    "## User stories addressed",
    "",
    ...slice.userStories.map((story) => `- User story ${story}`),
    "",
  ].join("\n");
}

export async function runPrdStage(
  cycle: CycleRecord,
  runPlanner: (prompt: string) => Promise<string>,
  createIssue: (title: string, body: string) => Promise<IssueRef>,
): Promise<CycleRecord> {
  cycle.stages.prd = { status: "running", startedAt: now() };
  const draft = parsePrdDraft(await runPlanner(buildPrdPrompt(cycle)));
  const issue = await createIssue(draft.title, draft.body);
  cycle.artifacts.prdTitle = draft.title;
  cycle.artifacts.prdBody = draft.body;
  cycle.artifacts.prdIssueNumber = issue.number;
  cycle.artifacts.prdIssueUrl = issue.url;
  cycle.stages.prd = {
    status: "awaiting_approval",
    startedAt: cycle.stages.prd.startedAt,
    completedAt: now(),
    note: issue.url,
  };
  touchCycle(cycle, `Created PRD issue #${issue.number}`);
  cycle.currentStage = "prd";
  return cycle;
}

export async function runIssueStage(
  cycle: CycleRecord,
  runPlanner: (prompt: string) => Promise<string>,
  createIssue: (title: string, body: string) => Promise<IssueRef>,
): Promise<CycleRecord> {
  cycle.stages.issues = { status: "running", startedAt: now() };
  const slices = parseSliceDraft(await runPlanner(buildIssuePrompt(cycle)));

  const created = new Map<string, number>();
  for (const slice of slices) {
    const blockedByNumbers = slice.blockedBy.map((title) => created.get(title)).filter((value): value is number => value !== undefined);
    const issue = await createIssue(slice.title, createSliceIssueBody(cycle, slice, blockedByNumbers));
    slice.issueNumber = issue.number;
    slice.issueUrl = issue.url;
    created.set(slice.title, issue.number);
  }

  cycle.artifacts.slices = slices;
  cycle.stages.issues = {
    status: "awaiting_approval",
    startedAt: cycle.stages.issues.startedAt,
    completedAt: now(),
    note: `${slices.length} slices created`,
  };
  touchCycle(cycle, `Created ${slices.length} slice issues`);
  cycle.currentStage = "issues";
  return cycle;
}

export async function runPlanStage(
  cycle: CycleRecord,
  runPlanner: (prompt: string) => Promise<string>,
  writePlan: (markdown: string) => string,
): Promise<CycleRecord> {
  cycle.stages.plan = { status: "running", startedAt: now() };
  const markdown = await runPlanner(buildPlanPrompt(cycle));
  const planPath = writePlan(markdown);
  cycle.artifacts.planMarkdown = markdown;
  cycle.artifacts.planPath = planPath;
  cycle.stages.plan = {
    status: "awaiting_approval",
    startedAt: cycle.stages.plan.startedAt,
    completedAt: now(),
    note: planPath,
  };
  touchCycle(cycle, `Wrote plan ${planPath}`);
  cycle.currentStage = "plan";
  return cycle;
}

export function markImplementationStarted(cycle: CycleRecord): CycleRecord {
  cycle.stages.implementation = { status: "running", startedAt: now() };
  cycle.currentStage = "implementation";
  return touchCycle(cycle, "Implementation started");
}

export function markImplementationFinished(cycle: CycleRecord, summary: string): CycleRecord {
  cycle.stages.implementation = {
    status: "completed",
    startedAt: cycle.stages.implementation.startedAt,
    completedAt: now(),
    note: summary,
  };
  cycle.artifacts.implementationSummary = summary;
  cycle.currentStage = "verification";
  return touchCycle(cycle, "Implementation finished");
}

export function markVerificationFinished(cycle: CycleRecord, summary: string): CycleRecord {
  cycle.stages.verification = {
    status: "completed",
    startedAt: cycle.stages.verification.startedAt ?? now(),
    completedAt: now(),
    note: summary,
  };
  cycle.artifacts.verificationSummary = summary;
  cycle.currentStage = "closed";
  cycle.stages.closed = { status: "completed", startedAt: now(), completedAt: now(), note: "Cycle complete" };
  return touchCycle(cycle, "Verification finished");
}
