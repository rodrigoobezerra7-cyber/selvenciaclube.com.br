import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Lock } from "lucide-react";

type LockedContentNoticeProps = {
  /** Human-readable name of the plan that unlocks this content. */
  requiredPlanName: string;
  /** Rank of the plan that unlocks this content. */
  requiredPlanRank: bigint;
  /** Rank of the member's current plan. */
  currentPlanRank: bigint;
  /** Compact variant used inside a content card. */
  compact?: boolean;
  ocid: string;
};

export default function LockedContentNotice({
  requiredPlanName,
  requiredPlanRank,
  currentPlanRank,
  compact = false,
  ocid,
}: LockedContentNoticeProps) {
  if (compact) {
    return (
      <div
        data-ocid={ocid}
        className="flex flex-col gap-3 border border-warning/40 bg-warning/5 p-4"
      >
        <div className="flex items-start gap-2.5">
          <Lock
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-warning"
          />
          <div className="min-w-0 space-y-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-warning">
              Conteúdo bloqueado
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Disponível a partir do plano{" "}
              <span className="font-semibold text-foreground">
                {requiredPlanName}
              </span>
              . Seu plano atual é{" "}
              <span className="font-semibold text-foreground">
                nível {String(currentPlanRank)}
              </span>
              .
            </p>
          </div>
        </div>
        <Link
          to="/cla"
          data-ocid={`${ocid}.upgrade_link`}
          className="inline-flex h-9 items-center justify-center gap-1.5 border border-primary bg-primary px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Assinar ou mudar de plano
          <ArrowUpRight aria-hidden="true" className="size-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div
      data-ocid={ocid}
      className="corner-brackets flex flex-col gap-5 border border-warning/40 bg-card p-6 shadow-subtle sm:p-8"
    >
      <div className="flex items-start gap-4">
        <span className="inline-flex size-12 shrink-0 items-center justify-center border border-warning/50 text-warning">
          <Lock aria-hidden="true" className="size-5" />
        </span>
        <div className="min-w-0 space-y-1.5">
          <p className="label-tactical">Acesso restrito</p>
          <h2 className="font-display text-xl font-bold uppercase tracking-tight text-foreground">
            Ficha bloqueada para o seu plano
          </h2>
          <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
            Esta ficha da biblioteca de sobrevivência exige o plano{" "}
            <span className="font-semibold text-foreground">
              {requiredPlanName}
            </span>{" "}
            (nível {String(requiredPlanRank)}). Seu plano atual é nível{" "}
            {String(currentPlanRank)}.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Link
          to="/cla"
          data-ocid={`${ocid}.upgrade_link`}
          className="inline-flex h-10 items-center justify-center gap-2 border border-primary bg-primary px-5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Assinar ou mudar de plano
          <ArrowUpRight aria-hidden="true" className="size-3.5" />
        </Link>
        <Link
          to="/cla/biblioteca"
          data-ocid={`${ocid}.back_link`}
          className="inline-flex h-10 items-center justify-center border border-border px-5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-smooth hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Voltar à biblioteca
        </Link>
      </div>
    </div>
  );
}
