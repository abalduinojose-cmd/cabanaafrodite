import Image from "next/image";

import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Trilho } from "@/components/ui/Trilho";
import { A11Y, SPACES } from "@/data/content";

const HEADING_ID = "titulo-ambientes";

export function Spaces() {
  return (
    <Section id={SPACES.id} tone="branco" labelledBy={HEADING_ID} bleed className="py-20 md:py-28">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id={HEADING_ID}
            tone="branco"
            eyebrow={SPACES.eyebrow}
            title={SPACES.title}
            lead={SPACES.lead}
            className="md:max-w-2xl"
          />
        </div>
      </div>

      <div className="gallery-inset mt-4">
        <Trilho ariaLabel={A11Y.spacesScroller} setasClassName="mb-5 max-md:hidden">
          {SPACES.items.map((space, index) => (
            <Reveal
              key={space.id}
              as="li"
              delay={index < 3 ? index * 0.07 : 0}
              className="w-[78vw] max-w-[24rem] shrink-0 snap-start sm:w-[24rem]"
            >
              <article className="cartao cartao-vivo h-full overflow-hidden">
                <figure className="relative aspect-4/3 overflow-hidden">
                  <Image
                    src={space.image}
                    alt={space.alt}
                    fill
                    placeholder="blur"
                    loading={index < 2 ? "eager" : "lazy"}
                    sizes="(min-width: 640px) 24rem, 78vw"
                    className="object-cover transition-transform duration-700 ease-serra hover:scale-[1.04]"
                  />
                </figure>
                <div className="p-6">
                  <h3 className="font-display text-[1.3rem] font-semibold leading-snug text-ink">
                    {space.title}
                  </h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                    {space.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </Trilho>
      </div>
    </Section>
  );
}
