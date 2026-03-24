import { describe, expect, it } from "vitest";
import { classifyRequest, deriveCycleTitle, inferBranchType, normalizeUserStories, slugify } from "./classify.js";

describe("classify", () => {
  it("normalizes pipe and newline user stories", () => {
    expect(normalizeUserStories("One\n- Two\n3. Three")).toEqual(["One", "Two", "Three"]);
  });

  it("infers fix branches for bug-shaped work", () => {
    expect(inferBranchType("Fix regression in cycle-start command", [])).toBe("fix");
  });

  it("classifies tiny bugfixes as quickfix", () => {
    const classification = classifyRequest({
      problem: "Fix the typo in cycle status output",
      userStories: [],
      branchType: "fix",
    });

    expect(classification.route).toBe("quickfix");
    expect(classification.requiredStages).toContain("implementation");
    expect(classification.requiredStages).not.toContain("prd");
  });

  it("classifies multi-story work as planned", () => {
    const classification = classifyRequest({
      problem: "Build a dev cycle extension",
      userStories: ["As a developer, I want planning.", "As a developer, I want implementation orchestration."],
      branchType: "feat",
    });

    expect(classification.route).toBe("planned");
    expect(classification.requiredStages).toContain("prd");
    expect(classification.requiredStages).toContain("plan");
  });

  it("creates stable titles and slugs", () => {
    expect(deriveCycleTitle("Build the Dev Cycle Pi Extension", [])).toBe("Build the Dev Cycle Pi Extension");
    expect(slugify("Build the Dev Cycle Pi Extension")).toBe("build-the-dev-cycle-pi-extension");
  });

  it("truncates slugs when a max length is provided", () => {
    expect(slugify("A ".repeat(40), 60)).toHaveLength(60);
  });
});
