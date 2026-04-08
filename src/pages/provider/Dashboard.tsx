import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CreditCard,
  Eye,
  Inbox,
  Plus,
  Star,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
import {
  useDashboardLayout,
  type DashboardWidgetSize,
} from "@/hooks/use-dashboard-layout";
import { useSearchFocus } from "@/hooks/use-search-focus";
import { toSearchId } from "@/lib/search-id";

const earningsData = [
  { month: "Jan", earnings: 1.8 },
  { month: "Feb", earnings: 2.2 },
  { month: "Mar", earnings: 2.9 },
  { month: "Apr", earnings: 3.4 },
  { month: "May", earnings: 3.9 },
  { month: "Jun", earnings: 4.2 },
  { month: "Jul", earnings: 3.8 },
];

export const stats = [
  {
    title: "New Leads",
    value: "8",
    change: "+3 today",
    icon: Inbox,
    subtitle: "Unresponded this week",
  },
  {
    title: "Active Listings",
    value: "12",
    change: "2 pending",
    icon: Building2,
    subtitle: "Published properties",
  },
  {
    title: "Pending Payouts",
    value: "NGN 4.2M",
    change: "3 in escrow",
    icon: CreditCard,
    subtitle: "Awaiting release",
  },
  {
    title: "Response Rate",
    value: "94%",
    change: "Top 5%",
    icon: TrendingUp,
    subtitle: "Avg 8 min response",
  },
];

export const recentLeads = [
  {
    id: 1,
    need: "3 Bed in Lekki, budget NGN 2.5M/yr",
    seeker: "Anonymous Tenant",
    posted: "15 min ago",
    urgent: true,
    initials: "AT",
  },
  {
    id: 2,
    need: "Studio in Wuse 2, budget NGN 1.2M/yr",
    seeker: "Anonymous Tenant",
    posted: "1 hr ago",
    urgent: false,
    initials: "AT",
  },
  {
    id: 3,
    need: "Short-let VI, 3 nights, NGN 50k/night",
    seeker: "Corporate Client",
    posted: "2 hrs ago",
    urgent: false,
    initials: "CC",
  },
  {
    id: 4,
    need: "2 Bed serviced apt, Ikoyi NGN 3.5M/yr",
    seeker: "Anonymous Tenant",
    posted: "3 hrs ago",
    urgent: false,
    initials: "AT",
  },
];

export const topListings = [
  { name: "3 Bed Flat, Lekki Phase 1", views: 234, inquiries: 18, rating: 4.8 },
  { name: "Studio Apartment, Wuse 2", views: 189, inquiries: 12, rating: 4.6 },
  { name: "4 Bed Duplex, Banana Island", views: 156, inquiries: 9, rating: 4.9 },
];

type WidgetDefinition = {
  id: string;
  title: string;
  description: string;
  defaultSize: DashboardWidgetSize;
  availableSizes: DashboardWidgetSize[];
  render: (controls: DashboardWidgetMenuControls) => JSX.Element;
};

