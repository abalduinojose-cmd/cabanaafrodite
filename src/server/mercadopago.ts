import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

import { env } from "@/server/env";

/**
 * Integração com o Mercado Pago pela API REST, sem SDK.
 *
 * O Access Token é secreto e só existe aqui no servidor. Nenhum valor vem
 * do navegador: o preço é calculado no back-end e o pagamento só é aceito
 * depois de consultado direto na API do Mercado Pago.
 */

const API = "https://api.mercadopago.com";

type Preferencia = {
  readonly id: string;
  readonly init_point: string;
  readonly sandbox_init_point?: string;
};

export type DadosCheckout = {
  readonly reservaId: string;
  readonly titulo: string;
  /** Em centavos. */
  readonly valor: number;
  readonly nome: string;
  readonly email: string;
  /** ISO 8601; depois disso o link de pagamento morre. */
  readonly expiraEm: string;
};

export async function criarPreferencia(dados: DadosCheckout): Promise<Preferencia> {
  const resposta = await fetch(`${API}/checkout/preferences`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.mpAccessToken}`,
      "Content-Type": "application/json",
      // Evita cobrar duas vezes se a requisição for repetida.
      "X-Idempotency-Key": dados.reservaId,
    },
    body: JSON.stringify({
      items: [
        {
          id: dados.reservaId,
          title: dados.titulo,
          quantity: 1,
          currency_id: "BRL",
          unit_price: dados.valor / 100,
        },
      ],
      payer: { name: dados.nome, email: dados.email },
      // Amarra o pagamento à reserva: é por aqui que o webhook se reencontra.
      external_reference: dados.reservaId,
      notification_url: `${env.siteUrl}/api/webhooks/mercadopago`,
      back_urls: {
        success: `${env.siteUrl}/reserva/obrigado?id=${dados.reservaId}`,
        pending: `${env.siteUrl}/reserva/obrigado?id=${dados.reservaId}`,
        failure: `${env.siteUrl}/reserva/erro?id=${dados.reservaId}`,
      },
      auto_return: "approved",
      expires: true,
      expiration_date_to: dados.expiraEm,
      statement_descriptor: "CABANA AFRODITE",
    }),
  });

  if (!resposta.ok) {
    const detalhe = await resposta.text();
    throw new Error(`Mercado Pago recusou a preferência (${resposta.status}): ${detalhe}`);
  }

  return (await resposta.json()) as Preferencia;
}

export type Pagamento = {
  readonly id: number;
  readonly status: string;
  readonly external_reference: string | null;
  readonly transaction_amount: number;
};

/** Estado real do pagamento, direto da fonte. O webhook só avisa que mudou. */
export async function consultarPagamento(paymentId: string): Promise<Pagamento> {
  const resposta = await fetch(`${API}/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${env.mpAccessToken}` },
    cache: "no-store",
  });

  if (!resposta.ok) {
    throw new Error(`Não consegui consultar o pagamento ${paymentId}: ${resposta.status}`);
  }

  return (await resposta.json()) as Pagamento;
}

/**
 * Confere a assinatura da notificação.
 *
 * O Mercado Pago manda `x-signature: ts=...,v1=...`. O que é assinado é o
 * texto `id:<data.id>;request-id:<x-request-id>;ts:<ts>;`, com HMAC-SHA256 e
 * a chave secreta do webhook. Sem isso, qualquer um poderia confirmar uma
 * reserva mandando um POST.
 */
export function assinaturaConfere(args: {
  readonly assinatura: string | null;
  readonly requestId: string | null;
  readonly dataId: string;
}): boolean {
  if (!args.assinatura) return false;

  const partes = new Map(
    args.assinatura.split(",").map((par) => {
      const [chave, valor] = par.split("=", 2);
      return [chave?.trim() ?? "", valor?.trim() ?? ""] as const;
    }),
  );

  const ts = partes.get("ts");
  const recebida = partes.get("v1");
  if (!ts || !recebida) return false;

  // A doc pede o id em minúsculas.
  let manifesto = `id:${args.dataId.toLowerCase()};`;
  if (args.requestId) manifesto += `request-id:${args.requestId};`;
  manifesto += `ts:${ts};`;

  const esperada = createHmac("sha256", env.mpWebhookSecret).update(manifesto).digest("hex");

  const a = Buffer.from(esperada, "utf8");
  const b = Buffer.from(recebida, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}
