import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  Search,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { DashboardControlRow } from "@/components/dashboard/DashboardControlRow";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { SeekerPageSearch } from "@/components/seeker/SeekerPageSearch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchFocus } from "@/hooks/use-search-focus";
import { formatCompactCurrency, seekerApi } from "@/lib/api";

function titleForStatus(value?: string) {
  if (!value) return "Pending";
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function titleForBookingType(value?: string) {
  if (!value) return "Booking";
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
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
  const [search, setSearch] = useState("");
  const [bookingFilter, setBookingFilter] = useState<"all" | "active" | "pending">("all");
  const { data = [] } = useQuery({
    queryKey: ["/seeker/bookings"],
    queryFn: () => seekerApi.listBookings(),
  });
  const bookings = useMemo(() => data.map((item: any, index: number) => ({
    id: item.id ?? `BK-${index + 1}`,
    property: item.propertyTitle ?? "Property booking",
    location: item.propertyLocation ?? "Unknown location",
    host: item.providerName ?? "Provider",
    hostPhone: item.providerPhone ?? "",
    hostAvatarUrl: item.providerAvatarUrl ?? null,
    amount: formatCompactCurrency(Number(item.amount ?? 0)),
    paymentStatus: titleForStatus(item.status),
    status: titleForStatus(item.status),
    dateLabel: item.scheduledFor ? new Date(item.scheduledFor).toLocaleString() : "Schedule pending",
    detail: titleForBookingType(item.bookingType),
    initials: String(item.providerName ?? "PR").split(" ").map((part: string) => part[0]).join("").slice(0, 2) || "PR",
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

              <div className="flex flex-col gap-2 border-t border-border/50 pt-3 sm:flex-row sm:items-center sm:justify-between">
                <Button variant="outline" size="sm" className="h-8 rounded-lg px-3 text-xs">
                  Open booking
                </Button>
                <Button variant="ghost" size="sm" className="h-8 rounded-lg px-3 text-xs" asChild>
                  <Link to="/seeker/offers">
                    Review offer <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
