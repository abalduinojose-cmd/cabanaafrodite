import "server-only";

/**
 * Datas de estadia são sempre dias civis, nunca instantes. Todo o sistema
 * trabalha com a string `YYYY-MM-DD` e faz as contas em UTC, para não haver
 * surpresa de fuso virando o dia.
 */

const FORMATO = /^\d{4}-\d{2}-\d{2}$/;

export function ehDataValida(valor: unknown): valor is string {
  if (typeof valor !== "string" || !FORMATO.test(valor)) return false;
  const data = new Date(`${valor}T00:00:00Z`);
  return !Number.isNaN(data.getTime()) && data.toISOString().slice(0, 10) === valor;
}

export function hoje(): string {
  return new Date().toISOString().slice(0, 10);
}

export function somarDias(dia: string, dias: number): string {
  const data = new Date(`${dia}T00:00:00Z`);
  data.setUTCDate(data.getUTCDate() + dias);
  return data.toISOString().slice(0, 10);
}

/** Noites entre a chegada e a saída. Saída não conta: é dia de ir embora. */
export function noitesEntre(entrada: string, saida: string): number {
  const ms = Date.parse(`${saida}T00:00:00Z`) - Date.parse(`${entrada}T00:00:00Z`);
  return Math.round(ms / 86_400_000);
}

/** Cada noite ocupada de `[entrada, saida)`. */
export function noitesDoPeriodo(entrada: string, saida: string): string[] {
  const noites: string[] = [];
  for (let dia = entrada; dia < saida; dia = somarDias(dia, 1)) noites.push(dia);
  return noites;
}

/** `20260802` do iCal vira `2026-08-02`. */
export function deIcal(bruto: string): string {
  return `${bruto.slice(0, 4)}-${bruto.slice(4, 6)}-${bruto.slice(6, 8)}`;
}

/** `2026-08-02` vira `20260802`, como o iCal espera. */
export function paraIcal(dia: string): string {
  return dia.replaceAll("-", "");
}
