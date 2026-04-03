import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wallet, Lock, Receipt, Download, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const payouts = [
  { id: "PO-301", property: "3 Bed Flat, Lekki Phase 1", amount: "₦2,375,000", platformFee: "₦125,000", type: "Rent", status: "Released", date: "2024-03-15" },
  { id: "PO-302", property: "2 Bed Serviced, VI", amount: "₦42,750", platformFee: "₦2,250", type: "Short-let", status: "Pending", date: "2024-03-18" },
  { id: "PO-303", property: "Studio, Wuse 2", amount: "₦1,140,000", platformFee: "₦60,000", type: "Rent", status: "Escrow", date: "2024-03-20" },
  { id: "PO-304", property: "2 Bed Serviced, VI", amount: "₦85,500", platformFee: "₦4,500", type: "Short-let", status: "Released", date: "2024-03-10" },
];

const statusStyles: Record<string, { color: string; bg: string; dot: string }> = {
  Released: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  Pending: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200", dot: "bg-blue-500" },
  Escrow: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", dot: "bg-amber-500" },
};

const typeStyles: Record<string, string> = {
  Rent: "text-primary",
  "Short-let": "text-amber-600",
};

const summaryCards = [
  { label: "Total Earnings (MTD)", value: "₦3,643,250", icon: Wallet, color: "text-primary", bg: "bg-primary/10", progress: 72 },
  { label: "In Escrow", value: "₦1,140,000", icon: Lock, color: "text-amber-600", bg: "bg-amber-500/10", progress: 31 },
  { label: "Platform Fees", value: "₦191,750", icon: Receipt, color: "text-slate-600", bg: "bg-slate-100", progress: 5 },
];

export default function Payouts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Payouts</h2>
          <p className="text-muted-foreground">Track your earnings, platform fees, and payout status.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryCards.map((c) => (
          <Card key={c.label} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className={`inline-flex p-2.5 rounded-xl ${c.bg} mb-3`}>
                <c.icon className={`h-5 w-5 ${c.color}`} />
              </div>
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <p className={`text-2xl font-bold mt-0.5 ${c.color}`}>{c.value}</p>
              <Progress value={c.progress} className="h-1.5 mt-3" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Payout History</CardTitle>
          <CardDescription>Your earnings and fee breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">ID</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Property</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Your Share</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Platform Fee</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Type</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Status</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((p) => {
                const s = statusStyles[p.status];
                return (
                  <TableRow key={p.id} className="group">
                    <TableCell className="font-mono text-xs text-muted-foreground">{p.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                          <Building2 className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="font-medium text-sm">{p.property}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-sm text-emerald-600">{p.amount}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.platformFee}</TableCell>
                    <TableCell>
                      <span className={`text-sm font-medium ${typeStyles[p.type]}`}>{p.type}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.bg} ${s.color}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                        {p.status}
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
    </div>
  );
}
