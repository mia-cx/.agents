#!/usr/bin/env bash
# Upload files to the i.mia.cx R2 worker (Cherry/ShareX-R2-Cloudflare-Workers).
set -euo pipefail

usage() {
	cat >&2 <<'EOF'
Usage:
  upload.sh <file> [--name NAME] [--json]   Upload a file, print its public URL
  upload.sh - --name NAME [--json]          Upload stdin (NAME sets the extension)
  upload.sh --list                          List stored objects
  upload.sh --delete <key>                  Delete an object by key (e.g. 2026/08/foo-a1b2c3.png)

Config (env overrides ~/.config/i-upload/config):
  UPLOAD_ENDPOINT   default https://i.mia.cx
  UPLOAD_KEY        worker AUTH_KEY (required)
EOF
	exit 64
}

CONFIG="${XDG_CONFIG_HOME:-$HOME/.config}/i-upload/config"
# Sourcing would clobber the environment, so stash it first and let it win —
# `UPLOAD_KEY=... upload.sh` must beat the config file, not the other way round.
env_key=${UPLOAD_KEY:-}; env_endpoint=${UPLOAD_ENDPOINT:-}
# shellcheck source=/dev/null
[[ -f $CONFIG ]] && source "$CONFIG"
UPLOAD_KEY=${env_key:-${UPLOAD_KEY:-}}
ENDPOINT="${env_endpoint:-${UPLOAD_ENDPOINT:-https://i.mia.cx}}"
ENDPOINT="${ENDPOINT%/}"

if [[ -z ${UPLOAD_KEY:-} ]]; then
	example="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/config.example"
	echo "UPLOAD_KEY is unset. Set up $CONFIG — see $example" >&2
	exit 78
fi

# Runs curl with auth, splitting the response body from the trailing HTTP status.
# Fails with the worker's own error message so callers see the real cause.
api() {
	local response status body
	response=$(curl -sS -w '\n%{http_code}' -H "x-auth-key: $UPLOAD_KEY" "$@")
	status=${response##*$'\n'}
	body=${response%$'\n'*}
	if [[ $status == 000 ]]; then
		echo "upload.sh: could not reach $ENDPOINT" >&2
		exit 1
	fi
	if [[ $status != 2* ]]; then
		echo "upload.sh: HTTP $status — $(jq -r '(.error|objects.message) // (.error|strings) // .message // tostring' <<<"$body" 2>/dev/null || echo "$body")" >&2
		exit 1
	fi
	printf '%s' "$body"
}

uri() { jq -rn --arg s "$1" '$s|@uri'; }

case "${1:-}" in
	--list) api "$ENDPOINT/files/list"; echo; exit 0 ;;
	--delete)
		[[ -n ${2:-} ]] || usage
		api "$ENDPOINT/delete?filename=$(uri "$2")" >/dev/null
		echo "deleted $2"; exit 0 ;;
	''|-h|--help) usage ;;
esac

src=$1; shift
name=""; json=false
while [[ $# -gt 0 ]]; do
	case $1 in
		--name) name=${2:?--name needs a value}; shift 2 ;;
		--json) json=true; shift ;;
		*) usage ;;
	esac
done

cleanup() { [[ -n ${tmp:-} ]] && rm -f "$tmp"; :; }
trap cleanup EXIT

if [[ $src == - ]]; then
	[[ -n $name ]] || { echo "stdin requires --name (the worker needs an extension to infer type)" >&2; exit 64; }
	tmp=$(mktemp); cat >"$tmp"; src=$tmp
fi
[[ -f $src ]] || { echo "no such file: $src" >&2; exit 66; }

if [[ -z $name ]]; then
	# Readable slug plus a short random suffix, so repeat uploads never clobber each other.
	base=$(basename "$src" | tr '[:upper:]' '[:lower:]')
	ext=""; [[ $base == *.* ]] && ext=".${base##*.}"
	slug=$(printf '%s' "${base%.*}" | tr -c 'a-z0-9._-' '-' | sed 's/-\+/-/g; s/^-//; s/-$//')
	name="${slug:-file}-$(openssl rand -hex 3)${ext}"
fi

result=$(api -X POST -T "$src" \
	-H "content-type: $(file --mime-type -b "$src")" \
	"$ENDPOINT/upload?filename=$(uri "$name")")

if $json; then
	# deleteUrl embeds the auth key, so only surface it on explicit request.
	jq . <<<"$result"
else
	jq -r .image <<<"$result"
fi
