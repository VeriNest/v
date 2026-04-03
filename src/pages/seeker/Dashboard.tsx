import { useState, useEffect } from "react";
import {
  FileText, Inbox, CalendarCheck, TrendingUp,
  ArrowUpRight, ArrowRight, Search, Eye, Clock,
  Heart, MapPin, MoreHorizontal, Plus
} from "lucide-react";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { KycAlertBanner } from "@/components/KycAlertBanner";

const matchData = [
  { week: "W1", matches: 4 },
  { week: "W2", matches: 7 },
  { week: "W3", matches: 12 },
  { week: "W4", matches: 9 },
  { week: "W5", matches: 15 },
  { week: "W6", matches: 18 },
  { week: "W7", matches: 14 },
];

const stats = [
  { title: "Active Posts", value: "3", change: "2 getting offers", icon: FileText, subtitle: "Needs published" },
  { title: "Offers Received", value: "12", change: "+5 today", icon: Inbox, subtitle: "Across all posts" },
  { title: "Upcoming Viewings", value: "2", change: "This week", icon: CalendarCheck, subtitle: "Next: Tomorrow 2PM" },
  { title: "Match Rate", value: "87%", change: "Above avg", icon: TrendingUp, subtitle: "Offer relevance score" },
];

const recentOffers = [
  { id: 1, property: "3 Bed Flat, Lekki Phase 1", provider: "Adebayo Johnson", price: "₦2,500,000/yr", badge: "Agent", time: "2h", match: 95, initials: "AJ" },
  { id: 2, property: "Studio, Wuse 2 Abuja", provider: "Chioma Okafor", price: "₦1,200,000/yr", badge: "Landlord", time: "5h", match: 88, initials: "CO" },
  { id: 3, property: "2 Bed Serviced, Victoria Island", provider: "ShortStay NG", price: "₦45,000/night", badge: "Short-let", time: "1d", match: 76, initials: "SN" },
  { id: 4, property: "4 Bed Duplex, Maitama", provider: "Premium Estates", price: "₦5,200,000/yr", badge: "Agent", time: "2d", match: 92, initials: "PE" },
];

const savedProperties = [
  { name: "Modern 2 Bed, Ikoyi", location: "Ikoyi, Lagos", price: "₦3.8M/yr", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&h=140&fit=crop" },
  { name: "Penthouse, Banana Island", location: "Banana Island, Lagos", price: "₦12M/yr", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200&h=140&fit=crop" },
  { name: "Studio, Garki Area 11", location: "Garki, Abuja", price: "₦850K/yr", img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=200&h=140&fit=crop" },
];

const badgeColors: Record<string, string> = {
  Agent: "bg-primary/10 text-primary border-primary/20",
  Landlord: "bg-blue-50 text-blue-600 border-blue-200",
  "Short-let": "bg-amber-50 text-amber-600 border-amber-200",
};

export default function SeekerDashboard() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1200); return () => clearTimeout(t); }, []);
  if (loading) return <DashboardSkeleton variant="seeker" />;
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* KYC Alert */}
      <KycAlertBanner variant="seeker" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">Welcome back!</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track your property search, offers, and viewings.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-2 text-sm">
            <Search className="h-4 w-4" /> <span className="hidden sm:inline">Browse</span> Properties
          </Button>
          <Button size="sm" className="h-9 gap-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <Link to="/seeker/post"><Plus className="h-4 w-4" /> Post a Need</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
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

      {/* Chart + Saved */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border border-border/60 shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Match Trends</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Weekly property matches for your needs</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={matchData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="matchGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(18, 55%, 58%)" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="hsl(18, 55%, 58%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 12%, 90%)" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 12, fill: 'hsl(220, 10%, 50%)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'hsl(220, 10%, 50%)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(30, 12%, 90%)', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="matches" stroke="hsl(18, 55%, 58%)" strokeWidth={2} fill="url(#matchGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Saved Properties */}
        <Card className="border border-border/60 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Saved Properties</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-primary h-8" asChild>
                <Link to="/seeker/saved">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {savedProperties.map((prop, i) => (
              <div key={i} className="flex gap-3 p-2 rounded-xl border border-border/60 hover:border-primary/20 transition-colors group">
                <img src={prop.img} alt={prop.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{prop.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3" /> {prop.location}
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-1">{prop.price}</p>
                </div>
                <button className="self-start p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Offers */}
      <Card className="border border-border/60 shadow-none">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold">Recent Offers</CardTitle>
              <Badge variant="outline" className="text-[10px] h-5 gap-1 font-normal">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {recentOffers.length} new
              </Badge>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-primary h-8" asChild>
              <Link to="/seeker/offers">View All <ArrowRight className="h-3 w-3 ml-1" /></Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1">
            {recentOffers.map((offer) => (
              <div key={offer.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-9 w-9 border border-border/60 shrink-0">
                    <AvatarFallback className="text-[10px] font-medium bg-primary/10 text-primary">{offer.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{offer.property}</p>
                    <p className="text-xs text-muted-foreground">by {offer.provider} · {offer.time} ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-12 sm:ml-0">
                  <Badge variant="outline" className={`text-[10px] h-5 ${badgeColors[offer.badge]}`}>{offer.badge}</Badge>
                  <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{offer.match}%</span>
                  <p className="text-sm font-semibold text-foreground">{offer.price}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
