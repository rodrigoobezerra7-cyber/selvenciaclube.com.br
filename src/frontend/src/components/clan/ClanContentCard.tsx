import type { SurvivalCard } from "@/backend";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Lock, ShieldCheck } from "lucide-react";
import LockedContentNotice from "./LockedContentNotice";

type ClanContentCardProps = {
  card: SurvivalCard;
  /** 1-based position used for the tactical code and deterministic markers. */
  index: number;
  /** Rank of the member's current plan. */
  currentPlanRank: bigint;
  /** Name of the plan that unlocks this card. */
  requiredPlanName: string;
  isOpen: boolean;
  onOpen: (id: bigint) => void;
};

export default function ClanContentCard({
  card,
  index,
  currentPlanRank,
  requiredPlanName,
  isOpen,
  onOpen,
}: ClanContentCardProps) {
  const unlocked = currentPlanRank >= card.minPlanRank;
  const code = String(index + 1).padStart(2, "0");

  return (
    <article
      data-ocid={`clan.card.${index + 1}`}
      className={cn(
        "group relative flex animate-fade-in flex-col gap-4 border bg-card p-5 shadow-subtle transition-smooth",
        unlocked
          ? "border-border hover:border-primary/70 hover:shadow-elevated"
          : "border-border/70",
      )}
      style={{ animationDelay: `${Math.min(index, 8) * 80}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]",
            unlocked
              ? "border-success/40 bg-success/10 text-success"
              : "border-warning/40 bg-warning/10 text-warning",
          )}
        >
          {unlocked ? (
            <ShieldCheck aria-hidden="true" className="size-3" />
          ) : (
            <Lock aria-hidden="true" className="size-3" />
          )}
          {unlocked ? "Liberado" : "Bloqueado"}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
          FICHA {code}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-foreground">
          {card.title}
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {card.summary}
        </p>
      </div>

      <div className="border-t border-border/70 pt-3">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Plano mínimo
          </span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground">
            {requiredPlanName}
          </span>
        </div>
      </div>

      {unlocked ? (
        <button
          type="button"
          onClick={() => onOpen(card.id)}
          aria-expanded={isOpen}
          data-ocid={`clan.card.${index + 1}.open_button`}
          className="inline-flex h-10 items-center justify-center gap-2 border border-border px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground transition-smooth hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {isOpen ? "Fechar ficha" : "Ler ficha completa"}
          <ArrowUpRight
            aria-hidden="true"
            className={cn("size-3.5 transition-smooth", isOpen && "rotate-90")}
          />
        </button>
      ) : (
        <LockedContentNotice
          compact
          requiredPlanName={requiredPlanName}
          requiredPlanRank={card.minPlanRank}
          currentPlanRank={currentPlanRank}
          ocid={`clan.card.${index + 1}.locked_notice`}
        />
      )}
    </article>
  );
}
