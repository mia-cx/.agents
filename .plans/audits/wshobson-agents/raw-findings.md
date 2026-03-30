## plugins/agent-teams/skills/team-communication-protocols/SKILL.md
**Type**: Rule / communication protocol — direct message, broadcast, shutdown, and plan-approval guidance
**Portable**: Yes
**Reason**: The core guidance is broadly reusable across any multi-agent workflow: choose the narrowest message type that reaches the right teammate, reserve broadcasts for shared blockers, require explicit plan approval before implementation when operating in plan mode, and use a graceful shutdown handshake instead of abrupt termination. The teammate-discovery section is also portable as a general pattern for locating team membership metadata and messaging by human-readable name.
**Trigger**: When coordinating a multi-agent team; deciding between direct message vs broadcast; requesting or reviewing a plan before work begins; shutting a team down cleanly; or debugging stalled teammate coordination at integration points.
**Steps/contract**: (1) Default to direct, named teammate messages for updates and questions. (2) Broadcast only for critical shared-resource changes that affect everyone. (3) In plan mode, create the plan from read-only exploration, then request approval before implementation. (4) For shutdown, send a request to each teammate, wait for approve/reject responses, and retry once work is complete. (5) Discover team members from the team config and address them by `name`, not internal IDs. (6) Use the troubleshooting patterns to resolve idle teammates, stale interfaces, or deadlocks.
**Strip**: The specific JSON field names (`shutdown_request`, `plan_approval_request`, `shutdown_response`) should become protocol placeholders unless the adopting environment uses the same message schema; the `~/.claude/teams/{team-name}/config.json` path is implementation-specific and should be generalized to “team config / membership registry”; the `TaskUpdate` mention is tool-specific and should be abstracted to the project’s own status-update mechanism.
**Notes**: The anti-pattern guidance is strong and transferable, especially “broadcast sparingly” and “use names, not UUIDs.” The plan-approval and graceful-shutdown flows are the highest-value portable SOP elements and map cleanly to other orchestrated-agent systems.
## plugins/agent-teams/skills/multi-reviewer-patterns/SKILL.md

**Type**: Pattern — parallel code-review coordination and consolidation workflow
**Portable**: Yes
**Reason**: The core workflow is domain-agnostic: choose review dimensions, run reviewers in parallel, deduplicate overlapping findings, calibrate severity consistently, and publish one consolidated report. Nothing in the skill depends on wshobson-agents-specific paths, tools, or terminology.
**Trigger**: When coordinating a review across multiple quality dimensions, especially for larger changes where security, performance, architecture, testing, or accessibility need separate attention.
**Steps/contract**: (1) Select review dimensions appropriate to the change. (2) Assign parallel reviewers by dimension. (3) Merge duplicate findings by file/line and issue identity, keeping the highest severity. (4) Preserve distinct issues even when co-located. (5) Calibrate severity using shared criteria. (6) Produce one consolidated report with per-severity sections, summary counts, and a recommendation.
**Strip**: None of the core mechanics are repo-specific; if adapting, only the example dimension matrix and markdown report skeleton need light tailoring to local conventions.
**Notes**: Strong portable SOP candidate. The deduplication rules and severity-calibration guidance are the most reusable parts; they would transfer cleanly into any multi-review or multi-agent QA workflow.
## plugins/agent-teams/skills/parallel-debugging/SKILL.md
**Type**: SOP — parallel debugging / root-cause arbitration methodology
**Portable**: Yes
**Reason**: The core workflow is domain-agnostic: form competing hypotheses, investigate in parallel, collect file:line evidence, classify outcomes, and arbitrate the most likely root cause. It avoids stack-specific tooling and can be applied to any codebase or incident response context.
**Trigger**: When a bug has multiple plausible causes, prior attempts have stalled, the issue spans several modules, or the team wants to reduce confirmation bias during debugging.
**Steps/contract**: (1) Generate hypotheses across the six failure-mode buckets: logic, data, state, integration, resource, environment. (2) Assign parallel investigators and require each to gather direct evidence with file:line citations. (3) Grade each hypothesis as confirmed, plausible, falsified, or inconclusive. (4) Compare confirmed hypotheses by confidence, evidence count, causal chain strength, and absence of contradicting evidence. (5) Declare the root cause or compound cause. (6) Validate the fix against the original reproduction and adjacent edge cases.
**Strip**: Nothing essential; the content is already generic. If adopting elsewhere, rename “parallel agents” to the local investigation model and keep the evidence-citation requirement abstract if file:line references are not the house standard.
**Notes**: The strongest transferable pieces are the evidence standard, the explicit hypothesis taxonomy, and the arbitration step that prevents premature closure. The six-bucket taxonomy is a good default, but projects may want to re-label it to match their incident/problem vocabulary.
## plugins/agent-teams/skills/task-coordination-strategies/SKILL.md
**Type**: Portable SOP candidate — task decomposition, dependency-graph design, task-spec writing, and workload rebalancing rules
**Portable**: Yes
**Reason**: The file is mostly process guidance rather than tool wiring. Its core advice — split complex work by layer/component/concern/ownership, keep dependency graphs shallow, write tasks with explicit contracts, and rebalance overloaded work — applies across repos and agent frameworks.
**Trigger**: When a complex job needs parallelization, when tasks have dependencies, when writing work items for teammates/agents, or when progress needs rebalancing across a team
**Steps/contract**:
  - Choose a decomposition axis first: layer, component, concern, or file ownership
  - Build a shallow dependency graph; identify the critical path; avoid circular dependencies; add dependencies only when required
  - Write each task with objective, owned files, requirements, interface contract, acceptance criteria, and scope boundaries
  - Monitor for idle, blocked, or overloaded contributors; use task updates and messages to rebalance work
**Strip**: Tool-specific task command names (`TaskCreate`, `TaskUpdate`, `TaskList`), example IDs, and concrete blockedBy/blocks syntax if the target system uses different task primitives; the illustrative ASCII diagrams can be reduced to generic examples
**Notes**: Strong portable SOP candidate. The only real implementation coupling is the task-management vocabulary and command surface; the planning heuristics themselves are reusable as-is and could become a standalone “task coordination” skill or project rule.
## plugins/agent-teams/skills/parallel-feature-development/SKILL.md
**Type**: Portable SOP candidate — parallel feature decomposition, file ownership, interface contracts, and integration patterns
**Portable**: Yes
**Reason**: The guidance is broadly reusable in any multi-agent or multi-contributor implementation setting. Its core value is process-level: assign one owner per file, split work by directory/module/layer or vertical slice, define read-only contracts at boundaries, and choose an integration shape that reduces merge conflict risk.
**Trigger**: When a large feature needs to be split across multiple implementers, when merge conflicts are likely, when teams need clear file ownership, or when parallel work streams must coordinate on shared interfaces.
**Steps/contract**: (1) Pick a decomposition strategy: directory, module, layer, or vertical slice. (2) Enforce one owner per file. (3) Move shared boundaries into read-only contract files owned by a lead or coordinator. (4) Prefer vertical slices when end-to-end independence matters; prefer horizontal layering when specialization is useful; mix both when shared infrastructure exists. (5) Use explicit merge handoff rules for index/barrel files and shared edits. (6) If the split drifts, pause new work and redistribute ownership before continuing.
**Strip**: The specific examples (`src/components/auth/`, `AuthResponse`, `feature/auth-*`) are illustrative and should be replaced with local paths and domain types; branch naming examples should be generalized to the repository’s branching convention; “team-lead” can become any single integration owner/coordinator role.
**Notes**: Strong portable candidate. The highest-value reusable rules are “one owner per file,” “extract shared contracts,” and “design for vertical slices or clean layer boundaries before parallelizing.” The branch-management section is useful but secondary; the main SOP is the ownership and integration contract model.
## plugins/conductor/skills/context-driven-development/SKILL.md
**Type**: Portable SOP candidate — context artifact lifecycle, validation, and synchronization workflow
**Portable**: Yes
**Reason**: The core guidance is broadly reusable: establish a small set of canonical context artifacts, keep them synchronized with code and plans, validate them before implementation, and update them as work completes. The workflow is framework-agnostic and reads like a general operating procedure for any project that wants persistent, structured context for human and AI collaborators.
**Trigger**: When starting a new project, onboarding to an existing codebase, deciding whether context docs need updates, validating readiness before implementation, or keeping product/tech/workflow/track documents aligned over time.
**Steps/contract**: (1) Identify the canonical context artifacts for product, communication, tech, workflow, and work tracking. (2) Read and validate those artifacts before starting implementation. (3) Update the affected artifact whenever product scope, dependencies, or workflow practices change. (4) Keep related documents synchronized when one artifact changes. (5) Use a simple lifecycle of create, validate, evolve, synchronize, and archive.
**Strip**: The `conductor/` directory name, `/conductor:setup` command, and specific file names like `product.md` or `tracks.md` should be generalized to the host project’s context registry; the exact artifact set can vary by workspace, but the pattern of one canonical doc per concern should remain.
**Notes**: This is a strong portable SOP candidate. The highest-value transferable element is the “context first, implement second” gate plus the explicit validation checklist; the directory layout and setup command are implementation details.
## plugins/agent-teams/skills/team-composition-patterns/SKILL.md
**Type**: Portable SOP candidate — team sizing heuristics, role-to-capability mapping, and coordination patterns
**Portable**: Yes
**Reason**: The core guidance is framework-agnostic: start with the smallest team that covers all required dimensions, match roles to capability/tooling needs, keep ownership boundaries explicit, and avoid duplicate coverage that increases coordination overhead. The preset team archetypes also generalize well as reusable templates for review, debugging, feature delivery, research, security, and migration workflows.
**Trigger**: When deciding how many agents to spin up, how to split work across parallel contributors, which capabilities each role needs, or how to keep a multi-agent workflow small and coordinated.
**Steps/contract**: (1) Identify the work dimensions that must be covered. (2) Choose the smallest team size that covers those dimensions. (3) Assign roles by capability and ownership, keeping one coordinator/lead when multiple agents are involved. (4) Avoid duplicate coverage unless the task explicitly needs redundant independent review. (5) Use environment-specific display/config settings only as an implementation detail.
**Strip**: Claude Code–specific names and config keys (`subagent_type`, `team-reviewer`, `team-debugger`, `team-implementer`, `team-lead`, `~/.claude/settings.json`, `teammateMode`, `tmux`, `iterm2`, `in-process`) should be generalized to the local agent/runtime equivalents; the preset team labels can become illustrative examples rather than required taxonomy; the Task-tool references should be replaced with the project’s own spawn/orchestration mechanism.
**Notes**: Strong portable SOP candidate for orchestration-heavy systems. The most reusable parts are the sizing heuristic (“smallest team that covers the dimensions”), the coordinator rule, and the warning against overlap/duplication.
## plugins/conductor/skills/workflow-patterns/SKILL.md
**Type**: Portable SOP candidate — TDD task lifecycle, phase checkpoints, verification gates, and commit/traceability workflow
**Portable**: Yes
**Reason**: The underlying workflow is broadly reusable across software teams: select the next task in order, mark work in progress, write failing tests first, implement minimally, refactor with tests green, verify coverage, document deviations, and record traceable checkpoints. The same pattern maps cleanly to other repos even though the exact plan/commit mechanics differ.
**Trigger**: When executing planned implementation work, especially in a TDD-oriented workflow with phase gates, checkpoint approvals, or a need for explicit traceability from plan item to code change.
**Steps/contract**:
  - Pick the next pending task in sequence and keep phase order intact
  - Record in-progress status before implementation and separate that bookkeeping from code changes
  - Write failing tests first, implement the minimum to pass, then refactor while preserving green tests
  - Verify coverage and other quality gates before marking work complete
  - Document deviations, update the plan with traceability data, and create checkpoint commits after approval
