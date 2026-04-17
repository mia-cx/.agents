import * as path from "node:path";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { StringEnum } from "@mariozechner/pi-ai";
import { Type } from "@sinclair/typebox";
import { Text } from "@mariozechner/pi-tui";
import { discoverTeamAgents, selectImplementationOrchestrator, summarizeAgents } from "./agents.js";
import {
  ensureRuntimeDirs,
  ensureRuntimeGitignore,
  listCycles,
  readCycle,
  readGraph,
  writeCycle,
  writeGraph,
  writePlanFile,
} from "./artifacts.js";
import { addNode, createExecutionGraph, finishNode } from "./graph.js";
import { createGitHubIssue } from "./github.js";
import { runPiTask } from "./pi-runner.js";
import { execCommand } from "./shell.js";
import {
  approveStage,
  createCycleRecord,
  determineCurrentStage,
  markImplementationFinished,
  markImplementationStarted,
  markVerificationFinished,
  runIssueStage,
  runPlanStage,
  runPrdStage,
  touchCycle,
} from "./stages.js";
import type {
  BranchType,
  CycleRecord,
  CycleStageKey,
  ExecutionGraph,
  PiRunOptions,
  SubagentResult,
  SubagentTask,
  UsageTotals,
} from "./types.js";
import { buildPlainStatusLines, buildStatusLine, buildWidgetLines } from "./ui.js";
import { getCycleBranchName, getCycleWorktreePath, ensureCycleWorktree } from "./worktree.js";

const BRANCH_TYPE = StringEnum(["feat", "fix", "chore"] as const, { description: "Branch prefix for the implementation worktree" });
const APPROVAL_STAGE = StringEnum(["prd", "issues", "plan"] as const, { description: "Which planning artifact to approve" });
const ACTION = StringEnum(["start", "next", "status", "approve", "implement", "list", "resume"] as const, {
  description: "Dev-cycle action",
});

function now(): string {
  return new Date().toISOString();
}

function parseQuotedFlag(input: string, flag: string): string | undefined {
  const match = input.match(new RegExp(`${flag}\\s+\"([^\"]+)\"`));
  return match?.[1];
}

function parseWordFlag(input: string, flag: string): string | undefined {
  const match = input.match(new RegExp(`${flag}\\s+(\\S+)`));
  return match?.[1];
}

function stripFlags(input: string): string {
  return input
    .replace(/--slug\s+\S+/g, "")
    .replace(/--branch-type\s+\S+/g, "")
    .replace(/--stories\s+"[^"]+"/g, "")
    .trim();
}

function parseUserStories(raw?: string): string[] {
  if (!raw) return [];
  return raw.split("|").map((item) => item.trim()).filter(Boolean);
}

function currentCycle(cwd: string, activeCycleSlug: string | null, requestedSlug?: string): CycleRecord | null {
  if (requestedSlug) return readCycle(cwd, requestedSlug);
  if (activeCycleSlug) {
    const active = readCycle(cwd, activeCycleSlug);
    if (active) return active;
  }

  return listCycles(cwd).find((cycle) => cycle.currentStage !== "closed") ?? listCycles(cwd)[0] ?? null;
}

function persistCycle(cycle: CycleRecord, graph: ExecutionGraph | null): void {
  writeCycle(cycle.cwd, cycle);
  if (graph) {
    cycle.artifacts.executionGraphPath = writeGraph(cycle.cwd, cycle.slug, graph);
    writeCycle(cycle.cwd, cycle);
  }
}

function cycleGraph(cycle: CycleRecord): ExecutionGraph {
  return readGraph(cycle.cwd, cycle.slug) ?? createExecutionGraph(cycle.slug, cycle.title);
}

function setCycleUi(ctx: any, cycle: CycleRecord, graph: ExecutionGraph | null): void {
  ctx.ui.setStatus("dev-cycle", buildStatusLine(cycle));
  if (ctx.hasUI) {
    ctx.ui.setWidget("dev-cycle", buildWidgetLines(cycle, graph, ctx.ui.theme));
  }
}

