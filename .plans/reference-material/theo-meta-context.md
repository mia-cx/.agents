# Theo Meta-Context for the Role-to-SOP Project

Source grounding:
- Derived from `.plans/reference-material/theo-jira-and-linear-are-legacy-software-transcript.md`

## Why this project exists right now

We are working on `role-to-sop` because the agent ecosystem still encodes too much workflow logic as:
- roles
- personas
- identity play
- org-chart metaphors
- human handoff rituals

Theo's argument sharpens the reason to act now:
- legacy issue/process systems were designed for human handoffs
- those systems accumulated ceremony because engineering time was scarce and work had to be routed across specialized humans
- with strong coding agents, much of that procedural overhead can now be compressed
- the valuable part is not the role theater, but the context, rules, checks, escalation, and execution flow

This directly motivates the thesis of this repo:
- skills and subagent prompts should be written as SOPs
- the durable unit is not identity, but procedure
- we should preserve what to check, how to do the task, quality bars, escalation paths, and next steps
- we should strip unnecessary persona packaging wherever possible

## Theo's core findings that matter for this repo

### 1. Issue-tracker and handoff-heavy workflows are legacy-shaped
Theo highlights Linear's claim that issue tracking was built for a handoff model:
- PM scopes work
- engineers pick it up later
- process exists to bridge role boundaries

His key point is that this made sense under older constraints, but the ceremony expanded until process became work itself.

Relevance here:
- many agent systems still inherit this same structure
- they simulate a team of specialists instead of asking what the minimum reliable workflow actually is
- this is exactly the pattern we want to challenge in `role-to-sop`

### 2. Agents shift value away from procedural overhead and toward intent, judgment, and taste
Theo quotes the idea that agents compress planning, implementation, and review by absorbing procedural work, leaving humans more focused on:
- intent
- judgment
- taste

Relevance here:
- prompts should not waste most of their budget simulating titles or identity
- prompts should encode the execution machinery that helps an agent do useful work with low overhead
- where human involvement is needed, the prompt should specify what decision to escalate and how

### 3. The best plan is often a prototype, not a long pre-spec
Theo's own working method is:
- build a small first version quickly
- use it to expose UX, technical constraints, and true scope
- then write a better plan or spec if needed
- often, the rough version is already close to the shippable answer

Relevance here:
- many prompts overproduce planning layers, subplans, and role-based review rituals before touching the work
- a better SOP often starts with a narrow executable first pass, then uses findings to refine the plan
- for our repo, this supports SOPs that emphasize investigation, prototype-first exploration, and evidence-based refinement over ceremony

### 4. The real substrate is context + rules + execution, not issues or personas
Theo's read of where systems are going is:
- capture context
- shape context into executable work
- route to the right actor or tool
- escalate when needed
- keep execution moving

He also points out that systems like gstack still package this as role-play, even when the underlying mechanics are just markdown instructions.

Relevance here:
- we should extract the reusable substrate beneath role wrappers:
  - context handling
  - checklists
  - decision protocols
  - escalation rules
  - artifact contracts
  - verification steps
- this is the exact extraction target for `role-to-sop`

### 5. If the model can do many task types, human role boundaries may no longer be the right abstraction
Theo's criticism of systems like gstack is roughly:
- if the model can be the CEO, manager, designer, reviewer, debugger, QA lead, etc.
- why preserve all those historic human boundaries as the primary interface?

He argues many of these divisions existed because humans were specialized and coordination was expensive.

Relevance here:
- in our repo, task boundaries should be based on workflow needs, not organizational theater
- a good split is more like:
  - review
  - planning
  - debugging
  - QA
  - release
  - decision escalation
- and less like:
  - pretend CEO
  - pretend founder
  - pretend senior designer

### 6. Some human-like workflow structures may still remain useful, but only if they improve execution
Theo allows a possible counterpoint:
- maybe models perform better when organized around human-like structures because the training data comes from humans

But his working belief is still:
- prototype first
- use code as a way to discover the real plan
- preserve only the useful context and checks
- do not preserve ceremony just because that is how teams used to work

Relevance here:
- this is the right posture for `role-to-sop`
- we should not remove structure recklessly
- we should keep any workflow structure that measurably improves reliability or quality
- but we should be skeptical of identity layers unless they clearly help

## Practical implications for this project

When auditing reference repos or designing new SOPs, prefer extracting:
- what to check
- how to do the task
- what evidence to gather
- what good looks like
- what to escalate
- what comes next

Treat the following as suspect by default unless proven useful:
- identity role-play
- founder/celebrity authority framing
- org-chart metaphors
- excessive planning ceremony
- multi-stage review theater without clear value
- handoff-heavy workflow structure inherited from human team design

## How this should influence our repo decisions

### Keep
- checklists
- stage gates
- artifact contracts
- verification steps
- explicit escalation rules
- source-of-truth contributor rules
- context-to-execution workflows
- prototype-first / investigation-first methods where appropriate

### De-emphasize or remove
- "you are a CEO"
- "you are a senior designer"
- "you are a security expert"
- founder mythology or branding as a substitute for method
- unnecessary persona wrappers around otherwise straightforward SOPs

### Use as a design test
When evaluating a prompt, skill, or subagent, ask:
1. If the role label were removed, would the method still work?
2. What exact procedure is being smuggled inside the identity framing?
3. Can that procedure be rewritten more directly as an SOP?
4. Does the current structure reduce or increase procedural overhead?
5. Is the prompt helping the agent execute, or just helping the user feel like they are talking to a person?

## Recommended usage

Use this file as the default Theo grounding context for delegated runs.
Only load the full transcript when:
- we need exact quotes beyond what is summarized here
- we want to revisit Theo's nuance or counterarguments
- we are validating whether this summary has over-compressed something important
