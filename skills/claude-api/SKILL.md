---
name: claude-api
description: "Builds apps and integrations with the Claude API, Anthropic SDKs, and Agent SDK tooling. Use when code imports `anthropic`, `@anthropic-ai/sdk`, or `claude_agent_sdk`, or when the user asks for Claude API features, Anthropic SDK usage, streaming, tools, or agent workflows. Not for OpenAI-only integrations, general programming, or unrelated ML/data-science tasks."
license: Complete terms in LICENSE.txt
---

# Building LLM-Powered Applications with Claude

Treat this file as a router. Read the selection guide first, then load only the language- and surface-specific docs that match the task.

## Workflow

1. Start with `shared/selection-guide.md`.
   - It covers defaults, language detection, surface selection, model guidance, thinking/effort rules, compaction, and the reading guide.
2. Detect the language and choose the smallest surface that fits:
   - Claude API for single calls and code-orchestrated workflows
   - Agent SDK when built-in file/web/terminal tools, permissions, or MCP support are the point
3. After that, read only the files the selection guide calls for in `{language}/claude-api/`, `{language}/agent-sdk/`, or `shared/`.
4. Use WebFetch only when the selection guide says current/live docs matter.

## Rules

- Never guess model IDs or SDK capabilities.
- Default to Opus 4.6 unless the user explicitly asks for another model.
- Keep the body lean and push detailed reference material into the language folders and shared guides.
