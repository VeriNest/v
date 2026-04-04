import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, DoorOpen, FileWarning, Plus, Search, Wallet, Wrench, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const properties = [
  { id: "p1", name: "Palm Residence", location: "Lekki Phase 1", units: 6, occupied: 5, collections: "N4.8M", docs: "Complete", status: "Healthy", vacant: 1, openIssues: 1, yield: "92%" },
  { id: "p2", name: "Admiralty Suites", location: "Victoria Island", units: 8, occupied: 7, collections: "N7.2M", docs: "1 expiring", status: "Attention", vacant: 1, openIssues: 3, yield: "95%" },
  { id: "p3", name: "Lekki Court", location: "Ikate", units: 4, occupied: 3, collections: "N3.1M", docs: "Pending upload", status: "At risk", vacant: 1, openIssues: 2, yield: "77%" },
];

export default function LandlordProperties() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => properties.filter((property) => property.name.toLowerCase().includes(search.toLowerCase()) || property.location.toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  const occupied = filtered.filter((property) => property.occupied === property.units);
  const attention = filtered.filter((property) => property.status !== "Healthy");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Properties</h1>
          <p className="text-sm text-muted-foreground mt-1">Portfolio view across owned buildings, occupancy, collections, and document readiness.</p>
        </div>
        <Button size="sm" className="gap-2 self-start" asChild>
          <Link to="/landlord/properties/new"><Plus className="h-4 w-4" /> Add Property</Link>
        </Button>
      </div>

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
        <div className="flex items-center justify-between flex-wrap gap-3">
          <TabsList className="bg-muted/50 p-1 h-auto">
            <TabsTrigger value="all" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">All ({filtered.length})</TabsTrigger>
            <TabsTrigger value="stable" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Fully Occupied ({occupied.length})</TabsTrigger>
            <TabsTrigger value="attention" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Needs Attention ({attention.length})</TabsTrigger>
          </TabsList>
          <div className="relative w-full sm:w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search properties..." className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {[
          { key: "all", items: filtered },
          { key: "stable", items: occupied },
          { key: "attention", items: attention },
        ].map((group) => (
          <TabsContent key={group.key} value={group.key}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {group.items.map((property) => (
                <Card key={property.id} className="border border-border/60 shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-foreground">{property.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{property.location}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-[10px] ${property.status === "Healthy" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : property.status === "Attention" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-destructive/10 text-destructive border-destructive/20"}`}>
                          {property.status}
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
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
