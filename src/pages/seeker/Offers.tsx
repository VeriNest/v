import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, ShieldCheck, Clock, ArrowUpRight, Zap, SlidersHorizontal, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const offers = [
  { id: 1, property: "3 Bed Flat, Lekki Phase 1", provider: "Adebayo Johnson", role: "Agent", price: "₦2,500,000/yr", trust: "Verified", rating: 4.8, responseTime: "12 min", match: 95, features: ["24hr Power", "Security", "Parking"], status: "New", initials: "AJ" },
  { id: 2, property: "2 Bed Apartment, Ikeja GRA", provider: "Lagos Homes Ltd", role: "Agent", price: "₦1,800,000/yr", trust: "Verified", rating: 4.5, responseTime: "45 min", match: 88, features: ["Gated Estate", "Water Supply"], status: "Viewed", initials: "LH" },
  { id: 3, property: "Studio, Wuse 2", provider: "Chioma Okafor", role: "Landlord", price: "₦1,200,000/yr", trust: "Pending", rating: 4.2, responseTime: "2 hrs", match: 76, features: ["Furnished", "Security"], status: "New", initials: "CO" },
  { id: 4, property: "2 Bed Serviced, VI", provider: "ShortStay NG", role: "Short-let", price: "₦45,000/night", trust: "Verified", rating: 4.9, responseTime: "5 min", match: 92, features: ["24hr Power", "Furnished", "Pool"], status: "Saved", initials: "SN" },
];

const roleStyles: Record<string, string> = {
  Agent: "bg-primary/10 text-primary",
  Landlord: "bg-blue-500/10 text-blue-600",
  "Short-let": "bg-amber-500/10 text-amber-600",
};

const matchColor = (m: number) => m >= 90 ? "text-emerald-600" : m >= 80 ? "text-blue-600" : "text-amber-600";
const matchBg = (m: number) => m >= 90 ? "bg-emerald-500" : m >= 80 ? "bg-blue-500" : "bg-amber-500";

export default function Offers() {
  const [search, setSearch] = useState("");
  const filtered = offers.filter(o =>
    o.property.toLowerCase().includes(search.toLowerCase()) ||
    o.provider.toLowerCase().includes(search.toLowerCase()) ||
    o.role.toLowerCase().includes(search.toLowerCase())
  );
  const newCount = filtered.filter(o => o.status === "New").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Offers</h1>
          <p className="text-sm text-muted-foreground mt-1">Offers matched to your posted needs, ranked by fit & trust.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search offers..." className="pl-9 w-[200px] h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button variant="outline" size="sm" className="gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
          </Button>
        </div>
      </div>

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
        <TabsList className="bg-muted/50 p-1 h-auto">
          <TabsTrigger value="all" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">All ({filtered.length})</TabsTrigger>
          <TabsTrigger value="new" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">New ({newCount})</TabsTrigger>
          <TabsTrigger value="saved" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Saved</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {filtered.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </TabsContent>
        <TabsContent value="new" className="space-y-3">
          {filtered.filter(o => o.status === "New").map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </TabsContent>
        <TabsContent value="saved" className="space-y-3">
          {filtered.filter(o => o.status === "Saved").map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OfferCard({ offer }: { offer: typeof offers[0] }) {
  return (
    <Card className="border border-border/60 shadow-sm hover:shadow-md transition-all duration-200 group">
      <CardContent className="p-0">
        <div className="flex">
          <div className={`w-1 shrink-0 rounded-l-lg ${matchBg(offer.match)}`} />
          <div className="flex-1 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3 min-w-0">
                <Avatar className="h-10 w-10 border border-border/60 shrink-0">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">{offer.initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm text-foreground truncate">{offer.property}</h3>
                    {offer.status === "New" && (
                      <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                    <span className="font-medium">{offer.provider}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[11px] font-medium ${roleStyles[offer.role]}`}>{offer.role}</span>
                    <span className="flex items-center gap-0.5">
                      {offer.trust === "Verified" ? <ShieldCheck className="h-3 w-3 text-emerald-600" /> : <Clock className="h-3 w-3 text-amber-500" />}
                      {offer.trust}
                    </span>
                  </div>
                  <div className="flex gap-1.5 flex-wrap pt-0.5">
                    {offer.features.map((f) => (
                      <span key={f} className="bg-muted px-2 py-0.5 rounded text-[11px] text-muted-foreground">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right space-y-1 shrink-0">
                <p className="text-base font-bold text-foreground">{offer.price}</p>
                <div className="flex items-center gap-1 justify-end text-xs">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-foreground">{offer.rating}</span>
                </div>
                <p className={`text-xs font-semibold ${matchColor(offer.match)} flex items-center gap-0.5 justify-end`}>
                  <ArrowUpRight className="h-3 w-3" />{offer.match}%
                </p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-0.5 justify-end"><Zap className="h-3 w-3" />{offer.responseTime}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-3 border-t border-border/60">
              <Button size="sm">View Details</Button>
              <Button size="sm" variant="outline">Schedule Viewing</Button>
              <Button size="sm" variant="ghost" className="text-xs text-muted-foreground">View Original Request</Button>
              <Button size="sm" variant="ghost" className="ml-auto text-muted-foreground">Save</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
