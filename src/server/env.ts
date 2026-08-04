import "server-only";

/**
 * Configuração que só existe no servidor: credenciais e regras de preço.
 *
 * O sistema roda em dois modos, e ele se decide sozinho pelo que existe no
 * ambiente. Sem `DATABASE_URL` as reservas ficam na memória do processo;
 * sem `MP_ACCESS_TOKEN` o checkout é uma simulação. Isso permite operar e
 * testar o fluxo inteiro antes de abrir conta em qualquer lugar, e ligar o
 * de verdade depois sem tocar em uma linha de código.
 */

function obrigatoria(nome: string): string {
  const valor = process.env[nome];
  if (!valor) throw new Error(`Variável de ambiente ausente: ${nome}`);
  return valor;
}

function numero(nome: string, padrao: number): number {
  const bruto = process.env[nome];
  if (!bruto) return padrao;
  const valor = Number(bruto);
  if (!Number.isFinite(valor)) throw new Error(`${nome} precisa ser um número`);
  return valor;
}

export const RESERVAS_ATIVAS = process.env.NEXT_PUBLIC_RESERVAS_ATIVAS === "1";

/** Onde as reservas ficam guardadas e quem processa o pagamento. */
export const MODO = {
  get banco(): "postgres" | "memoria" {
    return process.env.DATABASE_URL ? "postgres" : "memoria";
  },
  get pagamento(): "mercadopago" | "simulado" {
    return process.env.MP_ACCESS_TOKEN ? "mercadopago" : "simulado";
  },
  get emDemonstracao(): boolean {
    return this.banco === "memoria" || this.pagamento === "simulado";
  },
} as const;

export const env = {
  get databaseUrl(): string {
    return obrigatoria("DATABASE_URL");
  },
  get mpAccessToken(): string {
    return obrigatoria("MP_ACCESS_TOKEN");
  },
  get mpWebhookSecret(): string {
    return obrigatoria("MP_WEBHOOK_SECRET");
  },
  /** URL pública do site, usada nos retornos do checkout e no webhook. */
  get siteUrl(): string {
    return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:5210").replace(/\/$/, "");
  },
  /** Link secreto do calendário do Airbnb. Opcional: sem ele, só o banco conta. */
  get airbnbIcalUrl(): string | undefined {
    return process.env.AIRBNB_ICAL_URL;
  },
} as const;

/** Regras comerciais. Tudo em centavos, para não haver arredondamento errado. */
export const PRECOS = {
  /** Diária padrão. */
  get noite(): number {
    return Math.round(numero("PRECO_NOITE", 650) * 100);
  },
  /** Taxa única de limpeza por estadia. */
  get limpeza(): number {
    return Math.round(numero("TAXA_LIMPEZA", 150) * 100);
  },
  /** Mínimo de noites aceito pelo site. */
  get minimoNoites(): number {
    return numero("MINIMO_NOITES", 1);
  },
  /** Quanto adiantar agora: 100 cobra tudo, 30 cobra 30% de sinal. */
  get percentualCobrado(): number {
    return numero("SINAL_PERCENTUAL", 100);
  },
  /** Minutos que uma reserva não paga segura a data. */
  get minutosParaPagar(): number {
    return numero("MINUTOS_PARA_PAGAR", 30);
  },
  /** Até quantos dias à frente o site aceita reservar. */
  get janelaDias(): number {
    return numero("JANELA_DIAS", 365);
  },
} as const;
