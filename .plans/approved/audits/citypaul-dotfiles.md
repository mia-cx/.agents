# Role-to-SOP Audit: citypaul-dotfiles
**Audit date**: 2026-03-28  
**Source findings**: `raw-findings.md`  
**Auditor**: role-to-sop worker agent

---

## 1. Repo Overview

The citypaul-dotfiles repo is a Claude Code configuration system built and refined by Paul (citypaul), a TypeScript/DDD/TDD practitioner. The repo is structured as a `.references/citypaul-dotfiles/claude/` subtree containing a lean hub `.references/citypaul-dotfiles/claude/.claude/CLAUDE.md`, a rich agent library under `.references/citypaul-dotfiles/claude/.claude/agents/`, a slash-command set under `.references/citypaul-dotfiles/claude/.claude/commands/`, and a layered skill library under `.references/citypaul-dotfiles/claude/.claude/skills/` with companion `resources/` subdirectories. The dominant theme is disciplined TypeScript software engineering — TDD, hexagonal architecture, DDD, strict type safety, and functional patterns — applied with unusual rigour and explicit enforcement language. Content divides into five main categories: (1) TDD/testing discipline spanning workflow, quality measurement, and React/frontend test patterns; (2) architectural skills covering hexagonal architecture and DDD with deep companion resources; (3) project lifecycle management from feature planning through PR creation; (4) knowledge and documentation capture; and (5) code quality reference skills (functional patterns, strict TypeScript, CI debugging). Primary portability blockers are harness-specific frontmatter fields (`model`, `color`, `tools`, `allowed-tools`), internal cross-references between .references/citypaul-dotfiles/claude/.claude/agents/ and .references/citypaul-dotfiles/claude/.claude/skills/ by name, Claude Code slash-command `!`-injection syntax, and TypeScript/Zod-specific examples that are illustrative of universal patterns but surface as coupling. The DDD and hexagonal architecture resource sub-trees carry significant depth but require their parent skills for full interpretability. Attribution inside `.references/citypaul-dotfiles/claude/.claude/agents/use-case-data-patterns.md` confirms at least one file was itself ported from Kieran O'Hara's dotfiles, suggesting a prior extraction cycle has already refined some content.

---

## 2. Content Summary

### 2a. Core Hub
| File | Category | Portability Signal |
|------|----------|--------------------|
| `.references/citypaul-dotfiles/claude/.claude/CLAUDE.md` | Core philosophy hub | **HIGH** — four independently extractable SOPs (TDD mandate, output guardrails, TS strict, testing principles); lean-hub architecture is itself a portable meta-pattern |

### 2b. TDD / Testing Ecosystem
| File | Category | Portability Signal |
|------|----------|--------------------|
| `.references/citypaul-dotfiles/claude/.claude/agents/tdd-guardian.md` | TDD workflow agent | **HIGH** — dual-mode RED/GREEN/REFACTOR loop, violation detection, factory heuristic; no domain coupling |
| `.references/citypaul-dotfiles/claude/.claude/agents/refactor-scan.md` | Refactor assessment agent | **HIGH** — semantic-vs-structural duplication distinction, Skip tier, dual-mode; fully agnostic |
| `.references/citypaul-dotfiles/claude/.claude/skills/tdd/SKILL.md` | TDD workflow reference | **HIGH** — coverage exception process, TDD evidence-in-commits, refactoring priority matrix; unique gems |
| `.references/citypaul-dotfiles/claude/.claude/skills/front-end-testing/SKILL.md` | Testing philosophy reference | **HIGH** — coverage theater detection taxonomy, no-1:1-mapping, factory composition; rich reference |
| `.references/citypaul-dotfiles/claude/.claude/skills/mutation-testing/SKILL.md` | Mutation testing SOP | **HIGH** — fix-immediately-vs-ask-human triage, operator taxonomy, score benchmarks |
| `.references/citypaul-dotfiles/claude/.claude/skills/test-design-reviewer/SKILL.md` | Test quality scorer | **HIGH** — Farley Score formula, 8-property rubric, 1–10 band anchors |
| `.references/citypaul-dotfiles/claude/.claude/skills/refactoring/SKILL.md` | Refactor step reference | **MEDIUM** — post-GREEN commit discipline, DRY-as-knowledge framing; mostly overlaps with tdd-guardian |
| `.references/citypaul-dotfiles/claude/.claude/skills/react-testing/SKILL.md` | React testing reference | **MEDIUM** — vitest-browser-react patterns, hooks, anti-patterns; React-ecosystem-specific |
| `.references/citypaul-dotfiles/claude/.claude/skills/front-end-testing/SKILL.md` | Frontend UI testing SOP | **HIGH** — 8-tier a11y query hierarchy, browser-mode vs jsdom table, 14-item anti-pattern catalog |
| `.references/citypaul-dotfiles/claude/.claude/agents/ts-enforcer.md` | TypeScript strict auditor | **MEDIUM** — severity-tier report format, compliance score, proactive coaching scaffold; Zod examples need generalisation |
| `.references/citypaul-dotfiles/claude/.claude/skills/typescript-strict/SKILL.md` | TS config reference | **MEDIUM** — annotated tsconfig block (4 extra safety flags), schema-first decision matrix, branded types |
| `.references/citypaul-dotfiles/claude/.claude/skills/functional/SKILL.md` | Functional patterns | **MEDIUM** — pure functions, immutability, early returns, options objects, Result<T>; TS idioms illustrative only |

### 2c. Project Lifecycle Management
| File | Category | Portability Signal |
|------|----------|--------------------|
| `.references/citypaul-dotfiles/claude/.claude/agents/progress-guardian.md` | Feature lifecycle agent | **HIGH** — dual approval gates, per-step Done-when fields, end-of-feature closure ritual |
| `.references/citypaul-dotfiles/claude/.claude/commands/plan.md` | Pre-implementation planning | **HIGH** — plan file template, BDD acceptance criteria, MUTATE step; complete planning contract |
| `.references/citypaul-dotfiles/claude/.claude/commands/continue.md` | Post-merge handoff | **HIGH** — orientation ritual, "do NOT start implementing" constraint; concise and enforceable |
| `.references/citypaul-dotfiles/claude/.claude/commands/pr.md` | Pre-PR gate | **PARTIAL** — gate enforcement pattern is portable; content is mostly skill-reference-heavy |

### 2d. Knowledge / Documentation
| File | Category | Portability Signal |
|------|----------|--------------------|
| `.references/citypaul-dotfiles/claude/.claude/agents/docs-guardian.md` | Documentation quality agent | **HIGH** — 7-pillar framework, progressive-disclosure layer model, dual-mode assessment report |
| `.references/citypaul-dotfiles/claude/.claude/agents/learn.md` | Knowledge capture agent | **HIGH** — 5-scenario response library, significance-assessment rubric, documentation proposal format |
| `.references/citypaul-dotfiles/claude/.claude/agents/adr.md` | ADR author agent | **HIGH** — 5-question decision framework, anti-patterns list, retroactive ADR convention |
| `.references/citypaul-dotfiles/claude/.claude/skills/expectations/SKILL.md` | Documentation capture rules | **PARTIAL** — doc-capture SOP keeper; TDD/generic guidance dilutes the skill |

