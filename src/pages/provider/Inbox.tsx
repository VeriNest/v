import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, DollarSign, Zap, CheckCircle2, SlidersHorizontal, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchFocus } from "@/hooks/use-search-focus";

export const initialLeads = [
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

export default function LeadInbox() {
  useSearchFocus();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const defaultTab = searchParams.get("tab") ?? "new";

  useEffect(() => {
    setSearch(searchParams.get("q") ?? "");
  }, [searchParams]);

  const filtered = leads.filter(l =>
    l.need.toLowerCase().includes(search.toLowerCase()) ||
    l.location.toLowerCase().includes(search.toLowerCase()) ||
    l.type.toLowerCase().includes(search.toLowerCase())
  );

  const newLeads = filtered.filter(l => l.status === "New");
  const responded = filtered.filter(l => l.status === "Responded");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Lead Inbox</h1>
          <p className="text-sm text-muted-foreground mt-1">Tenant needs matching your listings. Respond fast to stay boosted.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search leads..." className="pl-9 w-full sm:w-[200px] h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Leads", value: filtered.length.toString(), accent: "text-foreground" },
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

      <Tabs defaultValue={defaultTab} className="space-y-4">
        <TabsList className="bg-muted/50 p-1 h-auto">
          <TabsTrigger value="new" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">New ({newLeads.length})</TabsTrigger>
          <TabsTrigger value="responded" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Responded ({responded.length})</TabsTrigger>
          <TabsTrigger value="all" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">All ({filtered.length})</TabsTrigger>
        </TabsList>

        {["new", "responded", "all"].map((tab) => {
          const items = tab === "new" ? newLeads : tab === "responded" ? responded : filtered;
          return (
            <TabsContent key={tab} value={tab}>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {items.map((lead) => (
                  <Card key={lead.id} data-search-id={`provider-inbox-${lead.id}`} className="overflow-hidden border border-border/60 shadow-sm">
                    <CardContent className="space-y-4 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 gap-3">
                          <Avatar className="h-10 w-10 border border-border/60 shrink-0">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">{lead.initials}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-sm text-foreground">{lead.need}</h3>
                              {lead.status === "New" ? <span className="h-2 w-2 rounded-full bg-primary animate-pulse" /> : null}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{lead.location}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[11px] font-medium ${typeStyles[lead.type]}`}>{lead.type}</span>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-2 text-right text-xs text-muted-foreground">
                          <p className="font-medium text-foreground flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{lead.budget}</p>
                          <p className="mt-1">{lead.posted}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-2">
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Move-in</p>
                          <p className="mt-1 text-sm font-medium text-foreground">{lead.moveIn}</p>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-2">
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">SLA</p>
                          {lead.sla > 0 ? (
                            <p className={`mt-1 text-sm font-medium ${slaColor(lead.sla)}`}>{lead.sla} min left</p>
                          ) : (
                            <p className="mt-1 text-sm font-medium text-emerald-600">Handled</p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-1.5 flex-wrap">
                        {lead.features.map((f) => (
                          <span key={f} className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">{f}</span>
                        ))}
                      </div>

                      <div className="flex gap-2 rounded-xl border border-border/60 bg-secondary/30 px-3 py-2.5 flex-wrap">
                        {lead.status === "New" ? (
                          <>
                            <Button size="sm" className="gap-1" onClick={() => navigate(`/provider/inbox/${lead.id}/offer?need=${encodeURIComponent(lead.need)}&leadId=${lead.id}`)}><Zap className="h-3.5 w-3.5" /> Send Offer</Button>
                            <Button size="sm" variant="outline" onClick={() => navigate(`/provider/inbox/${lead.id}`)}>View Details</Button>
                            <Button size="sm" variant="ghost" className="text-muted-foreground">Skip</Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Offer Sent
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => navigate(`/provider/inbox/${lead.id}`)}>View Details</Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
