### 7. Confirm

After all issues are created and attached, print a summary table:

| # | Title | Type | Labels | Assignee | Blocked by | Blocking | Sub-issue of |
|---|-------|------|--------|----------|------------|----------|--------------|
| 3 | Package scaffold | AFK | — | @user | None | #4, #5 | #1 |
| 4 | SQLite store | AFK | — | @user | #3 | #6 | #1 |
| ... | ... | ... | ... | ... | ... | ... | ... |

Verify:
- Parent PRD issue shows the sub-issue checklist on GitHub
- Each issue shows its blocking/blocked-by relationships
- Dependency chain is acyclic and correct
