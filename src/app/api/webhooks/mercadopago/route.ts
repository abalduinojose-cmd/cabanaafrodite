import { NextResponse } from "next/server";

import { assinaturaConfere, consultarPagamento } from "@/server/mercadopago";
import { cancelar, confirmar, registrarWebhook } from "@/server/reservas";

export const dynamic = "force-dynamic";

type Notificacao = {
  readonly type?: string;
  readonly action?: string;
  readonly data?: { readonly id?: string | number };
};

/**
 * Recebe as notificações do Mercado Pago.
 *
 * Três cuidados aqui: a assinatura é conferida antes de qualquer coisa (sem
 * isso, um POST forjado confirmaria reservas de graça); o estado real vem de
 * uma consulta à API, não do corpo da notificação; e cada pagamento só é
 * processado uma vez, porque o Mercado Pago reenvia até receber 200.
 */
export async function POST(request: Request) {
  const url = new URL(request.url);

  let corpo: Notificacao = {};
  try {
    corpo = (await request.json()) as Notificacao;
  } catch {
    // Algumas notificações chegam só com query string.
  }

  const dataId = String(corpo.data?.id ?? url.searchParams.get("data.id") ?? "");
  const tipo = corpo.type ?? url.searchParams.get("type") ?? "";

  if (!dataId) return NextResponse.json({ ok: true, ignorado: "sem_id" });
  if (tipo && tipo !== "payment") return NextResponse.json({ ok: true, ignorado: tipo });

  const valida = assinaturaConfere({
    assinatura: request.headers.get("x-signature"),
    requestId: request.headers.get("x-request-id"),
    dataId,
  });

  if (!valida) {
    console.warn("[webhook] assinatura inválida para", dataId);
    return NextResponse.json({ erro: "assinatura_invalida" }, { status: 401 });
  }

  try {
    const inedito = await registrarWebhook(dataId, corpo);
    if (!inedito) return NextResponse.json({ ok: true, repetido: true });

    const pagamento = await consultarPagamento(dataId);
    const reservaId = pagamento.external_reference;

    if (!reservaId) return NextResponse.json({ ok: true, ignorado: "sem_referencia" });

    if (pagamento.status === "approved") {
      await confirmar(reservaId, dataId);
    } else if (["rejected", "cancelled", "refunded", "charged_back"].includes(pagamento.status)) {
      await cancelar(reservaId, dataId);
    }
    // "pending" e "in_process" ficam como estão: a reserva segue segurando a
    // data até o prazo, e uma nova notificação chega quando resolver.

    return NextResponse.json({ ok: true, status: pagamento.status });
  } catch (erro) {
    console.error("[webhook]", erro);
    // 500 faz o Mercado Pago tentar de novo, que é o que queremos.
    return NextResponse.json({ erro: "falha_interna" }, { status: 500 });
  }
}
