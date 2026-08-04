import "server-only";

import { MODO } from "@/server/env";
import { repositorioEmMemoria } from "@/server/repo/memoria";
import type { Repositorio } from "@/server/repo/tipos";

/**
 * Escolhe onde as reservas ficam guardadas.
 *
 * O import do Postgres é preguiçoso de propósito: sem `DATABASE_URL` o
 * módulo nem é carregado, e o site sobe sem exigir banco nenhum.
 */
let cache: Repositorio | null = null;

export async function repositorio(): Promise<Repositorio> {
  if (cache) return cache;

  if (MODO.banco === "memoria") {
    console.warn(
      "[reservas] sem DATABASE_URL: guardando as reservas na memória do processo. " +
        "Serve para experimentar, não para produção.",
    );
    cache = repositorioEmMemoria;
    return cache;
  }

  const { repositorioPostgres } = await import("@/server/repo/postgres");
  cache = repositorioPostgres;
  return cache;
}

export * from "@/server/repo/tipos";
