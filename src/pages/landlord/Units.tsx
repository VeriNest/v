import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, DoorOpen, Filter, Grid3x3, Home, List, Plus, Search, User2, Wallet } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSearchFocus } from "@/hooks/use-search-focus";

export const units = [
  { id: "UNT-101", name: "Palm Residence A1", property: "Palm Residence", tenant: "Bode Akin", rent: "N850,000", state: "Occupied", lease: "Ends Jun 2026", statusNote: "Paid through Apr", type: "2 Bed Flat" },
  { id: "UNT-102", name: "Palm Residence B3", property: "Palm Residence", tenant: "Vacant", rent: "N920,000", state: "Vacant", lease: "Available now", statusNote: "Ready to list", type: "2 Bed Flat" },
  { id: "UNT-211", name: "Admiralty Suites 4C", property: "Admiralty Suites", tenant: "Nova Labs", rent: "N1,450,000", state: "Occupied", lease: "Ends Sep 2026", statusNote: "Corporate tenant", type: "3 Bed Penthouse" },
  { id: "UNT-304", name: "Lekki Court B2", property: "Lekki Court", tenant: "Ruth Samuel", rent: "N620,000", state: "Notice given", lease: "Notice ends Apr 2026", statusNote: "Renewal pending", type: "Mini Flat" },
];

const stateStyles: Record<string, { className: string }> = {
  Occupied: { className: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  Vacant: { className: "bg-amber-50 border-amber-200 text-amber-700" },
  "Notice given": { className: "bg-primary/10 border-primary/20 text-primary" },
};

export default function LandlordUnits() {
  useSearchFocus();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"cards" | "table">("cards");
  const resolvedView = isMobile ? "cards" : view;

  const filtered = useMemo(
    () =>
      units.filter((unit) =>
        [unit.name, unit.tenant, unit.property, unit.type].some((value) =>
          value.toLowerCase().includes(search.toLowerCase()),
        ),
      ),
    [search],
  );

  const occupied = filtered.filter((unit) => unit.state === "Occupied");
  const vacant = filtered.filter((unit) => unit.state === "Vacant");
  const notice = filtered.filter((unit) => unit.state === "Notice given");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Units</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track occupancy, tenant assignment, lease state, and unit readiness across your portfolio.</p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Filter className="h-3.5 w-3.5" /> Filter
          </Button>
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Add Unit
          </Button>
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
              <div className={`p-2 rounded-lg ${item.bg} shrink-0`}>
                <item.icon className={`h-4 w-4 ${item.accent}`} />
              </div>
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
          <TabsList className="h-auto max-w-full flex-wrap justify-start bg-muted/50 p-1">
            <TabsTrigger value="all" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">All ({filtered.length})</TabsTrigger>
            <TabsTrigger value="occupied" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Occupied ({occupied.length})</TabsTrigger>
            <TabsTrigger value="vacant" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Vacant ({vacant.length})</TabsTrigger>
            <TabsTrigger value="notice" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Notice ({notice.length})</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search units..." className="pl-9 w-full sm:w-[220px] h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="hidden sm:flex items-center gap-1 bg-muted/50 rounded-lg p-1">
              <Button variant={view === "cards" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setView("cards")}>
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button variant={view === "table" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setView("table")}>
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {[
          { key: "all", items: filtered },
          { key: "occupied", items: occupied },
          { key: "vacant", items: vacant },
          { key: "notice", items: notice },
        ].map((group) => (
          <TabsContent key={group.key} value={group.key}>
            {resolvedView === "cards" ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {group.items.map((unit) => (
                  <Card key={unit.id} data-search-id={`landlord-unit-${unit.id}`} className="border border-border/60 shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex gap-3 min-w-0">
                          <div className="h-11 w-11 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm font-semibold text-foreground">{unit.name}</h3>
                              <Badge variant="outline" className={`text-[11px] px-2 py-0.5 ${stateStyles[unit.state].className}`}>{unit.state}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{unit.property} · {unit.type}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                              <span>{unit.tenant}</span>
                              <span>{unit.lease}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-base font-bold text-foreground">{unit.rent}</p>
                          <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{unit.id}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                        <p className="text-xs text-muted-foreground">{unit.statusNote}</p>
                        <Button variant="outline" size="sm">Open Unit</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border border-border/60 shadow-sm">
                <CardHeader className="pb-3">
                  <div>
                    <CardTitle className="text-base">Unit Directory</CardTitle>
                    <CardDescription>Showing {group.items.length} units</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="hidden p-0 overflow-x-auto sm:block">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Unit</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Property</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Tenant</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Lease</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Rent</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.items.map((unit) => (
                        <TableRow key={unit.id} data-search-id={`landlord-unit-${unit.id}`}>
                          <TableCell>
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                                <DoorOpen className="h-3.5 w-3.5 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">{unit.name}</p>
                                <p className="text-[11px] text-muted-foreground">{unit.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{unit.property}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{unit.tenant}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{unit.lease}</TableCell>
                          <TableCell className="text-sm font-semibold text-foreground">{unit.rent}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${stateStyles[unit.state].className}`}>{unit.state}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
