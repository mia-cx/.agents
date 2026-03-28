# Skills Repo

This repository contains Claude skills, agent definitions, and rules used across
engineering and product workflows.

---

## Repository structure

```
skills/          — Skill definitions (SKILL.md per skill)
agents/          — Agent role definitions, organised by domain
rules/           — Standing rules loaded into every session
.plans/          — Working plans and SOP drafts (not live skills)
scripts/         — Utility scripts
```

---

## Skills catalogue

Each skill lives at `skills/<name>/SKILL.md`.  The description frontmatter in
each file controls when the skill triggers.

### Foundational / cross-cutting skills

These skills apply broadly across tasks.  They are loaded by other skills and
should be familiar to any agent working in this repo.

| Skill | Path | Purpose |
|-------|------|---------|
| **cot-gate** | `skills/cot-gate/SKILL.md` | Mandatory chain-of-thought reasoning gate that runs *before* writing any nontrivial code.  Four-step narrative: clarify → weigh alternatives → edge cases → chosen plan. |
| **self-validation** | `skills/self-validation/SKILL.md` | Close-out protocol that runs *after* every task.  Three-question self-audit (format? reasoning? names/placeholders?) plus a fail-safe declaration format for blocked rules. |
| **tdd** | `skills/tdd/SKILL.md` | Red-green-refactor TDD loop with 90 % coverage gate, integration-test placement guidance, and phase checklists. |

### Domain skills

| Skill | Path | Purpose |
|-------|------|---------|
| agent-optimize-rules | `skills/agent-optimize-rules/SKILL.md` | Optimise agent rule files for conciseness and coverage. |
| audit-deps | `skills/audit-deps/SKILL.md` | Dependency audit and upgrade planning. |
| audit-security | `skills/audit-security/SKILL.md` | Security audit for codebases. |
| brand-guidelines | `skills/brand-guidelines/SKILL.md` | Apply and enforce brand guidelines. |
| claude-api | `skills/claude-api/SKILL.md` | Claude API integration patterns. |
| codebase-architecture | `skills/codebase-architecture/SKILL.md` | Architectural analysis and documentation. |
| deploy-verify | `skills/deploy-verify/SKILL.md` | Deployment verification and smoke-test protocols. |
| design-interface | `skills/design-interface/SKILL.md` | UI/UX interface design guidance. |
| doc-coauthor | `skills/doc-coauthor/SKILL.md` | Collaborative document authoring. |
| doc-edit-article | `skills/doc-edit-article/SKILL.md` | Article editing and improvement. |
| doc-internal-comms | `skills/doc-internal-comms/SKILL.md` | Internal communications writing. |
| docx | `skills/docx/SKILL.md` | Generate and edit `.docx` files. |
| gc | `skills/gc/SKILL.md` | Google Cloud operations. |
| git-guardrails | `skills/git-guardrails/SKILL.md` | Git branch and commit safety rules. |
| grill-me | `skills/grill-me/SKILL.md` | Socratic interview / stress-test mode. |
| issue-triage | `skills/issue-triage/SKILL.md` | GitHub issue triage and labelling. |
| mcp-builder | `skills/mcp-builder/SKILL.md` | Build and configure MCP servers. |
| media-algorithmic-art | `skills/media-algorithmic-art/SKILL.md` | Generate algorithmic art. |
| media-canvas-design | `skills/media-canvas-design/SKILL.md` | Canvas-based design assets. |
| media-slack-gif | `skills/media-slack-gif/SKILL.md` | Generate Slack-ready GIFs. |
| pdf | `skills/pdf/SKILL.md` | PDF generation and extraction. |
| plan-to-spec | `skills/plan-to-spec/SKILL.md` | Convert plans to formal specs. |
| pr-merge | `skills/pr-merge/SKILL.md` | Pull-request merge workflow. |
| pr-resolve-discussions | `skills/pr-resolve-discussions/SKILL.md` | Resolve PR review discussions. |
| pr-review | `skills/pr-review/SKILL.md` | Pull-request review protocol. |
| prd-create | `skills/prd-create/SKILL.md` | Create product requirement documents. |
| prd-to-issues | `skills/prd-to-issues/SKILL.md` | Break a PRD into tracked issues. |
| prd-to-plan | `skills/prd-to-plan/SKILL.md` | Convert a PRD into an implementation plan. |
| pptx | `skills/pptx/SKILL.md` | Generate and edit `.pptx` files. |
| refactor-plan | `skills/refactor-plan/SKILL.md` | Plan and execute code refactors. |
| release | `skills/release/SKILL.md` | Release checklist and versioning. |
| setup-changesets | `skills/setup-changesets/SKILL.md` | Set up Changesets for versioning. |
| setup-ci | `skills/setup-ci/SKILL.md` | CI pipeline setup and configuration. |
| setup-pre-commit | `skills/setup-pre-commit/SKILL.md` | Configure pre-commit hooks. |
| skill-create | `skills/skill-create/SKILL.md` | Create, iterate, and optimise skills (meta-skill). |
| test-migrate-shoehorn | `skills/test-migrate-shoehorn/SKILL.md` | Migrate tests between frameworks. |
| test-webapp | `skills/test-webapp/SKILL.md` | Web application testing workflows. |
| theme-factory | `skills/theme-factory/SKILL.md` | Generate and manage UI themes. |
| ubiquitous-language | `skills/ubiquitous-language/SKILL.md` | Define and enforce domain ubiquitous language. |
| web-app-builder | `skills/web-app-builder/SKILL.md` | Full-stack web application scaffolding. |
| web-frontend-design | `skills/web-frontend-design/SKILL.md` | Frontend design and component patterns. |
| xlsx | `skills/xlsx/SKILL.md` | Generate and edit `.xlsx` files. |

---

## Rules

Standing rules loaded into every session:

| Rule | Path |
|------|------|
| Package manager | `rules/package-manager.md` |
| Rule adherence | `rules/rule-adherence.md` |
| Worktree location | `rules/worktree-location.md` |

---

## SOP drafts (`.plans/sops/`)

Draft SOPs pending promotion to `skills/`.  Do not load these as live skills —
they are working documents.  Each draft carries a `promoted-to:` frontmatter
field once it has been merged into the skills tree.

---

## Notes for contributors

- **Adding a skill**: use `skills/skill-create/SKILL.md` for the full creation
  workflow, then add a row to the catalogue table above.
- **`cot-gate` and `self-validation`** are cross-cutting.  Any skill that
  involves code generation should reference `cot-gate` in its Related Skills
  section.  Any skill that produces a final deliverable should reference
  `self-validation`.
- **SOP drafts** go in `.plans/sops/<name>/SKILL.md` before promotion.
