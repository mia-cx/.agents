---
name: optimize-agent-rules
description: Audit and improve rules, skills, and subagents by keeping tribal knowledge and removing noise. Apply refactoring patterns (Vague→Specific, Negative→Positive, Imprecise→Precise) to tighten guidance.
---

<!-- @format -->

# Optimize Agent Rules (Rules, Skills, Subagents)

## Purpose

Audit and improve existing rules, skills, and subagents by focusing on **tribal knowledge** (non-obvious facts agents can't infer from code) and removing noise, redundancy, and inferrable content.

---

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

## Three Refactoring Patterns

### Pattern 1: Vague → Specific

Replace adjectives and instructions with concrete, actionable steps.

**Before:**

```text
Be concise. Don't ramble. Use good formatting.
```

**After:**

```text
1. Write short sentences. One idea per sentence.
2. Use headings, lists, tables for scannability.
3. Skip filler intros ("In this document...", "It is important to note...").
4. Prefer concrete nouns and active voice.
```

---

### Pattern 2: Negative → Positive

Reframe as desired behavior, not forbidden action. Negative instructions make models fixate on the forbidden action.

**Before:**

```text
DO NOT ASK FOR INTERESTS. DO NOT ASK FOR PERSONAL INFORMATION.
```

**After:**

```text
Recommend from top global trending items. If user asks for preferences, respond: "I can't store preferences, but here are today's trending picks..."
```

---

### Pattern 3: Imprecise → Precise

Add concrete targets: audience, length, examples, constraints.

**Before:**

```text
Explain the concept. Keep it short, don't be too descriptive.
```

**After:**

```text
Use 2–3 sentences. Target: high school student. Include one concrete example.
```

---

## Example Cleanups

**Coding convention → Delete**

```markdown
# Svelte Patterns

- Use const arrow functions, not function declarations
- Prefer reactive declarations ($derived)
```

↳ Discoverable from code and linting config.

---

**Comprehensive skill → Focused reference**

```markdown
Before: 9 sections (History, Concepts, Setup, Writing, Testing, Deployment, Troubleshooting, Tuning, Rollbacks)

After:

# Drizzle Migration Workflow

1. Update schema in src/schema.ts
2. Run `drizzle-kit generate:pg`
3. Review generated SQL
4. Run `drizzle-kit migrate:pg`

**Gotcha**: Don't manually edit migrations. Always regenerate from schema.
```

↳ Move detailed sections to external docs.

---

**Missing "why" → Add constraint**

```markdown
Before: Use openpyxl for Excel, not xlrd.

After: Use openpyxl for Excel, not xlrd. Reason: xlrd only supports .xls (legacy); doesn't support .xlsx.
```

---

**Mixed tribal + inferrable → Keep tribal only**

```markdown
Before:

# Authentication

- Use WorkOS for user management
- Store session tokens in cookies
- Set HttpOnly flag on cookies
- Implement refresh token rotation
- Use RSA for signing tokens

After:

# WorkOS + Cloudflare Workers

WorkOS SDK doesn't run in Workers. Use custom REST API instead. See apps/shared/auth/workos-rest.ts for endpoints and request format. (Token storage, signing, rotation are discoverable from code/tests.)
```

---

## Workflow

1. Read the rule/skill
2. Ask: **Is this tribal?** (Discoverable from code/tests/external docs?) → If no, delete or move
3. Ask: **Is this focused?** (< limit?) → If no, extract to external docs
4. Ask: **Does it explain why?** (Constraint, gotcha, non-obvious choice?) → If no, add it
5. Apply refactoring patterns: Vague→Specific, Negative→Positive, Imprecise→Precise
6. Commit
