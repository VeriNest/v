import { Heart, Bed, Bath, Maximize, Search, Key, Building, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const properties = [
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=260&fit=crop",
    price: "$2,095",
    period: "/month",
    name: "Palm Harbor",
    address: "2699 Green Valley, Highland Lake, FL",
    beds: 3,
    baths: 2,
    sqft: "5x7 m²",
    popular: true,
  },
  {
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=260&fit=crop",
    price: "$2,700",
    period: "/month",
    name: "Beverly Springfield",
    address: "2837 Lake Sevilla, Palm Harbor, TX",
    beds: 4,
    baths: 2,
    sqft: "6x7.5 m²",
    popular: true,
  },
  {
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=260&fit=crop",
    price: "$4,550",
    period: "/month",
    name: "Faulkner Ave",
    address: "909 Woodland St, Michigan, IN",
    beds: 4,
    baths: 3,
    sqft: "8x10 m²",
    popular: true,
  },
  {
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=260&fit=crop",
    price: "$2,400",
    period: "/month",
    name: "St. Crystal",
    address: "210 US Highway, Highland Lake, FL",
    beds: 4,
    baths: 2,
    sqft: "4x8 m²",
    popular: false,
  },
  {
    image: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=400&h=260&fit=crop",
    price: "$1,500",
    period: "/month",
    name: "Cove Red",
    address: "2193 Cove Road, Palm Harbor, TX",
    beds: 2,
    baths: 1,
    sqft: "5x7.5 m²",
    popular: false,
  },
  {
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=260&fit=crop",
    price: "$1,600",
    period: "/month",
    name: "Tarpon Bay",
    address: "103 Lake Shores, Michigan, IN",
    beds: 3,
    baths: 3,
    sqft: "5x7 m²",
    popular: false,
  },
];

const PropertyListings = () => {
  const [activeTab, setActiveTab] = useState("Rent");

  return (
    <section className="px-20 py-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Based on your location</h2>
        <p className="text-muted-foreground text-sm">Some of our picked properties near your location.</p>
      </div>

      {/* Tabs row */}
      <div className="flex items-center justify-between mb-8 max-w-3xl mx-auto">
        <div className="flex items-center bg-background border border-border rounded-full overflow-hidden">
          {[
            { name: "Rent", icon: Key },
            { name: "Buy", icon: Building },
            { name: "Sell", icon: Home },
          ].map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => setActiveTab(name)}
              className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium transition-colors ${
                activeTab === name
                  ? "bg-primary text-primary-foreground rounded-full"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 border border-border rounded-full px-4 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Search...</span>
        </div>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-3 gap-7 mb-10">
        {properties.map((property) => (
          <div key={property.name} className="group">
            <div className="relative mb-3">
              <img src={property.image} alt={property.name} className="w-full h-[200px] object-cover rounded-xl" />
              {property.popular && (
                <span className="absolute bottom-3 left-3 bg-primary text-primary-foreground text-[9px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  Popular
                </span>
              )}
            </div>
            <div className="flex items-start justify-between mb-1">
              <div>
                <p className="text-primary font-bold text-lg">
                  {property.price}<span className="text-xs text-muted-foreground font-normal">{property.period}</span>
                </p>
              </div>
              <button className="mt-1">
                <Heart className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
              </button>
            </div>
            <h3 className="font-semibold text-foreground text-base mb-0.5">{property.name}</h3>
            <p className="text-xs text-muted-foreground mb-2.5">{property.address}</p>
            <div className="flex items-center gap-3 pt-2.5 border-t border-border">
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Bed className="w-3 h-3" /> {property.beds} Beds
              </div>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Bath className="w-3 h-3" /> {property.baths} Bathrooms
              </div>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Maximize className="w-3 h-3" /> {property.sqft}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Button className="rounded-full px-8 bg-primary text-primary-foreground hover:bg-primary/90">
          Browse more properties
        </Button>
      </div>
    </section>
  );
};

export default PropertyListings;