### 2e. Architecture / Design
| File | Category | Portability Signal |
|------|----------|--------------------|
| `.references/citypaul-dotfiles/claude/.claude/skills/hexagonal-architecture/SKILL.md` | Hex arch reference | **HIGH** — ports/adapters diagram, composition-root DI, fakes-over-mocks, 11-point checklist |
| `.references/citypaul-dotfiles/claude/.claude/skills/domain-driven-design/SKILL.md` | DDD reference | **HIGH** — decision tables, value objects, aggregates, bounded contexts, 17-point checklist |
| `.references/citypaul-dotfiles/claude/.claude/skills/twelve-factor/SKILL.md` | 12-Factor reference | **MEDIUM** — brownfield priority order, graceful-shutdown template, logging semantic contract |
| `.references/citypaul-dotfiles/claude/.claude/agents/twelve-factor-audit.md` | 12-Factor auditor | **HIGH** — 3-step audit SOP, false-positive guidance, compliance report template, 3 response modes |
| `.references/citypaul-dotfiles/claude/.claude/agents/use-case-data-patterns.md` | Use-case tracer | **MEDIUM** — 5-layer trace scaffold, 6-category code locations index, uncertainty protocol |
| `.references/citypaul-dotfiles/claude/.claude/skills/planning/SKILL.md` | Incremental planning reference | **PARTIAL** — MUTATE gate, human-approval-before-commit; slash-command refs require adaptation |

### 2f. Setup / Bootstrap
| File | Category | Portability Signal |
|------|----------|--------------------|
| `.references/citypaul-dotfiles/claude/.claude/commands/setup.md` | Project bootstrap command | **PARTIAL** — detection checklist portable; generation phase is Claude Code-specific |
| `.references/citypaul-dotfiles/claude/.claude/commands/generate-pr-review.md` | Meta PR review generator | **PARTIAL** — project-discovery protocol portable; embedded global rules are team-opinionated |
| `.references/citypaul-dotfiles/claude/.claude/agents/pr-reviewer.md` | PR review agent | **PARTIAL** — dual-mode scaffold, 5-category framework, severity tiers portable; review criteria team-opinionated |

### 2g. Frontend / CI
| File | Category | Portability Signal |
|------|----------|--------------------|
| `.references/citypaul-dotfiles/claude/.claude/skills/frontend-design/SKILL.md` | Frontend aesthetics | **LOW** — near-duplicate of existing workspace skill; two incremental refinements worth comparing |
| `.references/citypaul-dotfiles/claude/.claude/skills/ci-debugging/SKILL.md` | CI debug SOP | **HIGH** — hypothesis-first, environment delta matrix, full-error-reading, anti-pattern taxonomy |

### 2h. DDD Resource Sub-files
| File | Category | Portability Signal |
|------|----------|--------------------|
| `.references/citypaul-dotfiles/claude/.claude/skills/domain-driven-design/resources/domain-services.md` | DDD sub-resource | **MEDIUM** — when-NOT-to-use taxonomy, signature identification heuristic; supporting resource only |
| `.references/citypaul-dotfiles/claude/.claude/skills/domain-driven-design/resources/domain-events.md` | DDD sub-resource | **MEDIUM** — Decider pattern, dispatch escalation table; deep reference, not standalone SOP |
| `.references/citypaul-dotfiles/claude/.claude/skills/domain-driven-design/resources/bounded-contexts.md` | DDD sub-resource | **MEDIUM** — 6-pattern context mapping table, 3-tier split signal taxonomy; pairs with ubiquitous-language skill |
| `.references/citypaul-dotfiles/claude/.claude/skills/domain-driven-design/resources/aggregate-design.md` | DDD sub-resource | **MEDIUM** — sizing test, split-vs-combine heuristic, optimistic locking; supporting resource |
| `.references/citypaul-dotfiles/claude/.claude/skills/domain-driven-design/resources/error-modeling.md` | DDD sub-resource | **MEDIUM** — user-action legitimacy heuristic, layered propagation contract; supporting resource |
| `.references/citypaul-dotfiles/claude/.claude/skills/domain-driven-design/resources/testing-by-layer.md` | DDD sub-resource | **MEDIUM** — four-tier strategy, fake-vs-mock compile-time rationale; could merge into testing SOP |
| `.references/citypaul-dotfiles/claude/.claude/skills/hexagonal-architecture/resources/cross-cutting-concerns.md` | Hex arch sub-resource | **MEDIUM** — placement rules for auth/logging/tx/errors/validation; summary table is self-contained |
| `.references/citypaul-dotfiles/claude/.claude/skills/hexagonal-architecture/resources/cqrs-lite.md` | Hex arch sub-resource | **MEDIUM** — N+1/boundary/denormalisation forcing function; upgrade criteria |
| `.references/citypaul-dotfiles/claude/.claude/skills/hexagonal-architecture/resources/incremental-adoption.md` | Hex arch sub-resource | **MEDIUM** — 6-step Strangler Fig, migrate-first priority matrix; adoption annex |
| `.references/citypaul-dotfiles/claude/.claude/skills/hexagonal-architecture/resources/testing-hex-arch.md` | Hex arch sub-resource | **MEDIUM** — four-tier priority, swappability test, fakes rationale |
| `.references/citypaul-dotfiles/claude/.claude/skills/hexagonal-architecture/resources/worked-example.md` | Hex arch sub-resource | **PARTIAL** — "What Lives Where" table and 9-section structure portable; domain and stack examples need substitution |

---

## 3. SOP Split

### Port ✅

