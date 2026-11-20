import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Crosshair,
  ShieldCheck,
} from "lucide-react";

const PILLARS = [
  {
    code: "01",
    title: "Preparação",
    description:
      "Protocolos de prontidão, planos de evacuação e rotinas de treino para cenários hostis.",
    icon: Compass,
  },
  {
    code: "02",
    title: "Equipamentos",
    description:
      "Arsenal curado de lanternas, facas, binóculos e vestuário de campo testados em operação.",
    icon: Crosshair,
  },
  {
    code: "03",
    title: "Conhecimento",
    description:
      "Fichas de kits, validade, manutenção e técnicas de sobrevivência revisadas pela comunidade.",
    icon: BookOpen,
  },
] as const;

export default function BemVindoPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="grid-overlay absolute inset-0 opacity-40"
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:py-24">
          <div className="animate-fade-in">
            <p className="label-tactical mb-4">{"// "}Central de Operações</p>
            <h1 className="max-w-3xl font-display text-4xl font-bold uppercase leading-[0.92] tracking-tight md:text-6xl">
              Central de
              <br />
              <span className="text-primary text-glow-amber">Operações</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              A plataforma definitiva de preparação, sobrevivência e arsenal
              tático para cenários hostis. Aqui você não é cliente — é membro da
              comunidade Selvência.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/acesso"
                search={{ modo: "criar" }}
                data-ocid="welcome.create_account_button"
                className="inline-flex items-center gap-2 border border-primary bg-primary px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90 hover:shadow-subtle"
              >
                Criar conta
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                to="/acesso"
                search={{ modo: "entrar" }}
                data-ocid="welcome.signin_button"
                className="inline-flex items-center gap-2 border border-border px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-smooth hover:border-primary hover:text-primary"
              >
                Entrar
              </Link>
            </div>
            <p className="mt-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <ShieldCheck
                className="size-3.5 text-success"
                aria-hidden="true"
              />
              Acesso por identidade da plataforma · sem senha própria
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:py-20">
          <div className="mb-8 flex items-end justify-between gap-4 border-b border-border pb-4">
            <h2 className="font-display text-xl font-bold uppercase tracking-tight md:text-2xl">
              Três frentes de operação
            </h2>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:block">
              Doutrina Selvência
            </span>
          </div>
          <ul className="grid gap-4 md:grid-cols-3">
            {PILLARS.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <li
                  key={pillar.code}
                  className="corner-brackets animate-fade-in border border-border bg-card p-5 transition-smooth hover:border-primary/60"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-display text-3xl font-bold text-muted-foreground/50">
                      {pillar.code}
                    </span>
                    <Icon className="size-5 text-primary" aria-hidden="true" />
                  </div>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Frente {pillar.code}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-bold uppercase tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
        <div className="corner-brackets flex flex-col items-start justify-between gap-6 border border-border bg-card p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="label-tactical mb-2">{"// "}Alistamento</p>
            <h2 className="font-display text-xl font-bold uppercase tracking-tight md:text-2xl">
              Pronto para entrar em operação?
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Registre seu código de membro e receba acesso ao Arsenal e à
              Biblioteca de conhecimento.
            </p>
          </div>
          <Link
            to="/acesso"
            search={{ modo: "criar" }}
            data-ocid="welcome.footer_cta_button"
            className="inline-flex shrink-0 items-center gap-2 border border-primary bg-primary px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90 hover:shadow-subtle"
          >
            Criar conta
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
