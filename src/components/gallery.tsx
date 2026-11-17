"use client";

import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight, Close, Expand } from "./icons";
import { Picture } from "./picture";
import type { Img } from "@/lib/images";

export type GalleryPhoto = { key: string; img: Img; caption: string; alt: string; wide?: boolean; tall?: boolean };

export function Gallery({ photos, label }: { photos: GalleryPhoto[]; label: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const swipeX = useRef<number | null>(null);
  const [index, setIndex] = useState(0);

  const open = (i: number, el: HTMLButtonElement) => {
    opener.current = el;
    setIndex(i);
    dialog.current?.showModal();
  };
  const step = useCallback((d: number) => setIndex((i) => (i + d + photos.length) % photos.length), [photos.length]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
  };
  const onPointerDown = (e: PointerEvent) => {
    swipeX.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (swipeX.current === null) return;
    const dx = e.clientX - swipeX.current;
    swipeX.current = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  };

  const current = photos[index];

  return (
    <>
      <ul className="grid grid-flow-dense auto-rows-[9.5rem] grid-cols-2 gap-2 sm:auto-rows-[12rem] sm:gap-3 md:grid-cols-3 lg:auto-rows-[14rem] lg:grid-cols-4">
        {photos.map((p, i) => (
          <li key={p.key} className={`${p.wide ? "col-span-2" : ""} ${p.tall ? "row-span-2" : ""}`}>
            <button
              type="button"
              onClick={(e) => open(i, e.currentTarget)}
              className="group relative block size-full overflow-hidden rounded-2xl bg-surface-2"
              aria-label={`${p.caption} — open photo ${i + 1} of ${photos.length}`}
            >
              <Picture
                img={p.img}
                alt={p.alt}
                sizes={p.wide ? "(min-width: 1024px) 40vw, (min-width: 768px) 66vw, 100vw" : "(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"}
                imgClassName="size-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 pt-10 text-left text-sm font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 pointer-coarse:opacity-100">
                <span>{p.caption}</span>
                <Expand className="size-4 shrink-0 opacity-80" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label={`${label} — photo viewer`}
        onKeyDown={onKey}
        onClose={() => opener.current?.focus()}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-black/95 p-0 text-white backdrop:bg-black/80"
      >
        {current && (
          <div className="flex h-full flex-col" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
            <div className="flex items-center justify-between p-3 sm:p-4">
              <p className="text-sm tabular-nums text-white/70" aria-live="polite">
                {index + 1} / {photos.length}
              </p>
              <button type="button" onClick={() => dialog.current?.close()} className="grid size-11 place-items-center rounded-full hover:bg-white/10" aria-label="Close photo viewer" autoFocus>
                <Close />
              </button>
            </div>
            <figure className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-3 pb-4 sm:px-16">
              <Picture key={current.key} img={current.img} alt={current.alt} sizes="100vw" className="contents" imgClassName="max-h-[78dvh] w-auto max-w-full rounded-lg object-contain animate-rise" />
              <figcaption className="text-center text-base font-semibold">{current.caption}</figcaption>
            </figure>
            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between px-3 sm:flex">
              <button type="button" onClick={() => step(-1)} className="pointer-events-auto grid size-12 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Previous photo">
                <ArrowLeft />
              </button>
              <button type="button" onClick={() => step(1)} className="pointer-events-auto grid size-12 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Next photo">
                <ArrowRight />
              </button>
            </div>
            <div className="flex justify-center gap-3 pb-6 sm:hidden">
              <button type="button" onClick={() => step(-1)} className="grid size-12 place-items-center rounded-full bg-white/10" aria-label="Previous photo">
                <ArrowLeft />
              </button>
              <button type="button" onClick={() => step(1)} className="grid size-12 place-items-center rounded-full bg-white/10" aria-label="Next photo">
                <ArrowRight />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
