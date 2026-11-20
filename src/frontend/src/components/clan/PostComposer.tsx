import { FieldError, FormNotice } from "@/components/auth/AuthShell";
import { useCreateCommunityPost } from "@/hooks/useQueries";
import type { ClanError } from "@/types";
import { Send } from "lucide-react";
import { useId, useState } from "react";

const TITLE_MAX = 120;
const BODY_MAX = 2000;

function clanErrorMessage(error: ClanError): string {
  switch (error.__kind__) {
    case "notRegistered":
      return "Sua ficha de membro não foi localizada. Refaça o cadastro.";
    case "notEntitled":
      return "Seu plano atual não permite publicar no mural. Suba para Recruta.";
    case "invalidInput":
      return "Revise o título e o texto: há campos vazios ou fora do limite.";
    case "unknownContent":
      return "O canal recusou a publicação. Tente novamente.";
    default:
      return "Não foi possível publicar. Tente novamente.";
  }
}

export function PostComposer() {
  const titleId = useId();
  const bodyId = useId();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [touched, setTouched] = useState(false);
  const mutation = useCreateCommunityPost();

  const trimmedTitle = title.trim();
  const trimmedBody = body.trim();
  const titleError =
    touched && trimmedTitle.length === 0 ? "Informe um título." : undefined;
  const bodyError =
    touched && trimmedBody.length === 0
      ? "Escreva o conteúdo do post."
      : undefined;
  const canSubmit =
    trimmedTitle.length > 0 && trimmedBody.length > 0 && !mutation.isPending;

  const resultError =
    mutation.data?.__kind__ === "err"
      ? clanErrorMessage(mutation.data.err)
      : undefined;
  const transportError = mutation.isError
    ? "Falha de comunicação com o servidor. Tente novamente."
    : undefined;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    if (!canSubmit) return;

    const payload = { title: trimmedTitle, body: trimmedBody };
    setTitle("");
    setBody("");
    setTouched(false);
    mutation.mutate(payload, {
      onError: () => {
        setTitle((current) => (current === "" ? payload.title : current));
        setBody((current) => (current === "" ? payload.body : current));
      },
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-ocid="community.composer.panel"
      className="corner-brackets border border-border bg-card p-5 shadow-subtle sm:p-6"
    >
      <div className="mb-5 flex items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="label-tactical">Transmissão</p>
          <h2 className="mt-1 font-display text-lg font-bold uppercase tracking-tight text-foreground">
            Novo post no mural
          </h2>
        </div>
        <span
          aria-hidden="true"
          className="inline-block size-2 shrink-0 animate-pulse-dot rounded-full bg-primary"
        />
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor={titleId}
            className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
          >
            Título
          </label>
          <input
            id={titleId}
            data-ocid="community.composer.title_input"
            type="text"
            value={title}
            maxLength={TITLE_MAX}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Assunto da operação"
            aria-invalid={!!titleError}
            aria-describedby={titleError ? `${titleId}-error` : undefined}
            className="w-full border border-input bg-background px-3 py-2.5 font-body text-sm text-foreground outline-none transition-smooth placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/40"
          />
          <FieldError id={`${titleId}-error`} message={titleError} />
        </div>

        <div>
          <label
            htmlFor={bodyId}
            className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
          >
            Conteúdo
          </label>
          <textarea
            id={bodyId}
            data-ocid="community.composer.body_textarea"
            value={body}
            maxLength={BODY_MAX}
            rows={5}
            onChange={(event) => setBody(event.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Relate a experiência, a técnica ou o alerta para o Clã."
            aria-invalid={!!bodyError}
            aria-describedby={bodyError ? `${bodyId}-error` : undefined}
            className="w-full resize-y border border-input bg-background px-3 py-2.5 font-body text-sm leading-relaxed text-foreground outline-none transition-smooth placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/40"
          />
          <div className="mt-1 flex items-center justify-between gap-3">
            <FieldError id={`${bodyId}-error`} message={bodyError} />
            <span className="ml-auto font-mono text-[10px] tabular-nums text-muted-foreground">
              {body.length}/{BODY_MAX}
            </span>
          </div>
        </div>
      </div>

      {resultError ? (
        <div className="mt-4">
          <FormNotice tone="error" ocid="community.composer.error_state">
            {resultError}
          </FormNotice>
        </div>
      ) : null}
      {transportError ? (
        <div className="mt-4">
          <FormNotice
            tone="error"
            ocid="community.composer.transport_error_state"
          >
            {transportError}
          </FormNotice>
        </div>
      ) : null}

      <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Visível para Recruta e acima
        </p>
        <button
          type="submit"
          data-ocid="community.composer.submit_button"
          disabled={!canSubmit}
          className="inline-flex items-center justify-center gap-2 border border-primary bg-primary px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="size-3.5" aria-hidden="true" />
          {mutation.isPending ? "Transmitindo…" : "Publicar"}
        </button>
      </div>
    </form>
  );
}
