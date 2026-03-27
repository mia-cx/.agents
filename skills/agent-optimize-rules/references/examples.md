## Example Cleanups

**Coding convention → Delete**

```markdown
# Svelte Patterns

- Use const arrow functions, not function declarations
- Prefer reactive declarations ($derived)
```

↳ Discoverable from code and linting config.

---

**Comprehensive skill → Focused reference**

```markdown
Before: 9 sections (History, Concepts, Setup, Writing, Testing, Deployment, Troubleshooting, Tuning, Rollbacks)

After:

# Drizzle Migration Workflow

1. Update schema in src/schema.ts
2. Run `drizzle-kit generate:pg`
3. Review generated SQL
4. Run `drizzle-kit migrate:pg`

**Gotcha**: Don't manually edit migrations. Always regenerate from schema.
```

↳ Move detailed sections to external docs.

---

**Missing "why" → Add constraint**

```markdown
Before: Use openpyxl for Excel, not xlrd.

After: Use openpyxl for Excel, not xlrd. Reason: xlrd only supports .xls (legacy); doesn't support .xlsx.
```

---

**Mixed tribal + inferrable → Keep tribal only**

```markdown
Before:

# Authentication

- Use WorkOS for user management
- Store session tokens in cookies
- Set HttpOnly flag on cookies
- Implement refresh token rotation
- Use RSA for signing tokens

After:

# WorkOS + Cloudflare Workers

WorkOS SDK doesn't run in Workers. Use custom REST API instead. See apps/shared/auth/workos-rest.ts for endpoints and request format. (Token storage, signing, rotation are discoverable from code/tests.)
```

---

## Workflow

1. Read the rule/skill
2. Ask: **Is this tribal?** (Discoverable from code/tests/external docs?) → If no, delete or move
3. Ask: **Is this focused?** (< limit?) → If no, extract to external docs
4. Ask: **Does it explain why?** (Constraint, gotcha, non-obvious choice?) → If no, add it
5. Apply refactoring patterns: Vague→Specific, Negative→Positive, Imprecise→Precise
6. Commit
