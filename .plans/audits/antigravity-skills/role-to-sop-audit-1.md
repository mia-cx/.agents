# Role-to-SOP audit: antigravity-skills (audit 1)

Source corpus: `.plans/audits/antigravity-skills/raw-findings.md` (operational notes only; claims below are traceable there).

---

## 1. Repo overview

The audited artifact is a multi-skill bundle organized as one `SKILL.md` per capability under `skills/`, plus plugin distribution metadata under `.claude-plugin/`. The set mixes meta-orchestration (registry scan, workflow routing, memory-backed skill combination), product-specific runbooks (Conductor tracks, Loki Mode filesystem state, agent-orchestrator Python CLIs), and largely portable engineering procedures (verification gates, planning, code review, context engineering). Portability is explicitly uneven: many entries are “router” skills whose executable depth lives in sibling `resources/`, `references/`, or external repos. Several clusters repeat the same integration pattern (`superpowers:*`, `TodoWrite`, `gh` CLI, MCP tool names). Quality and delivery skills emphasize evidence before completion claims, phased debugging, and PR/issue gates. Security and audit content spans static review of .references/antigravity-skills/skills/audit-skills/SKILL.md, GitHub Actions threat modeling, and differential security review with phased methodology. Context-related skills range from vendor-agnostic primers to environment-bound operator manuals (e.g. hard-coded paths, slash commands). The catalog includes niche semantic/Web tooling (BDI/RDF, bdistill) and internal authoring factories (Andru.ia, skill-creator) that assume specific repo layouts or languages. One Conductor validator entry is flagged as structurally broken in the source notes. A duplicate block at the end of the raw findings reiterates `planning-with-files` and should be merged when building a canonical corpus.

---

## 2. Content summary (by category, portability signal)

| Category | Representative skills (from raw findings) | Portability signal |
|----------|--------------------------------------------|-------------------|
| Meta-orchestration & routing | `agent-orchestrator`, `antigravity-workflows`, `antigravity-skill-orchestrator`, `parallel-agents` | **Low–mixed** — procedural skeletons sometimes reusable; many bindings to fixed tool names, catalogs, or product agent surfaces. |
| Delivery, quality, gates | `verification-before-completion`, `closed-loop-delivery`, `create-issue-gate`, `systematic-debugging`, `finishing-a-development-branch` | **High–mixed** — core discipline is portable; GitHub/PR/deploy assumptions appear in several. |
| Requirements & communication | `ask-questions-if-underspecified`, `receiving-code-review`, `behavioral-modes`, `00-andruia-consultant` | **Mixed** — generic clarification/review loops vs persona, language, or forge-specific hooks. |
| Planning & execution | `concise-planning`, `planning-with-files`, `writing-plans`, `executing-plans`, `subagent-driven-development` | **Mixed** — file-based and plan structure portable; `TodoWrite`, `superpowers:*`, and paths often not. |
| Code review | `code-review-excellence`, `code-review-checklist`, `differential-review` | **Mixed** — checklists and framing travel; depth often in `implementation-playbook` or sibling methodology files. |
| Context & memory (conceptual) | `context-fundamentals`, `context-compression`, `context-window-management`, `memory-systems`, `multi-agent-patterns` | **Mostly high** for methodology in-file; encyclopedic or playbook-deferred skills lower. |
| Context & memory (implementation) | `context-manager`, `context-guardian`, `agent-memory-mcp`, `clarity-gate` | **Low–mixed** — operator runbooks, MCP deploy, or spec+script dependencies. |
| Security & audit | `audit-skills`, `agentic-actions-auditor`, `audit-context-building`, `differential-review` | **Mixed** — pattern catalogs portable; Actions workflows and companion files anchor some. |
| Conductor (Rails / tracks) | `context-driven-development`, `conductor-setup`, `conductor-implement`, `conductor-manage`, `conductor-validator`, `conductor-new-track`, `conductor-status`, `conductor-revert` | **Low–mixed** — governance ideas portable; paths, slash commands, and Rails setup are product-bound. |
| Evaluation & estimation | `bdistill-behavioral-xray`, `bdistill-knowledge-extraction`, `agent-evaluation`, `progressive-estimation`, `tdd-orchestrator` | **Low–mixed** — concepts portable; faithful execution often needs packages, upstream repos, or playbook files. |
| Agent architecture patterns | `autonomous-agent-patterns`, `loki-mode`, `dispatching-parallel-agents` | **Mixed** — patterns abstractable; Loki and parallel-agent product guides are not drop-in. |
| Meta / authoring | `skill-creator`, `10-andruia-skill-smith`, `agents-md` | **Low** for procedural shells; **higher** for `agents-md` as documentation policy. |
| Ops writing | `postmortem-writing`, `on-call-handoff-patterns` | **High** — tool-agnostic templates and checklists. |
| Niche formalism | `bdi-mental-states` | **Mixed** — conceptual BDI portable; RDF/SPARQL depth assumes bundled references. |
| Distribution | `.references/antigravity-skills/.claude-plugin/plugin.jsonon` | **N/A for SOP** — manifest metadata only. |

