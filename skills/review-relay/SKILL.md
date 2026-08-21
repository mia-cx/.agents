---
name: review-relay
description: >-
  Use when the user asks for a review relay or review loop, for repeated or
  multi-provider review passes on a pull request, for a PR to be reviewed until
  it is clean or merge-ready, or to address review comments and resolve review
  discussions on a PR. A request for one review pass over a diff is not a relay.
---

# Review relay

Drive the PR for the current branch to merge-readiness as a relay race: each provider runs a read-only review leg, then you verify and fix what is real before handing the new head to the next reviewer. The race ends when a full lap comes back clean. Do not merge; that is a separate, explicit request.

**The baton is the head SHA.** Every handoff passes a head that already absorbed the previous leg's findings; a provider reviewing a stale head is a dropped baton, and its leg does not count.

## Scope: the diff, and only the diff

**Every finding must be caused by this diff**: a defect these changes introduce, or a latent one they newly expose. Anchor each finding to a line the diff touched, even when the damage lands elsewhere.

Read as widely as you need to: callers, callees, tests, config, persisted formats, anything that tells you what the change breaks. That reading is how blast radius gets judged, and it is encouraged. What it is not is a review target. A bug that predates this branch and that the diff does not touch or worsen is out of scope, however real. Someone else's PR owns it.

The distinction in practice: the diff changes a function's return shape and an unchanged caller mishandles it. In scope: cite the changed line and name the caller as the consequence. That same caller was already mishandling a case the diff never touches. Out of scope: leave it.

Reviewing beyond the diff is the most common way one leg turns into an unbounded audit. Stay inside it. The pressure to leave it comes from the reviewer, and it is persuasive by construction: an out-of-scope finding arrives fully argued with a real defect attached, so agreeing feels like diligence rather than drift. Scope is yours to hold and never the reviewer's to widen; decide it here, before the first report lands.

## The lineup

One reviewer per leg, from one provider, covering all three domains at once. Fix before every handoff; a fresh pair of eyes on fresh code is the point.

With Cursor omitted, the normal relay alternates Codex and Claude indefinitely. The host-aware first leg below only decides which of those two starts. A user may override the lineup for one run; record that as runtime state and never persist it into this skill's defaults.

Set the lineup from the host (the agent that invoked this skill), classified once at loop start:

| Host | Lineup (laps) | Classified by |
| --- | --- | --- |
| Claude Code | codex → claude → cursor | default when nothing below matches |
| Codex | claude → codex → cursor | `REVIEW_LOOP_RUNNER=codex`, `CODEX_THREAD_ID`, or `CODEX_CI` |
| Cursor | codex → claude → cursor | `REVIEW_LOOP_RUNNER=cursor` or `CURSOR_AGENT` |

The host never runs the first leg: the first opinion on the diff comes from outside the agent that wrote it. Workflow wrappers that do not preserve their host's environment set `REVIEW_LOOP_RUNNER` before invoking this skill. **Cursor is opt-in**: drop it from the lineup unless the user asked for cursor reviews, leaving the alternating two-provider lap. Record the host, its evidence, and the resulting lineup in the final report.

### Reviewers review; the host fixes

Every reviewer stays read-only. After a leg, you independently verify each claim against the code, reproduce every surviving finding, and implement the fixes inline in the current worktree. Do not spawn or shell out to a fixer agent: you already hold the acceptance criteria, relay history, and blast-radius context needed to make the change coherently.

The next reviewer grades the resulting head. This keeps provider diversity where it adds value—independent review—without handing implementation to an agent that lacks the relay's full context.

## Picking each leg's model

Every leg runs at high reasoning effort on the top-intelligence model **within its own provider**; the relay's value is provider diversity, so a leg never switches provider to chase a score. That is **opus-5 for the claude leg and gpt-5.6-sol for the codex leg**. Fable-5 stays out despite topping the rubric: it drains usage limits about twice as fast, so it is explicit-request only.

Intelligence outranks everything here, because a leg run cheap costs a whole lap to discover, and cost never breaks a tie; reviewing is where the budget goes. Taste breaks ties only on a UI-heavy diff, where the defect is a bad interaction or a wrong-feeling layout that a high-intelligence, low-taste reviewer scores as working code.

