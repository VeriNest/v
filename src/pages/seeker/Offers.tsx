import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, ShieldCheck, Clock, ArrowUpRight, Zap, Search, Filter } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStatusBadge } from "@/components/dashboard/DashboardStatusBadge";
import { useSearchFocus } from "@/hooks/use-search-focus";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardControlRow } from "@/components/dashboard/DashboardControlRow";

export const offers = [
  { id: 1, property: "3 Bed Flat, Lekki Phase 1", provider: "Adebayo Johnson", role: "Agent", price: "₦2,500,000/yr", trust: "Verified", rating: 4.8, responseTime: "12 min", match: 95, features: ["24hr Power", "Security", "Parking"], status: "New", initials: "AJ" },
  { id: 2, property: "2 Bed Apartment, Ikeja GRA", provider: "Lagos Homes Ltd", role: "Agent", price: "₦1,800,000/yr", trust: "Verified", rating: 4.5, responseTime: "45 min", match: 88, features: ["Gated Estate", "Water Supply"], status: "Viewed", initials: "LH" },
  { id: 3, property: "Studio, Wuse 2", provider: "Chioma Okafor", role: "Landlord", price: "₦1,200,000/yr", trust: "Pending", rating: 4.2, responseTime: "2 hrs", match: 76, features: ["Furnished", "Security"], status: "New", initials: "CO" },
  { id: 4, property: "2 Bed Serviced, VI", provider: "ShortStay NG", role: "Short-let", price: "₦45,000/night", trust: "Verified", rating: 4.9, responseTime: "5 min", match: 92, features: ["24hr Power", "Furnished", "Pool"], status: "Saved", initials: "SN" },
];

const matchColor = (m: number) => m >= 90 ? "text-emerald-600" : m >= 80 ? "text-blue-600" : "text-amber-600";

export default function Offers() {
  useSearchFocus();
  const [search, setSearch] = useState("");
  const filtered = offers.filter(o =>
    o.property.toLowerCase().includes(search.toLowerCase()) ||
    o.provider.toLowerCase().includes(search.toLowerCase()) ||
    o.role.toLowerCase().includes(search.toLowerCase())
  );
  const newCount = filtered.filter(o => o.status === "New").length;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My Offers"
        description="Offers matched to your posted needs, ranked by fit and trust."
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Offers", value: filtered.length.toString(), accent: "text-foreground" },
          { label: "New", value: newCount.toString(), accent: "text-primary" },
          { label: "Avg Match", value: `${Math.round(filtered.reduce((a, o) => a + o.match, 0) / (filtered.length || 1))}%`, accent: "text-emerald-600" },
          { label: "Top Rating", value: "4.9", accent: "text-amber-600" },
        ].map((s) => (
          <Card key={s.label} className="border border-border/60 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-xl font-bold mt-0.5 ${s.accent}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <DashboardControlRow
          left={
            <TabsList className="h-auto flex-wrap bg-muted/50 p-1">
              <TabsTrigger value="all" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">All ({filtered.length})</TabsTrigger>
              <TabsTrigger value="new" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">New ({newCount})</TabsTrigger>
              <TabsTrigger value="saved" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Saved</TabsTrigger>
            </TabsList>
          }
          right={
            <>
              <div className="relative flex-1 lg:flex-none">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search offers..."
                  className="h-9 w-full pl-9 lg:w-[220px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
                <Filter className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </>
          }
        />

        <TabsContent value="all" className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="new" className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filtered.filter(o => o.status === "New").map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="saved" className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filtered.filter(o => o.status === "Saved").map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OfferCard({ offer }: { offer: typeof offers[0] }) {
  return (
    <Card data-search-id={`seeker-offer-${offer.id}`} className="overflow-hidden border border-border/60 shadow-sm">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 gap-3">
            <Avatar className="h-10 w-10 border border-border/60 shrink-0">
              <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">{offer.initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-sm text-foreground">{offer.property}</h3>
                {offer.status === "New" ? <span className="h-2 w-2 rounded-full bg-primary animate-pulse" /> : null}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                <span className="font-medium">{offer.provider}</span>
                <DashboardStatusBadge tone={offer.role === "Agent" ? "info" : offer.role === "Landlord" ? "neutral" : "warning"}>
                  {offer.role}
                </DashboardStatusBadge>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-2 text-right text-xs text-muted-foreground">
            <p className="font-medium text-foreground">{offer.price}</p>
            <p className={`mt-1 inline-flex items-center gap-0.5 font-semibold ${matchColor(offer.match)}`}>
              <ArrowUpRight className="h-3 w-3" /> {offer.match}% match
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Trust</p>
            <p className="mt-1 flex items-center gap-1 text-sm font-medium text-foreground">
              {offer.trust === "Verified" ? <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> : <Clock className="h-3.5 w-3.5 text-amber-500" />}
              {offer.trust}
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Response</p>
            <p className="mt-1 flex items-center gap-1 text-sm font-medium text-foreground">
              <Zap className="h-3.5 w-3.5 text-primary" />
              {offer.responseTime}
            </p>
          </div>
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {offer.features.map((f) => (
            <span key={f} className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">{f}</span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-secondary/30 px-3 py-2.5">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="font-medium text-foreground">{offer.rating}</span>
            </span>
            <span>{offer.status}</span>
          </div>
          <Button size="sm" variant="outline">View Details</Button>
        </div>
      </CardContent>
    </Card>
  );
}
