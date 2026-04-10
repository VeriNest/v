import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type DashboardRecordItemProps = {
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  meta?: ReactNode;
  className?: string;
};

export function DashboardRecordItem({
  leading,
  title,
  subtitle,
  trailing,
  meta,
  className,
}: DashboardRecordItemProps) {
  return (
    <div className={cn("rounded-xl border border-border/60 bg-background/40 p-3", className)}>
      <div className="flex items-start gap-3">
        {leading ? <div className="shrink-0">{leading}</div> : null}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-foreground">{title}</div>
              {subtitle ? <div className="mt-1 text-xs text-muted-foreground">{subtitle}</div> : null}
            </div>
            {trailing ? <div className="shrink-0">{trailing}</div> : null}
          </div>
          {meta ? <div className="mt-3">{meta}</div> : null}
        </div>
      </div>
    </div>
  );
}
