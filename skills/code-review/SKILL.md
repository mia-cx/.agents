---
name: code-review
description: Review all source files in a codebase for bad patterns, over-eager decomposition, deep nesting, security issues, dead code, and more by spawning parallel subagents per file plus a cross-file synthesis pass. Use when user asks to "review the codebase", "audit code quality", "find code smells", "review my code", wants a full-repo code review, or mentions patterns like "dead code", "thin wrappers", "deep nesting", or "code health". Also use when user points at a directory and wants quality feedback on the source files in it.
---

# Code Review

Full-codebase code review via bundled scripts. The scripts run outside the agent - the agent discovers files, presents the command, and processes the results when the user returns.

## Pipeline overview

The orchestrator (`scripts/review.py`) runs the full pipeline:

1. **Per-file reviews** - one reviewer per file, bounded worker pool (CPU/2), cheap model. 10-item checklist embedded in `scripts/review-files.py`. Live TUI shows streaming output per active worker.
2. **Per-file validation** - each finding verified against actual source code at the referenced lines. Hallucinated line numbers, phantom issues, and over-eager corrections are rejected.
3. **Cross-file synthesis** - Pass 1 (blind) reads source files with no prior findings to avoid anchoring bias. Pass 2 (informed) reads per-file findings for emergent patterns. Both run in parallel, outputs merged naively. Stronger model. Prompts embedded in `scripts/review-crossfile.py`.
4. **Cross-file validation** - merged cross-file findings verified against actual source code.
5. **Combined report** - `CODE_REVIEW.md` with all surviving findings.

### Model selection

Use `openai-codex/gpt-5.5` for both per-file reviews and cross-file synthesis. User-specified model overrides this default.

## Workflow

### 1. Discover and curate files

Get the raw file list with `rg` (respects `.gitignore`, skips hidden/vendored files):

```bash
rg --files --type-add 'code:*.{ts,tsx,js,jsx,py,go,rs,rb,java,kt,cs,c,cpp,h,hpp,swift,lua,sh,bash,zsh,php,ex,exs,erl,hs,ml,scala,clj,vue,svelte}' -t code
```

If `rg` is not available, fall back to `git ls-files` or `find`.

Then **curate the list**. Identify the project type (SvelteKit, Next.js, Django, Go module, etc.) and remove files that aren't worth reviewing:

- **Framework scaffold/boilerplate** - `app.html`, `+layout.ts` with just a `return`, `next.config.js` with default exports, `manage.py`, `wsgi.py`, `asgi.py`
- **Config files that happen to match extensions** - `tailwind.config.ts`, `postcss.config.js`, `vite.config.ts`, `tsconfig.json` wrappers
- **Barrel/re-export files** - files under 5 lines that just re-export from other modules
- **Auto-generated code** - ORM migrations, GraphQL codegen output, protobuf stubs, `package-lock.json` wrappers
- **Test fixtures and snapshots** - `.snap` files, large JSON fixtures

The goal is to review actual business logic, not framework plumbing. Use judgment - a `vite.config.ts` with 3 lines is noise, one with custom plugin logic is worth reviewing.

Write the curated list to a temp file (e.g. `/tmp/review-files.txt`).

### 2. Scope and plan

In a monorepo, scope to one package at a time. Even in a single-package repo, group files by module or domain (e.g. `src/auth/`, `src/api/`, `src/utils/`). Run the pipeline once per scope, not once for the entire repo. This keeps reviews focused, reports digestible, and cross-file synthesis meaningful (it can only find patterns within the files it sees).

Present the curated file count and scope to the user. If a single scope has >30 files, break it down further.

### 3. Present the command

**Do not run the script yourself.** Present the command to the user and tell them to run it in their terminal:

```bash
cd /path/to/repo && python3 <skill-dir>/scripts/review.py \
  --output-dir /tmp/code-review \
  --file-list /tmp/review-files.txt \
  --per-file-model openai-codex/gpt-5.5 \
  --crossfile-model openai-codex/gpt-5.5
```

Replace `<skill-dir>` with the resolved absolute path to this skill's directory. The script must be run from the repo root (or file paths in `--file-list` must be absolute).

