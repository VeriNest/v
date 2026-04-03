import { Heart, Bed, Maximize, ArrowRight, MapPin } from "lucide-react";
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
    tag: "Featured",
  },
  {
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&h=350&fit=crop",
    price: "$8,950,000",
    name: "Skyline Penthouse",
    location: "New York, NY",
    beds: 4,
    sqft: "5,400",
    featured: false,
    tag: "Buy",
  },
  {
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=500&h=350&fit=crop",
    price: "$3,200,000",
    name: "Desert Oasis",
    location: "Joshua Tree, CA",
    beds: 3,
    sqft: "3,800",
    featured: false,
    tag: "Buy",
  },
  {
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=500&h=350&fit=crop",
    price: "$15,000,000",
    name: "Coastal Retreat",
    location: "Malibu, California",
    beds: 5,
    sqft: "7,600",
    featured: true,
    tag: "Featured",
  },
];

const PropertyListings = () => {
  return (
    <section className="px-6 lg:px-16 xl:px-20 py-20">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] mb-4">Exclusive Selection</p>
          <h2 className="font-serif text-3xl lg:text-4xl text-foreground">Curated Listings</h2>
        </div>
        <Button variant="outline" className="rounded-lg px-5 gap-2 border-border text-foreground hover:bg-accent text-sm font-medium">
          View All Properties <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {properties.map((property) => (
          <div key={property.name} className="group bg-card rounded-xl overflow-hidden border border-border/50 hover:shadow-lg transition-all duration-300">
            <div className="relative overflow-hidden">
              <img
                src={property.image}
                alt={`${property.name} in ${property.location}`}
                className="w-full h-[220px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className={`absolute top-3 left-3 text-[10px] font-bold px-3 py-1 rounded font-mono uppercase tracking-wider ${
                property.featured
                  ? "bg-primary text-primary-foreground"
                  : "bg-emerald-500 text-white"
              }`}>
                {property.tag}
              </span>
              <button className="absolute top-3 right-3 w-8 h-8 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors">
                <Heart className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-lg font-bold text-primary font-mono mb-1">{property.price}</p>
              <h3 className="font-semibold text-foreground text-[15px] mb-1">{property.name}</h3>
              <p className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                <MapPin className="w-3 h-3" /> {property.location}
              </p>
              <div className="flex items-center gap-4 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{property.beds} Beds</span>
                <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" />{property.sqft} sqft</span>
              </div>
              <Button variant="outline" className="w-full mt-4 rounded-lg text-sm text-primary border-primary/20 hover:bg-primary/5 hover:text-primary font-medium">
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PropertyListings;
