import type { RecoveryError } from "@/backend";
import { AuthShell, FieldError, FormNotice } from "@/components/auth/AuthShell";
import { IdentityButton } from "@/components/auth/IdentityButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemberSession } from "@/hooks/useMemberSession";
import {
  useCompleteRecovery,
  useRequestRecoveryCode,
  useVerifyRecoveryCode,
} from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Fingerprint,
  KeyRound,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

type Step = "identidade" | "email" | "codigo" | "concluido";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateEmail(raw: string): string | undefined {
  const value = raw.trim();
  if (!value) return "Informe o e-mail cadastrado no seu perfil de membro.";
  if (!EMAIL_PATTERN.test(value)) return "Informe um e-mail válido.";
  return undefined;
}

function validateCode(raw: string): string | undefined {
  const value = raw.trim();
  if (!value) return "Informe o código de verificação recebido por e-mail.";
  if (!/^\d{6}$/.test(value)) return "O código tem 6 dígitos numéricos.";
  return undefined;
}

function recoveryErrorMessage(error: RecoveryError): string {
  switch (error.__kind__) {
    case "notRegistered":
      return "Nenhum membro registrado com esta identidade. Crie sua conta primeiro.";
    case "noEmail":
      return "Seu perfil não tem e-mail cadastrado. Fale com a coordenação para vincular um e-mail.";
    case "invalidEmail":
      return "O e-mail não confere com o cadastrado no seu perfil de membro.";
    case "invalidCode":
      return "Código inválido. Revise os 6 dígitos e tente novamente.";
    case "codeExpired":
      return "O código expirou. Solicite um novo código de verificação.";
    case "tooManyAttempts":
      return "Muitas tentativas inválidas. Solicite um novo código de verificação.";
    case "emailFailed":
      return "Não foi possível enviar o e-mail de verificação. Tente novamente em instantes.";
    default:
      return "Não foi possível concluir a recuperação. Tente novamente.";
  }
}

const STEPS: { id: Step; label: string }[] = [
  { id: "identidade", label: "Identidade" },
  { id: "email", label: "E-mail" },
  { id: "codigo", label: "Código" },
];

