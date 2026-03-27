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
