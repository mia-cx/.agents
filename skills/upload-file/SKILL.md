---
name: upload-file
description: >-
  Upload a local file, screenshot, or piped output to the i.mia.cx R2 bucket and
  get back a public URL. Use when the user asks to upload, host, or share a file,
  wants a link to an image, screenshot, log, diff, or report, or when a result is
  easier to hand over as a URL than as inline text. Also covers listing and
  deleting previously uploaded objects, and configuring ShareX or ishare clients.
disable-model-invocation: true
---

# File Upload

`scripts/upload.sh` wraps the [Cherry/ShareX-R2-Cloudflare-Workers](https://github.com/Cherry/ShareX-R2-Cloudflare-Workers) worker deployed at `https://i.mia.cx`. It prints the public URL on stdout and nothing else, so it composes directly into other commands.

## Commands

```bash
upload.sh screenshot.png                  # → https://i.mia.cx/file/2026/08/screenshot-a1b2c3.png
upload.sh report.pdf --name q3-report.pdf # exact key, no random suffix (overwrites on repeat)
git diff | upload.sh - --name fix.diff    # stdin; --name supplies the extension
upload.sh out.log --json                  # full worker response, incl. deleteUrl
upload.sh --list                          # R2 listing as JSON
upload.sh --delete 2026/08/screenshot-a1b2c3.png
```

Uploads land under `YYYY/MM/`, and the worker serves them from `/file/<key>`. A delete key is the bare `YYYY/MM/name` — no `/file/` prefix — so take it from `--list` or by stripping `/file/` off a returned URL. Setting `CUSTOM_PUBLIC_BUCKET_DOMAIN` on the worker would drop the prefix and serve from the bucket domain directly.

## Usage notes

- Default naming is `<slugified-basename>-<6 hex>.<ext>`, so uploading the same file twice yields two distinct URLs. Reach for `--name` only when a stable, guessable URL is the point.
- Content type comes from `file --mime-type`, and the worker stores it on the object, so browsers render uploads correctly even when the key has no extension.
- Prefer piping over temp files when the content is generated: `pnpm test 2>&1 | upload.sh - --name test-failures.txt`.
- `--json` exposes `deleteUrl`, which embeds the auth key in a query string. Never paste that into a PR, issue, or chat message — delete via `--delete` instead.
- Exit codes: 1 worker error, 64 bad usage, 66 missing file, 78 missing config.

## Config

Config lives at `~/.config/i-upload/config` — deliberately outside this repo, which is public. Installing on a new host is a copy and a paste:

```sh
mkdir -p ~/.config/i-upload
cp config.example ~/.config/i-upload/config && chmod 600 ~/.config/i-upload/config
$EDITOR ~/.config/i-upload/config   # set UPLOAD_KEY to the worker's AUTH_KEY
```

`config.example` documents every variable. Env vars of the same name win over the file. Needs `jq` (`brew install jq` on macOS); `curl` and `file` ship with the OS.

On a 401 the key is out of sync with the worker's `AUTH_KEY` secret. Never commit the key — the skill's `.gitignore` blocks a stray `config` here, but the real answer is that it belongs in `~/.config`.

## Desktop clients

See `references/clients.md` for the ShareX `.sxcu` and ishare `.iscu` uploader definitions pointing at the same worker.
