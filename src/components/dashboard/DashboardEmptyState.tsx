import { ReactNode } from "react";
import { LucideIcon, Search } from "lucide-react";

import { cn } from "@/lib/utils";

type DashboardEmptyStateProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
};

export function DashboardEmptyState({
  title,
  description,
  icon: Icon = Search,
  action,
  className,
}: DashboardEmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-border/70 bg-muted/10 px-4 py-8 text-center",
        className,
      )}
    >
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-muted/40 text-muted-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}
