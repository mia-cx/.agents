---
description: Use pnpm i instead of pnpm add for dependencies
alwaysApply: true
---

# pnpm dependency install command

When installing dependencies, use:

- `pnpm i <pkg>` for production dependencies
- `pnpm i -D <pkg>` for dev dependencies

Do not use `pnpm add`.

## Why

Using `pnpm add` here can create a `.pnpm-store` directory in the repo root, which degrades git performance and pollutes workspace status.
