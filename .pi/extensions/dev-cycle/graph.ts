import type { ExecutionGraph, ExecutionNode, ExecutionNodeKind, ExecutionNodeStatus, SubagentResult } from "./types.js";

function newId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function now(): string {
  return new Date().toISOString();
}

export function createExecutionGraph(cycleSlug: string, label: string): ExecutionGraph {
  const rootId = newId("cycle");
  return {
    cycleSlug,
    rootId,
    updatedAt: now(),
    nodes: {
      [rootId]: {
        id: rootId,
        parentId: null,
        kind: "cycle",
        label,
        status: "running",
        startedAt: now(),
        children: [],
      },
    },
  };
}

export function addNode(
  graph: ExecutionGraph,
  parentId: string,
  kind: ExecutionNodeKind,
  label: string,
  status: ExecutionNodeStatus = "queued",
  metadata?: ExecutionNode["metadata"],
): string {
  const id = newId(kind);
  graph.nodes[id] = {
    id,
    parentId,
    kind,
    label,
    status,
    startedAt: now(),
    metadata,
    children: [],
  };
  graph.nodes[parentId]?.children.push(id);
  graph.updatedAt = now();
  return id;
}

export function updateNode(
  graph: ExecutionGraph,
  nodeId: string,
  patch: Partial<Omit<ExecutionNode, "id" | "parentId" | "children">>,
): void {
  const node = graph.nodes[nodeId];
  if (!node) return;
  Object.assign(node, patch);
  graph.updatedAt = now();
}

export function finishNode(
  graph: ExecutionGraph,
  nodeId: string,
  status: ExecutionNodeStatus,
  detail?: string,
): void {
  const node = graph.nodes[nodeId];
  if (!node) return;
  node.status = status;
  node.endedAt = now();
  if (detail) node.detail = detail;
  graph.updatedAt = now();
}

export function attachSubagentResults(
  graph: ExecutionGraph,
  parentToolNodeId: string,
  results: SubagentResult[],
): void {
  for (const result of results) {
    const agentNodeId = addNode(
      graph,
      parentToolNodeId,
      "agent",
      result.agent,
      result.exitCode === 0 ? "completed" : "failed",
      {
        source: result.source,
        cost: result.usage.cost,
        turns: result.usage.turns,
      },
    );
    updateNode(graph, agentNodeId, {
      detail: result.output || result.stderr || "(no output)",
    });

    if (result.graph) {
      for (const childId of result.graph.nodes[result.graph.rootId]?.children ?? []) {
        cloneNodeTree(result.graph, graph, childId, agentNodeId);
      }
    }
  }
}

function cloneNodeTree(source: ExecutionGraph, target: ExecutionGraph, sourceNodeId: string, parentId: string): void {
  const sourceNode = source.nodes[sourceNodeId];
  if (!sourceNode) return;
  const clonedId = addNode(target, parentId, sourceNode.kind, sourceNode.label, sourceNode.status, sourceNode.metadata);
  updateNode(target, clonedId, {
    detail: sourceNode.detail,
    startedAt: sourceNode.startedAt,
    endedAt: sourceNode.endedAt,
  });

  for (const childId of sourceNode.children) {
    cloneNodeTree(source, target, childId, clonedId);
  }
}
