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
