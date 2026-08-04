/** Tons de fundo usados no ritmo das seções. */
export type Tone = "creme" | "branco" | "noite";

export const TONE_SURFACE: Record<Tone, string> = {
  creme: "bg-creme text-ink",
  branco: "bg-branco text-ink",
  noite: "bg-noite text-creme on-dark",
};

export const IS_DARK: Record<Tone, boolean> = {
  creme: false,
  branco: false,
  noite: true,
};
