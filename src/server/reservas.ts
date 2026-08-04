import "server-only";

import { db } from "@/server/db";
import { PRECOS } from "@/server/env";
import { noitesEntre } from "@/server/datas";
import { periodosDoAirbnb, type Periodo } from "@/server/airbnb";

export type NovaReserva = {
  readonly entrada: string;
  readonly saida: string;
  readonly nome: string;
  readonly email: string;
  readonly telefone: string;
  readonly hospedes: number;
};

export type Reserva = {
  readonly id: string;
  readonly entrada: string;
  readonly saida: string;
  readonly valorTotal: number;
  readonly valorCobrado: number;
  readonly noites: number;
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

/** Solta as reservas que ninguém pagou dentro do prazo. */
async function liberarExpiradas(): Promise<void> {
  await db().query(
    `UPDATE reservas
        SET status = 'cancelada', atualizada_em = now()
      WHERE status = 'pendente' AND expira_em < now()`,
  );
}

/** Períodos que o site já vendeu (pendentes no prazo + confirmadas). */
export async function periodosDoSite(): Promise<Periodo[]> {
  await liberarExpiradas();

  const { rows } = await db().query<{ inicio: string; fim: string }>(
    `SELECT to_char(lower(periodo), 'YYYY-MM-DD') AS inicio,
            to_char(upper(periodo), 'YYYY-MM-DD') AS fim
       FROM reservas
      WHERE status IN ('pendente', 'confirmada')
        AND upper(periodo) >= current_date
      ORDER BY periodo`,
  );

  return rows;
}

/** Tudo que está ocupado: o que veio do Airbnb mais o que foi vendido aqui. */
export async function periodosOcupados(): Promise<readonly Periodo[]> {
  const [airbnb, site] = await Promise.all([periodosDoAirbnb(), periodosDoSite()]);
  return [...airbnb, ...site];
}

export class DatasIndisponiveis extends Error {
  constructor() {
    super("As datas escolhidas acabaram de ser ocupadas.");
    this.name = "DatasIndisponiveis";
  }
}

/**
 * Cria a reserva como pendente, segurando as datas.
 *
 * A garantia de não haver duas estadias sobrepostas é da restrição
 * `sem_sobreposicao` no banco, não deste código: se duas pessoas apertarem
 * "reservar" no mesmo segundo para a mesma noite, o Postgres deixa uma
 * passar e rejeita a outra.
 */
export async function criarPendente(dados: NovaReserva): Promise<Reserva> {
  await liberarExpiradas();

  // O que já está no Airbnb não passa pela restrição do banco: confere aqui.
  const doAirbnb = await periodosDoAirbnb();
  const conflita = doAirbnb.some((p) => p.inicio < dados.saida && dados.entrada < p.fim);
  if (conflita) throw new DatasIndisponiveis();

  const orcamento = orcar(dados.entrada, dados.saida);

  try {
    const { rows } = await db().query<{ id: string }>(
      `INSERT INTO reservas
         (periodo, hospede_nome, hospede_email, hospede_fone, hospedes,
          noites, valor_total, valor_cobrado, expira_em)
       VALUES
         (daterange($1::date, $2::date, '[)'), $3, $4, $5, $6,
          $7, $8, $9, now() + ($10 || ' minutes')::interval)
       RETURNING id`,
      [
        dados.entrada,
        dados.saida,
        dados.nome,
        dados.email,
        dados.telefone,
        dados.hospedes,
        orcamento.noites,
        orcamento.total,
        orcamento.cobradoAgora,
        String(PRECOS.minutosParaPagar),
      ],
    );

    const id = rows[0]?.id;
    if (!id) throw new Error("Insert não devolveu id");

    return {
      id,
      entrada: dados.entrada,
      saida: dados.saida,
      valorTotal: orcamento.total,
      valorCobrado: orcamento.cobradoAgora,
      noites: orcamento.noites,
    };
  } catch (erro) {
    // 23P01 = exclusion_violation: outra reserva pegou a data primeiro.
    if (typeof erro === "object" && erro !== null && "code" in erro && erro.code === "23P01") {
      throw new DatasIndisponiveis();
    }
    throw erro;
  }
}

export async function anotarPreferencia(id: string, preferenceId: string): Promise<void> {
  await db().query(
    `UPDATE reservas SET mp_preference_id = $2, atualizada_em = now() WHERE id = $1`,
    [id, preferenceId],
  );
}

export async function confirmar(id: string, paymentId: string): Promise<void> {
  await db().query(
    `UPDATE reservas
        SET status = 'confirmada', mp_payment_id = $2, atualizada_em = now()
      WHERE id = $1 AND status <> 'cancelada'`,
    [id, paymentId],
  );
}

export async function cancelar(id: string, paymentId: string | null): Promise<void> {
  await db().query(
    `UPDATE reservas
        SET status = 'cancelada', mp_payment_id = COALESCE($2, mp_payment_id), atualizada_em = now()
      WHERE id = $1 AND status = 'pendente'`,
    [id, paymentId],
  );
}

/** Marca a notificação como vista. Devolve false se já tinha sido processada. */
export async function registrarWebhook(paymentId: string, payload: unknown): Promise<boolean> {
  const { rowCount } = await db().query(
    `INSERT INTO webhooks_recebidos (payment_id, payload)
     VALUES ($1, $2)
     ON CONFLICT (payment_id) DO NOTHING`,
    [paymentId, JSON.stringify(payload)],
  );

  return rowCount === 1;
}
