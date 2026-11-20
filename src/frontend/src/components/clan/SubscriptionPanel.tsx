import type { MembershipError, Plan, Subscription } from "@/backend";
import {
  useCancelSubscription,
  useConfirmSubscriptionPayment,
  useSubscribe,
} from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import {
  SUBSCRIPTION_STATUS_LABEL,
  formatMonthlyPrice,
  planLabel,
  timestampToDate,
} from "@/types";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useState } from "react";

type SubscriptionPanelProps = {
  subscription: Subscription | null;
  plans: Plan[];
  plan: Plan | null;
  isPlanLoading: boolean;
};

type Feedback = { tone: "success" | "error"; message: string };

function scrollToPlans() {
  document
    .getElementById("planos")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const DATE_FORMAT = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

function formatDate(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  return date ? DATE_FORMAT.format(date) : "Data indisponível";
}

function membershipErrorMessage(error: MembershipError): string {
  switch (error.__kind__) {
    case "planNotFound":
      return "Plano não encontrado. Atualize a página e tente novamente.";
    case "paymentNotConfirmed":
      return "O pagamento ainda não foi confirmado.";
    case "invalidInput":
      return "Dados inválidos. Revise as informações e tente novamente.";
    case "subscriptionAlreadyActive":
      return "Você já possui uma assinatura ativa.";
    case "notEntitled":
      return "Seu plano atual não permite esta operação.";
    default:
      return "Não foi possível concluir a operação.";
  }
}

function StatusChip({ status }: { status: Subscription["status"] }) {
  const tone =
    status === "active"
      ? "border-success/40 bg-success/10 text-success"
      : status === "pending"
        ? "border-warning/40 bg-warning/10 text-warning"
        : "border-destructive/40 bg-destructive/10 text-destructive";
  return (
    <span
      data-ocid="cla.subscription.status"
      className={cn(
        "inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em]",
        tone,
      )}
    >
      {status === "active" ? (
        <CheckCircle2 className="size-3" aria-hidden="true" />
      ) : status === "pending" ? (
        <AlertTriangle className="size-3" aria-hidden="true" />
      ) : (
        <XCircle className="size-3" aria-hidden="true" />
      )}
      {SUBSCRIPTION_STATUS_LABEL[status] ?? status}
    </span>
  );
}

function Readout({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 border border-border bg-background/60 px-3 py-2.5">
      <span className="mt-0.5 shrink-0 text-primary">{icon}</span>
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <p className="truncate font-mono text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function SubscriptionPanel({
  subscription,
  plans,
  plan,
  isPlanLoading,
}: SubscriptionPanelProps) {
  const subscribe = useSubscribe();
  const confirmPayment = useConfirmSubscriptionPayment();
  const cancel = useCancelSubscription();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const status = subscription?.status ?? null;
  const isBusy =
    subscribe.isPending || confirmPayment.isPending || cancel.isPending;

  const currentPlan = plan;
  const pendingPlan =
    subscription?.pendingPlan != null
      ? (plans.find((p) => p.id === subscription.pendingPlan) ?? null)
      : null;

  const handleConfirm = () => {
    setFeedback(null);
    confirmPayment.mutate(undefined, {
      onSuccess: (result) => {
        if (result.__kind__ === "ok") {
          setFeedback({
            tone: "success",
            message: "Pagamento confirmado. Sua assinatura está ativa.",
          });
        } else {
          setFeedback({
            tone: "error",
            message: membershipErrorMessage(result.err),
          });
        }
      },
      onError: () => {
        setFeedback({
          tone: "error",
          message: "Falha de conexão ao confirmar o pagamento.",
        });
      },
    });
  };

  const handleCancel = () => {
    setFeedback(null);
    cancel.mutate(undefined, {
      onSuccess: (result) => {
        setConfirmingCancel(false);
        if (result.__kind__ === "ok") {
          setFeedback({
            tone: "success",
            message:
              "Assinatura cancelada. Você mantém o acesso até o fim do período.",
          });
        } else {
          setFeedback({
            tone: "error",
            message: membershipErrorMessage(result.err),
          });
        }
      },
      onError: () => {
        setFeedback({
          tone: "error",
          message: "Falha de conexão ao cancelar a assinatura.",
        });
      },
    });
  };

  return (
    <section
      aria-labelledby="subscription-heading"
      data-ocid="cla.subscription.panel"
      className="corner-brackets border border-border bg-card p-5 shadow-subtle sm:p-6"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
          <h2
            id="subscription-heading"
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
          >
            Sua assinatura
          </h2>
        </div>
        {status ? (
          <StatusChip status={status} />
        ) : (
          <span className="border border-border bg-muted/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Sem assinatura
          </span>
        )}
      </div>

      {isPlanLoading ? (
        <div
          data-ocid="cla.subscription.loading_state"
          className="flex items-center gap-3 border border-border bg-background/60 px-3 py-4"
        >
          <Loader2
            className="size-4 animate-spin text-primary"
            aria-hidden="true"
          />
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Sincronizando assinatura
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Readout
              label="Plano atual"
              value={
                currentPlan
                  ? `${planLabel(currentPlan.name)} · ${formatMonthlyPrice(currentPlan.priceCents)}`
                  : "Visitante · Gratuito"
              }
              icon={<ShieldCheck className="size-4" />}
            />
            <Readout
              label={
                status === "cancelled" ? "Acesso até" : "Próxima renovação"
              }
              value={subscription ? formatDate(subscription.renewsAt) : "—"}
              icon={<CalendarClock className="size-4" />}
            />
          </div>

          {pendingPlan && (
            <p className="mt-3 border border-warning/40 bg-warning/10 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-warning">
              Mudança para {planLabel(pendingPlan.name)} aguardando pagamento
            </p>
          )}

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {status === "pending" && (
              <button
                type="button"
                data-ocid="cla.subscription.confirm_button"
                onClick={handleConfirm}
                disabled={isBusy}
                className="inline-flex h-10 items-center justify-center gap-2 border border-primary bg-primary px-5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                {confirmPayment.isPending ? (
                  <Loader2
                    className="size-3.5 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <CreditCard className="size-3.5" aria-hidden="true" />
                )}
                Confirmar pagamento
              </button>
            )}

            {status === "active" && (
              <button
                type="button"
                onClick={scrollToPlans}
                data-ocid="cla.subscription.change_plan_link"
                className="inline-flex h-10 items-center justify-center gap-2 border border-border px-5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-smooth hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Mudar de plano
              </button>
            )}

            {status !== null && status !== "cancelled" && (
              <button
                type="button"
                data-ocid="cla.subscription.cancel_button"
                onClick={() => setConfirmingCancel(true)}
                disabled={isBusy || confirmingCancel}
                className="inline-flex h-10 items-center justify-center gap-2 border border-border px-5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-smooth hover:border-destructive hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar assinatura
              </button>
            )}

            {status === null && (
              <button
                type="button"
                onClick={scrollToPlans}
                data-ocid="cla.subscription.subscribe_link"
                className="inline-flex h-10 items-center justify-center gap-2 border border-primary bg-primary px-5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Escolher um plano
              </button>
            )}
          </div>

          {confirmingCancel && (
            <div
              data-ocid="cla.subscription.cancel_confirm"
              className="mt-3 border border-destructive/40 bg-destructive/10 p-3"
            >
              <p className="text-sm text-foreground">
                Confirmar o cancelamento da assinatura? O acesso permanece até a
                data de renovação.
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  data-ocid="cla.subscription.cancel_confirm_button"
                  onClick={handleCancel}
                  disabled={isBusy}
                  className="inline-flex h-9 items-center justify-center gap-2 border border-destructive bg-destructive px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-destructive-foreground transition-smooth hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cancel.isPending && (
                    <Loader2
                      className="size-3.5 animate-spin"
                      aria-hidden="true"
                    />
                  )}
                  Confirmar cancelamento
                </button>
                <button
                  type="button"
                  data-ocid="cla.subscription.cancel_dismiss_button"
                  onClick={() => setConfirmingCancel(false)}
                  disabled={isBusy}
                  className="inline-flex h-9 items-center justify-center border border-border px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-smooth hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Manter assinatura
                </button>
              </div>
            </div>
          )}

          {feedback && (
            <output
              data-ocid={
                feedback.tone === "success"
                  ? "cla.subscription.success_state"
                  : "cla.subscription.error_state"
              }
              className={cn(
                "mt-3 block border px-3 py-2 text-sm",
                feedback.tone === "success"
                  ? "border-success/40 bg-success/10 text-success"
                  : "border-destructive/40 bg-destructive/10 text-destructive",
              )}
            >
              {feedback.message}
            </output>
          )}
        </>
      )}
    </section>
  );
}
