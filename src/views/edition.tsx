import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/gallery";
import { ArrowLeft, ArrowRight, Info } from "@/components/icons";
import { Picture } from "@/components/picture";
import { ClassChampions } from "@/components/class-champions";
import { ChampionsBoard, ParticipantSearch } from "@/components/results";
import { Stat } from "@/components/stat";
import { EDITIONS, SITE, getEdition } from "@/content/editions";
import { GALLERIES } from "@/content/photos";
import { LOCALES, LOCALE_META, href, languageAlternates, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getImage } from "@/lib/images";

export type EditionParams = { params: Promise<{ year: string }> };

export const editionStaticParams = () => EDITIONS.map((e) => ({ year: e.slug }));

export async function editionMetadata(locale: Locale, { params }: EditionParams): Promise<Metadata> {
  const e = getEdition((await params).year);
  if (!e) return {};
  const title = `P2S1 ${e.roman} — ${e.year}`;
  const description = e.copy[locale].summary;
  return {
    title,
    description,
    alternates: { canonical: href(locale, `/${e.slug}`), languages: languageAlternates(`/${e.slug}`) },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: LOCALE_META[locale].og,
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => LOCALE_META[l].og),
      title,
      description,
      images: [{ url: e.og, width: 1200, height: 630 }],
    },
  };
}

