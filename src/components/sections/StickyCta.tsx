"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

import { IconeWhatsApp } from "@/components/ui/IconeWhatsApp";
import { A11Y, CONTACT, RESERVAR, STICKY } from "@/data/content";
import { cx } from "@/lib/cx";
import { trackContactClick, trackReserveClick } from "@/lib/analytics";

/** Fração da página rolada a partir da qual o WhatsApp flutuante aparece. */
const WHATS_THRESHOLD = 0.6;

/**
 * CTA fixo inteligente: pílula clara com selo de avaliação e seta café,
 * mais o botão redondo de WhatsApp que entra depois de 60% de rolagem.
 */
export function StickyCta() {
  const [pastHero, setPastHero] = useState(false);
  const [pastThreshold, setPastThreshold] = useState(false);

  useEffect(() => {
    const onScroll = (): void => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      setPastHero(window.scrollY > window.innerHeight * 0.75);
      setPastThreshold(progress >= WHATS_THRESHOLD);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      {/* Pílula de reserva */}
      <a
        href={RESERVAR.href}
        {...(RESERVAR.href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        inert={!pastHero}
        onClick={() => trackReserveClick("sticky")}
        className={cx("cta-fixo", !pastHero && "cta-oculto")}
      >
        <span className="flex flex-col gap-0.5 leading-tight">
          <span className="rotulo-caps text-[0.55rem] tracking-[0.12em] text-cafe-deep">
            {STICKY.seal}
          </span>
          <span className="text-[0.92rem] font-semibold">{STICKY.label}</span>
        </span>
        <span aria-hidden className="cta-seta">
          <ArrowUpRight className="size-[1.15rem]" strokeWidth={2} />
        </span>
      </a>

      {/* WhatsApp flutuante */}
      <a
        href={CONTACT.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={A11Y.whatsappFloating}
        inert={!pastThreshold}
        onClick={() => trackContactClick("floating")}
        className={cx(
          "fixed bottom-[max(0.9rem,env(safe-area-inset-bottom))] left-4 z-40 inline-flex size-12 items-center justify-center rounded-full border border-ink/10 bg-branco/92 text-cafe-deep shadow-[0_14px_34px_-18px_rgb(29_21_14/0.5)] backdrop-blur-md transition-all duration-500 ease-serra hover:bg-cafe hover:text-branco md:bottom-6 md:left-6 md:size-13",
          pastThreshold ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <IconeWhatsApp className="size-[1.35rem]" />
      </a>
    </>
  );
}
