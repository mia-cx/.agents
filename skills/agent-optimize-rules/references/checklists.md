## Quick Checklist

**For all rules/skills/subagents:**

- [ ] **Tribal, not inferrable**: Can agents discover this in code, tests, or docs? If yes, delete or move.
- [ ] **Focused, not comprehensive**: <50 lines for rules; 2–3 core concepts for skills. If longer, extract to external docs.
- [ ] **Explains the "why"**: Is there a constraint or gotcha? Not just "use X"—"use X because Y constraint."

---

## Type-Specific Checks

### Rules (`.cursor/rules/*.mdc`)

- [ ] **Remove inferrable content**: If agents can discover it from code, tests, or linting config, delete it
- [ ] **Scope tight**: Does it have `globs` limiting where it applies?
- [ ] **Emphasize "why"**: Explain the constraint, not just the pattern

### Skills (`.cursor/skills/*/SKILL.md`)

- [ ] **Remove bloat**: Skip "why this matters"—focus on steps
- [ ] **Keep examples concrete**: Runnable/adaptable, not generic
- [ ] **Remove redundancy**: If external docs already cover this, link instead
- [ ] **Task-class applicable**: Works for a family, not one instance

### Subagents (`.cursor/agents/*.md`)

- [ ] **Justify existence**: Could this be a rule or skill?
- [ ] **Specialized prompt necessary**: Or is it noise?

---
