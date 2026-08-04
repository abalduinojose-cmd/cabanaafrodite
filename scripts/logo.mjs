/**
 * Extrai o logo oficial (arte enviada pelo cliente) para PNG com fundo
 * transparente e o guarda em public/logo/.
 *
 * O arquivo original é um mockup: arte preta sobre um cinza com vinheta.
 * A separação é feita por rampa de luminância, então a borda sai suave em
 * vez de serrilhada. O resultado é usado como MÁSCARA no site
 * (`mask-image` + `background-color: currentColor`), o que deixa o mesmo
 * arquivo servir para a versão preta, branca ou creme.
 *
 *   npm run logo
 */
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGEM = join(ROOT, "src-assets", "logo-original.png");
const OUT = join(ROOT, "public", "logo");

/* Rampa: luminância 0.10 vira opaco, 0.24 vira transparente. O limite é
   apertado de propósito: a vinheta escura dos cantos do mockup chega a 0.29
   e não pode virar sujeira translúcida na máscara.
   alpha = v * a + b, com v em 0..255 (sharp satura em 0 e 255). */
const CLARO = 0.17 * 255;
const ESCURO = 0.06 * 255;
const A = -255 / (CLARO - ESCURO);
const B = (CLARO * 255) / (CLARO - ESCURO);

async function alpha(entrada) {
  return sharp(entrada).grayscale().linear(A, B).toColourspace("b-w").toBuffer();
}

await mkdir(OUT, { recursive: true });

const mascara = await alpha(ORIGEM);
const { width, height } = await sharp(mascara).metadata();

/** Branco sólido recebendo o alpha extraído, recortado no conteúdo. */
async function gerar(nome, recorte) {
  let base = sharp({
    create: { width, height, channels: 3, background: "#ffffff" },
  })
    .png()
    .joinChannel(mascara);

  if (recorte) base = sharp(await base.toBuffer()).extract(recorte);

  const buf = await sharp(await base.toBuffer()).trim({ threshold: 1 }).toBuffer();
  const meta = await sharp(buf).metadata();
  await sharp(buf).png({ compressionLevel: 9 }).toFile(join(OUT, nome));
  process.stdout.write(`${nome}  ${meta.width}x${meta.height}\n`);
}

// Completo: A + assinatura + CABANA (rodapé e CTA final)
await gerar("afrodite.png", null);

// Marca reduzida: só o A com a assinatura cruzando (navbar)
await gerar("afrodite-marca.png", {
  left: 0,
  top: 0,
  width,
  height: Math.round(height * 0.71),
});

process.stdout.write("\nconcluído\n");
