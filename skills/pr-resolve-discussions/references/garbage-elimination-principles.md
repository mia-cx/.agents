## Garbage Elimination Principles

These apply to every fix you make, and should inform how you evaluate findings:

1. **Lies in the type system are bugs.** If a function returns `string` but can return `undefined`, that's not a style issue — every caller is making decisions based on a lie. Fix the type and fix the callers.

2. **Swallowed errors are time bombs.** `catch {}`, `catch { /* ignore */ }`, `try { ... } catch { return null }` — these hide failures that will surface later as mysterious data corruption. Make errors loud or handle them explicitly.

3. **`any` is contagious.** One `any` in a call chain disables type checking for everything downstream. Replace with the actual type, a generic, or at minimum `unknown` with a type guard.

4. **Dead code is misleading context.** Unreachable branches, commented-out blocks, unused imports, and vestigial functions mislead both humans and LLMs reading the code. Delete them.

5. **Implicit contracts become wrong contracts.** If two modules communicate via convention ("the first element is always the ID"), make it explicit via types, named fields, or validated schemas. Conventions drift; types don't.

6. **Copy-paste is a bug factory.** If the fix for a review comment is "add the same guard that exists in three other places," the real fix is to extract the shared logic. DRY isn't about line count — it's about having one source of truth for a behavior.

7. **Placeholder code in main is tech debt with interest.** `// TODO`, `// HACK`, `// FIXME`, `throw new Error("not implemented")` — if it's merged, it's production code. Either implement it or remove the dead path.
