"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AVAILABILITY, CONTACT, RESERVA } from "@/data/content";
import { atualizadoEm, noiteOcupada } from "@/lib/disponibilidade";
import { cx } from "@/lib/cx";

const HEADING_ID = "titulo-datas";

/** Ligado só onde existe backend; no site estático fica desligado. */
const RESERVAS_ATIVAS = process.env.NEXT_PUBLIC_RESERVAS_ATIVAS === "1";

const dinheiro = (centavos: number): string =>
  (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** `2026-09-18` vira `18 de set.` */
const diaCurto = (dia: string): string =>
  new Date(`${dia}T12:00:00Z`).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

function primeiroDiaDoMes(): Date {
  const agora = new Date();
  return new Date(Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth(), 1));
}

type Dia = {
  readonly chave: string;
  readonly numero: number;
  readonly ocupada: boolean;
  readonly passado: boolean;
};

function montarMes(base: Date, ocupada: (dia: string) => boolean): readonly (Dia | null)[] {
  const ano = base.getUTCFullYear();
  const mes = base.getUTCMonth();
  const totalDias = new Date(Date.UTC(ano, mes + 1, 0)).getUTCDate();
  const hoje = new Date().toISOString().slice(0, 10);

  const celulas: (Dia | null)[] = Array.from(
    { length: new Date(Date.UTC(ano, mes, 1)).getUTCDay() },
    () => null,
  );

  for (let numero = 1; numero <= totalDias; numero += 1) {
    const chave = new Date(Date.UTC(ano, mes, numero)).toISOString().slice(0, 10);
    celulas.push({ chave, numero, ocupada: ocupada(chave), passado: chave < hoje });
  }

  return celulas;
}

type PropsMes = {
  readonly base: Date;
  readonly ocupada: (dia: string) => boolean;
  readonly entrada: string | null;
  readonly saida: string | null;
  readonly aoEscolher: ((dia: string) => void) | null;
};

