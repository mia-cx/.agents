# Resuming a reviewer

Re-running the same provider — after a stale-head review, or a second pass once this leg's fixes landed — resumes that reviewer's session instead of paying for the full prompt again: send the follow-up as the next turn in the still-attached codex session, or `claude --continue`. A resumed reviewer still holds the contract it was given, so the follow-up carries only what changed.

Send the short form **only** into a session that already received the full prompt. A new leg is a new process with no memory — the rendered prompt is what makes it exhaustive, read-only, and comparable to its predecessors, so a cross-provider handoff always gets the whole file. A bare "review again" to a fresh reviewer buys a shallow skim.

Write the follow-up in this order — it answers "what happened to my work?" before asking for more:

1. **Verdicts on that reviewer's own findings**, every one it raised last leg, in the order it raised them. Each gets its disposition, the reasoning behind it, and — where it was fixed — one sentence on how. This is the only feedback a reviewer ever gets about its own accuracy; a provider whose speculative findings keep coming back Rejected with a traced code path calibrates within a lap.
2. **Then the other legs' findings and verdicts**, same breakdown, introduced as what the other reviewers turned up while it was idle. Attribute them by provider — it tells the reviewer which ground a different pair of eyes already covered, and which of its own misses were caught elsewhere.
3. **Then the baton**: the new head SHA and diff target, said as a handoff — the branch has moved, this is the head to review now.
4. **Then the ask**: run another leg against the same contract.

```text
Verdicts on your three findings from the last leg:
- [F4] session.ts:88 expired token on retry — FIXED in 9d3e0f1. The retry path now
  revalidates expiry before reuse; replaying the expired-token path now rejects it.
- [F5] Toast.tsx:40 timeout not cleared — REJECTED. The component unmounts only with
  its portal, which clears the timer at Portal.tsx:61, so no leak path exists.
- [F6] migrate.ts:12 non-transactional migration — DEFERRED upstream. Real, but the fix
  restructures migration ownership beyond this PR; filed as a blocker.

Since then, codex reviewed the same branch and found:
- [F7] queue.ts:22 duplicate job on retry — FIXED in 1a2b3c4. Jobs are now keyed by
  idempotency token.

You have the baton again: the head is now 7c4d9e2, diff target `git diff main...7c4d9e2`.
Run another leg against the same contract.
```

Track what each provider has been shown by finding number, so step 2 is a slice and not a judgement call. Re-pasting an entry a provider already has is harmless; omitting a new one costs a lap.
