import { execFile } from "node:child_process";
import type { ExecLikeResult } from "./worktree.js";

export function execCommand(command: string, args: string[], cwd: string): Promise<ExecLikeResult> {
  return new Promise((resolve) => {
    execFile(command, args, { cwd }, (error, stdout, stderr) => {
      resolve({
        stdout,
        stderr,
        exitCode: error ? ((error as { code?: number }).code ?? 1) : 0,
      });
    });
  });
}
