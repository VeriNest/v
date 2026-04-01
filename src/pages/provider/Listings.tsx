import { Search, Plus, MoreHorizontal, Building2, MapPin, Eye, Inbox, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const listings = [
  { id: "L-001", title: "3 Bedroom Flat, Lekki Phase 1", type: "Rent", price: "₦2,500,000/yr", location: "Lagos", status: "Active", views: 45, offers: 3 },
  { id: "L-002", title: "Studio Apartment, Wuse 2", type: "Rent", price: "₦1,200,000/yr", location: "Abuja", status: "Active", views: 32, offers: 2 },
  { id: "L-003", title: "2 Bed Serviced Apartment, VI", type: "Short-let", price: "₦45,000/night", location: "Lagos", status: "Active", views: 89, offers: 7 },
  { id: "L-004", title: "4 Bedroom Duplex, Maitama", type: "Rent", price: "₦5,000,000/yr", location: "Abuja", status: "Pending", views: 12, offers: 0 },
  { id: "L-005", title: "Self-Contain, Surulere", type: "Rent", price: "₦600,000/yr", location: "Lagos", status: "Draft", views: 0, offers: 0 },
];

const statusStyles: Record<string, { color: string; bg: string; dot: string }> = {
  Active: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  Pending: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", dot: "bg-amber-500" },
  Draft: { color: "text-slate-600", bg: "bg-slate-50 border-slate-200", dot: "bg-slate-400" },
};

const typeStyles: Record<string, string> = {
  Rent: "text-[hsl(263,70%,58%)]",
  "Short-let": "text-amber-600",
};

const summaryCards = [
  { label: "Total Listings", value: "5", color: "text-[hsl(263,70%,58%)]", bg: "bg-[hsl(263,70%,58%)]/10", icon: Building2, progress: 100 },
  { label: "Total Views", value: "178", color: "text-blue-600", bg: "bg-blue-500/10", icon: Eye, progress: 72 },
  { label: "Offers Received", value: "12", color: "text-emerald-600", bg: "bg-emerald-500/10", icon: Inbox, progress: 48 },
];

export default function Listings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Listings</h2>
          <p className="text-muted-foreground">Manage your property listings</p>
        </div>
        <Button className="bg-[hsl(263,70%,58%)] hover:bg-[hsl(263,70%,48%)] gap-2">
          <Plus className="h-4 w-4" />
          Add Listing
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
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-lg">All Listings</CardTitle>
              <CardDescription>Showing {listings.length} listings</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search listings..." className="pl-9 w-[260px]" />
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
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Property</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Type</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Price</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Location</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Status</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Views</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Offers</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((l) => {
                const s = statusStyles[l.status];
                return (
                  <TableRow key={l.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-[hsl(263,70%,58%)]/5 flex items-center justify-center shrink-0">
                          <Building2 className="h-4 w-4 text-[hsl(263,70%,58%)]" />
                        </div>
                        <span className="font-medium text-sm">{l.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-medium ${typeStyles[l.type]}`}>{l.type}</span>
                    </TableCell>
                    <TableCell className="font-semibold text-sm">{l.price}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {l.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.bg} ${s.color}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                        {l.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                        {l.views}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-medium ${l.offers > 0 ? "text-[hsl(263,70%,58%)]" : "text-muted-foreground"}`}>{l.offers}</span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
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
