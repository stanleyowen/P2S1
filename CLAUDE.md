# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Archive site for Pekan Prestasi Sutomo 1 (P2S1), the 2023, 2024, 2025 and 2026 editions, live at https://p2s1.stanleyowen.com (the Netlify site, also reachable at https://p2s1.netlify.app; `SITE.url` uses the custom domain for canonical URLs, the sitemap and social cards). It has two independent parts:

- **Root**: a Next.js 16 App Router site built as a fully static export (`output: "export"` → `out/`) and hosted on Netlify. Routes are `/` and `/[year]` in English, and `/id` and `/id/[year]` in Indonesian. Year pages are generated from `EDITIONS`, and `dynamicParams = false`.
- **`server/`**: a zero-dependency Node `http` API (`server/src/server.mjs`) that serves participant search and champions. It runs in Docker on a private Ubuntu box behind a Cloudflare Tunnel (`p2s1-cdn.stanleyowen.com`), not on Netlify. It has its own `package.json` and is excluded from the root tsconfig and ESLint.

## Commands

Root site (Node ≥22.12):

```bash
npm run dev          # runs `npm run images` first (cold ~3 min, then incremental), then next dev
npm run build        # images → next build → scripts/security-headers.mjs (writes out/_headers CSP)
npm run lint         # eslint .
npm run typecheck    # tsc --noEmit
npm run images       # regenerate responsive images only
npm start            # serve out/
```

To use participant search locally, run the API alongside the site:

```bash
cd server && npm run dev                                # :8787, allows origin http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8787 npm run dev   # repo root
```

API (`server/`):

```bash
npm test                                         # node --test, synthetic fixtures only
node --test --test-name-pattern="champions"      # run a single test by name
npm run normalize                                # data/raw/*.json → data/<year>.json (drops student IDs)
```

The root site has no test suite. Lint and typecheck are its checks.

## Architecture

