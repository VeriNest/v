import { Heart, Bed, Maximize, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const properties = [
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=350&fit=crop",
    price: "$12,500,000",
    name: "The Glass Pavilion",
    location: "Montecito, California",
    beds: 6,
    sqft: "8,200",
    featured: true,
  },
  {
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&h=350&fit=crop",
    price: "$8,950,000",
    name: "Skyline Penthouse",
    location: "New York, NY",
    beds: 4,
    sqft: "5,400",
    featured: false,
  },
  {
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=500&h=350&fit=crop",
    price: "$3,200,000",
    name: "Desert Oasis",
    location: "Joshua Tree, CA",
    beds: 3,
    sqft: "3,800",
    featured: false,
  },
  {
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=500&h=350&fit=crop",
    price: "$15,000,000",
    name: "Coastal Retreat",
    location: "Malibu, California",
    beds: 5,
    sqft: "7,600",
    featured: true,
  },
];

const PropertyListings = () => {
  return (
    <section className="px-8 lg:px-20 py-20">
      <div className="flex items-end justify-between mb-12">
        <div>
          <span className="text-xs font-semibold text-primary uppercase tracking-widest mb-3 block">Exclusive Selection</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Curated Listings</h2>
        </div>
        <Button variant="outline" className="rounded-full px-6 gap-2 border-border hover:bg-accent">
          View All Properties <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {properties.map((property) => (
          <div key={property.name} className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:shadow-xl hover:shadow-foreground/5 transition-all duration-300">
            <div className="relative overflow-hidden">
              <img
                src={property.image}
                alt={`${property.name} in ${property.location}`}
                className="w-full h-[220px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {property.featured && (
                <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Featured
                </span>
              )}
              <button className="absolute top-3 right-3 w-8 h-8 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors">
                <Heart className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-foreground mb-1">{property.name}</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">{property.location}</p>
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <p className="text-lg font-bold text-foreground">{property.price}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{property.beds} Beds</span>
                  <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" />{property.sqft} sqft</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PropertyListings;
