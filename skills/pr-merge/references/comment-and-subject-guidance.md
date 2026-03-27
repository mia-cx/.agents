## Merge commit subject format

Clean and professional — conventional commit style:

```
type(scope): short imperative description (#N)
```

- Infer the type from the PR content: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`
- Include the PR number at the end
- Under ~72 chars, no trailing period
- **No body** — all narrative goes in the comment (step 5)

> **Note on the trailer:** In the comment, always use your actual model name — if you're Claude Opus 4.5, write `Claude Opus 4.5`; if you're GPT-5.4, write `GPT-5.4`, etc. Don't hardcode a model name that isn't yours.

## Checklist before finishing

- [ ] PR context fully read (diff, body, comments, linked issues).
- [ ] CI checks confirmed passing.
- [ ] Flavour comment posted via `gh pr comment` — visible in GitHub timeline.
- [ ] Merge executed via `gh pr merge` with subject only — no body.
- [ ] `Co-Authored-By` trailer in the comment reflects your actual model name.
- [ ] Confirmation summary sent to user.
