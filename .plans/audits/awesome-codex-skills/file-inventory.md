# File Inventory — awesome-codex-skills

> Scope: `/Users/mia/.agents/.worktrees/role-to-sop/.references/awesome-codex-skills`
> Skipped: README.md, lock files, images, binaries, font files, licence files, `.git/`, empty template-skill/SKILL.md, scripts (Python utilities), and theme/database/template files that are data assets rather than agent instructions.

---

## SKILL.md — Primary agent instruction files

brand-guidelines/SKILL.md | skill | Applies OpenAI brand colours and typography (hex values, font stack) to any artifact that should match the Codex/OpenAI visual identity.
canvas-design/SKILL.md | skill | Two-phase creative workflow: generate a visual design philosophy (`.md`), then express it as a canvas artifact (`.pdf`/`.png`) with mandatory craftsmanship refinement pass.
changelog-generator/SKILL.md | skill | Transforms raw git commit history into categorised, user-facing changelog entries by scanning commits, filtering internal noise, and translating developer language to customer language.
competitive-ads-extractor/SKILL.md | skill | Scrapes competitor ads from public ad libraries (Facebook, LinkedIn), captures screenshots, and synthesises patterns around problems highlighted, copy formulas, and creative formats.
connect/SKILL.md | skill | Enables Codex to take real actions in 1000+ external services (email, Slack, GitHub, Notion) via the Composio Tool Router MCP integration.
connect-apps/SKILL.md | skill | Installs and configures the Composio Tool Router plugin so Claude Code can execute actions in external apps with OAuth-based authentication.
content-research-writer/SKILL.md | skill | Structured writing-partnership workflow covering collaborative outlining, citation-backed research, hook improvement, section-by-section feedback, voice preservation, and final polish.
create-plan/SKILL.md | skill | Read-only planning procedure that produces a single scoped plan (intent paragraph + in/out scope + ordered action checklist) with at most two clarifying questions before proceeding.
developer-growth-analysis/SKILL.md | skill | Six-step procedure to read local Codex chat history, identify coding patterns and skill gaps, generate a prioritised growth report with curated HackerNews resources, and deliver it to Slack DMs.
domain-name-brainstormer/SKILL.md | skill | Generates creative domain name options for a project, checks availability across multiple TLDs, and provides branding rationale and pricing context.
email-draft-polish/SKILL.md | skill | Four-step email drafting procedure (outline → draft → variants → QA) producing subject line, greeting, body, and optional TL;DR for any goal, audience, or tone.
file-organizer/SKILL.md | skill | Multi-step file organisation procedure: analyse current structure, identify duplicates, propose a folder plan, seek approval, execute moves, and provide maintenance tips.
gh-address-comments/SKILL.md | skill | Three-step GitHub PR comment resolution: fetch all review threads via `fetch_comments.py`, present a numbered summary to the user, then implement selected fixes.
gh-fix-ci/SKILL.md | skill | Structured CI debugging workflow: verify `gh` auth, resolve the PR, fetch failing GitHub Actions logs via `inspect_pr_checks.py`, summarise failures, draft a fix plan (using `create-plan` skill), implement after approval, then recheck.
image-enhancer/SKILL.md | skill | Analyses image quality, upscales resolution, sharpens edges, and reduces compression artefacts while preserving the original file.
internal-comms/SKILL.md | skill | Routes internal communication requests (3P updates, newsletters, FAQs, incident reports, etc.) to the appropriate format-specific instruction file in `examples/`.
invoice-organizer/SKILL.md | skill | Reads invoices/receipts, extracts vendor/date/amount, renames files to a standard `YYYY-MM-DD Vendor - Invoice - Description.ext` pattern, organises into category folders, and produces a CSV summary.
langsmith-fetch/SKILL.md | skill | Debugging workflow for LangChain/LangGraph agents: fetch LangSmith execution traces, analyse tool call sequences, detect errors and performance bottlenecks, and export sessions for team sharing.
lead-research-assistant/SKILL.md | skill | Analyses a product/service, builds an ideal-customer profile, researches matching companies, scores and prioritises leads, and outputs contact strategies with personalised outreach angles.
linear/SKILL.md | skill | Four-step Linear issue management procedure (clarify scope → select workflow → execute MCP tool calls in batches → summarise gaps) covering sprint planning, bug triage, doc audits, and workload balancing.
mcp-builder/SKILL.md | skill | Four-phase MCP server development guide: deep research and agent-centric design, implementation, code quality review, and evaluation creation — with language-specific sub-guides for Python and TypeScript.
meeting-insights-analyzer/SKILL.md | skill | Analyses meeting transcripts for behavioural patterns (conflict avoidance, speaking ratios, filler words, active listening, facilitation style) and provides timestamped, evidence-based feedback with improvement recommendations.
meeting-notes-and-actions/SKILL.md | skill | Five-step meeting transcript processing procedure: normalise text, extract decisions and open questions, convert vague asks to concrete action items with owners/due dates, and optionally produce a Slack-ready blurb.
notion-knowledge-capture/SKILL.md | skill | Five-step procedure to convert conversations or notes into structured Notion pages (decisions, how-tos, FAQs, learning entries), including MCP setup fallback and cross-linking to hub pages.
notion-meeting-intelligence/SKILL.md | skill | Five-step meeting prep workflow: gather Notion context, select the right agenda template, build agenda/pre-read with owner timeboxes, enrich with Codex research, and finalise with change log.
notion-research-documentation/SKILL.md | skill | Five-step Notion research workflow: targeted search, source fetching with citation tracking, format selection (brief/summary/comparison/report), draft creation, and handoff with open questions.
notion-spec-to-implementation/SKILL.md | skill | Five-step spec-to-tasks procedure: locate and parse the spec, choose plan depth, create linked plan and tasks in Notion, link all artefacts, and track progress with milestone summaries.
raffle-winner-picker/SKILL.md | skill | Cryptographically random winner selection from Google Sheets, CSV, Excel, or plain lists, with duplicate prevention, optional weighting, and selection transparency (timestamp + method).
skill-creator/SKILL.md | skill | Meta-skill encoding the full skill creation process: six steps from understanding concrete examples → planning reusable resources → initialising → editing SKILL.md → packaging → iterating, with progressive-disclosure design principles.
skill-installer/SKILL.md | skill | Installs Codex skills from the curated openai/skills list or any GitHub repo path, with fallback from direct download to git sparse checkout and private repo support.
skill-share/SKILL.md | skill | Creates a skill (structured directory + SKILL.md), validates and packages it, then automatically posts the skill metadata to a designated Slack channel via Rube MCP.
slack-gif-creator/SKILL.md | skill | Toolkit for composing Slack-optimised animated GIFs using composable animation primitives (shake, bounce, spin, fade, etc.), with validators for message (2 MB) and emoji (64 KB) size constraints.
spreadsheet-formula-helper/SKILL.md | skill | Five-step spreadsheet formula procedure: restate problem with explicit ranges, draft formula preferring dynamic arrays, explain mechanics, handle edge cases with guardrails, and provide platform-specific variants.
support-ticket-triage/SKILL.md | skill | Standardised support ticket processing: parse context, categorise with priority justification, draft a response (empathy + restate + next steps), capture internal notes, and output a structured summary table.
tailored-resume-generator/SKILL.md | skill | Ten-step resume tailoring procedure: gather info, extract job requirements by priority tier, map candidate experience, structure resume sections, optimise for ATS keywords, format, and provide gap/strength analysis.
theme-factory/SKILL.md | skill | Applies one of ten pre-set visual themes (or a generated custom theme) to any artifact by presenting the theme showcase PDF, taking selection, reading the theme spec, then applying colours and fonts consistently.
video-downloader/SKILL.md | skill | Downloads YouTube videos via `yt-dlp` with configurable quality (best/1080p/720p/480p/360p/worst), format (mp4/webm/mkv), and audio-only (MP3) options.
webapp-testing/SKILL.md | skill | Decision-tree-driven Playwright testing procedure: choose static vs. dynamic path, optionally use `with_server.py` for server lifecycle, follow reconnaissance-then-action pattern to discover selectors before executing assertions.

