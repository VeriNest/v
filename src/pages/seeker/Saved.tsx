import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MapPin, Star, Bookmark } from "lucide-react";

const saved = [
  { id: 1, property: "3 Bed Flat, Lekki Phase 1", provider: "Adebayo Johnson", price: "₦2,500,000/yr", location: "Lekki, Lagos", rating: 4.8, match: 95, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=250&fit=crop" },
  { id: 2, property: "2 Bed Serviced, Victoria Island", provider: "ShortStay NG", price: "₦45,000/night", location: "VI, Lagos", rating: 4.9, match: 92, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=250&fit=crop" },
];

export default function Saved() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(263,70%,58%)] to-[hsl(263,70%,35%)] p-6 text-white">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-xl">
            <Bookmark className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Saved Properties</h2>
            <p className="text-white/70 text-sm">Properties you've bookmarked from offers.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {saved.map((item) => (
          <Card key={item.id} className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="relative overflow-hidden">
              <img src={item.image} alt={item.property} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <button className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              </button>
              <div className="absolute bottom-3 left-3">
                <span className="bg-[hsl(263,70%,58%)] text-white px-2.5 py-1 rounded-full text-xs font-semibold">
                  {item.match}% match
                </span>
              </div>
            </div>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{item.property}</h3>
                <span className="flex items-center gap-1 text-sm bg-amber-50 px-2 py-0.5 rounded-full">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-amber-700">{item.rating}</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> {item.location}
              </p>
              <p className="text-xs text-muted-foreground">by {item.provider}</p>
              <div className="flex items-center justify-between pt-2 border-t">
                <p className="text-lg font-bold text-foreground">{item.price}</p>
                <Button size="sm" className="bg-[hsl(263,70%,58%)] hover:bg-[hsl(263,70%,48%)]">View Offer</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
