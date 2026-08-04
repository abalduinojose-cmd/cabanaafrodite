import "server-only";
import { Pool } from "pg";

import { env } from "@/server/env";
import { DatasIndisponiveis, type Repositorio, type Reserva } from "@/server/repo/tipos";

/**
 * Reservas no Postgres. É aqui que o sistema fica de pé para valer.
 *
 * A garantia de não existirem duas estadias sobrepostas é da restrição
 * `sem_sobreposicao` (EXCLUDE USING gist) declarada em db/schema.sql, e não
 * deste código: nem duas requisições no mesmo instante furam a fila.
 */

const globalParaPool = globalThis as typeof globalThis & { _pool?: Pool };

function db(): Pool {
  // Em desenvolvimento o Next recarrega os módulos a cada alteração; sem
  // guardar no escopo global, cada recarga abriria um pool novo.
  globalParaPool._pool ??= new Pool({
    connectionString: env.databaseUrl,
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 20_000,
  });

  return globalParaPool._pool;
}

type Linha = {
  id: string;
  entrada: string;
  saida: string;
  hospede_nome: string;
  noites: number;
  valor_total: number;
  valor_cobrado: number;
  status: Reserva["status"];
};

const paraReserva = (linha: Linha): Reserva => ({
  id: linha.id,
  entrada: linha.entrada,
  saida: linha.saida,
  nome: linha.hospede_nome,
  noites: linha.noites,
  valorTotal: linha.valor_total,
  valorCobrado: linha.valor_cobrado,
  status: linha.status,
});

const CAMPOS = `id,
  to_char(lower(periodo), 'YYYY-MM-DD') AS entrada,
  to_char(upper(periodo), 'YYYY-MM-DD') AS saida,
  hospede_nome, noites, valor_total, valor_cobrado, status`;

async function liberarExpiradas(): Promise<void> {
  await db().query(
    `UPDATE reservas
        SET status = 'cancelada', atualizada_em = now()
      WHERE status = 'pendente' AND expira_em < now()`,
  );
}

export const repositorioPostgres: Repositorio = {
  async criarPendente(dados, minutosParaPagar) {
    await liberarExpiradas();

    try {
      const { rows } = await db().query<Linha>(
        `INSERT INTO reservas
           (periodo, hospede_nome, hospede_email, hospede_fone, hospedes,
            noites, valor_total, valor_cobrado, expira_em)
         VALUES
           (daterange($1::date, $2::date, '[)'), $3, $4, $5, $6,
            $7, $8, $9, now() + ($10 || ' minutes')::interval)
         RETURNING ${CAMPOS}`,
        [
          dados.entrada,
          dados.saida,
          dados.nome,
          dados.email,
          dados.telefone,
          dados.hospedes,
          dados.noites,
          dados.valorTotal,
          dados.valorCobrado,
          String(minutosParaPagar),
        ],
      );

      const linha = rows[0];
      if (!linha) throw new Error("Insert não devolveu a reserva");
      return paraReserva(linha);
    } catch (erro) {
      // 23P01 = exclusion_violation: outra reserva pegou a data primeiro.
      if (typeof erro === "object" && erro !== null && "code" in erro && erro.code === "23P01") {
        throw new DatasIndisponiveis();
      }
      throw erro;
    }
  },

  async buscar(id) {
    await liberarExpiradas();
    const { rows } = await db().query<Linha>(
      `SELECT ${CAMPOS} FROM reservas WHERE id = $1`,
      [id],
    );
    const linha = rows[0];
    return linha ? paraReserva(linha) : null;
  },

  async periodosOcupados() {
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
  },

  async anotarPreferencia(id, preferenceId) {
    await db().query(
      `UPDATE reservas SET mp_preference_id = $2, atualizada_em = now() WHERE id = $1`,
      [id, preferenceId],
    );
  },

  async confirmar(id, paymentId) {
    await db().query(
      `UPDATE reservas
          SET status = 'confirmada', mp_payment_id = $2, atualizada_em = now()
        WHERE id = $1 AND status <> 'cancelada'`,
      [id, paymentId],
    );
  },

  async cancelar(id, paymentId) {
    await db().query(
      `UPDATE reservas
          SET status = 'cancelada',
              mp_payment_id = COALESCE($2, mp_payment_id),
              atualizada_em = now()
        WHERE id = $1 AND status = 'pendente'`,
      [id, paymentId],
    );
  },

  async registrarWebhook(paymentId, payload) {
    const { rowCount } = await db().query(
      `INSERT INTO webhooks_recebidos (payment_id, payload)
       VALUES ($1, $2)
       ON CONFLICT (payment_id) DO NOTHING`,
      [paymentId, JSON.stringify(payload)],
    );
    return rowCount === 1;
  },
};
