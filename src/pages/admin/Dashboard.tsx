import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Building2,
  CalendarDays,
  CreditCard,
  Plus,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const stats = [] as any[];
export const recentActivity = [] as any[];

import {
  DashboardCustomizerToolbar,
  DashboardEditableWidget,
  DashboardHiddenWidgets,
  DashboardWidgetMenu,
  type DashboardWidgetMenuControls,
} from "@/components/dashboard/DashboardCustomizer";
import { BackendLoadingIndicator } from "@/components/BackendLoadingIndicator";
import {
  DASHBOARD_OVERVIEW_CHART_HEIGHT_CLASS,
  DASHBOARD_OVERVIEW_COMPACT_CONTENT_CLASS,
  DASHBOARD_OVERVIEW_ROW_WIDGET_CLASS,
} from "@/components/dashboard/overview";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardRecordItem } from "@/components/dashboard/DashboardRecordItem";
import { DashboardSectionAction } from "@/components/dashboard/DashboardSectionAction";
import { DashboardSectionCard } from "@/components/dashboard/DashboardSectionCard";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { DashboardStatusBadge } from "@/components/dashboard/DashboardStatusBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDashboardLayout, type DashboardWidgetSize } from "@/hooks/use-dashboard-layout";
import { useDashboardLoadingSnapshot } from "@/hooks/use-dashboard-loading-snapshot";
import { useSearchFocus } from "@/hooks/use-search-focus";
import { toSearchId } from "@/lib/search-id";
import { adminApi, formatCompactCurrency } from "@/lib/api";

const typeStyles: Record<string, string> = {
  property: "bg-primary/10 text-primary",
  user: "bg-primary/10 text-primary",
  payment: "bg-emerald-500/10 text-emerald-600",
  dispute: "bg-destructive/10 text-destructive",
};

export const quickActions = [
  { label: "Add Property", icon: Building2, to: "/admin/properties" },
  { label: "Manage Users", icon: Users, to: "/admin/users" },
  { label: "View Reports", icon: Activity, to: "/admin/reports" },
  { label: "Schedule", icon: CalendarDays, to: "/admin/announcements" },
];

type WidgetDefinition = {
  id: string;
  title: string;
  description: string;
  defaultSize: DashboardWidgetSize;
  availableSizes: DashboardWidgetSize[];
  render: (controls: DashboardWidgetMenuControls) => JSX.Element;
};

