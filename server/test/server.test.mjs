// Uses synthetic fixture data only — never real participant records.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "p2s1-api-"));
const rows = [
  { name: "ALICE TESTER", class: "XII MIA-01", competition: "Chess", result: "1st Place" },
  { name: "BOB EXAMPLE", class: "XII MIA-01", competition: "Chess", result: "2nd Place" },
  { name: "CÉLINE ÀCCENT", class: "X IS-02", competition: "Vocal Solo", result: "Participant" },
  ...Array.from({ length: 80 }, (_, i) => ({ name: `FILLER ${i}`, class: "XI MIA-09", competition: "Sketch", result: "Participant" })),
];
fs.writeFileSync(path.join(dir, "2099.json"), JSON.stringify(rows));
process.env.DATA_DIR = dir;
process.env.ALLOWED_ORIGINS = "https://allowed.test";
process.env.RATE_LIMIT_BURST = "1000";

const { createServer, loadEditions } = await import("../src/server.mjs");
let server, base;
before(async () => {
  server = createServer(loadEditions());
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

const get = (p, headers = {}) => fetch(base + p, { headers });

test("search matches names accent-insensitively and never exposes extra fields", async () => {
  const r = await get("/v1/editions/2099/search?q=celine");
  assert.equal(r.status, 200);
  const body = await r.json();
  assert.equal(body.total, 1);
  assert.deepEqual(Object.keys(body.results[0]).sort(), ["class", "competition", "name", "result"]);
});

test("search by class, winners first", async () => {
  const body = await (await get("/v1/editions/2099/search?q=xii%20mia-01")).json();
  assert.deepEqual(body.results.map((r) => r.result), ["1st Place", "2nd Place"]);
});

test("results are capped so the dataset cannot be dumped in one call", async () => {
  const body = await (await get("/v1/editions/2099/search?q=filler")).json();
  assert.equal(body.total, 80);
  assert.equal(body.results.length, 50);
  assert.equal(body.truncated, true);
});

test("rejects short, long and odd queries", async () => {
  for (const q of ["ab", "x".repeat(65), "<script>", "a%00b%00c"]) {
    assert.equal((await get(`/v1/editions/2099/search?q=${q}`)).status, 400, q);
  }
});

test("champions are grouped by competition and place", async () => {
  const body = await (await get("/v1/editions/2099/champions")).json();
  assert.equal(body.length, 1);
  assert.equal(body[0].competition, "Chess");
  assert.deepEqual(body[0].podium.map((p) => p.place), [1, 2]);
});

test("CORS only for allow-listed origins", async () => {
  const ok = await get("/v1/editions", { Origin: "https://allowed.test" });
  assert.equal(ok.headers.get("access-control-allow-origin"), "https://allowed.test");
  const bad = await get("/v1/editions", { Origin: "https://evil.test" });
  assert.equal(bad.headers.get("access-control-allow-origin"), null);
});

test("only safe methods; unknown routes 404", async () => {
  assert.equal((await fetch(base + "/v1/editions", { method: "POST" })).status, 405);
  assert.equal((await get("/v1/editions/1999/search?q=abc")).status, 404);
  assert.equal((await get("/../../etc/passwd")).status, 404);
});
