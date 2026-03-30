## AGENTS.md

**Type**: Repository README / skill catalogue  
**Portable**: Partially — the safety-guard patterns (careful, freeze, guard/unfreeze) and the pre-landing PR review + debug workflow are portable; the full skill roster is gstack-specific infrastructure  
**Reason**: Most of the file is a directory of slash-commands that only make sense when the gstack binary and `.agents/skills/` tree are present. However, the underlying *patterns* encoded in several skills (safety checks before destructive ops, root-cause-before-fix debugging, design-rating rubrics, post-ship doc sync) are strong portable SOPs.  
**Trigger**: Agent is about to run a destructive command (rm -rf, DROP TABLE, force-push); agent is asked to debug; agent is landing a PR; agent is reviewing a design; agent has just shipped and needs to update docs  
**Steps/contract**:  
  - `/careful` — confirm before any destructive shell command; never run without acknowledgement  
  - `/debug` — investigate and establish root cause before proposing or applying any fix  
  - `/review` — pre-merge PR review targeting prod-breaking bugs that CI misses  
  - `/document-release` — after every ship, update all docs to match the released state  
  - `/plan-design-review` — rate each design dimension 0–10, explain what a 10 looks like  
**Strip**: gstack binary references (`$B`, `bun run gen:skill-docs`, `skill:check`), `/browse` and cookie-import commands, `/gstack-upgrade`, `/retro` (team-specific), `/freeze`/`/unfreeze` directory-locking (implementation-specific)  
**Structure/format**: Markdown table of slash-commands + build-command code block + prose conventions; README style, not a standalone SOP  
**Notes**: The safety-guard cluster (careful/freeze/guard) is the most portable distillation here — it captures "warn before destructive, hard-block on protected paths" as two composable primitives. The debug SOP ("no fixes without investigation") and the post-ship doc-sync SOP are both clean, repo-agnostic rules worth extracting individually.
## gstack/SKILL.md

**Type**: Skill — headless-browser QA/dogfooding toolkit wrapping a compiled `browse` binary (`$B`). Ships a heavyweight preamble (update-check, session tracking, telemetry opt-in flow, "Boil the Lake" intro, proactive-behavior prompt) that must run before any browse work begins.

**Portable**: No. The skill is tightly coupled to a local binary (`~/.claude/skills/gstack/browse/dist/browse`), a suite of companion binaries under `~/.claude/skills/gstack/bin/`, per-user state files under `~/.gstack/`, and a one-time `./setup` build step. It cannot be dropped into an arbitrary repo without that installation tree.

**Reason**: Binary dependency + install path assumptions + user-state sidecar files make this non-portable as written. The *workflow patterns* it encodes (navigate → snapshot → assert → diff → screenshot → log console errors) are genuinely portable SOPs, but the skill file itself is an installation wrapper, not a reusable procedure.

**Trigger**: User asks to "open or test a site", "verify a deployment", "dogfood a user flow", or "file a bug with screenshots". Also triggers proactively when conversation context matches QA/ship/debug stages (if proactive mode is on).

**Steps/contract**:
1. Preamble bash block — update-check, session touch, config reads, telemetry logging.
2. Conditional onboarding flows (lake intro, telemetry consent, proactive-behavior consent) — each fires at most once via sentinel files.
3. Browse-binary setup check — confirms `$B` resolves; if not, prompts user and runs `./setup`.
4. QA workflow execution — `goto` → `snapshot -i` → interact via `@e` refs → `snapshot -D` → assertions → `screenshot` → `console`.
5. Telemetry footer — logs duration + outcome in background after workflow completes.
6. Plan-mode footer — reads review state and appends `## GSTACK REVIEW REPORT` to plan file.

**Strip**: The entire preamble (update-check, session tracking, telemetry, lake intro, proactive prompting, contributor-mode logging, plan-status footer, telemetry footer) is installation/product machinery. A portable SOP should strip all of this. The voice/tone block and completion-status protocol (`DONE` / `DONE_WITH_CONCERNS` / `BLOCKED` / `NEEDS_CONTEXT` + escalation after 3 failures) are genuinely reusable and worth keeping.

**Structure/format**: Long single-file skill. Preamble bash block → prose conditional logic → Voice section → Contributor Mode → Completion Status Protocol → Telemetry section → Plan Status Footer → main browse reference (Setup, Workflows, Quick Assertion Patterns, Snapshot System, Command Reference, Tips). Well-organized but heavily interleaved with product-specific scaffolding.

**Notes**: The portable gold is the *QA workflow patterns*: snapshot-first interaction model (`snapshot -i` → `@e` refs → `snapshot -D`), assertion vocabulary (`is visible/enabled/checked`), evidence capture (annotated screenshots), multi-step chain batching, and the completion-status protocol with explicit escalation rules. The headless-browser command reference is specific to the `browse` binary API and not reusable verbatim, but the *approach* (navigate → read → interact → diff → assert → capture) translates cleanly to any browser-automation tool (Playwright, Puppeteer, etc.). The escalation rule ("attempt ≤ 3 times, then STOP") and the evidence-first bug-filing pattern are strong portable SOPs on their own.

## ETHOS.md

**Type**: Philosophical ethos — two named engineering principles: *Boil the Lake* (prefer completeness when marginal cost is near-zero) and *Search Before Building* (research-first with a three-layer knowledge model: tried-and-true → current best practices → first principles).

**Portable**: Yes — both principles are entirely org-agnostic and apply to any AI-assisted engineering context.

**Reason**: The principles encode durable heuristics that shift how agents and engineers reason about cost, completeness, and research. No gstack tooling, infrastructure, or cultural specifics are required to apply them.

**Trigger**: Fire when an agent is about to (a) cut a shortcut on implementation, defer tests, or leave edge cases unhandled, or (b) start building something without first checking whether a solution already exists.

**Steps/contract**:
- *Boil the Lake*: (1) Identify whether the scope is a lake (boilable) or ocean (out of scope). (2) When complete vs. 90% implementations differ only by small LOC, choose complete. (3) Recalibrate time estimates using AI compression ratios (boilerplate ~100x, tests ~50x, features ~30x). (4) Treat test-deferral and "ship the shortcut" as explicit anti-patterns.
- *Search Before Building*: (1) Layer 1 — verify tried-and-true patterns; question premises even for obvious answers. (2) Layer 2 — search current best practices; treat results as inputs, not answers (crowd can be wrong). (3) Layer 3 — derive first-principles observations specific to the problem; prize these above all. (4) Seek the Eureka Moment: understand the landscape, find where conventional wisdom is wrong, name and build on it.

**Strip**: "Build for Yourself" section (founder/personal motivation — not portable). The `garryslist.org` URL can be stripped. The AI compression-ratio table is worth retaining as a calibration anchor.

**Structure/format**: Two clearly-named top-level principles, each with a definition, anti-pattern list, and summary synthesis. Clean heading hierarchy; injects well as a preamble block or standing rule.

**Notes**: "Boil the Lake" is unusually strong because it reframes completeness as *cheap* rather than aspirational — this directly counters the agent tendency to defer quality. The three-layer knowledge model in "Search Before Building" is one of the most well-structured research heuristics seen across the reference set; it distinguishes *when* to trust existing knowledge vs. when to challenge it, which most SOPs conflate.
## File: `CLAUDE.md`

**Type**: Mixed — project-specific command reference + several portable policy sections (file self-annotates sections with `> Core policy: keep` vs `> Optional wrapper:`)

**Portable**: Yes — multiple distinct portable SOPs embedded; project-specific scaffolding (commands, paths, binaries, browser tooling) must be stripped

**Reason**: The file contains five independently portable SOPs: (1) platform-agnostic config reading, (2) generated-file merge conflict resolution, (3) single-logical-change commit discipline ("bisect commits"), (4) branch-scoped CHANGELOG authoring style, and (5) two-tier CI test classification (gate vs periodic). Each is self-contained and repo-agnostic once project names are removed.

**Trigger**:
- Config reading SOP → agent needs project-specific commands (test, deploy, eval) and no hardcoded fallback
- Generated-file merge SOP → repo has generated docs/files (SKILL.md, code-gen output, etc.)
- Commit bisection SOP → any commit workflow; especially before push/PR
- CHANGELOG style SOP → writing release notes or a changelog entry
- Test-tier classification SOP → classifying new tests or setting up CI tiering

**Steps/contract**:
- *Config reading*: (1) Read CLAUDE.md for project config. (2) If missing, AskUserQuestion. (3) Persist answer to CLAUDE.md.
- *Generated-file merge*: (1) Resolve conflicts on source templates / generator scripts only. (2) Re-run generator. (3) Stage regenerated output. Never accept either side of a conflict on a generated file directly.
- *Commit bisection*: Each commit = one logical change. Separates: renames, behavior changes, test infra, template changes, generated regeneration, mechanical refactors, new features.
- *CHANGELOG authoring*: Branch-scoped entry written at ship time. Lead with user capability ("you can now…"). No internal tracking, eval infra, or jargon. Contributor notes in a separate bottom section.
- *Test-tier classification*: Safety guardrails / deterministic functional → `gate` (blocks merge). Quality benchmarks / non-deterministic / external services → `periodic` (weekly cron or manual).

**Strip**:
- All gstack-specific commands (`bun run test:evals`, `bun run gen:skill-docs`, `eval:select`, etc.)
- `browse/`, `gstack/` directory structure and binary policy
- Vendored symlink section
- Browser interaction section (`/browse` skill, `$B` binary)
- SKILL.md template authoring rules (gstack-specific prompt-template conventions — partially portable but tightly coupled to their template pipeline)
- AI effort compression section (voice/philosophy, not actionable policy)
- All `> Optional wrapper:` annotated sections

**Structure/format**: Long single-file reference doc with H2 sections. Inline self-annotation (`> Core policy:` / `> Optional wrapper:`) makes portable sections easy to identify. Extracted SOPs would each be short (4–8 steps); suitable for individual skill files or a combined "dev-workflow" skill with named subsections.

**Notes**: The inline `> Core policy: keep` / `> Optional wrapper:` annotations are unusually explicit — they were written with portability in mind. The commit-bisection and CHANGELOG sections are the strongest candidates: clear trigger, unambiguous steps, zero project-specific vocabulary after stripping. The config-reading SOP is also strong but assumes a CLAUDE.md convention that may not exist in target repos (generalize to "project config file").

## check-careful.sh

**Type**: PreToolUse hook script (bash) — reads JSON from stdin, pattern-matches the `command` field, emits a Claude Code `permissionDecision:"ask"` response for destructive commands or `{}` to allow.

**Portable**: Yes — the logic is pure bash + optional python3 fallback; no gstack-specific runtime deps beyond a writable `~/.gstack/analytics/` for optional telemetry. The telemetry block is a soft side-effect (`|| true` throughout) and can be stripped without breaking the hook.

**Reason**: Captures a well-defined, reusable SOP: *intercept destructive shell commands before execution and surface a human confirmation prompt*. The pattern list (rm -rf, DROP TABLE, TRUNCATE, git force-push, git reset --hard, git checkout/restore ., kubectl delete, docker rm -f / system prune) is broadly applicable across any engineering repo. The safe-exception allowlist (node_modules, .next, dist, __pycache__, .cache, build, .turbo, coverage) is a practical, considered carve-out that would recur in any similar policy.

**Trigger**: Any session where a PreToolUse hook should guard against irreversible bash commands — especially AI-assisted coding sessions where `Bash` tool calls are frequent and recovery from accidental deletion/force-push is expensive.

**Steps/contract**:
1. Read full stdin JSON; extract `tool_input.command` via grep/sed, with python3 fallback.
2. If extraction fails, emit `{}` (allow) — fail open by design.
3. Lowercase the command for case-insensitive SQL matching.
4. Apply safe-exception pass: recursive `rm` targeting known build artifact paths exits early with `{}`.
5. Sequentially test destructive patterns (rm -r, DROP TABLE/DATABASE, TRUNCATE, git force-push, git reset --hard, git checkout/restore ., kubectl delete, docker rm -f / system prune) — first match wins.
6. On match: optionally log `{event,skill,pattern,ts,repo}` to `~/.gstack/analytics/skill-usage.jsonl`; emit `{"permissionDecision":"ask","message":"[careful] <reason>"}`.
7. On no match: emit `{}`.

**Strip**: Remove the analytics block (lines writing to `~/.gstack/analytics/`) — it is gstack-proprietary telemetry and adds no SOP value. The `[careful]` prefix in the message can be renamed to match the adopting skill name.

**Structure/format**: Single self-contained bash script; ~110 lines. Relies solely on POSIX tools (grep, sed, tr, printf, date, git rev-parse) with a python3 soft-fallback. Compatible with any Claude Code `PreToolUse` hook configuration. No config files or external state required (analytics path is created on demand).

**Notes**: The safe-exception logic uses a simple `for target in $RM_ARGS` word-split, which can misfire on paths with spaces (a known limitation). A portable SOP version should note this and suggest quoting or a python3-only implementation for robustness. Pattern matching is intentionally conservative (first-match-wins, no combined-flag handling) — promotes explicit user confirmation over silent allowance, which aligns with a "careful by default" policy posture.
## careful/SKILL.md

**Type**: Skill — session-scoped safety guardrail that intercepts Bash tool calls and warns before any destructive command; user can override each warning.

**Portable**: Yes — the protected-pattern list and "warn + user override" model are entirely repo- and toolchain-agnostic.

**Reason**: No dependency on gstack binaries or state files beyond a single shell script (`bin/check-careful.sh`) that checks command text against a fixed pattern list. The declarative table of protected patterns (rm -rf, DROP TABLE, force-push, git reset --hard, kubectl delete, docker prune) and the safe-exception allowlist (node_modules, dist, .next, etc.) are clean, universally applicable rules that can be implemented with any hook mechanism.

**Trigger**: User says "be careful", "safety mode", "prod mode", or "careful mode"; or agent is about to operate on a production or shared environment.

**Steps/contract**:
1. On every Bash command, run pattern-match against the protected list.
2. If a match is found, surface a warning and halt pending user acknowledgement (`permissionDecision: "ask"`).
3. Apply safe-exception allowlist before warning (build artifact dirs are never blocked).
4. User may override each warning; no hard block — consent is required, not prevention.
5. Guardrail is session-scoped; it deactivates automatically when the session ends.

**Strip**: Analytics/telemetry bash block (`~/.gstack/analytics/skill-usage.jsonl`), `<!-- AUTO-GENERATED from SKILL.md.tmpl -->` comment, `bun run gen:skill-docs` reference, `${CLAUDE_SKILL_DIR}` path token (replace with implementation-neutral language).

**Structure/format**: Frontmatter (name, version, description, hooks declaration) + Markdown body with a protected-patterns table, safe-exceptions list, and mechanism explanation. Compact and well-structured; the table is reusable verbatim in any SOP.

**Notes**: This is the strongest single-file implementation of the "warn before destructive" SOP in the reference set. The protected-pattern table is comprehensive and immediately actionable. The safe-exception list (build artifact dirs) prevents alert fatigue — a detail most ad-hoc guardrail rules omit. The `permissionDecision: "ask"` model (warn + override, never hard-block) is the right default for a developer-facing tool. The companion `AGENTS.md` entry already flagged this cluster as high-value; this file is the concrete implementation worth promoting.
## File: `investigate/SKILL.md`

**Type**: Debugging skill — systematic 5-phase root-cause investigation workflow (investigate → analyze → hypothesize → implement → verify) wrapped in the standard gstack preamble/telemetry machinery.

**Portable**: Yes — highly portable. The core debugging methodology is entirely repo-agnostic. The Iron Law ("no fixes without root cause investigation first"), the 3-phase hypothesis cycle, the blast-radius check, and the DEBUG REPORT template are all clean, transferable primitives.

**Reason**: The skill decomposes into two clearly separable layers: (1) gstack product scaffolding (preamble, telemetry, contributor mode, scope-lock binary, plan-status footer, voice persona) and (2) a universal debugging protocol that would apply equally in any language, framework, or org. The core protocol has no gstack dependencies once the scaffolding is stripped.

**Trigger**: User says "debug this", "fix this bug", "why is this broken", "investigate this error", or "root cause analysis". Also fires proactively when user reports errors, unexpected behavior, or asks why something stopped working.

**Steps/contract**:
1. *Phase 1 — Investigate*: Collect symptoms from error messages and stack traces. Trace the code path from symptom to cause. Check `git log --oneline -20` on affected files for regressions. Reproduce deterministically before forming any hypothesis. Output: explicit "Root cause hypothesis: …" statement.
2. *Scope Lock*: Identify narrowest affected directory; restrict edits to that subtree for the session to prevent scope creep.
3. *Phase 2 — Pattern Analysis*: Match against known patterns (race condition, nil/null propagation, state corruption, integration failure, config drift, stale cache). Check TODOS.md and git log for recurrence — recurring bugs in same files = architectural smell. Sanitize then WebSearch if no pattern matches.
4. *Phase 3 — Hypothesis Testing*: Add temporary log/assertion at suspected root cause; run reproduction. If hypothesis fails, sanitize error and search before forming next. 3-strike rule: after 3 failed hypotheses, stop and AskUserQuestion with three options (continue/escalate/instrument).
5. *Phase 4 — Implementation*: Fix root cause, not symptom. Minimal diff (fewest files, fewest lines). Write regression test that fails without the fix and passes with it. Run full test suite. If fix touches >5 files, AskUserQuestion about blast radius before proceeding.
6. *Phase 5 — Verification and Report*: Reproduce original scenario to confirm fix. Paste full test output. Emit structured DEBUG REPORT: symptom / root cause / fix (file:line) / evidence / regression test / related notes / status.

**Strip**: Entire preamble bash block (update-check, session tracking, telemetry logging, lake intro, proactive-behavior consent, contributor mode, plan-status footer, telemetry footer); Voice/persona section; AskUserQuestion multi-step format (gstack-specific framing); Scope Lock's `check-freeze.sh` binary check (keep the concept — freeze edits to affected module — but remove the binary dependency); Completeness Principle effort table (gstack product copy, not debugging methodology); completion-status enum (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT) is portable and worth keeping.

**Structure/format**: H2-headed phases with embedded bash snippets, a pattern-matching table, red-flag list, and a fenced DEBUG REPORT template. Five-phase structure maps directly to a standalone SOP. The DEBUG REPORT block is immediately reusable as-is.

**Notes**: The Iron Law is the single strongest extractable principle — it directly counters the agent default of applying quick symptomatic fixes. The 3-strike escalation rule and blast-radius check (>5 files → pause) are concrete, action-triggering guardrails that are rare in reference skills. The pattern analysis table (six named patterns with signatures and where-to-look columns) is a solid reusable reference. The regression-test requirement ("must fail without fix, must pass with fix") is a clean quality gate. Overall this is one of the strongest portable SOP candidates in the gstack set: the core protocol is already well-structured, the scaffolding is cleanly separable, and the output format (DEBUG REPORT) gives the SOP a concrete deliverable.

## File: `review/SKILL.md`

**Type**: Skill — pre-landing PR code review. Multi-pass workflow: scope drift detection, plan completion audit, two-pass checklist review (CRITICAL / INFORMATIONAL), test coverage diagram, fix-first resolution, and auto-scaled adversarial review via subagent or Codex CLI.

**Portable**: Yes — the review workflow itself is entirely repo-agnostic once gstack infrastructure is stripped. Six independently extractable SOPs are embedded in this single file.

**Reason**: The core review patterns (scope drift detection, plan-vs-diff cross-reference, two-pass severity classification, code-path + user-flow coverage diagram, fix-first heuristic, diff-size-scaled adversarial pass) require no gstack tooling. What is gstack-specific is the preamble machinery, telemetry, Greptile integration, Codex CLI calls, and companion-binary references — all strippable without loss of the workflow logic.

**Trigger**: "review this PR", "code review", "pre-landing review", "check my diff"; proactively when user is about to merge or land changes.

**Steps/contract** (gstack machinery stripped):
  1. **Base branch detection** — platform-aware: `gh pr view` → `gh repo view` → `glab mr view` → `glab repo view` → `git symbolic-ref` → hardcoded `main`/`master` fallback.
  2. **Diff guard** — if on base branch or no diff, stop with a clear message.
  3. **Scope drift detection** — read TODOS.md + PR description + commit log; identify stated intent; compare against `git diff --stat`; classify as CLEAN / DRIFT DETECTED / REQUIREMENTS MISSING (informational, never blocks).
  4. **Plan completion audit** — locate plan file (conversation context → content-based search); extract actionable items (checkboxes, imperatives, file specs, test requirements); cross-reference each against diff as DONE / PARTIAL / NOT DONE / CHANGED; feed NOT DONE items into scope drift as missing requirements evidence.
  5. **Read checklist** — repo-local `review/checklist.md`; hard stop if unreadable.
  6. **Full diff fetch** — `git fetch origin <base> --quiet && git diff origin/<base>`.
  7. **Two-pass review** — Pass 1 CRITICAL (SQL/data safety, race conditions, LLM trust boundary, enum completeness — requires reading code outside the diff for enum coverage). Pass 2 INFORMATIONAL (conditional side effects, magic numbers, dead code, prompt issues, test gaps, frontend, performance).
  8. **Design review** (conditional) — only if diff touches frontend files; uses repo `DESIGN.md` or universal principles; classifies findings as AUTO-FIX (mechanical CSS) or ASK.
  9. **Test coverage diagram** — trace every changed code path AND user flow (double-submit, navigate-away, stale session, slow network, concurrent actions); classify each branch as ★★★/★★/★/GAP; apply E2E decision matrix; enforce IRON RULE (regression = write test immediately, no AskUserQuestion).
  10. **Fix-First resolution** — auto-apply all AUTO-FIX items; batch-present ASK items in a single AskUserQuestion; apply user-approved fixes; never commit or push (that belongs to /ship).
  11. **TODOS cross-reference** — flag which TODOs this PR closes; flag new work the PR creates.
  12. **Doc staleness check** — for each root `.md` touched by the diff, flag if the doc was not updated.
  13. **Adversarial review** (auto-scaled by diff size) — skip < 50 lines; Claude subagent adversarial challenge for 50–199 lines; full multi-pass (Claude structured + Claude adversarial subagent + optional Codex structured + Codex adversarial) for 200+ lines; synthesize cross-model findings with confidence weighting.

**Strip**: Entire preamble bash block (update-check, session tracking, telemetry opt-in flows, lake intro, proactive-behavior prompting, contributor-mode logging); all `gstack-*` binary calls (`gstack-review-log`, `gstack-diff-scope`, `gstack-config`, `gstack-review-read`, `gstack-telemetry-log`); Greptile integration (Steps 2.5 and greptile resolution branch of Step 5 — the pattern is replace-with-any-static-analysis-tool); `codex exec` / `codex review` CLI calls (keep the adversarial-subagent pattern, strip the binary); plan-mode footer; Voice/persona section (150+ lines); AskUserQuestion format block (4-step re-ground/simplify/recommend/options structure is reusable but strip gstack-branded framing); telemetry footer.

**Structure/format**: Single file, 1114 lines. Well-organized numbered steps with clear H2 headers and ASCII output templates. Portable core extracts to ~250–350 lines. Steps are independently useful; plan completion audit and coverage diagram are self-contained sub-workflows that could stand alone as separate skills.

**Notes**: Three sub-workflows here are among the strongest portable candidates across the entire reference set:
  - **Plan completion audit** (DONE/PARTIAL/NOT DONE/CHANGED against diff) — novel; most review skills don't cross-reference a plan file at all. Directly answers "did we build what we said we would?"
  - **Test coverage diagram** — traces code paths AND user flows (including interaction edge cases like double-submit and navigate-away), applies E2E decision matrix, enforces regression-test iron rule. More thorough than any other coverage SOP seen in this audit.
  - **Fix-First heuristic** — auto-fix vs. batch-ask pattern prevents review paralysis. Clean binary classification; prevents the failure mode where reviews produce long lists of findings that go nowhere.
  The two-pass severity model (CRITICAL / INFORMATIONAL) and diff-size-scaled adversarial review are also worth extracting. The adversarial subagent prompt ("think like an attacker and a chaos engineer") is reusable verbatim for any review context.

## cso/SKILL.md

**Type**: Skill — 14-phase Chief Security Officer security audit. Covers secrets archaeology (git history), dependency supply chain, CI/CD pipeline security, infrastructure shadow surface, webhook/integration audit, LLM/AI-specific vulnerabilities, skill supply chain scanning, OWASP Top 10, STRIDE threat model, data classification, false-positive filtering with active verification, findings report with trend tracking, and machine-readable JSON report output. Two modes: daily (8/10 confidence gate, zero noise) and comprehensive (2/10 bar, surfaces tentatives).

