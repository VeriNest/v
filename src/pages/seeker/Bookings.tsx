import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Building2,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Eye,
  Lock,
  MapPin,
  MessageSquare,
  Navigation,
  Search,
  Wallet,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type Booking = {
  id: string;
  property: string;
  provider: string;
  amount: string;
  status: "Escrow" | "Confirmed" | "Completed" | "Cancelled";
  stage: string;
  date: string;
  daysLeft: number;
};

type Viewing = {
  id: string;
  property: string;
  host: string;
  address: string;
  slot: string;
  status: "Confirmed" | "Pending" | "Completed" | "Cancelled";
  paymentState: string;
  note: string;
};

export const bookings: Booking[] = [
  { id: "BK-001", property: "3 Bed Flat, Lekki Phase 1", provider: "Adebayo Johnson", amount: "NGN 2,500,000", status: "Escrow", stage: "Awaiting Viewing", date: "Mar 20, 2024", daysLeft: 5 },
  { id: "BK-002", property: "2 Bed Serviced, Victoria Island", provider: "ShortStay NG", amount: "NGN 135,000", status: "Confirmed", stage: "Check-in Mar 22", date: "Mar 18, 2024", daysLeft: 2 },
  { id: "BK-003", property: "Studio, Wuse 2 Abuja", provider: "Chioma Okafor", amount: "NGN 1,200,000", status: "Completed", stage: "Moved In", date: "Feb 15, 2024", daysLeft: 0 },
  { id: "BK-004", property: "1 Bed, Garki Area 11", provider: "Abuja Rentals", amount: "NGN 850,000", status: "Cancelled", stage: "Refund Processed", date: "Jan 10, 2024", daysLeft: 0 },
];

export const viewings: Viewing[] = [
  {
    id: "VW-101",
    property: "Palm Residence A1",
    host: "Bode Akin",
    address: "12 Admiralty Way, Lekki Phase 1",
    slot: "Tomorrow, 2:00 PM",
    status: "Confirmed",
    paymentState: "Escrow hold in place",
    note: "Bring a valid ID for gate access.",
  },
  {
    id: "VW-102",
    property: "Admiralty Suites 4C",
    host: "Chioma Okafor",
    address: "5 Bisola Durosinmi Etti, Victoria Island",
    slot: "Friday, 11:30 AM",
    status: "Pending",
    paymentState: "No payment required yet",
    note: "Host confirmation pending.",
  },
  {
    id: "VW-103",
    property: "Lekki Court B2",
    host: "Amber Foods Realty",
    address: "Lekki Phase 1, Lagos",
    slot: "Mar 12, 10:00 AM",
    status: "Completed",
    paymentState: "Offer comparison open",
    note: "Viewing completed. Decide before Mar 18.",
  },
];

const bookingStatusConfig = {
  Escrow: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Lock },
  Confirmed: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
  Completed: { color: "text-muted-foreground", bg: "bg-muted border-border", icon: CheckCircle2 },
  Cancelled: { color: "text-destructive", bg: "bg-destructive/5 border-destructive/20", icon: XCircle },
} satisfies Record<Booking["status"], { color: string; bg: string; icon: typeof Lock }>;

const viewingStatusConfig = {
  Confirmed: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: CalendarCheck },
  Pending: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Clock },
  Completed: { color: "text-muted-foreground", bg: "bg-muted border-border", icon: CheckCircle2 },
  Cancelled: { color: "text-destructive", bg: "bg-destructive/5 border-destructive/20", icon: XCircle },
} satisfies Record<Viewing["status"], { color: string; bg: string; icon: typeof Clock }>;

