import Image from "next/image";

import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ABOUT } from "@/data/content";

const HEADING_ID = "titulo-a-cabana";

export function About() {
  return (
    <Section id={ABOUT.id} labelledBy={HEADING_ID} className="py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-6 xl:col-span-5">
          <SectionHeading id={HEADING_ID} eyebrow={ABOUT.eyebrow} title={ABOUT.title} />

          <Reveal delay={0.06}>
            <p className="poetico mt-6 text-[1.35rem] leading-snug text-cafe-deep">
              {ABOUT.poetic}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            {ABOUT.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-5 max-w-[60ch] text-[1.0625rem] leading-relaxed text-ink-muted">
                {paragraph}
              </p>
            ))}
          </Reveal>

          <Reveal delay={0.16}>
            <ul className="mt-9 flex flex-wrap gap-2.5">
              {ABOUT.chips.map((chip) => (
                <Chip key={chip.label} label={chip.label} icon={chip.icon} />
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal as="figure" delay={0.12} className="lg:col-span-6 lg:col-start-7">
          <div className="cortina cartao relative mx-auto aspect-4/5 w-full max-w-lg overflow-hidden !rounded-[1.75rem] p-0 lg:max-w-none">
            <Image
              src={ABOUT.photo.image}
              alt={ABOUT.photo.alt}
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 46vw, (min-width: 640px) 70vw, 92vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
