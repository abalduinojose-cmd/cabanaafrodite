import type { LucideIcon } from "lucide-react";

import { cx } from "@/lib/cx";

type ChipProps = {
  readonly label: string;
  readonly icon: LucideIcon;
  readonly className?: string;
};

export function Chip({ label, icon: Icon, className }: ChipProps) {
  return (
    <li
      className={cx(
        "inline-flex items-center gap-2.5 rounded-full border border-ink/12 bg-branco px-4 py-2 text-sm font-medium text-ink/85",
        className,
      )}
    >
      <Icon className="size-4 shrink-0 text-cafe" strokeWidth={1.5} aria-hidden />
      {label}
    </li>
  );
}
