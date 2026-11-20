import type { Member, MemberProgress } from "@/backend";
import { cn } from "@/lib/utils";
import { levelLabel } from "@/types";
import {
  CheckCircle2,
  CircleDashed,
  Mail,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

type MemberStatusPanelProps = {
  profile: Member | null;
  isProfileLoading: boolean;
  arsenalCount: number;
  knowledgeCount: number;
  progress: MemberProgress | null;
  isProgressLoading: boolean;
  isProgressError: boolean;
};

function formatPoints(points: bigint): string {
  return points.toLocaleString("pt-BR");
}

function Readout({
  label,
  value,
  icon,
  tone = "default",
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone?: "default" | "success" | "muted";
}) {
  return (
    <div className="flex items-start gap-3 border border-border bg-background/60 px-3 py-2.5">
      <span
        className={cn(
          "mt-0.5 shrink-0",
          tone === "success" && "text-success",
          tone === "muted" && "text-muted-foreground",
          tone === "default" && "text-primary",
        )}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <p className="truncate font-mono text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function MemberStatusPanel({
  profile,
  isProfileLoading,
  arsenalCount,
  knowledgeCount,
  progress,
  isProgressLoading,
  isProgressError,
}: MemberStatusPanelProps) {
  const code = profile?.code ?? "—";
  const email = profile?.email ?? null;
  const currentLevel = progress?.level ?? null;
  const nextLevel = progress?.nextLevel ?? null;
  const points = progress?.points ?? 0n;
  const pointsToNext = progress?.pointsToNext ?? 0n;

  const span = nextLevel ? nextLevel.pointsRequired - points : 0n;
  const earned = nextLevel ? points - (currentLevel?.pointsRequired ?? 0n) : 0n;
  const percent =
    nextLevel && span > 0n
      ? Math.min(100, Math.max(0, Number((earned * 100n) / span)))
      : nextLevel
        ? 0
        : 100;

  const levelValue = isProgressLoading
    ? "Carregando…"
    : isProgressError
      ? "Indisponível"
      : currentLevel
        ? levelLabel(currentLevel.name)
        : "—";

  const readiness = [
    { label: "Identidade", ready: !!profile },
    { label: "Arsenal", ready: arsenalCount > 0 },
    { label: "Conhecimento", ready: knowledgeCount > 0 },
  ];
  const readyCount = readiness.filter((item) => item.ready).length;

  return (
    <section
      aria-labelledby="status-heading"
      data-ocid="central.status_panel"
      className="corner-brackets border border-border bg-card p-5 shadow-subtle sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-block size-1.5 animate-pulse-dot rounded-full bg-success"
          />
          <h2
            id="status-heading"
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
          >
            Status do membro
          </h2>
        </div>
        <span className="border border-success/40 bg-success/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-success">
          {isProfileLoading ? "Sincronizando" : "Ativo"}
        </span>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        <Readout
          label="Código operacional"
          value={isProfileLoading ? "Carregando…" : code}
          icon={<ShieldCheck className="size-4" />}
        />
        <Readout
          label="E-mail verificado"
          value={email ?? "Não informado"}
          icon={<Mail className="size-4" />}
          tone={email ? "default" : "muted"}
        />
        <Readout
          label="Nível atual"
          value={levelValue}
          icon={<TrendingUp className="size-4" />}
          tone={currentLevel ? "default" : "muted"}
        />
      </div>

      <div className="mt-4 border border-border bg-background/60 p-3">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {isProgressLoading
              ? "Sincronizando progressão"
              : isProgressError
                ? "Progressão indisponível"
                : nextLevel
                  ? `Próximo nível · ${levelLabel(nextLevel.name)}`
                  : currentLevel
                    ? "Nível máximo alcançado"
                    : "Progressão não iniciada"}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
            {isProgressLoading || isProgressError
              ? "—"
              : nextLevel
                ? `${formatPoints(pointsToNext)} pts restantes`
                : `${formatPoints(points)} pts`}
          </p>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-primary/20"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{
              width: `${isProgressLoading || isProgressError ? 0 : percent}%`,
            }}
          />
        </div>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {isProgressLoading
            ? "Aguardando dados do clã"
            : isProgressError
              ? "Não foi possível carregar o progresso"
              : nextLevel
                ? `${percent}% concluído rumo a ${levelLabel(nextLevel.name)}`
                : currentLevel
                  ? "Todos os níveis concluídos"
                  : "Participe do clã para acumular pontos"}
        </p>
      </div>

      <div className="mt-4 border-t border-border/70 pt-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Prontidão operacional
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
            {readyCount}/{readiness.length} módulos
          </p>
        </div>
        <ul className="flex flex-wrap gap-2">
          {readiness.map((item) => (
            <li
              key={item.label}
              className={cn(
                "inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em]",
                item.ready
                  ? "border-success/40 bg-success/10 text-success"
                  : "border-border bg-muted/40 text-muted-foreground",
              )}
            >
              {item.ready ? (
                <CheckCircle2 className="size-3" aria-hidden="true" />
              ) : (
                <CircleDashed className="size-3" aria-hidden="true" />
              )}
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