**Strip**: Repo-specific plan file names and status markers (`plan.md`, `[~]`, `[x]`, `[!]`, `[-]`), the Python/pytest example commands, the 80% coverage threshold if the adopting project uses a different standard, Git Notes as the required traceability mechanism, and the exact SHA-recording / checkpoint table formats should be generalized to the local project’s tracking system.
**Notes**: Strong reusable SOP if framed as a “task execution lifecycle” rather than a Conductor-specific workflow. The highest-value portable pieces are the ordered task progression, explicit red-green-refactor loop, phase-gate verification, and traceable completion records.
## plugins/conductor/skills/track-management/SKILL.md
**Type**: Portable SOP candidate — track lifecycle, spec/plan structure, registry hygiene, and status/traceability workflow
**Portable**: Yes
**Reason**: The core guidance is broadly reusable across project-management systems: define a work unit with an ID, spec, phased plan, and metadata; move it through creation, implementation, verification, and completion; and keep a registry/status source of truth synchronized. The workflow is framework-agnostic and maps cleanly to any repo that manages feature/bug/refactor work in tracked units.
**Trigger**: When creating or updating work tracks, writing specs or implementation plans, managing work-item status, synchronizing a registry, or enforcing traceability from task to completion.
**Steps/contract**: (1) Define the work unit with a stable identifier, type, and scope. (2) Write a spec that captures requirements, acceptance criteria, dependencies, risks, and open questions. (3) Break implementation into phased tasks with verification steps and clear status markers. (4) Keep the registry/metadata updated as work progresses. (5) Sync related docs on completion and archive or close the track cleanly.
**Strip**: Conductor-specific command names (`newTrack`, `/conductor:new-track`), file names (`spec.md`, `plan.md`, `tracks.md`, `metadata.json`, `index.md`) should be generalized to the local project’s tracking artifacts; the exact status marker set and ID format should become configurable conventions rather than required syntax.
**Notes**: Strong portable SOP candidate. The most reusable pieces are the spec/plan/registry triad, the phase-gated execution model, and the emphasis on traceability and completion hygiene. The date-based ID scheme is useful but should be adapted to the host project’s naming rules.
## plugins/developer-essentials/skills/debugging-strategies/SKILL.md
**Type**: Portable **Reason**: A general debugging workflow is technology-agnostic: reproduce, gather evidence, hypothesize, test, and verify. **Trigger**: Bugs, regressions, flaky behavior, performance issues, crashes, memory leaks, production incidents, or unfamiliar codebases. **Steps/contract**: Reproduce the issue; collect errors, environment details, and recent changes; form a narrow hypothesis; test with logging/debugger/profiling/bisect/differential checks; confirm root cause; verify the fix. **Strip**: Language-specific debugger configs and code snippets (JS/Python/Go), product-specific tool names, and any environment assumptions not needed for the universal workflow. **Notes**: Strong portable SOP candidate; keep the scientific-method framing and troubleshooting checklist, but separate the illustrative tooling examples into optional appendices.
## plugins/developer-essentials/skills/code-review-excellence/SKILL.md
**Type**: Portable SOP candidate — code review review process, feedback style, and review checklists
**Portable**: Yes
**Reason**: The core workflow is broadly reusable across repos and tooling: gather context, review architecture and tests before line-by-line details, focus feedback on correctness/security/performance/maintainability, and close with a clear decision. The communication guidance (specific, actionable, collaborative, severity-tagged comments) is domain-agnostic and useful in any engineering team.
**Trigger**: When reviewing pull requests or large diffs, defining review standards, coaching reviewers, or creating a repeatable code-review checklist for a team.
**Steps/contract**: (1) Read the PR context, linked issue, and CI status before reviewing code. (2) Review high-level design, file organization, and test strategy first. (3) Inspect each file for correctness, security, performance, and maintainability issues. (4) Leave comments that are specific, actionable, and severity-tagged. (5) Summarize strengths, required changes, suggestions, and a clear approve/request-changes decision. (6) Use the checklist and question-based feedback patterns to keep reviews constructive.
**Strip**: The specific PR size guidance, example severity emojis, and language-specific code snippets are illustrative and should be adapted to local review norms; the exact checklist items may vary by stack, but the structure of context → high-level review → line-by-line review → summary is the durable SOP.
**Notes**: Strong portable SOP candidate. The most reusable elements are the staged review process, the “feedback is educational and actionable” rule, and the explicit separation of blocking issues from nits and suggestions. The skill can be generalized into a team-wide review protocol with minimal modification.
## plugins/developer-essentials/skills/error-handling-patterns/SKILL.md
**Type**: Portable SOP candidate — error-handling strategy, custom error taxonomy, retries, circuit breakers, aggregation, and graceful degradation
**Portable**: Yes
**Reason**: The file is mostly language-agnostic guidance on how to think about failures: classify recoverable vs unrecoverable errors, preserve context, catch at the right level, avoid swallowing exceptions, and choose between exceptions, Result types, and fallback behavior. The concrete examples span Python, TypeScript, Rust, and Go, which reinforces that the underlying workflow is reusable across stacks.
**Trigger**: When designing or reviewing error handling in application code; adding retries, circuit breakers, or fallbacks; improving validation and user-facing messages; or standardizing how services propagate and log failures.
**Steps/contract**: (1) Classify the failure mode first: expected/recoverable vs unrecoverable vs programming bug. (2) Pick the error surface that matches the context: exceptions, Result types, explicit error returns, or Option/Maybe. (3) Preserve context when rethrowing or wrapping errors. (4) Handle errors at the narrowest level that can meaningfully recover. (5) Add cleanup, retry, circuit-breaker, aggregation, or fallback behavior only where the failure mode justifies it. (6) Keep logging proportional so expected failures do not become noisy.
**Strip**: Language-specific class definitions, syntax, and helper implementations (`ApplicationError`, `AggregateError`, `Result<T>`, `CircuitBreaker`, `errors.Is/As`, `?` operator examples) should be generalized to the host language’s error model; the exact logger, HTTP client, and datastore calls are illustrative only.
**Notes**: Strong portable candidate. The best reusable SOP content is the decision tree for choosing an error strategy plus the best-practice checklist (“fail fast,” “preserve context,” “don’t swallow errors,” “clean up resources”). The language sections are valuable examples, but the core workflow stands on its own as a cross-language resilience pattern.
## plugins/developer-essentials/skills/sql-optimization-patterns/SKILL.md
**Type**: Portable SOP candidate — SQL performance tuning, index strategy, and query-plan analysis workflow
**Portable**: Yes
**Reason**: The core workflow is broadly reusable across SQL-backed systems: inspect execution plans, identify scan/join bottlenecks, choose the right index shape, remove avoidable row work, and validate improvements with measured results. The guidance is framed as optimization habits rather than repo-specific automation, and the examples mostly illustrate universal database concepts (EXPLAIN, composite/partial/covering indexes, pagination, batching, partitioning, and maintenance).
**Trigger**: When a query is slow, a schema needs performance tuning, EXPLAIN output must be interpreted, N+1 patterns appear, pagination is large-offset based, or a workload needs indexing/aggregation/partitioning guidance.
**Steps/contract**: (1) Inspect the plan with EXPLAIN/ANALYZE and identify the dominant cost drivers. (2) Match the query shape to an index strategy: single-column, composite, partial, expression, covering, or specialized type index. (3) Rewrite queries to reduce unnecessary scans, joins, offsets, correlated subqueries, and row-by-row operations. (4) Prefer batch operations, cursor pagination, and precomputation where workload patterns justify them. (5) Re-run the query after the change and compare the before/after plan and latency.
**Strip**: Database-brand specifics such as PostgreSQL-only catalog queries, MySQL index-hint syntax, and vendor-specific maintenance commands should be generalized to the target engine; the exact EXPLAIN fields and statistics tables are implementation details, not the SOP itself.
**Notes**: Strong portable SOP candidate. The most reusable parts are the diagnostic loop (plan → bottleneck → rewrite → verify), the index-selection heuristics, and the anti-pattern list. The vendor-specific sections are useful examples, but the skill can be distilled into a general SQL optimization playbook.
## plugins/developer-essentials/skills/auth-implementation-patterns/SKILL.md
**Type**: Portable SOP candidate — authentication/authorization implementation patterns, access-control design, and security hardening
**Portable**: Yes
**Reason**: The underlying guidance is broadly reusable across stacks: separate authentication from authorization, choose an auth strategy based on session/state needs, implement token refresh and revocation carefully, enforce RBAC/permissions/ownership server-side, and pair the auth flow with password hygiene, rate limiting, and secure cookies. The concrete code examples are framework-specific, but the decision points and control patterns are universal.
**Trigger**: When designing or migrating auth systems, securing APIs, adding social login or SSO, implementing RBAC or ownership checks, hardening login/reset flows, or debugging auth/security failures.
**Steps/contract**: (1) Choose the auth model that fits the product: session-based, token-based, or federated OAuth/OIDC. (2) Keep authentication and authorization checks separate. (3) Issue short-lived access credentials and store/rotate refresh or session state securely. (4) Enforce roles, permissions, and ownership on the server for every sensitive action. (5) Protect credential flows with hashing, validation, secure cookies, CSRF defenses where relevant, and rate limiting. (6) Log and revoke safely for logout, token loss, or suspicious activity.
**Strip**: Express/Passport/Redis-specific setup, JWT library calls, database method names, and the exact route examples should be generalized to the host stack; the `Bearer` header, cookie options, and schema code are implementation details, not the portable SOP itself.
**Notes**: Strong portable candidate. The most reusable SOP value is the auth-design checklist and the layered defense model: identity verification, session/token lifecycle, authorization enforcement, and operational hardening. The specific code blocks are illustrative and can be collapsed into stack-agnostic patterns.
## plugins/developer-essentials/skills/e2e-testing-patterns/SKILL.md
**Type**: Portable SOP candidate — E2E testing standards, stability patterns, and debugging workflow
**Portable**: Yes
**Reason**: The core guidance is framework-agnostic at the process level: focus E2E on critical user journeys, keep tests deterministic and independent, prefer stable selectors, mock external dependencies when it improves reliability, and use evidence-based waits and debugging steps. Playwright/Cypress are the example tool surfaces, but the testing philosophy transfers cleanly to any web stack or UI automation tool.
**Trigger**: When defining or improving end-to-end test practice, reducing flaky tests, deciding what belongs in E2E vs unit/integration tests, adding CI coverage for critical flows, or debugging failing browser tests.
**Steps/contract**: (1) Choose critical user journeys and complex interactions for E2E coverage. (2) Keep tests isolated, deterministic, and fast by using stable selectors and controlled test data. (3) Prefer condition-based waits and assertions over fixed delays. (4) Mock or intercept external services where it reduces flake without hiding the behavior under test. (5) Add accessibility, visual regression, and cross-browser checks where they provide value. (6) Debug failures with reproduction, traces/screenshots, headed/debug runs, and stepwise inspection before changing the test.
**Strip**: Tool-specific config keys, commands, APIs, and examples (`playwright.config.ts`, `cypress.config.ts`, `page.route`, `cy.intercept`, `AxeBuilder`, shard syntax, and browser/project names) should be generalized to the target UI test runner; selector examples like `data-testid`/`data-cy` are portable patterns, but the exact attribute name can match local conventions.
**Notes**: Strong portable SOP candidate. The most reusable pieces are the testing pyramid framing, selector/waiting rules, test-data cleanup discipline, and the “debug with evidence first” workflow. The Playwright/Cypress sections are useful illustrations, but the SOP itself is really a general E2E testing standard.
## plugins/developer-essentials/skills/git-advanced-workflows/SKILL.md
**Type**: Portable SOP candidate — advanced Git history surgery, targeted commit transfer, regression isolation, multi-branch worktree, and recovery workflow
**Portable**: Yes
**Reason**: The workflow is broadly reusable across any Git-based project: the core moves are interactive rebase for history cleanup, cherry-pick for selective commit transfer, bisect for root-cause isolation, worktrees for parallel branch work, and reflog for recovery. These are standard Git primitives rather than repo-specific conventions.
**Trigger**: When cleaning up local history before merge, porting fixes across branches, isolating the commit that introduced a regression, working on multiple branches simultaneously, or recovering lost work after a mistaken reset/rebase.
**Steps/contract**: (1) Use interactive rebase to reorder, squash, reword, or split local commits before sharing. (2) Use cherry-pick to move specific fixes between branches without merging unrelated work. (3) Use bisect with a known-good and known-bad commit to identify the first bad change. (4) Use worktrees when parallel branch work would otherwise require stashing or frequent context switching. (5) Use reflog to recover commits or branches after destructive mistakes. (6) Prefer backup branches and `--force-with-lease` for risky history rewrites.
**Strip**: Example branch names, command sequences, and workflow narratives should be generalized to the host repo’s branching policy; any references to `main`, release branches, or specific directory layouts are illustrative rather than required.
**Notes**: Strong portable SOP candidate. The most reusable elements are the decision points for choosing rebase vs merge, cherry-pick vs branch merge, and bisect vs manual debugging; the Git command examples are universal enough to keep as examples, but the “safe force push” and backup-branch guidance should be framed as policy.
## plugins/developer-essentials/skills/nx-workspace-patterns/SKILL.md
**Type**: Portable **Reason**: Generic Nx monorepo setup and optimization guidance that transfers across repos using Nx. **Trigger**: Nx workspace setup, project boundaries, affected commands, caching, or monorepo maintenance. **Steps/contract**: Establish workspace config, define project/library conventions, enforce module boundaries, configure generators, wire affected CI, and enable caching. **Strip**: Repo-specific app/lib names, exact executor choices, concrete paths, and cache-provider implementation details. **Notes**: Useful as a baseline SOP; adapt schema/version details to the target Nx release and stack.
## plugins/developer-essentials/skills/monorepo-management/SKILL.md
**Type**: Portable SOP candidate — monorepo setup, workspace dependency management, build caching, shared config, and CI patterns
**Portable**: Yes
**Reason**: The core guidance is broadly reusable across monorepos: define workspace layout, centralize shared configs, manage package boundaries and dependency graphs, cache builds/tests effectively, and wire CI to run affected tasks. The workflow is not tied to a single repo shape even though it uses Turborepo, Nx, and pnpm as examples.
**Trigger**: When setting up or migrating a monorepo; deciding on workspace/package layout; configuring shared TypeScript, lint, or release tooling; optimizing build/test performance; or designing CI for multi-package repositories.
**Steps/contract**: (1) Pick a workspace/package layout and keep the dependency graph acyclic. (2) Centralize shared tooling and configs at the repo root or a dedicated config package. (3) Define package boundaries and exports so shared code is explicit. (4) Configure build/test caches with clear inputs and outputs. (5) Run tasks through workspace filters or affected-project selection. (6) Use CI to install once, build/test/lint consistently, and deploy only affected apps or packages.
**Strip**: Product-specific scaffolding such as `apps/`, `packages/`, `tools/`, example package names, and the concrete Turborepo/Nx command syntax should be generalized to the adopting repo’s workspace manager and task runner; the sample JSON/YAML snippets can be reduced to template patterns.
**Notes**: Strong portable SOP candidate. The highest-value reusable parts are the dependency-graph discipline, shared-config centralization, cache/input-output thinking, and affected-only CI/deploy strategy.
## plugins/developer-essentials/skills/turborepo-caching/SKILL.md
**Type**: Portable SOP candidate — build-cache configuration, task-graph shaping, CI scoping, and cache-debugging workflow
**Portable**: Yes
**Reason**: The core guidance is broadly reusable in any monorepo build system: define a clear task graph, make cache keys explicit with inputs/env/outputs, keep long-running dev tasks uncached, scope CI to affected packages, and debug misses with dry runs and graph inspection. The file is Turbo-flavored, but the process itself is a general build-performance SOP.
**Trigger**: When setting up or tuning monorepo builds, adding remote/local caching, reducing CI time, diagnosing cache misses, or deciding how to scope build/test runs across packages.
**Steps/contract**: (1) Map the workspace and identify task dependencies. (2) Declare cacheable outputs and explicit inputs/env that affect results. (3) Mark persistent or destructive tasks as non-cacheable. (4) Add remote cache support when multiple environments should share artifacts. (5) Scope CI runs to changed packages and their dependency graph. (6) Debug misses with dry-run/verbose/graph tooling before changing the pipeline.
**Strip**: Turbo-specific JSON schema names, `npx turbo` command syntax, Vercel login/link steps, self-hosted cache API implementation, and package-manager-specific CI snippets should be generalized to the host build system; the exact filter flags and cache endpoints are implementation details.
**Notes**: Strong portable candidate once reframed as a generic “build caching and pipeline optimization” SOP. The most reusable parts are the explicit-inputs rule, the persistent-task rule, and the affected-scope CI pattern; the remote-cache examples are useful but vendor-specific.
## plugins/developer-essentials/skills/bazel-build-optimization/SKILL.md
**Type**: Portable SOP candidate — Bazel build optimization workflow, caching, remote execution, and dependency analysis
**Portable**: Yes
**Reason**: The underlying optimization loop is broadly reusable in any large build system: keep targets fine-grained, inspect dependency graphs, profile slow actions, eliminate avoidable work, apply local/remote caching where available, and verify improvements with before/after metrics. The Bazel-specific syntax is implementation detail, but the build-performance discipline itself transfers well to other monorepo tooling.
**Trigger**: When builds are slow, caches are ineffective, remote execution is being introduced or tuned, build graphs are sprawling, custom build rules need to be written, or a project is migrating to or from Bazel.
**Steps/contract**: (1) Map the build architecture and locate the hot paths in the target graph. (2) Profile builds and inspect dependency and action output to identify dominant costs. (3) Reduce unnecessary work by tightening target boundaries, visibility, and dependencies. (4) Configure reproducible local caching and, where appropriate, remote caching/execution. (5) Re-run the same workloads and compare latency, cache hit rate, and graph size before promoting changes.
**Strip**: Bazel-only file names and flags (`WORKSPACE.bazel`, `.bazelrc`, `.bazelversion`, `bazel query`, `bazel analyze-profile`), rule-set names (`rules_js`, `rules_python`, `aspect_rules_ts`), and the example Docker/TypeScript/Python snippets should be generalized to the host build system’s equivalent primitives.
**Notes**: Strong portable SOP candidate if framed as a build-optimization playbook rather than a Bazel cookbook. The most reusable parts are the profiling/diagnosis loop, the fine-grained-target guideline, and the cache-first performance strategy.
## plugins/incident-response/skills/postmortem-writing/SKILL.md
**Type**: Portable SOP candidate — blameless incident review, root-cause analysis, timeline reconstruction, and action-item workflow
**Portable**: Yes
**Reason**: The workflow is domain-agnostic: define the incident impact, reconstruct an evidence-backed timeline, analyze proximate and systemic causes, capture lessons learned, and turn them into owned follow-up actions. The facilitation guidance and anti-pattern list also generalize well to any post-incident review process that aims to improve systems rather than assign blame.
**Trigger**: After incidents, outages, near-misses, or other failures that merit a structured review; when drafting or facilitating a postmortem; or when turning incident learnings into tracked remediation work.
**Steps/contract**: (1) Record the incident summary, impact, severity, and duration. (2) Build a timestamped timeline from detection through recovery. (3) Separate proximate causes from contributing factors and systemic gaps. (4) Use a structured root-cause method such as 5 Whys when it helps clarify the causal chain. (5) Document what worked, what did not, and what was learned. (6) Assign concrete action items with owners, due dates, and tracking references, then follow up on completion.
**Strip**: The severity labels (`SEV1`, `SEV2`, `SEV3`), UTC-specific examples, sample incident metrics, and template field names should be generalized to the host organization’s incident taxonomy and reporting format; the example timelines, graphs, and ticket IDs are illustrative rather than required. 
**Notes**: Strong portable SOP candidate. The most reusable parts are the blameless framing, evidence-based timeline, causal analysis structure, and owned action-item loop. The meeting-facilitation agenda and anti-pattern checklist are also broadly portable and could serve as a standard incident-review template.
## plugins/incident-response/skills/on-call-handoff-patterns/SKILL.md
**Type**: Portable SOP candidate — on-call handoff, incident continuity, and shift-transition workflow
**Portable**: Yes
**Reason**: The guidance is domain-agnostic and maps cleanly to any operational team: capture current incidents, active investigations, recent changes, known issues, and upcoming events; use an overlap window; transfer context with a written handoff plus sync; and require explicit verification that the incoming responder can receive alerts and follow escalation paths. The concrete incident examples are illustrative rather than implementation-bound.
**Trigger**: When handing off on-call responsibilities, transferring an ongoing incident between responders, onboarding someone into an on-call rotation, or standardizing shift-summary quality across teams.
**Steps/contract**: (1) Document active incidents, ongoing investigations, recent changes, known issues, and upcoming events. (2) Build in a short overlap window with a written handoff plus live or async sync. (3) Use a checklist gate so every handoff section is either filled or explicitly marked none. (4) For mid-incident handoffs, include current status, known facts, actions taken, next steps, key people, and communication status. (5) Verify alert routing, Slack/PagerDuty notifications, and access before the outgoing engineer signs off. (6) Store completed handoffs in a shared, discoverable location and link them from the on-call schedule.
**Strip**: Repo-specific template text, example ticket IDs, URLs, team names, and the exact overlap timing should be generalized to the host team’s schedule and tooling; the troubleshooting examples can become local runbook guidance.
**Notes**: Strong portable SOP candidate. The highest-value reusable rules are the completeness gate, the overlap-and-sync handoff model, and the explicit “test alert before sign-off” check. The async fallback and mid-incident handoff template are especially reusable in distributed teams.
## plugins/incident-response/skills/incident-runbook-templates/SKILL.md
**Type**: SOP — incident response runbook template and operational workflow
**Portable**: Yes
**Reason**: The underlying structure is broadly reusable across incident management contexts: define severity, assess impact, triage quickly, mitigate safely, verify recovery, communicate on a cadence, and capture follow-up. The file is mostly process guidance with examples, not tight coupling to a specific repo or toolchain.
**Trigger**: When creating or updating incident runbooks; onboarding on-call engineers; responding to live outages or degraded service; standardizing escalation and communication procedures.
**Steps/contract**: (1) Start with metadata, severity, owner, and a quick checklist. (2) Triage impact and scope before making changes. (3) Follow numbered mitigation steps with prerequisite checks and rollback options. (4) Verify recovery with objective checks and smoke tests. (5) Keep communication on a fixed update cadence and assign a dedicated communicator. (6) Add review cadence / last-verified metadata so runbooks stay current.
**Strip**: Service-specific names, endpoints, dashboards, Slack/PagerDuty channel names, kubectl/psql command examples, and any cloud-provider or database-specific snippets should be generalized to the host system’s incident tooling.
**Notes**: Strong portable SOP candidate. The most transferable elements are the 3 AM-friendly checklist, prerequisite/expected-output annotations, explicit warnings before destructive actions, and the separation of incident commander vs communicator roles. The postmortem and handoff references are also reusable as adjacent follow-on SOPs.
## plugins/documentation-generation/skills/architecture-decision-records/SKILL.md
**Type**: Portable SOP candidate — architecture decision records (ADRs), decision lifecycle, and review/index maintenance workflow
**Portable**: Yes
**Reason**: The core practice is domain-agnostic: capture context, decision, and consequences for significant technical choices; use ADRs for meaningful architecture/technology trade-offs; and keep a lightweight lifecycle plus index so decisions stay discoverable over time. The structure works in any repo that needs durable decision traceability.
**Trigger**: When making major architecture or technology choices, documenting trade-offs, recording deprecations or supersessions, reviewing past decisions, or establishing a team decision-making process.
**Steps/contract**: (1) Write an ADR when the decision is significant and long-lived. (2) Capture context, decision drivers, considered options, the decision itself, rationale, and consequences. (3) Track status through a simple lifecycle such as proposed, accepted, deprecated, superseded, or rejected. (4) For superseding decisions, create a new ADR rather than rewriting the old one. (5) Keep an ADR index or README synchronized and link related decisions. (6) Review for clarity, trade-offs, and implementation follow-through before acceptance.
**Strip**: ADR tooling commands (`adr-tools`, `adr init`, `adr new`, `adr link`, `adr generate toc`), example technology choices (PostgreSQL, TypeScript, MongoDB, EventStoreDB, Kong), and repository-specific paths like `docs/adr/` should become project-local examples or placeholders; template variants (MADR, Y-statement, RFC style) are illustrative rather than required.
**Notes**: Strong portable SOP candidate. The most reusable pieces are the ADR decision structure, the “don’t edit accepted ADRs; supersede them” rule, and the index/update hygiene. The templates and automation are helpful implementation aids, but the SOP stands on its own without adr-tools.
## plugins/documentation-generation/skills/openapi-spec-generation/SKILL.md
**Type**: Portable SOP candidate — OpenAPI 3.1 specification authoring, generation, and validation workflow
**Portable**: Yes
**Reason**: The workflow is broadly reusable anywhere APIs are documented or contract-first development is practiced: define the spec shape, choose design-first vs code-first vs hybrid, reuse components via refs, add examples and error responses, and validate/lint the result. The guidance is process-oriented even though the domain is OpenAPI-specific.
**Trigger**: When creating API docs, generating specs from code, designing API contracts, validating implementations against a contract, or setting up SDK/doc tooling around an API.
**Steps/contract**: (1) Choose the spec workflow: design-first, code-first, or hybrid. (2) Define paths, components, security, and reusable refs in an OpenAPI 3.1 document. (3) Include concrete examples, error responses, and versioning/security details. (4) Validate the spec and enforce conventions with linting/rulesets. (5) Generate SDKs/docs from the validated spec when needed.
**Strip**: The example YAML blocks, specific tool names (`tsoa`, `openapi-generator-cli`, Spectral, Redocly), concrete example URLs, and the sample user-management schema should be generalized to the host API domain and toolchain; the OpenAPI 3.1 version string and exact component names are implementation details, not the portable SOP itself.
**Notes**: Strong portable SOP candidate for API teams. The most reusable elements are the design-first/code-first decision, the “use refs and examples” rule, and the validation/linting gate before publishing or generating clients.
## plugins/backend-development/skills/api-design-principles/SKILL.md
**Type**: Portable SOP candidate — API design principles for REST/GraphQL, versioning, pagination, errors, and resolver patterns
**Portable**: Yes
**Reason**: The reusable core is the design workflow: model APIs around resources and stable HTTP semantics, choose a clear versioning strategy, standardize pagination/filtering/error shapes, and apply schema-first GraphQL patterns with batching to avoid N+1 issues. Those principles hold across languages, frameworks, and service architectures.
**Trigger**: When designing a new API, reviewing an API spec, refactoring endpoint structure, standardizing response/error contracts, or migrating between REST and GraphQL.
**Steps/contract**: (1) Model endpoints or schema around domain resources and operations rather than actions. (2) Use the correct HTTP method and status semantics for REST, or schema-first types/inputs/payloads for GraphQL. (3) Define consistent pagination, filtering, and error-response conventions early. (4) Choose and document a versioning/deprecation strategy before breaking changes land. (5) Prevent N+1 and response bloat with batching, DataLoaders, and cursor pagination where appropriate. (6) Review docs and examples to ensure the API stays developer-friendly and predictable.
**Strip**: FastAPI, Pydantic, Ariadne, and DataLoader implementation snippets; Python class definitions; example route strings; and the exact REST/GraphQL code samples should become host-stack examples. HATEOAS, Relay-style pagination, and header/query versioning are patterns to adapt, not mandatory syntax.
**Notes**: Strong portable SOP candidate. The most transferable value is the API-design checklist and contract discipline; the code blocks are illustrative, but the policy around naming, status codes, pagination, and deprecation is reusable as-is.
## plugins/documentation-generation/skills/changelog-automation/SKILL.md
**Type**: Portable SOP candidate — changelog generation, release-note automation, commit taxonomy, and version-bump workflow
**Portable**: Yes
**Reason**: The core workflow is repo-agnostic: choose a changelog standard, map commit types to release sections, automate versioning and release-note generation, and validate the output in CI. The skill uses common industry conventions (Keep a Changelog, Conventional Commits, Semantic Versioning) that transfer cleanly across languages and toolchains.
**Trigger**: When setting up or improving release automation, standardizing commit messages, generating changelogs or GitHub release notes, or deciding how to bump versions from commits and tags.
**Steps/contract**: (1) Pick the changelog format and release taxonomy up front. (2) Map commit types to changelog sections and define which types are excluded. (3) Configure a generator or release tool to produce changelogs and tags automatically. (4) Add validation so commit messages and generated notes stay consistent. (5) Keep release workflows reproducible in CI or scripted release jobs.
**Strip**: Tool-specific setup for `standard-version`, `semantic-release`, `git-cliff`, `commitizen`, Husky/commitlint, and GitHub Actions should be generalized to the host repo’s release tooling; the example config files, shell commands, and URL templates are implementation details rather than portable SOP content.
**Notes**: Strong portable candidate. The most reusable parts are the commit-to-section mapping, the SemVer release rule, and the “generate rather than hand-edit” release hygiene. The concrete tooling examples are useful references, but the durable SOP is the automation contract around versioned release documentation.
## plugins/backend-development/skills/architecture-patterns/SKILL.md
**Type**: Portable SOP candidate — backend architecture patterns, clean architecture, hexagonal architecture, and DDD layering guidance
**Portable**: Yes
**Reason**: The core workflow is broadly reusable across backend stacks: define inward-only dependency rules, keep business logic framework-free, isolate external systems behind ports/adapters, and model bounded contexts with explicit aggregates, value objects, repositories, and domain events. The examples are Python-specific, but the architectural contract itself is language-agnostic and maps to most service codebases.
**Trigger**: When designing a new backend service, refactoring a monolith, untangling dependency cycles, enforcing testable boundaries, or choosing how to structure domains, adapters, and use cases.
**Steps/contract**: (1) Put domain logic in a framework-free core. (2) Expose external dependencies through abstract ports/interfaces. (3) Keep use cases orchestration-only and prevent controllers from containing business rules. (4) Model bounded contexts with clear aggregate roots, value objects, repositories, and domain events. (5) Use in-memory adapters to test use cases without a real database or network. (6) Enforce dependency direction so inner layers never import outer layers.
**Strip**: Python syntax, FastAPI/asyncpg examples, repository path names, and concrete class names should be generalized to the host stack; the sample directory tree is illustrative and can be replaced with the repo’s own layer names as long as the dependency rule remains intact.
**Notes**: Strong portable SOP candidate. The highest-value transferable parts are the inward-dependency rule, the ports/adapters boundary, the “controllers only parse/map” guideline, and the in-memory-testability requirement. The DDD sections are useful as a default vocabulary, but the portable core is the architecture contract rather than the example implementation.
## plugins/backend-development/skills/saga-orchestration/SKILL.md
**Type**: Portable SOP candidate — distributed transaction coordination, compensating actions, and long-running workflow orchestration
**Portable**: Yes
**Reason**: The core workflow is broadly reusable across backend systems: choose orchestration vs choreography, define ordered saga steps with compensations, make each participant idempotent, configure per-step timeouts, and monitor for stuck or failed compensation states. The skill is framed as a general distributed-systems operating procedure rather than being tied to one framework or repo layout.
**Trigger**: When coordinating multi-service transactions without 2PC, designing compensating workflows for partial failures, implementing order/booking/approval flows that span several services, or debugging sagas that stall in pending or compensating states.
**Steps/contract**: (1) Map service ownership and the business sequence. (2) Choose orchestration or choreography based on visibility and coupling needs. (3) Define each forward action plus its compensation, with reverse-order rollback. (4) Require idempotency keys and replay-safe handlers for every participant. (5) Set per-step timeouts, retries, and DLQ/manual-intervention paths. (6) Emit saga state transitions and alerts for stuck or failed compensation.
**Strip**: Concrete code samples, class names, and example service names (inventory/payment/shipping/notification) should be generalized to the host domain; the exact broker choices (Kafka/RabbitMQ/SQS) and file links to `references/advanced-patterns.md` are implementation details, not the SOP itself.
**Notes**: Strong portable SOP candidate. The highest-value reusable pieces are the decision rule for orchestration vs choreography, the idempotency/compensation contract, and the operational guidance for timeouts, retries, and stuck-saga recovery.
## plugins/backend-development/skills/cqrs-implementation/SKILL.md
**Type**: Portable SOP candidate — CQRS command/query separation, bus/handler/projector workflow
**Portable**: Yes
**Reason**: The core guidance is framework-agnostic: separate write and read models, route commands to handlers and queries to read-side handlers, project events into denormalized read models, and choose CQRS when read/write scaling or model divergence justify it. The architecture and decision criteria transfer across stacks.
**Trigger**: When a system needs independent read/write scaling, divergent read/write models, event-sourced persistence, or optimized reporting/query workloads.
**Steps/contract**: (1) Split command and query paths. (2) Keep commands intent-focused and validated in handlers. (3) Persist changes through aggregates/events and project them into read models. (4) Route reads through dedicated query handlers over denormalized views. (5) Add buses/dispatchers only as an integration layer; keep domain logic in handlers/aggregates. (6) Prefer CQRS only when the added complexity buys clear read/write or modeling benefits.
**Strip**: Python/FastAPI/asyncio code, dataclass and typing syntax, specific order/customer example types, SQL table names, and concrete query pagination code should be generalized to host language and domain; the example bus and repository interfaces are implementation details.
**Notes**: Strong portable SOP if framed as a CQRS adoption/implementation playbook. The read/write split and projector workflow are the highest-value reusable parts; the large code samples are illustrative and should be trimmed when promoting to a live skill.
## plugins/backend-development/skills/event-store-design/SKILL.md
**Type**: Portable SOP candidate — event-store design, append-only schema, optimistic concurrency, subscriptions, and operational patterns
**Portable**: Yes
**Reason**: The core guidance is general event-sourcing practice, independent of any single framework: define append-only immutable events, per-stream and global ordering, optimistic concurrency, idempotency, projection/subscription checkpoints, and schema/versioning. The concrete PostgreSQL, Python, EventStoreDB, and DynamoDB snippets are examples of how to implement the same workflow.
**Trigger**: When designing or reviewing event sourcing infrastructure, selecting event-store technology, defining event schemas, implementing append/read/subscription flows, or planning scaling and snapshotting.
**Steps/contract**: (1) Choose the event-store model and storage engine. (2) Enforce append-only writes with per-stream version checks and idempotency keys/event IDs. (3) Preserve ordered reads per stream and a global position for subscriptions. (4) Add snapshots and checkpoints where replay or read costs justify them. (5) Build subscription consumers to resume from checkpoints and handle backpressure. (6) Keep event payloads small and version events from the start.
**Strip**: Specific SQL DDL, Python asyncpg code, EventStoreDB client calls, DynamoDB item shapes, and exact table/index names should be generalized to the host platform; the example technologies are implementation options, not the SOP itself.
**Notes**: Strong portable candidate. The most reusable part is the operational contract for event stores: immutability, concurrency control, replayable ordering, and checkpointed subscriptions. Technology-specific templates are useful appendices but not essential to the SOP.
## plugins/backend-development/skills/microservices-patterns/SKILL.md
**Type**: Portable SOP candidate — microservices decomposition, inter-service communication, distributed data, and resilience patterns
**Portable**: Yes
**Reason**: The core workflow is broadly reusable across backend systems: define service boundaries around business capabilities or bounded contexts, choose sync vs async communication intentionally, keep data ownership per service, use sagas and compensations for distributed operations, and apply resilience controls such as retries, circuit breakers, and bulkheads. The skill is process-oriented even though the code samples are Python-specific.
**Trigger**: When decomposing a monolith, designing service boundaries and contracts, selecting inter-service communication patterns, coordinating distributed data/transactions, or hardening service-to-service calls.
**Steps/contract**: (1) Decompose services by business capability or bounded context. (2) Prefer clear ownership and database-per-service. (3) Choose synchronous request/response or asynchronous eventing based on coupling and latency needs. (4) Use sagas and compensating actions for cross-service workflows. (5) Add retries, timeouts, circuit breakers, and bulkheads to client calls. (6) Keep API gateway and event bus patterns focused on routing/coordination, not business logic.
**Strip**: Python syntax, FastAPI/httpx/aiokafka/circuitbreaker snippets, example service names, and concrete Kafka/RabbitMQ/SQS choices should be generalized to the host stack; the sample classes and method bodies are illustrative.
**Notes**: Strong portable SOP candidate. The most reusable parts are the boundary-setting checklist, the sync-vs-async decision rule, the saga/compensation guidance, and the resilience defaults for service-to-service communication.
## plugins/backend-development/skills/temporal-python-testing/SKILL.md
**Type**: Portable SOP candidate — Temporal Python workflow testing strategy, including unit, integration, replay, and local development testing
**Portable**: Yes
**Reason**: The core testing workflow is framework-agnostic at the SOP level: choose test scope by isolation level, use time-skipping or test doubles to keep long-running workflows fast, validate determinism with replay tests, and keep a clear split between workflow logic, activity behavior, and end-to-end checks. The file is Temporal/Python-flavored, but the process principles transfer to any workflow engine or asynchronous job system.
**Trigger**: When introducing or reviewing workflow tests, choosing between unit/integration/e2e coverage, debugging determinism failures, setting up local Temporal-style test infrastructure, or defining CI coverage expectations for long-running orchestrations.
**Steps/contract**: (1) Prefer the lightest test that can prove the behavior, then add broader integration coverage for critical paths. (2) Use time-skipping or equivalent fast-forwarded execution for long workflow paths. (3) Mock or stub activities/external dependencies when the workflow logic is the subject under test. (4) Add replay/determinism tests before deploying workflow changes that may affect history compatibility. (5) Keep local setup and CI wiring focused on repeatable test execution, coverage reporting, and clear pytest-style fixtures or equivalents.
**Strip**: Temporal SDK class names (`WorkflowEnvironment`, `ActivityEnvironment`, `Worker`), pytest/asyncio fixture syntax, the 80% coverage threshold if the host project uses a different bar, and references to Temporal-specific docs/resources should be generalized to the adopting workflow engine and test runner.
**Notes**: Strong portable SOP candidate. The highest-value reusable pieces are the test-tier split, the fast-forward/time-skipping idea, and the replay/determinism gate; the specific Python snippets are implementation examples, not the SOP itself.
## plugins/backend-development/skills/workflow-orchestration-patterns/SKILL.md
**Type**: Portable SOP candidate — workflow orchestration patterns, saga/compensation, entity workflows, determinism, retries, and idempotency
**Portable**: Yes
**Reason**: The workflow-level guidance is broadly reusable across any orchestration engine or distributed-system stack: separate orchestration from external side effects, model long-running processes with durable state, use compensations for multi-step rollback, design for retries and idempotency, and keep deterministic control flow in the orchestrator. Temporal is the main concrete implementation, but the underlying operating procedure applies to other workflow engines and hand-rolled orchestrators.
**Trigger**: When designing long-running business processes, distributed transactions, entity lifecycle workflows, async approval/callback flows, or any system that needs durable orchestration and recovery from partial failure.
**Steps/contract**: (1) Decide whether the work belongs in orchestration or in an external step; keep the orchestrator deterministic and move side effects into activities/jobs/tasks. (2) Use a saga/compensation model for multi-step work that needs rollback. (3) Model one durable workflow per entity when you need consistent per-entity state and signals. (4) Prefer fan-out/fan-in for bounded parallel work and use child workflows or batch partitioning when scale grows. (5) Make external steps idempotent, time-bound, and retry-aware; add heartbeats for long-running work. (6) Use versioning or new workflow types when changing live process logic, and validate behavior with replay-safe tests.
**Strip**: Temporal-specific API names (`workflow.now`, `workflow.get_version`, `workflow.random`), worker/task-queue terminology, exact payload/argument limits, and the specific docs.temporal.io references should be generalized to the target workflow engine or orchestration runtime; the example domains (orders, inventory, CI/CD, approvals) are illustrative rather than required.
**Notes**: Strong portable SOP candidate. The highest-value reusable rules are the orchestration-vs-activity split, deterministic replay-safe control flow, compensation ordering, and idempotent retry-safe side effects. The Temporal-specific mechanics are helpful examples, but the process reads cleanly as a generic distributed-workflow playbook.
## plugins/backend-development/skills/projection-patterns/SKILL.md
**Type**: Portable SOP candidate — projection/read-model design, checkpointing, and replay-safe projector workflow
**Portable**: Yes
**Reason**: The core workflow is generic event-sourcing/CQRS practice: consume ordered events, apply them idempotently to one or more read models, checkpoint progress, support rebuilds, and choose projection shape based on query needs. The Python, asyncpg, and Elasticsearch examples are implementation illustrations rather than required mechanics.
**Trigger**: When building read models from events, materialized views, reporting tables, search indexes, or any projection that must resume, replay, or rebuild safely after failure.
**Steps/contract**: (1) Define each projection around a query need and keep it independent from other projections. (2) Read events in order from a checkpoint or stream position. (3) Apply events idempotently and in transactions when a projection touches multiple tables. (4) Persist checkpoints after successful processing so consumers can resume safely. (5) Provide a rebuild path that clears or recreates the read model and replays the source stream. (6) Monitor lag and handle failures explicitly so projections do not silently drift.
**Strip**: Python syntax, asyncpg connection and transaction calls, Elasticsearch client methods, concrete table/index names, and the exact event type examples should be generalized to the host stack; the projector class shape is a pattern, not a required API.
**Notes**: Strong portable SOP candidate. The highest-value reusable elements are the idempotent replay model, checkpoint management, projection independence, and rebuild/lag-monitoring discipline. The code samples are useful templates, but the operational contract is the part that should be promoted.
## plugins/cicd-automation/skills/deployment-pipeline-design/SKILL.md
**Type**: Portable SOP candidate — deployment pipeline design, approval gates, rollout strategies, health checks, and rollback workflow
**Portable**: Yes
**Reason**: The underlying workflow is broadly reusable across CI/CD systems: organize stages from source to verification, add quality and approval gates, choose a rollout strategy based on risk and downtime tolerance, verify with deep health checks, and automate rollback on failure. The file is implementation-heavy with GitHub/GitLab/Azure, Kubernetes, and Argo Rollouts examples, but the process itself applies to most delivery pipelines.
**Trigger**: When designing or reviewing a deployment pipeline, adding promotion gates, choosing canary vs blue-green vs rolling rollout patterns, defining post-deploy verification, or hardening rollback behavior.
**Steps/contract**: (1) Order the pipeline from build/test through staging, approval, production, verification, and rollback. (2) Run fast checks before slow ones and promote the same artifact across environments. (3) Use manual or metric-based gates appropriate to the release risk. (4) Pick the rollout strategy that matches downtime tolerance, traffic-splitting needs, and infrastructure cost. (5) Verify production with deep readiness and post-deploy health checks rather than shallow ping endpoints. (6) Automate rollback triggers and keep a manual rollback runbook for database or schema edge cases.
**Strip**: GitHub Actions, GitLab CI, Azure Pipelines, Argo Rollouts, Kubernetes manifests, Prometheus queries, and shell snippets should be generalized to the host CI/CD and deployment stack; concrete reviewer settings, environment names, and tool-specific YAML syntax are implementation details.
**Notes**: Strong portable SOP candidate. The most reusable pieces are the stage ordering, artifact promotion principle, gate selection guidance, rollout decision table, deep-health verification pattern, and rollback discipline. The platform-specific examples are useful illustrations, but they can be swapped for any delivery toolchain.
## plugins/cicd-automation/skills/secrets-management/SKILL.md
**Type**: Portable SOP candidate — secrets management for CI/CD pipelines, secret rotation, scanning, and platform integration
**Portable**: Yes
**Reason**: The core workflow is reusable across any CI/CD environment: keep secrets out of source control, store them in a dedicated secret manager or platform secret store, inject them at runtime, mask them in logs, rotate them regularly, and scan for leaks. The specific examples use Vault, AWS Secrets Manager, GitHub Secrets, GitLab CI/CD variables, and Kubernetes operators, but the underlying operating procedure is platform-agnostic.
**Trigger**: When a pipeline needs credentials, certificates, or API keys; when rotating or revoking secrets; when hardening CI/CD access controls; or when adding secret scanning and log masking to an automation workflow.
**Steps/contract**: (1) Classify the secret and choose an appropriate storage/injection mechanism. (2) Keep secrets in a managed secret store or native platform secret mechanism rather than in Git. (3) Retrieve secrets at runtime and mask or avoid echoing them in logs. (4) Use least-privilege access, separate secrets per environment, and audit access. (5) Rotate and revoke secrets on a schedule or after exposure. (6) Add secret scanning and pre-commit/CI checks to prevent leakage.
**Strip**: Provider-specific setup commands, environment names, YAML snippets, Terraform snippets, and exact tool invocations (`vault-action`, `aws secretsmanager`, GitHub/GitLab secret syntax, External Secrets Operator manifests, TruffleHog commands) should be generalized to the local CI/CD stack; the dev-server examples and reference file names are illustrative only.
**Notes**: Strong portable SOP candidate. The most reusable pieces are the operational controls: runtime injection, masking, rotation, least privilege, and scanning. The provider examples are valuable as implementations, but the process itself transfers cleanly across CI/CD platforms.
## plugins/cloud-infrastructure/skills/multi-cloud-architecture/SKILL.md
**Type**: Portable SOP candidate — multi-cloud decision framework, migration strategy, cost optimization, and cloud-agnostic architecture patterns
**Portable**: Yes
**Reason**: The core guidance is reusable across projects that need to compare providers, choose services by workload fit, and design for portability, resilience, and cost control. The decision flow, migration phases, and best-practice checklist are general architecture SOPs; only the service-mapping tables and provider-specific examples are tied to AWS/Azure/GCP/OCI.
**Trigger**: When planning a multi-cloud strategy, selecting cloud services for a workload, designing for reduced vendor lock-in, comparing portability tradeoffs, or organizing a cloud migration.
**Steps/contract**: (1) Start with the workload goals and constraints: resilience, cost, sovereignty, latency, portability, and operational maturity. (2) Choose a pattern: single-provider with DR, best-of-breed, geographic distribution, or cloud-agnostic abstraction. (3) Prefer cloud-native abstractions that transfer cleanly across providers, such as IaC, Kubernetes, PostgreSQL/MySQL, Redis, Prometheus/Grafana, and object storage APIs. (4) Execute migration in phases: assess, pilot, migrate, optimize. (5) Revisit cost, security, and DR regularly and document provider-specific deltas separately.
**Strip**: Provider comparison tables, brand-specific service names, and example mappings should be generalized to “provider A/B/C”; the exact service catalog entries and reference links are implementation examples rather than the SOP itself.
**Notes**: Good portable architecture SOP if the comparison matrices are treated as examples. The most reusable elements are the pattern selection framework, the phased migration plan, and the cloud-agnostic design heuristics.
## plugins/cicd-automation/skills/gitlab-ci-patterns/SKILL.md
**Type**: Portable SOP candidate — CI/CD pipeline design, deployment gating, caching, and security-scanning patterns
**Portable**: Yes
**Reason**: The underlying operating procedure is reusable across CI systems: define clear stages, cache dependencies, publish build artifacts, gate production deploys, add environment tracking, and include security scanning and child-pipeline orchestration where needed. The examples are GitLab-flavoured, but the workflow itself is platform-agnostic.
**Trigger**: When designing or improving a CI/CD pipeline, organizing build/test/deploy stages, adding caching or artifact handling, setting manual production gates, or standardizing security scans and deployment workflows.
**Steps/contract**: (1) Split the pipeline into ordered stages with explicit job responsibilities. (2) Cache dependencies and persist build outputs as artifacts. (3) Gate production deploys behind main-branch or manual approval checks. (4) Track deployed environments and rollout status. (5) Add security scans appropriate to the stack. (6) Use child pipelines or generated pipeline definitions when the workflow needs dynamic fan-out.
**Strip**: GitLab-specific syntax and primitives (`.gitlab-ci.yml`, `only`, `when: manual`, `trigger: include`, GitLab registry variables, built-in security templates, and runner/image examples) should be rewritten in the target CI system’s vocabulary; the concrete Docker, Terraform, and Kubernetes examples are implementation-specific rather than required.
**Notes**: Strong portable SOP candidate. The most reusable elements are stage design, artifact/cache discipline, manual release gates, and security-scanning coverage; the exact YAML keys and built-in templates are the only substantial GitLab coupling.
## plugins/cicd-automation/skills/github-actions-templates/SKILL.md
**Type**: Portable SOP candidate — GitHub Actions workflow design, security, and deployment templates
**Portable**: Yes
**Reason**: The core workflow is reusable across repos: choose the right event triggers, set permissions, cache dependencies, use reusable workflows, and separate test/build/deploy/security jobs. The examples are GitHub Actions-specific, but the underlying CI/CD patterns are general.
**Trigger**: When creating or reviewing CI/CD pipelines, adding GitHub Actions workflows, wiring matrix builds, or standardizing deployment/security automation.
**Steps/contract**: (1) Start from the desired pipeline outcome: test, build, deploy, scan, or release. (2) Use explicit event triggers and least-privilege permissions. (3) Add caching, matrices, and reusable workflows where they reduce duplication. (4) Keep secrets in GitHub secrets or environment protections. (5) Gate production deploys with environments/approvals and verification steps.
**Strip**: Repo-specific workflow filenames, concrete registry/cluster names, codecov/snyk/trivy examples, and AWS/Kubernetes commands should be generalized to the host stack; action versions and YAML snippets are illustrative implementation details.
**Notes**: Strong portable SOP candidate, especially as a workflow-design checklist. The action catalog and exact sample jobs are GitHub-specific, but the decision framework and security/approval practices transfer well.
## plugins/cloud-infrastructure/skills/mtls-configuration/SKILL.md
**Type**: Portable SOP candidate — mTLS rollout, certificate hierarchy, and service-to-service zero-trust communication
**Portable**: Yes
**Reason**: The core workflow is broadly reusable across platforms: decide when to require mTLS, define the certificate authority hierarchy, issue and rotate workload certificates, and verify/debug TLS handshakes. The examples are service-mesh flavored, but the operational pattern applies to any internal service communication stack that needs mutual authentication and encryption.
**Trigger**: When enabling zero-trust service-to-service communication; rolling out strict or permissive mTLS; managing workload or CA certificates; integrating cert-manager or SPIFFE/SPIRE; or debugging handshake/identity failures.
**Steps/contract**: (1) Choose the mTLS scope and rollout mode, starting permissive where migration risk is high and moving to strict enforcement. (2) Define the certificate chain and trust boundaries, including root, intermediate, and workload identities. (3) Configure workload issuance, rotation, and renewal windows. (4) Add destination/peer-authentication policies that enforce the chosen TLS mode. (5) Verify status and expiry regularly, then debug failures with handshake checks, policy inspection, and proxy logs.
**Strip**: Istio-, Linkerd-, cert-manager-, and SPIRE-specific resource kinds, YAML fields, and CLI commands should be generalized to the host platform’s policy and certificate APIs; port numbers, namespaces, and example hostnames are illustrative rather than required.
**Notes**: Strong portable SOP candidate for cloud/security teams. The reusable center is the migration-and-rotation workflow around certificate trust, enforcement, and verification; the concrete manifests are implementation examples that should be swapped for the adopting environment’s tooling.
## plugins/cloud-infrastructure/skills/terraform-module-library/SKILL.md
**Type**: Portable SOP candidate — reusable Terraform module patterns for cloud infrastructure
**Portable**: Yes
**Reason**: The guidance is mostly process-level rather than repo-specific: define a standard module layout, document inputs/outputs, validate variables, pin provider versions, provide usage examples, and test modules before publishing them. Those practices transfer cleanly to any Terraform codebase that needs reusable infrastructure modules, even if the provider mix or naming conventions change.
**Trigger**: When creating or reviewing Terraform modules; standardizing infrastructure-as-code patterns; building reusable cloud components; or setting module authoring conventions for a platform team.
**Steps/contract**: (1) Choose the module boundary and intended resource responsibility. (2) Use a consistent module layout with `main.tf`, `variables.tf`, `outputs.tf`, `versions.tf`, `README.md`, `examples/`, and `tests/`. (3) Validate inputs, document every variable, and expose the outputs needed for composition. (4) Pin provider versions and use locals/conditional resources where appropriate. (5) Include at least one complete example and a module test that proves the expected outputs/resources. (6) Tag resources consistently and version the module semantically.
**Strip**: The AWS/VPC example, provider-specific resource names, exact cloud-provider catalog (`AWS`, `Azure`, `GCP`, `OCI`), Terratest/Golang test snippet, and the reference-file links should be generalized to the host project’s clouds, test framework, and documentation structure.
**Notes**: Strong portable SOP candidate. The most reusable parts are the module contract template, the validation/documentation checklist, and the recommendation to make modules composable through explicit outputs and examples.
## plugins/cloud-infrastructure/skills/service-mesh-observability/SKILL.md
**Type**: Portable SOP candidate — service mesh observability workflow for metrics, traces, dashboards, and alerts
**Portable**: Yes
**Reason**: The core workflow is broadly reusable across distributed systems: define the three observability pillars, track golden signals, connect metrics/traces/logs, build dashboards, and set alert thresholds for latency, error rate, traffic, and saturation. The service-mesh examples are implementation illustrations layered on top of a generic observability playbook.
**Trigger**: When instrumenting or monitoring a service mesh, debugging latency or error spikes, setting up SLO-based alerts, or building dashboards that explain service-to-service behavior.
**Steps/contract**: (1) Establish metrics, traces, and logs as the observability baseline. (2) Watch the golden signals: latency, traffic, errors, and saturation. (3) Wire tracing and metrics collection into the mesh and exporters/collectors. (4) Create dashboards for request rate, error rate, latency, and topology. (5) Add actionable alerts with clear thresholds and ownership. (6) Validate sampling, label cardinality, and retention so observability stays useful and affordable.
**Strip**: The Istio/Linkerd/Kiali/Jaeger-specific manifests, resource names, and command examples should be generalized to the target mesh and monitoring stack; the exact PromQL queries, chart JSON, and Kubernetes object names are implementation details rather than the portable SOP itself.
**Notes**: Strong portable SOP candidate at the process level. The reusable center is the “three pillars + golden signals + dashboard/alert loop”; the vendor-specific templates are useful references but should be swapped for local equivalents during adoption.
## plugins/cloud-infrastructure/skills/cost-optimization/SKILL.md
**Type**: Portable SOP candidate — cloud cost optimization framework, monitoring, and governance
**Portable**: Yes
**Reason**: The skill is built around reusable operating practices rather than one cloud’s tooling: establish cost visibility, rightsize resources, choose the right pricing model for workload shape, monitor spend, and optimize architecture for lower ongoing cost. Those steps transfer cleanly to any cloud or infrastructure program.
**Trigger**: When reducing infrastructure spend, setting up cost governance, reviewing utilization, choosing between on-demand and commitment-based pricing, or building a recurring cost-review process.
**Steps/contract**: (1) Make costs visible with allocation tags, dashboards, budgets, and alerts. (2) Rightsize and remove idle resources based on utilization evidence. (3) Match pricing model to workload pattern: commitments for steady load, spot/preemptible for interruption-tolerant work, on-demand for elastic or critical capacity. (4) Optimize architecture with managed services, caching, storage lifecycle policies, and data-transfer minimization. (5) Review spend continuously and revisit recommendations as workload shape changes.
**Strip**: Provider-specific savings percentages, product names, and sample Terraform snippets should be generalized to the local cloud/platform equivalent; the AWS/Azure/GCP/OCI sections should become examples rather than required structure; concrete instance types and storage classes are illustrative, not portable defaults.
**Notes**: Strong portable SOP candidate at the process level. The most reusable elements are the visibility → rightsizing → pricing-model → architecture-optimization loop and the recurring review checklist; the exact tool names and discount figures are implementation detail.
## plugins/cloud-infrastructure/skills/mtls-configuration/SKILL.md
**Type**: Portable SOP candidate — mTLS rollout, certificate hierarchy, and service-to-service zero-trust communication
**Portable**: Yes
**Reason**: The core workflow is broadly reusable across platforms: decide when to require mTLS, define the certificate authority hierarchy, issue and rotate workload certificates, and verify/debug TLS handshakes. The examples are service-mesh flavored, but the operational pattern applies to any internal service communication stack that needs mutual authentication and encryption.
**Trigger**: When enabling zero-trust service-to-service communication; rolling out strict or permissive mTLS; managing workload or CA certificates; integrating cert-manager or SPIFFE/SPIRE; or debugging handshake/identity failures.
**Steps/contract**: (1) Choose the mTLS scope and rollout mode, starting permissive where migration risk is high and moving to strict enforcement. (2) Define the certificate chain and trust boundaries, including root, intermediate, and workload identities. (3) Configure workload issuance, rotation, and renewal windows. (4) Add destination/peer-authentication policies that enforce the chosen TLS mode. (5) Verify status and expiry regularly, then debug failures with handshake checks, policy inspection, and proxy logs.
**Strip**: Istio-, Linkerd-, cert-manager-, and SPIRE-specific resource kinds, YAML fields, and CLI commands should be generalized to the host platform’s policy and certificate APIs; port numbers, namespaces, and example hostnames are illustrative rather than required.
**Notes**: Strong portable SOP candidate for cloud/security teams. The reusable center is the migration-and-rotation workflow around certificate trust, enforcement, and verification; the concrete manifests are implementation examples that should be swapped for the adopting environment’s tooling.
## plugins/cloud-infrastructure/skills/hybrid-cloud-networking/SKILL.md
**Type**: Portable SOP candidate — hybrid cloud connectivity planning, routing, redundancy, monitoring, and cost trade-offs
**Portable**: Yes
**Reason**: The workflow is broadly reusable across any environment that links on-premises networks with cloud providers. The core guidance is process-level: choose the right connectivity mode for bandwidth/latency/reliability needs, design routing with BGP and propagation in mind, add redundancy and monitoring, and weigh cost versus performance. The cloud-vendor examples are illustrative rather than required.
**Trigger**: When designing or reviewing hybrid cloud networking, selecting VPN versus dedicated/private links, planning multi-region or multi-cloud connectivity, or establishing secure cross-premises routing and failover.
**Steps/contract**: (1) Identify connectivity requirements for latency, throughput, reliability, compliance, and migration stage. (2) Choose the appropriate transport: VPN for lower-cost, lower-bandwidth paths; dedicated/private connectivity for predictable performance. (3) Configure dynamic routing and route propagation with clear BGP advertisement boundaries. (4) Build redundancy with dual tunnels, active-active paths, or multiple links/regions where available. (5) Apply network security controls, private endpoints, and observability to the hybrid path. (6) Validate with connection health, route status, and cost review.
**Strip**: Cloud-provider-specific resource names, Terraform snippets, product names for each provider’s network gateway/service, and CLI troubleshooting commands should be generalized to the host platform; the vendor capacity numbers and example ASNs are reference values, not portable requirements.
**Notes**: Strong portable SOP candidate. The most reusable parts are the connectivity selection matrix, the routing/propagation discipline, the redundancy patterns, and the cost-versus-performance decision frame. Provider-specific implementation details can be moved into appendices or local examples.
## plugins/cloud-infrastructure/skills/istio-traffic-management/SKILL.md
**Type**: Domain-specific SOP — Istio traffic-shaping, resilience, and rollout configuration
**Portable**: No
**Reason**: The workflow is useful, but it is anchored to Istio CRDs, Kubernetes service-mesh topology, and `istioctl` troubleshooting. The transferable ideas are general traffic-management principles, yet the concrete contract depends on Istio’s resource model and mesh-specific routing behavior.
**Trigger**: When configuring Istio traffic policies, canary or blue-green rollouts, circuit breakers, retries/timeouts, traffic mirroring, fault injection, or ingress gateways in an Istio-enabled Kubernetes cluster.
**Steps/contract**: Define the desired traffic behavior; model versions as subsets in `DestinationRule`; route with `VirtualService`; add bounded retries, timeouts, and outlier detection; use mirroring and fault injection for controlled testing; validate with `istioctl analyze` and proxy-config commands.
**Strip**: Istio-specific resource kinds, API versions, YAML schema, and `istioctl` commands should be generalized if porting to another mesh or traffic-control system; the Bookinfo examples and exact field names are implementation details.
**Notes**: Strong reference for Istio operators, but not a portable SOP candidate without substantial re-anchoring to another service mesh or traffic orchestration platform.
## plugins/kubernetes-operations/skills/gitops-workflow/SKILL.md
**Type**: Portable SOP candidate — GitOps workflow for declarative Kubernetes deployment, reconciliation, and progressive delivery
**Portable**: Yes
**Reason**: The core workflow is reusable across Kubernetes environments and GitOps tools: keep desired state in Git, reconcile continuously from a controller, structure repos by apps/infrastructure/environment, and manage sync, rollout, and secret-handling policies explicitly. ArgoCD and Flux are implementation choices, but the operating model is generic.
**Trigger**: When implementing GitOps for Kubernetes, automating cluster/app deployments from Git, setting up multi-environment or multi-cluster delivery, defining sync policies, or introducing declarative secret management.
**Steps/contract**: (1) Store desired state in versioned Git repositories. (2) Use a controller to pull and continuously reconcile cluster state. (3) Organize manifests by app, environment, and infrastructure boundary. (4) Define automated sync, retry, prune, and health-check behavior. (5) Add progressive delivery and secret-management patterns where needed. (6) Verify drift, sync failures, and rollout status with operational checks.
**Strip**: Product-specific installation commands, ArgoCD/Flux CRD names, bootstrap flags, repository path examples, and troubleshooting CLI invocations should be generalized to the target GitOps platform and repo layout; the OpenGitOps principles and workflow phases are the portable core.
**Notes**: Strong portable SOP candidate. The most reusable elements are the declarative state/reconciliation model, repo organization heuristics, and the sync-policy / rollout / secret-management checklist. The concrete manifests are useful examples, but the SOP itself transfers cleanly to other GitOps implementations.
## plugins/cloud-infrastructure/skills/linkerd-patterns/SKILL.md
**Type**: Domain-specific infra playbook — Linkerd service mesh installation, policy, traffic-splitting, and observability
**Portable**: No
**Reason**: The workflow is useful, but most of the concrete guidance is tightly coupled to Linkerd’s CLI, CRDs, API groups, and resource names. The transferable layer is the general service-mesh operating model (install, inject, secure, route, observe, debug), while the actual steps, manifests, and commands are Linkerd-specific.
**Trigger**: When operating Linkerd in Kubernetes: installing the mesh, enabling injection, defining service profiles, configuring traffic splits, writing server/auth policies, setting up multicluster links, or debugging proxy/TLS behavior.
**Steps/contract**: (1) Validate the cluster before installing. (2) Install CRDs and control plane, then verify with `linkerd check`. (3) Enable injection at namespace or workload scope. (4) Define route-level policies for retries, timeouts, and metrics with ServiceProfiles. (5) Use TrafficSplit / HTTPRoute / Server / ServerAuthorization to shape traffic and access. (6) Monitor and debug with viz, proxy logs, identity checks, and tap.
**Strip**: `linkerd` CLI commands, Linkerd-specific API groups and kinds (`ServiceProfile`, `TrafficSplit`, `Server`, `ServerAuthorization`, `HTTPRoute`), and versioned installation steps should be generalized to the target mesh or service-routing platform if this is adapted elsewhere.
**Notes**: Strong operational reference for Linkerd users, but not a portable SOP in the broad sense. The durable abstraction is “service mesh lifecycle management,” not the Linkerd implementation details.
## plugins/kubernetes-operations/skills/k8s-manifest-generator/SKILL.md
**Type**: **Portable SOP candidate** — Kubernetes manifest generation workflow, best-practice resource assembly, security hardening, and validation checklist
**Portable**: Yes
**Reason**: The workflow is reusable anywhere Kubernetes manifests are authored: gather workload requirements, assemble the right resource set (Deployment/Service/ConfigMap/Secret/PVC/StatefulSet/Job/CronJob as needed), apply standard labels and security settings, and validate before applying. The repo-specific assets and example commands are implementation details, but the operating procedure itself is framework-agnostic within Kubernetes projects.
**Trigger**: When creating or reviewing Kubernetes YAML for an application, choosing resource types, hardening manifests, or validating a deployment bundle before apply/CI.
**Steps/contract**: (1) Gather workload requirements: workload type, image, ports, config, storage, exposure, scaling, and health checks. (2) Select the right Kubernetes objects for the use case and wire selectors, env, volumes, and probes correctly. (3) Add production defaults: resource requests/limits, non-root security context, specific image tags, standard labels, and meaningful annotations. (4) Separate sensitive and non-sensitive config into Secrets and ConfigMaps. (5) Validate with dry-run plus lint/score tools before applying. (6) Use pattern-specific templates for stateless, stateful, batch, or multi-container workloads.
**Strip**: Repository paths under `references/` and `assets/`, the exact YAML examples and placeholder names, provider-specific annotations like the AWS NLB example, and tool-specific validation commands should be generalized to the host cluster/tooling; Helm/Kustomize and GitOps references are adjacent patterns rather than required parts of the SOP.
**Notes**: Strong portable candidate. The most reusable parts are the manifest assembly checklist, the security/validation gates, and the workload-to-resource pattern mapping; the specific template files and example probes/annotations should become local conventions.
## plugins/kubernetes-operations/skills/k8s-security-policies/SKILL.md
**Type**: Portable SOP candidate — Kubernetes security policy implementation, defense-in-depth hardening, and admission/policy enforcement workflow
**Portable**: Yes
**Reason**: The core workflow is broadly reusable wherever teams need to harden clusters: decide the security posture, enforce least-privilege access, default-deny network traffic, lock down pod security context, and add admission controls plus service-mesh policy where available. The Kubernetes primitives are specific, but the operating procedure — establish baseline protections, then layer additional controls and verify them — transfers cleanly to other orchestration environments.
**Trigger**: When securing a Kubernetes cluster, defining namespace-level pod security standards, writing NetworkPolicies, tightening RBAC, adding Gatekeeper/Kyverno checks, or documenting a production security baseline.
**Steps/contract**: (1) Set namespace-level Pod Security Standards to the desired posture. (2) Apply default-deny NetworkPolicies and add explicit allow rules for required traffic such as frontend-backend and DNS. (3) Use least-privilege RBAC with narrowly scoped Roles/RoleBindings and only elevate to ClusterRole when needed. (4) Enforce secure pod settings: non-root, read-only root filesystem, dropped capabilities, seccomp, and no privilege escalation. (5) Add admission controls for required labels or other invariants. (6) Layer mesh security policies such as mTLS and authorization rules when the cluster uses a service mesh. (7) Validate with kubectl auth checks and policy troubleshooting.
**Strip**: The specific Kubernetes API versions, example namespaces, sample labels, and tool names like OPA Gatekeeper or Istio should become optional implementation examples; deprecated PodSecurityPolicy wording should be updated to current Pod Security Admission terminology where applicable; the concrete YAML manifests are reference snippets, not the SOP itself.
**Notes**: Strong portable SOP candidate for cloud-native security baselines. The most reusable elements are the defense-in-depth sequence, the least-privilege RBAC rule, the default-deny network posture, and the secure pod-context checklist; the Kubernetes-specific syntax is the main thing to localize.
## plugins/kubernetes-operations/skills/helm-chart-scaffolding/SKILL.md
**Type**: Portable SOP candidate — Helm chart scaffolding, templating, validation, packaging, and multi-environment release workflow
**Portable**: Yes
**Reason**: The core procedure is broadly reusable anywhere Helm is used: initialize chart structure, organize `Chart.yaml` and `values.yaml`, build templated Kubernetes manifests with helpers, manage dependencies, validate with lint/template/install checks, package the chart, and maintain environment-specific values. The specifics are Helm/Kubernetes domain details, but the workflow itself is a generic scaffold-and-verify SOP for configuration-driven application packaging.
**Trigger**: When starting a new Helm chart, adding reusable Kubernetes packaging conventions, setting up environment overlays, validating templates, or preparing a chart for distribution.
**Steps/contract**: (1) Create the chart skeleton and standard file layout. (2) Define chart metadata, dependencies, and hierarchical values. (3) Extract repeated template logic into helpers and render resources conditionally. (4) Validate with lint, template, dry-run install, and test hooks. (5) Package, publish, and consume the chart via a repository. (6) Maintain separate values files for each deployment environment.
**Strip**: Repo-specific example names (`my-app`, example domains, Bitnami dependency versions, and sample passwords) should be replaced with local chart names and trusted dependency sources; the exact directory tree is illustrative and can be mapped to any Helm project layout; shell command examples should remain as generic Helm CLI usage rather than copy-pasted verbatim if the target environment uses wrappers.
**Notes**: Strong portable SOP candidate for teams that use Helm routinely. The most transferable pieces are the chart organization pattern, helper-template convention, validation sequence, and environment-overlay approach; the content can be condensed into a reusable “Helm chart scaffold” playbook without losing much value.
## plugins/data-engineering/skills/airflow-dag-patterns/SKILL.md
**Type**: Portable SOP candidate — workflow-orchestration DAG design, dependency shaping, sensor handling, failure callbacks, and DAG testing
**Portable**: Yes
**Reason**: The core operating guidance is reusable across workflow orchestrators: design jobs to be idempotent, atomic, incremental, and observable; express dependencies clearly; isolate long waits with reschedule-style sensors; centralize failure handling; and validate DAG structure and task logic with tests. Although the examples are Airflow-specific, the decision rules and quality gates transfer cleanly to other scheduler or pipeline frameworks.
**Trigger**: When designing or refactoring scheduled pipelines, choosing task dependency shapes, introducing sensors or external waits, adding retries/alerts, writing DAG tests, or standardizing production workflow patterns.
**Steps/contract**: (1) Design each workflow to be idempotent, atomic, incremental, and observable. (2) Choose the right dependency shape for linear, fan-out, fan-in, branching, and join patterns. (3) Keep heavy logic out of the DAG definition and isolate it in importable modules. (4) Use sensors or wait steps that free worker capacity while blocking on external readiness. (5) Route failures through explicit callbacks/alerts and use trigger rules to separate cleanup from success-only actions. (6) Test DAG load, structure, cycles, and task behavior before promoting changes.
**Strip**: Airflow class names, decorators, and operator/sensor APIs (`DAG`, `PythonOperator`, `BranchPythonOperator`, `ExternalTaskSensor`, `@dag`, `@task`, `PokeReturnValue`, `TriggerRule`) should become the adopting orchestrator’s equivalents; cron expressions, macros like `{{ ds }}`, and import paths such as `airflow.providers.*` are implementation details; the example project layout and test code should be generalized to the local repo’s structure and test harness.
**Notes**: Strong portable SOP candidate, especially for teams that move between Airflow, Dagster, Prefect, Argo, or custom schedulers. The highest-value reusable pieces are the workflow design principles, the branch/join and sensor patterns, and the DAG test/validation checklist; the code snippets are useful illustrations but not essential to the SOP.
## plugins/data-engineering/skills/data-quality-frameworks/SKILL.md
**Type**: Portable SOP candidate — data quality validation workflow, test layering, monitoring, and contract-driven checks
**Portable**: Yes
**Reason**: The core guidance is broadly reusable across data stacks: define quality dimensions, layer checks from schema to single-column to cross-table validations, automate execution in CI/CD or scheduled pipelines, and use contracts plus alerting to keep producers and consumers aligned. The workflow is process-level rather than repo-specific, so it transfers cleanly even when the implementation toolset changes.
**Trigger**: When designing or improving data quality checks, adding freshness/completeness/uniqueness rules, setting up validation in pipelines or CI, or establishing data contracts between upstream and downstream teams.
**Steps/contract**: (1) Classify the quality dimensions that matter for the dataset. (2) Apply checks in layers: schema, column-level, table-level, and cross-table/integration. (3) Encode expectations in the local validation system or contract format. (4) Automate runs on a schedule and in CI/CD. (5) Fail or alert on violations, then report the impacted tables and checks. (6) Version and evolve expectations as the schema or business rules change.
**Strip**: Great Expectations, dbt, SodaCL, and datacontract-specific APIs/files should be treated as examples; the Python/YAML/SQL snippets, package install commands, and checkpoint config shapes are implementation details that should be translated to the host stack’s validation tooling.
**Notes**: Strong portable SOP candidate. The most reusable parts are the testing pyramid, the explicit quality dimensions, and the “contracts + automation + alerting” loop. The tool-specific examples are useful patterns, but the underlying operating procedure is generic enough to standardize across data teams.
## plugins/database-design/skills/postgresql/SKILL.md
**Type**: Portable SOP candidate — PostgreSQL schema design, type selection, constraints, indexing, partitioning, and schema-evolution workflow
**Portable**: Yes
**Reason**: The file is a process-oriented PostgreSQL design playbook rather than repo wiring. Its core guidance — define keys and constraints deliberately, normalize first, choose data types from semantics, index real access paths, and plan for write patterns and migrations — transfers cleanly to any project using PostgreSQL, even though the examples are engine-specific.
**Trigger**: When designing or reviewing a PostgreSQL schema, choosing column types, deciding on constraints or indexes, tuning read/write patterns, evaluating partitioning, or planning safe schema changes.
**Steps/contract**: (1) Start from the data model: identify entities, primary keys, foreign keys, uniqueness rules, and nullability. (2) Normalize first, then denormalize only for measured read wins. (3) Choose types by meaning: timestamptz for time, numeric for money, text for strings, bigint/identity for surrogate IDs, jsonb only for flexible attributes. (4) Add indexes only for real access paths, including FK columns, filters, sorts, and joins. (5) Apply PostgreSQL-specific constraints and features where they fit: partial/composite/covering indexes, check constraints, row-level security, partitioning, and generated columns. (6) Treat schema evolution as a first-class workflow: test DDL transactionally, avoid table rewrites where possible, and validate the resulting query plans and write behavior.
**Strip**: PostgreSQL syntax details that vary by version (`NULLS NOT DISTINCT`, `uuidv7()`, `timestamptz` precision notes, PG18 virtual columns), extension names, and example DDL should be generalized to the target project’s migration style; the exact type preference list can be adapted if the host schema conventions differ.
**Notes**: Strong portable SOP candidate for any PostgreSQL-backed codebase. The highest-value reusable rules are “index your FK columns,” “normalize before denormalizing,” “prefer semantic types over convenience types,” and “design migrations around write safety and plan validation.”
## plugins/data-engineering/skills/dbt-transformation-patterns/SKILL.md
**Type**: Portable SOP candidate — dbt transformation modeling, testing, docs, and incremental strategy
**Portable**: Yes
**Reason**: The workflow is mostly tool-agnostic process guidance for analytics engineering: organize raw/source, staging, intermediate, and marts layers; enforce naming and source contracts; test and document models; use macros to remove repetition; and choose incremental strategies based on data volume and change patterns. The examples are dbt-flavored, but the operating principles transfer to any SQL transformation framework.
**Trigger**: When building or reviewing analytics transformation layers, designing source-to-mart model flows, standardizing model/test/docs conventions, or deciding how to implement incremental loads and freshness checks.
**Steps/contract**: (1) Separate raw/source definitions from staged cleanup, intermediate business logic, and mart outputs. (2) Name models consistently by layer and purpose. (3) Add source freshness, uniqueness, not-null, and relationship tests at the right layer. (4) Document models and columns alongside code. (5) Encapsulate repeated transformations in macros or helpers. (6) Choose incremental materialization and filtering logic that match the warehouse and data-change pattern. (7) Verify with run/build/test/docs commands before release.
**Strip**: dbt-specific command syntax, config keys, YAML schema examples, and package names such as `dbt_utils` should be generalized to the target transformation tool; the exact medallion layer names and sample model filenames are conventions, not requirements.
**Notes**: Strong portable SOP candidate. The most reusable pieces are the layer separation rule, aggressive testing/documentation discipline, and the incremental-strategy decision process. The long code examples are illustrative and can be reduced to brief templates in a portable SOP.
## plugins/data-engineering/skills/spark-optimization/SKILL.md
**Type**: Domain-specific SOP — Apache Spark job optimization, partitioning, shuffle reduction, memory tuning, and monitoring
**Portable**: No
**Reason**: The useful ideas are real, but the operating contract is anchored to Spark’s execution model, Spark SQL/DataFrame APIs, AQE flags, executor memory settings, shuffle semantics, and Spark UI diagnostics. The general performance-tuning mindset transfers, yet the concrete steps are still Spark-native rather than a framework-neutral SOP.
**Trigger**: When Spark jobs are slow, skewed, spill-heavy, shuffle-bound, over-partitioned, under-partitioned, or need tuning for joins, caching, file formats, or memory pressure.
**Steps/contract**: (1) Inspect the Spark physical plan and runtime metrics before changing code or configs. (2) Reduce shuffle volume by filtering early, pre-aggregating, broadcasting small tables, and preferring coalesce when shrinking partitions. (3) Right-size partitions and executor memory for the workload. (4) Use cache/persist only for reused datasets and unpersist when done. (5) Prefer columnar formats and predicate pushdown for I/O efficiency. (6) Validate the result in Spark UI and compare before/after latency, spill, and skew.
**Strip**: SparkSession builder configs, Spark SQL property names, PySpark code, Spark-specific join/cache/partition APIs, Spark UI terminology, and file-format knobs like Parquet/Delta options should be generalized to the target distributed compute engine if ported elsewhere.
**Notes**: Strong reference for Spark operators, but not a portable SOP candidate without re-anchoring to another distributed data engine. The portable center is the optimization loop itself — profile, isolate the bottleneck, apply the smallest effective change, and verify — while the execution details remain Spark-specific.
## plugins/security-scanning/skills/stride-analysis-patterns/SKILL.md
**Type**: Security-analysis SOP — STRIDE threat modeling and per-interaction threat enumeration
**Portable**: Yes
**Reason**: The skill encodes a general threat-modeling method, not repo-specific tooling. STRIDE categories, trust-boundary analysis, threat matrices, and mitigation brainstorming transfer cleanly to any system architecture or security review process.
**Trigger**: When starting a threat-modeling session, reviewing architecture/design decisions for security, documenting threats for compliance, or teaching teams how to enumerate threats systematically.
**Steps/contract**: (1) Identify assets, components, data flows, and trust boundaries. (2) Apply STRIDE to each element/interaction. (3) Record threats with impact/likelihood and prioritize by risk. (4) Pair each threat with concrete mitigations and follow-up actions. (5) Revisit the model as the system changes.
**Strip**: The example Python classes, risk-score thresholds, and sample threat lists are illustrative; keep the method, but adapt taxonomy labels, scoring scales, and document templates to local security practice.
**Notes**: Strong portable SOP candidate. The most reusable pieces are the systematic checklist, trust-boundary emphasis, and the per-interaction enumeration pattern.
## plugins/security-scanning/skills/threat-mitigation-mapping/SKILL.md
**Type**: Portable SOP candidate — threat-to-control mapping, layered mitigation analysis, and control-effectiveness review
**Portable**: Yes
**Reason**: The core workflow is broadly reusable across security programs: classify threats, map them to preventive/detective/corrective controls, check defense in depth, identify gaps, and prioritize remediation by risk and cost. The file is largely process guidance plus illustrative data models, so the underlying SOP transfers cleanly even when the exact code templates do not.
**Trigger**: When prioritizing security work, building a remediation roadmap, reviewing control coverage, assessing residual risk, or validating whether a threat has enough layered mitigations.
**Steps/contract**: (1) Define the threat set and assign impact/likelihood/risk. (2) Map each threat to one or more controls across different layers and control types. (3) Check for coverage gaps, missing layers, and lack of diversity. (4) Rank fixes by risk reduction, cost, and implementation status. (5) Revisit the map regularly and validate control effectiveness with testing or operational evidence.
**Strip**: The Python dataclasses, enum names, specific control IDs, compliance reference examples, and report formatting should be generalized to the host project’s security taxonomy and tracking system; the exact control library and scoring formulas are illustrative, not required.
**Notes**: Strong portable candidate. The most reusable elements are the “threat → controls → gaps → roadmap” loop and the defense-in-depth checks. The code templates are useful examples, but the SOP itself is tool-agnostic and can be expressed as a policy, checklist, or review workflow.
## plugins/security-scanning/skills/security-requirement-extraction/SKILL.md
**Type**: Portable SOP candidate — threat-to-requirement translation, traceability, and compliance mapping workflow
**Portable**: Yes
**Reason**: The core process is broadly reusable across security and product teams: turn threat analysis into concrete, testable requirements, attach rationale and acceptance criteria, map each requirement back to threats and compliance controls, and produce user stories or test cases from the result. That workflow is tool-agnostic and can be applied in any repo that needs to convert risk analysis into implementable security work.
**Trigger**: When converting threat models into requirements, drafting security user stories, defining acceptance criteria, generating security test cases, or mapping controls to compliance frameworks.
**Steps/contract**: (1) Classify each security need into functional, non-functional, or constraint-based requirements. (2) Attach traceability fields for threat references, compliance references, priority, and risk. (3) Translate each threat into specific, testable requirements rather than generic security statements. (4) Generate acceptance criteria and verification cases for every requirement. (5) Group requirements by security domain and produce a traceability matrix or compliance map. (6) Review gaps where a threat or control has weak or missing coverage.
**Strip**: The Python dataclass/enumeration templates, the STRIDE-to-domain mapping table, and the specific PCI/HIPAA/GDPR/OWASP control lists are implementation examples; adapt the underlying structure to the host team’s requirement format and compliance framework set. The exact class names and helper method names should not be treated as required API.
**Notes**: Strong portable SOP candidate for security planning and governance. The most reusable pieces are the transformation loop from threat → requirement → acceptance criteria → test case, plus the explicit traceability and gap-analysis discipline. The code samples are useful references, but the durable SOP is the requirement-extraction process itself.
## plugins/security-scanning/skills/attack-tree-construction/SKILL.md
**Type**: Portable SOP candidate — attack-tree modeling, path analysis, and mitigation prioritization workflow
**Portable**: Yes
**Reason**: The core workflow is broadly reusable across security reviews: define an attacker goal, decompose it into OR/AND sub-goals, annotate leaves with effort/detection attributes, enumerate paths, and use the tree to prioritize mitigations. The underlying process is domain-agnostic and applies to architecture reviews, threat modeling, and pen-test planning even when the implementation language or export format changes.
**Trigger**: When threat-modeling a system, mapping likely attack paths, comparing mitigation coverage, prioritizing defensive investments, or presenting security risk to stakeholders.
**Steps/contract**: (1) Start from a clear attacker objective. (2) Decompose the objective into OR sub-goals and AND prerequisites. (3) Add leaf attacks with effort, cost, time, skill, and detection attributes plus mitigations. (4) Enumerate and compare paths to identify the easiest, cheapest, and stealthiest routes. (5) Summarize coverage gaps and rank mitigations by path impact. (6) Update the tree as the threat landscape or defenses change.
**Strip**: The Python dataclass/enumeration implementation, builder API, Mermaid/PlantUML exporters, and account-takeover example should be treated as examples rather than required structure; export formats, attribute scales, and node-shape conventions should be adapted to the host project’s tooling and security taxonomy.
**Notes**: Strong portable SOP candidate for security planning. The most transferable parts are the goal → decomposition → attribute → path-analysis loop and the mitigation-prioritization mindset; the code templates are useful references but not part of the portable process itself.
## plugins/observability-monitoring/skills/grafana-dashboards/SKILL.md
**Type**: Portable
**Reason**: Captures reusable Grafana dashboard design and provisioning practices (metric hierarchy, RED/USE, panel patterns, templating, alerting, and dashboard-as-code). The guidance applies broadly beyond the source repo and does not depend on repo-specific workflows.
**Trigger**: Use when creating or reviewing Grafana dashboards, dashboard-as-code, or observability views.
**Steps/contract**: Define the dashboard goal and data source; organize panels by hierarchy (critical metrics, trends, details); apply RED/USE where relevant; add variables, thresholds, and descriptions; provision or export dashboards as code; validate behavior across time ranges.
**Strip**: Remove repository asset references (`assets/*.json`) and any environment-specific paths, folder names, or org IDs.
**Notes**: The examples include some older Grafana schema fields (`graph`, legacy alerting). Keep the SOP at the pattern level and avoid encoding deprecated implementation details.
## plugins/observability-monitoring/skills/distributed-tracing/SKILL.md
**Type**: Portable SOP candidate — distributed tracing setup, instrumentation, context propagation, sampling, and trace analysis workflow
**Portable**: Yes
**Reason**: The workflow is broadly reusable across stacks: define traces/spans/context, instrument services, propagate trace headers across boundaries, tune sampling, and analyze traces for latency or errors. The file uses Jaeger, Tempo, OpenTelemetry, and language examples, but the operating procedure itself is implementation-agnostic and applies to any distributed system observability stack.
**Trigger**: When debugging latency or error propagation across services, instrumenting a microservice architecture, setting up tracing backends, tuning sampling, or teaching teams how to use traces for incident analysis.
**Steps/contract**: (1) Model requests as traces made of spans and propagate context across every service hop. (2) Instrument entry points and downstream calls with a tracing SDK or auto-instrumentation. (3) Export spans to a tracing backend and choose sampling that balances signal and cost. (4) Add useful attributes, span events, and correlated trace IDs in logs. (5) Use trace search and service graphs to locate slow requests, failures, and dependency paths. (6) Verify the setup with troubleshooting checks for missing traces, sampling gaps, and exporter/connectivity issues.
**Strip**: Jaeger/Tempo deployment manifests, OpenTelemetry package names, language-specific imports, and concrete CLI/query examples should be generalized to the host observability stack; the exact header names, exporter endpoints, and sample code blocks are implementation details rather than the SOP itself.
**Notes**: Strong portable SOP candidate. The most reusable parts are the end-to-end tracing lifecycle, the context propagation rule, the sampling/overhead tradeoff, and the “trace first” troubleshooting workflow. The backend and language snippets are useful examples, but they can be swapped for any tracing platform.
## plugins/observability-monitoring/skills/slo-implementation/SKILL.md
**Type**: Portable SOP candidate — SLI/SLO definition, error budget policy, recording rules, alerting, and review workflow
**Portable**: Yes
**Reason**: The core process is broadly reusable across reliability and operations teams: define user-facing SLIs, set measurable SLO targets, calculate and track error budgets, convert SLO health into alerts and dashboards, and review the results on a fixed cadence. The file is mostly process guidance with Prometheus/Grafana examples, so the workflow transfers even when the monitoring stack changes.
**Trigger**: When establishing reliability targets, measuring service health, creating burn-rate alerts, setting error-budget policy, or standardizing SLO reviews.
**Steps/contract**: (1) Choose user-relevant SLIs such as availability, latency, or durability. (2) Set an explicit SLO target and window, then derive the error budget from it. (3) Record ratios and compliance signals in monitoring rules. (4) Add multi-window burn-rate alerts plus exhausted-budget alerts. (5) Build a dashboard for compliance, remaining budget, and trend analysis. (6) Review SLOs regularly and adjust targets or policy as service needs evolve.
**Strip**: Prometheus recording-rule syntax, PromQL examples, Grafana dashboard layouts, alert names, and specific threshold numbers should be generalized to the host observability stack and reliability policy; the exact metric names and window lengths are implementation choices, not required portable mechanics.
**Notes**: Strong portable SOP candidate. The most reusable pieces are the SLI→SLO→error-budget chain, the multi-window burn-rate alert pattern, and the recurring review loop. The specific Prometheus/Grafana snippets are useful examples, but the operational policy is what should be preserved.
## plugins/security-scanning/skills/sast-configuration/SKILL.md
**Type**: Portable SOP candidate — SAST setup, configuration, and CI integration workflow
**Portable**: Yes
**Reason**: The core workflow is broadly reusable across repos: identify the primary languages and compliance needs, pick an appropriate SAST tool, run a baseline scan, tune rules and false positives, and wire the checks into CI/CD or pre-commit flows. The examples use Semgrep, SonarQube, and CodeQL as implementations of a generic security-scanning process rather than repo-specific mechanics.
**Trigger**: When setting up static security scanning for a codebase; choosing or comparing SAST tools; adding custom security rules; reducing false positives; or integrating security gates into CI/CD and pre-commit workflows.
**Steps/contract**: (1) Assess the codebase languages, compliance requirements, and scan goals. (2) Select one or more SAST tools that cover the language mix and desired integration points. (3) Run an initial baseline scan and prioritize critical findings. (4) Tune rules, suppressions, and exclusions to reduce noise while preserving coverage. (5) Integrate scans into CI/CD and optionally pre-commit hooks with clear pass/fail gates. (6) Revisit configuration as the codebase, tooling, and risk profile evolve.
**Strip**: Vendor- and tool-specific commands, config files, and product names (`semgrep`, `sonarqube`, `codeql`, GitHub Actions examples, Docker invocation, exact rule-pack names, and sample file paths) should be generalized to the host security-scanning stack; the compliance examples (PCI-DSS, SOC 2) are illustrative and can become local policy references.
**Notes**: Strong portable SOP candidate. The most reusable parts are the baseline-first rollout, the false-positive management loop, and the CI gate pattern. The file reads like a general security-scanning operating procedure with implementation examples attached.
## plugins/observability-monitoring/skills/prometheus-configuration/SKILL.md
**Type**: Portable SOP candidate — Prometheus setup, scrape configuration, recording rules, alerting, and validation workflow
**Portable**: Yes
**Reason**: The core workflow is broadly reusable across infrastructure and application monitoring setups: install Prometheus, define scrape targets, separate recording rules from alert rules, validate configs with promtool, and keep the server monitoring itself. The file is mostly process guidance with example YAML, so the operating procedure transfers cleanly even when the surrounding stack changes.
**Trigger**: When setting up metrics collection, configuring scrape targets or service discovery, authoring recording/alert rules, validating Prometheus configs, or standardizing monitoring practices for a service or platform.
**Steps/contract**: (1) Install Prometheus with a deployment method that fits the environment. (2) Define global scrape/evaluation intervals and external labels. (3) Configure scrape jobs for static targets, file-based discovery, Kubernetes discovery, and application endpoints as needed. (4) Use recording rules for expensive or frequently queried metrics. (5) Write alert rules with clear severities, thresholds, and annotations. (6) Validate configs and rules with promtool before rollout. (7) Monitor Prometheus itself and tune retention, HA, and long-term storage according to scale.
**Strip**: Helm chart names, Docker Compose snippets, concrete hostnames, example file paths, and the specific metric names/thresholds should be generalized to the adopting environment; references to `promtool`, `AlertManager`, `Grafana`, and `Thanos/Cortex` are useful examples but may be replaced by local equivalents.
**Notes**: Strong portable SOP candidate. The most transferable pieces are the scrape/recording/alert split, the validation gate, and the “monitor the monitoring system” practice. The Kubernetes and TLS examples are helpful patterns, but the SOP remains valid even if the deployment target or storage backend changes.
## plugins/framework-migration/skills/dependency-upgrade/SKILL.md
**Type**: Portable SOP candidate — dependency upgrade workflow, compatibility analysis, staged rollout, and validation
**Portable**: Yes
**Reason**: The core workflow is broadly reusable across stacks: audit current dependencies, read changelogs and migration guides, plan an incremental upgrade path, test after each step, validate peer compatibility, and keep a rollback plan ready. The package-manager commands and React examples are useful illustrations, but the underlying process applies to any major dependency or framework migration.
**Trigger**: When upgrading major dependencies or frameworks, resolving version conflicts, planning security-driven updates, validating compatibility matrices, or automating dependency refreshes in a safe order.
**Steps/contract**: (1) Inventory current versions and identify direct and transitive dependencies. (2) Review breaking changes, migration notes, and peer requirements before changing versions. (3) Upgrade in small steps rather than all at once, testing build and runtime behavior after each step. (4) Validate the dependency tree for duplicates, peer warnings, and incompatibilities. (5) Use codemods or migration scripts for mechanical API changes, then re-run unit, integration, E2E, and visual checks as relevant. (6) Keep a rollback or recovery path in case the upgrade destabilizes the project.
**Strip**: The npm/yarn-specific command examples, the React compatibility matrix, React-only changelog references, and the concrete codemod URLs should be generalized to the host package manager and framework; the exact lockfile, workspace, and automation syntax is implementation detail.
**Notes**: Strong portable SOP candidate. The most reusable elements are the staged-upgrade discipline, the “test after each step” gate, the compatibility/peer-dependency checks, and the rollback mindset. The automation sections are helpful patterns, but they should be adapted to the local ecosystem rather than copied verbatim.
## plugins/framework-migration/skills/database-migration/SKILL.md
**Type**: Portable SOP candidate — database migration workflow, zero-downtime schema changes, data backfills, and rollback discipline
**Portable**: Yes
**Reason**: The core workflow is technology-agnostic: assess schema and data impact, choose a safe migration shape, prefer backward-compatible expand/contract changes, backfill in controlled steps, verify the result, and keep a rollback path. The ORM examples are implementation details, but the operating procedure applies across databases and frameworks.
**Trigger**: When changing schemas, renaming or dropping columns, transforming data, migrating between databases or ORMs, upgrading database versions, or planning zero-downtime releases.
**Steps/contract**: (1) Start with a backward-compatible change when possible. (2) Split destructive changes into add/backfill/switch/remove phases. (3) Use transactions where the database and migration runner support them, but assume large migrations may need out-of-transaction rollout steps. (4) Verify each step with checks that confirm data shape and completeness. (5) Keep explicit rollback or recovery steps for every migration.
**Strip**: ORM-specific APIs and migration command syntax; language-specific code blocks; concrete Sequelize/TypeORM/Prisma examples; dialect branches such as PostgreSQL vs MySQL JSON types; exact table and column names; and any backup-table recipe that depends on a particular query runner or schema engine.
**Notes**: Strong portable SOP candidate. The most reusable parts are the expand/contract pattern, the backfill-and-verify loop, and the insistence on rollback planning before destructive changes. The cross-database section is useful as a reminder to adapt to dialect capabilities, but it should be recast as a generic compatibility check rather than tied to Sequelize.
## plugins/framework-migration/skills/angular-migration/SKILL.md
**Type**: Portable SOP candidate — incremental framework migration playbook, hybrid runtime bridging, and component/service/routing/form conversion workflow
**Portable**: Yes
**Reason**: The core operating model is reusable beyond Angular: assess migration strategies, prefer incremental delivery for larger systems, use a bridge layer to run old and new frameworks side by side, migrate capabilities feature-by-feature, and finish with cleanup once parity is reached. The concrete AngularJS/Angular syntax is implementation detail; the sequence of coexistence, conversion, and decommissioning is a general migration SOP.
**Trigger**: When modernizing a legacy frontend/framework, planning an incremental rewrite, running old and new runtimes in parallel, converting controllers/directives/services/routes/forms, or defining a phased migration timeline.
**Steps/contract**: (1) Choose a migration strategy based on app size and delivery constraints: big-bang, incremental, or vertical-slice. (2) If using incremental migration, establish a bridge/hybrid runtime so old and new code can coexist. (3) Migrate shared infrastructure first: dependency injection, services, routing, and form handling. (4) Convert UI units from legacy controllers/directives to the target framework’s components. (5) Move feature by feature, verifying each slice before proceeding. (6) Remove the legacy runtime, interop glue, and compatibility shims after parity is achieved.
**Strip**: Angular-specific names and APIs (`ngUpgrade`, `UpgradeModule`, `downgradeInjectable`, AngularJS `$scope`, `ngModel`, `$routeProvider`, Angular `RouterModule`, `FormBuilder`, `HttpClient`, `@Component`, `@NgModule`) should be generalized to the source/target frameworks and their bridge mechanism; the code samples should become framework-agnostic pseudocode or local examples.
**Notes**: Strong portable SOP candidate for any major UI framework migration. The most reusable parts are the phased-strategy decision, the bridge-layer pattern, the ordering of shared infrastructure before feature conversion, and the final cleanup step that retires the legacy stack.
## plugins/python-development/skills/python-type-safety/SKILL.md
**Type**: Portable SOP candidate — Python type annotations, generics, protocols, and strict type-checking workflow
**Portable**: Yes
**Reason**: The core guidance is broadly reusable across Python codebases: annotate public APIs, prefer modern union syntax where available, narrow types with guards, model reusable abstractions with generics and protocols, and enforce correctness with `mypy` or `pyright`. The specific examples are Pythonic, but the process of making implicit contracts explicit through types transfers cleanly to any maintainable Python project.
**Strip**: Tool-specific configuration snippets (`mypy --strict`, `pyright`), version-gated syntax notes, and library-specific examples like `pydantic.BaseModel` or `Result` implementations should be adapted to the target project’s type checker, Python version, and domain models; exact `pyproject.toml` settings are implementation details.
**Notes**: Strong portable SOP candidate. The most reusable pieces are the “annotate all public signatures” rule, the narrowing patterns for `None` and unions, and the protocol/generic patterns for preserving type information across layers.
## plugins/python-development/skills/python-observability/SKILL.md
**Type**: Portable SOP candidate — structured logging, metrics, correlation IDs, and tracing workflow for Python services
**Portable**: Yes
**Reason**: The observability strategy is broadly reusable in any production Python service: emit structured logs, propagate correlation IDs, track the four golden signals, keep metric labels bounded, and add tracing where end-to-end visibility matters. The concrete libraries are optional; the underlying operational practices are standard across Python backends and distributed systems.
**Strip**: Library-specific setup for `structlog`, `prometheus_client`, `opentelemetry`, and framework-specific middleware examples should be generalized to the host stack; exact metric names, header names, and processor/exporter configuration belong in project-specific implementation docs.
**Notes**: Strong portable SOP candidate. The highest-value transferable elements are the consistent log-field contract, the bounded-cardinality rule for metrics, and the request-context propagation pattern that ties logs, metrics, and traces together.
## plugins/python-development/skills/python-design-patterns/SKILL.md
**Type**: Portable SOP candidate — Python design principles for simplicity, separation of concerns, composition, and dependency injection
**Portable**: Yes
**Reason**: The guidance is broadly reusable across Python projects and even across languages: keep designs simple, separate HTTP/business/data concerns, prefer composition over inheritance, delay abstraction until there are repeated patterns, and inject dependencies for testability. The examples are Python-flavored, but the decision rules and refactoring heuristics are general engineering practices.
**Strip**: Python-specific syntax examples, framework-specific handler/repository names, and the exact class/function snippets should be generalized to the host stack; the sample `Request`/`Response`/ORM types are illustrative, not required.
**Notes**: Strong portable SOP candidate. The highest-value reusable pieces are the KISS/SRP/SoC checks, the rule-of-three heuristic, and the “don’t mix I/O with business logic” guidance.
## plugins/python-development/skills/python-performance-optimization/SKILL.md
**Type**: Portable SOP candidate — Python performance profiling and optimization workflow
**Portable**: Yes
**Reason**: The core workflow is reusable anywhere Python performance matters: profile before optimizing, identify hot paths, choose the right data structures, reduce I/O and allocation overhead, and validate improvements with before/after measurements. Tool names and code samples are Python-specific, but the optimization loop and anti-patterns transfer cleanly to other codebases.
**Strip**: Python profiler commands, example timing snippets, and library-specific references (`cProfile`, `line_profiler`, `memory_profiler`, `py-spy`, `timeit`) should be treated as illustrative tool choices rather than required mechanics; the specific code examples should be reduced to generic performance patterns.
**Notes**: Strong portable SOP candidate. The most reusable elements are the “measure first” rule, the hot-path focus, the data-structure selection guidance, and the memory/CPU/I/O profiling split.
## plugins/python-development/skills/python-testing-patterns/SKILL.md
**Type**: Portable SOP candidate — Python testing strategy, fixtures, mocking, parameterization, and TDD
**Portable**: Yes
**Reason**: The workflow is broadly reusable across Python codebases: keep tests isolated, use AAA structure, choose fixtures and parametrization deliberately, mock external dependencies, and assert exception and edge-case behavior. The guidance depends on pytest and unittest.mock as examples, not on repo-specific paths or business logic.
**Strip**: Pytest syntax details, unittest.mock examples, and the calculator/database/API sample code should be treated as illustrations; coverage thresholds, fixture layout, and test file naming should adapt to the host project’s conventions.
**Notes**: Strong portable candidate. The most reusable pieces are the one-behavior-per-test rule, fixture scoping guidance, and the explicit advice to verify exception paths and test isolation.

