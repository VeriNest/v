import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, MoreHorizontal, Building2, MapPin, Eye, Inbox, Filter, Grid3x3, List, Bed, Bath, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const images = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop",
];

const initialListings = [
  { id: "L-001", title: "3 Bedroom Flat, Lekki Phase 1", type: "Rent", price: "₦2,500,000/yr", location: "Lagos", status: "Active", views: 45, offers: 3, beds: 3, baths: 2, rating: 4.8, match: 95, image: images[0] },
  { id: "L-002", title: "Studio Apartment, Wuse 2", type: "Rent", price: "₦1,200,000/yr", location: "Abuja", status: "Active", views: 32, offers: 2, beds: 1, baths: 1, rating: 4.5, match: 88, image: images[1] },
  { id: "L-003", title: "2 Bed Serviced Apartment, VI", type: "Short-let", price: "₦45,000/night", location: "Lagos", status: "Active", views: 89, offers: 7, beds: 2, baths: 2, rating: 4.9, match: 92, image: images[2] },
  { id: "L-004", title: "4 Bedroom Duplex, Maitama", type: "Rent", price: "₦5,000,000/yr", location: "Abuja", status: "Pending", views: 12, offers: 0, beds: 4, baths: 3, rating: 4.6, match: 84, image: images[3] },
  { id: "L-005", title: "Self-Contain, Surulere", type: "Rent", price: "₦600,000/yr", location: "Lagos", status: "Draft", views: 0, offers: 0, beds: 1, baths: 1, rating: 0, match: 0, image: images[4] },
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
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "table">("grid");
  const filtered = listings.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.location.toLowerCase().includes(search.toLowerCase()) ||
    l.type.toLowerCase().includes(search.toLowerCase())
  );
  const active = filtered.filter(l => l.status === "Active");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">My Listings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your property listings and track performance.</p>
        </div>
        <Button className="gap-2 self-start" size="sm" onClick={() => navigate("/provider/listings/new")}>
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
        <div className="flex items-center justify-between flex-wrap gap-3">
          <TabsList className="bg-muted/50 p-1 h-auto">
            <TabsTrigger value="all" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">All ({filtered.length})</TabsTrigger>
            <TabsTrigger value="active" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Active ({active.length})</TabsTrigger>
            <TabsTrigger value="other" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Pending/Draft</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search listings..." className="pl-9 w-full sm:w-[200px] h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
              <Button variant={view === "grid" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setView("grid")}><Grid3x3 className="h-4 w-4" /></Button>
              <Button variant={view === "table" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setView("table")}><List className="h-4 w-4" /></Button>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 shrink-0"><Filter className="h-3.5 w-3.5" /> Filter</Button>
          </div>
        </div>

        {["all", "active", "other"].map((tab) => {
          const items = tab === "active" ? active : tab === "other" ? filtered.filter(l => l.status !== "Active") : filtered;
          return (
            <TabsContent key={tab} value={tab}>
              {view === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {items.map((l) => {
                    const s = statusStyles[l.status] || statusStyles.Draft;
                    return (
                      <div key={l.id} className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer">
                        <img src={l.image} alt={l.title} className="w-full h-[280px] object-cover group-hover:scale-105 transition-transform duration-500" />

                        {/* Status badge */}
                        <div className="absolute top-3 left-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.bg} ${s.color}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />{l.status}
                          </span>
                        </div>

                        {/* Type badge */}
                        <div className="absolute top-3 right-3">
                          <span className="bg-card/90 backdrop-blur-sm text-foreground text-[11px] font-medium px-2.5 py-1 rounded-full border border-border/30">
                            {l.type}
                          </span>
                        </div>

                        {/* Overlay card */}
                        <div className="absolute bottom-3 left-3 right-3 bg-card/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-border/30">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground text-sm truncate">{l.title}</h3>
                              </div>
                              <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono uppercase tracking-wider">
                                <MapPin className="h-3 w-3 shrink-0" /> {l.location}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-sm font-bold text-foreground font-mono">{l.price}</p>
                              <div className="flex items-center gap-2.5 text-xs text-muted-foreground mt-0.5">
                                <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {l.beds}</span>
                                <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {l.baths}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/40">
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              {l.rating > 0 && (
                                <span className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                  <span className="font-medium text-foreground">{l.rating}</span>
                                </span>
                              )}
                              <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {l.views} views</span>
                              <span>{l.offers} offers</span>
                            </div>
                            <Button size="sm" variant="ghost" className="h-7 text-xs px-2"><MoreHorizontal className="h-4 w-4" /></Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Card className="border border-border/60 shadow-sm">
                  <CardHeader className="pb-3">
                    <div><CardTitle className="text-base">Listings</CardTitle><CardDescription>Showing {items.length} listings</CardDescription></div>
                  </CardHeader>
                  <CardContent className="p-0 overflow-x-auto">
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
                                  <img src={l.image} alt={l.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
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
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
