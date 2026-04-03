import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Bed, Bath, Star, Eye, Home, Grid3X3, List, ArrowRight, Maximize } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const allProperties = [
  { id: 1, title: "Modern 2BR Apartment", location: "Victoria Island, Lagos", price: "₦850,000", period: "/month", beds: 2, baths: 2, sqft: "1,200", rating: 4.8, views: 234, match: 95, type: "Apartment", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop" },
  { id: 2, title: "Cozy Studio Flat", location: "Lekki Phase 1, Lagos", price: "₦450,000", period: "/month", beds: 1, baths: 1, sqft: "650", rating: 4.5, views: 189, match: 88, type: "Studio", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop" },
  { id: 3, title: "Spacious 3BR Duplex", location: "Ikeja GRA, Lagos", price: "₦1,200,000", period: "/month", beds: 3, baths: 3, sqft: "2,800", rating: 4.9, views: 312, match: 92, type: "Duplex", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop" },
  { id: 4, title: "Luxury Penthouse", location: "Banana Island, Lagos", price: "₦3,500,000", period: "/month", beds: 4, baths: 4, sqft: "4,500", rating: 5.0, views: 456, match: 78, type: "Penthouse", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop" },
  { id: 5, title: "Furnished 1BR Flat", location: "Yaba, Lagos", price: "₦350,000", period: "/month", beds: 1, baths: 1, sqft: "550", rating: 4.3, views: 145, match: 85, type: "Apartment", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop" },
  { id: 6, title: "Executive 3BR Flat", location: "Ikoyi, Lagos", price: "₦2,100,000", period: "/month", beds: 3, baths: 2, sqft: "2,200", rating: 4.7, views: 278, match: 90, type: "Apartment", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop" },
  { id: 7, title: "Charming Bungalow", location: "Ajah, Lagos", price: "₦550,000", period: "/month", beds: 2, baths: 2, sqft: "1,600", rating: 4.4, views: 167, match: 82, type: "Bungalow", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop" },
  { id: 8, title: "Mini Flat Self-Con", location: "Surulere, Lagos", price: "₦250,000", period: "/month", beds: 1, baths: 1, sqft: "400", rating: 4.1, views: 98, match: 76, type: "Mini Flat", image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&h=400&fit=crop" },
];

const Properties = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = allProperties.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero / Filter Bar */}
      <section className="px-6 lg:px-16 xl:px-20 pt-28 pb-16 bg-secondary/30">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] font-mono mb-4">Explore</p>
          <h1 className="font-serif text-4xl lg:text-5xl text-foreground leading-[1.15] mb-5">
            Browse <span className="italic text-primary">Properties</span>
          </h1>
          <p className="text-muted-foreground text-[15px] leading-relaxed max-w-md">
            Discover verified rental properties curated to match your lifestyle, budget, and preferences.
          </p>
        </div>

        {/* Search bar - matching hero style */}
        <div className="max-w-3xl">
          <div className="bg-card border border-border rounded-2xl p-3 shadow-md">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 border-0 bg-secondary/50 focus-visible:ring-1 h-12 text-sm"
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-[160px] border-0 bg-secondary/50 h-12">
                    <Home className="w-4 h-4 mr-1.5 text-muted-foreground shrink-0" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Studio">Studio</SelectItem>
                    <SelectItem value="Duplex">Duplex</SelectItem>
                    <SelectItem value="Penthouse">Penthouse</SelectItem>
                    <SelectItem value="Bungalow">Bungalow</SelectItem>
                    <SelectItem value="Mini Flat">Mini Flat</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-1 border border-border rounded-xl p-1 bg-secondary/50">
                  <Button variant={viewMode === "grid" ? "default" : "ghost"} size="icon" className="h-10 w-10 rounded-lg" onClick={() => setViewMode("grid")}><Grid3X3 className="w-4 h-4" /></Button>
                  <Button variant={viewMode === "list" ? "default" : "ghost"} size="icon" className="h-10 w-10 rounded-lg" onClick={() => setViewMode("list")}><List className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="px-6 lg:px-16 xl:px-20 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] font-mono mb-2">Results</p>
            <p className="text-sm text-muted-foreground">{filtered.length} properties found</p>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((property) => (
              <div key={property.id} className="relative group rounded-2xl overflow-hidden cursor-pointer h-[340px]">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Match badge */}
                <div className="absolute top-3 left-3">
                  <span className="inline-block bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded font-mono uppercase tracking-wider">
                    {property.match}% match
                  </span>
                </div>
                {/* Overlay card */}
                <div className="absolute bottom-3 left-3 right-3 bg-card/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-border/30">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-foreground text-sm truncate">{property.title}</h3>
                    <p className="font-bold text-foreground text-sm font-mono shrink-0">{property.price}</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono uppercase tracking-wider mb-2.5">
                    <MapPin className="h-3 w-3 shrink-0" /> {property.location}
                  </p>
                  <div className="flex items-center justify-between pt-2.5 border-t border-border/40">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {property.beds}</span>
                      <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {property.baths}</span>
                      <span className="flex items-center gap-1"><Maximize className="w-3 h-3" /> {property.sqft}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> <span className="font-medium text-foreground">{property.rating}</span></span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {property.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((property) => (
              <div key={property.id} className="bg-card rounded-xl border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="flex gap-0">
                  <div className="relative w-48 h-36 shrink-0">
                    <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 inline-block bg-primary text-primary-foreground text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                      {property.match}%
                    </span>
                  </div>
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-serif text-base text-foreground mb-1">{property.title}</h3>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono uppercase tracking-wider">
                          <MapPin className="h-3 w-3" /> {property.location}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-foreground font-mono text-base">{property.price}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{property.period}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3 pt-3 border-t border-border/40">
                      <Badge variant="secondary" className="text-[10px] font-mono uppercase tracking-wider">{property.type}</Badge>
                      <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {property.beds} Beds</span>
                      <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {property.baths} Baths</span>
                      <span className="flex items-center gap-1"><Maximize className="w-3 h-3" /> {property.sqft} sqft</span>
                      <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> <span className="font-medium text-foreground">{property.rating}</span></span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {property.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-serif text-lg text-foreground mb-2">No properties found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-16 xl:px-20 py-20 bg-[hsl(var(--dark-bg))]">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl lg:text-4xl text-primary-foreground mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-primary-foreground/40 mb-10 text-[15px] leading-relaxed">
            Post your housing need and let verified agents come to you with personalized offers.
          </p>
          <Button className="rounded-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium gap-2" asChild>
            <Link to="/signup">Post Your Need <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Properties;
