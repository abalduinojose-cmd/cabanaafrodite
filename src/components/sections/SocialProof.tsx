import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SOCIAL_PROOF } from "@/data/content";

export function SocialProof() {
  return (
    <Section tone="noite" className="py-14 md:py-16">
      <Reveal>
        <dl className="grid grid-cols-2 gap-y-10 md:grid-cols-4">
          {SOCIAL_PROOF.stats.map((stat, index) => (
            <div
              key={stat.label}
              className={
                index === 0
                  ? "flex flex-col-reverse gap-3 px-2 text-center md:px-6"
                  : "flex flex-col-reverse gap-3 border-l border-creme/12 px-2 text-center md:px-6"
              }
            >
              <dt className="rotulo-caps text-[0.625rem] text-creme/60">{stat.label}</dt>
              <dd className="font-display text-[clamp(1.9rem,3.2vw,2.8rem)] font-semibold leading-none text-latte">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mx-auto mt-11 flex max-w-3xl items-center justify-center gap-5 text-center text-sm leading-relaxed text-creme/80">
          <span aria-hidden className="hidden h-px flex-1 bg-creme/15 sm:block" />
          {SOCIAL_PROOF.badge}
          <span aria-hidden className="hidden h-px flex-1 bg-creme/15 sm:block" />
        </p>
      </Reveal>
    </Section>
  );
}
