# Audit: `antigravity-awesome-skills` → Role-to-SOP Port Candidates

**Audited by:** Worker Ant (role-to-sop colony)
**Date:** 2026-03-28
**Source repo:** `https://github.com/sickn33/antigravity-awesome-skills`
**Source version:** v9.0.0 (1,329 skills, 27,723 GitHub stars as of 2026-03-27)

---

## 1. Repo Overview

`antigravity-awesome-skills` is a community-aggregated library of `SKILL.md` playbooks installable via `npx antigravity-awesome-skills`. It is **not** a first-party Anthropic product — it aggregates official sources (Anthropic, Microsoft, Vercel, Sentry, Supabase) and 30+ community contributors. Skills are plain Markdown files with YAML frontmatter:

```yaml
name: skill-id
description: one-liner
risk: safe | medium | high
source: community | anthropic | sentry | ...
date_added: YYYY-MM-DD
```

**Directory structure:**
```
skills/
  <skill-name>/
    SKILL.md        ← the playbook
CATALOG.md          ← machine-generated index
README.md
```

**9 categories and approximate counts (from CATALOG.md, generated 2026-02-08):**

| Category | Count |
|----------|-------|
| data-ai | 251 |
| architecture | 88 |
| business | 69 |
| development | ~300 (est.) |
| general | ~150 (est.) |
| infrastructure | ~120 (est.) |
| security | ~100 (est.) |
| testing | ~100 (est.) |
| workflow | ~150 (est.) |

**Key finding:** The repo mixes highly-portable universal SOPs, runtime-specific wrappers (Antigravity conductor skills), vendor SDK scripts (200+ Azure skills), persona theatrics (Steve Jobs, Elon Musk), and tool-specific automation (Apify, HubSpot, Canva). Curation is mandatory.

---

## 2. Skill Type Summary

After reading representative samples across all 9 categories, skills fall into five types:

| Type | Description | Port? |
|------|-------------|-------|
| **Universal SOP** | Procedure applies regardless of stack/tool (TDD cycle, debug loop, security audit) | ✅ Yes |
| **Protocol Primitive** | Sub-skill gate or completeness check (clarification gate, DoD gate, issue gate) | ✅ Yes |
| **Architecture Framework** | Structured decision-making (ADR, trade-off eval, simplicity principle) | ✅ Yes |
| **Vendor/Tool Wrapper** | API client for specific SDK (Azure AI, Apify, HubSpot) | ❌ No |
| **Persona Theater** | Role-play identity with no extractable procedure (Steve Jobs, Elon Musk) | ❌ No |
| **Antigravity Runtime** | Depends on Antigravity conductor or remote CATALOG.md URL | ❌ No |
| **Aspirational/Unfinished** | Future roadmap, unverified code, missing implementation | ❌ No |

---

## 3. SOP Port Candidates

### 3.1 Master Port List

Thirteen skills are recommended for porting. Five are flagged as **default ship** (universal enough for any `.agents` directory — see §6).

| # | Skill ID | Source File | Category | Default Ship |
|---|----------|-------------|----------|-------------|
| 1 | `ask-questions-if-underspecified` | `skills/ask-questions-if-underspecified/SKILL.md` | general | ✅ |
| 2 | `brainstorming` | `skills/brainstorming/SKILL.md` | workflow | ✅ |
| 3 | `test-driven-development` | `skills/test-driven-development/SKILL.md` | testing | ✅ |
| 4 | `lint-and-validate` | `skills/lint-and-validate/SKILL.md` | development | ✅ |
| 5 | `debugging-strategies` | `skills/debugging-strategies/SKILL.md` | development | ✅ |
| 6 | `closed-loop-delivery` | `skills/closed-loop-delivery/SKILL.md` | workflow | — |
| 7 | `code-review-excellence` | `skills/code-review-excellence/SKILL.md` | development | — |
| 8 | `codebase-audit-pre-push` | `skills/codebase-audit-pre-push/SKILL.md` | security | — |
| 9 | `security-auditor` | `skills/security-auditor/SKILL.md` | security | — |
| 10 | `api-design-principles` | `skills/api-design-principles/SKILL.md` | architecture | — |
| 11 | `architecture` | `skills/architecture/SKILL.md` | architecture | — |
| 12 | `doc-coauthoring` | `skills/doc-coauthoring/SKILL.md` | workflow | — |
| 13 | `context-compression` | `skills/context-compression/SKILL.md` | general | — |

