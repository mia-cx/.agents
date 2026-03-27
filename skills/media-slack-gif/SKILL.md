---
name: media-slack-gif
description: "Creates animated GIFs that fit Slack’s practical constraints and look good in chat. Use when the user asks for a Slack GIF, looping reaction animation, or short motion graphic meant to be shared in Slack. Not for long-form video, web animation systems, or static poster design."
license: Complete terms in LICENSE.txt
---

# Slack GIF Creator

Treat this file as a router. Decide what kind of GIF work the user needs, then load only the relevant guide.

## Workflow

1. Classify the task:
   - create a Slack-ready GIF from scratch
   - animate or reinterpret a user-uploaded image
   - optimize or validate an existing GIF for Slack
2. Read only what matches:
   - `references/workflow.md` for Slack constraints, core generation flow, drawing guidance, and image-handling rules
   - `references/toolkit.md` for the bundled utilities in `core/`
   - `references/animation-patterns.md` for motion ideas, optimization strategies, and dependency notes
3. Use the provided `core/` helpers instead of reinventing validation, easing, or GIF assembly.
4. Validate the result against Slack constraints before declaring it done.

## Rules

- Keep animations short, legible, and chat-friendly.
- Prefer polished PIL-based drawing over emoji-font hacks or assumed built-in graphics.
- Load optimization guidance only when file size or Slack compatibility is the actual problem.
