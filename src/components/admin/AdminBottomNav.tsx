import { LayoutDashboard, Building2, Users, CreditCard, Settings, MoreHorizontal } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, ShieldCheck, BarChart3, Megaphone, ChevronLeft, LogOut } from "lucide-react";

const primaryTabs = [
  { icon: LayoutDashboard, label: "Home", to: "/admin", end: true },
  { icon: Building2, label: "Properties", to: "/admin/properties" },
  { icon: Users, label: "Users", to: "/admin/users" },
  { icon: CreditCard, label: "Payments", to: "/admin/transactions" },
];

const moreTabs = [
  { icon: AlertTriangle, label: "Disputes", to: "/admin/disputes" },
  { icon: ShieldCheck, label: "Verifications", to: "/admin/verifications" },
  { icon: BarChart3, label: "Reports", to: "/admin/reports" },
  { icon: Megaphone, label: "Announcements", to: "/admin/announcements" },
  { icon: Settings, label: "Settings", to: "/admin/settings" },
  { icon: ChevronLeft, label: "Back to Site", to: "/" },
  { icon: LogOut, label: "Sign Out", to: "/login" },
];

export function AdminBottomNav() {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      {/* More menu overlay */}
      {showMore && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={() => setShowMore(false)}>
          <div
            className="absolute bottom-[calc(3.5rem+env(safe-area-inset-bottom))] left-2 right-2 bg-background border border-border/60 rounded-2xl shadow-lg p-2 animate-in slide-in-from-bottom-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-3 gap-1">
              {moreTabs.map((tab) => (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={false}
                  className={cn(
                    "flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-muted-foreground transition-colors",
                    tab.label === "Sign Out" && "text-destructive/70"
                  )}
                  activeClassName="text-primary bg-primary/10"
                  onClick={() => setShowMore(false)}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium leading-none">{tab.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background border-t border-border/60 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-14">
          {primaryTabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-muted-foreground transition-colors"
              activeClassName="text-primary"
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium leading-none">{tab.label}</span>
            </NavLink>
          ))}
          <button
            onClick={() => setShowMore(!showMore)}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors",
              showMore ? "text-primary" : "text-muted-foreground"
            )}
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-[10px] font-medium leading-none">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