async function runTrackedTask(
  cycle: CycleRecord,
  graph: ExecutionGraph,
  stageLabel: string,
  nodeLabel: string,
  options: Omit<PiRunOptions, "graph" | "parentNodeId" | "nodeLabel" | "onGraphUpdate">,
  onGraphUpdate: (graph: ExecutionGraph) => void,
): Promise<string> {
  const stageNodeId = addNode(graph, graph.rootId, "stage", stageLabel, "running");
  onGraphUpdate(graph);

  const result = await runPiTask({
    ...options,
    graph,
    parentNodeId: stageNodeId,
    nodeLabel,
    onGraphUpdate,
  });

  finishNode(
    graph,
    stageNodeId,
    result.exitCode === 0 ? "completed" : "failed",
    result.output || result.stderr || result.errorMessage,
  );
  onGraphUpdate(graph);

  if (result.exitCode !== 0) {
    throw new Error(result.stderr || result.errorMessage || `${stageLabel} failed`);
  }

  return result.output;
}

function buildPlanningSystemPrompt(): string {
  return [
    "You are a staff-level planning agent.",
    "Follow output instructions exactly.",
    "Do not add commentary outside the requested format.",
  ].join("\n");
}

function buildImplementationSystemPrompt(orchestratorPrompt: string, teamSummary: string): string {
  return [
    orchestratorPrompt,
    "",
    "The plan is already approved. Treat planning approval as satisfied and execute now.",
    "Use the cycle_subagent tool for delegation instead of any other subagent mechanism.",
    `Available team: ${teamSummary}`,
    "Stay inside the current worktree cwd for all code changes.",
    "Finish with a concise implementation summary and verification notes.",
  ].join("\n");
}

