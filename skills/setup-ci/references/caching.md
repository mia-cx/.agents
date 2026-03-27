## Caching Details

### Why cache `node_modules` and not just the pnpm store?

| Approach | Cache restore | Then what | Total |
|---|---|---|---|
| Cache store only | ~3s | `pnpm install` recreates symlinks (~10-30s) | ~15-35s |
| Cache `node_modules` (store inside) | ~5s | `pnpm install` validates only (~1-2s) | ~6-8s |

The second approach is 3-5x faster because symlinks are already in place. The tradeoff is a slightly larger cache blob, but GitHub gives 10 GB per repo.

### Cache key strategy

```
key: node-modules-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}
```

- **Busts on any dependency change** (lockfile hash changes)
- **OS-specific** (Linux binaries won't help macOS runners)
- **No restore-keys fallback** — stale `node_modules` with a fresh lockfile causes more problems than a clean install. Better to miss the cache entirely.

### What about `pnpm install` on cache hit?

You might notice the workflows skip `pnpm install` entirely on cache hit (`if: steps.cache-node-modules.outputs.cache-hit != 'true'`). This is safe because:

- The cache key includes the lockfile hash — if deps changed, the key misses
- If the key hits, `node_modules` is byte-identical to what was cached
- Skipping install saves 1-2s of validation overhead

If this feels too aggressive, replace the `if` condition and always run `pnpm install --frozen-lockfile` — it'll be fast on cache hit either way.

## Notes

- `concurrency` groups prevent parallel runs on the same PR (CI) and prevent deploy races (deploy)
- CI uses `cancel-in-progress: true` to kill stale PR checks; deploy uses `false` to avoid aborting mid-deploy
- `--frozen-lockfile` ensures CI never silently modifies the lockfile
- The `pnpm/action-setup@v4` action reads the `packageManager` field from `package.json` to determine the pnpm version — make sure it's set (e.g., `"packageManager": "pnpm@10.x.x"`)
