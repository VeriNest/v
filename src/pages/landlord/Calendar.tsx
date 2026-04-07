import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, ArrowRight, Clock, ChevronLeft, ChevronRight, MapPin, Home, Users, TrendingUp, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 12 }, (_, i) => {
  const h = i + 7;
  return h <= 12 ? `${h}:00 AM` : `${h - 12}:00 PM`;
});

const events = [
  { day: 0, startHour: 3, duration: 2, guest: "Palm Residence A1", property: "Rent follow-up", status: "Scheduled" },
  { day: 2, startHour: 1, duration: 3, guest: "Admiralty Suites 4C", property: "Corporate renewal review", status: "Pending" },
  { day: 4, startHour: 5, duration: 2, guest: "Lekki Court B2", property: "Ceiling inspection", status: "Scheduled" },
  { day: 5, startHour: 2, duration: 4, guest: "Portfolio Wide", property: "Ownership docs audit", status: "Scheduled" },
  { day: 1, startHour: 7, duration: 2, guest: "Palm Residence B3", property: "Lease exit walkthrough", status: "Scheduled" },
];

const upcomingEvents = [
  { id: 1, guest: "Palm Residence A1", property: "Victoria Island", checkIn: "Apr 08", checkOut: "Apr 08", nights: 1, amount: "N850,000", status: "Scheduled", initials: "PA", avatar: "bg-emerald-100 text-emerald-700" },
  { id: 2, guest: "Admiralty Suites 4C", property: "Ikoyi", checkIn: "Apr 12", checkOut: "Apr 12", nights: 1, amount: "N1,450,000", status: "Pending", initials: "AS", avatar: "bg-amber-100 text-amber-700" },
  { id: 3, guest: "Lekki Court B2", property: "Lekki Phase 1", checkIn: "Apr 15", checkOut: "Apr 15", nights: 1, amount: "Vendor Visit", status: "Scheduled", initials: "LC", avatar: "bg-primary/10 text-primary" },
  { id: 4, guest: "Palm Residence B3", property: "Victoria Island", checkIn: "Apr 18", checkOut: "Apr 18", nights: 1, amount: "Exit review", status: "Scheduled", initials: "PB", avatar: "bg-violet-100 text-violet-700" },
];

