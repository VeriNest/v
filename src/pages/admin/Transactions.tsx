import { Search, ArrowUpRight, ArrowDownRight, Filter, Download, Wallet, Lock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className={`text-xl sm:text-2xl font-bold mt-1 ${c.accent}`}>{c.value}</p>
                  <div className={`flex items-center gap-1 text-xs mt-1.5 ${c.up ? "text-emerald-600" : "text-destructive"}`}>
                    {c.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}{c.change}
                  </div>
                </div>
                <div className={`p-2 sm:p-2.5 rounded-xl ${c.bg}`}><c.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${c.accent}`} /></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 h-auto flex-wrap">
          <TabsTrigger value="all" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">All ({transactions.length})</TabsTrigger>
          <TabsTrigger value="completed" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Completed</TabsTrigger>
          <TabsTrigger value="pending" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Pending</TabsTrigger>
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div><CardTitle className="text-base">Transaction History</CardTitle><CardDescription>Showing {items.length} transactions</CardDescription></div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative flex-1 sm:flex-none"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." className="pl-9 w-full sm:w-[200px] h-9" /></div>
                      <Button variant="outline" size="sm" className="gap-1.5 shrink-0"><Filter className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Filter</span></Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                  {/* Mobile card list */}
                  <div className="sm:hidden space-y-3">
                    {items.map((t) => {
                      const s = statusStyles[t.status];
                      return (
                        <div key={t.id} className="p-3 rounded-lg border border-border/40 bg-background space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-foreground">{t.amount}</span>
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${s.bg} ${s.color}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />{t.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className={`font-medium ${typeStyles[t.type]}`}>{t.type}</span>
                            <span>·</span>
                            <span className="font-mono">{t.id}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {t.from} → {t.to}
                          </p>
                          <p className="text-[11px] text-muted-foreground">{t.date}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Desktop table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/60">
                          <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/70 py-3 px-4">ID</th>
                          <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/70 py-3 px-4">Amount</th>
                          <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/70 py-3 px-4">Type</th>
                          <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/70 py-3 px-4">From → To</th>
                          <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/70 py-3 px-4">Status</th>
                          <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/70 py-3 px-4">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((t) => {
                          const s = statusStyles[t.status];
                          return (
                            <tr key={t.id} className="border-b border-border/40">
                              <td className="font-mono text-xs text-muted-foreground py-3 px-4">{t.id}</td>
                              <td className="font-bold text-sm text-foreground py-3 px-4">{t.amount}</td>
                              <td className="py-3 px-4"><span className={`text-sm font-medium ${typeStyles[t.type]}`}>{t.type}</span></td>
                              <td className="py-3 px-4">
                                <div className="text-sm"><span className="text-foreground">{t.from}</span><span className="text-muted-foreground mx-1.5">→</span><span className="text-foreground">{t.to}</span></div>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.bg} ${s.color}`}>
                                  <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />{t.status}
                                </span>
                              </td>
                              <td className="text-muted-foreground text-sm py-3 px-4">{t.date}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
