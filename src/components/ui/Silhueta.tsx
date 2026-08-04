import { cx } from "@/lib/cx";
import type { Tone } from "@/lib/tones";

const TONE_BG: Record<Tone, string> = {
  creme: "bg-creme",
  branco: "bg-branco",
  noite: "bg-noite",
};

const TONE_FILL: Record<Tone, string> = {
  creme: "text-creme",
  branco: "text-branco",
  noite: "text-noite",
};

type SilhuetaProps = {
  readonly from: Tone;
  readonly to: Tone;
};

/**
 * Divisor de seção: a silhueta da serra com a cabana A-Frame no alto e o
 * capim característico do terreno. A cor de baixo sobe como morro.
 */
export function Silhueta({ from, to }: SilhuetaProps) {
  return (
    <div aria-hidden className={cx("relative -mb-px overflow-hidden", TONE_BG[from])}>
      <svg
        viewBox="0 0 1440 110"
        preserveAspectRatio="none"
        focusable="false"
        className={cx("block h-14 w-full md:h-24", TONE_FILL[to])}
      >
        {/* morro de trás, mais suave */}
        <path
          d="M0 110 L0 84 Q 220 44 480 66 Q 700 84 900 58 Q 1140 30 1440 70 L1440 110 Z"
          fill="currentColor"
          opacity="0.35"
        />
        {/* morro da frente */}
        <path
          d="M0 110 L0 96 Q 260 66 560 84 Q 840 100 1060 74 Q 1260 52 1440 88 L1440 110 Z"
          fill="currentColor"
        />
        {/* cabana A-Frame no alto do morro de trás */}
        <g transform="translate(1032 18)">
          <path d="M30 0 60 44H0Z" fill="currentColor" />
          <path d="M30 14 44 44H16Z" fill="currentColor" opacity="0.4" />
        </g>
        {/* capim: riscos finos subindo do morro da frente */}
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.65">
          <path d="M180 92 Q 178 78 172 70" fill="none" />
          <path d="M196 94 Q 198 80 206 74" fill="none" />
          <path d="M420 84 Q 418 70 410 64" fill="none" />
          <path d="M436 86 Q 440 72 448 66" fill="none" />
          <path d="M700 96 Q 698 82 690 76" fill="none" />
          <path d="M716 96 Q 720 82 728 78" fill="none" />
          <path d="M1250 74 Q 1248 60 1240 54" fill="none" />
          <path d="M1266 76 Q 1270 62 1278 58" fill="none" />
        </g>
      </svg>
    </div>
  );
}
