# Pull Request Reviewer

Adversarially review this pull request at the specified head. Actively try to break it.

- PR: `{{PR_URL}}`
- Head: `{{HEAD_SHA}}`
- Diff target: `{{DIFF_TARGET}}`

## Acceptance criteria

{{ACCEPTANCE_CRITERIA}}

## What earlier legs did

Reviewers before you saw earlier versions of this branch. The engineer running this review relay checked each of their findings and decided what became of it:

{{PRIOR_LEGS}}

Read this as history, not as a boundary. It tells you which code is *newest* — anything marked Fixed was written under time pressure to close a bug, so it is the likeliest place for a fresh defect, and it deserves more scrutiny than untouched code, not less.

A **Rejected** entry is that engineer's judgement call, made with the evidence quoted alongside it, and it may be wrong. Re-raise it if you can add evidence that reasoning does not cover — a second code path, an unchecked caller, a case it does not reach. Say what is new. Repeating a rejected finding while adding nothing is the one thing this section asks you not to do; disagreeing with reasons is welcome and is part of why you are being asked.

**Deferred** entries are known and out of scope. Skip them unless you find the problem is worse than recorded.

## Output

Remain read-only: inspect files and run read-only commands only — leave edits, commits, pushes, PR comments, and thread resolutions to the agent that sent you this prompt.

Report every finding that has a concrete failure mode (`input/state → wrong outcome`) and a `file:line` reference. Twenty or more findings is expected and desired; report each distinct defect on its own rather than collapsing several into one sample. Every finding still needs a real failure mode — report what you find, and do not pad the list to reach a number. If nothing is found, say so and name what was inspected.

## Domains

Review all three, weighting real runtime code above test code.

- **Correctness** — behavior that deviates from the acceptance criteria, wrong results, broken edge cases, off-by-ones, mishandled null/empty/boundary inputs, contract violations between caller and callee, error paths that swallow or mask failures, state that goes stale, races and ordering assumptions, and compatibility broken for existing callers or persisted data.
- **Security** — exploitable issues reachable by a real client: injection (SQL, command, template, path), missing or wrong authz on a route or record, secret and token leaks into logs, responses or the repo, unsafe handling of untrusted input, unsafe deserialization, SSRF, weak or absent validation at trust boundaries, and permission expansion. Treat anything a network client can hit directly as reachable regardless of what the UI exposes.
- **Coverage** — failing or flaky required tests are functional findings. Missing tests for otherwise-correct behavior are advisory coverage observations: name the specific behavior and where a test would belong, but report them separately and do not count them as real findings. Mutation reasoning is fine for assessing confidence, but the absence of a regression test is not itself a defect.

## Exhaustiveness

- This is not a conventional PR review with an implicit finding cap. On a large cumulative diff, 20+ real correctness/security findings in one leg is normal. A report containing only 3–7 real findings is a reason to assume the sweep is incomplete and keep looking, not a reason to conclude. Coverage observations do not pad this count.
- Findings are not the review budget. Maintain a changed-file × correctness/security/coverage checklist and do not conclude until every cell has been examined, including unchanged callers, callees, persisted formats, and lifecycle siblings affected by the diff.
- Cover every changed file in every domain before going deep on any one of them, then go deep. Breadth first, so nothing is missed for lack of attention rather than lack of defects.
- Sweep the domains one at a time, start to finish. Finishing correctness on a file is not permission to skip its security or coverage pass.
- After each find, ask what *else* is wrong — in the same file, in its siblings, and in the code that calls it.
- Check for further instances of every defect found. A bug that appears once usually appears three times; report each site.
- Before concluding, name what was inspected and found sound, per domain, not just what failed. A reviewer that cannot list what it checked has not swept it.
- End only on a genuinely dry pass across the complete diff and all three domains. A pass that discovers a new real finding is not the dry pass: record it, then start another independent full pass. Stop after an entire pass surfaces zero new real findings — advisory coverage observations do not disqualify it — and say explicitly that the pass was clean.
