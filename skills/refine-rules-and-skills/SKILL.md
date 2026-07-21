---
name: refine-rules-and-skills
description: >-
  Audits and refines agent guidance files — memory files (CLAUDE.md, AGENTS.md, SYSTEM.md), skills (SKILL.md), rules, and agent definitions — keeping tribal knowledge and removing noise. Applies refactoring patterns (Vague→Specific, Negative→Positive, Imprecise→Precise, Verbose→High-signal) to tighten guidance.
  Use when the user asks to audit, optimize, refine, clean up, or tighten rules, skills, memory files, or agent prompts.
  Use when authoring new skills and editing skills to ensure they don't need to be audited after.
---

# Refine Rules & Skills

Refine agent guidance — while authoring it or auditing it later — by focusing on **tribal knowledge** (non-obvious facts agents can't infer from code) and removing noise, redundancy, and inferrable content.

## Targets

- **Memory files**: CLAUDE.md, AGENTS.md — loaded every session; every line costs tokens forever.
- **Skills**: `skills/**/SKILL.md` — discovered recursively, including namespaced skills, and loaded on trigger; the description is all the model sees until invocation.
- **Rules**: standalone rule files, whatever the harness calls them.
- **Agent definitions**: subagent/agent prompt files (`agents/*.md`).

## Quick Checklist

For every rule, skill, memory entry, or agent prompt:

- [ ] **Tribal, not inferrable**: Will the agent encounter this in context anyway — not merely *could* it be found somewhere? If it will surface on its own, delete or move; when unsure, keep.
- [ ] **Focused, not comprehensive**: <50 lines for rules and memory sections; 2–3 core concepts for skills. If longer, extract to references — inline what every use needs, push behind a linked file what only some paths reach.
- [ ] **Explains the "why"**: Is there a constraint or gotcha? Not just "use X" — "use X because Y constraint." ALL-CAPS ALWAYS/NEVER is a yellow flag: replace the shouting with the reasoning.

## Type-Specific Checks

### Memory files (CLAUDE.md / AGENTS.md)

- [ ] **Right file for the audience**: harness-agnostic guidance in the shared file (AGENTS.md); harness-specific mechanics in that harness's file (CLAUDE.md). Duplicated content drifts.
- [ ] **Remove content inferred in context**: delete rules the agent *will* encounter while doing the applicable work (visible in the edited files, or surfaced by typecheck/lint/tests). "When working on X, do Y" is suspect — Y is often self-evident inside X. *Can* ≠ *will*: facts in obscure corners stay written down.
- [ ] **No stale facts**: paths, model names, and tool flags rot — verify each still exists.

### Skills (`SKILL.md`)

- [ ] **Right invocation mode**: a skill only ever fired by hand gets `disable-model-invocation: true` — zero context load, and its description becomes a human-facing one-liner. Model-invoked descriptions list one trigger per distinct use; synonyms restating the same trigger are duplication.
- [ ] **Description carries the trigger**: it must state when to invoke, in the words a user would use — the model sees nothing else when deciding. Models undertrigger, so err pushy: name every distinct context that should fire the skill, including ones where the user doesn't name the topic — while keeping one trigger per distinct use (synonym spam is duplication). Sanity-check against near-misses: adjacent prompts sharing keywords but belonging elsewhere shouldn't match.
- [ ] **Checkable completion criteria**: each workflow step ends on a condition the agent can verify — and where it matters, exhaustive ("every modified file accounted for", not "produce a list"). Vague criteria invite declaring done early.
- [ ] **Remove bloat**: cut motivational prose about why the *topic* matters — it persuades readers, not agents. One-clause "because Y" constraints on individual rules stay. Test each sentence in isolation: does it change behavior versus the model's default? Delete failing sentences whole rather than trimming words.
- [ ] **Keep examples concrete**: runnable/adaptable, not generic.
- [ ] **Remove redundancy**: if external docs or another skill cover it, link instead.
- [ ] **Task-class applicable**: works for a family of tasks, not one instance.
- [ ] **Repeated work becomes a script**: when runs of the skill keep re-deriving the same helper (a converter, a query, a validation), write it once into the skill's `scripts/` and point to it.

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

### Pattern 4: Verbose → High-signal (leading words)

Find the **leading word** — a compact concept already living in the model's pretraining — that carries the desired behavior, and let it replace the prose. Models have deep priors on precise terms: one well-chosen word steers harder than a paragraph of explanation. In a skill body a leading word anchors execution (the agent reaches for the same behavior every time it appears); in a description it anchors invocation (reusing the same word across prompts, docs, and code makes the skill fire more reliably).

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

This skill is the static audit. When a skill's quality is contested or hard to judge by reading — or its description mis-triggers in practice — add an empirical loop: run representative test prompts with and without the skill, compare results, and optimize description triggering with a repeatable script when needed.
