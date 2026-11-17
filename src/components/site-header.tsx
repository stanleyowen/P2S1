"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type MouseEvent } from "react";
import { Close, Menu } from "./icons";
import { Picture } from "./picture";
import { LOCALES, LOCALE_META, href, stripLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { Img } from "@/lib/images";

type NavItem = { href: string; label: string; match?: string };

// Each language has its own root layout, so switching is a full page load: a plain <a>.
// The current #section is carried over so "Results" stays "Hasil".
const keepHash = (e: MouseEvent<HTMLAnchorElement>) => {
  if (window.location.hash) e.currentTarget.hash = window.location.hash;
};

function LanguageSwitch({ locale, pathname }: { locale: Locale; pathname: string }) {
  const t = getDictionary(locale).header;
  const path = stripLocale(pathname);
  return (
    <nav aria-label={t.language}>
      <ul className="flex items-center rounded-full border border-line p-0.5 text-xs font-bold">
        {LOCALES.map((l) => (
          <li key={l}>
            <a
              href={href(l, path)}
              hrefLang={l}
              lang={l}
              aria-current={l === locale ? "true" : undefined}
              aria-label={LOCALE_META[l].name}
              onClick={keepHash}
              className="block rounded-full px-2.5 py-1.5 text-muted transition-colors hover:text-fg aria-[current=true]:bg-fg aria-[current=true]:text-bg"
            >
              {LOCALE_META[l].short}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteHeader({ locale, logo, nav }: { locale: Locale; logo: Img; nav: NavItem[] }) {
  const t = getDictionary(locale).header;
  const pathname = usePathname();
  const [openFor, setOpenFor] = useState<string | null>(null);
  // Menu closes automatically on navigation: it is only "open" for the path it was opened on.
  const open = openFor === pathname;

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href={href(locale, "/")} className="group flex items-center gap-3 rounded-full" aria-label={t.homeLabel}>
          <Picture img={logo} alt="" sizes="36px" placeholder={false} imgClassName="size-9 rounded-full bg-white object-contain ring-1 ring-line" />
          <span className="font-display text-lg font-bold tracking-tight">
            P2S1
            <span className="ml-2 hidden font-sans text-sm font-medium text-muted sm:inline">Pekan Prestasi Sutomo 1</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <nav aria-label={t.mainNav} className="hidden md:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => {
                const active = item.match ? pathname.startsWith(item.match) : pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className="rounded-full px-4 py-2 text-sm font-semibold text-muted transition-colors hover:bg-surface-2 hover:text-fg aria-[current=page]:bg-fg aria-[current=page]:text-bg"
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <LanguageSwitch locale={locale} pathname={pathname} />

          <button
            type="button"
            className="-mr-2 grid size-11 place-items-center rounded-full text-fg hover:bg-surface-2 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.closeMenu : t.openMenu}
            onClick={() => setOpenFor(open ? null : pathname)}
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </div>

      <nav id="mobile-nav" aria-label={t.mainNav} hidden={!open} className="border-t border-line/70 md:hidden">
        <ul className="wrap flex flex-col py-3">
          {nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="block rounded-xl px-3 py-3 text-base font-semibold hover:bg-surface-2" onClick={() => setOpenFor(null)}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
