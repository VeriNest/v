import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, MoreHorizontal, Building2, MapPin, Eye, Inbox, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const initialListings = [
  { id: "L-001", title: "3 Bedroom Flat, Lekki Phase 1", type: "Rent", price: "₦2,500,000/yr", location: "Lagos", status: "Active", views: 45, offers: 3 },
  { id: "L-002", title: "Studio Apartment, Wuse 2", type: "Rent", price: "₦1,200,000/yr", location: "Abuja", status: "Active", views: 32, offers: 2 },
  { id: "L-003", title: "2 Bed Serviced Apartment, VI", type: "Short-let", price: "₦45,000/night", location: "Lagos", status: "Active", views: 89, offers: 7 },
  { id: "L-004", title: "4 Bedroom Duplex, Maitama", type: "Rent", price: "₦5,000,000/yr", location: "Abuja", status: "Pending", views: 12, offers: 0 },
  { id: "L-005", title: "Self-Contain, Surulere", type: "Rent", price: "₦600,000/yr", location: "Lagos", status: "Draft", views: 0, offers: 0 },
];

const statusStyles: Record<string, { color: string; bg: string; dot: string }> = {
  Active: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  Pending: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", dot: "bg-amber-500" },
  Draft: { color: "text-muted-foreground", bg: "bg-muted border-border", dot: "bg-muted-foreground" },
};

const typeStyles: Record<string, string> = {
  Rent: "text-primary",
  "Short-let": "text-amber-600",
  Sale: "text-blue-600",
};

export default function Listings() {
  const navigate = useNavigate();
  const [listings] = useState(initialListings);
  const active = listings.filter(l => l.status === "Active");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Listings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your property listings and track performance.</p>
        </div>
        <Button className="gap-2" size="sm" onClick={() => navigate("/provider/listings/new")}>
          <Plus className="h-4 w-4" /> Add Listing
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Listings", value: listings.length.toString(), accent: "text-foreground", icon: Building2, bg: "bg-primary/10" },
          { label: "Active", value: active.length.toString(), accent: "text-emerald-600", icon: Building2, bg: "bg-emerald-500/10" },
          { label: "Total Views", value: listings.reduce((a, l) => a + l.views, 0).toString(), accent: "text-blue-600", icon: Eye, bg: "bg-blue-500/10" },
          { label: "Offers Received", value: listings.reduce((a, l) => a + l.offers, 0).toString(), accent: "text-primary", icon: Inbox, bg: "bg-primary/10" },
        ].map((s) => (
          <Card key={s.label} className="border border-border/60 shadow-sm">
            <CardContent className="p-4 flex items-start gap-3">
              <div className={`p-2 rounded-lg ${s.bg} shrink-0`}><s.icon className={`h-4 w-4 ${s.accent}`} /></div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={`text-lg font-bold ${s.accent}`}>{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 h-auto">
          <TabsTrigger value="all" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">All ({listings.length})</TabsTrigger>
          <TabsTrigger value="active" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="other" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Pending/Draft</TabsTrigger>
        </TabsList>

        {["all", "active", "other"].map((tab) => {
          const items = tab === "active" ? active : tab === "other" ? listings.filter(l => l.status !== "Active") : listings;
          return (
            <TabsContent key={tab} value={tab}>
              <Card className="border border-border/60 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <CardTitle className="text-base">Listings</CardTitle>
                      <CardDescription>Showing {items.length} listings</CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search listings..." className="pl-9 w-[220px] h-9" />
                      </div>
                      <Button variant="outline" size="sm" className="gap-1.5"><Filter className="h-3.5 w-3.5" /> Filter</Button>
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
                      {items.map((l) => {
                        const s = statusStyles[l.status] || statusStyles.Draft;
                        return (
                          <TableRow key={l.id} className="group">
                            <TableCell>
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                                  <Building2 className="h-4 w-4 text-primary" />
                                </div>
                                <span className="font-medium text-sm text-foreground">{l.title}</span>
                              </div>
                            </TableCell>
                            <TableCell><span className={`text-sm font-medium ${typeStyles[l.type] || "text-foreground"}`}>{l.type}</span></TableCell>
                            <TableCell className="font-semibold text-sm text-foreground">{l.price}</TableCell>
                            <TableCell><div className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{l.location}</div></TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.bg} ${s.color}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />{l.status}
                              </span>
                            </TableCell>
                            <TableCell><div className="flex items-center gap-1 text-sm text-muted-foreground"><Eye className="h-3.5 w-3.5" />{l.views}</div></TableCell>
                            <TableCell><span className={`text-sm font-medium ${l.offers > 0 ? "text-primary" : "text-muted-foreground"}`}>{l.offers}</span></TableCell>
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
