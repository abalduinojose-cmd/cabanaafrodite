import { Star } from "lucide-react";

import { cx } from "@/lib/cx";

type StarsProps = {
  readonly label: string;
  readonly className?: string;
};

/**
 * As cinco estrelas são decorativas; o texto acessível vai no aria-label.
 * Nada de <span class="sr-only"> aqui: dentro de um carrossel, o absolute
 * do sr-only ancoraria na seção e esticaria o scroll da página inteira.
 */
export function Stars({ label, className }: StarsProps) {
  return (
    <p role="img" aria-label={label} className={cx("flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} aria-hidden className="size-3.5 fill-cafe text-cafe" strokeWidth={0} />
      ))}
    </p>
  );
}
