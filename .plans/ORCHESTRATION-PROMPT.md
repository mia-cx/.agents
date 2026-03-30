---
name: Role to SOP Plan
overview: "Post-calibration plan for auditing the existing reference corpus, producing proposal shortlists for each repo, human-reviewing those proposals before comparison, comparing the reviewed corpus, and then human-reviewing the final .agents inclusion set before any actual repo work begins."
worktree: /Users/mia/.agents/.worktrees/role-to-sop
status: ready-after-calibration
todos:
  - id: step-0-add-own-repo
    content: Copy .agents rules/skills/subagents into .references/.agents/ with a README
    status: done
  - id: step-1-audit-corpus
    content: Run one pi-subagents worker per repo in .references/, produce namespaced audit shortlists
    status: pending
  - id: step-2-summarize-findings
    content: Output chat-stream summary of per-repo findings and early cross-repo patterns
    status: pending
  - id: step-3-hitl-repo-review
    content: Human reviews repo-level shortlists and copies approved files to .plans/approved/audits/
    status: pending
  - id: step-4-compare-sources
    content: Run 3-phase pi-subagents pipeline (scout → per-SOP workers → formatter) to produce cross-repo-shortlist.md
    status: pending
  - id: step-5-present-recommendations
    content: Output chat-stream summary of cross-repo findings and recommended category layout
    status: pending
  - id: step-6-hitl-final-review
    content: Human reviews cross-repo shortlist and copies approved version to .plans/approved/shortlist.md
    status: pending
  - id: step-7-write-synthesize-prompt
    content: Draft SYNTHESIZE-PROMPT.md from approved shortlist, then human reviews before synthesis begins
    status: pending
  - id: step-8-synthesize-sops
    content: Run pi-subagents workers per approved shortlist item to write skills/rules/subagents
    status: pending
  - id: step-9-file-pr
    content: File PR via /pr-file and wait for human review before merge
    status: pending
isProject: false
---

# Role to SOP Plan

## Context

Working worktree: `/Users/mia/.agents/.worktrees/role-to-sop`

Agent instructions are often framed in a role-responsibility model/manner, but these are very human-first systems. In the era of AI, these systems should be treated as legacy, as much of that procedural overhead can be compressed. The value has shifted from the role theater to the context, rules, checks, escalation, and execution flow.
You can use this lean summary of the transcript of a Theo video about this topic as meta-context for the thesis in this repo: `/Users/mia/.agents/.worktrees/role-to-sop/.plans/reference-material/theo-meta-context-v2.md`
If you find reason to go in more depth, you can check the full transcript at `/Users/mia/.agents/.worktrees/role-to-sop/.plans/reference-material/theo-jira-and-linear-are-legacy-software-transcript.md`. If you touch this file, please append a section to `/Users/mia/.agents/.worktrees/role-to-sop/.plans/reference-material/theo-meta-context-v2.md` with the information you needed and found, that wasn't in the summary when you needed it.

We have reference material in `/Users/mia/.agents/.worktrees/role-to-sop/.references/`.

Audit pipeline prompts (substitute placeholders per repo/file):
- Scout: `.plans/SCOUT-PROMPT.md` — `{{REPO_PATH}}`, `{{REPO_NAME}}`
- Audit: `.plans/AUDIT-PROMPT.md` — `{{FILE_PATH}}`, `{{REPO_NAME}}`
- Format: `.plans/FORMAT-PROMPT.md` — `{{REPO_NAME}}`

Comparison pipeline prompts:
- Compare scout: inline in Step 4 (no placeholders)
- Compare worker: `.plans/COMPARE-PROMPT.md` — `{{SOP_NAME}}`
- Compare format: `.plans/COMPARE-FORMAT-PROMPT.md`

## Reasoning

This plan aims to explore existing reference repos with agentic rules, skills and subagent prompts, and extract useful policies and SOPs, reframed to be portable and durable processes in stead of role-theater. The question is "what is the strongest portable version of each SOP, and how should it be organized?"

Answering that requires comparing how different repos encode similar tasks — not to copy any one source, but to extract the patterns that survive across sources. A pattern that appears in multiple strong repos, encoded consistently, is a candidate for a durable SOP. A pattern that appears in only one repo, or varies wildly across them, might still be a strong candidate, but will need more scrutiny before promotion.

## Step-by-step plan

### Step 0 (AFK) — Add our own repo to the reference corpus

Copy the current contents of `/Users/mia/.agents/` (rules, skills, subagents) into `.references/.agents/`. Add a short `README.md` answering: who made this repo and why it exists. This makes our own repo auditable on the same footing as all other references.

### Step 1 (AFK) — Audit the existing reference corpus

Audit every repo in `.references/`. **Process one repo at a time, sequentially.** After starting a repo's audit pipeline, end your response and wait. Only proceed to the next repo once the final audit file exists and is non-empty at `.plans/audits/<REPO_NAME>/role-to-sop-audit-1.md`.