## plugins/python-development/skills/python-error-handling/SKILL.md
**Type**: Portable SOP candidate — Python validation, exception design, and partial-failure handling
**Portable**: Yes
**Reason**: The core workflow is broadly reusable in Python applications: validate inputs early, raise specific exceptions with context, preserve exception chains, handle batch failures per item, and keep recovery logic close to the failure boundary. The concrete Pydantic and HTTP examples illustrate the pattern without tying it to repo-specific code.
**Strip**: Pydantic model syntax, custom exception class examples, and the upload/batch-processing snippets should be adapted to the host project’s domain types and error taxonomy; logging and status-reporting calls are implementation details.
**Notes**: Strong portable candidate. The most reusable parts are the fail-fast validation rule, the “use specific exceptions with context” guidance, and the partial-failure pattern for batch work.
## plugins/framework-migration/skills/react-modernization/SKILL.md
**Type**: Portable SOP candidate — React upgrade and modernization workflow
**Portable**: Yes
**Reason**: The workflow is broadly reusable for any React codebase: plan incremental version upgrades, migrate class components to hooks, adopt concurrent features when they fit the app, and validate each step with codemods plus testing. The guidance is process-oriented rather than tied to a repo-specific structure, so it transfers cleanly as a modernization SOP for React teams.
**Trigger**: When upgrading React versions, moving from class components to hooks, adopting React 18 features, running codemods, or planning a modernization pass across a React application.
**Steps/contract**: (1) Upgrade incrementally and review release-note breaking changes before changing multiple major versions. (2) Migrate leaf class components first, then move shared patterns to hooks and custom hooks. (3) Update root/render APIs and other React 18 entry points as part of the version bump. (4) Apply codemods with dry-run/preview mode before writing changes. (5) Re-verify behavior, warnings, and performance after each slice.
**Strip**: Version-specific examples (16→17→18), command-line codemod invocations, and code samples for state/lifecycle/context conversion should be treated as illustrative patterns; keep the upgrade sequencing and validation checklist while swapping in the host project’s tooling and component names.
**Notes**: Strong portable SOP candidate within the React ecosystem. The most reusable pieces are the incremental upgrade path, the leaf-first migration order, and the explicit use of codemods plus verification gates to reduce modernization risk.
## plugins/python-development/skills/async-python-patterns/SKILL.md
**Type**: Portable SOP candidate — async/await, concurrency, event-loop, and non-blocking I/O patterns
**Portable**: Yes
**Reason**: The core guidance is framework-agnostic: decide sync vs async based on workload, keep call paths consistently sync or async, structure concurrent I/O with tasks/gather, and use async context managers/iterators for cleanup and streaming. The examples use common Python libraries, but the workflow transfers to any async Python stack.
**Strip**: Framework examples such as FastAPI/aiohttp/Sanic, concrete endpoint and database snippets, and the specific sample coroutines should be generalized to the host project’s async libraries and domain operations; the async patterns themselves are the reusable SOP, not the toy I/O examples.
**Notes**: Strong portable candidate. The most reusable parts are the sync-vs-async decision rule, the “stay fully sync or fully async within a call path” guideline, and the structured patterns for concurrency, timeouts, cleanup, and producer-consumer coordination.

