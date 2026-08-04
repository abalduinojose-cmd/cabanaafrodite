/**
 * Build da prévia pública (GitHub Pages).
 *
 * Roda o `next build` com as variáveis do modo prévia e copia o resultado
 * para `docs/`, que é a pasta servida pelo Pages a partir da branch main.
 * O `.nojekyll` é obrigatório: sem ele o Jekyll ignora `_next/`, que começa
 * com underscore, e o site sobe sem CSS nem JavaScript.
 *
 *   npm run build:pages
 */
import { execFileSync } from "node:child_process";
import { access, cp, mkdir, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DOCS = join(ROOT, "docs");
const DIST = join(ROOT, ".next-pages");
const BASE_PATH = "/cabanaafrodite";

async function existe(caminho) {
  try {
    await access(caminho);
    return true;
  } catch {
    return false;
  }
}

/* A exportação estática não comporta rotas de API (elas precisam de
   servidor). O GitHub Pages é só a vitrine: o motor de reservas vive na
   hospedagem com Node. Aqui a pasta sai do caminho durante o build e volta
   logo depois, aconteça o que acontecer. */
const API = join(ROOT, "src", "app", "api");
const API_GUARDADA = join(ROOT, "src", "app", "_api-fora-do-pages");
const temApi = await existe(API);

if (temApi) await rename(API, API_GUARDADA);

try {
  execFileSync("npx", ["next", "build"], {
    cwd: ROOT,
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      PAGES: "1",
      NEXT_PUBLIC_BASE_PATH: BASE_PATH,
      // Sem backend não há formulário de reserva: fica o calendário e o Airbnb.
      NEXT_PUBLIC_RESERVAS_ATIVAS: "0",
    },
  });
} finally {
  if (temApi) await rename(API_GUARDADA, API);
}

/* Com `distDir` customizado, o Next 15 escreve o site exportado dentro do
   próprio distDir em vez de criar `out/`. Aceita os dois. */
const origem = (await existe(join(ROOT, "out"))) ? join(ROOT, "out") : DIST;

await rm(DOCS, { recursive: true, force: true });
await mkdir(DOCS, { recursive: true });
await cp(origem, DOCS, { recursive: true });
await rm(join(ROOT, "out"), { recursive: true, force: true });
await writeFile(join(DOCS, ".nojekyll"), "");

process.stdout.write(`\ndocs/ pronto, servindo em ${BASE_PATH}\n`);
