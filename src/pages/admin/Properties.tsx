import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, MoreHorizontal, Building2, MapPin, Plus, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchFocus } from "@/hooks/use-search-focus";

export const properties = [
  { id: "P-001", title: "3 Bedroom Flat, Lekki Phase 1", agent: "Adebayo Johnson", price: "₦2,500,000/yr", location: "Lagos", status: "Active", date: "Mar 15, 2024" },
  { id: "P-002", title: "Studio Apartment, Wuse 2", agent: "Chioma Okafor", price: "₦1,200,000/yr", location: "Abuja", status: "Pending", date: "Mar 14, 2024" },
  { id: "P-003", title: "4 Bedroom Duplex, GRA", agent: "Emeka Nwankwo", price: "₦5,000,000/yr", location: "Port Harcourt", status: "Active", date: "Mar 13, 2024" },
  { id: "P-004", title: "2 Bedroom Flat, Ikeja", agent: "Fatima Abdullahi", price: "₦1,800,000/yr", location: "Lagos", status: "Rejected", date: "Mar 12, 2024" },
  { id: "P-005", title: "Self-Contain, Surulere", agent: "Oluwaseun Bakare", price: "₦600,000/yr", location: "Lagos", status: "Active", date: "Mar 11, 2024" },
  { id: "P-006", title: "5 Bedroom House, Maitama", agent: "Ibrahim Yusuf", price: "₦8,000,000/yr", location: "Abuja", status: "Pending", date: "Mar 10, 2024" },
];

const statusStyles: Record<string, { color: string; bg: string; dot: string }> = {
  Active: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  Pending: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", dot: "bg-amber-500" },
  Rejected: { color: "text-destructive", bg: "bg-destructive/5 border-destructive/20", dot: "bg-destructive" },
};

export default function Properties() {
  useSearchFocus();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setSearch(searchParams.get("q") ?? "");
  }, [searchParams]);

  const filtered = properties.filter((property) =>
    property.title.toLowerCase().includes(search.toLowerCase()) ||
    property.agent.toLowerCase().includes(search.toLowerCase()) ||
    property.location.toLowerCase().includes(search.toLowerCase()),
  );
  const active = filtered.filter((property) => property.status === "Active");
  const pending = filtered.filter((property) => property.status === "Pending");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Properties</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all property listings across the platform.</p>
        </div>
        <Button size="sm" className="gap-2 self-start"><Plus className="h-4 w-4" /> Add Property</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Listings", value: "2,847", sub: "+42 this week", accent: "text-foreground" },
          { label: "Active", value: "2,104", sub: "73.9%", accent: "text-emerald-600" },
          { label: "Pending Review", value: "389", sub: "12 urgent", accent: "text-amber-600" },
          { label: "Rejected", value: "354", sub: "-8% vs last month", accent: "text-destructive" },
        ].map((stat) => (
          <Card key={stat.label} className="border border-border/60 shadow-sm">
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={`text-lg sm:text-xl font-bold mt-0.5 ${stat.accent}`}>{stat.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 h-auto flex-wrap">
          <TabsTrigger value="all" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">All ({filtered.length})</TabsTrigger>
          <TabsTrigger value="active" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="pending" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Pending ({pending.length})</TabsTrigger>
        </TabsList>

        {["all", "active", "pending"].map((tab) => {
          const items = tab === "active" ? active : tab === "pending" ? pending : filtered;
          return (
            <TabsContent key={tab} value={tab}>
              <Card className="border border-border/60 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">Properties</CardTitle>
                      <CardDescription>Showing {items.length} of 2,847</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search..." className="pl-9 w-full sm:w-[220px] h-9" value={search} onChange={(event) => setSearch(event.target.value)} />
                      </div>
                      <Button variant="outline" size="sm" className="gap-1.5 shrink-0"><Filter className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Filter</span></Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                  <div className="sm:hidden space-y-3">
                    {items.map((property) => {
                      const status = statusStyles[property.status];
                      return (
                        <div key={property.id} data-search-id={`admin-property-${property.id}`} className="p-3 rounded-lg border border-border/40 bg-background space-y-2">
                          <div className="flex items-start gap-2.5">
                            <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0"><Building2 className="h-4 w-4 text-primary" /></div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-foreground leading-tight">{property.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{property.agent}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0"><MoreHorizontal className="h-4 w-4" /></Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-foreground">{property.price}</span>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{property.location}</div>
                            </div>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${status.bg} ${status.color}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />{property.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/60">
                          <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/70 py-3 px-4">Property</th>
                          <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/70 py-3 px-4">Agent</th>
                          <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/70 py-3 px-4">Price</th>
                          <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/70 py-3 px-4">Location</th>
                          <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/70 py-3 px-4">Status</th>
                          <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/70 py-3 px-4">Date</th>
                          <th className="py-3 px-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((property) => {
                          const status = statusStyles[property.status];
                          return (
                            <tr key={property.id} data-search-id={`admin-property-${property.id}`} className="border-b border-border/40">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0"><Building2 className="h-4 w-4 text-primary" /></div>
                                  <span className="font-medium text-sm text-foreground max-w-[180px] truncate">{property.title}</span>
                                </div>
                              </td>
                              <td className="text-sm text-foreground py-3 px-4">{property.agent}</td>
                              <td className="font-semibold text-sm text-foreground py-3 px-4">{property.price}</td>
                              <td className="py-3 px-4"><div className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{property.location}</div></td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.bg} ${status.color}`}>
                                  <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />{property.status}
                                </span>
                              </td>
                              <td className="text-muted-foreground text-sm py-3 px-4">{property.date}</td>
                              <td className="py-3 px-4"><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
