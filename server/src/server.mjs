// P2S1 participant API — zero-dependency, read-only, rate-limited.
//
//   GET /healthz                          → "ok"
//   GET /v1/editions                      → [2023, 2024]
//   GET /v1/editions/:year/search?q=...   → { query, total, truncated, results: [{ name, class, competition, result }] }
//   GET /v1/editions/:year/champions      → [{ competition, podium: [{ place, entries: [{ name, class }] }] }]
//
// Design notes (security):
//   • Data is loaded once from DATA_DIR at boot; nothing is ever written.
//   • Student IDs are not present in the dataset at all (see scripts/normalize.mjs).
//   • Search requires ≥3 characters and returns at most MAX_RESULTS rows, so the full
//     list cannot be pulled in one request; a per-IP token bucket slows enumeration.
//     The one exception: when every match belongs to the same student name, all of that
//     student's entries are returned (up to MAX_ONE_STUDENT), so nobody's record is cut off.
//   • Only GET/HEAD/OPTIONS. No request bodies are read. Strict timeouts.
//   • CORS is an allow-list (ALLOWED_ORIGINS). Queries are never logged.

import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const env = (k, d) => process.env[k] ?? d;
const PORT = Number(env("PORT", 8080));
const HOST = env("HOST", "0.0.0.0");
const DATA_DIR = env("DATA_DIR", path.resolve(import.meta.dirname, "../data"));
const ALLOWED_ORIGINS = new Set(
  env("ALLOWED_ORIGINS", "https://p2s1.netlify.app,https://p2s1.stanleyowen.com")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
);
// "cloudflare" → trust CF-Connecting-IP (only safe when the sole ingress is a Cloudflare Tunnel).
const TRUST_PROXY = env("TRUST_PROXY", "none");
const RATE_PER_MIN = Number(env("RATE_LIMIT_PER_MIN", 60));
const RATE_BURST = Number(env("RATE_LIMIT_BURST", 20));
// A ceiling per client per UTC day, so a patient crawler cannot rebuild the dataset term by term.
const RATE_PER_DAY = Number(env("RATE_LIMIT_PER_DAY", 500));
const MAX_BUCKETS = 50_000; // past this, new clients share one bucket instead of growing memory
const MAX_RESULTS = 10;
const MAX_ONE_STUDENT = 100;
const MIN_QUERY = 3;
const MAX_QUERY = 64;

// ── Data ────────────────────────────────────────────────────────────────────
const fold = (s) =>
  s
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const PLACE_RANK = { "1st Place": 1, "2nd Place": 2, "3rd Place": 3 };
const rank = (r) => PLACE_RANK[r] ?? 9;

function loadEditions() {
  const editions = new Map();
  for (const f of fs.readdirSync(DATA_DIR)) {
    const m = /^(\d{4})\.json$/.exec(f);
    if (!m) continue;
    const rows = JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), "utf8"));
    const entries = rows.map((r) => ({
      name: String(r.name),
      class: String(r.class),
      competition: String(r.competition),
      result: String(r.result),
      _key: fold(`${r.name} ${r.class}`),
      _name: fold(r.name),
      _class: fold(r.class).replace(/[\s-]/g, ""),
    }));
    editions.set(Number(m[1]), { entries, champions: buildChampions(entries) });
  }
  if (editions.size === 0) throw new Error(`No <year>.json files found in ${DATA_DIR}`);
  return editions;
}

function buildChampions(entries) {
  const byComp = new Map();
  for (const e of entries) {
    const place = rank(e.result);
    if (place > 3) continue;
    if (!byComp.has(e.competition)) byComp.set(e.competition, new Map());
    const places = byComp.get(e.competition);
    if (!places.has(place)) places.set(place, []);
    places.get(place).push({ name: e.name, class: e.class });
  }
  return [...byComp.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([competition, places]) => ({
      competition,
      podium: [...places.entries()]
        .sort(([a], [b]) => a - b)
        .map(([place, list]) => ({ place, entries: list.sort((a, b) => a.name.localeCompare(b.name)) })),
    }));
}

const strip = ({ name, class: cls, competition, result }) => ({ name, class: cls, competition, result });

function search(edition, rawQuery) {
  const q = fold(rawQuery);
  const qClass = q.replace(/[\s-]/g, "");
  const terms = q.split(" ");
  const hits = edition.entries.filter(
    (e) => terms.every((t) => e._key.includes(t)) || (qClass.length >= MIN_QUERY && e._class === qClass),
  );
  hits.sort((a, b) => rank(a.result) - rank(b.result) || a.name.localeCompare(b.name) || a.competition.localeCompare(b.competition));
  const oneStudent = hits.length > 0 && hits.every((h) => h._name === hits[0]._name);
  const limit = oneStudent ? MAX_ONE_STUDENT : MAX_RESULTS;
  return { query: rawQuery, total: hits.length, truncated: hits.length > limit, results: hits.slice(0, limit).map(strip) };
}

