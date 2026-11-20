import { PostComposer } from "@/components/clan/PostComposer";
import { PostList } from "@/components/clan/PostList";
import { useMemberSession } from "@/hooks/useMemberSession";
import { useCommunityPosts } from "@/hooks/useQueries";
import { formatMonthlyPrice, planLabel } from "@/types";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, Lock, Users } from "lucide-react";

const RECRUTA_RANK = 1n;

function PlanGate() {
  const { plan } = useMemberSession();
  return (
    <div
      data-ocid="community.plan_denied_state"
      className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center px-4 text-center"
    >
      <span className="mb-5 inline-flex size-14 items-center justify-center border border-primary/50 text-primary">
        <Lock className="size-6" aria-hidden="true" />
      </span>
      <p className="label-tactical mb-2">Acesso restrito ao mural</p>
      <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
        Requer plano Recruta
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        O mural privado do Clã é liberado a partir do plano{" "}
        <span className="font-semibold text-foreground">
          {planLabel("recruta")}
        </span>
        . Seu plano atual:{" "}
        <span className="font-semibold text-foreground">
          {plan
            ? `${planLabel(plan.name)} · ${formatMonthlyPrice(plan.priceCents)}`
            : "Visitante"}
        </span>
        .
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/cla"
          data-ocid="community.plan_upgrade_link"
          className="border border-primary bg-primary px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90"
        >
          Assinar o Clã Selvência
        </Link>
        <Link
          to="/central"
          data-ocid="community.plan_back_link"
          className="border border-border px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-smooth hover:border-primary hover:text-primary"
        >
          Voltar à Central
        </Link>
      </div>
    </div>
  );
}

export default function ClaComunidadePage() {
  const { planRank, isPlanLoading } = useMemberSession();
  const postsQuery = useCommunityPosts();
  const isEntitled = planRank >= RECRUTA_RANK;

  if (isPlanLoading) {
    return (
      <div
        data-ocid="community.plan_loading_state"
        className="flex min-h-[60vh] items-center justify-center"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Verificando credenciais
          </p>
        </div>
      </div>
    );
  }

  if (!isEntitled) {
    return <PlanGate />;
  }

  const posts = postsQuery.data ?? [];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-16">
      <Link
        to="/cla"
        data-ocid="community.back_link"
        className="mb-8 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-smooth hover:text-primary"
      >
        <ChevronLeft className="size-3.5" aria-hidden="true" />
        Clã Selvência
      </Link>

      <div className="flex flex-col gap-4 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label-tactical mb-3">
            {"// "}Clã Selvência · Comunidade
          </p>
          <h1 className="font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-foreground md:text-5xl">
            Mural <span className="text-primary text-glow-amber">Privado</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Canal de transmissão entre membros do Clã. Compartilhe técnicas,
            alertas e relatos de campo com quem opera ao seu lado.
          </p>
        </div>
        <div className="flex items-center gap-2 border border-border bg-card px-4 py-2.5">
          <Users className="size-4 text-primary" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {posts.length} {posts.length === 1 ? "post" : "posts"} no canal
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start">
        <section aria-label="Mural de posts" className="min-w-0">
          <PostList
            posts={posts}
            isLoading={postsQuery.isLoading}
            isError={postsQuery.isError}
            onRetry={() => void postsQuery.refetch()}
          />
        </section>

        <aside className="lg:sticky lg:top-24">
          <PostComposer />
        </aside>
      </div>
    </div>
  );
}
