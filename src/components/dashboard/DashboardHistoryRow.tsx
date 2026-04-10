import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

import { DashboardRecordItem } from "@/components/dashboard/DashboardRecordItem";

type DashboardHistoryRowProps = {
  icon: LucideIcon;
  title: ReactNode;
  subtitle: ReactNode;
  badges?: ReactNode;
};

export function DashboardHistoryRow({
  icon: Icon,
  title,
  subtitle,
  badges,
}: DashboardHistoryRowProps) {
  return (
    <DashboardRecordItem
      leading={
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/5">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      }
      title={title}
      subtitle={subtitle}
      meta={badges}
    />
  );
}
