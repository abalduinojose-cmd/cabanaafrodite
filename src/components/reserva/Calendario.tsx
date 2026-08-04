"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import { AVAILABILITY } from "@/data/content";
import { cx } from "@/lib/cx";

/**
 * Calendário de disponibilidade, usado na home (só leitura) e na página de
 * reserva (selecionável). O visual é propositalmente leve: dia livre é só o
 * número, dia ocupado apaga, e a tinta forte fica reservada para a seleção.
 */

export function primeiroDiaDoMes(): Date {
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
      <p className="text-center font-display text-[1.05rem] font-semibold text-ink first-letter:uppercase">
        {rotulo}
      </p>

      <div className="mt-4 grid grid-cols-7 gap-y-1.5 text-center">
        {AVAILABILITY.diasDaSemana.map((dia, index) => (
          <abbr
            key={`${dia}-${index}`}
            className="rotulo-caps pb-1.5 text-[0.5rem] text-ink/35 no-underline"
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
            "mx-auto flex size-9 items-center justify-center rounded-full text-[0.8125rem] tabular-nums transition-all duration-200",
            // passado e ocupada somem de leve; livre é só o número
            celula.passado && "text-ink/20",
            !celula.passado && celula.ocupada && "text-ink/25 line-through decoration-ink/25",
            !celula.passado && !celula.ocupada && !selecionada && !noIntervalo && "text-ink/80",
            noIntervalo && "rounded-none bg-cafe/12 text-cafe-deep",
            selecionada && "bg-cafe font-semibold text-branco shadow-[0_6px_16px_-6px_rgb(122_82_54/0.7)]",
            clicavel && !selecionada && "cursor-pointer hover:bg-cafe/10 hover:text-cafe-deep",
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

/** Legenda discreta: um ponto, um risco, nada gritando. */
export function LegendaDatas({ className }: { readonly className?: string }) {
  return (
    <ul className={cx("flex items-center gap-6", className)}>
      <li className="flex items-center gap-2 text-[0.75rem] text-ink-muted">
        <span aria-hidden className="size-1.5 rounded-full bg-cafe/70" />
        {AVAILABILITY.legendaLivre}
      </li>
      <li className="flex items-center gap-2 text-[0.75rem] text-ink-muted">
        <span aria-hidden className="inline-block w-3 border-t border-ink/30" />
        {AVAILABILITY.legendaOcupada}
      </li>
    </ul>
  );
}

type CalendarioProps = {
  readonly ocupada: (dia: string) => boolean;
  readonly entrada?: string | null;
  readonly saida?: string | null;
  readonly aoEscolher?: ((dia: string) => void) | null;
};

export function Calendario({
  ocupada,
  entrada = null,
  saida = null,
  aoEscolher = null,
}: CalendarioProps) {
  const [deslocamento, setDeslocamento] = useState(0);
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

  return (
    <div className="relative">
      {/* setas flutuando na altura dos títulos dos meses */}
      <button
        type="button"
        onClick={() => setDeslocamento((v) => Math.max(0, v - 1))}
        disabled={deslocamento === 0}
        aria-label={AVAILABILITY.mesAnterior}
        className="seta-trilho absolute -top-1.5 left-0 z-10 size-9"
      >
        <ChevronLeft className="size-4" strokeWidth={1.75} aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => setDeslocamento((v) => Math.min(11, v + 1))}
        disabled={deslocamento === 11}
        aria-label={AVAILABILITY.mesSeguinte}
        className="seta-trilho absolute -top-1.5 right-0 z-10 size-9"
      >
        <ChevronRight className="size-4" strokeWidth={1.75} aria-hidden />
      </button>

      <div className="grid gap-10 sm:grid-cols-2 sm:gap-8">
        <Mes base={mesBase} ocupada={ocupada} entrada={entrada} saida={saida} aoEscolher={aoEscolher} />
        <div className="max-sm:hidden">
          <Mes
            base={mesSeguinte}
            ocupada={ocupada}
            entrada={entrada}
            saida={saida}
            aoEscolher={aoEscolher}
          />
        </div>
      </div>
    </div>
  );
}
