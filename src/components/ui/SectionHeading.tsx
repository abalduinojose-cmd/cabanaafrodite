import { cx } from "@/lib/cx";
import { IS_DARK, type Tone } from "@/lib/tones";
import { Reveal } from "@/components/ui/Reveal";

type SectionHeadingProps = {
  readonly title: string;
  readonly id?: string;
  readonly eyebrow?: string;
  readonly lead?: string;
  readonly tone?: Tone;
  readonly align?: "left" | "center";
  readonly className?: string;
};

export function SectionHeading({
  title,
  id,
  eyebrow,
  lead,
  tone = "creme",
  align = "left",
  className,
}: SectionHeadingProps) {
  const dark = IS_DARK[tone];

  return (
    <Reveal className={cx(align === "center" && "flex flex-col items-center text-center", className)}>
      {eyebrow ? (
        <p
          className={cx(
            "rotulo-caps flex items-center gap-3",
            dark ? "text-latte" : "text-cafe-deep",
          )}
        >
          <span aria-hidden className={cx("h-px w-9", dark ? "bg-latte/60" : "bg-cafe/50")} />
          {eyebrow}
        </p>
      ) : null}

      <h2
        id={id}
        className={cx(
          "mt-4 text-[clamp(2rem,4.6vw,3.4rem)]",
          dark ? "text-creme" : "text-ink",
        )}
      >
        {title}
      </h2>

      {lead ? (
        <p
          className={cx(
            "mt-5 max-w-[60ch] text-[1.0625rem] leading-relaxed",
            dark ? "text-creme/80" : "text-ink-muted",
          )}
        >
          {lead}
        </p>
      ) : null}
    </Reveal>
  );
}
