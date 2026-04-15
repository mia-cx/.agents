---
name: pr-resolve-discussions
description: >-
  Resolve unresolved PR review discussions by validating findings, then implementing architectural fixes. Use when a PR has unresolved review threads, the user mentions "resolve discussions", "fix review comments", "address PR feedback", or wants to work through open review findings on a pull request. Also use when a PR is blocked on unresolved review threads and needs to get to merge-ready.
---

# Resolve PR Discussions

Find every unresolved review discussion on a GitHub PR, determine which findings are real bugs vs false positives, then implement deep architectural fixes for the real ones. Quick band-aids create garbage that compounds — every sloppy fix trains future LLM context toward more slop. Eliminate garbage with extreme prejudice.

## Philosophy

Codebases are the training data for every future AI interaction in the repo. Placeholder fixes, swallowed errors, `any` casts, dead branches, and "good enough" patches don't just accumulate tech debt — they actively degrade the quality of every future LLM-assisted change. A reviewer who flags structural rot is doing you a favour. Treat their findings as leads on systemic problems, not annoyances to dismiss.

**Prefer architectural, deep fixes over quick & cheap.** If a reviewer points out a bad error path, don't just add a null check — trace the error contract through the module boundary, fix the abstraction, and make the bad state unrepresentable. The goal is to leave the code in a state where the class of bug can't recur, not just where this instance is patched.

## Workflow

### 1. Gather PR context and unresolved threads

```bash
gh pr view <number> --json title,body,headRefName,baseRefName,url
gh api graphql -f query='
  query($owner: String!, $repo: String!, $number: Int!) {
    repository(owner: $owner, name: $repo) {
      pullRequest(number: $number) {
        reviewThreads(first: 100) {
          nodes {
            id
            isResolved
            isOutdated
            path
            line
            comments(first: 20) {
              nodes {
                author { login }
                body
                createdAt
              }
            }
          }
        }
      }
    }
  }
' -f owner=OWNER -f repo=REPO -F number=NUMBER
```

Extract unresolved, non-outdated threads. Each thread is a discussion to investigate.

### 2. Classify each discussion

For every unresolved thread, read the full comment chain and the surrounding code. Classify the finding:

| Classification | Meaning | Action |
|---|---|---|
| **Real bug** | The reviewer identified a genuine correctness, safety, or data-integrity issue. The code can produce wrong results, crash, leak, or silently corrupt state. | Fix it — architecturally. |
| **Real design smell** | Not a bug today, but the structure invites bugs tomorrow. Shallow modules, leaky abstractions, god functions, stringly-typed interfaces, implicit contracts. | Fix it — this is where garbage accumulates fastest. |
| **Valid concern, already handled** | The reviewer's worry is legitimate but the code already addresses it via a mechanism they may not have seen. | Reply with evidence (cite the exact code path), then resolve. |
| **False positive** | The reviewer misread the code, misunderstood the contract, or the concern doesn't apply in context. | Reply with a clear, respectful explanation and resolve. |
| **Preference / style** | Naming, formatting, import order, or subjective design taste with no correctness impact. | Note it. Don't block on it. If the team has a convention, follow it; otherwise skip. |

**Err on the side of "real".** If you're 60% sure it's a false positive, treat it as real and investigate deeper. The investigation itself often reveals adjacent problems worth fixing.

### 3. Investigate real findings deeply

For each finding classified as "real bug" or "real design smell":

1. **Trace the blast radius.** Don't just look at the flagged line. Follow the data flow upstream and downstream. Read callers, callees, and sibling modules. Use `grep`/`rg` to find all usage sites of the affected interface.

2. **Find the root cause.** The reviewer's comment points at a symptom. The symptom might be a missing null check, but the root cause might be that the function's return type lies about nullability, or that two modules disagree about ownership of a lifecycle. Dig until you find the abstraction failure.

3. **Check for the same class of bug elsewhere.** If a reviewer found an off-by-one in a slice operation, search for every slice operation in the module. If they found a missing error check on an async call, audit every async call in the file. Pattern-match across the codebase.