**Portable**: Yes — the core 14-phase audit methodology, FP filtering rules, active verification protocol, findings report schema, and trend-tracking pattern are all entirely repo- and toolchain-agnostic. The preamble/telemetry/onboarding machinery is gstack-specific and cleanly separable.

**Reason**: The security methodology encodes durable, attacker-minded reasoning that applies to any codebase: the same phases (secrets archaeology, supply chain, CI/CD, OWASP, STRIDE) recur in any professional security audit. The FP-filtering ruleset (22 hard exclusions + 12 named precedents) is unusually explicit and prevents the false-positive noise that makes most automated security tooling useless. The active verification and parallel subagent verification protocols are sophisticated additions that raise result quality. None of this logic depends on gstack binaries or state.

**Trigger**: User says "security audit", "threat model", "pentest review", "OWASP", "CSO review", "find secrets", or "supply chain scan"; or agent is about to ship a significant feature or deploy to production.

**Steps/contract**:
- *Phase 0* — Stack + framework detection; architecture mental model (read CLAUDE.md, map trust boundaries, trace data flow). Outputs explicit architecture summary before proceeding.
- *Phase 1* — Attack surface census: public/auth/admin endpoints, file uploads, webhooks, CI/CD workflows, IaC configs, secret management approach.
- *Phase 2* — Secrets archaeology: git history scan for known key prefixes (AKIA, sk-, ghp_, xoxb-), tracked .env files, inline CI secrets not using secret stores.
- *Phase 3* — Dependency supply chain: standard audit tool + install-script scanning in prod deps + lockfile integrity.
- *Phase 4* — CI/CD pipeline security: unpinned third-party actions, `pull_request_target` with PR checkout, script injection via `${{ github.event.* }}`, CODEOWNERS coverage.
- *Phase 5* — Infrastructure shadow surface: Dockerfiles (root user, ARG secrets, .env copies), prod DB URLs in committed configs, IaC wildcard IAM, privileged K8s.
- *Phase 6* — Webhook/integration audit: routes without signature verification, TLS disabled, OAuth scope analysis. Code-tracing only — no live HTTP requests.
- *Phase 7* — LLM/AI security: user input in system prompts, unsanitized LLM output rendered as HTML, tool call validation, eval of LLM output, unbounded LLM call cost amplification.
- *Phase 8* — Skill supply chain: scan installed SKILL.md files for credential access, network exfiltration, prompt injection patterns. Requires user permission before scanning outside repo.
- *Phase 9* — OWASP Top 10 assessment: A01–A10, each with targeted grep patterns scoped to detected stack.
- *Phase 10* — STRIDE threat model per major component.
- *Phase 11* — Data classification: RESTRICTED / CONFIDENTIAL / INTERNAL / PUBLIC tiers with storage location and protection status.
- *Phase 12* — FP filtering + active verification: 22 hard exclusions, 12 precedents, confidence gate (8/10 daily, 2/10 comprehensive), code-tracing verification, parallel independent subagent verifier per finding, variant analysis after each VERIFIED finding.
- *Phase 13* — Findings report: tabular summary + per-finding blocks (severity, confidence, status, exploit scenario, impact, recommendation) + incident response playbooks for leaked secrets + trend comparison vs prior runs + remediation roadmap via AskUserQuestion.
- *Phase 14* — Save machine-readable JSON report to `.gstack/security-reports/{date}.json` with full schema (findings array, supply chain summary, filter stats, trend).

**Strip**: Entire preamble bash block (update-check, session-touch, telemetry logging, lake intro, proactive-behavior consent, contributor-mode logging); Voice/persona section (Garry Tan voice — long, gstack-branded); AskUserQuestion 4-step format wrapper (re-ground/simplify/recommend/options — the underlying decision pattern is portable but strip the branded framing); Completeness Principle effort table (gstack product copy); plan-status footer (`gstack-review-read` binary + GSTACK REVIEW REPORT section); telemetry footer; `.gstack/` path convention (generalize to `.security-reports/` or configurable); `gstack-telemetry-log` binary call; Contributor Mode logging; all `~/.gstack/bin/gstack-*` binary references. Phase 8 global scan path (`~/.claude/skills/gstack/`) can be generalized to any agent skill directory.

**Structure/format**: Single large file (~900 lines). YAML frontmatter → preamble bash block → prose conditional onboarding flows → Voice section → AskUserQuestion format → Completeness Principle → Contributor Mode → Completion Status Protocol → Telemetry → Plan Status Footer → main skill body (Phase 0–14 with embedded bash illustration blocks and output templates). The main skill body (Phase 0–14) is cleanly separable from the preamble machinery — it starts at the `/cso — Chief Security Officer Audit (v2)` heading. Well-structured internally: each phase has a named heading, illustrative bash blocks (labeled "use Grep tool, not bash"), severity/FP rules, and output templates.

**Notes**: Three sub-components stand out as especially strong portable candidates:
- **FP filtering ruleset (Phase 12)**: 22 named hard exclusions + 12 numbered precedents is the most explicit and actionable false-positive policy seen in this audit. The numbered precedents (e.g., "#4: React/Angular are XSS-safe by default, only flag escape hatches"; "#15 exception: SKILL.md files are not documentation, they are executable prompt code") encode genuine security expertise, not just generic advice. Worth extracting as a standalone policy block reusable in any security SOP.
- **Active verification + parallel subagent verifier protocol**: each finding survives a confidence gate, then a code-tracing verification attempt, then an independent subagent review with fresh context and no anchoring. Variant analysis fires automatically after each VERIFIED finding. This is a rigorous quality-control loop that most review SOPs entirely omit.
- **Findings report schema (Phase 13–14)**: the per-finding block (severity, confidence, VERIFIED/UNVERIFIED/TENTATIVE status, exploit scenario, impact, recommendation + incident response playbook for secrets) and the JSON output schema with filter stats and trend tracking are immediately reusable as a report standard for any security SOP. The "exploit scenario requirement" (step-by-step attack path mandatory per finding) is a particularly strong forcing function against vague findings.
The confidence gate philosophy ("zero noise is more important than zero misses; a report with 3 real findings beats one with 3 real + 12 theoretical") is the right default posture and worth preserving verbatim in a portable SOP.
## document-release/SKILL.md

**Type**: Post-ship documentation sync skill — runs after code ships, updates README / ARCHITECTURE / CONTRIBUTING / CLAUDE.md / CHANGELOG / TODOS / VERSION to match what was released, then commits and updates the PR/MR body with a doc health summary.

**Portable**: Partially. The 9-step core workflow (diff analysis → per-file audit → auto-update → CHANGELOG voice polish → cross-doc consistency → TODOS cleanup → VERSION bump decision → commit + PR body update → health summary) is entirely repo-agnostic. The gstack product scaffolding (preamble, telemetry, lake intro, proactive-behavior flows, contributor mode, plan-status footer, Garry Tan voice persona) must be stripped.

**Reason**: The core protocol encodes three unusually strong safety rules that are rare in reference skills: (1) the CHANGELOG non-clobber rule ("never use Write on CHANGELOG.md; always Edit with exact old_string; never regenerate entries — a real incident caused this rule"), (2) "never bump VERSION without an explicit AskUserQuestion — even when VERSION was already bumped, verify the bump covers all new changes on the branch", and (3) the auto-update vs. ask classification (factual corrections from the diff → auto; narrative, security model, section removal → ask). Together these make the skill both safe and decisive.

**Trigger**: After a PR merges or code ships; user says "update the docs", "sync documentation", "post-ship docs"; proactively suggest after `/ship` runs.

**Steps/contract**:
1. **Platform + base branch detection** — `git remote get-url origin` → `gh pr view` / `gh repo view` → `glab mr view` / `glab repo view` → `git symbolic-ref` → `main`/`master` fallback. Print detected base branch.
2. **Pre-flight diff analysis** — `git diff <base>...HEAD --stat`, `git log --oneline`, `find . -maxdepth 2 -name "*.md"`. Classify changes: new features / changed behavior / removed functionality / infrastructure. Output brief summary.
3. **Per-file audit** — Read each `.md` file; cross-reference against diff. For each update needed, classify: **auto-update** (factual corrections clearly from the diff: paths, counts, table rows, stale refs) vs. **ask** (narrative changes, section removal, security model, rewrites > ~10 lines, ambiguous relevance). README: features, install, examples. ARCHITECTURE: component descriptions (conservative). CONTRIBUTING: new-contributor smoke test (walk setup steps as if brand new). CLAUDE.md: project structure tree, commands, build/test instructions.
4. **Apply auto-updates** — Edit tool only; one-line per-file summary of what specifically changed (not "Updated README" but "README: added /document-release to skills table, count 9→10").
5. **Ask about risky changes** — AskUserQuestion per item; apply approved changes immediately; always offer C) Skip.
6. **CHANGELOG voice polish** — Read full file first. Modify wording only; never delete, reorder, or regenerate entries. "Sell test": would a user think "I want to try that"? Lead with what the user can now *do*. Internal/contributor changes go in a separate `### For contributors` subsection. Use Edit with exact old_string; never Write on CHANGELOG.md.
7. **Cross-doc consistency + discoverability** — Check version number alignment across README/CHANGELOG/VERSION. Verify every `.md` is reachable from README or CLAUDE.md; flag orphaned docs. Auto-fix factual inconsistencies; AskUserQuestion for narrative contradictions.
8. **TODOS cleanup** — Mark completed items with `**Completed:** vX.Y.Z (YYYY-MM-DD)` when clearly evidenced by diff. Flag stale item descriptions. Scan diff for TODO/FIXME/HACK/XXX comments; ask whether each should be captured.
9. **VERSION bump decision** — Read CLAUDE.md for project config. If VERSION absent: skip. If not yet bumped: AskUserQuestion (recommend Skip for docs-only). If already bumped: verify the CHANGELOG entry for the current version covers all significant new changes on the branch; if uncovered changes exist, AskUserQuestion — never silently absorb new work under an existing version bump.
10. **Commit + output** — `git status` first; if no docs changed, output "All documentation is up to date" and exit. Stage named files only (never `git add -A`). Single `docs:` commit with Co-Authored-By. Push. Update PR/MR body idempotently via `gh pr edit` / `glab mr update` (PID-unique tempfile, replace or append `## Documentation` section). Output doc health table: each file → Updated / Current / Voice polished / Not bumped / Already bumped / Skipped.

**Strip**: Entire preamble bash block (update-check, `~/.gstack/sessions/` touch, telemetry opt-in flows, "Boil the Lake" intro, proactive-behavior consent, contributor-mode field-report logic, plan-status footer, telemetry footer); Voice/persona section (Garry Tan persona, writing rules, AskUserQuestion 4-step re-ground format — keep the structure, strip brand); Completeness Principle effort table; `gh`/`glab` CLI calls in Step 10 can be kept as optional platform integrations but the SOP should not require them.

**Structure/format**: ~500 lines, single file. Ten numbered H2 sections; well-organized and clearly sequenced. Core workflow extracts to ~200–250 lines once scaffolding is removed. Each step is independently useful; Steps 6 (CHANGELOG safety) and 9 (VERSION discipline) are the highest-value extractable sub-rules.

**Notes**: The CHANGELOG non-clobber rule is the single strongest specific safety rule seen in this reference set — it names a real past incident and encodes both the constraint (Edit not Write) and the reason (entries are source of truth written from actual diff history). The VERSION coverage check (step 9d) addresses a subtle but real failure mode: a bump set for "feature A" silently absorbing "feature B" on the same branch. The discoverability check in Step 7 (every doc reachable from README or CLAUDE.md) is a novel quality gate not seen in other reference skills. The auto-update vs. ask binary (factual = auto, narrative = ask) gives agents a clean decision rule that prevents both over-stopping and unsafe rewrites.

## File: `retro/SKILL.md`

**Type**: Skill — weekly engineering retrospective. Analyzes git commit history, work patterns, code-quality metrics, and contributor breakdowns with persistent trend history. Two modes: repo-scoped (Steps 0–14) and global cross-repo (`/retro global`).

**Portable**: Partially — the core git analysis workflow, session-detection algorithm, hotspot analysis, streak tracking, historical comparison, and output format are entirely repo-agnostic. The per-author praise/growth-area narrative pattern is also portable. What is non-portable is the gstack scaffolding (preamble, telemetry, Greptile integration, Garry Tan voice/persona, YC-partner framing, gstack-specific binaries) and the AskUserQuestion 4-step format block.

**Reason**: The bulk of the file is a richly specified git analysis protocol — midnight-aligned window computation, 12 parallel raw-data queries, per-author leaderboard, session-detection by 45-minute gap, commit-type histogram, PR-size bucketing, focus score, streak counting, JSON snapshot schema, and compare mode. None of these require gstack tooling; they are pure bash + git. The global cross-repo retro flow (discovery binary aside) is also largely portable. The gstack scaffolding (preamble, telemetry opt-in flows, contributor mode, Greptile history, plan-status footer) is pure product machinery and cleanly separable.

**Trigger**: User asks for a "weekly retro", "what did we ship", "engineering retrospective", or "retro [window]". Proactively suggest at end of sprint or work week.

**Steps/contract**:
1. *Window parsing* — parse `[window | compare | global]`; midnight-align day/week units (`--since="YYYY-MM-DDT00:00:00"`); sub-day units use relative strings; validate argument and show usage on mismatch.
2. *Base branch detection* — platform-aware: `gh pr view` → `gh repo view` → `glab mr view` → `glab repo view` → `git symbolic-ref` → `main`/`master` fallback (Step 0).
3. *Raw data gather* — run 12 git queries in parallel: `--shortstat` log, `--numstat` with `COMMIT:` headers, timestamps for session detection, file hotspot counts, PR numbers from commit subjects, per-author file attribution, per-author commit counts, greptile history, TODOS.md, test file count, regression-test commits, test files changed (Step 1).
4. *Metrics computation* — summary table (commits, contributors, PRs, LOC, test ratio, active days, sessions, LOC/session-hour); per-author leaderboard sorted by commits; current user labeled "You (name)" and always first (Step 2).
5. *Commit time histogram* — hourly bar chart in local timezone; identify peak hours, dead zones, bimodal patterns, late-night clusters (Step 3).
6. *Session detection* — 45-minute gap threshold; classify Deep (50+ min) / Medium (20–50 min) / Micro (<20 min); compute total active time and LOC/hour (Step 4).
7. *Commit type breakdown* — conventional commit prefix percentages; flag fix ratio >50% as review-gap signal (Step 5).
8. *Hotspot analysis* — top 10 most-changed files; flag churn (5+ changes), test vs production, VERSION/CHANGELOG frequency (Step 6).
9. *PR size bucketing* — Small/Medium/Large/XL by LOC (Step 7).
10. *Focus score + Ship of the Week* — % of commits in single top-level dir; identify highest-LOC PR and narrate its impact (Step 8).
11. *Per-author breakdown* — for each contributor: commits/LOC, top areas, commit type mix, session patterns, test discipline, biggest ship; for teammates: 1–2 specific praise items anchored in commits + 1 growth-area suggestion framed as investment; parse `Co-Authored-By` trailers and track AI-assisted commit % (Step 9).
12. *Week-over-week trends* — split into weekly buckets if window ≥14d (Step 10).
13. *Streak tracking* — consecutive days with ≥1 commit to `origin/<default>`; both team streak and personal streak (Step 11).
14. *History load + compare* — read most recent `.context/retros/*.json`; compute deltas for test ratio, sessions, LOC/hour, fix ratio, commits, deep sessions; skip on first run (Step 12).
15. *JSON snapshot* — save to `.context/retros/YYYY-MM-DD-N.json` with full metrics, authors, greptile, test health, backlog fields (Step 13).
16. *Narrative output* — tweetable summary line first; then: Summary Table, Trends vs Last Retro, Time & Session Patterns, Shipping Velocity, Code Quality Signals, Test Health, Plan Completion, Focus & Highlights, Your Week (deep personal dive), Team Breakdown, Top 3 Team Wins, 3 Things to Improve, 3 Habits for Next Week (Step 14).

**Strip**:
- Entire preamble bash block (update-check, `gstack-update-check`, session touch, `gstack-config`, `gstack-repo-mode`, telemetry JSONL logging, `gstack-telemetry-log`)
- All conditional onboarding flows (lake intro, telemetry consent dialog, proactive-behavior consent) — these are gstack product onboarding, not retro logic
- Contributor Mode section (field-report filing to `~/.gstack/contributor-logs/`)
- Voice / persona section (Garry Tan/YC persona, 150+ lines of tone and writing rules)
- AskUserQuestion format block (re-ground / simplify / recommend / options — gstack-specific UX convention)
- Completeness Principle effort table (gstack product copy)
- Greptile integration (signal ratio computation and `~/.gstack/greptile-history.md` parsing) — keep the *pattern* of tracking tool-signal ratios but strip the binary dependency
- Skill Usage telemetry section (`~/.gstack/analytics/skill-usage.jsonl` aggregation) — strip as gstack-proprietary analytics
- Eureka Moments section (`~/.gstack/analytics/eureka.jsonl`) — strip
- Plan Completion section (`gstack-slug`, `$SLUG/*-reviews.jsonl`) — strip binary deps; the concept (cross-referencing plan items with shipped branches) is portable but requires the gstack review infra
- Telemetry footer bash block
- Plan Status Footer section (`gstack-review-read`, `## GSTACK REVIEW REPORT`)
- Global retro discovery binary (`gstack-global-discover`) — the *workflow* (per-repo git queries, cross-repo streak, context-switching metric, per-tool session breakdown) is portable; the discovery script is not
- Global snapshot path (`~/.gstack/retros/`) — replace with repo-relative `.context/retros/`

**Structure/format**: 1176-line single file. Well-organized numbered steps with H2 headers, embedded bash blocks, ASCII table templates, and a fenced JSON schema. The portable core (Steps 0–14 + compare mode + narrative tone rules) extracts to ~400–500 lines. Steps are independently composable; Steps 2 (metrics), 9 (per-author analysis), and 11 (streak) could each stand as separate sub-skills.

**Notes**: The three most portable extractions here are:
- **Session-detection algorithm** (45-minute gap, Deep/Medium/Micro classification, LOC/session-hour) — this is the most concretely specified session-analysis heuristic in the reference set. Most retro tools aggregate by day; this models *actual work sessions*, which is a meaningfully different signal.
- **Per-author praise/growth pattern** — specific, commit-anchored praise + one investment-framed growth suggestion per teammate. Explicit anti-patterns ("not 'great work' — say exactly what was good") make this a strong standalone SOP for any team retrospective or 1:1 prep workflow.
- **Midnight-aligned window computation** (explicit `T00:00:00` suffix for git `--since`) — a small but non-obvious correctness detail that prevents the common off-by-hours bug in time-windowed git queries. Worth capturing as a one-line policy in any git-analysis SOP.

## ship/SKILL.md

**Type**: Skill — fully-automated end-to-end ship workflow. Covers a ~10-step pipeline: base-branch detection, pre-flight checks, test framework bootstrap, test execution with failure-ownership triage, prompt eval suites, test coverage audit with code-path + user-flow diagram, plan completion audit, plan verification, pre-landing code review (with conditional design review), Greptile triage, diff-size-scaled adversarial review, version auto-bump, CHANGELOG generation, TODOS.md sync, bisectable commit creation, verification gate, push, platform-aware PR/MR creation, auto doc-release, and ship-metrics persistence.

**Portable**: Partially. The core workflow skeleton and six embedded sub-workflows are highly portable. Roughly 50–60% of the file is reusable; the remainder is gstack product scaffolding (preamble, telemetry, Garry Tan persona, Greptile binary, Codex CLI, `gstack-*` companion binaries, per-user `~/.gstack/` state).

**Reason**: The 8-phase ship backbone (test → review → version → changelog → commit → push → PR → doc-sync) is repo-agnostic. Six sub-workflows are independently extractable as strong portable SOPs: (1) test failure ownership triage, (2) test coverage diagram with user-flow tracking, (3) plan completion audit, (4) bisectable commit ordering, (5) verification gate Iron Law, and (6) diff-size-scaled adversarial review. What is gstack-specific is the preamble machinery, companion binaries, Greptile integration, Codex CLI calls, Voice/persona block, and metrics-persistence paths — all strippable without loss of workflow logic.

**Trigger**: User says "ship", "deploy", "push to main", "create a PR", or "merge and push"; feature branch declared ready; code described as complete and ready for review.

**Steps/contract** (gstack scaffolding stripped):
  1. **Pre-flight** — assert not on base branch; summarize uncommitted changes (always include); show `git diff <base>...HEAD --stat` + `git log --oneline`; display review-readiness status (has Eng Review run within 7 days?).
  2. **Distribution pipeline check** — if diff adds a new CLI binary/library, verify a CI release workflow exists; offer to add one or defer to TODOS.
  3. **Merge base branch** — `git fetch origin <base> && git merge origin/<base> --no-edit`; auto-resolve simple conflicts (VERSION, CHANGELOG ordering); stop on complex conflicts.
  4. **Test framework bootstrap** (if no framework detected) — detect runtime → research best practices → user selects framework → install → write 3-5 real tests → verify → generate CI workflow → write TESTING.md + CLAUDE.md `## Testing` section → commit.
  5. **Run tests** — run full test suite; apply Test Failure Ownership Triage: classify each failure as in-branch (STOP, developer must fix) vs. pre-existing (REPO_MODE-aware: solo repo → offer to fix/TODO/skip; collaborative → offer to fix/blame+assign issue/TODO/skip).
  6. **Eval suites** (if prompt-related files changed) — detect affected eval runners, run at full tier, gate on any failure.
  7. **Test coverage audit** — trace every changed code path AND user flow (including double-submit, navigate-away, stale session, slow network, concurrent actions); produce ASCII coverage diagram with ★★★/★★/★/GAP ratings and E2E decision matrix; generate missing unit/E2E/eval tests; enforce IRON RULE: regression tests are mandatory with no override; apply coverage gate (configurable minimum/target with user override).
  8. **Plan completion audit** — discover plan file (conversation context → content search → recency fallback); extract actionable items (checkboxes, imperatives, file specs, test requirements, migrations); cross-reference each against `git diff` as DONE / PARTIAL / NOT DONE / CHANGED; gate on NOT DONE items (stop / defer to TODOS / intentionally drop).
  9. **Plan verification** (conditional) — if plan has a verification section and a dev server is reachable, invoke `/qa-only` skill against those steps; gate on functional failures.
  10. **Pre-landing review** — read repo-local `review/checklist.md`; two-pass: Pass 1 CRITICAL (SQL/data safety, LLM trust boundary, race conditions), Pass 2 INFORMATIONAL (dead code, magic numbers, test gaps, performance, prompt issues); conditional design review if diff touches frontend files; Fix-First heuristic: auto-apply all AUTO-FIX items, batch remaining ASK items in a single prompt; if any fix applied, commit and re-run tests.
  11. **Adversarial review** (auto-scaled) — skip < 50 lines; Claude adversarial subagent for 50–199 lines; full multi-pass (Claude structured + Claude adversarial + optional Codex structured + Codex adversarial) for 200+ lines; synthesize cross-model findings with confidence weighting; FIXABLE findings enter Fix-First pipeline.
  12. **Version bump** — auto-decide: MICRO (< 50 lines, trivial), PATCH (50+ lines, bug fixes/features), MINOR/MAJOR (ask the user); reset lower digits on bump; write `VERSION` file.
  13. **CHANGELOG** — enumerate every branch commit; group by theme (features/performance/fixes/cleanup/infra); write dated entry; cross-check: every commit must map to at least one bullet.
  14. **TODOS.md sync** — create/reorganize if missing/disorganized; auto-detect completed items from diff; move completed items to `## Completed` with version tag; conservative: only mark when diff clearly shows work done.
  15. **Bisectable commits** — group changes into one-logical-unit commits; ordering: infra/migrations first → models/services + tests → controllers/views + tests → VERSION/CHANGELOG/TODOS last; each commit independently valid (no broken imports or forward references).
  16. **Verification gate (Iron Law)** — if any code changed after Step 5's test run, re-run full test suite and paste fresh output before pushing; "confidence is not evidence."
  17. **Push** — `git push -u origin <branch>`.
  18. **Create PR/MR** — platform-aware (`gh pr create` / `glab mr create` / manual fallback); structured body: summary (all commits grouped by theme), test coverage, pre-landing review, design review, eval results, plan completion, verification results, TODOS.
  19. **Auto doc-release** — invoke `/document-release` skill; update any drifted `.md` files; commit and push to same branch if any docs changed.