---

## 3. SOP split — every file: port vs leave-out

| File | Verdict | One-line reason (from raw findings) |
|------|---------|-------------------------------------|
| `.references/antigravity-skills/skills/agent-orchestrator/SKILL.md` | **Leave-out** | Execution contract is three Python CLIs plus `registry.json`; not a standalone hand-rolled SOP. |
| `.references/antigravity-skills/skills/loki-mode/SKILL.md` | **Leave-out** | Requires Loki filesystem layout, queues, and bundled references/agents not generic. |
| `.references/antigravity-skills/skills/antigravity-workflows/SKILL.md` | **Port** | Procedural skeleton and closure criteria reuse as SOP; companion `docs/` / `data/` define truth. |
| `.references/antigravity-skills/skills/antigravity-skill-orchestrator/SKILL.md` | **Port** | Decision flow generalizes; strip MCP tool names and catalog URL. |
| `.references/antigravity-skills/skills/context-driven-development/SKILL.md` | **Port** | Workflow philosophy generalizes; neutralize Conductor paths and setup. |
| `.references/antigravity-skills/skills/verification-before-completion/SKILL.md` | **Port** | Tool-agnostic completion discipline; only verifier choice is task-specific. |
| `.references/antigravity-skills/skills/closed-loop-delivery/SKILL.md` | **Port** | Phases and human gates generic; strip GitHub/PR polling defaults if needed. |
| `.references/antigravity-skills/skills/create-issue-gate/SKILL.md` | **Port** | Gate logic universal; replace `gh issue create` with org tracker. |
| `.references/antigravity-skills/skills/ask-questions-if-underspecified/SKILL.md` | **Port** | Pure procedural content; no repo-specific tooling in operative sections. |
| `.references/antigravity-skills/skills/receiving-code-review/SKILL.md` | **Port** | Core verify-then-implement loop universal; strip `CLAUDE.md` / `gh api` hooks. |
| `.references/antigravity-skills/skills/code-review-excellence/SKILL.md` | **Port** | Short body portable; vendor playbook path or merge with checklist. |
| `.references/antigravity-skills/skills/code-review-checklist/SKILL.md` | **Port** | Self-contained technology-agnostic checklist. |
| `.references/antigravity-skills/skills/dispatching-parallel-agents/SKILL.md` | **Port** | Partition/dispatch/merge pattern generic; strip `Task(...)` samples. |
| `.references/antigravity-skills/skills/parallel-agents/SKILL.md` | **Leave-out** | Claude Code native agent roster and triggers; not drop-in elsewhere. |
| `.references/antigravity-skills/skills/subagent-driven-development/SKILL.md` | **Port** | Per-task state machine portable; substitute bundled prompts and `superpowers:*`. |
| `.references/antigravity-skills/skills/concise-planning/SKILL.md` | **Port** | Minimal assumptions; template applies to any codebase. |
| `.references/antigravity-skills/skills/planning-with-files/SKILL.md` | **Port** | Volatile-vs-durable files pattern tool-agnostic; strip `CLAUDE_PLUGIN_ROOT` naming. |
| `.references/antigravity-skills/skills/writing-plans/SKILL.md` | **Port** | Plan structure and TDD granularity generalize; strip `superpowers:*` and fixed `docs/plans/` if needed. |
| `.references/antigravity-skills/skills/executing-plans/SKILL.md` | **Port** | Batch/checkpoint discipline generic; replace TodoWrite and sub-skill chain. |
| `.references/antigravity-skills/skills/finishing-a-development-branch/SKILL.md` | **Port** | Git/`gh` patterns standard with placeholders. |
| `.references/antigravity-skills/skills/differential-review/SKILL.md` | **Port** | Executive workflow portable; sibling deep docs optional for full depth. |
| `.references/antigravity-skills/skills/context-fundamentals/SKILL.md` | **Port** | Conceptual only; related skills are curriculum pointers not runtime deps. |
| `.references/antigravity-skills/skills/context-compression/SKILL.md` | **Port** | Methodology self-contained in file. |
| `.references/antigravity-skills/skills/context-guardian/SKILL.md` | **Leave-out** | Concrete Windows paths and named scripts; operator runbook for one environment. |
| `.references/antigravity-skills/skills/bdistill-behavioral-xray/SKILL.md` | **Leave-out** | Faithful execution requires bdistill install/MCP/slash commands. |
| `.references/antigravity-skills/skills/bdistill-knowledge-extraction/SKILL.md` | **Leave-out** | Hard dependency on bdistill commands and stack. |
| `.references/antigravity-skills/skills/postmortem-writing/SKILL.md` | **Port** | Tool-agnostic prose and templates. |
| `.references/antigravity-skills/skills/on-call-handoff-patterns/SKILL.md` | **Port** | Generic ops content—the body includes full templates. |
| `.references/antigravity-skills/skills/context-window-management/SKILL.md` | **Port** | Vendor-agnostic heuristics; no required local tools in body. |
| `.references/antigravity-skills/skills/context-manager/SKILL.md` | **Port** | Outline generalizes; trim vendor encyclopedia or vendor playbook. |
| `.references/antigravity-skills/skills/memory-systems/SKILL.md` | **Port** | Methodology stands without a specific product. |
| `.references/antigravity-skills/skills/agent-memory-mcp/SKILL.md` | **Leave-out** | Deploy/runbook for a specific Node MCP server and tool surface. |
| `.references/antigravity-skills/skills/audit-context-building/SKILL.md` | **Port** | Reasoning flow portable; companion files deepen execution. |
| `.references/antigravity-skills/skills/audit-skills/SKILL.md` | **Port** | Pattern catalog tool- and repo-agnostic. |
| `.references/antigravity-skills/skills/agentic-actions-auditor/SKILL.md` | **Port** | Spine portable; reference dir and `gh api` samples need substitution for full rules. |
| `.references/antigravity-skills/skills/clarity-gate/SKILL.md` | **Port** | Checklist/templates travel; spec+scripts needed for machine checks. |
| `.references/antigravity-skills/skills/conductor-setup/SKILL.md` | **Leave-out** | Rails/Conductor bootstrap and env vars—not generic agent SOP. |
| `.references/antigravity-skills/skills/conductor-implement/SKILL.md` | **Port** | Task loops and gates generalize; paths and slash commands do not—strip those. |
| `.references/antigravity-skills/skills/conductor-manage/SKILL.md` | **Port** | Governance pattern generic; modes need playbook or inlining. |
| `.references/antigravity-skills/skills/conductor-validator/SKILL.md` | **Leave-out** | Broken markdown and misaligned boilerplate per source—fix before treating as authoritative. |
| `.references/antigravity-skills/skills/autonomous-agent-patterns/SKILL.md` | **Port** | Behavioral guidance tool-agnostic; code is illustrative pseudocode. |
| `.references/antigravity-skills/skills/multi-agent-patterns/SKILL.md` | **Port** | Self-contained methodology narrative. |
| `.references/antigravity-skills/skills/behavioral-modes/SKILL.md` | **Port** | Mode rubric portable; substitute external `clean-code` reference. |
| `.references/antigravity-skills/skills/bdi-mental-states/SKILL.md` | **Port** | Conceptual BDI portable; strip RDF/SPARQL depth if out of scope. |
| `.references/antigravity-skills/skills/00-andruia-consultant/SKILL.md` | **Port** | Greenfield/brownfield fork generalizes; strip Spanish mandate and branding if not desired. |
| `.references/antigravity-skills/skills/10-andruia-skill-smith/SKILL.md` | **Leave-out** | Hard-coded Windows host tree and registry editing for one repo. |
| `.references/antigravity-skills/skills/agent-evaluation/SKILL.md` | **Port** | Conceptual QA methodology; fix truncated narrative in source. |
| `.references/antigravity-skills/skills/progressive-estimation/SKILL.md` | **Port** | Narrative transfers; upstream repo may hold full formulas. |
| `.references/antigravity-skills/skills/tdd-orchestrator/SKILL.md` | **Port** | Abstract TDD governance; thin without playbook—edit or bundle resource. |
| `.references/antigravity-skills/skills/systematic-debugging/SKILL.md` | **Port** | Phases and evidence rules universal; strip `superpowers:*` and bash samples if needed. |
| `.references/antigravity-skills/skills/agents-md/SKILL.md` | **Port** | Procedural doc spec with mild Unix assumptions. |
| `.references/antigravity-skills/skills/skill-creator/SKILL.md` | **Leave-out** | Requires templates, validate scripts, and multi-platform install paths. |
| `.references/antigravity-skills/.claude-plugin/plugin.jsonon` | **Leave-out** | Plugin manifest—not operator guidance. |
| `.references/antigravity-skills/skills/conductor-new-track/SKILL.md` | **Port** | Interview and AC discipline generalize; Conductor tree does not—strip paths. |
| `.references/antigravity-skills/skills/conductor-status/SKILL.md` | **Port** | Checkbox/task semantics reusable; Conductor paths not—neutralize. |
| `.references/antigravity-skills/skills/conductor-revert/SKILL.md` | **Port** | Safety model for revert reusable; Conductor commit grep coupling not—adapt. |

