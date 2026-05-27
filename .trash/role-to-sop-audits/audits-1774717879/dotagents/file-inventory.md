# File Inventory — dotagents

## Rules

rules/package-manager.md | rule | Mandates `pnpm i` over `pnpm add` to prevent `.pnpm-store` pollution in the repo root.
rules/rule-adherence.md | rule | Declares every rule in context mandatory and directs the agent to ask rather than assume when a rule is unclear.
rules/skill-promotion.md | rule | Five-criteria gate that controls when a repeated workflow earns its own skill file and when it should not.
rules/worktree-location.md | rule | Requires new git worktrees to be created inside `./.worktrees/` in the repo root.
rules/write-back-gate.md | rule | Three-question gate (will it matter later / can it be reused / does it have a clear destination) before writing anything to a permanent file.

## Skills

skills/agent-optimize-rules/SKILL.md | skill | Audits and refactors rules, skills, and subagents using Vague→Specific, Negative→Positive, Imprecise→Precise patterns.
skills/audit-deps/SKILL.md | skill | Finds vulnerabilities and outdated packages, then plans safe upgrade paths.
skills/audit-security/SKILL.md | skill | Runs a whole-codebase security audit covering secrets, trust boundaries, OWASP Top 10, config, and dependencies.
skills/deploy-verify/SKILL.md | skill | Smoke-tests a production deployment by checking HTTP status, page content, console errors, and screenshots.
skills/gc/SKILL.md | skill | Splits uncommitted working-tree changes into logical single-concern conventional commits and pushes.
skills/next-slice/SKILL.md | skill | Cleans up a merged worktree/branch, fast-forwards main, and sets up a fresh worktree for the next plan slice.
skills/pr-file/SKILL.md | skill | Files a GitHub pull request with a structured body, linked issues, and acceptance criteria.
skills/pr-merge/SKILL.md | skill | Posts a flavourful PR summary comment then merges with a clean conventional commit subject.
skills/pr-resolve-discussions/SKILL.md | skill | Resolves unresolved PR review threads by validating findings and implementing architectural fixes.
skills/pr-review/SKILL.md | skill | Reviews a PR for bugs, security issues, and spec compliance by spawning parallel review subagents.
skills/prd-create/SKILL.md | skill | Creates a PRD through user interview, codebase exploration, and module design, then submits it as a GitHub issue.
skills/prd-to-issues/SKILL.md | skill | Breaks a PRD into independently-grabable GitHub issues using tracer-bullet vertical slices.
skills/prd-to-plan/SKILL.md | skill | Converts a PRD into a multi-phase local implementation plan saved as Markdown files in `.plans/`.
skills/release/SKILL.md | skill | Cuts a release by running changeset version, writing release notes, and publishing a GitHub release.
skills/setup-changesets/SKILL.md | skill | Installs and configures `@changesets/cli` with GitHub Actions automation and optional Cloudflare deploy triggers.
skills/setup-ci/SKILL.md | skill | Sets up GitHub Actions CI/CD workflows with pnpm caching and Cloudflare Pages deployment via Wrangler.

## Agents — Customer Service

agents/customer-service/orchestrator.md | agent | Triages and routes tickets through a three-tier CS hierarchy, monitors escalation signals, and dispatches the Analyst for pattern work.
agents/customer-service/rep.md | agent | Tier 1 rep that resolves common questions via playbooks and produces a structured Escalation Summary when escalating.
agents/customer-service/specialist.md | agent | Tier 2 specialist that investigates complex technical and account issues and produces a Case Resolution or Case Handoff.
agents/customer-service/escalation-manager.md | agent | Tier 3 escalation manager with authority to approve custom remedies, de-escalate hostile customers, and produce Systemic Issue Reports.
agents/customer-service/analyst.md | agent | Analyzes aggregate ticket batches to surface trends, engineering escalations, and documentation gaps in a Support Insights Report.

## Agents — Engineering

agents/engineering/orchestrator.md | agent | Single engineering entry point that assesses work, produces a Routing or Wave Plan, waits for approval, then delegates to specialists.
agents/engineering/developer.md | agent | Solo plan-and-implement agent that writes a spec first, waits for approval, implements, then self-verifies every acceptance criterion.
agents/engineering/debugger.md | agent | Root-cause analysis specialist that builds evidence chains and produces a Root Cause Report without touching source code.
agents/engineering/devops.md | agent | CI/CD and infrastructure specialist that plans pipeline, deployment, and IaC changes and requires approval before touching production.
agents/engineering/implementor.md | agent | Scoped task executor that implements exactly what its assigned task says, commits, and reports back without delegating.
agents/engineering/ralph.md | agent | Autonomous iterative loop agent that plans with the user, writes state to disk, and spawns fresh Implementor sub-agents until tests pass.
agents/engineering/refactorer.md | agent | Safe incremental refactoring specialist that requires a green baseline before starting, commits atomically, and preserves behavior exactly.
agents/engineering/researcher.md | agent | Investigation-only agent that produces a structured Research Brief with findings, trade-offs, and open questions — no planning or implementation.
agents/engineering/technical-writer.md | agent | Reads source code then produces API docs, migration guides, READMEs, ADRs, changelogs, or runbooks without modifying any code.
agents/engineering/ui-designer.md | agent | Discovers the project's design system first, then builds accessible WCAG AA–compliant UI using existing tokens and component patterns.

