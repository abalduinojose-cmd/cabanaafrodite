"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AVAILABILITY, CONTACT } from "@/data/content";
import { atualizadoEm, noiteOcupada } from "@/lib/disponibilidade";
import { cx } from "@/lib/cx";

const HEADING_ID = "titulo-datas";

/** Data de hoje em UTC, para casar com as chaves ISO do calendário. */
function hojeUTC(): Date {
  const agora = new Date();
  return new Date(Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth(), 1));
}

type Dia = {
  readonly chave: string;
  readonly numero: number;
  readonly ocupada: boolean;
  readonly passado: boolean;
};

function montarMes(base: Date): readonly (Dia | null)[] {
  const ano = base.getUTCFullYear();
  const mes = base.getUTCMonth();
  const primeiro = new Date(Date.UTC(ano, mes, 1));
  const totalDias = new Date(Date.UTC(ano, mes + 1, 0)).getUTCDate();
  const hoje = new Date().toISOString().slice(0, 10);

  // Casas vazias até o dia da semana em que o mês começa
  const celulas: (Dia | null)[] = Array.from({ length: primeiro.getUTCDay() }, () => null);

  for (let numero = 1; numero <= totalDias; numero += 1) {
    const chave = new Date(Date.UTC(ano, mes, numero)).toISOString().slice(0, 10);
    celulas.push({
      chave,
      numero,
      ocupada: noiteOcupada(chave),
      passado: chave < hoje,
    });
  }

  return celulas;
}

function Mes({ base }: { readonly base: Date }) {
  const celulas = useMemo(() => montarMes(base), [base]);
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

        {celulas.map((celula, index) =>
          celula === null ? (
            <span key={`vazio-${index}`} aria-hidden />
          ) : (
            <span
              key={celula.chave}
              title={celula.ocupada ? AVAILABILITY.legendaOcupada : AVAILABILITY.legendaLivre}
              aria-label={`${celula.numero} de ${rotulo}, ${
                celula.ocupada ? AVAILABILITY.legendaOcupada : AVAILABILITY.legendaLivre
              }`}
              className={cx(
                "mx-auto flex size-9 items-center justify-center rounded-full text-[0.8125rem] tabular-nums transition-colors",
                celula.passado && "text-ink/25",
                !celula.passado && celula.ocupada && "text-ink/30 line-through decoration-ink/30",
                !celula.passado && !celula.ocupada && "bg-cafe/10 font-semibold text-cafe-deep",
              )}
            >
              {celula.numero}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

export function Availability() {
  const [deslocamento, setDeslocamento] = useState(0);
  const inicio = hojeUTC();

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
                <span
                  aria-hidden
                  className="inline-block w-4 border-t border-ink/40 line-through"
                />
                {AVAILABILITY.legendaOcupada}
              </li>
            </ul>

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
              <Mes base={mesBase} />
              <div className="max-sm:hidden">
                <Mes base={mesSeguinte} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
