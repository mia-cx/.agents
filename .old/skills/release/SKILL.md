---
name: release
description: Create a release by running changeset version, reviewing the version PR, writing release notes, and publishing a GitHub release. Also handles manual releases when changesets aren't set up — aggregates conventional commits into a changelog entry and tags a release. Use when user says "release", "cut a release", "publish", "changelog", or "release notes".
---

# Release

Create a release — either through the changesets workflow or manually from conventional commits.

## Detect release strategy

Check which strategy this repo uses:

1. **Changesets** — `.changeset/config.json` exists → use the [Changesets Release](#changesets-release) flow
2. **Conventional commits** — no changesets setup → use the [Manual Release](#manual-release) flow

---

## Changesets Release

When changesets are set up, the release workflow is mostly automated. This skill handles the human-in-the-loop parts.

### 1. Check for pending changesets

```bash
pnpm changeset status
```

If no changesets are pending, there's nothing to release. Tell the user.

### 2. Run version

If the GitHub Action hasn't already created a version PR (or the user wants to do it locally):

```bash
pnpm changeset version
```

This:
- Bumps `version` in `package.json` (and workspace packages)
- Writes entries to `CHANGELOG.md`
- Deletes consumed `.changeset/*.md` files

### 3. Review the changes

Show the user:
- The new version number
- The generated CHANGELOG.md entries
- Which packages were bumped (in monorepos)

Ask: "Does this look right? Any edits to the changelog before we commit?"

Let the user edit CHANGELOG.md if they want to polish the wording.

### 4. Commit, tag, and push

```bash
git add .
git commit -m "chore: version packages"
git push
git push --follow-tags
```

The `changeset version` command creates git tags automatically. `--follow-tags` pushes them.

### 5. Create GitHub Release

```bash
# Get the latest tag
TAG=$(git describe --tags --abbrev=0)
VERSION=${TAG#v}

# Extract this version's changelog section
# (everything between the version heading and the next version heading)
NOTES=$(awk "/^## $VERSION|^## ${TAG}/{found=1; next} /^## /{found=0} found" CHANGELOG.md)

gh release create "$TAG" \
  --title "$TAG" \
  --notes "$NOTES" \
  --verify-tag
```

If the changelog section is empty or missing, compose release notes from the changesets that were consumed (they're in the git diff of the version commit).

---

## Manual Release

When changesets aren't set up, build release notes from conventional commit history.

### 1. Find the last release

```bash
# Latest tag
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null)

# If no tags exist, use the first commit
if [ -z "$LAST_TAG" ]; then
  LAST_TAG=$(git rev-list --max-parents=0 HEAD)
fi
echo "Last release: $LAST_TAG"
```

### 2. Collect commits since last release

```bash
git log "$LAST_TAG"..HEAD --oneline --no-merges
```

### 3. Determine the next version

Parse the commits to determine the semver bump:

| Commit type | Bump |
|---|---|
| Any `feat` commit | minor |
| Any `fix` commit (no `feat`) | patch |
| Any commit with `BREAKING CHANGE` in body or `!` after type | major |
| Only `chore`, `docs`, `style`, `test`, `refactor` | patch (or skip — ask user) |

Read the current version from `package.json` (or the latest tag) and compute the next version.

Ask the user: "Next version will be `X.Y.Z` (minor bump due to N new features). Proceed?"

### 4. Generate changelog entry

Group commits by type and format:

```markdown
## X.Y.Z (YYYY-MM-DD)

### Features

- **scope**: description (#PR or commit hash)
- **scope**: description

### Bug Fixes

- **scope**: description

### Other Changes

- **scope**: description
```

Rules:
- Parse conventional commit subjects: `type(scope): description`
- Link to PRs if the commit body contains `(#N)` or was merged via a PR
- Skip merge commits
- List breaking changes prominently at the top with a ⚠️ marker
- If a commit references `Fixes #N` or `Closes #N`, link the issue

### 5. Write CHANGELOG.md

If `CHANGELOG.md` exists, prepend the new entry after the title line. If it doesn't exist, create it:

```markdown
# Changelog

## X.Y.Z (YYYY-MM-DD)

### Features
...
```

Show the entry to the user for review. Let them edit.

### 6. Bump version, commit, tag, push

```bash
# Bump version in package.json
npm version X.Y.Z --no-git-tag-version

# Commit
git add CHANGELOG.md package.json
git commit -m "chore: release vX.Y.Z"

# Tag
git tag -a "vX.Y.Z" -m "Release vX.Y.Z"

# Push
git push
git push --follow-tags
```

### 7. Create GitHub Release

```bash
gh release create "vX.Y.Z" \
  --title "vX.Y.Z" \
  --notes-file /tmp/release-notes.md \
  --verify-tag
```

Write the changelog entry to a temp file for `--notes-file`, or pass it inline with `--notes`.

---

## Worktree Note

Releases should be cut from `main`, not from a worktree. If you're in a worktree, switch back:

```bash
cd "$(git worktree list | grep 'main\|bare' | head -1 | awk '{print $1}')"
git pull
```

Then run the release from there.

## Checklist

- [ ] Pending changesets consumed (or commits aggregated)
- [ ] Version bumped in `package.json`
- [ ] `CHANGELOG.md` updated with new entry
- [ ] Changes committed and pushed
- [ ] Git tag created and pushed (`git push --follow-tags`)
- [ ] GitHub Release created with release notes
