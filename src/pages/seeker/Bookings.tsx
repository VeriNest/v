import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  Search,
  ShieldCheck,
  Wallet,
  Phone,
  Mail,
  X,
} from "lucide-react";

import { DashboardControlRow } from "@/components/dashboard/DashboardControlRow";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { SeekerPageSearch } from "@/components/seeker/SeekerPageSearch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useSearchFocus } from "@/hooks/use-search-focus";
import { formatCompactCurrency, reportsApi, seekerApi } from "@/lib/api";
import { toast } from "sonner";
import { InlineSpinner } from "@/components/Loaders";

function titleForStatus(value?: string) {
  if (!value) return "Pending";
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function titleForBookingType(value?: string) {
  if (!value) return "Booking";
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function isBookingPassed(scheduledDate: Date | null): boolean {
  if (!scheduledDate) return false;
  const now = new Date();
  return scheduledDate < now;
}

function isBookingOneHourPast(scheduledDate: Date | null): boolean {
  if (!scheduledDate) return false;
  return Date.now() >= scheduledDate.getTime() + 60 * 60 * 1000;
}

const bookingStatusStyles: Record<string, string> = {
  Confirmed: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
  Pending: "bg-primary/10 text-primary border-primary/20",
  "Awaiting viewing": "bg-primary/10 text-primary border-primary/20",
  "Pending balance": "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
};

function StatusTabs({
  counts,
  value,
  onValueChange,
}: {
  counts: { all: number; active: number; pending: number };
  value: "all" | "active" | "pending";
  onValueChange: (value: "all" | "active" | "pending") => void;
}) {
  return (
    <TabsList className="h-auto max-w-full flex-wrap justify-start bg-muted/50 p-1">
      <TabsTrigger value="all" onClick={() => onValueChange("all")} className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
        All ({counts.all})
      </TabsTrigger>
      <TabsTrigger value="active" onClick={() => onValueChange("active")} className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
        Active ({counts.active})
      </TabsTrigger>
      <TabsTrigger value="pending" onClick={() => onValueChange("pending")} className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
        Pending ({counts.pending})
      </TabsTrigger>
    </TabsList>
  );
}

export default function SeekerBookings() {
  useSearchFocus();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [bookingFilter, setBookingFilter] = useState<"all" | "active" | "pending">("all");
  const [selectedAgentBookingId, setSelectedAgentBookingId] = useState<string | null>(null);
  const [reportingBookingId, setReportingBookingId] = useState<string | null>(null);
  const [reportType, setReportType] = useState<"no-show" | "issue" | null>(null);
  const [reportNotes, setReportNotes] = useState("");
  const [outcomeBookingId, setOutcomeBookingId] = useState<string | null>(null);
  const [outcomeValue, setOutcomeValue] = useState<"completed" | "not_completed">("completed");
  const [outcomeNote, setOutcomeNote] = useState("");
  const [disputeBookingId, setDisputeBookingId] = useState<string | null>(null);
  const [disputeType, setDisputeType] = useState<"quality" | "fraud" | "cancellation" | "payment" | "listing_misrepresentation">("quality");
  const [disputeTitle, setDisputeTitle] = useState("");
  const [disputeDescription, setDisputeDescription] = useState("");
  
  const { data = [] } = useQuery({
    queryKey: ["/seeker/bookings"],
    queryFn: () => seekerApi.listBookings(),
  });

  const confirmBookingMutation = useMutation({
    mutationFn: (bookingId: string) => seekerApi.updateOffer(bookingId, { status: "confirmed" }),
    onSuccess: () => {
      toast.success("Booking confirmed successfully");
      queryClient.invalidateQueries({ queryKey: ["/seeker/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/seeker/offers"] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to confirm booking";
      toast.error(message);
    },
  });

  const reportNoShowMutation = useMutation({
    mutationFn: (bookingId: string) => seekerApi.updateBooking(bookingId, { status: "no_show", notes: `No show report: ${reportNotes}` }),
    onSuccess: () => {
      toast.success("No show reported. Booking moved to history.");
      setReportingBookingId(null);
      setReportType(null);
      setReportNotes("");
      queryClient.invalidateQueries({ queryKey: ["/seeker/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/seeker/offers"] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to report no show";
      toast.error(message);
    },
  });

  const reportPropertyIssueMutation = useMutation({
    mutationFn: (data: { propertyId?: string; providerUserId?: string }) =>
      reportsApi.create({
        propertyId: data.propertyId,
        reportedUserId: data.providerUserId,
        violationType: "quality",
        reason: "Property issue reported after booking",
        details: reportNotes,
      }),
    onSuccess: () => {
      toast.success("Property issue reported. Our team will review it.");
      setReportingBookingId(null);
      setReportType(null);
      setReportNotes("");
      queryClient.invalidateQueries({ queryKey: ["/seeker/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/admin/reports"] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to report property issue";
      toast.error(message);
    },
  });

  const rescheduleBookingMutation = useMutation({
    mutationFn: (bookingId: string) => seekerApi.updateBooking(bookingId, { notes: `Reschedule request: ${reportNotes || "Please reschedule this booking."}` }),
    onSuccess: () => {
      toast.success("Reschedule request sent. The host will contact you.");
      setReportNotes("");
      setReportingBookingId(null);
      queryClient.invalidateQueries({ queryKey: ["/seeker/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/seeker/offers"] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to request reschedule";
      toast.error(message);
    },
  });
  const confirmOutcomeMutation = useMutation({
    mutationFn: (payload: { id: string; outcome: "completed" | "not_completed"; note?: string }) =>
      seekerApi.confirmBookingOutcome(payload.id, { outcome: payload.outcome, note: payload.note }),
    onSuccess: () => {
      toast.success("Outcome confirmed. The provider will be prompted to confirm too.");
      setOutcomeBookingId(null);
      setOutcomeNote("");
      queryClient.invalidateQueries({ queryKey: ["/seeker/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/agent/bookings"] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to confirm outcome";
      toast.error(message);
    },
  });
  const createDisputeMutation = useMutation({
    mutationFn: (payload: { id: string; disputeType: string; title: string; description: string }) =>
      seekerApi.createBookingDispute(payload.id, {
        disputeType: payload.disputeType,
        title: payload.title,
        description: payload.description,
      }),
    onSuccess: () => {
      toast.success("Dispute submitted. Admin will be able to review it.");
      setDisputeBookingId(null);
      setDisputeTitle("");
      setDisputeDescription("");
      queryClient.invalidateQueries({ queryKey: ["/seeker/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/admin/disputes"] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to raise dispute";
      toast.error(message);
    },
  });
  const bookings = useMemo(() => data.map((item: any, index: number) => ({
    id: item.id ?? `BK-${index + 1}`,
    propertyId: item.propertyId ?? item.property_id,
    providerUserId: item.providerUserId ?? item.provider_user_id,
    property: item.propertyTitle ?? "Property booking",
    location: item.propertyLocation ?? "Unknown location",
    host: item.providerName ?? "Provider",
    hostPhone: item.providerPhone ?? "",
    hostAvatarUrl: item.providerAvatarUrl ?? null,
    amount: formatCompactCurrency(Number(item.amount ?? 0)),
    paymentStatus: titleForStatus(item.status),
    status: titleForStatus(item.status),
    dateLabel: item.scheduledFor ? new Date(item.scheduledFor).toLocaleString() : "Schedule pending",
    scheduledDate: item.scheduledFor ? new Date(item.scheduledFor) : null,
    detail: titleForBookingType(item.bookingType),
    initials: String(item.providerName ?? "PR").split(" ").map((part: string) => part[0]).join("").slice(0, 2) || "PR",
    listingType: String(item.propertyListingType ?? item.property_listing_type ?? "rent"),
    seekerOutcome: item.seekerOutcome ?? item.seeker_outcome ?? null,
    providerOutcome: item.providerOutcome ?? item.provider_outcome ?? null,
    outcomeResolution: item.outcomeResolution ?? item.outcome_resolution ?? null,
    outcomeFollowUpRequired: Boolean(item.outcomeFollowUpRequired ?? item.outcome_follow_up_required ?? false),
    listingOutcomeApplied: Boolean(item.listingOutcomeApplied ?? item.listing_outcome_applied ?? false),
  })), [data]);
  const viewings = bookings.filter((item) => item.detail.toLowerCase().includes("viewing") || item.status.toLowerCase().includes("awaiting") || item.status.toLowerCase().includes("confirmed"));

  const normalizedQuery = search.trim().toLowerCase();

  const visibleBookings = useMemo(() => {
    const matches = bookings.filter((item) =>
      [item.property, item.location, item.host, item.amount, item.status, item.paymentStatus, item.detail].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    );

    if (bookingFilter === "active") {
      return matches.filter((item) => item.status === "Confirmed" || item.status === "Awaiting viewing" || item.status === "Pending");
    }
    if (bookingFilter === "pending") {
      return matches.filter((item) => item.status === "Pending balance" || item.status === "Pending");
    }
    return matches;
  }, [normalizedQuery, bookingFilter]);

  const bookingCounts = {
    all: bookings.length,
    active: bookings.filter((item) => item.status === "Confirmed" || item.status === "Awaiting viewing" || item.status === "Pending").length,
    pending: bookings.filter((item) => item.status === "Pending balance" || item.status === "Pending").length,
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Bookings"
        description="Keep your secured stays, payment checkpoints, and next steps in one place."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Bookings", value: bookings.length, icon: Wallet, note: "secured reservations" },
          { label: "Scheduled visits", value: viewings.length, icon: CalendarDays, note: "track in Viewing Schedule" },
          { label: "Awaiting action", value: bookingCounts.pending, icon: Clock3, note: "needs follow-up" },
          { label: "Escrow tracked", value: "N3.8M", icon: ShieldCheck, note: "active hold value" },
        ].map((item) => (
          <Card key={item.label} className="border border-border/60 shadow-sm">
            <CardContent className="flex items-start gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/8">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-lg font-bold text-foreground">{item.value}</p>
                <p className="text-[11px] text-muted-foreground">{item.note}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={bookingFilter} className="space-y-4">
        <DashboardControlRow
          left={<StatusTabs counts={bookingCounts} value={bookingFilter} onValueChange={setBookingFilter} />}
          right={
            <>
              <div className="relative min-w-0 flex-1 lg:w-auto lg:flex-none">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <SeekerPageSearch value={search} onChange={setSearch} placeholder="Search bookings..." />
              </div>
              <Button variant="outline" size="sm" className="h-9 shrink-0 px-3 sm:px-3.5" asChild>
                <Link to="/seeker/viewings">Viewing Schedule</Link>
              </Button>
            </>
          }
        />
      </Tabs>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleBookings.map((item) => (
          <Card key={item.id} data-search-id={`seeker-booking-${item.id}`} className="border border-border/60 bg-card shadow-sm">
            <CardContent className="space-y-4 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-foreground">{item.property}</p>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>
                <Badge variant="outline" className={`shrink-0 px-2 py-0.5 text-[10px] ${bookingStatusStyles[item.status]}`}>
                  {item.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-sm">
                <div className="rounded-xl bg-secondary/20 p-3">
                  <p className="text-[11px] text-muted-foreground">Host</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Avatar className="h-8 w-8 border border-border/60">
                      {item.hostAvatarUrl ? (
                        <img src={item.hostAvatarUrl} alt={item.host} className="h-full w-full rounded-full object-cover" />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-[10px] font-medium text-primary">{item.initials}</AvatarFallback>
                      )}
                    </Avatar>
                    <p className="truncate font-medium text-foreground">{item.host}</p>
                  </div>
                </div>
                <div className="rounded-xl bg-secondary/20 p-3">
                  <p className="text-[11px] text-muted-foreground">Amount</p>
                  <p className="mt-1 font-medium text-foreground">{item.amount}</p>
                </div>
                <div className="rounded-xl bg-secondary/20 p-3">
                  <p className="text-[11px] text-muted-foreground">Payment</p>
                  <p className="mt-1 truncate font-medium text-foreground">{item.paymentStatus}</p>
                </div>
                <div className="rounded-xl bg-secondary/20 p-3">
                  <p className="text-[11px] text-muted-foreground">Next step</p>
                  <p className="mt-1 truncate font-medium text-foreground">{item.dateLabel}</p>
                </div>
              </div>

              {item.status === "Confirmed" && item.hostPhone ? (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2.5 text-sm">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Agent phone</p>
                  <p className="mt-1 font-medium text-foreground">{item.hostPhone}</p>
                </div>
              ) : null}

              <div className="rounded-xl border border-border/50 bg-secondary/15 px-3 py-2.5 text-xs text-muted-foreground">
                {item.detail}
              </div>

              {item.outcomeResolution ? (
                <div className={`rounded-xl border px-3 py-2.5 text-xs ${
                  item.outcomeResolution === "conflict"
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-700"
                    : "border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
                }`}>
                  {item.outcomeResolution === "conflict"
                    ? "Outcome conflict flagged for follow-up."
                    : item.listingOutcomeApplied
                      ? "Both sides confirmed. Listing availability has been updated."
                      : "Both sides confirmed the visit outcome."}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 border-t border-border/50 pt-3">
                {item.status === "Confirmed" && !isBookingOneHourPast(item.scheduledDate) && isBookingPassed(item.scheduledDate) ? (
                  <div className="text-xs text-muted-foreground">
                    Outcome and dispute actions appear one hour after the scheduled visit time.
                  </div>
                ) : null}

                {item.status === "Confirmed" && isBookingOneHourPast(item.scheduledDate) ? (
                  <div className="flex flex-wrap gap-2">
                    {!item.seekerOutcome ? (
                      <Button
                        size="sm"
                        className="h-8 rounded-lg px-3 text-xs"
                        onClick={() => {
                          setOutcomeBookingId(item.id);
                          setOutcomeValue("completed");
                          setOutcomeNote("");
                        }}
                      >
                        Confirm Outcome
                      </Button>
                    ) : null}
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-lg px-3 text-xs"
                      onClick={() => {
                        setDisputeBookingId(item.id);
                        setDisputeType("quality");
                        setDisputeTitle(`Dispute for ${item.property}`);
                        setDisputeDescription("");
                      }}
                    >
                      Raise Dispute
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 rounded-lg px-3 text-xs"
                      onClick={() => {
                        setReportingBookingId(item.id);
                        setReportType("no-show");
                      }}
                    >
                      Report No Show
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 rounded-lg px-3 text-xs"
                      onClick={() => {
                        setReportingBookingId(item.id);
                        setReportType("issue");
                      }}
                    >
                      Report Property Issue
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 rounded-lg px-3 text-xs"
                      onClick={() => {
                        setReportingBookingId(item.id);
                        setReportType(null);
                        setReportNotes("");
                      }}
                    >
                      Reschedule
                    </Button>
                  </div>
                ) : null}

                {!isBookingPassed(item.scheduledDate) ? (
                  <>
                    {item.status !== "Confirmed" ? (
                      <Button 
                        size="sm" 
                        className="h-8 rounded-lg px-3 text-xs"
                        onClick={() => confirmBookingMutation.mutate(item.id)}
                        disabled={confirmBookingMutation.isPending}
                      >
                        {confirmBookingMutation.isPending ? <InlineSpinner variant="solid" /> : "Confirm visit"}
                      </Button>
                    ) : null}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 rounded-lg px-3 text-xs"
                      onClick={() => setSelectedAgentBookingId(item.id)}
                    >
                      Contact host
                    </Button>
                  </>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report/Reschedule Modal */}
      {outcomeBookingId && (() => {
        const booking = bookings.find((b) => b.id === outcomeBookingId);
        return (
          <Dialog open={!!outcomeBookingId} onOpenChange={(open) => !open && setOutcomeBookingId(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Confirm Booking Outcome</DialogTitle>
                <DialogDescription>
                  Tell us whether this visit ended with a successful property take-up. The provider will be asked to confirm too.
                </DialogDescription>
              </DialogHeader>
              {booking ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-border/50 bg-secondary/15 p-3">
                    <p className="text-xs text-muted-foreground">Booking</p>
                    <p className="mt-1 font-medium">{booking.property}</p>
                    <p className="text-xs text-muted-foreground">{booking.dateLabel}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant={outcomeValue === "completed" ? "default" : "outline"} onClick={() => setOutcomeValue("completed")}>
                      Yes, it worked out
                    </Button>
                    <Button variant={outcomeValue === "not_completed" ? "default" : "outline"} onClick={() => setOutcomeValue("not_completed")}>
                      No, not taken
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Note (optional)</label>
                    <Textarea
                      value={outcomeNote}
                      onChange={(e) => setOutcomeNote(e.target.value)}
                      className="min-h-24"
                      placeholder="Add any useful context for support or the provider."
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setOutcomeBookingId(null)}>
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      disabled={confirmOutcomeMutation.isPending}
                      onClick={() => confirmOutcomeMutation.mutate({ id: outcomeBookingId, outcome: outcomeValue, note: outcomeNote.trim() || undefined })}
                    >
                      {confirmOutcomeMutation.isPending ? <InlineSpinner variant="solid" /> : "Submit Outcome"}
                    </Button>
                  </div>
                </div>
              ) : null}
            </DialogContent>
          </Dialog>
        );
      })()}

      {disputeBookingId && (() => {
        const booking = bookings.find((b) => b.id === disputeBookingId);
        return (
          <Dialog open={!!disputeBookingId} onOpenChange={(open) => !open && setDisputeBookingId(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Raise Dispute</DialogTitle>
                <DialogDescription>
                  Open a dispute against the other party for this confirmed visit. Admin will review the case.
                </DialogDescription>
              </DialogHeader>
              {booking ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-border/50 bg-secondary/15 p-3">
                    <p className="text-xs text-muted-foreground">Booking</p>
                    <p className="mt-1 font-medium">{booking.property}</p>
                    <p className="text-xs text-muted-foreground">{booking.host} · {booking.dateLabel}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ["quality", "Quality"],
                      ["fraud", "Fraud"],
                      ["cancellation", "Cancellation"],
                      ["payment", "Payment"],
                      ["listing_misrepresentation", "Misrepresentation"],
                    ].map(([value, label]) => (
                      <Button key={value} variant={disputeType === value ? "default" : "outline"} onClick={() => setDisputeType(value as typeof disputeType)}>
                        {label}
                      </Button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Textarea value={disputeTitle} onChange={(e) => setDisputeTitle(e.target.value)} className="min-h-16" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea value={disputeDescription} onChange={(e) => setDisputeDescription(e.target.value)} className="min-h-28" placeholder="Explain what happened during or after the confirmed visit." />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setDisputeBookingId(null)}>
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      disabled={createDisputeMutation.isPending || !disputeTitle.trim() || !disputeDescription.trim()}
                      onClick={() =>
                        createDisputeMutation.mutate({
                          id: disputeBookingId,
                          disputeType,
                          title: disputeTitle.trim(),
                          description: disputeDescription.trim(),
                        })
                      }
                    >
                      {createDisputeMutation.isPending ? <InlineSpinner variant="solid" /> : "Submit Dispute"}
                    </Button>
                  </div>
                </div>
              ) : null}
            </DialogContent>
          </Dialog>
        );
      })()}

      {/* Report/Reschedule Modal */}
      {reportingBookingId && (() => {
        const booking = bookings.find((b) => b.id === reportingBookingId);
        const isNoShow = reportType === "no-show";
        const isPropertyIssue = reportType === "issue";
        const isReschedule = reportType === null;
        const isSubmitting = isNoShow ? reportNoShowMutation.isPending : isPropertyIssue ? reportPropertyIssueMutation.isPending : rescheduleBookingMutation.isPending;
        
        return (
          <Dialog open={!!reportingBookingId} onOpenChange={(open) => !open && setReportingBookingId(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {isNoShow ? "Report No Show" : isPropertyIssue ? "Report Property Issue" : "Reschedule Booking"}
                </DialogTitle>
                <DialogDescription>
                  {isNoShow 
                    ? "Let us know that the host did not show up for this booking"
                    : isPropertyIssue
                    ? "Describe any issues you experienced with the property"
                    : "Request to reschedule this booking"}
                </DialogDescription>
              </DialogHeader>
              
              {booking && (
                <div className="space-y-4">
                  {/* Booking Info */}
                  <div className="rounded-lg border border-border/50 bg-secondary/15 p-3">
                    <p className="text-xs text-muted-foreground">Booking</p>
                    <p className="mt-1 font-medium">{booking.property}</p>
                    <p className="text-xs text-muted-foreground">{booking.dateLabel}</p>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {isNoShow ? "What Happened" : isPropertyIssue ? "Issue Details" : "Reschedule Reason"}
                    </label>
                    <Textarea 
                      placeholder={isNoShow ? "Describe what happened..." : isPropertyIssue ? "Describe the issue..." : "Why do you need to reschedule? (optional)"}
                      value={reportNotes}
                      onChange={(e) => setReportNotes(e.target.value)}
                      className="min-h-24"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setReportingBookingId(null);
                        setReportType(null);
                        setReportNotes("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={() => {
                        if (isNoShow) {
                          reportNoShowMutation.mutate(reportingBookingId);
                        } else if (isPropertyIssue) {
                          const booking = bookings.find((b) => b.id === reportingBookingId);
                          reportPropertyIssueMutation.mutate({ 
                            propertyId: booking?.propertyId,
                            providerUserId: booking?.providerUserId,
                          });
                        } else {
                          rescheduleBookingMutation.mutate(reportingBookingId);
                        }
                      }}
                      disabled={isSubmitting || (isNoShow || isPropertyIssue ? !reportNotes.trim() : false)}
                    >
                      {isSubmitting ? <InlineSpinner variant="solid" /> : isReschedule ? "Send Reschedule Request" : "Submit Report"}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        );
      })()}

      {/* Agent Details Modal */}
      {selectedAgentBookingId && (() => {
        const booking = bookings.find((b) => b.id === selectedAgentBookingId);
        return (
          <Dialog open={!!selectedAgentBookingId} onOpenChange={(open) => !open && setSelectedAgentBookingId(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Host Details</DialogTitle>
                <DialogDescription>Get in touch with your host</DialogDescription>
              </DialogHeader>
              
              {booking && (
                <div className="space-y-6">
                  {/* Host Info */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      {booking.hostAvatarUrl ? (
                        <img src={booking.hostAvatarUrl} alt={booking.host} className="h-full w-full object-cover" />
                      ) : (
                        <AvatarFallback>{booking.initials}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{booking.host}</h3>
                      <p className="text-sm text-muted-foreground">{booking.property}</p>
                    </div>
                  </div>

                  {/* Contact Options */}
                  <div className="space-y-3 border-t border-border/50 pt-4">
                    {booking.hostPhone && (
                      <a
                        href={`tel:${booking.hostPhone}`}
                        className="flex items-center gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-accent"
                      >
                        <Phone className="h-4 w-4 text-primary" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">Call</p>
                          <p className="text-sm font-medium">{booking.hostPhone}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </a>
                    )}
                    
                    <button
                      onClick={() => {
                        setSelectedAgentBookingId(null);
                        toast.info("Message feature coming soon");
                      }}
                      className="flex items-center gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-accent w-full"
                    >
                      <Mail className="h-4 w-4 text-primary" />
                      <div className="flex-1 text-left">
                        <p className="text-xs text-muted-foreground">Send Message</p>
                        <p className="text-sm font-medium">Message your host</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-2 border-t border-border/50 pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Booking Date</span>
                      <span className="font-medium">{booking.dateLabel}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="outline" className={bookingStatusStyles[booking.status] || ""}>{booking.status}</Badge>
                    </div>
                  </div>

                  {/* Close Button */}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setSelectedAgentBookingId(null)}
                  >
                    Close
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        );
      })()}
    </div>
  );
}
