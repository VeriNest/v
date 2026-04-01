import { Outlet, Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ProviderSidebar } from "./ProviderSidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProviderLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <ProviderSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center border-b bg-background/80 backdrop-blur-sm px-6 gap-4 sticky top-0 z-10">
            <SidebarTrigger className="ml-0" />
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search leads, listings..." className="pl-9 bg-muted/50 border-0 focus-visible:bg-background" />
            </div>
            <div className="ml-auto flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
              </Button>
              <div className="h-6 w-px bg-border" />
              <Link to="/provider/settings" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer">
                <Avatar className="h-8 w-8 border-2 border-[hsl(263,70%,58%)]/20">
                  <AvatarFallback className="text-xs bg-[hsl(263,70%,58%)]/10 text-[hsl(263,70%,58%)] font-medium">
                    AJ
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium leading-none">Provider</p>
                  <p className="text-xs text-muted-foreground">Agent / Landlord</p>
                </div>
              </Link>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
