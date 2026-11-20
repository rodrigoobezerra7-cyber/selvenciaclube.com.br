import type { CategoryInfo } from "@/backend";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Boxes } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  lanternas: "Lanternas",
  facas: "Facas",
  binoculos: "Binóculos",
  camisetas: "Camisetas",
};

type ArsenalPreviewProps = {
  categories: CategoryInfo[];
  isLoading: boolean;
};

export function ArsenalPreview({ categories, isLoading }: ArsenalPreviewProps) {
  return (
    <section
      aria-labelledby="arsenal-preview-heading"
      data-ocid="central.arsenal_section"
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
        <div>
          <p className="label-tactical mb-1">{"// "}Equipamentos de combate</p>
          <h2
            id="arsenal-preview-heading"
            className="font-display text-2xl font-bold uppercase tracking-tight md:text-3xl"
          >
            Arsenal Selvência
          </h2>
        </div>
        <Link
          to="/arsenal"
          data-ocid="central.arsenal_link"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-primary transition-smooth hover:text-accent"
        >
          Ver arsenal completo
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      {isLoading ? (
        <div
          data-ocid="central.arsenal_loading_state"
          className="grid grid-cols-2 gap-3 md:grid-cols-4"
        >
          {Array.from({ length: 4 }, (_, i) => `arsenal-skeleton-${i}`).map(
            (id) => (
              <div
                key={id}
                className="h-28 animate-pulse border border-border bg-muted/40"
              />
            ),
          )}
        </div>
      ) : categories.length === 0 ? (
        <div
          data-ocid="central.arsenal_empty_state"
          className="flex flex-col items-start gap-2 border border-dashed border-border bg-muted/20 px-4 py-6"
        >
          <Boxes className="size-5 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            Nenhuma categoria carregada no arsenal no momento.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {categories.map((category, index) => (
            <li key={category.category}>
              <Link
                to="/arsenal"
                data-ocid={`central.arsenal_category.${index + 1}`}
                className="group flex h-full flex-col justify-between border border-border bg-card p-4 transition-smooth hover:border-primary/70"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-3 font-display text-base font-bold uppercase tracking-tight text-foreground transition-colors group-hover:text-primary">
                  {CATEGORY_LABELS[category.category] ?? category.category}
                </span>
                <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {category.count.toString()} itens
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
