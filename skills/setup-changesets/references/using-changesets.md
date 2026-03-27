## Using Changesets in a Worktree

Changesets work naturally in worktrees — they're just markdown files in `.changeset/`. When working in a worktree:

```bash
cd .worktrees/my-feature
pnpm changeset
# select packages, bump type, write summary
git add .changeset/
git commit -m "chore: add changeset for feature X"
```

The changeset file merges back to `main` with your PR. The release workflow collects it from there.

### Writing a changeset non-interactively

If you want to skip the interactive prompt (useful in scripts or agent workflows), create the file directly:

```bash
cat > .changeset/my-feature.md << 'EOF'
---
"my-package": minor
---

Add feature X that does Y. Users can now Z by calling `newMethod()`.
EOF
```

For single-package repos, use the package name from `package.json`. For apps, this is whatever `name` is set to.
