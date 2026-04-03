import { Outlet, Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SeekerSidebar } from "./SeekerSidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Search, ShieldCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAvatar } from "@/contexts/AvatarContext";

export default function SeekerLayout() {
  const { avatarUrl } = useAvatar();
  const kycStatus = localStorage.getItem("dwello_kyc_status");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-secondary/30 overflow-x-hidden">
        <SeekerSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 sm:h-16 flex items-center border-b border-border/60 bg-background px-3 sm:px-6 gap-2 sm:gap-4 sticky top-0 z-10">
            <SidebarTrigger className="ml-0" />
            <div className="relative flex-1 max-w-sm hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search properties, offers..." className="pl-9 h-9 bg-secondary/50 border-border/50 text-sm rounded-lg" />
            </div>
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg sm:hidden">
                <Search className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
              </Button>
              <div className="h-8 w-px bg-border/60 hidden sm:block" />
              <Link to="/seeker/settings" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                <Avatar className="h-8 w-8 border border-border/60">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover rounded-full" />
                  ) : (
                    <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">TN</AvatarFallback>
                  )}
                </Avatar>
                <div className="hidden md:block">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium leading-none text-foreground">Tenant</p>
                    {kycStatus === "submitted" ? (
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground">{kycStatus === "submitted" ? "Verified" : "Unverified"}</p>
                </div>
              </Link>
            </div>
          </header>
          <main className="flex-1 p-3 sm:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
