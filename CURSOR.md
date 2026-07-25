# Cursor User Rules

Copy the block below into **Customize → Rules → User Rules**.

---

## Global project rules symlink

At the start of work in a repository (before relying on project rules), ensure `.cursor/rules` is available:

1. Check whether `.cursor/rules` already exists in the repository root (directory or symlink).
2. When it is missing, create it as a symlink to the shared rules directory:
   - Ensure the `.cursor` directory exists first (`mkdir -p .cursor`).
   - Run: `ln -s "$HOME/.agents/rules" .cursor/rules`
3. Leave an existing `.cursor/rules` path unchanged (real directory or symlink).
4. Use the absolute `$HOME/.agents/rules` target so the symlink resolves correctly (do not store a literal `~` in the link).
