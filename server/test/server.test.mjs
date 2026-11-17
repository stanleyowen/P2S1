// Uses synthetic fixture data only — never real participant records.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "p2s1-api-"));
const rows = [
  { name: "ALICE TESTER", class: "XII MIA-01", competition: "Chess", result: "1st Place" },
  { name: "BOB EXAMPLE", class: "XII MIA-01", competition: "Chess", result: "2nd Place" },
  { name: "CÉLINE ÀCCENT", class: "X IS-02", competition: "Vocal Solo", result: "Participant" },
  ...Array.from({ length: 80 }, (_, i) => ({ name: `FILLER ${i}`, class: "XI MIA-09", competition: "Sketch", result: "Participant" })),
  ...Array.from({ length: 14 }, (_, i) => ({ name: "DAVID BUSYBODY", class: "XI IS-03", competition: `Event ${i}`, result: "Participant" })),
];
fs.writeFileSync(path.join(dir, "2099.json"), JSON.stringify(rows));
process.env.DATA_DIR = dir;
process.env.ALLOWED_ORIGINS = "https://allowed.test";
process.env.RATE_LIMIT_BURST = "1000";
process.env.RATE_LIMIT_PER_DAY = "100000";

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

test("results are capped at 10 so the dataset cannot be dumped in one call", async () => {
  const body = await (await get("/v1/editions/2099/search?q=filler")).json();
  assert.equal(body.total, 80);
  assert.equal(body.results.length, 10);
  assert.equal(body.truncated, true);
});

test("a class search is capped at 10 too", async () => {
  const body = await (await get("/v1/editions/2099/search?q=xi%20mia-09")).json();
  assert.equal(body.results.length, 10);
  assert.equal(body.truncated, true);
});

test("one student's entries are all returned, even beyond 10", async () => {
  const body = await (await get("/v1/editions/2099/search?q=busybody")).json();
  assert.equal(body.total, 14);
  assert.equal(body.results.length, 14);
  assert.equal(body.truncated, false);
});

test("rejects short, long and odd queries", async () => {
  for (const q of ["ab", "x".repeat(65), "<script>", "a%00b%00c", "a b", "a b c d", "x.y z"]) {
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

test("malformed URLs are a 400, not a 500", async () => {
  const res = await new Promise((resolve, reject) => {
    const r = http.get({ host: "127.0.0.1", port: server.address().port, path: "//%5B/v1/editions" }, resolve);
    r.on("error", reject);
  });
  assert.equal(res.statusCode, 400);
  res.resume();
});

test("class searches still work with the one-long-word rule", async () => {
  assert.equal((await get("/v1/editions/2099/search?q=XII%20MIA-01")).status, 200);
  assert.equal((await get("/v1/editions/2099/search?q=xi%20is-03")).status, 200);
});

test("only safe methods; unknown routes 404", async () => {
  assert.equal((await fetch(base + "/v1/editions", { method: "POST" })).status, 405);
  assert.equal((await get("/v1/editions/1999/search?q=abc")).status, 404);
  assert.equal((await get("/../../etc/passwd")).status, 404);
});
