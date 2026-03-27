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
