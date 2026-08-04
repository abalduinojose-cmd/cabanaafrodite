"use client";

import { MapPin } from "lucide-react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useState } from "react";

type MapEmbedProps = {
  readonly image: StaticImageData;
  readonly alt: string;
  readonly src: string;
  readonly title: string;
  readonly actionLabel: string;
};

/**
 * Fachada do mapa: o iframe do Google só é criado depois do clique, então a
 * página carrega sem nenhuma requisição de terceiros.
 */
export function MapEmbed({ image, alt, src, title, actionLabel }: MapEmbedProps) {
  const [active, setActive] = useState(false);

  if (active) {
    return (
      <iframe
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 size-full border-0"
      />
    );
  }

  return (
    <>
      <Image
        src={image}
        alt={alt}
        fill
        placeholder="blur"
        sizes="(min-width: 1024px) 46vw, 92vw"
        className="object-cover"
      />
      <button
        type="button"
        onClick={() => setActive(true)}
        className="absolute inset-0 flex items-end justify-center bg-noite/20 p-6 transition-colors duration-500 ease-serra hover:bg-noite/35"
      >
        <span className="btn btn-cafe h-11 px-6 text-[0.8125rem]">
          <MapPin className="size-4" strokeWidth={1.75} aria-hidden />
          {actionLabel}
        </span>
      </button>
    </>
  );
}