4. **Design the fix at the right level.** Ask yourself:
   - Can I make this class of bug impossible via types or API design? (best)
   - Can I make it fail loudly instead of silently? (good)
   - Can I add a runtime guard that catches it early? (acceptable)
   - Should I just patch this one instance? (last resort — only if the scope of a deeper fix is genuinely disproportionate)

### 4. Implement fixes

For each real finding, implement the fix directly. Don't create issues, don't ask for permission, don't suggest changes — make the change.

**Implementation standards:**
- Every fix must maintain or improve the module's public contract. Don't break callers.
- If a fix changes a function signature or return type, update every call site.
- If a fix reveals that tests were testing the wrong thing (asserting on the buggy behavior), update the tests to assert on the correct behavior.
- If a fix touches an area with no tests, add a test that covers the fixed behavior. Follow the TDD skill's approach: the test should assert on observable outcomes through public interfaces, not implementation internals.
- Run existing tests after each fix to confirm no regressions. If tests exist and a runner is available, use it.

**Ordering:** Fix the deepest/most architectural issue first. Structural fixes often make surface-level fixes unnecessary.

### 5. Reply to each discussion thread

After implementing fixes (or determining a finding is a false positive), reply to the review thread on GitHub:

```bash
# For fixed findings:
gh api graphql -f query='
  mutation($threadId: ID!, $body: String!) {
    addPullRequestReviewThreadReply(input: {pullRequestReviewThreadId: $threadId, body: $body}) {
      comment { id }
    }
  }
' -f threadId=THREAD_ID -f body="REPLY_BODY"
```

**Reply format for fixes:**
> Fixed in `<commit-sha>`. <1-2 sentences explaining what changed and why the deeper fix was chosen over a surface patch.>

**Reply format for false positives:**
> This is handled by `<mechanism>` in `<location>`. <1-2 sentences with the evidence trail.>

After replying, resolve the thread:
```bash
gh api graphql -f query='
  mutation($threadId: ID!) {
    resolveReviewThread(input: {threadId: $threadId}) {
      thread { isResolved }
    }
  }
' -f threadId=THREAD_ID
```

### 6. Commit, push, and summarize

Organize fixes into logical commits (one per concern, not one per thread). Use conventional commit messages. Push to the PR branch.

Present a summary table:

| Thread | File | Classification | Action | Commit |
|---|---|---|---|---|
| "Missing error handling on..." | `runner.ts:142` | Real bug | Fixed error contract at module boundary | `abc1234` |
| "This cast looks unsafe" | `types.ts:58` | Real design smell | Replaced `as any` with discriminated union | `def5678` |
| "Shouldn't this be const?" | `config.ts:12` | False positive | Replied with evidence — already frozen via Object.freeze | — |

End with a one-liner: **"N discussions resolved. M fixes pushed."**

## Garbage Elimination Principles

These apply to every fix you make, and should inform how you evaluate findings:

1. **Lies in the type system are bugs.** If a function returns `string` but can return `undefined`, that's not a style issue — every caller is making decisions based on a lie. Fix the type and fix the callers.

2. **Swallowed errors are time bombs.** `catch {}`, `catch { /* ignore */ }`, `try { ... } catch { return null }` — these hide failures that will surface later as mysterious data corruption. Make errors loud or handle them explicitly.

3. **`any` is contagious.** One `any` in a call chain disables type checking for everything downstream. Replace with the actual type, a generic, or at minimum `unknown` with a type guard.

4. **Dead code is misleading context.** Unreachable branches, commented-out blocks, unused imports, and vestigial functions mislead both humans and LLMs reading the code. Delete them.

5. **Implicit contracts become wrong contracts.** If two modules communicate via convention ("the first element is always the ID"), make it explicit via types, named fields, or validated schemas. Conventions drift; types don't.

6. **Copy-paste is a bug factory.** If the fix for a review comment is "add the same guard that exists in three other places," the real fix is to extract the shared logic. DRY isn't about line count — it's about having one source of truth for a behavior.

7. **Placeholder code in main is tech debt with interest.** `// TODO`, `// HACK`, `// FIXME`, `throw new Error("not implemented")` — if it's merged, it's production code. Either implement it or remove the dead path.
