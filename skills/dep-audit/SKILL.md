---
name: dep-audit
description: Audit and upgrade project dependencies — find vulnerabilities, outdated packages, and plan safe upgrade paths. Use when user wants to check deps, run an audit, update packages, mentions "outdated", "vulnerabilities", "CVEs", or "dependency upgrade".
---

# Dependency Audit & Upgrade

Audit dependencies for vulnerabilities and staleness, categorize by risk, and either fix them directly (for safe updates) or create an issue with a phased upgrade plan (for breaking changes).

## Workflow

### 1. Detect package manager and ecosystem

```bash
# Check which lockfile exists
ls pnpm-lock.yaml package-lock.json yarn.lock bun.lockb 2>/dev/null
```

| Lockfile | Manager | Audit command | Outdated command |
|---|---|---|---|
| `pnpm-lock.yaml` | pnpm | `pnpm audit` | `pnpm outdated` |
| `package-lock.json` | npm | `npm audit` | `npm outdated` |
| `yarn.lock` | yarn | `yarn audit` | `yarn outdated` |
| `bun.lockb` | bun | `bun audit` (if available) | `bun outdated` |

Also check for non-JS dependency files: `requirements.txt` / `pyproject.toml` (Python), `go.mod` (Go), `Cargo.toml` (Rust). Adapt commands accordingly.

### 2. Run vulnerability audit

```bash
pnpm audit --json 2>/dev/null || pnpm audit
```

Record:
- **Critical/High**: must fix before next release
- **Moderate**: fix in near term
- **Low**: fix when convenient

For each vulnerability, note: package name, installed version, patched version (if available), CVE ID, and whether it's a direct or transitive dependency.

### 3. Check for outdated packages

```bash
pnpm outdated --format json 2>/dev/null || pnpm outdated
```

Categorize each outdated package:

| Category | Definition | Risk | Action |
|---|---|---|---|
| **Patch** | `1.2.3` → `1.2.5` | Low | Safe to batch-update |
| **Minor** | `1.2.3` → `1.4.0` | Low-Medium | Usually safe, check changelog |
| **Major** | `1.2.3` → `2.0.0` | High | Breaking changes — needs a plan |

### 4. Present findings

Show the user a summary:

```markdown
## Dependency Audit Summary

### Vulnerabilities
| Severity | Package | Installed | Fix | CVE |
|---|---|---|---|---|
| 🔴 Critical | lodash | 4.17.20 | 4.17.21 | CVE-2021-23337 |
| 🟠 High | ... | ... | ... | ... |

### Outdated (N packages)
| Package | Current | Latest | Bump | Notes |
|---|---|---|---|---|
| svelte | 4.2.0 | 5.55.0 | Major | Breaking: Svelte 5 runes |
| vite | 5.4.0 | 7.3.1 | Major | Check migration guide |
| typescript | 5.3.0 | 5.9.3 | Minor | Safe |
| ... | ... | ... | Patch | Safe |

### Recommended actions
1. **Immediate**: fix N critical/high vulnerabilities (patch available)
2. **Batch update**: N patch/minor updates (low risk)
3. **Plan upgrade**: N major version bumps (needs worktree + migration)
```

### 5. Execute safe updates

For patches and minors with no known breaking changes, update directly:

```bash
# Fix known vulnerabilities with available patches
pnpm audit --fix

# Update all patch-level deps
pnpm update

# Or target specific safe updates
pnpm update <package1> <package2> ...
```

After updating:
```bash
pnpm install --frozen-lockfile  # verify lockfile is consistent
pnpm build                       # verify build passes
pnpm test                        # verify tests pass
```

If all green, commit:

```
chore(deps): patch and minor dependency updates

Updated N packages to latest patch/minor versions.
No breaking changes. Build and tests pass.

<list the notable updates>
```

### 6. Plan major upgrades

For major version bumps, **do not update directly**. Instead, create a GitHub issue with a phased plan:

```bash
gh issue create --title "chore(deps): upgrade <package> to vN" --body "$(cat <<'EOF'
## Dependency Upgrade: <package> vCurrent → vNext

### Why
<current version is outdated / has vulnerability / blocks other upgrades>

### Breaking changes
<summarize from the package's migration guide or changelog>

### Worktree Setup

```bash
git worktree add .worktrees/upgrade-<package> -b chore/upgrade-<package>
cd .worktrees/upgrade-<package>
```

### Upgrade steps

1. Update the package: `pnpm update <package>@latest`
2. Fix type errors and breaking API changes
3. Update related packages if needed (peer deps)
4. Run full test suite
5. Manual smoke test of affected features
6. Update any code that uses deprecated APIs

### Acceptance criteria

- [ ] `pnpm build` passes
- [ ] `pnpm test` passes
- [ ] No type errors
- [ ] Affected features manually verified
EOF
)"
```

If multiple major upgrades are independent, create one issue per package. If they're coupled (e.g., `svelte` + `@sveltejs/kit`), group them into one issue.

### 7. Handle transitive vulnerabilities

Sometimes a vulnerability is in a transitive dependency that the direct dependency hasn't patched yet. Options:

1. **Check if the direct dep has a newer version** that pulls in the fix
2. **Use `pnpm.overrides`** in `package.json` to force the patched version:
   ```json
   {
     "pnpm": {
       "overrides": {
         "vulnerable-package": ">=1.2.3"
       }
     }
   }
   ```
3. **File an issue on the direct dependency's repo** if no fix exists
4. **Assess actual risk** — if the vulnerable code path isn't reachable from your app, document it and move on

## Rules

- **Never blindly update all majors at once.** Each major bump is a separate concern with its own risk profile.
- **Always verify after updates.** `build` + `test` minimum. If the project has a `typecheck` or `lint` script, run those too.
- **Commit safe updates immediately.** Don't let patch/minor updates sit in a branch — they're low risk and high value.
- **Major upgrades get worktrees.** They can break things in non-obvious ways. Isolate them.
- **Document overrides.** If you use `pnpm.overrides`, add a comment in `package.json` explaining why and linking the upstream issue. Remove the override once the direct dep is patched.
