import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CognitiveSkill } from "@/app/(root)/profile/profile-utils";

export interface CognitiveMatrixProps {
  skills: CognitiveSkill[];
  className?: string;
}

export function CognitiveMatrix({ skills, className }: CognitiveMatrixProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-card p-4 sm:p-5 shadow-2xs",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary shrink-0" />
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Cognitive Competencies
          </h2>
        </div>
        <span className="text-[11px] font-medium text-muted-foreground">
          6 Aptitude Domains
        </span>
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Core cognitive attributes measured in campus recruitment games.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="rounded-lg border border-border/40 bg-muted/20 p-3 transition-colors hover:border-border/70"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">{skill.name}</span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
                  skill.level === "Advanced" &&
                    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
                  skill.level === "Proficient" &&
                    "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
                  skill.level === "Developing" &&
                    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    skill.level === "Advanced" && "bg-emerald-500",
                    skill.level === "Proficient" && "bg-blue-500",
                    skill.level === "Developing" && "bg-amber-500"
                  )}
                />
                {skill.level}
              </span>
            </div>

            <div className="mt-2 flex items-baseline justify-between text-xs">
              <span className="text-[11px] text-muted-foreground">{skill.category}</span>
              <span className="font-semibold tabular-nums text-foreground">{skill.score}%</span>
            </div>

            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted/70">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  skill.level === "Advanced" && "bg-emerald-500",
                  skill.level === "Proficient" && "bg-blue-500",
                  skill.level === "Developing" && "bg-amber-500"
                )}
                style={{ width: `${skill.score}%` }}
              />
            </div>

            <div className="mt-2 text-[10px] text-muted-foreground/80 truncate">
              Evaluated by: {skill.gamesAssociated.slice(0, 2).join(", ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

