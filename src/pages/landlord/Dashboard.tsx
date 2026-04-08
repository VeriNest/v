import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Building2, CalendarClock, DoorOpen, Home, Plus, Wallet, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart } from "recharts";
import { DashboardCustomizerToolbar, DashboardEditableWidget, DashboardHiddenWidgets, DashboardWidgetMenu, type DashboardWidgetMenuControls } from "@/components/dashboard/DashboardCustomizer";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import { KycAlertBanner } from "@/components/KycAlertBanner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export const collectionAlerts = [
  { tenant: "Bode Akin", unit: "Palm Residence A1", amount: "N850,000", state: "Overdue 5 days" },
  { tenant: "Amber Foods", unit: "Admiralty Suites 5B", amount: "N1,450,000", state: "Due tomorrow" },
  { tenant: "Ruth Samuel", unit: "Lekki Court B2", amount: "N620,000", state: "Part payment pending" },
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

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
            <Card key={stat.title} data-search-id={`landlord-stat-${toSearchId(stat.title)}`} className="border border-border/60 shadow-none">
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
      id: "occupancy",
      title: "Occupancy trend",
      description: "Track occupied versus vacant unit performance over time.",
      defaultSize: "wide",
      availableSizes: ["wide", "full"],
      render: (controls) => (
        <Card className="border border-border/60 shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Occupancy Trend</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">Portfolio occupancy over the last 6 months</p>
              </div>
              <DashboardWidgetMenu controls={controls} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[240px]">
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
          </CardContent>
        </Card>
      ),
    },
    {
      id: "collections",
      title: "Collections performance",
      description: "Compare expected rent with what has been collected.",
      defaultSize: "compact",
      availableSizes: ["compact", "wide"],
      render: (controls) => (
        <Card className="border border-border/60 shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Collections</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">Expected vs collected rent</p>
              </div>
              <DashboardWidgetMenu controls={controls} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[240px]">
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
          </CardContent>
        </Card>
      ),
    },
    {
      id: "lease-expiry",
      title: "Lease expiries",
      description: "Monitor units that need renewal or notice action soon.",
      defaultSize: "compact",
      availableSizes: ["compact", "wide"],
      render: () => (
        <Card className="border border-border/60 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Lease Expiries</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 text-xs text-primary">View all</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {leaseExpiries.map((lease) => (
              <div key={lease.unit} data-search-id={`landlord-lease-${leaseExpiries.findIndex((item) => item.unit === lease.unit)}`} className="rounded-xl border border-border/60 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{lease.unit}</p>
                    <p className="text-xs text-muted-foreground">{lease.tenant}</p>
                  </div>
                  <Badge variant="outline" className="shrink-0 whitespace-nowrap text-[10px] border-amber-200 bg-amber-50 text-amber-700">{lease.due}</Badge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{lease.status}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ),
    },
    {
      id: "rent-alerts",
      title: "Collections alerts",
      description: "Surface overdue, due-soon, and part-payment rent items.",
      defaultSize: "wide",
      availableSizes: ["wide", "full"],
      render: () => (
        <Card className="border border-border/60 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-base font-semibold">Collections Alerts</CardTitle>
                <Badge variant="outline" className="inline-flex h-auto min-h-5 shrink-0 items-center gap-1 whitespace-nowrap px-2 py-0.5 text-[10px] font-normal">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Action needed
                </Badge>
              </div>
              <Button variant="ghost" size="sm" className="h-8 self-start text-xs text-primary sm:self-auto" asChild>
                <Link to="/landlord/collections">Open ledger <ArrowRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {collectionAlerts.map((alert) => (
                <div key={alert.unit} data-search-id={`landlord-collection-alert-${collectionAlerts.findIndex((item) => item.unit === alert.unit)}`} className="flex flex-col gap-2 rounded-lg border border-border/60 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{alert.tenant}</p>
                    <p className="text-xs text-muted-foreground">{alert.unit}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <span className="text-sm font-semibold text-foreground">{alert.amount}</span>
                    <Badge variant="outline" className="shrink-0 whitespace-nowrap text-[10px] border-amber-200 bg-amber-50 text-amber-700">{alert.state}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "maintenance",
      title: "Maintenance queue",
      description: "Track open work items across the portfolio.",
      defaultSize: "compact",
      availableSizes: ["compact", "wide"],
      render: () => (
        <Card className="border border-border/60 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Maintenance Queue</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 text-xs text-primary" asChild><Link to="/landlord/maintenance">Manage</Link></Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {maintenanceItems.map((item) => (
              <div key={item.issue} data-search-id={`landlord-maintenance-overview-${maintenanceItems.findIndex((entry) => entry.issue === item.issue)}`} className="rounded-xl border border-border/60 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">{item.issue}</p>
                  <Badge variant="outline" className={item.priority === "Urgent" ? "text-[10px] border-red-200 bg-red-50 text-red-600" : "text-[10px] border-border bg-muted text-muted-foreground"}>{item.priority}</Badge>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{item.unit}</span>
                  <span>{item.age}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        ),
      },
  ], []);

  const { applyPreset, layout, move, moveTo, reset, resetItem, setSize, showWidget, toggleVisibility } = useDashboardLayout("dwello_dashboard_layout_landlord", widgetDefinitions.map((widget) => ({ id: widget.id, size: widget.defaultSize, availableSizes: widget.availableSizes })));
  const widgetMap = useMemo(() => new Map(widgetDefinitions.map((widget) => [widget.id, widget])), [widgetDefinitions]);
  const visibleWidgets = layout.flatMap((item) => {
    const widget = widgetMap.get(item.id);
    return item.visible && widget ? [{ ...widget, visible: item.visible, size: item.size }] : [];
  });
  const hiddenWidgets = layout.flatMap((item) => {
    const widget = widgetMap.get(item.id);
    return !item.visible && widget ? [{ id: item.id, title: widget.title, description: widget.description, visible: item.visible, size: item.size, availableSizes: widget.availableSizes }] : [];
  });

  if (loading) return <DashboardSkeleton variant="landlord" />;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <KycAlertBanner variant="landlord" />
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Welcome back, Landlord</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Monitor occupancy, collections, lease risk, and property operations.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!editing ? <DashboardCustomizerToolbar editing={editing} hiddenCount={hiddenWidgets.length} onApplyPreset={applyPreset} onEditChange={setEditing} onReset={reset} /> : null}
          <Button variant="outline" size="sm" className="h-9 gap-2 text-sm"><CalendarClock className="h-4 w-4" /> This Month</Button>
          <Button size="sm" className="h-9 gap-2 text-sm" asChild><Link to="/landlord/properties/new"><Plus className="h-4 w-4" /> Add Property</Link></Button>
        </div>
      </div>

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
