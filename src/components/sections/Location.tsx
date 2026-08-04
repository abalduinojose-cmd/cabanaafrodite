import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { MapEmbed } from "@/components/ui/MapEmbed";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { A11Y, GEO, LOCATION } from "@/data/content";

const HEADING_ID = "titulo-localizacao";

export function Location() {
  return (
    <section
      id={LOCATION.id}
      aria-labelledby={HEADING_ID}
      className="relative isolate overflow-hidden bg-branco py-20 text-ink md:py-28"
    >
      {/* Foto da cabana ao fundo, bem esmaecida: dá lugar sem roubar leitura */}
      <Image
        src={LOCATION.backdrop.image}
        alt=""
        aria-hidden
        fill
        placeholder="blur"
        sizes="100vw"
        className="-z-20 object-cover object-center opacity-30"
      />
      {/* topo e base sólidos costuram com as seções vizinhas; o miolo deixa a
          foto aparecer sem atrapalhar a leitura */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-b from-branco via-branco/55 to-branco"
      />

      <div className="container-page">
        <SectionHeading
          id={HEADING_ID}
          tone="branco"
          eyebrow={LOCATION.eyebrow}
          title={LOCATION.title}
          lead={LOCATION.lead}
          className="max-w-3xl"
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal as="figure">
            <div className="cartao relative aspect-4/3 overflow-hidden !rounded-[1.5rem]">
              <MapEmbed
                image={LOCATION.photo.image}
                alt={LOCATION.photo.alt}
                src={GEO.mapEmbedSrc}
                title={A11Y.mapTitle}
                actionLabel={LOCATION.mapLoad}
              />
            </div>
            <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm text-ink-muted">
              {LOCATION.mapCaption}
              <a
                href={GEO.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="link-draw inline-flex items-center gap-1.5 font-medium text-cafe-deep"
              >
                {LOCATION.mapAction}
                <ArrowUpRight className="size-3.5" strokeWidth={1.75} aria-hidden />
              </a>
            </figcaption>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-3xl border border-ink/10 bg-branco/85 p-8 backdrop-blur-sm">
              <h3 className="font-display text-2xl font-semibold text-ink">{LOCATION.nearbyTitle}</h3>
              <ul className="mt-7 space-y-5">
                {LOCATION.nearby.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-start gap-4 border-b border-ink/8 pb-5 last:border-0 last:pb-0"
                  >
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-cafe/10 text-cafe">
                      <item.icon aria-hidden strokeWidth={1.4} className="size-[1.125rem]" />
                    </span>
                    <span className="pt-1.5 text-[1rem] leading-relaxed text-ink/80">
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="poetico mt-8 text-lg text-cafe-deep">{LOCATION.notice}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
