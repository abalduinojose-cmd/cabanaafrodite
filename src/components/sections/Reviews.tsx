import Image from "next/image";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stars } from "@/components/ui/Stars";
import { Trilho } from "@/components/ui/Trilho";
import { A11Y, CONTACT, REVIEWS } from "@/data/content";

const HEADING_ID = "titulo-avaliacoes";

/** Ramo de louro do selo "Preferido dos hóspedes". */
function Louro({ flip = false }: { readonly flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 56"
      aria-hidden
      focusable="false"
      className={`h-12 w-auto text-cafe ${flip ? "-scale-x-100" : ""}`}
      fill="currentColor"
    >
      <path d="M20 2c-8 6-14 16-14 27 0 10 5 19 12 25l1-2C13 46 9 39 9 29 9 19 14 9 21 4Z" />
      {[10, 18, 26, 34, 42].map((y, i) => (
        <ellipse key={y} cx={8 - i * 0.5} cy={y} rx="4.5" ry="2.2" transform={`rotate(${-28 - i * 6} ${8 - i * 0.5} ${y})`} />
      ))}
    </svg>
  );
}

export function Reviews() {
  return (
    <Section id={REVIEWS.id} labelledBy={HEADING_ID} bleed className="py-20 md:py-28">
      <div className="container-page">
        <SectionHeading id={HEADING_ID} eyebrow={REVIEWS.eyebrow} title={REVIEWS.title} />

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Resumo: nota, selo e barras reais do anúncio */}
          <Reveal delay={0.06} className="lg:col-span-4">
            <div className="cartao p-8 lg:sticky lg:top-24">
              <div className="flex items-center justify-center gap-3">
                <Louro />
                <div className="text-center">
                  <p className="font-display text-6xl font-semibold leading-none text-ink">
                    {CONTACT.ratingDisplay}
                  </p>
                  <Stars label={A11Y.fiveStars} className="mt-2 justify-center" />
                </div>
                <Louro flip />
              </div>

              <h3 className="mt-5 text-center font-display text-xl font-semibold text-ink">
                {REVIEWS.summaryTitle}
              </h3>
              <p className="mt-2 text-center text-sm leading-relaxed text-ink-muted">
                {REVIEWS.summaryText}
              </p>

              <dl className="mt-7 space-y-3.5 border-t border-ink/10 pt-6">
                {REVIEWS.ratings.map((row) => (
                  <div key={row.label} className="flex items-center gap-4">
                    <dt className="w-40 shrink-0 text-[0.8125rem] text-ink-muted">{row.label}</dt>
                    <dd className="flex flex-1 items-center gap-3">
                      <span
                        aria-hidden
                        className="h-1 flex-1 overflow-hidden rounded-full bg-ink/10"
                      >
                        <span
                          className="block h-full rounded-full bg-cafe"
                          style={{ width: `${(row.value / 5) * 100}%` }}
                        />
                      </span>
                      <span className="w-8 text-right text-[0.8125rem] font-semibold text-ink">
                        {row.value.toFixed(1).replace(".", ",")}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          {/* Depoimentos reais, com foto de quem avaliou */}
          <div className="min-w-0 lg:col-span-8">
            <Trilho ariaLabel={A11Y.reviewsScroller} setasClassName="mb-5 max-md:hidden">
              {REVIEWS.items.map((review, index) => (
                <Reveal
                  key={review.id}
                  as="li"
                  delay={index < 3 ? index * 0.07 : 0}
                  className="w-[82vw] max-w-[22.5rem] shrink-0 snap-start sm:w-[22.5rem]"
                >
                  <figure className="cartao cartao-vivo flex h-full flex-col p-7">
                    <figcaption className="flex items-center gap-3.5">
                      <Image
                        src={review.avatar}
                        alt={`Foto de perfil de ${review.author}`}
                        width={48}
                        height={48}
                        loading="lazy"
                        className="size-12 shrink-0 rounded-full object-cover ring-1 ring-ink/10"
                      />
                      <span className="min-w-0">
                        <span className="block truncate font-semibold text-ink">{review.author}</span>
                        <span className="rotulo-caps mt-0.5 block text-[0.58rem] text-ink-muted">
                          {review.date}
                        </span>
                      </span>
                    </figcaption>

                    <Stars label={A11Y.fiveStars} className="mt-4" />

                    <blockquote className="mt-3 flex-1">
                      <p className="text-[0.9375rem] leading-relaxed text-ink/80">{review.quote}</p>
                    </blockquote>

                    <p className="rotulo-caps mt-5 flex items-center gap-1.5 text-[0.55rem] text-ink-muted/80">
                      <Star aria-hidden className="size-3 fill-cafe text-cafe" strokeWidth={0} />
                      {REVIEWS.viaLabel}
                    </p>
                  </figure>
                </Reveal>
              ))}
            </Trilho>

            <Reveal delay={0.1}>
              <div className="mt-8 flex justify-center md:justify-start">
                <Button
                  href={CONTACT.airbnb}
                  variant="contornoEscuro"
                  track={{ kind: "reserve", location: "reviews" }}
                >
                  {REVIEWS.cta}
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
