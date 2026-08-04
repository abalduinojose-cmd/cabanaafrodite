import "server-only";
import { Pool } from "pg";

import { env } from "@/server/env";

/**
 * Pool único de conexões.
 *
 * Em desenvolvimento o Next recarrega os módulos a cada mudança, o que
 * criaria um pool novo por recarga até estourar o limite do banco. Guardar
 * no escopo global evita isso.
 */
const globalParaPool = globalThis as typeof globalThis & { _pool?: Pool };

export function db(): Pool {
  globalParaPool._pool ??= new Pool({
    connectionString: env.databaseUrl,
    // Postgres gerenciado (Neon, Supabase) exige TLS.
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 20_000,
  });

  return globalParaPool._pool;
}
