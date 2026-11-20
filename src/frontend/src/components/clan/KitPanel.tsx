import { FieldError, FormNotice } from "@/components/auth/AuthShell";
import { useCreateKit, useMyKits } from "@/hooks/useQueries";
import type { KitItem } from "@/types";
import { KIT_READINESS_LABEL } from "@/types";
import { Backpack, Check, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

type DraftItem = {
  key: string;
  name: string;
  quantity: string;
  ready: boolean;
};

let itemSeq = 0;
function newItem(): DraftItem {
  itemSeq += 1;
  return { key: `item-${itemSeq}`, name: "", quantity: "1", ready: false };
}

const READINESS_STYLE: Record<string, string> = {
  pronto: "border-success/50 bg-success/10 text-success",
  incompleto: "border-warning/50 bg-warning/10 text-warning",
  critico: "border-destructive/50 bg-destructive/10 text-destructive",
};

function clanErrorMessage(kind: string): string {
  switch (kind) {
    case "notRegistered":
      return "Seu perfil de membro ainda não foi registrado. Conclua o cadastro no Clã para criar kits.";
    case "invalidInput":
      return "Dê um nome ao kit e inclua ao menos um item válido.";
    case "notEntitled":
      return "Seu plano atual não permite criar kits.";
    default:
      return "Não foi possível salvar o kit. Tente novamente.";
  }
}

export default function KitPanel() {
  const kitsQuery = useMyKits();
  const createKit = useCreateKit();

  const [name, setName] = useState("");
  const [items, setItems] = useState<DraftItem[]>([newItem()]);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const kits = kitsQuery.data ?? [];
  const filledItems = items.filter((item) => item.name.trim().length > 0);

  function updateItem(key: string, patch: Partial<DraftItem>) {
    setItems((current) =>
      current.map((item) => (item.key === key ? { ...item, ...patch } : item)),
    );
  }

  function addItem() {
    setItems((current) => [...current, newItem()]);
  }

  function removeItem(key: string) {
    setItems((current) => {
      if (current.length <= 1) return current;
      return current.filter((item) => item.key !== key);
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(null);
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      setFormError("Dê um nome ao kit.");
      return;
    }
    if (filledItems.length === 0) {
      setFormError("Inclua ao menos um item no kit.");
      return;
    }
    const invalidQuantity = filledItems.some((item) => {
      const parsed = Number.parseInt(item.quantity, 10);
      return !Number.isFinite(parsed) || parsed < 1;
    });
    if (invalidQuantity) {
      setFormError("Cada item precisa de uma quantidade de pelo menos 1.");
      return;
    }
    setFormError(null);

    const payload: KitItem[] = filledItems.map((item) => ({
      name: item.name.trim(),
      quantity: BigInt(Number.parseInt(item.quantity, 10)),
      ready: item.ready,
    }));

    const capturedName = trimmedName;
    setName("");
    setItems([newItem()]);

    createKit.mutate(
      { name: capturedName, items: payload },
      {
        onSuccess: (result) => {
          if (result.__kind__ === "ok") {
            setSuccess(`Kit "${result.ok.name}" registrado com sucesso.`);
          } else {
            setFormError(clanErrorMessage(result.err.__kind__));
            setName((current) => (current === "" ? capturedName : current));
          }
        },
        onError: () => {
          setFormError("Falha de conexão ao salvar o kit. Tente novamente.");
          setName((current) => (current === "" ? capturedName : current));
        },
      },
    );
  }

  return (
    <section
      data-ocid="kit.section"
      aria-labelledby="kit-heading"
      className="border border-border bg-card"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-9 items-center justify-center border border-primary/40 text-primary">
            <Backpack className="size-4" />
          </span>
          <div>
            <h2
              id="kit-heading"
              className="font-display text-lg font-bold uppercase tracking-tight text-foreground"
            >
              Organização de kits
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Inventário de campo · {kits.length.toString().padStart(2, "0")}{" "}
              registrados
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <form
          onSubmit={handleSubmit}
          noValidate
          data-ocid="kit.form"
          className="flex flex-col gap-4"
        >
          <div>
            <label
              htmlFor="kit-name"
              className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
            >
              Nome do kit
            </label>
            <input
              id="kit-name"
              data-ocid="kit.name_input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex.: Kit de evacuação veicular"
              maxLength={120}
              aria-invalid={formError ? true : undefined}
              className="w-full border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-smooth placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
            />
          </div>

          <fieldset className="min-w-0">
            <legend className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Itens do kit
            </legend>
            <ul className="flex flex-col gap-2">
              {items.map((item, index) => (
                <li key={item.key} className="flex items-start gap-2">
                  <input
                    data-ocid={`kit.item_name_input.${index + 1}`}
                    value={item.name}
                    onChange={(event) =>
                      updateItem(item.key, { name: event.target.value })
                    }
                    placeholder="Item"
                    maxLength={120}
                    aria-label={`Nome do item ${index + 1}`}
                    className="min-w-0 flex-1 border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-smooth placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                  />
                  <input
                    data-ocid={`kit.item_quantity_input.${index + 1}`}
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={item.quantity}
                    onChange={(event) =>
                      updateItem(item.key, { quantity: event.target.value })
                    }
                    aria-label={`Quantidade do item ${index + 1}`}
                    className="w-16 shrink-0 border border-input bg-background px-2 py-2 text-center font-mono text-sm text-foreground outline-none transition-smooth focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                  />
                  <button
                    type="button"
                    onClick={() => updateItem(item.key, { ready: !item.ready })}
                    aria-pressed={item.ready}
                    aria-label={`Marcar item ${index + 1} como pronto`}
                    data-ocid={`kit.item_ready_toggle.${index + 1}`}
                    className={`inline-flex size-9 shrink-0 items-center justify-center border transition-smooth ${
                      item.ready
                        ? "border-success/60 bg-success/15 text-success"
                        : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                    }`}
                  >
                    <Check className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.key)}
                    disabled={items.length <= 1}
                    aria-label={`Remover item ${index + 1}`}
                    className="inline-flex size-9 shrink-0 items-center justify-center text-muted-foreground transition-smooth hover:text-destructive disabled:opacity-30"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={addItem}
              data-ocid="kit.add_item_button"
              className="mt-3 inline-flex items-center gap-1.5 border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-smooth hover:border-primary hover:text-primary"
            >
              <Plus className="size-3.5" />
              Adicionar item
            </button>
          </fieldset>

          <FieldError id="kit.form_error" message={formError ?? undefined} />
          {success ? (
            <FormNotice tone="success" ocid="kit.success_state">
              {success}
            </FormNotice>
          ) : null}

          <button
            type="submit"
            data-ocid="kit.submit_button"
            disabled={createKit.isPending}
            className="inline-flex items-center justify-center gap-2 border border-primary bg-primary px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90 disabled:opacity-60"
          >
            {createKit.isPending ? "Registrando…" : "Registrar kit"}
          </button>
        </form>

        <div className="min-w-0">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Seus kits
          </p>
          {kitsQuery.isLoading ? (
            <div data-ocid="kit.loading_state" className="flex flex-col gap-2">
              {Array.from({ length: 2 }, (_, i) => `kit-skeleton-${i}`).map(
                (id) => (
                  <div
                    key={id}
                    className="h-24 animate-pulse border border-border bg-muted/40"
                  />
                ),
              )}
            </div>
          ) : kitsQuery.isError ? (
            <div
              data-ocid="kit.error_state"
              className="border border-destructive/50 bg-destructive/10 px-4 py-3"
            >
              <p className="font-mono text-[11px] text-destructive">
                Não foi possível carregar seus kits.
              </p>
              <button
                type="button"
                onClick={() => void kitsQuery.refetch()}
                data-ocid="kit.retry_button"
                className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-destructive underline underline-offset-4"
              >
                Tentar novamente
              </button>
            </div>
          ) : kits.length === 0 ? (
            <div
              data-ocid="kit.empty_state"
              className="border border-dashed border-border px-4 py-8 text-center"
            >
              <p className="font-display text-sm font-semibold uppercase tracking-tight text-foreground">
                Nenhum kit registrado
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Registre seu primeiro kit ao lado. A prontidão é calculada a
                partir dos itens marcados como prontos.
              </p>
            </div>
          ) : (
            <ul data-ocid="kit.list" className="flex flex-col gap-3">
              {kits.map((kit, index) => {
                const readyCount = kit.items.filter(
                  (item) => item.ready,
                ).length;
                return (
                  <li
                    key={kit.id.toString()}
                    data-ocid={`kit.item.${index + 1}`}
                    className="corner-brackets border border-border bg-background p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="min-w-0 font-display text-sm font-bold uppercase tracking-tight text-foreground">
                        {kit.name}
                      </h3>
                      <span
                        data-ocid={`kit.readiness_badge.${index + 1}`}
                        className={`shrink-0 border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
                          READINESS_STYLE[kit.readiness] ??
                          READINESS_STYLE.critico
                        }`}
                      >
                        {KIT_READINESS_LABEL[kit.readiness] ?? kit.readiness}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      {readyCount}/{kit.items.length} itens prontos
                    </p>
                    <ul className="mt-3 flex flex-col gap-1.5">
                      {kit.items.map((item) => (
                        <li
                          key={item.name}
                          className="flex items-center justify-between gap-3 text-xs leading-relaxed"
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <span
                              aria-hidden="true"
                              className={`inline-block size-1.5 shrink-0 rounded-full ${
                                item.ready
                                  ? "bg-success"
                                  : "bg-muted-foreground/50"
                              }`}
                            />
                            <span className="min-w-0 break-words text-foreground">
                              {item.name}
                            </span>
                          </span>
                          <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                            ×{item.quantity.toString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
