import { paraIcal } from "@/server/datas";
import { periodosDoSite } from "@/server/reservas";

export const dynamic = "force-dynamic";

/**
 * Calendário das reservas feitas pelo site, no formato que o Airbnb importa.
 *
 * É a outra metade da sincronia: o site já lê o calendário do Airbnb, e este
 * feed faz o caminho de volta. A anfitriã cola esta URL em
 * Airbnb › Calendário › Disponibilidade › Sincronizar calendários.
 *
 * Nenhum dado do hóspede entra aqui: só as datas e um rótulo. Quem tiver a
 * URL vê apenas quais noites estão ocupadas, nada além disso.
 */
export async function GET() {
  const periodos = await periodosDoSite();
  const agora = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const linhas = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Cabana Afrodite//Reservas do site//PT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  for (const [indice, periodo] of periodos.entries()) {
    linhas.push(
      "BEGIN:VEVENT",
      `UID:site-${paraIcal(periodo.inicio)}-${indice}@cabanaafrodite`,
      `DTSTAMP:${agora}`,
      `DTSTART;VALUE=DATE:${paraIcal(periodo.inicio)}`,
      `DTEND;VALUE=DATE:${paraIcal(periodo.fim)}`,
      "SUMMARY:Reservado pelo site",
      "END:VEVENT",
    );
  }

  linhas.push("END:VCALENDAR");

  return new Response(`${linhas.join("\r\n")}\r\n`, {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "content-disposition": 'inline; filename="cabana-afrodite.ics"',
      "cache-control": "no-store",
    },
  });
}
