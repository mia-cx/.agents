---
name: review-relay
description: >-
  Drives a pull request to merge-readiness as a relay race: one adversarial
  reviewer per leg, rotating providers (Claude, Codex, optionally Cursor) over
  correctness, security and coverage, fixing real findings between legs,
  resolving discussion threads, and re-triggering supported PR review bots
  until a full lap comes back clean. Use when the user asks for a review relay
  or review loop, a PR review, to address review comments or resolve
  discussions, or to get a PR merge-ready.
---

# Review Relay

Drive the PR for the current branch to merge-readiness as a relay race: each provider runs a leg — reviews the head, you fix what is real — then hands the fixed head to the next provider. The race ends when a full lap comes back clean. Do not merge — that is a separate, explicit request.

**The baton is the head SHA.** Every handoff passes a head that already absorbed the previous leg's findings; a provider reviewing a stale head is a dropped baton, and its leg does not count.

## The lineup

One reviewer per leg, from one provider, covering all three domains at once. Fix before every handoff — a fresh pair of eyes on fresh code is the point.

With Cursor omitted, the normal relay alternates Codex and Claude indefinitely. The host-aware first leg below only decides which of those two starts. A user may override the lineup for one run; record that as runtime state and never persist it into this skill's defaults.

Set the lineup from the host — the agent that invoked this skill — classified once at loop start:

| Host | Lineup (laps) | Classified by |
| --- | --- | --- |
| Claude Code | codex → claude → cursor | default when nothing below matches |
| Codex | claude → codex → cursor | `REVIEW_LOOP_RUNNER=codex`, `CODEX_THREAD_ID`, or `CODEX_CI` |
| Cursor | codex → claude → cursor | `REVIEW_LOOP_RUNNER=cursor` or `CURSOR_AGENT` |

The host never runs the first leg: the first opinion on the diff comes from outside the agent that wrote it. Workflow wrappers that do not preserve their host's environment set `REVIEW_LOOP_RUNNER` before invoking this skill. **Cursor is opt-in** — drop it from the lineup unless the user asked for cursor reviews, leaving the alternating two-provider lap. Record the host, its evidence, and the resulting lineup in the final report.

Provider mechanics, at high reasoning effort in every case:

- **claude** — spawn via the Agent tool (or Workflow `agent()`) with a read-only mandate, at the top-intelligence model from CLAUDE.md "Picking the right models".
- **codex** — use this skill's runtime wrapper with the top-intelligence GPT model selected by the local Codex configuration:

  ```bash
  review_relay_skill_dir="<directory containing this SKILL.md>"
  "$review_relay_skill_dir/scripts/run-codex-review.sh" "$PROMPT_FILE" "$ARTIFACT_DIR/codex-$LEG"
  ```

  Resolve the script path relative to this `SKILL.md`. It runs `codex -s danger-full-access review -`; the read-only sandbox fails at the first bundled bubblewrap tool call, while `codex exec` with stdin can exit successfully with an empty report. Exit 0 is insufficient: the wrapper rejects an empty report.
- **cursor** — the local `agent` cursor-cli binary:

  ```bash
  agent -p --model auto --mode plan "<full reviewer brief>" > "$ARTIFACT_DIR/cursor-<n>.md"
  ```

  **Always `--model auto`.** `auto` is the only permitted value of this flag. Auto-routed requests are the included Cursor plan usage; every other model id (`gpt-5.6-sol-high`, `claude-opus-5-thinking-high`, `composer-2.5`, anything from `agent --list-models`) bills the API pool per token. Requests to run the cursor reviewer on a specific model get the same answer: run `auto`, or drop cursor from the lineup — and say which. The CLAUDE.md model rubric governs the claude and codex legs only; it never selects a cursor model. `--mode plan` keeps the reviewer read-only.

  This path is the local `agent` CLI only. Cursor's PR-side bots are a different mechanism and never a substitute: leave `@cursor review`, `@bugbot run`, and every other PR comment trigger out of it. Bots already in the PR conversation are handled by the bot-allowlist step, which does not include Cursor.

### Codex runtime contract