Tell the user:
> Run this in your terminal. The pipeline has a live TUI showing progress per worker. When it finishes, come back and point me at the output directory (`/tmp/code-review`) and I'll process the report.

**Why the user runs it:** The pipeline spawns many parallel LLM processes with a live streaming TUI - this doesn't work well when run as a background process from an agent. Running it directly in the terminal gives proper TTY output and the user can observe progress in real time.

### 4. Process the results

When the user returns and points you at the output directory:

1. Read `<output-dir>/CODE_REVIEW.md` for the combined report.
2. Read `<output-dir>/per-file/*.md` for individual file findings if you need detail.
3. Read `<output-dir>/per-file/.raw/*.md` for pre-validation findings if you need to check what was rejected.
4. Read `<output-dir>/crossfile-blind.md`, `crossfile-informed.md`, `crossfile-compiled.md` for intermediate cross-file passes.
5. Read `<output-dir>/synthesis.md` for the final validated cross-file findings.

**Every finding must have file path, line number(s), one-sentence issue, and concrete suggestion.** A finding without a line reference or without a suggestion is incomplete - go back to the per-file output and extract it. Only files with findings appear in the report - clean files are omitted.

**Deduplicate cross-file vs per-file findings.** If a cross-file finding subsumes individual per-file findings (same underlying issue, broader scope), keep the cross-file finding and drop the per-file entries it covers. The cross-file pattern is more useful because it names all affected files and identifies the systemic cause.

**When a finding suggests abstraction, check for existing ones first.** Before recommending a new helper, utility, or pattern, search the codebase for existing abstractions that already do something similar. Prefer enhancing an existing abstraction over introducing a new one — new abstractions are noise if an existing one is close enough.

Present the deduplicated findings to the user, organized by file.

### 5. File GitHub issue

If the working directory is a git repo with a GitHub remote and `gh` is available, file the report as a GitHub issue so it can be picked up as a work item.

**Issue types are not labels and `gh issue create --type task` is not valid.** Get the repository id and the actual issue type id first, then create the issue via GraphQL with `issueTypeId`:

```bash
OWNER_REPO=$(gh repo view --json nameWithOwner --jq .nameWithOwner)
OWNER=${OWNER_REPO%/*}
REPO=${OWNER_REPO#*/}

REPO_DATA=$(gh api graphql \
  -f query='query($owner:String!,$repo:String!){ repository(owner:$owner,name:$repo){ id issueTypes(first:20){ nodes{ id name } } } }' \
  -f owner="$OWNER" \
  -f repo="$REPO")

REPOSITORY_ID=$(printf '%s' "$REPO_DATA" | jq -r '.data.repository.id')
ISSUE_TYPE_ID=$(printf '%s' "$REPO_DATA" | jq -r '.data.repository.issueTypes.nodes[] | select(.name == "📋 task" or .name == "task") | .id' | head -n1)

BODY=$(cat /tmp/code-review-issue.md)

gh api graphql \
  -f query='mutation($repositoryId:ID!,$issueTypeId:ID!,$title:String!,$body:String!){ createIssue(input:{repositoryId:$repositoryId,issueTypeId:$issueTypeId,title:$title,body:$body}){ issue{ number url title issueType{ name } } } }' \
  -f repositoryId="$REPOSITORY_ID" \
  -f issueTypeId="$ISSUE_TYPE_ID" \
  -f title="Code review: <N> findings across <M> files" \
  -f body="$BODY"
```

If `ISSUE_TYPE_ID` is empty, do not guess; list the available issue type names from `REPO_DATA` and ask the user which one to use. The issue body is the full report - self-contained so someone can start fixing without re-running the review. Include a worktree setup block:

```markdown
## Getting Started

\`\`\`bash
git worktree add .worktrees/code-review-fixes -b fix/code-review-findings
cd .worktrees/code-review-fixes
\`\`\`
```

If `gh` is not available or there's no GitHub remote, skip this step and present the report in chat only.

If the review was scoped to one package/module, repeat from step 1 for the next scope.

## Rules

- **Report only, no fixes.** This skill produces a review. Fixes are a separate step.
- **Every finding needs a line reference and a concrete suggestion.** "Consider refactoring" without a target is noise.
