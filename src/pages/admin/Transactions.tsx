import { Search } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Completed: "default",
  Escrow: "secondary",
  Pending: "outline",
  Failed: "destructive",
};

export default function Transactions() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Transactions</h2>
        <p className="text-muted-foreground">Payment reconciliation, escrow & payout tracking</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Volume (MTD)</p>
            <p className="text-2xl font-bold">₦45,200,000</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">In Escrow</p>
            <p className="text-2xl font-bold text-yellow-600">₦3,750,000</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Failed</p>
            <p className="text-2xl font-bold text-red-500">₦3,200,000</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search transactions..." className="pl-9" />
            </div>
            <Button variant="outline" size="sm">All</Button>
            <Button variant="outline" size="sm">Completed</Button>
            <Button variant="outline" size="sm">Escrow</Button>
            <Button variant="outline" size="sm">Failed</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs">{t.id}</TableCell>
                  <TableCell className="font-medium">{t.amount}</TableCell>
                  <TableCell>{t.type}</TableCell>
                  <TableCell>{t.from}</TableCell>
                  <TableCell>{t.to}</TableCell>
                  <TableCell><Badge variant={statusVariant[t.status]}>{t.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{t.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
