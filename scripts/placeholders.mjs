/**
 * Gera o único placeholder que resta: o mapa estilizado da região usado na
 * fachada do Google Maps (as demais imagens do site são fotos reais, vindas
 * de img/ e img/airbnb/ via `npm run fotos`).
 *
 *   npm run placeholders
 */
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PHOTOS = join(ROOT, "src", "assets", "photos");

const W = 1600;
const H = 1200;

/** Ruído determinístico simples. */
function wobble(seed, index, amplitude) {
  const value = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453;
  return (value - Math.floor(value) - 0.5) * 2 * amplitude;
}

const roads = [0.22, 0.48, 0.74]
  .map(
    (t, i) =>
      `<path d="M${-W * 0.05} ${H * t + wobble(10, i, H * 0.05)} Q ${W * 0.5} ${H * (t + 0.12)} ${W * 1.05} ${H * (t - 0.06)}" fill="none" stroke="#5C4630" stroke-width="${W * 0.007}" opacity="0.5"/>`,
  )
  .join("");

const blocks = [
  [0.08, 0.12, 0.24, 0.2],
  [0.58, 0.14, 0.3, 0.22],
  [0.24, 0.58, 0.28, 0.26],
  [0.68, 0.62, 0.24, 0.22],
]
  .map(
    ([x, y, bw, bh], i) =>
      `<rect x="${W * x}" y="${H * y}" width="${W * bw}" height="${H * bh}" rx="${W * 0.01}" fill="${i % 2 === 0 ? "#8FA383" : "#5C4630"}" opacity="0.28"/>`,
  )
  .join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="fundo" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FAF7F2"/>
      <stop offset="0.55" stop-color="#EFE7D9"/>
      <stop offset="1" stop-color="#DCCFB8"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#fundo)"/>
  ${blocks}
  ${roads}
  <path d="M${W * 0.02} ${H * 0.9} Q ${W * 0.4} ${H * 0.72} ${W * 0.98} ${H * 0.86}" fill="none" stroke="#8A6B4A" stroke-width="${W * 0.012}" opacity="0.4"/>
  <path d="M${W * 0.5} ${H * 0.38} L${W * 0.545} ${H * 0.5} L${W * 0.455} ${H * 0.5} Z" fill="#7A5236"/>
  <circle cx="${W * 0.5}" cy="${H * 0.5}" r="${W * 0.055}" fill="none" stroke="#7A5236" stroke-width="${W * 0.003}" opacity="0.7"/>
</svg>`;

await mkdir(PHOTOS, { recursive: true });
await sharp(Buffer.from(svg))
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(join(PHOTOS, "mapa-vale-das-videiras.jpg"));

process.stdout.write("mapa-vale-das-videiras.jpg gerado\n");
