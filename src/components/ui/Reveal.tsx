"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const TAGS = {
  div: motion.div,
  li: motion.li,
  article: motion.article,
  figure: motion.figure,
  p: motion.p,
} as const;

type RevealTag = keyof typeof TAGS;

type RevealProps = {
  readonly children: ReactNode;
  readonly as?: RevealTag;
  readonly delay?: number;
  readonly className?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Entrada discreta: fade + 24px de subida, uma única vez por elemento.
 * Quem pede menos movimento recebe só o fade, via `MotionProvider`.
 */
export function Reveal({ children, as = "div", delay = 0, className }: RevealProps) {
  const Tag = TAGS[as];

  return (
    <Tag
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}
