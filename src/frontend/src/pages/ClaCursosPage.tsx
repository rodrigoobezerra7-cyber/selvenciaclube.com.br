import {
  CourseCard,
  TrainingCard,
  planNameForRank,
} from "@/components/clan/CourseCard";
import { useMemberSession } from "@/hooks/useMemberSession";
import { useCourses, usePlans, useTrainings } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  BookOpen,
  GraduationCap,
  RotateCw,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

const SKELETON_IDS = Array.from(
  { length: 3 },
  (_, i) => `course-skeleton-${i}`,
);

function CoursesSkeleton() {
  return (
    <div
      data-ocid="clan.courses.loading_state"
      className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
    >
      {SKELETON_IDS.map((id) => (
        <div
          key={id}
          className="flex flex-col gap-4 border border-border bg-card p-5"
        >
          <div className="h-4 w-24 animate-pulse bg-muted" />
          <div className="h-6 w-3/4 animate-pulse bg-muted" />
          <div className="h-3 w-full animate-pulse bg-muted" />
          <div className="h-3 w-5/6 animate-pulse bg-muted" />
          <div className="mt-4 h-10 w-full animate-pulse bg-muted" />
        </div>
      ))}
    </div>
  );
}

export default function ClaCursosPage() {
  const { planRank } = useMemberSession();
  const coursesQuery = useCourses();
  const trainingsQuery = useTrainings();
  const plansQuery = usePlans();

  const [openCourseId, setOpenCourseId] = useState<string | null>(null);
  const [openTrainingId, setOpenTrainingId] = useState<string | null>(null);

  const courses = coursesQuery.data ?? [];
  const trainings = trainingsQuery.data ?? [];
  const plans = plansQuery.data ?? [];

  const isLoading =
    coursesQuery.isLoading || trainingsQuery.isLoading || plansQuery.isLoading;
  const isError =
    coursesQuery.isError || trainingsQuery.isError || plansQuery.isError;

  const unlockedCourses = courses.filter(
    (course) => planRank >= course.minPlanRank,
  ).length;
  const unlockedTrainings = trainings.filter(
    (training) => planRank >= training.minPlanRank,
  ).length;

  const retry = () => {
    void coursesQuery.refetch();
    void trainingsQuery.refetch();
    void plansQuery.refetch();
  };

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-muted/30">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid-overlay opacity-40"
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-16">
          <p className="label-tactical mb-3">{"// "}Clã Selvência · Cursos</p>
          <h1 className="font-display text-3xl font-bold uppercase leading-[0.95] tracking-tight text-foreground md:text-5xl">
            Cursos e{" "}
            <span className="text-primary text-glow-amber">Treinamentos</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Formação tática do Clã. Aulas guiadas, materiais de apoio e
            treinamentos de campo para manter o membro pronto em qualquer
            cenário.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="inline-block size-1.5 animate-pulse-dot rounded-full bg-primary"
              />
              Trilha ativa
            </span>
            <span>{courses.length} cursos</span>
            <span>{trainings.length} treinamentos</span>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:py-14">
        {isLoading ? (
          <CoursesSkeleton />
        ) : isError ? (
          <div
            data-ocid="clan.courses.error_state"
            className="flex flex-col items-start gap-4 border border-destructive/50 bg-destructive/10 p-8"
          >
            <div className="flex items-center gap-3 text-destructive">
              <AlertTriangle className="size-5" aria-hidden="true" />
              <p className="font-display text-lg font-bold uppercase tracking-tight">
                Falha ao carregar a trilha
              </p>
            </div>
            <p className="max-w-xl text-sm text-muted-foreground">
              Não foi possível carregar os cursos e treinamentos do Clã.
              Verifique a conexão e tente novamente.
            </p>
            <button
              type="button"
              onClick={retry}
              data-ocid="clan.courses.retry_button"
              className="inline-flex items-center gap-2 border border-primary bg-primary px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90"
            >
              <RotateCw className="size-3.5" aria-hidden="true" />
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className="space-y-14">
            <section aria-labelledby="cursos-heading">
              <div className="mb-6 flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="label-tactical mb-2">Formação base</p>
                  <h2
                    id="cursos-heading"
                    className="flex items-center gap-2 font-display text-xl font-bold uppercase tracking-tight text-foreground md:text-2xl"
                  >
                    <BookOpen
                      className="size-5 text-primary"
                      aria-hidden="true"
                    />
                    Cursos do Clã
                  </h2>
                </div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {unlockedCourses}/{courses.length} liberados
                </p>
              </div>

              {courses.length === 0 ? (
                <div
                  data-ocid="clan.courses.empty_state"
                  className="flex flex-col items-center gap-4 border border-dashed border-border bg-card px-6 py-14 text-center"
                >
                  <span className="inline-flex size-14 items-center justify-center border border-border bg-muted text-muted-foreground">
                    <BookOpen className="size-6" aria-hidden="true" />
                  </span>
                  <div className="space-y-2">
                    <p className="font-display text-lg font-bold uppercase tracking-tight text-foreground">
                      Nenhum curso disponível
                    </p>
                    <p className="mx-auto max-w-md text-sm text-muted-foreground">
                      A trilha de cursos do Clã está sendo preparada. Volte em
                      breve para acompanhar as novas aulas.
                    </p>
                  </div>
                  <Link
                    to="/cla"
                    data-ocid="clan.courses.empty_state.button"
                    className="border border-primary bg-primary px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90"
                  >
                    Conhecer o Clã Selvência
                  </Link>
                </div>
              ) : (
                <div
                  data-ocid="clan.courses.list"
                  className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
                >
                  {courses.map((course, index) => (
                    <CourseCard
                      key={course.id.toString()}
                      course={course}
                      index={index}
                      memberRank={planRank}
                      requiredPlanName={planNameForRank(
                        course.minPlanRank,
                        plans,
                      )}
                      isOpen={openCourseId === course.id.toString()}
                      onToggle={() =>
                        setOpenCourseId((current) =>
                          current === course.id.toString()
                            ? null
                            : course.id.toString(),
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </section>

            <section aria-labelledby="treinamentos-heading">
              <div className="mb-6 flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="label-tactical mb-2">Campo avançado</p>
                  <h2
                    id="treinamentos-heading"
                    className="flex items-center gap-2 font-display text-xl font-bold uppercase tracking-tight text-foreground md:text-2xl"
                  >
                    <GraduationCap
                      className="size-5 text-primary"
                      aria-hidden="true"
                    />
                    Treinamentos avançados
                  </h2>
                </div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {unlockedTrainings}/{trainings.length} liberados
                </p>
              </div>

              {trainings.length === 0 ? (
                <div
                  data-ocid="clan.trainings.empty_state"
                  className="flex flex-col items-center gap-4 border border-dashed border-border bg-card px-6 py-14 text-center"
                >
                  <span className="inline-flex size-14 items-center justify-center border border-border bg-muted text-muted-foreground">
                    <ShieldCheck className="size-6" aria-hidden="true" />
                  </span>
                  <div className="space-y-2">
                    <p className="font-display text-lg font-bold uppercase tracking-tight text-foreground">
                      Nenhum treinamento disponível
                    </p>
                    <p className="mx-auto max-w-md text-sm text-muted-foreground">
                      Os treinamentos avançados do Clã estão em preparação.
                      Consulte os cursos enquanto isso.
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  data-ocid="clan.trainings.list"
                  className="grid grid-cols-1 gap-6 md:grid-cols-2"
                >
                  {trainings.map((training, index) => (
                    <TrainingCard
                      key={training.id.toString()}
                      training={training}
                      index={index}
                      memberRank={planRank}
                      requiredPlanName={planNameForRank(
                        training.minPlanRank,
                        plans,
                      )}
                      isOpen={openTrainingId === training.id.toString()}
                      onToggle={() =>
                        setOpenTrainingId((current) =>
                          current === training.id.toString()
                            ? null
                            : training.id.toString(),
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </section>

            <div className="flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Quer liberar toda a trilha?
              </p>
              <Link
                to="/cla"
                data-ocid="clan.courses.plan_link"
                className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary transition-smooth hover:text-accent"
              >
                Ver planos do Clã Selvência →
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
