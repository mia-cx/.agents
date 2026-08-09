#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "usage: run-codex-review.sh PROMPT_FILE ARTIFACT_STEM" >&2
  exit 64
fi

prompt_file=$1
artifact_stem=$2
report_file="${artifact_stem}.md"
trace_file="${artifact_stem}.trace.log"

if [[ ! -s "$prompt_file" ]]; then
  echo "Codex reviewer prompt is missing or empty: $prompt_file" >&2
  exit 65
fi

prompt_lines=$(awk 'END { print NR }' "$prompt_file")
if (( prompt_lines > 25 )); then
  echo "Codex reviewer prompt has $prompt_lines lines; keep it at 25 or fewer" >&2
  exit 65
fi

required_instruction='Do not invoke any skill, and do not spawn sub-agents.'
first_line=$(head -n 1 "$prompt_file")
if [[ $first_line != "$required_instruction"* ]]; then
  echo "Codex reviewer prompt must start with: $required_instruction" >&2
  exit 65
fi

mkdir -p "$(dirname "$artifact_stem")"
codex -s danger-full-access review - < "$prompt_file" > "$report_file" 2> "$trace_file"

if [[ ! -s "$report_file" ]] || ! grep -q '[^[:space:]]' "$report_file"; then
  echo "Codex exited without a review report; this leg does not count. Trace: $trace_file" >&2
  exit 66
fi
