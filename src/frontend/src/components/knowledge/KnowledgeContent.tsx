interface KnowledgeContentProps {
  content: string;
}

const HEADING_PATTERN = /^[A-ZÁÉÍÓÚÂÊÔÃÕÇ][^:]{2,60}:$/;

export default function KnowledgeContent({ content }: KnowledgeContentProps) {
  const blocks = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0);

  return (
    <div className="space-y-5">
      {blocks.map((block) => {
        if (HEADING_PATTERN.test(block)) {
          return (
            <h3
              key={block}
              className="border-l-2 border-primary pl-3 font-display text-base font-semibold uppercase tracking-wide text-foreground"
            >
              {block.replace(/:$/, "")}
            </h3>
          );
        }

        return (
          <p
            key={block}
            className="text-[15px] leading-7 text-muted-foreground sm:text-base sm:leading-8"
          >
            {block}
          </p>
        );
      })}
    </div>
  );
}
