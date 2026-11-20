import { ArsenalPreview } from "@/components/home/ArsenalPreview";
import { KnowledgePreview } from "@/components/home/KnowledgePreview";
import { MemberStatusPanel } from "@/components/home/MemberStatusPanel";
import { PillarCard } from "@/components/home/PillarCard";
import { useMemberSession } from "@/hooks/useMemberSession";
import {
  useCategories,
  useKnowledgeList,
  useMyProgress,
} from "@/hooks/useQueries";
import { Crosshair, Radio, Settings2 } from "lucide-react";

const PILLARS = [
  {
    index: "01",
    title: "Preparação",
    meta: "Código 01 · Base",
    description:
      "Protocolos de preparação, sobrevivência e resposta a cenários hostis para manter a comunidade pronta.",
    to: "/central",
    icon: <Crosshair className="size-6" aria-hidden="true" />,
    ocid: "central.pillar.preparacao",
  },
  {
    index: "02",
    title: "Equipamentos",
    meta: "Código 02 · Arsenal",
    description:
      "Arsenal tático com lanternas, facas, binóculos e camisetas selecionadas para operações de campo.",
    to: "/arsenal",
    icon: <Settings2 className="size-6" aria-hidden="true" />,
    ocid: "central.pillar.equipamentos",
  },
  {
    index: "03",
    title: "Conhecimento",
    meta: "Código 03 · Biblioteca",
    description:
      "Fichas de checklists, validade, manutenção e técnicas de sobrevivência reunidas em um só lugar.",
    to: "/biblioteca",
    icon: <Radio className="size-6" aria-hidden="true" />,
    ocid: "central.pillar.conhecimento",
  },
] as const;

export default function CentralPage() {
  const { profile, isProfileLoading, progress } = useMemberSession();
  const categoriesQuery = useCategories();
  const knowledgeQuery = useKnowledgeList();
  const progressQuery = useMyProgress();

  const categories = categoriesQuery.data ?? [];
  const knowledge = knowledgeQuery.data ?? [];

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-muted/30">
        <div
          className="grid-overlay absolute inset-0 opacity-40"
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-16">
          <p className="label-tactical mb-3">{"// "}Central de Operações</p>
          <h1 className="max-w-3xl font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-foreground md:text-6xl">
            Central de{" "}
            <span className="text-primary text-glow-amber">Operações</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Painel de comando da comunidade Selvência. Acompanhe seu status,
            acesse o arsenal tático e consulte as fichas de conhecimento.
          </p>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
            <div className="grid gap-4 sm:grid-cols-3">
              {PILLARS.map((pillar) => (
                <PillarCard
                  key={pillar.index}
                  index={pillar.index}
                  title={pillar.title}
                  meta={pillar.meta}
                  description={pillar.description}
                  to={pillar.to}
                  icon={pillar.icon}
                  ocid={pillar.ocid}
                />
              ))}
            </div>
            <MemberStatusPanel
              profile={profile ?? null}
              isProfileLoading={isProfileLoading}
              arsenalCount={categories.length}
              knowledgeCount={knowledge.length}
              progress={progress}
              isProgressLoading={progressQuery.isLoading}
              isProgressError={progressQuery.isError}
            />
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-12 sm:px-6 md:py-16">
        <ArsenalPreview
          categories={categories}
          isLoading={categoriesQuery.isLoading}
        />
        <KnowledgePreview
          cards={knowledge}
          isLoading={knowledgeQuery.isLoading}
        />
      </div>
    </div>
  );
}
