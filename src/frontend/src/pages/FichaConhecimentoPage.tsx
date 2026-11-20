import KnowledgeCategoryBadge from "@/components/knowledge/KnowledgeCategoryBadge";
import KnowledgeContent from "@/components/knowledge/KnowledgeContent";
import { useKnowledgeCard, useKnowledgeList } from "@/hooks/useQueries";
import { KNOWLEDGE_CATEGORY_LABEL } from "@/types";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, FileQuestion } from "lucide-react";

function parseCardId(raw: string): bigint | null {
  if (!/^\d+$/.test(raw)) return null;
  try {
    return BigInt(raw);
  } catch {
    return null;
  }
}

export default function FichaConhecimentoPage() {
  const { cardId } = useParams({ from: "/biblioteca/$cardId" });
  const id = parseCardId(cardId);
  const { data: card, isLoading, isError, refetch } = useKnowledgeCard(id);
  const { data: allCards } = useKnowledgeList();

  const related = (allCards ?? [])
    .filter((item) => item.id !== id && item.category === card?.category)
    .slice(0, 3);

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-muted/30">
        <div
          aria-hidden="true"
          className="grid-overlay pointer-events-none absolute inset-0 opacity-40"
        />
        <div className="relative mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 md:py-14">
          <Link
            to="/biblioteca"
            data-ocid="knowledge.back_link"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-smooth hover:text-primary"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            Biblioteca
          </Link>

          {isLoading ? (
            <div
              data-ocid="knowledge.loading_state"
              aria-busy="true"
              aria-live="polite"
              className="mt-6 space-y-4"
            >
              <span className="sr-only">Carregando ficha de conhecimento</span>
              <div className="h-5 w-32 animate-pulse bg-muted" />
              <div className="h-9 w-4/5 animate-pulse bg-muted" />
              <div className="h-4 w-full animate-pulse bg-muted" />
              <div className="h-4 w-2/3 animate-pulse bg-muted" />
            </div>
          ) : isError || !card ? (
            <div
              data-ocid="knowledge.error_state"
              className="mt-8 flex flex-col items-start gap-4 border border-border bg-card px-6 py-12"
            >
              <span className="inline-flex size-12 items-center justify-center border border-border text-muted-foreground">
                <FileQuestion aria-hidden="true" className="size-6" />
              </span>
              <div className="space-y-1.5">
                <p className="font-display text-lg font-semibold uppercase tracking-tight text-foreground">
                  Ficha não encontrada
                </p>
                <p className="max-w-md text-sm text-muted-foreground">
                  Esta ficha não existe no acervo ou foi removida. Volte à
                  biblioteca para consultar as fichas disponíveis.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to="/biblioteca"
                  data-ocid="knowledge.back_button"
                  className="border border-primary bg-primary px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90"
                >
                  Voltar à biblioteca
                </Link>
                {id !== null && (
                  <button
                    type="button"
                    onClick={() => void refetch()}
                    data-ocid="knowledge.retry_button"
                    className="border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground transition-smooth hover:border-primary hover:text-primary"
                  >
                    Tentar novamente
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-6 animate-fade-in">
              <KnowledgeCategoryBadge category={card.category} />
              <h1 className="mt-4 font-display text-3xl font-bold uppercase leading-tight tracking-tight text-foreground md:text-4xl">
                {card.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                {card.summary}
              </p>
            </div>
          )}
        </div>
      </section>

      {!isLoading && card && (
        <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 md:py-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_15rem]">
            <article
              data-ocid="knowledge.content"
              className="corner-brackets border border-border bg-card p-6 shadow-subtle sm:p-8"
            >
              <p className="label-tactical mb-5">{"// "}Conteúdo da ficha</p>
              <KnowledgeContent content={card.content} />
            </article>

            <aside className="space-y-6">
              <div className="border border-border bg-card p-5">
                <p className="label-tactical mb-3">Metadados</p>
                <dl className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      Categoria
                    </dt>
                    <dd className="text-right text-foreground">
                      {KNOWLEDGE_CATEGORY_LABEL[card.category] ?? card.category}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      Registro
                    </dt>
                    <dd className="font-mono text-xs text-foreground">
                      #{card.id.toString().padStart(3, "0")}
                    </dd>
                  </div>
                </dl>
              </div>

              {related.length > 0 && (
                <div className="border border-border bg-card p-5">
                  <p className="label-tactical mb-3">Fichas relacionadas</p>
                  <ul className="space-y-2">
                    {related.map((item) => (
                      <li key={item.id.toString()}>
                        <Link
                          to="/biblioteca/$cardId"
                          params={{ cardId: item.id.toString() }}
                          data-ocid={`knowledge.related.${item.id.toString()}`}
                          className="group flex items-start justify-between gap-2 border-b border-border/60 pb-2 text-sm text-muted-foreground transition-smooth last:border-b-0 last:pb-0 hover:text-primary"
                        >
                          <span className="min-w-0 leading-snug">
                            {item.title}
                          </span>
                          <ArrowRight
                            aria-hidden="true"
                            className="mt-0.5 size-3.5 shrink-0 transition-smooth group-hover:translate-x-0.5"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </section>
      )}
    </div>
  );
}
