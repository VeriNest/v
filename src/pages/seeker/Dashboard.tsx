import { useMemo, useState } from "react";
import {
  CalendarCheck,
  FileText,
  Heart,
  Inbox,
  MapPin,
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
import {
  DASHBOARD_OVERVIEW_CHART_HEIGHT_CLASS,
  DASHBOARD_OVERVIEW_ROW_WIDGET_CLASS,
} from "@/components/dashboard/overview";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardSectionAction } from "@/components/dashboard/DashboardSectionAction";
import { DashboardSectionCard } from "@/components/dashboard/DashboardSectionCard";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { DashboardStatusBadge } from "@/components/dashboard/DashboardStatusBadge";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import { KycAlertBanner } from "@/components/KycAlertBanner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDashboardLayout, type DashboardWidgetSize } from "@/hooks/use-dashboard-layout";
import { useDashboardLoadingSnapshot } from "@/hooks/use-dashboard-loading-snapshot";
import { useSearchFocus } from "@/hooks/use-search-focus";
import { toSearchId } from "@/lib/search-id";

const matchData = [
  { week: "W1", matches: 4 },
  { week: "W2", matches: 7 },
  { week: "W3", matches: 12 },
  { week: "W4", matches: 9 },
  { week: "W5", matches: 15 },
  { week: "W6", matches: 18 },
  { week: "W7", matches: 14 },
];

export const stats = [
  { title: "Active Posts", value: "3", change: "2 getting offers", icon: FileText, subtitle: "Needs published" },
  { title: "Offers Received", value: "12", change: "+5 today", icon: Inbox, subtitle: "Across all posts" },
  { title: "Upcoming Viewings", value: "2", change: "This week", icon: CalendarCheck, subtitle: "Next: Tomorrow 2PM", href: "/seeker/bookings?section=viewings" },
  { title: "Match Rate", value: "87%", change: "Above avg", icon: TrendingUp, subtitle: "Offer relevance score" },
];

export const recentOffers = [
  { id: 1, property: "3 Bed Flat, Lekki Phase 1", provider: "Adebayo Johnson", price: "N2,500,000/yr", badge: "Agent", time: "2h", match: 95, initials: "AJ" },
  { id: 2, property: "Studio, Wuse 2 Abuja", provider: "Chioma Okafor", price: "N1,200,000/yr", badge: "Landlord", time: "5h", match: 88, initials: "CO" },
  { id: 3, property: "2 Bed Serviced, Victoria Island", provider: "ShortStay NG", price: "N45,000/night", badge: "Short-let", time: "1d", match: 76, initials: "SN" },
  { id: 4, property: "4 Bed Duplex, Maitama", provider: "Premium Estates", price: "N5,200,000/yr", badge: "Agent", time: "2d", match: 92, initials: "PE" },
];