## plugins/python-development/skills/python-resilience/SKILL.md
**Type**: Portable SOP candidate — retries, backoff, timeouts, and fault-tolerant wrapper patterns
**Portable**: Yes
**Reason**: The resilience workflow is broadly reusable: classify transient vs permanent failures, retry only the right exceptions or status codes, bound retries with time and attempt limits, and separate infrastructure concerns through decorators or client wrappers. The concrete library usage is illustrative, but the decision rules are universal.
**Strip**: Tenacity/httpx/structlog-specific code, exact decorator signatures, and concrete exception/status-code examples should be adapted to the target stack; the retry/backoff/timebox policy and the “retry at one layer only” rule are the durable SOP content.
**Notes**: Strong portable candidate. The most reusable parts are the transient-vs-permanent failure filter, exponential backoff with jitter, bounded retry limits, and the guidance to centralize resilience behavior rather than scattering it across call sites.

## plugins/python-development/skills/python-anti-patterns/SKILL.md
**Type**: Portable SOP candidate — Python anti-pattern review checklist
**Portable**: Yes
**Reason**: The file is a cross-cutting review checklist rather than a tool-specific implementation guide. Its core value is identifying recurring failure modes — scattered retries, mixed I/O and business logic, bare exception handling, missing validation, unclosed resources, blocking async, weak typing, and incomplete testing — and translating them into cleaner practices.
**Strip**: Framework- and library-specific examples such as requests, psycopg, Pydantic, and SQLAlchemy should be generalized to the host project’s stack; the bad/good code samples are illustrative and can be replaced with local equivalents while preserving the checklist categories.
**Notes**: Strong portable SOP candidate, especially as a pre-merge review aid. Keep the anti-pattern categories and fixes, but reframe the examples around the adopting codebase’s own libraries and conventions.

## plugins/python-development/skills/python-project-structure/SKILL.md
**Type**: Portable SOP candidate — Python module organization, public API boundaries, and package layout
**Portable**: Yes
**Reason**: The guidance is mostly structural and broadly reusable: keep modules cohesive, define explicit public surfaces with `__all__`, prefer shallow directory trees, choose one consistent test layout, and use absolute imports for stability. Those choices apply across most Python codebases regardless of framework.
**Strip**: The sample tree, package names, and exact subpackage examples (`services`, `models`, `api`, `ecommerce`) should be replaced with the repository’s own domain and layer names; colocated-vs-parallel test examples should become the project’s chosen convention rather than a generic recommendation.
**Notes**: Strong portable candidate. The highest-value reusable rules are “one concept per file,” “make public APIs explicit,” “keep the hierarchy shallow,” and “be consistent about test placement and imports.”
## plugins/python-development/skills/python-packaging/SKILL.md
**Type**: Portable SOP candidate — Python packaging structure, metadata, build backends, CLI entry points, versioning, and publishing workflow
**Portable**: Yes
**Reason**: The skill covers core packaging practices that apply across Python projects: choosing a source layout, declaring metadata in pyproject.toml, selecting a build backend, defining console scripts, and building/publishing wheels and sdists. Those concepts are standard across repos and are not tied to wshobson-agents-specific infrastructure.
**Strip**: Example project names, URLs, package names, version numbers, command snippets, and tool-specific config blocks should be generalized to the host project; backend-specific details for setuptools, hatchling, flit, or poetry should be kept as optional variants rather than mandatory syntax.
**Notes**: Strong portable SOP candidate. The most reusable elements are the source-layout recommendation, the PEP 517/518/621 framing, and the build/test/publish checklist.

## plugins/python-development/skills/python-code-style/SKILL.md
**Type**: Portable SOP candidate — Python formatting, linting, naming, typing, import order, and docstring standards
**Portable**: Yes
**Reason**: The guidance is broadly reusable across Python codebases: automate formatting, standardize naming, prefer absolute imports, document public APIs, and enforce type hints on public surfaces. The workflow is language- and repo-agnostic within Python and maps cleanly to any modern Python stack.
**Strip**: Specific tool choices and config examples such as ruff, mypy, pyright, black, exact line-length values, and sample project filenames should be adapted to local conventions; keep the style principles and automation intent, not the literal config snippets.
**Notes**: Strong portable SOP candidate. The highest-value rules are “let tools settle style,” “types for public APIs,” and “treat docs as code.”

## plugins/python-development/skills/python-configuration/SKILL.md
**Type**: Portable SOP candidate — typed configuration management, environment variables, secret handling, and boot-time validation
**Portable**: Yes
**Reason**: Centralized typed settings loaded from environment variables are a universal application pattern. Fail-fast validation, environment-specific defaults, namespaced variables, and secret isolation are useful across services, CLIs, and containers regardless of the surrounding framework.
**Strip**: Pydantic-settings-specific classes and decorators, Field alias syntax, environment enum code, nested-delimiter examples, and secrets_dir paths should be generalized to the host config library or settings model.
**Notes**: Strong portable SOP candidate. The most reusable pattern is a single validated settings object imported throughout the application instead of scattered getenv calls.

## plugins/python-development/skills/python-background-jobs/SKILL.md
**Type**: Portable SOP candidate — asynchronous job queues, worker processing, idempotency, retries, job state tracking, and status polling
**Portable**: Yes
**Reason**: The core workflow applies to any background-processing system: accept work, return a job ID, persist state, process asynchronously, make tasks idempotent, and handle retries and permanent failures explicitly. Celery is only an example implementation; the underlying job-control model is broadly transferable.
**Strip**: Celery APIs, broker URLs, decorator syntax, queue/library names, framework-specific HTTP endpoints, and example task chaining calls should be treated as implementation examples rather than required mechanics.
**Notes**: Strong portable SOP candidate. The most reusable pieces are the idempotency strategy, state-machine model, retry/backoff guidance, and dead-letter-queue pattern.
## plugins/python-development/skills/python-resource-management/SKILL.md
**Type**: Portable SOP candidate — Python resource cleanup, context management, and streaming accumulation patterns
**Portable**: Yes
**Reason**: The core guidance is general Python resource-lifecycle management: sync/async context managers, unconditional cleanup, selective exception suppression, ExitStack orchestration, and efficient streaming accumulation are reusable across projects and resource types.
**Strip**: Replace example-specific libraries and interfaces (`psycopg`, `asyncpg`, `structlog`, `StreamingResponse`, `connect_to_host`) with the host project's resource APIs and logging stack; keep the cleanup/suppression contract and streaming-state pattern.
**Notes**: Strong portable SOP candidate; the durable value is the deterministic cleanup model plus the ExitStack and streaming accumulation patterns.

## plugins/python-development/skills/uv-package-manager/SKILL.md
**Type**: Portable SOP candidate — Python dependency and environment workflow using uv
**Portable**: Yes
**Reason**: The reusable core is the modern Python project workflow: initialize a project, manage virtual environments, add/remove/upgrade dependencies, lock versions, and pin Python interpreters. Those steps transfer to any uv-based Python repo.
**Strip**: Keep the uv-specific commands as examples, but generalize install methods, lockfile commands, and migration snippets to the host project's package-manager conventions if this is promoted beyond uv-specific usage.
**Notes**: Strong uv-specific operational guide; portable at the workflow level, while the command surface remains uv-specific.

## plugins/llm-application-dev/skills/prompt-engineering-patterns/SKILL.md
**Type**: Portable SOP candidate — prompt design, structured output, few-shot selection, verification, and prompt optimization workflow
**Portable**: Yes
**Reason**: The skill describes general prompt-engineering practices that transfer across models and stacks: start simple, add constraints progressively, use examples intentionally, enforce structured outputs, recover from malformed responses, and measure prompt quality over time. The concepts are not tied to one repo or runtime.
**Strip**: Model-specific SDK calls, Anthropic/LangChain/Pydantic examples, exact prompt strings, and token/cache API details should be treated as implementation examples; keep the prompt-shaping principles, not the literal code.
**Notes**: Strong portable SOP candidate. The most reusable pieces are the progressive-disclosure pattern, structured-output discipline, and the “test/measure/iterate” loop for prompt refinement.

## plugins/llm-application-dev/skills/llm-evaluation/SKILL.md
**Type**: Portable SOP candidate — evaluation design, automated metrics, human review, LLM-as-judge, A/B testing, and regression detection
**Portable**: Yes
**Reason**: The workflow is broadly reusable for any LLM application: define metrics, build a repeatable test set, compare variants, add human or judge-based review where automation falls short, and track regressions over time. The file is process-oriented rather than repo-bound.
**Strip**: LangSmith, Anthropic, NLTK, ROUGE, BERTScore, and other library-specific snippets should be generalized to the local evaluation stack; keep the evaluation ladder and statistical comparison approach.
**Notes**: Strong portable SOP candidate. The most valuable transferable patterns are baseline/test-set discipline, pairwise comparison, and explicit regression gating before deployment.

## plugins/llm-application-dev/skills/rag-implementation/SKILL.md
**Type**: Portable SOP candidate — RAG architecture, retrieval strategy, chunking, reranking, and grounded-answer prompting
**Portable**: Yes
**Reason**: The core guidance applies to any retrieval-grounded LLM system: index documents, retrieve with semantic or hybrid search, chunk by meaning, rerank candidates, and generate answers constrained by context with citations. The implementation examples vary, but the operating model is universal.
**Strip**: Specific vector stores, embedding vendors, LangChain/LangGraph classes, and example prompts should be generalized to the host application; the architectural sequence (ingest → chunk → embed → retrieve → rerank → answer → evaluate) is the durable SOP.
**Notes**: Strong portable SOP candidate. The most reusable parts are the retrieval-optimization loop, the citation/grounding prompt pattern, and the evaluation metrics for retrieval and answer faithfulness.

## plugins/llm-application-dev/skills/embedding-strategies/SKILL.md
**Type**: Portable SOP candidate — embedding model selection, chunking strategy, preprocessing, domain specialization, and retrieval-quality evaluation
**Portable**: Yes
**Reason**: The skill captures general decisions that apply to any embedding-based system: choose a model that matches the domain and constraints, chunk text to preserve semantics, normalize and batch inputs, use special prefixes or domain-specific models when helpful, and validate retrieval quality with measurable metrics.
**Strip**: Vendor-specific model names, SDK calls, and code for Voyage/OpenAI/Sentence Transformers should be treated as examples; preserve the decision criteria, chunking heuristics, and retrieval-evaluation workflow.
**Notes**: Strong portable SOP candidate. The most reusable elements are the model-to-use-case mapping, the chunking heuristics, and the explicit evaluation loop for precision/recall/MRR/NDCG.

## plugins/python-development/skills/async-python-patterns/SKILL.md
**Type**: Portable SOP candidate — async/await, concurrency, event-loop, and non-blocking I/O patterns
**Portable**: Yes
**Reason**: The core guidance is framework-agnostic: decide sync vs async based on workload, keep call paths consistently sync or async, structure concurrent I/O with tasks/gather, and use async context managers/iterators for cleanup and streaming. The examples use common Python libraries, but the workflow transfers to any async Python stack.
**Strip**: Framework examples such as FastAPI/aiohttp/Sanic, concrete endpoint and database snippets, and the specific sample coroutines should be generalized to the host project’s async libraries and domain operations; the async patterns themselves are the reusable SOP, not the toy I/O examples.
**Notes**: Strong portable candidate. The most reusable parts are the sync-vs-async decision rule, the “stay fully sync or fully async within a call path” guideline, and the structured patterns for concurrency, timeouts, cleanup, and producer-consumer coordination.

## plugins/python-development/skills/python-resilience/SKILL.md
**Type**: Portable SOP candidate — retries, backoff, timeouts, and fault-tolerant wrapper patterns
**Portable**: Yes
**Reason**: The resilience workflow is broadly reusable: classify transient vs permanent failures, retry only the right exceptions or status codes, bound retries with time and attempt limits, and separate infrastructure concerns through decorators or client wrappers. The concrete library usage is illustrative, but the decision rules are universal.
**Strip**: Tenacity/httpx/structlog-specific code, exact decorator signatures, and concrete exception/status-code examples should be adapted to the target stack; the retry/backoff/timebox policy and the “retry at one layer only” rule are the durable SOP content.
**Notes**: Strong portable candidate. The most reusable parts are the transient-vs-permanent failure filter, exponential backoff with jitter, bounded retry limits, and the guidance to centralize resilience behavior rather than scattering it across call sites.

## plugins/python-development/skills/python-anti-patterns/SKILL.md
**Type**: Portable SOP candidate — Python anti-pattern review checklist
**Portable**: Yes
**Reason**: The file is a cross-cutting review checklist rather than a tool-specific implementation guide. Its core value is identifying recurring failure modes — scattered retries, mixed I/O and business logic, bare exception handling, missing validation, unclosed resources, blocking async, weak typing, and incomplete testing — and translating them into cleaner practices.
**Strip**: Framework- and library-specific examples such as requests, psycopg, Pydantic, and SQLAlchemy should be generalized to the host project’s stack; the bad/good code samples are illustrative and can be replaced with local equivalents while preserving the checklist categories.
**Notes**: Strong portable SOP candidate, especially as a pre-merge review aid. Keep the anti-pattern categories and fixes, but reframe the examples around the adopting codebase’s own libraries and conventions.

## plugins/python-development/skills/python-project-structure/SKILL.md
**Type**: Portable SOP candidate — Python module organization, public API boundaries, and package layout
**Portable**: Yes
**Reason**: The guidance is mostly structural and broadly reusable: keep modules cohesive, define explicit public surfaces with `__all__`, prefer shallow directory trees, choose one consistent test layout, and use absolute imports for stability. Those choices apply across most Python codebases regardless of framework.
**Strip**: The sample tree, package names, and exact subpackage examples (`services`, `models`, `api`, `ecommerce`) should be replaced with the repository’s own domain and layer names; colocated-vs-parallel test examples should become the project’s chosen convention rather than a generic recommendation.
**Notes**: Strong portable candidate. The highest-value reusable rules are “one concept per file,” “make public APIs explicit,” “keep the hierarchy shallow,” and “be consistent about test placement and imports.”
## plugins/frontend-mobile-development/skills/nextjs-app-router-patterns/SKILL.md
**Type**: Portable SOP candidate — Next.js App Router architecture, server/client component boundaries, streaming, routing, metadata, and caching patterns
**Portable**: Yes
**Reason**: The skill describes general Next.js 14+ application architecture rather than repo-specific workflows: choose Server Components for data and secrets, Client Components for interactivity, use Suspense for streaming, structure routes with file conventions, and manage mutations with Server Actions and cache invalidation. Those decisions transfer cleanly to any Next.js App Router codebase.
**Strip**: Next.js file names and APIs (`app/`, `route.ts`, `generateMetadata`, `revalidateTag`, `revalidatePath`, `searchParams` typing) should be kept as Next.js-specific implementation details; if adapting beyond Next.js, translate them to the host framework’s routing, metadata, and cache primitives.
**Notes**: Strong portable candidate. The most reusable SOP content is the server/client boundary rule, Suspense-driven streaming, and the caching/invalidation decision tree.

## plugins/frontend-mobile-development/skills/react-native-architecture/SKILL.md
**Type**: Portable SOP candidate — React Native app architecture, navigation, offline-first state, native integrations, and performance patterns
**Portable**: Yes
**Reason**: The core guidance is broadly reusable across React Native/Expo projects: keep a clear project structure, use router-based navigation and auth gating, separate server sync from local UI state, wrap native capabilities behind services, and optimize long lists and rendering performance. The examples are concrete, but the architecture decisions are general mobile-app patterns.
**Strip**: Expo Router, EAS, package install commands, and platform-specific module names (`expo-secure-store`, `expo-haptics`, `expo-notifications`, `FlashList`, `react-native-reanimated`) should be generalized to the target mobile stack’s navigation, storage, notification, and animation tools.
**Notes**: Strong candidate for a mobile SOP. Preserve the offline-first/react-query approach, route protection flow, and performance guidance; treat Expo-specific tooling as implementation detail.

## plugins/frontend-mobile-development/skills/react-state-management/SKILL.md
**Type**: Portable SOP candidate — state taxonomy, store-selection heuristics, and client/server state separation
**Portable**: Yes
**Reason**: The skill’s main value is framework-agnostic decision guidance: classify state as local, global, server, URL, or form state; choose the smallest fit-for-purpose tool; avoid duplicating server state; and keep derived data out of stores. The Redux/Zustand/Jotai/React Query examples are illustrative implementations of those universal choices.
**Strip**: Library-specific APIs and syntax (`createSlice`, `create`, `atom`, `useQuery`, middleware setup, query-key factories) should be collapsed into generic store, atom, and cache patterns unless the target repo standardizes on those libraries.
**Notes**: Strong portable candidate. The most reusable SOP content is the selection matrix and the “separate concerns” rule between client state and server state.

## plugins/frontend-mobile-development/skills/tailwind-design-system/SKILL.md
**Type**: Portable SOP candidate — utility-first design-system architecture, token hierarchy, component variants, responsive patterns, and accessibility
**Portable**: Yes
**Reason**: The guidance is broadly reusable as a design-system methodology: define brand/semantic/component tokens, build components from base styles plus variants and sizes, keep responsive behavior explicit, and support dark mode and accessibility consistently. Tailwind v4 syntax is the implementation surface, but the underlying design-system rules are transferable.
**Strip**: Tailwind v4 directives and syntax (`@theme`, `@custom-variant`, `@layer`, utility class strings) should be treated as framework-specific. React 19 ref-as-prop examples and class-variance-authority examples should be generalized to the host component system and styling primitives.
**Notes**: Strong candidate if the host project uses utility CSS or design tokens. The most reusable SOP elements are the token hierarchy, component variant pattern, and the dark-mode/accessibility guidance.
## plugins/llm-application-dev/skills/hybrid-search-implementation/SKILL.md
**Type**: Portable SOP candidate — hybrid retrieval architecture, rank fusion, and reranking workflow
**Portable**: Yes
**Reason**: The guidance is broadly reusable across RAG and search systems: run semantic and lexical retrieval in parallel, fuse ranked results, over-fetch before reranking, and use metadata filters to preserve precision. The examples are implementation details, but the retrieval pattern itself is generic.
**Strip**: Library-specific code for Postgres, Elasticsearch, and sentence-transformers should be generalized to the host stack; SQL syntax, client APIs, and index definitions are examples rather than required mechanics.
**Notes**: Strong portable candidate. The most reusable pieces are the retrieval/fusion split, the RRF and weighted-combination options, and the rerank-after-candidate-generation pattern.
## plugins/llm-application-dev/skills/langchain-architecture/SKILL.md
**Type**: Portable SOP candidate — LLM application architecture, typed state, memory, and tool orchestration patterns
**Portable**: Yes
**Reason**: Although the file is framed around LangChain and LangGraph, the underlying advice is generalizable: keep agent state explicit, separate retrieval from generation, use structured tools, persist memory/checkpoints, and trace executions for debugging. Those are durable architecture principles for any agentic LLM system.
**Strip**: LangChain/LangGraph package names, helper APIs, and example models should be replaced with the target orchestration framework’s equivalents; the code snippets are illustrative and not portable as-is.
**Notes**: Portable at the design level, not at the API level. The strongest transferable elements are typed state management, durable execution, human-in-the-loop checkpoints, and a clear retrieve → reason → act workflow.
## plugins/llm-application-dev/skills/similarity-search-patterns/SKILL.md
**Type**: Portable SOP candidate — similarity search implementation, index selection, and retrieval optimization workflow
**Portable**: Yes
**Reason**: The core concepts are universal for vector search: choose the right distance metric, select an index shape based on data size and latency goals, batch writes and queries carefully, and validate recall/latency tradeoffs with measurement. The vendor examples reinforce a common search playbook rather than defining it.
**Strip**: Pinecone, Qdrant, pgvector, and other client-specific classes and configuration details should be generalized to the host vector store; API calls and collection/index setup are implementation examples.
**Notes**: Strong portable candidate. The most reusable parts are the metric/index decision matrix, the upsert/search patterns, and the rerank/filter hooks for production retrieval systems.
## plugins/llm-application-dev/skills/vector-index-tuning/SKILL.md
**Type**: Portable SOP candidate — vector index tuning, compression, and recall/latency tradeoff management
**Portable**: Yes
**Reason**: The tuning loop is broadly applicable to any approximate nearest-neighbor system: benchmark candidate parameter sets, compare recall against latency and memory, choose index types by scale, and add quantization only when the tradeoff is justified. This is a general production search optimization workflow.
**Strip**: HNSW/Qdrant/Pinecone-specific APIs, benchmark code, and helper formulas should be translated to the target vector engine; the exact parameter names and thresholds are vendor- and workload-dependent.
**Notes**: Strong portable SOP candidate. The most reusable guidance is the explicit benchmarking loop, the scale-based index selection table, and the quantization memory model.
## plugins/javascript-typescript/skills/modern-javascript-patterns/SKILL.md
**Type**: Portable SOP candidate — modern JavaScript syntax, async patterns, modules, and functional programming guidance
**Portable**: Yes
**Reason**: The core guidance is broadly reusable across JavaScript codebases: prefer ES6+ syntax, use immutable data transformations, structure async work with promises/async-await, and keep functions small and composable. The examples are illustrative rather than tied to a specific runtime or repository layout.
**Strip**: Repo-local links to `references/advanced-patterns.md`, any browser-only assumptions around `fetch` or top-level await, and example code blocks that are meant as illustrations rather than required patterns.
**Notes**: Strong portable SOP candidate. The most reusable sections are the syntax patterns, async/error-handling habits, and the best-practices checklist; the reference-file pointers should be generalized into optional appendix material.
## plugins/javascript-typescript/skills/typescript-advanced-types/SKILL.md
**Type**: Portable SOP candidate — advanced TypeScript generics, conditional types, mapped types, inference, and type-testing guidance
**Portable**: Yes
**Reason**: The file focuses on TypeScript’s type system in a way that transfers cleanly across repositories. Its main value is the reusable type-logic patterns and the advice to prefer inference, helper types, and type tests for safety.
**Strip**: Any temptation to treat the example type aliases as production-ready drop-ins when they shadow built-ins (`ReturnType`, `Readonly`, `Partial`, `Parameters`); if ported, those examples should be renamed or explicitly labeled as educational.
**Notes**: Strong portable SOP candidate. The type inference, discriminated union, and type-testing sections are especially reusable; the built-in-name collisions are the main cleanup item for portability and clarity.
## plugins/javascript-typescript/skills/javascript-testing-patterns/SKILL.md
**Type**: Portable SOP candidate — testing strategy for unit, integration, mocking, fixtures, and TDD workflows
**Portable**: Yes
**Reason**: The core testing advice is framework-agnostic at the workflow level: choose the right test layer, keep tests isolated and deterministic, mock external dependencies, prefer semantic assertions, and use fixtures/factories for repeatability. Jest, Vitest, and Testing Library are presented as examples of common tool surfaces.
**Strip**: Repo-local links to `references/advanced-testing-patterns.md`, framework-specific config snippets that may not match the target runner, and any assumptions about global test setup or APIs that only exist in Vitest/Jest environments.
**Notes**: Strong portable SOP candidate. The best reusable material is the AAA pattern, mocking discipline, integration-test hygiene, and the guidance on stable selectors and cleanup; keep the tool examples as optional variants rather than required setup.
## plugins/javascript-typescript/skills/nodejs-backend-patterns/SKILL.md
**Type**: Portable SOP candidate — Node.js backend architecture, middleware, error handling, auth, database, and API design
**Portable**: Yes
**Reason**: The architectural guidance is broadly reusable for backend services: layer controllers/services/repositories, centralize middleware and error handling, validate inputs, enforce auth on the server, and use connection pooling/logging/rate limiting in production. The frameworks and libraries shown are standard examples rather than repo-specific coupling.
**Strip**: Repo-local links to `references/advanced-patterns.md`, framework-specific setup details for Express/Fastify, library-specific middleware examples, and concrete database/auth/cache implementations that should become stack-agnostic placeholders.
**Notes**: Strong portable SOP candidate, but denser on implementation-specific examples than the other three files. The layered architecture, error taxonomy, security checklist, and testing reminders are the highest-value portable sections.
## plugins/machine-learning-ops/skills/ml-pipeline-workflow/SKILL.md
**Type**: Pattern — end-to-end MLOps pipeline workflow
**Portable**: Yes
**Reason**: The core workflow is domain-generic: stage a pipeline from ingest/validate/transform/train/evaluate/deploy, keep stages modular and idempotent, and separate data, model, and deployment concerns. The concrete orchestration tools and serving platforms are examples, not requirements.
**Strip**: Tool names and concrete stack choices (Airflow, Dagster, Kubeflow, Prefect, MLflow, W&B, SageMaker, Vertex AI, Azure ML, KServe) should become placeholders or local equivalents; the sample YAML/Python snippets are implementation examples.
**Notes**: Strong portable SOP candidate for ML teams. The reusable value is the lifecycle discipline, validation gates, versioning, and deployment/rollback thinking.

## plugins/api-scaffolding/skills/fastapi-templates/SKILL.md
**Type**: Pattern — FastAPI project template and backend service layout
**Portable**: Yes
**Reason**: The guidance is reusable across FastAPI codebases: separate routers, core config, schemas, services, repositories, and dependencies; wire async request handling cleanly; and keep auth, DB, and tests behind explicit interfaces. The sample app/module names are illustrative.
**Strip**: Concrete module paths, example endpoint names, and library-specific snippets (SQLAlchemy, Pydantic Settings, jose, passlib, httpx) should be adapted to the project’s chosen stack and conventions.
**Notes**: Strong within the FastAPI ecosystem. Good candidate for a baseline project template, but it stays Python/FastAPI-specific rather than cross-stack.

