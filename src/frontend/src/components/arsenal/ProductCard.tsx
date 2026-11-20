import { PRODUCT_CATEGORY_LABEL, formatPrice } from "@/types";
import type { Product } from "@/types";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const categoryLabel =
    PRODUCT_CATEGORY_LABEL[product.category] ?? product.category;

  return (
    <Link
      to="/arsenal/$productId"
      params={{ productId: product.id.toString() }}
      data-ocid={`arsenal.product.${index + 1}`}
      className="group corner-brackets flex animate-fade-in flex-col overflow-hidden border border-border bg-card transition-smooth hover:border-primary focus-visible:border-primary focus-visible:outline-none"
      style={{ animationDelay: `${Math.min(index, 8) * 80}ms` }}
    >
      <div className="flex items-center justify-between border-b border-border/70 px-3 py-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {categoryLabel}
        </span>
        <span
          className={
            product.available
              ? "font-mono text-[10px] uppercase tracking-[0.18em] text-success"
              : "font-mono text-[10px] uppercase tracking-[0.18em] text-destructive"
          }
        >
          {product.available ? "Disponível" : "Indisponível"}
        </span>
      </div>

      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-base font-bold uppercase leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary">
          {product.name}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="font-mono text-sm font-semibold text-foreground">
            {formatPrice(product.priceCents)}
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
            Ver ficha
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
