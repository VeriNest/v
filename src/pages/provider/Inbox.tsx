import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, DollarSign, Inbox as InboxIcon, Zap, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const leads = [
  { id: 1, need: "3 Bed Flat in Lekki Phase 1", budget: "₦2,500,000/yr", location: "Lekki, Lagos", type: "Rent", moveIn: "April 2024", posted: "15 min ago", sla: 12, features: ["24hr Power", "Security", "Parking"], status: "New", initials: "AT" },
  { id: 2, need: "Studio Apartment in Wuse 2", budget: "₦1,200,000/yr", location: "Wuse 2, Abuja", type: "Rent", moveIn: "May 2024", posted: "1 hr ago", sla: 45, features: ["Furnished", "Security"], status: "New", initials: "AT" },
  { id: 3, need: "Short-let in Victoria Island, 3 nights", budget: "₦50,000/night", location: "VI, Lagos", type: "Short-let", moveIn: "Mar 22-25", posted: "2 hrs ago", sla: 0, features: ["Furnished", "Pool", "Gym"], status: "Responded", initials: "CC" },
  { id: 4, need: "2 Bed in Ikeja GRA", budget: "₦1,800,000/yr", location: "Ikeja, Lagos", type: "Rent", moveIn: "April 2024", posted: "3 hrs ago", sla: 0, features: ["Gated Estate", "Water"], status: "Responded", initials: "OB" },
  { id: 5, need: "4 Bed Duplex in Maitama", budget: "₦5,000,000/yr", location: "Maitama, Abuja", type: "Rent", moveIn: "June 2024", posted: "5 hrs ago", sla: 30, features: ["Security", "Garden", "BQ"], status: "New", initials: "FA" },
];

const typeStyles: Record<string, string> = {
  Rent: "bg-primary/10 text-primary",
  "Short-let": "bg-amber-500/10 text-amber-600",
};

export default function LeadInbox() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/70 p-6 text-white">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-xl">
            <InboxIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Lead Inbox</h2>
            <p className="text-white/70 text-sm">Tenant needs matching your listings. Respond fast to stay boosted.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {leads.map((lead) => (
          <Card key={lead.id} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex">
                {lead.sla > 0 && lead.sla <= 15 && <div className="w-1.5 bg-red-500" />}
                {lead.sla > 15 && <div className="w-1.5 bg-amber-500" />}
                {lead.sla === 0 && <div className="w-1.5 bg-emerald-500" />}
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10 border-2 border-background shadow-sm mt-0.5">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
                          {lead.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm">{lead.need}</h3>
                          {lead.status === "New" && (
                            <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full text-xs font-medium">New</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{lead.location}</span>
                          <span className="flex items-center gap-1 font-semibold text-foreground"><DollarSign className="h-3 w-3" />{lead.budget}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeStyles[lead.type]}`}>{lead.type}</span>
                          <span>Move-in: {lead.moveIn}</span>
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                          {lead.features.map((f) => (
                            <span key={f} className="bg-muted px-2 py-0.5 rounded text-xs text-muted-foreground">{f}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2 shrink-0">
                      <p className="text-xs text-muted-foreground">{lead.posted}</p>
                      {lead.sla > 0 && (
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className="relative flex h-2 w-2">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${lead.sla <= 15 ? "bg-red-400" : "bg-amber-400"} opacity-75`} />
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${lead.sla <= 15 ? "bg-red-500" : "bg-amber-500"}`} />
                          </span>
                          <span className={`text-xs font-medium ${lead.sla <= 15 ? "text-red-500" : "text-amber-600"}`}>{lead.sla} min left</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 pt-3 border-t">
                    {lead.status === "New" ? (
                      <>
                        <Button size="sm" className="bg-primary hover:bg-primary/90 gap-1">
                          <Zap className="h-3.5 w-3.5" />
                          Send Offer
                        </Button>
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm" variant="ghost">Skip</Button>
                      </>
                    ) : (
                      <Button size="sm" variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Offer Sent
                      </Button>
                    )}
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