function Mes({ base, ocupada, entrada, saida, aoEscolher }: PropsMes) {
  const celulas = useMemo(() => montarMes(base, ocupada), [base, ocupada]);
  const rotulo = `${AVAILABILITY.meses[base.getUTCMonth()]} de ${base.getUTCFullYear()}`;

  return (
    <div>
      {/* `capitalize` do Tailwind subiria também o "de"; aqui só a inicial */}
      <p className="text-center font-display text-lg font-semibold text-ink first-letter:uppercase">
        {rotulo}
      </p>

      <div className="mt-5 grid grid-cols-7 gap-y-1 text-center">
        {AVAILABILITY.diasDaSemana.map((dia, index) => (
          <abbr
            key={`${dia}-${index}`}
            className="rotulo-caps pb-2 text-[0.55rem] text-ink-muted no-underline"
          >
            {dia}
          </abbr>
        ))}

        {celulas.map((celula, index) => {
          if (celula === null) return <span key={`vazio-${index}`} aria-hidden />;

          const selecionada = celula.chave === entrada || celula.chave === saida;
          const noIntervalo =
            entrada !== null && saida !== null && celula.chave > entrada && celula.chave < saida;
          const estado = celula.ocupada ? AVAILABILITY.legendaOcupada : AVAILABILITY.legendaLivre;
          const clicavel = aoEscolher !== null && !celula.passado && !celula.ocupada;

          const classe = cx(
            "mx-auto flex size-9 items-center justify-center rounded-full text-[0.8125rem] tabular-nums transition-colors",
            celula.passado && "text-ink/25",
            !celula.passado && celula.ocupada && "text-ink/30 line-through decoration-ink/30",
            !celula.passado &&
              !celula.ocupada &&
              !selecionada &&
              !noIntervalo &&
              "bg-cafe/10 font-semibold text-cafe-deep",
            noIntervalo && "bg-cafe/25 font-semibold text-cafe-deep",
            selecionada && "bg-cafe font-semibold text-branco",
            clicavel && "cursor-pointer hover:ring-2 hover:ring-cafe/40",
          );

          if (!clicavel) {
            return (
              <span
                key={celula.chave}
                title={estado}
                aria-label={`${celula.numero} de ${rotulo}, ${estado}`}
                className={classe}
              >
                {celula.numero}
              </span>
            );
          }

          return (
            <button
              key={celula.chave}
              type="button"
              onClick={() => aoEscolher(celula.chave)}
              aria-pressed={selecionada}
              aria-label={`${celula.numero} de ${rotulo}, ${estado}`}
              className={classe}
            >
              {celula.numero}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type Precos = {
  readonly noite: number;
  readonly limpeza: number;
  readonly minimoNoites: number;
  readonly percentualCobrado: number;
};

export function Availability() {
  const [deslocamento, setDeslocamento] = useState(0);
  const [entrada, setEntrada] = useState<string | null>(null);
  const [saida, setSaida] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  /** Sem backend, vale o JSON gerado no build. Com backend, o que está no ar. */
  const [ocupadasAoVivo, setOcupadasAoVivo] = useState<ReadonlySet<string> | null>(null);
  const [precos, setPrecos] = useState<Precos | null>(null);

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

  const inicio = primeiroDiaDoMes();
  const mesBase = useMemo(() => {
    const d = new Date(inicio);
    d.setUTCMonth(d.getUTCMonth() + deslocamento);
    return d;
  }, [inicio, deslocamento]);

  const mesSeguinte = useMemo(() => {
    const d = new Date(mesBase);
    d.setUTCMonth(d.getUTCMonth() + 1);
    return d;
  }, [mesBase]);

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
      for (let d = entrada; d < dia; d = new Date(Date.parse(`${d}T00:00:00Z`) + 86400000).toISOString().slice(0, 10)) {
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
          hospedes: Number(form.get("hospedes")),
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

  const sincronizado = new Date(atualizadoEm).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Section id={AVAILABILITY.id} tone="branco" labelledBy={HEADING_ID} className="py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            id={HEADING_ID}
            tone="branco"
            eyebrow={AVAILABILITY.eyebrow}
            title={AVAILABILITY.title}
            lead={AVAILABILITY.lead}
          />

          <Reveal delay={0.1}>
            <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-3">
              <li className="flex items-center gap-2.5 text-sm text-ink/75">
                <span aria-hidden className="size-4 rounded-full bg-cafe/20" />
                {AVAILABILITY.legendaLivre}
              </li>
              <li className="flex items-center gap-2.5 text-sm text-ink/75">
                <span aria-hidden className="inline-block w-4 border-t border-ink/40" />
                {AVAILABILITY.legendaOcupada}
              </li>
            </ul>

            {RESERVAS_ATIVAS ? (
              <p className="mt-6 text-[0.9375rem] font-medium text-ink/85">
                {entrada && saida
                  ? RESERVA.periodoEscolhido(diaCurto(entrada), diaCurto(saida))
                  : entrada
                    ? RESERVA.escolhaSaida
                    : RESERVA.escolhaEntrada}
              </p>
            ) : (
              <>
                <p className="mt-6 text-[0.8125rem] text-ink-muted">
                  {`${AVAILABILITY.atualizadoPrefixo} ${sincronizado}.`}
                </p>
                <Button
                  href={CONTACT.airbnb}
                  seta
                  className="mt-7"
                  track={{ kind: "reserve", location: "datas" }}
                >
                  {AVAILABILITY.cta}
                </Button>
              </>
            )}

            {/* Resumo e formulário: só com backend e com as duas datas escolhidas */}
            {RESERVAS_ATIVAS && orcamento ? (
              <form onSubmit={enviar} className="mt-7">
                <dl className="space-y-2 border-t border-ink/10 pt-5 text-sm">
                  <div className="flex justify-between text-ink/75">
                    <dt>{`${RESERVA.linhaDiarias} · ${RESERVA.resumoNoites(noites)}`}</dt>
                    <dd className="tabular-nums">{dinheiro(orcamento.diarias)}</dd>
                  </div>
                  <div className="flex justify-between text-ink/75">
                    <dt>{RESERVA.linhaLimpeza}</dt>
                    <dd className="tabular-nums">{dinheiro(orcamento.limpeza)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-ink/10 pt-2 font-semibold text-ink">
                    <dt>{RESERVA.linhaTotal}</dt>
                    <dd className="tabular-nums">{dinheiro(orcamento.total)}</dd>
                  </div>
                  {orcamento.parcial ? (
                    <div className="flex justify-between font-semibold text-cafe-deep">
                      <dt>{RESERVA.linhaAgora}</dt>
                      <dd className="tabular-nums">{dinheiro(orcamento.agora)}</dd>
                    </div>
                  ) : null}
                </dl>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <label className="sm:col-span-2">
                    <span className="rotulo-caps text-[0.6rem] text-ink-muted">
                      {RESERVA.campos.nome}
                    </span>
                    <input
                      name="nome"
                      required
                      autoComplete="name"
                      className="mt-1 h-11 w-full rounded-xl border border-ink/15 bg-branco px-3 text-[0.9375rem] text-ink"
                    />
                  </label>
                  <label>
                    <span className="rotulo-caps text-[0.6rem] text-ink-muted">
                      {RESERVA.campos.email}
                    </span>
                    <input
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="mt-1 h-11 w-full rounded-xl border border-ink/15 bg-branco px-3 text-[0.9375rem] text-ink"
                    />
                  </label>
                  <label>
                    <span className="rotulo-caps text-[0.6rem] text-ink-muted">
                      {RESERVA.campos.telefone}
                    </span>
                    <input
                      name="telefone"
                      type="tel"
                      required
                      autoComplete="tel"
                      className="mt-1 h-11 w-full rounded-xl border border-ink/15 bg-branco px-3 text-[0.9375rem] text-ink"
                    />
                  </label>
                  <label>
                    <span className="rotulo-caps text-[0.6rem] text-ink-muted">
                      {RESERVA.campos.hospedes}
                    </span>
                    <select
                      name="hospedes"
                      defaultValue="2"
                      className="mt-1 h-11 w-full rounded-xl border border-ink/15 bg-branco px-3 text-[0.9375rem] text-ink"
                    >
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <button type="submit" disabled={enviando} className="btn btn-cafe mt-5 h-13 w-full px-6">
                  {enviando ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                      {RESERVA.enviando}
                    </>
                  ) : (
                    RESERVA.enviar
                  )}
                </button>

                <p className="mt-3 text-[0.75rem] leading-relaxed text-ink-muted">
                  {RESERVA.seguranca}
                </p>
              </form>
            ) : null}

            {erro ? (
              <p role="alert" className="mt-4 text-sm font-medium text-cafe-deep">
                {erro}
              </p>
            ) : null}

            {RESERVAS_ATIVAS && (entrada || saida) ? (
              <button
                type="button"
                onClick={() => {
                  setEntrada(null);
                  setSaida(null);
                  setErro(null);
                }}
                className="link-draw mt-4 text-sm text-ink-muted"
              >
                {RESERVA.limpar}
              </button>
            ) : null}
          </Reveal>
        </div>

        <Reveal delay={0.08} className="lg:col-span-7">
          <div className="cartao p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setDeslocamento((v) => Math.max(0, v - 1))}
                disabled={deslocamento === 0}
                aria-label={AVAILABILITY.mesAnterior}
                className="seta-trilho size-10"
              >
                <ChevronLeft className="size-5" strokeWidth={1.75} aria-hidden />
              </button>

              <button
                type="button"
                onClick={() => setDeslocamento((v) => Math.min(11, v + 1))}
                disabled={deslocamento === 11}
                aria-label={AVAILABILITY.mesSeguinte}
                className="seta-trilho size-10"
              >
                <ChevronRight className="size-5" strokeWidth={1.75} aria-hidden />
              </button>
            </div>

            <div className="mt-6 grid gap-10 sm:grid-cols-2 sm:gap-6">
              <Mes
                base={mesBase}
                ocupada={ocupada}
                entrada={entrada}
                saida={saida}
                aoEscolher={RESERVAS_ATIVAS ? escolher : null}
              />
              <div className="max-sm:hidden">
                <Mes
                  base={mesSeguinte}
                  ocupada={ocupada}
                  entrada={entrada}
                  saida={saida}
                  aoEscolher={RESERVAS_ATIVAS ? escolher : null}
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
