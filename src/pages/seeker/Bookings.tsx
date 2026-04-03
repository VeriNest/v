import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarCheck, Lock, CheckCircle2, Building2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const bookings = [
  { id: "BK-001", property: "3 Bed Flat, Lekki Phase 1", provider: "Adebayo Johnson", amount: "₦2,500,000", status: "Escrow", stage: "Awaiting Viewing", date: "2024-03-20" },
  { id: "BK-002", property: "2 Bed Serviced, VI", provider: "ShortStay NG", amount: "₦135,000", status: "Confirmed", stage: "Check-in Mar 22", date: "2024-03-18" },
  { id: "BK-003", property: "Studio, Wuse 2", provider: "Chioma Okafor", amount: "₦1,200,000", status: "Completed", stage: "Moved In", date: "2024-02-15" },
];

const statusStyles: Record<string, { color: string; bg: string; dot: string }> = {
  Escrow: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", dot: "bg-amber-500" },
  Confirmed: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  Completed: { color: "text-slate-600", bg: "bg-slate-50 border-slate-200", dot: "bg-slate-400" },
  Cancelled: { color: "text-red-700", bg: "bg-red-50 border-red-200", dot: "bg-red-500" },
};

const summaryCards = [
  { label: "Active Bookings", value: "2", icon: CalendarCheck, color: "text-primary", bg: "bg-primary/10", progress: 66 },
  { label: "In Escrow", value: "₦2,500,000", icon: Lock, color: "text-amber-600", bg: "bg-amber-500/10", progress: 45 },
  { label: "Completed", value: "1", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-500/10", progress: 33 },
];

export default function Bookings() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/70 p-6 text-white">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative">
          <h2 className="text-xl font-bold">Bookings & Escrow</h2>
          <p className="text-white/70 text-sm mt-1">Track your active bookings, payments, and escrow timelines.</p>
        </div>
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
          <CardTitle className="text-lg">All Bookings</CardTitle>
          <CardDescription>Your booking history and current status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">ID</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Property</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Provider</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Amount</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Status</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Stage</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => {
                const s = statusStyles[b.status];
                return (
                  <TableRow key={b.id} className="group">
                    <TableCell className="font-mono text-xs text-muted-foreground">{b.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                          <Building2 className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="font-medium text-sm">{b.property}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{b.provider}</TableCell>
                    <TableCell className="font-semibold text-sm">{b.amount}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.bg} ${s.color}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                        {b.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{b.stage}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{b.date}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">View</Button>
                    </TableCell>
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
