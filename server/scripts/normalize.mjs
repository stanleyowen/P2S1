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
// Names sometimes carry a role tag ("RICHARD TAN (KETUA)"); classes sometimes lose their padding ("IX-3").
const cleanName = (s) => clean(s).replace(/\s*\((ketua|anggota|cadangan|captain)\)\s*$/i, "");
const cleanClass = (s) => clean(s).replace(/-(\d)$/, "-0$1");

// Olympiads are judged per grade, as the 2025+ recaps name them: "Math Olympiad (Grade 10)".
const GRADED = new Set(["Math Olympiad", "Physics Olympiad", "Chemistry Olympiad", "Biology Olympiad", "Economics Olympiad",
  "Economics and Accounting Olympiad", "Geography Olympiad"]);
const GRADE = { X: 10, XI: 11, XII: 12 };
const graded = (competition, roman) => (GRADED.has(competition) && GRADE[roman] ? `${competition} (Grade ${GRADE[roman]})` : competition);
const romanOf = (cls) => /^(XII|XI|X)\b/.exec(cls)?.[1];

// Karate categories, named as in 2025.
const KARATE = {
  "Karate Putra": "Men's Karate", "Karate Putri": "Women's Karate",
  "Karate Putra Kelas +65kg": "Men's Karate (+65 kg)", "Karate Putra Kelas -65kg": "Men's Karate (−65 kg)",
  "Karate Putri Kelas Bebas": "Women's Karate (Open)",
};

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
  const karateMedal = new Set(rows.filter((r) => /Karate/.test(r.competition) && r.result !== "Participant").map((r) => `${r.name}|${r.class}`));
  rows = rows.filter((r) => !(r.competition === "Karate" && r.result === "Participant" && karateMedal.has(`${r.name}|${r.class}`)));
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
    s.perlombaan.map((p) => {
      const raw = clean(p["nama perlombaan"]);
      const cls = cleanClass(s.kelas);
      const level = /tingkat (XII|XI|X)$/.exec(raw)?.[1] ?? romanOf(cls); // "Matematika tingkat XI"
      return {
        name: cleanName(s.nama),
        class: cls,
        competition: KARATE[raw] ?? graded(canonical(clean(t[raw] ?? raw)), level),
        result: clean(p.keterangan),
      };
    }),
  );
}

// 2024 — already one row per entry, English names provided.
if (fs.existsSync(path.join(rawDir, "2024-rekap.json"))) {
  datasets[2024] = read("2024-rekap.json").map((r) => {
    const id = clean(r["COMPETITION (INDONESIA)"]);
    const cls = cleanClass(r.CLASS);
    const level = /^Olimpiade .+ (XII|XI|X)$/.exec(id)?.[1] ?? romanOf(cls); // podium rows: "Olimpiade Fisika XI"
    const base = canonical(clean(r.COMPETITION) === "Sketch" ? "Sketsa Objek" : clean(r.COMPETITION));
    return {
    name: cleanName(r.NAME),
    class: cls,
    // 2024's "Sketch" rows are the Sketsa Objek podium (the participants are under "Sketsa Objek").
    competition: KARATE[id] ?? graded(base, level),
    result: clean(r.STATUS),
    };
  });
}

// Optional private fixes for errors in a year's raw recap: <rawDir>/<year>-corrections.json,
// [{ "match": { name, class?, competition?, result? }, "set": { class?, name?, competition?, result? } }].
// They live next to the raw data (never in git) because they name students.
for (const [year, rows] of Object.entries(datasets)) {
  const file = path.join(rawDir, `${year}-corrections.json`);
  if (!fs.existsSync(file)) continue;
  const fixes = JSON.parse(fs.readFileSync(file, "utf8"));
  let applied = 0;
  for (const { match, set } of fixes) {
    for (const r of rows) {
      if (Object.entries(match).every(([k, v]) => clean(r[k]).toUpperCase() === clean(v).toUpperCase())) {
        Object.assign(r, set);
        applied++;
      }
    }
  }
  console.log(`${year}: ${applied} correction(s) from ${path.basename(file)}`);
}

fs.mkdirSync(outDir, { recursive: true });
for (const [year, rows] of Object.entries(datasets)) {
  const out = dedupe(rows).filter((r) => r.name && r.competition);
  fs.writeFileSync(path.join(outDir, `${year}.json`), JSON.stringify(out));
  const comps = new Set(out.map((r) => r.competition)).size;
  console.log(`${year}: ${out.length} entries, ${comps} competitions → ${path.join(outDir, `${year}.json`)}`);
}
