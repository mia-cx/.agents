---
name: gh-comment
description: >-
  Use when posting, editing, or replying to a comment on a GitHub pull request
  (a conversation comment, an inline comment on a diff line, or a reply in a
  review thread), including when another skill needs to publish results to a PR.
---

# GH comment

`gh` is authenticated as the user, so everything posted here appears under the user's name. The attribution header is what keeps that honest.

## Attribution

Every comment body starts with this header, verbatim:

```md
<actual model> commenting on behalf of <user's name, from AGENTS.md>.
---

<comment>
```

One wording for every case: a new conversation comment, an inline comment on a diff line, and a reply in a thread all say *commenting*.

`<actual model>` is the model that **composed the text**: `claude-opus-5`, `gpt-5.6-sol`, `gpt-5.5`. Not the harness, not the orchestrator that dispatched the work, not the wrapper agent. A Sonnet wrapper relaying a Codex report writes `gpt-5.6-sol`, because those are the words being published. When several models contributed, name the one that wrote the words and attribute the rest inline.

A reader deciding how much to trust a review verdict, a bug claim, or a "this is fine" needs to know a model wrote it and which one. The header is the only signal they get, so it goes on the routine comments too, not just the ones that feel consequential.

## Bodies go in files

Write the body to a temp file and pass `--body-file`; comment bodies are markdown full of backticks, quotes, and newlines that an inline `--body` string mangles.

```bash
BODY="$(mktemp "${TMPDIR:-/tmp}/gh-comment.XXXXXX.md")"   # write the rendered body here
```

## Images and video

`gh` posts text, so it cannot attach a file the way the web composer does; a local path in a comment body is a dead reference for every reader. Host the file first with the **`upload-file` skill**, then embed the URL it returns:

```md
![failing dialog after the fix](https://i.mia.cx/file/2026/08/dialog-a1b2c3.png)
```

Screenshots, before/after pairs, recordings of a repro, and rendered charts all belong in the comment rather than described in prose; a reviewer arguing about UI behaviour from a text description is doing avoidable work.

**Video from an external URL never renders a player.** Tested on a GitHub comment: `![]()`, a `<video>` tag, a plain link, and a bare URL on its own line all fall back to a link or nothing. GitHub plays only what was uploaded through its own composer. So when a recording has to be *seen* inline, convert it to a GIF, which embeds like any other image:

```bash
ffmpeg -i clip.mp4 -vf "fps=12,scale=720:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse" clip.gif
```

Otherwise link the mp4 and say what it shows plus how long it runs, so a reader can decide whether to download it:

```md
[Screen recording: toast never dismisses (0:12)](https://i.mia.cx/file/2026/08/toast-bug-d4e5f6.mp4)
```

GIFs get large fast; keep them short and narrow, and prefer a still frame when one frame makes the point.

Anything uploaded this way is public to anyone with the URL. Screenshots of internal dashboards, tokens, customer data, or staging credentials stay out of the bucket.

## Conversation comments

```bash
gh pr comment <n> --body-file "$BODY"                        # new comment
gh pr comment <n> --body-file "$BODY" --edit-last --create-if-none   # update in place, or create the first
```

`--edit-last` targets the authenticated user's most recent comment on that PR, which may be something Mia typed by hand, not the comment you meant to update. When a comment must be updatable across a long-running job, own it with a hidden marker instead and look it up by that:

```bash
# last line of $BODY: <!-- gh-comment:review-relay -->
ID=$(gh api "repos/$OWNER/$REPO/issues/$N/comments" \
  --jq '.[] | select(.body | contains("<!-- gh-comment:review-relay -->")) | .id' | head -1)
[ -n "$ID" ] \
  && gh api -X PATCH "repos/$OWNER/$REPO/issues/comments/$ID" -F body=@"$BODY" \
  || gh pr comment "$N" --body-file "$BODY"
```

An edit posts no notification. When an update carries something subscribers need to see, post a new comment instead and say what changed.

## Inline comments on a diff line

Anchored to a path, a line, and a commit. The line number is the one in that commit's diff, so a comment written against a stale head lands on the wrong code or 422s.

```bash
gh api "repos/$OWNER/$REPO/pulls/$N/comments" \
  -F body=@"$BODY" -f commit_id="$HEAD_SHA" -f path="src/auth/session.ts" \
  -F line=88 -f side=RIGHT
```

`side=RIGHT` is the post-change line; `LEFT` comments on a deleted line. For a multi-line range add `-F start_line=<first>`. Fetch `$HEAD_SHA` immediately before posting.

## Replies in a review thread

Reply to an existing inline comment by its id, which keeps it in that thread rather than starting a new one:

```bash
gh api "repos/$OWNER/$REPO/pulls/$N/comments/$COMMENT_ID/replies" -F body=@"$BODY"
```

To reply and resolve in one pass, use the GraphQL `addPullRequestReviewThreadReply` + `resolveReviewThread` mutations; the `review-relay` skill's "Discussion thread mechanics" has the queries.

## Before posting

- The header is present and names the model that wrote the words.
- The body renders as markdown: fenced blocks closed, no stray `---` splitting the reply into a second section.
- Inline comments cite the current head.
- Posting is public and outward-facing: a comment can be edited or deleted afterward, but subscribers were already emailed the original.
