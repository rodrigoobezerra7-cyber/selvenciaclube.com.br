import EmergencyPlanPanel from "@/components/clan/EmergencyPlanPanel";
import KitPanel from "@/components/clan/KitPanel";
import { useMemberSession } from "@/hooks/useMemberSession";
import { formatMonthlyPrice, planLabel } from "@/types";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, Lock } from "lucide-react";

const GUARDIAO_RANK = 2n;

export default function ClaKitsPage() {
  const { plan, planRank } = useMemberSession();
  const hasAccess = planRank >= GUARDIAO_RANK;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-16">
      <Link
        to="/cla"
        data-ocid="kits.back_link"
        className="mb-8 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-smooth hover:text-primary"
      >
        <ChevronLeft className="size-3.5" />
        Clã Selvência
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label-tactical mb-3">{"// "}Clã Selvência · Kits</p>
          <h1 className="font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-foreground md:text-5xl">
            Planejamento de{" "}
            <span className="text-primary text-glow-amber">Emergência</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Protocolos ordenados e inventário de campo do clã. Registre seus
            planos de emergência e organize os kits para estar pronto quando a
            situação exigir.
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-px border border-border bg-border">
          <div className="bg-card px-4 py-3">
            <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Plano atual
            </dt>
            <dd className="mt-1 font-mono text-xs text-foreground">
              {plan ? planLabel(plan.name) : "Visitante"}
            </dd>
          </div>
          <div className="bg-card px-4 py-3">
            <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Acesso
            </dt>
            <dd className="mt-1 flex items-center gap-1.5 font-mono text-xs text-foreground">
              <span
                aria-hidden="true"
                className={`inline-block size-1.5 rounded-full ${
                  hasAccess ? "bg-success" : "bg-warning"
                }`}
              />
              {hasAccess ? "Liberado" : "Restrito"}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-10">
        {hasAccess ? (
          <div className="flex flex-col gap-6">
            <EmergencyPlanPanel />
            <KitPanel />
          </div>
        ) : (
          <div
            data-ocid="kits.plan_denied_state"
            className="corner-brackets mx-auto flex max-w-xl flex-col items-center border border-border bg-card px-6 py-12 text-center"
          >
            <span className="mb-5 inline-flex size-14 items-center justify-center border border-primary/50 text-primary">
              <Lock className="size-6" />
            </span>
            <p className="label-tactical mb-2">Nível de acesso insuficiente</p>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
              Requer plano Guardião
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              O planejamento de emergência e a organização de kits exigem o
              plano{" "}
              <span className="font-semibold text-foreground">
                {planLabel("guardião")}
              </span>{" "}
              ou superior. Seu plano atual:{" "}
              <span className="font-semibold text-foreground">
                {plan
                  ? `${planLabel(plan.name)} · ${formatMonthlyPrice(plan.priceCents)}`
                  : "Visitante"}
              </span>
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/cla"
                data-ocid="kits.plan_upgrade_link"
                className="border border-primary bg-primary px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90"
              >
                Assinar o Guardião
              </Link>
              <Link
                to="/central"
                data-ocid="kits.plan_back_link"
                className="border border-border px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-smooth hover:border-primary hover:text-primary"
              >
                Voltar à Central
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
