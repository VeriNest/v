import { Inbox, Building2, CreditCard, TrendingUp, Clock, Eye, ArrowUpRight, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const stats = [
  { title: "New Leads", value: "8", icon: Inbox, desc: "Unresponded this week", color: "text-[hsl(263,70%,58%)]", bg: "bg-[hsl(263,70%,58%)]/10", progress: 65, trend: "+3 today" },
  { title: "Active Listings", value: "12", icon: Building2, desc: "Published properties", color: "text-blue-600", bg: "bg-blue-500/10", progress: 85, trend: "2 pending" },
  { title: "Pending Payouts", value: "₦4.2M", icon: CreditCard, desc: "Awaiting release", color: "text-emerald-600", bg: "bg-emerald-500/10", progress: 58, trend: "3 in escrow" },
  { title: "Response Rate", value: "94%", icon: TrendingUp, desc: "Avg 8 min response", color: "text-amber-600", bg: "bg-amber-500/10", progress: 94, trend: "Top 5%" },
];

const quickStats = [
  { label: "Profile Views", value: "234", icon: Eye },
  { label: "Avg. Response", value: "8 min", icon: Clock },
  { label: "Offers Sent", value: "47", icon: Zap },
  { label: "Conversion", value: "12.4%", icon: ArrowUpRight },
];

const recentLeads = [
  { id: 1, need: "3 Bed in Lekki, budget ₦2.5M/yr", seeker: "Anonymous Tenant", posted: "15 min ago", sla: "Respond in 12 min", urgent: true, initials: "AT" },
  { id: 2, need: "Studio in Wuse 2, budget ₦1.2M/yr", seeker: "Anonymous Tenant", posted: "1 hr ago", sla: "Respond in 45 min", urgent: false, initials: "AT" },
  { id: 3, need: "Short-let VI, 3 nights, budget ₦50k/night", seeker: "Corporate Client", posted: "2 hrs ago", sla: "Responded", urgent: false, initials: "CC" },
];

export default function ProviderDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(263,70%,58%)] to-[hsl(263,70%,35%)] p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">Provider Overview</h2>
            <p className="text-white/70 mt-1 max-w-lg">Manage your leads, listings, and payouts. You have <span className="text-white font-semibold">8 new leads</span> and <span className="text-white font-semibold">₦4.2M pending</span> payouts.</p>
          </div>
          <Button asChild className="bg-white text-[hsl(263,70%,58%)] hover:bg-white/90 shrink-0">
            <Link to="/provider/listings">Add Listing</Link>
          </Button>
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
        {stats.map((s) => (
          <Card key={s.title} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${s.bg}`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <span className="text-xs text-muted-foreground">{s.trend}</span>
              </div>
              <p className="text-sm text-muted-foreground font-medium">{s.title}</p>
              <p className="text-3xl font-bold mt-1 tracking-tight">{s.value}</p>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span>{s.desc}</span>
                  <span className="font-medium">{s.progress}%</span>
                </div>
                <Progress value={s.progress} className="h-1.5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Leads */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Leads</CardTitle>
              <CardDescription>Tenant needs matching your listings</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/provider/inbox">View All Leads</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentLeads.map((lead) => (
            <div key={lead.id} className="flex items-center justify-between p-4 rounded-xl border bg-background hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                  <AvatarFallback className="text-xs bg-[hsl(263,70%,58%)]/10 text-[hsl(263,70%,58%)] font-medium">
                    {lead.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{lead.need}</p>
                  <p className="text-xs text-muted-foreground">{lead.seeker} · {lead.posted}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {lead.urgent && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                    </span>
                    <span className="text-red-500 font-medium text-xs">{lead.sla}</span>
                  </div>
                )}
                {lead.sla === "Responded" ? (
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">Sent</Badge>
                ) : (
                  <Button size="sm" className="bg-[hsl(263,70%,58%)] hover:bg-[hsl(263,70%,48%)]">Send Offer</Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
