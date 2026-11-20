import ClanContentCard from "@/components/clan/ClanContentCard";
import LockedContentNotice from "@/components/clan/LockedContentNotice";
import KnowledgeContent from "@/components/knowledge/KnowledgeContent";
import { useMemberSession } from "@/hooks/useMemberSession";
import {
  usePlans,
  useSurvivalCard,
  useSurvivalCards,
} from "@/hooks/useQueries";
import { planLabel } from "@/types";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, BookOpen, Lock, X } from "lucide-react";
import { useMemo, useState } from "react";

const SKELETON_IDS = Array.from({ length: 6 }, (_, i) => `clan-skeleton-${i}`);

function planNameForRank(
  plans: { name: string; rank: bigint }[],
  rank: bigint,
): string {
  const match = plans.find((plan) => plan.rank === rank);
  return match ? planLabel(match.name) : `Nível ${String(rank)}`;
}

export default function ClaBibliotecaPage() {
  const { planRank } = useMemberSession();
  const { data: plans } = usePlans();
  const { data: cards, isLoading, isError, refetch } = useSurvivalCards();
  const [openId, setOpenId] = useState<bigint | null>(null);

  const detail = useSurvivalCard(openId);
  const planList = useMemo(() => plans ?? [], [plans]);

  const unlockedCount = (cards ?? []).filter(
    (card) => planRank >= card.minPlanRank,
  ).length;

  const openCard = detail.data?.__kind__ === "ok" ? detail.data.ok : null;
  const openError = detail.data?.__kind__ === "err" ? detail.data.err : null;

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-muted/30">
        <div
          aria-hidden="true"
          className="grid-overlay pointer-events-none absolute inset-0 opacity-40"
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:py-14">
          <p className="label-tactical mb-3">
            {"// "}Clã Selvência · Biblioteca
          </p>
          <h1 className="font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-foreground md:text-5xl">
            Biblioteca de{" "}
            <span className="text-primary text-glow-amber">Sobrevivência</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Fichas exclusivas do Clã para consulta em campo. Cada ficha indica o
            plano mínimo necessário para liberar o conteúdo completo.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            <span>
              Fichas liberadas:{" "}
              <span className="text-foreground">
                {unlockedCount}/{cards?.length ?? 0}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="inline-block size-1.5 rounded-full bg-primary"
              />
              Seu plano: nível {String(planRank)}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:py-14">
        {isLoading ? (
          <div
            data-ocid="clan.loading_state"
            aria-busy="true"
            aria-live="polite"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <span className="sr-only">Carregando fichas de sobrevivência</span>
            {SKELETON_IDS.map((id) => (
              <div
                key={id}
                className="flex flex-col gap-4 border border-border bg-card p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="h-5 w-24 animate-pulse bg-muted" />
                  <div className="h-3 w-14 animate-pulse bg-muted" />
                </div>
                <div className="h-5 w-4/5 animate-pulse bg-muted" />
                <div className="space-y-2">
                  <div className="h-3 w-full animate-pulse bg-muted" />
                  <div className="h-3 w-11/12 animate-pulse bg-muted" />
                  <div className="h-3 w-2/3 animate-pulse bg-muted" />
                </div>
                <div className="mt-2 h-10 w-full animate-pulse bg-muted" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div
            data-ocid="clan.error_state"
            className="flex flex-col items-start gap-4 border border-border bg-card px-6 py-12"
          >
            <span className="inline-flex size-12 items-center justify-center border border-destructive/50 text-destructive">
              <AlertTriangle aria-hidden="true" className="size-6" />
            </span>
            <div className="space-y-1.5">
              <p className="font-display text-lg font-semibold uppercase tracking-tight text-foreground">
                Falha ao carregar a biblioteca
              </p>
              <p className="max-w-md text-sm text-muted-foreground">
                Não foi possível recuperar as fichas do clã. Verifique a conexão
                e tente novamente.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void refetch()}
              data-ocid="clan.retry_button"
              className="border border-primary bg-primary px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90"
            >
              Tentar novamente
            </button>
          </div>
        ) : !cards || cards.length === 0 ? (
          <div
            data-ocid="clan.empty_state"
            className="flex flex-col items-start gap-4 border border-border bg-card px-6 py-12"
          >
            <span className="inline-flex size-12 items-center justify-center border border-border text-muted-foreground">
              <BookOpen aria-hidden="true" className="size-6" />
            </span>
            <div className="space-y-1.5">
              <p className="font-display text-lg font-semibold uppercase tracking-tight text-foreground">
                Nenhuma ficha disponível
              </p>
              <p className="max-w-md text-sm text-muted-foreground">
                A biblioteca do clã ainda não tem fichas publicadas. Volte em
                breve para consultar o acervo de sobrevivência.
              </p>
            </div>
            <Link
              to="/cla"
              data-ocid="clan.empty_back_link"
              className="border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground transition-smooth hover:border-primary hover:text-primary"
            >
              Voltar ao Clã
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card, index) => (
              <ClanContentCard
                key={card.id.toString()}
                card={card}
                index={index}
                currentPlanRank={planRank}
                requiredPlanName={planNameForRank(planList, card.minPlanRank)}
                isOpen={openId === card.id}
                onOpen={(id) =>
                  setOpenId((current) => (current === id ? null : id))
                }
              />
            ))}
          </div>
        )}
      </section>

      {openId !== null && (
        <section className="border-t border-border bg-muted/20">
          <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 md:py-14">
            {detail.isLoading ? (
              <div
                data-ocid="clan.detail.loading_state"
                aria-busy="true"
                aria-live="polite"
                className="space-y-4"
              >
                <span className="sr-only">Carregando ficha</span>
                <div className="h-5 w-32 animate-pulse bg-muted" />
                <div className="h-9 w-4/5 animate-pulse bg-muted" />
                <div className="h-4 w-full animate-pulse bg-muted" />
                <div className="h-4 w-2/3 animate-pulse bg-muted" />
              </div>
            ) : detail.isError ? (
              <div
                data-ocid="clan.detail.error_state"
                className="flex flex-col items-start gap-4 border border-border bg-card px-6 py-10"
              >
                <p className="font-display text-lg font-semibold uppercase tracking-tight text-foreground">
                  Falha ao abrir a ficha
                </p>
                <p className="max-w-md text-sm text-muted-foreground">
                  Não foi possível carregar o conteúdo desta ficha. Tente
                  novamente.
                </p>
                <button
                  type="button"
                  onClick={() => void detail.refetch()}
                  data-ocid="clan.detail.retry_button"
                  className="border border-primary bg-primary px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90"
                >
                  Tentar novamente
                </button>
              </div>
            ) : openError ? (
              <div className="space-y-4">
                {openError.__kind__ === "notEntitled" ? (
                  <LockedContentNotice
                    requiredPlanName={planNameForRank(
                      planList,
                      openError.notEntitled,
                    )}
                    requiredPlanRank={openError.notEntitled}
                    currentPlanRank={planRank}
                    ocid="clan.detail.locked_notice"
                  />
                ) : (
                  <div
                    data-ocid="clan.detail.error_state"
                    className="flex flex-col items-start gap-4 border border-border bg-card px-6 py-10"
                  >
                    <span className="inline-flex size-12 items-center justify-center border border-border text-muted-foreground">
                      <Lock aria-hidden="true" className="size-6" />
                    </span>
                    <p className="font-display text-lg font-semibold uppercase tracking-tight text-foreground">
                      Ficha indisponível
                    </p>
                    <p className="max-w-md text-sm text-muted-foreground">
                      {openError.__kind__ === "notRegistered"
                        ? "Registre-se no Clã Selvência para consultar as fichas exclusivas."
                        : "Esta ficha não existe no acervo ou foi removida."}
                    </p>
                  </div>
                )}
              </div>
            ) : openCard ? (
              <article
                data-ocid="clan.detail.panel"
                className="corner-brackets animate-fade-in border border-border bg-card p-6 shadow-subtle sm:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="label-tactical mb-2">
                      {"// "}Ficha #{openCard.id.toString().padStart(3, "0")}
                    </p>
                    <h2 className="font-display text-2xl font-bold uppercase leading-tight tracking-tight text-foreground md:text-3xl">
                      {openCard.title}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {openCard.summary}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpenId(null)}
                    aria-label="Fechar ficha"
                    data-ocid="clan.detail.close_button"
                    className="inline-flex size-9 shrink-0 items-center justify-center border border-border text-muted-foreground transition-smooth hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <X aria-hidden="true" className="size-4" />
                  </button>
                </div>

                <div className="mt-6 border-t border-border/70 pt-6">
                  <KnowledgeContent content={openCard.content} />
                </div>

                <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/70 pt-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Plano mínimo:{" "}
                    {planNameForRank(planList, openCard.minPlanRank)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpenId(null)}
                    data-ocid="clan.detail.back_link"
                    className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-smooth hover:text-primary"
                  >
                    Voltar à biblioteca
                  </button>
                </div>
              </article>
            ) : null}
          </div>
        </section>
      )}
    </div>
  );
}
