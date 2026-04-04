import { ArrowUpRight, Building2, Download, Landmark, Lock, Receipt, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const payouts = [
  { id: "LO-401", property: "Palm Residence", stream: "April rent sweep", amount: "N4,950,000", deductions: "N250,000", status: "Released", date: "Apr 05, 2026" },
  { id: "LO-402", property: "Admiralty Suites", stream: "Corporate lease collection", amount: "N2,900,000", deductions: "N150,000", status: "Pending", date: "Apr 08, 2026" },
  { id: "LO-403", property: "Lekki Court", stream: "March arrears recovery", amount: "N1,240,000", deductions: "N60,000", status: "Escrow", date: "Apr 11, 2026" },
  { id: "LO-404", property: "Portfolio Wide", stream: "Short-let owner remittance", amount: "N780,000", deductions: "N45,000", status: "Released", date: "Apr 02, 2026" },
];

const statusStyles: Record<string, { color: string; bg: string; dot: string }> = {
  Released: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  Pending: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200", dot: "bg-blue-500" },
  Escrow: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", dot: "bg-amber-500" },
};

export default function LandlordPayouts() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Payouts</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track owner remittances, deductions, and payout status across your portfolio.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 self-start">
          <Download className="h-3.5 w-3.5" /> Export
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Released MTD", value: "N8.6M", icon: Landmark, accent: "text-primary", bg: "bg-primary/10", change: "+12.4%" },
          { label: "In Escrow", value: "N1.24M", icon: Lock, accent: "text-amber-600", bg: "bg-amber-500/10", change: "1 active hold" },
          { label: "Deductions", value: "N505K", icon: Receipt, accent: "text-muted-foreground", bg: "bg-muted", change: "Ops + platform fees" },
        ].map((card) => (
          <Card key={card.label} className="border border-border/60 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                  <p className={`mt-1 text-2xl font-bold ${card.accent}`}>{card.value}</p>
                  <div className="mt-1.5 flex items-center gap-1 text-xs text-emerald-600">
                    <ArrowUpRight className="h-3 w-3" />
                    {card.change}
                  </div>
                </div>
                <div className={`rounded-xl p-2.5 ${card.bg}`}>
                  <card.icon className={`h-5 w-5 ${card.accent}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 h-auto">
          <TabsTrigger value="all" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">All ({payouts.length})</TabsTrigger>
          <TabsTrigger value="released" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Released</TabsTrigger>
          <TabsTrigger value="pending" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Pending/Escrow</TabsTrigger>
        </TabsList>

        {["all", "released", "pending"].map((tab) => {
          const items = tab === "released" ? payouts.filter((item) => item.status === "Released") : tab === "pending" ? payouts.filter((item) => item.status !== "Released") : payouts;
          return (
            <TabsContent key={tab} value={tab}>
              <Card className="border border-border/60 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">Owner Remittance History</CardTitle>
                      <CardDescription>Portfolio payouts and deduction breakdown</CardDescription>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Search payouts..." className="h-9 w-[220px] pl-9" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="overflow-x-auto p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">ID</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Property</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Stream</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Net Payout</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Deductions</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Status</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((payout) => {
                        const style = statusStyles[payout.status];
                        return (
                          <TableRow key={payout.id}>
                            <TableCell className="font-mono text-xs text-muted-foreground">{payout.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5">
                                  <Building2 className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <span className="text-sm font-medium text-foreground">{payout.property}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{payout.stream}</TableCell>
                            <TableCell className="text-sm font-bold text-emerald-600">{payout.amount}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{payout.deductions}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${style.bg} ${style.color}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                                {payout.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{payout.date}</TableCell>
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
