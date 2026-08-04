import { NextResponse } from "next/server";

import { ehDataValida, hoje, noitesEntre, somarDias } from "@/server/datas";
import { PRECOS } from "@/server/env";
import { criarPreferencia } from "@/server/mercadopago";
import { anotarPreferencia, criarPendente, DatasIndisponiveis, orcar } from "@/server/reservas";

export const dynamic = "force-dynamic";

type Corpo = {
  entrada?: unknown;
  saida?: unknown;
  nome?: unknown;
  email?: unknown;
  telefone?: unknown;
  hospedes?: unknown;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function texto(valor: unknown, min: number, max: number): string | null {
  if (typeof valor !== "string") return null;
  const limpo = valor.trim().replace(/\s+/g, " ");
  return limpo.length >= min && limpo.length <= max ? limpo : null;
}

/**
 * Abre uma reserva.
 *
 * Nada que chega do navegador é levado a sério além das datas e do contato:
 * o preço é calculado aqui e a disponibilidade é conferida contra o Airbnb e
 * contra o banco, que é quem impede duas estadias na mesma noite.
 */
export async function POST(request: Request) {
  let corpo: Corpo;
  try {
    corpo = (await request.json()) as Corpo;
  } catch {
    return NextResponse.json({ erro: "json_invalido" }, { status: 400 });
  }

  const { entrada, saida } = corpo;
  if (!ehDataValida(entrada) || !ehDataValida(saida)) {
    return NextResponse.json({ erro: "datas_invalidas" }, { status: 400 });
  }

  const noites = noitesEntre(entrada, saida);
  if (noites < PRECOS.minimoNoites) {
    return NextResponse.json(
      { erro: "minimo_noites", minimo: PRECOS.minimoNoites },
      { status: 400 },
    );
  }

  if (entrada < hoje()) {
    return NextResponse.json({ erro: "data_no_passado" }, { status: 400 });
  }
  if (entrada > somarDias(hoje(), PRECOS.janelaDias)) {
    return NextResponse.json({ erro: "data_muito_distante" }, { status: 400 });
  }

  const nome = texto(corpo.nome, 3, 80);
  const email = texto(corpo.email, 5, 120);
  const telefone = texto(corpo.telefone, 8, 25);
  const hospedes = Number(corpo.hospedes);

  if (!nome || !email || !EMAIL.test(email) || !telefone) {
    return NextResponse.json({ erro: "contato_invalido" }, { status: 400 });
  }
  if (!Number.isInteger(hospedes) || hospedes < 1 || hospedes > 4) {
    return NextResponse.json({ erro: "hospedes_invalido" }, { status: 400 });
  }

  try {
    const reserva = await criarPendente({ entrada, saida, nome, email, telefone, hospedes });
    const orcamento = orcar(entrada, saida);

    const expiraEm = new Date(Date.now() + PRECOS.minutosParaPagar * 60_000);
    const preferencia = await criarPreferencia({
      reservaId: reserva.id,
      titulo: `Cabana Afrodite · ${noites} ${noites === 1 ? "noite" : "noites"} (${entrada} a ${saida})`,
      valor: reserva.valorCobrado,
      nome,
      email,
      expiraEm: expiraEm.toISOString(),
    });

    await anotarPreferencia(reserva.id, preferencia.id);

    return NextResponse.json({
      reservaId: reserva.id,
      checkoutUrl: preferencia.init_point,
      expiraEm: expiraEm.toISOString(),
      orcamento,
    });
  } catch (erro) {
    if (erro instanceof DatasIndisponiveis) {
      return NextResponse.json({ erro: "datas_ocupadas" }, { status: 409 });
    }
    console.error("[reservas]", erro);
    return NextResponse.json({ erro: "falha_interna" }, { status: 500 });
  }
}
