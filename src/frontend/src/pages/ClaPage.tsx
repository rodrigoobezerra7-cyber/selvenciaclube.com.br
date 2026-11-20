import type { Plan } from "@/backend";
import { LevelTrack } from "@/components/clan/LevelTrack";
import { PlanCard } from "@/components/clan/PlanCard";
import { SubscriptionPanel } from "@/components/clan/SubscriptionPanel";
import { useMemberSession } from "@/hooks/useMemberSession";
import {
  useLevels,
  useMyProgress,
  usePlans,
  useSubscribe,
} from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { planLabel } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  Loader2,
  MessagesSquare,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

const PLAN_BENEFITS: Record<string, readonly string[]> = {
  visitante: [
    "Acesso à Central de Operações",
    "Arsenal e biblioteca pública",
    "Fichas de conhecimento abertas",
  ],
  recruta: [
    "Biblioteca de sobrevivência completa",
    "Cursos e treinamentos introdutórios",
    "Organização de kits pessoais",
  ],
  guardiao: [
    "Tudo do plano Recruta",
    "Planejamento de emergência",
    "Comunidade privada do Clã",
    "Conteúdos exclusivos de campo",
  ],
  sentinela: [
    "Tudo do plano Guardião",
    "Acesso antecipado a novos módulos",
    "Prioridade em treinamentos presenciais",
    "Mentoria direta com instrutores",
  ],
};

const CLAN_MODULES = [
  {
    to: "/cla/biblioteca",
    title: "Biblioteca de Sobrevivência",
    description: "Fichas táticas de campo, manutenção e protocolos.",
    icon: BookOpen,
    ocid: "cla.module.biblioteca",
  },
  {
    to: "/cla/cursos",
    title: "Cursos e Treinamentos",
    description: "Trilhas guiadas para elevar o nível de preparo.",
    icon: GraduationCap,
    ocid: "cla.module.cursos",
  },
  {
    to: "/cla/comunidade",
    title: "Comunidade Privada",
    description: "Relatos, dúvidas e operações entre membros.",
    icon: MessagesSquare,
    ocid: "cla.module.comunidade",
  },
  {
    to: "/cla/kits",
    title: "Organização de Kits",
    description: "Monte e revise seus kits de emergência.",
    icon: PackageCheck,
    ocid: "cla.module.kits",
  },
] as const;

