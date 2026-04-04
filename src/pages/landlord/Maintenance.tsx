import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Search, ShieldCheck, Wrench } from "lucide-react";

const issues = [
  { issue: "Water heater replacement", unit: "Lekki Court A2", priority: "Urgent", assigned: "Vendor pending", status: "Open" },
  { issue: "Generator service request", unit: "Palm Residence B1", priority: "Normal", assigned: "PowerFix Ltd", status: "In progress" },
  { issue: "Ceiling leak inspection", unit: "Admiralty Suites 2A", priority: "Urgent", assigned: "Rapid Repairs", status: "Open" },
  { issue: "Gate access lock fault", unit: "Palm Residence A3", priority: "Normal", assigned: "Resolved", status: "Resolved" },
];

export default function LandlordMaintenance() {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => issues.filter((item) => [item.issue, item.unit, item.assigned].some((value) => value.toLowerCase().includes(search.toLowerCase()))), [search]);
  const open = filtered.filter((item) => item.status === "Open");
  const inProgress = filtered.filter((item) => item.status === "In progress");
  const resolved = filtered.filter((item) => item.status === "Resolved");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Maintenance</h1>
          <p className="text-sm text-muted-foreground mt-1">Operational queue for repairs, inspections, vendor follow-up, and resolution tracking.</p>
        </div>
        <div className="relative w-full sm:w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search work orders..." className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Open", value: open.length.toString(), icon: AlertTriangle, accent: "text-destructive", bg: "bg-destructive/10" },
          { label: "In Progress", value: inProgress.length.toString(), icon: Wrench, accent: "text-amber-600", bg: "bg-amber-500/10" },
          { label: "Resolved", value: resolved.length.toString(), icon: ShieldCheck, accent: "text-emerald-600", bg: "bg-emerald-500/10" },
          { label: "Urgent", value: filtered.filter((item) => item.priority === "Urgent").length.toString(), icon: AlertTriangle, accent: "text-primary", bg: "bg-primary/10" },
        ].map((item) => (
          <Card key={item.label} className="border border-border/60 shadow-sm">
            <CardContent className="p-4 flex items-start gap-3">
              <div className={`p-2 rounded-lg ${item.bg} shrink-0`}><item.icon className={`h-4 w-4 ${item.accent}`} /></div>
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className={`text-lg font-bold ${item.accent}`}>{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 h-auto">
          <TabsTrigger value="all" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">All ({filtered.length})</TabsTrigger>
          <TabsTrigger value="open" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Open ({open.length})</TabsTrigger>
          <TabsTrigger value="progress" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">In Progress ({inProgress.length})</TabsTrigger>
          <TabsTrigger value="resolved" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Resolved ({resolved.length})</TabsTrigger>
        </TabsList>

        {[
          { key: "all", items: filtered },
          { key: "open", items: open },
          { key: "progress", items: inProgress },
          { key: "resolved", items: resolved },
        ].map((group) => (
          <TabsContent key={group.key} value={group.key} className="space-y-3">
            {group.items.map((item) => (
              <Card key={item.issue} className="border border-border/60 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-foreground">{item.issue}</p>
                      <Badge variant="outline" className={item.priority === "Urgent" ? "text-[10px] border-red-200 bg-red-50 text-red-600" : "text-[10px] border-border bg-muted text-muted-foreground"}>{item.priority}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{item.unit}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.assigned}</p>
                  </div>
                  <Badge variant="outline" className={`text-[10px] ${item.status === "Resolved" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : item.status === "In progress" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"}`}>{item.status}</Badge>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
