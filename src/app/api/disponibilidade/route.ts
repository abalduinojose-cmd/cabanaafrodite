import { NextResponse } from "next/server";

import { noitesDoPeriodo } from "@/server/datas";
import { PRECOS } from "@/server/env";
import { periodosOcupados } from "@/server/reservas";

export const dynamic = "force-dynamic";

/**
 * Noites ocupadas, juntando o calendário do Airbnb com o que já foi vendido
 * aqui. É o que o calendário do site consulta quando as reservas estão
 * ligadas; sem isso ele cai no JSON estático gerado no build.
 */
export async function GET() {
  try {
    const periodos = await periodosOcupados();

    const noites = new Set<string>();
    for (const periodo of periodos) {
      for (const noite of noitesDoPeriodo(periodo.inicio, periodo.fim)) noites.add(noite);
    }

    return NextResponse.json(
      {
        atualizadoEm: new Date().toISOString(),
        ocupadas: [...noites].sort(),
        precos: {
          noite: PRECOS.noite,
          limpeza: PRECOS.limpeza,
          minimoNoites: PRECOS.minimoNoites,
          percentualCobrado: PRECOS.percentualCobrado,
        },
      },
      { headers: { "cache-control": "public, max-age=60, stale-while-revalidate=300" } },
    );
  } catch (erro) {
    console.error("[disponibilidade]", erro);
    return NextResponse.json({ erro: "indisponivel" }, { status: 503 });
  }
}
