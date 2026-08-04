import type { ReactNode } from "react";

import { cx } from "@/lib/cx";
import { TONE_SURFACE, type Tone } from "@/lib/tones";

type SectionProps = {
  readonly children: ReactNode;
  readonly id?: string;
  readonly tone?: Tone;
  readonly className?: string;
  readonly containerClassName?: string;
  /** Conteúdo sangrando até as bordas: dispensa o container interno. */
  readonly bleed?: boolean;
  readonly labelledBy?: string;
};

export function Section({
  children,
  id,
  tone = "creme",
  className,
  containerClassName,
  bleed = false,
  labelledBy,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cx(TONE_SURFACE[tone], "relative", className)}
    >
      {bleed ? children : <div className={cx("container-page", containerClassName)}>{children}</div>}
    </section>
  );
}
