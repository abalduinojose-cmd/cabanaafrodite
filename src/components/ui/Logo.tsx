import { cx } from "@/lib/cx";
import { asset } from "@/lib/asset";
import { SITE } from "@/data/content";

/**
 * Logo oficial da Cabana Afrodite.
 *
 * A arte enviada pelo cliente virou uma máscara PNG com fundo transparente
 * (ver scripts/logo.mjs). Usar `mask-image` em vez de `<img>` deixa o mesmo
 * arquivo pintar de preto, branco ou creme só herdando `currentColor`, sem
 * precisar de uma versão por cor nem de troca de arquivo no scroll.
 *
 * A URL vai no `style` porque precisa passar pelo `asset()`: numa classe do
 * Tailwind ela ficaria fixa e quebraria na prévia, que roda em subpasta.
 */

type LogoProps = {
  readonly className?: string;
};

/* O elemento é vazio, então a proporção do próprio arquivo define a
   largura: quem usa só escolhe a altura. */
const MASK_BASE =
  "block bg-current [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]";

/** Marca completa: A + assinatura + CABANA. Para rodapé e CTA final. */
export function LogoAfrodite({ className }: LogoProps) {
  return (
    <span
      role="img"
      aria-label={SITE.name}
      style={{ maskImage: `url(${asset("/logo/afrodite.png")})` }}
      className={cx(MASK_BASE, "aspect-[1024/913]", className)}
    />
  );
}

/** Marca reduzida: A com a assinatura cruzando, sem o CABANA. Para a navbar. */
export function LogoMarca({ className }: LogoProps) {
  return (
    <span
      role="img"
      aria-label={SITE.name}
      style={{ maskImage: `url(${asset("/logo/afrodite-marca.png")})` }}
      className={cx(MASK_BASE, "aspect-[732/589]", className)}
    />
  );
}
