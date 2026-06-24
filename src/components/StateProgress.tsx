import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type ProgressStageState = "complete" | "current" | "upcoming" | "blocked";

export type ProgressStage = {
  label: string;
  description?: string;
  state: ProgressStageState;
};

type StateProgressProps = {
  stages: ProgressStage[];
  className?: string;
};

export function StateProgress({ stages, className }: StateProgressProps) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {stages.map((stage, index) => {
        const isComplete = stage.state === "complete";
        const isCurrent = stage.state === "current";
        const isBlocked = stage.state === "blocked";
        return (
          <div
            key={`${stage.label}-${index}`}
            className={cn(
              "rounded-xl border p-3 text-left transition-colors",
              isComplete && "border-emerald-500/25 bg-emerald-500/10",
              isCurrent && "border-primary/25 bg-primary/10",
              isBlocked && "border-amber-500/25 bg-amber-500/10",
              !isComplete && !isCurrent && !isBlocked && "border-border/60 bg-secondary/20",
            )}
          >
            <div className="flex items-start gap-2">
              <div
                className={cn(
                  "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold",
                  isComplete && "border-emerald-500/30 bg-emerald-500 text-white",
                  isCurrent && "border-primary/30 bg-primary text-primary-foreground",
                  isBlocked && "border-amber-500/30 bg-amber-500 text-white",
                  !isComplete && !isCurrent && !isBlocked && "border-border/60 bg-background text-muted-foreground",
                )}
              >
                {isComplete ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{stage.label}</p>
                {stage.description ? (
                  <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{stage.description}</p>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
