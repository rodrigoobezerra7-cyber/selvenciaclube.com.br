import { Skeleton } from "@/components/ui/skeleton";
import type { CommunityPost } from "@/types";
import { timestampToDate } from "@/types";
import { MessageSquare, Radio } from "lucide-react";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatPublished(createdAt: bigint): string {
  const date = timestampToDate(createdAt);
  if (!date) return "Data indisponível";
  return dateFormatter.format(date);
}

function PostCard({ post, index }: { post: CommunityPost; index: number }) {
  return (
    <article
      data-ocid={`community.post.item.${index + 1}`}
      className="group animate-fade-in border border-border bg-card p-5 shadow-subtle transition-smooth hover:border-primary/60 sm:p-6"
    >
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
            {post.authorCode}
          </p>
          <p className="mt-1 truncate font-display text-base font-semibold text-foreground">
            {post.title}
          </p>
        </div>
        <time
          dateTime={timestampToDate(post.createdAt)?.toISOString()}
          className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
        >
          {formatPublished(post.createdAt)}
        </time>
      </header>
      <p className="mt-3 whitespace-pre-line break-words font-body text-sm leading-relaxed text-muted-foreground">
        {post.body}
      </p>
    </article>
  );
}

function PostSkeleton() {
  return (
    <div className="border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="mt-4 h-4 w-2/3" />
      <Skeleton className="mt-3 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-5/6" />
    </div>
  );
}

type PostListProps = {
  posts: CommunityPost[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
};

export function PostList({
  posts,
  isLoading,
  isError,
  onRetry,
}: PostListProps) {
  if (isLoading) {
    return (
      <div
        data-ocid="community.posts.loading_state"
        aria-busy="true"
        aria-live="polite"
        className="space-y-4"
      >
        {Array.from({ length: 3 }, (_, i) => `post-skeleton-${i}`).map((id) => (
          <PostSkeleton key={id} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div
        data-ocid="community.posts.error_state"
        className="flex flex-col items-center border border-destructive/40 bg-destructive/5 px-6 py-12 text-center"
      >
        <span className="mb-4 inline-flex size-12 items-center justify-center border border-destructive/50 text-destructive">
          <Radio className="size-5" aria-hidden="true" />
        </span>
        <p className="label-tactical mb-2 text-destructive">Sinal perdido</p>
        <h3 className="font-display text-lg font-bold uppercase tracking-tight text-foreground">
          Não foi possível carregar o mural
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          O canal de transmissão não respondeu. Verifique a conexão e tente
          novamente.
        </p>
        <button
          type="button"
          onClick={onRetry}
          data-ocid="community.posts.retry_button"
          className="mt-5 border border-primary bg-primary px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div
        data-ocid="community.posts.empty_state"
        className="flex flex-col items-center border border-dashed border-border bg-muted/20 px-6 py-14 text-center"
      >
        <span className="mb-4 inline-flex size-12 items-center justify-center border border-primary/50 text-primary">
          <MessageSquare className="size-5" aria-hidden="true" />
        </span>
        <p className="label-tactical mb-2">Canal silencioso</p>
        <h3 className="font-display text-lg font-bold uppercase tracking-tight text-foreground">
          Nenhum post no mural ainda
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Seja o primeiro a transmitir para o Clã. Compartilhe uma técnica, um
          alerta ou um relato de campo.
        </p>
      </div>
    );
  }

  return (
    <div data-ocid="community.posts.list" className="space-y-4">
      {posts.map((post, index) => (
        <PostCard key={post.id.toString()} post={post} index={index} />
      ))}
    </div>
  );
}
