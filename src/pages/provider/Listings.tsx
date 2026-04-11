import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Plus, MoreHorizontal, Building2, MapPin, Eye, Inbox, Filter, Grid3x3, List, Bed, Bath, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchFocus } from "@/hooks/use-search-focus";
import { DashboardControlRow } from "@/components/dashboard/DashboardControlRow";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";

const images = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop",
];

export const initialListings = [
  { id: "L-001", title: "3 Bedroom Flat, Lekki Phase 1", type: "Rent", price: "N2,500,000/yr", location: "Lagos", status: "Active", views: 45, offers: 3, beds: 3, baths: 2, rating: 4.8, match: 95, image: images[0] },
  { id: "L-002", title: "Studio Apartment, Wuse 2", type: "Rent", price: "N1,200,000/yr", location: "Abuja", status: "Active", views: 32, offers: 2, beds: 1, baths: 1, rating: 4.5, match: 88, image: images[1] },
  { id: "L-003", title: "2 Bed Serviced Apartment, VI", type: "Short-let", price: "N45,000/night", location: "Lagos", status: "Active", views: 89, offers: 7, beds: 2, baths: 2, rating: 4.9, match: 92, image: images[2] },
  { id: "L-004", title: "4 Bedroom Duplex, Maitama", type: "Rent", price: "N5,000,000/yr", location: "Abuja", status: "Pending", views: 12, offers: 0, beds: 4, baths: 3, rating: 4.6, match: 84, image: images[3] },
  { id: "L-005", title: "Self-Contain, Surulere", type: "Rent", price: "N600,000/yr", location: "Lagos", status: "Draft", views: 0, offers: 0, beds: 1, baths: 1, rating: 0, match: 0, image: images[4] },
];

