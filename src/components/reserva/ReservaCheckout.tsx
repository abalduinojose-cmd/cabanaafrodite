"use client";

import { Loader2, Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Calendario, LegendaDatas } from "@/components/reserva/Calendario";
import { Button } from "@/components/ui/Button";
import { CONTACT, RESERVA, RESERVAS_ATIVAS, RESERVAS_DEMO } from "@/data/content";
import { noiteOcupada } from "@/lib/disponibilidade";
import { cx } from "@/lib/cx";

const dinheiro = (centavos: number): string =>
  (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** `2026-09-18` vira `18 de set.` */
const diaCurto = (dia: string): string =>
  new Date(`${dia}T12:00:00Z`).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

const somarDia = (dia: string): string =>
  new Date(Date.parse(`${dia}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10);

type Precos = {
  readonly noite: number;
  readonly limpeza: number;
  readonly minimoNoites: number;
  readonly percentualCobrado: number;
};

/** Na prévia sem backend, o painel mostra valores de exemplo, rotulados. */
const PRECOS_DEMO: Precos = {
  noite: 650_00,
  limpeza: 150_00,
  minimoNoites: 1,
  percentualCobrado: 100,
};

/**
 * A página de reserva de fato: calendário à esquerda, painel de resumo fixo
 * à direita. Quem chega aqui já decidiu; o trabalho do layout é não criar
 * atrito entre escolher as datas e pagar.
 */
export function ReservaCheckout() {
  const [entrada, setEntrada] = useState<string | null>(null);
  const [saida, setSaida] = useState<string | null>(null);
  const [hospedes, setHospedes] = useState(2);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [avisoDemo, setAvisoDemo] = useState(false);

  const [ocupadasAoVivo, setOcupadasAoVivo] = useState<ReadonlySet<string> | null>(null);
  const [precos, setPrecos] = useState<Precos | null>(RESERVAS_DEMO ? PRECOS_DEMO : null);

  useEffect(() => {
    if (!RESERVAS_ATIVAS) return;
    let ativo = true;

    void fetch("/api/disponibilidade")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((dados: { ocupadas: string[]; precos: Precos }) => {
        if (!ativo) return;
        setOcupadasAoVivo(new Set(dados.ocupadas));
        setPrecos(dados.precos);
      })
      .catch(() => {
        /* fica com o calendário do build */
      });

    return () => {
      ativo = false;
    };
  }, []);

  const ocupada = useCallback(
    (dia: string): boolean => (ocupadasAoVivo ? ocupadasAoVivo.has(dia) : noiteOcupada(dia)),
    [ocupadasAoVivo],
  );

  const escolher = useCallback(
    (dia: string): void => {
      setErro(null);

      // Sem entrada, ou clicou antes dela, ou já havia um intervalo: recomeça.
      if (entrada === null || saida !== null || dia <= entrada) {
        setEntrada(dia);
        setSaida(null);
        return;
      }

      // Não deixa atravessar uma noite ocupada.
      for (let d = entrada; d < dia; d = somarDia(d)) {
        if (ocupada(d)) {
          setErro(RESERVA.ocupadaAviso);
          setEntrada(dia);
          setSaida(null);
          return;
        }
      }

      setSaida(dia);
    },
    [entrada, saida, ocupada],
  );

  const noites = useMemo(() => {
    if (!entrada || !saida) return 0;
    return Math.round((Date.parse(saida) - Date.parse(entrada)) / 86_400_000);
  }, [entrada, saida]);

  const orcamento = useMemo(() => {
    if (!precos || noites === 0) return null;
    const diarias = noites * precos.noite;
    const total = diarias + precos.limpeza;
    return {
      diarias,
      limpeza: precos.limpeza,
      total,
      agora: Math.round((total * precos.percentualCobrado) / 100),
      parcial: precos.percentualCobrado < 100,
    };
  }, [precos, noites]);

  async function enviar(evento: React.FormEvent<HTMLFormElement>): Promise<void> {
    evento.preventDefault();
    if (!entrada || !saida) return;

    // Prévia: em vez de cobrar, explica onde o pagamento entra.
    if (RESERVAS_DEMO) {
      setAvisoDemo(true);
      return;
    }

    const form = new FormData(evento.currentTarget);
    setEnviando(true);
    setErro(null);

    try {
      const resposta = await fetch("/api/reservas", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          entrada,
          saida,
          nome: form.get("nome"),
          email: form.get("email"),
          telefone: form.get("telefone"),
          hospedes,
        }),
      });

      const dados = (await resposta.json()) as { checkoutUrl?: string; erro?: string };

      if (!resposta.ok || !dados.checkoutUrl) {
        const chave = dados.erro as keyof typeof RESERVA.erros | undefined;
        setErro((chave && RESERVA.erros[chave]) ?? RESERVA.erros.generico);
        setEnviando(false);
        return;
      }

      window.location.href = dados.checkoutUrl;
    } catch {
      setErro(RESERVA.erros.generico);
      setEnviando(false);
    }
  }

  /* Vitrine estática sem modo demonstração: a reserva acontece no Airbnb. */
  if (!RESERVAS_ATIVAS && !RESERVAS_DEMO) {
    return (
      <div className="container-page flex max-w-xl flex-col items-center py-24 text-center">
        <p className="text-[1.0625rem] leading-relaxed text-ink-muted">{RESERVA.indisponivel}</p>
        <Button href={CONTACT.airbnb} seta className="mt-7">
          {RESERVA.irParaAirbnb}
        </Button>
      </div>
    );
  }

  const campoData = (rotulo: string, valor: string | null, ativa: boolean) => (
    <div
      className={cx(
        "rounded-2xl border px-4 py-3 transition-colors",
        ativa ? "border-cafe bg-cafe/5" : "border-ink/12 bg-branco",
      )}
    >
      <span className="rotulo-caps block text-[0.55rem] text-ink-muted">{rotulo}</span>
      <span className={cx("mt-0.5 block text-[0.9375rem] font-semibold", valor ? "text-ink" : "text-ink/35")}>
        {valor ? diaCurto(valor) : RESERVA.selecione}
      </span>
    </div>
  );

  return (
    <div className="container-page grid gap-10 py-12 md:py-16 lg:grid-cols-12 lg:gap-14">
      {/* Calendário: o palco da página */}
      <div className="lg:col-span-7 xl:col-span-8">
        <Calendario ocupada={ocupada} entrada={entrada} saida={saida} aoEscolher={escolher} />
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-ink/8 pt-5">
          <LegendaDatas />
          {erro ? (
            <p role="alert" className="text-sm font-medium text-cafe-deep">
              {erro}
            </p>
          ) : null}
        </div>
      </div>

      {/* Painel de reserva: acompanha a rolagem no desktop */}
      <aside className="lg:col-span-5 xl:col-span-4">
        <form
          onSubmit={enviar}
          className="rounded-[1.75rem] border border-ink/10 bg-branco p-6 shadow-[0_24px_60px_-30px_rgb(29_21_14/0.35)] md:p-7 lg:sticky lg:top-8"
        >
          {precos ? (
            <>
              <p className="flex items-baseline gap-1.5">
                <span className="font-display text-[1.75rem] font-semibold leading-none text-ink">
                  {dinheiro(precos.noite)}
                </span>
                <span className="text-sm text-ink-muted">{RESERVA.porNoite}</span>
              </p>
              {RESERVAS_DEMO ? (
                <p className="mt-1.5 text-[0.7rem] text-ink/45">{RESERVA.demoValores}</p>
              ) : null}
            </>
          ) : (
            <span aria-hidden className="block h-7 w-36 animate-pulse rounded-full bg-ink/8" />
          )}

          <div className="mt-5 grid grid-cols-2 gap-2.5">
            {campoData(RESERVA.chegada, entrada, entrada !== null && saida === null)}
            {campoData(RESERVA.saida, saida, entrada !== null && saida === null)}
          </div>

          <p className="mt-2.5 text-[0.75rem] text-ink-muted">
            {entrada && saida
              ? RESERVA.resumoNoites(noites)
              : entrada
                ? RESERVA.escolhaSaida
                : RESERVA.escolhaEntrada}
          </p>

          {/* Hóspedes: passo a passo, sem select nativo */}
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-ink/12 bg-branco px-4 py-3">
            <span className="rotulo-caps text-[0.55rem] text-ink-muted">
              {RESERVA.campos.hospedes}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setHospedes((v) => Math.max(1, v - 1))}
                disabled={hospedes <= 1}
                aria-label={RESERVA.menosHospedes}
                className="seta-trilho size-8"
              >
                <Minus className="size-3.5" strokeWidth={2} aria-hidden />
              </button>
              <span className="w-5 text-center text-[0.9375rem] font-semibold tabular-nums text-ink">
                {hospedes}
              </span>
              <button
                type="button"
                onClick={() => setHospedes((v) => Math.min(4, v + 1))}
                disabled={hospedes >= 4}
                aria-label={RESERVA.maisHospedes}
                className="seta-trilho size-8"
              >
                <Plus className="size-3.5" strokeWidth={2} aria-hidden />
              </button>
            </div>
          </div>

          {/* Dados e valores: entram quando o período está completo */}
          {orcamento ? (
            <>
              <div className="mt-4 space-y-2.5">
                <input
                  name="nome"
                  required
                  autoComplete="name"
                  placeholder={RESERVA.campos.nome}
                  className="h-12 w-full rounded-2xl border border-ink/12 bg-branco px-4 text-[0.9375rem] text-ink placeholder:text-ink/35"
                />
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder={RESERVA.campos.email}
                  className="h-12 w-full rounded-2xl border border-ink/12 bg-branco px-4 text-[0.9375rem] text-ink placeholder:text-ink/35"
                />
                <input
                  name="telefone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder={RESERVA.campos.telefone}
                  className="h-12 w-full rounded-2xl border border-ink/12 bg-branco px-4 text-[0.9375rem] text-ink placeholder:text-ink/35"
                />
              </div>

              <dl className="mt-5 space-y-2 border-t border-ink/8 pt-4 text-sm">
                <div className="flex justify-between text-ink-muted">
                  <dt>{`${dinheiro(precos?.noite ?? 0)} × ${RESERVA.resumoNoites(noites)}`}</dt>
                  <dd className="tabular-nums">{dinheiro(orcamento.diarias)}</dd>
                </div>
                <div className="flex justify-between text-ink-muted">
                  <dt>{RESERVA.linhaLimpeza}</dt>
                  <dd className="tabular-nums">{dinheiro(orcamento.limpeza)}</dd>
                </div>
                <div className="flex justify-between border-t border-ink/8 pt-2.5 text-[0.9375rem] font-semibold text-ink">
                  <dt>{RESERVA.linhaTotal}</dt>
                  <dd className="tabular-nums">{dinheiro(orcamento.total)}</dd>
                </div>
                {orcamento.parcial ? (
                  <div className="flex justify-between text-[0.9375rem] font-semibold text-cafe-deep">
                    <dt>{RESERVA.linhaAgora}</dt>
                    <dd className="tabular-nums">{dinheiro(orcamento.agora)}</dd>
                  </div>
                ) : null}
              </dl>

              <button
                type="submit"
                disabled={enviando}
                className="btn btn-cafe mt-5 h-13 w-full px-6"
              >
                {enviando ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    {RESERVA.enviando}
                  </>
                ) : (
                  RESERVA.enviar
                )}
              </button>
            </>
          ) : (
            <p className="mt-5 rounded-2xl bg-creme px-4 py-3.5 text-[0.8125rem] leading-relaxed text-ink-muted">
              {RESERVA.semDatas}
            </p>
          )}

          <p className="mt-4 flex items-start gap-2 text-[0.75rem] leading-relaxed text-ink-muted">
            {RESERVA.seguranca}
          </p>
        </form>
      </aside>

      {/* Prévia: explica onde o pagamento entra, sem fingir que cobrou */}
      {avisoDemo ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-demo"
          className="fixed inset-0 z-50 flex items-end justify-center bg-noite/60 p-4 backdrop-blur-sm sm:items-center"
        >
          <div className="w-full max-w-md rounded-[1.75rem] border border-ink/10 bg-branco p-7 shadow-[0_30px_70px_-30px_rgb(29_21_14/0.6)]">
            <p className="rotulo-caps text-[0.55rem] text-cafe-deep">{RESERVA.demoTitulo}</p>
            <h2 id="titulo-demo" className="mt-3 font-display text-[1.35rem] font-semibold text-ink">
              {RESERVA.enviar}
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
              {RESERVA.demoTexto}
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <Button href={CONTACT.airbnb} seta fullWidth>
                {RESERVA.irParaAirbnb}
              </Button>
              <Button href={CONTACT.whatsapp} variant="contornoEscuro" whatsapp fullWidth>
                {CONTACT.phoneDisplay}
              </Button>
              <button
                type="button"
                onClick={() => setAvisoDemo(false)}
                className="link-draw mx-auto mt-1 text-sm text-ink-muted"
              >
                {RESERVA.demoFechar}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
