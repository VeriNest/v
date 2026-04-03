import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart3, TrendingUp, Download, Calendar, DollarSign,
  Building2, Users, ArrowUpRight, ArrowDownRight, PieChart, FileText
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart as RPieChart, Pie, Cell, Legend
} from "recharts";

const revenueMonthly = [
  { month: "Aug", revenue: 22, commission: 1.1 },
  { month: "Sep", revenue: 28, commission: 1.4 },
  { month: "Oct", revenue: 35, commission: 1.75 },
  { month: "Nov", revenue: 31, commission: 1.55 },
  { month: "Dec", revenue: 42, commission: 2.1 },
  { month: "Jan", revenue: 38, commission: 1.9 },
  { month: "Feb", revenue: 45, commission: 2.25 },
  { month: "Mar", revenue: 52, commission: 2.6 },
];

const userGrowth = [
  { month: "Aug", seekers: 420, providers: 85 },
  { month: "Sep", seekers: 580, providers: 110 },
  { month: "Oct", seekers: 720, providers: 145 },
  { month: "Nov", seekers: 890, providers: 180 },
  { month: "Dec", seekers: 1050, providers: 210 },
  { month: "Jan", seekers: 1280, providers: 250 },
  { month: "Feb", seekers: 1520, providers: 295 },
  { month: "Mar", seekers: 1840, providers: 340 },
];

const propertyTypes = [
  { name: "Apartments", value: 45, color: "hsl(18, 55%, 58%)" },
  { name: "Duplexes", value: 20, color: "hsl(18, 55%, 72%)" },
  { name: "Studios", value: 18, color: "hsl(30, 30%, 65%)" },
  { name: "Penthouses", value: 10, color: "hsl(220, 15%, 70%)" },
  { name: "Others", value: 7, color: "hsl(220, 10%, 80%)" },
];

const topLocations = [
  { location: "Victoria Island", bookings: 842, revenue: "₦38.2M", growth: 15.3 },
  { location: "Lekki Phase 1", bookings: 634, revenue: "₦28.5M", growth: 22.1 },
  { location: "Ikoyi", bookings: 521, revenue: "₦31.8M", growth: 8.7 },
  { location: "Ikeja GRA", bookings: 398, revenue: "₦15.2M", growth: -3.2 },
  { location: "Banana Island", bookings: 187, revenue: "₦42.1M", growth: 31.5 },
];

const summaryStats = [
  { label: "Total Revenue", value: "₦293M", change: "+23.1%", up: true, icon: DollarSign, iconBg: "bg-emerald-50", accent: "text-emerald-600" },
  { label: "Total Bookings", value: "12,847", change: "+18.4%", up: true, icon: Building2, iconBg: "bg-primary/10", accent: "text-primary" },
  { label: "Active Users", value: "18,392", change: "+12.7%", up: true, icon: Users, iconBg: "bg-blue-50", accent: "text-blue-600" },
  { label: "Avg. Occupancy", value: "78.3%", change: "-2.1%", up: false, icon: PieChart, iconBg: "bg-amber-50", accent: "text-amber-600" },
];

export default function AdminReports() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Platform performance metrics and insights</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select defaultValue="6months">
            <SelectTrigger className="w-full sm:w-[150px] h-9 text-sm">
              <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-9 gap-1.5 text-sm">
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryStats.map((s) => (
          <Card key={s.label} className="border border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-start gap-3">
              <div className={`h-9 w-9 rounded-lg ${s.iconBg} flex items-center justify-center shrink-0`}>
                <s.icon className={`h-4 w-4 ${s.accent}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                <p className="text-xl font-bold text-foreground leading-tight">{s.value}</p>
                <p className={`text-[11px] font-medium mt-0.5 flex items-center gap-0.5 ${s.up ? "text-emerald-600" : "text-red-500"}`}>
                  {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {s.change} vs last period
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 h-auto flex-wrap">
          <TabsTrigger value="revenue" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5 px-4">
            <DollarSign className="h-3.5 w-3.5" /> Revenue
          </TabsTrigger>
          <TabsTrigger value="users" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5 px-4">
            <Users className="h-3.5 w-3.5" /> Users
          </TabsTrigger>
          <TabsTrigger value="properties" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5 px-4">
            <Building2 className="h-3.5 w-3.5" /> Properties
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 border border-border/60 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Revenue Trend</CardTitle>
                <p className="text-xs text-muted-foreground">Platform revenue & commission over time</p>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueMonthly} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(18, 55%, 58%)" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="hsl(18, 55%, 58%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 12%, 90%)" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(220, 10%, 50%)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: 'hsl(220, 10%, 50%)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${v}M`} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(30, 12%, 90%)', fontSize: '12px' }} />
                      <Area type="monotone" dataKey="revenue" stroke="hsl(18, 55%, 58%)" strokeWidth={2} fill="url(#revGrad)" name="Revenue (₦M)" />
                      <Area type="monotone" dataKey="commission" stroke="hsl(142, 40%, 48%)" strokeWidth={2} fill="none" name="Commission (₦M)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/60 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Top Locations</CardTitle>
                <p className="text-xs text-muted-foreground">Revenue by area</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {topLocations.map((loc) => (
                  <div key={loc.location} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/40 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-foreground">{loc.location}</p>
                      <p className="text-[11px] text-muted-foreground">{loc.bookings} bookings</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">{loc.revenue}</p>
                      <p className={`text-[11px] font-medium ${loc.growth > 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {loc.growth > 0 ? "+" : ""}{loc.growth}%
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">User Growth</CardTitle>
              <p className="text-xs text-muted-foreground">Seekers vs Providers registration trend</p>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userGrowth} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 12%, 90%)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(220, 10%, 50%)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(220, 10%, 50%)' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(30, 12%, 90%)', fontSize: '12px' }} />
                    <Legend />
                    <Bar dataKey="seekers" fill="hsl(18, 55%, 58%)" radius={[4, 4, 0, 0]} barSize={18} name="Seekers" />
                    <Bar dataKey="providers" fill="hsl(18, 55%, 42%)" radius={[4, 4, 0, 0]} barSize={18} name="Providers" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border border-border/60 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Property Types Distribution</CardTitle>
                <p className="text-xs text-muted-foreground">Breakdown by property category</p>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RPieChart>
                      <Pie data={propertyTypes} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                        {propertyTypes.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(30, 12%, 90%)', fontSize: '12px' }} formatter={(v: number) => [`${v}%`, '']} />
                      <Legend />
                    </RPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/60 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Listing Performance</CardTitle>
                <p className="text-xs text-muted-foreground">Key property metrics</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Average Days to First Booking", value: "4.2 days", bar: 72, color: "bg-primary" },
                  { label: "Average Listing Views", value: "324 views", bar: 65, color: "bg-primary" },
                  { label: "Booking Conversion Rate", value: "12.8%", bar: 52, color: "bg-emerald-500" },
                  { label: "Average Rating", value: "4.6 / 5.0", bar: 92, color: "bg-amber-500" },
                  { label: "Repeat Guest Rate", value: "34.2%", bar: 34, color: "bg-blue-500" },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">{m.label}</span>
                      <span className="font-semibold text-foreground">{m.value}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${m.color} rounded-full transition-all`} style={{ width: `${m.bar}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