Keep the Codex prompt at 25 physical lines or fewer; long briefs cause the CLI reviewer to stall or fail to produce a final report. Its first line is:

```text
Do not invoke any skill, and do not spawn sub-agents. Review yourself; do not edit files.
```

Compress the shared reviewer brief without dropping its content: target diff and SHA; acceptance criteria; correctness/security/coverage; concrete failure format; breadth-first and sibling sweep; dry-pass requirement; resolved-finding ledger; focused verification commands. Treat repository decisions and recon as authoritative. Browse or re-scrape a live integration only for a concrete unresolved contradiction, because unconstrained recon can turn one leg into a duplicate investigation.

Codex writes the report only when the process finishes. A zero-byte report while the process is alive is not a failure; keep waiting and give the user progress updates. A finished nonzero process or empty report is a failed attempt: record it, fix the invocation, and rerun the same lineup slot. It never counts as a leg.

## Runtime state and resume

Create a stable artifact directory for the PR under the system temp directory and keep `state.md` there. Before the first leg — or when resuming a handoff — record and verify:

- PR number, base/head branches, baton SHA, host evidence, lineup, and next leg.
- Acceptance-criteria sources and the open PR stack (`gh pr list --json number,headRefName,baseRefName,headRefOid`). Compare descendant diffs when deciding whether a finding is live, already fixed downstream, or superseded; a base defect that descendants inherit is still live.
- Baseline commands/results, required CI, supported bots present, unresolved thread IDs, and which bot reviews target the baton SHA.
- Every attempted leg: provider, reviewed SHA, report/trace paths, outcome, and whether it counts.
- A finding ledger: stable ID, failure mode, disposition, evidence, fixing SHA, affected files, and induced regression if any.

On resume, compare the PR head with the recorded baton before doing work. Reuse valid completed legs and dispositions; rerun only stale, interrupted, failed, or empty-report attempts. Feed reviewers a compact resolved-finding ledger so a repeated rejection needs new evidence rather than another vote.

## Reviewer brief

Every leg, whichever provider, gets the same brief: the PR diff target, the acceptance criteria, all three domains below, and an adversarial mandate — actively try to break the change; report only findings with a concrete failure mode (input/state → wrong outcome) and file:line; if nothing is found, say so and name what was inspected.

Spell the domains out in full; the reviewer is responsible for all three:

- **Correctness** — behavior that deviates from the acceptance criteria, wrong results, broken edge cases, off-by-ones, mishandled null/empty/boundary inputs, contract violations between caller and callee, error paths that swallow or mask failures, state that goes stale, races and ordering assumptions, and compatibility broken for existing callers or persisted data.
- **Security** — exploitable issues reachable by a real client: injection (SQL, command, template, path), missing or wrong authz on a route or record, secret and token leaks into logs, responses or the repo, unsafe handling of untrusted input, unsafe deserialization, SSRF, weak or absent validation at trust boundaries, and permission expansion. Treat anything a network client can hit directly as reachable regardless of what the UI exposes.
- **Coverage** — failing or flaky tests, and changed behavior in this PR that is testable but untested. Judge by mutation: if the behavior could be broken without a test going red, it is uncovered. Name the specific behavior and where the test belongs, not a coverage percentage.

**Run the leg to the line — exhaustiveness is a hard requirement, not a preference.** One reviewer owns all three domains, so a shallow sweep loses coverage that used to come from three parallel agents. A reviewer that stops at the first few findings hands the next provider a fresh batch, and every extra lap costs a full round of fixes, pushes and bot re-reviews. Worse, it disguises the signal that matters: when lap 3 surfaces something lap 2 could have found, that is indistinguishable from a regression the lap-2 fixes introduced. Put these in the brief verbatim:

- Cover every changed file in every domain before going deep on any one of them, then go deep. Breadth first, so nothing is missed for lack of attention rather than lack of defects.
- Sweep the domains one at a time, start to finish. Finishing correctness on a file is not permission to skip its security or coverage pass.
- Do not stop at a satisfying find. After each one, ask what *else* is wrong — in the same file, in its siblings, and in the code that calls it.
- Check for further instances of every defect found. A bug that appears once usually appears three times; report each site.
- Before concluding, name what was inspected and found sound, per domain, not just what failed. A reviewer that cannot list its coverage has not swept it.
- End only on a genuinely dry pass: one more sweep across all three domains that surfaces nothing new. Say explicitly that the pass was dry.

