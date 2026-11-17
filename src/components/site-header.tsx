"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Close, Menu } from "./icons";
import { Picture } from "./picture";
import type { Img } from "@/lib/images";

type NavItem = { href: string; label: string; match?: string };

export function SiteHeader({ logo, nav }: { logo: Img; nav: NavItem[] }) {
  const pathname = usePathname();
  const [openFor, setOpenFor] = useState<string | null>(null);
  // Menu closes automatically on navigation: it is only "open" for the path it was opened on.
  const open = openFor === pathname;

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3 rounded-full" aria-label="P2S1 — home">
          <Picture img={logo} alt="" sizes="36px" placeholder={false} imgClassName="size-9 rounded-full bg-white object-contain ring-1 ring-line" />
          <span className="font-display text-lg font-bold tracking-tight">
            P2S1
            <span className="ml-2 hidden font-sans text-sm font-medium text-muted sm:inline">Pekan Prestasi Sutomo 1</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
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

        <button
          type="button"
          className="-mr-2 grid size-11 place-items-center rounded-full text-fg hover:bg-surface-2 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpenFor(open ? null : pathname)}
        >
          {open ? <Close /> : <Menu />}
        </button>
      </div>

      <nav id="mobile-nav" aria-label="Main" hidden={!open} className="border-t border-line/70 md:hidden">
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
