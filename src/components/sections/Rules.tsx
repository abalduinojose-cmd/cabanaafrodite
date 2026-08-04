import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RULES } from "@/data/content";

const HEADING_ID = "titulo-boas-vindas";

export function Rules() {
  return (
    <Section id={RULES.id} labelledBy={HEADING_ID} className="py-20 md:py-28">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <SectionHeading
          id={HEADING_ID}
          eyebrow={RULES.eyebrow}
          title={RULES.title}
          className="lg:col-span-5"
        />

        <Reveal delay={0.08} className="lg:col-span-7">
          <Accordion items={RULES.items} />
        </Reveal>
      </div>
    </Section>
  );
}
