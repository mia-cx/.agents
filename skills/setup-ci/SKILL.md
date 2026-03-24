---
name: setup-ci
description: Set up GitHub Actions CI/CD workflows with pnpm, smart caching, and Cloudflare Pages deployment via Wrangler. Use when user wants to add CI, set up GitHub Actions, configure deployment pipelines, or automate lint/test/build/deploy on PRs and merges.
---

# Setup CI/CD

Scaffold `.github/workflows/` with two workflows:

1. **CI** (runs on PRs): lint, typecheck, test, build verification
2. **Deploy** (runs on push to main): build + deploy to Cloudflare Pages via Wrangler

Both share a pnpm caching strategy that preserves symlinks.

## pnpm Caching Strategy

pnpm hardlinks/symlinks `node_modules` entries to its content-addressable store. If you cache `node_modules` without the store, symlinks break. The fix:

1. **Configure `store-dir` inside the repo** via `.npmrc` so the store lives at `node_modules/.pnpm-store`
2. **Cache `node_modules` as a whole** — since the store is nested inside, symlinks remain valid
3. **Key on `pnpm-lock.yaml` hash** — cache busts on any dependency change
4. On cache hit, `pnpm install` validates in ~1-2s instead of re-downloading

## Workflow

### 1. Detect project shape

Before generating workflows, inspect the repo:

- [ ] Check `package.json` for existing scripts: `lint`, `typecheck`/`check`, `test`, `build`
- [ ] Check for `wrangler.toml` or `wrangler.jsonc` (Cloudflare deployment)
- [ ] Check for `svelte.config.js` (SvelteKit) or framework markers
- [ ] Check Node version in `.nvmrc`, `.node-version`, `package.json engines`, or default to `22`
- [ ] Check if `.npmrc` exists and already has `store-dir`

### 2. Configure pnpm store-dir

If `.npmrc` doesn't already set `store-dir`, append it:

```
store-dir=node_modules/.pnpm-store
```

This ensures the pnpm store lives inside `node_modules`, so caching `node_modules` captures everything and symlinks survive restoration.

Also add `node_modules/.pnpm-store` to `.gitignore` if `node_modules` isn't already ignored (it usually is).

### 3. Generate CI workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
    branches: [main]

concurrency:
  group: ci-${{ github.head_ref }}
  cancel-in-progress: true

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version-file: ".nvmrc"  # or hardcode version if no .nvmrc

      - name: Cache node_modules (includes pnpm store)
        uses: actions/cache@v4
        id: cache-node-modules
        with:
          path: node_modules
          key: node-modules-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}

      - name: Install dependencies
        if: steps.cache-node-modules.outputs.cache-hit != 'true'
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Typecheck
        run: pnpm check  # or pnpm typecheck — match the actual script name

      - name: Test
        run: pnpm test

      - name: Build
        run: pnpm build
```

**Adapt the steps:**
- Remove `Lint` if no `lint` script exists
- Rename `pnpm check` to whatever the project uses (`typecheck`, `svelte-check`, etc.)
- Remove `Test` if no `test` script exists
- If `.nvmrc` doesn't exist, use `node-version: "22"` instead of `node-version-file`

### 4. Generate Deploy workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

concurrency:
  group: deploy-production
  cancel-in-progress: false  # don't cancel in-flight deploys

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version-file: ".nvmrc"

      - name: Cache node_modules (includes pnpm store)
        uses: actions/cache@v4
        id: cache-node-modules
        with:
          path: node_modules
          key: node-modules-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}

      - name: Install dependencies
        if: steps.cache-node-modules.outputs.cache-hit != 'true'
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy .svelte-kit/cloudflare --project-name=${{ github.event.repository.name }}
          packageManager: pnpm
```

**Adapt:**
- Change `pages deploy` path to match the project's build output (`build/`, `dist/`, `.svelte-kit/cloudflare`, etc.)
- Change `--project-name` to the actual Cloudflare Pages project name if different from the repo name
- If deploying Workers instead of Pages, change command to `deploy`
- If no Wrangler config exists, skip this workflow and tell the user

### 5. Remind about secrets

Tell the user to add these GitHub repo secrets (Settings → Secrets and variables → Actions):

- `CLOUDFLARE_API_TOKEN` — Create at https://dash.cloudflare.com/profile/api-tokens with "Cloudflare Pages: Edit" permission
- `CLOUDFLARE_ACCOUNT_ID` — Found on the Cloudflare dashboard overview page

### 6. Commit

Stage all generated/modified files and commit:

```
chore(ci): add GitHub Actions CI/CD workflows

CI on PRs: lint, typecheck, test, build verification.
Deploy on merge to main: build + Cloudflare Pages via Wrangler.

pnpm store-dir set to node_modules/.pnpm-store so the
content-addressable store lives inside node_modules — caching
node_modules as a unit preserves all symlinks.
```

## Caching Details

### Why cache `node_modules` and not just the pnpm store?

| Approach | Cache restore | Then what | Total |
|---|---|---|---|
| Cache store only | ~3s | `pnpm install` recreates symlinks (~10-30s) | ~15-35s |
| Cache `node_modules` (store inside) | ~5s | `pnpm install` validates only (~1-2s) | ~6-8s |

The second approach is 3-5x faster because symlinks are already in place. The tradeoff is a slightly larger cache blob, but GitHub gives 10 GB per repo.

### Cache key strategy

```
key: node-modules-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}
```

- **Busts on any dependency change** (lockfile hash changes)
- **OS-specific** (Linux binaries won't help macOS runners)
- **No restore-keys fallback** — stale `node_modules` with a fresh lockfile causes more problems than a clean install. Better to miss the cache entirely.

### What about `pnpm install` on cache hit?

You might notice the workflows skip `pnpm install` entirely on cache hit (`if: steps.cache-node-modules.outputs.cache-hit != 'true'`). This is safe because:

- The cache key includes the lockfile hash — if deps changed, the key misses
- If the key hits, `node_modules` is byte-identical to what was cached
- Skipping install saves 1-2s of validation overhead

If this feels too aggressive, replace the `if` condition and always run `pnpm install --frozen-lockfile` — it'll be fast on cache hit either way.

## Notes

- `concurrency` groups prevent parallel runs on the same PR (CI) and prevent deploy races (deploy)
- CI uses `cancel-in-progress: true` to kill stale PR checks; deploy uses `false` to avoid aborting mid-deploy
- `--frozen-lockfile` ensures CI never silently modifies the lockfile
- The `pnpm/action-setup@v4` action reads the `packageManager` field from `package.json` to determine the pnpm version — make sure it's set (e.g., `"packageManager": "pnpm@10.x.x"`)
