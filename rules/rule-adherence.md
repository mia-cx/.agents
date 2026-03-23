---
description: Ensures all rules in context are treated as mandatory. Auto/Composer models deprioritize rules when context is crowded; this rule counteracts that. Apply always — it is the foundation for every other rule working correctly.
alwaysApply: true
---

# Rule adherence

Every rule currently in context is **mandatory**. Follow each one exactly, even under time or context pressure. When a rule is unclear, ask the user rather than assuming it doesn't apply.

**Why this rule exists:** Some models tend to under-weight rules in large contexts. Without an explicit "rules are mandatory" instruction, conventions get silently violated and the user has to repeat themselves.

**Good:** Task touches `apps/erato/src/routes/`. Agent checks root `NN-*.mdc` rules (always-applied) and also loads `erato-rules/` because globs match. Follows both.

**Bad:** Agent skips `11-pnpm-install-command-preference.mdc` because the task is "quick" and uses `pnpm add` instead. Rule was in context and mandatory — this is a violation.
