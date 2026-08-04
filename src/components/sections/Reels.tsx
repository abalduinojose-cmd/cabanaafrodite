"use client";

import { Instagram, Play } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CONTACT, REELS } from "@/data/content";
import { cx } from "@/lib/cx";

const HEADING_ID = "titulo-reels";

/**
 * Nada roda sozinho: o `<video>` entra com `preload="none"` e só busca os
 * bytes quando o hóspede toca no play. Antes disso o que aparece é o
 * poster, que é uma imagem comum e otimizada.
 */
function Reel({ item, index }: { readonly item: (typeof REELS.items)[number]; readonly index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [tocando, setTocando] = useState(false);

  const tocar = useCallback((): void => {
    const node = videoRef.current;
    if (!node) return;
    setTocando(true);
    void node.play();
  }, []);

  return (
    <Reveal
      as="li"
      delay={index * 0.08}
      className="w-[62vw] max-w-[15rem] shrink-0 snap-start sm:w-[15rem] lg:w-auto lg:max-w-none"
    >
      <figure className="cartao cartao-vivo group relative overflow-hidden !rounded-[1.5rem] p-0">
        <div className="relative aspect-9/16 bg-noite">
          <video
            ref={videoRef}
            src={item.src}
            poster={item.poster}
            preload="none"
            playsInline
            controls={tocando}
            onPause={() => setTocando(false)}
            className={cx(
              "size-full object-cover transition-opacity duration-500",
              tocando ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          />

          {/* Capa: some quando o vídeo começa */}
          <div
            aria-hidden={tocando}
            className={cx(
              "absolute inset-0 transition-opacity duration-500",
              tocando && "pointer-events-none opacity-0",
            )}
          >
            <Image
              src={item.poster}
              alt=""
              fill
              sizes="(min-width: 1024px) 24rem, (min-width: 640px) 44vw, 88vw"
              className="object-cover"
            />
            <span aria-hidden className="veu-foto absolute inset-0" />

            <button
              type="button"
              onClick={tocar}
              aria-label={REELS.playLabel(item.credito)}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="inline-flex size-16 items-center justify-center rounded-full border border-branco/40 bg-branco/15 text-branco backdrop-blur-md transition-all duration-300 ease-serra group-hover:scale-110 group-hover:border-transparent group-hover:bg-linear-115 group-hover:from-cafe-quente group-hover:via-cafe group-hover:to-cafe-deep">
                <Play className="ml-0.5 size-6 fill-current" strokeWidth={0} aria-hidden />
              </span>
            </button>

            <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 p-4 md:p-5">
              <span className="rotulo-caps block text-[0.55rem] text-latte">{item.credito}</span>
              <span className="mt-1 block text-[0.8125rem] leading-snug text-branco md:text-[0.9375rem]">
                {item.legenda}
              </span>
            </figcaption>
          </div>
        </div>
      </figure>
    </Reveal>
  );
}

export function Reels() {
  return (
    <Section id={REELS.id} tone="noite" labelledBy={HEADING_ID} className="py-20 md:py-28">
      <SectionHeading
        id={HEADING_ID}
        tone="noite"
        eyebrow={REELS.eyebrow}
        title={REELS.title}
        lead={REELS.lead}
        className="max-w-2xl"
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
        {/* trilho no toque, grade no desktop */}
        <ul className="scrollbar-none flex snap-x snap-proximity gap-4 overflow-x-auto pb-2 sm:gap-5 lg:col-span-8 lg:grid lg:grid-cols-3 lg:overflow-visible">
          {REELS.items.map((item, index) => (
            <Reel key={item.id} item={item} index={index} />
          ))}
        </ul>

        <Reveal delay={0.12} className="lg:col-span-4">
          <div className="rounded-3xl border border-creme/10 bg-noite-soft p-8">
            <span className="inline-flex size-12 items-center justify-center rounded-full bg-linear-115 from-cafe-quente via-cafe to-cafe-deep text-branco">
              <Instagram className="size-5" strokeWidth={1.75} aria-hidden />
            </span>

            <h3 className="mt-6 font-display text-[1.4rem] font-semibold leading-snug text-creme">
              {REELS.instagramTitle}
            </h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-creme/75">
              {REELS.instagramText}
            </p>

            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-contorno-claro mt-7 h-12 px-6 text-[0.875rem]"
            >
              <Instagram className="size-[1.15rem] shrink-0" strokeWidth={1.75} aria-hidden />
              {REELS.instagramCta}
            </a>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
