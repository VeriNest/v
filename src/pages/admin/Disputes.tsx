import { Search, AlertTriangle, AlertCircle, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const disputes = [
  { id: "D-101", title: "Fake property listing reported", type: "Fraud", priority: "High", status: "Open", reporter: "Fatima Abdullahi", assigned: "Admin A", date: "2024-03-15" },
  { id: "D-102", title: "Property condition mismatch", type: "Quality", priority: "Medium", status: "In Review", reporter: "Emeka Nwankwo", assigned: "Admin B", date: "2024-03-14" },
  { id: "D-103", title: "Booking cancelled, refund pending", type: "Cancellation", priority: "Low", status: "Open", reporter: "Guest User", assigned: "Unassigned", date: "2024-03-14" },
  { id: "D-104", title: "Agent impersonation attempt", type: "Fraud", priority: "Critical", status: "Escalated", reporter: "System", assigned: "Admin A", date: "2024-03-13" },
  { id: "D-105", title: "Deposit not returned after move-out", type: "Quality", priority: "High", status: "In Review", reporter: "Oluwaseun Bakare", assigned: "Admin C", date: "2024-03-12" },
  { id: "D-106", title: "Misleading photos on listing", type: "Quality", priority: "Medium", status: "Resolved", reporter: "Chioma Okafor", assigned: "Admin B", date: "2024-03-10" },
];

const priorityColors: Record<string, string> = {
  Critical: "bg-red-600 text-white",
  High: "bg-red-100 text-red-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-green-100 text-green-700",
};

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Open: "destructive",
  "In Review": "secondary",
  Escalated: "destructive",
  Resolved: "outline",
};

const typeIcon: Record<string, React.ReactNode> = {
  Fraud: <AlertTriangle className="h-4 w-4 text-red-500" />,
  Quality: <AlertCircle className="h-4 w-4 text-yellow-500" />,
  Cancellation: <MessageSquare className="h-4 w-4 text-blue-500" />,
};

export default function Disputes() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Disputes & Moderation</h2>
        <p className="text-muted-foreground">Review disputes, fraud alerts, and content moderation</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Open</p><p className="text-2xl font-bold text-red-500">8</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">In Review</p><p className="text-2xl font-bold text-yellow-600">12</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Escalated</p><p className="text-2xl font-bold text-red-600">4</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Resolved (MTD)</p><p className="text-2xl font-bold text-green-600">45</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search disputes..." className="pl-9" />
            </div>
            <Button variant="outline" size="sm">All</Button>
            <Button variant="outline" size="sm">Fraud</Button>
            <Button variant="outline" size="sm">Quality</Button>
            <Button variant="outline" size="sm">Cancellation</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disputes.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-mono text-xs">{d.id}</TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">{d.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {typeIcon[d.type]}
                      <span>{d.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[d.priority]}`}>
                      {d.priority}
                    </span>
                  </TableCell>
                  <TableCell><Badge variant={statusVariant[d.status]}>{d.status}</Badge></TableCell>
                  <TableCell>{d.reporter}</TableCell>
                  <TableCell className="text-muted-foreground">{d.assigned}</TableCell>
                  <TableCell className="text-muted-foreground">{d.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
