import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { DashboardControlRow } from "@/components/dashboard/DashboardControlRow";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { SeekerPageSearch } from "@/components/seeker/SeekerPageSearch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchFocus } from "@/hooks/use-search-focus";
import { CalendarDays, Clock3, MapPin, ShieldCheck, Wallet } from "lucide-react";
import { seekerApi } from "@/lib/api";

const viewingStatusStyles: Record<string, string> = {
  Scheduled: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
  "Pending confirmation": "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
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

function parseViewingDate(timeLabel: string) {
  const now = new Date();

  if (timeLabel.toLowerCase().startsWith("tomorrow")) {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    return tomorrow;
  }

  const match = timeLabel.match(/^([A-Za-z]{3})\s+(\d{1,2})/);
  if (!match) {
    return now;
  }

  const monthLookup: Record<string, number> = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  const month = monthLookup[match[1]];
  const day = Number(match[2]);

  return new Date(now.getFullYear(), month, day);
}

function isSameDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function formatDayLabel(date: Date) {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function isUpcomingDate(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  return target >= today;
}

export default function SeekerViewings() {
  useSearchFocus();
  const [search, setSearch] = useState("");
  const [viewingFilter, setViewingFilter] = useState<"all" | "active" | "pending">("all");
  const { data = [] } = useQuery({
    queryKey: ["/seeker/bookings"],
    queryFn: () => seekerApi.listBookings(),
  });
  const viewings = useMemo(() => data.map((item: any) => ({
    id: item.id,
    property: item.propertyTitle ?? "Viewing",
    location: item.propertyLocation ?? "Unknown location",
    host: item.providerName ?? "Provider",
    amount: item.bookingType ?? "viewing",
    status: String(item.status ?? "pending").toLowerCase() === "confirmed" ? "Scheduled" : "Pending confirmation",
    time: item.scheduledFor ? new Date(item.scheduledFor).toLocaleString() : "Pending",
    note: item.notes ?? "No additional notes",
  })).filter((item: any) => item.amount.toLowerCase().includes("viewing") || item.status), [data]);
  const viewingDates = useMemo(() => viewings.map((item) => ({ ...item, date: parseViewingDate(item.time) })), [viewings]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(viewingDates[0]?.date);

  const normalizedQuery = search.trim().toLowerCase();

  const visibleViewings = useMemo(() => {
    const matches = viewingDates.filter((item) =>
      [item.property, item.location, item.host, item.amount, item.status, item.time, item.note].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    );

    if (viewingFilter === "active") {
      return matches.filter((item) => item.status === "Scheduled");
    }
    if (viewingFilter === "pending") {
      return matches.filter((item) => item.status === "Pending confirmation");
    }
    return matches;
  }, [normalizedQuery, viewingDates, viewingFilter]);

  const selectedDayViewings = useMemo(() => {
    if (!selectedDate) return [];
    return visibleViewings.filter((item) => isSameDay(item.date, selectedDate));
  }, [selectedDate, visibleViewings]);

  const viewingCounts = {
    all: viewings.length,
    active: viewings.filter((item) => item.status === "Scheduled").length,
    pending: viewings.filter((item) => item.status === "Pending confirmation").length,
  };

  const scheduledDates = viewingDates
    .filter((item) => item.status === "Scheduled")
    .filter((item) => isUpcomingDate(item.date))
    .map((item) => item.date);
  const pendingDates = viewingDates
    .filter((item) => item.status === "Pending confirmation")
    .filter((item) => isUpcomingDate(item.date))
    .map((item) => item.date);

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Viewing Schedule"
        description="Track your upcoming inspections, confirmations, and host notes in one place."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Upcoming visits", value: viewings.length, icon: CalendarDays, note: "scheduled inspections" },
          { label: "Confirmed", value: viewingCounts.active, icon: ShieldCheck, note: "ready to attend" },
          { label: "Pending", value: viewingCounts.pending, icon: Clock3, note: "needs follow-up" },
          { label: "Budget range", value: "N850K+", icon: Wallet, note: "across selected units" },
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

      <Tabs value={viewingFilter} className="space-y-4">
        <DashboardControlRow
          left={<StatusTabs counts={viewingCounts} value={viewingFilter} onValueChange={setViewingFilter} />}
          right={
            <>
              <div className="relative min-w-0 flex-1 lg:w-auto lg:flex-none">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <SeekerPageSearch value={search} onChange={setSearch} placeholder="Search viewings..." />
              </div>
              <Button variant="outline" size="sm" className="h-9 shrink-0 px-3 sm:px-3.5" asChild>
                <Link to="/seeker/bookings">Bookings</Link>
              </Button>
            </>
          }
        />
      </Tabs>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_320px] xl:grid-cols-[minmax(0,1.35fr)_340px]">
        <Card className="border border-border/60 bg-card shadow-sm">
          <CardContent className="space-y-4 p-4 sm:p-5">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Calendar</p>
              <h2 className="text-base font-semibold text-foreground">Inspection dates</h2>
            </div>
            <div className="w-full">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  defaultMonth={selectedDate}
                  modifiers={{
                    scheduled: scheduledDates,
                    pending: pendingDates,
                  }}
                  modifiersClassNames={{
                    scheduled: "font-semibold text-primary",
                    pending: "font-semibold text-primary",
                  }}
                  className="w-full"
                  classNames={{
                    month: "w-full space-y-4",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex w-full justify-between",
                    head_cell: "flex-1 text-center text-muted-foreground rounded-md font-normal text-[0.8rem]",
                    row: "mt-2 flex w-full justify-between",
                    cell:
                      "relative h-10 flex-1 p-0 text-center text-sm [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 focus-within:relative focus-within:z-20",
                    day: "mx-auto h-10 w-10 rounded-xl p-0 font-normal aria-selected:opacity-100",
                  }}
                />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card shadow-sm">
          <CardContent className="space-y-4 p-5">
            <div>
              <p className="text-xs text-muted-foreground">Selected date</p>
              <h2 className="mt-1 text-base font-semibold text-foreground">
                {selectedDate ? formatDayLabel(selectedDate) : "Pick a date"}
              </h2>
            </div>

            {selectedDayViewings.length > 0 ? (
              <div className="space-y-3">
                {selectedDayViewings.map((item) => (
                  <div key={item.id} className="rounded-xl border border-border/60 bg-secondary/15 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{item.property}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{item.time}</p>
                      </div>
                      <Badge variant="outline" className={`shrink-0 px-2 py-0.5 text-[10px] ${viewingStatusStyles[item.status]}`}>
                        {item.status}
                      </Badge>
                    </div>
                    <p className="mt-2 truncate text-xs text-muted-foreground">{item.location}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border/60 bg-secondary/10 px-4 py-6 text-center text-sm text-muted-foreground">
                No visits scheduled for this date.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleViewings.map((item) => (
          <Card key={item.id} data-search-id={`seeker-viewing-${item.id}`} className="border border-border/60 bg-card shadow-sm">
            <CardContent className="space-y-4 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-foreground">{item.property}</p>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>
                <Badge variant="outline" className={`shrink-0 px-2 py-0.5 text-[10px] ${viewingStatusStyles[item.status]}`}>
                  {item.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-sm">
                <div className="rounded-xl bg-secondary/20 p-3">
                  <p className="text-[11px] text-muted-foreground">Host</p>
                  <p className="mt-1 truncate font-medium text-foreground">{item.host}</p>
                </div>
                <div className="rounded-xl bg-secondary/20 p-3">
                  <p className="text-[11px] text-muted-foreground">Rent</p>
                  <p className="mt-1 font-medium text-foreground">{item.amount}</p>
                </div>
                <div className="rounded-xl bg-secondary/20 p-3">
                  <p className="text-[11px] text-muted-foreground">Time</p>
                  <p className="mt-1 truncate font-medium text-foreground">{item.time}</p>
                </div>
                <div className="rounded-xl bg-secondary/20 p-3">
                  <p className="text-[11px] text-muted-foreground">Status</p>
                  <p className="mt-1 truncate font-medium text-foreground">{item.status}</p>
                </div>
              </div>

              <div className="rounded-xl border border-border/50 bg-secondary/15 px-3 py-2.5 text-xs text-muted-foreground">
                {item.note}
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-border/50 pt-3 sm:flex sm:items-center sm:justify-between">
                <Button variant="outline" size="sm" className="h-8 w-full rounded-lg px-3 text-xs">
                  Get directions
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-full rounded-lg px-3 text-xs">
                  Contact host
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
