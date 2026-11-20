import { cn } from "@/lib/utils";
import { Fingerprint, Loader2 } from "lucide-react";

type IdentityButtonProps = {
  onClick: () => void;
  isPending: boolean;
  disabled?: boolean;
  label: string;
  pendingLabel: string;
  ocid: string;
  variant?: "primary" | "outline";
};

export function IdentityButton({
  onClick,
  isPending,
  disabled,
  label,
  pendingLabel,
  ocid,
  variant = "primary",
}: IdentityButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isPending}
      data-ocid={ocid}
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 border px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] transition-smooth disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary"
          ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-subtle"
          : "border-border text-foreground hover:border-primary hover:text-primary",
      )}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <Fingerprint className="size-4" aria-hidden="true" />
      )}
      {isPending ? pendingLabel : label}
    </button>
  );
}
