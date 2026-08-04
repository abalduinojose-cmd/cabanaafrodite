import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SimulacaoCheckout } from "@/components/reserva/SimulacaoCheckout";
import { LogoAfrodite } from "@/components/ui/Logo";
import { SIMULACAO } from "@/data/content";
import { MODO } from "@/server/env";
import { buscar } from "@/server/reservas";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: SIMULACAO.titulo,
  robots: { index: false, follow: false },
};

/**
 * Checkout de demonstração.
 *
 * Não coleta nem processa nenhum dado de pagamento: os botões apenas
 * marcam a reserva como paga ou recusada, para dar para percorrer o fluxo
 * inteiro antes de existir conta no Mercado Pago. A página se recusa a
 * abrir quando o Access Token está configurado.
 */
export default async function SimulacaoPage({
  searchParams,
}: {
  readonly searchParams: Promise<{ readonly id?: string }>;
}) {
  if (MODO.pagamento !== "simulado") notFound();

  const { id } = await searchParams;
  const reserva = id ? await buscar(id) : null;
  if (!reserva) notFound();

  return (
    <main className="on-dark flex min-h-svh items-center bg-noite py-16 text-creme">
      <div className="container-page flex max-w-xl flex-col items-center text-center">
        <LogoAfrodite className="h-20 text-creme" />

        <p className="mt-8 rounded-full border border-latte/40 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-latte">
          {SIMULACAO.selo}
        </p>

        <h1 className="mt-6 text-[clamp(1.75rem,4.5vw,2.5rem)] text-creme">{SIMULACAO.titulo}</h1>

        <p className="mt-4 max-w-[46ch] text-[0.9375rem] leading-relaxed text-creme/75">
          {SIMULACAO.explicacao}
        </p>

        <SimulacaoCheckout
          id={reserva.id}
          nome={reserva.nome}
          entrada={reserva.entrada}
          saida={reserva.saida}
          noites={reserva.noites}
          valorCobrado={reserva.valorCobrado}
        />
      </div>
    </main>
  );
}
