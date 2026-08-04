"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

import { A11Y } from "@/data/content";
import { cx } from "@/lib/cx";

type TrilhoProps = {
  readonly children: ReactNode;
  readonly ariaLabel: string;
  /** Classes do <ul> rolável (gap, snap etc.). */
  readonly className?: string;
  /** Onde as setas aparecem: acima do trilho, alinhadas à direita. */
  readonly setasClassName?: string;
  /** Esconde a máscara de fade (usada no filmstrip). */
  readonly comFade?: boolean;
};

/**
 * Carrossel arrastável com setas: rola por um card inteiro, aceita arrasto
 * com o ponteiro (mouse inclusive) e desabilita as setas nas pontas.
 */
export function Trilho({ children, ariaLabel, className, setasClassName, comFade = false }: TrilhoProps) {
  const ref = useRef<HTMLUListElement>(null);
  const drag = useRef<{ startX: number; startScroll: number; moved: boolean } | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const syncEdges = useCallback((): void => {
    const node = ref.current;
    if (!node) return;
    const maxScroll = node.scrollWidth - node.clientWidth;
    setAtStart(node.scrollLeft <= 8);
    setAtEnd(node.scrollLeft >= maxScroll - 8);
  }, []);

  useEffect(() => {
    syncEdges();
    window.addEventListener("resize", syncEdges);
    return () => window.removeEventListener("resize", syncEdges);
  }, [syncEdges]);

  const scrollByCard = useCallback((direction: 1 | -1): void => {
    const node = ref.current;
    if (!node) return;
    const card = node.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 20 : node.clientWidth * 0.8;
    node.scrollBy({ left: step * direction, behavior: "smooth" });
  }, []);

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLUListElement>): void => {
    // Só arrasto com mouse: no toque o scroll nativo já resolve.
    if (event.pointerType !== "mouse") return;
    const node = ref.current;
    if (!node) return;
    drag.current = { startX: event.clientX, startScroll: node.scrollLeft, moved: false };
  }, []);

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLUListElement>): void => {
    const node = ref.current;
    const state = drag.current;
    if (!node || !state) return;
    const delta = event.clientX - state.startX;
    if (Math.abs(delta) > 4) {
      state.moved = true;
      node.classList.add("snap-none", "cursor-grabbing", "select-none");
      node.scrollLeft = state.startScroll - delta;
    }
  }, []);

  const endDrag = useCallback((): void => {
    const node = ref.current;
    if (node) node.classList.remove("snap-none", "cursor-grabbing", "select-none");
    drag.current = null;
  }, []);

  return (
    <div>
      <div className={cx("flex justify-end gap-2.5", setasClassName)}>
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          disabled={atStart}
          aria-label={A11Y.scrollPrevious}
          className="seta-trilho"
        >
          <ChevronLeft className="size-5" strokeWidth={1.75} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          disabled={atEnd}
          aria-label={A11Y.scrollNext}
          className="seta-trilho"
        >
          <ChevronRight className="size-5" strokeWidth={1.75} aria-hidden />
        </button>
      </div>

      <ul
        ref={ref}
        onScroll={syncEdges}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        tabIndex={0}
        role="group"
        aria-label={ariaLabel}
        className={cx(
          // `relative` de propósito: qualquer descendente absolute (sr-only,
          // por exemplo) ancora aqui dentro e fica clipado pelo scroll, em
          // vez de esticar a página inteira.
          "scrollbar-none relative flex cursor-grab snap-x snap-proximity gap-5 overflow-x-auto pb-2",
          comFade && "trilho-fotos",
          className,
        )}
      >
        {children}
      </ul>
    </div>
  );
}
