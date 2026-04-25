import { Outlet, Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { AdminBottomNav } from "./AdminBottomNav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAvatar } from "@/contexts/AvatarContext";
import { DashboardHeaderSearch } from "@/components/search/DashboardHeaderSearch";
import { DashboardNotifications } from "@/components/dashboard/DashboardNotifications";
import { DashboardThemeToggle } from "@/components/dashboard/DashboardThemeToggle";
import { BackendLoadingIndicator } from "@/components/BackendLoadingIndicator";
import { useAuthAccess } from "@/hooks/use-auth-access";

export default function AdminLayout() {
  const { avatarUrl } = useAvatar();
  const { isChecking } = useAuthAccess("admin");

  if (isChecking) {
    return <BackendLoadingIndicator label="Checking access..." fullscreen />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-secondary/30 overflow-x-hidden">
        <div className="hidden md:block">
          <AdminSidebar />
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <header className="h-14 sm:h-16 flex items-center border-b border-border/60 bg-background px-3 sm:px-6 gap-2 sm:gap-4 sticky top-0 z-10">
            <SidebarTrigger className="ml-0 hidden md:flex" />
            <DashboardHeaderSearch role="admin" placeholder="Search users, KYC, reports, settings..." />
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/70 px-1.5 py-1">
              <DashboardThemeToggle />
              <DashboardNotifications role="admin" />
              </div>
              <div className="h-8 w-px bg-border/60 hidden sm:block" />
              <Link to="/admin/settings" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                <Avatar className="h-8 w-8 border border-border/60">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover rounded-full" />
                  ) : (
                    <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">AD</AvatarFallback>
                  )}
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium leading-none text-foreground">Admin</p>
                  <p className="text-[11px] text-muted-foreground">Super Admin</p>
                </div>
              </Link>
            </div>
          </header>
          <main className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto p-3 pb-20 sm:p-6 md:pb-6">
            <Outlet />
          </main>
        </div>
        <AdminBottomNav />
      </div>
    </SidebarProvider>
  );
}
