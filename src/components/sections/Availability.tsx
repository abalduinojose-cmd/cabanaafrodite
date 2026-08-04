"use client";

import { useCallback, useEffect, useState } from "react";

import { Calendario, LegendaDatas } from "@/components/reserva/Calendario";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AVAILABILITY, RESERVAR, RESERVAS_ATIVAS } from "@/data/content";
import { atualizadoEm, noiteOcupada } from "@/lib/disponibilidade";

const HEADING_ID = "titulo-datas";

/**
 * Seção de disponibilidade da home: o mapa de datas, só leitura. A escolha
 * do período e o pagamento acontecem na página /reserva, aberta em aba
 * própria pelo botão.
 */
export function Availability() {
  const [ocupadasAoVivo, setOcupadasAoVivo] = useState<ReadonlySet<string> | null>(null);

  /** Sem backend, vale o JSON gerado no build. Com backend, o que está no ar. */
  useEffect(() => {
    if (!RESERVAS_ATIVAS) return;
    let ativo = true;

    void fetch("/api/disponibilidade")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((dados: { ocupadas: string[] }) => {
        if (ativo) setOcupadasAoVivo(new Set(dados.ocupadas));
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
            <LegendaDatas className="mt-8" />

            {!RESERVAS_ATIVAS ? (
              <p className="mt-5 text-[0.8125rem] text-ink-muted">
                {`${AVAILABILITY.atualizadoPrefixo} ${sincronizado}.`}
              </p>
            ) : null}

            <Button
              href={RESERVAR.href}
              seta
              novaAba={RESERVAR.novaAba}
              className="mt-7"
              track={{ kind: "reserve", location: "datas" }}
            >
              {AVAILABILITY.cta}
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.08} className="lg:col-span-7">
          <div className="cartao p-6 md:p-8">
            <Calendario ocupada={ocupada} />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
