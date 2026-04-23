import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ArrowUpRight, CheckCircle2, Clock4, Download, Filter, Receipt, Search, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchFocus } from "@/hooks/use-search-focus";
import { DashboardControlRow } from "@/components/dashboard/DashboardControlRow";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { formatCompactCurrency, landlordApi, titleCase } from "@/lib/api";

export const rows = [] as any[];

const stateStyles: Record<string, { className: string }> = {
  Paid: { className: "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:bg-emerald-500/15 dark:border-emerald-500/30 dark:text-emerald-300" },
  "Due tomorrow": { className: "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:bg-amber-500/15 dark:border-amber-500/30 dark:text-amber-300" },
  Overdue: { className: "bg-destructive/5 border-destructive/20 text-destructive" },
};

export default function LandlordCollections() {
  useSearchFocus();
  const [search, setSearch] = useState("");
  const { data = [] } = useQuery({ queryKey: ["/landlord/collections"], queryFn: () => landlordApi.listCollections() });
  const rows = useMemo(() => data.map((row: any) => ({
    id: row.id,
    tenant: row.tenant_user_id ?? "Tenant",
    unit: row.unit_id ?? "Unit",
    property: row.lease_id ?? "Property",
    amount: formatCompactCurrency(Number(row.amount ?? 0)),
    state: titleCase(row.status ?? "due"),
    due: row.due_date ? new Date(row.due_date).toLocaleDateString() : "Pending",
    method: row.currency ?? "NGN",
  })), [data]);

  const filtered = useMemo(
    () =>
      rows.filter((row) =>
        [row.tenant, row.unit, row.state, row.property].some((value) =>
          value.toLowerCase().includes(search.toLowerCase()),
        ),
      ),
    [search],
  );

  const paid = filtered.filter((row) => row.state === "Paid");
  const due = filtered.filter((row) => row.state === "Due tomorrow");
  const overdue = filtered.filter((row) => row.state === "Overdue");

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Collections"
        description="Monitor rent expected, received, due-soon, and overdue items across your occupied units."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Expected", value: "N16.0M", icon: Wallet, accent: "text-foreground", bg: "bg-primary/10", change: "April ledger" },
          { label: "Collected", value: "N15.7M", icon: CheckCircle2, accent: "text-emerald-600", bg: "bg-emerald-500/10", change: "+98% collected" },
          { label: "Due Soon", value: due.length.toString(), icon: Clock4, accent: "text-amber-600", bg: "bg-amber-500/10", change: "Needs reminder" },
          { label: "Overdue", value: overdue.length.toString(), icon: AlertTriangle, accent: "text-destructive", bg: "bg-destructive/10", change: "Escalate follow-up" },
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
              <TabsTrigger value="paid" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Paid ({paid.length})</TabsTrigger>
              <TabsTrigger value="due" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Due Soon ({due.length})</TabsTrigger>
              <TabsTrigger value="overdue" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Overdue ({overdue.length})</TabsTrigger>
            </TabsList>
          }
        />

        {[
          { key: "all", items: filtered },
          { key: "paid", items: paid },
          { key: "due", items: due },
          { key: "overdue", items: overdue },
        ].map((group) => (
          <TabsContent key={group.key} value={group.key}>
            <Card className="border border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <DashboardControlRow
                  left={
                    <div>
                      <CardTitle className="text-base">Rent Ledger</CardTitle>
                      <CardDescription>Showing {group.items.length} collection rows</CardDescription>
                    </div>
                  }
                  right={
                    <>
                      <div className="relative min-w-0 flex-1 lg:w-auto lg:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search ledger..." className="h-9 w-full min-w-0 pl-9 lg:w-[220px]" value={search} onChange={(e) => setSearch(e.target.value)} />
                      </div>
                      <Button variant="outline" size="sm" className="h-9 shrink-0 px-3 sm:px-3.5">
                        <Filter className="h-3.5 w-3.5" /> <span className="sr-only sm:not-sr-only sm:ml-1.5">Filter</span>
                      </Button>
                    </>
                  }
                />
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-3 p-4 sm:hidden">
                  {group.items.map((row) => (
                    <div key={row.id} data-search-id={`landlord-collection-row-${row.id}`} className="rounded-xl border border-border/60 p-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">{row.tenant}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{row.unit} · {row.property}</p>
                        </div>
                        <span className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-medium ${stateStyles[row.state].className}`}>{row.state}</span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Amount</p>
                          <p className="font-semibold text-foreground">{row.amount}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Due</p>
                          <p className="font-medium text-foreground">{row.due}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Receipt className="h-3.5 w-3.5" />
                        {row.method}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="hidden overflow-x-auto sm:block">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Ref</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Tenant</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Unit</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Property</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Amount</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Due</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Status</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Note</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.items.map((row) => (
                      <TableRow key={row.id} data-search-id={`landlord-collection-row-${row.id}`}>
                        <TableCell className="font-mono text-xs text-muted-foreground">{row.id}</TableCell>
                        <TableCell className="text-sm font-medium text-foreground">{row.tenant}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm text-foreground">{row.unit}</p>
                            <p className="text-[11px] text-muted-foreground">{row.due}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{row.property}</TableCell>
                        <TableCell className="text-sm font-semibold text-foreground">{row.amount}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{row.due}</TableCell>
                        <TableCell>
                          <span className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-medium ${stateStyles[row.state].className}`}>{row.state}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Receipt className="h-3.5 w-3.5" />
                            {row.method}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
