import { useMemo, useState } from "react";
import { Building2, CalendarClock, Home, Plus, Wallet, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart } from "recharts";
import { DashboardCustomizerToolbar, DashboardEditableWidget, DashboardHiddenWidgets, DashboardWidgetMenu, type DashboardWidgetMenuControls } from "@/components/dashboard/DashboardCustomizer";
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
import { KycAlertBanner } from "@/components/KycAlertBanner";
import { Button } from "@/components/ui/button";
import { useDashboardLayout, type DashboardWidgetSize } from "@/hooks/use-dashboard-layout";
import { useSearchFocus } from "@/hooks/use-search-focus";
import { toSearchId } from "@/lib/search-id";

const occupancyData = [
  { month: "Jan", occupied: 72 },
  { month: "Feb", occupied: 76 },
  { month: "Mar", occupied: 79 },
  { month: "Apr", occupied: 83 },
  { month: "May", occupied: 81 },
  { month: "Jun", occupied: 85 },
];

const collectionData = [
  { month: "Jan", expected: 14.5, collected: 12.8 },
  { month: "Feb", expected: 14.5, collected: 13.6 },
  { month: "Mar", expected: 15.2, collected: 14.1 },
  { month: "Apr", expected: 15.2, collected: 14.8 },
  { month: "May", expected: 16.0, collected: 15.1 },
  { month: "Jun", expected: 16.0, collected: 15.7 },
];

export const leaseExpiries = [
  { tenant: "The Okafor Family", unit: "Palm Residence B3", due: "12 days", status: "Renewal due" },
  { tenant: "Kingsley Ude", unit: "Lekki Court A2", due: "18 days", status: "Notice pending" },
  { tenant: "Nova Labs", unit: "Admiralty Suites 4C", due: "24 days", status: "Corporate renewal" },
];

export const maintenanceItems = [
  { issue: "Water heater replacement", unit: "Lekki Court A2", priority: "Urgent", age: "2 hrs" },
  { issue: "Generator service request", unit: "Palm Residence B1", priority: "Normal", age: "1 day" },
  { issue: "Ceiling leak inspection", unit: "Admiralty Suites 2A", priority: "Urgent", age: "4 hrs" },
];

export const stats = [
  { title: "Properties", value: "6", change: "18 active units", icon: Building2, subtitle: "Owned assets on platform" },
  { title: "Occupied Units", value: "15", change: "83% occupancy", icon: Home, subtitle: "3 currently vacant" },
  { title: "Collections", value: "N15.7M", change: "98% of expected", icon: Wallet, subtitle: "This month" },
  { title: "Open Issues", value: "7", change: "2 urgent", icon: Wrench, subtitle: "Maintenance and tenant ops" },
];

type WidgetDefinition = {
  id: string;
  title: string;
  description: string;
  defaultSize: DashboardWidgetSize;
  availableSizes: DashboardWidgetSize[];
  render: (controls: DashboardWidgetMenuControls) => JSX.Element;
};

