import { describe, expect, it } from "vitest";
import { ensureCycleWorktree, getCycleBranchName, getCycleWorktreePath } from "./worktree.js";

describe("worktree helpers", () => {
  it("derives worktree paths and branch names", () => {
    expect(getCycleWorktreePath("/repo", "my-cycle")).toBe("/repo/.worktrees/cycles/my-cycle");
    expect(getCycleBranchName("feat", "my-cycle")).toBe("feat/my-cycle");
  });

  it("reuses an existing worktree", async () => {
    const calls: string[] = [];
    const execLike = async (command: string, args: string[], cwd: string) => {
      calls.push(`${command} ${args.join(" ")} @ ${cwd}`);
      if (args[0] === "branch") return { stdout: "  feat/my-cycle\n", stderr: "", exitCode: 0 };
      return {
        stdout: "worktree /repo/.worktrees/cycles/my-cycle\nbranch refs/heads/feat/my-cycle\n",
        stderr: "",
        exitCode: 0,
      };
    };

    const result = await ensureCycleWorktree("/repo", "my-cycle", "feat", execLike);
    expect(result.reused).toBe(true);
    expect(calls).toHaveLength(2);
  });

  it("creates a new branch when no worktree exists yet", async () => {
    const calls: string[] = [];
    const execLike = async (_command: string, args: string[], _cwd: string) => {
      calls.push(args.join(" "));
      if (args[0] === "branch") return { stdout: "", stderr: "", exitCode: 0 };
      if (args[0] === "worktree" && args[2] === "--porcelain") return { stdout: "", stderr: "", exitCode: 0 };
      return { stdout: "", stderr: "", exitCode: 0 };
    };

    const result = await ensureCycleWorktree("/repo", "my-cycle", "feat", execLike);
    expect(result.reused).toBe(false);
    expect(calls.at(-1)).toContain("-b feat/my-cycle");
  });
});
