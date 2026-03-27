## Commit message format

### Subject (heading)

Standard conventional commits — keep it clean and professional:

```
type(scope): short imperative description
```

- Types: `chore`, `feat`, `fix`, `docs`, `test`, `style`, `refactor`
- Present tense, under ~72 chars, no trailing period.

### Body (flavour zone 🎉)

Every commit gets a body. The body should be **genuinely useful** (explain the *why*, call out tricky decisions, mention breaking changes) but written with **personality and a light touch of fun**. Think: a senior dev who's good at their job and also enjoys writing commit messages.

Guidelines for flavourful bodies:
- Use casual, conversational tone — short sentences, contractions fine.
- Flavour can take many forms: dry wit, a pun, a one-liner, a relevant song lyric or quote, a mini-poem, a metaphor, a cheeky aside — all fair game.
- Don't overdo it — the flavour should complement the content, not drown it.
- Still cover the real *why*: what was wrong, what changed, what to watch out for.
- If a commit fixes a GitHub issue, add `Fixes #N` or `Closes #N` on its own line after the body text.

#### Body examples by type

**feat:**
> Turns out users actually want to see their data sorted. Wild, I know. Added ascending sort by default with a toggle for desc — the toggle was basically free so it's in there too.

**feat (song lyric):**
> *"I can see clearly now the rain is gone"* — and so can the dashboard. Added the missing data visibility toggle. It was always there, just... hidden.

**fix:**
> "The bug stops here." — Harry S. Truman (paraphrased). Off-by-one on the section index meant the last heading always got swallowed. Not anymore.

**fix (pun):**
> We had a real commitment issue. The index was off by one, which is ironic for a commit tool. Fixed now — no more therapy needed.

**chore:**
> *"Another one bites the dust"* — dependency edition. Bumped @types/node, wired up the validate script, and sent CI's complaints to voicemail.

**style:**
> Roses are red,
> diffs should be small,
> this is formatting only,
> no logic at all.

**test:**
> Tests were, uh, missing. They are now less missing. Coverage for the happy path and the two edge cases that bit us last sprint.

**docs:**
> *"If it's not documented, it doesn't exist."* — someone who got paged at 3am. Wrote the thing the team kept asking about in standups so we can stop re-explaining it in Slack.

**refactor:**
> Same behaviour, tidier internals. Pulled the duplicate logic into a shared helper — three call sites were all doing the same dance with slightly different shoes.

## Full example

```
fix(decompose): correct section index and guard empty headings

This bug had been quietly misfiling the last section of every decomposed
doc since the index refactor. Off-by-one. Classic. Also added a guard for
empty heading strings so we stop generating phantom commits in edge cases.

Fixes #12

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

> **Note on the trailer:** Always use your actual model name — if you're Claude Opus 4.5, write `Claude Opus 4.5`; if you're Claude Sonnet 4.6, write `Claude Sonnet 4.6`, etc. Don't hardcode a model name that isn't yours.

## Checklist before finishing

- [ ] GitHub issues checked; any commit that fixes an issue includes `Fixes #N` or `Closes #N`.
- [ ] All commits executed via Bash tool — not just printed.
- [ ] Every commit body has real content + a touch of flavour.
- [ ] `git push` run after the final commit.
- [ ] Confirmation summary sent to user.