Length is not the goal and padding the report with speculation is worse than a short one — the bar for reporting a finding is unchanged. What changes is when the reviewer is allowed to stop looking.

## The leg

The next provider in the lineup takes the baton and runs steps 1–7. Then the handoff: the next provider starts from the head this leg produced.

1. **Take the baton.** `gh pr view --json number,title,body,headRefName,baseRefName,url`, `gh pr diff`, acceptance criteria from the PR body / linked issue / plan file, and unresolved review threads (query below). Record the head SHA.
2. **Run this leg's reviewer** against that head with the full brief. One reviewer, three domains, no parallel siblings.
3. **Verify findings yourself.** Read the cited code before acting; dedupe against findings earlier legs already dispositioned. A finding survives only with a concrete failure mode — see "What counts as real". A single verified finding is enough; a repeat of something an earlier provider raised and you rejected needs new evidence, not a second vote.
4. **Fix real findings.** See "Fixing" for the required sequence: baseline, reproduce, fix at the right level, prove with a red→green test, re-verify against the baseline. Same standard for findings from external threads.
5. **Commit and push through the `git-commit-and-push` skill** — every leg, no hand-rolled `git commit`. Skip only its step 2 (`gh issue list` and `Fixes #N` refs): the PR already carries the issue link, and a review fix closes nothing. Everything else applies as written — one commit per concern, conventional subject, flavourful body, `Co-Authored-By` trailer, push at the end. Each commit is verified against the baseline before it leaves the machine. Then **re-trigger supported review bots already in the PR conversation** — and only if something was pushed. The allowlist is:
   - `chatgpt-codex-connector` → `gh pr comment <n> --body '@codex review'`
   - `coderabbitai` → `gh pr comment <n> --body '@coderabbitai review'`
6. **Resolve discussions**, now that the fixes have SHAs. For each unresolved thread: fixed → reply with the commit SHA and rationale; false positive or already handled → reply with the evidence (exact code path). Then resolve the thread.
7. **Wait for required CI and the re-triggered bot reviews**, then hand the baton to the next provider in the lineup. A PR bot review counts only when its reviewed commit OID equals the current baton. Reviews racing in on an older head are recorded as stale, and the bot is re-triggered after the next push rather than credited to the new head.

A leg that produces no fixes still hands off; skip the push and bot re-trigger, since nothing changed.

## What counts as real

Loop-worthy: evidence-backed problems that can plausibly cause wrong results, crashes, security exposure, data loss or corruption, broken compatibility, acceptance-criteria violations, or an unreliable required CI gate.

Stop rather than churn on:

- Naming/style preferences and test-helper polish.
- States unreachable in practice: the code tolerates them, but no caller or route can produce them and no planned work will introduce one. Fixing those is speculation, not correctness. Carve-out: anything a network client can hit directly is reachable regardless of what the frontend exposes — CORS and UI validation gate browsers, not curl — so unreachability never waives checks at a real trust boundary.
- Edge-case exhaustion in tests, and extra tests for behavior already covered at the right boundary. Tests exist to prove the code works; piling on cases to make the suite look thorough is testing the tests.
- Hypothetical fault chains with no credible runtime path, and coverage of states already excluded by types.

Impact and plausibility decide — not whether a reviewer can imagine a scenario. Give extra scrutiny to high-impact boundaries (auth, persistence, destructive operations, concurrency) even when failure odds are low.

## Fixing

Step 4 in detail. This loop writes code into a PR whose shape someone already agreed to, and it grades its own work on the next pass — so a fix that trades a reported bug for an unreported one reads as progress. The sequence below exists to make that trade visible while it is still cheap to undo.

