import { NextResponse } from "next/server";

import { MODO } from "@/server/env";
import { cancelar, confirmar } from "@/server/reservas";

export const dynamic = "force-dynamic";

/**
 * Desfecho do checkout de demonstração.
 *
 * Existe apenas enquanto não há Access Token do Mercado Pago. Com o token
 * configurado, quem decide o desfecho de uma reserva é o webhook, depois de
 * consultar o pagamento de verdade, e esta rota passa a recusar tudo.
 */
export async function POST(request: Request) {
  if (MODO.pagamento !== "simulado") {
    return NextResponse.json({ erro: "indisponivel_em_producao" }, { status: 404 });
  }

  let corpo: { id?: unknown; desfecho?: unknown };
  try {
    corpo = (await request.json()) as typeof corpo;
  } catch {
    return NextResponse.json({ erro: "json_invalido" }, { status: 400 });
  }

  const id = typeof corpo.id === "string" ? corpo.id : null;
  const desfecho = corpo.desfecho === "aprovado" ? "aprovado" : "recusado";

  if (!id) return NextResponse.json({ erro: "id_ausente" }, { status: 400 });

  const pagamentoFicticio = `simulado-${Date.now()}`;

  if (desfecho === "aprovado") await confirmar(id, pagamentoFicticio);
  else await cancelar(id, pagamentoFicticio);

  return NextResponse.json({ ok: true, desfecho });
}