function scrollToPlans() {
  document
    .getElementById("planos")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function SectionHeading({
  code,
  title,
  description,
}: {
  code: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 max-w-2xl">
      <p className="label-tactical mb-2">{`// ${code}`}</p>
      <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground md:text-3xl">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function PlansSkeleton() {
  const ids = Array.from({ length: 4 }, (_, i) => `plan-skeleton-${i}`);
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {ids.map((id) => (
        <div
          key={id}
          className="h-72 animate-pulse border border-border bg-card/60"
        />
      ))}
    </div>
  );
}

function LevelsSkeleton() {
  const ids = Array.from({ length: 4 }, (_, i) => `level-skeleton-${i}`);
  return (
    <div className="space-y-3">
      {ids.map((id) => (
        <div
          key={id}
          className="h-20 animate-pulse border border-border bg-card/60"
        />
      ))}
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
  ocid,
}: {
  message: string;
  onRetry: () => void;
  ocid: string;
}) {
  return (
    <div
      data-ocid={ocid}
      className="flex flex-col items-start gap-3 border border-destructive/40 bg-destructive/10 p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-2">
        <AlertTriangle
          className="mt-0.5 size-4 shrink-0 text-destructive"
          aria-hidden="true"
        />
        <p className="text-sm text-foreground">{message}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex h-9 shrink-0 items-center gap-2 border border-border px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground transition-smooth hover:border-primary hover:text-primary"
      >
        <RefreshCw className="size-3.5" aria-hidden="true" />
        Tentar novamente
      </button>
    </div>
  );
}

export default function ClaPage() {
  const { subscription, plan, isPlanLoading } = useMemberSession();
  const plansQuery = usePlans();
  const levelsQuery = useLevels();
  const progressQuery = useMyProgress();
  const subscribe = useSubscribe();
  const [selectedPlanId, setSelectedPlanId] = useState<bigint | null>(null);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);

  const plans = plansQuery.data ?? [];
  const levels = levelsQuery.data ?? [];
  const progress = progressQuery.data ?? null;
  const isLevelsLoading = levelsQuery.isLoading || progressQuery.isLoading;
  const isLevelsError = levelsQuery.isError || progressQuery.isError;

  const currentPlanId = subscription?.planId ?? null;
  const pendingPlanId = subscription?.pendingPlan ?? null;

  const handleSelectPlan = (target: Plan) => {
    setSubscribeError(null);
    setSelectedPlanId(target.id);
    subscribe.mutate(
      { planId: target.id },
      {
        onSuccess: (result) => {
          setSelectedPlanId(null);
          if (result.__kind__ === "err") {
            setSubscribeError(
              result.err.__kind__ === "subscriptionAlreadyActive"
                ? "Você já possui uma assinatura ativa. Cancele o plano atual antes de trocar."
                : "Não foi possível registrar a assinatura. Tente novamente.",
            );
          }
        },
        onError: () => {
          setSelectedPlanId(null);
          setSubscribeError("Falha de conexão ao registrar a assinatura.");
        },
      },
    );
  };

  return (
    <div className="bg-background">
      {/* Manifesto */}
      <section className="relative overflow-hidden border-b border-border bg-muted/30">
        <div
          className="grid-overlay absolute inset-0 opacity-40"
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-16">
          <p className="label-tactical mb-3">{"// "}Clã Selvência</p>
          <h1 className="max-w-3xl font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-foreground md:text-6xl">
            Você não entra sozinho.{" "}
            <span className="text-primary text-glow-amber">
              Você entra preparado.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            O Clã Selvência reúne pessoas que decidiram parar de improvisar.
            Aqui você encontra protocolos, treinamento e uma comunidade que
            responde quando o cenário aperta. Não é um clube de assinatura — é
            um posto de preparo contínuo.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={scrollToPlans}
              data-ocid="cla.manifesto.plans_link"
              className="inline-flex h-11 items-center justify-center gap-2 border border-primary bg-primary px-6 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Ver planos do Clã
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </button>
            <Link
              to="/central"
              data-ocid="cla.manifesto.central_link"
              className="inline-flex h-11 items-center justify-center border border-border px-6 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-smooth hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Voltar à Central
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl space-y-12 px-4 py-12 sm:px-6 md:py-16">
        {/* Subscription + levels */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <SubscriptionPanel
            subscription={subscription}
            plans={plans}
            plan={plan}
            isPlanLoading={isPlanLoading}
          />

          <div>
            {isLevelsLoading ? (
              <div data-ocid="cla.levels.loading_state">
                <LevelsSkeleton />
              </div>
            ) : isLevelsError ? (
              <ErrorState
                ocid="cla.levels.error_state"
                message="Não foi possível carregar os níveis do Clã."
                onRetry={() => {
                  void levelsQuery.refetch();
                  void progressQuery.refetch();
                }}
              />
            ) : levels.length === 0 ? (
              <div
                data-ocid="cla.levels.empty_state"
                className="border border-border bg-card p-6 text-center"
              >
                <p className="font-display text-lg font-bold uppercase text-foreground">
                  Níveis em configuração
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  A trilha de progressão será publicada em breve.
                </p>
              </div>
            ) : (
              <LevelTrack levels={levels} progress={progress} />
            )}
          </div>
        </div>

        {/* Plans */}
        <section
          id="planos"
          aria-labelledby="plans-heading"
          className="scroll-mt-24"
        >
          <SectionHeading
            code="Planos"
            title="Escolha seu posto"
            description="Cada plano libera um conjunto de módulos do Clã. Você pode mudar de plano a qualquer momento — a troca passa a valer após a confirmação do pagamento."
          />

          {subscribeError && (
            <div
              data-ocid="cla.plans.error_state"
              className="mb-4 flex items-start gap-2 border border-destructive/40 bg-destructive/10 p-3"
            >
              <AlertTriangle
                className="mt-0.5 size-4 shrink-0 text-destructive"
                aria-hidden="true"
              />
              <p className="text-sm text-foreground">{subscribeError}</p>
            </div>
          )}

          {plansQuery.isLoading ? (
            <div data-ocid="cla.plans.loading_state">
              <PlansSkeleton />
            </div>
          ) : plansQuery.isError ? (
            <ErrorState
              ocid="cla.plans.error_state"
              message="Não foi possível carregar os planos do Clã."
              onRetry={() => void plansQuery.refetch()}
            />
          ) : plans.length === 0 ? (
            <div
              data-ocid="cla.plans.empty_state"
              className="border border-border bg-card p-8 text-center"
            >
              <ShieldCheck
                className="mx-auto mb-3 size-8 text-muted-foreground"
                aria-hidden="true"
              />
              <p className="font-display text-lg font-bold uppercase text-foreground">
                Planos indisponíveis
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Os planos do Clã estão sendo atualizados. Volte em instantes.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {plans.map((item) => (
                <PlanCard
                  key={item.id.toString()}
                  plan={item}
                  benefits={PLAN_BENEFITS[item.name.toLowerCase()] ?? []}
                  isCurrent={currentPlanId === item.id}
                  isPending={pendingPlanId === item.id}
                  isBusy={subscribe.isPending && selectedPlanId === item.id}
                  disabled={subscribe.isPending}
                  onSelect={handleSelectPlan}
                  ocid={`cla.plans.card.${item.name.toLowerCase()}`}
                />
              ))}
            </div>
          )}

          {plan && (
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Plano em vigor:{" "}
              <span className="text-primary">{planLabel(plan.name)}</span>
            </p>
          )}
        </section>

        {/* Modules */}
        <section aria-labelledby="modules-heading">
          <SectionHeading
            code="Módulos"
            title="Áreas do Clã"
            description="Os módulos abaixo abrem conforme o seu plano. Cada área foi desenhada para uso em campo, não para leitura passiva."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {CLAN_MODULES.map((module) => {
              const Icon = module.icon;
              return (
                <Link
                  key={module.to}
                  to={module.to}
                  data-ocid={module.ocid}
                  className={cn(
                    "corner-brackets group flex items-start gap-4 border border-border bg-card p-5 shadow-subtle transition-smooth hover:border-primary/70 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  )}
                >
                  <span className="inline-flex size-10 shrink-0 items-center justify-center border border-border text-primary transition-colors group-hover:border-primary/60">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-base font-bold uppercase tracking-tight text-foreground">
                      {module.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {module.description}
                    </p>
                  </div>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>
        </section>

        {subscribe.isPending && (
          <p
            data-ocid="cla.plans.pending_state"
            className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
          >
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
            Registrando assinatura
          </p>
        )}
      </div>
    </div>
  );
}
