import "server-only";

import { periodosDoAirbnb } from "@/server/airbnb";
import { noitesEntre } from "@/server/datas";
import { PRECOS } from "@/server/env";
import { repositorio, type NovaReserva, type Periodo, type Reserva } from "@/server/repo";

export { DatasIndisponiveis } from "@/server/repo/tipos";
export type { Reserva } from "@/server/repo/tipos";

export type DadosDoHospede = {
  readonly entrada: string;
  readonly saida: string;
  readonly nome: string;
  readonly email: string;
  readonly telefone: string;
  readonly hospedes: number;
};

export type Orcamento = {
  readonly noites: number;
  readonly diarias: number;
  readonly limpeza: number;
  readonly total: number;
  readonly cobradoAgora: number;
};

/** Cálculo de preço: sempre no servidor, nunca no que o navegador mandar. */
export function orcar(entrada: string, saida: string): Orcamento {
  const noites = noitesEntre(entrada, saida);
  const diarias = noites * PRECOS.noite;
  const total = diarias + PRECOS.limpeza;
  const cobradoAgora = Math.round((total * PRECOS.percentualCobrado) / 100);

  return { noites, diarias, limpeza: PRECOS.limpeza, total, cobradoAgora };
}

/** Períodos vendidos pelo site (pendentes no prazo + confirmadas). */
export async function periodosDoSite(): Promise<readonly Periodo[]> {
  const repo = await repositorio();
  return repo.periodosOcupados();
}

/** Tudo que está ocupado: o que veio do Airbnb mais o que foi vendido aqui. */
export async function periodosOcupados(): Promise<readonly Periodo[]> {
  const [airbnb, site] = await Promise.all([periodosDoAirbnb(), periodosDoSite()]);
  return [...airbnb, ...site];
}

/** Abre a reserva como pendente, segurando as datas até o prazo de pagamento. */
export async function criarPendente(dados: DadosDoHospede): Promise<Reserva> {
  const repo = await repositorio();

  // O calendário do Airbnb não passa pela trava do banco: confere aqui.
  const doAirbnb = await periodosDoAirbnb();
  const conflita = doAirbnb.some((p) => p.inicio < dados.saida && dados.entrada < p.fim);
  if (conflita) {
    const { DatasIndisponiveis } = await import("@/server/repo/tipos");
    throw new DatasIndisponiveis();
  }

  const orcamento = orcar(dados.entrada, dados.saida);

  const nova: NovaReserva = {
    ...dados,
    noites: orcamento.noites,
    valorTotal: orcamento.total,
    valorCobrado: orcamento.cobradoAgora,
  };

  return repo.criarPendente(nova, PRECOS.minutosParaPagar);
}

export async function buscar(id: string): Promise<Reserva | null> {
  const repo = await repositorio();
  return repo.buscar(id);
}

export async function anotarPreferencia(id: string, preferenceId: string): Promise<void> {
  const repo = await repositorio();
  await repo.anotarPreferencia(id, preferenceId);
}

export async function confirmar(id: string, paymentId: string): Promise<void> {
  const repo = await repositorio();
  await repo.confirmar(id, paymentId);
}

export async function cancelar(id: string, paymentId: string | null): Promise<void> {
  const repo = await repositorio();
  await repo.cancelar(id, paymentId);
}

export async function registrarWebhook(paymentId: string, payload: unknown): Promise<boolean> {
  const repo = await repositorio();
  return repo.registrarWebhook(paymentId, payload);
}
