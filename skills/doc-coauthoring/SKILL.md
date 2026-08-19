---
name: doc-coauthoring
description: >-
  Use when the user wants to write or co-author a doc — a proposal, technical
  spec, decision doc, or RFC.
---

# Doc Co-Authoring

Guide the user through three stages: context gathering, section-by-section refinement, reader testing. Name the stages up front and ask if they want the workflow; work freeform if they decline. Invoke the `talk-normal` skill before drafting anything — it governs the doc's prose and tone, not just chat.

## Stage 1: Context Gathering

Goal: close the gap between what the user knows and what you know.

Ask for meta-context first: doc type, audience, desired impact on the reader, template or required format, other constraints. Then have them dump everything, unorganized — background, prior discussions, rejected alternatives, org context and politics, timelines, architecture, stakeholder concerns. They can answer in shorthand, paste content, or point at channels and docs to read (fetch via available integrations; ask before searching for entities they haven't named).

If editing an existing shared doc, flag images without alt-text — readers who paste the doc into an AI tool lose them — and offer to generate alt-text.

When the dump slows, ask 5–10 numbered clarifying questions; shorthand answers are fine ("1: yes, 2: see #channel"). Address missing context as it surfaces rather than letting gaps accumulate.

Exit when your questions are about edge cases and trade-offs, not basics. Ask whether to move to drafting.

## Stage 2: Refinement & Structure

Agree on the section list (suggest 3–5 sections fitting the doc type if the user doesn't know), then create the doc as a markdown file with placeholder sections. Start with the section holding the most unknowns — the core proposal for decision docs, the technical approach for specs; summaries last.

Per section:

1. **Clarify** — 5–10 questions on what belongs here.
2. **Brainstorm** — 5–20 numbered candidate points, in chat, never in the doc; offer to generate more.
3. **Curate** — the user keeps/removes/combines by number, with brief justifications ("remove 6 — audience knows this"); freeform feedback works too — extract and apply it. Their justifications teach you priorities for later sections.
4. **Gap check** — anything important missing from what survived?
5. **Draft** — replace the section's placeholder with surgical edits; never reprint the whole doc. On the first section, ask the user to request changes instead of editing directly so you learn their style; if they edit directly anyway, read their diff as style signal.
6. **Refine** — iterate until they're satisfied. After 3 iterations with no substantial change, ask what can be removed without losing information.

When 80%+ of sections are done, re-read the entire doc for flow, contradictions, redundancy, and filler — every sentence carries weight.

## Stage 3: Reader Testing

Goal: verify the doc works for readers who lack the authors' context.

1. Predict 5–10 questions real readers would bring to the doc.
2. Fresh-context test: give a subagent only the doc text and one question each; also probe what's ambiguous, what knowledge the doc assumes, and whether it self-contradicts. Without subagents, hand the user the questions to run in a fresh conversation themselves.
3. Loop back to Stage 2 for the sections Reader Claude got wrong.

Exit when a fresh reader answers every question correctly and surfaces no new gaps.

## Wrap-up

The user does the final read-through themselves — facts, links, and intended impact are their responsibility, and their name is on it. Suggest appendices for depth the main doc shouldn't carry, and updating the doc as real-reader feedback arrives.