export default function ProviderDashboard() {
  useSearchFocus();
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
        description: "Track leads, listings, payouts, and response performance.",
        defaultSize: "full",
        availableSizes: ["full"],
        render: () => (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card
                key={stat.title}
                data-search-id={`provider-stat-${toSearchId(stat.title)}`}
                className="border border-border/60 shadow-none"
              >
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">{stat.change}</span>
                  </div>
                  <p className="text-2xl font-bold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ),
      },
      {
        id: "earnings-overview",
        title: "Earnings overview",
        description: "Review monthly earnings performance.",
        defaultSize: "wide",
        availableSizes: ["wide", "full"],
        render: (controls) => (
          <Card className="border border-border/60 shadow-none">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Earnings Overview
                  </CardTitle>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Monthly earnings trend
                  </p>
                </div>
                <DashboardWidgetMenu controls={controls} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={earningsData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="hsl(18, 55%, 58%)"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="100%"
                          stopColor="hsl(18, 55%, 58%)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(30, 12%, 90%)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: "hsl(220, 10%, 50%)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "hsl(220, 10%, 50%)" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `NGN ${value}M`}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid hsl(30, 12%, 90%)",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [`NGN ${value}M`, "Earnings"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="earnings"
                      stroke="hsl(18, 55%, 58%)"
                      strokeWidth={2}
                      fill="url(#earningsGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ),
      },
      {
        id: "top-listings",
        title: "Top listings",
        description: "See which listings are attracting the most attention.",
        defaultSize: "compact",
        availableSizes: ["compact", "wide"],
        render: () => (
          <Card className="border border-border/60 shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Top Listings</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-primary"
                  asChild
                >
                  <Link to="/provider/listings">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {topListings.map((listing) => (
                <div
                  key={listing.name}
                  data-search-id={`provider-top-${toSearchId(listing.name)}`}
                  className="rounded-xl border border-border/60 p-3"
                >
                  <p className="mb-2 text-sm font-medium text-foreground">{listing.name}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" /> {listing.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Inbox className="h-3 w-3" /> {listing.inquiries}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />{" "}
                      {listing.rating}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ),
      },
      {
        id: "recent-leads",
        title: "Recent leads",
        description: "Prioritize inbound leads and respond faster.",
        defaultSize: "full",
        availableSizes: ["wide", "full"],
        render: () => (
          <Card className="border border-border/60 shadow-none">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-base font-semibold">Recent Leads</CardTitle>
                  <Badge variant="outline" className="inline-flex h-auto min-h-5 shrink-0 items-center gap-1 whitespace-nowrap px-2 py-0.5 text-[10px] font-normal">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {recentLeads.length} new
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 self-start text-xs text-primary sm:self-auto"
                  asChild
                >
                  <Link to="/provider/inbox">
                    View All <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                {recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    data-search-id={`provider-overview-lead-${lead.id}`}
                    className="flex flex-col gap-2 rounded-lg p-3 sm:flex-row sm:items-center sm:gap-3"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <Avatar className="h-9 w-9 shrink-0 border border-border/60">
                        <AvatarFallback className="bg-primary/10 text-[10px] font-medium text-primary">
                          {lead.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {lead.need}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {lead.seeker} · {lead.posted}
                        </p>
                      </div>
                    </div>
                    <div className="ml-12 flex flex-wrap items-center gap-2 sm:ml-0">
                      {lead.urgent ? (
                        <Badge
                          variant="outline"
                          className="inline-flex h-auto min-h-5 shrink-0 items-center gap-1 whitespace-nowrap border-red-200 bg-red-50 px-2 py-0.5 text-[10px] text-red-600"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                          Urgent
                        </Badge>
                      ) : null}
                      <Button
                        size="sm"
                        className="h-7 bg-primary text-xs text-primary-foreground"
                      >
                        Send Offer
                      </Button>
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

  const {
    applyPreset,
    layout,
    move,
    moveTo,
    reset,
    resetItem,
    setSize,
    showWidget,
    toggleVisibility,
  } = useDashboardLayout(
    "dwello_dashboard_layout_provider",
    widgetDefinitions.map((widget) => ({
      id: widget.id,
      size: widget.defaultSize,
      availableSizes: widget.availableSizes,
    })),
  );

  const widgetMap = useMemo(
    () => new Map(widgetDefinitions.map((widget) => [widget.id, widget])),
    [widgetDefinitions],
  );

  const visibleWidgets = layout.flatMap((item) => {
    const widget = widgetMap.get(item.id);
    return item.visible && widget
      ? [{ ...widget, visible: item.visible, size: item.size }]
      : [];
  });

  const hiddenWidgets = layout.flatMap((item) => {
    const widget = widgetMap.get(item.id);
    return !item.visible && widget
      ? [
          {
            id: item.id,
            title: widget.title,
            description: widget.description,
            visible: item.visible,
            size: item.size,
            availableSizes: widget.availableSizes,
          },
        ]
      : [];
  });

  if (loading) return <DashboardSkeleton variant="provider" />;

  return (
    <div className="animate-in space-y-6 fade-in duration-300">
      <KycAlertBanner variant="provider" />

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Welcome back, Provider
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Manage your leads, listings, and payouts.
          </p>
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
            <CalendarDays className="h-4 w-4" />{" "}
            <span className="hidden sm:inline">This</span> Month
          </Button>
          <Button
            size="sm"
            className="h-9 gap-2 bg-primary text-sm text-primary-foreground"
            asChild
          >
            <Link to="/provider/listings/new">
              <Plus className="h-4 w-4" /> Add Listing
            </Link>
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

      <div className="grid grid-cols-1 gap-4 lg:grid-flow-row-dense lg:grid-cols-3">
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
              editing,
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
