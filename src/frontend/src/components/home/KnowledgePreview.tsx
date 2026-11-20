import type { KnowledgeCard } from "@/backend";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen } from "lucide-react";

const KNOWLEDGE_LABELS: Record<string, string> = {
  validade: "Validade",
  manutencao: "Manutenção",
  tecnicas: "Técnicas",
  checklists: "Checklists",
};

type KnowledgePreviewProps = {
  cards: KnowledgeCard[];
  isLoading: boolean;
};

export function KnowledgePreview({ cards, isLoading }: KnowledgePreviewProps) {
  const latest = cards.slice(0, 3);

  return (
    <section
      aria-labelledby="knowledge-preview-heading"
      data-ocid="central.knowledge_section"
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
        <div>
          <p className="label-tactical mb-1">{"// "}Fichas de campo</p>
          <h2
            id="knowledge-preview-heading"
            className="font-display text-2xl font-bold uppercase tracking-tight md:text-3xl"
          >
            Conhecimento
          </h2>
        </div>
        <Link
          to="/biblioteca"
          data-ocid="central.knowledge_link"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-primary transition-smooth hover:text-accent"
        >
          Abrir biblioteca
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      {isLoading ? (
        <div
          data-ocid="central.knowledge_loading_state"
          className="grid gap-3 md:grid-cols-3"
        >
          {Array.from({ length: 3 }, (_, i) => `knowledge-skeleton-${i}`).map(
            (id) => (
              <div
                key={id}
                className="h-32 animate-pulse border border-border bg-muted/40"
              />
            ),
          )}
        </div>
      ) : latest.length === 0 ? (
        <div
          data-ocid="central.knowledge_empty_state"
          className="flex flex-col items-start gap-2 border border-dashed border-border bg-muted/20 px-4 py-6"
        >
          <BookOpen
            className="size-5 text-muted-foreground"
            aria-hidden="true"
          />
          <p className="text-sm text-muted-foreground">
            Nenhuma ficha publicada na biblioteca ainda.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-3">
          {latest.map((card, index) => (
            <li key={card.id.toString()}>
              <Link
                to="/biblioteca/$cardId"
                params={{ cardId: card.id.toString() }}
                data-ocid={`central.knowledge_card.${index + 1}`}
                className="group flex h-full flex-col border border-border bg-card p-4 transition-smooth hover:border-primary/70"
              >
                <span className="mb-2 inline-flex w-fit border border-border bg-muted/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {KNOWLEDGE_LABELS[card.category] ?? card.category}
                </span>
                <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground transition-colors group-hover:text-primary">
                  {card.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {card.summary}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
