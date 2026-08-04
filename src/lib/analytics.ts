/**
 * Camada fina de tracking, sem provider acoplado.
 *
 * O site só empurra eventos para uma fila (`window.dataLayer`). Quem consome
 * essa fila é decisão de quem publica: GTM, GA4, Meta Pixel ou nada. Se
 * nenhum script estiver instalado, os eventos ficam acumulados no array e o
 * site segue funcionando igual.
 */

export type ReserveLocation =
  | "header"
  | "hero"
  | "spaces"
  | "reviews"
  | "datas"
  | "final"
  | "sticky";

export type ContactLocation = "hero" | "final" | "floating" | "sticky" | "footer";

type EventParams = Record<string, string | number | boolean>;

type AnalyticsEvent = { event: string } & EventParams;

declare global {
  interface Window {
    dataLayer?: AnalyticsEvent[];
  }
}

function push(event: string, params: EventParams = {}): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, params);
  }
}

/** Clique em qualquer CTA que leva ao anúncio do Airbnb. */
export function trackReserveClick(location: ReserveLocation): void {
  push("reserve_click", { location });
}

/** Clique em qualquer CTA que abre o WhatsApp. */
export function trackContactClick(location: ContactLocation): void {
  push("contact_click", { channel: "whatsapp", location });
}
