---
name: pr-loop
description: Runs a production-first pull-request review and discussion-resolution loop until no real correctness issues remain, then produces executable human-verification instructions. Use when the user asks for a PR loop, repeated pr-review and pr-resolve-discussions cycles, or wants a PR driven to merge-readiness without exhaustive test-polish churn.
---

# PR Review and Resolution Loop

Drive a pull request toward correctness by repeatedly using `pr-review` and `pr-resolve-discussions`. This skill orchestrates those skills; it does not replace their review, remediation, GitHub-thread, or push workflows.

## Core priority

Treat the actual production codebase as the product. Prioritize, in order:

1. Runtime correctness, security, authorization, data integrity, concurrency, lifecycle ownership, and API contracts
2. Acceptance criteria, migrations, configuration, deployment behavior, and user-visible documentation
3. Tests as evidence that expected behavior works

Tests should be globally trustworthy and exercise expected behavior plus realistic failures. They do not need exhaustive coverage of every theoretical state. Small test-only defects are acceptable when they cannot hide a material production regression, reject correct required behavior, break or flake a required gate, or cause harmful side effects.

Do not spend cycles on speculative test refinements, combinatorial edge cases with no plausible production path, or scenarios requiring a chain of unlikely independent events such as memory bit flips. Give extra scrutiny to realistic high-impact boundaries—security, permissions, persistence, destructive operations, and concurrency—even when their failure rate is low.

## Loop

1. Identify the open PR for the current branch and record its current head.
2. Run `pr-review` against that head. Let it create discussion threads for its valid findings.
3. If the review finds real issues or actionable unresolved discussions exist, run `pr-resolve-discussions`:
   - Validate each finding against the production contract.
   - Fix real bugs and meaningful design defects at the correct architectural boundary.
   - Add or adjust only proportionate tests that prove the expected behavior and the actual regression.
   - Commit, push, reply to and resolve discussions, then trigger separate `@codex review` and `@coderabbit review` comments as required by that skill.
4. Wait for required CI and the newly requested external reviews to finish. Inspect new, unresolved, non-outdated discussions.
5. Repeat from `pr-review` on the new head whenever production code changed or any reviewer identifies another real issue.

Keep looping while useful correctness work remains. Do not declare victory by dismissing credible findings, but do not keep the loop alive by inventing increasingly implausible test concerns.

## What counts as a real issue

Continue the loop for evidence-backed problems that can plausibly cause wrong results, crashes, privilege escalation, security exposure, data loss or corruption, stale state, broken compatibility, required-spec violations, or unreliable required gates.

Usually stop rather than churn on:

- Naming, formatting, or subjective style without contract impact
- Additional test cases for behavior already covered at the appropriate boundary
- Test-helper purity, duplication, or type polish that cannot create false confidence
- Hypothetical races or fault chains with no credible runtime path
- Coverage for impossible states already excluded by types or trusted validation

When uncertain, inspect the real callers, data flow, and operational contract. Impact and plausibility decide—not whether a reviewer can imagine a scenario.

## Stop condition

Stop only when all of the following are true for the latest pushed head:

- `pr-review` reports no real production or admissible test-correctness issues.
- No actionable unresolved review discussions remain.
- Required CI passes, or any failure is proven unrelated and reported clearly.
- Codex and CodeRabbit have had an opportunity to review the latest resolution push and produced no new real issues.
- The worktree and remote PR head agree.

Do not merge unless the user separately asks for `pr-merge`.

## Human verification handoff

At the end of every loop, tell the human exactly what still needs manual verification and how to perform it. Derive this from the acceptance criteria, production risks, external integrations, UI behavior, credentials, hardware, and real-environment contracts that automated checks could not prove.

For each manual check, provide:

- **What it proves** and whether it is a required merge gate or a recommended smoke check
- **Prerequisites** such as environment, account/role, fixture data, credentials, feature flags, or deployment URL
- **Exact numbered steps** using the product's real interface
- **Expected result** after each meaningful step
- **Failure signals** and the minimal safe evidence to record
- **Cleanup or rollback** needed after the check

Keep the checklist concrete enough that a human unfamiliar with the implementation can execute it without guessing. Never ask them to paste secrets, raw tokens, private customer data, or unredacted diagnostics into the PR. If automation already proves everything material, explicitly say that no additional human verification is required and identify any ordinary post-merge smoke check separately.

## Final report

Report the final head, review/resolve cycles performed, meaningful fixes made, CI and external-review status, unresolved-thread count, any genuine blocker, and the human verification handoff above. Keep test commentary proportional; lead with the production outcome.
