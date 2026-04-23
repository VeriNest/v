import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck, Clock, ArrowUpRight, Search, MapPin, CalendarDays, XCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStatusBadge } from "@/components/dashboard/DashboardStatusBadge";
import { useSearchFocus } from "@/hooks/use-search-focus";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardControlRow } from "@/components/dashboard/DashboardControlRow";
import { seekerApi, titleCase } from "@/lib/api";

export const offers = [] as any[];

const matchColor = (m: number) => (m >= 90 ? "text-emerald-600" : m >= 80 ? "text-blue-600" : "text-amber-600");

function toLocalDateTimeInput(value: Date) {
  const offset = value.getTimezoneOffset();
  const local = new Date(value.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export default function Offers() {
  useSearchFocus();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [visitOfferId, setVisitOfferId] = useState<string | null>(null);
  const [visitDateTime, setVisitDateTime] = useState(() => toLocalDateTimeInput(new Date(Date.now() + 24 * 60 * 60 * 1000)));
  const [visitNotes, setVisitNotes] = useState("");
  const { data = [] } = useQuery({
    queryKey: ["/seeker/offers"],
    queryFn: () => seekerApi.listOffers(),
  });

  const rejectOfferMutation = useMutation({
    mutationFn: (offerId: string) => seekerApi.updateOffer(offerId, { status: "declined" }),
    onSuccess: () => {
      toast.success("Offer rejected");
      queryClient.invalidateQueries({ queryKey: ["/seeker/offers"] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to reject offer";
      toast.error(message);
    },
  });

  const requestVisitMutation = useMutation({
    mutationFn: (payload: { offerId: string; propertyId: string; scheduledFor: string; notes: string }) =>
      seekerApi.createBooking({
        offerId: payload.offerId,
        propertyId: payload.propertyId,
        bookingType: "viewing",
        scheduledFor: new Date(payload.scheduledFor).toISOString(),
        notes: payload.notes.trim() || undefined,
      }),
    onSuccess: () => {
      toast.success("Visit requested");
      setVisitOfferId(null);
      setVisitNotes("");
      queryClient.invalidateQueries({ queryKey: ["/seeker/offers"] });
      queryClient.invalidateQueries({ queryKey: ["/seeker/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/agent/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/agent/calendar"] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to request visit";
      toast.error(message);
    },
  });

  const offers = useMemo(
    () =>
      data.map((offer: any, index: number) => ({
        id: String(offer.id ?? index + 1),
        propertyId: String(offer.propertyId ?? ""),
        providerUserId: String(offer.providerUserId ?? ""),
        property: offer.propertyTitle ?? "Property offer",
        location: offer.propertyLocation ?? "Unknown location",
        provider: offer.providerName ?? titleCase(offer.providerRole),
        role: titleCase(offer.providerRole ?? "agent"),
        price: `${offer.offerPriceCurrency ?? "NGN"} ${Number(offer.offerPriceAmount ?? 0).toLocaleString("en-NG")}/${offer.offerPricePeriod ?? "year"}`,
        trust: "Verified",
        responseTime: offer.sentAt ? new Date(offer.sentAt).toLocaleDateString() : "now",
        match: Number(offer.matchScore ?? 80),
        status: titleCase(String(offer.status ?? "sent")),
        initials: String(offer.providerName ?? offer.provider_name ?? offer.provider_role ?? "PR")
          .split(" ")
          .map((part: string) => part[0])
          .join("")
          .slice(0, 2) || "PR",
        message: String(offer.message ?? ""),
        moveInDate: offer.moveInDate ? new Date(offer.moveInDate).toLocaleDateString() : "Flexible",
        customTerms: offer.customTerms ? String(offer.customTerms) : "",
      })),
    [data],
  );

  const filtered = offers.filter((offer) =>
    [offer.property, offer.provider, offer.role, offer.location, offer.status].some((value) =>
      value.toLowerCase().includes(search.toLowerCase()),
    ),
  );
  const newCount = filtered.filter((offer) => offer.status === "Sent").length;
  const visitCount = filtered.filter((offer) => offer.status === "Shortlisted").length;

  return (
    <div className="space-y-6">
      <DashboardPageHeader title="My Offers" description="Offers matched to your posted needs, with actions to request a viewing or decline." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Offers", value: filtered.length.toString(), accent: "text-foreground" },
          { label: "New", value: newCount.toString(), accent: "text-primary" },
          { label: "Visit Requested", value: visitCount.toString(), accent: "text-emerald-600" },
          { label: "Avg Match", value: `${Math.round(filtered.reduce((a, offer) => a + offer.match, 0) / (filtered.length || 1))}%`, accent: "text-blue-600" },
        ].map((stat) => (
          <Card key={stat.label} className="border border-border/60 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={`mt-0.5 text-xl font-bold ${stat.accent}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <DashboardControlRow
          left={
            <TabsList className="h-auto flex-wrap bg-muted/50 p-1">
              <TabsTrigger value="all" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">All ({filtered.length})</TabsTrigger>
              <TabsTrigger value="new" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">New ({newCount})</TabsTrigger>
              <TabsTrigger value="visits" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Visit Requested ({visitCount})</TabsTrigger>
            </TabsList>
          }
          right={
            <div className="relative min-w-0 flex-1 lg:w-auto lg:flex-none">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search offers..."
                className="h-9 w-full min-w-0 pl-9 lg:w-[220px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          }
        />

        <TabsContent value="all" className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                visitOfferId={visitOfferId}
                setVisitOfferId={setVisitOfferId}
                visitDateTime={visitDateTime}
                setVisitDateTime={setVisitDateTime}
                visitNotes={visitNotes}
                setVisitNotes={setVisitNotes}
                requestVisitMutation={requestVisitMutation}
                rejectOfferMutation={rejectOfferMutation}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="new" className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filtered.filter((offer) => offer.status === "Sent").map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                visitOfferId={visitOfferId}
                setVisitOfferId={setVisitOfferId}
                visitDateTime={visitDateTime}
                setVisitDateTime={setVisitDateTime}
                visitNotes={visitNotes}
                setVisitNotes={setVisitNotes}
                requestVisitMutation={requestVisitMutation}
                rejectOfferMutation={rejectOfferMutation}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="visits" className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filtered.filter((offer) => offer.status === "Shortlisted").map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                visitOfferId={visitOfferId}
                setVisitOfferId={setVisitOfferId}
                visitDateTime={visitDateTime}
                setVisitDateTime={setVisitDateTime}
                visitNotes={visitNotes}
                setVisitNotes={setVisitNotes}
                requestVisitMutation={requestVisitMutation}
                rejectOfferMutation={rejectOfferMutation}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OfferCard({
  offer,
  visitOfferId,
  setVisitOfferId,
  visitDateTime,
  setVisitDateTime,
  visitNotes,
  setVisitNotes,
  requestVisitMutation,
  rejectOfferMutation,
}: {
  offer: typeof offers[0];
  visitOfferId: string | null;
  setVisitOfferId: (value: string | null) => void;
  visitDateTime: string;
  setVisitDateTime: (value: string) => void;
  visitNotes: string;
  setVisitNotes: (value: string) => void;
  requestVisitMutation: { isPending: boolean; mutate: (payload: { offerId: string; propertyId: string; scheduledFor: string; notes: string }) => void };
  rejectOfferMutation: { isPending: boolean; mutate: (offerId: string) => void };
}) {
  const requestOpen = visitOfferId === offer.id;
  const canRequestVisit = !["Declined", "Accepted"].includes(offer.status) && offer.propertyId.length > 0;

  return (
    <Card data-search-id={`seeker-offer-${offer.id}`} className="overflow-hidden border border-border/60 shadow-sm">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 gap-3">
            <Avatar className="h-10 w-10 shrink-0 border border-border/60">
              <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">{offer.initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold text-foreground">{offer.property}</h3>
                {offer.status === "Sent" ? <span className="h-2 w-2 rounded-full bg-primary animate-pulse" /> : null}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                <span className="font-medium">{offer.provider}</span>
                <DashboardStatusBadge tone={offer.role === "Agent" ? "info" : "neutral"}>{offer.role}</DashboardStatusBadge>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{offer.location}</span>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-2 text-right text-xs text-muted-foreground">
            <p className="font-medium text-foreground">{offer.price}</p>
            <p className={`mt-1 inline-flex items-center gap-0.5 font-semibold ${matchColor(offer.match)}`}>
              <ArrowUpRight className="h-3 w-3" /> {offer.match}% match
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Trust</p>
            <p className="mt-1 flex items-center gap-1 text-sm font-medium text-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              {offer.trust}
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Move-in</p>
            <p className="mt-1 flex items-center gap-1 text-sm font-medium text-foreground">
              <Clock className="h-3.5 w-3.5 text-primary" />
              {offer.moveInDate}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-secondary/20 p-3">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Message</p>
          <p className="mt-1 text-sm text-foreground">{offer.message || "No message provided."}</p>
          {offer.customTerms ? (
            <p className="mt-2 text-xs text-muted-foreground">Terms: {offer.customTerms}</p>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-secondary/30 px-3 py-2.5">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{offer.responseTime}</span>
            <span>{offer.status}</span>
          </div>
        </div>

        {requestOpen ? (
          <div className="space-y-3 rounded-xl border border-primary/20 bg-primary/5 p-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Request a site visit</p>
              <p className="text-xs text-muted-foreground">Choose a schedule and the agent will see it in bookings immediately.</p>
            </div>
            <Input type="datetime-local" value={visitDateTime} onChange={(e) => setVisitDateTime(e.target.value)} />
            <Textarea
              rows={3}
              placeholder="Add a note for the agent"
              value={visitNotes}
              onChange={(e) => setVisitNotes(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                className="gap-1.5"
                disabled={!visitDateTime || requestVisitMutation.isPending}
                onClick={() =>
                  requestVisitMutation.mutate({
                    offerId: offer.id,
                    propertyId: offer.propertyId,
                    scheduledFor: visitDateTime,
                    notes: visitNotes,
                  })
                }
              >
                <CalendarDays className="h-3.5 w-3.5" /> Confirm visit
              </Button>
              <Button size="sm" variant="outline" onClick={() => setVisitOfferId(null)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : null}

        <div className="flex gap-2">
          {offer.providerUserId ? (
            <Button size="sm" variant="outline" asChild>
              <Link to={`/seeker/agents/${offer.providerUserId}`}>View agent</Link>
            </Button>
          ) : null}
          <Button
            size="sm"
            className="gap-1.5"
            disabled={!canRequestVisit || requestVisitMutation.isPending}
            onClick={() => setVisitOfferId(offer.id)}
          >
            <CalendarDays className="h-3.5 w-3.5" /> Request visit
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            disabled={["Declined", "Accepted"].includes(offer.status) || rejectOfferMutation.isPending}
            onClick={() => rejectOfferMutation.mutate(offer.id)}
          >
            <XCircle className="h-3.5 w-3.5" /> Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
