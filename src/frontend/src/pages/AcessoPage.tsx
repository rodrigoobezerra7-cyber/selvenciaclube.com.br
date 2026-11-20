import { MemberError } from "@/backend";
import { AuthShell, FieldError, FormNotice } from "@/components/auth/AuthShell";
import { IdentityButton } from "@/components/auth/IdentityButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemberSession } from "@/hooks/useMemberSession";
import { useRegisterMember } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type Mode = "criar" | "entrar";

const CODE_PATTERN = /^[A-Za-z0-9._-]{3,24}$/;

function validateCode(raw: string): string | undefined {
  const value = raw.trim();
  if (!value) return "Informe seu código de membro.";
  if (value.length < 3) return "O código precisa ter ao menos 3 caracteres.";
  if (value.length > 24) return "O código pode ter no máximo 24 caracteres.";
  if (!CODE_PATTERN.test(value))
    return "Use apenas letras, números, ponto, hífen ou sublinhado.";
  return undefined;
}

function validateEmail(raw: string): string | undefined {
  const value = raw.trim();
  if (!value) return undefined;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value))
    return "Informe um e-mail válido ou deixe em branco.";
  return undefined;
}

function memberErrorMessage(error: MemberError): string {
  switch (error) {
    case MemberError.codeTaken:
      return "Este código já está em uso. Escolha outro.";
    case MemberError.invalidCode:
      return "Código inválido. Revise os caracteres e tente novamente.";
    case MemberError.notRegistered:
      return "Nenhum membro registrado com esta identidade.";
    default:
      return "Não foi possível concluir o registro. Tente novamente.";
  }
}

