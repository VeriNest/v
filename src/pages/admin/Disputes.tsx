import { Search, AlertTriangle, AlertCircle, MessageSquare, Filter, Shield, CheckCircle2, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const disputes = [
  { id: "D-101", title: "Fake property listing reported", type: "Fraud", priority: "High", status: "Open", reporter: "Fatima Abdullahi", assigned: "Admin A", date: "2024-03-15" },
  { id: "D-102", title: "Property condition mismatch", type: "Quality", priority: "Medium", status: "In Review", reporter: "Emeka Nwankwo", assigned: "Admin B", date: "2024-03-14" },
  { id: "D-103", title: "Booking cancelled, refund pending", type: "Cancellation", priority: "Low", status: "Open", reporter: "Guest User", assigned: "Unassigned", date: "2024-03-14" },
  { id: "D-104", title: "Agent impersonation attempt", type: "Fraud", priority: "Critical", status: "Escalated", reporter: "System", assigned: "Admin A", date: "2024-03-13" },
  { id: "D-105", title: "Deposit not returned after move-out", type: "Quality", priority: "High", status: "In Review", reporter: "Oluwaseun Bakare", assigned: "Admin C", date: "2024-03-12" },
  { id: "D-106", title: "Misleading photos on listing", type: "Quality", priority: "Medium", status: "Resolved", reporter: "Chioma Okafor", assigned: "Admin B", date: "2024-03-10" },
];

const priorityStyles: Record<string, { color: string; bg: string; dot: string }> = {
  Critical: { color: "text-white", bg: "bg-red-600", dot: "bg-white" },
  High: { color: "text-red-700", bg: "bg-red-50 border border-red-200", dot: "bg-red-500" },
  Medium: { color: "text-amber-700", bg: "bg-amber-50 border border-amber-200", dot: "bg-amber-500" },
  Low: { color: "text-emerald-700", bg: "bg-emerald-50 border border-emerald-200", dot: "bg-emerald-500" },
};

const statusStyles: Record<string, string> = {
  Open: "bg-red-500/10 text-red-600 border-red-500/20",
  "In Review": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Escalated: "bg-[hsl(263,70%,58%)]/10 text-[hsl(263,70%,58%)] border-[hsl(263,70%,58%)]/20",
  Resolved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

const typeIcon: Record<string, { icon: typeof AlertTriangle; color: string; bg: string }> = {
  Fraud: { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" },
  Quality: { icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-50" },
  Cancellation: { icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-50" },
};

const summaryCards = [
  { label: "Open", value: 8, icon: Flame, color: "text-red-600", bg: "bg-red-500/10", progress: 32, total: "of 25 target" },
  { label: "In Review", value: 12, icon: Shield, color: "text-amber-600", bg: "bg-amber-500/10", progress: 48, total: "avg 2.1d resolution" },
  { label: "Escalated", value: 4, icon: AlertTriangle, color: "text-[hsl(263,70%,58%)]", bg: "bg-[hsl(263,70%,58%)]/10", progress: 16, total: "needs attention" },
  { label: "Resolved (MTD)", value: 45, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-500/10", progress: 90, total: "+18% vs last month" },
];

export default function Disputes() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Disputes & Moderation</h2>
        <p className="text-muted-foreground">Review disputes, fraud alerts, and content moderation</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((c) => (
          <Card key={c.label} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-xl ${c.bg}`}>
                  <c.icon className={`h-4 w-4 ${c.color}`} />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <p className={`text-2xl font-bold mt-0.5 ${c.color}`}>{c.value}</p>
              <p className="text-xs text-muted-foreground mt-1 mb-2">{c.total}</p>
              <Progress value={c.progress} className="h-1.5" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-lg">All Disputes</CardTitle>
              <CardDescription>6 disputes requiring attention</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search disputes..." className="pl-9 w-[260px]" />
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
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Issue</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Type</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Priority</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Status</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Assigned</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disputes.map((d) => {
                const p = priorityStyles[d.priority];
                const t = typeIcon[d.type];
                const TIcon = t.icon;
                return (
                  <TableRow key={d.id} className="group">
                    <TableCell className="font-mono text-xs text-muted-foreground">{d.id}</TableCell>
                    <TableCell>
                      <div className="max-w-[220px]">
                        <p className="font-medium text-sm truncate">{d.title}</p>
                        <p className="text-xs text-muted-foreground">{d.reporter}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${t.bg} ${t.color}`}>
                        <TIcon className="h-3.5 w-3.5" />
                        {d.type}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${p.bg} ${p.color}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`} />
                        {d.priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[d.status]}`}>
                        {d.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm ${d.assigned === "Unassigned" ? "text-red-500 font-medium" : "text-muted-foreground"}`}>
                        {d.assigned}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{d.date}</TableCell>
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
