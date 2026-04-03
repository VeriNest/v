import { Home, FileText, Inbox, CalendarCheck, Bookmark, Settings, ChevronLeft, LogOut, LayoutDashboard } from "lucide-react";
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
  { title: "Overview", url: "/seeker", icon: LayoutDashboard },
  { title: "Post a Need", url: "/seeker/post", icon: FileText },
  { title: "My Offers", url: "/seeker/offers", icon: Inbox },
  { title: "Bookings", url: "/seeker/bookings", icon: CalendarCheck },
  { title: "Saved", url: "/seeker/saved", icon: Bookmark },
];

export function SeekerSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60">
      <SidebarContent className="bg-background">
        <div className="h-16 flex items-center gap-2.5 px-4 border-b border-border/60">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <Home className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && <span className="text-lg font-semibold text-foreground tracking-tight">Dwello</span>}
        </div>

        <SidebarGroup className="pt-4">
          <SidebarGroupLabel className="text-muted-foreground/60 text-[10px] uppercase tracking-[0.15em] font-medium px-4 mb-1">
            {!collapsed && "Tenant"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2 space-y-0.5">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/seeker"}
                      className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-150 h-9 px-3"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="mr-2.5 h-4 w-4 shrink-0" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto border-t border-border/60 p-2 space-y-0.5">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink to="/seeker/settings" className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-150 h-9 px-3" activeClassName="bg-primary/10 text-primary font-medium">
                  <Settings className="mr-2.5 h-4 w-4 shrink-0" />
                  {!collapsed && <span className="text-sm">Settings</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink to="/" className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-150 h-9 px-3">
                  <ChevronLeft className="mr-2.5 h-4 w-4 shrink-0" />
                  {!collapsed && <span className="text-sm">Back to Site</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink to="/login" className="text-destructive/70 hover:text-destructive hover:bg-destructive/5 rounded-lg transition-all duration-150 h-9 px-3">
                  <LogOut className="mr-2.5 h-4 w-4 shrink-0" />
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
