#!/bin/bash
# init-artifact.sh — scaffold a SvelteKit + Tailwind v4 + shadcn-svelte + radix-svelte project
# with Cloudflare Pages deployment via wrangler
set -e

# ─── Args ─────────────────────────────────────────────────────────────────────
if [ -z "$1" ]; then
  echo "❌ Usage: bash init-artifact.sh <project-name>"
  exit 1
fi

PROJECT_NAME="$1"

# ─── Preflight ────────────────────────────────────────────────────────────────
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
echo "🔍 Node.js version: $NODE_VERSION"

if [ "$NODE_VERSION" -lt 20 ]; then
  echo "❌ Node.js 20+ required (Tailwind v4 / SvelteKit latest). Current: $(node -v)"
  exit 1
fi

if ! command -v pnpm &> /dev/null; then
  echo "📦 pnpm not found — installing..."
  npm install -g pnpm
fi

# ─── 1. Create SvelteKit project with Tailwind + Cloudflare adapter ──────────
#    sv create handles: SvelteKit scaffold, Tailwind v4, adapter-cloudflare,
#    wrangler.jsonc, and all base config.
echo ""
echo "🚀 Creating SvelteKit project: $PROJECT_NAME"
pnpm dlx sv create "$PROJECT_NAME" \
  --template minimal \
  --types ts \
  --add "tailwindcss=plugins:none" "sveltekit-adapter=adapter:cloudflare+cfTarget:pages" \
  --no-install

cd "$PROJECT_NAME"

# ─── 2. Install base deps ────────────────────────────────────────────────────
echo ""
echo "📦 Installing base dependencies..."
pnpm install

# ─── 3. Install shadcn-svelte manual deps ────────────────────────────────────
#    We skip `shadcn-svelte init` (interactive preset prompt) and set up
#    components.json + CSS + utils manually per the manual install docs.
echo ""
echo "🎨 Setting up shadcn-svelte (manual init)..."
pnpm add tailwind-variants clsx tailwind-merge tw-animate-css
pnpm add @lucide/svelte

# Create components.json
cat > components.json << 'EOF'
{
  "$schema": "https://shadcn-svelte.com/schema.json",
  "tailwind": {
    "css": "src/routes/layout.css",
    "baseColor": "zinc"
  },
  "aliases": {
    "lib": "$lib",
    "utils": "$lib/utils",
    "components": "$lib/components",
    "ui": "$lib/components/ui",
    "hooks": "$lib/hooks"
  },
  "typescript": true,
  "registry": "https://shadcn-svelte.com/registry"
}
EOF
echo "  ✅ components.json"

# Create cn utility
mkdir -p src/lib
cat > src/lib/utils.ts << 'EOF'
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
EOF
echo "  ✅ src/lib/utils.ts"

# Write Tailwind v4 CSS with OKLCH theme variables
cat > src/routes/layout.css << 'EOF'
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.269 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.371 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.439 0 0);
}

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
EOF
echo "  ✅ src/routes/layout.css (Tailwind v4 + OKLCH theme)"

# ─── 4. Install ALL shadcn-svelte components ─────────────────────────────────
echo ""
echo "📦 Installing ALL shadcn-svelte components (55+)..."
pnpm dlx shadcn-svelte@latest add --all -y --overwrite

# ─── 5. Install radix-svelte ─────────────────────────────────────────────────
echo ""
echo "📦 Installing radix-svelte..."
pnpm add radix-svelte

# ─── 6. Install dark mode support ────────────────────────────────────────────
echo ""
echo "🌗 Installing mode-watcher..."
pnpm add mode-watcher

# ─── 7. Set up root layout with ModeWatcher ──────────────────────────────────
echo ""
echo "📝 Creating root layout + starter page..."
mkdir -p src/routes

cat > src/routes/+layout.svelte << 'SVELTE'
<script lang="ts">
  import "./layout.css";
  import { ModeWatcher } from "mode-watcher";
  let { children } = $props();
</script>

<ModeWatcher />
{@render children?.()}
SVELTE

cat > src/routes/+page.svelte << 'SVELTE'
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card/index.js";
  import SunIcon from "@lucide/svelte/icons/sun";
  import MoonIcon from "@lucide/svelte/icons/moon";
  import { toggleMode } from "mode-watcher";
</script>

<div class="flex min-h-screen items-center justify-center bg-background p-8">
  <Card class="w-full max-w-md">
    <CardHeader>
      <div class="flex items-center justify-between">
        <CardTitle>Welcome</CardTitle>
        <Button onclick={toggleMode} variant="outline" size="icon">
          <SunIcon
            class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
          />
          <MoonIcon
            class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
          />
          <span class="sr-only">Toggle theme</span>
        </Button>
      </div>
      <CardDescription
        >SvelteKit + shadcn-svelte + radix-svelte</CardDescription
      >
    </CardHeader>
    <CardContent>
      <p class="text-sm text-muted-foreground">
        Edit <code class="rounded bg-muted px-1 py-0.5 font-mono text-xs"
          >src/routes/+page.svelte</code
        > to get started.
      </p>
    </CardContent>
  </Card>
</div>
SVELTE

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "✅ Project ready: $PROJECT_NAME"
echo "═══════════════════════════════════════════════════════════════════"
echo ""
echo "Stack:"
echo "  • SvelteKit + TypeScript + Vite"
echo "  • Tailwind CSS v4 (OKLCH colors, @theme inline)"
echo "  • shadcn-svelte — ALL 55+ components installed"
echo "  • radix-svelte primitives"
echo "  • Lucide icons"
echo "  • mode-watcher (dark mode)"
echo "  • Cloudflare Pages (adapter + wrangler.jsonc from sv create)"
echo ""
echo "Commands:"
echo "  cd $PROJECT_NAME"
echo "  pnpm dev                          # dev server on :5173"
echo "  pnpm build                        # production build"
echo "  pnpm exec wrangler pages dev      # local Cloudflare Pages preview"
echo "  pnpm exec wrangler pages deploy   # deploy to Cloudflare Pages"
echo ""
echo "Imports:"
echo '  import { Button } from "$lib/components/ui/button/index.js";'
echo '  import { Dialog, DialogContent } from "$lib/components/ui/dialog/index.js";'
echo '  import { Accordion } from "radix-svelte";'
echo ""