*Note: `.plans/audits/antigravity-skills/raw-findings.md` contains a second `## .references/antigravity-skills/skills/planning-with-files/SKILL.md` section near the end—same logical file; dedupe when building a corpus (see §9).*

---

## 4. Per-SOP detail table (portable / partial port only)

Abbreviations: **Strip** = what raw findings say to remove/neutralize.

| Source file | Trigger | Steps / contract (summary) | Quality bar | Strip | Notes |
|-------------|---------|----------------------------|-------------|-------|-------|
| `antigravity-workflows` | Multi-phase objectives; SaaS MVP, security audit, agent system, E2E, DDD asks | Read workflows docs/JSON → match outcome → execute steps → finish with artifacts, evidence, risks | Verify completion before advancing; announce step + expected artifact | YAML; `@antigravity-workflows`; skill IDs | Downstream skills and env still required |
| `antigravity-skill-orchestrator` | Complex/uncertain multi-domain; reuse prior combos | Classify → memory search → map skills → optional remote catalog → execute → record combo | Avoid over-skilling; never invent new skills | YAML; `@` conventions; JS-shaped tool calls; catalog URL | Token/time cost called out |
| `context-driven-development` | Context-as-artifact methodology | Context → spec & plan → implement under Conductor-shaped tree | Anti-patterns and maintenance principles | YAML; `conductor/` paste; Conductor CLI | Strong checklist extraction candidate |
| `verification-before-completion` | Any claim of success/done | Iron law: fresh command output and evidence before satisfaction claims | No success without verifier-mapped evidence | YAML; “lying” tone if needed | Pairs with DoD checklists |
| `closed-loop-delivery` | E2E delivery with human gates | DoD → minimal change → verify → PR loop → optional deploy → stop/escalate | DoD evidenced before handoff | YAML; polling minutes; GitHub/default deploy | Aligns with verification skill |
| `create-issue-gate` | Issue intake | States + gate: no testable AC ⇒ draft/blocked | Execution only when ready + allowed | YAML; `gh`-only paths | Composes as front door |
| `ask-questions-if-underspecified` | Ambiguous requests | Minimal numbered/MCQ questions; pause before edits | Must-haves before acting | YAML | May conflict with “explore first” org policy |
| `receiving-code-review` | Incoming review | Read → verify → evaluate → respond → implement order | Forbid performatives; verify feedback | YAML; CLAUDE/gh specifics; pushback joke | Team culture on gratitude may vary |
| `code-review-excellence` | Conducting reviews | Dimensions + actionable severity + clarifying questions | Match depth to bundled playbook or merge | YAML; `@` playbook path | Thin without resource |
| `code-review-checklist` | Full review pass | Broad checklist + examples | Self-contained breadth | YAML; long examples; external links | Duplication risk vs excellence |
| `dispatching-parallel-agents` | Independent failure domains | Partition → briefs → parallel run → merge → verify | No shared state misuse | YAML; `Task(...)` snippet | Integration checklist reusable |
| `subagent-driven-development` | Same-session plan execution | One implementer per task; spec review then code review; loops | No skipping or reordering reviews; no parallel implementers | YAML; Graphviz; `superpowers:*` paths | Governance-heavy |
| `concise-planning` | Lightweight plan needed | Scan context → cap questions → short plan + 6–10 actions + validation | Verb-first actions | YAML | Atomic before heavy orchestration |
| `planning-with-files` | Long multimodal work | `task_plan.md` / `findings.md` / `progress.md`; 2-action save; 3-strike; matrix | Durable disk vs session volatile | YAML; `CLAUDE_PLUGIN_ROOT`; TodoWrite naming | Don’t put artifacts under skill dir |
| `writing-plans` | Authoring implementation plans | Mandatory header; 2–5 min steps; paths/commands; save under dated path | Junior-friendly test explicitness | YAML; `superpowers:*`; worktree assumptions | Header block extractable |
| `executing-plans` | Running a written plan | Read/review → batches of three → status loop → verify → checkpoints | Blockers stop execution; no skipped verify | YAML; TodoWrite; sub-skill chain | Complement to writing-plans |
| `finishing-a-development-branch` | Branch closure | Tests → base branch → four integration choices → optional worktree remove | Destructive ops guarded | YAML; caller skill bullets | `gh pr create` path documented |
| `differential-review` | Security diff review | Phased triage through adversarial → report | No skipping git on rationalizations; report file | YAML; long examples; vendor integration section | Router + invariant list |
| `context-fundamentals` | Context engineering primer | Components, progressive disclosure, budgeting | Placement and compaction thresholds | YAML; long fenced example | Foundation for curriculum |
| `context-compression` | Large-codebase work | Anchored vs opaque summary; probes; phased research/plan/implement | Structured summaries; artifact trail | YAML; external URLs | Links to guardian themes without naming stack |
| `postmortem-writing` | Incidents | Templates, 5 Whys, facilitation, anti-patterns | Blameless operational writing | YAML; huge inline templates | Optional playbook depth |
| `on-call-handoff-patterns` | Shift/incident handoff | Components, templates, checklists, escalation | Continuity across rotations | YAML; emoji; fictional handles | Stands alone per findings |
| `context-window-management` | Short context hygiene | Tiered strategies; lost-in-middle; anti-patterns | Token/cost awareness | YAML; vibeship line; broken fragment in source | Lightweight vs heavier context skills |
| `context-manager` | “Elite” context assembly | Clarify → practices → verify; playbook deferred | Taxonomy-level guidance | YAML; vendor lists; ten-step response | Overlaps memory-systems |
| `memory-systems` | Memory architecture choices | Spectrum, graphs, layers, retrieval/consolidation | Illustrative code/benchmarks may age | YAML; duplicate sections | Architecture SOP candidate |
| `audit-context-building` | Pre-audit context | Phases + first principles + micro analysis + global model | No vulns/fixes in this phase; continuity | YAML; function-analyzer; filenames | Pairs with hunt/report skills |
| `audit-skills` | Static review of skill bundles | Threat patterns + scored report + non-execution | Non-intrusive analysis | YAML; HTML allowlist comment; marketing subtitle | Policy-friendly |
| `agentic-actions-auditor` | GHA with AI steps | Discover workflows → AI `uses:` → resolve → capture fields → vectors A–I → report | YAML-as-data; rationalizations rejected | YAML; `gh` blocks; references dir | GitHub-scoped |
| `clarity-gate` | RAG pre-ingestion quality | Nine verification points; `.cgd.md` contract; codes | Form not truth; HITL mandatory | Verbose frontmatter; duplicate tables | Spec+scripts for hashes |
| `conductor-implement` | Execute Conductor track | Preflight → track → spec/plan/metadata → TDD → phase gates → archive | Never skip verification; halt on failures | YAML; `/conductor:*`; JSON examples | “Execution engine” for Conductor |
| `conductor-manage` | Track lifecycle | Archive/restore/delete/rename/list/clean with confirmations | Structure + `tracks.md` consistency | YAML; generic bullets | Thin without playbook |
| `conductor-new-track` | New track creation | Interview ≤6 Q → write spec/plan/metadata/index → register | Atomic writes; error handling | YAML; Conductor paths | Pairs with implement |
| `conductor-status` | Project/track dashboard | Aggregate conductor files; quick/json modes | Regex counting rules documented | YAML; ASCII mocks; `/conductor:*` | Distinct error states |
| `conductor-revert` | Logical revert units | Parse targets → grep commits → plan → revert → update artifacts | Literal `YES`; no hard reset/force | YAML; reset appendix vs anti-reset tone | Pushed-remote case called out |
| `autonomous-agent-patterns` | Agent architecture design | Loop, tools, edits, permissions, sandbox, MCP sketch | Map pseudocode to real stack | YAML; emoji; dated model IDs | Pattern library not runtime |
| `multi-agent-patterns` | Multi-agent architecture | Supervisor/swarm; isolation; failure modes | Context isolation thesis | YAML; metadata footer; unsourced multipliers | “Telephone game” mitigation |
| `behavioral-modes` | Response style selection | Mode rubric + triggers + templates | IMPLEMENT references clean-code | YAML; emoji; `clean-code` dep | Optional bolt-on sections |
| `bdi-mental-states` | Neuro-symbolic belief models | BDI ontology, SPARQL, patterns | Competency questions pattern | YAML; Turtle/SPARQL; references | Niche |
| `00-andruia-consultant` | Onboarding/diagnostic | Pure Engine vs Evolution; artifacts | Spanish + branding in source | Persona; `@` experts | Fork for language/policy |
| `agent-evaluation` | Eval philosophy | Multi-run, contracts, adversarial, sharp edges | Fix truncation in source text | YAML | Philosophy not harness |
| `progressive-estimation` | Estimation workflow | Modes, PERT, confidence bands, calibration | May need upstream for formulas | YAML; `@` related skills | PM complement |
| `tdd-orchestrator` | TDD coordination | Red-green-refactor + long taxonomy | Playbook optional for depth | YAML; filler sections | Index + tone without playbook |
| `systematic-debugging` | Debugging discipline | Four phases; no fix before Phase 1 | Stop after repeated failures; escalate | YAML; bash samples; superpowers | Pairs with verification |
| `agents-md` | Agent-facing docs | `AGENTS.md` structure, discovery, limits | Line budget and sections | YAML; duplicate templates | Org “agent readme” SOP |

