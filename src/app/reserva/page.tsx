import type { Metadata } from "next";
import { ArrowLeft, KeyRound, ShieldCheck, Star } from "lucide-react";

import { ReservaCheckout } from "@/components/reserva/ReservaCheckout";
import { IconeWhatsApp } from "@/components/ui/IconeWhatsApp";
import { LogoMarca } from "@/components/ui/Logo";
import { CONTACT, PAGINA_RESERVA, SITE } from "@/data/content";

export const metadata: Metadata = {
  title: PAGINA_RESERVA.titulo,
  description: PAGINA_RESERVA.descricao,
  robots: { index: false, follow: true },
};

const SELOS = [
  { icone: Star, texto: PAGINA_RESERVA.selos.nota },
  { icone: ShieldCheck, texto: PAGINA_RESERVA.selos.pagamento },
  { icone: KeyRound, texto: PAGINA_RESERVA.selos.checkin },
];

/**
 * Página de reserva: aberta em aba própria, sem o resto do site em volta.
 * Quem chega aqui já decidiu, e a única tarefa é escolher as datas e pagar.
 */
export default function ReservaPage() {
  return (
    <div className="flex min-h-svh flex-col bg-branco">
      <header className="border-b border-ink/6">
        <div className="container-page flex h-[4.25rem] items-center justify-between gap-6">
          <a
            href="/"
            className="link-draw rotulo-caps inline-flex items-center gap-2 text-[0.625rem] text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-3.5" strokeWidth={1.75} aria-hidden />
            {PAGINA_RESERVA.voltar}
          </a>

          <a href="/" aria-label={SITE.name}>
            <LogoMarca className="h-10 text-ink" />
          </a>

          <a
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="link-draw rotulo-caps inline-flex items-center gap-2 text-[0.625rem] text-ink-muted transition-colors hover:text-ink"
          >
            <IconeWhatsApp className="size-4" />
            <span className="max-sm:sr-only">{PAGINA_RESERVA.duvidas}</span>
          </a>
        </div>
      </header>

      <main className="flex-1">
        <div className="container-page pt-10 md:pt-14">
          <h1 className="font-display text-[clamp(1.75rem,3.6vw,2.5rem)] font-semibold text-ink">
            {PAGINA_RESERVA.headline}
          </h1>
          <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-muted">
            {PAGINA_RESERVA.apoio}
          </p>
        </div>

        <ReservaCheckout />
      </main>

      <footer className="border-t border-ink/6 bg-creme/60 py-8">
        <ul className="container-page flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {SELOS.map((selo) => (
            <li key={selo.texto} className="flex items-center gap-2.5 text-[0.8125rem] text-ink/65">
              <selo.icone className="size-4 shrink-0 text-cafe" strokeWidth={1.5} aria-hidden />
              {selo.texto}
            </li>
          ))}
        </ul>
      </footer>
    </div>
  );
}
