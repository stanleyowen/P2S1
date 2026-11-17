#!/usr/bin/env node
// Build responsive images from content/photos/** (the "CDN" now lives in this repo).
//
//   content/photos/<dir>/<name>.(jpg|png)
//     → public/img/<dir>/<name>.<hash>.<width>.(avif|webp)   (content-hashed → cacheable forever)
//     → src/generated/images.json                           (dimensions, srcsets, blur placeholder)
//     → public/og/<name>.jpg                                (1200×630 social cards, see OG below)
//
// Outputs are gitignored and rebuilt on `npm run dev` / `npm run build`. Unchanged sources are
// skipped via .cache/images.json, so incremental runs take well under a second.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import os from "node:os";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "content/photos");
const OUT = path.join(ROOT, "public/img");
const OG_OUT = path.join(ROOT, "public/og");
const MANIFEST = path.join(ROOT, "src/generated/images.json");
const CACHE = path.join(ROOT, ".cache/images.json");
const VERSION = 3; // bump to force a full rebuild when encoder settings change

const PHOTO_WIDTHS = [480, 828, 1280, 1920, 2400];
const LOGO_WIDTHS = [96, 192, 384, 768];
const OG = { "og-home": "2023/celebration", "og-2023": "2023/finale-stage", "og-2024": "2024/dance-solo" };

sharp.concurrency(1);
const parallel = Math.max(1, Math.min(4, os.availableParallelism() - 1));

const walk = (d) =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));

const sources = walk(SRC)
  .filter((f) => /\.(jpe?g|png)$/i.test(f))
  .sort();

const cache = (() => {
  try {
    const c = JSON.parse(fs.readFileSync(CACHE, "utf8"));
    return c.version === VERSION ? c.entries : {};
  } catch {
    return {};
  }
})();

async function build(file) {
  const rel = path.relative(SRC, file).replace(/\\/g, "/");
  const key = rel.replace(/\.(jpe?g|png)$/i, "");
  const buf = fs.readFileSync(file);
  const hash = crypto.createHash("sha256").update(buf).digest("hex").slice(0, 10);
  const isLogo = key.startsWith("logos/");

  const prev = cache[key];
  if (prev?.hash === hash && prev.files.every((f) => fs.existsSync(path.join(ROOT, "public", f)))) return [key, prev];

  // .rotate() bakes EXIF orientation; sharp drops all metadata (EXIF/GPS/XMP) on output by default.
  const base = sharp(buf, { failOn: "none" }).rotate();
  const { width: w0, height: h0 } = await base.clone().metadata().then(async (m) => {
    const o = (m.orientation ?? 1) >= 5;
    return { width: o ? m.height : m.width, height: o ? m.width : m.height };
  });
  const widths = [...new Set([...(isLogo ? LOGO_WIDTHS : PHOTO_WIDTHS).filter((w) => w < w0), Math.min(w0, isLogo ? 768 : 2400)])].sort((a, b) => a - b);

  const outDir = path.join(OUT, path.dirname(rel));
  fs.mkdirSync(outDir, { recursive: true });
  const name = path.basename(key);
  const files = [];
  const srcset = { avif: [], webp: [] };

  for (const w of widths) {
    const resized = base.clone().resize({ width: w, withoutEnlargement: true });
    for (const [fmt, opts] of [
      ["avif", { quality: isLogo ? 70 : 55, effort: 4 }],
      ["webp", { quality: isLogo ? 90 : 78, effort: 5, alphaQuality: 90 }],
    ]) {
      const f = `img/${path.dirname(rel)}/${name}.${hash}.${w}.${fmt}`.replace("/./", "/");
      await resized.clone()[fmt](opts).toFile(path.join(ROOT, "public", f));
      files.push(f);
      srcset[fmt].push([`/${f}`, w]);
    }
  }

  // Tiny blurred preview (≈300 bytes) shown while the real image loads.
  const lqip = await base.clone().resize(24).blur(1.2).webp({ quality: 40 }).toBuffer();
  const { dominant } = await base.clone().resize(64).stats();

  return [
    key,
    {
      hash,
      width: w0,
      height: h0,
      color: `rgb(${dominant.r} ${dominant.g} ${dominant.b})`,
      blur: `data:image/webp;base64,${lqip.toString("base64")}`,
      avif: srcset.avif,
      webp: srcset.webp,
      files,
    },
  ];
}

async function pool(items, n, fn) {
  const out = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx]);
      }
    }),
  );
  return out;
}

const t0 = performance.now();
const entries = Object.fromEntries(await pool(sources, parallel, build));

// Remove stale outputs (renamed/removed photos, old hashes).
const keep = new Set(Object.values(entries).flatMap((e) => e.files.map((f) => path.join(ROOT, "public", f))));
if (fs.existsSync(OUT)) for (const f of walk(OUT)) if (!keep.has(f)) fs.rmSync(f);

// Social cards.
fs.mkdirSync(OG_OUT, { recursive: true });
for (const [name, key] of Object.entries(OG)) {
  const dest = path.join(OG_OUT, `${name}.jpg`);
  const src = sources.find((f) => f.includes(`${key}.`));
  if (!src) throw new Error(`OG source ${key} not found`);
  if (!fs.existsSync(dest) || fs.statSync(dest).mtimeMs < fs.statSync(src).mtimeMs)
    await sharp(src).rotate().resize(1200, 630, { fit: "cover", position: "attention" }).jpeg({ quality: 82, mozjpeg: true }).toFile(dest);
}

const manifest = Object.fromEntries(
  Object.entries(entries).map(([k, { width, height, color, blur, avif, webp }]) => [k, { width, height, color, blur, avif, webp }]),
);
fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1));
fs.mkdirSync(path.dirname(CACHE), { recursive: true });
fs.writeFileSync(CACHE, JSON.stringify({ version: VERSION, entries }));

const bytes = [...keep].reduce((s, f) => s + fs.statSync(f).size, 0);
console.log(`images: ${sources.length} sources → ${keep.size} files (${(bytes / 1e6).toFixed(1)} MB) in ${((performance.now() - t0) / 1000).toFixed(1)}s`);
