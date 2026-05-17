import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardControlRow } from "@/components/dashboard/DashboardControlRow";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { useSearchFocus } from "@/hooks/use-search-focus";
import { agentApi } from "@/lib/api";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function titleCase(value?: string | null) {
  if (!value) return "Pending";
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function isSameDay(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate();
}

function isBookingPassed(scheduledAt: Date | null): boolean {
  if (!scheduledAt) return false;
  const now = new Date();
  return scheduledAt < now;
}

function isBookingOneHourPast(scheduledAt: Date | null): boolean {
  if (!scheduledAt) return false;
  return Date.now() >= scheduledAt.getTime() + 60 * 60 * 1000;
}

export default function ProviderCalendar() {
  useSearchFocus();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | "upcoming" | "pending">("all");
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [scheduledFor, setScheduledFor] = useState("");
  const [comment, setComment] = useState("");
  const [outcomeBookingId, setOutcomeBookingId] = useState<string | null>(null);
  const [outcomeValue, setOutcomeValue] = useState<"completed" | "not_completed">("completed");
  const [outcomeNote, setOutcomeNote] = useState("");
  const [disputeBookingId, setDisputeBookingId] = useState<string | null>(null);
  const [disputeType, setDisputeType] = useState<"quality" | "fraud" | "cancellation" | "payment" | "listing_misrepresentation">("quality");
  const [disputeTitle, setDisputeTitle] = useState("");
  const [disputeDescription, setDisputeDescription] = useState("");
  const { data = [] } = useQuery({
    queryKey: ["/agent/bookings"],
    queryFn: () => agentApi.listBookings(),
  });

  const updateBookingMutation = useMutation({
    mutationFn: (payload: { id: string; scheduledFor?: string; notes?: string; status?: string }) =>
      agentApi.updateBooking(payload.id, {
        scheduledFor: payload.scheduledFor ? new Date(payload.scheduledFor).toISOString() : undefined,
        notes: payload.notes?.trim() || undefined,
        status: payload.status,
      }),
    onSuccess: () => {
      toast.success("Visit updated");
      setEditingBookingId(null);
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["/agent/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/agent/calendar"] });
      queryClient.invalidateQueries({ queryKey: ["/seeker/bookings"] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to update visit";
      toast.error(message);
    },
  });
  const confirmOutcomeMutation = useMutation({
    mutationFn: (payload: { id: string; outcome: "completed" | "not_completed"; note?: string }) =>
      agentApi.confirmBookingOutcome(payload.id, { outcome: payload.outcome, note: payload.note }),
    onSuccess: () => {
      toast.success("Outcome confirmed.");
      setOutcomeBookingId(null);
      setOutcomeNote("");
      queryClient.invalidateQueries({ queryKey: ["/agent/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/seeker/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/agent/calendar"] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to confirm outcome";
      toast.error(message);
    },
  });
  const createDisputeMutation = useMutation({
    mutationFn: (payload: { id: string; disputeType: string; title: string; description: string }) =>
      agentApi.createBookingDispute(payload.id, {
        disputeType: payload.disputeType,
        title: payload.title,
        description: payload.description,
      }),
    onSuccess: () => {
      toast.success("Dispute submitted.");
      setDisputeBookingId(null);
      setDisputeTitle("");
      setDisputeDescription("");
      queryClient.invalidateQueries({ queryKey: ["/agent/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/admin/disputes"] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to raise dispute";
      toast.error(message);
    },
  });

  const bookings = useMemo(
    () =>
      data
        .map((item: any) => ({
          id: String(item.id),
          property: item.propertyTitle ?? "Property",
          location: item.propertyLocation ?? "Unknown location",
          guest: item.seekerName ?? "Seeker",
          type: titleCase(item.bookingType),
          status: titleCase(item.status),
          scheduledAt: item.scheduledFor ? new Date(item.scheduledFor) : null,
          notes: item.notes ? String(item.notes) : "",
          seekerOutcome: item.seekerOutcome ?? item.seeker_outcome ?? null,
          providerOutcome: item.providerOutcome ?? item.provider_outcome ?? null,
          outcomeResolution: item.outcomeResolution ?? item.outcome_resolution ?? null,
          outcomeFollowUpRequired: Boolean(item.outcomeFollowUpRequired ?? item.outcome_follow_up_required ?? false),
          listingOutcomeApplied: Boolean(item.listingOutcomeApplied ?? item.listing_outcome_applied ?? false),
        }))
        .sort((left, right) => {
          if (!left.scheduledAt && !right.scheduledAt) return 0;
          if (!left.scheduledAt) return 1;
          if (!right.scheduledAt) return -1;
          return left.scheduledAt.getTime() - right.scheduledAt.getTime();
        }),
    [data],
  );

  const today = new Date();
  const filteredBookings = bookings.filter((booking) => {
    if (!booking.scheduledAt) return filter === "all";
    if (filter === "upcoming") return booking.scheduledAt >= today;
    if (filter === "pending") return booking.status === "Pending";
    return true;
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const selectedDayBookings = selectedDate
    ? filteredBookings.filter((booking) => booking.scheduledAt && isSameDay(booking.scheduledAt, selectedDate))
    : [];
  const displayedBookings = selectedDayBookings.length > 0 ? selectedDayBookings : filteredBookings;

  const counts = {
    all: bookings.length,
    upcoming: bookings.filter((booking) => booking.scheduledAt && booking.scheduledAt >= today).length,
    pending: bookings.filter((booking) => booking.status === "Pending").length,
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Bookings"
        description="View new site-visit schedules and booking requests from seekers."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "All bookings", value: counts.all, icon: CalendarDays, note: "total schedules" },
          { label: "Upcoming", value: counts.upcoming, icon: Clock, note: "future visits" },
          { label: "Pending", value: counts.pending, icon: Users, note: "needs attention" },
          { label: "Today", value: selectedDayBookings.length, icon: MapPin, note: "selected date" },
        ].map((item) => (
          <Card key={item.label} className="border border-border/60 shadow-sm">
            <CardContent className="flex items-start gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-xl font-bold text-foreground">{item.value}</p>
                <p className="text-[11px] text-muted-foreground">{item.note}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={filter} className="space-y-4">
        <DashboardControlRow
          left={
            <TabsList className="h-auto max-w-full flex-wrap justify-start bg-muted/50 p-1">
              <TabsTrigger value="all" onClick={() => setFilter("all")} className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
                All ({counts.all})
              </TabsTrigger>
              <TabsTrigger value="upcoming" onClick={() => setFilter("upcoming")} className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Upcoming ({counts.upcoming})
              </TabsTrigger>
              <TabsTrigger value="pending" onClick={() => setFilter("pending")} className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Pending ({counts.pending})
              </TabsTrigger>
            </TabsList>
          }
        />
      </Tabs>

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="border border-border/60 shadow-sm">
          <CardContent className="p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{ scheduled: filteredBookings.filter((booking) => booking.scheduledAt).map((booking) => booking.scheduledAt as Date) }}
              modifiersClassNames={{ scheduled: "font-semibold text-primary" }}
              className="w-full"
            />
          </CardContent>
        </Card>

        <div className="space-y-3">
          {displayedBookings.length === 0 ? (
            <Card className="border border-border/60 shadow-sm">
              <CardContent className="p-5 text-sm text-muted-foreground">
                No bookings are available for this filter yet.
              </CardContent>
            </Card>
          ) : (
            <>
              {selectedDayBookings.length === 0 ? (
                <Card className="border border-border/60 shadow-sm">
                  <CardContent className="p-4 text-sm text-muted-foreground">
                    No bookings fall on the selected date. Showing all filtered bookings instead.
                  </CardContent>
                </Card>
              ) : null}
              {displayedBookings.map((booking) => (
              <Card key={booking.id} className="border border-border/60 shadow-sm">
                <CardContent className="space-y-4 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-foreground">{booking.property}</p>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{booking.location}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="px-2 py-0.5 text-[10px]">
                      {booking.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <div className="rounded-xl bg-secondary/20 p-3">
                      <p className="text-[11px] text-muted-foreground">Seeker</p>
                      <p className="mt-1 text-sm font-medium text-foreground">{booking.guest}</p>
                    </div>
                    <div className="rounded-xl bg-secondary/20 p-3">
                      <p className="text-[11px] text-muted-foreground">Type</p>
                      <p className="mt-1 text-sm font-medium text-foreground">{booking.type}</p>
                    </div>
                    <div className="rounded-xl bg-secondary/20 p-3">
                      <p className="text-[11px] text-muted-foreground">Time</p>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {booking.scheduledAt ? booking.scheduledAt.toLocaleString() : "Pending"}
                      </p>
                    </div>
                  </div>

                  {booking.notes ? (
                    <div className="rounded-xl border border-border/60 bg-secondary/15 px-3 py-2 text-sm text-muted-foreground">
                      {booking.notes}
                    </div>
                  ) : null}

                  {booking.outcomeResolution ? (
                    <div className={`rounded-xl border px-3 py-2.5 text-xs ${
                      booking.outcomeResolution === "conflict"
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-700"
                        : "border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
                    }`}>
                      {booking.outcomeResolution === "conflict"
                        ? "Outcome conflict flagged for admin follow-up."
                        : booking.listingOutcomeApplied
                          ? "Outcome aligned and availability has been updated."
                          : "Outcome aligned and recorded."}
                    </div>
                  ) : null}

                  {editingBookingId === booking.id ? (
                    <div className="space-y-3 rounded-xl border border-primary/20 bg-primary/5 p-3">
                      <Input
                        type="datetime-local"
                        value={scheduledFor}
                        onChange={(event) => setScheduledFor(event.target.value)}
                      />
                      <Textarea
                        rows={3}
                        placeholder="Add meetup location or reschedule note"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          disabled={updateBookingMutation.isPending}
                          onClick={() =>
                            updateBookingMutation.mutate({
                              id: booking.id,
                              scheduledFor: scheduledFor || undefined,
                              notes: comment,
                              status: "confirmed",
                            })
                          }
                        >
                          Confirm & save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingBookingId(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {isBookingPassed(booking.scheduledAt) ? (
                        <>
                          {booking.status === "Confirmed" && isBookingOneHourPast(booking.scheduledAt) && booking.seekerOutcome && !booking.providerOutcome ? (
                            <Button
                              size="sm"
                              onClick={() => {
                                setOutcomeBookingId(booking.id);
                                setOutcomeValue(booking.seekerOutcome === "completed" ? "completed" : "not_completed");
                                setOutcomeNote("");
                              }}
                            >
                              Confirm outcome
                            </Button>
                          ) : null}
                          {booking.status === "Confirmed" && isBookingOneHourPast(booking.scheduledAt) ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setDisputeBookingId(booking.id);
                                setDisputeType("quality");
                                setDisputeTitle(`Dispute for ${booking.property}`);
                                setDisputeDescription("");
                              }}
                            >
                              Raise dispute
                            </Button>
                          ) : null}
                          {booking.status === "Confirmed" && !isBookingOneHourPast(booking.scheduledAt) ? (
                            <div className="text-xs text-muted-foreground">
                              Outcome and dispute actions appear one hour after the scheduled visit time.
                            </div>
                          ) : null}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingBookingId(booking.id);
                              setScheduledFor(
                                booking.scheduledAt
                                  ? new Date(booking.scheduledAt.getTime() - booking.scheduledAt.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
                                  : "",
                              );
                              setComment("");
                            }}
                          >
                            Reschedule
                          </Button>
                        </>
                      ) : (
                        <>
                          {booking.status !== "Confirmed" ? (
                            <Button
                              size="sm"
                              onClick={() =>
                                updateBookingMutation.mutate({
                                  id: booking.id,
                                  status: "confirmed",
                                })
                              }
                              disabled={updateBookingMutation.isPending}
                            >
                              Accept visit
                            </Button>
                          ) : null}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingBookingId(booking.id);
                              setScheduledFor(
                                booking.scheduledAt
                                  ? new Date(booking.scheduledAt.getTime() - booking.scheduledAt.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
                                  : "",
                              );
                              setComment("");
                            }}
                          >
                            Reschedule / add meetup note
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              ))}
            </>
          )}
        </div>
      </div>

      {outcomeBookingId && (() => {
        const booking = bookings.find((item) => item.id === outcomeBookingId);
        return (
          <Dialog open={!!outcomeBookingId} onOpenChange={(open) => !open && setOutcomeBookingId(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Confirm Booking Outcome</DialogTitle>
                <DialogDescription>
                  Confirm whether this seeker actually took the property after the booking.
                </DialogDescription>
              </DialogHeader>
              {booking ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-border/50 bg-secondary/15 p-3">
                    <p className="text-xs text-muted-foreground">Booking</p>
                    <p className="mt-1 font-medium">{booking.property}</p>
                    <p className="text-xs text-muted-foreground">{booking.guest} · {booking.scheduledAt ? booking.scheduledAt.toLocaleString() : "Pending"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant={outcomeValue === "completed" ? "default" : "outline"} onClick={() => setOutcomeValue("completed")}>
                      Yes, taken
                    </Button>
                    <Button variant={outcomeValue === "not_completed" ? "default" : "outline"} onClick={() => setOutcomeValue("not_completed")}>
                      No, not taken
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Note (optional)</label>
                    <Textarea value={outcomeNote} onChange={(e) => setOutcomeNote(e.target.value)} className="min-h-24" />
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
                      {confirmOutcomeMutation.isPending ? "Saving..." : "Submit Outcome"}
                    </Button>
                  </div>
                </div>
              ) : null}
            </DialogContent>
          </Dialog>
        );
      })()}

      {disputeBookingId && (() => {
        const booking = bookings.find((item) => item.id === disputeBookingId);
        return (
          <Dialog open={!!disputeBookingId} onOpenChange={(open) => !open && setDisputeBookingId(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Raise Dispute</DialogTitle>
                <DialogDescription>
                  Open a dispute against the seeker for this confirmed visit. Admin will review the case.
                </DialogDescription>
              </DialogHeader>
              {booking ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-border/50 bg-secondary/15 p-3">
                    <p className="text-xs text-muted-foreground">Booking</p>
                    <p className="mt-1 font-medium">{booking.property}</p>
                    <p className="text-xs text-muted-foreground">{booking.guest} · {booking.scheduledAt ? booking.scheduledAt.toLocaleString() : "Pending"}</p>
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
                    <Textarea value={disputeDescription} onChange={(e) => setDisputeDescription(e.target.value)} className="min-h-28" placeholder="Explain the issue with this confirmed visit." />
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
                      {createDisputeMutation.isPending ? "Saving..." : "Submit Dispute"}
                    </Button>
                  </div>
                </div>
              ) : null}
            </DialogContent>
          </Dialog>
        );
      })()}
    </div>
  );
}
