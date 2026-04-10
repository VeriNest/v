import { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DashboardSettingsSectionProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

type DashboardSettingsRowProps = {
  label: string;
  description?: string;
  control?: ReactNode;
  className?: string;
};

export function DashboardSettingsSection({
  title,
  description,
  actions,
  children,
  className,
}: DashboardSettingsSectionProps) {
  return (
    <Card className={cn("border border-border/60 shadow-sm", className)}>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-0 p-0">{children}</CardContent>
    </Card>
  );
}

export function DashboardSettingsRow({
  label,
  description,
  control,
  className,
}: DashboardSettingsRowProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-border/60 px-6 py-4 first:border-t-0 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description ? <p className="text-xs leading-5 text-muted-foreground">{description}</p> : null}
      </div>
      {control ? <div className="shrink-0">{control}</div> : null}
    </div>
  );
}
