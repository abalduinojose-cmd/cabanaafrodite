import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { VideoFundo } from "@/components/ui/VideoFundo";
import { A11Y, ACTIONS, CONTACT, HERO, RESERVAR } from "@/data/content";

/**
 * O texto e os botões são Server Components: o LCP é a foto-pôster, que já
 * vem no HTML e não espera JavaScript. A entrada é CSS puro (`rise`), que
 * respeita `prefers-reduced-motion` pelo globals.css. Só o vídeo de fundo é
 * cliente, e ele entra depois, por cima da foto.
 */
export function Hero() {
  return (
    <section
      id="topo"
      className="on-dark relative isolate flex min-h-svh flex-col justify-end overflow-hidden"
    >
      {/* foto e vídeo derivam juntos no parallax */}
      <div aria-hidden className="deriva-hero absolute inset-0 -z-20">
        <Image
          src={HERO.photo.image}
          alt={HERO.photo.alt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          placeholder="blur"
          quality={85}
          className="object-cover object-[62%_center] md:object-center"
        />
        <VideoFundo
          src={HERO.video}
          label={A11Y.heroVideo}
          className="absolute inset-0 object-[62%_center] md:object-center"
        />
      </div>

      <div aria-hidden className="veu-hero absolute inset-0 -z-10" />

      <div className="container-page flex flex-1 items-end pb-12 pt-32 md:pb-16">
        <div className="max-w-3xl">
          <p className="rise rotulo-caps flex items-center gap-3 text-[0.625rem] text-branco/85 sm:text-[0.7rem]">
            <span aria-hidden className="h-px w-9 bg-latte/70" />
            {HERO.eyebrow}
          </p>

          <h1
            className="rise mt-6 text-[clamp(2.5rem,6vw,4.6rem)] text-branco"
            style={{ animationDelay: "80ms" }}
          >
            {HERO.title}
          </h1>

          <p
            className="rise mt-6 max-w-[52ch] text-[1.0625rem] leading-relaxed text-branco/85 md:text-lg"
            style={{ animationDelay: "160ms" }}
          >
            {HERO.subtitle}
          </p>

          <div
            className="rise mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            style={{ animationDelay: "240ms" }}
          >
            <Button
              href={RESERVAR.href}
              size="lg"
              seta
              novaAba={RESERVAR.novaAba}
              track={{ kind: "reserve", location: "hero" }}
            >
              {RESERVAR.longo}
            </Button>
            <Button
              href={CONTACT.whatsapp}
              variant="contornoClaro"
              size="lg"
              whatsapp
              track={{ kind: "contact", location: "hero" }}
            >
              {ACTIONS.whatsapp}
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-branco/15 bg-noite/30 backdrop-blur-sm">
        <ul className="container-page flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-4 text-center md:gap-x-12 md:py-5">
          {HERO.seals.map((seal) => (
            <li
              key={seal}
              className="rotulo-caps flex items-center gap-2.5 text-[0.625rem] text-branco/85 sm:text-[0.7rem]"
            >
              <span aria-hidden className="size-1 rounded-full bg-latte" />
              {seal}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
