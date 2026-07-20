# File Inventory — gstack

Scanned: `.references/gstack`
Date: 2026-03-28

---

## Relevant Files

### Top-level configuration and rules

```
AGENTS.md | config | Catalogue of all available skills with trigger names and one-line descriptions — the agent's skill discovery index.
CLAUDE.md | config | Dev environment rules for AI: SKILL.md generation workflow, platform-agnostic command reading, commit bisection policy, CHANGELOG voice rules, vendored-symlink awareness, and safety guardrail classification.
ETHOS.md | rule | Builder philosophy injected into every skill preamble — "Boil the Lake" (completeness over shortcuts) and "Search Before Building" (three-layer knowledge model).
SKILL.md.tmpl | prompt | Canonical template source for the root gstack skill; defines voice, completion status protocol, escalation rules, telemetry hooks, plan-mode footer, and proactive skill suggestion logic.
SKILL.md | skill | Generated root skill: headless-browser QA and dogfooding using the browse binary — full command reference, workflow patterns, and assertion library.
```

### Skill files (agent-executable procedures)

```
autoplan/SKILL.md | skill | Sequentially runs CEO, design, and eng review skills with auto-decisions using six principles; surfaces only taste-level choices at a final approval gate.
autoplan/SKILL.md.tmpl | prompt | Template source for autoplan; encodes the six auto-decision principles and the interactive approval gate logic.
benchmark/SKILL.md | skill | Performance regression detection: establishes browse-based baselines for load times, Core Web Vitals, and bundle sizes, then diffs on every PR.
benchmark/SKILL.md.tmpl | prompt | Template source for benchmark skill.
browse/SKILL.md | skill | Headless Chromium browser control skill — navigation, interaction, snapshot, assertion, screenshot, and multi-tab command reference.
browse/SKILL.md.tmpl | prompt | Template source for browse skill.
canary/SKILL.md | skill | Post-deploy canary monitoring loop: watches live app for console errors, performance regressions, and page failures with periodic screenshots and anomaly alerts.
canary/SKILL.md.tmpl | prompt | Template source for canary skill.
careful/SKILL.md | skill | Destructive-command safety guardrail: warns before rm -rf, DROP TABLE, force-push, git reset --hard, kubectl delete, and docker prune via PreToolUse hook.
careful/SKILL.md.tmpl | prompt | Template source for careful skill.
careful/bin/check-careful.sh | config | PreToolUse hook script: parses Bash tool input JSON, matches destructive command patterns, and returns permissionDecision=ask with a warning message.
codex/SKILL.md | skill | OpenAI Codex CLI wrapper — three modes: code review (diff-based pass/fail), adversarial challenge, and consultative second opinion with session continuity.
codex/SKILL.md.tmpl | prompt | Template source for codex skill.
connect-chrome/SKILL.md | skill | Launches a visible Chrome window controlled by gstack with the Side Panel extension for real-time activity observation.
connect-chrome/SKILL.md.tmpl | prompt | Template source for connect-chrome skill.
cso/SKILL.md | skill | Chief Security Officer audit: secrets archaeology, dependency supply chain, CI/CD pipeline security, OWASP Top 10, STRIDE threat modeling — daily (8/10 confidence gate) or comprehensive (2/10) mode.
cso/SKILL.md.tmpl | prompt | Template source for cso skill.
design-consultation/SKILL.md | skill | Full design-system creation from scratch: researches landscape, proposes aesthetic/typography/color/layout system, generates preview pages, and writes DESIGN.md.
design-consultation/SKILL.md.tmpl | prompt | Template source for design-consultation skill.
design-review/SKILL.md | skill | Live visual QA and fix loop: finds spacing, hierarchy, and AI-slop issues in a running site, applies atomic commits per fix, and re-verifies with before/after screenshots.
design-review/SKILL.md.tmpl | prompt | Template source for design-review skill.
document-release/SKILL.md | skill | Post-ship documentation sync: cross-references diff against README/ARCHITECTURE/CONTRIBUTING/CLAUDE.md, updates each to match what shipped, and polishes CHANGELOG voice.
document-release/SKILL.md.tmpl | prompt | Template source for document-release skill.
freeze/SKILL.md | skill | Restricts file edits to a single directory for the session via a PreToolUse hook that blocks Write/Edit outside the frozen path.
freeze/SKILL.md.tmpl | prompt | Template source for freeze skill.
freeze/bin/check-freeze.sh | config | PreToolUse hook script: reads freeze-dir.txt state file and returns permissionDecision=deny if the target file_path is outside the frozen boundary.
gstack-upgrade/SKILL.md | skill | Self-upgrade procedure: detects global vs vendored install, runs the upgrade, and shows what changed.
gstack-upgrade/SKILL.md.tmpl | prompt | Template source for gstack-upgrade skill.
guard/SKILL.md | skill | Composite safety mode that activates both careful (destructive-command warnings) and freeze (directory-scoped edits) simultaneously.
guard/SKILL.md.tmpl | prompt | Template source for guard skill.
investigate/SKILL.md | skill | Four-phase root-cause debugging protocol (investigate → analyze → hypothesize → implement) with the Iron Law: no fixes without root cause.
investigate/SKILL.md.tmpl | prompt | Template source for investigate skill.
land-and-deploy/SKILL.md | skill | Post-PR merge-and-deploy workflow: merges, waits for CI, waits for deploy, then verifies production health via canary checks.
land-and-deploy/SKILL.md.tmpl | prompt | Template source for land-and-deploy skill.
office-hours/SKILL.md | skill | Two-mode product diagnostic: startup mode (six YC-style forcing questions on demand, status quo, and narrowest wedge) and builder mode (design-thinking brainstorm for side projects).
office-hours/SKILL.md.tmpl | prompt | Template source for office-hours skill.
plan-ceo-review/SKILL.md | skill | CEO/founder plan review across four modes (expand, selective-expand, hold, reduce): challenges premises, finds the 10-star product, and rewrites the plan accordingly.
plan-ceo-review/SKILL.md.tmpl | prompt | Template source for plan-ceo-review skill.
plan-design-review/SKILL.md | skill | Designer's-eye plan review in plan mode: scores each design dimension 0-10, explains what a 10 looks like, then edits the plan to close the gap.
plan-design-review/SKILL.md.tmpl | prompt | Template source for plan-design-review skill.
plan-eng-review/SKILL.md | skill | Engineering-manager plan review: locks in architecture, data flow, diagrams, edge cases, test coverage, and performance strategy through interactive walkthroughs.
plan-eng-review/SKILL.md.tmpl | prompt | Template source for plan-eng-review skill.
qa/SKILL.md | skill | Systematic web-app QA with iterative fix loop: three tiers (quick/standard/exhaustive), atomic commits per fix, re-verification, and before/after health scores.
qa/SKILL.md.tmpl | prompt | Template source for qa skill.
qa-only/SKILL.md | skill | Report-only QA mode: same systematic testing as /qa but produces a structured bug report with health score and screenshots without making code changes.
qa-only/SKILL.md.tmpl | prompt | Template source for qa-only skill.
retro/SKILL.md | skill | Weekly engineering retrospective: analyzes commit history, work patterns, per-person contributions with praise and growth areas, and tracks trends over time.
retro/SKILL.md.tmpl | prompt | Template source for retro skill.
review/SKILL.md | skill | Pre-landing PR review: scans diff for SQL safety, LLM trust-boundary violations, conditional side effects, and structural issues before merge.
review/SKILL.md.tmpl | prompt | Template source for review skill.
setup-browser-cookies/SKILL.md | skill | Interactive picker for importing cookies from a real Chromium browser into the headless browse session before QA testing authenticated pages.
setup-browser-cookies/SKILL.md.tmpl | prompt | Template source for setup-browser-cookies skill.
setup-deploy/SKILL.md | skill | One-time deployment configuration: detects platform (Fly, Render, Vercel, etc.), health check endpoints, and deploy commands, then persists config to CLAUDE.md.
setup-deploy/SKILL.md.tmpl | prompt | Template source for setup-deploy skill.
ship/SKILL.md | skill | Full ship workflow: merge base branch, run tests, review diff, bump VERSION, update CHANGELOG, commit, push, and open PR.
ship/SKILL.md.tmpl | prompt | Template source for ship skill.
unfreeze/SKILL.md | skill | Clears the freeze boundary set by /freeze, restoring unrestricted edit access for the session.
unfreeze/SKILL.md.tmpl | prompt | Template source for unfreeze skill.
```

### Agent interface definitions

```
agents/openai.yaml | agent | OpenAI Codex agent interface config: sets display name, short description, and default prompt for the gstack Codex skills bundle.
```

---

## Files Skipped

READMEs, changelogs, lock files, test fixtures, binaries, CI workflows, build scripts (`scripts/`, `.github/workflows/`), `ARCHITECTURE.md`, `BROWSER.md`, `DESIGN.md`, `CONTRIBUTING.md`, `TODOS.md`, `VERSION`, `LICENSE`, `package.json`, `conductor.json` (only contains dev-setup/teardown script refs), `.env.example`, `setup` (binary build script), and `browse/src/` (browser CLI implementation code).

Non-hook bin scripts (`gstack-config`, `gstack-telemetry-log`, `gstack-update-check`, etc.) skipped — these are runtime utilities called by skills, not agent behaviour definitions.
