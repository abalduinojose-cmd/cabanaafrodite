import "server-only";

import { deIcal } from "@/server/datas";
import { env } from "@/server/env";

/**
 * Lê o calendário do Airbnb.
 *
 * O arquivo .ics traz, em cada reserva, a URL interna do painel da anfitriã
 * (com o código de confirmação) e os últimos dígitos do telefone do hóspede.
 * Nada disso sai daqui: só as datas atravessam esta função.
 */

export type Periodo = { readonly inicio: string; readonly fim: string };

type Cache = { readonly em: number; readonly periodos: readonly Periodo[] };

const VALIDADE_MS = 10 * 60 * 1000;
const globalParaCache = globalThis as typeof globalThis & { _icalCache?: Cache };

export function extrairPeriodos(ics: string): Periodo[] {
  // Linhas continuadas do iCal começam com espaço ou tab.
  const linhas = ics.replace(/\r\n[ \t]/g, "").split(/\r?\n/);

  const periodos: Periodo[] = [];
  let atual: { inicio?: string; fim?: string } | null = null;

  for (const linha of linhas) {
    if (linha === "BEGIN:VEVENT") {
      atual = {};
      continue;
    }
    if (linha === "END:VEVENT") {
      if (atual?.inicio && atual.fim) periodos.push({ inicio: atual.inicio, fim: atual.fim });
      atual = null;
      continue;
    }
    if (!atual) continue;

    const data = /^DT(START|END)[^:]*:(\d{8})/.exec(linha);
    if (data?.[1] && data[2]) {
      if (data[1] === "START") atual.inicio = deIcal(data[2]);
      else atual.fim = deIcal(data[2]);
    }
  }

  return periodos;
}

/**
 * Períodos bloqueados no Airbnb, com cache curto em memória: o feed é
 * consultado a cada dez minutos, no máximo. Se o Airbnb falhar, devolve o
 * último resultado bom em vez de derrubar a página; e se nunca houve um,
 * devolve vazio (o banco local ainda barra as datas já vendidas aqui).
 */
export async function periodosDoAirbnb(): Promise<readonly Periodo[]> {
  const url = env.airbnbIcalUrl;
  if (!url) return [];

  const cache = globalParaCache._icalCache;
  if (cache && Date.now() - cache.em < VALIDADE_MS) return cache.periodos;

  try {
    const resposta = await fetch(url, {
      headers: { "user-agent": "cabana-afrodite/1.0" },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!resposta.ok) throw new Error(`Airbnb respondeu ${resposta.status}`);

    const periodos = extrairPeriodos(await resposta.text());
    globalParaCache._icalCache = { em: Date.now(), periodos };
    return periodos;
  } catch (erro) {
    console.error("[airbnb] falha ao ler o calendário:", erro);
    return cache?.periodos ?? [];
  }
}
