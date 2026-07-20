---
name: audit-rules-and-skills
description: >-
  Audits and improves agent guidance files — memory files (CLAUDE.md,
  AGENTS.md, SYSTEM.md), skills (SKILL.md), rules, and agent definitions —
  keeping tribal knowledge and removing noise. Applies refactoring patterns
  (Vague→Specific, Negative→Positive, Imprecise→Precise, Verbose→High-signal)
  to tighten guidance.
  Use when the user asks to audit, optimize, clean up, or tighten rules,
  skills, memory files, or agent prompts.
---

# Audit Rules & Skills

Audit and improve existing agent guidance by focusing on **tribal knowledge** (non-obvious facts agents can't infer from code) and removing noise, redundancy, and inferrable content.

## Targets

- **Memory files**: CLAUDE.md, AGENTS.md — loaded every session; every line costs tokens forever.
- **Skills**: `skills/*/SKILL.md` — loaded on trigger; the description is all the model sees until invocation.
- **Rules**: standalone rule files, whatever the harness calls them.
- **Agent definitions**: subagent/agent prompt files (`agents/*.md`).

## Quick Checklist

For every rule, skill, memory entry, or agent prompt:

- [ ] **Tribal, not inferrable**: Will the agent encounter this in context anyway — not merely *could* it be found somewhere? If it will surface on its own, delete or move; when unsure, keep.
- [ ] **Focused, not comprehensive**: <50 lines for rules and memory sections; 2–3 core concepts for skills. If longer, extract to references.
- [ ] **Explains the "why"**: Is there a constraint or gotcha? Not just "use X" — "use X because Y constraint."

## Type-Specific Checks

### Memory files (CLAUDE.md / AGENTS.md)

- [ ] **Right file for the audience**: harness-agnostic guidance in the shared file (AGENTS.md); harness-specific mechanics in that harness's file (CLAUDE.md). Duplicated content drifts.
- [ ] **Remove content inferred in context**: delete rules the agent *will* encounter while doing the applicable work (visible in the edited files, or surfaced by typecheck/lint/tests). "When working on X, do Y" is suspect — Y is often self-evident inside X. *Can* ≠ *will*: facts in obscure corners stay written down.
- [ ] **No stale facts**: paths, model names, and tool flags rot — verify each still exists.

### Skills (`SKILL.md`)

- [ ] **Description carries the trigger**: it must state when to invoke, in the words a user would use — the model sees nothing else when deciding.
- [ ] **Remove bloat**: cut motivational prose about why the *topic* matters — it persuades readers, not agents. One-clause "because Y" constraints on individual rules stay.
- [ ] **Keep examples concrete**: runnable/adaptable, not generic.
- [ ] **Remove redundancy**: if external docs or another skill cover it, link instead.
- [ ] **Task-class applicable**: works for a family of tasks, not one instance.

### Agent definitions

- [ ] **Justify existence**: could this be a rule or skill instead?
- [ ] **Specialized prompt necessary**: or is it noise around a model choice?

## Refactoring Patterns

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

### Pattern 4: Verbose → High-signal

Find the word or verb that already carries the desired behavior, and let it replace the prose. Models have deep priors on precise terms — one well-chosen word steers harder than a paragraph of explanation.

**Before:**

```text
When you finish making changes, look over the diff and consider whether there might be issues. Be critical of your own implementation rather than assuming it works.
```

**After:**

```text
Adversarially review your own diff before reporting done.
```

**Before:**

```text
Write the prompt so that the model has everything it needs and doesn't have to ask follow-up questions or look at other files for context.
```

**After:**

```text
Write a self-contained prompt.
```

Words that tend to pull this weight: *adversarially*, *self-contained*, *verbatim*, *atomic*, *idempotent*, *minimal*, *exhaustive*, *only*, *exactly*. The test: if deleting the surrounding prose loses nothing once the word is in place, the word was the signal.

## Example Cleanups

Worked before/afters (convention deletion, skill slimming, missing-why, tribal-only rewrite): [references/examples.md](references/examples.md).

## Workflow

1. Read the rule/skill/memory file.
2. Run the Quick Checklist, then the type-specific checks; delete, move, or add per each failed check.
3. Apply refactoring patterns: Vague→Specific, Negative→Positive, Imprecise→Precise, Verbose→High-signal.
4. Commit.
