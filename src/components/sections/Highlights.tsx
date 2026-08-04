import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { HIGHLIGHTS } from "@/data/content";

export function Highlights() {
  return (
    <Section className="pb-20 md:pb-28">
      <p className="rotulo-caps flex items-center gap-3 text-cafe-deep">
        <span aria-hidden className="h-px w-9 bg-cafe/50" />
        {HIGHLIGHTS.eyebrow}
      </p>

      <ul className="mt-9 grid gap-5 md:grid-cols-3">
        {HIGHLIGHTS.items.map((item, index) => (
          <Reveal
            key={item.title}
            as="li"
            delay={index * 0.08}
            className="cartao cartao-vivo p-8 md:p-9"
          >
            <span className="inline-flex size-12 items-center justify-center rounded-full bg-cafe/10 text-cafe">
              <item.icon aria-hidden strokeWidth={1.4} className="size-6" />
            </span>
            <h3 className="mt-6 font-display text-[1.35rem] font-semibold leading-snug text-ink">
              {item.title}
            </h3>
            <p className="mt-2.5 max-w-[42ch] text-[0.9375rem] leading-relaxed text-ink-muted">
              {item.description}
            </p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
