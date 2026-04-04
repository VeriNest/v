import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarCheck,
  Eye,
  FileText,
  Heart,
  Inbox,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import {
  DashboardCustomizerToolbar,
  DashboardEditableWidget,
  DashboardHiddenWidgets,
  DashboardWidgetMenu,
  type DashboardWidgetMenuControls,
} from "@/components/dashboard/DashboardCustomizer";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import { KycAlertBanner } from "@/components/KycAlertBanner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardLayout, type DashboardWidgetSize } from "@/hooks/use-dashboard-layout";

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

type WidgetDefinition = {
  id: string;
  title: string;
  description: string;
  defaultSize: DashboardWidgetSize;
  availableSizes: DashboardWidgetSize[];
  render: (controls: DashboardWidgetMenuControls) => JSX.Element;
};

export default function SeekerDashboard() {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const widgetDefinitions = useMemo<WidgetDefinition[]>(
    () => [
      {
        id: "stats",
        title: "Key stats",
        description: "Monitor your active needs, offers, viewings, and match quality.",
        defaultSize: "full",
        availableSizes: ["full"],
        render: () => (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title} className="border border-border/60 shadow-none transition-shadow duration-200 hover:shadow-md">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">{stat.change}</span>
                  </div>
                  <p className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ),
      },
      {
        id: "match-trends",
        title: "Match trends",
        description: "Watch how many relevant property matches are surfacing over time.",
        defaultSize: "wide",
        availableSizes: ["wide", "full"],
        render: (controls) => (
          <Card className="border border-border/60 shadow-none">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Match Trends</CardTitle>
                  <p className="mt-0.5 text-xs text-muted-foreground">Weekly property matches for your needs</p>
                </div>
                <DashboardWidgetMenu controls={controls} />
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
                    <XAxis dataKey="week" tick={{ fontSize: 12, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(30, 12%, 90%)", fontSize: "12px" }} />
                    <Area type="monotone" dataKey="matches" stroke="hsl(18, 55%, 58%)" strokeWidth={2} fill="url(#matchGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ),
      },
      {
        id: "saved-properties",
        title: "Saved properties",
        description: "Keep favorite homes close by for quick comparison.",
        defaultSize: "compact",
        availableSizes: ["compact", "wide"],
        render: () => (
          <Card className="border border-border/60 shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Saved Properties</CardTitle>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-primary" asChild>
                  <Link to="/seeker/saved">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {savedProperties.map((property) => (
                <div key={property.name} className="group flex gap-3 rounded-xl border border-border/60 p-2 transition-colors hover:border-primary/20">
                  <img src={property.img} alt={property.name} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{property.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {property.location}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{property.price}</p>
                  </div>
                  <button type="button" className="self-start p-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        ),
      },
      {
        id: "recent-offers",
        title: "Recent offers",
        description: "Review the latest offers and compare provider fit.",
        defaultSize: "full",
        availableSizes: ["wide", "full"],
        render: () => (
          <Card className="border border-border/60 shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-semibold">Recent Offers</CardTitle>
                  <Badge variant="outline" className="h-5 gap-1 text-[10px] font-normal">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    {recentOffers.length} new
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-primary" asChild>
                  <Link to="/seeker/offers">View All <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                {recentOffers.map((offer) => (
                  <div key={offer.id} className="group flex flex-col gap-2 rounded-lg p-3 transition-colors hover:bg-accent/50 sm:flex-row sm:items-center sm:gap-3">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <Avatar className="h-9 w-9 shrink-0 border border-border/60">
                        <AvatarFallback className="bg-primary/10 text-[10px] font-medium text-primary">{offer.initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{offer.property}</p>
                        <p className="text-xs text-muted-foreground">by {offer.provider} · {offer.time} ago</p>
                      </div>
                    </div>
                    <div className="ml-12 flex shrink-0 items-center gap-2 sm:ml-0 sm:gap-3">
                      <Badge variant="outline" className={`h-5 text-[10px] ${badgeColors[offer.badge]}`}>{offer.badge}</Badge>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{offer.match}%</span>
                      <p className="text-sm font-semibold text-foreground">{offer.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ),
      },
    ],
    [],
  );

  const { applyPreset, layout, move, moveTo, reset, resetItem, setSize, showWidget, toggleVisibility } = useDashboardLayout(
    "dwello_dashboard_layout_seeker",
    widgetDefinitions.map((widget) => ({
      id: widget.id,
      size: widget.defaultSize,
      availableSizes: widget.availableSizes,
    })),
  );

  const widgetMap = useMemo(() => new Map(widgetDefinitions.map((widget) => [widget.id, widget])), [widgetDefinitions]);

  const visibleWidgets = layout.flatMap((item) => {
    const widget = widgetMap.get(item.id);
    return item.visible && widget ? [{ ...widget, visible: item.visible, size: item.size }] : [];
  });

  const hiddenWidgets = layout.flatMap((item) => {
    const widget = widgetMap.get(item.id);
    return !item.visible && widget
      ? [{
          id: item.id,
          title: widget.title,
          description: widget.description,
          visible: item.visible,
          size: item.size,
          availableSizes: widget.availableSizes,
        }]
      : [];
  });

  if (loading) return <DashboardSkeleton variant="seeker" />;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <KycAlertBanner variant="seeker" />

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Welcome back!</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Track your property search, offers, and viewings.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!editing ? (
            <DashboardCustomizerToolbar
              editing={editing}
              hiddenCount={hiddenWidgets.length}
              onApplyPreset={applyPreset}
              onEditChange={setEditing}
              onReset={reset}
            />
          ) : null}
          <Button variant="outline" size="sm" className="h-9 gap-2 text-sm">
            <Search className="h-4 w-4" /> <span className="hidden sm:inline">Browse</span> Properties
          </Button>
          <Button size="sm" className="h-9 gap-2 bg-primary text-sm text-primary-foreground hover:bg-primary/90" asChild>
            <Link to="/seeker/post"><Plus className="h-4 w-4" /> Post a Need</Link>
          </Button>
        </div>
      </div>

      {editing ? (
        <>
          <DashboardCustomizerToolbar
            editing={editing}
            hiddenCount={hiddenWidgets.length}
            onApplyPreset={applyPreset}
            onEditChange={setEditing}
            onReset={reset}
          />
          <DashboardHiddenWidgets items={hiddenWidgets} onShow={showWidget} />
        </>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {visibleWidgets.map((widget, index) => (
          <DashboardEditableWidget
            key={widget.id}
            editing={editing}
            index={index}
            item={{
              id: widget.id,
              title: widget.title,
              description: widget.description,
              visible: widget.visible,
              size: widget.size,
              availableSizes: widget.availableSizes,
            }}
            total={visibleWidgets.length}
            onHide={(itemId) => toggleVisibility(itemId, false)}
            onMove={move}
            onSizeChange={setSize}
          >
            {widget.render({
              availableSizes: widget.availableSizes,
              canMoveDown: index < visibleWidgets.length - 1,
              canPinBottom: index < visibleWidgets.length - 1,
              canPinTop: index > 0,
              canMoveUp: index > 0,
              currentSize: widget.size,
              onFocus: undefined,
              onHide: () => toggleVisibility(widget.id, false),
              onMove: (direction) => move(widget.id, direction),
              onMoveTo: (position) => moveTo(widget.id, position),
              onReset: () => resetItem(widget.id),
              onSizeChange: (size) => setSize(widget.id, size),
              title: widget.title,
            })}
          </DashboardEditableWidget>
        ))}
      </div>
    </div>
  );
}
