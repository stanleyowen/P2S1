# P2S1 — Pekan Prestasi Sutomo 1

The archive site for **Pekan Prestasi Sutomo 1**, the annual competition week of SMA Sutomo 1 Medan organised by OSIS.
Live at **https://p2s1.netlify.app**.

> **Archived.** This site is a read-only archive of P2S1 XXVI (2023) and XXVII (2024) and is no longer updated.

```
.
├── content/photos/        Web-master photos (≤2400px, metadata stripped). This replaces the old P2S1---CDN repo.
├── scripts/
│   ├── build-images.mjs   → AVIF + WebP at 5 widths, content-hashed, blur placeholders, OG cards
│   └── security-headers.mjs → strict CSP (hash-based) written to out/_headers after each build
├── src/
│   ├── app/               Next.js App Router routes: /, /[year] (English) and /id, /id/[year] (Indonesian)
│   ├── views/             Home and edition pages, shared by both languages
│   ├── i18n/              Locale config and interface strings (English, Bahasa Indonesia)
│   ├── components/        Header, footer, gallery + lightbox, results search, champions board
│   └── content/           Edition copy, stats and gallery curation in both languages — no personal data
├── server/                Participant search API (runs on the private server, not Netlify)
└── netlify.toml           Build, security headers, caching, legacy redirects
```

## Develop

```bash
npm install
npm run dev            # builds images on first run (~3 min cold, instant after), then next dev
```

To use participant search locally, run the API in another terminal (needs the data files — see `server/README.md`):

```bash
cd server && npm run dev                                # http://localhost:8787
NEXT_PUBLIC_API_URL=http://localhost:8787 npm run dev   # in the repo root
```

Other scripts: `npm run build` (static export to `out/` + CSP), `npm run lint`, `npm run typecheck`, `npm start` (serve `out/`).

## Adding a photo or an edition

1. Drop a JPEG into `content/photos/<year>/<slug>.jpg`. Any size is fine; keep it ≤2400px wide to keep the repo small.
   EXIF/GPS metadata is stripped from everything the site serves.
2. Reference it in `src/content/photos.ts` with a caption and descriptive `alt` text, each in English and Indonesian (`{ en, id }`).
3. For a new year, add an entry to `EDITIONS` in `src/content/editions.ts` (with `copy.en` and `copy.id`), a logo at `content/photos/logos/<year>.png`,
   and the year's data file on the API server.

## Security & privacy

- **No participant data in this repository or in the site bundle.** Names, classes and results are served one search
  at a time by the API in `server/`, which never stores or returns student ID numbers. `server/data/` is gitignored.
- Fully static site with a hash-based **Content-Security-Policy** (no `unsafe-inline` scripts), HSTS, `nosniff`,
  `frame-ancestors 'none'`, a locked-down Permissions-Policy and COOP/CORP.
- Fonts are self-hosted at build time; the site makes no third-party requests apart from the results API.
- Zero runtime dependencies beyond Next.js/React; the API has none at all.

## Licence

Code: MIT (see `LICENSE`). Photos in `content/photos/` are © OSIS SMA Sutomo 1 Medan and are **not** covered by the MIT licence.