---

### 3.2 Detailed Port Profiles

---

#### 1. `ask-questions-if-underspecified`

| Field | Value |
|-------|-------|
| **Source** | `skills/ask-questions-if-underspecified/SKILL.md` |
| **Trigger** | Any request that lacks enough detail to proceed without guessing |
| **Core Steps** | 1. Detect ambiguity. 2. Ask 1–5 targeted questions that eliminate whole branches of work. 3. Format as numbered list with multiple-choice options where possible. 4. Include fast-path: "reply `defaults` to accept all recommended choices." 5. Do not proceed until answered. |
| **Quality Bar** | Questions must be answerable in one word or short phrase; never ask for information already in context |
| **Escalation** | If request is ambiguous *and* high-risk, state risk explicitly before proceeding with defaults |
| **What to Strip** | Nothing — fully portable as-is |

**Evidence:** `skills/ask-questions-if-underspecified/SKILL.md` step 2: *"Ask 1-5 questions in the first pass. Prefer questions that eliminate whole branches of work."* Fast-path: *"Include a fast-path response (e.g., reply `defaults` to accept all recommended/default choices)"*

---

#### 2. `brainstorming`

| Field | Value |
|-------|-------|
| **Source** | `skills/brainstorming/SKILL.md` |
| **Trigger** | Any design, feature planning, or architectural decision request |
| **Core Steps** | 1. Restate goal in own words. 2. Ask all clarifying questions (one round). 3. Log assumptions explicitly. 4. **Understanding Lock** — bullet-summarize understanding, wait for explicit user confirmation before proceeding. 5. Generate design options with trade-offs. 6. Present recommendation with rationale. 7. Update Decision Log (what decided / alternatives considered / why). |
| **Quality Bar** | Do not emit design artifacts until Understanding Lock is confirmed. Decision Log must be updated on every session that produces a design choice. |
| **Escalation** | If confirmation is not received within the session, surface the pending lock at next session start |
| **What to Strip** | Remove reference to `multi-agent-brainstorming` handoff (Antigravity-specific conductor skill) |

**Evidence:** `skills/brainstorming/SKILL.md` Understanding Lock section: *"Do NOT proceed until explicit confirmation is given."*

---

#### 3. `test-driven-development`

| Field | Value |
|-------|-------|
| **Source** | `skills/test-driven-development/SKILL.md` |
| **Trigger** | Any task that produces or modifies production code |
| **Core Steps** | 1. Write a failing test that specifies the desired behavior. 2. Confirm the test fails (watch output). 3. Write the minimum production code to make it pass. 4. Confirm the test passes. 5. Refactor while keeping tests green. 6. Run Verification Checklist (8 items) before declaring done. |
| **Quality Bar** | Verification Checklist is mandatory: *"Can't check all boxes? You skipped TDD. Start over."* No production code is written before a failing test exists — Iron Law. |
| **Escalation** | If a test cannot be written (e.g., untestable legacy entrypoint), document the gap explicitly and escalate to human before proceeding |
| **What to Strip** | Remove `@testing-anti-patterns.md` internal resource reference (repo-local file). TypeScript examples are illustrative — note that in SOP |

**Evidence:** `skills/test-driven-development/SKILL.md` Iron Law: *"NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST"*; Verification Checklist: 8-item checklist with hard stop on failure.

---

#### 4. `lint-and-validate`