| File | Reason |
|------|--------|
| `.references/citypaul-dotfiles/claude/.claude/agents/tdd-guardian.md` | Self-contained RED/GREEN/REFACTOR discipline + violation reporting; one small section to strip |
| `.references/citypaul-dotfiles/claude/.claude/agents/docs-guardian.md` | 7 Pillars + progressive-disclosure model; fully domain-agnostic |
| `.references/citypaul-dotfiles/claude/.claude/agents/adr.md` | 5-question decision framework + template; zero repo coupling |
| `.references/citypaul-dotfiles/claude/.claude/agents/learn.md` | 5-scenario knowledge-capture library + significance rubric; strip local section names only |
| `.references/citypaul-dotfiles/claude/.claude/agents/refactor-scan.md` | Semantic-vs-structural DRY + Skip tier + dual-mode; universally applicable |
| `.references/citypaul-dotfiles/claude/.claude/agents/progress-guardian.md` | Dual approval gates + Done-when fields + closure ritual; no domain coupling |
| `.references/citypaul-dotfiles/claude/.claude/agents/twelve-factor-audit.md` | 3-step audit SOP + false-positive guidance; methodology is universal |
| `.references/citypaul-dotfiles/claude/.claude/commands/plan.md` | Plan file template + BDD acceptance criteria + MUTATE step; strip harness syntax only |
| `.references/citypaul-dotfiles/claude/.claude/commands/continue.md` | Post-merge orientation ritual; strip `!` injection blocks |
| `.references/citypaul-dotfiles/claude/.claude/skills/tdd/SKILL.md` | TDD evidence-in-commits + coverage exception process; unique over tdd-guardian |
| `.references/citypaul-dotfiles/claude/.claude/skills/front-end-testing/SKILL.md` | Coverage theater taxonomy + factory composition; deep reference complement |
| `.references/citypaul-dotfiles/claude/.claude/skills/mutation-testing/SKILL.md` | Fix-immediately-vs-ask-human triage + report template; fills a gap |
| `.references/citypaul-dotfiles/claude/.claude/skills/test-design-reviewer/SKILL.md` | Farley Score rubric; fully self-contained |
| `.references/citypaul-dotfiles/claude/.claude/skills/front-end-testing/SKILL.md` | 8-tier a11y query hierarchy + browser-mode table + 14-item anti-pattern catalog |
| `.references/citypaul-dotfiles/claude/.claude/skills/ci-debugging/SKILL.md` | Hypothesis-first + environment delta matrix; fully generic |
| `.references/citypaul-dotfiles/claude/.claude/skills/hexagonal-architecture/SKILL.md` | Ports/adapters model + fakes + 11-point checklist; strip resource cross-references |
| `.references/citypaul-dotfiles/claude/.claude/skills/domain-driven-design/SKILL.md` | Full DDD building blocks + decision tables + 17-point checklist; strip resource cross-references |
| `.references/citypaul-dotfiles/claude/.claude/skills/twelve-factor/SKILL.md` | Brownfield priority order + graceful shutdown + logging contract |
| `.references/citypaul-dotfiles/claude/.claude/skills/functional/SKILL.md` | 6 functional patterns + Result<T>; TS idioms illustrative |
| `.references/citypaul-dotfiles/claude/.claude/skills/refactoring/SKILL.md` | Commit discipline + DRY-as-knowledge + don't-extract-for-testability |
| `.references/citypaul-dotfiles/claude/.claude/skills/react-testing/SKILL.md` | vitest-browser-react patterns + 12-item checklist; React-ecosystem specific but self-contained |

### Partial ⚠️ (strip-then-port)

| File | Reason |
|------|--------|
| `.references/citypaul-dotfiles/claude/.claude/agents/ts-enforcer.md` | Core report format portable; Zod examples and internal skill refs need generalisation |
| `.references/citypaul-dotfiles/claude/.claude/agents/pr-reviewer.md` | Structural scaffold portable; review criteria encode one team's philosophy — treat as slots |
| `.references/citypaul-dotfiles/claude/.claude/agents/use-case-data-patterns.md` | 5-layer trace and 6-category index are portable; worked examples are domain-heavy |
| `.references/citypaul-dotfiles/claude/.claude/commands/pr.md` | Gate enforcement pattern portable; gate content is mostly named-skill references |
| `.references/citypaul-dotfiles/claude/.claude/commands/setup.md` | Detection checklist portable; generation phase targets Claude Code platform specifics |
| `.references/citypaul-dotfiles/claude/.claude/commands/generate-pr-review.md` | Project-discovery protocol portable; global rules block is team-opinionated |
| `.references/citypaul-dotfiles/claude/.claude/skills/expectations/SKILL.md` | Doc-capture SOP + 6-type taxonomy + template are portable; TDD + generic guidance should be stripped |
| `.references/citypaul-dotfiles/claude/.claude/skills/planning/SKILL.md` | MUTATE gate + human-approval primitive portable; `/plan`/`/continue` refs need adaptation |
| `.references/citypaul-dotfiles/claude/.claude/skills/typescript-strict/SKILL.md` | Annotated tsconfig block + schema-first matrix portable; Zod syntax needs generalisation |
| `.references/citypaul-dotfiles/claude/.claude/skills/domain-driven-design/resources/` (all) | Decision heuristics and tables portable; best role is companion resources within a DDD skill bundle |
| `.references/citypaul-dotfiles/claude/.claude/skills/hexagonal-architecture/resources/` (all) | Swappability test, CQRS-lite forcing function, cross-cutting placement rules portable; supporting resources only |

### Leave out ❌

| File | Reason |
|------|--------|
| `.references/citypaul-dotfiles/claude/.claude/skills/frontend-design/SKILL.md` | Near-duplicate of existing workspace `web-frontend-design` skill; two incremental refinements are not sufficient to warrant a new extraction — verify and merge at compare stage instead |

---

## 4. Per-SOP Detail Table

