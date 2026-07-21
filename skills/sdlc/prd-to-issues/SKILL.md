---
name: prd-to-issues
description: >-
  Break a PRD into independently-grabbable GitHub issues using tracer-bullet
  vertical slices, attached as sub-issues of the PRD with blocking
  relationships. Use when the user wants to convert a PRD to issues, create
  implementation tickets, or break down a PRD into work items.
---

# PRD to Issues

Break a PRD into independently-grabbable GitHub issues using vertical slices (tracer bullets). Created issues are attached as **sub-issues** of the parent PRD issue with **blocking relationships**, so GitHub natively tracks completion and dependencies.

## Process

### 1. Locate the PRD

Ask the user for the PRD issue number or URL. If it's not already in context, fetch it with `gh issue view <number>` (with comments). Explore the codebase if you haven't already.

### 2. Discover issue metadata

```bash
gh api graphql -f query='{organization(login:"OWNER"){issueTypes(first:20){nodes{name}}}}' \
  --jq '.data.organization.issueTypes.nodes[].name' 2>/dev/null || true
gh label list --json name,description
gh api "/repos/OWNER/REPO/milestones?state=open" --jq '.[].title'
gh project list --owner OWNER --format json --jq '.projects[].title' 2>/dev/null || true
gh api "/repos/OWNER/REPO/collaborators" --jq '.[].login'
```

Note what's available — issue types, labels, milestones, projects, assignees — and apply it when creating issues in step 5. When the org has issue types, they carry the type signal; labels don't double as types.

### 3. Draft vertical slices

While exploring, look for opportunities to **prefactor** — "make the change easy, then make the easy change." Prefactoring slices come first and block the slices they ease.

Each issue is a thin vertical slice cutting through ALL integration layers end-to-end, NOT a horizontal slice of one layer:

- Each slice delivers a narrow but COMPLETE path through every layer (schema, API, UI, tests).
- A completed slice is demoable or verifiable on its own.
- Each slice is sized to fit in a single fresh context window.
- Prefer many thin slices over few thick ones.

Slices are **HITL** (need human interaction — an architectural decision, a design review) or **AFK** (implementable and mergeable without one). Prefer AFK where possible.

**Wide refactors are the exception to vertical slicing.** A wide refactor is one mechanical change — rename a column, retype a shared symbol — whose blast radius fans across the whole codebase, so a single edit breaks thousands of call sites and no vertical slice can land green. Sequence it as **expand–contract**: first *expand* (add the new form beside the old so nothing breaks), then *migrate* call sites in batches sized by blast radius (per package, per directory — each batch its own issue blocked by the expand), finally *contract* (delete the old form once no caller remains, blocked by every migrate batch). When even the batches can't stay green alone, keep the sequence but let them share an integration branch that all block a final integrate-and-verify issue — green is promised only there.

### 4. Quiz the user

Present the breakdown as a numbered list — per slice: title, HITL/AFK, blocked-by, user stories covered — plus the proposed metadata assignments (labels, milestone, project, assignees, issue type). Ask:

- Does the granularity feel right? Should any slice be merged or split?
- Are the dependency relationships correct?
- Are the right slices HITL vs AFK?
- Are the metadata assignments correct?

Iterate until the user approves.

### 5. Create sub-issues with blocking relationships

Create issues in dependency order (blockers first) so real issue numbers can be referenced. For each slice:

```bash
# 1. Create with metadata, capture the number
ISSUE_URL=$(gh issue create --title "Slice title" --body-file <body> \
  --label "l1,l2" --assignee "user" --milestone "m" --project "p" --repo OWNER/REPO)
ISSUE_NUMBER=$(echo "$ISSUE_URL" | grep -o '[0-9]*$')

# 2. Issue type, if the org has types
gh api --method PATCH "/repos/OWNER/REPO/issues/${ISSUE_NUMBER}" --input - <<< '{"type": "TYPE_NAME"}'

# 3. Attach as sub-issue of the PRD (needs the numeric id)
ISSUE_ID=$(gh api "/repos/OWNER/REPO/issues/${ISSUE_NUMBER}" --jq '.id')
gh api --method POST "/repos/OWNER/REPO/issues/PRD_NUMBER/sub_issues" \
  --input - <<< "{\"sub_issue_id\": ${ISSUE_ID}}"
```

Then set blocking relationships via GraphQL (needs node IDs — collect them all first, then batch):

```bash
declare -A NODES
for num in 3 4 5 6; do
  NODES[$num]=$(gh api "/repos/OWNER/REPO/issues/${num}" --jq '.node_id')
done

add_blocked_by() {  # add_blocked_by <issue> <blocker>
  gh api graphql -f query="
    mutation {
      addBlockedBy(input: {issueId: \"${NODES[$1]}\", blockingIssueId: \"${NODES[$2]}\"}) {
        blockingIssue { number }
        issue { number }
      }
    }" --jq '.data.addBlockedBy | "#\(.issue.number) blocked by #\(.blockingIssue.number)"'
}

add_blocked_by 4 3
add_blocked_by 5 3
```

Do NOT close or modify the parent PRD issue.

<issue-template>
## Parent PRD

#<prd-issue-number>

## What to build

A concise description of this vertical slice. Describe the end-to-end behavior, not layer-by-layer implementation. Reference specific sections of the parent PRD rather than duplicating content. Avoid file paths and code snippets — they go stale fast. Exception: a prototype snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape) — inline it trimmed to the decision-rich parts, noting it came from a prototype.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Blocked by

- Blocked by #<issue-number> — or "None - can start immediately"

## User stories addressed

By number from the parent PRD, e.g. user stories 3 and 7.
</issue-template>

### 6. Confirm

Print a summary table:

| # | Title | Type | Labels | Assignee | Blocked by | Blocking | Sub-issue of |
|---|-------|------|--------|----------|------------|----------|--------------|
| 4 | SQLite store | AFK | — | @user | #3 | #6 | #1 |

Verify: the PRD shows the sub-issue checklist on GitHub, each issue shows its blocking/blocked-by relationships, and the dependency chain is acyclic.
