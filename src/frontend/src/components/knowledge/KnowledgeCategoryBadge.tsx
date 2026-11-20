import { cn } from "@/lib/utils";
import { KNOWLEDGE_CATEGORY_LABEL } from "@/types";

interface KnowledgeCategoryBadgeProps {
  category: string;
  className?: string;
}

export default function KnowledgeCategoryBadge({
  category,
  className,
}: KnowledgeCategoryBadgeProps) {
  const label = KNOWLEDGE_CATEGORY_LABEL[category] ?? category;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border border-primary/40 bg-primary/10 px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-primary",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="inline-block size-1 shrink-0 rounded-full bg-primary"
      />
      {label}
    </span>
  );
}