---

## Reference / Example files — Procedural sub-documents loaded on demand

internal-comms/examples/3p-updates.md | sop | Full instructions for writing a 3P (Progress/Plans/Problems) team update: strict single-emoji + three-section format, 30–60 s read target, data-driven tone, and source-gathering guidance.
internal-comms/examples/company-newsletter.md | sop | Instructions for writing a company-wide newsletter: ~20–25 bullets grouped by domain cluster, link-heavy, "we" voice, prioritising leadership announcements and cross-team impact.
internal-comms/examples/faq-answers.md | sop | Instructions for surfacing and answering company-wide FAQs by mining Slack reactions, email, and docs, with a strict Q/A bullet format and guidelines on attribution and uncertainty.
internal-comms/examples/general-comms.md | sop | Generic internal communications procedure for non-standard formats: clarify audience/purpose/tone before writing, then apply clear-first, active-voice, most-important-first principles.
mcp-builder/reference/mcp_best_practices.md | rule | Canonical MCP development standards: server/tool naming conventions, response format selection (JSON vs Markdown), pagination contract, character-limit/truncation strategy, error message design, OAuth security, and testing requirements.
mcp-builder/reference/evaluation.md | sop | Evaluation creation procedure for MCP servers: inspect tools, explore data read-only, generate 10 realistic independent questions, verify answers, and output an XML `<evaluation>` file — with quality gates for stability and verifiability.
mcp-builder/reference/python_mcp_server.md | sop | Python/FastMCP implementation guide covering project structure, Pydantic v2 model patterns, `@mcp.tool` registration, async I/O, quality checklist, and safe testing approach.
mcp-builder/reference/node_mcp_server.md | sop | TypeScript MCP server guide covering project setup, Zod schema patterns, `server.registerTool` registration, strict-mode TypeScript, build process, and quality checklist.
notion-spec-to-implementation/reference/spec-parsing.md | sop | Structured procedure for extracting requirements, acceptance criteria, dependencies, risks, and scope from Notion specification documents (requirements-based, user-story, TDD, or PRD formats), including ambiguity and conflict resolution patterns.
