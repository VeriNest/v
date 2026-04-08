import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  CreditCard,
  MapPin,
  Search,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchFocus } from "@/hooks/use-search-focus";

export const bookings = [
  {
    id: "BK-402",
    property: "The Maple Court",
    location: "Lekki Phase 1",
    host: "Adebayo Johnson",
    amount: "N2,500,000",
    paymentStatus: "Escrow held",
    status: "Awaiting viewing",
    dateLabel: "Viewing tomorrow, 2:00 PM",
    detail: "Annual rent booking",
  },
  {
    id: "BK-311",
    property: "Apex Studio",
    location: "Wuse 2",
    host: "Chioma Okafor",
    amount: "N1,200,000",
    paymentStatus: "Payment confirmed",
    status: "Confirmed",
    dateLabel: "Check-in Apr 14",
    detail: "Studio apartment",
  },
  {
    id: "BK-128",
    property: "Harbour View",
    location: "Victoria Island",
    host: "ShortStay NG",
    amount: "N135,000",
    paymentStatus: "Part payment made",
    status: "Pending balance",
    dateLabel: "Short-let, 3 nights",
    detail: "Serviced apartment",
  },
];

export const viewings = [
  {
    id: "VW-22",
    property: "Palm Residence A1",
    location: "Lekki Phase 1",
    host: "Bode Akin",
    amount: "N850,000",
    status: "Scheduled",
    time: "Tomorrow, 10:00 AM",
    note: "Gate code will be shared one hour before arrival.",
  },
  {
    id: "VW-09",
    property: "Admiralty Suites 4C",
    location: "Ikoyi",
    host: "Nova Realty",
    amount: "N1,450,000",
    status: "Pending confirmation",
    time: "Apr 12, 1:00 PM",
    note: "Host requested a quick call before the visit.",
  },
  {
    id: "VW-31",
    property: "Lekki Court B2",
    location: "Lekki Phase 1",
    host: "Ruth Samuel",
    amount: "Vendor visit",
    status: "Scheduled",
    time: "Apr 15, 3:30 PM",
    note: "Inspection focused on water pressure and finishing.",
  },
];

const bookingStatusStyles: Record<string, string> = {
  Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Awaiting viewing": "bg-primary/10 text-primary border-primary/20",
  "Pending balance": "bg-amber-50 text-amber-700 border-amber-200",
};

const viewingStatusStyles: Record<string, string> = {
  Scheduled: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Pending confirmation": "bg-amber-50 text-amber-700 border-amber-200",
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
  const [searchParams, setSearchParams] = useSearchParams();
  const section = searchParams.get("section") === "viewings" ? "viewings" : "bookings";
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [bookingFilter, setBookingFilter] = useState<"all" | "active" | "pending">("all");
  const [viewingFilter, setViewingFilter] = useState<"all" | "active" | "pending">("all");

  useEffect(() => {
    setSearch(searchParams.get("q") ?? "");
  }, [searchParams]);

  const normalizedQuery = search.trim().toLowerCase();

  const visibleBookings = useMemo(() => {
    const matches = bookings.filter((item) =>
      [item.property, item.location, item.host, item.amount, item.status, item.paymentStatus, item.detail].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    );

    if (bookingFilter === "active") {
      return matches.filter((item) => item.status === "Confirmed" || item.status === "Awaiting viewing");
    }
    if (bookingFilter === "pending") {
      return matches.filter((item) => item.status === "Pending balance");
    }
    return matches;
  }, [normalizedQuery, bookingFilter]);

  const visibleViewings = useMemo(() => {
    const matches = viewings.filter((item) =>
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
  }, [normalizedQuery, viewingFilter]);

  const bookingCounts = {
    all: bookings.length,
    active: bookings.filter((item) => item.status === "Confirmed" || item.status === "Awaiting viewing").length,
    pending: bookings.filter((item) => item.status === "Pending balance").length,
  };

  const viewingCounts = {
    all: viewings.length,
    active: viewings.filter((item) => item.status === "Scheduled").length,
    pending: viewings.filter((item) => item.status === "Pending confirmation").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">Bookings & Viewings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep your visits, secured bookings, and payment checkpoints in one place.
          </p>
        </div>
        <div className="relative w-full sm:w-[260px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => {
              const next = event.target.value;
              setSearch(next);
              const nextParams = new URLSearchParams(searchParams);
              if (next) nextParams.set("q", next);
              else nextParams.delete("q");
              setSearchParams(nextParams, { replace: true });
            }}
            placeholder="Search bookings or viewings..."
            className="h-9 pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Bookings", value: bookings.length, icon: Wallet, note: "secured reservations" },
          { label: "Viewings", value: viewings.length, icon: CalendarDays, note: "scheduled inspections" },
          { label: "Awaiting action", value: bookingCounts.pending + viewingCounts.pending, icon: Clock3, note: "needs follow-up" },
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

      <Tabs value={section} onValueChange={(value) => setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("section", value);
        return next;
      })} className="space-y-4">
        <TabsList className="h-auto max-w-full flex-wrap justify-start bg-muted/50 p-1">
          <TabsTrigger value="bookings" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
            Bookings
          </TabsTrigger>
          <TabsTrigger value="viewings" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
            Viewing Schedule
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-4">
          <StatusTabs counts={bookingCounts} value={bookingFilter} onValueChange={setBookingFilter} />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleBookings.map((item) => (
              <Card key={item.id} data-search-id={`seeker-booking-${item.id}`} className="border border-border/60 bg-card shadow-sm">
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
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
                      <p className="mt-1 truncate font-medium text-foreground">{item.host}</p>
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

                  <div className="rounded-xl border border-border/50 bg-secondary/15 px-3 py-2.5 text-xs text-muted-foreground">
                    {item.detail}
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-border/50 pt-3">
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
        </TabsContent>

        <TabsContent value="viewings" className="space-y-4">
          <StatusTabs counts={viewingCounts} value={viewingFilter} onValueChange={setViewingFilter} />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleViewings.map((item) => (
              <Card key={item.id} data-search-id={`seeker-viewing-${item.id}`} className="border border-border/60 bg-card shadow-sm">
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
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

                  <div className="flex items-center justify-between gap-2 border-t border-border/50 pt-3">
                    <Button variant="outline" size="sm" className="h-8 rounded-lg px-3 text-xs">
                      Get directions
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 rounded-lg px-3 text-xs">
                      Contact host
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
