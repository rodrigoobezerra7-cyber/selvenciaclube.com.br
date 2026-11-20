const SKELETON_IDS = Array.from(
  { length: 8 },
  (_, index) => `arsenal-skeleton-${index}`,
);

export default function ProductGridSkeleton() {
  return (
    <div
      data-ocid="arsenal.loading_state"
      aria-busy="true"
      aria-live="polite"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <span className="sr-only">Carregando equipamentos do Arsenal</span>
      {SKELETON_IDS.map((id) => (
        <div
          key={id}
          className="flex flex-col overflow-hidden border border-border bg-card"
        >
          <div className="h-9 border-b border-border/70 bg-muted/60" />
          <div className="aspect-[4/3] animate-pulse bg-muted" />
          <div className="flex flex-col gap-3 p-4">
            <div className="h-4 w-3/4 animate-pulse bg-muted" />
            <div className="h-3 w-full animate-pulse bg-muted" />
            <div className="h-3 w-2/3 animate-pulse bg-muted" />
            <div className="mt-2 h-5 w-24 animate-pulse bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
