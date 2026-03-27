---
name: mcp-builder
description: "Designs and implements high-quality MCP servers and tool interfaces for external systems. Use when the user wants to build an MCP server, expose an API through MCP, design MCP tools, or compare FastMCP vs Node/TypeScript MCP SDK approaches. Not for ordinary REST clients or generic API wrappers that are not MCP-based."
license: Complete terms in LICENSE.txt
---

# MCP Server Development Guide

Treat this file as a router. Start with the workflow guide, then load only the implementation references needed for the current phase.

## Workflow

1. Read `reference/workflow.md` first for the end-to-end MCP server process.
2. Then load the narrowest supporting references for the current phase:
   - `reference/mcp_best_practices.md` for design standards
   - `reference/node_mcp_server.md` for TypeScript implementation details
   - `reference/python_mcp_server.md` for Python/FastMCP implementation details
   - `reference/evaluation.md` for post-build eval design
3. Research the external API and protocol docs before implementing tools.
4. Keep tool design discoverable, typed, and evaluation-driven.

## Rules

- Prefer focused reference loading over reading every implementation guide up front.
- Use the workflow guide to choose the phase before diving into language-specific docs.
- Keep the main SKILL.md as routing/process guidance, not the full knowledge base.
