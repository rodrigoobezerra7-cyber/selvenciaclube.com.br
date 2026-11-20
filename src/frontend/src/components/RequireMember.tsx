import { useMemberSession } from "@/hooks/useMemberSession";
import { formatMonthlyPrice, planLabel } from "@/types";
import { Link } from "@tanstack/react-router";
import { Lock, ShieldAlert } from "lucide-react";

type RequireMemberProps = {
  children: React.ReactNode;
  /** Minimum plan rank required to view the children. */
  requiredPlanRank?: bigint;
};

export default function RequireMember({
  children,
  requiredPlanRank,
}: RequireMemberProps) {
  const { isAuthenticated, isInitializing, isPlanLoading, plan, planRank } =
    useMemberSession();

  if (isInitializing) {
    return (
      <div
        data-ocid="session.loading_state"
        className="flex min-h-[60vh] items-center justify-center"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Estabelecendo conexão
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        data-ocid="session.denied_state"
        className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center px-4 text-center"
      >
        <span className="mb-5 inline-flex size-14 items-center justify-center border border-primary/50 text-primary">
          <ShieldAlert className="size-6" />
        </span>
        <p className="label-tactical mb-2">Acesso restrito</p>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight">
          Identifique-se para continuar
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Esta área é reservada aos membros da comunidade Selvência. Entre com
          sua identidade para acessar a Central de Operações.
        </p>
        <Link
          to="/acesso"
          data-ocid="session.signin_link"
          className="mt-6 border border-primary bg-primary px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90"
        >
          Acessar como membro
        </Link>
      </div>
    );
  }

  if (requiredPlanRank !== undefined) {
    if (isPlanLoading) {
      return (
        <div
          data-ocid="session.plan_loading_state"
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

    if (planRank < requiredPlanRank) {
      return (
        <div
          data-ocid="session.plan_denied_state"
          className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center px-4 text-center"
        >
          <span className="mb-5 inline-flex size-14 items-center justify-center border border-primary/50 text-primary">
            <Lock className="size-6" />
          </span>
          <p className="label-tactical mb-2">Nível de acesso insuficiente</p>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight">
            Requer plano superior
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Este conteúdo exige o plano{" "}
            <span className="font-semibold text-foreground">
              {planLabel("guardião")}
            </span>{" "}
            ou superior. Seu plano atual:{" "}
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
              data-ocid="session.plan_upgrade_link"
              className="border border-primary bg-primary px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90"
            >
              Conhecer o Clã Selvência
            </Link>
            <Link
              to="/central"
              data-ocid="session.plan_back_link"
              className="border border-border px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-smooth hover:border-primary hover:text-primary"
            >
              Voltar à Central
            </Link>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