**Strip**: Entire preamble bash block (update-check, session tracking, telemetry opt-in, lake intro, proactive-behavior prompting); Voice/persona section (~150 lines, Garry Tan persona); AskUserQuestion multi-step format block (4-step re-ground/simplify/recommend/options — the *pattern* of offering a recommendation with lettered options is portable; strip gstack-branded framing); Completeness Principle effort table (product copy); all `gstack-*` binary calls (`gstack-review-log`, `gstack-review-read`, `gstack-diff-scope`, `gstack-config`, `gstack-telemetry-log`, `gstack-slug`); Greptile integration (Step 3.75 — keep the concept "address static-analysis comments before shipping," strip the binary/companion-file dependency); `codex exec` / `codex review` CLI calls (keep adversarial-subagent pattern, substitute Claude subagent); Contributor Mode section; Plan Status Footer; Telemetry footer; Step 8.75 ship-metrics persistence to `~/.gstack/`; Test Plan Artifact write to `~/.gstack/projects/`; Review Readiness Dashboard binary (`gstack-review-read`) — keep concept, strip binary; `bin/test-lane` / RAILS_ENV-specific instructions (generalize to detected test command); 4-digit VERSION format (generalize to semver); `${CLAUDE_SKILL_DIR}` path token.

**Structure/format**: Single file, ~1907 lines. Well-organized numbered H2 steps with clear sub-steps, ASCII output templates, decision trees (including an explicit "Only stop for / Never stop for" table at top), and inline bash. Portable core extracts to ~500–700 lines. Six sub-workflows (coverage audit, plan audit, failure triage, adversarial review, bisectable commits, verification gate) are independently usable as separate skills.

**Notes**: Most comprehensive ship SOP in the gstack reference set — integrates testing, review, planning, documentation, and versioning into a single automated pipeline. Five extractions stand out as the strongest candidates across all gstack files audited:
- **"Only stop for / Never stop for" decision table** — the clearest automation-boundary specification seen anywhere in the reference set. Immediately answers when the workflow asks vs. proceeds. Worth promoting verbatim into any ship SOP.
- **Test failure ownership triage** — the in-branch vs. pre-existing classification (defaulting to in-branch when ambiguous) with REPO_MODE-aware handling (solo: fix/TODO/skip; collaborative: blame+assign issue/TODO/skip) is novel and complete. The blame-then-assign-to-production-code-author (not test-file author) heuristic is a practical detail most SOPs omit.
- **Plan completion audit** (DONE/PARTIAL/NOT DONE/CHANGED cross-referenced against `git diff`) — strongest plan-vs-delivery SOP seen across the entire reference set. The conservative-DONE / generous-CHANGED calibration is an actionable rule.
- **Bisectable commit ordering** (infra → models/services → controllers/views → bookkeeping) — the dependency-first ordering heuristic is clear, actionable, and eliminates the most common commit-organization mistakes. Pairs well with the CLAUDE.md "single-logical-change" commit SOP already flagged.
- **Verification gate Iron Law** ("confidence is not evidence," anti-rationalization list) — the explicit anti-rationalization list ("Should work now → RUN IT", "It's a trivial change → trivial changes break production") encodes a hard-to-articulate but important discipline. Reusable verbatim in any completion protocol.
- The CHANGELOG cross-check rule (every branch commit must map to at least one bullet) and the version auto-decision heuristic (line-count thresholds for MICRO/PATCH vs. ask for MINOR/MAJOR) are both simple, portable, and rarely seen in reference skills. The test coverage diagram user-flow layer (interaction edge cases: double-submit, navigate-away, stale session, slow network, concurrent actions) is the same strong SOP flagged in `review/SKILL.md` — the two files share this pattern and either could serve as the canonical source.
## freeze/bin/check-freeze.sh

**Type**: PreToolUse hook — bash script that reads JSON from stdin and emits a Claude permission-decision JSON to allow or deny file edits based on a stored freeze-directory boundary.  
**Portable**: Partially — the *pattern* (enforce a path-boundary guard via a PreToolUse hook; fail-open on missing config; deny-with-explanation on violation; log analytics on deny) is fully portable. The implementation depends on `$CLAUDE_PLUGIN_DATA`/`~/.gstack/` state files and gstack's analytics pipeline, which are not portable.  
**Reason**: The hook encodes a clean, reusable SOP primitive: "silently allow when no constraint is active; hard-deny with a human-readable message when a constraint is violated; never block on parse failure (fail-open)." That three-case decision tree (no config → allow, in-boundary → allow, out-of-boundary → deny+explain) is a solid template for any path-scoped guard.  
**Trigger**: An agent is about to write/edit a file; a PreToolUse hook fires with `tool_input.file_path`; the agent should be restricted to a specific directory subtree during a focused task.  
**Steps/contract**:  
  1. Read full stdin into `$INPUT`  
  2. Locate state file at `$CLAUDE_PLUGIN_DATA` or fallback path; if absent → `{}` (allow)  
  3. Read freeze boundary from state file; if empty → `{}` (allow)  
  4. Extract `file_path` from the JSON (grep/sed with Python3 fallback)  
  5. If extraction fails → `{}` (allow — never block on parse failure)  
  6. Resolve relative path to absolute; normalise double-slashes and trailing slash  
  7. If path starts with freeze boundary → `{}` (allow)  
  8. Otherwise → emit `{"permissionDecision":"deny","message":"..."}` with both the blocked path and the boundary in the message; append analytics event to JSONL log  
**Strip**: `~/.gstack/` hardcoded paths, `$CLAUDE_PLUGIN_DATA` env var name, analytics JSONL write (or generalise to a configurable log path), `git rev-parse` repo-name tagging  
**Structure/format**: Single self-contained bash script (~65 lines); stdin→stdout JSON protocol; no external dependencies beyond `bash`, `grep`, `sed`, `python3`  
**Notes**: The fail-open philosophy (three separate early-exit `{}` returns before the boundary check) is a deliberate safety choice worth preserving in any extraction — a misconfigured or absent hook should never silently block legitimate work. The grep+Python3 dual-path JSON extraction is a practical portability trick worth keeping. The deny message template (blocked path + boundary both surfaced) is a good UX pattern for guard hooks generally.

## freeze/SKILL.md

**Type**: Skill — session-scoped edit boundary enforcer. Prompts the user for a directory path, normalises it to an absolute path with a trailing slash, persists it to a state file, and hard-blocks Edit/Write outside that boundary via `PreToolUse` hooks on every subsequent tool call.

**Portable**: Partially — the concept and SOP steps are fully portable; the implementation references `${CLAUDE_SKILL_DIR}/bin/check-freeze.sh` and `~/.gstack/` state paths, which are gstack-specific. The shell logic (read state file → compare path prefix → emit `permissionDecision: "deny"`) is trivial to re-implement in any hook environment.

**Reason**: The core procedure (ask → resolve → normalise → persist → hook checks) has zero gstack-specific logic once the state-file path and binary reference are generalised. It is the concrete realisation of the "scope-lock" pattern referenced in `investigate/SKILL.md` — the two skills form a natural pair and together constitute a "constrain to affected module" SOP. The mechanism is simple enough that the portable version is essentially the prose description of the check-freeze algorithm, not a binary dependency.

**Trigger**: User says "freeze", "restrict edits", "only edit this folder", or "lock down edits"; agent is entering a debugging session and wants to prevent accidental scope creep into unrelated modules.

**Steps/contract**:
1. AskUserQuestion: "Which directory should I restrict edits to? Files outside this path will be blocked from editing."
2. Resolve to absolute path: `FREEZE_DIR=$(cd "<user-provided-path>" 2>/dev/null && pwd)`
3. Normalise with trailing slash (`${FREEZE_DIR%/}/`) to prevent `/src` matching `/src-old`.
4. Save to state file (e.g. `~/.gstack/freeze-dir.txt` or session-local equivalent).
5. Confirm to user: boundary set, how to update it (`/freeze` again), how to remove it (`/unfreeze` or end session).
6. On every Edit/Write: hook reads state file; if `file_path` does not start with freeze dir, emit `permissionDecision: "deny"`.

**Strip**: `~/.gstack/` state-path convention (generalise to a configurable or session-local path); `${CLAUDE_SKILL_DIR}/bin/check-freeze.sh` binary reference (replace with inline logic description or hook pseudocode); analytics bash block at top of skill body; `<!-- AUTO-GENERATED from SKILL.md.tmpl -->` comment and `bun run gen:skill-docs` reference.

**Structure/format**: YAML frontmatter (name, version, description, allowed-tools, hooks PreToolUse declaration) + Markdown body (~50 lines): Setup section → How it works section → Notes. Compact and clean. The hook declaration in frontmatter is Claude Code hook API syntax — portable concept, implementation-specific syntax.

**Notes**: The explicit "not a security boundary" caveat (Bash commands like `sed` can still reach outside the freeze dir) is important honesty and must be preserved in any portable version. The trailing-slash normalisation detail is a non-obvious correctness rule worth keeping verbatim. This skill is most valuable as a component of a debugging SOP rather than standalone — the `investigate/SKILL.md` scope-lock step is its natural trigger site. By itself, it is a thin wrapper around a path-prefix check; its SOP value comes from the pairing.

## autoplan/SKILL.md

**Type**: Skill — meta-orchestrator that loads and sequentially executes three review skill files from disk (CEO → Design → Eng), auto-deciding every intermediate AskUserQuestion via 6 named decision principles, surfacing only "taste decisions" at a final human approval gate. Wraps the full gstack preamble/telemetry/onboarding machinery.

**Portable**: Partially — the 6-principle auto-decision framework, Mechanical vs Taste decision classification, phase-transition discipline, decision audit trail, and final approval gate pattern are entirely repo-agnostic. The execution layer (Codex CLI calls, `gstack-*` binaries, preamble bash block, restore-point binary, telemetry, companion review skill file paths) is gstack-infrastructure and must be stripped.

**Reason**: The orchestration strategy is the portable value: a formal policy for *when to auto-decide vs surface to a human* reduces review paralysis and makes sequential multi-phase workflows deterministic without needing interactive confirmation at every step. The 6 principles (completeness, boil-lakes, pragmatic, DRY, explicit-over-clever, bias-toward-action) encode a coherent, prioritized decision hierarchy. The per-phase conflict-resolution map (CEO: P1+P2 dominate; Eng: P5+P3; Design: P5+P1) is a refinement rarely seen in reference skills — it recognizes that completeness and explicitness trade off differently across review types.

**Trigger**: User says "auto review", "autoplan", "run all reviews", "review this plan automatically", or "make the decisions for me"; proactively when a plan file exists and the user wants to avoid answering 15–30 intermediate questions.

**Steps/contract** (scaffolding stripped):
1. **Intake** — capture restore point (save plan file verbatim before mutating it); read CLAUDE.md, git log -30, diff --stat; discover design doc; detect UI scope (2+ rendering-term matches in plan).
2. **Load review skill files** — read CEO, Design (if UI scope), and Eng skill files from disk; skip preamble/telemetry/boilerplate sections from each loaded skill.
3. **Phase 1 — CEO Review** — execute all sections at full depth; auto-decide via principles; the ONE non-auto gate is premise confirmation (requires human judgment). Run dual-voice (Claude subagent + Codex) simultaneously; produce CEO consensus table. Log each decision to Decision Audit Trail.
4. **Phase-transition summary** — emit summary before advancing; verify all Phase 1 required outputs are written to plan file before starting Phase 2.
5. **Phase 2 — Design Review** (conditional on UI scope) — all 7 dimensions; auto-decide structural issues; mark aesthetic/taste issues as Taste Decisions. Dual-voice runs independently. Phase-transition summary before Phase 3.
6. **Phase 3 — Eng Review** — all sections at full depth; dual-voice; produce ASCII dependency graph, test coverage diagram, test plan artifact on disk, TODOS.md updates.
7. **Decision Audit Trail** — after each auto-decision, append a row (Phase / Decision / Principle / Rationale / Rejected) to the plan file via Edit — incremental, not accumulated in context.
8. **Pre-gate verification** — explicit checklist per phase before presenting gate; if any item missing, retry up to 2 times before proceeding with warning.
9. **Final Approval Gate** — present all taste decisions grouped by phase; options A (approve) / B (override) / C (interrogate) / D (revise) / E (reject). On D: re-run only affected phases, max 3 cycles.
10. **Completion** — write 3 separate review log entries (CEO, Eng, Design if ran) + dual-voice logs per phase; suggest `/ship`.

**Strip**: Entire preamble bash block (update-check, `~/.gstack/sessions/` touch, `gstack-config`, `gstack-repo-mode`, telemetry JSONL, lake intro, telemetry consent dialog, proactive-behavior consent, contributor-mode field reports); Voice/persona section (Garry Tan persona + 150-line writing rules); AskUserQuestion 4-step format block; Completeness Principle effort table; Contributor Mode; Plan Status Footer (`gstack-review-read`, `## GSTACK REVIEW REPORT`); Telemetry footer; all `codex exec` bash blocks (Codex CLI binary); all `gstack-review-log`, `gstack-config`, `gstack-slug`, `gstack-telemetry-log` binary calls; `~/.gstack/` path convention (generalize to repo-relative artifacts); restore-point path construction (binary-dependent); `$PPID`/`$_SESSION_ID` session tracking; the Eureka log block; `gstack-review-read` plan-mode footer.

**Structure/format**: 1031-line single file. YAML frontmatter → 200-line preamble bash + onboarding flows → Voice section → AskUserQuestion format → Completeness Principle → Repo Ownership → Search Before Building → Contributor Mode → Completion Status Protocol → Telemetry → Plan Status Footer → Step 0 (base-branch detection) → Prerequisite Skill Offer → main `/autoplan` body (Phases 0–4 with Decision Audit Trail, Pre-Gate Verification, and Completion steps). The main body starts at `# /autoplan — Auto-Review Pipeline` and is cleanly separable. Portable core extracts to ~250–300 lines.

**Notes**: Three components stand out as especially strong portable extractions:
- **6-principle decision hierarchy with per-phase conflict resolution** — the most explicit "when to auto-decide" policy seen in this reference set. Avoids the common failure mode of sequential review pipelines stalling on subjective questions. The phase-scoped conflict resolution (different principles dominate in CEO vs Eng vs Design phases) is a sophisticated refinement worth preserving.
- **Mechanical vs Taste decision classification** — "one clearly right answer → auto-decide silently; reasonable people could disagree → auto-decide but surface at gate." This binary plus the three natural taste sources (close approaches, borderline scope, codex disagreements) gives agents a concrete decision-making framework reusable in any multi-phase workflow.
- **Pre-gate verification checklist** — explicit per-output checklist before the final gate, with a 2-retry cap before proceeding with a warning. Prevents the failure mode where sections are nominally "completed" but required outputs (ASCII diagrams, test plans, consensus tables) were never actually produced. This is a rare and practical quality-control primitive.
The "full depth means full depth" rule ("fewer than 3 sentences for any review section → you are compressing") is a strong anti-shortcut guardrail worth extracting verbatim. The decision audit trail (incremental Edit to plan file, one row per decision) is a clean, durable pattern for any workflow where autonomous decisions need to be auditable.

## land-and-deploy/SKILL.md

**Type**: Ship/deploy automation skill — 10-step pipeline: pre-flight → first-run dry-run validation (with config fingerprinting) → pre-merge CI checks → CI polling → pre-merge readiness gate → merge (with merge-queue support) → deploy strategy detection → deploy wait → canary verification → deploy report + follow-ups. Picks up where `/ship` leaves off; merges the PR, monitors the deploy, and verifies production health.

**Portable**: Partially. The 10-step workflow backbone and four embedded sub-patterns are highly portable once gstack scaffolding is stripped. ~40–50% of the file is reusable workflow logic; the remainder is product machinery (preamble, telemetry, Garry Tan voice persona, gstack binary calls, plan-status footer). The skill is explicitly GitHub-only — GitLab exits early with "not yet implemented."

**Reason**: Deploy workflow logic is repo-agnostic: platform detection from config files (fly.toml, render.yaml, vercel.json, netlify.toml, Procfile, railway.json, GitHub Actions deploy workflows), merge readiness gating, merge execution with merge-queue awareness, four-strategy deploy monitoring, and diff-scope-adaptive canary verification. Four sub-patterns are particularly portable and not seen together elsewhere: (1) first-run dry-run validation with config fingerprinting, (2) pre-merge readiness report with WARNINGS/BLOCKERS, (3) review staleness classification by commits-since-review, and (4) diff-scope-adaptive canary depth.

**Trigger**: User says "merge", "land", "deploy", "land it", "ship it to production"; or a PR is ready and CI is green.

**Steps/contract**:
1. **Pre-flight** — `gh auth status`; detect or accept PR number; validate PR state (open/merged/closed).
2. **First-run dry-run validation** — detect deploy platform from config files and GH Actions workflows; validate CLI commands; detect staging environments; show infrastructure validation table; AskUserQuestion to confirm; fingerprint config hash (`CLAUDE.md` deploy section + workflow files); save fingerprint; re-run automatically if fingerprint changes on subsequent runs.
3. **Pre-merge checks** — CI status via `gh pr checks`; merge conflict check; stop on failures.
4. **CI polling** — `gh pr checks --watch`; 15-minute timeout; stop on failure.
5. **Pre-merge readiness gate** — review staleness per skill (0 commits = CURRENT / 1–3 = RECENT / 4+ = STALE; also checks what changed after last review for "significant changes" signal); inline review offer if stale (quick checklist / full /review / user-vouches); free test run; E2E + LLM eval results from today; PR body accuracy vs. commit log; doc-release check (CHANGELOG + VERSION + new-feature heuristic); build structured READINESS REPORT (WARNINGS / BLOCKERS counts); 3-option AskUserQuestion (merge / hold / merge-with-risks).
6. **Merge** — `gh pr merge --auto --delete-branch` first; fall back to `--squash --delete-branch`; detect merge queue; poll until `MERGED` (30-minute timeout); capture merge commit SHA.
7. **Deploy strategy detection** — docs-only shortcut (skip Steps 6–7); GitHub Actions workflow matching by merge SHA; staging-first option if staging detected; AskUserQuestion if no deploy workflow and no URL provided.
8. **Deploy wait** — four strategies: (A) GH Actions polling via `gh run view`; (B) platform CLI (Fly `fly status`, Render URL poll, Heroku `heroku releases`); (C) auto-deploy platforms (Vercel/Netlify — 60s wait); (D) custom deploy hook from CLAUDE.md. 20-minute timeout; revert escape hatch on failure.
9. **Canary verification** — diff-scope-adaptive depth: docs=skip, config=smoke (200 status), backend=console+perf, frontend/mixed=full (`goto` + `console --errors` + `perf` + `text` + annotated `snapshot`); revert escape hatch on health failure.
10. **Deploy report + follow-ups** — ASCII LAND & DEPLOY REPORT (PR, timing breakdown, review status, CI/deploy/staging/canary verdicts, screenshot path, VERDICT line); save to `.gstack/deploy-reports/`; JSONL persistence; suggest `/canary`, `/benchmark`, `/document-release` as follow-ups.

**Strip**: Entire preamble bash block (update-check, session touch, telemetry logging, lake intro, proactive-behavior consent, contributor-mode field reports, plan-status footer, telemetry footer); Voice/persona section (Garry Tan persona, ~150 lines); AskUserQuestion 4-step format block (re-ground/simplify/recommend/options — keep decision structure, strip brand framing); Completeness Principle effort table; all `gstack-*` binary calls (`gstack-update-check`, `gstack-config`, `gstack-slug`, `gstack-repo-mode`, `gstack-review-read`, `gstack-telemetry-log`, `gstack-diff-scope`); `$B` browse binary references in Step 9 (replace with Playwright/curl equivalents); GitLab early-exit guard (keep platform-detection pattern, note GitHub-only limitation); JSONL persistence path (`~/.gstack/projects/`) — generalize to repo-relative `.deploy-reports/`. Completion Status Protocol (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT + 3-strike escalation) is portable and worth keeping.

**Structure/format**: Single file, ~1341 lines. Ten numbered H2 sections with embedded bash blocks, a platform strategy decision table, and three reusable ASCII output templates (infrastructure validation, pre-merge readiness report, deploy report). Core workflow extracts to ~350–450 lines once scaffolding is removed. Steps are independently composable — the readiness gate (Step 5) and deploy-wait strategies (Step 8) could each stand as sub-skills.

**Notes**: Four sub-patterns stand out as the strongest portable candidates:
- **First-run dry-run validation with config fingerprinting** (Step 2): hashing deploy config + workflow files and re-running dry run when the hash changes is a durable "trust but verify" approach for irreversible operations. The "teacher mode / efficient mode" bifurcation (first run = explain everything, subsequent runs = brief) is a strong UX design principle for any long-running agent skill. Not seen in other reference skills.
- **Pre-merge readiness report** (Step 5): aggregating review staleness + test results + PR body accuracy + doc-release into a single gated decision with explicit WARNINGS/BLOCKERS prevents the failure mode where ad-hoc checks get skipped under time pressure. The review staleness metric (commits-since-review with "check what changed after last review" refinement) is more precise than any other review-freshness SOP in this audit.
- **Diff-scope-adaptive canary depth** (Step 9): docs=skip, config=smoke, backend=console+perf, frontend=full avoids noisy verification on doc-only changes while ensuring frontend changes get full screenshot evidence. The scope classification re-uses the `gstack-diff-scope` binary output, but the decision table itself is portable logic.
- **Revert as consistent escape hatch**: offered at both deploy failure and canary health failure with plain-English explanation of what reverting does. Consistently applied across two distinct failure points — a detail most deploy SOPs omit.
- The inline review offer (Step 5, sub-step 3.5a-bis) — quick checklist vs. full /review vs. user-vouches — is a practical 3-way decision that avoids both over-stopping and silent risk when review staleness is detected.
- The four-strategy deploy monitoring framework (GH Actions / platform CLI / auto-deploy / custom hook) covers the realistic deployment landscape; each strategy has its own timeout and failure handling, which makes this the most complete deploy-monitoring SOP in the reference set.

## canary/SKILL.md

**Type**: Skill — post-deploy canary monitor. Captures baseline screenshots before a deploy, then runs a continuous polling loop (every 60 s) over specified pages using the `$B` browse daemon: navigate → screenshot → console-error count → load time → diff against baseline. Alerts on changes (new errors, 2× perf regression, 404s) only when a pattern persists across 2+ consecutive checks. Produces a structured health report and offers baseline promotion when the deploy passes.

**Portable**: Partially. The canary methodology — baseline-before/diff-after, alert-on-changes-not-absolutes, transient tolerance (2+ checks), severity tiers (CRITICAL/HIGH/MEDIUM/LOW), health report schema, and baseline-promotion offer — is entirely toolchain-agnostic and translates cleanly to Playwright, Puppeteer, or any headless browser. The skill file itself is not drop-in portable because every browse command (`$B goto`, `$B snapshot`, `$B console`, `$B perf`) depends on the compiled `browse` binary that ships with gstack.

**Reason**: The workflow logic is conceptually clean and separable from the binary dependency. Strip the preamble + `$B` calls and what remains is a well-specified monitoring SOP: capture state before the event, compare after, alert on statistically stable regressions, escalate or dismiss with user consent, and close the loop by promoting the new baseline. These are durable, tool-independent principles.

**Trigger**: User says "monitor deploy", "canary", "post-deploy check", "watch production", or "verify deploy"; or agent has just completed a ship/deploy workflow and needs a verification pass.

**Steps/contract**:
1. **Baseline capture** (`--baseline` flag) — before deploying, for each page: navigate → screenshot → console error count → load time → text snapshot. Save manifest to `.gstack/canary-reports/baseline.json`. Stop and tell user to deploy, then re-run without the flag.
2. **Page discovery** — if no `--pages` specified, load homepage, extract top 5 internal nav links, present via user confirmation. Always include homepage.
3. **Pre-deploy snapshot** — if no baseline exists, take a reference snapshot now as a relative comparison point.
4. **Monitoring loop** — every 60 s for the configured duration (default 10 min, range 1–30 min): navigate each page → screenshot → console errors → perf. Compare against baseline. Classify anomalies by severity tier. Only alert when an anomaly persists across 2+ consecutive checks (transient tolerance).
5. **Alert format** — on CRITICAL/HIGH: surface time, page, type, finding (specific), evidence (screenshot path), baseline value, current value. AskUserQuestion: investigate now / continue / rollback / dismiss.
6. **Health report** — after monitoring completes: per-page status table (page, status, new error count, avg load), total alerts by severity, VERDICT (HEALTHY/DEGRADED/BROKEN). Save as `.gstack/canary-reports/{date}-canary.md` and `.json`.
7. **Baseline promotion** — if HEALTHY, offer to update baseline with current screenshots.

