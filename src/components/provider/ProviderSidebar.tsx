import { Home, Inbox, Building2, CreditCard, Calendar, LogOut } from "lucide-react";
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

const items = [
  { title: "Dashboard", url: "/provider", icon: Home },
  { title: "Lead Inbox", url: "/provider/inbox", icon: Inbox },
  { title: "My Listings", url: "/provider/listings", icon: Building2 },
  { title: "Payouts", url: "/provider/payouts", icon: CreditCard },
  { title: "Calendar", url: "/provider/calendar", icon: Calendar },
  { title: "Settings", url: "/provider/settings", icon: Settings },
];

export function ProviderSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="bg-[hsl(256,60%,10%)] text-white">
        <div className="p-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <Home className="w-4 h-4 text-white" />
          </div>
          {!collapsed && <span className="text-lg font-bold">Dwello</span>}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-white/50 text-xs uppercase tracking-wider">
            {!collapsed && "Provider"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/provider"}
                      className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      activeClassName="bg-primary text-white font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 space-y-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink to="/" className="text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <Home className="mr-2 h-4 w-4 shrink-0" />
                  {!collapsed && <span>Back to Site</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink to="/login" className="text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                  <LogOut className="mr-2 h-4 w-4 shrink-0" />
                  {!collapsed && <span>Sign Out</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
