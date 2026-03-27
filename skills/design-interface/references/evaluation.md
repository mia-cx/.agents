## Evaluation Criteria

From "A Philosophy of Software Design":

**Interface simplicity**: Fewer methods, simpler params = easier to learn and use correctly.

**General-purpose**: Can handle future use cases without changes. But beware over-generalization.

**Implementation efficiency**: Does interface shape allow efficient implementation? Or force awkward internals?

**Depth**: Small interface hiding significant complexity = deep module (good). Large interface with thin implementation = shallow module (avoid).

## Moving to Implementation

If the user decides to implement the chosen design, recommend creating a worktree first:

```bash
git worktree add .worktrees/<module-name> -b refactor/<module-name>
cd .worktrees/<module-name>
```

Interface redesigns often touch many call sites. A worktree keeps `main` stable while the new interface is wired up.

## Anti-Patterns

- Don't let sub-agents produce similar designs - enforce radical difference
- Don't skip comparison - the value is in contrast
- Don't implement - this is purely about interface shape
- Don't evaluate based on implementation effort