export default function RecuperarSenhaPage() {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    isLoginError,
    login,
    profile,
  } = useMemberSession();
  const requestCode = useRequestRecoveryCode();
  const verifyCode = useVerifyRecoveryCode();
  const completeRecovery = useCompleteRecovery();

  const [step, setStep] = useState<Step>("identidade");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [touched, setTouched] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const emailError = touched ? validateEmail(email) : undefined;
  const codeError = touched ? validateCode(code) : undefined;

  const activeStep: Step = !isAuthenticated
    ? "identidade"
    : step === "identidade"
      ? "email"
      : step;

  function resetToEmail() {
    setStep("email");
    setCode("");
    setTouched(false);
    setServerError(null);
    verifyCode.reset();
    completeRecovery.reset();
  }

  function handleRequestCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    setServerError(null);
    if (validateEmail(email)) return;

    requestCode.mutate(
      { email: email.trim() },
      {
        onSuccess: (result) => {
          if (result.__kind__ === "ok") {
            setStep("codigo");
            setTouched(false);
          } else {
            setServerError(recoveryErrorMessage(result.err));
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

  function handleVerifyCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    setServerError(null);
    if (validateCode(code)) return;

    completeRecovery.mutate(
      { code: code.trim() },
      {
        onSuccess: (result) => {
          if (result.__kind__ === "ok") {
            setStep("concluido");
          } else {
            setServerError(recoveryErrorMessage(result.err));
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

  const stepIndex = STEPS.findIndex((item) => item.id === activeStep);

  return (
    <AuthShell
      eyebrow={`${"// "}Recuperação de acesso`}
      title="Recuperar acesso"
      description="Confirme sua identidade, receba um código de verificação por e-mail e reative seu perfil de membro na Central de Operações."
      footer={
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          <Link
            to="/acesso"
            data-ocid="recovery.back_link"
            className="inline-flex items-center gap-1.5 transition-smooth hover:text-primary"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Voltar ao acesso
          </Link>
        </p>
      }
    >
      <div className="space-y-5">
        <ol
          aria-label="Etapas de recuperação"
          className="grid grid-cols-3 gap-px border border-border bg-border"
        >
          {STEPS.map((item, index) => {
            const isDone = stepIndex > index || step === "concluido";
            const isCurrent = item.id === activeStep;
            return (
              <li
                key={item.id}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "flex items-center justify-center gap-1.5 px-2 py-2 font-mono text-[10px] uppercase tracking-[0.14em]",
                  isCurrent
                    ? "bg-primary text-primary-foreground"
                    : isDone
                      ? "bg-card text-success"
                      : "bg-card text-muted-foreground",
                )}
              >
                {isDone ? (
                  <CheckCircle2 className="size-3" aria-hidden="true" />
                ) : (
                  <span aria-hidden="true">{index + 1}</span>
                )}
                {item.label}
              </li>
            );
          })}
        </ol>

        {isInitializing ? (
          <div
            data-ocid="recovery.loading_state"
            className="flex items-center justify-center gap-2 py-10 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
          >
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Verificando identidade
          </div>
        ) : !isAuthenticated ? (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Primeiro conecte sua identidade da plataforma. O código de
              verificação só é enviado para o e-mail vinculado ao seu perfil de
              membro.
            </p>
            {isLoginError ? (
              <FormNotice tone="error" ocid="recovery.login_error_state">
                Não foi possível concluir a autenticação. Tente novamente.
              </FormNotice>
            ) : null}
            <IdentityButton
              onClick={login}
              isPending={isLoggingIn}
              label="Conectar identidade"
              pendingLabel="Abrindo identificação…"
              ocid="recovery.identity_button"
            />
            <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-muted-foreground/80">
              Passo 1 de 3 · identidade
            </p>
          </div>
        ) : step === "concluido" ? (
          <div className="space-y-4">
            <FormNotice tone="success" ocid="recovery.success_state">
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-4" aria-hidden="true" />
                Acesso restabelecido
                {profile?.code ? ` · Membro ${profile.code}` : ""}
              </span>
            </FormNotice>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Seu código foi validado e o perfil de membro está reativado. Você
              já pode retomar a operação na Central.
            </p>
            <button
              type="button"
              onClick={() => void navigate({ to: "/central" })}
              data-ocid="recovery.finish_button"
              className="inline-flex w-full items-center justify-center gap-2 border border-primary bg-primary px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90"
            >
              Ir para a Central
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        ) : step === "codigo" ? (
          <form onSubmit={handleVerifyCode} noValidate className="space-y-4">
            <div className="flex items-start gap-3 border border-border bg-muted/40 p-3">
              <Mail
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Enviamos um código de 6 dígitos para{" "}
                <span className="font-mono text-foreground">
                  {email.trim()}
                </span>
                . Ele expira em 15 minutos.
              </p>
            </div>
            <div>
              <Label
                htmlFor="recovery-code"
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
              >
                Código de verificação
              </Label>
              <Input
                id="recovery-code"
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                onBlur={() => setTouched(true)}
                placeholder="000000"
                aria-invalid={!!codeError}
                aria-describedby={codeError ? "recovery-code-error" : undefined}
                data-ocid="recovery.code_input"
                className="mt-1.5 rounded-none border-input bg-background font-mono tracking-[0.4em]"
              />
              <FieldError id="recovery-code-error" message={codeError} />
            </div>
            {serverError ? (
              <FormNotice tone="error" ocid="recovery.error_state">
                {serverError}
              </FormNotice>
            ) : null}
            <button
              type="submit"
              disabled={completeRecovery.isPending}
              data-ocid="recovery.verify_button"
              className="inline-flex w-full items-center justify-center gap-2 border border-primary bg-primary px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {completeRecovery.isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <KeyRound className="size-4" aria-hidden="true" />
              )}
              {completeRecovery.isPending
                ? "Validando…"
                : "Validar código e recuperar"}
            </button>
            <button
              type="button"
              onClick={resetToEmail}
              data-ocid="recovery.resend_button"
              className="w-full font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-smooth hover:text-primary"
            >
              Solicitar novo código
            </button>
          </form>
        ) : (
          <form onSubmit={handleRequestCode} noValidate className="space-y-4">
            <div className="flex items-start gap-3 border border-border bg-muted/40 p-3">
              <Fingerprint
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Identidade conectada
                {profile?.code ? ` · Membro ${profile.code}` : ""}. Informe o
                e-mail cadastrado no seu perfil para receber o código de
                verificação.
              </p>
            </div>
            <div>
              <Label
                htmlFor="recovery-email"
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
              >
                E-mail cadastrado
              </Label>
              <Input
                id="recovery-email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="membro@exemplo.com"
                autoComplete="email"
                aria-invalid={!!emailError}
                aria-describedby={
                  emailError ? "recovery-email-error" : undefined
                }
                data-ocid="recovery.email_input"
                className="mt-1.5 rounded-none border-input bg-background"
              />
              <FieldError id="recovery-email-error" message={emailError} />
            </div>
            {serverError ? (
              <FormNotice tone="error" ocid="recovery.error_state">
                {serverError}
              </FormNotice>
            ) : null}
            <button
              type="submit"
              disabled={requestCode.isPending}
              data-ocid="recovery.request_button"
              className="inline-flex w-full items-center justify-center gap-2 border border-primary bg-primary px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {requestCode.isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Mail className="size-4" aria-hidden="true" />
              )}
              {requestCode.isPending ? "Enviando…" : "Enviar código por e-mail"}
            </button>
            <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-muted-foreground/80">
              Passo 2 de 3 · e-mail
            </p>
          </form>
        )}
      </div>
    </AuthShell>
  );
}