Higher is better in every column, cost included: the cost score is per task actually run, so a model that burns usage limits fast scores low no matter what its per-token price says. The table is carried here rather than referenced, because it lives in `~/.agents/CLAUDE.md` and a codex or cursor host reads `AGENTS.md` instead; keep the two in sync when either changes.

| model         | cost | intelligence | taste |
| ------------- | ---- | ------------ | ----- |
| opus-5        | 6    | 9            | 9     |
| fable-5       | 2    | 9.7          | 9     |
| gpt-5.6-sol   | 9    | 9.4          | 4     |
| opus-4.8      | 4.5  | 8            | 8     |
| gpt-5.6-terra | 9.5  | 7.5          | 4     |
| gpt-5.5       | 8.5  | 7            | 4     |
| sonnet-5      | 5.5  | 6.5          | 7     |
| gpt-5.6-luna  | 10   | 5.5          | 3     |
| sonnet-4.6    | 6.5  | 3.5          | 7.5   |

Selection mechanics:

- **claude**: `model: 'opus'` for the Agent tool or Workflow `agent()`; that parameter is unversioned and takes only `opus`/`sonnet`/`fable`/`haiku`. The `claude --model` CLI flag also accepts a full versioned id, which is the only way to pin an older release like opus-4.8.
- **codex**: the top-intelligence GPT model selected by the local Codex configuration; see the runtime contract below for how the leg is launched.
- **cursor**: `--model auto`, always. This leg is billing-constrained, not rubric-selected; see below.

No GPT model scores above 4 on taste, so a UI-heavy relay gets its taste coverage from the claude leg; say so in the report rather than swapping the codex leg to a Claude model.

### Codex runtime contract

Codex gets the same rendered prompt as every other leg, at full length: no line limit, nothing summarized away. `--read-only-preamble` prepends the one line that keeps it read-only despite the sandbox flag it needs.

Treat repository decisions and recon as authoritative. Browse or re-scrape a live integration only for a concrete unresolved contradiction, because unconstrained recon can turn one leg into a duplicate investigation.

Codex produces the report at the end of its interactive turn. Keep the terminal session attached and wait for the completion event; do not poll on a timer. A turn that ends without a final report is a failed attempt: record it, fix the invocation, and rerun the same lineup slot. It never counts as a leg.

## Runtime state and resume

Create a stable artifact directory for the PR under the system temp directory and keep `state.md` there. Before the first leg, or when resuming a handoff, record and verify:

- PR number, base/head branches, baton SHA, host evidence, lineup, and next leg.
- The environment's posture (cooperative or adversarial, per the trigger test), written once and reused as `{{ENVIRONMENT}}` by every leg, so it is decided rather than re-litigated per reviewer.
- Acceptance-criteria sources and the open PR stack (`gh pr list --json number,headRefName,baseRefName,headRefOid`). Compare descendant diffs when deciding whether a finding is live, already fixed downstream, or superseded; a base defect that descendants inherit is still live.
- Baseline commands/results, required CI, bot opt-ins, supported bots present, unresolved thread IDs, and which enabled bot reviews target the baton SHA.
- Every attempted leg: provider, reviewed SHA, report/trace paths, outcome, and whether it counts.
- A finding ledger: stable ID, failure mode, disposition, evidence, finding provider, fixing SHA, affected files, GitHub thread/comment IDs, and induced regression if any.

On resume, compare the PR head with the recorded baton before doing work. Reuse valid completed legs and dispositions; rerun only stale, interrupted, failed, or empty-report attempts. Feed reviewers a compact resolved-finding ledger so a repeated rejection needs new evidence rather than another vote.

## Launching a leg

**Spawn the host's own provider through the host's native subagent mechanism; reach every other provider through that provider's CLI.** Native spawning keeps the leg inside the host's session (its own model selection, streaming, and cancellation), while a CLI shell-out is the only transport that crosses providers. So the claude leg is a subagent under Claude Code and a `claude -p` shell-out under Codex; the codex leg inverts that.

| Leg | From a Claude Code host | From a Codex host | From a Cursor host |
| --- | --- | --- | --- |
| claude | Agent tool, or Workflow `agent()` | `claude` CLI | `claude` CLI |
| codex | interactive `codex` in a PTY | native codex subagent, else the same PTY call | interactive `codex` in a PTY |
| cursor | `agent` CLI | `agent` CLI | `agent` CLI |