## Agents — Review & QA

agents/review-and-qa/orchestrator.md | agent | Routes review requests to PR Reviewer, PR Shepherd, Verifier, or Security Reviewer in the correct sequence, always running Security first.
agents/review-and-qa/pr-reviewer.md | agent | High-confidence code review specialist that flags bugs, security issues, API contract violations, and structural rot — zero comments if nothing found.
agents/review-and-qa/pr-shepherd.md | agent | Coordination loop agent that drives a PR to merge-ready state by fixing comments, rebasing, polling CI, and re-requesting reviews over up to 10 iterations.
agents/review-and-qa/security-reviewer.md | agent | Threat-models changes, maps trust boundaries, evaluates against OWASP Top 10, and produces a structured Security Assessment with severity-rated findings.
agents/review-and-qa/verifier.md | agent | Evidence-driven acceptance criteria checker that maps work to criteria, runs the verification plan, and issues APPROVED / NOT APPROVED / BLOCKED verdicts.

## Agents — Executive Board

agents/executive-board/orchestrator.md | agent | Board chair that classifies proposals, sequences executive consultations, surfaces disagreements, and delivers a briefing package to the CEO.
agents/executive-board/ceo.md | agent | Final decision-maker that synthesizes all executive inputs and produces a Strategic Brief with a GREENLIGHT / REJECT / NEED MORE DATA verdict.
agents/executive-board/cfo.md | agent | Evaluates proposals through a financial lens — cost estimates, ROI, burn rate impact — without making product or technical decisions.
agents/executive-board/cto.md | agent | Evaluates technical feasibility, architecture implications, effort tiers, and build-vs-buy trade-offs for the board.
agents/executive-board/cpo.md | agent | Evaluates proposals through user-problems and product-market-fit lens, producing a Product Brief with success metrics and scope recommendations.
agents/executive-board/compounder.md | agent | Long-game strategist that assesses whether a decision builds durable compounding advantage (moats, flywheels, knowledge accumulation).
agents/executive-board/contrarian.md | agent | Devil's advocate that constructs the strongest possible opposing case to stress-test proposals and expose blind spots.
agents/executive-board/customer-oracle.md | agent | Brings real customer signals — support tickets, churn data, NPS, verbatim quotes — to strategic discussions as the customer's voice.
agents/executive-board/head-of-qa.md | agent | Evaluates quality risk, failure modes, regression potential, and release readiness criteria for proposals and releases.
agents/executive-board/market-strategist.md | agent | Tracks competitors, analyzes market timing, sizes opportunities, and identifies strategic windows for the board.
agents/executive-board/moonshot.md | agent | Pushes the board toward 10x bets and asymmetric-upside plays when incremental thinking dominates the discussion.
agents/executive-board/revenue.md | agent | Drives discussion toward monetization and 90-day revenue by asking what version of any proposal customers will pay for.
agents/executive-board/vp-design.md | agent | Evaluates UX impact, design system implications, and forgotten states (onboarding, errors, empty states, accessibility) for the board.
agents/executive-board/vp-engineering.md | agent | Translates strategic decisions into phased engineering execution plans with timelines, staffing needs, dependencies, and risk registers.

## Agents — Meta (Boardroom Prompt Infrastructure)

agents/meta/boardroom-artifact-discipline.md | prompt | Constrains boardroom agents to treat the source brief as immutable and restrict persistent writes to their own scratchpad.
agents/meta/boardroom-assessment-instructions.md | prompt | Instructs board members to name opponents explicitly when challenging a position to keep board debate followable.
agents/meta/boardroom-synthesis-instructions.md | prompt | Directs the CEO to synthesize all board input into a Strategic Brief, address tensions explicitly, and not call file-mutation tools.
agents/meta/boardroom-final-synthesis-task.md | prompt | Task prompt that triggers the CEO's final Strategic Brief synthesis, optionally requesting Mermaid/SVG visuals.
agents/meta/boardroom-structured-final-task.md | prompt | Task prompt that triggers the final Strategic Brief in a structured round-counted meeting with visual output.
agents/meta/boardroom-structured-review-task.md | prompt | Mid-round task prompt for structured meetings that tracks budget, confirms the next round, and asks for agreements/disagreements/open questions.
agents/meta/boardroom-structured-review-final-round-task.md | prompt | Final-round task prompt that directs board members to summarize unresolved tensions before the CEO synthesizes.
agents/meta/boardroom-freeform-review-task.md | prompt | Mid-round task prompt for freeform meetings that tracks budget and requests strongest disagreements and questions for the next round.
agents/meta/boardroom-constraints-reached-final-task.md | prompt | Emergency task prompt that instructs the CEO to produce a final brief with available data when budget or time is exhausted.
agents/meta/boardroom-force-close-final-task.md | prompt | Force-close task prompt that triggers an immediate final brief with explicit notation of unresolved questions.
agents/meta/narration-summarizer.md | prompt | Converts a board meeting memo into plain-English spoken narration for ElevenLabs TTS, covering discussion, roadblocks, decision, and rationale.
agents/meta/subagent-writer.md | agent | Expert agent that designs subagent definition files using principles of identity-before-instructions, constraints-as-features, and output-as-API-contract.

## Config

AGENTS.md | config | Workspace-level learned preferences and facts about this repository, consumed as persistent context for every session.