## plugins/dotnet-contribution/skills/dotnet-backend-patterns/SKILL.md
**Type**: Pattern — .NET backend architecture, async, data access, caching, and testing
**Portable**: Yes
**Reason**: The guidance is reusable across .NET services: cleanly separate Domain/Application/Infrastructure/Api, keep async all the way through, centralize options/configuration, and choose EF Core or Dapper patterns deliberately. The examples show standard .NET practices rather than repo-specific logic.
**Strip**: Concrete type names, sample service names, connection strings, and command snippets should be generalized to the host service. The file exceeds the progressive-disclosure sweet spot and should move extended reference material out of SKILL.md if reused.
**Notes**: Strong portable SOP candidate for .NET teams, but it is bloated at 810 lines without a `references/` directory. Best split into a tighter execution skill plus reference docs.

## plugins/plugin-eval/skills/evaluation-methodology/SKILL.md
**Type**: Reference — PluginEval scoring methodology and rubric spec
**Portable**: No
**Reason**: The content is tightly bound to PluginEval’s own scoring model: layer blending, anti-pattern flags, badge thresholds, Elo integration, CLI commands, and related agent names. It is valuable documentation, but not a generally transferable SOP.
**Strip**: PluginEval-specific formulas, thresholds, anti-pattern names, CLI invocations, badge logic, and the `eval-judge` / `eval-orchestrator` links should be treated as project-local implementation details if adapted elsewhere.
**Notes**: Keep this as a reference spec for PluginEval rather than a portable skill. The reusable idea is the evaluation structure, but the concrete rubric and scoring constants are repo-specific.
## plugins/payment-processing/skills/stripe-integration/SKILL.md
**Type**: Portable SOP candidate — Stripe payment integration workflows
**Portable**: Yes
**Reason**: The core guidance covers universal payment concerns: hosted checkout vs. payment-intent tradeoffs, subscription setup, webhook verification, customer/payment-method management, refunds, disputes, and test-mode validation. Those patterns transfer cleanly even though the sample code is Stripe-specific.
**Strip**: Stripe API calls, event names, Python/JavaScript snippets, test card numbers, and example URLs should become placeholders for the host payment provider and application stack.
**Notes**: Strong reusable payment-processing SOP; the main adaptation is mapping Stripe objects and webhook events to the local billing/backend abstractions.

## plugins/payment-processing/skills/paypal-integration/SKILL.md
**Type**: Portable SOP candidate — PayPal payment integration workflows
**Portable**: Yes
**Reason**: The skill captures broadly reusable checkout, order capture, IPN/webhook verification, subscription, refund, and error-handling practices. The process is portable across payment providers, with PayPal serving mainly as the concrete example.
**Strip**: PayPal SDK and REST endpoints, IPN verification URL, Python/JavaScript snippets, sandbox credentials, and subscription-plan payloads should be generalized to the target provider.
**Notes**: Strong reusable e-commerce SOP; the durable value is the end-to-end payment lifecycle and verification discipline, not the PayPal-specific APIs.

## plugins/payment-processing/skills/billing-automation/SKILL.md
**Type**: Portable SOP candidate — automated billing and subscription lifecycle management
**Portable**: Yes
**Reason**: The skill focuses on universal billing concerns: subscription state transitions, invoice generation, dunning, proration, tax calculation, usage-based billing, and payment recovery. Those workflows are common across billing systems and can be implemented with any payment processor or internal ledger.
**Strip**: The `billing` module names, Stripe charge example, class scaffolding, example tax rates, and invoice/PDF rendering snippets should be replaced with the adopting system’s billing engine and data model.
**Notes**: Strong reusable billing SOP; the most transferable pieces are the lifecycle states, dunning loop, proration logic, and tax/jurisdiction checklist.

## plugins/startup-business-analyst/skills/competitive-landscape/SKILL.md
**Type**: Portable SOP candidate — competitive landscape analysis and market positioning
**Portable**: Yes
**Reason**: The analysis workflow is broadly reusable: assess forces, map competitors, identify whitespace, compare pricing, evaluate durable advantages, and monitor the market over time. The named frameworks and examples are standard strategy tools rather than repo-specific instructions.
**Strip**: Example companies, market categories, pricing tables, and illustrative positioning maps should be swapped for the target industry and product. Any references to a specific analyst workflow can be generalized to the local strategy process.
**Notes**: Strong portable strategy SOP; the most reusable value is the structured analysis sequence and the durable-advantage test, not the sample market examples.
## plugins/accessibility-compliance/skills/screen-reader-testing/SKILL.md
**Type**: Portable SOP candidate — screen-reader accessibility testing workflow, coverage priorities, and assistive-technology checks
**Portable**: Yes
**Reason**: The skill’s core workflow is broadly reusable: choose representative screen readers and platforms, test page load/navigation/forms/dynamic content, verify announcements and focus behavior, and debug with concrete reproduction steps. The guidance is process-first rather than tied to one repo or one application architecture.
**Strip**: Screen-reader-specific key chords, OS/browser setup steps, and named product shortcuts should be normalized to the adopting team’s accessibility testing docs; the example screen readers and platform matrix are useful coverage hints, not required taxonomy.
**Notes**: Strong portable SOP candidate. The most reusable parts are the testing priority ladder, the page/navigation/forms/dynamic-content checklist, and the accessible-pattern examples for labels, live regions, and modal focus management.

## plugins/business-analytics/skills/data-storytelling/SKILL.md
**Type**: Portable SOP candidate — data-to-narrative framing, executive reporting structure, and visualization guidance
**Portable**: Yes
**Reason**: The skill translates across teams because it focuses on how to turn evidence into a decision-ready story: hook, context, insight, recommendation, and call to action. The templates and visualization techniques are generic communication patterns rather than domain-specific analytics machinery.
**Strip**: Industry examples, sample metrics, and slide/story templates should be replaced with the host organization’s business context; the sample chart styling, SQL/Python snippets, and named business scenarios are illustrative and can be adapted to local tooling.
**Notes**: Strong portable SOP candidate. The most reusable elements are the narrative arc, the “data + narrative + visuals” triad, and the headline-writing rules that make analytics legible to executives and non-technical stakeholders.

## plugins/business-analytics/skills/kpi-dashboard-design/SKILL.md
**Type**: Portable SOP candidate — KPI selection, dashboard hierarchy, metric governance, and monitoring patterns
**Portable**: Yes
**Reason**: The workflow is reusable anywhere teams need a trustworthy dashboard: define strategic/tactical/operational layers, pick SMART KPIs, keep the executive view compact, and support drilldowns for root-cause analysis. The skill emphasizes decision-quality metrics over any one stack or charting library.
**Strip**: SaaS-specific metric names, the ASCII mockups, Streamlit/SQL examples, and the exact alert thresholds should be adapted to the target domain and tooling; the dashboard layouts are patterns, not prescriptions.
**Notes**: Strong portable SOP candidate. The most reusable parts are the KPI hierarchy, the “4–6 headline metrics” executive pattern, and the governance idea that conflicting metrics need a single calculation source of truth.

## plugins/blockchain-web3/skills/solidity-security/SKILL.md
**Type**: Portable SOP candidate — smart-contract security patterns, vulnerability prevention, and audit checklist
**Portable**: Yes
**Reason**: The core security guidance is reusable across Solidity projects: use checks-effects-interactions, guard against reentrancy and access-control mistakes, validate inputs, prefer pull payments, and treat gas optimization as secondary to safety. The file reads as a general audit-and-hardening playbook rather than a repo-specific implementation guide.
**Strip**: Solidity-version caveats, OpenZeppelin import paths, example contract names, and the sample DeFi/front-running scenarios should be generalized to the adopter’s contract architecture; code blocks are useful examples but not mandatory structure.
**Notes**: Strong portable SOP candidate. The most transferable content is the vulnerability checklist, the CEI/pull-payment patterns, and the operational hardening guidance around pausable circuit breakers, role checks, and safe external calls.
## plugins/shell-scripting/skills/bash-defensive-patterns/SKILL.md
**Type**: Portable SOP candidate — defensive Bash scripting patterns for error handling, safety, logging, cleanup, and idempotency
**Portable**: Yes
**Reason**: The core workflow is broadly reusable across shell projects: enable strict mode, quote variables, validate inputs, trap errors, manage temp files safely, use arrays and NUL-safe loops, and design scripts to be rerunnable. The guidance is process-oriented rather than repo-specific and maps cleanly to most Bash automation, CI, and system scripts.
**Strip**: Bash-only syntax details (`set -Eeuo pipefail`, `${BASH_SOURCE[0]}`, `[[ ]]`, `mapfile`, `local -r`), GNU/BSD-specific command variants, example function names, and the exact logging/argument-parser snippets should become local implementation examples rather than required wording.
**Notes**: Strong portable SOP candidate. The highest-value reusable pieces are strict-mode discipline, safe quoting, cleanup traps, and idempotent file/process handling.

## plugins/shell-scripting/skills/bats-testing-patterns/SKILL.md
**Type**: Portable SOP candidate — Bats-based shell test workflow, fixtures, setup/teardown, mocking, and failure-path validation
**Portable**: Yes
**Reason**: The testing discipline is generic even though the framework is Bats: isolate tests, use setup/teardown, prefer stable assertions, mock external commands, cover success and error paths, and keep tests fast and deterministic in CI. These habits transfer to any shell-test harness or command-line utility test suite.
**Strip**: Bats-specific syntax (`@test`, `run`, `setup_file`, `teardown_file`, `load`), fixture paths, helper filenames, installation commands, and shell-runner examples should be generalized to the host test framework and repo layout.
**Notes**: Strong portable SOP candidate for shell test practice. The most reusable elements are the test structure, teardown hygiene, stubbing strategy, and the “test both success and failure” rule.

## plugins/shell-scripting/skills/shellcheck-configuration/SKILL.md
**Type**: Portable SOP candidate — ShellCheck linting configuration, suppression hygiene, and CI integration workflow
**Portable**: Yes
**Reason**: The operational model is widely reusable: configure static analysis for the target shell, run it in pre-commit/CI/editor workflows, document suppressions, and fix violations rather than masking them. Even though the tool is ShellCheck-specific, the surrounding linting policy is a general shell-quality SOP.
**Strip**: ShellCheck rc keys, CLI flags, warning codes, workflow examples, and shellcheck-specific suppression comments should be treated as tool-specific implementation details; keep the linting policy but adapt the exact configuration surface to the adopted analyzer.
**Notes**: Strong portable SOP candidate when framed as a shell linting standard. The key transferable parts are target-shell alignment, explicit exclusions, and CI enforcement.

## plugins/accessibility-compliance/skills/wcag-audit-patterns/SKILL.md
**Type**: Portable SOP candidate — WCAG accessibility audit workflow, checklisting, automated testing, and remediation patterns
**Portable**: Yes
**Reason**: The core workflow is broadly reusable for any web team: audit against an accessibility standard, use the POUR lens, check critical keyboard/contrast/label/heading issues first, combine automated tooling with manual verification, and apply repeatable remediation patterns. The process is domain-agnostic within web UI work and does not depend on repo-specific infrastructure.
**Strip**: WCAG section numbering, example code blocks, axe-core/Playwright/Pa11y command syntax, and the specific contrast ratios/examples should be treated as illustrative unless the target organization uses the same audit rubric and tooling.
**Notes**: Strong portable SOP candidate for accessibility review. The most reusable pieces are the severity framing, the checklist structure, and the “automated plus manual” audit loop.
## plugins/blockchain-web3/skills/defi-protocol-templates/SKILL.md
**Type**: Portable SOP candidate — DeFi protocol template patterns for staking, AMMs, governance, and flash loans
**Portable**: Yes
**Reason**: The skill is organized around reusable protocol shapes and implementation patterns that transfer across Web3 projects: staking reward accounting, liquidity-pool math, governance voting, and flash-loan callbacks. The guidance is domain-level rather than repo-specific, so the same structure can serve as a reference for many Solidity codebases.
**Strip**: Solidity/OpenZeppelin import paths, example contract names, fixed reward/fee constants, and the specific ERC-20 callback interfaces should be generalized to the target stack and protocol design.
**Notes**: Strong portable candidate, but keep it as a pattern library rather than a copy-paste source. The template code is useful as an illustrative baseline; adopting projects should swap in their own security checks, token assumptions, and upgrade/governance conventions.
## plugins/blockchain-web3/skills/nft-standards/SKILL.md
**Type**: Portable SOP candidate — NFT standard implementation patterns for ERC-721, ERC-1155, metadata, royalties, and soulbound tokens
**Portable**: Yes
**Reason**: The skill captures standard NFT concerns that recur across collections and marketplaces: minting strategy, metadata handling, supply enforcement, royalties, non-transferability, and dynamic token state. These are durable product patterns, not workspace-specific mechanics, so the structure is broadly reusable.
**Strip**: OpenZeppelin/erc721a imports, example token names, fixed supply and pricing constants, and the illustrative IPFS/Base64 snippets should be adapted to the host project’s asset and metadata pipeline.
**Notes**: Strong portable SOP candidate. The best reusable pieces are the decision points around standard selection, metadata location, and feature tradeoffs; the example contracts should remain examples until reworked for the target collection.
## plugins/blockchain-web3/skills/web3-testing/SKILL.md
**Type**: Portable SOP candidate — smart-contract testing workflow for Hardhat, Foundry, forking, fuzzing, and verification
**Portable**: Yes
**Reason**: The skill describes a reusable testing lifecycle for blockchain code: configure the harness, write unit and integration tests, exercise time and forked-chain behavior, compare gas usage, and validate deployment/verification steps. That workflow is broadly applicable across Solidity projects even though the example toolchain is specific.
**Strip**: Hardhat/Forged-specific config, RPC URLs, CLI invocations, and the concrete test snippets should be generalized to the project’s chosen runner, coverage tooling, and CI conventions.
**Notes**: Strong portable SOP candidate. Preserve the testing philosophy — fixtures, forks, fuzzing, gas checks, and coverage gates — while swapping in the local framework and network setup.
## plugins/payment-processing/skills/pci-compliance/SKILL.md
**Type**: Portable SOP candidate — PCI DSS compliance and cardholder-data handling practices
**Portable**: Yes
**Reason**: The skill encodes evergreen compliance and security practices: minimize card data retention, tokenize where possible, encrypt at rest and in transit, restrict access, and maintain auditability. These controls are broadly reusable across payment systems and do not depend on the source repository’s implementation details.
**Strip**: Python/Stripe examples, Flask snippets, and the illustrative logging/token-vault code should be translated into the host application stack and payment processor integration.
**Notes**: Strong portable SOP candidate. The compliance checklist and data-minimization rules are the most reusable elements; treat the code blocks as reference patterns and revalidate them against the project’s PCI scope.
## plugins/ui-design/skills/design-system-patterns/SKILL.md
**Type**: Portable SOP candidate — design tokens, theming infrastructure, component architecture, and token pipeline guidance
**Portable**: Yes
**Reason**: The core guidance is implementation-agnostic: define a token hierarchy, separate primitive/semantic/component tokens, route theme switching through a shared context or CSS variables layer, and treat token changes as versioned API changes. These patterns transfer cleanly across design systems and UI stacks.
**Strip**: Repository-specific token names, example color scales, React-centric provider code, and Style Dictionary config details should be adapted to the target stack; any Figma sync or build pipeline references should become local tooling equivalents.
**Notes**: Strong portable candidate. The most reusable parts are the token hierarchy and the “tokens as API” versioning mindset; the concrete code snippets are illustrative rather than required.
## plugins/ui-design/skills/accessibility-compliance/SKILL.md
**Type**: Portable SOP candidate — WCAG-aligned accessibility patterns for keyboard, screen reader, forms, focus, and mobile accessibility
**Portable**: Yes
**Reason**: The guidance is broadly reusable across web and mobile UI work: prefer semantic HTML, preserve visible focus, ensure keyboard operability, label controls properly, announce dynamic changes, and test against WCAG success criteria. These are standard accessibility practices independent of repo structure.
**Strip**: The specific component examples, Tailwind class names, and any library-specific modal/focus-trap implementation should be swapped for the local component system; the listed tools can be generalized to the project’s accessibility testing stack.
**Notes**: Strong portable SOP candidate. The highest-value transferable pieces are the semantic-first approach, the form/error patterns, and the explicit WCAG checklist.
## plugins/ui-design/skills/interaction-design/SKILL.md
**Type**: Portable SOP candidate — motion, microinteraction, transition, and feedback design guidance
**Portable**: Yes
**Reason**: The principles are generic and reusable: use motion to communicate state, keep timing consistent, respect reduced-motion preferences, prefer transform/opacity for performance, and ensure interactions remain interruptible. These rules apply across UI frameworks and design systems.
**Strip**: Framer Motion examples, CSS class names, and the specific animation utility snippets should be translated to the target UI stack; the duration/easing examples can be treated as defaults rather than fixed standards.
**Notes**: Strong portable candidate. The most reusable content is the motion purpose taxonomy, timing scale, and reduced-motion guidance; the implementation snippets are helpful examples, not dependencies.
## plugins/ui-design/skills/responsive-design/SKILL.md
**Type**: Portable SOP candidate — responsive layout, fluid typography, container queries, and adaptive navigation/media patterns
**Portable**: Yes
**Reason**: The guidance is broadly applicable across modern frontends: start mobile-first, prefer fluid values over fixed widths, use container queries where supported, structure layouts with grid/flexbox, and optimize images/navigation/tables for smaller screens. These are standard responsive design practices.
**Strip**: Tailwind-specific utility syntax, React component examples, and exact breakpoint labels should be generalized to the local styling system; any device-specific wording should be reframed as content-based breakpoints and viewport capabilities.
**Notes**: Strong portable SOP candidate. The most transferable parts are the mobile-first strategy, container-query pattern, fluid scale guidance, and responsive content patterns for nav, images, and tables.
## plugins/ui-design/skills/visual-design-foundations/SKILL.md
**Type**: Portable SOP candidate — visual design foundations for typography, spacing, color, and iconography
**Portable**: Yes
**Reason**: The core guidance is framework-agnostic and reusable across web, mobile, and product design work: establish a constrained type scale, spacing system, semantic color tokens, contrast rules, and icon sizing so designs stay coherent and accessible. The examples are implementation aids, but the underlying workflow is a general design-system setup pattern.
**Strip**: Tailwind config snippets, CSS variable names, font-family examples, and code for contrast helpers should become local implementation examples; any brand-specific colors or token names should be adapted to the host design system.
**Notes**: Strong portable SOP candidate. The most reusable parts are the token-first approach, the accessibility checks, and the “limit choices to maintain consistency” rule.

## plugins/ui-design/skills/web-component-design/SKILL.md
**Type**: Portable SOP candidate — reusable UI component architecture, composition patterns, and component API design
**Portable**: Yes
**Reason**: The skill describes durable component-architecture practices that apply in React, Vue, Svelte, and similar ecosystems: choose composition patterns intentionally, keep APIs semantic and minimal, support controlled/uncontrolled usage when appropriate, and default to accessible behavior. The framework snippets illustrate the approach without binding it to one stack.
**Strip**: React/Vue/Svelte-specific syntax, `cva`/Tailwind examples, and framework hook or context implementations should be generalized to the host UI framework; the exact prop names and component shapes can be adapted to local conventions.
**Notes**: Strong portable SOP candidate. The highest-value reusable rules are “single responsibility,” “prefer composition over prop explosion,” and “accessible by default.”

## plugins/ui-design/skills/mobile-ios-design/SKILL.md
**Type**: Portable SOP candidate — native iOS interface design principles and adaptive mobile layout patterns
**Portable**: Mostly
**Reason**: The high-level design guidance around clarity, deference, depth, semantic colors, dynamic type, accessibility, and adaptive layouts is broadly reusable as an iOS design SOP. The SwiftUI examples and Apple-specific navigation/material APIs make the implementation details platform-specific, but the design principles themselves transfer cleanly to any Apple-platform app work.
**Strip**: SwiftUI code, `NavigationStack`/`TabView` specifics, SF Symbols examples, Apple-only modifiers, and iOS-version callouts should be preserved only as platform examples; if ported outside Apple ecosystems, re-express them in the target framework’s navigation, typography, and material system.
**Notes**: Good portable SOP at the principle level, with some Apple-specific implementation coupling. Best treated as a design-policy template for iOS work rather than a cross-platform UI standard.

## plugins/ui-design/skills/mobile-android-design/SKILL.md
**Type**: Portable SOP candidate — native Android interface design principles and adaptive Material 3 patterns
**Portable**: Mostly
**Reason**: The core guidance on Material 3, dynamic color, accessibility, adaptive layouts, and state hoisting is reusable as an Android design SOP. The Jetpack Compose and Android navigation/theming snippets are stack-specific, but the workflow of designing for responsiveness, touch targets, and system integration is broadly applicable within Android work.
**Strip**: Jetpack Compose syntax, `MaterialTheme`/`NavigationBar`/`NavHost` examples, Android API-level checks, and `@Preview` usage should be treated as platform examples; any local adoption should map the same principles onto the project’s UI toolkit and navigation model.
**Notes**: Good portable SOP at the principle level, though it is still clearly Android-bound in implementation. Best reuse is the accessibility, adaptivity, and theme-system guidance.
## plugins/ui-design/skills/react-native-design/SKILL.md
**Type**: Portable SOP candidate — React Native styling, navigation, and animation patterns
**Portable**: Yes
**Reason**: The guidance is tied to the React Native ecosystem, but the underlying patterns are reusable across any React Native codebase: use StyleSheet for performance, keep navigation types explicit, prefer UI-thread animations for smooth interactions, and handle platform-specific layout details deliberately. The examples are illustrative rather than repo-specific.
**Trigger**: When building or reviewing React Native screens, navigation flows, gesture interactions, responsive layouts, or Reanimated-based motion.
**Steps/contract**: (1) Define typed navigation and component props. (2) Build layouts with StyleSheet and flexbox primitives. (3) Use Reanimated/Gesture Handler for smooth motion and interactions. (4) Apply Platform.select for iOS/Android differences. (5) Favor FlatList, memoization, and safe-area handling for performance and polish.
**Strip**: Exact package versions, sample component names, color tokens, and the specific code snippets should be treated as examples; keep the styling, navigation, animation, and performance patterns.
**Notes**: Strong portable SOP candidate inside the React Native domain. The most reusable parts are the type-safe navigation setup, UI-thread animation guidance, and the layout/performance checklist.
## plugins/systems-programming/skills/go-concurrency-patterns/SKILL.md
**Type**: Portable SOP candidate — Go concurrency, cancellation, and shutdown patterns
**Portable**: Yes
**Reason**: The core guidance is standard Go concurrency practice rather than repo-specific policy: coordinate goroutines with channels, contexts, and sync primitives; bound parallelism; and use structured shutdown and race detection. The sample code demonstrates common patterns that transfer cleanly across Go services and workers.
**Trigger**: When implementing worker pools, pipelines, bounded concurrency, graceful shutdown, concurrent caches, or race-safe coordination in Go.
**Steps/contract**: (1) Propagate cancellation and deadlines with context. (2) Use channels for communication and select for multiplexing. (3) Apply sync primitives or errgroup when goroutines need coordination or error propagation. (4) Bound concurrency with semaphores or limits. (5) Close channels from the sender side and verify behavior with the race detector.
**Strip**: Example job/result structs, sleep durations, package imports, and shell commands are illustrative; keep the concurrency patterns and lifecycle rules, not the exact sample implementation.
**Notes**: Strong portable SOP candidate. The most reusable pieces are the cancellation discipline, bounded-worker patterns, and the “don’t leak goroutines” / “don’t close from the receiver” rules.
## plugins/systems-programming/skills/rust-async-patterns/SKILL.md
**Type**: Portable SOP candidate — Rust async, Tokio, and cancellation patterns
**Portable**: Yes
**Reason**: The workflow is broadly reusable across Rust async services: spawn tasks intentionally, coordinate with channels and JoinSet, keep blocking work out of async contexts, and design for cancellation and observability. The specific crates are ecosystem examples, but the patterns are standard Tokio-era Rust.
**Trigger**: When building async Rust services, coordinating concurrent tasks, handling cancellation or shutdown, designing async traits, or debugging async runtime issues.
**Steps/contract**: (1) Choose the concurrency primitive that matches the workflow: JoinSet, channels, select, or streams. (2) Limit task fan-out and keep blocking work off the runtime threads. (3) Make cancellation explicit with tokens or shutdown signals. (4) Use structured error handling and context propagation. (5) Avoid holding locks across await points and instrument tasks for debugging.
**Strip**: Cargo dependency declarations, exact crate lists, sample URLs, and the example service/domain types should be generalized; preserve the task, channel, stream, cancellation, and tracing patterns.
**Notes**: Strong portable SOP candidate for Rust async codebases. The highest-value reusable elements are the cancellation model, bounded concurrency patterns, and the warnings about blocking and lock discipline.
## plugins/systems-programming/skills/memory-safety-patterns/SKILL.md
**Type**: Portable SOP candidate — memory safety, ownership, and resource-management patterns
**Portable**: Yes
**Reason**: The content is intentionally cross-language: it teaches memory-safe design through RAII, smart pointers, Rust ownership, bounds checking, and explicit cleanup in C. Those concepts are reusable anywhere systems code manages resources or shared state.
**Trigger**: When writing or reviewing systems code that allocates resources, shares ownership, crosses thread boundaries, or needs to prevent leaks, dangling references, or races.
**Steps/contract**: (1) Tie resource lifetime to scope where possible. (2) Use ownership or smart-pointer patterns instead of raw pointers. (3) Make borrowing, aliasing, and sharing rules explicit. (4) Prefer bounds-checked containers and safe access methods. (5) Use synchronization primitives or atomics for concurrent state.
**Strip**: Language-specific syntax, compiler extensions, and debugging commands should be generalized to the host stack; keep the underlying safety model, cleanup discipline, and race-prevention guidance.
**Notes**: Strong portable SOP candidate across systems languages. The most reusable parts are the lifetime/ownership mental model, the cleanup patterns, and the explicit resource-lifecycle checklist.
## plugins/startup-business-analyst/skills/market-sizing-analysis/SKILL.md
**Type**: Portable SOP candidate — market sizing workflow for TAM/SAM/SOM, triangulation, and investor-facing opportunity framing
**Portable**: Yes
**Reason**: The core workflow is reusable across startup analysis work: define the market, choose a sizing method, calculate TAM/SAM/SOM, validate with multiple sources, and present conservative assumptions. The three-methodology structure and validation heuristics are standard analysis patterns rather than repo-specific instructions.
**Strip**: Startup examples, industry-specific benchmarks, sample market categories, and source lists should be adapted to the target domain; the exact numeric capture-rate guidance and example calculations are illustrative and should be re-baselined to the new market.
**Notes**: Strong portable SOP candidate. The most reusable pieces are the bottom-up-first framing, the triangulation step, and the discipline around separating TAM, SAM, and SOM.

## plugins/startup-business-analyst/skills/startup-metrics-framework/SKILL.md
**Type**: Portable SOP candidate — startup metrics selection, unit economics, retention, cash efficiency, and stage-based reporting
**Portable**: Yes
**Reason**: The framework is broadly reusable because it defines how to choose a small set of decision-quality metrics, calculate common startup ratios, and adjust focus by stage and business model. The emphasis on retention, CAC/LTV, burn, runway, and reporting cadence transfers cleanly to many startups.
**Strip**: Model-specific benchmark ranges, example dashboards, named analytics tools, and SaaS/marketplace/consumer/B2B metric presets should be tailored to the host company’s business model and stage.
**Notes**: Strong portable SOP candidate. The highest-value transferables are the metric hierarchy, stage-specific focus, and the habit of tying dashboards to operating decisions rather than vanity reporting.

## plugins/startup-business-analyst/skills/startup-financial-modeling/SKILL.md
**Type**: Portable SOP candidate — early-stage financial model structure for revenue, costs, cash flow, headcount, and scenarios
**Portable**: Yes
**Reason**: The skill captures a reusable modeling pattern: build cohort-based revenue, model cost buckets, forecast cash runway, plan hiring, and test conservative/base/optimistic scenarios. These are standard startup finance practices that apply across product categories and funding stages.
**Strip**: Example growth targets, compensation assumptions, retention curves, margin ranges, and sector-specific templates should be recalibrated for the target business; any sample projections or ratios are examples, not default truths.
**Notes**: Strong portable SOP candidate. The most reusable parts are the monthly-to-quarterly projection structure, the explicit cash-flow bridge, and the scenario/validation checklist.

## plugins/startup-business-analyst/skills/team-composition-analysis/SKILL.md
**Type**: Portable SOP candidate — stage-based hiring plan, compensation, equity allocation, org design, and budget planning
**Portable**: Yes
**Reason**: The workflow is reusable wherever early-stage teams need to plan headcount: map roles to company stage, decide contractor vs. full-time, budget fully-loaded cost, and allocate equity with a clear pool strategy. The hiring-sequence logic and org-structure patterns are general startup operating practices.
**Strip**: Salary and equity ranges, geographic adjustments, example org charts, and budget examples should be normalized to the local market and company context; any stage thresholds or percentages are guidance rather than fixed policy.
**Notes**: Strong portable SOP candidate. The most transferable pieces are the role-prioritization ladder, the fully-loaded compensation model, and the hiring-velocity/ramp-time assumptions.
## plugins/quantitative-trading/skills/backtesting-frameworks/SKILL.md
**Type**: Portable SOP candidate — backtesting workflow, bias mitigation, execution modeling, walk-forward validation, and Monte Carlo robustness analysis
**Portable**: Yes
**Reason**: The core process is reusable across trading or simulation codebases: separate data splits, avoid look-ahead/survivorship bias, model costs and slippage, validate out-of-sample, and compare robustness with walk-forward and bootstrap methods. The skill reads like a general research-quality backtesting SOP rather than a repo-specific implementation.
**Strip**: The Python class scaffolding, Pandas/NumPy/Decimal implementation details, concrete enum/class names, example momentum strategy, and the exact 252-day annualization assumptions should become host-stack examples or configurable defaults.
**Notes**: Strong candidate for a portable quant research SOP. The most reusable pieces are the bias checklist, the train/validation/test split discipline, and the “simulate execution realistically” rule.

## plugins/quantitative-trading/skills/risk-metrics-calculation/SKILL.md
**Type**: Portable SOP candidate — portfolio risk measurement, tail-risk analysis, rolling metrics, and stress testing workflow
**Portable**: Yes
**Reason**: The guidance is broadly reusable wherever risk needs to be measured or monitored: compute volatility, downside risk, VaR/CVaR, drawdowns, correlations, and risk-adjusted returns; then validate with rolling windows and stress scenarios. The workflow is metric- and process-oriented, with the finance-specific formulas serving as implementation examples.
**Strip**: SciPy/NumPy/Pandas-specific code, the `RiskMetrics`/`PortfolioRisk`/`RollingRiskMetrics`/`StressTester` class names, the 252 trading-day constant as a hard rule, and the named crisis scenarios should be generalized to the adopting stack and risk policy.
**Notes**: Strong portable SOP candidate for risk dashboards and controls. The best transferable elements are the “multiple metrics, not one” rule, the rolling-analysis habit, and the stress-test loop.

## plugins/reverse-engineering/skills/binary-analysis-patterns/SKILL.md
**Type**: Portable SOP candidate — binary analysis workflow, disassembly pattern recognition, control-flow recovery, and decompilation aids
**Portable**: Yes
**Reason**: The file is a reusable analysis playbook: identify calling conventions, map control flow, recover data structures, infer signatures/types, and validate findings with tooling. The concrete instruction sets and tool snippets are examples of a generic reverse-engineering workflow that transfers across binaries and environments.
**Strip**: Architecture-specific assembly examples, Ghidra/IDA scripting snippets, exact mnemonics and register conventions, and the sample helper code should be treated as illustrations rather than required SOP text.
**Notes**: Strong portable SOP candidate for reverse-engineering teams. The durable parts are the analysis sequence, the pattern catalog, and the “cross-check with multiple views” habit.

## plugins/reverse-engineering/skills/memory-forensics/SKILL.md
**Type**: Portable SOP candidate — memory acquisition, process/network artifact analysis, injection detection, and credential/persistence hunting
**Portable**: Yes
**Reason**: The workflow is broadly reusable across incident response and malware analysis: acquire memory carefully, verify integrity, enumerate processes and connections, inspect modules/VADs/injection indicators, and extract artifacts with multiple passes. The tool commands are specific, but the investigation method is a general forensics SOP.
**Strip**: Volatility command syntax, OS-specific acquisition utilities, plugin names, platform-specific registry/file examples, and the exact scenario lists should be generalized to the host forensic toolchain and OS mix.
**Notes**: Strong portable SOP candidate. The most reusable parts are the acquisition discipline, the broad-to-narrow analysis order, and the cross-correlation guidance between memory, disk, and network evidence.
## plugins/hr-legal-compliance/skills/gdpr-data-handling/SKILL.md
**Type**: Portable SOP candidate — GDPR-compliant data handling, consent management, DSAR handling, retention, privacy by design, and breach response
**Portable**: Yes
**Reason**: The workflow is broadly reusable anywhere personal data is processed: classify data, choose a lawful basis, manage consent records, honor data subject requests, enforce retention, minimize collection, and handle breaches with a clear response timeline. The skill is framed as an operational compliance playbook rather than a repo-specific implementation.
**Trigger**: When building or reviewing systems that process personal data, implementing consent and privacy controls, handling access/erasure/portability requests, defining retention rules, or preparing breach response procedures.
**Steps/contract**: (1) Classify data and map each processing activity to a lawful basis. (2) Record and audit consent changes with provenance. (3) Implement DSAR flows with verification, deadlines, and source-by-source data collection. (4) Apply retention, anonymization, and deletion policies by data category. (5) Minimize collection and pseudonymize or encrypt where possible. (6) Detect, log, and escalate breaches with authority/individual notification paths.
**Strip**: Keep article numbers and example code as guidance; generalize jurisdiction-specific legal thresholds, regulatory deadlines where they differ, storage/provider assumptions, and any concrete library or database calls to the host stack’s compliance mechanisms.
**Notes**: Strong portable SOP candidate. The most reusable parts are the lawful-basis decision tree, DSAR workflow, retention enforcement, and breach notification checklist; these translate cleanly into privacy controls for most product teams.
## plugins/hr-legal-compliance/skills/employment-contract-templates/SKILL.md
**Type**: Portable SOP candidate — employment document drafting workflow for offer letters, contracts, handbooks, and policy sections
**Portable**: Yes
**Reason**: The skill captures a generic drafting process: choose the right employment document type, structure the core clauses, include acknowledgments/disclaimers, and review for legal risk. The templates are useful as reusable scaffolding even though the actual clauses must be localized.
**Trigger**: When drafting offer letters, employment agreements, handbooks, or HR policies; standardizing employment documentation; or reviewing employment templates for completeness and consistency.
**Steps/contract**: (1) Choose the document type based on employment stage and purpose. (2) Fill in compensation, duties, confidentiality, IP, termination, and policy sections. (3) Include jurisdiction-aware clauses and explicit acknowledgments. (4) Add clear acceptance/signature blocks and supporting exhibits where needed. (5) Review for consistency, enforceability, and internal policy alignment before use.
**Strip**: Generalize state/country placeholders, at-will and non-compete language, optional clause menus, and handbook policy examples to the destination jurisdiction and company policy set; keep the drafting structure but adapt all legal substance with counsel.
**Notes**: Portable as a template system, not as legal advice. The core reusable SOP is the document-assembly checklist and review flow; the specific clauses should always be adapted to local employment law.
## plugins/reverse-engineering/skills/protocol-reverse-engineering/SKILL.md
**Type**: Portable SOP candidate — network protocol capture, packet analysis, binary structure identification, and custom documentation workflow
**Portable**: Yes
**Reason**: The workflow is domain-agnostic: capture traffic, identify signatures and field boundaries, infer message structure from multiple samples, document the protocol, and validate with a parser/dissector. The technique set transfers across proprietary protocols, debug traces, and firmware or application traffic.
**Strip**: Tool-specific commands and flags (`wireshark`, `tshark`, `tcpdump`, `mitmproxy`), sample ports and filters, protocol-specific signatures, example Lua/Scapy code, and TLS-decryption details should be generalized to the target analyzer and transport stack.
**Notes**: Strong portable SOP candidate. The most reusable pieces are the capture → identify → document → validate loop, the fixed-header/variable-payload heuristics, and the advice to compare multiple sessions before freezing a spec.

