import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { LogoAfrodite } from "@/components/ui/Logo";
import { CONTACT, RESERVA_RETORNO } from "@/data/content";
import { asset } from "@/lib/asset";

export const metadata: Metadata = {
  title: RESERVA_RETORNO.erro.titulo,
  robots: { index: false, follow: false },
};

export default function ErroPage() {
  return (
    <main className="on-dark flex min-h-svh items-center bg-noite py-20 text-creme">
      <div className="container-page flex max-w-2xl flex-col items-center text-center">
        <LogoAfrodite className="h-24 text-creme" />

        <span className="mt-10 inline-flex size-14 items-center justify-center rounded-full border border-creme/25 text-creme/80">
          <AlertCircle className="size-6" strokeWidth={1.5} aria-hidden />
        </span>

        <h1 className="mt-7 text-[clamp(2rem,5vw,3rem)] text-creme">
          {RESERVA_RETORNO.erro.titulo}
        </h1>

        <p className="mt-5 max-w-[52ch] text-[1.0625rem] leading-relaxed text-creme/80">
          {RESERVA_RETORNO.erro.texto}
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href={asset("/#datas")} seta>
            {RESERVA_RETORNO.tentarDeNovo}
          </Button>
          <Button
            href={CONTACT.whatsapp}
            variant="contornoClaro"
            whatsapp
            track={{ kind: "contact", location: "final" }}
          >
            {RESERVA_RETORNO.falarWhatsapp}
          </Button>
        </div>
      </div>
    </main>
  );
}
