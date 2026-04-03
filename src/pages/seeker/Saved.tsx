import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Heart, MapPin, Star, Trash2, ExternalLink, Grid3x3, List, Search } from "lucide-react";

const saved = [
  { id: 1, property: "3 Bed Flat, Lekki Phase 1", provider: "Adebayo Johnson", price: "₦2,500,000/yr", location: "Lekki, Lagos", rating: 4.8, match: 95, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=250&fit=crop", savedDate: "Mar 15" },
  { id: 2, property: "2 Bed Serviced, Victoria Island", provider: "ShortStay NG", price: "₦45,000/night", location: "VI, Lagos", rating: 4.9, match: 92, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=250&fit=crop", savedDate: "Mar 12" },
  { id: 3, property: "Modern Studio, Garki Area 11", provider: "Abuja Rentals", price: "₦850,000/yr", location: "Garki, Abuja", rating: 4.6, match: 84, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=250&fit=crop", savedDate: "Mar 10" },
  { id: 4, property: "Penthouse, Banana Island", provider: "Premium Estates", price: "₦12,000,000/yr", location: "Banana Island, Lagos", rating: 5.0, match: 78, image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=250&fit=crop", savedDate: "Mar 8" },
];

const matchColor = (m: number) => m >= 90 ? "bg-emerald-500" : m >= 80 ? "bg-blue-500" : "bg-amber-500";

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Saved Properties</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} properties bookmarked from offers.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search saved..." className="pl-9 w-[180px] h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
            <Button variant={view === "grid" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setView("grid")}><Grid3x3 className="h-4 w-4" /></Button>
            <Button variant={view === "list" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setView("list")}><List className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <Card key={item.id} className="overflow-hidden border border-border/60 shadow-sm hover:shadow-md transition-all duration-200 group">
              <div className="relative overflow-hidden">
                <img src={item.image} alt={item.property} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
                <button className="absolute top-3 right-3 w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-background transition-colors">
                  <Heart className="w-3.5 h-3.5 text-destructive fill-destructive" />
                </button>
                <div className="absolute bottom-3 left-3 flex gap-1.5">
                  <span className={`text-background px-2 py-0.5 rounded text-[11px] font-semibold ${matchColor(item.match)}`}>{item.match}% match</span>
                </div>
              </div>
              <CardContent className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm text-foreground leading-tight">{item.property}</h3>
                  <span className="flex items-center gap-0.5 text-xs shrink-0"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /><span className="font-medium text-foreground">{item.rating}</span></span>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {item.location}</p>
                <p className="text-[11px] text-muted-foreground">by {item.provider} · Saved {item.savedDate}</p>
                <div className="flex items-center justify-between pt-2.5 border-t border-border/60">
                  <p className="text-sm font-bold text-foreground">{item.price}</p>
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1"><ExternalLink className="h-3 w-3" /> View</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <Card key={item.id} className="border border-border/60 shadow-sm hover:shadow-md transition-all group">
              <CardContent className="p-0">
                <div className="flex">
                  <img src={item.image} alt={item.property} className="w-32 h-28 object-cover rounded-l-lg shrink-0" />
                  <div className="flex-1 p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-foreground truncate">{item.property}</h3>
                        <span className={`text-background px-1.5 py-0.5 rounded text-[10px] font-semibold ${matchColor(item.match)}`}>{item.match}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> {item.location}</p>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                        <span>{item.provider}</span>
                        <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {item.rating}</span>
                        <span>Saved {item.savedDate}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 flex flex-col items-end gap-2">
                      <p className="text-sm font-bold text-foreground">{item.price}</p>
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs">View</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
