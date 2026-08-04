import "server-only";
import { randomUUID } from "node:crypto";

import { DatasIndisponiveis, type Periodo, type Repositorio, type Reserva } from "@/server/repo/tipos";

/**
 * Reservas na memória do processo, para operar o site antes de existir
 * banco.
 *
 * Serve para experimentar o fluxo inteiro de ponta a ponta. Não serve para
 * produção: some quando o servidor reinicia e não funciona com mais de uma
 * instância. Com `DATABASE_URL` no ambiente, o Postgres assume no lugar e
 * passa a ser ele a garantir que duas estadias não se sobrepõem.
 */

type Registro = Reserva & { readonly expiraEm: number; preferenceId?: string; paymentId?: string };

type Estado = { readonly reservas: Map<string, Registro>; readonly webhooks: Set<string> };

const globalParaEstado = globalThis as typeof globalThis & { _reservasMemoria?: Estado };

function estado(): Estado {
  globalParaEstado._reservasMemoria ??= { reservas: new Map(), webhooks: new Set() };
  return globalParaEstado._reservasMemoria;
}

/** Vence as pendentes que ninguém pagou dentro do prazo. */
function liberarExpiradas(): void {
  const agora = Date.now();
  for (const [id, reserva] of estado().reservas) {
    if (reserva.status === "pendente" && reserva.expiraEm < agora) {
      estado().reservas.set(id, { ...reserva, status: "cancelada" });
    }
  }
}

function ativas(): Registro[] {
  liberarExpiradas();
  return [...estado().reservas.values()].filter(
    (r) => r.status === "pendente" || r.status === "confirmada",
  );
}

function atualizar(id: string, mudanca: Partial<Registro>): void {
  const atual = estado().reservas.get(id);
  if (atual) estado().reservas.set(id, { ...atual, ...mudanca });
}

export const repositorioEmMemoria: Repositorio = {
  async criarPendente(dados, minutosParaPagar) {
    // Sem a restrição do Postgres, a checagem de sobreposição é aqui. O
    // Node é monothread, então entre esta leitura e a escrita abaixo nada
    // mais roda: para um processo só, isso basta.
    const conflita = ativas().some((r) => r.entrada < dados.saida && dados.entrada < r.saida);
    if (conflita) throw new DatasIndisponiveis();

    const reserva: Registro = {
      id: randomUUID(),
      entrada: dados.entrada,
      saida: dados.saida,
      nome: dados.nome,
      noites: dados.noites,
      valorTotal: dados.valorTotal,
      valorCobrado: dados.valorCobrado,
      status: "pendente",
      expiraEm: Date.now() + minutosParaPagar * 60_000,
    };

    estado().reservas.set(reserva.id, reserva);
    return reserva;
  },

  async buscar(id) {
    liberarExpiradas();
    return estado().reservas.get(id) ?? null;
  },

  async periodosOcupados() {
    const hoje = new Date().toISOString().slice(0, 10);
    return ativas()
      .filter((r) => r.saida >= hoje)
      .map<Periodo>((r) => ({ inicio: r.entrada, fim: r.saida }))
      .sort((a, b) => a.inicio.localeCompare(b.inicio));
  },

  async anotarPreferencia(id, preferenceId) {
    atualizar(id, { preferenceId });
  },

  async confirmar(id, paymentId) {
    const atual = estado().reservas.get(id);
    if (atual && atual.status !== "cancelada") {
      atualizar(id, { status: "confirmada", paymentId });
    }
  },

  async cancelar(id, paymentId) {
    const atual = estado().reservas.get(id);
    if (atual?.status === "pendente") {
      atualizar(id, { status: "cancelada", paymentId: paymentId ?? atual.paymentId });
    }
  },

  async registrarWebhook(paymentId) {
    if (estado().webhooks.has(paymentId)) return false;
    estado().webhooks.add(paymentId);
    return true;
  },
};
