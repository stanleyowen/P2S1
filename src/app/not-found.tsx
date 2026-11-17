import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="wrap flex min-h-[70svh] flex-col items-start justify-center py-24">
      <p className="eyebrow text-gold-ink">404</p>
      <h1 className="mt-4 font-display text-5xl font-extrabold sm:text-7xl">No podium here.</h1>
      <p className="mt-5 max-w-lg text-lg text-muted">The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.</p>
      <Link href="/" className="mt-8 inline-flex h-12 items-center rounded-full bg-fg px-6 font-bold text-bg">
        Back to home
      </Link>
    </section>
  );
}
