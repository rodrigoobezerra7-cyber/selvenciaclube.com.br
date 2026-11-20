import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
  className,
}: AuthShellProps) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        className="grid-overlay absolute inset-0 opacity-30"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1fr_minmax(0,26rem)] md:items-start md:gap-16 md:py-20">
        <div className="animate-fade-in">
          <Link
            to="/"
            data-ocid="auth.back_link"
            className="mb-8 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-smooth hover:text-primary"
          >
            <ChevronLeft className="size-3.5" />
            Início
          </Link>
          <p className="label-tactical mb-3">{eyebrow}</p>
          <h1 className="font-display text-3xl font-bold uppercase leading-[0.95] tracking-tight md:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
          <dl className="mt-8 hidden max-w-sm grid-cols-2 gap-px border border-border bg-border md:grid">
            <div className="bg-card px-4 py-3">
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Protocolo
              </dt>
              <dd className="mt-1 font-mono text-xs text-foreground">
                IDENT-01
              </dd>
            </div>
            <div className="bg-card px-4 py-3">
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Canal
              </dt>
              <dd className="mt-1 flex items-center gap-1.5 font-mono text-xs text-foreground">
                <span
                  aria-hidden="true"
                  className="inline-block size-1.5 animate-pulse-dot rounded-full bg-success"
                />
                Seguro
              </dd>
            </div>
          </dl>
        </div>

        <div
          className={cn(
            "corner-brackets animate-fade-in border border-border bg-card p-6 shadow-subtle sm:p-8",
            className,
          )}
        >
          {children}
          {footer ? (
            <div className="mt-6 border-t border-border pt-5">{footer}</div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      data-ocid={`${id}.error_state`}
      className="mt-1.5 font-mono text-[11px] leading-snug text-destructive"
    >
      {message}
    </p>
  );
}

export function FormNotice({
  tone,
  children,
  ocid,
}: {
  tone: "error" | "success" | "info";
  children: React.ReactNode;
  ocid: string;
}) {
  const tones = {
    error: "border-destructive/50 bg-destructive/10 text-destructive",
    success: "border-success/50 bg-success/10 text-success",
    info: "border-primary/40 bg-primary/10 text-primary",
  } as const;
  return (
    <div
      data-ocid={ocid}
      className={cn(
        "border px-3 py-2.5 font-mono text-[11px] leading-relaxed",
        tones[tone],
      )}
    >
      {children}
    </div>
  );
}
