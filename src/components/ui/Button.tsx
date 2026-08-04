"use client";

import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

import { IconeWhatsApp } from "@/components/ui/IconeWhatsApp";
import { cx } from "@/lib/cx";
import {
  trackContactClick,
  trackReserveClick,
  type ContactLocation,
  type ReserveLocation,
} from "@/lib/analytics";

export type ButtonVariant = "cafe" | "contornoClaro" | "contornoEscuro" | "discreto";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonTracking =
  | { readonly kind: "reserve"; readonly location: ReserveLocation }
  | { readonly kind: "contact"; readonly location: ContactLocation };

type ButtonProps = {
  readonly href: string;
  readonly children: ReactNode;
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  /** Seta em círculo no fim da pílula (só faz sentido no primário). */
  readonly seta?: boolean;
  /** Glifo do WhatsApp antes do rótulo. */
  readonly whatsapp?: boolean;
  readonly track?: ButtonTracking;
  readonly className?: string;
  readonly fullWidth?: boolean;
  /** Chamado junto com o clique: serve para fechar o menu antes de rolar. */
  readonly onNavigate?: () => void;
};

const VARIANTS: Record<ButtonVariant, string> = {
  cafe: "btn-cafe",
  contornoClaro: "btn-contorno-claro",
  contornoEscuro: "btn-contorno-escuro",
  discreto: "btn-discreto",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-10 px-5 text-[0.8125rem]",
  md: "h-12 px-6 text-[0.875rem]",
  lg: "h-14 px-8 text-[0.9375rem]",
};

/** Com seta, o lado direito encosta menos na borda para a bolinha respirar. */
const SIZES_COM_SETA: Record<ButtonSize, string> = {
  sm: "h-11 pl-5 pr-1.5 text-[0.8125rem]",
  md: "h-13 pl-6 pr-2 text-[0.875rem]",
  lg: "h-14 pl-7 pr-2 text-[0.9375rem]",
};

function report(track: ButtonTracking): void {
  if (track.kind === "reserve") {
    trackReserveClick(track.location);
    return;
  }
  trackContactClick(track.location);
}

export function Button({
  href,
  children,
  variant = "cafe",
  size = "md",
  seta = false,
  whatsapp = false,
  track,
  className,
  fullWidth = false,
  onNavigate,
}: ButtonProps) {
  const isExternal = href.startsWith("http");

  return (
    <a
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={
        track || onNavigate
          ? () => {
              if (track) report(track);
              onNavigate?.();
            }
          : undefined
      }
      className={cx(
        "btn",
        VARIANTS[variant],
        seta ? SIZES_COM_SETA[size] : SIZES[size],
        fullWidth && "w-full",
        className,
      )}
    >
      {whatsapp ? <IconeWhatsApp className="size-[1.15rem] shrink-0" /> : null}
      {children}
      {seta ? (
        <span aria-hidden className="btn-seta">
          <ArrowUpRight className="size-4" strokeWidth={2} />
        </span>
      ) : null}
    </a>
  );
}
