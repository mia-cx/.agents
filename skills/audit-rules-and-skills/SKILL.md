---
name: audit-rules-and-skills
description: >-
  Audits and improves agent guidance files — memory files (CLAUDE.md,
  AGENTS.md, SYSTEM.md), skills (SKILL.md), rules, and agent definitions —
  keeping tribal knowledge and removing noise. Applies refactoring patterns
  (Vague→Specific, Negative→Positive, Imprecise→Precise) to tighten guidance.
  Use when the user asks to audit, optimize, clean up, or tighten rules,
  skills, memory files, or agent prompts.
---

# Audit Rules & Skills

Audit and improve existing agent guidance by focusing on **tribal knowledge** (non-obvious facts agents can't infer from code) and removing noise, redundancy, and inferrable content.

## Targets

- **Memory files**: CLAUDE.md, AGENTS.md, SYSTEM.md — loaded every session; every line costs tokens forever.
- **Skills**: `skills/*/SKILL.md` — loaded on trigger; the description is all the model sees until invocation.
- **Rules**: standalone rule files, whatever the harness calls them.
- **Agent definitions**: subagent/agent prompt files (`agents/*.md`).

## Quick Checklist

For every rule, skill, memory entry, or agent prompt:

- [ ] **Tribal, not inferrable**: Can agents discover this in code, tests, or docs? If yes, delete or move.
- [ ] **Focused, not comprehensive**: <50 lines for rules and memory sections; 2–3 core concepts for skills. If longer, extract to references.
- [ ] **Explains the "why"**: Is there a constraint or gotcha? Not just "use X" — "use X because Y constraint."

## Type-Specific Checks

### Memory files (CLAUDE.md / AGENTS.md / SYSTEM.md)

- [ ] **Right file for the audience**: harness-agnostic guidance in the shared file (AGENTS.md/SYSTEM.md); harness-specific mechanics in that harness's file (CLAUDE.md). Duplicated content drifts.
- [ ] **Remove inferrable content**: discoverable from code, tests, or linting config → delete.
- [ ] **No stale facts**: paths, model names, and tool flags rot — verify each still exists.

### Skills (`SKILL.md`)

- [ ] **Description carries the trigger**: it must state when to invoke, in the words a user would use — the model sees nothing else when deciding.
- [ ] **Remove bloat**: skip "why this matters" essays — focus on steps.
- [ ] **Keep examples concrete**: runnable/adaptable, not generic.
- [ ] **Remove redundancy**: if external docs or another skill cover it, link instead.
- [ ] **Task-class applicable**: works for a family of tasks, not one instance.

### Agent definitions

- [ ] **Justify existence**: could this be a rule or skill instead?
- [ ] **Specialized prompt necessary**: or is it noise around a model choice?

## Three Refactoring Patterns

### Pattern 1: Vague → Specific

Replace adjectives with concrete, actionable steps.

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

## Example Cleanups

**Coding convention → Delete**

```markdown
# Svelte Patterns

- Use const arrow functions, not function declarations
- Prefer reactive declarations ($derived)
```

↳ Discoverable from code and linting config.

**Comprehensive skill → Focused reference**

```markdown
Before: 9 sections (History, Concepts, Setup, Writing, Testing, Deployment, Troubleshooting, Tuning, Rollbacks)

After:

# Drizzle Migration Workflow

1. Update schema in src/schema.ts
2. Run `drizzle-kit generate:pg`
3. Review generated SQL
4. Run `drizzle-kit migrate:pg`

**Gotcha**: Regenerate migrations from schema instead of editing them by hand.
```

↳ Move detailed sections to external docs.

**Missing "why" → Add constraint**

```markdown
Before: Use openpyxl for Excel, not xlrd.

After: Use openpyxl for Excel, not xlrd. Reason: xlrd only supports .xls (legacy); doesn't support .xlsx.
```

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

## Workflow

1. Read the rule/skill/memory file.
2. Ask: **Is this tribal?** (Discoverable from code/tests/external docs?) → If no, delete or move.
3. Ask: **Is this focused?** (< limit?) → If no, extract to references.
4. Ask: **Does it explain why?** (Constraint, gotcha, non-obvious choice?) → If no, add it.
5. Apply refactoring patterns: Vague→Specific, Negative→Positive, Imprecise→Precise.
6. Commit.
