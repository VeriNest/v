import { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DashboardStatCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  change?: string;
  icon: LucideIcon;
  iconToneClassName?: string;
  className?: string;
};

export function DashboardStatCard({
  title,
  value,
  subtitle,
  change,
  icon: Icon,
  iconToneClassName,
  className,
}: DashboardStatCardProps) {
  return (
    <Card className={cn("border border-border/60 shadow-none", className)}>
      <CardContent className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8 text-primary",
              iconToneClassName,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          {change ? <span className="text-xs text-muted-foreground">{change}</span> : null}
        </div>
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">{value}</p>
        {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
      </CardContent>
    </Card>
  );
}
