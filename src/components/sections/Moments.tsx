import Image from "next/image";

import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Trilho } from "@/components/ui/Trilho";
import { A11Y, MOMENTS } from "@/data/content";

const HEADING_ID = "titulo-momentos";

/** Filmstrip: altura fixa, larguras naturais, arrastável. */
export function Moments() {
  return (
    <Section id={MOMENTS.id} labelledBy={HEADING_ID} bleed className="py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          id={HEADING_ID}
          eyebrow={MOMENTS.eyebrow}
          title={MOMENTS.title}
          lead={MOMENTS.lead}
          className="max-w-2xl"
        />
      </div>

      <div className="gallery-inset mt-4">
        <Trilho ariaLabel={A11Y.momentsScroller} comFade setasClassName="mb-5 max-md:hidden">
          {MOMENTS.photos.map((photo) => (
            <li key={photo.alt} className="h-64 shrink-0 snap-start md:h-80">
              <figure className="relative h-full overflow-hidden rounded-2xl">
                <Image
                  src={photo.image}
                  alt={photo.alt}
                  placeholder="blur"
                  sizes="(min-width: 768px) 26rem, 20rem"
                  className="h-full w-auto object-cover"
                  style={{
                    aspectRatio: `${photo.image.width} / ${photo.image.height}`,
                  }}
                />
              </figure>
            </li>
          ))}
        </Trilho>
        <p className="mt-4 text-sm text-ink-muted md:hidden">{MOMENTS.hint}</p>
      </div>
    </Section>
  );
}
