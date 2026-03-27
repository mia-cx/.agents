# Setup Changesets

Install and configure [@changesets/cli](https://github.com/changesets/changesets) with GitHub Actions automation. Changesets capture release intent at PR time — what to release, at what semver bump, with what changelog entry — then batch them into a versioning PR.

## Why changesets

Each PR that changes user-facing behavior gets a changeset file (`.changeset/<id>.md`) committed alongside the code. When merged, a GitHub Action collects all pending changesets into a "Version Packages" PR that bumps versions, writes CHANGELOG.md, and deletes the consumed changesets. Merge that PR to release.

This means:
- Contributors describe their changes at PR time, not release time
- Changelogs are human-written, not auto-generated from commit messages
- Releases are explicit — merging the version PR is the release trigger
- Works in worktrees: `.changeset/` is just files in the repo

## Workflow

### 1. Detect project shape

- [ ] Check if this is a monorepo (`pnpm-workspace.yaml`, `workspaces` in `package.json`) or single-package
- [ ] Check `package.json` for `name`, `version`, `private` fields
- [ ] Check if `.changeset/` already exists
- [ ] Check if the repo uses Cloudflare (has `wrangler.toml` or `wrangler.jsonc`)
- [ ] Note the `baseBranch` (usually `main`)

### 2. Install changesets

```bash
pnpm add -D @changesets/cli
```

For GitHub-linked changelogs (includes PR links and contributor attribution):

```bash
pnpm add -D @changesets/changelog-github
```

### 3. Initialize

```bash
pnpm changeset init
```

This creates `.changeset/config.json` and `.changeset/README.md`.

### 4. Configure `.changeset/config.json`

**Single-package repo (private app, not published to npm):**

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.1.1/schema.json",
  "changelog": ["@changesets/changelog-github", { "repo": "<owner>/<repo>" }],
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": [],
  "privatePackages": {
    "version": true,
    "tag": true
  }
}
```

Key settings for apps:
- `privatePackages.version: true` — bump version even though `private: true`
- `privatePackages.tag: true` — create git tags (useful for deploy triggers and release notes)
- `changelog-github` — adds PR links and contributor mentions to CHANGELOG.md

**Monorepo (multiple packages):**

Same as above but configure `fixed` or `linked` arrays if packages should share versions. Set `access: "public"` if publishing to npm.

### 5. Ensure `package.json` has required fields

For apps that don't publish to npm, make sure `package.json` has at least:

```json
{
  "name": "my-project",
  "private": true,
  "version": "0.0.0"
}
```

The `version` field is what changesets bumps. If it's missing, add it at `"0.0.0"`.

### 6. Create the release GitHub Action

Create `.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
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

      - name: Create Release Pull Request
        uses: changesets/action@v1
        with:
          title: "chore: version packages"
          commit: "chore: version packages"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

> **Note on caching:** This assumes `store-dir=node_modules/.pnpm-store` is set in `.npmrc` (see the `setup-ci` skill). If not, add it.

**If also deploying to Cloudflare on release**, add a deploy step that runs after the version PR is merged (when there are no pending changesets):

```yaml
      - name: Build and deploy
        if: steps.changesets.outputs.hasChangesets == 'false'
        run: |
          pnpm build
          pnpm exec wrangler pages deploy .svelte-kit/cloudflare --project-name=${{ github.event.repository.name }}
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

And give the changesets step an `id`:

```yaml
      - name: Create Release Pull Request
        id: changesets
        uses: changesets/action@v1
```

### 7. Optionally add changeset status check to CI

Add to your CI workflow (`.github/workflows/ci.yml`) to remind contributors when a changeset is missing:

```yaml
      - name: Check for changeset
        run: pnpm changeset status --since=origin/main
```

This will **fail the build** if no changeset is present. If you prefer a non-blocking reminder, install the [changeset bot](https://github.com/apps/changeset-bot) instead.

### 8. Commit

Stage all generated/modified files and commit:

```
chore: setup changesets for versioning and changelog automation

Adds @changesets/cli with GitHub-linked changelogs, a release
workflow that creates versioning PRs, and changeset status check
in CI.
```
