/**
 * Curadoria: copia as fotos escolhidas (img/ do Instagram + img/airbnb/ do
 * anúncio) para src/assets/photos/ com nomes semânticos, normalizadas para a
 * web (borda maior 2000px, JPEG 85). Gera também o public/og.jpg 1200×630.
 *
 * Mapa completo em src-assets/mapa-fotos.txt e src-assets/airbnb-sheet-*.jpg.
 *
 *   npm run fotos
 */
import { mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const IG = join(ROOT, "img");
const BNB = join(ROOT, "img", "airbnb");
const OUT = join(ROOT, "src", "assets", "photos");

/** destino → origem */
const MAPA = {
  // Hero: drone do anúncio no Airbnb, escolhido pelo cliente em 04/08
  "hero.jpg": join(BNB, "a81.jpg"),

  // Instagram (@cabanaafrodite, @fora.darotinarj, @pousadas.top.rj, @rebecacoutinhofotografia)
  "galeria-13.jpg": join(IG, "cabanaafrodite_1747576126_3635254489126016861_55181989862.jpg"), // f02 fachada ao entardecer
  "sobre-cabana.jpg": join(IG, "pousadas.top.rj_1783983702_3940662743274781698_9189298581.jpg"), // f19 banheira + vale dourado
  "mar-de-nuvens.jpg": join(IG, "pousadas.top.rj_1783983702_3940662888724740266_9189298581.jpg"), // f22 banheira acima das nuvens
  "ambiente-area-externa.jpg": join(IG, "fora.darotinarj_1769097138_3815783800568364699_76779936048.jpg"), // f09 deck + telescópio
  "cta-noite.jpg": join(IG, "fora.darotinarj_1769097138_3815783797707851842_76779936048.jpg"), // f08 cabana iluminada à noite

  // Anúncio no Airbnb
  "ambiente-quarto.jpg": join(BNB, "a06.jpg"), // cama king de frente para o vale
  "ambiente-sala-de-estar.jpg": join(BNB, "a42.jpg"), // poltronas + lareira
  "ambiente-cozinha.jpg": join(BNB, "a17.jpg"), // cooktop + panelas
  "ambiente-sala-de-jantar.jpg": join(BNB, "a05.jpg"), // mesa posta
  "ambiente-estar-cinema.jpg": join(BNB, "a09.jpg"), // sofá-cama com mantas
  "ambiente-banheiro.jpg": join(BNB, "a32.jpg"), // bancada + espelho

  // Galeria "momentos"
  "galeria-01.jpg": join(IG, "cabanaafrodite_1747576341_3635256293750684465_55181989862.jpg"), // f03 fogueira ao pôr do sol
  "galeria-02.jpg": join(IG, "cabanaafrodite_1748291570_3641256063625774764_55181989862.jpg"), // f04 taças na lareira
  "galeria-03.jpg": join(IG, "cabanaafrodite_1750639487_3660951823342521318_55181989862.jpg"), // f05 marshmallow na lareira
  "galeria-04.jpg": join(IG, "pousadas.top.rj_1783983702_3940662739717957827_9189298581.jpg"), // f18 casal na banheira
  "galeria-05.jpg": join(IG, "fora.darotinarj_1769097138_3815784132237164038_76779936048.jpg"), // f14 telescópio ao anoitecer
  "galeria-06.jpg": join(IG, "rebecacoutinhofotografia_1774447762_3860668417439883177_197424353.jpg"), // f26 cadeiras na serra
  "galeria-07.jpg": join(BNB, "a29.jpg"), // decoração romântica na cama
  "galeria-08.jpg": join(IG, "cabanaafrodite_1757529516_3718749572618465176_55181989862.jpg"), // f06 taça no pôr do sol
  "galeria-09.jpg": join(BNB, "a39.jpg"), // caminho iluminado à noite
  "galeria-10.jpg": join(IG, "pousadas.top.rj_1783983702_3940662883221850487_9189298581.jpg"), // f20 céu dramático no deck
  "galeria-11.jpg": join(IG, "rebecacoutinhofotografia_1774447762_3860668457495434467_197424353.jpg"), // f27 casal no capim
  "galeria-12.jpg": join(IG, "pousadas.top.rj_1783983702_3940662895351917873_9189298581.jpg"), // f25 banheira sob céu azul
};

await mkdir(OUT, { recursive: true });

for (const [destino, origem] of Object.entries(MAPA)) {
  await sharp(origem)
    .rotate() // respeita EXIF
    .resize(2000, 2000, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(join(OUT, destino));
  process.stdout.write(`${destino}\n`);
}

// Open Graph: corte 1200×630 do hero
await sharp(MAPA["hero.jpg"])
  .rotate()
  .resize(1200, 630, { fit: "cover", position: "attention" })
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(join(ROOT, "public", "og.jpg"));
process.stdout.write("og.jpg\n\nconcluído\n");