---

## 5. Portability ranking

**High (drop-in or light strip)**  
Skills tagged **Yes** for portable in raw findings, or equivalent: e.g. verification-before-completion, ask-questions-if-underspecified, code-review-checklist, concise-planning, planning-with-files (strip naming only), context-fundamentals, context-compression, context-window-management, memory-systems, postmortem-writing, on-call-handoff-patterns, multi-agent-patterns, agents-md, agent-evaluation (after fixing source truncation), audit-skills.

**Medium (solid extract after path/tool neutralization)**  
Partial skills where the body generalizes after stripping `superpowers:*`, `gh`, TodoWrite, `@` paths, or Conductor/GitHub specifics: antigravity-workflows, antigravity-skill-orchestrator, context-driven-development, closed-loop-delivery, create-issue-gate, receiving-code-review, code-review-excellence, dispatching-parallel-agents, subagent-driven-development, writing-plans, executing-plans, finishing-a-development-branch, differential-review, context-manager, audit-context-building, agentic-actions-auditor, clarity-gate, autonomous-agent-patterns, behavioral-modes, bdi-mental-states, progressive-estimation, tdd-orchestrator, systematic-debugging, conductor-implement/manage/new-track/status/revert, 00-andruia-consultant.

**Partial / low (leave out of a generic corpus or heavy rework)**  
**No** or implementation-bound: agent-orchestrator, loki-mode, parallel-agents, context-guardian, bdistill pair, agent-memory-mcp, conductor-setup, conductor-validator (broken), skill-creator, 10-andruia-skill-smith, `.references/antigravity-skills/.claude-plugin/plugin.jsonon`. Also entries whose “faithful execution” premise is the external product (per raw findings).