export const savedProperties = [
  { name: "Modern 2 Bed, Ikoyi", location: "Ikoyi, Lagos", price: "N3.8M/yr", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&h=140&fit=crop" },
  { name: "Penthouse, Banana Island", location: "Banana Island, Lagos", price: "N12M/yr", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200&h=140&fit=crop" },
  { name: "Studio, Garki Area 11", location: "Garki, Abuja", price: "N850K/yr", img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=200&h=140&fit=crop" },
];

type WidgetDefinition = {
  id: string;
  title: string;
  description: string;
  defaultSize: DashboardWidgetSize;
  availableSizes: DashboardWidgetSize[];
  render: (controls: DashboardWidgetMenuControls) => JSX.Element;
};

export default function SeekerDashboard() {
  useSearchFocus();
  const [editing, setEditing] = useState(false);
  const loading = useDashboardLoadingSnapshot();

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
              <div key={stat.title} data-search-id={`seeker-stat-${toSearchId(stat.title)}`}>
                {stat.href ? (
                  <Link to={stat.href} className="block">
                    <DashboardStatCard title={stat.title} value={stat.value} subtitle={stat.subtitle} change={stat.change} icon={stat.icon} />
                  </Link>
                ) : (
                  <DashboardStatCard title={stat.title} value={stat.value} subtitle={stat.subtitle} change={stat.change} icon={stat.icon} />
                )}
              </div>
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
          <DashboardSectionCard
            title="Match Trends"
            description="Weekly property matches for your needs"
            action={<DashboardWidgetMenu controls={controls} />}
            className={DASHBOARD_OVERVIEW_ROW_WIDGET_CLASS}
          >
            <div className={DASHBOARD_OVERVIEW_CHART_HEIGHT_CLASS}>
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
          </DashboardSectionCard>
        ),
      },
      {
        id: "saved-properties",
        title: "Saved properties",
        description: "Keep favorite homes close by for quick comparison.",
        defaultSize: "compact",
        availableSizes: ["compact", "wide"],
        render: () => (
          <DashboardSectionCard
            title="Saved Properties"
            action={<DashboardSectionAction to="/seeker/saved">View all</DashboardSectionAction>}
            className={DASHBOARD_OVERVIEW_ROW_WIDGET_CLASS}
            contentClassName="grid h-full grid-rows-3 gap-1.5"
          >
            {savedProperties.map((property) => (
              <div key={property.name} data-search-id={`seeker-overview-saved-${toSearchId(property.name)}`} className="h-full">
                <div className="flex h-full items-start gap-2 rounded-xl border border-border/60 bg-background/40 p-2">
                  <img src={property.img} alt={property.name} className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-1 text-sm font-medium text-foreground">{property.name}</p>
                      <button type="button" className="shrink-0 p-0.5 text-red-500" aria-label={`Remove ${property.name} from saved properties`}>
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      </button>
                    </div>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" /> {property.location}
                    </p>
                    <p className="mt-1.5 text-xs font-semibold text-foreground">{property.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </DashboardSectionCard>
        ),
      },
      {
        id: "recent-offers",
        title: "Recent offers",
        description: "Review the latest offers and compare provider fit.",
        defaultSize: "full",
        availableSizes: ["wide", "full"],
        render: () => (
          <DashboardSectionCard
            title="Recent Offers"
            action={
              <div className="flex flex-wrap items-center gap-2">
                <DashboardStatusBadge tone="success" dot>{recentOffers.length} new</DashboardStatusBadge>
                <DashboardSectionAction to="/seeker/offers">View all</DashboardSectionAction>
              </div>
            }
            className="shadow-none"
          >
            <div className="space-y-1">
              {recentOffers.map((offer) => (
                <div key={offer.id} data-search-id={`seeker-overview-offer-${offer.id}`}>
                  <div className="rounded-xl border border-border/60 bg-background/40 p-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-9 w-9 shrink-0 border border-border/60">
                        <AvatarFallback className="bg-primary/10 text-[10px] font-medium text-primary">{offer.initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-foreground">{offer.property}</div>
                            <div className="mt-1 text-xs text-muted-foreground">{`by ${offer.provider} | ${offer.time} ago`}</div>
                          </div>
                          <div className="shrink-0">
                            <div className="flex flex-wrap items-center justify-end gap-2">
                              <DashboardStatusBadge tone={offer.badge === "Agent" ? "info" : offer.badge === "Landlord" ? "neutral" : "warning"}>
                                {offer.badge}
                              </DashboardStatusBadge>
                              <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{offer.match}%</span>
                              <p className="text-sm font-semibold text-foreground">{offer.price}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardSectionCard>
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

      <DashboardPageHeader
        title="Welcome back!"
        description="Track your property search, offers, and viewings."
        actions={
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
            <Button size="sm" className="h-9 gap-2 bg-primary text-sm text-primary-foreground" asChild>
              <Link to="/seeker/post"><Plus className="h-4 w-4" /> Post a Need</Link>
            </Button>
          </div>
        }
      />

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
