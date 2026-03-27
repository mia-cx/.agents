## Rules

- **Do not review code yourself.** You are the orchestrator. Delegate everything to subagents.
- **Do not merge.** Review only. Use the `pr-merge` skill separately if the user wants to merge.
- **Zero-issue reviews are valid.** If agents find nothing, the verdict is ✅ Approved with a clean summary.
- **Bias toward fewer agents.** Don't spawn Verifier if there are no acceptance criteria. Don't spawn Security Reviewer for a docs-only PR.

## Follow-up Skills

- **`pr-resolve-discussions`** — If the PR already has unresolved review threads (from a prior review or from this one), suggest using `pr-resolve-discussions` to validate and fix them. That skill investigates each finding, implements architectural fixes for real issues, and resolves threads on GitHub.
- **`pr-merge`** — Once the review is clean and all discussions are resolved, use `pr-merge` to land it.
