import KnowledgeCardSkeleton from "@/components/knowledge/KnowledgeCardSkeleton";
import KnowledgeCardTile from "@/components/knowledge/KnowledgeCardTile";
import { useKnowledgeList } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { KNOWLEDGE_CATEGORY_LABEL } from "@/types";
import { BookOpen, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

const CATEGORY_ORDER = ["checklists", "validade", "manutencao", "tecnicas"];

export default function ConhecimentoPage() {
  const { data, isLoading, isError, refetch } = useKnowledgeList();
  const [activeCategory, setActiveCategory] = useState<string>("todas");

  const cards = data ?? [];

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const card of cards) {
      map[card.category] = (map[card.category] ?? 0) + 1;
    }
    return map;
  }, [cards]);

  const filtered = useMemo(
    () =>
      activeCategory === "todas"
        ? cards
        : cards.filter((card) => card.category === activeCategory),
    [cards, activeCategory],
  );

  const filters = [
    { value: "todas", label: "Todas", count: cards.length },
    ...CATEGORY_ORDER.map((value) => ({
      value,
      label: KNOWLEDGE_CATEGORY_LABEL[value] ?? value,
      count: counts[value] ?? 0,
    })),
  ];

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-muted/30">
        <div
          aria-hidden="true"
          className="grid-overlay pointer-events-none absolute inset-0 opacity-40"
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-16">
          <p className="label-tactical mb-3">{"// "}Biblioteca de campo</p>
          <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
            Conhecimento
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Fichas operacionais da comunidade Selvência: checklists de kits,
            controle de validade, manutenção de equipamentos e técnicas de
            sobrevivência. Consulte antes de sair a campo.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="inline-block size-1.5 animate-pulse-dot rounded-full bg-primary"
              />
              Acervo ativo
            </span>
            <span>{cards.length} fichas catalogadas</span>
            <span>{CATEGORY_ORDER.length} categorias</span>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:py-14">
        <div className="mb-8 flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label-tactical mb-1">Filtro de categoria</p>
            <h2 className="font-display text-xl font-semibold uppercase tracking-tight text-foreground md:text-2xl">
              Fichas táticas
            </h2>
          </div>
          <fieldset
            aria-label="Filtrar fichas por categoria"
            className="flex flex-wrap gap-2"
          >
            {filters.map((filter) => {
              const active = activeCategory === filter.value;
              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveCategory(filter.value)}
                  aria-pressed={active}
                  data-ocid={`knowledge.filter.${filter.value}`}
                  className={cn(
                    "inline-flex items-center gap-2 border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/60 hover:text-foreground",
                  )}
                >
                  {filter.label}
                  <span
                    className={cn(
                      "text-[10px] tabular-nums",
                      active
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground/70",
                    )}
                  >
                    {String(filter.count).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </fieldset>
        </div>

        {isLoading ? (
          <KnowledgeCardSkeleton />
        ) : isError ? (
          <div
            data-ocid="knowledge.error_state"
            className="flex flex-col items-center gap-4 border border-destructive/40 bg-destructive/5 px-6 py-14 text-center"
          >
            <p className="font-display text-lg font-semibold uppercase tracking-tight text-foreground">
              Falha na transmissão
            </p>
            <p className="max-w-md text-sm text-muted-foreground">
              Não foi possível carregar o acervo de conhecimento. Verifique a
              conexão e tente novamente.
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              data-ocid="knowledge.retry_button"
              className="inline-flex items-center gap-2 border border-primary bg-primary px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90"
            >
              <RotateCcw aria-hidden="true" className="size-3.5" />
              Tentar novamente
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div
            data-ocid="knowledge.empty_state"
            className="flex flex-col items-center gap-4 border border-dashed border-border bg-card/50 px-6 py-16 text-center"
          >
            <span className="inline-flex size-12 items-center justify-center border border-border text-muted-foreground">
              <BookOpen aria-hidden="true" className="size-6" />
            </span>
            <div className="space-y-1.5">
              <p className="font-display text-lg font-semibold uppercase tracking-tight text-foreground">
                Nenhuma ficha disponível
              </p>
              <p className="max-w-md text-sm text-muted-foreground">
                {activeCategory === "todas"
                  ? "O acervo ainda está sendo catalogado. Volte em breve para consultar as fichas."
                  : "Não há fichas nesta categoria por enquanto. Selecione outra categoria para continuar."}
              </p>
            </div>
            {activeCategory !== "todas" && (
              <button
                type="button"
                onClick={() => setActiveCategory("todas")}
                data-ocid="knowledge.clear_filter_button"
                className="border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground transition-smooth hover:border-primary hover:text-primary"
              >
                Ver todas as fichas
              </button>
            )}
          </div>
        ) : (
          <div
            data-ocid="knowledge.list"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((card, index) => (
              <KnowledgeCardTile
                key={card.id.toString()}
                card={card}
                index={index}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
