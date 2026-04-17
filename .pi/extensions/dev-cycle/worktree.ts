import * as path from "node:path";
import type { BranchType } from "./types.js";

export interface ExecLikeResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export type ExecLike = (command: string, args: string[], cwd: string) => Promise<ExecLikeResult>;

export function getCycleWorktreePath(repoRoot: string, slug: string): string {
  return path.join(repoRoot, ".worktrees", "cycles", slug);
}

export function getCycleBranchName(branchType: BranchType, slug: string): string {
  return `${branchType}/${slug}`;
}

export async function ensureCycleWorktree(
  repoRoot: string,
  slug: string,
  branchType: BranchType,
  execLike: ExecLike,
): Promise<{ path: string; branch: string; reused: boolean }> {
  const worktreePath = getCycleWorktreePath(repoRoot, slug);
  const branchName = getCycleBranchName(branchType, slug);

  const branchCheck = await execLike("git", ["branch", "--list", branchName], repoRoot);
  const branchExists = branchCheck.stdout.trim().length > 0;

  const worktreeList = await execLike("git", ["worktree", "list", "--porcelain"], repoRoot);
  const alreadyExists = worktreeList.stdout.includes(`worktree ${worktreePath}`);
  if (alreadyExists) {
    return { path: worktreePath, branch: branchName, reused: true };
  }

  const args = branchExists
    ? ["worktree", "add", worktreePath, branchName]
    : ["worktree", "add", "-b", branchName, worktreePath];
  const created = await execLike("git", args, repoRoot);
  if (created.exitCode !== 0) {
    throw new Error(created.stderr || `Failed to create worktree ${worktreePath}`);
  }

  return { path: worktreePath, branch: branchName, reused: false };
}