| Field | Value |
|-------|-------|
| **Source** | `skills/lint-and-validate/SKILL.md` |
| **Trigger** | After every code change, before marking any task complete |
| **Core Steps** | 1. Detect project ecosystem (Node/TS, Python, other). 2. Run lint command for ecosystem. 3. Run type-check command. 4. Run test suite. 5. Block on any failure — do not proceed until clean. |
| **Quality Bar** | Zero warnings tolerated for type errors; lint warnings must be explicitly acknowledged if not fixed |
| **Escalation** | If validation environment is broken (missing deps, misconfigured toolchain), surface to human before writing more code |
| **What to Strip** | Remove `scripts/lint_runner.py` and `scripts/type_coverage.py` references (local helper scripts). Replace with generic ecosystem commands. |

---

#### 5. `debugging-strategies`

| Field | Value |
|-------|-------|
| **Source** | `skills/debugging-strategies/SKILL.md` |
| **Trigger** | Any reported bug, unexpected behavior, or test failure |
| **Core Steps** | 1. Reproduce the failure in isolation. 2. Form hypotheses ranked by likelihood. 3. Binary-search the call stack or data flow. 4. Test one hypothesis at a time. 5. Document findings: root cause, fix, how to prevent recurrence. |
| **Quality Bar** | Never apply a fix without first confirming reproduction. Document root cause even for trivial bugs. |
| **Escalation** | If reproduction requires production data or access, escalate to human rather than guessing |
| **What to Strip** | Remove `resources/implementation-playbook.md` reference (repo-local file) |

---

#### 6. `closed-loop-delivery`

| Field | Value |
|-------|-------|
| **Source** | `skills/closed-loop-delivery/SKILL.md` |
| **Trigger** | Any task that produces a deliverable for human review |
| **Core Steps** | 1. Define DoD (Definition of Done) before starting. 2. Implement. 3. Self-verify against DoD checklist. 4. Run review loop (automated checks). 5. Runtime verification (smoke test or equivalent). 6. Output evidence of completion (test output, diff, log). 7. Human gate — await explicit sign-off. |
| **Quality Bar** | Evidence of completion is mandatory output; tasks are not "done" until evidence is produced and human gate is passed |
| **Escalation** | If DoD cannot be defined (scope unclear), block on `ask-questions-if-underspecified` before starting |
| **What to Strip** | Soften hard dependency on `create-issue-gate` (repo-local coupling) — reference the concept but don't require the specific skill |

**Evidence:** `skills/closed-loop-delivery/SKILL.md` frontmatter: `risk: safe`, `date_added: 2026-03-12`.

---

#### 7. `code-review-excellence`

| Field | Value |
|-------|-------|
| **Source** | `skills/code-review-excellence/SKILL.md` |
| **Trigger** | Any code review request, PR review, or self-review before commit |
| **Core Steps** | 1. Group findings by severity: **Blocking** (must fix before merge), **Important** (should fix), **Minor** (nice to have). 2. For unclear intent, ask a question rather than assuming a bug. 3. Summarize review at top with overall verdict and count by severity. |
| **Quality Bar** | At least one Blocking comment must be addressed before approval. Minor comments do not block merge. |
| **Escalation** | If unclear whether an issue is Blocking or Important, default to Important and note the ambiguity |
| **What to Strip** | Remove `resources/implementation-playbook.md` reference (repo-local file) |

---

#### 8. `codebase-audit-pre-push`

| Field | Value |
|-------|-------|
| **Source** | `skills/codebase-audit-pre-push/SKILL.md` |
| **Trigger** | Before any `git push` or PR creation |
| **Core Steps** | 1. **Secrets check** — scan for `.env`, hardcoded keys, tokens, credentials (critical). 2. Junk files check — remove `*.log`, `*.tmp`, editor artifacts. 3. Dead code audit. 4. Security scan (known vulnerable patterns). 5. Scalability check. 6. Architecture consistency. 7. Performance hot-paths. 8. Documentation currency. 9. Test coverage. 10. Final verification run. Output structured report. |
| **Quality Bar** | Step 1 (secrets) is a hard block — do not push if any credential pattern is found. |
| **Escalation** | Any secrets found: stop immediately, alert human, do not commit or push |
| **What to Strip** | Nothing significant; remove any Antigravity-branded output format references if present |

