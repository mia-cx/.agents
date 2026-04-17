import { execFile } from "node:child_process";

function execGh(args: string[], cwd: string): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolve) => {
    execFile("gh", args, { cwd }, (error, stdout, stderr) => {
      resolve({
        stdout,
        stderr,
        exitCode: error ? ((error as { code?: number }).code ?? 1) : 0,
      });
    });
  });
}

export async function createGitHubIssue(
  cwd: string,
  title: string,
  body: string,
): Promise<{ number: number; url: string }> {
  const result = await execGh(["issue", "create", "--title", title, "--body", body], cwd);
  if (result.exitCode !== 0) {
    throw new Error(result.stderr || "gh issue create failed");
  }

  const url = result.stdout.trim();
  const numberMatch = url.match(/\/issues\/(\d+)$/);
  if (!numberMatch) {
    throw new Error(`Could not parse issue number from ${url}`);
  }

  return { number: Number(numberMatch[1]), url };
}
