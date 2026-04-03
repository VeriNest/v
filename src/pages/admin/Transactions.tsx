import { Search, ArrowUpRight, ArrowDownRight, Filter, Download, Wallet, Lock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const transactions = [
  { id: "TXN-4501", amount: "₦2,500,000", type: "Rent", status: "Completed", from: "Emeka Nwankwo", to: "Adebayo Johnson", date: "Mar 15, 2024" },
  { id: "TXN-4502", amount: "₦500,000", type: "Deposit", status: "Escrow", from: "Fatima Abdullahi", to: "Chioma Okafor", date: "Mar 14, 2024" },
  { id: "TXN-4503", amount: "₦150,000", type: "Short-let", status: "Completed", from: "Guest User", to: "Ibrahim Yusuf", date: "Mar 14, 2024" },
  { id: "TXN-4504", amount: "₦1,800,000", type: "Rent", status: "Pending", from: "Oluwaseun Bakare", to: "System", date: "Mar 13, 2024" },
  { id: "TXN-4505", amount: "₦3,200,000", type: "Rent", status: "Failed", from: "New Tenant", to: "Agent Corp", date: "Mar 12, 2024" },
  { id: "TXN-4506", amount: "₦750,000", type: "Deposit", status: "Completed", from: "Chioma Okafor", to: "Landlord X", date: "Mar 11, 2024" },
];

const statusStyles: Record<string, { color: string; bg: string; dot: string }> = {
  Completed: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  Escrow: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", dot: "bg-amber-500" },
  Pending: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200", dot: "bg-blue-500" },
  Failed: { color: "text-destructive", bg: "bg-destructive/5 border-destructive/20", dot: "bg-destructive" },
};

const typeStyles: Record<string, string> = {
  Rent: "text-primary",
  Deposit: "text-amber-600",
  "Short-let": "text-blue-600",
};

export default function Transactions() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Transactions</h1>
          <p className="text-sm text-muted-foreground mt-1">Payment reconciliation, escrow & payout tracking.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 self-start"><Download className="h-3.5 w-3.5" /> Export CSV</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Total Volume (MTD)", value: "₦45.2M", icon: Wallet, change: "+23.1%", up: true, accent: "text-primary", bg: "bg-primary/10" },
          { label: "In Escrow", value: "₦3.75M", icon: Lock, change: "5 active", up: true, accent: "text-amber-600", bg: "bg-amber-500/10" },
          { label: "Failed", value: "₦3.2M", icon: XCircle, change: "-12% vs last month", up: false, accent: "text-destructive", bg: "bg-destructive/10" },
        ].map((c) => (
          <Card key={c.label} className="border border-border/60 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${c.accent}`}>{c.value}</p>
                  <div className={`flex items-center gap-1 text-xs mt-1.5 ${c.up ? "text-emerald-600" : "text-destructive"}`}>
                    {c.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}{c.change}
                  </div>
                </div>
                <div className={`p-2.5 rounded-xl ${c.bg}`}><c.icon className={`h-5 w-5 ${c.accent}`} /></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 h-auto">
          <TabsTrigger value="all" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">All ({transactions.length})</TabsTrigger>
          <TabsTrigger value="completed" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Completed</TabsTrigger>
          <TabsTrigger value="pending" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Pending/Escrow</TabsTrigger>
          <TabsTrigger value="failed" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Failed</TabsTrigger>
        </TabsList>

        {["all", "completed", "pending", "failed"].map((tab) => {
          const items = tab === "completed" ? transactions.filter(t => t.status === "Completed")
            : tab === "pending" ? transactions.filter(t => t.status === "Escrow" || t.status === "Pending")
            : tab === "failed" ? transactions.filter(t => t.status === "Failed")
            : transactions;
          return (
            <TabsContent key={tab} value={tab}>
              <Card className="border border-border/60 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div><CardTitle className="text-base">Transaction History</CardTitle><CardDescription>Showing {items.length} transactions</CardDescription></div>
                    <div className="flex items-center gap-3">
                      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." className="pl-9 w-[200px] h-9" /></div>
                      <Button variant="outline" size="sm" className="gap-1.5"><Filter className="h-3.5 w-3.5" /> Filter</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">ID</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Amount</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Type</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">From → To</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Status</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((t) => {
                        const s = statusStyles[t.status];
                        return (
                          <TableRow key={t.id}>
                            <TableCell className="font-mono text-xs text-muted-foreground">{t.id}</TableCell>
                            <TableCell className="font-bold text-sm text-foreground">{t.amount}</TableCell>
                            <TableCell><span className={`text-sm font-medium ${typeStyles[t.type]}`}>{t.type}</span></TableCell>
                            <TableCell>
                              <div className="text-sm"><span className="text-foreground">{t.from}</span><span className="text-muted-foreground mx-1.5">→</span><span className="text-foreground">{t.to}</span></div>
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.bg} ${s.color}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />{t.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">{t.date}</TableCell>
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