export default function AcessoPage() {
  const search = useSearch({ from: "/acesso" });
  const navigate = useNavigate();
  const {
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    isLoginError,
    login,
    profile,
    isRegistered,
    isProfileLoading,
  } = useMemberSession();
  const registerMember = useRegisterMember();

  const [mode, setMode] = useState<Mode>(search.modo ?? "entrar");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const codeError = touched ? validateCode(code) : undefined;
  const emailError = touched ? validateEmail(email) : undefined;

  useEffect(() => {
    if (isAuthenticated && isRegistered) {
      void navigate({ to: "/central" });
    }
  }, [isAuthenticated, isRegistered, navigate]);

  function switchMode(next: Mode) {
    setMode(next);
    setServerError(null);
    setTouched(false);
    registerMember.reset();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    setServerError(null);
    const nextCodeError = validateCode(code);
    const nextEmailError = validateEmail(email);
    if (nextCodeError || nextEmailError) return;

    registerMember.mutate(
      { code: code.trim(), email: email.trim() ? email.trim() : null },
      {
        onSuccess: (result) => {
          if (result.__kind__ === "ok") {
            void navigate({ to: "/central" });
          } else {
            setServerError(memberErrorMessage(result.err));
          }
        },
        onError: () => {
          setServerError(
            "Falha de comunicação com o servidor. Tente novamente.",
          );
        },
      },
    );
  }

  const isCreate = mode === "criar";

  return (
    <AuthShell
      eyebrow={`${"// "}Acesso de membro`}
      title={isCreate ? "Criar conta" : "Entrar"}
      description={
        isCreate
          ? "Registre seu código de membro e vincule sua identidade da plataforma. Sem senha própria — a autenticação é feita pela identidade."
          : "Entre com sua identidade da plataforma para retomar a operação na Central."
      }
      footer={
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {isCreate ? "Já é membro? " : "Ainda não tem conta? "}
          <button
            type="button"
            onClick={() => switchMode(isCreate ? "entrar" : "criar")}
            data-ocid="access.switch_mode_button"
            className="text-primary underline-offset-4 transition-smooth hover:underline"
          >
            {isCreate ? "Entrar" : "Criar conta"}
          </button>
        </p>
      }
    >
      <div
        role="tablist"
        aria-label="Modo de acesso"
        className="mb-6 grid grid-cols-2 gap-px border border-border bg-border"
      >
        {(
          [
            { id: "criar", label: "Criar conta" },
            { id: "entrar", label: "Entrar" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={mode === tab.id}
            onClick={() => switchMode(tab.id)}
            data-ocid={`access.mode.${tab.id}`}
            className={cn(
              "px-3 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] transition-smooth",
              mode === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isInitializing ? (
        <div
          data-ocid="access.loading_state"
          className="flex items-center justify-center gap-2 py-10 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
        >
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Verificando identidade
        </div>
      ) : isAuthenticated ? (
        <div className="space-y-4">
          {isProfileLoading ? (
            <div
              data-ocid="access.profile_loading_state"
              className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
            >
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Carregando perfil
            </div>
          ) : isRegistered ? (
            <FormNotice tone="success" ocid="access.registered_state">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="size-4" aria-hidden="true" />
                Membro registrado: {profile?.code}
              </span>
            </FormNotice>
          ) : (
            <FormNotice tone="info" ocid="access.unregistered_state">
              Identidade conectada, mas sem código de membro. Crie sua conta
              abaixo para concluir o alistamento.
            </FormNotice>
          )}

          {isRegistered ? (
            <Link
              to="/central"
              data-ocid="access.continue_button"
              className="inline-flex w-full items-center justify-center gap-2 border border-primary bg-primary px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90"
            >
              Ir para a Central
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <Label
                  htmlFor="member-code"
                  className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
                >
                  Código de membro
                </Label>
                <Input
                  id="member-code"
                  name="code"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  onBlur={() => setTouched(true)}
                  placeholder="ex.: lobo-047"
                  autoComplete="username"
                  aria-invalid={!!codeError}
                  aria-describedby={codeError ? "member-code-error" : undefined}
                  data-ocid="access.code_input"
                  className="mt-1.5 rounded-none border-input bg-background font-mono"
                />
                <FieldError id="member-code-error" message={codeError} />
              </div>
              <div>
                <Label
                  htmlFor="member-email"
                  className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
                >
                  E-mail{" "}
                  <span className="normal-case tracking-normal text-muted-foreground/70">
                    (opcional)
                  </span>
                </Label>
                <Input
                  id="member-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  onBlur={() => setTouched(true)}
                  placeholder="membro@exemplo.com"
                  autoComplete="email"
                  aria-invalid={!!emailError}
                  aria-describedby={
                    emailError ? "member-email-error" : undefined
                  }
                  data-ocid="access.email_input"
                  className="mt-1.5 rounded-none border-input bg-background"
                />
                <FieldError id="member-email-error" message={emailError} />
              </div>
              {serverError ? (
                <FormNotice tone="error" ocid="access.register_error_state">
                  {serverError}
                </FormNotice>
              ) : null}
              <button
                type="submit"
                disabled={registerMember.isPending}
                data-ocid="access.register_button"
                className="inline-flex w-full items-center justify-center gap-2 border border-primary bg-primary px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {registerMember.isPending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : null}
                {registerMember.isPending ? "Registrando…" : "Registrar membro"}
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {isCreate
              ? "Primeiro conecte sua identidade da plataforma. Em seguida você define seu código de membro."
              : "Use a identidade da plataforma para autenticar. Seu código de membro será exibido após a conexão."}
          </p>
          {isLoginError ? (
            <FormNotice tone="error" ocid="access.login_error_state">
              Não foi possível concluir a autenticação. Tente novamente.
            </FormNotice>
          ) : null}
          <IdentityButton
            onClick={login}
            isPending={isLoggingIn}
            label={isCreate ? "Conectar identidade" : "Entrar com identidade"}
            pendingLabel="Abrindo identificação…"
            ocid="access.identity_button"
          />
          <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-muted-foreground/80">
            {isCreate
              ? "Passo 1 de 2 · identidade"
              : "Acesso por identidade da plataforma"}
          </p>
        </div>
      )}

      <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        <Link
          to="/recuperar"
          data-ocid="access.recovery_link"
          className="transition-smooth hover:text-primary"
        >
          Problemas para acessar?
        </Link>
      </p>
    </AuthShell>
  );
}
