import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { Building2, DoorOpen, FileWarning, Filter, Plus, Search, Wallet, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStatusBadge } from "@/components/dashboard/DashboardStatusBadge";
import { useSearchFocus } from "@/hooks/use-search-focus";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardControlRow } from "@/components/dashboard/DashboardControlRow";
import { landlordApi, formatCompactCurrency, titleCase } from "@/lib/api";

export const properties = [] as any[];

export default function LandlordProperties() {
  useSearchFocus();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const { data = [] } = useQuery({ queryKey: ["/landlord/properties"], queryFn: () => landlordApi.listProperties() });
  const properties = useMemo(() => data.map((property: any) => ({
    id: property.id,
    name: property.title ?? "Property",
    location: property.location ?? "Unknown location",
    units: 0,
    occupied: 0,
    collections: formatCompactCurrency(Number(property.price ?? 0)),
    docs: titleCase(String(property.status ?? "pending")),
    status: String(property.status ?? "draft").toLowerCase() === "published" ? "Healthy" : "Attention",
    vacant: 0,
    openIssues: 0,
    yield: "0%",
  })), [data]);

  useEffect(() => {
    setSearch(searchParams.get("q") ?? "");
  }, [searchParams]);

  const filtered = useMemo(
    () => properties.filter((property) => property.name.toLowerCase().includes(search.toLowerCase()) || property.location.toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  const occupied = filtered.filter((property) => property.occupied === property.units);
  const attention = filtered.filter((property) => property.status !== "Healthy");

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Properties"
        description="Portfolio view across owned buildings, occupancy, collections, and document readiness."
        actions={
          <Button size="sm" className="gap-2" asChild>
            <Link to="/landlord/properties/new"><Plus className="h-4 w-4" /> Add Property</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Properties", value: filtered.length.toString(), accent: "text-foreground", icon: Building2, bg: "bg-primary/10" },
          { label: "Units", value: filtered.reduce((sum, property) => sum + property.units, 0).toString(), accent: "text-primary", icon: DoorOpen, bg: "bg-primary/10" },
          { label: "Vacant Units", value: filtered.reduce((sum, property) => sum + property.vacant, 0).toString(), accent: "text-amber-600", icon: FileWarning, bg: "bg-amber-500/10" },
          { label: "Open Issues", value: filtered.reduce((sum, property) => sum + property.openIssues, 0).toString(), accent: "text-destructive", icon: Wrench, bg: "bg-destructive/10" },
        ].map((item) => (
          <Card key={item.label} className="border border-border/60 shadow-sm">
            <CardContent className="p-4 flex items-start gap-3">
              <div className={`p-2 rounded-lg ${item.bg} shrink-0`}><item.icon className={`h-4 w-4 ${item.accent}`} /></div>
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className={`text-lg font-bold ${item.accent}`}>{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <DashboardControlRow
          left={
            <TabsList className="h-auto max-w-full flex-wrap justify-start bg-muted/50 p-1">
              <TabsTrigger value="all" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">All ({filtered.length})</TabsTrigger>
              <TabsTrigger value="stable" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Fully Occupied ({occupied.length})</TabsTrigger>
              <TabsTrigger value="attention" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Needs Attention ({attention.length})</TabsTrigger>
            </TabsList>
          }
          right={
            <>
              <div className="relative min-w-0 flex-1 lg:w-auto lg:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search properties..." className="h-9 w-full min-w-0 pl-9 lg:w-[220px]" value={search} onChange={(event) => setSearch(event.target.value)} />
              </div>
              <Button variant="outline" size="sm" className="h-9 shrink-0 px-3 sm:px-3.5">
                <Filter className="h-3.5 w-3.5" /> <span className="sr-only sm:not-sr-only sm:ml-1.5">Filter</span>
              </Button>
            </>
          }
        />

        {[
          { key: "all", items: filtered },
          { key: "stable", items: occupied },
          { key: "attention", items: attention },
        ].map((group) => (
          <TabsContent key={group.key} value={group.key}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {group.items.map((property) => (
                <Card key={property.id} data-search-id={`landlord-property-${property.id}`} className="border border-border/60 shadow-sm">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-base font-semibold text-foreground">{property.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{property.location}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <DashboardStatusBadge tone={property.status === "Healthy" ? "success" : property.status === "Attention" ? "warning" : "danger"}>
                          {property.status}
                        </DashboardStatusBadge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl bg-muted/40 p-3">
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><DoorOpen className="h-3 w-3" /> Units</p>
                        <p className="mt-1 font-semibold text-foreground">{property.units}</p>
                      </div>
                      <div className="rounded-xl bg-muted/40 p-3">
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><Building2 className="h-3 w-3" /> Occupied</p>
                        <p className="mt-1 font-semibold text-foreground">{property.occupied}</p>
                      </div>
                      <div className="rounded-xl bg-muted/40 p-3">
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><Wallet className="h-3 w-3" /> Collections</p>
                        <p className="mt-1 font-semibold text-foreground">{property.collections}</p>
                      </div>
                      <div className="rounded-xl bg-muted/40 p-3">
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><FileWarning className="h-3 w-3" /> Docs</p>
                        <p className="mt-1 font-semibold text-foreground">{property.docs}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Occupancy</span>
                        <span className="font-medium text-foreground">{property.yield}</span>
                      </div>
                      <div className="h-2 rounded-full bg-border/60 overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: property.yield }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs text-muted-foreground">
                      <span>{property.vacant} vacant</span>
                      <span>{property.openIssues} issues open</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
