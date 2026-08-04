import "server-only";

/**
 * Configuração que só existe no servidor. Nada daqui pode vazar para o
 * navegador: são credenciais e regras de preço.
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
    return obrigatoria("NEXT_PUBLIC_SITE_URL").replace(/\/$/, "");
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
