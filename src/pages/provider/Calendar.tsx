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

function titleCase(value?: string | null) {
  if (!value) return "Pending";
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function isSameDay(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate();
}

export default function ProviderCalendar() {
  useSearchFocus();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | "upcoming" | "pending">("all");
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [scheduledFor, setScheduledFor] = useState("");
  const [comment, setComment] = useState("");
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
                    </div>
                  )}
                </CardContent>
              </Card>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
