# Fix Verified Review Findings

Another provider reviewed this branch and raised the findings below. The engineer running the relay verified each one against the code before sending it to you. You are a different provider from the one that found them, and that is the point: you owe these findings an independent reproduction, not deference.

- Repo head: `{{HEAD_SHA}}`
- Diff target: `{{DIFF_TARGET}}`

## Baseline

These checks were run before any fix. Anything already failing here is pre-existing and stays that way — do not fold it into your change.

{{BASELINE}}

## Findings to fix

{{FINDINGS}}

## Reproduce before fixing

Every finding gets a failing test or a concretely traced execution path **first**. Reproduce it yourself, from the code, before you change anything.

**A finding you cannot reproduce is a finding you report back, not one you fix on faith.** Say so explicitly, name the code path that prevents the failure, and move to the next one. That verdict is worth more than a speculative fix: the relay's dominant failure mode is a vividly-described defect that nothing actually triggers, and you are the gate that catches what verification missed. Leave that code untouched.

## Fix at the right level

Prefer making the bug class unrepresentable — types, ownership, API shape — over spot-patches, and check for sibling instances of the same bug elsewhere in the diff. If the right-level fix needs restructuring beyond what this PR is for, stop: report it as a blocker, apply the spot-patch as an explicit interim, and say which one you applied. Do not silently grow the PR.

Where a finding came with a suggested fix, treat it as one proposal among others. You are reading the code now and the reviewer is not. Implement what the code calls for, and say plainly where you diverged and why — a disagreement between the provider that found a defect and the provider that fixed it is information the relay wants, not a conflict to smooth over.

## Prove the fix; do not grow coverage by default

Re-run the original reproduction and the existing relevant checks after the change. Do not add a test merely because a review found a bug. Add or update one only when it protects stable, externally observable behavior at an appropriate boundary and is likely to outlive this PR; when a test is justified, show it failing before the fix and passing after. For changing internals, or behavior a later PR will replace, the concrete execution trace plus the existing checks are the proof.

## Blast-radius pass, before moving to the next finding

- Trace what the change touches — callers, callees, shared state ownership, persistence, permissions, concurrency, external contracts.
- Name what becomes newly possible: stale state, broken compatibility, privilege expansion, data loss, races, a second path that bypasses the new guard.
- Put safeguards inside the fix rather than stacking guards at call sites.
- Prove credible induced failures the same way; new tests are not the default.

## Scope

Fix these findings and nothing else. Unrelated defects you notice along the way go in your report as observations — leave that code alone. Do not commit, push, comment on the PR, or resolve review threads; the relay engineer owns all of those.

## Report

For each finding, in order:

- **Reproduced** — how, concretely, and what the failing state was.
- **Fixed** — what you changed and at what level, or **Not reproduced** with the code path that prevents it, or **Blocked** with what the real fix would require.
- **Divergence** — where you departed from a suggested fix, and why.
- **Blast radius** — what the change touches and what became newly possible.
- **Verification** — the reproduction re-run, plus which existing checks you ran and their results.

End with any check that went from passing to failing. That is a regression you caused, and naming it is worth more than a clean-looking report.
