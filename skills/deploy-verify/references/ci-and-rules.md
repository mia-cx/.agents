## Integration with CI

This can also run as a post-deploy step in the GitHub Actions deploy workflow. Add after the Wrangler deploy step:

```yaml
      - name: Smoke test
        run: |
          pip install playwright && playwright install chromium
          python3 scripts/verify-deploy.py "${{ steps.deploy.outputs.deployment-url }}"
```

This requires the deploy step to have `id: deploy` and the `deployment-url` output (provided by `cloudflare/wrangler-action@v3`).

## Rules

- **Always wait for `networkidle`** — SPAs need time to hydrate
- **Screenshot every route** — visual evidence is worth more than status codes
- **Console errors are warnings, not failures** — some are benign (third-party scripts, expected 404s). Flag them but let the user decide severity.
- **Don't modify anything** — this is read-only verification. No writes, no mutations, no form submissions unless explicitly asked.
- **Timeout generously** — production cold starts (especially Cloudflare Workers) can take a few seconds. Use 15s timeouts.
