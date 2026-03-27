---
name: audit-security
description: "Runs a whole-codebase security review covering secrets exposure, trust boundaries, config risks, OWASP-style findings, and dependency issues. Use when the user asks for a security audit, hardening review, pen test, vulnerability scan, or broad risk assessment across the repository. Not for a single PR review or dependency-only audits."
---

# Security Audit

Treat this file as a router. Run the mechanical scans first, then load the reporting/orchestration guidance for the full-codebase review.

## Workflow

1. Read `references/automated-scans.md`.
   - It covers subagent setup, secrets scans, config review, dependency summary, and attack-surface mapping.
2. Then read `references/reporting.md` for:
   - spawning the Security Reviewer correctly
   - presenting findings
   - optional issue creation
   - timing/rules for full audits
3. Keep the dependency portion delegated to `audit-deps` when a deeper package-upgrade plan is needed.

## Rules

- Do not spend agent context on checks that grep or package managers can do first.
- Keep this skill focused on assessment and reporting, not direct remediation.
- Maintain clear separation between code/config findings and dependency-upgrade work.
