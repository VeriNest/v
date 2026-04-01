import { FileText, Inbox, CalendarCheck, TrendingUp, ArrowUpRight, Search, Eye, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const stats = [
  { title: "Active Posts", value: "3", icon: FileText, desc: "Needs published", color: "text-[hsl(263,70%,58%)]", bg: "bg-[hsl(263,70%,58%)]/10", progress: 60 },
  { title: "Offers Received", value: "12", icon: Inbox, desc: "Across all posts", color: "text-blue-600", bg: "bg-blue-500/10", progress: 80 },
  { title: "Upcoming Viewings", value: "2", icon: CalendarCheck, desc: "This week", color: "text-emerald-600", bg: "bg-emerald-500/10", progress: 40 },
  { title: "Match Rate", value: "87%", icon: TrendingUp, desc: "Offer relevance", color: "text-amber-600", bg: "bg-amber-500/10", progress: 87 },
];

const quickStats = [
  { label: "New Offers Today", value: "5", icon: Inbox },
  { label: "Avg. Response", value: "1.2h", icon: Clock },
  { label: "Properties Viewed", value: "18", icon: Eye },
  { label: "Saved Properties", value: "7", icon: Search },
];

const recentOffers = [
  { id: 1, property: "3 Bed Flat, Lekki Phase 1", provider: "Adebayo Johnson", price: "₦2,500,000/yr", badge: "Agent", time: "2 hrs ago", trust: "Verified", match: 95, initials: "AJ" },
  { id: 2, property: "Studio, Wuse 2 Abuja", provider: "Chioma Okafor", price: "₦1,200,000/yr", badge: "Landlord", time: "5 hrs ago", trust: "Verified", match: 88, initials: "CO" },
  { id: 3, property: "2 Bed Serviced, Victoria Island", provider: "ShortStay NG", price: "₦45,000/night", badge: "Short-let", time: "1 day ago", trust: "Pending", match: 76, initials: "SN" },
];

const badgeStyles: Record<string, string> = {
  Agent: "bg-[hsl(263,70%,58%)]/10 text-[hsl(263,70%,58%)] border-[hsl(263,70%,58%)]/20",
  Landlord: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "Short-let": "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

export default function SeekerDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(263,70%,58%)] to-[hsl(263,70%,35%)] p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">Welcome back! 🏠</h2>
            <p className="text-white/70 mt-1 max-w-lg">Here's what's happening with your property search. You have <span className="text-white font-semibold">12 new offers</span> and <span className="text-white font-semibold">2 viewings</span> this week.</p>
          </div>
          <Button asChild className="bg-white text-[hsl(263,70%,58%)] hover:bg-white/90 shrink-0">
            <Link to="/seeker/post">Post a Need</Link>
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
                <div className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                  <ArrowUpRight className="h-3 w-3" />
                  Active
                </div>
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

      {/* Recent Offers */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Offers</CardTitle>
              <CardDescription>Latest offers matched to your needs</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/seeker/offers">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentOffers.map((offer) => (
            <div key={offer.id} className="flex items-center justify-between p-4 rounded-xl border bg-background hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                  <AvatarFallback className="text-xs bg-[hsl(263,70%,58%)]/10 text-[hsl(263,70%,58%)] font-medium">
                    {offer.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{offer.property}</p>
                  <p className="text-xs text-muted-foreground">by {offer.provider} · {offer.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${badgeStyles[offer.badge]}`}>
                  {offer.badge}
                </span>
                <span className="bg-[hsl(263,70%,58%)]/10 text-[hsl(263,70%,58%)] px-2.5 py-1 rounded-full text-xs font-semibold">
                  {offer.match}% match
                </span>
                <div className="text-right">
                  <p className="font-bold text-sm">{offer.price}</p>
                  <p className={`text-xs ${offer.trust === "Verified" ? "text-emerald-600" : "text-amber-600"}`}>{offer.trust}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
