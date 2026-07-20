---
name: audit-dependencies
description: >-
  Audits project dependencies — security (CVEs) plus the e18e.dev classes:
  cleanup (dependency-tree debt), speedup (runtime performance), levelup
  (modern lean alternatives). Applies safe security fixes directly; proposes
  everything else without applying. Use when the user asks to audit or check
  dependencies, or mentions outdated packages, vulnerabilities, CVEs,
  dependency bloat, install size, or upgrades.
---

# Audit Dependencies

Audit dependencies and **propose** fixes. The one exception: security findings with a safe update path are applied on the spot. Every other finding becomes a proposal (finding + suggested fix + risk + effort); the user picks what to act on.

## Classes

**Security** (generic, not e18e): vulnerabilities and CVEs, covered by the ecosystem's audit commands.

The [e18e.dev](https://e18e.dev/) classes:

- ✨ **Cleanup** — debt in the dependency tree: packages that are redundant, bloated, unused, or no longer maintained. Prefer the shallowest possible graph — fix by removing, or migrating to lighter/faster alternatives and platform built-ins.
- ⚡️ **Speedup** — runtime performance of the packages and code in use: lint-detectable patterns (barrel files, redundant re-exports) and slow hot-path idioms. Profile before proposing.
- 🧩 **Levelup** — adopting modern, lean, focused alternatives to heavyweight established tools (the esbuild-vs-webpack archetype; see [tinylibs](https://github.com/tinylibs), [unjs](https://github.com/unjs), [es-tooling](https://github.com/es-tooling)).

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

**Safe fixes are applied directly**: a patched version exists within the same major (patch/minor bump). Update, then verify with typecheck + test before committing. Fixes that require a major bump or API changes become proposals like everything else.

For transitive vulnerabilities, propose one of: bump the direct dep that pulls in the fix; a documented override (`pnpm.overrides`) linking the upstream issue; or a written risk acceptance when the vulnerable path is unreachable.

### 3. ✨ Cleanup

Discover the state of the tree, then flag debt:

```bash
npx knip                 # unused deps and exports
pnpm dedupe --check      # duplicate versions in the graph
pnpm why <package>       # who pulls in a suspect package
pnpm outdated            # stale direct deps
```

- Visualize suspects with [npmgraph](https://npmgraph.js.org/) (tree complexity) and [pkg-size.dev](https://pkg-size.dev) (install size).
- Flag deps pulling in large subtrees not used elsewhere — with e18e's caveat: some depth exists for good reasons (older Node support, shared modules); check before proposing removal.
- Flag duplicated functionality: multiple versions of one package, or separate packages doing the same job (e.g. `glob` + `fast-glob`) — propose standardizing on the better one.
- Flag redundant deps replaceable by platform built-ins (`fetch`, `structuredClone`, `node:` stdlib, `Intl`) — the [module-replacements](https://github.com/e18e/module-replacements) list covers the common offenders.
- Flag unmaintained packages (no releases/commits in years) and single-use micro-deps whose job is a few lines of code.
- For outdated packages: patch/minor bumps are batchable low-risk proposals; majors get a per-package migration plan (never batched — each carries its own breaking changes).

### 4. ⚡️ Speedup

- Propose lint rules that catch perf debt: [eslint-plugin-depend](https://github.com/es-tooling/eslint-plugin-depend) (redundant packages with faster replacements), [eslint-plugin-barrel-files](https://github.com/thepassle/eslint-plugin-barrel-files) — or Biome's `noBarrelFile`/`noReExportAll`, oxlint's `no-barrel-file`.
- Flag barrel files and re-export-all patterns in the project's own source (import cost, cold-start time).
- Flag slow hot-path idioms flagged by e18e: generators in hot code paths, long array-method chains creating intermediates.
- Base every speedup proposal on a measurement (profile, benchmark, or import-time trace) — not vibes.

### 5. 🧩 Levelup

- Where an established heavyweight dep is in use, check for a modern lean alternative that covers the project's actual usage (most projects use a fraction of the API surface).
- Where a package is outdated *and* has a stronger modern successor, propose the successor instead of the version bump.
- State what's lost in the trade (customizability, ecosystem plugins) alongside what's gained (size, speed, fewer transitive deps).

### 6. Propose

Present one summary, grouped by class, every item actionable:

```markdown
## Dependency Audit

### Security
| Severity | Package | Installed | Fix | CVE | Status |
|---|---|---|---|---|---|
| 🔴 Critical | lodash | 4.17.20 | 4.17.21 | CVE-2021-23337 | ✅ applied, tests pass |
| 🟠 High | old-lib | 2.1.0 | 3.0.1 | CVE-2025-1234 | proposal — fix needs major bump |

### ✨ Cleanup
| Package | Reason | Proposal | Graph impact |
|---|---|---|---|
| node-fetch | native `fetch` since Node 18 | remove, use global fetch | −12 transitive deps |
| svelte 4.2.0 | major behind (5.55.0) | migration plan (runes) — separate issue | — |

### ⚡️ Speedup
| Finding | Evidence | Proposal |
|---|---|---|
| barrel file `src/index.ts` re-exports 40 modules | +180ms import time | split imports; adopt `noBarrelFile` rule |

### 🧩 Levelup
| Package | Alternative | Gained | Lost |
|---|---|---|---|
| webpack | vite/esbuild | 10× faster builds, −200 deps | custom loader X needs replacement |

### Suggested order
1. Remaining security items (fixes that need a major bump — safe ones are already applied)
2. Cleanup quick wins (largest graph reduction first)
3. Majors and levelups — one issue per package, coupled packages grouped
```

For approved majors and levelups, draft a `gh issue create` with: why, breaking changes, worktree setup, upgrade steps, and acceptance criteria (typecheck, lint, test pass; affected features verified).

## Rules

- **Apply safe security fixes; propose everything else.** Safe = patched version within the same major, typecheck + test green after. All cleanup, speedup, and levelup work starts only after the user picks proposals.
- **One proposal per concern.** Each major bump and each replacement carries its own risk; keep them separately acceptable.
- **Quantify graph impact.** Every cleanup/levelup proposal states the dependency-count or size delta; every speedup proposal cites a measurement.
- **Overrides are documented loans.** Any proposed override links the upstream issue and names its removal condition.
