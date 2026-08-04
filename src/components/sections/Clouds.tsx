import Image from "next/image";

import { Reveal } from "@/components/ui/Reveal";
import { CLOUDS } from "@/data/content";

/** Full-bleed poético: a banheira acima do mar de nuvens. */
export function Clouds() {
  return (
    <section className="on-dark relative isolate flex min-h-[72svh] items-end overflow-hidden py-16 text-branco md:min-h-[80svh]">
      <Image
        src={CLOUDS.photo.image}
        alt={CLOUDS.photo.alt}
        fill
        placeholder="blur"
        sizes="100vw"
        className="deriva-foto -z-20 object-cover object-center"
      />
      <div aria-hidden className="veu-foto absolute inset-0 -z-10" />
      {/* pontes: a seção anterior (creme) e a seguinte (branco) vazam na foto */}
      <div aria-hidden className="ponte-topo-creme absolute inset-x-0 top-0 -z-10 h-28 md:h-36" />
      <div aria-hidden className="ponte-base-branco absolute inset-x-0 bottom-0 -z-10 h-24 md:h-32" />

      <div className="container-page">
        <Reveal className="max-w-3xl">
          <p className="poetico text-[clamp(1.75rem,4.2vw,3rem)] leading-[1.15] text-branco">
            {CLOUDS.poetic}
          </p>
          <p className="poetico mt-2 text-[clamp(1.35rem,3vw,2.1rem)] leading-snug text-latte">
            {CLOUDS.support}
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-branco/20 pt-6">
            {CLOUDS.mentions.map((mention) => (
              <div key={mention.label} className="flex items-baseline gap-2.5">
                <dd className="font-display text-3xl font-semibold text-branco">{mention.value}</dd>
                <dt className="text-sm text-branco/75">{mention.label}</dt>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-branco/55">{CLOUDS.mentionsNote}</p>
        </Reveal>
      </div>
    </section>
  );
}
