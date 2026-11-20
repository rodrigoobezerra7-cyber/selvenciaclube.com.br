import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

type PillarCardProps = {
  index: string;
  title: string;
  description: string;
  to: string;
  icon: ReactNode;
  meta: string;
  ocid: string;
};

export function PillarCard({
  index,
  title,
  description,
  to,
  icon,
  meta,
  ocid,
}: PillarCardProps) {
  return (
    <Link
      to={to}
      data-ocid={ocid}
      className="corner-brackets group flex h-full flex-col border border-border bg-card p-5 shadow-subtle transition-smooth hover:border-primary/70 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-6"
    >
      <div className="mb-5 flex items-start justify-between">
        <span className="font-display text-3xl font-bold leading-none text-muted-foreground/50 transition-colors group-hover:text-primary/70">
          {index}
        </span>
        <span className="text-muted-foreground transition-colors group-hover:text-primary">
          {icon}
        </span>
      </div>

      <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {meta}
      </p>
      <h3 className="font-display text-xl font-bold uppercase tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-primary">
        Acessar módulo
        <ArrowUpRight
          className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}
