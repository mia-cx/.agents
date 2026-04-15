## Opus Advisor Skill

When rewriting the SDLC agents, add an `opus-advisor` skill/agent that worker
agents (Sonnet) can invoke via the Task tool when they hit a roadblock.

Key design notes:
- Worker agents should escalate after 2+ failed attempts, unclear architectural
  tradeoffs, or undiagnosable errors
- Advisor should reason and recommend only — not implement
- Handoff brief should include: what was attempted, what failed, specific question
- Keep advisor maxTurns low (3-5), model: opus, effort: high
- See conversation context for full implementation details
