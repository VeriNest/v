import { Building2, Users, CreditCard, AlertTriangle, TrendingUp, TrendingDown, ArrowUpRight, Activity, Eye, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const stats = [
  {
    title: "Total Properties",
    value: "2,847",
    trend: "+12.5%",
    up: true,
    icon: Building2,
    color: "from-[hsl(263,70%,58%)] to-[hsl(263,70%,45%)]",
    iconBg: "bg-[hsl(263,70%,58%)]/10",
    iconColor: "text-[hsl(263,70%,58%)]",
    progress: 72,
  },
  {
    title: "Active Users",
    value: "18,392",
    trend: "+8.2%",
    up: true,
    icon: Users,
    color: "from-blue-500 to-blue-600",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    progress: 85,
  },
  {
    title: "Monthly Revenue",
    value: "₦45.2M",
    trend: "+23.1%",
    up: true,
    icon: CreditCard,
    color: "from-emerald-500 to-emerald-600",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    progress: 64,
  },
  {
    title: "Open Disputes",
    value: "24",
    trend: "-5.4%",
    up: false,
    icon: AlertTriangle,
    color: "from-amber-500 to-orange-500",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    progress: 18,
  },
];

const recentActivity = [
  { id: 1, action: "New property listed", user: "Adebayo Johnson", time: "2 min ago", type: "property", initials: "AJ" },
  { id: 2, action: "KYC verification submitted", user: "Chioma Okafor", time: "15 min ago", type: "user", initials: "CO" },
  { id: 3, action: "Payment completed", user: "Emeka Nwankwo", time: "32 min ago", type: "transaction", initials: "EN" },
  { id: 4, action: "Dispute opened", user: "Fatima Abdullahi", time: "1 hr ago", type: "dispute", initials: "FA" },
  { id: 5, action: "Property approved", user: "Admin", time: "2 hrs ago", type: "property", initials: "AD" },
  { id: 6, action: "Payout processed", user: "System", time: "3 hrs ago", type: "transaction", initials: "SY" },
];

const typeColors: Record<string, string> = {
  property: "bg-[hsl(263,70%,58%)]/10 text-[hsl(263,70%,58%)] border-[hsl(263,70%,58%)]/20",
  user: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  transaction: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  dispute: "bg-red-500/10 text-red-600 border-red-500/20",
};

const quickStats = [
  { label: "Listings Today", value: "34", icon: Eye },
  { label: "Avg. Response", value: "2.4h", icon: Clock },
  { label: "Active Sessions", value: "1,247", icon: Activity },
  { label: "Conversion Rate", value: "3.2%", icon: ArrowUpRight },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(263,70%,58%)] to-[hsl(263,70%,35%)] p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative">
          <h2 className="text-2xl font-bold">Welcome back, Admin 👋</h2>
          <p className="text-white/70 mt-1 max-w-lg">Here's what's happening across the Dwello platform today. You have <span className="text-white font-semibold">24 open disputes</span> and <span className="text-white font-semibold">6 pending verifications</span> to review.</p>
        </div>
        <div className="relative mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickStats.map((qs) => (
            <div key={qs.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <div className="flex items-center gap-2 text-white/60 text-xs mb-1">
                <qs.icon className="h-3.5 w-3.5" />
                {qs.label}
              </div>
              <p className="text-xl font-bold">{qs.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <Card key={stat.title} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${stat.up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                  {stat.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {stat.trend}
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
              <p className="text-3xl font-bold mt-1 tracking-tight">{stat.value}</p>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Target progress</span>
                  <span className="font-medium">{stat.progress}%</span>
                </div>
                <Progress value={stat.progress} className="h-1.5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Latest actions across the platform</CardDescription>
            </div>
            <Badge variant="outline" className="text-muted-foreground">
              Live
              <span className="ml-1.5 h-2 w-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">User</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Action</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Type</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity.map((item) => (
                <TableRow key={item.id} className="group/row">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
                        <AvatarFallback className="text-xs bg-[hsl(263,70%,58%)]/10 text-[hsl(263,70%,58%)] font-medium">
                          {item.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{item.user}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{item.action}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeColors[item.type]}`}>
                      {item.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{item.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
