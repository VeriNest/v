import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  DoorOpen,
  Filter,
  Grid3x3,
  Home,
  List,
  Plus,
  Search,
  User2,
  Wallet,
} from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { useSearchFocus } from "@/hooks/use-search-focus";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardControlRow } from "@/components/dashboard/DashboardControlRow";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";

export const units = [
  { id: "UNT-101", name: "Palm Residence A1", property: "Palm Residence", tenant: "Bode Akin", rent: "N850,000", state: "Occupied", lease: "Ends Jun 2026", statusNote: "Paid through Apr", type: "2 Bed Flat" },
  { id: "UNT-102", name: "Palm Residence B3", property: "Palm Residence", tenant: "Vacant", rent: "N920,000", state: "Vacant", lease: "Available now", statusNote: "Ready to list", type: "2 Bed Flat" },
  { id: "UNT-211", name: "Admiralty Suites 4C", property: "Admiralty Suites", tenant: "Nova Labs", rent: "N1,450,000", state: "Occupied", lease: "Ends Sep 2026", statusNote: "Corporate tenant", type: "3 Bed Penthouse" },
  { id: "UNT-304", name: "Lekki Court B2", property: "Lekki Court", tenant: "Ruth Samuel", rent: "N620,000", state: "Notice given", lease: "Notice ends Apr 2026", statusNote: "Renewal pending", type: "Mini Flat" },
];

const stateStyles: Record<string, string> = {
  Occupied: "bg-emerald-50 border-emerald-200 text-emerald-700",
  Vacant: "bg-amber-50 border-amber-200 text-amber-700",
  "Notice given": "bg-primary/10 border-primary/20 text-primary",
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
      <DashboardPageHeader
        title="Units"
        description="Track occupancy, tenant assignment, lease state, and unit readiness across your portfolio."
        actions={
          <Button size="sm" className="gap-1.5" asChild>
            <Link to="/landlord/units/new">
              <Plus className="h-3.5 w-3.5" /> Add Unit
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Units", value: filtered.length.toString(), icon: DoorOpen, accent: "text-foreground", bg: "bg-primary/10" },
          { label: "Occupied", value: occupied.length.toString(), icon: Home, accent: "text-emerald-600", bg: "bg-emerald-500/10" },
          { label: "Vacant", value: vacant.length.toString(), icon: User2, accent: "text-amber-600", bg: "bg-amber-500/10" },
          { label: "On Notice", value: notice.length.toString(), icon: Wallet, accent: "text-primary", bg: "bg-primary/10" },
        ].map((item) => (
          <Card key={item.label} className="border border-border/60 shadow-sm">
            <CardContent className="flex items-start gap-3 p-4">
              <div className={`shrink-0 rounded-lg p-2 ${item.bg}`}>
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
        <DashboardControlRow
          left={
            <TabsList className="h-auto max-w-full flex-wrap justify-start bg-muted/50 p-1">
              <TabsTrigger value="all" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
                All ({filtered.length})
              </TabsTrigger>
              <TabsTrigger value="occupied" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Occupied ({occupied.length})
              </TabsTrigger>
              <TabsTrigger value="vacant" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Vacant ({vacant.length})
              </TabsTrigger>
              <TabsTrigger value="notice" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Notice ({notice.length})
              </TabsTrigger>
            </TabsList>
          }
          right={
            <>
              <div className="relative flex-1 lg:flex-none">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search units..."
                  className="h-9 w-full pl-9 lg:w-[220px]"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <div className="hidden items-center gap-1 rounded-lg bg-muted/50 p-1 sm:flex">
                <Button variant={view === "cards" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setView("cards")}>
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button variant={view === "table" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setView("table")}>
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
                <Filter className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Filter</span>
              </Button>
            </>
          }
        />

        {[
          { key: "all", items: filtered },
          { key: "occupied", items: occupied },
          { key: "vacant", items: vacant },
          { key: "notice", items: notice },
        ].map((group) => (
          <TabsContent key={group.key} value={group.key}>
            {resolvedView === "cards" ? (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {group.items.map((unit) => (
                  <Card key={unit.id} data-search-id={`landlord-unit-${unit.id}`} className="border border-border/60 shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/5">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-semibold text-foreground">{unit.name}</h3>
                              <Badge variant="outline" className={`px-2 py-0.5 text-[10px] ${stateStyles[unit.state]}`}>
                                {unit.state}
                              </Badge>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">{unit.property} / {unit.type}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                              <span>{unit.tenant}</span>
                              <span>{unit.lease}</span>
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-base font-bold text-foreground">{unit.rent}</p>
                          <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{unit.id}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col gap-2 border-t border-border/50 pt-3 sm:flex-row sm:items-center sm:justify-between">
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
                <CardContent className="hidden overflow-x-auto p-0 sm:block">
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
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5">
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
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${stateStyles[unit.state]}`}>
                              {unit.state}
                            </span>
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
