import type { Metadata } from "next";
import { CalendarCheck } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { LogoAfrodite } from "@/components/ui/Logo";
import { CONTACT, RESERVA_RETORNO } from "@/data/content";

export const metadata: Metadata = {
  title: RESERVA_RETORNO.sucesso.titulo,
  robots: { index: false, follow: false },
};

export default function ObrigadoPage() {
  return (
    <main className="on-dark flex min-h-svh items-center bg-noite py-20 text-creme">
      <div className="container-page flex max-w-2xl flex-col items-center text-center">
        <LogoAfrodite className="h-24 text-creme" />

        <span className="mt-10 inline-flex size-14 items-center justify-center rounded-full bg-linear-115 from-cafe-quente via-cafe to-cafe-deep text-branco">
          <CalendarCheck className="size-6" strokeWidth={1.75} aria-hidden />
        </span>

        <h1 className="mt-7 text-[clamp(2rem,5vw,3rem)] text-creme">
          {RESERVA_RETORNO.sucesso.titulo}
        </h1>

        <p className="mt-5 max-w-[52ch] text-[1.0625rem] leading-relaxed text-creme/80">
          {RESERVA_RETORNO.sucesso.texto}
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href={CONTACT.whatsapp} whatsapp track={{ kind: "contact", location: "final" }}>
            {RESERVA_RETORNO.falarWhatsapp}
          </Button>
          <Button href="/" variant="contornoClaro">
            {RESERVA_RETORNO.voltar}
          </Button>
        </div>
      </div>
    </main>
  );
}
