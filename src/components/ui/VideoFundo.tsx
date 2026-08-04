"use client";

import { useEffect, useRef, useState } from "react";

import { cx } from "@/lib/cx";

type VideoFundoProps = {
  readonly src: string;
  readonly label: string;
  readonly className?: string;
};

/**
 * Vídeo de fundo mudo em loop.
 *
 * O `src` só é definido depois da montagem: assim a primeira pintura é a
 * foto-pôster (que é o LCP) e o vídeo não disputa banda com ela. Quando o
 * navegador avisa que dá para tocar, o vídeo aparece por cima com um fade.
 * Se o autoplay for bloqueado, a foto continua lá e nada quebra.
 */
export function VideoFundo({ src, label, className }: VideoFundoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    node.src = src;
    node.load();

    const tocar = (): void => {
      void node.play().catch(() => {
        /* autoplay bloqueado: fica a foto */
      });
    };

    if (node.readyState >= 3) tocar();
    else node.addEventListener("canplay", tocar, { once: true });

    return () => node.removeEventListener("canplay", tocar);
  }, [src]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      onPlaying={() => setPronto(true)}
      className={cx(
        "size-full object-cover transition-opacity duration-1000 ease-serra",
        pronto ? "opacity-100" : "opacity-0",
        className,
      )}
    />
  );
}
