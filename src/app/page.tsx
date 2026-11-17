import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { Picture } from "@/components/picture";
import { Stat } from "@/components/stat";
import { EDITIONS, SITE, TOTALS } from "@/content/editions";
import { MOMENTS } from "@/content/photos";
import { getImage } from "@/lib/images";

export default function Home() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="grain relative isolate flex min-h-[calc(100svh-4rem)] items-end overflow-hidden bg-ink text-on-ink">
        <Picture
          img={getImage("2023/celebration")}
          alt="Students in traditional costume cheer as a trophy is lifted on stage at the P2S1 finale"
          sizes="100vw"
          priority
          className="absolute inset-0 -z-10"
          imgClassName="size-full object-cover"
          objectPosition="50% 35%"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        <div className="wrap pb-14 pt-32 sm:pb-20">
          <p className="eyebrow animate-rise text-gold">The annual competition week of SMA Sutomo 1 Medan</p>
          <h1 className="mt-5 max-w-5xl animate-rise font-display text-[clamp(2.75rem,9vw,7.5rem)] font-extrabold leading-[0.92] [animation-delay:80ms]">
            Pekan Prestasi <span className="text-gold">Sutomo&nbsp;1</span>
          </h1>
          <p className="mt-6 max-w-xl animate-rise text-lg leading-relaxed text-on-ink/85 [animation-delay:160ms] sm:text-xl">
            Twenty-seven editions of students competing in olympiads, debates, the arts and sport. This is the archive — the photos, the numbers and the results.
          </p>
          <div className="mt-9 flex animate-rise flex-wrap gap-3 [animation-delay:240ms]">
            <Link href="/2024" className="inline-flex h-12 items-center gap-2 rounded-full bg-gold px-6 font-bold text-black transition hover:brightness-110">
              Explore P2S1 2024 <ArrowRight className="size-4" />
            </Link>
            <Link href="/2024#results" className="inline-flex h-12 items-center rounded-full border border-white/30 px-6 font-bold text-white backdrop-blur transition hover:bg-white/10">
              Find a participant
            </Link>
          </div>
        </div>
      </section>

      {/* ── About ────────────────────────────────────────────────────── */}
      <section id="about" className="wrap grid gap-10 py-20 sm:py-28 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <p className="eyebrow text-gold-ink">About P2S1</p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
            Show what you can do — in class, on stage, on the court.
          </h2>
        </div>
        <div className="space-y-5 text-lg leading-relaxed text-muted lg:pt-10">
          <p>
            <strong className="font-semibold text-fg">Pekan Prestasi Sutomo 1</strong>, often called P2S1, is an annual competition event held by the student council of SMA Sutomo 1 for students from grade 10 to 12.
          </p>
          <p>
            Students are encouraged to show and develop their potential in both academic and non-academic fields — building creativity and the skills they&rsquo;ll need for the future.
          </p>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 pt-6">
            <Stat value={TOTALS.competitions} label="Competitions held" />
            <Stat value={TOTALS.entries} label="Entries" />
            <Stat value={TOTALS.podium} label="Podium finishes" />
            <Stat value={EDITIONS.length} label="Editions archived" />
          </dl>
          <p className="text-sm">Figures cover P2S1 XXVI (2023) and XXVII (2024).</p>
        </div>
      </section>

      {/* ── Editions ─────────────────────────────────────────────────── */}
      <section aria-labelledby="editions-title" className="bg-surface py-20 sm:py-28">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-gold-ink">Editions</p>
              <h2 id="editions-title" className="mt-3 font-display text-4xl font-bold sm:text-5xl">
                Every year, a new chapter
              </h2>
            </div>
          </div>

          <ul className="mt-12 space-y-6">
            {EDITIONS.map((e, i) => (
              <li key={e.slug} data-edition={e.year}>
                <Link
                  href={`/${e.slug}`}
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
                        <Picture img={getImage(e.logo)} alt={`P2S1 ${e.roman} logo`} sizes="64px" placeholder={false} imgClassName="size-16 object-contain" />
                        <div>
                          <p className="eyebrow text-accent-ink">{e.ordinal} edition</p>
                          <p className="text-sm text-muted">{e.period}</p>
                        </div>
                      </div>
                      <h3 className="mt-6 font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
                        P2S1 {e.roman}
                        <span className="ml-3 text-muted/60">{e.year}</span>
                      </h3>
                      {e.theme && (
                        <p className="mt-3 text-lg">
                          Theme: <span className="font-semibold text-accent-ink">{e.theme.word}</span>
                        </p>
                      )}
                      <p className="mt-4 leading-relaxed text-muted">{e.summary}</p>
                    </div>
                    <div className="flex flex-wrap items-end justify-between gap-6">
                      <dl className="flex gap-8">
                        <Stat size="md" value={e.stats.participants} label="Participants" />
                        <Stat size="md" value={e.stats.competitions} label="Competitions" />
                      </dl>
                      <span className="inline-flex items-center gap-2 font-bold text-accent-ink">
                        Explore {e.year} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Moments ──────────────────────────────────────────────────── */}
      <section aria-labelledby="moments-title" className="py-20 sm:py-28">
        <div className="wrap">
          <p className="eyebrow text-gold-ink">Moments</p>
          <h2 id="moments-title" className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            From the court to the stage
          </h2>
        </div>
        <ul className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 sm:gap-4 sm:px-6 lg:px-[max(2rem,calc((100vw_-_80rem)/2_+_2rem))]">
          {MOMENTS.map((m) => {
            const img = getImage(m.key);
            const portrait = img.height > img.width;
            return (
              <li key={m.key} className="shrink-0 snap-start">
                <Link href={`/${m.year}#gallery`} className="group block">
                  <div className={`overflow-hidden rounded-2xl ${portrait ? "h-80 w-56 sm:h-96 sm:w-64" : "h-80 w-[28rem] max-w-[85vw] sm:h-96 sm:w-[34rem]"}`}>
                    <Picture img={img} alt={m.alt} sizes={portrait ? "256px" : "(min-width: 640px) 544px, 85vw"} imgClassName="size-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]" />
                  </div>
                  <p className="mt-3 flex items-baseline gap-2 text-sm">
                    <span className="font-semibold">{m.caption}</span>
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
          <p className="eyebrow text-gold">Results</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold sm:text-5xl">Took part? Find your results.</h2>
          <p className="mt-4 max-w-xl text-on-ink-muted">Search by name or class, and browse the champions of every competition.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {EDITIONS.map((e) => (
              <Link key={e.slug} href={`/${e.slug}#results`} className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 font-bold text-black transition hover:bg-gold">
                {e.year} results <ArrowRight className="size-4" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export const metadata = { title: { absolute: `${SITE.name} (P2S1)` } };
