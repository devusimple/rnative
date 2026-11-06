# rnative

A React Native component registry and design system, inspired by shadcn/ui.

## Structure

- `apps/docs` - Next.js docs + registry host (`/r/[name]`, `public/r/`)
- `apps/showcase` - Expo app (live preview)
- `apps/cli` - `@rnative/cli`
- `packages/tokens` - design tokens
- `packages/registry` - single source of component source code
- `packages/core` - npm distribution

## Getting started

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build        # turbo build (tokens + registry + core + cli + docs)
```

## Usage

```bash
npx rnative init
npx rnative list
npx rnative add button
npx rnative add sign-in-form
```

The CLI reads `components.json` in your project root. `init` scaffolds it plus
`src/components/ui`, `src/components/blocks`, `src/lib`, and `src/theme`.
`add` fetches the component from the registry and writes its source files
(including registry dependencies like `button` + `input` for `sign-in-form`).

## Registry

`registry.json` is the source manifest. Each item lists its files under
`packages/registry/src`. The docs app serves hydrated JSON at `/r/<name>`
(with file contents inlined) and also emits static files under
`public/r/*.json` at build time via `scripts/build-registry.mjs`.