**Baseline before the first fix of a leg.** Run the project's checks — test suite, typecheck, build, lint gate — and record what passes and what is already failing. Without this, "checks pass" after a fix is uninterpretable: you cannot separate a failure you caused from one that was red when you arrived. Pre-existing failures stay pre-existing and get reported, not folded into an unrelated fix.

**Reproduce before fixing.** Every finding gets a failing test or a concretely traced execution path first. A finding you cannot reproduce is not verified — return it to step 3 rather than fixing on faith.

**Fix at the right level.** Prefer making the bug class unrepresentable (types, ownership, API shape) over spot-patches, and check for sibling instances of the same bug. If the right-level fix turns out to need restructuring beyond what this PR is for, stop: report it as a blocker, apply the spot-patch as an explicit interim, and say which it is. Do not silently grow the PR.

**Red then green.** The test proving the fix must fail before the fix and pass after. A test written afterward that never went red proves nothing, and it will keep passing when the bug returns.

**Blast-radius pass on the fix itself, before moving to the next finding:**

- Trace what the change touches — callers, callees, shared state ownership, persistence, permissions, concurrency, external contracts.
- Name what becomes newly possible: stale state, broken compatibility, privilege expansion, data loss, races, a second path that bypasses the new guard.
- Put safeguards inside the fix rather than stacking guards at call sites.
- Cover credible induced failures with tests. Not every theoretical one.

**Re-run the baseline. Any check that went pass → fail is your regression.** Revert the fix and redesign it — a regression is not a new finding to schedule, it is evidence the fix was wrong. Do not adjust the check to accommodate the new behavior. The one exception is a test that was asserting the buggy behavior itself; that requires saying so explicitly in the commit message and the thread reply, with the reason the old assertion was wrong.

**Fixes are findings too.** From leg 2 onward, before treating a finding as an original defect, check whether it lands in code an earlier leg of this relay touched. If it does, the earlier fix is the defect — revisit its design instead of patching its output. Otherwise the loop will happily converge on a tower of corrections to its own mistakes.

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

- A full lap is clean: every provider in the lineup has reviewed a head no later leg changed, and none of them found anything real. A provider that reviewed an older head never got the current baton — it runs again.
- No actionable unresolved discussion threads remain.
- Required CI passes, or a failure is proven unrelated and reported as such.
- Every re-triggered supported bot reviewed the latest head and raised nothing real.
- The project's checks pass locally, with nothing regressed from the baseline recorded at the start of the last leg.
- The worktree and the pushed PR head agree.
- The acceptance criteria still hold against the full cumulative diff, not just the last leg's changes.
- Any behavior that depends on a real sandbox, browser, credential, deployment, or third-party integration has either been smoke-tested in that environment or remains an explicit manual handoff. More static review legs do not substitute for this evidence.

### Converged: the leg went test-only

The condition above can be deferred forever. The coverage domain hunts testable-but-untested behavior under a standing mutation bar, so a reviewer can always find one more unpinned conjunct — and every constraint a fix adds is new surface for the next provider to report. Left alone, the loop converges on hardening its own hardening.

**When a leg's surviving findings are entirely test-hardening, and the constraints they pin were introduced by an earlier leg of this relay, that is convergence.** Harden them in a single commit, push, and stop looping. Do not hand that commit to the next provider.

Judge the mix, not the count. The leg is test-only when no finding in it describes code that computes a wrong answer, crashes, exposes data, or violates the acceptance criteria — only code whose correctness no test would notice regressing. One genuine defect anywhere in the leg means the relay continues normally.

This never suppresses a finding. Everything real still gets fixed in that final commit; what ends is the *looping*, not the work. Say in the final report that the loop stopped on test-only convergence, and name the constraints hardened in the last pass so the reader can see what the reviewers were reduced to.

## Final report

Report: final head SHA, host and the evidence that classified it, lineup used, the legs and failed attempts actually run in order, fixes made, any regression the loop caused and reverted, pre-existing failures left in place, CI and latest-head bot-review status, and remaining thread count. Close with a human-verification handoff: the manual checks automation could not prove (real integrations, UI flows, credentials, deploy behavior), each with exact steps, expected result, and failure signals — or state explicitly that no manual verification is needed.
