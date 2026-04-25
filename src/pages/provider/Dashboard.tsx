import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
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
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const stats = [] as any[];
export const recentLeads = [] as any[];
export const topListings = [] as any[];

import {
  DashboardCustomizerToolbar,
  DashboardEditableWidget,
  DashboardHiddenWidgets,
  DashboardWidgetMenu,
  type DashboardWidgetMenuControls,
} from "@/components/dashboard/DashboardCustomizer";
import { BackendLoadingIndicator } from "@/components/BackendLoadingIndicator";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import {
  DASHBOARD_OVERVIEW_CHART_HEIGHT_CLASS,
  DASHBOARD_OVERVIEW_COMPACT_CONTENT_CLASS,
  DASHBOARD_OVERVIEW_ROW_WIDGET_CLASS,
} from "@/components/dashboard/overview";
import { DashboardRecordItem } from "@/components/dashboard/DashboardRecordItem";
import { DashboardSectionAction } from "@/components/dashboard/DashboardSectionAction";
import { DashboardSectionCard } from "@/components/dashboard/DashboardSectionCard";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { DashboardStatusBadge } from "@/components/dashboard/DashboardStatusBadge";
import { KycAlertBanner } from "@/components/KycAlertBanner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDashboardLayout, type DashboardWidgetSize } from "@/hooks/use-dashboard-layout";
import { useDashboardLoadingSnapshot } from "@/hooks/use-dashboard-loading-snapshot";
import { useSearchFocus } from "@/hooks/use-search-focus";
import { toSearchId } from "@/lib/search-id";
import { agentApi, formatCompactCurrency, getPendingPropertyRating, getPropertyImage } from "@/lib/api";

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
  const loading = useDashboardLoadingSnapshot();
  const { data, isLoading } = useQuery({
    queryKey: ["/agent/dashboard/overview"],
    queryFn: () => agentApi.dashboard(),
  });
  const earningsData = data?.earningsSeries?.length ? data.earningsSeries as Array<{ month: string; earnings: number }> : [{ month: "Now", earnings: Number(data?.stats.payoutTotal ?? 0) / 1000000 }];
  const stats = [
    { title: "New Leads", value: String(data?.stats.leadCount ?? 0), change: "Live queue", icon: Inbox, subtitle: "Unresponded this week" },
    { title: "Active Listings", value: String(data?.stats.listingCount ?? 0), change: "Published properties", icon: Building2, subtitle: "Owned or managed" },
    { title: "Pending Payouts", value: formatCompactCurrency(Number(data?.stats.payoutTotal ?? 0)), change: "Awaiting release", icon: CreditCard, subtitle: "Settlement pipeline" },
    { title: "Response Rate", value: `${data?.recentLeads?.length ? 100 : 0}%`, change: "Lead coverage", icon: TrendingUp, subtitle: "Based on live leads" },
  ];
  const recentLeads = (data?.recentLeads ?? []).slice(0, 4).map((lead: any, index: number) => ({
    id: lead.id ?? index + 1,
    need: lead.requestTitle ?? "New need",
    seeker: lead.location ?? "Seeker request",
    posted: lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "now",
    urgent: false,
    initials: "LD",
  }));
  const topListings = (data?.topListings ?? []).slice(0, 3).map((listing: any, index: number) => ({
    id: String(listing.id ?? index),
    name: listing.title ?? "Listing",
    views: Number(listing.viewCount ?? listing.view_count ?? 0),
    inquiries: Number(listing.offerCount ?? listing.offer_count ?? 0),
    rating: getPendingPropertyRating(listing),
    image: getPropertyImage(listing.images, index),
  }));

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
              <div key={stat.title} data-search-id={`provider-stat-${toSearchId(stat.title)}`}>
                <DashboardStatCard title={stat.title} value={stat.value} subtitle={stat.subtitle} change={stat.change} icon={stat.icon} />
              </div>
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
          <DashboardSectionCard
            title="Earnings Overview"
            description="Monthly earnings trend"
            action={<DashboardWidgetMenu controls={controls} />}
            className={DASHBOARD_OVERVIEW_ROW_WIDGET_CLASS}
          >
            <div className={DASHBOARD_OVERVIEW_CHART_HEIGHT_CLASS}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earningsData} margin={{ top: 10, right: 12, left: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(18, 55%, 58%)" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="hsl(18, 55%, 58%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 12%, 90%)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
                  <YAxis
                    width={64}
                    tick={{ fontSize: 12, fill: "hsl(220, 10%, 50%)" }}
                    axisLine={false}
                    tickLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `NGN ${value}M`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "1px solid hsl(30, 12%, 90%)", fontSize: "12px" }}
                    formatter={(value: number) => [`NGN ${value}M`, "Earnings"]}
                  />
                  <Area type="monotone" dataKey="earnings" stroke="hsl(18, 55%, 58%)" strokeWidth={2} fill="url(#earningsGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </DashboardSectionCard>
        ),
      },
      {
        id: "top-listings",
        title: "Top listings",
        description: "See which listings are attracting the most attention.",
        defaultSize: "compact",
        availableSizes: ["compact", "wide"],
        render: () => (
          <DashboardSectionCard
            title="Top Listings"
            action={<DashboardSectionAction to="/provider/listings">View all</DashboardSectionAction>}
            className={DASHBOARD_OVERVIEW_ROW_WIDGET_CLASS}
            contentClassName={DASHBOARD_OVERVIEW_COMPACT_CONTENT_CLASS}
          >
            {topListings.map((listing) => (
              <Link key={listing.id} to={`/provider/listings/${listing.id}`} data-search-id={`provider-top-${toSearchId(listing.name)}`}>
                <DashboardRecordItem
                  title={listing.name}
                  meta={
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {listing.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Inbox className="h-3 w-3" /> {listing.inquiries}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {listing.rating}
                      </span>
                    </div>
                  }
                />
              </Link>
            ))}
          </DashboardSectionCard>
        ),
      },
      {
        id: "recent-leads",
        title: "Recent leads",
        description: "Prioritize inbound leads and respond faster.",
        defaultSize: "full",
        availableSizes: ["wide", "full"],
        render: () => (
          <DashboardSectionCard
            title="Recent Leads"
            action={
              <div className="flex flex-wrap items-center gap-2">
                <DashboardStatusBadge tone="success" dot>{recentLeads.length} new</DashboardStatusBadge>
                <DashboardSectionAction to="/provider/inbox">View all</DashboardSectionAction>
              </div>
            }
            className="shadow-none"
          >
            <div className="space-y-1">
              {recentLeads.map((lead) => (
                <div key={lead.id} data-search-id={`provider-overview-lead-${lead.id}`}>
                  <DashboardRecordItem
                    leading={
                      <Avatar className="h-9 w-9 shrink-0 border border-border/60">
                        <AvatarFallback className="bg-primary/10 text-[10px] font-medium text-primary">
                          {lead.initials}
                        </AvatarFallback>
                      </Avatar>
                    }
                    title={lead.need}
                    subtitle={`${lead.seeker} · ${lead.posted}`}
                    trailing={
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        {lead.urgent ? <DashboardStatusBadge tone="danger" dot>Urgent</DashboardStatusBadge> : null}
                        <Button size="sm" className="h-7 bg-primary text-xs text-primary-foreground">
                          Send Offer
                        </Button>
                      </div>
                    }
                  />
                </div>
              ))}
            </div>
          </DashboardSectionCard>
        ),
      },
    ],
    [earningsData, recentLeads, stats, topListings],
  );

  const { applyPreset, layout, move, moveTo, reset, resetItem, setSize, showWidget, toggleVisibility } = useDashboardLayout(
    "verinest_dashboard_layout_provider",
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

  if (loading || isLoading) {
    return <BackendLoadingIndicator label="Loading dashboard..." fullscreen />;
  }

  return (
    <div className="animate-in space-y-6 fade-in duration-300">
      <KycAlertBanner variant="provider" />

      <DashboardPageHeader
        title="Welcome back, Provider"
        description="Manage your leads, listings, and payouts."
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
              <CalendarDays className="h-4 w-4" /> <span className="hidden sm:inline">This</span> Month
            </Button>
            <Button size="sm" className="h-9 gap-2 bg-primary text-sm text-primary-foreground" asChild>
              <Link to="/provider/listings/new"><Plus className="h-4 w-4" /> Add Listing</Link>
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
