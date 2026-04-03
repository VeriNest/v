import {
  Inbox, Building2, CreditCard, TrendingUp,
  Clock, Eye, ArrowUpRight, ArrowRight, Plus,
  CalendarDays, Star, MoreHorizontal
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { KycAlertBanner } from "@/components/KycAlertBanner";

const earningsData = [
  { month: "Jan", earnings: 1.2 },
  { month: "Feb", earnings: 1.8 },
  { month: "Mar", earnings: 2.4 },
  { month: "Apr", earnings: 3.1 },
  { month: "May", earnings: 3.8 },
  { month: "Jun", earnings: 4.2 },
  { month: "Jul", earnings: 4.8 },
];

const stats = [
  { title: "New Leads", value: "8", change: "+3 today", icon: Inbox, subtitle: "Unresponded this week" },
  { title: "Active Listings", value: "12", change: "2 pending", icon: Building2, subtitle: "Published properties" },
  { title: "Pending Payouts", value: "₦4.2M", change: "3 in escrow", icon: CreditCard, subtitle: "Awaiting release" },
  { title: "Response Rate", value: "94%", change: "Top 5%", icon: TrendingUp, subtitle: "Avg 8 min response" },
];

const recentLeads = [
  { id: 1, need: "3 Bed in Lekki, budget ₦2.5M/yr", seeker: "Anonymous Tenant", posted: "15 min ago", urgent: true, initials: "AT" },
  { id: 2, need: "Studio in Wuse 2, budget ₦1.2M/yr", seeker: "Anonymous Tenant", posted: "1 hr ago", urgent: false, initials: "AT" },
  { id: 3, need: "Short-let VI, 3 nights, ₦50k/night", seeker: "Corporate Client", posted: "2 hrs ago", urgent: false, initials: "CC" },
  { id: 4, need: "2 Bed serviced apt, Ikoyi ₦3.5M/yr", seeker: "Anonymous Tenant", posted: "3 hrs ago", urgent: false, initials: "AT" },
];

const topListings = [
  { name: "3 Bed Flat, Lekki Phase 1", views: 234, inquiries: 18, rating: 4.8 },
  { name: "Studio Apartment, Wuse 2", views: 189, inquiries: 12, rating: 4.6 },
  { name: "4 Bed Duplex, Banana Island", views: 156, inquiries: 9, rating: 4.9 },
];

export default function ProviderDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Provider Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your leads, listings, and payouts.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-2 text-sm">
            <CalendarDays className="h-4 w-4" /> This Month
          </Button>
          <Button size="sm" className="h-9 gap-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <Link to="/provider/listings"><Plus className="h-4 w-4" /> Add Listing</Link>
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

      {/* Charts + top listings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border border-border/60 shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Earnings Overview</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Monthly earnings trend</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earningsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(18, 55%, 58%)" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="hsl(18, 55%, 58%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 12%, 90%)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(220, 10%, 50%)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'hsl(220, 10%, 50%)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${v}M`} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(30, 12%, 90%)', fontSize: '12px' }} formatter={(value: number) => [`₦${value}M`, 'Earnings']} />
                  <Area type="monotone" dataKey="earnings" stroke="hsl(18, 55%, 58%)" strokeWidth={2} fill="url(#earningsGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top listings */}
        <Card className="border border-border/60 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Top Listings</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-primary h-8" asChild>
                <Link to="/provider/listings">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {topListings.map((listing, i) => (
              <div key={i} className="p-3 rounded-xl border border-border/60 hover:border-primary/20 transition-colors">
                <p className="text-sm font-medium text-foreground mb-2">{listing.name}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {listing.views}</span>
                  <span className="flex items-center gap-1"><Inbox className="h-3 w-3" /> {listing.inquiries}</span>
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500 fill-amber-500" /> {listing.rating}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Leads */}
      <Card className="border border-border/60 shadow-none">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold">Recent Leads</CardTitle>
              <Badge variant="outline" className="text-[10px] h-5 gap-1 font-normal">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {recentLeads.length} new
              </Badge>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-primary h-8" asChild>
              <Link to="/provider/inbox">View All <ArrowRight className="h-3 w-3 ml-1" /></Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group">
                <Avatar className="h-9 w-9 border border-border/60">
                  <AvatarFallback className="text-[10px] font-medium bg-primary/10 text-primary">{lead.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{lead.need}</p>
                  <p className="text-xs text-muted-foreground">{lead.seeker} · {lead.posted}</p>
                </div>
                <div className="flex items-center gap-2">
                  {lead.urgent && (
                    <Badge variant="outline" className="text-[10px] h-5 gap-1 border-red-200 bg-red-50 text-red-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" /> Urgent
                    </Badge>
                  )}
                  <Button size="sm" className="h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity">
                    Send Offer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