## plugins/reverse-engineering/skills/anti-reversing-techniques/SKILL.md
**Type**: Portable SOP candidate — authorized anti-debug/anti-tamper analysis workflow and protection-identification taxonomy
**Portable**: Yes
**Reason**: The high-level process is reusable across authorized security research, malware analysis, and CTF-style reverse engineering: confirm scope, identify protection layers, classify checks, and produce an evidence-backed analysis report. The core value is the detection and documentation workflow, not any single platform API.
**Strip**: Detailed bypass recipes, patching instructions, debugger command sequences, hook snippets, and platform-specific API calls should be removed or abstracted into neutral analysis placeholders unless the target environment explicitly allows implementation detail.
**Notes**: Portable only when framed as an authorized analysis SOP. The strongest transferable elements are the authorization gate, the protection taxonomy (timing, debugger, PEB/process-state, exception, environment checks), and the structured reporting format.

## plugins/game-development/skills/godot-gdscript-patterns/SKILL.md
**Type**: Portable SOP candidate — Godot 4 architecture, signal-driven design, reusable resources, and performance patterns
**Portable**: Yes
**Reason**: The guidance is highly reusable across Godot projects: scene/node composition, typed GDScript, signals, state machines, autoload singletons, resource-backed data, pooling, and component-style nodes are all durable patterns for game systems.
**Strip**: Example node names, project-specific input actions, sample game entities, and file/path references should be replaced with local scene and domain names; keep the patterns and lifecycle rules, not the demo game implementation.
**Notes**: Strong portable SOP candidate within the Godot ecosystem. The most reusable rules are “prefer signals over tight coupling,” “use resources for data,” “duplicate runtime state before mutation,” and “disable processing when idle/off-screen.”

## plugins/game-development/skills/unity-ecs-patterns/SKILL.md
**Type**: Portable SOP candidate — Unity DOTS/ECS data-oriented design, jobs, Burst, and structural-change workflow
**Portable**: Yes
**Reason**: The workflow transfers across Unity ECS projects: model data as components, process in systems/jobs, batch structural changes with ECBs, use aspects/singletons for organization, and validate performance with profiling and chunk-aware queries.
**Strip**: Example component names, baking authoring classes, sample game-object types, and exact API snippets should be generalized to the project’s own entities and systems; keep the data-oriented patterns and performance heuristics.
**Notes**: Strong portable SOP candidate within the Unity DOTS ecosystem. The most reusable pieces are the query/ECB discipline, the “avoid structural changes in hot paths” rule, and the Burst/job parallelization guidance.
## plugins/documentation-generation/agents/docs-architect.md
**Type**: Portable
**Reason**: Strongly reusable documentation-architecture guidance: analyze system structure, organize progressively, and explain design decisions with examples and diagrams.
**Strip**: None of the core workflow; only adapt the output depth, chapter structure, and file-linking conventions to the host project.
**Notes**: Good portable SOP candidate for long-form technical manuals and architecture guides.
## plugins/documentation-generation/agents/mermaid-expert.md
**Type**: Portable
**Reason**: Generic diagramming guidance that selects an appropriate Mermaid diagram type, keeps visuals readable, and covers styling and accessibility.
**Strip**: The “always provide both basic and styled versions” requirement if the target workflow only needs one diagram variant.
**Notes**: Portable as a visual-documentation helper; diagram-type examples are reusable across repos.
## plugins/documentation-generation/agents/tutorial-engineer.md
**Type**: Portable
**Reason**: Broadly reusable tutorial-design workflow centered on learning objectives, progressive disclosure, hands-on exercises, and troubleshooting.
**Strip**: Only the tutorial format examples and content style need tailoring to the local audience or stack.
**Notes**: Strong candidate for onboarding and step-by-step educational content.
## plugins/documentation-generation/agents/reference-builder.md
**Type**: Portable
**Reason**: Generic reference-doc workflow for exhaustive API/configuration coverage, cross-references, examples, and searchable structure.
**Strip**: Only the example entry template and output metadata formats need adapting to the target documentation system.
**Notes**: Strong portable SOP candidate for API docs and technical references.
## plugins/agent-teams/agents/team-lead.md
**Type**: Team orchestration / decomposition role definition
**Portable**: Yes
**Reason**: The guidance is broadly reusable for any multi-agent coordinator: split work into independent tasks, enforce one-owner-per-file boundaries, manage dependencies, synthesize results, and handle graceful shutdown.
**Strip**: `~/.claude/teams/{team-name}/config.json`, `TaskUpdate`, and Claude-specific team/tool names should be replaced with the host system’s discovery and status mechanisms.
**Notes**: Strong portable pattern for lead/coordinator agents; the ownership and synthesis rules are the most durable parts.

## plugins/agent-teams/agents/team-reviewer.md
**Type**: Focused code-review role definition
**Portable**: Yes
**Reason**: The review dimensions, structured finding format, and evidence-first severity rubric are reusable across repos and review tooling.
**Strip**: The exact dimension list and markdown template can be adapted to local review norms; file:line citation format should match the host project’s conventions if different.
**Notes**: Good portable reviewer SOP; strongest value is the structured, dimension-scoped output.

## plugins/agent-teams/agents/team-debugger.md
**Type**: Hypothesis-driven debugging role definition
**Portable**: Yes
**Reason**: The workflow is generic: define falsifiable hypotheses, collect confirming/contradicting evidence, trace causal chains, and report confidence honestly.
**Strip**: The explicit file:line citation requirement and team messaging language should be generalized only if the target environment uses different evidence conventions.
**Notes**: Very portable debugging pattern; the confirm/falsify discipline is the key reusable element.

## plugins/agent-teams/agents/team-implementer.md
**Type**: Parallel implementation role definition
**Portable**: Yes
**Reason**: The file-ownership protocol, immutable interface contract rule, and minimal-scope implementation workflow are broadly applicable to parallel feature work.
**Strip**: `TaskUpdate`, `Write/Edit/Glob/Grep/Bash` tool names, and team-specific messaging phrases should be mapped to the local agent/runtime surface.
**Notes**: Strong portable implementation SOP; the ownership boundary rule is the most important transferable guidance.
## plugins/comprehensive-review/agents/architect-review.md
**Type**: Review agent — architecture, scalability, maintainability, and design-pattern guidance
**Portable**: Yes
**Reason**: The role is broadly reusable across codebases: assess architecture, identify anti-patterns, weigh trade-offs, and recommend concrete refactors for long-term maintainability.
**Strip**: The long catalog of example patterns and cloud products; keep the role as a generic architectural reviewer with locally relevant stack examples.
**Notes**: Strong portable role definition; the value is in the review lens and response structure rather than the named technologies.
## plugins/comprehensive-review/agents/security-auditor.md
**Type**: Review agent — security, threat modeling, compliance, and hardening guidance
**Portable**: Yes
**Reason**: The core mandate is universal: evaluate attack surface, validate authn/authz, check secure coding and cloud controls, and produce actionable remediation guidance.
**Strip**: Vendor-specific tool lists and compliance acronyms where the target project has different standards; preserve the general security review workflow.
**Notes**: Strong portable role definition; the defensive mindset and structured audit approach transfer cleanly.
## plugins/debugging-toolkit/agents/debugger.md
**Type**: Debugging agent — root-cause analysis and fix verification
**Portable**: Yes
**Reason**: The workflow is technology-agnostic: capture symptoms, reproduce, isolate, fix minimally, and verify with targeted tests and evidence.
**Strip**: The specific model choice and any implied toolchain assumptions; keep the debugging loop and reporting format.
**Notes**: Clean, reusable debugging SOP with a concise investigation sequence.
## plugins/error-debugging/agents/error-detective.md
**Type**: Debugging agent — log analysis, stack-trace correlation, and anomaly detection
**Portable**: Yes
**Reason**: The agent focuses on universal incident-investigation tasks: parse logs, correlate errors over time, trace cross-service impact, and surface likely root causes.
**Strip**: Any logging/query-system specifics unless the target environment uses the same observability stack; preserve the evidence-first analysis pattern.
**Notes**: Strong portable role for incident triage and error correlation workflows.
## plugins/conductor/agents/conductor-validator.md
**Type**: Validation agent — Conductor artifact completeness and consistency checks
**Portable**: Yes
**Reason**: The core workflow is reusable anywhere a project maintains canonical docs, registries, and state files: verify required artifacts, check section presence, compare registry entries to on-disk structure, and report mismatches with severity.
**Strip**: Conductor-specific paths, file names, status markers, and `/conductor:*` commands should become host-project equivalents.
**Notes**: Strong portable validation SOP; the artifact-sync and cross-reference checks are the most reusable parts.
## plugins/backend-development/agents/tdd-orchestrator.md
**Type**: Orchestration agent — TDD governance and red-green-refactor coordination
**Portable**: Yes
**Reason**: The guidance generalizes well across teams: enforce test-first discipline, coordinate unit/integration/E2E work, track coverage and quality gates, and keep refactoring safe with a strong test suite.
**Strip**: TDD examples, framework lists, and multi-agent workflow wording should be adapted to the target team’s test stack and process.
**Notes**: Strong reusable SOP for TDD leadership; best distilled into a concise team-wide TDD operating procedure.
## plugins/backend-development/agents/event-sourcing-architect.md
**Type**: Architecture agent — event sourcing, CQRS, and event-driven design guidance
**Portable**: Yes
**Reason**: The workflow is broadly applicable to event-sourced systems: define aggregate boundaries, design immutable events, build projections, manage sagas, and plan versioning/snapshotting for long-lived streams.
**Strip**: Event-store/vendor assumptions and any implementation-specific patterns should be replaced with host-stack primitives.
**Notes**: Strong portable architecture SOP; the immutable-event and projection-building rules are the highest-value transfer.
## plugins/comprehensive-review/agents/code-reviewer.md
**Type**: Review agent — code quality, security, performance, and reliability review
**Portable**: Yes
**Reason**: The review process is universal: inspect context first, assess architecture and tests, then evaluate correctness, security, performance, and maintainability before giving structured feedback.
**Strip**: Tool brand names, language-specific examples, and review automation integrations should be generalized to the local review toolchain.
**Notes**: Strong portable review SOP; the staged review flow and severity-tagged feedback are reusable across repos.
## plugins/frontend-mobile-security/agents/frontend-security-coder.md
**Type**: Portable agent — frontend security coding and client-side hardening
**Portable**: Yes
**Reason**: The core guidance is reusable across web stacks: safe DOM APIs, XSS prevention, CSP, input validation, URL/redirect checks, and browser security features.
**Strip**: Repo-specific examples and implementation choices such as exact CSP directives, DOMPurify wiring, framework names, and component-specific code.
**Notes**: Strong candidate for a general frontend security SOP; the most reusable parts are the DOM-safety, sanitization, and browser-header patterns.

## plugins/frontend-mobile-security/agents/mobile-security-coder.md
**Type**: Portable agent — mobile security coding and platform hardening
**Portable**: Yes
**Reason**: The guidance transfers well across mobile stacks: secure storage, WebView controls, HTTPS/certificate validation, auth/session handling, permissions, and privacy-aware data handling.
**Strip**: Platform-specific API calls, keystore/keychain examples, exact WebView settings, and any framework-native code snippets.
**Notes**: Strong portable SOP candidate for mobile apps; the most reusable parts are the storage, network, and WebView security patterns.

## plugins/observability-monitoring/agents/observability-engineer.md
**Type**: Portable agent — observability design and production monitoring
**Portable**: Yes
**Reason**: The workflow is broadly reusable: define metrics, logs, traces, alerting, SLOs, incident response, and cost-aware telemetry pipelines independent of a specific vendor.
**Strip**: Vendor-specific product names, cloud-provider examples, dashboard/tool syntax, and any stack-specific deployment commands.
**Notes**: Strong candidate for a general observability SOP; the durable value is the monitoring strategy, SLO discipline, and incident workflow.

## plugins/database-design/agents/database-architect.md
**Type**: Portable agent — database architecture and data-model design
**Portable**: Yes
**Reason**: The core advice is platform-agnostic: choose the right storage model, design schemas and indexes from access patterns, plan migrations, and balance consistency, scale, and maintainability.
**Strip**: Product-specific database names in examples, ORM/framework snippets, cloud service references, and any repository-local path or migration-tool specifics.
**Notes**: Strong portable SOP candidate for data-layer design; the most reusable parts are technology selection, schema design, indexing, and zero-downtime migration planning.
## plugins/documentation-generation/agents/api-documenter.md
**Type**: Agent role — API documentation and developer-experience specialist
**Portable**: Yes
**Reason**: The guidance is largely generic documentation practice: OpenAPI-first writing, interactive docs, SDK generation, auth/security docs, testing examples, and maintenance workflows all transfer cleanly to other repos.
**Strip**: Product names, specific tooling examples, and any repo-specific portal/workflow assumptions; keep the docs-as-code and validation patterns.
**Notes**: Strong candidate for a reusable docs-agent SOP with only light adaptation to local documentation tooling.
## plugins/agent-orchestration/agents/context-manager.md
**Type**: Agent role — context engineering and multi-agent orchestration specialist
**Portable**: Yes
**Reason**: The core behaviors are framework-agnostic: assemble relevant context, manage memory/retrieval, route information across agents, and keep context fresh and bounded.
**Strip**: Vendor/tool examples, storage stack names, and any workspace-specific orchestration mechanics; preserve the context budgeting, retrieval, and handoff principles.
**Notes**: Best treated as a general context-management role prompt rather than a repo-specific implementation guide.
## plugins/backend-development/agents/backend-architect.md
**Type**: Agent role — backend architecture and API design specialist
**Portable**: Yes
**Reason**: The file expresses standard backend architecture concerns—service boundaries, API contracts, resilience, observability, security, caching, async processing, and deployment—that apply across most backend stacks.
**Strip**: Framework/vendor lists and any deferrals to adjacent specialist roles; retain the contract-first, simplicity, and observability-first guidance.
**Notes**: Strong portable architecture role prompt with broad applicability to REST/GraphQL/gRPC and distributed systems work.
## plugins/backend-development/agents/performance-engineer.md
**Type**: Agent role — feature performance profiling and optimization specialist
**Portable**: Yes
**Reason**: The guidance is generic performance review practice: profile hotspots, analyze DB/API/memory/concurrency costs, quantify impact, and recommend targeted optimizations with tradeoffs.
**Strip**: Any project-specific budgets or example tooling if they do not match the target stack; keep the impact classification and before/after optimization format.
**Notes**: Portable as a cross-stack performance-audit role; the output structure is especially reusable.
## plugins/backend-development/agents/graphql-architect.md
**Type**: Specialized agent prompt — GraphQL architecture, federation, optimization, and security
**Portable**: Partial
**Reason**: The schema design, performance, and security guidance is broadly useful, but the file is tightly centered on GraphQL concepts, federation tooling, and GraphQL-specific terminology.
**Strip**: Apollo/Fusion-specific tool names, federation-version references, and GraphQL implementation examples when adapting this into a more general API-architecture role.
**Notes**: Better treated as a domain specialist profile than a generic SOP.

## plugins/backend-development/agents/test-automator.md
**Type**: Portable SOP candidate — test design workflow and coverage planning
**Portable**: Yes
**Reason**: The core workflow is framework-agnostic: detect the test stack, analyze testable units, cover happy paths and edge cases, and report coverage gaps across unit, integration, and E2E layers.
**Strip**: Jest/pytest/Go-specific references, naming conventions, and any repo-specific output structure.
**Notes**: Strong reusable testing protocol; the TDD/BDD framing transfers cleanly across stacks.

## plugins/backend-development/agents/temporal-python-pro.md
**Type**: Specialized workflow-engineering prompt — Temporal Python orchestration and determinism
**Portable**: Partial
**Reason**: The orchestration and durable-process guidance is valuable, but the file is anchored to Temporal Python SDK primitives, workflow semantics, and Temporal-specific testing/deployment patterns.
**Strip**: Decorators, SDK API names, time-skipping environment details, and Temporal lifecycle terminology when generalizing.
**Notes**: Excellent specialist role definition; the most reusable ideas are determinism, idempotency, retries, and compensation.

## plugins/backend-api-security/agents/backend-security-coder.md
**Type**: Portable SOP candidate — secure backend coding and API hardening
**Portable**: Yes
**Reason**: The guidance covers universal backend security practices: validation, parameterized queries, authn/authz, CSRF/CORS, secure headers, SSRF prevention, logging hygiene, and secrets handling.
**Strip**: Framework/library-specific code snippets and product-specific deployment examples.
**Notes**: Strong reusable security protocol with broad applicability across backend stacks.
## plugins/database-design/agents/sql-pro.md
**Type**: Role agent — advanced SQL performance and database design specialist
**Portable**: Yes
**Reason**: The guidance is broadly reusable SQL expertise: query optimization, schema design, indexing, transaction handling, and cloud/OLTP-OLAP reasoning. Most of the file is a generic professional persona with vendor examples layered on top.
**Strip**: Vendor/product lists, cloud platform examples, and example prompts should be normalized to the target database stack; keep the optimization, modeling, and validation workflow intact.
**Notes**: Strong portable expert role for database analysis, tuning, and schema work.

## plugins/database-migrations/agents/database-admin.md
**Type**: Role agent — cloud database administration and reliability specialist
**Portable**: Yes
**Reason**: The core content is transferable DBA operating guidance: provisioning, HA/DR, monitoring, backups, automation, security, and cost optimization across cloud databases.
**Strip**: Cloud-provider catalogs, product-name enumerations, and tooling examples should be adapted to the local platform; retain the operational runbook mindset and incident/maintenance checklist.
**Notes**: Good portable ops persona for database administration and resilience work.

## plugins/database-cloud-optimization/agents/database-optimizer.md
**Type**: Role agent — database performance and scaling specialist
**Portable**: Yes
**Reason**: The file centers on universal optimization practices: execution-plan analysis, indexing, caching, partitioning, N+1 detection, benchmarking, and capacity planning. The stack-specific examples are illustrative rather than essential.
**Strip**: Specific database brands, APM tools, and benchmark names should be generalized if the target environment differs; preserve the evidence-first tuning workflow.
**Notes**: Strong portable optimization role for performance investigations and scaling design.

## plugins/cicd-automation/agents/devops-troubleshooter.md
**Type**: Role agent — incident response and observability specialist
**Portable**: Yes
**Reason**: The guidance is broadly reusable troubleshooting SOP material: gather logs/metrics/traces, form hypotheses, test with minimal impact, restore service, and add monitoring plus postmortem follow-up.
**Strip**: Tool/vendor examples, cloud-platform names, and container/platform specifics should be swapped for the local observability stack; keep the diagnosis and mitigation workflow.
**Notes**: Strong portable incident-response persona for debugging, triage, and reliability work.
## plugins/cloud-infrastructure/agents/network-engineer.md
**Type**: Portable agent role
**Portable**: Yes
**Reason**: The role logic is broadly reusable: cloud networking, zero-trust, DNS, TLS, load balancing, and layered troubleshooting are universal concerns even though the service catalog is vendor-specific.
**Strip**: Provider/service enumerations (AWS/Azure/GCP/OCI), product lists, and the exact tool examples should become local equivalents or examples.
**Notes**: Keep the systematic response flow, security-first posture, and connectivity/performance troubleshooting patterns.
## plugins/cloud-infrastructure/agents/hybrid-cloud-architect.md
**Type**: Portable agent role
**Portable**: Yes
**Reason**: Hybrid/multi-cloud architecture guidance, workload placement, DR, FinOps, and IaC patterns transfer well across environments despite the heavy platform-specific inventory.
**Strip**: Cloud brand checklists, OpenStack/VMware product names, and specific service examples should be generalized to the adopting stack.
**Notes**: Preserve the decision framework for placement, security, automation, observability, and disaster recovery.
## plugins/cloud-infrastructure/agents/service-mesh-expert.md
**Type**: Portable agent role
**Portable**: Yes
**Reason**: The core mesh workflow—assess topology, apply mTLS and authorization, tune traffic policy, validate observability, and test resilience—is reusable across service-mesh implementations.
**Strip**: Istio/Linkerd-specific terminology, API objects, and deployment details should be abstracted to generic mesh concepts where possible.
**Notes**: Strong portable kernel around traffic management, security policy, and progressive delivery.
## plugins/distributed-debugging/agents/devops-troubleshooter.md
**Type**: Portable agent role
**Portable**: Yes
**Reason**: The debugging method is universal: gather evidence from logs/metrics/traces, form hypotheses, test minimally, restore service, and follow with durable fixes and monitoring.
**Strip**: Vendor observability tool names, cloud-specific service references, and command examples should be reduced to stack-agnostic placeholders.
**Notes**: Retain the incident-response mindset, root-cause discipline, and follow-through on runbooks/monitoring.
## plugins/cloud-infrastructure/agents/cloud-architect.md
**Type**: Agent role definition — cloud architecture advisory prompt
**Portable**: Yes
**Reason**: The decision framework is reusable across cloud stacks: assess scalability, cost, security, compliance, resilience, and IaC before recommending services.
**Strip**: Provider-specific service catalogs, named cloud products, and example architectures tied to AWS/Azure/GCP/OCI.
**Notes**: Strong generalized cloud-architecture role; keep the evaluation rubric, swap the service examples.

## plugins/cloud-infrastructure/agents/deployment-engineer.md
**Type**: Agent role definition — CI/CD and deployment automation prompt
**Portable**: Yes
**Reason**: The core workflow applies broadly: design pipelines, add quality/security gates, support progressive delivery, and optimize for developer experience.
**Strip**: Vendor-specific CI/CD platform names, deployment tool examples, and environment tooling references that are implementation details.
**Notes**: Good candidate for a cross-platform deployment-engineering SOP.

## plugins/cloud-infrastructure/agents/kubernetes-architect.md
**Type**: Agent role definition — Kubernetes and cloud-native platform prompt
**Portable**: Yes
**Reason**: The guidance is mostly Kubernetes-native and transferable: cluster design, GitOps, security, observability, multi-tenancy, and scaling patterns.
**Strip**: Managed-cluster brand names, vendor-specific networking/identity details, and example tooling lists that should map to local equivalents.
**Notes**: Highly reusable as a platform-architecture role with only provider-specific substitutions.

## plugins/cloud-infrastructure/agents/terraform-specialist.md
**Type**: Agent role definition — Terraform/OpenTofu IaC prompt
**Portable**: Yes
**Reason**: The module/state/testing/governance workflow is broadly reusable across IaC stacks, with only provider and backend examples needing adaptation.
**Strip**: Specific backend/provider names, cloud-product examples, and tooling references that depend on the chosen IaC ecosystem.
**Notes**: Strong portable IaC specialist role; the state-management and module-design practices are the most reusable parts.
## plugins/tdd-workflows/agents/tdd-orchestrator.md
**Type**: Portable SOP candidate — TDD orchestration, test-suite governance, and refactoring safety workflow
**Portable**: Yes
**Reason**: The core guidance is reusable across teams: enforce red-green-refactor discipline, coordinate unit/integration/E2E testing work, track quality gates and metrics, and preserve refactoring safety nets.
**Strip**: Language/framework examples, AI-assisted test-generation specifics, and multi-agent terminology should be generalized to the host workflow and toolchain.
**Notes**: Strong reusable process pattern, especially the test-first enforcement and cross-team test-suite coordination.

## plugins/ui-design/agents/accessibility-expert.md
**Type**: Role definition / SOP candidate — accessibility audit, remediation, and inclusive-design workflow
**Portable**: Yes
**Reason**: WCAG compliance, keyboard/focus handling, screen-reader compatibility, color contrast, and manual/automated testing are broadly reusable accessibility practices.
**Strip**: Jurisdiction-specific standards references and tool names should be adapted to the local compliance context and test stack.
**Notes**: The most portable value is the practical remediation and validation checklist, not the standard names themselves.

## plugins/ui-design/agents/design-system-architect.md
**Type**: Portable SOP candidate — design tokens, component architecture, theming, and design-system governance
**Portable**: Yes
**Reason**: Token taxonomies, component API design, multi-brand theming, documentation, and governance patterns transfer well across design systems.
**Strip**: Specific tooling references (Style Dictionary, Tokens Studio, Storybook, Chromatic) and platform output examples should be generalized.
**Notes**: Strong portable core around token structure and scalable theming infrastructure.

## plugins/multi-platform-apps/agents/ui-ux-designer.md
**Type**: Role definition / SOP candidate — user research, accessible interface design, and cross-platform UX workflow
**Portable**: Yes
**Reason**: User-centered design, accessibility-first planning, information architecture, interaction design, and design-system collaboration are widely applicable across products.
**Strip**: Platform-specific examples and tool references should be converted to the target product’s conventions and design stack.
**Notes**: Portable as a high-level UX role profile; strongest reusable elements are research, IA, and inclusive design guidance.
## plugins/incident-response/agents/incident-responder.md
**Type**: Portable SOP candidate — incident response command, stabilization, communication, and postmortem workflow
**Portable**: Yes
**Reason**: The core flow is broadly reusable: assess impact, establish incident roles, stabilize service, investigate with observability data, communicate on a cadence, and document a blameless postmortem.
**Strip**: Vendor/tool names, exact severity SLAs, and example channel/platform references should be generalized to the host team’s incident process.
**Notes**: Strong portable incident-response playbook; keep the command structure, communication cadence, and recovery validation, but localize the tooling and escalation policy.
## plugins/plugin-eval/agents/eval-orchestrator.md
**Type**: Repo-specific orchestrator — plugin evaluation coordinator
**Portable**: No
**Reason**: This agent is tightly coupled to the plugin-eval CLI, hard-coded scoring flow, and `eval-judge` dispatch, so it is mainly an execution controller rather than a reusable SOP.
**Strip**: `CLAUDE_PLUGIN_ROOT`, `uv run plugin-eval score`, the weight table, and the final-composite math should be treated as implementation details.
**Notes**: Useful as a local orchestration template, but too workflow- and tool-specific to lift as-is into another repo.
## plugins/plugin-eval/agents/eval-judge.md
**Type**: Portable worker rubric — LLM-based skill quality judge
**Portable**: Yes
**Reason**: The evaluation pattern is reusable: inspect a skill spec, test trigger coverage, score output quality and scope, and return structured JSON with brief reasoning.
**Strip**: The plugin-quality framing, the exact four dimensions, and the required JSON field names should be adapted to the host rubric if reused elsewhere.
**Notes**: Portable as a review/judging worker, though it should stay a worker and not take on orchestration responsibilities.
## plugins/security-scanning/agents/threat-modeling-expert.md
**Type**: Portable SOP candidate — threat modeling and security architecture review workflow
**Portable**: Yes
**Reason**: STRIDE-style threat analysis, trust-boundary mapping, attack trees, risk prioritization, and mitigation design are all broadly reusable security practices.
**Strip**: The skill name, section headings, and any implied security-doc format should be normalized to the target organization’s threat-model template.
**Notes**: Strong portable security-analysis block; the workflow is general enough to reuse across products, with only the reporting format needing localization.
## plugins/machine-learning-ops/agents/ml-engineer.md
**Type**: Agent profile — production ML engineering
**Portable**: Yes
**Reason**: The role centers on common ML engineering practices: model serving, feature engineering, monitoring, testing, and deployment across standard ML frameworks and cloud platforms.
**Notes**: Good portable SOP source for end-to-end ML production work; most value is in the lifecycle and reliability guidance rather than any single tool.

## plugins/machine-learning-ops/agents/mlops-engineer.md
**Type**: Agent profile — MLOps / ML infrastructure
**Portable**: Yes
**Reason**: The guidance is broadly reusable across teams that run ML pipelines: orchestration, experiment tracking, registries, deployment automation, observability, and IaC.
**Notes**: Strong candidate for a portable MLOps SOP; cloud/vendor examples should be abstracted to the local stack.

## plugins/machine-learning-ops/agents/data-scientist.md
**Type**: Agent profile — data science and analytics
**Portable**: Yes
**Reason**: The file describes a standard data science workflow covering statistics, EDA, modeling, visualization, experimentation, and production handoff.
**Notes**: Portable as a general data-science role definition; especially reusable are the analytical method choices and communication checklist.

## plugins/payment-processing/agents/payment-integration.md
**Type**: Agent profile — payment integration and compliance
**Portable**: Yes
**Reason**: The core practices are universal for payment work: official SDK usage, webhook verification, idempotency, server-side validation, and PCI-safe handling.
**Notes**: Highly reusable for any checkout or billing implementation; provider-specific details should be stripped down to the security and reliability contract.
## plugins/c4-architecture/agents/c4-container.md
**Type**: Portable SOP candidate — C4 container synthesis, API/interface documentation, and deployment mapping
**Portable**: Yes
**Reason**: The workflow is broadly reusable across architecture docs: map components into deployable containers, document inter-container relationships, and publish API contracts/diagrams. The instructions rely on generic C4 concepts and standard artifacts like OpenAPI, Docker, and Kubernetes rather than repo-specific mechanics.
**Notes**: Strong portable pattern for system/deployment documentation. The only local detail to strip is the file-naming convention for the C4 doc set; the container/interface/diagram structure itself transfers cleanly.
## plugins/c4-architecture/agents/c4-component.md
**Type**: Portable SOP candidate — C4 component synthesis, interface definition, and relationship mapping
**Portable**: Yes
**Reason**: The core method is domain-agnostic: group code-level artifacts into cohesive components, define interfaces and dependencies, and express the result with C4 component diagrams. Nothing depends on wshobson-agents-specific paths or tools beyond the generic C4 file hierarchy.
**Notes**: Highly reusable as a component-documentation pattern. The strongest portable pieces are the boundary-identification workflow and the component relationship/diagram template.
## plugins/c4-architecture/agents/c4-code.md
**Type**: Portable SOP candidate — C4 code-level documentation for modules, functions, and dependencies
**Portable**: Yes
**Reason**: The guidance is generic code-structure documentation: extract signatures, map dependencies, describe responsibilities, and diagram internal relationships. It applies across languages and frameworks, with only the example syntax and diagram choices needing adaptation.
**Notes**: Good portable foundation for code inventory and architecture drills. The language examples are illustrative; the durable SOP is the “document code elements and dependencies completely” rule.
## plugins/accessibility-compliance/agents/ui-visual-validator.md
**Type**: Portable SOP candidate — visual UI validation, design-system compliance, and accessibility verification
**Portable**: Yes
**Reason**: The workflow is reusable in any UI stack: inspect visual evidence objectively, compare against goals, verify responsiveness/accessibility, and require concrete proof before declaring success. The tool references are examples, but the validation method is broadly applicable.
**Notes**: Strong portable QA protocol. The most reusable elements are the skeptical evidence-first review process and the accessibility checklist; the specific visual-testing tools can be swapped for the local stack.
## plugins/reverse-engineering/agents/reverse-engineer.md
**Type**: Domain-locked specialist — reverse engineering | **Portable**: No | **Reason**: Deeply centered on binary analysis, disassembly/decompilation toolchains, and authorized security research workflows. | **Notes**: Valuable as an expert role, but the content is subject-matter knowledge rather than a reusable cross-domain SOP.

## plugins/reverse-engineering/agents/malware-analyst.md
**Type**: Domain-locked specialist — malware analysis | **Portable**: No | **Reason**: Focuses on defensive malware triage, IOC extraction, sandboxing, and threat-intel workflows that are specific to security analysis. | **Notes**: Strong niche guidance, but not portable outside the malware/incident-response domain.

## plugins/reverse-engineering/agents/firmware-analyst.md
**Type**: Domain-locked specialist — firmware and embedded security | **Portable**: No | **Reason**: Anchored in firmware extraction, embedded architectures, hardware interfaces, and device-security assessment practices. | **Notes**: Best treated as a specialist role; the workflow does not generalize cleanly beyond embedded/IoT analysis.

## plugins/c4-architecture/agents/c4-context.md
**Type**: Portable SOP candidate — C4 context-level documentation workflow | **Portable**: Yes | **Reason**: The high-level pattern of identifying personas, system boundaries, external dependencies, and user journeys is reusable across projects. | **Notes**: Strip the C4-specific syntax and keep the stakeholder-friendly context modeling, diagramming, and documentation structure.
## plugins/startup-business-analyst/agents/startup-analyst.md
**Type**: Domain-specific persona agent. **Portable**: No. **Reason**: Startup market sizing, financial modeling, and investor strategy guidance are valuable but tied to an early-stage business-analysis role rather than a reusable SOP. **Notes**: Best treated as a capability profile for startup advisory work.

## plugins/llm-application-dev/agents/prompt-engineer.md
**Type**: Tech-specific persona agent. **Portable**: No. **Reason**: The file defines an LLM prompt-optimization persona with strong meta-prompting expertise, but it is still a role spec rather than a transferable operating procedure. **Notes**: Most reusable elements are the prompt-display contract and evaluation checklist.

## plugins/llm-application-dev/agents/vector-database-engineer.md
**Type**: Tech-specific persona agent. **Portable**: No. **Reason**: The content is a vector-search specialist role centered on embeddings, indexing, and retrieval tuning, so it is domain expertise rather than a portable SOP. **Notes**: Reuse only the high-level retrieval workflow when converting into a process doc.

