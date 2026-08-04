import dados from "@/data/disponibilidade.json";

/**
 * Lê o JSON gerado por `npm run calendario` e responde a única pergunta que
 * a interface faz: esta noite está ocupada?
 *
 * Convenção do iCal: `fim` é exclusivo. Uma reserva de 02 a 04 ocupa as
 * noites de 02 e 03, e o dia 04 já está livre para quem chega.
 */

const OCUPADAS: ReadonlySet<string> = (() => {
  const noites = new Set<string>();

  for (const bloco of dados.ocupados) {
    const inicio = new Date(`${bloco.inicio}T00:00:00Z`);
    const fim = new Date(`${bloco.fim}T00:00:00Z`);

    for (let d = inicio; d < fim; d.setUTCDate(d.getUTCDate() + 1)) {
      noites.add(d.toISOString().slice(0, 10));
    }
  }

  return noites;
})();

export function noiteOcupada(dia: string): boolean {
  return OCUPADAS.has(dia);
}

/** Quando o calendário foi sincronizado com o Airbnb pela última vez. */
export const atualizadoEm: string = dados.atualizadoEm;

/** Última noite que o anúncio já tem no calendário. */
export const ultimaNoite: string | undefined = dados.ocupados.at(-1)?.fim;
