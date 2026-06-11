# Augusto González-Bonorino — Personal Site

Personal site for Augusto González-Bonorino (PhD student in Economics, ASU).
Built with Vite + React + TypeScript + Tailwind. Visual direction:
**Quiet Modernist** — paper, ink, and a single cobalt accent.

## Architecture

- **Two modes, one studio.** `/academic` is a typographic CV in Fraunces;
  `/build` is a Geist Mono project bento with transparent human/AI
  collaboration breakdowns. Both share the same design system.
- **Content schema** lives in `src/data/artifacts.json` and `src/data/types.ts`.
  Pages query through `src/lib/artifacts.ts`; admin queries also hit Lovable
  Cloud (Supabase) via `useArtifacts` / `useInboxItems`, with a JSON fallback
  when the backend is offline.
- **Admin** at `/admin` is gated by Supabase magic-link auth restricted to
  an email allowlist in `src/hooks/useAdminAuth.ts`.

## Local development

```sh
npm install
npm run dev
```

Tests: `bunx vitest run` (frontend) and Deno tests under
`supabase/functions/*/index.test.ts`.

## Editing content

Two ways:

1. Sign in to `/admin` and use the Inbox / Content tabs (writes to the DB).
2. Edit `src/data/artifacts.json` directly and commit.

## Deploy

This repo is connected to Lovable. Push or use the Lovable editor to ship.
