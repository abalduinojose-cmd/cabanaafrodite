import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AMENITIES } from "@/data/content";

const HEADING_ID = "titulo-comodidades";

export function Amenities() {
  return (
    <Section id={AMENITIES.id} tone="noite" labelledBy={HEADING_ID} className="py-20 md:py-28">
      <SectionHeading
        id={HEADING_ID}
        tone="noite"
        eyebrow={AMENITIES.eyebrow}
        title={AMENITIES.title}
        className="max-w-3xl"
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {AMENITIES.groups.map((group, index) => (
          <Reveal
            key={group.id}
            as="article"
            delay={index * 0.06}
            className="rounded-3xl border border-creme/10 bg-noite-soft p-7"
          >
            <h3 className="font-display text-xl font-semibold text-creme">{group.title}</h3>
            <span aria-hidden className="mt-4 block h-px w-10 bg-latte/60" />
            <ul className="mt-6 space-y-4">
              {group.items.map((item) => (
                <li key={item.label} className="flex items-start gap-3.5">
                  <item.icon
                    aria-hidden
                    strokeWidth={1.25}
                    className="mt-0.5 size-[1.125rem] shrink-0 text-latte"
                  />
                  <span className="text-[0.9375rem] leading-snug text-creme/85">{item.label}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p className="mt-12 max-w-[70ch] border-l-2 border-latte/60 pl-5 text-sm leading-relaxed text-creme/75">
          {AMENITIES.note}
        </p>
      </Reveal>
    </Section>
  );
}
