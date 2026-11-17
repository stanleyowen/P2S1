import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/gallery";
import { ArrowLeft, ArrowRight } from "@/components/icons";
import { Picture } from "@/components/picture";
import { ChampionsBoard, ParticipantSearch } from "@/components/results";
import { Stat } from "@/components/stat";
import { EDITIONS, getEdition } from "@/content/editions";
import { GALLERIES } from "@/content/photos";
import { getImage } from "@/lib/images";

type Props = { params: Promise<{ year: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => EDITIONS.map((e) => ({ year: e.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = getEdition((await params).year);
  if (!e) return {};
  const title = `P2S1 ${e.roman} — ${e.year}`;
  return {
    title,
    description: e.summary,
    alternates: { canonical: `/${e.slug}` },
    openGraph: { title, description: e.summary, images: [{ url: e.og, width: 1200, height: 630 }] },
  };
}

export default async function EditionPage({ params }: Props) {
  const edition = getEdition((await params).year);
  if (!edition) notFound();
  const e = edition;
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
            <Picture img={getImage(e.logo)} alt={`P2S1 ${e.roman} logo`} sizes="80px" priority placeholder={false} imgClassName="size-16 rounded-full bg-white/95 object-contain p-1.5 sm:size-20" />
            <div>
              <p className="eyebrow text-gold">
                {e.ordinal} edition · {e.year}
              </p>
              <p className="mt-1 text-sm text-on-ink/80">{e.period}</p>
            </div>
          </div>
          <h1 className="mt-6 animate-rise font-display text-[clamp(3.25rem,11vw,8.5rem)] font-extrabold leading-[0.9] [animation-delay:80ms]">P2S1 {e.roman}</h1>
          {e.theme ? (
            <p className="mt-5 max-w-2xl animate-rise text-xl leading-snug text-on-ink/90 [animation-delay:160ms] sm:text-2xl">
              <span className="font-display font-bold text-gold">&ldquo;{e.theme.word}&rdquo;</span> — {e.theme.meaning}.
            </p>
          ) : (
            <p className="mt-5 max-w-2xl animate-rise text-xl leading-snug text-on-ink/90 [animation-delay:160ms] sm:text-2xl">{e.tagline}</p>
          )}
          <nav aria-label="On this page" className="mt-8 flex animate-rise flex-wrap gap-2 [animation-delay:240ms]">
            {[
              ["#story", "Story"],
              ["#gallery", "Photos"],
              ["#results", "Results"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="rounded-full border border-white/25 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white/10">
                {label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* ── Numbers ──────────────────────────────────────────────── */}
      <section aria-label={`${e.year} in numbers`} className="wrap py-14 sm:py-20">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          <Stat value={e.stats.participants} label="Participants" />
          <Stat value={e.stats.competitions} label="Competitions" />
          <Stat value={e.stats.entries} label="Entries" />
          <Stat value={e.stats.podium} label="Podium finishes" />
        </dl>
      </section>

      {/* ── Story ────────────────────────────────────────────────── */}
      <section id="story" className="wrap grid gap-10 pb-20 sm:pb-28 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div>
          <p className="eyebrow text-accent-ink">The story</p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl">
            The {e.ordinal} Pekan Prestasi Sutomo 1
          </h2>
          {e.finale && <p className="mt-5 inline-flex rounded-full bg-surface-2 px-4 py-2 text-sm font-semibold">Finale · {e.finale}</p>}
        </div>
        <div className="space-y-5 text-lg leading-relaxed text-muted">
          {e.story.map((p, i) => (
            <p key={i} className={i === 0 ? "text-xl text-fg" : undefined}>
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* ── Competitions ─────────────────────────────────────────── */}
      <section aria-labelledby="competitions-title" className="bg-surface py-20 sm:py-24">
        <div className="wrap">
          <p className="eyebrow text-accent-ink">What was on</p>
          <h2 id="competitions-title" className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            {e.stats.competitions} competitions
          </h2>
          <div className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {e.categories.map((c) => (
              <div key={c.name}>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted">{c.name}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {c.items.map((item) => (
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

      {/* ── Gallery ──────────────────────────────────────────────── */}
      <section id="gallery" aria-label="Photos" className="wrap space-y-20 py-20 sm:py-28">
        {galleries.map((g) => (
          <div key={g.id} aria-labelledby={`g-${g.id}`}>
            <div className="mb-8 max-w-2xl">
              <h2 id={`g-${g.id}`} className="font-display text-3xl font-bold sm:text-4xl">
                {g.title}
              </h2>
              {g.intro && <p className="mt-3 text-lg text-muted">{g.intro}</p>}
            </div>
            <Gallery label={g.title} photos={g.photos.map((p) => ({ ...p, img: getImage(p.key) }))} />
          </div>
        ))}
      </section>

      {/* ── Results ──────────────────────────────────────────────── */}
      <section id="results" aria-labelledby="results-title" className="border-t border-line bg-surface py-20 sm:py-28">
        <div className="wrap">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow text-accent-ink">Results</p>
            <h2 id="results-title" className="mt-3 font-display text-4xl font-bold sm:text-5xl">
              Find a participant
            </h2>
            <p className="mt-4 text-lg text-muted">Search the {e.year} entries by name or class.</p>
          </div>
          <div className="mx-auto mt-10 max-w-3xl">
            <ParticipantSearch year={e.year} />
          </div>

          <div className="mt-24">
            <h3 className="font-display text-3xl font-bold sm:text-4xl">Champions of {e.year}</h3>
            <p className="mb-8 mt-3 text-lg text-muted">The top three of every competition.</p>
            <ChampionsBoard year={e.year} />
          </div>
        </div>
      </section>

      {/* ── Prev / next ──────────────────────────────────────────── */}
      <nav aria-label="Other editions" className="wrap grid gap-4 py-16 sm:grid-cols-2">
        {older ? (
          <Link href={`/${older.slug}`} className="group rounded-3xl border border-line p-7 transition hover:bg-surface">
            <span className="flex items-center gap-2 text-sm text-muted">
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" /> Previous edition
            </span>
            <span className="mt-2 block font-display text-3xl font-bold">
              P2S1 {older.roman} · {older.year}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {newer && (
          <Link href={`/${newer.slug}`} className="group rounded-3xl border border-line p-7 text-right transition hover:bg-surface sm:col-start-2">
            <span className="flex items-center justify-end gap-2 text-sm text-muted">
              Next edition <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
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
