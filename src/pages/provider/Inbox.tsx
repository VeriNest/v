import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  DollarSign,
  Filter,
  Home,
  MapPin,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Zap,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardControlRow } from "@/components/dashboard/DashboardControlRow";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardSectionCard } from "@/components/dashboard/DashboardSectionCard";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { DashboardStatusBadge } from "@/components/dashboard/DashboardStatusBadge";
import { useSearchFocus } from "@/hooks/use-search-focus";

export const initialLeads = [
  {
    id: 1,
    need: "3 Bed Flat in Lekki Phase 1",
    budget: "N2,500,000/yr",
    location: "Lekki, Lagos",
    type: "Rent",
    moveIn: "April 2024",
    posted: "15 min ago",
    sla: 12,
    features: ["24hr Power", "Security", "Parking"],
    status: "New",
    initials: "AT",
    tenant: "Adaeze T.",
    verified: false,
    description:
      "Looking for a spacious 3-bedroom flat in a quiet, secure estate in Lekki Phase 1. Must have 24hr power supply and parking. Prefer ground floor or first floor. Budget is flexible for the right property.",
    urgency: "High",
  },
  {
    id: 2,
    need: "Studio Apartment in Wuse 2",
    budget: "N1,200,000/yr",
    location: "Wuse 2, Abuja",
    type: "Rent",
    moveIn: "May 2024",
    posted: "1 hr ago",
    sla: 45,
    features: ["Furnished", "Security"],
    status: "New",
    initials: "AM",
    tenant: "Amina T.",
    verified: true,
    description:
      "Need a furnished studio apartment in Wuse 2 for a single professional. Proximity to the business district is important. Must have reliable security.",
    urgency: "Medium",
  },
  {
    id: 3,
    need: "Short-let in Victoria Island, 3 nights",
    budget: "N50,000/night",
    location: "VI, Lagos",
    type: "Short-let",
    moveIn: "Mar 22-25",
    posted: "2 hrs ago",
    sla: 0,
    features: ["Furnished", "Pool", "Gym"],
    status: "Responded",
    initials: "CC",
    tenant: "Chike C.",
    verified: true,
    description:
      "Looking for a premium short-let apartment in VI for a business trip. Must have pool and gym access. Self-contained with modern amenities.",
    urgency: "High",
  },
  {
    id: 4,
    need: "2 Bed in Ikeja GRA",
    budget: "N1,800,000/yr",
    location: "Ikeja, Lagos",
    type: "Rent",
    moveIn: "April 2024",
    posted: "3 hrs ago",
    sla: 0,
    features: ["Gated Estate", "Water"],
    status: "Responded",
    initials: "OB",
    tenant: "Olumide B.",
    verified: false,
    description:
      "Family of 3 looking for a 2-bedroom flat in Ikeja GRA. Must be within a gated estate with constant water supply. Close to schools is a plus.",
    urgency: "Low",
  },
  {
    id: 5,
    need: "4 Bed Duplex in Maitama",
    budget: "N5,000,000/yr",
    location: "Maitama, Abuja",
    type: "Rent",
    moveIn: "June 2024",
    posted: "5 hrs ago",
    sla: 30,
    features: ["Security", "Garden", "BQ"],
    status: "New",
    initials: "FA",
    tenant: "Fatima A.",
    verified: true,
    description:
      "Relocating diplomat family needs a 4-bedroom duplex with BQ in Maitama. Must have a garden and 24hr security. Flexible on budget for the right property.",
    urgency: "High",
  },
];

const getUrgencyTone = (urgency: string) => {
  if (urgency === "High") return "danger";
  if (urgency === "Medium") return "warning";
  return "success";
};

const getTypeTone = (type: string) => (type === "Short-let" ? "warning" : "info");
const getStatusTone = (status: string) => (status === "Responded" ? "success" : "info");

