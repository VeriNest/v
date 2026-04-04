import { Bed, Bath, Maximize, ArrowRight, MapPin, Star } from "lucide-react";

import MarketingShell from "@/components/layout/MarketingShell";
import { Button } from "@/components/ui/button";

const properties = [
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=500&fit=crop",
    price: "$12,500,000",
    name: "The Glass Pavilion",
    location: "Montecito, California",
    beds: 6,
    baths: 5,
    sqft: "8,200",
    rating: 4.9,
    match: 97,
    featured: true,
  },
  {
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&h=500&fit=crop",
    price: "$8,950,000",
    name: "Skyline Penthouse",
    location: "New York, NY",
    beds: 4,
    baths: 3,
    sqft: "5,400",
    rating: 4.7,
    match: 92,
    featured: false,
  },
  {
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=500&h=500&fit=crop",
    price: "$3,200,000",
    name: "Desert Oasis",
    location: "Joshua Tree, CA",
    beds: 3,
    baths: 2,
    sqft: "3,800",
    rating: 4.6,
    match: 84,
    featured: false,
  },
  {
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=900&h=500&fit=crop",
    price: "$15,000,000",
    name: "Coastal Retreat",
    location: "Malibu, California",
    beds: 5,
    baths: 4,
    sqft: "7,600",
    rating: 5.0,
    match: 98,
    featured: false,
  },
];

const PropertyListings = () => {
  return (
    <section className="px-6 lg:px-16 xl:px-20 py-20">
      <MarketingShell>
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] font-mono mb-4">
              Exclusive Selection
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl text-foreground">Curated Listings</h2>
          </div>
          <Button
            variant="ghost"
            className="gap-2 text-primary hover:text-primary/80 hover:bg-transparent text-sm font-medium px-0"
          >
            View All Properties <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <PropertyCard property={properties[0]} className="lg:col-span-2 h-[380px]" featured />
          <PropertyCard property={properties[1]} className="h-[380px]" />
          <PropertyCard property={properties[2]} className="h-[380px]" />
          <PropertyCard property={properties[3]} className="lg:col-span-2 h-[380px]" />
        </div>
      </MarketingShell>
    </section>
  );
};

function PropertyCard({
  property,
  className = "",
  featured = false,
}: {
  property: (typeof properties)[0];
  className?: string;
  featured?: boolean;
}) {
  return (
    <div className={`relative group rounded-2xl overflow-hidden cursor-pointer ${className}`}>
      <img
        src={property.image}
        alt={`${property.name} in ${property.location}`}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />

      <div className="absolute top-3 left-3">
        {featured && (
          <span className="inline-block bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded font-mono uppercase tracking-wider">
            Featured
          </span>
        )}
      </div>

      <div className="absolute bottom-3 left-3 right-3 bg-card/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-border/30">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-semibold text-foreground truncate ${featured ? "text-base" : "text-sm"}`}>
                {property.name}
              </h3>
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase shrink-0">
                {property.match}% match
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono uppercase tracking-wider">
              <MapPin className="h-3 w-3 shrink-0" /> {property.location}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className={`font-bold text-foreground font-mono ${featured ? "text-base" : "text-sm"}`}>
              {property.price}
            </p>
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5" /> {property.beds}
              </span>
              <span className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5" /> {property.baths}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/40">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="font-medium text-foreground">{property.rating}</span>
            </span>
            <span className="flex items-center gap-1">
              <Maximize className="w-3 h-3" /> {property.sqft} sqft
            </span>
          </div>
          <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 text-primary hover:text-primary/80 px-2">
            View Details <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PropertyListings;