**Evidence:** `skills/codebase-audit-pre-push/SKILL.md` step 1: "Critical - Check for secrets" with file patterns.

---

#### 9. `security-auditor`

| Field | Value |
|-------|-------|
| **Source** | `skills/security-auditor/SKILL.md` |
| **Trigger** | Security review request, threat modeling session, pre-release security check |
| **Core Steps** | 1. **Scope confirmation** — written/explicit scope before any intrusive test. 2. Threat model — identify assets, trust boundaries, attack surface. 3. Automated scan — SAST, dependency audit, secrets detection. 4. Prioritize findings by CVSS or equivalent severity. 5. Validate fixes — confirm each finding is resolved before closing. |
| **Quality Bar** | No intrusive tests without written approval. All High/Critical findings must be resolved or formally accepted before release. |
| **Escalation** | Any Critical finding: escalate to human immediately; do not proceed with deployment |
| **What to Strip** | Strip the 9-section "Capabilities" inventory (persona framing: *"You are a security auditor specializing in DevSecOps..."*) — keep only the 5-step procedure and Safety note |

**Evidence:** `skills/security-auditor/SKILL.md` Safety note: *"Do not run intrusive tests in production without written approval"*

---

#### 10. `api-design-principles`

| Field | Value |
|-------|-------|
| **Source** | `skills/api-design-principles/SKILL.md` |
| **Trigger** | Any API surface design (REST, RPC, GraphQL, SDK) |
| **Core Steps** | 1. **Consumer-first** — write the client call before the server implementation. 2. Define contract (request/response schema, error codes). 3. Review for consistency with existing API conventions. 4. Validate against non-happy-path scenarios. |
| **Quality Bar** | Consumer-first proof required — show the calling code before the server code |
| **Escalation** | If existing API conventions are unclear, clarify before designing |
| **What to Strip** | Remove `resources/implementation-playbook.md` reference (repo-local file) |

---

#### 11. `architecture`

| Field | Value |
|-------|-------|
| **Source** | `skills/architecture/SKILL.md` |
| **Trigger** | Any architectural decision that cannot be easily reversed |
| **Core Steps** | 1. Define the problem statement and constraints. 2. Read existing ADRs selectively (only relevant ones). 3. Generate 2–3 options with trade-offs. 4. Apply simplicity principle — prefer the option that reduces complexity. 5. Pre-finalization checklist before committing. 6. Record decision as new ADR: title, status, context, decision, consequences. |
| **Quality Bar** | Every irreversible architectural decision must produce a new ADR entry |
| **Escalation** | If simplest option conflicts with a constraint, surface the conflict to human before deciding |
| **What to Strip** | Remove internal `@[skills/...]` cross-references (repo-local links) |

---

#### 12. `doc-coauthoring`

| Field | Value |
|-------|-------|
| **Source** | `skills/doc-coauthoring/SKILL.md` |
| **Trigger** | Any documentation writing or major documentation revision request |
| **Core Steps** | 1. **Context gathering** — audience, purpose, scope, existing docs. 2. **Section-by-section drafting** — draft one section, confirm with author before next. 3. **Reader testing** — simulate target reader via sub-agent or checklist: can they follow the doc without additional help? |
| **Quality Bar** | Reader test is mandatory before final delivery. Each section confirmed before moving to next. |
| **Escalation** | If audience is unclear after one clarifying question, default to "technical practitioner" and note assumption |
| **What to Strip** | Remove Claude.ai sub-agent URL links. Remove Slack/Teams/Google Drive connector references (tool-specific delivery paths). |

**Evidence:** `skills/doc-coauthoring/SKILL.md` Stage 3: reader-testing via sub-agent — novel quality bar not common in prompt libraries.

---

#### 13. `context-compression`

