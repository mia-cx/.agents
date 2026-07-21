---
name: create-prd
description: >-
  Create a PRD through user interview, codebase exploration, and module design,
  then submit it as a GitHub issue. The default entrypoint for planning
  anything bigger than a single feature or slice: multi-feature efforts, new
  systems, epics, large refactors. Also use when the user wants to write a
  PRD, create a product requirements document, or plan a new feature.
---

# Create PRD

Interview the user, verify against the codebase, design the modules, then file the PRD as a GitHub issue. Skip steps you don't consider necessary.

1. Ask the user for a long, detailed description of the problem they want to solve and any potential ideas for solutions.

2. Explore the repo to verify their assertions and understand the current state of the codebase.

3. Interview the user relentlessly about every aspect of this plan until you reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. Ask one question at a time and provide your recommended answer with each. If a question can be answered by exploring the codebase, explore the codebase instead of asking.

4. Sketch out the major modules to build or modify. Actively look for opportunities to extract deep modules — a deep module encapsulates a lot of functionality behind a simple, testable interface that rarely changes. Check with the user that the modules match their expectations, and which modules they want tests written for.

5. Once you have a complete understanding of the problem and solution, write the PRD using the template below and submit it as a GitHub issue.

## Issue metadata

Discover available metadata before creating the issue and apply best-fit values:

```bash
gh api graphql -f query='{organization(login:"OWNER"){issueTypes(first:20){nodes{name}}}}' \
  --jq '.data.organization.issueTypes.nodes[].name' 2>/dev/null || true
gh label list --json name,description
gh api "/repos/OWNER/REPO/milestones?state=open" --jq '.[].title'
gh project list --owner OWNER --format json --jq '.projects[].title' 2>/dev/null || true
gh api "/repos/OWNER/REPO/collaborators" --jq '.[].login'
```

- **Issue type** — when the org has types, set one on the issue; types replace type-labels:
  `gh api --method PATCH "/repos/OWNER/REPO/issues/N" --input - <<< '{"type": "TYPE_NAME"}'`.
- `--label` — existing labels that fit (excluding type duty when types exist); create one only if none fit and the repo has a labeling convention.
- `--assignee` — the user if they're a collaborator, otherwise ask who owns it.
- `--milestone` / `--project` — attach when a relevant one exists.

Confirm metadata choices with the user when multiple options are plausible; skip a category silently when it has no values.

<prd-template>

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A LONG, numbered list of user stories covering all aspects of the feature:

1. As an <actor>, I want a <feature>, so that <benefit>

## Implementation Decisions

The implementation decisions that were made: modules to build/modify and their interfaces, technical clarifications, architectural decisions, schema changes, API contracts, specific interactions.

Do NOT include specific file paths or code snippets — they go stale quickly. Exception: a prototype snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape) — inline it within the relevant decision, trimmed to the decision-rich parts, noting it came from a prototype.

## Testing Decisions

What makes a good test (external behavior only, not implementation details), which modules get tests, and prior art for the tests in the codebase.

## Out of Scope

The things that are out of scope for this PRD.

## Further Notes

Any further notes about the feature.

</prd-template>