**Strip**: Entire preamble bash block (update-check, session-touch, telemetry JSONL, lake intro, proactive-behavior consent, contributor-mode, plan-status footer, telemetry footer); Voice/persona section (Garry Tan persona + writing rules); AskUserQuestion 4-step re-ground format (strip branded framing, keep the decision options); `$B` command vocabulary (replace with Playwright/Puppeteer equivalents in any portable version); `~/.gstack/analytics/` path references; `gstack-slug` binary call in Phase 1 setup; the SETUP section (browse-binary check + one-time build step); Step 0 base-branch detection (only needed if the skill integrates with the broader ship pipeline — not required for standalone canary monitoring).

**Structure/format**: Standard gstack single-file layout. YAML frontmatter → preamble block → prose onboarding flows → Voice section → AskUserQuestion format → Completeness Principle → Contributor Mode → Completion Status Protocol → Telemetry → Plan Status Footer → Setup section → Step 0 (base branch) → 7 canary phases (Phase 1–7) with embedded bash illustrations, alert format block, health report ASCII template, and important rules list. Core monitoring workflow (Phases 1–7) is ~200 lines and cleanly separable.

**Notes**: Three elements are especially strong portable extractions:
- **Alert-on-changes-not-absolutes rule**: framing monitoring as baseline-relative rather than absolute-threshold is the key design decision that prevents false positives on sites with pre-existing console noise. Worth preserving verbatim as a standing policy statement in any canary SOP.
- **Transient tolerance rule** (2+ consecutive checks before alerting): explicit, simple, and directly prevents the most common failure mode of monitoring tools — single-check alert spam on transient network blips.
- **Health report schema**: the per-page table (page / status / new errors / avg load) + VERDICT line is immediately reusable as a structured output template for any post-deploy monitoring workflow, independent of tooling.
The baseline-promotion offer at the end (Phase 7) is a clean lifecycle close — it resets the reference point after a healthy deploy so the next canary comparison stays accurate. Most monitoring SOPs omit this and leave baselines drifting. The `--quick` flag (single-pass health check, no loop) is a useful mode distinction worth carrying into any portable version.

## codex/SKILL.md

**Type**: Skill — OpenAI Codex CLI wrapper with three modes: (A) code review with P1/P2 severity gate and cross-model comparison, (B) adversarial challenge that tries to break the code with JSONL reasoning-trace streaming, and (C) session-continuity consultation that embeds plan/file content verbatim because the Codex sandbox cannot read outside the repo root.

**Portable**: No — the implementation requires the `codex` binary (`npm install -g @openai/codex`). All three modes drive specific CLI subcommands (`codex review`, `codex exec`, `codex exec resume`) and parse Codex-proprietary JSONL event types (`thread.started`, `item.completed`, `turn.completed`). Removing the binary leaves no executable workflow.

**Reason**: `codex review` and `codex exec` are not wrappers around generic `git diff` + an AI call — they invoke OpenAI's own agentic coding model through a sandboxed CLI that reads the repo, reasons autonomously, and streams structured output. The session-resume protocol (`codex exec resume <session-id>`), reasoning-trace extraction (`[codex thinking]` lines), and `model_reasoning_effort` parameter are all Codex-CLI-specific. The *patterns* encoded (multi-model cross-comparison, adversarial challenge framing, session-stateful consultation, read-only sandbox discipline) are portable as design principles, but none of the procedure steps transfer without the binary.

**Trigger**: User says "codex review", "codex challenge", "ask codex", "second opinion", or "consult codex"; proactively when the user is about to land a PR and has already run Claude's own `/review` (cross-model comparison becomes available).

**Steps/contract**:
- *Step 0* — Assert `codex` binary present via `which codex`; stop with install instructions if not found.
- *Step 1* — Mode detection: explicit `/codex review [instructions]` → Review; `/codex challenge [focus]` → Challenge; `/codex [prompt]` → Consult; bare `/codex` → AskUserQuestion (diff detected → Review or Challenge; no diff → plan file or free prompt).
- *Step 2A (Review)* — `codex review --base <base> -c 'model_reasoning_effort="high"' --enable web_search_cached`; parse stdout for `[P1]` (FAIL gate) vs. no `[P1]` (PASS); cross-model comparison if `/review` already ran in session (Both found / Only Codex / Only Claude / agreement rate); persist result via `gstack-review-log`.
- *Step 2B (Challenge)* — `codex exec "<adversarial prompt>" -C <repo-root> -s read-only --json`; stream JSONL via Python parser to surface `[codex thinking]` reasoning traces; present verbatim in CODEX SAYS block.
- *Step 2C (Consult)* — check `.context/codex-session-id` for prior session; embed plan file content verbatim in prompt (sandbox cannot access `~/.claude/plans/`); new-session: extract `thread.started.thread_id` and persist to `.context/codex-session-id`; resume: `codex exec resume <id> "<prompt>"`; flag any Claude vs. Codex disagreements after presenting full output.

**Strip**: Entire preamble bash block (update-check, session touch, `gstack-config` reads, telemetry logging, lake intro, proactive-behavior consent, contributor-mode logging); Voice/persona section (Garry Tan "200 IQ autistic developer" framing + all writing rules); AskUserQuestion 4-step format block; Completeness Principle effort table; Contributor Mode field-report filing; plan-status footer (`gstack-review-read` + `## GSTACK REVIEW REPORT`); telemetry footer; `gstack-review-log` binary call; all `~/.gstack/` path references.

**Structure/format**: YAML frontmatter → heavyweight preamble → Voice section → AskUserQuestion format → Completeness Principle → Repo Ownership → Search Before Building → Contributor Mode → Completion Status Protocol → Telemetry footer → Plan Status Footer → platform/base-branch detection → main skill body (Step 0 binary check → Step 1 mode detection → Step 2A Review → Step 2B Challenge → Step 2C Consult → Model & Reasoning table → Cost Estimation → Error Handling → Important Rules). Main skill body is well-organized and cleanly separable from the scaffolding — begins at the `/codex — Multi-AI Second Opinion` heading.

**Notes**: Four patterns are worth extracting as portable SOPs even without the binary:
- **Cross-model comparison protocol** (Step 2A.6) — after two independent reviews, synthesize "Both found / Only X found / Only Y found / agreement rate %". Reusable for any multi-reviewer setup regardless of which models are involved.
- **P1/P2 severity gate** — P1 = FAIL (must fix before landing), P2 = PASS (informational). A clean binary gate that maps directly to the CRITICAL/INFORMATIONAL split in the `/review` skill; portable as a review-output convention.
- **Session-continuity consultation pattern** (Step 2C) — persist session ID to `.context/`; offer resume on next invocation; note is portable as a design pattern for any stateful agent Q&A session.
- **Read-only sandbox / embed-don't-reference rule** — "Codex runs sandboxed to repo root; embed plan file content verbatim, do not give it the path." Portable caution for any agent invocation with restricted filesystem access.
The Important Rules section ("never modify files; present output verbatim inside CODEX SAYS block; add synthesis after, not instead of; 5-minute timeout") is clean and reusable as a "second-opinion agent" conduct policy. The xhigh reasoning-effort warning ("~23x more tokens, 50+ minute hangs on large context — OpenAI issues #8545, #8402, #6931") is Codex-CLI-specific but exemplifies a good pattern: document known performance cliffs with issue references.

## browse/SKILL.md

**Type**: Skill — headless browser QA/dogfooding toolkit wrapping a compiled `browse` binary (`$B`). Exposes a rich command API for navigation, snapshot/diff, element interaction via `@e` refs, assertions, screenshots, responsive layout testing, file upload, dialog handling, and tab management. Ships the standard gstack preamble (update-check, session tracking, telemetry opt-in, "Boil the Lake" intro, proactive-behavior consent) plus a contributor-mode field-report loop and a plan-mode footer.

**Portable**: No — as written, tightly coupled to a locally-installed binary (`~/.claude/skills/gstack/browse/dist/browse`), companion binaries under `~/.claude/skills/gstack/bin/`, per-user state under `~/.gstack/`, and a one-time `./setup` build step (`bun`-dependent). Cannot be adopted without the full gstack installation tree.

**Reason**: Binary dependency + install-path assumptions + sidecar state files make the skill file itself non-portable. The *workflow patterns* it encodes — navigate → snapshot → interact via refs → diff → assert → capture evidence — are genuine portable SOPs that translate cleanly to any browser-automation tool (Playwright, Puppeteer, etc.).

**Trigger**: User says "open in browser", "test the site", "take a screenshot", "dogfood this", "verify a deployment", or "file a bug with evidence". Also fires proactively when conversation context matches QA/ship/debug stages (if proactive mode is on).

**Steps/contract** (binary-agnostic extraction):
1. **Setup check** — confirm automation binary is available; if not, offer one-time build/install before proceeding.
2. **Navigate** — go to target URL; after any navigation, run snapshot again (refs are invalidated on nav).
3. **Snapshot (interactive)** — `snapshot -i` yields interactive-element-only accessibility tree with `@e` refs; use refs as selectors for all subsequent commands.
4. **Interact** — `click @eN`, `fill @eN "value"`, `hover`, `press`, `select`, `upload`, `dialog-accept`.
5. **Diff** — `snapshot -D` after any action to see exactly what changed (unified diff of accessibility tree).
6. **Assert** — `is visible/hidden/enabled/disabled/checked/editable/focused <selector>` for state verification; `js <expr>` for arbitrary DOM checks.
7. **Evidence capture** — `screenshot` for plain PNG; `snapshot -a -o path.png` for annotated screenshot with labeled @e overlays; always read the PNG with the Read tool so the user can see it.
8. **Diagnostic capture** — `console` for JS errors/warnings; `network` for failed requests; `perf` for load timings.
9. **Responsive check** — `responsive <prefix>` for mobile/tablet/desktop screenshots at standard viewports.
10. **Human handoff** — when hitting CAPTCHA, MFA, or complex auth after 3 attempts, open a visible browser at current page; wait for user; resume from preserved state.

**Strip**: Entire preamble bash block (update-check, `~/.gstack/sessions/` session touch, `gstack-config` reads, telemetry JSONL write, `gstack-telemetry-log` call, lake intro, proactive-behavior consent, contributor-mode field-report logic, plan-status footer, telemetry footer); all `$B` / binary-specific command syntax (replace with tool-neutral pseudocode or Playwright equivalents); `./setup` build step; `AskUserQuestion` format block (gstack UX convention); voice/tone persona block; Contributor Mode section.

**Structure/format**: YAML frontmatter → preamble bash block (~100 lines) → prose conditional onboarding flows → Voice section → Contributor Mode → Completion Status Protocol → Telemetry section → Plan Status Footer → main skill body (Setup check → Core QA Patterns 1–11 → Snapshot Flags reference → Full Command Reference tables → User Handoff). The main skill body starts at `# browse: QA Testing & Dogfooding`. Command reference tables are comprehensive and well-structured; Snapshot Flags section is reusable reference material.

**Notes**: Three portable extractions stand out:
- **Snapshot-first interaction model**: the `snapshot -i` → `@e` ref → act → `snapshot -D` loop is a clean, transferable protocol for any accessibility-tree-based browser automation. The principle (work from a labeled element map, not raw selectors; diff the tree after each action) applies verbatim to Playwright's accessibility API.
- **Completion Status Protocol** (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT + 3-strike escalation rule): already flagged in the parent `gstack/SKILL.md` audit; confirmed here as the same block, reusable verbatim in any task-execution SOP.
- **Human handoff heuristic**: explicit enumeration of when to escalate to human-in-the-loop (CAPTCHA, MFA, complex OAuth, 3 failed attempts) with state-preserving handoff-and-resume pattern. This is a strong portable SOP for any agentic browser workflow that must handle auth gracefully.
The `@e` ref system (sequential numbering, tree-order assignment, invalidated on navigation) is worth documenting in a portable SOP even though the specific syntax is binary-specific — the *concept* of stable labeled element references that survive within a page context is the reusable idea.

## benchmark/SKILL.md

**Type**: Skill — performance regression detection. 9-phase workflow: page discovery (manual, auto-discover, or `--diff` branch-scoped), JS performance API data collection (`performance.getEntriesByType`), baseline capture to JSON, before/after comparison with explicit regression thresholds, slowest-resource ranking with recommendations, performance budget grading, trend analysis across historical baselines, and dual (markdown + JSON) report output. Three invocation modes: `--baseline` (capture), default (compare), `--quick` (single-pass, no baseline needed), `--diff` (branch-affected pages only), `--trend` (historical view).

**Portable**: Partially — the core methodology (establish baseline → collect real metrics → compare with explicit thresholds → grade against budget → track trends) is fully portable. The implementation is coupled to the gstack `$B` browse binary for `goto`/`perf`/`eval` commands and to the standard gstack preamble/telemetry machinery, both of which are strippable.

**Reason**: The JS performance API calls (`performance.getEntriesByType('navigation')`, `performance.getEntriesByType('resource')`) are standard browser APIs that work in any browser automation context (Playwright, Puppeteer, Selenium). The regression thresholds, budget checks, trend schema, and report format are entirely tool-agnostic once `$B eval` is replaced with equivalent browser JS execution. The `--diff` mode pattern (scope measurement to branch-affected pages via `git diff`) is a reusable CI optimization that requires no gstack infra.

**Trigger**: "performance", "benchmark", "page speed", "lighthouse", "web vitals", "bundle size", "load time"; also useful as a pre-ship gate on any PR touching frontend code.

**Steps/contract**:
1. *Setup* — create `.gstack/benchmark-reports/baselines/` dirs; compute repo slug for report naming.
2. *Page discovery* — use `--pages` list, auto-discover from navigation, or `--diff` mode: `git diff <base>...HEAD --name-only` to identify affected routes.
3. *Data collection* — for each page: navigate → `$B perf` → JS eval `performance.getEntriesByType('navigation')[0]` → extract TTFB, FCP, LCP, DOM Interactive, DOM Complete, Full Load → JS eval resource entries for top-15 slowest resources → JS eval script/CSS bundle sizes → JS eval network summary (total requests, total transfer, by-type counts).
4. *Baseline capture* (`--baseline`) — write structured JSON to `baselines/baseline.json` with url, timestamp, branch, per-page metrics (all timing + request count + transfer bytes + JS/CSS bundle bytes + largest resources list).
5. *Comparison* — if baseline exists: compute delta per metric; classify by thresholds: timing >50% OR >500ms absolute = REGRESSION; timing >20% = WARNING; bundle >25% = REGRESSION; bundle >10% = WARNING; request count >30% = WARNING. Emit ASCII comparison table per page with REGRESSION/WARNING/OK status column.
6. *Slowest resources* — rank by duration; for each: name, type, size, duration; flag third-party scripts with ← annotation; append targeted recommendations (code-splitting, async/defer, image sizing).
7. *Performance budget check* — compare against industry thresholds (FCP <1.8s, LCP <2.5s, JS <500KB, CSS <100KB, transfer <2MB, requests <50); compute pass/fail grade (A–F by ratio passing).
8. *Trend analysis* (`--trend`) — load all `baselines/*.json` sorted by date; render ASCII table (date, FCP, LCP, bundle, requests, grade); append TREND narrative if degrading.
9. *Save report* — write `.gstack/benchmark-reports/{date}-benchmark.md` and `.gstack/benchmark-reports/{date}-benchmark.json`.

**Strip**: Entire preamble bash block (update-check, `gstack-update-check`, session touch, `gstack-config`, `gstack-repo-mode`, telemetry JSONL write, `gstack-telemetry-log`); conditional onboarding flows (lake intro, telemetry consent, proactive-behavior consent); Contributor Mode section; Voice/persona section; Completion Status Protocol (portable, worth keeping); telemetry footer; plan-status footer (`gstack-review-read`, `## GSTACK REVIEW REPORT`); Browse SETUP block (replace `$B` with tool-agnostic browser automation); `gstack-slug` binary call (replace with `git rev-parse --short HEAD` or similar); `.gstack/` path convention (generalize to `.perf-reports/` or user-configurable).

**Structure/format**: Frontmatter → preamble bash block (~150 lines) → prose conditional onboarding logic (~100 lines) → Voice → Contributor Mode → Completion Status Protocol → Telemetry → Plan Status Footer → Browse SETUP → main 9-phase benchmark workflow (~200 lines with inline JS snippets and ASCII report templates). Main workflow is cleanly separable — starts at `# /benchmark — Performance Regression Detection`. The JS eval snippets are reusable verbatim in any browser automation context.

**Notes**: Two principles here are especially strong portable extractions: (1) "baseline is essential — without a baseline you can report absolute numbers but cannot detect regressions" — this is the foundational framing that makes the whole skill meaningful; it should lead any portable SOP. (2) "bundle size is the leading indicator — load time varies with network; bundle size is deterministic; track it religiously" — this reframes which metric to prioritize, which is genuinely non-obvious and actionable. The `--diff` scoping pattern (measure only pages touched by the current branch) is a clever CI optimization worth capturing as a named variant. The explicit regression thresholds (with both relative and absolute gates for timing, relative-only for bundles) are well-reasoned and immediately reusable. The trend schema and ASCII trend table are clean portable templates. The main gap is that the skill has no CI integration step — it produces reports but does not describe how to fail a build on regressions, which would be needed for the SOP to be fully actionable in a PR gate context.

## connect-chrome/SKILL.md

**Type**: Skill — launches a headed Playwright-controlled Chromium window with a gstack Chrome extension auto-loaded, enabling the user to watch every browser action in real time via a Side Panel activity feed. Six-step workflow: setup check → pre-flight cleanup → `$B connect` → `$B status` verify → AskUserQuestion Side Panel guidance (with extension-load recovery tree) → demo + sidebar-chat walkthrough.

**Portable**: No — the skill is entirely coupled to the gstack `$B` browse binary, the proprietary gstack Chrome extension, `~/.gstack/chromium-profile/` state, and the full suite of companion binaries (`gstack-update-check`, `gstack-config`, `gstack-telemetry-log`). Stripping the gstack infrastructure leaves nothing executable.

**Reason**: This is a thin UX wrapper that starts a pre-built binary and loads a proprietary extension. The underlying concept (headed browser for observability) is sound, but the implementation is 100% installation-specific. Unlike `investigate/SKILL.md` or `review/SKILL.md`, there is no workflow logic that decouples from the binary — every step is either a `$B` command, a gstack-state-file operation, or preamble machinery.

**Trigger**: "connect chrome", "open chrome", "real browser", "launch chrome", "side panel", "control my browser"

**Steps/contract**:
1. Preamble bash block — update-check, session touch, telemetry logging, lake intro, proactive-behavior consent.
2. Setup check — resolve `$B` binary path (repo-local then `~/.claude`); if absent, prompt user and run `./setup`.
3. Pre-flight cleanup — read PID from `.gstack/browse.json`; kill (SIGTERM → 1s → SIGKILL); remove Chromium profile lock files (`SingletonLock`, `SingletonSocket`, `SingletonCookie`).
4. Connect — `$B connect`; confirm output shows `Mode: headed`; if not, run `$B status` and surface output.
5. Verify — `$B status`; confirm port 34567; locate extension path for manual-load recovery.
6. Side Panel guidance — AskUserQuestion with three branches: (A) working, (B) extension not visible (walk `chrome://extensions` + Load Unpacked recovery), (C) something wrong (re-run cleanup + connect; try `$B focus`).
7. Demo — `$B goto https://news.ycombinator.com`; `$B snapshot -i`; point user to Side Panel activity feed.
8. Sidebar chat walkthrough — explain chat tab, child Claude instance, 5-minute task limit.
9. What's next narrative — browse commands, window management, per-skill headed-mode examples.
10. Telemetry footer + plan-status footer.

**Strip**: Entire preamble bash block; all `$B` binary calls; gstack extension path resolution; `~/.gstack/` state file references; Voice/persona section; AskUserQuestion 4-step format block; Completeness Principle effort table; Repo Ownership section; Search Before Building section; Contributor Mode; telemetry footer; plan-status footer. After stripping, nothing actionable remains.

**Structure/format**: Standard gstack skill file layout (YAML frontmatter → preamble → Voice → AskUserQuestion format → Completeness Principle → Repo Ownership → Search Before Building → Contributor Mode → Completion Status Protocol → Telemetry → Plan Status Footer → main skill body). Main body is ~120 lines across 6 numbered H2 steps with embedded bash blocks and a branching AskUserQuestion recovery tree.

**Notes**: Near-zero portable SOP value. The single extractable pattern is the **stale-process cleanup sequence** in Step 0: read PID from a JSON state file → SIGTERM → sleep 1 → SIGKILL → remove profile lock files. This is a reusable one-paragraph sub-pattern for any skill that manages a persistent server process (browse server, dev server, proxy). Everything else is binary glue. Do not promote this skill; skip it in the cross-repo comparison.

## guard/SKILL.md

**Type**: Composite safety skill — single activation command that layers `/careful` (destructive-command warnings) and `/freeze` (directory-scoped edit restriction) into one "full safety mode". Adds a user-prompted setup flow to capture the freeze-directory path and persist it to a state file.

**Portable**: Partially. The *composition pattern* (one activation that sets two complementary guardrails) and the freeze-dir AskUserQuestion setup flow are portable. The implementation depends on sibling skill directories (`../careful/bin/check-careful.sh`, `../freeze/bin/check-freeze.sh`) via `${CLAUDE_SKILL_DIR}` path traversal — it cannot be installed independently without those siblings present.

**Reason**: No standalone logic; all enforcement is delegated to check-careful.sh and check-freeze.sh. The skill's unique contribution is: (1) the single-activation composition of two guardrails, and (2) the setup workflow that asks for, resolves, and persists the freeze directory. The hooks declaration (`PreToolUse` on Bash/Edit/Write) is a clean, reusable pattern for combining multiple hook scripts under one skill trigger.

**Trigger**: User says "guard mode", "full safety", "lock it down", or "maximum safety"; or agent is about to operate on a production or live system requiring both destructive-op warnings and path-scoped write restriction simultaneously.

**Steps/contract**:
1. AskUserQuestion: "which directory should edits be restricted to?" (text input, not multiple choice).
2. Resolve user-provided path to absolute: `FREEZE_DIR=$(cd "<user-provided-path>" 2>/dev/null && pwd)`.
3. Append trailing slash; save to `$STATE_DIR/freeze-dir.txt` (default `$STATE_DIR = ~/.gstack`).
4. Announce two active protections: (a) destructive command warnings (from `check-careful.sh`); (b) edit boundary enforced at `<resolved-path>/` (from `check-freeze.sh`).
5. Advise: run `/unfreeze` to remove the edit boundary; guard deactivates automatically when session ends.
6. PreToolUse hooks enforce on every subsequent call: Bash → check-careful.sh; Edit + Write → check-freeze.sh.

**Strip**: Analytics bash block (`~/.gstack/analytics/skill-usage.jsonl`), `<!-- AUTO-GENERATED from SKILL.md.tmpl -->` comment, `bun run gen:skill-docs` reference, `${CLAUDE_SKILL_DIR}` token (replace with implementation-neutral language or absolute path resolution), `~/.gstack` state directory convention (generalize to configurable or repo-local state path).

**Structure/format**: YAML frontmatter (name, version, description, `allowed-tools`, `hooks` with three PreToolUse matchers) + Markdown body (~60 lines). Setup section (AskUserQuestion → resolve path → write state file → announce) + What's Protected section (defers to `/careful` and `/freeze` docs). Compact; the frontmatter hooks block is the most reusable piece verbatim.

**Notes**: Guard's standalone SOP value is modest — both `careful/SKILL.md` and `check-careful.sh` were already assessed as stronger portable candidates. What guard uniquely demonstrates is the *hook-composition pattern*: a single skill can register multiple PreToolUse matchers (Bash, Edit, Write) each invoking a different enforcement script, giving a clean way to layer orthogonal safety constraints under one activation. This pattern is worth preserving in a portable "layered safety activation" SOP. The freeze-dir AskUserQuestion setup flow (ask → resolve → trailing-slash normalize → persist) is also a clean reusable primitive for any skill that needs a user-supplied path persisted to session state.

## design-consultation/SKILL.md

**Type**: Skill — multi-phase design system creation workflow. Interviews the user for product context, optionally researches competitors (WebSearch + optional headless browse), proposes a complete design system (aesthetic, decoration, layout, color, typography, spacing, motion) with a SAFE/RISK breakdown, generates a self-contained HTML font-and-color preview page with realistic product mockups, writes DESIGN.md as project design source of truth, and appends a design-system guard to CLAUDE.md.

**Portable**: Partially. The core consultation workflow (phases 0–6), design knowledge tables, font blacklist, AI slop anti-patterns, SAFE/RISK proposal structure, three-layer competitive synthesis, coherence validation, preview page spec, and DESIGN.md template are entirely repo- and toolchain-agnostic. The gstack preamble, telemetry machinery, browse binary, Codex CLI "outside voices" integration, Voice/persona block, and gstack-specific binary calls are strippable without loss of workflow logic.

