import { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type DashboardStatusTone = "neutral" | "info" | "success" | "warning" | "danger";

const toneClasses: Record<DashboardStatusTone, string> = {
  neutral: "border-border/70 bg-muted/50 text-foreground/80 dark:bg-muted/30 dark:text-foreground/80",
  info: "border-primary/20 bg-primary/10 text-primary dark:border-primary/30 dark:bg-primary/15 dark:text-primary-foreground/90",
  success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300",
  warning: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300",
  danger: "border-destructive/20 bg-destructive/10 text-destructive dark:border-destructive/30 dark:bg-destructive/15 dark:text-red-300",
};

type DashboardStatusBadgeProps = {
  children: ReactNode;
  tone?: DashboardStatusTone;
  dot?: boolean;
  className?: string;
};

export function DashboardStatusBadge({
  children,
  tone = "neutral",
  dot = false,
  className,
}: DashboardStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex h-auto min-h-5 shrink-0 items-center gap-1 whitespace-nowrap px-2 py-0.5 text-[10px] font-medium",
        toneClasses[tone],
        className,
      )}
    >
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" /> : null}
      {children}
    </Badge>
  );
}
