import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { LogoAfrodite } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { CONTACT, FINAL_CTA, RESERVAR } from "@/data/content";

const HEADING_ID = "titulo-reserva";

export function FinalCta() {
  return (
    <section
      aria-labelledby={HEADING_ID}
      className="on-dark relative isolate flex min-h-[34rem] items-center overflow-hidden py-24 text-branco md:min-h-[40rem]"
    >
      <Image
        src={FINAL_CTA.photo.image}
        alt={FINAL_CTA.photo.alt}
        fill
        placeholder="blur"
        sizes="100vw"
        className="deriva-foto -z-20 object-cover object-center"
      />
      <div aria-hidden className="veu-foto absolute inset-0 -z-10" />
      {/* pontes: entra vindo do creme e desagua no rodapé escuro */}
      <div aria-hidden className="ponte-topo-creme absolute inset-x-0 top-0 -z-10 h-28 md:h-36" />
      <div aria-hidden className="ponte-base-noite absolute inset-x-0 bottom-0 -z-10 h-44 md:h-64" />

      <div className="container-page">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* Logo branco enviado pelo cliente, recriado em SVG */}
          <LogoAfrodite className="h-28 text-branco md:h-32" />

          <h2 id={HEADING_ID} className="mt-8 text-[clamp(2.25rem,5.2vw,3.9rem)] text-branco">
            {FINAL_CTA.title}
          </h2>

          <Button
            href={RESERVAR.href}
            size="lg"
            seta
            novaAba={RESERVAR.novaAba}
            className="mt-9"
            track={{ kind: "reserve", location: "final" }}
          >
            {RESERVAR.final}
          </Button>

          <Button
            href={CONTACT.whatsapp}
            variant="discreto"
            size="sm"
            whatsapp
            className="mt-6"
            track={{ kind: "contact", location: "final" }}
          >
            {FINAL_CTA.support}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
