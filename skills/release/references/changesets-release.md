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