export default function Dashboard() {
  useSearchFocus();
  const [editing, setEditing] = useState(false);
  const loading = useDashboardLoadingSnapshot();
  const { data, isLoading } = useQuery({ queryKey: ["/admin/metrics/overview"], queryFn: () => adminApi.overview() });
  const revenueData = [];
  const propertyData = [];
  const stats = [
    { title: "Total Properties", value: String(data?.totalProperties ?? 0), change: "Live", icon: Building2, subtitle: "Across all listings" },
    { title: "Active Users", value: String(data?.activeUsers ?? 0), change: "Live", icon: Users, subtitle: "Registered accounts" },
    { title: "Monthly Revenue", value: formatCompactCurrency(Number(data?.monthlyRevenue ?? 0)), change: "Current snapshot", icon: CreditCard, subtitle: "Platform earnings" },
    { title: "Open Disputes", value: String(data?.openDisputes ?? 0), change: "Live", icon: AlertTriangle, subtitle: "Pending resolution" },
  ];
  const recentActivity = ((data?.activity as any[]) ?? []).slice(0, 5).map((item, index) => ({ id: index + 1, action: item.action ?? "Activity", user: item.email ?? item.user ?? "System", time: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "now", avatar: "AD", type: "property" }));
  const widgetDefinitions = useMemo<WidgetDefinition[]>(
    () => [
      {
        id: "stats",
        title: "Key stats",
        description: "Summary metrics for properties, users, revenue, and disputes.",
        defaultSize: "full",
        availableSizes: ["full"],
        render: () => (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.title} data-search-id={`admin-stat-${toSearchId(stat.title)}`}>
                <DashboardStatCard
                  title={stat.title}
                  value={stat.value}
                  subtitle={stat.subtitle}
                  change={stat.change}
                  icon={stat.icon}
                />
              </div>
            ))}
          </div>
        ),
      },
      {
        id: "revenue-overview",
        title: "Revenue overview",
        description: "Track monthly revenue and user growth.",
        defaultSize: "wide",
        availableSizes: ["wide", "full"],
        render: (controls) => (
          <DashboardSectionCard
            title="Revenue Overview"
            description="Monthly revenue and user growth"
            action={<DashboardWidgetMenu controls={controls} />}
            className={DASHBOARD_OVERVIEW_ROW_WIDGET_CLASS}
          >
              <div className={DASHBOARD_OVERVIEW_CHART_HEIGHT_CLASS}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(18, 55%, 58%)" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="hsl(18, 55%, 58%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 12%, 90%)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} tickFormatter={(value) => `₦${value}M`} />
                    <Tooltip
                      contentStyle={{ borderRadius: "8px", border: "1px solid hsl(30, 12%, 90%)", fontSize: "12px" }}
                      formatter={(value: number) => [`₦${value}M`, "Revenue"]}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(18, 55%, 58%)" strokeWidth={2} fill="url(#revenueGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
          </DashboardSectionCard>
        ),
      },
      {
        id: "property-activity",
        title: "Property activity",
        description: "Compare listed and sold inventory over the week.",
        defaultSize: "compact",
        availableSizes: ["compact", "wide"],
        render: (controls) => (
          <DashboardSectionCard
            title="Property Activity"
            description="Listed vs sold this week"
            action={<DashboardWidgetMenu controls={controls} />}
            className={DASHBOARD_OVERVIEW_ROW_WIDGET_CLASS}
          >
              <div className={DASHBOARD_OVERVIEW_CHART_HEIGHT_CLASS}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={propertyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 12%, 90%)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(30, 12%, 90%)", fontSize: "12px" }} />
                    <Bar dataKey="listed" fill="hsl(18, 55%, 58%)" radius={[4, 4, 0, 0]} barSize={14} opacity={0.8} />
                    <Bar dataKey="sold" fill="hsl(18, 55%, 42%)" radius={[4, 4, 0, 0]} barSize={14} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
          </DashboardSectionCard>
        ),
      },
      {
        id: "recent-activity",
        title: "Recent activity",
        description: "Monitor live platform events across the marketplace.",
        defaultSize: "wide",
        availableSizes: ["wide", "full"],
        render: () => (
          <DashboardSectionCard
            title="Recent Activity"
            action={
              <div className="flex flex-wrap items-center gap-2">
                <DashboardStatusBadge tone="success" dot>Live</DashboardStatusBadge>
                <DashboardSectionAction>View all</DashboardSectionAction>
              </div>
            }
            className={DASHBOARD_OVERVIEW_ROW_WIDGET_CLASS}
          >
              <div className="space-y-1">
                {recentActivity.map((item) => (
                  <div key={item.id} data-search-id={`admin-activity-${item.id}`}>
                    <DashboardRecordItem
                      leading={
                        <Avatar className="h-9 w-9 border border-border/60">
                          <AvatarFallback className={`text-[10px] font-medium ${typeStyles[item.type]}`}>
                            {item.avatar}
                          </AvatarFallback>
                        </Avatar>
                      }
                      title={item.action}
                      subtitle={`by ${item.user}`}
                      trailing={<span className="text-xs text-muted-foreground">{item.time}</span>}
                    />
                  </div>
                ))}
              </div>
          </DashboardSectionCard>
        ),
      },
      {
        id: "quick-actions",
        title: "Quick actions",
        description: "Jump into common admin tasks and monitor platform health.",
        defaultSize: "compact",
        availableSizes: ["compact", "wide"],
        render: () => (
          <DashboardSectionCard title="Quick Actions" className={DASHBOARD_OVERVIEW_ROW_WIDGET_CLASS} contentClassName={DASHBOARD_OVERVIEW_COMPACT_CONTENT_CLASS}>
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.to}
                  className="flex w-full items-center gap-3 rounded-xl border border-border/60 p-3 text-left"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/8">
                    <action.icon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{action.label}</span>
                  <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
                </Link>
              ))}

              <div className="mt-4 rounded-xl border border-border/40 bg-accent/50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Platform Health</span>
                  <DashboardStatusBadge tone="success">Healthy</DashboardStatusBadge>
                </div>
                <div className="space-y-2.5">
                  <div>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-muted-foreground">Server uptime</span>
                      <span className="font-medium text-foreground">99.98%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-border/60">
                      <div className="h-full w-[99.98%] rounded-full bg-emerald-500" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-muted-foreground">API response</span>
                      <span className="font-medium text-foreground">124ms</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-border/60">
                      <div className="h-full w-[85%] rounded-full bg-primary" />
                    </div>
                  </div>
                  </div>
                </div>
          </DashboardSectionCard>
        ),
      },
    ],
    [],
  );

  const { applyPreset, layout, move, moveTo, reset, resetItem, setSize, showWidget, toggleVisibility } = useDashboardLayout(
    "verinest_dashboard_layout_admin",
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
    <div className="space-y-6 animate-in fade-in duration-300">
      <DashboardPageHeader
        title="Welcome back, Admin"
        description="Here's your platform overview."
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
              <CalendarDays className="h-4 w-4" /> <span className="hidden sm:inline">Last</span> 30 days
            </Button>
            <Button size="sm" className="h-9 gap-2 text-sm" asChild>
              <Link to="/admin/properties"><Plus className="h-4 w-4" /> Add Property</Link>
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