**Participant data never enters this repo or the site bundle.** Names, classes and results come from the API one search at a time, through `src/lib/api.ts`, which reads `NEXT_PUBLIC_API_URL`. `server/data/`, `*.csv`, `*.xlsx` and `*rekap*` files are gitignored. The API loads `<year>.json` from `DATA_DIR` at boot and returns only `{name, class, competition, result}`. Queries must be 3–64 characters with at least one word of 3+ letters, results are capped at 10 (unless every match is the same student name, then all of that student's entries come back, up to 100), and each client (IPv4 address or IPv6 /64) gets a token-bucket rate limit plus a daily quota (`RATE_LIMIT_PER_DAY`, default 500). The live server's `ALLOWED_ORIGINS` (in its `.env`) lists both https://p2s1.netlify.app and https://p2s1.stanleyowen.com. `server/test/server.test.mjs` enforces these limits, so keep it passing if you change the API. Never add real participant records to the code, fixtures or the site's static content.

**Image pipeline.** Source photos live in `content/photos/<dir>/<name>.jpg|png`. `scripts/build-images.mjs` (sharp) turns them into content-hashed AVIF/WebP files at several widths in `public/img/`, social cards in `public/og/`, and a manifest at `src/generated/images.json` with dimensions, srcsets, blur placeholders and dominant colours. All of these outputs are gitignored, and `.cache/images.json` lets unchanged photos skip re-encoding. Components get images with `getImage("2023/guzheng")` from `src/lib/images.ts` and render them with `<Picture>`. `next/image` is not used (`images.unoptimized`). On Netlify, `netlify/plugins/image-cache` keeps the generated directories between builds. The `OG` map at the top of `build-images.mjs` chooses which photos become the social cards.

**Content is data, not markup.** Each edition's copy, stats, theme, hero and logo keys live in `EDITIONS` in `src/content/editions.ts`. Gallery curation (photo keys, captions, alt text, `wide`/`tall` layout hints) lives in `GALLERIES` in `src/content/photos.ts`. A new edition needs an `EDITIONS` entry (copy in both languages), a logo at `content/photos/logos/<year>.png`, gallery photos, and a `<year>.json` data file on the API server. `stats` is optional and `categories` can be empty: the page hides the numbers and the competition list, and the home totals only add up editions that have `stats`. Set `results: false` until the year's data file is on the API server; the page then shows a "not archived yet" note instead of calling the API. `winnersOnly: true` marks a year whose data holds only the publicly announced podium, not every participant, and shows a disclaimer above the search. 2026 (XXIX) is like this: its `2026.json` comes from the winner captions in the OSIS Instagram PUNCAK posts (Karate also has a `4th Place`, which search shows but the champions board and standings skip). `partialEntries: true` marks a year whose podium is official but whose other entries were rebuilt and may miss a few; it shows a softer note. 2025 (XXVIII)'s `2025.json` combines the Google Form registration exports (every participant) with the podium from OSIS's Instagram winner captions (`2025-winners.json` in the private data folder). The one-off builder that merges them lives next to the data, not in this repo, because it holds team-name aliases. Its gallery photos come from the OSIS Google Drive archive (Puncak photographers and weekly folders), downscaled to 2400px.

**CSP is hash-based and generated after the build.** `scripts/security-headers.mjs` hashes every inline `<script>`/`<style>` in `out/**/*.html` and writes `out/_headers`. It adds the `NEXT_PUBLIC_API_URL` origin to `connect-src`. The build **fails if any inline `on*=` event handler appears in the HTML**. The policy only allows `self` (plus `data:` images and `style-src-attr 'unsafe-inline'` for React `style` props), so third-party scripts, fonts or images will be blocked. Fonts are self-hosted through `next/font`. Static security headers, cache rules and legacy redirects (`/2023/about`, `/2023/search`, etc.) live in `netlify.toml`.

**Two languages.** English lives at the unprefixed URLs, Indonesian under `/id`. Each language has its own root layout (`src/app/(en)/layout.tsx`, `src/app/id/layout.tsx`), so `<html lang>` is correct; both render `SiteShell` from `src/components/site-shell.tsx`. Route files are thin wrappers around `src/views/home.tsx` and `src/views/edition.tsx`, which take a `locale`. Because there is no single root layout, the 404 page is `src/app/global-not-found.tsx` (`experimental.globalNotFound`), and it shows both languages. Interface strings live in `src/i18n/dictionaries.ts` (the `id` dictionary is typed against `en`, so a missing key is a type error). Edition copy, gallery captions and alt text are `{ en, id }` objects next to their data. Competition names stay in their official English form so they match what the results API returns. Build links with `href(locale, path)` from `src/i18n/config.ts`. Switching language is a full page load (plain `<a>`), since it crosses root layouts.

**Class standings (juara umum).** `scripts/class-standings.mjs` (`npm run standings`) reads the private `server/data/<year>.json` files and writes `src/content/standings.json`, which holds class names and medal counts only. Scoring is the official one: gold +15, silver +10, bronze +5, a team event counts once for the team's class (the class most members belong to), and only SMA classes (X–XII) count. The `TEAM` set in the script lists the team events. Rerun it and commit the JSON whenever a data file changes. `ClassChampions` renders it on edition pages, and the home page shows each year's winner. 2025's numbers match the official recap except XI MIA-12, which the recap's total sheet leaves at 0. 2026's computed champion (XII MIA-02) matches the announced juara umum; its Class Choir Battle podium was never published, so it isn't counted.

**Client components** are limited to `results.tsx` (search plus champions board), `gallery.tsx` (lightbox) and `site-header.tsx`. Everything else is server-rendered at build time.

## Deployment

- Site: Netlify builds with `npm run build` and publishes `out/`. `NETLIFY_NEXT_PLUGIN_SKIP=true` keeps it a pure static deploy. `NEXT_PUBLIC_API_URL` is set in `netlify.toml`.
- API: see `server/README.md`. Code and normalized data reach the server by `rsync` over SSH (data never goes through git) and run with `docker compose --profile tunnel up -d --build`. After changing `data/*.json`, run `docker compose restart api`.

## Licensing

Code is MIT. The photos in `content/photos/` are © OSIS SMA Sutomo 1 Medan and are not MIT-licensed.