| Source file | Trigger | Steps / contract | Quality bar | Strip | Notes |
|-------------|---------|-----------------|-------------|-------|-------|
| `.references/citypaul-dotfiles/claude/.claude/agents/tdd-guardian.md` | User plans to write code (proactive); code already written or tests green (reactive) | RED: simplest failing test → GREEN: minimal implementation → REFACTOR: assess value → COMMIT; reactive: audit test-first order via git diff, emit structured violation report | Factory-over-let/beforeEach; behavior-vs-implementation naming; violation report includes file, issue, git evidence, recommendation | "Project-Specific Guidelines" section (TS `type`/`interface` rules, Zod note, no-comments rule); hardcoded `model`/`color` frontmatter | Factory heuristic and violation report format are verbatim-worthy gems |
| `.references/citypaul-dotfiles/claude/.claude/agents/docs-guardian.md` | User creating documentation (proactive); existing docs need review (reactive) | Proactive: clarify audience/purpose → recommend structure by doc type → apply progressive-disclosure layers → create navigation aids; reactive: read files → assess against 7-pillar checklist → emit severity-tiered report (exec summary → strengths → critical → high-priority → enhancements → restructuring → actions) | 7 Pillars: Clarity, Completeness, Accuracy, Navigability, Progressiveness, Consistency, Maintainability | Frontmatter (`model`, `color`, `tools`); three full document templates (condense to slot summaries); overlapping Response Patterns section | 7 Pillars + progressive-disclosure layer model is the standout portable artifact |
| `.references/citypaul-dotfiles/claude/.claude/agents/adr.md` | Evaluating technology options / making foundational decisions (proactive); documenting choices already made (reactive) | Apply 5-question "should I create an ADR?" framework (3+ YES → create); determine next ADR number; gather context/alternatives/trade-offs/consequences; write ADR using standard template; update index | 5-question threshold prevents ADR inflation; standard template covers Status, Date, Decision Makers, Tags, Context, Decision, Alternatives, Consequences, Implementation Notes, Related Decisions, References | `color: purple`, `model: sonnet` frontmatter; companion-agent cross-references (progress-guardian, docs-guardian, learn) | Retroactive ADR convention (`Status: Accepted (Retroactive)`) and explicit anti-patterns section are verbatim-worthy |
| `.references/citypaul-dotfiles/claude/.claude/agents/learn.md` | Learning moments mid-development (proactive); after feature/bug-fix/architecture completion (reactive) | Identify learning moment → ask discovery questions (problem/solution/context axes) → read current persistent context file for duplication → classify into section → format to match document voice → emit proposal (Summary / Proposed Location / Proposed Addition / Rationale / Verification Checklist) | Significance rubric: document if ANY of 7 conditions; skip only if ALL of 4 conditions met | All hardcoded CLAUDE.md section names in "Classify the Learning"; worked Zod-schema example; `model: sonnet`, `color: blue` frontmatter; `grep` commands referencing CLAUDE.md literally | 5-scenario response-pattern library and significance rubric are verbatim-worthy |
| `.references/citypaul-dotfiles/claude/.claude/agents/refactor-scan.md` | User asks "should I abstract this?" (proactive); after tests turn GREEN as TDD third step (reactive) | Proactive: understand proposed refactor → apply semantic test (same concept or same structure?) → assess value → recommend with rationale; reactive: git diff → assess 5 dimensions (Naming, Structural Simplicity, Knowledge Duplication, Abstraction Opportunities, Immutability/Functional) → classify into 🔴/⚠️/💡/✅ Skip → emit report with commit-sequencing action plan | "DRY is about knowledge duplication, not code duplication" — semantic heuristic: if business rules for X change, should Y change? | `model`, `color`, `tools` frontmatter; "Per CLAUDE.md:" sacred-rule citations; TS-specific syntax in examples; domain-specific example details | Explicit ✅ Skip tier is the standout differentiator vs. generic refactoring checklists |
| `.references/citypaul-dotfiles/claude/.claude/agents/progress-guardian.md` | Starting significant work (proactive — draft plan); during work at each milestone; feature declared complete | Draft plan (Goal + Acceptance Criteria + Steps with Test + Done-when fields) → present for approval before writing; after each RED-GREEN-REFACTOR: request explicit commit approval; plan change: propose old-vs-new diff + require approval; feature complete: verify criteria + tests → invoke learn/adr → delete plan file | All acceptance criteria met + all tests passing before closure; per-step Done-when fields make completion unambiguous | `model`, `color`, `tools` frontmatter; named-agent cross-references in integration table; Pre-PR Quality Gate block referencing specific skills by name | Dual approval gates (plan changes + commits) and Done-when field are verbatim-worthy |
| `.references/citypaul-dotfiles/claude/.claude/agents/twelve-factor-audit.md` | Onboarding to a service project; assessing deployment readiness; user asks for "12-factor" or "compliance audit" | Discover structure (ls, git log, glob for Dockerfile/.env.example/k8s configs, detect monorepo) → audit each of 12 factors using grep patterns with explicit false-positive guidance per factor → generate compliance report (`.references/citypaul-dotfiles/claude/.claude/agents/twelve-factor-audit.md`) with factor summary table (✅/⚠️/❌), per-factor detail with file:line citations, code suggestions, prioritised action plan | Three response modes: full audit, quick health check (factors III/VI/IX only), single-factor deep-dive | Agent config frontmatter; pi-specific tool names → normalise to "search"/"read" verbs; Node.js/TS-specific patterns → move to language-adapter appendix | False-positive callouts (e.g., don't flag `localhost` in `.env.example`) are unusually mature tribal knowledge |
| `.references/citypaul-dotfiles/claude/.claude/commands/plan.md` | User wants to plan a feature before writing any code | If on main, create feature branch → explore relevant codebase areas (read-only) → write plan to `plans/<feature-name>.md` → open PR for plan review — zero implementation files | Plan file: Goal (one sentence) + BDD Acceptance Criteria + per-step RED/GREEN/REFACTOR/MUTATE/Done-when + Pre-PR Quality Gate | `allowed-tools` and `!`-injected context-injection frontmatter; named skill cross-references → verb descriptions; hardcoded `plans/` path → parameterise | MUTATE step and "No production code without a failing test. No exceptions." language are verbatim-worthy |
| `.references/citypaul-dotfiles/claude/.claude/commands/continue.md` | After a PR is merged, ready to start next slice | git pull main → read plan file → mark completed items → create new branch → summarise completed + what's next | "Do NOT start implementing anything yet" hard constraint | Inline `!` backtick dynamic context injections | Check delta against existing `next-slice` skill before promoting |
| `.references/citypaul-dotfiles/claude/.claude/skills/tdd/SKILL.md` | Any code-generation task — features, bug fixes, refactoring | RED (failing test first) → GREEN (minimum code, commit immediately) → REFACTOR (assess after every green, commit before refactoring); Coverage: run it yourself, never trust a claim; Exception process: document in README → get approval → document in context file | 100% coverage gate with formal 3-step exception process; TDD evidence-in-commits with named exception categories | Toolchain-specific commands (pnpm, vitest); conventional commit prose intro; `load the testing/refactoring skill` cross-references | TDD evidence-in-commits section and coverage exception process are the highest-value unique adds over tdd-guardian |
| `.references/citypaul-dotfiles/claude/.claude/skills/front-end-testing/SKILL.md` | Writing tests, creating test factories, structuring test files, deciding what to test | Four reference modules: (1) Test Through Public API; (2) Coverage Through Behavior (ask "what business behavior am I missing?"); (3) Factory Pattern (`getMockX(overrides?)` with real schema validation); (4) Coverage Theater Detection (4 named anti-patterns with ❌/✅); (5) No 1:1 Mapping; (6) 10-item checklist | Factory validates with real schema; no `let`/`beforeEach`; compose factories for nested objects; `Pick<T, 'field1'>` to constrain overrides | Frontmatter companion-skill cross-references → generic; TypeScript idioms noted as TS-specific | Coverage Theater Detection taxonomy and factory composition pattern are the unique value-adds |
| `.references/citypaul-dotfiles/claude/.claude/skills/mutation-testing/SKILL.md` | After TDD GREEN phase; when reviewing branch changes; test suite has high coverage but low confidence | Identify changed code via git diff → for each function: select operators, mutate, run tests, revert → produce Killed/Survived report with action per survived mutant → fix using TDD (write failing test against mutated code first) | Fix immediately: realistic bug in critical path, simple boundary test; ask human: uncertain, complex, or likely equivalent; mutation score benchmarks: <60% inadequate, 60–80% acceptable, 80–90% good, >90% excellent | Stryker integration section (optional appendix); ASCII TDD diagram; Method Expression Mutations table → language-specific appendix | Fix-immediately-vs-ask-human triage and "prove it, don't reason about it" instruction are verbatim-worthy |
| `.references/citypaul-dotfiles/claude/.claude/skills/test-design-reviewer/SKILL.md` | Reviewing tests; assessing test suite quality; analysing test effectiveness | Read tests before implementation → score each of 8 properties 1–10 with evidence → apply weighted Farley Score formula → output structured table + score + detailed analysis + ranked recommendations | Weighted Farley Score formula; 8-property rubric (UMRANGT+F) with 1/3/5/7/10 band anchors per property | Hardcoded `model: sonnet`, `agent: Explore`, `context: fork` frontmatter fields | Farley Score formula with weights and justifications is a rare, concrete, copy-paste-ready artifact |
| `.references/citypaul-dotfiles/claude/.claude/skills/front-end-testing/SKILL.md` | Writing UI tests for any front-end application; querying DOM elements; simulating user interactions; browser-based testing setup | Nine reference modules covering: Vitest Browser Mode setup and why-over-jsdom (6-dimension table), query selection 8-tier hierarchy, userEvent vs fireEvent, async patterns (findBy/waitFor), MSW network interception, accessibility-first testing, 14-item anti-pattern catalog, 12-item checklist | Query selection hierarchy: role → labelText → placeholderText → text → displayValue → altText → title → testId; userEvent.setup() per-test pattern mandatory; idempotency rules for browser mode | Companion skill cross-references → verb descriptions; "2025" annotation; frontmatter `react-testing` reference | 8-tier query hierarchy with embedded a11y rationale and 14-item anti-pattern catalog are verbatim-worthy |
| `.references/citypaul-dotfiles/claude/.claude/skills/ci-debugging/SKILL.md` | Debugging CI failures, build issues, or test pipeline problems | Generate ≥3 hypotheses before investigating → reproduce locally using exact failing command → run environment delta analysis (8 factors: runtime version, OS, deps, env vars, parallelism, resources, network, filesystem) → read full error output from top → explain why fix addresses root cause, verify locally, confirm it doesn't mask deeper issue | "Every CI failure is real until proven otherwise"; formal flakiness standard: identical environment + identified non-deterministic source = evidence required | Nothing — fully generic | Environment delta table fills a gap not covered by other skills |
| `.references/citypaul-dotfiles/claude/.claude/skills/hexagonal-architecture/SKILL.md` | Implementing ports, adapters, dependency inversion, or domain isolation; incremental hex arch adoption | Define port interfaces in domain → implement driven adapters per technology → wire at composition root → use cases named after business operation → reads via CQRS-lite query functions → test at use-case boundary with fakes → verify swappability | Domain has zero infra imports; swapping any adapter requires zero domain changes; test with in-memory fakes (not mocks) | `resources/` relative-link references (sibling files won't exist in new context); `.references/citypaul-dotfiles/claude/.claude/skills/REFERENCES.md` cross-reference | "If swapping an adapter requires changing domain code, the boundary is wrong" heuristic is verbatim-worthy |
| `.references/citypaul-dotfiles/claude/.claude/skills/domain-driven-design/SKILL.md` | Implementing value objects, entities, aggregates, domain events, domain services, bounded contexts | Assess DDD fitness → establish glossary → model value objects with factory functions → define entities with branded IDs + always-valid principle → apply discriminated unions → design aggregates → extract domain services → define repository interfaces in domain → model outcomes as result types → draw bounded context boundaries; 17-point checklist | "Where Does This Code Belong?" decision table; make-illegal-states-unrepresentable with exhaustive switch + never guard; cross-aggregate refs by ID only | `resources/` directory `Load when...` references; `hexagonal-architecture`/`typescript-strict` cross-references → inline note | DDD decision tables and 17-point checklist are copy-paste-ready; strip resource file paths |
| `.references/citypaul-dotfiles/claude/.claude/skills/twelve-factor/SKILL.md` | Configuring env vars, backing services, startup/shutdown; reviewing deployment readiness | Reference by factor; brownfield priority order: Config → Logs → Disposability → Backing services → Stateless processes; graceful shutdown template: SIGTERM/SIGINT handlers, 30s drain timeout, force-exit fallback, non-zero exit on failure; 7-property structured logging contract; 17-item compliance checklist | Greenfield/brownfield split; all-app vs backend-only factor scoping | TS/Node.js syntax in examples → pseudocode or "TS idioms" note; cross-skill references → generic; `.env.example` sample → condense to note | Brownfield priority order with rationale is rarely stated this explicitly elsewhere |
| `.references/citypaul-dotfiles/claude/.claude/skills/functional/SKILL.md` | Writing logic, data transformations, handling mutation bugs, applying functional patterns | Reference catalog with ❌/✅ before/after for: immutable array ops, object spread, nested updates, early returns, Result<T> error type, pure function isolation, options objects, composition, readonly properties; 8-item summary checklist | "Functional Light" positioning (practical, not academic FP); `readonly` enforcement; no comments / self-documenting code rule | `ReadonlyArray<T>`, `readonly` modifier, TypeScript generics → note as TS-only; no harness-specific content | "Functional Light" framing and Result<T> pattern are distinguishing value vs. generic FP guidance |
| `.references/citypaul-dotfiles/claude/.claude/agents/ts-enforcer.md` | Defining types/schemas or writing TypeScript (proactive); auditing files for type-safety compliance (reactive) | Scan TS files; verify tsconfig strict flags; grep for critical violations (`any`, `as`, `@ts-ignore`, `interface`, mutations); validate schema-first at trust boundaries; emit severity-tiered report (🔴 CRITICAL / ⚠️ HIGH PRIORITY / 💡 STYLE) with file:line citations, issue, impact, and fix | Compliance score as %; per-violation blocks with file/code/issue/impact/fix; compliant-files list; next-steps checklist | `model`, `color`, `tools` frontmatter; internal cross-references to companion skills; Zod-specific syntax → schema-lib placeholder | Proactive "response pattern" template (What → Issue → Correct approach → Why) is a portable teaching scaffold worth extracting independently |
| `.references/citypaul-dotfiles/claude/.claude/agents/pr-reviewer.md` | User asks to review a PR, check merge-readiness, or understand a specific issue | Gather PR info via `gh pr view`/`gh pr diff` → categorise changed files → evaluate 5 categories with detection commands → generate structured report with summary table + severity tiers → post review via MCP tools, `gh pr review`, or `gh pr comment` | 5 categories × (principle / check-for / detection-commands / report-format); severity legend; quality-gate checklists; posting-methods reference table | Repo-specific coding mandates (TDD-first as hard gate, no-`any`-ever, functional-only, no-comments, `type` vs `interface` — replace with project-slot) | Category-table + severity-tier report template and GitHub posting section are the strongest portable primitives |

---

## 5. Portability Ranking

### Tier 1 — High (port verbatim with minor strip)

1. **`.references/citypaul-dotfiles/claude/.claude/agents/tdd-guardian.md`** — Best-in-class TDD enforcement agent; dual-mode, violation report format, factory heuristic
2. **`.references/citypaul-dotfiles/claude/.claude/agents/docs-guardian.md`** — 7 Pillars + progressive-disclosure model + dual-mode assessment; domain-agnostic
3. **`.references/citypaul-dotfiles/claude/.claude/agents/adr.md`** — 5-question decision framework + complete template; zero coupling
4. **`.references/citypaul-dotfiles/claude/.claude/agents/learn.md`** — 5-scenario knowledge-capture library + significance rubric; unique knowledge-management workflow
5. **`.references/citypaul-dotfiles/claude/.claude/agents/progress-guardian.md`** — Dual approval gates + Done-when per step + closure ritual; lifecycle management gap-filler
6. **`.references/citypaul-dotfiles/claude/.claude/agents/twelve-factor-audit.md`** — 3-step audit SOP with false-positive guidance; clean compliance-checker workflow
7. **`.references/citypaul-dotfiles/claude/.claude/commands/plan.md`** — Plan file template + MUTATE step + BDD acceptance criteria; rare pre-implementation planning contract
8. **`.references/citypaul-dotfiles/claude/.claude/skills/mutation-testing/SKILL.md`** — Fix-immediately-vs-ask-human triage + score benchmarks; unique agent human-in-loop contract
9. **`.references/citypaul-dotfiles/claude/.claude/skills/front-end-testing/SKILL.md`** — 8-tier a11y query hierarchy + browser-mode table + 14-item anti-pattern catalog
10. **`.references/citypaul-dotfiles/claude/.claude/skills/ci-debugging/SKILL.md`** — Hypothesis-first + environment delta matrix; fills a gap absent in all other audited repos
11. **`.references/citypaul-dotfiles/claude/.claude/agents/refactor-scan.md`** — Semantic DRY distinction + Skip tier; best refactoring-decision logic seen in audit
12. **`.references/citypaul-dotfiles/claude/.claude/skills/hexagonal-architecture/SKILL.md`** — Complete ports/adapters SOP with swappability test and testing strategy

### Tier 2 — Medium (port with moderate generalisation)

13. **`.references/citypaul-dotfiles/claude/.claude/skills/tdd/SKILL.md`** — TDD evidence-in-commits + coverage exception process (unique over tdd-guardian)
14. **`.references/citypaul-dotfiles/claude/.claude/skills/front-end-testing/SKILL.md`** — Coverage theater detection + factory composition (unique depth over tdd-guardian)
15. **`.references/citypaul-dotfiles/claude/.claude/skills/test-design-reviewer/SKILL.md`** — Farley Score formula; self-contained scorer
16. **`.references/citypaul-dotfiles/claude/.claude/CLAUDE.md`** — Output guardrails SOP ("write to files not chat", "plan-only mode") + TDD mandate hub
17. **`.references/citypaul-dotfiles/claude/.claude/skills/domain-driven-design/SKILL.md`** — Full DDD building blocks with decision tables (resource refs need stripping)
18. **`.references/citypaul-dotfiles/claude/.claude/skills/twelve-factor/SKILL.md`** — Brownfield priority order + graceful shutdown template
19. **`.references/citypaul-dotfiles/claude/.claude/skills/functional/SKILL.md`** — Functional-light positioning + Result<T>
20. **`.references/citypaul-dotfiles/claude/.claude/skills/refactoring/SKILL.md`** — "Don't extract purely for testability" rule; commit discipline
21. **`.references/citypaul-dotfiles/claude/.claude/commands/continue.md`** — Post-merge orientation ritual; concise and enforceable
22. **`.references/citypaul-dotfiles/claude/.claude/agents/ts-enforcer.md`** — Severity-tier report format + teaching scaffold (Zod generalisation needed)
23. **`.references/citypaul-dotfiles/claude/.claude/skills/react-testing/SKILL.md`** — vitest-browser-react patterns; within React ecosystem

### Tier 3 — Partial (strip-then-port or use as reference block)

24. **`.references/citypaul-dotfiles/claude/.claude/agents/pr-reviewer.md`** — Structural scaffold + severity tiers; review criteria must be treated as slots
25. **`.references/citypaul-dotfiles/claude/.claude/agents/use-case-data-patterns.md`** — 5-layer trace scaffold useful as investigation checklist
26. **`.references/citypaul-dotfiles/claude/.claude/commands/setup.md`** — Detection checklist portion only; generation phase is harness-bound
27. **`.references/citypaul-dotfiles/claude/.claude/commands/pr.md`** — Gate enforcement pattern only; gate content is named-skill-heavy
28. **`.references/citypaul-dotfiles/claude/.claude/skills/expectations/SKILL.md`** — Doc-capture SOP + 6-type taxonomy (strip TDD/generic sections)
29. **`.references/citypaul-dotfiles/claude/.claude/skills/planning/SKILL.md`** — Human-approval-before-commit primitive (slash-command refs need rework)
30. **`.references/citypaul-dotfiles/claude/.claude/skills/typescript-strict/SKILL.md`** — Annotated tsconfig block + branded types (complementary to ts-enforcer)
31. **`.references/citypaul-dotfiles/claude/.claude/skills/domain-driven-design/resources/`** (all) — High-quality reference blocks; best role as companion resources within DDD skill bundle
32. **`.references/citypaul-dotfiles/claude/.claude/skills/hexagonal-architecture/resources/`** (all) — Swappability test, CQRS-lite forcing function, cross-cutting placement rules

---

## 6. Cross-Cutting Protocol Primitives

These patterns appear in two or more files and should be factored into shared rules rather than duplicated per skill.

### P1: Dual-Mode Invocation (proactive + reactive)
**Appears in**: `tdd-guardian`, `ts-enforcer`, `pr-reviewer`, `docs-guardian`, `learn`, `refactor-scan`, `use-case-data-patterns`  
**Pattern**: Every agent offers two distinct entry points — proactive (user signals intent to do X) and reactive (user asks for audit of existing X). Each mode has its own response-pattern template with different steps and deliverable contracts. This prevents agents from being one-shot tools and makes them genuinely session-long collaborators.  
**Extract as**: A shared framing convention for all skill definitions: "Proactive / Reactive" dual-mode sections with explicit trigger conditions per mode.

### P2: Severity-Tiered Findings (🔴 Critical / ⚠️ High / 💡 Suggestion / ✅ Good)
**Appears in**: `tdd-guardian` (violation report), `ts-enforcer`, `pr-reviewer`, `docs-guardian`, `refactor-scan`  
**Pattern**: Findings are classified into three or four tiers with consistent emoji anchors. Each finding block uses a fixed schema (location/file, problem/issue, fix/recommendation). A summary table with counts per tier is generated at the end. The ✅ Skip / ✅ Good tier is equally important — explicitly saying "nothing to fix here" is as useful as flagging problems.  
**Extract as**: A shared "severity-tiered report" template usable by any audit-mode skill.

### P3: Explicit Approval Gates (plan approval + commit approval)
**Appears in**: `progress-guardian`, `.references/citypaul-dotfiles/claude/.claude/commands/plan.md`, `.references/citypaul-dotfiles/claude/.claude/commands/continue.md`, `.references/citypaul-dotfiles/claude/.claude/commands/pr.md`, `.references/citypaul-dotfiles/claude/.claude/commands/setup.md`  
**Pattern**: The agent never acts autonomously on consequential changes. Plan files require explicit approval before writing. Commits require explicit user approval after each RED-GREEN-REFACTOR cycle. Plan modifications require a diff-view approval. The "no autonomous commits" contract is stated as non-negotiable in multiple files.  
**Extract as**: A shared "human-approval gate" rule applicable to any lifecycle-management or code-generation skill.

### P4: Structured Deliverable Contract (not prose, always a Markdown artifact)
**Appears in**: `adr`, `learn`, `refactor-scan`, `twelve-factor-audit`, `docs-guardian`, `.references/citypaul-dotfiles/claude/.claude/commands/plan.md`, `.references/citypaul-dotfiles/claude/.claude/skills/tdd/SKILL.md`  
**Pattern**: Every agent produces a named, structured Markdown artifact — not a conversational response. The artifact format is fully specified in the skill with named sections and slot annotations. This enforces operationalisability: another agent can parse the output.  
**Extract as**: A shared "emit structured artifact" convention: every SOP should specify its output format with named slots.

### P5: Factory-Over-Let/BeforeEach
**Appears in**: `tdd-guardian`, `.references/citypaul-dotfiles/claude/.claude/skills/front-end-testing/SKILL.md`, `.references/citypaul-dotfiles/claude/.claude/CLAUDE.md`, `.references/citypaul-dotfiles/claude/.claude/skills/react-testing/SKILL.md`  
**Pattern**: Test data is always created via factory functions (`getMockX(overrides?: Partial<T>)`) that validate using the real schema and return complete objects. No shared `let` variables in test scope, no `beforeEach` setup for data. Factory functions compose for nested objects. This is stated in four independent files with consistent language.  
**Extract as**: A canonical factory-pattern rule to reference from any testing skill rather than restating.

### P6: DRY-as-Knowledge-Duplication, Not Code-Duplication
**Appears in**: `.references/citypaul-dotfiles/claude/.claude/agents/refactor-scan.md`, `.references/citypaul-dotfiles/claude/.claude/skills/refactoring/SKILL.md`, `.references/citypaul-dotfiles/claude/.claude/agents/tdd-guardian.md`  
**Pattern**: The semantic test — "if the business rules for X change, should Y change too?" — is the deciding heuristic. Identical code that represents different knowledge should NOT be DRY'd. This is the most consistently stated refactoring principle across all files.  
**Extract as**: A canonical DRY definition rule referenced from any refactoring or code-quality skill.

### P7: Behavior-Not-Implementation Testing
**Appears in**: `tdd-guardian`, `.references/citypaul-dotfiles/claude/.claude/skills/front-end-testing/SKILL.md`, `.references/citypaul-dotfiles/claude/.claude/CLAUDE.md`, `.references/citypaul-dotfiles/claude/.claude/skills/front-end-testing/SKILL.md`, `.references/citypaul-dotfiles/claude/.claude/skills/tdd/SKILL.md`  
**Pattern**: Tests verify observable business outcomes via public API, never internal state or private methods. Test names describe business behavior. Coverage is measured by business behavior coverage, not line coverage. No 1:1 mapping between test files and implementation files.  
**Extract as**: A canonical "test philosophy" rule referenced by all testing skills.

### P8: Knowledge Capture as a Ritual
**Appears in**: `.references/citypaul-dotfiles/claude/.claude/agents/learn.md`, `.references/citypaul-dotfiles/claude/.claude/skills/expectations/SKILL.md`, `.references/citypaul-dotfiles/claude/.claude/agents/progress-guardian.md` (end-of-feature closure), `.references/citypaul-dotfiles/claude/.claude/agents/adr.md`  
**Pattern**: At the end of every significant work unit, an explicit prompt fires: "What do I wish I'd known?" The classification taxonomy (gotcha / pattern / decision / anti-pattern / edge case / tool knowledge) and the significance rubric (document if ANY of N criteria) are designed to trigger at the same lifecycle moments. Progress-guardian explicitly hands off to `learn` and `adr` agents at closure.  
**Extract as**: A shared "end-of-task knowledge ritual" convention that any lifecycle-management skill should invoke.

---

## 7. Default Recommendation

**Top picks for cross-repo comparison** — ordered by unique value and extraction readiness:

1. **`.references/citypaul-dotfiles/claude/.claude/agents/tdd-guardian.md`** — Best TDD workflow agent candidate seen in the audit. The dual-mode design, violation report template, and factory/behavior-naming heuristics are production-ready. Compare against any TDD agent from other repos.

2. **`.references/citypaul-dotfiles/claude/.claude/skills/mutation-testing/SKILL.md`** — Highest-quality treatment of the MUTATE step in the TDD loop. The fix-immediately-vs-ask-human triage contract and the "prove it, don't reason about it" instruction are uniquely precise among all audited repos. No equivalent found elsewhere.

3. **`.references/citypaul-dotfiles/claude/.claude/agents/docs-guardian.md`** — 7 Pillars + progressive-disclosure layer model is the most structured documentation-quality SOP in the audit. Compare against any docs-review agent from other repos.

4. **`.references/citypaul-dotfiles/claude/.claude/agents/adr.md`** — 5-question ADR decision framework is the most concise and actionable ADR guardrail found. The retroactive ADR convention is practical tribal knowledge worth promoting.

5. **`.references/citypaul-dotfiles/claude/.claude/agents/learn.md`** — 5-scenario response-pattern library with significance rubric is the strongest knowledge-capture agent primitive found. Compare against similar agents across all repos.

6. **`.references/citypaul-dotfiles/claude/.claude/commands/plan.md`** — MUTATE step in the per-step TDD loop and "No production code. No exceptions." enforcement language are the highest-signal pre-implementation planning primitives in the entire audit. No other dotfiles repo includes mutation testing as a mandatory planning gate.

7. **`.references/citypaul-dotfiles/claude/.claude/skills/front-end-testing/SKILL.md`** — 8-tier accessibility-first query priority hierarchy is a rare, concrete, immediately actionable frontend testing rule. The browser-mode-vs-jsdom comparison table and 14-item anti-pattern catalog are production-ready.

8. **`.references/citypaul-dotfiles/claude/.claude/skills/ci-debugging/SKILL.md`** — Hypothesis-first approach and environment delta analysis matrix fill a gap not present in any other audited repo. High signal, low extraction effort.

9. **`.references/citypaul-dotfiles/claude/.claude/agents/progress-guardian.md`** — Dual approval gates and Done-when field per step are the strongest lifecycle-management primitives. Compare against any feature-tracking agent from other repos.

10. **`.references/citypaul-dotfiles/claude/.claude/agents/twelve-factor-audit.md`** — False-positive guidance per 12-factor is the most mature compliance-checker tribal knowledge in the audit. Clean three-step SOP. Compare against any compliance-audit agent.

---

## 8. Structural Patterns

Patterns worth preserving in any derived skill, independent of specific content:

**Hub-and-skill architecture**: `.references/citypaul-dotfiles/claude/.claude/CLAUDE.md` (v3.0.0) is a ~100-line hub that defers all detail to on-demand skills loaded by explicit trigger. The hub states mandates; skills specify procedures. This prevents CLAUDE.md bloat and makes individual SOPs independently reloadable. Worth preserving as the meta-pattern for any derived skill's deployment model.

**Dual-mode agent sections**: Every agent in this repo has two explicitly labelled sections — "When invoked proactively" and "When invoked reactively" — each with its own trigger condition, steps, and response-pattern template. This doubles the utility surface of each agent without doubling the conceptual load.

**Response-pattern templates**: Multiple agents (learn, tdd-guardian, refactor-scan) provide verbatim scripted responses for 4–5 named invocation scenarios. These are the most immediately usable artifact in the repo — they remove the blank-page problem for the agent and ensure consistent output format.

**Per-step Done-when fields**: The plan file template in `.references/citypaul-dotfiles/claude/.claude/agents/progress-guardian.md` and `.references/citypaul-dotfiles/claude/.claude/commands/plan.md` includes a "Done when:" field for each implementation step. This makes completion criteria concrete at the step level rather than the feature level — a simple structural choice that eliminates a major ambiguity source in automated development workflows.

**Explicit Skip/Leave-alone tiers**: Both `.references/citypaul-dotfiles/claude/.claude/agents/refactor-scan.md` (✅ Skip tier) and `.references/citypaul-dotfiles/claude/.claude/agents/twelve-factor-audit.md` (leave-alone signals) explicitly tell the agent when *not* to act. This is structurally rare and high-value — most SOPs only specify what to do, not when to stop.

**Phase-by-phase coaching**: `.references/citypaul-dotfiles/claude/.claude/agents/tdd-guardian.md` and `.references/citypaul-dotfiles/claude/.claude/agents/progress-guardian.md` structure guidance by lifecycle phase (RED/GREEN/REFACTOR; start/during/end) rather than by topic. This makes it easier for an agent to know which guidance section applies at any given moment during a work session.

**Worked examples as verification**: Several skills include a fully worked example (`.references/citypaul-dotfiles/claude/.claude/agents/learn.md`'s documentation proposal, `.references/citypaul-dotfiles/claude/.claude/skills/tdd/SKILL.md`'s coverage exception, `.references/citypaul-dotfiles/claude/.claude/commands/plan.md`'s plan file). These function as acceptance tests — if a derived skill can produce this output, the extraction was faithful.

---

## 9. Evidence

Citations traceable to `raw-findings.md` entries:

**[E1]** `.references/citypaul-dotfiles/claude/.claude/agents/tdd-guardian.md` — *"The factory-function-over-let/beforeEach heuristic and the behavior-vs-implementation test naming heuristic are portable gems worth preserving verbatim."* — tdd-guardian Notes paragraph.

**[E2]** `.references/citypaul-dotfiles/claude/.claude/CLAUDE.md` — *"The output guardrails section is the highest-signal portable SOP — 'write to files not chat', 'plan-only mode produces ONLY the artifact', and 'first draft in 3–4 tool calls' are crisp, enforceable rules rarely stated this cleanly in other dotfiles."* — CLAUDE.md Notes paragraph.

**[E3]** `.references/citypaul-dotfiles/claude/.claude/agents/learn.md` — *"Three portable gems worth preserving verbatim: (1) the 5-scenario response-pattern library (gotcha mid-work, feature complete, architectural decision, tricky bug, 'I wish I'd known'); (2) the significance-assessment rubric (document if ANY of 7 conditions; skip only if ALL of 4 conditions); (3) the documentation proposal format."* — learn.md Notes paragraph.

**[E4]** `.references/citypaul-dotfiles/claude/.claude/skills/mutation-testing/SKILL.md` — *"The 'fix immediately vs. ask the human' triage framework — explicit criteria for when an agent should act vs. defer on surviving mutants … this nuanced human-in-the-loop contract is rarely stated this cleanly."* — mutation-testing Notes paragraph.

**[E5]** `.references/citypaul-dotfiles/claude/.claude/commands/plan.md` — *"The MUTATE step (mutation testing as a mandatory fourth step in the TDD loop) is an unusual and high-value extension — signals a mature testing culture and is worth preserving verbatim as a distinguishing element."* — plan.md Notes paragraph.

**[E6]** `.references/citypaul-dotfiles/claude/.claude/agents/twelve-factor-audit.md` — *"The embedded false-positive guidance (e.g., don't flag `localhost` in `.env.example`, don't flag `exec` in test files) is unusually mature and prevents noisy reports."* — twelve-factor-audit Notes paragraph.

**[E7]** `.references/citypaul-dotfiles/claude/.claude/agents/progress-guardian.md` — *"Two standout portable primitives: (1) the dual approval gates — plan changes and commits both require explicit user approval, stated as non-negotiable rules; (2) the per-step 'Done when' field in the plan template — makes completion criteria concrete at the step level, not just the feature level."* — progress-guardian Notes paragraph.

**[E8]** `.references/citypaul-dotfiles/claude/.claude/skills/front-end-testing/SKILL.md` — *"Four standout extracts worth preserving verbatim: (1) the Vitest Browser Mode vs jsdom comparison table; (2) the 8-tier query priority hierarchy with embedded accessibility rationale — simultaneously a testing SOP and an a11y forcing function; (3) the idempotency rules for browser-mode tests; (4) the 14-item anti-pattern catalog — unusually complete and actionable."* — front-end-testing Notes paragraph.

**[E9]** `.references/citypaul-dotfiles/claude/.claude/skills/ci-debugging/SKILL.md` — *"'Every CI failure is real until proven otherwise' axiom and the formal flakiness standard (identical environment + identified non-deterministic source = evidence required) are standout portable principles. The environment delta table is a practical diagnostic checklist that fills a gap not covered by other skills in this audit."* — ci-debugging Notes paragraph.

**[E10]** `.references/citypaul-dotfiles/claude/.claude/agents/refactor-scan.md` — *"The central insight — 'DRY is about knowledge duplication, not code duplication' — is precisely and memorably stated… The explicit ✅ Skip classification tier is the standout differentiator vs. generic refactoring checklists — explicitly telling agents when *not* to refactor is rare and high-value."* — refactor-scan Notes paragraph.

**[E11]** `.references/citypaul-dotfiles/claude/.claude/agents/use-case-data-patterns.md` — *"Attribution note confirms this agent was itself adapted from Kieran O'Hara's dotfiles, suggesting it has already been refined through at least one prior extraction cycle."* — use-case-data-patterns Notes paragraph.

**[E12]** `.references/citypaul-dotfiles/claude/.claude/skills/hexagonal-architecture/SKILL.md` — *"The skill correctly delineates hex arch from DDD (structural isolation vs domain model) — that framing distinction is worth keeping."* — hexagonal-architecture Notes paragraph; also: *"'if swapping an adapter requires changing domain code, the boundary is wrong' heuristic… are portable gems worth preserving verbatim."*