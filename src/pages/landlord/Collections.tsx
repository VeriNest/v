import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Wallet, AlertTriangle, CheckCircle2, Clock4 } from "lucide-react";

const rows = [
  { tenant: "Bode Akin", unit: "Palm Residence A1", amount: "N850,000", state: "Paid", due: "Apr 02" },
  { tenant: "Amber Foods", unit: "Admiralty Suites 5B", amount: "N1,450,000", state: "Due tomorrow", due: "Apr 07" },
  { tenant: "Ruth Samuel", unit: "Lekki Court B2", amount: "N620,000", state: "Overdue", due: "Apr 01" },
  { tenant: "Nova Labs", unit: "Admiralty Suites 4C", amount: "N1,450,000", state: "Paid", due: "Apr 03" },
];

export default function LandlordCollections() {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => rows.filter((row) => [row.tenant, row.unit, row.state].some((value) => value.toLowerCase().includes(search.toLowerCase()))), [search]);
  const paid = filtered.filter((row) => row.state === "Paid");
  const due = filtered.filter((row) => row.state === "Due tomorrow");
  const overdue = filtered.filter((row) => row.state === "Overdue");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Collections</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor expected rent, payment status, and follow-up risk across your units.</p>
        </div>
        <div className="relative w-full sm:w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search ledger..." className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Expected", value: "N16.0M", icon: Wallet, accent: "text-foreground", bg: "bg-primary/10" },
          { label: "Collected", value: "N15.7M", icon: CheckCircle2, accent: "text-emerald-600", bg: "bg-emerald-500/10" },
          { label: "Due Soon", value: due.length.toString(), icon: Clock4, accent: "text-amber-600", bg: "bg-amber-500/10" },
          { label: "Overdue", value: overdue.length.toString(), icon: AlertTriangle, accent: "text-destructive", bg: "bg-destructive/10" },
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
          <TabsTrigger value="paid" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Paid ({paid.length})</TabsTrigger>
          <TabsTrigger value="due" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Due Soon ({due.length})</TabsTrigger>
          <TabsTrigger value="overdue" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Overdue ({overdue.length})</TabsTrigger>
        </TabsList>

        {[
          { key: "all", items: filtered },
          { key: "paid", items: paid },
          { key: "due", items: due },
          { key: "overdue", items: overdue },
        ].map((group) => (
          <TabsContent key={group.key} value={group.key}>
            <Card className="border border-border/60 shadow-sm">
              <CardHeader className="pb-3"><CardTitle className="text-base">Rent Ledger Snapshot</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {group.items.map((row) => (
                  <div key={row.unit} className="flex flex-col gap-2 rounded-xl border border-border/60 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{row.tenant}</p>
                      <p className="text-xs text-muted-foreground">{row.unit} • Due {row.due}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-foreground">{row.amount}</span>
                      <span className={`text-xs ${row.state === "Paid" ? "text-emerald-600" : row.state === "Overdue" ? "text-destructive" : "text-amber-600"}`}>{row.state}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
