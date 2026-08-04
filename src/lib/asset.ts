/**
 * Prefixo dos arquivos de `public/`.
 *
 * `next/image` e `next/link` já resolvem o `basePath` sozinhos, mas caminhos
 * escritos à mão (o vídeo do hero, os reels, a máscara do logo) não. Este
 * helper cobre esses casos: em desenvolvimento e em produção na raiz do
 * domínio ele não muda nada; na prévia do GitHub Pages, que roda em
 * /cabanaafrodite, ele acrescenta o prefixo.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(caminho: `/${string}`): string {
  return `${BASE}${caminho}`;
}
