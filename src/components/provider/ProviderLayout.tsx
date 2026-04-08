import { Outlet, Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ProviderSidebar } from "./ProviderSidebar";
import { ProviderBottomNav } from "./ProviderBottomNav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useAvatar } from "@/contexts/AvatarContext";
import { DashboardHeaderSearch } from "@/components/search/DashboardHeaderSearch";
import { DashboardNotifications } from "@/components/dashboard/DashboardNotifications";
import { DashboardThemeToggle } from "@/components/dashboard/DashboardThemeToggle";

export default function ProviderLayout() {
  const { avatarUrl } = useAvatar();
  const kycStatus = localStorage.getItem("dwello_kyc_status");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-secondary/30 overflow-x-hidden">
        <div className="hidden md:block">
          <ProviderSidebar />
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <header className="h-14 sm:h-16 flex items-center border-b border-border/60 bg-background px-3 sm:px-6 gap-2 sm:gap-4 sticky top-0 z-10">
            <SidebarTrigger className="ml-0 hidden md:flex" />
            <DashboardHeaderSearch role="provider" placeholder="Search leads, listings, payouts..." />
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <DashboardThemeToggle />
              <DashboardNotifications role="provider" />
              <div className="h-8 w-px bg-border/60 hidden sm:block" />
              <Link to="/provider/settings" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                <Avatar className="h-8 w-8 border border-border/60">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover rounded-full" />
                  ) : (
                    <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">AJ</AvatarFallback>
                  )}
                </Avatar>
                <div className="hidden md:block">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium leading-none text-foreground">Provider</p>
                    {kycStatus === "submitted" ? (
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground">{kycStatus === "submitted" ? "Verified Agent" : "Unverified"}</p>
                </div>
              </Link>
            </div>
          </header>
          <main className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto p-3 pb-20 sm:p-6 md:pb-6">
            <Outlet />
          </main>
        </div>
        <ProviderBottomNav />
      </div>
    </SidebarProvider>
  );
}
