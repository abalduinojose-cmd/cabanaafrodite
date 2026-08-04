/**
 * Prepara os reels da seção "Quem foi, filmou": comprime para web e extrai
 * o poster de cada vídeo (o vídeo só carrega depois do play, então o poster
 * é o que aparece na primeira pintura).
 *
 * Origem: src-assets/videos/reel-*.mp4
 * Saída:  public/videos/reel-*.mp4 + public/videos/reel-*.jpg
 *
 *   npm run video
 */
import { execFile } from "node:child_process";
import { mkdir, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import ffmpegPath from "ffmpeg-static";

const run = promisify(execFile);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGEM = join(ROOT, "src-assets", "videos");
const OUT = join(ROOT, "public", "videos");

/** Segundo de onde sai o poster de cada reel. */
const REELS = [
  { id: "reel-1", poster: "00:00:02.0" },
  { id: "reel-2", poster: "00:00:01.5" },
  { id: "reel-3", poster: "00:00:01.0" },
];

await mkdir(OUT, { recursive: true });

/* --------------------------------------------------------------------------
   Hero: walkthrough de fundo, mudo e em loop.

   O arquivo de origem já é H.264 720p com bitrate cheio, então reencodar só
   perderia qualidade. Aqui o vídeo é copiado bit a bit; o que sai é a trilha
   de áudio (o hero é mudo) e o índice vai para o começo do arquivo, para o
   navegador começar a tocar sem baixar tudo.

   Um arquivo só serve desktop e mobile: o enquadramento muda por
   `object-position` no CSS, o que preserva a resolução inteira em vez de
   recortar um 9:16 pequeno e borrado.
   -------------------------------------------------------------------------- */
{
  const entrada = join(ORIGEM, "hero.mp4");
  const saida = join(OUT, "hero.mp4");

  await run(ffmpegPath, [
    "-y",
    "-i",
    entrada,
    "-an",
    "-c:v",
    "copy",
    "-movflags",
    "+faststart",
    saida,
  ]);

  /* Poster: o primeiro quadro, exatamente onde o vídeo começa, para a troca
     ser imperceptível. Vai para src/assets/photos/ e não para public/, para
     o next/image gerar as variantes e o desfoque de carregamento. */
  await run(ffmpegPath, [
    "-y",
    "-ss",
    "00:00:00.0",
    "-i",
    entrada,
    "-frames:v",
    "1",
    "-q:v",
    "2",
    join(ROOT, "src", "assets", "photos", "hero-video.jpg"),
  ]);

  const antes = (await stat(entrada)).size / 1024 / 1024;
  const depois = (await stat(saida)).size / 1024 / 1024;
  process.stdout.write(`hero: ${antes.toFixed(1)} MB -> ${depois.toFixed(1)} MB + poster\n`);
}

for (const reel of REELS) {
  const entrada = join(ORIGEM, `${reel.id}.mp4`);
  const saida = join(OUT, `${reel.id}.mp4`);

  // 9:16 com no máximo 720 de largura, áudio leve (são reels, o som importa)
  await run(ffmpegPath, [
    "-y",
    "-i",
    entrada,
    "-vf",
    "scale='min(720,iw)':-2",
    "-c:v",
    "libx264",
    "-profile:v",
    "main",
    "-crf",
    "29",
    "-preset",
    "slow",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-c:a",
    "aac",
    "-b:a",
    "96k",
    saida,
  ]);

  await run(ffmpegPath, [
    "-y",
    "-ss",
    reel.poster,
    "-i",
    entrada,
    "-frames:v",
    "1",
    "-vf",
    "scale='min(720,iw)':-2",
    "-q:v",
    "4",
    join(OUT, `${reel.id}.jpg`),
  ]);

  const antes = (await stat(entrada)).size / 1024 / 1024;
  const depois = (await stat(saida)).size / 1024 / 1024;
  process.stdout.write(`${reel.id}: ${antes.toFixed(1)} MB -> ${depois.toFixed(1)} MB + poster\n`);
}

process.stdout.write("\nconcluído\n");
