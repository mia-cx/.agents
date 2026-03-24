import type { BranchType, CycleClassification, CycleRequest, CycleRoute } from "./types.js";

const BUG_KEYWORDS = [
  "bug",
  "fix",
  "broken",
  "error",
  "regression",
  "typo",
  "crash",
  "failing",
];

const CHORE_KEYWORDS = [
  "config",
  "rule",
  "lint",
  "dependency",
  "deps",
  "tooling",
  "ci",
  "docs",
  "documentation",
];

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export function normalizeUserStories(value?: string | string[]): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }

  return value
    .split(/\n+/)
    .map((item) => item.replace(/^\s*[-*\d.]+\s*/, "").trim())
    .filter(Boolean);
}

export function inferBranchType(problem: string, userStories: string[]): BranchType {
  const text = `${problem}\n${userStories.join("\n")}`.toLowerCase();
  if (BUG_KEYWORDS.some((keyword) => text.includes(keyword))) return "fix";
  if (CHORE_KEYWORDS.some((keyword) => text.includes(keyword))) return "chore";
  return "feat";
}

export function deriveCycleTitle(problem: string, userStories: string[]): string {
  const base = problem.trim() || userStories[0] || "Untitled dev cycle";
  return base.length > 72 ? `${base.slice(0, 69)}...` : base;
}

function detectRoute(request: CycleRequest): {
  route: CycleRoute;
  rationale: string;
  confidence: "low" | "medium" | "high";
} {
  const text = `${request.problem}\n${request.userStories.join("\n")}`.trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const storyCount = request.userStories.length;
  const hasBugWords = BUG_KEYWORDS.some((keyword) => text.toLowerCase().includes(keyword));
  const hasQuestionMark = text.includes("?");

  if (storyCount <= 1 && wordCount <= 70 && hasBugWords && !hasQuestionMark) {
    return {
      route: "quickfix",
      rationale: "Short, specific, bug-flavored request with little planning overhead.",
      confidence: "high",
    };
  }

  if (storyCount === 0 && wordCount <= 25 && hasBugWords) {
    return {
      route: "quickfix",
      rationale: "Tiny fix request with no evidence of broader design work.",
      confidence: "medium",
    };
  }

  return {
    route: "planned",
    rationale: "Feature scope, multiple stories, or ambiguity indicates a full planning flow.",
    confidence: storyCount > 1 || wordCount > 120 ? "high" : "medium",
  };
}

export function classifyRequest(request: CycleRequest): CycleClassification {
  const detected = detectRoute(request);
  const requiredStages =
    detected.route === "quickfix"
      ? (["classify", "implementation", "verification", "closed"] as const)
      : (["classify", "prd", "issues", "plan", "implementation", "verification", "closed"] as const);

  return {
    route: detected.route,
    rationale: detected.rationale,
    confidence: detected.confidence,
    requiredStages: [...requiredStages],
  };
}
