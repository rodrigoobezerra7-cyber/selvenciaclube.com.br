import type { KnowledgeCard } from "@/types";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import KnowledgeCategoryBadge from "./KnowledgeCategoryBadge";

interface KnowledgeCardTileProps {
  card: KnowledgeCard;
  index: number;
}

export default function KnowledgeCardTile({
  card,
  index,
}: KnowledgeCardTileProps) {
  const code = String(index + 1).padStart(2, "0");

  return (
    <Link
      to="/biblioteca/$cardId"
      params={{ cardId: card.id.toString() }}
      data-ocid={`knowledge.item.${index + 1}`}
      className="group relative flex animate-fade-in flex-col gap-4 border border-border bg-card p-5 shadow-subtle transition-smooth hover:border-primary/70 hover:shadow-elevated focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{ animationDelay: `${Math.min(index, 8) * 80}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <KnowledgeCategoryBadge category={card.category} />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
          FICHA {code}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
          {card.title}
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {card.summary}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-border/70 pt-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Abrir ficha
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-4 text-muted-foreground transition-smooth group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
        />
      </div>
    </Link>
  );
}
