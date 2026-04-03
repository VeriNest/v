import { Bed, Maximize, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const properties = [
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=500&fit=crop",
    price: "$12,500,000",
    name: "The Glass Pavilion",
    location: "Montecito, California",
    beds: 6,
    sqft: "8,200",
    featured: true,
  },
  {
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&h=500&fit=crop",
    price: "$8,950,000",
    name: "Skyline Penthouse",
    location: "New York, NY",
    beds: 4,
    sqft: "5,400",
    featured: false,
  },
  {
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=500&h=500&fit=crop",
    price: "$3,200,000",
    name: "Desert Oasis",
    location: "Joshua Tree, CA",
    beds: 3,
    sqft: "3,800",
    featured: false,
  },
  {
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=900&h=500&fit=crop",
    price: "$15,000,000",
    name: "Coastal Retreat",
    location: "Malibu, California",
    beds: 5,
    sqft: "7,600",
    featured: false,
  },
];

const PropertyListings = () => {
  return (
    <section className="px-6 lg:px-16 xl:px-20 py-20">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] font-mono mb-4">
            Exclusive Selection
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl text-foreground">Curated Listings</h2>
        </div>
        <Button variant="ghost" className="gap-2 text-primary hover:text-primary/80 hover:bg-transparent text-sm font-medium px-0">
          View All Properties <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Large featured card - spans 2 cols */}
        <div className="lg:col-span-2 relative group rounded-2xl overflow-hidden h-[380px]">
          <img
            src={properties[0].image}
            alt={`${properties[0].name} luxury villa in ${properties[0].location}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="inline-block bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded font-mono uppercase tracking-wider mb-3">
              Featured
            </span>
            <h3 className="font-serif text-2xl text-white mb-1">{properties[0].name}</h3>
            <p className="text-white/60 text-sm mb-4">{properties[0].location}</p>
            <div className="border-t border-white/20 pt-4 flex items-center justify-between">
              <p className="text-white font-mono font-medium text-lg">{properties[0].price}</p>
              <div className="flex items-center gap-4 text-white/60 text-xs font-mono">
                <span className="flex items-center gap-1.5"><Bed className="w-4 h-4" /> {properties[0].beds} Beds</span>
                <span className="flex items-center gap-1.5"><Maximize className="w-4 h-4" /> {properties[0].sqft} sqft</span>
              </div>
            </div>
          </div>
        </div>

        {/* Smaller card - right side */}
        <div className="relative group rounded-2xl overflow-hidden h-[380px]">
          <img
            src={properties[1].image}
            alt={`${properties[1].name} luxury apartment in ${properties[1].location}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="font-serif text-xl text-white mb-1">{properties[1].name}</h3>
            <p className="text-white/60 text-sm mb-3">{properties[1].location}</p>
            <p className="text-white font-mono font-medium">{properties[1].price}</p>
          </div>
        </div>

        {/* Bottom left - smaller */}
        <div className="relative group rounded-2xl overflow-hidden h-[320px]">
          <img
            src={properties[2].image}
            alt={`${properties[2].name} modern home in ${properties[2].location}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="font-serif text-xl text-white mb-1">{properties[2].name}</h3>
            <p className="text-white/60 text-sm mb-3">{properties[2].location}</p>
            <p className="text-white font-mono font-medium">{properties[2].price}</p>
          </div>
        </div>

        {/* Bottom right - large, spans 2 cols */}
        <div className="lg:col-span-2 relative group rounded-2xl overflow-hidden h-[320px]">
          <img
            src={properties[3].image}
            alt={`${properties[3].name} mansion in ${properties[3].location}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="font-serif text-2xl text-white mb-1">{properties[3].name}</h3>
            <p className="text-white/60 text-sm mb-3">{properties[3].location}</p>
            <div className="flex items-center justify-between">
              <p className="text-white font-mono font-medium text-lg">{properties[3].price}</p>
              <ArrowRight className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyListings;