const statusConfig: Record<string, { label: string; className: string; dot: string }> = {
  Scheduled: { label: "Scheduled", className: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  Pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
};

const stats = [
  { label: "This Week", value: "5", sub: "portfolio events", icon: CalendarDays, accent: "text-primary", iconBg: "bg-primary/10" },
  { label: "Scheduled", value: "4", sub: "confirmed actions", icon: Users, accent: "text-emerald-600", iconBg: "bg-emerald-50" },
  { label: "Pending", value: "1", sub: "needs review", icon: Clock, accent: "text-amber-600", iconBg: "bg-amber-50" },
  { label: "Collections", value: "N2.3M", sub: "in tracked actions", icon: TrendingUp, accent: "text-foreground", iconBg: "bg-muted" },
];

export default function LandlordCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage rent follow-ups, lease reviews, inspections, and portfolio operations</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-full text-sm sm:w-[160px]">
              <Filter className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="All Properties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              <SelectItem value="palm">Palm Residence</SelectItem>
              <SelectItem value="admiralty">Admiralty Suites</SelectItem>
              <SelectItem value="lekki">Lekki Court</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center justify-between gap-1 rounded-lg bg-muted/50 p-1 sm:justify-start">
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-sm font-medium text-foreground">Apr 08 - 14, 2026</span>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border border-border/60 shadow-sm">
            <CardContent className="flex items-start gap-3 p-4">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${s.iconBg}`}>
                <s.icon className={`h-4 w-4 ${s.accent}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                <p className={`text-xl font-bold leading-tight ${s.accent}`}>{s.value}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{s.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="week" className="space-y-4">
        <TabsList className="h-auto max-w-full flex-wrap justify-start bg-muted/50 p-1">
          <TabsTrigger value="week" className="gap-1.5 px-4 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <CalendarDays className="h-3.5 w-3.5" /> Week View
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="gap-1.5 px-4 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Clock className="h-3.5 w-3.5" /> Upcoming
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px] font-semibold">{upcomingEvents.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="week">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_280px]">
            <Card className="overflow-hidden border border-border/60 shadow-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <div className="grid min-w-[700px] grid-cols-8">
                    <div className="sticky left-0 z-10 border-b border-border/60 bg-muted/40 px-3 py-3 text-xs font-semibold text-muted-foreground">
                      Time
                    </div>
                    {days.map((d, i) => (
                      <div key={d} className={`border-b border-l border-border/60 px-3 py-3 text-center text-xs font-semibold ${i === new Date().getDay() - 1 ? "bg-primary/5 text-primary" : "bg-muted/40 text-muted-foreground"}`}>
                        <span className="block">{d}</span>
                        <span className={`mt-0.5 block text-lg font-bold ${i === new Date().getDay() - 1 ? "text-primary" : "text-foreground"}`}>{8 + i}</span>
                      </div>
                    ))}

                    {hours.map((hour, hi) => (
                      <div key={`row-${hi}`} className="contents">
                        <div className="sticky left-0 z-10 flex items-start border-t border-border/40 bg-background px-3 py-2 pt-2.5 text-[11px] text-muted-foreground">
                          {hour}
                        </div>
                        {days.map((_, di) => {
                          const event = events.find((b) => b.day === di && b.startHour === hi);
                          const isToday = di === new Date().getDay() - 1;
                          return (
                            <div
                              key={`${di}-${hi}`}
                              className={`relative min-h-[44px] cursor-pointer border-l border-t border-border/40 transition-colors ${
                                isToday ? "bg-primary/[0.02]" : "bg-background"
                              }`}
                            >
                              {event ? (
                                <div
                                  className={`absolute inset-x-1 top-1 rounded-md border px-2 py-1.5 text-xs ${
                                    event.status === "Scheduled"
                                      ? "border-primary/20 bg-primary/10 text-primary"
                                      : "border-amber-200 bg-amber-50 text-amber-700"
                                  }`}
                                  style={{ height: `${event.duration * 44 - 4}px`, zIndex: 2 }}
                                >
                                  <p className="truncate text-[11px] font-semibold leading-tight">{event.guest}</p>
                                  <p className="mt-0.5 flex items-center gap-0.5 truncate text-[10px] opacity-70">
                                    <Home className="h-2.5 w-2.5" />
                                    {event.property}
                                  </p>
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="border border-border/60 shadow-sm">
                <CardContent className="p-3">
                  <Calendar mode="single" selected={date} onSelect={setDate} className="w-full" />
                </CardContent>
              </Card>

              <Card className="border border-border/60 shadow-sm">
                <CardContent className="space-y-3 p-4">
                  <h3 className="text-sm font-semibold text-foreground">Today's Schedule</h3>
                  {[
                    { time: "10:00 AM", guest: "Palm Residence A1", type: "Rent follow-up", color: "bg-emerald-500" },
                    { time: "2:00 PM", guest: "Lekki Court B2", type: "Inspection visit", color: "bg-primary" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 rounded-lg bg-muted/30 p-2">
                      <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${item.color}`} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-foreground">{item.guest}</p>
                        <p className="text-[10px] text-muted-foreground">{item.time} · {item.type}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-3">
          {upcomingEvents.map((b) => {
            const s = statusConfig[b.status];
            return (
              <Card key={b.id} className="border border-border/60 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="h-10 w-10 shrink-0 border border-border/60">
                        <AvatarFallback className={`text-xs font-semibold ${b.avatar}`}>{b.initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{b.guest}</p>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{b.property}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:flex-row sm:justify-end sm:gap-4">
                      <div className="hidden text-right sm:block">
                        <p className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                          {b.checkIn} <ArrowRight className="h-3 w-3" /> {b.checkOut}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">{b.nights} event{b.nights > 1 ? "s" : ""}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${s.className}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                      </span>
                      <p className="text-right text-sm font-bold text-foreground sm:min-w-[80px]">{b.amount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
