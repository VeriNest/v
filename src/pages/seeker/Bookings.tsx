import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarCheck, Lock, CheckCircle2, Building2, Eye, Clock, XCircle, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const bookings = [
  { id: "BK-001", property: "3 Bed Flat, Lekki Phase 1", provider: "Adebayo Johnson", amount: "₦2,500,000", status: "Escrow", stage: "Awaiting Viewing", date: "Mar 20, 2024", daysLeft: 5 },
  { id: "BK-002", property: "2 Bed Serviced, Victoria Island", provider: "ShortStay NG", amount: "₦135,000", status: "Confirmed", stage: "Check-in Mar 22", date: "Mar 18, 2024", daysLeft: 2 },
  { id: "BK-003", property: "Studio, Wuse 2 Abuja", provider: "Chioma Okafor", amount: "₦1,200,000", status: "Completed", stage: "Moved In", date: "Feb 15, 2024", daysLeft: 0 },
  { id: "BK-004", property: "1 Bed, Garki Area 11", provider: "Abuja Rentals", amount: "₦850,000", status: "Cancelled", stage: "Refund Processed", date: "Jan 10, 2024", daysLeft: 0 },
];

const statusConfig: Record<string, { color: string; bg: string; icon: any }> = {
  Escrow: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Lock },
  Confirmed: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
  Completed: { color: "text-muted-foreground", bg: "bg-muted border-border", icon: CheckCircle2 },
  Cancelled: { color: "text-destructive", bg: "bg-destructive/5 border-destructive/20", icon: XCircle },
};

export default function Bookings() {
  const [search, setSearch] = useState("");
  const filtered = bookings.filter(b =>
    b.property.toLowerCase().includes(search.toLowerCase()) ||
    b.provider.toLowerCase().includes(search.toLowerCase()) ||
    b.status.toLowerCase().includes(search.toLowerCase())
  );
  const active = filtered.filter(b => b.status === "Escrow" || b.status === "Confirmed");
  const past = filtered.filter(b => b.status === "Completed" || b.status === "Cancelled");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your active bookings, escrow payments, and history.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search bookings..." className="pl-9 w-[220px] h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Active", value: active.length.toString(), icon: CalendarCheck, accent: "text-primary", bg: "bg-primary/10" },
          { label: "In Escrow", value: "₦2.5M", icon: Lock, accent: "text-amber-600", bg: "bg-amber-500/10" },
          { label: "Completed", value: past.filter(b => b.status === "Completed").length.toString(), icon: CheckCircle2, accent: "text-emerald-600", bg: "bg-emerald-500/10" },
          { label: "Total Spent", value: "₦3.8M", icon: Building2, accent: "text-foreground", bg: "bg-muted" },
        ].map((s) => (
          <Card key={s.label} className="border border-border/60 shadow-sm">
            <CardContent className="p-4 flex items-start gap-3">
              <div className={`p-2 rounded-lg ${s.bg} shrink-0`}><s.icon className={`h-4 w-4 ${s.accent}`} /></div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={`text-lg font-bold ${s.accent}`}>{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 h-auto">
          <TabsTrigger value="active" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="past" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Past ({past.length})</TabsTrigger>
          <TabsTrigger value="all" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">All ({filtered.length})</TabsTrigger>
        </TabsList>

        {["active", "past", "all"].map((tab) => {
          const items = tab === "active" ? active : tab === "past" ? past : filtered;
          return (
            <TabsContent key={tab} value={tab} className="space-y-3">
              {items.map((b) => {
                const cfg = statusConfig[b.status];
                const StatusIcon = cfg.icon;
                return (
                  <Card key={b.id} className="border border-border/60 shadow-sm hover:shadow-md transition-all group">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4 min-w-0">
                          <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm font-semibold text-foreground">{b.property}</h3>
                              <Badge variant="outline" className={`text-[11px] px-2 py-0.5 ${cfg.bg} ${cfg.color} border`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {b.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">by {b.provider}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{b.stage}</span>
                              <span>{b.date}</span>
                              {b.daysLeft > 0 && (
                                <span className="text-primary font-medium">{b.daysLeft} days left</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-base font-bold text-foreground">{b.amount}</p>
                          <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{b.id}</p>
                          <Button variant="outline" size="sm" className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                            <Eye className="h-3 w-3" /> View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
