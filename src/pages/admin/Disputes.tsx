import { Search, AlertTriangle, AlertCircle, MessageSquare, Filter, Shield, CheckCircle2, Flame, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const disputes = [
  { id: "D-101", title: "Fake property listing reported", type: "Fraud", priority: "High", status: "Open", reporter: "Fatima Abdullahi", assigned: "Admin A", date: "Mar 15, 2024" },
  { id: "D-102", title: "Property condition mismatch", type: "Quality", priority: "Medium", status: "In Review", reporter: "Emeka Nwankwo", assigned: "Admin B", date: "Mar 14, 2024" },
  { id: "D-103", title: "Booking cancelled, refund pending", type: "Cancellation", priority: "Low", status: "Open", reporter: "Guest User", assigned: "Unassigned", date: "Mar 14, 2024" },
  { id: "D-104", title: "Agent impersonation attempt", type: "Fraud", priority: "Critical", status: "Escalated", reporter: "System", assigned: "Admin A", date: "Mar 13, 2024" },
  { id: "D-105", title: "Deposit not returned after move-out", type: "Quality", priority: "High", status: "In Review", reporter: "Oluwaseun Bakare", assigned: "Admin C", date: "Mar 12, 2024" },
  { id: "D-106", title: "Misleading photos on listing", type: "Quality", priority: "Medium", status: "Resolved", reporter: "Chioma Okafor", assigned: "Admin B", date: "Mar 10, 2024" },
];

const priorityStyles: Record<string, { color: string; bg: string; dot: string }> = {
  Critical: { color: "text-background", bg: "bg-destructive", dot: "bg-background" },
  High: { color: "text-destructive", bg: "bg-destructive/5 border-destructive/20", dot: "bg-destructive" },
  Medium: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", dot: "bg-amber-500" },
  Low: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
};

const statusStyles: Record<string, string> = {
  Open: "bg-destructive/10 text-destructive border-destructive/20",
  "In Review": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Escalated: "bg-primary/10 text-primary border-primary/20",
  Resolved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

const typeIcon: Record<string, { icon: typeof AlertTriangle; color: string; bg: string }> = {
  Fraud: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/5" },
  Quality: { icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-50" },
  Cancellation: { icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-50" },
};

export default function Disputes() {
  const open = disputes.filter(d => d.status === "Open" || d.status === "Escalated");
  const inReview = disputes.filter(d => d.status === "In Review");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Disputes & Moderation</h1>
        <p className="text-sm text-muted-foreground mt-1">Review disputes, fraud alerts, and content moderation.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Open", value: "8", icon: Flame, accent: "text-destructive", bg: "bg-destructive/10" },
          { label: "In Review", value: "12", icon: Shield, accent: "text-amber-600", bg: "bg-amber-500/10" },
          { label: "Escalated", value: "4", icon: AlertTriangle, accent: "text-primary", bg: "bg-primary/10" },
          { label: "Resolved (MTD)", value: "45", icon: CheckCircle2, accent: "text-emerald-600", bg: "bg-emerald-500/10" },
        ].map((c) => (
          <Card key={c.label} className="border border-border/60 shadow-sm">
            <CardContent className="p-4 flex items-start gap-3">
              <div className={`p-2 rounded-lg ${c.bg} shrink-0`}><c.icon className={`h-4 w-4 ${c.accent}`} /></div>
              <div>
                <p className="text-xs text-muted-foreground">{c.label}</p>
                <p className={`text-xl font-bold ${c.accent}`}>{c.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 h-auto">
          <TabsTrigger value="all" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">All ({disputes.length})</TabsTrigger>
          <TabsTrigger value="open" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Open ({open.length})</TabsTrigger>
          <TabsTrigger value="review" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">In Review ({inReview.length})</TabsTrigger>
          <TabsTrigger value="resolved" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Resolved</TabsTrigger>
        </TabsList>

        {["all", "open", "review", "resolved"].map((tab) => {
          const items = tab === "open" ? open : tab === "review" ? inReview : tab === "resolved" ? disputes.filter(d => d.status === "Resolved") : disputes;
          return (
            <TabsContent key={tab} value={tab}>
              <Card className="border border-border/60 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div><CardTitle className="text-base">Disputes</CardTitle><CardDescription>{items.length} disputes</CardDescription></div>
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
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Issue</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Type</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Priority</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Status</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Assigned</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Date</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((d) => {
                        const p = priorityStyles[d.priority];
                        const t = typeIcon[d.type];
                        const TIcon = t.icon;
                        return (
                          <TableRow key={d.id} className="group">
                            <TableCell className="font-mono text-xs text-muted-foreground">{d.id}</TableCell>
                            <TableCell>
                              <div className="max-w-[200px]">
                                <p className="font-medium text-sm text-foreground truncate">{d.title}</p>
                                <p className="text-xs text-muted-foreground">{d.reporter}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${t.bg} ${t.color}`}>
                                <TIcon className="h-3.5 w-3.5" />{d.type}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${p.bg} ${p.color}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`} />{d.priority}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[d.status]}`}>{d.status}</span>
                            </TableCell>
                            <TableCell>
                              <span className={`text-sm ${d.assigned === "Unassigned" ? "text-destructive font-medium" : "text-muted-foreground"}`}>{d.assigned}</span>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">{d.date}</TableCell>
                            <TableCell><Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal className="h-4 w-4" /></Button></TableCell>
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
