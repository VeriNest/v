import { Search, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const properties = [
  { id: "P-001", title: "3 Bedroom Flat, Lekki Phase 1", agent: "Adebayo Johnson", price: "₦2,500,000/yr", location: "Lagos", status: "Active", date: "2024-03-15" },
  { id: "P-002", title: "Studio Apartment, Wuse 2", agent: "Chioma Okafor", price: "₦1,200,000/yr", location: "Abuja", status: "Pending", date: "2024-03-14" },
  { id: "P-003", title: "4 Bedroom Duplex, GRA", agent: "Emeka Nwankwo", price: "₦5,000,000/yr", location: "Port Harcourt", status: "Active", date: "2024-03-13" },
  { id: "P-004", title: "2 Bedroom Flat, Ikeja", agent: "Fatima Abdullahi", price: "₦1,800,000/yr", location: "Lagos", status: "Rejected", date: "2024-03-12" },
  { id: "P-005", title: "Self-Contain, Surulere", agent: "Oluwaseun Bakare", price: "₦600,000/yr", location: "Lagos", status: "Active", date: "2024-03-11" },
  { id: "P-006", title: "5 Bedroom House, Maitama", agent: "Ibrahim Yusuf", price: "₦8,000,000/yr", location: "Abuja", status: "Pending", date: "2024-03-10" },
];

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Active: "default",
  Pending: "secondary",
  Rejected: "destructive",
};

export default function Properties() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Properties</h2>
          <p className="text-muted-foreground">Manage all property listings</p>
        </div>
        <Button>Add Property</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search properties..." className="pl-9" />
            </div>
            <Button variant="outline" size="sm">All</Button>
            <Button variant="outline" size="sm">Active</Button>
            <Button variant="outline" size="sm">Pending</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">{p.title}</TableCell>
                  <TableCell>{p.agent}</TableCell>
                  <TableCell>{p.price}</TableCell>
                  <TableCell>{p.location}</TableCell>
                  <TableCell><Badge variant={statusVariant[p.status]}>{p.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{p.date}</TableCell>
                  <TableCell><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
