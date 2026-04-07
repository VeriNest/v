import { Home, LayoutDashboard, Building2, DoorOpen, Wallet, Landmark, Wrench, Calendar, Settings, ChevronLeft, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
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

const mainItems = [
  { title: "Overview", url: "/landlord", icon: LayoutDashboard },
  { title: "Properties", url: "/landlord/properties", icon: Building2 },
  { title: "Units", url: "/landlord/units", icon: DoorOpen },
  { title: "Collections", url: "/landlord/collections", icon: Wallet },
  { title: "Payouts", url: "/landlord/payouts", icon: Landmark },
  { title: "Maintenance", url: "/landlord/maintenance", icon: Wrench },
  { title: "Calendar", url: "/landlord/calendar", icon: Calendar },
];

export function LandlordSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="flex flex-col h-full">
        <div className={`h-16 flex items-center border-b border-border/60 shrink-0 ${collapsed ? "justify-center px-0" : "gap-2.5 px-4"}`}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <Home className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && <span className="text-lg font-semibold text-foreground tracking-tight">Dwello</span>}
        </div>

        <SidebarGroup className="pt-4 flex-1">
          {!collapsed && (
            <SidebarGroupLabel className="text-muted-foreground/60 text-[10px] uppercase tracking-[0.15em] font-medium px-4 mb-1">
              Landlord
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/landlord"}
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
                  to="/landlord/settings"
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
              <SidebarMenuButton asChild tooltip="Sign Out">
                <NavLink
                  to="/login"
                  className={`text-destructive/70 rounded-lg ${collapsed ? "justify-center px-0 mx-auto w-10 h-10" : "h-9 px-3"}`}
                >
                  <LogOut className={`h-4 w-4 shrink-0 ${collapsed ? "mr-0" : "mr-2.5"}`} />
                  {!collapsed && <span className="text-sm">Sign Out</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
