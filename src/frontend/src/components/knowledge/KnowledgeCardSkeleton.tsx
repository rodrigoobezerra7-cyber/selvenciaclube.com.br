const SKELETON_IDS = Array.from(
  { length: 6 },
  (_, i) => `knowledge-skeleton-${i}`,
);

export default function KnowledgeCardSkeleton() {
  return (
    <div
      data-ocid="knowledge.loading_state"
      aria-busy="true"
      aria-live="polite"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <span className="sr-only">Carregando fichas de conhecimento</span>
      {SKELETON_IDS.map((id) => (
        <div
          key={id}
          className="flex flex-col gap-4 border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between">
            <div className="h-5 w-28 animate-pulse bg-muted" />
            <div className="h-3 w-14 animate-pulse bg-muted" />
          </div>
          <div className="h-5 w-4/5 animate-pulse bg-muted" />
          <div className="space-y-2">
            <div className="h-3 w-full animate-pulse bg-muted" />
            <div className="h-3 w-11/12 animate-pulse bg-muted" />
            <div className="h-3 w-2/3 animate-pulse bg-muted" />
          </div>
          <div className="mt-2 h-3 w-24 animate-pulse bg-muted" />
        </div>
      ))}
    </div>
  );
}
