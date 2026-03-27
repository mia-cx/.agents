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