---

## 6. Cross-cutting protocol primitives (≥2 files in raw findings)

| Primitive | Where it appears (examples) |
|-----------|-----------------------------|
| **Strip YAML frontmatter** | Called out repeatedly (e.g. agent-orchestrator through conductor-revert). |
| **`resources/implementation-playbook.md` deferral** | code-review-excellence, conductor-implement, conductor-manage, postmortem-writing, on-call-handoff-patterns, context-manager, tdd-orchestrator, differential-review (among others). |
| **`superpowers:*` skill naming** | subagent-driven-development, writing-plans, executing-plans, systematic-debugging. |
| **GitHub CLI (`gh`)** | finishing-a-development-branch, create-issue-gate, receiving-code-review, closed-loop-delivery, agentic-actions-auditor. |
| **Conductor cluster** | context-driven-development, conductor-setup, conductor-implement, conductor-manage, conductor-validator, conductor-new-track, conductor-status, conductor-revert. |
| **MCP memory tools (`memory_*`)** | antigravity-skill-orchestrator, agent-memory-mcp. |
| **Evidence before completion / verify loops** | verification-before-completion, closed-loop-delivery, systematic-debugging, differential-review (report/evidence themes). |
| **Parallel / subagent dispatch** | dispatching-parallel-agents, subagent-driven-development, antigravity-workflows, parallel-agents (product-specific). |
| **Context tiering / compaction / finite window** | context-fundamentals, context-compression, context-window-management, context-guardian (tied to one stack). |
| **“Do not execute” / static analysis stance** | audit-skills, agentic-actions-auditor. |
| **TodoWrite integration** | subagent-driven-development, executing-plans (per raw findings chain). |

