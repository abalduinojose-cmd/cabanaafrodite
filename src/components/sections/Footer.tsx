import { LogoAfrodite } from "@/components/ui/Logo";
import { FOOTER, NAV, SITE } from "@/data/content";

/**
 * Rodapé enxuto: logo, uma linha de tagline, os contatos em botões
 * circulares só de ícone (nome acessível no aria-label e no title) e a
 * navegação em uma única fileira discreta.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-noite pb-28 pt-20 text-creme md:pb-20">
      <div className="container-page flex flex-col items-center text-center">
        <LogoAfrodite className="h-28 text-creme md:h-32" />

        <p className="mt-6 max-w-[42ch] text-[0.9375rem] leading-relaxed text-creme/70">
          {FOOTER.tagline}
        </p>

        <ul className="mt-9 flex items-center gap-3">
          {FOOTER.social.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                title={item.label}
                className="group relative inline-flex size-12 items-center justify-center rounded-full border border-creme/20 text-creme/80 transition-all duration-300 ease-serra hover:-translate-y-1 hover:border-transparent hover:text-branco hover:shadow-[0_14px_30px_-14px_rgb(156_107_68/0.9)]"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-linear-115 from-cafe-quente via-cafe to-cafe-deep opacity-0 transition-opacity duration-300 ease-serra group-hover:opacity-100"
                />
                <item.icon
                  aria-hidden
                  strokeWidth={1.5}
                  className="relative size-[1.15rem] transition-transform duration-300 ease-serra group-hover:scale-110"
                />
              </a>
            </li>
          ))}
        </ul>

        <nav aria-label={FOOTER.navTitle} className="mt-10">
          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            {NAV.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="link-draw rotulo-caps text-[0.625rem] text-creme/55 transition-colors duration-300 hover:text-creme"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-12 w-full border-t border-creme/12 pt-7">
          <div className="flex flex-col items-center gap-2 text-[0.75rem] text-creme/45 sm:flex-row sm:justify-between">
            <p>{`© ${year} ${SITE.name}. ${FOOTER.rights}`}</p>
            <p className="max-sm:order-first">{FOOTER.regionLabel}</p>
            <p>{FOOTER.credit}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
