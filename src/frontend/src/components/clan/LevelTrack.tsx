import type { MemberLevel, MemberProgress } from "@/backend";
import { cn } from "@/lib/utils";
import { levelLabel } from "@/types";
import { Check, Lock } from "lucide-react";

type LevelTrackProps = {
  levels: MemberLevel[];
  progress: MemberProgress | null;
};

function formatPoints(points: bigint): string {
  return points.toLocaleString("pt-BR");
}

export function LevelTrack({ levels, progress }: LevelTrackProps) {
  const currentOrdinal = progress?.level.ordinal ?? -1n;
  const nextLevel = progress?.nextLevel ?? null;
  const points = progress?.points ?? 0n;
  const pointsToNext = progress?.pointsToNext ?? 0n;

  const span = nextLevel ? nextLevel.pointsRequired - points : 0n;
  const earned = nextLevel
    ? points - (progress?.level.pointsRequired ?? 0n)
    : 0n;
  const percent =
    nextLevel && span > 0n
      ? Math.min(100, Math.max(0, Number((earned * 100n) / span)))
      : 100;

  return (
    <section
      aria-labelledby="levels-heading"
      data-ocid="cla.levels.section"
      className="border border-border bg-card p-5 shadow-subtle sm:p-6"
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label-tactical mb-1">Progressão</p>
          <h2
            id="levels-heading"
            className="font-display text-2xl font-bold uppercase tracking-tight text-foreground"
          >
            Níveis do Clã
          </h2>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          {formatPoints(points)} pts acumulados
        </p>
      </div>

      <div className="mb-6 border border-border bg-background/60 p-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {nextLevel
              ? `Próximo nível · ${levelLabel(nextLevel.name)}`
              : "Nível máximo alcançado"}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
            {nextLevel
              ? `${formatPoints(pointsToNext)} pts restantes`
              : "Sentinela"}
          </p>
        </div>
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-primary/20"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {nextLevel
            ? `${percent}% concluído rumo a ${levelLabel(nextLevel.name)}`
            : "Todos os níveis concluídos"}
        </p>
      </div>

      <ol className="space-y-3">
        {levels.map((level) => {
          const reached = level.ordinal <= currentOrdinal;
          const isCurrent = level.ordinal === currentOrdinal;
          return (
            <li
              key={level.ordinal.toString()}
              data-ocid={`cla.levels.item.${level.ordinal}`}
              className={cn(
                "flex items-start gap-3 border p-3 transition-smooth",
                isCurrent
                  ? "border-primary/70 bg-primary/5"
                  : reached
                    ? "border-success/30 bg-success/5"
                    : "border-border bg-background/40",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 inline-flex size-7 shrink-0 items-center justify-center border font-mono text-[11px]",
                  isCurrent
                    ? "border-primary text-primary"
                    : reached
                      ? "border-success/50 text-success"
                      : "border-border text-muted-foreground",
                )}
              >
                {reached ? (
                  <Check className="size-3.5" aria-hidden="true" />
                ) : (
                  <Lock className="size-3" aria-hidden="true" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-sm font-bold uppercase tracking-wide text-foreground">
                    {levelLabel(level.name)}
                  </p>
                  {isCurrent && (
                    <span className="border border-primary/40 bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
                      Você está aqui
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {level.description}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/80">
                  Requer {formatPoints(level.pointsRequired)} pts
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
