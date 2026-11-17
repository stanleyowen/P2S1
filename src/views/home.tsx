import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Crown } from "@/components/icons";
import { Picture } from "@/components/picture";
import { Stat } from "@/components/stat";
import { COUNTED, EDITIONS, LATEST, LATEST_WITH_RESULTS, SITE, TOTALS } from "@/content/editions";
import { MOMENTS } from "@/content/photos";
import { getStandings } from "@/content/standings";
import { LOCALE_META, href, languageAlternates, type Locale } from "@/i18n/config";
import { formatNumber, getDictionary } from "@/i18n/dictionaries";
import { getImage } from "@/lib/images";

export const homeMetadata = (locale: Locale): Metadata => ({
  title: { absolute: `${SITE.name} (P2S1)` },
  alternates: { canonical: href(locale, "/"), languages: languageAlternates("/") },
});

export function HomePage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const h = t.home;
  const to = (path: string) => href(locale, path);
  const counted = new Intl.ListFormat(LOCALE_META[locale].intl, { type: "conjunction" }).format(
    [...COUNTED].reverse().map((e) => `P2S1 ${e.roman} (${e.year})`),
  );

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="grain relative isolate flex min-h-[calc(100svh-4rem)] items-end overflow-hidden bg-ink text-on-ink">
        <Picture
          img={getImage("2023/celebration")}
          alt={h.heroAlt}
          sizes="100vw"
          priority
          className="absolute inset-0 -z-10"
          imgClassName="size-full object-cover"
          objectPosition="50% 35%"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        <div className="wrap pb-14 pt-32 sm:pb-20">
          <p className="eyebrow animate-rise text-gold">{h.eyebrow}</p>
          <h1 className="mt-5 max-w-5xl animate-rise font-display text-[clamp(2.75rem,9vw,7.5rem)] font-extrabold leading-[0.92] [animation-delay:80ms]">
            Pekan Prestasi <span className="text-gold">Sutomo&nbsp;1</span>
          </h1>
          <p className="mt-6 max-w-xl animate-rise text-lg leading-relaxed text-on-ink/85 [animation-delay:160ms] sm:text-xl">{h.intro}</p>
          <div className="mt-9 flex animate-rise flex-wrap gap-3 [animation-delay:240ms]">
            <Link href={to(`/${LATEST.slug}`)} className="inline-flex h-12 items-center gap-2 rounded-full bg-gold px-6 font-bold text-black transition hover:brightness-110">
              {h.explore(LATEST.year)} <ArrowRight className="size-4" />
            </Link>
            <Link href={to(`/${LATEST_WITH_RESULTS.slug}#results`)} className="inline-flex h-12 items-center rounded-full border border-white/30 px-6 font-bold text-white backdrop-blur transition hover:bg-white/10">
              {h.find}
            </Link>
          </div>
        </div>
      </section>

      {/* ── About ────────────────────────────────────────────────────── */}
      <section id="about" className="wrap grid gap-10 py-20 sm:py-28 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <p className="eyebrow text-gold-ink">{h.aboutEyebrow}</p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">{h.aboutTitle}</h2>
        </div>
        <div className="space-y-5 text-lg leading-relaxed text-muted lg:pt-10">
          <p>
            <strong className="font-semibold text-fg">Pekan Prestasi Sutomo 1</strong>, {h.about1}
          </p>
          <p>{h.about2}</p>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 pt-6">
            <Stat locale={locale} value={TOTALS.competitions} label={t.stats.competitionsHeld} />
            <Stat locale={locale} value={TOTALS.entries} label={t.stats.entries} />
            <Stat locale={locale} value={TOTALS.podium} label={t.stats.podium} />
            <Stat locale={locale} value={EDITIONS.length} label={t.stats.editions} />
          </dl>
          <p className="text-sm">{h.figures(counted)}</p>
        </div>
      </section>

      {/* ── Editions ─────────────────────────────────────────────────── */}
      <section aria-labelledby="editions-title" className="bg-surface py-20 sm:py-28">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-gold-ink">{h.editionsEyebrow}</p>
              <h2 id="editions-title" className="mt-3 font-display text-4xl font-bold sm:text-5xl">
                {h.editionsTitle}
              </h2>
            </div>
          </div>

          <ul className="mt-12 space-y-6">
            {EDITIONS.map((e, i) => {
              const c = e.copy[locale];
              return (
                <li key={e.slug} data-edition={e.year}>
                  <Link
                    href={to(`/${e.slug}`)}
                    className="group grid overflow-hidden rounded-3xl border border-line bg-bg transition hover:border-accent/50 hover:shadow-[0_30px_80px_-40px_rgb(0_0_0/0.35)] md:grid-cols-[1.25fr_1fr]"
                  >
                    <div className={`relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[26rem] ${i % 2 ? "md:order-2" : ""}`}>
                      <Picture
                        img={getImage(e.hero)}
                        alt=""
                        sizes="(min-width: 768px) 55vw, 100vw"
                        className="absolute inset-0"
                        imgClassName="size-full object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-[1.03]"
                        objectPosition={e.heroPosition}
                      />
                    </div>
                    <div className="flex flex-col justify-between gap-8 p-7 sm:p-10">
                      <div>
                        <div className="flex items-center gap-4">
                          <Picture img={getImage(e.logo)} alt={t.edition.logoAlt(e.roman)} sizes="64px" placeholder={false} imgClassName="size-16 object-contain" />
                          <div>
                            <p className="eyebrow text-accent-ink">{t.edition.label(e.number)}</p>
                            <p className="text-sm text-muted">{c.period}</p>
                          </div>
                        </div>
                        <h3 className="mt-6 font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
                          P2S1 {e.roman}
                          <span className="ml-3 text-muted/60">{e.year}</span>
                        </h3>
                        {e.theme && (
                          <p className="mt-3 text-lg">
                            {t.edition.theme}: <span className="font-semibold text-accent-ink">{e.theme}</span>
                          </p>
                        )}
                        <p className="mt-4 leading-relaxed text-muted">{c.summary}</p>
                      </div>
                      <div className="flex flex-wrap items-end justify-between gap-6">
                        {e.stats ? (
                          <dl className="flex gap-8">
                            <Stat locale={locale} size="md" value={e.stats.participants} label={t.stats.participants} />
                            <Stat locale={locale} size="md" value={e.stats.competitions} label={t.stats.competitions} />
                          </dl>
                        ) : (
                          <span />
                        )}
                        <span className="inline-flex items-center gap-2 font-bold text-accent-ink">
                          {t.edition.explore(e.year)} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── Class champions ──────────────────────────────────────────── */}
      <section aria-labelledby="class-champions-title" className="wrap py-20 sm:py-28">
        <p className="eyebrow text-gold-ink">{t.champions.eyebrow}</p>
        <h2 id="class-champions-title" className="mt-3 font-display text-4xl font-bold sm:text-5xl">
          {t.champions.homeTitle}
        </h2>
        <p className="mt-3 max-w-xl text-lg text-muted">{t.champions.homeText}</p>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {EDITIONS.filter((e) => e.results && getStandings(e.year).length > 0).map((e) => {
            const [champ, ...chasers] = getStandings(e.year);
            if (!champ) return null;
            return (
              <li key={e.slug}>
                <Link
                  href={to(`/${e.slug}#champions`)}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-ink p-7 text-on-ink transition hover:-translate-y-1 hover:shadow-[0_30px_70px_-35px_var(--gold)]"
                >
                  <div aria-hidden className="absolute -right-16 -top-16 size-56 rounded-full bg-gold/25 blur-3xl transition-opacity group-hover:opacity-80" />
                  <div className="flex items-center justify-between">
                    <p className="eyebrow text-gold">
                      P2S1 {e.roman} · {e.year}
                    </p>
                    <span className="grid size-9 place-items-center rounded-full bg-gold text-black">
                      <Crown className="size-4" />
                    </span>
                  </div>
                  <p className="mt-8 font-display text-5xl font-extrabold tracking-tight">{champ.class}</p>
                  <p className="mt-2 font-display text-2xl font-bold tabular-nums text-gold">
                    {formatNumber(locale, champ.score)} <span className="text-base font-semibold text-on-ink-muted">{t.champions.pts}</span>
                  </p>
                  <p className="mt-3 flex gap-3 text-sm font-semibold tabular-nums" aria-label={t.champions.medals(champ.gold, champ.silver, champ.bronze)}>
                    <span aria-hidden className="inline-flex items-center gap-1"><span className="size-2.5 rounded-full bg-gold" />{champ.gold}</span>
                    <span aria-hidden className="inline-flex items-center gap-1"><span className="size-2.5 rounded-full bg-silver" />{champ.silver}</span>
                    <span aria-hidden className="inline-flex items-center gap-1"><span className="size-2.5 rounded-full bg-bronze" />{champ.bronze}</span>
                  </p>
                  <ol start={2} className="mt-6 space-y-1 border-t border-white/10 pt-4 text-sm text-on-ink-muted">
                    {chasers.slice(0, 2).map((c, i) => (
                      <li key={c.class} className="flex justify-between tabular-nums">
                        <span>
                          {i + 2}. {c.class}
                        </span>
                        <span>{formatNumber(locale, c.score)}</span>
                      </li>
                    ))}
                  </ol>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-gold">
                    {t.champions.view(e.year)} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ── Moments ──────────────────────────────────────────────────── */}
      <section aria-labelledby="moments-title" className="py-20 sm:py-28">
        <div className="wrap">
          <p className="eyebrow text-gold-ink">{h.momentsEyebrow}</p>
          <h2 id="moments-title" className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            {h.momentsTitle}
          </h2>
        </div>
        <ul className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 sm:gap-4 sm:px-6 lg:px-[max(2rem,calc((100vw_-_80rem)/2_+_2rem))]">
          {MOMENTS.map((m) => {
            const img = getImage(m.key);
            const portrait = img.height > img.width;
            return (
              <li key={m.key} className="shrink-0 snap-start">
                <Link href={to(`/${m.year}#gallery`)} className="group block">
                  <div className={`overflow-hidden rounded-2xl ${portrait ? "h-80 w-56 sm:h-96 sm:w-64" : "h-80 w-[28rem] max-w-[85vw] sm:h-96 sm:w-[34rem]"}`}>
                    <Picture img={img} alt={m.alt[locale]} sizes={portrait ? "256px" : "(min-width: 640px) 544px, 85vw"} imgClassName="size-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]" />
                  </div>
                  <p className="mt-3 flex items-baseline gap-2 text-sm">
                    <span className="font-semibold">{m.caption[locale]}</span>
                    <span className="text-muted">{m.year}</span>
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ── Results CTA ──────────────────────────────────────────────── */}
      <section className="wrap pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-ink px-7 py-14 text-on-ink sm:px-14 sm:py-20">
          <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full bg-gold/25 blur-3xl" />
          <p className="eyebrow text-gold">{h.resultsEyebrow}</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold sm:text-5xl">{h.resultsTitle}</h2>
          <p className="mt-4 max-w-xl text-on-ink-muted">{h.resultsText}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {EDITIONS.filter((e) => e.results).map((e) => (
              <Link key={e.slug} href={to(`/${e.slug}#results`)} className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 font-bold text-black transition hover:bg-gold">
                {h.resultsLink(e.year)} <ArrowRight className="size-4" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
