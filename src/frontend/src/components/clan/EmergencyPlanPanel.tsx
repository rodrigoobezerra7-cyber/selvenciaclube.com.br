import { FieldError, FormNotice } from "@/components/auth/AuthShell";
import {
  useCreateEmergencyPlan,
  useMyEmergencyPlans,
} from "@/hooks/useQueries";
import type { EmergencyStep } from "@/types";
import { timestampToDate } from "@/types";
import { ArrowDown, ArrowUp, Plus, Route, Trash2 } from "lucide-react";
import { useState } from "react";

type DraftStep = { key: string; instruction: string };

let stepSeq = 0;
function newStep(instruction = ""): DraftStep {
  stepSeq += 1;
  return { key: `step-${stepSeq}`, instruction };
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function formatCreatedAt(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  return date ? dateFormatter.format(date) : "Data indisponível";
}

function clanErrorMessage(kind: string): string {
  switch (kind) {
    case "notRegistered":
      return "Seu perfil de membro ainda não foi registrado. Conclua o cadastro no Clã para criar planos.";
    case "invalidInput":
      return "Preencha o título e ao menos uma instrução válida.";
    case "notEntitled":
      return "Seu plano atual não permite criar planos de emergência.";
    default:
      return "Não foi possível salvar o plano. Tente novamente.";
  }
}

export default function EmergencyPlanPanel() {
  const plansQuery = useMyEmergencyPlans();
  const createPlan = useCreateEmergencyPlan();

  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState<DraftStep[]>([newStep()]);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const plans = plansQuery.data ?? [];
  const filledSteps = steps.filter(
    (step) => step.instruction.trim().length > 0,
  );

  function updateStep(key: string, instruction: string) {
    setSteps((current) =>
      current.map((step) =>
        step.key === key ? { ...step, instruction } : step,
      ),
    );
  }

  function addStep() {
    setSteps((current) => [...current, newStep()]);
  }

  function removeStep(key: string) {
    setSteps((current) => {
      if (current.length <= 1) return current;
      return current.filter((step) => step.key !== key);
    });
  }

  function moveStep(index: number, direction: -1 | 1) {
    setSteps((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      return next;
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(null);
    const trimmedTitle = title.trim();
    if (trimmedTitle.length === 0) {
      setFormError("Dê um nome ao plano de emergência.");
      return;
    }
    if (filledSteps.length === 0) {
      setFormError("Adicione ao menos uma instrução ao plano.");
      return;
    }
    setFormError(null);

    const payload: EmergencyStep[] = filledSteps.map((step, index) => ({
      order: BigInt(index + 1),
      instruction: step.instruction.trim(),
    }));

    const capturedTitle = trimmedTitle;
    setTitle("");
    setSteps([newStep()]);

    createPlan.mutate(
      { title: capturedTitle, steps: payload },
      {
        onSuccess: (result) => {
          if (result.__kind__ === "ok") {
            setSuccess(`Plano "${result.ok.title}" registrado com sucesso.`);
          } else {
            setFormError(clanErrorMessage(result.err.__kind__));
            setTitle((current) => (current === "" ? capturedTitle : current));
          }
        },
        onError: () => {
          setFormError("Falha de conexão ao salvar o plano. Tente novamente.");
          setTitle((current) => (current === "" ? capturedTitle : current));
        },
      },
    );
  }

  return (
    <section
      data-ocid="emergency_plan.section"
      aria-labelledby="emergency-plan-heading"
      className="border border-border bg-card"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-9 items-center justify-center border border-primary/40 text-primary">
            <Route className="size-4" />
          </span>
          <div>
            <h2
              id="emergency-plan-heading"
              className="font-display text-lg font-bold uppercase tracking-tight text-foreground"
            >
              Planos de emergência
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Protocolos ordenados · {plans.length.toString().padStart(2, "0")}{" "}
              registrados
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <form
          onSubmit={handleSubmit}
          noValidate
          data-ocid="emergency_plan.form"
          className="flex flex-col gap-4"
        >
          <div>
            <label
              htmlFor="plan-title"
              className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
            >
              Título do plano
            </label>
            <input
              id="plan-title"
              data-ocid="emergency_plan.title_input"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ex.: Evacuação em caso de incêndio"
              maxLength={120}
              aria-invalid={formError ? true : undefined}
              className="w-full border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-smooth placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
            />
          </div>

          <fieldset className="min-w-0">
            <legend className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Passos do protocolo
            </legend>
            <ol className="flex flex-col gap-2">
              {steps.map((step, index) => (
                <li key={step.key} className="flex items-start gap-2">
                  <span className="mt-2 inline-flex size-6 shrink-0 items-center justify-center border border-border font-mono text-[11px] text-primary">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <input
                    data-ocid={`emergency_plan.step_input.${index + 1}`}
                    value={step.instruction}
                    onChange={(event) =>
                      updateStep(step.key, event.target.value)
                    }
                    placeholder="Descreva a instrução"
                    maxLength={200}
                    aria-label={`Instrução do passo ${index + 1}`}
                    className="min-w-0 flex-1 border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-smooth placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                  />
                  <div className="flex shrink-0 items-center">
                    <button
                      type="button"
                      onClick={() => moveStep(index, -1)}
                      disabled={index === 0}
                      aria-label={`Mover passo ${index + 1} para cima`}
                      className="inline-flex size-8 items-center justify-center text-muted-foreground transition-smooth hover:text-primary disabled:opacity-30"
                    >
                      <ArrowUp className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveStep(index, 1)}
                      disabled={index === steps.length - 1}
                      aria-label={`Mover passo ${index + 1} para baixo`}
                      className="inline-flex size-8 items-center justify-center text-muted-foreground transition-smooth hover:text-primary disabled:opacity-30"
                    >
                      <ArrowDown className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeStep(step.key)}
                      disabled={steps.length <= 1}
                      aria-label={`Remover passo ${index + 1}`}
                      className="inline-flex size-8 items-center justify-center text-muted-foreground transition-smooth hover:text-destructive disabled:opacity-30"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ol>
            <button
              type="button"
              onClick={addStep}
              data-ocid="emergency_plan.add_step_button"
              className="mt-3 inline-flex items-center gap-1.5 border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-smooth hover:border-primary hover:text-primary"
            >
              <Plus className="size-3.5" />
              Adicionar passo
            </button>
          </fieldset>

          <FieldError
            id="emergency_plan.form_error"
            message={formError ?? undefined}
          />
          {success ? (
            <FormNotice tone="success" ocid="emergency_plan.success_state">
              {success}
            </FormNotice>
          ) : null}

          <button
            type="submit"
            data-ocid="emergency_plan.submit_button"
            disabled={createPlan.isPending}
            className="inline-flex items-center justify-center gap-2 border border-primary bg-primary px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90 disabled:opacity-60"
          >
            {createPlan.isPending ? "Registrando…" : "Registrar plano"}
          </button>
        </form>

        <div className="min-w-0">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Seus planos
          </p>
          {plansQuery.isLoading ? (
            <div
              data-ocid="emergency_plan.loading_state"
              className="flex flex-col gap-2"
            >
              {Array.from({ length: 2 }, (_, i) => `plan-skeleton-${i}`).map(
                (id) => (
                  <div
                    key={id}
                    className="h-20 animate-pulse border border-border bg-muted/40"
                  />
                ),
              )}
            </div>
          ) : plansQuery.isError ? (
            <div
              data-ocid="emergency_plan.error_state"
              className="border border-destructive/50 bg-destructive/10 px-4 py-3"
            >
              <p className="font-mono text-[11px] text-destructive">
                Não foi possível carregar seus planos.
              </p>
              <button
                type="button"
                onClick={() => void plansQuery.refetch()}
                data-ocid="emergency_plan.retry_button"
                className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-destructive underline underline-offset-4"
              >
                Tentar novamente
              </button>
            </div>
          ) : plans.length === 0 ? (
            <div
              data-ocid="emergency_plan.empty_state"
              className="border border-dashed border-border px-4 py-8 text-center"
            >
              <p className="font-display text-sm font-semibold uppercase tracking-tight text-foreground">
                Nenhum plano registrado
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Monte seu primeiro protocolo de emergência ao lado. Passos
                ordenados mantêm o clã alinhado sob pressão.
              </p>
            </div>
          ) : (
            <ul data-ocid="emergency_plan.list" className="flex flex-col gap-3">
              {plans.map((plan, index) => (
                <li
                  key={plan.id.toString()}
                  data-ocid={`emergency_plan.item.${index + 1}`}
                  className="corner-brackets border border-border bg-background p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="min-w-0 font-display text-sm font-bold uppercase tracking-tight text-foreground">
                      {plan.title}
                    </h3>
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      {formatCreatedAt(plan.createdAt)}
                    </span>
                  </div>
                  <ol className="mt-3 flex flex-col gap-1.5">
                    {plan.steps.map((step) => (
                      <li
                        key={step.order.toString()}
                        className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"
                      >
                        <span className="mt-0.5 shrink-0 font-mono text-[10px] text-primary">
                          {step.order.toString().padStart(2, "0")}
                        </span>
                        <span className="min-w-0 break-words">
                          {step.instruction}
                        </span>
                      </li>
                    ))}
                  </ol>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
