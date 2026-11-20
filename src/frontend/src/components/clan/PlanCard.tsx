import type { Plan } from "@/backend";
import { cn } from "@/lib/utils";
import { formatMonthlyPrice, planLabel } from "@/types";
import { Check, Loader2 } from "lucide-react";

type PlanCardProps = {
  plan: Plan;
  /** Benefits unlocked by this plan, shown as a checklist. */
  benefits: readonly string[];
  isCurrent: boolean;
  isPending: boolean;
  isBusy: boolean;
  disabled: boolean;
  onSelect: (plan: Plan) => void;
  ocid: string;
};

export function PlanCard({
  plan,
  benefits,
  isCurrent,
  isPending,
  isBusy,
  disabled,
  onSelect,
  ocid,
}: PlanCardProps) {
  const isFree = plan.priceCents === 0n;
  const highlighted = plan.rank === 2n;

  return (
    <article
      data-ocid={ocid}
      className={cn(
        "corner-brackets relative flex h-full flex-col border bg-card p-5 shadow-subtle transition-smooth sm:p-6",
        highlighted
          ? "border-primary/70 shadow-elevated"
          : "border-border hover:border-primary/50",
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Plano {String(plan.rank).padStart(2, "0")}
          </p>
          <h3 className="mt-1 font-display text-xl font-bold uppercase tracking-tight text-foreground">
            {planLabel(plan.name)}
          </h3>
        </div>
        {isCurrent && (
          <span className="shrink-0 border border-success/40 bg-success/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-success">
            Atual
          </span>
        )}
        {!isCurrent && isPending && (
          <span className="shrink-0 border border-warning/40 bg-warning/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-warning">
            Pendente
          </span>
        )}
      </div>

      <p className="font-display text-2xl font-bold text-foreground">
        {formatMonthlyPrice(plan.priceCents)}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {plan.description}
      </p>

      <ul className="mt-4 flex-1 space-y-2 border-t border-border/70 pt-4">
        {benefits.map((benefit) => (
          <li
            key={benefit}
            className="flex items-start gap-2 text-sm text-muted-foreground"
          >
            <Check
              className="mt-0.5 size-3.5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <span className="min-w-0">{benefit}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        data-ocid={`${ocid}.select_button`}
        onClick={() => onSelect(plan)}
        disabled={disabled || isCurrent || isBusy}
        className={cn(
          "mt-5 inline-flex h-10 w-full items-center justify-center gap-2 border px-4 font-mono text-xs font-semibold uppercase tracking-[0.16em] transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          highlighted
            ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
            : "border-border text-foreground hover:border-primary hover:text-primary",
        )}
      >
        {isBusy ? (
          <>
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
            Processando
          </>
        ) : isCurrent ? (
          "Plano ativo"
        ) : isFree ? (
          "Plano de entrada"
        ) : (
          "Assinar plano"
        )}
      </button>
    </article>
  );
}
