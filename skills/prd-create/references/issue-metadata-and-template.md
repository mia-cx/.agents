### Issue metadata

Before creating the issue, discover available metadata for the repo and apply the best-fit values:

```bash
# Labels
gh label list --json name,description

# Issue types (if enabled)
gh api "/repos/OWNER/REPO" --jq '.issue_types // empty' 2>/dev/null || true

# Milestones
gh api "/repos/OWNER/REPO/milestones?state=open" --jq '.[].title'

# Projects (org or user)
gh project list --owner OWNER --format json --jq '.projects[].title' 2>/dev/null || true

# Assignees (collaborators)
gh api "/repos/OWNER/REPO/collaborators" --jq '.[].login'
```

When creating the issue, apply the appropriate flags:

- `--label` — use existing labels that fit (e.g., `enhancement`, `prd`, `feature`). Create a label if none fit and the repo has a labeling convention.
- `--assignee` — assign to the user if they are a collaborator, or ask who should own it.
- `--milestone` — attach to the relevant open milestone if one exists.
- `--project` — attach to the relevant project board if one exists.

If the repo has issue types enabled, set the type via:
```bash
gh api --method PATCH "/repos/OWNER/REPO/issues/NUMBER" \
  --input - <<< '{"type": "TYPE_NAME"}'
```

Ask the user to confirm metadata choices if there are multiple plausible options. Skip silently if a metadata category has no values (e.g., no milestones, no projects).

<prd-template>

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A LONG, numbered list of user stories. Each user story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

This list of user stories should be extremely extensive and cover all aspects of the feature.

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

## Testing Decisions

A list of testing decisions that were made. Include:

- A description of what makes a good test (only test external behavior, not implementation details)
- Which modules will be tested
- Prior art for the tests (i.e. similar types of tests in the codebase)

## Out of Scope

A description of the things that are out of scope for this PRD.

## Worktree Setup

All implementation work for this PRD should happen in a dedicated worktree to keep `main` clean:

```bash
git worktree add .worktrees/<feature-name> -b feat/<feature-name>
cd .worktrees/<feature-name>
```

Merge back to `main` only after the feature is complete and reviewed.

## Further Notes

Any further notes about the feature.

</prd-template>
