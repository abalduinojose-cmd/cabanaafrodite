/**
 * Sincroniza a disponibilidade com o calendário do Airbnb.
 *
 * ATENÇÃO, LEIA ANTES DE MEXER: o link .ics do Airbnb é SECRETO. Ele carrega
 * um token na query e o conteúdo traz, em cada reserva, a URL interna do
 * painel da anfitriã (com o código de confirmação) e os últimos 4 dígitos do
 * telefone do hóspede. Por isso:
 *
 *   1. o link vem de variável de ambiente (`AIRBNB_ICAL_URL`), nunca do código;
 *   2. este script joga fora SUMMARY, DESCRIPTION e UID, guardando apenas as
 *      datas de início e fim de cada bloqueio.
 *
 * O que vai para o repositório é só isso: uma lista de intervalos ocupados,
 * a mesma informação que qualquer visitante já vê no anúncio público.
 *
 *   AIRBNB_ICAL_URL="https://..." npm run calendario
 */
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SAIDA = join(ROOT, "src", "data", "disponibilidade.json");

const url = process.env.AIRBNB_ICAL_URL;
if (!url) {
  process.stderr.write(
    "Falta AIRBNB_ICAL_URL.\n" +
      "Pegue em: Airbnb > Calendário > Disponibilidade > Sincronizar calendários > Exportar calendário.\n" +
      "Guarde em .env.local (que não vai para o Git) ou passe na linha de comando.\n",
  );
  process.exit(1);
}

const resposta = await fetch(url, { headers: { "user-agent": "cabana-afrodite/1.0" } });
if (!resposta.ok) throw new Error(`Airbnb respondeu ${resposta.status}`);
const ics = await resposta.text();

/** Desdobra as linhas continuadas do iCal (continuação começa com espaço). */
const linhas = ics.replace(/\r\n[ \t]/g, "").split(/\r?\n/);

/** `20260802` -> `2026-08-02` */
const iso = (bruto) => `${bruto.slice(0, 4)}-${bruto.slice(4, 6)}-${bruto.slice(6, 8)}`;

const ocupados = [];
let atual = null;

for (const linha of linhas) {
  if (linha === "BEGIN:VEVENT") {
    atual = {};
    continue;
  }
  if (linha === "END:VEVENT") {
    // Só entra se tiver as duas datas. Nada de texto: ver o aviso no topo.
    if (atual?.inicio && atual?.fim) ocupados.push({ inicio: atual.inicio, fim: atual.fim });
    atual = null;
    continue;
  }
  if (!atual) continue;

  const data = linha.match(/^DT(START|END)[^:]*:(\d{8})/);
  if (data) atual[data[1] === "START" ? "inicio" : "fim"] = iso(data[2]);
}

ocupados.sort((a, b) => a.inicio.localeCompare(b.inicio));

const conteudo = {
  _comentario:
    "Gerado por scripts/calendario.mjs a partir do iCal do Airbnb. Só datas: nenhum dado de hóspede é guardado aqui.",
  atualizadoEm: new Date().toISOString(),
  /** `fim` é exclusivo, como no iCal: a última noite ocupada é o dia anterior. */
  ocupados,
};

await writeFile(SAIDA, `${JSON.stringify(conteudo, null, 2)}\n`, "utf8");

const noites = ocupados.reduce(
  (total, o) => total + (Date.parse(o.fim) - Date.parse(o.inicio)) / 86400000,
  0,
);
process.stdout.write(
  `${ocupados.length} bloqueios, ${noites} noites ocupadas ate ${ocupados.at(-1)?.fim ?? "?"}\n` +
    "src/data/disponibilidade.json atualizado\n",
);