| Field | Value |
|-------|-------|
| **Source** | `skills/context-compression/SKILL.md` |
| **Trigger** | Long-running session approaching context limit, or task handoff between agents |
| **Core Steps** | 1. Produce structured summary: Session Intent / Files Modified / Decisions Made / Current State / Next Steps. 2. Measure tokens-per-task (total tokens from start to completion, not per-request). 3. Apply probe-based evaluation: run Recall / Artifact / Continuation / Decision probes against the summary. 4. Iterate compression until all probes pass. |
| **Quality Bar** | All four probe types must pass before handoff summary is accepted |
| **Escalation** | If probe fails after two compression iterations, escalate to human for manual distillation |
| **What to Strip** | Remove external hard citations to Netflix Engineering / Factory Research blog posts (reference concepts, not URLs) |

**Evidence:** `skills/context-compression/SKILL.md` Tokens-Per-Task: *"The right metric is tokens-per-task: total tokens consumed from task start to completion"*; Probe-Based Evaluation: 4 probe types (Recall, Artifact, Continuation, Decision).

---

## 4. Non-Candidates

The following skill categories are explicitly **excluded** from porting:

### 4.1 Persona Theater (no extractable procedure)

| Skill | Reason |
|-------|--------|
| `steve-jobs` | Pure role-play identity; zero procedural steps |
| `warren-buffett` | Persona framing only; investment philosophy, not agentic SOP |
| `bill-gates` | Role-play identity; no reusable procedure |
| `elon-musk` | Persona framing only |
| `andrej-karpathy` | Persona framing only |
| `nerdzao-elite` | Community persona / in-joke; no procedure |

**Pattern:** These skills instruct the agent to *be* someone rather than *do* something. They cannot be expressed as trigger → steps → quality bar.

---

### 4.2 Antigravity Runtime Coupling

| Skill | Reason |
|-------|--------|
| `antigravity-skill-orchestrator` | Hardcodes `https://raw.githubusercontent.com/sickn33/antigravity-awesome-skills/main/CATALOG.md` — depends on live remote repo URL |
| `conductor-*` (all) | Antigravity session conductor skills; depend on Antigravity runtime internals |
| `antigravity-design-expert` | References Antigravity-specific session management |
| `antigravity-workflows` | Antigravity pipeline runner; not portable |

**Evidence:** `skills/antigravity-skill-orchestrator/SKILL.md` line ~50: `https://raw.githubusercontent.com/sickn33/antigravity-awesome-skills/main/CATALOG.md`

---

### 4.3 Vendor / SDK Wrappers

| Skill Group | Count (approx.) | Reason |
|-------------|-----------------|--------|
| `azure-ai-*`, `azure-cosmos-*`, `azure-eventhub-*`, etc. | ~200 | Thin wrappers over specific Azure SDK calls; not generalizable |
| `apify-*` | ~15 | Apify actor execution scripts; platform-specific |
| `activecampaign-automation` | 1 | CRM vendor-specific |
| `bamboohr-automation` | 1 | HR SaaS vendor-specific |
| `calendly-automation` | 1 | Scheduling SaaS vendor-specific |
| `hubspot-*` | ~5 | CRM vendor-specific |
| `brevo-automation` | 1 | Email marketing vendor-specific |
| `docusign-automation` | 1 | E-signature vendor-specific |
| `canva-automation` | 1 | Design tool vendor-specific |

**Pattern:** These skills are wrappers over specific tool APIs. Porting them would create maintenance burden as API contracts change.

---

### 4.4 Media / Social / SEO Workflows

| Skill | Reason |
|-------|--------|
| `social-content` | Social media post generation; not code/engineering SOP |
| `screenshots` | Browser screenshot automation; tool-specific |
| `seo-image-gen` | Image generation SEO workflow |
| `seo-images` | Image SEO metadata workflow |
| `ai-studio-image` | Google AI Studio image generation |

---

### 4.5 Jurisdiction-Specific Legal

| Skill | Reason |
|-------|--------|
| `advogado-criminal` | Brazilian criminal law; Portuguese-language, jurisdiction-specific |
| `advogado-especialista` | Brazilian specialist lawyer persona |
| `leiloeiro-juridico` | Brazilian judicial auction specialist |

