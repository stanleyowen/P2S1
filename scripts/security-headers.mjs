#!/usr/bin/env node
// Post-build: generate a strict Content-Security-Policy for the static export.
//
// Next.js (App Router) inlines small bootstrap <script> tags into every page. Instead of
// allowing 'unsafe-inline', we hash each inline script/style and allow exactly those hashes.
// The policy is written to out/_headers (Netlify reads it alongside netlify.toml).
// Any script injected later (XSS, a compromised third party) has no matching hash and is blocked.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const OUT = path.resolve(import.meta.dirname, "../out");
if (!fs.existsSync(OUT)) throw new Error("out/ not found — run `next build` first");

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const sha = (s) => `'sha256-${crypto.createHash("sha256").update(s, "utf8").digest("base64")}'`;

const scripts = new Set();
const styles = new Set();
const NON_EXEC = /\btype\s*=\s*["']?(application\/(ld\+)?json|text\/template)/i;

for (const file of walk(OUT).filter((f) => f.endsWith(".html"))) {
  const html = fs.readFileSync(file, "utf8");
  for (const [, attrs, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\bsrc\s*=/.test(attrs) || NON_EXEC.test(attrs) || body.length === 0) continue;
    scripts.add(sha(body));
  }
  for (const [, body] of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) if (body.length) styles.add(sha(body));
  if (/\son[a-z]+\s*=\s*["']/i.test(html.replace(/<script[\s\S]*?<\/script>/gi, ""))) {
    throw new Error(`Inline event handler found in ${path.relative(OUT, file)} — CSP would block it.`);
  }
}

let api = "";
try {
  if (process.env.NEXT_PUBLIC_API_URL) api = new URL(process.env.NEXT_PUBLIC_API_URL).origin;
} catch {
  throw new Error(`NEXT_PUBLIC_API_URL is not a valid URL: ${process.env.NEXT_PUBLIC_API_URL}`);
}

const csp = [
  "default-src 'self'",
  `script-src 'self' ${[...scripts].sort().join(" ")}`,
  `style-src 'self'${styles.size ? " " + [...styles].sort().join(" ") : ""}`,
  "style-src-attr 'unsafe-inline'", // React `style={{…}}` props (image placeholders, object-position)
  "img-src 'self' data:",
  "font-src 'self'",
  `connect-src 'self'${api ? " " + api : ""}`,
  "manifest-src 'self'",
  "media-src 'none'",
  "object-src 'none'",
  "worker-src 'none'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

fs.writeFileSync(path.join(OUT, "_headers"), `/*\n  Content-Security-Policy: ${csp}\n`);
console.log(`security-headers: CSP with ${scripts.size} script + ${styles.size} style hashes; connect-src ${api || "(self only)"} → out/_headers`);
