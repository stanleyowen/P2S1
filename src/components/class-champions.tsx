// Class championship (juara umum): podium, best class per grade and the full standings.
// Server-rendered; the only motion is CSS (rise-in, grow-x), so there is no client JS here.
import { GRADES, gradeOf, getStandings, type ClassStanding } from "@/content/standings";
import type { Locale } from "@/i18n/config";
import { formatNumber, getDictionary, type Dictionary } from "@/i18n/dictionaries";
import { Crown } from "./icons";

const VISIBLE = 10;

const TIER = {
  1: { ring: "ring-gold/60", text: "text-gold", step: "from-gold via-gold/70 to-gold/25 h-40 sm:h-48", glow: "shadow-[0_0_80px_-10px_var(--gold)]" },
  2: { ring: "ring-silver/50", text: "text-silver", step: "from-silver via-silver/60 to-silver/20 h-28 sm:h-32", glow: "" },
  3: { ring: "ring-bronze/50", text: "text-bronze", step: "from-bronze via-bronze/60 to-bronze/20 h-20 sm:h-24", glow: "" },
} as const;

function Medals({ c, t, locale, tone = "ink" }: { c: ClassStanding; t: Dictionary["champions"]; locale: Locale; tone?: "ink" | "page" }) {
  const label = tone === "ink" ? "text-on-ink" : "text-fg";
  return (
    <span className="inline-flex items-center gap-2.5 text-sm tabular-nums" aria-label={t.medals(c.gold, c.silver, c.bronze)}>
      {(
        [
          ["bg-gold", c.gold],
          ["bg-silver", c.silver],
          ["bg-bronze", c.bronze],
        ] as const
      ).map(([bg, n]) => (
        <span key={bg} aria-hidden className={`inline-flex items-center gap-1 font-semibold ${label}`}>
          <span className={`size-2.5 rounded-full ${bg}`} />
          {formatNumber(locale, n)}
        </span>
      ))}
    </span>
  );
}

function PodiumStep({ c, place, t, locale }: { c: ClassStanding; place: 1 | 2 | 3; t: Dictionary["champions"]; locale: Locale }) {
  const tier = TIER[place];
  const order = place === 1 ? "sm:order-2" : place === 2 ? "sm:order-1" : "sm:order-3";
  return (
    <li className={`rise-in flex flex-col ${order}`}>
      <div className={`relative rounded-3xl bg-white/[0.06] p-6 text-center ring-1 backdrop-blur ${tier.ring} ${tier.glow}`}>
        {place === 1 && (
          <span className="absolute -top-5 left-1/2 grid size-10 -translate-x-1/2 place-items-center rounded-full bg-gold text-black shadow-lg">
            <Crown className="size-5" />
          </span>
        )}
        <p className={`eyebrow ${tier.text}`}>{place === 1 ? t.champion : t.place(place)}</p>
        <p className={`mt-3 font-display font-extrabold leading-none tracking-tight ${place === 1 ? "text-5xl sm:text-6xl" : "text-4xl sm:text-5xl"}`}>{c.class}</p>
        <p className="mt-4 font-display text-3xl font-bold tabular-nums">
          {formatNumber(locale, c.score)}
          <span className="ml-1 text-base font-semibold text-on-ink-muted">{t.pts}</span>
        </p>
        <div className="mt-4 flex justify-center">
          <Medals c={c} t={t} locale={locale} />
        </div>
      </div>
      <div aria-hidden className={`mx-4 mt-3 hidden rounded-t-2xl bg-gradient-to-b sm:grid sm:place-items-center ${tier.step}`}>
        <span className="font-display text-6xl font-extrabold text-black/25">{place}</span>
      </div>
    </li>
  );
}

function Row({ c, rank, top, t, locale }: { c: ClassStanding; rank: number; top: number; t: Dictionary["champions"]; locale: Locale }) {
  const pct = (n: number) => `${((n / top) * 100).toFixed(2)}%`;
  return (
    <li className="grid grid-cols-[2.25rem_minmax(6.5rem,8rem)_1fr_auto] items-center gap-3 py-2.5 sm:gap-5">
      <span className="text-right font-display text-lg font-bold tabular-nums text-on-ink-muted">{rank}</span>
      <span className="font-semibold">{c.class}</span>
      <span className="flex h-3 overflow-hidden rounded-full bg-white/[0.07]" aria-label={t.medals(c.gold, c.silver, c.bronze)}>
        <span className="grow-x flex h-full" style={{ width: pct(c.score) }}>
          <span className="h-full bg-gold" style={{ width: `${((c.gold * 15) / c.score) * 100}%` }} />
          <span className="h-full bg-silver" style={{ width: `${((c.silver * 10) / c.score) * 100}%` }} />
          <span className="h-full bg-bronze" style={{ width: `${((c.bronze * 5) / c.score) * 100}%` }} />
        </span>
      </span>
      <span className="w-14 text-right font-display text-lg font-bold tabular-nums">{formatNumber(locale, c.score)}</span>
    </li>
  );
}

