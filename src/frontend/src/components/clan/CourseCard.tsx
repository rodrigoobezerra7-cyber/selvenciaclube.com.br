import { planLabel } from "@/types";
import type { Course, Training } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  ChevronDown,
  Clock,
  FileText,
  Lock,
  ShieldCheck,
} from "lucide-react";

type CourseCardProps = {
  course: Course;
  index: number;
  /** Rank of the member's current plan. */
  memberRank: bigint;
  /** Plan name required by this course, resolved from the plan catalog. */
  requiredPlanName: string;
  isOpen: boolean;
  onToggle: () => void;
};

function PlanBadge({
  requiredPlanName,
  unlocked,
}: {
  requiredPlanName: string;
  unlocked: boolean;
}) {
  return (
    <span
      className={
        unlocked
          ? "inline-flex items-center gap-1.5 border border-success/40 bg-success/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-success"
          : "inline-flex items-center gap-1.5 border border-primary/40 bg-primary/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-primary"
      }
    >
      {unlocked ? (
        <ShieldCheck className="size-3" aria-hidden="true" />
      ) : (
        <Lock className="size-3" aria-hidden="true" />
      )}
      {unlocked ? "Liberado" : `Requer ${requiredPlanName}`}
    </span>
  );
}

function UpgradePath({ requiredPlanName }: { requiredPlanName: string }) {
  return (
    <div className="mt-4 flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Este curso exige o plano{" "}
        <span className="font-semibold text-foreground">
          {requiredPlanName}
        </span>{" "}
        ou superior.
      </p>
      <Link
        to="/cla"
        data-ocid="clan.course.upgrade_link"
        className="inline-flex shrink-0 items-center justify-center border border-primary bg-primary px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-smooth hover:bg-primary/90"
      >
        Assinar ou mudar de plano
      </Link>
    </div>
  );
}

export function CourseCard({
  course,
  index,
  memberRank,
  requiredPlanName,
  isOpen,
  onToggle,
}: CourseCardProps) {
  const unlocked = memberRank >= course.minPlanRank;
  const totalMinutes = course.lessons.reduce(
    (sum, lesson) => sum + Number(lesson.durationMinutes),
    0,
  );

  return (
    <article
      data-ocid={`clan.course.${index + 1}`}
      className="corner-brackets flex animate-fade-in flex-col border border-border bg-card transition-smooth hover:border-primary/60"
      style={{ animationDelay: `${Math.min(index, 8) * 80}ms` }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-2.5">
        <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <BookOpen className="size-3.5" aria-hidden="true" />
          Curso
        </span>
        <PlanBadge requiredPlanName={requiredPlanName} unlocked={unlocked} />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold uppercase leading-tight tracking-tight text-foreground">
          {course.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {course.summary}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="size-3.5" aria-hidden="true" />
            {course.lessons.length} aulas
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden="true" />
            {totalMinutes} min
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FileText className="size-3.5" aria-hidden="true" />
            {course.materials.length} materiais
          </span>
        </div>

        {unlocked ? (
          <>
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={isOpen}
              aria-controls={`course-content-${course.id.toString()}`}
              data-ocid={`clan.course.open_button.${index + 1}`}
              className="mt-5 inline-flex items-center justify-between gap-2 border border-border px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground transition-smooth hover:border-primary hover:text-primary"
            >
              {isOpen ? "Recolher conteúdo" : "Abrir curso"}
              <ChevronDown
                className={
                  isOpen
                    ? "size-4 rotate-180 transition-transform"
                    : "size-4 transition-transform"
                }
                aria-hidden="true"
              />
            </button>

            {isOpen ? (
              <div
                id={`course-content-${course.id.toString()}`}
                data-ocid={`clan.course.content.${index + 1}`}
                className="mt-5 space-y-6 border-t border-border/70 pt-5"
              >
                <div>
                  <p className="label-tactical mb-3">Aulas</p>
                  <ol className="space-y-3">
                    {course.lessons.map((lesson, lessonIndex) => (
                      <li
                        key={lesson.title}
                        className="flex gap-3 border-l-2 border-primary/50 pl-3"
                      >
                        <span className="font-mono text-[11px] font-semibold text-primary">
                          {String(lessonIndex + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground">
                            {lesson.title}
                          </p>
                          <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                            {lesson.summary}
                          </p>
                          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                            {Number(lesson.durationMinutes)} min
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                {course.materials.length > 0 ? (
                  <div>
                    <p className="label-tactical mb-3">Materiais</p>
                    <ul className="flex flex-wrap gap-2">
                      {course.materials.map((material) => (
                        <li
                          key={material}
                          className="inline-flex items-center gap-1.5 border border-border bg-muted/40 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
                        >
                          <FileText className="size-3" aria-hidden="true" />
                          {material}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}
          </>
        ) : (
          <UpgradePath requiredPlanName={requiredPlanName} />
        )}
      </div>
    </article>
  );
}

type TrainingCardProps = {
  training: Training;
  index: number;
  memberRank: bigint;
  requiredPlanName: string;
  isOpen: boolean;
  onToggle: () => void;
};

export function TrainingCard({
  training,
  index,
  memberRank,
  requiredPlanName,
  isOpen,
  onToggle,
}: TrainingCardProps) {
  const unlocked = memberRank >= training.minPlanRank;

  return (
    <article
      data-ocid={`clan.training.${index + 1}`}
      className="corner-brackets flex animate-fade-in flex-col border border-border bg-card transition-smooth hover:border-primary/60"
      style={{ animationDelay: `${Math.min(index, 8) * 80}ms` }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-2.5">
        <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          Treinamento
        </span>
        <PlanBadge requiredPlanName={requiredPlanName} unlocked={unlocked} />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold uppercase leading-tight tracking-tight text-foreground">
          {training.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {training.summary}
        </p>

        {unlocked ? (
          <>
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={isOpen}
              aria-controls={`training-content-${training.id.toString()}`}
              data-ocid={`clan.training.open_button.${index + 1}`}
              className="mt-5 inline-flex items-center justify-between gap-2 border border-border px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground transition-smooth hover:border-primary hover:text-primary"
            >
              {isOpen ? "Recolher conteúdo" : "Abrir treinamento"}
              <ChevronDown
                className={
                  isOpen
                    ? "size-4 rotate-180 transition-transform"
                    : "size-4 transition-transform"
                }
                aria-hidden="true"
              />
            </button>

            {isOpen ? (
              <div
                id={`training-content-${training.id.toString()}`}
                data-ocid={`clan.training.content.${index + 1}`}
                className="mt-5 space-y-4 border-t border-border/70 pt-5"
              >
                {training.content
                  .split(/\n{2,}/)
                  .map((block) => block.trim())
                  .filter((block) => block.length > 0)
                  .map((block) => (
                    <p
                      key={block}
                      className="text-[15px] leading-7 text-muted-foreground"
                    >
                      {block}
                    </p>
                  ))}
              </div>
            ) : null}
          </>
        ) : (
          <UpgradePath requiredPlanName={requiredPlanName} />
        )}
      </div>
    </article>
  );
}

export function planNameForRank(
  rank: bigint,
  plans: { rank: bigint; name: string }[],
): string {
  const match = plans.find((plan) => plan.rank === rank);
  return match ? planLabel(match.name) : `Nível ${rank.toString()}`;
}