// ── Rate limiting (token bucket + daily quota per client) ──────────────────
const buckets = new Map();
// IPv6 clients usually control a whole /64, so they are limited per /64, not per address.
function clientKey(ip) {
  if (!ip.includes(":") || ip.startsWith("::ffff:")) return ip;
  const [head, tail = ""] = ip.split("::");
  const left = head ? head.split(":") : [];
  const right = tail ? tail.split(":") : [];
  const full = [...left, ...Array(Math.max(0, 8 - left.length - right.length)).fill("0"), ...right];
  return full.slice(0, 4).map((h) => h.toLowerCase().replace(/^0+(?=.)/, "")).join(":") + "::/64";
}
function allow(ip) {
  const now = Date.now();
  const day = Math.floor(now / 86_400_000);
  const refill = RATE_PER_MIN / 60_000;
  let key = clientKey(ip);
  if (!buckets.has(key) && buckets.size >= MAX_BUCKETS) key = "overflow";
  const b = buckets.get(key) ?? { tokens: RATE_BURST, at: now, day, used: 0 };
  if (b.day !== day) Object.assign(b, { day, used: 0 });
  b.tokens = Math.min(RATE_BURST, b.tokens + (now - b.at) * refill);
  b.at = now;
  buckets.set(key, b);
  if (b.used >= RATE_PER_DAY) return Math.ceil(((day + 1) * 86_400_000 - now) / 1000);
  if (b.tokens < 1) return Math.ceil((1 - b.tokens) / refill / 1000);
  b.tokens -= 1;
  b.used += 1;
  return 0;
}
setInterval(() => {
  const now = Date.now();
  const today = Math.floor(now / 86_400_000);
  const cutoff = now - 10 * 60_000;
  // Keep clients that used their daily quota until the day rolls over, so waiting 10 minutes doesn't reset it.
  for (const [k, b] of buckets) if (b.at < cutoff && (b.used < RATE_PER_DAY || b.day !== today)) buckets.delete(k);
}, 60_000).unref();

function clientIp(req) {
  if (TRUST_PROXY === "cloudflare") {
    const cf = req.headers["cf-connecting-ip"];
    if (typeof cf === "string" && cf.length < 64) return cf;
  }
  return req.socket.remoteAddress ?? "unknown";
}

// ── HTTP ────────────────────────────────────────────────────────────────────
const BASE_HEADERS = {
  "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "Cross-Origin-Resource-Policy": "same-origin",
  "X-Robots-Tag": "noindex, nofollow",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains",
};

function send(req, res, status, body, extra = {}) {
  const origin = req.headers.origin;
  const headers = { ...BASE_HEADERS, Vary: "Origin", ...extra };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "GET, OPTIONS";
    headers["Access-Control-Max-Age"] = "86400";
  }
  if (body === undefined) {
    res.writeHead(status, headers).end();
    return;
  }
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  headers["Content-Type"] ??= typeof body === "string" ? "text/plain; charset=utf-8" : "application/json; charset=utf-8";
  res.writeHead(status, headers).end(req.method === "HEAD" ? undefined : payload);
}

const err = (req, res, status, message, extra) => send(req, res, status, { error: message }, { "Cache-Control": "no-store", ...extra });

export function createServer(editions) {
  const years = [...editions.keys()].sort();

  const server = http.createServer((req, res) => {
    try {
      if (req.method === "OPTIONS") return send(req, res, 204);
      if (req.method !== "GET" && req.method !== "HEAD") return err(req, res, 405, "Method not allowed", { Allow: "GET, HEAD, OPTIONS" });
      if ((req.url ?? "").length > 512) return err(req, res, 414, "URI too long");

      if (req.url === "/healthz") return send(req, res, 200, "ok", { "Cache-Control": "no-store" });

      // Rate-limit before parsing, so malformed requests are counted too.
      const retry = allow(clientIp(req));
      if (retry) return err(req, res, 429, "Too many requests — please slow down.", { "Retry-After": String(retry) });

      let url;
      try {
        url = new URL(req.url ?? "/", "http://localhost");
      } catch {
        return err(req, res, 400, "Bad request");
      }

      if (url.pathname === "/v1/editions") return send(req, res, 200, years, { "Cache-Control": "public, max-age=3600" });

      const m = /^\/v1\/editions\/(\d{4})\/(search|champions)$/.exec(url.pathname);
      if (!m) return err(req, res, 404, "Not found");
      const edition = editions.get(Number(m[1]));
      if (!edition) return err(req, res, 404, "Unknown edition");

      if (m[2] === "champions") return send(req, res, 200, edition.champions, { "Cache-Control": "public, max-age=3600" });

      const q = (url.searchParams.get("q") ?? "").normalize("NFKC").replace(/\s+/g, " ").trim();
      if (q.length < MIN_QUERY || q.length > MAX_QUERY) return err(req, res, 400, `Query must be ${MIN_QUERY}–${MAX_QUERY} characters.`);
      if (!/^[\p{L}\p{N} .,'’\-]+$/u.test(q)) return err(req, res, 400, "Query contains unsupported characters.");
      // Every query needs one word of 3+ characters; "a b"-style probes would otherwise match hundreds of rows.
      if (!fold(q).split(" ").some((t) => t.replace(/[.,'’-]/g, "").length >= MIN_QUERY))
        return err(req, res, 400, `Include at least one word of ${MIN_QUERY} or more characters.`);

      return send(req, res, 200, search(edition, q), { "Cache-Control": "public, max-age=300" });
    } catch (e) {
      console.error("request failed:", e instanceof Error ? e.message : e);
      return err(req, res, 500, "Internal error");
    }
  });

  server.requestTimeout = 5_000;
  server.headersTimeout = 5_000;
  server.keepAliveTimeout = 5_000;
  server.maxHeadersCount = 50;
  return server;
}

// ── Boot ────────────────────────────────────────────────────────────────────
if (import.meta.url === `file://${process.argv[1]}`) {
  const editions = loadEditions();
  const server = createServer(editions);
  server.listen(PORT, HOST, () => {
    const counts = [...editions].map(([y, e]) => `${y}:${e.entries.length}`).join(" ");
    console.log(`p2s1-api listening on ${HOST}:${PORT} · editions ${counts} · origins ${[...ALLOWED_ORIGINS].join(",")}`);
  });
  const stop = () => server.close(() => process.exit(0));
  process.on("SIGTERM", stop);
  process.on("SIGINT", stop);
}

export { loadEditions, search };