export function ClassChampions({ year, locale }: { year: number; locale: Locale }) {
  const table = getStandings(year);
  if (table.length < 3) return null;
  const t = getDictionary(locale).champions;
  const [first, second, third] = table as [ClassStanding, ClassStanding, ClassStanding];
  const top = first.score;
  const rest = table.slice(3);
  const bestByGrade = GRADES.map((g) => [g, table.find((c) => gradeOf(c.class) === g)] as const).filter(
    (x): x is readonly [(typeof GRADES)[number], ClassStanding] => !!x[1],
  );

  return (
    <section id="champions" aria-labelledby="champions-title" className="grain relative isolate overflow-hidden bg-ink py-20 text-on-ink sm:py-28">
      <div aria-hidden className="absolute left-1/2 top-24 -z-10 size-[42rem] -translate-x-1/2 rounded-full bg-gold/20 blur-[120px]" />
      <div className="wrap">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-gold">{t.eyebrow}</p>
          <h2 id="champions-title" className="mt-3 font-display text-4xl font-bold sm:text-6xl">
            {t.title(year)}
          </h2>
          <p className="mt-4 text-lg text-on-ink-muted">{t.intro}</p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2 text-sm font-semibold" aria-label={t.scoring}>
            {(
              [
                ["bg-gold text-black", t.gold, 15],
                ["bg-silver text-black", t.silver, 10],
                ["bg-bronze text-white", t.bronze, 5],
              ] as const
            ).map(([cls, label, pts]) => (
              <li key={label} className={`rounded-full px-3.5 py-1.5 ${cls}`}>
                {label} +{pts}
              </li>
            ))}
          </ul>
        </div>

        {/* Podium: 2 · 1 · 3 on wide screens, 1 · 2 · 3 stacked on phones. */}
        <ol aria-label={t.podium} className="mx-auto mt-16 grid max-w-5xl items-end gap-6 sm:grid-cols-3 sm:gap-5">
          <PodiumStep c={first} place={1} t={t} locale={locale} />
          <PodiumStep c={second} place={2} t={t} locale={locale} />
          <PodiumStep c={third} place={3} t={t} locale={locale} />
        </ol>
        {first.score === second.score && <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-on-ink-muted">{t.tie(first.class, second.class)}</p>}

        {/* Best class in each grade */}
        <div className="mx-auto mt-16 max-w-5xl">
          <h3 className="eyebrow text-center text-gold">{t.gradeTitle}</h3>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {bestByGrade.map(([g, c]) => (
              <li key={g} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm text-on-ink-muted">{t.grade(g)}</p>
                <p className="mt-1 flex items-baseline justify-between gap-3">
                  <span className="font-display text-2xl font-bold">{c.class}</span>
                  <span className="font-display text-xl font-bold tabular-nums text-gold">
                    {formatNumber(locale, c.score)} <span className="text-sm font-semibold text-on-ink-muted">{t.pts}</span>
                  </span>
                </p>
                <div className="mt-3">
                  <Medals c={c} t={t} locale={locale} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Full standings */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h3 className="eyebrow text-center text-gold">{t.tableTitle}</h3>
          <ol start={4} className="mt-5 divide-y divide-white/[0.06]">
            {rest.slice(0, VISIBLE - 3).map((c, i) => (
              <Row key={c.class} c={c} rank={i + 4} top={top} t={t} locale={locale} />
            ))}
          </ol>
          {rest.length > VISIBLE - 3 && (
            <details className="group">
              <summary className="mx-auto mt-4 flex w-fit cursor-pointer list-none items-center rounded-full border border-white/15 px-5 py-2.5 text-sm font-bold transition hover:bg-white/10 marker:hidden">
                <span className="group-open:hidden">{t.showAll(table.length)}</span>
                <span className="hidden group-open:inline">{t.showFewer}</span>
              </summary>
              <ol start={VISIBLE + 1} className="mt-2 divide-y divide-white/[0.06]">
                {rest.slice(VISIBLE - 3).map((c, i) => (
                  <Row key={c.class} c={c} rank={i + VISIBLE + 1} top={top} t={t} locale={locale} />
                ))}
              </ol>
            </details>
          )}
          <p className="mt-8 text-center text-xs leading-relaxed text-on-ink-muted">{t.source}</p>
        </div>
      </div>
    </section>
  );
}
