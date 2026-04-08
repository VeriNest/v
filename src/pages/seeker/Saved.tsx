import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, MapPin, Star, Bed, Bath, ExternalLink, Grid3x3, List, Search, Calendar } from "lucide-react";
import { useSearchFocus } from "@/hooks/use-search-focus";

export const saved = [
  { id: 1, property: "3 Bed Flat, Lekki Phase 1", provider: "Adebayo Johnson", price: "N2,500,000/yr", location: "Lekki, Lagos", rating: 4.8, match: 95, beds: 3, baths: 2, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop", savedDate: "Mar 15, 2025", views: 128 },
  { id: 2, property: "2 Bed Serviced, Victoria Island", provider: "ShortStay NG", price: "N45,000/night", location: "VI, Lagos", rating: 4.9, match: 92, beds: 2, baths: 2, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop", savedDate: "Mar 12, 2025", views: 87 },
  { id: 3, property: "Modern Studio, Garki Area 11", provider: "Abuja Rentals", price: "N850,000/yr", location: "Garki, Abuja", rating: 4.6, match: 84, beds: 1, baths: 1, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop", savedDate: "Mar 10, 2025", views: 54 },
  { id: 4, property: "Penthouse, Banana Island", provider: "Premium Estates", price: "N12,000,000/yr", location: "Banana Island, Lagos", rating: 5.0, match: 78, beds: 5, baths: 4, image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop", savedDate: "Mar 8, 2025", views: 203 },
];

export default function Saved() {
  useSearchFocus();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const filtered = saved.filter(
    (item) =>
      item.property.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase()) ||
      item.provider.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">Saved Properties</h1>
          <p className="mt-1 text-sm text-muted-foreground">{filtered.length} properties bookmarked</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search saved..." className="h-9 w-full pl-9 sm:w-[180px]" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-muted/50 p-1">
            <Button variant={view === "grid" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setView("grid")}><Grid3x3 className="h-4 w-4" /></Button>
            <Button variant={view === "list" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setView("list")}><List className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <div key={item.id} data-search-id={`seeker-saved-${item.id}`} className="relative overflow-hidden rounded-2xl border border-border/60 shadow-sm">
              <img src={item.image} alt={item.property} className="h-[320px] w-full object-cover" />

              <button className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 shadow-sm backdrop-blur-sm">
                <Heart className="h-4 w-4 fill-destructive text-destructive" />
              </button>

              <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-border/30 bg-card/95 p-4 shadow-sm backdrop-blur-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="truncate text-sm font-semibold text-foreground">{item.property}</h3>
                      <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        {item.match}% match
                      </span>
                    </div>
                    <p className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" /> {item.location}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-mono text-sm font-bold text-foreground">{item.price}</p>
                    <div className="mt-0.5 flex items-center gap-2.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" /> {item.beds}</span>
                      <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" /> {item.baths}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-2 border-t border-border/40 pt-2.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="font-medium text-foreground">{item.rating}</span>
                    </span>
                    <span className="max-w-[120px] truncate">{item.provider}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {item.savedDate}</span>
                    <span>{item.views} views</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div key={item.id} data-search-id={`seeker-saved-${item.id}`} className="flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm sm:flex-row">
              <div className="relative h-48 w-full shrink-0 sm:h-32 sm:w-40">
                <img src={item.image} alt={item.property} className="h-full w-full object-cover" />
                <button className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm">
                  <Heart className="h-3 w-3 fill-destructive text-destructive" />
                </button>
              </div>
              <div className="flex flex-1 flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-foreground">{item.property}</h3>
                    <span className="shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">{item.match}%</span>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {item.location}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {item.rating}</span>
                    <span>{item.provider}</span>
                    <span className="flex items-center gap-1"><Bed className="h-3 w-3" /> {item.beds}</span>
                    <span className="flex items-center gap-1"><Bath className="h-3 w-3" /> {item.baths}</span>
                    <span>{item.views} views</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
                  <p className="text-sm font-bold text-foreground">{item.price}</p>
                  <p className="text-[11px] text-muted-foreground">{item.savedDate}</p>
                  <Button size="sm" variant="outline" className="h-7 gap-1 text-xs"><ExternalLink className="h-3 w-3" /> View</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
