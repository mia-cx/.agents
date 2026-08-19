---
name: agent-copy
description: >-
  Use when writing text an agent will consume — a skill, rule or memory file,
  plan, or subagent prompt.
---

# Agent Copy

How to write for agents. The packaging differs — skill, rule file, plan, prompt — but the levers are the same: they make the agent take the same *process* every run. The `/refine` set audits existing documents against this reference; write new ones from it directly. For subagent prompts, apply it inline — no workflow needed.

## Context pointers

A **context pointer** is an in-context reference naming out-of-context material and the condition for reaching it — a skill description, an AGENTS.md line naming a doc, a plan step citing a file. The pointer's *wording*, not its target, decides whether the agent gets there. A must-have target behind a weakly worded pointer is a variance bug: sharpen the wording first; inline the material only if sharpening fails.

A pointer states what the material is and lists the **branches** that trigger reaching it. Always-loaded pointers earn the hardest pruning: front-load the leading word, one trigger per branch (synonyms renaming one branch collapse to one), cut identity the body already carries.

## The two loads

Every document and pointer spends one of two budgets:

- **Context load** — always-loaded material (a rule line, a skill description) costs tokens and attention every turn, firing or not.
- **Cognitive load** — the human remembering what exists and when to reach for it. Not a cost to minimize — it's the price of human agency; spend it where human judgment matters.

Material behind a pointer escapes context load for the price of the pointer's line; material with no pointer rides entirely on the human.

## Information hierarchy

Two content types — **steps** (ordered actions) and **reference** (rules and facts consulted on demand) — sit on a ladder ranked by immediacy:

1. **In-file step** — what the agent does, in order.
2. **In-file reference** — consulted on demand; a flat peer-set of rules is a fine arrangement, not a smell.
3. **Disclosed reference** — a separate file behind a pointer, loaded only when it fires.

**Progressive disclosure** is the move down the ladder. The branching test decides: inline what every branch needs; push behind a pointer what only some branches reach. Reference that should be disclosed but sits inline buries the steps — a variance lever, not just legibility.

**Co-location** decides what sits beside what: keep a concept's definition, rules, and caveats under one heading. Scattering fragments one meaning across many places (distinct from duplication, which repeats it). **Sprawl** — too long even with every line live — thins attention; the cure is the ladder.

## Steps and completion criteria

Every step ends on a **completion criterion**. Two properties:

- **Clarity** — can the agent tell done from not-done? A fuzzy bound ("understanding reached") invites **premature completion**, pulled forward by the visible later steps. Sharpen the bound first — cheap and local. Only if it's irreducibly fuzzy *and* you observe the rush, hide the later steps — and hiding only works across a real context boundary (a handoff or subagent dispatch); an inline call leaves them in context and clears nothing.
- **Demand** — how much the wording requires. "Every modified file accounted for" forces legwork where "produce a list" doesn't. Demand also binds flat reference: "every rule applied" is an exhaustiveness bar with no steps at all.

The strongest criteria are both checkable and exhaustive.

## Leading words

A **leading word** is a compact concept already in the model's pretraining (*adversarially*, *self-contained*, *verbatim*, *idempotent*, *atomic*, *exhaustive*, *tight*). Repeated as a token, it anchors a region of behavior in minimal tokens by recruiting priors. It works twice: in a body it anchors execution; in a pointer it anchors invocation — reuse the same word across prompts, docs, and code and the agent links the language to the material.

Hunt for prose to collapse: "fast, deterministic, low-overhead" → a *tight* loop. A coined word recruits no priors — you pay its definition in tokens; reach for a pretrained word first. A word too weak to beat the default (*be thorough*) is a no-op; the fix is a stronger word (*relentless*), not more prose.

**Negation** is the adjacent failure: a prohibition drags the forbidden behavior into context and half-reads as an instruction to do it. State the positive target ("write one-line comments") so the banned thing is never spoken. A prohibition survives only as a hard guardrail you can't phrase positively — paired with its positive.

## Pruning

- **Single source of truth.** One meaning, one authoritative place; changing behavior is a one-place edit. Duplication costs maintenance and inflates a meaning's apparent rank.
- **The environment is a source of truth.** Package scripts, config, `--help`, directory layout — a document restating them is a **cache** that goes stale. Cache only what no lookup reveals: the unwritten convention, the reason behind a choice, the gotcha no config confesses.
- **Relevance.** A line dies by never bearing on the task or by the world moving on. Without pruning discipline the default fate is **sediment** — stale layers that settle because adding feels safe and removing feels risky.
- **No-ops.** Sentence by sentence: does it change behavior versus the model's default? Delete failing sentences whole. The test is model-relative — settle disputes by running the document, not debating.

## Skill mechanics

- **Model-invoked** (has a description): permanent context load in exchange for autonomous reach — the agent and other skills can fire it. Required only when that reach is needed.
- **User-invoked** (`disable-model-invocation: true`): zero context load; the description becomes a human-facing one-liner; only the human can fire it — no other skill can.
- **Shared reference** two user-invoked skills need lives in neither: a plain file both point at, or a model-invoked reference skill.
- **Split off a model-invoked skill** only when a distinct trigger word you actually use should fire it independently, or another skill must reach it — the new description is new permanent load.
- **Router skills** cure piled-up cognitive load: one user-invoked skill naming the others and when to reach each. It can only hint, never fire them.
