## Rules

- **Never blindly update all majors at once.** Each major bump is a separate concern with its own risk profile.
- **Always verify after updates.** `build` + `test` minimum. If the project has a `typecheck` or `lint` script, run those too.
- **Commit safe updates immediately.** Don't let patch/minor updates sit in a branch — they're low risk and high value.
- **Major upgrades get worktrees.** They can break things in non-obvious ways. Isolate them.
- **Document overrides.** If you use `pnpm.overrides`, add a comment in `package.json` explaining why and linking the upstream issue. Remove the override once the direct dep is patched.
