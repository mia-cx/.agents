# File Inventory — strands-agent-sop

Scanned: `.references/strands-agent-sop`

---

## Relevant files

```
rules/agent-sop-format.md | rule | Defines the canonical `.sop.md` file format: required sections (Overview, Parameters, Steps), RFC 2119 constraint keywords, negative-constraint context requirement, and parameter-naming conventions — enforced via a Cursor/Claude rule filter.

spec/agent-sops-specification.md | sop | Formal specification for the Agent SOP standard: file extension, structural sections, parameter format, RFC 2119 keyword semantics, step-design guidance, and interactive-SOP conventions.

skills/agent-sop-author/SKILL.md | skill | Step-by-step skill for authoring and updating `.sop.md` files: file placement, naming, required section order, parameter-acquisition constraints block, negative-constraint rules, and mandatory post-edit validation.

skills/agent-sop-author/validate-sop.sh | config | Bash validation script that checks a `.sop.md` file for required sections, numbered steps, `**Constraints:**` blocks, RFC 2119 keywords, negative-constraint context, and optional sections — exits non-zero on errors.

agent-sops/code-assist.sop.md | sop | TDD implementation workflow (Explore → Plan → Code → Commit) with interactive/auto modes, separation of docs from code, CODEASSIST.md integration, and conventional-commit gate before push.

agent-sops/codebase-summary.sop.md | sop | Codebase analysis and documentation-generation workflow producing architecture, components, interfaces, data-models, and workflows files, with optional consolidation into AGENTS.md / README.md / CONTRIBUTING.md.

agent-sops/code-task-generator.sop.md | sop | Converts rough descriptions or PDD implementation plans into structured `.code-task.md` files with Given-When-Then acceptance criteria, complexity metadata, and integrated test requirements.

agent-sops/pdd.sop.md | sop | Prompt-Driven Development workflow: iterative requirements clarification, research, detailed design document, and incremental TDD implementation plan generation.

agent-sops/eval.sop.md | sop | Conversational evaluation framework for AI agents: planning, test-data generation, Strands Evals SDK execution, and evidence-based reporting across five sequential phases.

AGENTS.md | config | AI-assistant context file for the repo: directory layout, SOP format conventions, RFC 2119 keyword semantics, integration patterns (MCP, Skills, Python, Cursor), and build/release workflow.

.claude-plugin/plugin.json | config | Claude plugin manifest declaring the package name, version, and description for marketplace discovery.

.claude-plugin/marketplace.json | config | Marketplace registration entry pointing to the `skills-dist` branch as the plugin source for Skills installation.
```