export default function Bookings() {
  const [search, setSearch] = useState("");
  const [params, setParams] = useSearchParams();
  const section = params.get("section") === "viewings" ? "viewings" : "bookings";

  const bookingResults = useMemo(() => {
    const filtered = bookings.filter((item) =>
      [item.property, item.provider, item.status, item.stage].some((value) =>
        value.toLowerCase().includes(search.toLowerCase()),
      ),
    );

    return {
      all: filtered,
      active: filtered.filter((item) => item.status === "Escrow" || item.status === "Confirmed"),
      past: filtered.filter((item) => item.status === "Completed" || item.status === "Cancelled"),
    };
  }, [search]);

  const viewingResults = useMemo(() => {
    const filtered = viewings.filter((item) =>
      [item.property, item.host, item.address, item.status, item.slot].some((value) =>
        value.toLowerCase().includes(search.toLowerCase()),
      ),
    );

    return {
      upcoming: filtered.filter((item) => item.status === "Confirmed"),
      pending: filtered.filter((item) => item.status === "Pending"),
      past: filtered.filter((item) => item.status === "Completed" || item.status === "Cancelled"),
      all: filtered,
    };
  }, [search]);

  const updateSection = (next: "bookings" | "viewings") => {
    const nextParams = new URLSearchParams(params);
    nextParams.set("section", next);
    setParams(nextParams);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">Bookings & Viewings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage viewing appointments, escrow-linked bookings, and completed stays from one place.
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={section === "viewings" ? "Search viewings..." : "Search bookings..."}
            className="h-9 w-full pl-9 sm:w-[220px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={section} onValueChange={(value) => updateSection(value as "bookings" | "viewings")} className="space-y-5">
        <TabsList className="h-auto bg-muted/50 p-1">
          <TabsTrigger value="bookings" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
            Bookings
          </TabsTrigger>
          <TabsTrigger value="viewings" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
            Viewing Schedule
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Active", value: bookingResults.active.length.toString(), icon: CalendarCheck, accent: "text-primary", bg: "bg-primary/10" },
              { label: "In Escrow", value: "NGN 2.5M", icon: Lock, accent: "text-amber-600", bg: "bg-amber-500/10" },
              { label: "Completed", value: bookingResults.past.filter((b) => b.status === "Completed").length.toString(), icon: CheckCircle2, accent: "text-emerald-600", bg: "bg-emerald-500/10" },
              { label: "Total Spent", value: "NGN 3.8M", icon: Wallet, accent: "text-foreground", bg: "bg-muted" },
            ].map((stat) => (
              <Card key={stat.label} className="border border-border/60 shadow-sm">
                <CardContent className="flex items-start gap-3 p-4">
                  <div className={cn("shrink-0 rounded-lg p-2", stat.bg)}>
                    <stat.icon className={cn("h-4 w-4", stat.accent)} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className={cn("text-lg font-bold", stat.accent)}>{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground">Booking tracker</h2>
            <p className="text-xs text-muted-foreground">
              Compact cards for escrow bookings, confirmed stays, and completed rentals.
            </p>
          </div>

          <StatusTabs
            values={[
              { key: "active", label: `Active (${bookingResults.active.length})` },
              { key: "past", label: `Past (${bookingResults.past.length})` },
              { key: "all", label: `All (${bookingResults.all.length})` },
            ]}
          >
            {(tab) => {
              const items =
                tab === "active"
                  ? bookingResults.active
                  : tab === "past"
                    ? bookingResults.past
                    : bookingResults.all;

              return (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {items.map((item) => {
                    const config = bookingStatusConfig[item.status];
                    const StatusIcon = config.icon;

                    return (
                      <Card key={item.id} className="group overflow-hidden border border-border/50 bg-gradient-to-br from-background via-background to-muted/20 shadow-sm">
                        <CardContent className="space-y-4 p-4 sm:p-5">
                          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-sm font-semibold text-foreground">{item.property}</h3>
                                <Badge variant="outline" className={cn("border text-[11px]", config.bg, config.color)}>
                                  <StatusIcon className="mr-1 h-3 w-3" />
                                  {item.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">Host: {item.provider}</p>
                              <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                  <Clock className="h-3.5 w-3.5" /> {item.stage}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <CalendarCheck className="h-3.5 w-3.5" /> {item.date}
                                </span>
                              </div>
                            </div>

                            <div className="rounded-2xl border border-border/60 bg-background/80 px-3 py-2 text-xs text-muted-foreground shadow-sm backdrop-blur">
                              <p className="font-medium text-foreground">Amount</p>
                              <p className="mt-1 text-sm font-semibold text-foreground">{item.amount}</p>
                            </div>
                          </div>

                          <div className="rounded-2xl border border-border/60 bg-muted/40 px-3 py-3 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">{item.id}</span>
                            <span className="mx-2 text-border">•</span>
                            {item.daysLeft > 0 ? `${item.daysLeft} days left before the next booking milestone.` : "This booking flow is closed."}
                          </div>

                          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                            <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
                              <Eye className="h-3.5 w-3.5" /> View booking
                            </Button>
                            <Button variant="ghost" size="sm" className="justify-start gap-1.5 rounded-full text-primary sm:justify-center">
                              Payment details
                            </Button>
                            <Button variant="ghost" size="sm" className="justify-start gap-1.5 rounded-full text-muted-foreground sm:justify-center">
                              Help
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              );
            }}
          </StatusTabs>
        </TabsContent>

        <TabsContent value="viewings" className="space-y-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Upcoming", value: viewingResults.upcoming.length.toString(), icon: CalendarCheck, accent: "text-primary", bg: "bg-primary/10" },
              { label: "Pending", value: viewingResults.pending.length.toString(), icon: Clock, accent: "text-amber-600", bg: "bg-amber-500/10" },
              { label: "Past", value: viewingResults.past.length.toString(), icon: CheckCircle2, accent: "text-foreground", bg: "bg-muted" },
              { label: "This Week", value: "2", icon: MapPin, accent: "text-emerald-600", bg: "bg-emerald-500/10" },
            ].map((stat) => (
              <Card key={stat.label} className="border border-border/60 shadow-sm">
                <CardContent className="flex items-start gap-3 p-4">
                  <div className={cn("shrink-0 rounded-lg p-2", stat.bg)}>
                    <stat.icon className={cn("h-4 w-4", stat.accent)} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className={cn("text-lg font-bold", stat.accent)}>{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground">Viewing schedule</h2>
            <p className="text-xs text-muted-foreground">
              Compact cards for upcoming visits, confirmations, and completed tours.
            </p>
          </div>

          <StatusTabs
            values={[
              { key: "upcoming", label: `Upcoming (${viewingResults.upcoming.length})` },
              { key: "pending", label: `Pending (${viewingResults.pending.length})` },
              { key: "past", label: `Past (${viewingResults.past.length})` },
              { key: "all", label: `All (${viewingResults.all.length})` },
            ]}
          >
            {(tab) => {
              const items =
                tab === "upcoming"
                  ? viewingResults.upcoming
                  : tab === "pending"
                    ? viewingResults.pending
                    : tab === "past"
                      ? viewingResults.past
                      : viewingResults.all;

              return (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {items.map((item) => {
                    const config = viewingStatusConfig[item.status];
                    const StatusIcon = config.icon;

                    return (
                      <Card key={item.id} className="overflow-hidden border border-border/50 bg-gradient-to-br from-background via-background to-muted/20 shadow-sm">
                        <CardContent className="space-y-4 p-4 sm:p-5">
                          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-sm font-semibold text-foreground">{item.property}</h3>
                                <Badge variant="outline" className={cn("border text-[11px]", config.bg, config.color)}>
                                  <StatusIcon className="mr-1 h-3 w-3" />
                                  {item.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">Host: {item.host}</p>
                              <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {item.slot}</span>
                                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {item.address}</span>
                              </div>
                            </div>

                            <div className="rounded-2xl border border-border/60 bg-background/80 px-3 py-2 text-xs text-muted-foreground shadow-sm backdrop-blur">
                              <p className="font-medium text-foreground">Payment</p>
                              <p className="mt-1">{item.paymentState}</p>
                            </div>
                          </div>

                          <div className="rounded-2xl border border-border/60 bg-muted/40 px-3 py-3 text-xs text-muted-foreground">
                            {item.note}
                          </div>

                          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                            <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
                              <MessageSquare className="h-3.5 w-3.5" /> Message host
                            </Button>
                            <Button variant="ghost" size="sm" className="justify-start gap-1.5 rounded-full text-primary sm:justify-center">
                              Reschedule
                            </Button>
                            <Button variant="ghost" size="sm" className="justify-start gap-1.5 rounded-full text-muted-foreground sm:justify-center">
                              Cancel
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              );
            }}
          </StatusTabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatusTabs({
  values,
  children,
}: {
  values: { key: string; label: string }[];
  children: (tab: string) => React.ReactNode;
}) {
  return (
    <Tabs defaultValue={values[0].key} className="space-y-4">
      <TabsList className="h-auto bg-muted/50 p-1">
        {values.map((item) => (
          <TabsTrigger key={item.key} value={item.key} className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {values.map((item) => (
        <TabsContent key={item.key} value={item.key} className="space-y-3">
          {children(item.key)}
        </TabsContent>
      ))}
    </Tabs>
  );
}
