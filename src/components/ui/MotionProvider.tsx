"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * `reducedMotion="never"` mantém o render determinístico: o Motion não
 * consulta `matchMedia`, então o HTML do servidor e o do cliente são
 * idênticos e a hidratação não quebra. Quem pede menos movimento é atendido
 * no CSS (`[data-reveal] { transform: none }` em globals.css), que anula o
 * deslocamento e deixa só o fade.
 */
export function MotionProvider({ children }: { readonly children: ReactNode }) {
  return <MotionConfig reducedMotion="never">{children}</MotionConfig>;
}