export default function LeadInbox() {
  useSearchFocus();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [leads] = useState(initialLeads);
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const defaultTab = searchParams.get("tab") ?? "new";

  useEffect(() => {
    setSearch(searchParams.get("q") ?? "");
  }, [searchParams]);

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.need.toLowerCase().includes(search.toLowerCase()) ||
        lead.location.toLowerCase().includes(search.toLowerCase()) ||
        lead.type.toLowerCase().includes(search.toLowerCase()) ||
        lead.tenant.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || lead.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [leads, search, typeFilter]);

  const newLeads = filtered.filter((lead) => lead.status === "New");
  const responded = filtered.filter((lead) => lead.status === "Responded");

  const tabs = [
    { value: "new", label: `New (${newLeads.length})`, items: newLeads },
    { value: "responded", label: `Responded (${responded.length})`, items: responded },
    { value: "all", label: `All (${filtered.length})`, items: filtered },
  ];

  const [activeTab, setActiveTab] = useState(defaultTab);

  const activeItems = useMemo(() => {
    const current = tabs.find((tab) => tab.value === activeTab);
    return current?.items ?? filtered;
  }, [activeTab, filtered, tabs]);

  useEffect(() => {
    if (!activeItems.length) {
      setSelectedLeadId(null);
      return;
    }
    if (!selectedLeadId || !activeItems.some((item) => item.id === selectedLeadId)) {
      setSelectedLeadId(activeItems[0].id);
    }
  }, [activeItems, selectedLeadId]);

  const selectedLead = activeItems.find((lead) => lead.id === selectedLeadId) ?? null;
  const avgSla = Math.round(newLeads.reduce((sum, lead) => sum + lead.sla, 0) / Math.max(newLeads.length, 1));

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Lead Inbox"
        description="Triage incoming tenant needs, review fit quickly, and respond from a proper working queue."
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <DashboardStatCard title="Total Leads" value={filtered.length.toString()} icon={Home} subtitle="Current filtered queue" />
        <DashboardStatCard title="New Leads" value={newLeads.length.toString()} icon={Zap} subtitle="Awaiting first response" iconToneClassName="bg-primary/10 text-primary" />
        <DashboardStatCard title="Responded" value={responded.length.toString()} icon={CheckCircle2} subtitle="Already handled" iconToneClassName="bg-emerald-500/10 text-emerald-600" />
        <DashboardStatCard title="Average SLA" value={`${avgSla} min`} icon={Clock} subtitle="New lead response window" iconToneClassName="bg-amber-500/10 text-amber-600" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <DashboardControlRow
          left={
            <TabsList className="h-auto max-w-full flex-wrap justify-start bg-muted/50 p-1">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          }
          right={
            <>
              <div className="relative flex-1 lg:flex-none">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search lead, tenant or area..."
                  className="h-9 w-full pl-9 lg:w-[220px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-9 w-[132px] shrink-0">
                  <SlidersHorizontal className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="Rent">Rent</SelectItem>
                  <SelectItem value="Short-let">Short-let</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="hidden gap-1.5 lg:inline-flex">
                <Filter className="h-3.5 w-3.5" /> Filter
              </Button>
            </>
          }
        />

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {!tab.items.length ? (
              <DashboardEmptyState
                title="No leads match this view"
                description="Try another tab, clear your search, or switch the property type filter."
                icon={Search}
              />
            ) : (
              <>
                <div className="hidden gap-6 xl:grid xl:grid-cols-[minmax(320px,0.95fr)_minmax(0,1.35fr)]">
                  <DashboardSectionCard
                    title="Queue"
                    description="Select a lead to inspect details and respond."
                    contentClassName="space-y-2"
                  >
                    {tab.items.map((lead) => {
                      const isSelected = selectedLeadId === lead.id;
                      return (
                        <button
                          key={lead.id}
                          type="button"
                          data-search-id={`provider-inbox-${lead.id}`}
                          onClick={() => setSelectedLeadId(lead.id)}
                          className={`w-full rounded-xl border p-3 text-left ${
                            isSelected ? "border-primary bg-primary/[0.04]" : "border-border/60 bg-background/60"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10 shrink-0 border border-border/60">
                              <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">{lead.initials}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1 space-y-2">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-foreground">{lead.need}</p>
                                  <p className="mt-1 truncate text-xs text-muted-foreground">{lead.tenant} | {lead.location}</p>
                                </div>
                                <DashboardStatusBadge tone={getStatusTone(lead.status)}>{lead.status}</DashboardStatusBadge>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <DashboardStatusBadge tone={getTypeTone(lead.type)}>{lead.type}</DashboardStatusBadge>
                                <DashboardStatusBadge tone={getUrgencyTone(lead.urgency)}>{lead.urgency}</DashboardStatusBadge>
                                <span className="text-xs text-muted-foreground">{lead.posted}</span>
                              </div>
                              <div className="flex items-center justify-between gap-3 text-xs">
                                <span className="font-medium text-foreground">{lead.budget}</span>
                                <span className={lead.sla > 0 ? "text-amber-600" : "text-emerald-600"}>
                                  {lead.sla > 0 ? `${lead.sla} min left` : "Handled"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </DashboardSectionCard>

                  <DashboardSectionCard
                    title={selectedLead ? selectedLead.need : "Lead preview"}
                    description={selectedLead ? `Review ${selectedLead.tenant}'s need before sending an offer.` : "Select a lead from the queue."}
                    action={
                      selectedLead ? (
                        <div className="flex items-center gap-2">
                          {selectedLead.status === "New" ? (
                            <Button
                              size="sm"
                              className="gap-1.5"
                              onClick={() =>
                                navigate(`/provider/inbox/${selectedLead.id}/offer?need=${encodeURIComponent(selectedLead.need)}&leadId=${selectedLead.id}`)
                              }
                            >
                              <Send className="h-3.5 w-3.5" /> Send Offer
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" className="gap-1.5 border-emerald-200 text-emerald-600">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Offer Sent
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => navigate(`/provider/inbox/${selectedLead.id}`)}>
                            Open detail
                          </Button>
                        </div>
                      ) : null
                    }
                    contentClassName="space-y-5"
                  >
                    {selectedLead ? (
                      <>
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                          {[
                            { label: "Budget", value: selectedLead.budget, icon: DollarSign },
                            { label: "Move-in", value: selectedLead.moveIn, icon: CalendarDays },
                            { label: "Posted", value: selectedLead.posted, icon: Clock },
                            { label: "Area", value: selectedLead.location, icon: MapPin },
                          ].map((item) => (
                            <div key={item.label} className="rounded-xl border border-border/60 bg-muted/20 p-3">
                              <p className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                                <item.icon className="h-3.5 w-3.5" /> {item.label}
                              </p>
                              <p className="mt-1 text-sm font-medium text-foreground">{item.value}</p>
                            </div>
                          ))}
                        </div>

                        <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-foreground">Tenant Profile</p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {selectedLead.verified ? "Verified renter profile" : "Unverified renter profile"}
                              </p>
                            </div>
                            <DashboardStatusBadge tone={selectedLead.verified ? "success" : "warning"}>
                              {selectedLead.verified ? "Verified" : "Unverified"}
                            </DashboardStatusBadge>
                          </div>
                          <div className="mt-4 flex items-center gap-3">
                            <Avatar className="h-10 w-10 border border-border/60">
                              <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">{selectedLead.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-foreground">{selectedLead.tenant}</p>
                              <p className="text-xs text-muted-foreground">Need urgency: {selectedLead.urgency}</p>
                            </div>
                            <div className="ml-auto text-muted-foreground">
                              {selectedLead.verified ? <ShieldCheck className="h-4 w-4 text-emerald-600" /> : <ShieldAlert className="h-4 w-4 text-amber-600" />}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-foreground">Need Summary</p>
                          <p className="text-sm leading-6 text-muted-foreground">{selectedLead.description}</p>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-foreground">Required Features</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedLead.features.map((feature) => (
                              <span key={feature} className="rounded-full border border-border/60 bg-muted/20 px-2.5 py-1 text-[11px] text-muted-foreground">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>

                        {selectedLead.status === "New" ? (
                          <div className="rounded-xl border border-amber-200 bg-amber-50/50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
                            {selectedLead.sla} minutes left to respond for priority boost.
                          </div>
                        ) : (
                          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
                            This lead has already received a response from your team.
                          </div>
                        )}
                      </>
                    ) : (
                      <DashboardEmptyState
                        title="Nothing selected"
                        description="Choose a lead from the queue to view the full need summary and respond."
                      />
                    )}
                  </DashboardSectionCard>
                </div>

                <div className="grid gap-3 xl:hidden">
                  {tab.items.map((lead) => (
                    <DashboardSectionCard
                      key={lead.id}
                      title={lead.need}
                      description={`${lead.tenant} | ${lead.location}`}
                      action={<DashboardStatusBadge tone={getStatusTone(lead.status)}>{lead.status}</DashboardStatusBadge>}
                      contentClassName="space-y-4"
                      className="border-border/60"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Budget</p>
                          <p className="mt-1 text-sm font-medium text-foreground">{lead.budget}</p>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Move-in</p>
                          <p className="mt-1 text-sm font-medium text-foreground">{lead.moveIn}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <DashboardStatusBadge tone={getTypeTone(lead.type)}>{lead.type}</DashboardStatusBadge>
                        <DashboardStatusBadge tone={getUrgencyTone(lead.urgency)}>{lead.urgency}</DashboardStatusBadge>
                        <span className="text-xs text-muted-foreground">{lead.posted}</span>
                      </div>
                      <p className="text-sm leading-6 text-muted-foreground">{lead.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {lead.features.map((feature) => (
                          <span key={feature} className="rounded-full border border-border/60 bg-muted/20 px-2.5 py-1 text-[11px] text-muted-foreground">
                            {feature}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {lead.status === "New" ? (
                          <Button
                            size="sm"
                            className="gap-1.5"
                            onClick={() => navigate(`/provider/inbox/${lead.id}/offer?need=${encodeURIComponent(lead.need)}&leadId=${lead.id}`)}
                          >
                            <Send className="h-3.5 w-3.5" /> Send Offer
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" className="gap-1.5 border-emerald-200 text-emerald-600">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Offer Sent
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => navigate(`/provider/inbox/${lead.id}`)}>
                          View Details
                        </Button>
                      </div>
                    </DashboardSectionCard>
                  ))}
                </div>
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