---

## 7. Default recommendation — top picks for cross-repo comparison

Use a **small neutral pack** that maximizes signal without vendor paths:

1. **verification-before-completion** — completion iron law usable in any agent policy.  
2. **ask-questions-if-underspecified** — ambiguity gate with minimal assumptions.  
3. **concise-planning** + **planning-with-files** — lightweight plan + durable file pattern.  
4. **context-fundamentals** + **context-compression** or **memory-systems** — how to load and budget context (pick one compression + one architecture slice to avoid overlap).  
5. **code-review-checklist** (or merge with code-review-excellence after dedupe).  
6. **multi-agent-patterns** — architecture primitives for comparing orchestration approaches.  
7. **agents-md** — reproducible “how we document for agents” baseline.  
8. **postmortem-writing** or **on-call-handoff-patterns** — ops writing comparable across orgs.

Add **systematic-debugging** and **audit-skills** when comparing quality/security posture.

---

## 8. Structural patterns

- **One SKILL.md spine per capability**, often with **sibling `resources/` or `references/`** for depth; many skills are routers, not self-contained runbooks.  
- **Repeated boilerplate blocks** (“When to use,” “Do not use,” “Instructions”) called out as dedupe targets.  
- **Integration via `@skill` or `superpowers:` names** creates implicit dependency graphs across the bundle.  
- **Product- or IDE-specific hooks** (slash commands, Claude Code agents, Windows paths) sit beside otherwise generic prose—portability work is usually **frontmatter + path + named-tool stripping**.  
- **Duplicate or trailing content risk**: implementation-playbook pointers without vendoring; **duplicate `planning-with-files` section** in raw findings.  
- **Distribution layer** (`.references/antigravity-skills/.claude-plugin/plugin.jsonon`) is **metadata only**, not procedural SOP material.

