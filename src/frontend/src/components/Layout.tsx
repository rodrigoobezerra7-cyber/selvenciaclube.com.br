import { useMemberSession } from "@/hooks/useMemberSession";
import { cn } from "@/lib/utils";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { to: "/central", label: "Central" },
  { to: "/arsenal", label: "Arsenal" },
  { to: "/biblioteca", label: "Biblioteca" },
  { to: "/cla", label: "Clã Selvência" },
] as const;

function StatusDot() {
  return (
    <span
      aria-hidden="true"
      className="inline-block size-1.5 shrink-0 animate-pulse-dot rounded-full bg-primary"
    />
  );
}

function BrandMark() {
  return (
    <Link
      to="/central"
      data-ocid="layout.brand_link"
      className="group flex items-center gap-2.5"
    >
      <span className="font-display text-lg font-bold uppercase tracking-[0.14em] text-foreground transition-colors group-hover:text-primary">
        Selvência
      </span>
      <span className="hidden items-center gap-1.5 sm:flex">
        <StatusDot />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Sistema operacional
        </span>
      </span>
    </Link>
  );
}

export default function Layout() {
  const { profile, isAuthenticated, logout } = useMemberSession();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  const memberLabel = profile?.code ? `Membro · ${profile.code}` : "Membro";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <BrandMark />

          <nav
            aria-label="Navegação principal"
            className="hidden items-center gap-1 md:flex"
          >
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  data-ocid={`layout.nav.${item.to === "/cla" ? "cla" : item.label.toLowerCase()}`}
                  className={cn(
                    "border-b-2 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.18em] transition-smooth",
                    active
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/central"
                  data-ocid="layout.member_chip"
                  className="hidden items-center gap-2 border border-primary/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-primary transition-smooth hover:bg-primary/10 sm:flex"
                >
                  <StatusDot />
                  <span className="max-w-[16rem] truncate">{memberLabel}</span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  data-ocid="layout.signout_button"
                  aria-label="Encerrar sessão"
                  className="inline-flex size-9 items-center justify-center border border-border text-muted-foreground transition-smooth hover:border-primary hover:text-primary"
                >
                  <LogOut className="size-4" />
                </button>
              </>
            ) : (
              <Link
                to="/acesso"
                data-ocid="layout.signin_link"
                className="border border-primary bg-primary px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90"
              >
                Entrar
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              data-ocid="layout.menu_button"
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileOpen}
              className="inline-flex size-9 items-center justify-center border border-border text-foreground transition-smooth hover:border-primary md:hidden"
            >
              {mobileOpen ? (
                <X className="size-4" />
              ) : (
                <Menu className="size-4" />
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav
            aria-label="Navegação móvel"
            className="border-t border-border bg-card px-4 py-3 md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    data-ocid={`layout.mobile_nav.${item.to === "/cla" ? "cla" : item.label.toLowerCase()}`}
                    className="block px-2 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground transition-smooth hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-sidebar">
        <div className="hazard-stripe h-1.5 w-full" aria-hidden="true" />
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Coord. 22°54′24″S 43°10′21″W · Alt. 780m · Status: operacional
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            © {new Date().getFullYear()} Selvência · Disciplina e táticas
          </p>
        </div>
        <div className="border-t border-border/60 px-4 py-3 text-center sm:px-6">
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70 transition-colors hover:text-primary"
          >
            © {new Date().getFullYear()}. Built with love using caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
