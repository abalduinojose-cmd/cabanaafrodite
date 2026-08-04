"use client";

import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { LogoMarca } from "@/components/ui/Logo";
import { A11Y, ACTIONS, CONTACT, NAV, RESERVAR } from "@/data/content";
import { cx } from "@/lib/cx";

const HOME_HREF = "#topo";
const MENU_ID = "menu-mobile";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") setOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  const solid = scrolled || open;

  return (
    <>
      <header
        className={cx(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-serra",
          solid
            ? "border-b border-ink/8 bg-creme/92 text-ink shadow-[0_12px_30px_-26px_rgb(29_21_14/0.5)] backdrop-blur-md"
            : "border-b border-transparent text-branco on-dark",
        )}
      >
        <a
          href="#conteudo"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-6 focus-visible:top-4 focus-visible:z-10 focus-visible:rounded-full focus-visible:bg-cafe focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:text-branco"
        >
          {A11Y.skipToContent}
        </a>

        <div className="container-page flex h-[4.5rem] items-center justify-between gap-6">
          <a href={HOME_HREF} aria-label={A11Y.homeLink} className="shrink-0">
            {/* sobre a foto do hero o branco precisa de um respiro de sombra */}
            <LogoMarca
              className={cx(
                "h-12 transition-[filter] duration-500",
                solid ? "drop-shadow-none" : "drop-shadow-[0_1px_10px_rgb(0_0_0/0.55)]",
              )}
            />
          </a>

          <nav aria-label={A11Y.mainNav} className="hidden items-center gap-5 lg:flex xl:gap-7">
            {NAV.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cx(
                  "link-draw rotulo-caps py-1 transition-colors duration-300",
                  solid ? "text-ink/70 hover:text-ink" : "text-branco/80 hover:text-branco",
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Em telas pequenas quem carrega a reserva é o CTA fixo. */}
            <div className="hidden sm:block">
              <Button
                href={RESERVAR.href}
                size="sm"
                novaAba={RESERVAR.novaAba}
                track={{ kind: "reserve", location: "header" }}
              >
                {RESERVAR.curto}
              </Button>
            </div>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls={MENU_ID}
              aria-label={open ? A11Y.closeMenu : A11Y.openMenu}
              className={cx(
                "inline-flex size-11 items-center justify-center rounded-full border transition-colors duration-300 lg:hidden",
                solid ? "border-ink/15 text-ink" : "border-branco/40 text-branco",
              )}
            >
              {open ? (
                <X className="size-5" strokeWidth={1.5} aria-hidden />
              ) : (
                <Menu className="size-5" strokeWidth={1.5} aria-hidden />
              )}
            </button>
          </div>
        </div>
      </header>

      {/*
        O painel vive fora do <header> de propósito: o `backdrop-blur` do
        header cria bloco de contenção e um filho `fixed` colapsaria para
        a altura da barra.
      */}
      {open ? (
        <div
          id={MENU_ID}
          className="on-dark fixed inset-x-0 bottom-0 top-[4.5rem] z-40 flex flex-col justify-between overflow-y-auto bg-noite lg:hidden"
        >
          <nav aria-label={A11Y.mobileNav} className="container-page flex flex-col py-4">
            {NAV.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={close}
                style={{ animationDelay: `${index * 55}ms` }}
                className="rise border-b border-creme/10 py-5 font-display text-3xl font-semibold text-creme transition-colors duration-300 hover:text-latte"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="container-page flex flex-col gap-3 border-t border-creme/10 py-6">
            <Button
              href={RESERVAR.href}
              size="lg"
              seta
              fullWidth
              novaAba={RESERVAR.novaAba}
              onNavigate={close}
              track={{ kind: "reserve", location: "header" }}
            >
              {RESERVAR.curto}
            </Button>
            <Button
              href={CONTACT.whatsapp}
              variant="contornoClaro"
              size="lg"
              fullWidth
              whatsapp
              track={{ kind: "contact", location: "sticky" }}
            >
              {ACTIONS.whatsapp}
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
