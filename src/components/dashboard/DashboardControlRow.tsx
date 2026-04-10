import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type DashboardControlRowProps = {
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
};

export function DashboardControlRow({ left, right, className }: DashboardControlRowProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      <div className="min-w-0">{left}</div>
      <div className="flex w-full items-center gap-2 lg:w-auto">{right}</div>
    </div>
  );
}
