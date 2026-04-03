import { Search, MoreHorizontal, Building2, MapPin, Plus, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const properties = [
  { id: "P-001", title: "3 Bedroom Flat, Lekki Phase 1", agent: "Adebayo Johnson", price: "₦2,500,000/yr", location: "Lagos", status: "Active", date: "Mar 15, 2024" },
  { id: "P-002", title: "Studio Apartment, Wuse 2", agent: "Chioma Okafor", price: "₦1,200,000/yr", location: "Abuja", status: "Pending", date: "Mar 14, 2024" },
  { id: "P-003", title: "4 Bedroom Duplex, GRA", agent: "Emeka Nwankwo", price: "₦5,000,000/yr", location: "Port Harcourt", status: "Active", date: "Mar 13, 2024" },
  { id: "P-004", title: "2 Bedroom Flat, Ikeja", agent: "Fatima Abdullahi", price: "₦1,800,000/yr", location: "Lagos", status: "Rejected", date: "Mar 12, 2024" },
  { id: "P-005", title: "Self-Contain, Surulere", agent: "Oluwaseun Bakare", price: "₦600,000/yr", location: "Lagos", status: "Active", date: "Mar 11, 2024" },
  { id: "P-006", title: "5 Bedroom House, Maitama", agent: "Ibrahim Yusuf", price: "₦8,000,000/yr", location: "Abuja", status: "Pending", date: "Mar 10, 2024" },
];

const statusStyles: Record<string, { color: string; bg: string; dot: string }> = {
  Active: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  Pending: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", dot: "bg-amber-500" },
  Rejected: { color: "text-destructive", bg: "bg-destructive/5 border-destructive/20", dot: "bg-destructive" },
};

export default function Properties() {
  const active = properties.filter(p => p.status === "Active");
  const pending = properties.filter(p => p.status === "Pending");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Properties</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all property listings across the platform.</p>
        </div>
        <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Add Property</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Listings", value: "2,847", sub: "+42 this week", accent: "text-foreground" },
          { label: "Active", value: "2,104", sub: "73.9%", accent: "text-emerald-600" },
          { label: "Pending Review", value: "389", sub: "12 urgent", accent: "text-amber-600" },
          { label: "Rejected", value: "354", sub: "-8% vs last month", accent: "text-destructive" },
        ].map((s) => (
          <Card key={s.label} className="border border-border/60 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-xl font-bold mt-0.5 ${s.accent}`}>{s.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 h-auto">
          <TabsTrigger value="all" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">All ({properties.length})</TabsTrigger>
          <TabsTrigger value="active" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="pending" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Pending ({pending.length})</TabsTrigger>
        </TabsList>

        {["all", "active", "pending"].map((tab) => {
          const items = tab === "active" ? active : tab === "pending" ? pending : properties;
          return (
            <TabsContent key={tab} value={tab}>
              <Card className="border border-border/60 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div><CardTitle className="text-base">Properties</CardTitle><CardDescription>Showing {items.length} of 2,847</CardDescription></div>
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
                      {items.map((p) => {
                        const s = statusStyles[p.status];
                        return (
                          <TableRow key={p.id} className="group">
                            <TableCell className="font-mono text-xs text-muted-foreground">{p.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0"><Building2 className="h-4 w-4 text-primary" /></div>
                                <span className="font-medium text-sm text-foreground max-w-[180px] truncate">{p.title}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-foreground">{p.agent}</TableCell>
                            <TableCell className="font-semibold text-sm text-foreground">{p.price}</TableCell>
                            <TableCell><div className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{p.location}</div></TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.bg} ${s.color}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />{p.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">{p.date}</TableCell>
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