**Render before launching.** The template in `references/` is not sendable as-is: every `{{FIELD}}` must be substituted first. The script below does it: one fresh file per leg, substituting literally so prose full of `/`, `&`, and newlines survives, failing loudly on a field it cannot fill rather than sending the reviewer at a head it has to guess. Rendering by hand instead is where paraphrase creeps into a prompt that has to go whole. Its path is absolute because a leg runs with the target repo as cwd, not this skill's directory.

```bash
PROMPT="$(mktemp "${TMPDIR:-/tmp}/relay-prompt-<leg>.XXXXXX.md")"
REPORT="$(mktemp "${TMPDIR:-/tmp}/relay-<provider>-<leg>.XXXXXX.md")"

~/.claude/skills/review-relay/scripts/render-prompt.py reviewer-prompt.md \
  --field PR_URL="$PR_URL" --field HEAD_SHA="$HEAD" \
  --field DIFF_TARGET="git diff $BASE...$HEAD" \
  --field ENVIRONMENT='Cooperative: <what surrounds this code>' \
  --field ACCEPTANCE_CRITERIA=@/path/to/criteria.md \
  --field PRIOR_LEGS=@"$RELAY_LOG" \
  -o "$PROMPT"                       # --read-only-preamble for the codex leg
```

Pass the rendered file rather than an inline string; the prompt is long and full of markdown and backticks that a shell argument mangles. The native subagent path takes the same rendered text as its prompt.

```bash
# claude leg, from a non-Claude host
claude -p --model opus --permission-mode plan < "$PROMPT" > "$REPORT"

# codex leg: interactive, per the Codex runtime contract above
codex -s danger-full-access --no-alt-screen "$(<"$PROMPT")"

# cursor leg, from any host
agent -p --model auto --mode plan "$(cat "$PROMPT")" > "$REPORT"
```

The codex leg is the exception to redirecting into `$REPORT`: it runs interactively, so its report is the final response captured off the attached session, not stdout.

CLI reviewers routinely outrun a 10-minute Bash timeout; pass an explicit longer timeout, or run in the background and poll for the report file.