**Model selection**: Choose model based on total file count in the repo (local system resource and cost optimisation). Apply the same model to all three phases (scout, workers, formatter) for that repo:

| File count | Model | Repos |
|---|---|---|
| < 200 | `anthropic:claude-sonnet-4-6` | `agentic-rules`, `ai-engineering-sop`, `anthropic-skills`, `awesome-claude`, `awesome-codex-skills`, `awesome-subagents`, `citypaul-dotfiles`, `context-engineering`, `cursor-rules`, `dotagents`, `gstack`, `klinglt-dotfiles`, `mattpocock-skills`, `strands-agent-sop` |
| 200–999 | `openai-codex:gpt-5.4-mini` | `taches`, `wshobson-agents` |
| 1000+ | `cursor-agent:composer-2-fast` | `antigravity-skills`, `awesome-copilot`, `awesome-cursorrules`, `everything-claude-code` |

```typescript
// < 200 files
{ agent: "scout", model: "anthropic:claude-sonnet-4-6", cwd: "<REPO_PATH>", task: "..." }

// 200–999 files
{ agent: "scout", model: "openai-codex:gpt-5.4-mini", cwd: "<REPO_PATH>", task: "..." }

// 1000+ files
{ agent: "scout", model: "cursor-agent:composer-2-fast", cwd: "<REPO_PATH>", task: "..." }
```

The audit runs in three phases across all repos:

---

**Phase 1 — All scouts in parallel**

Prompt: `.plans/SCOUT-PROMPT.md` (substitute `{{REPO_PATH}}` and `{{REPO_NAME}}` per repo).

Run one scout per repo simultaneously — scouts are read-only so there are no conflicts. Cap at 8 concurrent scouts (local system resource limit); if there are more repos, batch into rounds of 8:

```typescript
subagent({
  tasks: [
    { agent: "scout", cwd: "<REPO_PATH_1>", task: "<SCOUT-PROMPT for repo 1>" },
    { agent: "scout", cwd: "<REPO_PATH_2>", task: "<SCOUT-PROMPT for repo 2>" },
    // ... one entry per repo in .references/
  ],
  clarify: false
})
```

Wait for all scouts to finish. Each produces `.plans/audits/<REPO_NAME>/file-inventory.md`. Then proceed to Phase 2.

---

**Phase 2+3 — Per-repo audit then format (sequential repos, parallel files)**

Process one repo at a time. For each repo:

**2a. Parallel file workers** (max 12 concurrent)

Prompt: `.plans/AUDIT-PROMPT.md` (substitute `{{FILE_PATH}}` and `{{REPO_NAME}}` per file).

Read `file-inventory.md` to build the task list, then run up to 12 workers in parallel:

```typescript
subagent({
  tasks: [
    { agent: "worker", task: "<AUDIT-PROMPT for file 1 of REPO_NAME>" },
    { agent: "worker", task: "<AUDIT-PROMPT for file 2 of REPO_NAME>" },
    // ... one per file, max 8
  ],
  clarify: false
})
```

If the inventory has more than 8 files, batch into rounds of 8 and wait for each round before starting the next. The cap is a local system resource limit, not a logical constraint.

**2b. Format (immediately after workers finish)**

Prompt: `.plans/FORMAT-PROMPT.md` (substitute `{{REPO_NAME}}`).

```typescript
subagent({
  agent: "worker",
  task: "<FORMAT-PROMPT.md content with {{REPO_NAME}} substituted>",
  clarify: false
})
```

Verify `.plans/audits/<REPO_NAME>/role-to-sop-audit-1.md` exists and is non-empty. Then move on to the next repo.

---

### Step 2 (AFK) — Summarize per-repo findings

Output a chat-stream summary (not a file) covering each audited repo: what procedure categories are present, how they are encoded, the quality of the shortlist proposals, and any standout patterns or red flags. Also surface any high-level patterns already visible across repos at this point. This gives the human reviewer enough orientation to evaluate the audit files without reading every one in full.

### Step 3 (HITL) — Human review of repo-level proposal shortlists

Before any cross-repo comparison, a human must read every repo-level proposal shortlist and confirm the proposals meet the quality bar. Approved audit files are copied to `.plans/approved/audits/`. This is a hard gate: do not proceed to Step 4 until approved files are present.

### Step 4 (AFK) — Compare findings across sources

Uses the same 3-phase pipeline as Step 1, applied across repos instead of files.

**Phase 1 — Category scout**

Run a single scout that reads all approved audit files and produces a list of SOP categories that emerge across repos:

```typescript
subagent({
  agent: "scout",
  task: `Read every file in .plans/approved/audits/. For each proposed SOP that appears across one or more repos, consolidate the findings from all audits into a single enriched block and write it to .plans/audits/sop-inventory.md.

