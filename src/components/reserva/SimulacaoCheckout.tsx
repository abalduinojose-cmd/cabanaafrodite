"use client";

import { Check, Loader2, X } from "lucide-react";
import { useState } from "react";

import { SIMULACAO } from "@/data/content";

type Props = {
  readonly id: string;
  readonly nome: string;
  readonly entrada: string;
  readonly saida: string;
  readonly noites: number;
  readonly valorCobrado: number;
};

const dinheiro = (centavos: number): string =>
  (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const dataLonga = (dia: string): string =>
  new Date(`${dia}T12:00:00Z`).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

export function SimulacaoCheckout({ id, nome, entrada, saida, noites, valorCobrado }: Props) {
  const [enviando, setEnviando] = useState<"aprovado" | "recusado" | null>(null);

  async function decidir(desfecho: "aprovado" | "recusado"): Promise<void> {
    setEnviando(desfecho);

    await fetch("/api/reservas/simular", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, desfecho }),
    });

    window.location.href =
      desfecho === "aprovado" ? `/reserva/obrigado?id=${id}` : `/reserva/erro?id=${id}`;
  }

  return (
    <div className="mt-9 w-full rounded-3xl border border-creme/12 bg-noite-soft p-7 text-left">
      <dl className="space-y-2.5 text-[0.9375rem]">
        <div className="flex justify-between gap-4">
          <dt className="text-creme/60">{SIMULACAO.hospede}</dt>
          <dd className="text-creme">{nome}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-creme/60">{SIMULACAO.estadia}</dt>
          <dd className="text-creme">
            {`${dataLonga(entrada)} a ${dataLonga(saida)} · ${noites} ${
              noites === 1 ? "noite" : "noites"
            }`}
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-creme/12 pt-3 text-lg font-semibold">
          <dt className="text-creme">{SIMULACAO.aPagar}</dt>
          <dd className="tabular-nums text-latte">{dinheiro(valorCobrado)}</dd>
        </div>
      </dl>

      <div className="mt-7 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => void decidir("aprovado")}
          disabled={enviando !== null}
          className="btn btn-cafe h-13 px-6"
        >
          {enviando === "aprovado" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Check className="size-4" aria-hidden />
          )}
          {SIMULACAO.aprovar}
        </button>

        <button
          type="button"
          onClick={() => void decidir("recusado")}
          disabled={enviando !== null}
          className="btn btn-contorno-claro h-12 px-6"
        >
          {enviando === "recusado" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <X className="size-4" aria-hidden />
          )}
          {SIMULACAO.recusar}
        </button>
      </div>

      <p className="mt-5 text-[0.75rem] leading-relaxed text-creme/50">{SIMULACAO.rodape}</p>
    </div>
  );
}