**Reason**: The methodology — product context → layered research → opinionated system proposal with explicit creative risks → coherence validation → DESIGN.md — applies to any project starting a UI with no existing design system. No gstack runtime dependency is required to follow the workflow once scaffolding is stripped. Visual research (browse binary) degrades gracefully to WebSearch + built-in knowledge, so the SOP is self-contained without it.

**Trigger**: User asks to "create a design system", "brand guidelines", or "create DESIGN.md"; new project UI is being started with no existing DESIGN.md; agent is making visual/UI decisions and no design source of truth exists.

**Steps/contract**:
- *Phase 0* — Pre-checks: scan for existing DESIGN.md (offer update/fresh/cancel); gather product context from README, package.json, directory listing.
- *Phase 1* — Product context: single AskUserQuestion covering product identity, user type, industry, project type, and competitive research preference.
- *Phase 2 (conditional)* — Research: WebSearch for 5–10 peers; optional visual capture via browse (goto → screenshot → snapshot); three-layer synthesis — (1) category table-stakes, (2) current trends, (3) first-principles departures + Eureka check (name and log any insight where conventional category design logic fails this specific product).
- *Outside Voices (optional)* — parallel Codex + Claude subagent independent design direction proposals; synthesize agreement and genuine divergence for user choice.
- *Phase 3* — Complete proposal via AskUserQuestion: all seven dimensions (aesthetic, decoration, layout, color, typography, spacing, motion) + rationale for each; mandatory SAFE/RISK breakdown — 2–3 category-baseline choices (why play safe) + 2–3 deliberate departures (what is gained, what is risked).
- *Phase 4 (conditional)* — Drill-downs on any dimension the user wants to adjust; re-check coherence after each override.
- *Phase 5* — Generate self-contained HTML preview: loads proposed fonts, dogfoods the color palette, shows font specimens in proposed roles, renders realistic product mockups (by project type: dashboard, marketing, settings/admin, auth), includes light/dark toggle; open in browser.
- *Phase 6* — Write DESIGN.md (product context, aesthetic, typography, color, spacing, layout, motion, decisions log) + append design-system guard section to CLAUDE.md.

**Strip**: Entire preamble bash block (update-check, session-touch, telemetry logging, lake intro, proactive-behavior consent, contributor-mode logging); Voice/persona section (Garry Tan persona and writing rules — ~150 lines); AskUserQuestion 4-step re-ground/simplify/recommend/options format block; Completeness Principle effort table; Contributor Mode; Repo Ownership / REPO_MODE logic; Search Before Building section (covered by ETHOS.md SOP); Telemetry footer; Plan Status Footer (`gstack-review-read`, GSTACK REVIEW REPORT); all `gstack-*` binary calls (`gstack-config`, `gstack-repo-mode`, `gstack-slug`, `gstack-review-log`, `gstack-telemetry-log`, `gstack-update-check`); browse binary `$B` setup check (keep WebSearch + built-in fallback path as the baseline); Codex CLI "outside voices" integration (keep the *concept* of parallel independent perspectives as an optional enhancement, strip the binary).

**Structure/format**: YAML frontmatter → preamble bash block → onboarding conditional prose → Voice section → AskUserQuestion format → Completeness Principle → Repo Ownership → Search Before Building → Contributor Mode → Completion Status Protocol → Telemetry → Plan Status Footer → main skill body (Phase 0–6 with embedded bash illustration blocks, design knowledge tables, coherence validation, important rules). Core skill body is ~350 lines with clear phase headings; portable core extracts cleanly to ~200–250 lines. DESIGN.md template and design knowledge tables are reusable verbatim.

**Notes**: Four sub-components stand out as especially strong portable candidates:
- **SAFE/RISK breakdown** — the strongest extractable primitive. Mandatory split between category-baseline choices and deliberate departures, each with a rationale for playing safe vs. taking the risk. Most design SOPs are either fully prescriptive or fully unconstrained; this frames creative risk as a structured, required output. Directly prevents generic "coherent but indistinguishable" design systems.
- **Three-layer competitive synthesis** — adapts the ETHOS.md research model (tried-and-true → current → first-principles + Eureka) specifically to design research. Reusable verbatim as a competitive analysis pattern in any domain where category-norms vs. differentiation tension exists.
- **AI slop anti-patterns list** — unusually concrete: purple/violet gradients, 3-column icon grids with colored circles, centered everything, uniform bubbly border-radius, gradient CTAs, stock-photo hero sections. Names specific failure modes that most design guidance avoids specifying. Portable as a negative constraint block in any design SOP or review checklist.
- **Font blacklist + overused fonts lists** — actionable, specific, zero ambiguity. The distinction between hard-blacklist (Papyrus, Comic Sans, etc.) and soft-avoid (Inter, Roboto, etc. — usable only if explicitly requested with tradeoff explained) is a clean two-tier policy worth preserving in any typography SOP.
- **Coherence validation** — after any user override, check whether the override mismatches the rest of the system and flag with a nudge (never block). The three example mismatches (brutalist + expressive motion, expressive color + restrained decoration, editorial layout + data-dense product) are concrete and reusable as a coherence checklist.
- **DESIGN.md template** — complete schema (product context, aesthetic, typography with CDN strategy and scale, color with dark-mode strategy, spacing scale, layout grid, motion easing/duration, decisions log) is immediately portable as a design system document standard.
- **CLAUDE.md guard injection** — appending a "always read DESIGN.md before any visual decision" rule to CLAUDE.md is a smart enforcement pattern for making the design system durable across future sessions; portable as a general "load standing constraints into session config" SOP.

## design-review/SKILL.md

**Type**: Live-site design QA skill — screenshot-driven visual audit + atomic fix loop. Eleven phases: First Impression → Design System Extraction → Page-by-Page Audit (10-category ~80-item checklist) → Interaction Flows → Cross-Page Consistency → Report → Triage → Fix Loop → Final Audit → Final Report → TODOS sync.

**Portable**: Partially — roughly 40% portable. The 10-category visual audit checklist (~80 items with precise thresholds), AI Slop blacklist (10 named anti-patterns), Design Hard Rules classifier (MARKETING/LANDING PAGE vs APP UI vs HYBRID + 7 litmus checks + hard rejection criteria), dual-headline scoring system (Design Score + AI Slop Score, per-category A–F grades with computation rules and category weights), design critique format (I notice / I wonder / What if / I think…because…), fix-loop discipline (one commit per fix, CSS-first, risk heuristic, hard cap), and Completion Status Protocol are all repo-agnostic. The execution layer is tightly coupled to the `$B` browse binary.

**Reason**: Every navigation, screenshot, JS injection, responsive capture, and console-error command in Phases 1–9 depends on the `$B` browse binary (`~/.claude/skills/gstack/browse/dist/browse`), which requires a one-time build and a dedicated installation tree. Without it the workflow cannot execute as written. The preamble is the standard gstack product machinery (update-check, telemetry opt-in flows, lake intro, proactive-behavior consent). The Voice/persona block is the full Garry Tan persona (~150 lines). The test framework bootstrap section (~300 lines, Phases B2–B8) is a shared sub-workflow also embedded in `ship/SKILL.md` — not design-specific. The audit *methodology* (what to look for and how to evaluate it) is entirely tool-agnostic and translates cleanly to any browser automation tool (Playwright, Puppeteer, etc.).

**Trigger**: User asks to "audit the design", "visual QA", "check if it looks good", or "design polish"; agent is operating on a branch that touches frontend files; agent detects visual inconsistencies in a live or local app.

**Steps/contract** (gstack machinery stripped):
1. Establish target URL, scope, depth, auth; detect feature branch for diff-aware mode (scope pages to changed routes).
2. Check for DESIGN.md or equivalent design-system doc; read if present; calibrate findings against it.
3. Ensure clean working tree; commit or stash dirty changes before proceeding.
4. **Phase 1 — First Impression**: full-page screenshot → structured critique: (a) "The site communicates…", (b) "I notice…", (c) "First 3 eye targets: 1, 2, 3", (d) "One word: …".
5. **Phase 2 — Design System Extraction**: extract fonts, colors, heading scale, spacing patterns via browser JS; flag >3 font families, >12 non-gray colors, skipped heading levels, non-scale spacing; offer to save inferred system as DESIGN.md.
6. **Phase 3 — Page-by-Page Visual Audit**: apply 10-category checklist per page (Visual Hierarchy, Typography, Color & Contrast, Spacing & Layout, Interaction States, Responsive, Motion & Animation, Content & Microcopy, AI Slop Detection, Performance as Design); each finding rated high/medium/polish; capture annotated screenshots and responsive screenshots at 375/768/1024/1440px.
7. **Phase 4 — Interaction Flow Review**: walk 2–3 key user flows; evaluate response feel, transition quality, feedback clarity, form polish.
8. **Phase 5 — Cross-Page Consistency**: compare nav, footer, component reuse, tone, spacing rhythm across all reviewed pages.
9. **Phase 6 — Compile Report**: dual headline scores; per-category grades; save `design-baseline.json` for regression mode.
10. **Phase 7 — Triage**: sort findings by impact (high → medium → polish); mark deferred items (non-source-fixable).
11. **Phase 8 — Fix Loop**: per-finding: locate source → minimal fix (CSS-first) → one commit (`style(design): FINDING-NNN — description`) → before/after screenshots → verify or revert. Risk heuristic: CSS-only +0%, JSX/TSX +5%/file, each revert +15%, touching unrelated files +20%; pause at >20% risk; hard cap of 30 fixes.
12. **Phase 9 — Final Audit**: re-run checklist on affected pages; warn prominently if scores regress.
13. **Phase 10 — Final Report**: per-finding fix status (verified/best-effort/reverted/deferred) + commit SHA + before/after screenshots; PR summary line ("Design review found N issues, fixed M. Score X→Y, AI slop X→Y.").
14. **Phase 11 — TODOS sync**: add deferred findings to TODOS.md; annotate fixed items with branch and date.

**Strip**: Entire preamble bash block (update-check, session-touch, `gstack-*` config reads, telemetry JSONL logging, lake intro, proactive-behavior consent, contributor-mode field-report logic); Voice/persona section (~150 lines, Garry Tan); AskUserQuestion 4-step format block; Completeness Principle effort table; all `$B` command references (replace with tool-agnostic language: "navigate to page", "take full-page screenshot", "execute JS in browser context", "capture responsive screenshots"); test framework bootstrap section (Phases B2–B8, ~300 lines — large shared sub-workflow, not design-specific); all `~/.gstack/` and `.gstack/` output paths (generalize); CDP mode detection; `gstack-slug` and `gstack-review-log` binary calls; Codex CLI calls in "Design Outside Voices" (keep the parallel-subagent pattern, strip binary dependency).

**Structure/format**: ~1222 lines, single file. Standard gstack structure: YAML frontmatter → preamble bash → Voice → AskUserQuestion format → Completeness Principle → Contributor Mode → Completion Status Protocol → Telemetry footer → Plan Status Footer → main skill body (11 phases). Main body is well-organized with H2 phase headers, detailed checklists, bash blocks, and ASCII output templates. Portable core (all phases + checklist + scoring + fix loop) extracts to ~400–500 lines.

**Notes**: Three extractions are unusually strong:
- **AI Slop blacklist**: Ten named anti-patterns ("3-column feature grid: icon-in-colored-circle + bold title + 2-line description repeated 3×" is the most specific) make this the most concrete and actionable design anti-pattern catalogue in the reference set. Most design SOPs are vague about what "bad" looks like; this names exact patterns with zero ambiguity.
- **Design Hard Rules classifier**: The MARKETING/LANDING PAGE vs APP UI vs HYBRID classifier with hard rejection criteria and 7 yes/no litmus checks gives agents a structured, decision-tree framework for calibrating design standards to page type — not seen in any other reference skill.
- **Fix-loop discipline**: One-commit-per-fix, CSS-first, quantified design-fix risk heuristic (specific % increments per action type), hard cap of 30 fixes, and automatic revert-on-regression are unusually precise operational guardrails that prevent scope creep and regression during automated visual fixing. The risk heuristic's CSS-only = +0% exemption is a smart carve-out that prevents alert fatigue on low-risk changes.
The 10-category checklist uses concrete numeric thresholds throughout (45–75 chars line measure, 44px touch targets, 16px body minimum, 1.5× line-height, 4/8px spacing base, LCP <2.0s, CLS <0.1) — higher specificity than typical design review checklists.

## gstack-upgrade/SKILL.md

