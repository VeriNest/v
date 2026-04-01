import { Heart, Bed, Bath, Maximize, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const properties = [
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=280&fit=crop",
    price: "$2,095",
    period: "/month",
    name: "Palm Harbor",
    address: "2699 Green Valley, Highland Lake, FL",
    beds: 3,
    baths: 2,
    sqft: "5x7",
    popular: true,
  },
  {
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=280&fit=crop",
    price: "$2,700",
    period: "/month",
    name: "Beverly Springfield",
    address: "2699 Green Valley, Highland Lake, FL",
    beds: 4,
    baths: 2,
    sqft: "6x7.5",
    popular: true,
  },
  {
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=280&fit=crop",
    price: "$4,550",
    period: "/month",
    name: "Faulkner Ave",
    address: "909 Woodland St, Michigan, IN",
    beds: 4,
    baths: 3,
    sqft: "8x10",
    popular: false,
  },
  {
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=280&fit=crop",
    price: "$2,400",
    period: "/month",
    name: "St. Crystal",
    address: "210 US Highway, Highland Lake, FL",
    beds: 4,
    baths: 2,
    sqft: "6x8",
    popular: true,
  },
  {
    image: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=400&h=280&fit=crop",
    price: "$1,500",
    period: "/month",
    name: "Cove Red",
    address: "243 Cudarhy St, Michigan, IN",
    beds: 2,
    baths: 1,
    sqft: "5x7.5",
    popular: false,
  },
  {
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=280&fit=crop",
    price: "$3,200",
    period: "/month",
    name: "Tarpon Bay",
    address: "103 Lake Shores, Michigan, IN",
    beds: 3,
    baths: 3,
    sqft: "5x7",
    popular: true,
  },
];

const PropertyListings = () => {
  const [activeTab, setActiveTab] = useState("Rent");

  return (
    <section className="px-20 py-20">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-foreground mb-2">Based on your location</h2>
        <p className="text-muted-foreground text-sm">Some of our picked properties near you location.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-6 mb-10">
        {["Rent", "Buy", "Sell"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
        <button className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        {properties.map((property) => (
          <div key={property.name} className="bg-background rounded-2xl overflow-hidden border border-border shadow-sm">
            <div className="relative">
              <img src={property.image} alt={property.name} className="w-full h-[200px] object-cover" />
              {property.popular && (
                <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Popular
                </span>
              )}
              <button className="absolute top-3 right-3 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-baseline justify-between mb-1">
                <h3 className="font-semibold text-foreground">{property.name}</h3>
                <p className="text-primary font-bold text-lg">
                  {property.price}<span className="text-xs text-muted-foreground font-normal">{property.period}</span>
                </p>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{property.address}</p>
              <div className="flex items-center gap-4 pt-3 border-t border-border">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Bed className="w-3.5 h-3.5" /> {property.beds} Beds
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Bath className="w-3.5 h-3.5" /> {property.baths} Bathrooms
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Maximize className="w-3.5 h-3.5" /> {property.sqft} m²
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline" className="rounded-full px-8 border-primary text-primary hover:bg-primary/5">
          Browse more properties
        </Button>
      </div>
    </section>
  );
};

export default PropertyListings;
