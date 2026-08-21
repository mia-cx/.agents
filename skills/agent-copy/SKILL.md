---
name: agent-copy
description: Use when writing text an agent will consume: a skill, rule or memory file, plan, or subagent prompt.
---

# Agent copy

How to write for agents. A skill, a rule file, a plan, and a subagent prompt are packaged differently, but the same levers make each one predictable: the agent takes the same *process* every run. The `/refine` set audits existing documents against this reference. Write new ones from it directly; for subagent prompts, apply it inline.

## Context pointers

A **context pointer** is an in-context reference that names out-of-context material and the condition for reaching it: a skill description, an AGENTS.md line naming a doc, a plan step citing a file. The pointer's *wording*, not its target, decides whether the agent gets there. A must-have target behind a weakly worded pointer is a variance bug. Sharpen the wording first; inline the material only if sharpening fails.

A pointer states what the material is and lists the **branches** that trigger reaching it. Always-loaded pointers earn the hardest pruning: front-load the leading word, keep one trigger per branch (synonyms renaming one branch collapse to one), and cut identity the body already carries.

## The two loads

Every document and pointer spends one of two budgets:

- **Context load**: always-loaded material (a rule line, a skill description) costs tokens and attention every turn, whether or not it fires.
- **Cognitive load**: the human remembering what exists and when to reach for it. Not a cost to minimize; it is the price of human agency. Spend it where human judgment matters.

Material behind a pointer escapes context load for the price of the pointer's line. Material with no pointer rides entirely on the human.

## Information hierarchy

Two content types, **steps** (ordered actions) and **reference** (rules and facts consulted on demand), sit on a ladder ranked by how immediately the agent needs them:

1. **In-file step**: what the agent does, in order.
2. **In-file reference**: consulted on demand. A flat peer-set of rules is a fine arrangement, not a smell.
3. **Disclosed reference**: a separate file behind a pointer, loaded only when it fires.

**Progressive disclosure** is the move down the ladder. The branching test decides: inline what every branch needs; push behind a pointer what only some branches reach. Inline reference that should be disclosed buries the steps, and whether the agent attends to them becomes a coin flip.

**Co-location** decides what sits beside what: keep a concept's definition, rules, and caveats under one heading. Scattering fragments one meaning across many places; duplication repeats it. **Sprawl** is a document too long even when every line is live; attention thins across the excess. The cure for all three is the ladder.

## Steps and completion criteria

Every step ends on a **completion criterion**. Two properties matter:

- **Clarity**: can the agent tell done from not-done? A fuzzy bound ("understanding reached") invites **premature completion**, pulled forward by the visible later steps. Sharpen the bound first; that fix is cheap and local. Hide the later steps only if the bound is irreducibly fuzzy and you observe the rush, and hiding only works across a real context boundary (a handoff or a subagent dispatch). An inline call leaves the later steps in context and clears nothing.
- **Demand**: how much the wording requires. "Every modified file accounted for" forces legwork where "produce a list" does not. Demand also binds flat reference: "every rule applied" is an exhaustiveness bar with no steps at all.

The strongest criteria are both checkable and exhaustive.

## Leading words

A **leading word** is a compact concept already in the model's pretraining (*adversarially*, *self-contained*, *verbatim*, *idempotent*, *atomic*, *exhaustive*, *tight*). Repeated as a token, it anchors a region of behavior in few tokens by recruiting priors the model already holds. It works twice: in a body it anchors execution; in a pointer it anchors invocation. Reuse the same word across prompts, docs, and code, and the agent links that shared language to the material.

Hunt for prose to collapse: "fast, deterministic, low-overhead" is a *tight* loop. A coined word recruits no priors, so you pay its definition in tokens; reach for a pretrained word first. A word too weak to beat the default (*be thorough*) is a no-op. The fix is a stronger word (*relentless*), not more prose.

**Negation** is the adjacent failure: a prohibition drags the forbidden behavior into context and half-reads as an instruction to do it. State the positive target ("write one-line comments") so the banned thing is never spoken. A prohibition survives only as a hard guardrail you cannot phrase positively, and it stays paired with its positive.

## Sharpening

- **Explain the why.** A constraint earns compliance with its reason: "use X because Y". ALL-CAPS emphasis flags a missing reason; replace the shouting with the because.
- **Imprecise to precise.** Give vague instructions concrete targets: audience, length, counts, examples. "2–3 sentences, high-school reader, one concrete example" beats "keep it short".

## Pruning

- **Single source of truth.** One meaning, one authoritative place, so changing behavior is a one-place edit. Duplication costs maintenance and inflates a meaning's apparent rank.
- **The environment is a source of truth.** Package scripts, config, `--help` output, the directory layout. A document restating them is a **cache** that goes stale. Cache only what no lookup reveals: the unwritten convention, the reason behind a choice, the gotcha no config confesses.
- **Relevance.** A line dies by never bearing on the task or by the world moving on. Without pruning discipline the default fate is **sediment**: stale layers that settle because adding feels safe and removing feels risky.
- **No-ops.** Sentence by sentence: does it change behavior versus the model's default? Delete failing sentences whole. The test is model-relative; settle disputes by running the document, not by debate.

## Skill mechanics

- **Model-invoked** (has a description): permanent context load in exchange for autonomous reach; the agent and other skills can fire it. Pay this only when that reach is needed.
- **User-invoked** (`disable-model-invocation: true`): zero context load. The description becomes a human-facing one-liner. Only the human can fire it; no other skill can.
- **Shared reference** that two user-invoked skills need lives in neither: a plain file both point at, or a model-invoked reference skill.
- **Split off a model-invoked skill** only when a distinct trigger word you actually use should fire it independently, or another skill must reach it. The new description is new permanent load.
- **Router skills** cure piled-up cognitive load: one user-invoked skill naming the others and when to reach each. It can only hint, never fire them.
