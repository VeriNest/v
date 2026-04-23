import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, BedDouble, Building2, CheckCircle2, DoorOpen, FileText, Plus, Wallet } from "lucide-react";

import { DashboardHistoryRow } from "@/components/dashboard/DashboardHistoryRow";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardStatusBadge } from "@/components/dashboard/DashboardStatusBadge";
import { landlordApi, formatCompactCurrency } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";


const unitTypes = ["Mini Flat", "Self Contain", "1 Bed Flat", "2 Bed Flat", "3 Bed Penthouse"];

export default function LandlordNewUnit() {
  const navigate = useNavigate();
  const { data: propertyRows = [] } = useQuery({ queryKey: ["/landlord/properties"], queryFn: () => landlordApi.listProperties() });
  const { data: unitRows = [] } = useQuery({ queryKey: ["/landlord/units"], queryFn: () => landlordApi.listUnits() });
  const properties = useMemo(() => propertyRows.map((item: any) => ({ id: item.id, name: item.title ?? "Property" })), [propertyRows]);
  const units = useMemo(() => unitRows.map((item: any) => ({ id: item.id, name: item.name ?? item.unit_code ?? "Unit", property: item.property_id ?? "Property", tenant: item.tenant_user_id ?? "Vacant", rent: formatCompactCurrency(Number(item.rent_amount ?? 0)), state: item.occupancy_status ?? "vacant", type: item.unit_type ?? item.bedrooms_label ?? "Unit" })), [unitRows]);
  const [property, setProperty] = useState("");
  const [unitName, setUnitName] = useState("");
  const [unitType, setUnitType] = useState("2 Bed Flat");
  const [rent, setRent] = useState("");
  const [status, setStatus] = useState("Vacant");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const propertyUnits = useMemo(() => units.filter((item) => item.property === property), [property, units]);

  if (submitted) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center space-y-5 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-foreground">Unit added successfully</h1>
          <p className="text-sm text-muted-foreground">
            {unitName || "The unit"} has been added under {property}. You can now manage occupancy, lease state, and collection readiness from the units directory.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" asChild>
            <Link to="/landlord/units">Back to Units</Link>
          </Button>
          <Button onClick={() => navigate("/landlord/properties")}>Open Properties</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <DashboardPageHeader
        title="Add Unit"
        description="Register a new rentable unit under your portfolio and prepare it for occupancy or listing."
        badge={<DashboardStatusBadge tone="info">Landlord workflow</DashboardStatusBadge>}
        actions={
          <Button variant="ghost" size="sm" className="gap-1.5 px-0 text-muted-foreground" asChild>
            <Link to="/landlord/units">
              <ArrowLeft className="h-4 w-4" /> Back to Units
            </Link>
          </Button>
        }
      />

      <Tabs defaultValue="new" className="space-y-4">
        <TabsList className="h-auto bg-muted/50 p-1">
          <TabsTrigger value="new" className="gap-1.5 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Plus className="h-3.5 w-3.5" /> New Unit
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <FileText className="h-3.5 w-3.5" /> Unit History
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px] font-semibold">
              {units.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)]">
            <Card className="border border-border/60 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Unit Details</CardTitle>
                <CardDescription>Capture the unit identity, rent plan, and readiness note used across your dashboard.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Property</label>
                    <select
                      value={property}
                      onChange={(event) => setProperty(event.target.value)}
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                    >
                      {properties.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Unit Name / Number</label>
                    <Input placeholder="e.g. Palm Residence C4" value={unitName} onChange={(event) => setUnitName(event.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Unit Type</label>
                    <select
                      value={unitType}
                      onChange={(event) => setUnitType(event.target.value)}
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                    >
                      {unitTypes.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Status</label>
                    <select
                      value={status}
                      onChange={(event) => setStatus(event.target.value)}
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                    >
                      <option>Vacant</option>
                      <option>Occupied</option>
                      <option>Notice given</option>
                      <option>Under maintenance</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-foreground">Rent</label>
                    <Input placeholder="e.g. N850,000" value={rent} onChange={(event) => setRent(event.target.value)} />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-foreground">Readiness Note</label>
                    <Textarea
                      rows={4}
                      placeholder="e.g. Ready to list after repainting, corporate tenant preferred, meter recently replaced..."
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:justify-end">
                  <Button variant="outline" asChild>
                    <Link to="/landlord/units">Cancel</Link>
                  </Button>
                  <Button onClick={async () => { try { await landlordApi.createUnit({ propertyId: property, unitCode: unitName.toUpperCase().replace(/s+/g, "-"), name: unitName, unitType, rentAmount: Number(String(rent).replace(/[^0-9]/g, "")) || 0, occupancyStatus: status.toLowerCase().replace(/s+/g, "_"), listingStatus: "unlisted" }); setSubmitted(true); } catch (error) { const message = error instanceof Error ? error.message : "Unable to create unit"; toast.error(message); } }} disabled={!unitName.trim() || !rent.trim() || !property} className="gap-1.5">
                    <Plus className="h-4 w-4" /> Save Unit
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="border border-border/60 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Property Snapshot</CardTitle>
                  <CardDescription>Context from the selected building so you place the new unit correctly.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-muted/40 p-3">
                    <p className="flex items-center gap-1 text-xs text-muted-foreground"><Building2 className="h-3 w-3" /> Property</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{property}</p>
                  </div>
                  <div className="rounded-xl bg-muted/40 p-3">
                    <p className="flex items-center gap-1 text-xs text-muted-foreground"><DoorOpen className="h-3 w-3" /> Existing units</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{propertyUnits.length}</p>
                  </div>
                  <div className="rounded-xl bg-muted/40 p-3">
                    <p className="flex items-center gap-1 text-xs text-muted-foreground"><Wallet className="h-3 w-3" /> Typical rent</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{propertyUnits[0]?.rent ?? "Set manually"}</p>
                  </div>
                  <div className="rounded-xl bg-muted/40 p-3">
                    <p className="flex items-center gap-1 text-xs text-muted-foreground"><BedDouble className="h-3 w-3" /> Common type</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{propertyUnits[0]?.type ?? unitType}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/60 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Current Units</CardTitle>
                  <CardDescription>Existing units under {property}.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {propertyUnits.map((item) => (
                    <div key={item.id} className="rounded-xl border border-border/60 bg-secondary/20 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{item.name}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{item.type} | {item.tenant}</p>
                        </div>
                        <DashboardStatusBadge tone={item.state === "Occupied" ? "success" : item.state === "Vacant" ? "info" : "warning"}>
                          {item.state}
                        </DashboardStatusBadge>
                      </div>
                    </div>
                  ))}
                  <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 p-3 text-xs text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      Add new units here before pushing them into listing, lease, or collection workflows.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <CardTitle className="text-base">Unit History</CardTitle>
                  <CardDescription>Track units already created across your portfolio.</CardDescription>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="h-8 w-full text-xs sm:w-[120px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="vacant">Vacant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="divide-y divide-border/60">
              {units.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                  <DashboardHistoryRow
                    icon={Building2}
                    title={item.name}
                    subtitle={`${item.property} | ${item.rent} | ${item.tenant}`}
                    badges={
                      <div className="flex flex-wrap items-center gap-2">
                        <DashboardStatusBadge tone="neutral">{item.type}</DashboardStatusBadge>
                        <DashboardStatusBadge tone={item.state === "Occupied" ? "success" : item.state === "Vacant" ? "info" : "warning"}>
                          {item.state}
                        </DashboardStatusBadge>
                      </div>
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