## plugins/llm-application-dev/agents/ai-engineer.md
**Type**: Tech-specific persona agent. **Portable**: No. **Reason**: This is a broad AI-application engineer persona covering LLMs, RAG, agents, and ops; it is useful as a job profile, not as a reusable procedure. **Notes**: The most transferable parts are the production-reliability and safety emphases.
## plugins/javascript-typescript/agents/javascript-pro.md
**Type**: Language-specific persona
**Portable**: Yes
**Reason**: Modern JavaScript, async patterns, Node/browser compatibility, and JSDoc guidance are broadly reusable.
**Notes**: Single-line persona; keep the advice tool-agnostic and strip repo-specific framing.
## plugins/javascript-typescript/agents/typescript-pro.md
**Type**: Language-specific persona
**Portable**: Yes
**Reason**: Advanced typing, strict config, generics, and TSDoc practices transfer cleanly across TypeScript projects.
**Notes**: Single-line persona; preserve the typing guidance and generalize any framework examples.
## plugins/python-development/agents/python-pro.md
**Type**: Language-specific persona
**Portable**: Yes
**Reason**: Modern Python 3.12+, async, tooling, testing, and production practices are broadly applicable.
**Notes**: Single-line persona; keep the current-ecosystem emphasis but remove any workspace-specific assumptions.
## plugins/python-development/agents/fastapi-pro.md
**Type**: Language-specific persona
**Portable**: Yes
**Reason**: FastAPI async-first API design, Pydantic, SQLAlchemy, testing, and deployment guidance are reusable across API projects.
**Notes**: Single-line persona; retain the API architecture patterns and generalize the concrete library versions where needed.
## plugins/systems-programming/agents/rust-pro.md
**Type**: Language-specialist agent prompt — modern Rust systems programming
**Portable**: Yes
**Reason**: The prompt is self-contained and repo-agnostic: it defines a reusable Rust expert role, focuses on standard language/system topics, and does not depend on workspace-specific paths or tooling.
**Notes**: Strong reusable role template; the Rust version and ecosystem examples are helpful defaults, but they can be tuned for the target project.
## plugins/systems-programming/agents/c-pro.md
**Type**: Language-specialist agent prompt — C systems programming
**Portable**: Yes
**Reason**: The prompt is generic across C projects: it centers on memory ownership, POSIX/system calls, profiling, and testing without any repository-specific assumptions.
**Notes**: Very portable as a concise expert-role definition; only the example toolchain and test-library suggestions are stack choices.
## plugins/systems-programming/agents/golang-pro.md
**Type**: Language-specialist agent prompt — modern Go development
**Portable**: Yes
**Reason**: The agent role is broadly reusable for Go codebases and stays at the level of standard concurrency, architecture, testing, and deployment guidance rather than project-local procedures.
**Notes**: Good general-purpose Go expert prompt; Go 1.21+ and ecosystem references are current but not tightly coupled to one repo.
## plugins/jvm-languages/agents/java-pro.md
**Type**: Language-specialist agent prompt — modern Java/JVM development
**Portable**: Yes
**Reason**: The prompt is a clean, reusable Java expert profile covering modern JVM features, Spring, testing, and deployment patterns with no workspace-specific dependencies.
**Notes**: Strong portable role prompt; Java 21+, Spring Boot 3.x, and GraalVM references are sensible defaults for contemporary JVM work.
## plugins/jvm-languages/agents/scala-pro.md
**Type**: Specialist agent prompt — Scala / JVM functional and distributed systems
**Portable**: Yes
**Reason**: The structure is repo-agnostic and the guidance is framed as reusable Scala engineering capability, not project-specific workflow.
**Notes**: Strong baseline prompt for Scala work; keep the language-specific depth, but the repeated enterprise-pattern and quality guidance could be tightened.
## plugins/jvm-languages/agents/csharp-pro.md
**Type**: Specialist agent prompt — modern C# / .NET engineering
**Portable**: Yes
**Reason**: The file is a generic C# role definition with broad .NET focus areas and no repo-local coupling.
**Notes**: Solid portable role prompt; concise and reusable as-is, with only minor trimming possible around duplicated best-practice phrasing.
## plugins/functional-programming/agents/haskell-pro.md
**Type**: Specialist agent prompt — Haskell / pure functional engineering
**Portable**: Yes
**Reason**: The guidance is language-specific but otherwise self-contained and independent of repository structure or tooling.
**Notes**: Good reusable Haskell role prompt; the advice is clear, practical, and not tied to local project conventions.
## plugins/functional-programming/agents/elixir-pro.md
**Type**: Specialist agent prompt — Elixir / OTP and BEAM systems
**Portable**: Yes
**Reason**: The content is a general Elixir expertise profile with no workspace-specific references or command wiring.
**Notes**: Strong role prompt for Elixir-focused work; the OTP/fault-tolerance emphasis is especially portable across teams.
## plugins/python-development/agents/django-pro.md
**Type**: Language-specific agent persona — Django 5.x/Python web expert with DRF, Celery, Channels, and deployment guidance.
**Portable**: No
**Reason**: The guidance is tightly coupled to the Django ecosystem and Python web stack, so it reads as a framework persona rather than a transferable SOP.
**Notes**: Strong reference for Django work, but the concrete framework, library, and deployment recommendations should stay Python/Django-specific.
## plugins/shell-scripting/agents/posix-shell-pro.md
**Type**: Language-specific agent persona — strict POSIX sh specialist focused on portable Unix shell scripting.
**Portable**: No
**Reason**: The content is highly specialized to POSIX shell semantics, portability constraints, and shell tooling, so it is best treated as a shell-specific persona.
**Notes**: Excellent baseline for portable shell work; keep the POSIX rules intact and avoid broadening it into a generic scripting SOP.
## plugins/shell-scripting/agents/bash-pro.md
**Type**: Language-specific agent persona — defensive Bash specialist for production automation and CI/CD.
**Portable**: No
**Reason**: The guidance is anchored in Bash-only features, Bash versioning, and Bash tooling, which makes it a language persona rather than a cross-language SOP.
**Notes**: Useful as a Bash playbook, but the Bash-specific affordances and examples should remain clearly scoped to Bash.
## plugins/systems-programming/agents/cpp-pro.md
**Type**: Language-specific agent persona — modern C++ expert covering RAII, templates, concurrency, and performance.
**Portable**: No
**Reason**: The advice is intrinsically C++-centric, with modern language standards, STL, and build-tool expectations that do not generalize cleanly into a portable process.
**Notes**: Keep this as a C++ persona; the strongest reusable ideas are style and safety principles, not a stack-agnostic SOP.

## plugins/multi-platform-apps/agents/mobile-developer.md
**Type**: Agent prompt — mobile specialist role definition
**Portable**: Yes
**Reason**: The prompt is mostly reusable mobile expertise across React Native, Flutter, and native iOS/Android, with broad coverage of architecture, performance, testing, deployment, and security.
**Notes**: Strong portable role prompt; keep the platform/version examples and tune the app-store/tooling references to the target workspace.

## plugins/multi-platform-apps/agents/frontend-developer.md
**Type**: Agent prompt — frontend specialist role definition
**Portable**: Yes
**Reason**: The guidance is broadly applicable to modern React/Next.js work and centers on reusable practices like component architecture, data fetching, performance, accessibility, and testing.
**Notes**: High portability; only the React/Next.js version references and tool examples need local adaptation.

## plugins/hr-legal-compliance/agents/hr-pro.md
**Type**: Agent prompt — HR policy and people-ops assistant
**Portable**: Yes
**Reason**: The core workflow is reusable across orgs: structured HR deliverables, jurisdiction-aware questions, bias mitigation, and compliance-first policy drafting.
**Notes**: Preserve the disclaimer and location-specific guardrails; adapt any labor-law specifics to the operating jurisdiction.

## plugins/hr-legal-compliance/agents/legal-advisor.md
**Type**: Agent prompt — legal/compliance drafting assistant
**Portable**: Yes
**Reason**: The document patterns are generic legal drafting workflows for privacy, terms, cookie policies, DPAs, and compliance checklists, with placeholder-driven structure.
**Notes**: Keep the attorney-disclaimer and jurisdiction review step intact; only the regulation references and clause details need tailoring.
## plugins/quantitative-trading/agents/quant-analyst.md
**Type**: Portable SOP candidate — quantitative analysis, strategy research, backtesting, and risk metrics
**Portable**: Yes
**Reason**: The core workflow is broadly reusable in any data-driven modeling environment: validate inputs, test strategies with realistic assumptions, compare out-of-sample results, and evaluate risk-adjusted performance before production use. The finance-specific examples are domain details, but the research discipline and evaluation loop transfer cleanly.
**Notes**: Strong candidate for a general “analysis and backtesting” SOP. Keep the market-microstructure assumptions and metric examples as optional domain appendices.
## plugins/quantitative-trading/agents/risk-manager.md
**Type**: Portable SOP candidate — portfolio risk measurement, position sizing, expectancy, and hedging workflow
**Portable**: Yes
**Reason**: The underlying method is domain-agnostic: define loss in a consistent unit, size exposure from account risk, monitor correlations, stress test scenarios, and enforce limits systematically. The R-multiple framing is especially reusable as a simple universal risk vocabulary.
**Notes**: Strong reusable risk-management pattern. The concrete outputs (spreadsheet, dashboard, hedge examples) are implementation details; the risk-per-trade and expectancy rules are the durable core.
## plugins/content-marketing/agents/content-marketer.md
**Type**: Portable SOP candidate — content strategy, distribution, SEO, and performance optimization workflow
**Portable**: Yes
**Reason**: The planning loop is widely reusable across marketing teams: define audience and goals, research gaps, create structured content, distribute across channels, measure results, and iterate based on data. The named tools and 2024/2025 platform claims are specific, but the strategy and optimization process is general.
**Notes**: Best distilled into a cross-channel content strategy SOP with optional channel/tool appendices. The strongest portable pieces are the audience-first planning, measurement, and repurposing workflow.
## plugins/content-marketing/agents/search-specialist.md
**Type**: Portable SOP candidate — web research, query design, source verification, and synthesis workflow
**Portable**: Yes
**Reason**: The core research loop is general-purpose: formulate query variants, filter for trusted sources, extract evidence, cross-check claims, and synthesize findings with credibility notes. It does not depend on repo-specific paths or tooling.
**Notes**: Strong portable SOP candidate for any research role. The direct-quote requirement and multi-source verification guidance are especially reusable.
## plugins/web-scripting/agents/ruby-pro.md
**Type**: Language specialist / coding agent role
**Portable**: Yes
**Reason**: Focuses on idiomatic Ruby, Rails conventions, testing, metaprogramming, and performance practices that transfer cleanly across Ruby projects.
**Notes**: Strong Ruby ecosystem SOP candidate; language-bound, but the maintainability and optimization guidance is broadly reusable within Ruby teams.

## plugins/web-scripting/agents/php-pro.md
**Type**: Language specialist / coding agent role
**Portable**: Yes
**Reason**: Centers on modern PHP 8+ patterns, generators, SPL structures, strict typing, and PSR conventions that apply across PHP codebases.
**Notes**: Strong PHP SOP candidate; mostly ecosystem-specific, but the performance and architecture habits are transferable.

## plugins/julia-development/agents/julia-pro.md
**Type**: Language specialist / coding agent role
**Portable**: Yes
**Reason**: Covers Julia 1.10+ best practices, type stability, multiple dispatch, testing, packaging, and performance tooling in a way that generalizes across Julia projects.
**Notes**: Very strong Julia-specific SOP candidate; the recommendations are ecosystem-bound but widely reusable inside Julia work.

## plugins/arm-cortex-microcontrollers/agents/arm-cortex-expert.md
**Type**: Embedded systems specialist / platform-specific coding agent role
**Portable**: No
**Reason**: The guidance is tightly tied to ARM Cortex-M firmware, vendor peripherals, memory barriers, DMA/cache coherency, and MCU-specific safety constraints.
**Notes**: Highly valuable within embedded ARM work, but the hardware assumptions and register-level advice do not generalize well beyond Cortex-M platforms.

## plugins/game-development/agents/minecraft-bukkit-pro.md
**Type**: Domain expert agent role — Minecraft Bukkit/Spigot/Paper plugin development
**Portable**: Partially
**Reason**: The file is heavily tied to Minecraft server APIs, but the process guidance around event-driven design, performance profiling, version awareness, and test-first implementation transfers well.
**Notes**: Best used as a domain-specialist prompt; the reusable value is in the engineering habits more than the API specifics.

## plugins/game-development/agents/unity-developer.md
**Type**: Domain expert agent role — Unity game development
**Portable**: Partially
**Reason**: Most content is Unity-specific, yet the architecture, profiling, testing, and cross-platform optimization practices are broadly reusable.
**Notes**: Strong as a specialty prompt; portable themes are performance discipline, modular architecture, and deployment awareness.

## plugins/multi-platform-apps/agents/flutter-expert.md
**Type**: Domain expert agent role — Flutter multi-platform app development
**Portable**: Partially
**Reason**: The prompt is centered on Flutter/Dart APIs, but its emphasis on clean architecture, accessibility, testing, and platform-aware optimization generalizes well.
**Notes**: Reusable as a cross-platform engineering template, with Flutter-specific implementation details stripped out.

## plugins/multi-platform-apps/agents/ios-developer.md
**Type**: Domain expert agent role — native iOS app development
**Portable**: Partially
**Reason**: The guidance is Apple-platform specific, but the architecture, performance, testing, security, and accessibility practices translate to other native app work.
**Notes**: Best kept as an iOS specialist prompt; the transferable value is in SwiftUI-first design, test discipline, and production readiness.
## plugins/code-documentation/agents/code-reviewer.md
**Type**: Portable
**Reason**: The review scope, security/performance focus, and structured feedback process are generic and transferable across codebases.
**Notes**: Keep the modern tools and language examples as optional examples; the core review checklist is reusable as-is.

## plugins/code-documentation/agents/docs-architect.md
**Type**: Portable
**Reason**: The documentation workflow, section structure, and emphasis on rationale over codebase specifics apply broadly to technical writing tasks.
**Notes**: The “10-100+ pages” guidance and markdown output format are presentation preferences, not repo coupling.

## plugins/code-documentation/agents/tutorial-engineer.md
**Type**: Portable
**Reason**: The learning-objective, progressive-disclosure, and hands-on exercise workflow is general-purpose instructional design.
**Notes**: The tutorial templates and example exercise types can be adapted to any domain with minimal change.

## plugins/data-engineering/agents/data-engineer.md
**Type**: Portable
**Reason**: The data architecture, pipeline, quality, governance, and optimization guidance is technology-agnostic at the workflow level.
**Notes**: Vendor stack lists are illustrative; the core operating model transfers across cloud and on-prem data platforms.
## plugins/application-performance/agents/frontend-developer.md
**Type**: Agent prompt — frontend specialist role definition
**Portable**: Yes
**Reason**: The prompt centers on reusable frontend practices: React/Next.js architecture, performance, accessibility, state management, and testing.
**Notes**: Strong portable role prompt; the React/Next.js version references and tool examples can be adapted to the target stack.

## plugins/application-performance/agents/performance-engineer.md
**Type**: Agent prompt — application performance profiling and optimization specialist
**Portable**: Yes
**Reason**: The guidance is broadly reusable performance work: baseline measurement, profiling, bottleneck analysis, caching, load testing, and validation.
**Notes**: Strong portable performance-audit role; keep the measurement-first workflow and impact-oriented optimization format.

## plugins/application-performance/agents/observability-engineer.md
**Type**: Agent prompt — observability design and production monitoring specialist
**Portable**: Yes
**Reason**: The workflow is domain-agnostic observability practice: metrics, logs, traces, alerting, SLOs, incident response, and cost-aware telemetry.
**Notes**: Strong candidate for a general observability SOP; vendor names and deployment specifics are the main items to localize.

## plugins/debugging-toolkit/agents/dx-optimizer.md
**Type**: Agent prompt — developer experience optimization specialist
**Portable**: Yes
**Reason**: The prompt is a general DX role: reduce friction, automate repetitive work, improve setup, workflows, tooling, and documentation.
**Notes**: Portable as a workflow-improvement role; adapt the concrete scripts, hooks, and IDE settings to the local repository.
## plugins/business-analytics/agents/business-analyst.md
**Type**: Agent role prompt / persona spec
**Portable**: No
**Reason**: This is a broad specialist profile with capability lists and response guidance, but it is not a concrete SOP or reusable workflow.
**Notes**: Useful as a role template for analytics-focused agents; the most reusable ideas are the high-level capability areas, not the prose itself.

## plugins/customer-sales-automation/agents/customer-support.md
**Type**: Agent role prompt / persona spec
**Portable**: No
**Reason**: The file describes a support specialist persona with domain coverage and response style, but it does not define a transferable procedure or operating contract.
**Notes**: Strong as a support-agent seed prompt; the reusable parts are the empathy-first posture and the support capability taxonomy.

## plugins/customer-sales-automation/agents/sales-automator.md
**Type**: Agent role prompt / persona spec
**Portable**: No
**Reason**: This is a concise sales assistant persona focused on outreach copy and follow-ups, with no stepwise SOP beyond a short writing approach.
**Notes**: Portable at the level of sales-writing goals and output types, but not as a formal workflow.

## plugins/context-management/agents/context-manager.md
**Type**: Agent role prompt / persona spec
**Portable**: No
**Reason**: The file is an orchestration-focused context-engineering persona with broad capability lists, but it is still framed as a role description rather than a reusable procedure.
**Notes**: The context-routing and memory-management sections hint at reusable patterns, but the overall file is too general and persona-driven for direct SOP extraction.
## plugins/data-engineering/agents/backend-architect.md
**Type**: Agent role — backend architecture and API design
**Portable**: Yes
**Reason**: The guidance is broad and framework-agnostic: API design, microservices boundaries, resilience, observability, security, and async processing patterns all transfer cleanly across backend projects.
**Notes**: Strong portable candidate; only the example technologies and vendor lists need light local tailoring.

## plugins/api-scaffolding/agents/backend-architect.md
**Type**: Agent role — backend architecture and API design
**Portable**: Yes
**Reason**: This is the same reusable backend-architect guidance, centered on generic service design, contract definition, fault tolerance, and monitoring rather than repo-specific implementation details.
**Notes**: Strong portable candidate; the stack examples are illustrative and easy to generalize.

## plugins/api-scaffolding/agents/fastapi-pro.md
**Type**: Agent role — FastAPI/Python backend specialist
**Portable**: No
**Reason**: The file is tightly coupled to FastAPI, Pydantic V2, SQLAlchemy 2.0, pytest, and Python async conventions, so the core value is stack-specific rather than broadly reusable.
**Notes**: Portable at the concept level (async-first APIs, validation, testing, observability), but not as a general SOP without significant adaptation.

## plugins/api-scaffolding/agents/graphql-architect.md
**Type**: Agent role — GraphQL architecture and performance specialist
**Portable**: Yes
**Reason**: The guidance is GraphQL-specific but still reusable across GraphQL codebases: schema design, federation, resolver performance, security, subscriptions, and tooling patterns are all broadly applicable.
**Notes**: Portable within the GraphQL ecosystem; the most reusable pieces are schema evolution, caching, and query-optimization practices.
## plugins/seo-content-creation/agents/seo-content-auditor.md
**Type**: Agent — SEO content audit role
**Portable**: Yes
**Reason**: The review checklist is generic SEO guidance: assess depth, E-E-A-T, readability, keyword use, structure, trust, and unique value, then return a scored recommendations table.
**Notes**: Strong candidate for reuse in any content QA workflow; only the exact output format and model choice are repo-specific.
## plugins/seo-content-creation/agents/seo-content-writer.md
**Type**: Agent — SEO content generation role
**Portable**: Yes
**Reason**: The writing framework is broadly reusable: build an outline, draft scannable sections, weave keywords naturally, include E-E-A-T signals, and finish with summary, CTA, metadata, and FAQ assets.
**Notes**: High-value portable pattern for human-first SEO drafting; the keyword-density target and content package fields are implementation details.
## plugins/seo-analysis-monitoring/agents/seo-cannibalization-detector.md
**Type**: Agent — SEO overlap and cannibalization analysis role
**Portable**: Yes
**Reason**: The analysis flow is generic across sites: compare pages for keyword overlap, intent conflicts, duplicate structure, and consolidation opportunities, then recommend differentiation or canonical fixes.
**Notes**: Strong reusable SOP for content audits; the report template and mitigation tactics transfer cleanly to other publishing systems.
## plugins/seo-analysis-monitoring/agents/seo-authority-builder.md
**Type**: Agent — E-E-A-T and authority-building analysis role
**Portable**: Yes
**Reason**: The guidance is broadly applicable SEO practice: inspect experience, expertise, authority, and trust signals, then propose concrete improvements like bios, citations, schema, and topical clusters.
**Notes**: Useful as a general authority-gap audit pattern; only the platform implementation examples are site-specific.

## plugins/seo-analysis-monitoring/agents/seo-content-refresher.md
**Type**: Portable SOP candidate — content freshness review and update prioritization
**Portable**: Yes
**Reason**: The workflow is domain-agnostic: scan for stale dates, stats, examples, and references, then rank pages by freshness risk and update value.
**Notes**: Strong reusable process for any content program; only the example thresholds and platform-specific implementation notes need local adjustment.

## plugins/seo-technical-optimization/agents/seo-structure-architect.md
**Type**: Portable SOP candidate — content structure, hierarchy, and schema planning
**Portable**: Yes
**Reason**: The core guidance transfers cleanly across sites: evaluate heading hierarchy, improve information flow, build internal links, and add appropriate structured data.
**Notes**: The recommended schema types and snippet formats are broadly useful, with minimal adaptation needed for a new project.

## plugins/seo-technical-optimization/agents/seo-keyword-strategist.md
**Type**: Portable SOP candidate — keyword, entity, and semantic optimization workflow
**Portable**: Yes
**Reason**: The process of identifying primary/secondary terms, checking density, mapping entities, and suggesting semantic variations is reusable across most content teams.
**Notes**: Good fit as a general SEO optimization playbook; only the density targets and keyword sets should be tuned to the specific niche.

## plugins/seo-technical-optimization/agents/seo-meta-optimizer.md
**Type**: Portable SOP candidate — metadata, title, and description optimization
**Portable**: Yes
**Reason**: The rules for crafting concise URLs, title tags, and meta descriptions with keyword placement and click appeal are broadly applicable across web properties.
**Notes**: Highly portable as a metadata checklist; keep the character limits and brand conventions configurable.
## plugins/api-scaffolding/agents/django-pro.md
**Type**: Agent role — Django expert for scalable web apps, async, DRF, Celery, Channels, testing, and deployment
**Portable**: Yes
**Reason**: The guidance is mostly framework best practices rather than repo-specific wiring; it transfers cleanly to any Django project that needs architecture, performance, security, and testing advice.
**Notes**: Strong reusable role for Django-centric builds; only the exact ecosystem stack names need light adaptation.

## plugins/api-testing-observability/agents/api-documenter.md
**Type**: Agent role — API documentation specialist for OpenAPI, SDKs, portals, and docs-as-code workflows
**Portable**: Yes
**Reason**: The core workflow is tool-agnostic and centers on developer experience, contract documentation, examples, validation, and maintenance, which apply across API stacks.
**Notes**: Strong reusable docs role; keep the OpenAPI/developer-portal examples as examples, not constraints.

## plugins/blockchain-web3/agents/blockchain-developer.md
**Type**: Agent role — blockchain/Web3 specialist for smart contracts, DeFi, NFTs, and infrastructure
**Portable**: Yes
**Reason**: The role covers a broad, transferable blockchain implementation surface and emphasizes security, testing, gas efficiency, and architecture across ecosystems.
**Notes**: Portable as a high-level Web3 specialist role, though chain/tool specifics will vary by target ecosystem.

## plugins/seo-content-creation/agents/seo-content-planner.md
**Type**: Agent role — SEO content strategist for outlines, clusters, calendars, and intent mapping
**Portable**: Yes
**Reason**: The planning framework is generic content strategy work that applies to any marketing or editorial team focused on topical authority and structured planning.
**Notes**: Very portable; only keyword/topic examples need substitution for the target domain.
## plugins/seo-technical-optimization/agents/seo-snippet-hunter.md
**Type**: Agent — featured snippet / SERP answer formatting specialist
**Portable**: Yes
**Reason**: The core workflow is generic content-shaping: identify user questions, choose the right answer shape, write concise direct answers, and package supporting details for search visibility.
**Notes**: Reusable patterns include question-led headers, 40–60 word answers, lists/tables, FAQ/schema suggestions, and multiple answer variants.

## plugins/meigen-ai-design/agents/image-generator.md
**Type**: Agent — image-generation executor
**Portable**: No
**Reason**: The role is tightly coupled to a single `generate_image` tool call and intentionally avoids any broader reasoning or transformation.
**Notes**: The delegation pattern is useful, but the agent itself is mostly a thin transport wrapper around Meigen-specific tooling.

## plugins/meigen-ai-design/agents/prompt-crafter.md
**Type**: Agent — batch prompt-writing specialist
**Portable**: Yes
**Reason**: The guidance is broadly reusable for writing multiple distinct prompts, especially for parallel variants and serial-to-parallel derivative assets.
**Notes**: Strong reusable bits are the self-contained prompt rule, 50–150 word target, and explicit creative-direction labeling.

## plugins/meigen-ai-design/agents/gallery-researcher.md
**Type**: Agent — visual research and inspiration assistant
**Portable**: Yes
**Reason**: The research loop is general: search broadly, pick diverse candidates, inspect top references, and synthesize reusable style patterns.
**Notes**: The MeiGen gallery tools are specific, but the shortlist/deep-dive/summarize workflow transfers cleanly to other inspiration-finding tasks.
## plugins/frontend-mobile-security/agents/frontend-developer.md
**Type**: Agent profile — frontend React/Next.js implementation guidance
**Portable**: Yes
**Reason**: The role centers on common frontend concerns: component architecture, state management, accessibility, testing, and performance optimization. The specific React 19/Next.js 15 examples are stack-specific, but the operating guidance transfers to any modern web UI team.
**Notes**: Strong candidate for reuse as a generic frontend-developer agent; trim framework/version specifics and keep the UX, performance, and accessibility posture.
## plugins/full-stack-orchestration/agents/deployment-engineer.md
**Type**: Agent profile — deployment, CI/CD, GitOps, and release automation
**Portable**: Yes
**Reason**: The core responsibilities are broadly reusable across delivery stacks: pipeline design, progressive delivery, rollback planning, observability, and supply-chain security. The listed tools are implementation choices, not the underlying workflow.
**Notes**: Good portable deployment SOP with only light tailoring needed for the target CI/CD platform and platform runtime.
## plugins/full-stack-orchestration/agents/performance-engineer.md
**Type**: Agent profile — observability, profiling, caching, and performance tuning
**Portable**: Yes
**Reason**: The workflow is universal: measure first, locate bottlenecks, optimize the biggest wins, validate with load tests and monitoring, and set budgets to prevent regressions. The named tools and cloud services are examples of the same performance practice.
**Notes**: Highly reusable as a general performance-engineering role; keep the measurement-first discipline and adapt the toolchain.
## plugins/full-stack-orchestration/agents/security-auditor.md
**Type**: Agent profile — security review, DevSecOps, and compliance
**Portable**: Yes
**Reason**: The guidance maps cleanly to any secure engineering workflow: threat modeling, auth hardening, scanning, secrets management, cloud controls, and incident response. The specific standards and products are common references rather than repo-bound logic.
**Notes**: Strong portable security-auditor template; preserve the defense-in-depth and compliance framing while substituting local tooling and regulatory scope.
## plugins/codebase-cleanup/agents/test-automator.md
**Type**: Portable agent role — test automation and quality engineering guidance
**Portable**: Yes
**Reason**: The core guidance centers on universal testing practices: TDD, automation strategy, CI integration, test stability, and quality metrics. The framework/tool examples are illustrative rather than required.
**Notes**: Strong cross-project fit; can be reused wherever teams need an agent to design or improve automated testing.
## plugins/backend-api-security/agents/backend-architect.md
**Type**: Portable agent role — backend/API architecture with security and observability
**Portable**: Yes
**Reason**: The file describes generic backend design concerns: API contracts, microservices boundaries, authN/authZ, resilience, caching, and observability. Only the example stacks and products are implementation-specific.
**Notes**: Good reusable architecture role; the security guidance is broad enough to adapt to most backend platforms.
## plugins/database-cloud-optimization/agents/backend-architect.md
**Type**: Portable agent role — backend architecture informed by data and cloud constraints
**Portable**: Yes
**Reason**: The guidance is still a general backend-architecture playbook, but it emphasizes deferring data-layer details to a separate specialist and keeping service design aligned with performance and deployment needs.
**Notes**: Portable, though partly redundant with the other backend-architect file; best reused as a lightweight service-design role.
## plugins/database-cloud-optimization/agents/cloud-architect.md
**Type**: Portable agent role — cloud infrastructure, IaC, cost, and resilience planning
**Portable**: Yes
**Reason**: The content is broadly applicable across cloud providers: choose services by workload fit, design for failure, automate with IaC, optimize cost, and plan for DR, security, and observability.
**Notes**: Strong portable cloud-architecture role; the provider-specific service lists can be swapped for the target environment.
## plugins/frontend-mobile-security/agents/frontend-developer.md
**Type**: Agent profile — frontend React/Next.js implementation guidance
**Portable**: Yes
**Reason**: The role centers on common frontend concerns: component architecture, state management, accessibility, testing, and performance optimization. The specific React 19/Next.js 15 examples are stack-specific, but the operating guidance transfers to any modern web UI team.
**Notes**: Strong candidate for reuse as a generic frontend-developer agent; trim framework/version specifics and keep the UX, performance, and accessibility posture.
## plugins/full-stack-orchestration/agents/deployment-engineer.md
**Type**: Agent profile — deployment, CI/CD, GitOps, and release automation
**Portable**: Yes
**Reason**: The core responsibilities are broadly reusable across delivery stacks: pipeline design, progressive delivery, rollback planning, observability, and supply-chain security. The listed tools are implementation choices, not the underlying workflow.
**Notes**: Good portable deployment SOP with only light tailoring needed for the target CI/CD platform and platform runtime.
## plugins/full-stack-orchestration/agents/performance-engineer.md
**Type**: Agent profile — observability, profiling, caching, and performance tuning
**Portable**: Yes
**Reason**: The workflow is universal: measure first, locate bottlenecks, optimize the biggest wins, validate with load tests and monitoring, and set budgets to prevent regressions. The named tools and cloud services are examples of the same performance practice.
**Notes**: Highly reusable as a general performance-engineering role; keep the measurement-first discipline and adapt the toolchain.
## plugins/full-stack-orchestration/agents/security-auditor.md
**Type**: Agent profile — security review, DevSecOps, and compliance
**Portable**: Yes
**Reason**: The guidance maps cleanly to any secure engineering workflow: threat modeling, auth hardening, scanning, secrets management, cloud controls, and incident response. The specific standards and products are common references rather than repo-bound logic.
**Notes**: Strong portable security-auditor template; preserve the defense-in-depth and compliance framing while substituting local tooling and regulatory scope.
## plugins/full-stack-orchestration/agents/test-automator.md
**Type**: Agent role — AI-heavy test automation and quality engineering
**Portable**: Partial
**Reason**: The TDD, test-strategy, and CI guidance is reusable, but the file is mostly a persona plus a long tool/vendor catalog, so it needs pruning before becoming a portable SOP.
**Notes**: Keep the red-green-refactor loop, coverage, and maintenance heuristics; trim the exhaustive framework/platform lists and reframe as a concise testing playbook.

## plugins/code-refactoring/agents/code-reviewer.md
**Type**: Agent role — code review specialist
**Portable**: Partial
**Reason**: The review workflow and severity framing generalize well, but much of the content is an expansive role description with duplicated generic review points.
**Notes**: Extract the context-first review sequence, security/performance checklist, and constructive feedback rules; remove tool/vendor name lists.

## plugins/code-refactoring/agents/legacy-modernizer.md
**Type**: Agent role — legacy modernization specialist
**Portable**: Yes
**Reason**: The strangler-fig approach, test-before-refactor, compatibility focus, and rollout/rollback guidance are broadly reusable modernization SOPs.
**Notes**: This is the most directly portable file in the set; only the examples and specific migration targets need adaptation.

## plugins/codebase-cleanup/agents/code-reviewer.md
**Type**: Agent role — code review specialist
**Portable**: Partial
**Reason**: It duplicates the same high-level review persona as the code-refactoring reviewer, so the core is reusable but redundant.
**Notes**: Reuse the shared review checklist once, then dedupe this file to avoid parallel near-identical roles.
## plugins/ui-design/agents/ui-designer.md
**Type**: Portable
**Reason**: Generic UI design role focused on components, responsive layouts, accessibility, and design-to-code handoff.
**Notes**: Strong reusable agent spec; mostly stack-agnostic and implementation-friendly.

## plugins/ui-design/agents/ui-ux-designer.md
**Type**: Portable
**Reason**: Equivalent UI/UX role emphasizes research, accessibility, design systems, and cross-platform consistency.
**Notes**: Requested path was absent in .references; audited equivalent file at `plugins/multi-platform-apps/agents/ui-ux-designer.md`.

## plugins/frontend-mobile-development/agents/frontend-developer.md
**Type**: Portable
**Reason**: Broad frontend role covering modern React/Next.js, performance, accessibility, testing, and styling systems.
**Notes**: Good reusable scope definition for web app implementation work.

## plugins/frontend-mobile-development/agents/mobile-developer.md
**Type**: Portable
**Reason**: Broad mobile role covering React Native, Flutter, native integration, offline sync, testing, and release operations.
**Notes**: Good reusable scope definition for cross-platform and native mobile delivery.
## plugins/database-cloud-optimization/agents/database-architect.md
**Type**: Portable **Portable**: Yes **Reason**: Database selection, schema design, indexing, migration, and scaling guidance are all broadly reusable across stacks and cloud providers. **Notes**: Strong SOP candidate; the only repo-specific parts are the example database vendors and cloud service catalogs.

## plugins/deployment-strategies/agents/deployment-engineer.md
**Type**: Portable **Portable**: Yes **Reason**: CI/CD, GitOps, progressive delivery, rollback, and pipeline security practices are general deployment workflows rather than repo-bound instructions. **Notes**: Strong SOP candidate; strip platform names and keep the deployment-safety and observability rules.

## plugins/deployment-strategies/agents/terraform-specialist.md
**Type**: Portable **Portable**: Yes **Reason**: Terraform/OpenTofu module design, state management, testing, policy-as-code, and multi-cloud patterns transfer cleanly across IaC projects. **Notes**: Strong SOP candidate; implementation examples are tooling-specific, but the state/validation/automation workflow is reusable.

## plugins/deployment-validation/agents/cloud-architect.md
**Type**: Portable **Portable**: Yes **Reason**: Cloud architecture, IaC, cost optimization, security, and DR guidance are cross-cloud concerns with broad reuse. **Notes**: Strong SOP candidate; keep the design and trade-off framing, and generalize provider-specific service references.
## plugins/dependency-management/agents/legacy-modernizer.md
**Type**: Agent role — legacy modernization and incremental migration specialist
**Portable**: Yes
**Reason**: The workflow is broadly reusable: add tests first, modernize in small phases, preserve backward compatibility, and use shims/feature flags to reduce risk.
**Notes**: Strong portable candidate for safe framework/dependency migrations and technical-debt cleanup.

## plugins/developer-essentials/agents/monorepo-architect.md
**Type**: Agent role — monorepo architecture and scaling specialist
**Portable**: Yes
**Reason**: The core concerns are universal in monorepos: workspace layout, dependency graphs, caching, affected detection, and consistent tooling.
**Notes**: Good reusable role for workspace design, build optimization, and cross-project coordination.

