import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

type DashboardSectionActionProps = {
  to?: string;
  children: ReactNode;
};

export function DashboardSectionAction({ to, children }: DashboardSectionActionProps) {
  if (to) {
    return (
      <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-primary" asChild>
        <Link to={to}>
          {children}
          <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-primary">
      {children}
      <ArrowRight className="ml-1 h-3 w-3" />
    </Button>
  );
}