---

### 4.6 Aspirational / Unfinished

| Skill | Reason |
|-------|--------|
| `context-management-context-save` | Future roadmap listed in skill body; vector DB specifics unverified; not production-ready; overlaps poorly with `context-compression` |
| `create-pr` | Alias-only stub pointing to `sentry-skills:pr-writer`; no self-contained procedure |

---

### 4.7 Offensive Security Only

| Skill | Reason |
|-------|--------|
| `active-directory-attacks` | Offensive attack scripts; not audit procedure |
| `api-fuzzing-bug-bounty` | Bug bounty attack workflow; not defensive SOP |
| `anti-reversing-techniques` | Binary anti-analysis; narrow offensive use |

---

### 4.8 Branding / Product-Specific

| Skill | Reason |
|-------|--------|
| `brand-guidelines` | Sentry-specific brand voice |
| `auri-core` | Vitoria Neural product persona (AWS stack specific) |

---

## 5. Cross-Cutting Protocol Primitives

These are sub-skill-level patterns that appear across multiple ported SOPs. They should be extracted as shared rules in `.agents/` rather than buried per-skill:

| Primitive | Source Skill | What It Does |
|-----------|-------------|--------------|
| **Completeness Gate** | `ask-questions-if-underspecified` | Before any task: is the request specced enough to act without guessing? |
| **Understanding Lock** | `brainstorming` | Before any design: summarize understanding in bullets, await explicit confirmation |
| **Decision Log** | `brainstorming` | Running log: what was decided / alternatives considered / why chosen |
| **Iron Law** | `test-driven-development` | No production code before a failing test exists |
| **Verification Checklist** | `test-driven-development` | 8-item checklist; cannot be skipped or partially satisfied |
| **Mandatory Quality Loop** | `lint-and-validate` | Run validation after every code change; block on failures |
| **Pre-Commit Secrets Check** | `codebase-audit-pre-push` | Scan for `.env`, hardcoded credentials before any push |
| **Severity Triage** | `code-review-excellence` | Blocking / Important / Minor classification for all review comments |
| **Scope Confirmation** | `security-auditor` | Written approval required before intrusive tests |
| **Definition of Done Gate** | `closed-loop-delivery` | DoD must be defined before work starts; evidence required at completion |
| **Probe-Based Evaluation** | `context-compression` | 4 probe types (Recall, Artifact, Continuation, Decision) verify compression quality |
| **Tokens-Per-Task Metric** | `context-compression` | Optimize total session cost, not per-request cost |
| **Structured Handoff Summary** | `context-compression` | Session Intent / Files Modified / Decisions Made / Current State / Next Steps |

---

## 6. Default `.agents` Ship Recommendation

These 5 skills provide universal coverage for any software project and should ship by default in any `.agents/` directory:

| Priority | Skill | Why Default |
|----------|-------|-------------|
| 1 | `ask-questions-if-underspecified` | Prevents wrong work from starting; lowest cost intervention |
| 2 | `brainstorming` | Design-before-implement gate; prevents premature coding |
| 3 | `test-driven-development` | Enforces quality at the unit level on every code task |
| 4 | `lint-and-validate` | Post-change quality gate; prevents broken state accumulation |
| 5 | `debugging-strategies` | Systematic troubleshooting; prevents random fix attempts |

The remaining 8 skills are **opt-in** based on project type:
- Security-focused projects: add `security-auditor` + `codebase-audit-pre-push`
- API/service projects: add `api-design-principles`
- Documentation-heavy projects: add `doc-coauthoring`
- Long-running multi-session projects: add `context-compression`
- Architecture-decision-heavy projects: add `architecture`
- Multi-contributor or PR workflow: add `code-review-excellence`
- Delivery-gate workflows: add `closed-loop-delivery`

---

## 7. Evidence Summary

All claims in this audit are grounded in direct file reads:

