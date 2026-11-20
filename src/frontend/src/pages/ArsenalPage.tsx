import CategoryFilter, {
  type CategoryFilterValue,
} from "@/components/arsenal/CategoryFilter";
import ProductCard from "@/components/arsenal/ProductCard";
import ProductGridSkeleton from "@/components/arsenal/ProductGridSkeleton";
import { useCategories, useProducts } from "@/hooks/useQueries";
import { PRODUCT_CATEGORY_LABEL } from "@/types";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, PackageSearch, RotateCw } from "lucide-react";
import { useMemo, useState } from "react";

export default function ArsenalPage() {
  const productsQuery = useProducts();
  const categoriesQuery = useCategories();
  const [activeCategory, setActiveCategory] =
    useState<CategoryFilterValue>("todas");

  const products = productsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];

  const visibleProducts = useMemo(() => {
    if (activeCategory === "todas") return products;
    return products.filter((product) => product.category === activeCategory);
  }, [products, activeCategory]);

  const isLoading = productsQuery.isLoading || categoriesQuery.isLoading;
  const isError = productsQuery.isError || categoriesQuery.isError;
  const activeLabel =
    activeCategory === "todas"
      ? "Todos os equipamentos"
      : (PRODUCT_CATEGORY_LABEL[activeCategory] ?? activeCategory);

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-muted/30">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid-overlay opacity-40"
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-16">
          <p className="label-tactical mb-3">{"// "}Arsenal Selvência</p>
          <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
            Equipamentos de combate
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Material verificado e pronto para operação. Cada item do Arsenal é
            selecionado para resistir a cenários hostis e acompanhar o membro em
            campo.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="inline-block size-1.5 animate-pulse-dot rounded-full bg-primary"
              />
              Estoque monitorado
            </span>
            <span>{products.length} itens catalogados</span>
            <span>{categories.length} categorias</span>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:py-14">
        <div className="mb-8 flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label-tactical mb-2">Filtro de categoria</p>
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-foreground md:text-2xl">
              {activeLabel}
            </h2>
          </div>
          <CategoryFilter
            categories={categories}
            total={products.length}
            value={activeCategory}
            onChange={setActiveCategory}
          />
        </div>

        {isLoading ? (
          <ProductGridSkeleton />
        ) : isError ? (
          <div
            data-ocid="arsenal.error_state"
            className="flex flex-col items-start gap-4 border border-destructive/50 bg-destructive/10 p-8"
          >
            <div className="flex items-center gap-3 text-destructive">
              <AlertTriangle className="size-5" aria-hidden="true" />
              <p className="font-display text-lg font-bold uppercase tracking-tight">
                Falha na conexão com o Arsenal
              </p>
            </div>
            <p className="max-w-xl text-sm text-muted-foreground">
              Não foi possível carregar o catálogo de equipamentos. Verifique a
              conexão e tente novamente.
            </p>
            <button
              type="button"
              onClick={() => {
                void productsQuery.refetch();
                void categoriesQuery.refetch();
              }}
              data-ocid="arsenal.retry_button"
              className="inline-flex items-center gap-2 border border-primary bg-primary px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90"
            >
              <RotateCw className="size-3.5" aria-hidden="true" />
              Tentar novamente
            </button>
          </div>
        ) : visibleProducts.length === 0 ? (
          <div
            data-ocid="arsenal.empty_state"
            className="flex flex-col items-center gap-4 border border-dashed border-border bg-card px-6 py-16 text-center"
          >
            <span className="inline-flex size-14 items-center justify-center border border-border bg-muted text-muted-foreground">
              <PackageSearch className="size-6" aria-hidden="true" />
            </span>
            <div className="space-y-2">
              <p className="font-display text-lg font-bold uppercase tracking-tight text-foreground">
                Nenhum item em {activeLabel.toLowerCase()}
              </p>
              <p className="mx-auto max-w-md text-sm text-muted-foreground">
                Esta categoria está sem equipamentos no momento. Consulte as
                demais categorias do Arsenal.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveCategory("todas")}
              data-ocid="arsenal.empty_state.button"
              className="border border-primary bg-primary px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90"
            >
              Ver todos os equipamentos
            </button>
          </div>
        ) : (
          <div
            data-ocid="arsenal.product_grid"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {visibleProducts.map((product, index) => (
              <ProductCard
                key={product.id.toString()}
                product={product}
                index={index}
              />
            ))}
          </div>
        )}

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Precisa de orientação de kit?
          </p>
          <Link
            to="/biblioteca"
            data-ocid="arsenal.knowledge_link"
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary transition-smooth hover:text-accent"
          >
            Consultar fichas de conhecimento →
          </Link>
        </div>
      </section>
    </div>
  );
}
