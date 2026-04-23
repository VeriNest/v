import { Home, FileText, Inbox, CalendarCheck, Bookmark, Settings, ChevronLeft, LogOut, LayoutDashboard, Wallet } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { authApi, getStoredSession } from "@/lib/api";

const mainItems = [
  { title: "Overview", url: "/seeker", icon: LayoutDashboard },
  { title: "Post a Need", url: "/seeker/post", icon: FileText },
  { title: "My Offers", url: "/seeker/offers", icon: Inbox },
  { title: "Bookings", url: "/seeker/bookings", icon: Wallet },
  { title: "Viewing Schedule", url: "/seeker/viewings", icon: CalendarCheck },
  { title: "Saved", url: "/seeker/saved", icon: Bookmark },
];

export function SeekerSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const session = getStoredSession();
      if (session?.refresh_token) {
        await authApi.logout(session.refresh_token);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Logout failed";
      toast.error(message);
    } finally {
      navigate("/login");
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="flex flex-col h-full">
        <div className={`h-16 flex items-center border-b border-border/60 shrink-0 ${collapsed ? "justify-center px-0" : "gap-2.5 px-4"}`}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <Home className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && <span className="text-lg font-semibold text-foreground tracking-tight">Verinest</span>}
        </div>

        <SidebarGroup className="pt-4 flex-1">
          {!collapsed && (
            <SidebarGroupLabel className="text-muted-foreground/60 text-[10px] uppercase tracking-[0.15em] font-medium px-4 mb-1">
              Tenant
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/seeker"}
                      className={`text-muted-foreground rounded-lg ${collapsed ? "justify-center px-0 mx-auto w-10 h-10" : "h-9 px-3"}`}
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className={`h-4 w-4 shrink-0 ${collapsed ? "mr-0" : "mr-2.5"}`} />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="border-t border-border/60 p-2 shrink-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Settings">
                <NavLink
                  to="/seeker/settings"
                  className={`text-muted-foreground rounded-lg ${collapsed ? "justify-center px-0 mx-auto w-10 h-10" : "h-9 px-3"}`}
                  activeClassName="bg-primary/10 text-primary font-medium"
                >
                  <Settings className={`h-4 w-4 shrink-0 ${collapsed ? "mr-0" : "mr-2.5"}`} />
                  {!collapsed && <span className="text-sm">Settings</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Back to Site">
                <NavLink
                  to="/"
                  className={`text-muted-foreground rounded-lg ${collapsed ? "justify-center px-0 mx-auto w-10 h-10" : "h-9 px-3"}`}
                >
                  <ChevronLeft className={`h-4 w-4 shrink-0 ${collapsed ? "mr-0" : "mr-2.5"}`} />
                  {!collapsed && <span className="text-sm">Back to Site</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Sign Out" onClick={handleLogout}>
                <LogOut className={`h-4 w-4 shrink-0 ${collapsed ? "mr-0" : "mr-2.5"}`} />
                {!collapsed && <span className="text-sm text-destructive/70">Sign Out</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