function buildImplementationTask(cycle: CycleRecord): string {
  const slices = (cycle.artifacts.slices ?? [])
    .map((slice) => `- ${slice.title}${slice.issueNumber ? ` (#${slice.issueNumber})` : ""}`)
    .join("\n");

  return [
    `Problem: ${cycle.request.problem}`,
    cycle.request.userStories.length > 0
      ? `User stories:\n${cycle.request.userStories.map((story, index) => `${index + 1}. ${story}`).join("\n")}`
      : "User stories: none",
    cycle.artifacts.prdIssueUrl ? `PRD issue: ${cycle.artifacts.prdIssueUrl}` : "",
    cycle.artifacts.planPath ? `Approved plan path: ${cycle.artifacts.planPath}` : "",
    cycle.artifacts.planMarkdown ? `Approved plan markdown:\n${cycle.artifacts.planMarkdown}` : "",
    slices ? `Slice issues:\n${slices}` : "",
    "",
    "Implement the approved work in this worktree. Delegate to the appropriate specialists with cycle_subagent.",
  ]
    .filter(Boolean)
    .join("\n\n");
}

function buildVerificationTask(cycle: CycleRecord): string {
  return [
    `Verify the implementation for cycle ${cycle.slug}.`,
    cycle.artifacts.planMarkdown ? `Approved plan:\n${cycle.artifacts.planMarkdown}` : "",
    cycle.artifacts.implementationSummary ? `Implementation summary:\n${cycle.artifacts.implementationSummary}` : "",
    "Return a concise verification summary with what was verified, what remains uncertain, and any risk notes.",
  ]
    .filter(Boolean)
    .join("\n\n");
}

async function advancePlanning(cycle: CycleRecord, ctx: any): Promise<CycleRecord> {
  const graph = cycleGraph(cycle);
  const onGraphUpdate = (nextGraph: ExecutionGraph) => {
    persistCycle(cycle, nextGraph);
    setCycleUi(ctx, cycle, nextGraph);
  };

  while (true) {
    cycle.currentStage = determineCurrentStage(cycle);
    setCycleUi(ctx, cycle, graph);

    if (cycle.currentStage === "prd" && !cycle.approvals.prd) {
      if (cycle.stages.prd.status === "awaiting_approval") break;
      await runPrdStage(
        cycle,
        (prompt) =>
          runTrackedTask(
            cycle,
            graph,
            "PRD stage",
            "PRD planner",
            { cwd: cycle.cwd, systemPrompt: buildPlanningSystemPrompt(), task: prompt, allowExtensions: false },
            onGraphUpdate,
          ),
        (title, body) => createGitHubIssue(cycle.cwd, title, body),
      );
      persistCycle(cycle, graph);
      break;
    }

    if (cycle.currentStage === "issues" && !cycle.approvals.issues) {
      if (cycle.stages.issues.status === "awaiting_approval") break;
      await runIssueStage(
        cycle,
        (prompt) =>
          runTrackedTask(
            cycle,
            graph,
            "Issue slicing stage",
            "Issue planner",
            { cwd: cycle.cwd, systemPrompt: buildPlanningSystemPrompt(), task: prompt, allowExtensions: false },
            onGraphUpdate,
          ),
        (title, body) => createGitHubIssue(cycle.cwd, title, body),
      );
      persistCycle(cycle, graph);
      break;
    }

    if (cycle.currentStage === "plan" && !cycle.approvals.plan) {
      if (cycle.stages.plan.status === "awaiting_approval") break;
      await runPlanStage(
        cycle,
        (prompt) =>
          runTrackedTask(
            cycle,
            graph,
            "Plan stage",
            "Plan writer",
            { cwd: cycle.cwd, systemPrompt: buildPlanningSystemPrompt(), task: prompt, allowExtensions: false },
            onGraphUpdate,
          ),
        (markdown) => writePlanFile(cycle.cwd, cycle.slug, markdown),
      );
      persistCycle(cycle, graph);
      break;
    }

    break;
  }

  cycle.currentStage = determineCurrentStage(cycle);
  persistCycle(cycle, graph);
  return cycle;
}

async function runImplementation(cycle: CycleRecord, ctx: any): Promise<CycleRecord> {
  if (cycle.classification.route === "planned" && !(cycle.approvals.prd && cycle.approvals.issues && cycle.approvals.plan)) {
    throw new Error("Implementation is blocked until PRD, issues, and plan are all approved.");
  }

  const worktree = await ensureCycleWorktree(cycle.cwd, cycle.slug, cycle.request.branchType, execCommand);
  cycle.artifacts.worktreePath = worktree.path;
  cycle.artifacts.branchName = worktree.branch;
  markImplementationStarted(cycle);

  const graph = cycleGraph(cycle);
  const onGraphUpdate = (nextGraph: ExecutionGraph) => {
    persistCycle(cycle, nextGraph);
    setCycleUi(ctx, cycle, nextGraph);
  };

  const agents = discoverTeamAgents(worktree.path);
  const orchestrator = selectImplementationOrchestrator(agents);
  if (!orchestrator) {
    throw new Error("No implementation orchestrator agent found.");
  }

  const implementationOutput = await runTrackedTask(
    cycle,
    graph,
    "Implementation stage",
    orchestrator.name,
    {
      cwd: worktree.path,
      systemPrompt: buildImplementationSystemPrompt(orchestrator.systemPrompt, summarizeAgents(agents)),
      task: buildImplementationTask(cycle),
      allowExtensions: true,
      model: orchestrator.model,
      tools: orchestrator.tools,
      env: { DEV_CYCLE_SUBAGENT_DEPTH: "0" },
    },
    onGraphUpdate,
  );
  markImplementationFinished(cycle, implementationOutput);
  persistCycle(cycle, graph);

  cycle.stages.verification = { status: "running", startedAt: now() };
  const verifier =
    agents.find((agent) => agent.name === "Review & QA Orchestrator")
    ?? agents.find((agent) => agent.name === "Verifier")
    ?? agents.find((agent) => agent.name === "Developer");
  if (!verifier) {
    throw new Error("No verifier-style agent found.");
  }

  const verificationOutput = await runTrackedTask(
    cycle,
    graph,
    "Verification stage",
    verifier.name,
    {
      cwd: worktree.path,
      systemPrompt: buildImplementationSystemPrompt(verifier.systemPrompt, summarizeAgents(agents)),
      task: buildVerificationTask(cycle),
      allowExtensions: true,
      model: verifier.model,
      tools: verifier.tools,
      env: { DEV_CYCLE_SUBAGENT_DEPTH: "0" },
    },
    onGraphUpdate,
  );
  markVerificationFinished(cycle, verificationOutput);
  persistCycle(cycle, graph);
  return cycle;
}

function formatCycleList(cycles: CycleRecord[]): string {
  if (cycles.length === 0) return "No dev cycles found.";
  return cycles
    .map((cycle) => `${cycle.slug} | ${cycle.currentStage} | ${cycle.classification.route} | ${cycle.updatedAt.slice(0, 10)}`)
    .join("\n");
}

async function runSubagentTask(
  cwd: string,
  task: SubagentTask,
  signal: AbortSignal | undefined,
): Promise<SubagentResult> {
  const agents = discoverTeamAgents(cwd);
  const agent = agents.find((item) => item.name === task.agent || item.slug === task.agent);
  if (!agent) {
    return {
      agent: task.agent,
      source: "unknown",
      task: task.task,
      exitCode: 1,
      output: "",
      stderr: `Unknown agent: ${task.agent}`,
      usage: { input: 0, output: 0, cost: 0, turns: 0 },
    };
  }

  const currentDepth = Number(process.env.DEV_CYCLE_SUBAGENT_DEPTH || "0");
  if (currentDepth >= 3) {
    return {
      agent: agent.name,
      source: agent.source,
      task: task.task,
      exitCode: 1,
      output: "",
      stderr: "Maximum cycle_subagent depth reached.",
      usage: { input: 0, output: 0, cost: 0, turns: 0 },
      model: agent.model,
    };
  }

  const graph = createExecutionGraph(agent.slug, agent.name);
  const result = await runPiTask({
    cwd: task.cwd ?? cwd,
    systemPrompt: agent.systemPrompt,
    task: task.task,
    allowExtensions: true,
    model: agent.model,
    tools: agent.tools,
    signal,
    graph,
    nodeLabel: agent.name,
    env: { DEV_CYCLE_SUBAGENT_DEPTH: String(currentDepth + 1) },
  });

  return {
    agent: agent.name,
    source: agent.source,
    task: task.task,
    exitCode: result.exitCode,
    output: result.output,
    stderr: result.stderr,
    usage: result.usage,
    model: agent.model,
    graph: result.graph,
  };
}

export default function (pi: ExtensionAPI) {
  let activeCycleSlug: string | null = null;

  const devCycleParams = Type.Object({
    action: ACTION,
    slug: Type.Optional(Type.String()),
    problem: Type.Optional(Type.String()),
    branchType: Type.Optional(BRANCH_TYPE),
    userStories: Type.Optional(Type.Array(Type.String())),
    approve: Type.Optional(APPROVAL_STAGE),
  });

  async function handleAction(input: {
    action: "start" | "next" | "status" | "approve" | "implement" | "list" | "resume";
    slug?: string;
    problem?: string;
    branchType?: BranchType;
    userStories?: string[];
    approve?: "prd" | "issues" | "plan";
  }, ctx: any): Promise<string> {
    ensureRuntimeDirs(ctx.cwd);
    ensureRuntimeGitignore(ctx.cwd);

    if (input.action === "list") {
      return formatCycleList(listCycles(ctx.cwd));
    }

    if (input.action === "start") {
      if (!input.problem) throw new Error("A problem statement is required to start a cycle.");
      let cycle = createCycleRecord(ctx.cwd, input.problem, input.userStories, input.branchType, input.slug);
      activeCycleSlug = cycle.slug;
      const graph = createExecutionGraph(cycle.slug, cycle.title);
      persistCycle(cycle, graph);
      cycle = await advancePlanning(cycle, ctx);
      return `Started cycle ${cycle.slug}. Current stage: ${cycle.currentStage}.`;
    }

    const cycle = currentCycle(ctx.cwd, activeCycleSlug, input.slug);
    if (!cycle) throw new Error("No dev cycle found.");
    activeCycleSlug = cycle.slug;

    if (input.action === "resume" || input.action === "status") {
      const graph = readGraph(ctx.cwd, cycle.slug);
      setCycleUi(ctx, cycle, graph);
      return buildPlainStatusLines(cycle, graph).join("\n");
    }

    if (input.action === "approve") {
      if (!input.approve) throw new Error("Choose prd, issues, or plan to approve.");
      approveStage(cycle, input.approve);
      await advancePlanning(cycle, ctx);
      return `Approved ${input.approve} for ${cycle.slug}. Current stage: ${cycle.currentStage}.`;
    }

    if (input.action === "next") {
      await advancePlanning(cycle, ctx);
      return `Advanced ${cycle.slug}. Current stage: ${cycle.currentStage}.`;
    }

    if (input.action === "implement") {
      const updated = await runImplementation(cycle, ctx);
      return `Implementation complete for ${updated.slug}.\n\n${updated.artifacts.verificationSummary ?? updated.artifacts.implementationSummary ?? "No summary available."}`;
    }

    throw new Error(`Unknown action ${input.action}`);
  }

  pi.registerCommand("cycle-start", {
    description: "Start a dev cycle from a problem statement",
    handler: async (args, ctx) => {
      const slug = parseWordFlag(args ?? "", "--slug");
      const branchType = parseWordFlag(args ?? "", "--branch-type") as BranchType | undefined;
      const stories = parseQuotedFlag(args ?? "", "--stories");
      const problem = stripFlags(args ?? "");
      const message = await handleAction(
        { action: "start", slug, branchType, problem, userStories: parseUserStories(stories) },
        ctx,
      );
      ctx.ui.notify(message, "info");
    },
  });

  pi.registerCommand("cycle-next", {
    description: "Run the next non-approved planning step for the active cycle",
    handler: async (args, ctx) => {
      const slug = (args ?? "").trim() || undefined;
      const message = await handleAction({ action: "next", slug }, ctx);
      ctx.ui.notify(message, "info");
    },
  });

  pi.registerCommand("cycle-approve", {
    description: "Approve prd, issues, or plan for the active cycle",
    handler: async (args, ctx) => {
      const [stage, slug] = (args ?? "").trim().split(/\s+/, 2);
      const message = await handleAction({ action: "approve", approve: stage as any, slug }, ctx);
      ctx.ui.notify(message, "info");
    },
  });

  pi.registerCommand("cycle-implement", {
    description: "Explicitly start implementation for the active cycle",
    handler: async (args, ctx) => {
      const slug = (args ?? "").trim() || undefined;
      const message = await handleAction({ action: "implement", slug }, ctx);
      ctx.ui.notify(message, "info");
    },
  });

  pi.registerCommand("cycle-status", {
    description: "Show status for the active dev cycle",
    handler: async (args, ctx) => {
      const slug = (args ?? "").trim() || undefined;
      const message = await handleAction({ action: "status", slug }, ctx);
      ctx.ui.notify(message, "info");
    },
  });

  pi.registerCommand("cycle-list", {
    description: "List saved dev cycles",
    handler: async (_args, ctx) => {
      const message = await handleAction({ action: "list" }, ctx);
      ctx.ui.notify(message, "info");
    },
  });

  pi.registerTool({
    name: "dev_cycle",
    label: "Dev Cycle",
    description: "Manage a resumable development cycle from intake through planning, implementation, and verification.",
    promptSnippet: "Start, advance, approve, inspect, or implement a dev cycle",
    parameters: devCycleParams,
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      const text = await handleAction(params as any, ctx);
      return { content: [{ type: "text", text }] };
    },
    renderCall(args, theme) {
      return new Text(
        `${theme.fg("toolTitle", theme.bold("dev_cycle "))}${theme.fg("accent", args.action)}${args.slug ? theme.fg("muted", ` ${args.slug}`) : ""}`,
        0,
        0,
      );
    },
    renderResult(result, _options, theme) {
      const text = result.content[0];
      return new Text(text?.type === "text" ? text.text : theme.fg("muted", "(no output)"), 0, 0);
    },
  });

  pi.registerTool({
    name: "cycle_subagent",
    label: "Cycle Subagent",
    description: "Delegate tasks to repo, project, or user agents with isolated Pi subprocesses and return structured results.",
    promptSnippet: "Delegate implementation or verification work to a specialist agent",
    parameters: Type.Object({
      agent: Type.Optional(Type.String()),
      task: Type.Optional(Type.String()),
      tasks: Type.Optional(Type.Array(Type.Object({ agent: Type.String(), task: Type.String(), cwd: Type.Optional(Type.String()) }))),
      chain: Type.Optional(Type.Array(Type.Object({ agent: Type.String(), task: Type.String(), cwd: Type.Optional(Type.String()) }))),
    }),
    async execute(_toolCallId, params, signal, onUpdate, ctx) {
      const hasSingle = Boolean(params.agent && params.task);
      const hasParallel = (params.tasks?.length ?? 0) > 0;
      const hasChain = (params.chain?.length ?? 0) > 0;
      const modeCount = Number(hasSingle) + Number(hasParallel) + Number(hasChain);
      if (modeCount !== 1) {
        return {
          content: [{ type: "text", text: "Provide exactly one mode: single, tasks, or chain." }],
          details: { results: [] },
          isError: true,
        };
      }

      const update = (results: SubagentResult[]) => {
        onUpdate?.({
          content: [{ type: "text", text: results.map((item) => `[${item.agent}] ${item.exitCode === 0 ? "ok" : "failed"}`).join("\n") || "(running...)" }],
          details: { results },
        });
      };

      if (hasSingle) {
        const result = await runSubagentTask(ctx.cwd, { agent: params.agent!, task: params.task! }, signal);
        update([result]);
        return {
          content: [{ type: "text", text: result.output || result.stderr || "(no output)" }],
          details: { results: [result] },
          isError: result.exitCode !== 0,
        };
      }

      if (hasParallel) {
        const results = await Promise.all((params.tasks ?? []).map((task) => runSubagentTask(ctx.cwd, task, signal)));
        update(results);
        return {
          content: [{ type: "text", text: results.map((item) => `[${item.agent}] ${item.output || item.stderr || "(no output)"}`).join("\n\n") }],
          details: { results },
          isError: results.some((item) => item.exitCode !== 0),
        };
      }

      const results: SubagentResult[] = [];
      let previous = "";
      for (const step of params.chain ?? []) {
        const task = step.task.replace(/\{previous\}/g, previous);
        const result = await runSubagentTask(ctx.cwd, { agent: step.agent, task, cwd: step.cwd }, signal);
        results.push(result);
        update(results);
        if (result.exitCode !== 0) {
          return {
            content: [{ type: "text", text: result.stderr || result.output || "Chain failed." }],
            details: { results },
            isError: true,
          };
        }
        previous = result.output;
      }

      return {
        content: [{ type: "text", text: results[results.length - 1]?.output || "(no output)" }],
        details: { results },
      };
    },
    renderCall(args, theme) {
      const label = args.agent ? args.agent : args.tasks ? `parallel(${args.tasks.length})` : `chain(${args.chain?.length ?? 0})`;
      return new Text(`${theme.fg("toolTitle", theme.bold("cycle_subagent "))}${theme.fg("accent", label)}`, 0, 0);
    },
    renderResult(result, _options, theme) {
      const text = result.content[0];
      return new Text(text?.type === "text" ? text.text : theme.fg("muted", "(no output)"), 0, 0);
    },
  });
}
