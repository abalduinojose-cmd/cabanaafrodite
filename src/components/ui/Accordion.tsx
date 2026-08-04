import { Plus } from "lucide-react";

import type { Rule } from "@/data/content";

type AccordionProps = {
  readonly items: readonly Rule[];
};

/** `<details>` nativo estilizado: acessível e sem JavaScript. */
export function Accordion({ items }: AccordionProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-ink/10 bg-branco">
      {items.map((item) => (
        <details key={item.id} name="regras" className="group border-b border-ink/8 last:border-0">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-8 px-6 py-5 transition-colors duration-300 hover:bg-creme md:px-8 [&::-webkit-details-marker]:hidden">
            <h3 className="font-body text-[1.0625rem] font-semibold leading-snug text-ink">
              {item.question}
            </h3>
            <span
              aria-hidden
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-ink/12 text-cafe transition-all duration-300 ease-serra group-open:rotate-45 group-open:border-cafe group-open:bg-cafe group-open:text-branco"
            >
              <Plus strokeWidth={1.75} className="size-4" />
            </span>
          </summary>
          <p className="max-w-[65ch] px-6 pb-6 text-[1rem] leading-relaxed text-ink-muted md:px-8">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
