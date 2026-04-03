import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, DollarSign, Zap, CheckCircle2, SlidersHorizontal, Inbox as InboxIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const slaColor = (sla: number) => sla <= 15 ? "text-destructive" : "text-amber-600";
const slaBg = (sla: number) => sla <= 15 ? "bg-destructive" : "bg-amber-500";

export default function LeadInbox() {
  const newLeads = leads.filter(l => l.status === "New");
  const responded = leads.filter(l => l.status === "Responded");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lead Inbox</h1>
          <p className="text-sm text-muted-foreground mt-1">Tenant needs matching your listings. Respond fast to stay boosted.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5">
          <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Leads", value: leads.length.toString(), accent: "text-foreground" },
          { label: "New", value: newLeads.length.toString(), accent: "text-primary" },
          { label: "Responded", value: responded.length.toString(), accent: "text-emerald-600" },
          { label: "Avg SLA", value: "29 min", accent: "text-amber-600" },
        ].map((s) => (
          <Card key={s.label} className="border border-border/60 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-xl font-bold mt-0.5 ${s.accent}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="new" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 h-auto">
          <TabsTrigger value="new" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">New ({newLeads.length})</TabsTrigger>
          <TabsTrigger value="responded" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Responded ({responded.length})</TabsTrigger>
          <TabsTrigger value="all" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">All ({leads.length})</TabsTrigger>
        </TabsList>

        {["new", "responded", "all"].map((tab) => {
          const items = tab === "new" ? newLeads : tab === "responded" ? responded : leads;
          return (
            <TabsContent key={tab} value={tab} className="space-y-3">
              {items.map((lead) => (
                <Card key={lead.id} className="border border-border/60 shadow-sm hover:shadow-md transition-all group">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className={`w-1 shrink-0 rounded-l-lg ${lead.sla > 0 && lead.sla <= 15 ? "bg-destructive" : lead.sla > 15 ? "bg-amber-500" : "bg-emerald-500"}`} />
                      <div className="flex-1 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex gap-3 min-w-0">
                            <Avatar className="h-10 w-10 border border-border/60 shrink-0">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">{lead.initials}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-sm text-foreground">{lead.need}</h3>
                                {lead.status === "New" && <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                                <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{lead.location}</span>
                                <span className="font-semibold text-foreground flex items-center gap-0.5"><DollarSign className="h-3 w-3" />{lead.budget}</span>
                                <span className={`px-1.5 py-0.5 rounded text-[11px] font-medium ${typeStyles[lead.type]}`}>{lead.type}</span>
                                <span>Move-in: {lead.moveIn}</span>
                              </div>
                              <div className="flex gap-1.5 flex-wrap pt-0.5">
                                {lead.features.map((f) => (
                                  <span key={f} className="bg-muted px-2 py-0.5 rounded text-[11px] text-muted-foreground">{f}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-right space-y-1.5 shrink-0">
                            <p className="text-xs text-muted-foreground">{lead.posted}</p>
                            {lead.sla > 0 && (
                              <div className="flex items-center gap-1.5 justify-end">
                                <span className="relative flex h-2 w-2">
                                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${slaBg(lead.sla)} opacity-75`} />
                                  <span className={`relative inline-flex rounded-full h-2 w-2 ${slaBg(lead.sla)}`} />
                                </span>
                                <span className={`text-xs font-medium ${slaColor(lead.sla)}`}>{lead.sla} min left</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4 pt-3 border-t border-border/60">
                          {lead.status === "New" ? (
                            <>
                              <Button size="sm" className="gap-1"><Zap className="h-3.5 w-3.5" /> Send Offer</Button>
                              <Button size="sm" variant="outline">View Details</Button>
                              <Button size="sm" variant="ghost" className="ml-auto text-muted-foreground">Skip</Button>
                            </>
                          ) : (
                            <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Offer Sent
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
