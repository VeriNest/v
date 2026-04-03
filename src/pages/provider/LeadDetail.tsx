import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, MapPin, DollarSign, CalendarDays, Clock, ShieldCheck, ShieldAlert, Zap, Home, CheckCircle2 } from "lucide-react";
import { SendOfferSheet } from "@/components/provider/SendOfferSheet";

const leads = [
  { id: 1, need: "3 Bed Flat in Lekki Phase 1", budget: "₦2,500,000/yr", location: "Lekki, Lagos", type: "Rent", moveIn: "April 2024", posted: "15 min ago", sla: 12, features: ["24hr Power", "Security", "Parking"], status: "New", initials: "AT", tenant: "Adaeze T.", verified: false, description: "Looking for a spacious 3-bedroom flat in a quiet, secure estate in Lekki Phase 1. Must have 24hr power supply and parking. Prefer ground floor or first floor. Budget is flexible for the right property.", urgency: "High" },
  { id: 2, need: "Studio Apartment in Wuse 2", budget: "₦1,200,000/yr", location: "Wuse 2, Abuja", type: "Rent", moveIn: "May 2024", posted: "1 hr ago", sla: 45, features: ["Furnished", "Security"], status: "New", initials: "AT", tenant: "Amina T.", verified: true, description: "Need a furnished studio apartment in Wuse 2 for a single professional. Proximity to the business district is important. Must have reliable security.", urgency: "Medium" },
  { id: 3, need: "Short-let in Victoria Island, 3 nights", budget: "₦50,000/night", location: "VI, Lagos", type: "Short-let", moveIn: "Mar 22-25", posted: "2 hrs ago", sla: 0, features: ["Furnished", "Pool", "Gym"], status: "Responded", initials: "CC", tenant: "Chike C.", verified: true, description: "Looking for a premium short-let apartment in VI for a business trip. Must have pool and gym access. Self-contained with modern amenities.", urgency: "High" },
  { id: 4, need: "2 Bed in Ikeja GRA", budget: "₦1,800,000/yr", location: "Ikeja, Lagos", type: "Rent", moveIn: "April 2024", posted: "3 hrs ago", sla: 0, features: ["Gated Estate", "Water"], status: "Responded", initials: "OB", tenant: "Olumide B.", verified: false, description: "Family of 3 looking for a 2-bedroom flat in Ikeja GRA. Must be within a gated estate with constant water supply. Close to schools is a plus.", urgency: "Low" },
  { id: 5, need: "4 Bed Duplex in Maitama", budget: "₦5,000,000/yr", location: "Maitama, Abuja", type: "Rent", moveIn: "June 2024", posted: "5 hrs ago", sla: 30, features: ["Security", "Garden", "BQ"], status: "New", initials: "FA", tenant: "Fatima A.", verified: true, description: "Relocating diplomat family needs a 4-bedroom duplex with BQ in Maitama. Must have a garden and 24hr security. Flexible on budget for the right property.", urgency: "High" },
];

const typeStyles: Record<string, string> = {
  Rent: "bg-primary/10 text-primary",
  "Short-let": "bg-amber-500/10 text-amber-600",
};

const urgencyStyles: Record<string, string> = {
  High: "bg-destructive/10 text-destructive",
  Medium: "bg-amber-500/10 text-amber-600",
  Low: "bg-emerald-500/10 text-emerald-600",
};

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offerOpen, setOfferOpen] = useState(false);
  const [responded, setResponded] = useState(false);

  const lead = leads.find((l) => l.id === Number(id));

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <Home className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-muted-foreground">Lead not found</p>
        <Button variant="outline" onClick={() => navigate("/provider/inbox")}>Back to Inbox</Button>
      </div>
    );
  }

  const isResponded = responded || lead.status === "Responded";

  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={() => navigate("/provider/inbox")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Inbox
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-foreground">{lead.need}</h1>
          <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeStyles[lead.type]}`}>{lead.type}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${urgencyStyles[lead.urgency]}`}>{lead.urgency} urgency</span>
            <span className="flex items-center gap-0.5"><Clock className="h-3.5 w-3.5" /> Posted {lead.posted}</span>
          </div>
        </div>
        {!isResponded ? (
          <Button className="gap-1.5 shrink-0" onClick={() => setOfferOpen(true)}>
            <Zap className="h-4 w-4" /> Send Offer
          </Button>
        ) : (
          <Badge variant="outline" className="text-emerald-600 border-emerald-200 gap-1 shrink-0">
            <CheckCircle2 className="h-3.5 w-3.5" /> Offer Sent
          </Badge>
        )}
      </div>

      {/* SLA */}
      {lead.sla > 0 && !isResponded && (
        <div className={`rounded-xl p-3 flex items-center gap-2 text-sm ${lead.sla <= 15 ? "bg-destructive/5 text-destructive" : "bg-amber-50 text-amber-700"}`}>
          <Clock className="h-4 w-4" />
          <span className="font-medium">{lead.sla} minutes left</span> to respond for priority boost
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-3">
        {/* Details */}
        <Card className="md:col-span-2 border border-border/60">
          <CardContent className="p-5 space-y-5">
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-2">Description</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{lead.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Budget</p>
                <p className="text-sm font-semibold text-foreground flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{lead.budget}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-semibold text-foreground flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{lead.location}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Move-in Date</p>
                <p className="text-sm font-semibold text-foreground flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{lead.moveIn}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="text-sm font-semibold text-foreground">{lead.type}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">Features Required</p>
              <div className="flex gap-1.5 flex-wrap">
                {lead.features.map((f) => (
                  <span key={f} className="bg-muted px-2.5 py-1 rounded-lg text-xs text-muted-foreground">{f}</span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tenant Profile */}
        <Card className="border border-border/60">
          <CardContent className="p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Tenant Profile</h2>
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11 border border-border/60">
                <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">{lead.initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">{lead.tenant}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {lead.verified ? (
                    <>
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-xs text-emerald-600">Verified</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-xs text-amber-600">Unverified</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-2 pt-2 border-t border-border/60">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Response rate</span>
                <span className="font-medium text-foreground">87%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Member since</span>
                <span className="font-medium text-foreground">Jan 2024</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Needs posted</span>
                <span className="font-medium text-foreground">3</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <SendOfferSheet
        open={offerOpen}
        onOpenChange={setOfferOpen}
        leadNeed={lead.need}
        onOfferSent={() => setResponded(true)}
      />
    </div>
  );
}
