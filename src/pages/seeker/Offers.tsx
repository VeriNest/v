import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShieldCheck, Clock, ArrowUpRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const offers = [
  { id: 1, property: "3 Bed Flat, Lekki Phase 1", provider: "Adebayo Johnson", role: "Agent", price: "₦2,500,000/yr", trust: "Verified", rating: 4.8, responseTime: "12 min", match: 95, features: ["24hr Power", "Security", "Parking"], status: "New", initials: "AJ" },
  { id: 2, property: "2 Bed Apartment, Ikeja GRA", provider: "Lagos Homes Ltd", role: "Agent", price: "₦1,800,000/yr", trust: "Verified", rating: 4.5, responseTime: "45 min", match: 88, features: ["Gated Estate", "Water Supply"], status: "Viewed", initials: "LH" },
  { id: 3, property: "Studio, Wuse 2", provider: "Chioma Okafor", role: "Landlord", price: "₦1,200,000/yr", trust: "Pending", rating: 4.2, responseTime: "2 hrs", match: 76, features: ["Furnished", "Security"], status: "New", initials: "CO" },
  { id: 4, property: "2 Bed Serviced, VI", provider: "ShortStay NG", role: "Short-let", price: "₦45,000/night", trust: "Verified", rating: 4.9, responseTime: "5 min", match: 92, features: ["24hr Power", "Furnished", "Pool"], status: "Saved", initials: "SN" },
];

const statusStyles: Record<string, string> = {
  New: "bg-[hsl(263,70%,58%)]/10 text-[hsl(263,70%,58%)] border-[hsl(263,70%,58%)]/20",
  Viewed: "bg-slate-100 text-slate-600 border-slate-200",
  Saved: "bg-amber-50 text-amber-600 border-amber-200",
};

const roleStyles: Record<string, string> = {
  Agent: "bg-[hsl(263,70%,58%)]/10 text-[hsl(263,70%,58%)]",
  Landlord: "bg-blue-500/10 text-blue-600",
  "Short-let": "bg-amber-500/10 text-amber-600",
};

const matchColor = (m: number) => m >= 90 ? "text-emerald-600" : m >= 80 ? "text-blue-600" : "text-amber-600";

export default function Offers() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(263,70%,58%)] to-[hsl(263,70%,35%)] p-6 text-white">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative">
          <h2 className="text-xl font-bold">Incoming Offers</h2>
          <p className="text-white/70 text-sm mt-1">Offers matched to your posted needs, ranked by fit & trust.</p>
        </div>
      </div>

      <div className="space-y-4">
        {offers.map((offer) => (
          <Card key={offer.id} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex">
                {/* Match indicator */}
                <div className={`w-1.5 ${offer.match >= 90 ? "bg-emerald-500" : offer.match >= 80 ? "bg-blue-500" : "bg-amber-500"}`} />
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <Avatar className="h-11 w-11 border-2 border-background shadow-sm mt-0.5">
                        <AvatarFallback className="text-xs bg-[hsl(263,70%,58%)]/10 text-[hsl(263,70%,58%)] font-medium">
                          {offer.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm">{offer.property}</h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyles[offer.status]}`}>
                            {offer.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{offer.provider}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleStyles[offer.role]}`}>{offer.role}</span>
                          <span className="flex items-center gap-1">
                            {offer.trust === "Verified" ? <ShieldCheck className="h-3 w-3 text-emerald-600" /> : <Clock className="h-3 w-3 text-amber-600" />}
                            {offer.trust}
                          </span>
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                          {offer.features.map((f) => (
                            <span key={f} className="bg-muted px-2 py-0.5 rounded text-xs text-muted-foreground">{f}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-1.5 shrink-0">
                      <p className="text-lg font-bold">{offer.price}</p>
                      <div className="flex items-center gap-1 justify-end text-sm">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{offer.rating}</span>
                      </div>
                      <div className={`text-xs font-semibold ${matchColor(offer.match)}`}>
                        <span className="flex items-center gap-0.5 justify-end">
                          <ArrowUpRight className="h-3 w-3" />
                          {offer.match}% match
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-0.5"><Zap className="h-3 w-3" /> {offer.responseTime}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 pt-3 border-t">
                    <Button size="sm" className="bg-[hsl(263,70%,58%)] hover:bg-[hsl(263,70%,48%)]">View Details</Button>
                    <Button size="sm" variant="outline">Schedule Viewing</Button>
                    <Button size="sm" variant="ghost">Save</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
