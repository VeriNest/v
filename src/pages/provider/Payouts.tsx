import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wallet, Lock, Receipt, Download, Building2, ArrowUpRight, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardControlRow } from "@/components/dashboard/DashboardControlRow";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";

const payouts = [
  { id: "PO-301", property: "3 Bed Flat, Lekki Phase 1", amount: "₦2,375,000", platformFee: "₦125,000", type: "Rent", status: "Released", date: "Mar 15, 2024" },
  { id: "PO-302", property: "2 Bed Serviced, VI", amount: "₦42,750", platformFee: "₦2,250", type: "Short-let", status: "Pending", date: "Mar 18, 2024" },
  { id: "PO-303", property: "Studio, Wuse 2", amount: "₦1,140,000", platformFee: "₦60,000", type: "Rent", status: "Escrow", date: "Mar 20, 2024" },
  { id: "PO-304", property: "2 Bed Serviced, VI", amount: "₦85,500", platformFee: "₦4,500", type: "Short-let", status: "Released", date: "Mar 10, 2024" },
];

const statusStyles: Record<string, { color: string; bg: string; dot: string }> = {
  Released: { color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-500/10 border-emerald-500/20 dark:bg-emerald-500/15 dark:border-emerald-500/30", dot: "bg-emerald-500" },
  Pending: { color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-500/10 border-blue-500/20 dark:bg-blue-500/15 dark:border-blue-500/30", dot: "bg-blue-500" },
  Escrow: { color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-500/10 border-amber-500/20 dark:bg-amber-500/15 dark:border-amber-500/30", dot: "bg-amber-500" },
};

const typeStyles: Record<string, string> = { Rent: "text-primary", "Short-let": "text-amber-600" };

export default function Payouts() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Payouts"
        description="Track your earnings, platform fees, and payout status."
        actions={<Button variant="outline" size="sm" className="gap-2"><Download className="h-3.5 w-3.5" /> Export</Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Total Earnings (MTD)", value: "₦3,643,250", icon: Wallet, accent: "text-primary", bg: "bg-primary/10", change: "+23.1%" },
          { label: "In Escrow", value: "₦1,140,000", icon: Lock, accent: "text-amber-600", bg: "bg-amber-500/10", change: "1 active" },
          { label: "Platform Fees", value: "₦191,750", icon: Receipt, accent: "text-muted-foreground", bg: "bg-muted", change: "5% commission" },
        ].map((c) => (
          <Card key={c.label} className="border border-border/60 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${c.accent}`}>{c.value}</p>
                  <div className="flex items-center gap-1 text-xs mt-1.5 text-emerald-600">
                    <ArrowUpRight className="h-3 w-3" />{c.change}
                  </div>
                </div>
                <div className={`p-2.5 rounded-xl ${c.bg}`}><c.icon className={`h-5 w-5 ${c.accent}`} /></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <DashboardControlRow
          left={
            <TabsList className="bg-muted/50 p-1 h-auto">
              <TabsTrigger value="all" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">All ({payouts.length})</TabsTrigger>
              <TabsTrigger value="released" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Released</TabsTrigger>
              <TabsTrigger value="pending" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Pending/Escrow</TabsTrigger>
            </TabsList>
          }
        />

        {["all", "released", "pending"].map((tab) => {
          const items = tab === "released" ? payouts.filter(p => p.status === "Released") : tab === "pending" ? payouts.filter(p => p.status !== "Released") : payouts;
          return (
            <TabsContent key={tab} value={tab}>
              <Card className="border border-border/60 shadow-sm">
                <CardHeader className="pb-3">
                  <DashboardControlRow
                    left={<div><CardTitle className="text-base">Payout History</CardTitle><CardDescription>Your earnings and fee breakdown</CardDescription></div>}
                    right={
                      <>
                        <div className="relative min-w-0 flex-1 lg:w-auto lg:flex-none"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." className="pl-9 w-full min-w-0 h-9 lg:w-[200px]" /></div>
                        <Button variant="outline" size="sm" className="h-9 shrink-0 px-3 sm:px-3.5"><Filter className="h-3.5 w-3.5" /> <span className="sr-only sm:not-sr-only sm:ml-1.5">Filter</span></Button>
                      </>
                    }
                  />
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">ID</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Property</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Your Share</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Fee</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Type</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Status</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((p) => {
                        const s = statusStyles[p.status];
                        return (
                          <TableRow key={p.id}>
                            <TableCell className="font-mono text-xs text-muted-foreground">{p.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center"><Building2 className="h-3.5 w-3.5 text-primary" /></div>
                                <span className="font-medium text-sm text-foreground">{p.property}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-bold text-sm text-emerald-600">{p.amount}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{p.platformFee}</TableCell>
                            <TableCell><span className={`text-sm font-medium ${typeStyles[p.type]}`}>{p.type}</span></TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.bg} ${s.color}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />{p.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">{p.date}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
