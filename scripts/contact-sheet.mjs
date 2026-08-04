/**
 * Gera contact sheets numerados das fotos de img/ para mapear cada arquivo
 * a uma seção do site. Saída em src-assets/.
 *
 *   node scripts/contact-sheet.mjs
 */
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const IMG = join(ROOT, "img");
const OUT = join(ROOT, "src-assets");

const THUMB_W = 360;
const THUMB_H = 270;
const COLS = 4;
const PER_SHEET = 16;

const files = (await readdir(IMG)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();

await mkdir(OUT, { recursive: true });

const mapa = files.map((f, i) => `f${String(i + 1).padStart(2, "0")}  ${f}`);
await writeFile(join(OUT, "mapa-fotos.txt"), mapa.join("\n"), "utf8");

for (let sheet = 0; sheet * PER_SHEET < files.length; sheet += 1) {
  const slice = files.slice(sheet * PER_SHEET, (sheet + 1) * PER_SHEET);
  const rows = Math.ceil(slice.length / COLS);

  const composites = [];
  for (let i = 0; i < slice.length; i += 1) {
    const buf = await sharp(join(IMG, slice[i]))
      .resize(THUMB_W, THUMB_H, { fit: "cover" })
      .toBuffer();
    const id = `f${String(sheet * PER_SHEET + i + 1).padStart(2, "0")}`;
    const label = Buffer.from(
      `<svg width="${THUMB_W}" height="40"><rect width="86" height="40" fill="#000" opacity="0.75"/><text x="12" y="28" font-family="Arial" font-size="24" font-weight="bold" fill="#fff">${id}</text></svg>`,
    );
    const withLabel = await sharp(buf)
      .composite([{ input: label, top: 0, left: 0 }])
      .toBuffer();
    composites.push({
      input: withLabel,
      top: Math.floor(i / COLS) * THUMB_H,
      left: (i % COLS) * THUMB_W,
    });
  }

  await sharp({
    create: {
      width: COLS * THUMB_W,
      height: rows * THUMB_H,
      channels: 3,
      background: { r: 20, g: 18, b: 15 },
    },
  })
    .composite(composites)
    .jpeg({ quality: 80 })
    .toFile(join(OUT, `contact-sheet-${sheet + 1}.jpg`));

  process.stdout.write(`contact-sheet-${sheet + 1}.jpg (${slice.length} fotos)\n`);
}