const statusStyles: Record<string, { color: string; bg: string; dot: string }> = {
  Active: { color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-500/10 border-emerald-500/20 dark:bg-emerald-500/15 dark:border-emerald-500/30", dot: "bg-emerald-500" },
  Pending: { color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-500/10 border-amber-500/20 dark:bg-amber-500/15 dark:border-amber-500/30", dot: "bg-amber-500" },
  Draft: { color: "text-muted-foreground", bg: "bg-muted border-border", dot: "bg-muted-foreground" },
};

const typeStyles: Record<string, string> = {
  Rent: "text-primary",
  "Short-let": "text-amber-600",
  Sale: "text-blue-600",
};

export default function Listings() {
  useSearchFocus();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [listings] = useState(initialListings);
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [view, setView] = useState<"grid" | "table">("grid");

  useEffect(() => {
    setSearch(searchParams.get("q") ?? "");
  }, [searchParams]);

  const filtered = listings.filter(
    (listing) =>
      listing.title.toLowerCase().includes(search.toLowerCase()) ||
      listing.location.toLowerCase().includes(search.toLowerCase()) ||
      listing.type.toLowerCase().includes(search.toLowerCase()),
  );
  const active = filtered.filter((listing) => listing.status === "Active");

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My Listings"
        description="Manage your property listings and track performance."
        actions={
          <Button className="gap-2" size="sm" onClick={() => navigate("/provider/listings/new")}>
            <Plus className="h-4 w-4" /> Add Listing
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Listings", value: listings.length.toString(), accent: "text-foreground", icon: Building2, bg: "bg-primary/10" },
          { label: "Active", value: active.length.toString(), accent: "text-emerald-600", icon: Building2, bg: "bg-emerald-500/10" },
          { label: "Total Views", value: listings.reduce((sum, listing) => sum + listing.views, 0).toString(), accent: "text-blue-600", icon: Eye, bg: "bg-blue-500/10" },
          { label: "Offers Received", value: listings.reduce((sum, listing) => sum + listing.offers, 0).toString(), accent: "text-primary", icon: Inbox, bg: "bg-primary/10" },
        ].map((stat) => (
          <Card key={stat.label} className="border border-border/60 shadow-sm">
            <CardContent className="flex items-start gap-3 p-4">
              <div className={`shrink-0 rounded-lg p-2 ${stat.bg}`}><stat.icon className={`h-4 w-4 ${stat.accent}`} /></div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className={`text-lg font-bold ${stat.accent}`}>{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <DashboardControlRow
          left={
            <TabsList className="h-auto max-w-full flex-wrap justify-start bg-muted/50 p-1">
              <TabsTrigger value="all" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">All ({filtered.length})</TabsTrigger>
              <TabsTrigger value="active" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Active ({active.length})</TabsTrigger>
              <TabsTrigger value="other" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Pending/Draft</TabsTrigger>
            </TabsList>
          }
          right={
            <>
              <div className="relative min-w-0 flex-1 lg:w-auto lg:flex-none">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search listings..." className="h-9 w-full min-w-0 pl-9 lg:w-[200px]" value={search} onChange={(event) => setSearch(event.target.value)} />
              </div>
              <div className="flex shrink-0 items-center gap-1 rounded-lg bg-muted/50 p-1">
                <Button variant={view === "grid" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setView("grid")}><Grid3x3 className="h-4 w-4" /></Button>
                <Button variant={view === "table" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setView("table")}><List className="h-4 w-4" /></Button>
              </div>
              <Button variant="outline" size="sm" className="h-9 shrink-0 px-3 sm:px-3.5"><Filter className="h-3.5 w-3.5" /> <span className="sr-only sm:not-sr-only sm:ml-1.5">Filter</span></Button>
            </>
          }
        />

        {["all", "active", "other"].map((tab) => {
          const items = tab === "active" ? active : tab === "other" ? filtered.filter((listing) => listing.status !== "Active") : filtered;
          return (
            <TabsContent key={tab} value={tab}>
              {view === "grid" ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {items.map((listing) => {
                    const status = statusStyles[listing.status] || statusStyles.Draft;
                    return (
                      <div key={listing.id} data-search-id={`provider-listing-${listing.id}`} className="relative overflow-hidden rounded-2xl border border-border/60 shadow-sm">
                        <img src={listing.image} alt={listing.title} className="h-[280px] w-full object-cover" />

                        <div className="absolute left-3 top-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${status.bg} ${status.color}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />{listing.status}
                          </span>
                        </div>

                        <div className="absolute right-3 top-3">
                          <span className="rounded-full border border-border/30 bg-card/90 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur-sm">
                            {listing.type}
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-border/30 bg-card/95 p-4 shadow-sm backdrop-blur-sm">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <h3 className="truncate text-sm font-semibold text-foreground">{listing.title}</h3>
                              <p className="mt-1 flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                                <MapPin className="h-3 w-3 shrink-0" /> {listing.location}
                              </p>
                            </div>
                            <div className="shrink-0 text-right">
                              <p className="font-mono text-sm font-bold text-foreground">{listing.price}</p>
                              <div className="mt-0.5 flex items-center gap-2.5 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" /> {listing.beds}</span>
                                <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" /> {listing.baths}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2.5">
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              {listing.rating > 0 && (
                                <span className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                  <span className="font-medium text-foreground">{listing.rating}</span>
                                </span>
                              )}
                              <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {listing.views} views</span>
                              <span>{listing.offers} offers</span>
                            </div>
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-xs"><MoreHorizontal className="h-4 w-4" /></Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Card className="border border-border/60 shadow-sm">
                  <CardHeader className="pb-3">
                    <div>
                      <CardTitle className="text-base">Listings</CardTitle>
                      <CardDescription>Showing {items.length} listings</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="overflow-x-auto p-0">
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
                          <TableHead />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((listing) => {
                          const status = statusStyles[listing.status] || statusStyles.Draft;
                          return (
                            <TableRow key={listing.id} data-search-id={`provider-listing-${listing.id}`}>
                              <TableCell>
                                <div className="flex items-center gap-2.5">
                                  <img src={listing.image} alt={listing.title} className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                                  <span className="text-sm font-medium text-foreground">{listing.title}</span>
                                </div>
                              </TableCell>
                              <TableCell><span className={`text-sm font-medium ${typeStyles[listing.type] || "text-foreground"}`}>{listing.type}</span></TableCell>
                              <TableCell className="text-sm font-semibold text-foreground">{listing.price}</TableCell>
                              <TableCell><div className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{listing.location}</div></TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${status.bg} ${status.color}`}>
                                  <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />{listing.status}
                                </span>
                              </TableCell>
                              <TableCell><div className="flex items-center gap-1 text-sm text-muted-foreground"><Eye className="h-3.5 w-3.5" />{listing.views}</div></TableCell>
                              <TableCell><span className={`text-sm font-medium ${listing.offers > 0 ? "text-primary" : "text-muted-foreground"}`}>{listing.offers}</span></TableCell>
                              <TableCell><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></TableCell>
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
