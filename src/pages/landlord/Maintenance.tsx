import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, ArrowUpRight, Filter, Plus, Search, ShieldCheck, Wrench } from "lucide-react";
import { DashboardControlRow } from "@/components/dashboard/DashboardControlRow";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";

const issues = [
  { issue: "Water heater replacement", unit: "Lekki Court A2", priority: "Urgent", assigned: "Vendor pending", status: "Open", age: "2 hrs", note: "Tenant without hot water" },
  { issue: "Generator service request", unit: "Palm Residence B1", priority: "Normal", assigned: "PowerFix Ltd", status: "In progress", age: "1 day", note: "Vendor scheduled for 4PM" },
  { issue: "Ceiling leak inspection", unit: "Admiralty Suites 2A", priority: "Urgent", assigned: "Rapid Repairs", status: "Open", age: "4 hrs", note: "Leak worsened after rain" },
  { issue: "Gate access lock fault", unit: "Palm Residence A3", priority: "Normal", assigned: "Resolved", status: "Resolved", age: "Closed today", note: "Main gate lock replaced" },
];

const statusStyles: Record<string, string> = {
  Open: "bg-primary/10 text-primary border-primary/20",
  "In progress": "bg-amber-50 text-amber-700 border-amber-200",
  Resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const priorityStyles: Record<string, string> = {
  Urgent: "text-[10px] border-red-200 bg-red-50 text-red-600",
  Normal: "text-[10px] border-border bg-muted text-muted-foreground",
};

export default function LandlordMaintenance() {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => issues.filter((item) => [item.issue, item.unit, item.assigned].some((value) => value.toLowerCase().includes(search.toLowerCase()))), [search]);
  const open = filtered.filter((item) => item.status === "Open");
  const inProgress = filtered.filter((item) => item.status === "In progress");
  const resolved = filtered.filter((item) => item.status === "Resolved");

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Maintenance"
        description="Operational queue for repairs, inspections, vendor follow-up, and resolution tracking."
        actions={
          <Button size="sm" className="gap-1.5" asChild>
            <Link to="/landlord/maintenance/new">
              <Plus className="h-3.5 w-3.5" /> Add Issue
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Open", value: open.length.toString(), icon: AlertTriangle, accent: "text-destructive", bg: "bg-destructive/10", change: "Needs action" },
          { label: "In Progress", value: inProgress.length.toString(), icon: Wrench, accent: "text-amber-600", bg: "bg-amber-500/10", change: "Vendor assigned" },
          { label: "Resolved", value: resolved.length.toString(), icon: ShieldCheck, accent: "text-emerald-600", bg: "bg-emerald-500/10", change: "Closed this week" },
          { label: "Urgent", value: filtered.filter((item) => item.priority === "Urgent").length.toString(), icon: AlertTriangle, accent: "text-primary", bg: "bg-primary/10", change: "Escalate now" },
        ].map((item) => (
          <Card key={item.label} className="border border-border/60 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className={`mt-1 text-2xl font-bold ${item.accent}`}>{item.value}</p>
                  <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <ArrowUpRight className="h-3 w-3" />
                    {item.change}
                  </div>
                </div>
                <div className={`rounded-xl p-2.5 ${item.bg}`}>
                  <item.icon className={`h-5 w-5 ${item.accent}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <DashboardControlRow
          left={
            <TabsList className="h-auto max-w-full flex-wrap justify-start bg-muted/50 p-1">
              <TabsTrigger value="all" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">All ({filtered.length})</TabsTrigger>
              <TabsTrigger value="open" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Open ({open.length})</TabsTrigger>
              <TabsTrigger value="progress" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">In Progress ({inProgress.length})</TabsTrigger>
              <TabsTrigger value="resolved" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Resolved ({resolved.length})</TabsTrigger>
            </TabsList>
          }
          right={
            <>
              <div className="relative flex-1 lg:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search work orders..." className="h-9 w-full pl-9 lg:w-[220px]" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
                <Filter className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Filter</span>
              </Button>
            </>
          }
        />

        {[
          { key: "all", items: filtered },
          { key: "open", items: open },
          { key: "progress", items: inProgress },
          { key: "resolved", items: resolved },
        ].map((group) => (
          <TabsContent key={group.key} value={group.key}>
            <div className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 xl:grid-cols-3">
              {group.items.map((item) => (
                <Card key={item.issue} className="border border-border/60 shadow-sm">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-foreground">{item.issue}</p>
                          <Badge variant="outline" className={`shrink-0 whitespace-nowrap ${priorityStyles[item.priority]}`}>{item.priority}</Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{item.unit}</p>
                      </div>
                      <Badge variant="outline" className={`shrink-0 whitespace-nowrap text-[10px] ${statusStyles[item.status]}`}>{item.status}</Badge>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Assigned</p>
                        <p className="font-medium text-foreground">{item.assigned}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Age</p>
                        <p className="font-medium text-foreground">{item.age}</p>
                      </div>
                    </div>

                    <div className="mt-3 border-t border-border/50 pt-3">
                      <p className="text-xs text-muted-foreground">{item.note}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
