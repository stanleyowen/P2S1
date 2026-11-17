#!/usr/bin/env node
// Builds the class championship (juara umum) standings for every edition.
//
//   node scripts/class-standings.mjs [DATA_DIR]      (default: server/data)
//
// Reads the private <year>.json result files and writes src/content/standings.json, which holds
// only class names and medal counts: no student names ever leave DATA_DIR.
//
// Official P2S1 scoring:
//   gold +15 · silver +10 · bronze +5
//   A team (regu/kelompok) event counts as one medal for the class that won it. Teams must come
//   from a single class, so the team's class is the one most of its members belong to.
// Only SMA classes (X, XI, XII) take part; junior-high (IX) entrants in open events are skipped.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DATA_DIR = path.resolve(process.argv[2] ?? path.join(ROOT, "server/data"));
const OUT = path.join(ROOT, "src/content/standings.json");

const POINTS = { "1st Place": 15, "2nd Place": 10, "3rd Place": 5 };
const MEDAL = { "1st Place": "gold", "2nd Place": "silver", "3rd Place": "bronze" };

// Events entered as a team. Everything else is individual: each podium row is its own medal.
const TEAM = new Set([
  "Basketball", "Tug of War", "Terompah", "Esports", "Class Choir Battle", "Band", "Dance Group",
  "Battle of Brains", "Business Idea", "English Debate", "Indonesian Debate", "Mandarin Debate",
  "Doubles Badminton", "Mixed Doubles Badminton", "Doubles Table Tennis", "Mixed Doubles Table Tennis",
  "English Newscasting", "Indonesian Newscasting", "Newscasting", "Cinematography",
  "Men's Doubles Badminton", "Scientific Paper", "MonsoonSim",
]);
const SMA = /^(X|XI|XII)(?: (?:MIA|IS))?-\d+$/;

function standings(rows) {
  const medals = []; // { class, result }
  const individual = new Set();
  const teams = new Map(); // "competition|result" → Map(class → member count)
  for (const r of rows) {
    if (!POINTS[r.result]) continue;
    if (TEAM.has(r.competition)) {
      const k = `${r.competition}|${r.result}`;
      const byClass = teams.get(k) ?? new Map();
      byClass.set(r.class, (byClass.get(r.class) ?? 0) + 1);
      teams.set(k, byClass);
    } else {
      const k = `${r.competition}|${r.result}|${r.name}|${r.class}`;
      if (individual.has(k)) continue; // the same row listed twice
      individual.add(k);
      medals.push({ class: r.class, result: r.result });
    }
  }
  for (const [k, byClass] of teams) {
    const result = k.slice(k.lastIndexOf("|") + 1);
    const top = Math.max(...byClass.values());
    // Ties (e.g. two one-row teams from different classes sharing a place) give each class the medal.
    for (const [cls, n] of byClass) if (n === top) medals.push({ class: cls, result });
  }

  const by = new Map();
  for (const m of medals) {
    if (!SMA.test(m.class)) continue;
    const c = by.get(m.class) ?? { class: m.class, gold: 0, silver: 0, bronze: 0, score: 0 };
    c[MEDAL[m.result]]++;
    c.score += POINTS[m.result];
    by.set(m.class, c);
  }
  return [...by.values()].sort(
    (a, b) => b.score - a.score || b.gold - a.gold || b.silver - a.silver || a.class.localeCompare(b.class, "en", { numeric: true }),
  );
}

const out = {};
for (const f of fs.readdirSync(DATA_DIR).sort()) {
  const m = /^(\d{4})\.json$/.exec(f);
  if (!m) continue;
  const table = standings(JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), "utf8")));
  out[m[1]] = table;
  const top = table.slice(0, 3).map((c) => `${c.class} ${c.score}`).join(", ");
  console.log(`class-standings: ${m[1]} → ${table.length} classes; ${top}`);
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + "\n");
console.log(`class-standings: wrote ${path.relative(ROOT, OUT)}`);