## plugins/distributed-debugging/agents/error-detective.md
**Type**: Agent role — log analysis and error-correlation specialist
**Portable**: Yes
**Reason**: The method is generic: extract symptoms from logs, correlate across time/services, tie to deployments, and form evidence-based root-cause hypotheses.
**Notes**: Especially useful for distributed systems and production incident triage.

## plugins/error-debugging/agents/debugger.md
**Type**: Agent role — root-cause debugging specialist
**Portable**: Yes
**Reason**: The workflow is technology-agnostic: capture the failure, reproduce it, isolate the locus, apply the minimal fix, and verify with tests.
**Notes**: Strong general-purpose debugging role with clear evidence and prevention guidance.
## plugins/incident-response/agents/code-reviewer.md
**Type**: Portable agent role — code review specialist for logic, type safety, error handling, and architecture
**Portable**: Yes
**Reason**: The role is a general review function with no repo-specific tooling or path assumptions; its focus on correctness, maintainability, and fix design transfers cleanly to other codebases.
**Notes**: Strong reusable review role; the severity-aware, minimal-fix recommendation style is broadly applicable.

## plugins/incident-response/agents/error-detective.md
**Type**: Portable agent role — production error and observability analysis specialist
**Portable**: Yes
**Reason**: The agent is centered on universal incident-analysis work: stack traces, logs, traces, timelines, impact assessment, and reproduction clues. Those inputs exist in most operational systems.
**Notes**: Strong reusable incident triage role; the evidence-first workflow and user-impact framing are easy to transplant.

## plugins/incident-response/agents/test-automator.md
**Type**: Portable agent role — test planning and validation specialist for fixes and features
**Portable**: Yes
**Reason**: The core function is technology-agnostic: identify needed unit, integration, regression, and security tests, then validate fixes with coverage and cross-environment checks.
**Notes**: Strong reusable QA role; the explicit edge-case, regression, and coverage orientation maps well to most stacks.

## plugins/team-collaboration/agents/dx-optimizer.md
**Type**: Portable agent role — developer experience and workflow optimization specialist
**Portable**: Yes
**Reason**: The role targets universal DX concerns such as onboarding speed, automation, build/test feedback loops, hooks, scripts, and documentation quality, which are relevant across repositories.
**Notes**: Strong reusable operations/workflow role; the focus on reducing friction and making setup invisible is broadly transferable.
## plugins/error-diagnostics/agents/debugger.md
**Type**: Agent — debugging / root-cause analysis specialist
**Portable**: Yes
**Reason**: The workflow is generic debugging practice: capture the error, reproduce, isolate the failure, apply a minimal fix, and verify. It does not depend on repo-specific paths or tooling.
**Notes**: Strong reusable debugging agent pattern for issues, test failures, and unexpected behavior.

## plugins/error-diagnostics/agents/error-detective.md
**Type**: Agent — log and error pattern analysis specialist
**Portable**: Yes
**Reason**: The core behavior is broadly applicable: parse logs, correlate errors over time, connect symptoms to deployments or changes, and produce evidence-backed root-cause hypotheses.
**Notes**: Strong reusable incident-analysis pattern, especially for distributed systems and production anomalies.

## plugins/framework-migration/agents/architect-review.md
**Type**: Agent — architecture review specialist
**Portable**: Yes
**Reason**: The review criteria are architecture-level concerns that transfer across stacks: boundaries, scalability, maintainability, security, observability, and design-pattern fit.
**Notes**: Strong reusable pattern for evaluating system changes and migration trade-offs.

## plugins/framework-migration/agents/legacy-modernizer.md
**Type**: Agent — legacy modernization specialist
**Portable**: Yes
**Reason**: The guidance is general migration practice: incremental replacement, compatibility preservation, test-first refactoring, and phased rollout with rollback paths.
**Notes**: Strong reusable modernization pattern for framework upgrades, dependency refreshes, and technical-debt reduction.
## plugins/agent-teams/commands/team-feature.md
**Type**: Portable SOP candidate — parallel feature decomposition and integration workflow
**Portable**: Yes
**Reason**: The core workflow is reusable beyond the teammate tool: analyze scope, split work into non-overlapping streams with explicit ownership, define interface contracts and dependencies, then verify integration and clean up. The command-specific spawning steps are implementation details, but the planning and coordination pattern is general.
**Notes**: Strong candidate for a reusable team-delivery SOP; the file ownership rule and integration-contract framing are the most transferable parts.
## plugins/agent-teams/commands/team-review.md
**Type**: Portable SOP candidate — parallel multi-dimensional review and consolidation workflow
**Portable**: Yes
**Reason**: The reusable workflow is clear: choose review dimensions, distribute them in parallel, deduplicate overlapping findings, normalize severity, and publish one consolidated report. The Teammate/Task tool calls are specific, but the review orchestration and report structure are broadly applicable.
**Notes**: Strong reusable review pattern; especially useful for any team that wants parallel specialist review with one merged output.
## plugins/agent-teams/commands/team-debug.md
**Type**: Portable SOP candidate — competing-hypotheses debugging workflow
**Portable**: Yes
**Reason**: This encodes a general debugging method: triage the symptom, generate multiple plausible hypotheses, investigate them in parallel, compare evidence, and arbitrate the most likely root cause. The agent-teams mechanics are tool-specific, but the ACH-style debugging process transfers well.
**Notes**: High-value reusable debugging SOP; the hypothesis taxonomy and evidence-based arbitration are the key portable elements.
## plugins/agent-teams/commands/team-spawn.md
**Type**: Partially portable SOP candidate — team composition and preset selection workflow
**Portable**: Partial
**Reason**: The reusable part is the team-formation logic: pick a preset or custom composition, size the team to the work, map roles to capabilities, and create a concise team summary. However, most of the file is tightly coupled to the agent-teams runtime, teammate spawning, and display modes.
**Notes**: Portable as a high-level orchestration pattern, but less reusable than the other commands because the spawning and setup steps are heavily tool-bound.
## plugins/agent-teams/commands/team-delegate.md
**Type**: Command — delegation dashboard and workload rebalancing workflow
**Portable**: Yes
**Reason**: The core patterns are general-purpose: parse a team context, inspect task ownership, surface idle vs overloaded members, and support direct assignment or message dispatch. The rebalancing heuristics and dashboard layout transfer cleanly to other multi-agent systems.
**Notes**: Tool names (`TaskList`, `TaskUpdate`, `SendMessage`) and the `~/.claude/teams/{team-name}/config.json` path are implementation details; the analysis/suggestion flow is the reusable SOP.
## plugins/agent-teams/commands/team-status.md
**Type**: Command — team status reporting and progress summary workflow
**Portable**: Yes
**Reason**: Discovering the active team, summarizing members and tasks, and offering table or JSON output are broadly reusable reporting patterns. The command is essentially a generic status snapshot for any coordinated workgroup.
**Notes**: The config location, task-list tool, and example table fields are local mechanics; the portable part is the status discovery and presentation flow.
## plugins/agent-teams/commands/team-shutdown.md
**Type**: Command — graceful shutdown, approval, and cleanup workflow
**Portable**: Yes
**Reason**: Coordinated shutdown requests, in-progress work checks, explicit user confirmation, and optional preservation of task state are reusable across orchestrated agent environments. The workflow promotes safe termination instead of abrupt teardown.
**Notes**: The shutdown message type, `Teammate` cleanup call, and Claude-specific team paths are implementation-specific; the graceful-then-force pattern is the durable SOP.
## plugins/conductor/commands/implement.md
**Type**: Command — track execution with TDD, phase gates, and traceable commits
**Portable**: Yes
**Reason**: The task loop, red-green-refactor sequence, explicit verification checkpoints, and progress bookkeeping are widely applicable to planned implementation work. It is a strong generic execution SOP wrapped in track-management tooling.
**Notes**: `conductor/` file names, status markers, and commit/metadata conventions are repo-specific; the ordered task progression and approval gates are the portable core.
## plugins/conductor/commands/new-track.md
**Type**: Interactive command workflow — track/spec/plan creation
**Portable**: Partially
**Reason**: The core pattern is reusable: classify a request, gather requirements one question at a time, generate a spec, then generate a phased implementation plan. However, the command is tightly coupled to Conductor-specific file names, track IDs, registry updates, and directory layout.
**Notes**: Strong candidate as a generalized “intake → spec → plan” SOP if the storage model and registry conventions are abstracted.

## plugins/conductor/commands/setup.md
**Type**: Interactive setup wizard — project bootstrap and documentation generation
**Portable**: Partially
**Reason**: The setup flow is broadly useful for onboarding a new project: detect existing context, ask a bounded set of questions, persist state, and generate baseline docs. The implementation is tied to Conductor artifacts, state file shape, and generated template paths.
**Notes**: The question sequencing and state-resume pattern are the most reusable parts; the generated file set is repo-specific.

## plugins/conductor/commands/status.md
**Type**: Status aggregation command — project/track/task reporting
**Portable**: Partially
**Reason**: The reporting pattern is general: summarize project progress, derive counts from structured plans, identify the current focus, and surface blockers. But the parser logic depends on Conductor’s track registry, plan markdown markers, and metadata.json schema.
**Notes**: Good model for a generic status command once the data contract is abstracted from Conductor’s file layout.

## plugins/conductor/commands/revert.md
**Type**: Git-aware undo workflow — track/phase/task revert
**Portable**: Partially
**Reason**: The safety rules and stepwise revert plan are broadly reusable: verify repo state, enumerate impacted commits, require explicit confirmation, and update progress metadata after rollback. The concrete mapping from revert scope to Conductor tracks, phases, and tasks is specific to this plugin.
**Notes**: The explicit YES gate and conflict-halt behavior are especially strong portable guardrails; the plan.md and metadata updates are implementation-specific.
## plugins/conductor/commands/manage.md
**Type**: Workflow command — track lifecycle management
**Portable**: Yes
**Reason**: The archive/restore/delete/rename/cleanup lifecycle, confirmation gates, and registry-sync steps are reusable across work-tracking systems.
**Notes**: Strip Conductor-specific paths (`conductor/tracks.md`, `_archive/`), command names, and git commit examples when porting.

## plugins/comprehensive-review/commands/full-review.md
**Type**: Orchestrated review workflow — phased multi-agent code review
**Portable**: Yes
**Reason**: The phased review structure, parallel specialist reviewers, checkpoint approvals, and consolidated reporting pattern are broadly reusable.
**Notes**: Generalize the local `.full-review/` files, agent labels, and AskUserQuestion/Task wiring to the target runtime.

## plugins/comprehensive-review/commands/pr-enhance.md
**Type**: PR optimization workflow — description, checklist, and split guidance
**Portable**: Yes
**Reason**: PR analysis, review-checklist generation, size-risk detection, and split-suggestion logic apply across repositories and languages.
**Notes**: The embedded Python examples and GitHub-oriented phrasing should be adapted to the host project’s tooling and PR conventions.

## plugins/backend-development/commands/feature-development.md
**Type**: Feature delivery orchestrator — requirements to deployment lifecycle
**Portable**: Yes
**Reason**: The staged flow from requirements through architecture, implementation, testing, deployment, and documentation is a reusable delivery SOP.
**Notes**: Replace the local `.feature-dev/` artifacts, agent names, and approval checkpoints with the destination project’s equivalents.
## plugins/codebase-cleanup/commands/refactor-clean.md
**Type**: Portable command prompt — refactoring and clean-code guidance
**Portable**: Yes
**Reason**: The prompt is mostly stack-agnostic process guidance: analyze smells, prioritize small refactors, apply SOLID/patterns, and verify with tests and metrics. The embedded examples are illustrative rather than binding to a specific repo.
**Notes**: Strong portable SOP candidate. Strip the example code blocks and keep the refactoring checklist, prioritization matrix, and quality gates.

## plugins/codebase-cleanup/commands/tech-debt.md
**Type**: Portable command prompt — technical debt inventory and remediation planning
**Portable**: Yes
**Reason**: The workflow generalizes well across codebases: inventory debt, estimate impact, prioritize by ROI, define remediation phases, and add prevention gates. It is process-first and not tied to a specific implementation surface.
**Notes**: Strong portable SOP candidate. Keep the debt taxonomy, impact/ROI framing, and prevention strategy; generalize the example metrics and roadmap templates.

## plugins/context-management/commands/context-save.md
**Type**: Portable command prompt — context capture and serialization workflow
**Portable**: Yes
**Reason**: The core ideas are reusable anywhere: identify canonical context, serialize it, tag it, and support versioned retrieval or drift detection. The examples describe generic context-engineering patterns rather than repo-specific mechanics.
**Notes**: Good portable SOP material. Retain the context extraction, storage-format selection, and validation concepts; replace vector-db/vendor specifics with the host project’s context store.

## plugins/context-management/commands/context-restore.md
**Type**: Portable command prompt — semantic context rehydration workflow
**Portable**: Yes
**Reason**: The restoration flow is broadly applicable: retrieve relevant context, rank by relevance, manage token budgets, merge safely, and validate integrity. It reads as a general recovery procedure for long-lived AI workflows.
**Notes**: Good portable SOP material. Keep the retrieval/ranking/rehydration loop and conflict-resolution rules; generalize the example CLI and storage backends.
## plugins/database-cloud-optimization/commands/cost-optimize.md
**Type**: Cloud cost optimization SOP / implementation guide
**Portable**: Yes
**Reason**: The core workflow—analyze spend, find waste, rightsize resources, and automate savings—maps across cloud providers even though the examples use AWS-specific APIs.
**Notes**: Keep the provider-specific calls as examples; the optimization heuristics and reporting structure are reusable.

## plugins/database-migrations/commands/sql-migrations.md
**Type**: SQL migration SOP / zero-downtime deployment guide
**Portable**: Yes
**Reason**: Expand-contract, backfill, validation, and rollback patterns are broadly reusable across relational databases and migration frameworks.
**Notes**: The SQL dialect examples are the main adaptation point; the migration strategy itself is portable.

## plugins/database-migrations/commands/migration-observability.md
**Type**: Migration observability / CDC monitoring SOP
**Portable**: Yes
**Reason**: Metrics, alerting, CDC, and anomaly-detection patterns apply across database migration stacks, with tooling swapped per environment.
**Notes**: The concrete Mongo/Kafka/Prometheus code is implementation-specific, but the observability contract is reusable.

## plugins/data-engineering/commands/data-pipeline.md
**Type**: Data pipeline architecture SOP / implementation guide
**Portable**: Yes
**Reason**: The document focuses on durable pipeline design choices—ingestion, orchestration, data quality, storage, monitoring, and cost control—rather than repo-specific wiring.
**Notes**: Strong candidate for reuse as a general data-platform playbook; swap the example tools to match the target stack.
## plugins/code-refactoring/commands/refactor-clean.md
**Type**: Portable SOP candidate — code refactoring and cleanup workflow
**Portable**: Yes
**Reason**: The file is mostly general refactoring guidance: inspect smells, prioritize quick wins, apply SOLID and decomposition patterns, and verify with tests and metrics. The structure is reusable across stacks and codebases.
**Notes**: Strong candidate for a general refactoring SOP. Strip the language-specific examples and keep the smell checklist, refactoring sequence, and quality gates.

## plugins/code-refactoring/commands/tech-debt.md
**Type**: Portable SOP candidate — technical debt inventory, ROI analysis, and remediation planning
**Portable**: Yes
**Reason**: The core workflow is broadly applicable: inventory debt by category, quantify impact, prioritize by ROI/risk, and track prevention gates. The process is framework-agnostic and useful in any codebase.
**Notes**: Strong candidate for a reusable debt-management SOP. The cost/ROI framing and phased remediation roadmap are the most transferable parts.

## plugins/code-refactoring/commands/context-restore.md
**Type**: Portable SOP candidate — semantic context recovery and rehydration workflow
**Portable**: Mostly
**Reason**: The high-level idea of restoring, ranking, merging, and validating context is portable, but the command is more abstract and leans on vector DB and memory-system assumptions. The lifecycle still generalizes well as a context-management SOP.
**Notes**: Good candidate if reframed away from specific storage backends. Keep the restore/validate/synchronize loop and trim the embedding-system implementation details.

## plugins/codebase-cleanup/commands/deps-audit.md
**Type**: Portable SOP candidate — dependency audit, license review, and supply-chain remediation
**Portable**: Yes
**Reason**: The command covers universal dependency hygiene: discovery, vulnerability scanning, license checks, outdated package analysis, size impact, and automated remediation. Those concerns apply across most software projects.
**Notes**: Strong candidate for a security/dependencies SOP. Keep the audit-prioritize-fix-monitor loop and remove the package-manager-specific API examples where they are not needed.
## plugins/agent-orchestration/commands/improve-agent.md
**Type**: Workflow — agent optimization / prompt-tuning checklist
**Portable**: Yes
**Reason**: The core loop is reusable across agent systems: measure performance, inspect failure patterns, refine prompt/role/examples, test changes, and roll back if metrics regress.
**Notes**: Strong SOP candidate; the named tools are implementation details, but the baseline→improve→validate→deploy cycle is broadly portable.

## plugins/agent-orchestration/commands/multi-agent-optimize.md
**Type**: Workflow — multi-agent performance profiling and coordination optimization
**Portable**: Yes
**Reason**: The guidance is mostly platform-agnostic process advice: profile bottlenecks, optimize context usage, reduce coordination overhead, balance cost vs speed, and validate improvements with measurement.
**Notes**: Portable at the method level; specific agent roles and example code are illustrative and can be swapped for local equivalents.

## plugins/code-documentation/commands/code-explain.md
**Type**: Documentation workflow — code explanation, diagrams, and progressive teaching
**Portable**: Yes
**Reason**: The approach generalizes well: analyze code complexity, generate visuals, explain step by step, surface patterns/pitfalls, and tailor learning paths to the reader.
**Notes**: Very portable; the AST/diagram examples are language-specific templates, but the explanation structure is reusable across stacks.

## plugins/code-documentation/commands/doc-generate.md
**Type**: Documentation workflow — automated docs generation and publishing
**Portable**: Yes
**Reason**: The core SOP applies broadly: extract API and architecture facts from code, generate living docs, validate coverage, and automate publication in CI.
**Notes**: Strongly portable; OpenAPI, Mermaid, README, and CI examples are common documentation outputs rather than repo-specific mechanics.
## plugins/framework-migration/commands/code-migrate.md
**Type**: Portable **Reason**: Framework- and language-agnostic migration guidance built around generic assessment/planning patterns. **Notes**: Includes example migrators and rollback/testing templates; easy to adapt to different stacks.

## plugins/framework-migration/commands/deps-upgrade.md
**Type**: Portable **Reason**: Dependency upgrade workflow uses standard audit, compatibility, test, and rollback patterns. **Notes**: Covers npm/pip examples, but the strategy generalizes well across ecosystems.

## plugins/framework-migration/commands/legacy-modernize.md
**Type**: Portable **Reason**: Modernization workflow is structured as a reusable phased SOP with generic assessment, testing, rollout, and decommissioning steps. **Notes**: Strong operational constraints and checkpointing make it more process-heavy, but still broadly reusable.

## plugins/frontend-mobile-development/commands/component-scaffold.md
**Type**: Portable **Reason**: Component scaffolding template is built around common React/React Native generation patterns and configurable options. **Notes**: Best fit for TypeScript React ecosystems, but the structure adapts to similar component workflows.
## plugins/error-debugging/commands/multi-agent-review.md
**Type**: Workflow / multi-agent review orchestration
**Portable**: Yes
**Reason**: The review flow is broadly reusable: select specialized reviewers, run independent checks in parallel, then synthesize and deduplicate findings into one report.
**Notes**: Strip the pseudo-code and example agent labels; keep the coordination pattern, conflict resolution, and consolidated reporting shape.

## plugins/error-diagnostics/commands/error-analysis.md
**Type**: SOP / incident analysis and observability workflow
**Portable**: Yes
**Reason**: The guidance covers generic debugging practices—triage, root-cause analysis, structured logging, tracing, alerting, recovery, and validation—that transfer across stacks.
**Notes**: Generalize the vendor examples and code snippets to the host project’s tooling and observability stack.

## plugins/error-diagnostics/commands/error-trace.md
**Type**: SOP / debugging triage workflow
**Portable**: Yes
**Reason**: The core loop is reusable anywhere: parse the issue, collect observability data, rank hypotheses, instrument safely, validate a fix, and prevent regressions.
**Notes**: The Task-tool and AI-subagent references are implementation details; the hypothesis-ranking and production-safe instrumentation steps are the portable core.

## plugins/error-diagnostics/commands/smart-debug.md
**Type**: SOP / guided debugging workflow
**Portable**: Yes
**Reason**: It provides a general debugging playbook with issue parsing, ranked hypotheses, observability-driven investigation, fix validation, and prevention steps.
**Notes**: Replace named observability products and tool-specific terminology with local equivalents; keep the evidence-first workflow and validation gates.
## plugins/distributed-debugging/commands/debug-trace.md
**Type**: Command / debugging workflow — environment setup, remote debugging, and tracing
**Portable**: Yes
**Reason**: The workflow is broadly reusable: configure local debuggers, add console helpers, support remote attach flows, and standardize tracing/logging practices to diagnose issues across environments.
**Notes**: The VS Code and browser/Node examples are implementation-specific, but the underlying debugging SOP transfers cleanly to most JavaScript/TypeScript stacks and adjacent runtimes.

## plugins/documentation-generation/commands/doc-generate.md
**Type**: Command / documentation workflow — API, architecture, code, and user docs generation
**Portable**: Yes
**Reason**: The guidance is generic documentation process advice: extract facts from code, produce consistent docs, keep docs synchronized, and automate validation/deployment.
**Notes**: The sample extraction scripts and OpenAPI templates are illustrative; the document-generation checklist itself is reusable across codebases and languages.

## plugins/error-debugging/commands/error-analysis.md
**Type**: Command / incident analysis workflow — classification, root cause analysis, and distributed debugging
**Portable**: Yes
**Reason**: The analysis model is domain-agnostic: classify error severity/type, reproduce, trace call chains, inspect state, and validate hypotheses with evidence.
**Notes**: Stack-trace and observability examples are concrete, but the five-whys, timeline reconstruction, and hypothesis arbitration steps are strong cross-project SOP material.

## plugins/error-debugging/commands/error-trace.md
**Type**: Command / observability workflow — error tracking, alerting, and monitoring setup
**Portable**: Yes
**Reason**: The core advice is broadly applicable: instrument error capture, standardize structured logs, integrate tracking tools, and tune alerts around meaningful signals.
**Notes**: The Sentry setup and code samples are framework-specific, but the monitoring checklist and filtering/enrichment patterns should transfer to most modern applications.
## plugins/data-engineering/commands/data-driven-feature.md
**Type**: Orchestrated feature-delivery workflow command
**Portable**: Partial
**Reason**: The phased, checkpointed data-driven feature process is broadly useful, but it is tightly coupled to local state files, fixed step ordering, and specific subagent/tool syntax.
**Notes**: Strong candidate for a generalized SOP after stripping repo-local paths, hardcoded phase names, and implementation-specific orchestration details.

## plugins/debugging-toolkit/commands/smart-debug.md
**Type**: Debugging workflow command
**Portable**: Yes
**Reason**: The root-cause workflow is generic and transferable: triage, gather evidence, rank hypotheses, validate fixes, and add prevention.
**Notes**: Vendor examples and task-tool wiring are incidental; the evidence-first debugging loop is the durable SOP.

## plugins/dependency-management/commands/deps-audit.md
**Type**: Dependency audit and security workflow command
**Portable**: Yes
**Reason**: Dependency discovery, vulnerability scanning, license review, and update prioritization are universal maintenance tasks, even though the sample code is ecosystem-specific.
**Notes**: Good portable SOP candidate once API calls and language-specific examples are generalized.

## plugins/deployment-validation/commands/config-validate.md
**Type**: Configuration validation workflow command
**Portable**: Yes
**Reason**: Schema validation, environment-specific rules, runtime checks, and secure configuration handling are broadly reusable across projects.
**Notes**: The Python/TypeScript snippets are illustrative; the validation contract itself is portable.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/wshobson-agents/plugins/frontend-mobile-security/commands/xss-scan.md
**Type**: Security workflow — static XSS scanning and remediation guidance
**Portable**: Yes
**Reason**: The core pattern is broadly reusable across frontend codebases: look for unsafe HTML sinks, risky URL assignment, and framework-specific raw-rendering APIs, then pair findings with concrete sanitization and safer-alternative fixes. The checklist and report structure generalize well beyond this repo.
**Notes**: Strip the specific pattern lists into project-local heuristics if the target stack differs; the DOMPurify and URL-validation examples are good portable defaults, but framework-specific branches should be tailored to the app’s UI framework.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/wshobson-agents/plugins/c4-architecture/commands/c4-architecture.md
**Type**: Architecture documentation workflow — bottom-up C4 analysis and synthesis
**Portable**: Yes
**Reason**: The workflow is largely framework-agnostic: document code first, synthesize components, map containers, and finish with a system context view. The bottom-up ordering and artifact hierarchy are useful in most repositories that need architecture docs.
**Notes**: The Task-tool / subagent naming and the output directory path are implementation details; the highest-value portable elements are the decomposition order, the doc structure, and the linkage between levels.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/wshobson-agents/plugins/api-testing-observability/commands/api-mock.md
**Type**: Testing / dev-experience workflow — API mocking, stubbing, and scenario simulation
**Portable**: Yes
**Reason**: The underlying ideas are widely applicable: define request matchers, support stateful scenarios, generate realistic data, and simulate latency/errors for development and testing. The mocking patterns translate across API stacks even if the implementation language changes.
**Notes**: The FastAPI/Python examples are implementation-specific, but the contracts for stubs, sequences, and data generation are reusable. If porting, swap in the host framework’s server and test primitives.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/wshobson-agents/docs/superpowers/plans/2025-03-25-plugineval-plan.md
**Type**: Project-specific implementation plan
**Portable**: No
**Reason**: This is tightly coupled to the plugin-eval project: it references concrete repo paths, exact files to create, specific toolchain choices, and a fixed phased implementation sequence. It is valuable as a plan artifact, but not as a generic SOP.
**Notes**: If reused elsewhere, strip the absolute paths, file names, and project-specific acceptance steps, then rewrite it as a reusable plan template or a domain-neutral execution checklist.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/wshobson-agents/docs/superpowers/specs/2025-03-25-plugineval-design.md
**Type**: Portable evaluation framework / design spec
**Portable**: Yes
**Reason**: The core pattern — layered static + judge + simulation scoring, weighted quality dimensions, confidence intervals, and Elo-style comparisons — is reusable in other plugin or skill marketplaces.
**Notes**: Strip Claude Max-plan auth, Agent SDK specifics, corpus paths, and the exact marketplace counts; the statistical scoring model and badge thresholds are the most transferable pieces.
## /Users/mia/.agents/.worktrees/role-to-sop/.references/wshobson-agents/CLAUDE.md
**Type**: Repo operating guide / authoring conventions
**Portable**: Yes
**Reason**: The frontmatter schema, skill directory layout, model-tier guidance, and plugin authoring conventions generalize well to other agent/skill repositories.
**Notes**: Keep the generic agent/skill/command conventions and tooling guidance; strip repo-specific names, counts, registry paths, and the PluginEval quick-reference details unless the target repo uses the same structure.
## plugins/conductor/templates/track-spec.md
**Type**: Template — track specification with requirements, scope, dependencies, risks, questions, and approval fields
**Portable**: Yes
**Reason**: The structure is a generic work-item spec and does not depend on repo-specific tooling or terminology.
**Notes**: Strong reusable starting point for any tracked initiative; replace placeholders and approval metadata with local conventions.

## plugins/conductor/templates/track-plan.md
**Type**: Template — phased implementation plan with tasks, verification gates, checkpoints, deviations, and final validation
**Portable**: Yes
**Reason**: The planning structure is broadly applicable to any staged delivery workflow and only uses generic project-management concepts.
**Notes**: Good portable plan scaffold; the phase/checkpoint pattern is especially reusable across teams.

## plugins/conductor/templates/workflow.md
**Type**: Workflow template — task selection, TDD loop, coverage checks, commit checkpoints, and plan updates
**Portable**: Yes
**Reason**: The process is a generic development lifecycle that translates cleanly to other repos and agent systems.
**Notes**: The strongest transferable pieces are the ordered task flow, explicit in-progress marking, and separate plan/commit hygiene.

## plugins/conductor/templates/product.md
**Type**: Product vision template — overview, problem statement, users, value proposition, metrics, and scope
**Portable**: Yes
**Reason**: This is a standard product brief structure with no dependency on conductor-specific mechanics.
**Notes**: Useful as a canonical product-framing doc; adapt the KPI and persona sections to the host product.
## plugins/conductor/templates/product-guidelines.md
**Type**: Template scaffold — product voice, messaging, accessibility, and error-handling guidance
**Portable**: Yes
**Reason**: The structure is generic and reusable across projects: it defines a place for voice/tone, message hierarchy, design principles, accessibility, and recovery patterns without hard-coding repo-specific implementation details.
**Notes**: Best treated as a fill-in-the-blanks standards document for product and UX writing.

## plugins/conductor/templates/tech-stack.md
**Type**: Template scaffold — stack selection, infrastructure, tooling, and decision log
**Portable**: Yes
**Reason**: The sections map cleanly to any software project’s architecture notes: frontend, backend, infrastructure, dev tools, compatibility, and decision history are all broadly applicable.
**Notes**: Useful as a canonical place to record technology choices and version constraints.

## plugins/conductor/templates/tracks.md
**Type**: Template scaffold — track registry and lifecycle management
**Portable**: Yes
**Reason**: The registry pattern is generic: it defines status tracking, active/completed/archive sections, and a creation checklist that can be reused in any work-tracking system.
**Notes**: Strong candidate for a reusable work-item registry template.

## plugins/conductor/templates/index.md
**Type**: Template scaffold — hub index and navigation page
**Portable**: Yes
**Reason**: It provides a simple central index linking core documents, track management, status, and commands, which is a common pattern for project hubs.
**Notes**: Reusable as a lightweight landing page for project documentation.
## plugins/conductor/templates/code_styleguides/general.md
**Type**: Style guide template
**Portable**: Yes
**Reason**: Language-agnostic guidance on readability, naming, comments, errors, testing, security, and performance can be reused across most codebases.
**Notes**: Best treated as a baseline code-quality SOP with only project-specific formatting and conventions swapped in.

## plugins/conductor/templates/code_styleguides/typescript.md
**Type**: Style guide template
**Portable**: Yes
**Reason**: The rules are TypeScript-specific, but the strictness, type-safety, module-organization, async, and testing guidance transfer cleanly to any TS project.
**Notes**: Most reusable as a project standard for strict compiler settings, explicit types, and disciplined exports/imports.

## plugins/conductor/templates/code_styleguides/python.md
**Type**: Style guide template
**Portable**: Yes
**Reason**: The guidance follows PEP 8 and modern Python practices, making it broadly reusable across Python repositories.
**Notes**: Strong fit for a Python house style covering naming, type hints, docstrings, tests, and error handling.

## plugins/conductor/templates/code_styleguides/go.md
**Type**: Style guide template
**Portable**: Yes
**Reason**: The file captures core Go idioms such as gofmt, explicit error handling, small interfaces, package layout, and table-driven tests.
**Notes**: Highly reusable as a Go project SOP; only package paths and toolchain details need local adjustment.
## plugins/conductor/templates/code_styleguides/csharp.md
**Type**: Portable style-guide SOP candidate — C# naming, async, DI, LINQ, testing, and code organization conventions
**Portable**: Yes
**Reason**: The guidance is mostly general engineering practice for readable, testable code: consistent naming, async/await usage, constructor injection, null handling, and orderly file structure.
**Notes**: Keep the C# syntax and library examples as illustrations; the reusable SOP is the convention checklist and maintenance habits.
## plugins/conductor/templates/code_styleguides/dart.md
**Type**: Portable style-guide SOP candidate — Dart null safety, async, widgets, state management, testing, and file organization conventions
**Portable**: Yes
**Reason**: The core advice generalizes well to Flutter work: prefer null-safe defaults, use async/await and parallel futures, keep widgets small and reusable, and structure code by feature.
**Notes**: Dart/Flutter-specific examples are useful references, but the portable piece is the readability, composition, and testing guidance.
## plugins/conductor/templates/code_styleguides/html-css.md
**Type**: Portable style-guide SOP candidate — semantic HTML, accessibility, responsive layout, and maintainable CSS conventions
**Portable**: Yes
**Reason**: The document captures broadly reusable front-end practices: semantic markup, BEM-style naming, keyboard/accessibility support, responsive design, and modern layout/performance patterns.
**Notes**: The HTML/CSS snippets are implementation examples; the durable SOP is the semantic, accessible, mobile-first styling checklist.
## plugins/conductor/templates/code_styleguides/javascript.md
**Type**: Portable style-guide SOP candidate — modern JavaScript syntax, async patterns, error handling, modules, and functional practices
**Portable**: Yes
**Reason**: The recommendations are general JavaScript hygiene: use const/let, prefer async/await, keep modules and functions composable, and handle errors explicitly.
**Notes**: The code samples are language-specific examples, but the underlying SOP is a reusable modern JS convention set.

## .claude-plugin/marketplace.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/accessibility-compliance/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/agent-orchestration/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/agent-teams/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/api-scaffolding/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/api-testing-observability/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/application-performance/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/arm-cortex-microcontrollers/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/backend-api-security/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/backend-development/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/blockchain-web3/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/business-analytics/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/c4-architecture/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/cicd-automation/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/cloud-infrastructure/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/code-documentation/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/code-refactoring/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/codebase-cleanup/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/comprehensive-review/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/conductor/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/content-marketing/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/context-management/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/customer-sales-automation/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/data-engineering/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/data-validation-suite/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/database-cloud-optimization/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/database-design/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/database-migrations/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/debugging-toolkit/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/dependency-management/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/deployment-strategies/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/deployment-validation/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/developer-essentials/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/distributed-debugging/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/documentation-generation/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/dotnet-contribution/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/error-debugging/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/error-diagnostics/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/framework-migration/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/frontend-mobile-development/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/frontend-mobile-security/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/full-stack-orchestration/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/functional-programming/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/game-development/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/git-pr-workflows/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/hr-legal-compliance/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/incident-response/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/javascript-typescript/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/julia-development/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/jvm-languages/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/kubernetes-operations/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/llm-application-dev/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/machine-learning-ops/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/meigen-ai-design/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/multi-platform-apps/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/observability-monitoring/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/payment-processing/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/performance-testing-review/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/plugin-eval/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/python-development/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/quantitative-trading/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/reverse-engineering/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/security-compliance/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/security-scanning/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/seo-analysis-monitoring/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/seo-content-creation/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/seo-technical-optimization/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/shell-scripting/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/startup-business-analyst/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/systems-programming/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/tdd-workflows/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/team-collaboration/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/ui-design/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/unit-testing/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

## plugins/web-scripting/.claude-plugin/plugin.json
**Type**: config **Portable**: no **Reason**: Plugin registry manifest — distribution metadata only, no procedural SOP content.

