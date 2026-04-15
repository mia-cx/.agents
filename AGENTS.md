## Learned User Preferences

- When writing prompts for LLMs, use positive framing rather than negative instructions ("don't do X") — negative instructions seed the model to consider the forbidden option ("don't think about pink elephants").
- LLM prompts should not include backstory, references to prior phases, or historical context the model doesn't need — keep prompts focused on the current task only.
- Reasoning sections in prompts and plans should explain *why* a reframe is happening, not enumerate constraints or what is no longer relevant.
- Prefer bottom-up discovery with example lists over canonical/exhaustive lists in prompts — let categories emerge from data and provide the list as a hint, not a constraint.
- When a user references the wrong file (e.g., a backup copy), revert the accidental edit and re-apply to the correct file — don't leave both files changed.
- Historical/archive files (e.g., session-prompts tracking prompt refinement history) should be left intact when doing bulk renames; only update files where the reference is actively used.

## Learned Workspace Facts

- This workspace (`/Users/mia/.agents`) hosts a `role-to-sop` project in `.worktrees/role-to-sop/` with plan files under `.plans/`.
- The `role-to-sop` project audits multiple reference repos to extract the strongest portable SOPs and policies using an "ant colony" parallel tasking pattern.
- Key active plan files: `ORCHESTRATION-PROMPT.md` and `AUDIT-PROMPT.md` in `.worktrees/role-to-sop/.plans/`.
- The project uses a two-phase approach: (1) per-repo audit to produce a shortlist, (2) cross-repo comparison to select the best element per SOP/policy.
- Skills and subagents live under `/Users/mia/.claude/skills/` and `/Users/mia/.cursor/skills-cursor/`.
- Continual-learning index is at `/Users/mia/.agents/.cursor/hooks/state/continual-learning.json` (not `continual-learning-index.json`).
