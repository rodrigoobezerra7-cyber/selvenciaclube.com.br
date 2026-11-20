import { usePlaceOrder, useProduct } from "@/hooks/useQueries";
import { PRODUCT_CATEGORY_LABEL, formatPrice } from "@/types";
import type { OrderError } from "@/types";
import { Link, useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";

function orderErrorMessage(error: OrderError): string {
  switch (error.__kind__) {
    case "notRegistered":
      return "Sua conta ainda não está registrada como membro. Conclua o cadastro para comprar.";
    case "invalidQuantity":
      return "Quantidade inválida. Selecione ao menos uma unidade.";
    case "unknownProduct":
      return "Este equipamento não está mais no catálogo do Arsenal.";
    case "unavailable":
      return "Este equipamento está indisponível no momento. Tente outro item.";
    default:
      return "Não foi possível registrar o pedido. Tente novamente.";
  }
}

export default function ProdutoPage() {
  const { productId } = useParams({ from: "/arsenal/$productId" });
  const parsedId = /^\d+$/.test(productId) ? BigInt(productId) : null;
  const productQuery = useProduct(parsedId);
  const placeOrder = usePlaceOrder();
  const [quantity, setQuantity] = useState(1);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const product = productQuery.data ?? null;
  const categoryLabel = product
    ? (PRODUCT_CATEGORY_LABEL[product.category] ?? product.category)
    : "";

  function handleBuy() {
    if (!product) return;
    setSuccessMessage(null);
    placeOrder.mutate(
      { productId: product.id, quantity: BigInt(quantity) },
      {
        onSuccess: (result) => {
          if (result.__kind__ === "ok") {
            const order = result.ok;
            setSuccessMessage(
              `Pedido #${order.id.toString()} confirmado — ${order.quantity.toString()}× ${product.name}.`,
            );
          }
        },
      },
    );
  }

  const orderError =
    placeOrder.data && placeOrder.data.__kind__ === "err"
      ? placeOrder.data.err
      : null;

  return (
    <div className="bg-background">
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 md:py-12">
        <Link
          to="/arsenal"
          data-ocid="produto.back_link"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-smooth hover:text-primary"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Voltar ao Arsenal
        </Link>

        {productQuery.isLoading ? (
          <div
            data-ocid="produto.loading_state"
            aria-busy="true"
            aria-live="polite"
            className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2"
          >
            <span className="sr-only">Carregando ficha do equipamento</span>
            <div className="aspect-[4/3] animate-pulse border border-border bg-muted" />
            <div className="flex flex-col gap-4">
              <div className="h-3 w-24 animate-pulse bg-muted" />
              <div className="h-8 w-3/4 animate-pulse bg-muted" />
              <div className="h-6 w-32 animate-pulse bg-muted" />
              <div className="h-24 w-full animate-pulse bg-muted" />
              <div className="h-11 w-40 animate-pulse bg-muted" />
            </div>
          </div>
        ) : productQuery.isError ? (
          <div
            data-ocid="produto.error_state"
            className="mt-8 flex flex-col items-start gap-4 border border-destructive/50 bg-destructive/10 p-8"
          >
            <div className="flex items-center gap-3 text-destructive">
              <AlertTriangle className="size-5" aria-hidden="true" />
              <p className="font-display text-lg font-bold uppercase tracking-tight">
                Falha ao carregar a ficha
              </p>
            </div>
            <p className="max-w-xl text-sm text-muted-foreground">
              Não foi possível recuperar os dados deste equipamento.
            </p>
            <button
              type="button"
              onClick={() => void productQuery.refetch()}
              data-ocid="produto.retry_button"
              className="border border-primary bg-primary px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90"
            >
              Tentar novamente
            </button>
          </div>
        ) : !product ? (
          <div
            data-ocid="produto.empty_state"
            className="mt-8 flex flex-col items-center gap-4 border border-dashed border-border bg-card px-6 py-16 text-center"
          >
            <p className="font-display text-lg font-bold uppercase tracking-tight text-foreground">
              Equipamento não encontrado
            </p>
            <p className="max-w-md text-sm text-muted-foreground">
              Este item não consta no catálogo do Arsenal. Explore os demais
              equipamentos disponíveis.
            </p>
            <Link
              to="/arsenal"
              data-ocid="produto.empty_state.button"
              className="border border-primary bg-primary px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90"
            >
              Ver Arsenal completo
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="corner-brackets relative overflow-hidden border border-border bg-card">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="flex items-center justify-between border-t border-border/70 px-4 py-2.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Ref. {product.id.toString().padStart(4, "0")}
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
            </div>

            <div className="flex flex-col">
              <p className="label-tactical mb-2">{categoryLabel}</p>
              <h1 className="font-display text-3xl font-bold uppercase leading-tight tracking-tight text-foreground md:text-4xl">
                {product.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-baseline gap-3 border-y border-border py-4">
                <span className="font-mono text-2xl font-semibold text-primary">
                  {formatPrice(product.priceCents)}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  por unidade
                </span>
              </div>

              <div className="mt-6">
                <p className="label-tactical mb-2">Descrição operacional</p>
                <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              </div>

              <div className="mt-8 border border-border bg-card p-4">
                <div className="flex flex-wrap items-end gap-4">
                  <div>
                    <label
                      htmlFor="produto-quantity"
                      className="label-tactical mb-2 block"
                    >
                      Quantidade
                    </label>
                    <div className="inline-flex items-stretch border border-input">
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity((current) => Math.max(1, current - 1))
                        }
                        disabled={quantity <= 1}
                        aria-label="Diminuir quantidade"
                        data-ocid="produto.quantity_decrease_button"
                        className="px-3 font-mono text-base text-foreground transition-smooth hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        −
                      </button>
                      <input
                        id="produto-quantity"
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(event) => {
                          const next = Number.parseInt(event.target.value, 10);
                          setQuantity(
                            Number.isNaN(next) ? 1 : Math.max(1, next),
                          );
                        }}
                        data-ocid="produto.quantity_input"
                        className="w-14 border-x border-input bg-background py-2 text-center font-mono text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity((current) => current + 1)}
                        aria-label="Aumentar quantidade"
                        data-ocid="produto.quantity_increase_button"
                        className="px-3 font-mono text-base text-foreground transition-smooth hover:bg-muted"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleBuy}
                    disabled={placeOrder.isPending || !product.available}
                    data-ocid="produto.buy_button"
                    className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 border border-primary bg-primary px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                  >
                    {placeOrder.isPending ? (
                      <Loader2
                        className="size-4 animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <ShoppingCart className="size-4" aria-hidden="true" />
                    )}
                    {placeOrder.isPending ? "Processando" : "Comprar"}
                  </button>
                </div>

                {!product.available && (
                  <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-destructive">
                    Item indisponível — compra desativada
                  </p>
                )}

                {successMessage && (
                  <output
                    data-ocid="produto.success_state"
                    className="mt-4 flex items-start gap-3 border border-success/50 bg-success/10 p-3"
                  >
                    <CheckCircle2
                      className="mt-0.5 size-4 shrink-0 text-success"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-success">
                        Pedido confirmado
                      </p>
                      <p className="mt-1 text-sm text-foreground">
                        {successMessage}
                      </p>
                    </div>
                  </output>
                )}

                {(orderError || placeOrder.isError) && (
                  <div
                    role="alert"
                    data-ocid="produto.error_state"
                    className="mt-4 flex items-start gap-3 border border-destructive/50 bg-destructive/10 p-3"
                  >
                    <AlertTriangle
                      className="mt-0.5 size-4 shrink-0 text-destructive"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-destructive">
                        Pedido não registrado
                      </p>
                      <p className="mt-1 text-sm text-foreground">
                        {orderError
                          ? orderErrorMessage(orderError)
                          : "Falha de comunicação com o Arsenal. Tente novamente."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
