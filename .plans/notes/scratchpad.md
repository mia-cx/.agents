in stead of DOT, we should enforce mermaid for Dependency Graphs

TDD Red-Green-Refactor scaffolding protocol<- this is a STRONG candidate for our SOP set, and should hook into our PRD workflow.

## Ideas

### Skill build pipeline

A small TypeScript project that treats skills/SOPs as source files with placeholder includes (e.g. `{{include:tdd-workflow#red-green-refactor}}`), and compiles them to fully self-contained `dist/` files by resolving and inlining referenced content. Solves the problem of weaker models skipping cross-file references by removing the dependency entirely — the model gets everything it needs in one document. Authors work in `source/`, skills ship from `dist/`.

### Vocabulary

The system's internal language for all artifacts:

- **Policies** — scoped or global constraints, inlineable via `{{include:policy:X}}` or always-on globally. Scoped policies travel with the SOPs that need them.
- **Protocols** — atomic steps, inlineable via `{{include:proto:X}}` or callable standalone as `/proto:X`. The smallest reusable unit of procedure.
- **SOPs** — full user-facing workflows that compose policies and protocols via inline placeholder resolution. What the user actually invokes.
- **Agents** — specialized workers dispatched by SOPs for parallelized subtasks. Not user-callable, no persona, pure capability specs: tools, scope, constraints, output contract.

### `/proto:` namespace for reusable protocol steps

Partials are also standalone skills, callable on demand. Namespaced as `/proto:` — e.g. `/proto:grill`, `/proto:tdd`, `/proto:verify`. Signals composability: these are discrete protocol units that can be embedded into full workflows via `{{include:proto:grill}}` or invoked directly. "proto" is short, fun to type on qwerty, and distinct enough from top-level workflow skills that the difference is obvious.

### `/grill-me` as a reusable protocol step

`/grill-me` in its current form would not be a standalone skill — it's an inline protocol that gets embedded into any SOP where validating user intent matters before execution. Natural hosts: `/new`, `prd-create`, `refactor-plan`, architecture decisions. In the build pipeline sense it becomes a shareable partial: `{{include:proto:grill}}` dropped into any SOP that benefits from hardening the spec before proceeding. Still callable through `/proto:grill`.

### `/consider` skill

A pause-and-think trigger. Before the agent acts on a consequential decision, `/consider` interrupts execution momentum and forces it to surface tradeoffs, alternatives, and second-order effects — then argue against its own preferred path before proceeding. Mandatory pre-flight for decisions that are hard to reverse.

### `/dissect` skill

Artifact-facing counterpart to `/grill-me`. Where `/grill-me` interrogates the *user* to surface what they haven't thought through, `/dissect` tears apart a *thing* — a plan, spec, design, or piece of code — looking for weak points, hidden assumptions, and failure modes. The agent goes digging rather than waiting to be asked.

### `/new` skill

A universal creation entrypoint. The user says `/new feature that adds X to Y` — the agent infers the right skill chain (PRD → grill → issues → TDD), loads it, and runs it. No taxonomy knowledge required. `/new skill` routes to skill-creation SOPs. `/new page` pulls frontend design patterns. `/new feature` composes PRD, domain modelling, and TDD workflows. The skill itself stays deliberately thin — its only job is to read intent, select the best-fit SOPs from the available skill set, and hand off. Users get one entry point for everything; the agent handles the rest.

**Caveats to design for:**
- **Ambiguity resolution** — `/new integration` could mean an API integration, a CI pipeline, or an MCP server. Needs a lightweight clarification step before committing to a skill path.
- **Transparency** — surface the selected skill chain and reasoning before diving in, so the user can correct a wrong inference early.
- **Skill discovery** — the agent needs a reliable way to enumerate available skills at runtime; inference is only as good as what's in context.
- **Sequential vs parallel composition** — some workflows chain skills in order (prd → issues → tdd), others are alternatives (design skill A vs B). The router needs to handle both shapes.
- **Build the router last** — hard to get right before the base skill set is stable and the natural composition points are known.
