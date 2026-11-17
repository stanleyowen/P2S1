#!/usr/bin/env node
// Convert the raw "Rekap Final Data P2S1" exports into the minimal dataset the API serves.
//
//   node scripts/normalize.mjs [rawDir=data/raw] [outDir=data]
//
// Output: <outDir>/<year>.json  →  [{ name, class, competition, result }]
// Student IDs and any other columns are deliberately dropped: the public API never needs them.

import fs from "node:fs";
import path from "node:path";

const [rawDir = "data/raw", outDir = "data"] = process.argv.slice(2);
const read = (f) => JSON.parse(fs.readFileSync(path.join(rawDir, f), "utf8"));

const clean = (s) => String(s ?? "").normalize("NFKC").replace(/\s+/g, " ").trim();

// Spelling variants that appear in the source sheets → one canonical name.
const CANONICAL = {
  "Battle Of Brains": "Battle of Brains",
  Fotografi: "Photography",
  Watercolour: "Watercolor",
  "Instrumen Musik": "Musical Instrument",
  "Musical Instrument Competition": "Musical Instrument",
  "Sketsa Objek": "Object Sketch",
  "Dance Grup": "Dance Group",
  "Certificate Design Competition": "Certificate Design",
  // 2023 registered singles as "Bulu Tangkis Putra/Putri" but recorded winners as "… Tunggal …".
  "Bulu Tangkis Putra": "Men's Single Badminton",
  "Bulu Tangkis Putri": "Women's Single Badminton",
};
const canonical = (c) => CANONICAL[c] ?? c;

function dedupe(rows) {
  const seen = new Set();
  // A winner sometimes also appears as a plain "Participant" in the same competition; keep only the medal.
  const podium = new Set(rows.filter((r) => r.result !== "Participant").map((r) => `${r.name}|${r.class}|${r.competition}`));
  return rows.filter((r) => {
    if (r.result === "Participant" && podium.has(`${r.name}|${r.class}|${r.competition}`)) return false;
    const k = `${r.name}|${r.class}|${r.competition}|${r.result}`;
    return seen.has(k) ? false : (seen.add(k), true);
  });
}

const datasets = {};

// 2023 — one row per student with nested competitions, Indonesian competition names.
if (fs.existsSync(path.join(rawDir, "2023-rekap.json"))) {
  const t = read("2023-translation.json");
  datasets[2023] = read("2023-rekap.json").flatMap((s) =>
    s.perlombaan.map((p) => ({
      name: clean(s.nama),
      class: clean(s.kelas),
      competition: canonical(clean(t[p["nama perlombaan"]] ?? p["nama perlombaan"])),
      result: clean(p.keterangan),
    })),
  );
}

// 2024 — already one row per entry, English names provided.
if (fs.existsSync(path.join(rawDir, "2024-rekap.json"))) {
  datasets[2024] = read("2024-rekap.json").map((r) => ({
    name: clean(r.NAME),
    class: clean(r.CLASS),
    // 2024's "Sketch" rows are the Sketsa Objek podium (the participants are under "Sketsa Objek").
    competition: canonical(clean(r.COMPETITION) === "Sketch" ? "Sketsa Objek" : clean(r.COMPETITION)),
    result: clean(r.STATUS),
  }));
}

fs.mkdirSync(outDir, { recursive: true });
for (const [year, rows] of Object.entries(datasets)) {
  const out = dedupe(rows).filter((r) => r.name && r.competition);
  fs.writeFileSync(path.join(outDir, `${year}.json`), JSON.stringify(out));
  const comps = new Set(out.map((r) => r.competition)).size;
  console.log(`${year}: ${out.length} entries, ${comps} competitions → ${path.join(outDir, `${year}.json`)}`);
}