export default function LandlordDashboard() {
  useSearchFocus();
  const [editing, setEditing] = useState(false);

  const widgetDefinitions = useMemo<WidgetDefinition[]>(() => [
    {
      id: "stats",
      title: "Portfolio stats",
      description: "Portfolio size, occupancy, collections, and operational issues.",
      defaultSize: "full",
      availableSizes: ["full"],
      render: () => (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.title} data-search-id={`landlord-stat-${toSearchId(stat.title)}`}>
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
      id: "occupancy",
      title: "Occupancy trend",
      description: "Track occupied versus vacant unit performance over time.",
      defaultSize: "wide",
      availableSizes: ["wide", "full"],
      render: (controls) => (
        <DashboardSectionCard
          title="Occupancy Trend"
          description="Portfolio occupancy over the last 6 months"
          action={<DashboardWidgetMenu controls={controls} />}
          className={DASHBOARD_OVERVIEW_ROW_WIDGET_CLASS}
        >
            <div className={DASHBOARD_OVERVIEW_CHART_HEIGHT_CLASS}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={occupancyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="occupiedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(18, 55%, 58%)" stopOpacity={0.22} />
                      <stop offset="100%" stopColor="hsl(18, 55%, 58%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 12%, 90%)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} />
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(30, 12%, 90%)", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="occupied" stroke="hsl(18, 55%, 58%)" strokeWidth={2} fill="url(#occupiedGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
        </DashboardSectionCard>
      ),
    },
    {
      id: "collections",
      title: "Collections performance",
      description: "Compare expected rent with what has been collected.",
      defaultSize: "compact",
      availableSizes: ["compact", "wide"],
      render: (controls) => (
        <DashboardSectionCard
          title="Collections"
          description="Expected vs collected rent"
          action={<DashboardWidgetMenu controls={controls} />}
          className={DASHBOARD_OVERVIEW_ROW_WIDGET_CLASS}
        >
            <div className={DASHBOARD_OVERVIEW_CHART_HEIGHT_CLASS}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={collectionData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 12%, 90%)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} tickFormatter={(value) => `N${value}M`} />
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(30, 12%, 90%)", fontSize: "12px" }} />
                  <Bar dataKey="expected" fill="hsl(30, 10%, 82%)" radius={[4, 4, 0, 0]} barSize={14} />
                  <Bar dataKey="collected" fill="hsl(18, 55%, 58%)" radius={[4, 4, 0, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
        </DashboardSectionCard>
      ),
    },
    {
      id: "lease-expiry",
      title: "Lease expiries",
      description: "Monitor units that need renewal or notice action soon.",
      defaultSize: "compact",
      availableSizes: ["compact", "wide"],
      render: () => (
        <DashboardSectionCard
          title="Lease Expiries"
          action={<DashboardSectionAction>View all</DashboardSectionAction>}
          className={DASHBOARD_OVERVIEW_ROW_WIDGET_CLASS}
          contentClassName={DASHBOARD_OVERVIEW_COMPACT_CONTENT_CLASS}
        >
            {leaseExpiries.map((lease) => (
              <div key={lease.unit} data-search-id={`landlord-lease-${leaseExpiries.findIndex((item) => item.unit === lease.unit)}`}>
                <DashboardRecordItem
                  title={lease.unit}
                  subtitle={lease.tenant}
                  trailing={<DashboardStatusBadge tone="warning">{lease.due}</DashboardStatusBadge>}
                  meta={<p className="text-xs text-muted-foreground">{lease.status}</p>}
                />
              </div>
            ))}
        </DashboardSectionCard>
      ),
    },
    {
      id: "maintenance",
      title: "Maintenance queue",
      description: "Track open work items across the portfolio.",
      defaultSize: "compact",
      availableSizes: ["compact", "wide"],
      render: () => (
        <DashboardSectionCard
          title="Maintenance Queue"
          action={<DashboardSectionAction to="/landlord/maintenance">Manage</DashboardSectionAction>}
          className={DASHBOARD_OVERVIEW_ROW_WIDGET_CLASS}
          contentClassName={DASHBOARD_OVERVIEW_COMPACT_CONTENT_CLASS}
        >
            {maintenanceItems.map((item) => (
              <div key={item.issue} data-search-id={`landlord-maintenance-overview-${maintenanceItems.findIndex((entry) => entry.issue === item.issue)}`}>
                <DashboardRecordItem
                  title={item.issue}
                  subtitle={item.unit}
                  trailing={<DashboardStatusBadge tone={item.priority === "Urgent" ? "danger" : "neutral"}>{item.priority}</DashboardStatusBadge>}
                  meta={
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{item.unit}</span>
                      <span>{item.age}</span>
                    </div>
                  }
                />
              </div>
            ))}
        </DashboardSectionCard>
        ),
      },
  ], []);

  const { applyPreset, layout, move, moveTo, reset, resetItem, setSize, showWidget, toggleVisibility } = useDashboardLayout("verinest_dashboard_layout_landlord_v2", widgetDefinitions.map((widget) => ({ id: widget.id, size: widget.defaultSize, availableSizes: widget.availableSizes })));
  const widgetMap = useMemo(() => new Map(widgetDefinitions.map((widget) => [widget.id, widget])), [widgetDefinitions]);
  const visibleWidgets = layout.flatMap((item) => {
    const widget = widgetMap.get(item.id);
    return item.visible && widget ? [{ ...widget, visible: item.visible, size: item.size }] : [];
  });
  const hiddenWidgets = layout.flatMap((item) => {
    const widget = widgetMap.get(item.id);
    return !item.visible && widget ? [{ id: item.id, title: widget.title, description: widget.description, visible: item.visible, size: item.size, availableSizes: widget.availableSizes }] : [];
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <KycAlertBanner variant="landlord" />
      <DashboardPageHeader
        title="Welcome back, Landlord"
        description="Monitor occupancy, collections, lease risk, and property operations."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {!editing ? <DashboardCustomizerToolbar editing={editing} hiddenCount={hiddenWidgets.length} onApplyPreset={applyPreset} onEditChange={setEditing} onReset={reset} /> : null}
            <Button variant="outline" size="sm" className="h-9 gap-2 text-sm"><CalendarClock className="h-4 w-4" /> This Month</Button>
            <Button size="sm" className="h-9 gap-2 text-sm" asChild><Link to="/landlord/properties/new"><Plus className="h-4 w-4" /> Add Property</Link></Button>
          </div>
        }
      />

      {editing ? (
        <>
          <DashboardCustomizerToolbar editing={editing} hiddenCount={hiddenWidgets.length} onApplyPreset={applyPreset} onEditChange={setEditing} onReset={reset} />
          <DashboardHiddenWidgets items={hiddenWidgets} onShow={showWidget} />
        </>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-flow-row-dense lg:grid-cols-3">
        {visibleWidgets.map((widget, index) => (
          <DashboardEditableWidget key={widget.id} editing={editing} index={index} item={{ id: widget.id, title: widget.title, description: widget.description, visible: widget.visible, size: widget.size, availableSizes: widget.availableSizes }} total={visibleWidgets.length} onHide={(itemId) => toggleVisibility(itemId, false)} onMove={move} onSizeChange={setSize}>
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
