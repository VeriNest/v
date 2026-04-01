import { Search, MoreHorizontal, Building2, MapPin, Plus, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
};

const statusDot: Record<string, string> = {
  Active: "bg-emerald-500",
  Pending: "bg-amber-500",
  Rejected: "bg-red-500",
};

const summaryCards = [
  { label: "Total Listings", value: "2,847", change: "+42 this week", color: "text-[hsl(263,70%,58%)]", bg: "bg-[hsl(263,70%,58%)]/10" },
  { label: "Active", value: "2,104", change: "73.9% of total", color: "text-emerald-600", bg: "bg-emerald-500/10" },
  { label: "Pending Review", value: "389", change: "12 urgent", color: "text-amber-600", bg: "bg-amber-500/10" },
  { label: "Rejected", value: "354", change: "-8% vs last month", color: "text-red-600", bg: "bg-red-500/10" },
];

export default function Properties() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Properties</h2>
          <p className="text-muted-foreground">Manage all property listings across the platform</p>
        </div>
        <Button className="bg-[hsl(263,70%,58%)] hover:bg-[hsl(263,70%,48%)] gap-2">
          <Plus className="h-4 w-4" />
          Add Property
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((c) => (
          <Card key={c.label} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className={`inline-flex p-2 rounded-lg ${c.bg} mb-3`}>
                <Building2 className={`h-4 w-4 ${c.color}`} />
              </div>
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <p className={`text-2xl font-bold mt-0.5 ${c.color}`}>{c.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{c.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-lg">All Properties</CardTitle>
              <CardDescription>Showing 6 of 2,847 listings</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search properties..." className="pl-9 w-[260px]" />
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
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Property</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Agent</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Price</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Location</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Status</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((p) => (
                <TableRow key={p.id} className="group">
                  <TableCell className="font-mono text-xs text-muted-foreground">{p.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[hsl(263,70%,58%)]/5 flex items-center justify-center shrink-0">
                        <Building2 className="h-4 w-4 text-[hsl(263,70%,58%)]" />
                      </div>
                      <span className="font-medium text-sm max-w-[200px] truncate">{p.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{p.agent}</TableCell>
                  <TableCell className="font-semibold text-sm">{p.price}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {p.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[p.status]}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${statusDot[p.status]}`} />
                      {p.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{p.date}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