Each block should follow this format:

## <canonical-sop-name>
**Sources**:
| Repo | Source file | Portable |
|------|-------------|----------|
| <repo> | <exact path relative to repo root> | yes/partial/no |

**Trigger** (consolidated, deduped): <when to use — synthesised across all audit findings>
**Steps/contract** (consolidated, deduped): <operative steps from all sources>
**Strong** (per source): <what each repo's version does well>
**Strip** (consolidated, deduped): <persona, branding, org-local material flagged across audits>
**Output form**: <skill | rule | subagent prompt>

Include every repo that has any version — strong, partial, or weak. The comparison workers use this inventory as their primary input; they should not need to re-scan repos.`,
  clarify: false
})
```

**Phase 2 — Parallel per-SOP comparison** (max 12 concurrent)

One worker per proposed SOP from the category inventory. Each worker reads the actual source files directly from `.references/` across all repos that contain that SOP, finds the strongest parts of each implementation, and bash-appends a findings block to the shared file. Use `.plans/COMPARE-PROMPT.md` (substitute `{{SOP_NAME}}`) as the task:

```typescript
subagent({
  tasks: [
    { agent: "worker", task: "<COMPARE-PROMPT for SOP 1>" },
    { agent: "worker", task: "<COMPARE-PROMPT for SOP 2>" },
    // ... one per proposed SOP, max 8 concurrent, batch if needed
  ],
  clarify: false
})
```

Each worker bash-appends a findings block to `.plans/audits/raw-comparison.md`.

**Phase 3 — Format**

Prompt: `.plans/COMPARE-FORMAT-PROMPT.md` (substitute `{{REPO_NAME}}`). A single worker reads `raw-comparison.md` and produces the final cross-repo shortlist:

```typescript
subagent({
  agent: "worker",
  task: "<COMPARE-FORMAT-PROMPT.md content with placeholders substituted>",
  clarify: false
})
```

### Step 5 (AFK) — Present findings and repo recommendations

Output a chat-stream summary (not a file) covering: what works across the corpus, what does not, the recommended category layout, the initial SOP set to create or adapt first, and where prototype-to-plan workflows outperform plan-heavy alternatives. The recommendation should shape this repo into a portable SOP library, not a collection of identity-driven personas.

### Step 6 (HITL) — Human review of the final `.agents` inclusion set

A human must review the cross-repo shortlist and recommendations, then copy the approved shortlist to `.plans/approved/shortlist.md`. This is a second hard gate: do not proceed to Step 7 until `.plans/approved/shortlist.md` exists.

### Step 7 (HITL) — Write SYNTHESIZE-PROMPT.md

Read `.plans/approved/shortlist.md` and draft `/Users/mia/.agents/.worktrees/role-to-sop/.plans/SYNTHESIZE-PROMPT.md` — a self-contained prompt for the synthesis workers in Step 8. It should encode the specific context, lenses, output shape, and quality bar for this shortlist, using FORMAT-PROMPT.md and COMPARE-FORMAT-PROMPT.md as structural references for output shape. Then stop and wait for human review before proceeding to Step 8.

### Step 8 (AFK) — Synthesize the portable SOP set

Delegate with `pi-subagents`. For each item in the human-approved shortlist, spawn a worker that:

1. Reads the source file citations from the shortlist
2. Identifies the strongest version of the procedure across those sources
3. Strips persona, role-theater, branding, and repo-local material
4. Applies the prototype-first lens: does the procedure front-load investigation, or front-load planning ceremony? Prefer the version that starts executable.
5. Writes the artifact to the appropriate location within the worktree root (`.worktrees/role-to-sop/`):
   - Skills → `skills/<name>/SKILL.md`
   - Rules → `rules/<name>.md`
   - Subagent prompts → `subagents/<name>.md`

Each synthesized artifact must encode what the procedure does, when to trigger it, the steps or contract, and any quality bar or escalation — without wrapping it in a role or persona.

### Step 9 (HITL) — File a PR and wait for review

Use the `/pr-file` skill to file a pull request from the worktree branch into main. Then stop and wait for human review. Each synthesized skill, rule, and subagent will be reviewed in depth before merge.

## Constraints

- Write only inside `/Users/mia/.agents/.worktrees/role-to-sop` (Step 0 may read from `/Users/mia/.agents/` to copy artifacts into `.references/.agents/`)
- Do not search for additional repos during this phase
- Avoid narrow SOPs for Excel, BI, spreadsheets, PDFs, slides, docx/pptx/xlsx, media generation, or image/video/social workflows — too tool-specific to be portable across repos
- Focus on coding and business workflows: code review, PR review, planning, architecture review, debugging, testing/QA, deployment, security review, retrospectives, release/git workflow, refactoring, documentation/decision workflows
- Delegate aggressively, but review delegated output critically