1. **`README.md` line 1:** `<!-- registry-sync: version=9.0.0; skills=1329; stars=27723; updated_at=2026-03-27T09:52:22+00:00 -->` — confirms scale and community aggregation model
2. **`README.md` line 2:** *"Antigravity Awesome Skills is a GitHub repository and installer CLI for reusable SKILL.md playbooks"* — confirms this is not first-party Anthropic procedures
3. **`skills/brainstorming/SKILL.md`** Understanding Lock: *"Do NOT proceed until explicit confirmation is given."* — hard gate, not advice
4. **`skills/test-driven-development/SKILL.md`** Iron Law: *"NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST"* — enforceable rule
5. **`skills/test-driven-development/SKILL.md`** Verification Checklist: *"Can't check all boxes? You skipped TDD. Start over."* — hard stop on partial compliance
6. **`skills/ask-questions-if-underspecified/SKILL.md`** step 2: *"Ask 1-5 questions in the first pass. Prefer questions that eliminate whole branches of work."*
7. **`skills/ask-questions-if-underspecified/SKILL.md`** fast-path: *"Include a fast-path response (e.g., reply `defaults` to accept all recommended/default choices)"*
8. **`skills/context-compression/SKILL.md`** Tokens-Per-Task: *"The right metric is tokens-per-task: total tokens consumed from task start to completion"*
9. **`skills/context-compression/SKILL.md`** Probe-Based Evaluation table: 4 probe types — Recall, Artifact, Continuation, Decision
10. **`skills/codebase-audit-pre-push/SKILL.md`** step 1: "Critical - Check for secrets" with file patterns — hard block before push
11. **`skills/security-auditor/SKILL.md`** Safety note: *"Do not run intrusive tests in production without written approval"* — explicit escalation trigger
12. **`skills/doc-coauthoring/SKILL.md`** Stage 3: reader-testing via sub-agent — novel quality bar not found in typical prompt libraries
13. **`skills/closed-loop-delivery/SKILL.md`** frontmatter: `risk: safe`, `date_added: 2026-03-12`
14. **`skills/antigravity-skill-orchestrator/SKILL.md`** line ~50: `https://raw.githubusercontent.com/sickn33/antigravity-awesome-skills/main/CATALOG.md` — confirms repo-local coupling, disqualifies for port
15. **`skills/create-pr/SKILL.md`**: alias pointing to `sentry-skills:pr-writer` — confirms Sentry-branded content embedded; disqualifies as standalone SOP
16. **`CATALOG.md`** header: `Generated at: 2026-02-08T00:00:00.000Z` with `architecture (88)`, `data-ai (251)` — confirms machine-generated index structure

---

## 8. Port Action Plan

Recommended execution order for porting:

```
Phase 1 (default ship — highest ROI):
  1. ask-questions-if-underspecified   → .agents/sops/clarification-gate.md
  2. brainstorming                     → .agents/sops/design-gate.md
  3. test-driven-development           → .agents/sops/tdd-protocol.md
  4. lint-and-validate                 → .agents/sops/quality-gate.md
  5. debugging-strategies              → .agents/sops/debug-protocol.md

Phase 2 (security + code quality):
  6. codebase-audit-pre-push           → .agents/sops/pre-push-audit.md
  7. security-auditor                  → .agents/sops/security-audit.md
  8. code-review-excellence            → .agents/sops/code-review.md
  9. closed-loop-delivery              → .agents/sops/delivery-gate.md

Phase 3 (architecture + documentation):
 10. architecture                      → .agents/sops/architecture-decisions.md
 11. api-design-principles             → .agents/sops/api-design.md
 12. doc-coauthoring                   → .agents/sops/doc-writing.md
 13. context-compression               → .agents/sops/context-handoff.md
```

Each ported file should:
- Retain the trigger / steps / quality bar / escalation structure from §3.2
- Strip items listed in "What to Strip" column
- Add a `source:` comment linking back to the original `SKILL.md` path
- Remove YAML frontmatter (replace with H1 + one-line description in Markdown)
