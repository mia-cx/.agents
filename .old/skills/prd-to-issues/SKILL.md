---
name: prd-to-issues
description: Break a PRD into independently-grabbable GitHub issues using tracer-bullet vertical slices. Use when user wants to convert a PRD to issues, create implementation tickets, or break down a PRD into work items.
---

# PRD to Issues

Break a PRD into independently-grabbable GitHub issues using vertical slices (tracer bullets). Created issues are attached as **GitHub sub-issues** of the parent PRD issue with **blocking relationships** for native tracking, planning, and dependency visualization.

## Process

### 1. Locate the PRD

Ask the user for the PRD GitHub issue number (or URL).

If the PRD is not already in your context window, fetch it with `gh issue view <number>` (with comments).

### 2. Explore the codebase (optional)

If you have not already explored the codebase, do so to understand the current state of the code.

### 3. Discover issue metadata

Before creating issues, discover available metadata for the repo:

```bash
# Labels
gh label list --json name,description

# Issue types (if enabled — check via GraphQL for org-level types)
gh api graphql -f query='{
  organization(login: "OWNER") {
    issueTypes(first: 20) {
      nodes { name description }
    }
  }
}' --jq '.data.organization.issueTypes.nodes[] | .name' 2>/dev/null || true

# Milestones
gh api "/repos/OWNER/REPO/milestones?state=open" --jq '.[].title'

# Projects (org or user)
gh project list --owner OWNER --format json --jq '.projects[].title' 2>/dev/null || true

# Assignees (collaborators)
gh api "/repos/OWNER/REPO/collaborators" --jq '.[].login'
```

Note which labels, milestones, projects, assignees, and issue types are available. You will apply these when creating issues in step 6.

### 4. Draft vertical slices

Break the PRD into **tracer bullet** issues. Each issue is a thin vertical slice that cuts through ALL integration layers end-to-end, NOT a horizontal slice of one layer.

Slices may be 'HITL' or 'AFK'. HITL slices require human interaction, such as an architectural decision or a design review. AFK slices can be implemented and merged without human interaction. Prefer AFK over HITL where possible.

<vertical-slice-rules>
- Each slice delivers a narrow but COMPLETE path through every layer (schema, API, UI, tests)
- A completed slice is demoable or verifiable on its own
- Prefer many thin slices over few thick ones
</vertical-slice-rules>

### 5. Quiz the user

Present the proposed breakdown as a numbered list. For each slice, show:

- **Title**: short descriptive name
- **Type**: HITL / AFK
- **Blocked by**: which other slices (if any) must complete first
- **User stories covered**: which user stories from the PRD this addresses

Also present the proposed metadata assignments:

- **Labels**: which labels will be applied to each issue (and to the parent PRD if not already labeled)
- **Milestone**: which milestone (if any) all issues should be attached to
- **Project**: which project board (if any) all issues should be attached to
- **Assignee**: who each issue should be assigned to (default: same as PRD author, or ask)
- **Issue type**: which issue type to set (if the repo has types enabled)

Ask the user:

- Does the granularity feel right? (too coarse / too fine)
- Are the dependency relationships correct?
- Should any slices be merged or split further?
- Are the correct slices marked as HITL and AFK?
- Are the metadata assignments correct?

Iterate until the user approves the breakdown.

### 6. Create the GitHub issues as sub-issues with blocking relationships

For each approved slice, create a GitHub issue using `gh issue create` with the appropriate metadata flags, then **attach it as a sub-issue** of the parent PRD issue and **set blocking relationships** between issues.

Create issues in dependency order (blockers first) so you can reference real issue numbers in the "Blocked by" field.

#### Creating and attaching a sub-issue

```bash
# 1. Create the issue with metadata and capture its URL
ISSUE_URL=$(gh issue create \
  --title "Slice title" \
  --body "issue body..." \
  --label "label1,label2" \
  --assignee "username" \
  --milestone "milestone-name" \
  --project "project-name" \
  --repo OWNER/REPO)
ISSUE_NUMBER=$(echo "$ISSUE_URL" | grep -o '[0-9]*$')

# 2. Set issue type if the repo has types enabled
gh api --method PATCH "/repos/OWNER/REPO/issues/${ISSUE_NUMBER}" \
  --input - <<< '{"type": "TYPE_NAME"}'

# 3. Get the issue's numeric ID (required by the sub-issues API)
ISSUE_ID=$(gh api "/repos/OWNER/REPO/issues/${ISSUE_NUMBER}" --jq '.id')

# 4. Attach as sub-issue of the parent PRD
gh api --method POST "/repos/OWNER/REPO/issues/PRD_NUMBER/sub_issues" \
  --input - <<< "{\"sub_issue_id\": ${ISSUE_ID}}"
```

#### Setting blocking relationships

After all issues are created, set blocking relationships using the GraphQL API. This requires node IDs (not numeric IDs).

```bash
# Get node ID for an issue
NODE_ID=$(gh api "/repos/OWNER/REPO/issues/NUMBER" --jq '.node_id')

# Set "issue X is blocked by issue Y"
ISSUE_NODE=$(gh api "/repos/OWNER/REPO/issues/X" --jq '.node_id')
BLOCKING_NODE=$(gh api "/repos/OWNER/REPO/issues/Y" --jq '.node_id')
gh api graphql -f query="
  mutation {
    addBlockedBy(input: {
      issueId: \"${ISSUE_NODE}\"
      blockingIssueId: \"${BLOCKING_NODE}\"
    }) {
      blockingIssue { number }
      issue { number }
    }
  }
"
```

Batch this efficiently — collect all node IDs first, then set all relationships:

```bash
# Collect node IDs
declare -A NODES
for num in 3 4 5 6; do
  NODES[$num]=$(gh api "/repos/OWNER/REPO/issues/${num}" --jq '.node_id')
done

# Set relationships
add_blocked_by() {
  gh api graphql -f query="
    mutation {
      addBlockedBy(input: {
        issueId: \"${NODES[$1]}\"
        blockingIssueId: \"${NODES[$2]}\"
      }) {
        blockingIssue { number }
        issue { number }
      }
    }
  " --jq '.data.addBlockedBy | "#\(.issue.number) blocked by #\(.blockingIssue.number)"'
}

add_blocked_by 4 3   # #4 blocked by #3
add_blocked_by 5 3   # #5 blocked by #3
```

The parent PRD issue will show a sub-issue checklist with completion tracking, and each issue will show its blocking/blocked-by relationships on GitHub.

<issue-template>
## Parent PRD

#<prd-issue-number>

## What to build

A concise description of this vertical slice. Describe the end-to-end behavior, not layer-by-layer implementation. Reference specific sections of the parent PRD rather than duplicating content.

## Worktree setup

Work on this issue in a dedicated worktree branched from `main`:

```bash
git worktree add .worktrees/<short-name> -b feat/<short-name>
cd .worktrees/<short-name>
```

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Blocked by

- Blocked by #<issue-number> (if any)

Or "None - can start immediately" if no blockers.

## User stories addressed

Reference by number from the parent PRD:

- User story 3
- User story 7

</issue-template>

Do NOT close or modify the parent PRD issue.

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