**Re-running the same provider** (after a stale-head review, or a second pass once this leg's fixes landed) resumes that reviewer's session rather than paying for the full prompt again, and the follow-up carries only what changed. That path has its own ordering, and getting it wrong costs a lap: [`references/resuming-a-reviewer.md`](references/resuming-a-reviewer.md). A cross-provider handoff is never a resume; a fresh process gets the whole rendered file.

Keep reviewers read-only: `--permission-mode plan` for claude, `--mode plan` for cursor. A reviewer that can write starts fixing what it finds, which strands edits outside the fix sequence in "Fixing". The codex leg is the weak point: it runs `-s danger-full-access` per its runtime contract, so nothing but the `--read-only-preamble` line stops it editing. Check `git status` after that leg.

Cursor specifics:

**Always `--model auto`.** `auto` is the only permitted value of this flag. Auto-routed requests are the included Cursor plan usage; every other model id (`gpt-5.6-sol-high`, `claude-opus-5-thinking-high`, `composer-2.5`, anything from `agent --list-models`) bills the API pool per token. Requests to run the cursor reviewer on a specific model get the same answer: run `auto`, or drop cursor from the lineup, and say which. Cost, not capability, decides this leg's model; the rubric governs the claude and codex legs only.

This path is the local `agent` CLI only. Cursor's PR-side bots are a different mechanism and never a substitute: leave `@cursor review`, `@bugbot run`, and every other PR comment trigger out of it. Bots already in the PR conversation are handled by the bot-allowlist step, which does not include Cursor.

## Reviewer prompt

[`references/reviewer-prompt.md`](references/reviewer-prompt.md) is the complete reviewer prompt. Once rendered, it goes to the reviewer whole, never summarized or paraphrased, and nothing from this skill gets appended to it. Every leg renders its own copy, because the head, the diff target, and the log all move between legs.

| Field | Filled with |
| --- | --- |
| `{{PR_URL}}` | `url` from step 1's `gh pr view` |
| `{{HEAD_SHA}}` | the head SHA recorded in step 1 |
| `{{DIFF_TARGET}}` | the command that reproduces the diff under review, e.g. `git diff <baseRefName>...<HEAD_SHA>` |
| `{{ACCEPTANCE_CRITERIA}}` | criteria verbatim from the PR body, linked issue, or plan file, or "None stated" |
| `{{ENVIRONMENT}}` | the posture decided by the trigger test, plus one line on what surrounds this code, e.g. "Cooperative: a Tampermonkey userscript sharing a document with wplace. wplace does not know this code exists." |
| `{{PRIOR_LEGS}}` | `--prior-legs @"$RELAY_LOG"`, which inlines the log's full content and never its path, or "You are the first leg; nothing has been reviewed yet." on leg 1. Resumed sessions get only the delta, per [`references/resuming-a-reviewer.md`](references/resuming-a-reviewer.md) |

## The relay log

The baton carries a head SHA and a log. `$RELAY_LOG` is one append-only markdown file created at relay start (`mktemp "${TMPDIR:-/tmp}/relay-log.XXXXXX.md"`), holding every finding any leg has raised and what became of it. It exists so the relay stops re-litigating settled ground: without it, leg 3 spends its budget rediscovering what leg 1 already fixed, and there is nothing to dedupe against in step 3.

**You, the host, author and maintain it. Reviewers never touch it.** They are launched read-only and their reports are raw input to step 3, where you read the cited code and decide. What the log records is your verdict after that check, not the reviewer's claim: a finding is Rejected because *you* traced why it cannot happen, and the entry carries the evidence you found. A reviewer's own confidence never lands in this file. Attribute each finding to the leg that surfaced it, so a provider that keeps raising noise is visible.

Append one entry per finding, at the moment you disposition it:

```markdown
## Leg 2: codex @ 4f1c2ab
- **[F7] `src/auth/session.ts:88`**: expired refresh token accepted on the retry path.
  **Fixed** by claude in `9d3e0f1`: the retry now revalidates expiry; replaying the expired-token path rejects it.
  Diverged from the suggested guard at the call site: the check belongs in the token accessor, since two other callers reach the same path.
- **[F8] `src/ui/Toast.tsx:40`**: toast timeout not cleared on unmount.
  **Rejected**: the component unmounts only with the portal, which clears the timer at `Portal.tsx:61`. No leak path.
- **[F9] `src/db/migrate.ts:12`**: non-transactional migration.
  **Deferred**: real, but the fix restructures migration ownership beyond this PR. Reported as a blocker.
- **[F10] `src/queue/retry.ts:31`**: duplicate job when the worker restarts mid-flush.
  **Rejected**: the host reproduced a restart and traced the lease through the ack at `lease.ts:44`; the flush replays nothing.
```

Every finding gets exactly one of **Fixed** (with the fixing SHA and the verification that proves it), **Rejected** (with the evidence that killed it: a traced code path, not an opinion), or **Deferred** (with the reason it outgrew this PR). A finding with no disposition means the leg is not finished.

The log is the source the final report is written from, so write entries for a reader who was not there.

**Reviewers receive log content as prompt text; `$RELAY_LOG` itself stays with you.** Never hand a reviewer the path. The file is live: you append to it during the very leg the reviewer is running, so a reviewer that opens it reads whichever half-written state it happened to catch, and two legs given "the log" are no longer comparable. It also sits outside the repo, where a sandboxed reviewer may fail to open it at all and silently review without it. Rendering the log into the prompt at launch freezes the snapshot that leg saw, which is what makes the leg reproducible.

Number findings `[F1]`, `[F2]`, … across the whole relay, and head each section with the leg number and provider. That numbering is what lets you hand a provider only what it has not seen.

### Publishing findings to the PR

`$RELAY_LOG` stays local relay state. Do not publish it, summarize it into a conversation comment, or maintain a cumulative relay comment on the PR.

After step 3 verifies a real finding and step 4 reproduces it, publish it through the **`gh-comment` skill** as its own inline diff thread against the reviewed head SHA, immediately before changing the code. The body contains only the attribution header, stable finding ID, severity, concrete failure mode, and the shortest useful reproduction or evidence. A reviewer claim that gets Rejected is not a finding and stays in `$RELAY_LOG`; clean-leg notes, provider transcripts, and relay progress stay there too.

Anchor the thread to the exact affected diff line. When that line is not commentable, anchor it to the nearest causative changed line and name the exact affected location in the body; do not fall back to a normal PR conversation comment. Record the returned comment/thread ID in runtime state and `$RELAY_LOG` before continuing, so a retry updates or replies to the existing thread instead of duplicating it.

After the fix is pushed, reply in that finding's thread with the fixing SHA, rationale, and verification, then resolve it. Leave a Deferred finding unresolved as a visible blocker. If later evidence overturns an already-published finding, reply with the concrete rejection evidence and resolve it rather than deleting history.

**Visual evidence is rare; text is the finding.** A relay can go start to finish, every leg, without a single image, and that is the normal outcome. Reach for one only when a defect cannot be stated in words: a layout that breaks at a specific viewport, a wrong-looking render, an animation that never settles. When one of those does come up and a desktop environment is available (a Chromium debug port, or computer use via the `codex-computer-use` skill), reproduce it there, capture the screenshot or recording, host it with the `upload-file` skill, and embed the returned URL through `gh-comment`. Put the same URL in the log entry so later legs can see what you saw. A screenshot of a stack trace or a diff is not visual evidence; paste the text.

`gh` is authenticated as the user, so every thread and reply uses the attribution header required by `gh-comment`. Leave out `$RELAY_LOG`'s path and anything else local to the session.

**Your rejections invite challenge; they do not suppress.** Every Rejected entry is a call you made, and you are the one participant in the relay who has been staring at this diff since leg 1: the least fresh pair of eyes in the race. A later reviewer that disagrees is doing its job, and the relay's whole value is the leg that sees what the previous pass dismissed. What the log forbids is the *unargued* repeat: re-raising `[F8]` with no new evidence is noise, re-raising it with a second unmount path is a finding, and it is your own rejection that was wrong. Hand a reviewer a list framed as settled and it will agree with you; that is the failure mode this section is written against.

## The leg

The next provider in the lineup takes the baton and runs steps 1–7. Then the handoff: the next provider starts from the head this leg produced, plus the log it wrote.

1. **Take the baton.** `gh pr view --json number,title,body,headRefName,baseRefName,url`, `gh pr diff`, acceptance criteria from the PR body / linked issue / plan file, and unresolved review threads (query below). Record the head SHA.
2. **Run this leg's reviewer** against that head with the rendered reviewer prompt. One reviewer, three domains, no parallel siblings.
3. **Verify findings yourself.** Read the cited code before acting; dedupe against `$RELAY_LOG`. A finding survives only with a concrete failure mode; see "What counts as real". Missing coverage without a corresponding functional defect is advisory and the leg is clean. A single verified real finding is enough. A repeat of something an earlier leg rejected needs new evidence, not a second vote, but weigh the new evidence on the code, not on the fact that it was already rejected once. Record the trigger line in `$RELAY_LOG` for every finding you carry into step 4. A finding you cannot write one for does not reach step 4. If you find yourself writing the pointer as a paraphrase of the reviewer's claim rather than as somewhere you looked, that is the tell.
4. **Publish, fix, and verify.** See "Fixing" for the required sequence: baseline, reproduce each surviving finding, publish it as one inline thread, implement the fix yourself, re-run the baseline, and read the diff. Publish before the code changes; rejected claims remain local. Apply the same standard to findings from external threads, except they already have threads.
5. **Commit and push through the `git-commit-and-push` skill**: every leg, no hand-rolled `git commit`. Skip only its step 2 (`gh issue list` and `Fixes #N` refs): the PR already carries the issue link, and a review fix closes nothing. Everything else applies as written: one commit per concern, conventional subject, flavourful body, `Co-Authored-By` trailer, push at the end. Each commit is verified against the baseline before it leaves the machine. Then re-trigger only enabled review bots, and only if something was pushed:
   - **GitHub Codex bot is opt-in.** Never post `@codex review` merely because `chatgpt-codex-connector` appears in the PR conversation. Enable it only when the user explicitly asks for the GitHub Codex bot during this relay run; record that opt-in in runtime state. When enabled: `gh pr comment <n> --body '@codex review'`.
   - `coderabbitai` remains presence-based: when it already appears in the PR conversation, run `gh pr comment <n> --body '@coderabbitai review'`.

   The local Codex reviewer in the relay lineup is independent of the GitHub Codex bot. Keeping the bot disabled does not remove or replace local Codex legs.
6. **Resolve discussions**, now that the fixes have SHAs. For each unresolved external or relay-created thread: fixed → reply with the commit SHA, rationale, and verification; false positive or already handled → reply with the evidence (exact code path). Then resolve the thread. Leave Deferred blockers unresolved. Do not publish the relay log or a leg summary to the PR.
7. **Wait for required CI and only the bot reviews triggered in step 5**, then hand the baton to the next provider in the lineup: the new head SHA and `$RELAY_LOG` with this leg's section appended. A disabled bot is neither triggered nor a merge-readiness gate. An enabled PR bot review counts only when its reviewed commit OID equals the current baton. Reviews racing in on an older head are recorded as stale, and the bot is re-triggered after the next push rather than credited to the new head.

A leg that produces no fixes still hands off; skip the push and bot re-trigger, since nothing changed. It still writes its log section: "reviewed `<sha>`, nothing real, here is what was inspected" is the entry that proves the lap is going clean rather than going unrecorded.

## What counts as real

Loop-worthy: evidence-backed problems **this diff causes** (introduced by the change, or latent and newly exposed by it) that can plausibly cause wrong results, crashes, security exposure, data loss or corruption, broken compatibility, acceptance-criteria violations, or an unreliable required CI gate.

Scope is the diff, per the rule at the top of this skill. Reviewers read whatever they need for context and blast radius, but a defect the branch neither touches nor worsens belongs to another PR: log it as advisory and leave the code alone. Fixing it here grows the diff every later leg has to review, and buries the change the PR was actually opened for.

Missing or incomplete test coverage is not a real finding by itself. Report coverage observations separately, classify a coverage-only leg as clean, and do not fix or push them unless the user separately asks. If review of a gap exposes an actual wrong runtime outcome, report the runtime defect as the finding and the missing test only as supporting evidence.

Stop rather than churn on:

- Naming/style preferences and test-helper polish.
- States nothing produces. See the trigger test below; it is the one check a reviewer cannot argue you out of.
- Edge-case exhaustion in tests, and extra tests for behavior already covered at the right boundary. Tests exist to prove the code works; piling on cases to make the suite look thorough is testing the tests.
- Hypothetical fault chains with no credible runtime path, and states already excluded by types.

Impact and plausibility decide, not whether a reviewer can imagine a scenario. Give extra scrutiny to high-impact boundaries (auth, persistence, destructive operations, concurrency) even when failure odds are low.

### The trigger test

Apply it **before** you read the failure mode, not after.

A reviewer's job is to describe a failure vividly, and a good one always will. Vividness is not evidence, and a concrete consequence says nothing about whether anything causes it. So before a finding survives step 3, write one line:

> **`<actor>` does `<action>`, and here is where that happens: `<pointer>`.**

The last clause is the entire test. It has to point at something that exists: a line in this repo, a line in a dependency, a documented platform or browser behaviour, a filed issue, a report from a user. "A host could", "an attacker might", "a caller may one day", "nothing stops the page from": these fill in nothing. They are the reviewer imagining an actor, and **a finding whose actor is imaginary is Rejected however concrete its consequence.** Write the rejection with the clause you could not fill, so the reviewer learns which half was missing.

Name the environment's posture once per relay, in runtime state, because most findings turn on it:

- **Cooperative**: a page you share a document with, a framework you run inside, a CLI that invokes you, a library you call. It will re-render, remove, replace, reorder and race you, all by accident. Guard against that. It will not go looking for your DOM to reparent into an iframe, rewrite your stylesheet's rules through CSSOM, or mint an element under your id to impersonate you. Those need intent the environment does not have, and a defence against them is speculation wearing a threat model's clothes.
- **Adversarial**: untrusted input crossing a boundary you own. Here intent is the premise, and the trigger is satisfied by the boundary itself: anything a network client can reach is reachable whatever the UI exposes, because CORS and form validation gate browsers, not curl.

Most surfaces are cooperative. Deciding this once, in writing, stops it being re-litigated by every reviewer that finds an unguarded door in a house with no burglars.

### Fixes to speculation are not free

They cost a fix, its blast radius, the tests that pin it, and every later leg's attention, and they add surface that the next leg reviews as real code. A relay that fixed three imagined findings in a row produced exactly one genuine defect from them: the second fix's own comparison never matched, and reinstalled a stylesheet on every frame for two legs. That is the normal yield. Speculation does not merely waste a leg; it manufactures the next one's findings.

## Fixing

Step 4 in detail. The loop grades its own work on the next pass, so a fix that trades a reported bug for an unreported one reads as progress; this sequence makes that trade visible while it is still cheap to undo.

You own reproduction, implementation, and proof. Reviewer reports are evidence to investigate, not implementation briefs to delegate.

**Baseline before the first fix of a leg.** Run the project's checks (test suite, typecheck, build, lint gate) and record what passes and what is already failing. Without this, "checks pass" after a fix is uninterpretable: you cannot separate a failure you caused from one that was red when you arrived. Pre-existing failures stay pre-existing and get reported, not folded into an unrelated fix.

**Reproduce before editing.** Trace the actor, trigger, and failing state yourself. If the report does not reproduce, mark it Rejected with the exact path that prevents it. If the fix would grow beyond the PR, mark it Deferred and leave the thread unresolved. Treat a reviewer's suggested fix as a proposal; implement at the ownership boundary that actually prevents the failure and record meaningful divergence in the log and thread reply.

**Fix inline.** Make the smallest coherent change in the current worktree. Check callers, callees, shared state, permissions, persistence, concurrency, and external contracts before moving to the next finding. Add or update a test only when it protects stable externally observable behavior; otherwise preserve the concrete reproduction as proof.

**Re-run the baseline yourself. Any check that went pass → fail is a regression.** Revert and redesign the fix; a regression is not a new finding to schedule, it is evidence the fix was wrong. Do not adjust the check to accommodate the new behavior. The one exception is a test that was asserting the buggy behavior itself; that requires saying so explicitly in the commit message and the thread reply, with the reason the old assertion was wrong.

**Read the diff before committing.** Check that the implementation fixes the reproduced failure and nothing else: compare `git diff` with the pre-fix state, not with the reviewer's suggested patch.

**Fixes are findings too.** From leg 2 onward, before treating a finding as an original defect, check whether it lands in code an earlier leg of this relay touched. If it does, the earlier fix is the defect; revisit its design instead of patching its output. Otherwise the loop will happily converge on a tower of corrections to its own mistakes.

## Discussion thread mechanics

```bash
# List threads; act on isResolved: false, isOutdated: false
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

- A full lap is clean: every provider in the lineup has reviewed a head no later leg changed, and none of them found anything real. A provider that reviewed an older head never got the current baton; it runs again. A leg whose only output was coverage observations counts as clean and hands off the unchanged baton; coverage never keeps the relay alive by itself.
- No actionable unresolved discussion threads remain.
- Required CI passes, or a failure is proven unrelated and reported as such.
- Every re-triggered supported bot reviewed the latest head and raised nothing real.
- The project's checks pass locally, with nothing regressed from the baseline recorded at the start of the last leg.
- The worktree and the pushed PR head agree.
- The acceptance criteria still hold against the full cumulative diff, not just the last leg's changes.
- Any behavior that depends on a real sandbox, browser, credential, deployment, or third-party integration has either been smoke-tested in that environment or remains an explicit manual handoff. More static review legs do not substitute for this evidence.

## Final report

When every stop condition is satisfied and the PR appears mergeable, stop and hand control to the user. Do not merge, approve, or otherwise advance the stack. Write the overview from `$RELAY_LOG`, which already holds the per-leg detail:

- The final head SHA, PR/base branches, host and the evidence that classified it, lineup, and every leg and failed attempt in order.
- Every reported finding, grouped by disposition: real and fixed; rejected with concrete evidence; deferred upstream; already fixed or superseded; and advisory coverage observations. Preserve stable finding IDs and severity where available. Surface the **Rejected** and **Deferred** groups explicitly: they are decisions the relay made on the user's behalf without changing any code, so they are the entries most likely to be wrong and least likely to be noticed.
- For every real finding: the concrete failure mode, inline thread, which provider found it, the host's fix, fixing commit SHA, affected files, and regression proof.
- Any regression introduced during the relay and how it was corrected or reverted, plus pre-existing failures left in place.
- The complete verification result: local checks, required CI, unresolved-thread count, bot opt-ins and any enabled bot result against the final SHA.
- Remaining risks and exact manual checks for anything automation could not prove (real integrations, UI flows, credentials, deploy behavior), including expected results and failure signals; explicitly say when none remain.

End by asking the user to review and either merge or provide corrections. This overview is a mandatory user gate, not merely a progress update, even when every reviewer and check is clean.
