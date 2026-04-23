import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Search, MoreHorizontal, Building2, MapPin, Plus, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchFocus } from "@/hooks/use-search-focus";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardControlRow } from "@/components/dashboard/DashboardControlRow";
import { adminApi, getPropertyListingType } from "@/lib/api";

const statusStyles: Record<string, { color: string; bg: string; dot: string }> = {
  Published: { color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-500/10 border-emerald-500/20 dark:bg-emerald-500/15 dark:border-emerald-500/30", dot: "bg-emerald-500" },
  PendingVerification: { color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-500/10 border-amber-500/20 dark:bg-amber-500/15 dark:border-amber-500/30", dot: "bg-amber-500" },
  Pending: { color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-500/10 border-amber-500/20 dark:bg-amber-500/15 dark:border-amber-500/30", dot: "bg-amber-500" },
  Rejected: { color: "text-destructive", bg: "bg-destructive/5 border-destructive/20", dot: "bg-destructive" },
  Suspended: { color: "text-destructive", bg: "bg-destructive/5 border-destructive/20", dot: "bg-destructive" },
  Draft: { color: "text-muted-foreground", bg: "bg-muted border-border", dot: "bg-muted-foreground" },
};

function statusLabel(value?: string | null) {
  if (!value) return "Draft";
  return String(value).replace(/[_-]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function priceLabel(property: any) {
  const type = getPropertyListingType(property);
  if (type === "sale") return `NGN ${Number(property.price ?? 0).toLocaleString("en-NG")}`;
  if (type === "shortlet") return `NGN ${Number(property.price ?? 0).toLocaleString("en-NG")}/day`;
  return `NGN ${Number(property.price ?? 0).toLocaleString("en-NG")}/yr`;
}

// Export for dashboard-search.ts
export const properties = [] as any[];

export default function Properties() {
  useSearchFocus();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const { data = [] } = useQuery({ queryKey: ["/admin/properties"], queryFn: () => adminApi.properties() });

  useEffect(() => {
    setSearch(searchParams.get("q") ?? "");
  }, [searchParams]);

  const properties = useMemo(() => data.map((property: any) => ({
    id: property.id,
    title: property.title ?? "Property",
    agent: property.agent_name ?? property.agentName ?? property.owner_name ?? property.ownerName ?? "Unassigned",
    price: priceLabel(property),
    location: property.location ?? "Unknown location",
    status: statusLabel(property.status),
    date: property.created_at || property.createdAt ? new Date(String(property.created_at ?? property.createdAt)).toLocaleDateString() : "",
    type: getPropertyListingType(property) === "sale" ? "Sale" : getPropertyListingType(property) === "shortlet" ? "Short-let" : "Rent",
  })), [data]);

  const filtered = properties.filter((property) =>
    property.title.toLowerCase().includes(search.toLowerCase()) ||
    property.agent.toLowerCase().includes(search.toLowerCase()) ||
    property.location.toLowerCase().includes(search.toLowerCase()),
  );
  const active = filtered.filter((property) => property.status === "Published");
  const pending = filtered.filter((property) => property.status.includes("Pending"));

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Properties"
        description="Manage all property listings across the platform."
        actions={<Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Add Property</Button>}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Listings", value: String(properties.length), sub: "Live total", accent: "text-foreground" },
          { label: "Active", value: String(active.length), sub: "Published", accent: "text-emerald-600" },
          { label: "Pending Review", value: String(pending.length), sub: "Needs action", accent: "text-amber-600" },
          { label: "Rejected / Suspended", value: String(filtered.filter((item) => ["Rejected", "Suspended"].includes(item.status)).length), sub: "Flagged inventory", accent: "text-destructive" },
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
        <DashboardControlRow
          left={
            <TabsList className="bg-muted/50 p-1 h-auto flex-wrap">
              <TabsTrigger value="all" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">All ({filtered.length})</TabsTrigger>
              <TabsTrigger value="active" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Active ({active.length})</TabsTrigger>
              <TabsTrigger value="pending" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Pending ({pending.length})</TabsTrigger>
            </TabsList>
          }
        />

        {["all", "active", "pending"].map((tab) => {
          const items = tab === "active" ? active : tab === "pending" ? pending : filtered;
          return (
            <TabsContent key={tab} value={tab}>
              <Card className="border border-border/60 shadow-sm">
                <CardHeader className="pb-3">
                  <DashboardControlRow
                    left={
                      <div>
                        <CardTitle className="text-base">Properties</CardTitle>
                        <CardDescription>Showing {items.length} properties</CardDescription>
                      </div>
                    }
                    right={
                      <>
                        <div className="relative min-w-0 flex-1 lg:w-auto lg:flex-none">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Search..." className="pl-9 w-full min-w-0 h-9 lg:w-[220px]" value={search} onChange={(event) => setSearch(event.target.value)} />
                        </div>
                        <Button variant="outline" size="sm" className="h-9 shrink-0 px-3 sm:px-3.5"><Filter className="h-3.5 w-3.5" /> <span className="sr-only sm:not-sr-only sm:ml-1.5">Filter</span></Button>
                      </>
                    }
                  />
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                  <div className="sm:hidden space-y-3">
                    {items.map((property) => {
                      const status = statusStyles[property.status] ?? statusStyles.Draft;
                      return (
                        <div key={property.id} data-search-id={`admin-property-${property.id}`} className="p-3 rounded-lg border border-border/40 bg-background space-y-2">
                          <div className="flex items-start gap-2.5">
                            <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0"><Building2 className="h-4 w-4 text-primary" /></div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-foreground leading-tight">{property.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{property.agent} • {property.type}</p>
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
                          <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/70 py-3 px-4">Manager</th>
                          <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/70 py-3 px-4">Type</th>
                          <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/70 py-3 px-4">Price</th>
                          <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/70 py-3 px-4">Location</th>
                          <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/70 py-3 px-4">Status</th>
                          <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/70 py-3 px-4">Date</th>
                          <th className="py-3 px-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((property) => {
                          const status = statusStyles[property.status] ?? statusStyles.Draft;
                          return (
                            <tr key={property.id} data-search-id={`admin-property-${property.id}`} className="border-b border-border/40">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0"><Building2 className="h-4 w-4 text-primary" /></div>
                                  <span className="font-medium text-sm text-foreground max-w-[220px] truncate">{property.title}</span>
                                </div>
                              </td>
                              <td className="text-sm text-foreground py-3 px-4">{property.agent}</td>
                              <td className="text-sm text-muted-foreground py-3 px-4">{property.type}</td>
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
