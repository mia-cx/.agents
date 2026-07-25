---
name: review-loop
description: >-
  Drives a pull request to merge-readiness by looping parallel adversarial
  reviews across correctness, security, and coverage, fixing real findings,
  resolving discussion threads, and re-triggering supported PR review bots
  until no real issues remain. Uses GPT-only review when invoked from Codex
  and mixed Claude/GPT review otherwise. Use when the user asks for a review
  loop, a PR review, to address review comments or resolve discussions, or to
  get a PR merge-ready.
---

# Review Loop

Drive the PR for the current branch to merge-readiness: run adversarial reviews, fix what is real, resolve discussions, re-trigger review bots, repeat on the new head until clean. Do not merge — that is a separate, explicit request.

## Runtime gate

Classify the runner once at loop start and keep that mode for every cycle:

- **Codex-native** when `REVIEW_LOOP_RUNNER=codex`, `CODEX_THREAD_ID` is set, or `CODEX_CI` is set. Run only the GPT reviewer for each aspect: three reviewers total.
- **Mixed** otherwise. Run one Claude and one GPT reviewer for each aspect: six reviewers total.

Workflow wrappers that do not preserve Codex's environment set `REVIEW_LOOP_RUNNER=codex` before invoking this skill. Record the selected mode and evidence in the final report.

## Reviewer matrix

Review three aspects in parallel at high reasoning effort. Always run the GPT side; add the Claude side only in mixed mode. Resolve concrete models from CLAUDE.md "Picking the right models" at loop start:

| Aspect | Hunts for | Model pick |
| --- | --- | --- |
| Correctness | Behavior that deviates from the acceptance criteria, wrong results, broken edge cases, contract violations | Top intelligence, stepping down one tier when that buys ≥2 cost points and intelligence stays ≥6.5 |
| Security | Glaring exploitable issues: injection, authz gaps, secret leaks, unsafe input handling | Top intelligence, cost ignored |
| Coverage | Failing tests, and changed behavior in this PR that has no unit test though it is testable | GPT: best cost with intelligence ≥6. Claude when enabled: best cost |

Mechanics:

- **Claude reviewers in mixed mode**: spawn via the Agent tool (or Workflow `agent()`), read-only mandate, model per the pick, high effort.
- **GPT reviewers**: the `codex-review` skill, at the picked model and high reasoning effort.

### Cursor reviewers (opt-in)

Only when the user asks for cursor reviews. Adds a third reviewer per aspect — same three aspects, same brief — via the Cursor CLI:

```bash
agent -p --model auto --mode plan "<same aspect brief>" > "$ARTIFACT_DIR/cursor-<aspect>.md"
```

**Always `--model auto`, for every cursor reviewer, every cycle.** `auto` is the only permitted value of this flag. Auto-routed requests are the included Cursor plan usage; every other model id (`gpt-5.6-sol-high`, `claude-opus-5-thinking-high`, `composer-2.5`, anything from `agent --list-models`) bills the API pool per token. Requests to run cursor reviewers on a specific model get the same answer: run `auto`, or skip the cursor path — and say which. The model-picking rubric in CLAUDE.md governs the Claude and GPT reviewers only; it never selects a cursor model.

`--mode plan` keeps the reviewer read-only. Run all three in parallel alongside the gate-selected reviewers, feed their findings through the same verification in step 3, and report the cursor reviewer count in the final report.

Each reviewer gets the same brief: the PR diff target, the acceptance criteria, its single aspect, and an adversarial mandate — actively try to break the change; report only findings with a concrete failure mode (input/state → wrong outcome) and file:line; if nothing is found, say so and name what was inspected.

## Loop

1. **Gather context.** `gh pr view --json number,title,body,headRefName,baseRefName,url`, `gh pr diff`, acceptance criteria from the PR body / linked issue / plan file, and unresolved review threads (query below). Record the head SHA.
2. **Spawn the mode-selected reviewers in parallel** against that head: three in Codex-native mode, six in mixed mode, plus three more when cursor reviews are opted in.
3. **Verify findings yourself.** Read the cited code before acting; dedupe across reviewers. A finding survives only with a concrete failure mode — see "What counts as real". Agreement between both sides of an aspect is strong signal, but a single verified finding is enough.
4. **Fix real findings at the right level.** Prefer making the bug class unrepresentable (types, ownership, API shape) over spot-patches; check for sibling instances of the same bug; add a test proving the fix. Same standard for findings from external threads.
5. **Resolve discussions.** For each unresolved thread: fixed → reply with the commit SHA and rationale; false positive or already handled → reply with the evidence (exact code path). Then resolve the thread.
6. **Commit and push** (conventional commits, one per concern), then **re-trigger supported review bots already in the PR conversation** — and only if something was pushed. The allowlist is:
   - `chatgpt-codex-connector` → `gh pr comment <n> --body '@codex review'`
   - `coderabbitai` → `gh pr comment <n> --body '@coderabbitai review'`
7. **Wait for required CI and the re-triggered bot reviews**, then repeat from step 1 on the new head while real issues keep surfacing.

## What counts as real

Loop-worthy: evidence-backed problems that can plausibly cause wrong results, crashes, security exposure, data loss or corruption, broken compatibility, acceptance-criteria violations, or an unreliable required CI gate.

Stop rather than churn on:

- Naming/style preferences and test-helper polish.
- States unreachable in practice: the code tolerates them, but no caller or route can produce them and no planned work will introduce one. Fixing those is speculation, not correctness. Carve-out: anything a network client can hit directly is reachable regardless of what the frontend exposes — CORS and UI validation gate browsers, not curl — so unreachability never waives checks at a real trust boundary.
- Edge-case exhaustion in tests, and extra tests for behavior already covered at the right boundary. Tests exist to prove the code works; piling on cases to make the suite look thorough is testing the tests.
- Hypothetical fault chains with no credible runtime path, and coverage of states already excluded by types.

Impact and plausibility decide — not whether a reviewer can imagine a scenario. Give extra scrutiny to high-impact boundaries (auth, persistence, destructive operations, concurrency) even when failure odds are low.

## Discussion thread mechanics

```bash
# List threads — act on isResolved: false, isOutdated: false
gh api graphql -f owner=OWNER -f repo=REPO -F number=N -f query='
  query($owner:String!,$repo:String!,$number:Int!){
    repository(owner:$owner,name:$repo){pullRequest(number:$number){
      reviewThreads(first:100){nodes{
        id isResolved isOutdated path line
        comments(first:20){nodes{author{login} body}}}}}}}'

# Reply, then resolve
gh api graphql -f threadId=ID -f body="..." -f query='
  mutation($threadId:ID!,$body:String!){
    addPullRequestReviewThreadReply(input:{pullRequestReviewThreadId:$threadId,body:$body}){comment{id}}}'
gh api graphql -f threadId=ID -f query='
  mutation($threadId:ID!){resolveReviewThread(input:{threadId:$threadId}){thread{isResolved}}}'
```

## Stop condition

All true for the latest pushed head:

- Every reviewer selected by the runtime gate — plus the cursor reviewers when opted in — reports no real findings.
- No actionable unresolved discussion threads remain.
- Required CI passes, or a failure is proven unrelated and reported as such.
- Every re-triggered supported bot reviewed the latest head and raised nothing real.

## Final report

Report: final head SHA, runner mode and evidence, reviewer count, cycles run, fixes made, CI and bot-review status, and remaining thread count. Close with a human-verification handoff: the manual checks automation could not prove (real integrations, UI flows, credentials, deploy behavior), each with exact steps, expected result, and failure signals — or state explicitly that no manual verification is needed.