---

## 9. Evidence (≥8 citations to `.plans/audits/antigravity-skills/raw-findings.md`)

1. Agent-orchestrator is explicitly “low as a standalone SOP” and tied to Python CLIs and `registry.json`. — `4:6:.plans/audits/antigravity-skills/raw-findings.md`  
2. Loki Mode portability verdict **No** with Loki filesystem and bundled references rationale. — `16:18:.plans/audits/antigravity-skills/raw-findings.md`  
3. **verification-before-completion** marked **Portable: Yes** and tool-agnostic. — `47:49:.plans/audits/antigravity-skills/raw-findings.md`  
4. **antigravity-skill-orchestrator** “Partial” with explicit MCP tool names as the portability break. — `27:31:.plans/audits/antigravity-skills/raw-findings.md`  
5. **parallel-agents** “Portable: No” tied to Claude Code agent surface. — `135:137:.plans/audits/antigravity-skills/raw-findings.md`  
6. **context-guardian** “Portable: No” with Windows paths and named scripts. — `231:232:.plans/audits/antigravity-skills/raw-findings.md`  
7. **conductor-validator** document structure **broken/incomplete** with stray fence. — `404:407:.plans/audits/antigravity-skills/raw-findings.md`  
8. **skill-creator** “Portable: No as a runbook” with templates/scripts dependency. — `519:521:.plans/audits/antigravity-skills/raw-findings.md`  
9. **plugin.json** “Portable: No” as Claude plugin manifest, not procedure. — `528:529:.plans/audits/antigravity-skills/raw-findings.md`  
10. Duplicate **planning-with-files** tail: “earlier audit entry exists - merge or dedupe.” — `569:579:.plans/audits/antigravity-skills/raw-findings.md`  

---

*End of audit 1.*
