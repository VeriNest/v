import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, MapPin, Star, Bed, Bath, ExternalLink, Grid3x3, List, Search, Calendar } from "lucide-react";

const saved = [
  { id: 1, property: "3 Bed Flat, Lekki Phase 1", provider: "Adebayo Johnson", price: "₦2,500,000/yr", location: "Lekki, Lagos", rating: 4.8, match: 95, beds: 3, baths: 2, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop", savedDate: "Mar 15, 2025", views: 128 },
  { id: 2, property: "2 Bed Serviced, Victoria Island", provider: "ShortStay NG", price: "₦45,000/night", location: "VI, Lagos", rating: 4.9, match: 92, beds: 2, baths: 2, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop", savedDate: "Mar 12, 2025", views: 87 },
  { id: 3, property: "Modern Studio, Garki Area 11", provider: "Abuja Rentals", price: "₦850,000/yr", location: "Garki, Abuja", rating: 4.6, match: 84, beds: 1, baths: 1, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop", savedDate: "Mar 10, 2025", views: 54 },
  { id: 4, property: "Penthouse, Banana Island", provider: "Premium Estates", price: "₦12,000,000/yr", location: "Banana Island, Lagos", rating: 5.0, match: 78, beds: 5, baths: 4, image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop", savedDate: "Mar 8, 2025", views: 203 },
];

export default function Saved() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const filtered = saved.filter(s =>
    s.property.toLowerCase().includes(search.toLowerCase()) ||
    s.location.toLowerCase().includes(search.toLowerCase()) ||
    s.provider.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Saved Properties</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} properties bookmarked</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search saved..." className="pl-9 w-full sm:w-[180px] h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
            <Button variant={view === "grid" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setView("grid")}><Grid3x3 className="h-4 w-4" /></Button>
            <Button variant={view === "list" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setView("list")}><List className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div key={item.id} className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer">
              {/* Image */}
              <img src={item.image} alt={item.property} className="w-full h-[320px] object-cover group-hover:scale-105 transition-transform duration-500" />

              {/* Heart button */}
              <button className="absolute top-3 right-3 w-9 h-9 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-background transition-colors">
                <Heart className="w-4 h-4 text-destructive fill-destructive" />
              </button>

              {/* Overlay card */}
              <div className="absolute bottom-3 left-3 right-3 bg-card/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-border/30">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground text-sm truncate">{item.property}</h3>
                      <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase shrink-0">
                        {item.match}% match
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono uppercase tracking-wider">
                      <MapPin className="h-3 w-3 shrink-0" /> {item.location}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-foreground font-mono">{item.price}</p>
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {item.beds}</span>
                      <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {item.baths}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom row: rating, provider, date, views */}
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/40">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="font-medium text-foreground">{item.rating}</span>
                    </span>
                    <span className="truncate max-w-[120px]">{item.provider}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
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
            <div key={item.id} className="flex flex-col sm:flex-row bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
              <div className="relative w-full sm:w-40 h-48 sm:h-32 shrink-0">
                <img src={item.image} alt={item.property} className="w-full h-full object-cover" />
                <button className="absolute top-2 right-2 w-7 h-7 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Heart className="w-3 h-3 text-destructive fill-destructive" />
                </button>
              </div>
              <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-foreground truncate">{item.property}</h3>
                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded font-mono shrink-0">{item.match}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> {item.location}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {item.rating}</span>
                    <span>{item.provider}</span>
                    <span className="flex items-center gap-1"><Bed className="h-3 w-3" /> {item.beds}</span>
                    <span className="flex items-center gap-1"><Bath className="h-3 w-3" /> {item.baths}</span>
                    <span>{item.views} views</span>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                  <p className="text-sm font-bold text-foreground">{item.price}</p>
                  <p className="text-[11px] text-muted-foreground">{item.savedDate}</p>
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1"><ExternalLink className="h-3 w-3" /> View</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