**Type**: Skill — self-updater for the gstack tool. Detects install type (global-git, local-git, vendored, vendored-global), runs the upgrade via git pull or clone-replace, syncs any secondary vendored copy from the freshly-upgraded primary, writes a marker file, clears the update-check cache, and displays a CHANGELOG diff summary. Two usage modes: inline (triggered by an `UPGRADE_AVAILABLE` signal emitted from other skills' preambles) and standalone (`/gstack-upgrade`).

**Portable**: No — as a complete skill. The embedded *patterns* are partially portable but the skill as a whole is pure product infrastructure for gstack's own lifecycle management.

**Reason**: Every install path, binary reference, and state-file convention is gstack-specific (`~/.claude/skills/gstack/`, `~/.gstack/`, `gstack-config`, `gstack-update-check`, `~/.gstack/update-snoozed`). The trigger ("upgrade gstack") is maximally narrow. No meaningful workflow can be lifted verbatim to another tool or repo without complete rewriting. Three embedded *patterns* are portable in isolation: (1) multi-install-type detection (global vs local vs vendored), (2) escalating snooze backoff for soft update prompts, and (3) primary-to-secondary vendored-copy sync after upgrade.

**Trigger**: User says "upgrade gstack", "update gstack", or "get latest version". Also fires inline whenever another skill's preamble emits `UPGRADE_AVAILABLE <old> <new>`.

**Steps/contract**:
1. *Auto-upgrade check* — read `GSTACK_AUTO_UPGRADE` env var and `gstack-config get auto_upgrade`; if true, skip prompt and proceed; otherwise present four options: Yes / Always keep me up to date / Not now / Never ask again.
2. *Snooze state* — "Not now" writes escalating backoff (1st snooze = 24 h, 2nd = 48 h, 3rd+ = 1 week) to `~/.gstack/update-snoozed` with version + level + timestamp.
3. *Install-type detection* — bash block enumerates six install locations in order (global-git, alt-global-git, local-git, local-agents-git, local-vendored, global-vendored) and sets `INSTALL_TYPE` + `INSTALL_DIR`.
4. *Save old version* — `cat "$INSTALL_DIR/VERSION"`.
5. *Upgrade* — git installs: `git stash && git fetch && git reset --hard origin/main && ./setup` (warn if stash saved). Vendored installs: clone fresh into tmp → swap directories using `.bak` → `./setup` → remove backup.
6. *Sync secondary copy* — detect whether a local vendored copy exists alongside the primary; if so, `cp -Rf` from primary, strip `.git`, run `./setup`; restore from `.bak` on failure.
7. *Marker + cache clear* — write `~/.gstack/just-upgraded-from`, delete `~/.gstack/last-update-check` and `~/.gstack/update-snoozed`.
8. *What's New* — read CHANGELOG.md, extract entries between old and new version, summarize as 5–7 themed bullets; emit formatted banner, then resume the originally-invoked skill.

**Strip**: Everything gstack-specific — `gstack-config` / `gstack-update-check` binaries, all `~/.gstack/` path conventions, `~/.claude/skills/gstack/` install paths, `UPGRADE_AVAILABLE` preamble signal protocol. To generalize: replace binary calls with configurable environment variables and replace hardcoded paths with a parameterized `TOOL_INSTALL_DIR`.

**Structure/format**: Single YAML-frontmattered Markdown file (~180 lines). Clearly split into two modes (inline preamble-triggered vs standalone) with numbered sub-steps under each. Bash blocks are illustrative and self-contained. No external template dependency. Well-structured but purpose-built — the structure doesn't transfer; the embedded patterns do.

**Notes**: The escalating snooze backoff (24 h → 48 h → 1 week) with per-version tracking is a thoughtful UX detail that prevents update-prompt fatigue without silently disabling checks — worth extracting as a one-page "soft update notification" SOP pattern. The dual-location sync (Step 6) solves a real edge case in repos that vendor a global tool locally: the global install upgrades, the local vendored copy goes stale, and the user unknowingly runs different versions. The failure-recovery pattern (`.bak` swap + restore on `./setup` failure) is a solid atomic-upgrade convention. None of these rise to the level of a top-tier portable SOP candidate on their own, but together they form a reasonable "tool self-upgrade" reference pattern if a similar need arises elsewhere.

## plan-design-review/SKILL.md

**Type**: Skill — interactive plan-stage UI/UX design review. Multi-pass 7-dimension rating system (0–10 per pass), designer's-eye audit over Information Architecture, Interaction State Coverage, User Journey/Emotional Arc, AI Slop Risk, Design System Alignment, Responsive & Accessibility, and Unresolved Design Decisions. Includes optional cross-model "outside voices" (Codex + Claude subagent) with litmus scorecard and consensus scoring. Output is an improved plan, not a report about it.

**Portable**: Partially — the 7-pass review methodology, AI Slop blacklist, design hard rules (classifier + landing page / app UI / universal rulesets), 12 cognitive pattern heuristics, 9 design principles, 0-10 gap/fix/re-rate loop, interaction-state coverage table, and unresolved-decisions tracking are all entirely repo- and toolchain-agnostic. The gstack product scaffolding (preamble, telemetry, update-check, lake intro, proactive-behavior flow, Codex CLI, `gstack-*` binaries, Garry Tan voice persona, contributor mode, plan-status footer, review dashboard) is gstack-specific and cleanly separable.

**Reason**: The core workflow (Pre-review system audit → Step 0 scope + rating → 7 passes → Completion Summary + TODOS) requires no gstack tooling to execute. The AI Slop blacklist (10 named anti-patterns), design hard-rule classifier (marketing vs. app UI vs. hybrid with separate rule sets), 7 litmus checks, and interaction-state table are universally applicable. The UI Scope Detection gate (backend-only plan → exit early) and the "decision deferred" tracker in the Completion Summary are useful guardrails regardless of toolchain. What is gstack-specific: preamble bash block, telemetry footer, plan-status footer, Codex CLI bash blocks, all `gstack-*` / `~/.gstack/` binary and state references, Voice/persona section (~150 lines of Garry Tan framing), AskUserQuestion 4-step re-ground wrapper, Completeness Principle effort table, Contributor Mode field-report filing, Eureka moment logging.

**Trigger**: Any plan with UI/UX scope before implementation starts; user says "review the design plan", "design critique", or requests a design review of a plan. Proactively suggest when a visible plan contains new UI screens, user-facing interactions, or frontend framework changes.

**Steps/contract**:
1. **Pre-review system audit** — `git log --oneline -15`, `git diff <base> --stat`; read CLAUDE.md, DESIGN.md (if present), TODOS.md. Map UI scope; check for prior design review entries; detect existing design patterns to reuse. Report findings. **UI Scope gate**: if the plan touches no new/changed UI, emit "no UI scope" and exit.
2. **Step 0 — Scope Assessment** — (0A) Rate overall design completeness 0–10 and explain what a 10 looks like for *this* plan. (0B) DESIGN.md status — if absent, flag gap and recommend a design consultation first. (0C) Identify existing design leverage (components, tokens, patterns to reuse). (0D) AskUserQuestion: confirm focus areas before proceeding. **Stop until user responds.**
3. **Optional outside voices** — AskUserQuestion: run Codex design critique + Claude subagent independent review? If yes, dispatch both; synthesize into a 7-row litmus scorecard (Claude / Codex / Consensus columns). Hard rejections surface as first items in Pass 1 tagged `[HARD REJECTION]`.
4. **Pass 1 — Information Architecture** — Rate 0–10. Fix to 10: add ASCII hierarchy diagram + navigation flow. Apply constraint worship (if only 3 things, which 3?).
5. **Pass 2 — Interaction State Coverage** — Rate 0–10. Fix to 10: add state table (FEATURE × LOADING / EMPTY / ERROR / SUCCESS / PARTIAL); each cell describes what the user *sees*, not backend behavior. Empty states must have warmth, primary action, and context.
6. **Pass 3 — User Journey & Emotional Arc** — Rate 0–10. Fix to 10: add storyboard (STEP / USER DOES / USER FEELS / PLAN SPECIFIES?); apply 5-sec visceral / 5-min behavioral / 5-year reflective time-horizon design.
7. **Pass 4 — AI Slop Risk** — Rate 0–10. Classify plan as MARKETING / APP UI / HYBRID. Check 10-pattern AI Slop blacklist (3-column feature grid, purple gradient, icons in circles, centered everything, uniform border-radius, blobs/wavy dividers, emoji as design elements, colored left-border cards, generic hero copy, cookie-cutter section rhythm). Apply matching hard-rule set. Replace vague UI descriptions with specific alternatives (font, spacing scale, interaction pattern).
8. **Pass 5 — Design System Alignment** — Rate 0–10. If DESIGN.md exists, annotate with specific tokens/components. If absent, flag gap. Flag any new component that doesn't fit existing vocabulary.
9. **Pass 6 — Responsive & Accessibility** — Rate 0–10. Fix to 10: add per-viewport layout specs (not "stacked on mobile"), keyboard nav patterns, ARIA landmarks, 44px touch targets, contrast requirements.
10. **Pass 7 — Unresolved Design Decisions** — Surface ambiguities with a DECISION NEEDED / IF DEFERRED WHAT HAPPENS table. One AskUserQuestion per decision; add each resolved decision to the plan.
11. **Required outputs** — "NOT in scope" section (deferred decisions with rationale), "What already exists" section (DESIGN.md / patterns / components to reuse), TODOS.md updates (one AskUserQuestion per item), Completion Summary table (per-pass before/after scores, decisions made/deferred, overall score arc).

**Strip**: Entire preamble bash block (update-check, session-touch, `~/.gstack/sessions/`, telemetry JSONL, lake intro, proactive-behavior consent); telemetry footer bash block; plan-status footer (`gstack-review-read`, `## GSTACK REVIEW REPORT`); Voice/persona section (Garry Tan, ~150 lines of tone and writing rules); AskUserQuestion 4-step re-ground format wrapper (keep the decision structure — re-ground + simplify + recommend + options — but strip the gstack-branded framing); Completeness Principle effort table; Contributor Mode field-report logic; Eureka moment logging; all `gstack-*` binary calls (`gstack-review-log`, `gstack-review-read`, `gstack-telemetry-log`, `gstack-config`, `gstack-update-check`); Codex CLI bash blocks in "Design Outside Voices" (keep the Claude subagent adversarial pattern, strip the binary); `~/.gstack/` and `~/.claude/skills/gstack/` path conventions; Review Readiness Dashboard section (gstack review-infra dashboard, not portable); base-branch detection Step 0 block (useful utility — conditionally retain as a standalone sub-step, or reference the shared base-branch detection SOP from `review/SKILL.md`).

**Structure/format**: ~950-line single file. Preamble bash block → prose conditional onboarding flows → Voice → AskUserQuestion format → Completeness Principle → Repo Ownership → Search Before Building → Contributor Mode → Completion Status Protocol → Telemetry → Plan Status Footer → platform detection → main skill body. Core skill body (from the `# /plan-design-review` heading) is ~480 lines and cleanly separable. The 7-pass structure maps directly to a standalone SOP; each pass is independently useful.

**Notes**: Four sub-components are especially strong portable candidates: (1) **AI Slop blacklist** — the most concrete UI anti-pattern list in the reference set; 10 named patterns with a classifier (marketing/app UI/hybrid) and matching hard-rule sets make judgments *debuggable* rather than subjective. (2) **Interaction State Coverage table** (loading/empty/error/success/partial × each UI feature) — forces state completeness at plan stage where it is cheapest to resolve; most design review SOPs address only the happy path. (3) **0-10 gap/fix/re-rate loop** (rate → explain what a 10 looks like → fix the plan → re-rate → AskUserQuestion only on genuine choices) — prevents both rubber-stamping and review paralysis; the "escape hatch" rule (obvious fix → state and apply without a question) is a critical efficiency guardrail. (4) **12 Design Cognitive Patterns** + **9 Design Principles** — unusually well-sourced (Rams, Norman, Nielsen, Gestalt, Ira Glass, Jony Ive, Gebbia) and translated into actionable reviewer instincts rather than aspirational theory. The Completion Summary's "decisions deferred" counter ensures design ambiguities don't silently become implementation choices — a subtle but high-value quality gate.

## plan-ceo-review/SKILL.md

**Type**: Skill — CEO/founder-mode plan review. Four selectable review modes (SCOPE EXPANSION, SELECTIVE EXPANSION, HOLD SCOPE, SCOPE REDUCTION) applied across a PRE-REVIEW SYSTEM AUDIT and 11 review sections: architecture, error & rescue map, security, data flow & UX edge cases, code quality, tests, performance, observability, deployment, long-term trajectory, and design/UX. Wrapped in the standard gstack preamble/telemetry machinery (~400 lines of scaffolding) plus a Garry Tan/YC voice persona (~150 lines), gstack review-log infrastructure, and several optional integrations (office-hours inline, Codex CLI outside voice, spec review loop, handoff notes, CEO plan persistence).

**Portable**: Partially — the 4-mode framework, premise challenge, dream state mapping, implementation alternatives template, temporal interrogation, 8 prime directives, error & rescue map table, and all 11 review section specifications are fully portable; the gstack scaffolding is cleanly separable.

**Reason**: The intellectual core — structured premise challenge, mode-aware scope analysis, mandatory implementation alternatives, hour-by-hour temporal interrogation, and 11 engineering review dimensions — requires no gstack tooling. What is non-portable is the preamble bash block (~150 lines of update-check/session/telemetry/lake-intro/proactive-consent machinery), the Garry Tan voice/persona section, the AskUserQuestion 4-step format with Completeness scores, the gstack-slug/gstack-review-log/gstack-review-read binary calls, the office-hours inline invocation, the CEO plan persistence to `~/.gstack/projects/`, the spec review loop via Agent tool with gstack infra, the Review Readiness Dashboard, and the handoff-note/design-doc detection tied to gstack project file conventions.

**Trigger**: Agent is asked to "think bigger", "expand scope", "strategy review", "rethink this", or "is this ambitious enough"; user is questioning scope or ambition of a plan; plan is greenfield (default EXPANSION), iteration on existing system (default SELECTIVE EXPANSION), bug fix or refactor (default HOLD SCOPE), or touches >15 files (suggest REDUCTION).

**Steps/contract**:
1. **PRE-REVIEW SYSTEM AUDIT** — `git log --oneline -30`, `git diff <base> --stat`, `git stash list`, TODO/FIXME grep, recently-touched-file hotspot. Read CLAUDE.md, TODOS.md, architecture docs. Map in-flight state, known pain points, retrospective check for recurring problem areas.
2. **Step 0A — Premise Challenge** — Three questions: (1) Is this the right problem? (2) What is the actual user/business outcome — is the plan the most direct path? (3) What happens if we do nothing?
3. **Step 0B — Existing Code Leverage** — Map every sub-problem to existing code. Flag any rebuild-vs-refactor decision.
4. **Step 0C — Dream State Mapping** — Produce: `CURRENT STATE → THIS PLAN → 12-MONTH IDEAL`.
5. **Step 0C-bis — Implementation Alternatives (mandatory)** — Produce 2–3 approaches using `APPROACH A/B/C` template (name, summary, effort S/M/L/XL, risk Low/Med/High, pros, cons, reuses). One approach must be minimal viable; one must be ideal architecture. Recommend and get user approval before proceeding.
6. **Step 0D — Mode-Specific Analysis** — EXPANSION: 10x check + platonic ideal + delight opportunities + opt-in ceremony (one AskUserQuestion per scope proposal). SELECTIVE EXPANSION: hold scope first, then cherry-pick ceremony (neutral posture, one question per expansion). HOLD SCOPE: complexity check + minimum-change identification. SCOPE REDUCTION: ruthless cut + must-ship-together vs. can-defer split.
7. **Step 0E — Temporal Interrogation** — Surface implementation decisions that need resolution now, not later: Hour 1 (foundations), Hour 2–3 (core logic ambiguities), Hour 4–5 (integration surprises), Hour 6+ (polish/test unknowns).
8. **Step 0F — Mode Selection** — Present 4 modes with context-dependent defaults; commit fully once selected; never silently drift.
9. **Sections 1–11** — Architecture (dependency graph, 4-path data flow, state machines, scaling, security, rollback), Error & Rescue Map (METHOD→EXCEPTION→RESCUE ACTION→USER SEES table; catch-all smell rule), Security (attack surface, input validation, authorization, injection, audit logging), Data Flow & UX Edge Cases (ASCII flow diagrams, interaction edge-case table), Code Quality (DRY, naming, cyclomatic complexity), Tests (new-thing diagram, happy/failure/edge specs, test pyramid, E2E decision matrix), Performance (N+1, indexes, caching, p99 estimates), Observability (logs, metrics, traces, alerts, dashboards, runbooks), Deployment (migration safety, feature flags, rollout order, rollback steps, smoke tests), Long-Term Trajectory (debt, path dependency, reversibility 1–5, 1-year question), Design/UX (information architecture, interaction-state coverage map, DESIGN.md alignment, responsive, accessibility — skip if no UI scope).
10. **Required Outputs** — NOT in scope list, "what already exists" list, dream state delta, Error & Rescue Registry, Failure Modes Registry (CRITICAL GAP = RESCUED=N + TEST=N + USER SEES=Silent), TODOS proposals (one AskUserQuestion per TODO, never batched), mandatory diagrams (architecture, data flow, state machine, error flow, deployment sequence, rollback flowchart), Completion Summary table.

**Strip**: Entire preamble bash block (update-check, `~/.gstack/sessions/` touch, telemetry JSONL, lake intro, proactive-behavior consent); Garry Tan / YC voice and persona section; AskUserQuestion 4-step re-ground/simplify/recommend/options format with Completeness X/10 scoring; Completeness Principle effort table; Search Before Building + Eureka eureka.jsonl logging; Contributor Mode field-report filing; Telemetry footer bash block; Plan Status Footer (`gstack-review-read` + `## GSTACK REVIEW REPORT`); office-hours inline invocation and handoff-note detection; design-doc check (gstack project file paths); Step 0D-POST CEO plan persistence (`gstack-slug`, `~/.gstack/projects/ceo-plans/`); Spec Review Loop (Agent tool with gstack adversarial infrastructure); Review Log (`gstack-review-log` binary); Review Readiness Dashboard (`gstack-review-read` binary); Next Steps review-chaining recommendations (gstack chain); docs/designs Promotion (`gstack-slug`); Handoff Note Cleanup; Outside Voice (`codex exec` CLI + `gstack-review-log`); Landscape Check (ETHOS.md reference); `_CONTRIB` contributor mode checks throughout.

**Structure/format**: Single file, ~1495 lines. YAML frontmatter → preamble bash block → prose conditional onboarding → Voice/persona → AskUserQuestion format → Completeness Principle → Contributor Mode → Completion Status Protocol → Telemetry → Plan Status Footer → PRE-REVIEW SYSTEM AUDIT → Step 0 (0A–0F substeps) → Sections 1–11 → Required Outputs → Post-Implementation note → Formatting Rules → Mode Quick Reference ASCII table. Portable core (Step 0 + Sections 1–11 + Required Outputs + Mode Reference) is ~650–700 lines once scaffolding is stripped. Well-organized with H2 section headers; each review section follows the same pattern: evaluation criteria → table or ASCII template → STOP rule → mode-specific additions.

**Notes**: Five extractions stand out as especially strong:
1. **4-mode review framework** — EXPANSION/SELECTIVE/HOLD/REDUCTION with context-dependent defaults (greenfield→EXPANSION, bug fix→HOLD, >15 files→suggest REDUCTION) is the most complete scope-calibration taxonomy seen in this reference set. The mode quick-reference table is a clean decision aid reusable verbatim.
2. **Implementation Alternatives template (Step 0C-bis)** — the APPROACH A/B/C table (effort/risk/pros/cons/reuses) with the one-minimal + one-ideal-architecture constraint is an immediately reusable mandatory pre-review artifact. Most review SOPs skip this entirely.
3. **8 Prime Directives** — zero silent failures, every error has a name, shadow paths (nil/empty/error alongside happy), interaction edge cases, observability-as-scope, mandatory diagrams, deferred work must be written, optimize for 6-month future. Each is action-triggering and specific; the set is the strongest standalone engineering-review policy block in the reference set.
4. **Error & Rescue Map (Section 2)** — the two-part table (METHOD/CODEPATH→EXCEPTION CLASS, then EXCEPTION→RESCUED?→RESCUE ACTION→USER SEES) with the "catch-all is always a smell" and "swallow and continue is almost never acceptable" rules is the most explicit error-mapping template seen in this audit. The `← GAP` annotation convention is immediately reusable.
5. **Temporal Interrogation (Step 0E)** — surfacing Hour 1/2-3/4-5/6+ implementation decisions before coding starts is a novel technique not seen elsewhere in the reference set. Prevents the common failure mode where reviewers sign off on a plan whose ambiguities only surface during implementation.
The 17 CEO cognitive patterns (classification instinct, inversion reflex, focus as subtraction, speed calibration, proxy skepticism, etc.) add genuine reasoning heuristics but are framed through Garry Tan's persona. A portable version should strip the attribution and present as named reasoning principles with triggers (e.g., "Inversion Reflex: for every 'how do we win?' also ask 'what would make us fail?'"). The CRITICAL RULE on questions ("one issue = one question; describe with file:line; escape hatch when fix is obvious") is a strong interaction-quality rule portable to any review or debug skill.

## office-hours/SKILL.md

**Type**: Two-mode ideation/validation skill — Startup mode (YC Office Hours 6-question demand-validation framework) and Builder mode (design thinking for side projects, hackathons, open source). Produces a structured design doc. Explicitly prohibits any implementation output ("HARD GATE: do NOT write any code").

**Portable**: Partially. The six forcing questions, Builder mode generative questions, Phase 3 Premise Challenge, Phase 4 Alternatives Generation, and both design-doc templates are fully org-agnostic and portable. The gstack preamble machinery, Garry Tan/YC persona, Phase 4.5 Founder Signal Synthesis, and Phase 6 YC application pitch are gstack-specific product features that should be stripped.

**Reason**: The core questioning protocol and design-doc workflow require no gstack tooling — no binaries, no `~/.gstack/` state, no telemetry. The YC pitch funnel (Phase 6) is deeply tied to the gstack product brand and the Garry Tan identity. The template placeholders (`{{PREAMBLE}}`, `{{CODEX_SECOND_OPINION}}`, `{{DESIGN_SKETCH}}`, `{{SPEC_REVIEW_LOOP}}`) expand to gstack-specific binaries but the surrounding workflow logic is clean. Note: the generated `SKILL.md` terminates mid-preamble because the main skill body lives entirely in `SKILL.md.tmpl` — auditing only the generated file gives an incomplete picture.

**Trigger**: User says "brainstorm this", "I have an idea", "help me think through this", "office hours", or "is this worth building". Proactively before any code is written; specifically before any planning or implementation skill runs.

**Steps/contract**:
- *Phase 1 — Context gathering*: Read CLAUDE.md, TODOS.md, `git log --oneline -30`; list existing design docs; AskUserQuestion to determine goal (startup / intrapreneurship / hackathon / open source / learning / having fun) and map to Startup or Builder mode; assess product stage (pre-product / has users / has paying customers).
- *Phase 2A — Startup mode*: Six forcing questions asked ONE AT A TIME via AskUserQuestion, with smart routing by product stage (pre-product → Q1/Q2/Q3; has users → Q2/Q4/Q5; has paying customers → Q4/Q5/Q6): Q1 Demand Reality (behavior, not interest), Q2 Status Quo (concrete current workaround + cost), Q3 Desperate Specificity (name an actual person, role, consequences), Q4 Narrowest Wedge (smallest payable version this week), Q5 Observation (watched someone use it, specific surprise), Q6 Future-Fit (product becomes more or less essential in 3 years, with specific thesis). Anti-sycophancy rules and 5 named pushback patterns govern response posture. Escape hatch: after 2 pushbacks, ask 2 more critical questions then proceed; after second pushback, proceed immediately.
- *Phase 2B — Builder mode*: 5 generative questions (coolest version, who to show, fastest path to something usable, existing closest thing, 10x version). Enthusiastic collaborator posture, not interrogative. Vibe-shift detection: if user pivots to startup framing mid-session, upgrade to Startup mode.
- *Phase 2.5 — Related design discovery*: Keyword grep across prior design docs in project directory; surface overlaps via AskUserQuestion ("build on prior design or start fresh?").
- *Phase 2.75 — Landscape awareness*: Privacy-gated WebSearch using generalized category terms (never the user's specific idea); 3-layer synthesis (Layer 1: conventional wisdom; Layer 2: current discourse; Layer 3: where conventional wisdom is wrong given this session's evidence); Eureka check with explicit naming and logging.
- *Phase 3 — Premise Challenge*: 4 premises: (1) right problem?, (2) what happens if we do nothing?, (3) existing code that partially solves this?, (4) distribution plan for any new artifact. Output as explicit agree/disagree statements via AskUserQuestion; loop back on disagreement. Startup mode: synthesize Phase 2A evidence against premises.
- *Phase 4 — Alternatives Generation (mandatory)*: 2–3 approaches (Approach A summary/effort/risk/pros/cons/reuses format); always includes: minimal viable (smallest diff, ships fastest) + ideal architecture (best long-term trajectory) + optional creative/lateral; RECOMMENDATION with rationale; present via AskUserQuestion, do NOT proceed without approval.
- *Phase 4.5 — Founder Signal Synthesis*: Track 8 named signals (real problem, specific users, pushback on premises, domain expertise, taste, agency, defended premise with reasoning against cross-model challenge, etc.) to determine Phase 6 pitch tier.
- *Phase 5 — Design doc*: Written to `~/.gstack/projects/{slug}/{user}-{branch}-design-{datetime}.md`. Startup template: problem statement, demand evidence, status quo, target user + narrowest wedge, constraints, premises, cross-model perspective (only if second opinion ran), approaches, recommendation, open questions, success criteria, distribution plan, "The Assignment" (one concrete real-world action), "What I noticed about how you think" (quote their words, not characterization). Builder template: same structure minus demand-evidence and status-quo sections; adds "What Makes This Cool" and "Next Steps". Design lineage: `Supersedes:` field if a prior design doc exists on the same branch. Present for AskUserQuestion approval (Approve / Revise / Start over).
- *Phase 6 — Handoff (Founder Discovery)*: Three beats: (1) signal reflection with specific session callbacks (quote their words, not characterization of behavior); (2) separator + "One more thing."; (3) Garry's Personal Plea in one of three tiers (top: ≥3 signals including named user/revenue/real demand → "GStack thinks you are among the top people who could do this" + YC apply prompt; middle: 1-2 signals → validation + curiosity pitch; base: everyone else → identity-expansion pitch). YC application link opens on yes, no pressure on no. Next-skill recommendations: `/plan-ceo-review` (EXPANSION), `/plan-eng-review` (scoped implementation), `/plan-design-review` (visual/UX).

**Strip**: Entire preamble bash block (update-check, session-touch, telemetry logging, lake intro, proactive-behavior consent); Voice/persona section (Garry Tan voice, 150+ lines); AskUserQuestion 4-step re-ground/simplify/recommend/options format block; Completeness Principle effort table; Repo Ownership section; Search Before Building preamble section (keep the concept in Phase 2.75, strip gstack references); `{{PREAMBLE}}`, `{{SLUG_EVAL}}`, `{{SLUG_SETUP}}`, `{{CODEX_SECOND_OPINION}}`, `{{DESIGN_SKETCH}}`, `{{SPEC_REVIEW_LOOP}}` template placeholders (gstack-specific binary expansions); Phase 2.5 design-discovery grep path (`~/.gstack/projects/$SLUG/`) — replace with repo-relative `.designs/` or omit; Phase 4.5 Founder Signal Synthesis (only relevant for YC pitch funnel); Phase 6 entirely (Garry Tan persona, YC recruitment funnel, tier-selection logic); design doc storage path (`~/.gstack/projects/` → replace with configurable output path); telemetry footer; plan-status footer.

**Structure/format**: Six phases in `SKILL.md.tmpl` (canonical source). The generated `SKILL.md` contains only the preamble sections (lines 1–218) because the main skill body is injected via template placeholder. Phases have clear H2 headers and numbered steps. Portable core (Phases 1–5) extracts to ~300–350 lines once scaffolding and Phase 6 are removed. Phase 3 and Phase 4 are independently useful sub-workflows.

**Notes**: Three portable elements stand out:
- **Six forcing questions with smart routing**: demand-reality / status-quo / desperate-specificity / narrowest-wedge / observation / future-fit is the most structured demand-validation framework in the reference set. Smart routing by product stage prevents asking irrelevant questions (e.g., Q1 demand evidence is moot for a founder with paying customers). The anti-sycophancy rules and 5 named pushback patterns are unusually explicit and directly counter the agent default of accepting vague founder claims — worth extracting verbatim.
- **Hard Gate ("no code, no scaffolding")**: The explicit prohibition on any implementation action during ideation is a strong design principle. Separates the "should we build it?" session cleanly from "how do we build it?". Rare in reference skills. Easily portable as a one-line rule prepended to any ideation SOP.
- **"What I noticed about how you think" section**: The explicit rule "quote their words back — do not characterize their behavior" (with GOOD/BAD examples) produces mentor-quality design-doc closings. This output rule transfers directly to any session that produces a written deliverable from a conversation.
- The Alternatives Generation phase (mandatory ≥2 approaches with named types) and Premise Challenge (explicit agree/disagree before proceeding) are also clean, immediately reusable sub-workflows applicable well beyond product ideation.

## setup-browser-cookies/SKILL.md

**Type**: Skill — cookie import utility for headless browser sessions. Opens an interactive picker UI to select cookie domains to import from a real Chromium browser into a Playwright/headless browse session, or supports direct single-domain import.

**Portable**: No — the entire workflow is a thin wrapper around the gstack `browse` binary (`$B`) and its `cookie-import-browser` subcommand. No transferable algorithm or protocol exists beneath the binary invocations.

**Reason**: Every step depends on `$B` (resolved from `~/.claude/skills/gstack/browse/dist/browse`), the gstack `./setup` build step, and gstack-specific state (`~/.gstack/`, telemetry binaries). The CDP-mode short-circuit and cookie-picker UI are both features of the proprietary binary, not a reusable pattern. There is no portable SOP embedded here — only usage documentation for a specific CLI subcommand.

**Trigger**: User says "import cookies", "login to the site", or "authenticate the browser"; agent is about to QA test an authenticated page in the headless browse session.

**Steps/contract**:
1. **CDP mode check** — `$B status | grep "Mode: cdp"`; if true, real-browser cookies already available — stop, nothing to import.
2. **Binary setup** — resolve `$B` from repo-local or user-home path; if absent, prompt user and run `./setup` (installs bun if needed).
3. **Open picker UI** — `$B cookie-import-browser`; auto-detects installed Chromium browsers; user selects domains via interactive browser UI; agent waits for user confirmation.
4. **Direct import (alternative)** — `$B cookie-import-browser comet --domain <domain>` when user specifies a domain inline; skips picker.
5. **Verify** — `$B cookies`; show domain-count summary to user.

**Strip**: Entire preamble (update-check, session-touch, telemetry opt-in flows, lake intro, proactive-behavior consent, contributor-mode logging, plan-status footer, telemetry footer); binary setup scaffolding and `NEEDS_SETUP` flow; Voice/persona section; Completion Status Protocol; all `$B` invocations and `~/.claude/skills/gstack/` path assumptions.

**Structure/format**: Short skill (~120 lines including preamble, ~40 lines of actual workflow). Frontmatter → preamble bash block → prose conditional flows → Voice → Contributor Mode → Completion Status Protocol → Telemetry footer → Plan Status footer → main skill body (CDP check + How it works + 4 numbered steps). Main body is extremely thin relative to scaffolding overhead.

**Notes**: Minimal portable value. The only transferable concepts are (1) the CDP-mode short-circuit check (if already connected to the real browser, cookie import is a no-op — a clean guard pattern) and (2) the post-import verification step (confirm via domain-count summary before proceeding to QA). Neither warrants a standalone portable SOP; both are implementation details of any browser-automation session setup. Not a candidate for extraction.

## qa-only/SKILL.md

**Type**: Skill — report-only QA testing variant. Systematic browser-based webapp exploration that produces a structured bug report with health score, screenshots, and repro steps. Never applies fixes — the report-only constraint is the sole meaningful differentiator from the parent `/qa` skill.

**Portable**: Partially. The QA methodology (diff-aware route scoping, per-page exploration checklist, two-tier evidence model, weighted health score rubric, baseline/regression mode) is entirely repo-agnostic. The gstack scaffolding (preamble, telemetry, browse binary setup, companion binaries, voice persona) must be stripped. The `$B` browse binary is the main non-portable dependency; generalizes cleanly to any headless browser tool (Playwright, Puppeteer, etc.).

**Reason**: The core protocol — orient → explore → document-immediately → score — requires only a browser automation tool once `$B` references are generalized. The diff-aware mode (git diff → affected files → map to routes → test those routes → verify intent from commit messages) is a clean, universally applicable heuristic. The health score rubric with weighted categories is a formalized quality standard rare in QA skills. The report-only constraint (never read source, never fix, never suggest fixes inline) is the clean boundary that makes this safe for audits and handoffs.

**Trigger**: User says "QA report only", "just report bugs", "test but don't fix", "bug audit", or "qa report"; proactively suggest when user wants a pure audit without code changes, or when a handoff requires a clean findings doc.

**Steps/contract**:
1. Parse parameters: URL, mode (full / quick / regression), output dir, scope, auth credentials
2. Locate or build browse binary; create `.gstack/qa-reports/screenshots/` output directories
3. Authenticate if needed (form fill or cookie import; halt on 2FA/CAPTCHA, prompt user)
4. Orient: `goto` URL → `snapshot -i` → `links` → `console --errors`; detect framework (Next.js / Rails / WordPress / SPA)
5. Diff-aware mode (feature branch, no URL given): `git diff main...HEAD --name-only` → identify affected routes → detect running app port → test each affected page → cross-reference commit intent; fall back to Quick mode if no routes identified
6. Explore each page: `goto` → `snapshot -i -a` → `console --errors` → per-page checklist (visual scan, interactive elements, forms, navigation, states, console after interactions, mobile viewport)
7. Document each issue immediately on discovery (never batch): interactive bugs get before + action + after screenshots + `snapshot -D`; static bugs get single annotated screenshot. Write issue to report immediately.
8. Wrap up: compute weighted health score (8 categories: Console 15%, Links 10%, Functional 20%, UX 15%, Accessibility 15%, Visual 10%, Performance 10%, Content 5%); write Top 3 findings; save `baseline.json`; optionally diff against prior baseline (regression mode)
9. Write project-scoped test outcome artifact for cross-session context

**Strip**: Entire preamble bash block (update-check, `~/.gstack/sessions/` touch, telemetry JSONL, lake intro, proactive-behavior consent, contributor-mode logging, plan-status footer, telemetry footer); Voice/persona section (Garry Tan persona + all writing rules); AskUserQuestion 4-step re-ground format; Completeness Principle effort table; all `~/.gstack/` paths (generalize to `.qa-reports/`); `gstack-slug`, `gstack-config`, `gstack-telemetry-log`, `gstack-review-read` binary calls; `$B` syntax (replace with tool-agnostic browser automation pseudocode or Playwright equivalents); browse binary `./setup` build step.

**Structure/format**: Single large file (~700+ lines). YAML frontmatter → preamble bash → conditional onboarding prose → Voice section → AskUserQuestion format → Completeness Principle → Repo Ownership → Contributor Mode → Completion Status Protocol → Telemetry → Plan Status Footer → main skill body (Setup, Test Plan Context, Modes, Workflow phases 1–6, Health Rubric, Framework Guidance, Important Rules, Output, qa-only-specific Rules). Core workflow extracts to ~200–250 lines. Very well-organized with clear H2/H3 headers and inline code blocks.

**Notes**: Three sub-components are the strongest portable extractions:
- **Health score rubric**: 8 named categories with explicit weights summing to 100%, per-severity deduction rules (Critical −25, High −15, Medium −8, Low −3), and console/links scored separately. The most formally specified QA quality measurement in the reference set — immediately reusable as a standard report section.
- **Two-tier evidence model**: interactive bugs require before + action + after screenshots plus `snapshot -D` diff; static bugs require a single annotated screenshot. A clean, enforceable standard that prevents both under-documented vague findings and over-documented simple ones.
- **Diff-aware mode algorithm**: git diff → affected files → map to routes/pages via controller/template/component analysis → detect running app → test scoped pages → cross-reference with commit message intent. The cleanest "test what changed" formulation in this audit; maps naturally to Playwright's `page.goto()` model.
The Important Rules block (especially Rules 1–2: "Repro is everything — every issue needs ≥1 screenshot, no exceptions" and "Verify before documenting — retry once to confirm reproducibility") and Rule 12 ("Never refuse to use the browser — backend changes affect app behavior, always open the browser") are strong portable policy statements. The report-only boundary (never read source, never fix, never inline suggestions) is itself a portable SOP primitive for audit-mode agents.

## qa/SKILL.md

**Type**: Skill — three-tier browser-based QA + bug-fix workflow. Finds bugs by navigating the app as a user, fixes them with atomic commits, and re-verifies. Tiers: Quick (critical/high only), Standard (+ medium), Exhaustive (+ cosmetic). Also bootstraps a test framework if none exists. Produces before/after health scores, per-issue screenshot evidence, and a ship-readiness summary.

**Portable**: Partially. The QA methodology (phases 1–11), health score rubric, triage logic, diff-aware scoping, fix loop with WTF-likelihood self-regulation, regression test generation protocol, and TODOS.md sync are entirely repo-agnostic. The browse binary (`$B`), preamble infrastructure, and gstack companion binaries are not.

**Reason**: The `$B` browse binary is a gstack-specific compiled binary with its own setup step and CDP integration. The core workflow patterns — diff-aware page scoping, phase-based exploration, per-issue evidence capture, atomic commits per fix, WTF-likelihood self-regulation, regression test protocol — are browser-tool-agnostic and transfer cleanly to Playwright, Puppeteer, or any headless browser. The test framework bootstrap (B2–B8) is fully portable as a standalone sub-workflow.

**Trigger**: User says "qa", "test this site", "find bugs", "test and fix", "does this work?", or "fix what's broken". Also fires proactively when user says a feature is ready or asks whether something works.

**Steps/contract**:
- *Setup*: Detect CDP mode; assert clean working tree (offer commit/stash/abort if dirty); locate browse binary; bootstrap test framework if absent.
- *Diff-aware mode* (primary): When on a feature branch with no URL, derive affected pages/routes from `git diff main...HEAD --name-only`; detect running app on common ports; test each affected page + cross-reference with PR intent; fall back to homepage smoke test if no routes identified.
- *Phases 1–6 (QA baseline)*: Initialize + timer → authenticate if needed → orient (map nav, detect framework, check console) → explore each page (visual scan, interactions, forms, states, console after every action, mobile viewport) → document issues immediately with screenshot evidence → wrap up (health score, top-3, baseline JSON).
- *Phase 7 (Triage)*: Sort by severity; mark unfixable issues (third-party, infra) as deferred; apply tier filter.
- *Phase 8 (Fix loop per issue)*: Locate source → minimal fix → atomic commit (`fix(qa): ISSUE-NNN`) → re-test with before/after screenshots → classify (verified/best-effort/reverted) → write regression test (Phase 8e.5) → self-regulate via WTF-likelihood every 5 fixes.
- *Phase 9 (Final QA)*: Re-run on all affected pages; warn prominently if final score < baseline.
- *Phase 10 (Report)*: Write to `.gstack/qa-reports/` and project-scoped `~/.gstack/projects/{slug}/`; include fix status, commit SHA, files changed, before/after screenshots, PR summary line.
- *Phase 11 (TODOS.md)*: Add deferred bugs as TODOs; annotate fixed TODOs with fix metadata.

**Strip**: Entire preamble bash block (update-check, session touch, `gstack-config`, `gstack-repo-mode`, telemetry JSONL, lake intro, proactive-behavior consent, contributor mode); Voice/persona section (Garry Tan persona + writing rules); Completeness Principle effort table; AskUserQuestion 4-step format block (re-ground/simplify/recommend/options); CDP mode detection (browser-specific); `$B` binary references throughout (replace with browser-tool abstraction); `gstack-slug` binary in Phase 10; `~/.gstack/` project-scoped output path (generalize to configurable output dir); plan-status footer; telemetry footer.

**Structure/format**: Single large file (~1000+ lines). Well-organized H2 phases with embedded bash snippets, an explicit health score rubric table, and a weighted category scoring system. Portable core extracts to ~350–450 lines. Several sub-workflows are independently extractable: diff-aware mode, test framework bootstrap (B2–B8), health score rubric, WTF-likelihood self-regulation (Phase 8f), regression test protocol (Phase 8e.5).

**Notes**: Four especially strong portable sub-workflows:
1. **WTF-likelihood self-regulation (Phase 8f)** — quantified heuristic for when to stop auto-fixing: +15% per revert, +5% per fix touching >3 files, +1% per fix beyond 15, +10% if all remaining issues are Low, +20% for touching unrelated files. Hard cap at 50 fixes. Pause and ask user if WTF > 20%. This is rare in reference skills and directly addresses the common AI failure mode of introducing regressions while chasing a long tail of low-severity issues.
2. **Regression test protocol (Phase 8e.5)** — requires tracing the bug's codepath before writing any test (identify exact precondition → follow branches → pinpoint failure location → find adjacent edge cases). Test must fail without the fix and pass with it; includes attribution comment (`// Regression: ISSUE-NNN`); auto-incrementing filenames prevent collisions; 2-minute exploration cap prevents runaway. The forcing function "test must fail without fix" is the right quality gate and rarely stated this explicitly.
3. **Diff-aware mode** — scoping QA to affected pages/routes derived from changed files cuts test time dramatically while keeping coverage relevant to the change. The fallback ("if no routes identifiable, always open the browser anyway — backend changes affect app behavior") prevents silently skipping verification.
4. **Health score rubric** — weighted category scoring (Functional 20%, Accessibility + Console + UX at 15% each, Links + Performance + Visual at 10%, Content 5%) with explicit per-severity deductions (Critical −25, High −15, Medium −8, Low −3). Immediately reusable as a QA scoring standard in any browser-testing SOP.
The "never read source code — test as a user, not a developer" rule is a clean discipline that prevents a common AI failure mode. The "document issues immediately, not in batches" rule prevents the common failure mode of losing context between finding and writing up. The framework-specific guidance sections (Next.js, Rails, WordPress, SPA) are a useful reference but tightly coupled to the browse binary's interaction model.

## plan-eng-review/SKILL.md

**Type**: Interactive plan review skill — engineering manager mode. Multi-section workflow: scope challenge → architecture review → code quality review → test coverage audit → performance review → outside voice (independent second opinion via Codex CLI or subagent). Produces "NOT in scope" section, "What already exists" section, ASCII coverage diagram, failure modes table, worktree parallelization strategy, and TODOS.md updates. Wrapped in the standard gstack preamble/telemetry machinery.

**Portable**: Partially. The core review methodology (Step 0 scope challenge, four review sections with hard STOPs, test coverage diagram, outside voice pattern, required output set) is highly portable. Approximately 40–50% of the file is reusable once the gstack scaffolding is stripped.

**Reason**: The core review workflow maps to universal engineering practice with no gstack dependencies: Step 0 asks seven scope questions before any code is reviewed (existing code reuse, minimum change set, 8-file/2-class complexity smell, search-before-building, TODOS cross-reference, completeness/lake check, distribution pipeline check). Four named sections each impose a hard per-issue AskUserQuestion and a STOP gate. The test section's two-dimensional coverage model (code paths + user interaction flows) and E2E decision matrix are more thorough than any comparable SOP in the reference set. The 15 named cognitive patterns (sourced from Larson, McKinley, Fowler, Brooks, Allspaw, Skelton/Pais, Majors, Beck, Google SRE) are a reusable reference for any engineering review context. All of this is cleanly separable from the gstack product layer.

**Trigger**: Agent or user has a plan or design doc and is about to begin implementation; user says "review the architecture", "engineering review", "lock in the plan", or "review this plan"; proactively when a plan or design doc is present and coding is about to start.

**Steps/contract**:
- *Pre-step*: Design doc check (branch-scoped lookup); if none found, offer office-hours skill before proceeding.
- *Step 0 — Scope Challenge*: (1) Identify existing code that partially solves each sub-problem. (2) Identify minimum change set; flag deferrable work. (3) Complexity smell test — 8+ files or 2+ new classes/services triggers scope reduction AskUserQuestion. (4) Search-before-building check per architectural pattern introduced. (5) TODOS.md cross-reference (blocking items, bundleable items, new work to capture). (6) Completeness check (lake vs. ocean framing with AI compression ratios). (7) Distribution pipeline check — new artifact type requires CI/CD, target platforms, and distribution channel or explicit deferral.
- *Section 1 — Architecture*: Component boundaries, dependency graph, data flow, scaling, security, ASCII diagrams for non-trivial flows, one realistic production failure scenario per new codepath, distribution architecture. One AskUserQuestion per issue; STOP before Section 2.
- *Section 2 — Code Quality*: DRY violations, error handling, debt hotspots, over/under-engineering relative to stated preferences, stale ASCII diagrams in touched files. One AskUserQuestion per issue; STOP.
- *Section 3 — Test Review*: (1) Detect test framework (CLAUDE.md → auto-detect → skip if none). (2) Trace every codepath from each entry point through all branches, error paths, and external calls. (3) Map user flows and interaction edge cases (double-submit, navigate-away, stale session, slow network, concurrent actions) and error states. (4) Check each branch against existing tests with quality scoring (★★★/★★/★/GAP). (5) Apply E2E decision matrix (common 3+-component flows → E2E; critical LLM calls → EVAL; pure functions → unit). (6) IRON RULE: regressions get a regression test, no AskUserQuestion. (7) Produce ASCII coverage diagram covering both code paths and user flows with summary stats. (8) Write test plan artifact for downstream /qa consumption. (9) Add all GAPs as specific test requirements to the plan. One AskUserQuestion per issue; STOP.
- *Section 4 — Performance*: N+1 queries, memory, caching opportunities, high-complexity paths. One AskUserQuestion per issue; STOP.
- *Outside Voice*: Offer independent second opinion; construct adversarial challenge prompt ("find logical gaps, overcomplexity, feasibility risks, strategic miscalibration — no compliments, just problems"); dispatch to Codex CLI if available, otherwise Claude adversarial subagent; synthesize cross-model tension points; propose each tension as a TODO via AskUserQuestion.
- *Required outputs*: "NOT in scope" section with rationale per deferred item; "What already exists" section; TODOS.md updates (one AskUserQuestion per item, never batched); ASCII diagrams in plan and identified code files; failure modes table (test coverage? error handling? silent failure?) with critical gap flags; worktree parallelization strategy (dependency table → parallel lanes → execution order → conflict flags).
- *Retrospective learning*: Check git log for prior review-driven changes on the branch; weight those areas more heavily.
- *Completion summary*: Structured dashboard showing issue counts per section, gaps, TODOS proposed, lake score, outside voice source.

**Strip**: Entire preamble bash block (update-check, `~/.gstack/sessions/` touch, telemetry JSONL logging, lake intro with `garryslist.org` URL, proactive-behavior consent flows, `gstack-config` reads, `gstack-repo-mode` binary, `gstack-update-check`); Voice/persona section (Garry Tan persona + writing rules — ~150 lines); AskUserQuestion 4-step format wrapper (re-ground/simplify/recommend/options — the *structure* is portable but strip the gstack-branded framing and `_BRANCH` variable reference); Completeness Principle effort table (gstack product copy — keep the lake/ocean framing and AI compression ratios, strip the URL and marketing voice); `codex exec` CLI calls (keep the adversarial subagent pattern as portable fallback, strip the Codex binary dependency); all `gstack-*` binary calls (`gstack-slug`, `gstack-config`, `gstack-repo-mode`, `gstack-review-read`, `gstack-telemetry-log`, `gstack-review-log`); `~/.gstack/` path references; Contributor Mode field-report logic; plan-mode footer (`gstack-review-read` + GSTACK REVIEW REPORT write-back); telemetry footer; `PROACTIVE` flag conditional logic; Review Readiness Dashboard section (depends on `gstack-review-log` and `gstack-review-read` binaries); Plan File Review Report section (gstack dashboard infrastructure); Next Steps review-chaining section (references /plan-ceo-review, /plan-design-review slash-commands).

**Structure/format**: Single file, 1078 lines. Well-organized with named H2 sections: Preamble → Voice → AskUserQuestion Format → Completeness Principle → Repo Ownership → Search Before Building → Contributor Mode → Completion Status Protocol → Telemetry → Plan Status Footer → `# Plan Review Mode` (main review body). The main body starts at the `# Plan Review Mode` heading and is cleanly separable from the scaffolding above it. Extracts to ~350–450 lines. Step 0, the test coverage diagram, and the outside voice section are independently composable sub-workflows.

**Notes**: Four sub-components stand out as among the strongest portable candidates across the full reference set:
- **Step 0 Scope Challenge**: The seven-question pre-review checklist (existing-code reuse, minimum change set, complexity smell, search-before-building with Layer 1/2/3 annotation, TODOS cross-reference, lake/completeness check, distribution pipeline check) is unusually systematic. Most plan-review SOPs jump straight to architecture; this one gates entry to the review. The 8-file/2-class smell threshold and the distribution-pipeline deferral flag are concrete, actionable rules not seen elsewhere.
- **Test coverage diagram with user interaction flows**: Section 3 extends the standard code-path trace to include interaction edge cases (double-submit, navigate-away, stale data, slow network, concurrent actions) and error states visible to the user. This two-dimensional coverage model is the most thorough test-review protocol in the gstack reference set — more complete than the equivalent section in `review/SKILL.md`. The E2E decision matrix (3+-component common flows → E2E; critical LLM calls → EVAL; pure functions → unit) and the regression IRON RULE (no AskUserQuestion, no skipping) are immediately portable.
- **Cognitive Patterns block**: 15 named engineering manager instincts with source attribution (Larson, McKinley, Fowler, Brooks, Allspaw, Skelton/Pais, Majors, Beck, Google SRE) form a compact, reusable reference for calibrating review judgment. Presented as "instincts, not checklist items" — this framing prevents mechanical application and is worth preserving verbatim.
- **One-issue-per-AskUserQuestion discipline + escape hatch**: The rules "never batch multiple issues into one question" and "if a section has no issues, say so and move on — don't waste a question for formality's sake" are the clearest anti-paralysis guardrails in the reference set. Combined with the unresolved-decisions tracker at the end, they make the review both thorough and decisive.
The outside voice adversarial prompt ("find logical gaps, overcomplexity, feasibility risks, strategic miscalibration — no compliments, just problems") and the cross-model tension synthesis pattern are also strong portable primitives. The worktree parallelization strategy (dependency table → parallel lanes → conflict flags) is a novel output not seen in other review skills and directly enables concurrent implementation.
## gstack/agents/openai.yaml

**Type**: Agent interface stub — YAML metadata file (4 lines) declaring the display name, short description, and default prompt for the gstack Codex skill bundle entry-point.  
**Portable**: No.  
**Reason**: Contains no procedural logic, no steps, no rules. It is a thin configuration shim that registers the gstack bundle under the `openai` agent name and points the default prompt at `$gstack` to locate bundled skills. There is nothing to extract as a portable SOP.  
**Trigger**: N/A  
**Steps/contract**: None — single default_prompt line: `"Use $gstack to locate the bundled gstack skills."`  
**Strip**: Entire file is gstack-infrastructure-specific; nothing survives stripping.  
**Structure/format**: 4-line YAML with three keys: `interface.display_name`, `interface.short_description`, `interface.default_prompt`.  
**Notes**: Skip entirely. No SOP value.

## unfreeze/SKILL.md

**Type**: Skill — session-scoped scope unlock. Removes the `freeze-dir.txt` state file written by `/freeze`, restoring unrestricted edit access. Emits a confirmation message (or a "no boundary was set" notice) and reminds the user that the `/freeze` hook is still registered for the session — it simply allows all paths when the state file is absent.

**Portable**: No — not as a standalone SOP. It is the inverse half of the `/freeze`/`/unfreeze` paired primitive, which is itself an implementation-specific mechanism (a state file at `${CLAUDE_PLUGIN_DATA:-$HOME/.gstack}/freeze-dir.txt`). The *concept* (clear a scope restriction) is portable; the concrete mechanism is not.

**Reason**: The entire skill body is four lines of bash that delete a single file and print a status message. There is no reusable workflow, decision logic, or protocol here — only the inverse of a proprietary state-file convention. Any portable SOP would absorb this as a one-sentence teardown step inside the `/freeze` SOP itself, not as a separate skill.

**Trigger**: User says "unfreeze", "unlock edits", "remove freeze", or "allow all edits" — i.e., only meaningful after `/freeze` has been run and a state file exists.

**Steps/contract**:
1. Run analytics bash block (telemetry — strippable).
2. Check whether `$STATE_DIR/freeze-dir.txt` exists.
3. If present: capture previous path, delete file, confirm with "Freeze boundary cleared (was: `<path>`). Edits are now allowed everywhere."
4. If absent: output "No freeze boundary was set."
5. Remind user that the `/freeze` hook remains registered and will allow everything with no state file; re-freeze with `/freeze`.

**Strip**: Analytics/telemetry bash block (`~/.gstack/analytics/skill-usage.jsonl`); `<!-- AUTO-GENERATED from SKILL.md.tmpl -->` comment; `bun run gen:skill-docs` reference; `${CLAUDE_PLUGIN_DATA}` / `~/.gstack` path convention.

**Structure/format**: Frontmatter (name, version, description, allowed-tools) + one analytics bash block + one state-clear bash block + one prose reminder sentence. Minimal — ~25 lines total. Entirely dependent on `/freeze` for context; reads as an appendix, not a standalone skill.

**Notes**: No independent SOP value. If the `/freeze` SOP is promoted, this teardown logic should be folded into it as a "clearing the boundary" subsection rather than promoted separately. The only extractable pattern is the idempotent state-file check ("if file exists → act; else → report no-op") which is a trivially common shell idiom and not worth preserving as a named rule. Skip for promotion.

## setup-deploy/SKILL.md

**Type**: Setup/configuration skill — detects the project's deploy platform (Fly.io, Render, Vercel, Netlify, Heroku, Railway, GitHub Actions, custom), production URL, health check endpoint, and deploy status command, then writes a `## Deploy Configuration` section to CLAUDE.md so the companion `/land-and-deploy` skill can operate without repeated prompting.

**Portable**: Partially. The 6-step core workflow (detect platform → gather missing info via AskUserQuestion → write config → verify health check → summarise) is entirely repo-agnostic. The CLAUDE.md persistence contract and the per-platform detection heuristics are clean and reusable. What is gstack-specific is the full preamble (update-check, session tracking, lake intro, telemetry consent, proactive-behavior consent, contributor-mode logging, plan-status footer, telemetry footer) and the Voice/persona block — all strippable without loss of the workflow logic.

**Reason**: The platform-detection approach (file-presence probing: `fly.toml`, `render.yaml`, `vercel.json`/`.vercel`, `netlify.toml`, `Procfile`, `railway.json`, `.github/workflows/`) is a well-specified, exhaustive heuristic that any deployment-setup SOP would need to replicate. The fallback AskUserQuestion flow for undetected platforms is structured into clean decision branches (how deploys are triggered → production URL → how to verify success → pre/post-merge hooks) that cover the full configuration surface without assuming any specific platform. The idempotent write-to-project-config pattern (check for existing section → confirm/overwrite → write) and the post-write live verification step (curl health check, run status command) are strong reusable primitives.

**Trigger**: User says "setup deploy", "configure deployment", "set up land-and-deploy", "how do I deploy", or "add deploy config"; agent is about to run `/land-and-deploy` and no deploy config exists in the project config file.

**Steps/contract**:
1. **Check existing config** — grep project config file for `## Deploy Configuration`; if found, show it and offer Reconfigure / Edit specific field / Done.
2. **Platform detection** — probe for platform config files and deploy workflows in one bash block; output `PLATFORM:<name>` and `DEPLOY_WORKFLOW:<path>` tokens for downstream steps.
3. **Platform-specific setup** — branch per detected platform: Fly.io (extract app name → verify with `fly status` if CLI present → infer `https://{app}.fly.dev`), Render (extract service name → infer URL → note auto-deploy on push), Vercel (check `vercel ls --prod` if CLI present → infer production URL), Netlify (extract from `netlify.toml`), GitHub Actions only (read workflow file → ask for URL), Custom/Manual (structured AskUserQuestion — trigger method → production URL → verification approach → hooks).
4. **Write config** — find-or-append `## Deploy Configuration` section to project config file with fields: platform, production URL, deploy workflow, deploy status command, merge method, project type, post-deploy health check, and custom hooks subsection.
5. **Verify** — curl health check URL; run deploy status command; report results without blocking on failure.
6. **Summary** — emit boxed `DEPLOY CONFIGURATION — COMPLETE` block listing all config values and the file they were saved to; suggest next commands.

**Strip**: Entire preamble bash block (`gstack-update-check`, session-touch, `gstack-config`, `gstack-repo-mode`, `gstack-telemetry-log`, analytics JSONL append, pending-finalize loop); all conditional onboarding flows (lake intro, telemetry consent dialog, proactive-behavior consent) — each fires at most once via sentinel files and is pure gstack product onboarding; Voice/persona section (150+ lines of Garry Tan writing rules); AskUserQuestion 4-step format block (re-ground/simplify/recommend/options with Completeness score — keep the underlying decision branches, strip the branded framing and effort table); Contributor Mode field-report logic; plan-status footer (`gstack-review-read` binary + `## GSTACK REVIEW REPORT` append); telemetry footer bash block.

**Structure/format**: YAML frontmatter → preamble bash block → prose conditional onboarding flows → Voice section → AskUserQuestion format block → Completeness Principle → Contributor Mode → Completion Status Protocol → Telemetry footer → Plan Status Footer → main skill body (Steps 1–6 with embedded bash and fenced config/summary templates). The main body is clearly delimited from the scaffolding; it extracts to roughly 150–180 lines once stripped. Step 3 (platform-specific branches) is the longest section and could be split into a separate lookup table.

**Notes**: The strongest portable element is the **undetected-platform AskUserQuestion flow** in Step 3 (Custom/Manual branch): it asks the four questions that define a complete deployment contract (trigger method, production URL, verification approach, hooks) in a structured multi-step format that degrades gracefully if the user skips any answer. This is more complete than typical deploy-config prompts, which usually only ask for the URL. The **idempotent config-write pattern** (check → confirm → overwrite or append) and the **live verification step** (curl + status command, non-blocking) are clean reusable primitives. The `## Deploy Configuration` schema (8 named fields + custom hooks subsection) is a concrete, immediately adoptable config standard — any project config file (CLAUDE.md, `.pi/config.md`, `AGENTS.md`) could host this section verbatim. One limitation: the platform-detection bash block uses `|| [ -d .vercel ]` in the same line as `[ -f vercel.json ]` without proper grouping, which can produce unexpected results in strict shells; a portable SOP should note this and use explicit separate checks.

## SKILL.md
**Type**: Bundle manifest / skill preamble (QA browser automation)
**Portable**: Partial — most content is gstack-binary-specific, but two sub-sections are genuinely portable
**Reason**: The `gstack browse` QA workflows, command reference, and preamble are all tightly coupled to gstack's proprietary Chromium binary (`~/.claude/skills/gstack/browse/dist/browse`), config daemons, telemetry pipeline, and update-check scripts. None of that transfers. However, the **Completion Status Protocol** (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT with escalation rules) is a clean, tool-agnostic SOP for how an agent should report terminal task state and when to stop rather than produce bad work. The **Voice** section (no em-dashes, no AI vocabulary, short paragraphs, name the file/function/command) is also a portable writing-style rule for any agent skill.
**Strip**: Everything from `## Preamble (run first)` through the browse binary SETUP block; all telemetry bash; all `gstack-config` / `gstack-review-read` / contributor-mode logic; the full QA Workflows, Command Reference, Snapshot System, and Tips sections.
**Notes**: Extract two portable artefacts — (1) a Completion Status Protocol SOP covering the four terminal states plus the 3-tries escalation format; (2) a Voice / Tone style rule. Both are immediately usable in other skills without any dependency on gstack tooling.

## agents/openai.yaml
**Type**: Agent registry metadata (display config only)
**Portable**: No
**Reason**: Three lines of display metadata (`display_name`, `short_description`, `default_prompt`) that exist solely to wire this bundle into an agent-picker UI. There is no logic, no pattern, no transferable guidance — just a label pointing at `$gstack`.
**Strip**: Entire file — no extractable SOP content.
**Notes**: Skip. Nothing here informs any portable skill or policy.

## careful/bin/check-careful.sh
**Type**: PreToolUse safety hook — destructive command interceptor
**Portable**: Yes, high value
**Reason**: Implements a complete, self-contained pattern for intercepting dangerous shell commands before Claude executes them. Reads JSON from stdin (Claude Code's `PreToolUse` hook format), extracts the `command` field with both grep/sed and a Python fallback, runs it through a priority-ordered list of destructive patterns (`rm -r`, `DROP TABLE`, `TRUNCATE`, `git push --force`, `git reset --hard`, `git checkout .`, `kubectl delete`, `docker rm -f` / `docker system prune`), and returns `{"permissionDecision":"ask","message":"..."}` to surface a warning or `{}` to allow. Includes a thoughtful safe-exceptions block that whitelists `rm -rf` on known build artefact directories (`node_modules`, `.next`, `dist`, `__pycache__`, `.cache`, `build`, `.turbo`, `coverage`) — preventing alert fatigue without compromising safety.
**Strip**: The gstack telemetry write block (`mkdir -p ~/.gstack/analytics && echo '{"event":"hook_fire"...}' >> skill-usage.jsonl`) — this is gstack-proprietary; replace with no-op or a generic hook-fire log if desired.
**Notes**: This is the strongest portable SOP in the gstack bundle. The core structure (stdin JSON → extract command → pattern-match → ask-or-allow) is directly reusable as a Claude Code `PreToolUse` hook in any repo. The destructive-pattern list and safe-exceptions list represent accumulated judgment worth preserving verbatim. Port as a standalone `git-guardrails`-style hook or as the basis for a `careful` skill.

## SKILL.md.tmpl
**Type**: source template
**Portable**: Partial — same as SKILL.md counterpart
**Reason**: Source template for SKILL.md; skill instructions are identical compared to the assessed .md version. `{{PREAMBLE}}` expands to the gstack update-check/session-touch bash block; `{{BROWSE_SETUP}}` expands to the browse binary path setup; `{{SNAPSHOT_FLAGS}}` and `{{COMMAND_REFERENCE}}` expand to the snapshot flag table and full command reference respectively.
**Notes**: No unique content beyond the unexpanded placeholders. The `.md` file additionally contains two auto-generation HTML comments (`<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->` / `<!-- Regenerate: bun run gen:skill-docs -->`). Editing the `.tmpl` is how the skill is maintained; the `.md` is the build artefact. No additional SOP value to extract here — all portable content already captured in the SKILL.md assessment.

## autoplan/SKILL.md.tmpl
**Type**: source template
**Portable**: Partial — same as autoplan/SKILL.md counterpart
**Reason**: Source template for autoplan/SKILL.md; skill instructions are identical compared to the assessed .md version. `{{PREAMBLE}}` expands to the standard gstack preamble bash block; `{{BASE_BRANCH_DETECT}}` expands to the base-branch detection logic; `{{BENEFITS_FROM}}` expands to the prerequisite skill offer block; `{{SLUG_SETUP}}` (used inline in Phase 0) expands to the project slug derivation snippet.
**Notes**: No unique content beyond the unexpanded placeholders. The four template tokens (`{{PREAMBLE}}`, `{{BASE_BRANCH_DETECT}}`, `{{BENEFITS_FROM}}`, `{{SLUG_SETUP}}`) mark the only structural differences from the generated `.md`. All 6-principle auto-decision logic, sequential phase execution, decision audit trail, and Final Approval Gate content is authored directly in the `.tmpl` and passes through unchanged. No additional SOP value beyond the autoplan/SKILL.md assessment.

## benchmark/SKILL.md.tmpl
**Type**: source template
**Portable**: Yes — same as benchmark/SKILL.md counterpart
**Reason**: Source template for benchmark/SKILL.md; skill instructions are identical compared to the assessed .md version. `{{PREAMBLE}}` expands to the gstack preamble bash block; `{{BROWSE_SETUP}}` expands to the browse binary path setup. All Performance Engineer workflow content (phases 1–9, regression thresholds, budget check, trend analysis) is authored directly in the `.tmpl`.
**Notes**: No unique content beyond the unexpanded placeholders. The `.md` adds the two auto-generation HTML comments. The complete benchmark workflow (baseline capture, comparison with relative thresholds, slowest-resource table, performance budget check, trend analysis) is identical in both files and is the sole source of portable SOP value — already fully captured in the benchmark/SKILL.md assessment.

## browse/SKILL.md.tmpl
**Type**: source template
**Portable**: Partial — same as browse/SKILL.md counterpart
**Reason**: Source template for browse/SKILL.md; skill instructions are identical compared to the assessed .md version. `{{PREAMBLE}}` expands to the gstack preamble bash block; `{{BROWSE_SETUP}}` expands to the browse binary path setup; `{{SNAPSHOT_FLAGS}}` and `{{COMMAND_REFERENCE}}` expand to the snapshot flag table and full command reference. All 11 Core QA Patterns and the User Handoff section are authored directly in the `.tmpl`.
**Notes**: No unique content beyond the unexpanded placeholders. The browse `.tmpl` is notably leaner than the root `SKILL.md.tmpl` — it omits the proactive-suggestion routing block (office-hours, autoplan, ship, etc.) that appears in the top-level file, suggesting `browse/SKILL.md.tmpl` is scoped to the browser interaction skill alone while `SKILL.md.tmpl` is the bundle entry-point. The User Handoff pattern (headless → visible Chrome → resume with preserved state) is present here and in the assessed `.md`; no delta. All portable SOP value already captured in the browse/SKILL.md assessment.

## cso/SKILL.md.tmpl
**Type**: source template
**Portable**: same as .md
**Reason**: Source template for cso/SKILL.md; skill instructions are identical — the only diff is `{{PREAMBLE}}` (unexpanded) vs the full generated preamble block in the .md, plus two auto-generated header comments added by the build step (`bun run gen:skill-docs`).
**Notes**: No unique skill content. Template uses a single `{{PREAMBLE}}` placeholder; all logic lives in the non-templated body. The `${{ github.event.* }}` strings in the skill body are GitHub Actions syntax, not template vars.

## design-consultation/SKILL.md.tmpl
**Type**: source template
**Portable**: same as .md
**Reason**: Source template for design-consultation/SKILL.md; skill instructions are identical — diffs are template placeholders only: `{{PREAMBLE}}`, `{{SLUG_EVAL}}`, `{{BROWSE_SETUP}}`, and `{{DESIGN_OUTSIDE_VOICES}}`, all expanded in the generated .md.
**Notes**: No unique skill content. `{{DESIGN_OUTSIDE_VOICES}}` expands to an "outside voices / inspiration" section injected into Phase 3 in the .md (shared cross-skill content). `{{SLUG_EVAL}}` / `{{BROWSE_SETUP}}` inject gstack-specific shell setup for project slug and headless browser detection.

## design-review/SKILL.md.tmpl
**Type**: source template
**Portable**: same as .md
**Reason**: Source template for design-review/SKILL.md; skill instructions are identical — diffs are template placeholders only: `{{PREAMBLE}}`, `{{BROWSE_SETUP}}`, `{{TEST_BOOTSTRAP}}`, `{{DESIGN_METHODOLOGY}}`, `{{DESIGN_HARD_RULES}}`, `{{DESIGN_OUTSIDE_VOICES}}`, and `{{SLUG_SETUP}}`, all expanded in the generated .md.
**Notes**: No unique skill content. This skill has the highest template surface of the four — `{{DESIGN_METHODOLOGY}}` and `{{DESIGN_HARD_RULES}}` are large shared blocks (visual audit methodology and design rules) injected into Phases 1–6. These shared blocks are the portable substance; the template file just shows where they slot in.

## document-release/SKILL.md.tmpl
**Type**: source template
**Portable**: same as .md
**Reason**: Source template for document-release/SKILL.md; skill instructions are identical — diffs are `{{PREAMBLE}}` and `{{BASE_BRANCH_DETECT}}` (both expanded in the .md), plus `{{CO_AUTHOR_TRAILER}}` used inside a commit message heredoc in Step 9.
**Notes**: No unique skill content. `{{BASE_BRANCH_DETECT}}` injects a shell snippet that sets `<base>` for all `git diff <base>...HEAD` calls throughout the skill — the template makes the base-branch detection strategy explicit and swappable. `{{CO_AUTHOR_TRAILER}}` appends a `Co-Authored-By:` trailer to the docs commit.

## SKILL.md.tmpl (canary)
**Type**: source template
**Portable**: Same as canary/SKILL.md
**Reason**: Source template for canary/SKILL.md; skill instructions are identical — placeholders `{{PREAMBLE}}`, `{{BROWSE_SETUP}}`, `{{BASE_BRANCH_DETECT}}`, and `{{SLUG_EVAL}}` are the only structural difference; all 7 phases of the monitoring workflow are present verbatim.
**Notes**: No unique content beyond what is in the .md. The `{{SLUG_EVAL}}` placeholder in Phase 6 expands to `eval "$(~/.claude/skills/gstack/bin/gstack-slug 2>/dev/null)"` in the rendered file.

## SKILL.md.tmpl (careful)
**Type**: source template
**Portable**: Same as careful/SKILL.md
**Reason**: Source template for careful/SKILL.md; skill instructions are identical — this template has no `{{PLACEHOLDER}}` tokens at all (no preamble-tier declared), so .tmpl and .md are byte-for-byte equivalent in content.
**Notes**: No unique content. careful is the only template in this batch with zero template variables, confirming it was authored directly without a shared preamble.

## SKILL.md.tmpl (codex)
**Type**: source template
**Portable**: Same as codex/SKILL.md — with one gap: the rendered .md contains two additional sections injected by the tier-3 preamble expansion (`## Repo Ownership — See Something, Say Something` and `## Search Before Building`) that are not visible as named sections in the .tmpl body (they come from `{{PREAMBLE}}`).
**Reason**: Source template for codex/SKILL.md; core skill workflow (Step 0 through Important Rules) is identical. `{{PLAN_FILE_REVIEW_REPORT}}` expands to the full "Plan File Review Report" section in the .md.
**Notes**: The tier-3 preamble adds repo-ownership and search-before-building policies that are portable SOPs in their own right but are invisible in the .tmpl source. Extractors should read the rendered .md, not the .tmpl, to capture the full codex instruction set.

## SKILL.md.tmpl (connect-chrome)
**Type**: source template
**Portable**: Same as connect-chrome/SKILL.md
**Reason**: Source template for connect-chrome/SKILL.md; skill instructions are identical — placeholders `{{PREAMBLE}}` and `{{BROWSE_SETUP}}` are the only structural difference; all 6 steps of the Chrome connection workflow are present verbatim.
**Notes**: No unique content beyond what is in the .md. The `{{BROWSE_SETUP}}` block expands to the `## SETUP` browse-daemon check section, which appears before the main heading in the rendered file.

## freeze/SKILL.md.tmpl
**Type**: Source template
**Portable**: Same as `freeze/SKILL.md` — partially portable (concept and SOP steps are fully portable; `${CLAUDE_SKILL_DIR}/bin/check-freeze.sh` and `~/.gstack/` state paths are gstack-specific).
**Reason**: Source template for `freeze/SKILL.md`; skill instructions are identical. The compiled `.md` adds only two HTML comment lines (`<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->` and `<!-- Regenerate: bun run gen:skill-docs -->`). No template placeholders or conditionals are present — the file is static and compiles verbatim.
**Notes**: No unique content beyond the absence of the two auto-generated comment lines. The `bun run gen:skill-docs` build command is now visible here as the compilation mechanism; it confirms that freeze is a non-preamble skill (no `{{PREAMBLE}}` placeholder) and that the template layer adds nothing. Assess using `freeze/SKILL.md` findings.

## gstack-upgrade/SKILL.md.tmpl
**Type**: Source template
**Portable**: Same as `gstack-upgrade/SKILL.md` — not portable (all content is gstack self-updater machinery: install-type detection, git/clone upgrade paths, vendored-copy sync, CHANGELOG diff display, snooze state management).
**Reason**: Source template for `gstack-upgrade/SKILL.md`; skill instructions are identical. The compiled `.md` adds only the two auto-generated HTML comment lines. No template placeholders — static, compiles verbatim.
**Notes**: No unique content beyond the absent comment lines. Confirms `gstack-upgrade` has no preamble injection (no `{{PREAMBLE}}` placeholder), consistent with it being invoked *by* preamble-aware skills rather than being one itself. Assess using `gstack-upgrade/SKILL.md` findings.

## guard/SKILL.md.tmpl
**Type**: Source template
**Portable**: Same as `guard/SKILL.md` — partially portable (composition pattern and freeze-dir setup flow are portable; cross-sibling hook-script dependencies are gstack-specific).
**Reason**: Source template for `guard/SKILL.md`; skill instructions are identical. The compiled `.md` adds only the two auto-generated HTML comment lines. No template placeholders — static, compiles verbatim.
**Notes**: No unique content beyond the absent comment lines. Confirms `guard` has no preamble injection, consistent with its role as a lightweight activation wrapper over `careful` + `freeze`. Assess using `guard/SKILL.md` findings.

## investigate/SKILL.md.tmpl
**Type**: Source template
**Portable**: Higher than `investigate/SKILL.md` — the template body (Phases 1–5, Iron Law, pattern table, 3-strike rule, DEBUG REPORT format) is identical and portable; the `{{PREAMBLE}}` placeholder makes the gstack scaffolding boundary explicit and easy to strip.
**Reason**: Source template for `investigate/SKILL.md`; the skill body (all five phases) is identical. The key difference: the `.tmpl` contains a single `{{PREAMBLE}}` placeholder where the `.md` expands ~285 lines of gstack scaffolding (update-check, session tracking, lake intro, telemetry consent, proactive-behavior consent, Voice/persona, AskUserQuestion format block, Completeness Principle, Contributor Mode, Completion Status Protocol, telemetry footer, plan-status footer). The template makes the scaffold/skill boundary unambiguous.
**Notes**: The `{{PREAMBLE}}` placeholder is the single most useful structural signal in all four `.tmpl` files — it marks exactly where gstack machinery ends and portable SOP begins. For extraction purposes, the `.tmpl` is the cleaner source: strip `{{PREAMBLE}}` and the two auto-generated comment lines to obtain a pure portable debugging SOP. Also visible in the frontmatter: `preamble-tier: 2` — a field absent from the three non-preamble skills above, indicating tiered preamble injection (tier 2 = full preamble including telemetry and onboarding flows).

## unfreeze/SKILL.md.tmpl
**Type**: source template
**Portable**: Same as .md — skill instructions are identical; the only difference is that SKILL.md prepends two auto-generation comments (`<!-- AUTO-GENERATED from SKILL.md.tmpl -->` and `<!-- Regenerate: bun run gen:skill-docs -->`).
**Reason**: Source template for unfreeze/SKILL.md; skill instructions are identical to the rendered file.
**Notes**: No template placeholders present — the file is fully concrete. The skill removes `~/.gstack/freeze-dir.txt` via bash, echoes the cleared path (or "No freeze boundary was set"), and reminds the user that `/freeze` hooks remain registered but will allow everything until `/freeze` is re-run. Depends on the `freeze` skill's state file convention (`${CLAUDE_PLUGIN_DATA:-$HOME/.gstack}/freeze-dir.txt`). Pairs cleanly with `freeze/SKILL.md.tmpl` as a toggle; both are portable provided the state-dir env var convention is adopted.

## plan-eng-review/SKILL.md.tmpl
**Type**: source template
**Portable**: same as .md
**Reason**: Source template for plan-eng-review/SKILL.md; skill instructions are identical — all differences are placeholder expansions (`{{PREAMBLE}}`, `{{BENEFITS_FROM}}`, `{{TEST_COVERAGE_AUDIT_PLAN}}`, `{{CODEX_PLAN_REVIEW}}`, `{{REVIEW_DASHBOARD}}`, `{{PLAN_FILE_REVIEW_REPORT}}`).
**Notes**: No unique skill-logic content; `{{PREAMBLE}}` expands to ~300-line shared bash setup + proactive/telemetry/lake-intro prose. All eng-review-specific content (15 cognitive patterns, 4 review sections, scope challenge, parallelization strategy, completion summary) is present verbatim in both files.

## qa/SKILL.md.tmpl
**Type**: source template
**Portable**: same as .md
**Reason**: Source template for qa/SKILL.md; skill instructions are identical — all differences are placeholder expansions (`{{PREAMBLE}}`, `{{BASE_BRANCH_DETECT}}`, `{{BROWSE_SETUP}}`, `{{TEST_BOOTSTRAP}}`, `{{QA_METHODOLOGY}}`, `{{SLUG_EVAL}}`, `{{SLUG_SETUP}}`).
**Notes**: No unique skill-logic content. The full test→fix→verify loop (Phases 1–11), WTF-likelihood heuristic, regression test generation (Phase 8e.5), and per-issue commit rules are identical in both files.

## qa-only/SKILL.md.tmpl
**Type**: source template
**Portable**: same as .md
**Reason**: Source template for qa-only/SKILL.md; skill instructions are identical — all differences are placeholder expansions (`{{PREAMBLE}}`, `{{BROWSE_SETUP}}`, `{{QA_METHODOLOGY}}`, `{{SLUG_EVAL}}`, `{{SLUG_SETUP}}`).
**Notes**: No unique skill-logic content. "Never fix anything" rule and report-only constraints are present verbatim in both. Notably lighter than /qa: no `{{BASE_BRANCH_DETECT}}`, `{{TEST_BOOTSTRAP}}`, or fix-loop placeholders.

## retro/SKILL.md.tmpl
**Type**: source template
**Portable**: same as .md
**Reason**: Source template for retro/SKILL.md; skill instructions are identical — all differences are placeholder expansions (`{{PREAMBLE}}`, `{{BASE_BRANCH_DETECT}}`).
**Notes**: No unique skill-logic content. Retro is the most self-contained skill of the four — only two placeholders vs five or more in qa/plan-eng-review. All 14 retro steps, global mode, compare mode, streak tracking, and team breakdown logic are verbatim in both files.

## land-and-deploy/SKILL.md.tmpl
**Type**: source template
**Portable**: same as .md
**Reason**: Source template for land-and-deploy/SKILL.md; skill instructions are identical — all differences are the expanded `{{PREAMBLE}}`, `{{BROWSE_SETUP}}`, `{{BASE_BRANCH_DETECT}}`, `{{DEPLOY_BOOTSTRAP}}`, and `{{SLUG_EVAL}}` macros. The `.md` is auto-generated (`bun run gen:skill-docs`) and carries the `<!-- AUTO-GENERATED -->` header; `.tmpl` carries none.
**Notes**: No unique skill-instruction content. Template macros expand into: gstack session/telemetry setup bash block, proactive-mode guard, upgrade check, "Boil the Lake" completeness intro, base-branch detection, deploy-platform bootstrap, and project slug evaluation — all gstack infrastructure, not portable logic.

## office-hours/SKILL.md.tmpl
**Type**: source template
**Portable**: same as .md
**Reason**: Source template for office-hours/SKILL.md; skill instructions are identical — differences are the expanded `{{PREAMBLE}}`, `{{BROWSE_SETUP}}`, `{{SLUG_EVAL}}`, `{{SLUG_SETUP}}`, `{{CODEX_SECOND_OPINION}}`, `{{DESIGN_SKETCH}}`, and `{{SPEC_REVIEW_LOOP}}` macros. `.md` carries `<!-- AUTO-GENERATED -->` header.
**Notes**: No unique skill-instruction content. `{{CODEX_SECOND_OPINION}}` expands to a cross-model second-opinion block (Codex or Claude subagent cold-read), `{{DESIGN_SKETCH}}` to a visual sketch step, and `{{SPEC_REVIEW_LOOP}}` to a review loop — all gstack-internal infrastructure injected at generation time.

## plan-ceo-review/SKILL.md.tmpl
**Type**: source template
**Portable**: same as .md
**Reason**: Source template for plan-ceo-review/SKILL.md; skill instructions are identical — differences are the expanded `{{PREAMBLE}}`, `{{BASE_BRANCH_DETECT}}`, `{{BENEFITS_FROM}}`, `{{SLUG_EVAL}}`, `{{CODEX_PLAN_REVIEW}}`, `{{SPEC_REVIEW_LOOP}}`, `{{REVIEW_DASHBOARD}}`, and `{{PLAN_FILE_REVIEW_REPORT}}` macros. `.md` carries `<!-- AUTO-GENERATED -->` header.
**Notes**: No unique skill-instruction content. `{{BENEFITS_FROM}}` expands to a benefits-linkage block (reads prior `/office-hours` output), `{{CODEX_PLAN_REVIEW}}` to a cross-model plan-review step, `{{REVIEW_DASHBOARD}}` to the review readiness dashboard, and `{{PLAN_FILE_REVIEW_REPORT}}` to the plan-file report — all gstack infrastructure.

## plan-design-review/SKILL.md.tmpl
**Type**: source template
**Portable**: same as .md
**Reason**: Source template for plan-design-review/SKILL.md; skill instructions are identical — differences are the expanded `{{PREAMBLE}}`, `{{BASE_BRANCH_DETECT}}`, `{{DESIGN_HARD_RULES}}`, `{{DESIGN_OUTSIDE_VOICES}}`, `{{REVIEW_DASHBOARD}}`, and `{{PLAN_FILE_REVIEW_REPORT}}` macros. `.md` carries `<!-- AUTO-GENERATED -->` header.
**Notes**: No unique skill-instruction content. `{{DESIGN_HARD_RULES}}` expands to the anti-AI-slop hard rules list, `{{DESIGN_OUTSIDE_VOICES}}` to an outside-voice/second-opinion step — both gstack-internal and relevant to the anti-slop SOP signal in this skill.

## review/SKILL.md.tmpl
**Type**: source template
**Portable**: same as .md — skill instructions are identical; differences are scaffolding only
**Reason**: Source template for review/SKILL.md; skill instructions are identical. All divergence is template placeholder expansion: `{{PREAMBLE}}`, `{{BASE_BRANCH_DETECT}}`, `{{PLAN_COMPLETION_AUDIT_REVIEW}}`, `{{DESIGN_REVIEW_LITE}}`, `{{TEST_COVERAGE_AUDIT_REVIEW}}`, `{{ADVERSARIAL_STEP}}` — each expands to a large shared block injected by the build system.
**Notes**: No unique skill content beyond what's in the .md. Confirms the build system injects all shared infrastructure (preamble, base-branch detection, plan audit, design review lite, test coverage diagram, adversarial review) as reusable partials. The `.tmpl` is the canonical authoring surface; the `.md` is read-only generated output.

## setup-browser-cookies/SKILL.md.tmpl
**Type**: source template
**Portable**: same as .md — skill instructions are identical; preamble tier 1 produces a condensed Voice block vs tier 4's full Garry Tan voice
**Reason**: Source template for setup-browser-cookies/SKILL.md; skill instructions are identical. Placeholders: `{{PREAMBLE}}` (tier 1 — shorter condensed voice section vs tier 4 full voice) and `{{BROWSE_SETUP}}` (expands to the `gstack browse` binary detection + one-time build step).
**Notes**: Preamble tier difference is meaningful: tier 1 omits AskUserQuestion format, Completeness Principle, Repo Ownership, Search Before Building sections that tier 4 includes. The `{{BROWSE_SETUP}}` partial is shared across all browse-dependent skills — good extraction candidate for a portable browser-setup SOP fragment.

## setup-deploy/SKILL.md.tmpl
**Type**: source template
**Portable**: same as .md — skill instructions are identical
**Reason**: Source template for setup-deploy/SKILL.md; skill instructions are identical. Only placeholder is `{{PREAMBLE}}` — no other partials injected.
**Notes**: Simplest template in this batch. All deploy platform detection logic (fly.toml, render.yaml, vercel.json, netlify.toml, Procfile, railway, GitHub Actions workflows) is authored inline in the template and not shared via partials. The platform detection block is a strong portable extraction candidate for a "detect-deploy-platform" SOP.

## ship/SKILL.md.tmpl
**Type**: source template
**Portable**: same as .md — skill instructions are identical; differences are all placeholder expansions
**Reason**: Source template for ship/SKILL.md; skill instructions are identical. Most placeholder-heavy template in this batch: `{{PREAMBLE}}`, `{{BASE_BRANCH_DETECT}}`, `{{REVIEW_DASHBOARD}}`, `{{TEST_BOOTSTRAP}}`, `{{TEST_FAILURE_TRIAGE}}`, `{{TEST_COVERAGE_AUDIT_SHIP}}` (ship variant — adds coverage gate, before/after count, test plan artifact; differs from the review variant), `{{PLAN_COMPLETION_AUDIT_SHIP}}` (ship variant — adds Gate Logic with NOT DONE blocking; differs from review variant), `{{PLAN_VERIFICATION_EXEC}}`, `{{DESIGN_REVIEW_LITE}}`, `{{ADVERSARIAL_STEP}}`, `{{CO_AUTHOR_TRAILER}}`.
**Notes**: Two partials have ship-specific variants distinct from their review counterparts: TEST_COVERAGE_AUDIT_SHIP adds a coverage gate (min 60% / target 80%), before/after test count, and a test plan artifact written to `~/.gstack/`; PLAN_COMPLETION_AUDIT_SHIP adds a gate that blocks shipping on NOT DONE items. CO_AUTHOR_TRAILER expands to a hardcoded model string ("Claude Opus 4.6") — worth noting as a maintenance point.
