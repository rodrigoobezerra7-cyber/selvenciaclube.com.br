import { cn } from "@/lib/utils";
import type { CategoryInfo } from "@/types";

export type CategoryFilterValue = "todas" | string;

interface CategoryFilterProps {
  categories: CategoryInfo[];
  total: number;
  value: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
}

export default function CategoryFilter({
  categories,
  total,
  value,
  onChange,
}: CategoryFilterProps) {
  const options: { key: CategoryFilterValue; label: string; count: number }[] =
    [
      { key: "todas", label: "Todas", count: total },
      ...categories.map((category) => ({
        key: category.category as string,
        label: category.caption,
        count: Number(category.count),
      })),
    ];

  return (
    <fieldset
      aria-label="Filtrar por categoria"
      data-ocid="arsenal.filter.tabs"
      className="flex flex-wrap gap-2 border-0 p-0"
    >
      {options.map((option) => {
        const active = option.key === value;
        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange(option.key)}
            aria-pressed={active}
            data-ocid={`arsenal.filter.tab.${option.key}`}
            className={cn(
              "inline-flex items-center gap-2 border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary hover:text-foreground",
            )}
          >
            {option.label}
            <span
              className={cn(
                "min-w-5 border px-1 text-center text-[10px] tabular-nums",
                active
                  ? "border-primary-foreground/40 text-primary-foreground"
                  : "border-border text-muted-foreground",
              )}
            >
              {option.count}
            </span>
          </button>
        );
      })}
    </fieldset>
  );
}
