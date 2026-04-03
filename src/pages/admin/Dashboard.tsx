import {
  Building2, Users, CreditCard, AlertTriangle,
  ArrowUpRight, ArrowRight,
  Activity, Eye, Clock, Plus, MoreHorizontal, CalendarDays
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 18, users: 12 },
  { month: "Feb", revenue: 22, users: 15 },
  { month: "Mar", revenue: 28, users: 18 },
  { month: "Apr", revenue: 32, users: 22 },
  { month: "May", revenue: 38, users: 28 },
  { month: "Jun", revenue: 45, users: 32 },
  { month: "Jul", revenue: 42, users: 35 },
];

const propertyData = [
  { day: "Mon", listed: 12, sold: 8 },
  { day: "Tue", listed: 18, sold: 12 },
  { day: "Wed", listed: 15, sold: 10 },
  { day: "Thu", listed: 22, sold: 16 },
  { day: "Fri", listed: 28, sold: 20 },
  { day: "Sat", listed: 20, sold: 14 },
  { day: "Sun", listed: 10, sold: 6 },
];

const stats = [
  { title: "Total Properties", value: "2,847", change: "142 new this month", icon: Building2, subtitle: "Across all listings" },
  { title: "Active Users", value: "18,392", change: "1,247 online now", icon: Users, subtitle: "Registered accounts" },
  { title: "Monthly Revenue", value: "₦45.2M", change: "+23.1% vs last month", icon: CreditCard, subtitle: "Platform earnings" },
  { title: "Open Disputes", value: "24", change: "6 resolved today", icon: AlertTriangle, subtitle: "Pending resolution" },
];

const recentActivity = [
  { id: 1, action: "New property listed", user: "Adebayo Johnson", time: "2m", avatar: "AJ", type: "property" },
  { id: 2, action: "KYC verification submitted", user: "Chioma Okafor", time: "15m", avatar: "CO", type: "user" },
  { id: 3, action: "Payment of ₦2.5M completed", user: "Emeka Nwankwo", time: "32m", avatar: "EN", type: "payment" },
  { id: 4, action: "Dispute opened — rent issue", user: "Fatima Abdullahi", time: "1h", avatar: "FA", type: "dispute" },
  { id: 5, action: "Property approved & published", user: "Admin", time: "2h", avatar: "AD", type: "property" },
];

const typeStyles: Record<string, string> = {
  property: "bg-primary/10 text-primary",
  user: "bg-primary/10 text-primary",
  payment: "bg-emerald-500/10 text-emerald-600",
  dispute: "bg-destructive/10 text-destructive",
};

const quickActions = [
  { label: "Add Property", icon: Building2, to: "/admin/properties" },
  { label: "Manage Users", icon: Users, to: "/admin/users" },
  { label: "View Reports", icon: Activity, to: "/admin/reports" },
  { label: "Schedule", icon: CalendarDays, to: "/admin/announcements" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Welcome back, Admin</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Here's your platform overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-2 text-sm">
            <CalendarDays className="h-4 w-4" /> Last 30 days
          </Button>
          <Button size="sm" className="h-9 gap-2 text-sm" asChild>
            <Link to="/admin/properties"><Plus className="h-4 w-4" /> Add Property</Link>
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border border-border/60 shadow-none hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-primary/8 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border border-border/60 shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Monthly revenue & user growth</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(18, 55%, 58%)" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="hsl(18, 55%, 58%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 12%, 90%)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(220, 10%, 50%)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'hsl(220, 10%, 50%)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${v}M`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(30, 12%, 90%)', fontSize: '12px' }}
                    formatter={(value: number) => [`₦${value}M`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(18, 55%, 58%)" strokeWidth={2} fill="url(#revenueGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Property Activity</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Listed vs Sold this week</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={propertyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 12%, 90%)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(220, 10%, 50%)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(220, 10%, 50%)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(30, 12%, 90%)', fontSize: '12px' }} />
                  <Bar dataKey="listed" fill="hsl(18, 55%, 58%)" radius={[4, 4, 0, 0]} barSize={14} opacity={0.8} />
                  <Bar dataKey="sold" fill="hsl(18, 55%, 42%)" radius={[4, 4, 0, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: Activity + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border border-border/60 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
                <Badge variant="outline" className="text-[10px] h-5 gap-1 font-normal">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </Badge>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-primary h-8">
                View All <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group">
                  <Avatar className="h-9 w-9 border border-border/60">
                    <AvatarFallback className={`text-[10px] font-medium ${typeStyles[item.type]}`}>
                      {item.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.action}</p>
                    <p className="text-xs text-muted-foreground">by {item.user}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-all duration-150 text-left group"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                  <action.icon className="h-4.5 w-4.5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{action.label}</span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}

            <div className="mt-4 p-4 rounded-xl bg-accent/50 border border-border/40">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Platform Health</span>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] h-5">Healthy</Badge>
              </div>
              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Server uptime</span>
                    <span className="font-medium text-foreground">99.98%</span>
                  </div>
                  <div className="h-1.5 bg-border/60 rounded-full overflow-hidden">
                    <div className="h-full w-[99.98%] bg-emerald-500 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">API response</span>
                    <span className="font-medium text-foreground">124ms</span>
                  </div>
                  <div className="h-1.5 bg-border/60 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-primary rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
