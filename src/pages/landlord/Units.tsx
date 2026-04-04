import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DoorOpen, Home, Search, User2, Wallet } from "lucide-react";

const units = [
  { name: "Palm Residence A1", tenant: "Bode Akin", rent: "N850,000", state: "Occupied", lease: "Ends Jun 2026", property: "Palm Residence" },
  { name: "Palm Residence B3", tenant: "Vacant", rent: "N920,000", state: "Vacant", lease: "Available now", property: "Palm Residence" },
  { name: "Admiralty Suites 4C", tenant: "Nova Labs", rent: "N1,450,000", state: "Occupied", lease: "Ends Sep 2026", property: "Admiralty Suites" },
  { name: "Lekki Court B2", tenant: "Ruth Samuel", rent: "N620,000", state: "Notice given", lease: "Notice ends Apr 2026", property: "Lekki Court" },
];

export default function LandlordUnits() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => units.filter((unit) => [unit.name, unit.tenant, unit.property].some((value) => value.toLowerCase().includes(search.toLowerCase()))),
    [search],
  );

  const occupied = filtered.filter((unit) => unit.state === "Occupied");
  const vacant = filtered.filter((unit) => unit.state === "Vacant");
  const notice = filtered.filter((unit) => unit.state === "Notice given");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Units</h1>
          <p className="text-sm text-muted-foreground mt-1">Track occupancy state, tenant assignment, and unit-level lease readiness.</p>
        </div>
        <div className="relative w-full sm:w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search units..." className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Units", value: filtered.length.toString(), icon: DoorOpen, accent: "text-foreground", bg: "bg-primary/10" },
          { label: "Occupied", value: occupied.length.toString(), icon: Home, accent: "text-emerald-600", bg: "bg-emerald-500/10" },
          { label: "Vacant", value: vacant.length.toString(), icon: User2, accent: "text-amber-600", bg: "bg-amber-500/10" },
          { label: "On Notice", value: notice.length.toString(), icon: Wallet, accent: "text-primary", bg: "bg-primary/10" },
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
        <TabsList className="bg-muted/50 p-1 h-auto">
          <TabsTrigger value="all" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">All ({filtered.length})</TabsTrigger>
          <TabsTrigger value="occupied" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Occupied ({occupied.length})</TabsTrigger>
          <TabsTrigger value="vacant" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Vacant ({vacant.length})</TabsTrigger>
          <TabsTrigger value="notice" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Notice ({notice.length})</TabsTrigger>
        </TabsList>

        {[
          { key: "all", items: filtered },
          { key: "occupied", items: occupied },
          { key: "vacant", items: vacant },
          { key: "notice", items: notice },
        ].map((group) => (
          <TabsContent key={group.key} value={group.key} className="space-y-3">
            {group.items.map((unit) => (
              <Card key={unit.name} className="border border-border/60 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-foreground">{unit.name}</p>
                      <Badge variant="outline" className={`text-[10px] ${unit.state === "Occupied" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : unit.state === "Vacant" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"}`}>{unit.state}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{unit.property} • {unit.tenant}</p>
                    <p className="text-xs text-muted-foreground mt-1">{unit.lease}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">{unit.rent}</span>
                    <Button variant="outline" size="sm">Open Unit</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
