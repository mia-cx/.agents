---
name: audit-dependencies
description: >-
  Audits project dependencies across four classes — security (CVEs), cleanup
  (redundant deps, modern alternatives), speedup (heavy or slow packages),
  levelup (outdated packages) — and proposes fixes without applying them.
  Prefers the shallowest possible dependency graph, applying e18e.dev concepts.
  Use when the user asks to audit or check dependencies, or mentions outdated
  packages, vulnerabilities, CVEs, dependency bloat, install size, or upgrades.
---

# Audit Dependencies

Audit dependencies and **propose** fixes — never apply them. Every finding, in every class, becomes a proposal (finding + suggested fix + risk + effort); the user picks what to act on.

## Principles

- **Prefer the shallowest possible dependency graph.** Every dependency brings its own subtree; fewer, flatter deps beat convenience wrappers. Weigh each dep against platform built-ins and the runtime's standard library.
- Classify findings using [e18e.dev](https://e18e.dev/) classes:
  - **security** — vulnerabilities and CVEs.
  - ✨ **cleanup** — redundant dependencies; replace with platform built-ins or modern alternatives.
  - ⚡️ **speedup** — packages that are heavy to install, load, or run; transitive bloat.
  - 🧩 **levelup** — outdated packages; propose the modern alternative or upgrade path.

## Workflow

### 1. Detect package manager and ecosystem

```bash
ls pnpm-lock.yaml package-lock.json yarn.lock bun.lockb 2>/dev/null
```

| Lockfile | Manager | Audit | Outdated |
|---|---|---|---|
| `pnpm-lock.yaml` | pnpm | `pnpm audit` | `pnpm outdated` |
| `package-lock.json` | npm | `npm audit` | `npm outdated` |
| `yarn.lock` | yarn | `yarn audit` | `yarn outdated` |
| `bun.lockb` | bun | `bun audit` | `bun outdated` |

For non-JS ecosystems (`pyproject.toml`, `go.mod`, `Cargo.toml`), adapt commands; the classes and propose-only rule still apply.

### 2. Security

```bash
pnpm audit --json 2>/dev/null || pnpm audit
```

Per vulnerability: package, installed version, patched version, CVE, direct or transitive. Severity sets urgency: critical/high → before next release; moderate → near term; low → when convenient.

For transitive vulnerabilities, propose one of: bump the direct dep that pulls in the fix; a documented override (`pnpm.overrides`) linking the upstream issue; or a written risk acceptance when the vulnerable path is unreachable.

### 3. Cleanup

Find dependencies the project can shed:

```bash
npx knip                 # unused deps and exports
pnpm dedupe --check      # duplicate versions in the graph
pnpm why <package>       # who pulls in a suspect package
```

- Flag deps replaceable by platform built-ins (`fetch`, `structuredClone`, `node:` stdlib, `Intl`, native `Array`/`Object` methods) — the [module-replacements](https://github.com/es-tooling/module-replacements) list covers the common offenders.
- Flag single-use micro-deps and convenience wrappers whose job is a few lines of code.

### 4. Speedup

- Measure the graph: `pnpm ls --depth Infinity | wc -l` before/after view per proposal.
- Flag the heaviest subtrees (install size, dep count) — `npx howfat <package>` or [pkg-size.dev](https://pkg-size.dev) per suspect.
- Flag deps with lighter modern equivalents doing the same job.

### 5. Levelup

```bash
pnpm outdated --format json 2>/dev/null || pnpm outdated
```

| Bump | Example | Risk |
|---|---|---|
| Patch | `1.2.3` → `1.2.5` | Low — batchable |
| Minor | `1.2.3` → `1.4.0` | Low-medium — check changelog |
| Major | `1.2.3` → `2.0.0` | High — needs a migration plan |

Where a package is outdated *and* has a stronger modern successor, propose the successor instead of the version bump.

### 6. Propose

Present one summary, grouped by class, every item actionable:

```markdown
## Dependency Audit

### Security
| Severity | Package | Installed | Fix | CVE | Proposal |
|---|---|---|---|---|---|
| 🔴 Critical | lodash | 4.17.20 | 4.17.21 | CVE-2021-23337 | `pnpm update lodash` |

### ✨ Cleanup
| Package | Reason | Proposal | Graph impact |
|---|---|---|---|
| node-fetch | native `fetch` since Node 18 | remove, use global fetch | −12 transitive deps |

### ⚡️ Speedup
| Package | Weight | Proposal | Risk |
|---|---|---|---|
| moment | 4.2 MB, locale bloat | replace with `Intl` / date-fns | Medium — API differs |

### 🧩 Levelup
| Package | Current | Latest | Bump | Proposal |
|---|---|---|---|---|
| svelte | 4.2.0 | 5.55.0 | Major | migration plan (runes) — separate issue |

### Suggested order
1. Security patches (commands above, low risk)
2. Cleanup quick wins (largest graph reduction first)
3. Majors/levelups — one issue per package, coupled packages grouped
```

For approved majors, draft a `gh issue create` with: why, breaking changes, worktree setup, upgrade steps, and acceptance criteria (typecheck, lint, test pass; affected features verified).

## Rules

- **Propose, never apply.** All classes — security included. Execution starts only after the user picks proposals.
- **One proposal per concern.** Each major bump and each replacement carries its own risk; keep them separately acceptable.
- **Quantify graph impact.** Every cleanup/speedup proposal states the dependency-count or size delta.
- **Overrides are documented loans.** Any proposed override links the upstream issue and names its removal condition.
