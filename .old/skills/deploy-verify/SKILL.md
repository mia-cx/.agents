---
name: deploy-verify
description: Verify a production deployment by checking HTTP status codes, page content, console errors, and capturing screenshots. Use after deploying, when user says "verify deploy", "smoke test", "check production", or wants to confirm a deployment is healthy.
---

# Verify Deploy

Lightweight post-deployment smoke test. Hit the production URL, verify key routes, check for errors, capture screenshots as evidence.

This skill uses Playwright directly — it does **not** need a local dev server. The `test-webapp` skill's `with_server.py` helper is for local testing; this skill hits live URLs.

## Workflow

### 1. Get the deployment URL

Ask the user for the production URL, or find it from:

```bash
# From wrangler (most recent deployment)
pnpm exec wrangler pages deployment list --project-name=<name> 2>/dev/null | head -5

# From the deploy workflow output
gh run list --workflow=deploy.yml --limit=1 --json conclusion,url
```

If the user just ran `wrangler pages deploy`, the URL was printed in the output.

### 2. Define routes to check

Ask the user which routes matter, or infer from the project:

```bash
# SvelteKit: scan src/routes for page endpoints
find src/routes -name '+page.svelte' | sed 's|src/routes||;s|/+page.svelte||;s|^$|/|'
```

Default to at least:
- `/` (homepage)
- Any routes visible in the project structure

### 3. Run smoke tests

Write and execute a Playwright script:

```python
from playwright.sync_api import sync_playwright
import json, sys

BASE_URL = sys.argv[1] if len(sys.argv) > 1 else "https://example.com"
ROUTES = ["/"]  # populated from step 2

results = []
console_errors = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    # Capture console errors
    page.on("console", lambda msg: console_errors.append({
        "route": page.url,
        "type": msg.type,
        "text": msg.text
    }) if msg.type in ("error", "warning") else None)

    for route in ROUTES:
        url = f"{BASE_URL}{route}"
        try:
            response = page.goto(url, wait_until="networkidle", timeout=15000)
            status = response.status if response else 0
            title = page.title()

            # Screenshot
            screenshot_path = f"/tmp/deploy-verify{route.replace('/', '-') or '-root'}.png"
            page.screenshot(path=screenshot_path, full_page=True)

            results.append({
                "route": route,
                "url": url,
                "status": status,
                "title": title,
                "screenshot": screenshot_path,
                "ok": 200 <= status < 400
            })
        except Exception as e:
            results.append({
                "route": route,
                "url": url,
                "status": 0,
                "error": str(e),
                "ok": False
            })

    browser.close()

# Print results
passed = sum(1 for r in results if r["ok"])
failed = len(results) - passed
errors = [e for e in console_errors if e["type"] == "error"]

print(f"\n{'✅' if failed == 0 else '❌'} {passed}/{len(results)} routes OK")
if errors:
    print(f"⚠️  {len(errors)} console error(s)")

for r in results:
    icon = "✅" if r["ok"] else "❌"
    print(f"  {icon} {r['route']} → {r.get('status', 'ERR')} {r.get('title', r.get('error', ''))}")

for e in errors:
    print(f"  ⚠️  [{e['route']}] {e['text'][:200]}")

if failed > 0:
    sys.exit(1)
```

Run it:

```bash
python3 /tmp/verify-deploy.py "https://my-app.pages.dev"
```

### 4. Present results

Show the user:

```markdown
## Deploy Verification: <url>

| Route | Status | Title | Screenshot |
|---|---|---|---|
| `/` | ✅ 200 | My App | [screenshot](/tmp/deploy-verify-root.png) |
| `/about` | ✅ 200 | About | [screenshot](/tmp/deploy-verify-about.png) |
| `/dashboard` | ❌ 500 | Error | [screenshot](/tmp/deploy-verify-dashboard.png) |

### Console Errors
- ⚠️ `/dashboard`: `TypeError: Cannot read properties of undefined (reading 'user')`

### Verdict
[✅ All routes healthy | ❌ N routes failing — investigate before announcing release]
```

Display the screenshots so the user can visually confirm the pages look correct.

### 5. Deeper checks (if requested)

If the user wants more than a smoke test:

- **Check response times**: add `time.time()` around `page.goto()`, flag anything over 3s
- **Check meta tags**: verify `<title>`, `<meta name="description">`, OG tags
- **Check external resources**: verify no mixed-content warnings, no failed asset loads
- **Check API health**: if the app has an API, `curl` key endpoints and check response shape
- **Compare against previous deploy**: screenshot diff using `pixelmatch` or visual comparison

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
