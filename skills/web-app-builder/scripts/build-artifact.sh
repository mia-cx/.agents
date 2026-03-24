#!/bin/bash
# build-artifact.sh — build the SvelteKit app for Cloudflare Pages
set -e

echo "📦 Building SvelteKit app..."

# Check if we're in a project directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: No package.json found. Run this from your project root."
  exit 1
fi

if [ ! -f "svelte.config.js" ]; then
  echo "❌ Error: No svelte.config.js found. Is this a SvelteKit project?"
  exit 1
fi

# Build
echo "🔨 Running pnpm build..."
pnpm build

# Report output
OUTPUT_DIR=".svelte-kit/cloudflare"
if [ -d "$OUTPUT_DIR" ]; then
  FILE_COUNT=$(find "$OUTPUT_DIR" -type f | wc -l | tr -d ' ')
  DIR_SIZE=$(du -sh "$OUTPUT_DIR" | cut -f1)
  echo ""
  echo "✅ Build complete!"
  echo "📁 Output: $OUTPUT_DIR ($DIR_SIZE, $FILE_COUNT files)"
  echo ""
  echo "Next steps:"
  echo "  pnpm exec wrangler pages dev     # local preview"
  echo "  pnpm exec wrangler pages deploy  # deploy to Cloudflare Pages"
else
  BUILD_DIR="build"
  if [ -d "$BUILD_DIR" ]; then
    FILE_COUNT=$(find "$BUILD_DIR" -type f | wc -l | tr -d ' ')
    DIR_SIZE=$(du -sh "$BUILD_DIR" | cut -f1)
    echo ""
    echo "✅ Build complete!"
    echo "📁 Output: $BUILD_DIR ($DIR_SIZE, $FILE_COUNT files)"
  else
    echo ""
    echo "⚠️  Build finished but output directory not found."
    echo "   Check your adapter config in svelte.config.js."
  fi
fi
