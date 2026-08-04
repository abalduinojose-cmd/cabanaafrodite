/**
 * Baixa os assets do anúncio real (manifesto em src-assets/airbnb.json):
 *   - avatares dos hóspedes → public/avaliacoes/{id}.webp (96px, retina 2x)
 *   - fotos do anúncio      → img/airbnb/aNN.jpg (para curadoria manual)
 *
 * Nada de hotlink: tudo servido do próprio site.
 *
 *   node scripts/airbnb.mjs           # avatares + fotos
 *   node scripts/airbnb.mjs avatares  # só avatares
 */
import { mkdir, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = JSON.parse(await readFile(join(ROOT, "src-assets", "airbnb.json"), "utf8"));

const soAvatares = process.argv[2] === "avatares";

async function baixar(url) {
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${res.status} em ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

// Avatares: quadrados 192px (96 CSS × 2)
const dirAvatares = join(ROOT, "public", "avaliacoes");
await mkdir(dirAvatares, { recursive: true });
for (const a of MANIFEST.avaliacoes) {
  const buf = await baixar(a.avatar);
  await sharp(buf).resize(192, 192, { fit: "cover" }).webp({ quality: 82 }).toFile(join(dirAvatares, `${a.id}.webp`));
  process.stdout.write(`avatar ${a.id}\n`);
}

if (!soAvatares) {
  const dirFotos = join(ROOT, "img", "airbnb");
  await mkdir(dirFotos, { recursive: true });
  let i = 0;
  for (const id of MANIFEST.fotos) {
    i += 1;
    const nome = `a${String(i).padStart(2, "0")}.jpg`;
    const url = `https://a0.muscache.com/im/pictures/hosting/Hosting-1309401960357292675/original/${id}.jpeg?im_w=1440`;
    try {
      const buf = await baixar(url);
      await sharp(buf).jpeg({ quality: 88 }).toFile(join(dirFotos, nome));
      process.stdout.write(`${nome}\n`);
    } catch (e) {
      process.stderr.write(`FALHOU ${nome}: ${String(e)}\n`);
    }
  }
}

process.stdout.write("concluído\n");