export async function EditionPage({ locale, params }: EditionParams & { locale: Locale }) {
  const edition = getEdition((await params).year);
  if (!edition) notFound();
  const e = edition;
  const c = e.copy[locale];
  const t = getDictionary(locale);
  const pg = t.page;
  const idx = EDITIONS.indexOf(e);
  const newer = EDITIONS[idx - 1];
  const older = EDITIONS[idx + 1];
  const galleries = GALLERIES[e.year] ?? [];

  return (
    <div data-edition={e.year}>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="grain relative isolate flex min-h-[78svh] items-end overflow-hidden bg-ink text-on-ink">
        <Picture img={getImage(e.hero)} alt="" sizes="100vw" priority className="absolute inset-0 -z-10" imgClassName="size-full object-cover" objectPosition={e.heroPosition} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/45 to-black/15" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/55 via-black/15 to-transparent" />
        <div className="wrap pb-12 pt-28 sm:pb-16">
          <div className="flex animate-rise items-center gap-4">
            <Picture img={getImage(e.logo)} alt={t.edition.logoAlt(e.roman)} sizes="80px" priority placeholder={false} imgClassName="size-16 rounded-full bg-white/95 object-contain p-1.5 sm:size-20" />
            <div>
              <p className="eyebrow text-gold">
                {t.edition.label(e.number)} · {e.year}
              </p>
              <p className="mt-1 text-sm text-on-ink/80">{c.period}</p>
            </div>
          </div>
          <h1 className="mt-6 animate-rise font-display text-[clamp(3.25rem,11vw,8.5rem)] font-extrabold leading-[0.9] [animation-delay:80ms]">P2S1 {e.roman}</h1>
          {e.theme && c.themeMeaning ? (
            <p className="mt-5 max-w-2xl animate-rise text-xl leading-snug text-on-ink/90 [animation-delay:160ms] sm:text-2xl">
              <span className="font-display font-bold text-gold">&ldquo;{e.theme}&rdquo;</span> — {c.themeMeaning}.
            </p>
          ) : (
            <p className="mt-5 max-w-2xl animate-rise text-xl leading-snug text-on-ink/90 [animation-delay:160ms] sm:text-2xl">{c.tagline}</p>
          )}
          <nav aria-label={pg.onThisPage} className="mt-8 flex animate-rise flex-wrap gap-2 [animation-delay:240ms]">
            {[
              ["#story", pg.story],
              ["#gallery", pg.photos],
              ...(e.results ? [["#champions", t.champions.nav], ["#results", pg.results]] : []),
            ].map(([href, label]) => (
              <a key={href} href={href} className="rounded-full border border-white/25 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white/10">
                {label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* ── Numbers ──────────────────────────────────────────────── */}
      {e.stats && (
        <section aria-label={pg.inNumbers(e.year)} className="wrap py-14 sm:py-20">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            <Stat locale={locale} value={e.stats.participants} label={t.stats.participants} />
            <Stat locale={locale} value={e.stats.competitions} label={t.stats.competitions} />
            <Stat locale={locale} value={e.stats.entries} label={t.stats.entries} />
            <Stat locale={locale} value={e.stats.podium} label={t.stats.podium} />
          </dl>
        </section>
      )}

      {/* ── Story ────────────────────────────────────────────────── */}
      <section id="story" className={`wrap grid gap-10 pb-20 sm:pb-28 lg:grid-cols-[1fr_1.2fr] lg:gap-20 ${e.stats ? "" : "pt-14 sm:pt-20"}`}>
        <div>
          <p className="eyebrow text-accent-ink">{pg.storyEyebrow}</p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl">{t.edition.title(e.number)}</h2>
          {c.finale && (
            <p className="mt-5 inline-flex rounded-full bg-surface-2 px-4 py-2 text-sm font-semibold">
              {pg.finale} · {c.finale}
            </p>
          )}
        </div>
        <div className="space-y-5 text-lg leading-relaxed text-muted">
          {c.story.map((p, i) => (
            <p key={i} className={i === 0 ? "text-xl text-fg" : undefined}>
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* ── Competitions ─────────────────────────────────────────── */}
      {e.categories.length > 0 && (
      <section aria-labelledby="competitions-title" className="bg-surface py-20 sm:py-24">
        <div className="wrap">
          <p className="eyebrow text-accent-ink">{pg.whatWasOn}</p>
          <h2 id="competitions-title" className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            {pg.competitions(e.stats?.competitions ?? e.categories.reduce((n, cat) => n + cat.items.length, 0))}
          </h2>
          <div className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {e.categories.map((cat) => (
              <div key={cat.name.en}>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted">{cat.name[locale]}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <li key={item} className="rounded-full border border-line bg-bg px-3.5 py-1.5 text-sm font-medium">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── Gallery ──────────────────────────────────────────────── */}
      <section id="gallery" aria-label={pg.photos} className="wrap space-y-20 py-20 sm:py-28">
        {galleries.map((g) => (
          <div key={g.id} aria-labelledby={`g-${g.id}`}>
            <div className="mb-8 max-w-2xl">
              <h2 id={`g-${g.id}`} className="font-display text-3xl font-bold sm:text-4xl">
                {g.title[locale]}
              </h2>
              {g.intro && <p className="mt-3 text-lg text-muted">{g.intro[locale]}</p>}
            </div>
            <Gallery
              locale={locale}
              label={g.title[locale]}
              photos={g.photos.map((p) => ({ ...p, caption: p.caption[locale], alt: p.alt[locale], img: getImage(p.key) }))}
            />
          </div>
        ))}
      </section>

      {/* ── Class champions ──────────────────────────────────────── */}
      {e.results && <ClassChampions year={e.year} locale={locale} />}

      {/* ── Results ──────────────────────────────────────────────── */}
      {e.results ? (
      <section id="results" aria-labelledby="results-title" className="border-t border-line bg-surface py-20 sm:py-28">
        <div className="wrap">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow text-accent-ink">{pg.results}</p>
            <h2 id="results-title" className="mt-3 font-display text-4xl font-bold sm:text-5xl">
              {pg.findTitle}
            </h2>
            <p className="mt-4 text-lg text-muted">{e.winnersOnly ? pg.findWinnersText(e.year) : pg.findText(e.year)}</p>
          </div>
          {e.winnersOnly && (
            <aside role="note" aria-label={pg.winnersOnlyTitle} className="mx-auto mt-8 flex max-w-3xl gap-3 rounded-2xl border border-gold/40 bg-gold/10 p-5 text-left text-sm leading-relaxed">
              <Info className="mt-0.5 size-5 shrink-0 text-gold-ink" />
              <span>
                <strong className="block font-semibold text-fg">{pg.winnersOnlyTitle}</strong>
                <span className="text-muted">{pg.winnersOnly(e.roman, e.year)}</span>
              </span>
            </aside>
          )}
          {e.partialEntries && (
            <aside role="note" aria-label={pg.partialTitle} className="mx-auto mt-8 flex max-w-3xl gap-3 rounded-2xl border border-gold/40 bg-gold/10 p-5 text-left text-sm leading-relaxed">
              <Info className="mt-0.5 size-5 shrink-0 text-gold-ink" />
              <span>
                <strong className="block font-semibold text-fg">{pg.partialTitle}</strong>
                <span className="text-muted">{pg.partial(e.roman)}</span>
              </span>
            </aside>
          )}
          <div className="mx-auto mt-10 max-w-3xl">
            <ParticipantSearch year={e.year} locale={locale} />
          </div>

          <div className="mt-24">
            <h3 className="font-display text-3xl font-bold sm:text-4xl">{pg.championsTitle(e.year)}</h3>
            <p className="mb-8 mt-3 text-lg text-muted">{pg.championsText}</p>
            <ChampionsBoard year={e.year} locale={locale} />
          </div>
        </div>
      </section>
      ) : (
        <section id="results" aria-labelledby="results-title" className="border-t border-line bg-surface py-16 sm:py-20">
          <div className="wrap mx-auto max-w-3xl text-center">
            <p className="eyebrow text-accent-ink">{pg.results}</p>
            <h2 id="results-title" className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              {pg.noResultsTitle}
            </h2>
            <p className="mt-4 text-lg text-muted">{pg.noResultsText(e.roman)}</p>
          </div>
        </section>
      )}

      {/* ── Prev / next ──────────────────────────────────────────── */}
      <nav aria-label={pg.otherEditions} className="wrap grid gap-4 py-16 sm:grid-cols-2">
        {older ? (
          <Link href={href(locale, `/${older.slug}`)} className="group rounded-3xl border border-line p-7 transition hover:bg-surface">
            <span className="flex items-center gap-2 text-sm text-muted">
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" /> {pg.previous}
            </span>
            <span className="mt-2 block font-display text-3xl font-bold">
              P2S1 {older.roman} · {older.year}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {newer && (
          <Link href={href(locale, `/${newer.slug}`)} className="group rounded-3xl border border-line p-7 text-right transition hover:bg-surface sm:col-start-2">
            <span className="flex items-center justify-end gap-2 text-sm text-muted">
              {pg.next} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="mt-2 block font-display text-3xl font-bold">
              P2S1 {newer.roman} · {newer.year}
            </span>
          </Link>
        )}
      </nav>
    </div>
  );
}
