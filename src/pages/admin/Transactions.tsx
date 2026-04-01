import { Search, ArrowUpRight, ArrowDownRight, Filter, Download, Wallet, Lock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const transactions = [
  { id: "TXN-4501", amount: "₦2,500,000", type: "Rent", status: "Completed", from: "Emeka Nwankwo", to: "Adebayo Johnson", date: "2024-03-15" },
  { id: "TXN-4502", amount: "₦500,000", type: "Deposit", status: "Escrow", from: "Fatima Abdullahi", to: "Chioma Okafor", date: "2024-03-14" },
  { id: "TXN-4503", amount: "₦150,000", type: "Short-let", status: "Completed", from: "Guest User", to: "Ibrahim Yusuf", date: "2024-03-14" },
  { id: "TXN-4504", amount: "₦1,800,000", type: "Rent", status: "Pending", from: "Oluwaseun Bakare", to: "System", date: "2024-03-13" },
  { id: "TXN-4505", amount: "₦3,200,000", type: "Rent", status: "Failed", from: "New Tenant", to: "Agent Corp", date: "2024-03-12" },
  { id: "TXN-4506", amount: "₦750,000", type: "Deposit", status: "Completed", from: "Chioma Okafor", to: "Landlord X", date: "2024-03-11" },
];

const statusStyles: Record<string, { color: string; bg: string; dot: string }> = {
  Completed: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  Escrow: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", dot: "bg-amber-500" },
  Pending: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200", dot: "bg-blue-500" },
  Failed: { color: "text-red-700", bg: "bg-red-50 border-red-200", dot: "bg-red-500" },
};

const typeStyles: Record<string, string> = {
  Rent: "text-[hsl(263,70%,58%)]",
  Deposit: "text-amber-600",
  "Short-let": "text-blue-600",
};

const summaryCards = [
  { label: "Total Volume (MTD)", value: "₦45,200,000", icon: Wallet, change: "+23.1%", up: true, color: "text-[hsl(263,70%,58%)]", bg: "bg-[hsl(263,70%,58%)]/10" },
  { label: "In Escrow", value: "₦3,750,000", icon: Lock, change: "5 active", up: true, color: "text-amber-600", bg: "bg-amber-500/10" },
  { label: "Failed Transactions", value: "₦3,200,000", icon: XCircle, change: "-12% vs last month", up: false, color: "text-red-600", bg: "bg-red-500/10" },
];

export default function Transactions() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Transactions</h2>
          <p className="text-muted-foreground">Payment reconciliation, escrow & payout tracking</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryCards.map((c) => (
          <Card key={c.label} className="border-0 shadow-sm overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{c.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${c.color}`}>{c.value}</p>
                  <div className={`flex items-center gap-1 text-xs mt-2 ${c.up ? "text-emerald-600" : "text-red-500"}`}>
                    {c.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {c.change}
                  </div>
                </div>
                <div className={`p-2.5 rounded-xl ${c.bg}`}>
                  <c.icon className={`h-5 w-5 ${c.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-lg">Transaction History</CardTitle>
              <CardDescription>Showing 6 recent transactions</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search transactions..." className="pl-9 w-[260px]" />
              </div>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Filter className="h-3.5 w-3.5" />
                Filter
              </Button>
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
              {transactions.map((t) => {
                const s = statusStyles[t.status];
                return (
                  <TableRow key={t.id} className="group">
                    <TableCell className="font-mono text-xs text-muted-foreground">{t.id}</TableCell>
                    <TableCell className="font-bold text-sm">{t.amount}</TableCell>
                    <TableCell>
                      <span className={`text-sm font-medium ${typeStyles[t.type]}`}>{t.type}</span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="text-foreground">{t.from}</span>
                        <span className="text-muted-foreground mx-1.5">→</span>
                        <span className="text-foreground">{t.to}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.bg} ${s.color}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                        {t.status}
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
    </div>
  );
}
