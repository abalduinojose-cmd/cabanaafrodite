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
import { renameSync } from "node:fs";
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

/* A exportação estática não comporta nada que precise de servidor: rotas de
   API e páginas `force-dynamic`. O GitHub Pages é só a vitrine, e o motor de
   reservas vive na hospedagem com Node. Estas pastas saem do caminho durante
   o build e voltam logo depois, aconteça o que acontecer. */
const SO_COM_SERVIDOR = [
  ["src/app/api", "src/app/_api-fora-do-pages"],
  ["src/app/reserva/simulacao", "src/app/reserva/_simulacao-fora-do-pages"],
];

/** Devolve tudo para o lugar. Idempotente: pode rodar quantas vezes for. */
async function restaurar() {
  for (const [origem, destino] of SO_COM_SERVIDOR) {
    const de = join(ROOT, destino);
    const para = join(ROOT, origem);
    if ((await existe(de)) && !(await existe(para))) {
      // O dev server pode segurar a pasta por um instante; insiste um pouco.
      for (let tentativa = 1; ; tentativa += 1) {
        try {
          await rename(de, para);
          break;
        } catch (erro) {
          if (tentativa >= 5) throw erro;
          await new Promise((r) => setTimeout(r, 300 * tentativa));
        }
      }
    }
  }
}

/* Se um build anterior morreu no meio (Ctrl+C, processo derrubado), as
   pastas ficaram para trás e o backend some do projeto. Antes de qualquer
   coisa, devolve o que estiver fora do lugar. */
await restaurar();

const movidas = [];
for (const [origem, destino] of SO_COM_SERVIDOR) {
  const de = join(ROOT, origem);
  const para = join(ROOT, destino);
  if (await existe(de)) {
    await rename(de, para);
    movidas.push([para, de]);
  }
}

// Rede de segurança: sinal ou exceção não deixam o projeto quebrado.
const aoMorrer = () => {
  for (const [origem, destino] of SO_COM_SERVIDOR) {
    try {
      renameSync(join(ROOT, destino), join(ROOT, origem));
    } catch {
      /* já estava no lugar */
    }
  }
  process.exit(1);
};
process.once("SIGINT", aoMorrer);
process.once("SIGTERM", aoMorrer);

try {
  execFileSync("npx", ["next", "build"], {
    cwd: ROOT,
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      PAGES: "1",
      NEXT_PUBLIC_BASE_PATH: BASE_PATH,
      // Sem backend, o checkout não cobra de verdade...
      NEXT_PUBLIC_RESERVAS_ATIVAS: "0",
      // ...mas aparece inteiro e navegável, para o cliente aprovar a experiência.
      NEXT_PUBLIC_RESERVAS_DEMO: "1",
    },
  });
} finally {
  await restaurar();
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
